# PROJECT_CHARTER — MTP6LineCoopBot

สถานะ: PROPOSED

## Mission

พัฒนาระบบบริการสมาชิกสหกรณ์ผ่าน LINE และ Web/LIFF ที่ปลอดภัย ใช้งานง่าย ตรวจสอบย้อนหลังได้ ทดสอบอัตโนมัติได้ และดูแลต่อได้โดยทีมอื่นโดยไม่ต้องพึ่งความรู้เฉพาะบุคคล

## In Scope

- LINE Bot / Rich Menu / Flex Message
- Member activation / validity / renewal
- Member profile / savings / loans / dividends
- Notice / expiry / loan reminder
- LIFF สำหรับสมาชิก
- Web App สำหรับ Staff/Admin
- Authentication / Authorization / RBAC
- Google Apps Script API
- Google Sheets repository
- Audit log
- Reports / settings ตาม approved requirements
- Automated tests / CI/CD / deployment / operational runbooks

## Out of Scope จนกว่าจะมี ADR/Scope Change

- Core Banking integration จริง
- Payment processing
- LINE Pay
- Native mobile application
- Firestore migration
- Feature ที่ทำให้เกิด financial transaction จริง

## Quality Principles

1. Security fail-closed
2. Server-side authorization
3. No production mock fallback
4. Business rules มี SSOT
5. API/Data contracts ชัดเจน
6. Automated testing เป็น default
7. UI ไม่ใช่เงื่อนไขในการทดสอบ business logic
8. Evidence-driven status
9. Small coherent changes
10. Reversible deployment เมื่อทำได้
11. Engine-first architecture — business capability ต้องทำงานได้โดยไม่ต้องมี UI
12. UI/LINE/LIFF/Web/CLI/Test Harness เป็น adapters ที่ครอบ engine
13. Lego/Plug-in concept — module ต้องถอด เปลี่ยน หรือเพิ่ม implementation ได้ผ่าน contract
14. Dependency wiring ต้อง explicit และทดสอบได้
15. Infrastructure/external service ต้องอยู่หลัง port/interface เพื่อ substitute ด้วย fake/in-memory adapter ได้
16. Full automated test ต้องง่าย รวดเร็ว deterministic และไม่ต้องใช้ production dependency

## Governance

การเปลี่ยน Mission, Scope, Security model, Data contract, API contract, Role/Permission, Financial formula, Engine Contract, Plug-in Boundary หรือ Release Gate ต้องผ่าน:
- Proposal
- Impact analysis
- Team review
- ADR/Change Record
- PR approval

## Definition of Project Complete

โครงการถือว่าเสร็จเมื่อ:
- Approved scope มี traceability ครบ
- ไม่มี Critical/High security defect ที่ยังเปิด
- Automated tests ผ่าน
- Core engines ทดสอบแบบ headless ได้
- Critical integrations มี replaceable test doubles/adapters
- UAT ผ่าน
- Production deployment verified
- Backup/restore/rollback/runbook พร้อม
- Final audit ผ่าน
- เอกสาร SSOT สอดคล้องกับ production baseline
