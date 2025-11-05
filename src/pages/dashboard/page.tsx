
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import StatsCards from './components/StatsCards';
import RecentShipments from './components/RecentShipments';
import QuickActions from './components/QuickActions';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/signin', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your shipments today.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.role || 'User'} Account</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-blue-600"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Shipments */}
        <RecentShipments />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
