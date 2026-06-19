const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  // Login
  await page.goto('http://localhost:5174/login');
  await page.waitForTimeout(1000);
  await page.fill('input[type="email"]', 'asiffmahmad9@gmail.com');
  await page.fill('input[type="password"]', 'Welcome@01');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  
  await page.goto('http://localhost:5174/goals');
  await page.waitForTimeout(2000);
  
  await page.click('button:has-text("Create Goal")');
  await page.waitForTimeout(1000);
  await page.click('button[aria-label="Choose date"]');
  await page.waitForTimeout(2000);
  
  console.log("SUCCESS!");
  await browser.close();
})();
