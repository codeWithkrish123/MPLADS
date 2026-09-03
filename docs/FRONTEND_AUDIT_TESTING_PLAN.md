# 🎯 MPLADS-UI FRONTEND AUDIT - TESTING PLAN & REMEDIATION

**Status:** Senior Frontend Engineering Audit  
**Date:** September 3, 2026  
**Quality Level:** Government Production Ready

---

## 📋 QUICK REFERENCE - WHAT NEEDS TESTING

### Pages (20+):
1. Landing Page (`/`)
2. Login Page (`/login`)
3. Contact Page (`/contact`)
4. National Overview (`/overview`)
5. State Intelligence (`/state-intelligence`)
6. District Intelligence (`/district-intelligence`)
7. All other dashboard pages

### Components (25+):
- Buttons (Primary, Secondary, Danger, Disabled)
- Form Inputs (Text, Search, Dropdown, Checkbox, Radio)
- Cards (Metric Card, Risk Badge, Chart Card)
- Tables (Work List, District List, Audit Logs)
- Charts (6 main visualization charts)
- Navigation (Topbar, Sidebar, Breadcrumbs)

### Responsive Sizes:
- Mobile: 375px (iPhone SE)
- Mobile: 414px (iPhone 11)
- Tablet: 768px (iPad)
- Desktop: 1024px (MacBook 13")
- Desktop: 1440px (24" monitor)

---

## 🧪 TESTING CHECKLIST - BY CATEGORY

### CATEGORY 1: PAGE LOAD & FUNCTIONALITY

**Test Case 1.1: All Pages Load Without Errors**
```
✓ Landing Page loads
✓ All dashboard pages accessible
✓ No console errors (DevTools F12)
✓ No missing images/assets
✓ No 404 errors for resources
```

**Test Case 1.2: Navigation Works**
```
✓ Click all sidebar links - navigate successfully
✓ Breadcrumbs clickable
✓ Back button works
✓ URL matches page title
```

---

### CATEGORY 2: TYPOGRAPHY & FONTS

**Test Case 2.1: Font Sizes**
```
Expected:
- H1: 32px (mobile), 40px (desktop)
- H2: 28px / 36px
- H3: 24px / 28px
- Body: 16px / 14px
- Small: 12px / 11px

Action: Inspect elements with DevTools, verify computed font-size
```

**Test Case 2.2: Font Weights**
```
✓ Headlines: 700-800 weight (bold)
✓ Body text: 400 weight (regular)
✓ Labels: 600 weight (semibold)
✓ Small text: 500 weight (medium)
```

**Test Case 2.3: Hindi Text Rendering**
```
✓ Hindi text readable on all pages
✓ No overlapping characters
✓ Line-height sufficient (1.85+)
✓ Diacritics display correctly
```

---

### CATEGORY 3: COLOR SCHEME & CONTRAST

**Test Case 3.1: Color Application**
```
Navy Blue (#1B3A7A):
- Primary buttons background
- Header/topbar
- Sidebar active items
- Links

Orange (#FF6B00):
- Warning states
- CTA buttons
- Alert badges
- Accent elements

Green (#047A1E):
- Success states
- Checkmarks
- Positive metrics
- Completion indicators
```

**Test Case 3.2: Contrast Check (Use WebAIM Contrast Checker)**
```
✓ Navy on White: ≥ 8.6:1 (AA+)
✓ Orange on White: ≥ 5.2:1 (AA)
✓ Green on White: ≥ 6.8:1 (AA+)
✓ All text on backgrounds: ≥ 4.5:1 (AA)
✓ All icons on colored backgrounds: ≥ 3:1
```

---

### CATEGORY 4: SPACING & LAYOUT

**Test Case 4.1: Padding Consistency**
```
Inspect with DevTools:
✓ Cards: 16px-24px padding
✓ Sections: 24px gap between
✓ Buttons: 10px vertical, 16px horizontal
✓ Inputs: 8px vertical, 12px horizontal
✓ All border-radius: 8px default
```

**Test Case 4.2: Alignment**
```
✓ All text left-aligned
✓ Numbers/metrics right-aligned in tables
✓ Icons vertically centered
✓ Buttons centered in forms
✓ No text overflow in cards
```

---

### CATEGORY 5: RESPONSIVE DESIGN

**Test Case 5.1: Mobile (375px)**
```
✓ No horizontal scrollbar
✓ Text readable without zoom
✓ Touch targets ≥ 44×44px
✓ Stack layout: single column
✓ Sidebar: collapsed/hamburger
✓ Tables: card layout or horizontal scroll
✓ Modals: full-screen or 90vw max
```

**Test Case 5.2: Tablet (768px)**
```
✓ 2-column layout active
✓ Cards display 2 across
✓ Tables still readable
✓ Navigation visible but compact
✓ Forms side-by-side labels/inputs
```

**Test Case 5.3: Desktop (1024px+)**
```
✓ Full layout with sidebar visible
✓ 3-4 column grids
✓ All controls visible
✓ No mobile-specific styles active
```

---

### CATEGORY 6: BUTTON CONSISTENCY

**Test Case 6.1: Button Styles**
```
Primary Button (#1B3A7A):
✓ Background: Navy blue
✓ Text: White
✓ Padding: 10px vertical, 16px horizontal
✓ Height: 44px minimum
✓ Border radius: 8px

Secondary Button:
✓ Background: White
✓ Border: 1px solid #E5E7EB
✓ Text: Gray (#64748B)
✓ Same padding/height

Hover State (All Buttons):
✓ Background darkens 10%
✓ Shadow increases
✓ Cursor changes to pointer

Disabled Button:
✓ Background: #E5E7EB (light gray)
✓ Text: #9CA3AF (slate)
✓ Cursor: not-allowed
```

---

### CATEGORY 7: FORM ELEMENTS

**Test Case 7.1: Input Styling**
```
Default State:
✓ Border: 1px solid #E5E7EB
✓ Background: #FFFFFF
✓ Height: 40px minimum
✓ Padding: 8px vertical, 12px horizontal

Focus State:
✓ Border: 2px solid #1B3A7A (navy)
✓ Outline: none
✓ Shadow: subtle (0 0 0 3px rgba(27,58,122,0.1))

Error State:
✓ Border: 2px solid #DC2626 (red)
✓ Error text: #DC2626, 12px, below field

Success State:
✓ Border: 2px solid #10B981 (green)
✓ Green checkmark visible
```

**Test Case 7.2: Form Validation**
```
✓ Required fields: Show error when empty
✓ Email validation: Check format
✓ Number fields: Only digits allowed
✓ Error messages: Clear and helpful
✓ Success feedback: Visual confirmation
```

---

### CATEGORY 8: CHARTS & VISUALIZATIONS

**Test Case 8.1: Chart 1 - State-wise Fund Bar**
```
✓ Renders without error
✓ 10 states displayed
✓ Blue (Sanctioned) and Pink (Actual) bars visible
✓ Y-axis label: "Amount (₹ Cr)"
✓ X-axis: All state codes readable
✓ Tooltip shows on hover
✓ Legend displays correctly
✓ No overlapping bars/labels
```

**Test Case 8.2: Chart 2 - Completion Rate Line**
```
✓ Renders without error
✓ 8 states with line data
✓ Green line smooth curve
✓ Data points visible
✓ Tooltip shows percentage on hover
✓ Y-axis: 0-100% range
✓ X-axis: State codes visible
```

**Test Case 8.3: Chart 3 - Risk Distribution Pie**
```
✓ Renders without error
✓ 4 segments (Low/Med/High/Critical)
✓ Colors: Green, Amber, Orange, Red
✓ Segment sizes proportional
✓ Legend below chart
✓ Percentages displayed
✓ Tooltip shows count on hover
```

**Test Case 8.4: Charts 4-6**
- Sector Bar: 6 sectors, horizontal, complete
- Timeline Area: 6 months, gradients, no overlap
- Scorecard Composite: Dual axis, bars + line

---

### CATEGORY 9: ACCESSIBILITY

**Test Case 9.1: Keyboard Navigation**
```
✓ Tab key cycles through elements
✓ Tab order is logical (left→right, top→bottom)
✓ Buttons activable with Enter/Space
✓ Links activable with Enter
✓ Dropdowns: ArrowDown/Up, Enter to select
✓ Escape closes modals/dropdowns
```

**Test Case 9.2: Screen Reader Support**
```
✓ Headings announced correctly
✓ Link text descriptive (not "click here")
✓ Form labels associated with inputs
✓ Error messages announced
✓ Chart data accessible via alt text/table
```

**Test Case 9.3: Visual Indicators**
```
✓ Links: Underlined or color+underline
✓ Status: Color + text/icon, not color alone
✓ Required fields: * indicator + aria-required
✓ Disabled: Appears disabled, aria-disabled
```

---

### CATEGORY 10: CROSS-BROWSER

**Test Case 10.1: Chrome**
- All elements visible ✓
- Animations smooth ✓
- No console errors ✓

**Test Case 10.2: Firefox**
- Same visual as Chrome ✓
- No CSS issues ✓
- Fonts render same ✓

**Test Case 10.3: Safari**
- SVG renders ✓
- Flex/Grid layout correct ✓
- No webkit-specific issues ✓

**Test Case 10.4: Edge**
- Same as Chrome (Chromium-based) ✓

---

### CATEGORY 11: PERFORMANCE

**Test Case 11.1: No Layout Shift**
```
✓ CLS (Cumulative Layout Shift) < 0.1
✓ Elements don't jump during load
✓ Images load with reserved space
✓ Fonts load without reflow
Action: Use Chrome DevTools → Performance
```

**Test Case 11.2: Animation Smoothness**
```
✓ Animations run at 60fps
✓ No janky scrolling
✓ Transitions smooth (300ms duration)
✓ No frame drops
Action: Use Chrome DevTools → Performance
```

---

## 🐛 KNOWN ISSUES & FIXES NEEDED

### Priority 1 (Critical - Block Production):
- [ ] Issue: [Check for any page crashes]
- [ ] Issue: [Check for console errors]
- [ ] Issue: [Check WCAG contrast failures]

### Priority 2 (Major - Should Fix):
- [ ] Issue: [Inconsistent spacing]
- [ ] Issue: [Missing hover states]
- [ ] Issue: [Mobile layout breaks at specific width]

### Priority 3 (Minor - Nice to Have):
- [ ] Issue: [Subtle color mismatch]
- [ ] Issue: [Button text alignment]
- [ ] Issue: [Animation timing]

---

## ✅ TESTING SIGN-OFF

### Before Production Release:

- [ ] All 20+ pages load without errors
- [ ] All 25+ components styled consistently
- [ ] Responsive design tested (mobile/tablet/desktop)
- [ ] WCAG AA accessibility verified
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Performance metrics acceptable
- [ ] Bilingual (EN/HI) verified
- [ ] Charts render correctly
- [ ] Forms work and validate
- [ ] No console errors
- [ ] All tests pass

### QA Approval:
- [ ] QA Lead: _________________ Date: _______
- [ ] Senior Frontend Engineer: _________________ Date: _______
- [ ] Product Manager: _________________ Date: _______

---

## 📞 TESTING TOOLS RECOMMENDED

1. **Chrome DevTools** - Inspect, Performance, Accessibility
2. **WebAIM Contrast Checker** - Color contrast verification
3. **WAVE** - Accessibility scanning
4. **Lighthouse** - Performance metrics
5. **Responsive Design Mode** - Mobile testing
6. **Firefox Developer Tools** - Cross-browser check
7. **Keyboard Navigation Tester** - Accessibility

---

**Document Status:** Ready for QA Testing  
**Version:** 1.0  
**Last Updated:** September 3, 2026

