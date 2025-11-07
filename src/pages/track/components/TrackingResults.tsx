import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Timeline from './Timeline';
import { PackageIcon } from '../../../components/icons/PackageIcon';
import { MapPinIcon } from '../../../components/icons/MapPinIcon';
import { CalendarIcon } from '../../../components/icons/CalendarIcon';
import { DownloadIcon } from '../../../components/icons/DownloadIcon';
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

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; value: string }> = ({ icon, title, value }) => (
  <div className="bg-white p-4 rounded-lg flex items-center space-x-4 border border-gray-200 shadow-sm">
    <div className="bg-gray-100 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-md font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const TrackingResults: React.FC<TrackingResultsProps> = ({ data, onReset }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Format estimated delivery date
  const formatEstimatedDelivery = () => {
    if (!data.estimatedDelivery) return 'Not available';
    try {
      const date = new Date(data.estimatedDelivery);
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      };
      return date.toLocaleDateString('en-US', options);
    } catch {
      return data.estimatedDelivery;
    }
  };

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;
    setIsDownloading(true);

    try {
      // Try to fetch full shipment details for better PDF
      let shipmentDetails: any = null;
      try {
        const { api } = await import('../../../lib/api');
        shipmentDetails = await api.getShipmentByTracking(data.trackingId) as any;
      } catch (err) {
        console.log('Could not fetch full shipment details, using available data');
      }

      // Use fetched shipment details or convert TrackingData to Shipment format
      const firstTimelineEvent = data.timeline[0];
      const shipmentData = shipmentDetails?.shipment || shipmentDetails?.data || shipmentDetails || {};
      
      // Format date_registered properly
      let dateRegistered: string;
      if (shipmentData.date_registered) {
        dateRegistered = shipmentData.date_registered;
      } else if (firstTimelineEvent && firstTimelineEvent.date && firstTimelineEvent.time) {
        try {
          const dateStr = `${firstTimelineEvent.date} ${firstTimelineEvent.time}`;
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

      // Generate and download PDF using the utility function
      const pdfBlob = generatePDFReceipt(shipment);
      
      if (!pdfBlob) {
        throw new Error('PDF generation returned empty blob');
      }
      
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tracking-report-${data.trackingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('PDF receipt downloaded successfully');
    } catch (error: any) {
      console.error('PDF generation error:', error);
      toast.error(error.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Result for <span className="font-mono text-blue-600">{data.trackingId}</span>
        </h2>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center"
        >
          <i className="ri-search-line mr-2"></i>
          Track Another
        </button>
      </div>

      <div ref={printRef} className="bg-gray-50 p-4 sm:p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard 
            icon={<PackageIcon className="w-5 h-5 text-blue-600" />} 
            title="Tracking Number" 
            value={data.trackingId} 
          />
          <InfoCard 
            icon={<MapPinIcon className="w-5 h-5 text-blue-600" />} 
            title="Current Location" 
            value={data.currentLocation || 'Not available'} 
          />
          <InfoCard 
            icon={<CalendarIcon className="w-5 h-5 text-blue-600" />} 
            title="Estimated Delivery" 
            value={formatEstimatedDelivery()} 
          />
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mt-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Shipment Timeline</h3>
          <Timeline events={data.timeline} />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-md transition duration-200 shadow-md"
        >
          <DownloadIcon className="w-5 h-5" />
          {isDownloading ? 'Downloading...' : 'Download PDF'}
        </button>
      </div>
    </div>
  );
};

export default TrackingResults;
