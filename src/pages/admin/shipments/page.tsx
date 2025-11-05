import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useShipments, type Shipment } from '../../../hooks/useShipments';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../lib/api';
import ShipmentDetailModal from './components/ShipmentDetailModal';
import StatusUpdateModal from './components/StatusUpdateModal';
import EditShipmentModal from './components/EditShipmentModal';
import { toast } from '../../../components/Toast';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { generatePDFReceipt } from '../../../utils/pdfGenerator';

type SortField = 'tracking_number' | 'sender_name' | 'receiver_name' | 'status' | 'date_registered' | 'shipment_cost';
type SortDirection = 'asc' | 'desc';

const AdminShipments = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { shipments, loading, refetch } = useShipments();
  
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('date_registered');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; shipment: Shipment | null }>({
    isOpen: false,
    shipment: null
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth/signin');
      } else if (!isAdmin) {
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, isAdmin, navigate]);
  
  // Note: useShipments hook already fetches shipments when user changes
  // No need for additional useEffect here to avoid infinite loops

  // Filter and sort shipments
  const filteredAndSortedShipments = useMemo(() => {
    let filtered = shipments.filter(shipment => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (shipment.tracking_number?.toLowerCase().includes(searchLower) || false) ||
        shipment.sender_name.toLowerCase().includes(searchLower) ||
        shipment.sender_email.toLowerCase().includes(searchLower) ||
        shipment.receiver_name.toLowerCase().includes(searchLower) ||
        shipment.receiver_phone?.toLowerCase().includes(searchLower) ||
        (shipment.status?.toLowerCase().includes(searchLower) || false);
      
      const matchesStatus = statusFilter === 'all' || 
        shipment.status?.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'tracking_number':
          aValue = a.tracking_number || '';
          bValue = b.tracking_number || '';
          break;
        case 'sender_name':
          aValue = a.sender_name;
          bValue = b.sender_name;
          break;
        case 'receiver_name':
          aValue = a.receiver_name;
          bValue = b.receiver_name;
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'date_registered':
          aValue = new Date(a.date_registered || 0).getTime();
          bValue = new Date(b.date_registered || 0).getTime();
          break;
        case 'shipment_cost':
          aValue = parseFloat(a.shipment_cost?.toString() || '0');
          bValue = parseFloat(b.shipment_cost?.toString() || '0');
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' 
          ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0)
          : (aValue > bValue ? -1 : aValue < bValue ? 1 : 0);
      }
    });

    return filtered;
  }, [shipments, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleViewDetails = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsStatusModalOpen(true);
  };

  const handleEditShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (shipment: Shipment) => {
    setDeleteConfirm({ isOpen: true, shipment });
  };

  const handleDeleteShipment = async () => {
    if (!deleteConfirm.shipment) return;

    const identifier = deleteConfirm.shipment.tracking_number || deleteConfirm.shipment.id;
    if (!identifier) {
      toast.error('Cannot delete shipment: missing identifier.');
      setDeleteConfirm({ isOpen: false, shipment: null });
      return;
    }

    try {
      // Use tracking_number if available, otherwise use ID
      const response = await api.deleteShipment(identifier) as any;
      
      if (response.success) {
        await refetch();
        toast.success(`Shipment ${deleteConfirm.shipment.tracking_number || deleteConfirm.shipment.id} deleted successfully`);
        setDeleteConfirm({ isOpen: false, shipment: null });
      } else {
        toast.error(response.error || 'Failed to delete shipment');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete shipment. Please check if the backend endpoint is implemented.');
      setDeleteConfirm({ isOpen: false, shipment: null });
    }
  };

  const handleGeneratePDF = async (shipment: Shipment) => {
    const identifier = shipment.tracking_number || shipment.id;
    if (!identifier) {
      toast.error('Cannot generate PDF for shipment without tracking number or ID.');
      return;
    }

    try {
      // Try to get PDF from backend first
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const url = `${apiUrl}/shipments/${identifier}/pdf`;
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/pdf'
        }
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/pdf')) {
        // Backend returned PDF blob
        const blob = await response.blob();
        
        // Validate blob
        if (!blob || blob.size === 0) {
          throw new Error('Backend returned empty PDF');
        }
        
        // Verify it's actually a PDF by checking the first bytes
        const arrayBuffer = await blob.slice(0, 4).arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        // PDF files start with %PDF
        if (uint8Array[0] !== 0x25 || uint8Array[1] !== 0x50 || uint8Array[2] !== 0x44 || uint8Array[3] !== 0x46) {
          throw new Error('Backend response is not a valid PDF');
        }
        
        const url_obj = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url_obj;
        link.download = `receipt-${identifier}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(url_obj), 100);
        toast.success('PDF downloaded successfully');
        return;
      }

      // If backend doesn't return PDF, try fallback
      throw new Error('Backend did not return PDF');
    } catch (error: any) {
      // If backend fails, generate PDF client-side as fallback
      console.error('Backend PDF error:', error);
      try {
        if (!shipment.tracking_number && !shipment.id) {
          toast.error('Cannot generate PDF: missing shipment identifier');
          return;
        }
        
        // Generate PDF client-side
        const pdfBlob = generatePDFReceipt(shipment);
        
        // Validate generated blob
        if (!pdfBlob || pdfBlob.size === 0) {
          throw new Error('PDF generation produced an empty blob');
        }
        
        const url_obj = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url_obj;
        link.download = `receipt-${identifier}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(url_obj), 100);
        toast.success('PDF generated and downloaded successfully');
      } catch (pdfError: any) {
        console.error('PDF generation error:', pdfError);
        toast.error(`Failed to generate PDF: ${pdfError.message || 'Unknown error'}`);
      }
    }
  };

  const handleEmailPDF = async (shipment: Shipment) => {
    if (!shipment.tracking_number) {
      toast.error('Cannot email PDF for shipment without tracking number. Please assign a tracking number first.');
      return;
    }

    try {
      const email = shipment.receiver_email || shipment.sender_email;
      if (!email) {
        toast.warning('No email address available for this shipment');
        return;
      }

      const response = await api.emailPDF(shipment.tracking_number, email) as any;
      
      if (response.success) {
        toast.success(`PDF sent to ${email} successfully`);
      } else {
        toast.error(response.error || 'Failed to send email. Please check if the backend endpoint is implemented.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send email. Please check if the backend endpoint is implemented.');
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'delivered') return 'bg-green-100 text-green-800';
    if (statusLower === 'in transit' || statusLower === 'out for delivery') return 'bg-blue-100 text-blue-800';
    if (statusLower === 'delayed') return 'bg-yellow-100 text-yellow-800';
    if (statusLower === 'cancelled') return 'bg-red-100 text-red-800';
    if (statusLower === 'at facility') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <i className="ri-arrow-up-down-line text-gray-400"></i>;
    }
    return sortDirection === 'asc' 
      ? <i className="ri-arrow-up-line text-[#009FE3]"></i>
      : <i className="ri-arrow-down-line text-[#009FE3]"></i>;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-[#009FE3] animate-spin mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#003366]">Manage Shipments</h1>
            <p className="text-gray-600 mt-1">View, search, and manage all registered shipments</p>
          </div>
          <Link
            to="/admin/register-shipment"
            className="bg-[#009FE3] text-white px-6 py-2 rounded-lg hover:bg-[#007bb3] transition-colors flex items-center whitespace-nowrap"
          >
            <i className="ri-add-line mr-2"></i>
            Register New Shipment
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search by tracking number, sender, receiver, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
                />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009FE3] focus:border-transparent text-gray-900 bg-white"
              >
                <option value="all">All Status</option>
                <option value="registered">Registered</option>
                <option value="at facility">At Facility</option>
                <option value="in transit">In Transit</option>
                <option value="out for delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold text-[#003366]">{filteredAndSortedShipments.length}</p>
              </div>
              <i className="ri-truck-line text-2xl text-[#009FE3]"></i>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredAndSortedShipments.filter(s => 
                    s.status?.toLowerCase() !== 'delivered' && 
                    s.status?.toLowerCase() !== 'cancelled'
                  ).length}
                </p>
              </div>
              <i className="ri-time-line text-2xl text-blue-600"></i>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredAndSortedShipments.filter(s => s.status?.toLowerCase() === 'delivered').length}
                </p>
              </div>
              <i className="ri-check-double-line text-2xl text-green-600"></i>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${filteredAndSortedShipments.reduce((sum, s) => 
                    sum + (parseFloat(s.shipment_cost?.toString() || '0')), 0
                  ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <i className="ri-money-dollar-circle-line text-2xl text-purple-600"></i>
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <i className="ri-loader-4-line text-4xl text-[#009FE3] animate-spin mb-4"></i>
              <p className="text-gray-500">Loading shipments...</p>
            </div>
          ) : filteredAndSortedShipments.length === 0 ? (
            <div className="p-12 text-center">
              <i className="ri-truck-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-500 text-lg">No shipments found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Register your first shipment to get started'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link 
                  to="/admin/register-shipment"
                  className="mt-4 inline-block text-[#009FE3] hover:text-[#007bb3] font-medium"
                >
                  Register Shipment
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('tracking_number')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Tracking #</span>
                        <SortIcon field="tracking_number" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('sender_name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Sender</span>
                        <SortIcon field="sender_name" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('receiver_name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Receiver</span>
                        <SortIcon field="receiver_name" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        <SortIcon field="status" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('shipment_cost')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Cost</span>
                        <SortIcon field="shipment_cost" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('date_registered')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date</span>
                        <SortIcon field="date_registered" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {shipment.tracking_number ? (
                          <span className="text-sm font-medium text-[#003366] font-mono">
                            {shipment.tracking_number}
                          </span>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400 italic">Pending</span>
                            {shipment.registered_by_user && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                User Registered
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{shipment.sender_name}</div>
                        <div className="text-sm text-gray-500">{shipment.sender_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{shipment.receiver_name}</div>
                        <div className="text-sm text-gray-500">{shipment.receiver_phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(shipment.status || '')}`}>
                          {shipment.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${parseFloat(shipment.shipment_cost?.toString() || '0').toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shipment.date_registered 
                          ? new Date(shipment.date_registered).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(shipment)}
                            className="text-[#009FE3] hover:text-[#007bb3]"
                            title="View Details"
                          >
                            <i className="ri-eye-line"></i>
                          </button>
                          <button
                            onClick={() => handleEditShipment(shipment)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit Shipment"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(shipment)}
                            className="text-green-600 hover:text-green-800"
                            title="Update Status"
                          >
                            <i className="ri-time-line"></i>
                          </button>
                          <button
                            onClick={() => handleGeneratePDF(shipment)}
                            disabled={!shipment.tracking_number}
                            className={`${shipment.tracking_number ? 'text-purple-600 hover:text-purple-800' : 'text-gray-300 cursor-not-allowed'}`}
                            title={shipment.tracking_number ? "Generate PDF" : "Assign tracking number first"}
                          >
                            <i className="ri-file-pdf-line"></i>
                          </button>
                          {shipment.tracking_number && (
                            <button
                              onClick={() => handleEmailPDF(shipment)}
                              className="text-green-600 hover:text-green-800"
                              title="Email PDF"
                            >
                              <i className="ri-mail-line"></i>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(shipment)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedShipment && (
        <>
        <ShipmentDetailModal
          shipment={selectedShipment}
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedShipment(null);
            }}
            onStatusUpdate={async () => {
              await refetch();
              setIsDetailModalOpen(false);
            }}
            onGeneratePDF={handleGeneratePDF}
            onEmailPDF={handleEmailPDF}
          />
          <StatusUpdateModal
            shipment={selectedShipment}
            isOpen={isStatusModalOpen}
            onClose={() => {
              setIsStatusModalOpen(false);
              setSelectedShipment(null);
            }}
            onUpdate={async () => {
              await refetch();
              setIsStatusModalOpen(false);
              setSelectedShipment(null);
            }}
        />
        <EditShipmentModal
          shipment={selectedShipment}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedShipment(null);
          }}
          onUpdate={async () => {
            await refetch();
            setIsEditModalOpen(false);
            setSelectedShipment(null);
          }}
        />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Shipment"
        message={`Are you sure you want to delete shipment ${deleteConfirm.shipment?.tracking_number || 'without tracking number'}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDeleteShipment}
        onCancel={() => setDeleteConfirm({ isOpen: false, shipment: null })}
      />
    </AdminLayout>
  );
};

export default AdminShipments;
