# RESPONSIVE DESIGN - QUICK REFERENCE CARD

## 🎯 Mobile-First Pattern (ALWAYS USE THIS)

```tsx
// ❌ DON'T - Desktop first
<div className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1">

// ✅ DO - Mobile first  
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
```

---

## 📏 BREAKPOINTS

| Screen Size | Breakpoint | Use Case |
|-------------|-----------|----------|
| 320-639px | None (Mobile default) | Phones, portrait |
| 640-767px | `sm:` | Tablets, small screens |
| 768-1023px | `md:` | Tablets, landscape |
| 1024px+ | `lg:` | Desktops |
| 1280px+ | `xl:` | Large desktops |
| 1536px+ | `2xl:` | Extra-large displays |

---

## 📝 RESPONSIVE TEXT SIZES

**Automatic scaling (no classes needed):**

```
Mobile    → Tablet    → Desktop
h1: 24px  → 30px     → 48px
h2: 20px  → 24px     → 36px
h3: 18px  → 20px     → 24px
p:  14px  → 16px     → 16px
label: 12px → 14px    → 14px
```

Use responsive classes if you need custom sizing:
```tsx
<p className="text-sm sm:text-base md:text-base">
  Text that scales with screen size
</p>
```

---

## 🎯 TOUCH TARGET SIZES (WCAG AA)

```tsx
// Mobile (< md): 44x44px minimum
<button className="px-3 py-3 min-h-[44px] min-w-[44px] text-base">
  Mobile Friendly Button
</button>

// Desktop (md+): 40x40px minimum
<button className="px-4 py-2.5 min-h-[40px] text-sm">
  Desktop Button
</button>
```

---

## 📐 RESPONSIVE SPACING

### Gaps Between Elements
```tsx
// Small gap (responsive)
<div className="responsive-gap">...</div>
{/* Mobile: 8px, Tablet: 12px, Desktop: 16px, Large: 24px */}

// Tight spacing
<div className="responsive-gap-tight">...</div>
{/* Mobile: 4px, Tablet: 6px, Desktop: 8px, Large: 12px */}

// Loose spacing
<div className="responsive-gap-loose">...</div>
{/* Mobile: 12px, Tablet: 16px, Desktop: 24px, Large: 32px */}

// Custom responsive gaps
<div className="gap-2 sm:gap-3 md:gap-4 lg:gap-6">
  {/* Gap: 8px → 12px → 16px → 24px */}
</div>
```

### Padding (Mobile first)
```tsx
// Responsive padding
<div className="p-responsive">...</div>
{/* Padding: 12px → 16px → 24px → 32px */}

// Horizontal padding only
<div className="px-responsive">...</div>

// Vertical padding only
<div className="py-responsive">...</div>

// Custom responsive padding
<div className="p-3 sm:p-4 md:p-6 lg:p-8">
  {/* Padding: 12px → 16px → 24px → 32px */}
</div>
```

---

## 🎨 RESPONSIVE GRIDS

### Metric Cards (Most Common)
```tsx
<div className="grid-metric-responsive">
  {/* Grid: 1 column (mobile) → 2 (tablet) → 3 (md) → 4 (xl) */}
</div>

// Equivalent manual code:
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-4 lg:gap-6">
</div>
```

### Dashboard Cards
```tsx
<div className="grid-metric-wide">
  {/* Grid: 1 column → 2 columns → 4 columns (lg) */}
</div>
```

### Data Cards
```tsx
<div className="grid-metric-compact">
  {/* Grid: 1 column → 2 columns → 2 columns (xl:3) */}
</div>
```

---

## 🎭 RESPONSIVE ICONS

```tsx
// Standard icon (responsive sizing)
<Icon className="icon-responsive" />
{/* Size: 16px (mobile) → 20px (sm) → 24px (lg) */}

// Small icon
<Icon className="icon-responsive-sm" />
{/* Size: 12px (mobile) → 16px (sm) → 16px (lg) */}

// Large icon
<Icon className="icon-responsive-lg" />
{/* Size: 20px (mobile) → 24px (sm) → 28px (lg) */}

// Manual responsive icon
<Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
```

---

## 📋 RESPONSIVE FORMS

### Form Groups
```tsx
<div className="form-group-responsive">
  {/* Responsive spacing between form fields */}
  <label>Username</label>
  <input type="text" className="w-full min-h-[44px]" />
</div>
```

### Form Rows (Multiple fields)
```tsx
<div className="form-row-responsive">
  {/* Mobile: Stack vertically | Tablet+: Side by side */}
  <input type="text" placeholder="First Name" />
  <input type="text" placeholder="Last Name" />
</div>

// Equivalent code:
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  <input className="flex-1 min-w-0 min-h-[44px]" />
  <input className="flex-1 min-w-0 min-h-[44px]" />
</div>
```

### Input Sizing
```tsx
<input 
  type="text" 
  className="w-full px-3 py-3 sm:py-2.5 min-h-[44px] text-base sm:text-sm"
/>
{/* Mobile: px-3 py-3 text-base */}
{/* Desktop: px-3 py-2.5 text-sm */}
```

---

## 👁️ VISIBILITY UTILITIES

```tsx
// Hide on mobile, show on sm+
<div className="hidden-mobile">
  Show on tablet and desktop
</div>

// Show only on mobile, hide on sm+
<div className="shown-mobile">
  Show only on mobile
</div>

// Hide on tablet, show on md+
<div className="hidden-tablet">
  Show on large desktop
</div>

// Show only on tablet, hide on md+
<div className="shown-tablet">
  Show only on tablet
</div>

// Manual visibility
<div className="hidden md:block">Show on md+</div>
<div className="block md:hidden">Hide on md+</div>
```

---

## 🎬 COMMON PATTERNS

### Hero Section
```tsx
<section className="flex flex-col md:flex-row gap-4 md:gap-8 p-4 md:p-8 lg:p-12">
  {/* Mobile: stacked | Desktop: side-by-side */}
  <div className="flex-1">Hero Content</div>
  <div className="flex-1">Hero Image</div>
</section>
```

### Card Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6">
  {cards.map(card => <Card key={card.id} {...card} />)}
</div>
```

### Navigation Bar
```tsx
<nav className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 gap-2 sm:gap-4">
  {/* Mobile: stacked | Desktop: horizontal */}
  <div>Logo</div>
  <div className="hidden md:flex gap-4">Menu Items</div>
  <button>Mobile Menu Toggle</button>
</nav>
```

### Table with Responsive Scroll
```tsx
<div className="table-responsive">
  {/* Mobile: horizontal scroll | Desktop: full width */}
  <table className="w-full">
    {/* Your table rows */}
  </table>
</div>
```

---

## ⚙️ RESPONSIVE BUTTON STYLES

### Primary Button (Responsive)
```tsx
<button className="btn-responsive bg-blue-600 text-white hover:bg-blue-700">
  Button Text
</button>
{/* Mobile: px-3 py-3 text-sm | Desktop: px-6 py-3 text-base */}
```

### Primary Button Large (Responsive)
```tsx
<button className="btn-responsive-lg bg-blue-600 text-white">
  Large Button
</button>
{/* Mobile: px-4 py-3 text-base | Desktop: px-6 py-4 text-lg */}
```

### Primary Button Small (Responsive)
```tsx
<button className="btn-responsive-sm bg-blue-600 text-white">
  Small Button
</button>
{/* Mobile: px-2 py-1.5 text-xs | Desktop: px-3 py-2 text-sm */}
```

---

## 🚨 COMMON MISTAKES TO AVOID

### ❌ DON'T

```tsx
// Desktop-first (WRONG!)
<div className="grid grid-cols-4 sm:grid-cols-2 xs:grid-cols-1">

// Hardcoded sizes (WRONG!)
<div style={{ width: '1200px' }}>

// Too-small text on mobile (WRONG!)
<p className="text-xs">Text</p>

// Insufficient touch targets (WRONG!)
<button className="p-1">Click</button>

// Wrapping text without responsive sizing (WRONG!)
<h1 className="text-4xl">This might overflow on mobile</h1>

// Non-responsive table (WRONG!)
<table>...</table>

// Using `display: none` for responsive layout (MOSTLY WRONG!)
<div className="hidden lg:block">
  {/* Use only for truly invisible content, not layout */}
</div>
```

### ✅ DO

```tsx
// Mobile-first (RIGHT!)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

// Fluid sizing (RIGHT!)
<div className="w-full max-w-6xl">

// Responsive text sizes (RIGHT!)
<p className="text-sm sm:text-base md:text-base">

// Proper touch targets (RIGHT!)
<button className="p-3 min-h-[44px] min-w-[44px]">Click</button>

// Responsive heading (RIGHT!)
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>

// Responsive table scrolling (RIGHT!)
<div className="table-responsive">
  <table>...</table>
</div>

// Use hidden-mobile for responsive layout (RIGHT!)
<div className="hidden-mobile">
  Show on tablet+
</div>
```

---

## 🧪 TESTING CHECKLIST

### Mobile Testing (< 640px)
- [ ] Text is readable (≥14px minimum)
- [ ] All buttons are 44x44px minimum
- [ ] No horizontal scrolling (except tables)
- [ ] Single column layouts
- [ ] Proper spacing between touch targets
- [ ] Images scale appropriately

### Tablet Testing (640px - 1024px)
- [ ] 2-column layouts where appropriate
- [ ] Touch targets are ≥40px
- [ ] Text is readable (≥14px)
- [ ] Navigation is accessible
- [ ] Landscape orientation works

### Desktop Testing (1025px+)
- [ ] Multi-column layouts (3-4+ columns)
- [ ] All features visible
- [ ] No forced horizontal scrolling
- [ ] Optimized for mouse & keyboard
- [ ] No excessive whitespace

---

## 📱 DEVICE SCREEN SIZES

| Device | Width | Height | Type |
|--------|-------|--------|------|
| iPhone SE | 375px | 667px | Mobile |
| iPhone 14 | 390px | 844px | Mobile |
| iPad Air | 768px | 1024px | Tablet |
| iPad Pro | 1024px | 1366px | Tablet |
| MacBook 13" | 1280px | 800px | Desktop |
| Desktop | 1440px | 900px | Desktop |
| 4K Monitor | 2560px | 1440px | Large Desktop |

---

## 💡 PRO TIPS

1. **Always test with DevTools device emulation AND on real devices**
2. **Use `max-w-` classes to constrain content on large screens**
3. **Stack everything vertically on mobile, then side-by-side on larger screens**
4. **Increase font sizes gradually, don't jump from 12px to 24px**
5. **Use `truncate` or `line-clamp-X` for text that might overflow**
6. **Ensure proper line-height for readability (1.5-1.8)**
7. **Test with real users on real devices when possible**
8. **Consider reducing animations on mobile for performance**

---

## 🔗 RESPONSIVE UTILITIES SUMMARY

```css
/* Typography - Auto-scales (no classes needed) */
h1, h2, h3, p, label, .text-caption

/* Spacing - Use these classes */
.responsive-gap
.responsive-gap-tight
.responsive-gap-loose
.responsive-space-y
.p-responsive
.px-responsive
.py-responsive
.m-responsive

/* Icons - Use these classes */
.icon-responsive
.icon-responsive-sm
.icon-responsive-lg

/* Grids - Use these classes */
.grid-metric-responsive
.grid-metric-wide
.grid-metric-compact

/* Forms - Use these classes */
.form-group-responsive
.form-row-responsive

/* Tables - Use these classes */
.table-responsive

/* Buttons - Use these classes */
.btn-responsive
.btn-responsive-lg
.btn-responsive-sm

/* Visibility - Use these classes */
.hidden-mobile
.hidden-tablet
.shown-mobile
.shown-tablet

/* Modals - Use these classes */
.modal-responsive
.modal-content-responsive
```

---

## 📞 Need Help?

See full documentation in:
- `RESPONSIVE_DESIGN_IMPLEMENTATION_GUIDE.md` - Complete guide with examples
- `RESPONSIVE_UI_REDESIGN_COMPLETE_PHASE_1.md` - Phase 1 completion report
- `src/index.css` - All CSS utility definitions

---

**Last Updated**: September 6, 2026  
**Status**: ✅ Phase 1 Complete  
**Ready for**: Phase 2 Component Updates
