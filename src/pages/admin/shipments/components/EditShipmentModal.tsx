import React, { useState, useEffect } from 'react';
import { api } from '../../../../lib/api';
import { toast } from '../../../../components/Toast';
import type { Shipment } from '../../../../hooks/useShipments';

interface EditShipmentModalProps {
  shipment: Shipment;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditShipmentModal: React.FC<EditShipmentModalProps> = ({
  shipment,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_email: '',
    sender_phone: '',
    sender_address: '',
    receiver_name: '',
    receiver_phone: '',
    receiver_address: '',
    package_type: '',
    weight: '',
    shipment_cost: '',
    estimated_delivery_date: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && shipment) {
      setFormData({
        sender_name: shipment.sender_name || '',
        sender_email: shipment.sender_email || '',
        sender_phone: shipment.sender_phone || '',
        sender_address: shipment.sender_address || '',
        receiver_name: shipment.receiver_name || '',
        receiver_phone: shipment.receiver_phone || '',
        receiver_address: shipment.receiver_address || '',
        package_type: shipment.package_type || '',
        weight: shipment.weight?.toString() || '',
        shipment_cost: shipment.shipment_cost?.toString() || '',
        estimated_delivery_date: shipment.estimated_delivery_date 
          ? shipment.estimated_delivery_date.split('T')[0] 
          : ''
      });
    }
  }, [isOpen, shipment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shipment.tracking_number && !shipment.id) {
      toast.error('Cannot edit shipment without tracking number or ID');
      return;
    }

    setLoading(true);
    try {
      const updateData: any = {};
      
      if (formData.sender_name) updateData.sender_name = formData.sender_name;
      if (formData.sender_email) updateData.sender_email = formData.sender_email;
      if (formData.sender_phone) updateData.sender_phone = formData.sender_phone;
      if (formData.sender_address) updateData.sender_address = formData.sender_address;
      if (formData.receiver_name) updateData.receiver_name = formData.receiver_name;
      if (formData.receiver_phone) updateData.receiver_phone = formData.receiver_phone;
      if (formData.receiver_address) updateData.receiver_address = formData.receiver_address;
      if (formData.package_type) updateData.package_type = formData.package_type;
      if (formData.weight) updateData.weight = parseFloat(formData.weight);
      if (formData.shipment_cost) updateData.shipment_cost = parseFloat(formData.shipment_cost);
      if (formData.estimated_delivery_date) updateData.estimated_delivery_date = formData.estimated_delivery_date;

      const identifier = shipment.tracking_number || shipment.id;
      const response = await api.updateShipment(identifier, updateData) as any;

      if (response.success) {
        toast.success('Shipment updated successfully!');
        await onUpdate();
        onClose();
      } else {
        toast.error(response.error || 'Failed to update shipment');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update shipment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-[#003366]">Edit Shipment</h2>
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
            <p className="font-medium text-[#003366] font-mono">{shipment.tracking_number || shipment.id || 'N/A'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sender Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#003366]">Sender Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="sender_name"
                  value={formData.sender_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="sender_email"
                  value={formData.sender_email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="sender_phone"
                  value={formData.sender_phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  name="sender_address"
                  value={formData.sender_address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                />
              </div>
            </div>

            {/* Receiver Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#003366]">Receiver Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="receiver_name"
                  value={formData.receiver_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="receiver_phone"
                  value={formData.receiver_phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  name="receiver_address"
                  value={formData.receiver_address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                />
              </div>
            </div>

            {/* Package Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#003366]">Package Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Type *</label>
                <select
                  name="package_type"
                  value={formData.package_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                  <option value="Priority">Priority</option>
                  <option value="Fragile">Fragile</option>
                  <option value="Document">Document</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost ($) *</label>
                <input
                  type="number"
                  name="shipment_cost"
                  value={formData.shipment_cost}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Date</label>
                <input
                  type="date"
                  name="estimated_delivery_date"
                  value={formData.estimated_delivery_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#009FE3] text-white rounded-lg hover:bg-[#007bb3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditShipmentModal;

