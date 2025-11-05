
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';

const Freight = () => {
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
                <h1 className="text-5xl lg:text-6xl font-bold mb-6">Air Cargo Services</h1>
                <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                  Experience the speed and reliability of our premium air freight solutions. We connect your business to global markets with our extensive network of cargo aircraft and strategic partnerships worldwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/contact" className="whitespace-nowrap cursor-pointer bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center">
                    Get Air Freight Quote
                  </Link>
                  <button className="whitespace-nowrap cursor-pointer border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-colors">
                    Track Your Cargo
                  </button>
                </div>
              </div>
              <div className="relative">
                <img 
                  alt="Cargo Aircraft in Flight" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  src="https://static.readdy.ai/image/20ad1bc5945550ba19ba043b533d395f/29387497156af3a765c15f8d48390cbc.png"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Comprehensive Air Freight Solutions</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From time-critical shipments to oversized cargo, our air freight services deliver your goods safely and efficiently across the globe.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-plane-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Express Air Freight</h3>
                <p className="text-gray-600 leading-relaxed">
                  Urgent shipments delivered within 24-48 hours to major global destinations. Perfect for time-sensitive cargo and emergency deliveries.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-global-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">International Cargo</h3>
                <p className="text-gray-600 leading-relaxed">
                  Seamless cross-border transportation with full customs clearance support and documentation handling for hassle-free international shipping.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  <i className="ri-shield-check-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Specialized Handling</h3>
                <p className="text-gray-600 leading-relaxed">
                  Temperature-controlled, hazardous materials, and oversized cargo handling with specialized equipment and certified professionals.
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
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Our Air Cargo Services</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <i className="ri-time-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Fastest Transit Times</h3>
                      <p className="text-gray-600">Direct flights and priority handling ensure your cargo reaches its destination in the shortest possible time.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <i className="ri-map-pin-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Network</h3>
                      <p className="text-gray-600">Access to 500+ destinations worldwide through our partnerships with leading airlines and cargo carriers.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <i className="ri-eye-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Tracking</h3>
                      <p className="text-gray-600">Monitor your shipment's progress with live updates from pickup to final delivery confirmation.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src="https://readdy.ai/api/search-image?query=Modern%20airport%20cargo%20terminal%20with%20loading%20operations%2C%20cargo%20containers%20being%20loaded%20into%20aircraft%2C%20professional%20logistics%20workers%20in%20safety%20gear%2C%20efficient%20air%20freight%20operations&width=600&height=400&seq=cargo-terminal-001&orientation=landscape"
                  alt="Air Cargo Terminal Operations"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Freight;
