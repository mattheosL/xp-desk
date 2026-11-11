import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthUser, StoredUser } from '../types/user';
import {
  clearSession,
  hashPassword,
  readSession,
  readStoredUsers,
  writeSession,
  writeStoredUsers,
} from '../utils/storage';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginAsDemo: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readSession());

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);
    const account = readStoredUsers().find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.passwordHash === passwordHash,
    );

    if (!account) {
      throw new Error('E-mail ou senha não conferem. Verifique os dados ou crie uma conta demonstrativa.');
    }

    const sessionUser: AuthUser = {
      id: account.id,
      username: account.username,
      email: account.email,
    };
    writeSession(sessionUser);
    setUser(sessionUser);
  }, []);

  const register = useCallback(async ({ username, email, password }: RegisterData) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = readStoredUsers();
    const alreadyExists = users.some((item) => item.email.toLowerCase() === normalizedEmail);

    if (alreadyExists) {
      throw new Error('Já existe uma conta demonstrativa cadastrada com este e-mail.');
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      username: username.trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
    };

    writeStoredUsers([...users, newUser]);

    const sessionUser: AuthUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };
    writeSession(sessionUser);
    setUser(sessionUser);
  }, []);

  const loginAsDemo = useCallback(() => {
    const demoUser: AuthUser = {
      id: 'demo-local-user',
      username: 'Visitante',
      email: 'visitante@kanban.local',
    };
    writeSession(demoUser);
    setUser(demoUser);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: Boolean(user), login, register, loginAsDemo, logout }),
    [user, login, register, loginAsDemo, logout],
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
