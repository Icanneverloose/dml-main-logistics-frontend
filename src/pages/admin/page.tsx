import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import DashboardOverview from './components/DashboardOverview';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboardPage = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    // Only redirect after loading is complete
    if (!loading) {
      if (!user) {
        // Check if it's a backend connection error
        const checkBackend = async () => {
          try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/ping`, {
              method: 'GET',
              credentials: 'include'
            });
          } catch (error) {
            setBackendError(true);
            return; // Don't redirect if backend is down, show error instead
          }
          navigate('/auth/signin', { replace: true });
        };
        checkBackend();
      } else {
        // Check role explicitly (case-insensitive)
        // Admin roles: admin, super admin, superadmin, manager, support
        const userRole = user.role?.toLowerCase() || '';
        const isAdminUser = userRole === 'admin' || 
                           userRole === 'super admin' || 
                           userRole === 'superadmin' ||
                           userRole === 'manager' ||
                           userRole === 'support';
        
        if (!isAdminUser) {
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [user, loading, isAdmin, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-[#009FE3] animate-spin mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show backend error if backend is not accessible
  if (backendError) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <i className="ri-error-warning-line text-5xl text-red-500 mb-4"></i>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Backend Server Not Available</h1>
            <p className="text-gray-600 mb-6">
              Cannot connect to the backend server. Please ensure:
            </p>
            <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
              <li>• Backend is running on <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5000</code></li>
              <li>• CORS is enabled for <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code></li>
              <li>• All required API endpoints are implemented</li>
            </ul>
            <div className="space-y-3">
              <Link
                to="/admin/test-connection"
                className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test Backend Connection
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Wait for auth check before showing content
  if (!user) {
    return null;
  }

  // Check if user is admin (double-check here too)
  // Admin roles: admin, super admin, superadmin, manager, support
  const userRole = user.role?.toLowerCase() || '';
  const isAdminUser = userRole === 'admin' || 
                     userRole === 'super admin' || 
                     userRole === 'superadmin' ||
                     userRole === 'manager' ||
                     userRole === 'support';

  if (!isAdminUser) {
    return null; // Will redirect via useEffect
  }

  return (
    <AdminLayout>
      <DashboardOverview />
    </AdminLayout>
  );
};

export default AdminDashboardPage;
