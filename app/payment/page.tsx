"use client";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Phone,
  Home,
  Navigation,
  ShoppingBag,
  X,
  Package,
  Truck,
} from "lucide-react";
import { addUserDetails } from "@/hooks/CustomHooks/auth";
import OtpModal from "@/components/layouts/otpModal";
import { sendOtpReq } from "@/hooks/CustomHooks/otp";
import { useCartStore } from "@/store/cartStore";
import { useAllProducts } from "@/hooks/CustomHooks/useAllProducts";

const deliverySchema = z.object({
  address: z
    .string()
    .min(1, "Address is required")
    .min(10, "Address must be at least 10 characters"),
  pincode: z
    .string()
    .min(1, "Pincode is required")
    .regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  city: z
    .string()
    .min(1, "City is required")
    .min(2, "City must be at least 2 characters"),
  state: z
    .string()
    .min(1, "State is required")
    .min(2, "State must be at least 2 characters"),
  landmark: z.string().optional(),
  setAsDefault: z.boolean().default(false).optional(),
  deliveryMode: z.enum(["courier", "parcel"]).optional(),
});

export type DeliveryFormData = z.infer<typeof deliverySchema>;

const PaymentPage: React.FC = () => {
  const {
    mutate: sendOtp,
    isError: otpisError,
    error: otpError,
  } = sendOtpReq();
  const { cart } = useCartStore();
  const { data: allProducts } = useAllProducts();
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    mode: "onChange",
    shouldUnregister: true,
    defaultValues: {
      address: "",
      pincode: "",
      mobile: "",
      city: "",
      state: "",
      landmark: "",
      setAsDefault: false,
      deliveryMode: undefined,
    },
  });

  const [delivarydetails, setDeliveryDetails] = useState<DeliveryFormData>();
  const [showDeliveryService, setShowDeliveryService] = useState<Boolean>(true);
  const [otpModal, setOtpModal] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState<number>();
  const { data: userData, isPending, mutate: addUser } = addUserDetails();
  const pincode = useWatch({ control, name: "pincode" });
  const deliveryMode = useWatch({ control, name: "deliveryMode" });
  const isPincodeValid = /^\d{6}$/.test(pincode ?? "");
  const isShowService = isPincodeValid && showDeliveryService;

  const cartProducts = cart.map((prod) => {
    const product = allProducts?.data.find(
      (item: any) => item._id == prod.product_id
    );

    return {
      ...prod,
      product,
    };
  });

  const getCourierDeliveryCharge = (weight: number): number => {
    if (weight <= 0) {
      throw new Error("Invalid weight");
    }

    switch (true) {
      case weight <= 1:
        return 40;
      case weight <= 2:
        return 60;
      case weight <= 3:
        return 90;
      case weight <= 4:
        return 110;
      case weight <= 5:
        return 150;
      case weight <= 8:
        return 180;
      case weight <= 10:
        return 200;
      case weight <= 15:
        return 225;
      default:
        return Math.ceil(weight) * 15;
    }
  };

  let  Subtotal = cartProducts.reduce((sum, prod) => {
    return sum + prod?.product?.variants[0]?.discountedPrice * prod.quantity;
  }, 0);

  if(!!deliveryCharge)
  {
    Subtotal += deliveryCharge
  }

  const onSubmit = async (data: DeliveryFormData) => {
    try {
      //  const user = JSON.parse(localStorage.getItem("user-storage") as string);
      const phone = data.mobile;
      console.log(data)
      setDeliveryDetails(data);
      addUser({ data });
      reset();
      sendOtp({ phone });
      if (otpisError) console.log(otpError);
      setOtpModal(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const totalWeight = cartProducts.reduce((sum, prod) => {
    const rawWeight = prod?.product?.variants?.[0]?.weight;

    if (!rawWeight) return sum;

    const match = rawWeight
      .trim()
      .toLowerCase()
      .match(/^([\d.]+)\s*(kg|g)$/);

    if (!match) return sum;

    const value = Number(match[1]);
    const unit = match[2];
    const quantity = prod?.quantity ?? 1;

    const weightInKg =
      unit === "kg" ? value * quantity : (value / 1000) * quantity;

    return sum + weightInKg;
  }, 0);

  const onClose = () => {
    setOtpModal(false);
  };

  const handleDeliveryService = (mode: "parcel" | "courier") => {
    setValue("deliveryMode", mode, { shouldValidate: true });
    setShowDeliveryService(false);
    if (mode == "courier") {
      setDeliveryCharge(getCourierDeliveryCharge(totalWeight));
    }
  };

  const handleUndoService = () => {
    setValue("deliveryMode", undefined, { shouldValidate: true });
    setShowDeliveryService(true);
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[calc(100vh-200px)]">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-red-600" />
                  Order Summary
                </h2>
                <p className="text-sm text-gray-600">
                  {cartProducts.length}{" "}
                  {cartProducts.length === 1 ? "item" : "items"} in your cart
                </p>
              </div>

              {cartProducts.length > 0 ? (
                <div className="space-y-3">
                  {cartProducts.map((prod) => (
                    <div
                      key={prod.product_id}
                      className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
                    >
                      <div className="flex-shrink-0 w-20 h-20 bg-white rounded-lg overflow-hidden border border-gray-200">
                        {prod.product?.images &&
                        prod.product.images.length > 0 ? (
                          <img
                            src={
                              prod.product.images[0].url ||
                              prod.product.images[0]
                            }
                            alt={prod.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <ShoppingBag size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                          {prod.product?.name || "Product Name"}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          {prod.product?.category || "Category"}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Qty: <span className="font-semibold">{prod.quantity}</span>
                          </span>
                          {prod.product?.variants &&
                            prod.product.variants.length > 0 && (
                              <span className="text-sm font-bold text-red-600">
                                ₹{prod.product.variants[0].discountedPrice}
                              </span>
                            )}
                        </div>
                        {prod.product?.packaging && (
                          <p className="text-xs text-gray-500 mt-1">
                            📦 {prod.product.packaging}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    {!!deliveryMode && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Delivery Charge:</span>
                        <span className="font-semibold text-gray-900">
                          {deliveryMode === "courier"
                            ? `₹${deliveryCharge}`
                            : "Yet to be paid"}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                      <span className="font-bold text-gray-900">Total Amount:</span>
                      <span className="text-xl font-bold text-red-600">
                        ₹{Subtotal.toLocaleString('en-IN') }
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Delivery Details
                </h2>
                <p className="text-sm text-gray-600">
                  Enter your complete delivery address
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    <Home size={14} className="inline mr-1.5" />
                    Complete Address *
                  </label>
                  <textarea
                    id="address"
                    {...register("address")}
                    rows={3}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="House/Flat No, Street, Area, Locality"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="pincode"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      <MapPin size={14} className="inline mr-1.5" />
                      Pincode *
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      {...register("pincode")}
                      className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                        errors.pincode ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="123456"
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.pincode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      <Phone size={14} className="inline mr-1.5" />
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      {...register("mobile")}
                      className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                        errors.mobile ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>
                </div>

                {isShowService && (
                  <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                    <p className="text-sm font-semibold mb-3 text-gray-800">
                      Choose delivery service
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleDeliveryService("parcel")}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                          deliveryMode === "parcel"
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:shadow-sm"
                        }`}
                      >
                        <Package size={18} />
                        <span className="font-medium text-sm">Parcel</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeliveryService("courier")}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                          deliveryMode === "courier"
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:shadow-sm"
                        }`}
                      >
                        <Truck size={18} />
                        <span className="font-medium text-sm">Courier</span>
                      </button>
                    </div>
                  </div>
                )}

                {deliveryMode && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      {deliveryMode === "courier" ? (
                        <Truck size={16} className="text-gray-600" />
                      ) : (
                        <Package size={16} className="text-gray-600" />
                      )}
                      <span className="text-sm font-semibold text-gray-900 capitalize">
                        {deliveryMode} selected
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUndoService()}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      {...register("city")}
                      className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your city"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      {...register("state")}
                      className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                        errors.state ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your state"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="landmark"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    <Navigation size={14} className="inline mr-1.5" />
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    {...register("landmark")}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Near famous place, building, etc."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="setAsDefault"
                    {...register("setAsDefault")}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="setAsDefault"
                    className="text-sm font-medium text-gray-700"
                  >
                    Set as default delivery address
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || isPending ||!deliveryMode}
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Address & Checkout"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div>
        {otpModal && (
          <OtpModal
            isOpen={otpModal}
            onClose={onClose}
            delivarydetails={delivarydetails}
            totalAmount={useCartStore.getState().cartTotal}
            products={useCartStore.getState().cart}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentPage;