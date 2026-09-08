/**
 * Auth Store
 *
 * Fail-closed authentication state.
 * UI state is not a server-side authorization boundary.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  isSessionShapeValid,
  normalizeRoles,
  parseStoredUser,
  primaryRole as selectPrimaryRole
} from '@/engine/auth/sessionPolicy'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)

  const roles = computed(() => normalizeRoles(user.value?.roles))
  const isAuthenticated = computed(() =>
    isSessionShapeValid({ token: token.value, user: user.value })
  )
  const primaryRole = computed(() => selectPrimaryRole(roles.value))

  function hasRole(role) {
    return roles.value.includes(role)
  }

  function hasAnyRole(...roleList) {
    return roleList.some(r => roles.value.includes(r))
  }

  function clearSession() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  function persistSession(nextToken, nextUser) {
    const normalizedUser = {
      ...nextUser,
      roles: normalizeRoles(nextUser.roles)
    }

    if (!isSessionShapeValid({ token: nextToken, user: normalizedUser })) {
      throw new Error('ข้อมูล session จากเซิร์ฟเวอร์ไม่สมบูรณ์')
    }

    user.value = normalizedUser
    token.value = nextToken
    localStorage.setItem('auth_token', nextToken)
    localStorage.setItem('auth_user', JSON.stringify(normalizedUser))
  }

  async function login(username, password) {
    loading.value = true
    clearSession()

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const apiKey = import.meta.env.VITE_API_KEY

      if (!baseUrl) throw new Error('ยังไม่ได้ตั้งค่า API endpoint')

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'auth/login',
          username,
          password,
          api_key: apiKey
        })
      })

      if (!response.ok) {
        throw new Error('ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้')
      }

      const result = await response.json()
      if (!result.ok) {
        throw new Error(result.error?.message || 'เข้าสู่ระบบไม่สำเร็จ')
      }

      persistSession(result.data?.token, result.data?.user)
      return { ok: true }
    } catch (error) {
      clearSession()
      throw error
    } finally {
      loading.value = false
    }
  }

  async function loginWithLiff(userId) {
    loading.value = true
    clearSession()

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const apiKey = import.meta.env.VITE_API_KEY

      if (!baseUrl) throw new Error('ยังไม่ได้ตั้งค่า API endpoint')

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'auth/liff',
          userId,
          api_key: apiKey
        })
      })

      if (!response.ok) {
        throw new Error('ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้')
      }

      const result = await response.json()
      if (!result.ok) {
        throw new Error(result.error?.message || 'เข้าสู่ระบบไม่สำเร็จ')
      }

      persistSession(result.data?.token, result.data?.user)
      return { ok: true }
    } catch (error) {
      clearSession()
      throw error
    } finally {
      loading.value = false
    }
  }

  function logout() {
    clearSession()
  }

  function restoreSession() {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = parseStoredUser(localStorage.getItem('auth_user'))

    if (!isSessionShapeValid({ token: savedToken, user: savedUser })) {
      clearSession()
      return false
    }

    token.value = savedToken
    user.value = savedUser
    return true
  }

  // Restore only a structurally valid persisted session.
  // Server-side validity/expiry verification remains authoritative.
  restoreSession()

  return {
    user,
    token,
    loading,
    isAuthenticated,
    roles,
    primaryRole,
    hasRole,
    hasAnyRole,
    login,
    loginWithLiff,
    logout,
    restoreSession
  }
})
