import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createUser, loginUser, sessionToUser, updateUser, changePassword } from '../services/userService';
import type { AuthUser, ChangePasswordInput, UpdateUserInput } from '../types/user';
import {
  clearSession,
  readSession,
  writeAccessToken,
  writeRefreshToken,
  writeSession,
} from '../utils/storage';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (input: UpdateUserInput) => Promise<void>;
  changePassword: (input: ChangePasswordInput) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readSession());

  // Listen for auth:expired events (fired by api.ts on failed refresh)
  useEffect(() => {
    function handleExpired() {
      clearSession();
      setUser(null);
    }
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginUser({
      email: email.trim().toLowerCase(),
      password,
    });

    writeAccessToken(response.accessToken);
    writeRefreshToken(response.refreshToken);

    const account = sessionToUser(response);
    writeSession(account);
    setUser(account);
  }, []);

  const register = useCallback(async ({ username, email, password }: RegisterData) => {
    const cleanUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Create user
    await createUser({
      username: cleanUsername,
      email: normalizedEmail,
      password,
    });

    // 2. Auto-login after registration
    const response = await loginUser({
      email: normalizedEmail,
      password,
    });

    writeAccessToken(response.accessToken);
    writeRefreshToken(response.refreshToken);

    const account = sessionToUser(response);
    writeSession(account);
    setUser(account);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (input: UpdateUserInput) => {
    const current = readSession();
    if (!current) throw new Error('Nenhum usuário autenticado.');

    await updateUser(current.id, input);

    const updated: AuthUser = {
      ...current,
      username: input.username,
      email: input.email,
    };
    writeSession(updated);
    setUser(updated);
  }, []);

  const changePasswordFn = useCallback(async (input: ChangePasswordInput) => {
    const current = readSession();
    if (!current) throw new Error('Nenhum usuário autenticado.');

    await changePassword(current.id, input);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      updateProfile,
      changePassword: changePasswordFn,
    }),
    [user, login, register, logout, updateProfile, changePasswordFn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider.');
  }
  return context;
}
