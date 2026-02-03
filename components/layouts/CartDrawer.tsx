'use client';

import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAllProducts } from '@/hooks/CustomHooks/useAllProducts';
import { toastSuccess } from '@/utils/toast';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const {
    cartOpen,
    closeCart,
    cart,
    decreaseQuantity,
    addToCart,
    clearProduct,
  } = useCartStore();

  const { data: allProducts } = useAllProducts();
  const router = useRouter();

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

  const subtotal = cartProducts.reduce((sum: number, item: any) => {
    const price = item.product?.variants?.[0]?.discountedPrice;

    if (typeof price !== 'number') return sum;

    return sum + price * item.quantity;
  }, 0);

  const total = subtotal;

  const handleSubmit = () => {
    closeCart();
    router.push('/payment');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 z-40 ${
          cartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-[90vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between bg-gradient-to-r from-[#eac90b] to-[#f5d647] border-b border-yellow-600/20">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart ({cartProducts.length})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-black/10 transition-all"
          >
            <X className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* Cart Items */}
        <div
          className="overflow-y-auto px-5 py-5 space-y-3"
          style={{ height: 'calc(100vh - 240px)' }}
        >
          {cartProducts.map((item: any) => (
            <div
              key={item.product_id}
              className="flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group"
            >
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={item.product.images?.[0]?.url}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2 pr-6 leading-tight">
                  {item.product.name}
                </h3>

                <p className="text-base font-bold text-red-600 mb-3">
                  ₹{(item.product.variants[0].discountedPrice * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item.product_id)}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>

                  <span className="font-semibold text-sm min-w-[2rem] text-center text-gray-900 px-2">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      addToCart({ product_id: item.product_id, quantity: 1 })
                    }
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => {
                  clearProduct(item.product_id);
                  toastSuccess('Removed product from cart');
                }}
                className="p-2 h-fit rounded-lg rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200 shadow-lg">
          <div className="mb-4">
            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-red-600">
                ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}