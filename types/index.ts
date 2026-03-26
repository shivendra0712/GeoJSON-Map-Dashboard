// GeoJSON Types
export type GeometryType =
  | "Point"
  | "MultiPoint"
  | "LineString"
  | "MultiLineString"
  | "Polygon"
  | "MultiPolygon"
  | "GeometryCollection";

export interface GeoJSONGeometry {
  type: GeometryType;
  coordinates: unknown;
}

export interface GeoJSONFeature {
  type: "Feature";
  geometry: GeoJSONGeometry;
  properties: Record<string, unknown> | null;
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export type GeoJSONData = GeoJSONFeatureCollection | GeoJSONFeature;

// Layer Config
export interface LayerColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface LayerConfig {
  id: string;
  fileName: string;
  data: GeoJSONData;
  visible: boolean;
  fillColor: LayerColor;
  strokeColor: LayerColor;
  opacity: number;
  strokeWidth: number;
}

// File Meta
export interface GeoJSONFileMeta {
  name: string;
  path: string;
  featureCount?: number;
  geometryTypes?: GeometryType[];
}

// Map Viewport
export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}
