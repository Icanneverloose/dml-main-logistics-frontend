import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import { useAuth } from './useAuth'

export interface Shipment {
  id: string
  tracking_number?: string | null
  sender_name: string
  sender_email: string
  sender_phone: string
  sender_address: string
  receiver_name: string
  receiver_email?: string
  receiver_phone: string
  receiver_address: string
  package_type: string
  weight: number
  weight_unit?: string
  shipment_cost: number
  status: string
  date_registered: string
  estimated_delivery_date?: string
  destination_country?: string
  origin_country?: string
  pdf_url?: string
  qr_url?: string
  registered_by_user?: boolean
  pickup_location?: string
}

export interface StatusLog {
  status: string
  timestamp: string
  location?: string
  coordinates?: string
  note?: string
}

export const useShipments = () => {
  const { user } = useAuth()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchShipments = useCallback(async () => {
    try {
      setLoading(true)
      // For admin roles (admin, super admin, manager, support), get shipments based on role
      const userRole = user?.role?.toLowerCase() || ''
      const isAdminRole = userRole === 'admin' || 
                         userRole === 'super admin' || 
                         userRole === 'superadmin' ||
                         userRole === 'manager' ||
                         userRole === 'support'
      
      if (isAdminRole) {
        // Backend will filter based on role (manager sees only their own, super admin sees all)
        const response = await api.getAllShipments() as any
        console.log('getAllShipments response:', response)
        if (response.success && response.shipments) {
          console.log(`Loaded ${response.shipments.length} shipments`)
          // Map the response to ensure all fields are present
          const mappedShipments = response.shipments.map((s: any) => ({
            id: s.id || s.tracking_number || '',
            tracking_number: s.tracking_number || null,
            sender_name: s.sender_name || '',
            sender_email: s.sender_email || '',
            sender_phone: s.sender_phone || '',
            sender_address: s.sender_address || '',
            receiver_name: s.receiver_name || '',
            receiver_phone: s.receiver_phone || '',
            receiver_address: s.receiver_address || '',
            package_type: s.package_type || '',
            weight: s.weight || 0,
            shipment_cost: s.shipment_cost || 0,
            status: s.status || 'Registered',
            date_registered: s.date_registered || new Date().toISOString(),
            estimated_delivery_date: s.estimated_delivery_date || undefined,
            pdf_url: s.pdf_url || undefined
          }))
          setShipments(mappedShipments)
        } else {
          console.warn('No shipments in response or response not successful:', response)
          setShipments([])
        }
      } else if (user?.email) {
        const response = await api.getRecentShipments(user.email) as any
        if (response.success && response.shipments) {
          // Map the response to match our Shipment interface
          const mappedShipments = response.shipments.map((s: any) => ({
            id: s.tracking_number || s.id,
            tracking_number: s.tracking_number,
            sender_name: s.sender?.name || s.sender_name,
            sender_email: s.sender?.email || s.sender_email,
            sender_phone: s.sender?.phone || '',
            sender_address: s.sender?.address || '',
            receiver_name: s.receiver?.name || s.receiver_name,
            receiver_phone: s.receiver?.phone || '',
            receiver_address: s.receiver?.address || '',
            package_type: s.package_type || '',
            weight: s.weight || 0,
            shipment_cost: s.cost || 0,
            status: s.status || 'Unknown',
            date_registered: s.createdAt || s.date_registered,
            pdf_url: s.pdf_url
          }))
          setShipments(mappedShipments)
        }
      }
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchShipments()
    }
  }, [user, fetchShipments])

  const createShipment = async (shipmentData: {
    sender_name: string
    sender_email: string
    sender_phone: string
    sender_address: string
    receiver_name: string
    receiver_phone: string
    receiver_address: string
    package_type: string
    weight: number
    shipment_cost: number
    estimated_delivery_date?: string
  }) => {
    try {
      const response = await api.createShipment(shipmentData) as any
      if (response.success) {
        await fetchShipments() // Refresh list
        return { data: response, error: null }
      }
      return { data: null, error: new Error(response.error || 'Failed to create shipment') }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  const trackShipment = async (trackingNumber: string) => {
    try {
      const statusResponse = await api.getShipmentStatus(trackingNumber) as any
      if (statusResponse.success) {
        // Get shipment details (might need additional endpoint)
        // For now, return what we have from status endpoint
        return {
          shipment: {
            tracking_number: trackingNumber,
            status: statusResponse.history?.[statusResponse.history.length - 1]?.status || 'Unknown'
          },
          events: statusResponse.history || [],
          error: null
        }
      }
      return { shipment: null, events: [], error: new Error('Shipment not found') }
    } catch (error) {
      return { shipment: null, events: [], error: error as Error }
    }
  }

  const updateShipmentStatus = async (
    trackingNumber: string,
    status: string,
    location?: string,
    coordinates?: string,
    note?: string
  ) => {
    try {
      const response = await api.updateShipmentStatus(trackingNumber, {
        status,
        location,
        coordinates,
        note
      }) as any
      
      if (response.success) {
        await fetchShipments() // Refresh list
        return { error: null }
      }
      return { error: new Error(response.error || 'Failed to update status') }
    } catch (error) {
      return { error: error as Error }
    }
  }

  return {
    shipments,
    loading,
    createShipment,
    trackShipment,
    updateShipmentStatus,
    refetch: fetchShipments
  }
}
