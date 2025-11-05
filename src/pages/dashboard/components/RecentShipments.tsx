
import React from 'react';
import { Link } from 'react-router-dom';
import { useShipments } from '../../../hooks/useShipments';

const RecentShipments = () => {
  const { shipments, loading } = useShipments();
  const recentShipments = shipments.slice(0, 5);

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'delivered') return 'bg-green-100 text-green-800';
    if (statusLower === 'in transit' || statusLower === 'out for delivery') return 'bg-blue-100 text-blue-800';
    if (statusLower === 'delayed') return 'bg-red-100 text-red-800';
    if (statusLower === 'cancelled') return 'bg-gray-100 text-gray-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Shipments</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <i className="ri-loader-4-line text-3xl text-blue-600 animate-spin mb-2"></i>
            <p className="text-gray-500">Loading shipments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Recent Shipments</h3>
        {shipments.length > 0 && (
          <Link 
            to="/dashboard/shipment-history" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
          >
            View all
          </Link>
        )}
      </div>
      <div className="p-6">
        {recentShipments.length > 0 ? (
          <div className="space-y-4">
            {recentShipments.map((shipment) => (
              <Link
                key={shipment.id}
                to={`/track?id=${shipment.tracking_number}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="ri-package-line text-blue-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 font-mono">
                          {shipment.tracking_number}
                        </p>
                        <p className="text-sm text-gray-600">
                          {shipment.sender_name} → {shipment.receiver_name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status || '')}`}>
                      {shipment.status || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-600">
                      {shipment.date_registered ? new Date(shipment.date_registered).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="ri-truck-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-500">No shipments yet</p>
            <p className="text-gray-400 text-sm">Your recent shipments will appear here</p>
            <Link 
              to="/dashboard/register-package" 
              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              Create First Shipment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentShipments;
