"use client";

import { useState } from "react";
import {
  Eye, EyeOff, Trash2, ChevronDown, ChevronUp,
  ArrowUp, ArrowDown, Layers
} from "lucide-react";
import type { LayerConfig } from "@/types";
import { getFeatureCount, getGeometryTypes, colorToRGBA } from "@/lib/utils/geojson";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { Slider } from "@/components/ui/Slider";
import { GeometryBadge } from "@/components/ui/GeometryBadge";

interface LayerCardProps {
  layer: LayerConfig;
  index: number;
  total: number;
  onToggleVisibility: () => void;
  onRemove: () => void;
  onFillColorChange: (color: LayerConfig["fillColor"]) => void;
  onStrokeColorChange: (color: LayerConfig["strokeColor"]) => void;
  onOpacityChange: (opacity: number) => void;
  onStrokeWidthChange: (width: number) => void;
  onReorder: (direction: "up" | "down") => void;
}

export function LayerCard({
  layer,
  index,
  total,
  onToggleVisibility,
  onRemove,
  onFillColorChange,
  onStrokeColorChange,
  onOpacityChange,
  onStrokeWidthChange,
  onReorder,
}: LayerCardProps) {
  const [expanded, setExpanded] = useState(false);

  const featureCount = getFeatureCount(layer.data);
  const geometryTypes = getGeometryTypes(layer.data);
  const displayName = (layer.fileName ?? "Layer")
    .replace(/\.(geojson|json)$/, "")
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        layer.visible
          ? "border-white/12 bg-white/4"
          : "border-white/6 bg-white/2 opacity-60"
      }`}
    >
      {/* Layer Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Color swatch */}
        <div
          className="w-3 h-3 rounded-sm flex-shrink-0 border border-white/20"
          style={{ backgroundColor: colorToRGBA(layer.fillColor) }}
        />

        {/* Layer name */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/85 font-body truncate leading-tight">
            {displayName}
          </p>
          <p className="text-xs text-white/30 font-mono mt-0.5">
            {featureCount} feature{featureCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onReorder("up")}
            disabled={index === 0}
            className="w-6 h-6 flex items-center justify-center rounded text-white/25 hover:text-white/60 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            title="Move layer up"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => onReorder("down")}
            disabled={index === total - 1}
            className="w-6 h-6 flex items-center justify-center rounded text-white/25 hover:text-white/60 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            title="Move layer down"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
          <button
            onClick={onToggleVisibility}
            className="w-6 h-6 flex items-center justify-center rounded text-white/25 hover:text-white/70 transition-colors"
            title={layer.visible ? "Hide layer" : "Show layer"}
          >
            {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onRemove}
            className="w-6 h-6 flex items-center justify-center rounded text-white/25 hover:text-red-400 transition-colors"
            title="Remove layer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-6 h-6 flex items-center justify-center rounded text-white/25 hover:text-white/70 transition-colors"
            title={expanded ? "Collapse" : "Expand settings"}
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Geometry type badges */}
      <div className="px-3 pb-2.5 flex flex-wrap gap-1">
        {geometryTypes.map((t) => (
          <GeometryBadge key={t} type={t} />
        ))}
      </div>

      {/* Expanded controls */}
      {expanded && (
        <div className="border-t border-white/8 px-3 py-3 space-y-4 animate-fade-in">
          <ColorPicker
            label="Fill Color"
            color={layer.fillColor}
            onChange={onFillColorChange}
          />
          <ColorPicker
            label="Stroke Color"
            color={layer.strokeColor}
            onChange={onStrokeColorChange}
          />
          <Slider
            label="Opacity"
            value={layer.opacity}
            min={0}
            max={1}
            step={0.01}
            onChange={onOpacityChange}
          />
          <Slider
            label="Stroke Width"
            value={layer.strokeWidth}
            min={0.5}
            max={10}
            step={0.5}
            unit="px"
            onChange={onStrokeWidthChange}
          />
        </div>
      )}
    </div>
  );
}
