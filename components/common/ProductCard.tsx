"use client";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/product";
import { toastFailure, toastSuccess } from "@/utils/toast";
import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
  isOtherProducts?: boolean;
}

export function ProductCard({ product, isOtherProducts = false }: Props) {
  const {openCart}=useCartStore()
  const addToCart = useCartStore.getState().addToCart;
  const router = useRouter();
  const variant = product.variants[0];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-amber-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const handlePageChange = (name: string, id: string) => {
    router.push(`/product/${name}?id=${id}`);
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
    ? Math.round(((variant.price - variant.discountedPrice) / variant.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 h-full flex flex-col">
      {/* Clickable content area */}
      <div 
        onClick={() => handlePageChange(product.name, product._id)}
        className="cursor-pointer flex-1 flex flex-col"
      >
        {/* Image Section */}
        <div className="relative p-4 bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
              -{discountPercentage}%
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
              src={product.images.length > 1 ?product.images[1].url : product.images[0].url}
              alt={product.name}
              fill
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-103 group-hover:opacity-100"
            />
          </div>
        </div>

        {/* Content Section - This will grow to fill available space */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Rating Section */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {renderStars(product.ratings)}
            </div>
            <span className="ml-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {product.numOfReviews} reviews
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-5 group-hover:text-red-600 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Category */}
          <div className="mb-3">
            <span className="inline-block bg-red-50 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Price Section - This will be pushed to bottom by flex-1 above */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg font-bold text-gray-900">
                ₹{variant.discountedPrice.toLocaleString()}
              </span>
              {variant.price && variant.price !== variant.discountedPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{variant.price.toLocaleString()}
                </span>
              )}
            </div>
            
           
          </div>
        </div>
      </div>

      {/* Button Section - Always at bottom */}
      {!isOtherProducts && (
        <div className="p-4 pt-0">
          <button
            onClick={() =>{ handleAddToCart(product._id, product.shopFlag)
              openCart()
            }}
            className="w-full bg-gradient-to-r from-[#E40000] to-[#E40000] hover:from-[#eac90b] hover:to-[#eac90b] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            ADD TO CART
          </button>
        </div>
      )}
    </div>
  );
}