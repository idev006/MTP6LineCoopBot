# TEST_SUITE_CATALOG

Status: ACTIVE

## TS-00 Static / Security

- syntax checks
- secret scan / gitleaks
- forbidden production mock scan
- architecture boundary scan
- frontend production build

## TS-10 Domain Engine

- MemberRules
- MemberAccessEngine
- AuthorizationEngine
- LoanCalculation
- NoticeRules
- ReminderRules
- DateConverter

Properties:
- headless
- deterministic
- no UI/network/Sheets

## TS-20 Port Contract

- MemberRepositoryPort
- IdentityPort
- IdTokenVerifierPort
- HttpClientPort
- ClockPort
- future Messaging/Audit/Config ports

Adapter ใหม่ต้องผ่าน shared contract suite

## TS-30 Application Use Cases

- GetCurrentMemberProfile
- GetCurrentMemberFinance
- ActivateMember
- RenewMember
- ExpiryScan
- NoticeBroadcast
- LoanReminder

ใช้ fake/in-memory adapters เป็น default

## TS-40 Delivery Contract

- Apps Script API routes
- LINE adapter
- LIFF client/API contract
- Web API client
- error envelope
- POST-only sensitive token routes

## TS-50 Adapter Integration

- Google Sheets repository
- LINE token verifier
- LINE Messaging
- Apps Script HTTP
- web session identity

## TS-60 Frontend

- session policy
- stores
- router/RBAC
- loading/error/empty
- component behavior
- production build

## TS-70 E2E

Critical flows:
- authenticated LIFF self profile
- savings/loans/dividends
- web login fail/success
- unauthorized role
- member search/detail
- activation
- renewal
- session expiry/logout

## TS-80 Staging/UAT

- real integrations
- non-production data
- member/admin scenarios
- failure/recovery cases

## TS-90 Production Verification

- health
- safe authenticated profile
- safe read-only finance check
- logs/monitoring
- no secret/error leakage

## Mandatory Negative Suite

- missing credential
- invalid credential
- expired credential
- wrong audience
- provider failure
- malformed response
- unknown member
- inactive member
- wrong role
- API unavailable
- storage failure
- duplicate write
- retry/idempotency risk

## CI Gate

Fast suite on every PR:
TS-00 + TS-10 + TS-20 + TS-30 + TS-40

Repository/integration changes additionally:
TS-50

Web changes:
TS-60

Release candidate:
TS-00..TS-80

Production:
TS-90
