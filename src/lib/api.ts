// API Service Layer for Flask Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
  requiresAuth?: boolean
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestOptions & { query?: Record<string, string> } = {}): Promise<T> {
    const {
      method = 'GET',
      body,
      headers = {},
      requiresAuth = true,
      query
    } = options

    // Build URL with query parameters
    let url = `${this.baseURL}${endpoint}`
    if (query && Object.keys(query).length > 0) {
      const queryString = new URLSearchParams(query).toString()
      url += `?${queryString}`
    }

    const config: RequestInit = {
      method,
      headers: {
        ...headers
      },
      credentials: 'include' // Important for Flask sessions
    }

    // Add Authorization header if token exists (for mobile compatibility)
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      }
    }

    // Only add Content-Type header if there's a body (DELETE requests without body shouldn't have Content-Type)
    if (body) {
      config.headers = {
        'Content-Type': 'application/json',
        ...config.headers
      }
      config.body = JSON.stringify(body)
    } else if (method !== 'GET' && method !== 'DELETE') {
      // For POST/PUT/PATCH without body, still add Content-Type
      config.headers = {
        'Content-Type': 'application/json',
        ...config.headers
      }
    }

    try {
      const response = await fetch(url, config)
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        if (!response.ok) {
          // For DELETE requests, even non-JSON responses might be valid
          if (response.status >= 200 && response.status < 300) {
            return { success: true } as T
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return {} as T
      }

      const data = await response.json()

      if (!response.ok) {
        // Handle 401/403 for authentication
        if (response.status === 401 || response.status === 403) {
          // Only redirect if not already on signin page
          if (!window.location.pathname.includes('/auth/signin')) {
            window.location.href = '/auth/signin'
          }
          throw new Error(data.error || 'Unauthorized')
        }
        throw new Error(data.error || data.message || `Request failed with status ${response.status}`)
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        // Check if it's a network error
        if (error.message.includes('fetch') || error.message.includes('Network') || error.message.includes('Failed to fetch')) {
          // Provide more helpful error message
          throw new Error(`Network error: Unable to connect to the server. Please check your connection and ensure the backend is running at ${this.baseURL.replace('/api', '')}`)
        }
        // Re-throw other errors as-is
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  // User/Auth endpoints
  async signUp(email: string, password: string, name: string) {
    return this.request('/user/signup', {
      method: 'POST',
      body: { email, password, name },
      requiresAuth: false
    })
  }

  async signIn(email: string, password: string) {
    return this.request('/user/login', {
      method: 'POST',
      body: { email, password },
      requiresAuth: false
    })
  }

  async signOut() {
    return this.request('/user/logout', {
      method: 'POST'
    })
  }

  async getProfile() {
    try {
      return await this.request('/user/profile')
    } catch (error) {
      // If profile request fails, return a structured error response
      console.error('Get profile error:', error)
      throw error
    }
  }

  async getRecentShipments(email: string) {
    return this.request(`/user/recent-shipments?email=${encodeURIComponent(email)}`)
  }

  // Shipment endpoints
  async createShipment(shipmentData: any) {
    return this.request('/shipments', {
      method: 'POST',
      body: shipmentData
    })
  }

  async getAllShipments() {
    return this.request('/shipments/all')
  }

  async getShipmentStatus(trackingNumber: string) {
    return this.request(`/shipments/${trackingNumber}/status`, { requiresAuth: false })
  }

  async getShipmentByTracking(trackingNumber: string) {
    return this.request(`/shipments/${trackingNumber}`, { requiresAuth: false })
  }

  async deleteShipment(trackingNumber: string) {
    return this.request(`/shipments/${trackingNumber}`, {
      method: 'DELETE'
    })
  }

  async generatePDF(trackingNumber: string): Promise<Blob | string | null> {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const url = `${apiUrl}/shipments/${trackingNumber}/pdf`;
      
      // Get auth token
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        // If 404, return null to trigger fallback mechanism
        if (response.status === 404) {
          console.warn(`PDF endpoint not found for ${trackingNumber}. Using fallback mechanism.`);
          return null;
        }
        
        // If endpoint returns JSON error, try to parse it
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          try {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.message || 'Failed to generate PDF');
          } catch (parseError) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is a PDF blob
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/pdf')) {
        // Return the blob for download
        const blob = await response.blob();
        return blob;
      }

      // If it's JSON, it might be a URL
      if (contentType.includes('application/json')) {
        try {
          const data = await response.json();
          return data.pdf_url || data.url || null;
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError);
          return null;
        }
      }

      // If content type is text/html or other, it might be an error page
      if (contentType.includes('text/html')) {
        throw new Error('Server returned HTML instead of PDF. The endpoint may not be implemented correctly.');
      }

      // Unknown content type, try to get as blob (might still be PDF)
      const blob = await response.blob();
      
      // Check if blob has PDF signature (starts with %PDF)
      try {
        const firstChunk = blob.slice(0, 4);
        const arrayBuffer = await firstChunk.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        // Check for PDF signature: %PDF (0x25, 0x50, 0x44, 0x46)
        if (uint8Array.length >= 4 && 
            uint8Array[0] === 0x25 && 
            uint8Array[1] === 0x50 && 
            uint8Array[2] === 0x44 && 
            uint8Array[3] === 0x46) {
          return blob;
        }
      } catch (checkError) {
        console.error('Failed to check PDF signature:', checkError);
      }

      return null;
    } catch (error) {
      console.error('PDF generation error:', error);
      // Re-throw the error so the UI can handle it properly
      throw error;
    }
  }

  async emailPDF(trackingNumber: string, email: string) {
    return this.request(`/shipments/${trackingNumber}/email-pdf`, {
      method: 'POST',
      body: { email }
    })
  }

  async updateShipmentStatus(trackingNumber: string, statusData: {
    status: string
    location?: string
    coordinates?: string
    note?: string
    timestamp?: string
  }) {
    return this.request(`/shipments/${trackingNumber}/status`, {
      method: 'PUT',
      body: statusData
    })
  }

  async updateShipment(trackingNumber: string, shipmentData: {
    sender_name?: string
    sender_email?: string
    sender_phone?: string
    sender_address?: string
    receiver_name?: string
    receiver_phone?: string
    receiver_address?: string
    package_type?: string
    weight?: number
    shipment_cost?: number
    estimated_delivery_date?: string
  }) {
    return this.request(`/shipments/${trackingNumber}`, {
      method: 'PUT',
      body: shipmentData
    })
  }

  // Content management endpoints
  async getAllContent() {
    return this.request('/content')
  }

  async getSectionContent(section: string) {
    return this.request(`/content/${section}`)
  }

  async updateSectionContent(section: string, data: any) {
    return this.request(`/content/${section}`, {
      method: 'PUT',
      body: data
    })
  }

  async createSection(data: any) {
    return this.request('/content', {
      method: 'POST',
      body: data
    })
  }

  async deleteSection(section: string) {
    return this.request(`/content/${section}`, {
      method: 'DELETE'
    })
  }

  // Health check
  async ping() {
    return this.request('/ping', { requiresAuth: false })
  }

  // Admin user management endpoints
  async getAdminUsers() {
    return this.request('/admin/users')
  }

  async getFrontendUsers() {
    return this.request('/admin/customers')
  }

  async createAdminUser(userData: {
    email: string
    password: string
    name: string
    role: 'Super Admin' | 'Manager' | 'Support'
  }) {
    return this.request('/admin/users', {
      method: 'POST',
      body: userData
    })
  }

  async updateAdminUser(userId: string, userData: Partial<{
    name: string
    email: string
    role: 'Super Admin' | 'Manager' | 'Support'
    status: 'Active' | 'Inactive'
  }>) {
    return this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: userData
    })
  }

  async deleteAdminUser(userId: string) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE'
    })
  }

  // System logs endpoints
  async getSystemLogs(filters?: {
    type?: 'shipment' | 'user' | 'system' | 'pdf'
    startDate?: string
    endDate?: string
    userId?: string
  }) {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.userId) params.append('userId', filters.userId);
    
    const query = params.toString();
    return this.request(`/admin/logs${query ? `?${query}` : ''}`)
  }

  // Settings endpoints
  async getSettings() {
    return this.request('/admin/settings')
  }

  async saveSettings(settings: any) {
    return this.request('/admin/settings', {
      method: 'POST',
      body: settings
    })
  }

  // Note: The private request method is already available for internal use
  // For external custom requests, use the existing method patterns above

  // Get PDF URL
  getPdfUrl(pdfPath: string) {
    if (!pdfPath) return null
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
    return `${baseUrl.replace('/api', '')}/${pdfPath}`
  }

  // Get QR code URL
  getQrUrl(qrPath: string) {
    if (!qrPath) return null
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
    return `${baseUrl.replace('/api', '')}/${qrPath}`
  }

  // Chat API methods
  async createChatSession(email: string, name?: string) {
    return this.request('/chat/sessions', {
      method: 'POST',
      body: { email, name }
    })
  }

  async sendChatMessage(sessionId: string, message: string) {
    return this.request(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: { message }
    })
  }

  async getChatSession(sessionId: string) {
    return this.request(`/chat/sessions/${sessionId}`, { requiresAuth: false })
  }

  async requestLiveAgent(sessionId: string) {
    return this.request(`/chat/sessions/${sessionId}/request-agent`, {
      method: 'POST'
    })
  }

  async sendAgentMessage(sessionId: string, message: string, agentName?: string) {
    const body: any = { message }
    if (agentName) {
      body.agent_name = agentName
    }
    return this.request(`/chat/sessions/${sessionId}/agent-message`, {
      method: 'POST',
      body
    })
  }

  async getChatSessions(filters?: { status?: string; email?: string; dateFrom?: string; dateTo?: string }) {
    const queryParams: any = {};
    if (filters?.status) queryParams.status = filters.status;
    if (filters?.email) queryParams.email = filters.email;
    if (filters?.dateFrom) queryParams.dateFrom = filters.dateFrom;
    if (filters?.dateTo) queryParams.dateTo = filters.dateTo;
    
    return this.request('/chat/sessions', {
      method: 'GET',
      query: Object.keys(queryParams).length > 0 ? queryParams : undefined
    })
  }

  async getChatMessages(sessionId: string) {
    return this.request(`/chat/sessions/${sessionId}/messages`)
  }

  async updateChatSession(sessionId: string, data: { status?: string; assignedAgent?: string }) {
    return this.request(`/chat/sessions/${sessionId}`, {
      method: 'PATCH',
      body: data
    })
  }

  async endChatSession(sessionId: string) {
    return this.request(`/chat/sessions/${sessionId}/end`, {
      method: 'POST'
    })
  }

  async deleteChatSession(sessionId: string) {
    // Use POST instead of DELETE for better CORS compatibility
    // Backend supports both POST and DELETE methods
    return this.request(`/chat/sessions/${sessionId}/delete`, {
      method: 'POST'
    })
  }

  // Contact form API methods
  async submitContactForm(data: {
    name: string
    email: string
    phone?: string
    company?: string
    service?: string
    message: string
  }) {
    return this.request('/contact/quote', {
      method: 'POST',
      body: data,
      requiresAuth: false
    })
  }
}

export const api = new ApiClient(API_BASE_URL)

