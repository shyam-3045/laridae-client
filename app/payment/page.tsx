'use client'
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { json, z } from 'zod';
import { MapPin, Phone, Home, Navigation, ArrowLeft, Truck } from 'lucide-react';
import { addUserDetails } from '@/hooks/CustomHooks/auth';
import OtpModal from '@/components/layouts/otpModal';
import { sendOtpReq } from '@/hooks/CustomHooks/otp';
import { useCartStore } from '@/store/cartStore';



const deliverySchema = z.object({
  address: z.string().min(1, 'Address is required').min(10, 'Address must be at least 10 characters'),
  pincode: z.string()
    .min(1, 'Pincode is required')
    .regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  mobile: z.string()
    .min(1, 'Mobile number is required')
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  city: z.string().min(1, 'City is required').min(2, 'City must be at least 2 characters'),
  state: z.string().min(1, 'State is required').min(2, 'State must be at least 2 characters'),
  landmark: z.string().optional(),
  setAsDefault: z.boolean().default(false).optional()
});

export type DeliveryFormData = z.infer<typeof deliverySchema>;



const PaymentPage: React.FC = () => {
  const {mutate:sendOtp,data,isError:otpisError,error:otpError}=sendOtpReq()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<DeliveryFormData>({
    resolver:zodResolver(deliverySchema),
    defaultValues: {
      address: '',
      pincode: '',
      mobile: '',
      city: '',
      state: '',
      landmark: '',
      setAsDefault: false
    }
  });
  const [delivarydetails,setDelivaruDetails]=useState<DeliveryFormData>()
  const [otpModal,setOtpModal]=useState(false)
  const {data:userData,isPending,isError,error,mutate:addUser}=addUserDetails()
  const onSubmit = async (data: DeliveryFormData) => {
    try {
      const user=JSON.parse(localStorage.getItem('user-storage') as string)
      const email=user.state.data.user
      setDelivaruDetails(data)
      addUser({data})
      //
      reset();
      sendOtp({email})
      if (otpisError) console.log(otpError)
      setOtpModal(true)
      
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

 const onClose=()=>
 {
  setOtpModal(false)
 }
  return (
    <div>
      <div className="min-h-screen bg-gray-50">
      

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-200px)]">
      
          <div className="flex items-center justify-center bg-gradient-to-br from-red-50 to-indigo-100 rounded-2xl p-8">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="relative">
                  <Truck size={80} className="text-red-600" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Fast & Reliable Delivery
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                We deliver to your doorstep with care and precision. Add your delivery address to get started with seamless shopping experience.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <div className="font-semibold text-gray-900">Fast & Reliable</div>
    <div className="text-gray-600">Quick delivery for all your orders</div>
  </div>
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <div className="font-semibold text-gray-900">Hassle-Free Service</div>
    <div className="text-gray-600">Smooth process from checkout to doorstep</div>
  </div>
</div>

              
            </div>
          </div>

         
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Delivery Details
              </h2>
              <p className="text-gray-600">
                Please provide your complete delivery address information
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
           
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  <Home size={16} className="inline mr-2" />
                  Complete Address *
                </label>
                <textarea
                  id="address"
                  {...register('address')}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="House/Flat No, Street, Area, Locality"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

          
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Pincode *
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    {...register('pincode')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                      errors.pincode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123456"
                    maxLength={6}
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    {...register('mobile')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                      errors.mobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    {...register('city')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your city"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    {...register('state')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your state"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                  )}
                </div>
              </div>

              
              <div>
                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-2">
                  <Navigation size={16} className="inline mr-2" />
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  id="landmark"
                  {...register('landmark')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Near famous place, building, etc."
                />
              </div>

              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="setAsDefault"
                  {...register('setAsDefault')}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="setAsDefault" className="text-sm font-medium text-gray-700">
                  Set as default delivery address
                </label>
              </div>

              
              <div className="flex pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || isPending}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Address'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div>
      {otpModal && <OtpModal isOpen={otpModal} onClose={onClose} delivarydetails={delivarydetails} totalAmount={useCartStore.getState().cartTotal} products={useCartStore.getState().cart}/>}
    </div>
    </div>
  );
};

export default PaymentPage;