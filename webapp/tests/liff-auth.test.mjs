import test from 'node:test'
import assert from 'node:assert/strict'
import { getVerifiedLineCredential } from '../src/adapters/line/liffAuth.js'

test('LIFF adapter returns only raw ID token after authenticated init', async () => {
  let initId = null
  let profileCalled = false
  const liff = {
    init: async ({ liffId }) => { initId = liffId },
    isLoggedIn: () => true,
    getIDToken: () => 'raw-line-id-token',
    getProfile: async () => { profileCalled = true; return { userId: 'CLIENT-ID' } }
  }
  const token = await getVerifiedLineCredential({ liffId: '2000000000-test', liff })
  assert.equal(initId, '2000000000-test')
  assert.equal(token, 'raw-line-id-token')
  assert.equal(profileCalled, false)
})

test('LIFF adapter redirects login and grants no credential before login', async () => {
  let loginCalled = false
  const liff = {
    init: async () => {},
    isLoggedIn: () => false,
    login: () => { loginCalled = true },
    getIDToken: () => { throw new Error('must not be called') }
  }
  const token = await getVerifiedLineCredential({ liffId: '2000000000-test', liff })
  assert.equal(token, null)
  assert.equal(loginCalled, true)
})

test('LIFF adapter fails closed when LIFF ID is not configured', async () => {
  await assert.rejects(
    () => getVerifiedLineCredential({ liffId: 'your_liff_id', liff: {} }),
    /VITE_LIFF_ID/
  )
})
