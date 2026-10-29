# 🌵 Cactus News Network (CaNN) — Web Manual / คู่มือการใช้งานเว็บไซต์

**Bilingual English & ภาษาไทย** • The Desert Nation News • INSMP Community

---

## 1. Quick Start / วิธีเปิดเข้าใช้งานเว็บไซต์
* **Open Locally:** Go to `C:\Users\us\Downloads\CaNN Temp Web` and double-click **`index.html`**. Opens immediately in any browser.
* **การเปิดใช้งาน:** ไปที่โฟลเดอร์ `C:\Users\us\Downloads\CaNN Temp Web` แล้วดับเบิลคลิกไฟล์ **`index.html`**
* **Optional Node Server:** Run `node server.js` and visit `http://localhost:3000`.

---

## 2. Top Bar & Language / แถบด้านบนและการเปลี่ยนภาษา
* **Language Switcher (ปุ่มสลับภาษา):** Click **`EN 🇬🇧`** or **`TH 🇹🇭`** in the top-right bar. Instantly switches all interface labels, articles, headlines, categories, and ads between English and Thai. Saves your preference automatically.
* **Dark Mode (โหมดมืด / สว่าง):** Click **`🌙 Dark`** / **`☀️ Light`** (or **`🌙 โหมดมืด`** / **`☀️ โหมดสว่าง`**) to toggle between clean broadsheet white and midnight electric blue dark theme.
* **Breaking Ticker (ข่าวด่วน):** Real-time scrolling ticker across the top. Hover with your mouse to pause.
* **Community Links:** Direct links to the **INSMP Miraheze Wiki** and **INSMP Discord server**.

---

## 3. Navigation & Dual View / เมนูนำทางและมุมมอง 2 แบบ
* **Categories:** Frontpage (หน้าแรก), Breaking News (ข่าวด่วน), Geopolitics & Factions (ภูมิรัฐศาสตร์), Politics & Law (การเมืองและกฎหมาย), Special Interviews (บทสัมภาษณ์พิเศษ).
* **Dual View Switcher:** Click **`📜 Newspaper Sheet View`** (โหมดหน้าหนังสือพิมพ์) to convert the feed into an authentic 2-column vintage broadsheet! Click again to return to **`📰 Digital Feed View`**.

---

## 4. Interactive Readers & Likes / ระบบนับผู้อ่านและถูกใจ
* **👁️ Readers Counter:** Shows verified reader count. Click to mark as read (`✓ Read`). Opening any story in full view also counts as an official read.
* **❤️ Likes Counter:** Click to upvote stories with an animated heart. Stored per device in `localStorage`.

---

## 5. Playable "Today's Sudoku" / วิธีเล่นเกมซูโดกุ
1. Choose puzzle difficulty from the dropdown (Casual / Challenging / Master).
2. Click any empty cell in the 9x9 board.
3. Use the numpad (1–9) or physical keyboard to enter numbers.
4. Click `✓ Check Grid` (ตรวจคำตอบ) to validate your board.
5. Click `↺ Reset` (เริ่มใหม่) to clear your entries.

---

## 6. How to Add New Articles / วิธีเพิ่มบทความใหม่
Open `data.js` in any text editor and add a new entry to the `CANN_DATA.articles` array with both English and Thai fields (`title`, `title_th`, `lead`, `lead_th`, `content`, `content_th`).
