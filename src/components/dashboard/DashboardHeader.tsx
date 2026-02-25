"use client";

import { format } from "date-fns";
import { UtensilsCrossed, RefreshCw } from "lucide-react";

export function DashboardHeader() {
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
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-surface-400">Last updated</p>
          <p className="text-sm font-semibold text-surface-700">
            {format(new Date(), "MMM d, yyyy · h:mm a")}
          </p>
        </div>
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
