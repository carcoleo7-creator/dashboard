"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: ReactNode;
  iconBg: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  trendPositive?: boolean; // whether "up" is good
  onClick?: () => void;
  isActive?: boolean;
  tooltip?: string;
}

export function KPICard({
  label,
  value,
  subValue,
  icon,
  iconBg,
  trend,
  trendLabel,
  trendPositive = true,
  onClick,
  isActive,
  tooltip,
}: KPICardProps) {
  const isClickable = !!onClick;
  const isUpGood = trendPositive ? trend === "up" : trend === "down";
  const isUpBad = trendPositive ? trend === "down" : trend === "up";

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      title={tooltip}
      onClick={onClick}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "bg-white rounded-xl p-5 border transition-all duration-200",
        isClickable
          ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          : "",
        isActive
          ? "border-brand-500 shadow-md ring-2 ring-brand-100"
          : "border-surface-200 shadow-sm hover:border-brand-300"
      )}
      aria-label={isClickable ? `${label}: ${value}. Click to drill down.` : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-surface-600 truncate">{label}</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 tabular-nums">
            {value}
          </p>
          {subValue && (
            <p className="mt-0.5 text-xs text-surface-600">{subValue}</p>
          )}
          {trend && trendLabel && (
            <div
              className={cn(
                "mt-2 flex items-center gap-1 text-xs font-medium",
                isUpGood && "text-green-600",
                isUpBad && "text-red-500",
                trend === "neutral" && "text-surface-500"
              )}
            >
              <TrendIcon className="w-3.5 h-3.5" />
              <span>{trendLabel}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ml-3",
            iconBg
          )}
        >
          {icon}
        </div>
      </div>
      {isClickable && (
        <p className="mt-3 text-xs text-brand-600 font-medium flex items-center gap-1">
          Click to explore →
        </p>
      )}
    </div>
  );
}
