export async function forwardVerifiedWebhook({
  rawBody,
  downstreamUrl,
  downstreamSecret,
  timeoutMs,
  fetchImpl = fetch
}) {
  if (!Buffer.isBuffer(rawBody)) throw new TypeError('rawBody must be a Buffer')

  const url = new URL(downstreamUrl)
  url.searchParams.set('webhook_secret', downstreamSecret)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetchImpl(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      body: rawBody,
      signal: controller.signal,
      redirect: 'error'
    })

    if (response.body?.cancel) {
      await response.body.cancel()
    }

    if (!response.ok) {
      const err = new Error('Downstream returned HTTP ' + response.status)
      err.code = 'DOWNSTREAM_HTTP_ERROR'
      err.status = response.status
      throw err
    }

    return { status: response.status }
  } finally {
    clearTimeout(timer)
  }
}
