
import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminReports = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState('last-30-days');

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Generate business insights and performance reports</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-file-chart-line mr-2"></i>
            Generate Report
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-2xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">$0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-truck-line text-2xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shipments</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-2xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-percent-line text-2xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-semibold text-gray-900">0%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Generator */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Report Generator</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                >
                  <option value="">Select report type</option>
                  <option value="revenue">Revenue Report</option>
                  <option value="shipments">Shipments Report</option>
                  <option value="customers">Customer Report</option>
                  <option value="performance">Performance Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                >
                  <option value="last-7-days">Last 7 days</option>
                  <option value="last-30-days">Last 30 days</option>
                  <option value="last-90-days">Last 90 days</option>
                  <option value="last-year">Last year</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-file-chart-line mr-2"></i>
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <i className="ri-file-chart-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-500 text-lg">No reports generated yet</p>
              <p className="text-gray-400 text-sm">Generate your first report to see analytics</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
