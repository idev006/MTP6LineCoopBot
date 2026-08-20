<script setup>
/**
 * Member List View
 * 
 * หน้ารายชื่อสมาชิก
 */

import { ref, onMounted } from 'vue'
import { useMemberStore } from '@/stores/member'

const memberStore = useMemberStore()

const searchQuery = ref('')

onMounted(() => {
  memberStore.fetchMembers()
})

function handleSearch() {
  memberStore.fetchMembers({ search: searchQuery.value })
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

    <!-- Search -->
    <div class="form-control mb-6">
      <div class="input-group">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="ค้นหาสมาชิก..." 
          class="input input-bordered w-full max-w-xs"
          @keyup.enter="handleSearch"
        />
        <button class="btn btn-square" @click="handleSearch">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
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
            <th>วันหมดอายุ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in memberStore.members" :key="member.mem_code">
            <td>{{ member.mem_code }}</td>
            <td>{{ member.mem_fname }} {{ member.mem_lname }}</td>
            <td>
              <span 
                class="badge"
                :class="member.mem_status === 'active' ? 'badge-success' : 'badge-error'"
              >
                {{ member.mem_status }}
              </span>
            </td>
            <td>{{ member.mem_exp_dt || '-' }}</td>
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

    <!-- Empty state -->
    <div v-if="!memberStore.loading && memberStore.members.length === 0" class="text-center py-8">
      <p class="text-base-content/70">ไม่พบข้อมูลสมาชิก</p>
    </div>
  </div>
</template>
