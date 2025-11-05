
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BusinessSolutionsSection = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    shippingVolume: '1-50 packages'
  });

  const handleInputChange = (e: React.TargetEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to contact page for quote requests
    window.location.href = '/contact';
  };

  return (
    <section className="py-12 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Business Solutions */}
          <div>
            <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-black lg:text-blue-600 mb-4 lg:mb-8">
              Business Solutions
            </h2>
            <p className="text-lg text-gray-600 mb-8 lg:mb-12 leading-relaxed">
              Streamline your logistics operations with our comprehensive business solutions designed to scale with your growth.
            </p>

            <div className="space-y-8">
              {/* Supply Chain Management */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="ri-bar-chart-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">
                    Supply Chain Management
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    End-to-end visibility and control over your supply chain operations with real-time analytics and reporting.
                  </p>
                </div>
              </div>

              {/* Fleet Management */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="ri-truck-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">
                    Fleet Management
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Optimize your delivery routes and manage your fleet with our advanced tracking and scheduling tools.
                  </p>
                </div>
              </div>

              {/* API Integration */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="ri-code-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">
                    API Integration
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Seamlessly integrate our services into your existing systems with our robust API and developer tools.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 lg:mt-12">
              <button className="whitespace-nowrap cursor-pointer font-medium transition-all duration-200 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-semibold">
                Explore Solutions
              </button>
              <Link to="/contact" className="whitespace-nowrap cursor-pointer font-medium transition-all duration-200 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-base font-semibold text-center">
                Contact Sales
              </Link>
            </div>
          </div>

          {/* Right Column - Get Started Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-6">
              Get Started Today
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter your company name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your business email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="shippingVolume" className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Shipping Volume
                </label>
                <select
                  id="shippingVolume"
                  name="shippingVolume"
                  value={formData.shippingVolume}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 appearance-none bg-white"
                  required
                >
                  <option value="1-50 packages">1-50 packages</option>
                  <option value="51-200 packages">51-200 packages</option>
                  <option value="201-500 packages">201-500 packages</option>
                  <option value="500+ packages">500+ packages</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full whitespace-nowrap cursor-pointer font-medium transition-all duration-200 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
              >
                Request Quote
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSolutionsSection;
