"use client";

import { useState } from "react";
import { useCursor, Text } from "@react-three/drei";
import { useTranslations } from "next-intl";
import type { SatelliteId } from "@satellite-control/entity-satellite";
import type { CommandType, CommandStatus, MockCommand } from "./command-actions";

const CONSOLE_WIDTH = 3.0;
const CONSOLE_DEPTH = 1.2;
const CONSOLE_HEIGHT = 0.9;

const CONSOLE_COLOR = "#202840";
const SURFACE_COLOR = "#272e55";

const BUTTON_WIDTH = 0.55;
const BUTTON_HEIGHT = 0.12;
const BUTTON_DEPTH = 0.2;
const BUTTON_Y = CONSOLE_HEIGHT + 0.08;
const BUTTON_Z = -0.05;

const STATUS_EMISSIVE_INTENSITY = 1.0;
const HOVER_EMISSIVE_INTENSITY = 0.8;

const COMMAND_TYPES: readonly CommandType[] = ["hibernate", "wake", "reset", "boost"];

const BUTTON_POSITIONS: Record<CommandType, [number, number, number]> = {
  hibernate: [-1.1,  BUTTON_Y, BUTTON_Z],
  wake:      [-0.37, BUTTON_Y, BUTTON_Z],
  reset:     [ 0.37, BUTTON_Y, BUTTON_Z],
  boost:     [ 1.1,  BUTTON_Y, BUTTON_Z],
};

const BUTTON_BASE_COLOR: Record<CommandType, string> = {
  hibernate: "#1a1560",
  wake:      "#0a3828",
  reset:     "#162060",
  boost:     "#501010",
};

const BUTTON_HOVER_EMISSIVE: Record<CommandType, string> = {
  hibernate: "#3030c0",
  wake:      "#20a060",
  reset:     "#2040c0",
  boost:     "#c02020",
};

const STATUS_EMISSIVE: Record<CommandStatus, string> = {
  pending:      "#b0a000",
  acknowledged: "#00a040",
  failed:       "#c02020",
};

const TEXT_COLOR = "#c0d0f0";
const TEXT_COLOR_DISABLED = "#4a5068";
const TEXT_FONT_SIZE = 0.045;

interface CommandButtonProps {
  type: CommandType;
  position: [number, number, number];
  status: CommandStatus | null;
  isDisabled: boolean;
  onDispatch: () => void;
  label: string;
}

function CommandButton({ type, position, status, isDisabled, onDispatch, label }: CommandButtonProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && !isDisabled);

  const emissive = status
    ? STATUS_EMISSIVE[status]
    : hovered && !isDisabled
    ? BUTTON_HOVER_EMISSIVE[type]
    : "#000000";

  const emissiveIntensity = status ? STATUS_EMISSIVE_INTENSITY : hovered && !isDisabled ? HOVER_EMISSIVE_INTENSITY : 0;

  const handleClick = (e: { stopPropagation: () => void }) => { e.stopPropagation(); if (!isDisabled) onDispatch(); };
  const handleEnter = (e: { stopPropagation: () => void }) => { e.stopPropagation(); setHovered(true); };
  const handleLeave = () => setHovered(false);

  return (
    <group position={position}>
      <mesh onClick={handleClick} onPointerEnter={handleEnter} onPointerLeave={handleLeave}>
        <boxGeometry args={[BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_DEPTH]} />
        <meshStandardMaterial
          color={BUTTON_BASE_COLOR[type]}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      <Text
        position={[0, 0, BUTTON_DEPTH / 2 + 0.002]}
        fontSize={TEXT_FONT_SIZE}
        color={isDisabled ? TEXT_COLOR_DISABLED : TEXT_COLOR}
        anchorX="center"
        anchorY="middle"
        onClick={handleClick}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
      >
        {label}
      </Text>
    </group>
  );
}

interface ControlPanelProps {
  selectedSatelliteId: SatelliteId | null;
  onDispatch: (type: CommandType) => void;
  commands: MockCommand[];
  onFocusPanel: () => void;
}

function latestStatus(commands: MockCommand[], type: CommandType): CommandStatus | null {
  const sorted = commands
    .filter((c) => c.type === type)
    .sort((a, b) => b.dispatchedAt - a.dispatchedAt);
  return sorted[0]?.status ?? null;
}

export function ControlPanel({ selectedSatelliteId, onDispatch, commands, onFocusPanel }: ControlPanelProps) {
  const t = useTranslations("commandCenter");
  return (
    <group
      position={[0, 0, 0]}
      onClick={(e) => { e.stopPropagation(); onFocusPanel(); }}
    >
      {/* Console body */}
      <mesh position={[0, CONSOLE_HEIGHT / 2, 0]}>
        <boxGeometry args={[CONSOLE_WIDTH, CONSOLE_HEIGHT, CONSOLE_DEPTH]} />
        <meshStandardMaterial
          color={CONSOLE_COLOR}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      {/* Angled work surface */}
      <mesh
        position={[0, CONSOLE_HEIGHT + 0.02, -0.05]}
        rotation={[-0.25, 0, 0]}
      >
        <boxGeometry args={[CONSOLE_WIDTH, 0.05, CONSOLE_DEPTH * 0.9]} />
        <meshStandardMaterial
          color={SURFACE_COLOR}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      {/* Front trim panel */}
      <mesh position={[0, CONSOLE_HEIGHT * 0.35, CONSOLE_DEPTH / 2]}>
        <boxGeometry args={[CONSOLE_WIDTH, CONSOLE_HEIGHT * 0.7, 0.03]} />
        <meshStandardMaterial
          color={SURFACE_COLOR}
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>

      {COMMAND_TYPES.map((type) => (
        <CommandButton
          key={type}
          type={type}
          position={BUTTON_POSITIONS[type]}
          status={latestStatus(commands, type)}
          isDisabled={selectedSatelliteId === null}
          onDispatch={() => onDispatch(type)}
          label={t(`commandType.${type}`)}
        />
      ))}
    </group>
  );
}
