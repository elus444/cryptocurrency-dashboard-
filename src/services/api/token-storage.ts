import type { AuthSession } from "@/types/auth.types";

const STORAGE_KEY = "saasnav.auth.session";

const getStorage = (rememberMe: boolean) => (rememberMe ? localStorage : sessionStorage);

const isValidSession = (value: unknown): value is AuthSession => {
  if (!value || typeof value !== "object") return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.accessToken === "string" &&
    s.accessToken.length > 0 &&
    typeof s.refreshToken === "string" &&
    s.refreshToken.length > 0 &&
    typeof s.expiresAt === "number" &&
    typeof s.refreshExpiresAt === "number" &&
    // Reject sessions whose refresh token has already expired — there is nothing
    // to recover from storage. The bootstrap path would detect this too, but
    // failing fast here avoids a wasted network call on the refresh endpoint.
    s.refreshExpiresAt > Date.now() &&
    typeof s.rememberMe === "boolean" &&
    s.user !== null &&
    typeof s.user === "object"
  );
};

const readFromStorage = (storage: Storage): AuthSession | null => {
  const rawValue = storage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (!isValidSession(parsed)) {
      // Corrupted or tampered entry — remove it
      storage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    storage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const tokenStorage = {
  getSession(): AuthSession | null {
    return readFromStorage(sessionStorage) ?? readFromStorage(localStorage);
  },

  setSession(session: AuthSession) {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    getStorage(session.rememberMe).setItem(STORAGE_KEY, JSON.stringify(session));
  },

  updateSession(updater: (session: AuthSession) => AuthSession) {
    const currentSession = this.getSession();

    if (!currentSession) {
      return null;
    }

    const nextSession = updater(currentSession);
    this.setSession(nextSession);
    return nextSession;
  },

  clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  },

  // Avoid calling getSession() twice per interceptor cycle
  getAccessToken() {
    return this.getSession()?.accessToken ?? null;
  },

  getRefreshToken() {
    return this.getSession()?.refreshToken ?? null;
  },
};
