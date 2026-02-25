"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AggregateMetrics } from "@/lib/types";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white border border-surface-200 rounded-lg shadow-lg p-3 text-sm">
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: item.payload.color }}
        />
        <span className="text-surface-600">{item.name}:</span>
        <span className="font-semibold text-surface-900">{item.value}</span>
      </div>
    </div>
  );
}

interface DisputesPieChartProps {
  data: AggregateMetrics["disputeBreakdown"];
  totalDisputes: number;
}

export function DisputesPieChart({ data, totalDisputes }: DisputesPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5 flex flex-col">
        <h3 className="text-sm font-semibold text-surface-700 mb-4">
          Dispute Resolution
        </h3>
        <div className="flex-1 flex items-center justify-center text-surface-400 text-sm">
          No disputes in selected period
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-surface-700 mb-1">
        Dispute Resolution
      </h3>
      <p className="text-xs text-surface-500 mb-3">{totalDisputes} total disputes</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
            formatter={(value, entry: any) => (
              <span style={{ color: "#78716c" }}>
                {value} ({entry.payload.value})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
