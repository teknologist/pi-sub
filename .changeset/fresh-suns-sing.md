---
"@marckrenn/pi-sub-bar": minor
"@marckrenn/pi-sub-core": minor
"@marckrenn/pi-sub-shared": minor
---

- Added an optional `showContextBar` setting (default: off), as introduced in [#10](https://github.com/marckrenn/pi-sub/pull/10) by [@pasky](https://github.com/pasky), to render the current context usage as an optional leftmost `Ctx` bar in sub-bar usage output.
- Support for Codex Spark usage (auto-selected for `gpt-5.3-codex-spark`), including model-specific window labeling behavior.
- OpenAI Status provider now surfaces the Codex-specific status endpoint instead of the generic status summary when available.
- [`80b49b1`](https://github.com/marckrenn/pi-sub/commit/80b49b16c20c942135764bcf6c4cd0516e868ce2) Fixed API key auth format handling for the z.ai provider.
