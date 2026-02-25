"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { AggregateMetrics } from "@/lib/types";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { label: string; color: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white border border-surface-200 rounded-lg shadow-lg p-3 text-sm">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-sm"
          style={{ background: item.payload.color }}
        />
        <span className="text-surface-700 font-medium">{item.payload.label}</span>
      </div>
      <p className="mt-1 text-surface-900 font-bold">
        {item.value} {item.value === 1 ? "order" : "orders"} affected
      </p>
    </div>
  );
}

interface IssuesBarChartProps {
  data: AggregateMetrics["issuesByType"];
}

export function IssuesBarChart({ data }: IssuesBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5 flex flex-col">
        <h3 className="text-sm font-semibold text-surface-700 mb-4">
          Order Issues by Type
        </h3>
        <div className="flex-1 flex items-center justify-center text-surface-400 text-sm py-10">
          No issues reported in selected period
        </div>
      </div>
    );
  }

  const totalIssues = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-surface-700">
            Order Issues by Type
          </h3>
          <p className="text-xs text-surface-400 mt-0.5">
            {totalIssues} total issues reported
          </p>
        </div>
        <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium border border-red-200">
          {data.length} issue {data.length === 1 ? "type" : "types"}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 30, left: -10, bottom: 0 }}
          barCategoryGap="35%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#78716c" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#78716c" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#fafaf8" }} />
          <Bar dataKey="count" name="Issues" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList
              dataKey="count"
              position="top"
              style={{ fontSize: "11px", fill: "#57534e", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
