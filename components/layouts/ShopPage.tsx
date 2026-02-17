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
  FlowerBasedTea: boolean;
  LaridaeCoffee: boolean;
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
    FlowerBasedTea: false,
    LaridaeCoffee: false,
  });

  console.log(products)

  useEffect(() => {
    if (!products?.data) return;

    if (shopFlag === 1) {
      const initialProducts = products.data.filter(
        (item: Product) => item.shopFlag === 1 || item.shopFlag === 3
      );
      setOriginalProducts(initialProducts);
      setFilteredProducts(initialProducts);
    }
    if (shopFlag === 2) {
      const initialProducts = products.data.filter(
        (item: Product) => item.shopFlag === 2 || item.shopFlag === 3
      );
      setOriginalProducts(initialProducts);
      setFilteredProducts(initialProducts);
    }
    if (shopFlag === 4) {
      const initialProducts = products.data.filter(
        (item: Product) => item.shopFlag === 4
      );
      setOriginalProducts(initialProducts);
      setFilteredProducts(initialProducts);
    }
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
      activeFilters.some(
        (f) =>
          product.name.toLowerCase().includes(f) ||
          product.category.toLowerCase() === f
      )
    );

    setFilteredProducts(newFilteredProducts);
  }, [filter, originalProducts]);

  const filterOptions = [
    { name: "Asafoetida", id: 1 },
    { name: "Laridae", id: 2 },
    { name: "Gram Flour", id: 3 },
    { name: "Flower Based Tea", id: 4 },
    { name: "LaridaeCoffee", id: 5 },
  ];

  const handleFilterChange = (name: keyof FilterState) => {
    setFilter((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleBulkOrderClick = () => {
    window.open(
      "https://wa.me/919025487084?text=Hello%2C%20I%E2%80%99d%20like%20to%20place%20a%20bulk%20order!",
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-2xl border border-amber-100">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-100 border-t-[#C5A572] mx-auto"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 bg-gradient-to-r from-[#C5A572] to-amber-400 opacity-20 mx-auto"></div>
          </div>
          <p className="text-gray-700 text-xl font-medium tracking-wide">
            Loading premium products...
          </p>
          <div className="mt-6 flex justify-center space-x-1">
            <div className="h-2 w-2 bg-[#C5A572] rounded-full animate-bounce"></div>
            <div
              className="h-2 w-2 bg-[#C5A572] rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="h-2 w-2 bg-[#C5A572] rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-white via-amber-50 to-orange-50 overflow-hidden">
          <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23C5A572" fill-opacity="0.05"%3E%3Cpath d="M20 20c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10zm10 0c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10z"/%3E%3C/g%3E%3C/svg%3E")] opacity-30'></div>
          <div className="relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center">
                <div className="mb-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#C5A572] to-amber-500 text-white text-sm font-semibold tracking-wider uppercase shadow-lg">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Premium Collection
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#C5A572] via-amber-600 to-orange-500 mb-6 tracking-tight">
                  All Products
                </h1>
                <div className="max-w-3xl mx-auto">
                  <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-light mb-8">
                    Explore a wide selection of teas & spices, from authentic
                    blends to single-origin spices.
                  </p>
                  <div className="flex justify-center">
                    <div className="h-1 w-32 bg-gradient-to-r from-[#C5A572] to-amber-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Order Banner - Static, Simple & Professional */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 border-y border-amber-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                  <svg
                    className="w-7 h-7 text-[#C5A572]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-white font-medium">Need to order in bulk?</p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-800">
                    Contact our Sales Team
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleBulkOrderClick}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C5A572] to-amber-500 hover:from-amber-600 hover:to-orange-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 448 512"
                >
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                </svg>
                <span className="text-base">+91 9025487084</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            {shopFlag === 4 ? null : (
              <div className="w-full lg:w-72 lg:flex-shrink-0">
                <div className="bg-white/90 backdrop-blur-sm lg:sticky lg:top-8 rounded-xl shadow-xl border border-amber-100/60 p-6">
                  <div className="flex items-center mb-6">
                    <div className="h-8 w-1 bg-gradient-to-b from-[#C5A572] to-amber-500 rounded-full mr-3"></div>
                    <h2 className="text-xl font-semibold text-[#C5A572] tracking-wide">
                      Filters
                    </h2>
                  </div>

                  <div className="space-y-1">
                    {filterOptions?.map((item) => (
                      <div key={item.id} className="group">
                        <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 border border-transparent hover:border-amber-200/50">
                          <div className="flex items-center space-x-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[#C5A572] to-amber-500 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                            <h3 className="text-base font-medium text-gray-800 group-hover:text-[#C5A572] transition-colors duration-200">
                              {item.name === "Laridae"
                                ? "Laridae Tea"
                                : item.name === "GramFlour"
                                ? "Gram Flour"
                                : item.name === "LaridaeCoffee"
                                ? "Laridae Coffee"
                                : item.name}
                            </h3>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={filter[item.name] || false}
                              onChange={() =>
                                handleFilterChange(item.name as keyof FilterState)
                              }
                              className="h-4 w-4 text-[#C5A572] focus:ring-[#C5A572] focus:ring-offset-2 border-gray-300 rounded cursor-pointer transition-all duration-200 hover:border-[#C5A572]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 font-medium">
                    Showing{" "}
                    <span className="text-[#C5A572] font-semibold">
                      {filteredProducts?.length || 0}
                    </span>{" "}
                    premium products
                  </p>
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                    <span>Grid View</span>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-[#C5A572] via-amber-200 to-transparent"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts?.map((product: Product) => (
                  <div
                    key={product._id}
                    className="group transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="h-full bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-amber-200 transition-all duration-300 overflow-hidden">
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))}
              </div>

              {(!filteredProducts || filteredProducts?.length === 0) && (
                <div className="text-center py-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-16 shadow-xl border border-amber-100/60 max-w-lg mx-auto">
                    <div className="text-8xl mb-8 opacity-40">🍃</div>
                    <h3 className="text-2xl font-light text-gray-700 mb-4">
                      No products found
                    </h3>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                      We couldn't find any products matching your current
                      selection. Try adjusting your filters to discover more
                      options.
                    </p>
                    <button
                      onClick={() =>
                        setFilter({
                          Asafoetida: false,
                          Laridae: false,
                          GramFlour: false,
                          FlowerBasedTea: false,
                          LaridaeCoffee: false,
                        })
                      }
                      className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#C5A572] to-amber-500 text-white font-medium hover:from-amber-600 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Clear All Filters
                    </button>
                  </div>
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