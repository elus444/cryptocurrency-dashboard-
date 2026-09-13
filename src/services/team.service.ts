import { httpClient } from "@/services/api/http-client";
import type { TeamMemberDto } from "@/types/domain.types";
import type { AuthRole } from "@/types/auth.types";

export const teamService = {
  async getMembers() {
    return httpClient.get<TeamMemberDto[]>("/team/members");
  },

  async updateRole(memberId: string, role: AuthRole) {
    return httpClient.patch<TeamMemberDto[]>(`/team/members/${memberId}`, { role });
  },
};
