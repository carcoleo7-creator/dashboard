"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AggregateMetrics } from "@/lib/types";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-surface-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-surface-700 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-surface-600">{p.name}:</span>
          <span className="font-semibold text-surface-900">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

interface OrdersLineChartProps {
  data: AggregateMetrics["ordersOverTime"];
}

export function OrdersLineChart({ data }: OrdersLineChartProps) {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-surface-700 mb-4">
        Orders &amp; Disputes Over Time
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#78716c" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#78716c" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            name="Orders"
            stroke="#E85D04"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, fill: "#E85D04" }}
          />
          <Line
            type="monotone"
            dataKey="disputes"
            name="Disputes"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, fill: "#8b5cf6" }}
            strokeDasharray="4 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
