'use client'
import { useState, useEffect } from 'react';

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = [
    'https://res.cloudinary.com/dcyjehnyf/image/upload/v1766989543/Website_Scroller_image_Mobile_1_1_ekh0lm.png',
    'https://res.cloudinary.com/dcyjehnyf/image/upload/v1766989536/Website_Scroller_image_Mobile_2_1_krhw4c.png',
    'https://res.cloudinary.com/dcyjehnyf/image/upload/v1766989528/Website_Scroller_image_Mobile_3_1_dwbiif.png',
    'https://res.cloudinary.com/dcyjehnyf/image/upload/v1766989515/Website_Scroller_image_Mobile_4_1_boszvi.png'
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
    </div>
  );
}