const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  // Login
  await page.goto('http://localhost:5175/login');
  await page.waitForTimeout(2000);
  await page.fill('input[type="email"]', 'asiffmahmad9@gmail.com');
  await page.fill('input[type="password"]', 'Welcome@01');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  
  await page.goto('http://localhost:5175/goals');
  await page.waitForTimeout(2000);
  
  await page.click('button:has-text("Create Goal")');
  await page.waitForTimeout(2000);
  await page.click('button[aria-label="Choose date"]');
  await page.waitForTimeout(3000);
  
  const popup = await page.$('.MuiDateCalendar-root');
  if (popup) {
      console.log("SUCCESS! Calendar popup is visible!");
      // Take a screenshot of success!
      await page.screenshot({ path: '/Users/asiff/.gemini/antigravity-ide/brain/decc2956-dd30-4244-a630-b434fa1576b0/artifacts/success.png' });
  } else {
      console.log("FAIL! Calendar popup is missing.");
  }
  
  await browser.close();
})();
