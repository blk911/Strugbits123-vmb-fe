# VMB Brand Logo System

This directory stores portable brand logo assets exported from Figma.

## Source of truth

- Figma exports (SVG) from brand design files.
- Keep these files vector-first for quality across web, print, and marketing.

## Files

- `vmb-mark.svg`  
  Icon/mark only.
- `vmb-script.svg`  
  Wordmark/script only.
- `vmb-lockup.svg`  
  Combined mark + script lockup for primary header and marketing placements.

## Color specs

- **Black**
  - mark: `#1F1B1A`
  - script: `#3A3432`
  - accent: `#1F1B1A`
- **Gold**
  - mark: `#B08D57`
  - script: `#6B6460`
  - accent: `#B08D57`
- **BlackGold**
  - mark: `#1F1B1A`
  - script: `#3A3432`
  - accent: `#B08D57`

## React usage

Use `VmbLogo` from `src/components/common/brand/VmbLogo.jsx`.

```jsx
import VmbLogo from "../common/brand/VmbLogo";

<VmbLogo variant="blackGold" size="md" />
```

### Props

- `variant`: `"black" | "gold" | "blackGold"` (default: `"black"`)
- `size`: `"sm" | "md" | "lg"` (default: `"md"`)
- `className`: optional class overrides

The component uses CSS variables (`--vmb-mark`, `--vmb-script`, `--vmb-accent`)
to theme the inline SVG without editing path fills each time.
