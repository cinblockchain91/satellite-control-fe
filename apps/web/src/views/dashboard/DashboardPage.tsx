import { SceneCanvasLazy } from "@/shared/3d";

function TestSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#4a9eff" wireframe />
    </mesh>
  );
}

export function DashboardPage() {
  return (
    <main className="h-full w-full">
      <SceneCanvasLazy className="h-full w-full">
        <TestSphere />
      </SceneCanvasLazy>
    </main>
  );
}
