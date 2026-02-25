"use client";

import { useState, useMemo } from "react";
import { subDays } from "date-fns";
import { isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import {
  Order,
  FilterState,
  AggregateMetrics,
  OrderStatus,
  DisputeStatus,
} from "@/lib/types";
import {
  MOCK_ORDERS,
  computeOrdersOverTime,
  computeIssuesByType,
} from "@/lib/mock-data";

const DEFAULT_FILTERS: FilterState = {
  dateFrom: subDays(new Date(), 30),
  dateTo: new Date(),
  storeNumber: "all",
  orderStatus: "all",
  disputeStatus: "all",
};

export function useDashboardFilters() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((order) => {
      // Date range
      if (isBefore(order.orderDate, startOfDay(filters.dateFrom))) return false;
      if (isAfter(order.orderDate, endOfDay(filters.dateTo))) return false;

      // Store
      if (filters.storeNumber !== "all" && order.storeNumber !== filters.storeNumber)
        return false;

      // Order status
      if (filters.orderStatus !== "all" && order.trackingStatus !== filters.orderStatus)
        return false;

      // Dispute status
      if (filters.disputeStatus !== "all" && order.disputeStatus !== filters.disputeStatus)
        return false;

      return true;
    });
  }, [filters]);

  const metrics = useMemo((): AggregateMetrics => {
    const totalOrders = filteredOrders.length;

    const disputedOrders = filteredOrders.filter((o) => o.disputeStatus !== "none");
    const totalDisputes = disputedOrders.length;
    const approvedDisputes = filteredOrders.filter((o) => o.disputeStatus === "approved").length;
    const deniedDisputes = filteredOrders.filter((o) => o.disputeStatus === "denied").length;
    const pendingDisputes = filteredOrders.filter((o) => o.disputeStatus === "pending").length;

    const compensationOrders = filteredOrders.filter((o) => o.compensationCost !== null);
    const avgCompensationCost =
      compensationOrders.length > 0
        ? compensationOrders.reduce((sum, o) => sum + (o.compensationCost ?? 0), 0) /
          compensationOrders.length
        : 0;

    const deliveredOrders = filteredOrders.filter((o) => o.deliveryTimeMinutes !== null);
    const avgDeliveryTimeMinutes =
      deliveredOrders.length > 0
        ? deliveredOrders.reduce((sum, o) => sum + (o.deliveryTimeMinutes ?? 0), 0) /
          deliveredOrders.length
        : 0;

    const completedOrders = filteredOrders.filter((o) => o.trackingStatus === "delivered");
    const orderCompletionRate =
      totalOrders > 0 ? (completedOrders.length / totalOrders) * 100 : 0;

    const ordersOverTime = computeOrdersOverTime(filteredOrders);
    const issuesByType = computeIssuesByType(filteredOrders);

    const disputeBreakdown = [
      { name: "Approved", value: approvedDisputes, color: "#22c55e" },
      { name: "Denied", value: deniedDisputes, color: "#ef4444" },
      { name: "Pending", value: pendingDisputes, color: "#f59e0b" },
    ].filter((d) => d.value > 0);

    return {
      totalOrders,
      totalDisputes,
      approvedDisputes,
      deniedDisputes,
      pendingDisputes,
      avgCompensationCost,
      avgDeliveryTimeMinutes,
      orderCompletionRate,
      ordersOverTime,
      issuesByType,
      disputeBreakdown,
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

  function drillIntoOrderStatus(status: OrderStatus | "all") {
    setFilters((prev) => ({ ...prev, orderStatus: status }));
  }

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredOrders,
    metrics,
    selectedOrder,
    setSelectedOrder,
    drillIntoDisputeStatus,
    drillIntoOrderStatus,
  };
}
