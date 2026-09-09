# API_DATA_CONTRACT

สถานะ: ACCEPTED / ACTIVE — reconciled with verified backend contracts

## Response Envelope

Success:
```json
{"ok":true,"data":{}}
```

Failure:
```json
{"ok":false,"error":{"code":"ERROR_CODE","message":"ข้อความที่เหมาะสม"}}
```

## Contract Rules

- ห้ามคืน mock data เมื่อ production API ล้มเหลว
- endpoint ที่ต้องใช้สิทธิ์ต้องตรวจ auth + role server-side
- member identity สำหรับ LIFF ต้อง derive จาก identity ที่ backend verify แล้ว
- validation failure ต้องมี stable error code
- PII/financial data ต้องไม่ถูก log เกินจำเป็น
- write operation ต้องมี auditability ตาม risk level

## Data Authority

Schema เชิง implementation ปัจจุบันอยู่ที่:
`MTLineCoopBot/app/DataDict.js`

เอกสารนี้กำหนดกฎระดับ contract:
1. ชื่อ field/schema change = controlled change
2. required field/type/date-format change ต้องมี migration analysis
3. dates ใช้มาตรฐานเดียวตาม approved DataDict
4. UI ห้ามเดา field ที่ backend ไม่รับรอง
5. schema verification ต้องมี automated contract test

## Initial Domain Entities

- Member
- Savings Account
- Loan Account
- Dividend
- Activation Log
- Expiry Log
- Reminder Log
- Notice
- Content
- User/Role (เมื่อ backend authoritative implementation พร้อม)

## API Inventory Policy

TRACEABILITY_MATRIX ต้องระบุ endpoint ที่ VERIFIED จาก source จริง ไม่ใช้เอกสารเก่าเป็นหลักฐานเพียงอย่างเดียว


## Verified LINE / LIFF Identity Contract

Authority: ADR-0003

### Client

LIFF client must obtain the raw ID token via `liff.getIDToken()` and send that token to the backend identity boundary.

The client must not use any of the following as authentication proof:
- `lineUserId` supplied in query/body
- data returned from `liff.getProfile()`
- decoded ID-token payload sent from the browser
- client-side API key

### Server

The server must:
1. receive the raw ID token
2. verify it using the approved LINE ID-token verification mechanism
3. validate the expected LINE Login channel ID/audience
4. derive the LINE subject from verified claims
5. resolve any linked member from the verified subject
6. create the canonical `Security.Principal`
7. pass only the Principal into protected application use cases

### Fail-closed behavior

- missing token → anonymous/UNAUTHENTICATED
- invalid token → anonymous/UNAUTHENTICATED
- provider failure → authentication failure, never mock success
- valid LINE identity without member binding → authenticated Principal with no memberCode; member-only use cases deny explicitly
- client-provided member/user ID never upgrades privileges

### Test Contract

Required automated tests:
- valid verified token
- invalid token
- audience mismatch
- provider malformed response
- verified user not linked to member
- verified linked member
- client-supplied ID mismatch does not alter Principal


## Protected Self-Renew Contract

### POST /api/member/me/renew

Request:
```json
{"idToken":"<raw LINE ID token>"}
```

Identity:
- raw ID token verified server-side
- member identity derived from verified Principal
- client must not supply authoritative memberCode/lineUserId/expiry/status

Flow:
verified Principal → RenewMemberUseCase → server clock → Core.MemberRules.computeRenewal → MemberRepositoryPort.saveRenewal

Success:
```json
{
  "ok": true,
  "data": {
    "mem_code": "...",
    "mem_exp_dt": "yyyy-mm-dd",
    "mem_status": "active",
    "renewed_from": "yyyy-mm-dd"
  }
}
```

Fail closed:
- missing/invalid ID token → UNAUTHENTICATED
- Principal not member-bound → MEMBER_NOT_LINKED/FORBIDDEN
- member not found → MEMBER_NOT_FOUND

Legacy `/api/member/renew` is RETIRED. Canonical self-renewal is only `POST /api/member/me/renew` with a verified raw LINE ID token.


## Public Loan Calculation Contract

Authority: `Core.LoanCalculator` + `CalculateLoanUseCase`

### POST /api/loan/calculate

Authentication:
- public/read-only
- no member/PII data
- no browser API key required

Request:
```json
{
  "loanAmount": 500000,
  "interestRatePercent": 5,
  "calcMode": "installment_count",
  "calcValue": 50,
  "paymentType": "equal_principal",
  "startDate": "2026-09-01"
}
```

Canonical enums:
- `calcMode`: `installment_count` | `installment_amount`
- `paymentType`: `equal_principal` | `equal_installment`

Transitional compatibility — ADR-0006:
- legacy `equal_total` remains accepted server-side and is normalized to canonical `equal_installment`
- new first-party UI/code must not emit `equal_total`
- the deprecation clock starts only at the first production-verified cutover that includes ADR-0006
- retirement target is 60 calendar days after that verified production cutover
- code/CI/staging evidence alone does not start the clock
- retirement requires a fresh repository caller audit plus production release evidence; if those gates are not satisfied, compatibility remains in place pending a new controlled decision
- any compatibility telemetry must be coarse and non-sensitive: alias occurrence/count only; no loan payloads, amounts, member/PII, or raw request bodies

Success data includes:
- `contractVersion = "loan-calculation.v1"`
- canonical `paymentType`
- `schedule[]`
- `totalInterest`
- `totalPrincipal`
- `totalPayment`

Schedule row:
```json
{
  "period": 1,
  "remainingPrincipal": 500000,
  "date": "yyyy-mm-dd",
  "days": 29,
  "interest": 1986.30,
  "principal": 10000,
  "totalPayment": 11986.30
}
```

Formula authority:
- business formula exists only in backend `Core.LoanCalculator`
- UI may format/group rows for presentation but must not recalculate interest/principal/payment
- Actual/365, PMT, period/date calculation must not be duplicated in UI

Required automated evidence:
- principal conservation
- totals reconciliation
- zero-interest behavior
- legacy alias parity
- invalid/boundary inputs
- stable local calendar dates
- API delivery contract
- UI no-formula architecture guard


## Server-Verified Web Session Contract

Authority: ADR-0003

### POST /api/web/session/line
Request:
```json
{"idToken":"<raw LINE ID token>"}
```
Server verifies LINE identity, requires role `staff|manager|admin`, creates a `channel:web` Principal, and returns an opaque Web session token.

### POST /api/web/session/verify
Request:
```json
{"sessionToken":"<opaque token>"}
```
Returns only server-verified user/roles and expiry. Browser-persisted roles are never authoritative.

### POST /api/web/session/revoke
Revokes the server session immediately.

Session rules:
- raw session token is never persisted server-side
- server stores one-way token hash only
- expiry and revocation fail closed
- browser stores session token in sessionStorage; protected navigation re-verifies server-side

## Protected Web Member Read Contract

### POST /api/web/members/list
Request includes `sessionToken`, optional `search`, `status`, `page`, `limit`.

### POST /api/web/members/detail
Request includes `sessionToken` and `memberCode`.

Authorization:
- `staff|manager|admin` only
- server resolves Web Principal from session and applies AuthorizationEngine
- client role checks are presentation-only

Data minimization:
- member list/detail do not expose `activate_code`
- do not expose raw `line_user_id`; use boolean `line_linked`
- do not expose persistence metadata such as `_rowIndex`

Web member reads must not use browser-visible API keys or mock fallback data.


### POST /api/web/admin/settings

Authorization:
- opaque Web session required
- server resolves verified Web Principal
- `admin` role required server-side

Response is a sanitized, read-only projection:
- appName
- dbType
- expiryWarningDays
- paymentReminderDays
- webSessionTtlSeconds
- feature/configured booleans only

The endpoint must never expose API keys, LINE channel tokens/secrets, webhook secret values, or other credential material.


### POST /api/web/admin/audit-log

Authorization:
- opaque Web session required
- server resolves verified Web Principal
- `admin` role required server-side

Request:
```json
{"sessionToken":"<opaque token>","type":"all|activation|expiry|reminder","limit":50}
```

Response uses a sanitized read projection. It must not expose raw `line_user_id`, `activate_code`, or persistence metadata.
Audit write responsibilities remain in `AuditPort`; read/query responsibilities are isolated in `AuditQueryPort`.


### POST /api/web/reports/summary

Authorization:
- opaque Web session required
- `staff|manager|admin` roles allowed server-side

Server authority:
- member lifecycle counts are computed with `MemberAccessEngine`, server clock and configured expiry warning days
- financial totals are aggregated from canonical source tables:
  - Savings: `balance`
  - Loans: `outstanding`
  - Dividends: `dividend_amt`
- UI formats returned values only; it must not recalculate report business totals


### POST /api/web/members/renew

Authorization:
- opaque Web session required
- `staff|manager|admin` roles allowed server-side
- target is specified by `memberCode`; browser may not supply authoritative new expiry/status values

Request:
```json
{"sessionToken":"<opaque token>","memberCode":"M001"}
```

Server behavior:
1. resolve verified Web Principal
2. authorize staff/manager/admin
3. load target member by memberCode
4. compute renewal with `Core.MemberRules.computeRenewal` and server clock
5. persist via MemberRepositoryPort
6. record critical-write audit evidence including verified actor LINE identity when available

Client behavior:
- no optimistic expiry mutation
- reload member detail from server after success


## Canonical Role Vocabulary

Persisted member-role values recognized by the current system are:

- `member` — member self-service identity
- `staff` — operational member-service role
- `manager` — elevated operational role; valid for member self-service and staff-level Web capabilities where explicitly listed
- `admin` — privileged administration role

Rules:
1. Unknown persisted roles fail the member known-role gate.
2. `manager` is a first-class canonical role and must not be treated as an unknown role.
3. A role appearing in a browser is never authority by itself; protected capabilities must authorize a server-verified Principal.
4. Client-side route/menu role checks are presentation-only.
5. `Auditor` is currently a conceptual actor/permission profile in analysis documents, not a canonical persisted `mem_role` unless a future controlled change adds it.
6. Adding/removing/renaming a canonical role requires SSOT + authorization + migration + test updates in the same controlled change.


### POST /api/web/admin/staff

Authorization:
- opaque Web session required
- server resolves verified Web Principal
- `admin` role required

Response:
- sanitized staff/manager/admin account list only
- canonical operational role vocabulary: `staff|manager|admin`
- exposes boolean `lineLinked`, never raw `line_user_id`
- must not expose `activate_code` or persistence metadata

This endpoint is read-only. Staff/role writes require separate protected write use cases with audit trail.


### POST /api/web/admin/roles

Authorization:
- opaque Web session required
- `admin` role required server-side

Response:
- canonical role IDs: `member|staff|manager|admin`
- staff-assignable roles: `staff|manager|admin`
- presentation-safe descriptions/capabilities
- read-only contract

Role taxonomy is not mutable through this endpoint. Role assignment/change requires a separate protected write workflow with audit evidence.


### POST /api/web/admin/staff/role

Authorization:
- opaque Web session required
- `admin` role required server-side

Request:
```json
{"sessionToken":"<opaque token>","memberCode":"S001","role":"staff|manager|admin"}
```

Security rules:
- role must be present in the canonical assignable staff role catalog
- admin may not change their own role through this workflow
- privileged audit attempt must be durably recorded before persistence
- persistence success/failure/no-op is auditable
- browser role checks are presentation-only
- browser-visible API keys are not authentication proof


## Secure Self-Activation / LINE Identity Binding Contract

Authority: ADR-0004

### POST /api/member/me/activate

Request:
```json
{"idToken":"<raw LINE ID token>","activateCode":"<activation code>"}
```

Identity rules:
- server verifies raw LINE ID token
- LINE subject comes only from verified claims
- activation code proves entitlement to the member record only
- request must not use client-provided `lineUserId` as authority
- staff/admin direct arbitrary LINE binding is not supported

Binding outcomes:
- target unbound + subject unbound → bind/activate
- target already bound to same verified subject → idempotent success, no identity rewrite
- target bound to another subject → `BINDING_CONFLICT`
- verified subject already bound to another member → `SUBJECT_ALREADY_BOUND`
- invalid code → `MEMBER_NOT_FOUND`
- invalid/missing token → `UNAUTHENTICATED`

Audit:
- record verified actor subject, target member code, outcome and timestamp
- do not persist raw activation code in the secure audit event

Migration status:
- legacy `POST /api/member/activate` is RETIRED
- legacy `ActivationService` direct binding is fail-closed
- chat activation hands off to verified LIFF activation
- secure LIFF caller uses raw verified ID token + activation code only
- legacy `renew:CODE` remains a separate compatibility/identity-binding retirement concern


### Legacy renewal retirement status

- `POST /api/member/renew` — RETIRED
- `LineBot.RenewalService` direct mutation path — RETIRED / fail-closed
- chat `renew`, `renew:CODE`, and old `confirm_renew` postbacks — secure LIFF handoff only
- renewal code and webhook/source `lineUserId` are not renewal identity proof
- canonical self-renew uses verified LINE subject → Principal → `RenewMemberUseCase`


## API Mount Authentication Contract — Browser API-Key Retired

Authority: ADR-0003 / SEC-LEGACY-002

Rules:
- browser-visible/shared API keys are not an authentication mechanism for the Apps Script API mount
- the mount must not parse or accept `api_key` from query parameters or request bodies
- `Config.API_KEY` is retired and must not be reintroduced as a protected-route credential
- routes declared `auth: none` in `ApiRegistry` are the only explicitly public routes
- protected LIFF/member routes declare `auth: line-id-token`; the raw LINE ID token is verified server-side and converted to a Principal
- protected Web routes declare `auth: web-session`; `sessionToken` is verified server-side and converted to a Principal
- route/role checks performed in the browser are presentation-only and never authorization proof
- an unregistered path must fail closed as `NOT_FOUND`; supplying any arbitrary legacy/shared-secret field must not authorize it

Retirement evidence:
- backend: `MTLineCoopBot@dec540ef`
- backend CI #146 PASS, including Web API-key retirement, protected-delivery, and gitleaks gates
