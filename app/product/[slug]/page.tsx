"use client";

//import AnimatedOnScroll from "@/components/common/AddScrollAnimations";
import SingleProducts from "@/components/layouts/EachProducts";
import { useAllProducts } from "@/hooks/CustomHooks/useAllProducts";
import { Product } from "@/types/product";
import { useSearchParams } from "next/navigation";
import React from "react";

const Products = () => {
  const params = useSearchParams();
  const id = params.get("id");

  const { data: products, error,isLoading } = useAllProducts();

 

  const singleProduct = products?.data.find(
    (item: Product) => item._id.toString() === id
  );

  return (
    <div>
  
      <SingleProducts allProducts={products?.data} products={singleProduct} error={error} isLoading={isLoading} />
       
      
    </div>
  );
};

export default Products;
