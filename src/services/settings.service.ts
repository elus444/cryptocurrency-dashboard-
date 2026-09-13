import { httpClient } from "@/services/api/http-client";
import type { SettingsDto } from "@/types/domain.types";

export const settingsService = {
  async getSettings() {
    return httpClient.get<SettingsDto>("/settings");
  },

  async updateSettings(payload: Partial<SettingsDto>) {
    return httpClient.patch<SettingsDto>("/settings", payload);
  },
};
