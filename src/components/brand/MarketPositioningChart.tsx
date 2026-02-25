"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { RadarDataPoint } from "@/lib/types";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-surface-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-surface-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-surface-600">{p.name}:</span>
          <span className="font-bold text-surface-900">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

interface MarketPositioningChartProps {
  data: RadarDataPoint[];
}

export function MarketPositioningChart({ data }: MarketPositioningChartProps) {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5 h-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-surface-800">Market Positioning</h3>
        <p className="text-xs text-surface-500 mt-0.5">
          Multi-dimensional comparison vs. top competitor and industry average
        </p>
      </div>
      <ResponsiveContainer width="100%" height={290}>
        <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="#e7e5e4" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 11, fill: "#78716c" }}
          />
          <Radar
            name="Our Brand"
            dataKey="ourBrand"
            stroke="#E85D04"
            fill="#E85D04"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Radar
            name="Top Competitor"
            dataKey="topCompetitor"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.15}
            strokeWidth={2}
            strokeDasharray="4 2"
          />
          <Radar
            name="Industry Avg"
            dataKey="industryAvg"
            stroke="#94a3b8"
            fill="#94a3b8"
            fillOpacity={0.10}
            strokeWidth={1.5}
            strokeDasharray="2 3"
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
