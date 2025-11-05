import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useShipments } from '../../../hooks/useShipments';
import { api } from '../../../lib/api';
import { toast } from '../../../components/Toast';
import { generatePDFReceipt } from '../../../utils/pdfGenerator';

const PDFReceiptsPage = () => {
  const { shipments, loading } = useShipments();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredShipments, setFilteredShipments] = useState(shipments);
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm) {
      const filtered = shipments.filter(s => 
        s.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.receiver_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredShipments(filtered);
    } else {
      setFilteredShipments(shipments);
    }
  }, [searchTerm, shipments]);

  const handleGeneratePDF = async (shipment: any) => {
    // Prevent multiple simultaneous downloads
    if (downloadingPdf === shipment.tracking_number) {
      return;
    }

    setDownloadingPdf(shipment.tracking_number);
    
    try {
      const result = await api.generatePDF(shipment.tracking_number);
      
      if (result instanceof Blob) {
        // Create a download link for the blob
        const url = window.URL.createObjectURL(result);
        const link = document.createElement('a');
        link.href = url;
        link.download = `receipt-${shipment.tracking_number}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Clean up the URL after a short delay to ensure download starts
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
        toast.success('PDF downloaded successfully');
      } else if (typeof result === 'string') {
        // If it's a URL, try to download it
        // For same-origin URLs, use download attribute
        // For cross-origin URLs, open in new tab
        try {
          const link = document.createElement('a');
          link.href = result;
          
          // Check if it's a same-origin URL
          const urlObj = new URL(result, window.location.origin);
          const isSameOrigin = urlObj.origin === window.location.origin;
          
          if (isSameOrigin) {
            link.download = `receipt-${shipment.tracking_number}.pdf`;
          } else {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
          }
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success(isSameOrigin ? 'PDF downloaded successfully' : 'PDF opened in new tab');
        } catch (urlError) {
          // If URL parsing fails, just open it
          window.open(result, '_blank', 'noopener,noreferrer');
          toast.success('PDF opened in new tab');
        }
      } else {
        // Backend not available or returned null (404) - generate PDF client-side
        try {
          const pdfBlob = generatePDFReceipt(shipment);
          const url = window.URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `receipt-${shipment.tracking_number}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 100);
          toast.success('PDF generated and downloaded successfully');
        } catch (pdfError: any) {
          console.error('PDF generation error:', pdfError);
          toast.error('Failed to generate PDF. Please try again.');
        }
      }
    } catch (error: any) {
      // If backend fails, generate PDF client-side as fallback
      console.error('Backend PDF error:', error);
      try {
        const pdfBlob = generatePDFReceipt(shipment);
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `receipt-${shipment.tracking_number}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
        toast.success('PDF generated and downloaded successfully');
      } catch (pdfError: any) {
        console.error('PDF generation error:', pdfError);
        toast.error('Failed to generate PDF. Please try again.');
      }
    } finally {
      setDownloadingPdf(null);
    }
  };

  const handleEmailPDF = async (shipment: any) => {
    try {
      const email = shipment.receiver_email || shipment.sender_email;
      if (!email) {
        toast.warning('No email address available for this shipment');
        return;
      }

      const response = await api.emailPDF(shipment.tracking_number, email) as any;
      
      if (response.success) {
        toast.success(`PDF sent to ${email} successfully`);
      } else {
        toast.error(response.error || 'Failed to send email. Please check if the backend endpoint is implemented.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send email. Please check if the backend endpoint is implemented.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#003366]">PDF Receipts</h1>
            <p className="text-gray-600 mt-1">Generate and manage shipment PDF receipts</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search by tracking number, sender, or receiver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Receipts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <i className="ri-loader-4-line text-4xl text-[#009FE3] animate-spin mb-4"></i>
            <p className="text-gray-500">Loading receipts...</p>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <i className="ri-file-pdf-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-500 text-lg">No shipments found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShipments.map((shipment) => (
              <div key={shipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-sm text-[#003366] font-semibold">{shipment.tracking_number}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(shipment.date_registered || '').toLocaleDateString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="ri-file-pdf-line text-2xl text-red-600"></i>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Sender</p>
                    <p className="text-sm font-medium text-gray-900">{shipment.sender_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Receiver</p>
                    <p className="text-sm font-medium text-gray-900">{shipment.receiver_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cost</p>
                    <p className="text-sm font-medium text-green-600">
                      ${parseFloat(shipment.shipment_cost?.toString() || '0').toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleGeneratePDF(shipment)}
                    disabled={downloadingPdf === shipment.tracking_number}
                    className="flex-1 bg-[#009FE3] text-white px-4 py-2 rounded-lg hover:bg-[#007bb3] transition-colors text-sm font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadingPdf === shipment.tracking_number ? (
                      <>
                        <i className="ri-loader-4-line animate-spin"></i>
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <i className="ri-download-line"></i>
                        <span>Download</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleEmailPDF(shipment)}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <i className="ri-mail-line"></i>
                    <span>Email</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PDFReceiptsPage;

