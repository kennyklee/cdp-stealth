/**
 * CDP Stealth - Human-like browser automation via Chrome DevTools Protocol
 *
 * Bypasses bot detection (PerimeterX, Cloudflare, DataDome) by:
 * - Using real Chrome with remote debugging (no webdriver flag)
 * - Human-like mouse movements with easing curves
 * - Natural typing with variable delays
 * - Realistic timing between actions
 */
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
export declare class StealthBrowser {
    private client;
    private port;
    private host;
    constructor(options?: StealthOptions);
    /**
     * Connect to Chrome with remote debugging enabled
     */
    connect(): Promise<void>;
    /**
     * Navigate to a URL
     */
    goto(url: string): Promise<void>;
    /**
     * Move mouse with human-like easing curve
     */
    mouseMove(fromX: number, fromY: number, toX: number, toY: number, options?: MouseOptions): Promise<void>;
    /**
     * Click at current position with realistic timing
     */
    click(x: number, y: number): Promise<void>;
    /**
     * Type text with human-like timing
     */
    type(text: string, options?: TypeOptions): Promise<void>;
    /**
     * Press a special key (Enter, Tab, etc.)
     */
    press(key: string): Promise<void>;
    /**
     * Execute JavaScript in the page context
     */
    evaluate<T>(expression: string): Promise<T>;
    /**
     * Find element by selector and return its bounding box
     */
    getBoundingBox(selector: string): Promise<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>;
    /**
     * Click an element by selector with human-like behavior
     */
    clickSelector(selector: string): Promise<void>;
    /**
     * Wait for an element to appear
     */
    waitForSelector(selector: string, timeout?: number): Promise<void>;
    /**
     * Take a screenshot
     */
    screenshot(): Promise<Buffer>;
    /**
     * Close connection
     */
    close(): Promise<void>;
    private sleep;
}
export declare function connect(options?: StealthOptions): Promise<StealthBrowser>;
export default StealthBrowser;
