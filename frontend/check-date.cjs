const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  await page.goto('http://localhost:5173/login');
  await page.waitForTimeout(2000);
  
  // Register a new user
  await page.goto('http://localhost:5173/register');
  await page.waitForTimeout(1000);
  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="email"]', 'test@test.com');
  await page.fill('input[name="password"]', 'Test@123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  
  // Login
  await page.goto('http://localhost:5173/login');
  await page.waitForTimeout(1000);
  await page.fill('input[type="email"]', 'test@test.com');
  await page.fill('input[type="password"]', 'Test@123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  
  await page.goto('http://localhost:5173/goals');
  await page.waitForTimeout(2000);
  
  try {
      await page.click('button:has-text("Create Goal")');
      await page.waitForTimeout(1000);
      await page.click('button[aria-label="Choose date"]');
      await page.waitForTimeout(2000);
  } catch(e) {
      console.log('SCRIPT ERROR:', e.message);
  }
  
  await browser.close();
})();
