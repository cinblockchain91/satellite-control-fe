import { createEnv } from "@satellite-control/shared/config";

export const env = createEnv({
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  wsUrl: process.env.NEXT_PUBLIC_WS_URL,
  appEnv: process.env.NEXT_PUBLIC_APP_ENV,
  featureDigitalTwin: process.env.NEXT_PUBLIC_FEATURE_DIGITAL_TWIN,
  featureTelemetryTunnel: process.env.NEXT_PUBLIC_FEATURE_TELEMETRY_TUNNEL,
  featureCommandCenter: process.env.NEXT_PUBLIC_FEATURE_COMMAND_CENTER,
});
