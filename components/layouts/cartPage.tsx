'use client'
import React, { useEffect, useState } from "react";
import { X, ShoppingBag, CreditCard } from "lucide-react";
//import {Plus, Minus} from 'lucide-react'
import { Product } from "@/types/product";
import { CartProps } from "@/types/common";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/store/userStore";
import LoginModal from "./loginModal";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { orginalCart } from "@/types/cart";
import { Underdog } from "next/font/google";
import { toastFailure } from "@/utils/toast";


type Props = {
  allProducts: Product[];
  cart: CartProps[];
  clearCart: () => void;
  clearProduct:(id:string)=> void;
};
const CartPage = ({ allProducts, cart, clearCart,clearProduct }: Props) => {
  const router=useRouter()
  const {setCartTotal}=useCartStore()
  const [openModal,setOpenModal]=useState<boolean>(false)
  
  
  const {login,checkAuth,isLogged}=useUser()
  // const updateQuantity = (id: number, newQuantity: number) => {
  //   if (newQuantity <= 0) return;
  //   setCartItems((items) =>
  //     items.map((item) =>
  //       item.id === id ? { ...item, quantity: newQuantity } : item
  //     )
  //   );
  // };
  
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
useEffect(()=>
  {
    setCartTotal(subtotal)
  },[subtotal])

  
  const tax = subtotal  * 0.00000001;
  const total = subtotal + tax;
  const handleProceed=(orginalCart : orginalCart[])=>
  {


    for(const index in orginalCart)
    {
      if(orginalCart[index].products)
      {
        if(orginalCart[index].quantity < orginalCart[index]?.products?.MOQ)
      {
        toastFailure(`${orginalCart[index]?.products.name} must have atleast ${orginalCart[index]?.products.MOQ} Quantity`)
        return 
      }
      }
      console.log(orginalCart[index])
    }
    if(!isLogged)
    {
      setOpenModal(prev => !prev)
    }
    else{
      router.push("/payment")

    }
  }
  const onClose=()=>
  {
    setOpenModal(false)
  }
  if (orginalCart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">Add some items to get started!</p>
            
              <Link href={'/shop'}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold transition-colors"
              >
              Continue Shopping
              </Link>
              
            
          </div>
        </div>
      </div>
    );
  }

  return (
    
      <div>
        <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">
                  Cart Items ({orginalCart.length})
                </h2>

                <div className="space-y-4">
                  {orginalCart.map((item) => (
                    <div
                      key={item.product_id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Image
                          src={`${item?.products?.images[0].url}`}
                          alt={`${item?.products?.name}`}
                          width={100}
                          height={100}
                          className="w-full sm:w-24 h-24 object-cover rounded-lg"
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {item?.products?.name}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            ${item?.products?.variants[0]?.discountedPrice.toFixed(2)}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              {/* <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="w-8 h-8 rounded-full border-2 border-yellow-400 flex items-center justify-center hover:bg-yellow-400 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button> */}
                              <span className="font-semibold text-lg min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              {/* <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-8 h-8 rounded-full border-2 border-yellow-400 flex items-center justify-center hover:bg-yellow-400 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button> */}
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4">
                              {/* <span className="font-bold text-lg">
                                ${(item?.products?.variants[0]?.discountedPrice * item.quantity)}
                              </span> */}
                              <button
                                onClick={() => clearProduct(item?.product_id)}
                                className="text-red-600 hover:text-red-700 p-1"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {orginalCart.map((item) => (
                    <div key={item.product_id} className="flex gap-3">
                      <Image
                        src={`${item.products?.images[0]?.url}`}
                        alt={`${item?.products?.name}`}
                        width={100}
                          height={100}
                
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                          {item?.products?.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      {/* <p className="font-semibold text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p> */}
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button onClick={()=>handleProceed(orginalCart)}  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold mt-6 flex items-center justify-center gap-2 transition-colors">
                  <CreditCard className="w-5 h-5" />
                  Proceed to Payment
                </button>
                
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <div>
     
      </div>
      {openModal && <LoginModal isOpen={openModal} onClose={onClose} isLogged={isLogged}  />}
      </div>
      
      
    
  );
};

export default CartPage;
