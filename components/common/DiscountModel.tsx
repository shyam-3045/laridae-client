"use client";
import { useEffect, useState } from "react";
import { X, Gift } from "lucide-react";
import { useUser } from "@/store/userStore";

const POPUP_KEY = "hasSeenSignupPopup";

export default function DiscountModal() {
  const { isLogged } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isLogged) return;

    const hasSeenPopup = sessionStorage.getItem(POPUP_KEY);
    if (hasSeenPopup) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem(POPUP_KEY, "true");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem(POPUP_KEY, "true");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background Blur */}
      <div
        className="fixed inset-0 backdrop-blur-md z-40 transition-all"
        onClick={closePopup}
      />

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-[scale-in_0.3s_ease-out]">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Header */}
            <div
              className="rounded-t-2xl p-8 text-center"
              style={{ backgroundColor: "#eac90b" }}
            >
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#E40000" }}
                >
                  <Gift className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Get 10% OFF!
              </h2>

              <p className="text-gray-700 text-lg">
                Exclusive offer for our customers
              </p>
            </div>

            {/* Information Section (Replaced Form) */}
            {/* Information Section */}
            <div className="p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Welcome Offer
              </h3>

              <p className="text-gray-600 mb-6">
                Unlock <span className="font-bold text-[#D4AF37]">10% OFF</span>{" "}
                on your first order.
              </p>

              <button
                onClick={closePopup}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: "#E40000" }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
