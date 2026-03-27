# Project Context

## Overview
A comprehensive Tambola (Housie) Tracker web app. Users manually define tickets (or scan via OCR), configure a wide array of rule multipliers, track a live match, automatically compute multi-ticket rule wins, and persist configurations to IndexedDB.

## Development Rules
1. **Incremental Phases:** The user provides phase-wise instructions.
2. **Context Persistence:** Maintain `context.md` and `project_state.md` for AI context continuity.
3. **Verification Stage:** After every major change, verify on `localhost` before proceeding.
4. Whenever stuck with an error, always search online documentation for that particular library/error.

## Tech Stack
- **Framework:** React 19 via Vite 8.
- **Styling:** TailwindCSS v3 with dark-premium design system (CSS custom properties in `index.css`, color tokens in `tailwind.config.js`).
- **Design System:** Dark-premium lottery-terminal aesthetic — navy-black base (`#0C0F1A`), elevated cards (`#141826`), amber CTAs (`#F0B429`), electric green hits (`#12F28A`), gold win states (`#FFD700`).
- **Typography:** Syne (headings 700-800), Inter (body 400-600), Space Mono (grid numerals 700).
- **State Management:** Zustand (ephemeral match state: `wins`, `calledNumbers`, rule toggles).
- **Database/Persistence:** `idb` library (IndexedDB) for `TICKET` objects and `matchConfig` (last-enabled rules).
- **Tooling:** `lucide-react` (icons), `react-hot-toast` (toasts), `react-router-dom` (routing), `tesseract.js` (OCR - v7 with custom backtracking splitter).

## Architecture Details
- **Core Entities:**
  - `TICKET`: `{ id: 'uuid', label: 'Ticket #N', grid: number[3][9], createdAt: timestamp }` — exactly 15 numbers (1-90 with strict column placement).
  - `RULE`: Defines win mechanics (`EARLY_5`, `TOP_ROW`, `MIDDLE_ROW`, `BOTTOM_ROW`, `FULL_HOUSE`, `CORNERS`, `HINDUSTAN`, `PAKISTAN`, `ANY_ROW`, `HALF_HOUSE`, `STAR`). Supports multi-claim via `multiplier` (ANY_ROW up to 10, others up to 5).
- **OCR Engine (`ocr.js`):**
  - Uses Tesseract.js v7 with a custom pre-processing pipeline (grayscale, contrast boost, binary threshold).
  - Implements a recursive backtracking line-splitter to accurately handle multi-digit clusters (e.g., `222425572` → `2, 22, 42, 55, 72`) commonly found on printed tickets.

## Key Animations
- `numberPop` — bounce on called number (board cell)
- `cellHit` — scale+color flash on ticket cell
- `winPulse` — gold glow infinite pulse on winning ticket
- `toastIn` — slide-down + scale for win toast
