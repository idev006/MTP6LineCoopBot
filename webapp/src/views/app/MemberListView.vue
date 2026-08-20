<script setup>
/**
 * Member List View
 * 
 * หน้ารายชื่อสมาชิก (Staff/Admin)
 */

import { ref, onMounted, watch } from 'vue'
import { useMemberStore } from '@/stores/member'

const memberStore = useMemberStore()

const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)

onMounted(() => {
  loadMembers()
})

async function loadMembers() {
  await memberStore.fetchMembers({
    search: searchQuery.value,
    status: statusFilter.value,
    page: currentPage.value
  })
}

function handleSearch() {
  currentPage.value = 1
  loadMembers()
}

function handlePageChange(page) {
  currentPage.value = page
  loadMembers()
}

function getStatusBadgeClass(status) {
  return status === 'active' ? 'badge-success' : 'badge-error'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('th-TH')
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">รายชื่อสมาชิก</h1>
      <button class="btn btn-primary">
        + เพิ่มสมาชิก
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mb-6">
      <div class="form-control">
        <div class="input-group">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="ค้นหาสมาชิก..." 
            class="input input-bordered"
            @keyup.enter="handleSearch"
          />
          <button class="btn btn-square" @click="handleSearch">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <select v-model="statusFilter" class="select select-bordered" @change="handleSearch">
        <option value="">ทุกสถานะ</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="memberStore.loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ชื่อ-นามสกุล</th>
            <th>สถานะ</th>
            <th>วันมีผล</th>
            <th>วันหมดอายุ</th>
            <th>LINE</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in memberStore.members" :key="member.mem_code">
            <td class="font-medium">{{ member.mem_code }}</td>
            <td>{{ member.mem_title }} {{ member.mem_fname }} {{ member.mem_lname }}</td>
            <td>
              <span class="badge" :class="getStatusBadgeClass(member.mem_status)">
                {{ member.mem_status }}
              </span>
            </td>
            <td>{{ formatDate(member.mem_eff_dt) }}</td>
            <td>{{ formatDate(member.mem_exp_dt) }}</td>
            <td>{{ member.line_user_id }}</td>
            <td>
              <router-link 
                :to="`/app/members/${member.mem_code}`"
                class="btn btn-ghost btn-sm"
              >
                ดูรายละเอียด
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="memberStore.pagination.totalPages > 1" class="flex justify-center mt-6">
      <div class="join">
        <button 
          v-for="page in memberStore.pagination.totalPages" 
          :key="page"
          class="join-item btn"
          :class="{ 'btn-active': page === currentPage }"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!memberStore.loading && memberStore.members.length === 0" class="text-center py-8">
      <p class="text-base-content/70">ไม่พบข้อมูลสมาชิก</p>
    </div>

    <!-- Summary -->
    <div class="mt-4 text-sm text-base-content/70">
      แสดง {{ memberStore.members.length }} จาก {{ memberStore.pagination.total }} รายการ
    </div>
  </div>
</template>
