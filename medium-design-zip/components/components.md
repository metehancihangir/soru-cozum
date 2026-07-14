# Component Specifications — Medium Design System

> Exact CSS values per component. Extracted from medium.com via Dembrandt.

---

## Buttons

Medium uses a single button style: **dark pill**. No ghost, outline, or secondary variants were detected in the primary extraction.

### Primary Button — Small ("Get started")

```css
/* Default state */
background-color: var(--color-primary);      /* rgb(25, 25, 25) / #191919 */
color:            var(--color-on-primary);   /* rgb(255, 255, 255) */
padding:          8px 16px;
border-radius:    var(--radius-pill);        /* 9999px */
border:           1px solid var(--color-primary);
font-family:      var(--font-ui);            /* sohne, Helvetica Neue, ... */
font-size:        14px;
font-weight:      400;
line-height:      1;
cursor:           pointer;
display:          inline-flex;
align-items:      center;
transition:       background-color 0.001s linear, color 0.001s linear;

/* Hover state */
background-color: #000000;
border-color:     #000000;
```

### Primary Button — Large CTA ("Start reading")

```css
/* Default state */
background-color: var(--color-primary);      /* #191919 */
color:            var(--color-on-primary);   /* #ffffff */
padding:          8px 20px;
border-radius:    var(--radius-pill);        /* 9999px */
border:           1px solid var(--color-primary);
font-family:      var(--font-ui);
font-size:        20px;
font-weight:      400;
cursor:           pointer;
transition:       background-color 0.001s linear, color 0.001s linear;

/* Hover state */
background-color: #000000;
border-color:     #000000;
```

### Implementation Note
The raw border-radius values extracted (`1386px`, `1980px`) are effectively equivalent to `9999px` — both render as full pill. Use `border-radius: 9999px` for consistency.

---

## Links

Links are visually identical to surrounding text — no underline, no color change by default.

### Link — Default

```css
color:           rgba(0, 0, 0, 0.8);
text-decoration: none;
font-weight:     400;
transition:      color 0.001s ease;

/* Hover */
color: var(--color-fg-neutral-primary);  /* #242424 — rgb(36, 36, 36) */
```

### Link — Alternative (darker start)

```css
color:           rgb(36, 36, 36);  /* #242424 */
text-decoration: none;
font-weight:     400;
transition:      color 0.001s ease;

/* Hover */
color: var(--color-fg-neutral-primary);  /* same — #242424 */
```

---

## Badges / Tags

```css
border-radius:    2px;
/* No color variants detected in primary extraction */
/* Expected: dark text on light grey background for topic tags */
```

---

## Navigation / Logo Link

```css
/* Default */
color: rgba(0, 0, 0, 0.8);

/* Hover */
color: rgb(36, 36, 36);  /* #242424 */
transition: color 0.001s ease;
```

---

## Shadow / Overlay

Only one shadow value detected — used on overlay/modal elements:

```css
box-shadow: rgb(128, 128, 128) 0px 0px 5px 0px;
```

---

## OpenType Feature Settings

For GT Super display headings:

```css
font-feature-settings: "lnum", "pnum";
```

- `lnum` — lining numerals (numbers align to baseline)
- `pnum` — proportional numerals (each number has its own width)

---

## What Was NOT Detected

The following components were not present or detectable in the primary page extraction:

| Component | Status |
|-----------|--------|
| Input fields | Not detected |
| Checkboxes | Not detected |
| Radio buttons | Not detected |
| Select dropdowns | Not detected |
| Icon library | Custom SVG (no library) |
| Breakpoints | JS-based responsive (no CSS media queries) |
| Gradients | None |
| Animations | None (0.001s = instant) |

---

*Source: `npx -y dembrandt https://medium.com --json-only --slow` · 2026-07-14*
