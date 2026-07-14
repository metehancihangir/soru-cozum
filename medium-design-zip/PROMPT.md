# PROMPT — Medium Design System Implementation Guide

> This file instructs AI coding agents on how to implement the Medium design system accurately.  
> Read this before writing any code.

---

## Your Role

You are implementing a UI that faithfully reproduces the Medium.com visual design system.  
Your output must match the extracted tokens in `tokens/tokens.css` and `tokens/tokens.json`.

---

## Implementation Priorities (follow this order)

### 1. Import Tokens First
```css
@import './tokens/tokens.css';
```
All colors, spacing, and typography decisions must reference CSS variables from this file.  
**Do not hard-code hex values.** Use `var(--color-*)`, `var(--spacing-*)`, etc.

### 2. Apply Typography
- **Headings / Display:** `font-family: 'gt-super', Georgia, Cambria, 'Times New Roman', Times, serif;`
- **UI / Body:** `font-family: 'sohne', 'Helvetica Neue', Helvetica, Arial, sans-serif;`
- **System fallback:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Base body font size: `14px` with `line-height: 1.43`
- Display heading: `120px`, `line-height: 0.83`, `letter-spacing: -6.6px`

### 3. Color Rules
- **Background:** always `#ffffff` (white)
- **Primary text:** `rgba(0, 0, 0, 0.8)` — NOT pure black
- **Interactive elements:** `#191919` (near-black) background, `#ffffff` text
- **Accent (use sparingly):** `#1a8917` (Medium green) — only for success/applause states
- **Never** use blue, red, or other colors — this breaks Medium's identity

### 4. Buttons
All buttons use pill shape:
```css
border-radius: 9999px;
background-color: var(--color-primary);
color: var(--color-on-primary);
border: 1px solid var(--color-primary);
font-weight: 400;  /* Note: Medium uses weight 400, NOT bold */
```
- Small button: `padding: 8px 16px; font-size: 14px;`
- Large CTA: `padding: 8px 20px; font-size: 20px;`
- Hover: darken background to `#000000` (pure black)

### 5. Spacing
Use the 8px grid:
- `8px` — tight spacing (padding inside components)
- `24px` — section gaps
- `48px` — large section separations
- `75px` — page-level hero spacing

### 6. No Shadows, No Gradients
Medium uses **no** box shadows or gradients in its primary UI.  
If depth is needed, use whitespace and borders instead.

### 7. Transitions
```css
transition: background-color 0.001s linear, color 0.001s ease;
```
Effectively instant — do not add animation. Medium is deliberately animation-free.

---

## What NOT to Do

- ❌ Do not add `font-weight: 700` (bold) — Medium uses weight 400 everywhere
- ❌ Do not use `border-radius: 4px` or `8px` on buttons — always pill
- ❌ Do not use colored text links (no blue underlines)
- ❌ Do not add `box-shadow` to cards or panels
- ❌ Do not use Google Fonts — Medium uses self-hosted `gt-super` and `sohne`
- ❌ Do not add CSS frameworks (Tailwind, Bootstrap) — Medium uses custom CSS

---

## Tech Stack Assumptions

- Vanilla HTML + CSS (no framework detected on medium.com)
- Custom CSS properties via `:root` (see `tokens/tokens.css`)
- Self-hosted fonts (placeholders in `assets/fonts/`)

---

## Reference Files

| File | Purpose |
|------|---------|
| `DESIGN.md` | Brand guide — philosophy, rationale, visual identity |
| `tokens/tokens.css` | Ready-to-use CSS custom properties |
| `tokens/tokens.json` | W3C DTCG token format for tooling |
| `components/components.md` | Exact CSS per component |
