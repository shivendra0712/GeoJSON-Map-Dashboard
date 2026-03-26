import type { MapViewState } from "@/types";

export const DEFAULT_VIEW_STATE: MapViewState = {
  longitude: 78.9629,
  latitude: 20.5937,
  zoom: 4,
  pitch: 30,
  bearing: 0,
};

export const OSM_TILE_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap Contributors",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "osm-tiles",
      type: "raster",
      source: "osm",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export const DARK_MAP_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: [
        "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "© Stadia Maps © OpenMapTiles © OpenStreetMap Contributors",
      maxzoom: 20,
    },
  },
  layers: [
    {
      id: "osm-tiles",
      type: "raster",
      source: "osm",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

export function fitBounds(bbox: [number, number, number, number]): MapViewState {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;

  const lngDiff = maxLng - minLng;
  const latDiff = maxLat - minLat;
  const maxDiff = Math.max(lngDiff, latDiff);

  let zoom = 10;
  if (maxDiff > 80) zoom = 1;
  else if (maxDiff > 40) zoom = 2;
  else if (maxDiff > 20) zoom = 3;
  else if (maxDiff > 10) zoom = 4;
  else if (maxDiff > 5) zoom = 5;
  else if (maxDiff > 2) zoom = 7;
  else if (maxDiff > 1) zoom = 9;
  else if (maxDiff > 0.5) zoom = 11;
  else zoom = 13;

  return {
    longitude: centerLng,
    latitude: centerLat,
    zoom,
    pitch: 30,
    bearing: 0,
  };
}
