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
  
  // Add date and time state
  const [useCustomDateTime, setUseCustomDateTime] = useState(false);
  const [customDate, setCustomDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD format
  });
  const [customTime, setCustomTime] = useState(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`; // HH:MM format
  });

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

      // Prepare status data
      const statusData: any = {
        status,
        location: location || undefined,
        coordinates: coordinates || undefined,
        note: note || undefined
      };

      // Add custom timestamp if selected
      if (useCustomDateTime && customDate && customTime) {
        // Combine date and time, treating it as local time
        const dateTimeString = `${customDate}T${customTime}:00`;
        const customDateTime = new Date(dateTimeString);
        
        // Validate the date
        if (!isNaN(customDateTime.getTime())) {
          // Get timezone offset to preserve local time
          const offset = -customDateTime.getTimezoneOffset();
          const offsetHours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
          const offsetMinutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
          const offsetSign = offset >= 0 ? '+' : '-';
          
          // Format: YYYY-MM-DDTHH:mm:ss+HH:mm (with timezone offset)
          // This preserves the exact local time the user selected
          statusData.timestamp = `${customDate}T${customTime}:00${offsetSign}${offsetHours}:${offsetMinutes}`;
        } else {
          toast.error('Invalid date or time selected');
          setLoading(false);
          return;
        }
      }

      const response = await api.updateShipmentStatus(identifier, statusData) as any;

      if (response.success) {
        await onUpdate();
        toast.success('Status updated successfully!');
        onClose();
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

  // Get current date/time for display
  const currentDateTime = new Date();
  const displayDate = useCustomDateTime 
    ? new Date(`${customDate}T${customTime}:00`).toLocaleDateString()
    : currentDateTime.toLocaleDateString();
  const displayTime = useCustomDateTime
    ? new Date(`${customDate}T${customTime}:00`).toLocaleTimeString()
    : currentDateTime.toLocaleTimeString();

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
              Location *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York Facility, Los Angeles Hub"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              This location will appear in the tracking timeline
            </p>
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

          {/* Date and Time Selection */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="useCustomDateTime"
                checked={useCustomDateTime}
                onChange={(e) => setUseCustomDateTime(e.target.checked)}
                className="w-4 h-4 text-[#009FE3] border-gray-300 rounded focus:ring-[#009FE3]"
              />
              <label htmlFor="useCustomDateTime" className="ml-2 text-sm font-medium text-gray-700">
                Use custom date and time
              </label>
            </div>

            {useCustomDateTime && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    required={useCustomDateTime}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    required={useCustomDateTime}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}
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
                  <li>Date & Time: {displayDate} at {displayTime}</li>
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
              disabled={loading || !status || !location}
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
