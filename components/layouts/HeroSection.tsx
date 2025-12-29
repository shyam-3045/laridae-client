'use client'
import { useState, useEffect } from 'react';

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = [
    'https://res.cloudinary.com/dcyjehnyf/image/upload/v1767008925/c5b53c04-b794-4117-a94a-d80c58467088_hmvqgd.png',
    "https://res.cloudinary.com/dcyjehnyf/image/upload/v1767009075/13c2a662-374f-4bfd-b7be-b987a11c3975_ncrumi.png",
    "https://res.cloudinary.com/dcyjehnyf/image/upload/v1767009193/7d4f51a4-40b8-47b8-b686-4a7be68a91c7_uyjjin.png",
    "https://res.cloudinary.com/dcyjehnyf/image/upload/v1767009230/60de3de7-07f9-49e5-9c2b-7101d093c1e3_bp7zvm.png"
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