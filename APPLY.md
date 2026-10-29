# Apply the priority tabs + More navigation refinement

This patch replaces the tall 3×3 mobile tab grid with one compact priority row.

**Apply it after `moba-accessibility-fixes.patch`.** The expected sequence is: integrated quality update → visible-tabs update → accessibility update → this navigation refinement. Do not apply any patch twice.

## Extract outside the repository

```powershell
Expand-Archive "$HOME\Downloads\moba-priority-tabs-more.zip" -DestinationPath "$HOME\Downloads\moba-priority-tabs-more" -Force
```

## Check and apply once

From `C:\Users\chris.mwanja\moba-site`, preferably with a clean worktree after committing the accessibility update:

```powershell
git status --short
git apply --check "$HOME\Downloads\moba-priority-tabs-more\moba-priority-tabs-more.patch"
```

If the check prints no error:

```powershell
git apply "$HOME\Downloads\moba-priority-tabs-more\moba-priority-tabs-more.patch"
```

Only `src/components/Header.jsx` and `tests/browser/smoke.spec.js` change. No new dependency is required.

## Verify and commit

```powershell
npm run check
npm run test:browser
```

Require 18 unit tests, 18 migration checks, a successful build and **88/88 browser tests**.

```powershell
git add -A
git commit -m "Refine mobile navigation with priority tabs"
```
