
import React from 'react';
import { Link } from 'react-router-dom';

const ServicesSection = () => {

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-blue-600">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive logistics solutions designed to meet your business needs. From local deliveries to global freight, we've got you covered with professional, reliable service.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img 
                alt="Freight Services" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                src="https://static.readdy.ai/image/20ad1bc5945550ba19ba043b533d395f/049e5e6d75a574ec701148d664cba784.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-6 left-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <i className="ri-truck-line text-2xl"></i>
                </div>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                Freight Services
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Heavy cargo and freight transportation solutions with specialized equipment for oversized and bulk shipments.
              </p>
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Heavy Machinery Transport</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Bulk Cargo Handling</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Specialized Equipment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Route Planning</span>
                </div>
              </div>
              <Link to="/freight" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-200 cursor-pointer">
                Learn More <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img 
                alt="International Shipping" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                src="https://static.readdy.ai/image/20ad1bc5945550ba19ba043b533d395f/6e06a51091c1a9795eae5f47eda8390e.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-6 left-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <i className="ri-global-line text-2xl"></i>
                </div>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                International Shipment
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Global shipping solutions with customs clearance, documentation, and worldwide delivery networks.
              </p>
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Worldwide Coverage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Customs Documentation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Multi-Modal Transport</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Trade Compliance</span>
                </div>
              </div>
              <Link to="/services" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-200 cursor-pointer">
                Learn More <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
          
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img 
                alt="Cargo Services" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                src="https://readdy.ai/api/search-image?query=Large%20cargo%20ship%20loaded%20with%20colorful%20shipping%20containers%20at%20modern%20port%20terminal%2C%20professional%20logistics%20operation%20with%20cranes%20and%20organized%20container%20stacks%2C%20blue%20sky%20background%2C%20industrial%20maritime%20setting&width=600&height=400&seq=cargo-001&orientation=landscape"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-6 left-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <i className="ri-ship-line text-2xl"></i>
                </div>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                Cargo Services
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                International and domestic freight solutions with air, sea, and land transportation options. Complete customs clearance and volume pricing available.
              </p>
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Air Freight</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Sea Freight</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Land Transport</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Customs Clearance</span>
                </div>
              </div>
              <Link to="/services" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-200 cursor-pointer">
                Learn More <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
          
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img 
                alt="Express Shipping" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                src="https://static.readdy.ai/image/dc99573cbec11128c6b49bcf50435a93/31c9b1e91835303ac09285cd98ad3444.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-6 left-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <i className="ri-rocket-line text-2xl"></i>
                </div>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                Express Shipping
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Fast and reliable shipping solutions including standard, express, and same-day delivery options with transparent pricing and real-time tracking.
              </p>
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Same-Day Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Express Options</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Real-Time Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Transparent Pricing</span>
                </div>
              </div>
              <Link to="/services" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-200 cursor-pointer">
                Learn More <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
          
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img 
                alt="Home Delivery" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                src="https://static.readdy.ai/image/20ad1bc5945550ba19ba043b533d395f/3fc491ce85abb5c18ed533d6f8c3e3fa.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-6 left-7">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <i className="ri-home-line text-2xl"></i>
                </div>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                Home Delivery
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Convenient doorstep delivery services with flexible delivery instructions, real-time notifications, and secure package handling for residential customers.
              </p>
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Doorstep Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Flexible Scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">SMS Notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Secure Handling</span>
                </div>
              </div>
              <Link to="/services" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-200 cursor-pointer">
                Learn More <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
          
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img 
                alt="Warehouse Solutions" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                src="https://readdy.ai/api/search-image?query=Modern%20automated%20warehouse%20interior%20with%20high-tech%20robotic%20systems%2C%20organized%20inventory%20shelves%2C%20professional%20logistics%20facility%20with%20clean%20industrial%20design%2C%20bright%20LED%20lighting&width=600&height=400&seq=warehouse-001&orientation=landscape"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-6 left-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <i className="ri-building-line text-2xl"></i>
                </div>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                Warehouse Solutions
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Comprehensive inventory management and storage solutions with advanced fulfillment services and B2B API integration for seamless operations.
              </p>
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Inventory Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Storage Solutions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">Order Fulfillment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">API Integration</span>
                </div>
              </div>
              <Link to="/services" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-200 cursor-pointer">
                Learn More <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center bg-gray-900 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust DML Logistics for their shipping needs. Experience the difference of professional logistics services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <button className="whitespace-nowrap cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg">
                Get Quote
              </button>
            </Link>
            <Link to="/services">
              <button className="whitespace-nowrap cursor-pointer border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-all duration-200">
                View All Services
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
