"use client";

import { useState, useEffect } from "react";
import type { GeoJSONFileMeta } from "@/types";

export function useGeoJSONFiles() {
  const [files, setFiles] = useState<GeoJSONFileMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch("/api/geojson-files");
        if (!res.ok) throw new Error("Failed to fetch file list");
        const data = await res.json();
        setFiles(data.files || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load file list");
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, []);

  return { files, loading, error };
}
