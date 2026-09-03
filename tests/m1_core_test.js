// tests/m1_core_test.js — Milestone 1 Core SSG Engine & Schema Verification
import assert from 'assert';
import { renderPage, DIST, DOMAIN } from '../scripts/core.js';
import { buildScienceTools } from '../scripts/science_tools.js';
import { buildPsychologyTools } from '../scripts/psychology_tools.js';
import { buildTradeMathTools } from '../scripts/trade_math_tools.js';
import { buildHistoryUnitsTools } from '../scripts/history_units_tools.js';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('Running Milestone 1 Core SSG Engine & Schema Tests...\n');

// Test 1: WebApplication Schema Injection on New Routes
const routes = ['/science/sample-tool', '/psychology/sample-tool', '/trade/sample-tool', '/units/sample-tool'];
for (const route of routes) {
  const html = renderPage({
    title: 'Sample Test Tool | Digital Tools Shed',
    metaDesc: 'A sample tool for testing.',
    currentPath: route
  });
  assert(html.includes('"@type": "WebApplication"'), `Expected WebApplication schema for route: ${route}`);
  assert(html.includes('"applicationCategory": "UtilityApplication"'), `Expected UtilityApplication category for: ${route}`);
  console.log(`✓ WebApplication schema injected for ${route}`);
}

// Test 2: Non-tool Routes do NOT inject WebApplication schema
const nonToolRoutes = ['/', '/about.html', '/privacy.html', '/articles/my-article'];
for (const route of nonToolRoutes) {
  const html = renderPage({
    title: 'Non Tool Page | Digital Tools Shed',
    metaDesc: 'Sample non-tool page.',
    currentPath: route
  });
  assert(!html.includes('"@type": "WebApplication"'), `Did not expect WebApplication schema for route: ${route}`);
  console.log(`✓ Non-tool page correctly omits WebApplication schema for ${route}`);
}

// Test 3: Sidebar tool count updated to 1,000+ tools
const homeHtml = renderPage({
  title: 'Home | Digital Tools Shed',
  metaDesc: 'Home page.',
  currentPath: '/'
});
assert(homeHtml.includes('1,000+ tools'), 'Expected 1,000+ tools in search/tooltip text');
assert(homeHtml.includes('1,000+ Tools'), 'Expected 1,000+ Tools in sidebar footer');
assert(!homeHtml.includes('397+ tools'), 'Did not expect 397+ tools in search/tooltip text');
assert(!homeHtml.includes('397+ Tools'), 'Did not expect 397+ Tools in sidebar footer');
console.log('✓ Sidebar tool count displays 1,000+ tools and eliminates 397+ tools');

// Test 4: Module exports and interface signature for stub builders
const mockContext = {
  DIST: join(process.cwd(), 'dist'),
  DOMAIN: 'https://digitaltoolsshed.com',
  renderPage,
  writeFileSync: () => {},
  join,
  ensureDir: (dir) => { assert(dir, 'ensureDir called with valid dir'); }
};

assert.strictEqual(typeof buildScienceTools, 'function');
assert.strictEqual(typeof buildPsychologyTools, 'function');
assert.strictEqual(typeof buildTradeMathTools, 'function');
assert.strictEqual(typeof buildHistoryUnitsTools, 'function');

buildScienceTools(mockContext);
buildPsychologyTools(mockContext);
buildTradeMathTools(mockContext);
buildHistoryUnitsTools(mockContext);
console.log('✓ Modular suite builders export callable functions matching interface contract');

// Test 5: Verify sitemap contains new category hub URLs
const sitemapPath = join(DIST, 'sitemap.xml');
assert(existsSync(sitemapPath), 'dist/sitemap.xml must exist');
const sitemapContent = readFileSync(sitemapPath, 'utf8');
assert(sitemapContent.includes(`${DOMAIN}/science/`), 'Sitemap must contain /science/ hub URL');
assert(sitemapContent.includes(`${DOMAIN}/psychology/`), 'Sitemap must contain /psychology/ hub URL');
assert(sitemapContent.includes(`${DOMAIN}/trade/`), 'Sitemap must contain /trade/ hub URL');
assert(sitemapContent.includes(`${DOMAIN}/units/`), 'Sitemap must contain /units/ hub URL');
console.log('✓ Sitemap contains /science/, /psychology/, /trade/, /units/ discovery URLs');

console.log('\n✅ All Milestone 1 tests passed successfully!');
