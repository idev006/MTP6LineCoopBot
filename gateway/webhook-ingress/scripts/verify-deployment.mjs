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

async function postWebhook(webhookUrl, body, signature) {
  const headers = {'content-type':'application/json; charset=utf-8'}
  if (signature !== undefined) headers['x-line-signature'] = signature
  return fetch(webhookUrl, {
    method:'POST',
    headers,
    body
  })
}

const base = required('GATEWAY_URL').replace(/\/+$/, '')
const channelSecret = required('CHANNEL_SECRET')
const webhookUrl = base + '/webhook'

const health = await fetch(base + '/healthz', { redirect:'error' })
await expectStatus('healthz', health, 200)

const body = Buffer.from('{"destination":"STAGING_VERIFY","events":[]}', 'utf8')
const signature = computeLineSignature(body, channelSecret)

await expectStatus(
  'missing signature rejected',
  await postWebhook(webhookUrl, body),
  401
)

await expectStatus(
  'malformed Base64 signature rejected',
  await postWebhook(webhookUrl, body, '%%%not-base64%%%' ),
  401
)

await expectStatus(
  'wrong signature rejected',
  await postWebhook(
    webhookUrl,
    body,
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
  ),
  401
)

const tamperedBody = Buffer.from('{"destination":"STAGING_VERIFY","events":[{}]}', 'utf8')
await expectStatus(
  'tampered body with original valid signature rejected',
  await postWebhook(webhookUrl, tamperedBody, signature),
  401
)

const valid = await postWebhook(webhookUrl, body, signature)
if (valid.status < 200 || valid.status >= 300) {
  const text=await valid.text().catch(()=>'')
  throw new Error(`valid signed webhook: expected 2xx, got ${valid.status}: ${text.slice(0,200)}`)
}
console.log('PASS valid signed empty webhook HTTP', valid.status)
console.log('=== STAGING WEBHOOK INGRESS VERIFICATION PASS ===')
