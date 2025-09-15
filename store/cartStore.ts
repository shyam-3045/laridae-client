import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartProps } from "@/types/common";
import { json } from "zod";
import { error } from "console";
import { Flag } from "lucide-react";


interface addToCartPayload{
        product_id:string,
        quantity:number,
        max?:number,
        min?:number
      }
interface returnType{
  res:string,
  flag:boolean
}
type CartStore = {
  cart: CartProps[];
  cartTotal:number;
  addToCart: (item: addToCartPayload) =>returnType ;
  decreaseQuantity:(product_id : string)=>void;
  clearCart: () => void;
  clearProduct:(id:string)=>CartProps[];
  setCartTotal:(total:number)=>void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      cartTotal:0,

      addToCart: ({ product_id ,quantity,max,min }:addToCartPayload) => {
        const currentCart = get().cart;
        
        const index = currentCart.findIndex(
          (item) => item.product_id === product_id
        );

        let updatedCart = [...currentCart];
        
        if(min && max)
        {
          if(index !== -1 && updatedCart[index].quantity > max  || index !== -1 && updatedCart[index].quantity + quantity >max )
        {
          return ({
            res:"No product Found",
            flag:false
          })
        }
        }
        if (index !== -1) {
          
          updatedCart[index].quantity += quantity;
        } else {  
          updatedCart.push({ product_id, quantity });
        }
        
        set({ cart: updatedCart });
        return ({
            res:"Item Added To Cart",
            flag:true
          })
      },
      decreaseQuantity:(product_id : string)=>
      {
        const currentCart = get().cart;
        
        const index = currentCart.findIndex(
          (item) => item.product_id === product_id
        );

        let updatedCart = [...currentCart];
        

        if (index !== -1) {
          
          updatedCart[index].quantity -= 1 ;
        } 
        set({ cart: updatedCart });
        return ({
            res:"Item count decreased To Cart",
            flag:true
          })
        
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
