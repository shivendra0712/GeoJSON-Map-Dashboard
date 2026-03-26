"use client";

import { Layers, Inbox } from "lucide-react";
import type { LayerConfig } from "@/types";
import { LayerCard } from "./LayerCard";

interface LayerPanelProps {
  layers: LayerConfig[];
  onToggleVisibility: (id: string) => void;
  onRemove: (id: string) => void;
  onFillColorChange: (id: string, color: LayerConfig["fillColor"]) => void;
  onStrokeColorChange: (id: string, color: LayerConfig["strokeColor"]) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  onStrokeWidthChange: (id: string, width: number) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
}

export function LayerPanel({
  layers,
  onToggleVisibility,
  onRemove,
  onFillColorChange,
  onStrokeColorChange,
  onOpacityChange,
  onStrokeWidthChange,
  onReorder,
}: LayerPanelProps) {
  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-accent-lime" />
          <span className="text-xs font-mono tracking-widest uppercase text-white/50">
            Active Layers
          </span>
        </div>
        {layers.length > 0 && (
          <span className="text-xs font-mono text-accent-lime/70 bg-accent-lime/10 px-2 py-0.5 rounded-full border border-accent-lime/20">
            {layers.length}
          </span>
        )}
      </div>

      {/* Layer list */}
      {layers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-dashed border-white/10 bg-white/2">
          <Inbox className="w-8 h-8 text-white/15 mb-3" />
          <p className="text-xs text-white/25 font-mono text-center leading-relaxed">
            No layers loaded yet.
            <br />
            Select a file above to begin.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {layers.map((layer, index) => (
            <LayerCard
              key={layer.id}
              layer={layer}
              index={index}
              total={layers.length}
              onToggleVisibility={() => onToggleVisibility(layer.id)}
              onRemove={() => onRemove(layer.id)}
              onFillColorChange={(color) => onFillColorChange(layer.id, color)}
              onStrokeColorChange={(color) => onStrokeColorChange(layer.id, color)}
              onOpacityChange={(opacity) => onOpacityChange(layer.id, opacity)}
              onStrokeWidthChange={(width) => onStrokeWidthChange(layer.id, width)}
              onReorder={(direction) => onReorder(layer.id, direction)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
