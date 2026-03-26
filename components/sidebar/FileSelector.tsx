"use client";

import { useState } from "react";
import { FileJson, Plus, Loader2, FolderOpen, ChevronDown } from "lucide-react";
import type { GeoJSONFileMeta } from "@/types";
import { useGeoJSONFiles } from "@/lib/hooks/useGeoJSONFiles";

interface FileSelectorProps {
  onLoad: (fileName: string, filePath: string) => void;
  loadingId: string | null;
  loadedFiles: string[];
}

export function FileSelector({ onLoad, loadingId, loadedFiles }: FileSelectorProps) {
  const { files, loading, error } = useGeoJSONFiles();
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full group"
      >
        <div className="flex items-center gap-2">
          <FolderOpen className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="text-xs font-mono tracking-widest uppercase text-white/50 group-hover:text-white/70 transition-colors">
            GeoJSON Files
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${expanded ? "" : "-rotate-90"}`}
        />
      </button>

      {expanded && (
        <div className="space-y-1.5 animate-fade-in">
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-4 text-white/30">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs font-mono">Scanning files…</span>
            </div>
          ) : error ? (
            <div className="px-3 py-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400 font-mono">{error}</p>
            </div>
          ) : files.length === 0 ? (
            <div className="px-3 py-4 rounded-lg bg-white/5 border border-white/10 text-center">
              <FileJson className="w-6 h-6 text-white/20 mx-auto mb-2" />
              <p className="text-xs text-white/30 font-mono">No .geojson files found</p>
              <p className="text-xs text-white/20 mt-1">Add files to /public/geojson/</p>
            </div>
          ) : (
            files.map((file) => (
              <FileItem
                key={file.path}
                file={file}
                isLoading={loadingId === file.fileName}
                isLoaded={loadedFiles.includes(file.fileName ?? "")}
                onLoad={() => onLoad(file.fileName ?? file.name, file.path)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface FileItemProps {
  file: GeoJSONFileMeta;
  isLoading: boolean;
  isLoaded: boolean;
  onLoad: () => void;
}

function FileItem({ file, isLoading, isLoaded, onLoad }: FileItemProps) {
  return (
    <div
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all cursor-pointer ${
        isLoaded
          ? "bg-accent-cyan/8 border-accent-cyan/25 hover:bg-accent-cyan/12"
          : "bg-white/4 border-white/8 hover:bg-white/8 hover:border-white/15"
      }`}
      onClick={!isLoading && !isLoaded ? onLoad : undefined}
    >
      {/* File icon */}
      <div
        className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
          isLoaded ? "bg-accent-cyan/20" : "bg-white/8 group-hover:bg-white/12"
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-accent-cyan animate-spin" />
        ) : (
          <FileJson className={`w-4 h-4 ${isLoaded ? "text-accent-cyan" : "text-white/40"}`} />
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm truncate font-body leading-tight ${
            isLoaded ? "text-white/90" : "text-white/60 group-hover:text-white/80"
          }`}
        >
          {file.name}
        </p>
        <p className="text-xs text-white/25 font-mono truncate mt-0.5">{file.fileName}</p>
      </div>

      {/* Add / Loaded */}
      {isLoaded ? (
        <div className="w-5 h-5 rounded-full bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLoad();
          }}
          disabled={isLoading}
          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md bg-accent-cyan/20 hover:bg-accent-cyan/30 flex items-center justify-center flex-shrink-0 transition-all border border-accent-cyan/30 disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5 text-accent-cyan" />
        </button>
      )}
    </div>
  );
}
