import React, { useState, useEffect } from 'react';
import { useShipments, type Shipment } from '../../../hooks/useShipments';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardOverview = () => {
  const { shipments, loading } = useShipments();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    delivered: 0,
    delayed: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    if (shipments && shipments.length > 0) {
      const total = shipments.length;
      const delivered = shipments.filter(s => s.status?.toLowerCase() === 'delivered').length;
      const inTransit = shipments.filter(s => 
        s.status?.toLowerCase() === 'in transit' || 
        s.status?.toLowerCase() === 'out for delivery' ||
        s.status?.toLowerCase() === 'at facility'
      ).length;
      const delayed = shipments.filter(s => s.status?.toLowerCase() === 'delayed').length;
      const cancelled = shipments.filter(s => s.status?.toLowerCase() === 'cancelled').length;
      const active = total - delivered - cancelled;
      const totalRevenue = shipments.reduce((sum, s) => sum + (parseFloat(s.shipment_cost?.toString()) || 0), 0);

      setStats({
        total,
        active,
        delivered,
        delayed,
        cancelled,
        totalRevenue
      });
    }
  }, [shipments]);

  // Prepare chart data
  const statusData = [
    { name: 'Delivered', value: stats.delivered, color: '#10B981' },
    { name: 'Active', value: stats.active, color: '#3B82F6' },
    { name: 'Delayed', value: stats.delayed, color: '#F59E0B' },
    { name: 'Cancelled', value: stats.cancelled, color: '#EF4444' },
  ];

  // Monthly shipment data (sample - would be from backend)
  const monthlyData = [
    { month: 'Jan', shipments: 45, revenue: 12500 },
    { month: 'Feb', shipments: 52, revenue: 14500 },
    { month: 'Mar', shipments: 48, revenue: 13800 },
    { month: 'Apr', shipments: 61, revenue: 16800 },
    { month: 'May', shipments: 55, revenue: 15200 },
    { month: 'Jun', shipments: 67, revenue: 18500 },
  ];

  const recentShipments = shipments.slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <i className="ri-loader-4-line text-4xl text-[#009FE3] animate-spin mb-4"></i>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shipments</p>
              <p className="text-3xl font-bold text-[#003366] mt-2">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">All time shipments</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <i className="ri-truck-line text-2xl text-[#009FE3]"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Shipments</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.active}</p>
              <p className="text-xs text-gray-500 mt-1">In progress</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <i className="ri-time-line text-2xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.delivered}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.total > 0 ? `${Math.round((stats.delivered / stats.total) * 100)}% success rate` : '0%'}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <i className="ri-check-double-line text-2xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-gray-500 mt-1">From all shipments</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-2xl text-purple-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#003366]">Shipment Status</h3>
          </div>
          <div className="flex items-center justify-center h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#003366]">Monthly Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="shipments" stroke="#009FE3" strokeWidth={2} name="Shipments" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#003366]">Recent Shipments</h3>
          <Link 
            to="/admin/shipments" 
            className="text-[#009FE3] hover:text-[#007bb3] text-sm font-medium flex items-center"
          >
            View All
            <i className="ri-arrow-right-line ml-1"></i>
          </Link>
        </div>
        <div className="p-6">
          {recentShipments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender → Receiver</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#003366] font-mono">{shipment.tracking_number}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{shipment.sender_name}</div>
                        <div className="text-sm text-gray-500">→ {shipment.receiver_name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          shipment.status === 'Delivered' 
                            ? 'bg-green-100 text-green-800'
                            : shipment.status === 'In Transit' || shipment.status === 'Out for Delivery'
                            ? 'bg-blue-100 text-blue-800'
                            : shipment.status === 'Delayed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : shipment.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {shipment.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${parseFloat(shipment.shipment_cost?.toString() || '0').toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shipment.date_registered 
                          ? new Date(shipment.date_registered).toLocaleDateString()
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="ri-inbox-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-500">No shipments found</p>
              <Link 
                to="/admin/register-shipment" 
                className="mt-4 inline-block text-[#009FE3] hover:text-[#007bb3] text-sm font-medium"
              >
                Register your first shipment
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
