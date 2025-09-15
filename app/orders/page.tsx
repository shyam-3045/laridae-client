"use client";

import React, { useMemo, useState } from "react";
import { Package, Truck, CheckCircle, Clock, Search, Filter, Eye, ArrowRight, Calendar, MapPin, ShoppingBag, Star } from "lucide-react";
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
      orderNumber: String(o?.paymentDetails?.razorpay_order_id || o?._id),
      date: String(o?.createdAt || new Date().toISOString()),
      status: safeStatus(o?.orderStatus),
      total: Number(o?.totalAmount || 0),
      items,
      shippingAddress,
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
    const raw = (ordersData as any)?.data ?? ordersData ?? [];
    return mapApiOrdersToUI(raw);
  }, [ordersData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-200 border-dashed rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800 mb-2">Fetching Your Orders</p>
            <p className="text-gray-600">Please wait while we load your order history...</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-red-600" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "cancelled":
        return <Package className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border border-amber-200";
      case "shipped":
        return "bg-gradient-to-r from-red-50 to-indigo-50 text-red-800 border border-red-200";
      case "delivered":
        return "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border border-emerald-200";
      case "cancelled":
        return "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200";
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border border-gray-200";
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
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-white shadow-sm group-hover:scale-105 transition-transform duration-200">
              {getStatusIcon(order.status)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">#{order.orderNumber}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                <Calendar className="w-4 h-4" />
                <span>Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <button 
              onClick={() => setSelectedOrder(order)} 
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-indigo-50 rounded-xl p-4 border border-red-100">
            <div className="flex items-center space-x-2 mb-2">
              <ShoppingBag className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">Total Amount</span>
            </div>
            <p className="text-2xl font-bold text-red-900">₹{order.total.toLocaleString()}</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Items</span>
            </div>
            <p className="text-2xl font-bold text-emerald-900">{order.items.length}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Delivery</span>
            </div>
            <p className="text-sm font-semibold text-purple-900 line-clamp-2">
              {order.shippingAddress || "Address not available"}
            </p>
          </div>
        </div>

        {/* Items Preview */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Order Items
          </h4>
          <div className="flex flex-wrap gap-3">
            {order.items.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-xl p-3 transition-colors group/item">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-12 h-12 rounded-lg object-cover shadow-sm" 
                  />
                  {item.quantity > 1 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                      {item.quantity}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-600">₹{item.price.toLocaleString()} each</p>
                </div>
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-3 min-w-[120px]">
                <span className="text-sm font-medium text-gray-700">+{order.items.length - 4} more</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setSelectedOrder(order)}
            className="flex-1 bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const OrderDetailsModal: React.FC<{ order: Order; onClose: () => void }> = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <p className="text-gray-600 mt-1">#{order.orderNumber}</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            {/* Status Progress */}
            <div className="mb-8">
              <TrackingProgress status={order.status} />
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Order Information */}
              <div className="bg-gradient-to-br from-red-50 to-indigo-50 rounded-2xl p-6 border border-red-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-red-600" />
                  Order Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-red-100 last:border-b-0">
                    <span className="text-gray-700 font-medium">Order Number</span>
                    <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-red-100 last:border-b-0">
                    <span className="text-gray-700 font-medium">Date Placed</span>
                    <span className="text-gray-900">{new Date(order.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-medium">Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                  Shipping Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-700 font-medium mb-2">Delivery Address</p>
                    <p className="text-gray-900 bg-white/70 rounded-lg p-3 border border-emerald-200">
                      {order.shippingAddress || "Address not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-purple-600" />
                Order Items ({order.items.length})
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 rounded-xl object-cover shadow-md" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="bg-white px-3 py-1 rounded-full border">Qty: {item.quantity}</span>
                          <span className="bg-white px-3 py-1 rounded-full border">₹{item.price.toLocaleString()} each</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Order Total</h3>
                  <p className="text-gray-600 text-sm mt-1">Including all taxes and fees</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-900">₹{order.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TrackingProgress: React.FC<{ status: string }> = ({ status }) => {
    const steps = [
      { key: "processing", label: "Order Processing", icon: Package, description: "Your order is being prepared" },
      { key: "shipped", label: "Shipped", icon: Truck, description: "Your order is on the way" },
      { key: "delivered", label: "Delivered", icon: CheckCircle, description: "Your order has been delivered" },
    ];

    const currentStepIndex = steps.findIndex((step) => step.key === status);

    return (
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-6 text-center">Order Progress</h3>
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStepIndex;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-lg transition-all duration-300 ${
                    isCompleted 
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white scale-110" 
                      : isActive 
                      ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 scale-105" 
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <span className={`text-sm font-semibold block mb-1 ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                    {step.label}
                  </span>
                  <span className="text-xs text-gray-600">{step.description}</span>
                </div>
              </div>
            );
          })}
          
          {/* Progress Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 rounded-full -z-10">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            My Orders
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your orders, view purchase history, and manage your shopping experience
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden border border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab("current")}
              className={`flex-1 py-6 px-8 text-center font-semibold transition-all duration-200 relative ${
                activeTab === "current" 
                  ? "text-red-600 bg-gradient-to-b from-red-50 to-white" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Current Orders ({currentOrders.length})</span>
              </div>
              {activeTab === "current" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-indigo-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-6 px-8 text-center font-semibold transition-all duration-200 relative ${
                activeTab === "history" 
                  ? "text-red-600 bg-gradient-to-b from-red-50 to-white" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Order History ({orderHistory.length})</span>
              </div>
              {activeTab === "history" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-indigo-500" />
              )}
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by number or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-10 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-gray-50 focus:bg-white transition-all duration-200 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Orders Found</h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters to find what you're looking for"
                  : activeTab === "current"
                  ? "You don't have any current orders. Start shopping to see your orders here!"
                  : "Your order history is empty. Your completed orders will appear here."}
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