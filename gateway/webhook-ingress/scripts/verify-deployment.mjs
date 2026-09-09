import { computeLineSignature } from '../src/signature.mjs'

function required(name) {
  const value = String(process.env[name] || '').trim()
  if (!value) throw new Error(name + ' is required')
  return value
}

async function expectStatus(label, response, expected) {
  if (response.status !== expected) {
    const text = await response.text().catch(()=>'')
    throw new Error(`${label}: expected HTTP ${expected}, got ${response.status}: ${text.slice(0,200)}`)
  }
  console.log('PASS', label, 'HTTP', response.status)
}

const base = required('GATEWAY_URL').replace(/\/+$/, '')
const channelSecret = required('CHANNEL_SECRET')
const webhookUrl = base + '/webhook'

const health = await fetch(base + '/healthz', { redirect:'error' })
await expectStatus('healthz', health, 200)

const body = Buffer.from('{"destination":"STAGING_VERIFY","events":[]}', 'utf8')

const missing = await fetch(webhookUrl, {
  method:'POST',
  headers:{'content-type':'application/json; charset=utf-8'},
  body
})
await expectStatus('missing signature rejected', missing, 401)

const invalid = await fetch(webhookUrl, {
  method:'POST',
  headers:{
    'content-type':'application/json; charset=utf-8',
    'x-line-signature':'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
  },
  body
})
await expectStatus('invalid signature rejected', invalid, 401)

const signature = computeLineSignature(body, channelSecret)
const valid = await fetch(webhookUrl, {
  method:'POST',
  headers:{
    'content-type':'application/json; charset=utf-8',
    'x-line-signature':signature
  },
  body
})
if (valid.status < 200 || valid.status >= 300) {
  const text=await valid.text().catch(()=>'')
  throw new Error(`valid signed webhook: expected 2xx, got ${valid.status}: ${text.slice(0,200)}`)
}
console.log('PASS valid signed empty webhook HTTP', valid.status)
console.log('=== STAGING WEBHOOK INGRESS VERIFICATION PASS ===')
