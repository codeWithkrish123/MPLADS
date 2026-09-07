# COMPONENT RESPONSIVENESS CHECKLIST

Use this checklist when updating components to be fully responsive.

---

## PRE-IMPLEMENTATION

### Planning
- [ ] Identify breakpoints where layout changes
  - Mobile (< 640px): Usually single column
  - Tablet (640px - 1024px): 2 columns typically
  - Desktop (1024px+): 3+ columns
- [ ] Decide on content visibility
  - What's hidden on mobile? (non-essential features)
  - What's shown on mobile? (core features only)
  - What's optional? (secondary features)
- [ ] List all interactive elements
  - All buttons, inputs, selects, links
  - All should be 44px minimum on mobile

### Review Documentation
- [ ] Read RESPONSIVE_QUICK_REFERENCE.md
- [ ] Review similar responsive components
- [ ] Check existing patterns in codebase

---

## IMPLEMENTATION: TYPOGRAPHY

### Text Sizing
- [ ] Headings scale: text-lg sm:text-xl md:text-2xl
- [ ] Body text scales: text-sm sm:text-base
- [ ] Minimum sizes: 14px on mobile, 16px on desktop
- [ ] Labels responsive: text-xs sm:text-sm
- [ ] No text smaller than 12px on mobile

### Text Overflow
- [ ] Long text truncated properly (use `truncate` or `line-clamp-X`)
- [ ] Text doesn't overflow containers
- [ ] Multi-line text wraps properly
- [ ] No text goes off-screen

### Line Height
- [ ] Headings: line-tight or line-snug
- [ ] Body text: line-relaxed
- [ ] Hindi text: increased line-height (1.85+)
- [ ] Text is readable on all screen sizes

---

## IMPLEMENTATION: LAYOUT

### Flex & Grid
- [ ] Mobile: Single column layout
  ```tsx
  className="flex flex-col gap-3"  // Mobile default
  ```
- [ ] Tablet+: Side-by-side layout
  ```tsx
  className="sm:flex-row sm:gap-4"  // Tablet+
  ```
- [ ] Desktop: Full width with proper spacing
  ```tsx
  className="md:gap-6"  // Desktop
  ```

### Container Sizing
- [ ] Width: w-full (never hardcoded widths)
- [ ] Max-width: max-w-4xl or similar (use semantic names)
- [ ] Padding: responsive padding (p-responsive)
- [ ] No horizontal overflow (except tables)

### Grid Layouts
- [ ] Mobile: `grid-cols-1`
- [ ] Tablet: `sm:grid-cols-2` or `md:grid-cols-2`
- [ ] Desktop: `lg:grid-cols-3` or `xl:grid-cols-4`
- [ ] Use responsive gaps: `gap-3 sm:gap-4 md:gap-6`

### Stacking & Wrapping
- [ ] Mobile: All items stack vertically
- [ ] Tablet: 2 items per row (typically)
- [ ] Desktop: 3+ items per row
- [ ] No content wraps unexpectedly
- [ ] Images scale with container

---

## IMPLEMENTATION: SPACING

### Padding (Outside: element → parent)
- [ ] Mobile padding: p-3 or p-4 (12-16px)
- [ ] Tablet padding: sm:p-4 or sm:p-6
- [ ] Desktop padding: md:p-6 or lg:p-8
- [ ] Use `px-responsive` for horizontal padding
- [ ] Use `py-responsive` for vertical padding
- [ ] Consistent padding throughout

### Margins (Outside: element → siblings)
- [ ] Gaps between elements: gap-3 sm:gap-4 md:gap-6
- [ ] Use `responsive-gap` utility
- [ ] No massive gaps on mobile
- [ ] Proper spacing on all devices

### Internal Spacing
- [ ] Content inside cards: adequate padding
- [ ] Form fields: proper spacing
- [ ] List items: consistent gaps
- [ ] No crowding on mobile

---

## IMPLEMENTATION: TOUCH TARGETS

### Button Sizing
- [ ] Mobile: min-h-[44px] min-w-[44px]
- [ ] Desktop: min-h-[40px]
- [ ] Padding: px-3 py-3 (mobile), px-4 py-2.5 (desktop)
- [ ] All clickable elements meet minimum size

### Input Fields
- [ ] Mobile: min-h-[44px]
- [ ] Desktop: min-h-[40px]
- [ ] Padding: px-3 py-3 (mobile)
- [ ] Padding: px-3 py-2.5 (desktop)
- [ ] Font size: 16px (prevents zoom on iOS)

### Interactive Elements
- [ ] Links: 44px minimum touch target (use padding)
- [ ] Checkboxes: 44x44px with proper spacing
- [ ] Radio buttons: 44x44px with proper spacing
- [ ] Dropdown selects: 44px minimum height
- [ ] All buttons: proper padding for thumb-friendly clicking

### Spacing Between Elements
- [ ] Gap between buttons: min 8px on mobile
- [ ] Gap between form fields: min 12px on mobile
- [ ] Gap between interactive elements: min 16px

---

## IMPLEMENTATION: ICONS

### Icon Sizing
- [ ] Standard icons: `icon-responsive` (16→20→24px)
- [ ] Small icons: `icon-responsive-sm` (12→16px)
- [ ] Large icons: `icon-responsive-lg` (20→24→28px)
- [ ] Or manual: w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6

### Icon Spacing
- [ ] Gap between icon and text: gap-1 sm:gap-2
- [ ] Icon alignment: centered or baseline
- [ ] Hover effects: work on touch devices

---

## IMPLEMENTATION: FORMS

### Form Layout
- [ ] Mobile: Full-width inputs (w-full)
- [ ] Mobile: Stacked labels above inputs (flex-col)
- [ ] Tablet+: Side-by-side labels and inputs (flex-row)
- [ ] Or use `form-row-responsive` utility

### Form Groups
- [ ] Mobile: Space between fields: space-y-3
- [ ] Tablet: Space between fields: sm:space-y-4
- [ ] Desktop: Space between fields: md:space-y-6
- [ ] Or use `form-group-responsive` utility

### Form Fields
- [ ] All inputs 44px minimum on mobile
- [ ] Labels clear and readable
- [ ] Error messages visible and readable
- [ ] Helper text readable (12px+ minimum)

### Buttons in Forms
- [ ] Mobile: Full-width or stacked
- [ ] Tablet: Side-by-side with proper gaps
- [ ] Desktop: Proper spacing
- [ ] All buttons 44px on mobile minimum

---

## IMPLEMENTATION: TABLES

### Table Responsive Behavior
- [ ] Use `table-responsive` class on container
- [ ] Mobile: Horizontal scroll with visible scrollbar
- [ ] Tablet: May scroll or reduce columns
- [ ] Desktop: Full width without scroll

### Table Styling
- [ ] Mobile: Smaller padding (p-2 sm:p-3)
- [ ] Desktop: Standard padding (md:p-4)
- [ ] Font sizes: responsive (text-xs sm:text-sm)
- [ ] Headers readable at all sizes

### Table Actions
- [ ] Mobile: Stack vertically or hide secondary actions
- [ ] Tablet: Show primary + secondary actions
- [ ] Desktop: All actions visible

---

## IMPLEMENTATION: CHARTS & VISUALIZATIONS

### Chart Responsiveness
- [ ] Use ResponsiveContainer from Recharts
- [ ] Mobile: Smaller height (200px typical)
- [ ] Tablet: Medium height (300px typical)
- [ ] Desktop: Full height (400px+ typical)

### Chart Labels
- [ ] Mobile: Rotate or remove labels if needed
- [ ] Tablet: Standard label rotation
- [ ] Desktop: Full labels visible

### Legend & Tooltip
- [ ] Mobile: Legend below or hidden (show on tap)
- [ ] Tablet: Standard positioning
- [ ] Desktop: Standard positioning

---

## IMPLEMENTATION: VISIBILITY & CONTENT

### Hide/Show by Breakpoint
- [ ] Secondary features hidden on mobile (`.hidden-mobile`)
- [ ] Core features always visible
- [ ] Use semantic class names
- [ ] Not using `display: none` for layout (use for truly invisible content)

### Content Priority
- [ ] Mobile: Essential info only
- [ ] Tablet: Most info visible
- [ ] Desktop: All info visible

### Responsive Images
- [ ] Images responsive: w-full max-w-full
- [ ] Aspect ratios maintained (use aspect-ratio utility)
- [ ] No distortion on any screen size
- [ ] Lazy loading on mobile (optional but good)

---

## IMPLEMENTATION: NAVIGATION

### Mobile Navigation
- [ ] Hamburger menu on mobile (< lg)
- [ ] Full navigation on desktop (lg+)
- [ ] Menu items: 48px+ touch targets
- [ ] Menu spacing: min 12px between items

### Sidebar Navigation (if applicable)
- [ ] Hidden on mobile (display: none or hidden)
- [ ] Shown on desktop (lg+)
- [ ] Mobile alternative: drawer or bottom nav
- [ ] Menu items: readable and tappable

---

## IMPLEMENTATION: MODALS & DRAWERS

### Mobile Modals
- [ ] Full-width or max-w-full on mobile
- [ ] Proper padding: p-4 (not p-8)
- [ ] Responsive height: max-h-[90vh]
- [ ] Scrollable content inside
- [ ] Close button: 44x44px minimum

### Modal Content
- [ ] Headings responsive sizing
- [ ] Form fields responsive sizing
- [ ] Buttons responsive sizing
- [ ] Proper gap between elements

---

## TESTING: MOBILE (< 640px)

### Layout
- [ ] Single column layout
- [ ] Content fits without horizontal scroll
- [ ] No off-screen content
- [ ] Images scale properly

### Typography
- [ ] All text readable (≥14px minimum)
- [ ] Headings not too large
- [ ] Line height proper (1.5-1.8)
- [ ] No text truncation issues

### Interactive Elements
- [ ] All buttons 44x44px minimum
- [ ] Proper spacing between buttons
- [ ] Forms work with thumbs
- [ ] Dropdowns open properly on mobile

### Specific Viewports
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12)
- [ ] 414px (iPhone 14 Plus)
- [ ] 412px (Android standard)

---

## TESTING: TABLET (640px - 1024px)

### Layout
- [ ] 2-column layouts where appropriate
- [ ] Content visible without excessive scrolling
- [ ] Proper spacing and gaps
- [ ] No unused whitespace

### Navigation
- [ ] Menu items visible or accessible
- [ ] No crowding on screen
- [ ] Readable navigation

### Interactive Elements
- [ ] All elements touchable (≥40px)
- [ ] Proper spacing for touch
- [ ] Forms work properly

### Specific Viewports
- [ ] 600px (small tablet)
- [ ] 768px (iPad portrait)
- [ ] 800px (tablet landscape)
- [ ] 1024px (iPad landscape)

---

## TESTING: DESKTOP (1024px+)

### Layout
- [ ] Multi-column layouts
- [ ] All content visible
- [ ] Proper use of screen space
- [ ] No excessive whitespace

### Typography
- [ ] Headings properly sized
- [ ] Body text readable
- [ ] Proper line height
- [ ] Information hierarchylear

### Interactive Elements
- [ ] All buttons/links interactive
- [ ] Hover states working
- [ ] Forms functional
- [ ] No layout breaking

### Specific Viewports
- [ ] 1280px (MacBook 13")
- [ ] 1440px (standard desktop)
- [ ] 1920px (large desktop)
- [ ] 2560px (4K monitor)

---

## TESTING: ORIENTATION

### Portrait Mode
- [ ] Mobile portrait: works
- [ ] Tablet portrait: works
- [ ] Desktop portrait: unusual but handle gracefully

### Landscape Mode
- [ ] Mobile landscape: works (tricky)
- [ ] Tablet landscape: works
- [ ] Desktop landscape: standard

---

## TESTING: ACCESSIBILITY

### Touch Device Behavior
- [ ] No hover-only interactions
- [ ] Tap targets large enough (44px)
- [ ] Touch feedback visible
- [ ] No "hover to show" content

### Keyboard Navigation
- [ ] All interactive elements keyboard accessible
- [ ] Tab order logical
- [ ] Focus states visible
- [ ] Shortcuts clear if used

### Screen Reader
- [ ] Labels associated with inputs
- [ ] Images have alt text
- [ ] Headings hierarchy correct
- [ ] Form instructions clear

### Color Contrast
- [ ] Text meets WCAG AA (4.5:1)
- [ ] Interactive elements distinguishable
- [ ] No information conveyed by color alone

---

## TESTING: PERFORMANCE

### Mobile Performance
- [ ] Page loads quickly on 3G
- [ ] Images optimized
- [ ] CSS minimal (use utilities)
- [ ] No unnecessary animations

### Desktop Performance
- [ ] Charts render smoothly
- [ ] Scrolling smooth
- [ ] Interactions responsive
- [ ] No jank or lag

---

## FINAL CHECKS

### Code Quality
- [ ] No hardcoded pixel widths/heights
- [ ] Mobile-first approach used
- [ ] Responsive utilities used (not inline styles)
- [ ] Clean, readable code
- [ ] No `max-width: 1200px` hardcoding
- [ ] Use `max-w-6xl` or similar semantic utilities

### Documentation
- [ ] Code comments for complex responsive logic
- [ ] Breakpoints documented if non-standard
- [ ] Assumptions documented
- [ ] Team aware of patterns used

### Browser Testing
- [ ] Chrome mobile & desktop
- [ ] Safari iOS
- [ ] Firefox mobile & desktop
- [ ] Edge (if applicable)

### Device Testing (if possible)
- [ ] Test on actual iPhone
- [ ] Test on actual iPad
- [ ] Test on actual Android device
- [ ] Test on actual desktop

### Final Review
- [ ] No horizontal scroll (except tables)
- [ ] All text readable
- [ ] All buttons tappable
- [ ] All features functional
- [ ] Looks professional
- [ ] Matches design system

---

## DEPLOYMENT CHECKLIST

Before merging to main:
- [ ] All tests pass
- [ ] Component tested on mobile, tablet, desktop
- [ ] No console errors or warnings
- [ ] Build succeeds
- [ ] Code review approved
- [ ] Documentation updated
- [ ] Team notified of changes

---

## EXAMPLE COMPONENT (Template)

```tsx
export const ResponsiveComponent: React.FC<Props> = ({ ...props }) => {
  return (
    {/* Mobile-first container */}
    <div className="flex flex-col gap-3 p-4 sm:gap-4 sm:p-6 md:gap-6 md:p-8">
      
      {/* Responsive heading */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
        Component Title
      </h2>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {items.map(item => (
          <div key={item.id} className="p-3 sm:p-4 md:p-6 bg-white rounded border">
            {/* Item content */}
          </div>
        ))}
      </div>

      {/* Responsive form */}
      <form className="form-group-responsive">
        <div className="form-row-responsive">
          <input className="flex-1 min-h-[44px] px-3 py-3 text-base sm:text-sm" />
          <button className="px-4 py-3 sm:py-2.5 min-h-[44px] text-base sm:text-sm">
            Submit
          </button>
        </div>
      </form>

      {/* Hidden on mobile */}
      <div className="hidden-mobile">
        Advanced options only shown on tablet+
      </div>

    </div>
  );
};
```

---

## RESOURCES

- **Quick Reference**: RESPONSIVE_QUICK_REFERENCE.md
- **Complete Guide**: RESPONSIVE_DESIGN_IMPLEMENTATION_GUIDE.md
- **CSS Utilities**: src/index.css
- **Example Component**: src/components/layout/Topbar.tsx

---

**Print this checklist and check items as you implement!**

---

**Last Updated**: September 6, 2026  
**Status**: ✅ Ready to Use  
**Used For**: Component Responsive Implementation
