# ENGINE_AUDIT_BASELINE

Baseline date: 2026-09-08  
Source audited: `idev006/MTLineCoopBot@main`  
Status: INITIAL ENGINE/PLUG-IN AUDIT

## 1. Summary

Backend มีองค์ประกอบที่สนับสนุน Engine-first/Plug-in แล้วบางส่วน แต่ยังเป็น transitional architecture

### Strengths already present

- `app/Core/*` แยก business rules หลายส่วนออกจาก UI
- `Data.MemberRepository` มี explicit repository contract
- `Data.SheetsMemberRepository` เป็น concrete adapter
- `scripts/ci-test.js` จำลอง Apps Script runtime ใน Node
- CI มี syntax checks, contract tests และ secret scanning
- Activation/Renewal บางส่วนมี DI seam เช่น `opts.api`, `internal.now`
- API layer มี registry + envelope + handlers
- LINE Bot หลาย flow เรียก API เดียวกับ UI อื่น แทนการ duplicate persistence logic

### Main architecture gaps

- repository resolution ยังเป็น global factory ผ่าน `Data.MemberRepository.getRepository()`
- API handlers ยังสร้าง dependencies ภายในตัวเอง
- `Config.get()` และ `new Date()` ยังเป็น hidden dependencies ในหลาย flow
- LINE service/handler บางจุดผสม orchestration + presentation + infrastructure side effects
- authorization/member gate ยังพึ่ง repository behavior เช่น `repo.isActiveMember()` ซึ่งควรย้าย policy เข้า engine/core
- composition root ยังไม่ชัดเจนเป็นจุดเดียว
- shared contract tests สำหรับ plug-compatible adapters ยังไม่เป็น first-class suite
- frontend/UI ยังมี duplicated business formula และ mock fallback ตาม baseline findings

## 2. Current Component Classification

| Current module | Proposed role | Audit result |
|---|---|---|
| Core/MemberRules.js | Domain Engine | GOOD BASE; inspect hidden config/time inputs |
| Core/LoanCalculator.js | Domain Engine | GOOD BASE; must become sole formula authority |
| Core/LoanRules.js | Domain Engine | GOOD BASE |
| Core/NoticeRules.js | Domain Engine | GOOD BASE |
| Core/DateConverter.js | Domain Utility/Engine | GOOD BASE |
| Data/MemberRepository.js | Port + Factory mixed | PARTIAL; split contract from composition/factory |
| Data/SheetsMemberRepository.js | Infrastructure Adapter | GOOD BASE; contract tests needed |
| Api/ApiHandlers.js | Application/Delivery mixed | PARTIAL; inject application engines/dependencies |
| Api/ApiRegistry.js | Delivery Router | ACCEPTABLE |
| Api/ApiService.js | Application facade seam | PARTIAL; can evolve into composition-facing API |
| LineBot/ActivationService.js | LINE adapter + orchestration | PARTIAL; `performActivate` is useful seam |
| LineBot/RenewalService.js | LINE adapter + orchestration | PARTIAL |
| LineBot/ExpiryService.js | Scheduled adapter + orchestration | AUDIT/EXTRACT |
| LineBot/NoticeService.js | Scheduled adapter + orchestration | AUDIT/EXTRACT |
| LineBot/LoanReminderService.js | Scheduled adapter + orchestration | AUDIT/EXTRACT |
| LineBot/EventHandler.js | LINE delivery adapter | TOO MUCH POLICY/WIRING; shrink over time |
| LineBot/SheetService.js | Legacy infrastructure/data service | WRAP/STRANGLE behind adapters |
| WebApp.js | Apps Script delivery/composition boundary | candidate composition root; currently mixes auth/API/webhook |
| scripts/ci-test.js | Headless Test Harness | STRONG BASE; modularize and extend |

## 3. Concrete Findings

### ENG-001 — Repository Port and Factory are coupled
Severity: MEDIUM

`Data.MemberRepository` ทั้งประกาศ interface และเลือก concrete implementation จาก `Config.DB_TYPE`

Target:
- Port contract แยกจาก factory
- composition root เลือก adapter
- engine/application receive repository explicitly

### ENG-002 — ApiHandlers resolve dependencies internally
Severity: MEDIUM

`getRepo() → Data.MemberRepository.getRepository()` ทำให้ handler tests ต้องพึ่ง global namespace/config

Target:
- Application engines/use cases receive ports
- API adapter maps request → engine call → response

### ENG-003 — Identity source is not yet a trusted port
Severity: HIGH / SECURITY

`requireMember(ctx)` accepts `lineUserId` from query/body/auth; current Web mount only establishes API key.

Target:
- verified IdentityPort
- engine receives authenticated principal
- query/body IDs may be lookup parameters but never authentication proof

### ENG-004 — Time/config hidden dependencies
Severity: MEDIUM

พบ pattern `new Date()` / `Config.get()` in orchestration paths แม้บาง flow มี `internal.now` seam แล้ว

Target:
- ClockPort
- explicit policy/config input
- deterministic tests

### ENG-005 — UI/adapter orchestration still broad
Severity: MEDIUM

EventHandler and LINE services still perform authorization checks, data lookup, Flex construction, messaging and side-effect handling in same flows.

Target:
- thin delivery adapter
- application engine returns result/state
- presenter maps result to LINE/Web/LIFF representation

### ENG-006 — Repository contains policy methods
Severity: MEDIUM

`isActiveMember` และ `hasRole` อยู่ใน repository contract แม้ comment ระบุว่าจะย้ายไป Core

Target:
- repository = persistence/query
- validity/role policy = engine/core

### ENG-007 — Test harness is useful but monolithic
Severity: LOW/MEDIUM

`scripts/ci-test.js` มี fake Apps Script runtime และ in-memory Sheets ซึ่งเป็นฐานที่ดี แต่ test runner โหลดระบบจำนวนมากใน VM เดียว

Target:
- engine unit suite
- reusable port contract suite
- wiring/integration suite
- external adapter suite แยกกัน

### ENG-008 — No explicit composition root contract
Severity: MEDIUM

มี factory/global namespace หลายจุด แต่ยังไม่มี canonical `createSystem(dependencies)` หรือ equivalent

Target:
- production composition root
- test composition root
- environment-specific adapter selection

## 4. Target Module Shape

```
app/
  Engine/
    Member/
      MemberValidityEngine.js
      ActivationEngine.js
      RenewalEngine.js
    Finance/
      LoanCalculationEngine.js
    Notice/
      NoticeEngine.js
      ReminderEngine.js

  Ports/
    MemberRepositoryPort.js
    IdentityPort.js
    MessagingPort.js
    ClockPort.js
    AuditPort.js
    ConfigPort.js

  Adapters/
    Sheets/
    Line/
    AppsScript/
    Test/

  Application/
    MemberApplication.js
    NoticeApplication.js

  Composition/
    createProductionSystem.js
    createTestSystem.js
```

หมายเหตุ: นี่คือ target shape เชิง logical; การ rename/move file จริงต้องทำ incremental และไม่จำเป็นต้องย้ายทั้งหมดทันที

## 5. Migration Sequence

### M0-A — Characterization
- lock current behavior with tests
- map current API/menu/data contracts
- do not change runtime behavior

### M0-B — Composition seam
- introduce dependency bundle/system factory
- keep existing globals as compatibility adapters

### M1-A — Repository port extraction
- persistence-only port
- move validity/role rules to Core/Engine
- shared repository contract tests

### M1-B — Identity/Security port
- verified principal contract
- fail-closed authorization engine
- remove identity trust from client-supplied IDs

### M1-C — Member engines
- ActivationEngine
- RenewalEngine
- Validity/Authorization engines

### M2 — Scheduled engines
- Expiry
- Notice
- Loan Reminder

### M3 — Thin delivery adapters
- LINE EventHandler
- Apps Script API
- LIFF
- Web

## 6. Migration Safety Rule

ทุก extraction ต้อง:
1. เพิ่ม characterization/regression test ก่อน
2. เปลี่ยนทีละ capability
3. preserve public API/data behavior unless approved ADR says otherwise
4. keep old adapter compatibility until new wiring passes
5. update Traceability Matrix
6. commit/push at each coherent checkpoint
