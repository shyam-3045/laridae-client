import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartProps } from "@/types/common";



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
  cart: CartProps[] ;
  cartTotal:number;
  cartOpen : boolean;
  openCart :()=>void;
  closeCart:() =>void;
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
      cartOpen : false,
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

      openCart:()=>
      {
        set({cartOpen : true})
      },

      closeCart :()=>
      {
        set({cartOpen : false})
      },
      decreaseQuantity:(product_id : string)=>
      {
        const currentCart = get().cart;
        
        const index = currentCart.findIndex(
          (item) => item.product_id === product_id
        );

        let updatedCart = [...currentCart];
        let finalCart =[...currentCart]
        console.log(updatedCart)
        console.log(index)
        

        if (index !== -1 && updatedCart[index].quantity != 1) {
          
          updatedCart[index].quantity -= 1 ;
        } 
        else{
          finalCart=updatedCart.filter((_,indexOf) => 
            indexOf !== index
             )
        }
        set({ cart: finalCart });
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
