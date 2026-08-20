# Sprint Planning

> **SSOT สำหรับการวางแผน Sprint**  
> กระบวนการ: Agile Kanban (บทที่ 8)  
> Sprint Duration: 1-2 วัน  
> WIP Limit: 2-3 การ์ด

---

## Sprint 0: Pre-Sprint (เสร็จแล้ว)

> **วันที่:** 2026-08-15 — 2026-08-20  
> **Goal:** พัฒนา LINE Bot features หลัก

### Tasks (เสร็จแล้ว)
| ID | Task | Status | Notes |
|---|---|---|---|
| CORE-01 | Rich Menu 5 tabs + Welcome | ✅ Done | |
| CORE-02 | Activate flow | ✅ Done | |
| CORE-03 | Gate logic | ✅ Done | |
| CORE-04 | Flex Builder | ✅ Done | |
| CORE-05 | API Layer (8 endpoints) | ✅ Done | |
| CORE-06 | Bot = UI Adapter (MT-17) | ✅ Done | |
| CORE-07 | Deploy Rich Menu (Script Properties) | ✅ Done | ไม่ใช้ alias |
| CORE-08 | Fix API URLs (USER_BASE) | ✅ Done | |

### Demo
- ✅ Rich Menu ทำงาน
- ✅ Activate สำเร็จ
- ✅ Menu items ตอบกลับถูกต้อง
- ✅ Flex Cards แสดงข้อมูลจริง

---

## Sprint 1: Infrastructure

> **วันที่:** 2026-08-20  
> **Goal:** เตรียม infra สำหรับ Web App development

### Tasks
| ID | Task | Status | Assignee |
|---|---|---|---|
| INF-01 | Init Vue 3 + Vite project | 🔨 In Progress | Buffy |
| INF-02 | Config TailwindCSS + DaisyUI | 🔨 In Progress | Buffy |
| INF-03 | Create folder structure | 🔨 In Progress | Buffy |
| INF-04 | Create API adapters | 🔨 In Progress | Buffy |
| INF-05 | Create Pinia stores | 🔨 In Progress | Buffy |
| INF-06 | Create Vue Router | 🔨 In Progress | Buffy |
| INF-07 | Add t_user to DataDict | 🔨 In Progress | Buffy |
| INF-08 | Add t_role to DataDict | 🔨 In Progress | Buffy |

### Definition of Done
- [ ] Vue 3 project runs without error
- [ ] TailwindCSS + DaisyUI works
- [ ] API adapters created (AppsScript + Rest)
- [ ] Pinia stores created (auth, member, ui)
- [ ] Vue Router configured
- [ ] DataDict updated (t_user, t_role)
- [ ] Code pushed to GitHub

### Demo
- [ ] Show Vue app running
- [ ] Show DaisyUI components
- [ ] Show API adapter switching
- [ ] Show Pinia store
- [ ] Show Vue Router navigation

---

## Sprint 2: Auth & User Management

> **วันที่:** TBD  
> **Goal:** ระบบ authentication สำหรับ Web App

### Tasks
| ID | Task | Status | Notes |
|---|---|---|---|
| AUTH-01 | API: POST /api/auth/login | 📋 Backlog | username/password |
| AUTH-02 | API: POST /api/auth/liff | 📋 Backlog | LINE Login |
| AUTH-03 | API: GET /api/user/profile | 📋 Backlog | |
| AUTH-04 | API: POST /api/admin/user-create | 📋 Backlog | |
| AUTH-05 | API: POST /api/admin/user-update | 📋 Backlog | |
| AUTH-06 | API: POST /api/admin/role-grant | 📋 Backlog | |
| AUTH-07 | Store: auth.js | 📋 Backlog | login, logout, roles |
| AUTH-08 | Composable: useAuth.js | 📋 Backlog | |
| AUTH-09 | View: LoginView.vue | 📋 Backlog | DaisyUI card + form |
| AUTH-10 | Component: AppHeader.vue | 📋 Backlog | user dropdown |

### Definition of Done
- [ ] Login works (username/password)
- [ ] LIFF login works
- [ ] Roles stored in Pinia
- [ ] Navigation guard works
- [ ] Logout works

---

## Sprint 3: Member Management (Web)

> **วันที่:** TBD  
> **Goal:** จัดการสมาชิกผ่าน Web App

### Tasks
| ID | Task | Status | Notes |
|---|---|---|---|
| MEM-01 | API: GET /api/user/member-list | 📋 Backlog | |
| MEM-02 | API: GET /api/user/member-detail/:code | 📋 Backlog | |
| MEM-03 | API: POST /api/admin/member-activate | 📋 Backlog | |
| MEM-04 | API: POST /api/admin/member-renew | 📋 Backlog | |
| MEM-05 | Store: member.js | 📋 Backlog | |
| MEM-06 | View: MemberListView.vue | 📋 Backlog | DaisyUI table |
| MEM-07 | View: MemberDetailView.vue | 📋 Backlog | DaisyUI card |
| MEM-08 | Component: MemberSearch.vue | 📋 Backlog | DaisyUI input |
| MEM-09 | Component: MemberTable.vue | 📋 Backlog | DaisyUI table |

### Definition of Done
- [ ] Member list displays
- [ ] Member detail displays
- [ ] Activate from web works
- [ ] Renew from web works
- [ ] Search works

---

## Sprint 4: LIFF App (Member)

> **วันที่:** TBD  
> **Goal:** LIFF app สำหรับสมาชิก

### Tasks
| ID | Task | Status | Notes |
|---|---|---|---|
| LIFF-01 | LIFF: index.html | 📋 Backlog | entry point |
| LIFF-02 | LIFF: MemberHome.vue | 📋 Backlog | dashboard |
| LIFF-03 | LIFF: MemberProfile.vue | 📋 Backlog | |
| LIFF-04 | LIFF: MemberSavings.vue | 📋 Backlog | |
| LIFF-05 | LIFF: MemberLoans.vue | 📋 Backlog | |
| LIFF-06 | Deploy to GitHub Pages | 📋 Backlog | |

### Definition of Done
- [ ] LIFF opens in LINE
- [ ] Member can view profile
- [ ] Member can view savings
- [ ] Member can view loans
- [ ] Deployed to GitHub Pages

---

## Sprint 5: Reports & Settings

> **วันที่:** TBD  
> **Goal:** รายงานและตั้งค่าระบบ

### Tasks
| ID | Task | Status | Notes |
|---|---|---|---|
| RPT-01 | API: GET /api/user/reports | 📋 Backlog | |
| RPT-02 | API: GET /api/admin/settings | 📋 Backlog | |
| RPT-03 | API: GET /api/admin/audit-log | 📋 Backlog | |
| RPT-04 | View: ReportView.vue | 📋 Backlog | |
| RPT-05 | View: SettingsView.vue | 📋 Backlog | |
| RPT-06 | View: AuditLogView.vue | 📋 Backlog | |

### Definition of Done
- [ ] Reports display
- [ ] Settings page works
- [ ] Audit log displays

---

## Sprint 6: Polish & Deploy

> **วันที่:** TBD  
> **Goal:** Final polish and production deploy

### Tasks
| ID | Task | Status | Notes |
|---|---|---|---|
| PLL-01 | Responsive design | 📋 Backlog | mobile-first |
| PLL-02 | Error handling | 📋 Backlog | |
| PLL-03 | Loading states | 📋 Backlog | DaisyUI loading |
| PLL-04 | Unit tests | 📋 Backlog | Vitest |
| PLL-05 | E2E tests | 📋 Backlog | Playwright |
| PLL-06 | Documentation | 📋 Backlog | |

### Definition of Done
- [ ] Works on mobile
- [ ] Error handling complete
- [ ] Loading states everywhere
- [ ] Tests pass
- [ ] Documentation updated

---

## Sprint Summary

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

## Velocity Tracking

| Sprint | Planned | Completed | Velocity |
|---|---|---|---|
| Sprint 0 | 8 | 8 | 100% |
| Sprint 1 | 8 | — | — |
| Sprint 2 | 10 | — | — |
| Sprint 3 | 9 | — | — |
| Sprint 4 | 6 | — | — |
| Sprint 5 | 6 | — | — |
| Sprint 6 | 6 | — | — |

---

## Retrospective

### Sprint 0
- **What went well:** LINE Bot features completed quickly
- **What to improve:** Rich Menu alias issue took too long to debug
- **Action items:** Use Script Properties instead of alias

### Sprint 1
- **What went well:** TBD
- **What to improve:** TBD
- **Action items:** TBD
