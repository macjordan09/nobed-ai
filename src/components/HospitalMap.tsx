"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { STATUS_GLYPH, STATUS_HEX, STATUS_LABELS, type StatusColour } from "@/lib/status";
import { VERIFICATION_LABELS } from "@/lib/verification";
import type { HospitalView } from "@/lib/hospitals";

const VERIF_HEX = { verified: "#16A34A", self_reported: "#64748b", stale: "#64748b" } as const;

// Pins encode tier with BOTH colour and shape/glyph (not colour alone):
//   available → round green ✓ · limited → rounded-square amber ! · full → red ✕
// Stale (untrusted) data shows a neutral grey "?" regardless of capacity.
function pinIcon(status: StatusColour, stale = false) {
  const colour = stale ? "#64748b" : STATUS_HEX[status];
  const glyph = stale ? "?" : STATUS_GLYPH[status];
  // distinct border-radius per tier gives a shape cue
  const radius = stale ? "50%" : status === "available" ? "50%" : status === "limited" ? "30%" : "14%";
  return L.divIcon({
    className: "nobed-pin",
    html: `<span style="
      display:flex;align-items:center;justify-content:center;
      width:22px;height:22px;border-radius:${radius};
      background:${colour};color:#fff;font:700 12px/1 system-ui,sans-serif;
      border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.45);">${glyph}</span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });
}

// Show FUNCTIONAL availability; if equipment is the bottleneck, reveal both numbers.
const bedRow = (label: string, bed?: { functional: number; available: number; equipmentBound: boolean }) => {
  const fn = bed?.functional ?? 0;
  const note = bed?.equipmentBound
    ? `<span style="color:#EA580C;font-size:10px"> (${bed.available} bed${bed.available === 1 ? "" : "s"}, no equip)</span>`
    : "";
  return `<div style="display:flex;justify-content:space-between;gap:12px"><span>${label}</span><b>${fn}${note}</b></div>`;
};

export default function HospitalMap({
  hospitals,
  height = "70vh",
}: {
  hospitals: HospitalView[];
  height?: string;
}) {
  return (
    <MapContainer
      center={[7.95, -1.03]}
      zoom={7}
      style={{ height, width: "100%", borderRadius: "0.75rem" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hospitals.map((h) => (
        <Marker key={h.id} position={[h.latitude, h.longitude]} icon={pinIcon(h.status, h.verification === "stale")}>
          <Popup>
            <div style={{ minWidth: 220 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{h.name}</div>
              <div style={{ color: "#64748b", fontSize: 12, marginBottom: 6 }}>
                {h.facilityType} · {h.district}, {h.region}
              </div>
              <div
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: STATUS_HEX[h.status],
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {STATUS_LABELS[h.status]}
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: [
                    bedRow("Emergency", h.beds.emergency),
                    bedRow("ICU", h.beds.icu),
                    bedRow("Maternity", h.beds.maternity),
                    bedRow("Pediatric", h.beds.pediatric),
                    `<div style="display:flex;justify-content:space-between;gap:12px;color:#64748b;font-size:11px"><span>Equip: O₂ ${h.equipment.oxygen} · Vent ${h.equipment.ventilators} · Inc ${h.equipment.incubators}</span></div>`,
                    `<div style="display:flex;justify-content:space-between;gap:12px"><span>Theatre</span><b>${
                      h.theatreAvailable ? "Open" : "Closed"
                    }</b></div>`,
                    `<div style="display:flex;justify-content:space-between;gap:12px"><span>Ambulances</span><b>${
                      h.ambulanceAccept ? "Accepting" : "Not accepting"
                    }</b></div>`,
                  ].join(""),
                }}
                style={{ fontSize: 12, lineHeight: 1.6 }}
              />
              {h.referralNotes && (
                <div style={{ marginTop: 6, fontSize: 11, fontStyle: "italic", color: "#475569" }}>
                  “{h.referralNotes}”
                </div>
              )}
              <div style={{ marginTop: 6, fontSize: 11 }}>
                ☎ <a href={`tel:${h.emergencyContact}`}>{h.emergencyContact}</a>
              </div>
              <div style={{ marginTop: 6, fontSize: 11 }}>
                <span style={{ color: VERIF_HEX[h.verification], fontWeight: 700 }}>
                  {h.verification === "verified" ? "✓ " : h.verification === "stale" ? "! " : "• "}
                  {VERIFICATION_LABELS[h.verification]}
                </span>
              </div>
              <div style={{ marginTop: 2, fontSize: 10, color: "#94a3b8" }}>
                Updated {new Date(h.lastUpdatedAt).toLocaleString("en-GB")}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
