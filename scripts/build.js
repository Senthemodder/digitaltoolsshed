import { buildJavaLearnSection } from './learn_java.js';
import { buildEpistemicTools } from './epistemic_tools.js';
import { buildViralTools } from './viral_tools.js';
import { buildExistentialSuite } from './existential_tools.js';
import { buildTradeTools } from './trade_tools.js';
import { buildBodyTools } from './body_tools.js';
import { buildKitchenTools } from './kitchen_tools.js';
import { buildDailyCalcTools } from './daily_calc_tools.js';
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
import { buildScienceTools } from './science_tools.js';
import { buildPsychologyTools } from './psychology_tools.js';
import { buildTradeMathTools } from './trade_math_tools.js';
import { buildHistoryUnitsTools } from './history_units_tools.js';
import { buildMindTools } from './mind_tools.js';
import { buildWealthTools } from './wealth_tools.js';
import { buildDopamineTools } from './dopamine_tools.js';
import { buildCuriousTools } from './curious_tools.js';
import { buildLaptopTools } from './laptop_tools.js';
import { buildLaptopComparisons } from './laptop_comparisons.js';
import { buildHardwareBoard } from './hardware_board.js';
import { buildCpuBenchmarks } from './cpu_benchmarks.js';
import { buildGpuBenchmarks } from './gpu_benchmarks.js';
import { buildLaptopUpgrades } from './laptop_upgrades.js';
import { buildLaptopPwm } from './laptop_pwm.js';
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
  buildExistentialSuite();
  buildEpistemicTools();
  buildUnitCalcSuite();
  buildBodyTools();
  buildKitchenTools();
  buildDailyCalcTools();
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
  buildScienceTools({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildPsychologyTools({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildTradeMathTools({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildHistoryUnitsTools({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildMindTools({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildWealthTools({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildDopamineTools({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildCuriousTools({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildLaptopTools({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildLaptopComparisons({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildHardwareBoard({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildCpuBenchmarks({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildGpuBenchmarks({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildLaptopUpgrades({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
  buildLaptopPwm({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });

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
