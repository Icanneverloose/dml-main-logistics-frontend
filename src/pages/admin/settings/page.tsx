import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { toast } from '../../../components/Toast';
import { api } from '../../../lib/api';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    companyName: 'DML Logistics',
    companyEmail: 'info@dmllogistics.com',
    companyPhone: '+1 (555) 123-4567',
    companyAddress: '123 Logistics Way, New York, NY 10001',
    defaultCurrency: 'USD',
    defaultTimezone: 'America/New_York',
    defaultDeliveryDays: 7,
    autoEmailPDF: true,
    notificationEmail: 'notifications@dmllogistics.com'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.getSettings() as any;
      if (response.success && response.settings) {
        setSettings(response.settings);
      } else if (response.settings) {
        setSettings(response.settings);
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      // Keep default settings if API not available
    } finally {
      setLoading(false);
    }
  };

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];
  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ];

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await api.saveSettings(settings) as any;
      if (response.success) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error(response.error || 'Failed to save settings');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings. Please check if the backend endpoint is implemented.');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <i className="ri-loader-4-line text-4xl text-[#009FE3] animate-spin mb-4"></i>
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#003366]">Global Settings</h1>
          <p className="text-gray-600 mt-1">Configure company information and system preferences</p>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#003366]">Company Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
                <input
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => handleChange('companyEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Phone</label>
                <input
                  type="tel"
                  value={settings.companyPhone}
                  onChange={(e) => handleChange('companyPhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
              <textarea
                value={settings.companyAddress}
                onChange={(e) => handleChange('companyAddress', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Global Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#003366]">Global Preferences</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                <select
                  value={settings.defaultCurrency}
                  onChange={(e) => handleChange('defaultCurrency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Timezone</label>
                <select
                  value={settings.defaultTimezone}
                  onChange={(e) => handleChange('defaultTimezone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Estimated Delivery Days</label>
              <input
                type="number"
                min="1"
                value={settings.defaultDeliveryDays}
                onChange={(e) => handleChange('defaultDeliveryDays', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">Default number of days for estimated delivery</p>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#003366]">Email & Notifications</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">Auto-email PDF Receipts</label>
                <p className="text-xs text-gray-500 mt-1">Automatically email PDF receipts to customers when shipments are registered</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoEmailPDF}
                  onChange={(e) => handleChange('autoEmailPDF', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#009FE3]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#009FE3]"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notification Email</label>
              <input
                type="email"
                value={settings.notificationEmail}
                onChange={(e) => handleChange('notificationEmail', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">Email address for system notifications</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#009FE3] text-white rounded-lg hover:bg-[#007bb3] transition-colors flex items-center"
          >
            <i className="ri-save-line mr-2"></i>
            Save Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

