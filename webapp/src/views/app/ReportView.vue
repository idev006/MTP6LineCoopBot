<script setup>
/**
 * Report View
 * 
 * หน้ารายงานสรุป (Staff/Admin)
 */

import { ref, onMounted } from 'vue'

const loading = ref(true)
const report = ref(null)

onMounted(async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const apiKey = import.meta.env.VITE_API_KEY
    
    const queryParams = new URLSearchParams({
      path: 'user/reports',
      api_key: apiKey
    })

    const response = await fetch(`${baseUrl}?${queryParams}`)
    const result = await response.json()

    if (result.ok) {
      report.value = result.data
    }
  } catch (e) {
    console.warn('Using mock data:', e.message)
    // Mock data
    report.value = {
      summary: {
        totalMembers: 150,
        activeMembers: 120,
        inactiveMembers: 15,
        expiredMembers: 10,
        expiringMembers: 5
      },
      financial: {
        totalSavings: 2500000,
        totalLoans: 500000,
        totalDividends: 125000
      },
      generatedAt: new Date().toISOString()
    }
  } finally {
    loading.value = false
  }
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('th-TH', { 
    style: 'currency', 
    currency: 'THB',
    minimumFractionDigits: 0
  }).format(amount || 0)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('th-TH')
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">รายงานสรุป</h1>

    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="report">
      <!-- Member Statistics -->
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

      <!-- Financial Summary -->
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

      <!-- Generated At -->
      <div class="text-sm text-base-content/70">
        สร้างรายงานเมื่อ: {{ formatDate(report.generatedAt) }}
      </div>
    </div>
  </div>
</template>
