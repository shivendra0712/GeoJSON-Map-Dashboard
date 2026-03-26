"use client";

import { useState } from "react";
import type { LayerColor } from "@/types";
import { layerColorToHex, hexToLayerColor, colorToRGBA } from "@/lib/utils/geojson";

interface ColorPickerProps {
  label: string;
  color: LayerColor;
  onChange: (color: LayerColor) => void;
}

export function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const hexValue = layerColorToHex(color);

  const presets = [
    "#00e5ff", "#c6ff00", "#ff4081", "#7c4dff",
    "#ffab00", "#00bfa5", "#ff6d00", "#ffffff",
  ];

  return (
    <div className="relative">
      <label className="block text-xs font-mono text-white/40 mb-1.5 tracking-widest uppercase">
        {label}
      </label>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-all"
      >
        <span
          className="w-5 h-5 rounded-md border border-white/20 flex-shrink-0"
          style={{ backgroundColor: colorToRGBA(color) }}
        />
        <span className="font-mono text-sm text-white/70">{hexValue.toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-2 left-0 p-3 rounded-xl border border-white/15 bg-obsidian-800/95 backdrop-blur-xl shadow-2xl w-52">
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {presets.map((preset) => (
              <button
                key={preset}
                className="w-9 h-9 rounded-md border-2 transition-all hover:scale-110"
                style={{
                  backgroundColor: preset,
                  borderColor: hexValue === preset ? "white" : "transparent",
                }}
                onClick={() => {
                  onChange(hexToLayerColor(preset, color.a));
                  setOpen(false);
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={hexValue}
              onChange={(e) => onChange(hexToLayerColor(e.target.value, color.a))}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={hexValue.toUpperCase()}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9a-fA-F]{6}$/.test(val)) {
                  onChange(hexToLayerColor(val, color.a));
                }
              }}
              className="flex-1 font-mono text-xs bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white/70 focus:outline-none focus:border-accent-cyan/50"
            />
          </div>
          <div className="mt-3">
            <label className="text-xs text-white/40 font-mono tracking-wider">ALPHA</label>
            <input
              type="range"
              min={0}
              max={255}
              value={color.a}
              onChange={(e) => onChange({ ...color, a: parseInt(e.target.value) })}
              className="w-full mt-1 accent-cyan-400"
            />
          </div>
          <button
            onClick={() => setOpen(false)}
            className="mt-2 w-full text-xs text-white/40 hover:text-white/60 py-1"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
