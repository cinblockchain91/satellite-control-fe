"use client";

import { useState, useEffect } from "react";
import { Line } from "@react-three/drei";
import type { TelemetryStreamState } from "./telemetry-stream";

const OFFLINE_BEAM_WIDTH = 1;
const OFFLINE_BEAM_OPACITY = 0.08;
const DIM_BEAM_WIDTH = 0.5;
const DIM_BEAM_OPACITY = 0.04;

const BEAM_CONFIG: Record<TelemetryStreamState, {
  lineWidth: number;
  maxOpacity: number;
  minOpacity: number;
  flashInterval: number | null;
}> = {
  nominal:  { lineWidth: 1.0, maxOpacity: 0.30, minOpacity: 0.30, flashInterval: null },
  warning:  { lineWidth: 1.8, maxOpacity: 0.55, minOpacity: 0.20, flashInterval: 800  },
  critical: { lineWidth: 3.0, maxOpacity: 0.75, minOpacity: 0.10, flashInterval: 250  },
};

interface TelemetryBeamProps {
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
  streamState: TelemetryStreamState;
  isOffline?: boolean;
  isActive?: boolean;
}

export function TelemetryBeam({
  from,
  to,
  color = "#38bdf8",
  streamState,
  isOffline = false,
  isActive = true,
}: TelemetryBeamProps) {
  const [bright, setBright] = useState(true);

  const config = BEAM_CONFIG[streamState];

  useEffect(() => {
    setBright(true);
    if (!config.flashInterval || isOffline) return;
    const id = setInterval(() => setBright((v) => !v), config.flashInterval);
    return () => clearInterval(id);
  }, [config.flashInterval, isOffline]);

  if (!isActive) {
    return (
      <Line
        points={[from, to]}
        color={color}
        lineWidth={DIM_BEAM_WIDTH}
        opacity={DIM_BEAM_OPACITY}
        transparent
        depthWrite={false}
      />
    );
  }

  if (isOffline) {
    return (
      <Line
        points={[from, to]}
        color={color}
        lineWidth={OFFLINE_BEAM_WIDTH}
        opacity={OFFLINE_BEAM_OPACITY}
        transparent
        depthWrite={false}
      />
    );
  }

  return (
    <Line
      points={[from, to]}
      color={color}
      lineWidth={config.lineWidth}
      opacity={bright ? config.maxOpacity : config.minOpacity}
      transparent
      depthWrite={false}
    />
  );
}
