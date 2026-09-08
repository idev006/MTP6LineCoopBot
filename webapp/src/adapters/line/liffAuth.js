const LIFF_SDK_URL = 'https://static.line-scdn.net/liff/edge/2/sdk.js'

function loadScript(documentRef) {
  return new Promise((resolve, reject) => {
    const existing = documentRef.querySelector('script[data-mtp6-liff-sdk]')
    if (existing) {
      existing.addEventListener('load', resolve, { once: true })
      existing.addEventListener('error', () => reject(new Error('โหลด LINE Login SDK ไม่สำเร็จ')), { once: true })
      if (globalThis.liff) resolve()
      return
    }

    const script = documentRef.createElement('script')
    script.src = LIFF_SDK_URL
    script.async = true
    script.dataset.mtp6LiffSdk = 'true'
    script.addEventListener('load', resolve, { once: true })
    script.addEventListener('error', () => reject(new Error('โหลด LINE Login SDK ไม่สำเร็จ')), { once: true })
    documentRef.head.appendChild(script)
  })
}

export async function getVerifiedLineCredential({
  liffId,
  liff = globalThis.liff,
  documentRef = globalThis.document
} = {}) {
  const id = String(liffId || '').trim()
  if (!id || id.includes('your_liff_id')) {
    throw new Error('ยังไม่ได้ตั้งค่า VITE_LIFF_ID')
  }

  if (!liff) {
    if (!documentRef) throw new Error('LINE Login SDK ใช้งานไม่ได้')
    await loadScript(documentRef)
    liff = globalThis.liff
  }
  if (!liff) throw new Error('LINE Login SDK ใช้งานไม่ได้')

  await liff.init({ liffId: id })

  if (!liff.isLoggedIn()) {
    liff.login({ redirectUri: globalThis.location?.href })
    return null
  }

  const idToken = liff.getIDToken()
  if (!idToken) throw new Error('ไม่พบข้อมูลยืนยันตัวตนจาก LINE')
  return idToken
}

export function logoutLine(liff = globalThis.liff) {
  if (liff && typeof liff.isLoggedIn === 'function' && liff.isLoggedIn()) {
    liff.logout()
  }
}
