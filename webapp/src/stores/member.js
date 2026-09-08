/**
 * Member Store
 *
 * Staff/admin member reads are server-authorized via opaque Web session.
 * No client API key, mock data, or client role is authoritative.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createWebMemberClient } from '@/adapters/api/webMemberApi'

export const useMemberStore = defineStore('member', () => {
  const members = ref([])
  const currentMember = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({ page: 1, limit: 20, total: 0, totalPages: 0 })

  function client() {
    return createWebMemberClient({ baseUrl: import.meta.env.VITE_API_BASE_URL })
  }

  function requireSessionToken() {
    const auth = useAuthStore()
    if (!auth.isAuthenticated || !auth.token) {
      throw new Error('Web session ไม่พร้อมใช้งาน')
    }
    return auth.token
  }

  async function fetchMembers(params = {}) {
    loading.value = true
    error.value = null
    try {
      const data = await client().listMembers(requireSessionToken(), params)
      members.value = Array.isArray(data?.members) ? data.members : []
      pagination.value = {
        page: Number(data?.page || 1),
        limit: Number(data?.limit || 20),
        total: Number(data?.total || 0),
        totalPages: Number(data?.totalPages || 0)
      }
      return data
    } catch (e) {
      members.value = []
      pagination.value = { page: 1, limit: 20, total: 0, totalPages: 0 }
      error.value = e.message || 'ไม่สามารถดึงข้อมูลสมาชิกได้'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchMemberDetail(code) {
    loading.value = true
    error.value = null
    currentMember.value = null
    try {
      const data = await client().getMemberDetail(requireSessionToken(), code)
      currentMember.value = data?.member || null
      return {
        member: currentMember.value,
        savings: Array.isArray(data?.savings) ? data.savings : [],
        loans: Array.isArray(data?.loans) ? data.loans : [],
        dividends: Array.isArray(data?.dividends) ? data.dividends : []
      }
    } catch (e) {
      currentMember.value = null
      error.value = e.message || 'ไม่สามารถดึงข้อมูลสมาชิกได้'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function activateMember() {
    throw new Error('การ Activate ผ่าน Web ยังไม่เปิดใช้งานจนกว่า protected write endpoint จะพร้อม')
  }

  async function renewMember() {
    throw new Error('การต่ออายุผ่าน Web ยังไม่เปิดใช้งานจนกว่า protected write endpoint จะพร้อม')
  }

  function clearCurrentMember() {
    currentMember.value = null
  }

  return {
    members,
    currentMember,
    loading,
    error,
    pagination,
    fetchMembers,
    fetchMemberDetail,
    activateMember,
    renewMember,
    clearCurrentMember
  }
})
