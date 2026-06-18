"use client";

import { useEffect, useRef } from "react";
import { CameraControls, Stars } from "@react-three/drei";
import type { Satellite, SatelliteId, SatelliteStatus } from "@satellite-control/entity-satellite";
import { Earth } from "@/shared/3d";
import { GroundStationNode } from "./GroundStationNode";
import { SatelliteNode } from "./SatelliteNode";
import { TelemetryBeam } from "./TelemetryBeam";
import { FlowParticles } from "./FlowParticles";
import type { GroundStation } from "./ground-stations.data";
import { GROUND_STATION_COLORS } from "./ground-stations.data";
import { classifyStream } from "./telemetry-stream";

const TUNNEL_CAMERA_POSITION = [2, 3, 5] as const;

const SAT_STATUS_COLORS: Record<SatelliteStatus, string> = {
  online: "#22c55e",
  warning: "#eab308",
  degraded: "#f97316",
  offline: "#ef4444",
};

interface TelemetryTunnelSceneProps {
  satellites: Satellite[];
  groundStations: GroundStation[];
  selectedSatelliteId: SatelliteId | null;
  onSelectSatellite: (id: SatelliteId | null) => void;
}

export function TelemetryTunnelScene({
  satellites,
  groundStations,
  selectedSatelliteId,
  onSelectSatellite,
}: TelemetryTunnelSceneProps) {
  const controlsRef = useRef<React.ComponentRef<typeof CameraControls>>(null);

  useEffect(() => {
    const [cx, cy, cz] = TUNNEL_CAMERA_POSITION;
    void controlsRef.current?.setLookAt(cx, cy, cz, 0, 0, 0, false);
  }, []);

  return (
    <>
      <color attach="background" args={["#080c14"]} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#fff8e7" />

      <Stars radius={200} depth={60} count={4000} factor={4} fade />

      <group onClick={(e) => { e.stopPropagation(); onSelectSatellite(null); }}>
        <Earth />
      </group>

      {satellites.map((sat) => (
        <SatelliteNode
          key={sat.id}
          data={sat}
          color={SAT_STATUS_COLORS[sat.status]}
          streamState={classifyStream(sat.telemetry)}
          isSelected={selectedSatelliteId === sat.id}
          onSelect={() => onSelectSatellite(sat.id)}
        />
      ))}

      {groundStations.map((gs) => (
        <GroundStationNode
          key={gs.id}
          data={gs}
          color={GROUND_STATION_COLORS[gs.status]}
        />
      ))}

      {groundStations.flatMap((gs) =>
        gs.linkedSatelliteIds.map((satId) => {
          const sat = satellites.find((s) => s.id === satId);
          if (!sat) return null;
          const isOffline = sat.status === "offline";
          const streamState = classifyStream(sat.telemetry);
          return (
            <group
              key={`${satId}-${gs.id}`}
              onClick={(e) => { e.stopPropagation(); onSelectSatellite(sat.id); }}
            >
              <TelemetryBeam
                from={sat.position}
                to={gs.position}
                color={SAT_STATUS_COLORS[sat.status]}
                isOffline={isOffline}
              />
              <FlowParticles
                from={sat.position}
                to={gs.position}
                streamState={streamState}
                isOffline={isOffline}
              />
            </group>
          );
        }),
      )}

      <CameraControls
        ref={controlsRef}
        minDistance={0.5}
        maxDistance={20}
        dampingFactor={0.05}
      />
    </>
  );
}
