"use client";

import { useDashboardFilters } from "@/hooks/useDashboardFilters";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KPIRow } from "@/components/dashboard/KPIRow";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { OrderDetailModal } from "@/components/dashboard/OrderDetailModal";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { useState } from "react";

export default function DashboardPage() {
  const {
    filters,
    updateFilter,
    resetFilters,
    filteredOrders,
    metrics,
    selectedOrder,
    setSelectedOrder,
    drillIntoDisputeStatus,
    drillIntoOrderStatus,
  } = useDashboardFilters();

  const [activeKpiFilter, setActiveKpiFilter] = useState<string | null>(null);

  function handleDrillAllOrders() {
    resetFilters();
    setActiveKpiFilter("all");
    setTimeout(() => {
      document.getElementById("orders-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleDrillDisputes() {
    drillIntoDisputeStatus("pending");
    updateFilter("disputeStatus", "pending");
    setActiveKpiFilter("disputes");
    setTimeout(() => {
      document.getElementById("orders-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleDrillApproved() {
    drillIntoDisputeStatus("approved");
    setActiveKpiFilter("approved");
    setTimeout(() => {
      document.getElementById("orders-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Sidebar + content layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-surface-800 text-white fixed left-0 top-0 z-20">
          <div className="p-5 border-b border-surface-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <div>
                <p className="text-sm font-bold">RestaurantOS</p>
                <p className="text-xs text-surface-300">Partner Portal</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1" aria-label="Dashboard navigation">
            {[
              { icon: "📊", label: "Dashboard", active: true },
              { icon: "🛒", label: "Orders", active: false },
              { icon: "⚠️", label: "Disputes", active: false },
              { icon: "🚗", label: "Drivers", active: false },
              { icon: "🏪", label: "Stores", active: false },
              { icon: "📈", label: "Analytics", active: false },
              { icon: "⚙️", label: "Settings", active: false },
            ].map(({ icon, label, active }) => (
              <button
                key={label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-500 text-white"
                    : "text-surface-300 hover:bg-surface-700 hover:text-white"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-surface-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-600 flex items-center justify-center text-xs font-bold text-white">
                AP
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">Admin Partner</p>
                <p className="text-xs text-surface-400 truncate">admin@partner.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-60 min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-10 bg-white border-b border-surface-200 shadow-sm px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-surface-500">
                <span>RestaurantOS</span>
                <span>/</span>
                <span className="text-surface-800 font-medium">Dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-surface-500 hidden sm:block">
                  {filteredOrders.length} orders loaded
                </span>
                <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                  AP
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="p-6 space-y-6 max-w-[1600px]">
            {/* Header */}
            <DashboardHeader />

            {/* Filters */}
            <FilterBar
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={() => {
                resetFilters();
                setActiveKpiFilter(null);
              }}
              totalFiltered={filteredOrders.length}
              totalAll={MOCK_ORDERS.length}
            />

            {/* KPI Cards */}
            <KPIRow
              metrics={metrics}
              activeFilter={activeKpiFilter}
              onDrillAllOrders={handleDrillAllOrders}
              onDrillDisputes={handleDrillDisputes}
              onDrillApproved={handleDrillApproved}
            />

            {/* Charts */}
            <ChartsSection metrics={metrics} />

            {/* Orders Table */}
            <div id="orders-section">
              <OrdersTable
                orders={filteredOrders}
                onSelectOrder={setSelectedOrder}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
