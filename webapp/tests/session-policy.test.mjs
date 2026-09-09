import test from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizeRoles,
  isSessionShapeValid,
  primaryRole
} from '../src/engine/auth/sessionPolicy.js'

test('session requires opaque token and server Principal-shaped user', () => {
  const user = { subject: 'web:line:U1', roles: ['staff'], memberCode: 'M1' }
  assert.equal(isSessionShapeValid({ token: 'token', user }), true)
  assert.equal(isSessionShapeValid({ token: null, user }), false)
  assert.equal(isSessionShapeValid({ token: 'token', user: null }), false)
  assert.equal(isSessionShapeValid({ token: 'token', user: { roles: ['admin'] } }), false)
  assert.equal(isSessionShapeValid({ token: 'token', user: { code: 'legacy', roles: ['admin'] } }), false)
})

test('roles are normalized and primary role deterministic', () => {
  assert.deepEqual(normalizeRoles(['staff', 'admin', 'staff', '', null]), ['staff', 'admin'])
  assert.equal(primaryRole(['staff', 'admin']), 'admin')
  assert.equal(primaryRole(['manager', 'staff']), 'manager')
  assert.equal(primaryRole(['custom']), 'custom')
})
