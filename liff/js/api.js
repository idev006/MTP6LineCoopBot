/**
 * LIFF API Client
 *
 * Fail-closed transport/envelope handling.
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

  async get(path, params = {}) {
    const queryParams = new URLSearchParams({
      path,
      api_key: CONFIG.API_KEY,
      ...params
    });

    const response = await fetch(`${CONFIG.API_BASE_URL}?${queryParams}`);
    return this.parseResponse(response);
  },

  async post(path, data = {}) {
    const response = await fetch(CONFIG.API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path,
        api_key: CONFIG.API_KEY,
        ...data
      })
    });
    return this.parseResponse(response);
  },

  async getMemberProfile(lineUserId) {
    return this.get('member/profile', { lineUserId });
  },

  async getSavings(lineUserId) {
    const data = await this.get('member/savings', { lineUserId });
    return data?.savings || [];
  },

  async getLoans(lineUserId) {
    const data = await this.get('member/loans', { lineUserId });
    return data?.loans || [];
  }
};
