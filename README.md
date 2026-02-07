# CDP Stealth

Human-like browser automation via Chrome DevTools Protocol. Bypasses bot detection that blocks Puppeteer/Playwright.

## Why?

Puppeteer and Playwright get detected by:
- PerimeterX
- Cloudflare
- DataDome
- And more...

They set `navigator.webdriver = true` and use instant mouse teleportation — dead giveaways.

**CDP Stealth** connects to real Chrome via the DevTools Protocol and adds human-like behavior:
- Easing curves on mouse movements
- Variable typing speed
- Natural timing between actions
- No automation flags

## Installation

```bash
npm install cdp-stealth
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

# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --remote-debugging-port=9222 --user-data-dir=%TEMP%\chrome-debug
```

## Usage

```typescript
import { connect } from 'cdp-stealth';

async function main() {
  const browser = await connect({ port: 9222 });

  // Navigate
  await browser.goto('https://www.fiverr.com/login');

  // Click with human-like mouse movement
  await browser.clickSelector('button.google-login');

  // Type with variable delays
  await browser.type('my-email@example.com');
  await browser.press('Enter');

  // Screenshot
  const screenshot = await browser.screenshot();
  
  await browser.close();
}

main();
```

## API

### `connect(options?)`

Connect to Chrome with remote debugging.

```typescript
const browser = await connect({
  port: 9222,     // Default: 9222
  host: 'localhost' // Default: localhost
});
```

### `browser.goto(url)`

Navigate to a URL and wait for page load.

### `browser.click(x, y)`

Click at coordinates with human-like approach:
- Curved mouse movement to target
- Random offset within target area
- Realistic click timing

### `browser.clickSelector(selector)`

Find element and click it.

### `browser.type(text, options?)`

Type text with variable delays between keystrokes.

```typescript
await browser.type('hello@example.com', {
  minDelay: 50,  // Minimum ms between keys
  maxDelay: 150  // Maximum ms between keys
});
```

### `browser.press(key)`

Press a special key (Enter, Tab, Escape, etc.)

### `browser.mouseMove(fromX, fromY, toX, toY, options?)`

Move mouse with easing curve.

```typescript
await browser.mouseMove(100, 100, 500, 300, {
  steps: 20,  // Points along the curve
  jitter: 3   // Random pixel offset
});
```

### `browser.waitForSelector(selector, timeout?)`

Wait for element to appear.

### `browser.evaluate(expression)`

Execute JavaScript in page context.

### `browser.screenshot()`

Capture screenshot as Buffer.

### `browser.close()`

Disconnect from Chrome.

## How It Works

1. **Real Browser** — Connects to actual Chrome, not a controlled instance
2. **No Automation Flags** — CDP doesn't set `navigator.webdriver`
3. **Human Mouse** — Easing curves with micro-jitter, not teleportation
4. **Natural Timing** — Variable delays that mimic human behavior

## Limitations

- Requires Chrome running with `--remote-debugging-port`
- One connection at a time per Chrome instance
- Not a full Puppeteer replacement (no automatic page management)

## License

MIT — Built by [Raccoon Labs](https://raccoonlabs.ai)
