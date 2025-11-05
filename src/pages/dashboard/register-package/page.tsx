
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../lib/api';
import { toast } from '../../../components/Toast';
import { ConfirmModal } from '../../../components/ConfirmModal';

const RegisterPackagePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/signin', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderAddress: '',
    senderCity: '',
    senderState: '',
    senderZip: '',
    senderCountry: '',
    senderPhone: '',
    recipientName: '',
    recipientEmail: '',
    recipientAddress: '',
    recipientCity: '',
    recipientState: '',
    recipientZip: '',
    recipientCountry: '',
    recipientPhone: '',
    packageType: '',
    weight: '',
    dimensions: '',
    value: '',
    serviceType: '',
    specialInstructions: '',
    pickupLocation: '',
    expectedDeliveryDate: ''
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert weight from lbs to kg if needed (backend might expect kg)
      const weightInKg = parseFloat(formData.weight) * 0.453592; // Convert lbs to kg

      // Prepare shipment data matching the API format
      // Note: For user registrations, we don't assign tracking number - admin will do that
      const shipmentData = {
        sender_name: formData.senderName,
        sender_email: formData.senderEmail || user?.email || '',
        sender_phone: formData.senderPhone,
        sender_address: `${formData.senderAddress}, ${formData.senderCity}, ${formData.senderState} ${formData.senderZip}`.trim(),
        receiver_name: formData.recipientName,
        receiver_email: formData.recipientEmail || '',
        receiver_phone: formData.recipientPhone,
        receiver_address: `${formData.recipientAddress}, ${formData.recipientCity}, ${formData.recipientState} ${formData.recipientZip}`.trim(),
        package_type: formData.packageType || formData.serviceType || 'Standard',
        weight: weightInKg || 0,
        weight_unit: 'kg',
        shipment_cost: parseFloat(formData.value) || 0,
        description: formData.specialInstructions || `Package Type: ${formData.packageType}, Dimensions: ${formData.dimensions}, Pickup Location: ${formData.pickupLocation}`,
        origin_country: formData.senderCountry || 'United States',
        destination_country: formData.recipientCountry || 'United States',
        date_registered: new Date().toISOString().split('T')[0],
        estimated_delivery_date: formData.expectedDeliveryDate || undefined,
        pickup_location: formData.pickupLocation,
        registered_by_user: true, // Flag to indicate user registration
        status: 'Pending Registration' // Special status for user-registered packages
      };

      const response = await api.createShipment(shipmentData) as any;
      
      if (response.success) {
        // For user registrations, no tracking number is assigned yet
        // Admin will assign tracking number when processing the package
        setTrackingNumber(null);
        setShowSuccessModal(true);
        toast.success('Package registration submitted successfully!');
      } else {
        toast.error(response.error || 'Failed to register package. Please try again.');
      }
    } catch (error: any) {
      console.error('Package registration error:', error);
      toast.error(error.message || 'Failed to register package. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setStep(1);
    // Reset form
    setFormData({
      senderName: '',
      senderEmail: '',
      senderAddress: '',
      senderCity: '',
      senderState: '',
      senderZip: '',
      senderCountry: '',
      senderPhone: '',
      recipientName: '',
      recipientEmail: '',
      recipientAddress: '',
      recipientCity: '',
      recipientState: '',
      recipientZip: '',
      recipientCountry: '',
      recipientPhone: '',
      packageType: '',
      weight: '',
      dimensions: '',
      value: '',
      serviceType: '',
      specialInstructions: '',
      pickupLocation: '',
      expectedDeliveryDate: ''
    });
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Register New Package</h1>
            <p className="text-gray-600">Create a new shipment and get your tracking number</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                3
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Sender Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sender Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="Enter sender's full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="senderEmail"
                      value={formData.senderEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="sender@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="senderPhone"
                      value={formData.senderPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <input
                      type="text"
                      name="senderCountry"
                      value={formData.senderCountry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="United States"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="senderAddress"
                      value={formData.senderAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="Enter street address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="senderCity"
                      value={formData.senderCity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
                    <input
                      type="text"
                      name="senderState"
                      value={formData.senderState}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="Enter state or province"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code *</label>
                    <input
                      type="text"
                      name="senderZip"
                      value={formData.senderZip}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="12345"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Recipient Information */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recipient Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="Enter recipient's full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="recipientEmail"
                      value={formData.recipientEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="recipient@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="recipientPhone"
                      value={formData.recipientPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <input
                      type="text"
                      name="recipientCountry"
                      value={formData.recipientCountry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="United States"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="recipientAddress"
                      value={formData.recipientAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="Enter street address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="recipientCity"
                      value={formData.recipientCity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
                    <input
                      type="text"
                      name="recipientState"
                      value={formData.recipientState}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="Enter state or province"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code *</label>
                    <input
                      type="text"
                      name="recipientZip"
                      value={formData.recipientZip}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="12345"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Package Details */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Package Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Package Type *</label>
                    <select
                      name="packageType"
                      value={formData.packageType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 text-gray-900 bg-white"
                      required
                    >
                      <option value="">Select package type</option>
                      <option value="envelope">Envelope</option>
                      <option value="box">Box</option>
                      <option value="tube">Tube</option>
                      <option value="pallet">Pallet</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 text-gray-900 bg-white"
                      required
                    >
                      <option value="">Select service type</option>
                      <option value="standard">Standard Delivery</option>
                      <option value="express">Express Delivery</option>
                      <option value="overnight">Overnight</option>
                      <option value="international">International</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (lbs) *</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="0.0"
                      step="0.1"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (L x W x H) *</label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="12 x 8 x 6 inches"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Declared Value ($) *</label>
                    <input
                      type="number"
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location *</label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="Enter pickup address or location"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery Date *</label>
                    <input
                      type="date"
                      name="expectedDeliveryDate"
                      value={formData.expectedDeliveryDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="Any special handling instructions..."
                      maxLength={500}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  step === 1 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled={step === 1}
              >
                Previous
              </button>
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Registering...
                    </>
                  ) : (
                    <>
                      <i className="ri-check-line mr-2"></i>
                      Register Package
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Success Modal */}
          <ConfirmModal
            isOpen={showSuccessModal}
            title="Registration Successful!"
            message={
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-semibold mb-2 flex items-center">
                    <i className="ri-checkbox-circle-line mr-2 text-xl"></i>
                    Your package registration has been submitted successfully!
                  </p>
                  <p className="text-green-700 text-sm mt-2">
                    Your package registration is pending review. Our team will process it and assign a tracking number.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-semibold mb-3 flex items-center">
                    <i className="ri-phone-line mr-2"></i>
                    Contact DML Logistics for Package Pickup
                  </p>
                  <p className="text-blue-700 text-sm mb-3">
                    Please contact DML Logistics to arrange for package pickup or drop-off at our facility. Our team will review your registration and assign a tracking number once the package is received.
                  </p>
                  <div className="text-blue-700 text-sm">
                    <div className="flex items-center">
                      <i className="ri-mail-fill mr-2"></i>
                      <span><strong>Email:</strong> <a href="mailto:Contact@dmllogisticsxpress.com" className="underline hover:text-blue-900">Contact@dmllogisticsxpress.com</a></span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm flex items-start">
                    <i className="ri-alert-line mr-2 mt-0.5 flex-shrink-0"></i>
                    <span>
                      <strong>Important:</strong> Your package will appear in the admin dashboard as "Pending Registration" with no tracking number. A tracking number will be assigned after our team processes your package and arranges pickup.
                    </span>
                  </p>
                </div>
              </div>
            }
            confirmText="Got it!"
            cancelText=""
            type="success"
            onConfirm={handleCloseSuccessModal}
            onCancel={handleCloseSuccessModal}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RegisterPackagePage;
