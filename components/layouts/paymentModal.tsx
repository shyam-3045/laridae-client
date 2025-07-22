import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, MapPin, Phone, Home, Navigation } from 'lucide-react';

// Zod validation schema
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
  setAsDefault: z.boolean().default(false)
});

type DeliveryFormData = z.infer<typeof deliverySchema>;

interface DeliveryModalProps {
  onSubmit?: (data: DeliveryFormData) => void;
  onClose?: () => void;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({ 
  onSubmit: onSubmitProp, 
  onClose: onCloseProp 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
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

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const onSubmit = async (data: DeliveryFormData): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', data);
      
      // Call the optional onSubmit prop
      if (onSubmitProp) {
        onSubmitProp(data);
      }
      
      // Close modal and reset form
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClose = (): void => {
    setIsOpen(false);
    reset();
    
    // Call the optional onClose prop
    if (onCloseProp) {
      onCloseProp();
    }
  };

  const handleOpen = (): void => {
    setIsOpen(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        type="button"
      >
        Add Delivery Address
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {/* Modal Content */}
          <div 
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Delivery Details
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    <Home size={16} className="inline mr-2" />
                    Address *
                  </label>
                  <textarea
                    id="address"
                    {...register('address')}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your complete address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                {/* Pincode and Mobile */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="inline mr-2" />
                      Pincode *
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      {...register('pincode')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
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
                      Mobile *
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      {...register('mobile')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
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

                {/* City and State */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      {...register('city')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter city"
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                {/* Landmark */}
                <div>
                  <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-2">
                    <Navigation size={16} className="inline mr-2" />
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    {...register('landmark')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Near famous place, building, etc."
                  />
                </div>

                {/* Set as Default */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="setAsDefault"
                    {...register('setAsDefault')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="setAsDefault" className="text-sm font-medium text-gray-700">
                    Set as default delivery address
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center"
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryModal;