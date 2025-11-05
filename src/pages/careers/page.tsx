
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';

const Careers = () => {
  useEffect(() => {
    // Update page title and meta description
    document.title = 'Careers at DML Logistics - Join Our Logistics Team';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Join DML Logistics team and build your career in the logistics industry. Explore job opportunities in operations, transportation, analytics, warehousing, and customer service. Competitive benefits and professional development opportunities.');
    }

    // Add Schema.org JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": "Careers at DML Logistics",
      "description": "Join DML Logistics team and build your career in the logistics industry with competitive benefits and professional development opportunities.",
      "url": `${import.meta.env.VITE_SITE_URL || 'https://example.com'}/careers`,
      "hiringOrganization": {
        "@type": "Organization",
        "name": "DML Logistics",
        "sameAs": `${import.meta.env.VITE_SITE_URL || 'https://example.com'}`
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US"
        }
      },
      "employmentType": "FULL_TIME",
      "industry": "Logistics and Transportation"
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Logistics Coordinator",
      department: "Operations",
      location: "New York, NY",
      type: "Full-time",
      experience: "3-5 years",
      description: "Lead coordination of complex logistics operations, manage client relationships, and optimize supply chain processes for maximum efficiency.",
      requirements: ["Bachelor's degree in Logistics or related field", "3+ years logistics experience", "Strong analytical skills", "Excellent communication abilities"]
    },
    {
      id: 2,
      title: "Fleet Operations Manager",
      department: "Transportation",
      location: "Los Angeles, CA",
      type: "Full-time",
      experience: "5-7 years",
      description: "Oversee fleet operations, manage driver schedules, ensure compliance with safety regulations, and optimize route planning for cost efficiency.",
      requirements: ["Transportation management experience", "DOT compliance knowledge", "Leadership skills", "Fleet management software proficiency"]
    },
    {
      id: 3,
      title: "Supply Chain Analyst",
      department: "Analytics",
      location: "Chicago, IL",
      type: "Full-time",
      experience: "2-4 years",
      description: "Analyze supply chain data, identify optimization opportunities, create performance reports, and support strategic decision-making processes.",
      requirements: ["Data analysis experience", "SQL and Excel proficiency", "Supply chain knowledge", "Problem-solving skills"]
    },
    {
      id: 4,
      title: "Warehouse Supervisor",
      department: "Warehousing",
      location: "Dallas, TX",
      type: "Full-time",
      experience: "3-5 years",
      description: "Supervise warehouse operations, manage inventory accuracy, lead team of warehouse associates, and ensure safety compliance.",
      requirements: ["Warehouse management experience", "Team leadership skills", "WMS software knowledge", "Safety certification preferred"]
    },
    {
      id: 5,
      title: "Customer Service Representative",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      experience: "1-3 years",
      description: "Provide exceptional customer support, handle shipment inquiries, resolve issues promptly, and maintain high customer satisfaction levels.",
      requirements: ["Customer service experience", "Communication skills", "Problem-solving abilities", "Logistics knowledge preferred"]
    },
    {
      id: 6,
      title: "Business Development Manager",
      department: "Sales",
      location: "Miami, FL",
      type: "Full-time",
      experience: "4-6 years",
      description: "Drive business growth through new client acquisition, develop strategic partnerships, and expand market presence in assigned territories.",
      requirements: ["Sales experience in logistics", "Relationship building skills", "Market analysis abilities", "Bachelor's degree preferred"]
    }
  ];

  const benefits = [
    {
      icon: "ri-heart-pulse-line",
      title: "Comprehensive Health Coverage",
      description: "Medical, dental, and vision insurance with company contribution to premiums"
    },
    {
      icon: "ri-money-dollar-circle-line",
      title: "Competitive Compensation",
      description: "Market-competitive salaries with performance-based bonuses and annual reviews"
    },
    {
      icon: "ri-time-line",
      title: "Work-Life Balance",
      description: "Flexible schedules, remote work options, and generous paid time off policies"
    },
    {
      icon: "ri-graduation-cap-line",
      title: "Professional Development",
      description: "Training programs, certification support, and tuition reimbursement opportunities"
    },
    {
      icon: "ri-shield-check-line",
      title: "Retirement Planning",
      description: "401(k) plan with company matching and financial planning resources"
    },
    {
      icon: "ri-team-line",
      title: "Inclusive Culture",
      description: "Diverse and inclusive workplace with employee resource groups and mentorship programs"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">Join Our Team</h1>
              <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
                Build your career with DML Logistics and be part of a dynamic team that's shaping the future of global logistics and supply chain solutions.
              </p>
              <Link to="/contact" className="whitespace-nowrap cursor-pointer bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                Contact HR Team
              </Link>
            </div>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose DML Logistics</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're committed to creating an environment where talented professionals can thrive, grow, and make a meaningful impact in the logistics industry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                    <i className={`${benefit.icon} text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Culture */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Company Culture</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <i className="ri-lightbulb-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation-Driven</h3>
                      <p className="text-gray-600">We encourage creative thinking and embrace new technologies to solve complex logistics challenges.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <i className="ri-team-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaborative Environment</h3>
                      <p className="text-gray-600">Cross-functional teamwork and open communication drive our success and foster professional growth.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <i className="ri-trophy-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Excellence Focus</h3>
                      <p className="text-gray-600">We strive for operational excellence and recognize achievements that contribute to our shared success.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src="https://readdy.ai/api/search-image?query=Diverse%20team%20of%20logistics%20professionals%20collaborating%20in%20modern%20office%20environment%2C%20happy%20employees%20working%20together%20on%20logistics%20projects%2C%20inclusive%20workplace%20culture%20with%20teamwork%20and%20innovation&width=600&height=400&seq=team-culture-001&orientation=landscape"
                  alt="DML Logistics Team Culture"
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

export default Careers;
