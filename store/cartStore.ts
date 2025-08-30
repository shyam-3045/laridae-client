import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartProps } from "@/types/common";

type CartStore = {
  cart: CartProps[];
  cartTotal:number;
  addToCart: (item: CartProps) => boolean;
  clearCart: () => void;
  clearProduct:(id:string)=>CartProps[];
  setCartTotal:(total:number)=>void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      cartTotal:0,

      addToCart: ({ product_id, quantity }: CartProps) => {
        const currentCart = get().cart;
        
        const index = currentCart.findIndex(
          (item) => item.product_id === product_id
        );

        let updatedCart = [...currentCart];

        if(index !== -1 && updatedCart[index].quantity > 3 || index !== -1 && updatedCart[index].quantity + quantity >3 )
        {
          return false
        }

        if (index !== -1) {
          updatedCart[index].quantity += quantity;
        } else {  
          updatedCart.push({ product_id, quantity });
        }
        
        set({ cart: updatedCart });
        return true
      },

      clearCart: () => set({ cart: [] }),
      clearProduct:(id:string)=> {
        const filteredCart=get().cart.filter(item=> item.product_id.toString() !== id.toString())
        set({cart:filteredCart}) 
        return filteredCart
        
      },
      setCartTotal :(total : number)=> set({cartTotal : total})

    }),
    {
      name: "USER_CART", 
    }
  )
);
