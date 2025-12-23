'use client'
import React, { useEffect, useState } from "react";
import { X, ShoppingBag, CreditCard, Minus, Plus, Trash2, ArrowLeft, Tag } from "lucide-react";
import { Product } from "@/types/product";
import { CartProps } from "@/types/common";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/store/userStore";
import LoginModal from "./loginModal";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { orginalCart } from "@/types/cart";
import { toastFailure } from "@/utils/toast";

type Props = {
  allProducts: Product[];
  cart: CartProps[];
  clearCart: () => void;
  clearProduct:(id:string)=> void;
};

const CartPage = ({ allProducts, cart, clearCart, clearProduct }: Props) => {
  const router = useRouter()
  const { setCartTotal, decreaseQuantity, addToCart } = useCartStore()
  const [openModal, setOpenModal] = useState<boolean>(false)
  
  const { isLogged } = useUser()
  
  const orginalCart = cart.map((item) => {
    const products = allProducts.find(
      (prod) => item.product_id.toString() === prod._id.toString()
    );
    return {
      ...item,
      products,
    };
  });

  const subtotal = orginalCart.reduce((acc, item) => {
    const price = item?.products?.variants[0].discountedPrice as number;
    return acc + price * item.quantity;
  }, 0);

  useEffect(() => {
    setCartTotal(subtotal)
  }, [subtotal])

  const tax = subtotal * 0.00000000000000001;
  const total = subtotal + tax;

  const handleProceed = (orginalCart: orginalCart[]) => {
    for (const index in orginalCart) {
      if (orginalCart[index].products) {
        if (orginalCart[index].quantity < orginalCart[index]?.products?.MOQ) {
          toastFailure(`${orginalCart[index]?.products.name} must have atleast ${orginalCart[index]?.products.MOQ} Quantity`)
          return
        }
      }
      console.log(orginalCart[index])
    }
    if (!isLogged) {
      setOpenModal(prev => !prev)
    } else {
      router.push("/payment")
    }
  }

  const onClose = () => {
    setOpenModal(false)
  }

  if (orginalCart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started</p>
            <Link href={'/shop'}
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const updateQuantityD = (product_id: string, quantity: number) => {
    if (quantity -1 != 0) {
      decreaseQuantity(product_id)
    } else {
      clearProduct(product_id)
    }
  }

  const updateQuantityU = (product_id: string) => {
    addToCart({ product_id, quantity: 1 })
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 text-sm mt-1">{orginalCart.length} items</p>
            </div>
            <button
              onClick={clearCart}
              className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="space-y-4">
                  {orginalCart.map((item) => (
                    <div key={item.product_id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                      <Image
                        src={`${item?.products?.images[0].url}`}
                        alt={`${item?.products?.name}`}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{item?.products?.name}</h3>
                        <p className="text-lg font-semibold text-gray-900 mb-3">
                          ${item?.products?.variants[0]?.discountedPrice.toFixed(2)}
                        </p>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => updateQuantityD(item.product_id, item.quantity)}
                              className="p-2 hover:bg-gray-50 rounded-l-lg transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 border-x border-gray-200 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantityU(item.product_id)}
                              className="p-2 hover:bg-gray-50 rounded-r-lg transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-lg text-gray-900">
                              ${(item?.products?.variants[0]?.discountedPrice as number * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => clearProduct(item?.product_id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border sticky top-4">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-4">
                  {/* Items Preview */}
                  <div className="space-y-3 mb-4">
                    {orginalCart.map((item) => (
                      <div key={item.product_id} className="flex items-center gap-3">
                        <Image
                          src={`${item.products?.images[0]?.url}`}
                          alt={`${item?.products?.name}`}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item?.products?.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">
                          ${(item?.products?.variants[0]?.discountedPrice as number * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg text-gray-900 pt-3 border-t">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button 
                    onClick={() => handleProceed(orginalCart)}
                    className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {openModal && <LoginModal isOpen={openModal} onClose={onClose} isLogged={isLogged} />}
    </div>
  );
};

export default CartPage;