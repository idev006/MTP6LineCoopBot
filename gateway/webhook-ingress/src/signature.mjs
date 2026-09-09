import crypto from 'node:crypto'

export function getHeaderCaseInsensitive(headers, targetName) {
  const target = String(targetName || '').toLowerCase()
  for (const [name, value] of Object.entries(headers || {})) {
    if (String(name).toLowerCase() === target) return Array.isArray(value) ? value[0] : value
  }
  return undefined
}

export function isLineSignatureFormatValid(value) {
  const text = String(value || '').trim()
  if (!text || !/^[A-Za-z0-9+/]+={0,2}$/.test(text) || text.length % 4 !== 0) {
    return false
  }
  return Buffer.from(text, 'base64').length === 32
}

function decodeBase64Signature(value) {
  if (!isLineSignatureFormatValid(value)) return null
  const text = String(value || '').trim()
  const decoded = Buffer.from(text, 'base64')
  return decoded.length === 32 ? decoded : null
}

export function computeLineSignature(rawBody, channelSecret) {
  if (!Buffer.isBuffer(rawBody)) throw new TypeError('rawBody must be a Buffer')
  if (!channelSecret) throw new Error('CHANNEL_SECRET is required')
  return crypto
    .createHmac('sha256', String(channelSecret))
    .update(rawBody)
    .digest('base64')
}

export function verifyLineSignature({ rawBody, signature, channelSecret }) {
  if (!Buffer.isBuffer(rawBody)) return false
  if (!channelSecret) return false

  const received = decodeBase64Signature(signature)
  if (!received) return false

  const expected = crypto
    .createHmac('sha256', String(channelSecret))
    .update(rawBody)
    .digest()

  if (received.length !== expected.length) return false
  return crypto.timingSafeEqual(received, expected)
}
