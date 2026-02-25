"use client";

import { useEffect, useRef } from "react";
import { format } from "date-fns";
import {
  X,
  Store,
  User,
  Calendar,
  Clock,
  Star,
  AlertTriangle,
  MessageSquare,
  Package,
  DollarSign,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { Order } from "@/lib/types";
import { cn, formatCurrency, formatDuration } from "@/lib/utils";
import { OrderStatusBadge, DisputeStatusBadge } from "./StatusBadge";

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-surface-800">{title}</h3>
      </div>
      <div className="bg-surface-50 rounded-lg p-3 space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-surface-500 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-xs font-medium text-surface-900 text-right">{value}</span>
    </div>
  );
}

function Timeline({ order }: { order: Order }) {
  const steps = [
    {
      icon: <Package className="w-3.5 h-3.5" />,
      label: "Order Placed",
      time: format(order.orderDate, "MMM d, h:mm a"),
      done: true,
    },
    {
      icon: <Truck className="w-3.5 h-3.5" />,
      label: "In Transit",
      time: format(order.estimatedDeliveryTime, "Est. h:mm a"),
      done: order.trackingStatus === "delivered" || order.trackingStatus === "in_transit",
    },
    {
      icon:
        order.trackingStatus === "canceled" ? (
          <XCircle className="w-3.5 h-3.5" />
        ) : (
          <CheckCircle className="w-3.5 h-3.5" />
        ),
      label: order.trackingStatus === "canceled" ? "Canceled" : "Delivered",
      time: order.actualDeliveryTime
        ? format(order.actualDeliveryTime, "h:mm a")
        : order.trackingStatus === "canceled"
        ? "—"
        : "Pending",
      done: order.trackingStatus === "delivered" || order.trackingStatus === "canceled",
    },
  ];

  return (
    <div className="flex items-center gap-0 mt-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 text-white transition-colors",
                step.done
                  ? order.trackingStatus === "canceled" && i === steps.length - 1
                    ? "bg-red-500 border-red-500"
                    : "bg-brand-500 border-brand-500"
                  : "bg-white border-surface-200 text-surface-400"
              )}
            >
              {step.icon}
            </div>
            <p
              className={cn(
                "text-xs mt-1 font-medium text-center",
                step.done ? "text-surface-700" : "text-surface-400"
              )}
            >
              {step.label}
            </p>
            <p className="text-xs text-surface-400">{step.time}</p>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mt-[-20px]",
                step.done ? "bg-brand-400" : "bg-surface-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!order) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [order, onClose]);

  if (!order) return null;

  const totalItemValue = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={`Order details for ${order.id}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-surface-200 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-base font-bold text-surface-900">{order.id}</h2>
            <p className="text-xs text-surface-500">{order.storeName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-surface-700 transition-colors"
            aria-label="Close order details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge status={order.trackingStatus} />
            {order.disputeStatus !== "none" && (
              <DisputeStatusBadge status={order.disputeStatus} />
            )}
          </div>

          {/* Timeline */}
          <Timeline order={order} />

          {/* Order Info */}
          <Section
            title="Order Information"
            icon={<Store className="w-3.5 h-3.5 text-brand-600" />}
          >
            <Row label="Order ID" value={order.id} />
            <Row label="Store" value={`${order.storeNumber} — ${order.storeName}`} />
            <Row
              label="Order Date"
              value={format(order.orderDate, "MMM d, yyyy h:mm a")}
            />
            <Row
              label="Total Amount"
              value={
                <span className="font-bold text-surface-900">
                  {formatCurrency(order.totalAmount)}
                </span>
              }
            />
          </Section>

          {/* Driver Info */}
          <Section
            title="Driver"
            icon={<User className="w-3.5 h-3.5 text-brand-600" />}
          >
            <Row label="Name" value={order.driver.name} />
            <Row label="Driver ID" value={order.driver.id} />
            <Row label="Phone" value={order.driver.phone} />
            <Row
              label="Rating"
              value={
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {order.driver.rating.toFixed(1)}
                </span>
              }
            />
          </Section>

          {/* Delivery Info */}
          <Section
            title="Delivery Details"
            icon={<Clock className="w-3.5 h-3.5 text-brand-600" />}
          >
            <Row
              label="Est. Delivery"
              value={format(order.estimatedDeliveryTime, "h:mm a")}
            />
            {order.actualDeliveryTime && (
              <Row
                label="Actual Delivery"
                value={format(order.actualDeliveryTime, "h:mm a")}
              />
            )}
            {order.deliveryTimeMinutes && (
              <Row
                label="Delivery Time"
                value={
                  <span
                    className={cn(
                      "font-semibold",
                      order.deliveryTimeMinutes <= 35
                        ? "text-green-600"
                        : order.deliveryTimeMinutes > 50
                        ? "text-red-500"
                        : "text-amber-600"
                    )}
                  >
                    {formatDuration(order.deliveryTimeMinutes)}
                  </span>
                }
              />
            )}
          </Section>

          {/* Order Items */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center">
                <Package className="w-3.5 h-3.5 text-brand-600" />
              </div>
              <h3 className="text-sm font-semibold text-surface-800">Items Ordered</h3>
            </div>
            <div className="bg-surface-50 rounded-lg overflow-hidden">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between px-3 py-2",
                    i < order.items.length - 1 && "border-b border-surface-200"
                  )}
                >
                  <div>
                    <p className="text-xs font-medium text-surface-800">{item.name}</p>
                    <p className="text-xs text-surface-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-semibold text-surface-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between px-3 py-2 border-t border-surface-200 bg-white">
                <span className="text-xs font-semibold text-surface-700">Total</span>
                <span className="text-xs font-bold text-surface-900">
                  {formatCurrency(totalItemValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Dispute Info */}
          {order.disputeStatus !== "none" && (
            <Section
              title="Dispute Information"
              icon={<AlertTriangle className="w-3.5 h-3.5 text-brand-600" />}
            >
              <Row
                label="Status"
                value={<DisputeStatusBadge status={order.disputeStatus} />}
              />
              {order.disputeReason && (
                <Row label="Reason" value={order.disputeReason} />
              )}
              {order.compensationCost && (
                <Row
                  label="Compensation"
                  value={
                    <span className="font-semibold text-green-600">
                      {formatCurrency(order.compensationCost)}
                    </span>
                  }
                />
              )}
            </Section>
          )}

          {/* Customer Feedback */}
          {order.customerFeedback && (
            <Section
              title="Customer Feedback"
              icon={<MessageSquare className="w-3.5 h-3.5 text-brand-600" />}
            >
              {order.customerRating && (
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < (order.customerRating ?? 0)
                          ? "text-amber-500 fill-amber-500"
                          : "text-surface-300"
                      )}
                    />
                  ))}
                  <span className="text-xs text-surface-500 ml-1">
                    {order.customerRating}/5
                  </span>
                </div>
              )}
              <p className="text-xs text-surface-700 italic">
                &ldquo;{order.customerFeedback}&rdquo;
              </p>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
