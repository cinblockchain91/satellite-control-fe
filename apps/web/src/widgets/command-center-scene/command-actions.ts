"use client";

import { useEffect, useRef, useState } from "react";
import { SatelliteId } from "@satellite-control/entity-satellite";

export type CommandType = "hibernate" | "wake" | "reset" | "boost";
export type CommandStatus = "pending" | "acknowledged" | "failed";

export interface MockCommand {
  id: string;
  satelliteId: SatelliteId;
  type: CommandType;
  status: CommandStatus;
  dispatchedAt: number;
}

const COMMAND_SETTLE_MS = 2000;
const ACKNOWLEDGED_PROBABILITY = 0.9;
const SEED_INTERVAL_MS = 30_000; // 30 s between each pre-seeded entry

export function useMockCommandDispatch() {
  const [commands, setCommands] = useState<MockCommand[]>(() => [
    { id: "seed-1", satelliteId: SatelliteId("sat-1"), type: "wake",      status: "acknowledged", dispatchedAt: Date.now() - SEED_INTERVAL_MS * 4 },
    { id: "seed-2", satelliteId: SatelliteId("sat-2"), type: "boost",     status: "acknowledged", dispatchedAt: Date.now() - SEED_INTERVAL_MS * 3 },
    { id: "seed-3", satelliteId: SatelliteId("sat-3"), type: "hibernate", status: "failed",       dispatchedAt: Date.now() - SEED_INTERVAL_MS * 2 },
    { id: "seed-4", satelliteId: SatelliteId("sat-4"), type: "reset",     status: "acknowledged", dispatchedAt: Date.now() - SEED_INTERVAL_MS * 1 },
  ]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => timeouts.forEach(clearTimeout);
  }, []);

  function dispatch(satelliteId: SatelliteId, type: CommandType): Promise<void> {
    const cmd: MockCommand = {
      id: crypto.randomUUID(),
      satelliteId,
      type,
      status: "pending",
      dispatchedAt: Date.now(),
    };
    setCommands((prev) => [...prev, cmd]);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const settled: CommandStatus =
          Math.random() < ACKNOWLEDGED_PROBABILITY ? "acknowledged" : "failed";
        setCommands((prev) =>
          prev.map((c) => (c.id === cmd.id ? { ...c, status: settled } : c)),
        );
        if (settled === "acknowledged") resolve();
        else reject(new Error("Command failed"));
      }, COMMAND_SETTLE_MS);
      timeoutsRef.current.push(timer);
    });
  }

  return { commands, dispatch };
}
