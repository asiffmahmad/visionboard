const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  const url = 'http://localhost:5173';
  
  try {
    await page.goto(`${url}/login`);
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]')
    ]);
    
    console.log("Logged in!");
    const routes = ['/focus', '/dashboard', '/visions', '/goals', '/tasks', '/habits', '/notes', '/journal', '/profile', '/admin'];
    
    for (const route of routes) {
      console.log(`Testing ${route}...`);
      await page.goto(`${url}${route}`);
      await page.waitForTimeout(1000);
      const isError = await page.evaluate(() => document.body.innerHTML.includes('Error') || document.body.innerHTML.includes('Failed'));
      if (isError) {
         console.log(`Found 'Error' text on ${route}`);
      }
    }
    
  } catch (err) {
    console.error('Test script crashed:', err);
  } finally {
    console.log('--- Errors Found ---');
    console.log(errors.join('\n'));
    await browser.close();
  }
})();
