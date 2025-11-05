import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../../lib/api';

interface ActivityLog {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: string;
  type: 'shipment' | 'user' | 'system' | 'pdf';
}

const AdminLogs = () => {
  const [filter, setFilter] = useState<'all' | 'shipment' | 'user' | 'system' | 'pdf'>('all');
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.getSystemLogs({
        type: filter === 'all' ? undefined : filter
      }) as any;
      
      if (response.success && response.logs) {
        setLogs(response.logs);
      } else if (response.logs) {
        setLogs(response.logs);
      } else if (Array.isArray(response)) {
        setLogs(response);
      } else {
        // Fallback mock data if API not available
        setLogs([
          {
            id: '1',
            action: 'Shipment Created',
            user: 'Admin User',
            details: 'Created shipment TRK123456789',
            timestamp: new Date().toISOString(),
            type: 'shipment'
          }
        ]);
      }
    } catch (error: any) {
      console.error('Error fetching logs:', error);
      // Fallback to empty array on error
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.type === filter);

  const typeColors = {
    shipment: 'bg-blue-100 text-blue-800',
    user: 'bg-purple-100 text-purple-800',
    system: 'bg-gray-100 text-gray-800',
    pdf: 'bg-red-100 text-red-800'
  };

  const typeIcons = {
    shipment: 'ri-truck-line',
    user: 'ri-user-line',
    system: 'ri-computer-line',
    pdf: 'ri-file-pdf-line'
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#003366]">System Activity Logs</h1>
          <p className="text-gray-600 mt-1">View all admin actions and system activities</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Logs</p>
                <p className="text-3xl font-bold text-[#003366] mt-2">{logs.length}</p>
              </div>
              <i className="ri-file-list-line text-3xl text-[#009FE3]"></i>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shipment Actions</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {logs.filter(l => l.type === 'shipment').length}
                </p>
              </div>
              <i className="ri-truck-line text-3xl text-blue-600"></i>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">User Actions</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {logs.filter(l => l.type === 'user').length}
                </p>
              </div>
              <i className="ri-user-line text-3xl text-purple-600"></i>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">PDF Generations</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {logs.filter(l => l.type === 'pdf').length}
                </p>
              </div>
              <i className="ri-file-pdf-line text-3xl text-red-600"></i>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            {(['all', 'shipment', 'user', 'pdf', 'system'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === type
                    ? 'bg-[#009FE3] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All Logs' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <i className="ri-loader-4-line text-3xl text-[#009FE3] animate-spin mb-4"></i>
                      <p className="text-gray-500">Loading logs...</p>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <i className="ri-file-list-line text-4xl text-gray-400 mb-4"></i>
                      <p className="text-gray-500">No logs found</p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center space-x-1 w-fit ${typeColors[log.type]}`}>
                          <i className={typeIcons[log.type]}></i>
                          <span>{log.type}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{log.user}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{log.details}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLogs;

