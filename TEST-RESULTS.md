# cdp-stealth test results (2026-02-08)

## Summary
Chrome/Chromium is **not available** in this environment (both `google-chrome` and `chromium-browser` return permission denied). I could not run a live bot‑detection test. Below is a thorough code review of `src/index.ts`.

**Verdict:** Not production‑ready for serious bot detection. This is a thin CDP helper with basic mouse/typing timing; it lacks most of the stealth evasions that real detectors use. It will be detected on moderately strict sites.

---

## What’s implemented
- Connects to Chrome via `chrome-remote-interface` (CDP).
- Basic page control: navigate, evaluate, screenshot.
- Basic human-like interaction:
  - Mouse move with quadratic ease-in-out curve.
  - Random jitter (±3px) per step.
  - Variable delays between moves and clicks.
  - Typing with per-key delays.

## Easing curve realism
- Uses a simple quadratic ease‑in‑out: 
  - `ease = 2t^2` then `1 - ((-2t+2)^2)/2`.
- This is **mathematically smooth** but **too uniform and predictable**:
  - Fixed number of steps (default 20).
  - Fixed per‑step delay distribution (10–30ms) regardless of distance.
  - No velocity variance, overshoot, micro‑pauses, or path curvature.
  - Always starts from (x‑100,y‑50) for clicks → unnatural repeated pattern.

Conclusion: looks “robotic smooth” rather than human. It may help with naive heuristics but not modern detection.

---

## Missing vs. puppeteer‑extra‑plugin‑stealth (major gaps)
This package **does not implement** the common stealth evasions:

### WebDriver / Automation Flags
- ❌ No removal/patching of `navigator.webdriver`.
- ❌ No suppression of automation flags (`--enable-automation`, `AutomationControlled`).
- ❌ No Chrome `--disable-blink-features=AutomationControlled` guidance.

### Navigator / Window / Chrome props
- ❌ No patching of:
  - `navigator.plugins`, `navigator.mimeTypes`
  - `navigator.languages`, `navigator.language`
  - `navigator.permissions` (notifications etc.)
  - `navigator.hardwareConcurrency`, `deviceMemory`, `platform`, `vendor`
  - `window.chrome` object
  - `navigator.connection` / `devicePixelRatio`
  - `navigator.maxTouchPoints`

### WebGL / Canvas / Audio
- ❌ No WebGL vendor/renderer spoofing (ANGLE/SwiftShader signatures).
- ❌ No canvas fingerprint noise/perturbation.
- ❌ No audio fingerprint evasion.

### Fonts / Media / Codecs
- ❌ No media codecs spoofing (e.g., `video/mp4; codecs`).
- ❌ No font fingerprint controls.

### Timing / Interaction realism
- ⚠️ Basic randomized delays only; no human-like variability:
  - No errant clicks/backspaces.
  - No dynamic typing speeds per bigram/word.
  - No scrolling behavior or wheel events.
  - No focus/hover preconditions.

### Network / TLS / Headers
- ❌ No user‑agent override.
- ❌ No Accept‑Language / locale alignment.
- ❌ No timezone spoof.
- ❌ No client‑hint headers consistency.

### Other stealth tactics
- ❌ No iframe/contentWindow patching.
- ❌ No `navigator.permissions.query` fix.
- ❌ No `outerWidth/outerHeight` fixes.
- ❌ No `chrome.runtime` / `chrome.loadTimes` / `chrome.csi` shims.

---

## What’s covered vs. missing (quick list)
**Covered:**
- CDP connection
- Mouse move/click timing
- Typing timing

**Missing (critical):**
- WebDriver/automation flags & `navigator.webdriver`
- Navigator prop spoofing (plugins, languages, platform, etc.)
- WebGL + canvas + audio fingerprinting
- User‑agent / headers / locale / timezone consistency
- Realistic interaction patterns (scrolling, focus, hover)
- Media codecs / font fingerprint handling

---

## Bottom line
This is **not a stealth solution** in its current form. It provides *basic* human‑like input timing but **none of the actual fingerprint evasions** that modern bot detectors look for. It will likely fail against Cloudflare, DataDome, PerimeterX, and similar services.

If the goal is production‑grade stealth, it needs a large set of evasions similar to `puppeteer-extra-plugin-stealth` (or use that plugin directly).