import fs from 'node:fs'

const files = [
  new URL('../src/stores/auth.js', import.meta.url)
]

const forbidden = [
  /mock-token/i,
  /mock-liff-token/i,
  /Using mock data/i,
  /roles:\s*\[\s*['"]admin['"]/i
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

if (failed) process.exit(1)
console.log('PASS security-scan: no production auth mock fallback patterns')
