# Mobile Legends: Bang Bang (MLBB) Counter-Pick & Draft Strategy Assistant

A high-performance, algorithmic counter-pick engine and draft intelligence suite for **Mobile Legends: Bang Bang** (Season 35 / Mythic Glory Meta).

---

## 🌟 Key Features

1. **Complete 133 Heroes Dataset**:
   - Covers all 124 official Moonton MAPI heroes (Miya to Chip) + the 9 next-generation roster additions (Zhuxin, Suyou, Lukas, Kalea, Zetian, Obsidia, Sora, Hirara, Ken).
   - High-resolution transparent portraits for all 133 heroes (`assets/heroes/`).
   - Detailed mechanical breakdown of all 4 abilities: Passive, Skill 1, Skill 2, and Ultimate with tactical counter tips.

2. **1v1 Lane Counter Matrix**:
   - Real-time matchup simulation against any lane opponent.
   - S-Tier hard counter suggestions, power spike timelines (Early / Mid / Late), and priority defensive/offensive item rush recommendations.

3. **Hero Pro Builds Workshop**:
   - Complete 6-item pro build for every hero.
   - Situational counter item swaps (anti-heal via *Lifebane*, anti-burst via *Athena's Shield*, anti-tank via *Demon Hunter Sword* / *Malefic Roar*).
   - Primary emblem builds and battle spell recommendations.

4. **5v5 Team Draft Simulator**:
   - Build complete 5-man team compositions for both Enemy and Ally squads.
   - Live threat analysis engine measuring Physical Burst, Magic Burst, Hard CC, Mobility, and Frontline Sustain.
   - Automatic role-based MVP counter-pick suggestions for unpicked slots.

5. **Equipment & Passives Codex**:
   - Comprehensive catalog of MLBB defense, attack, magic, and movement equipment.
   - Deep-dive explanations of passives like *Lifebane*, *Deter*, *Armor Buster*, *Spellbreaker*, and cooldowns.

6. **Omni-Search Engine**:
   - Dedicated search buttons (`🔍 Search`) and instant <kbd>Enter</kbd> key shortcuts across Home, Duel, Builds, Draft, and Codex panels.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)

### Running Locally

```bash
# 1. Start the local server
node server.js

# 2. Or on Windows, double-click:
start.bat
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Rebuilding Standalone Bundle
If you modify `data.js`, `counterEngine.js`, or `app.js`:

```bash
node build.js
```

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: Vanilla HTML5, CSS3 (Cyber-theme glassmorphism, responsive CSS Grid/Flexbox), and Vanilla JavaScript (ES modules).
- **Engine**: Pure algorithmic scoring matrix (`counterEngine.js`) calculating synergies, hard counters, and power spikes.
- **Audio**: Web Audio Synthesizer API (`audio.js`) for futuristic UI micro-sound feedback.
- **Backend / Dev Server**: Lightweight native Node.js HTTP server (`server.js`).
