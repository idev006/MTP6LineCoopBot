# ADR-0002 — Engine-first Lego/Plug-in Architecture

Status: ACCEPTED  
Date: 2026-09-08

## Context

ระบบต้องรองรับ UI หลายแบบ เช่น LINE, LIFF, Web และอาจมี CLI/Test Harness ในอนาคต พร้อมทั้งต้อง Full Automated Test ได้ง่าย มีประสิทธิภาพ และเปลี่ยน infrastructure เช่น Google Sheets หรือ external adapters ได้โดยไม่กระทบ business logic จำนวนมาก

## Decision

architecture หลักของโครงการเป็น:
- Engine-first
- Ports and Adapters
- Explicit dependency injection/wiring
- Composition root
- Plug-compatible adapters
- Pure/headless core เป็น default
- UI เป็น delivery adapter
- Infrastructure อยู่หลัง ports
- Contract tests เป็นตัวรับรองความเข้ากันได้ของ plug-ins

## Required Consequences

1. Core/business engine ต้องไม่ import UI framework
2. Core/business engine ต้องไม่เรียก Google Sheets/LINE/network โดยตรง
3. dependency สำคัญต้อง inject/replace ได้
4. production และ automated test ใช้ engine เดียวกัน ต่างกันที่ wiring
5. adapter ใหม่ต้องผ่าน contract test
6. duplicated business formula ข้าม UI ถือเป็น defect
7. testability เป็น architecture quality attribute

## Alternatives

### UI-centric architecture
ปฏิเสธ เพราะทำให้ logic ผูกกับ presentation และ automated test ยาก

### Direct service calls everywhere
ปฏิเสธ เพราะ coupling สูงและเปลี่ยน implementation ยาก

### Full microservices
ยังไม่เลือก เพราะเพิ่ม operational complexity เกินความจำเป็นของโครงการปัจจุบัน

## Consequences

ข้อดี:
- automated tests เร็วและเสถียร
- เปลี่ยน UI/DB/service ง่ายขึ้น
- audit module ได้ชัด
- business rule ไม่กระจาย

ข้อเสีย:
- ต้องออกแบบ contracts และ wiring เพิ่ม
- legacy code ต้องทยอย refactor
- ต้องมี discipline ไม่ให้ adapter ดูด business logic กลับไป

## Migration

ใช้ incremental extraction ไม่ rewrite ครั้งเดียว:
- characterization tests
- extract engine
- define ports
- wrap existing implementations
- add contract tests
- remove duplication

## Security/Data Impact

ช่วยให้ auth/authorization/data boundaries ถูกทดสอบแยกได้ แต่การเปลี่ยน identity/repository adapter ยังต้องผ่าน security/data review

## Test Impact

เพิ่ม engine unit tests, reusable port contract tests, wiring tests และ architecture fitness checks

## Rollback

หลัง ACCEPTED การ deviation ต้องมี superseding ADR

## Approval

- Product/Project: APPROVED 2026-09-08
- Engineering: APPROVED 2026-09-08
- Test/Audit: APPROVED 2026-09-08
- Evidence: GOVERNANCE_REVIEW_RECORD-2026-09-08.md
