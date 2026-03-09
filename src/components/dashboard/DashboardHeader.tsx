"use client";

import { format } from "date-fns";
import { UtensilsCrossed, RefreshCw, Download } from "lucide-react";
import { Order } from "@/lib/types";

interface DashboardHeaderProps {
  filteredOrders: Order[];
}

function exportOrdersCSV(orders: Order[]) {
  const headers = [
    "Order ID",
    "Store Number",
    "Store Name",
    "Driver Name",
    "Driver ID",
    "Order Date",
    "Pickup Time",
    "Est. Delivery Time",
    "Actual Delivery Time",
    "Delivery Time (min)",
    "Tracking Quality",
    "Tracking Notes",
    "Dispute Status",
    "Dispute Reason",
    "Compensation Cost",
    "Total Amount",
    "Issues",
    "Customer Rating",
    "Customer Feedback",
  ];

  const rows = orders.map((o) => [
    o.id,
    o.storeNumber,
    o.storeName,
    o.driver.name,
    o.driver.id,
    format(o.orderDate, "yyyy-MM-dd HH:mm"),
    o.pickupTime ? format(o.pickupTime, "yyyy-MM-dd HH:mm") : "",
    format(o.estimatedDeliveryTime, "yyyy-MM-dd HH:mm"),
    o.actualDeliveryTime ? format(o.actualDeliveryTime, "yyyy-MM-dd HH:mm") : "",
    o.deliveryTimeMinutes ?? "",
    o.deliveryTracking,
    o.trackingNotes ?? "",
    o.disputeStatus,
    o.disputeReason ?? "",
    o.compensationCost ?? "",
    o.totalAmount,
    o.issues.map((i) => i.label).join("; "),
    o.customerRating ?? "",
    o.customerFeedback ?? "",
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const val = String(cell);
          return val.includes(",") || val.includes('"') || val.includes("\n")
            ? `"${val.replace(/"/g, '""')}"`
            : val;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DashboardHeader({ filteredOrders }: DashboardHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-sm">
          <UtensilsCrossed className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-surface-900 leading-tight">
            Restaurant Partner Dashboard
          </h1>
          <p className="text-sm text-surface-500">
            Operations &amp; Performance Overview
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right hidden sm:block mr-1">
          <p className="text-xs text-surface-400">Last updated</p>
          <p className="text-sm font-semibold text-surface-700">
            {format(new Date(), "MMM d, yyyy · h:mm a")}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-surface-600 bg-white border border-surface-200 rounded-lg hover:bg-surface-50 hover:border-surface-300 transition-colors shadow-sm"
          onClick={() => exportOrdersCSV(filteredOrders)}
          aria-label="Export orders as CSV"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-surface-600 bg-white border border-surface-200 rounded-lg hover:bg-surface-50 hover:border-surface-300 transition-colors shadow-sm"
          onClick={() => window.location.reload()}
          aria-label="Refresh dashboard"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </div>
  );
}
