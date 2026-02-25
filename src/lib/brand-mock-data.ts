import { MOCK_ORDERS } from "./mock-data";
import {
  BrandMetrics,
  BrandHealthMetrics,
  RadarDataPoint,
  SentimentDataPoint,
  CompetitorData,
  MarketTrend,
  StrategicRecommendation,
  StoreRanking,
} from "./types";

// ─── Derived stats from real order data ───────────────────────────────────────

const totalOrders = MOCK_ORDERS.length;
const deliveredOrders = MOCK_ORDERS.filter((o) => o.trackingStatus === "delivered");
const disputedOrders = MOCK_ORDERS.filter((o) => o.disputeStatus !== "none");
const issueOrders = MOCK_ORDERS.filter((o) => o.issues.length > 0);

const completionRate = (deliveredOrders.length / totalOrders) * 100;
const disputeRate = (disputedOrders.length / totalOrders) * 100;
const issueRate = (issueOrders.length / totalOrders) * 100;

// Sentiment score: higher completion + lower disputes = higher sentiment
const sentimentScore = Math.min(100, Math.round(completionRate - disputeRate * 1.5 + 20));
const operationalScore = Math.min(100, Math.round(completionRate - issueRate * 0.8 + 15));

// ─── Health Metrics ───────────────────────────────────────────────────────────

const HEALTH: BrandHealthMetrics = {
  overall: Math.round((sentimentScore + operationalScore + 74 + 81 + 78) / 5),
  marketPositioning: {
    label: "Market Positioning",
    score: 74,
    trend: "up",
    delta: 3.2,
    description: "Competitive advantage in fast-casual delivery segment",
  },
  customerSentiment: {
    label: "Customer Sentiment",
    score: sentimentScore,
    trend: sentimentScore > 70 ? "up" : "down",
    delta: sentimentScore > 70 ? 2.1 : -1.8,
    description: "Derived from order outcomes, disputes, and feedback",
  },
  brandMessaging: {
    label: "Brand Messaging",
    score: 81,
    trend: "neutral",
    delta: 0.4,
    description: "Clear value proposition; tone consistency needs improvement",
  },
  visualIdentity: {
    label: "Visual Identity",
    score: 78,
    trend: "up",
    delta: 5.0,
    description: "Strong digital presence; in-app asset refresh underway",
  },
  operationalPerformance: {
    label: "Operational Performance",
    score: operationalScore,
    trend: operationalScore > 72 ? "up" : "down",
    delta: operationalScore > 72 ? 1.7 : -2.3,
    description: "Completion rate and issue frequency drive this score",
  },
};

// ─── Radar Chart Data ─────────────────────────────────────────────────────────

const RADAR_DATA: RadarDataPoint[] = [
  { dimension: "Delivery Speed", ourBrand: 72, topCompetitor: 85, industryAvg: 68 },
  { dimension: "Order Accuracy", ourBrand: Math.round(100 - issueRate * 1.5), topCompetitor: 88, industryAvg: 79 },
  { dimension: "Customer Loyalty", ourBrand: 76, topCompetitor: 80, industryAvg: 71 },
  { dimension: "Brand Recognition", ourBrand: 74, topCompetitor: 90, industryAvg: 65 },
  { dimension: "Value Perception", ourBrand: 82, topCompetitor: 75, industryAvg: 78 },
  { dimension: "Dispute Resolution", ourBrand: Math.round(100 - disputeRate * 2), topCompetitor: 78, industryAvg: 72 },
];

// ─── Customer Sentiment Over Time ─────────────────────────────────────────────

const MONTHS = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

const SENTIMENT_OVER_TIME: SentimentDataPoint[] = MONTHS.map((month, i) => {
  // Simulate gradual improvement over time
  const base = 55 + i * 2;
  const positive = Math.min(75, base + Math.round(Math.sin(i) * 5));
  const negative = Math.max(8, 25 - i * 2 + Math.round(Math.cos(i) * 3));
  const neutral = 100 - positive - negative;
  return { month, positive, neutral, negative };
});

// ─── Competitor Data ──────────────────────────────────────────────────────────

const COMPETITORS: CompetitorData[] = [
  {
    name: "Our Brand",
    color: "#E85D04",
    marketShare: 18.4,
    satisfactionScore: Math.round(sentimentScore * 0.9) / 10,
    avgDeliveryMinutes: 38,
    issueRate: Math.round(issueRate * 10) / 10,
    disputeRate: Math.round(disputeRate * 10) / 10,
  },
  {
    name: "QuickBite Co.",
    color: "#8b5cf6",
    marketShare: 24.1,
    satisfactionScore: 8.4,
    avgDeliveryMinutes: 32,
    issueRate: 9.2,
    disputeRate: 11.5,
  },
  {
    name: "FreshDash",
    color: "#3b82f6",
    marketShare: 19.7,
    satisfactionScore: 7.9,
    avgDeliveryMinutes: 41,
    issueRate: 14.1,
    disputeRate: 17.3,
  },
  {
    name: "NomNom Express",
    color: "#10b981",
    marketShare: 15.2,
    satisfactionScore: 7.5,
    avgDeliveryMinutes: 44,
    issueRate: 16.8,
    disputeRate: 19.0,
  },
  {
    name: "CityEats",
    color: "#f59e0b",
    marketShare: 12.6,
    satisfactionScore: 7.1,
    avgDeliveryMinutes: 48,
    issueRate: 18.3,
    disputeRate: 21.2,
  },
];

// ─── Market Trends ────────────────────────────────────────────────────────────

const MARKET_TRENDS: MarketTrend[] = [
  {
    id: "trend-1",
    title: "AI-Powered Order Accuracy",
    description:
      "Competitors are deploying computer vision at restaurant pickup to verify bag contents before handoff, reducing missing-item complaints by up to 40%. Adoption is accelerating across tier-1 markets.",
    impact: "high",
    direction: "opportunity",
    relevanceScore: 9,
    source: "Restaurant Tech Insider, Q1 2026",
  },
  {
    id: "trend-2",
    title: "Rising Consumer Dispute Expectations",
    description:
      "Customers now expect instant dispute resolution (under 2 hours) with proactive compensation offers. Brands with slow dispute pipelines are seeing 22% higher churn among affected users.",
    impact: "high",
    direction: "threat",
    relevanceScore: 9,
    source: "National Restaurant Association, 2026 Consumer Report",
  },
  {
    id: "trend-3",
    title: "Subscription Loyalty Programs",
    description:
      "Subscription-based delivery passes are driving 35% higher order frequency among enrolled customers. QuickBite Co. launched their $9.99/month plan and saw 18% revenue uplift in 90 days.",
    impact: "high",
    direction: "opportunity",
    relevanceScore: 8,
    source: "Deloitte Delivery Economy Study, Jan 2026",
  },
  {
    id: "trend-4",
    title: "Eco-Packaging Mandate Pressure",
    description:
      "Legislation in 12 states now requires compostable packaging for food delivery. Brands not complying by Q3 2026 face fines of up to $5,000 per location per month.",
    impact: "medium",
    direction: "threat",
    relevanceScore: 7,
    source: "GreenServe Policy Tracker, Feb 2026",
  },
  {
    id: "trend-5",
    title: "Ghost Kitchen Expansion",
    description:
      "Ghost kitchen operators are capturing 8% more market share YoY by offering faster prep times and lower overhead. This is compressing margins for traditional restaurant delivery partners.",
    impact: "medium",
    direction: "threat",
    relevanceScore: 7,
    source: "Food Service Futures Report, 2025",
  },
  {
    id: "trend-6",
    title: "Personalized Re-order Nudges",
    description:
      "Brands using ML-driven push notifications timed to individual reorder patterns are seeing 28% CTR vs. 6% industry average. This is now a table-stakes CRM capability.",
    impact: "medium",
    direction: "opportunity",
    relevanceScore: 6,
    source: "Customer Engagement Labs, Q4 2025",
  },
];

// ─── Strategic Recommendations ────────────────────────────────────────────────

const RECOMMENDATIONS: StrategicRecommendation[] = [
  {
    id: "rec-1",
    priority: "critical",
    category: "Operational Excellence",
    title: "Deploy pre-dispatch bag verification at top 3 stores",
    description:
      "STR-003, STR-006, and STR-007 account for 41% of all missing-item and missing-food issues. Pilot a checklist-based bag verification at pickup to reduce these incidents before scaling to all stores.",
    expectedImpact: "Reduce missing-item issues by 35–45% within 60 days",
    effort: "medium",
    successMetrics: [
      "Issue rate per store < 10%",
      "Missing items/food issues < 5% of orders",
      "Customer compensation cost ↓ 20%",
    ],
  },
  {
    id: "rec-2",
    priority: "critical",
    category: "Dispute Resolution",
    title: "Automate dispute triage and set 2-hour SLA",
    description:
      "Currently approved disputes take an average of 18 hours to resolve. Implement an automated first-response system that acknowledges disputes instantly and routes them by issue type, targeting full resolution under 2 hours.",
    expectedImpact: "Increase dispute satisfaction score by 25–30 points",
    effort: "medium",
    successMetrics: [
      "Time to first response < 5 minutes",
      "Full resolution time < 2 hours",
      "Post-dispute retention rate > 70%",
    ],
  },
  {
    id: "rec-3",
    priority: "high",
    category: "Market Positioning",
    title: "Launch a subscription delivery pass at $9.99/month",
    description:
      "Competitors with subscription passes report 35% higher order frequency. A $9.99 unlimited-delivery pass for orders over $20 would reduce churn and drive predictable revenue.",
    expectedImpact: "Increase order frequency by 25–35% among subscribers",
    effort: "high",
    successMetrics: [
      "10,000 subscribers in 90 days",
      "Monthly order frequency ↑ 30% for subscribers",
      "Subscriber churn rate < 5% monthly",
    ],
  },
  {
    id: "rec-4",
    priority: "high",
    category: "Brand Messaging",
    title: "Refresh in-app messaging to highlight accuracy guarantee",
    description:
      "Our value perception score (82) is our strongest dimension — above QuickBite Co. (75). Lean into this with an 'Accuracy Guaranteed or We Make It Right' campaign across the app and push notifications.",
    expectedImpact: "Improve brand recognition score from 74 to 82 within Q2",
    effort: "low",
    successMetrics: [
      "Brand recognition score > 80",
      "Unaided brand recall ↑ 15%",
      "Accuracy-related NPS mentions ↑ 20%",
    ],
  },
  {
    id: "rec-5",
    priority: "medium",
    category: "Visual Identity",
    title: "Complete digital asset refresh across partner stores",
    description:
      "Visual identity score improved 5 points this period but in-app store banners for STR-004 and STR-005 still use legacy brand assets. Standardise all store visuals to the updated brand guide.",
    expectedImpact: "Consistent brand presentation; visual identity score > 85",
    effort: "low",
    successMetrics: [
      "100% of store banners use new brand guidelines",
      "Visual identity score ≥ 85",
    ],
  },
  {
    id: "rec-6",
    priority: "medium",
    category: "Market Trends",
    title: "Begin eco-packaging compliance audit across all stores",
    description:
      "With 12-state mandates taking effect in Q3 2026, initiate a packaging audit now to identify non-compliant materials and source compostable alternatives before fines begin.",
    expectedImpact: "Full compliance before Q3 2026 deadline; $0 in fines",
    effort: "medium",
    successMetrics: [
      "100% store compliance by July 2026",
      "Compostable packaging adoption ≥ 90%",
      "Zero regulatory fines",
    ],
  },
];

// ─── Store Rankings (derived from order data) ─────────────────────────────────

const STORE_DEFS = [
  { number: "STR-001", name: "Downtown Kitchen" },
  { number: "STR-002", name: "Midtown Bistro" },
  { number: "STR-003", name: "Harbor View" },
  { number: "STR-004", name: "Uptown Grill" },
  { number: "STR-005", name: "Westside Eats" },
  { number: "STR-006", name: "Eastside Diner" },
  { number: "STR-007", name: "Northgate Kitchen" },
  { number: "STR-008", name: "Southend Cafe" },
];

function computeStoreRankings(): StoreRanking[] {
  return STORE_DEFS.map((store) => {
    const storeOrders = MOCK_ORDERS.filter((o) => o.storeNumber === store.number);
    const count = storeOrders.length;
    if (count === 0) {
      return {
        storeNumber: store.number,
        storeName: store.name,
        brandScore: 0,
        orders: 0,
        completionRate: 0,
        issueRate: 0,
        disputeRate: 0,
        trend: "neutral" as const,
      };
    }
    const completed = storeOrders.filter((o) => o.trackingStatus === "delivered").length;
    const withIssues = storeOrders.filter((o) => o.issues.length > 0).length;
    const disputed = storeOrders.filter((o) => o.disputeStatus !== "none").length;
    const cRate = (completed / count) * 100;
    const iRate = (withIssues / count) * 100;
    const dRate = (disputed / count) * 100;
    const brandScore = Math.round(cRate - iRate * 0.8 - dRate * 0.6 + 30);
    return {
      storeNumber: store.number,
      storeName: store.name,
      brandScore: Math.min(100, Math.max(0, brandScore)),
      orders: count,
      completionRate: Math.round(cRate * 10) / 10,
      issueRate: Math.round(iRate * 10) / 10,
      disputeRate: Math.round(dRate * 10) / 10,
      trend: (brandScore > 78 ? "up" : brandScore < 65 ? "down" : "neutral") as "up" | "down" | "neutral",
    };
  }).sort((a, b) => b.brandScore - a.brandScore);
}

export const BRAND_METRICS: BrandMetrics = {
  health: HEALTH,
  radarData: RADAR_DATA,
  sentimentOverTime: SENTIMENT_OVER_TIME,
  competitors: COMPETITORS,
  marketTrends: MARKET_TRENDS,
  recommendations: RECOMMENDATIONS,
  storeRankings: computeStoreRankings(),
};
