'use client';
import { useEffect, useState } from 'react';
import { X, Phone, Gift } from 'lucide-react';
import { useUser } from '@/store/userStore';

const POPUP_KEY = 'hasSeenSignupPopup';

export default function DiscountModal() {
  const { isLogged } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (isLogged) return;

    const hasSeenPopup = sessionStorage.getItem(POPUP_KEY);
    if (hasSeenPopup) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem(POPUP_KEY, 'true');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem(POPUP_KEY, 'true');
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      console.log('Phone submitted:', phoneNumber);
      closePopup();
    }
  };

  const handlePhoneChange = (e: any) => {
    setPhoneNumber(e.target.value.replace(/\D/g, ''));
  };

  if (!isOpen) return null;

  
    return (
    <>
      
      <div 
        className="fixed inset-0 backdrop-blur-md z-40 transition-all"
        onClick={() => setIsOpen(false)}
      />
      
     
      ({isOpen} && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-[scale-in_0.3s_ease-out]">
          {/* Close Button */}
          <button
            onClick={() => {setIsOpen(false)
        }}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Header Section */}
          <div 
            className="rounded-t-2xl p-8 text-center"
            style={{ backgroundColor: '#eac90b' }}
          >
            <div className="flex justify-center mb-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#E40000' }}
              >
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Get 10% OFF!
            </h2>
            <p className="text-gray-700 text-lg">
              Login with your mobile number
            </p>
          </div>

           
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-6">
              <label 
                htmlFor="phone" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter your mobile number"
                  maxLength= {10}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"

                  required
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                We'll send you a verification code
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: '#E40000' }}
            >
              Claim Your 10% Discount
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              By continuing, you agree to our Terms & Conditions
            </p>
          </form>
        </div>
      </div>)

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
   
