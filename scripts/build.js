import { buildJavaLearnSection } from './learn_java.js';
import { buildEpistemicTools } from './epistemic_tools.js';
import { buildViralTools } from './viral_tools.js';
import { buildTradeTools } from './trade_tools.js';
// scripts/build.js — Master Static Site Generator for Digital Tools Shed
import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, ensureDir, renderPage } from './core.js';

// Import all modular suite builders
import { buildHomepage } from './home.js';
import { buildDeveloperTools } from './legacy_dev.js';
import { buildMediaSuite } from './media_tools.js';
import { buildConvertFastSuite } from './convert_tools.js';
import { buildPdfTools } from './pdf_tools.js';
import { buildMinecraftTools } from './mc_tools.js';
import { buildUnitCalcSuite } from './calc_tools.js';
import { buildArticlesSuite } from './articles.js';
import { buildProductivitySuite } from './productivity_tools.js';
import { buildLearnSection } from './learn.js';
import { buildPythonLearnSection } from './learn_python.js';
import { buildDevToolsSuite } from './dev_tools.js';
import { buildTextToolsSuite } from './text_tools.js';
import { buildSecurityToolsSuite } from './security_tools.js';
import { buildDesignToolsSuite } from './design_tools.js';
import { buildMathToolsSuite } from './math_tools.js';
import { buildHealthToolsSuite } from './health_tools.js';
import { buildUtilToolsSuite } from './util_tools.js';
import { buildI18nSuites } from './i18n_tools.js';
import { buildSeniorFinanceSuite } from './senior_finance_tools.js';
import { buildTrustPages, build404Page } from './trust_pages.js';
import { buildSEOAssets } from './seo.js';

function main() {
  console.log('\n🔨 Building DIGITAL TOOLS SHED (Modular Architecture)...\n');
  ensureDir(DIST);

  // Core & Legacy Suites
  buildHomepage();
  buildDeveloperTools();
  buildMediaSuite();
  buildConvertFastSuite();
  buildPdfTools();
  buildMinecraftTools();
  buildTradeTools();
  buildViralTools();
  buildEpistemicTools();
  buildUnitCalcSuite();
  buildArticlesSuite();
  buildProductivitySuite();

  // Education Suites
  buildLearnSection({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildPythonLearnSection({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildJavaLearnSection({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });

  // Tool Suites (Modular)
  buildDevToolsSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildTextToolsSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildSecurityToolsSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildDesignToolsSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildMathToolsSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildHealthToolsSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildUtilToolsSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildI18nSuites({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildSeniorFinanceSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });

  // Trust, Legal & Error Pages
  buildTrustPages();
  build404Page();

  // SEO & Sitemap Generation
  buildSEOAssets();

  console.log(`
══════════════════════════════════════════════════
✅ DIGITAL TOOLS SHED BUILD COMPLETE!
   Location: ${DIST}
   Domain: ${DOMAIN}
══════════════════════════════════════════════════
\n`);
}

main();
