import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPackage = () => {
  const [user, setUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Sender Details
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderAddress: '',
    senderCity: '',
    senderState: '',
    senderZip: '',
    
    // Recipient Details
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    recipientAddress: '',
    recipientCity: '',
    recipientState: '',
    recipientZip: '',
    
    // Package Details
    weight: '',
    length: '',
    width: '',
    height: '',
    packageType: 'parcel',
    value: '',
    description: '',
    
    // Service Selection
    serviceType: 'standard',
    insurance: false,
    signature: false,
    
    // Special Instructions
    instructions: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUser(user);
      // Pre-fill sender details
      setFormData(prev => ({
        ...prev,
        senderName: user.name || '',
        senderEmail: user.email || ''
      }));
    } else {
      navigate('/auth/signin');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate package registration
    setTimeout(() => {
      const trackingId = `DML-${Date.now()}`;
      setIsLoading(false);
      navigate(`/track?id=${trackingId}`);
    }, 2000);
  };

  const steps = [
    { number: 1, title: 'Sender Details', icon: 'ri-user-line' },
    { number: 2, title: 'Recipient Details', icon: 'ri-map-pin-line' },
    { number: 3, title: 'Package Info', icon: 'ri-package-line' },
    { number: 4, title: 'Review & Submit', icon: 'ri-check-line' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600" style={{ fontFamily: '"Pacifico", serif' }}>
              DML Logistics
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <i className={step.icon}></i>
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    Step {step.number}
                  </p>
                  <p className={`text-xs ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ml-6 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sender Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="senderEmail"
                    value={formData.senderEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="senderPhone"
                    value={formData.senderPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="senderAddress"
                    value={formData.senderAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="senderCity"
                    value={formData.senderCity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="senderState"
                    value={formData.senderState}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="senderZip"
                    value={formData.senderZip}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recipient Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="recipientEmail"
                    value={formData.recipientEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="recipientPhone"
                    value={formData.recipientPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="recipientAddress"
                    value={formData.recipientAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="recipientCity"
                    value={formData.recipientCity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="recipientState"
                    value={formData.recipientState}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="recipientZip"
                    value={formData.recipientZip}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Package Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Type</label>
                  <select
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="parcel">Parcel</option>
                    <option value="document">Document</option>
                    <option value="fragile">Fragile</option>
                    <option value="hazardous">Hazardous</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (lbs)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length (inches)</label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Width (inches)</label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height (inches)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Declared Value ($)</label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of package contents"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="standard">Standard Delivery (5-7 days)</option>
                    <option value="express">Express Delivery (2-3 days)</option>
                    <option value="overnight">Overnight Delivery</option>
                    <option value="same-day">Same Day Delivery</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="insurance"
                      name="insurance"
                      checked={formData.insurance}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="insurance" className="ml-3 text-sm text-gray-700 cursor-pointer">
                      Add Insurance Coverage (+$5.99)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="signature"
                      name="signature"
                      checked={formData.signature}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="signature" className="ml-3 text-sm text-gray-700 cursor-pointer">
                      Require Signature (+$2.99)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Shipment Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">From:</h4>
                    <p className="text-sm text-gray-600">
                      {formData.senderName}<br />
                      {formData.senderAddress}<br />
                      {formData.senderCity}, {formData.senderState} {formData.senderZip}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">To:</h4>
                    <p className="text-sm text-gray-600">
                      {formData.recipientName}<br />
                      {formData.recipientAddress}<br />
                      {formData.recipientCity}, {formData.recipientState} {formData.recipientZip}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Package:</h4>
                    <p className="text-sm text-gray-600">
                      Type: {formData.packageType}<br />
                      Weight: {formData.weight} lbs<br />
                      Dimensions: {formData.length}" x {formData.width}" x {formData.height}"<br />
                      Value: ${formData.value}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Service:</h4>
                    <p className="text-sm text-gray-600">
                      {formData.serviceType}<br />
                      {formData.insurance && 'Insurance: Yes\n'}
                      {formData.signature && 'Signature Required: Yes'}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special delivery instructions..."
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
            >
              <i className="ri-arrow-left-line mr-2"></i>Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap"
              >
                Next<i className="ri-arrow-right-line ml-2"></i>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Creating Shipment...
                  </>
                ) : (
                  <>
                    <i className="ri-check-line mr-2"></i>
                    Submit Shipment
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPackage;