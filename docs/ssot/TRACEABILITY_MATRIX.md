# TRACEABILITY_MATRIX

สถานะ: INITIAL

> ตารางนี้เป็นหัวใจของการ Audit: Requirement → Design → Code → Test → Evidence

| Req ID | Requirement | Design/ADR | Code | Test | Current Status |
|---|---|---|---|---|---|
| REQ-SEC-001 | Authentication ต้อง fail-closed | ARCHITECTURE_CONTRACT | webapp/src/stores/auth.js | TBD | BLOCKED — current code violates |
| REQ-SEC-002 | LIFF identity ต้อง verify server-side | API_DATA_CONTRACT | TBD reconcile backend | TBD | NOT_VERIFIED |
| REQ-SEC-003 | Authorization ต้อง server-side | ARCHITECTURE_CONTRACT | backend audit required | backend tests audit required | NOT_VERIFIED |
| REQ-DATA-001 | Data schema มี SSOT | API_DATA_CONTRACT | MTLineCoopBot/app/DataDict.js | backend contract tests | CODE_PRESENT |
| REQ-CORE-001 | Business rule ไม่ duplicate ข้าม UI | ADR-0002 / ENGINE_ARCHITECTURE_STANDARD | Core/LoanCalculator.js + UI calculator | TBD | BLOCKED — duplication found |
| REQ-ARCH-001 | Business capability ต้องอยู่ใน headless engine | ADR-0002 | backend architecture audit required | engine unit tests | DOCUMENTED |
| REQ-ARCH-002 | Infrastructure ต้องเปลี่ยนได้ผ่าน ports/adapters | ADR-0002 | repository pattern presentบางส่วน | shared contract tests required | PARTIAL / NOT_VERIFIED |
| REQ-ARCH-003 | UI เป็น adapter ไม่เป็นเจ้าของ business rule | ADR-0002 | Web/LIFF/LINE audit required | architecture + unit tests | NOT_VERIFIED |
| REQ-ARCH-004 | Dependency wiring ต้อง explicit และ testable | ENGINE_ARCHITECTURE_STANDARD | composition roots TBD audit | wiring tests | NOT_VERIFIED |
| REQ-TEST-001 | Critical backend rules automated | TEST_STRATEGY | MTLineCoopBot/app/Test.js + scripts/ci-test.js | CI | CODE_PRESENT |
| REQ-TEST-002 | Web critical behavior automated | TEST_STRATEGY | MTP6LineCoopBot/webapp | TBD | BLOCKED |
| REQ-TEST-003 | Engine tests ต้องไม่พึ่ง UI/network/production dependencies | TEST_STRATEGY / ADR-0002 | audit required | headless suite | DOCUMENTED |
| REQ-TEST-004 | Adapter implementation ใหม่ต้องผ่าน reusable contract tests | TEST_STRATEGY / ADR-0002 | TBD | shared contract suite | DOCUMENTED |
| REQ-DOC-001 | SSOT change ผ่าน team review | CHANGE_CONTROL | docs/ssot | PR review | DOCUMENTED |
| REQ-REL-001 | Release ผ่าน gates ก่อน production | RELEASE_GATES | TBD | release evidence | DOCUMENTED |

## Update Rule

ทุก feature/change ใหม่ต้องเพิ่มหรืออัปเดตแถวนี้ก่อนปิดงาน
