'use client'
import { useState, useEffect } from 'react';

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Desktop hero images
  const desktopImages = [
    'https://res.cloudinary.com/dcyjehnyf/image/upload/v1769921971/Scroller_image_1_trail_page-0001-1_shrzar.jpg',
    'https://res.cloudinary.com/dcyjehnyf/image/upload/v1770004515/Screenshot_2026-02-02_092227_i3pttx.png',
    'https://res.cloudinary.com/dcyjehnyf/image/upload/v1770004688/Screenshot_2026-02-02_092723_ogtudz.png'

  ];

  // Mobile hero images
  const mobileImages = [
    'https://res.cloudinary.com/dcyjehnyf/image/upload/v1769921760/Scroller_image_1_trail_mobil_version_page-0001_qealop.jpg',
    'https://res.cloudinary.com/dcyjehnyf/image/upload/v1770004835/Screenshot_2026-02-02_092914_owjt0z.png',
    'https://res.cloudinary.com/dcyjehnyf/image/upload/v1770004836/Screenshot_2026-02-02_093000_k6wcsz.png'
  ];

  const images = isMobile ? mobileImages : desktopImages;

  // Detect mobile only for asset switching
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 640);
    };

    check();
    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);
  }, []);

  // Auto slide
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Reset slide when switching image set
  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="
        relative w-full overflow-hidden bg-gray-900
        h-[380px] sm:h-[420px] md:h-[480px] lg:h-[560px] xl:h-[620px]
      "
    >
      <div className="relative w-full h-full">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((src, index) => (
            <div
              key={index}
              className="min-w-full h-full flex items-center justify-center"
            >
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-white w-8'
                  : 'bg-white/50 w-3 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
