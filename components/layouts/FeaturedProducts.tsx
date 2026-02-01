"use client";

import { ProductCard } from "../common/ProductCard";
import { useMemo } from "react";
import { useAllProducts } from "../../hooks/CustomHooks/useAllProducts";
import { Product } from "@/types/product";
import Link from "next/link";
import Loading from "../common/loading";

export default function FeaturedProducts() {
  const { data: product, isLoading } = useAllProducts();

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

const products: Product[] = product?.data ?? [];

const getWeightInKg = (weight: string) => {
  const w = weight.toLowerCase().trim();
  const value = parseFloat(w);
  if (isNaN(value)) return Infinity;
  if (w.includes("kg")) return value;
  if (w.includes("g")) return value / 1000;
  return value;
};

const randomAvailableProducts = useMemo<Product[]>(() => {

  const filtered = products.filter((p) =>
    p.isAvailable &&
    p.variants?.some((v) => getWeightInKg(v.weight) < 5)
  );

  const shuffled = shuffleArray(filtered);

  if (shuffled.length >= 4) return shuffled.slice(0, 4);

  const remaining = shuffleArray(
    products.filter(
      (p) =>
        p.isAvailable &&
        !shuffled.find((x) => x._id === p._id)
    )
  );

  return [...shuffled, ...remaining.slice(0, 4 - shuffled.length)];

}, [products]);


  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-[#E40000]">Best</span>{" "}
            Sellers
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

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {randomAvailableProducts.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link
          href="/shop"
          className="bg-[#eac90b] text-white font-bold py-3 px-8 rounded-2xl transition hover:scale-105"
        >
          VIEW ALL
        </Link>
      </div>
    </div>
  );
}
