# Font Assets — Medium Design System

## Self-Hosted Fonts

Medium uses two proprietary self-hosted fonts. These fonts are **not available** via Google Fonts, Adobe Fonts, or any public CDN.

| Font File | Family | Style | Weight |
|-----------|--------|-------|--------|
| `gt-super-400-normal.woff` | GT Super | Normal | 400 |
| `sohne-400-normal.woff` | Sohne | Normal | 400 |

## Font Face Declaration (template)

If you obtain licensed copies of these fonts, declare them as:

```css
@font-face {
  font-family: 'gt-super';
  src: url('./gt-super-400-normal.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'sohne';
  src: url('./sohne-400-normal.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

## Fallback Strategy

If proprietary fonts are unavailable, the following fallbacks closely approximate the visual style:

| Medium Font | Closest Free Alternative |
|-------------|-------------------------|
| GT Super (serif) | `"Playfair Display"` (Google Fonts) or `Georgia` |
| Sohne (sans-serif) | `"Inter"` (Google Fonts) or `"Helvetica Neue"` |

```html
<!-- Fallback import (Google Fonts) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display&family=Inter:wght@400&display=swap" rel="stylesheet">
```

## Important

> The actual `.woff` font files are **not included** in this package due to licensing restrictions.  
> Medium's fonts are commercially licensed — you must obtain your own license from  
> Klim Type Foundry (GT Super) and Schick Toikka (Sohne).
