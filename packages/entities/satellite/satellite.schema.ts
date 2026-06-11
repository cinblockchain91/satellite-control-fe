import { z } from "zod";

export const SatelliteTelemetrySchema = z.object({
  signalStrength: z.number().min(0).max(100),
  battery: z.number().min(0).max(100),
  temperature: z.number().min(-100).max(200),
  altitude: z.number().min(0),
  healthScore: z.number().min(0).max(100),
});

export const SatelliteSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  position: z.tuple([z.number(), z.number(), z.number()]),
  status: z.enum(["online", "warning", "degraded", "offline"]),
  telemetry: SatelliteTelemetrySchema,
});

export type SatelliteDTO = z.infer<typeof SatelliteSchema>;
