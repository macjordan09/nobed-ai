"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import L from "leaflet";
import { HOSPITALS, STATUS_META, type OperationalHospital } from "@/lib/operational";

// Real OpenStreetMap-backed map for the landing page. Tiles: CARTO basemaps
// (OSM data), free and key-less, consistent with the zero-paid-account rule,
// with the dark "command-centre" theme to match the hero. Pins are custom
// status markers; the hero adds a route to the nearest available ICU.

const TILES = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
};

// Custom status pin: colour + glyph (never colour alone), white ring, soft glow.
function pinIcon(h: OperationalHospital, size = 24) {
  const m = STATUS_META[h.status];
  const half = size / 2;
  return L.divIcon({
    className: "nobed-cap-pin",
    html: `<span title="${h.name}: ${m.label}" style="
      display:flex;align-items:center;justify-content:center;
      width:${size}px;height:${size}px;border-radius:50%;
      background:${m.hex};color:#fff;font:800 12px/1 system-ui,sans-serif;
      border:2px solid #fff;box-shadow:0 0 0 2px ${m.hex}55, 0 2px 6px rgba(0,0,0,.5);
    ">${m.glyph}</span>`,
    iconSize: [size, size],
    iconAnchor: [half, half],
    popupAnchor: [0, -half],
  });
}

const metric = (h: OperationalHospital, label: string) =>
  h.resources.find((r) => r.label === label)?.value ?? "n/a";

// Incident + nearest available ICU (Ridge) for the hero route demo.
const INCIDENT: [number, number] = [5.55, -0.45];

export default function LiveCapacityMap({
  hospitals = HOSPITALS,
  theme = "dark",
  interactive = false,
  showRoute = false,
  className = "",
}: {
  hospitals?: OperationalHospital[];
  theme?: "dark" | "light";
  interactive?: boolean;
  showRoute?: boolean;
  className?: string;
}) {
  const tiles = TILES[theme];
  const ridge = hospitals.find((h) => h.id === "ridge");

  // Frame the markers (plus the incident when a route is shown) with padding.
  const pts: [number, number][] = hospitals.map((h) => [h.lat, h.lng]);
  if (showRoute) pts.push(INCIDENT);
  const lats = pts.map((p) => p[0]);
  const lngs = pts.map((p) => p[1]);
  const bounds: [[number, number], [number, number]] = [
    [Math.min(...lats) - 0.35, Math.min(...lngs) - 0.35],
    [Math.max(...lats) + 0.35, Math.max(...lngs) + 0.35],
  ];

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [12, 12] }}
      className={className}
      style={{ height: "100%", width: "100%", background: theme === "dark" ? "#0b1220" : "#e2e8f0" }}
      zoomControl={interactive}
      scrollWheelZoom={false}
      dragging={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
      boxZoom={interactive}
      keyboard={interactive}
      attributionControl={false}
    >
      <TileLayer url={tiles.url} attribution={tiles.attribution} subdomains="abcd" />

      {showRoute && ridge && (
        <>
          <Polyline
            positions={[INCIDENT, [ridge.lat, ridge.lng]]}
            pathOptions={{ color: "#22d3ee", weight: 3, dashArray: "6 7", opacity: 0.95 }}
          />
          <CircleMarker center={INCIDENT} radius={11} pathOptions={{ color: "#22d3ee", weight: 1, opacity: 0.5, fillOpacity: 0 }} />
          <CircleMarker center={INCIDENT} radius={4.5} pathOptions={{ color: "#0b1220", weight: 1.5, fillColor: "#f8fafc", fillOpacity: 1 }} />
        </>
      )}

      {hospitals.map((h) => (
        <Marker key={h.id} position={[h.lat, h.lng]} icon={pinIcon(h)}>
          <Popup>
            <div style={{ minWidth: 190 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{h.name}</div>
              <div style={{ color: "#64748b", fontSize: 11, marginBottom: 6 }}>
                {h.facilityType} · {h.region}
              </div>
              <span
                style={{
                  display: "inline-block", padding: "2px 8px", borderRadius: 999,
                  background: STATUS_META[h.status].hex, color: "#fff", fontSize: 11, fontWeight: 700,
                }}
              >
                {STATUS_META[h.status].label}
              </span>
              <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span>Emergency beds</span><b>{metric(h, "Available beds")}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span>ICU</span><b>{metric(h, "ICU capacity")}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span>Oxygen</span><b>{metric(h, "Oxygen supply")}</b>
                </div>
              </div>
              <a href={`/capacity/${h.id}`} style={{ display: "inline-block", marginTop: 8, fontSize: 12, fontWeight: 700, color: "#0F7A45" }}>
                View operational status →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
