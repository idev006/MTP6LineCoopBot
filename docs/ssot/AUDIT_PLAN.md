# AUDIT_PLAN

สถานะ: PROPOSED

## Audit Dimensions

1. Requirement compliance
2. Architecture compliance
3. Security
4. Data integrity
5. Test adequacy
6. Process/Change control
7. Deployment/release
8. Operational readiness
9. Documentation consistency

## Audit Method

สำหรับแต่ละ Requirement ID:
1. อ่าน requirement/acceptance criteria
2. ตรวจ approved ADR
3. หา source implementation
4. ตรวจ tests
5. ตรวจ CI evidence
6. ตรวจ deployment evidence
7. ตรวจ production/staging verification
8. ลงผล PASS / PARTIAL / FAIL / NOT_VERIFIED

## Severity

- CRITICAL — เสี่ยงข้อมูล/สิทธิ/การเงิน/ระบบ production อย่างรุนแรง
- HIGH — security/control defect สำคัญ
- MEDIUM — correctness/maintainability gap
- LOW — quality/process/documentation issue

## Independence Rule

ผู้เขียน code สามารถ self-review ได้ แต่ Release Gate สำคัญต้องมี reviewer/tester/auditor อีกบทบาทหนึ่งตรวจหลักฐาน

## Audit Findings Format

- Finding ID
- Severity
- Requirement/Control
- Evidence
- Expected
- Actual
- Risk
- Corrective action
- Owner
- Status
- Verification evidence

## Initial Findings to Track

- BL-SEC-001 fail-open authentication
- BL-SEC-002 LIFF financial mock fallback
- BL-SEC-003 client API key assumption
- BL-DOC-001 duplicated docs
- BL-TEST-001 missing web test gates
- BL-ARCH-001 duplicated loan formula
