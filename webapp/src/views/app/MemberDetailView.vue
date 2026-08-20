<script setup>
/**
 * Member Detail View
 * 
 * หน้ารายละเอียดสมาชิก (Staff/Admin)
 */

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMemberStore } from '@/stores/member'

const route = useRoute()
const router = useRouter()
const memberStore = useMemberStore()

const member = ref(null)
const savings = ref([])
const loans = ref([])
const dividends = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await memberStore.fetchMemberDetail(route.params.code)
    member.value = memberStore.currentMember
    savings.value = data.savings || []
    loans.value = data.loans || []
    dividends.value = data.dividends || []
  } finally {
    loading.value = false
  }
})

function handleBack() {
  router.push('/app/members')
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount || 0)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('th-TH')
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <button @click="handleBack" class="btn btn-ghost btn-sm">
        ← กลับ
      </button>
      <h1 class="text-3xl font-bold">รายละเอียดสมาชิก</h1>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Member Card -->
    <div v-else-if="member" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="card bg-base-100 shadow-xl lg:col-span-2">
        <div class="card-body">
          <h2 class="card-title">
            {{ member.mem_title }} {{ member.mem_fname }} {{ member.mem_lname }}
            <span 
              class="badge"
              :class="member.mem_status === 'active' ? 'badge-success' : 'badge-error'"
            >
              {{ member.mem_status }}
            </span>
          </h2>

          <div class="divider"></div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-base-content/70">รหัสสมาชิก</p>
              <p class="font-medium">{{ member.mem_code }}</p>
            </div>
            <div>
              <p class="text-sm text-base-content/70">ตำแหน่ง</p>
              <p class="font-medium">{{ member.mem_position || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-base-content/70">วันที่มีผล</p>
              <p class="font-medium">{{ formatDate(member.mem_eff_dt) }}</p>
            </div>
            <div>
              <p class="text-sm text-base-content/70">วันหมดอายุ</p>
              <p class="font-medium">{{ formatDate(member.mem_exp_dt) }}</p>
            </div>
            <div>
              <p class="text-sm text-base-content/70">LINE User ID</p>
              <p class="font-medium text-xs">{{ member.line_user_id || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-base-content/70">รหัส Activate</p>
              <p class="font-medium">{{ member.activate_code || '-' }}</p>
            </div>
          </div>

          <div class="card-actions justify-end mt-4">
            <button class="btn btn-primary">แก้ไข</button>
            <button class="btn btn-warning">ต่ออายุ</button>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4">
        <!-- Quick Actions -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h3 class="card-title text-lg">จัดการ</h3>
            <div class="flex flex-col gap-2">
              <button class="btn btn-outline btn-primary btn-block">
                ส่งข้อความ
              </button>
              <button class="btn btn-outline btn-secondary btn-block">
                ดูประวัติ
              </button>
              <button class="btn btn-outline btn-error btn-block">
                ระงับสมาชิก
              </button>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h3 class="card-title text-lg">สถิติ</h3>
            <div class="stats stats-vertical">
              <div class="stat">
                <div class="stat-title">คะแนนความดี</div>
                <div class="stat-value text-primary">{{ member.mem_kk || 0 }}</div>
              </div>
              <div class="stat">
                <div class="stat-title">เงินกู้คงค้าง</div>
                <div class="stat-value text-error">{{ formatCurrency(member.mem_bk) }}</div>
              </div>
              <div class="stat">
                <div class="stat-title">เงินหุ้น</div>
                <div class="stat-value text-success">{{ formatCurrency(member.mem_bh) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Data -->
      <div class="lg:col-span-3">
        <!-- Savings -->
        <div class="card bg-base-100 shadow mb-4">
          <div class="card-body">
            <h3 class="card-title">💰 บัญชีเงินฝาก</h3>
            <div v-if="savings.length > 0" class="overflow-x-auto">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>เลขบัญชี</th>
                    <th>ประเภท</th>
                    <th>ยอดเงิน</th>
                    <th>วันที่เปิด</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in savings" :key="s.acct_no">
                    <td>{{ s.acct_no }}</td>
                    <td>{{ s.acct_type }}</td>
                    <td class="text-right">{{ formatCurrency(s.balance) }}</td>
                    <td>{{ formatDate(s.open_dt) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="font-bold">
                    <td colspan="2">รวม</td>
                    <td class="text-right">{{ formatCurrency(savings.reduce((sum, s) => sum + (s.balance || 0), 0)) }}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p v-else class="text-base-content/70">ไม่มีข้อมูลบัญชีเงินฝาก</p>
          </div>
        </div>

        <!-- Loans -->
        <div class="card bg-base-100 shadow mb-4">
          <div class="card-body">
            <h3 class="card-title">🏦 สัญญาเงินกู้</h3>
            <div v-if="loans.length > 0" class="overflow-x-auto">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>เลขสัญญา</th>
                    <th>ยอดเงินกู้</th>
                    <th>ยอดคงค้าง</th>
                    <th>วันครบกำหนด</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="l in loans" :key="l.loan_no">
                    <td>{{ l.loan_no }}</td>
                    <td class="text-right">{{ formatCurrency(l.loan_amount) }}</td>
                    <td class="text-right">{{ formatCurrency(l.outstanding) }}</td>
                    <td>{{ formatDate(l.due_dt) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else class="text-base-content/70">ไม่มีสัญญาเงินกู้</p>
          </div>
        </div>

        <!-- Dividends -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h3 class="card-title">💎 เงินปันผล</h3>
            <div v-if="dividends.length > 0" class="overflow-x-auto">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>ปี</th>
                    <th>เงินปันผล</th>
                    <th>เงินหุ้น</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="d in dividends" :key="d.year">
                    <td>{{ d.year }}</td>
    
