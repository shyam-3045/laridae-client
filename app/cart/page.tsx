"use client";
import CartPage from "@/components/layouts/cartPage";
import { useAllProducts } from "@/hooks/CustomHooks/useAllProducts";
import { useCartStore } from "@/store/cartStore";
import { CartProps } from "@/types/common";
import { toastSuccess } from "@/utils/toast";
import { useEffect, useState } from "react";


export default function Cart() {
  const {data:allProducts,isLoading}=useAllProducts()
  const [cart,setCart]=useState<CartProps[]>()
  const clearcart = useCartStore.getState().clearCart;
  const clearProduct=useCartStore.getState().clearProduct
  useEffect(()=>
  {
      let res = useCartStore.getState().cart;
      setCart(res)
  },[cart])
  

  const handleClearCart=()=>
  {
    clearcart()
    setCart([])
  }
  const handleClearProduct=(id:string)=>
  {
    const filteredCart=clearProduct(id)
    toastSuccess("Item Removed From Cart ")
    setCart(filteredCart)

  }
  return (
    <>
      
      {isLoading ?(null):(
        <CartPage allProducts={allProducts?.data}  cart={cart?cart:[]} clearCart={handleClearCart} clearProduct={handleClearProduct}/>

      )}
      
    </>
  );
}
