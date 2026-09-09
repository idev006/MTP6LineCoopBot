<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createWebAdminClient } from '@/adapters/api/webAdminApi'

const auth = useAuthStore()
const loading = ref(true)
const error = ref('')
const logs = ref([])
const filterType = ref('all')

function client() {
  return createWebAdminClient({ baseUrl: import.meta.env.VITE_API_BASE_URL })
}

async function loadLogs() {
  loading.value = true
  error.value = ''
  logs.value = []

  try {
    if (!auth.isAuthenticated || !auth.token) {
      throw new Error('Web session ไม่พร้อมใช้งาน')
    }
    const data = await client().getAuditLog(auth.token, {
      type: filterType.value,
      limit: 50
    })
    logs.value = Array.isArray(data?.logs) ? data.logs : []
  } catch (e) {
    error.value = e?.message || 'ไม่สามารถโหลด Audit Log ได้'
    throw e
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await loadLogs()
  } catch {
    // Explicit error state; no synthetic fallback.
  }
})

async function handleFilterChange() {
  try {
    await loadLogs()
  } catch {
    // Error is already rendered.
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return Number.isNaN(date.getTime()) ? dateStr : date.toLocaleString('th-TH')
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'success':
    case 'reminded':
    case 'valid':
      return 'badge-success'
    case 'failed':
    case 'expired':
      return 'badge-error'
    case 'expiring':
      return 'badge-warning'
    default:
      return 'badge-info'
  }
}

function getTypeLabel(type) {
  switch (type) {
    case 'activation': return '🔑 Activate'
    case 'expiry': return '⏰ Expiry'
    case 'reminder': return '💳 Reminder'
    default: return type
  }
}

function getDetail(log) {
  if (log.type === 'expiry' && log.daysLeft !== undefined) {
    return log.daysLeft >= 0 ? `เหลือ ${log.daysLeft} วัน` : `เลย ${Math.abs(log.daysLeft)} วัน`
  }
  if (log.type === 'reminder') {
    return [log.loanNo ? `สัญญา ${log.loanNo}` : '', log.daysLeft !== undefined ? `เหลือ ${log.daysLeft} วัน` : '']
      .filter(Boolean)
      .join(' • ') || '-'
  }
  return '-'
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
        <option value="reminder">Reminder</option>
      </select>
    </div>

    <div v-if="error" class="alert alert-error mb-6">
      <span>{{ error }}</span>
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
          <tr v-for="log in logs" :key="`${log.type}:${log.id}`">
            <td>{{ getTypeLabel(log.type) }}</td>
            <td class="font-mono text-sm">{{ log.id }}</td>
            <td>{{ log.memCode || '-' }}</td>
            <td>
              <span class="badge" :class="getStatusBadgeClass(log.status)">
                {{ log.status || '-' }}
              </span>
            </td>
            <td>{{ getDetail(log) }}</td>
            <td>{{ formatDate(log.timestamp) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && !error && logs.length === 0" class="text-center py-8">
      <p class="text-base-content/70">ไม่มีข้อมูล Audit Log</p>
    </div>
  </div>
</template>
