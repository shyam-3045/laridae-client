"use client";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

import React, { useState, useEffect, useRef, Ref } from "react";
import { X, Shield, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { sendOtpReq, useVerifyOtpReq } from "@/hooks/CustomHooks/otp";
import { ifError } from "assert";
import api from "@/lib/config/axios";
import { DeliveryFormData } from "@/app/payment/page";
import { orginalCart } from "@/types/cart";
import { toastFailure, toastSuccess } from "@/utils/toast";
import { createOrd } from "@/hooks/CustomHooks/orders";
import { useCartStore } from "@/store/cartStore"; 
import { editUserDetails } from "@/hooks/CustomHooks/auth";


type product=Pick<orginalCart , "product_id"|"quantity">
interface OTPModalProps {
  delivarydetails?:DeliveryFormData
  isOpen: boolean;
  onClose: () => void;
  totalAmount:number;
  products:product[];
}

const OTPModal: React.FC<OTPModalProps> = ({delivarydetails, isOpen, onClose,totalAmount,products }) => {
  const { mutate: sendOtp } = sendOtpReq();
  const [err,setErr]=useState<string>()
  const {mutate:editUser}=editUserDetails()
  
  

  const {
    mutate: verifyOtp,
    data: verificationData,
    isSuccess,
    isError,
    error:verificationError,
  } = useVerifyOtpReq(
    {
      onSuccess: (data) => {
      console.log("OTP verified:", data);
      startPayment();
      onClose();
  },
  onError: (error: any) => {
    setErr(error?.message || "Invalid OTP");
    setTimeout(() => setErr(""), 3000);
  },
    }
  );
  const{mutate : creatOrder,data:orderData}=createOrd()

  useEffect(()=>
{
    if(isError)
    {
        const msg=verificationError
        //setErr(msg?.message)
    }
    setTimeout(()=>
    {
        setErr("")
    },3000)

},[verificationError,ifError])

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [expiryTimer, setExpiryTimer] = useState(300); // 5 minutes = 300 seconds
  const [canResend, setCanResend] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const router = useRouter();

  // Resend timer (60 seconds)
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      console.log("resend occur by timer !")
      return () => clearInterval(interval);
      
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // OTP expiry timer (5 minutes)
  useEffect(() => {
    if (expiryTimer > 0 && !isExpired) {
      const interval = setInterval(() => {
        setExpiryTimer((prev) => {
          if (prev <= 1) {
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [expiryTimer, isExpired]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pastedData.length === 6) {
      const newOtp = pastedData.split("").slice(0, 6);
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };
const handleVerify = () => {
  if (isExpired) {
    setErr("OTP has expired. Please request a new one.");
    setTimeout(() => setErr(""), 3000);
    return;
  }

  const otpString = otp.join("");

  if (otpString.length !== 6) return;

  try {
    const user = JSON.parse(localStorage.getItem("user-storage") as string);
    const phone = user.state.data.user;
    verifyOtp({ phone, otp: otpString }); 
  } catch (error) {
    console.error("OTP verification failed:", error);
  }
};

  const startPayment=async()=>
  {
    const user = JSON.parse(localStorage.getItem("user-storage") as string);
    const phone = user.state.data.user;  
    const order= await api.post("create-order",{
      amount:totalAmount
    })
    console.log(order)
    // 2. Open Razorpay Checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
      amount: order?.data?.data?.amount,
      currency: order?.data?.data?.currency,
      name: "Laridae",
      description: "Tea order",
      order_id: order?.data?.data?.id,
      handler: async function (response: any,order_id:string) {
        // 3. Verify payment on backend
        
        const verify= await api.post("/verify-payment",{
          razorpay_order_id: response.razorpay_order_id,
                       razorpay_payment_id: response.razorpay_payment_id,
                       razorpay_signature: response.razorpay_signature,
        })
        console.log(verify)
        if (verify?.data?.success) {
          toastSuccess("Order Placed Successfullt")
          useCartStore.getState().clearCart()

          creatOrder({
            phone:phone,
            products:products,
            deliveryDetails:delivarydetails,
            totalAmount:totalAmount,
            paymentDetails:{
                       razorpay_order_id: response.razorpay_order_id,
                       razorpay_payment_id: response.razorpay_payment_id,
                       razorpay_signature: response.razorpay_signature,
            }

          })
          const data = {
            availFirstDiscount:false
          }
          editUser({data})
          console.log(orderData)
          router.push("/orders");
        } else {
          toastFailure("❌ Payment verification failed")
        }
      },
      prefill: {
        name: "Shyam",
        email: "shyam@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  }
  const handleResend = async () => {
    if (!canResend) return;

    try {
      const user = JSON.parse(localStorage.getItem("user-storage") as string);
      const phone = user.state.data.user;
      sendOtp({ phone });
      console.log("OTP resent");
      setTimer(60);
      setExpiryTimer(300); // Reset expiry timer to 5 minutes
      setCanResend(false);
      setIsExpired(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  // Format expiry timer as MM:SS
  const formatExpiryTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-200">
        <div className="relative bg-gradient-to-br from-yellow-50 via-amber-50 to-white border-b border-gray-200 px-6 py-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="text-yellow-600" size={32} />
            </div>
            <h2 className="text-2xl font-normal text-gray-800 mb-2">Verify OTP</h2>
            <p className="text-gray-600 text-sm">
              We've sent a 6-digit code to your registered number
            </p>
          </div>
        </div>

        <div className="p-6">
          
          {err && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-sm text-red-600 text-center">
                {err || "Invalid OTP. Please try again."}
              </p>
            </div>
          )}

          {isExpired && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-6">
              <p className="text-sm text-amber-700 text-center font-medium">
                OTP has expired. Please request a new one.
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter 6-digit verification code
              </label>

              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el: any) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOTPChange(index, e.target.value.replace(/\D/g, ""))
                    }
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={isExpired}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                ))}
              </div>

              {/* OTP Expiry Timer */}
              <div className="mt-4 text-center">
                <p className={`text-sm font-medium ${isExpired ? 'text-red-600' : expiryTimer <= 60 ? 'text-amber-600' : 'text-gray-600'}`}>
                  {isExpired ? 'OTP Expired' : `OTP expires in ${formatExpiryTime(expiryTimer)}`}
                </p>
              </div>
            </div>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

            <button
              type="button"
              onClick={handleVerify}
              disabled={otp.join("").length !== 6 || isExpired}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
             
              Verify OTP
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>

            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
              >
                <RotateCcw size={16} className="mr-1" />
                Resend OTP
              </button>
            ) : (
              <p className="text-sm text-gray-500">Resend in {timer} seconds</p>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Check your messages if you don't see the code
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;