"use client";
import React, { useState, useRef } from "react";
import {
  Star,
  ZoomIn,
  X,
} from "lucide-react";
import { Product } from "@/types/product";
import Image from "next/image";
import { ProductCard } from "../common/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { toastFailure, toastSuccess } from "@/utils/toast";
import Loading from "../common/loading";

interface Params {
  products: Product;
  error?: Error | null;
  isLoading: boolean;
  allProducts: Product[];
}

const SingleProducts = ({ products, isLoading, allProducts }: Params) => {
  const addTocart = useCartStore.getState().addToCart;
  const [quantity, setQuantity] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isMobileZoomOpen, setIsMobileZoomOpen] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  const otherProducts = allProducts.filter(
    (item: Product) => item._id.toString() !== products._id.toString() && item.isAvailable
  );

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

  // Desktop zoom handlers
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

  // Mobile zoom handlers
  const handleTouchStart = () => {
    setIsMobileZoomOpen(true);
  };

  const closeMobileZoom = () => {
    setIsMobileZoomOpen(false);
  };

  const handleAddTOCart = (id: string) => {
    const product_id = id;
    const { res, flag } = addTocart({
      product_id,
      quantity,
      max: products.MAX,
      min: products.MOQ,
    });
    if (flag) {
      toastSuccess(res);
    } else {
      toastFailure(res);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8 lg:mb-16">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative">
              <div className="relative bg-white rounded-lg overflow-hidden border border-gray-200 shadow-lg shadow-amber-100">
                <div
                  ref={imageRef}
                  className="relative overflow-hidden cursor-crosshair lg:cursor-crosshair cursor-pointer"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={handleTouchStart}
                >
                  <Image
                    src={products.images[0].url}
                    alt="Product Image"
                    width={500}
                    height={500}
                    className="rounded-lg object-cover w-full h-auto"
                  />

                  {/* Desktop zoom indicator */}
                  {isZooming && (
                    <div
                      className="absolute pointer-events-none border-2 border-gray-400 bg-white bg-opacity-30 hidden lg:block"
                      style={{
                        width: "75px",
                        height: "75px",
                        left: `${zoomPosition.x}%`,
                        top: `${zoomPosition.y}%`,
                        transform: "translate(-50%, -50%)",
                        borderRadius: "8px",
                      }}
                    />
                  )}

                  {/* Mobile zoom icon overlay */}
                  <div className="absolute top-4 right-4 lg:hidden bg-black bg-opacity-50 rounded-full p-2">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Desktop zoom preview */}
              {isZooming && (
                <div className="absolute left-full top-0 ml-4 w-80 h-80 bg-white border-2 border-gray-200 shadow-xl rounded-lg overflow-hidden z-10 hidden xl:block">
                  <div
                    className="w-full h-full bg-no-repeat"
                    style={{
                      backgroundImage: `url(${products.images[0].url})`,
                      backgroundSize: "200%",
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-4 lg:space-y-6">
            {/* Product Title and Rating */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-normal text-gray-800 mb-2 leading-tight">
                {products.name}
              </h1>

              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {products.ratings} reviews
                </span>
              </div>
            </div>

            {/* Product Description */}
            <div className="text-gray-700 leading-relaxed text-sm lg:text-base">
              {products.Overview}
            </div>

            {/* Biodegradable Info */}
            <div className="text-yellow-600 font-medium text-sm lg:text-base">
              15 Plant-Based Biodegradable Pyramid Bags
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="text-xs text-gray-500">
                MRP (incl. of all taxes)
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
                <span className="text-xl sm:text-2xl font-normal text-gray-800">
                  ₹ {products.variants[0].discountedPrice}
                </span>
                {products.variants[0].price && 
                 products.variants[0].price !== products.variants[0].discountedPrice && (
                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                    <span className="line-through">₹ {products.variants[0].price}</span>
                    <span className="text-green-600 font-medium">
                      ({Math.round(((products.variants[0].price - products.variants[0].discountedPrice) / products.variants[0].price) * 100)}% off)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full sm:w-auto"
                  >
                    {[...Array(Math.min(products.MAX, 10))].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleAddTOCart(products._id)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded text-sm font-medium transition-colors w-full sm:w-auto"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="text-xs text-yellow-600">
              (Our average delivery time in the past 30 days has been 2-3 days)
            </div>

            {/* Product Features */}
            <div className="space-y-2 lg:space-y-3 text-sm">
              <div>
                <span className="font-medium">Tasting Notes</span> - Floral, Tart & Refreshing
              </div>
              <div>
                <span className="font-medium">Caffeine</span> - Caffeine-Free
              </div>
              <div>
                <span className="font-medium">Packaging</span> - Individually Enveloped Tea Bags
              </div>
              <div>
                <span className="font-medium">Net Quantity</span> - 30 g
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:p-8 mb-8 lg:mb-12">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-600 relative inline-block">
              PRODUCT DETAILS
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-red-600 rounded"></div>
            </h2>
          </div>

          <div className="mb-6 lg:mb-8">
            <p className="text-gray-700 leading-relaxed text-justify text-sm lg:text-base">
              {products.description}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-full">
              <thead>
                <tr className="bg-yellow-600 text-white">
                  <th className="py-3 px-2 sm:px-4 text-left font-semibold text-sm lg:text-base">
                    Specification
                  </th>
                  <th className="py-3 px-2 sm:px-4 text-left font-semibold text-sm lg:text-base">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {productSpecs.map((spec, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-3 px-2 sm:px-4 font-medium text-gray-800 text-sm lg:text-base">
                      {spec.label}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-700 text-sm lg:text-base">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 mb-8 lg:mb-12">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-600 relative inline-block">
              CUSTOMER REVIEWS
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-red-600 rounded"></div>
            </h2>
          </div>

          <div className="space-y-4 lg:space-y-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="border-l-4 border-yellow-600 pl-4 lg:pl-6 py-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-2 sm:space-y-0">
                  <h3 className="font-semibold text-gray-800 text-sm lg:text-base">
                    {review.name}
                  </h3>
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 text-sm lg:text-base">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Other Products Section */}
        <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-600 relative inline-block">
              OTHER PRODUCTS
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-red-600 rounded"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {otherProducts.slice(0, 4).map((item: Product) => (
              <ProductCard key={item._id} product={item} isOtherProducts={true} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Zoom Modal */}
      {isMobileZoomOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center lg:hidden">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={closeMobileZoom}
              className="absolute top-4 right-4 text-white z-60 bg-black bg-opacity-50 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative max-w-full max-h-full overflow-hidden">
              <Image
                src={products.images[0].url}
                alt="Product Image Zoomed"
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain"
                style={{ 
                  maxWidth: '100vw', 
                  maxHeight: '100vh',
                  width: 'auto',
                  height: 'auto'
                }}
              />
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
              Pinch to zoom • Tap to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProducts;