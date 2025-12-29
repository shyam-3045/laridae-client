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

  /* -------------------------
     MAP CART → PRODUCTS
  -------------------------- */
  const cartProducts = cart
    .map((item: any) => {
      const product = allProducts?.data?.find(
        (prod: any) => prod._id === item.product_id
      );

      if (!product) return null;

      return {
        ...item,
        product, // ✅ SINGLE SOURCE OF TRUTH
      };
    })
    .filter(Boolean);

  /* -------------------------
     EARLY RETURNS (SAFE)
  -------------------------- */
  if (!cartOpen) return null;
  if (!allProducts?.data) return null;
  if (cartProducts.length === 0) return null;

  /* -------------------------
     PRICE CALCULATION (SAFE)
  -------------------------- */
  const subtotal = cartProducts.reduce((sum: number, item: any) => {
    const price = item.product?.variants?.[0]?.discountedPrice;

    if (typeof price !== 'number') return sum;

    return sum + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleSubmit = () => {
    closeCart();
    router.push('/payment');
  };

  /* -------------------------
     RENDER
  -------------------------- */
  return (
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
          onClick={closeCart}
          className="p-2 rounded-full hover:bg-black hover:bg-opacity-10"
        >
          <X className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      {/* Items */}
      <div
        className="flex-1 overflow-y-auto p-6 space-y-4"
        style={{ height: 'calc(100vh - 280px)' }}
      >
        {cartProducts.map((item: any) => (
          <div
            key={item.product_id}
            className="flex gap-4 bg-gray-50 p-4 rounded-lg"
          >
            <img
              src={item.product.images?.[0]?.url}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {item.product.name}
              </h3>

              <p className="text-lg font-bold text-red-600">
                ₹
                {(
                  item.product.variants[0].discountedPrice * item.quantity
                ).toFixed(2)}
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => decreaseQuantity(item.product_id)}
                  className="p-1 rounded-md hover:bg-gray-200"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="font-semibold w-8 text-center">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    addToCart({ product_id: item.product_id, quantity: 1 })
                  }
                  className="p-1 rounded-md hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Remove */}
            <button
              onClick={() => {
                clearProduct(item.product_id);
                toastSuccess('Removed product from cart');
              }}
              className="p-2 h-fit rounded-md hover:bg-red-100 text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Tax (10%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-xl font-bold pt-2 border-t">
            <span>Total</span>
            <span className="text-red-600">₹{total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-lg font-semibold text-white bg-red-600 hover:scale-[1.02]"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
