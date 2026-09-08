# TARGET_SYSTEM_ARCHITECTURE

Status: PROPOSED  
Date: 2026-09-08

## 1. Architectural Goal

ระบบ MTP6LineCoopBot ต้องเป็น **modular monolith ที่ Engine-first, Ports-and-Adapters, plug-compatible และ full-automated-test friendly**

เป้าหมายคือให้ capability เดียวกันถูกเรียกได้จาก LINE, LIFF, Web Admin, CLI/Test Harness โดยไม่ duplicate business logic

## 2. Canonical Layers

```
┌─────────────────────────────────────────────┐
│ Delivery Adapters                           │
│ LINE Webhook | LIFF | Web Admin | CLI/Test │
└───────────────────┬─────────────────────────┘
                    │ DTO / Command / Query
                    ▼
┌─────────────────────────────────────────────┐
│ Application Layer                           │
│ Use Cases / Orchestration / Transaction     │
│ ActivateMember | RenewMember | GetProfile   │
│ AuthorizeAction | GetFinance | Broadcast    │
└───────────────────┬─────────────────────────┘
                    │ Domain objects/results
                    ▼
┌─────────────────────────────────────────────┐
│ Domain / Engines                            │
│ MemberAccess | RenewalPolicy | LoanCalc     │
│ NoticeRules | ReminderRules | RolePolicy    │
└───────────────────┬─────────────────────────┘
                    │ Ports
                    ▼
┌─────────────────────────────────────────────┐
│ Ports / Contracts                           │
│ MemberRepository | Identity | Messaging     │
│ Clock | Audit | Config | Transaction        │
└──────────────┬──────────────┬───────────────┘
               │              │
               ▼              ▼
┌─────────────────────┐  ┌────────────────────┐
│ Production Adapters │  │ Test Adapters      │
│ Sheets / LINE / GAS │  │ InMemory / Fake    │
└─────────────────────┘  └────────────────────┘
```

## 3. Identity Model

ห้ามใช้ `lineUserId`, username หรือ client-provided ID เป็น "identity proof" โดยตรง

ระบบใช้ canonical `Principal`:

```js
{
  subject: "stable-authenticated-subject",
  channel: "line" | "web" | "system" | "test",
  roles: ["member"],
  memberCode: "optional-linked-member",
  claims: {},
  authenticated: true
}
```

Delivery Adapter มีหน้าที่:
1. รับ credential/token/request
2. เรียก IdentityPort
3. ได้ verified Principal
4. ส่ง Principal เข้า Application Use Case

Application/Domain ห้าม verify LINE token หรือ parse browser session เอง

## 4. Authorization Model

Authorization แยกจาก Authentication

```
Credential → Identity Adapter → Principal
                              ↓
                     Authorization Engine
                              ↓
                         allow / deny
```

Authorization engine ต้อง deterministic และ testable ด้วย fake Principal

## 5. Application Use Cases

Use case เป็นจุด orchestration ของ capability เช่น:

- GetMemberProfile
- GetMemberFinance
- ActivateMember
- RenewMember
- CheckMemberAccess
- PublishNotice
- RunLoanReminder
- ScanExpiry

Use case:
- รับ command/query + Principal
- ใช้ domain engines
- ใช้ ports
- คืน typed result
- ไม่สร้าง Flex/HTML
- ไม่รู้จัก Google Sheets/LINE API

## 6. Domain Engines

Domain engines เป็น pure หรือ near-pure:
- MemberAccessEngine
- RenewalPolicyEngine
- LoanCalculationEngine
- NoticePolicyEngine
- ReminderPolicyEngine

Domain engine ห้าม:
- import delivery/UI
- call repository/network
- log production side effects
- read global Config ถ้า inject ได้

## 7. Ports

Minimum target ports:

- MemberRepositoryPort
- IdentityPort
- MessagingPort
- ClockPort
- AuditPort
- ConfigPort

Port ต้อง:
- มี contract ชัด
- stable error semantics
- shared contract test
- ไม่มี UI-specific data

## 8. Adapters

### Delivery
- AppsScriptApiAdapter
- LineWebhookAdapter
- LiffAdapter
- WebAdminAdapter
- CliTestAdapter

### Infrastructure
- SheetsMemberRepository
- LineMessagingAdapter
- LineIdentityAdapter
- WebSessionIdentityAdapter
- AppsScriptConfigAdapter
- AuditLogAdapter

### Test
- InMemoryMemberRepository
- FakeIdentityAdapter
- FakeMessagingAdapter
- FakeClock
- InMemoryAuditAdapter

## 9. Composition

มี composition root ต่อ environment:

- createProductionSystem()
- createStagingSystem()
- createTestSystem()

ห้ามให้ engine/handler เลือก concrete adapter เอง

## 10. Public Contracts

Cross-module calls ต้องผ่าน:
- command/query DTO
- engine public function
- port interface
- typed result/envelope

ห้ามเรียก internal helper ข้าม module โดยตรง

## 11. Error Model

ใช้ stable machine-readable code:

```js
{
  code: "UNAUTHENTICATED" | "FORBIDDEN" | "MEMBER_NOT_FOUND" | "...",
  message: "...",
  retryable: false,
  detail: {}
}
```

Delivery adapter แปลง error เป็น LINE/Web/API presentation ของตนเอง

## 12. Test Architecture

```
T1 Domain Engine
T2 Application Use Case
T3 Port Contract
T4 Adapter Integration
T5 Delivery Contract
T6 E2E
```

Default test system ต้องไม่ใช้ network/Google Sheets/LINE

## 13. Migration Rule

ใช้ Strangler Pattern:
- preserve public behavior
- characterization test ก่อน
- extract engine/use-case
- define port
- wire adapter
- switch caller
- remove legacy duplication หลัง evidence ครบ

ไม่ rewrite ระบบทั้งก้อนในครั้งเดียว
