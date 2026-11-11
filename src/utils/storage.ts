import type { AuthUser, StoredUser } from '../types/user';

const USERS_KEY = 'kanban-sprint1-users';
const SESSION_KEY = 'kanban-sprint1-session';

export function readStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

export function writeStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function readSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'id' in parsed &&
      'username' in parsed &&
      'email' in parsed
    ) {
      return parsed as AuthUser;
    }
    return null;
  } catch {
    return null;
  }
}

export function writeSession(user: AuthUser): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export async function hashPassword(password: string): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Este navegador não oferece o recurso necessário para a demonstração. Abra a aplicação em localhost ou HTTPS.');
  }

  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
