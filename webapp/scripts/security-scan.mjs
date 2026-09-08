import fs from 'node:fs'

const files = [
  new URL('../src/stores/auth.js', import.meta.url),
  new URL('../src/stores/member.js', import.meta.url),
  new URL('../src/adapters/api/webMemberApi.js', import.meta.url),
  new URL('../src/adapters/api/webSessionApi.js', import.meta.url),
  new URL('../src/adapters/line/liffAuth.js', import.meta.url),
  new URL('../src/router/index.js', import.meta.url),
  new URL('../src/views/app/admin/SettingsView.vue', import.meta.url),
  new URL('../src/views/app/admin/AuditLogView.vue', import.meta.url),
  new URL('../src/views/app/admin/StaffManageView.vue', import.meta.url),
  new URL('../src/views/app/admin/RoleManageView.vue', import.meta.url),
  new URL('../src/adapters/api/webAdminApi.js', import.meta.url),
  new URL('../src/views/app/ReportView.vue', import.meta.url),
  new URL('../src/adapters/api/webReportApi.js', import.meta.url)
]

const forbidden = [
  /mock-token/i,
  /mock-liff-token/i,
  /Using mock data/i,
  /VITE_API_KEY/,
  /auth\/login/,
  /auth\/liff/,
  /localStorage\.setItem/,
  /getProfile\s*\(/,
  /user\/member-list/,
  /user\/member-detail/,
  /admin\/member-activate/,
  /admin\/member-renew/,
  /Mock data for development/i,
  /MEM001/,
  /U1234567890/,
  /path:\s*['"]admin\/settings['"]/,
  /path:\s*['"]admin\/audit-log['"]/,
  /path:\s*['"]admin\/staff['"]/,
  /path:\s*['"]admin\/roles['"]/,
  /path:\s*['"]user\/reports['"]/,
  /api_key\s*:/
]

let failed = false
for (const url of files) {
  const src = fs.readFileSync(url, 'utf8')
  for (const pattern of forbidden) {
    if (pattern.test(src)) {
      console.error(`FAIL security-scan: ${pattern} found in ${url.pathname}`)
      failed = true
    }
  }
}

const authSrc = fs.readFileSync(new URL('../src/stores/auth.js', import.meta.url), 'utf8')
if (/roles:\s*\[\s*['"]admin['"]/i.test(authSrc)) {
  console.error('FAIL security-scan: hardcoded admin auth fallback found in auth store')
  failed = true
}
if (!/serverVerified\.value\s*&&/.test(authSrc)) {
  console.error('FAIL security-scan: isAuthenticated must require serverVerified')
  failed = true
}
if (!/verifySession\(savedToken\)/.test(authSrc)) {
  console.error('FAIL security-scan: persisted session must be verified by server')
  failed = true
}

const routerSrc = fs.readFileSync(new URL('../src/router/index.js', import.meta.url), 'utf8')
if (!/await auth\.ensureServerSession\(\)/.test(routerSrc)) {
  console.error('FAIL security-scan: protected router must await server session verification')
  failed = true
}

const memberSrc = fs.readFileSync(new URL('../src/stores/member.js', import.meta.url), 'utf8')
if (!/createWebMemberClient/.test(memberSrc) || !/requireSessionToken/.test(memberSrc)) {
  console.error('FAIL security-scan: web member store must use session-authorized API')
  failed = true
}
if (/VITE_API_KEY/.test(memberSrc) || /mock data/i.test(memberSrc)) {
  console.error('FAIL security-scan: member store must not use client API key or mock fallback')
  failed = true
}
if (!/renewMember\(requireSessionToken\(\), memberCode\)/.test(memberSrc)) {
  console.error('FAIL security-scan: member renewal must use protected session API')
  failed = true
}

const memberApiSrc = fs.readFileSync(new URL('../src/adapters/api/webMemberApi.js', import.meta.url), 'utf8')
for (const path of ['/api/web/members/list', '/api/web/members/detail', '/api/web/members/renew']) {
  if (!memberApiSrc.includes(path)) {
    console.error('FAIL security-scan: missing protected member endpoint ' + path)
    failed = true
  }
}


const settingsSrc = fs.readFileSync(new URL('../src/views/app/admin/SettingsView.vue', import.meta.url), 'utf8')
if (!/createWebAdminClient/.test(settingsSrc) || !/auth\.token/.test(settingsSrc)) {
  console.error('FAIL security-scan: admin settings must use session-authorized API')
  failed = true
}
if (/VITE_API_KEY/.test(settingsSrc) || /Using mock data/i.test(settingsSrc) || /Mock data/i.test(settingsSrc)) {
  console.error('FAIL security-scan: admin settings must not use client API key or synthetic fallback')
  failed = true
}

const adminApiSrc = fs.readFileSync(new URL('../src/adapters/api/webAdminApi.js', import.meta.url), 'utf8')
if (!adminApiSrc.includes('/api/web/admin/settings')) {
  console.error('FAIL security-scan: protected admin settings endpoint missing from admin API client')
  failed = true
}
if (!adminApiSrc.includes('/api/web/admin/audit-log')) {
  console.error('FAIL security-scan: protected admin audit endpoint missing from admin API client')
  failed = true
}
if (!adminApiSrc.includes('/api/web/admin/staff')) {
  console.error('FAIL security-scan: protected admin staff endpoint missing from admin API client')
  failed = true
}
if (!adminApiSrc.includes('/api/web/admin/roles')) {
  console.error('FAIL security-scan: protected admin role catalog endpoint missing from admin API client')
  failed = true
}
if (!adminApiSrc.includes('/api/web/admin/staff/role')) {
  console.error('FAIL security-scan: protected staff role assignment endpoint missing from admin API client')
  failed = true
}

const roleSrc = fs.readFileSync(new URL('../src/views/app/admin/RoleManageView.vue', import.meta.url), 'utf8')
if (!/createWebAdminClient/.test(roleSrc) || !/auth\.token/.test(roleSrc)) {
  console.error('FAIL security-scan: role management must use session-authorized role catalog API')
  failed = true
}
if (/Sprint 2/.test(roleSrc) || /VITE_API_KEY/.test(roleSrc) || /mock data/i.test(roleSrc)) {
  console.error('FAIL security-scan: role management must not use placeholder, client API key or mock fallback')
  failed = true
}

const staffSrc = fs.readFileSync(new URL('../src/views/app/admin/StaffManageView.vue', import.meta.url), 'utf8')
if (!/createWebAdminClient/.test(staffSrc) || !/auth\.token/.test(staffSrc)) {
  console.error('FAIL security-scan: staff management must use session-authorized API')
  failed = true
}
if (/VITE_API_KEY/.test(staffSrc) || /Sprint 2/.test(staffSrc) || /mock data/i.test(staffSrc)) {
  console.error('FAIL security-scan: staff management must not use client API key or placeholder/mock fallback')
  failed = true
}
if (!/assignStaffRole\(auth\.token, account\.memberCode, newRole\)/.test(staffSrc)) {
  console.error('FAIL security-scan: staff role changes must use protected session-authorized write API')
  failed = true
}
if (!/isSelf\(account\)/.test(staffSrc)) {
  console.error('FAIL security-scan: staff role UI must preserve self-change protection')
  failed = true
}

const auditSrc = fs.readFileSync(new URL('../src/views/app/admin/AuditLogView.vue', import.meta.url), 'utf8')
if (!/createWebAdminClient/.test(auditSrc) || !/auth\.token/.test(auditSrc)) {
  console.error('FAIL security-scan: admin audit log must use session-authorized API')
  failed = true
}
if (/VITE_API_KEY/.test(auditSrc) || /Using mock data/i.test(auditSrc) || /Mock data/i.test(auditSrc) || /activateCode/.test(auditSrc)) {
  console.error('FAIL security-scan: admin audit log must not use client API key, synthetic fallback or activation secrets')
  failed = true
}

const reportSrc = fs.readFileSync(new URL('../src/views/app/ReportView.vue', import.meta.url), 'utf8')
if (!/createWebReportClient/.test(reportSrc) || !/auth\.token/.test(reportSrc)) {
  console.error('FAIL security-scan: report view must use session-authorized API')
  failed = true
}
if (/VITE_API_KEY/.test(reportSrc) || /Using mock data/i.test(reportSrc) || /Mock data/i.test(reportSrc)) {
  console.error('FAIL security-scan: report view must not use client API key or synthetic fallback')
  failed = true
}

const reportApiSrc = fs.readFileSync(new URL('../src/adapters/api/webReportApi.js', import.meta.url), 'utf8')
if (!reportApiSrc.includes('/api/web/reports/summary')) {
  console.error('FAIL security-scan: protected summary report endpoint missing from report API client')
  failed = true
}

if (failed) process.exit(1)
console.log('PASS security-scan: Web auth/member data require server session authority with no client API-key/mock trust')
