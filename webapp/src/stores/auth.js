/**
 * Auth Store
 *
 * Browser state is presentation state only.
 * Authentication is true only after server-side Web session verification.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  isSessionShapeValid,
  normalizeRoles,
  primaryRole as selectPrimaryRole
} from '@/engine/auth/sessionPolicy'
import { createWebSessionClient } from '@/adapters/api/webSessionApi'
import { getVerifiedLineCredential, logoutLine } from '@/adapters/line/liffAuth'

const STORAGE_KEY = 'mtp6_web_session'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const expiresAt = ref(null)
  const loading = ref(false)
  const serverVerified = ref(false)

  const roles = computed(() => normalizeRoles(user.value?.roles))
  const isAuthenticated = computed(() =>
    serverVerified.value &&
    isSessionShapeValid({ token: token.value, user: user.value })
  )
  const primaryRole = computed(() => selectPrimaryRole(roles.value))

  function apiClient() {
    return createWebSessionClient({ baseUrl: import.meta.env.VITE_API_BASE_URL })
  }

  function hasRole(role) {
    return isAuthenticated.value && roles.value.includes(role)
  }

  function hasAnyRole(...roleList) {
    return isAuthenticated.value && roleList.some(r => roles.value.includes(r))
  }

  function clearSession() {
    user.value = null
    token.value = null
    expiresAt.value = null
    serverVerified.value = false
    sessionStorage.removeItem(STORAGE_KEY)

    // Remove obsolete client-authoritative persistence from earlier versions.
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  function acceptVerifiedSession(nextToken, nextUser, nextExpiresAt = null) {
    const normalizedUser = {
      ...nextUser,
      roles: normalizeRoles(nextUser?.roles)
    }

    if (!isSessionShapeValid({ token: nextToken, user: normalizedUser })) {
      throw new Error('ข้อมูล session จากเซิร์ฟเวอร์ไม่สมบูรณ์')
    }

    token.value = nextToken
    user.value = normalizedUser
    expiresAt.value = nextExpiresAt || null
    serverVerified.value = true
    sessionStorage.setItem(STORAGE_KEY, nextToken)
  }

  async function loginWithLine() {
    loading.value = true
    clearSession()
    try {
      const idToken = await getVerifiedLineCredential({
        liffId: import.meta.env.VITE_LIFF_ID
      })

      // liff.login() redirects the browser; no local success is granted.
      if (!idToken) return { ok: false, redirecting: true }

      const data = await apiClient().exchangeLineIdToken(idToken)
      acceptVerifiedSession(data?.token, data?.user, data?.expiresAt)
      return { ok: true }
    } catch (error) {
      clearSession()
      throw error
    } finally {
      loading.value = false
    }
  }

  async function ensureServerSession() {
    if (isAuthenticated.value) return true

    const savedToken = token.value || sessionStorage.getItem(STORAGE_KEY)
    if (!savedToken) {
      clearSession()
      return false
    }

    loading.value = true
    serverVerified.value = false
    user.value = null
    try {
      const data = await apiClient().verifySession(savedToken)
      acceptVerifiedSession(savedToken, data?.user, data?.expiresAt)
      return true
    } catch {
      clearSession()
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    const currentToken = token.value || sessionStorage.getItem(STORAGE_KEY)
    clearSession()
    try {
      if (currentToken) await apiClient().revokeSession(currentToken)
    } catch {
      // Local session is already cleared; server session will still expire.
    } finally {
      logoutLine()
    }
  }

  return {
    user,
    token,
    expiresAt,
    loading,
    serverVerified,
    isAuthenticated,
    roles,
    primaryRole,
    hasRole,
    hasAnyRole,
    loginWithLine,
    ensureServerSession,
    logout,
    clearSession
  }
})
