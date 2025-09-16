"use client";
import React, { useEffect, useState } from "react";
import { X, Eye, EyeOff, Mail, Lock, User, Route } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormType,
  loginSchema,
  signUpFormType,
  signUpSchema,
} from "@/types/authSchema";
import { useUser } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { loginOrSignUp } from "@/hooks/CustomHooks/auth";
import {  loginFormData } from "@/types/common";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLogged: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  
}) => {
  const { mutateAsync, isPending, isError, error, data:loginData } = loginOrSignUp();
  
  const [serverError,setServerError]=useState<string>('')
  const [isLogin, setIsLogin] = useState(true);
  const {login}=useUser()
  const router = useRouter();
  
  const { register, handleSubmit: onHandleSubmit, formState: { isSubmitting, errors }, } = useForm<loginFormData>({ resolver: zodResolver(isLogin ? loginSchema : signUpSchema), });


  useEffect(()=>
  {
    if(isError)
    {
     const msg = (error as any)?.response?.data?.message || "Something went wrong";
    setServerError(msg)
    setTimeout(()=>
    {
      setServerError("")
    },3000)

    }
   

  },[isError,error])
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (data : loginFormData  ) => {
    const type = isLogin ? "Login" : "signup";
    await mutateAsync({ data, typeOfAuth: type });
    if (isError) {
      console.log(error.message);
    }
    else{
      console.log(loginData)
      login({user:data.email})
      onClose()
      router.push('/payment')
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
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
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? "Welcome back!" : "Create account"}
            </h2>
            <p className="text-white/90 text-sm">
              {isLogin
                ? "Please sign in to your account"
                : "Join us and get started"}
            </p>
          </div>
        </div>

        <div className="p-6">
          
          <form onSubmit={onHandleSubmit(handleSubmit)} className="space-y-4">
            {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-sm text-red-600 text-center">
                {serverError || "Invalid OTP. Please try again."}
              </p>
            </div>
          )}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    {...register("name")}
                    type="text"
                    name="name"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors?.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors?.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name?.message}
                  </p>
                )}
              </div>
            )}
            {loginData?.data && (
                  <p className="mt-1 text-sm text-red-500">
                    {loginData?.data}
                  </p>
                )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  {...register("email")}
                  type="email"
                  name="email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
