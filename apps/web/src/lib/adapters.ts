import { authHttpAdapter } from "@satellite-control/infra/http/auth";
import { authMockAdapter } from "@satellite-control/infra/mock/auth";
import { env } from "@satellite-control/shared/config";

console.log("[ENV]", {
  useMock: env.useMock,
  appEnv: env.appEnv,
  apiUrl: env.apiUrl,
  wsUrl: env.wsUrl,
});

export const authAdapter = env.useMock ? authMockAdapter : authHttpAdapter;
