export type AuthRole = "owner" | "admin" | "analyst" | "viewer";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  emailVerified: boolean;
  role: AuthRole;
  organizationId: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  refreshExpiresAt: number;
  rememberMe: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isBootstrapped: boolean;
  error: AuthError | null;
}

export interface AuthError {
  code: AuthErrorCode;
  message: string;
}

export type AuthErrorCode =
  | "invalid_credentials"
  | "email_in_use"
  | "weak_password"
  | "invalid_email"
  | "network_error"
  | "session_expired"
  | "unauthorized"
  | "forbidden"
  | "unknown";

export interface PasswordRequirement {
  id: string;
  label: string;
  validator: (password: string) => boolean;
}
