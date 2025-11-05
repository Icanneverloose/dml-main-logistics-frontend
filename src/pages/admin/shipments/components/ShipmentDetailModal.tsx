import React, { useState, useEffect } from 'react';
import { api } from '../../../../lib/api';
import type { Shipment, StatusLog } from '../../../../hooks/useShipments';

interface ShipmentDetailModalProps {
  shipment: Shipment;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
  onGeneratePDF: (shipment: Shipment) => void;
  onEmailPDF: (shipment: Shipment) => void;
}

const ShipmentDetailModal: React.FC<ShipmentDetailModalProps> = ({ 
  shipment, 
  isOpen, 
  onClose, 
  onStatusUpdate,
  onGeneratePDF,
  onEmailPDF
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [statusHistory, setStatusHistory] = useState<StatusLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (activeTab === 'tracking' && isOpen) {
      fetchStatusHistory();
    }
  }, [activeTab, shipment.tracking_number, isOpen]);

  const fetchStatusHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await api.getShipmentStatus(shipment.tracking_number) as any;
      if (response.success && response.history) {
        setStatusHistory(response.history);
      }
    } catch (error) {
      console.error('Error fetching status history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'delivered') return 'bg-green-100 text-green-800';
    if (statusLower === 'in transit' || statusLower === 'out for delivery') return 'bg-blue-100 text-blue-800';
    if (statusLower === 'delayed') return 'bg-yellow-100 text-yellow-800';
    if (statusLower === 'cancelled') return 'bg-red-100 text-red-800';
    if (statusLower === 'registered' || statusLower === 'at facility') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'delivered') return 'ri-check-double-line';
    if (statusLower === 'in transit') return 'ri-truck-line';
    if (statusLower === 'out for delivery') return 'ri-roadster-line';
    if (statusLower === 'delayed') return 'ri-time-line';
    if (statusLower === 'cancelled') return 'ri-close-circle-line';
    if (statusLower === 'at facility') return 'ri-building-line';
    return 'ri-file-list-line';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
            <h2 className="text-2xl font-bold text-[#003366]">Shipment Details</h2>
            <div className="flex items-center space-x-3 mt-2">
              <span className="font-mono text-sm text-gray-600">{shipment.tracking_number}</span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status || '')}`}>
                  {shipment.status || 'Unknown'}
                </span>
            </div>
              </div>
              <button
                onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
              >
            <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
              <nav className="-mb-px flex space-x-8">
            {[
              { id: 'details', label: 'Details', icon: 'ri-file-text-line' },
              { id: 'tracking', label: 'Timeline', icon: 'ri-time-line' },
            ].map((tab) => (
                  <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-[#009FE3] text-[#009FE3]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'details' && (
                <div className="space-y-6">
              {/* PDF Actions */}
              <div className="bg-gradient-to-r from-[#009FE3] to-[#007bb3] rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Receipt & Documents</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => onGeneratePDF(shipment)}
                    className="flex-1 bg-white text-[#009FE3] px-4 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                  >
                    <i className="ri-file-pdf-line text-xl"></i>
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => onEmailPDF(shipment)}
                    className="flex-1 bg-white/20 text-white px-4 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center justify-center space-x-2 border border-white/30"
                  >
                    <i className="ri-mail-line text-xl"></i>
                    <span>Email PDF</span>
                  </button>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sender Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#003366] mb-4 flex items-center">
                    <i className="ri-user-line mr-2 text-[#009FE3]"></i>
                    Sender Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{shipment.sender_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{shipment.sender_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{shipment.sender_phone}</p>
                    </div>
                  <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">{shipment.sender_address}</p>
                    </div>
                    </div>
                  </div>

                {/* Receiver Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#003366] mb-4 flex items-center">
                    <i className="ri-user-received-line mr-2 text-[#009FE3]"></i>
                    Receiver Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{shipment.receiver_name}</p>
                    </div>
                    {shipment.receiver_email && (
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{shipment.receiver_email}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{shipment.receiver_phone}</p>
                    </div>
                  <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">{shipment.receiver_address}</p>
                    </div>
                    </div>
                  </div>

                {/* Package Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#003366] mb-4 flex items-center">
                    <i className="ri-package-line mr-2 text-[#009FE3]"></i>
                    Package Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Package Type</p>
                      <p className="font-medium text-gray-900">{shipment.package_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Weight</p>
                      <p className="font-medium text-gray-900">{shipment.weight} kg</p>
                    </div>
                  <div>
                      <p className="text-sm text-gray-600">Shipping Cost</p>
                      <p className="font-medium text-gray-900">${parseFloat(shipment.shipment_cost?.toString() || '0').toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Shipment Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#003366] mb-4 flex items-center">
                    <i className="ri-information-line mr-2 text-[#009FE3]"></i>
                    Shipment Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Tracking Number</p>
                      <p className="font-medium text-gray-900 font-mono">{shipment.tracking_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status || '')}`}>
                        {shipment.status || 'Unknown'}
                      </span>
                    </div>
                  <div>
                      <p className="text-sm text-gray-600">Registration Date</p>
                      <p className="font-medium text-gray-900">
                        {shipment.date_registered 
                          ? new Date(shipment.date_registered).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'N/A'}
                      </p>
                    </div>
                    {shipment.estimated_delivery_date && (
                      <div>
                        <p className="text-sm text-gray-600">Estimated Delivery</p>
                        <p className="font-medium text-gray-900">
                          {new Date(shipment.estimated_delivery_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* QR Code */}
                      {shipment.qr_url && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#003366] mb-4">QR Code</h3>
                  <div className="flex items-center space-x-4">
                          <img 
                            src={api.getQrUrl(shipment.qr_url) || ''} 
                            alt="QR Code" 
                      className="w-32 h-32 border border-gray-300 rounded-lg"
                          />
                    <div className="text-sm text-gray-600">
                      <p>Scan this QR code to track the shipment</p>
                      <p className="mt-2 font-mono text-xs">{shipment.tracking_number}</p>
                    </div>
                  </div>
                </div>
              )}
              </div>
            )}

            {activeTab === 'tracking' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#003366] mb-4">Status Timeline</h3>
                  {loadingHistory ? (
                <div className="text-center py-12">
                  <i className="ri-loader-4-line text-3xl text-[#009FE3] animate-spin mb-4"></i>
                  <p className="text-gray-500">Loading timeline...</p>
                    </div>
                  ) : statusHistory.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <i className="ri-history-line text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-500">No status history available</p>
                  <p className="text-sm text-gray-400 mt-2">Status updates will appear here</p>
                    </div>
                  ) : (
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Timeline Items */}
                  <div className="space-y-6">
                      {statusHistory.map((log, index) => (
                      <div key={index} className="relative flex items-start space-x-4">
                        {/* Icon */}
                        <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                          index === 0 
                            ? 'bg-[#009FE3] text-white' 
                            : 'bg-gray-200 text-gray-600'
                            }`}>
                          <i className={getStatusIcon(log.status)}></i>
                            </div>
                        
                        {/* Content */}
                        <div className="flex-1 bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                          <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{log.status}</h4>
                            {log.location && (
                                <p className="text-sm text-gray-600 mt-1 flex items-center">
                                <i className="ri-map-pin-line mr-1"></i>
                                {log.location}
                              </p>
                            )}
                            {log.note && (
                                <p className="text-sm text-gray-600 mt-2">
                                <i className="ri-message-line mr-1"></i>
                                {log.note}
                              </p>
                            )}
                              {log.coordinates && (
                                <p className="text-xs text-gray-500 font-mono mt-1">
                                  Coordinates: {log.coordinates}
                                </p>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                              {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                            </p>
                          </div>
                </div>
              </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            )}
          </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailModal;
