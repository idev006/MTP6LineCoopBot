# API_DATA_CONTRACT

สถานะ: PROPOSED — ต้อง reconcile กับ backend source ก่อน ACCEPTED

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
