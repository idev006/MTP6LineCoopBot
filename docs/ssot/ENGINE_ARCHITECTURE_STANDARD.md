# ENGINE_ARCHITECTURE_STANDARD

สถานะ: PROPOSED

## 1. Purpose

มาตรฐานนี้กำหนดให้ระบบพัฒนาแบบ **Engine-first + Lego/Plug-in Concept** เพื่อให้:
- Full automated test ทำได้ง่ายและเร็ว
- UI หลายแบบครอบ engine เดียวกันได้
- module ถอด/เปลี่ยน/เพิ่มได้
- dependency ชัดเจน
- ลด coupling และ duplicated business logic
- audit ได้เป็นส่วน ๆ

## 2. Engine Definition

Engine คือ module ที่ให้ capability ของระบบโดยไม่ผูกกับ presentation หรือ infrastructure

ตัวอย่าง:
- MemberValidityEngine
- ActivationEngine
- RenewalEngine
- LoanCalculationEngine
- NoticeEngine
- ReminderEngine
- AuthorizationEngine

Engine ต้อง:
- มี public contract
- รับ input/output ที่ชัดเจน
- ไม่รู้จัก Vue/DOM/LINE Flex/Google Sheets โดยตรง
- side effect ผ่าน port
- ทดสอบ headless ได้

## 3. Port Definition

Port คือ contract ที่ engine ใช้สื่อสารกับโลกภายนอก

ตัวอย่าง:
- MemberRepositoryPort
- IdentityPort
- MessagingPort
- ClockPort
- AuditPort
- ConfigPort

Port ต้องกำหนด behavior และ error semantics ไม่ผูกกับ implementation

## 4. Adapter Definition

Adapter คือ implementation ของ port หรือ delivery mechanism

ตัวอย่าง:
- SheetsMemberRepository
- InMemoryMemberRepository
- LineMessagingAdapter
- FakeMessagingAdapter
- SystemClock
- FakeClock
- WebController
- LiffController
- LineEventAdapter

## 5. Wiring / Composition

ห้ามสร้าง dependency แบบกระจัดกระจายทั่ว source

ต้องมี composition root ที่:
- เลือก concrete adapters
- inject เข้า engines
- แยก production/test wiring

ตัว engine ต้องไม่เรียก factory global เพื่อเลือก dependency ของตัวเอง

## 6. Plug-compatible Contract

Adapter สองตัวถือว่า plug-compatible เมื่อ:
- implement contract เดียวกัน
- ผ่าน contract test suite เดียวกัน
- error semantics เทียบเท่า
- caller ไม่ต้องแก้ business logic

## 7. Engine-to-Engine Collaboration

Engine สามารถร่วมงานกันได้ผ่าน:
- application service/use-case orchestration
- explicit command/query contract
- domain event เมื่อเหมาะสม

ห้ามเชื่อมกันด้วย hidden shared mutable state

## 8. UI Rule

UI รับผิดชอบ:
- input/output
- presentation
- navigation
- user interaction state

UI ไม่รับผิดชอบ:
- financial formula
- authorization policy
- member validity
- renewal rule
- persistence rule

ดังนั้น LINE, LIFF, Web, CLI และ test harness ต้องสามารถเรียก capability เดียวกันได้

## 9. Test Design

สำหรับ engine ใหม่ ต้องมีอย่างน้อย:
- unit test
- invalid input test
- boundary cases
- dependency failure test
- deterministic fake dependency

สำหรับ adapter ใหม่:
- shared contract tests
- adapter-specific integration tests

## 10. Architecture Fitness Questions

ก่อน approve module ใหม่ ต้องตอบได้:
1. ถอด UI ออก engine ยังรันได้หรือไม่?
2. เปลี่ยน Sheets เป็น in-memory fake โดยไม่แก้ engine ได้หรือไม่?
3. test โดยไม่ใช้ network ได้หรือไม่?
4. dependency ทั้งหมดเห็นได้จาก constructor/factory/signature หรือไม่?
5. business rule อยู่เพียงจุดเดียวหรือไม่?
6. adapter ใหม่สามารถ reuse contract test เดิมได้หรือไม่?
7. สามารถ wire system แบบ test harness ได้หรือไม่?

ถ้าคำตอบสำคัญเป็น "ไม่ได้" ต้องมี corrective design หรือ ADR

## 11. Anti-patterns

ห้าม/หลีกเลี่ยง:
- business logic ใน Vue component/LINE handler
- direct SpreadsheetApp ใน core rules
- direct fetch/UrlFetchApp ใน domain engine
- hidden singleton/global mutable dependency
- mock fallback ใน production
- copy/paste formula ข้าม UI
- tests ที่ต้องเปิด browser เพื่อพิสูจน์ core rule
- adapter ที่มี business policy ซ่อนอยู่

## 12. Migration Principle

Legacy code ไม่จำเป็นต้อง rewrite ทั้งหมดทันที

ให้ใช้ Strangler/Incremental Extraction:
1. ระบุ business rule
2. เขียน characterization test
3. extract engine
4. define ports
5. wrap legacy infrastructure เป็น adapter
6. wire เดิมเข้ากับ engine
7. เพิ่ม alternate/test adapters
8. remove duplicated rule เมื่อ evidence ครบ
