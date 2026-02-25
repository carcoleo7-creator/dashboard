"use client";

import { BrandMetrics } from "@/lib/types";
import { BrandHealthRow } from "./BrandHealthRow";
import { MarketPositioningChart } from "./MarketPositioningChart";
import { CustomerSentimentChart } from "./CustomerSentimentChart";
import { CompetitorComparisonChart } from "./CompetitorComparisonChart";
import { MarketTrendsSection } from "./MarketTrendsSection";
import { RecommendationsPanel } from "./RecommendationsPanel";
import { StoreRankingsTable } from "./StoreRankingsTable";
import { BarChart3, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface BrandViewProps {
  metrics: BrandMetrics;
}

export function BrandView({ metrics }: BrandViewProps) {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-sm">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-surface-900 leading-tight">
              Brand Level Analysis
            </h1>
            <p className="text-sm text-surface-500">
              Market positioning · Customer insights · Competitive landscape · Strategic recommendations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-surface-400">Analysis Date</p>
            <p className="text-sm font-semibold text-surface-700">
              {format(new Date(), "MMM d, yyyy")}
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-surface-600 bg-white border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors shadow-sm"
            onClick={() => window.location.reload()}
            aria-label="Refresh analysis"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* 1 — Brand Health */}
      <section aria-labelledby="health-heading">
        <h2 id="health-heading" className="sr-only">Brand Health Scores</h2>
        <BrandHealthRow health={metrics.health} />
      </section>

      {/* 2 — Market Positioning + Customer Sentiment side by side */}
      <section aria-labelledby="positioning-heading">
        <h2 id="positioning-heading" className="sr-only">Market Positioning and Customer Sentiment</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MarketPositioningChart data={metrics.radarData} />
          <CustomerSentimentChart data={metrics.sentimentOverTime} />
        </div>
      </section>

      {/* 3 — Competitive Analysis */}
      <section aria-labelledby="competitor-heading">
        <h2 id="competitor-heading" className="sr-only">Competitive Analysis</h2>
        <CompetitorComparisonChart competitors={metrics.competitors} />
      </section>

      {/* 4 — Store Brand Rankings */}
      <section aria-labelledby="rankings-heading">
        <h2 id="rankings-heading" className="sr-only">Store Rankings</h2>
        <StoreRankingsTable rankings={metrics.storeRankings} />
      </section>

      {/* 5 — Market Trends */}
      <section aria-labelledby="trends-heading">
        <h2 id="trends-heading" className="sr-only">Market Trends</h2>
        <MarketTrendsSection trends={metrics.marketTrends} />
      </section>

      {/* 6 — Strategic Recommendations */}
      <section aria-labelledby="recs-heading">
        <h2 id="recs-heading" className="sr-only">Strategic Recommendations</h2>
        <RecommendationsPanel recommendations={metrics.recommendations} />
      </section>
    </div>
  );
}
