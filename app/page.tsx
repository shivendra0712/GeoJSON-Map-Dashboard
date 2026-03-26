"use client";

import { useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { MapViewWrapper } from "@/components/map/MapViewWrapper";
import { useLayers } from "@/lib/hooks/useLayers";
import { getBoundingBox, fitBounds } from "@/lib/utils/geojson";
import type { GeoJSONData } from "@/types";

export default function Home() {
  const {
    layers,
    loadingId,
    error,
    addLayer,
    removeLayer,
    toggleVisibility,
    updateFillColor,
    updateStrokeColor,
    updateOpacity,
    updateStrokeWidth,
    clearError,
    reorderLayer,
  } = useLayers();

  const handleLoadFile = useCallback(
    async (fileName: string, filePath: string) => {
      await addLayer(fileName, filePath);
    },
    [addLayer]
  );

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-obsidian-950">
      {/* Sidebar — 30% */}
      <Sidebar
        layers={layers}
        loadingId={loadingId}
        error={error}
        onLoadFile={handleLoadFile}
        onToggleVisibility={toggleVisibility}
        onRemoveLayer={removeLayer}
        onFillColorChange={updateFillColor}
        onStrokeColorChange={updateStrokeColor}
        onOpacityChange={updateOpacity}
        onStrokeWidthChange={updateStrokeWidth}
        onReorder={reorderLayer}
        onClearError={clearError}
      />

      {/* Map — 70% */}
      <div className="flex-1 relative">
        <MapViewWrapper layers={layers} />
      </div>
    </main>
  );
}
