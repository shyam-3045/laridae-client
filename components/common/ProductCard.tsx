"use client";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/product";
import { toastFailure, toastSuccess } from "@/utils/toast";
import { Star, ShoppingCart, Clock, StarHalf } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
  isOtherProducts?: boolean;
}

export function ProductCard({ product, isOtherProducts = false }: Props) {
  const { openCart } = useCartStore();
  const addToCart = useCartStore.getState().addToCart;
  const router = useRouter();
  const variant = product.variants[0];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 text-amber-400 fill-current" />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-4 h-4">
          <Star className="w-4 h-4 text-gray-300 fill-current absolute" />
          <div className="overflow-hidden w-1/2 absolute">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
          </div>
        </div>
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  const handlePageChange = (name: string, id: string, isAvailable: boolean) => {
    if (isAvailable) {
      router.push(`/product/${name}?id=${id}`);
    }
  };

  const handleAddToCart = (id: string, shopFlag: number) => {
    const quantity = 1;
    const { res, flag } = addToCart({
      product_id: id,
      quantity,
      max: product.MAX,
      min: product.MOQ,
    });
    if (flag) {
      toastSuccess(res);
    } else {
      toastFailure(res);
    }
  };

  // Calculate discount percentage
  const discountPercentage = variant.price
    ? Math.round(
        ((variant.price - variant.discountedPrice) / variant.price) * 100
      )
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 h-full flex flex-col relative">
      {/* Clickable content area */}
      <div
        onClick={() =>
          handlePageChange(product.name, product._id, product.isAvailable)
        }
        className={`flex-1 flex flex-col ${
          product.isAvailable ? "cursor-pointer" : "cursor-default"
        }`}
      >
        {/* Image Section */}
        <div className="relative p-4 bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Discount Badge */}
          {discountPercentage > 0 && product.isAvailable && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
              -{discountPercentage}% OFF
            </div>
          )}

          <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-0"
            />
            <Image
              src={
                product.images.length > 1
                  ? product.images[1].url
                  : product.images[0].url
              }
              alt={product.name}
              fill
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-103 group-hover:opacity-100"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Rating Section - Only show if product is available */}
          {product.isAvailable && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center">
                {renderStars(product.ratings)}
              </div>
              <span className="ml-2 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                {product.ratings.toFixed(1)} ({product.numOfReviews}{" "}
                {product.numOfReviews === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-5 group-hover:text-red-600 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Category */}
          <div className="mb-3">
            <span className="inline-block bg-gradient-to-r from-red-50 to-orange-50 text-red-700 text-xs font-semibold px-3 py-1 rounded-full border border-red-100">
              {product.category}
            </span>
          </div>

          {/* Price Section */}
          <div className="mt-auto">
            {product.isAvailable ? (
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-bold text-gray-900">
                  ₹{variant.discountedPrice.toLocaleString()}
                </span>
                {variant.price && variant.price !== variant.discountedPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{variant.price.toLocaleString()}
                  </span>
                )}
              </div>
            ) : (
              <div className="mb-3">
                <div className="relative inline-block">
                  {/* Blurred price */}
                  <span className="text-lg font-bold text-gray-400 blur-sm select-none">
                    ₹{variant.discountedPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Button Section */}
      {!isOtherProducts && (
        <div className="p-4 pt-0">
          {product.isAvailable ? (
            <button
              onClick={() => {
                handleAddToCart(product._id, product.shopFlag);
                openCart();
              }}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm tracking-wide"
            >
              <ShoppingCart className="w-5 h-5" />
              ADD TO CART
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm tracking-wide cursor-not-allowed opacity-75"
            >
              <Clock className="w-5 h-5" />
              COMING SOON
            </button>
          )}
        </div>
      )}
    </div>
  );
}