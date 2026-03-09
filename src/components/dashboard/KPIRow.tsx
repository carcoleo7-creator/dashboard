"use client";

import {
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  ScanLine,
  ScanSearch,
} from "lucide-react";
import { KPICard } from "./KPICard";
import { AggregateMetrics } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface KPIRowProps {
  metrics: AggregateMetrics;
  activeFilter: string | null;
  onDrillDisputes: () => void;
  onDrillApproved: () => void;
  onDrillAllOrders: () => void;
  onDrillPartiallyTracked: () => void;
  onDrillUntracked: () => void;
}

export function KPIRow({
  metrics,
  activeFilter,
  onDrillDisputes,
  onDrillApproved,
  onDrillAllOrders,
  onDrillPartiallyTracked,
  onDrillUntracked,
}: KPIRowProps) {
  const disputeRate =
    metrics.totalOrders > 0
      ? formatPercent((metrics.totalDisputes / metrics.totalOrders) * 100)
      : "0%";

  const approvalRate =
    metrics.totalDisputes > 0
      ? formatPercent((metrics.approvedDisputes / metrics.totalDisputes) * 100)
      : "0%";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <KPICard
        label="Total Orders"
        value={metrics.totalOrders.toLocaleString()}
        subValue="completed & delivered"
        icon={<ShoppingCart className="w-5 h-5 text-brand-600" />}
        iconBg="bg-brand-50"
        onClick={onDrillAllOrders}
        isActive={activeFilter === "all"}
        tooltip="Click to view all orders"
      />
      <KPICard
        label="Partially Tracked"
        value={metrics.partiallyTrackedCount.toLocaleString()}
        subValue={
          metrics.totalOrders > 0
            ? `${formatPercent((metrics.partiallyTrackedCount / metrics.totalOrders) * 100)} of orders`
            : "0% of orders"
        }
        icon={<ScanSearch className="w-5 h-5 text-amber-600" />}
        iconBg="bg-amber-50"
        onClick={onDrillPartiallyTracked}
        isActive={activeFilter === "partially_tracked"}
        tooltip="Click to filter partially tracked orders"
      />
      <KPICard
        label="Untracked"
        value={metrics.untrackedCount.toLocaleString()}
        subValue={
          metrics.totalOrders > 0
            ? `${formatPercent((metrics.untrackedCount / metrics.totalOrders) * 100)} of orders`
            : "0% of orders"
        }
        icon={<ScanLine className="w-5 h-5 text-red-500" />}
        iconBg="bg-red-50"
        onClick={onDrillUntracked}
        isActive={activeFilter === "untracked"}
        tooltip="Click to filter untracked orders"
      />
      <KPICard
        label="Total Disputes"
        value={metrics.totalDisputes.toLocaleString()}
        subValue={`${disputeRate} of orders`}
        icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
        iconBg="bg-amber-50"
        trend={metrics.totalDisputes === 0 ? "neutral" : metrics.totalDisputes > 50 ? "up" : "neutral"}
        trendLabel={`${metrics.pendingDisputes} pending review`}
        trendPositive={false}
        onClick={onDrillDisputes}
        isActive={activeFilter === "disputes"}
        tooltip="Click to filter disputed orders"
      />
      <KPICard
        label="Approved Disputes"
        value={metrics.approvedDisputes.toLocaleString()}
        subValue={`${approvalRate} approval rate`}
        icon={<CheckCircle className="w-5 h-5 text-green-600" />}
        iconBg="bg-green-50"
        onClick={onDrillApproved}
        isActive={activeFilter === "approved"}
        tooltip="Click to filter approved disputes"
      />
      <KPICard
        label="Avg Compensation"
        value={
          metrics.avgCompensationCost > 0
            ? formatCurrency(metrics.avgCompensationCost)
            : "—"
        }
        subValue="per approved dispute"
        icon={<DollarSign className="w-5 h-5 text-purple-600" />}
        iconBg="bg-purple-50"
      />
    </div>
  );
}
