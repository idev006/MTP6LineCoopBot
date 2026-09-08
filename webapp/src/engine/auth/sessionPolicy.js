/**
 * Pure authentication/session policy.
 * No Vue, Pinia, DOM, localStorage or network dependencies.
 */

export function normalizeRoles(roles) {
  if (!Array.isArray(roles)) return []
  return [...new Set(roles.filter(r => typeof r === 'string' && r.trim()).map(r => r.trim()))]
}

export function isValidUser(user) {
  return !!(
    user &&
    typeof user === 'object' &&
    typeof user.code === 'string' &&
    user.code.trim() &&
    Array.isArray(user.roles)
  )
}

export function isValidToken(token) {
  return typeof token === 'string' && token.trim().length > 0
}

export function isSessionShapeValid({ token, user } = {}) {
  return isValidToken(token) && isValidUser(user)
}

export function primaryRole(roles) {
  const normalized = normalizeRoles(roles)
  if (!normalized.length) return null
  const priority = ['admin', 'manager', 'staff', 'auditor']
  return priority.find(r => normalized.includes(r)) || normalized[0]
}

export function parseStoredUser(raw) {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!isValidUser(parsed)) return null
    return { ...parsed, roles: normalizeRoles(parsed.roles) }
  } catch {
    return null
  }
}
