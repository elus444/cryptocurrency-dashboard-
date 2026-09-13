import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/features/auth";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your personal details and workspace identity.</p>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="mt-1 font-medium">{user?.displayName}</p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="mt-1 font-medium">{user?.email}</p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">Role</p>
            <Badge className="mt-2">{user?.role}</Badge>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">Organization</p>
            <p className="mt-1 font-medium">{user?.organizationId}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
