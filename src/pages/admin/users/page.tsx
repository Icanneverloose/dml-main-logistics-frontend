import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../lib/api';
import { toast } from '../../../components/Toast';
import { ConfirmModal } from '../../../components/ConfirmModal';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Manager' | 'Support';
  created_at: string;
  last_login: string | null;
  status: 'Active' | 'Inactive';
}

const AdminUsers = () => {
  const { user: currentUser, canManageUsers, isSuperAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; userId: string | null }>({
    isOpen: false,
    userId: null
  });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Support' as 'Super Admin' | 'Manager' | 'Support'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasCheckedAccessRef = useRef(false);
  const lastUserIdRef = useRef<string | undefined>(undefined);

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getAdminUsers() as any;
      
      // Handle different response formats
      let usersData: any[] = [];
      
      if (response && Array.isArray(response)) {
        // Response is directly an array
        usersData = response;
      } else if (response && response.users && Array.isArray(response.users)) {
        // Response has users array
        usersData = response.users;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Response has data array
        usersData = response.data;
      } else if (response && response.success && response.users) {
        // Response with success flag
        usersData = response.users;
      }
      
      if (usersData.length > 0) {
        // Map backend response to our format
        const mappedUsers = usersData.map((user: any) => ({
          id: user.id || user._id || user.userId || user.user_id,
          name: user.name || user.fullName || user.full_name || 'Unknown',
          email: user.email || user.emailAddress || 'unknown@example.com',
          role: user.role || user.userRole || user.user_role || 'Support',
          created_at: user.created_at || user.createdAt || user.created || user.dateCreated || new Date().toISOString(),
          last_login: user.last_login || user.lastLogin || user.lastLoginAt || user.last_login_at || null,
          status: user.status || user.accountStatus || user.account_status || 'Active'
        }));
        setUsers(mappedUsers);
      } else {
        // No users found - show empty state
        setUsers([]);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      let errorMessage = 'Could not load users. ';
      let detailedError = '';
      
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        errorMessage += 'Please check your authentication.';
        detailedError = 'You are not logged in or your session has expired. Please log in again.';
      } else if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
        errorMessage += 'You do not have permission to access user management.';
        detailedError = 'Your account does not have admin privileges. Please contact your administrator.';
      } else if (error.message?.includes('404') || error.message?.includes('Not Found')) {
        errorMessage += 'User endpoint not found.';
        detailedError = 'The /api/admin/users endpoint is not available on the backend. Please check if the backend is running and the endpoint is implemented.';
      } else if (error.message?.includes('Network') || error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        errorMessage += 'Please check your connection to the backend server.';
        detailedError = 'Cannot connect to the backend server. Please ensure:\n1. Backend is running on http://localhost:5000\n2. Backend has the /api/admin/users endpoint\n3. CORS is enabled';
      } else {
        errorMessage += error.message || 'Please check your connection.';
        detailedError = error.message || 'Unknown error occurred. Check browser console for details.';
      }
      
      console.error('Detailed error:', detailedError);
      toast.error(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since fetchUsers doesn't depend on any props/state

  useEffect(() => {
    // Protect route - only Super Admin can access
    // Prevent multiple checks to avoid blinking
    if (authLoading) {
      return; // Wait for auth to finish loading
    }

    // Reset check if user ID actually changes
    if (currentUser?.id !== lastUserIdRef.current) {
      hasCheckedAccessRef.current = false;
      lastUserIdRef.current = currentUser?.id;
    }

    // Prevent multiple checks/redirects
    if (hasCheckedAccessRef.current) {
      return;
    }

    if (!currentUser) {
      hasCheckedAccessRef.current = true;
      navigate('/auth/signin');
      return;
    }

    // Check if user is Super Admin
    const userRole = currentUser.role?.toLowerCase() || '';
    const isSuperAdminUser = userRole === 'admin' || userRole === 'super admin' || userRole === 'superadmin';
    
    if (!isSuperAdminUser) {
      hasCheckedAccessRef.current = true;
      toast.error('Access denied. Only Super Admin can manage users.');
      navigate('/admin');
      return;
    }

    // Only fetch users if user is Super Admin
    hasCheckedAccessRef.current = true;
    fetchUsers();
  }, [currentUser?.id, authLoading, navigate, fetchUsers]);

  const roleColors = {
    'Super Admin': 'bg-red-100 text-red-800',
    'Manager': 'bg-blue-100 text-blue-800',
    'Support': 'bg-green-100 text-green-800'
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isUserSuperAdmin = isSuperAdmin(); // Check if current user is Super Admin

  const handleDeleteClick = (userId: string) => {
    setDeleteConfirm({ isOpen: true, userId });
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate password length
    if (newUser.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.createAdminUser({
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        password: newUser.password,
        role: newUser.role
      }) as any;

      if (response.success) {
        toast.success('User created successfully');
        setIsAddModalOpen(false);
        setNewUser({
          name: '',
          email: '',
          password: '',
          role: 'Support'
        });
        await fetchUsers();
      } else {
        toast.error(response.error || 'Failed to create user');
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirm.userId) return;

    try {
      const response = await api.deleteAdminUser(deleteConfirm.userId) as any;
      if (response.success) {
        toast.success('User deleted successfully');
        await fetchUsers();
        setDeleteConfirm({ isOpen: false, userId: null });
      } else {
        toast.error(response.error || 'Failed to delete user');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user. Please check if the backend endpoint is implemented.');
      setDeleteConfirm({ isOpen: false, userId: null });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <i className="ri-loader-4-line text-4xl text-[#009FE3] animate-spin mb-4"></i>
          <p className="text-gray-500">Loading users...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#003366]">User Management</h1>
            <p className="text-gray-600 mt-1">Manage admin users and access roles</p>
          </div>
          {isUserSuperAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#009FE3] text-white px-6 py-2 rounded-lg hover:bg-[#007bb3] transition-colors flex items-center"
            >
              <i className="ri-user-add-line mr-2"></i>
              Add User
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-[#003366] mt-2">{users.length}</p>
              </div>
              <i className="ri-team-line text-3xl text-[#009FE3]"></i>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Super Admins</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {users.filter(u => u.role === 'Super Admin').length}
                </p>
              </div>
              <i className="ri-shield-user-line text-3xl text-red-600"></i>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Managers</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {users.filter(u => u.role === 'Manager').length}
                </p>
              </div>
              <i className="ri-user-settings-line text-3xl text-blue-600"></i>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Support Staff</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {users.filter(u => u.role === 'Support').length}
                </p>
              </div>
              <i className="ri-customer-service-line text-3xl text-green-600"></i>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                  {isUserSuperAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={isUserSuperAdmin ? 6 : 5} className="px-6 py-12 text-center">
                      <i className="ri-user-line text-4xl text-gray-400 mb-4"></i>
                      <p className="text-gray-500">No users found</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                      </td>
                      {isUserSuperAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-[#009FE3] hover:text-[#007bb3]"
                              title="Edit User"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            {user.id !== currentUser?.id && (
                              <button
                                onClick={() => handleDeleteClick(user.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete User"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#003366]">Add New User</h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewUser({ name: '', email: '', password: '', role: 'Support' });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label htmlFor="new-user-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="new-user-name"
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="new-user-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="new-user-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="new-user-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="new-user-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password (min. 6 characters)"
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>

              <div>
                <label htmlFor="new-user-role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="new-user-role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'Super Admin' | 'Manager' | 'Support' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent"
                  disabled={isSubmitting}
                >
                  <option value="Support">Support</option>
                  <option value="Manager">Manager</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setNewUser({ name: '', email: '', password: '', role: 'Support' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#009FE3] text-white rounded-lg hover:bg-[#007bb3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  disabled={isSubmitting || !newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-user-add-line"></i>
                      <span>Create User</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteConfirm({ isOpen: false, userId: null })}
      />
    </AdminLayout>
  );
};

export default AdminUsers;

