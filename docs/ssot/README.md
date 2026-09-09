# MTP6LineCoopBot — Project SSOT

สถานะ: PROPOSED  
เจ้าของเอกสาร: Project Team  
Change Control: เปลี่ยนผ่าน Pull Request + Team Review เท่านั้น

## 1. วัตถุประสงค์

โฟลเดอร์นี้คือ **Single Source of Truth (SSOT) ระดับโครงการ** สำหรับการวางแผน พัฒนา ทดสอบ Audit Deploy และส่งมอบ MTP6LineCoopBot

กฎหลัก:

1. การพัฒนาระบบต้องอ้างอิงเอกสาร authoritative ในโฟลเดอร์นี้
2. เอกสารเปลี่ยนได้ แต่ต้องผ่าน Change Control
3. ห้ามถือว่า feature "เสร็จ" จากข้อความในเอกสารเพียงอย่างเดียว ต้องมี Evidence
4. เอกสารเก่าที่อยู่นอก `docs/ssot/` เป็น Reference จนกว่าจะ migrate/retire
5. เมื่อเอกสารและโค้ดขัดกัน ให้หยุด merge feature นั้นและเปิด discrepancy จนกว่าจะ resolve
6. Architecture ต้องยึด TARGET_SYSTEM_ARCHITECTURE.md + Engine-first/Lego/Plug-in ตาม ADR-0002/ADR-0003

## Analysis & Interaction Model

Authoritative analysis package: `docs/ssot/analysis/`

Includes:
- Actor Catalog
- Actor → Use Case Matrix
- Use Case Catalog / Template
- Business/System Workflows
- Canonical Use Case Diagram
- Sequence Diagrams

## Mandatory Frontend Standard

- `ui/FRONTEND_ENGINEERING_STANDARD.md`
  - never trust client
  - no business logic in UI
  - Vue + Vue Router + Pinia
  - Tailwind CSS + daisyUI-first
  - Chakra Petch typography

## Mandatory Process Standards

Authoritative process package:
- `process/TEAM_DEVELOPMENT_PIPELINE.md`
- `process/CI_PIPELINE_STANDARD.md`
- `process/RELEASE_DEPLOYMENT_PIPELINE.md`

These are mandatory best-practice standards for project delivery.

## Current Handoff

- DEVELOPMENT_HANDOFF_CHECKPOINT-2026-09-08.md — current authorized development handoff

## Execution Documents

| เอกสาร | หน้าที่ |
|---|---|
| DEVELOPMENT_EXECUTION_PLAN.md | แผนดำเนินการพัฒนาจน Production Verified |
| AGILE_KANBAN.md | Workflow/WIP/Pull policy |
| TEST_SUITE_CATALOG.md | Test suites และ CI gates |
| DEVELOPMENT_TEAM_HANDOFF.md | คำสั่งส่งมอบให้ทีมพัฒนา |

## 2. ลำดับอำนาจของเอกสาร

| ลำดับ | เอกสาร | Authority |
|---|---|---|
| 1 | PROJECT_CHARTER.md | เป้าหมาย ขอบเขต หลักการตัดสินใจ |
| 2 | CHANGE_CONTROL.md + ADR | การเปลี่ยนข้อกำหนด/สถาปัตยกรรม |
| 3 | SYSTEM_BASELINE.md | สถานะระบบที่ยืนยันแล้ว |
| 4 | TARGET_SYSTEM_ARCHITECTURE.md + ARCHITECTURE_CONTRACT.md + ENGINE_ARCHITECTURE_STANDARD.md | Canonical target architecture, engine/port/adapter/wiring |
| 5 | API_DATA_CONTRACT.md | API/Data contracts |
| 6 | TEST_STRATEGY.md | วิธีพิสูจน์ความถูกต้อง |
| 7 | AUDIT_PLAN.md | วิธีตรวจ compliance/evidence |
| 8 | TRACEABILITY_MATRIX.md | Requirement → Code → Test → Evidence |
| 9 | REDESIGN_MIGRATION_LEDGER.md | Legacy → target migration state/evidence |
| 10 | RELEASE_GATES.md | เกณฑ์อนุญาต release |
| 11 | เอกสารเดิม | Reference only เว้นแต่ถูกอ้างจาก SSOT โดยตรง |

## 3. สถานะมาตรฐาน

ใช้สถานะต่อไปนี้เท่านั้น:

- DOCUMENTED
- CODE_PRESENT
- UNIT_TESTED
- INTEGRATION_TESTED
- STAGING_VERIFIED
- PRODUCTION_DEPLOYED
- PRODUCTION_VERIFIED
- BLOCKED
- RETIRED

คำว่า "Done" ใช้ได้เมื่อผ่าน Release/DoD ที่เกี่ยวข้องเท่านั้น

## 4. Repository Boundary

- `idev006/MTP6LineCoopBot` — Project governance SSOT + Web/LIFF/UI artifacts
- `idev006/MTLineCoopBot` — Google Apps Script backend + LINE Bot + Core/Data/API + backend CI/tests

ทั้งสอง repository เป็น implementation ของ **โครงการเดียวกัน** แต่ SSOT ด้านโครงการอยู่ในโฟลเดอร์นี้

## 5. Development Rule

ก่อนเขียนโค้ด:
1. Requirement ต้องมี ID
2. Architecture/API/Data impact ต้องถูกระบุ
3. Acceptance Criteria ต้องชัด
4. Test Mapping ต้องมี
5. ถ้ามีการเปลี่ยน design สำคัญ ต้องมี ADR ที่ Accepted
6. ระบุว่า logic อยู่ engine ใด, ports อะไร, adapters อะไร และ wiring อยู่ที่ใด
7. ระบุวิธีทดสอบแบบ headless/fake/in-memory

หลังเขียนโค้ด:
1. Test ผ่าน
2. Traceability อัปเดต
3. Audit evidence อ้างได้
4. เอกสารยังตรงกับ implementation
5. PR ผ่าน review
6. Engine ไม่ผูกกับ UI/infrastructure โดยไม่จำเป็น
7. Adapter สามารถถูกถอด/เปลี่ยนผ่าน contract ได้ตามที่กำหนด

## 6. Audit Rule

ผู้ Audit ต้องสามารถเริ่มจาก Requirement ID แล้วตามไปถึง:
`Requirement → Design/ADR → Engine/Port/Adapter → Source → Test → CI → Deployment → Verification`

ถ้าตามไม่ได้ ให้ถือว่า **ยังไม่มีหลักฐานเพียงพอ** แม้ feature จะดูเหมือนทำงานได้


## Latest Development Handoff

For a new development chat/session, start with:
- `DEVELOPMENT_HANDOFF_CHECKPOINT-2026-09-09.md`
- `DEVELOPMENT_TEAM_HANDOFF.md`
- `AGILE_KANBAN.md`

Always fetch the current `main` of both repositories before trusting any recorded commit anchor.
