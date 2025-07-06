import { Product } from '@/types/product';
import { Star } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const variant = product.variants[0];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-[#eac90b] fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleAddToCart = () => {
    console.log("added to cart");
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="relative p-6 bg-gray-50 rounded-t-3xl">
        <div className="aspect-square bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-2xl font-bold text-[#eac90b]">VAHDAM</div>
            <div className="text-sm mt-2 bg-white/20 rounded-lg px-3 py-1">
              {product.name.split(' ')[0]}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-1 mb-3">
          {renderStars(product.ratings)}
          <span className="ml-2 text-sm text-gray-600">{product.numOfReviews} reviews</span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E40000] transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4">{product.category}</p>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">₹ {variant.discountedPrice}</span>
          {variant.price && (
            <span className="text-sm text-gray-500 line-through">₹ {variant.price}</span>
          )}
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full bg-green-700 hover:bg-[#E40000] text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-300 transform hover:scale-105"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
