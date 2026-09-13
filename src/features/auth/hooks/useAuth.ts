import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { tokenStorage } from "@/services/api/token-storage";
import { registerAuthHandlers, resetAuthState } from "@/services/api/http-client";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { queryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { isRateLimited, clearRateLimit } from "@/lib/security/sanitize";
import { RATE_LIMIT_CONFIG, SESSION_CONFIG } from "@/lib/security/constants";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth.types";

const isTokenExpired = (expiresAt: number): boolean => {
  return Date.now() >= expiresAt - SESSION_CONFIG.REFRESH_THRESHOLD_MS;
};

// Register once at module load time — outside React so StrictMode double-invocation
// of effects cannot cause double-registration or a stale closure.
registerAuthHandlers({
  refresh: async () => {
    try {
      const session = await authService.refreshToken();
      if (session) {
        useAuthStore.getState().setSession(session);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  onUnauthorized: () => {
    tokenStorage.clearSession();
    useAuthStore.getState().logout();
    queryClient.clear();
  },
});

export const useAuthBootstrap = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const setSession = useAuthStore((state) => state.setSession);
  const setLoading = useAuthStore((state) => state.setLoading);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const session = tokenStorage.getSession();

    if (!session) {
      initialize(null);
      return;
    }

    // If the refresh token itself is expired there is nothing to recover —
    // clear storage and redirect to login without a wasted network call.
    if (Date.now() >= session.refreshExpiresAt) {
      tokenStorage.clearSession();
      logout();
      queryClient.clear();
      return;
    }

    if (isTokenExpired(session.expiresAt)) {
      // Signal that a refresh is in progress so ProtectedRoute keeps showing the spinner
      setLoading(true);
      authService
        .refreshToken()
        .then((newSession) => {
          if (newSession) {
            setSession(newSession);
          } else {
            tokenStorage.clearSession();
            logout();
            queryClient.clear();
          }
        })
        .catch(() => {
          tokenStorage.clearSession();
          logout();
          queryClient.clear();
        });
    } else {
      initialize(session);
    }
  // Zustand actions are stable references — listing them satisfies the linter
  // without causing re-runs; session reads are intentionally one-shot on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useCurrentUserQuery = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);

  const query = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authService.me,
    enabled: isBootstrapped && isAuthenticated,
    staleTime: 5 * 60_000,
  });

  // Sync the server-authoritative user back to the store outside the render cycle.
  // select() must be pure — side effects there are unsafe in Concurrent Mode.
  useEffect(() => {
    if (query.data) {
      useAuthStore.getState().updateUser(query.data);
    }
  }, [query.data]);

  return query;
};

export function useAuth() {
  const navigate = useNavigate();

  // Granular selectors — each component re-renders only when its specific slice changes.
  // Using useAuthStore() with no selector subscribes to the entire store, causing
  // DashboardSidebar and DashboardTopbar to re-render on every auth state update.
  const user = useAuthStore((state) => state.user);
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);
  const error = useAuthStore((state) => state.error);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setSession = useAuthStore((state) => state.setSession);
  const setError = useAuthStore((state) => state.setError);
  const storeLogout = useAuthStore((state) => state.logout);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => {
      const key = `login:${credentials.email}`;
      if (isRateLimited(key, RATE_LIMIT_CONFIG.LOGIN.maxAttempts, RATE_LIMIT_CONFIG.LOGIN.windowMs)) {
        return Promise.reject(new Error("Too many login attempts. Please wait 15 minutes and try again."));
      }
      return authService.login(credentials);
    },
    onMutate: () => setLoading(true),
    onSuccess: (session, credentials) => {
      clearRateLimit(`login:${credentials.email}`);
      resetAuthState();
      setSession(session);
      queryClient.setQueryData(queryKeys.auth.me, session.user);
      toast.success("Signed in successfully.");
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      setError({
        code: "invalid_credentials",
        message: error instanceof Error ? error.message : "Login failed.",
      });
    },
    onSettled: () => setLoading(false),
  });

  const signupMutation = useMutation({
    mutationFn: (payload: RegisterCredentials) => {
      const key = `register:${payload.email}`;
      if (isRateLimited(key, RATE_LIMIT_CONFIG.REGISTER.maxAttempts, RATE_LIMIT_CONFIG.REGISTER.windowMs)) {
        return Promise.reject(new Error("Too many registration attempts. Please wait an hour and try again."));
      }
      return authService.signup(payload);
    },
    onMutate: () => setLoading(true),
    onSuccess: (session) => {
      setSession(session);
      queryClient.setQueryData(queryKeys.auth.me, session.user);
      toast.success("Workspace created. Welcome aboard.");
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      setError({
        code: "unknown",
        message: error instanceof Error ? error.message : "Registration failed.",
      });
    },
    onSettled: () => setLoading(false),
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      storeLogout();
      queryClient.clear();
    },
    onSuccess: () => {
      toast.success("Signed out.");
      navigate("/login", { replace: true });
    },
    onError: () => {
      navigate("/login", { replace: true });
    },
  });

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    isBootstrapped,
    error,
    login: loginMutation.mutateAsync,
    register: signupMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isWorking:
      loginMutation.isPending || signupMutation.isPending || logoutMutation.isPending || isLoading,
    clearError: () => setError(null),
  };
}
