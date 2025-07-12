// store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartProps } from "@/types/common";

type CartStore = {
  cart: CartProps[];
  addToCart: (item: CartProps) => void;
  clearCart: () => void;
  clearProduct:(id:string)=>void
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: ({ product_id, quantity }: CartProps) => {
        const currentCart = get().cart;
        const index = currentCart.findIndex(
          (item) => item.product_id === product_id
        );

        let updatedCart = [...currentCart];

        if (index !== -1) {
          updatedCart[index].quantity += quantity;
        } else {
          updatedCart.push({ product_id, quantity });
        }

        set({ cart: updatedCart });
      },

      clearCart: () => set({ cart: [] }),
      clearProduct:(id)=> {
        const filteredCart=get().cart.filter(item=> item.product_id.toString() !== id.toString())
        set({cart:filteredCart}) 
      }
    }),
    {
      name: "USER_CART", 
    }
  )
);
