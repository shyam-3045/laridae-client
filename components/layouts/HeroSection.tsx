import Image from 'next/image';
import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative z-40 w-full h-[92vh]">
      <Image
        src="/herosectio.webp"
        alt="Hero"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
};

export default HeroSection;
