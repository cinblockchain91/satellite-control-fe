import { SceneCanvasLazy } from "@/shared/3d";
import { MissionControlScene } from "@/widgets/mission-control-scene";

export function DashboardPage() {
  return (
    <main className="h-[calc(100svh-4rem)] w-full">
      <SceneCanvasLazy className="h-full w-full">
        <MissionControlScene />
      </SceneCanvasLazy>
    </main>
  );
}
