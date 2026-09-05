import { writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, TOOLS } from './core.js';

function buildSEOAssets() {
  const discoveredUrls = [`${DOMAIN}/`];

  function collectUrls(dir, prefix) {
    if (!existsSync(dir)) return;
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      if (item.isDirectory()) {
        collectUrls(join(dir, item.name), `${prefix}/${item.name}`);
      } else if (item.name.endsWith('.html') && item.name !== 'index.html' && item.name !== '404.html') {
        discoveredUrls.push(`${DOMAIN}${prefix}/${item.name.replace(/\.html$/, '')}`);
      }
    }
  }

  collectUrls(join(DIST, 'media'), '/media');
  collectUrls(join(DIST, 'convert'), '/convert');
  collectUrls(join(DIST, 'calc'), '/calc');
  collectUrls(join(DIST, 'pdf'), '/pdf');
  collectUrls(join(DIST, 'mc'), '/mc');
  collectUrls(join(DIST, 'articles'), '/articles');
  discoveredUrls.push(`${DOMAIN}/articles/`);
  collectUrls(join(DIST, 'productivity'), '/productivity');
  collectUrls(join(DIST, 'learn'), '/learn');
  discoveredUrls.push(`${DOMAIN}/learn/`);
  discoveredUrls.push(`${DOMAIN}/learn/javascript/`);
  collectUrls(join(DIST, 'learn', 'python'), '/learn/python');
  discoveredUrls.push(`${DOMAIN}/learn/python/`);
  collectUrls(join(DIST, 'learn', 'java'), '/learn/java');
  discoveredUrls.push(`${DOMAIN}/learn/java/`);
  collectUrls(join(DIST, 'dev'), '/dev');
  discoveredUrls.push(`${DOMAIN}/dev/`);
  collectUrls(join(DIST, 'text'), '/text');
  discoveredUrls.push(`${DOMAIN}/text/`);
  collectUrls(join(DIST, 'security'), '/security');
  discoveredUrls.push(`${DOMAIN}/security/`);
  collectUrls(join(DIST, 'design'), '/design');
  discoveredUrls.push(`${DOMAIN}/design/`);
  collectUrls(join(DIST, 'math'), '/math');
  discoveredUrls.push(`${DOMAIN}/math/`);
  collectUrls(join(DIST, 'finance'), '/finance');
  discoveredUrls.push(`${DOMAIN}/finance/`);
  collectUrls(join(DIST, 'health'), '/health');
  discoveredUrls.push(`${DOMAIN}/health/`);
  collectUrls(join(DIST, 'util'), '/util');
  discoveredUrls.push(`${DOMAIN}/util/`);
  collectUrls(join(DIST, 'de'), '/de');
  discoveredUrls.push(`${DOMAIN}/de/`);
  collectUrls(join(DIST, 'fr'), '/fr');
  discoveredUrls.push(`${DOMAIN}/fr/`);
  collectUrls(join(DIST, 'ru'), '/ru');
  discoveredUrls.push(`${DOMAIN}/ru/`);
  collectUrls(join(DIST, 'science'), '/science');
  discoveredUrls.push(`${DOMAIN}/science/`);
  collectUrls(join(DIST, 'psychology'), '/psychology');
  discoveredUrls.push(`${DOMAIN}/psychology/`);
  collectUrls(join(DIST, 'trade'), '/trade');
  discoveredUrls.push(`${DOMAIN}/trade/`);
  collectUrls(join(DIST, 'units'), '/units');
  discoveredUrls.push(`${DOMAIN}/units/`);
  collectUrls(join(DIST, 'mind'), '/mind');
  discoveredUrls.push(`${DOMAIN}/mind/`);
  collectUrls(join(DIST, 'wealth'), '/wealth');
  discoveredUrls.push(`${DOMAIN}/wealth/`);
  collectUrls(join(DIST, 'dopamine'), '/dopamine');
  discoveredUrls.push(`${DOMAIN}/dopamine/`);
  collectUrls(join(DIST, 'curious'), '/curious');
  discoveredUrls.push(`${DOMAIN}/curious/`);
  collectUrls(join(DIST, 'laptops'), '/laptops');
  discoveredUrls.push(`${DOMAIN}/laptops/`);
  discoveredUrls.push(`${DOMAIN}/laptops/compare/`);
  discoveredUrls.push(`${DOMAIN}/laptops/board/`);
  discoveredUrls.push(`${DOMAIN}/laptops/upgrades/`);
  discoveredUrls.push(`${DOMAIN}/laptops/pwm/`);
  collectUrls(join(DIST, 'hardware'), '/hardware');
  discoveredUrls.push(`${DOMAIN}/hardware/cpus/`);
  discoveredUrls.push(`${DOMAIN}/hardware/gpus/`);
  collectUrls(join(DIST, 'handhelds'), '/handhelds');
  discoveredUrls.push(`${DOMAIN}/handhelds/`);
  collectUrls(join(DIST, 'web'), '/web');
  discoveredUrls.push(`${DOMAIN}/web/`);
  collectUrls(join(DIST, 'neuro'), '/neuro');
  discoveredUrls.push(`${DOMAIN}/neuro/`);

  const uniqueUrls = [...new Set(discoveredUrls)];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls.map(u => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u === `${DOMAIN}/` ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}
</urlset>`;

  writeFileSync(join(DIST, 'sitemap.xml'), sitemapXml);

  const robotsTxt = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
`;

  writeFileSync(join(DIST, 'robots.txt'), robotsTxt);

  // IndexNow verification key file
  const INDEXNOW_KEY = 'd03e981bc84f479a9e3a6c2f84b1509b';
  writeFileSync(join(DIST, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);
  console.log(`  ✓ Generated IndexNow key file (${INDEXNOW_KEY}.txt)`);

  // .nojekyll file to prevent GitHub Pages Jekyll processing
  // This stops pretty URL rewrites that cause Google "alternate page with canonical" issues
  writeFileSync(join(DIST, '.nojekyll'), '');
  console.log('  ✓ Generated .nojekyll (prevents pretty URL redirects)');

  console.log(`  ✓ Generated sitemap.xml (${uniqueUrls.length} indexable URLs)`);
  console.log('  ✓ Generated robots.txt (Googlebot allowed, AI scrapers restricted)');
}

export { buildSEOAssets };
