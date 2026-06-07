import { authHttpAdapter } from "@satellite-control/infra/http/auth";
import { authMockAdapter } from "@satellite-control/infra/mock/auth";
import { env } from "@satellite-control/shared/config";

export const authAdapter = env.useMock ? authMockAdapter : authHttpAdapter;
