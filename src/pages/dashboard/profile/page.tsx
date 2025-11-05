
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../../../hooks/useAuth';

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/signin', { replace: true });
    }
  }, [user, loading, navigate]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    company: 'ABC Corporation',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States'
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    deliveryUpdates: true,
    weeklyReports: false,
    language: 'en',
    timezone: 'EST',
    currency: 'USD'
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProfile = () => {
    // Handle save logic
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleSavePreferences = () => {
    // Handle save logic
    alert('Preferences updated successfully!');
  };

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
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-user-line mr-2"></i>
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'preferences'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-settings-line mr-2"></i>
                Preferences
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-shield-line mr-2"></i>
                Security
              </button>
            </nav>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={profileData.company}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    name="state"
                    value={profileData.state}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 pr-8"
                  >
                    <option value="NY">New York</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="IL">Illinois</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={profileData.zipCode}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    name="country"
                    value={profileData.country}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 pr-8"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                  </select>
                </div>

                {isEditing && (
                  <div className="md:col-span-2 flex gap-4">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={preferences.emailNotifications}
                        onChange={handlePreferenceChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">General email notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="deliveryUpdates"
                        checked={preferences.deliveryUpdates}
                        onChange={handlePreferenceChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Delivery status updates</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="marketingEmails"
                        checked={preferences.marketingEmails}
                        onChange={handlePreferenceChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Marketing and promotional emails</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="weeklyReports"
                        checked={preferences.weeklyReports}
                        onChange={handlePreferenceChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Weekly shipping reports</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">SMS Notifications</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={preferences.smsNotifications}
                      onChange={handlePreferenceChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Receive SMS notifications for important updates</span>
                  </label>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Regional Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        name="language"
                        value={preferences.language}
                        onChange={handlePreferenceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select
                        name="timezone"
                        value={preferences.timezone}
                        onChange={handlePreferenceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                      >
                        <option value="EST">Eastern Time</option>
                        <option value="CST">Central Time</option>
                        <option value="MST">Mountain Time</option>
                        <option value="PST">Pacific Time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select
                        name="currency"
                        value={preferences.currency}
                        onChange={handlePreferenceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="CAD">CAD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSavePreferences}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer">
                    Enable 2FA
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Login Sessions</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage your active login sessions across different devices.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Current Session</p>
                        <p className="text-sm text-gray-600">Chrome on Windows • New York, NY</p>
                      </div>
                      <span className="text-green-600 text-sm font-medium">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Mobile App</p>
                        <p className="text-sm text-gray-600">iPhone • Last active 2 hours ago</p>
                      </div>
                      <button className="text-red-600 text-sm font-medium cursor-pointer">Revoke</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
