#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const root = path.join(__dirname, '..')

const router = fs.readFileSync(path.join(root, 'src', 'router', 'index.js'), 'utf8')
const auth = fs.readFileSync(path.join(root, 'src', 'stores', 'auth.js'), 'utf8')
const main = fs.readFileSync(path.join(root, 'src', 'main.js'), 'utf8')

const requiredRoutes = [
  "name: 'members'",
  "name: 'member-detail'",
  "name: 'reports'",
  "name: 'admin-staff'",
  "name: 'admin-roles'",
  "name: 'admin-settings'",
  "name: 'admin-audit'"
]
for (const marker of requiredRoutes) {
  if (!router.includes(marker)) throw new Error('missing critical route: ' + marker)
}

if (!/await\s+auth\.ensureServerSession\(\)/.test(router)) {
  throw new Error('protected navigation must re-verify server session')
}
if (!/roles:\s*\['staff',\s*'admin',\s*'manager'\]/.test(router)) {
  throw new Error('staff/manager/admin route vocabulary changed unexpectedly')
}
if (!/roles:\s*\['admin'\]/.test(router)) {
  throw new Error('admin-only route protection missing')
}

if (!/serverVerified\.value\s*&&/.test(auth) || !/isSessionShapeValid/.test(auth)) {
  throw new Error('auth store must require server-verified session shape')
}
if (!/sessionStorage\.setItem\(STORAGE_KEY/.test(auth)) {
  throw new Error('opaque Web session token storage contract changed')
}
if (/localStorage\.setItem\(['"]auth_(token|user)/.test(auth)) {
  throw new Error('client-authoritative auth persistence must not return')
}

if (!/app\.use\(createPinia\(\)\)/.test(main) || !/app\.use\(router\)/.test(main)) {
  throw new Error('Vue app must install Pinia and Router')
}

console.log('PASS  critical router inventory and role guards')
console.log('PASS  protected navigation requires server verification')
console.log('PASS  Pinia auth store remains server-authoritative')
console.log('PASS  Vue app installs Pinia + Router')
console.log('=== ROUTER / STORE SMOKE TESTS PASS (4/4) ===')
