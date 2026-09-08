# TRACEABILITY_MATRIX

สถานะ: M0 INITIAL AUDIT

> Requirement → Design/ADR → Engine/Port/Adapter → Source → Test → Evidence

| Req ID | Requirement | Design/ADR | Code Evidence | Test Evidence | Current Status |
|---|---|---|---|---|---|
| REQ-SEC-001 | Authentication ต้อง fail-closed | ARCHITECTURE_CONTRACT | Web auth mock fallback removed @ e1a54aa | headless session tests + security scan + production build; Webapp CI #3 PASS | VERIFIED FOR WEB CLIENT FAILURE PATHS; SERVER SESSION AUTHORITY PENDING |
| REQ-SEC-002 | LIFF identity ต้อง verify server-side | API_DATA_CONTRACT | backend currently accepts request lineUserId | TBD | BLOCKED / HIGH |
| REQ-SEC-003 | Authorization ต้อง server-side | ARCHITECTURE_CONTRACT | member gate exists, trusted principal boundary incomplete | Test.js partial | PARTIAL |
| REQ-DATA-001 | Data schema มี SSOT | API_DATA_CONTRACT | MTLineCoopBot/app/DataDict.js | data/repository tests declared | CODE_PRESENT / TEST_IMPLEMENTED |
| REQ-CORE-001 | Business rule ไม่ duplicate ข้าม UI | ADR-0002 | Core/LoanCalculator.js + UI calculator duplicate | backend loan tests declared | BLOCKED |
| REQ-ARCH-001 | Business capability ต้องอยู่ใน headless engine | ADR-0002 | Engine.MemberAccessEngine @ de7fc1f + app/Core/* | headless engine test + CI run #43 PASS | PARTIAL / MEMBER ACCESS ENGINE VERIFIED |
| REQ-ARCH-002 | Infrastructure เปลี่ยนผ่าน ports/adapters | ADR-0002 | MTLineCoopBot Ports.MemberRepositoryPort + Sheets adapter @ f06dfb5 | reusable contract test + CI run #41 PASS | PARTIAL / VERIFIED FIRST PORT |
| REQ-ARCH-003 | UI ไม่เป็นเจ้าของ business rule | ADR-0002 | API validity + LINE gate/expiry checks routed through MemberAccessEngine @ 9a589db | full regression + architecture/engine tests; CI #46 PASS | PARTIAL / PRIMARY MEMBER ACCESS PATHS VERIFIED |
| REQ-ARCH-004 | Dependency wiring explicit/testable | ENGINE_ARCHITECTURE_STANDARD | Composition.SystemFactory + ClockPort @ de7fc1f; legacy globals remain | architecture + engine tests; CI #43 PASS | PARTIAL / CLOCK WIRING VERIFIED |
| REQ-ARCH-005 | Composition root แยก production/test wiring | ADR-0002 | Composition.SystemFactory @ f06dfb5 | system-factory architecture test + CI run #41 PASS | PARTIAL / CODE_PRESENT |
| REQ-ARCH-006 | Repository port ต้อง persistence-only | ADR-0002 | primary API/LINE member-access consumers no longer depend on repo policy @ 9a589db | regression + engine tests; CI #46 PASS | PARTIAL / POLICY EXTRACTION IN PROGRESS |
| REQ-TEST-001 | Critical backend rules automated | TEST_STRATEGY | Test.js + ci-test.js | 34 tests declared | TEST_IMPLEMENTED; RUN_EVIDENCE_MISSING |
| REQ-TEST-002 | Web critical behavior automated | TEST_STRATEGY | webapp sessionPolicy tests + security scan + build CI @ e1a54aa | Webapp CI #3 PASS | PARTIAL / AUTH+BUILD GATE VERIFIED |
| REQ-TEST-003 | Engine tests ไม่พึ่ง UI/network/production | TEST_STRATEGY | MemberAccessEngine + ClockPort @ de7fc1f | deterministic headless test; CI #43 PASS | VERIFIED FOR MEMBER ACCESS ENGINE |
| REQ-TEST-004 | Adapter ใหม่ผ่าน reusable contract tests | TEST_STRATEGY | tests/contracts/member-repository.contract.test.js @ f06dfb5 | CI run #41 PASS | PARTIAL / REUSABLE REPOSITORY CONTRACT VERIFIED |
| REQ-DOC-001 | SSOT change ผ่าน team review | ADR-0001 | docs/ssot + review record | PR #1 | ACCEPTED ON BRANCH |
| REQ-SEC-004 | Protected use case ต้องรับ verified Principal | ADR-0003 / TARGET_SYSTEM_ARCHITECTURE | GetCurrentMemberProfileUseCase accepts Principal @ 060fe63 | application headless tests + full CI #51 PASS | PARTIAL / FIRST PROTECTED USE CASE VERIFIED |
| REQ-SEC-005 | Authentication แยกจาก Authorization | ADR-0003 | IdentityPort + AuthorizationEngine @ a2253eb | identity/authz engine tests; CI #48 PASS | VERIFIED FOUNDATION |
| REQ-ARCH-007 | Delivery → Application → Domain → Ports → Adapters | ADR-0003 | member profile Application boundary + member-code repository port @ 060fe63 | application/architecture/contract CI #51 PASS | PARTIAL / DELIVERY SWITCH PENDING |
| REQ-ARCH-008 | Application use cases ต้อง headless | ADR-0003 | GetCurrentMemberProfileUseCase @ 060fe63 | tests/application/current-member-profile.test.js; CI #51 PASS | PARTIAL / FIRST USE CASE VERIFIED |
| REQ-ARCH-009 | Production/Test composition roots ใช้ contracts เดียวกัน | ADR-0003 | SystemFactory wires IdentityPort/Authz; DenyAll + Fake adapters @ a2253eb | architecture + security tests; CI #48 PASS | PARTIAL / SECURITY PLUG-IN VERIFIED |
| REQ-REL-001 | Release ผ่าน gates ก่อน production | RELEASE_GATES | documented | release evidence TBD | DOCUMENTED |

## Evidence Rule

- CODE_PRESENT ≠ TESTED
- TEST_IMPLEMENTED ≠ CI_VERIFIED
- CI_VERIFIED ≠ PRODUCTION_VERIFIED
- สถานะจะเพิ่มระดับได้เมื่อมี evidence ที่ตรวจย้อนกลับได้

## Update Rule

ทุก feature/change ใหม่ต้องเพิ่มหรืออัปเดตแถวนี้ก่อนปิดงาน
