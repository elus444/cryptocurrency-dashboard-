import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/features/auth/stores/auth.store';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null, session: null, isLoading: false,
      isAuthenticated: false, isBootstrapped: false, error: null,
    });
  });

  it('initializes with null session', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('sets authenticated on setSession', () => {
    const mockSession = {
      user: { id: 'u1', email: 'a@b.com', displayName: 'Test',
              avatarUrl: '', emailVerified: true, role: 'owner' as const,
              organizationId: 'org1', createdAt: '', lastLoginAt: '' },
      accessToken: 'tok', refreshToken: 'ref',
      expiresAt: Date.now() + 900_000, refreshExpiresAt: Date.now() + 86_400_000,
      rememberMe: false,
    };
    useAuthStore.getState().setSession(mockSession);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.email).toBe('a@b.com');
  });

  it('clears state on logout', () => {
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
