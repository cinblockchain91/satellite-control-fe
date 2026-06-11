"use client";

export function SceneLoaderOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080c14] gap-3 z-10">
      <div className="h-8 w-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      <p className="text-xs text-slate-400 tracking-widest uppercase">Initializing scene</p>
    </div>
  );
}
