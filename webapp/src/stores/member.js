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

  // Actions
  async function fetchMembers(params = {}) {
    loading.value = true
    error.value = null
    try {
      // TODO: Call API
      // const result = await api.get('/user/member-list', params)
      // members.value = result.data.members
      
      // Mock data for now
      members.value = [
        { mem_code: 'MEM001', mem_fname: 'สมชาย', mem_lname: 'ใจดี', mem_status: 'active' },
        { mem_code: 'MEM002', mem_fname: 'สมหญิง', mem_lname: 'รักดี', mem_status: 'active' },
        { mem_code: 'MEM003', mem_fname: 'ทดสอบ', mem_lname: 'ระบบ', mem_status: 'inactive' }
      ]
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchMemberDetail(code) {
    loading.value = true
    error.value = null
    try {
      // TODO: Call API
      // const result = await api.get(`/user/member-detail/${code}`)
      // currentMember.value = result.data.member
      
      // Mock data for now
      currentMember.value = {
        mem_code: code,
        mem_title: 'นาย',
        mem_fname: 'สมชาย',
        mem_lname: 'ใจดี',
        mem_status: 'active',
        mem_eff_dt: '2026-01-01',
        mem_exp_dt: '2026-12-31'
      }
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function updateMember(code, data) {
    loading.value = true
    error.value = null
    try {
      // TODO: Call API
      // const result = await api.post('/admin/member-update', { code, ...data })
      
      // Update local state
      const idx = members.value.findIndex(m => m.mem_code === code)
      if (idx !== -1) {
        members.value[idx] = { ...members.value[idx], ...data }
      }
      if (currentMember.value?.mem_code === code) {
        currentMember.value = { ...currentMember.value, ...data }
      }
    } catch (e) {
      error.value = e.message
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
    
    // Actions
    fetchMembers,
    fetchMemberDetail,
    updateMember,
    clearCurrentMember
  }
})
