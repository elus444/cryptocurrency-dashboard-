import type { ReactNode } from "react";
import { useAuthStore } from "@/features/auth";
import type { AuthRole } from "@/types/auth.types";

export function RoleGate({
  roles,
  children,
  fallback = null,
}: {
  roles: AuthRole[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const role = useAuthStore((state) => state.user?.role);

  if (!role || !roles.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
