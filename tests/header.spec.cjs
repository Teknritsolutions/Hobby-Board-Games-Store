const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({headless:true,executablePath:'C:/Users/Dell/AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe'});
 const page = await browser.newPage({viewport:{width:1440,height:900}});
 const origin='http://127.0.0.1:4173/pages/';
 await page.goto(origin+'index.html');
 assert.equal(await page.locator('#nav-home a[aria-current="page"]').getAttribute('href'),'index.html');
 await page.locator('.direction-toggle').click();
 assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
 await page.goto(origin+'index-2.html');
 assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
 assert.equal(await page.locator('#nav-home a[aria-current="page"]').getAttribute('href'),'index-2.html');
 assert.equal(await page.locator('.direction-toggle').getAttribute('aria-pressed'),'true');
 await page.locator('.direction-toggle').click();
 assert.equal(await page.locator('html').getAttribute('dir'),'ltr');
 await page.reload();
 assert.equal(await page.locator('html').getAttribute('dir'),'ltr');
 for(const width of [320,390,768,1200,1280,1440,1920]) {
  await page.setViewportSize({width,height:900});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), 'Header fits at '+width);
  assert.ok(await page.locator('.direction-toggle').isVisible());
  if (width >= 1200) {
   const alignment = await page.evaluate(() => {
    const header = document.querySelector('.header-inner').getBoundingClientRect();
    const footer = document.querySelector('.site-footer .container').getBoundingClientRect();
    const logo = document.querySelector('.header-inner .logo').getBoundingClientRect();
    const button = document.querySelector('.header-actions > .btn').getBoundingClientRect();
    return Math.abs(header.left-footer.left)<1 && Math.abs(logo.left-footer.left)<1 && Math.abs(button.right-footer.right)<1;
   });
   assert.ok(alignment, 'Header aligns with footer at '+width);
  }
 }
 await page.screenshot({path:'test-results/header-final.png'});
 await browser.close();
 console.log('Header checks passed: active homepages, direction switching, persistence, and responsive controls.');
})().catch(e=>{console.error(e);process.exitCode=1;});
