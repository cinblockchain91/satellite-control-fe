"use client";

import { OrbitControls, Stars } from "@react-three/drei";
import { OrbitalRings } from "./OrbitalRings";
import { Satellite } from "./Satellite";
import { MOCK_SATELLITES } from "./satellites.data";

export function MissionControlScene() {
  return (
    <>
      <color attach="background" args={["#080c14"]} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#fff8e7" />

      <Stars radius={200} depth={60} count={4000} factor={4} fade />

      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#1a6b3c" roughness={0.8} />
      </mesh>

      <OrbitalRings />

      {MOCK_SATELLITES.map((sat) => (
        <Satellite key={sat.id} data={sat} />
      ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={20}
      />
    </>
  );
}
