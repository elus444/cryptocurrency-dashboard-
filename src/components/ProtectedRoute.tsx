import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/features/auth";
import type { AuthRole } from "@/types/auth.types";

const FullScreenMessage = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex min-h-screen items-center justify-center px-6">
    <div className="max-w-md rounded-2xl border border-border/60 bg-card/80 p-8 text-center shadow-sm">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export function ProtectedRoute({
  children,
  redirectTo = "/login",
  allowedRoles,
}: {
  children: ReactNode;
  redirectTo?: string;
  allowedRoles?: AuthRole[];
}) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);
  const user = useAuthStore((s) => s.user);
  const session = useAuthStore((s) => s.session);

  // Derive token validity from store session, not a fresh storage read on every render.
  // Use actual expiresAt — not the refresh threshold — so a token with 4 minutes
  // left is still treated as valid (the refresh window is for proactive renewal only).
  const hasValidToken = session !== null && Date.now() < session.expiresAt;

  if (!isBootstrapped || isLoading) {
    return (
      <FullScreenMessage
        icon={<div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
        title="Restoring your workspace"
        description="Checking your session, refreshing tokens, and preloading dashboard data."
      />
    );
  }

  if (!isAuthenticated || !hasValidToken) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    if (!user || !allowedRoles.includes(user.role)) {
      return (
        <FullScreenMessage
          icon={<ShieldAlert className="h-10 w-10 text-amber-500" />}
          title="Role-restricted area"
          description="This section is intentionally protected to demonstrate enterprise route authorization."
        />
      );
    }
  }

  return <>{children}</>;
}

export function PublicOnlyRoute({
  children,
  redirectTo = "/dashboard",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);

  if (!isBootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
