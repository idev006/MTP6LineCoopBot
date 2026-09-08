# CHANGE_CONTROL

สถานะ: PROPOSED

## 1. หลักการ

เอกสาร SSOT เปลี่ยนได้ แต่ **ห้ามแก้แบบ unilateral** สำหรับการเปลี่ยนที่มีผลต่อ contract, architecture, security, data หรือ scope

## 2. Change Classes

### Class A — Editorial
แก้ typo, formatting, link โดยไม่เปลี่ยนความหมาย  
อนุมัติ: reviewer 1 คน

### Class B — Normal Engineering Change
เปลี่ยน requirement, acceptance criteria, test mapping หรือ implementation detail ที่ไม่กระทบ architecture/security boundary  
อนุมัติ: Developer + Tester/Reviewer

### Class C — Controlled Change
กระทบอย่างใดอย่างหนึ่ง:
- Scope/Mission
- Authentication/Authorization
- API contract breaking change
- Data schema/retention
- Financial formula
- Production topology
- Major dependency/platform
- Release/security gate

อนุมัติ: อย่างน้อย Product/Project representative + Senior Engineer + Tester/Auditor และต้องมี ADR

## 3. Required Change Record

ทุก Class B/C ต้องระบุ:
- Change ID
- Reason
- Documents affected
- Code affected
- Migration/compatibility impact
- Security impact
- Test impact
- Rollback
- Decision
- Reviewers
- Date

## 4. ADR Status

- PROPOSED
- ACCEPTED
- SUPERSEDED
- REJECTED

เฉพาะ ACCEPTED เท่านั้นที่ใช้ควบคุม implementation

## 5. No Silent Drift Rule

ถ้า implementation จำเป็นต้องเบี่ยงจากเอกสาร:
1. หยุดการ merge ส่วนนั้น
2. เปิด Change/ADR
3. ทีมเห็นชอบ
4. แก้เอกสารก่อนหรือพร้อม code
5. ทดสอบตาม contract ใหม่

ห้าม "แก้โค้ดก่อน แล้วค่อยจำเอกสารทีหลัง"

## 6. Emergency Fix

Hotfix production ทำได้เมื่อมี incident แต่ต้อง:
- จำกัด scope
- มี rollback
- บันทึกเหตุผล
- ทำ retrospective + sync SSOT ภายใน PR ถัดไป
