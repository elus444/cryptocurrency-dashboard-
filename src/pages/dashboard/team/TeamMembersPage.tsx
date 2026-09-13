import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InlineErrorState, SectionSkeleton } from "@/components/app/AsyncState";
import { useTeamMembers, useUpdateTeamRole } from "@/features/team/hooks/useTeam";
import type { AuthRole } from "@/types/auth.types";

const roleRotation: Record<AuthRole, AuthRole> = {
  owner: "admin",
  admin: "analyst",
  analyst: "viewer",
  viewer: "analyst",
};

export default function TeamMembersPage() {
  const query = useTeamMembers();
  const mutation = useUpdateTeamRole();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Team Members</h1>
        <p className="text-muted-foreground">Manage access levels and roles for everyone in your workspace.</p>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Workspace Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {query.isLoading ? (
            <SectionSkeleton rows={4} />
          ) : query.isError ? (
            <InlineErrorState description="Team members could not be loaded." onRetry={() => void query.refetch()} />
          ) : (
            query.data?.map((member) => (
              <div key={member.id} className="grid gap-3 rounded-xl border border-border/60 p-4 md:grid-cols-[1.3fr_1fr_1fr_auto]">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge variant="outline">{member.role}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={member.status === "active" ? "default" : "outline"}>{member.status}</Badge>
                </div>
                <Button
                  variant="outline"
                  disabled={mutation.isPending || member.role === "owner"}
                  onClick={() => mutation.mutate({ memberId: member.id, role: roleRotation[member.role] })}
                >
                  Cycle Role
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
