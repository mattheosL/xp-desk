export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface StoredUser extends AuthUser {
  passwordHash: string;
}
