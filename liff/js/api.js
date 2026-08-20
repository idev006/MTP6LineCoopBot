/**
 * LIFF API Client
 * 
 * เรียก Apps Script API สำหรับ LIFF
 */

const API = {
  /**
   * เรียก API
   * @param {string} path - API path
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>}
   */
  async get(path, params = {}) {
    const queryParams = new URLSearchParams({
      path,
      api_key: CONFIG.API_KEY,
      ...params
    });

    const response = await fetch(`${CONFIG.API_BASE_URL}?${queryParams}`);
    return response.json();
  },

  /**
   * POST API
   * @param {string} path - API path
   * @param {Object} data - Request body
   * @returns {Promise<Object>}
   */
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
    return response.json();
  },

  /**
   * ดึงข้อมูลโปรไฟล์สมาชิก
   * @param {string} lineUserId
   * @returns {Promise<Object>}
   */
  async getMemberProfile(lineUserId) {
    const result = await this.get('member/profile', { lineUserId });
    return result.ok ? result.data : null;
  },

  /**
   * ดึงข้อมูลเงินฝาก
   * @param {string} lineUserId
   * @returns {Promise<Array>}
   */
  async getSavings(lineUserId) {
    const result = await this.get('member/savings', { lineUserId });
    return result.ok ? (result.data.savings || []) : [];
  },

  /**
   * ดึงข้อมูลเงินกู้
   * @param {string} lineUserId
   * @returns {Promise<Array>}
   */
  async getLoans(lineUserId) {
    const result = await this.get('member/loans', { lineUserId });
    return result.ok ? (result.data.loans || []) : [];
  }
};
