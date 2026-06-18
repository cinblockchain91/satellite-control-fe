const ROOM_WIDTH = 16;
const ROOM_DEPTH = 12;
const ROOM_HEIGHT = 4;

const FLOOR_COLOR = "#1e2340";
const WALL_COLOR = "#141828";
const CEILING_COLOR = "#141828";

export function RoomGeometry() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={FLOOR_COLOR} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_HEIGHT, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={CEILING_COLOR} roughness={0.9} />
      </mesh>

      {/* Back wall — where status screens will be mounted */}
      <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH, ROOM_HEIGHT, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]}>
        <boxGeometry args={[0.2, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Right wall */}
      <mesh position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]}>
        <boxGeometry args={[0.2, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
    </group>
  );
}
