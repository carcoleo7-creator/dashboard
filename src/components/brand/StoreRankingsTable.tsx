"use client";

import { TrendingUp, TrendingDown, Minus, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { StoreRanking } from "@/lib/types";

function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color =
    value >= 80 ? "bg-green-500" : value >= 65 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={cn(
          "text-xs font-bold w-7 text-right",
          value >= 80 ? "text-green-600" : value >= 65 ? "text-amber-600" : "text-red-500"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return <Medal className="w-4 h-4 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-surface-400" />;
  if (rank === 3) return <Medal className="w-4 h-4 text-amber-700" />;
  return <span className="text-xs text-surface-400 font-semibold w-4 text-center">#{rank}</span>;
}

interface StoreRankingsTableProps {
  rankings: StoreRanking[];
}

export function StoreRankingsTable({ rankings }: StoreRankingsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-100">
        <h3 className="text-sm font-semibold text-surface-800">Store Brand Performance Rankings</h3>
        <p className="text-xs text-surface-500 mt-0.5">
          Ranked by composite brand score — completion rate, issue frequency, and dispute rate
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]" aria-label="Store brand rankings">
          <thead>
            <tr className="bg-surface-50 border-b border-surface-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">Store</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 min-w-[140px]">Brand Score</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">Orders</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">Completion</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">Issue Rate</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">Dispute Rate</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">Trend</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((store, index) => {
              const TrendIcon =
                store.trend === "up"
                  ? TrendingUp
                  : store.trend === "down"
                  ? TrendingDown
                  : Minus;
              const trendClass =
                store.trend === "up"
                  ? "text-green-600"
                  : store.trend === "down"
                  ? "text-red-500"
                  : "text-surface-400";

              return (
                <tr
                  key={store.storeNumber}
                  className="border-b border-surface-100 last:border-0 hover:bg-surface-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <RankMedal rank={index + 1} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-surface-900">{store.storeName}</p>
                    <p className="text-xs text-surface-400">{store.storeNumber}</p>
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBar value={store.brandScore} />
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-surface-700 font-medium">
                    {store.orders}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        store.completionRate >= 70 ? "text-green-600" : "text-amber-600"
                      )}
                    >
                      {store.completionRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        store.issueRate < 10 ? "text-green-600" : store.issueRate < 20 ? "text-amber-600" : "text-red-500"
                      )}
                    >
                      {store.issueRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        store.disputeRate < 10 ? "text-green-600" : store.disputeRate < 18 ? "text-amber-600" : "text-red-500"
                      )}
                    >
                      {store.disputeRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <TrendIcon className={cn("w-4 h-4 ml-auto", trendClass)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
