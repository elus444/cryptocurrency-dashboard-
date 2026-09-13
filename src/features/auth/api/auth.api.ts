import { authService } from "@/services/auth.service";

export const authApi = {
  login: authService.login,
  register: authService.signup,
  logout: authService.logout,
  refreshToken: authService.refreshToken,
  me: authService.me,
};
