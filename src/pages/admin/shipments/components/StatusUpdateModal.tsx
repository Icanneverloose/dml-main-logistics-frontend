import React, { useState } from 'react';
import { type Shipment } from '../../../../hooks/useShipments';
import { api } from '../../../../lib/api';
import { useAuth } from '../../../../hooks/useAuth';
import { toast } from '../../../../components/Toast';

interface StatusUpdateModalProps {
  shipment: Shipment;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  shipment,
  isOpen,
  onClose,
  onUpdate
}) => {
  const { user } = useAuth();
  const [status, setStatus] = useState(shipment.status || '');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    'Registered',
    'At Facility',
    'In Transit',
    'Out for Delivery',
    'Delivered',
    'Delayed',
    'Cancelled'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const identifier = shipment.tracking_number || shipment.id;
      if (!identifier) {
        toast.error('Cannot update status: shipment missing identifier');
        setLoading(false);
        return;
      }

      const response = await api.updateShipmentStatus(identifier, {
        status,
        location: location || undefined,
        coordinates: coordinates || undefined,
        note: note || undefined
      }) as any;

      if (response.success) {
        await onUpdate();
        toast.success('Status updated successfully!');
      } else {
        toast.error(response.error || 'Failed to update status');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-[#003366]">Update Shipment Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Shipment Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
            <p className="font-medium text-[#003366] font-mono">{shipment.tracking_number}</p>
            <p className="text-sm text-gray-600 mt-2 mb-1">Current Status</p>
            <p className="font-medium text-gray-900">{shipment.status || 'N/A'}</p>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Select Status</option>
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York Facility, Los Angeles Hub"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          {/* Coordinates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coordinates (optional)
            </label>
            <input
              type="text"
              value={coordinates}
              onChange={(e) => setCoordinates(e.target.value)}
              placeholder="e.g., 40.7128, -74.0060"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">Latitude, Longitude format</p>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note / Description
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Add any additional information about this status update..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              This note will be added to the shipment timeline.
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <i className="ri-information-line text-blue-600 text-xl mr-2"></i>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Status Update Details</p>
                <p>This update will be recorded in the shipment timeline with:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Date & Time: {new Date().toLocaleString()}</li>
                  <li>Updated by: {user?.name || 'Admin'}</li>
                  {location && <li>Location: {location}</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !status}
              className="px-6 py-2 bg-[#009FE3] text-white rounded-lg hover:bg-[#007bb3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Updating...
                </>
              ) : (
                <>
                  <i className="ri-save-line mr-2"></i>
                  Update Status
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusUpdateModal;

