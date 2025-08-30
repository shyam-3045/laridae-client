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
  console.log(products )

  const {
    mutate: verifyOtp,
    data: verificationData,
    isSuccess,
    isError,
    error:verificationError,
  } = useVerifyOtpReq();
  const{mutate : creatOrder,data:orderData}=createOrd()

  useEffect(()=>
{
    if(isError)
    {
        const msg=verificationError
        setErr(msg?.message)
    }
    setTimeout(()=>
    {
        setErr("")
    },3000)

},[verificationError,ifError])

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const router = useRouter();

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

  const handleVerify = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user-storage") as string);
      const email = user.state.data.user;
      verifyOtp({ email, otp: otpString });
      console.log(isError)

      if (isSuccess) {
        console.log(verificationData);
        startPayment()
        onClose();
      }
      // login({ user: email || phoneNumber });
      
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const startPayment=async()=>
  {
    const user = JSON.parse(localStorage.getItem("user-storage") as string);
      const email = user.state.data.user;  
    const order= await api.post("create-order",{
      amount:500
    })
    console.log(order)
    // 2. Open Razorpay Checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // public key
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
          creatOrder({
            email:email,
            products:products,
            deliveryDetails:delivarydetails,
            totalAmount:totalAmount,
            paymentDetails:{
                       razorpay_order_id: response.razorpay_order_id,
                       razorpay_payment_id: response.razorpay_payment_id,
                       razorpay_signature: response.razorpay_signature,
            }

          })
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
      const email = user.state.data.user;
      sendOtp({ email });
      console.log("OTP resent");
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
            <p className="text-white/90 text-sm">
              We've sent a 6-digit code to{" "}
              {/* {email && <span className="font-medium">{email}</span>}
              {phoneNumber && <span className="font-medium">{phoneNumber}</span>} */}
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
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                ))}
              </div>
            </div>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

            <button
              type="button"
              onClick={handleVerify}
              disabled={otp.join("").length !== 6} // || isVerifying
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* {isVerifying ? "Verifying..." : "Verify OTP"} */}
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
                // disabled={isResending}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <RotateCcw size={16} className="mr-1" />
                {/* {isResending ? "Sending..." : "Resend OTP"} */}
                Resend OTP
              </button>
            ) : (
              <p className="text-sm text-gray-500">Resend in {timer} seconds</p>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Check your spam folder if you don't see the code
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
