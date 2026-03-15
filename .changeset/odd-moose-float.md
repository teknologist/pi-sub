---
"@marckrenn/pi-sub-bar": patch
---

Fix the status-line placement defaults and behavior:

- Keep `widgetPlacement` defaulting to `belowEditor` for merged settings state.
- In `widgetPlacement: "status"`, force left alignment and truncate-only overflow.
- Status-line placement: hide status-only alignment/overflow controls and apply compact formatting; disable right padding in footer mode where trailing spaces are not safely preservable. Left padding remains applied.
