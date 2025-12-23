'use client'
import { useState, useEffect } from 'react';

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=3334&h=1872&fit=crop',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=3334&h=1872&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=3334&h=1872&fit=crop'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  const goToSlide = (index:number) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-900" style={{ height: '620px' }}>
      <div className="relative w-full h-full">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {images.map((src, index) => (
            <div key={index} className="min-w-full h-full relative flex items-center justify-center">
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={() =>
          goToSlide(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 z-10"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={() => goToSlide((currentIndex + 1) % images.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 z-10"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}