# @marckrenn/pi-sub-status

## 1.5.0

### Minor Changes

- [#56](https://github.com/marckrenn/pi-sub/pull/56) [`864cc1b`](https://github.com/marckrenn/pi-sub/commit/864cc1bbc91897d934c0545a29f508862231963c) - Prioritize usage windows that match the active model before emitting `sub-core:update-current`, so compact status clients show the correct quota windows (including Codex Spark and Antigravity model-specific windows).

  Also make settings list navigation compatible with both old and new `@mariozechner/pi-tui` keybinding APIs, preventing crashes in submenus on older Pi runtimes where `getEditorKeybindings()` is unavailable.

  Thanks [@dnouri](https://github.com/dnouri) for [#54](https://github.com/marckrenn/pi-sub/pull/54).

### Patch Changes

- Updated dependencies [[`864cc1b`](https://github.com/marckrenn/pi-sub/commit/864cc1bbc91897d934c0545a29f508862231963c)]:
  - @marckrenn/pi-sub-core@1.5.0
  - @marckrenn/pi-sub-shared@1.5.0

## 1.4.0

### Minor Changes

- [#49](https://github.com/marckrenn/pi-sub/pull/49) [`8723b10`](https://github.com/marckrenn/pi-sub/commit/8723b10a240e1bf4e2ee20703c4b81f6968c44ae) Thanks [@marckrenn](https://github.com/marckrenn)! - Add `@marckrenn/pi-sub-status`, a compact status-line client that renders `sub-core` usage updates via `ctx.ui.setStatus(...)`.

  Thanks [@dnouri](https://github.com/dnouri) for PR [#48](https://github.com/marckrenn/pi-sub/pull/48).

### Patch Changes

- Updated dependencies []:
  - @marckrenn/pi-sub-core@1.3.1
  - @marckrenn/pi-sub-shared@1.3.1
