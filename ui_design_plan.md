<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# create a ui design plan with colours defined for each page, each design style, fonts to use, icons to use, proper colour palette for each design element, grid colour, ticket background, home background. first go through the plan again, and what all features we implmeneted ,then make the ui/ux design scheme i will give to agent to implement in the app. the colours should be punchy but consistent and clear. marked tickets highlight colour should stand out and all that. the design should be minimalistic but also catchy iykwim

Now I have everything I need. Let me produce the complete UI/UX design spec.

***

# Tambola Tracker — UI/UX Design Specification

> **Agent Instructions:** This is the complete design system. Apply every token exactly as specified. Do not freestyle any colors, fonts, or spacing unless marked `(flexible)`.

***

## 🎨 Design Philosophy

**Aesthetic:** Dark-premium game UI — like a lottery terminal meets a modern SaaS dashboard. Punchy accent pops on a near-black base. Minimalistic layout, zero visual noise, but high contrast and satisfying feedback animations.

***

## 🖌️ Color System (CSS Custom Properties)

Add all of these to `:root` in `index.css`:

```css
:root {
  /* ── Backgrounds ── */
  --bg-base:      #0C0F1A;   /* Page background — deep navy-black */
  --bg-elevated:  #141826;   /* Cards, panels, sidebars */
  --bg-surface:   #1C2235;   /* Inputs, hover states, modals */
  --bg-overlay:   #252D42;   /* Borders, dividers, grid lines */

  /* ── Primary Accent (Amber/Gold) ── */
  --amber:        #F0B429;   /* Primary CTA, active toggles, badges */
  --amber-dim:    #8B6514;   /* Disabled / muted amber state */
  --amber-glow:   rgba(240, 180, 41, 0.20); /* Glow shadow for CTAs */

  /* ── Hit / Called Number (the MOST important color) ── */
  --hit:          #12F28A;   /* Bright electric green — called cell fill */
  --hit-bg:       #0A2620;   /* Dark green cell background when hit */
  --hit-glow:     rgba(18, 242, 138, 0.35); /* Cell glow on called */
  --hit-text:     #001A10;   /* Text color ON a called (green) cell */

  /* ── Win State ── */
  --win-gold:     #FFD700;
  --win-gold-bg:  rgba(255, 215, 0, 0.10);
  --win-gold-border: rgba(255, 215, 0, 0.60);

  /* ── Danger ── */
  --danger:       #FF4757;
  --danger-dim:   rgba(255, 71, 87, 0.15);

  /* ── Info / Neutral ── */
  --info:         #4ECDC4;   /* Toasts, info badges */
  --info-dim:     rgba(78, 205, 196, 0.12);

  /* ── Text ── */
  --text-primary:   #EDF0FF;  /* Main labels, headings */
  --text-secondary: #7B88A8;  /* Subtext, placeholders */
  --text-muted:     #3D4A65;  /* Disabled text, ghost elements */

  /* ── Ticket Specific ── */
  --ticket-bg:      #161C2E;  /* Ticket card background */
  --ticket-border:  #2A3555;  /* Ticket outer border */
  --ticket-grid:    #1F2840;  /* Cell border / grid line color */
  --cell-blank:     #0F1320;  /* Empty/blank cell in ticket */
  --cell-unfilled:  #1E2845;  /* Filled but NOT yet called */
  --cell-called:    var(--hit-bg); /* Called cell bg */
}
```


***

## 🔤 Typography

```
Import in index.html <head>:
https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap
```

| Role | Font | Weight | Size | Use |
| :-- | :-- | :-- | :-- | :-- |
| App name / Page title | Syne | 800 | 28–32px | "Tambola Tracker", "Match Live" |
| Section headers | Syne | 700 | 18–22px | "Your Tickets", "Configure Rules" |
| Subheadings / Labels | Inter | 600 | 14–16px | Rule names, toggle labels |
| Body / Descriptions | Inter | 400 | 13–14px | Descriptions, helper text |
| Ticket numbers | Space Mono | 700 | 13–15px | Numbers inside ticket cells |
| Called numbers board | Space Mono | 400 | 11–12px | The 1–90 board grid |
| Called number (hit state) | Space Mono | 700 | 11–12px | Same board, called state |
| CTA Buttons | Inter | 600 | 14px | "Start Match", "Save Ticket" |
| Number input (caller) | Space Mono | 800 | 48–56px | The big number entry display |


***

## 📐 Spacing \& Shape System

```
Base unit: 4px

Spacing scale: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64px

Border radius:
  --radius-sm:   6px    (cells, tags, small chips)
  --radius-md:   10px   (buttons, inputs)
  --radius-lg:   14px   (cards, ticket cards)
  --radius-xl:   20px   (modals, bottom sheets)

Borders:
  Default card border: 1px solid var(--bg-overlay)
  Focused input: 1px solid var(--amber)
  Called cell glow border: 1px solid var(--hit)
  Win ticket border: 2px solid var(--win-gold)
```


***

## 🔣 Icons

**Library:** `lucide-react` (already in plan, zero additional install)


| Element | Icon | Notes |
| :-- | :-- | :-- |
| Add ticket | `PlusCircle` | FAB on Tickets page |
| Delete ticket | `Trash2` | Red on hover |
| Edit ticket | `Pencil` | Secondary action |
| Start match | `Play` | Inside CTA button |
| Exit match | `LogOut` | Top-right, red |
| Undo last number | `Undo2` | Below caller |
| Win / alert | `Trophy` | In win toast \& badge |
| Corners rule | `LayoutGrid` | Rule icon |
| Full house rule | `Star` | Rule icon |
| Row rules | `AlignJustify` | Rule icon |
| Early 5 rule | `Zap` | Rule icon |
| Camera / OCR | `Camera` | Upload button |
| File upload | `Upload` | Alternative upload |
| Ticket count | `Ticket` | Badge / header |
| Settings / rules | `SlidersHorizontal` | Config panel header |
| Number called confirm | `CheckCircle2` | Inline call feedback |


***

## 📄 Page-by-Page Design


***

### Page 1 — Home Page (`/`)

**Background:** `var(--bg-base)` `#0C0F1A`
**Purpose:** Configure the match before it starts.

```
LAYOUT:
  - Centered max-width container: 900px, padding 24px
  - Two-column on desktop (lg:grid-cols-2), stacked on mobile

LEFT COLUMN — Rules Panel:
  Header: "Configure Rules" [SlidersHorizontal icon, --amber colored]
  Font: Syne 700, 20px, --text-primary
  
  Card background: --bg-elevated (#141826)
  Card border: 1px solid --bg-overlay
  Card radius: --radius-lg (14px)
  Card padding: 20px

  Each Rule Row:
    [Icon 16px --amber] [Rule name Inter 600 14px --text-primary]
    [Alias chip: "aka Hindustan" Inter 400 11px --text-secondary background --bg-surface rounded-full px-2]
    [Toggle switch at right →]
    
  Toggle Switch styling:
    OFF state: track bg --bg-overlay, thumb --text-muted
    ON state: track bg --amber-dim, thumb --amber
    
  Full House multiplier (visible only when Full House toggle is ON):
    Label: "How many Full Houses?" Inter 500 13px --text-secondary
    Spinner: [-] [^2] [+] → bg --bg-surface, border --bg-overlay, 
             value in Space Mono 700 --amber

RIGHT COLUMN — Ticket Selection:
  Header: "Select Tickets" [Ticket icon --amber]
  
  Ticket mini-cards in a 2-col grid:
    bg: --ticket-bg
    border: 1px solid --ticket-border
    radius: --radius-md
    padding: 12px
    Label: Inter 600 13px --text-primary
    Checkbox: custom styled, checked = --amber fill
  
  "Select All" link: Inter 500 12px --amber underline
  Count chip: "3 of 5 selected" bg --amber-glow --amber text, radius-full

BOTTOM — Start Match CTA:
  Full-width button, max-width 400px, centered
  bg: --amber (#F0B429)
  text: #0C0F1A (dark text on amber for contrast)
  height: 52px, radius: --radius-md
  font: Inter 700 16px
  Left icon: Play (dark colored)
  Hover: bg brightness-110, box-shadow 0 0 20px var(--amber-glow)
  Disabled state: bg --amber-dim, text --text-muted, no shadow, cursor-not-allowed
```


***

### Page 2 — Tickets Page (`/tickets`)

**Background:** `var(--bg-base)` `#0C0F1A`

```
LAYOUT:
  - Full width with 24px side padding
  - Header bar at top
  - Responsive ticket card grid below

HEADER BAR:
  Left: "My Tickets" Syne 800 28px --text-primary
  Right: [+ Add Ticket] button
    bg: --amber, text: #0C0F1A, icon: PlusCircle
    radius: --radius-md, px-4 py-2

TICKET GRID:
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4

TICKET CARD (compact preview):
  bg: --ticket-bg (#161C2E)
  border: 1px solid --ticket-border (#2A3555)
  radius: --radius-lg (14px)
  padding: 16px

  TOP: [label Inter 600 14px --text-primary] [Edit icon] [Delete icon]
  
  MINI GRID (read-only 3×9):
    Cell size: 28px × 28px
    Blank cell bg: --cell-blank (#0F1320)
    Number cell bg: --cell-unfilled (#1E2845)
    Number cell text: Space Mono 700 12px --text-primary
    Cell border: 0.5px solid --ticket-grid
    Cell radius: --radius-sm (6px)
    Gap: 2px

EMPTY STATE:
  Centered illustration placeholder
  "No tickets yet" Syne 700 20px --text-secondary
  "Add your first ticket to get started" Inter 400 14px --text-muted
  [+ Add Ticket] button below, --amber styled
```


***

### Modal — Add Ticket (`AddTicketModal`)

**Overlay:** `rgba(0,0,0,0.75)` backdrop-blur-sm

```
MODAL CARD:
  bg: --bg-elevated (#141826)
  border: 1px solid --bg-overlay
  radius: --radius-xl (20px)
  width: min(600px, 95vw)
  padding: 28px
  max-height: 90vh, overflow-y: auto

HEADER:
  "Add Ticket" Syne 700 22px --text-primary
  Close X button top-right: --text-secondary, hover --danger

TAB SWITCHER (Manual / OCR):
  Two tabs, pill-style container bg --bg-surface rounded-full p-1
  Active tab: bg --amber, text #0C0F1A, Inter 600 13px, radius-full
  Inactive tab: bg transparent, text --text-secondary

── Manual Tab ──

  Label input:
    Label text: "Ticket Name" Inter 500 13px --text-secondary
    Input: bg --bg-surface, border 1px --bg-overlay
    focus: border --amber, box-shadow 0 0 0 3px --amber-glow
    text: Inter 500 14px --text-primary, placeholder --text-muted
    radius: --radius-md, height 42px

  GRID (3 rows × 9 columns):
    Container bg: --ticket-bg
    Border: 1px solid --ticket-border
    Radius: --radius-md
    Padding: 12px
    Gap between cells: 3px
    
    Cell (input box):
      Size: 44px × 44px (desktop), 36px × 36px (mobile)
      Blank/empty cell bg: --cell-blank
      Type="number" min=1 max=90
      Typed-value cell bg: --cell-unfilled
      Text: Space Mono 700 14px --text-primary, text-center
      border: 1px solid --ticket-grid
      radius: --radius-sm
      focus: border --amber, bg rgba(240,180,41,0.08)

    VALIDATION STATES:
      Valid cell: no change
      Wrong range: border --danger, bg rgba(255,71,87,0.10), 
                   shake animation on blur
      Duplicate: border --info, bg rgba(78,205,196,0.08)

    Column range labels above grid (optional row):
      "1-9 | 10-19 | ..." Inter 400 10px --text-muted

  VALIDATION SUMMARY BAR (below grid):
    Pill: "Row 1: 5/5 ✓" bg --hit-bg text --hit | "Row 2: 3/5" bg --bg-surface text --text-secondary
    Shows live per-row count

── OCR Tab ──

  Upload zone:
    Dashed border 2px dashed --bg-overlay
    Hover: dashed --amber
    bg: --bg-surface, radius --radius-lg
    Height: 160px
    Center: [Camera icon 32px --text-muted] "Drop image or click to upload" Inter 400 14px --text-secondary
    On drag-over: bg --amber-glow border-amber
    Accept: image/*

  Image preview: max-height 200px, radius --radius-md, object-fit contain
  
  "Processing..." state:
    Spinning Loader icon --amber, "Running OCR..." Inter 400 13px --text-secondary

  After OCR → same grid as Manual tab, pre-filled, editable
  Warning banner if <15 or >15 numbers found:
    bg --danger-dim, text --danger, border-l-2 --danger
    Icon: AlertTriangle 14px

FOOTER:
  [Cancel] ghost button — text --text-secondary hover --danger
  [Save Ticket] primary button — bg --amber, disabled if invalid
```


***

### Page 3 — Match Page (`/match`)

**Background:** `var(--bg-base)` `#0C0F1A`
**This is the most important screen — highest craft required.**

```
LAYOUT:
  Fixed header bar (60px)
  Below: two-panel flex layout — left panel fixed 320px, right panel flex-1
  On mobile: top panel (caller) + bottom scrollable (tickets)

── HEADER BAR ──
  bg: --bg-elevated, border-bottom 1px --bg-overlay, height 60px
  Left: [Ticket icon --amber] "Match Live" Syne 700 18px --text-primary
         + pill: "14 called" bg --amber-glow text --amber Space Mono 600 12px
  Right: [LogOut icon red] "Exit" Inter 600 13px --danger
         hover: bg --danger-dim rounded-md

── LEFT PANEL (Number Caller) ──
  bg: --bg-elevated
  border-right: 1px solid --bg-overlay
  padding: 20px
  width: 320px (fixed)

  BIG NUMBER DISPLAY:
    Input type="number" min=1 max=90
    bg: --bg-surface, border 2px solid --bg-overlay
    focus: border --amber, box-shadow 0 0 0 4px --amber-glow
    text: Space Mono 800 56px --amber, text-center
    radius: --radius-lg, height: 80px
    placeholder: "--" in --text-muted

  [Call Number] button:
    Full width, height 48px, bg --amber text #0C0F1A
    Inter 700 15px, radius --radius-md
    Left icon: CheckCircle2
    Press Enter = same as clicking
    Hover: brightness-110 + glow shadow
    
  [Undo] button below:
    Full width, height 36px, bg transparent
    border 1px solid --bg-overlay text --text-secondary
    Inter 500 13px, icon Undo2 left
    hover: border --danger text --danger bg --danger-dim

  DIVIDER: 1px solid --bg-overlay, my-16px

  CALLED NUMBERS BOARD:
    Label: "Called Numbers" Inter 600 13px --text-secondary mb-8px
    
    Layout: 9 columns × 10 rows = 90 cells
    Each column = decade (1-9, 10-19, ..., 80-90)
    
    Cell sizing: 26px × 26px, gap: 3px
    
    UNCALLED cell:
      bg: --bg-surface, text --text-muted
      Space Mono 400 11px
      radius: --radius-sm
    
    CALLED cell:
      bg: --hit (#12F28A)
      text: --hit-text (#001A10)
      Space Mono 700 11px
      box-shadow: 0 0 6px var(--hit-glow)
      scale: 1.05 (slight pop on transition)
      radius: --radius-sm
    
    Transition on call: 
      keyframes: scale 0 → 1.15 → 1.05 over 300ms
      background color transition 150ms

── RIGHT PANEL (Ticket Grid Area) ──
  flex-1, overflow-y: auto, padding: 16px

  TOOLBAR (sticky top):
    bg: rgba(12,15,26,0.85) backdrop-blur-sm
    border-bottom 1px solid --bg-overlay, py-10px mb-12px
    
    Left: "5 Tickets" Inter 500 13px --text-secondary
    Right: Size selector pill group:
      [Small] [Medium] [Large]
      Active: bg --bg-surface text --amber Inter 600 12px
      Inactive: text --text-muted
      Container: bg --bg-elevated border --bg-overlay rounded-full

  TICKET CARDS RESPONSIVE GRID:
    Small → grid-cols-3 (compact view)
    Medium → grid-cols-2
    Large → grid-cols-1

  ── TICKET CARD ──
  
  DEFAULT STATE (no wins yet):
    bg: --ticket-bg (#161C2E)
    border: 1px solid --ticket-border (#2A3555)
    radius: --radius-lg (14px)
    padding: 12px

  WIN STATE (any rule claimed):
    border: 2px solid var(--win-gold)
    box-shadow: 0 0 20px var(--win-gold-border)
    bg: linear-gradient(135deg, --ticket-bg, rgba(255,215,0,0.05))

  CARD HEADER:
    [Ticket label Inter 600 13px --text-primary]
    [Win badges → right side]
    Win badge: bg --win-gold-bg text --win-gold border 1px --win-gold-border
               Inter 600 10px, radius-full, px-2 py-0.5
               Trophy icon 10px inline

  TICKET GRID (3×9):
    gap: 2px (desktop large), 1.5px (medium/small)
    
    BLANK CELL:
      bg: --cell-blank (#0F1320)
      border: 0.5px solid --ticket-grid
      radius: --radius-sm
      no text, slightly transparent feel
      
    UNFILLED NUMBER CELL (not yet called):
      bg: --cell-unfilled (#1E2845)
      text: Space Mono 700 11-13px (scales with card size) --text-primary
      border: 0.5px solid --ticket-grid
      radius: --radius-sm
      
    CALLED (HIT) NUMBER CELL:
      bg: --hit-bg (#0A2620)
      text: --hit (#12F28A)
      font: Space Mono 700
      border: 1px solid var(--hit)
      box-shadow: 0 0 8px var(--hit-glow), inset 0 0 6px rgba(18,242,138,0.15)
      border-radius: --radius-sm
      Add ✓ or a small dot overlay in top-right corner (2px × 2px --hit dot)
      
      Transition when called: 
        animation: cellHit 0.4s ease-out
        @keyframes cellHit:
          0%   { transform: scale(1);    background: --cell-unfilled }
          40%  { transform: scale(1.18); background: --hit; }
          100% { transform: scale(1);    background: --hit-bg }
```


***

### Component — Win Alert Toast

```
react-hot-toast custom component:

Container:
  bg: linear-gradient(135deg, #1C2A1E, #1A2A1A)
  border: 1.5px solid --win-gold
  box-shadow: 0 8px 32px rgba(255,215,0,0.25)
  radius: --radius-lg (14px)
  padding: 16px 20px
  min-width: 280px

LEFT ICON:
  Trophy lucide icon, 28px, --win-gold, with pulse animation

CONTENT:
  Line 1: ticket label — Syne 700 16px --text-primary
  Line 2: rule name — Inter 600 14px --win-gold
  Line 3: "🎉 Claimed!" — Inter 400 12px --text-secondary

Position: top-center
Duration: 6000ms
Dismiss X: top-right, --text-muted hover --text-primary

Multiple wins at once → stack vertically with 8px gap
```


***

### Modal — Exit Confirmation

```
Overlay: rgba(0,0,0,0.80) backdrop-blur-sm

Card:
  bg: --bg-elevated
  border: 1px solid --danger-dim
  radius: --radius-xl, padding 28px
  width: 360px, centered

Icon: LogOut 32px --danger, mb-12px
Title: "Exit Match?" Syne 700 20px --text-primary
Body: "All progress will be lost." Inter 400 14px --text-secondary

Buttons (mt-24px, flex gap-3):
  [Cancel] — bg --bg-surface, text --text-primary, Inter 600, full width, h-44px
  [Exit Match] — bg --danger, text white, Inter 700, full width, h-44px
               hover: brightness-110
```


***

## 🌀 Animation Summary

```css
/* Called number board cell pop */
@keyframes numberPop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.15); }
  100% { transform: scale(1.05); }
}

/* Ticket cell hit highlight */
@keyframes cellHit {
  0%   { transform: scale(1); background-color: var(--cell-unfilled); }
  40%  { transform: scale(1.18); background-color: var(--hit); }
  100% { transform: scale(1); background-color: var(--hit-bg); }
}

/* Win ticket border pulse */
@keyframes winPulse {
  0%, 100% { box-shadow: 0 0 12px var(--win-gold-border); }
  50%       { box-shadow: 0 0 28px var(--win-gold-border), 0 0 48px rgba(255,215,0,0.15); }
}

/* Toast entrance */
@keyframes toastIn {
  from { opacity: 0; transform: translateY(-20px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```


***

## 🗃️ Complete Color Quick-Reference Card

| Token | Hex | Used For |
| :-- | :-- | :-- |
| `--bg-base` | `#0C0F1A` | All page backgrounds |
| `--bg-elevated` | `#141826` | Cards, left panel, modals |
| `--bg-surface` | `#1C2235` | Inputs, hover, board cells |
| `--bg-overlay` | `#252D42` | Borders, dividers, grid lines |
| `--amber` | `#F0B429` | Primary CTA, active states, icons |
| `--amber-dim` | `#8B6514` | Disabled CTA, muted amber |
| `--hit` | `#12F28A` | Called cell text + board cell bg |
| `--hit-bg` | `#0A2620` | Called cell background |
| `--hit-glow` | `rgba(18,242,138,0.35)` | Called cell box-shadow |
| `--win-gold` | `#FFD700` | Win border, badges, trophy icon |
| `--danger` | `#FF4757` | Exit button, delete, errors |
| `--info` | `#4ECDC4` | Info toasts, duplicate warning |
| `--ticket-bg` | `#161C2E` | Ticket card background |
| `--ticket-border` | `#2A3555` | Ticket card outer border |
| `--ticket-grid` | `#1F2840` | Inner cell borders |
| `--cell-blank` | `#0F1320` | Empty/blank cells |
| `--cell-unfilled` | `#1E2845` | Number cell, not yet called |
| `--text-primary` | `#EDF0FF` | All main text |
| `--text-secondary` | `#7B88A8` | Labels, descriptions |
| `--text-muted` | `#3D4A65` | Disabled, placeholders |


***

The key design decisions here are: the electric green `#12F28A` for called cells creates an unmistakable visual diff against the dark navy base, the amber `#F0B429` anchors all interactive elements with a warm lottery-esque energy, and `Syne + Inter + Space Mono` gives you a three-tier type system — expressive headers, readable UI, and precision numerals for the grid.[^1][^2][^3]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://colorhero.io/blog/dark-mode-color-palettes-2025

[^2]: https://www.linkedin.com/pulse/best-google-font-pairings-ui-design-2025-matt-medley-fdwme

[^3]: https://colorswall.com/palette/5661

[^4]: https://octet.design/colors/user-interfaces/game-ui-design/

[^5]: https://octet.design/colors/user-interfaces/dark-ui-design/

[^6]: https://www.figma.com/resource-library/color-combinations/

[^7]: https://www.wildnetedge.com/blogs/dark-mode-ui-essential-tips-for-color-palettes-and-accessibility

[^8]: https://www.thebrief.ai/blog/google-font-pairings/

[^9]: https://colorswall.com/palette/255622

[^10]: https://www.leadpages.com/blog/best-google-fonts

[^11]: https://www.color-hex.com/color-palette/1064645

[^12]: https://orangeblueweb.com/best-google-fonts-in-2025-20-modern-serif-sans-serif-combos-that-convert-visitors-into-customers/

[^13]: https://dribbble.com/search/dark-game-ui

[^14]: https://medium.muz.li/15-google-font-pairings-every-designer-should-save-6468e3534a0e

[^15]: https://gamecontentshopper.com/asset/all-assets/clean-minimalist-gui-pack-12/2025/11/19/

