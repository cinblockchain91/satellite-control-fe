export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000",
  appEnv: (process.env.NEXT_PUBLIC_APP_ENV || "development") as
    | "development"
    | "staging"
    | "production",
  useMock: process.env.NEXT_PUBLIC_USE_MOCK !== "false",
} as const;

export type AppEnv = typeof env.appEnv;
