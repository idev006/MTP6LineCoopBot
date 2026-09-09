# TRACEABILITY_MATRIX

สถานะ: M0 INITIAL AUDIT

> Requirement → Design/ADR → Engine/Port/Adapter → Source → Test → Evidence

| Req ID | Requirement | Design/ADR | Code Evidence | Test Evidence | Current Status |
|---|---|---|---|---|---|
| REQ-SEC-001 | Authentication ต้อง fail-closed | ARCHITECTURE_CONTRACT | Web auth fail-open removed @ e1a54aa; server Web session @ 1406a00f; Web client verified session @ 97dc634e | backend CI #81 + Webapp CI #8/#11 PASS | VERIFIED FOR WEB SESSION BOUNDARY |
| REQ-SEC-002 | LIFF identity ต้อง verify server-side | API_DATA_CONTRACT | verified identity @ 865569b + LIFF raw token migration @ d3deac7 + secure self-activation @ 3f052961/e174e625 | backend CI + LIFF CI + retirement CI #126 PASS | VERIFIED FOR MEMBER SELF-SERVICE + ACTIVATION |
| REQ-SEC-003 | Authorization ต้อง server-side | ARCHITECTURE_CONTRACT | AuthorizationEngine + Web member list/detail RBAC @ d78a1bc | backend CI #87 PASS; Webapp CI #11 client migration PASS | VERIFIED FOR WEB MEMBER READS; WRITES/ADMIN PENDING |
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
| REQ-SEC-004 | Protected use case ต้องรับ verified Principal | ADR-0003 / TARGET_SYSTEM_ARCHITECTURE | LINE member self-service + WebSessionIdentityAdapter + Web member use cases @ d78a1bc | backend CI #87 + LIFF/Web client CI PASS | VERIFIED FOR MEMBER SELF-SERVICE + WEB MEMBER READS |
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


| REQ-APP-SCHED-001 | Expiry/Notice/Reminder scheduled capabilities must execute through headless Application Layer | UC-SYS-001/002/003 + SEQ-EXPIRY-SCAN/SEQ-NOTICE-BROADCAST/SEQ-LOAN-REMINDER + ADR-0003 | MessagingPort + MemberMenuPort + ExpiryScanUseCase + NoticeBroadcastUseCase + LoanReminderUseCase @ b0194b5; production trigger delegation @ 5489622; legacy opts orchestration retired @ dc1a04e | backend CI #70 foundation PASS + CI #72 runtime delegation PASS + CI #148 retirement PASS | VERIFIED / SCHEDULED APPLICATION AUTHORITY ONLY |


| REQ-FIN-001 | Loan calculation must use canonical Actual/365 engine with deterministic contract | UC-MEM-007 / ADR-0002 / API_DATA_CONTRACT | Core.LoanCalculator + CalculateLoanUseCase + POST /api/loan/calculate @ 45582b4 | property/boundary + application + delivery tests; CI #74 PASS | VERIFIED |


| REQ-SEC-WEB-001 | Web session ต้อง server-authoritative พร้อม expiry/revocation | ADR-0003 / SEQ-WEB-STAFF-LOGIN | SessionStorePort + SessionTokenPort + WebSessionEngine + WebSessionIdentityAdapter @ 1406a00f; LINE exchange @ fe332fde; Web client verify/revoke @ 97dc634e | backend CI #81/#85 + Webapp CI #8 PASS | VERIFIED |
| REQ-SEC-WEB-002 | Web member reads ต้องใช้ server session + RBAC + data minimization | UC-STAFF-001/002 / ADR-0003 | ListMembersUseCase/GetMemberDetailUseCase + protected routes @ d78a1bc; client migration @ 07ca08e | backend CI #87 + Webapp CI #11 PASS | VERIFIED |


| REQ-SEC-WEB-003A | Admin settings read ต้องใช้ Web session + admin RBAC และห้ามเปิดเผย secrets | SEC-WEB-003 / ADR-0003 | GetAdminSettingsUseCase + POST /api/web/admin/settings @ 3ea0171; SettingsView session client @ 60b4d35 | backend CI #92 + Webapp CI #13 PASS | VERIFIED |


| REQ-SEC-WEB-003B | Audit Log read ต้องใช้ Web session + admin RBAC + data minimization | SEC-WEB-003 / ADR-0003 | AuditQueryPort + GetAuditLogUseCase + protected route @ 82cf8ee; AuditLogView migration @ 481b175 | backend CI #94 + Webapp CI #15 PASS | VERIFIED |


| REQ-SEC-WEB-003C | Summary reports ต้องใช้ Web session + staff/manager/admin RBAC และ aggregate ที่ backend | SEC-WEB-003 / ADR-0003 | ReportQueryPort + GetSummaryReportUseCase + protected route @ 820bd14; ReportView migration @ dbb1df2 | backend CI #96 + Webapp CI #17 PASS | VERIFIED |


| REQ-SEC-WEB-003D | Staff member renewal write ต้องใช้ Web session + staff/manager/admin RBAC + server calculation + audit | SEC-WEB-003 / ADR-0003 | RenewMemberByStaffUseCase + POST /api/web/members/renew @ 5fd6d28; MemberDetail client @ 3d6f04e | backend CI #98 + Webapp CI #19 PASS | VERIFIED |


| REQ-SEC-ROLE-001 | Canonical persisted member roles ต้องสอดคล้องกันทุก identity/member/Web path | ADR-0003 / API_DATA_CONTRACT | MemberAccessEngine + self-renew manager consistency @ a8beda3 | backend CI #100 PASS; manager known-role/profile/self-renew regression tests PASS | VERIFIED |


| REQ-SEC-LEGACY-001A | Legacy client identity/API-key member paths ต้อง retire หลัง caller migration | SEC-LEGACY-001 / ADR-0003 | reads retired @ 95d4f66; activation retired @ cc70d58b; renewal retired @ 787c79a8 | CI #115 + #126 + #131 PASS; LIFF renewal CI #11 + chat handoff CI #129 PASS | VERIFIED / LEGACY MEMBER IDENTITY PATHS RETIRED |


| REQ-SEC-WEB-004 | Activation/LINE identity binding ต้อง derive subject จาก verified LINE identity และห้าม client lineUserId authority | SEC-WEB-004 / ADR-0004 / SEQ-MEMBER-ACTIVATE | secure self-activation @ 3f052961; LIFF caller @ e174e625; chat→LIFF handoff @ 09dbfc88; legacy activation retired @ cc70d58b | secure activation tests + chat handoff tests + legacy retirement CI #126 PASS | VERIFIED / LEGACY ACTIVATION RETIRED |


| REQ-SEC-LEGACY-001B | Legacy renewal ต้องไม่ใช้ webhook/client lineUserId หรือ renewal code เป็น identity authority | SEC-LEGACY-001 / ADR-0003 | LIFF self-renew @ aade6512; chat handoff @ 4979d9b0; /api/member/renew + RenewalService retired @ 787c79a8 | LIFF CI #11 + backend CI #129/#131 PASS | VERIFIED / RETIRED |


| REQ-UI-DEPS-001 | Frontend dependencies ต้อง refresh แบบ controlled latest-stable พร้อม synchronized lock และ security/build gates | UI-DEPS-001 / FRONTEND_ENGINEERING_STANDARD / CI_PIPELINE_STANDARD | Vue 3.5.42, Router 5.3.1, Pinia 4.0.3, daisyUI 5.7.32, Tailwind 4.3.3, Vite 8.2.2, plugin-vue 6.0.8 @ 49e656fc | Webapp CI #27: npm ci + headless + router/store smoke + security scan + production build PASS | VERIFIED |


| REQ-SEC-WEBHOOK-001 | LINE webhook ต้อง verify x-line-signature จาก exact raw body ก่อน parse/process | ADR-0005 / WEBHOOK_INGRESS_SECURITY_STANDARD | Node 24 verified ingress @ 110de3e; Apps Script raw-body log hardening @ 9019873 | Webhook Ingress CI #1 PASS; backend CI #135 PASS | CODE_VERIFIED / PRODUCTION CUTOVER PENDING |


| REQ-SEC-LEGACY-002 | Browser-visible/shared API key must not authenticate Web/LIFF protected routes; unregistered routes fail closed | SEC-LEGACY-002 / ADR-0003 / API_DATA_CONTRACT | Apps Script Web API-key fallback + Config.API_KEY retired @ dec540ef | backend CI #146 PASS; web-api-key-retirement + protected delivery + gitleaks PASS | VERIFIED / BROWSER API-KEY AUTH SURFACE RETIRED |


| REQ-SEC-LEGACY-003 | Scheduled delivery adapters must not retain duplicate opts/repository/domain/messaging orchestration after Application migration | SEC-LEGACY-003 / ADR-0003 | ExpiryService + NoticeService + LoanReminderService reduced to thin Application adapters @ dc1a04e | backend CI #148 PASS; scheduled compatibility retirement + runtime delegation + canonical Application tests PASS | VERIFIED / LEGACY SCHEDULED SHELLS RETIRED |


| REQ-API-COMPAT-001 | Public loan API legacy `paymentType=equal_total` alias must follow an explicit controlled deprecation policy before retirement | API-COMPAT-001 / ADR-0006 / API_DATA_CONTRACT | policy documented; alias remains accepted and normalizes to canonical `equal_installment` | repository audit found no known first-party caller; production retirement evidence intentionally pending | POLICY VERIFIED / RETIREMENT CLOCK NOT STARTED |


| REQ-ARCH-LEGACY-001 | Production member repository adapter selection must be owned by the canonical composition root; legacy Data.MemberRepository factory must remain retired | ADR-0002 / ADR-0003 / ARCH-LEGACY-001 | SystemFactory DB_TYPE selection + MemberRepositoryPort enforcement; legacy factory removed @ 582b73c | backend CI #154 PASS including Test.js contracts, architecture retirement guard, port/application/security tests, protected delivery and gitleaks | VERIFIED / LEGACY REPOSITORY FACTORY RETIRED |


| REQ-ARCH-LEGACY-002 | Persistence adapters/services must not own member validity or role policy; policy authority remains MemberAccessEngine + Core.MemberRules + ClockPort | ADR-0002 / ADR-0003 / ARCH-LEGACY-002 / BL-ARCH-003 | repository/service policy wrappers removed @ c8491f7 | backend CI #156 PASS including deterministic Test.js engine coverage, architecture policy-retirement guard, ports, engines, application/security/protected-delivery tests and gitleaks | VERIFIED / BL-ARCH-003 CLOSED |
