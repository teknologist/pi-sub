---
"@marckrenn/pi-sub-core": patch
"@marckrenn/pi-sub-bar": patch
"@marckrenn/pi-sub-shared": patch
---

Improve startup responsiveness by deferring refreshes and watchers, skipping headless UI work, and unref-ing long-lived timers so pi CLI commands exit cleanly.
