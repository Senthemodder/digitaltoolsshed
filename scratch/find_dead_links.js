// scratch/find_dead_links.js — Internal Link Health Crawler for Digital Tools Shed
import { crawlInternalLinks, DIST, ROOT } from '../tests/verify_expansion.js';

console.log('\n🔍 Crawling internal links across all compiled HTML files in dist/...\n');

const report = crawlInternalLinks(DIST, ROOT);
console.log(`Scanned ${report.scannedFiles} HTML files.`);
console.log(`Checked ${report.totalLinksChecked} internal links.`);

if (report.deadLinks.length > 0) {
  console.error(`\n❌ Found ${report.deadLinks.length} dead internal link(s):\n`);
  for (const dl of report.deadLinks) {
    console.error(`  - Source: ${dl.source}`);
    console.error(`    Href:   "${dl.href}"`);
    console.error(`    Target: ${dl.resolvedTarget}\n`);
  }
  process.exit(1);
} else {
  console.log('\n✅ Exactly 0 dead internal links found across all pages! Link health is 100% clean.\n');
  process.exit(0);
}
