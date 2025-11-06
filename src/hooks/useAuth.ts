import { useState, useEffect } from 'react'
import { api } from '../lib/api'

interface User {
  id: string
  email: string
  name: string
  role: string
  created_at?: string
}

interface AuthState {
  user: User | null
  loading: boolean
  isAdmin: boolean
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await api.getProfile() as any
      if (response.success && response.user) {
        // Check for admin role (case-insensitive and handle variations)
        const userRole = response.user.role?.toLowerCase() || ''
        // Admin roles: admin, super admin, superadmin, manager, support
        const isAdminUser = userRole === 'admin' || 
                           userRole === 'super admin' || 
                           userRole === 'superadmin' ||
                           userRole === 'manager' ||
                           userRole === 'support'
        
        setAuthState({
          user: response.user,
          loading: false,
          isAdmin: isAdminUser
        })
      } else {
        setAuthState({ user: null, loading: false, isAdmin: false })
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setAuthState({ user: null, loading: false, isAdmin: false })
    }
  }

  // Helper functions to check user roles
  const getUserRole = (): string => {
    return authState.user?.role?.toLowerCase() || ''
  }

  const isSupport = (): boolean => {
    return getUserRole() === 'support'
  }

  const isManager = (): boolean => {
    return getUserRole() === 'manager'
  }

  const isSuperAdmin = (): boolean => {
    const role = getUserRole()
    return role === 'admin' || role === 'super admin' || role === 'superadmin'
  }

  const hasAdminAccess = (): boolean => {
    return isSupport() || isManager() || isSuperAdmin()
  }

  const canManageUsers = (): boolean => {
    return isSuperAdmin()
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await api.signUp(email, password, name) as any
      if (response.success && response.user) {
        // Store token in localStorage for mobile compatibility
        if (response.token) {
          localStorage.setItem('auth_token', response.token)
        }
        await checkAuth() // Refresh auth state
        return { data: response, error: null }
      }
      return { data: null, error: new Error(response.error || 'Sign up failed') }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.signIn(email, password) as any
      if (response.success && response.user) {
        // Store token in localStorage for mobile compatibility
        if (response.token) {
          localStorage.setItem('auth_token', response.token)
        }
        await checkAuth() // Refresh auth state
        return { data: response, error: null }
      }
      return { data: null, error: new Error(response.error || 'Invalid credentials') }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      await api.signOut()
      // Clear token from localStorage
      localStorage.removeItem('auth_token')
      setAuthState({ user: null, loading: false, isAdmin: false })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    try {
      // Note: Backend might need a PUT /user/profile endpoint
      // For now, we'll keep the structure
      await checkAuth()
      return { data: authState.user, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  return {
    user: authState.user,
    session: authState.user ? { user: authState.user } : null, // For compatibility
    loading: authState.loading,
    isAdmin: authState.isAdmin,
    isSupport,
    isManager,
    isSuperAdmin,
    hasAdminAccess,
    canManageUsers,
    getUserRole,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshAuth: checkAuth
  }
}
