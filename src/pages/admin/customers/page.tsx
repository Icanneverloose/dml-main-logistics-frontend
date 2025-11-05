import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../../lib/api';
import { toast } from '../../../components/Toast';

interface Customer {
  id: string;
  name: string;
  email: string;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.getFrontendUsers() as any;
      
      // Handle different response formats
      let usersData: any[] = [];
      
      if (response && Array.isArray(response)) {
        usersData = response;
      } else if (response && response.customers && Array.isArray(response.customers)) {
        usersData = response.customers;
      } else if (response && response.users && Array.isArray(response.users)) {
        usersData = response.users;
      } else if (response && response.data && Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response && response.success && response.customers) {
        usersData = response.customers;
      } else if (response && response.success && response.users) {
        usersData = response.users;
      }

      // Filter out admin users and map to Customer format
      const frontendUsers = usersData
        .filter((user: any) => {
          const role = (user.role || '').toLowerCase();
          // Exclude admin, super admin, manager, and support roles
          return role !== 'admin' && 
                 role !== 'super admin' && 
                 role !== 'superadmin' &&
                 role !== 'manager' &&
                 role !== 'support';
        })
        .map((user: any) => ({
          id: user.id || user._id || user.userId || user.user_id || user.email,
          name: user.name || user.fullName || user.full_name || 'Unknown',
          email: user.email || user.emailAddress || 'unknown@example.com'
        }));

      setCustomers(frontendUsers);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers. Please try again.');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const term = searchTerm.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term)
    );
  }, [customers, searchTerm]);

  const stats = {
    total: customers.length
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <i className="ri-loader-4-line text-4xl text-[#009FE3] animate-spin mb-4"></i>
          <p className="text-gray-500">Loading customers...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#003366]">Customer Management</h1>
          <p className="text-gray-600 mt-1">View frontend users who signed up through the website</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-[#003366] mt-2">{stats.total}</p>
              </div>
              <i className="ri-user-line text-3xl text-[#009FE3]"></i>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="space-y-4">
          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-12 text-center">
                        <i className="ri-user-line text-4xl text-gray-400 mb-4"></i>
                        <p className="text-gray-500">No customers found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr 
                        key={customer.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
