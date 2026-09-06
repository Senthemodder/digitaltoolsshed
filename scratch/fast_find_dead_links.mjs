// fast_find_dead_links.mjs — Lightning Fast In-Memory Internal Link Health Crawler
import fs from 'fs';
import path from 'path';

const ROOT = 'd:/Users/OS/Documents/GitHub/digitaltoolsshed';
const DIST = path.join(ROOT, 'dist');

console.log('\n🔍 Fast Crawling internal links across all compiled HTML files in dist/...\n');
const startTime = Date.now();

// Collect all existing files into a Set with normalized forward slashes
const existingFiles = new Set();
function collectFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full);
    } else {
      const rel = path.relative(DIST, full).replace(/\\/g, '/');
      existingFiles.add(rel);
    }
  }
}
collectFiles(DIST);
console.log(`Indexed ${existingFiles.size} total files in dist/ in ${Date.now() - startTime}ms.`);

let totalLinksChecked = 0;
let scannedFiles = 0;
const deadLinks = [];

const htmlFiles = [...existingFiles].filter(f => f.endsWith('.html'));

for (const relHtml of htmlFiles) {
  scannedFiles++;
  const fullHtmlPath = path.join(DIST, relHtml);
  const content = fs.readFileSync(fullHtmlPath, 'utf8');
  const currentDirRel = path.dirname(relHtml);

  const hrefMatches = content.matchAll(/href=["']([^"'#]+)(?:#[^"']*)?["']/gi);

  for (const match of hrefMatches) {
    const rawHref = match[1].trim();

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

    let targetRel;
    if (cleanHref.startsWith('/')) {
      targetRel = cleanHref.slice(1);
    } else {
      targetRel = path.normalize(path.join(currentDirRel, cleanHref)).replace(/\\/g, '/');
    }

    if (targetRel === '' || targetRel === '.') {
      targetRel = 'index.html';
    }

    let exists = existingFiles.has(targetRel);
    if (!exists) {
      if (existingFiles.has(targetRel + '.html')) exists = true;
      else if (existingFiles.has(targetRel + '/index.html')) exists = true;
      else if (existingFiles.has(path.join(targetRel, 'index.html').replace(/\\/g, '/'))) exists = true;
    }

    if (!exists) {
      deadLinks.push({
        source: relHtml,
        href: rawHref,
        resolved: targetRel
      });
    }
  }
}

const duration = ((Date.now() - startTime) / 1000).toFixed(2);
console.log(`Scanned ${scannedFiles} HTML files in ${duration}s.`);
console.log(`Checked ${totalLinksChecked} internal links.`);

if (deadLinks.length > 0) {
  console.error(`\n❌ Found ${deadLinks.length} dead internal link(s):\n`);
  for (const dl of deadLinks.slice(0, 15)) {
    console.error(`  - Source: ${dl.source} -> Href: "${dl.href}" (Resolved: ${dl.resolved})`);
  }
  process.exit(1);
} else {
  console.log(`\n✅ Exactly 0 dead internal links found across all pages! Link health is 100% clean.\n`);
  process.exit(0);
}
