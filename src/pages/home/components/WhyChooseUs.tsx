
import React from 'react';

const WhyChooseUs = () => {

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-6">Why Choose DML?</h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to providing exceptional logistics services that exceed your expectations. Here's what sets us apart from the competition.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-blue-600 transition-colors duration-300">
              <i className="ri-time-line text-2xl md:text-3xl text-blue-600 group-hover:text-white transition-colors duration-300"></i>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Fast Delivery</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Express shipping options with same-day and next-day delivery available for urgent shipments.
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-blue-600 transition-colors duration-300">
              <i className="ri-shield-check-line text-2xl md:text-3xl text-blue-600 group-hover:text-white transition-colors duration-300"></i>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Secure & Safe</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Advanced security measures and insurance coverage to protect your valuable cargo during transit.
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-blue-600 transition-colors duration-300">
              <i className="ri-customer-service-line text-2xl md:text-3xl text-blue-600 group-hover:text-white transition-colors duration-300"></i>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">24/7 Support</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Round-the-clock customer service team ready to assist you with any questions or concerns.
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-blue-600 transition-colors duration-300">
              <i className="ri-money-dollar-circle-line text-2xl md:text-3xl text-blue-600 group-hover:text-white transition-colors duration-300"></i>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Competitive Rates</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Best-in-class pricing with transparent fees and no hidden charges for all shipping services.
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-blue-600 transition-colors duration-300">
              <i className="ri-global-line text-2xl md:text-3xl text-blue-600 group-hover:text-white transition-colors duration-300"></i>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Global Network</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Extensive worldwide coverage with reliable partners in over 50 countries and territories.
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-blue-600 transition-colors duration-300">
              <i className="ri-smartphone-line text-2xl md:text-3xl text-blue-600 group-hover:text-white transition-colors duration-300"></i>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Easy Tracking</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              User-friendly tracking system with real-time updates accessible from any device, anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
