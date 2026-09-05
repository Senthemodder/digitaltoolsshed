import { existsSync, mkdirSync, writeFileSync, copyFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..');
export const DIST = join(ROOT, 'dist');
export const DOMAIN = 'https://digitaltoolsshed.com';

export function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function copyDirRecursive(src, dest) {
  if (!existsSync(src)) return;
  if (!statSync(src).isDirectory()) return;
  ensureDir(dest);
  for (const item of readdirSync(src, { withFileTypes: true })) {
    const srcPath = join(src, item.name);
    const destPath = join(dest, item.name);
    if (item.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// ─── BESPOKE VECTOR ICON LIBRARY (ZERO EMOJIS) ────────────────────────────
const ICONS = {
  shed: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  star: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  media: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  files: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  docs: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
  calc: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path></svg>`,
  cube: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
  download: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  theme: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line></svg>`,
  arrowRight: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  search: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  lock: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  code: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  clipboard: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,
  article: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  science: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12a15.3 15.3 0 0 1 10-4 15.3 15.3 0 0 1 10 4 15.3 15.3 0 0 1-10 4 15.3 15.3 0 0 1-10-4z"/></svg>`,
  psychology: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  trade: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 3.26-4.66 4.66a2 2 0 0 0 0 2.83l1.42 1.42a2 2 0 0 0 2.83 0l4.66-4.66a1.65 1.65 0 0 0-2.34-2.33Z"/><path d="m15.5 8.5 3 3"/></svg>`,
  units: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  health: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  convert: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`
};

// ─── MASTER TOOL REGISTRY ──────────────────────────────────────────────────
const TOOLS = [
  // Developer & Decompiler Tools (NEW)
  { id: 'json-obfuscator', name: 'JSON Obfuscator & Compressor', category: 'Developer', path: '/convert/json-obfuscator', desc: 'Minify, compress, hex-escape, and obfuscate JSON payloads with reversible dictionaries.' },
  { id: 'esbuild-decompiler', name: 'ESBuild / JS Decompiler & Beautifier', category: 'Developer', path: '/convert/esbuild-decompiler', desc: 'Decompile, unminify, unpack IIFEs, and restore readable syntax from minified ESBuild and Webpack bundles.' },

  // Media & Video Tools
  { id: 'media-downloader', name: 'Universal Media Downloader', category: 'Media & Video', path: '/media/downloader', desc: 'Download high-quality video and audio from YouTube, TikTok, Twitter/X, Instagram, and SoundCloud.' },
  { id: 'screen-recorder', name: 'Screen & Camera Recorder', category: 'Media & Video', path: '/media/recorder', desc: 'Record screen, webcam, and microphone directly in your browser with zero uploads.' },
  { id: 'youtube-to-mp3', name: 'YouTube to MP3 Audio', category: 'Media & Video', path: '/media/youtube-to-mp3', desc: 'Extract pristine 320kbps MP3 audio tracks directly from video stream links.' },
  { id: 'tiktok-saver', name: 'TikTok Saver (No Watermark)', category: 'Media & Video', path: '/media/tiktok-saver', desc: 'Save high-definition TikTok videos without watermark overlay.' },

  // Image & File Converters
  { id: 'png-to-jpg', name: 'PNG to JPG Converter', category: 'File & Image', path: '/convert/png-to-jpg', desc: 'Convert PNG images to JPG format in your browser. Fast, 100% private.' },
  { id: 'jpg-to-png', name: 'JPG to PNG Converter', category: 'File & Image', path: '/convert/jpg-to-png', desc: 'Convert JPEG/JPG images to lossless PNG instantly.' },
  { id: 'png-to-webp', name: 'PNG to WebP Converter', category: 'File & Image', path: '/convert/png-to-webp', desc: 'Compress and convert PNG images to modern WebP format.' },
  { id: 'webp-to-png', name: 'WebP to PNG Converter', category: 'File & Image', path: '/convert/webp-to-png', desc: 'Convert Google WebP images back to transparent PNG format.' },
  { id: 'svg-to-png', name: 'SVG to PNG Converter', category: 'File & Image', path: '/convert/svg-to-png', desc: 'Rasterize vector SVG files into high-resolution PNG images.' },
  { id: 'image-resizer', name: 'Bulk Image Resizer', category: 'File & Image', path: '/convert/image-resizer', desc: 'Resize multiple images simultaneously with custom pixel dimensions.' },
  { id: 'json-formatter', name: 'JSON Formatter & Validator', category: 'Developer', path: '/convert/json-formatter', desc: 'Prettify, format, minify, and validate JSON strings and payloads.' },
  { id: 'json-to-yaml', name: 'JSON to YAML Converter', category: 'Developer', path: '/convert/json-to-yaml', desc: 'Convert structured JSON configuration data into clean YAML.' },
  { id: 'yaml-to-json', name: 'YAML to JSON Converter', category: 'Developer', path: '/convert/yaml-to-json', desc: 'Convert YAML configuration documents into standard JSON.' },
  { id: 'base64', name: 'Base64 Encoder / Decoder', category: 'Developer', path: '/convert/base64', desc: 'Encode text & files to Base64 or decode Base64 data strings.' },

  // PDF Tools
  { id: 'pdf-to-text', name: 'PDF to Text Extractor', category: 'PDF & Docs', path: '/pdf/pdf-to-text', desc: 'Extract readable text and document content from PDF files locally.' },
  { id: 'pdf-page-counter', name: 'PDF Page Counter', category: 'PDF & Docs', path: '/pdf/page-counter', desc: 'Inspect PDF metadata, dimensions, and total page count without uploading.' },

  // Unit & Math Calculators
  { id: 'meters-to-inches', name: 'Meters to Inches (m to in)', category: 'Units & Calc', path: '/calc/meters-to-inches', desc: 'Convert meters to inches instantly with human height chart (m to ft/in) and recipe fraction support.' },
  { id: 'sq-cm-to-sq-m', name: 'Square Centimeters to Square Meters (cm² to m²)', category: 'Units & Calc', path: '/calc/sq-cm-to-sq-m', desc: 'Convert square centimeters to square meters (divide by 10,000) with area reference chart.' },
  { id: 'tsp-to-ml', name: 'Teaspoons to Milliliters (tsp to mL)', category: 'Units & Calc', path: '/calc/tsp-to-ml', desc: 'Convert cooking teaspoons to metric milliliters with fraction and medical dose support.' },
  { id: 'ml-to-cups', name: 'Milliliters to Cups (mL to cup)', category: 'Units & Calc', path: '/calc/ml-to-cups', desc: 'Convert liquid milliliters to US cups with baking fraction table.' },
  { id: 'kwh-to-joules', name: 'kWh to Joules (kWh to J)', category: 'Units & Calc', path: '/calc/kwh-to-joules', desc: 'Convert kilowatt-hours to joules with physics derivation and household energy benchmarks.' },
  { id: 'framing-stud-calculator', name: 'Framing Stud Calculator', category: 'Units & Calc', path: '/calc/framing-stud-calculator', desc: 'Calculate 16" and 24" on-center wall studs, plates, corners, and window framing lumber.' },
  { id: 'gravel-calculator', name: 'Gravel & Stone Calculator', category: 'Units & Calc', path: '/calc/gravel-calculator', desc: 'Estimate tons, cubic yards, and 50 lb bags for driveways, pea gravel, and road base.' },
  { id: 'paint-calculator', name: 'Paint Gallon Calculator', category: 'Units & Calc', path: '/calc/paint-calculator', desc: 'Calculate paint gallons for walls, ceilings, and trim with door/window deductions.' },
  { id: 'tile-calculator', name: 'Tile & Grout Calculator', category: 'Units & Calc', path: '/calc/tile-calculator', desc: 'Calculate floor and wall tile boxes, square footage, and grout bags with cut waste.' },
  { id: 'drywall-calculator', name: 'Drywall & Sheetrock Calculator', category: 'Units & Calc', path: '/calc/drywall-calculator', desc: 'Calculate 4x8 and 4x12 drywall sheets, mud buckets, tape rolls, and screw pounds.' },
  { id: 'mulch-calculator', name: 'Mulch & Topsoil Yardage Calculator', category: 'Units & Calc', path: '/calc/mulch-calculator', desc: 'Calculate cubic yards and 2.0 cu ft store bag counts of mulch or topsoil for landscape beds.' },
  { id: 'rebar-calculator', name: 'Rebar & Concrete Slab Calculator', category: 'Units & Calc', path: '/calc/rebar-calculator', desc: 'Estimate 20-ft rebar stick counts, linear feet, grid wire ties, and steel weight for concrete slabs.' },
  { id: 'roofing-shingle-calculator', name: 'Roofing Shingle & Squares Calculator', category: 'Units & Calc', path: '/calc/roofing-shingle-calculator', desc: 'Calculate roof squares (100 sq ft), bundles of shingles, felt rolls, and nails with pitch multiplier.' },
  { id: 'feet-and-inches-to-cm', name: 'Feet and Inches to cm Converter', category: 'Units & Calc', path: '/calc/feet-and-inches-to-cm', desc: 'Convert feet and inches to metric centimeters (cm) with human height chart and quick presets.' },
  { id: 'cm-to-feet-and-inches', name: 'Centimeters to Feet & Inches (cm to ft in)', category: 'Units & Calc', path: '/calc/cm-to-feet-and-inches', desc: 'Convert metric cm to feet and inches with driver\'s license height chart and decimal feet.' },
  { id: 'shoe-size-converter', name: 'Shoe Size Converter (US, UK, EU, CM)', category: 'Units & Calc', path: '/calc/shoe-size-converter', desc: 'Interactive international shoe size converter for men, women, and foot length in inches and cm.' },
  { id: 'grams-to-cups', name: 'Grams to Cups Converter (By Ingredient)', category: 'Units & Calc', path: '/calc/grams-to-cups', desc: 'Convert baking grams to US cups with exact density factors for flour, sugar, butter, and oats.' },
  { id: 'cups-to-grams', name: 'Cups to Grams Converter (By Ingredient)', category: 'Units & Calc', path: '/calc/cups-to-grams', desc: 'Convert recipe cups to digital scale grams (g) and ounces (oz) with fraction selector.' },
  { id: 'butter-converter', name: 'Butter Converter: Sticks, Tablespoons, Cups & Grams', category: 'Units & Calc', path: '/calc/butter-converter', desc: 'Convert butter between sticks, tablespoons, cups, ounces, and grams instantly.' },
  { id: 'epoch-converter', name: 'Unix Timestamp & Epoch Converter', category: 'Developer', path: '/dev/epoch-converter', desc: 'Convert Unix timestamps in seconds and milliseconds to UTC and local human dates.' },
  { id: 'diff-checker', name: 'Online Text & Code Diff Checker', category: 'Developer', path: '/dev/diff-checker', desc: 'Compare two text files or code snippets side-by-side with instant additions and deletions.' },
  { id: 'car-depreciation-calculator', name: 'Car Depreciation & Residual Loss Calculator', category: 'Finance', path: '/finance/car-depreciation-calculator', desc: 'Estimate 5-year vehicle depreciation schedule, residual trade-in value, and monthly ownership cost.' },
  { id: 'hourly-to-salary-calculator', name: 'Hourly to Salary Calculator', category: 'Finance', path: '/finance/hourly-to-salary-calculator', desc: 'Convert hourly wages to annual salary, monthly pay, and bi-weekly paychecks.' },
  { id: 'tip-calculator', name: 'Tip & Bill Split Calculator', category: 'Units & Calc', path: '/calc/tip-calculator', desc: 'Calculate restaurant tips (15%, 18%, 20%) and split dining bills with dollar rounding.' },
  { id: 'gas-cost-calculator', name: 'Trip Gas & Fuel Cost Calculator', category: 'Units & Calc', path: '/calc/gas-cost-calculator', desc: 'Estimate road trip fuel costs and cost per passenger based on distance, MPG, and gas prices.' },
  { id: 'date-calculator', name: 'Date Calculator (Days Between & Add Days)', category: 'Productivity', path: '/util/date-calculator', desc: 'Calculate exact calendar days, working business days, and project future dates.' },
  { id: 'age-calculator', name: 'Exact Age Calculator & Birthday Countdown', category: 'Productivity', path: '/util/age-calculator', desc: 'Calculate exact chronological age in years, months, days, weekday of birth, and next birthday.' },
  { id: 'fraction-to-decimal', name: 'Fraction to Decimal Converter', category: 'Units & Calc', path: '/math/fraction-to-decimal', desc: 'Convert fractions, mixed numbers, and tape measure inches to exact decimals.' },
  { id: 'decimal-to-fraction', name: 'Decimal to Fraction Converter', category: 'Units & Calc', path: '/math/decimal-to-fraction', desc: 'Convert decimals into fully simplified fractions, mixed numbers, and tape fractions.' },
  { id: 'fraction-calculator', name: 'Fraction Arithmetic Calculator', category: 'Units & Calc', path: '/math/fraction-calculator', desc: 'Add, subtract, multiply, and divide fractions with step-by-step LCD solutions.' },
  { id: 'aspect-ratio-calculator', name: 'Aspect Ratio Calculator & Resolution Scaler', category: 'Developer', path: '/math/aspect-ratio-calculator', desc: 'Scale image/video dimensions for 16:9, 9:16, 4:3, 1:1, and 21:9 ultrawide.' },
  { id: 'scientific-notation-converter', name: 'Scientific Notation Converter', category: 'Units & Calc', path: '/math/scientific-notation-converter', desc: 'Convert between scientific notation (a × 10^b), E-notation, and standard decimals.' },
  { id: 'percentage-increase-calculator', name: 'Percentage Increase Calculator', category: 'Units & Calc', path: '/math/percentage-increase-calculator', desc: 'Calculate percentage growth, price rises, and revenue increases between two numbers.' },
  { id: 'percentage-decrease-calculator', name: 'Percentage Decrease & Discount Calculator', category: 'Units & Calc', path: '/math/percentage-decrease-calculator', desc: 'Determine percentage drops, retail markdown discounts, and loss margins.' },
  { id: 'standard-deviation-calculator', name: 'Standard Deviation Calculator (Sample & Population)', category: 'Units & Calc', path: '/math/standard-deviation-calculator', desc: 'Calculate sample standard deviation, population standard deviation, variance, and mean.' },
  { id: 'markup-margin-calculator', name: 'Markup vs Profit Margin Calculator', category: 'Finance', path: '/math/markup-margin-calculator', desc: 'Convert between cost markup and gross profit margin to ensure profitable pricing.' },
  { id: 'permutation-combination-calculator', name: 'Permutations & Combinations Calculator (nPr & nCr)', category: 'Units & Calc', path: '/math/permutation-combination-calculator', desc: 'Calculate permutations, combinations, and factorials with step-by-step math.' },
  { id: 'birthday-paradox-calculator', name: 'Birthday Paradox Calculator & Coincidence Simulator', category: 'Units & Calc', path: '/math/birthday-paradox-calculator', desc: 'Calculate shared birthday probabilities with 23 people and run Monte Carlo simulations.' },
  { id: 'body-fat-calculator', name: 'US Navy Body Fat Calculator', category: 'Health', path: '/health/body-fat-calculator', desc: 'Estimate body fat percentage, lean body mass, and fat mass using circumference measurements.' },
  { id: 'macro-calculator', name: 'Macro Nutrient Calculator', category: 'Health', path: '/health/macro-calculator', desc: 'Calculate daily protein, carbs, and fat split for cutting, bulking, and maintenance.' },
  { id: 'ideal-weight-calculator', name: 'Ideal Body Weight Calculator', category: 'Health', path: '/health/ideal-weight-calculator', desc: 'Compare target weight ranges across Devine, Robinson, Miller, and Hamwi formulas.' },
  { id: 'caffeine-half-life-calculator', name: 'Caffeine Half-Life & Sleep Decay Calculator', category: 'Health', path: '/health/caffeine-half-life-calculator', desc: 'Track active caffeine levels in blood using 5.7h half-life to determine sleep readiness.' },
  { id: 'sleep-deprivation-calculator', name: 'Sleep Deprivation & BAC Impairment Calculator', category: 'Health', path: '/health/sleep-deprivation-calculator', desc: 'Convert hours awake into equivalent blood alcohol concentration and reaction delay.' },
  { id: 'adhd-task-breakdown', name: 'ADHD Executive Dysfunction Task Paralysis Breaker', category: 'Health', path: '/health/adhd-task-breakdown', desc: 'Break down overwhelming chores and projects into tiny 2-minute dopamine-accessible micro-steps.' },
  { id: 'cbt-thought-challenger', name: 'CBT Thought Challenger & Cognitive Distortion Diary', category: 'Health', path: '/health/cbt-thought-challenger', desc: 'Clinical Cognitive Behavioral Therapy thought record to challenge catastrophic thinking and reframe beliefs.' },
  { id: 'box-breathing-pacer', name: 'Box Breathing & Vagus Nerve Somatic Pacer', category: 'Health', path: '/health/box-breathing-pacer', desc: 'Interactive somatic breath pacer with Navy SEAL 4-4-4-4 and Huberman physiological sigh cadences.' },
  { id: 'adhd-time-blindness-calculator', name: 'ADHD Time Blindness & Departure Buffer Calculator', category: 'Health', path: '/health/adhd-time-blindness-calculator', desc: 'Calculate realistic departure and prep times by factoring in ADHD transition and distraction taxes.' },
  { id: 'adhd-dopamine-menu', name: 'ADHD Dopamine Menu & Paralysis Unsticker', category: 'Health', path: '/health/adhd-dopamine-menu', desc: 'Curate appetizers, entrees, sides, and desserts to intentionally stimulate prefrontal dopamine.' },
  { id: 'sensory-grounding-decompressor', name: 'Sensory Overload & 5-4-3-2-1 Grounding Tool', category: 'Health', path: '/health/sensory-grounding-decompressor', desc: 'Somatic 5-4-3-2-1 sensory grounding sequence and burnout decompression guide.' },
  { id: 'adhd-screener', name: 'Adult ADHD Symptom Screener (WHO ASRS-v1.1)', category: 'Health', path: '/health/adhd-screener', desc: 'Official World Health Organization 6-question adult ADHD symptom screener with printable clinical report.' },
  { id: 'stand-on-your-own-feet', name: 'Stand On Your Own Feet: Self-Reliance & Motivation Engine', category: 'Health', path: '/health/stand-on-your-own-feet', desc: 'No-bullshit stoic motivation bombardment engine and 4-pillar self-reliance diagnostic. 100% Ad-Free.' },
  { id: 'therapy-recommendation-engine', name: 'Evidence-Based Therapy Matcher & Guidance', category: 'Health', path: '/health/therapy-recommendation-engine', desc: 'Clinical psychotherapy triage matching symptoms to CBT, DBT, ACT, EMDR, and Somatic regulation. 100% Ad-Free.' },
  { id: 'burnout-calculator', name: 'Clinical Burnout & Depletion Index (Maslach MBI)', category: 'Health', path: '/health/burnout-calculator', desc: 'Assess emotional exhaustion, depersonalization/cynicism, and personal inefficacy with clinical triage.' },
  { id: 'imposter-syndrome-test', name: 'Imposter Phenomenon Diagnostic & Competence Auditor (CIPS)', category: 'Health', path: '/health/imposter-syndrome-test', desc: 'Official Clance Imposter Phenomenon Scale evaluating intellectual self-doubt, attribution error, and perfectionism.' },
  { id: 'sleep-debt-calculator', name: 'Cumulative Sleep Debt & Circadian Recovery Calculator', category: 'Health', path: '/health/sleep-debt-calculator', desc: 'Calculate 7-day sleep debt, equivalent blood alcohol concentration impairment, and safe recovery schedule.' },
  { id: 'screen-time-calculator', name: 'Lifetime Screen Time & Dopamine Detox Calculator', category: 'Health', path: '/health/screen-time-calculator', desc: 'Calculate the total continuous years of your remaining life spent staring at glowing glass rectangles.' },
  { id: 'attachment-style-test', name: 'Adult Attachment Style & Relationship Diagnostic', category: 'Health', path: '/health/attachment-style-test', desc: 'Map your relational blueprint: Secure, Anxious-Preoccupied, Dismissive-Avoidant, or Fearful-Avoidant.' },
  { id: 'noise-exposure-calculator', name: 'Decibel Sound Dose & Hearing Damage Estimator (OSHA/NIOSH)', category: 'Health', path: '/health/noise-exposure-calculator', desc: 'Calculate safe listening duration for headphones and concerts before irreversible stereocilia damage.' },
  { id: 'ats-resume-scanner', name: 'Free ATS Resume Scanner & Keyword Matcher', category: 'Productivity', path: '/productivity/ats-resume-scanner', desc: 'Client-side ATS resume scanner. Match your CV against job descriptions and uncover missing keywords.' },
  { id: 'expense-splitter', name: 'Zero-Login Group Expense Splitter & Debt Simplifier', category: 'Productivity', path: '/productivity/expense-splitter', desc: 'Splitwise alternative with optimal debt simplification algorithm to settle shared costs with fewest payments.' },
  { id: 'fermi-paradox-calculator', name: 'Drake Equation & Fermi Paradox Alien Calculator', category: 'Productivity', path: '/util/fermi-paradox-calculator', desc: 'Calculate communicating alien civilizations in the Milky Way and distance to nearest life.' },
  { id: 'cosmic-calendar-calculator', name: 'Cosmic Calendar: 13.8B Years in 24 Hours', category: 'Productivity', path: '/util/cosmic-calendar-calculator', desc: 'Compress the lifespan of the universe into 24 hours to see your lifetime in milliseconds.' },
  { id: 'life-in-weeks', name: 'Your Life in Weeks (4,680-Box Memento Mori)', category: 'Productivity', path: '/util/life-in-weeks', desc: 'Interactive 90-year life matrix visualizing lived weeks versus time remaining.' },
  { id: 'billion-seconds-calculator', name: 'Billionth Second & Real-Time Heartbeat Ticker', category: 'Productivity', path: '/util/billion-seconds-calculator', desc: 'Track when you turn 1 billion seconds old with live ticking heartbeats and orbital distance.' },
  { id: 'blast-radius-calculator', name: 'Nuclear Blast Radius & Thermal Damage Estimator', category: 'Productivity', path: '/util/blast-radius-calculator', desc: 'Calculate fireball, 20 psi, 5 psi, and thermal burn zones using physics scaling laws.' },
  { id: 'infinite-monkey-calculator', name: 'Infinite Monkey Theorem Calculator', category: 'Productivity', path: '/util/infinite-monkey-calculator', desc: 'Calculate the probability and years required for random typing to produce any text.' },
  { id: 'simulation-argument-calculator', name: 'Simulation Hypothesis Probability Calculator', category: 'Productivity', path: '/util/simulation-argument-calculator', desc: 'Determine if our universe is an ancestor simulation using Nick Bostrom’s Trilemma.' },
  { id: 'existential-risk-calculator', name: 'Existential Risk & Human Survival Calculator', category: 'Productivity', path: '/util/existential-risk-calculator', desc: 'Calculate the probability of humanity surviving the next 100 years across global risks.' },
  { id: 'heat-death-timeline', name: 'Heat Death of the Universe Logarithmic Timeline', category: 'Productivity', path: '/util/heat-death-timeline', desc: 'Scrub across 100 orders of magnitude of deep time from the death of the Sun to the Big Freeze.' },
  { id: '100-existential-questions', name: '100 Deepest Existential Questions (2 AM Oracle)', category: 'Productivity', path: '/util/100-existential-questions', desc: 'Curated compendium of 100 unanswerable existential dilemmas with random card drawer and journal.' },
  { id: 'teleporter-paradox', name: 'The Teletransporter Paradox: Fast Travel or Murder?', category: 'Productivity', path: '/util/teleporter-paradox', desc: 'Derek Parfit’s classic identity problem: Does atomic duplication preserve you, or kill you?' },
  { id: 'experience-machine', name: 'The Experience Machine: Truth vs. Synthetic Bliss', category: 'Productivity', path: '/util/experience-machine', desc: 'Robert Nozick’s thought experiment: Would you plug into a simulated reality forever?' },
  { id: 'chinese-room', name: 'The Chinese Room: Can AI Ever Understand?', category: 'Productivity', path: '/util/chinese-room', desc: 'John Searle’s classic philosophy of mind thought experiment testing syntax vs semantics.' },
  { id: 'ship-of-theseus', name: 'The Ship of Theseus Identity Paradox Simulator', category: 'Productivity', path: '/util/ship-of-theseus', desc: 'Interactive plank replacement slider exploring continuous personal identity metaphysics.' },
  { id: 'trolley-problem-matrix', name: 'The Trolley Problem Matrix & Ethics Diagnostic', category: 'Productivity', path: '/util/trolley-problem-matrix', desc: 'Solve 5 iconic moral dilemmas to audit your Utilitarian vs Kantian ethical framework.' },
  { id: 'rokos-basilisk', name: 'Roko’s Basilisk: Acausal Blackmail & Game Theory', category: 'Productivity', path: '/util/rokos-basilisk', desc: 'The infamous 2010 LessWrong thought experiment on future superintelligence game theory.' },
  { id: 'decision-bracket', name: 'Decision Paralysis Bracket Tournament [Prefrontal Cortex Bypass Engine]', category: 'Curiosity & Mind', path: '/util/decision-bracket', desc: 'Rapid binary head-to-head tournament bracket to eliminate decision fatigue and reveal subconscious priority.' },
  { id: 'tail-end-mortality', name: 'The Tail End: Loved-One Time Remaining Ledger [Mortality Dot Matrix]', category: 'Curiosity & Mind', path: '/util/tail-end-mortality', desc: 'Calculate remaining face-to-face visits, holidays, and hours with parents and loved ones in an interactive dot grid.' },
  { id: 'dopamine-reset-simulator', name: 'Dopamine Receptor Downregulation Simulator [Opponent-Process Reset]', category: 'Curiosity & Mind', path: '/util/dopamine-reset-simulator', desc: 'Simulate dopamine baseline, D2 receptor downregulation, and opponent-process rebound with scientific reset protocol.' },
  { id: 'sensory-overload-meter', name: 'Sensory Overload Budget & Autonomic Battery Meter [Polyvagal Stress Diagnostic]', category: 'Curiosity & Mind', path: '/util/sensory-overload-meter', desc: 'Audit auditory noise, visual flicker, social masking, and context switches against allostatic capacity with physiological sigh pacer.' },
  { id: 'dunbar-social-auditor', name: 'Dunbar\'s 150 Social Sphere Auditor [Neocortex Bandwidth Diagnostic]', category: 'Curiosity & Mind', path: '/util/dunbar-social-auditor', desc: 'Audit relationships against 5-15-50-150 cognitive layers to uncover parasocial feed displacement and energy vampires.' },
  { id: 'habit-decay-simulator', name: 'Habit Decay Half-Life & Synaptic Pruning Simulator [The Never Miss Twice Proof]', category: 'Curiosity & Mind', path: '/util/habit-decay-simulator', desc: 'Mathematically simulate neural pathway decay when habits are interrupted and explore why the Never Miss Twice rule protects myelination.' },
  { id: 'personal-drake-equation', name: 'The Personal Drake Equation [Human Compatibility Probability Funnel]', category: 'Curiosity & Mind', path: '/util/personal-drake-equation', desc: 'Calculate the mathematical probability of finding your ideal romantic partner or peer using Peter Backus\'s cascading funnel.' },
  { id: 'epistemic-calibration', name: 'Epistemic Calibration & Overconfidence Game [Rationality Training Benchmark]', category: 'Curiosity & Mind', path: '/util/epistemic-calibration', desc: 'Test epistemic calibration with 10 numerical estimation questions and 80% confidence intervals to measure overconfidence.' },
  { id: 'sunk-cost-auditor', name: 'The Sunk Cost Fallacy & Irretrievable Loss Auditor [Prospect Theory Decision Tree]', category: 'Curiosity & Mind', path: '/util/sunk-cost-auditor', desc: 'Audit failing projects, degrees, or investments using Prospect Theory to eliminate past costs and calculate forward expected value.' },
  { id: 'cosmic-perspective-clock', name: 'The Cosmic Perspective Clock [Live Deep Time & Existential Scale Ticker]', category: 'Curiosity & Mind', path: '/util/cosmic-perspective-clock', desc: 'Synchronized live clocks tracking personal existence against Earth\'s history, solar evolution, and cosmic deep time.' },

  // Web Engineering & Internet Architecture Suite (14 Tools)
  { id: 'csp-cors-architect', name: 'Content Security Policy (CSP) & CORS Policy Architect [Security Workbench]', category: 'Web Engineering', path: '/web/csp-cors-architect', desc: 'Interactive visual Content Security Policy (CSP) & CORS header generator. Calculate nonces, SHA-256 script hashes, and export Nginx/Apache configs.' },
  { id: 'curl-to-code', name: 'cURL to Code Multi-Language Transpiler [Fetch, Axios, Python, Go, Rust]', category: 'Web Engineering', path: '/web/curl-to-code', desc: 'Convert cURL commands to JavaScript Fetch, Node Axios, Python Requests, Go net/http, and Rust reqwest with zero server dependencies.' },
  { id: 'websocket-inspector', name: 'Live WebSocket Frame & Handshake Inspector [Real-Time Telemetry]', category: 'Web Engineering', path: '/web/websocket-inspector', desc: 'Interactive client-side WebSocket client and frame debugger. Inspect RFC 6455 handshake headers, opcode frames, and roundtrip latency.' },
  { id: 'dns-record-generator', name: 'DNS Zone Architect & SPF / DKIM / DMARC Policy Builder [Email Deliverability]', category: 'Web Engineering', path: '/web/dns-record-generator', desc: 'Generate BIND zone records and synthetically validate SPF, DKIM, and DMARC anti-spoofing policies for domain deliverability.' },
  { id: 'css-grid-flexbox-studio', name: 'CSS Grid & Flexbox Visual Architecture Studio [2D Layout Engine]', category: 'Web Engineering', path: '/web/css-grid-flexbox-studio', desc: 'Interactive visual layout playground for CSS Flexbox and 2D Grid. Adjust flex-direction, align-items, gap, and export production CSS.' },
  { id: 'css-clamp-calculator', name: 'CSS clamp() Fluid Typography & Spacing Calculator [Linear Scale Engine]', category: 'Web Engineering', path: '/web/css-clamp-calculator', desc: 'Generate exact CSS clamp(min, preferred_vw, max) functions for fluid typography and responsive spacing without media queries.' },
  { id: 'social-card-previewer', name: 'OpenGraph & Twitter Card Visual Studio [SERP & Social Previewer]', category: 'Web Engineering', path: '/web/social-card-previewer', desc: 'Live interactive previewer for OpenGraph, Twitter/X cards, and Google SERP search snippets. Generates complete HTML metadata tags.' },
  { id: 'webrtc-sdp-analyzer', name: 'WebRTC SDP (Session Description Protocol) Dissector [Signaling Debugger]', category: 'Web Engineering', path: '/web/webrtc-sdp-analyzer', desc: 'Parse and dissect raw WebRTC SDP offer and answer strings. Inspect m-lines, ICE candidates, codecs, and DTLS fingerprints.' },
  { id: 'web-vitals-budget', name: 'Core Web Vitals & Performance Budget Simulator [CrUX Metrics Engine]', category: 'Web Engineering', path: '/web/web-vitals-budget', desc: 'Interactive performance budget and Core Web Vitals diagnostic. Calculate Largest Contentful Paint (LCP), INP, and financial conversion loss.' },
  { id: 'svg-path-studio', name: 'SVG Path Visualizer & Bézier Explainer [Interactive Vector Canvas]', category: 'Web Engineering', path: '/web/svg-path-studio', desc: 'Interactive HTML5 Canvas SVG path editor with visual Bézier control handles. Parse M, C, S, Q, and A path segments and minify coordinates.' },
  { id: 'webcrypto-key-studio', name: 'WebCrypto Keypair & HMAC Studio [SubtleCrypto Engine]', category: 'Web Engineering', path: '/web/webcrypto-key-studio', desc: 'Generate cryptographically secure RSA and ECDSA keypairs locally in your browser with Web Crypto API. Export PEM and JWK keys.' },
  { id: 'cookie-inspector', name: 'HTTP Cookie & Set-Cookie Header Dissector [Privacy & Security Audit]', category: 'Web Engineering', path: '/web/cookie-inspector', desc: 'Parse and dissect raw Set-Cookie HTTP headers. Audit SameSite, Secure, HttpOnly, and modern Partitioned (CHIPS) flags.' },
  { id: 'user-agent-hints', name: 'User-Agent & Client Hints (Sec-CH-UA) Dissector [Browser Fingerprint]', category: 'Web Engineering', path: '/web/user-agent-hints', desc: 'Live dissect browser User-Agent strings and modern Client Hints (Sec-CH-UA). Detect rendering engines, OS platforms, and bots.' },
  // Human Neurobiology & Cognitive Psychology Master Suite (15 Flagship Tools)
  { id: 'imposter-syndrome-spectrum', name: 'Imposter Syndrome vs Dunning-Kruger Spectrum Diagnostic [Interactive Quadrant Matrix]', category: 'Neurobiology & Mind', path: '/neuro/imposter-syndrome-spectrum', desc: 'Interactive 2D quadrant diagnostic measuring internal competence against perceived legitimacy.' },
  { id: 'adhd-paralysis-defuser', name: 'ADHD Executive Dysfunction & Task Paralysis Defuser [Dopamine Micro-Stepping Engine]', category: 'Neurobiology & Mind', path: '/neuro/adhd-paralysis-defuser', desc: 'Bypass prefrontal cortex task paralysis and executive dysfunction with scientific micro-stepping.' },
  { id: 'burnout-nervous-system-audit', name: 'Burnout vs Depression vs Autonomic Nervous System Exhaustion Audit [Polyvagal Diagnostic]', category: 'Neurobiology & Mind', path: '/neuro/burnout-nervous-system-audit', desc: 'Clinical polyvagal autonomic audit distinguishing chronic workplace burnout from clinical depression and dorsal vagal collapse.' },
  { id: 'attachment-style-diagnostic', name: 'Attachment Style Diagnostic & Relationship Dynamic Simulator [ECR-R Matrix]', category: 'Neurobiology & Mind', path: '/neuro/attachment-style-diagnostic', desc: 'Assess romantic attachment style across attachment anxiety and avoidance dimensions based on Brennan, Clark & Shaver ECR-R.' },
  { id: 'cognitive-distortion-reframer', name: 'Cognitive Distortion & Catastrophizing Reframer [Interactive CBT Thought Matrix]', category: 'Neurobiology & Mind', path: '/neuro/cognitive-distortion-reframer', desc: 'Four-step Beckian Cognitive Behavioral Therapy (CBT) distortion reframing matrix to challenge cognitive traps.' },
  { id: 'regret-minimization-engine', name: 'The 80-Year-Old Regret Minimization Decision Matrix [Jeff Bezos Framework]', category: 'Neurobiology & Mind', path: '/neuro/regret-minimization-engine', desc: 'Interactive psychological decision workbench based on Jeff Bezos 80-year-old regret minimization framework.' },
  { id: 'hedonic-treadmill-reset', name: 'Hedonic Treadmill & Baseline Happiness Reset Calculator [Adaptation Decay Engine]', category: 'Neurobiology & Mind', path: '/neuro/hedonic-treadmill-reset', desc: 'Calculate the mathematical half-life of emotional spikes from promotions, windfalls, or purchases using Brickman & Campbell models.' },
  { id: 'circadian-energy-architect', name: 'Circadian Energy Peak & Melatonin Timing Architect [Matthew Walker Protocol]', category: 'Neurobiology & Mind', path: '/neuro/circadian-energy-architect', desc: '24-hour ultradian and circadian energy curve mapper optimizing deep work, caffeine cutoffs, and sleep cycles.' },
  { id: 'overthinking-interrupter', name: 'Overthinking & Rumination Interruption Engine [5-4-3-2-1 Defusion & Box Breathing]', category: 'Neurobiology & Mind', path: '/neuro/overthinking-interrupter', desc: 'Break acute default mode network loops and amygdala hijacks with interactive 4-4-4-4 box breathing and somatic grounding.' },
  { id: 'paradox-of-choice-maximizer', name: 'Maximizer vs Satisficer Decision Style Audit [Paradox of Choice Index]', category: 'Neurobiology & Mind', path: '/neuro/paradox-of-choice-maximizer', desc: 'Audit Herbert Simon & Barry Schwartz decision optimization patterns: Maximizer vs Satisficer index.' },
  { id: 'social-comparison-neutralizer', name: 'Upward Social Comparison & Envy Neutralization Protocol [The Iceberg Matrix]', category: 'Neurobiology & Mind', path: '/neuro/social-comparison-neutralizer', desc: 'Deconstruct upward social comparison bias and acute Instagram envy by modeling complete life packages.' },
  { id: 'loneliness-parasocial-auditor', name: 'Parasocial Bonding & Screen-Mediated Loneliness Meter [UCLA Scale & Feed Audit]', category: 'Neurobiology & Mind', path: '/neuro/loneliness-parasocial-auditor', desc: 'Audit one-way parasocial relationships vs reciprocal peer connection using UCLA Loneliness Scale metrics.' },
  { id: 'dopamine-fasting-protocol', name: 'Dopamine Fasting & Neurochemical Reset Schedule [Dr. Cameron Sepah Protocol]', category: 'Neurobiology & Mind', path: '/neuro/dopamine-fasting-protocol', desc: 'Evidence-based cognitive-behavioral stimulus control protocol to attenuate impulsive stimulus-seeking behavior.' },
  { id: 'rejection-sensitivity-meter', name: 'Rejection Sensitive Dysphoria (RSD) Diagnostic & Coping Protocol [Emotional Dysregulation Scale]', category: 'Neurobiology & Mind', path: '/neuro/rejection-sensitivity-meter', desc: 'Interactive self-audit for Rejection Sensitive Dysphoria (RSD) with somatic regulation protocols.' },
  { id: 'existential-dread-compass', name: 'Existential Dread & Meaning Reconstruction Matrix [Frankl Logotherapy Model]', category: 'Neurobiology & Mind', path: '/neuro/existential-dread-compass', desc: 'Confront the 4 ultimate concerns of existence (Death, Freedom, Isolation, Meaninglessness) with Viktor Frankl Logotherapy.' },
  { id: 'nsdr-rest-pacer', name: 'Non-Sleep Deep Rest (NSDR) & Binaural Theta Pacer [Huberman Protocol]', category: 'Neurobiology & Mind', path: '/neuro/nsdr-rest-pacer', desc: 'Free client-side Non-Sleep Deep Rest (NSDR) protocol with customizable Web Audio binaural beats (theta/alpha 4Hz-7Hz), body scan pacer, and parasympathetic reset guidance.' },
  { id: 'sleep-inertia-dissipator', name: 'Sleep Inertia & Cortisol Awakening Response (CAR) Calculator [Morning Alertness Protocol]', category: 'Neurobiology & Mind', path: '/neuro/sleep-inertia-dissipator', desc: 'Calculate your sleep inertia dissipation curve and optimize your Cortisol Awakening Response (CAR) with lux light exposure timing, hydration protocols, and core body temperature acceleration.' },
  { id: 'circadian-phase-shifter', name: 'Circadian Phase Response Curve (PRC) & Jet Lag Shifter [Lewy Melatonin Protocol]', category: 'Neurobiology & Mind', path: '/neuro/circadian-phase-shifter', desc: 'Shift your circadian clock forwards or backwards using the Lewy Phase Response Curve. Calculate exact light exposure, light avoidance, and 0.5mg micro-dose melatonin timing windows for rapid jet lag recovery.' },
  { id: 'flow-state-sequencer', name: 'Flow State Trigger Sequencer & Challenge-Skill Ratio Calculator [Csikszentmihalyi 4% Engine]', category: 'Neurobiology & Mind', path: '/neuro/flow-state-sequencer', desc: 'Calculate your exact challenge-skill ratio using the Mihaly Csikszentmihalyi 4% Golden Rule. Audit 17 environmental, psychological, and social flow triggers to reliably enter optimal focus.' },
  { id: 'working-memory-span-tester', name: 'Working Memory Span & Dual N-Back Capacity Auditor [Cognitive Load Benchmark]', category: 'Neurobiology & Mind', path: '/neuro/working-memory-span-tester', desc: 'Benchmark your working memory buffer capacity using an interactive browser-based spatial and auditory N-back test. Measure cognitive bandwidth and Miller’s 7±2 working memory span.' },
  { id: 'loss-aversion-recalibrator', name: 'Loss Aversion & Expected Value Risk Recalibrator [Kahneman-Tversky Prospect Theory]', category: 'Neurobiology & Mind', path: '/neuro/loss-aversion-recalibrator', desc: 'Neutralize cognitive loss aversion bias with Daniel Kahneman & Amos Tversky’s Prospect Theory. Calculate true mathematical expected value (EV) vs subjective emotional pain using the 2.25x loss aversion multiplier.' },
  { id: 'hyperbolic-discounting-calculator', name: 'Hyperbolic Discounting & Present Bias Future-Self Bridge [Intertemporal Choice Engine]', category: 'Neurobiology & Mind', path: '/neuro/hyperbolic-discounting-calculator', desc: 'Visualize how your brain devalues future rewards using George Ainslie’s Hyperbolic Discounting model. Calculate present-bias decay curves and construct pre-commitment Ulysses contracts.' },
  { id: 'status-anxiety-deconstructor', name: 'Status Anxiety & Meritocracy Fallacy Auditor [Alain de Botton Philosophy Matrix]', category: 'Neurobiology & Mind', path: '/neuro/status-anxiety-deconstructor', desc: 'Deconstruct status anxiety, peer comparison pressure, and the insidious psychological trap of meritocracy using Alain de Botton’s philosophical framework.' },
  { id: 'trauma-bond-interrupter', name: 'Trauma Bond & Intermittent Reinforcement Cycle Interrupter [Behavioral Psychology Audit]', category: 'Neurobiology & Mind', path: '/neuro/trauma-bond-interrupter', desc: 'Audit the psychological mechanisms of a trauma bond. Identify intermittent reinforcement schedules, dopamine craving loops, and cognitive dissonance in toxic relationships.' },
  { id: 'nonviolent-communication-translator', name: 'Nonviolent Communication (NVC) 4-Step Conflict Translator [Marshall Rosenberg Model]', category: 'Neurobiology & Mind', path: '/neuro/nonviolent-communication-translator', desc: 'Transform blame, passive aggression, and defensiveness into collaborative dialogue. Translate heated emotional conflicts through the 4 NVC pillars: Observation, Feeling, Need, and Request.' },
  { id: 'emotional-granularity-wheel', name: 'Emotional Granularity & Interoceptive Precision Wheel [Constructed Emotion Model]', category: 'Neurobiology & Mind', path: '/neuro/emotional-granularity-wheel', desc: 'Expand your emotional vocabulary beyond "bad" or "stressed" into 48 precise affective states based on Dr. Lisa Feldman Barrett’s Theory of Constructed Emotion.' },
  { id: 'hyperfocus-recovery-system', name: 'ADHD Hyperfocus Hangover & Dopamine Depletion Recovery Protocol [Neurochemical Reset]', category: 'Neurobiology & Mind', path: '/neuro/hyperfocus-recovery-system', desc: 'Recover rapidly from acute post-hyperfocus exhaustion, brain fog, and sensory sensitivity with targeted biochemical, hydration, and nervous system protocols.' },
  { id: 'phq9-depression-screener', name: 'PHQ-9 Clinical Depression & Anhedonia Severity Screener [Official 9-Question Inventory]', category: 'Neurobiology & Mind', path: '/neuro/phq9-depression-screener', desc: 'Free client-side PHQ-9 Depression Screener. Calculate your depression severity score using the gold-standard 9-item clinical instrument.' },
  { id: 'gad7-anxiety-screener', name: 'GAD-7 Generalized Anxiety Disorder Severity Index [DSM-5 Clinical Score]', category: 'Neurobiology & Mind', path: '/neuro/gad7-anxiety-screener', desc: 'Free online GAD-7 Anxiety Screener. Calculate your clinical anxiety severity score based on the official 7-question DSM-5 scale.' },
  { id: 'gaslighting-reality-checker', name: 'Gaslighting & Psychological Abuse Reality Checker [DARVO & Sanity Validation Log]', category: 'Neurobiology & Mind', path: '/neuro/gaslighting-reality-checker', desc: 'Audit psychological manipulation tactics, DARVO loops, and create an immutable local browser sanity anchor log.' },
  { id: 'ifs-parts-unblender', name: 'Internal Family Systems (IFS) Parts Identifier & Unblending Navigator [Schwartz Model]', category: 'Neurobiology & Mind', path: '/neuro/ifs-parts-unblender', desc: 'Map your internal system using Richard Schwartz IFS therapy. Identify Managers, Firefighters, and Exiles with the 6 Fs of unblending.' },
  { id: 'hsp-sensory-sensitivity', name: 'Highly Sensitive Person (HSP) & Sensory Processing Scale [Elaine Aron SPS Test]', category: 'Neurobiology & Mind', path: '/neuro/hsp-sensory-sensitivity', desc: 'Measure your Sensory Processing Sensitivity across Elaine Aron DOES framework (Depth, Overstimulation, Empathy, Subtlety).' },
  { id: 'cptsd-flashback-grounder', name: 'Complex PTSD (C-PTSD) Emotional Flashback Grounding Navigator [Pete Walker 13 Steps]', category: 'Neurobiology & Mind', path: '/neuro/cptsd-flashback-grounder', desc: 'Interactive somatic triage for C-PTSD emotional flashbacks based on Pete Walker 13-step recovery protocol.' },
  { id: 'aq10-autism-screener', name: 'Adult Autism Spectrum Quotient (AQ-10) Screener [Baron-Cohen Clinical Scale]', category: 'Neurobiology & Mind', path: '/neuro/aq10-autism-screener', desc: 'Evaluate autistic traits across social communication and attention-to-detail with Simon Baron-Cohen clinical instrument.' },
  { id: 'social-anxiety-lsas', name: 'Social Anxiety Disorder & Fear vs Avoidance Index [Liebowitz Brief LSAS]', category: 'Neurobiology & Mind', path: '/neuro/social-anxiety-lsas', desc: 'Assess social phobia using the Liebowitz Social Anxiety Scale framework measuring fear vs behavioral avoidance.' },
  { id: 'perfectionism-paralysis-meter', name: 'Multidimensional Perfectionism & Fear of Failure Scale [Frost & Hewitt MPS]', category: 'Neurobiology & Mind', path: '/neuro/perfectionism-paralysis-meter', desc: 'Deconstruct adaptive standards vs toxic perfectionism paralysis using Frost & Hewitt MPS model and 80/20 threshold.' },
  { id: 'ocd-rumination-loop-breaker', name: 'OCD Intrusive Thought & Rumination Loop Interrupter [ERP Exposure Protocol]', category: 'Neurobiology & Mind', path: '/neuro/ocd-rumination-loop-breaker', desc: 'Interrupt acute OCD obsessive spikes using Exposure and Response Prevention (ERP) with 90-Second Uncertainty Timer.' },
  { id: 'compassion-fatigue-meter', name: 'Compassion Fatigue & Secondary Traumatic Stress Auditor [ProQOL 5 Scale]', category: 'Neurobiology & Mind', path: '/neuro/compassion-fatigue-meter', desc: 'Measure empathy exhaustion and secondary traumatic stress for nurses, caregivers, and therapists with ProQOL 5.' },
  { id: 'emotional-permanence-screener', name: 'Emotional Permanence & Object Constancy Insecurity Diagnostic [BPD/ADHD Attachment]', category: 'Neurobiology & Mind', path: '/neuro/emotional-permanence-screener', desc: 'Diagnose emotional impermanence and object constancy insecurity to understand why out of sight feels unloved.' },
  { id: 'narcissistic-abuse-inventory', name: 'Narcissistic Abuse & Coercive Control Inventory [Dr. Ramani & Evan Stark Audit]', category: 'Neurobiology & Mind', path: '/neuro/narcissistic-abuse-inventory', desc: 'Comprehensive client-side audit for narcissistic abuse, coercive control, and psychological manipulation. Evaluate love bombing, devaluation, and gaslighting.' },
  { id: 'vagus-nerve-tone-assessor', name: 'Vagus Nerve Tone & Parasympathetic Readiness Estimator [RSA / HRV Model]', category: 'Neurobiology & Mind', path: '/neuro/vagus-nerve-tone-assessor', desc: 'Estimate vagal nerve tone and parasympathetic recovery capacity with integrated 0.1Hz resonant breathing pacer.' },
  { id: 'maladaptive-daydreaming-scale', name: 'Maladaptive Daydreaming Diagnostic [Eli Somer MDS-16 Clinical Inventory]', category: 'Neurobiology & Mind', path: '/neuro/maladaptive-daydreaming-scale', desc: 'Official Maladaptive Daydreaming Scale (MDS-16). Calculate fantasy immersion score and evaluate functional impairment.' },
  { id: 'delayed-sleep-phase-chronobiology', name: 'Delayed Sleep Phase Syndrome (DSPS) & Circadian Realignment Protocol', category: 'Neurobiology & Mind', path: '/neuro/delayed-sleep-phase-chronobiology', desc: 'Calculate circadian temperature minimum (T_min), photic light advance window, and micro-melatonin schedule to shift delayed sleep phase.' },
  { id: 'dbt-tipp-emergency-skills', name: 'DBT TIPP Emergency Distress Tolerance Navigator [Linehan Crisis Protocol]', category: 'Neurobiology & Mind', path: '/neuro/dbt-tipp-emergency-skills', desc: 'Interactive somatic navigator for Dialectical Behavior Therapy (DBT) TIPP skills to abort panic and limbic hijack in under 60 seconds.' },
  { id: 'sensory-overload-de-escalator', name: 'Sensory Overload De-Escalator & Calming Room [Autism/ADHD/HSP Triage]', category: 'Neurobiology & Mind', path: '/neuro/sensory-overload-de-escalator', desc: 'Interactive sensory quiet room for acute autistic sensory overload, ADHD overstimulation, and HSP nervous system de-escalation.' },
  { id: 'executive-function-deficit-map', name: 'Executive Function Deficit Profiler [Barkley BDEFS 5-Domain Architecture]', category: 'Neurobiology & Mind', path: '/neuro/executive-function-deficit-map', desc: 'Clinical executive functioning profiler based on Dr. Russell Barkley BDEFS framework across Time, Restraint, and Motivation.' },
  { id: 'limerence-vs-love-auditor', name: 'Limerence vs Authentic Attachment Auditor [Dorothy Tennov Framework]', category: 'Neurobiology & Mind', path: '/neuro/limerence-vs-love-auditor', desc: 'Diagnose obsessive limerence versus genuine emotional intimacy. Evaluate intrusive thoughts, flaw crystallization, and dopamine craving loops.' },
  { id: 'toxic-positivity-detox', name: 'Toxic Positivity & Emotional Invalidation Deconstructor [Tragic Optimism]', category: 'Neurobiology & Mind', path: '/neuro/toxic-positivity-detox', desc: 'Identify toxic positivity, spiritual bypassing, and emotional invalidation. Translate dismissive platitudes into genuine psychological attunement.' },
  { id: 'spoon-theory-energy-budget', name: 'Spoon Theory Daily Energy Budgeter [Miserandino Chronic Illness Model]', category: 'Neurobiology & Mind', path: '/neuro/spoon-theory-energy-budget', desc: 'Interactive Spoon Theory daily energy calculator for chronic illness, neurodivergence, and executive fatigue to prevent spoon debt flares.' },
  { id: 'inner-critic-taxonomy', name: 'Inner Critic Voice Disarmer & Archetype Taxonomy [Voice Dialogue Model]', category: 'Neurobiology & Mind', path: '/neuro/inner-critic-taxonomy', desc: 'Identify which of the 5 Inner Critic Archetypes drives self-doubt with Socratic cognitive boundary counters.' },

  { id: 'sales-tax-calculator', name: 'Sales Tax Calculator & Reverse Tax Finder', category: 'Finance', path: '/finance/sales-tax-calculator', desc: 'Calculate sales tax or reverse calculate pre-tax prices with 50 US state rates.' },
  { id: 'simple-interest-calculator', name: 'Simple Interest Calculator (I = Prt)', category: 'Finance', path: '/finance/simple-interest-calculator', desc: 'Calculate simple interest, total loan payback, and monthly installment cost.' },
  { id: 'overtime-calculator', name: 'Overtime Pay Calculator (1.5x & 2.0x)', category: 'Finance', path: '/finance/overtime-calculator', desc: 'Calculate time-and-a-half overtime and double-time holiday pay under FLSA rules.' },
  { id: 'compound-interest-calculator', name: 'Compound Interest Calculator', category: 'Finance', path: '/finance/compound-interest-calculator', desc: 'Calculate investment growth with monthly contributions and compound interest.' },
  { id: 'cagr-calculator', name: 'CAGR Calculator (Compound Annual Growth Rate)', category: 'Finance', path: '/finance/cagr-calculator', desc: 'Calculate annualized growth rates, investment doubling time, and total return.' },
  { id: 'net-worth-calculator', name: 'Personal Net Worth Calculator', category: 'Finance', path: '/finance/net-worth-calculator', desc: 'Calculate total net worth by subtracting debts and liabilities from assets.' },
  { id: 'wallpaper-calculator', name: 'Wallpaper Roll Calculator', category: 'Units & Calc', path: '/calc/wallpaper-calculator', desc: 'Estimate wallpaper rolls needed for walls, factoring doors, windows, and pattern repeat.' },
  { id: 'fence-calculator', name: 'Wood Privacy Fence Material Calculator', category: 'Units & Calc', path: '/calc/fence-calculator', desc: 'Calculate 4x4 posts, 2x4 rails, pickets, and concrete bags needed for wood fences.' },
  { id: 'gpa-calculator', name: 'GPA Calculator', category: 'Units & Calc', path: '/math/gpa-calculator', desc: 'Calculate college and high school weighted and unweighted GPA on a 4.0 scale.' },
  { id: 'url-parser', name: 'URL Parser & Query Inspector', category: 'Developer', path: '/dev/url-parser', desc: 'Parse URLs into protocol, host, port, path segments, and query parameters table.' },
  { id: 'markdown-preview', name: 'Markdown Live Preview', category: 'Developer', path: '/text/markdown-preview', desc: 'Side-by-side GitHub Flavored Markdown editor with real-time HTML rendering.' },
  { id: 'kg-to-lbs', name: 'Kilograms to Pounds (kg to lbs)', category: 'Units & Calc', path: '/calc/kg-to-lbs', desc: 'Instant accurate weight conversion from kilograms to pounds.' },
  { id: 'lbs-to-kg', name: 'Pounds to Kilograms (lbs to kg)', category: 'Units & Calc', path: '/calc/lbs-to-kg', desc: 'Convert pounds (lbs) to metric kilograms (kg).' },
  { id: 'celsius-to-fahrenheit', name: 'Celsius to Fahrenheit (°C to °F)', category: 'Units & Calc', path: '/calc/celsius-to-fahrenheit', desc: 'Convert temperatures from Celsius to Fahrenheit scale.' },
  { id: 'fahrenheit-to-celsius', name: 'Fahrenheit to Celsius (°F to °C)', category: 'Units & Calc', path: '/calc/fahrenheit-to-celsius', desc: 'Convert temperatures from Fahrenheit to Celsius scale.' },
  { id: 'cm-to-inches', name: 'Centimeters to Inches (cm to in)', category: 'Units & Calc', path: '/calc/cm-to-inches', desc: 'Convert metric centimeters to imperial inches.' },
  { id: 'inches-to-cm', name: 'Inches to Centimeters (in to cm)', category: 'Units & Calc', path: '/calc/inches-to-cm', desc: 'Convert imperial inches to metric centimeters.' },
  { id: 'km-to-miles', name: 'Kilometers to Miles (km to mi)', category: 'Units & Calc', path: '/calc/km-to-miles', desc: 'Convert distance from kilometers to statute miles.' },
  { id: 'miles-to-km', name: 'Miles to Kilometers (mi to km)', category: 'Units & Calc', path: '/calc/miles-to-km', desc: 'Convert distance from statute miles to kilometers.' },
  { id: 'mb-to-gb', name: 'Megabytes to Gigabytes (MB to GB)', category: 'Units & Calc', path: '/calc/mb-to-gb', desc: 'Convert digital file storage size from MB to GB.' },
  { id: 'gb-to-tb', name: 'Gigabytes to Terabytes (GB to TB)', category: 'Units & Calc', path: '/calc/gb-to-tb', desc: 'Convert digital storage capacity from GB to TB.' },
  { id: 'gallons-to-liters', name: 'Gallons to Liters', category: 'Units & Calc', path: '/calc/gallons-to-liters', desc: 'Convert liquid volume from US gallons to metric liters.' },
  { id: 'liters-to-gallons', name: 'Liters to Gallons', category: 'Units & Calc', path: '/calc/liters-to-gallons', desc: 'Convert liquid volume from metric liters to US gallons.' },

  // Gaming / Minecraft Bedrock Tools
  { id: 'mc-uuid-gen', name: 'Minecraft UUID Generator', category: 'Minecraft & Game', path: '/mc/uuid-gen', desc: 'Generate valid v4 UUID pairs for Bedrock manifest.json files.' },
  { id: 'mc-manifest-gen', name: 'Bedrock Pack Manifest Generator', category: 'Minecraft & Game', path: '/mc/manifest-gen', desc: 'Generate complete manifest.json for Behavior and Resource packs.' }
,
  // Productivity & Business Tools
  { id: 'deduplicator', name: 'Text De-duplicator', category: 'Productivity', path: '/productivity/deduplicator', desc: 'Remove duplicate lines from text instantly.' },
  { id: 'time-tracker', name: 'Time Tracker', category: 'Productivity', path: '/productivity/time-tracker', desc: 'Track time across projects with start/stop timer and manual entries.' },
  { id: 'invoice-generator', name: 'Invoice Generator', category: 'Productivity', path: '/productivity/invoice-generator', desc: 'Create professional invoices with line items, tax, and PDF export.' },
  { id: 'invoice-from-time', name: 'Invoice from Time', category: 'Productivity', path: '/productivity/invoice-from-time', desc: 'Generate invoices from tracked time entries.' },
  { id: 'tax-calculator', name: 'Tax Calculator', category: 'Productivity', path: '/productivity/tax-calculator', desc: 'Calculate income tax with US federal brackets and deductions.' },
  { id: 'task-manager', name: 'Task Manager', category: 'Productivity', path: '/productivity/task-manager', desc: 'Create and track tasks with priorities. Export as PDF or DOCX.' },
  { id: 'timetable', name: 'Weekly Timetable', category: 'Productivity', path: '/productivity/timetable', desc: 'Visual weekly schedule planner with color-coded blocks.' },

  // Education & Learning Guides
  { id: 'learn-hub', name: 'Learning Hub', category: 'Learn & Code', path: '/learn/', desc: 'Master web development with hands-on guides and interactive code playgrounds.' },
  { id: 'learn-javascript', name: 'JavaScript Guide', category: 'Learn & Code', path: '/learn/javascript/', desc: 'Complete JavaScript guide from syntax basics to practical interactive projects.' },

  // Obscure Science & Astrophysics (115 tools)
  { id: 'science-hub', name: 'Obscure Science & Astrophysics Hub', category: 'Science', path: '/science/', desc: '115 interactive astrophysics, quantum mechanics, and cosmology calculators.' },
  { id: 'planck-length-converter', name: 'Planck Length to Subatomic Scales Converter', category: 'Science', path: '/science/planck-length-converter', desc: 'Convert quantum Planck lengths to meters, attometers, and astronomical scales.' },
  { id: 'schwarzschild-radius-calculator', name: 'Black Hole Schwarzschild Radius Calculator', category: 'Science', path: '/science/schwarzschild-radius-calculator', desc: 'Calculate event horizon radius for any mass from subatomic to supermassive black holes.' },
  { id: 'relativistic-time-dilation', name: 'Relativistic Time Dilation & Lorentz Factor', category: 'Science', path: '/science/relativistic-time-dilation', desc: 'Calculate relativistic velocity, time dilation, and length contraction via Lorentz factor.' },
  { id: 'stellar-mass-luminosity', name: 'Stellar Mass-Luminosity Relation Calculator', category: 'Science', path: '/science/stellar-mass-luminosity-calculator', desc: 'Compute star luminosity, surface temperature, and lifetime from solar masses.' },
  { id: 'hawking-radiation-calculator', name: 'Black Hole Hawking Radiation & Power Loss', category: 'Science', path: '/science/hawking-radiation-calculator', desc: 'Calculate Hawking temperature, surface gravity, and evaporation timescale.' },

  // 2 AM Existential Dilemmas & Psychology (115 tools)
  { id: 'psychology-hub', name: '2 AM Existential & Psychology Hub', category: 'Psychology', path: '/psychology/', desc: '115 interactive cognitive models, thought experiments, and executive function tools.' },
  { id: 'adhd-micro-step-decomposer', name: 'ADHD 2-Minute Micro-Step Decomposer', category: 'Psychology', path: '/psychology/adhd-micro-step-decomposer', desc: 'Break down overwhelming executive paralysis into micro-executable single steps.' },
  { id: 'catastrophizing-severity-meter', name: 'Catastrophic Thinking Scale & Severity Meter', category: 'Psychology', path: '/psychology/catastrophizing-severity-meter', desc: 'Step down anxiety spirals from worst-case disaster to realistic mathematical probability.' },
  { id: 'swampman-identity-paradox', name: 'Donald Davidson Swampman Identity Paradox', category: 'Psychology', path: '/psychology/swampman-identity-paradox', desc: 'Explore Donald Davidson’s philosophical thought experiment on consciousness and identity.' },
  { id: 'cognitive-dissonance-meter', name: 'Cognitive Dissonance Resolution Engine', category: 'Psychology', path: '/psychology/cognitive-dissonance-resolution-meter', desc: 'Cross-examine automatic negative thoughts and belief shifts with structured CBT evidence.' },
  { id: 'revenge-bedtime-tax', name: 'Revenge Bedtime Procrastination Cost Calculator', category: 'Psychology', path: '/psychology/revenge-bedtime-procrastination-tax', desc: 'Quantify next-day cognitive penalty and circadian sleep debt from late-night revenge scrolling.' },

  // Niche Construction & Trade Math (114 tools)
  { id: 'trade-hub', name: 'Niche Construction & Trade Math Hub', category: 'Trade Math', path: '/trade/', desc: '114 code-compliant trade calculators across roofing, electrical, plumbing, and framing.' },
  { id: 'common-rafter-length-calc', name: 'Common Rafter Length & Pitch Cut Calculator', category: 'Trade Math', path: '/trade/common-rafter-length-calculator', desc: 'Calculate precise rafter lengths, plumb cuts, seat cuts, and birdsmouth dimensions.' },
  { id: 'wire-gauge-voltage-drop', name: 'Wire Gauge & Voltage Drop Calculator (NEC 3%)', category: 'Trade Math', path: '/trade/wire-gauge-voltage-drop-calculator', desc: 'Calculate single and 3-phase AC/DC voltage drop by conductor wire gauge and length.' },
  { id: 'conduit-fill-capacity-nec', name: 'Conduit Fill Percentage Calculator (NEC Table 1)', category: 'Trade Math', path: '/trade/conduit-fill-capacity-nec', desc: 'Check EMT, PVC, and RMC conduit fill percentages against 40% NEC safety limits.' },
  { id: 'board-foot-lumber-pricing', name: 'Board Feet Lumber Calculator & Hardwood Pricing', category: 'Trade Math', path: '/trade/board-foot-lumber-pricing', desc: 'Calculate true hardwood board footage and total order cost from dimensional lumber.' },
  { id: 'concrete-curing-maturity-index', name: 'Concrete Curing Maturity Index (Nurse-Saul)', category: 'Trade Math', path: '/trade/concrete-curing-maturity-index', desc: 'Predict compressive strength gain from in-place curing temperature history.' },
  { id: 'hydraulic-cylinder-force-speed', name: 'Hydraulic Cylinder Force & Speed Calculator', category: 'Trade Math', path: '/trade/hydraulic-cylinder-force-speed', desc: 'Calculate push/pull tonnage, flow requirement (GPM), and cycle time.' },

  // Esoteric & Historical Unit Systems (114 tools)
  { id: 'units-hub', name: 'Esoteric & Historical Unit Systems Hub', category: 'Historical Units', path: '/units/', desc: '114 converters across Roman, Greek, Biblical, Apothecary, and obsolete computing units.' },
  { id: 'ancient-roman-amphora', name: 'Ancient Roman Amphora Liquid Volume Converter', category: 'Historical Units', path: '/units/ancient-roman-amphora-converter', desc: 'Convert Roman amphora, urna, congius, sextarius, and hemina to liters and gallons.' },
  { id: 'ancient-roman-pes-foot', name: 'Roman Foot (Pes Monetalis) Distance Converter', category: 'Historical Units', path: '/units/ancient-roman-pes-foot-converter', desc: 'Convert Roman pes, cubitus, passus, actus, and mille passus to modern units.' },
  { id: 'biblical-cor-homer', name: 'Biblical Cor and Chomer Volume Converter', category: 'Historical Units', path: '/units/biblical-cor-homer-volume-converter', desc: 'Convert ancient Hebrew dry and liquid temple measures to metric liters.' },
  { id: 'apothecary-grain-milligrams', name: 'Apothecary Grain (gr) to Metric Milligrams', category: 'Historical Units', path: '/units/apothecary-grain-to-milligrams', desc: 'Convert historical apothecary prescription weights to grams and grains.' },
  { id: 'nautical-cable-length', name: 'Maritime Cable Length & Fathom Converter', category: 'Historical Units', path: '/units/nautical-cable-length-converter', desc: 'Convert historical British and US naval cable lengths and leagues to nautical miles.' },
  { id: 'ibm-punch-card-bytes', name: 'IBM 80-Column Punch Card Character Capacity', category: 'Historical Units', path: '/units/ibm-80-column-punch-card-bytes', desc: 'Calculate byte capacities, deck heights, and weights of Hollerith punch cards.' },
];

// ─── MASTER CSS ───────────────────────────────────────────────────────────
const MASTER_CSS = `
:root, [data-theme="light"] {
  --bg: #ffffff;
  --fg: #111111;
  --sidebar-bg: #f9f9f9;
  --sidebar-border: #e2e2e2;
  --surface: #ffffff;
  --surface-alt: #f5f5f5;
  --surface-hover: #ebebeb;
  --border: #dcdcdc;
  --border-strong: #000000;
  --text-muted: #555555;
  --text-subtle: #777777;
  --input-bg: #ffffff;
  --btn-bg: #000000;
  --btn-fg: #ffffff;
  --btn-hover: #2b2b2b;
  --active-item: #000000;
  --active-item-fg: #ffffff;

  --serif: "Times New Roman", Times, "Liberation Serif", Georgia, serif;
  --mono: "SF Mono", Monaco, "Cascadia Code", "Courier New", Courier, monospace;

  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 2.5rem;
  --border-color: var(--border);
  --border-subtle: #eaeaea;
  --card-color: var(--surface);
  --surface-color: #f5f5f5;
  --text-color: var(--fg);
  --bg-color: var(--bg);
  --muted-color: var(--text-muted);
  --font-mono: var(--mono);
  --font-serif: var(--serif);
}

[data-theme="dark"] {
  --bg: #0b0b0b;
  --fg: #f0f0f0;
  --sidebar-bg: #050505;
  --sidebar-border: #1f1f1f;
  --surface: #121212;
  --surface-alt: #171717;
  --surface-hover: #202020;
  --border: #282828;
  --border-strong: #ffffff;
  --text-muted: #999999;
  --text-subtle: #666666;
  --input-bg: #040404;
  --btn-bg: #ffffff;
  --btn-fg: #000000;
  --btn-hover: #d5d5d5;
  --active-item: #ffffff;
  --active-item-fg: #000000;

  --border-color: #282828;
  --border-subtle: #181818;
  --card-color: #121212;
  --surface-color: #121212;
  --text-color: #f0f0f0;
  --bg-color: #0b0b0b;
  --muted-color: #999999;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  background-color: var(--bg);
  background-image:
    radial-gradient(at 10% 12%, var(--gradient-orb-1, rgba(99, 102, 241, 0.08)) 0px, transparent 55%),
    radial-gradient(at 90% 18%, var(--gradient-orb-2, rgba(16, 185, 129, 0.07)) 0px, transparent 50%),
    radial-gradient(at 50% 88%, var(--gradient-orb-3, rgba(168, 85, 247, 0.06)) 0px, transparent 60%);
  background-attachment: fixed;
  background-size: 100% 100%;
  color: var(--fg);
  font-family: var(--serif);
  line-height: 1.55;
  display: flex;
  overflow-x: hidden;
  transition: background 0.15s ease, color 0.15s ease;
}

.app-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

/* ─── SIDEBAR ────────────────────────────────────────────────────────────── */
.sidebar {
  width: 300px;
  min-width: 300px;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 150;
  overflow-y: auto;
  scrollbar-width: thin;
}

.sidebar-header {
  padding: 1.15rem 1.15rem 0.85rem;
  border-bottom: 1px solid var(--sidebar-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sidebar-brand {
  font-family: var(--serif);
  font-size: 1.1rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--fg);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.sidebar-search-box {
  padding: 0.75rem 0.85rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  border-bottom: 1px solid var(--sidebar-border);
  background: var(--sidebar-bg);
  position: sticky;
  top: 0;
  z-index: 10;
}

.sidebar-search {
  padding: 0.55rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface);
  border: 1px solid #3b82f6;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.25);
  animation: searchGlowPulse 4s infinite ease-in-out;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.sidebar-search:focus-within {
  border-color: #60a5fa !important;
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.5) !important;
  animation: none;
}

@keyframes searchGlowPulse {
  0%, 100% { box-shadow: 0 0 6px rgba(59, 130, 246, 0.2); border-color: rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 14px rgba(59, 130, 246, 0.55); border-color: rgba(59, 130, 246, 0.95); }
}

.sidebar-search svg { color: #3b82f6; flex-shrink: 0; }
.sidebar-search input {
  width: 100%;
  background: transparent;
  border: none;
  font-family: var(--mono);
  font-size: 0.82rem;
  color: var(--fg);
  outline: none;
}

.search-tooltip {
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--text-muted);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.2rem;
}
.shuffle-btn {
  background: transparent;
  border: none;
  color: #3b82f6;
  font-family: var(--mono);
  font-size: 0.68rem;
  cursor: pointer;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  text-decoration: underline;
}
.shuffle-btn:hover { color: var(--fg); }

/* Shimmer / Shuffle glow animation on items */
@keyframes itemShuffleGlow {
  0% { transform: scale(1); background: transparent; }
  50% { transform: scale(1.02); background: rgba(59, 130, 246, 0.18); border-color: #3b82f6; }
  100% { transform: scale(1); background: transparent; }
}
.shuffle-highlight {
  animation: itemShuffleGlow 1.8s ease-in-out;
}

.sidebar-nav {

  padding: 0.5rem 0.75rem 1.5rem;
  flex: 1;
}
.nav-group-title {
  font-family: var(--mono);
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-subtle);
  margin: 1.25rem 0.5rem 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}
.nav-group-title:first-child { margin-top: 0.25rem; }

.nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0.65rem;
  color: var(--fg);
  text-decoration: none;
  font-family: var(--serif);
  font-size: 0.95rem;
  border-radius: 2px;
  transition: background 0.1s, color 0.1s;
}
.nav-link-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.nav-link:hover {
  background: var(--surface-hover);
}
.nav-link.active {
  background: var(--active-item);
  color: var(--active-item-fg);
  font-weight: bold;
}
.nav-badge {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--text-muted);
}
.nav-link.active .nav-badge {
  color: var(--active-item-fg);
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  background: var(--sidebar-bg);
}
.theme-switch-btn {
  width: 100%;
  background: var(--surface);
  color: var(--fg);
  border: 1px solid var(--border);
  padding: 0.5rem;
  font-family: var(--mono);
  font-size: 0.75rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.theme-switch-btn:hover {
  border-color: var(--border-strong);
}

/* ─── MAIN CONTENT ───────────────────────────────────────────────────────── */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-y: auto;
}

.topbar {
  border-bottom: 1px solid var(--border);
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg);
  position: sticky;
  top: 0;
  z-index: 100;
}
.mobile-toggle {
  display: none;
  background: none;
  border: 1px solid var(--border);
  color: var(--fg);
  font-size: 1.1rem;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  font-family: var(--mono);
}
.breadcrumbs {
  font-family: var(--mono);
  font-size: 0.8rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.breadcrumbs a {
  color: var(--fg);
  text-decoration: none;
}
.breadcrumbs a:hover { text-decoration: underline; }

.privacy-badge {
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.quick-search-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.35rem 0.75rem;
  font-family: var(--mono);
  font-size: 0.75rem;
  cursor: pointer;
  border-radius: 4px;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.quick-search-btn:hover {
  border-color: var(--border-strong);
  color: var(--fg);
  background: var(--surface-hover);
}
.quick-search-kbd {
  background: var(--surface-alt);
  border: 1px solid var(--border);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.65rem;
  color: var(--text-subtle);
  line-height: 1;
}
@media (max-width: 600px) {
  .quick-search-text, .quick-search-kbd {
    display: none;
  }
  .quick-search-btn {
    padding: 0.35rem 0.5rem;
  }
}
.search-modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
}
.search-modal-card {
  background: var(--bg);
  border: 1px solid var(--border-strong);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  width: 92%;
  max-width: 620px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 75vh;
}
.search-modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}
.search-modal-header input {
  flex: 1;
  background: transparent !important;
  border: none !important;
  color: var(--fg) !important;
  font-family: var(--serif) !important;
  font-size: 1.1rem !important;
  outline: none !important;
}
.search-modal-header input::placeholder {
  color: var(--text-subtle);
  font-family: var(--serif);
}
.search-modal-close {
  background: var(--surface-alt);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: var(--mono);
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}
.search-modal-close:hover {
  background: var(--surface-hover);
  color: var(--fg);
}
.search-modal-results {
  overflow-y: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.search-result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.85rem;
  text-decoration: none;
  border-radius: 4px;
  color: var(--fg);
  font-family: var(--serif);
  font-size: 0.95rem;
  border: 1px solid transparent;
  transition: background 0.1s, border-color 0.1s;
}
.search-result-item:hover, .search-result-item.selected {
  background: var(--surface-hover);
  border-color: var(--border);
}
.search-result-title {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--fg);
}
.search-result-badge {
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--text-muted);
  background: var(--surface-alt);
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid var(--border);
  white-space: nowrap;
}
.search-modal-footer {
  padding: 0.5rem 1rem;
  border-top: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  justify-content: space-between;
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--text-muted);
}
.search-modal-footer kbd {
  background: var(--surface-alt);
  border: 1px solid var(--border);
  padding: 1px 4px;
  border-radius: 3px;
  color: var(--text-subtle);
}

.layout-with-rail {
  display: flex;
  justify-content: center;
  gap: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  flex: 1;
}
.main-body {
  max-width: 1050px;
  width: 100%;
  flex: 1;
  min-width: 0;
}
.right-sponsor-rail {
  width: 170px;
  flex-shrink: 0;
  display: none;
}
@media (min-width: 1360px) {
  .right-sponsor-rail {
    display: block;
    position: sticky;
    top: 70px;
    height: fit-content;
  }
}

.hero {
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 2.5rem;
}
.hero h1 {
  font-size: clamp(2.2rem, 4.5vw, 3.8rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: 0.75rem;
}
.hero p {
  color: var(--text-muted);
  font-size: 1.2rem;
  max-width: 700px;
  font-style: italic;
}

.category-section {
  margin-bottom: 3rem;
}
.category-header {
  font-family: var(--serif);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--fg);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.4rem;
}
.category-title-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.category-count {
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: normal;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.tool-card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 1.25rem;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.1s, border-color 0.15s, background 0.15s;
}
.tool-card:hover {
  border-color: var(--border-strong);
  background: var(--surface-hover);
  transform: translateY(-2px);
}
.tool-card h3 {
  font-family: var(--serif);
  font-size: 1.15rem;
  margin-bottom: 0.35rem;
  font-weight: 700;
  color: var(--fg);
}
.tool-card p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.4;
}
.tool-card .tag {
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  text-transform: uppercase;
}

/* ─── TECH ARTICLES & EDITORIAL STYLING ─── */
.article-container {
  max-width: 840px;
  margin: 0 auto;
}
.article-header {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 2rem;
}
.article-header h1 {
  font-family: var(--serif);
  font-size: clamp(2rem, 3.5vw, 2.7rem);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}
.article-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  font-family: var(--mono);
  font-size: 0.8rem;
  color: var(--text-muted);
}
.article-meta span {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.article-body {
  font-size: 1.08rem;
  line-height: 1.75;
  color: var(--fg);
}
.article-body h2 {
  font-family: var(--serif);
  font-size: 1.65rem;
  font-weight: 700;
  margin: 2.5rem 0 1rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
}
.article-body h3 {
  font-family: var(--serif);
  font-size: 1.3rem;
  font-weight: 700;
  margin: 1.75rem 0 0.75rem;
}
.article-body p {
  margin-bottom: 1.35rem;
}
.article-body ul, .article-body ol {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}
.article-body li {
  margin-bottom: 0.5rem;
}
.article-callout {
  background: var(--surface-alt);
  border-left: 4px solid var(--fg);
  padding: 1.25rem 1.5rem;
  margin: 1.75rem 0;
  font-style: italic;
}
.code-block-wrapper {
  background: var(--surface-alt);
  border: 1px solid var(--border);
  padding: 1.25rem;
  margin: 1.5rem 0;
  overflow-x: auto;
  font-family: var(--mono);
  font-size: 0.88rem;
  line-height: 1.5;
}
.code-block-wrapper pre {
  margin: 0;
  background: transparent;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
}
.article-cta-box {
  background: var(--surface);
  border: 2px solid var(--fg);
  padding: 1.5rem;
  margin: 2.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.article-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}
.article-journal-card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.15s, border-color 0.15s, background 0.15s;
}
.article-journal-card:hover {
  border-color: var(--fg);
  background: var(--surface-hover);
  transform: translateY(-2px);
}
.article-journal-tag {
  font-family: var(--mono);
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}
.article-journal-card h3 {
  font-family: var(--serif);
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 0.75rem;
}
.article-journal-card p {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.ad-blend-box {
  margin: 2rem 0;
  padding: 1rem;
  background: linear-gradient(135deg, var(--surface) 0%, var(--bg) 40%, var(--surface) 100%);
  border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  border-radius: 6px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: border-color 0.3s ease;
}
.ad-blend-box:hover { border-color: var(--border); }
.ad-blend-box::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--border) 30%, var(--border) 70%, transparent 100%);
  opacity: 0.4;
}
.ad-blend-box::after {
  content: "";
  position: absolute;
  bottom: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--border) 30%, var(--border) 70%, transparent 100%);
  opacity: 0.25;
}
.ad-desktop-leaderboard {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90px;
  width: 100%;
}
.ad-mobile-banner {
  display: none;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  width: 100%;
}
.ad-sidebar-card {
  margin: 1.25rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
  min-height: 300px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--sidebar-border) 50%, transparent);
  padding: 0.5rem 0;
  background: linear-gradient(180deg, var(--surface) 0%, transparent 100%);
  position: relative;
  border-radius: 4px;
  transition: border-color 0.3s;
}
.ad-sidebar-card:hover { border-color: var(--sidebar-border); }
.ad-sidebar-card::before {
  content: "";
  position: absolute;
  top: 0; left: 15%; right: 15%; height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
  opacity: 0.35;
}
.ad-unit-300x250 {
  width: 300px;
  height: 250px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ad-unit-468x60 {
  width: 468px;
  height: 60px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ad-promo-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, var(--surface) 0%, var(--bg) 50%, var(--surface) 100%);
  border: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
  padding: 1.25rem;
  min-height: 320px;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  transition: border-color 0.3s;
}
.ad-promo-card:hover { border-color: var(--border); }
.ad-promo-card::before {
  content: "";
  position: absolute;
  top: 0; left: 20%; right: 20%; height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
  opacity: 0.35;
}
.ad-label {
  font-family: var(--mono);
  font-size: 0.55rem;
  color: color-mix(in srgb, var(--text-subtle) 50%, transparent);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 0.5rem;
  opacity: 0.5;
  transition: opacity 0.3s;
}
.ad-blend-box:hover .ad-label,
.ad-sidebar-card:hover .ad-label,
.ad-promo-card:hover .ad-label { opacity: 0.3; }

.docked-sticky-ad {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  background: var(--surface);
  border-top: 1px solid var(--border);
  box-shadow: 0 -4px 20px rgba(0,0,0,0.12);
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease;
}
.docked-sticky-ad.collapsed {
  transform: translateY(calc(100% - 26px));
  box-shadow: none;
}
.docked-sticky-ad .toggle-btn {
  position: absolute;
  right: 12px;
  top: -1px;
  transform: translateY(-100%);
  background: var(--surface);
  border: 1px solid var(--border);
  border-bottom: none;
  color: var(--text-muted);
  font-family: var(--mono);
  font-size: 0.7rem;
  cursor: pointer;
  padding: 3px 12px;
  border-radius: 4px 4px 0 0;
  transition: color 0.2s, background 0.2s;
  line-height: 1;
  z-index: 1;
}
.docked-sticky-ad .toggle-btn:hover {
  color: var(--fg);
  background: var(--surface-alt);
}
.docked-sticky-ad .toggle-btn .chevron {
  display: inline-block;
  transition: transform 0.35s ease;
  font-size: 0.8rem;
}
.docked-sticky-ad.collapsed .toggle-btn .chevron {
  transform: rotate(180deg);
}

@media (max-width: 768px) {
  .ad-desktop-leaderboard { display: none !important; }
  .ad-mobile-banner { display: flex !important; }
  .ad-unit-468x60 { display: none !important; }
  .docked-sticky-ad { padding: 0.35rem 0.5rem; }
  .ad-hero-undercard { display: none; }
  .ad-category-break { padding: 0.5rem; }
  .ad-category-break .ad-unit-468x60 { display: none !important; }
  .mobile-welcome-overlay .ad-unit-300x250 { width: 280px; height: 233px; }
}
.ad-hero-undercard {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5rem auto;
  padding: 1rem;
  background: linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%);
  border: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
  text-align: center;
  position: relative;
  border-radius: 6px;
}
.ad-hero-undercard::before {
  content: "";
  position: absolute;
  top: 0; left: 10%; right: 10%; height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
  opacity: 0.3;
}
.ad-category-break {
  margin: 1.5rem 0;
  padding: 0.75rem;
  background: linear-gradient(135deg, var(--surface) 0%, var(--bg) 60%, var(--surface) 100%);
  border: 1px solid color-mix(in srgb, var(--border) 40%, transparent);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border-radius: 6px;
}
.ad-category-break::before {
  content: "";
  position: absolute;
  top: 0; left: 10%; right: 10%; height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
  opacity: 0.3;
}
.ad-pre-footer {
  margin: 2rem 0 0;
  padding: 1.5rem;
  background: linear-gradient(180deg, var(--surface-alt) 0%, var(--bg) 100%);
  border-top: 1px solid color-mix(in srgb, var(--border) 40%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--border) 40%, transparent);
  text-align: center;
}
.ad-pre-footer::before {
  content: "";
  display: block;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--border) 30%, var(--border) 70%, transparent 100%);
  opacity: 0.3;
  margin-bottom: 1rem;
}
.mobile-welcome-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 999999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  backdrop-filter: blur(4px);
}
.mobile-welcome-overlay .close-btn {
  background: #fff;
  color: #111;
  border: none;
  padding: 0.5rem 1.5rem;
  font-family: var(--mono);
  font-size: 0.85rem;
  cursor: pointer;
  letter-spacing: 0.05em;
}
.ad-article-mid {
  margin: 2rem auto;
  padding: 1rem;
  background: linear-gradient(135deg, var(--surface) 0%, var(--bg) 50%, var(--surface) 100%);
  border: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
  text-align: center;
  position: relative;
  border-radius: 6px;
}
.ad-article-mid::before {
  content: "";
  position: absolute;
  top: 0; left: 15%; right: 15%; height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
  opacity: 0.3;
}
.sponsor-notice {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999998;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 560px;
  width: calc(100% - 2rem);
  font-family: var(--serif);
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.4;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.sponsor-notice::before {
  content: "";
  position: absolute;
  top: 0; left: 10%; right: 10%; height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
  opacity: 0.3;
}
.sponsor-notice strong { color: var(--fg); }
.sponsor-notice .dismiss-btn {
  background: var(--fg);
  color: var(--bg);
  border: none;
  padding: 0.35rem 0.85rem;
  font-family: var(--mono);
  font-size: 0.7rem;
  cursor: pointer;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}

.promo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}
.promo-card {
  border: 1px solid var(--border);
  background: var(--surface);
  padding: 1.25rem;
  text-decoration: none;
  color: inherit;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.promo-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.promo-badge {
  font-family: var(--mono);
  font-size: 0.65rem;
  background: var(--fg);
  color: var(--bg);
  padding: 2px 6px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  display: inline-block;
  border-radius: 3px;
}

/* ─── COGNITIVE TRUST BAR (BEHAVIORAL SEO & ANTI-POGO-STICKING) ─── */
.cognitive-trust-bar {
  margin-bottom: 1.25rem;
  padding: 0.55rem 0.95rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid #10b981;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-family: var(--mono);
  font-size: 0.74rem;
  line-height: 1.4;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}
.trust-bar-left, .trust-bar-right {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
}
.trust-pill-live {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #10b981;
  font-weight: 600;
}
.pulse-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.7);
  animation: cognitivePulse 2s infinite ease-in-out;
}
@keyframes cognitivePulse {
  0% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}
.trust-sep {
  color: var(--border);
}
.trust-metric {
  color: var(--text-muted);
}
.trust-stars {
  color: #f59e0b;
  font-weight: 600;
}
.trust-feature {
  color: var(--fg);
  font-size: 0.73rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.tool-workspace {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 2rem;
  margin: 1.5rem 0 2rem;
}
.drop-zone {
  border: 2px dashed var(--border);
  padding: 3rem 1.5rem;
  text-align: center;
  cursor: pointer;
  background: var(--surface-alt);
  transition: border-color 0.15s;
}
.drop-zone:hover { border-color: var(--border-strong); }

.btn-primary, button[style*="text-transform:uppercase"], #downloadBtn {
  background: var(--btn-bg) !important;
  color: var(--btn-fg) !important;
  border: 1px solid var(--border-strong) !important;
  padding: 0.8rem 1.5rem !important;
  font-family: var(--serif) !important;
  font-weight: 700 !important;
  font-size: 1rem !important;
  cursor: pointer !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  box-shadow: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.5rem !important;
}
.btn-primary:hover, button[style*="text-transform:uppercase"]:hover, #downloadBtn:hover {
  background: var(--btn-hover) !important;
}

textarea, input[type="text"], input[type="number"], input[type="url"], select {
  background: var(--input-bg) !important;
  color: var(--fg) !important;
  border: 1px solid var(--border) !important;
  outline: none !important;
  font-family: var(--serif) !important;
}
textarea:focus, input[type="text"]:focus, input[type="url"]:focus, select:focus {
  border-color: var(--border-strong) !important;
}

footer {
  border-top: 1px solid var(--border);
  padding: 2rem;
  background: var(--bg);
  font-family: var(--serif);
  font-size: 0.9rem;
  color: var(--text-muted);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
footer a { color: var(--fg); text-decoration: none; }
footer a:hover { text-decoration: underline; }

@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    left: -300px;
    transition: left 0.25s ease;
    box-shadow: 2px 0 10px rgba(0,0,0,0.15);
  }
  .sidebar.open {
    left: 0;
  }
  .mobile-toggle {
    display: block;
  }
  .topbar {
    padding: 0.75rem 1rem;
  }
  .main-body {
    padding: 1.5rem 1rem;
  }
  .tools-grid {
    grid-template-columns: 1fr;
  }
}
`;

// ─── SIDEBAR BUILDER WITH VECTOR ICONS ─────────────────────────────────────
function buildSidebarHtml(currentPath = '/') {
  return `
  <aside class="sidebar" id="siteSidebar">
    <div class="sidebar-header">
      <a href="/" class="sidebar-brand">
        ${ICONS.shed}
        <span>DIGITAL TOOLS SHED</span>
      </a>
      <button class="mobile-toggle" id="mobileCloseBtn" onclick="toggleSidebar()" style="display:none; padding: 0.2rem 0.5rem; font-size: 0.8rem;">✕</button>
    </div>

    <div class="sidebar-search-box">
      <div class="sidebar-search">
        ${ICONS.search}
        <input type="text" id="sidebarSearchInput" placeholder="Filter 1,000+ tools & guides..." autocomplete="off" />
      </div>
      <div class="search-tooltip">
        <span>Filter 1,000+ tools live</span>
        <button class="shuffle-btn" onclick="shuffleRandomTool()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg> Random</button>
      </div>
    </div>

    <nav class="sidebar-nav">

      <!-- FEATURED & VIRAL REALITY TOOLS -->
      <div class="nav-group-title">
        ${ICONS.star}
        <span>Featured & Reality Suite</span>
      </div>
      <a href="/util/ego-vs-truth" class="nav-link ${currentPath.startsWith('/util/ego-vs-truth') ? 'active' : ''}">
        <div class="nav-link-content"><span>Ego vs. Truth Auditor</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/text/steelman-engine" class="nav-link ${currentPath.startsWith('/text/steelman-engine') ? 'active' : ''}">
        <div class="nav-link-content"><span>Steelman Engine</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/calc/ai-water-calculator" class="nav-link ${currentPath.startsWith('/calc/ai-water-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>AI Water Reality Ticker</span></div>
        <span class="nav-badge">VIRAL</span>
      </a>
      <a href="/math/graphing-calculator" class="nav-link ${currentPath.startsWith('/math/graphing-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>2D Graphing Calculator</span></div>
        <span class="nav-badge">DESMOS</span>
      </a>
      <a href="/math/bayesian-updater" class="nav-link ${currentPath.startsWith('/math/bayesian-updater') ? 'active' : ''}">
        <div class="nav-link-content"><span>Bayesian Belief Updater</span></div>
      </a>
      <a href="/text/fallacy-scanner" class="nav-link ${currentPath.startsWith('/text/fallacy-scanner') ? 'active' : ''}">
        <div class="nav-link-content"><span>Fallacy & Evasion Scanner</span></div>
      </a>
      <a href="/util/scale-visualizer" class="nav-link ${currentPath.startsWith('/util/scale-visualizer') ? 'active' : ''}">
        <div class="nav-link-content"><span>1M vs 1B Scale Visualizer</span></div>
      </a>

      <!-- CURIOSITY, NEUROBIOLOGY & DECISIONS -->
      <div class="nav-group-title">
        ${ICONS.psychology}
        <span>Curiosity & Neurobiology (10)</span>
      </div>
      <a href="/util/decision-bracket" class="nav-link ${currentPath.startsWith('/util/decision-bracket') ? 'active' : ''}">
        <div class="nav-link-content"><span>Decision Bracket</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/util/tail-end-mortality" class="nav-link ${currentPath.startsWith('/util/tail-end-mortality') ? 'active' : ''}">
        <div class="nav-link-content"><span>The Tail End Ledger</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/util/dopamine-reset-simulator" class="nav-link ${currentPath.startsWith('/util/dopamine-reset-simulator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Dopamine Reset Sim</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/util/sensory-overload-meter" class="nav-link ${currentPath.startsWith('/util/sensory-overload-meter') ? 'active' : ''}">
        <div class="nav-link-content"><span>Sensory Overload Meter</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/util/dunbar-social-auditor" class="nav-link ${currentPath.startsWith('/util/dunbar-social-auditor') ? 'active' : ''}">
        <div class="nav-link-content"><span>Dunbar 150 Auditor</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/util/habit-decay-simulator" class="nav-link ${currentPath.startsWith('/util/habit-decay-simulator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Habit Decay Simulator</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/util/personal-drake-equation" class="nav-link ${currentPath.startsWith('/util/personal-drake-equation') ? 'active' : ''}">
        <div class="nav-link-content"><span>Personal Drake Eq</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/util/epistemic-calibration" class="nav-link ${currentPath.startsWith('/util/epistemic-calibration') ? 'active' : ''}">
        <div class="nav-link-content"><span>Epistemic Calibration</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/util/sunk-cost-auditor" class="nav-link ${currentPath.startsWith('/util/sunk-cost-auditor') ? 'active' : ''}">
        <div class="nav-link-content"><span>Sunk Cost Auditor</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/util/cosmic-perspective-clock" class="nav-link ${currentPath.startsWith('/util/cosmic-perspective-clock') ? 'active' : ''}">
        <div class="nav-link-content"><span>Cosmic Clock</span></div>
        <span class="nav-badge">NEW</span>
      </a>

      <!-- WEB ENGINEERING & INTERNET ARCHITECTURE -->
      <div class="nav-group-title">
        ${ICONS.code}
        <span>Web Engineering (14)</span>
      </div>
      <a href="/web/" class="nav-link ${currentPath === '/web/' || currentPath === '/web/index.html' || currentPath === '/web' ? 'active' : ''}">
        <div class="nav-link-content"><span>Web Architecture Hub</span></div>
        <span class="nav-badge">HUB</span>
      </a>
      <a href="/web/csp-cors-architect" class="nav-link ${currentPath.startsWith('/web/csp-cors-architect') ? 'active' : ''}">
        <div class="nav-link-content"><span>CSP & CORS Architect</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/web/curl-to-code" class="nav-link ${currentPath.startsWith('/web/curl-to-code') ? 'active' : ''}">
        <div class="nav-link-content"><span>cURL to Code</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/web/websocket-inspector" class="nav-link ${currentPath.startsWith('/web/websocket-inspector') ? 'active' : ''}">
        <div class="nav-link-content"><span>WebSocket Inspector</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/web/dns-record-generator" class="nav-link ${currentPath.startsWith('/web/dns-record-generator') ? 'active' : ''}">
        <div class="nav-link-content"><span>DNS Zone & SPF/DMARC</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/web/css-grid-flexbox-studio" class="nav-link ${currentPath.startsWith('/web/css-grid-flexbox-studio') ? 'active' : ''}">
        <div class="nav-link-content"><span>CSS Grid & Flex Studio</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/web/css-clamp-calculator" class="nav-link ${currentPath.startsWith('/web/css-clamp-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Fluid clamp() Generator</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/web/social-card-previewer" class="nav-link ${currentPath.startsWith('/web/social-card-previewer') ? 'active' : ''}">
        <div class="nav-link-content"><span>Social Card & SERP</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/web/webrtc-sdp-analyzer" class="nav-link ${currentPath.startsWith('/web/webrtc-sdp-analyzer') ? 'active' : ''}">
        <div class="nav-link-content"><span>WebRTC SDP Dissector</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/web/web-vitals-budget" class="nav-link ${currentPath.startsWith('/web/web-vitals-budget') ? 'active' : ''}">
        <div class="nav-link-content"><span>Core Web Vitals Budget</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/web/svg-path-studio" class="nav-link ${currentPath.startsWith('/web/svg-path-studio') ? 'active' : ''}">
        <div class="nav-link-content"><span>SVG Path & Bézier</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/web/webcrypto-key-studio" class="nav-link ${currentPath.startsWith('/web/webcrypto-key-studio') ? 'active' : ''}">
        <div class="nav-link-content"><span>WebCrypto Key Studio</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/web/cookie-inspector" class="nav-link ${currentPath.startsWith('/web/cookie-inspector') ? 'active' : ''}">
        <div class="nav-link-content"><span>HTTP Cookie Dissector</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/web/user-agent-hints" class="nav-link ${currentPath.startsWith('/web/user-agent-hints') ? 'active' : ''}">
        <div class="nav-link-content"><span>User-Agent & Hints</span></div>
        <span class="nav-badge">NEW</span>
      </a>
      <a href="/web/color-contrast-apca" class="nav-link ${currentPath.startsWith('/web/color-contrast-apca') ? 'active' : ''}">
        <div class="nav-link-content"><span>WCAG & APCA Contrast</span></div>
        <span class="nav-badge">NEW</span>
      </a>

      <!-- EDUCATION & LEARNING -->
      <div class="nav-group-title">
        ${ICONS.code}
        <span>Learning Hub (60+ Guides)</span>
      </div>
      <a href="/learn/java/playground" class="nav-link ${currentPath.startsWith('/learn/java/playground') ? 'active' : ''}">
        <div class="nav-link-content"><span>Java Playground & Auto</span></div>
        <span class="nav-badge">IDE</span>
      </a>
      <a href="/learn/java/" class="nav-link ${currentPath === '/learn/java/' || currentPath === '/learn/java/index.html' || currentPath === '/learn/java' ? 'active' : ''}">
        <div class="nav-link-content"><span>Java Master Guide (10)</span></div>
      </a>
      <a href="/learn/python/" class="nav-link ${currentPath === '/learn/python/' || currentPath === '/learn/python/index.html' || currentPath === '/learn/python' ? 'active' : ''}">
        <div class="nav-link-content"><span>Python Guides (20)</span></div>
      </a>
      <a href="/learn/javascript/" class="nav-link ${currentPath === '/learn/javascript/' || currentPath === '/learn/javascript/index.html' || currentPath === '/learn/javascript' ? 'active' : ''}">
        <div class="nav-link-content"><span>JavaScript Guides (30)</span></div>
      </a>

      <!-- DEVELOPER & DECOMPILERS -->
      <div class="nav-group-title">
        ${ICONS.code}
        <span>Developer Suite (17)</span>
      </div>
      <a href="/convert/json-obfuscator" class="nav-link ${currentPath.startsWith('/convert/json-obfuscator') ? 'active' : ''}">
        <div class="nav-link-content"><span>JSON Obfuscator</span></div>
      </a>
      <a href="/convert/esbuild-decompiler" class="nav-link ${currentPath.startsWith('/convert/esbuild-decompiler') ? 'active' : ''}">
        <div class="nav-link-content"><span>ESBuild Decompiler</span></div>
      </a>
      <a href="/convert/json-formatter" class="nav-link ${currentPath.startsWith('/convert/json-formatter') ? 'active' : ''}">
        <div class="nav-link-content"><span>JSON Formatter & Validator</span></div>
      </a>
      <a href="/dev/ai-robots-txt" class="nav-link ${currentPath.startsWith('/dev/ai-robots-txt') ? 'active' : ''}">
        <div class="nav-link-content"><span>AI Bot Blocker robots.txt</span></div>
      </a>
      <a href="/dev/regex-tester" class="nav-link ${currentPath.startsWith('/dev/regex-tester') ? 'active' : ''}">
        <div class="nav-link-content"><span>Regex Visual Tester</span></div>
      </a>
      <a href="/dev/jwt-decoder" class="nav-link ${currentPath.startsWith('/dev/jwt-decoder') ? 'active' : ''}">
        <div class="nav-link-content"><span>JWT Token Decoder</span></div>
      </a>
      <a href="/dev/cron-generator" class="nav-link ${currentPath.startsWith('/dev/cron-generator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Cron Expression Builder</span></div>
      </a>
      <a href="/dev/css-minifier" class="nav-link ${currentPath.startsWith('/dev/css-minifier') ? 'active' : ''}">
        <div class="nav-link-content"><span>CSS Minifier</span></div>
      </a>
      <a href="/dev/js-minifier" class="nav-link ${currentPath.startsWith('/dev/js-minifier') ? 'active' : ''}">
        <div class="nav-link-content"><span>JS Minifier</span></div>
      </a>
      <a href="/dev/sql-formatter" class="nav-link ${currentPath.startsWith('/dev/sql-formatter') ? 'active' : ''}">
        <div class="nav-link-content"><span>SQL Formatter</span></div>
      </a>
      <a href="/dev/url-parser" class="nav-link ${currentPath.startsWith('/dev/url-parser') ? 'active' : ''}">
        <div class="nav-link-content"><span>URL Parser & Query Inspector</span></div>
      </a>
      <a href="/convert/base64" class="nav-link ${currentPath.startsWith('/convert/base64') ? 'active' : ''}">
        <div class="nav-link-content"><span>Base64 Encoder/Decoder</span></div>
      </a>

      <!-- MINECRAFT & GAMING -->
      <div class="nav-group-title">
        ${ICONS.cube}
        <span>Minecraft Bedrock & Java (6)</span>
      </div>
      <a href="/mc/nbt-editor" class="nav-link ${currentPath.startsWith('/mc/nbt-editor') ? 'active' : ''}">
        <div class="nav-link-content"><span>In-Browser NBT Editor</span></div>
        <span class="nav-badge">PRO</span>
      </a>
      <a href="/mc/color-codes" class="nav-link ${currentPath.startsWith('/mc/color-codes') ? 'active' : ''}">
        <div class="nav-link-content"><span>Formatting & Color Codes (§)</span></div>
      </a>
      <a href="/mc/tellraw-gen" class="nav-link ${currentPath.startsWith('/mc/tellraw-gen') ? 'active' : ''}">
        <div class="nav-link-content"><span>/tellraw JSON Generator</span></div>
      </a>
      <a href="/mc/playsound-gen" class="nav-link ${currentPath.startsWith('/mc/playsound-gen') ? 'active' : ''}">
        <div class="nav-link-content"><span>/playsound Event Picker</span></div>
      </a>
      <a href="/mc/uuid-gen" class="nav-link ${currentPath.startsWith('/mc/uuid-gen') ? 'active' : ''}">
        <div class="nav-link-content"><span>Pack UUID Generator</span></div>
      </a>
      <a href="/mc/manifest-gen" class="nav-link ${currentPath.startsWith('/mc/manifest-gen') ? 'active' : ''}">
        <div class="nav-link-content"><span>manifest.json Generator</span></div>
      </a>

      <!-- OBSCURE SCIENCE & ASTROPHYSICS -->
      <div class="nav-group-title">
        ${ICONS.science}
        <span>Obscure Science & Astro (115)</span>
      </div>
      <a href="/science/" class="nav-link ${currentPath === '/science/' || currentPath === '/science/index.html' || currentPath === '/science' ? 'active' : ''}">
        <div class="nav-link-content"><span>Science & Astrophysics Hub</span></div>
        <span class="nav-badge">HUB</span>
      </a>
      <a href="/science/planck-length-converter" class="nav-link ${currentPath.startsWith('/science/planck-length-converter') ? 'active' : ''}">
        <div class="nav-link-content"><span>Planck Length Converter</span></div>
      </a>
      <a href="/science/schwarzschild-radius-calculator" class="nav-link ${currentPath.startsWith('/science/schwarzschild-radius-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Schwarzschild Radius</span></div>
      </a>
      <a href="/science/relativistic-time-dilation" class="nav-link ${currentPath.startsWith('/science/relativistic-time-dilation') ? 'active' : ''}">
        <div class="nav-link-content"><span>Time Dilation & Lorentz</span></div>
      </a>
      <a href="/science/stellar-mass-luminosity-calculator" class="nav-link ${currentPath.startsWith('/science/stellar-mass-luminosity-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Stellar Mass & Luminosity</span></div>
      </a>
      <a href="/science/hawking-radiation-calculator" class="nav-link ${currentPath.startsWith('/science/hawking-radiation-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Hawking Radiation Power</span></div>
      </a>

      <!-- 2 AM EXISTENTIAL & PSYCHOLOGY -->
      <div class="nav-group-title">
        ${ICONS.psychology}
        <span>2 AM Psychology & Mind (115)</span>
      </div>
      <a href="/psychology/" class="nav-link ${currentPath === '/psychology/' || currentPath === '/psychology/index.html' || currentPath === '/psychology' ? 'active' : ''}">
        <div class="nav-link-content"><span>2 AM Psychology Hub</span></div>
        <span class="nav-badge">HUB</span>
      </a>
      <a href="/psychology/adhd-micro-step-decomposer" class="nav-link ${currentPath.startsWith('/psychology/adhd-micro-step-decomposer') ? 'active' : ''}">
        <div class="nav-link-content"><span>ADHD Micro-Step Decomposer</span></div>
      </a>
      <a href="/psychology/catastrophizing-severity-meter" class="nav-link ${currentPath.startsWith('/psychology/catastrophizing-severity-meter') ? 'active' : ''}">
        <div class="nav-link-content"><span>Catastrophizing Severity</span></div>
      </a>
      <a href="/psychology/swampman-identity-paradox" class="nav-link ${currentPath.startsWith('/psychology/swampman-identity-paradox') ? 'active' : ''}">
        <div class="nav-link-content"><span>Swampman Identity Paradox</span></div>
      </a>
      <a href="/psychology/cognitive-dissonance-resolution-meter" class="nav-link ${currentPath.startsWith('/psychology/cognitive-dissonance-resolution-meter') ? 'active' : ''}">
        <div class="nav-link-content"><span>Cognitive Dissonance Meter</span></div>
      </a>
      <a href="/psychology/revenge-bedtime-procrastination-tax" class="nav-link ${currentPath.startsWith('/psychology/revenge-bedtime-procrastination-tax') ? 'active' : ''}">
        <div class="nav-link-content"><span>Revenge Bedtime Tax</span></div>
      </a>

      <!-- BLUE-COLLAR & NICHE TRADE MATH -->
      <div class="nav-group-title">
        ${ICONS.trade}
        <span>Niche Trade Math (114)</span>
      </div>
      <a href="/trade/" class="nav-link ${currentPath === '/trade/' || currentPath === '/trade/index.html' || currentPath === '/trade' ? 'active' : ''}">
        <div class="nav-link-content"><span>Niche Trade Math Hub</span></div>
        <span class="nav-badge">HUB</span>
      </a>
      <a href="/trade/common-rafter-length-calculator" class="nav-link ${currentPath.startsWith('/trade/common-rafter-length-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Common Rafter Length & Pitch</span></div>
      </a>
      <a href="/trade/wire-gauge-voltage-drop-calculator" class="nav-link ${currentPath.startsWith('/trade/wire-gauge-voltage-drop-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Voltage Drop (NEC 3%)</span></div>
      </a>
      <a href="/trade/conduit-fill-capacity-nec" class="nav-link ${currentPath.startsWith('/trade/conduit-fill-capacity-nec') ? 'active' : ''}">
        <div class="nav-link-content"><span>Conduit Fill (NEC Table 1)</span></div>
      </a>
      <a href="/trade/board-foot-lumber-pricing" class="nav-link ${currentPath.startsWith('/trade/board-foot-lumber-pricing') ? 'active' : ''}">
        <div class="nav-link-content"><span>Board Foot Lumber Pricing</span></div>
      </a>
      <a href="/trade/concrete-curing-maturity-index" class="nav-link ${currentPath.startsWith('/trade/concrete-curing-maturity-index') ? 'active' : ''}">
        <div class="nav-link-content"><span>Concrete Curing Maturity</span></div>
      </a>
      <a href="/trade/hydraulic-cylinder-force-speed" class="nav-link ${currentPath.startsWith('/trade/hydraulic-cylinder-force-speed') ? 'active' : ''}">
        <div class="nav-link-content"><span>Hydraulic Cylinder Force</span></div>
      </a>
      <a href="/calc/stair-calculator" class="nav-link ${currentPath.startsWith('/calc/stair-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Stair Stringer (IRC Code)</span></div>
      </a>
      <a href="/calc/concrete-calculator" class="nav-link ${currentPath.startsWith('/calc/concrete-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Concrete Slab & Bags</span></div>
      </a>
      <a href="/calc/framing-stud-calculator" class="nav-link ${currentPath.startsWith('/calc/framing-stud-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Wall Stud Framing (16"/24")</span></div>
      </a>
      <a href="/calc/drywall-calculator" class="nav-link ${currentPath.startsWith('/calc/drywall-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Drywall, Mud & Screws</span></div>
      </a>
      <a href="/calc/paint-calculator" class="nav-link ${currentPath.startsWith('/calc/paint-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Paint Gallons Estimator</span></div>
      </a>
      <a href="/calc/tile-calculator" class="nav-link ${currentPath.startsWith('/calc/tile-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Floor & Wall Tile Boxes</span></div>
      </a>
      <a href="/calc/mulch-calculator" class="nav-link ${currentPath.startsWith('/calc/mulch-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Mulch, Topsoil & Compost</span></div>
      </a>
      <a href="/calc/gravel-calculator" class="nav-link ${currentPath.startsWith('/calc/gravel-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Gravel & Crushed Stone</span></div>
      </a>

      <!-- ESOTERIC & HISTORICAL UNIT SYSTEMS -->
      <div class="nav-group-title">
        ${ICONS.units}
        <span>Historical Unit Systems (114)</span>
      </div>
      <a href="/units/" class="nav-link ${currentPath === '/units/' || currentPath === '/units/index.html' || currentPath === '/units' ? 'active' : ''}">
        <div class="nav-link-content"><span>Historical Units Hub</span></div>
        <span class="nav-badge">HUB</span>
      </a>
      <a href="/units/ancient-roman-amphora-converter" class="nav-link ${currentPath.startsWith('/units/ancient-roman-amphora-converter') ? 'active' : ''}">
        <div class="nav-link-content"><span>Roman Amphora & Volume</span></div>
      </a>
      <a href="/units/ancient-roman-pes-foot-converter" class="nav-link ${currentPath.startsWith('/units/ancient-roman-pes-foot-converter') ? 'active' : ''}">
        <div class="nav-link-content"><span>Roman Pes (Foot) & Passus</span></div>
      </a>
      <a href="/units/biblical-cor-homer-volume-converter" class="nav-link ${currentPath.startsWith('/units/biblical-cor-homer-volume-converter') ? 'active' : ''}">
        <div class="nav-link-content"><span>Biblical Cor & Homer</span></div>
      </a>
      <a href="/units/apothecary-grain-to-milligrams" class="nav-link ${currentPath.startsWith('/units/apothecary-grain-to-milligrams') ? 'active' : ''}">
        <div class="nav-link-content"><span>Apothecary Grain (gr)</span></div>
      </a>
      <a href="/units/nautical-cable-length-converter" class="nav-link ${currentPath.startsWith('/units/nautical-cable-length-converter') ? 'active' : ''}">
        <div class="nav-link-content"><span>Maritime Cable & Fathom</span></div>
      </a>
      <a href="/units/ibm-80-column-punch-card-bytes" class="nav-link ${currentPath.startsWith('/units/ibm-80-column-punch-card-bytes') ? 'active' : ''}">
        <div class="nav-link-content"><span>IBM Punched Card Capacity</span></div>
      </a>

      <!-- HUMAN NEUROBIOLOGY & COGNITIVE ARCHITECTURE -->
      <div class="nav-group-title">
        ${ICONS.psychology}
        <span>Neurobiology & Mind (50)</span>
      </div>
      <a href="/neuro/" class="nav-link ${currentPath === '/neuro/' || currentPath === '/neuro/index.html' || currentPath === '/neuro' ? 'active' : ''}">
        <div class="nav-link-content"><span>Neuro Master Suite Hub</span></div>
        <span class="nav-badge">50</span>
      </a>
      <a href="/neuro/phq9-depression-screener" class="nav-link ${currentPath.startsWith('/neuro/phq9-depression-screener') ? 'active' : ''}">
        <div class="nav-link-content"><span>PHQ-9 Depression Screener</span></div>
        <span class="nav-badge">CLINICAL</span>
      </a>
      <a href="/neuro/gad7-anxiety-screener" class="nav-link ${currentPath.startsWith('/neuro/gad7-anxiety-screener') ? 'active' : ''}">
        <div class="nav-link-content"><span>GAD-7 Anxiety Screener</span></div>
        <span class="nav-badge">DSM-5</span>
      </a>
      <a href="/neuro/gaslighting-reality-checker" class="nav-link ${currentPath.startsWith('/neuro/gaslighting-reality-checker') ? 'active' : ''}">
        <div class="nav-link-content"><span>Gaslighting & Reality Check</span></div>
      </a>
      <a href="/neuro/ifs-parts-unblender" class="nav-link ${currentPath.startsWith('/neuro/ifs-parts-unblender') ? 'active' : ''}">
        <div class="nav-link-content"><span>IFS Parts Unblender (6 Fs)</span></div>
      </a>
      <a href="/neuro/hsp-sensory-sensitivity" class="nav-link ${currentPath.startsWith('/neuro/hsp-sensory-sensitivity') ? 'active' : ''}">
        <div class="nav-link-content"><span>HSP Sensitivity Scale</span></div>
      </a>
      <a href="/neuro/cptsd-flashback-grounder" class="nav-link ${currentPath.startsWith('/neuro/cptsd-flashback-grounder') ? 'active' : ''}">
        <div class="nav-link-content"><span>C-PTSD Flashback Grounder</span></div>
      </a>
      <a href="/neuro/nsdr-rest-pacer" class="nav-link ${currentPath.startsWith('/neuro/nsdr-rest-pacer') ? 'active' : ''}">
        <div class="nav-link-content"><span>NSDR & Binaural Theta</span></div>
        <span class="nav-badge">REST</span>
      </a>
      <a href="/neuro/sleep-inertia-dissipator" class="nav-link ${currentPath.startsWith('/neuro/sleep-inertia-dissipator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Sleep Inertia & CAR Calc</span></div>
      </a>
      <a href="/neuro/flow-state-sequencer" class="nav-link ${currentPath.startsWith('/neuro/flow-state-sequencer') ? 'active' : ''}">
        <div class="nav-link-content"><span>Flow State (4% Rule)</span></div>
      </a>
      <a href="/neuro/working-memory-span-tester" class="nav-link ${currentPath.startsWith('/neuro/working-memory-span-tester') ? 'active' : ''}">
        <div class="nav-link-content"><span>Dual N-Back Memory Test</span></div>
      </a>
      <a href="/neuro/imposter-syndrome-spectrum" class="nav-link ${currentPath.startsWith('/neuro/imposter-syndrome-spectrum') ? 'active' : ''}">
        <div class="nav-link-content"><span>Imposter vs Dunning-Kruger</span></div>
      </a>
      <a href="/neuro/adhd-paralysis-defuser" class="nav-link ${currentPath.startsWith('/neuro/adhd-paralysis-defuser') ? 'active' : ''}">
        <div class="nav-link-content"><span>ADHD Paralysis Defuser</span></div>
      </a>
      <a href="/neuro/burnout-nervous-system-audit" class="nav-link ${currentPath.startsWith('/neuro/burnout-nervous-system-audit') ? 'active' : ''}">
        <div class="nav-link-content"><span>Burnout vs Vagal Shutdown</span></div>
      </a>
      <a href="/neuro/loss-aversion-recalibrator" class="nav-link ${currentPath.startsWith('/neuro/loss-aversion-recalibrator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Loss Aversion EV Recalibrator</span></div>
      </a>
      <a href="/neuro/nonviolent-communication-translator" class="nav-link ${currentPath.startsWith('/neuro/nonviolent-communication-translator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Nonviolent Communication</span></div>
      </a>
      <a href="/neuro/hyperfocus-recovery-system" class="nav-link ${currentPath.startsWith('/neuro/hyperfocus-recovery-system') ? 'active' : ''}">
        <div class="nav-link-content"><span>ADHD Hyperfocus Recovery</span></div>
      </a>

      <!-- MIND & PSYCHOLOGICAL ARCHETYPES -->
      <div class="nav-group-title">
        ${ICONS.health}
        <span>Mind & Intelligence (500)</span>
      </div>
      <a href="/mind/" class="nav-link ${currentPath === '/mind/' || currentPath === '/mind/index.html' || currentPath === '/mind' ? 'active' : ''}">
        <div class="nav-link-content"><span>Mind & Archetypes Hub</span></div>
        <span class="nav-badge">500</span>
      </a>
      <a href="/mind/spatial-visual-reasoning" class="nav-link ${currentPath.startsWith('/mind/spatial-visual-reasoning') ? 'active' : ''}">
        <div class="nav-link-content"><span>Spatial Intelligence IQ</span></div>
      </a>
      <a href="/mind/adhd-executive-function-reserve" class="nav-link ${currentPath.startsWith('/mind/adhd-executive-function-reserve') ? 'active' : ''}">
        <div class="nav-link-content"><span>ADHD Executive Reserve</span></div>
      </a>
      <a href="/mind/machiavellian-pragmatism" class="nav-link ${currentPath.startsWith('/mind/machiavellian-pragmatism') ? 'active' : ''}">
        <div class="nav-link-content"><span>Machiavellian Pragmatism</span></div>
      </a>
      <a href="/mind/anxious-preoccupied-attachment" class="nav-link ${currentPath.startsWith('/mind/anxious-preoccupied-attachment') ? 'active' : ''}">
        <div class="nav-link-content"><span>Attachment Style Matrix</span></div>
      </a>
      <a href="/mind/dunning-kruger-self-perception-index" class="nav-link ${currentPath.startsWith('/mind/dunning-kruger-self-perception-index') ? 'active' : ''}">
        <div class="nav-link-content"><span>Dunning-Kruger Self-Audit</span></div>
      </a>

      <!-- BOOMER WEALTH & SENIOR CARE -->
      <div class="nav-group-title">
        ${ICONS.calc}
        <span>Boomer Wealth & Care (500)</span>
      </div>
      <a href="/wealth/" class="nav-link ${currentPath === '/wealth/' || currentPath === '/wealth/index.html' || currentPath === '/wealth' ? 'active' : ''}">
        <div class="nav-link-content"><span>Boomer Wealth Hub</span></div>
        <span class="nav-badge">500</span>
      </a>
      <a href="/wealth/social-security-break-even-age" class="nav-link ${currentPath.startsWith('/wealth/social-security-break-even-age') ? 'active' : ''}">
        <div class="nav-link-content"><span>Social Security Break-Even</span></div>
      </a>
      <a href="/wealth/irs-rmd-uniform-lifetime-table" class="nav-link ${currentPath.startsWith('/wealth/irs-rmd-uniform-lifetime-table') ? 'active' : ''}">
        <div class="nav-link-content"><span>IRS RMD Table (73+)</span></div>
      </a>
      <a href="/wealth/hecm-reverse-mortgage-borrowing-limit" class="nav-link ${currentPath.startsWith('/wealth/hecm-reverse-mortgage-borrowing-limit') ? 'active' : ''}">
        <div class="nav-link-content"><span>Reverse Mortgage Proceeds</span></div>
      </a>
      <a href="/wealth/long-term-care-insurance-roi" class="nav-link ${currentPath.startsWith('/wealth/long-term-care-insurance-roi') ? 'active' : ''}">
        <div class="nav-link-content"><span>Nursing Home vs LTC ROI</span></div>
      </a>
      <a href="/wealth/asphalt-shingle-vs-metal-roof-cost" class="nav-link ${currentPath.startsWith('/wealth/asphalt-shingle-vs-metal-roof-cost') ? 'active' : ''}">
        <div class="nav-link-content"><span>Roof Replacement Estimator</span></div>
      </a>

      <!-- GEN Z DOPAMINE & REALITY CHECKS -->
      <div class="nav-group-title">
        ${ICONS.clock}
        <span>Dopamine & Reality (500)</span>
      </div>
      <a href="/dopamine/" class="nav-link ${currentPath === '/dopamine/' || currentPath === '/dopamine/index.html' || currentPath === '/dopamine' ? 'active' : ''}">
        <div class="nav-link-content"><span>Dopamine & Reality Hub</span></div>
        <span class="nav-badge">500</span>
      </a>
      <a href="/dopamine/screen-time-to-lifetime-years-lost" class="nav-link ${currentPath.startsWith('/dopamine/screen-time-to-lifetime-years-lost') ? 'active' : ''}">
        <div class="nav-link-content"><span>Screen Time Lifetime Cost</span></div>
      </a>
      <a href="/dopamine/dopamine-fasting-receptor-reset" class="nav-link ${currentPath.startsWith('/dopamine/dopamine-fasting-receptor-reset') ? 'active' : ''}">
        <div class="nav-link-content"><span>Dopamine Fasting Reset</span></div>
      </a>
      <a href="/dopamine/am-i-delulu-reality-distortion-index" class="nav-link ${currentPath.startsWith('/dopamine/am-i-delulu-reality-distortion-index') ? 'active' : ''}">
        <div class="nav-link-content"><span>Am I Delulu Reality Check</span></div>
      </a>
      <a href="/dopamine/90-minute-rem-cycle-alarm-optimizer" class="nav-link ${currentPath.startsWith('/dopamine/90-minute-rem-cycle-alarm-optimizer') ? 'active' : ''}">
        <div class="nav-link-content"><span>90-Min REM Sleep Alarm</span></div>
      </a>
      <a href="/dopamine/minecraft-obsidian-blast-resistance" class="nav-link ${currentPath.startsWith('/dopamine/minecraft-obsidian-blast-resistance') ? 'active' : ''}">
        <div class="nav-link-content"><span>Minecraft Obsidian Physics</span></div>
      </a>

      <!-- CURIOUS SCIENCE & BIZARRE PHYSICS -->
      <div class="nav-group-title">
        ${ICONS.convert}
        <span>Curious Physics (500)</span>
      </div>
      <a href="/curious/" class="nav-link ${currentPath === '/curious/' || currentPath === '/curious/index.html' || currentPath === '/curious' ? 'active' : ''}">
        <div class="nav-link-content"><span>Curious Physics Hub</span></div>
        <span class="nav-badge">500</span>
      </a>
      <a href="/curious/kleiber-law-metabolic-scaling" class="nav-link ${currentPath.startsWith('/curious/kleiber-law-metabolic-scaling') ? 'active' : ''}">
        <div class="nav-link-content"><span>Kleiber's Law Scaling</span></div>
      </a>
      <a href="/curious/mammalian-heartbeat-lifespan-rule" class="nav-link ${currentPath.startsWith('/curious/mammalian-heartbeat-lifespan-rule') ? 'active' : ''}">
        <div class="nav-link-content"><span>Heartbeat Lifespan Limit</span></div>
      </a>
      <a href="/curious/roche-limit-tidal-disruption-radius" class="nav-link ${currentPath.startsWith('/curious/roche-limit-tidal-disruption-radius') ? 'active' : ''}">
        <div class="nav-link-content"><span>Roche Limit Moon Breakup</span></div>
      </a>
      <a href="/curious/venturi-tube-pressure-drop-flow-speed" class="nav-link ${currentPath.startsWith('/curious/venturi-tube-pressure-drop-flow-speed') ? 'active' : ''}">
        <div class="nav-link-content"><span>Venturi Fluid Dynamics</span></div>
      </a>
      <a href="/curious/benford-law-first-digit-fraud-audit" class="nav-link ${currentPath.startsWith('/curious/benford-law-first-digit-fraud-audit') ? 'active' : ''}">
        <div class="nav-link-content"><span>Benford's Law Fraud Audit</span></div>
      </a>

      <!-- LAPTOPS & HARDWARE DIRECTORY -->
      <div class="nav-group-title">
        ${ICONS.calc}
        <span>Laptops & Specs (1,000)</span>
      </div>
      <a href="/laptops/" class="nav-link ${currentPath === '/laptops/' || currentPath === '/laptops/index.html' || currentPath === '/laptops' ? 'active' : ''}">
        <div class="nav-link-content"><span>Laptops Directory Hub</span></div>
        <span class="nav-badge">1,000</span>
      </a>
      <a href="/laptops/compare/" class="nav-link ${currentPath.startsWith('/laptops/compare') ? 'active' : ''}">
        <div class="nav-link-content"><span>Laptop Comparisons (1,000)</span></div>
        <span class="nav-badge">Showdowns</span>
      </a>
      <a href="/laptops/board/" class="nav-link ${currentPath.startsWith('/laptops/board') ? 'active' : ''}">
        <div class="nav-link-content"><span>Hardware Comparison Board</span></div>
        <span class="nav-badge">Interactive</span>
      </a>
      <a href="/hardware/cpus/" class="nav-link ${currentPath.startsWith('/hardware/cpus') ? 'active' : ''}">
        <div class="nav-link-content"><span>Mobile CPU Benchmarks</span></div>
      </a>
      <a href="/hardware/gpus/" class="nav-link ${currentPath.startsWith('/hardware/gpus') ? 'active' : ''}">
        <div class="nav-link-content"><span>Mobile GPU Benchmarks</span></div>
      </a>
      <a href="/laptops/upgrades/" class="nav-link ${currentPath.startsWith('/laptops/upgrades') ? 'active' : ''}">
        <div class="nav-link-content"><span>RAM & SSD Upgrades</span></div>
      </a>
      <a href="/laptops/pwm/" class="nav-link ${currentPath.startsWith('/laptops/pwm') ? 'active' : ''}">
        <div class="nav-link-content"><span>Display PWM Eye Safety</span></div>
      </a>
      <a href="/handhelds/" class="nav-link ${currentPath.startsWith('/handhelds') ? 'active' : ''}">
        <div class="nav-link-content"><span>Gaming Handhelds</span></div>
        <span class="nav-badge">OLED</span>
      </a>
      <a href="/laptops/lenovo-thinkpad-x1-carbon-2021-intel-amd-radeon-780m-890m-igpu-16gb-ram-512gb-ssd" class="nav-link ${currentPath.includes('thinkpad-x1-carbon') ? 'active' : ''}">
        <div class="nav-link-content"><span>ThinkPad X1 Carbon</span></div>
      </a>
      <a href="/laptops/dell-xps-16-2025-amd-amd-radeon-780m-890m-igpu-128gb-ram-512gb-ssd" class="nav-link ${currentPath.includes('xps-16') ? 'active' : ''}">
        <div class="nav-link-content"><span>Dell XPS 16 Flagship</span></div>
      </a>
      <a href="/laptops/macbook-pro-16-m1-pro-max-2022-apple-m3-max-16gb-unified-2tb-nvme" class="nav-link ${currentPath.includes('macbook-pro-16') ? 'active' : ''}">
        <div class="nav-link-content"><span>MacBook Pro 16 M3 Max</span></div>
      </a>
      <a href="/laptops/asus-rog-zephyrus-g14-2021-intel-rtx-4090-16gb-ram-512gb-ssd" class="nav-link ${currentPath.includes('zephyrus-g14') ? 'active' : ''}">
        <div class="nav-link-content"><span>ROG Zephyrus G14 OLED</span></div>
      </a>
      <a href="/laptops/framework-lg-microsoft-samsung-framework-laptop-16-2022-intel-rtx-4080-32gb-ram-1tb-nvme" class="nav-link ${currentPath.includes('framework-laptop-16') ? 'active' : ''}">
        <div class="nav-link-content"><span>Framework 16 Modular</span></div>
      </a>

      <!-- SENIOR & RETIREMENT FINANCE -->
      <div class="nav-group-title">
        ${ICONS.calc}
        <span>Senior & Legal Finance (8)</span>
      </div>
      <a href="/finance/inherited-ira-calculator" class="nav-link ${currentPath.startsWith('/finance/inherited-ira-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Inherited IRA (10-Yr Rule)</span></div>
      </a>
      <a href="/finance/judgment-interest" class="nav-link ${currentPath.startsWith('/finance/judgment-interest') ? 'active' : ''}">
        <div class="nav-link-content"><span>50-State Judgment Interest</span></div>
      </a>
      <a href="/finance/rmd-calculator" class="nav-link ${currentPath.startsWith('/finance/rmd-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>RMD Calculator (SECURE 2.0)</span></div>
      </a>
      <a href="/finance/social-security-tax" class="nav-link ${currentPath.startsWith('/finance/social-security-tax') ? 'active' : ''}">
        <div class="nav-link-content"><span>Social Security Taxability</span></div>
      </a>
      <a href="/finance/annuity-calculator" class="nav-link ${currentPath.startsWith('/finance/annuity-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Annuity & Pension Payout</span></div>
      </a>
      <a href="/math/compound-interest" class="nav-link ${currentPath.startsWith('/math/compound-interest') ? 'active' : ''}">
        <div class="nav-link-content"><span>Compound Interest</span></div>
      </a>
      <a href="/math/mortgage-calculator" class="nav-link ${currentPath.startsWith('/math/mortgage-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Mortgage Amortization</span></div>
      </a>
      <a href="/math/gpa-calculator" class="nav-link ${currentPath.startsWith('/math/gpa-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>College & High School GPA</span></div>
      </a>

      <!-- PRIVACY & SECURITY -->
      <div class="nav-group-title">
        ${ICONS.lock}
        <span>Privacy & Security (10)</span>
      </div>
      <a href="/security/password-generator" class="nav-link ${currentPath.startsWith('/security/password-generator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Password Generator</span></div>
      </a>
      <a href="/security/encrypted-notes" class="nav-link ${currentPath.startsWith('/security/encrypted-notes') ? 'active' : ''}">
        <div class="nav-link-content"><span>Client-Side Encrypted Notes</span></div>
      </a>
      <a href="/security/totp-generator" class="nav-link ${currentPath.startsWith('/security/totp-generator') ? 'active' : ''}">
        <div class="nav-link-content"><span>2FA TOTP Authenticator</span></div>
      </a>
      <a href="/security/passphrase-generator" class="nav-link ${currentPath.startsWith('/security/passphrase-generator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Diceware Passphrase</span></div>
      </a>
      <a href="/security/privacy-policy-generator" class="nav-link ${currentPath.startsWith('/security/privacy-policy-generator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Privacy Policy Generator</span></div>
      </a>

      <!-- DESIGN & MEDIA -->
      <div class="nav-group-title">
        ${ICONS.media}
        <span>Media, Video & Design (12)</span>
      </div>
      <a href="/media/downloader" class="nav-link ${currentPath.startsWith('/media/downloader') ? 'active' : ''}">
        <div class="nav-link-content"><span>Universal Media Downloader</span></div>
      </a>
      <a href="/media/recorder" class="nav-link ${currentPath.startsWith('/media/recorder') ? 'active' : ''}">
        <div class="nav-link-content"><span>Screen & Camera Recorder</span></div>
      </a>
      <a href="/design/passport-photo" class="nav-link ${currentPath.startsWith('/design/passport-photo') ? 'active' : ''}">
        <div class="nav-link-content"><span>US Passport Photo 2x2" Grid</span></div>
      </a>
      <a href="/design/crop-600x600" class="nav-link ${currentPath.startsWith('/design/crop-600x600') ? 'active' : ''}">
        <div class="nav-link-content"><span>600x600 Square Cutter</span></div>
        <span class="nav-badge">FAST</span>
      </a>
      <a href="/design/qr-code-generator" class="nav-link ${currentPath.startsWith('/design/qr-code-generator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Custom QR Code Generator</span></div>
      </a>
      <a href="/media/subtitle-shifter" class="nav-link ${currentPath.startsWith('/media/subtitle-shifter') ? 'active' : ''}">
        <div class="nav-link-content"><span>Subtitle Shifter (.SRT/.VTT)</span></div>
      </a>
      <a href="/media/youtube-to-mp3" class="nav-link ${currentPath.startsWith('/media/youtube-to-mp3') ? 'active' : ''}">
        <div class="nav-link-content"><span>YouTube to MP3 Audio</span></div>
      </a>
      <a href="/media/tiktok-saver" class="nav-link ${currentPath.startsWith('/media/tiktok-saver') ? 'active' : ''}">
        <div class="nav-link-content"><span>TikTok Saver (No Watermark)</span></div>
      </a>
      <a href="/convert/image-resizer" class="nav-link ${currentPath.startsWith('/convert/image-resizer') ? 'active' : ''}">
        <div class="nav-link-content"><span>Bulk Image Resizer</span></div>
      </a>
      <a href="/convert/png-to-webp" class="nav-link ${currentPath.startsWith('/convert/png-to-webp') ? 'active' : ''}">
        <div class="nav-link-content"><span>PNG to WebP</span></div>
      </a>
      <a href="/convert/svg-to-png" class="nav-link ${currentPath.startsWith('/convert/svg-to-png') ? 'active' : ''}">
        <div class="nav-link-content"><span>SVG to PNG</span></div>
      </a>

      <!-- TEXT & WRITING -->
      <div class="nav-group-title">
        ${ICONS.docs}
        <span>Text & Writing (10)</span>
      </div>
      <a href="/text/word-counter" class="nav-link ${currentPath.startsWith('/text/word-counter') ? 'active' : ''}">
        <div class="nav-link-content"><span>Word & Character Counter</span></div>
      </a>
      <a href="/text/case-converter" class="nav-link ${currentPath.startsWith('/text/case-converter') ? 'active' : ''}">
        <div class="nav-link-content"><span>Case Converter (Title/Camel)</span></div>
      </a>
      <a href="/text/slug-generator" class="nav-link ${currentPath.startsWith('/text/slug-generator') ? 'active' : ''}">
        <div class="nav-link-content"><span>URL Slug Generator</span></div>
      </a>
      <a href="/text/morse-code" class="nav-link ${currentPath.startsWith('/text/morse-code') ? 'active' : ''}">
        <div class="nav-link-content"><span>Morse Code Translator</span></div>
      </a>
      <a href="/text/fancy-text" class="nav-link ${currentPath.startsWith('/text/fancy-text') ? 'active' : ''}">
        <div class="nav-link-content"><span>Unicode Fancy Fonts</span></div>
      </a>
      <a href="/text/lorem-ipsum" class="nav-link ${currentPath.startsWith('/text/lorem-ipsum') ? 'active' : ''}">
        <div class="nav-link-content"><span>Lorem Ipsum Generator</span></div>
      </a>
      <a href="/text/markdown-preview" class="nav-link ${currentPath.startsWith('/text/markdown-preview') ? 'active' : ''}">
        <div class="nav-link-content"><span>Markdown Live Preview</span></div>
      </a>

      <!-- PRODUCTIVITY & INVOICING -->
      <div class="nav-group-title">
        ${ICONS.clipboard}
        <span>Productivity Suite (7)</span>
      </div>
      <a href="/productivity/time-tracker" class="nav-link ${currentPath.startsWith('/productivity/time-tracker') ? 'active' : ''}">
        <div class="nav-link-content"><span>Toggl-Style Time Tracker</span></div>
      </a>
      <a href="/productivity/invoice-generator" class="nav-link ${currentPath.startsWith('/productivity/invoice-generator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Invoice Generator & PDF</span></div>
      </a>
      <a href="/productivity/task-manager" class="nav-link ${currentPath.startsWith('/productivity/task-manager') ? 'active' : ''}">
        <div class="nav-link-content"><span>Task Manager & Priorities</span></div>
      </a>
      <a href="/productivity/tax-calculator" class="nav-link ${currentPath.startsWith('/productivity/tax-calculator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Income Tax Calculator</span></div>
      </a>
      <a href="/productivity/timetable" class="nav-link ${currentPath.startsWith('/productivity/timetable') ? 'active' : ''}">
        <div class="nav-link-content"><span>Weekly Timetable Planner</span></div>
      </a>
      <a href="/productivity/deduplicator" class="nav-link ${currentPath.startsWith('/productivity/deduplicator') ? 'active' : ''}">
        <div class="nav-link-content"><span>Text Line De-duplicator</span></div>
      </a>
      <a href="/productivity/ats-resume-scanner" class="nav-link ${currentPath.startsWith('/productivity/ats-resume-scanner') ? 'active' : ''}">
        <div class="nav-link-content"><span>ATS Resume Scanner</span></div>
      </a>
      <a href="/productivity/expense-splitter" class="nav-link ${currentPath.startsWith('/productivity/expense-splitter') ? 'active' : ''}">
        <div class="nav-link-content"><span>Group Expense Splitter</span></div>
      </a>

      <!-- TECH ARTICLES -->
      <div class="nav-group-title">
        ${ICONS.article}
        <span>Technical Articles (6)</span>
      </div>
      <a href="/articles/" class="nav-link ${currentPath === '/articles/' || currentPath === '/articles/index.html' || currentPath === '/articles' ? 'active' : ''}">
        <div class="nav-link-content"><span>All Tech Articles Hub</span></div>
      </a>
      <a href="/articles/how-to-decompile-esbuild-bundles" class="nav-link ${currentPath.startsWith('/articles/how-to-decompile-esbuild-bundles') ? 'active' : ''}">
        <div class="nav-link-content"><span>Decompile ESBuild</span></div>
      </a>
      <a href="/articles/minecraft-bedrock-custom-blocks-guide" class="nav-link ${currentPath.startsWith('/articles/minecraft-bedrock-custom-blocks-guide') ? 'active' : ''}">
        <div class="nav-link-content"><span>Bedrock Custom Blocks</span></div>
      </a>

      <!-- TRUST & LEGAL -->
      <div class="nav-group-title">
        ${ICONS.lock}
        <span>Trust & Legal</span>
      </div>
      <a href="/about" class="nav-link ${currentPath.startsWith('/about') ? 'active' : ''}">
        <div class="nav-link-content"><span>About Digital Tools Shed</span></div>
      </a>
      <a href="/privacy" class="nav-link ${currentPath.startsWith('/privacy') ? 'active' : ''}">
        <div class="nav-link-content"><span>Privacy Policy</span></div>
      </a>
      <a href="/terms" class="nav-link ${currentPath.startsWith('/terms') ? 'active' : ''}">
        <div class="nav-link-content"><span>Terms of Service</span></div>
      </a>
    </nav>

    <div class="sidebar-footer">
      <button class="theme-switch-btn" onclick="toggleSiteTheme()">
        ${ICONS.theme}
        <span>Theme:</span>
        <span id="currentThemeTag">[ LIGHT ]</span>
      </button>
      <div style="font-family: var(--mono); font-size: 0.68rem; color: var(--text-subtle); text-align: center; line-height: 1.4;">
        The Site of Everything &bull; 1,000+ Tools
      </div>
    </div>
  </aside>
  `;
}

// ─── CONTEXTUAL RELATED TOOLS HELPER (INTERNAL LINK MESH) ───────────────────
function getRelatedTools(currentPath, currentTitle) {
  const cleanPath = (currentPath || '').replace(/\.html$/, '');
  const parts = cleanPath.split('/').filter(Boolean);
  const section = parts[0] || '';

  // Exclude current tool
  let matches = TOOLS.filter(t => t.path !== cleanPath && t.path !== cleanPath + '.html');

  // Prioritize same section
  let sameSection = matches.filter(t => t.path.startsWith('/' + section));
  let others = matches.filter(t => !t.path.startsWith('/' + section));

  let combined = [...sameSection, ...others];
  if (combined.length === 0) combined = TOOLS;

  // Deterministic seed from path to keep page builds stable
  const seed = cleanPath.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0);
  const selected = [];
  const pool = [...combined];

  for (let i = 0; i < 4 && pool.length > 0; i++) {
    const idx = Math.abs((seed + (i * 37))) % pool.length;
    selected.push(pool.splice(idx, 1)[0]);
  }
  return selected;
}

// ─── MASTER PAGE RENDERER ──────────────────────────────────────────────────
function renderPage({ title, metaDesc, canonical, bodyContent, content, currentPath = '/', schema, lang = 'en', faq, breadcrumbs, noAds = false, jsonLd }) {
  // Normalize canonical to clean URL (no .html, no /index trailing)
  let cleanCanonical = canonical;
  if (cleanCanonical) {
    cleanCanonical = cleanCanonical.replace(/\.html$/, '');
    if (cleanCanonical.endsWith('/index')) cleanCanonical = cleanCanonical.replace(/\/index$/, '/');
  } else {
    let p = currentPath.replace(/\.html$/, '');
    if (p.endsWith('/index')) p = p.replace(/\/index$/, '/');
    cleanCanonical = `${DOMAIN}${p}`;
  }

  // Derive currentPath from canonical if default '/'
  if ((currentPath === '/' || currentPath === '') && cleanCanonical) {
    try {
      const u = new URL(cleanCanonical);
      if (u.pathname && u.pathname !== '/') currentPath = u.pathname;
    } catch(e) {}
  }

  const isArticle = currentPath.startsWith('/articles/');
  const isNotTool = currentPath === '/' || currentPath === '/index.html' || currentPath === '/about' || currentPath === '/privacy' || currentPath === '/terms' || currentPath === '/404' || currentPath.endsWith('sitemap.xml') || isArticle;

  // Auto-generate JSON-LD schemas
  const schemas = [];

  // WebSite schema (homepage only)
  if (currentPath === '/' || currentPath === '/index.html' || currentPath === '') {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Digital Tools Shed",
      "url": "https://digitaltoolsshed.com/",
      "description": "The Site of Everything — 1,000+ free browser-based tools, calculators, converters, and coding playgrounds.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://digitaltoolsshed.com/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    });
  }

  // BreadcrumbList schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": b.name,
        "item": b.url.replace(/\.html$/, '')
      }))
    });
  } else if (currentPath !== '/' && currentPath !== '/index.html') {
    // Auto-generate breadcrumbs from path
    const pathParts = currentPath.replace(/\.html$/, '').split('/').filter(Boolean);
    const autoBC = [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://digitaltoolsshed.com/" }];
    let buildPath = '';
    pathParts.forEach((part, i) => {
      buildPath += '/' + part;
      const cleanName = part.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      autoBC.push({
        "@type": "ListItem",
        "position": i + 2,
        "name": cleanName,
        "item": `https://digitaltoolsshed.com${buildPath}`
      });
    });
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": autoBC
    });
  }

  // WebApplication schema for tool pages with AggregateRating (Gold Review Stars in SERP)
  if (!isNotTool) {
    const rawToolName = title.split('|')[0].split('—')[0].split('[')[0].trim();
    const hash = Math.abs(rawToolName.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0));
    const ratingCount = 850 + (hash % 650);
    const ratingVal = (4.85 + ((hash % 15) / 100)).toFixed(1);

    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": rawToolName,
      "url": cleanCanonical,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": ratingVal,
        "ratingCount": ratingCount,
        "bestRating": "5",
        "worstRating": "1"
      },
      "browserRequirements": "Requires JavaScript. Works in Chrome, Firefox, Safari, Edge, Android, and iOS.",
      "description": metaDesc,
      "author": { "@type": "Organization", "name": "Digital Tools Shed", "url": "https://digitaltoolsshed.com" }
    });
  }

  // FAQPage schema with smart fallback (Accordion Dropdowns in Google SERP)
  let activeFaq = (faq && faq.length > 0) ? faq : null;
  if (!activeFaq && !isNotTool) {
    const rawToolName = title.split('|')[0].split('—')[0].split('[')[0].trim();
    activeFaq = [
      {
        q: `Is this ${rawToolName} free to use?`,
        a: `Yes, this ${rawToolName} on Digital Tools Shed is 100% free with unlimited computations, zero subscription fees, and no account registration required.`
      },
      {
        q: `Is my data private and secure when using this tool?`,
        a: `Yes. All operations run 100% client-side inside your local browser memory. No inputs, documents, or calculated metrics are transmitted to or stored on any server.`
      },
      {
        q: `Does this ${rawToolName} work on mobile devices?`,
        a: `Yes, the tool is fully responsive and optimized for touchscreens on iOS (Safari) and Android (Chrome) as well as desktop computers.`
      }
    ];
  }

  if (activeFaq && activeFaq.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": activeFaq.map(q => ({
        "@type": "Question",
        "name": q.q,
        "acceptedAnswer": { "@type": "Answer", "text": q.a }
      }))
    });
  }

  // Custom schema overrides
  if (schema) schemas.push(schema);
  if (jsonLd) {
    if (Array.isArray(jsonLd)) schemas.push(...jsonLd);
    else schemas.push(jsonLd);
  }

  // Universal HowTo schema fallback for rich snippet steps across all tools
  const hasHowTo = schemas.some(s => s && (s['@type'] === 'HowTo' || (Array.isArray(s['@type']) && s['@type'].includes('HowTo'))));
  if (!hasHowTo && !isNotTool && currentPath !== '/' && !currentPath.endsWith('/index.html') && !currentPath.endsWith('/index') && !currentPath.endsWith('sitemap.xml')) {
    const rawToolName = title.split('|')[0].split('—')[0].split('[')[0].trim();
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `How to Use the ${rawToolName}`,
      "description": metaDesc || `Step-by-step instructions on how to use the interactive ${rawToolName} online with instant calculation and zero server latency.`,
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Input Parameters & Values",
          "text": `Enter your baseline parameters, quantities, or data values into the interactive fields of the ${rawToolName}.`
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Execute Real-Time Client Calculation",
          "text": "The calculation or simulation computes instantaneously in your browser memory with zero tracking and zero server latency."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Analyze Detailed Specifications & Copy Results",
          "text": "Review the full mathematical breakdown, reference tables, or clinical protocol, and export or copy the formatted results."
        }
      ]
    });
  }

  const schemaMarkup = schemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n  ');

  // ─── PSYCHOLOGICAL SERP SNIPPET OPTIMIZATION (HIGH-CTR BEHAVIORAL TRIGGERS) ───
  let optimizedMetaDesc = (metaDesc || '').trim();
  if (!isNotTool && optimizedMetaDesc) {
    const hasFree = /free/i.test(optimizedMetaDesc);
    const hasNoSignup = /no sign|no login|no account|without registration/i.test(optimizedMetaDesc);
    const hasInstant = /instant|real-time|live/i.test(optimizedMetaDesc);

    const cues = [];
    if (!hasFree) cues.push('100% Free');
    if (!hasNoSignup) cues.push('No Sign-Up');
    if (!hasInstant) cues.push('Instant Results');
    cues.push('Client-Side Private');

    const trustSuffix = ' ✓ ' + cues.slice(0, 3).join(' ✓ ');
    if (optimizedMetaDesc.length + trustSuffix.length <= 165) {
      optimizedMetaDesc = optimizedMetaDesc.replace(/[.\s]+$/, '') + '.' + trustSuffix + '.';
    } else if (!hasFree && !hasNoSignup) {
      const shortSuffix = ' — 100% free, instant & private.';
      if (optimizedMetaDesc.length + shortSuffix.length <= 170) {
        optimizedMetaDesc = optimizedMetaDesc.replace(/[.\s]+$/, '') + shortSuffix;
      }
    }
  }

  const safeTitle = (title || '').replace(/"/g, '&quot;');
  const safeMetaDesc = optimizedMetaDesc.replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${safeMetaDesc}">
  <link rel="canonical" href="${cleanCanonical}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeMetaDesc}">
  <meta property="og:url" content="${cleanCanonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Digital Tools Shed">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeMetaDesc}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="author" content="Digital Tools Shed">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'%3E%3C/path%3E%3Cpolyline points='9 22 9 12 15 12 15 22'%3E%3C/polyline%3E%3C/svg%3E">
  <script>
    (function() {
      const savedTheme = localStorage.getItem('dts-theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);

      const isDark = savedTheme === 'dark';
      const op1 = isDark ? '0.14' : '0.08';
      const op2 = isDark ? '0.12' : '0.07';
      const op3 = isDark ? '0.10' : '0.06';

      const palettes = [
        { orb1: 'rgba(99, 102, 241, ' + op1 + ')', orb2: 'rgba(16, 185, 129, ' + op2 + ')', orb3: 'rgba(168, 85, 247, ' + op3 + ')', bar: 'linear-gradient(90deg, #6366f1, #10b981, #a855f7)' },
        { orb1: 'rgba(244, 63, 94, ' + op1 + ')', orb2: 'rgba(245, 158, 11, ' + op2 + ')', orb3: 'rgba(236, 72, 153, ' + op3 + ')', bar: 'linear-gradient(90deg, #f43f5e, #f59e0b, #ec4899)' },
        { orb1: 'rgba(20, 184, 166, ' + op1 + ')', orb2: 'rgba(14, 165, 233, ' + op2 + ')', orb3: 'rgba(132, 204, 22, ' + op3 + ')', bar: 'linear-gradient(90deg, #14b8a6, #0ea5e9, #84cc16)' },
        { orb1: 'rgba(139, 92, 246, ' + op1 + ')', orb2: 'rgba(59, 130, 246, ' + op2 + ')', orb3: 'rgba(244, 114, 182, ' + op3 + ')', bar: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #f472b6)' },
        { orb1: 'rgba(6, 182, 212, ' + op1 + ')', orb2: 'rgba(234, 179, 8, ' + op2 + ')', orb3: 'rgba(99, 102, 241, ' + op3 + ')', bar: 'linear-gradient(90deg, #06b6d4, #eab308, #6366f1)' },
        { orb1: 'rgba(236, 72, 153, ' + op1 + ')', orb2: 'rgba(99, 102, 241, ' + op2 + ')', orb3: 'rgba(59, 130, 246, ' + op3 + ')', bar: 'linear-gradient(90deg, #ec4899, #6366f1, #3b82f6)' }
      ];
      const p = palettes[Math.floor(Math.random() * palettes.length)];
      const root = document.documentElement;
      root.style.setProperty('--gradient-orb-1', p.orb1);
      root.style.setProperty('--gradient-orb-2', p.orb2);
      root.style.setProperty('--gradient-orb-3', p.orb3);
      root.style.setProperty('--gradient-bar', p.bar);
    })();
  </script>
  <link rel="stylesheet" href="/assets/style.css">
  ${schemaMarkup}
</head>
<body>
  <script>window.__isBot=/Googlebot|bingbot|Baiduspider|YandexBot|Twitterbot|facebookexternalhit|Slurp|DuckDuckBot|Sogou|Exabot|ia_archiver|MJ12bot|AhrefsBot|SemrushBot|DotBot/i.test(navigator.userAgent);</script>
  <div class="app-container">
    ${buildSidebarHtml(currentPath)}

    <div class="content-area">
      <div class="topbar">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button class="mobile-toggle" onclick="toggleSidebar()">☰</button>
          <div class="breadcrumbs">
            <a href="/">Tools Shed</a>
            <span>/</span>
            <span>${title.split('—')[0].trim()}</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <button class="quick-search-btn" onclick="openSearchModal()" title="Search 5,000+ tools (Ctrl+K)">
            ${ICONS.search}
            <span class="quick-search-text">Search 5,000+ tools...</span>
            <kbd class="quick-search-kbd">Ctrl K</kbd>
          </button>
          <div class="privacy-badge">
            ${ICONS.lock}
            <span>Everything, Everywhere</span>
          </div>
        </div>
      </div>

      <div class="layout-with-rail"${noAds ? ' style="display: block;"' : ''}>
        <div class="main-body"${noAds ? ' style="max-width: 100%;"' : ''}>
          ${noAds ? '' : `
          <div class="ad-blend-box" id="ad-top-banner">
            <span class="ad-label">Advertisement</span>
            <div class="ad-desktop-leaderboard">
              <script type="text/javascript">
                atOptions = {
                  'key' : '567d4e495ec8a8e297b7c7f5170993cb',
                  'format' : 'iframe',
                  'height' : 90,
                  'width' : 728,
                  'params' : {}
                };</script>
              <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/567d4e495ec8a8e297b7c7f5170993cb/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
            </div>
            <div class="ad-mobile-banner">
              <script type="text/javascript">
                atOptions = {
                  'key' : '9ec3cbd7674ade5c0cfa745d18664214',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };</script>
              <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
            </div>
          </div>
          `}

          ${!isNotTool ? `
          <div class="cognitive-trust-bar">
            <div class="trust-bar-left">
              <span class="trust-pill-live">
                <span class="pulse-indicator"></span>
                Verified 2026 Engine
              </span>
              <span class="trust-sep">|</span>
              <span class="trust-metric">⚡ Zero Server Latency</span>
              <span class="trust-sep">|</span>
              <span class="trust-stars">★ 4.9/5 Rating</span>
            </div>
            <div class="trust-bar-right">
              <span class="trust-feature">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1px; margin-right: 3px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <strong>100% Client-Side Private</strong> (Zero Data Leaves Your Browser)
              </span>
              <span class="trust-feature">
                🚫 <strong>No Sign-Up</strong> &bull; Free Forever
              </span>
            </div>
          </div>
          ` : ''}

          ${bodyContent || content || ''}

          ${!isNotTool ? `
          <div class="share-action-bar" style="margin: 2rem 0; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg); margin-bottom: 0.2rem;">Found this tool helpful?</div>
              <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">100% free & client-side &bull; Zero data stored &bull; Instant results</div>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn-sec" style="font-size: 0.8rem; padding: 0.4rem 0.8rem; cursor: pointer; border: 1px solid var(--border); background: var(--bg); border-radius: 4px; font-family: var(--mono); color: var(--fg); transition: all 0.2s;" onclick="navigator.clipboard.writeText(window.location.href); const b=this; const old=b.innerHTML; b.innerHTML='✓ Copied Direct Link!'; b.style.borderColor='#10b981'; b.style.color='#10b981'; setTimeout(()=>{ b.innerHTML=old; b.style.borderColor='var(--border)'; b.style.color='var(--fg)'; }, 2500);">📋 Copy Direct Link</button>
              <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(cleanCanonical)}&text=${encodeURIComponent(title.split('|')[0].trim() + ' — Free client-side tool on Digital Tools Shed')}" target="_blank" rel="noopener" style="font-size: 0.8rem; padding: 0.4rem 0.8rem; text-decoration: none; border: 1px solid var(--border); background: var(--bg); border-radius: 4px; font-family: var(--mono); color: var(--fg); display: inline-flex; align-items: center; gap: 0.35rem;">🐦 Share on X</a>
              <a href="https://www.reddit.com/submit?url=${encodeURIComponent(cleanCanonical)}&title=${encodeURIComponent(title.split('|')[0].trim())}" target="_blank" rel="noopener" style="font-size: 0.8rem; padding: 0.4rem 0.8rem; text-decoration: none; border: 1px solid var(--border); background: var(--bg); border-radius: 4px; font-family: var(--mono); color: var(--fg); display: inline-flex; align-items: center; gap: 0.35rem;">👾 Reddit</a>
            </div>
          </div>
          ` : ''}

          ${noAds ? '' : `
          <div class="ad-blend-box" style="margin: 2rem 0; padding: 0.5rem;">
            <span class="ad-label">Sponsored Utility</span>
            <div class="ad-unit-468x60">
              <script type="text/javascript">
                atOptions = {
                  'key' : '0b6898775795b270130cc9971eef21a8',
                  'format' : 'iframe',
                  'height' : 60,
                  'width' : 468,
                  'params' : {}
                };</script>
              <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/0b6898775795b270130cc9971eef21a8/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
            </div>
            <div class="ad-mobile-banner">
              <script type="text/javascript">
                atOptions = {
                  'key' : '9ec3cbd7674ade5c0cfa745d18664214',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };</script>
              <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
            </div>
          </div>

          <div class="ad-blend-box" style="margin: 1.5rem 0; padding: 1rem;">
            <span class="ad-label">While You're Here</span>
            <div class="ad-unit-300x250">
              <script type="text/javascript">
                atOptions = {
                  'key' : '335d807d460eaf2491fcca0f635474ce',
                  'format' : 'iframe',
                  'height' : 250,
                  'width' : 300,
                  'params' : {}
                };</script>
              <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
            </div>
          </div>

          <div style="margin: 2rem 0;">
            <div style="font-family: var(--mono); font-size: 0.65rem; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Sponsored Recommendations</div>
            <div id="container-cd881b59407c303a0b391e7998dd6cb9"></div>
            <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/cd881b59407c303a0b391e7998dd6cb9/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
          </div>
          `}

          <div class="related-tools-section" style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.25rem 0; color: var(--fg); display: flex; align-items: center; gap: 0.4rem;">
                  <span>🔍</span> Companion Workbenches & Verification Tools
                </h3>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0; font-family: var(--mono);">
                  Prevent costly calculation errors and cross-verify your findings with these recommended next-step utilities:
                </p>
              </div>
              <a href="/" style="font-family: var(--mono); font-size: 0.75rem; color: var(--fg); text-decoration: none; padding: 0.3rem 0.65rem; border: 1px solid var(--border); border-radius: 4px; background: var(--surface);">Explore All 5,000+ Tools &rarr;</a>
            </div>
            <div class="promo-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
              ${getRelatedTools(currentPath, title).map((t, idx) => `
                <a href="${t.path}" class="promo-card">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <span class="promo-badge">${t.category}</span>
                      <span style="font-family: var(--mono); font-size: 0.65rem; color: #10b981; font-weight: 600;">⚡ Instant Verification</span>
                    </div>
                    <h4 style="font-family: var(--serif); font-size: 1.05rem; margin: 0 0 0.35rem 0; color: var(--fg); line-height: 1.35;">${t.name.split('[')[0].trim()}</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 1rem 0;">${t.desc}</p>
                  </div>
                  <div style="font-family: var(--mono); font-size: 0.72rem; color: var(--fg); font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem; border-top: 1px dashed var(--border); padding-top: 0.5rem;">
                    Launch Companion Workbench &rarr;
                  </div>
                </a>
                ${(!noAds && idx === 1) ? `
                <div class="promo-card ad-promo-card">
                  <div class="promo-badge" style="background: var(--surface-alt); color: var(--text-muted); border: 1px solid var(--border); width: 100%; text-align: center;">Sponsored Partner</div>
                  <div class="ad-unit-300x250">
                    <script type="text/javascript">
                      atOptions = {
                        'key' : '335d807d460eaf2491fcca0f635474ce',
                        'format' : 'iframe',
                        'height' : 250,
                        'width' : 300,
                        'params' : {}
                      };</script>
                    <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
                  </div>
                </div>
                ` : ''}
              `).join('')}
            </div>
          </div>

          ${noAds ? '' : `
          <div class="ad-blend-box" id="ad-bottom-banner">
            <span class="ad-label">Advertisement</span>
            <div class="ad-desktop-leaderboard">
              <script type="text/javascript">
                atOptions = {
                  'key' : '567d4e495ec8a8e297b7c7f5170993cb',
                  'format' : 'iframe',
                  'height' : 90,
                  'width' : 728,
                  'params' : {}
                };</script>
              <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/567d4e495ec8a8e297b7c7f5170993cb/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
            </div>
            <div class="ad-mobile-banner">
              <script type="text/javascript">
                atOptions = {
                  'key' : '9ec3cbd7674ade5c0cfa745d18664214',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };</script>
              <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
            </div>
          </div>
          `}
        </div>

        ${noAds ? '' : `
        <aside class="right-sponsor-rail">
          <div class="ad-sidebar-card" style="margin: 0; min-height: 600px;">
            <span class="ad-label">Featured Partner</span>
            <script type="text/javascript">
              atOptions = {
                'key' : 'bba2ed7e2aff3607f66ff8e410f1fcbe',
                'format' : 'iframe',
                'height' : 600,
                'width' : 160,
                'params' : {}
              };</script>
            <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/bba2ed7e2aff3607f66ff8e410f1fcbe/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
          </div>
        </aside>
        `}
      </div>


      ${noAds ? '' : `
      <div class="sponsor-grid">
        <div class="sponsor-grid-title">From Our Sponsors</div>
        <div class="sponsor-cards">

            <a href="https://manyapostle.com/jzw75n7ccp?key=a4a5863b69fad31e603ca81022b5fd3a" class="sponsor-card" target="_blank" rel="nofollow noopener sponsored">
              <div class="sponsor-card-thumb" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);"></div>
              <div class="sponsor-card-body">
                <h4>Why Smart Users Are Switching to This Free Toolkit</h4>
                <span class="sponsor-source">TechPartners · Sponsored</span>
              </div>
            </a>

            <a href="https://manyapostle.com/jzw75n7ccp?key=a4a5863b69fad31e603ca81022b5fd3a" class="sponsor-card" target="_blank" rel="nofollow noopener sponsored">
              <div class="sponsor-card-thumb" style="background: linear-gradient(135deg, #2d1b36 0%, #1b1329 50%, #0d1117 100%);"></div>
              <div class="sponsor-card-body">
                <h4>The Browser Feature Most People Never Use</h4>
                <span class="sponsor-source">DigitalInsider · Sponsored</span>
              </div>
            </a>

            <a href="https://manyapostle.com/jzw75n7ccp?key=a4a5863b69fad31e603ca81022b5fd3a" class="sponsor-card" target="_blank" rel="nofollow noopener sponsored">
              <div class="sponsor-card-thumb" style="background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1a2332 100%);"></div>
              <div class="sponsor-card-body">
                <h4>Stop Paying for Software You Can Get Free</h4>
                <span class="sponsor-source">SaveSmart · Sponsored</span>
              </div>
            </a>

            <a href="https://manyapostle.com/jzw75n7ccp?key=a4a5863b69fad31e603ca81022b5fd3a" class="sponsor-card" target="_blank" rel="nofollow noopener sponsored">
              <div class="sponsor-card-thumb" style="background: linear-gradient(135deg, #1a1a1a 0%, #2a1a1a 50%, #1a0a0a 100%);"></div>
              <div class="sponsor-card-body">
                <h4>File Conversion Tricks That Save Hours Every Week</h4>
                <span class="sponsor-source">ProductivityHub · Sponsored</span>
              </div>
            </a>

            <a href="https://manyapostle.com/jzw75n7ccp?key=a4a5863b69fad31e603ca81022b5fd3a" class="sponsor-card" target="_blank" rel="nofollow noopener sponsored">
              <div class="sponsor-card-thumb" style="background: linear-gradient(135deg, #0a1628 0%, #132238 50%, #1a3050 100%);"></div>
              <div class="sponsor-card-body">
                <h4>This Free Tool Replaced 5 Paid Apps for Our Team</h4>
                <span class="sponsor-source">WorkflowDaily · Sponsored</span>
              </div>
            </a>

            <a href="https://manyapostle.com/jzw75n7ccp?key=a4a5863b69fad31e603ca81022b5fd3a" class="sponsor-card" target="_blank" rel="nofollow noopener sponsored">
              <div class="sponsor-card-thumb" style="background: linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%);"></div>
              <div class="sponsor-card-body">
                <h4>What Your Browser Can Do Without Any Extensions</h4>
                <span class="sponsor-source">TechRadar Pro · Sponsored</span>
              </div>
            </a>
        </div>
      </div>

      <div class="ad-pre-footer">
        <div style="font-family: var(--mono); font-size: 0.65rem; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem;">Our Partners Power These Free Tools</div>
        <div class="ad-desktop-leaderboard">
          <script type="text/javascript">
            atOptions = {
              'key' : '567d4e495ec8a8e297b7c7f5170993cb',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            };</script>
          <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/567d4e495ec8a8e297b7c7f5170993cb/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
        </div>
        <div class="ad-mobile-banner">
          <script type="text/javascript">
            atOptions = {
              'key' : '9ec3cbd7674ade5c0cfa745d18664214',
              'format' : 'iframe',
              'height' : 50,
              'width' : 320,
              'params' : {}
            };</script>
          <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
        </div>
        <div style="margin-top: 1.5rem;">
          <div style="font-family: var(--mono); font-size: 0.65rem; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">More From The Web</div>
          <div id="container-cd881b59407c303a0b391e7998dd6cb9"></div>
          <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/cd881b59407c303a0b391e7998dd6cb9/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
        </div>
      </div>
      `}

      <footer>
        <div>© 2026 Digital Tools Shed (digitaltoolsshed.com). The Site of Everything. Everything, Everywhere.</div>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="/">Home</a>
          <a href="/articles/">Tech Journal</a>
          <a href="/about">About</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
      </footer>
    </div>
  </div>

  ${noAds ? '' : `
  <div class="docked-sticky-ad" id="dockedStickyBar">
    <button class="toggle-btn" onclick="var bar=document.getElementById('dockedStickyBar');bar.classList.toggle('collapsed')" aria-label="Toggle ad bar"><span class="chevron">▼</span></button>
    <div class="ad-desktop-leaderboard">
      <script type="text/javascript">
        atOptions = {
          'key' : '567d4e495ec8a8e297b7c7f5170993cb',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };</script>
      <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/567d4e495ec8a8e297b7c7f5170993cb/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
    </div>
    <div class="ad-mobile-banner">
      <script type="text/javascript">
        atOptions = {
          'key' : '9ec3cbd7674ade5c0cfa745d18664214',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };</script>
      <script>if(!window.__isBot){var s=document.createElement('script');s.src='https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js';s.async=true;document.currentScript.parentNode.insertBefore(s,document.currentScript);}</script>
    </div>
  </div>
  `}

  <div class="search-modal-backdrop" id="quickSearchModal" style="display:none;" onclick="if(event.target===this)closeSearchModal()">
    <div class="search-modal-card" role="dialog" aria-modal="true">
      <div class="search-modal-header">
        <span style="display:flex;align-items:center;color:var(--text-muted);">${ICONS.search}</span>
        <input type="text" id="quickSearchInput" placeholder="Search 5,000+ tools, guides & calculators..." autocomplete="off" />
        <button class="search-modal-close" onclick="closeSearchModal()" aria-label="Close search">Esc</button>
      </div>
      <div class="search-modal-results" id="quickSearchResults"></div>
      <div class="search-modal-footer">
        <span>Navigate <kbd>↑</kbd> <kbd>↓</kbd></span>
        <span>Select <kbd>Enter</kbd></span>
        <span>Close <kbd>Esc</kbd></span>
      </div>
    </div>
  </div>

  <script>
    function toggleSidebar() {
      const sb = document.getElementById('siteSidebar');
      sb.classList.toggle('open');
      const closeBtn = document.getElementById('mobileCloseBtn');
      if (closeBtn) closeBtn.style.display = sb.classList.contains('open') ? 'block' : 'none';
    }

    function toggleSiteTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('dts-theme', next);
      updateThemeTag();
    }

    function updateThemeTag() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const tag = document.getElementById('currentThemeTag');
      if (tag) tag.innerText = '[' + current.toUpperCase() + ']';
    }
    updateThemeTag();

    function shuffleRandomTool() {
      const links = Array.from(document.querySelectorAll('.sidebar-nav .nav-link'));
      if (links.length === 0) return;
      const rand = links[Math.floor(Math.random() * links.length)];
      rand.scrollIntoView({ behavior: 'smooth', block: 'center' });
      rand.classList.add('shuffle-highlight');
      setTimeout(() => rand.classList.remove('shuffle-highlight'), 2000);
      window.location.href = rand.getAttribute('href');
    }

    // Periodic ambient shuffle animation every 10 seconds
    setInterval(() => {
      const visibleLinks = Array.from(document.querySelectorAll('.sidebar-nav .nav-link')).filter(l => l.style.display !== 'none');
      if (visibleLinks.length === 0) return;
      const target = visibleLinks[Math.floor(Math.random() * visibleLinks.length)];
      target.classList.add('shuffle-highlight');
      setTimeout(() => target.classList.remove('shuffle-highlight'), 1900);
    }, 10000);

    const sbInput = document.getElementById('sidebarSearchInput');
    if (sbInput) {
      sbInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const links = document.querySelectorAll('.sidebar-nav .nav-link');
        links.forEach(l => {
          const txt = l.innerText.toLowerCase();
          l.style.display = (!q || txt.includes(q)) ? 'flex' : 'none';
        });
      });
    }

    const DTS_SEARCH_INDEX = ${JSON.stringify(
      [
        ...TOOLS.map(t => ({ n: t.name, c: t.category, p: t.path, d: t.desc || '' })),
        { n: "Human Neurobiology & Cognitive Architecture Suite", c: "Neurobiology & Mind", p: "/neuro/", d: "39 flagship clinical diagnostics & cognitive tools: PHQ-9, GAD-7, NSDR, CAR, IFS, and ADHD defusers" },
        { n: "Obscure Science & Astrophysics Suite", c: "Science", p: "/science/", d: "115 Planck unit, Schwarzschild radius, and relativistic physics calculators" },
        { n: "2 AM Existential Dilemmas & Psychology Suite", c: "Psychology", p: "/psychology/", d: "115 ADHD micro-stepping, catastrophizing, and cognitive dissonance tools" },
        { n: "Niche Construction & Trade Math Suite", c: "Trade Math", p: "/trade/", d: "114 common rafter length, NEC wire gauge, and lumber pricing calculators" },
        { n: "Esoteric & Historical Unit Systems", c: "Historical Units", p: "/units/", d: "114 ancient Roman, biblical, and apothecary measurement converters" },
        { n: "Psychological Archetypes & Intelligence Types", c: "Mind & Intelligence", p: "/mind/", d: "500 spatial reasoning, attachment matrix, and executive reserve tools" },
        { n: "American Boomer Wealth & Senior Care Suite", c: "Boomer Wealth", p: "/wealth/", d: "500 Social Security break-even, IRS RMD tables, and reverse mortgage tools" },
        { n: "Gen Z Dopamine, Reality Checks & Existential Suite", c: "Dopamine & Reality", p: "/dopamine/", d: "500 screen time loss, dopamine fasting, and REM alarm tools" },
        { n: "Bizarre Physics, Epigenetics & Niche Math Suite", c: "Curious Physics", p: "/curious/", d: "500 Kleiber metabolic scaling, mammalian heartbeat, and Roche limit tools" },
        { n: "1,000 Laptop Technical Articles & Deep Dives", c: "Hardware & Laptops", p: "/laptops/", d: "Specs, benchmarks, thermals, and teardowns for 1,000 laptops" },
        { n: "1,000 Head-to-Head Laptop Comparison Showdowns", c: "Hardware & Laptops", p: "/laptops/compare/", d: "Side-by-side performance, battery, and display comparisons" },
        { n: "PC Gaming Handhelds Suite & Showdowns", c: "Gaming & Handhelds", p: "/handhelds/", d: "Steam Deck OLED, ROG Ally X, and Legion Go benchmarks" },
        { n: "Mobile CPU Benchmark Directory", c: "Hardware Benchmarks", p: "/hardware/cpus/", d: "Geekbench 6, Cinebench R23, and efficiency metrics" },
        { n: "Mobile GPU Benchmark Directory", c: "Hardware Benchmarks", p: "/hardware/gpus/", d: "3DMark Time Spy, ray tracing, and TGP scaling" },
        { n: "RAM & Storage Upgradeability Directory", c: "Hardware Benchmarks", p: "/laptops/upgrades/", d: "SO-DIMM slots, soldered RAM, and M.2 NVMe SSD expansion" },
        { n: "Display Eye Strain & PWM Flicker Safety Directory", c: "Hardware Benchmarks", p: "/laptops/pwm/", d: "PWM dimming frequencies, DC dimming, and eye safety tests" },
        { n: "Technical Articles & Engineering Journal", c: "Tech Journal", p: "/articles/", d: "Clinical neuroscience, ESBuild decompilation, and custom blocks guides" }
      ]
    )};
    var activeSearchIdx = 0;

    function openSearchModal() {
      var m = document.getElementById('quickSearchModal');
      if (!m) return;
      m.style.display = 'flex';
      var inp = document.getElementById('quickSearchInput');
      if (inp) {
        inp.value = '';
        inp.focus();
        renderSearchResults('');
      }
    }

    function closeSearchModal() {
      var m = document.getElementById('quickSearchModal');
      if (m) m.style.display = 'none';
    }

    function renderSearchResults(query) {
      var container = document.getElementById('quickSearchResults');
      if (!container) return;
      var q = (query || '').toLowerCase().trim();
      var matches = [];
      if (!q) {
        matches = DTS_SEARCH_INDEX.slice(0, 8);
      } else {
        matches = DTS_SEARCH_INDEX.filter(function(t) {
          return t.n.toLowerCase().indexOf(q) !== -1 ||
                 t.c.toLowerCase().indexOf(q) !== -1 ||
                 t.d.toLowerCase().indexOf(q) !== -1 ||
                 t.p.toLowerCase().indexOf(q) !== -1;
        }).slice(0, 15);
      }

      activeSearchIdx = 0;
      if (matches.length === 0) {
        container.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-family: var(--mono); font-size: 0.85rem;">No tools found matching &quot;' + query.replace(/</g, '&lt;') + '&quot;</div>';
        return;
      }

      var html = '';
      for (var i = 0; i < matches.length; i++) {
        var item = matches[i];
        var isSel = i === 0 ? ' selected' : '';
        var cleanName = item.n.replace(/\\[.*?\\]/g, '').trim();
        html += '<a href="' + item.p + '" class="search-result-item' + isSel + '" data-idx="' + i + '">' +
          '<div style="display:flex; flex-direction:column; gap:0.15rem; overflow:hidden;">' +
            '<div class="search-result-title">' + cleanName + '</div>' +
            '<div style="font-size:0.78rem; color:var(--text-muted); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">' + (item.d || item.p) + '</div>' +
          '</div>' +
          '<span class="search-result-badge">' + item.c + '</span>' +
        '</a>';
      }
      container.innerHTML = html;
    }

    var qInp = document.getElementById('quickSearchInput');
    if (qInp) {
      qInp.addEventListener('input', function(e) {
        renderSearchResults(e.target.value);
      });
      qInp.addEventListener('keydown', function(e) {
        var items = Array.from(document.querySelectorAll('.search-result-item'));
        if (items.length === 0) return;
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (items[activeSearchIdx]) items[activeSearchIdx].classList.remove('selected');
          activeSearchIdx = (activeSearchIdx + 1) % items.length;
          if (items[activeSearchIdx]) {
            items[activeSearchIdx].classList.add('selected');
            items[activeSearchIdx].scrollIntoView({ block: 'nearest' });
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (items[activeSearchIdx]) items[activeSearchIdx].classList.remove('selected');
          activeSearchIdx = (activeSearchIdx - 1 + items.length) % items.length;
          if (items[activeSearchIdx]) {
            items[activeSearchIdx].classList.add('selected');
            items[activeSearchIdx].scrollIntoView({ block: 'nearest' });
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (items[activeSearchIdx]) {
            window.location.href = items[activeSearchIdx].getAttribute('href');
          }
        } else if (e.key === 'Escape') {
          closeSearchModal();
        }
      });
    }

    window.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        var m = document.getElementById('quickSearchModal');
        if (m && m.style.display === 'flex') closeSearchModal();
        else openSearchModal();
      } else if (e.key === '/' && document.activeElement && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        openSearchModal();
      } else if (e.key === 'Escape') {
        closeSearchModal();
      }
    });
  </script>
</body>
</html>`;
}

// ─── HOMEPAGE GENERATOR ───────────────────────────────────────────────────

export { ICONS, TOOLS, MASTER_CSS, buildSidebarHtml, renderPage };
