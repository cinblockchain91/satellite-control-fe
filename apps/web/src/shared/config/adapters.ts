import { createHttpClient } from "@satellite-control/infra-http";
import { createAuthHttpAdapter } from "@satellite-control/infra-auth-adapter";
import { env } from "./env";

export const httpClient = createHttpClient(env.apiUrl, {
  credentials: "include",
});

export const authAdapter = createAuthHttpAdapter(httpClient);
