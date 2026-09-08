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

Legacy `/api/member/renew` remains transitional and is not the canonical protected self-renew contract.


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

Transitional compatibility:
- legacy `equal_total` is accepted server-side and normalized to `equal_installment`
- new UI code must not emit `equal_total`

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
