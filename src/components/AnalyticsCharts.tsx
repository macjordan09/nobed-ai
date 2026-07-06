"use client";

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList,
} from "recharts";
import { STATUS_HEX, STATUS_WORD, ALL_TIERS } from "@/lib/status";

interface Props {
  statusDist: Record<string, number>;
  regions: { region: string; pressure: number; emergencyFree: number }[];
  funnel: Record<string, number>;
  emergencyCategories: Record<string, number>;
}

const FUNNEL_ORDER = ["Submitted", "Accepted", "InTransit", "Arrived", "Closed", "Declined", "Redirected", "Escalated"];

export function AnalyticsCharts({ statusDist, regions, funnel, emergencyCategories }: Props) {
  const statusData = ALL_TIERS.map((k) => ({
    name: STATUS_WORD[k],
    key: k,
    value: statusDist[k] ?? 0,
  }));
  const regionData = regions.slice(0, 8).map((r) => ({ region: r.region.replace(" Region", ""), pressure: r.pressure }));
  const funnelData = FUNNEL_ORDER.filter((s) => funnel[s]).map((s) => ({ status: s, count: funnel[s] }));
  const catData = Object.entries(emergencyCategories).map(([name, count]) => ({ name, count }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="National capacity status">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
              {statusData.map((d) => (
                <Cell key={d.key} fill={STATUS_HEX[d.key]} />
              ))}
              <LabelList dataKey="value" position="outside" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <Legend />
      </Card>

      <Card title="Regional bed pressure (higher = worse)">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={regionData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} fontSize={11} />
            <YAxis type="category" dataKey="region" width={90} fontSize={11} />
            <Tooltip />
            <Bar dataKey="pressure" radius={[0, 4, 4, 0]}>
              {regionData.map((d) => (
                <Cell key={d.region} fill={d.pressure >= 60 ? STATUS_HEX.full : d.pressure >= 30 ? STATUS_HEX.limited : STATUS_HEX.available} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Referral status funnel">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={funnelData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="status" fontSize={10} interval={0} angle={-20} textAnchor="end" height={50} />
            <YAxis allowDecimals={false} fontSize={11} />
            <Tooltip />
            <Bar dataKey="count" fill="#006B3F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Emergency categories">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={catData} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" allowDecimals={false} fontSize={11} />
            <YAxis type="category" dataKey="name" width={130} fontSize={10} />
            <Tooltip />
            <Bar dataKey="count" fill="#FCD116" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-2 flex justify-center gap-3 text-xs text-slate-600">
      {ALL_TIERS.map((k) => (
        <span key={k} className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_HEX[k] }} />
          {STATUS_WORD[k]}
        </span>
      ))}
    </div>
  );
}
