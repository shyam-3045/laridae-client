'use client';

import { useEffect, useState } from 'react';

const messages = [
  '🚚 Free shipping on orders over ₹500!',
  '🔥 Flat 20% OFF on first purchase – Use code FIRST20',
  '🕒 Limited time deal – Order before midnight!',
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === messages.length - 1 ? 0 : prev + 1
      );
    }, 5000); 

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full sticky top-0 z-50 bg-[#E40000] text-[#eac90b] text-center text-sm font-medium py-2 shadow-md">
      <div className="transition-opacity duration-500 ease-in-out">
        {messages[currentIndex]}
      </div>
    </div>
  );
}
