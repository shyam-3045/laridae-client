"use client";

import { useAllProducts } from "@/hooks/CustomHooks/useAllProducts";
import { ProductCard } from "../common/ProductCard";
import { Product } from "@/types/product";
import AnnouncementBar from "../common/AnnouncementBar";
import { useEffect, useState } from "react";

type Props = {
  shopFlag: number;
};

type FilterState = {
  Asafoetida: boolean;
  Laridae: boolean;
  GramFlour: boolean;
  [key: string]: boolean;
};

const ShopPage = ({ shopFlag }: Props) => {
  const { data: products, isLoading } = useAllProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<FilterState>({
    Asafoetida: false,
    Laridae: false,
    GramFlour: false,
  });

  useEffect(() => {
    if (!products?.data) return;

    const initialProducts =
      shopFlag === 1
        ? products.data.filter(
            (item: Product) => item.shopFlag === 1 || item.shopFlag === 3
          )
        : products.data.filter(
            (item: Product) => item.shopFlag === 2 || item.shopFlag === 3
          );

    setOriginalProducts(initialProducts);
    setFilteredProducts(initialProducts);
  }, [products, shopFlag]);

  useEffect(() => {
    if (originalProducts.length === 0) return;

    const activeFilters = Object.entries(filter)
      .filter(([_, value]) => value)
      .map(([key]) => key.toLowerCase());

    if (activeFilters.length === 0) {
      setFilteredProducts(originalProducts);
      return;
    }

    const newFilteredProducts = originalProducts.filter((product) =>
      activeFilters.some((filter) =>
        product.name.toLowerCase().includes(filter)
      )
    );

    setFilteredProducts(newFilteredProducts);
  }, [filter, originalProducts]);

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

  const handleFilterChange = (name: keyof FilterState) => {
    setFilter((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
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
            <div className="w-full lg:w-80 lg:flex-shrink-0">
              <div className="bg-white lg:sticky lg:top-8">
                <h2 className="text-lg font-medium text-[#C5A572] mb-6">
                  Filters
                </h2>

                {filterOptions?.map((item) => (
                  <div key={item.id} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-gray-900">
                        {item .name === 'Laridae' ?<p>{item.name} Tea</p>:<p>{item.name}</p>}
                        
                      </h3>
                      <input
                        type="checkbox"
                        checked={filter[item.name] || false}
                        onChange={() => handleFilterChange(item.name as keyof FilterState)}
                        className="h-4 w-4 text-[#C5A572] focus:ring-[#C5A572] border-gray-300 rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1">
              

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts?.map((product: Product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {(!filteredProducts || filteredProducts?.length === 0) && (
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