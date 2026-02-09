"use client";
import React, { useMemo, useState } from "react";
import {
  Package,
  Truck,
  Clock,
  MapPin,
  Phone,
  ExternalLink,
  ArrowLeft,
  PackageSearch,
} from "lucide-react";
import { getMyOrders } from "@/hooks/CustomHooks/orders";
import Link from "next/link";

interface TrackingOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: "processing" | "shipped";
  total: number;
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>;
  deliveryMode: "courier" | "parcel";
  trackingLink?: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    mobile: string;
  };
}

const safeStatus = (raw: any): "processing" | "shipped" => {
  const s = String(raw || "").toLowerCase();
  if (s === "shipped") return "shipped";
  return "processing";
};

const firstImage = (images: any[]): string => {
  const url = images?.[0]?.url;
  return typeof url === "string" && url.length > 0
    ? url
    : "https://via.placeholder.com/80";
};

const firstDiscounted = (variants: any[]): number => {
  const v = variants?.[0]?.discountedPrice;
  return typeof v === "number" ? v : 0;
};

const getTrackingLink = (deliveryMode: string, orderNumber: string): string => {
  if (deliveryMode === "courier") {
    // Example: Using Delhivery tracking (replace with your actual courier service)
    return `https://www.delhivery.com/track/package/${orderNumber}`;
  } else {
    // Example: Using India Post tracking for parcel
    return `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`;
  }
};

const mapApiOrdersToTracking = (apiOrders: any[]): TrackingOrder[] => {
  if (!Array.isArray(apiOrders)) return [];
  
  return apiOrders
    .filter((o) => {
      const status = String(o?.orderStatus || "").toLowerCase();
      return status === "processing" || status === "shipped";
    })
    .map((o) => {
      const delivery = o?.deliveryDetails || {};
      const deliveryMode = String(delivery.deliveryMode || "courier").toLowerCase();
      const orderNumber = String(o?.paymentDetails?.razorpay_order_id || o?._id || "");
      
      const items = (o?.products || []).map((p: any) => {
        const prod = p?.product_id || p?.product || {};
        return {
          id: String(p?._id || prod?._id || Math.random()),
          name: String(prod?.name || "Product"),
          image: firstImage(prod?.images || []),
          quantity: Number(p?.quantity || 1),
          price: firstDiscounted(prod?.variants || []),
        };
      });

      return {
        id: String(o?._id),
        orderNumber,
        date: String(o?.createdAt || new Date().toISOString()),
        status: safeStatus(o?.orderStatus),
        total: Number(o?.totalAmount || 0),
        items,
        deliveryMode: deliveryMode as "courier" | "parcel",
        trackingLink: getTrackingLink(deliveryMode, orderNumber),
        shippingAddress: {
          address: String(delivery.address || ""),
          city: String(delivery.city || ""),
          state: String(delivery.state || ""),
          pincode: String(delivery.pincode || ""),
          mobile: String(delivery.mobile || ""),
        },
      } as TrackingOrder;
    });
};

const TrackOrderPage: React.FC = () => {
  const { data: ordersData, isLoading } = getMyOrders();

  const trackingOrders: TrackingOrder[] = useMemo(() => {
    const raw = (ordersData as any)?.data ?? ordersData ?? [];
    return mapApiOrdersToTracking(raw);
  }, [ordersData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-50 border-2 border-yellow-600">
            <Package className="w-8 h-8 text-yellow-600 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-normal text-gray-800">
              Loading Tracking Information
            </h2>
            <p className="text-sm text-gray-500">
              Please wait while we fetch your order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "processing":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
          icon: Clock,
        };
      case "shipped":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: Truck,
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: Package,
        };
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-normal text-gray-800 mb-2">
            Track Your Orders
          </h1>
          <p className="text-sm text-gray-500">
            Monitor the real-time status of your current orders
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {trackingOrders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                <PackageSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No Active Orders
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                You don't have any orders to track at the moment. All your
                orders have been delivered or you haven't placed any orders yet.
              </p>
              <Link
                href="/shop"
                className="inline-block mt-6 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            trackingOrders.map((order) => {
              const statusStyle = getStatusStyle(order.status);
              const StatusIcon = statusStyle.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm shadow-amber-50 hover:shadow-md hover:shadow-amber-100 transition-all duration-200"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-white border-b border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-800">
                            Order #{order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Placed on{" "}
                            {new Date(order.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          <span>
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-4 sm:p-6 space-y-6">
                    {/* Delivery Mode Badge */}
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
                      <Truck className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700">
                        Delivery via{" "}
                        {order.deliveryMode.charAt(0).toUpperCase() +
                          order.deliveryMode.slice(1)}
                      </span>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800 mb-2">
                            Delivery Address
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {order.shippingAddress.address}
                            <br />
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state} -{" "}
                            {order.shippingAddress.pincode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 pt-2 border-t border-gray-200">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.mobile}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-800">
                        Order Items ({order.items.length})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-yellow-300 transition-all duration-200"
                          >
                            <div className="aspect-square relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              {item.quantity > 1 && (
                                <div className="absolute top-1.5 right-1.5 bg-yellow-600 text-white text-xs px-2 py-0.5 rounded font-medium">
                                  {item.quantity}
                                </div>
                              )}
                            </div>
                            <div className="p-2">
                              <p className="text-xs text-gray-700 line-clamp-1 font-medium">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                ₹{item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-800">
                        Order Total
                      </p>
                      <p className="text-lg font-medium text-gray-800">
                        ₹{order.total.toLocaleString()}
                      </p>
                    </div>

                    {/* Track Order Button */}
                    {order.trackingLink && (
                      <a
                        href={order.trackingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-center"
                      >
                        <span className="inline-flex items-center space-x-2">
                          <Truck className="w-5 h-5" />
                          <span>
                            Track {order.deliveryMode === "courier" ? "Courier" : "Parcel"}
                          </span>
                          <ExternalLink className="w-4 h-4" />
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Info Section */}
        {trackingOrders.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-800 mb-3">
              Tracking Information
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-start space-x-2">
                <span className="text-yellow-600 font-medium">•</span>
                <span>
                  Click "Track Courier/Parcel" to view real-time tracking
                  updates from the delivery service
                </span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-yellow-600 font-medium">•</span>
                <span>
                  Order status updates may take 2-4 hours to reflect in the
                  tracking system
                </span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-yellow-600 font-medium">•</span>
                <span>
                  For any delivery concerns, please contact our support team
                  with your order number
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;