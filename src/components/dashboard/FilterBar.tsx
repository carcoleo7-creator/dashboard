"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, ChevronDown, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterState, OrderStatus, DisputeStatus } from "@/lib/types";
import { STORE_OPTIONS } from "@/lib/mock-data";

interface FilterBarProps {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  totalFiltered: number;
  totalAll: number;
}

const ORDER_STATUS_OPTIONS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "delivered", label: "Delivered" },
  { value: "in_transit", label: "In Transit" },
  { value: "canceled", label: "Canceled" },
  { value: "pending", label: "Pending" },
];

const DISPUTE_STATUS_OPTIONS: { value: DisputeStatus | "all"; label: string }[] = [
  { value: "all", label: "All Disputes" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
  { value: "pending", label: "Pending Review" },
  { value: "none", label: "No Dispute" },
];

function Select({
  value,
  options,
  onChange,
  className,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white border border-surface-200 rounded-lg px-3 py-2 pr-8 text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer hover:border-surface-300 transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 pointer-events-none" />
    </div>
  );
}

function DateInput({
  value,
  onChange,
  label,
}: {
  value: Date;
  onChange: (d: Date) => void;
  label: string;
}) {
  return (
    <div className="relative">
      <label className="sr-only">{label}</label>
      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 pointer-events-none" />
      <input
        type="date"
        value={format(value, "yyyy-MM-dd")}
        onChange={(e) => {
          const d = new Date(e.target.value + "T00:00:00");
          if (!isNaN(d.getTime())) onChange(d);
        }}
        className="w-full bg-white border border-surface-200 rounded-lg pl-8 pr-3 py-2 text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer hover:border-surface-300 transition-colors"
        aria-label={label}
      />
    </div>
  );
}

const DATE_PRESETS = [
  { label: "Today", days: 0 },
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

export function FilterBar({
  filters,
  updateFilter,
  resetFilters,
  totalFiltered,
  totalAll,
}: FilterBarProps) {
  const [showPresets, setShowPresets] = useState(false);
  const isFiltered =
    filters.storeNumber !== "all" ||
    filters.orderStatus !== "all" ||
    filters.disputeStatus !== "all";

  function applyPreset(days: number) {
    const now = new Date();
    const from = new Date(now);
    from.setDate(from.getDate() - days);
    updateFilter("dateFrom", from);
    updateFilter("dateTo", now);
  }

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <SlidersHorizontal className="w-4 h-4 text-surface-500" />
        <span className="text-sm font-semibold text-surface-700">Filters</span>
        <span className="ml-auto text-xs text-surface-500">
          Showing{" "}
          <span className="font-semibold text-surface-900">
            {totalFiltered.toLocaleString()}
          </span>{" "}
          of {totalAll.toLocaleString()} orders
        </span>
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium ml-2 transition-colors"
            aria-label="Reset all filters"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Date range */}
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium text-surface-500 mb-1">Date From</p>
          <DateInput
            value={filters.dateFrom}
            onChange={(d) => updateFilter("dateFrom", d)}
            label="Start date"
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium text-surface-500 mb-1">Date To</p>
          <DateInput
            value={filters.dateTo}
            onChange={(d) => updateFilter("dateTo", d)}
            label="End date"
          />
        </div>

        {/* Store */}
        <div>
          <p className="text-xs font-medium text-surface-500 mb-1">Store</p>
          <Select
            value={filters.storeNumber}
            options={STORE_OPTIONS}
            onChange={(v) => updateFilter("storeNumber", v)}
          />
        </div>

        {/* Status filters */}
        <div>
          <p className="text-xs font-medium text-surface-500 mb-1">Order Status</p>
          <Select
            value={filters.orderStatus}
            options={ORDER_STATUS_OPTIONS}
            onChange={(v) => updateFilter("orderStatus", v as OrderStatus | "all")}
          />
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        <div>
          <p className="text-xs font-medium text-surface-500 mb-1">Dispute Status</p>
          <Select
            value={filters.disputeStatus}
            options={DISPUTE_STATUS_OPTIONS}
            onChange={(v) => updateFilter("disputeStatus", v as DisputeStatus | "all")}
          />
        </div>

        {/* Date presets */}
        <div className="sm:col-span-1 lg:col-span-3 flex items-end gap-2">
          <div>
            <p className="text-xs font-medium text-surface-500 mb-1">Quick Ranges</p>
            <div className="flex gap-1.5">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset.days}
                  onClick={() => applyPreset(preset.days)}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-surface-200 bg-surface-50 text-surface-700 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active filters chips */}
      {isFiltered && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-surface-100">
          <span className="text-xs text-surface-500 self-center">Active:</span>
          {filters.storeNumber !== "all" && (
            <FilterChip
              label={`Store: ${filters.storeNumber}`}
              onRemove={() => updateFilter("storeNumber", "all")}
            />
          )}
          {filters.orderStatus !== "all" && (
            <FilterChip
              label={`Status: ${filters.orderStatus.replace("_", " ")}`}
              onRemove={() => updateFilter("orderStatus", "all")}
            />
          )}
          {filters.disputeStatus !== "all" && (
            <FilterChip
              label={`Dispute: ${filters.disputeStatus}`}
              onRemove={() => updateFilter("disputeStatus", "all")}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium border border-brand-200">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="hover:text-brand-900 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
