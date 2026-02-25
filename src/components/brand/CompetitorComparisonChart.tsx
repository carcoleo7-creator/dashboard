"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CompetitorData } from "@/lib/types";

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
          <span className="font-bold text-surface-900">{p.value}{p.name.includes("Share") ? "%" : p.name.includes("Score") ? "/10" : "%"}</span>
        </div>
      ))}
    </div>
  );
}

type CompetitorMetric = "marketShare" | "satisfactionScore" | "issueRate" | "disputeRate";

const METRIC_OPTIONS: { key: CompetitorMetric; label: string; unit: string; lowerIsBetter?: boolean }[] = [
  { key: "marketShare", label: "Market Share (%)", unit: "%" },
  { key: "satisfactionScore", label: "Satisfaction Score (/10)", unit: "/10" },
  { key: "issueRate", label: "Issue Rate (%)", unit: "%", lowerIsBetter: true },
  { key: "disputeRate", label: "Dispute Rate (%)", unit: "%", lowerIsBetter: true },
];

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CompetitorComparisonChartProps {
  competitors: CompetitorData[];
}

export function CompetitorComparisonChart({ competitors }: CompetitorComparisonChartProps) {
  const [activeMetric, setActiveMetric] = useState<CompetitorMetric>("marketShare");

  const meta = METRIC_OPTIONS.find((m) => m.key === activeMetric)!;

  const chartData = competitors.map((c) => ({
    name: c.name,
    value: c[activeMetric],
    color: c.color,
    isOurBrand: c.name === "Our Brand",
  }));

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-surface-800">Competitive Analysis</h3>
          <p className="text-xs text-surface-500 mt-0.5">
            Compare key metrics across the delivery landscape
          </p>
        </div>
        <div className="flex gap-1 flex-wrap">
          {METRIC_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setActiveMetric(opt.key)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md border transition-colors",
                activeMetric === opt.key
                  ? "bg-brand-500 text-white border-brand-500"
                  : "border-surface-200 text-surface-600 hover:bg-surface-50"
              )}
            >
              {opt.label.split(" ")[0]} {opt.label.split(" ")[1]}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={chartData} margin={{ top: 4, right: 10, left: -10, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#78716c" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#78716c" }}
            tickLine={false}
            axisLine={false}
            unit={meta.unit === "/10" ? "" : "%"}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-white border border-surface-200 rounded-lg shadow-lg p-3 text-sm">
                  <p className="font-semibold text-surface-700 mb-1">{label}</p>
                  <p className="text-surface-900 font-bold">
                    {payload[0].value}{meta.unit}
                    {meta.lowerIsBetter && (
                      <span className="ml-1 text-xs font-normal text-surface-500">(lower is better)</span>
                    )}
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="value" name={meta.label} radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={entry.isOurBrand ? 1 : 0.65}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {meta.lowerIsBetter && (
        <p className="text-xs text-surface-400 mt-2 text-center">
          ↓ Lower values indicate better performance for this metric
        </p>
      )}
    </div>
  );
}
