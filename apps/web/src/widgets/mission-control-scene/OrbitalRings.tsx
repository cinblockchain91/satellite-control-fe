"use client";

export function OrbitalRings() {
  return (
    <>
      {/* Equatorial orbit */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.005, 8, 128]} />
        <meshBasicMaterial color="#334155" transparent opacity={0.6} />
      </mesh>

      {/* Polar orbit */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[3, 0.005, 8, 128]} />
        <meshBasicMaterial color="#334155" transparent opacity={0.4} />
      </mesh>

      {/* Inclined orbit */}
      <mesh rotation={[Math.PI / 4, 0, Math.PI / 6]}>
        <torusGeometry args={[2.8, 0.005, 8, 128]} />
        <meshBasicMaterial color="#334155" transparent opacity={0.5} />
      </mesh>
    </>
  );
}
