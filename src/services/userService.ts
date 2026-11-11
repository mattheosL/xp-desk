import type { AuthUser } from '../types/user';
import { readSession } from '../utils/storage';

export function getCurrentUser(): AuthUser | null {
  return readSession();
}
