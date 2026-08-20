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
  const token = ref(null)
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
      // TODO: Call API
      // const result = await api.post('/auth/login', { username, password })
      // user.value = result.data.user
      // token.value = result.data.token
      
      // Mock data for now
      user.value = {
        code: 'USR001',
        name: 'Test User',
        roles: ['admin', 'staff']
      }
      token.value = 'mock-token'
    } finally {
      loading.value = false
    }
  }

  async function loginWithLiff(userId) {
    loading.value = true
    try {
      // TODO: Call API
      // const result = await api.post('/auth/liff', { userId })
      // user.value = result.data.user
      // token.value = result.data.token
      
      // Mock data for now
      user.value = {
        code: 'USR001',
        name: 'LIFF User',
        roles: ['staff']
      }
      token.value = 'mock-liff-token'
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
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
    logout
  }
})
