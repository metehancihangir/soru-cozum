# DESIGN.md — Medium Brand Guide

> Extracted from medium.com · 2026-07-14 · Dembrandt headless analysis

---

## Brand Identity

**Medium** is a publishing platform whose design language communicates one idea above all else: *the content is the product*. Every visual decision serves the text. Color, decoration, and animation are deliberately absent so that the reader's attention never leaves the article.

---

## Color System

### Philosophy
Medium's palette is intentionally monochromatic. This is not a limitation — it is a deliberate brand stance. The absence of accent colors forces users to focus on content. When a color appears (the signature green), it carries meaning precisely because it is rare.

### Palette

```
Primary (near-black)   #191919   rgb(25, 25, 25)
Background (white)     #ffffff   rgb(255, 255, 255)
Text (soft black)      —         rgba(0, 0, 0, 0.8)
Dark neutral           #242424   rgb(36, 36, 36)     — body text, icons
Mid neutral            #6b6b6b   rgb(107, 107, 107)  — secondary text, metadata
Deep black             #000000   — manifest theme, hover target
Hover dark             #101010   rgb(16, 16, 16)     — focus/hover state

Accent Green (sparse)  #1a8917   — applause, success, highlights
Accent bg light        #bbdbba   — accent area background
Accent bg lighter      #d2e7d1   — accent tertiary background
```

### Semantic Roles

| Token | Color | Usage |
|-------|-------|-------|
| `--color-primary` | `#191919` | Buttons, CTAs |
| `--color-background` | `#ffffff` | Page background |
| `--color-text` | `rgba(0,0,0,0.8)` | Body text |
| `--color-neutral-dark` | `#242424` | Icons, headings |
| `--color-neutral-mid` | `#6b6b6b` | Metadata, secondary |
| `--color-accent` | `#1a8917` | Applause, highlights |

---

## Typography

### Type Families

**GT Super** — Display / Headline serif  
A geometric grotesque-influenced serif. Used exclusively for large editorial headlines. Communicates authority, gravitas, and the sense of serious publishing.

**Sohne** — UI / Body sans-serif  
A clean, neutral grotesque. Used for all interface text, navigation, captions, and body copy below display size. Communicates clarity and restraint.

Both fonts are **self-hosted** — Medium does not use Google Fonts or Adobe Fonts.

### Type Scale

```
Display     GT Super    120px / 7.50rem   weight 400   lh 0.83   ls -6.6px
Heading 3   Sohne        22px / 1.38rem   weight 400   lh 1.27
UI Large    Sohne        20px / 1.25rem   weight 400   lh 1.40
Body/Link   System       16px / 1.00rem   weight 400
Body        Sohne        14px / 0.88rem   weight 400   lh 1.43
Body XS     Sohne        13px / 0.81rem   weight 400   lh 1.54
```

**Key insight:** Medium uses `font-weight: 400` (regular) everywhere — including buttons and CTAs. Weight differentiation is achieved through size and font-family choice, not boldness.

### OpenType Features
`lnum` (lining numerals) + `pnum` (proportional numerals) — active on GT Super headings.

---

## Spacing

**Grid base: 8px**

```
space-1     8px   / 0.50rem   — component padding (most common)
space-2    10px   / 0.63rem   — compact elements
space-3    24px   / 1.50rem   — section gaps
space-4    25px   / 1.56rem   — section gaps (variant)
space-5    48px   / 3.00rem   — large section separation
space-6    75px   / 4.69rem   — hero / page-level spacing
```

---

## Shape Language

**Pill buttons** — all buttons use `border-radius: 9999px`. This creates a soft, approachable shape that contrasts with the sharp serif typography. The contrast (angular type + rounded buttons) is intentional.

**Sharp badges** — `border-radius: 2px`. Topic tags and labels are nearly square-cornered, reinforcing their role as data labels rather than interactive affordances.

---

## Motion

Medium is effectively **motion-free**. All transitions are set to `0.001s` — faster than a single frame. This is a philosophical choice: animation would distract from reading.

```
Transition duration:   0.001s (all interactive elements)
Button easing:         linear  (background-color, color)
Link easing:           ease    (color shift)
```

The only detectable motion: button and link color changes on hover. No enter/exit animations, no scroll effects, no micro-animations.

---

## Elevation & Depth

Medium uses **no box shadows** in its primary interface. Hierarchy is created through:
1. Typography scale (size difference carries weight)
2. Color contrast (dark text on white, grey for secondary)
3. Whitespace (generous spacing communicates grouping and importance)

One shadow detected: `rgba(128,128,128) 0 0 5px 0` — used for a single modal/overlay element.

---

## Components

See `components/components.md` for full CSS specs.

### Button Variants
- **Primary (dark):** `#191919` bg, `#ffffff` text, pill shape — the only button style
- **Hover state:** background transitions to `#000000` (pure black)
- No secondary, ghost, or outline variants detected in primary extraction

### Links
- No underline (`text-decoration: none`)
- Color: `rgba(0,0,0,0.8)` — same as body text
- Hover: shifts to `#242424` (solid dark)
- Links are visually indistinguishable from text unless context signals otherwise

---

## Framework & Tooling

| Property | Value |
|----------|-------|
| CSS Framework | None detected (custom CSS) |
| Icon Library | None detected (custom SVG) |
| Font Source | Self-hosted (.woff) |
| Responsive | JS-based (not detected via CSS media queries) |
| Variable Fonts | Not used |
| Design Tokens Format | CSS custom properties (`--color-*` naming) |
