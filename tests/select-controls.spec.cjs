const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
const b=await chromium.launch({headless:true,executablePath:'C:/Users/Dell/AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe'});
const p=await b.newPage({viewport:{width:1440,height:1000}});
const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&r.url().includes('/assets/'))errors.push(r.url())});
await p.goto('http://127.0.0.1:4173/pages/products.html');
const players=p.locator('#catalog-players').locator('..');
await players.locator('.select-trigger').click();
assert.equal(await players.locator('.select-menu').isVisible(),true);
await players.getByRole('option').nth(3).click();
assert.equal(await p.locator('#catalog-players').inputValue(),'3-4');
assert.equal(await players.locator('.select-menu').isVisible(),false);
await players.locator('.select-trigger').focus();
await p.keyboard.press('ArrowDown');await p.keyboard.press('Home');await p.keyboard.press('Enter');
assert.equal(await p.locator('#catalog-players').inputValue(),'');
for(const theme of ['light','dark']){
await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);
const ages=p.locator('#catalog-age').locator('..');await ages.locator('.select-trigger').click();
const option=ages.getByRole('option').nth(1);await option.hover();
assert.equal(await option.evaluate(e=>getComputedStyle(e).backgroundColor),await p.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()).then(c=>c==='#343b78'?'rgb(52, 59, 120)':'rgb(165, 180, 252)'));
await p.screenshot({path:'test-results/select-'+theme+'.png'});await p.keyboard.press('Escape');
}
for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:900});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
assert.deepEqual(errors,[]);await b.close();console.log('Select controls passed: pointer selection, keyboard selection, Escape, native filter updates, both themes, responsive widths and asset loading.');
})().catch(e=>{console.error(e);process.exit(1)});
