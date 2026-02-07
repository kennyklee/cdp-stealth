/**
 * CDP Stealth - Human-like browser automation via Chrome DevTools Protocol
 * 
 * Bypasses bot detection (PerimeterX, Cloudflare, DataDome) by:
 * - Using real Chrome with remote debugging (no webdriver flag)
 * - Human-like mouse movements with easing curves
 * - Natural typing with variable delays
 * - Realistic timing between actions
 */

/// <reference types="node" />
const CDP = require('chrome-remote-interface');

export interface StealthOptions {
  port?: number;
  host?: string;
}

export interface MouseOptions {
  steps?: number;
  jitter?: number;
}

export interface TypeOptions {
  minDelay?: number;
  maxDelay?: number;
}

export class StealthBrowser {
  private client: any = null;
  private port: number;
  private host: string;

  constructor(options: StealthOptions = {}) {
    this.port = options.port || 9222;
    this.host = options.host || 'localhost';
  }

  /**
   * Connect to Chrome with remote debugging enabled
   */
  async connect(): Promise<void> {
    this.client = await CDP({ port: this.port, host: this.host });
    
    // Enable required domains
    await this.client.Page.enable();
    await this.client.Runtime.enable();
    await this.client.Input.enable();
  }

  /**
   * Navigate to a URL
   */
  async goto(url: string): Promise<void> {
    if (!this.client) throw new Error('Not connected');
    await this.client.Page.navigate({ url });
    await this.client.Page.loadEventFired();
  }

  /**
   * Move mouse with human-like easing curve
   */
  async mouseMove(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    options: MouseOptions = {}
  ): Promise<void> {
    if (!this.client) throw new Error('Not connected');

    const steps = options.steps || 20;
    const jitter = options.jitter || 3;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      
      // Ease-in-out curve for natural acceleration/deceleration
      const ease = t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;

      // Add subtle randomness (micro-movements)
      const x = fromX + (toX - fromX) * ease + (Math.random() - 0.5) * jitter;
      const y = fromY + (toY - fromY) * ease + (Math.random() - 0.5) * jitter;

      await this.client.Input.dispatchMouseEvent({
        type: 'mouseMoved',
        x: Math.round(x),
        y: Math.round(y),
      });

      // Variable delay between movements
      await this.sleep(10 + Math.random() * 20);
    }
  }

  /**
   * Click at current position with realistic timing
   */
  async click(x: number, y: number): Promise<void> {
    if (!this.client) throw new Error('Not connected');

    // Move to target first
    await this.mouseMove(x - 100, y - 50, x, y);

    // Small pause before clicking (human hesitation)
    await this.sleep(50 + Math.random() * 100);

    // Mouse down
    await this.client.Input.dispatchMouseEvent({
      type: 'mousePressed',
      x,
      y,
      button: 'left',
      clickCount: 1,
    });

    // Realistic click duration
    await this.sleep(50 + Math.random() * 50);

    // Mouse up
    await this.client.Input.dispatchMouseEvent({
      type: 'mouseReleased',
      x,
      y,
      button: 'left',
      clickCount: 1,
    });

    // Post-click pause
    await this.sleep(100 + Math.random() * 200);
  }

  /**
   * Type text with human-like timing
   */
  async type(text: string, options: TypeOptions = {}): Promise<void> {
    if (!this.client) throw new Error('Not connected');

    const minDelay = options.minDelay || 50;
    const maxDelay = options.maxDelay || 150;

    for (const char of text) {
      // Key down
      await this.client.Input.dispatchKeyEvent({
        type: 'keyDown',
        text: char,
      });

      // Small delay for key press duration
      await this.sleep(20 + Math.random() * 30);

      // Key up
      await this.client.Input.dispatchKeyEvent({
        type: 'keyUp',
        text: char,
      });

      // Variable delay between keystrokes (faster for common sequences)
      const delay = minDelay + Math.random() * (maxDelay - minDelay);
      await this.sleep(delay);
    }
  }

  /**
   * Press a special key (Enter, Tab, etc.)
   */
  async press(key: string): Promise<void> {
    if (!this.client) throw new Error('Not connected');

    await this.client.Input.dispatchKeyEvent({
      type: 'keyDown',
      key,
    });

    await this.sleep(30 + Math.random() * 50);

    await this.client.Input.dispatchKeyEvent({
      type: 'keyUp',
      key,
    });

    await this.sleep(100 + Math.random() * 100);
  }

  /**
   * Execute JavaScript in the page context
   */
  async evaluate<T>(expression: string): Promise<T> {
    if (!this.client) throw new Error('Not connected');

    const result = await this.client.Runtime.evaluate({
      expression,
      returnByValue: true,
    });

    return result.result.value as T;
  }

  /**
   * Find element by selector and return its bounding box
   */
  async getBoundingBox(selector: string): Promise<{ x: number; y: number; width: number; height: number } | null> {
    const script = `
      (function() {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      })()
    `;
    
    return this.evaluate(script);
  }

  /**
   * Click an element by selector with human-like behavior
   */
  async clickSelector(selector: string): Promise<void> {
    const box = await this.getBoundingBox(selector);
    if (!box) throw new Error(`Element not found: ${selector}`);

    // Click in center with some randomness
    const x = box.x + box.width / 2 + (Math.random() - 0.5) * (box.width * 0.3);
    const y = box.y + box.height / 2 + (Math.random() - 0.5) * (box.height * 0.3);

    await this.click(x, y);
  }

  /**
   * Wait for an element to appear
   */
  async waitForSelector(selector: string, timeout: number = 10000): Promise<void> {
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
      const box = await this.getBoundingBox(selector);
      if (box) return;
      await this.sleep(100);
    }

    throw new Error(`Timeout waiting for: ${selector}`);
  }

  /**
   * Take a screenshot
   */
  async screenshot(): Promise<Buffer> {
    if (!this.client) throw new Error('Not connected');

    const { data } = await this.client.Page.captureScreenshot({ format: 'png' });
    return Buffer.from(data, 'base64');
  }

  /**
   * Close connection
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Convenience function
export async function connect(options?: StealthOptions): Promise<StealthBrowser> {
  const browser = new StealthBrowser(options);
  await browser.connect();
  return browser;
}

export default StealthBrowser;
