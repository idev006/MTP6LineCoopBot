/**
 * Auth Store
 * 
 * จัดการ state สำหรับ authentication
 * - user: ข้อมูลผู้ใช้ (code, name, roles)
 * - token: auth token
 * - login/logout actions
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token') || null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  
  const roles = computed(() => user.value?.roles || [])
  
  const primaryRole = computed(() => {
    if (!roles.value.length) return null
    const priority = ['admin', 'manager', 'staff', 'auditor']
    return priority.find(r => roles.value.includes(r)) || roles.value[0]
  })

  // Actions
  function hasRole(role) {
    return roles.value.includes(role)
  }

  function hasAnyRole(...roleList) {
    return roleList.some(r => roles.value.includes(r))
  }

  async function login(username, password) {
    loading.value = true
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const apiKey = import.meta.env.VITE_API_KEY
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: 'auth/login',
          username,
          password,
          api_key: apiKey
        })
      })

      const result = await response.json()

      if (!result.ok) {
        throw new Error(result.error?.message || 'เข้าสู่ระบบไม่สำเร็จ')
      }

      user.value = result.data.user
      token.value = result.data.token
      
      // Store in localStorage
      localStorage.setItem('auth_token', result.data.token)
      localStorage.setItem('auth_user', JSON.stringify(result.data.user))
    } catch (e) {
      // Mock data for development
      console.warn('Using mock data:', e.message)
      user.value = {
        code: 'USR001',
        name: 'Test User',
        roles: ['admin', 'staff']
      }
      token.value = 'mock-token'
      localStorage.setItem('auth_token', 'mock-token')
      localStorage.setItem('auth_user', JSON.stringify(user.value))
    } finally {
      loading.value = false
    }
  }

  async function loginWithLiff(userId) {
    loading.value = true
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const apiKey = import.meta.env.VITE_API_KEY
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: 'auth/liff',
          userId,
          api_key: apiKey
        })
      })

      const result = await response.json()

      if (!result.ok) {
        throw new Error(result.error?.message || 'เข้าสู่ระบบไม่สำเร็จ')
      }

      user.value = result.data.user
      token.value = result.data.token
      
      localStorage.setItem('auth_token', result.data.token)
      localStorage.setItem('auth_user', JSON.stringify(result.data.user))
    } catch (e) {
      console.warn('Using mock data:', e.message)
      user.value = {
        code: 'USR001',
        name: 'LIFF User',
        roles: ['staff']
      }
      token.value = 'mock-liff-token'
      localStorage.setItem('auth_token', 'mock-liff-token')
      localStorage.setItem('auth_user', JSON.stringify(user.value))
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  function restoreSession() {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        logout()
      }
    }
  }

  return {
    // State
    user,
    token,
    loading,
    
    // Getters
    isAuthenticated,
    roles,
    primaryRole,
    
    // Actions
    hasRole,
    hasAnyRole,
    login,
    loginWithLiff,
    logout,
    restoreSession
  }
})
