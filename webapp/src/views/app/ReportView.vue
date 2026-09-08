<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createWebReportClient } from '@/adapters/api/webReportApi'

const auth = useAuthStore()
const loading = ref(true)
const error = ref('')
const report = ref(null)

async function loadReport() {
  loading.value = true
  error.value = ''
  report.value = null
  try {
    if (!auth.isAuthenticated || !auth.token) {
      throw new Error('Web session ไม่พร้อมใช้งาน')
    }
    const client = createWebReportClient({ baseUrl: import.meta.env.VITE_API_BASE_URL })
    report.value = await client.getSummary(auth.token)
  } catch (e) {
    error.value = e?.message || 'ไม่สามารถโหลดรายงานสรุปได้'
    throw e
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await loadReport()
  } catch {
    // Explicit error state; no synthetic fallback.
  }
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0
  }).format(Number(amount || 0))
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return Number.isNaN(date.getTime()) ? dateStr : date.toLocaleString('th-TH')
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">รายงานสรุป</h1>
      <button class="btn btn-outline btn-sm" :disabled="loading" @click="loadReport">
        รีเฟรช
      </button>
    </div>

    <div v-if="error" class="alert alert-error mb-6">
      <span>{{ error }}</span>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="report">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div class="stat bg-base-100 rounded-box shadow">
          <div class="stat-title">สมาชิกทั้งหมด</div>
          <div class="stat-value text-primary">{{ report.summary.totalMembers }}</div>
        </div>
        <div class="stat bg-base-100 rounded-box shadow">
          <div class="stat-title">Active</div>
          <div class="stat-value text-success">{{ report.summary.activeMembers }}</div>
        </div>
        <div class="stat bg-base-100 rounded-box shadow">
          <div class="stat-title">Inactive</div>
          <div class="stat-value text-warning">{{ report.summary.inactiveMembers }}</div>
        </div>
        <div class="stat bg-base-100 rounded-box shadow">
          <div class="stat-title">หมดอายุ</div>
          <div class="stat-value text-error">{{ report.summary.expiredMembers }}</div>
        </div>
        <div class="stat bg-base-100 rounded-box shadow">
          <div class="stat-title">ใกล้หมดอายุ</div>
          <div class="stat-value text-accent">{{ report.summary.expiringMembers }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h3 class="card-title text-lg">💰 เงินฝากรวม</h3>
            <p class="text-3xl font-bold text-success">{{ formatCurrency(report.financial.totalSavings) }}</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h3 class="card-title text-lg">🏦 เงินกู้คงค้าง</h3>
            <p class="text-3xl font-bold text-error">{{ formatCurrency(report.financial.totalLoans) }}</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h3 class="card-title text-lg">💎 เงินปันผลรวม</h3>
            <p class="text-3xl font-bold text-primary">{{ formatCurrency(report.financial.totalDividends) }}</p>
          </div>
        </div>
      </div>

      <div class="text-sm text-base-content/70">
        สร้างรายงานเมื่อ: {{ formatDate(report.generatedAt) }}
      </div>
    </div>
  </div>
</template>
