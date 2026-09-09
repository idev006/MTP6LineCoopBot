# Kanban Board — MTLineCoopBot

> **SSOT สำหรับงานทั้งหมดของโครงการ**  
> กระบวนการ: Document-Driven + Agile Kanban (บทที่ 8)  
> WIP Limit: 2–3 การ์ด  
> อัปเดตล่าสุด: 2026-08-20

---

## 📥 Backlog (Priority Order)

### Sprint 1: Infrastructure ← ปัจจุบัน

- [ ] **INF-01** Init Vue 3 + Vite project
- [ ] **INF-02** Config TailwindCSS + DaisyUI
- [ ] **INF-03** Create folder structure
- [ ] **INF-04** Create API adapters
- [ ] **INF-05** Create Pinia stores
- [ ] **INF-06** Create Vue Router
- [ ] **INF-07** Add t_user to DataDict
- [ ] **INF-08** Add t_role to DataDict

### Sprint 2: Auth & User Management

- [ ] **AUTH-01** API: POST /api/auth/login
- [ ] **AUTH-02** API: POST /api/auth/liff
- [ ] **AUTH-03** API: GET /api/user/profile
- [ ] **AUTH-04** API: POST /api/admin/user-create
- [ ] **AUTH-05** API: POST /api/admin/user-update
- [ ] **AUTH-06** API: POST /api/admin/role-grant
- [ ] **AUTH-07** Store: auth.js
- [ ] **AUTH-08** Composable: useAuth.js
- [ ] **AUTH-09** View: LoginView.vue
- [ ] **AUTH-10** Component: AppHeader.vue

### Sprint 3: Member Management (Web)

- [ ] **MEM-01** API: GET /api/user/member-list
- [ ] **MEM-02** API: GET /api/user/member-detail/:code
- [ ] **MEM-03** API: POST /api/admin/member-activate
- [ ] **MEM-04** API: POST /api/admin/member-renew
- [ ] **MEM-05** Store: member.js
- [ ] **MEM-06** View: MemberListView.vue
- [ ] **MEM-07** View: MemberDetailView.vue
- [ ] **MEM-08** Component: MemberSearch.vue
- [ ] **MEM-09** Component: MemberTable.vue

### Sprint 4: LIFF App (Member)

- [ ] **LIFF-01** LIFF: index.html
- [ ] **LIFF-02** LIFF: MemberHome.vue
- [ ] **LIFF-03** LIFF: MemberProfile.vue
- [ ] **LIFF-04** LIFF: MemberSavings.vue
- [ ] **LIFF-05** LIFF: MemberLoans.vue
- [ ] **LIFF-06** Deploy to GitHub Pages

### Sprint 5: Reports & Settings

- [ ] **RPT-01** API: GET /api/user/reports
- [ ] **RPT-02** API: GET /api/admin/settings
- [ ] **RPT-03** API: GET /api/admin/audit-log
- [ ] **RPT-04** View: ReportView.vue
- [ ] **RPT-05** View: SettingsView.vue
- [ ] **RPT-06** View: AuditLogView.vue

### Sprint 6: Polish & Deploy

- [ ] **PLL-01** Responsive design
- [ ] **PLL-02** Error handling
- [ ] **PLL-03** Loading states
- [ ] **PLL-04** Unit tests
- [ ] **PLL-05** E2E tests
- [ ] **PLL-06** Documentation

---

## 🔨 In Progress (Sprint 1)

| ID | Task | Started | Notes |
|---|---|---|---|
| INF-01 | Init Vue 3 + Vite project | 2026-08-20 | |
| INF-02 | Config TailwindCSS + DaisyUI | 2026-08-20 | |
| INF-03 | Create folder structure | 2026-08-20 | |
| INF-04 | Create API adapters | 2026-08-20 | |
| INF-05 | Create Pinia stores | 2026-08-20 | |
| INF-06 | Create Vue Router | 2026-08-20 | |
| INF-07 | Add t_user to DataDict | 2026-08-20 | |
| INF-08 | Add t_role to DataDict | 2026-08-20 | |

---

## ✅ Done

| ID | Task | Completed | Sprint |
|---|---|---|---|
| CORE-07 | Deploy Rich Menu (Script Properties) | 2026-08-20 | Pre-Sprint |
| CORE-08 | Fix API URLs (USER_BASE) | 2026-08-20 | Pre-Sprint |
| CORE-01 | Rich Menu 5 tabs + Welcome | 2026-08-15 | Pre-Sprint |
| CORE-02 | Activate flow | 2026-08-15 | Pre-Sprint |
| CORE-03 | Gate logic | 2026-08-15 | Pre-Sprint |
| CORE-04 | Flex Builder | 2026-08-15 | Pre-Sprint |
| CORE-05 | API Layer (8 endpoints) | 2026-08-18 | Pre-Sprint |
| CORE-06 | Bot = UI Adapter (MT-17) | 2026-08-18 | Pre-Sprint |
| MT-37 | Flex Card เนื้อหาเมนูข้อมูล | 2026-08-15 | Pre-Sprint |
| MT-36 | Flex Card ประกาศ/เตือนชำระ | 2026-08-15 | Pre-Sprint |
| MT-35 | Alert/Confirm Card + ต่ออายุ 2 ขั้น | 2026-08-15 | Pre-Sprint |
| MT-34 | Flex Card ข้อมูลสมาชิก/การเงิน | 2026-08-15 | Pre-Sprint |
| MT-33 | Flex Component Library | 2026-08-15 | Pre-Sprint |
| MT-01 | Rich Menu 5 แท็บ + Alias + Deploy | 2026-08-10 | Pre-Sprint |
| MT-02 | Flex Message ตอบกลับเมนู | 2026-08-10 | Pre-Sprint |
| MT-03 | ระบบ Activate สมาชิก | 2026-08-10 | Pre-Sprint |
| MT-04 | DataDict SSOT (16 คอลัมน์) | 2026-08-10 | Pre-Sprint |
| MT-05 | ฟังก์ชันตรวจสอบสมาชิก | 2026-08-10 | Pre-Sprint |
| MT-06 | Contract Test (Item ID) | 2026-08-10 | Pre-Sprint |
| MT-08 | ตรวจสอบความถูกต้องของ Webhook | 2026-08-10 | Pre-Sprint |
| MT-09 | Gate ตรวจสิทธิ์ใน EventHandler | 2026-08-10 | Pre-Sprint |
| MT-15 | แยก Core Business Logic | 2026-08-12 | Pre-Sprint |
| MT-10 | ดึงข้อมูลจริงตามเมนู | 2026-08-12 | Pre-Sprint |

---

## 🚀 Deployed

| ID | Task | Deployed | Environment |
|---|---|---|---|
| DEP-01 | Apps Script (clasp push) | 2026-08-20 | Production |
| DEP-02 | Rich Menu | 2026-08-20 | LINE Production |

---

## 📊 Sprint Summary

| Sprint | Focus | Duration | Status |
|---|---|---|---|
| Sprint 0 | LINE Bot features | 2026-08-15 — 2026-08-20 | ✅ Done |
| Sprint 1 | Infrastructure | 2026-08-20 | 🔨 In Progress |
| Sprint 2 | Auth & User | TBD | 📋 Backlog |
| Sprint 3 | Member Management | TBD | 📋 Backlog |
| Sprint 4 | LIFF App | TBD | 📋 Backlog |
| Sprint 5 | Reports | TBD | 📋 Backlog |
| Sprint 6 | Polish & Deploy | TBD | 📋 Backlog |

---

## 📝 Notes

- แต่ละ sprint ประมาณ 1-2 วัน
- ต้อง review + demo หลังแต่ละ sprint
- Deploy หลัง review ผ่านเท่านั้น
- ดูรายละเอียดแต่ละ sprint ใน [SPRINT.md](./SPRINT.md)
