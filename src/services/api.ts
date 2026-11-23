import {
  readAccessToken,
  readRefreshToken,
  writeAccessToken,
  writeRefreshToken,
  clearSession,
} from '../utils/storage';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
// ── Config ──

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

// ── Helpers ──

function messageFromBody(body: string, status: number): string {
  if (!body) {
    return `A API retornou HTTP ${status}.`;
  }

  try {
    const parsed: unknown = JSON.parse(body);
    if (typeof parsed === 'string' && parsed.trim()) {
      return parsed;
    }
    if (parsed && typeof parsed === 'object') {
      const record = parsed as Record<string, unknown>;
      const candidate = record.message ?? record.error ?? record.detail;
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate;
      }
      const firstString = Object.values(record).find(
        (value) => typeof value === 'string' && value.trim(),
      );
      if (typeof firstString === 'string') {
        return firstString;
      }
    }
  } catch {
    if (body.trim()) {
      return body.trim();
    }
  }

  return `A API retornou HTTP ${status}.`;
}

// ── Token refresh with deduplication ──

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = readRefreshToken();
  if (!refreshToken) {
    throw new ApiError('Sessão expirada. Faça login novamente.', 401);
  }

  const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearSession();
    throw new ApiError('Sessão expirada. Faça login novamente.', 401);
  }

  const data = (await response.json()) as {
    accessToken: string;
    refreshToken: string;
  };

  writeAccessToken(data.accessToken);
  writeRefreshToken(data.refreshToken);
  return data.accessToken;
}

/**
 * Ensures only one refresh request runs at a time.
 * Concurrent callers share the same promise.
 */
function refreshOnce(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// ── Main request function ──

export async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = readAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Confirme se o backend está ativo.',
      0,
    );
  }

  // If 401 and we have a refresh token, try to refresh once and retry
  if (response.status === 401 && auth && readRefreshToken()) {
    try {
      const newToken = await refreshOnce();
      headers.set('Authorization', `Bearer ${newToken}`);
      response = await fetch(`${API_URL}${path}`, { ...options, headers });
    } catch {
      clearSession();
      window.dispatchEvent(new CustomEvent('auth:expired'));
      throw new ApiError('Sessão expirada. Faça login novamente.', 401);
    }
  }

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(messageFromBody(body, response.status), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** Prefixo das rotas da API. Em desenvolvimento o Vite faz proxy de /api para o backend. */
export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? '/api/v1';

/** Host exibido na barra de status (ex.: localhost:8080). */
export const API_HOST_LABEL: string = import.meta.env.VITE_API_HOST ?? 'localhost:8080';

const REQUEST_TIMEOUT_MS = 4000;


interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  userId?: string;
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Requisição JSON para a API. A API ainda não usa JWT: o usuário é identificado
 * pelo header X-User-Id (UUID).
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', userId, body, signal } = options;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  signal?.addEventListener('abort', () => controller.abort());

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (userId) headers['X-User-Id'] = userId;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiError(`A API respondeu ${response.status}.`, response.status);
    }

    if (response.status === 204) return undefined as T;


    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Não foi possível conectar à API.');
  } finally {
    window.clearTimeout(timeout);
  }
}
