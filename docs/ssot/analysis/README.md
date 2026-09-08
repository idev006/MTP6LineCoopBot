# ANALYSIS & INTERACTION MODEL

Status: ACCEPTED  
Authority: ADR-0003

## Purpose

ชุดเอกสารนี้เป็น SSOT ด้าน Actor, Use Case, Workflow และ Interaction/Sequence ของระบบ

## Contents

### Actors & Use Cases
- ACTOR_CATALOG.md
- ACTOR_USE_CASE_MATRIX.md
- USE_CASE_CATALOG.md
- USE_CASE_SPEC_TEMPLATE.md
- USE_CASE_DIAGRAM.md

### Workflows
- BUSINESS_WORKFLOWS.md
- SYSTEM_WORKFLOWS.md

### Sequence Diagrams
- sequences/SEQ-LIFF-AUTH-PROFILE.md
- sequences/SEQ-MEMBER-ACTIVATE.md
- sequences/SEQ-MEMBER-RENEW.md
- sequences/SEQ-MEMBER-FINANCE.md
- sequences/SEQ-WEB-STAFF-LOGIN.md
- sequences/SEQ-EXPIRY-SCAN.md
- sequences/SEQ-NOTICE-BROADCAST.md
- sequences/SEQ-LOAN-REMINDER.md

## Development Rule

ก่อน implement use case ใหม่:
1. ต้องมี Actor/Use Case ID
2. ต้องระบุ authorization
3. ต้องมี workflow/sequence ที่เกี่ยวข้อง
4. ต้อง map ไป Application Use Case / Engine / Ports
5. ต้องมี Acceptance Criteria + Test IDs
6. ต้อง update Traceability

Legacy analysis documents outside `docs/ssot/analysis` are Reference only.
