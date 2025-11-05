
import React, { useEffect } from 'react';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';

const About = () => {
  useEffect(() => {
    // Update page title and meta description
    document.title = 'About DML Logistics - Leading Global Logistics Company';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about DML Logistics, a trusted logistics partner delivering excellence across the globe for over two decades. Discover our mission, vision, leadership team, and core values driving innovation in global shipping and supply chain solutions.');
    }

    // Add Schema.org JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About DML Logistics",
      "description": "Learn about DML Logistics, a trusted logistics partner delivering excellence across the globe for over two decades.",
      "url": `${import.meta.env.VITE_SITE_URL || 'https://example.com'}/about`,
      "mainEntity": {
        "@type": "Organization",
        "name": "DML Logistics",
        "foundingDate": "2010",
        "description": "DML Logistics has grown from a small local delivery service to a comprehensive logistics solution provider serving thousands of customers across multiple countries.",
        "mission": "To provide world-class logistics solutions that empower businesses to grow and succeed through exceptional service, innovative technology, and sustainable practices.",
        "vision": "To be the global leader in logistics innovation, setting new standards for reliability, efficiency, and customer satisfaction."
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
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">About DML Logistics</h1>
              <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Your trusted logistics partner delivering excellence across the globe for over two decades
              </p>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Founded in 2010, DML Logistics has grown from a small local delivery service to a comprehensive logistics solution provider. Our journey began with a simple mission: to make shipping and logistics accessible, reliable, and efficient for businesses of all sizes.
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Today, we serve thousands of customers across multiple countries, handling everything from small packages to large freight shipments. Our commitment to innovation and customer satisfaction has made us a trusted partner in the logistics industry.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  With state-of-the-art technology, a dedicated team of professionals, and a network of strategic partnerships, we continue to evolve and adapt to meet the changing needs of modern commerce.
                </p>
              </div>
              <div>
                <img 
                  alt="DML Logistics Team" 
                  className="w-full h-96 object-cover rounded-2xl shadow-xl"
                  src="https://static.readdy.ai/image/20ad1bc5945550ba19ba043b533d395f/03a9a6fd3c40c1793448f02d8cb4d01a.jpeg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission & Vision</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <i className="ri-target-line text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To provide world-class logistics solutions that empower businesses to grow and succeed. We are committed to delivering exceptional service, innovative technology, and sustainable practices that create value for our customers, employees, and communities.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <i className="ri-eye-line text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To be the global leader in logistics innovation, setting new standards for reliability, efficiency, and customer satisfaction. We envision a connected world where seamless logistics enable limitless possibilities for businesses and individuals alike.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Leadership Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet the experienced professionals driving DML Logistics forward
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="relative mb-6">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Professional%20business%20executive%20portrait%2C%20confident%20CEO%20in%20navy%20blue%20suit%2C%20modern%20corporate%20headshot%20with%20clean%20background%2C%20leadership%20photography%20style&width=300&height=300&seq=ceo-001&orientation=squarish"
                    alt="David Martinez - CEO"
                    className="w-48 h-48 object-cover rounded-2xl mx-auto shadow-lg group-hover:shadow-xl transition-shadow"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">David Martinez</h3>
                <p className="text-blue-600 font-medium mb-3">Chief Executive Officer</p>
                <p className="text-gray-600 text-sm">
                  20+ years in logistics and supply chain management. Former VP at Global Freight Solutions.
                </p>
              </div>
              <div className="text-center group">
                <div className="relative mb-6">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Professional%20business%20woman%20portrait%2C%20confident%20COO%20in%20business%20attire%2C%20modern%20corporate%20headshot%20with%20clean%20background%2C%20female%20executive%20photography&width=300&height=300&seq=coo-001&orientation=squarish"
                    alt="Sarah Chen - COO"
                    className="w-48 h-48 object-cover rounded-2xl mx-auto shadow-lg group-hover:shadow-xl transition-shadow"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah Chen</h3>
                <p className="text-blue-600 font-medium mb-3">Chief Operating Officer</p>
                <p className="text-gray-600 text-sm">
                  Expert in operational excellence and process optimization. MBA from Stanford Business School.
                </p>
              </div>
              <div className="text-center group">
                <div className="relative mb-6">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Professional%20technology%20executive%20portrait%2C%20confident%20CTO%20in%20business%20casual%20attire%2C%20modern%20corporate%20headshot%20with%20clean%20background%2C%20tech%20leadership%20photography&width=300&height=300&seq=cto-001&orientation=squarish"
                    alt="Michael Johnson - CTO"
                    className="w-48 h-48 object-cover rounded-2xl mx-auto shadow-lg group-hover:shadow-xl transition-shadow"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Michael Johnson</h3>
                <p className="text-blue-600 font-medium mb-3">Chief Technology Officer</p>
                <p className="text-gray-600 text-sm">
                  Technology innovator with expertise in logistics automation and AI-driven solutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Core Values</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-shield-check-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Reliability</h3>
                <p className="text-blue-100">
                  We deliver on our promises, every time, without exception.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-lightbulb-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                <p className="text-blue-100">
                  Continuously improving through technology and creative solutions.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-heart-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Customer Focus</h3>
                <p className="text-blue-100">
                  Your success is our success. We put customers at the center of everything.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-leaf-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Sustainability</h3>
                <p className="text-blue-100">
                  Committed to environmentally responsible logistics practices.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;