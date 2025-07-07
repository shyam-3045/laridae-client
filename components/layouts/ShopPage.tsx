'use client'

import { useAllProducts } from '@/hooks/CustomHooks/useAllProducts'
import { ProductCard } from '../common/ProductCard'
import { Product } from '@/types/product'

const ShopPage = () => {
    const{data:product,isLoading}=useAllProducts()
    if(isLoading)
    {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eac90b] mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading products...</p>
                </div>
            </div>
        )
    }
    console.log(product.data)
  return (
    <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-light text-[#C5A572] mb-4">
                        All Products
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                        Explore a wide selection of teas & spices, from authentic blends to single-origin spices.
                    </p>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar - Categories */}
                <div className="w-full lg:w-80 lg:flex-shrink-0">
                    <div className="bg-white lg:sticky lg:top-8">
                        <h2 className="text-lg font-medium text-[#C5A572] mb-6">Filters</h2>
                        
                        {/* Price Range */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-medium text-gray-900">Price</h3>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            
                            {/* Price Range Slider */}
                            <div className="relative mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                                        <div className="absolute left-0 top-0 h-2 bg-gray-800 rounded-full" style={{width: '20%'}}></div>
                                        <div className="absolute right-0 top-0 h-2 bg-gray-800 rounded-full" style={{width: '20%'}}></div>
                                        <div className="absolute left-1/5 top-0 w-3 h-3 bg-gray-800 rounded-full transform -translate-y-0.5"></div>
                                        <div className="absolute right-1/5 top-0 w-3 h-3 bg-gray-800 rounded-full transform -translate-y-0.5"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm text-gray-600">₹</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-16 px-2 py-1 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-500"
                                    />
                                </div>
                                <span className="text-sm text-gray-500">to</span>
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm text-gray-600">₹</span>
                                    <input
                                        type="number"
                                        placeholder="3599"
                                        className="w-16 px-2 py-1 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Type */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-medium text-gray-900">Product Type</h3>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-medium text-gray-900">Form</h3>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Caffeine */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-medium text-gray-900">Caffeine</h3>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Collection */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-medium text-gray-900">Collection</h3>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Chat Widget */}
                        <div className="fixed bottom-6 left-6 z-50">
                            <div className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-700 transition-colors">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content - Products */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <div></div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-[#C5A572] font-medium">Sort By:</span>
                            <select className="text-sm text-gray-900 bg-transparent border-none focus:outline-none cursor-pointer">
                                <option>Featured</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Rating</option>
                            </select>
                            <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {product?.data?.map((product:Product)=>
                        (
                            <ProductCard key={product._id} product={product}/>
                        ))}
                    </div>

                    {/* Empty State */}
                    {(!product?.data || product?.data?.length === 0) && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🍃</div>
                            <p className="text-gray-500 text-lg">No products found</p>
                            <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShopPage