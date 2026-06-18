const CONSOLE_WIDTH = 3.0;
const CONSOLE_DEPTH = 1.2;
const CONSOLE_HEIGHT = 0.9;

const CONSOLE_COLOR = "#202840";
const SURFACE_COLOR = "#272e55";

export function ControlPanel() {
  return (
    <group position={[0, 0, 0]}>
      {/* Console body */}
      <mesh position={[0, CONSOLE_HEIGHT / 2, 0]}>
        <boxGeometry args={[CONSOLE_WIDTH, CONSOLE_HEIGHT, CONSOLE_DEPTH]} />
        <meshStandardMaterial color={CONSOLE_COLOR} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Angled work surface */}
      <mesh position={[0, CONSOLE_HEIGHT + 0.02, -0.05]} rotation={[-0.25, 0, 0]}>
        <boxGeometry args={[CONSOLE_WIDTH, 0.05, CONSOLE_DEPTH * 0.9]} />
        <meshStandardMaterial color={SURFACE_COLOR} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Front trim panel */}
      <mesh position={[0, CONSOLE_HEIGHT * 0.35, CONSOLE_DEPTH / 2]}>
        <boxGeometry args={[CONSOLE_WIDTH, CONSOLE_HEIGHT * 0.7, 0.03]} />
        <meshStandardMaterial color={SURFACE_COLOR} metalness={0.5} roughness={0.6} />
      </mesh>
    </group>
  );
}
