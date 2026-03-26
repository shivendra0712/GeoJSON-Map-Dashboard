import type {
  GeoJSONData,
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  GeometryType,
  LayerColor,
} from "@/types";

export async function loadGeoJSON(filePath: string): Promise<GeoJSONData> {
  const response = await fetch(filePath);

  if (!response.ok) {
    throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && !contentType.includes("json") && !contentType.includes("text")) {
    throw new Error("File does not appear to be a valid JSON/GeoJSON file");
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid JSON — could not parse file");
  }

  return validateGeoJSON(data);
}

function validateGeoJSON(data: unknown): GeoJSONData {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid GeoJSON: not an object");
  }

  const obj = data as Record<string, unknown>;

  if (obj.type === "FeatureCollection") {
    if (!Array.isArray(obj.features)) {
      throw new Error("Invalid GeoJSON FeatureCollection: missing features array");
    }
    if (obj.features.length === 0) {
      throw new Error("GeoJSON FeatureCollection is empty (no features)");
    }
    return data as GeoJSONFeatureCollection;
  }

  if (obj.type === "Feature") {
    return data as GeoJSONFeature;
  }

  throw new Error(`Unsupported GeoJSON type: ${obj.type}. Expected FeatureCollection or Feature.`);
}

export function getFeatureCount(data: GeoJSONData): number {
  if (data.type === "FeatureCollection") {
    return (data as GeoJSONFeatureCollection).features.length;
  }
  return 1;
}

export function getGeometryTypes(data: GeoJSONData): GeometryType[] {
  const types = new Set<GeometryType>();

  const features =
    data.type === "FeatureCollection"
      ? (data as GeoJSONFeatureCollection).features
      : [data as GeoJSONFeature];

  for (const feature of features) {
    if (feature.geometry?.type) {
      types.add(feature.geometry.type as GeometryType);
    }
  }

  return Array.from(types);
}

export function getBoundingBox(data: GeoJSONData): [number, number, number, number] | null {
  const coords: [number, number][] = [];

  const extractCoords = (geometry: GeoJSONFeature["geometry"]) => {
    if (!geometry) return;
    const { type, coordinates } = geometry as { type: string; coordinates: unknown };

    if (type === "Point") {
      const c = coordinates as [number, number];
      coords.push(c);
    } else if (type === "LineString" || type === "MultiPoint") {
      (coordinates as [number, number][]).forEach((c) => coords.push(c));
    } else if (type === "Polygon" || type === "MultiLineString") {
      (coordinates as [number, number][][]).forEach((ring) =>
        ring.forEach((c) => coords.push(c))
      );
    } else if (type === "MultiPolygon") {
      (coordinates as [number, number][][][]).forEach((poly) =>
        poly.forEach((ring) => ring.forEach((c) => coords.push(c)))
      );
    }
  };

  const features =
    data.type === "FeatureCollection"
      ? (data as GeoJSONFeatureCollection).features
      : [data as GeoJSONFeature];

  features.forEach((f) => extractCoords(f.geometry));

  if (coords.length === 0) return null;

  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);

  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];
}

export function getGeometryTypeIcon(type: GeometryType): string {
  switch (type) {
    case "Point":
    case "MultiPoint":
      return "●";
    case "LineString":
    case "MultiLineString":
      return "—";
    case "Polygon":
    case "MultiPolygon":
      return "▣";
    case "GeometryCollection":
      return "◈";
    default:
      return "?";
  }
}

export function colorToRGBA(color: LayerColor): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`;
}

export function hexToLayerColor(hex: string, alpha = 200): LayerColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 229, b: 255, a: alpha };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: alpha,
  };
}

export function layerColorToHex(color: LayerColor): string {
  return (
    "#" +
    [color.r, color.g, color.b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

const PRESET_COLORS: LayerColor[] = [
  { r: 0, g: 229, b: 255, a: 180 },   // cyan
  { r: 198, g: 255, b: 0, a: 180 },    // lime
  { r: 255, g: 64, b: 129, a: 180 },   // rose
  { r: 124, g: 77, b: 255, a: 180 },   // violet
  { r: 255, g: 171, b: 0, a: 180 },    // amber
  { r: 0, g: 191, b: 165, a: 180 },    // teal
];

let colorIndex = 0;
export function getNextPresetColor(): LayerColor {
  const color = PRESET_COLORS[colorIndex % PRESET_COLORS.length];
  colorIndex++;
  return color;
}
