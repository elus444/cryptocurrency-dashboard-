import { httpClient } from "@/services/api/http-client";
import { tokenStorage } from "@/services/api/token-storage";
import { sanitizeEmail } from "@/lib/security/sanitize";
import type { AuthSession, AuthUser, LoginCredentials, RegisterCredentials } from "@/types/auth.types";

/** Minimal runtime guard — rejects server responses that are missing critical token fields. */
const assertValidSession = (value: unknown): AuthSession => {
  if (
    !value ||
    typeof value !== "object" ||
    typeof (value as Record<string, unknown>).accessToken !== "string" ||
    typeof (value as Record<string, unknown>).refreshToken !== "string" ||
    typeof (value as Record<string, unknown>).expiresAt !== "number" ||
    typeof (value as Record<string, unknown>).refreshExpiresAt !== "number"
  ) {
    throw new Error("Server returned an invalid session payload.");
  }
  return value as AuthSession;
};

export const authService = {
  async login(credentials: LoginCredentials) {
    const sanitizedCredentials = {
      ...credentials,
      email: sanitizeEmail(credentials.email),
    };
    const raw = await httpClient.post<AuthSession>("/auth/login", sanitizedCredentials, { auth: false });
    const session = assertValidSession(raw);
    tokenStorage.setSession(session);
    return session;
  },

  async signup(payload: RegisterCredentials) {
    const sanitizedPayload: RegisterCredentials = {
      name: payload.name.trim(),
      email: sanitizeEmail(payload.email),
      password: payload.password,
      agreeToTerms: payload.agreeToTerms,
    };
    const raw = await httpClient.post<AuthSession>("/auth/register", sanitizedPayload, { auth: false });
    const session = assertValidSession(raw);
    tokenStorage.setSession(session);
    return session;
  },

  async refreshToken() {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    const raw = await httpClient.post<AuthSession>(
      "/auth/refresh",
      { refreshToken },
      { auth: false, skipRefresh: true }
    );

    const session = assertValidSession(raw);
    const currentSession = tokenStorage.getSession();
    const nextSession: AuthSession = {
      ...session,
      rememberMe: currentSession?.rememberMe ?? true,
    };

    tokenStorage.setSession(nextSession);
    return nextSession;
  },

  async logout() {
    const refreshToken = tokenStorage.getRefreshToken();
    // Clear local state first — do not wait on the network. The server-side
    // token revocation is best-effort; local auth state must always be wiped.
    tokenStorage.clearSession();
    try {
      await httpClient.post("/auth/logout", { refreshToken }, { auth: false, skipRefresh: true });
    } catch {
      // Silently ignore — local session is already cleared above
    }
  },

  async me() {
    return httpClient.get<AuthUser>("/auth/me");
  },
};
