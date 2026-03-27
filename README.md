# 🎰 Tambola Tracker v1.2 — Dark Premium

[![React 19](https://img.shields.io/badge/React-19-%2361DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8-%23646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS v3](https://img.shields.io/badge/TailwindCSS-v3-%2338B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A professional-grade **Tambola (Housie) Companion** designed for the modern lottery enthusiast. Featuring a **Dark-Premium Lottery Terminal** aesthetic, a robust **backtracking OCR engine**, and multi-claim rule tracking.

---

## ✨ Features

### 🎴 Advanced Ticket Management
- **Intelligent OCR Parsing**: Scan physical tickets using your camera. Our custom **Tesseract.js v7** pipeline features a recursive backtracking line-splitter to accurately extract numbers from cluttered ticket grids.
- **Manual Grid Entry**: Precise manual entry with strict column validation (e.g., Col 1 strictly 1-9, Col 2 strictly 10-19, etc.).
- **Local Persistence**: All tickets and match configurations are stored locally via **IndexedDB** — no cloud, no latency.

### 🏆 Multi-Claim Rule Engine
- **Configurable Multipliers**: Support for multiple claims per rule (e.g., Any Row up to 10 claims).
- **Comprehensive Rule Set**: 
  - `Early 5`, `Corners`, `Star`, `Hindustan`, `Pakistan`
  - `Top/Middle/Bottom Row`, `Any Row`
  - `Full/Half House`
- **Real-time Win Detection**: Instant calculation of winners across all active tickets as numbers are called.

### 🎨 Dark-Premium Aesthetic
- **Lottery Terminal Design**: High-contrast navy-black surfaces with amber CTAs.
- **Dynamic Feedback**: Micro-animations for called numbers, hit states, and winning pulses.
- **Typography Optimized**: Uses `Syne` for bold headers and `Space Mono` for grid numerals.

---

## 🛠️ Tech Stack

- **Core**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **State**: [Zustand](https://zustand-demo.pmnd.rs/) (Synchronous match loop & persistence hydration)
- **Database**: [idb](https://www.npmjs.com/package/idb) (IndexedDB wrapper)
- **Vision**: [Tesseract.js v7](https://tesseract.projectnaptha.com/) (Custom preprocessing & backtracking parser)
- **Styling**: [TailwindCSS v3](https://tailwindcss.com/) + CSS Custom Properties for a scalable design system
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/kunalmttl/Tambola-Tracker.git
   cd Tambola-Tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production
```bash
npm run build
```

---

## 🧠 Architecture Overview

### The OCR Engine (`ocr.js`)
Unlike standard OCR implementations, Tambola Tracker uses a **multi-stage vision pipeline**:
1. **Preprocessing**: Grayscale conversion → 1.8x contrast boost → Binary thresholding (140) to isolate digits from paper texture.
2. **PSM 11 Sparse Text Detection**: Specifically tuned for grid-based sparse data.
3. **Recursive Backtracking Splitter**: Intelligently splits digit clusters (like `222425572`) into the most probable 5-number sequence for each ticket row, effectively ignoring noise and grid artifacts.

### Match Logic (`useMatchStore`)
A centralized store manages the `calledNumbers` and evaluates all active `tickets` against the enabled `rules` on every state change. This ensures zero-latency win detection even with hundreds of tickets.

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---

Created with ❤️ by **Kunal Mittal** & **Antigravity AI**.
