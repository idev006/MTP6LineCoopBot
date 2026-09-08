# TEST_STRATEGY

สถานะ: PROPOSED

## Testing Objective

พิสูจน์ว่า requirement และ contract ทำงานถูกต้องโดย **พึ่ง UI ให้น้อยที่สุด** และสามารถรันซ้ำได้

## Test Layers

### T0 Static / Policy
- syntax
- secret scan
- forbidden patterns
- doc/contract checks

### T1 Unit
Pure business rules:
- member validity
- renewal
- expiry
- date conversion
- loan calculation
- notice/reminder rules

### T2 Contract
- API route ↔ handler
- response envelope
- Menu ID ↔ caption/handler
- DataDict ↔ headers
- Role ↔ permission
- Frontend expected schema ↔ API contract

### T3 Integration
- fake/test repository
- API → service → repository
- activation
- renewal
- profile/finance
- expiry/reminder/notice

### T4 Frontend
- API client
- stores
- router guards
- fail-closed behavior
- loading/error/empty states

### T5 E2E
Critical workflows only:
- login success/failure
- unauthorized access
- member search/detail
- activate/renew
- logout/session expiry
- backend unavailable

### T6 Staging/UAT
Real integrations with non-production data

### T7 Production Verification
Safe smoke checks after release

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

## Test Evidence

แต่ละ requirement ต้องมี:
- Test ID
- automated/manual
- location
- last verified commit
- result/evidence

ไม่มี Evidence = ยังไม่ถือว่า VERIFIED
