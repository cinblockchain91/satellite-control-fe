"use client";

import { useEffect, useRef, useState } from "react";
import type { SatelliteId } from "@satellite-control/entity-satellite";

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

export function useMockCommandDispatch() {
  const [commands, setCommands] = useState<MockCommand[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout);
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
