export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  id: string;
  username: string;
  email: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
}

export interface UpdateUserInput {
  username: string;
  email: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}
