"use client";

import { useAllProducts } from "@/hooks/CustomHooks/useAllProducts";
import { ProductCard } from "../common/ProductCard";
import { Product } from "@/types/product";
import AnnouncementBar from "../common/AnnouncementBar";
import { useEffect, useState } from "react";

type Props = {
  shopFlag: number;
};
const ShopPage = ({ shopFlag }: Props) => {
  const { data: products, isLoading } = useAllProducts();
  const [product,setProduct]=useState<Product[]>()
  useEffect(() => {
  if (!products?.data) return;

  const res =
    shopFlag === 1
      ? products.data.filter(
          (item: Product) => item.shopFlag === 1 || item.shopFlag === 3
        )
      : products.data.filter(
          (item: Product) => item.shopFlag === 2 || item.shopFlag === 3
        );

  setProduct(res);
}, [products, shopFlag]);
  const filterOptions = [
    {
      name: "Asafoetida",
      id: 1,
    },

    {
      name: "Laridae",
      id: 2,
    },
    {
      name: "Gram Flour",
      id: 3,
    },
  ];
  const handleFilter = (name: string) => {
    const filteredProducts = product?.filter((item: Product) =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );
    setProduct(filteredProducts)
    
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eac90b] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-light text-[#C5A572] mb-4">
                All Products
              </h1>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                Explore a wide selection of teas & spices, from authentic blends
                to single-origin spices.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Categories */}
            <div className="w-full lg:w-80 lg:flex-shrink-0">
              <div className="bg-white lg:sticky lg:top-8">
                <h2 className="text-lg font-medium text-[#C5A572] mb-6">
                  Filters
                </h2>

                {filterOptions?.map((item: { name: string; id: number }) => (
                  <div key={item.id} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-gray-900">
                        {item.name}
                      </h3>
                      {/* <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg> */}
                      <input
                        type="checkbox"
                        onChange={() => handleFilter(item.name)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Products */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <div></div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[#C5A572] font-medium">
                    Sort By:
                  </span>
                  <select className="text-sm text-gray-900 bg-transparent border-none focus:outline-none cursor-pointer">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {product?.map((product: Product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {(!product || product?.length === 0) && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🍃</div>
                  <p className="text-gray-500 text-lg">No products found</p>
                  <p className="text-gray-400 text-sm">
                    Try adjusting your filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AnnouncementBar />
    </>
  );
};

export default ShopPage;
