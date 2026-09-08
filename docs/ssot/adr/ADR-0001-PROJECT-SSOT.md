# ADR-0001 — Project SSOT and Change-Control Model

Status: ACCEPTED  
Date: 2026-09-08

## Context

โครงการมี implementation แยกสอง repository และมีเอกสารบางส่วนซ้ำกัน ทำให้สถานะ feature, source location และ test evidence สามารถ drift ได้

## Decision

1. ใช้ `MTP6LineCoopBot/docs/ssot/` เป็น Project Governance SSOT
2. `MTLineCoopBot` เป็น authoritative backend implementation repository
3. `MTP6LineCoopBot` เป็น authoritative Web/LIFF implementation repository
4. เอกสารเก่านอก `docs/ssot/` เป็น reference จน migrate/retire
5. การเปลี่ยน controlled contract ใช้ PR + ADR + team approval
6. สถานะ implementation ใช้ evidence ใน TRACEABILITY_MATRIX ไม่ใช้เครื่องหมาย ✅ จากเอกสารเก่าเพียงอย่างเดียว

## Alternatives

- รวม repository ทันที: ยังไม่เลือก เพราะเพิ่ม migration risk ก่อน audit baseline เสร็จ
- คงเอกสารสองชุด authoritative: ปฏิเสธ เพราะ drift risk สูง

## Consequences

ข้อดี:
- audit path ชัด
- เปลี่ยน design อย่างควบคุม
- developer/tester ใช้ contract เดียวกัน

ข้อเสีย:
- ต้อง migrate/reference เอกสารเก่าเป็นระยะ
- ต้องมีวินัย PR review

## Security/Data Impact

ช่วยลด silent security/design drift ไม่มี data migration ใน ADR นี้

## Test Impact

เพิ่ม requirement ให้ traceability และ release gates เป็นส่วนของ DoD

## Rollback

หลัง ACCEPTED การยกเลิก/เปลี่ยน decision ต้องมี superseding ADR

## Approval

- Product/Project: APPROVED 2026-09-08
- Engineering: APPROVED 2026-09-08
- Test/Audit: APPROVED 2026-09-08
- Evidence: GOVERNANCE_REVIEW_RECORD-2026-09-08.md
