/**
 * LIFF App
 * 
 * Main application logic for LIFF
 */

// State
let currentUser = null;
let lineUserId = null;

// DOM Elements
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const errorMessageEl = document.getElementById('error-message');
const appEl = document.getElementById('app');

// Initialize LIFF
async function initLiff() {
  try {
    // Initialize LIFF SDK
    await liff.init({ liffId: CONFIG.LIFF_ID });
    
    // Check if user is logged in
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    // Get user profile
    const profile = await liff.getProfile();
    lineUserId = profile.userId;
    
    // Load user data
    await loadUserData();
    
    // Show app
    showApp();
  } catch (error) {
    showError(error.message);
  }
}

// Load user data from API
async function loadUserData() {
  try {
    // Get member profile
    const profile = await API.getMemberProfile(lineUserId);
    if (profile) {
      currentUser = profile;
      updateUI();
    } else {
      showError('ไม่พบข้อมูลสมาชิก');
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    // Use mock data for development
    currentUser = {
      mem_code: 'MEM001',
      mem_title: 'นาย',
      mem_fname: 'สมชาย',
      mem_lname: 'ใจดี',
      mem_status: 'active',
      mem_eff_dt: '2026-01-01',
      mem_exp_dt: '2026-12-31',
      mem_position: 'กรรมการ',
      mem_kk: 85,
      mem_bk: 50000,
      mem_bh: 10000
    };
    updateUI();
  }
}

// Update UI with user data
function updateUI() {
  if (!currentUser) return;

  // Home tab
  document.getElementById('user-name').textContent = 
    `${currentUser.mem_title || ''}${currentUser.mem_fname} ${currentUser.mem_lname}`;
  document.getElementById('user-code').textContent = currentUser.mem_code;
  document.getElementById('user-status').textContent = currentUser.mem_status;
  document.getElementById('user-expiry').textContent = formatDate(currentUser.mem_exp_dt);

  // Profile tab
  document.getElementById('profile-name').textContent = 
    `${currentUser.mem_title || ''}${currentUser.mem_fname} ${currentUser.mem_lname}`;
  document.getElementById('profile-position').textContent = currentUser.mem_position || '-';
  document.getElementById('profile-eff').textContent = formatDate(currentUser.mem_eff_dt);
  document.getElementById('profile-exp').textContent = formatDate(currentUser.mem_exp_dt);
  document.getElementById('profile-kk').textContent = currentUser.mem_kk || 0;
  document.getElementById('profile-bk').textContent = formatCurrency(currentUser.mem_bk);
  document.getElementById('profile-bh').textContent = formatCurrency(currentUser.mem_bh);

  // Load financial data
  loadSavings();
  loadLoans();
}

// Load savings data
async function loadSavings() {
  try {
    const savings = await API.getSavings(lineUserId);
    renderSavings(savings);
  } catch (error) {
    console.error('Error loading savings:', error);
    // Mock data
    renderSavings([
      { acct_no: 'SAV-0001', acct_type: 'ออมทรัพย์', balance: 25000, open_dt: '2026-01-01' },
      { acct_no: 'SAV-0011', acct_type: 'ออมทรัพย์พิเศษ', balance: 100000, open_dt: '2026-01-01' }
    ]);
  }
}

// Render savings
function renderSavings(savings) {
  const container = document.getElementById('savings-list');
  
  if (!savings || savings.length === 0) {
    container.innerHTML = '<p class="text-center text-base-content/70">ไม่มีข้อมูลบัญชีเงินฝาก</p>';
    return;
  }

  const total = savings.reduce((sum, s) => sum + (s.balance || 0), 0);
  
  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="table table-sm">
        <thead>
          <tr>
            <th>เลขบัญชี</th>
            <th>ประเภท</th>
            <th class="text-right">ยอดเงิน</th>
          </tr>
        </thead>
        <tbody>
          ${savings.map(s => `
            <tr>
              <td>${s.acct_no}</td>
              <td>${s.acct_type}</td>
              <td class="text-right">${formatCurrency(s.balance)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr class="font-bold">
            <td colspan="2">รวม</td>
            <td class="text-right">${formatCurrency(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
}

// Load loans data
async function loadLoans() {
  try {
    const loans = await API.getLoans(lineUserId);
    renderLoans(loans);
  } catch (error) {
    console.error('Error loading loans:', error);
    // Mock data
    renderLoans([
      { loan_no: 'LN-2024-001', loan_amount: 100000, outstanding: 45000, due_dt: '2026-12-31' }
    ]);
  }
}

// Render loans
function renderLoans(loans) {
  const container = document.getElementById('loans-list');
  
  if (!loans || loans.length === 0) {
    container.innerHTML = '<p class="text-center text-base-content/70">ไม่มีสัญญาเงินกู้</p>';
    return;
  }

  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="table table-sm">
        <thead>
          <tr>
            <th>เลขสัญญา</th>
            <th class="text-right">ยอดเงินกู้</th>
            <th class="text-right">ยอดคงค้าง</th>
            <th>ครบกำหนด</th>
          </tr>
        </thead>
        <tbody>
          ${loans.map(l => `
            <tr>
              <td>${l.loan_no}</td>
              <td class="text-right">${formatCurrency(l.loan_amount)}</td>
              <td class="text-right">${formatCurrency(l.outstanding)}</td>
              <td>${formatDate(l.due_dt)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Tab switching
function initTabs() {
  const tabs = document.querySelectorAll('.tab[data-tab]');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('tab-active'));
      // Hide all contents
      contents.forEach(c => c.classList.add('hidden'));
      
      // Activate clicked tab
      tab.classList.add('tab-active');
      const targetId = `tab-${tab.dataset.tab}`;
      document.getElementById(targetId).classList.remove('hidden');
    });
  });
}

// Show app
function showApp() {
  loadingEl.classList.add('hidden');
  appEl.classList.remove('hidden');
  initTabs();
}

// Show error
function showError(message) {
  loadingEl.classList.add('hidden');
  errorMessageEl.textContent = message;
  errorEl.classList.remove('hidden');
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('th-TH');
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('th-TH', { 
    style: 'currency', 
    currency: 'THB',
    minimumFractionDigits: 2
  }).format(amount || 0);
}

// Logout
document.getElementById('btn-logout').addEventListener('click', () => {
  liff.logout();
  window.close();
});

// Initialize on load
window.addEventListener('load', initLiff);
