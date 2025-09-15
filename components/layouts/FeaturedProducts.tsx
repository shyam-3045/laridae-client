"use client";

//import { useState } from "react";
//import { Star } from "lucide-react";
import { ProductCard } from "../common/ProductCard";
import { useAllProducts } from "../../hooks/CustomHooks/useAllProducts";
import { Product } from "@/types/product";
import Link from "next/link";

export default function FeaturedProducts() {
  const { data: product, isLoading } = useAllProducts();
  //const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) {
    return <p>...Loading</p>;
  }

  // const renderStars = (rating) => {
  //   return Array.from({ length: 5 }, (_, i) => (
  //     <Star
  //       key={i}
  //       className={`w-4 h-4 ${i < rating ? 'text-[#eac90b] fill-current' : 'text-gray-300'}`}
  //     />
  //   ));
  // };
  // const handleAddToCart = (id: string) => {
  //   console.log(id);
  // };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Our <span className="text-[#E40000]">Premium</span>{" "}
            Collection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked teas that bring{" "}
            <span className="font-semibold text-[#E40000]">wellness</span> and
            <span className="font-semibold text-[#eac90b]">
              {" "}
              extraordinary flavor
            </span>{" "}
            to your daily ritual
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-full p-1">
            
            
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {product?.data?.slice(0, 4).map((product: Product) => (
              <ProductCard
                key={product._id}
                product={product}
                //onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <Link href={'/shop'} className="bg-[#eac90b] hover:bg-[#eac90b] hover:text-gray-900 text-white font-bold py-3 px-8 rounded-2xl transition-colors duration-300 transform hover:scale-105">
          VIEW ALL
        </Link>
      </div>
    </div>
  );
}
