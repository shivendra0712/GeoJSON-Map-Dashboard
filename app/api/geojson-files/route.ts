import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const geojsonDir = path.join(process.cwd(), "public", "geojson");

    if (!fs.existsSync(geojsonDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = fs
      .readdirSync(geojsonDir)
      .filter((f) => f.endsWith(".geojson") || f.endsWith(".json"))
      .map((fileName) => ({
        name: fileName
          .replace(/\.(geojson|json)$/, "")
          .replace(/-/g, " ")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        path: `/geojson/${fileName}`,
        fileName,
      }));

    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ error: "Failed to read GeoJSON files" }, { status: 500 });
  }
}
