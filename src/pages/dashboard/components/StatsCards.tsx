
import React, { useMemo } from 'react';
import { useShipments } from '../../../hooks/useShipments';

const StatsCards = () => {
  const { shipments, loading } = useShipments();

  const stats = useMemo(() => {
    if (!shipments || shipments.length === 0) {
      return {
        active: 0,
        delivered: 0,
        pending: 0,
        totalSpent: 0
      };
    }

    const active = shipments.filter(s => 
      s.status?.toLowerCase() !== 'delivered' && 
      s.status?.toLowerCase() !== 'cancelled'
    ).length;
    
    const delivered = shipments.filter(s => 
      s.status?.toLowerCase() === 'delivered'
    ).length;
    
    const pending = shipments.filter(s => 
      s.status?.toLowerCase() === 'registered' || 
      s.status?.toLowerCase() === 'pending' ||
      s.status?.toLowerCase() === 'at facility'
    ).length;
    
    const totalSpent = shipments.reduce((sum, s) => 
      sum + (parseFloat(s.shipment_cost?.toString() || '0')), 0
    );

    return { active, delivered, pending, totalSpent };
  }, [shipments]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i className="ri-truck-line text-2xl text-blue-600"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Active Shipments</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i className="ri-check-line text-2xl text-green-600"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Delivered</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.delivered}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <i className="ri-time-line text-2xl text-yellow-600"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i className="ri-money-dollar-circle-line text-2xl text-purple-600"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Spent</p>
            <p className="text-2xl font-semibold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
