import type { GeometryType } from "@/types";
import { getGeometryTypeIcon } from "@/lib/utils/geojson";

interface GeometryBadgeProps {
  type: GeometryType;
}

const typeColors: Record<string, string> = {
  Point: "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30",
  MultiPoint: "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30",
  LineString: "bg-accent-lime/15 text-accent-lime border-accent-lime/30",
  MultiLineString: "bg-accent-lime/15 text-accent-lime border-accent-lime/30",
  Polygon: "bg-accent-violet/15 text-accent-violet border-accent-violet/30",
  MultiPolygon: "bg-accent-violet/15 text-accent-violet border-accent-violet/30",
  GeometryCollection: "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
};

export function GeometryBadge({ type }: GeometryBadgeProps) {
  const colorClass = typeColors[type] || "bg-white/10 text-white/60 border-white/20";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono border ${colorClass}`}
    >
      <span>{getGeometryTypeIcon(type as GeometryType)}</span>
      <span>{type}</span>
    </span>
  );
}
