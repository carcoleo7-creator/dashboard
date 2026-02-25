import { subDays, addMinutes, subMinutes, format } from "date-fns";
import { Order, Driver, OrderItem, OrderStatus, DisputeStatus } from "./types";

const STORES = [
  { number: "STR-001", name: "Downtown Kitchen" },
  { number: "STR-002", name: "Midtown Bistro" },
  { number: "STR-003", name: "Harbor View" },
  { number: "STR-004", name: "Uptown Grill" },
  { number: "STR-005", name: "Westside Eats" },
  { number: "STR-006", name: "Eastside Diner" },
  { number: "STR-007", name: "Northgate Kitchen" },
  { number: "STR-008", name: "Southend Cafe" },
];

const DRIVERS: Driver[] = [
  { id: "DRV-001", name: "Marcus Williams", phone: "555-0101", rating: 4.8 },
  { id: "DRV-002", name: "Sarah Chen", phone: "555-0102", rating: 4.9 },
  { id: "DRV-003", name: "James Rodriguez", phone: "555-0103", rating: 4.6 },
  { id: "DRV-004", name: "Aisha Johnson", phone: "555-0104", rating: 4.7 },
  { id: "DRV-005", name: "Daniel Park", phone: "555-0105", rating: 4.5 },
  { id: "DRV-006", name: "Emily Torres", phone: "555-0106", rating: 4.9 },
  { id: "DRV-007", name: "Michael Brown", phone: "555-0107", rating: 4.4 },
  { id: "DRV-008", name: "Fatima Al-Hassan", phone: "555-0108", rating: 4.8 },
  { id: "DRV-009", name: "Carlos Mendez", phone: "555-0109", rating: 4.6 },
  { id: "DRV-010", name: "Priya Patel", phone: "555-0110", rating: 4.7 },
  { id: "DRV-011", name: "Tyler Jackson", phone: "555-0111", rating: 4.3 },
  { id: "DRV-012", name: "Nina Kowalski", phone: "555-0112", rating: 4.8 },
  { id: "DRV-013", name: "Omar Sheikh", phone: "555-0113", rating: 4.5 },
  { id: "DRV-014", name: "Lily Anderson", phone: "555-0114", rating: 4.9 },
  { id: "DRV-015", name: "Kevin Okafor", phone: "555-0115", rating: 4.6 },
];

const MENU_ITEMS = [
  "Margherita Pizza", "BBQ Burger", "Caesar Salad", "Pad Thai", "Fish Tacos",
  "Chicken Wings", "Veggie Wrap", "Steak Sandwich", "Sushi Roll", "Pasta Carbonara",
  "Fried Rice", "Greek Bowl", "Club Sandwich", "Mushroom Risotto", "Lobster Bisque",
];

const DISPUTE_REASONS = [
  "Missing items from order",
  "Wrong items delivered",
  "Order arrived significantly late",
  "Items damaged during delivery",
  "Order never arrived",
  "Food quality below standard",
  "Incorrect pricing charged",
];

const CUSTOMER_FEEDBACK = [
  "Great experience! Driver was friendly and food arrived hot.",
  "Delivery was quick and everything was perfect.",
  "Excellent service, will order again!",
  "Food was fresh and packaging was excellent.",
  "Driver was very communicative about the delay.",
  "Everything arrived as expected, great job!",
  "Surprisingly fast delivery, very happy!",
  "Good overall experience, minor packaging issue but food was fine.",
  "Driver went above and beyond, very professional.",
  "Perfect order, nothing missing and still warm!",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function generateItems(rng: () => number): OrderItem[] {
  const count = Math.floor(rng() * 4) + 1;
  const items: OrderItem[] = [];
  for (let i = 0; i < count; i++) {
    items.push({
      name: pick(MENU_ITEMS, rng),
      quantity: Math.floor(rng() * 3) + 1,
      price: Math.round((rng() * 20 + 5) * 100) / 100,
    });
  }
  return items;
}

function generateOrders(): Order[] {
  const orders: Order[] = [];
  const rng = seededRandom(42);
  const now = new Date();

  for (let i = 0; i < 500; i++) {
    const store = pick(STORES, rng);
    const driver = pick(DRIVERS, rng);
    const daysAgo = Math.floor(rng() * 90);
    const hourOfDay = Math.floor(rng() * 14) + 10; // 10am - midnight
    const orderDate = subDays(now, daysAgo);
    orderDate.setHours(hourOfDay, Math.floor(rng() * 60), 0, 0);

    const estDeliveryMins = Math.floor(rng() * 35) + 25; // 25-60 min
    const estimatedDeliveryTime = addMinutes(orderDate, estDeliveryMins);

    // Status distribution: 65% delivered, 15% in_transit, 12% canceled, 8% pending
    const statusRoll = rng();
    let trackingStatus: OrderStatus;
    if (statusRoll < 0.65) trackingStatus = "delivered";
    else if (statusRoll < 0.80) trackingStatus = "in_transit";
    else if (statusRoll < 0.92) trackingStatus = "canceled";
    else trackingStatus = "pending";

    // Actual delivery time (only for delivered)
    let actualDeliveryTime: Date | null = null;
    let deliveryTimeMinutes: number | null = null;
    if (trackingStatus === "delivered") {
      const variance = (rng() - 0.4) * 30; // -12 to +18 min variance
      deliveryTimeMinutes = Math.max(15, estDeliveryMins + variance);
      actualDeliveryTime = addMinutes(orderDate, deliveryTimeMinutes);
    }

    // Dispute distribution: ~20% of orders, skewed to delivered/canceled
    let disputeStatus: DisputeStatus = "none";
    let disputeReason: string | null = null;
    let compensationCost: number | null = null;
    const disputeRoll = rng();
    const canDispute = trackingStatus === "delivered" || trackingStatus === "canceled";
    if (canDispute && disputeRoll < 0.18) {
      const dsRoll = rng();
      if (dsRoll < 0.55) disputeStatus = "approved";
      else if (dsRoll < 0.85) disputeStatus = "denied";
      else disputeStatus = "pending";
      disputeReason = pick(DISPUTE_REASONS, rng);
      if (disputeStatus === "approved") {
        compensationCost = Math.round((rng() * 40 + 5) * 100) / 100;
      }
    }

    // Customer feedback for delivered orders
    let customerFeedback: string | null = null;
    let customerRating: number | null = null;
    if (trackingStatus === "delivered" && rng() < 0.45) {
      customerFeedback = pick(CUSTOMER_FEEDBACK, rng);
      customerRating = Math.floor(rng() * 2) + 4; // 4 or 5
      if (disputeStatus !== "none") customerRating = Math.floor(rng() * 2) + 1; // 1 or 2 if disputed
    }

    const items = generateItems(rng);
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    orders.push({
      id: `ORD-${String(i + 1).padStart(4, "0")}`,
      storeNumber: store.number,
      storeName: store.name,
      trackingStatus,
      driver,
      orderDate,
      estimatedDeliveryTime,
      actualDeliveryTime,
      disputeStatus,
      disputeReason,
      compensationCost,
      customerFeedback,
      customerRating,
      totalAmount: Math.round(totalAmount * 100) / 100,
      deliveryTimeMinutes: deliveryTimeMinutes ? Math.round(deliveryTimeMinutes) : null,
      items,
    });
  }

  return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
}

export const MOCK_ORDERS: Order[] = generateOrders();

export const STORE_OPTIONS = [
  { value: "all", label: "All Stores" },
  ...STORES.map((s) => ({ value: s.number, label: `${s.number} — ${s.name}` })),
];

export function computeOrdersOverTime(
  orders: Order[]
): { date: string; orders: number; disputes: number }[] {
  const map = new Map<string, { orders: number; disputes: number }>();
  orders.forEach((o) => {
    const key = format(o.orderDate, "MMM dd");
    if (!map.has(key)) map.set(key, { orders: 0, disputes: 0 });
    const entry = map.get(key)!;
    entry.orders++;
    if (o.disputeStatus !== "none") entry.disputes++;
  });
  return Array.from(map.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30);
}

export function computeDeliveryByStore(
  orders: Order[]
): { store: string; storeNumber: string; avgMinutes: number }[] {
  const storeMap = new Map<string, { total: number; count: number; name: string }>();
  orders.forEach((o) => {
    if (o.deliveryTimeMinutes !== null) {
      if (!storeMap.has(o.storeNumber)) {
        storeMap.set(o.storeNumber, { total: 0, count: 0, name: o.storeName });
      }
      const entry = storeMap.get(o.storeNumber)!;
      entry.total += o.deliveryTimeMinutes;
      entry.count++;
    }
  });
  return Array.from(storeMap.entries()).map(([num, v]) => ({
    store: num,
    storeNumber: num,
    avgMinutes: v.count > 0 ? Math.round(v.total / v.count) : 0,
  }));
}
