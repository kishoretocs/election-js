# Tamil Nadu Election Results Dashboard - Design Guidelines

## Design Approach: Data-Focused Dashboard System
**Selected Framework:** Material Design principles adapted for data visualization dashboards, inspired by modern analytics platforms (Google Analytics, Tableau, Linear)

**Core Principle:** Information clarity with hierarchical data presentation, optimized for rapid data scanning and real-time updates.

---

## Typography System

**Font Family:** Inter (Google Fonts) for exceptional readability in data contexts
- **Headers:** 600 weight, sizes 32px (h1), 24px (h2), 20px (h3)
- **Data Labels:** 500 weight, 14px-16px
- **Vote Counts:** 700 weight, 24px-32px (large, prominent numbers)
- **Body Text:** 400 weight, 14px
- **Small Details:** 400 weight, 12px (timestamps, meta info)

---

## Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, py-8)
**Container Structure:**
- Main dashboard: Full viewport with fixed header (h-screen layout)
- Map area: 60% width on desktop, full width on mobile
- Data panel: 40% width on desktop, slides up on mobile
- Consistent padding: p-6 for cards, p-8 for major sections

---

## Component Library

### 1. Navigation Header
- Fixed top bar with "Election Results" title (left-aligned, bold)
- Live update indicator (pulsing dot + "Live" text)
- Reporter login button (top-right corner)
- Breadcrumb trail showing navigation path (District > Constituency)

### 2. Interactive Map Module
**District Map View:**
- SVG-based Tamil Nadu map with clearly labeled districts
- Hover state: subtle elevation with district details tooltip
- Click state: zoom transition to constituency view
- Legend showing party dominance by district

**Constituency Map View:**
- Detailed constituency boundaries within selected district
- Assembly constituency names embedded on map
- Back button to return to district view
- Active constituency highlighted

### 3. Vote Status Dashboard (appears on constituency click)

**Layout:** Split-panel design

**Left Panel - Round-wise Status:**
- Timeline visualization showing vote counting rounds (1, 2, 3...)
- Horizontal bar chart per round showing party vote distribution
- Running total displayed prominently
- Latest round highlighted with accent border

**Right Panel - Area-wise Status:**
- Dropdown to switch between Taluk view and Booth view
- Data table with columns: Area Name, DMK, AIADMK, TVK, Naam Tamilar, Others, Total
- Sortable columns
- Mini bar chart in each row for quick visual comparison
- Sticky header on scroll

### 4. Party Vote Cards (appears in both panels)
Each party gets a card with:
- Party logo/icon placeholder (32px circular)
- Party name
- Large vote count (32px, bold)
- Vote percentage
- Trend indicator (↑/↓ with change)
- Progress bar showing percentage of total votes

Card layout: Grid of 5 cards (DMK, AIADMK, TVK, Naam Tamilar, Others)

### 5. Reporter Dashboard (separate authenticated view)
**Login Screen:**
- Centered card (max-w-md)
- Logo at top
- Input fields: Reporter ID, Password
- "Login" button (full-width)
- Simple, focused design

**Vote Entry Interface:**
- Dropdown selectors: District, Constituency, Round, Area/Booth
- Vote input grid: Party name in column 1, numeric input in column 2
- Running total display
- "Submit Votes" button (prominent, bottom-right)
- Success confirmation toast notification

### 6. Real-time Update System
- Toast notifications for new vote submissions (bottom-right)
- Smooth number transitions when counts update
- "Updated X seconds ago" timestamp
- No page refresh required

---

## Data Visualization Patterns

**Vote Distribution:**
- Horizontal stacked bar charts for multi-party comparison
- Use consistent party-coded segments
- Always show absolute numbers + percentages

**Trend Indicators:**
- Arrow icons with color coding for increase/decrease
- Numerical change displayed alongside

**Map Interactivity:**
- Tooltip on hover: District/Constituency name + leading party
- Click ripple effect on selection
- Smooth zoom transitions (300ms)

---

## Responsive Behavior

**Desktop (1024px+):**
- Side-by-side map and data panels
- All vote cards visible in single row

**Tablet (768px-1023px):**
- Stacked layout: Map on top, data below
- Vote cards in 2-3 column grid

**Mobile (<768px):**
- Single column layout
- Collapsible map section
- Vote cards stack vertically
- Data tables scroll horizontally

---

## Images

**Hero/Header Background:** NOT APPLICABLE - Dashboard interface prioritizes data over hero imagery

**Map Graphics:**
- High-quality SVG maps of Tamil Nadu (district and constituency levels)
- Clean, simplified boundaries with clear labels
- Use icon placeholders for party logos (will be replaced with actual logos)

---

## Critical UX Principles

1. **Data First:** Every element serves the purpose of data clarity
2. **Instant Feedback:** All interactions provide immediate visual response
3. **Hierarchy:** Most important data (vote counts) are largest and boldest
4. **Scanning:** Grid layouts and consistent spacing enable rapid information scanning
5. **Trust:** Timestamps and live indicators build credibility