"use client";

import { MapPin, Github } from "lucide-react";
import type { LayerConfig } from "@/types";
import { FileSelector } from "./FileSelector";
import { LayerPanel } from "./LayerPanel";
import { Toast } from "@/components/ui/Toast";

interface SidebarProps {
  layers: LayerConfig[];
  loadingId: string | null;
  error: string | null;
  onLoadFile: (fileName: string, filePath: string) => void;
  onToggleVisibility: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onFillColorChange: (id: string, color: LayerConfig["fillColor"]) => void;
  onStrokeColorChange: (id: string, color: LayerConfig["strokeColor"]) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  onStrokeWidthChange: (id: string, width: number) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
  onClearError: () => void;
}

export function Sidebar({
  layers,
  loadingId,
  error,
  onLoadFile,
  onToggleVisibility,
  onRemoveLayer,
  onFillColorChange,
  onStrokeColorChange,
  onOpacityChange,
  onStrokeWidthChange,
  onReorder,
  onClearError,
}: SidebarProps) {
  const loadedFileNames = layers.map((l) => l.fileName);

  return (
    <aside className="w-[30%] h-screen flex flex-col bg-obsidian-900 border-r border-white/8 overflow-hidden relative">
      {/* Ambient glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-accent-cyan/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-accent-violet/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative flex-shrink-0 px-5 pt-6 pb-5 border-b border-white/8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan/30 to-accent-violet/30 border border-white/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-accent-cyan" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-white tracking-tight leading-none">
              GeoDash
            </h1>
            <p className="text-xs text-white/30 font-mono mt-0.5 tracking-wider">
              GeoJSON Map Dashboard
            </p>
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />
            <span className="text-xs font-mono text-white/30">OSM · Deck.gl · MapLibre</span>
          </div>
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-xs font-mono text-white/20">{layers.length} layer{layers.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin">
        {/* Error toast */}
        {error && (
          <Toast message={error} type="error" onClose={onClearError} />
        )}

        {/* File selector */}
        <FileSelector
          onLoad={onLoadFile}
          loadingId={loadingId}
          loadedFiles={loadedFileNames}
        />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Layer panel */}
        <LayerPanel
          layers={layers}
          onToggleVisibility={onToggleVisibility}
          onRemove={onRemoveLayer}
          onFillColorChange={onFillColorChange}
          onStrokeColorChange={onStrokeColorChange}
          onOpacityChange={onOpacityChange}
          onStrokeWidthChange={onStrokeWidthChange}
          onReorder={onReorder}
        />
      </div>

      {/* Footer */}
      <div className="relative flex-shrink-0 px-5 py-3 border-t border-white/8 flex items-center justify-between">
        <p className="text-xs font-mono text-white/20">
          Next.js · TypeScript · Deck.gl
        </p>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-lime/60" />
          <span className="text-xs font-mono text-white/20">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
