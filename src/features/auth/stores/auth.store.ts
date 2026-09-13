import { create } from "zustand";
import type { AuthError, AuthSession, AuthState, AuthUser } from "@/types/auth.types";

interface AuthStore extends AuthState {
  initialize: (session: AuthSession | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: AuthError | null) => void;
  setSession: (session: AuthSession | null) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  isBootstrapped: false,
  error: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  initialize: (session) =>
    set({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      isBootstrapped: true,
      isLoading: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      isLoading: false,
      error: null,
      isBootstrapped: true,
    }),

  updateUser: (user) =>
    set((state) => ({
      user,
      session: state.session ? { ...state.session, user } : null,
    })),

  logout: () =>
    set({
      ...initialState,
      isBootstrapped: true,
    }),
}));
