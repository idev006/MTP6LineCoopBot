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
