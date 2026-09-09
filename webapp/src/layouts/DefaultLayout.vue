<script setup>
/**
 * Default Layout
 * 
 * Layout สำหรับ Guest (Login, Home)
 */
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <!-- Navbar -->
    <div class="navbar bg-base-100 shadow-md">
      <div class="flex-1">
        <router-link to="/" class="btn btn-ghost text-xl">
          🏦 MTP6LineCoopBot
        </router-link>
      </div>
      <div class="flex-none">
        <router-link to="/login" class="btn btn-primary btn-sm">
          เข้าสู่ระบบ
        </router-link>
      </div>
    </div>

    <!-- Content -->
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer footer-center p-4 bg-base-300 text-base-content">
      <div>
        <p>🏦 สหกรณ์ออมทรัพย์ ตำรวจภูธรภาค 6</p>
      </div>
    </footer>
  </div>
</template>
