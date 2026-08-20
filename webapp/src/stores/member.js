/**
 * Member Store
 * 
 * จัดการ state สำหรับข้อมูลสมาชิก
 * - members: รายชื่อสมาชิก
 * - currentMember: ข้อมูลสมาชิกปัจจุบัน
 * - loading states
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMemberStore = defineStore('member', () => {
  // State
  const members = ref([])
  const currentMember = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({ page: 1, limit: 20, total: 0, totalPages: 0 })

  // Actions
  async function fetchMembers(params = {}) {
    loading.value = true
    error.value = null
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const apiKey = import.meta.env.VITE_API_KEY
      
      const queryParams = new URLSearchParams({
        path: 'user/member-list',
        api_key: apiKey,
        ...params
      })

      const response = await fetch(`${baseUrl}?${queryParams}`)
      const result = await response.json()

      if (!result.ok) {
        throw new Error(result.error?.message || 'ไม่สามารถดึงข้อมูลสมาชิกได้')
      }

      members.value = result.data.members
      pagination.value = {
        page: result.data.page,
        limit: result.data.limit,
        total: result.data.total,
        totalPages: result.data.totalPages
      }
    } catch (e) {
      console.warn('Using mock data:', e.message)
      // Mock data for development
      members.value = [
        { mem_code: 'MEM001', mem_title: 'นาย', mem_fname: 'สมชาย', mem_lname: 'ใจดี', mem_status: 'active', mem_eff_dt: '2026-01-01', mem_exp_dt: '2026-12-31', mem_role: 'member', line_user_id: '✓' },
        { mem_code: 'MEM002', mem_title: 'นาง', mem_fname: 'สมหญิง', mem_lname: 'รักดี', mem_status: 'active', mem_eff_dt: '2026-01-01', mem_exp_dt: '2026-12-31', mem_role: 'member', line_user_id: '✓' },
        { mem_code: 'MEM003', mem_title: 'นาย', mem_fname: 'ทดสอบ', mem_lname: 'ระบบ', mem_status: 'inactive', mem_eff_dt: '', mem_exp_dt: '', mem_role: 'member', line_user_id: '' }
      ]
      pagination.value = { page: 1, limit: 20, total: 3, totalPages: 1 }
    } finally {
      loading.value = false
    }
  }

  async function fetchMemberDetail(code) {
    loading.value = true
    error.value = null
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const apiKey = import.meta.env.VITE_API_KEY
      
      const queryParams = new URLSearchParams({
        path: 'user/member-detail',
        code,
        api_key: apiKey
      })

      const response = await fetch(`${baseUrl}?${queryParams}`)
      const result = await response.json()

      if (!result.ok) {
        throw new Error(result.error?.message || 'ไม่สามารถดึงข้อมูลสมาชิกได้')
      }

      currentMember.value = result.data.member
      return result.data
    } catch (e) {
      console.warn('Using mock data:', e.message)
      // Mock data for development
      currentMember.value = {
        mem_code: code,
        mem_title: 'นาย',
        mem_fname: 'สมชาย',
        mem_lname: 'ใจดี',
        mem_status: 'active',
        mem_eff_dt: '2026-01-01',
        mem_exp_dt: '2026-12-31',
        mem_position: 'กรรมการ',
        mem_position_score: 10,
        mem_rank_score: 25,
        mem_role: 'member',
        mem_kk: 85,
        mem_bk: 50000,
        mem_bh: 10000,
        line_user_id: 'U1234567890',
        activate_code: 'ACT001'
      }
      return { member: currentMember.value, savings: [], loans: [], dividends: [] }
    } finally {
      loading.value = false
    }
  }

  async function activateMember(code, data) {
    loading.value = true
    error.value = null
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const apiKey = import.meta.env.VITE_API_KEY
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'admin/member-activate',
          code,
          ...data,
          api_key: apiKey
        })
      })

      const result = await response.json()

      if (!result.ok) {
        throw new Error(result.error?.message || 'ไม่สามารถ activate สมาชิกได้')
      }

      // Update local state
      const idx = members.value.findIndex(m => m.mem_code === code)
      if (idx !== -1) {
        members.value[idx].mem_status = 'active'
        members.value[idx].mem_eff_dt = result.data.mem_eff_dt
        members.value[idx].mem_exp_dt = result.data.mem_exp_dt
      }

      return result.data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function renewMember(code, data) {
    loading.value = true
    error.value = null
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const apiKey = import.meta.env.VITE_API_KEY
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'admin/member-renew',
          code,
          ...data,
          api_key: apiKey
        })
      })

      const result = await response.json()

      if (!result.ok) {
        throw new Error(result.error?.message || 'ไม่สามารถต่ออายุสมาชิกได้')
      }

      // Update local state
      const idx = members.value.findIndex(m => m.mem_code === code)
      if (idx !== -1) {
        members.value[idx].mem_exp_dt = result.data.mem_exp_dt
      }

      return result.data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  function clearCurrentMember() {
    currentMember.value = null
  }

  return {
    // State
    members,
    currentMember,
    loading,
    error,
    pagination,
    
    // Actions
    fetchMembers,
    fetchMemberDetail,
    activateMember,
    renewMember,
    clearCurrentMember
  }
})
