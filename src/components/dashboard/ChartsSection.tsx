"use client";

import { AggregateMetrics } from "@/lib/types";
import { OrdersLineChart } from "./OrdersLineChart";
import { DisputesPieChart } from "./DisputesPieChart";
import { IssuesBarChart } from "./IssuesBarChart";

interface ChartsSectionProps {
  metrics: AggregateMetrics;
}

export function ChartsSection({ metrics }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Orders trend - takes 2/3 width on large screens */}
      <div className="lg:col-span-2">
        <OrdersLineChart data={metrics.ordersOverTime} />
      </div>
      {/* Dispute breakdown - takes 1/3 width */}
      <div>
        <DisputesPieChart
          data={metrics.disputeBreakdown}
          totalDisputes={metrics.totalDisputes}
        />
      </div>
      {/* Issues by type - full width */}
      <div className="lg:col-span-3">
        <IssuesBarChart data={metrics.issuesByType} />
      </div>
    </div>
  );
}
