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
  if (!cfg.downstreamUrl) missing.push('DOWNSTREAM_URL')
  if (!cfg.downstreamSecret) missing.push('DOWNSTREAM_SECRET')
  if (!Number.isInteger(cfg.port) || cfg.port < 1 || cfg.port > 65535) missing.push('PORT')
  if (!Number.isFinite(cfg.downstreamTimeoutMs) || cfg.downstreamTimeoutMs < 100) missing.push('DOWNSTREAM_TIMEOUT_MS')

  if (missing.length) {
    const err = new Error('Missing/invalid configuration: ' + missing.join(', '))
    err.code = 'CONFIG_INVALID'
    throw err
  }

  return Object.freeze(cfg)
}
