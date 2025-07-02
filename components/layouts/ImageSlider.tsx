'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const images = [
  '/Bg-image.jpg',
  '/Bg-image.jpg',
  '/Bg-image.jpg',
  
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-xl shadow-lg mt-8">
      
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={src}
            alt={`slide-${index}`}
            width={1500}
            height={1}
            className="object-contain"
            priority={index === 0} 
          />
        </div>
      ))}

      
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
