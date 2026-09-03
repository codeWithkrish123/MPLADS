# ✅ VISUAL QA CHECKLIST - MPLADS-UI

**Quick Reference for QA Testing**

---

## 🎨 VISUAL ELEMENTS TO CHECK

### HEADER/TOPBAR
- [ ] Logo visible (8x8px, not grayscale)
- [ ] Ministry text readable (not too small)
- [ ] Helpline number on right side
- [ ] No extra portal links (UIDAI, DigiLocker, etc. removed)
- [ ] Navigation items visible
- [ ] Responsive on mobile (hamburger menu)

### SIDEBAR
- [ ] Dark blue background (#1B3A7A)
- [ ] Orange accent border on active item (#FF6B00)
- [ ] Icons and text aligned
- [ ] Proper spacing between items
- [ ] Collapse/expand works
- [ ] No horizontal scrollbar

### MAIN CONTENT
- [ ] No horizontal overflow on any page
- [ ] Content properly indented from sidebar
- [ ] Padding around content (16px-24px)
- [ ] Cards have proper shadows
- [ ] Sections separated by 24px gap minimum

### FOOTER
- [ ] Landing page ONLY (not on dashboard)
- [ ] Not visible on State Intelligence
- [ ] Not visible on District Intelligence
- [ ] Not visible on Audit Logs
- [ ] Not visible on any dashboard page

### BUTTONS
- [ ] Primary: Navy blue (#1B3A7A), white text
- [ ] Secondary: White bg, gray text, gray border
- [ ] Min height 44px
- [ ] Hover: Background darkens
- [ ] No blue outline on click
- [ ] Disabled: Gray appearance

### CARDS
- [ ] Border: 1px solid #E5E7EB
- [ ] Padding: 16px-24px consistent
- [ ] Border radius: 8px
- [ ] Shadow: Subtle (box-shadow)
- [ ] Hover: Shadow increases slightly
- [ ] Text readable (black on white)

### TEXT
- [ ] Headlines bold (700-800 weight)
- [ ] Body text 16px regular
- [ ] Small text 12px
- [ ] Line-height sufficient (not cramped)
- [ ] Hindi text readable (line-height 1.85+)
- [ ] All text black or dark gray (not light)

### FORMS
- [ ] Input border: 1px solid #E5E7EB
- [ ] Input height: 40px minimum
- [ ] Focus: Blue border (#1B3A7A)
- [ ] Error: Red border and text (#DC2626)
- [ ] Labels: 12px, uppercase
- [ ] Placeholder text gray

### CHARTS
- [ ] Bar chart: Bars visible, labels readable
- [ ] Line chart: Smooth curve, data points visible
- [ ] Pie chart: Segments colored, legend visible
- [ ] Composite: Both bars and line visible
- [ ] Tooltips appear on hover
- [ ] No overlapping labels
- [ ] Legends properly positioned

### COLORS
- [ ] Navy blue (#1B3A7A): Primary elements
- [ ] Orange (#FF6B00): Accents, warnings
- [ ] Green (#047A1E): Success, completion
- [ ] Red (#DC2626): Errors, critical
- [ ] Gray (#E5E7EB): Borders
- [ ] No bright colors that hurt eyes

### SPACING
- [ ] Card padding: 16px-24px
- [ ] Gap between sections: 24px
- [ ] Margin between items: 8-16px
- [ ] Input padding: 8px vertical, 12px horizontal
- [ ] Button padding: 10px vertical, 16px horizontal
- [ ] All aligned on 8px grid

---

## 📱 RESPONSIVE CHECKS

### Mobile (375px - iPhone SE)
- [ ] No horizontal scrollbar
- [ ] Text readable (≥12px)
- [ ] Touch targets ≥44px
- [ ] Stack single column
- [ ] Sidebar collapsed
- [ ] Images not huge
- [ ] Forms fill width

### Tablet (768px - iPad)
- [ ] 2-column layout working
- [ ] Cards 2 across
- [ ] Tables readable
- [ ] Navigation visible
- [ ] No awkward gaps

### Desktop (1440px)
- [ ] Full 3-4 column layout
- [ ] Sidebar visible
- [ ] All controls accessible
- [ ] Proper spacing

---

## 🔤 TYPOGRAPHY CHECK

**Headlines:**
- [ ] H1: 32px+ desktop, 28px+ mobile
- [ ] H2: 28px+ desktop, 24px+ mobile
- [ ] H3: 24px desktop, 20px mobile
- [ ] All bold (700+)

**Body Text:**
- [ ] 16px desktop, 14px mobile
- [ ] Regular weight (400)
- [ ] Line-height 1.6

**Small Text:**
- [ ] 12px desktop, 11px mobile
- [ ] Line-height 1.5

**Hindi Text:**
- [ ] Line-height 1.85+ (diacritics)
- [ ] Font: Noto Sans Devanagari

---

## 🎯 INTERACTION CHECK

### Buttons
- [ ] Click works
- [ ] Hover background changes
- [ ] No blue outline appears
- [ ] Disabled can't be clicked
- [ ] Tooltip appears on hover

### Links
- [ ] Underlined or colored
- [ ] Hover effect (underline/color change)
- [ ] No blue outline on click

### Forms
- [ ] Type in inputs works
- [ ] Dropdown opens on click
- [ ] Checkbox toggles on click
- [ ] Form submits (or shows error)
- [ ] Error message displays

### Tables
- [ ] Hover row highlights
- [ ] Click rows (if clickable)
- [ ] Sort works (if enabled)
- [ ] Scroll horizontal if needed

---

## ♿ ACCESSIBILITY CHECK

- [ ] Tab key cycles through elements
- [ ] Shift+Tab cycles backward
- [ ] Enter activates buttons/links
- [ ] Space activates checkboxes
- [ ] Escape closes modals
- [ ] Headings (H1, H2, etc.) used properly
- [ ] Links have descriptive text
- [ ] Images have alt text
- [ ] Form labels associated with inputs
- [ ] Color not only means (use text too)

---

## ⚡ PERFORMANCE CHECK

- [ ] Page loads in < 3 seconds
- [ ] Animations smooth (60fps)
- [ ] No layout shift/jumps
- [ ] No excessive JavaScript
- [ ] Images optimized
- [ ] No console errors

---

## 📊 PAGES TO TEST (20+)

**Priority 1 (Most Important):**
- [ ] Landing Page (/)
- [ ] National Overview (/overview)
- [ ] State Intelligence (/state-intelligence)

**Priority 2 (Important):**
- [ ] District Intelligence (/district-intelligence)
- [ ] Audit Logs (/audit-logs)
- [ ] Works (/works)

**Priority 3 (Standard):**
- [ ] MP Dashboard (/mp-dashboard)
- [ ] State Nodal (/state-nodal)
- [ ] Agencies (/agencies)
- [ ] Alerts (/alerts)
- [ ] Custom Dataset (/custom-dataset)
- [ ] Cost Anomaly (/cost-anomaly)
- [ ] Duplicate (/duplicate)
- [ ] Expenditure (/expenditure)
- [ ] Delay (/delay)
- [ ] Compliance (/compliance)
- [ ] Policy (/policy)

**Priority 4 (Supporting):**
- [ ] Login Page (/login)
- [ ] Contact Page (/contact)
- [ ] Role Selector (/role-selector)
- [ ] Map (/map)
- [ ] AI Assistant (/ai-assistant)

---

## ✅ SIGN-OFF

| Item | Status | Tester | Date |
|------|--------|--------|------|
| Visual Elements | ✓/✗ | _____ | ____ |
| Responsive Design | ✓/✗ | _____ | ____ |
| Typography | ✓/✗ | _____ | ____ |
| Colors & Contrast | ✓/✗ | _____ | ____ |
| Interactions | ✓/✗ | _____ | ____ |
| Accessibility | ✓/✗ | _____ | ____ |
| Performance | ✓/✗ | _____ | ____ |
| All Pages | ✓/✗ | _____ | ____ |

**Overall Status:** _______________

**Issues Found:** (0 / 1-5 / 6-10 / 10+)

**Ready for Production:** YES / NO

---

**Date:** ____________  
**QA Tester Name:** ____________  
**Signature:** ____________

