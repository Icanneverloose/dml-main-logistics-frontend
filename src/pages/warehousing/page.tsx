
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';

const Warehousing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-6">Smart Warehousing Solutions</h1>
                <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                  State-of-the-art warehouse facilities equipped with advanced automation, climate control, and security systems. Our strategic locations ensure optimal distribution efficiency for your supply chain operations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="whitespace-nowrap cursor-pointer bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Tour Our Facilities
                  </button>
                  <Link to="/contact" className="whitespace-nowrap cursor-pointer border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-colors text-center">
                    Get Storage Quote
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://readdy.ai/api/search-image?query=Modern%20automated%20warehouse%20interior%20with%20robotic%20systems%2C%20high-tech%20inventory%20management%2C%20organized%20storage%20racks%2C%20professional%20logistics%20facility%20with%20LED%20lighting%20and%20clean%20industrial%20design&width=600&height=400&seq=warehouse-modern-001&orientation=landscape"
                  alt="Modern Warehouse Facility"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Comprehensive Warehouse Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From inventory management to order fulfillment, our warehousing solutions are designed to optimize your logistics operations and reduce costs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-database-2-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Inventory Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Real-time inventory tracking with automated stock level monitoring, cycle counting, and advanced WMS integration for complete visibility.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-box-3-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Fulfillment</h3>
                <p className="text-gray-600 leading-relaxed">
                  Efficient pick, pack, and ship operations with same-day processing capabilities and multi-channel order management systems.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-shield-check-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Storage</h3>
                <p className="text-gray-600 leading-relaxed">
                  24/7 security monitoring, climate-controlled environments, and specialized storage for hazardous materials and high-value goods.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-robot-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Automation Technology</h3>
                <p className="text-gray-600 leading-relaxed">
                  Robotic picking systems, automated sorting, and AI-powered optimization to increase efficiency and reduce operational costs.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-line-chart-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Analytics & Reporting</h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive performance metrics, cost analysis, and predictive analytics to optimize your warehouse operations continuously.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-truck-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Distribution Services</h3>
                <p className="text-gray-600 leading-relaxed">
                  Integrated transportation management with last-mile delivery options and cross-docking capabilities for faster distribution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://readdy.ai/api/search-image?query=Warehouse%20workers%20using%20tablets%20and%20scanning%20equipment%2C%20modern%20logistics%20technology%20in%20action%2C%20professional%20inventory%20management%20with%20barcode%20scanners%20and%20digital%20systems&width=600&height=400&seq=warehouse-tech-001&orientation=landscape"
                  alt="Warehouse Technology Operations"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Advanced Warehouse Technology</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <i className="ri-qr-code-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">RFID & Barcode Systems</h3>
                      <p className="text-gray-600">Advanced tracking technology ensures 99.9% inventory accuracy with real-time location updates.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <i className="ri-cloud-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Cloud-Based WMS</h3>
                      <p className="text-gray-600">Access your warehouse data from anywhere with our secure, scalable warehouse management system.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <i className="ri-settings-3-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">API Integration</h3>
                      <p className="text-gray-600">Seamless integration with your existing ERP, e-commerce, and business management systems.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">Ready to Optimize Your Warehouse Operations?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Let our experts design a custom warehousing solution that meets your specific business requirements and growth objectives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="whitespace-nowrap cursor-pointer bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Schedule Consultation
                </button>
                <button className="whitespace-nowrap cursor-pointer border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-colors">
                  Download Brochure
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Warehousing;
