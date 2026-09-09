import assert from 'node:assert/strict'
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { renderToString } from '@vue/server-renderer'
import { createServer } from 'vite'

const cases = [
  {
    module: '/src/views/guest/HomeView.vue',
    expected: 'MTP6LineCoopBot'
  },
  {
    module: '/src/views/app/DashboardView.vue',
    expected: 'Dashboard'
  },
  {
    module: '/src/views/app/admin/StaffManageView.vue',
    expected: 'จัดการเจ้าหน้าที่'
  },
  {
    module: '/src/views/app/admin/AuditLogView.vue',
    expected: 'Audit Log'
  }
]

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error'
})

try {
  for (const item of cases) {
    const loaded = await vite.ssrLoadModule(item.module)
    assert.ok(loaded?.default, `${item.module} must export a Vue component`)

    const app = createSSRApp(loaded.default)
    app.use(createPinia())

    const html = await renderToString(app)
    assert.ok(
      html.includes(item.expected),
      `${item.module} SSR output must include ${JSON.stringify(item.expected)}`
    )
    assert.ok(html.length > 40, `${item.module} SSR output must not be empty`)
    console.log(`PASS component SSR: ${item.module}`)
  }
} finally {
  await vite.close()
}

console.log(`=== COMPONENT SSR SMOKE PASS (${cases.length}/${cases.length}) ===`)
