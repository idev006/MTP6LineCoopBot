/**
 * LIFF App
 * 
 * Main application logic for LIFF
 */

// State
let currentUser = null;
let idToken = null;

// DOM Elements
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const errorMessageEl = document.getElementById('error-message');
const appEl = document.getElementById('app');
const activationEl = document.getElementById('activation');
const activationFormEl = document.getElementById('activation-form');
const activationCodeEl = document.getElementById('activation-code');
const activationErrorEl = document.getElementById('activation-error');
const activationErrorMessageEl = document.getElementById('activation-error-message');
const activationSubmitEl = document.getElementById('activation-submit');
const renewButtonEl = document.getElementById('btn-renew-member');
const renewStatusEl = document.getElementById('renew-status');

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

    // Obtain the raw ID token for server-side verification.
    // Never use client profile/userId as identity proof for protected member data.
    idToken = liff.getIDToken();
    if (!idToken) {
      throw new Error('ไม่พบข้อมูลยืนยันตัวตนจาก LINE กรุณาเข้าสู่ระบบใหม่');
    }

    // Load user data. Unlinked verified identities are handed to secure activation.
    const linked = await loadUserData();
    if (linked) {
      showApp();
    }
  } catch (error) {
    showError(error.message);
  }
}

// Load user data from API
async function loadUserData() {
  try {
    // Get member profile
    const profile = await API.getCurrentMemberProfile(idToken);
    if (profile) {
      currentUser = profile;
      updateUI();
      return true;
    }
    showError('ไม่พบข้อมูลสมาชิก');
    return false;
  } catch (error) {
    console.error('Error loading user data:', error);
    currentUser = null;

    if (error && error.code === 'MEMBER_NOT_LINKED') {
      showActivation();
      return false;
    }

    showError(error.message || 'ไม่สามารถโหลดข้อมูลสมาชิกได้');
    throw error;
  }
}

function showActivation() {
  loadingEl.classList.add('hidden');
  errorEl.classList.add('hidden');
  appEl.classList.add('hidden');
  activationErrorEl.classList.add('hidden');
  activationErrorMessageEl.textContent = '';
  activationEl.classList.remove('hidden');
  activationCodeEl.focus();
}

async function handleActivationSubmit(event) {
  event.preventDefault();
  activationErrorEl.classList.add('hidden');
  activationErrorMessageEl.textContent = '';

  const activateCode = activationCodeEl.value.trim();
  if (!activateCode) {
    activationErrorMessageEl.textContent = 'กรุณาระบุรหัส activate';
    activationErrorEl.classList.remove('hidden');
    return;
  }

  activationSubmitEl.disabled = true;
  try {
    await API.activateCurrentMember(idToken, activateCode);
    activationCodeEl.value = '';
    activationEl.classList.add('hidden');
    loadingEl.classList.remove('hidden');

    const linked = await loadUserData();
    if (linked) showApp();
  } catch (error) {
    activationErrorMessageEl.textContent = error?.message || 'ไม่สามารถเปิดสิทธิ์สมาชิกได้';
    activationErrorEl.classList.remove('hidden');
  } finally {
    activationSubmitEl.disabled = false;
  }
}

async function handleRenewMember() {
  if (!idToken) {
    showError('ไม่พบข้อมูลยืนยันตัวตนจาก LINE กรุณาเข้าสู่ระบบใหม่');
    return;
  }

  renewButtonEl.disabled = true;
  renewStatusEl.textContent = 'กำลังต่ออายุสมาชิก...';
  renewStatusEl.className = 'text-sm text-info mt-2';

  try {
    const result = await API.renewCurrentMember(idToken);
    renewStatusEl.textContent = 'ต่ออายุสมาชิกสำเร็จ สิทธิ์ใหม่ถึงวันที่ ' + formatDate(result.mem_exp_dt);
    renewStatusEl.className = 'text-sm text-success mt-2';

    const linked = await loadUserData();
    if (linked) showApp();
  } catch (error) {
    renewStatusEl.textContent = error?.message || 'ไม่สามารถต่ออายุสมาชิกได้';
    renewStatusEl.className = 'text-sm text-error mt-2';
  } finally {
    renewButtonEl.disabled = false;
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
    const savings = await API.getCurrentSavings(idToken);
    renderSavings(savings);
  } catch (error) {
    console.error('Error loading savings:', error);
    renderDataError('savings-list', error.message || 'ไม่สามารถโหลดข้อมูลเงินฝากได้');
  }
}


// Render an explicit data-load error. Never substitute financial mock data.
function renderDataError(containerId, message) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.textContent = '';
  const p = document.createElement('p');
  p.className = 'text-center text-error';
  p.textContent = message;
  container.appendChild(p);
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
    const loans = await API.getCurrentLoans(idToken);
    renderLoans(loans);
  } catch (error) {
    console.error('Error loading loans:', error);
    renderDataError('loans-list', error.message || 'ไม่สามารถโหลดข้อมูลเงินกู้ได้');
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

activationFormEl.addEventListener('submit', handleActivationSubmit);
renewButtonEl.addEventListener('click', handleRenewMember);

// Logout
document.getElementById('btn-logout').addEventListener('click', () => {
  liff.logout();
  window.close();
});

// Initialize on load
window.addEventListener('load', initLiff);
