import { writeFileSync, existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ROOT, ensureDir, ICONS, TOOLS } from './core.js';

function buildConvertFastSuite() {
  const cfSrc = join(ROOT, '..', 'ConvertFast', 'src', 'site', 'converters');
  const convertDist = join(DIST, 'convert');
  ensureDir(convertDist);

  if (!existsSync(cfSrc)) {
    console.log('  ⚠️ ConvertFast source not found');
    return;
  }

  const files = readdirSync(cfSrc).filter(f => f.endsWith('.html'));

  for (const file of files) {
    const rawHtml = readFileSync(join(cfSrc, file), 'utf-8');

    const titleMatch = rawHtml.match(/<title>(.*?)<\/title>/i);
    const metaMatch = rawHtml.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    const title = titleMatch ? titleMatch[1].replace(/ConvertFast/gi, 'Digital Tools Shed') : 'Converter Tool | Digital Tools Shed';
    const metaDesc = metaMatch ? metaMatch[1] : 'Free instant browser converter tool.';

    const mainMatch = rawHtml.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i);
    let mainContent = mainMatch ? mainMatch[1] : '';

    mainContent = mainContent.replace(/CONVERTFAST/gi, 'DIGITAL TOOLS SHED');
    mainContent = mainContent.replace(/<span[^>]*>HOME \/ CONVERTERS[\s\S]*?<\/span>/i, '');

    const scriptMatches = rawHtml.match(/<script>([\s\S]*?)<\/script>/gi) || [];
    let toolScript = '';
    for (const s of scriptMatches) {
      if (!s.includes('cf-theme') && !s.includes('instant theme')) {
        toolScript += s;
      }
    }

    const bodyContent = `
      <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
        ${mainContent}
      </div>
      ${toolScript}
    `;

    const canonical = `${DOMAIN}/convert/${file}`;
    const pageHtml = renderPage({
      title,
      metaDesc,
      canonical,
      bodyContent,
      currentPath: `/convert/${file}`
    });

    writeFileSync(join(convertDist, file), pageHtml);
  }

  console.log(`  ✓ Ported & Styled ${files.length} ConvertFast converters with Vector Icons (/convert/)`);
}

// ─── PDF SUITE ─────────────────────────────────────────────────────────────

export { buildConvertFastSuite };
