# 🌵 Cactus News Network (CaNN) — INSMP Official Gazette

> **"The Desert Nation News by Cactus News Network"**  
> *"Accept no substitutes — if it doesn't have the thorns, it isn't Cactus News."*

A modern, responsive digital newsroom & broadsheet archive website built for **The Desert Nation** on the **INSMP** Minecraft server.

---

## 🌟 Key Features

1. **Blue & White Aesthetic with Official Logo**:
   - Deep Royal/Navy Blue (`#1C307D`), Sapphire Blue (`#1D4ED8`), and pure paper white (`#FFFFFF`) palette directly matching your official emblem.
   - Official **Cactus News Network** insignia (`assets/logo.png`) featured in the masthead and as the browser favicon.

2. **Bilingual Support (English & ภาษาไทย)**:
   - One-click language switcher (`EN 🇬🇧` | `TH 🇹🇭`) with saved preferences in `localStorage`.
   - Authentic Thai translations for news headlines, articles, categories, ticker alerts, classified ads, and officials.

3. **Quality of Life: Dark Mode 🌙**:
   - One-click toggle between **Crisp White Broadsheet** and **Midnight Blue & Electric Cyberpunk** dark mode.
   - Saves your theme preference in `localStorage` and automatically respects your system OS setting (`prefers-color-scheme`).

4. **Interactive Readers & Likes Counter**:
   - **"👁️ Readers" button**: Tracks and displays reader counts. Users can click to mark articles as read, which saves persistent state in `localStorage`!
   - **"❤️ Likes" button**: Interactive upvoting with heart animation and count tracking that persists per device.
   - Opening an article to read automatically logs a new reader.

3. **Complete Archive of Real Lore (Transcribed from Official 35-Page Records)**:
   - Over **25+ articles** spanning from May 16, 2026 to July 13, 2026.
   - Covering major events:
     - The CEO of The Daily Emerald Assassination in New Pork City
     - Lacha's removal, banned status, and exclusive interview with reporter Solitaire
     - Dry Nations Confederation 4-Pillar treaty (Desert, Mesa, and Savanna)
     - Decriminalization of Dried Kelp & Suspicious Stew (with strict Minecart DUI laws)
     - The New Seed Order (NSO) staged disbandment & rebranding to 'Overseers'
     - Overworld Cup qualifiers & Desert Nation FC roster
     - The "MAN" camel server banner vote (91% approval)
     - Mirage Tower Mega Project ($1.5 Stacks of Diamonds)

4. **Playable "Today's Sudoku" Mini-Game 🧩**:
   - True to the original newspaper format where every issue featured a Sudoku puzzle.
   - Includes real puzzles from Issue 1, Issue 7, and Issue 35 with interactive cell selection, number controls, solution validation, and reset.

5. **Desert Classifieds & Retro Ad Wall**:
   - *"Better call Wiserobucman!"* legal services
   - Mirage Tower Luxury Penthouses
   - Aero-Plains AFK passenger flight
   - Big Farm Kelp commodities
   - CaNN Reporter recruitment

6. **INSMP Community Hub**:
   - Direct integration with the [INSMP Miraheze Wiki](https://insmp.miraheze.org/wiki/Main_Page)
   - Live link to the [INSMP Official Discord](https://discord.com/invite/bwaaa)

---

## 🚀 How to Run the Website

### Option 1: Double-Click (Zero Install)
Simply double-click [`index.html`](file:///c:/Users/us/Downloads/CaNN%20Temp%20Web/index.html) in Windows File Explorer. It opens instantly in your default web browser (Chrome, Edge, Firefox, Brave).

### Option 2: Local HTTP Server (Node.js)
Open PowerShell or Command Prompt in this folder and run:
```bash
node server.js
```
Then visit **http://localhost:3000** in your browser.

---

## 📁 File Structure
* [`index.html`](file:///c:/Users/us/Downloads/CaNN%20Temp%20Web/index.html) — Main website markup, masthead, ticker, sidebar, modal, and footer.
* [`style.css`](file:///c:/Users/us/Downloads/CaNN%20Temp%20Web/style.css) — Custom Blue & White stylesheet, newspaper typography, animations, responsive grid.
* [`data.js`](file:///c:/Users/us/Downloads/CaNN%20Temp%20Web/data.js) — Full lore database, articles, Sudoku boards, and classified ads.
* [`app.js`](file:///c:/Users/us/Downloads/CaNN%20Temp%20Web/app.js) — Interactive reader & like counters, search/filter engine, modal viewer, and Sudoku puzzle logic.
* [`server.js`](file:///c:/Users/us/Downloads/CaNN%20Temp%20Web/server.js) — Lightweight local Node.js static server.
