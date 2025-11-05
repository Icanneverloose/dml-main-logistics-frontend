
import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminFleet = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fleet & Drivers</h1>
            <p className="text-gray-600">Manage vehicles and driver assignments</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-add-line mr-2"></i>
            Add {activeTab === 'vehicles' ? 'Vehicle' : 'Driver'}
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('vehicles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'vehicles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="ri-truck-line mr-2"></i>
                Vehicles
              </button>
              <button
                onClick={() => setActiveTab('drivers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'drivers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="ri-user-line mr-2"></i>
                Drivers
              </button>
            </nav>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'vehicles' ? (
              <div className="text-center py-12">
                <i className="ri-truck-line text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-500 text-lg">No vehicles registered</p>
                <p className="text-gray-400 text-sm">Add your first vehicle to start managing your fleet</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="ri-user-line text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-500 text-lg">No drivers registered</p>
                <p className="text-gray-400 text-sm">Add your first driver to start managing assignments</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFleet;
