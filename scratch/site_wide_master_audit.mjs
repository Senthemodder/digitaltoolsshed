import fs from 'fs';
import path from 'path';

const DIST = 'd:/Users/OS/Documents/GitHub/digitaltoolsshed/dist';

function getAllHtmlFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllHtmlFiles(fullPath, fileList);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

console.log('🔍 Running Site-Wide Master Gold Standard Audit across dist/...\n');
const allHtmlFiles = getAllHtmlFiles(DIST);
console.log(`Found ${allHtmlFiles.length} HTML files across the site.\n`);

let executableAlertErrors = [];
let externalCdnErrors = [];
let missingTitleErrors = [];
let missingCanonicalErrors = [];
let missingStylesheetErrors = [];

for (const file of allHtmlFiles) {
  const relPath = path.relative(DIST, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');

  // Check 1: Zero executable alert() calls in script blocks
  const scriptBlocks = html.match(/<script[\s\S]*?<\/script>/gi) || [];
  for (const sb of scriptBlocks) {
    if (sb.includes('alert(')) {
      executableAlertErrors.push(relPath);
      break;
    }
  }

  // Check 2: Zero external CDN script or link tags
  const externalTags = html.match(/<(?:script|link)[^>]*(?:cdn\.jsdelivr|unpkg\.com|cdnjs\.cloudflare\.com)[^>]*>/gi) || [];
  if (externalTags.length > 0) {
    externalCdnErrors.push({ file: relPath, tags: externalTags });
  }

  // Check 3: Essential SEO tags
  if (!html.includes('<title>')) {
    missingTitleErrors.push(relPath);
  }
  if (!html.includes('rel="canonical"')) {
    missingCanonicalErrors.push(relPath);
  }
  if (!html.includes('href="/assets/style.css"')) {
    missingStylesheetErrors.push(relPath);
  }
}

console.log(`Audited ${allHtmlFiles.length} files:`);
console.log(`- Executable alert() calls in scripts: ${executableAlertErrors.length}`);
if (executableAlertErrors.length > 0) console.log('  Alert errors in:', executableAlertErrors);

console.log(`- External CDN script/link tags: ${externalCdnErrors.length}`);
if (externalCdnErrors.length > 0) console.log('  CDN errors in:', externalCdnErrors);

console.log(`- Missing <title>: ${missingTitleErrors.length}`);
if (missingTitleErrors.length > 0) console.log('  Missing title in:', missingTitleErrors);

console.log(`- Missing canonical link: ${missingCanonicalErrors.length}`);
if (missingCanonicalErrors.length > 0) console.log('  Missing canonical in:', missingCanonicalErrors);

console.log(`- Missing stylesheet link: ${missingStylesheetErrors.length}`);
if (missingStylesheetErrors.length > 0) console.log('  Missing stylesheet in:', missingStylesheetErrors);

if (executableAlertErrors.length === 0 && externalCdnErrors.length === 0 && missingTitleErrors.length === 0 && missingCanonicalErrors.length === 0 && missingStylesheetErrors.length === 0) {
  console.log('\n🌟 100% GOLD STANDARD VERIFIED ACROSS ENTIRE DIGITAL TOOLS SHED (ALL ' + allHtmlFiles.length + ' PAGES)!');
  process.exit(0);
} else {
  console.error('\n❌ Site-wide audit reported issues.');
  process.exit(1);
}
