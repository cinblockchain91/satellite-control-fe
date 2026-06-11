import { SceneCanvasLazy } from "@/shared/3d";
import { MissionControlScene } from "@/widgets/mission-control-scene";
import { TelemetryDrawer, TelemetryPanel } from "@/widgets/telemetry-panel";

export function DashboardPage() {
  return (
    <main className="flex h-[calc(100svh-4rem)] w-full overflow-hidden">
      <div className="relative flex-1 min-w-0">
        <SceneCanvasLazy className="h-full w-full">
          <MissionControlScene />
        </SceneCanvasLazy>
        <TelemetryDrawer />
      </div>
      <TelemetryPanel className="hidden lg:flex" />
    </main>
  );
}
