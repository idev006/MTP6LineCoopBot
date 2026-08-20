# Test Matrix — บันทึกผลทดสอบ Use Case สมาชิก

> **วันที่สร้าง:** 2026-08-20  
> **ผู้ทดสอบ:** _______________  
> **เวอร์ชันโค้ด:** _______________  
> **วันที่ทดสอบ:** _______________  
> **Deployment version:** _______________

---

## ข้อมูล環境

| รายการ | ค่า |
|---|---|
| Spreadsheet URL | |
| LINE Channel | |
| Webhook URL | |
| Apps Script Deployment ID | |
| richMenuIds (Welcome/Tab1-5) | |

---

## Use Case 1: Activate สมาชิก

### ข้อมูลตั้งต้น (ก่อนทดสอบ)

| รายการ | ค่าที่ควรเห็น | ค่าจริง |
|---|---|---|
| `t_member_mast` แถว MEM001 | activate_code=`ACT001`, mem_status=`inactive`, mem_eff_dt ว่าง | |
| Rich Menu ปัจจุบัน | Welcome Menu (default) | |

### TC-03: Activate สำเร็จ

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | พิมพ์ `activate:ACT001` ในแชท LINE | Flex Card ต้อนรับ: Header `🎉 ยินดีต้อนรับ`, ชื่อ `นายสมชาย ใจดี`, รหัส MEM001, `✅ Activate สำเร็จ`, วันที่ activate/หมดอายุ (+365 วัน), ปุ่ม `เข้าสู่เมนูหลัก` | | ☐ |
| 2 | ตรวจ Google Sheets แถว MEM001 | `mem_eff_dt` = เวลาปัจจุบัน, `mem_exp_dt` = +365 วัน, `mem_status` = `active`, `line_user_id` = U\<userId\> | | ☐ |
| 3 | ตรวจชีท `t_activation_log` | มีแถวใหม่ LOG-xxx, status=`success` | | ☐ |
| 4 | ตรวจ Executions log | `[Activation] Activated member: MEM001` → `Welcome flex message sent successfully` → `Member menu linked for user: U...` | | ☐ |
| 5 | ตรวจ Rich Menu ใน LINE | เปลี่ยนจาก Welcome → **Member Menu Tab 1** | | ☐ |

### TC-05: Activate ซ้ำด้วยรหัสเดิม

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | พิมพ์ `activate:ACT001` ซ้ำ | alertCard ⚠️ `รหัสถูกใช้ไปแล้ว` · ข้อความ: `รหัสนี้ถูกใช้ไปแล้ว ไม่สามารถ activate ซ้ำได้` | | ☐ |
| 2 | ตรวจ Google Sheets | ข้อมูล MEM001 ไม่เปลี่ยน (ไม่ถูก overwrite) | | ☐ |

### TC-04: Activate รหัสไม่ถูกต้อง

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | พิมพ์ `activate:WRONG99` | alertCard ❌ `ไม่พบรหัส activate` · ข้อความ: `ไม่พบรหัส activate นี้ในระบบ กรุณาตรวจสอบรหัสและลองใหม่อีกครั้ง` | | ☐ |

### TC (เพิ่ม): Activate รหัสว่าง

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | พิมพ์ `activate:` (ว่าง) | alertCard ⚠️ `กรุณาระบุรหัส` · ข้อความ: `กรุณาระบุรหัส activate เช่น activate:ABC123` | | ☐ |

---

## Use Case 2: เมนูหลัง Activate (สมาชิก Valid)

### ข้อมูลตั้งต้น (ต้องผ่าน Use Case 1 ก่อน)

| รายการ | ค่าที่ควรเห็น | ค่าจริง |
|---|---|---|
| MEM001 status | active, line_user_id ตรง | |
| Rich Menu | Member Menu 5 แท็บ | |
| ข้อมูล dummy | รัน `seedAllForTesting()` แล้ว | |

### TC-02: คลิกเมนูแล้วได้ Flex Message

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | เปิดแชท LINE | แถบ rich menu = **Member Menu 5 แท็บ** (ข้อมูลส่วนตัว / เงินกู้ & สวัสดิการ / ข่าวสารสหกรณ์ / เอกสาร & คู่มือ / ติดต่อเรา) | | ☐ |

### TC-13: เมนูการเงินแสดงข้อมูลจริง

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | คลิก **ข้อมูลส่วนตัว** | Flex Card `👤 ข้อมูลส่วนตัว` · `นายสมชาย ใจดี` · `รหัสสมาชิก: MEM001` · badge `ใช้งานอยู่` · `บทบาท: สมาชิก` · `ตำแหน่ง: กรรมการ (คะแนน 10)` · `คะแนนสมาชิก: 25` · `คะแนนความดี: 85` · `เงินกู้คงค้าง: 50,000.00 บาท` · `เงินหุ้น: 10,000.00 บาท` | | ☐ |
| 2 | คลิก **บัญชีเงินฝาก** | `💰 บัญชีเงินฝาก` · `ออมทรัพย์ (SAV-0001): 25,000.00 บาท` · รวมเงินdeposit: 25,000.00 บาท (MEM001 มี 2 บัญชี = รวม 125,000.00) | | ☐ |
| 3 | คลิก **เช็คยอดเงิน** | `🔍 เช็คยอดเงิน` · ข้อมูลจาก `t_savings_acct` | | ☐ |
| 4 | คลิก **เงินปันผล** | `💎 เงินปันผล` · ข้อมูลจาก `t_dividend` | | ☐ |
| 5 | คลิก **ทุนเรือนหุ้น** | `🏠 ทุนเรือนหุ้น` · ข้อมูลสมาชิก | | ☐ |

### TC-10: Gate — สมาชิกที่ยังไม่ Activate

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | ผู้ใช้ใหม่ (ไม่เคย activate) คลิกเมนูสมาชิก | ข้อความ: `คุณยังไม่ได้รับสิทธิ์ใช้งานเมนูนี้ กรุณาลงทะเบียนเปิดสิทธิ์ด้วยรหัส activate ก่อน เช่น activate:ABC123` | | ☐ |
| 2 | ตรวจ Rich Menu | ยังเห็น Welcome Menu (ไม่ใช่ Member Menu) | | ☐ |

### TC-11: Gate — สมาชิกหมดอายุ

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | สมาชิกที่ `mem_exp_dt` ผ่านไปแล้ว คลิกเมนูสมาชิก | ข้อความปฏิเสธ + ระบบ **unlink กลับ Welcome Menu** | | ☐ |
| 2 | ตรวจ Executions log | `[Gate] Unlinked member menu for expired/revoked user: U...` | | ☐ |

### TC-06: สลับแท็บ Rich Menu

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | คลิก Tab 2 (เงินกู้ & สวัสดิการ) | เมนูเปลี่ยน · log: `User switched to: tab_2` | | ☐ |
| 2 | คลิก Tab 3 (ข่าวสารสหกรณ์) | เมนูเปลี่ยน · log: `User switched to: tab_3` | | ☐ |
| 3 | คลิก Tab 4 (เอกสาร & คู่มือ) | เมนูเปลี่ยน · log: `User switched to: tab_4` | | ☐ |
| 4 | คลิก Tab 5 (ติดต่อเรา) | เมนูเปลี่ยน · log: `User switched to: tab_5` | | ☐ |
| 5 | คลิก Tab 1 (ข้อมูลส่วนตัว) | กลับ Tab 1 · log: `User switched to: tab_1` | | ☐ |

### TC-17: เมนูข้อมูลตอบเนื้อหาจริง

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | คลิก **สวัสดิการสมาชิก** | การ์ด 📄 header `📄 สวัสดิการสมาชิก` + เนื้อหาจริงจาก `t_content` + ปุ่มตกลง | | ☐ |
| 2 | คลิก **กองทุนฉุกเฉิน** | การ์ด 📄 เนื้อหาจริง | | ☐ |
| 3 | คลิก **คำถามที่พบบ่อย** | การ์ด 📄 เนื้อหาจริง | | ☐ |

### TC-07: เปิดเครื่องคำนวณสินเชื่อ

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | คลิก Tab 2 แล้วคลิก **เครื่องคำนวณเงินกู้** | เปิด URL loan_calculator.html · กรอกข้อมูลคำนวณได้ | | ☐ |

---

## Use Case 3: Renew / ต่ออายุ (TC-21)

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | พิมพ์ `renew` | confirmCard: `คุณต้องการต่ออายุสมาชิกหรือไม่?` + ปุ่ม `[ยกเลิก]` `[ยืนยันต่ออายุ]` · `mem_exp_dt` ยังไม่เปลี่ยน | | ☐ |
| 2 | กด **ยืนยันต่ออายุ** | alertCard ✅ `ต่ออายุสำเร็จ` · `mem_exp_dt` ขยาย +1 ปี | | ☐ |
| 3 | พิมพ์ `renew:WRONG` → กดยืนยัน | alertCard ❌ `ไม่พบรหัสต่ออายุนี้ในระบบ` | | ☐ |
| 4 | กด **ยกเลิก** | ข้อความ `ยกเลิกการต่ออายุสมาชิกแล้ว` | | ☐ |

---

## Use Case 4: Broadcast & Reminder

### TC-14: Broadcast ประกาศ

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | เพิ่มประกาศ `status='published'` + `sent_dt` ว่าง | — | | ☐ |
| 2 | รัน `runNoticeBroadcast` | สมาชิก active ได้รับ 📢 · `t_notice` mark `sent` | | ☐ |
| 3 | รันซ้ำอีกครั้ง | ไม่ส่งซ้ำ (`pending=0`) | | ☐ |

### TC-16: เตือนชำระหนี้

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | รัน `runLoanReminders` | สมาชิกได้รับ 💳 · `t_reminder_log` บันทึก | | ☐ |

---

## Use Case 5: Rich Menu Deploy

### TC-12: Menu Item ID Contract

| ขั้นตอน | ทำอะไร | ค่าที่คาดหวัง | ค่าจริง | Pass/Fail |
|---|---|---|---|---|
| 1 | รัน `main()` deploy Rich Menu | Deploy สำเร็จ 6 ตัว · ไม่มี error | | ☐ |
| 2 | ตรวจ log | `Token ถูกต้อง ✓` → `สร้าง Rich Menu 6 ตัว ✓` → `อัปโหลดภาพ ✓` → `สร้าง Alias 6 ตัว ✓` → `Deploy เสร็จสิ้น` | | ☐ |
| 3 | รัน `checkRichMenuStatus()` | 6 menus + 6 aliases + default = Welcome | | ☐ |

---

## CI Test (อัตโนมัติ)

| ชุดทดสอบ | สถานะ | วันที่รันล่าสุด |
|---|---|---|
| `node --check` ทุกไฟล์ (36 ไฟล์) | ☐ Pass ☐ Fail | |
| `ci-test.js` (34/34 ชุด) | ☐ Pass ☐ Fail | |
| `testMemberValidity` (กฎ member 10 กรณี) | ☐ Pass | |
| `testActivateViaApi` (activate ผ่าน API) | ☐ Pass | |
| `testBotUsesApi` (Bot = UI Adapter) | ☐ Pass | |
| `testFinanceCards` (Flex Card การเงิน) | ☐ Pass | |
| `testMenuContract` (item id ครบ 25) | ☐ Pass | |
| `testAlertConfirmCards` (alert + confirm) | ☐ Pass | |
| `testContentCards` (Flex Card เนื้อหา) | ☐ Pass | |
| `testApiLayer` (API 8 endpoints) | ☐ Pass | |
| `testApiMount` (mount + API key) | ☐ Pass | |

---

## สรุปผลทดสอบ

| Use Case | TC ทั้งหมด | Pass | Fail | Notes |
|---|---|---|---|---|
| UC1: Activate | 4 | | | |
| UC2: เมนูหลัง Activate | 12 | | | |
| UC3: Renew | 4 | | | |
| UC4: Broadcast & Reminder | 5 | | | |
| UC5: Rich Menu Deploy | 3 | | | |
| CI (อัตโนมัติ) | 11 | | | |
| **รวม** | **39** | | | |

---

## บันทึกปัญหา (Issues Log)

| # | วันที่ | TC | รายละเอียดปัญหา | สถานะ |
|---|---|---|---|---|
| 1 | | | | ☐ Open ☐ Fixed |
| 2 | | | | ☐ Open ☐ Fixed |
| 3 | | | | ☐ Open ☐ Fixed |

---

## ลงนาม

| ผู้ทดสอบ | วันที่ | ลายเซ็น |
|---|---|---|
| | | |
