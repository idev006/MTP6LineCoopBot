# ARCHITECTURE_CONTRACT

สถานะ: ACCEPTED — governed by ADR-0002/ADR-0003

## Architectural Model — Engine First + Ports/Adapters

ระบบต้องมองเป็นชุด **Engines** ที่ทำงานได้โดยไม่ผูกกับ UI หรือ platform ใด platform หนึ่ง

```
            LINE Adapter
                 |
LIFF Adapter -- Ports --+
                 |      |
Web Adapter -----+   Application Engines
                        |
                 Domain/Core Engines
                        |
             Repository / Service Ports
                   /             \
          Sheets Adapter      Test/Fake Adapter
```

UI ทั้งหมดเป็นเพียง adapter ที่เรียก engine ผ่าน contract เดียวกัน

## Target Layers

```
[ UI / Delivery Adapters ]
LINE | LIFF | Web | CLI/Test Harness
              |
              v
[ Application Engines ]
Use cases / orchestration / commands / queries
              |
              v
[ Domain/Core Engines ]
Pure business rules / calculations / policies
              |
              v
[ Ports / Contracts ]
Repository | Identity | Messaging | Clock | Config | Audit
              |
              v
[ Infrastructure Adapters ]
Google Sheets | LINE API | Apps Script | External services | In-memory fakes
```

## Component Ownership

| Component | Repository | Rule |
|---|---|---|
| LINE webhook/Rich Menu/Flex | MTLineCoopBot | delivery adapter only |
| API/Application engines | MTLineCoopBot | orchestrate use cases through ports |
| Core business engines | MTLineCoopBot/app/Core | UI-independent, deterministic where possible |
| Data schema | MTLineCoopBot/app/DataDict.js + SSOT data contract | authoritative schema contract |
| LIFF | MTP6LineCoopBot/liff | UI/delivery adapter only |
| Staff/Admin Web | MTP6LineCoopBot/webapp | UI adapter through shared API client |
| Test harness/fakes | respective implementation repo | replace infrastructure through same ports |
| Project governance | MTP6LineCoopBot/docs/ssot | authoritative project docs |

## Lego / Plug-in Rules

ทุก module ที่เป็น boundary ต้อง:
1. มี contract/interface ชัดเจน
2. caller รู้จัก contract ไม่รู้จัก concrete implementation
3. concrete adapter เปลี่ยนได้โดยไม่แก้ core engine
4. dependency ถูก wire ที่ composition root
5. test สามารถ wire fake/in-memory implementation ได้
6. module ไม่มี hidden global dependency ถ้าหลีกเลี่ยงได้
7. side effects แยกออกจาก pure logic
8. external time/random/network/storage ต้อง inject หรือ wrap เมื่อกระทบ test determinism

## Composition Root

การประกอบระบบต้องเกิดในจุดที่ระบุชัด เช่น bootstrap/factory/composition module

ตัวอย่างเชิงแนวคิด:

```
MemberEngine(
  memberRepository,
  identityProvider,
  clock,
  auditPort
)
```

Production:
```
SheetsRepository + LineIdentity + SystemClock + SheetsAudit
```

Automated test:
```
InMemoryRepository + FakeIdentity + FakeClock + InMemoryAudit
```

Engine code ชุดเดียวกันต้องใช้ได้ทั้งสองกรณี

## Hard Architecture Rules

1. Authentication failure = deny, never mock success
2. Authorization enforced server-side
3. Client-supplied member/user identifiers are not trusted identity
4. Business formula may not be independently reimplemented in multiple UIs
5. External API/network errors must be explicit, not converted into fake production data
6. Direct Spreadsheet access must remain behind repository/data access boundary
7. New API endpoints require contract + tests
8. Breaking contract requires ADR + migration plan
9. Core engine ห้าม import UI framework
10. Core engine ห้ามเรียก Google Sheets/LINE/fetch โดยตรง
11. UI ห้ามเป็นเจ้าของ business rule
12. Infrastructure adapter ห้ามกลายเป็นที่ซ่อน domain policy
13. Module ใหม่ที่ถอดเปลี่ยนไม่ได้ต้องมีเหตุผลใน ADR
14. Cross-module call ต้องผ่าน public contract
15. Wiring ต้องสามารถสร้าง test system แบบ headless ได้

## Replaceability Targets

ระบบต้องรองรับการเปลี่ยน implementation โดยกระทบต่ำ เช่น:

- Google Sheets Repository → Firestore Repository
- LINE UI → Web/LIFF UI
- Real Clock → Fake Clock
- LINE Messaging → Fake Messaging
- Production Identity Provider → Test Identity Provider
- Real API Client → Stub/Fake Client

ถ้าการเปลี่ยนดังกล่าวต้องแก้ business engine จำนวนมาก ให้ถือเป็น architecture smell และต้อง review

## Environment Separation

Target:
- DEV
- STAGING
- PRODUCTION

แต่ละ environment ต้องมี config/data/deployment แยกตามความเหมาะสม และ production ห้ามใช้ seed/mock behavior
