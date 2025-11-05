import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { signOut, user, isSupport, isManager, isSuperAdmin, canManageUsers } = useAuth();

  // Define all navigation items with their required roles
  const allNavigationItems = [
    { name: 'Dashboard', href: '/admin', icon: 'ri-dashboard-line', roles: ['support', 'manager', 'superadmin'] },
    { name: 'Register Shipment', href: '/admin/register-shipment', icon: 'ri-add-circle-line', roles: ['manager', 'superadmin'] },
    { name: 'Manage Shipments', href: '/admin/shipments', icon: 'ri-truck-line', roles: ['manager', 'superadmin'] },
    { name: 'Customers', href: '/admin/customers', icon: 'ri-user-line', roles: ['manager', 'superadmin'] },
    { name: 'Chat Management', href: '/admin/chat', icon: 'ri-message-3-line', roles: ['support', 'manager', 'superadmin'] },
    { name: 'PDF Receipts', href: '/admin/receipts', icon: 'ri-file-pdf-line', roles: ['manager', 'superadmin'] },
    { name: 'User Management', href: '/admin/users', icon: 'ri-user-settings-line', roles: ['superadmin'] },
    { name: 'System Logs', href: '/admin/logs', icon: 'ri-file-list-line', roles: ['manager', 'superadmin'] },
    { name: 'Settings', href: '/admin/settings', icon: 'ri-settings-line', roles: ['manager', 'superadmin'] },
  ];

  // Filter navigation based on user role
  const getNavigation = () => {
    if (!user) return [];
    
    const userRole = user.role?.toLowerCase() || '';
    
    return allNavigationItems.filter(item => {
      if (userRole === 'support') {
        return item.roles.includes('support');
      } else if (userRole === 'manager') {
        return item.roles.includes('manager') || item.roles.includes('superadmin');
      } else if (userRole === 'admin' || userRole === 'super admin' || userRole === 'superadmin') {
        return true; // Super Admin has access to everything
      }
      return false;
    });
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-[#003366] shadow-xl transition-all duration-300 flex-shrink-0 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#004080]">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#009FE3] rounded-lg flex items-center justify-center">
                  <i className="ri-truck-line text-white text-xl"></i>
                </div>
                <div>
                  <span className="text-lg font-bold text-white">DML Logistics</span>
                  <p className="text-[#009FE3] text-xs">Admin Panel</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 text-white/70 hover:text-white hover:bg-[#004080] rounded-lg transition-colors"
            >
              <i className={`${isSidebarCollapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'} text-lg`}></i>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#009FE3] text-white shadow-lg'
                    : 'text-white/80 hover:bg-[#004080] hover:text-white'
                }`}
                title={isSidebarCollapsed ? item.name : ''}
              >
                <i className={`${item.icon} text-lg ${isSidebarCollapsed ? 'mx-auto' : 'mr-3'}`}></i>
                {!isSidebarCollapsed && (
                  <span className="whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {!isSidebarCollapsed && user && (
          <div className="p-4 border-t border-[#004080]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#009FE3] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{user.name || 'Admin'}</p>
                <p className="text-white/60 text-xs truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-[#003366]">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="ri-home-line text-base mr-2"></i>
                  Back to Website
                </Link>
                
                <button
                  onClick={async () => {
                    await signOut();
                    window.location.href = '/';
                  }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="ri-logout-box-line text-base mr-2"></i>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-[#F5F7FA] overflow-y-auto">
          <div className="p-6">
          {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
