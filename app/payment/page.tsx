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
  Tag,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { addUserDetails, useUserDetails } from "@/hooks/CustomHooks/auth";
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
  const { data: userDetails, isLoading } = useUserDetails();
  const [showDeliveryService, setShowDeliveryService] = useState<Boolean>(true);
  const [otpModal, setOtpModal] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState<number>();
  const { data: userData, isPending, mutate: addUser } = addUserDetails();
  const [discountApplied, setDiscountApplied] = useState(false);

  const pincode = useWatch({ control, name: "pincode" });
  const deliveryMode = useWatch({ control, name: "deliveryMode" });
  const isPincodeValid = /^\d{6}$/.test(pincode ?? "");
  const isShowService = isPincodeValid && showDeliveryService;

  const cartProducts = cart.map((prod) => {
    const product = allProducts?.data.find(
      (item: any) => item._id == prod.product_id
    );
    return { ...prod, product };
  });

  const getCourierDeliveryCharge = (weight: number): number => {
    if (weight <= 0) throw new Error("Invalid weight");
    switch (true) {
      case weight <= 1:  return 40;
      case weight <= 2:  return 60;
      case weight <= 3:  return 90;
      case weight <= 4:  return 110;
      case weight <= 5:  return 150;
      case weight <= 8:  return 180;
      case weight <= 10: return 200;
      case weight <= 15: return 225;
      default: return Math.ceil(weight) * 15;
    }
  };

  const discount = userDetails?.data?.data?.user?.availFirstDiscount;

  let baseSubtotal = cartProducts.reduce((sum, prod) => {
    return sum + prod?.product?.variants[0]?.discountedPrice * prod.quantity;
  }, 0);

  let Subtotal = baseSubtotal;

  if (!!deliveryCharge && !!deliveryMode) Subtotal += deliveryCharge;
  if (!!discount && discountApplied) Subtotal *= 0.90;

  const savingsAmount = discount && discountApplied
    ? Math.round(baseSubtotal * 0.10)
    : 0;

  const onSubmit = async (data: DeliveryFormData) => {
    try {
      const phone = data.mobile;
      console.log(data);
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
    const match = rawWeight.trim().toLowerCase().match(/^([\d.]+)\s*(kg|g)$/);
    if (!match) return sum;
    const value = Number(match[1]);
    const unit = match[2];
    const quantity = prod?.quantity ?? 1;
    const weightInKg = unit === "kg" ? value * quantity : (value / 1000) * quantity;
    return sum + weightInKg;
  }, 0);

  const onClose = () => setOtpModal(false);

  const handleDeliveryService = (mode: "parcel" | "courier") => {
    setValue("deliveryMode", mode, { shouldValidate: true });
    setShowDeliveryService(false);
    if (mode === "courier") setDeliveryCharge(getCourierDeliveryCharge(totalWeight));
  };

  const handleUndoService = () => {
    setValue("deliveryMode", undefined, { shouldValidate: true });
    setShowDeliveryService(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">

        <div className="flex items-center gap-2 mb-5 sm:mb-7">
          <ShoppingBag size={22} className="text-red-600" />
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_420px] gap-5">

          <div className="order-2 lg:order-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="mb-5">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5">Delivery Details</h2>
              <p className="text-xs sm:text-sm text-gray-500">Enter your complete delivery address</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Home size={13} className="inline mr-1.5" />
                  Complete Address *
                </label>
                <textarea
                  id="address"
                  {...register("address")}
                  rows={3}
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none ${errors.address ? "border-red-500" : "border-gray-300"}`}
                  placeholder="House/Flat No, Street, Area, Locality"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin size={13} className="inline mr-1.5" />
                    Pincode *
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    {...register("pincode")}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.pincode ? "border-red-500" : "border-gray-300"}`}
                    placeholder="123456"
                    maxLength={6}
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Phone size={13} className="inline mr-1.5" />
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    {...register("mobile")}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.mobile ? "border-red-500" : "border-gray-300"}`}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
                </div>
              </div>

              {isShowService && (
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                  <p className="text-sm font-semibold mb-3 text-gray-800">Choose delivery service</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleDeliveryService("parcel")}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm ${
                        deliveryMode === "parcel"
                          ? "border-red-600 bg-red-50 text-red-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Package size={17} />
                      Parcel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeliveryService("courier")}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm ${
                        deliveryMode === "courier"
                          ? "border-red-600 bg-red-50 text-red-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Truck size={17} />
                      Courier
                    </button>
                  </div>
                </div>
              )}

              {deliveryMode && (
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    {deliveryMode === "courier" ? <Truck size={15} className="text-gray-500" /> : <Package size={15} className="text-gray-500" />}
                    <span className="text-sm font-semibold text-gray-900 capitalize">{deliveryMode} selected</span>
                  </div>
                  <button type="button" onClick={handleUndoService} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                    <X size={15} className="text-gray-500" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                  <input
                    type="text"
                    id="city"
                    {...register("city")}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.city ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter your city"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                  <input
                    type="text"
                    id="state"
                    {...register("state")}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.state ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter your state"
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Navigation size={13} className="inline mr-1.5" />
                  Landmark <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="landmark"
                  {...register("landmark")}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Near famous place, building, etc."
                />
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="setAsDefault"
                  {...register("setAsDefault")}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="setAsDefault" className="text-sm text-gray-700">
                  Set as default delivery address
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isPending || !deliveryMode}
                  className="w-full px-6 py-3.5 bg-red-600 text-white rounded-xl hover:bg-red-700 active:scale-[0.99] transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-red-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Address & Checkout
                      <ChevronRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="order-1 lg:order-2 space-y-4">

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag size={17} className="text-red-600" />
                  Order Summary
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {cartProducts.length} {cartProducts.length === 1 ? "item" : "items"} in your cart
                </p>
              </div>

              {cartProducts.length > 0 ? (
                <>
                  <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                    {cartProducts.map((prod) => (
                      <div key={prod.product_id} className="flex gap-3 px-4 sm:px-5 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 w-16 h-16 sm:w-18 sm:h-18 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          {prod.product?.images && prod.product.images.length > 0 ? (
                            <img
                              src={prod.product.images[0].url || prod.product.images[0]}
                              alt={prod.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-0.5">
                            {prod.product?.name || "Product Name"}
                          </h3>
                          <p className="text-xs text-gray-400 mb-1.5">{prod.product?.category || "Category"}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              Qty: {prod.quantity}
                            </span>
                            {prod.product?.variants && prod.product.variants.length > 0 && (
                              <span className="text-sm font-bold text-red-600">
                                ₹{prod.product.variants[0].discountedPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {discount && (
                    <div className="mx-4 sm:mx-5 my-3">
                      {!discountApplied ? (
                        <button
                          type="button"
                          onClick={() => setDiscountApplied(true)}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-dashed transition-all group"
                          style={{ borderColor: '#eac90b', backgroundColor: '#fffdf0' }}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E40000' }}>
                              <Tag className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold text-gray-900">First Order Offer</p>
                              <p className="text-xs text-gray-500">Tap to apply 10% off</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#E40000' }}>
                            APPLY
                          </span>
                        </button>
                      ) : (
                        <div
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all"
                          style={{ borderColor: '#eac90b', backgroundColor: '#fff8cc' }}
                        >
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#E40000' }} />
                            <div className="text-left">
                              <p className="text-xs font-bold text-gray-900">🎉 First Order Discount Applied!</p>
                              <p className="text-xs text-gray-600">
                                You're saving <span className="font-bold" style={{ color: '#E40000' }}>₹{savingsAmount}</span> on this order
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setDiscountApplied(false)}
                            className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="px-4 sm:px-5 pb-4 pt-1 space-y-2 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm pt-3">
                      <span className="text-gray-500">Items Total</span>
                      <span className="font-medium text-gray-800">₹{baseSubtotal.toLocaleString('en-IN')}</span>
                    </div>

                    {!!deliveryMode && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5">
                          {deliveryMode === "courier" ? <Truck size={13} /> : <Package size={13} />}
                          Delivery Charge
                        </span>
                        <span className="font-medium text-gray-800">
                          {deliveryMode === "courier" ? `₹${deliveryCharge}` : "Yet to be paid"}
                        </span>
                      </div>
                    )}

                    {discountApplied && savingsAmount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium" style={{ color: '#16a34a' }}>First Order Discount (10%)</span>
                        <span className="font-semibold" style={{ color: '#16a34a' }}>− ₹{savingsAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="font-bold text-gray-900 text-sm sm:text-base">To Pay</span>
                      <span className="text-lg sm:text-xl font-bold text-red-600">
                        ₹{Subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {discountApplied && savingsAmount > 0 && (
                      <p className="text-center text-xs font-semibold py-1.5 rounded-lg" style={{ backgroundColor: '#fff8cc', color: '#92400e' }}>
                        🎉 Total savings of ₹{savingsAmount} on this order
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 px-4">
                  <ShoppingBag size={44} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-400 text-sm">Your cart is empty</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {otpModal && (
        <OtpModal
          isOpen={otpModal}
          onClose={onClose}
          delivarydetails={delivarydetails}
          totalAmount={Subtotal}
          products={useCartStore.getState().cart}
        />
      )}
    </div>
  );
};

export default PaymentPage;