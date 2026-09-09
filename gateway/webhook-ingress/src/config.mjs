export const MIN_DOWNSTREAM_TIMEOUT_MS = 100
export const MAX_DOWNSTREAM_TIMEOUT_MS = 30_000

function isSecureDownstreamUrl(value) {
  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:' &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password &&
      !url.hash
    )
  } catch {
    return false
  }
}

export function loadConfig(env = process.env) {
  const cfg = {
    channelSecret: String(env.CHANNEL_SECRET || ''),
    downstreamUrl: String(env.DOWNSTREAM_URL || ''),
    downstreamSecret: String(env.DOWNSTREAM_SECRET || ''),
    port: Number(env.PORT || 8080),
    downstreamTimeoutMs: Number(env.DOWNSTREAM_TIMEOUT_MS || 8000)
  }

  const missing = []
  if (!cfg.channelSecret) missing.push('CHANNEL_SECRET')
  if (!cfg.downstreamUrl || !isSecureDownstreamUrl(cfg.downstreamUrl)) missing.push('DOWNSTREAM_URL')
  if (!cfg.downstreamSecret) missing.push('DOWNSTREAM_SECRET')
  if (cfg.channelSecret && cfg.downstreamSecret && cfg.channelSecret === cfg.downstreamSecret) missing.push('SECRET_INDEPENDENCE')
  if (!Number.isInteger(cfg.port) || cfg.port < 1 || cfg.port > 65535) missing.push('PORT')
  if (!Number.isInteger(cfg.downstreamTimeoutMs) || cfg.downstreamTimeoutMs < MIN_DOWNSTREAM_TIMEOUT_MS || cfg.downstreamTimeoutMs > MAX_DOWNSTREAM_TIMEOUT_MS) missing.push('DOWNSTREAM_TIMEOUT_MS')

  if (missing.length) {
    const err = new Error('Missing/invalid configuration: ' + missing.join(', '))
    err.code = 'CONFIG_INVALID'
    throw err
  }

  return Object.freeze(cfg)
}
