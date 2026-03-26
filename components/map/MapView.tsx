"use client";

import { useState, useCallback, useMemo } from "react";
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { Compass, ZoomIn, ZoomOut, RotateCcw, Map as MapIcon, Layers } from "lucide-react";
import type { LayerConfig, MapViewState } from "@/types";
import { DEFAULT_VIEW_STATE, OSM_TILE_STYLE, DARK_MAP_STYLE } from "@/lib/utils/map-config";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapViewProps {
  layers: LayerConfig[];
}

export function MapView({ layers }: MapViewProps) {
  const [viewState, setViewState] = useState<MapViewState>(DEFAULT_VIEW_STATE);
  const [mapStyle, setMapStyle] = useState<"dark" | "osm">("dark");
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: Record<string, unknown>;
    name: string;
  } | null>(null);

  // Build Deck.gl layers from LayerConfig
  const deckLayers = useMemo(() => {
    return layers
      .filter((l) => l.visible)
      .map((layer) => {
        const { r, g, b, a } = layer.fillColor;
        const { r: sr, g: sg, b: sb, a: sa } = layer.strokeColor;
        const opacity = layer.opacity;

        return new GeoJsonLayer({
          id: layer.id,
          data: layer.data as object,
          pickable: true,
          stroked: true,
          filled: true,
          extruded: false,
          wireframe: false,
          opacity,
          getFillColor: [r, g, b, a],
          getLineColor: [sr, sg, sb, sa],
          getLineWidth: layer.strokeWidth,
          lineWidthMinPixels: layer.strokeWidth,
          getPointRadius: 6,
          pointRadiusMinPixels: 4,
          pointRadiusMaxPixels: 20,
          onHover: (info: { x: number; y: number; object?: { properties?: Record<string, unknown> } }) => {
            if (info.object?.properties && Object.keys(info.object.properties).length > 0) {
              setTooltip({
                x: info.x,
                y: info.y,
                content: info.object.properties,
                name: layer.fileName
                  .replace(/\.(geojson|json)$/, "")
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase()),
              });
            } else {
              setTooltip(null);
            }
          },
          updateTriggers: {
            getFillColor: [r, g, b, a, opacity],
            getLineColor: [sr, sg, sb, sa],
            getLineWidth: layer.strokeWidth,
          },
        });
      });
  }, [layers]);

  const handleZoomIn = () =>
    setViewState((v) => ({ ...v, zoom: Math.min(v.zoom + 1, 20) }));
  const handleZoomOut = () =>
    setViewState((v) => ({ ...v, zoom: Math.max(v.zoom - 1, 0) }));
  const handleReset = () => setViewState(DEFAULT_VIEW_STATE);
  const handleResetBearing = () =>
    setViewState((v) => ({ ...v, bearing: 0, pitch: 30 }));

  const currentStyle = mapStyle === "dark" ? DARK_MAP_STYLE : OSM_TILE_STYLE;

  return (
    <div className="relative flex-1 h-screen bg-obsidian-950 overflow-hidden">
      {/* DeckGL + MapLibre */}
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState: vs }) => {
          setViewState(vs as MapViewState);
          setTooltip(null);
        }}
        controller={true}
        layers={deckLayers}
        style={{ width: "100%", height: "100%" }}
      >
        <Map
          reuseMaps
          mapStyle={currentStyle as object}
          style={{ width: "100%", height: "100%" }}
          attributionControl={false}
        />
      </DeckGL>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-30 pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 12 }}
        >
          <div className="bg-obsidian-800/95 backdrop-blur-xl border border-white/15 rounded-xl p-3 shadow-2xl max-w-xs min-w-40 animate-fade-in">
            <p className="text-xs font-mono text-accent-cyan mb-2 uppercase tracking-wider">
              {tooltip.name}
            </p>
            <div className="space-y-1">
              {Object.entries(tooltip.content)
                .filter(([, v]) => v !== null && v !== undefined)
                .slice(0, 8)
                .map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2">
                    <span className="text-xs text-white/40 font-mono flex-shrink-0 min-w-0 capitalize">
                      {key.replace(/_/g, " ")}:
                    </span>
                    <span className="text-xs text-white/80 font-body break-words">
                      {String(value)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Map Style Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-1 bg-obsidian-800/90 backdrop-blur-xl border border-white/12 rounded-xl p-1 shadow-xl">
          <button
            onClick={() => setMapStyle("dark")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              mapStyle === "dark"
                ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <Layers className="w-3 h-3" />
            Dark
          </button>
          <button
            onClick={() => setMapStyle("osm")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              mapStyle === "osm"
                ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <MapIcon className="w-3 h-3" />
            OSM
          </button>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-8 right-4 z-20 flex flex-col gap-1.5">
        {[
          { icon: ZoomIn, action: handleZoomIn, title: "Zoom in" },
          { icon: ZoomOut, action: handleZoomOut, title: "Zoom out" },
          { icon: Compass, action: handleResetBearing, title: "Reset bearing" },
          { icon: RotateCcw, action: handleReset, title: "Reset view" },
        ].map(({ icon: Icon, action, title }) => (
          <button
            key={title}
            onClick={action}
            title={title}
            className="w-9 h-9 bg-obsidian-800/90 backdrop-blur-xl border border-white/12 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-obsidian-700/90 hover:border-white/20 transition-all shadow-lg"
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* Coordinates HUD */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-obsidian-800/80 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-accent-cyan/60" />
            <span className="text-xs font-mono text-white/30">
              {viewState.longitude.toFixed(4)}°&nbsp;
              {viewState.latitude.toFixed(4)}°
            </span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-xs font-mono text-white/25">
            z{viewState.zoom.toFixed(1)}
          </span>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-xs font-mono text-white/25">
            {viewState.pitch.toFixed(0)}°
          </span>
        </div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-4 right-16 z-10">
        <p className="text-xs font-mono text-white/15">
          © OpenStreetMap Contributors · Stadia Maps
        </p>
      </div>

      {/* Empty state overlay */}
      {layers.filter((l) => l.visible).length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mx-auto mb-4">
              <MapIcon className="w-7 h-7 text-white/15" />
            </div>
            <p className="text-sm font-body text-white/20">Load a GeoJSON file to begin</p>
            <p className="text-xs font-mono text-white/12 mt-1">Select from the sidebar →</p>
          </div>
        </div>
      )}
    </div>
  );
}
