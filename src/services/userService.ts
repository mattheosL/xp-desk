import type { AuthResponse, AuthUser, ChangePasswordInput, UpdateUserInput } from '../types/user';
import { request } from './api';


export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const data = await request<AuthResponse>(
    '/api/v1/auth/login',
    { method: 'POST', body: JSON.stringify(input) },
    false,
  );

  if (!data?.id || !data.accessToken) {
    throw new Error('O backend autenticou, mas não devolveu os dados esperados.');
  }

  return data;
}

export async function createUser(input: {
  username: string;
  email: string;
  password: string;
}): Promise<{ id: string }> {
  const created = await request<{ id: string | number }>(
    '/api/v1/users',
    { method: 'POST', body: JSON.stringify(input) },
    false,
  );

  if (created?.id === undefined || created.id === null || String(created.id).trim() === '') {
    throw new Error('O backend criou a conta, mas não devolveu um identificador.');
  }

  return { id: String(created.id) };
}

// ── User management ──

export async function updateUser(
  userId: string,
  input: UpdateUserInput,
): Promise<{ id: string }> {
  return request<{ id: string }>(`/api/v1/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function changePassword(
  userId: string,
  input: ChangePasswordInput,
): Promise<{ id: string }> {
  return request<{ id: string }>(`/api/v1/users/${userId}/password`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function activateUser(userId: string): Promise<{ id: string }> {
  return request<{ id: string }>(`/api/v1/users/${userId}/active`, {
    method: 'PATCH',
  });
}

export function sessionToUser(response: AuthResponse): AuthUser {
  return {
    id: String(response.id),
    username: response.username,
    email: response.email,
  };
}
