<script setup>
/**
 * Dashboard View
 * 
 * หน้า Dashboard สำหรับ Staff/Admin
 */

import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

    <!-- Welcome card -->
    <div class="card bg-primary text-primary-content mb-6">
      <div class="card-body">
        <h2 class="card-title">สวัสดี, {{ auth.user?.name }}!</h2>
        <p>ยินดีต้อนรับเข้าสู่ระบบจัดการสมาชิกสหกรณ์</p>
        <div class="card-actions justify-end">
          <span class="badge badge-lg">{{ auth.primaryRole }}</span>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="stat bg-base-100 rounded-box shadow">
        <div class="stat-title">สมาชิกทั้งหมด</div>
        <div class="stat-value text-primary">150</div>
        <div class="stat-desc">จากทั้งหมด 200 คน</div>
      </div>

      <div class="stat bg-base-100 rounded-box shadow">
        <div class="stat-title">สมาชิกใช้งานอยู่</div>
        <div class="stat-value text-success">120</div>
        <div class="stat-desc">active</div>
      </div>

      <div class="stat bg-base-100 rounded-box shadow">
        <div class="stat-title">ใกล้หมดอายุ</div>
        <div class="stat-value text-warning">15</div>
        <div class="stat-desc">within 30 days</div>
      </div>

      <div class="stat bg-base-100 rounded-box shadow">
        <div class="stat-title">หมดอายุแล้ว</div>
        <div class="stat-value text-error">10</div>
        <div class="stat-desc">expired</div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <h2 class="card-title">Quick Actions</h2>
        <div class="flex flex-wrap gap-4">
          <router-link to="/app/members" class="btn btn-primary">
            รายชื่อสมาชิก
          </router-link>
          <button class="btn btn-secondary">
            ออกอากาศประกาศ
          </button>
          <button class="btn btn-accent">
            ส่งข้อความแจ้งเตือน
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
