
import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import BusinessSolutionsSection from './components/TrackingSection';
import WhyChooseUs from './components/WhyChooseUs';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';

const Home = () => {
  useEffect(() => {
    // Update page title and meta description
    document.title = 'DML Logistics - Global Shipping & Logistics Solutions';
    
    // Add Schema.org JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "DML Logistics",
      "url": `${import.meta.env.VITE_SITE_URL || 'https://example.com'}`,
      "logo": `${import.meta.env.VITE_SITE_URL || 'https://example.com'}/logo.png`,
      "description": "DML Logistics delivers reliable, fast, and global logistics solutions including express delivery, freight shipping, international cargo, warehousing, and supply chain management.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1234 Logistics Boulevard, Suite 500",
        "addressLocality": "New York",
        "addressRegion": "NY",
        "postalCode": "10001",
        "addressCountry": "US"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-123-4567",
        "contactType": "customer service",
        "availableLanguage": "English"
      },
      "sameAs": [
        "https://www.facebook.com/dmllogistics",
        "https://www.twitter.com/dmllogistics",
        "https://www.linkedin.com/company/dmllogistics"
      ],
      "service": [
        {
          "@type": "Service",
          "name": "Express Shipping",
          "description": "Fast delivery services with real-time tracking"
        },
        {
          "@type": "Service", 
          "name": "Freight Services",
          "description": "Comprehensive freight and cargo solutions"
        },
        {
          "@type": "Service",
          "name": "Warehousing",
          "description": "Professional storage and distribution services"
        }
      ]
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
        <Hero />
        <ServicesSection />
        <BusinessSolutionsSection />
        <WhyChooseUs />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;