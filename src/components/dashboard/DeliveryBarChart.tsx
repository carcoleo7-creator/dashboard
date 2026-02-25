"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { AggregateMetrics } from "@/lib/types";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-surface-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-surface-700 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-surface-600">Avg Delivery:</span>
        <span className="font-semibold text-surface-900">{payload[0].value} min</span>
      </div>
    </div>
  );
}

interface DeliveryBarChartProps {
  data: AggregateMetrics["deliveryByStore"];
  avgDelivery: number;
}

export function DeliveryBarChart({ data, avgDelivery }: DeliveryBarChartProps) {
  const chartData = data.map((d) => ({
    store: d.storeNumber.replace("STR-", ""),
    avgMinutes: d.avgMinutes,
    fullStore: d.storeNumber,
  }));

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-surface-700">
          Avg Delivery Time by Store
        </h3>
        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-200">
          Target: 35 min
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 10, left: -10, bottom: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" vertical={false} />
          <XAxis
            dataKey="store"
            tick={{ fontSize: 11, fill: "#78716c" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#78716c" }}
            tickLine={false}
            axisLine={false}
            unit=" m"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#fafaf8" }} />
          <ReferenceLine
            y={35}
            stroke="#E85D04"
            strokeDasharray="4 2"
            label={{ value: "Target", position: "right", fontSize: 10, fill: "#E85D04" }}
          />
          {avgDelivery > 0 && (
            <ReferenceLine
              y={Math.round(avgDelivery)}
              stroke="#8b5cf6"
              strokeDasharray="4 2"
              label={{
                value: `Avg ${Math.round(avgDelivery)}m`,
                position: "insideTopRight",
                fontSize: 10,
                fill: "#8b5cf6",
              }}
            />
          )}
          <Bar
            dataKey="avgMinutes"
            name="Avg Delivery"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
