/**
 * Example: Fiverr login with Google OAuth
 * 
 * Prerequisites:
 * 1. Chrome running with: --remote-debugging-port=9222
 * 2. Navigate to https://www.fiverr.com/login
 * 
 * This example demonstrates bypassing PerimeterX bot detection.
 */

import { connect } from '../src';

async function main() {
  console.log('Connecting to Chrome...');
  const browser = await connect({ port: 9222 });

  console.log('Waiting for Google login button...');
  await browser.waitForSelector('button[data-testid="google-button"]');

  console.log('Clicking Google login (with human-like movement)...');
  await browser.clickSelector('button[data-testid="google-button"]');

  // Wait for Google OAuth popup
  console.log('Waiting for Google OAuth page...');
  await new Promise(r => setTimeout(r, 2000));

  // Note: At this point, a popup opens. You'd need to:
  // 1. Get the popup's target ID from CDP
  // 2. Connect to it
  // 3. Type email/password

  console.log('Google OAuth popup should be open.');
  console.log('Manual steps needed: type email, password, complete 2FA if any.');

  // For a complete automation, you'd continue like this:
  // await browser.waitForSelector('input[type="email"]');
  // await browser.clickSelector('input[type="email"]');
  // await browser.type('your-email@gmail.com');
  // await browser.press('Enter');
  // ... etc

  await browser.close();
}

main().catch(console.error);
