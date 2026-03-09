"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  TriangleAlert,
} from "lucide-react";
import { cn, formatCurrency, formatDuration } from "@/lib/utils";
import { Order } from "@/lib/types";
import { DeliveryTrackingBadge, DisputeStatusBadge } from "./StatusBadge";

type SortKey =
  | keyof Pick<
      Order,
      | "id"
      | "storeNumber"
      | "deliveryTracking"
      | "orderDate"
      | "deliveryTimeMinutes"
      | "disputeStatus"
      | "totalAmount"
    >
  | "issueCount";

const PAGE_SIZE = 20;

interface OrdersTableProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

function SortIcon({
  field,
  sortKey,
  sortDir,
}: {
  field: SortKey;
  sortKey: SortKey | null;
  sortDir: "asc" | "desc";
}) {
  if (sortKey !== field) return <ChevronsUpDown className="w-3.5 h-3.5 text-surface-300" />;
  return sortDir === "asc" ? (
    <ChevronUp className="w-3.5 h-3.5 text-brand-500" />
  ) : (
    <ChevronDown className="w-3.5 h-3.5 text-brand-500" />
  );
}

export function OrdersTable({ orders, onSelectOrder }: OrdersTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>("orderDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  }

  const sorted = useMemo(() => {
    if (!sortKey) return orders;
    return [...orders].sort((a, b) => {
      let aVal: string | number | Date | null;
      let bVal: string | number | Date | null;
      if (sortKey === "issueCount") {
        aVal = a.issues.length;
        bVal = b.issues.length;
      } else {
        aVal = a[sortKey];
        bVal = b[sortKey];
      }
      if (aVal === null) aVal = "";
      if (bVal === null) bVal = "";
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [orders, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function Th({
    field,
    label,
    className,
  }: {
    field?: SortKey;
    label: string;
    className?: string;
  }) {
    return (
      <th
        className={cn(
          "px-3 py-3 text-left text-xs font-semibold text-surface-500 whitespace-nowrap",
          field && "cursor-pointer hover:text-surface-900 select-none",
          className
        )}
        onClick={field ? () => handleSort(field) : undefined}
        aria-sort={
          field && sortKey === field
            ? sortDir === "asc"
              ? "ascending"
              : "descending"
            : undefined
        }
      >
        <div className="flex items-center gap-1">
          {label}
          {field && <SortIcon field={field} sortKey={sortKey} sortDir={sortDir} />}
        </div>
      </th>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
      {/* Table header */}
      <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-surface-800">Order List</h3>
          <p className="text-xs text-surface-500 mt-0.5">
            {orders.length.toLocaleString()} orders
            {orders.length !== sorted.length ? ` · ${sorted.length} sorted` : ""}
          </p>
        </div>
        <div className="text-xs text-surface-500">
          Page {page} of {totalPages}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]" aria-label="Orders table">
          <thead>
            <tr className="bg-surface-50 border-b border-surface-100">
              <Th field="id" label="Order ID" />
              <Th field="storeNumber" label="Store" />
              <Th field="deliveryTracking" label="Tracking" />
              <Th label="Driver" />
              <Th field="orderDate" label="Event Date" />
              <Th field="deliveryTimeMinutes" label="Delivery Time" />
              <Th field="disputeStatus" label="Dispute" />
              <Th field="issueCount" label="Issues" />
              <Th label="Actions" className="text-right" />
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-sm text-surface-400">
                  No orders match your filters.
                </td>
              </tr>
            ) : (
              paginated.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectOrder(order);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for order ${order.id}`}
                  className="border-b border-surface-100 last:border-0 hover:bg-orange-50 cursor-pointer transition-colors focus:outline-none focus:bg-orange-50"
                >
                  <td className="px-3 py-3">
                    <span className="text-xs font-mono font-semibold text-brand-600">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div>
                      <p className="text-xs font-semibold text-surface-800">
                        {order.storeNumber}
                      </p>
                      <p className="text-xs text-surface-400 truncate max-w-[100px]">
                        {order.storeName}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <DeliveryTrackingBadge status={order.deliveryTracking} />
                  </td>
                  <td className="px-3 py-3">
                    <div>
                      <p className="text-xs font-medium text-surface-800 truncate max-w-[120px]">
                        {order.driver.name}
                      </p>
                      <p className="text-xs text-surface-400">{order.driver.id}</p>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div>
                      <p className="text-xs font-medium text-surface-800">
                        {format(order.orderDate, "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-surface-400">
                        {format(order.orderDate, "h:mm a")}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {order.deliveryTimeMinutes !== null ? (
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          order.deliveryTimeMinutes <= 35
                            ? "text-green-600"
                            : order.deliveryTimeMinutes > 50
                            ? "text-red-500"
                            : "text-amber-600"
                        )}
                      >
                        {formatDuration(order.deliveryTimeMinutes)}
                      </span>
                    ) : (
                      <span className="text-xs text-surface-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {order.disputeStatus !== "none" ? (
                      <DisputeStatusBadge status={order.disputeStatus} />
                    ) : (
                      <span className="text-xs text-surface-300">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {order.issues.length > 0 ? (
                      <span
                        title={order.issues.map((i) => i.label).join(", ")}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200"
                      >
                        <TriangleAlert className="w-3 h-3" />
                        {order.issues.length}
                      </span>
                    ) : (
                      <span className="text-xs text-surface-300">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(order);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-medium transition-colors"
                      aria-label={`View details for ${order.id}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 border-t border-surface-100 flex items-center justify-between bg-surface-50">
        <p className="text-xs text-surface-500">
          Showing {Math.min((page - 1) * PAGE_SIZE + 1, orders.length)}–
          {Math.min(page * PAGE_SIZE, orders.length)} of {orders.length.toLocaleString()}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-md border border-surface-200 text-surface-500 hover:text-surface-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {/* Page numbers */}
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={cn(
                  "w-7 h-7 text-xs rounded-md border transition-colors",
                  page === pageNum
                    ? "bg-brand-500 text-white border-brand-500 font-semibold"
                    : "border-surface-200 text-surface-600 hover:bg-white hover:text-surface-900"
                )}
                aria-label={`Go to page ${pageNum}`}
                aria-current={page === pageNum ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 7 && (
            <>
              <span className="text-xs text-surface-400">…</span>
              <button
                onClick={() => setPage(totalPages)}
                className={cn(
                  "w-7 h-7 text-xs rounded-md border transition-colors",
                  page === totalPages
                    ? "bg-brand-500 text-white border-brand-500 font-semibold"
                    : "border-surface-200 text-surface-600 hover:bg-white"
                )}
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-md border border-surface-200 text-surface-500 hover:text-surface-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
