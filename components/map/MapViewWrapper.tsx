"use client";

import dynamic from "next/dynamic";
import type { LayerConfig } from "@/types";

const MapViewDynamic = dynamic(
  () => import("./MapView").then((m) => ({ default: m.MapView })),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 h-screen flex items-center justify-center bg-obsidian-950">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-accent-cyan/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-accent-cyan/40 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-accent-cyan/30" />
          </div>
          <p className="text-sm font-mono text-white/30">Initialising map…</p>
        </div>
      </div>
    ),
  }
);

interface MapViewWrapperProps {
  layers: LayerConfig[];
}

export function MapViewWrapper({ layers }: MapViewWrapperProps) {
  return <MapViewDynamic layers={layers} />;
}
