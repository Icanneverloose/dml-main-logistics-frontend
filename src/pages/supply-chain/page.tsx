
import React from 'react';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';

const SupplyChain = () => {
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
                <h1 className="text-5xl lg:text-6xl font-bold mb-6">Supply Chain Management</h1>
                <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                  Transform your supply chain with our comprehensive end-to-end solutions. From procurement to final delivery, we optimize every step to reduce costs, improve efficiency, and enhance customer satisfaction.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="whitespace-nowrap cursor-pointer bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Optimize My Supply Chain
                  </button>
                  <button className="whitespace-nowrap cursor-pointer border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-colors">
                    View Case Studies
                  </button>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://readdy.ai/api/search-image?query=Global%20supply%20chain%20network%20visualization%20with%20connected%20nodes%2C%20world%20map%20showing%20logistics%20routes%2C%20modern%20digital%20supply%20chain%20management%20interface%20with%20data%20analytics%20and%20connectivity&width=600&height=400&seq=supply-chain-001&orientation=landscape"
                  alt="Global Supply Chain Network"
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
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Complete Supply Chain Solutions</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our integrated approach covers every aspect of your supply chain, from strategic planning to execution and continuous optimization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-search-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Strategic Planning</h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive supply chain analysis and strategic planning to identify optimization opportunities and develop long-term growth strategies.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-shopping-cart-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Procurement Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Vendor selection, contract negotiation, and supplier relationship management to ensure quality, cost-effectiveness, and reliability.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-factory-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Production Planning</h3>
                <p className="text-gray-600 leading-relaxed">
                  Demand forecasting, capacity planning, and production scheduling to optimize manufacturing efficiency and reduce lead times.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-truck-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Logistics Coordination</h3>
                <p className="text-gray-600 leading-relaxed">
                  Multi-modal transportation management, route optimization, and carrier selection for efficient goods movement worldwide.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-eye-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Visibility & Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Real-time visibility across your entire supply chain with advanced tracking, monitoring, and alert systems for proactive management.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-shield-check-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive risk assessment, contingency planning, and business continuity strategies to protect your supply chain operations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Supply Chain Optimization Benefits</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <i className="ri-money-dollar-circle-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost Reduction</h3>
                      <p className="text-gray-600">Reduce operational costs by up to 30% through process optimization, waste elimination, and efficient resource allocation.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <i className="ri-speed-up-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Faster Delivery</h3>
                      <p className="text-gray-600">Improve delivery times by 40% with optimized routing, better inventory management, and streamlined processes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <i className="ri-customer-service-2-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Customer Satisfaction</h3>
                      <p className="text-gray-600">Increase customer satisfaction scores through reliable delivery, better communication, and improved service quality.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <i className="ri-line-chart-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Scalable Growth</h3>
                      <p className="text-gray-600">Build a flexible supply chain infrastructure that scales with your business growth and adapts to market changes.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src="https://readdy.ai/api/search-image?query=Business%20analytics%20dashboard%20showing%20supply%20chain%20performance%20metrics%2C%20charts%20and%20graphs%20displaying%20cost%20savings%20and%20efficiency%20improvements%2C%20modern%20data%20visualization%20interface&width=600&height=400&seq=supply-metrics-001&orientation=landscape"
                  alt="Supply Chain Analytics Dashboard"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Supply Chain Optimization Process</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A systematic approach to transforming your supply chain operations for maximum efficiency and profitability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Assessment</h3>
                <p className="text-gray-600">Comprehensive analysis of your current supply chain operations, identifying bottlenecks and opportunities.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Strategy</h3>
                <p className="text-gray-600">Development of customized optimization strategies aligned with your business objectives and market requirements.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Implementation</h3>
                <p className="text-gray-600">Phased implementation of optimization solutions with minimal disruption to your ongoing operations.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Monitoring</h3>
                <p className="text-gray-600">Continuous monitoring and optimization to ensure sustained performance improvements and ROI.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">Transform Your Supply Chain Today</h2>
              <p className="text-xl text-blue-100 mb-8">
                Partner with DML Logistics to build a resilient, efficient, and cost-effective supply chain that drives your business success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="whitespace-nowrap cursor-pointer bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Start Your Assessment
                </button>
                <button className="whitespace-nowrap cursor-pointer border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-colors">
                  Contact Our Experts
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

export default SupplyChain;
