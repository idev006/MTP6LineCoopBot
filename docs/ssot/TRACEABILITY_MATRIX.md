# TRACEABILITY_MATRIX

สถานะ: INITIAL

> ตารางนี้เป็นหัวใจของการ Audit: Requirement → Design → Code → Test → Evidence

| Req ID | Requirement | Design/ADR | Code | Test | Current Status |
|---|---|---|---|---|---|
| REQ-SEC-001 | Authentication ต้อง fail-closed | ARCHITECTURE_CONTRACT | webapp/src/stores/auth.js | TBD | BLOCKED — current code violates |
| REQ-SEC-002 | LIFF identity ต้อง verify server-side | API_DATA_CONTRACT | TBD reconcile backend | TBD | NOT_VERIFIED |
| REQ-SEC-003 | Authorization ต้อง server-side | ARCHITECTURE_CONTRACT | backend audit required | backend tests audit required | NOT_VERIFIED |
| REQ-DATA-001 | Data schema มี SSOT | API_DATA_CONTRACT | MTLineCoopBot/app/DataDict.js | backend contract tests | CODE_PRESENT |
| REQ-CORE-001 | Business rule ไม่ duplicate ข้าม UI | ARCHITECTURE_CONTRACT | Core/LoanCalculator.js + UI calculator | TBD | BLOCKED — duplication found |
| REQ-TEST-001 | Critical backend rules automated | TEST_STRATEGY | MTLineCoopBot/app/Test.js + scripts/ci-test.js | CI | CODE_PRESENT |
| REQ-TEST-002 | Web critical behavior automated | TEST_STRATEGY | MTP6LineCoopBot/webapp | TBD | BLOCKED |
| REQ-DOC-001 | SSOT change ผ่าน team review | CHANGE_CONTROL | docs/ssot | PR review | DOCUMENTED |
| REQ-REL-001 | Release ผ่าน gates ก่อน production | RELEASE_GATES | TBD | release evidence | DOCUMENTED |

## Update Rule

ทุก feature/change ใหม่ต้องเพิ่มหรืออัปเดตแถวนี้ก่อนปิดงาน
