"use client";

import React, { useMemo, useState } from "react";
import { Package, Truck, CheckCircle, Clock, Search, Filter, Eye, Download } from "lucide-react";
import { getMyOrders } from "@/hooks/CustomHooks/orders";

interface Order {
  id: string;
  orderNumber: string;
  date: string; 
  status: "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>; 
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingAddress: string;
}

const safeStatus = (raw: any): Order["status"] => {
  const s = String(raw || "").toLowerCase();
  if (s === "processing" || s === "shipped" || s === "delivered" || s === "cancelled") return s;
  return "processing";
};

const firstImage = (images: any[]): string => {
  const url = images?.[0]?.url;
  return typeof url === "string" && url.length > 0 ? url : "https://via.placeholder.com/80";
};

const firstDiscounted = (variants: any[]): number => {
  const v = variants?.[0]?.discountedPrice;
  return typeof v === "number" ? v : 0;
};

const mapApiOrdersToUI = (apiOrders: any[]): Order[] => {
  if (!Array.isArray(apiOrders)) return [];

  return apiOrders.map((o) => {
    const address = o?.deliveryDetails;
    const shippingAddress = address
      ? `${address.address}${address.city ? `, ${address.city}` : ""}${address.state ? `, ${address.state}` : ""}${
          address.pincode ? `, ${address.pincode}` : ""
        }`
      : "";

    const items = (o?.products || []).map((p: any) => {
      // support both shapes: p.product_id (populated) OR p.product (populated)
      const prod = p?.product_id || p?.product || {};
      return {
        id: String(p?._id || prod?._id || Math.random()),
        name: String(prod?.name || "Product"),
        image: firstImage(prod?.images || []),
        quantity: Number(p?.quantity || 1),
        price: firstDiscounted(prod?.variants || []), // using discountedPrice from first variant
      };
    });

    return {
      id: String(o?._id),
      orderNumber: String(o?.paymentDetails?.razorpay_order_id || o?._id),
      date: String(o?.createdAt || new Date().toISOString()),
      status: safeStatus(o?.orderStatus),
      total: Number(o?.totalAmount || 0),
      items,
      shippingAddress,
      // trackingNumber / estimatedDelivery not provided by backend -> omitted
    } as Order;
  });
};

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: ordersData, isLoading, isSuccess } = getMyOrders();

  const orders: Order[] = useMemo(() => {
    // your hook likely returns { data: [...] } or directly an array — handle both
    const raw = (ordersData as any)?.data ?? ordersData ?? [];
    return mapApiOrdersToUI(raw);
  }, [ordersData]);

  if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>

        {/* Loading text */}
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          Fetching your orders...
        </p>
      </div>
    </div>
  );
}
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="w-5 h-5 text-[#eac90b]" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <Package className="w-5 h-5 text-[#E40000]" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const currentOrders = orders.filter((order) => order.status === "processing" || order.status === "shipped");
  const orderHistory = orders.filter((order) => order.status === "delivered" || order.status === "cancelled");

  const filteredOrders = (activeTab === "current" ? currentOrders : orderHistory).filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
          {getStatusIcon(order.status)}
          <div>
            <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
            <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-500 hover:text-[#E40000] transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="font-semibold text-lg text-gray-900">₹{order.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
            <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
            <span className="text-sm text-gray-700">{item.name}</span>
            {item.quantity > 1 && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">×{item.quantity}</span>}
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2 text-sm text-gray-600">
            +{order.items.length - 3} more
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => setSelectedOrder(order)}
          className="border border-gray-300 hover:border-[#E40000] text-gray-700 hover:text-[#E40000] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );

  const OrderDetailsModal: React.FC<{ order: Order; onClose: () => void }> = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Shipping Information</h3>
              <div className="text-sm">
                <p className="text-gray-600 mb-1">Delivery Address:</p>
                <p className="text-gray-900">{order.shippingAddress}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
              <span className="text-xl font-bold text-[#E40000]">₹{order.total.toFixed(2)}</span>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );

  const TrackingProgress: React.FC<{ status: string }> = ({ status }) => {
    const steps = [
      { key: "processing", label: "Order Processing", icon: Package },
      { key: "shipped", label: "Shipped", icon: Truck },
      { key: "delivered", label: "Delivered", icon: CheckCircle },
    ];

    const currentStepIndex = steps.findIndex((step) => step.key === status);

    return (
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isCompleted ? "bg-green-500 text-white" : isActive ? "bg-[#eac90b] text-black" : "bg-gray-200 text-gray-500"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs text-center ${isActive ? "text-gray-900 font-medium" : "text-gray-500"}`}>{step.label}</span>
              {index < steps.length - 1 && <div className={`w-full h-1 mt-2 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track your orders and view your purchase history</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("current")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "current" ? "text-[#E40000] border-b-2 border-[#E40000]" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Current Orders ({currentOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "history" ? "text-[#E40000] border-b-2 border-[#E40000]" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Order History ({orderHistory.length})
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by number or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eac90b] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eac90b] focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters"
                  : activeTab === "current"
                  ? "You have no current orders"
                  : "You have no order history yet"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
};

export default OrdersPage;
