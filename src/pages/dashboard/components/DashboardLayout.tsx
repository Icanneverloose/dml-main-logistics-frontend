
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { signOut, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/signin', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ri-truck-line text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">DML Logistics</span>
          </Link>

              <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-700">
                  <span>{user.name}</span>
                </div>
              )}
                <button
                  onClick={async () => {
                    await signOut();
                    window.location.href = '/';
                  }}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                <i className="ri-logout-box-line mr-2"></i>
                <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
      <main className="p-4 sm:p-6">
          {children}
        </main>
    </div>
  );
};

export default DashboardLayout;
