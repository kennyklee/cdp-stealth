# CDP Stealth

Human-like input timing for Chrome DevTools Protocol automation.

> ⚠️ **Early stage / work in progress.** This package provides basic mouse and typing timing helpers. It does NOT yet include fingerprint evasion, navigator prop spoofing, or other anti-detection features. See [Roadmap](#roadmap) for what's planned.

## What It Does

Connects to real Chrome via CDP and adds human-like timing to mouse movements and typing:
- Easing curves on mouse movements (not teleportation)
- Variable typing speed with per-key delays
- Random jitter on mouse paths

## What It Does NOT Do (Yet)

- ❌ WebDriver flag removal
- ❌ Navigator/plugin spoofing
- ❌ WebGL/Canvas/Audio fingerprint evasion
- ❌ User-agent or header alignment
- ❌ Iframe patching
- ❌ Timezone/locale spoofing

For production anti-detection, consider [puppeteer-extra-plugin-stealth](https://github.com/nickshatilo/puppeteer-extra-plugin-stealth) which covers these.

## Installation

```bash
npm install github:kennyklee/cdp-stealth
```

## Prerequisites

Start Chrome with remote debugging:

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug

# Linux
google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug
```

## Usage

```typescript
import { StealthBrowser } from 'cdp-stealth';

const browser = new StealthBrowser({ port: 9222 });
await browser.connect();
await browser.goto('https://example.com');

// Human-like mouse movement
await browser.mouseMove(100, 100, 500, 300, { steps: 20, jitter: 3 });

// Type with variable delays
await browser.type('hello@example.com', { minDelay: 50, maxDelay: 150 });

await browser.close();
```

## API

### `new StealthBrowser(options?)`
- `port` (default: 9222) — Chrome debugging port
- `host` (default: 'localhost')

### `browser.goto(url)` — Navigate and wait for load
### `browser.click(x, y)` — Click with mouse approach animation
### `browser.clickSelector(selector)` — Find element and click
### `browser.type(text, options?)` — Type with variable delays
### `browser.press(key)` — Press special key
### `browser.mouseMove(fromX, fromY, toX, toY, options?)` — Eased mouse movement
### `browser.waitForSelector(selector, timeout?)` — Wait for element
### `browser.evaluate(expression)` — Run JS in page
### `browser.screenshot()` — Capture screenshot
### `browser.close()` — Disconnect

## Roadmap

- [ ] WebDriver flag removal (`navigator.webdriver`)
- [ ] Navigator prop spoofing (plugins, languages, platform)
- [ ] WebGL/Canvas fingerprint noise
- [ ] User-agent and header consistency
- [ ] Scroll and hover behavior
- [ ] Chrome runtime shims
- [ ] Audio fingerprint evasion

## License

MIT — Built by [Raccoon Labs](https://raccoonlabs.ai)
