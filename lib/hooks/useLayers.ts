"use client";

import { useState, useCallback } from "react";
import type { LayerConfig, GeoJSONData, LayerColor } from "@/types";
import {
  loadGeoJSON,
  getNextPresetColor,
  hexToLayerColor,
} from "@/lib/utils/geojson";

interface UseLayersReturn {
  layers: LayerConfig[];
  loadingId: string | null;
  error: string | null;
  addLayer: (fileName: string, filePath: string) => Promise<GeoJSONData | null>;
  removeLayer: (id: string) => void;
  toggleVisibility: (id: string) => void;
  updateFillColor: (id: string, color: LayerColor) => void;
  updateStrokeColor: (id: string, color: LayerColor) => void;
  updateOpacity: (id: string, opacity: number) => void;
  updateStrokeWidth: (id: string, width: number) => void;
  clearError: () => void;
  reorderLayer: (id: string, direction: "up" | "down") => void;
}

export function useLayers(): UseLayersReturn {
  const [layers, setLayers] = useState<LayerConfig[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addLayer = useCallback(
    async (fileName: string, filePath: string): Promise<GeoJSONData | null> => {
      const id = `layer-${Date.now()}`;
      setLoadingId(fileName);
      setError(null);

      try {
        const data = await loadGeoJSON(filePath);
        const fillColor = getNextPresetColor();
        const strokeColor = { r: 255, g: 255, b: 255, a: 180 };

        const newLayer: LayerConfig = {
          id,
          fileName,
          data,
          visible: true,
          fillColor,
          strokeColor,
          opacity: 0.8,
          strokeWidth: 1,
        };

        setLayers((prev) => [...prev, newLayer]);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error loading file");
        return null;
      } finally {
        setLoadingId(null);
      }
    },
    []
  );

  const removeLayer = useCallback((id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  }, []);

  const updateFillColor = useCallback((id: string, color: LayerColor) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, fillColor: color } : l))
    );
  }, []);

  const updateStrokeColor = useCallback((id: string, color: LayerColor) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, strokeColor: color } : l))
    );
  }, []);

  const updateOpacity = useCallback((id: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, opacity } : l))
    );
  }, []);

  const updateStrokeWidth = useCallback((id: string, width: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, strokeWidth: width } : l))
    );
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const reorderLayer = useCallback((id: string, direction: "up" | "down") => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx === -1) return prev;
      const newLayers = [...prev];
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= newLayers.length) return prev;
      [newLayers[idx], newLayers[targetIdx]] = [newLayers[targetIdx], newLayers[idx]];
      return newLayers;
    });
  }, []);

  return {
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
  };
}
