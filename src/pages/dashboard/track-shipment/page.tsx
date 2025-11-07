
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { api } from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';
import { generatePDFReceipt } from '../../../utils/pdfGenerator';
import { toast } from '../../../components/Toast';
import type { Shipment } from '../../../hooks/useShipments';
import Timeline from '../../track/components/Timeline';

const TrackShipmentPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/signin', { replace: true });
    }
  }, [user, loading, navigate]);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    setError('');
    setTrackingResult(null); // Clear previous results before new search
    
    try {
      const originalId = trackingNumber.trim();
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
        if (!statusResponse.success && !statusResponse.history) {
          // Try original case if uppercase fails
          statusResponse = await api.getShipmentStatus(originalId) as any;
        }
      } catch (statusErr) {
        console.log('Could not fetch status history:', statusErr);
      }
      
      // Extract shipment data from various possible response formats
      const shipment = shipmentDetails?.shipment || shipmentDetails?.data || shipmentDetails || {};
      
      // If we have status history, use it
      if (statusResponse?.success && statusResponse.history && statusResponse.history.length > 0) {
        // Sort history by timestamp to ensure chronological order (oldest first)
        const sortedHistory = [...statusResponse.history].sort((a, b) => {
          const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return dateA - dateB;
        });
        
        // Get the latest status (last item in sorted array)
        const latestStatus = sortedHistory[sortedHistory.length - 1];
        
        // Find the most recent location from status history (work backwards from latest)
        // This ensures we use the last location updated from admin dashboard, not sender's address
        let currentLocation = 'Location not specified';
        for (let i = sortedHistory.length - 1; i >= 0; i--) {
          const logLocation = sortedHistory[i].location;
          if (logLocation && typeof logLocation === 'string' && logLocation.trim() !== '') {
            currentLocation = logLocation.trim();
            break;
          }
        }
        // Only fallback to shipment current_location if no location found in history
        // Never use sender_address as it's not the current location
        if (currentLocation === 'Location not specified') {
          if (shipment.current_location && typeof shipment.current_location === 'string' && shipment.current_location.trim() !== '') {
            currentLocation = shipment.current_location.trim();
          }
          // Also check statusResponse for current_location
          else if (statusResponse?.current_location && typeof statusResponse.current_location === 'string' && statusResponse.current_location.trim() !== '') {
            currentLocation = statusResponse.current_location.trim();
          }
        }
        
        // Create timeline first to ensure we can extract location from it
        const timelineData = sortedHistory.map((log: any, index: number) => {
          const isLast = index === sortedHistory.length - 1;
          const isDelivered = (latestStatus.status || shipment.status || '').toLowerCase() === 'delivered';
          return {
            date: log.timestamp || 'N/A',
            time: '',
            status: log.status,
            location: log.location || 'N/A',
            description: log.note || `${log.status} at ${log.location || 'facility'}`,
            completed: isLast ? isDelivered : true
          };
        });
        
        // Double-check: if timeline has locations, use the last one from timeline
        // This ensures we always use the location from admin status updates
        let finalCurrentLocation = currentLocation;
        if (timelineData && timelineData.length > 0) {
          // Find the last timeline entry with a valid location
          for (let i = timelineData.length - 1; i >= 0; i--) {
            const timelineLocation = timelineData[i].location;
            if (timelineLocation && timelineLocation !== 'N/A' && typeof timelineLocation === 'string' && timelineLocation.trim() !== '') {
              finalCurrentLocation = timelineLocation.trim();
              break;
            }
          }
        }
        
        // Also check if statusResponse has current_location (from backend)
        if (finalCurrentLocation === 'Location not specified' && statusResponse?.current_location) {
          finalCurrentLocation = statusResponse.current_location;
        }
        
        setTrackingResult({
          trackingNumber: trackingIdUsed,
          status: latestStatus.status || shipment.status || 'Unknown',
          estimatedDelivery: shipment.estimated_delivery_date || null,
          // Use the most recent location from status history/timeline (from admin updates)
          currentLocation: finalCurrentLocation,
          sender: shipment.sender_name || 'N/A',
          recipient: shipment.receiver_name || 'N/A',
          service: shipment.package_type || 'Standard',
          weight: shipment.weight ? `${shipment.weight} kg` : 'N/A',
          timeline: timelineData
        });
      } 
      // If we have shipment details but no status history, create basic timeline
      else if (shipment && (shipmentDetails?.success || shipment.status || shipment.tracking_number)) {
        // Use current_location from shipment, never fallback to sender_address
        const locationForTimeline = shipment.current_location || 'N/A';
        
        setTrackingResult({
          trackingNumber: trackingIdUsed,
          status: shipment.status || 'Registered',
          estimatedDelivery: shipment.estimated_delivery_date || null,
          // Use current_location from shipment, never use sender_address
          currentLocation: shipment.current_location || 'Location not specified',
          sender: shipment.sender_name || 'N/A',
          recipient: shipment.receiver_name || 'N/A',
          service: shipment.package_type || 'Standard',
          weight: shipment.weight ? `${shipment.weight} kg` : 'N/A',
          timeline: [{
            date: shipment.date_registered ? new Date(shipment.date_registered).toLocaleDateString() : new Date().toLocaleDateString(),
            time: shipment.date_registered ? new Date(shipment.date_registered).toLocaleTimeString() : new Date().toLocaleTimeString(),
            status: shipment.status || 'Registered',
            location: locationForTimeline,
            description: 'Shipment registered'
          }]
        });
        console.log('Created tracking data from shipment details without status history');
      }
      // If status response exists but no history, still try to use it
      else if (statusResponse?.success) {
        setTrackingResult({
          trackingNumber: trackingIdUsed,
          status: statusResponse.status || 'Registered',
          estimatedDelivery: null,
          currentLocation: statusResponse.location || 'Location not specified',
          sender: 'N/A',
          recipient: 'N/A',
          service: 'Standard',
          weight: 'N/A',
          timeline: [{
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            status: statusResponse.status || 'Registered',
            location: statusResponse.location || 'N/A',
            description: 'Shipment registered'
          }]
        });
        console.log('Created tracking data from status response without history');
      }
      // No data found at all
      else {
        console.error('Tracking failed: No shipment details or status found for:', originalId);
        setError('Shipment not found. Please check your tracking number.');
        setTrackingResult(null);
      }
    } catch (error: any) {
      console.error('Tracking error:', error);
      setError(error.message || 'Failed to track shipment. Please try again.');
      setTrackingResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'in transit':
        return 'text-blue-600 bg-blue-100';
      case 'out for delivery':
        return 'text-orange-600 bg-orange-100';
      case 'exception':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    if (!trackingResult || downloadingPdf) return;
    
    setDownloadingPdf(true);
    try {
      // Try to fetch full shipment details for better PDF
      let shipmentDetails: any = null;
      try {
        shipmentDetails = await api.getShipmentByTracking(trackingResult.trackingNumber) as any;
      } catch (err) {
        console.log('Could not fetch full shipment details, using available data');
      }

      // Use fetched shipment details or convert tracking result to Shipment format
      const firstTimelineEvent = trackingResult.timeline?.[0];
      const shipmentData = shipmentDetails?.shipment || shipmentDetails || {};
      
      const shipment: Shipment = {
        id: trackingResult.trackingNumber,
        tracking_number: trackingResult.trackingNumber,
        sender_name: shipmentData.sender_name || trackingResult.sender || 'Sender',
        sender_email: shipmentData.sender_email || '',
        sender_phone: shipmentData.sender_phone || '',
        sender_address: shipmentData.sender_address || trackingResult.currentLocation,
        receiver_name: shipmentData.receiver_name || trackingResult.recipient || 'Recipient',
        receiver_email: shipmentData.receiver_email || '',
        receiver_phone: shipmentData.receiver_phone || '',
        receiver_address: shipmentData.receiver_address || trackingResult.currentLocation,
        package_type: shipmentData.package_type || trackingResult.service || 'Standard',
        weight: shipmentData.weight || 0,
        weight_unit: shipmentData.weight_unit || 'kg',
        shipment_cost: shipmentData.shipment_cost || 0,
        status: trackingResult.status,
        date_registered: shipmentData.date_registered || 
          (firstTimelineEvent ? `${firstTimelineEvent.date} ${firstTimelineEvent.time}` : new Date().toISOString()),
        estimated_delivery_date: shipmentData.estimated_delivery_date || trackingResult.estimatedDelivery || undefined,
        destination_country: shipmentData.destination_country || undefined,
        origin_country: shipmentData.origin_country || undefined,
        pdf_url: shipmentData.pdf_url || undefined,
        qr_url: shipmentData.qr_url || undefined
      };

      // Generate and download PDF
      const pdfBlob = generatePDFReceipt(shipment);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${trackingResult.trackingNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('PDF receipt downloaded successfully');
    } catch (error: any) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Track Your Shipment</h1>
          
          {/* Tracking Form */}
          <form onSubmit={handleTrack} className="mb-8">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tracking number (e.g., DML123456789)"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Tracking...' : 'Track Package'}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 flex items-center">
                <i className="ri-error-warning-line mr-2"></i>
                {error}
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Searching for your package...</p>
            </div>
          )}

          {/* Tracking Results */}
          {trackingResult && !isLoading && (
            <div className="space-y-6">
              {/* Package Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Tracking Number</h3>
                    <p className="text-lg font-semibold text-gray-900">{trackingResult.trackingNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingResult.status)}`}>
                      {trackingResult.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Delivery</h3>
                    <p className="text-lg font-semibold text-gray-900">{trackingResult.estimatedDelivery}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Current Location</h3>
                    <p className="text-lg font-semibold text-gray-900">{trackingResult.currentLocation}</p>
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Type:</span>
                      <span className="font-medium">{trackingResult.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">{trackingResult.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sender:</span>
                      <span className="font-medium">{trackingResult.sender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recipient:</span>
                      <span className="font-medium">{trackingResult.recipient}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <p className="font-medium text-lg">{trackingResult.estimatedDelivery}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery Address:</span>
                      <p className="font-medium">123 Main Street<br />Chicago, IL 60601</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Tracking History</h3>
                <Timeline 
                  events={trackingResult.timeline.map((event: any) => ({
                    status: event.status || 'Unknown',
                    location: event.location || 'N/A',
                    date: event.date || 'N/A',
                    time: event.time || 'N/A',
                    completed: event.completed !== undefined ? event.completed : false,
                    note: event.description || event.note || undefined
                  }))}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleDownloadPDF}
                  disabled={downloadingPdf}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {downloadingPdf ? (
                    <>
                      <i className="ri-loader-4-line mr-2 animate-spin"></i>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <i className="ri-download-line mr-2"></i>
                      Download Receipt
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* No Results */}
          {trackingNumber && !trackingResult && !isLoading && (
            <div className="text-center py-8">
              <i className="ri-search-line text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tracking information found</h3>
              <p className="text-gray-600">Please check your tracking number and try again.</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default TrackShipmentPage;
