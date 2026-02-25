"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  AlertTriangle,
  Car,
  Store,
  BarChart3,
  Settings,
  UtensilsCrossed,
} from "lucide-react";

import { useDashboardFilters } from "@/hooks/useDashboardFilters";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KPIRow } from "@/components/dashboard/KPIRow";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { OrderDetailModal } from "@/components/dashboard/OrderDetailModal";
import { BrandView } from "@/components/brand/BrandView";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { BRAND_METRICS } from "@/lib/brand-mock-data";
import { cn } from "@/lib/utils";

type ActiveView = "dashboard" | "brand";

const NAV_ITEMS: {
  id: ActiveView | "other";
  icon: React.ReactNode;
  label: string;
  navigable: boolean;
}[] = [
  { id: "dashboard", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", navigable: true },
  { id: "other",     icon: <ShoppingCart className="w-4 h-4" />,    label: "Orders",    navigable: false },
  { id: "other",     icon: <AlertTriangle className="w-4 h-4" />,   label: "Disputes",  navigable: false },
  { id: "other",     icon: <Car className="w-4 h-4" />,             label: "Drivers",   navigable: false },
  { id: "other",     icon: <Store className="w-4 h-4" />,           label: "Stores",    navigable: false },
  { id: "brand",     icon: <BarChart3 className="w-4 h-4" />,       label: "Brand Analysis", navigable: true },
  { id: "other",     icon: <Settings className="w-4 h-4" />,        label: "Settings",  navigable: false },
];

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");

  const {
    filters,
    updateFilter,
    resetFilters,
    filteredOrders,
    metrics,
    selectedOrder,
    setSelectedOrder,
    drillIntoDisputeStatus,
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

  const breadcrumb = activeView === "brand" ? "Brand Analysis" : "Dashboard";

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="flex">
        {/* ── Sidebar ────────────────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-surface-800 text-white fixed left-0 top-0 z-20">
          {/* Logo */}
          <div className="p-5 border-b border-surface-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">RestaurantOS</p>
                <p className="text-xs text-surface-300">Partner Portal</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1" aria-label="Main navigation">
            {NAV_ITEMS.map(({ id, icon, label, navigable }, i) => {
              const isActive = navigable && id === activeView;
              return (
                <button
                  key={`${label}-${i}`}
                  onClick={() => {
                    if (navigable && (id === "dashboard" || id === "brand")) {
                      setActiveView(id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-500 text-white"
                      : navigable
                      ? "text-surface-300 hover:bg-surface-700 hover:text-white cursor-pointer"
                      : "text-surface-500 cursor-default"
                  )}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={navigable ? 0 : -1}
                >
                  {icon}
                  {label}
                </button>
              );
            })}
          </nav>

          {/* User */}
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

        {/* ── Main ───────────────────────────────────────────────────────── */}
        <main className="flex-1 lg:ml-60 min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-10 bg-white border-b border-surface-200 shadow-sm px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-surface-500">
                <span>RestaurantOS</span>
                <span>/</span>
                <span className="text-surface-800 font-medium">{breadcrumb}</span>
              </div>
              {/* Mobile view switcher */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => setActiveView("dashboard")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors",
                    activeView === "dashboard"
                      ? "bg-brand-500 text-white border-brand-500"
                      : "border-surface-200 text-surface-600 hover:bg-surface-50"
                  )}
                >
                  Operations
                </button>
                <button
                  onClick={() => setActiveView("brand")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors",
                    activeView === "brand"
                      ? "bg-purple-600 text-white border-purple-600"
                      : "border-surface-200 text-surface-600 hover:bg-surface-50"
                  )}
                >
                  Brand
                </button>
              </div>
              <div className="flex items-center gap-3 hidden lg:flex">
                <span className="text-xs text-surface-500">
                  {filteredOrders.length} orders loaded
                </span>
                <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                  AP
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="p-6 max-w-[1600px]">
            {activeView === "dashboard" ? (
              <div className="space-y-6">
                <DashboardHeader />
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
                <KPIRow
                  metrics={metrics}
                  activeFilter={activeKpiFilter}
                  onDrillAllOrders={handleDrillAllOrders}
                  onDrillDisputes={handleDrillDisputes}
                  onDrillApproved={handleDrillApproved}
                />
                <ChartsSection metrics={metrics} />
                <div id="orders-section">
                  <OrdersTable
                    orders={filteredOrders}
                    onSelectOrder={setSelectedOrder}
                  />
                </div>
              </div>
            ) : (
              <BrandView metrics={BRAND_METRICS} />
            )}
          </div>
        </main>
      </div>

      {/* Order detail modal (only relevant on operations view) */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
