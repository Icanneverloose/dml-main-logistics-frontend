import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useShipments } from '../../../hooks/useShipments';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../lib/api';
import { toast } from '../../../components/Toast';

const RegisterShipmentPage = () => {
  const navigate = useNavigate();
  const { refetch } = useShipments();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Check access
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth/signin');
      } else {
        const userRole = user.role?.toLowerCase() || '';
        const hasAccess = userRole === 'admin' || 
                         userRole === 'super admin' || 
                         userRole === 'superadmin' ||
                         userRole === 'manager' ||
                         userRole === 'support';
        
        if (!hasAccess) {
          navigate('/dashboard');
        }
      }
    }
  }, [user, authLoading, navigate]);
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_email: '',
    sender_phone: '',
    sender_address: '',
    sender_city: '',
    sender_state: '',
    sender_zip: '',
    sender_country: '',
    receiver_name: '',
    receiver_email: '',
    receiver_phone: '',
    receiver_address: '',
    receiver_city: '',
    receiver_state: '',
    receiver_zip: '',
    receiver_country: '',
    package_type: 'Standard',
    weight: '',
    shipment_cost: '',
    description: '',
    origin_country: '',
    destination_country: '',
    registration_date: new Date().toISOString().split('T')[0],
    estimated_delivery_date: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.sender_name || !formData.sender_email || !formData.sender_phone || !formData.sender_address ||
          !formData.sender_city || !formData.sender_state || !formData.sender_country ||
          !formData.receiver_name || !formData.receiver_phone || !formData.receiver_address ||
          !formData.receiver_city || !formData.receiver_state || !formData.receiver_country ||
          !formData.weight) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Construct sender address with optional zip code
      let senderAddress = `${formData.sender_address}, ${formData.sender_city}, ${formData.sender_state}`;
      if (formData.sender_zip && formData.sender_zip.trim()) {
        senderAddress += ` ${formData.sender_zip}`;
      }
      senderAddress += `, ${formData.sender_country}`;

      // Construct receiver address with optional zip code
      let receiverAddress = `${formData.receiver_address}, ${formData.receiver_city}, ${formData.receiver_state}`;
      if (formData.receiver_zip && formData.receiver_zip.trim()) {
        receiverAddress += ` ${formData.receiver_zip}`;
      }
      receiverAddress += `, ${formData.receiver_country}`;

      // Prepare shipment data according to backend requirements
      // Handle shipment_cost - default to 0 if not provided or invalid
      let shipmentCostValue = 0;
      if (formData.shipment_cost !== '' && formData.shipment_cost !== null && formData.shipment_cost !== undefined) {
        const cost = parseFloat(formData.shipment_cost.toString());
        if (!isNaN(cost) && cost >= 0) {
          shipmentCostValue = cost;
        }
      }

      const shipmentData: any = {
        sender_name: formData.sender_name.trim(),
        sender_email: formData.sender_email.trim(),
        sender_phone: formData.sender_phone.trim(),
        sender_address: senderAddress.trim(),
        receiver_name: formData.receiver_name.trim(),
        receiver_email: formData.receiver_email?.trim() || '',
        receiver_phone: formData.receiver_phone.trim(),
        receiver_address: receiverAddress.trim(),
        package_type: formData.package_type || 'Standard',
        weight: parseFloat(formData.weight.toString()) || 0,
        shipment_cost: shipmentCostValue, // Always include shipment_cost, default to 0
        estimated_delivery_date: formData.estimated_delivery_date || undefined
      };

      // Validate numeric values
      if (shipmentData.weight <= 0) {
        toast.error('Weight must be greater than 0');
        setLoading(false);
        return;
      }

      console.log('Submitting shipment data:', shipmentData);
      const response = await api.createShipment(shipmentData) as any;
      console.log('Shipment creation response:', response);
      
      if (response.success) {
        const trackingNumber = response.tracking_number || response.shipment?.tracking_number || response.data?.tracking_number;
        if (trackingNumber) {
          toast.success(`Shipment registered successfully! Tracking Number: ${trackingNumber}`);
        } else {
          toast.success('Shipment registered successfully!');
        }
        
        // Refetch shipments to update the list
        try {
          await refetch();
          console.log('Shipments refetched successfully');
        } catch (refetchError) {
          console.error('Error refetching shipments:', refetchError);
          // Continue anyway - the shipment was created successfully
        }
        
        // Navigate to shipments page after a short delay to ensure refetch completes
        setTimeout(() => {
          navigate('/admin/shipments');
        }, 300);
      } else {
        const errorMsg = response.error || response.message || 'Failed to register shipment';
        console.error('Shipment creation failed:', errorMsg);
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error('Shipment creation error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      const errorMsg = error.message || 'Failed to register shipment. Please check your connection and try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#003366]">Register New Shipment</h2>
            <p className="text-gray-600 mt-1">Enter shipment details to generate tracking number and PDF receipt</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Sender Information */}
            <div>
              <h3 className="text-lg font-semibold text-[#003366] mb-4 flex items-center">
                <i className="ri-user-line mr-2 text-[#009FE3]"></i>
                Sender Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sender Name *</label>
                  <input
                    type="text"
                    name="sender_name"
                    value={formData.sender_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sender Email *</label>
                  <input
                    type="email"
                    name="sender_email"
                    value={formData.sender_email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sender Phone *</label>
                  <input
                    type="tel"
                    name="sender_phone"
                    value={formData.sender_phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sender Country *</label>
                  <input
                    type="text"
                    name="sender_country"
                    value={formData.sender_country}
                    onChange={handleChange}
                    required
                    placeholder="Enter country name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    name="sender_address"
                    value={formData.sender_address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="sender_city"
                    value={formData.sender_city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Province *</label>
                  <input
                    type="text"
                    name="sender_state"
                    value={formData.sender_state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                  <input
                    type="text"
                    name="sender_zip"
                    value={formData.sender_zip}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Receiver Information */}
            <div>
              <h3 className="text-lg font-semibold text-[#003366] mb-4 flex items-center">
                <i className="ri-user-received-line mr-2 text-[#009FE3]"></i>
                Receiver Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name *</label>
                  <input
                    type="text"
                    name="receiver_name"
                    value={formData.receiver_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Email</label>
                  <input
                    type="email"
                    name="receiver_email"
                    value={formData.receiver_email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Phone *</label>
                  <input
                    type="tel"
                    name="receiver_phone"
                    value={formData.receiver_phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Country *</label>
                  <input
                    type="text"
                    name="receiver_country"
                    value={formData.receiver_country}
                    onChange={handleChange}
                    required
                    placeholder="Enter country name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    name="receiver_address"
                    value={formData.receiver_address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="receiver_city"
                    value={formData.receiver_city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Province *</label>
                  <input
                    type="text"
                    name="receiver_state"
                    value={formData.receiver_state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                  <input
                    type="text"
                    name="receiver_zip"
                    value={formData.receiver_zip}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div>
              <h3 className="text-lg font-semibold text-[#003366] mb-4 flex items-center">
                <i className="ri-package-line mr-2 text-[#009FE3]"></i>
                Shipment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Type *</label>
                  <select
                    name="package_type"
                    value={formData.package_type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Express">Express</option>
                    <option value="Overnight">Overnight</option>
                    <option value="International">International</option>
                    <option value="Fragile">Fragile</option>
                    <option value="Documents">Documents</option>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost ($)</label>
                  <input
                    type="number"
                    name="shipment_cost"
                    value={formData.shipment_cost}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin Country</label>
                  <input
                    type="text"
                    name="origin_country"
                    value={formData.origin_country}
                    onChange={handleChange}
                    placeholder="Auto-filled from sender"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination Country</label>
                  <input
                    type="text"
                    name="destination_country"
                    value={formData.destination_country}
                    onChange={handleChange}
                    placeholder="Auto-filled from receiver"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date *</label>
                  <input
                    type="date"
                    name="registration_date"
                    value={formData.registration_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Date</label>
                  <input
                    type="date"
                    name="estimated_delivery_date"
                    value={formData.estimated_delivery_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipment Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                    placeholder="Additional details about the shipment..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/shipments')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#009FE3] text-white rounded-lg hover:bg-[#007bb3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Registering...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line mr-2"></i>
                    Register Shipment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RegisterShipmentPage;

