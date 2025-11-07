
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import TrackingResults from './components/TrackingResults';
import Footer from '../home/components/Footer';

const Track = () => {
  // SEO and metadata effect
  useEffect(() => {
    // Update page title and meta description
    document.title = 'Track Your Package - Real-time Shipment Tracking | DML Logistics';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Track your package with DML Logistics real-time tracking system. Get instant updates on shipment status, delivery progress, and estimated arrival times. Enter your tracking number for live package monitoring.');
    }

    // Add Schema.org JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Package Tracking System",
      "description": "Real-time package tracking system for DML Logistics shipments",
      "url": `${import.meta.env.VITE_SITE_URL || 'https://example.com'}/track`,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "provider": {
        "@type": "Organization",
        "name": "DML Logistics"
      }
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const [trackingId, setTrackingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  // Existing effect for handling URL search param
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setTrackingId(id);
      handleTrackingSearch(id);
    }
  }, [searchParams]);

  const handleTrackingSearch = async (id: string) => {
    if (!id.trim()) {
      setError('Please enter a tracking number');
      setTrackingData(null); // Clear previous results
      return;
    }

    setIsLoading(true);
    setError('');
    setTrackingData(null); // Clear previous results before new search
    
    try {
      // Import API dynamically to avoid circular dependency
      const { api } = await import('../../lib/api');
      
      const originalId = id.trim();
      const upperCaseId = originalId.toUpperCase();
      
      // Try to get full shipment details with case-insensitive search
      let shipmentDetails: any = null;
      let trackingIdUsed = originalId;
      
      // Try uppercase first (most common format)
      try {
        shipmentDetails = await api.getShipmentByTracking(upperCaseId) as any;
        trackingIdUsed = upperCaseId;
        console.log('Found shipment with uppercase tracking ID:', upperCaseId);
      } catch (err1) {
        // If uppercase fails, try original case
        try {
          shipmentDetails = await api.getShipmentByTracking(originalId) as any;
          trackingIdUsed = originalId;
          console.log('Found shipment with original case tracking ID:', originalId);
        } catch (err2) {
          console.log('Could not fetch shipment details with either case, will try status endpoint');
        }
      }
      
      // Get status history - try both cases
      let statusResponse: any = null;
      try {
        statusResponse = await api.getShipmentStatus(upperCaseId) as any;
        console.log('Status response (uppercase):', statusResponse);
        if (!statusResponse || (!statusResponse.success && !statusResponse.history)) {
          // Try original case if uppercase fails
          statusResponse = await api.getShipmentStatus(originalId) as any;
          console.log('Status response (original case):', statusResponse);
        }
      } catch (statusErr) {
        console.error('Could not fetch status history:', statusErr);
      }
      
      // Extract shipment data from various possible response formats
      const shipment = shipmentDetails?.shipment || shipmentDetails?.data || shipmentDetails;
      
      // If we have status history, use it
      if (statusResponse?.success && statusResponse.history && statusResponse.history.length > 0) {
        console.log('Status history received:', statusResponse.history);
        console.log('Shipment data received:', shipment);
        
        // Sort history by timestamp to ensure chronological order (oldest first)
        const sortedHistory = [...statusResponse.history].sort((a, b) => {
          const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return dateA - dateB;
        });
        
        console.log('Sorted history:', sortedHistory);
        console.log('Shipment current_location from API:', shipment?.current_location);
        
        // Get the latest status (last item in sorted array)
        const latestStatus = sortedHistory[sortedHistory.length - 1];
        
        // Find the most recent location from status history (work backwards from latest)
        // This ensures we use the last location updated from admin dashboard, not sender's address
        let currentLocation = 'Location not specified';
        for (let i = sortedHistory.length - 1; i >= 0; i--) {
          const logLocation = sortedHistory[i].location;
          console.log(`Checking history entry ${i}: location =`, logLocation);
          if (logLocation && typeof logLocation === 'string' && logLocation.trim() !== '') {
            currentLocation = logLocation.trim();
            console.log('Found location from history:', currentLocation);
            break;
          }
        }
        
        // Only fallback to shipment current_location if no location found in history
        // Never use sender_address as it's not the current location
        if (currentLocation === 'Location not specified') {
          console.log('No location found in history, checking shipment.current_location:', shipment?.current_location);
          if (shipment?.current_location && typeof shipment.current_location === 'string' && shipment.current_location.trim() !== '') {
            currentLocation = shipment.current_location.trim();
            console.log('Using shipment.current_location:', currentLocation);
          }
        }
        
        console.log('Final currentLocation:', currentLocation);
        
        // Map history to timeline format (like Gemini tracker)
        const timeline = sortedHistory.map((log: any, index: number) => {
          const isLast = index === sortedHistory.length - 1;
          const isDelivered = (latestStatus.status || shipment?.status || '').toLowerCase() === 'delivered';
          
          // Pass ISO timestamp directly to Timeline component for proper parsing
          return {
            status: log.status || 'Unknown',
            location: log.location || 'N/A',
            date: log.timestamp || 'N/A',
            time: '',
            completed: isLast ? isDelivered : true, // All previous entries completed, last only if delivered
            coordinates: log.coordinates,
            note: log.note
          };
        });
        
        console.log('Timeline data:', timeline);
        
        // Double-check: if timeline has locations, use the last one from timeline
        // This ensures we always use the location from admin status updates
        let finalCurrentLocation = currentLocation;
        if (timeline && timeline.length > 0) {
          // Find the last timeline entry with a valid location
          for (let i = timeline.length - 1; i >= 0; i--) {
            const timelineLocation = timeline[i].location;
            if (timelineLocation && timelineLocation !== 'N/A' && typeof timelineLocation === 'string' && timelineLocation.trim() !== '') {
              finalCurrentLocation = timelineLocation.trim();
              console.log('Using location from timeline entry:', finalCurrentLocation);
              break;
            }
          }
        }
        
        // Also check if statusResponse has current_location (from backend)
        if (finalCurrentLocation === 'Location not specified' && statusResponse?.current_location) {
          finalCurrentLocation = statusResponse.current_location;
          console.log('Using current_location from statusResponse:', finalCurrentLocation);
        }
        
        const trackingData = {
          trackingId: trackingIdUsed,
          status: latestStatus.status || shipment?.status || 'Unknown',
          estimatedDelivery: shipment?.estimated_delivery_date || shipment?.estimated_delivery || null,
          // Use the most recent location from status history/timeline (from admin updates)
          currentLocation: finalCurrentLocation,
          recipient: shipment?.receiver_name || shipment?.recipient_name || null,
          destination: shipment?.receiver_address || shipment?.destination || null,
          service: shipment?.package_type || shipment?.service_type || null,
          timeline: timeline
        };
        
        console.log('Final tracking data:', trackingData);
        setTrackingData(trackingData);
      } 
      // If we have shipment details but no status history, create basic timeline
      else if (shipment) {
        // Use current_location from shipment, but never use sender_address as fallback
        const locationForTimeline = shipment.current_location || shipment.receiver_address || 'N/A';
        
        const trackingData = {
          trackingId: trackingIdUsed,
          status: shipment.status || 'Registered',
          estimatedDelivery: shipment.estimated_delivery_date || shipment.estimated_delivery || null,
          // Use current_location from shipment, never fallback to sender_address
          currentLocation: shipment.current_location || 'Location not specified',
          recipient: shipment.receiver_name || shipment.recipient_name || null,
          destination: shipment.receiver_address || shipment.destination || null,
          service: shipment.package_type || shipment.service_type || null,
          timeline: [{
            status: shipment.status || 'Registered',
            location: locationForTimeline,
            date: shipment.date_registered ? new Date(shipment.date_registered).toLocaleDateString() : new Date().toLocaleDateString(),
            time: shipment.date_registered ? new Date(shipment.date_registered).toLocaleTimeString() : new Date().toLocaleTimeString(),
            completed: false,
            coordinates: null,
            note: 'Shipment registered'
          }]
        };
        setTrackingData(trackingData);
        console.log('Created tracking data from shipment details without status history');
      } 
      // If status response exists but no history, still try to use it
      else if (statusResponse?.success) {
        // Status endpoint returned success but no history - create minimal timeline
        const trackingData = {
          trackingId: trackingIdUsed,
          status: statusResponse.status || 'Registered',
          estimatedDelivery: null,
          currentLocation: statusResponse.location || 'Location not specified',
          recipient: null,
          destination: null,
          service: null,
          timeline: [{
            status: statusResponse.status || 'Registered',
            location: statusResponse.location || 'N/A',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            completed: false,
            coordinates: null,
            note: 'Shipment registered'
          }]
        };
        setTrackingData(trackingData);
        console.log('Created tracking data from status response without history');
      }
      // No data found at all
      else {
        console.error('Tracking failed: No shipment details or status found for:', originalId);
        setError('No tracking information found');
        setTrackingData(null);
      }
    } catch (error: any) {
      console.error('Tracking error:', error);
      setError(error.message || 'Please check your tracking number and try again.');
      setTrackingData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrackingSearch(trackingId);
  };

  const handleReset = () => {
    setTrackingId('');
    setTrackingData(null);
    setError('');
  };

  const faqData = [
    {
      question: "How do I track my package?",
      answer: "Simply enter your tracking number in the search box above. You'll get real-time updates on your package location and delivery status."
    },
    {
      question: "What if my tracking number isn't working?",
      answer: "Make sure you've entered the correct tracking number. If it still doesn't work, wait 24 hours after shipping or contact our customer service team."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery times vary by service type: Express (1-2 days), Standard (3-5 days), Economy (5-7 days). International shipments may take 7-14 days."
    },
    {
      question: "Can I change my delivery address?",
      answer: "Yes, you can change your delivery address before the package is out for delivery. Contact our customer service or use our online portal."
    },
    {
      question: "What happens if I'm not home for delivery?",
      answer: "We'll leave a delivery notice and attempt redelivery the next business day. You can also schedule a pickup at our nearest location."
    },
    {
      question: "How do I file a claim for lost or damaged packages?",
      answer: "Contact our customer service within 30 days of delivery. We'll investigate and process your claim according to our terms and conditions."
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full">
      {/* Hero Section with Enhanced Mobile Design */}
      <div 
        className="relative w-full overflow-hidden"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20logistics%20warehouse%20with%20trucks%20and%20packages%20being%20sorted%20in%20a%20clean%20professional%20environment%20with%20blue%20and%20white%20color%20scheme%2C%20minimalist%20design%2C%20high-tech%20atmosphere%2C%20bright%20lighting%2C%20organized%20workflow&width=1920&height=800&seq=track-hero-bg&orientation=landscape')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-indigo-900/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-2 sm:px-4 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <i className="ri-truck-line mr-2"></i>
              Real-time Package Tracking
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Track Your Package
            </h1>
            <p className="text-base sm:text-lg lg:text-2xl text-blue-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Enter your tracking number to get real-time updates on your shipment
            </p>
            
            {/* Enhanced Mobile-Friendly Tracking Form */}
            <div className="max-w-3xl mx-auto px-4">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-2 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl">
                  <div className="flex-1 relative">
                    <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                      <i className="ri-barcode-line text-gray-400 text-lg sm:text-xl"></i>
                    </div>
                    <input
                      type="text"
                      id="trackingId"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder="Enter tracking number (e.g., DML123456789)"
                      className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-4 sm:py-5 text-base sm:text-lg border-0 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-300/50 focus:outline-none text-gray-900 placeholder-gray-500 bg-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300/50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Track Package...
                      </>
                    ) : (
                      <>
                        <i className="ri-search-line mr-2"></i>
                        Track Package
                      </>
                    )}
                  </button>
                </div>
                {error && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-500/10 backdrop-blur-sm border border-red-300/30 rounded-lg">
                    <p className="text-red-200 text-center flex items-center justify-center text-sm sm:text-base">
                      <i className="ri-error-warning-line mr-2"></i>
                      {error}
                    </p>
                  </div>
                )}
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* Tracking Results */}
      {trackingData && (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="max-w-7xl mx-auto">
            <TrackingResults data={trackingData} onReset={handleReset} />
          </div>
        </div>
      )}

      {/* Enhanced Mobile-Friendly FAQ Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-20">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-6">Frequently Asked Questions</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about tracking, delivery, and our services.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <button
                  className="w-full px-3 sm:px-8 py-3 sm:py-6 text-left flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900 pr-3 sm:pr-4">{faq.question}</h3>
                  <div className={`w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                    <i className="ri-arrow-down-s-line text-blue-600 text-xs sm:text-base"></i>
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-3 sm:px-8 pb-3 sm:pb-6 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed pt-2 sm:pt-4 text-xs sm:text-base">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              <i className="ri-customer-service-line mr-2"></i>
              Contact Support
              <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Track;
