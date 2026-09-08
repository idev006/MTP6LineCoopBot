# TRACEABILITY_MATRIX

สถานะ: M0 INITIAL AUDIT

> Requirement → Design/ADR → Engine/Port/Adapter → Source → Test → Evidence

| Req ID | Requirement | Design/ADR | Code Evidence | Test Evidence | Current Status |
|---|---|---|---|---|---|
| REQ-SEC-001 | Authentication ต้อง fail-closed | ARCHITECTURE_CONTRACT | Web auth mock fallback removed @ e1a54aa | headless session tests + security scan + production build; Webapp CI #3 PASS | VERIFIED FOR WEB CLIENT FAILURE PATHS; SERVER SESSION AUTHORITY PENDING |
| REQ-SEC-002 | LIFF identity ต้อง verify server-side | API_DATA_CONTRACT | backend verified identity @ 865569b + LIFF raw ID-token migration @ d3deac7 | backend CI #53 + LIFF CI #5 PASS | VERIFIED FOR MEMBER SELF-SERVICE PATHS |
| REQ-SEC-003 | Authorization ต้อง server-side | ARCHITECTURE_CONTRACT | member gate exists, trusted principal boundary incomplete | Test.js partial | PARTIAL |
| REQ-DATA-001 | Data schema มี SSOT | API_DATA_CONTRACT | MTLineCoopBot/app/DataDict.js | data/repository tests declared | CODE_PRESENT / TEST_IMPLEMENTED |
| REQ-CORE-001 | Business rule ไม่ duplicate ข้าม UI | ADR-0002 | Core.LoanCalculator + CalculateLoanUseCase + /api/loan/calculate @ 45582b4; frontend canonical UI @ 0de0c0e; backend duplicate retired @ daffda7 | backend CI #74 + frontend Loan Calculator CI #1 + backend CI #76 PASS | VERIFIED / SINGLE FORMULA AUTHORITY |
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
| REQ-SEC-004 | Protected use case ต้องรับ verified Principal | ADR-0003 / TARGET_SYSTEM_ARCHITECTURE | protected profile/finance APIs + LIFF raw ID-token client @ d3deac7 / backend protected endpoints | backend + LIFF protected delivery tests PASS | PARTIAL / MEMBER SELF-SERVICE VERIFIED |
| REQ-SEC-005 | Authentication แยกจาก Authorization | ADR-0003 | IdentityPort + AuthorizationEngine @ a2253eb | identity/authz engine tests; CI #48 PASS | VERIFIED FOUNDATION |
| REQ-ARCH-007 | Delivery → Application → Domain → Ports → Adapters | ADR-0003 | member profile Application boundary + member-code repository port @ 060fe63 | application/architecture/contract CI #51 PASS | PARTIAL / DELIVERY SWITCH PENDING |
| REQ-ARCH-008 | Application use cases ต้อง headless | ADR-0003 | GetCurrentMemberProfileUseCase @ 060fe63 | tests/application/current-member-profile.test.js; CI #51 PASS | PARTIAL / FIRST USE CASE VERIFIED |
| REQ-ARCH-009 | Production/Test composition roots ใช้ contracts เดียวกัน | ADR-0003 | SystemFactory wires HTTP/token verifier/LINE identity adapters @ 865569b | architecture + identity tests; CI #53 PASS | PARTIAL / VERIFIED LINE IDENTITY PLUG-IN |
| REQ-ANL-001 | Actors และ Use Cases ต้องมี canonical SSOT | analysis/ACTOR_CATALOG + ACTOR_USE_CASE_MATRIX + USE_CASE_CATALOG | docs/ssot/analysis | documentation review | DOCUMENTED / ACCEPTED |
| REQ-ANL-002 | Critical workflows ต้องมี system/business workflow | analysis/BUSINESS_WORKFLOWS + SYSTEM_WORKFLOWS | docs/ssot/analysis | documentation review | DOCUMENTED / ACCEPTED |
| REQ-ANL-003 | Critical interactions ต้องมี sequence diagram | analysis/sequences/* | docs/ssot/analysis/sequences | documentation review | DOCUMENTED / ACCEPTED |
| REQ-REL-001 | Release ผ่าน gates ก่อน production | RELEASE_GATES | documented | release evidence TBD | DOCUMENTED |

## Evidence Rule

- CODE_PRESENT ≠ TESTED
- TEST_IMPLEMENTED ≠ CI_VERIFIED
- CI_VERIFIED ≠ PRODUCTION_VERIFIED
- สถานะจะเพิ่มระดับได้เมื่อมี evidence ที่ตรวจย้อนกลับได้

## Update Rule

ทุก feature/change ใหม่ต้องเพิ่มหรืออัปเดตแถวนี้ก่อนปิดงาน


| REQ-TEST-005 | Test composition ต้องใช้ persistence adapter แบบ in-memory ได้ | ADR-0002 / TEST_SUITE_CATALOG | InMemoryMemberRepository @ 255d862 | backend CI #60 PASS | VERIFIED |


| REQ-UI-001 | Frontend must never trust client for identity/auth/business authority | ui/FRONTEND_ENGINEERING_STANDARD.md / ADR-0003 | LIFF verified Principal paths + fail-closed web auth | backend/LIFF/Web security CI evidence | PARTIAL / ENFORCED ON MIGRATED PATHS |
| REQ-UI-002 | Business logic must not live in UI | ui/FRONTEND_ENGINEERING_STANDARD.md / ADR-0002 | activation/profile/finance logic moved to backend engines/use cases | backend engine/application tests | PARTIAL / MIGRATING |
| REQ-UI-003 | daisyUI-first + Tailwind/Vue/Router/Pinia frontend standard | ui/FRONTEND_ENGINEERING_STANDARD.md | webapp stack | Webapp CI | ACCEPTED / ACTIVE |
| REQ-UI-004 | Chakra Petch is canonical UI font | ui/FRONTEND_ENGINEERING_STANDARD.md | Web App + LIFF @ d08c7ff | Webapp CI #5 + LIFF CI #7 PASS | VERIFIED |


| REQ-APP-ACT-001 | Membership activation business logic must be headless and outside UI/delivery | UC-MEM-001 / SEQ-MEMBER-ACTIVATE / ADR-0003 | MemberActivationEngine + ActivateMemberUseCase @ 91bd7cb | backend CI #63 PASS + legacy regression PASS | VERIFIED |


| REQ-APP-REN-001 | Self-renewal must use verified Principal and server-side business policy | UC-MEM-002 / SEQ-MEMBER-RENEW / ADR-0003 | RenewMemberUseCase + /api/member/me/renew @ 4dd0391 | backend CI #65 PASS | VERIFIED PRIMARY SELF-SERVICE PATH |


| REQ-ARCH-010 | Configuration dependencies must be behind ConfigPort | ADR-0002 / ENGINE_ARCHITECTURE_STANDARD | ConfigPort + AppsScriptConfigAdapter @ 58ee3d9 | port/architecture tests + CI #67 PASS | VERIFIED FOUNDATION |
| REQ-ARCH-011 | Application audit dependencies must be behind AuditPort | ADR-0002 / ENGINE_ARCHITECTURE_STANDARD | AuditPort + MemberRepositoryAuditAdapter + InMemoryAuditAdapter @ 58ee3d9 | port/application/architecture tests + CI #67 PASS | VERIFIED FOR ACTIVATION/RENEWAL |


| REQ-APP-SCHED-001 | Expiry/Notice/Reminder scheduled capabilities must execute through headless Application Layer | UC-SYS-001/002/003 + SEQ-EXPIRY-SCAN/SEQ-NOTICE-BROADCAST/SEQ-LOAN-REMINDER + ADR-0003 | MessagingPort + MemberMenuPort + ExpiryScanUseCase + NoticeBroadcastUseCase + LoanReminderUseCase @ b0194b5; production trigger delegation @ 5489622 | backend CI #70 foundation PASS + CI #72 runtime delegation PASS | VERIFIED PRIMARY SCHEDULED RUNTIME |


| REQ-FIN-001 | Loan calculation must use canonical Actual/365 engine with deterministic contract | UC-MEM-007 / ADR-0002 / API_DATA_CONTRACT | Core.LoanCalculator + CalculateLoanUseCase + POST /api/loan/calculate @ 45582b4 | property/boundary + application + delivery tests; CI #74 PASS | VERIFIED |
