
import React, { useEffect } from 'react';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import { Link } from 'react-router-dom';

const News = () => {
  useEffect(() => {
    // Update page title and meta description
    document.title = 'Latest News & Updates - DML Logistics Industry Insights';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stay informed about DML Logistics latest innovations, partnerships, achievements, and industry-leading developments in global logistics solutions. Read breaking news, company updates, and logistics industry insights.');
    }

    // Add Schema.org JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "DML Logistics News & Updates",
      "description": "Latest news, innovations, and industry insights from DML Logistics",
      "url": `${import.meta.env.VITE_SITE_URL || 'https://example.com'}/news`,
      "publisher": {
        "@type": "Organization",
        "name": "DML Logistics"
      },
      "blogPost": [
        {
          "@type": "BlogPosting",
          "headline": "DML Logistics Launches Revolutionary AI-Powered Route Optimization Platform",
          "datePublished": "2025-01-22",
          "author": {
            "@type": "Organization",
            "name": "DML Logistics"
          }
        }
      ]
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const newsArticles = [
    {
      id: 1,
      title: "DML Logistics Launches Revolutionary AI-Powered Route Optimization Platform",
      excerpt: "Our groundbreaking artificial intelligence system reduces delivery times by 35% and cuts fuel consumption by 40%, setting new industry standards for sustainable logistics operations.",
      date: "January 22, 2025",
      category: "Technology Innovation",
      image: "https://readdy.ai/api/search-image?query=Advanced%20AI%20technology%20dashboard%20for%20logistics%20route%20optimization%2C%20futuristic%20interface%20with%20real-time%20data%20analytics%2C%20modern%20blue%20and%20white%20design%20with%20digital%20maps%20and%20efficiency%20metrics&width=400&height=250&seq=news-ai-platform-001&orientation=landscape",
      readTime: "4 min read"
    },
    {
      id: 2,
      title: "DML Logistics Expands Operations to South Korea with Seoul Distribution Hub",
      excerpt: "Strategic expansion into the South Korean market with a state-of-the-art 1.5 million square foot distribution center in Seoul, serving the growing e-commerce demand in Asia-Pacific region.",
      date: "September 15, 2025",
      category: "Global Expansion",
      image: "https://readdy.ai/api/search-image?query=Modern%20logistics%20distribution%20center%20in%20Seoul%20South%20Korea%20with%20DML%20branding%2C%20advanced%20warehouse%20facility%20with%20Korean%20cityscape%20background%2C%20professional%20architecture%20and%20loading%20docks&width=400&height=250&seq=news-south-korea-expansion-001&orientation=landscape",
      readTime: "5 min read"
    },
    {
      id: 3,
      title: "Advanced Anti-Fraud Security System Protects Customer Shipments",
      excerpt: "DML Logistics implements cutting-edge blockchain-based security measures and AI fraud detection to prevent package theft and ensure 99.9% secure delivery rates across all operations.",
      date: "September 8, 2025",
      category: "Security & Fraud Prevention",
      image: "https://readdy.ai/api/search-image?query=Advanced%20security%20system%20for%20logistics%20with%20blockchain%20technology%2C%20digital%20security%20shields%20protecting%20packages%2C%20modern%20cybersecurity%20interface%20with%20fraud%20detection%20analytics&width=400&height=250&seq=news-fraud-prevention-001&orientation=landscape",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "DML Logistics Opens European Operations Center in Romania",
      excerpt: "New regional headquarters in Bucharest establishes DML as a major player in Eastern European logistics, providing comprehensive supply chain solutions across the Balkans and Central Europe.",
      date: "August 28, 2025",
      category: "European Expansion",
      image: "https://readdy.ai/api/search-image?query=Professional%20logistics%20headquarters%20building%20in%20Bucharest%20Romania%20with%20DML%20Logistics%20signage%2C%20modern%20corporate%20architecture%20with%20European%20business%20district%20background&width=400&height=250&seq=news-romania-expansion-001&orientation=landscape",
      readTime: "4 min read"
    },
    {
      id: 5,
      title: "Zero-Tolerance Fraud Prevention Initiative Launches Globally",
      excerpt: "Comprehensive anti-fraud program includes real-time package monitoring, biometric verification, and partnership with international law enforcement to eliminate logistics-related fraud.",
      date: "August 20, 2025",
      category: "Security & Fraud Prevention",
      image: "https://readdy.ai/api/search-image?query=Global%20security%20network%20for%20logistics%20fraud%20prevention%2C%20international%20cooperation%20symbols%20with%20digital%20security%20elements%2C%20professional%20law%20enforcement%20partnership%20visualization&width=400&height=250&seq=news-zero-tolerance-fraud-001&orientation=landscape",
      readTime: "5 min read"
    },
    {
      id: 6,
      title: "Italian Market Entry: DML Logistics Establishes Milan Distribution Network",
      excerpt: "Strategic partnership with Italian logistics providers creates comprehensive distribution network covering Northern Italy, enhancing European supply chain capabilities and customer reach.",
      date: "August 12, 2025",
      category: "European Expansion",
      image: "https://readdy.ai/api/search-image?query=Modern%20distribution%20center%20in%20Milan%20Italy%20with%20DML%20Logistics%20branding%2C%20Italian%20logistics%20facility%20with%20Alpine%20mountains%20background%2C%20professional%20warehouse%20architecture&width=400&height=250&seq=news-italy-expansion-001&orientation=landscape",
      readTime: "4 min read"
    },
    {
      id: 7,
      title: "AI-Powered Fraud Detection System Prevents $50M in Potential Losses",
      excerpt: "Revolutionary machine learning algorithms identify suspicious activities in real-time, protecting customers from package theft, identity fraud, and delivery scams with 99.8% accuracy rate.",
      date: "June 25, 2025",
      category: "Security & Fraud Prevention",
      image: "https://readdy.ai/api/search-image?query=AI%20fraud%20detection%20dashboard%20showing%20prevented%20losses%20and%20security%20analytics%2C%20advanced%20machine%20learning%20interface%20with%20threat%20detection%20visualization%20and%20financial%20protection%20metrics&width=400&height=250&seq=news-ai-fraud-detection-001&orientation=landscape",
      readTime: "6 min read"
    },
    {
      id: 8,
      title: "Customer Identity Verification System Enhances Package Security",
      excerpt: "Multi-factor authentication and biometric verification ensure only authorized recipients receive packages, reducing fraud incidents by 95% and increasing customer confidence.",
      date: "June 18, 2025",
      category: "Security & Fraud Prevention",
      image: "https://readdy.ai/api/search-image?query=Biometric%20verification%20system%20for%20package%20delivery%2C%20modern%20identity%20authentication%20technology%20with%20fingerprint%20and%20facial%20recognition%2C%20secure%20delivery%20confirmation%20interface&width=400&height=250&seq=news-identity-verification-001&orientation=landscape",
      readTime: "4 min read"
    },
    {
      id: 9,
      title: "Strategic Partnership with Global E-Commerce Giant Amazon Announced",
      excerpt: "DML Logistics becomes preferred logistics partner for Amazon's next-day delivery expansion across 14 new metropolitan areas, enhancing last-mile delivery capabilities.",
      date: "January 20, 2025",
      category: "Strategic Partnerships",
      image: "https://readdy.ai/api/search-image?query=Professional%20business%20partnership%20handshake%20with%20e-commerce%20and%20logistics%20symbols%2C%20modern%20corporate%20meeting%20room%20with%20digital%20commerce%20elements%20and%20global%20connectivity%20graphics&width=400&height=250&seq=news-amazon-partnership-001&orientation=landscape",
      readTime: "3 min read"
    },
    {
      id: 10,
      title: "DML Logistics Achieves Carbon Neutral Certification Across All Operations",
      excerpt: "Milestone achievement in sustainability journey with 100% renewable energy adoption, electric fleet expansion, and innovative carbon offset programs making us industry leaders.",
      date: "January 18, 2025",
      category: "Sustainability",
      image: "https://readdy.ai/api/search-image?query=Professional%20carbon%20neutral%20certification%20ceremony%20with%20green%20energy%20symbols%2C%20sustainable%20logistics%20facility%20with%20solar%20panels%20and%20wind%20turbines%2C%20eco-friendly%20corporate%20achievement%20with%20environmental%20awards%20and%20green%20technology&width=400&height=250&seq=news-carbon-neutral-updated-001&orientation=landscape",
      readTime: "5 min read"
    },
    {
      id: 11,
      title: "Record-Breaking Q4 2024 Performance: 5 Million Packages Delivered",
      excerpt: "DML Logistics achieves unprecedented holiday season success with 99.9% on-time delivery rate, processing over 5 million packages while maintaining exceptional service quality.",
      date: "January 15, 2025",
      category: "Company Performance",
      image: "https://readdy.ai/api/search-image?query=Busy%20modern%20logistics%20warehouse%20during%20peak%20season%20with%20automated%20sorting%20systems%2C%20packages%20moving%20on%20conveyor%20belts%2C%20efficient%20holiday%20shipping%20operations%20with%20professional%20workers&width=400&height=250&seq=news-q4-performance-001&orientation=landscape",
      readTime: "4 min read"
    },
    {
      id: 12,
      title: "New State-of-the-Art Distribution Center Opens in Texas",
      excerpt: "Our largest facility to date spans 2 million square feet, featuring advanced robotics, automated sorting systems, and capacity to process 100,000 packages daily.",
      date: "January 12, 2025",
      category: "Infrastructure Expansion",
      image: "https://readdy.ai/api/search-image?query=Massive%20modern%20distribution%20center%20exterior%20with%20DML%20Logistics%20branding%2C%20state-of-the-art%20warehouse%20facility%20with%20loading%20docks%20and%20professional%20architecture%20in%20Texas%20landscape&width=400&height=250&seq=news-texas-facility-001&orientation=landscape",
      readTime: "3 min read"
    },
    {
      id: 13,
      title: "DML Logistics Wins 'Logistics Innovation of the Year' Award",
      excerpt: "Industry recognition for our blockchain-based supply chain transparency platform that provides real-time visibility and enhanced security for global shipments.",
      date: "January 10, 2025",
      category: "Awards & Recognition",
      image: "https://readdy.ai/api/search-image?query=Professional%20awards%20ceremony%20with%20logistics%20innovation%20trophy%2C%20elegant%20corporate%20event%20setting%20with%20DML%20Logistics%20executives%20receiving%20industry%20recognition%20award&width=400&height=250&seq=news-innovation-award-001&orientation=landscape",
      readTime: "2 min read"
    },
    {
      id: 14,
      title: "International Expansion: DML Logistics Enters European Market",
      excerpt: "Strategic expansion into 8 European countries with new hubs in London, Frankfurt, and Amsterdam, bringing our premium logistics services to European businesses.",
      date: "January 8, 2025",
      category: "Global Expansion",
      image: "https://readdy.ai/api/search-image?query=European%20logistics%20expansion%20map%20showing%20DML%20operations%20across%20multiple%20countries%2C%20professional%20business%20growth%20visualization%20with%20shipping%20routes%20and%20distribution%20centers&width=400&height=250&seq=news-europe-expansion-001&orientation=landscape",
      readTime: "4 min read"
    },
    {
      id: 15,
      title: "Next-Generation Customer Portal Launches with Enhanced Features",
      excerpt: "Revolutionary customer experience platform featuring real-time GPS tracking, predictive delivery windows, photo confirmations, and AI-powered customer support chatbot.",
      date: "January 5, 2025",
      category: "Product Updates",
      image: "https://readdy.ai/api/search-image?query=Modern%20customer%20portal%20interface%20showing%20advanced%20package%20tracking%20features%2C%20clean%20user%20interface%20design%20with%20GPS%20maps%2C%20delivery%20notifications%20and%20blue%20color%20scheme&width=400&height=250&seq=news-customer-portal-001&orientation=landscape",
      readTime: "3 min read"
    },
    {
      id: 16,
      title: "DML Logistics Invests $50M in Electric Vehicle Fleet Expansion",
      excerpt: "Major investment in sustainable transportation with 500 new electric delivery vehicles, supporting our commitment to zero-emission logistics by 2027.",
      date: "January 3, 2025",
      category: "Sustainability Investment",
      image: "https://readdy.ai/api/search-image?query=Fleet%20of%20modern%20electric%20delivery%20trucks%20with%20DML%20Logistics%20branding%2C%20clean%20white%20vehicles%20at%20charging%20stations%2C%20sustainable%20transportation%20technology%20and%20eco-friendly%20logistics&width=400&height=250&seq=news-electric-fleet-001&orientation=landscape",
      readTime: "4 min read"
    },
    {
      id: 17,
      title: "Advanced Drone Delivery Pilot Program Launches in California",
      excerpt: "Pioneering last-mile delivery innovation with autonomous drone technology, targeting rural and hard-to-reach areas for faster, more efficient package delivery.",
      date: "December 30, 2024",
      category: "Innovation",
      image: "https://readdy.ai/api/search-image?query=Professional%20delivery%20drone%20in%20flight%20carrying%20package%20over%20California%20landscape%2C%20advanced%20autonomous%20technology%20for%20logistics%2C%20modern%20aerial%20delivery%20system%20with%20DML%20branding&width=400&height=250&seq=news-drone-delivery-001&orientation=landscape",
      readTime: "3 min read"
    },
    {
      id: 18,
      title: "DML Logistics Partners with Leading Universities for Logistics Research",
      excerpt: "Collaborative research initiatives with MIT and Stanford focusing on supply chain optimization, sustainable logistics, and next-generation transportation technologies.",
      date: "December 28, 2024",
      category: "Research & Development",
      image: "https://readdy.ai/api/search-image?query=University%20research%20laboratory%20with%20logistics%20technology%20development%2C%20students%20and%20professors%20working%20on%20supply%20chain%20innovation%20projects%2C%20academic%20partnership%20in%20modern%20research%20facility&width=400&height=250&seq=news-university-partnership-001&orientation=landscape",
      readTime: "4 min read"
    }
  ];

  const categories = ["All", "Technology Innovation", "Global Expansion", "Security & Fraud Prevention", "European Expansion", "Strategic Partnerships", "Sustainability", "Company Performance", "Infrastructure Expansion", "Awards & Recognition", "Product Updates"];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">Latest News & Updates</h1>
              <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Stay informed about DML Logistics&apos; latest innovations, partnerships, achievements, and industry-leading developments in global logistics solutions
              </p>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-12">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">Breaking News</span>
                    <span className="text-gray-600 text-sm">{newsArticles[0].date}</span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    {newsArticles[0].title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {newsArticles[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/news/article/${newsArticles[0].id}`}
                      className="whitespace-nowrap cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Read Full Article
                    </Link>
                    <span className="text-gray-500 text-sm">{newsArticles[0].readTime}</span>
                  </div>
                </div>
                <div className="relative h-64 lg:h-auto">
                  <img 
                    src={newsArticles[0].image}
                    alt={newsArticles[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`whitespace-nowrap cursor-pointer px-6 py-2 rounded-full font-medium transition-colors ${
                    category === "All" 
                      ? "bg-blue-600 text-white" 
                      : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsArticles.slice(1).map((article) => (
                <article key={article.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    <Link to={`/news/article/${article.id}`}>
                      <img 
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    </Link>
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <Link to={`/news/article/${article.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors cursor-pointer">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <Link 
                      to={`/news/article/${article.id}`}
                      className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">Stay Informed with DML Updates</h2>
              <p className="text-xl text-blue-100 mb-8">
                Subscribe to our newsletter for the latest industry insights, company news, and logistics innovations delivered directly to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button className="whitespace-nowrap cursor-pointer bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Subscribe Now
                </button>
              </div>
              <p className="text-sm text-blue-200 mt-4">
                Join 50,000+ logistics professionals. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default News;
