import test from 'node:test'
import assert from 'node:assert/strict'
import { createWebSessionClient } from '../src/adapters/api/webSessionApi.js'

test('Web session client uses canonical self-authenticating POST endpoints', async () => {
  const calls = []
  const fetchImpl = async (url, options) => {
    calls.push({ url, options })
    return {
      ok: true,
      json: async () => ({ ok: true, data: { accepted: true } })
    }
  }
  const client = createWebSessionClient({
    baseUrl: 'https://example.test/exec/',
    fetchImpl
  })

  await client.exchangeLineIdToken('raw-id-token')
  await client.verifySession('opaque-session')
  await client.revokeSession('opaque-session')

  assert.deepEqual(calls.map(c => c.url), [
    'https://example.test/exec/api/web/session/line',
    'https://example.test/exec/api/web/session/verify',
    'https://example.test/exec/api/web/session/revoke'
  ])
  assert.deepEqual(JSON.parse(calls[0].options.body), { idToken: 'raw-id-token' })
  assert.deepEqual(JSON.parse(calls[1].options.body), { sessionToken: 'opaque-session' })
  assert.deepEqual(JSON.parse(calls[2].options.body), { sessionToken: 'opaque-session' })
  assert.equal(calls.every(c => c.options.method === 'POST'), true)
})

test('Web session client fails closed on backend error envelope', async () => {
  const client = createWebSessionClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ ok: false, error: { code: 'UNAUTHENTICATED', message: 'bad session' } })
    })
  })
  await assert.rejects(() => client.verifySession('bad'), err => err.code === 'UNAUTHENTICATED')
})
