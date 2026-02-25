export type OrderStatus = "delivered" | "in_transit" | "canceled" | "pending";
export type DisputeStatus = "approved" | "denied" | "pending" | "none";

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
  estimatedDeliveryTime: Date;
  actualDeliveryTime: Date | null;
  disputeStatus: DisputeStatus;
  disputeReason: string | null;
  compensationCost: number | null;
  customerFeedback: string | null;
  customerRating: number | null;
  totalAmount: number;
  deliveryTimeMinutes: number | null;
  items: OrderItem[];
}

export interface AggregateMetrics {
  totalOrders: number;
  totalDisputes: number;
  approvedDisputes: number;
  deniedDisputes: number;
  pendingDisputes: number;
  avgCompensationCost: number;
  avgDeliveryTimeMinutes: number;
  orderCompletionRate: number;
  ordersOverTime: { date: string; orders: number; disputes: number }[];
  deliveryByStore: { store: string; avgMinutes: number; storeNumber: string }[];
  disputeBreakdown: { name: string; value: number; color: string }[];
}

export interface FilterState {
  dateFrom: Date;
  dateTo: Date;
  storeNumber: string;
  orderStatus: OrderStatus | "all";
  disputeStatus: DisputeStatus | "all";
}
