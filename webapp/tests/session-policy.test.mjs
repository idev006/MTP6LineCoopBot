import test from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizeRoles,
  isSessionShapeValid,
  primaryRole,
  parseStoredUser
} from '../src/engine/auth/sessionPolicy.js'

test('session requires both token and valid user', () => {
  const user = { code: 'U1', roles: ['staff'] }
  assert.equal(isSessionShapeValid({ token: 'token', user }), true)
  assert.equal(isSessionShapeValid({ token: null, user }), false)
  assert.equal(isSessionShapeValid({ token: 'token', user: null }), false)
  assert.equal(isSessionShapeValid({ token: 'token', user: { roles: ['admin'] } }), false)
})

test('roles are normalized and primary role deterministic', () => {
  assert.deepEqual(normalizeRoles(['staff', 'admin', 'staff', '', null]), ['staff', 'admin'])
  assert.equal(primaryRole(['staff', 'admin']), 'admin')
  assert.equal(primaryRole(['custom']), 'custom')
})

test('stored user parsing fails closed', () => {
  assert.equal(parseStoredUser('{bad json'), null)
  assert.equal(parseStoredUser(JSON.stringify({ roles: ['admin'] })), null)
  assert.deepEqual(
    parseStoredUser(JSON.stringify({ code: 'U1', roles: ['staff', 'staff'] })),
    { code: 'U1', roles: ['staff'] }
  )
})
