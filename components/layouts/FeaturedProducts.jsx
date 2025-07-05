'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { ProductCard } from '../common/ProductCard';

const products = [
  {
    id: 1,
    name: "Chamomile Mint Citrus Green Tea, 50 Count",
    category: "Tea Bags | 50 Cups",
    price: 600,
    originalPrice: 750,
    reviews: 29,
    rating: 5,
    image: "/api/placeholder/300/300",
    badge: "BEST SELLER"
  },
  {
    id: 2,
    name: "Himalayan Green Tea, 100g",
    category: "Loose Leaf | 50 cups",
    price: 349,
    originalPrice: 450,
    reviews: 51,
    rating: 5,
    image: "/api/placeholder/300/300",
    badge: "WEBSITE EXCLUSIVE"
  },
  {
    id: 3,
    name: "Turmeric Ashwagandha Herbal Tea Tisane, 50...",
    category: "Tea Bags | 50 Cups",
    price: 600,
    originalPrice: 800,
    reviews: 8018,
    rating: 5,
    image: "/api/placeholder/300/300",
    badge: "BEST SELLER"
  },
  {
    id: 4,
    name: "Darjeeling Summer Black Tea, 50 Count",
    category: "Tea Bags | 50 Cups",
    price: 650,
    originalPrice: 850,
    reviews: 80,
    rating: 5,
    image: "/api/placeholder/300/300",
    badge: "WEBSITE EXCLUSIVE"
  }, {
    id: 5,
    name: "Chamomile Mint Citrus Green Tea, 50 Count",
    category: "Tea Bags | 50 Cups",
    price: 600,
    originalPrice: 750,
    reviews: 29,
    rating: 5,
    image: "/api/placeholder/300/300",
    badge: "BEST SELLER"
  },
   {
    id: 6,
    name: "Chamomile Mint Citrus Green Tea, 50 Count",
    category: "Tea Bags | 50 Cups",
    price: 600,
    originalPrice: 750,
    reviews: 29,
    rating: 5,
    image: "/api/placeholder/300/300",
    badge: "BEST SELLER"
  },
];

export default function FeaturedProducts() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    console.log("clicked")
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-[#eac90b] fill-current' : 'text-gray-300'}`}
      />
    ));
  };
  const handleAddToCart=()=>
  {
    console.log("Added to cart")
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Our <span className="text-[#E40000]">Premium</span> Collection
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Handpicked teas that bring <span className="font-semibold text-[#E40000]">wellness</span> and 
          <span className="font-semibold text-[#eac90b]"> extraordinary flavor</span> to your daily ritual
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-100 rounded-full p-1">
          <button className="px-6 py-2 rounded-full bg-gray-900 text-white font-medium">
            BEST SELLERS
          </button>
          <button className="px-6 py-2 rounded-full text-[#eac90b] font-medium hover:bg-gray-200 transition-colors">
            WEBSITE EXCLUSIVE
          </button>
        </div>
      </div>

      <div className="relative">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <button className="bg-[#E40000] hover:bg-[#eac90b] hover:text-gray-900 text-white font-bold py-3 px-8 rounded-2xl transition-colors duration-300 transform hover:scale-105">
          VIEW ALL
        </button>
      </div>
    </div>
  );
}