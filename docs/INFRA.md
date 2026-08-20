# Infrastructure Checklist

> **SSOT สำหรับ infra ทั้งหมดของโครงการ**  
> อัปเดตล่าสุด: 2026-08-20

---

## 1. Development Environment

- [ ] Node.js 18+ installed
- [ ] npm/pnpm installed
- [ ] Git configured (user.name, user.email)
- [ ] VS Code + extensions (Vue, Tailwind CSS IntelliSense, ESLint)
- [ ] clasp installed (`npm install -g @google/clasp`)
- [ ] clasp authorized (`clasp login`)

---

## 2. GitHub Repository

- [x] Repository: https://github.com/idev006/MTP6LineCoopBot.git (LIFF/Web App)
- [x] Repository: https://github.com/idev006/MTLineCoopBot.git (Apps Script)
- [ ] Branch strategy: `main` (production) + `develop` (staging)
- [ ] Branch protection rules (main)
- [ ] PR template created
- [ ] Issue templates created

---

## 3. LINE Configuration

- [x] LINE Official Account created
- [x] Channel Access Token (Long-lived)
- [x] Channel Secret
- [x] Webhook URL configured (with `?webhook_secret=XXX`)
- [x] Rich Menu deployed (5 tabs + Welcome)
- [ ] LIFF ID obtained (LINE Developers Console → LIFF)
- [ ] LIFF app created (scope: `profile`)

---

## 4. Google Apps Script (Backend API)

### 4.1 Core Setup
- [x] Apps Script project created
- [x] clasp configured (`.clasp.json`)
- [x] Script Properties configured:
  - [x] `CHANNEL_ACCESS_TOKEN`
  - [x] `CHANNEL_SECRET`
  - [x] `WEBHOOK_SECRET`
  - [x] `API_KEY`

### 4.2 Database (Google Sheets)
- [x] `t_member_mast` — สมาชิกสหกรณ์ (16 คอลัมน์)
- [x] `t_savings_acct` — บัญชีเงินฝาก
- [x] `t_loan_acct` — สัญญาเงินกู้
- [x] `t_dividend` — เงินปันผล
- [x] `t_activation_log` — ประวัติ activate
- [x] `t_expiry_log` — ประวัติหมดอายุ
- [x] `t_notice` — ประกาศ
- [x] `t_reminder_log` — ประวัติเตือนชำระ
- [x] `t_content` — เนื้อหาเมนูข้อมูล
- [ ] `t_user` — ผู้ใช้ Web App (staff/admin)
- [ ] `t_role` — Role definitions

### 4.3 API Endpoints
- [x] `GET /api/health` — ตรวจสอบสถานะ
- [x] `GET /api/member/profile` — ข้อมูลสมาชิก
- [x] `GET /api/member/savings` — บัญชีเงินฝาก
- [x] `GET /api/member/loans` — ยอดหนี้
- [x] `GET /api/member/dividends` — เงินปันผล
- [x] `GET /api/member/validity` — สถานะสิทธิ์
- [x] `POST /api/member/activate` — Activate สมาชิก
- [x] `POST /api/member/renew` — ต่ออายุสมาชิก
- [ ] `POST /api/auth/login` — Login (username/password)
- [ ] `POST /api/auth/liff` — LIFF Login
- [ ] `GET /api/user/member-list` — รายชื่อสมาชิก
- [ ] `GET /api/user/member-detail/:code` — รายละเอียดสมาชิก
- [ ] `POST /api/admin/member-activate` — กำหนด activate
- [ ] `POST /api/admin/member-renew` — ต่ออายุ
- [ ] `POST /api/admin/user-create` — สร้างผู้ใช้
- [ ] `POST /api/admin/user-update` — แก้ไขผู้ใช้
- [ ] `POST /api/admin/role-grant` — จัดการ roles

---

## 5. Web App (LIFF)

### 5.1 Frontend Setup
- [ ] Vue 3 + Vite initialized
- [ ] TailwindCSS configured
- [ ] DaisyUI configured
- [ ] Pinia configured
- [ ] Vue Router configured
- [ ] folder structure created

### 5.2 API Adapters
- [ ] AppsScriptAdapter created
- [ ] RestAdapter created (future)
- [ ] useApi composable created
- [ ] useAuth composable created
- [ ] useRole composable created

### 5.3 Stores
- [ ] auth.js — Authentication state
- [ ] member.js — Member data
- [ ] ui.js — UI state

### 5.4 Layouts
- [ ] DefaultLayout.vue — Guest (login)
- [ ] AppLayout.vue — Staff/Admin (main app)

### 5.5 Views
- [ ] LoginView.vue
- [ ] DashboardView.vue
- [ ] MemberListView.vue
- [ ] MemberDetailView.vue
- [ ] StaffManageView.vue (admin)
- [ ] RoleManageView.vue (admin)
- [ ] SettingsView.vue (admin)
- [ ] AuditLogView.vue (admin)

### 5.6 Deploy
- [ ] GitHub Pages configured
- [ ] GitHub Actions workflow created
- [ ] Auto deploy on push to main

---

## 6. CI/CD

- [ ] GitHub Actions: Lint + Test on PR
- [ ] GitHub Actions: Auto deploy to GitHub Pages
- [ ] GitHub Actions: clasp push on merge to main

---

## 7. Documentation

- [x] README.md — Project overview
- [x] KANBAN.md — Kanban board
- [x] SPRINT.md — Sprint planning
- [x] INFRA.md — This file
- [x] architecture.md — System architecture
- [x] data-dictionary.md — Data dictionary
- [x] test-matrix.md — Test matrix
- [x] test-uc3-to-7.md — UC3-7 test script

---

## 8. Security

- [x] Webhook secret configured
- [x] API key configured
- [ ] Password hashing (bcrypt/argon2)
- [ ] Session management
- [ ] Rate limiting
- [ ] Input validation
- [ ] Audit trail

---

## Quick Start

```bash
# 1. Clone repositories
git clone https://github.com/idev006/MTLineCoopBot.git
git clone https://github.com/idev006/MTP6LineCoopBot.git

# 2. Setup Apps Script
cd MTLineCoopBot
clasp push

# 3. Setup Web App
cd ../MTP6LineCoopBot/webapp
npm install
npm run dev

# 4. Configure environment
cp .env.example .env
# Edit .env with your values

# 5. Deploy
npm run build
# Push to GitHub → Auto deploy to GitHub Pages
```
