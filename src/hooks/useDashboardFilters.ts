"use client";

import { useState, useMemo } from "react";
import { subDays, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import {
  Order,
  FilterState,
  AggregateMetrics,
  DisputeStatus,
  DeliveryTrackingStatus,
} from "@/lib/types";
import {
  MOCK_ORDERS,
  computeOrdersOverTime,
  computeIssuesByType,
} from "@/lib/mock-data";

// Dashboard only surfaces completed (delivered) orders
const COMPLETED_ORDERS = MOCK_ORDERS.filter((o) => o.trackingStatus === "delivered");

const DEFAULT_FILTERS: FilterState = {
  dateFrom: subDays(new Date(), 30),
  dateTo: new Date(),
  storeNumber: "all",
  deliveryTracking: "all",
  disputeStatus: "all",
};

export function useDashboardFilters() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return COMPLETED_ORDERS.filter((order) => {
      if (isBefore(order.orderDate, startOfDay(filters.dateFrom))) return false;
      if (isAfter(order.orderDate, endOfDay(filters.dateTo))) return false;

      if (filters.storeNumber !== "all" && order.storeNumber !== filters.storeNumber)
        return false;

      if (filters.deliveryTracking !== "all" && order.deliveryTracking !== filters.deliveryTracking)
        return false;

      if (filters.disputeStatus !== "all" && order.disputeStatus !== filters.disputeStatus)
        return false;

      return true;
    });
  }, [filters]);

  const metrics = useMemo((): AggregateMetrics => {
    const totalOrders = filteredOrders.length;

    const totalDisputes = filteredOrders.filter((o) => o.disputeStatus !== "none").length;
    const approvedDisputes = filteredOrders.filter((o) => o.disputeStatus === "approved").length;
    const deniedDisputes = filteredOrders.filter((o) => o.disputeStatus === "denied").length;
    const pendingDisputes = filteredOrders.filter((o) => o.disputeStatus === "pending").length;

    const compensationOrders = filteredOrders.filter((o) => o.compensationCost !== null);
    const avgCompensationCost =
      compensationOrders.length > 0
        ? compensationOrders.reduce((sum, o) => sum + (o.compensationCost ?? 0), 0) /
          compensationOrders.length
        : 0;

    const avgDeliveryTimeMinutes =
      totalOrders > 0
        ? filteredOrders.reduce((sum, o) => sum + (o.deliveryTimeMinutes ?? 0), 0) / totalOrders
        : 0;

    const trackedCount = filteredOrders.filter((o) => o.deliveryTracking === "tracked").length;
    const partialCount = filteredOrders.filter((o) => o.deliveryTracking === "partially_tracked").length;
    const untrackedCount = filteredOrders.filter((o) => o.deliveryTracking === "untracked").length;
    const trackingCoverage = totalOrders > 0 ? (trackedCount / totalOrders) * 100 : 0;

    const ordersOverTime = computeOrdersOverTime(filteredOrders);
    const issuesByType = computeIssuesByType(filteredOrders);

    const disputeBreakdown = [
      { name: "Approved", value: approvedDisputes, color: "#22c55e" },
      { name: "Denied", value: deniedDisputes, color: "#ef4444" },
      { name: "Pending", value: pendingDisputes, color: "#f59e0b" },
    ].filter((d) => d.value > 0);

    const trackingBreakdown = [
      { name: "Tracked", value: trackedCount, color: "#22c55e" },
      { name: "Partially Tracked", value: partialCount, color: "#f59e0b" },
      { name: "Untracked", value: untrackedCount, color: "#ef4444" },
    ].filter((d) => d.value > 0);

    return {
      totalOrders,
      totalDisputes,
      approvedDisputes,
      deniedDisputes,
      pendingDisputes,
      avgCompensationCost,
      avgDeliveryTimeMinutes,
      trackedCount,
      partiallyTrackedCount: partialCount,
      untrackedCount,
      trackingCoverage,
      ordersOverTime,
      issuesByType,
      disputeBreakdown,
      trackingBreakdown,
    };
  }, [filteredOrders]);

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  function drillIntoDisputeStatus(status: DisputeStatus | "all") {
    setFilters((prev) => ({ ...prev, disputeStatus: status }));
  }

  function drillIntoTrackingStatus(status: DeliveryTrackingStatus | "all") {
    setFilters((prev) => ({ ...prev, deliveryTracking: status }));
  }

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredOrders,
    totalCompleted: COMPLETED_ORDERS.length,
    metrics,
    selectedOrder,
    setSelectedOrder,
    drillIntoDisputeStatus,
    drillIntoTrackingStatus,
  };
}
