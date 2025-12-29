'use client';

import { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAllProducts } from '@/hooks/CustomHooks/useAllProducts';
import { toastSuccess } from '@/utils/toast';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}


export default function CartDrawer() {
  const {cartOpen , closeCart ,cart,decreaseQuantity,addToCart,clearProduct}=useCartStore()
  const {data:allProducts}=useAllProducts()
  const router = useRouter()


const cartProducts = cart
  .map((item: any) => {
    const product = allProducts?.data?.find(
      (prod: any) => prod._id === item.product_id
    );

    if (!product) return null;

    return {
      ...item,
      product,
    };
  })
  .filter(Boolean);


if (!cartOpen) return null;
if (!allProducts?.data) return null;
if (cartProducts.length === 0) return null;

 const handleSubmit =()=>
 {
    closeCart()
    router.push("/payment")
 }
  const subtotal = cartProducts.reduce((sum, item) => sum + item?.products?.variants[0]?.discountedPrice   * item.quantity, 0);
  
  const total = subtotal ;
  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-[90vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div 
          className="p-6 flex items-center justify-between"
          style={{ backgroundColor: '#eac90b' }}
        >
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Shopping Cart ({cartProducts.length})
          </h2>
          <button
            onClick={()=>closeCart()}
            className="p-2 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ height: 'calc(100vh - 280px)' }}>
          {cartProducts.length <= 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart className="w-16 h-16 mb-4" />
              <p className="text-lg">Your cart is empty</p>
            </div>
          ) : (
            cartProducts.map(item => (
              <div key={item.product_id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                <img
                  src={item?.products?.images[0].url}
                  alt={item?.products?.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item?.products?.name}</h3>
                  <p className="text-lg font-bold" style={{ color: '#E40000' }}>
                    ₹{item?.products?.variants[0]?.discountedPrice?.toFixed(2) * item?.quantity}
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.product_id)}
                      className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-8 text-center">{item?.quantity}</span>
                    <button
                      onClick={() => addToCart({ product_id :item.product_id, quantity: 1 }) }
                      className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => {clearProduct(item.product_id)
                    toastSuccess("Removed Product From cart")
                  }}
                  className="p-2 h-fit rounded-md hover:bg-red-100 transition-colors"
                  style={{ color: '#E40000' }}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartProducts.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>₹{10.90.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span style={{ color: '#E40000' }}>₹ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              className="w-full py-4 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: '#E40000' }}
              onClick={()=>handleSubmit()}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}