# GeoDash — GeoJSON Map Dashboard

A modern, production-grade geospatial visualization dashboard built with **Next.js 14**, **Deck.gl**, **MapLibre GL**, and **Tailwind CSS**.

---

## ✨ Features

- **30/70 split layout** — sidebar with controls + full map view
- **Dynamic GeoJSON loading** — auto-discovers all `.geojson` files in `/public/geojson/`
- **Multi-layer support** — load and manage multiple GeoJSON layers simultaneously
- **Per-layer controls** — fill color, stroke color, opacity, stroke width
- **Layer visibility toggle** — show/hide individual layers
- **Layer reordering** — move layers up/down in render order
- **Geometry type support** — Points, LineStrings, Polygons (and Multi variants)
- **Interactive tooltips** — hover over features to see properties
- **Map style switching** — Dark (Stadia Maps) + OpenStreetMap modes
- **Error handling** — invalid files, network failures, empty datasets
- **Coordinates HUD** — live lat/lng, zoom, pitch display
- **Beautiful dark UI** — obsidian theme with neon accents

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Map Engine | MapLibre GL + react-map-gl |
| Visualization | Deck.gl (GeoJsonLayer) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Fonts | Syne, DM Sans, JetBrains Mono (Google Fonts) |

---

## 📁 Project Structure

```
geodash/
├── app/
│   ├── api/
│   │   └── geojson-files/
│   │       └── route.ts          # API: lists GeoJSON files from /public/geojson
│   ├── globals.css               # Global styles + Tailwind directives
│   ├── layout.tsx                # Root layout with Google Fonts
│   └── page.tsx                  # Main dashboard page
│
├── components/
│   ├── map/
│   │   ├── MapView.tsx           # Core Deck.gl + MapLibre map component
│   │   └── MapViewWrapper.tsx    # Dynamic (no-SSR) wrapper
│   ├── sidebar/
│   │   ├── FileSelector.tsx      # GeoJSON file list + load button
│   │   ├── LayerCard.tsx         # Per-layer controls card
│   │   ├── LayerPanel.tsx        # Layer list manager
│   │   └── Sidebar.tsx           # Full sidebar shell
│   └── ui/
│       ├── ColorPicker.tsx       # RGBA color picker with presets
│       ├── GeometryBadge.tsx     # Geometry type chip
│       ├── Slider.tsx            # Custom slider control
│       └── Toast.tsx             # Error/info notification
│
├── lib/
│   ├── hooks/
│   │   ├── useLayers.ts          # Layer state management hook
│   │   └── useGeoJSONFiles.ts    # File discovery hook
│   └── utils/
│       ├── geojson.ts            # Load, validate, parse GeoJSON
│       └── map-config.ts         # View state, map tile styles
│
├── public/
│   └── geojson/                  # ← DROP YOUR .geojson FILES HERE
│       ├── world-cities.geojson  # Sample: Points
│       ├── india-states.geojson  # Sample: Polygons
│       ├── india-rivers.geojson  # Sample: LineStrings
│       └── india-airports.geojson # Sample: Mixed types
│
├── types/
│   └── index.ts                  # All TypeScript interfaces
│
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## ➕ Adding Your Own GeoJSON Files

Simply drop `.geojson` or `.json` files into `/public/geojson/`. The app automatically discovers and lists them — no config needed.

```bash
cp my-data.geojson public/geojson/
```

The sidebar will show the new file on the next page load (or refresh).

---

## 🗺 Supported Geometry Types

| Type | Visual |
|------|--------|
| `Point` / `MultiPoint` | Filled circles |
| `LineString` / `MultiLineString` | Stroked lines |
| `Polygon` / `MultiPolygon` | Filled + stroked polygons |
| Mixed `FeatureCollection` | All of the above |

---

## ⌨️ Map Interactions

| Action | Interaction |
|--------|------------|
| Pan | Click + drag |
| Zoom | Scroll / pinch |
| Rotate (bearing) | Right-click + drag |
| Tilt (pitch) | Ctrl + drag |
| Reset view | Reset button (↺) |
| Feature info | Hover over feature |

---

## 🏗 Build for Production

```bash
npm run build
npm start
```

---

## 📝 Assignment Notes

- **App Router** used throughout — no `pages/` directory
- **Component separation**: UI components, data hooks, map logic all isolated
- **No hardcoded values** — colors, file paths, zoom levels all dynamic
- **Error handling** covers: invalid JSON, network failures, empty datasets, wrong GeoJSON type
- **TypeScript strict mode** enabled throughout
