
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useShipments } from '../../../hooks/useShipments';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const ShipmentHistoryPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/signin', { replace: true });
    }
  }, [user, authLoading, navigate]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { shipments, loading } = useShipments();

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

  const filteredShipments = shipments.filter(shipment => {
    const statusMatch = selectedFilter === 'all' || shipment.status?.toLowerCase() === selectedFilter.toLowerCase();
    const searchMatch = !searchTerm || 
      shipment.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.receiver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.receiver_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination_country?.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const totalShipments = shipments.length;
  const deliveredShipments = shipments.filter(s => s.status?.toLowerCase() === 'delivered').length;
  const inTransitShipments = shipments.filter(s => 
    s.status?.toLowerCase() === 'in transit' || 
    s.status?.toLowerCase() === 'out for delivery' ||
    s.status?.toLowerCase() === 'at facility'
  ).length;
  const totalCost = shipments.reduce((sum, s) => sum + (parseFloat(s.shipment_cost?.toString() || '0')), 0);

  // Show loading state while checking authentication
  if (authLoading) {
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shipment History</h1>
          <p className="text-gray-600">View and manage all your past shipments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-box-3-line text-blue-600 text-2xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{totalShipments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-check-line text-green-600 text-2xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{deliveredShipments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-truck-line text-orange-600 text-2xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">{inTransitShipments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-purple-600 text-2xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
            <p className="text-gray-600">Loading shipments...</p>
          </div>
        ) : (
          <>
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
                  {['all', 'delivered', 'in transit', 'out for delivery', 'registered', 'at facility', 'delayed', 'cancelled'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Search shipments..."
                />
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {filteredShipments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 font-mono">{shipment.tracking_number}</div>
                            <div className="text-sm text-gray-500">{shipment.weight} {shipment.weight_unit || 'kg'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{shipment.receiver_name || 'N/A'}</div>
                            {shipment.receiver_email && (
                              <div className="text-sm text-gray-500">{shipment.receiver_email}</div>
                            )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{shipment.destination_country || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{shipment.receiver_address || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{shipment.package_type || 'Standard'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status || '')}`}>
                              {shipment.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {shipment.date_registered ? new Date(shipment.date_registered).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${shipment.shipment_cost || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                              <Link 
                                to={`/track?id=${shipment.tracking_number}`}
                                className="text-blue-600 hover:text-blue-900 cursor-pointer"
                                title="View Details"
                              >
                          <i className="ri-eye-line"></i>
                              </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
              ) : (
            <div className="text-center py-12">
              <i className="ri-inbox-line text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'You haven\'t created any shipments yet.'}
                  </p>
                  {!searchTerm && selectedFilter === 'all' && (
                    <Link 
                      to="/dashboard/register-package"
                      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Create Your First Shipment
                    </Link>
                  )}
            </div>
          )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ShipmentHistoryPage;
