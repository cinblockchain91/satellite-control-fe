"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { computeFps } from "./compute-fps";

const SAMPLE_FRAMES = 60;
const LOW_FPS_THRESHOLD = 30;
const SUSTAINED_TICKS = 3;

interface PerformanceMonitorProps {
  onLowFps: (isLow: boolean) => void;
}

export function PerformanceMonitor({ onLowFps }: PerformanceMonitorProps) {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lowTicksRef = useRef(0);

  useFrame(({ clock }) => {
    frameCountRef.current++;
    if (frameCountRef.current < SAMPLE_FRAMES) return;

    const elapsed = clock.elapsedTime - lastTimeRef.current;
    const fps = computeFps(elapsed, SAMPLE_FRAMES);
    lastTimeRef.current = clock.elapsedTime;
    frameCountRef.current = 0;

    if (fps < LOW_FPS_THRESHOLD) {
      lowTicksRef.current++;
      if (lowTicksRef.current >= SUSTAINED_TICKS) onLowFps(true);
    } else {
      lowTicksRef.current = 0;
      onLowFps(false);
    }
  });

  return null;
}
