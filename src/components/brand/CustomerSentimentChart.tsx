"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SentimentDataPoint } from "@/lib/types";

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
      {[...payload].reverse().map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-surface-600">{p.name}:</span>
          <span className="font-bold text-surface-900">{p.value}%</span>
        </div>
      ))}
    </div>
  );
}

interface CustomerSentimentChartProps {
  data: SentimentDataPoint[];
}

export function CustomerSentimentChart({ data }: CustomerSentimentChartProps) {
  const latest = data[data.length - 1];
  const prev = data[data.length - 2];
  const positiveDelta = latest ? latest.positive - (prev?.positive ?? 0) : 0;

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5 h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-surface-800">Customer Sentiment</h3>
          <p className="text-xs text-surface-500 mt-0.5">7-month rolling view</p>
        </div>
        {latest && (
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">{latest.positive}%</p>
            <p className="text-xs text-surface-500">
              positive{" "}
              {positiveDelta > 0 ? (
                <span className="text-green-600">+{positiveDelta}pts</span>
              ) : positiveDelta < 0 ? (
                <span className="text-red-500">{positiveDelta}pts</span>
              ) : null}
            </p>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} stackOffset="expand">
          <defs>
            <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="neuGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#78716c" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
            tick={{ fontSize: 11, fill: "#78716c" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
          <Area
            type="monotone"
            dataKey="negative"
            name="Negative"
            stackId="1"
            stroke="#ef4444"
            fill="url(#negGrad)"
          />
          <Area
            type="monotone"
            dataKey="neutral"
            name="Neutral"
            stackId="1"
            stroke="#94a3b8"
            fill="url(#neuGrad)"
          />
          <Area
            type="monotone"
            dataKey="positive"
            name="Positive"
            stackId="1"
            stroke="#22c55e"
            fill="url(#posGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
