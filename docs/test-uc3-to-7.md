# Test Script: UC3-7 (สถานะการณ์หลัง Activate)

> **วัตถุประสงค์:** ทดสอบว่าระบบตอบสนองถูกต้องเมื่อ admin แก้ไขข้อมูลสมาชิกใน Google Sheets  
> **ข้อมูลตั้งต้น:** สมาชิก `MEM005` (activate แล้ว, active, มี line_user_id)  
> **วันที่ทดสอบ:** _______________

---

## ข้อมูลตั้งต้น (ก่อนทดสอบ)

| ฟิลด์ | ค่าปัจจุบัน |
|---|---|
| mem_code | MEM005 |
| mem_status | active |
| mem_eff_dt | 2026-01-01 |
| mem_exp_dt | 2026-12-31 |
| line_user_id | Uxxxxxxxxxxx (ของคุณ) |
| Rich Menu | Member Menu Tab 1 |

---

## UC3: สมาชิกหมดอายุ

### ขั้นตอน

| # | ทำอะไร | ค่าที่ควรเห็น |
|---|---|---|
| 1 |  MEMBER MEM005 ยัง active อยู่ คลิกเมนู "ข้อมูลส่วนตัว" | Flex Card แสดงข้อมูลปกติ |
| 2 | **Admin** ไป Google Sheets → แก้ `mem_exp_dt` ของ MEM005 เป็น `2026-08-19` (อดีต) | — |
| 3 | ** MEMBER MEM005** คลิกเมนู "ข้อมูลส่วนตัว" อีกครั้ง | **ถูกปฏิเสธ** + ข้อความ: "คุณยังไม่ได้รับสิทธิ์ใช้งานเมนูนี้..." |
| 4 | ตรวจ Rich Menu | **เปลี่ยนกลับเป็น Welcome Menu** (auto-unlink) |
| 5 | ตรวจ Executions log | `[Gate] Unlinked member menu for expired/revoked user: U...` |
| 6 | **Admin** แก้ `mem_exp_dt` กลับเป็น `2026-12-31` | — |
| 7 | **MEMBER MEM005** คลิกเมนู "ข้อมูลส่วนตัว" | **กลับมาใช้งานได้** (ไม่ต้อง activate ใหม่) |

### ผลลัพธ์ที่คาดหวัง

```
Step 1: ✅ Flex Card ข้อมูลส่วนตัว
Step 3: ✅ "คุณยังไม่ได้รับสิทธิ์ใช้งานเมนูนี้..."
Step 4: ✅ Rich Menu = Welcome Menu
Step 5: ✅ Log: [Gate] Unlinked member menu for expired/revoked user
Step 7: ✅ Flex Card ข้อมูลส่วนตัว (กลับมาใช้งานได้)
```

---

## UC4: สมาชิกถูก Inactivate

### ขั้นตอน

| # | ทำอะไร | ค่าที่ควรเห็น |
|---|---|---|
| 1 | **Admin** แก้ `mem_status` ของ MEM005 เป็น `inactive` | — |
| 2 | **MEMBER MEM005** คลิกเมนู "ข้อมูลส่วนตัว" | **ถูกปฏิเสธ** + ข้อความเดียวกับ UC3 |
| 3 | ตรวจ Rich Menu | **เปลี่ยนกลับเป็น Welcome Menu** |
| 4 | **Admin** แก้ `mem_status` กลับเป็น `active` | — |
| 5 | **Admin** แก้ `mem_eff_dt` = `2026-01-01`, `mem_exp_dt` = `2026-12-31` | — |
| 6 | **MEMBER MEM005** คลิกเมนู "ข้อมูลส่วนตัว" | **ถูกปฏิเสธ** (ต้อง activate ใหม่ — eff_dt/exp_dt ต้องตั้งค่าใหม่) |

### ⚠️ จุดสำคัญ

ถ้า admin แก้ `mem_status = inactive` แล้วแก้กลับ `active` **แต่ eff_dt/exp_dt ยังว่าง** → Gate จะปฏิเสธ (fail-safe)

**วิธีแก้:** Admin ต้องตั้งค่า `eff_dt` + `exp_dt` ด้วยเมื่อกำหนด active ใหม่

---

## UC5: สมาชิกถูกลบรายการ

### ขั้นตอน

| # | ทำอะไร | ค่าที่ควรเห็น |
|---|---|---|
| 1 | **Admin** ลบแถว MEM005 ใน Google Sheets | — |
| 2 | **MEMBER MEM005** คลิกเมนู "ข้อมูลส่วนตัว" | **ถูกปฏิเสธ** + ข้อความเดียวกับ UC3 |
| 3 | ตรวจ Rich Menu | ⚠️ **ยังเห็น Member Menu** (ไม่ auto-unlink — ไม่เจอข้อมูลสมาชิก) |
| 4 | **MEMBER MEM005** พิมพ์ `activate:E17AA699157EB2D5` (รหัสเดิม) | **alert error** "ไม่พบรหัส activate นี้ในระบบ" |

### ⚠️ จุดสำคัญ

ถูกลบ → ไม่ auto-unlink (เพราะ `findByLineUserId() = null`) → ต้อง unlink ด้วยมือ

**วิธีแก้ (ถ้าต้องการ):**
1. เพิ่ม logic ใน Gate: ถ้า `findByLineUserId() = null` + Rich Menu ยังผูกอยู่ → unlink
2. หรือ รัน `runExpiryCheck()` → จะตรวจและ unlink ให้

---

## UC6: ต่ออายุ (Admin แก้ `mem_exp_dt`)

### ขั้นตอน

| # | ทำอะไร | ค่าที่ควรเห็น |
|---|---|---|
| 1 | **Admin** แก้ `mem_exp_dt` ของ MEM005 เป็น `2027-12-31` | — |
| 2 | **MEMBER MEM005** คลิกเมนู "ข้อมูลส่วนตัว" | **Flex Card ข้อมูลส่วนตัว** (วันหมดอายุใหม่) |
| 3 | ตรวจ Flex Card | `วันหมดอายุ: 31/12/2027` |

### ผลลัพธ์ที่คาดหวัง

```
Step 2: ✅ Flex Card ข้อมูลส่วนตัว (วันหมดอายุใหม่)
```

---

## UC7: กำหนด activate (Admin แก้ข้อมูล)

### ขั้นตอน

| # | ทำอะไร | ค่าที่ควรเห็น |
|---|---|---|
| 1 | เตรียมข้อมูล: MEM006 (inactive, ยังไม่ activate) | — |
| 2 | **Admin** แก้ MEM006 ใน Google Sheets: | |
|   | `mem_status` = `active` | |
|   | `mem_eff_dt` = `2026-08-20` | |
|   | `mem_exp_dt` = `2027-08-20` | |
|   | `line_user_id` = `Uyyyyyyyyyyy` (ของ MEMBER MEM006) | |
| 3 | **MEMBER MEM006** คลิกเมนู "ข้อมูลส่วนตัว" | **Flex Card ข้อมูลส่วนตัว** |
| 4 | ตรวจ Rich Menu | ⚠️ **ยังเป็น Welcome** (ต้องผูกเมนูให้ด้วยมือ) |

### ⚠️ จุดสำคัญ

Admin กำหนด activate → ข้อมูลถูกต้อง → แต่ **Rich Menu ยังไม่ผูก**

**วิธีแก้ (ถ้าต้องการ):**
1. เพิ่ม LIFF หน้า Admin ที่มีปุ่ม "ผูกเมนูให้สมาชิก"
2. หรือ เพิ่ม API endpoint: `POST /api/admin/link-menu`

---

## สรุปผลทดสอบ

| UC | ผลลัพธ์ | Notes |
|---|---|---|
| UC3: หมดอายุ | ☐ Pass ☐ Fail | |
| UC4: Inactivate | ☐ Pass ☐ Fail | |
| UC5: ลบสมาชิก | ☐ Pass ☐ Fail | |
| UC6: ต่ออายุ | ☐ Pass ☐ Fail | |
| UC7: กำหนด activate | ☐ Pass ☐ Fail | |

---

## ปัญหาที่พบ

| # | UC | ปัญหา | สถานะ |
|---|---|---|---|
| 1 | | | ☐ Open ☐ Fixed |
| 2 | | | ☐ Open ☐ Fixed |
| 3 | | | ☐ Open ☐ Fixed |

---

## ลงนาม

| ผู้ทดสอบ | วันที่ | ผลลัพธ์รวม |
|---|---|---|
| | | |
