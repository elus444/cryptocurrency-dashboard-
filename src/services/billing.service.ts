import { httpClient } from "@/services/api/http-client";
import type { BillingInvoiceDto } from "@/types/domain.types";

export const billingService = {
  async getHistory() {
    return httpClient.get<BillingInvoiceDto[]>("/billing/history");
  },
};
