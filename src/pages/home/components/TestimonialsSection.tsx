
import React from 'react';

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our <span className="text-blue-600">Clients Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what businesses across industries say about their experience with DML Logistics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex gap-1 mb-6">
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
            </div>
            <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
              "DML Logistics has transformed our supply chain operations. Their real-time tracking and reliable delivery times have helped us maintain excellent customer satisfaction. The team is professional and always goes above and beyond."
            </blockquote>
            <div className="flex items-center gap-4">
              <img 
                alt="Sarah Johnson" 
                className="w-12 h-12 rounded-full object-cover"
                src="https://readdy.ai/api/search-image?query=Professional%20businesswoman%20in%20modern%20office%20setting%2C%20confident%20smile%2C%20corporate%20attire%2C%20clean%20background%20with%20soft%20lighting%2C%20headshot%20style%20portrait%20for%20testimonial&width=400&height=400&seq=testimonial-001&orientation=squarish"
              />
              <div>
                <div className="font-semibold text-gray-900">Sarah Johnson</div>
                <div className="text-sm text-gray-600">Operations Manager</div>
                <div className="text-sm text-blue-600 font-medium">TechStart Inc.</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex gap-1 mb-6">
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
            </div>
            <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
              "Working with DML Logistics for over 2 years now. Their international shipping capabilities and customs expertise have been invaluable for our global expansion. Highly recommend their services."
            </blockquote>
            <div className="flex items-center gap-4">
              <img 
                alt="Michael Chen" 
                className="w-12 h-12 rounded-full object-cover"
                src="https://readdy.ai/api/search-image?query=Professional%20Asian%20businessman%20in%20suit%2C%20confident%20expression%2C%20modern%20corporate%20environment%2C%20clean%20professional%20headshot%20for%20business%20testimonial%2C%20well-lit%20studio%20setting&width=400&height=400&seq=testimonial-002&orientation=squarish"
              />
              <div>
                <div className="font-semibold text-gray-900">Michael Chen</div>
                <div className="text-sm text-gray-600">Supply Chain Director</div>
                <div className="text-sm text-blue-600 font-medium">Global Retail Solutions</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex gap-1 mb-6">
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
              <i className="ri-star-fill text-yellow-400 text-lg"></i>
            </div>
            <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
              "The warehouse solutions provided by DML have streamlined our fulfillment process significantly. Their API integration made the transition seamless, and our delivery times improved by 40%."
            </blockquote>
            <div className="flex items-center gap-4">
              <img 
                alt="Emily Rodriguez" 
                className="w-12 h-12 rounded-full object-cover"
                src="https://readdy.ai/api/search-image?query=Professional%20Hispanic%20businesswoman%20entrepreneur%2C%20warm%20smile%2C%20modern%20office%20background%2C%20business%20casual%20attire%2C%20confident%20leadership%20portrait%20for%20testimonial&width=400&height=400&seq=testimonial-003&orientation=squarish"
              />
              <div>
                <div className="font-semibold text-gray-900">Emily Rodriguez</div>
                <div className="text-sm text-gray-600">Founder & CEO</div>
                <div className="text-sm text-blue-600 font-medium">E-commerce Plus</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-16">
          <h3 className="text-center text-lg font-semibold text-gray-600 mb-8">Trusted by Leading Companies</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
            <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-200">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <i className="ri-building-line text-2xl text-gray-600"></i>
              </div>
              <span className="text-sm font-medium text-gray-600">TechStart</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-200">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <i className="ri-store-line text-2xl text-gray-600"></i>
              </div>
              <span className="text-sm font-medium text-gray-600">Global Retail</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-200">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <i className="ri-shopping-cart-line text-2xl text-gray-600"></i>
              </div>
              <span className="text-sm font-medium text-gray-600">E-commerce Plus</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-200">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <i className="ri-settings-line text-2xl text-gray-600"></i>
              </div>
              <span className="text-sm font-medium text-gray-600">Manufacturing Co</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-200">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <i className="ri-heart-pulse-line text-2xl text-gray-600"></i>
              </div>
              <span className="text-sm font-medium text-gray-600">Health Solutions</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-200">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <i className="ri-car-line text-2xl text-gray-600"></i>
              </div>
              <span className="text-sm font-medium text-gray-600">Auto Parts Inc</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
