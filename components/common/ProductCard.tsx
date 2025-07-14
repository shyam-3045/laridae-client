"use client";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/product";
import { toastFailure, toastSuccess } from "@/utils/toast";
import { Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
  isOtherProducts?: boolean;
}
export function ProductCard({ product, isOtherProducts=false }: Props) {
  const addToCart=useCartStore.getState().addToCart
  const router = useRouter();
  const variant = product.variants[0];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-[#eac90b] fill-current" : "text-gray-300"
        }`}
      />
    ));
  };
  const handlePageChange = (name: string, id: string) => {
    router.push(`/product/${name}?id=${id}`);
    
  };
  const handleAddToCart = (id: string) => {
    const quantity=1
    const flag=addToCart({product_id:id,quantity})
    if(flag)
    {
      toastSuccess("Product added to Cart")
    }
    else{
      toastFailure("Not allowed")
    }
    
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div onClick={() => handlePageChange(product.name, product._id)}>
        <div className="relative p-6 bg-gray-50 rounded-t-3xl">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-1 mb-3">
            {renderStars(product.ratings)}
            <span className="ml-2 text-sm text-gray-600">
              {product.numOfReviews} reviews
            </span>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E40000] transition-colors">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 mb-4">{product.category}</p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-gray-900">
              ₹ {variant.discountedPrice}
            </span>
            {variant.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹ {variant.price}
              </span>
            )}
          </div>
        </div>
      </div>
      {isOtherProducts ? null : (
        <button
          onClick={() => handleAddToCart(product._id)}
          className="w-full bg-green-700 hover:bg-[#E40000] text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-300 transform hover:scale-105"
        >
          ADD TO CART
        </button>
      )}
    </div>
  );
}
