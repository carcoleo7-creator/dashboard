"use client";

import { cn } from "@/lib/utils";
import { OrderStatus, DisputeStatus } from "@/lib/types";

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; classes: string }
> = {
  delivered: {
    label: "Delivered",
    classes: "bg-green-50 text-green-700 border border-green-200",
  },
  in_transit: {
    label: "In Transit",
    classes: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  canceled: {
    label: "Canceled",
    classes: "bg-orange-50 text-orange-700 border border-orange-200",
  },
  pending: {
    label: "Pending",
    classes: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  },
};

const DISPUTE_STATUS_CONFIG: Record<
  DisputeStatus,
  { label: string; classes: string }
> = {
  approved: {
    label: "Approved",
    classes: "bg-green-50 text-green-700 border border-green-200",
  },
  denied: {
    label: "Denied",
    classes: "bg-red-50 text-red-700 border border-red-200",
  },
  pending: {
    label: "Pending Review",
    classes: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  none: {
    label: "No Dispute",
    classes: "bg-surface-100 text-surface-600 border border-surface-200",
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        config.classes,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {config.label}
    </span>
  );
}

interface DisputeStatusBadgeProps {
  status: DisputeStatus;
  className?: string;
}

export function DisputeStatusBadge({ status, className }: DisputeStatusBadgeProps) {
  const config = DISPUTE_STATUS_CONFIG[status];
  if (status === "none") return null;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  );
}
