<script setup>
/**
 * Home View
 * 
 * Landing page สำหรับ guest
 */
</script>

<template>
  <div class="hero min-h-[70vh]">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">🏦 MTP6LineCoopBot</h1>
        <p class="py-6">
          ระบบ LINE Official Account สำหรับให้บริการสมาชิกสหกรณ์ออมทรัพย์ ตำรวจภูธรภาค 6
        </p>
        <div class="flex gap-4 justify-center">
          <router-link to="/login" class="btn btn-primary">
            เข้าสู่ระบบ
          </router-link>
          <a href="https://lin.ee/xxx" target="_blank" class="btn btn-outline">
            เพิ่มเพื่อนใน LINE
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
