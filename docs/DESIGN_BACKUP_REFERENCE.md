# MPLADS Platform Redesign - Backup & Reference

## Backup Files Created

### Original Designs (Preserved)
- **`src/views/LandingPage.original.tsx`** - Original complex landing page with detailed authentication forms and role selector

## Current Design Status

### ✅ Completed Pages (3/17)

#### 1. **LandingPage.tsx** (NEW DESIGN)
**Status:** ✅ Complete & Deployed
**Pattern:** IGOD/PFMS Government Portal Standards
**Features:**
- Accessibility bar (A-/A/A+, High Contrast, Language Toggle)
- Search banner for project discovery
- Quick access cards (Track Work, Cost Analysis, Compliance, Reports)
- Role selection grid (4 roles: Ministry, State Nodal, District, MP)
- Key features section (3 columns)
- Security notice & support information
- Government-style footer
- Bilingual (EN/HI) support
- Responsive design

**File:** `src/views/LandingPage.tsx` (341 lines)
**Backup:** `src/views/LandingPage.original.tsx`

#### 2. **PublicDashboard.tsx** (NEW)
**Status:** ✅ Complete & Deployed
**Pattern:** PFMS Government Dashboard
**Features:**
- KPI cards (4 metrics with trend indicators)
- Charts section (Project status distribution, Top categories)
- State-wise performance table with status badges
- Recent alerts section (amber notification styling)
- Quick action buttons (Find Project, Download Report, Learn More)
- Government tricolor header
- Bilingual support
- Accessible data tables

**File:** `src/views/PublicDashboard.tsx` (319 lines)

#### 3. **NationalOverviewView.tsx** (REDESIGNED)
**Status:** ✅ Complete & Deployed
**Pattern:** Simplified Government Data Visualization
**Features:**
- Tricolor header
- Clean header section with alert button
- 3-column KPI cards (Projects, Expenditure, Completion %)
- Top 5 states ranking table
- Sector-wise distribution with progress bars
- High-priority works alert section (amber alert box)
- Status badges (On Track, Delayed, At Risk)
- Bilingual support
- Risk indicators

**File:** `src/views/NationalOverviewView.tsx` (Modified)

### 📋 Remaining Pages (14/17)

#### To Do Soon:
- [ ] **Task #3** - Redesign Sidebar navigation (Task-based grouping)
- [ ] **Task #4** - Add Disclaimers & Accessibility Features
- [ ] **Task #5** - Create CitizenDashboard.tsx (Simplified interface)
- [ ] **Task #10** - Redesign DistrictDashboardView.tsx
- [ ] **Task #11** - Redesign WorkIntelligenceTableView.tsx
- [ ] **Task #12** - Redesign CostAnomalyView.tsx
- [ ] **Task #13** - Redesign DelayPredictionView.tsx
- [ ] **Task #14** - Redesign DuplicateDetectionView.tsx
- [ ] **Task #15** - Redesign Sidebar navigation
- [ ] **Task #16** - Create CitizenDashboard.tsx
- [ ] **Task #17** - Build & verify all pages

## Design System & Standards

### Government Portal Patterns Applied
1. **IGOD Pattern**: Search-first, category navigation, accessibility controls
2. **PFMS Pattern**: KPI cards, role-based entry, data tables with status indicators
3. **Accessibility (WCAG 2.1 AA)**:
   - Font size controls: A-, A, A+
   - High contrast toggle
   - Keyboard navigation
   - Focus indicators
   - Language support (EN/HI)
4. **Government Branding**:
   - Tricolor stripe (Saffron-White-Green)
   - State emblem
   - Ministry attribution
   - Professional color scheme

### Color Palette
- **Primary Blue**: #003399, #2563EB (Government standard)
- **Success Green**: #138808, #10B981
- **Alert Amber**: #FF9933, #F59E0B
- **Alert Red**: #E31E24, #DC2626
- **Neutral Slate**: #4B5563 (high contrast text)

### Typography
- **English**: Noto Sans
- **Hindi**: Noto Sans Devanagari
- **Font Sizes**: Control A-/A/A+ system

### Bilingual Support
All pages include:
- Complete English/Hindi translations
- Language toggle in header
- Language-specific typography rules (line-height for Hindi: 1.85-2.0)

## Build Status

**Latest Build:** ✅ Successful (2026-08-29 21:12:00)
```
✓ 1719 modules transformed
✓ CSS: 84.65 kB (gzip: 14.68 kB)
✓ JS: 804.95 kB (gzip: 210.47 kB)
✓ Build time: 6.97s
```

## File Structure

```
src/
├── views/
│   ├── LandingPage.tsx (NEW - Government portal standard)
│   ├── LandingPage.original.tsx (BACKUP - Original design)
│   ├── PublicDashboard.tsx (NEW - Government dashboard)
│   ├── NationalOverviewView.tsx (REDESIGNED - Simplified visualization)
│   ├── [Other views - To be redesigned]
├── components/
│   ├── layout/
│   │   ├── Topbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── GovFooter.tsx
│   ├── common/
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── MetricCard.tsx
│   │   └── RiskBadge.tsx
│   └── gov/
│       ├── StateEmblem.tsx
│       └── [Other gov components]
└── [Other modules]
```

## How to Use Original Designs

If you need to revert to original designs:

### Option 1: Copy from Backup File
```tsx
// Copy the original implementation from LandingPage.original.tsx
```

### Option 2: Access from Git History
```bash
git log src/views/LandingPage.tsx
git show <commit-hash>:src/views/LandingPage.tsx
```

## Next Steps

### Phase 6: Sidebar Navigation Redesign
**Task #3 & #15 - Reorganize Navigation**
- Current: Technical feature-based navigation
- Target: Task-oriented grouping
  - "Track & Monitor" (Works, Map, Alerts)
  - "Analyze & Detect" (Anomalies, Duplicates, Delays)
  - "Manage & Report" (Compliance, Audit, Policy)
  - "Citizen Services" (Help, Contact)

### Phase 7: District Dashboard
**Task #10 - DistrictDashboardView.tsx**
- District-specific metrics
- Project list with filtering
- Compliance status overview
- Officer dashboards

### Phase 8: Remaining Page Redesigns
- WorkIntelligenceTableView (Search & filtering)
- CostAnomalyView (Anomaly detection)
- DelayPredictionView (Project delays)
- DuplicateDetectionView (Duplicate detection)
- CitizenDashboard (Simplified public view)

### Phase 9: Final Build & Verification
- Full accessibility audit (WCAG 2.1 AA)
- Mobile responsiveness testing
- Bilingual content verification
- Production build optimization

## Version History

| Version | Date | Status | Changes |
|---------|------|--------|---------|
| v1.0 | 2026-08-29 | Complete | Landing Page redesigned, PublicDashboard created, NationalOverviewView simplified |
| v0.5 | 2026-08-29 | Beta | Original complex design (backup: LandingPage.original.tsx) |

## Important Notes

1. **All designs follow IGOD/PFMS government portal standards** for consistency
2. **Bilingual support (EN/HI) is mandatory** for all new pages
3. **Accessibility controls (A-/A/A+, High Contrast)** must be on every page header
4. **Empty state handling** - Show `<EmptyState />` component when no data
5. **Error handling** - All errors caught by ErrorBoundary
6. **API integration** - Use `/services/api.ts` for all data calls

## Questions or Issues?

- Check design patterns in completed pages (LandingPage, PublicDashboard)
- Reference IGOD (igod.gov.in) and PFMS (pfms.nic.in) for design guidelines
- Keep original designs in backup files for reference
- Always test with high contrast and language toggles
