# Priority tabs + More verification

## Behaviour

- Phones and tablets show one compact row: **Home, Our Mwiri, News, Membership, More**.
- More opens an overlay containing **About MOBA, Projects & Impact, Gallery, Support MOBA and Contact**; it does not push page content down.
- All priority and panel targets are at least 44px high.
- More exposes `aria-expanded` and `aria-controls`, closes on navigation and Escape, and returns keyboard focus to the More button on Escape.
- More remains highlighted when the current page belongs to its group.
- Laptops/desktops retain the full nine-tab row.
- Member login/dashboard access remains in the header.

## Results

- Browser tests: **88/88 passed**, retaining all 38 WCAG A/AA checks and adding coverage for priority tabs, panel links, touch-target height, overflow, Escape, focus return, active state and navigation.
- Unit tests: **18/18 passed**.
- Migration checks: **18/18 passed**.
- ESLint: no errors or warnings.
- Production build and `git diff --check`: passed.
- Visual checks completed at 390, 768 and 1024 pixels, including the open More panel.
- The incremental patch clean-applied after the exact accessibility-update base and reproduced the verified Header/test changes byte for byte.

No production deployment or Supabase change was made.
