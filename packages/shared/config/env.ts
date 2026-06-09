export interface AppEnv {
  apiUrl: string;
  wsUrl: string;
  appEnv: "development" | "staging" | "production";
}

interface EnvInput {
  apiUrl?: string | undefined;
  wsUrl?: string | undefined;
  appEnv?: string | undefined;
}

const VALID_APP_ENVS = ["development", "staging", "production"] as const;

export function createEnv(input: EnvInput = {}): AppEnv {
  const appEnv = input.appEnv || undefined;
  if (appEnv !== undefined && !(VALID_APP_ENVS as readonly string[]).includes(appEnv)) {
    throw new Error(
      `Invalid appEnv: "${appEnv}". Must be one of: ${VALID_APP_ENVS.join(", ")}`,
    );
  }
  return {
    apiUrl: input.apiUrl ?? "",
    wsUrl: input.wsUrl ?? "ws://localhost:4000",
    appEnv: (appEnv as AppEnv["appEnv"]) ?? "development",
  };
}
