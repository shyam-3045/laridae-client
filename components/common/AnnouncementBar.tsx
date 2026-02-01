'use client';
const messages = [
  '🚚 Free shipping on First Order Above 20kgs',
];

export default function AnnouncementBar() {
  return (
    <div className="w-full h-14.5 flex items-center  top-0 z-50 bg-[#E40000] text-[#eac90b] text-center text-sm font-medium py-2 shadow-md overflow-hidden">
      <div className="flex whitespace-nowrap animate-scroll">
        {/* First set of messages */}
        <div className="flex shrink-0">
          {messages.map((message, index) => (
            <span key={`first-${index}`} className="px-8 inline-block">
              {message}
            </span>
          ))}
        </div>
    
        <div className="flex shrink-0">
          {messages.map((message, index) => (
            <span key={`second-${index}`} className="px-8 inline-block">
              {message}
            </span>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}