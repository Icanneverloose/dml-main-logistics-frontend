
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../../../hooks/useAuth';

interface CalculatorForm {
  origin_country: string;
  destination_country: string;
  weight: string;
  weight_unit: 'kg' | 'lb';
  package_type: string;
  service_type: string;
}

const ShippingCalculatorPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/signin', { replace: true });
    }
  }, [user, loading, navigate]);

  const [formData, setFormData] = useState<CalculatorForm>({
    origin_country: '',
    destination_country: '',
    weight: '',
    weight_unit: 'kg',
    package_type: 'standard',
    service_type: 'standard'
  });

  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [estimatedDays, setEstimatedDays] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset calculation when form changes
    setCalculatedCost(null);
    setEstimatedDays(null);
  };

  const calculateShippingCost = () => {
    if (!formData.origin_country || !formData.destination_country || !formData.weight) {
      return;
    }

    setIsCalculating(true);

    // Simulate API call delay
    setTimeout(() => {
      // Convert weight to kg for calculation
      const weightInKg = formData.weight_unit === 'lb' 
        ? parseFloat(formData.weight) * 0.453592 
        : parseFloat(formData.weight);

      // Base cost per kg
      let baseCostPerKg = 5; // $5 per kg base rate

      // Country multiplier (international vs domestic)
      const isInternational = formData.origin_country.toLowerCase() !== formData.destination_country.toLowerCase();
      const countryMultiplier = isInternational ? 2.5 : 1;

      // Service type multiplier
      const serviceMultipliers: Record<string, number> = {
        'standard': 1,
        'express': 1.8,
        'overnight': 2.5,
        'economy': 0.7
      };
      const serviceMultiplier = serviceMultipliers[formData.service_type] || 1;

      // Package type multiplier
      const packageMultipliers: Record<string, number> = {
        'standard': 1,
        'fragile': 1.5,
        'perishable': 1.8,
        'hazardous': 2.5,
        'oversized': 1.3
      };
      const packageMultiplier = packageMultipliers[formData.package_type] || 1;

      // Minimum charge
      const minimumCharge = 10;

      // Calculate cost
      const calculated = Math.max(
        minimumCharge,
        weightInKg * baseCostPerKg * countryMultiplier * serviceMultiplier * packageMultiplier
      );

      // Calculate estimated days
      let days = 3; // Base days
      if (isInternational) days += 2;
      if (formData.service_type === 'express') days = Math.max(2, days - 1);
      if (formData.service_type === 'overnight') days = 1;
      if (formData.service_type === 'economy') days += 3;

      setCalculatedCost(Math.round(calculated * 100) / 100);
      setEstimatedDays(days);
      setIsCalculating(false);
    }, 500);
  };

  const isFormValid = formData.origin_country && formData.destination_country && formData.weight && parseFloat(formData.weight) > 0;

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shipping Cost Calculator</h1>
          <p className="text-gray-600">Calculate estimated shipping costs and delivery times for your shipment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Shipment Details</h2>
              
              <div className="space-y-4">
                {/* Origin Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Origin Country *
                  </label>
                  <input
                    type="text"
                    name="origin_country"
                    value={formData.origin_country}
                    onChange={handleChange}
                    placeholder="e.g., United States"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>

                {/* Destination Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination Country *
                  </label>
                  <input
                    type="text"
                    name="destination_country"
                    value={formData.destination_country}
                    onChange={handleChange}
                    placeholder="e.g., United Kingdom"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>

                {/* Weight */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight *
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="0.1"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      name="weight_unit"
                      value={formData.weight_unit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                    </select>
                  </div>
                </div>

                {/* Package Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Type *
                  </label>
                  <select
                    name="package_type"
                    value={formData.package_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="standard">Standard</option>
                    <option value="fragile">Fragile</option>
                    <option value="perishable">Perishable</option>
                    <option value="hazardous">Hazardous</option>
                    <option value="oversized">Oversized</option>
                  </select>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type *
                  </label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="economy">Economy (5-7 days)</option>
                    <option value="standard">Standard (3-5 days)</option>
                    <option value="express">Express (2-3 days)</option>
                    <option value="overnight">Overnight (1 day)</option>
                  </select>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={calculateShippingCost}
                  disabled={!isFormValid || isCalculating}
                  className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculating ? (
                    <span className="flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Calculating...
                    </span>
                  ) : (
                    <>
                      <i className="ri-calculator-line mr-2"></i>
                      Calculate Shipping Cost
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Estimated Quote</h2>
              
              {calculatedCost !== null ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl font-bold text-orange-600">
                        ${calculatedCost.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Shipping Cost</p>
                  </div>

                  <div className="pt-4 border-t border-orange-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                        <i className="ri-time-line text-orange-600 text-xl"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estimated Delivery</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {estimatedDays} {estimatedDays === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-orange-200">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <span className="font-medium">{formData.weight} {formData.weight_unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Package Type:</span>
                        <span className="font-medium capitalize">{formData.package_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="font-medium capitalize">{formData.service_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Route:</span>
                        <span className="font-medium">
                          {formData.origin_country === formData.destination_country ? 'Domestic' : 'International'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => window.location.href = '/dashboard/register-package'}
                    className="w-full bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors border-2 border-orange-600"
                  >
                    Register Shipment
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="ri-calculator-line text-4xl text-orange-300 mb-4"></i>
                  <p className="text-gray-600 text-sm">
                    Fill in the form and click "Calculate" to get an estimated shipping cost and delivery time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            <i className="ri-information-line mr-2 text-blue-600"></i>
            About Our Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-medium mb-1">Base Rate:</p>
              <p>$5 per kilogram (minimum $10)</p>
            </div>
            <div>
              <p className="font-medium mb-1">International Shipping:</p>
              <p>2.5x domestic rate</p>
            </div>
            <div>
              <p className="font-medium mb-1">Service Types:</p>
              <p>Economy (0.7x), Standard (1x), Express (1.8x), Overnight (2.5x)</p>
            </div>
            <div>
              <p className="font-medium mb-1">Special Handling:</p>
              <p>Fragile (+50%), Perishable (+80%), Hazardous (+150%), Oversized (+30%)</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            <strong>Note:</strong> This is an estimated quote. Final pricing may vary based on actual dimensions, customs fees, and other factors. 
            Contact our support team for exact pricing.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShippingCalculatorPage;

