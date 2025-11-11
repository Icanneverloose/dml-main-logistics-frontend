import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
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
  const location = useLocation()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false
  })

  const checkAuth = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    // Don't check auth if we're on auth pages - avoids unnecessary redirects
    const currentPath = location.pathname
    if (!currentPath.includes('/auth/signin') && !currentPath.includes('/auth/signup')) {
      checkAuth()
    } else {
      // Still set loading to false so components don't hang
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }, [location.pathname, checkAuth])

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
        
        // Directly set user state from signup response (backend automatically logs user in)
        // This avoids timing issues with session cookies and API calls
        // IMPORTANT: Public signups always get 'user' role - never admin/support/manager
        let userRole = (response.user.role || 'user').toLowerCase().trim()
        
        // Security: Ensure role is 'user' for public signups (backend should already do this)
        // Public signups should NEVER have admin/support/manager roles
        // Force role to 'user' if it's not a valid admin role
        const adminRoles = ['admin', 'super admin', 'superadmin', 'manager', 'support']
        if (!adminRoles.includes(userRole)) {
          userRole = 'user'
          response.user.role = 'user'  // Ensure response has correct role
        }
        
        // Check if user has admin access (only admin roles have access)
        const isAdminUser = adminRoles.includes(userRole)
        
        setAuthState({
          user: response.user,
          loading: false,
          isAdmin: isAdminUser  // Will be false for 'user' role
        })
        
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
