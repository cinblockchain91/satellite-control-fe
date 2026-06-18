const DESK_WIDTH = 1.6;
const DESK_DEPTH = 0.8;
const DESK_HEIGHT = 0.75;

const MONITOR_WIDTH = 0.9;
const MONITOR_HEIGHT = 0.55;
const MONITOR_DEPTH = 0.04;

const DESK_COLOR = "#202840";
const MONITOR_FRAME_COLOR = "#141828";
const MONITOR_EMISSIVE = "#0028aa";
const MONITOR_EMISSIVE_INTENSITY = 1.5;

interface WorkStationProps {
  position: [number, number, number];
  rotationY: number;
}

export function WorkStation({ position, rotationY }: WorkStationProps) {
  const monitorY = DESK_HEIGHT + MONITOR_HEIGHT / 2 + 0.04;
  const monitorZ = -DESK_DEPTH / 2 + MONITOR_DEPTH / 2 + 0.05;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Desk body */}
      <mesh position={[0, DESK_HEIGHT / 2, 0]}>
        <boxGeometry args={[DESK_WIDTH, DESK_HEIGHT, DESK_DEPTH]} />
        <meshStandardMaterial color={DESK_COLOR} metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Monitor bezel */}
      <mesh position={[0, monitorY, monitorZ]}>
        <boxGeometry args={[MONITOR_WIDTH + 0.06, MONITOR_HEIGHT + 0.06, MONITOR_DEPTH]} />
        <meshStandardMaterial color={MONITOR_FRAME_COLOR} roughness={0.9} />
      </mesh>
      {/* Monitor screen */}
      <mesh position={[0, monitorY, monitorZ + MONITOR_DEPTH / 2 + 0.002]}>
        <planeGeometry args={[MONITOR_WIDTH, MONITOR_HEIGHT]} />
        <meshStandardMaterial
          color={MONITOR_EMISSIVE}
          emissive={MONITOR_EMISSIVE}
          emissiveIntensity={MONITOR_EMISSIVE_INTENSITY}
        />
      </mesh>
    </group>
  );
}
