"use client";

import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp, Lightbulb, Flame, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { StrategicRecommendation, RecommendationPriority, EffortLevel } from "@/lib/types";

const PRIORITY_CONFIG: Record<
  RecommendationPriority,
  { label: string; icon: React.ReactNode; cardClass: string; badgeClass: string }
> = {
  critical: {
    label: "Critical",
    icon: <Flame className="w-3.5 h-3.5" />,
    cardClass: "border-red-200 bg-red-50/30",
    badgeClass: "bg-red-100 text-red-700 border-red-200",
  },
  high: {
    label: "High",
    icon: <ArrowUp className="w-3.5 h-3.5" />,
    cardClass: "border-amber-200 bg-amber-50/20",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
  },
  medium: {
    label: "Medium",
    icon: <Lightbulb className="w-3.5 h-3.5" />,
    cardClass: "border-blue-200 bg-blue-50/20",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
  },
};

const EFFORT_CONFIG: Record<EffortLevel, { label: string; color: string }> = {
  low:    { label: "Low Effort",    color: "text-green-600 bg-green-50 border-green-200" },
  medium: { label: "Med Effort",    color: "text-amber-600 bg-amber-50 border-amber-200" },
  high:   { label: "High Effort",   color: "text-red-600 bg-red-50 border-red-200" },
};

function RecommendationCard({ rec }: { rec: StrategicRecommendation }) {
  const [expanded, setExpanded] = useState(false);
  const priority = PRIORITY_CONFIG[rec.priority];
  const effort = EFFORT_CONFIG[rec.effort];

  return (
    <div
      className={cn(
        "rounded-xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md",
        priority.cardClass
      )}
    >
      {/* Header row */}
      <button
        className="w-full text-left px-4 py-3.5 flex items-start gap-3"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5",
            priority.badgeClass
          )}
        >
          {priority.icon}
          {priority.label}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-surface-500 font-medium">{rec.category}</p>
          <p className="text-sm font-semibold text-surface-900 leading-snug mt-0.5">{rec.title}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2 mt-0.5">
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full border hidden sm:inline-flex",
              effort.color
            )}
          >
            {effort.label}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-surface-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-surface-400" />
          )}
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-surface-200/60 pt-3">
          <p className="text-xs text-surface-700 leading-relaxed">{rec.description}</p>

          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <p className="text-xs font-semibold text-surface-600 mb-1">Expected Impact</p>
              <p className="text-xs text-green-700 font-medium bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                {rec.expectedImpact}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-surface-600 mb-1">Effort Level</p>
              <span className={cn("text-xs font-medium px-2.5 py-1.5 rounded-lg border", effort.color)}>
                {effort.label}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-surface-600 mb-1.5">Success Metrics</p>
            <ul className="space-y-1">
              {rec.successMetrics.map((metric, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-surface-700">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                  {metric}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

interface RecommendationsPanelProps {
  recommendations: StrategicRecommendation[];
}

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  const criticalCount = recommendations.filter((r) => r.priority === "critical").length;
  const highCount = recommendations.filter((r) => r.priority === "high").length;

  const ordered = [...recommendations].sort((a, b) => {
    const order: Record<RecommendationPriority, number> = { critical: 0, high: 1, medium: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-surface-800">Strategic Recommendations</h3>
          <p className="text-xs text-surface-500 mt-0.5">
            Data-driven actions ranked by priority · Click any card to expand
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1 bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-medium">
              <Flame className="w-3 h-3" />
              {criticalCount} critical
            </span>
          )}
          {highCount > 0 && (
            <span className="flex items-center gap-1 bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
              {highCount} high
            </span>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {ordered.map((rec) => (
          <RecommendationCard key={rec.id} rec={rec} />
        ))}
      </div>
    </div>
  );
}
