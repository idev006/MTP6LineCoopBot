import fs from 'node:fs'

const files = [
  new URL('../src/stores/auth.js', import.meta.url),
  new URL('../src/stores/member.js', import.meta.url),
  new URL('../src/adapters/api/webMemberApi.js', import.meta.url),
  new URL('../src/adapters/api/webSessionApi.js', import.meta.url),
  new URL('../src/adapters/line/liffAuth.js', import.meta.url),
  new URL('../src/router/index.js', import.meta.url)
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
  /U1234567890/
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

if (failed) process.exit(1)
console.log('PASS security-scan: Web auth requires server session authority and no client API-key trust')


const memberSrc = fs.readFileSync(new URL('../src/stores/member.js', import.meta.url), 'utf8')
if (!/createWebMemberClient/.test(memberSrc) || !/requireSessionToken/.test(memberSrc)) {
  console.error('FAIL security-scan: web member store must use session-authorized API')
  failed = true
}
if (/VITE_API_KEY/.test(memberSrc) || /mock data/i.test(memberSrc)) {
  console.error('FAIL security-scan: member store must not use client API key or mock fallback')
  failed = true
}

const memberApiSrc = fs.readFileSync(new URL('../src/adapters/api/webMemberApi.js', import.meta.url), 'utf8')
for (const path of ['/api/web/members/list', '/api/web/members/detail']) {
  if (!memberApiSrc.includes(path)) {
    console.error('FAIL security-scan: missing protected member endpoint ' + path)
    failed = true
  }
}
