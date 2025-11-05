import { useState } from 'react';
import { generatePDFReceipt } from '../../../utils/pdfGenerator';
import { toast } from '../../../components/Toast';
import type { Shipment } from '../../../hooks/useShipments';

interface TrackingData {
  trackingId: string;
  status: string;
  estimatedDelivery: string | null;
  currentLocation: string;
  recipient: string | null;
  destination: string | null;
  service: string | null;
  timeline: Array<{
    status: string;
    location: string;
    date: string;
    time: string;
    completed: boolean;
    coordinates?: string;
    note?: string;
  }>;
}

interface TrackingResultsProps {
  data: TrackingData;
  onReset: () => void;
}

const TrackingResults = ({ data, onReset }: TrackingResultsProps) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const statusLower = data.status.toLowerCase();
  const isDelivered = statusLower === 'delivered';
  const isCancelled = statusLower === 'cancelled' || statusLower === 'canceled';
  const isInTransit = statusLower.includes('transit') || statusLower.includes('on the way') || statusLower === 'in transit';
  const latestTimelineEvent = data.timeline[data.timeline.length - 1];
  
  // Get status color
  const getStatusColor = () => {
    if (isCancelled) return 'text-red-600 bg-red-50 border-red-200';
    if (isDelivered) return 'text-green-600 bg-green-50 border-green-200';
    if (isInTransit) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusIconColor = () => {
    if (isCancelled) return 'bg-red-500';
    if (isDelivered) return 'bg-green-500';
    if (isInTransit) return 'bg-blue-500';
    return 'bg-gray-500';
  };
  
  // Format delivery date
  const formatDeliveryDate = (dateString: string, timeString: string) => {
    try {
      const date = new Date(`${dateString} ${timeString}`);
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      return date.toLocaleDateString('en-US', options);
    } catch {
      return `${dateString} at ${timeString}`;
    }
  };

  // Format estimated arrival date
  const formatEstimatedArrival = () => {
    if (!data.estimatedDelivery) return 'Not available';
    try {
      const date = new Date(data.estimatedDelivery);
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      };
      return date.toLocaleDateString('en-US', options);
    } catch {
      return data.estimatedDelivery;
    }
  };

  // Format timeline date
  const formatTimelineDate = (dateString: string, timeString: string) => {
    try {
      const date = new Date(`${dateString} ${timeString}`);
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      return date.toLocaleDateString('en-US', options);
    } catch {
      return `${dateString}, ${timeString}`;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string, isCompleted: boolean, isLast: boolean) => {
    if (isLast && isDelivered) {
      return 'ri-checkbox-circle-fill';
    }
    if (isCompleted) {
      return 'ri-checkbox-circle-fill';
    }
    return 'ri-checkbox-blank-circle-line';
  };

  // Normalize status names
  const normalizeStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'registered': 'Label Created',
      'label created': 'Label Created',
      'package picked up': 'We Have Your Package',
      'in transit': 'On the Way',
      'out for delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'at facility': 'At Facility',
      'in warehouse': 'In Warehouse',
      'exception': 'Exception',
      'delayed': 'Delayed'
    };
    
    const normalized = status.toLowerCase();
    return statusMap[normalized] || status;
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (downloadingPdf) return;
    
    setDownloadingPdf(true);
    try {
      // Try to fetch full shipment details for better PDF
      let shipmentDetails: any = null;
      try {
        const { api } = await import('../../../lib/api');
        shipmentDetails = await api.getShipmentByTracking(data.trackingId) as any;
        console.log('Fetched shipment details:', shipmentDetails);
      } catch (err) {
        console.log('Could not fetch full shipment details, using available data:', err);
      }

      // Use fetched shipment details or convert TrackingData to Shipment format
      const firstTimelineEvent = data.timeline[0];
      const shipmentData = shipmentDetails?.shipment || shipmentDetails?.data || shipmentDetails || {};
      
      // Format date_registered properly
      let dateRegistered: string;
      if (shipmentData.date_registered) {
        dateRegistered = shipmentData.date_registered;
      } else if (firstTimelineEvent && firstTimelineEvent.date && firstTimelineEvent.time) {
        // Try to parse the date string from timeline
        try {
          const dateStr = `${firstTimelineEvent.date} ${firstTimelineEvent.time}`;
          // Try to parse it as a date and convert to ISO string
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            dateRegistered = parsedDate.toISOString();
          } else {
            dateRegistered = new Date().toISOString();
          }
        } catch {
          dateRegistered = new Date().toISOString();
        }
      } else {
        dateRegistered = new Date().toISOString();
      }
      
      const shipment: Shipment = {
        id: data.trackingId,
        tracking_number: data.trackingId,
        sender_name: shipmentData.sender_name || 'Sender',
        sender_email: shipmentData.sender_email || '',
        sender_phone: shipmentData.sender_phone || '',
        sender_address: shipmentData.sender_address || data.currentLocation || 'Address not available',
        receiver_name: data.recipient || shipmentData.receiver_name || 'Recipient',
        receiver_email: shipmentData.receiver_email || '',
        receiver_phone: shipmentData.receiver_phone || '',
        receiver_address: data.destination || shipmentData.receiver_address || data.currentLocation || 'Address not available',
        package_type: data.service || shipmentData.package_type || 'Standard',
        weight: shipmentData.weight || 0,
        weight_unit: shipmentData.weight_unit || 'kg',
        shipment_cost: shipmentData.shipment_cost || 0,
        status: data.status || 'Registered',
        date_registered: dateRegistered,
        estimated_delivery_date: data.estimatedDelivery || shipmentData.estimated_delivery_date || undefined,
        destination_country: shipmentData.destination_country || undefined,
        origin_country: shipmentData.origin_country || undefined,
        pdf_url: shipmentData.pdf_url || undefined,
        qr_url: shipmentData.qr_url || undefined
      };

      console.log('Generating PDF with shipment data:', shipment);

      // Generate and download PDF
      const pdfBlob = generatePDFReceipt(shipment);
      
      if (!pdfBlob) {
        throw new Error('PDF generation returned empty blob');
      }
      
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${data.trackingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('PDF receipt downloaded successfully');
    } catch (error: any) {
      console.error('PDF generation error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        trackingId: data.trackingId,
        trackingData: data
      });
      toast.error(error.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Modern Tracking Timeline Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#003366] mb-1">
                Results for <span className="font-mono text-[#009FE3]">{data.trackingId}</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600">Track your shipment in real-time</p>
            </div>
            <button
              onClick={onReset}
              className="text-sm text-[#009FE3] hover:text-[#007bb3] font-medium transition-colors flex items-center self-start sm:self-center"
            >
              <i className="ri-search-line mr-2"></i>
              Track Another
            </button>
          </div>

          {/* Status & Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Status Card */}
            <div className={`rounded-xl p-4 border ${getStatusColor()}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wide">Status</span>
                <div className={`w-3 h-3 rounded-full ${getStatusIconColor()}`}></div>
              </div>
              <p className="text-lg sm:text-xl font-bold">{normalizeStatus(data.status)}</p>
            </div>

            {/* Estimated Arrival Card */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wide text-blue-600">Estimated Arrival</span>
                <i className="ri-calendar-line text-blue-500"></i>
              </div>
              <p className="text-lg sm:text-xl font-bold text-blue-900">{formatEstimatedArrival()}</p>
            </div>

            {/* Current Location Card */}
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wide text-purple-600">Current Location</span>
                <i className="ri-map-pin-line text-purple-500"></i>
              </div>
              <p className="text-base sm:text-lg font-bold text-purple-900 break-words">{data.currentLocation}</p>
            </div>
          </div>

          {/* Primary Status Banner */}
          <div className={`rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 ${
            isCancelled 
              ? 'bg-red-50 border-red-200' 
              : isDelivered 
                ? 'bg-green-50 border-green-200' 
                : isInTransit
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                {/* Status Icon */}
                <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-md ${
                  isCancelled 
                    ? 'bg-red-500' 
                    : isDelivered 
                      ? 'bg-green-500' 
                      : isInTransit
                        ? 'bg-blue-500'
                        : 'bg-gray-500'
                }`}>
                  {isCancelled ? (
                    <i className="ri-close-line text-white text-xl sm:text-2xl"></i>
                  ) : isDelivered ? (
                    <i className="ri-check-line text-white text-xl sm:text-2xl"></i>
                  ) : isInTransit ? (
                    <i className="ri-truck-line text-white text-xl sm:text-2xl"></i>
                  ) : (
                    <i className="ri-loader-4-line text-white text-xl sm:text-2xl animate-spin"></i>
                  )}
                </div>

                {/* Status Information */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base sm:text-lg md:text-xl font-bold mb-1 ${
                    isCancelled 
                      ? 'text-red-700' 
                      : isDelivered 
                        ? 'text-green-700' 
                        : isInTransit
                          ? 'text-blue-700'
                          : 'text-gray-700'
                  }`}>
                    {isDelivered 
                      ? `Delivered on ${formatDeliveryDate(latestTimelineEvent.date, latestTimelineEvent.time)}`
                      : isCancelled
                        ? 'Shipment Cancelled'
                        : normalizeStatus(data.status)
                    }
                  </h3>
                  {isDelivered && (
                    <p className="text-sm text-gray-600">
                      Package successfully delivered to recipient
                    </p>
                  )}
                </div>
              </div>

              {/* Optional: View Delivery Photo Link */}
              {isDelivered && (
                <a
                  href="#"
                  className="text-sm sm:text-base text-[#009FE3] hover:text-[#007bb3] font-medium transition-colors flex items-center whitespace-nowrap ml-4"
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: Implement delivery photo view
                  }}
                >
                  View Delivery Photo
                  <i className="ri-arrow-right-line ml-1"></i>
                </a>
              )}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="relative">
            <h3 className="text-lg sm:text-xl font-bold text-[#003366] mb-6">Shipment Timeline</h3>
            
            {/* Vertical Timeline Line */}
            <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${
              isCancelled
                ? 'bg-gradient-to-b from-red-400 via-red-300 to-gray-200'
                : isDelivered 
                  ? 'bg-gradient-to-b from-blue-500 via-blue-500 to-green-500' 
                  : 'bg-gradient-to-b from-blue-500 via-gray-300 to-gray-200'
            }`}></div>

            {/* Timeline Steps */}
            <div className="space-y-4 sm:space-y-6">
              {data.timeline.map((event, index) => {
                const isCompleted = event.completed || index < data.timeline.length - 1;
                const isLast = index === data.timeline.length - 1;
                const normalizedStatus = normalizeStatus(event.status);
                
                return (
                  <div key={index} className="relative flex items-start">
                    {/* Timeline Icon - positioned to align with line */}
                    <div className="relative z-10 flex-shrink-0 -ml-[6px] sm:-ml-[10px]">
                      {isLast && isDelivered ? (
                        // Right arrow for delivered
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                          <i className="ri-arrow-right-line text-white text-sm sm:text-xl"></i>
                        </div>
                      ) : isCompleted ? (
                        <div className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                          isCancelled
                            ? 'bg-red-500 shadow-lg shadow-red-200'
                            : 'bg-[#009FE3] shadow-lg shadow-blue-200'
                        }`}>
                          <i className={`${getStatusIcon(event.status, isCompleted, isLast)} text-white text-xs sm:text-lg`}></i>
                        </div>
                      ) : (
                        <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300"></div>
                        </div>
                      )}
                    </div>

                    {/* Timeline Content Card */}
                    <div className="ml-2 sm:ml-4 flex-1 pb-4 sm:pb-6 min-w-0">
                      <div className={`bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border transition-all ${
                        isCompleted
                          ? isLast && isDelivered
                            ? 'border-green-200 shadow-sm hover:shadow-md'
                            : isCancelled && isLast
                              ? 'border-red-200 shadow-sm hover:shadow-md'
                              : 'border-blue-200 shadow-sm hover:shadow-md'
                          : 'border-gray-200'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
                          <h4 className={`text-sm sm:text-base md:text-lg font-bold break-words ${
                            isCompleted
                              ? isLast && isDelivered
                                ? 'text-green-700'
                                : isCancelled && isLast
                                  ? 'text-red-700'
                                  : 'text-[#003366]'
                              : 'text-gray-400'
                          }`}>
                            {normalizedStatus}
                          </h4>
                          <span className={`text-xs sm:text-sm whitespace-nowrap ${
                            isCompleted ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {formatTimelineDate(event.date, event.time)}
                          </span>
                        </div>
                        
                        <div className="flex items-start mt-2">
                          <i className={`ri-map-pin-line mr-2 mt-0.5 flex-shrink-0 ${
                            isCompleted 
                              ? isLast && isDelivered
                                ? 'text-green-600'
                                : isCancelled && isLast
                                  ? 'text-red-600'
                                  : 'text-[#009FE3]'
                              : 'text-gray-400'
                          }`}></i>
                          <span className={`text-xs sm:text-sm break-words ${
                            isCompleted ? 'text-gray-700' : 'text-gray-400'
                          }`}>
                            {event.location}
                          </span>
                        </div>

                        {event.note && (
                          <p className={`text-xs sm:text-sm mt-2 break-words ${
                            isCompleted ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {event.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Download PDF Button */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPdf}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[#009FE3] hover:bg-[#007bb3] text-white font-medium rounded-lg transition-colors border border-[#009FE3] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {downloadingPdf ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <i className="ri-file-pdf-line"></i>
                  <span>Download Receipt PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingResults;
