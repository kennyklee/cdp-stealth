/**
 * Basic CDP Stealth example
 * 
 * Prerequisites:
 * 1. Start Chrome with remote debugging:
 *    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
 *      --remote-debugging-port=9222 \
 *      --user-data-dir=/tmp/chrome-debug
 */

import { connect } from '../src';

async function main() {
  console.log('Connecting to Chrome...');
  const browser = await connect({ port: 9222 });

  console.log('Navigating to example.com...');
  await browser.goto('https://example.com');

  console.log('Getting page title...');
  const title = await browser.evaluate<string>('document.title');
  console.log('Title:', title);

  console.log('Taking screenshot...');
  const screenshot = await browser.screenshot();
  console.log('Screenshot size:', screenshot.length, 'bytes');

  console.log('Clicking the "More information" link with human-like movement...');
  try {
    await browser.clickSelector('a');
    console.log('Clicked!');
  } catch (e) {
    console.log('Link not found, skipping');
  }

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
