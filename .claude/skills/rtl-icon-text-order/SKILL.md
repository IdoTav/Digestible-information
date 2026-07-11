---
name: rtl-icon-text-order
description: Use whenever laying out an icon/image/badge next to a translatable text block in this app (CategorySheet body rows, category chips, certification rows, etc.) across the 3 supported languages (en/he/ar). Encodes this app's specific icon-before-text convention for RTL, which is an intentional asymmetric rule, NOT plain CSS bidi mirroring. Trigger on: "icon and text order", "rtl layout", "right to left", "left to right", "mirroring", "reading order" for any row combining an image/icon/badge with text.
disable-model-invocation: false
---

# RTL/LTR icon-and-text row ordering (Digestible Information app)

This app supports 3 languages via `useLanguage()` → `{ dir, t }`: `en` (ltr), `he`/`ar` (rtl).

## The rule (confirmed directly by the user — do not re-derive or "fix" this again)

For any row that pairs a translatable text block with an icon/image/badge:

- **English (ltr)**: text comes first in reading order → text on screen-LEFT, icon on screen-RIGHT. This is the current/correct behavior — never change English layout as a side effect of an RTL fix.
- **Hebrew/Arabic (rtl)**: **icon comes first** in reading order → icon on screen-RIGHT, text on screen-LEFT.

This is a **direction-dependent asymmetric order** — not simple mirroring. Plain unforced bidi mirroring (natural `dir` inheritance with a fixed DOM order) only flips *visual position*, not *which item reads first*. If you leave DOM order as `[text, icon]` and just let it mirror naturally, rtl gets text-right/icon-left (text still reads first, just moved to the right) — that is explicitly **not** what's wanted here. The desired rtl behavior requires the icon to be genuinely first in reading order, i.e. first in DOM order for rtl specifically.

## How to implement

Branch explicitly on `dir` and swap DOM order — don't rely on CSS mirroring alone:

```jsx
{dir === 'rtl' ? (
  <>
    <IconOrBadge />
    <TextBlock />
  </>
) : (
  <>
    <TextBlock />
    <IconOrBadge />
  </>
)}
```

Reference implementation: `KosherBody` in `src/components/CategorySheet.jsx` (the 3 certification rows: dairy badge, OU-D logo, rabbinical seal — each pairs an icon with a text block and needs this exact branch).

## Related bidi gotchas already hit in this app (don't re-debug these from scratch)

- **Fixed-language text embedded inside an rtl container can reorder itself.** "Orthodox Union - Dairy" (kept in English in every language, including he/ar) rendered as "Dairy -" inside Hebrew/Arabic rows until given an explicit `dir="ltr"` on that specific text block. Any English/Latin phrase embedded inside an RTL row needs `dir="ltr"` if it contains punctuation (hyphens, etc.) the bidi algorithm might reorder.
- **Number/unit order in nutrition facts**: RTL languages in this app still keep the number visual-left, unit visual-right (per Figma), even in he/ar — implemented via `renderAmount()` in `CategorySheet.jsx` using explicit flexbox + `direction: dir`, not inline bidi reordering (proved inconsistent across browsers/scripts for this).
- **Nutrition's stat-row/fact-table are the one deliberate exception** to normal RTL-aware layout: they're hardcoded `dir="ltr"` regardless of app language, matching a universal nutrition-label convention from Figma. Don't copy that forced-ltr pattern elsewhere (like kosher rows) without a similarly strong universal-convention reason — it's the exception, not the default.

## When this applies

Any new `CategorySheet` body, category chip, or list row that pairs an icon/image/badge with translatable text across all 3 languages.
