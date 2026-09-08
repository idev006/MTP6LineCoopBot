# MTP6LineCoopBot Documentation

> เอกสารโครงการ MTP6LineCoopBot

## Project SSOT — Authoritative

**เอกสารที่ใช้ควบคุมการพัฒนา ทดสอบ Audit และ Release อยู่ที่ [docs/ssot/](./ssot/README.md)**

เอกสารในส่วนด้านล่างเป็นเอกสารเดิม/เอกสารอ้างอิง และอาจสะท้อนสถานะ ณ เวลาที่จัดทำ ไม่ให้ใช้เครื่องหมาย ✅ หรือข้อความสถานะในเอกสารเดิมเป็นหลักฐานว่า implementation ปัจจุบันผ่านการตรวจแล้ว เว้นแต่มี evidence ใน `docs/ssot/TRACEABILITY_MATRIX.md`

กฎสำคัญ:
- Development ต้องสอดคล้องกับ SSOT
- Controlled change ต้องผ่าน Pull Request + Team Review
- Architecture/Security/API/Data/Scope change สำคัญต้องมี ADR
- เมื่อ code กับ SSOT ขัดกัน ให้เปิด discrepancy และแก้ผ่าน Change Control
- Feature จะถือว่า verified ตามระดับที่มี evidence เท่านั้น

---

## SSOT Documents

| เอกสาร | หน้าที่ |
|---|---|
| [SSOT Index](./ssot/README.md) | ลำดับ authority และกฎหลัก |
| [Project Charter](./ssot/PROJECT_CHARTER.md) | Mission / Scope / Project Complete |
| [Change Control](./ssot/CHANGE_CONTROL.md) | วิธีแก้ SSOT และ approval |
| [System Baseline](./ssot/SYSTEM_BASELINE.md) | สถานะระบบที่ตรวจยืนยัน |
| [Architecture Contract](./ssot/ARCHITECTURE_CONTRACT.md) | Architecture boundaries |
| [API & Data Contract](./ssot/API_DATA_CONTRACT.md) | API/Data rules |
| [Test Strategy](./ssot/TEST_STRATEGY.md) | Test layers/evidence |
| [Audit Plan](./ssot/AUDIT_PLAN.md) | Audit method/findings |
| [Traceability Matrix](./ssot/TRACEABILITY_MATRIX.md) | Requirement → Code → Test → Evidence |
| [Release Gates](./ssot/RELEASE_GATES.md) | เกณฑ์ release |
| [Work Item Standard](./ssot/WORK_ITEM_STANDARD.md) | Kanban/DoD |
| [Decision Log](./ssot/DECISION_LOG.md) | ADR index |

---

## Legacy / Reference Documents

| เอกสาร | เนื้อหา |
|--------|--------|
| [README.md](../README.md) | Project overview |
| [architecture.md](./architecture.md) | System architecture — legacy/reference |
| [KANBAN.md](./KANBAN.md) | Kanban board — legacy/reference |
| [SPRINT.md](./SPRINT.md) | Sprint planning — legacy/reference |
| [INFRA.md](./INFRA.md) | Infrastructure checklist — legacy/reference |
| [ch-01-introduction.md](./ch-01-introduction.md) | บทนำ |
| [ch-02-system-analysis.md](./ch-02-system-analysis.md) | การวิเคราะห์ระบบ |
| [ch-03-system-design.md](./ch-03-system-design.md) | การออกแบบระบบ |
| [ch-04-program-structure.md](./ch-04-program-structure.md) | โครงสร้างโปรแกรม |
| [ch-05-installation-deployment.md](./ch-05-installation-deployment.md) | การติดตั้ง |
| [ch-06-testing.md](./ch-06-testing.md) | การทดสอบ |
| [ch-07-maintenance-roadmap.md](./ch-07-maintenance-roadmap.md) | Roadmap |
| [ch-08-process.md](./ch-08-process.md) | กระบวนการ |
| [data-dictionary.md](./data-dictionary.md) | Data Dictionary reference |
| [test-matrix.md](./test-matrix.md) | Test Matrix reference |
| [test-uc3-to-7.md](./test-uc3-to-7.md) | UC3-7 Test Script |
| [foundation-readiness.md](./foundation-readiness.md) | Historical readiness checklist |
