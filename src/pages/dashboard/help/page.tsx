
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../../../hooks/useAuth';

const HelpPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/signin', { replace: true });
    }
  }, [user, loading, navigate]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'All Topics', icon: 'ri-question-line' },
    { id: 'shipping', name: 'Shipping', icon: 'ri-truck-line' },
    { id: 'tracking', name: 'Tracking', icon: 'ri-map-pin-line' },
    { id: 'billing', name: 'Billing', icon: 'ri-money-dollar-circle-line' },
    { id: 'account', name: 'Account', icon: 'ri-user-line' },
    { id: 'technical', name: 'Technical', icon: 'ri-settings-line' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'shipping',
      question: 'How do I create a new shipment?',
      answer: 'To create a new shipment, go to the "Register Package" section in your dashboard. Fill out the sender and recipient information, package details, and select your preferred service type. Once submitted, you\'ll receive a tracking number.'
    },
    {
      id: 2,
      category: 'shipping',
      question: 'What are the size and weight limits for packages?',
      answer: 'Standard packages can weigh up to 70 lbs and have maximum dimensions of 108 inches in length and 165 inches in length plus girth. For larger items, please contact our freight services.'
    },
    {
      id: 3,
      category: 'tracking',
      question: 'How can I track my package?',
      answer: 'You can track your package using the tracking number provided when you created the shipment. Enter the tracking number in the "Track Shipment" section or on our main tracking page.'
    },
    {
      id: 4,
      category: 'tracking',
      question: 'Why isn\'t my tracking information updating?',
      answer: 'Tracking information typically updates within 24 hours of package movement. If your tracking hasn\'t updated for more than 48 hours, please contact our customer support team.'
    },
    {
      id: 5,
      category: 'billing',
      question: 'How are shipping costs calculated?',
      answer: 'Shipping costs are based on package weight, dimensions, destination, and service type. You can get an instant quote when creating a shipment or use our rate calculator.'
    },
    {
      id: 6,
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and for business accounts, we offer net payment terms.'
    },
    {
      id: 7,
      category: 'account',
      question: 'How do I update my account information?',
      answer: 'Go to "Profile & Settings" in your dashboard to update your personal information, address, and notification preferences.'
    },
    {
      id: 8,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, or go to the Security section in your Profile & Settings to change your password.'
    },
    {
      id: 9,
      category: 'technical',
      question: 'I\'m having trouble accessing my account',
      answer: 'Try clearing your browser cache and cookies, or try accessing your account from a different browser. If the problem persists, contact our technical support team.'
    },
    {
      id: 10,
      category: 'technical',
      question: 'Is there a mobile app available?',
      answer: 'Yes, we have mobile apps available for both iOS and Android. You can download them from the App Store or Google Play Store.'
    }
  ];

  const quickActions = [
    {
      title: 'Contact Support',
      description: 'Get help from our customer service team',
      icon: 'ri-customer-service-line',
      action: 'contact'
    },
    {
      title: 'Live Chat',
      description: 'Chat with a support representative',
      icon: 'ri-chat-3-line',
      action: 'chat'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: 'ri-play-circle-line',
      action: 'tutorials'
    },
    {
      title: 'Download Guides',
      description: 'Get PDF guides and documentation',
      icon: 'ri-download-line',
      action: 'download'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600">Find answers to common questions or get in touch with our support team</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Search for help topics, questions, or keywords..."
            />
            <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className={`${action.icon} text-blue-600 text-2xl`}></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600">{action.description}</p>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <i className={category.icon}></i>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8">
              <i className="ri-question-line text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <i className={`ri-arrow-${openFaq === faq.id ? 'up' : 'down'}-s-line text-gray-500`}></i>
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i className="ri-phone-line text-green-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-3">Call us for immediate assistance</p>
            <p className="text-blue-600 font-semibold">1-800-DML-SHIP</p>
            <p className="text-sm text-gray-500">Mon-Fri 8AM-8PM EST</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i className="ri-mail-line text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-3">Send us your questions</p>
            <p className="text-blue-600 font-semibold">support@dmllogistics.com</p>
            <p className="text-sm text-gray-500">Response within 24 hours</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i className="ri-chat-3-line text-purple-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-3">Chat with our support team</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer">
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HelpPage;
