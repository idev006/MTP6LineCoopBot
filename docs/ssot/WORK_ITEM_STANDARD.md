# WORK_ITEM_STANDARD

สถานะ: PROPOSED

## Work Item Types
- REQ — Requirement
- FEAT — Feature
- FIX — Defect
- SEC — Security
- TEST — Test/Quality
- DOC — Documentation
- OPS — Operations
- AUD — Audit finding remediation
- ADR — Architecture decision

## Required Fields

ทุกงานที่เข้าสู่ Ready ต้องมี:
- ID
- Title
- Why
- Scope
- Acceptance Criteria
- SSOT references
- Dependencies
- Security/Data impact
- Test IDs
- Rollback/Migration ถ้ามี
- Owner
- Reviewer

## Workflow

`BACKLOG → READY → IN_PROGRESS → REVIEW → TEST → DONE`

WIP:
- IN_PROGRESS รวมทีมไม่เกิน 3 งาน เว้นแต่มีเหตุผลบันทึกไว้
- BLOCKED ไม่นับ WIP แต่ต้องมี blocker/owner

## Definition of Done

- Acceptance criteria ผ่าน
- Code review ผ่าน
- Required automated tests ผ่าน
- Negative tests ที่เกี่ยวข้องผ่าน
- Traceability updated
- SSOT synchronized
- ไม่มี unresolved Critical/High ที่เกิดจากงาน
- Deployment verification เพิ่มเมื่อเป็น release work

## Evidence Rule

ช่อง DONE ต้องมี evidence link/commit/test result ไม่ใช่แค่คำว่าเสร็จ
