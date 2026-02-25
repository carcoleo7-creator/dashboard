"use client";

import { TrendingUp, TrendingDown, Minus, Target, Users, Megaphone, Palette, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandHealthMetrics, BrandHealthDimension } from "@/lib/types";

const DIMENSION_ICONS = {
  marketPositioning: <Target className="w-4 h-4" />,
  customerSentiment: <Users className="w-4 h-4" />,
  brandMessaging: <Megaphone className="w-4 h-4" />,
  visualIdentity: <Palette className="w-4 h-4" />,
  operationalPerformance: <Zap className="w-4 h-4" />,
};

const DIMENSION_COLORS: Record<string, string> = {
  marketPositioning: "text-purple-600 bg-purple-50",
  customerSentiment: "text-blue-600 bg-blue-50",
  brandMessaging: "text-amber-600 bg-amber-50",
  visualIdentity: "text-pink-600 bg-pink-50",
  operationalPerformance: "text-green-600 bg-green-50",
};

function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 80 ? "#22c55e" : score >= 65 ? "#f59e0b" : "#ef4444";

  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="flex-shrink-0" aria-hidden="true">
      <circle cx="36" cy="36" r={radius} fill="none" stroke="#f0f0ee" strokeWidth="6" />
      <circle
        cx="36"
        cy="36"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x="36"
        y="40"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#1A1A1A"
      >
        {score}
      </text>
    </svg>
  );
}

function DimensionCard({
  dimKey,
  dim,
}: {
  dimKey: string;
  dim: BrandHealthDimension;
}) {
  const TrendIcon =
    dim.trend === "up" ? TrendingUp : dim.trend === "down" ? TrendingDown : Minus;
  const trendClass =
    dim.trend === "up"
      ? "text-green-600"
      : dim.trend === "down"
      ? "text-red-500"
      : "text-surface-400";
  const icon = DIMENSION_ICONS[dimKey as keyof typeof DIMENSION_ICONS];
  const colorClass = DIMENSION_COLORS[dimKey] ?? "text-brand-600 bg-brand-50";

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
      <ScoreRing score={dim.score} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn("w-6 h-6 rounded-md flex items-center justify-center", colorClass)}>
            {icon}
          </span>
          <p className="text-xs font-semibold text-surface-800 truncate">{dim.label}</p>
        </div>
        <p className="text-xs text-surface-500 leading-relaxed mb-2">{dim.description}</p>
        <div className={cn("flex items-center gap-1 text-xs font-medium", trendClass)}>
          <TrendIcon className="w-3.5 h-3.5" />
          <span>
            {dim.trend === "up" ? "+" : dim.trend === "down" ? "" : ""}
            {Math.abs(dim.delta).toFixed(1)} pts vs prior period
          </span>
        </div>
      </div>
    </div>
  );
}

interface BrandHealthRowProps {
  health: BrandHealthMetrics;
}

export function BrandHealthRow({ health }: BrandHealthRowProps) {
  const overallColor =
    health.overall >= 80 ? "#22c55e" : health.overall >= 65 ? "#f59e0b" : "#ef4444";
  const overallLabel =
    health.overall >= 80 ? "Strong" : health.overall >= 65 ? "Moderate" : "At Risk";

  const dimensions = [
    { key: "marketPositioning", dim: health.marketPositioning },
    { key: "customerSentiment", dim: health.customerSentiment },
    { key: "brandMessaging", dim: health.brandMessaging },
    { key: "visualIdentity", dim: health.visualIdentity },
    { key: "operationalPerformance", dim: health.operationalPerformance },
  ];

  return (
    <div className="space-y-4">
      {/* Overall score banner */}
      <div className="bg-surface-800 text-white rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-surface-300 uppercase tracking-wider font-medium mb-1">
            Overall Brand Health Score
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold" style={{ color: overallColor }}>
              {health.overall}
            </span>
            <span className="text-surface-300 text-lg">/ 100</span>
            <span
              className="text-sm font-semibold px-2.5 py-0.5 rounded-full"
              style={{ background: overallColor + "22", color: overallColor }}
            >
              {overallLabel}
            </span>
          </div>
          <p className="text-xs text-surface-400 mt-2">
            Composite score across market positioning, customer sentiment, messaging, visual identity, and operational performance
          </p>
        </div>
        {/* Mini bar breakdown */}
        <div className="flex-shrink-0 space-y-1.5 min-w-[180px]">
          {dimensions.map(({ key, dim }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xs text-surface-400 w-24 truncate">{dim.label.split(" ")[0]}</span>
              <div className="flex-1 h-1.5 bg-surface-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${dim.score}%`,
                    background:
                      dim.score >= 80 ? "#22c55e" : dim.score >= 65 ? "#f59e0b" : "#ef4444",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <span className="text-xs text-surface-300 w-6 text-right font-semibold">
                {dim.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dimension cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {dimensions.map(({ key, dim }) => (
          <DimensionCard key={key} dimKey={key} dim={dim} />
        ))}
      </div>
    </div>
  );
}
