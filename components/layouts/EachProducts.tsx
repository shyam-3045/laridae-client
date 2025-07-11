"use client";
import React, { useState } from "react";
import {
  Star,
  
} from "lucide-react";
import { Product } from "@/types/product";
import Image from "next/image";
import { ProductCard } from "../common/ProductCard";

interface Params {
  products: Product;
  error?: Error | null;
  isLoading: boolean;
  allProducts:Product[];
}
const SingleProducts = ({ products, isLoading,allProducts }: Params) => {
  const [quantity, setQuantity] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  if (isLoading) {
    return <p>...Loading</p>;
  }
  
  const otherProducts=allProducts.filter((item:Product) => item._id.toString() !== products._id.toString())
  
  


  const productSpecs = [
    { label: "Brand", value: "VAHDAM INDIA" },
    { label: "Product Type", value: "Herbal Tea" },
    { label: "Flavor", value: "Hibiscus Rose" },
    { label: "Ingredients", value: "Hibiscus, Rose, Cardamom, Fennel" },
    { label: "Package Count", value: "15 Biodegradable Pyramid Bags" }, 
    { label: "Net Weight", value: "30g" },
    { label: "Caffeine", value: "Caffeine-Free" },
    { label: "Origin", value: "India" },
  ];

  const reviews = [
    {
      name: "Priya Sharma",
      rating: 5,
      comment:
        "Amazing floral blend! The hibiscus and rose combination is absolutely delightful. Perfect for evening relaxation.",
    },
    {
      name: "Raj Kumar",
      rating: 5,
      comment:
        "Great quality tea with wonderful aroma. The packaging is eco-friendly which I really appreciate.",
    },
    {
      name: "Meera Patel",
      rating: 4,
      comment:
        "Very refreshing and tasty. The cardamom adds a nice touch to the floral notes.",
    },
  ];

  

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
         
          <div className="space-y-4">
          
            <div className="relative">
              <div className="relative bg-white rounded-lg overflow-hidden border-1 border-gray-200 shadow-lg shadow-amber-100">
                <div 
                  className="relative overflow-hidden cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Image
                    src={products.images[0].url}
                    alt="Product Image"
                    width={500}
                    height={500}
                    className="rounded-lg object-cover w-full h-auto"
                  />
                  
                  
                  {isZooming && (
                    <div
                      className="absolute pointer-events-none border-2 border-gray-400 bg-white bg-opacity-30 "
                      style={{
                        width: '75px',
                        height: '75px',
                        left: `${zoomPosition.x}%`,
                        top: `${zoomPosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '8px',
                      }}
                    />
                  )}
                </div>
              </div>
              
             
              {isZooming && (
                <div className="absolute left-full top-0 ml-4 w-110 h-100 bg-white border-2 border-gray-200 shadow-xl rounded-lg overflow-hidden z-10">
                  <div
                    className="w-full h-full bg-no-repeat"
                    style={{
                      backgroundImage: `url(${products.images[0].url})`,
                      backgroundSize: '200%',
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>

        
          <div className="space-y-6">
            
            <div>
              <h1 className="text-3xl font-normal text-gray-800 mb-2">
                {products.name}
              </h1>

            
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{products.ratings} reviews</span>
              </div>
            </div>

            {/* Product Description */}
            <div className="text-gray-700 leading-relaxed">
             {products.Overview}
            </div>

            {/* Biodegradable Info */}
            <div className="text-yellow-600 font-medium">
              15 Plant-Based Biodegradable Pyramid Bags
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-xs text-gray-500">
                MRP (incl. of all taxes)
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-normal text-gray-800">
                  ₹ {products.variants[0].discountedPrice}
                </span>
                <div className="flex items-center space-x-1 text-yellow-600 text-sm">
                  <div className="w-4 h-4 bg-yellow-100 rounded flex items-center justify-center">
                    <span className="text-xs">₹</span>
                  </div>
                  <span>{products.variants[0].price}</span>{/*Add original proce here with strike out */}
                </div>
              </div>
            </div>

            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-2 rounded text-sm font-medium transition-colors">
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>

            
            <div className="text-xs text-yellow-600 ">
              (Our average delivery time in the past 30 days has been 2-3 days)
            </div>

            {/* Product Features */}
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Tasting Notes</span> - Floral,
                Tart & Refreshing
              </div>
              <div>
                <span className="font-medium">Caffeine</span> - Caffeine-Free
              </div>
              <div>
                <span className="font-medium">Packaging</span> - Individually
                Enveloped Tea Bags
              </div>
              <div>
                <span className="font-medium">Net Quantity</span> - 30 g
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-yellow-600 relative inline-block">
              PRODUCT DETAILS
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-red-600 rounded"></div>
            </h2>
          </div>

          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed text-justify">
              {products.description}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-yellow-600 text-white">
                  <th className="py-3 px-4 text-left font-semibold">
                    Specification
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {productSpecs.map((spec, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {spec.label}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-yellow-600 relative inline-block">
              CUSTOMER REVIEWS
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-red-600 rounded"></div>
            </h2>
          </div>

          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="border-l-4 border-yellow-600 pl-6 py-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{review.name}</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Other Products Section */}
        <div className="bg-white rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-yellow-600 relative inline-block">
              OTHER PRODUCTS
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-red-600 rounded"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherProducts.slice(0,4).map((item : Product)=>
            (
              <ProductCard key={item._id} product={item} isOtherProducts={true}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProducts;