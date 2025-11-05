
import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const actions = [
    {
      title: 'Register Package',
      description: 'Create a new shipment',
      icon: 'ri-add-box-line',
      color: 'bg-blue-600 hover:bg-blue-700',
      link: '/dashboard/register-package'
    },
    {
      title: 'Track Shipment',
      description: 'Track your packages',
      icon: 'ri-map-pin-line',
      color: 'bg-green-600 hover:bg-green-700',
      link: '/dashboard/track-shipment'
    },
    {
      title: 'Shipment History',
      description: 'View past shipments',
      icon: 'ri-history-line',
      color: 'bg-purple-600 hover:bg-purple-700',
      link: '/dashboard/shipment-history'
    },
    {
      title: 'Get Quote',
      description: 'Calculate shipping costs',
      icon: 'ri-calculator-line',
      color: 'bg-orange-600 hover:bg-orange-700',
      link: '/dashboard/calculator'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`${action.color} text-white p-4 rounded-lg transition-colors cursor-pointer block`}
          >
            <div className="flex items-center space-x-3">
              <i className={`${action.icon} text-2xl`}></i>
              <div>
                <h3 className="font-semibold whitespace-nowrap">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
