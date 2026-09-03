/**
 * tests/verify_expansion.js
 * 
 * Automated E2E Test Verification Suite for Digital Tools Shed
 * Validates the 458-tool catalog expansion to 1,000+ indexable pages across Tiers 1-4.
 * 
 * Execution:
 *   & "D:\Program Files\nodejs\node.exe" tests/verify_expansion.js
 *   & "D:\Program Files\nodejs\node.exe" tests/verify_expansion.js --tier=1
 *   & "D:\Program Files\nodejs\node.exe" tests/verify_expansion.js --category=science
 *   & "D:\Program Files\nodejs\node.exe" tests/verify_expansion.js --verbose
 * 
 * Exit Code: 0 on all passed, 1 on any failure.
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const ROOT = resolve(__dirname, '..');
export const DIST = join(ROOT, 'dist');
export const DOMAIN = 'https://digitaltoolsshed.com';
export const INDEXNOW_KEY = 'd03e981bc84f479a9e3a6c2f84b1509b';

export const EXPANSION_CATEGORIES = [
  { id: 'science', name: 'Obscure Science & Astrophysics', minTools: 115, milestone: 'M2' },
  { id: 'psychology', name: '2 AM Existential & Psychology', minTools: 115, milestone: 'M3' },
  { id: 'trade', name: 'Niche Construction & Trade Math', minTools: 114, milestone: 'M4' },
  { id: 'units', name: 'Esoteric & Historical Units', minTools: 114, milestone: 'M5' }
];

// CLI Arguments Parsing
const args = process.argv.slice(2);
const tierArg = args.find(a => a.startsWith('--tier=') || a.startsWith('-t='));
const categoryArg = args.find(a => a.startsWith('--category=') || a.startsWith('-c='));
const targetTier = tierArg ? parseInt(tierArg.split('=')[1], 10) : null;
const targetCategory = categoryArg ? categoryArg.split('=')[1].toLowerCase().trim() : null;
const isVerbose = args.includes('--verbose') || args.includes('-v');

// Test Runner State
export const results = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  tiers: {
    1: { name: 'Tier 1: Feature & Catalog Coverage', passed: 0, failed: 0, skipped: 0, tests: [] },
    2: { name: 'Tier 2: Metadata, Schema & Security Integrity', passed: 0, failed: 0, skipped: 0, tests: [] },
    3: { name: 'Tier 3: Link Health & Zero-Dependency Execution', passed: 0, failed: 0, skipped: 0, tests: [] },
    4: { name: 'Tier 4: Build & IndexNow Readiness', passed: 0, failed: 0, skipped: 0, tests: [] }
  }
};

/**
 * Register and execute a test
 */
export function runTest(tierNumber, testName, testFn, categoryId = null) {
  results.total++;
  const tier = results.tiers[tierNumber];

  if (targetTier !== null && targetTier !== tierNumber) {
    results.skipped++;
    tier.skipped++;
    tier.tests.push({ name: testName, status: 'SKIPPED', message: `Filtered out by --tier=${targetTier}` });
    return;
  }

  if (targetCategory && categoryId && categoryId !== targetCategory) {
    results.skipped++;
    tier.skipped++;
    tier.tests.push({ name: testName, status: 'SKIPPED', message: `Filtered out by --category=${targetCategory}` });
    return;
  }

  try {
    testFn();
    results.passed++;
    tier.passed++;
    tier.tests.push({ name: testName, status: 'PASSED' });
    console.log(`  [PASS] ${testName}`);
  } catch (err) {
    results.failed++;
    tier.failed++;
    const errMsg = err.message || String(err);
    tier.tests.push({ name: testName, status: 'FAILED', message: errMsg, stack: isVerbose ? err.stack : undefined });
    console.error(`  [FAIL] ${testName}`);
    console.error(`         Reason: ${errMsg}`);
  }
}

/**
 * Assertion Utilities
 */
export function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message || 'Assertion failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

export function assertGte(actual, minimum, message) {
  if (actual < minimum) {
    throw new Error(`${message || 'Assertion failed'}: expected >= ${minimum}, got ${actual}`);
  }
}

/**
 * Filesystem Utilities
 */
export function getAllFilesRecursive(dir, ext = '.html') {
  if (!existsSync(dir)) return [];
  let files = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFilesRecursive(fullPath, ext));
    } else if (!ext || entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

export function getHtmlFilesInDir(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter(item => !item.isDirectory() && item.name.endsWith('.html'))
    .map(item => item.name);
}

/**
 * Comprehensive Internal Link Health Crawler
 * Crawls all HTML files in dist/ and resolves every internal link.
 * 
 * @param {string} distDir 
 * @param {string} rootDir 
 * @returns {{ scannedFiles: number, totalLinksChecked: number, deadLinks: Array<{source: string, href: string, resolvedTarget: string}> }}
 */
export function crawlInternalLinks(distDir = DIST, rootDir = ROOT) {
  const allHtmlFiles = getAllFilesRecursive(distDir, '.html');
  let totalLinksChecked = 0;
  const deadLinks = [];

  for (const htmlFile of allHtmlFiles) {
    const content = readFileSync(htmlFile, 'utf8');
    const hrefMatches = [...content.matchAll(/href=["']([^"'#]+)(?:#[^"']*)?["']/gi)];

    for (const match of hrefMatches) {
      const rawHref = match[1].trim();

      // Skip non-navigational or external protocols
      if (!rawHref ||
          rawHref.startsWith('http:') ||
          rawHref.startsWith('https:') ||
          rawHref.startsWith('mailto:') ||
          rawHref.startsWith('tel:') ||
          rawHref.startsWith('javascript:') ||
          rawHref.startsWith('data:') ||
          rawHref.startsWith('//')) {
        continue;
      }

      totalLinksChecked++;
      const cleanHref = rawHref.split('?')[0];

      let targetPath;
      if (cleanHref.startsWith('/')) {
        // Root-relative path (/calc/meters-to-inches)
        const relativeToDist = cleanHref.slice(1);
        if (cleanHref === '/' || cleanHref === '') {
          targetPath = join(distDir, 'index.html');
        } else if (cleanHref.endsWith('.html') || cleanHref.endsWith('.xml') || cleanHref.endsWith('.txt') || cleanHref.endsWith('.xsl')) {
          targetPath = join(distDir, relativeToDist);
        } else {
          // Try clean URL candidates: /path.html, /path/index.html, /path
          const candidateHtml = join(distDir, `${relativeToDist}.html`);
          const candidateIndex = join(distDir, relativeToDist, 'index.html');
          const candidateDir = join(distDir, relativeToDist);

          if (existsSync(candidateHtml)) targetPath = candidateHtml;
          else if (existsSync(candidateIndex)) targetPath = candidateIndex;
          else if (existsSync(candidateDir)) targetPath = candidateDir;
          else targetPath = candidateHtml;
        }
      } else {
        // Document-relative path (../calc/meters-to-inches.html)
        const currentDir = dirname(htmlFile);
        const candidateDirect = join(currentDir, cleanHref);
        const candidateHtml = join(currentDir, `${cleanHref}.html`);
        const candidateIndex = join(currentDir, cleanHref, 'index.html');

        if (existsSync(candidateDirect)) targetPath = candidateDirect;
        else if (existsSync(candidateHtml)) targetPath = candidateHtml;
        else if (existsSync(candidateIndex)) targetPath = candidateIndex;
        else targetPath = candidateDirect;
      }

      if (!existsSync(targetPath)) {
        deadLinks.push({
          source: htmlFile.replace(rootDir, ''),
          href: rawHref,
          resolvedTarget: targetPath.replace(rootDir, '')
        });
      }
    }
  }

  return {
    scannedFiles: allHtmlFiles.length,
    totalLinksChecked,
    deadLinks
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EXECUTE SUITE
// ─────────────────────────────────────────────────────────────────────────────

export function runSuite() {
  // ─── TIER 1: FEATURE & CATALOG COVERAGE ───────────────────────────────────
  console.log('\n============================================================');
  console.log(' RUNNING TIER 1: Feature & Catalog Coverage');
  console.log('============================================================');

  runTest(1, 'Sitemap exists, is valid XML, and contains >= 1,000 indexable URLs', () => {
    const sitemapPath = join(DIST, 'sitemap.xml');
    assert(existsSync(sitemapPath), `sitemap.xml does not exist at ${sitemapPath}`);

    const content = readFileSync(sitemapPath, 'utf8');
    assert(content.includes('<urlset'), 'sitemap.xml is missing <urlset> root element');
    assert(content.includes('</urlset>'), 'sitemap.xml is missing </urlset> closing tag');

    const locMatches = [...content.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(m => m[1].trim());
    assertGte(locMatches.length, 1000, `Total indexable URLs in sitemap.xml`);

    // Verify URL formatting
    for (const url of locMatches) {
      assert(url.startsWith(DOMAIN), `URL in sitemap does not start with ${DOMAIN}: ${url}`);
      assert(!url.endsWith('.html'), `URL in sitemap must have clean slug without .html: ${url}`);
    }
  });

  for (const cat of EXPANSION_CATEGORIES) {
    runTest(1, `${cat.name} (dist/${cat.id}/) contains >= ${cat.minTools} tools + index.html [${cat.milestone}]`, () => {
      const dir = join(DIST, cat.id);
      assert(existsSync(dir), `Category directory dist/${cat.id}/ does not exist (${cat.milestone} pending)`);

      const htmlFiles = getHtmlFilesInDir(dir);
      assert(htmlFiles.includes('index.html'), `Hub page dist/${cat.id}/index.html is missing`);

      const toolPages = htmlFiles.filter(f => f !== 'index.html');
      assertGte(toolPages.length, cat.minTools, `Tool pages count in dist/${cat.id}/`);
    }, cat.id);
  }

  runTest(1, 'Aggregate catalog expansion contains >= 458 new tools + 4 hubs (462 total)', () => {
    let totalTools = 0;
    let totalHubs = 0;

    for (const cat of EXPANSION_CATEGORIES) {
      const dir = join(DIST, cat.id);
      if (existsSync(dir)) {
        const htmlFiles = getHtmlFilesInDir(dir);
        if (htmlFiles.includes('index.html')) totalHubs++;
        const tools = htmlFiles.filter(f => f !== 'index.html');
        totalTools += tools.length;
      }
    }

    assertGte(totalTools, 458, `Total new tools across all 4 expansion categories`);
    assertEqual(totalHubs, 4, `All 4 category hub pages must exist`);
  });

  // ─── TIER 2: METADATA, SCHEMA & SECURITY INTEGRITY ────────────────────────
  console.log('\n============================================================');
  console.log(' RUNNING TIER 2: Metadata, Schema & Security Integrity');
  console.log('============================================================');

  for (const cat of EXPANSION_CATEGORIES) {
    runTest(2, `High-CTR bracketed title format ([...]): dist/${cat.id}/ [${cat.milestone}]`, () => {
      const dir = join(DIST, cat.id);
      assert(existsSync(dir), `Category directory dist/${cat.id}/ does not exist (${cat.milestone} pending)`);

      const files = getHtmlFilesInDir(dir).filter(f => f !== 'index.html');
      assertGte(files.length, 1, `No tool pages found in dist/${cat.id}/ to validate`);

      const violations = [];
      for (const file of files) {
        const content = readFileSync(join(dir, file), 'utf8');
        const titleMatch = content.match(/<title>([^<]+)<\/title>/i);

        if (!titleMatch) {
          violations.push(`${file}: Missing <title> tag`);
          continue;
        }

        const title = titleMatch[1].trim();
        const hasBrackets = title.includes('[') && title.includes(']');
        if (!hasBrackets) {
          violations.push(`${file}: Title missing bracketed query pattern -> "${title}"`);
        }
      }

      if (violations.length > 0) {
        const sample = violations.slice(0, 5).join('\n         ');
        throw new Error(`${violations.length} pages in dist/${cat.id}/ failed bracketed title check:\n         ${sample}`);
      }
    }, cat.id);

    runTest(2, `Meta descriptions attribute escaping & length: dist/${cat.id}/ [${cat.milestone}]`, () => {
      const dir = join(DIST, cat.id);
      assert(existsSync(dir), `Category directory dist/${cat.id}/ does not exist (${cat.milestone} pending)`);

      const files = getHtmlFilesInDir(dir).filter(f => f !== 'index.html');
      assertGte(files.length, 1, `No tool pages found in dist/${cat.id}/ to validate`);

      const violations = [];
      for (const file of files) {
        const content = readFileSync(join(dir, file), 'utf8');
        const metaMatch = content.match(/<meta\s+name=["']description["']\s+content="([^"]*)"/i);

        if (!metaMatch) {
          const brokenMatch = content.match(/<meta\s+name=["']description["']\s+content="([^>]*)/i);
          if (brokenMatch) {
            violations.push(`${file}: Meta description truncated by unescaped raw quotes`);
          } else {
            violations.push(`${file}: Missing <meta name="description"> tag`);
          }
          continue;
        }

        const desc = metaMatch[1];
        if (desc.length < 25) {
          violations.push(`${file}: Meta description is suspiciously short (${desc.length} chars)`);
        }
        if (desc.includes('&amp;quot;')) {
          violations.push(`${file}: Double-escaped entity &amp;quot; in meta description`);
        }
      }

      if (violations.length > 0) {
        const sample = violations.slice(0, 5).join('\n         ');
        throw new Error(`${violations.length} pages in dist/${cat.id}/ failed meta description check:\n         ${sample}`);
      }
    }, cat.id);

    runTest(2, `Canonical URLs are clean without .html: dist/${cat.id}/ [${cat.milestone}]`, () => {
      const dir = join(DIST, cat.id);
      assert(existsSync(dir), `Category directory dist/${cat.id}/ does not exist (${cat.milestone} pending)`);

      const files = getHtmlFilesInDir(dir);
      assertGte(files.length, 1, `No pages found in dist/${cat.id}/ to validate`);

      const violations = [];
      for (const file of files) {
        const content = readFileSync(join(dir, file), 'utf8');
        const canonicalMatch = content.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
                               content.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);

        if (!canonicalMatch) {
          violations.push(`${file}: Missing canonical link tag`);
          continue;
        }

        const canonicalUrl = canonicalMatch[1].trim();
        if (!canonicalUrl.startsWith(DOMAIN)) {
          violations.push(`${file}: Canonical URL does not start with ${DOMAIN} -> "${canonicalUrl}"`);
        }
        if (canonicalUrl.endsWith('.html')) {
          violations.push(`${file}: Canonical URL contains .html extension -> "${canonicalUrl}"`);
        }
      }

      if (violations.length > 0) {
        const sample = violations.slice(0, 5).join('\n         ');
        throw new Error(`${violations.length} pages in dist/${cat.id}/ failed canonical URL check:\n         ${sample}`);
      }
    }, cat.id);

    runTest(2, `WebApplication JSON-LD schema validity: dist/${cat.id}/ [${cat.milestone}]`, () => {
      const dir = join(DIST, cat.id);
      assert(existsSync(dir), `Category directory dist/${cat.id}/ does not exist (${cat.milestone} pending)`);

      const files = getHtmlFilesInDir(dir).filter(f => f !== 'index.html');
      assertGte(files.length, 1, `No tool pages found in dist/${cat.id}/ to validate`);

      const violations = [];
      for (const file of files) {
        const content = readFileSync(join(dir, file), 'utf8');
        const jsonLdBlocks = [...content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];

        if (jsonLdBlocks.length === 0) {
          violations.push(`${file}: No JSON-LD blocks found`);
          continue;
        }

        let foundWebApp = false;
        for (const block of jsonLdBlocks) {
          let parsed;
          try {
            parsed = JSON.parse(block[1].trim());
          } catch (e) {
            violations.push(`${file}: JSON-LD parse error: ${e.message}`);
            continue;
          }

          const schemas = Array.isArray(parsed) ? parsed : (parsed['@graph'] || [parsed]);
          for (const s of schemas) {
            if (s['@type'] === 'WebApplication') {
              foundWebApp = true;
              if (s['@context'] !== 'https://schema.org') {
                violations.push(`${file}: WebApplication @context is not https://schema.org`);
              }
              if (!s.name || typeof s.name !== 'string') {
                violations.push(`${file}: WebApplication missing name`);
              }
              if (!s.url || s.url.endsWith('.html')) {
                violations.push(`${file}: WebApplication url is invalid or has .html`);
              }
              if (!s.applicationCategory) {
                violations.push(`${file}: WebApplication missing applicationCategory`);
              }
            }
          }
        }

        if (!foundWebApp) {
          violations.push(`${file}: Missing WebApplication schema`);
        }
      }

      if (violations.length > 0) {
        const sample = violations.slice(0, 5).join('\n         ');
        throw new Error(`${violations.length} pages in dist/${cat.id}/ failed WebApplication schema check:\n         ${sample}`);
      }
    }, cat.id);

    runTest(2, `FAQPage JSON-LD schema validity (>=2 questions): dist/${cat.id}/ [${cat.milestone}]`, () => {
      const dir = join(DIST, cat.id);
      assert(existsSync(dir), `Category directory dist/${cat.id}/ does not exist (${cat.milestone} pending)`);

      const files = getHtmlFilesInDir(dir).filter(f => f !== 'index.html');
      assertGte(files.length, 1, `No tool pages found in dist/${cat.id}/ to validate`);

      const violations = [];
      for (const file of files) {
        const content = readFileSync(join(dir, file), 'utf8');
        const jsonLdBlocks = [...content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
        let foundFaq = false;

        for (const block of jsonLdBlocks) {
          let parsed;
          try {
            parsed = JSON.parse(block[1].trim());
          } catch (e) {
            continue;
          }

          const schemas = Array.isArray(parsed) ? parsed : (parsed['@graph'] || [parsed]);
          for (const s of schemas) {
            if (s['@type'] === 'FAQPage') {
              foundFaq = true;
              if (!Array.isArray(s.mainEntity) || s.mainEntity.length < 2) {
                violations.push(`${file}: FAQPage mainEntity has < 2 questions`);
              } else {
                for (const q of s.mainEntity) {
                  if (q['@type'] !== 'Question' || !q.name) {
                    violations.push(`${file}: FAQ item missing Question type or name`);
                  }
                  if (!q.acceptedAnswer || q.acceptedAnswer['@type'] !== 'Answer' || !q.acceptedAnswer.text) {
                    violations.push(`${file}: FAQ question missing valid acceptedAnswer`);
                  }
                }
              }
            }
          }
        }

        if (!foundFaq) {
          violations.push(`${file}: Missing FAQPage schema`);
        }
      }

      if (violations.length > 0) {
        const sample = violations.slice(0, 5).join('\n         ');
        throw new Error(`${violations.length} pages in dist/${cat.id}/ failed FAQPage schema check:\n         ${sample}`);
      }
    }, cat.id);
  }

  // ─── TIER 3: LINK HEALTH & ZERO-DEPENDENCY EXECUTION ──────────────────────
  console.log('\n============================================================');
  console.log(' RUNNING TIER 3: Link Health & Zero-Dependency Execution');
  console.log('============================================================');

  runTest(3, 'Internal link crawler verifies exactly 0 dead links across all HTML pages in dist/', () => {
    const report = crawlInternalLinks(DIST, ROOT);
    assertGte(report.scannedFiles, 1, 'Total HTML files scanned in dist/');

    if (isVerbose) {
      console.log(`         Scanned ${report.scannedFiles} HTML files, verified ${report.totalLinksChecked} internal links.`);
    }

    if (report.deadLinks.length > 0) {
      const summary = report.deadLinks.slice(0, 8).map(d => `[${d.source}] -> "${d.href}" (resolved: ${d.resolvedTarget})`).join('\n         ');
      throw new Error(`Found ${report.deadLinks.length} dead internal links across dist/:\n         ${summary}`);
    }
  });

  for (const cat of EXPANSION_CATEGORIES) {
    runTest(3, `Zero-dependency client execution (no CDN scripts): dist/${cat.id}/ [${cat.milestone}]`, () => {
      const dir = join(DIST, cat.id);
      assert(existsSync(dir), `Category directory dist/${cat.id}/ does not exist (${cat.milestone} pending)`);

      const files = getHtmlFilesInDir(dir).filter(f => f !== 'index.html');
      assertGte(files.length, 1, `No tool pages found in dist/${cat.id}/ to validate`);

      const forbiddenCdnRegex = /(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|cdn\.tailwindcss\.com|ajax\.googleapis\.com|code\.jquery\.com|stackpath\.bootstrapcdn\.com|maxcdn\.bootstrapcdn\.com|cdn\.skypack\.dev|esm\.sh)/i;
      const violations = [];

      for (const file of files) {
        const content = readFileSync(join(dir, file), 'utf8');
        const scriptTags = [...content.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
        let hasInlineLogic = false;

        for (const tag of scriptTags) {
          const attributes = tag[1];
          const body = tag[2].trim();
          const srcMatch = attributes.match(/src=["']([^"']+)["']/i);

          if (srcMatch) {
            const srcUrl = srcMatch[1];
            if (forbiddenCdnRegex.test(srcUrl)) {
              violations.push(`${file}: External CDN script detected -> ${srcUrl}`);
            }
          } else if (!attributes.includes('application/ld+json')) {
            if (body.includes('addEventListener') ||
                body.includes('getElementById') ||
                body.includes('querySelector') ||
                body.includes('input') ||
                body.includes('change') ||
                body.includes('function')) {
              hasInlineLogic = true;
            }

            // AST Syntax Verification via Node vm.Script
            try {
              new vm.Script(body, { filename: `${cat.id}/${file}` });
            } catch (syntaxErr) {
              violations.push(`${file}: Client-side JavaScript SyntaxError -> ${syntaxErr.message}`);
            }
          }
        }

        if (!hasInlineLogic) {
          violations.push(`${file}: Tool page missing interactive inline client calculation script`);
        }
      }

      if (violations.length > 0) {
        const sample = violations.slice(0, 5).join('\n         ');
        throw new Error(`${violations.length} pages in dist/${cat.id}/ failed zero-dependency check:\n         ${sample}`);
      }
    }, cat.id);
  }

  // ─── TIER 4: BUILD & INDEXNOW READINESS ───────────────────────────────────
  console.log('\n============================================================');
  console.log(' RUNNING TIER 4: Build & IndexNow Readiness');
  console.log('============================================================');

  runTest(4, 'IndexNow verification key file exists and matches secret key', () => {
    const keyFilePath = join(DIST, `${INDEXNOW_KEY}.txt`);
    assert(existsSync(keyFilePath), `IndexNow key file missing at ${keyFilePath}`);

    const content = readFileSync(keyFilePath, 'utf8').trim();
    assertEqual(content, INDEXNOW_KEY, `IndexNow key file content`);
  });

  runTest(4, 'robots.txt exists, allows search bots, and references sitemap.xml', () => {
    const robotsPath = join(DIST, 'robots.txt');
    assert(existsSync(robotsPath), `robots.txt missing at ${robotsPath}`);

    const content = readFileSync(robotsPath, 'utf8');
    assert(content.includes(`Sitemap: ${DOMAIN}/sitemap.xml`), `robots.txt missing Sitemap directive pointing to ${DOMAIN}/sitemap.xml`);
    assert(content.includes('Googlebot'), `robots.txt missing Googlebot directive`);
    assert(content.includes('Bingbot'), `robots.txt missing Bingbot directive`);
  });

  runTest(4, '.nojekyll file exists in dist/ root to prevent GitHub Pages Jekyll processing', () => {
    const nojekyllPath = join(DIST, '.nojekyll');
    assert(existsSync(nojekyllPath), `.nojekyll missing at ${nojekyllPath}`);
  });

  runTest(4, 'IndexNow dispatcher script (scripts/submit_indexnow.js) configuration is intact', () => {
    const scriptPath = join(ROOT, 'scripts', 'submit_indexnow.js');
    assert(existsSync(scriptPath), `submit_indexnow.js missing at ${scriptPath}`);

    const content = readFileSync(scriptPath, 'utf8');
    assert(content.includes(INDEXNOW_KEY), `submit_indexnow.js missing INDEXNOW_KEY constant`);
    assert(content.includes('digitaltoolsshed.com'), `submit_indexnow.js missing target HOST`);
    assert(content.includes('api.indexnow.org'), `submit_indexnow.js missing IndexNow Global endpoint`);
  });

  // ─── SUMMARY REPORT ───────────────────────────────────────────────────────
  console.log('\n============================================================');
  console.log(' E2E VERIFICATION TEST SUMMARY');
  console.log('============================================================');

  for (let t = 1; t <= 4; t++) {
    const tier = results.tiers[t];
    const tierStatus = tier.failed > 0 ? '❌ FAILED' : (tier.skipped > 0 && tier.passed === 0 ? '⏸ SKIPPED' : '✅ PASSED');
    console.log(`\n${tier.name} [${tierStatus}]`);
    console.log(`  Passed: ${tier.passed} | Failed: ${tier.failed} | Skipped: ${tier.skipped}`);
    for (const test of tier.tests) {
      const icon = test.status === 'PASSED' ? '✓' : (test.status === 'FAILED' ? '✗' : '–');
      console.log(`    ${icon} [${test.status}] ${test.name}`);
      if (test.message && test.status === 'FAILED') {
        console.log(`      ↳ Error: ${test.message}`);
      }
    }
  }

  console.log('\n------------------------------------------------------------');
  console.log(`Total: ${results.total} | Passed: ${results.passed} | Failed: ${results.failed} | Skipped: ${results.skipped}`);
  console.log('============================================================\n');

  return results.failed === 0;
}

// Auto-run if executed directly as CLI script
const isMainModule = process.argv[1] && resolve(process.argv[1]) === resolve(__filename);
if (isMainModule) {
  const success = runSuite();
  process.exit(success ? 0 : 1);
}
