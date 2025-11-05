
import React, { useEffect } from 'react';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import { Link } from 'react-router-dom';

const Services = () => {

  useEffect(() => {
    // Update page title and meta description
    document.title = 'Logistics Services - Express Shipping, Freight & Warehousing | DML Logistics';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Comprehensive logistics services including express shipping, freight transport, home delivery, and warehouse solutions. Get competitive quotes for cargo services, air freight, sea freight, and supply chain management from DML Logistics.');
    }

    // Add Schema.org JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Logistics Services",
      "description": "Comprehensive logistics services including express shipping, freight transport, home delivery, and warehouse solutions.",
      "url": `${import.meta.env.VITE_SITE_URL || 'https://example.com'}/services`,
      "provider": {
        "@type": "Organization",
        "name": "DML Logistics"
      },
      "serviceType": [
        "Express Shipping",
        "Freight Services", 
        "Home Delivery",
        "Warehouse Solutions",
        "Supply Chain Management"
      ],
      "areaServed": {
        "@type": "Place",
        "name": "Global"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Logistics Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Express Shipping",
              "description": "Fast delivery services with real-time tracking and same-day options"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "Freight Services",
              "description": "Air freight, sea freight, land transport and customs clearance"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Warehouse Solutions",
              "description": "Inventory management, storage solutions, and order fulfillment"
            }
          }
        ]
      }
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">Our Services</h1>
              <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Comprehensive logistics solutions tailored to meet your business needs
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 lg:gap-12">
              {/* Cargo Services */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    alt="Cargo Services" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src="https://readdy.ai/api/search-image?query=Large%20cargo%20ship%20loaded%20with%20colorful%20shipping%20containers%20at%20modern%20port%20terminal%2C%20professional%20logistics%20operation%20with%20cranes%20and%20organized%20container%20stacks%2C%20blue%20sky%20background%2C%20industrial%20maritime%20setting&width=600&height=400&seq=cargo-services-001&orientation=landscape"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                      <i className="ri-ship-line text-2xl"></i>
                    </div>
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Cargo Services</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm lg:text-base">
                    International and domestic freight solutions with air, sea, and land transportation options. Complete customs clearance and competitive volume pricing.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <i className="ri-plane-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">Air Freight - Express delivery worldwide</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-ship-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">Sea Freight - Cost-effective ocean shipping</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-truck-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">Land Transport - Reliable ground delivery</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-file-text-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">Customs Clearance - Full documentation support</span>
                    </div>
                  </div>
                  <Link to="/contact" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
                    Get Quote <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
              </div>

              {/* Express Shipping */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    alt="Express Shipping" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src="https://readdy.ai/api/search-image?query=Fast%20delivery%20truck%20speeding%20on%20highway%20with%20motion%20blur%20effect%2C%20professional%20express%20shipping%20service%2C%20modern%20logistics%20vehicle%20with%20DML%20branding%2C%20dynamic%20transportation%20scene&width=600&height=400&seq=express-001&orientation=landscape"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                      <i className="ri-rocket-line text-2xl"></i>
                    </div>
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Express Shipping</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm lg:text-base">
                    Fast and reliable shipping solutions including standard, express, and same-day delivery options with transparent pricing and real-time tracking.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <i className="ri-time-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">Same-Day Delivery - Within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-flashlight-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">Express Options - 1-3 business days</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-map-pin-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">Real-Time Tracking - Live location updates</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-money-dollar-circle-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">Transparent Pricing - No hidden fees</span>
                    </div>
                  </div>
                  <Link to="/contact" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
                    Get Quote <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
              </div>

              {/* Home Delivery */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    alt="Home Delivery" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src="https://readdy.ai/api/search-image?query=Friendly%20delivery%20person%20at%20residential%20doorstep%20handing%20package%20to%20customer%2C%20professional%20home%20delivery%20service%2C%20suburban%20neighborhood%20setting%20with%20clean%20modern%20houses&width=600&height=400&seq=home-delivery-001&orientation=landscape"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                      <i className="ri-home-line text-2xl"></i>
                    </div>
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Home Delivery</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm lg:text-base">
                    Convenient doorstep delivery services with flexible delivery instructions, real-time notifications, and secure package handling for residential customers.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <i className="ri-door-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">Doorstep Delivery - Direct to your door</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-calendar-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">Flexible Scheduling - Choose your time slot</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-notification-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">SMS Notifications - Real-time updates</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-shield-check-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">Secure Handling - Safe and protected delivery</span>
                    </div>
                  </div>
                  <Link to="/contact" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
                    Get Quote <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
              </div>

              {/* Warehouse Solutions */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    alt="Warehouse Solutions" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src="https://readdy.ai/api/search-image?query=Modern%20automated%20warehouse%20interior%20with%20high-tech%20robotic%20systems%2C%20organized%20inventory%20shelves%2C%20professional%20logistics%20facility%20with%20clean%20industrial%20design%2C%20bright%20LED%20lighting&width=600&height=400&seq=warehouse-solutions-001&orientation=landscape"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                      <i className="ri-building-line text-2xl"></i>
                    </div>
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Warehouse Solutions</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm lg:text-base">
                    Comprehensive inventory management and storage solutions with advanced fulfillment services and B2B API integration for seamless operations.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <i className="ri-database-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">Inventory Management - Real-time stock control</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-archive-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">Storage Solutions - Secure facility storage</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-shopping-cart-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">Order Fulfillment - Pick, pack, and ship</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-code-line text-blue-600"></i>
                      <span className="text-gray-700 text-sm lg:text-base">API Integration - Seamless system connection</span>
                    </div>
                  </div>
                  <Link to="/contact" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
                    Get Quote <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Optimize Your Logistics?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Let our experts help you choose the right logistics solution for your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <button className="whitespace-nowrap cursor-pointer bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get Custom Quote
                </button>
              </Link>
              <Link to="/track">
                <button className="whitespace-nowrap cursor-pointer border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-colors">
                  Track Shipment
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
