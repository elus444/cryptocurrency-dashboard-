import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { teamService } from "@/services/team.service";
import { queryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import type { TeamMemberDto } from "@/types/domain.types";
import type { AuthRole } from "@/types/auth.types";

export const useTeamMembers = () =>
  useQuery({
    queryKey: queryKeys.team.members,
    queryFn: teamService.getMembers,
    staleTime: 60_000,
  });

export const useUpdateTeamRole = () =>
  useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: AuthRole }) => teamService.updateRole(memberId, role),
    onMutate: async ({ memberId, role }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.team.members });
      const previous = queryClient.getQueryData<TeamMemberDto[]>(queryKeys.team.members);

      if (previous) {
        queryClient.setQueryData<TeamMemberDto[]>(
          queryKeys.team.members,
          previous.map((member) => (member.id === memberId ? { ...member, role } : member))
        );
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.team.members, context.previous);
      }
    },
    onSuccess: (updatedMembers, { role }) => {
      queryClient.setQueryData<TeamMemberDto[]>(queryKeys.team.members, updatedMembers);
      toast.success(`Role updated to ${role}.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.members });
    },
  });
