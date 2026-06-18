import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./scene-config";

const BEZEL_INSET = 0.1;
const BEZEL_DEPTH = 0.08;
const FRAME_COLOR = "#0d1020";
const SCREEN_COLOR = "#000a1f";
const SCREEN_EMISSIVE = "#0020aa";
const SCREEN_EMISSIVE_INTENSITY = 1.2;
const GLOW_LIGHT_COLOR = "#1040ff";
const GLOW_LIGHT_INTENSITY = 1.5;
const GLOW_LIGHT_DISTANCE = 6;

interface StatusScreenProps {
  position: [number, number, number];
}

export function StatusScreen({ position }: StatusScreenProps) {
  return (
    <group position={position}>
      {/* Screen bezel */}
      <mesh>
        <boxGeometry args={[SCREEN_WIDTH + BEZEL_INSET, SCREEN_HEIGHT + BEZEL_INSET, BEZEL_DEPTH]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.9} />
      </mesh>
      {/* Emissive screen surface */}
      <mesh position={[0, 0, BEZEL_DEPTH / 2 + 0.005]}>
        <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
        <meshStandardMaterial
          color={SCREEN_COLOR}
          emissive={SCREEN_EMISSIVE}
          emissiveIntensity={SCREEN_EMISSIVE_INTENSITY}
        />
      </mesh>
      {/* Screen glow */}
      <pointLight
        color={GLOW_LIGHT_COLOR}
        intensity={GLOW_LIGHT_INTENSITY}
        distance={GLOW_LIGHT_DISTANCE}
      />
    </group>
  );
}
