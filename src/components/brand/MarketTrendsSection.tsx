"use client";

import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarketTrend, TrendImpact, TrendDirection } from "@/lib/types";

const IMPACT_CONFIG: Record<TrendImpact, { label: string; classes: string }> = {
  high:   { label: "High Impact",   classes: "bg-red-50 text-red-700 border-red-200" },
  medium: { label: "Med Impact",    classes: "bg-amber-50 text-amber-700 border-amber-200" },
  low:    { label: "Low Impact",    classes: "bg-surface-100 text-surface-600 border-surface-200" },
};

const DIRECTION_CONFIG: Record<
  TrendDirection,
  { icon: React.ReactNode; label: string; bar: string; bg: string }
> = {
  opportunity: {
    icon: <TrendingUp className="w-4 h-4" />,
    label: "Opportunity",
    bar: "bg-green-500",
    bg: "bg-green-50 border-green-200 text-green-700",
  },
  threat: {
    icon: <TrendingDown className="w-4 h-4" />,
    label: "Threat",
    bar: "bg-red-400",
    bg: "bg-red-50 border-red-200 text-red-700",
  },
  neutral: {
    icon: <Minus className="w-4 h-4" />,
    label: "Watch",
    bar: "bg-surface-300",
    bg: "bg-surface-100 border-surface-200 text-surface-600",
  },
};

function TrendCard({ trend }: { trend: MarketTrend }) {
  const impact = IMPACT_CONFIG[trend.impact];
  const direction = DIRECTION_CONFIG[trend.direction];

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border",
              direction.bg
            )}
          >
            {direction.icon}
            {direction.label}
          </span>
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full border",
              impact.classes
            )}
          >
            {impact.label}
          </span>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-xs text-surface-400">Relevance</p>
          <p className="text-sm font-bold text-surface-900">{trend.relevanceScore}/10</p>
        </div>
      </div>

      {/* Relevance bar */}
      <div className="h-1 bg-surface-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", direction.bar)}
          style={{ width: `${trend.relevanceScore * 10}%` }}
        />
      </div>

      {/* Content */}
      <div>
        <h4 className="text-sm font-semibold text-surface-900 mb-1.5">{trend.title}</h4>
        <p className="text-xs text-surface-600 leading-relaxed">{trend.description}</p>
      </div>

      {/* Source */}
      <p className="text-xs text-surface-400 flex items-center gap-1">
        <ArrowUpRight className="w-3 h-3" />
        {trend.source}
      </p>
    </div>
  );
}

interface MarketTrendsSectionProps {
  trends: MarketTrend[];
}

export function MarketTrendsSection({ trends }: MarketTrendsSectionProps) {
  const opportunities = trends.filter((t) => t.direction === "opportunity");
  const threats = trends.filter((t) => t.direction === "threat");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-surface-800">Market Trends &amp; Industry Signals</h3>
          <p className="text-xs text-surface-500 mt-0.5">
            {opportunities.length} opportunities · {threats.length} threats identified
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="flex items-center gap-1 text-green-700">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {opportunities.length} opportunities
          </span>
          <span className="flex items-center gap-1 text-red-600">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            {threats.length} threats
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trends
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .map((trend) => (
            <TrendCard key={trend.id} trend={trend} />
          ))}
      </div>
    </div>
  );
}
