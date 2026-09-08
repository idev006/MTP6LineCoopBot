# TEST_STRATEGY

สถานะ: PROPOSED

## Testing Objective

ระบบต้องออกแบบให้ **Full Automated Test ทำได้ง่าย รวดเร็ว มีประสิทธิภาพ และไม่ต้องพึ่ง UI/production dependency**

เป้าหมายสำคัญ:
- business engines ทดสอบแบบ headless
- test deterministic
- test isolation สูง
- failures pinpoint ได้
- infrastructure replace ด้วย fake/in-memory adapter
- UI tests มีเฉพาะสิ่งที่ UI รับผิดชอบจริง
- critical flow ทดสอบ end-to-end ได้โดยไม่ลดคุณภาพ unit/contract tests

## Testability as Architecture

ถ้า module ทดสอบอัตโนมัติได้ยาก ให้ถือเป็น **architecture defect** ไม่ใช่เพียง test problem

ทุก engine ควรรับ dependencies ผ่าน constructor/factory/function parameters หรือ composition mechanism ที่ชัดเจน

Dependency ที่ควร replace ได้:
- repository
- clock/time
- identity/auth provider
- messaging
- external API
- config
- audit/log sink
- random/id generator เมื่อมีผลต่อ determinism

## Test Layers

### T0 Static / Policy
- syntax
- secret scan
- forbidden imports/dependencies
- architecture boundary checks
- doc/contract checks

### T1 Engine Unit Tests
Pure/headless:
- member validity
- renewal
- expiry
- date conversion
- loan calculation
- notice/reminder rules
- authorization policies
- state transitions

เป้าหมาย: ไม่ใช้ UI, network, Google Sheets, LINE API

### T2 Port / Contract Tests
พิสูจน์ว่า adapters ทำตาม contract:
- repository contract
- identity provider contract
- messaging contract
- API route ↔ handler
- response envelope
- Menu ID ↔ handler
- DataDict ↔ headers
- Role ↔ permission
- Frontend schema ↔ API contract

adapter implementation ใหม่ต้องผ่าน contract test suite เดิม

### T3 Engine Integration Tests
wire หลาย engine ด้วย fake/in-memory ports:
- activation
- renewal
- profile/finance
- expiry/reminder/notice
- auth/session/role orchestration

### T4 Infrastructure Adapter Tests
เฉพาะ boundary จริง:
- Sheets adapter
- LINE adapter
- Apps Script WebApp adapter
- LIFF/backend identity integration

ต้องแยกจาก engine tests เพื่อไม่ให้ช้า/เปราะ

### T5 Frontend/UI Tests
- rendering/state binding
- API client
- stores
- router guards
- fail-closed behavior
- loading/error/empty states

ห้ามทดสอบ business formula ซ้ำใน UI ถ้า engine มี test แล้ว

### T6 End-to-End
Critical workflows:
- login success/failure
- unauthorized access
- member search/detail
- activate/renew
- logout/session expiry
- backend unavailable

### T7 Staging/UAT
Real integrations with non-production data

### T8 Production Verification
Safe smoke checks after release

## Test Harness Rule

ควรสามารถสร้างระบบทดสอบเช่น:

```
createTestSystem({
  memberRepository: new InMemoryMemberRepository(),
  clock: new FakeClock(...),
  identity: new FakeIdentity(...),
  messaging: new FakeMessaging(),
  audit: new InMemoryAudit()
})
```

แล้วเรียก use case/engine โดยตรงโดยไม่เปิด browser หรือ LINE

## Mandatory Negative Tests

- API unavailable
- invalid/expired token
- wrong role
- malformed input
- member not found
- expired member
- duplicate activation
- duplicate/unsafe write retry
- financial data unavailable
- LIFF identity mismatch
- adapter failure
- timeout/retry behavior
- engine invoked with invalid dependency result

## Efficiency Targets

- pure unit/engine suite ต้องเร็วพอสำหรับทุก commit
- contract tests ต้อง reusable ข้าม adapter implementations
- integration tests ใช้ in-memory/fake เป็น default
- real external integration tests แยก suite/tag
- flaky test ถือเป็น defect และต้องแก้
- test data ต้องสร้าง/ล้างอัตโนมัติ
- manual test ใช้เฉพาะกรณีที่ automate ไม่คุ้ม/เป็น UAT

## Test Evidence

แต่ละ requirement ต้องมี:
- Test ID
- automated/manual
- layer
- location
- last verified commit
- result/evidence

ไม่มี Evidence = ยังไม่ถือว่า VERIFIED
