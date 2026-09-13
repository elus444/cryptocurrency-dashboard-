import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().default("/mock-api"),
  VITE_ENABLE_MOCK_API: z.enum(["true", "false"]).default("true"),
  VITE_APP_NAME: z.string().default("CryptoFolio Control Center"),
});

const parsedEnv = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_ENABLE_MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
});

if (!parsedEnv.success) {
  throw new Error(`Invalid environment variables: ${parsedEnv.error.message}`);
}

export const env = {
  apiBaseUrl: parsedEnv.data.VITE_API_BASE_URL,
  mockApiEnabled: parsedEnv.data.VITE_ENABLE_MOCK_API === "true",
  appName: parsedEnv.data.VITE_APP_NAME,
} as const;
