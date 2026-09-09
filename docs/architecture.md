# System Architecture

> **SSOT สำหรับสถาปัตยกรรมระบบ**  
> อัปเดตล่าสุด: 2026-08-20

---

## 1. ภาพรวม

```
┌─────────────────────────────────────────────────────────────────┐
│                        MTP6LineCoopBot                          │
│                  สหกรณ์ออมทรัพย์ ตำรวจภูธรภาค 6                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐              ┌─────────────────┐          │
│  │   LINE Bot      │              │   LIFF Web App  │          │
│  │   (Members)     │              │   (Staff/Admin) │          │
│  └────────┬────────┘              └────────┬────────┘          │
│           │                                │                    │
│           │ LINE Messaging API             │ HTTPS              │
│           │                                │                    │
│           ▼                                ▼                    │
│  ┌─────────────────────────────────────────────────┐          │
│  │              Google Apps Script                  │          │
│  │            (Backend API Layer)                   │          │
│  └─────────────────────┬───────────────────────────┘          │
│                        │                                        │
│                        │ Google Sheets API                      │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────┐          │
│  │              Google Sheets                       │          │
│  │            (Database)                            │          │
│  └─────────────────────────────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Components

### 2.1 LINE Bot (Members)

**แพลตฟอร์ม:** Google Apps Script + LINE Messaging API

**หน้าที่:**
- Rich Menu 5 tabs + Welcome Menu
- Flex Message ตอบกลับเมนู
- Activate สมาชิก (`activate:CODE`)
- ต่ออายุสมาชิก (`renew`)
- Gate ตรวจสิทธิ์ (Per-User Gating)

**ไฟล์หลัก:**
- `app/LineBot/EventHandler.js` — Webhook handler
- `app/LineBot/ActivationService.js` — Activate flow
- `app/LineBot/RenewalService.js` — Renew flow
- `app/LineBot/FlexBuilder.js` — Flex Message builder
- `app/LineBot/MessageService.js` — LINE API wrapper
- `app/RichMenu/` — Rich Menu management

---

### 2.2 LIFF Web App (Staff/Admin)

**แพลตฟอร์ม:** Vue 3 + Vite + TailwindCSS + DaisyUI

**หน้าที่:**
- Login (username/password + LIFF)
- จัดการสมาชิก (ดู/แก้ไข/activate/renew)
- จัดการผู้ใช้ (staff/admin)
- จัดการ roles
- รายงาน
- ตั้งค่าระบบ

**เทคโนโลยี:**
- Vue 3 (Composition API)
- Vue Router 4
- Pinia (State Management)
- TailwindCSS 4
- DaisyUI 5 (Component Library)
- API Adapters (AppsScript/REST)

**โครงสร้างไฟล์:**
```
MTP6LineCoopBot/webapp/
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/
│   ├── stores/
│   ├── composables/
│   ├── services/
│   │   └── api/
│   │       ├── client.js
│   │       └── adapters/
│   ├── layouts/
│   ├── components/
│   └── views/
```

---

### 2.3 Backend API (Google Apps Script)

**แพลตฟอร์ม:** Google Apps Script (Runtime V8)

**หน้าที่:**
- REST API endpoints
- Database operations (Google Sheets)
- Authentication
- Business logic

**ไฟล์หลัก:**
- `app/WebApp.js` — Entry point (doGet/doPost)
- `app/Api/ApiService.js` — API dispatcher
- `app/Api/ApiRegistry.js` — Route table
- `app/Api/ApiHandlers.js` — Handler implementations
- `app/Api/ApiResponse.js` — Response envelope
- `app/Api/ApiError.js` — Error handling

**API Endpoints:**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | Public | ตรวจสอบสถานะ |
| GET | `/api/member/profile` | Member | ข้อมูลสมาชิก |
| GET | `/api/member/savings` | Member | บัญชีเงินฝาก |
| GET | `/api/member/loans` | Member | ยอดหนี้ |
| GET | `/api/member/dividends` | Member | เงินปันผล |
| GET | `/api/member/validity` | Member | สถานะสิทธิ์ |
| POST | `/api/member/activate` | Public | Activate สมาชิก |
| POST | `/api/member/renew` | Member | ต่ออายุสมาชิก |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/liff` | Public | LIFF Login |
| GET | `/api/user/member-list` | Staff/Admin | รายชื่อสมาชิก |
| GET | `/api/user/member-detail/:code` | Staff/Admin | รายละเอียดสมาชิก |
| POST | `/api/admin/member-activate` | Admin | กำหนด activate |
| POST | `/api/admin/member-renew` | Admin | ต่ออายุ |
| POST | `/api/admin/user-create` | Admin | สร้างผู้ใช้ |
| POST | `/api/admin/user-update` | Admin | แก้ไขผู้ใช้ |
| POST | `/api/admin/role-grant` | Admin | จัดการ roles |

---

### 2.4 Database (Google Sheets)

**ตารางทั้งหมด:**

| ตาราง | หน้าที่ | ผู้ใช้ |
|---|---|---|
| `t_member_mast` | ข้อมูลสมาชิกสหกรณ์ | LINE Bot |
| `t_savings_acct` | บัญชีเงินฝาก | LINE Bot |
| `t_loan_acct` | สัญญาเงินกู้ | LINE Bot |
| `t_dividend` | เงินปันผล | LINE Bot |
| `t_activation_log` | ประวัติ activate | System |
| `t_expiry_log` | ประวัติหมดอายุ | System |
| `t_notice` | ประกาศ | Staff/Admin |
| `t_reminder_log` | ประวัติเตือนชำระ | System |
| `t_content` | เนื้อหาเมนูข้อมูล | Staff/Admin |
| `t_user` | ผู้ใช้ Web App | Staff/Admin |
| `t_role` | Role definitions | Admin |

---

## 3. Data Flow

### 3.1 Member Activate Flow

```
Member พิมพ์ activate:ACT001
    ↓
LINE → Webhook → doPost
    ↓
EventHandler.handleTextMessage
    ↓
ActivationService.handleActivate
    ↓
POST /api/member/activate
    ↓
ApiHandlers.activate
    ↓
Repository.activateMember → Google Sheets
    ↓
FlexBuilder.welcomeMember → Flex Message
    ↓
MessageService.replyFlex → LINE
    ↓
Gating.linkMemberMenu → Rich Menu Tab 1
```

### 3.2 Staff Login Flow

```
Staff เปิด LIFF → LoginView
    ↓
กรอก username/password
    ↓
POST /api/auth/login
    ↓
ApiHandlers.login → Repository.findByUsername
    ↓
Password verify → Return token + user data
    ↓
Pinia auth store → Store user + token
    ↓
Vue Router → DashboardView
```

### 3.3 Member List Flow

```
Staff คลิก "รายชื่อสมาชิก"
    ↓
GET /api/user/member-list
    ↓
ApiHandlers.getMemberList → Repository.listMembers
    ↓
Return member data
    ↓
Pinia member store → Store members
    ↓
MemberListView → DaisyUI table
```

---

## 4. Security

### 4.1 Authentication Layers

| Layer | Mechanism | Scope |
|---|---|---|
| Network | HTTPS (Apps Script强制) | All |
| Webhook | `webhook_secret` in URL | LINE Bot |
| API | `API_KEY` in query/body | LIFF Web App |
| Application | Username/password + token | Staff/Admin |
| LINE | `line_user_id` | Members |

### 4.2 Authorization

| Role | Access | Description |
|---|---|---|
| Member | LINE Bot only | ดูข้อมูลตัวเอง |
| Staff | Web App | ดู/แก้ไขข้อมูลสมาชิก |
| Admin | Web App | จัดการทุกอย่าง |

### 4.3 Password Security

- Password hashing: bcrypt/argon2 (ยังไม่ implement)
- Password storage: `password_hash` column in `t_user`
- Password policy: ยังไม่ implement

---

## 5. API Adapters

### 5.1 Architecture

```
Vue Component → useApi() → API Client → Adapter → Backend
```

### 5.2 Supported Adapters

| Adapter | Status | Description |
|---|---|---|
| AppsScriptAdapter | ✅ Implemented | Google Apps Script |
| RestAdapter | 📋 Planned | REST API (future) |
| GraphQLAdapter | 📋 Planned | GraphQL (future) |

### 5.3 Switching Adapters

```bash
# .env
VITE_API_ADAPTER=appsscript  # or 'rest' or 'graphql'
VITE_API_BASE_URL=https://script.google.com/macros/s/xxx/exec
VITE_API_KEY=your_api_key
```

---

## 6. Deployment

### 6.1 LINE Bot (Apps Script)

```
Developer → Git → clasp push → Apps Script → Deploy → LINE
```

### 6.2 LIFF Web App

```
Developer → Git → GitHub Actions → Build → GitHub Pages
```

### 6.3 Environment

| Environment | URL | Purpose |
|---|---|---|
| Production | https://idev006.github.io/MTP6LineCoopBot/ | Live app |
| Staging | TBD | Testing |
| Development | localhost:5173 | Local dev |

---

## 7. Future Enhancements

### 7.1 Planned

- [ ] LIFF app for members (profile, savings, loans)
- [ ] Admin dashboard (member management)
- [ ] Role-based access control
- [ ] Audit trail
- [ ] Rate limiting
- [ ] Session management

### 7.2 Potential

- [ ] Firebase/Firestore (replace Google Sheets)
- [ ] Express.js backend (replace Apps Script)
- [ ] React Native mobile app
- [ ] LINE Pay integration
- [ ] Core Banking integration

---

## 8. References

- [README.md](./README.md) — Project overview
- [data-dictionary.md](./data-dictionary.md) — Data dictionary
- [KANBAN.md](./KANBAN.md) — Kanban board
- [SPRINT.md](./SPRINT.md) — Sprint planning
- [INFRA.md](./INFRA.md) — Infrastructure checklist
