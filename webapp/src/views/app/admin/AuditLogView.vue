<script setup>
/**
 * Audit Log View
 * 
 * หน้า Audit Log (Admin only)
 */

import { ref, onMounted } from 'vue'

const loading = ref(true)
const logs = ref([])
const filterType = ref('all')

onMounted(() => {
  loadLogs()
})

async function loadLogs() {
  loading.value = true
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const apiKey = import.meta.env.VITE_API_KEY
    
    const queryParams = new URLSearchParams({
      path: 'admin/audit-log',
      type: filterType.value,
      limit: '50',
      api_key: apiKey
    })

    const response = await fetch(`${baseUrl}?${queryParams}`)
    const result = await response.json()

    if (result.ok) {
      logs.value = result.data.logs
    }
  } catch (e) {
    console.warn('Using mock data:', e.message)
    // Mock data
    logs.value = [
      { type: 'activation', id: 'LOG-0001', memCode: 'MEM001', status: 'success', timestamp: '2026-08-20 09:00:00' },
      { type: 'activation', id: 'LOG-0002', memCode: 'MEM002', status: 'success', timestamp: '2026-08-20 10:30:00' },
      { type: 'expiry', id: 'ELOG-0001', memCode: 'MEM003', status: 'expiring', daysLeft: 14, timestamp: '2026-08-20 09:00:00' },
      { type: 'expiry', id: 'ELOG-0002', memCode: 'MEM004', status: 'expired', daysLeft: -5, timestamp: '2026-08-20 09:00:00' }
    ]
  } finally {
    loading.value = false
  }
}

function handleFilterChange() {
  loadLogs()
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('th-TH')
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'success': return 'badge-success'
    case 'failed': return 'badge-error'
    case 'expired': return 'badge-error'
    case 'expiring': return 'badge-warning'
    default: return 'badge-info'
  }
}

function getTypeLabel(type) {
  switch (type) {
    case 'activation': return '🔑 Activate'
    case 'expiry': return '⏰ Expiry'
    default: return type
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Audit Log</h1>
      
      <select v-model="filterType" class="select select-bordered" @change="handleFilterChange">
        <option value="all">ทั้งหมด</option>
        <option value="activation">Activate</option>
        <option value="expiry">Expiry</option>
      </select>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>ประเภท</th>
            <th>ID</th>
            <th>รหัสสมาชิก</th>
            <th>สถานะ</th>
            <th>รายละเอียด</th>
            <th>วันเวลา</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td>{{ getTypeLabel(log.type) }}</td>
            <td class="font-mono text-sm">{{ log.id }}</td>
            <td>{{ log.memCode }}</td>
            <td>
              <span class="badge" :class="getStatusBadgeClass(log.status)">
                {{ log.status }}
              </span>
            </td>
            <td>
              <span v-if="log.daysLeft !== undefined">
                {{ log.daysLeft > 0 ? `เหลือ ${log.daysLeft} วัน` : `เลย ${Math.abs(log.daysLeft)} วัน` }}
              </span>
              <span v-else-if="log.activateCode">
                Code: {{ log.activateCode }}
              </span>
              <span v-else>-</span>
            </td>
            <td>{{ formatDate(log.timestamp) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && logs.length === 0" class="text-center py-8">
      <p class="text-base-content/70">ไม่มีข้อมูล Audit Log</p>
    </div>
  </div>
</template>
