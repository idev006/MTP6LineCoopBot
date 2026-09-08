/**
 * LIFF API Client
 *
 * Protected member data uses raw LINE ID tokens and POST-only self-service routes.
 * Client-visible API keys and client-provided lineUserId are not authentication proof.
 */

const API = {
  async parseResponse(response) {
    if (!response || !response.ok) {
      throw new Error('ไม่สามารถเชื่อมต่อระบบบริการข้อมูลได้');
    }

    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error('รูปแบบข้อมูลตอบกลับจากระบบไม่ถูกต้อง');
    }

    if (!result || result.ok !== true) {
      const error = new Error(result?.error?.message || 'ระบบไม่สามารถให้บริการข้อมูลได้');
      error.code = result?.error?.code || 'API_ERROR';
      throw error;
    }

    return result.data;
  },

  buildApiUrl(path) {
    const base = String(CONFIG.API_BASE_URL || '').replace(/\/+$/, '');
    const normalized = String(path || '').replace(/^\/+/, '');
    return `${base}/api/${normalized}`;
  },

  async postProtected(path, idToken, data = {}) {
    if (!idToken || typeof idToken !== 'string') {
      const error = new Error('ไม่พบข้อมูลยืนยันตัวตนจาก LINE');
      error.code = 'UNAUTHENTICATED';
      throw error;
    }

    const response = await fetch(this.buildApiUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idToken,
        ...data
      })
    });

    return this.parseResponse(response);
  },

  async getCurrentMemberProfile(idToken) {
    return this.postProtected('member/me/profile', idToken);
  },

  async getCurrentSavings(idToken) {
    const data = await this.postProtected('member/me/savings', idToken);
    return data?.savings || [];
  },

  async getCurrentLoans(idToken) {
    const data = await this.postProtected('member/me/loans', idToken);
    return data?.loans || [];
  },

  async getCurrentDividends(idToken) {
    const data = await this.postProtected('member/me/dividends', idToken);
    return data?.dividends || [];
  }
};
