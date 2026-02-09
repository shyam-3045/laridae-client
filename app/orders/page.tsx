"use client";
import React, { useMemo, useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  ArrowRight,
  Calendar,
  MapPin,
  ShoppingBag,
  X,
} from "lucide-react";
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
  if (
    s === "processing" ||
    s === "shipped" ||
    s === "delivered" ||
    s === "cancelled"
  )
    return s;
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

const mapApiOrdersToUI = (apiOrders: any[]): Order[] => {
  if (!Array.isArray(apiOrders)) return [];
  return apiOrders.map((o) => {
    const address = o?.deliveryDetails;
    const shippingAddress = address
      ? `${address.address}${address.city ? `, ${address.city}` : ""}${
          address.state ? `, ${address.state}` : ""
        }${address.pincode ? `, ${address.pincode}` : ""}`
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
      orderNumber: String(
        o?.paymentDetails?.razorpay_order_id || o?._id
      ),
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: ordersData, isLoading, isSuccess } = getMyOrders();
  console.log(ordersData)

  const orders: Order[] = useMemo(() => {
    const raw = (ordersData as any)?.data ?? ordersData ?? [];
    return mapApiOrdersToUI(raw);
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
              Fetching Your Orders
            </h2>
            <p className="text-sm text-gray-500">
              Please wait while we load your order history...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="w-5 h-5" />;
      case "shipped":
        return <Truck className="w-5 h-5" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5" />;
      case "cancelled":
        return <X className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "delivered":
        return "bg-green-50 text-green-700 border border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const currentOrders = orders.filter(
    (order) => order.status === "processing" || order.status === "shipped"
  );
  const orderHistory = orders.filter(
    (order) => order.status === "delivered" || order.status === "cancelled"
  );

  const filteredOrders = (
    activeTab === "current" ? currentOrders : orderHistory
  ).filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm shadow-amber-50 hover:shadow-md hover:shadow-amber-100 transition-all duration-200">
      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              {getStatusIcon(order.status)}
            </div>
            <div className="flex-1 min-w-0">
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
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium ${getStatusStyle(
                order.status
              )}`}
            >
              {getStatusIcon(order.status)}
              <span>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </span>
            <button
              onClick={() => setSelectedOrder(order)}
              className="p-2 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-200"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Order Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-base font-medium text-gray-800">
              ₹{order.total.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Items</p>
            <p className="text-base font-medium text-gray-800">
              {order.items.length}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Delivery</p>
            <p className="text-sm text-gray-800 truncate">
              {order.shippingAddress || "Address not available"}
            </p>
          </div>
        </div>

        {/* Items Preview */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-800">Order Items</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {order.items.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 group hover:border-yellow-300 transition-all duration-200"
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
                    ₹{item.price.toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-medium">
                  +{order.items.length - 4} more
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => setSelectedOrder(order)}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2.5 rounded text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const OrderDetailsModal: React.FC<{ order: Order; onClose: () => void }> = ({
    order,
    onClose,
  }) => (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md z-50 flex items-start justify-center p-4 pt-8">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-normal text-gray-800">Order Details</h2>
            <p className="text-sm text-gray-500 mt-1">#{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Progress */}
        <TrackingProgress status={order.status} />

        {/* Order Info Grid */}
        <div className="p-6 space-y-6">
          {/* Order Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-800 pb-2 border-b border-gray-200">
              Order Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-500">Order Number</p>
                <p className="text-sm text-gray-800 mt-1 font-medium">
                  {order.orderNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date Placed</p>
                <p className="text-sm text-gray-800 mt-1">
                  {new Date(order.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium mt-1 ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  <span>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-800 pb-2 border-b border-gray-200">
              Shipping Information
            </h3>
            <div>
              <p className="text-xs text-gray-500 mb-2">Delivery Address</p>
              <p className="text-sm text-gray-800 leading-relaxed">
                {order.shippingAddress || "Address not available"}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-800">
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-4"
                >
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Qty: {item.quantity} × ₹{item.price.toLocaleString()}{" "}
                      each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-gray-800">
                  Order Total
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Including all taxes and fees
                </p>
              </div>
              <p className="text-xl font-medium text-gray-800">
                ₹{order.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TrackingProgress: React.FC<{ status: string }> = ({ status }) => {
    const steps = [
      {
        key: "processing",
        label: "Order Processing",
        icon: Package,
        description: "Your order is being prepared",
      },
      {
        key: "shipped",
        label: "Shipped",
        icon: Truck,
        description: "Your order is on the way",
      },
      {
        key: "delivered",
        label: "Delivered",
        icon: CheckCircle,
        description: "Your order has been delivered",
      },
    ];

    const currentStepIndex = steps.findIndex((step) => step.key === status);

    return (
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-800 mb-4">
          Order Progress
        </h3>
        <div className="relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStepIndex;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={step.key} className="relative">
                <div className="flex items-start space-x-4 pb-8 last:pb-0">
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                        isActive
                          ? "bg-yellow-600 border-yellow-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute left-1/2 top-10 bottom-0 w-0.5 -ml-px transition-all duration-200 ${
                          isCompleted ? "bg-yellow-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-gray-800" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-normal text-gray-800 mb-2">
            My Orders
          </h1>
          <p className="text-sm text-gray-500">
            Track your orders, view purchase history, and manage your shopping
            experience
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab("current")}
              className={`flex-1 py-4 px-6 text-center text-sm font-medium transition-all duration-200 relative ${
                activeTab === "current"
                  ? "text-yellow-600 bg-yellow-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Current Orders ({currentOrders.length})
              {activeTab === "current" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-4 px-6 text-center text-sm font-medium transition-all duration-200 relative ${
                activeTab === "history"
                  ? "text-yellow-600 bg-yellow-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Order History ({orderHistory.length})
              {activeTab === "history" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-600" />
              )}
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-white transition-all duration-200 text-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No Orders Found
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
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
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersPage;