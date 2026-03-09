export type OrderStatus = "delivered" | "in_transit" | "canceled" | "pending";
export type DisputeStatus = "approved" | "denied" | "pending" | "none";
export type DeliveryTrackingStatus = "tracked" | "untracked" | "partially_tracked";
export type OrderIssueType =
  | "missing_items"
  | "missing_food"
  | "food_not_ready"
  | "wrong_items"
  | "cold_food";

export interface OrderIssue {
  type: OrderIssueType;
  label: string;
  description: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  storeNumber: string;
  storeName: string;
  trackingStatus: OrderStatus;
  driver: Driver;
  orderDate: Date;
  pickupTime: Date | null;
  estimatedDeliveryTime: Date;
  actualDeliveryTime: Date | null;
  disputeStatus: DisputeStatus;
  disputeReason: string | null;
  compensationCost: number | null;
  customerFeedback: string | null;
  customerRating: number | null;
  totalAmount: number;
  deliveryTimeMinutes: number | null;
  deliveryTracking: DeliveryTrackingStatus;
  trackingNotes: string | null;
  items: OrderItem[];
  issues: OrderIssue[];
}

export interface AggregateMetrics {
  totalOrders: number;
  totalDisputes: number;
  approvedDisputes: number;
  deniedDisputes: number;
  pendingDisputes: number;
  avgCompensationCost: number;
  avgDeliveryTimeMinutes: number;
  trackingCoverage: number; // % of orders with "tracked" status
  ordersOverTime: { date: string; orders: number; disputes: number }[];
  issuesByType: { type: OrderIssueType; label: string; count: number; color: string }[];
  disputeBreakdown: { name: string; value: number; color: string }[];
  trackingBreakdown: { name: string; value: number; color: string }[];
}

export interface FilterState {
  dateFrom: Date;
  dateTo: Date;
  storeNumber: string;
  deliveryTracking: DeliveryTrackingStatus | "all";
  disputeStatus: DisputeStatus | "all";
}

// ─── Brand Level Types ────────────────────────────────────────────────────────

export interface BrandHealthDimension {
  label: string;
  score: number;        // 0–100
  trend: "up" | "down" | "neutral";
  delta: number;        // vs prior period
  description: string;
}

export interface BrandHealthMetrics {
  overall: number;
  marketPositioning: BrandHealthDimension;
  customerSentiment: BrandHealthDimension;
  brandMessaging: BrandHealthDimension;
  visualIdentity: BrandHealthDimension;
  operationalPerformance: BrandHealthDimension;
}

export interface RadarDataPoint {
  dimension: string;
  ourBrand: number;
  topCompetitor: number;
  industryAvg: number;
}

export interface SentimentDataPoint {
  month: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface CompetitorData {
  name: string;
  color: string;
  marketShare: number;
  satisfactionScore: number;
  avgDeliveryMinutes: number;
  issueRate: number;
  disputeRate: number;
}

export type TrendImpact = "high" | "medium" | "low";
export type TrendDirection = "opportunity" | "threat" | "neutral";

export interface MarketTrend {
  id: string;
  title: string;
  description: string;
  impact: TrendImpact;
  direction: TrendDirection;
  relevanceScore: number; // 1–10
  source: string;
}

export type RecommendationPriority = "critical" | "high" | "medium";
export type EffortLevel = "low" | "medium" | "high";

export interface StrategicRecommendation {
  id: string;
  priority: RecommendationPriority;
  category: string;
  title: string;
  description: string;
  expectedImpact: string;
  effort: EffortLevel;
  successMetrics: string[];
}

export interface StoreRanking {
  storeNumber: string;
  storeName: string;
  brandScore: number;
  orders: number;
  completionRate: number;
  issueRate: number;
  disputeRate: number;
  trend: "up" | "down" | "neutral";
}

export interface BrandMetrics {
  health: BrandHealthMetrics;
  radarData: RadarDataPoint[];
  sentimentOverTime: SentimentDataPoint[];
  competitors: CompetitorData[];
  marketTrends: MarketTrend[];
  recommendations: StrategicRecommendation[];
  storeRankings: StoreRanking[];
}
