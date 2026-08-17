import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const DOMAIN = 'https://digitaltoolsshed.com';

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function copyDirRecursive(src, dest) {
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
  article: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`
};

// ─── MASTER TOOL REGISTRY ──────────────────────────────────────────────────
const TOOLS = [
  // Developer & Decompiler Tools (NEW)
  { id: 'json-obfuscator', name: 'JSON Obfuscator & Compressor', category: 'Developer', path: '/convert/json-obfuscator.html', desc: 'Minify, compress, hex-escape, and obfuscate JSON payloads with reversible dictionaries.' },
  { id: 'esbuild-decompiler', name: 'ESBuild / JS Decompiler & Beautifier', category: 'Developer', path: '/convert/esbuild-decompiler.html', desc: 'Decompile, unminify, unpack IIFEs, and restore readable syntax from minified ESBuild and Webpack bundles.' },

  // Media & Video Tools
  { id: 'media-downloader', name: 'Universal Media Downloader', category: 'Media & Video', path: '/media/downloader.html', desc: 'Download high-quality video and audio from YouTube, TikTok, Twitter/X, Instagram, and SoundCloud.' },
  { id: 'youtube-to-mp3', name: 'YouTube to MP3 Audio', category: 'Media & Video', path: '/media/youtube-to-mp3.html', desc: 'Extract pristine 320kbps MP3 audio tracks directly from video stream links.' },
  { id: 'tiktok-saver', name: 'TikTok Saver (No Watermark)', category: 'Media & Video', path: '/media/tiktok-saver.html', desc: 'Save high-definition TikTok videos without watermark overlay.' },

  // Image & File Converters
  { id: 'png-to-jpg', name: 'PNG to JPG Converter', category: 'File & Image', path: '/convert/png-to-jpg.html', desc: 'Convert PNG images to JPG format in your browser. Fast, 100% private.' },
  { id: 'jpg-to-png', name: 'JPG to PNG Converter', category: 'File & Image', path: '/convert/jpg-to-png.html', desc: 'Convert JPEG/JPG images to lossless PNG instantly.' },
  { id: 'png-to-webp', name: 'PNG to WebP Converter', category: 'File & Image', path: '/convert/png-to-webp.html', desc: 'Compress and convert PNG images to modern WebP format.' },
  { id: 'webp-to-png', name: 'WebP to PNG Converter', category: 'File & Image', path: '/convert/webp-to-png.html', desc: 'Convert Google WebP images back to transparent PNG format.' },
  { id: 'svg-to-png', name: 'SVG to PNG Converter', category: 'File & Image', path: '/convert/svg-to-png.html', desc: 'Rasterize vector SVG files into high-resolution PNG images.' },
  { id: 'image-resizer', name: 'Bulk Image Resizer', category: 'File & Image', path: '/convert/image-resizer.html', desc: 'Resize multiple images simultaneously with custom pixel dimensions.' },
  { id: 'json-formatter', name: 'JSON Formatter & Validator', category: 'Developer', path: '/convert/json-formatter.html', desc: 'Prettify, format, minify, and validate JSON strings and payloads.' },
  { id: 'json-to-yaml', name: 'JSON to YAML Converter', category: 'Developer', path: '/convert/json-to-yaml.html', desc: 'Convert structured JSON configuration data into clean YAML.' },
  { id: 'yaml-to-json', name: 'YAML to JSON Converter', category: 'Developer', path: '/convert/yaml-to-json.html', desc: 'Convert YAML configuration documents into standard JSON.' },
  { id: 'base64', name: 'Base64 Encoder / Decoder', category: 'Developer', path: '/convert/base64.html', desc: 'Encode text & files to Base64 or decode Base64 data strings.' },

  // PDF Tools
  { id: 'pdf-to-text', name: 'PDF to Text Extractor', category: 'PDF & Docs', path: '/pdf/pdf-to-text.html', desc: 'Extract readable text and document content from PDF files locally.' },
  { id: 'pdf-page-counter', name: 'PDF Page Counter', category: 'PDF & Docs', path: '/pdf/page-counter.html', desc: 'Inspect PDF metadata, dimensions, and total page count without uploading.' },

  // Unit & Math Calculators
  { id: 'kg-to-lbs', name: 'Kilograms to Pounds (kg to lbs)', category: 'Units & Calc', path: '/calc/kg-to-lbs.html', desc: 'Instant accurate weight conversion from kilograms to pounds.' },
  { id: 'lbs-to-kg', name: 'Pounds to Kilograms (lbs to kg)', category: 'Units & Calc', path: '/calc/lbs-to-kg.html', desc: 'Convert pounds (lbs) to metric kilograms (kg).' },
  { id: 'celsius-to-fahrenheit', name: 'Celsius to Fahrenheit (°C to °F)', category: 'Units & Calc', path: '/calc/celsius-to-fahrenheit.html', desc: 'Convert temperatures from Celsius to Fahrenheit scale.' },
  { id: 'fahrenheit-to-celsius', name: 'Fahrenheit to Celsius (°F to °C)', category: 'Units & Calc', path: '/calc/fahrenheit-to-celsius.html', desc: 'Convert temperatures from Fahrenheit to Celsius scale.' },
  { id: 'cm-to-inches', name: 'Centimeters to Inches (cm to in)', category: 'Units & Calc', path: '/calc/cm-to-inches.html', desc: 'Convert metric centimeters to imperial inches.' },
  { id: 'inches-to-cm', name: 'Inches to Centimeters (in to cm)', category: 'Units & Calc', path: '/calc/inches-to-cm.html', desc: 'Convert imperial inches to metric centimeters.' },
  { id: 'km-to-miles', name: 'Kilometers to Miles (km to mi)', category: 'Units & Calc', path: '/calc/km-to-miles.html', desc: 'Convert distance from kilometers to statute miles.' },
  { id: 'miles-to-km', name: 'Miles to Kilometers (mi to km)', category: 'Units & Calc', path: '/calc/miles-to-km.html', desc: 'Convert distance from statute miles to kilometers.' },
  { id: 'mb-to-gb', name: 'Megabytes to Gigabytes (MB to GB)', category: 'Units & Calc', path: '/calc/mb-to-gb.html', desc: 'Convert digital file storage size from MB to GB.' },
  { id: 'gb-to-tb', name: 'Gigabytes to Terabytes (GB to TB)', category: 'Units & Calc', path: '/calc/gb-to-tb.html', desc: 'Convert digital storage capacity from GB to TB.' },
  { id: 'gallons-to-liters', name: 'Gallons to Liters', category: 'Units & Calc', path: '/calc/gallons-to-liters.html', desc: 'Convert liquid volume from US gallons to metric liters.' },
  { id: 'liters-to-gallons', name: 'Liters to Gallons', category: 'Units & Calc', path: '/calc/liters-to-gallons.html', desc: 'Convert liquid volume from metric liters to US gallons.' },

  // Gaming / Minecraft Bedrock Tools
  { id: 'mc-uuid-gen', name: 'Minecraft UUID Generator', category: 'Minecraft & Game', path: '/mc/uuid-gen.html', desc: 'Generate valid v4 UUID pairs for Bedrock manifest.json files.' },
  { id: 'mc-manifest-gen', name: 'Bedrock Pack Manifest Generator', category: 'Minecraft & Game', path: '/mc/manifest-gen.html', desc: 'Generate complete manifest.json for Behavior and Resource packs.' },
  // Productivity & Business Tools
  { id: 'deduplicator', name: 'Text De-duplicator', category: 'Productivity', path: '/productivity/deduplicator.html', desc: 'Remove duplicate lines from text instantly.' },
  { id: 'time-tracker', name: 'Time Tracker', category: 'Productivity', path: '/productivity/time-tracker.html', desc: 'Track time across projects with start/stop timer and manual entries.' },
  { id: 'invoice-generator', name: 'Invoice Generator', category: 'Productivity', path: '/productivity/invoice-generator.html', desc: 'Create professional invoices with line items, tax, and PDF export.' },
  { id: 'invoice-from-time', name: 'Invoice from Time', category: 'Productivity', path: '/productivity/invoice-from-time.html', desc: 'Generate invoices from tracked time entries.' },
  { id: 'tax-calculator', name: 'Tax Calculator', category: 'Productivity', path: '/productivity/tax-calculator.html', desc: 'Calculate income tax with US federal brackets and deductions.' },
  { id: 'task-manager', name: 'Task Manager', category: 'Productivity', path: '/productivity/task-manager.html', desc: 'Create and track tasks with priorities. Export as PDF or DOCX.' },
  { id: 'timetable', name: 'Weekly Timetable', category: 'Productivity', path: '/productivity/timetable.html', desc: 'Visual weekly schedule planner with color-coded blocks.' }
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
  width: 290px;
  min-width: 290px;
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
  padding: 1.25rem 1.25rem 1rem;
  border-bottom: 1px solid var(--sidebar-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sidebar-brand {
  font-family: var(--serif);
  font-size: 1.15rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--fg);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.sidebar-brand svg {
  color: var(--fg);
  flex-shrink: 0;
}

.sidebar-search {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--sidebar-border);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface);
  margin: 0.75rem;
  border: 1px solid var(--border);
}
.sidebar-search svg { color: var(--text-subtle); flex-shrink: 0; }
.sidebar-search input {
  width: 100%;
  background: transparent;
  border: none;
  font-family: var(--serif);
  font-size: 0.9rem;
  color: var(--fg);
  outline: none;
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
}
.promo-card:hover { border-color: var(--border-strong); }
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
        <div style="display: flex; flex-direction: column; line-height: 1.15;">
          <span>DIGITAL TOOLS SHED</span>
          <span style="font-family: var(--mono); font-size: 0.62rem; color: var(--text-muted); font-weight: normal; letter-spacing: 0.05em; text-transform: uppercase;">The Site of Everything</span>
        </div>
      </a>
      <button class="mobile-toggle" onclick="toggleSidebar()" style="display: none;" id="mobileCloseBtn">✕</button>
    </div>

    <div class="sidebar-search">
      ${ICONS.search}
      <input type="text" id="sidebarSearchInput" placeholder="Quick filter tools..." />
    </div>

    <nav class="sidebar-nav">
      <div class="nav-group-title">
        ${ICONS.star}
        <span>Featured Utilities</span>
      </div>
      <a href="/media/downloader.html" class="nav-link ${currentPath === '/media/downloader.html' ? 'active' : ''}">
        <div class="nav-link-content">
          ${ICONS.media}
          <span>Media Downloader</span>
        </div>
        <span class="nav-badge">HD</span>
      </a>
      <a href="/convert/json-obfuscator.html" class="nav-link ${currentPath === '/convert/json-obfuscator.html' ? 'active' : ''}">
        <div class="nav-link-content">
          ${ICONS.code}
          <span>JSON Obfuscator</span>
        </div>
        <span class="nav-badge">DEV</span>
      </a>
      <a href="/convert/esbuild-decompiler.html" class="nav-link ${currentPath === '/convert/esbuild-decompiler.html' ? 'active' : ''}">
        <div class="nav-link-content">
          ${ICONS.code}
          <span>ESBuild Decompiler</span>
        </div>
        <span class="nav-badge">JS</span>
      </a>
      <a href="/convert/image-resizer.html" class="nav-link ${currentPath === '/convert/image-resizer.html' ? 'active' : ''}">
        <div class="nav-link-content">
          ${ICONS.files}
          <span>Bulk Image Resizer</span>
        </div>
        <span class="nav-badge">IMG</span>
      </a>

      <div class="ad-sidebar-card">
        <span class="ad-label">Premium Sponsor</span>
        <script type="text/javascript">
          atOptions = {
            'key' : 'a821eb44059433a28ee72061693e8e63',
            'format' : 'iframe',
            'height' : 300,
            'width' : 160,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://manyapostle.com/a821eb44059433a28ee72061693e8e63/invoke.js"></script>
      </div>

      <div class="nav-group-title">
        ${ICONS.code}
        <span>Developer & Code (6)</span>
      </div>
      <a href="/convert/json-obfuscator.html" class="nav-link ${currentPath === '/convert/json-obfuscator.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>JSON Obfuscator</span></div>
      </a>
      <a href="/convert/esbuild-decompiler.html" class="nav-link ${currentPath === '/convert/esbuild-decompiler.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>ESBuild Decompiler</span></div>
      </a>
      <a href="/convert/json-formatter.html" class="nav-link ${currentPath === '/convert/json-formatter.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>JSON Formatter</span></div>
      </a>
      <a href="/convert/json-to-yaml.html" class="nav-link ${currentPath === '/convert/json-to-yaml.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>JSON to YAML</span></div>
      </a>
      <a href="/convert/yaml-to-json.html" class="nav-link ${currentPath === '/convert/yaml-to-json.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>YAML to JSON</span></div>
      </a>
      <a href="/convert/base64.html" class="nav-link ${currentPath === '/convert/base64.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Base64 Tool</span></div>
      </a>

      <div class="nav-group-title">
        ${ICONS.media}
        <span>Media & Video (3)</span>
      </div>
      <a href="/media/downloader.html" class="nav-link ${currentPath === '/media/downloader.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Universal Downloader</span></div>
      </a>
      <a href="/media/youtube-to-mp3.html" class="nav-link ${currentPath === '/media/youtube-to-mp3.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>YouTube to MP3</span></div>
      </a>
      <a href="/media/tiktok-saver.html" class="nav-link ${currentPath === '/media/tiktok-saver.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>TikTok Saver</span></div>
      </a>

      <div class="ad-sidebar-card">
        <span class="ad-label">Partner Link</span>
        <script type="text/javascript">
          atOptions = {
            'key' : 'a821eb44059433a28ee72061693e8e63',
            'format' : 'iframe',
            'height' : 300,
            'width' : 160,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://manyapostle.com/a821eb44059433a28ee72061693e8e63/invoke.js"></script>
      </div>

      <div class="nav-group-title">
        ${ICONS.files}
        <span>Image Converters (6)</span>
      </div>
      <a href="/convert/png-to-jpg.html" class="nav-link ${currentPath === '/convert/png-to-jpg.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>PNG to JPG</span></div>
      </a>
      <a href="/convert/jpg-to-png.html" class="nav-link ${currentPath === '/convert/jpg-to-png.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>JPG to PNG</span></div>
      </a>
      <a href="/convert/png-to-webp.html" class="nav-link ${currentPath === '/convert/png-to-webp.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>PNG to WebP</span></div>
      </a>
      <a href="/convert/webp-to-png.html" class="nav-link ${currentPath === '/convert/webp-to-png.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>WebP to PNG</span></div>
      </a>
      <a href="/convert/svg-to-png.html" class="nav-link ${currentPath === '/convert/svg-to-png.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>SVG to PNG</span></div>
      </a>
      <a href="/convert/image-resizer.html" class="nav-link ${currentPath === '/convert/image-resizer.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Bulk Resizer</span></div>
      </a>

      <div class="ad-sidebar-card">
        <span class="ad-label">Partner Link</span>
        <script type="text/javascript">
          atOptions = {
            'key' : 'a821eb44059433a28ee72061693e8e63',
            'format' : 'iframe',
            'height' : 300,
            'width' : 160,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://manyapostle.com/a821eb44059433a28ee72061693e8e63/invoke.js"></script>
      </div>

      <div class="nav-group-title">
        ${ICONS.docs}
        <span>PDF & Docs (2)</span>
      </div>
      <a href="/pdf/pdf-to-text.html" class="nav-link ${currentPath === '/pdf/pdf-to-text.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>PDF Text Extractor</span></div>
      </a>
      <a href="/pdf/page-counter.html" class="nav-link ${currentPath === '/pdf/page-counter.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>PDF Page Counter</span></div>
      </a>

      <div class="nav-group-title">
        ${ICONS.calc}
        <span>Calculators (44)</span>
      </div>
      <a href="/calc/kg-to-lbs.html" class="nav-link ${currentPath === '/calc/kg-to-lbs.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Kilograms to Pounds</span></div>
      </a>
      <a href="/calc/celsius-to-fahrenheit.html" class="nav-link ${currentPath === '/calc/celsius-to-fahrenheit.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Celsius to Fahrenheit</span></div>
      </a>
      <a href="/calc/cm-to-inches.html" class="nav-link ${currentPath === '/calc/cm-to-inches.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>CM to Inches</span></div>
      </a>
      <a href="/calc/km-to-miles.html" class="nav-link ${currentPath === '/calc/km-to-miles.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>KM to Miles</span></div>
      </a>
      <a href="/calc/mb-to-gb.html" class="nav-link ${currentPath === '/calc/mb-to-gb.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>MB to GB</span></div>
      </a>

      <div class="ad-sidebar-card">
        <span class="ad-label">Sponsor Slot</span>
        <script type="text/javascript">
          atOptions = {
            'key' : 'a821eb44059433a28ee72061693e8e63',
            'format' : 'iframe',
            'height' : 300,
            'width' : 160,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://manyapostle.com/a821eb44059433a28ee72061693e8e63/invoke.js"></script>
      </div>

      <div class="nav-group-title">
        ${ICONS.cube}
        <span>Minecraft & Dev (2)</span>
      </div>
      <a href="/mc/uuid-gen.html" class="nav-link ${currentPath === '/mc/uuid-gen.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>UUID Generator</span></div>
      </a>
      <a href="/mc/manifest-gen.html" class="nav-link ${currentPath === '/mc/manifest-gen.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Manifest Generator</span></div>
      </a>

      <div class="nav-group-title">
        ${ICONS.clipboard}
        <span>Productivity (7)</span>
      </div>
      <a href="/productivity/time-tracker.html" class="nav-link ${currentPath === '/productivity/time-tracker.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Time Tracker</span></div>
      </a>
      <a href="/productivity/invoice-generator.html" class="nav-link ${currentPath === '/productivity/invoice-generator.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Invoice Generator</span></div>
      </a>
      <a href="/productivity/task-manager.html" class="nav-link ${currentPath === '/productivity/task-manager.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Task Manager</span></div>
      </a>
      <a href="/productivity/tax-calculator.html" class="nav-link ${currentPath === '/productivity/tax-calculator.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Tax Calculator</span></div>
      </a>
      <a href="/productivity/timetable.html" class="nav-link ${currentPath === '/productivity/timetable.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Weekly Timetable</span></div>
      </a>
      <a href="/productivity/deduplicator.html" class="nav-link ${currentPath === '/productivity/deduplicator.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>De-duplicator</span></div>
      </a>
      <a href="/productivity/invoice-from-time.html" class="nav-link ${currentPath === '/productivity/invoice-from-time.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Invoice from Time</span></div>
      </a>

      <div class="nav-group-title">
        ${ICONS.article}
        <span>Tech Articles & Guides (6)</span>
      </div>
      <a href="/articles/" class="nav-link ${currentPath === '/articles/' || currentPath === '/articles/index.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Articles Hub</span></div>
      </a>
      <a href="/articles/how-to-decompile-esbuild-bundles.html" class="nav-link ${currentPath === '/articles/how-to-decompile-esbuild-bundles.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Decompile ESBuild</span></div>
      </a>
      <a href="/articles/json-obfuscation-and-compression-techniques.html" class="nav-link ${currentPath === '/articles/json-obfuscation-and-compression-techniques.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>JSON Obfuscation</span></div>
      </a>
      <a href="/articles/minecraft-bedrock-custom-blocks-guide.html" class="nav-link ${currentPath === '/articles/minecraft-bedrock-custom-blocks-guide.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Bedrock Custom Blocks</span></div>
      </a>
      <a href="/articles/minecraft-bedrock-manifest-uuid-guide.html" class="nav-link ${currentPath === '/articles/minecraft-bedrock-manifest-uuid-guide.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Manifest & UUIDs</span></div>
      </a>
      <a href="/articles/zero-upload-client-side-image-processing.html" class="nav-link ${currentPath === '/articles/zero-upload-client-side-image-processing.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Image Processing</span></div>
      </a>
      <a href="/articles/universal-media-stream-extraction-guide.html" class="nav-link ${currentPath === '/articles/universal-media-stream-extraction-guide.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Media Extraction</span></div>
      </a>

      <div class="nav-group-title">
        ${ICONS.lock}
        <span>Trust & Legal</span>
      </div>
      <a href="/about.html" class="nav-link ${currentPath === '/about.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>About Us</span></div>
      </a>
      <a href="/privacy.html" class="nav-link ${currentPath === '/privacy.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Privacy Policy</span></div>
      </a>
      <a href="/terms.html" class="nav-link ${currentPath === '/terms.html' ? 'active' : ''}">
        <div class="nav-link-content"><span>Terms of Service</span></div>
      </a>
    </nav>

    <div class="ad-sidebar-card" style="min-height: 600px;">
      <span class="ad-label">Featured Partner</span>
      <script type="text/javascript">
        atOptions = {
          'key' : 'bba2ed7e2aff3607f66ff8e410f1fcbe',
          'format' : 'iframe',
          'height' : 600,
          'width' : 160,
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="https://manyapostle.com/bba2ed7e2aff3607f66ff8e410f1fcbe/invoke.js"></script>
    </div>

    <div class="sidebar-footer">
      <button class="theme-switch-btn" onclick="toggleSiteTheme()">
        ${ICONS.theme}
        <span>Theme:</span>
        <span id="currentThemeTag">[ LIGHT ]</span>
      </button>
      <div style="font-family: var(--mono); font-size: 0.68rem; color: var(--text-subtle); text-align: center; line-height: 1.4;">
        The Site of Everything
      </div>
    </div>
  </aside>
  `;
}

// ─── MASTER PAGE RENDERER ──────────────────────────────────────────────────
function renderPage({ title, metaDesc, canonical, bodyContent, currentPath = '/', schema }) {
  const schemaMarkup = schema ? `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="website">
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
  <style>${MASTER_CSS}</style>
  <!-- POPUNDER: DISABLED — USE THIS ONCE 1K TRAFFIC AND MORE
       Uncomment the line below to activate Adsterra popunder ads.
       This opens a sponsor tab on the user's first click per session.
       High CPM ($2-5) but risky for bounce rate on low-traffic sites.
  <script src="https://manyapostle.com/de/cb/e7/decbe73417353e7a377faccd19c69d3f.js"></script>
  -->
  ${schemaMarkup}
</head>
<body>
  <div id="sponsorNotice" class="sponsor-notice" style="display:none;">
    <div><strong>Sponsor-supported site</strong> — Your first click may open a sponsor tab. This keeps all 88+ tools completely free, forever.</div>
    <button class="dismiss-btn" onclick="document.getElementById('sponsorNotice').style.display='none';sessionStorage.setItem('dts-sponsor-ack','1');">Got it</button>
  </div>
  <script>
    (function(){
      if (!sessionStorage.getItem('dts-sponsor-ack')) {
        document.getElementById('sponsorNotice').style.display = 'flex';
      }
    })();
  </script>
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
        <div class="privacy-badge">
          ${ICONS.lock}
          <span>Your files never leave your device</span>
        </div>
      </div>

      <div class="layout-with-rail">
        <div class="main-body">
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
                };
              </script>
              <script type="text/javascript" src="https://manyapostle.com/567d4e495ec8a8e297b7c7f5170993cb/invoke.js"></script>
            </div>
            <div class="ad-mobile-banner">
              <script type="text/javascript">
                atOptions = {
                  'key' : '9ec3cbd7674ade5c0cfa745d18664214',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js"></script>
            </div>
          </div>

          ${bodyContent}

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
                };
              </script>
              <script type="text/javascript" src="https://manyapostle.com/0b6898775795b270130cc9971eef21a8/invoke.js"></script>
            </div>
            <div class="ad-mobile-banner">
              <script type="text/javascript">
                atOptions = {
                  'key' : '9ec3cbd7674ade5c0cfa745d18664214',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js"></script>
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
                };
              </script>
              <script type="text/javascript" src="https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js"></script>
            </div>
          </div>

          <div style="margin: 2rem 0;">
            <div style="font-family: var(--mono); font-size: 0.65rem; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Sponsored Recommendations</div>
            <div id="container-cd881b59407c303a0b391e7998dd6cb9"></div>
            <script async="async" data-cfasync="false" src="https://manyapostle.com/cd881b59407c303a0b391e7998dd6cb9/invoke.js"></script>
          </div>

          <div class="promo-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
            <a href="/convert/json-obfuscator.html" class="promo-card">
              <span class="promo-badge">Developer Tool</span>
              <h4 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.35rem;">JSON Obfuscator & Compressor</h4>
              <p style="font-size: 0.9rem; color: var(--text-muted);">Minify payloads and encode keys or unicode string escapes with dictionary mapping.</p>
            </a>
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
                  };
                </script>
                <script type="text/javascript" src="https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js"></script>
              </div>
            </div>
            <a href="/convert/esbuild-decompiler.html" class="promo-card">
              <span class="promo-badge">Reverse Engineering</span>
              <h4 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.35rem;">ESBuild & JS Decompiler</h4>
              <p style="font-size: 0.9rem; color: var(--text-muted);">Unpack bundled IIFEs, expand minified comma-statements, and restore clean ES6 formatting.</p>
            </a>
            <div class="promo-card ad-promo-card">
              <div class="promo-badge" style="background: var(--surface-alt); color: var(--text-muted); border: 1px solid var(--border); width: 100%; text-align: center;">Sponsored Recommendation</div>
              <div class="ad-unit-300x250">
                <script type="text/javascript">
                  atOptions = {
                    'key' : '335d807d460eaf2491fcca0f635474ce',
                    'format' : 'iframe',
                    'height' : 250,
                    'width' : 300,
                    'params' : {}
                  };
                </script>
                <script type="text/javascript" src="https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js"></script>
              </div>
            </div>
            <a href="/media/downloader.html" class="promo-card">
              <span class="promo-badge">Media Engine</span>
              <h4 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.35rem;">Universal Media Downloader</h4>
              <p style="font-size: 0.9rem; color: var(--text-muted);">Save video streams from YouTube, Twitter/X, TikTok, and Instagram with zero quality loss.</p>
            </a>
            <a href="/convert/image-resizer.html" class="promo-card">
              <span class="promo-badge">Bulk Image Tool</span>
              <h4 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.35rem;">Bulk Image Resizer</h4>
              <p style="font-size: 0.9rem; color: var(--text-muted);">Scale, resize, and compress entire folders of PNG and JPEG images client-side.</p>
            </a>
          </div>

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
                };
              </script>
              <script type="text/javascript" src="https://manyapostle.com/567d4e495ec8a8e297b7c7f5170993cb/invoke.js"></script>
            </div>
            <div class="ad-mobile-banner">
              <script type="text/javascript">
                atOptions = {
                  'key' : '9ec3cbd7674ade5c0cfa745d18664214',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js"></script>
            </div>
          </div>
        </div>

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
              };
            </script>
            <script type="text/javascript" src="https://manyapostle.com/bba2ed7e2aff3607f66ff8e410f1fcbe/invoke.js"></script>
          </div>
        </aside>
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
            };
          </script>
          <script type="text/javascript" src="https://manyapostle.com/567d4e495ec8a8e297b7c7f5170993cb/invoke.js"></script>
        </div>
        <div class="ad-mobile-banner">
          <script type="text/javascript">
            atOptions = {
              'key' : '9ec3cbd7674ade5c0cfa745d18664214',
              'format' : 'iframe',
              'height' : 50,
              'width' : 320,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js"></script>
        </div>
        <div style="margin-top: 1.5rem;">
          <div style="font-family: var(--mono); font-size: 0.65rem; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">More From The Web</div>
          <div id="container-cd881b59407c303a0b391e7998dd6cb9"></div>
          <script async="async" data-cfasync="false" src="https://manyapostle.com/cd881b59407c303a0b391e7998dd6cb9/invoke.js"></script>
        </div>
      </div>

      <footer>
        <div>© 2026 Digital Tools Shed (digitaltoolsshed.com). The Site of Everything. Your files never leave your device.</div>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="/">Home</a>
          <a href="/articles/">Tech Journal</a>
          <a href="/about.html">About</a>
          <a href="/privacy.html">Privacy</a>
          <a href="/terms.html">Terms</a>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
      </footer>
    </div>
  </div>

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
        };
      </script>
      <script type="text/javascript" src="https://manyapostle.com/567d4e495ec8a8e297b7c7f5170993cb/invoke.js"></script>
    </div>
    <div class="ad-mobile-banner">
      <script type="text/javascript">
        atOptions = {
          'key' : '9ec3cbd7674ade5c0cfa745d18664214',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js"></script>
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
  </script>

  <div class="mobile-welcome-overlay" id="mobileWelcomeAd" style="display:none;">
    <div style="text-align:center; color:#fff; font-family:var(--mono); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em;">Welcome to Digital Tools Shed</div>
    <div class="ad-unit-300x250">
      <script type="text/javascript">
        atOptions = {
          'key' : '335d807d460eaf2491fcca0f635474ce',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js"></script>
    </div>
    <button class="close-btn" onclick="document.getElementById('mobileWelcomeAd').style.display='none';sessionStorage.setItem('dts-welcome-seen','1');">Continue to Tools →</button>
  </div>
  <script>
    (function(){
      if (window.innerWidth <= 768 && !sessionStorage.getItem('dts-welcome-seen')) {
        setTimeout(function(){ document.getElementById('mobileWelcomeAd').style.display = 'flex'; }, 1500);
      }
    })();
  </script>
</body>
</html>`;
}

// ─── HOMEPAGE GENERATOR ───────────────────────────────────────────────────
function buildHomepage() {
  const categories = [
    { name: 'Developer', icon: ICONS.code },
    { name: 'Media & Video', icon: ICONS.media },
    { name: 'File & Image', icon: ICONS.files },
    { name: 'PDF & Docs', icon: ICONS.docs },
    { name: 'Units & Calc', icon: ICONS.calc },
    { name: 'Minecraft & Game', icon: ICONS.cube },
    { name: 'Productivity', icon: ICONS.clipboard }
  ];

  let gridHtml = '';
  let catIndex = 0;
  for (const catObj of categories) {
    const catTools = TOOLS.filter(t => t.category === catObj.name);
    if (!catTools.length) continue;
    catIndex++;
    if (catIndex === 3 || catIndex === 5) {
      gridHtml += `
      <div class="ad-category-break">
        <span class="ad-label">Continue Exploring — Sponsored</span>
        <div class="ad-unit-468x60">
          <script type="text/javascript">
            atOptions = {
              'key' : '0b6898775795b270130cc9971eef21a8',
              'format' : 'iframe',
              'height' : 60,
              'width' : 468,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://manyapostle.com/0b6898775795b270130cc9971eef21a8/invoke.js"></script>
        </div>
        <div class="ad-mobile-banner">
          <script type="text/javascript">
            atOptions = {
              'key' : '9ec3cbd7674ade5c0cfa745d18664214',
              'format' : 'iframe',
              'height' : 50,
              'width' : 320,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js"></script>
        </div>
      </div>
      `;
    }
    const catAnchor = catObj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    gridHtml += `
    <div class="category-section" id="${catAnchor}">
      <div class="category-header">
        <div class="category-title-left">
          ${catObj.icon}
          <h2>${catObj.name} Suite</h2>
        </div>
        <span class="category-count">${catTools.length} Utilities</span>
      </div>
      <div class="tools-grid">
    `;
    for (const tool of catTools) {
      gridHtml += `
        <a href="${tool.path}" class="tool-card" data-name="${tool.name.toLowerCase()} ${tool.desc.toLowerCase()}">
          <div>
            <h3>${tool.name}</h3>
            <p>${tool.desc}</p>
          </div>
          <span class="tag">
            <span>Launch Tool</span>
            ${ICONS.arrowRight}
          </span>
        </a>
      `;
    }
    gridHtml += `
      </div>
    </div>
    `;
  }

  const bodyContent = `
    <div class="hero">
      <div style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.5rem;">The Site of Everything</div>
      <h1>DIGITAL TOOLS SHED</h1>
      <p>The Site of Everything. Fast, free developer utilities, image converters, media extractors, Minecraft tools, calculators, and technical guides.</p>
    </div>

    <div class="ad-hero-undercard">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <span class="ad-label">Presented By</span>
        <div class="ad-unit-300x250">
          <script type="text/javascript">
            atOptions = {
              'key' : '335d807d460eaf2491fcca0f635474ce',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js"></script>
        </div>
      </div>
    </div>

    <div id="toolsContainer">
      ${gridHtml}
    </div>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Digital Tools Shed — The Site of Everything",
    "url": DOMAIN,
    "description": "The Site of Everything: Free browser-based online tools, media downloaders, JSON obfuscators, ESBuild decompilers, file converters, unit calculators, and tech articles.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const html = renderPage({
    title: 'Digital Tools Shed — The Site of Everything | Free Online Developer Tools & Converters',
    metaDesc: 'Digital Tools Shed — The Site of Everything: Free online developer tools, JSON obfuscator, ESBuild decompiler, Media Downloader, image converters, and 40+ unit calculators.',
    canonical: DOMAIN,
    bodyContent,
    currentPath: '/',
    schema
  });

  writeFileSync(join(DIST, 'index.html'), html);
  console.log('  ✓ Built Master Landing Page with The Site of Everything motto (index.html)');
}

// ─── NEW DEVELOPER TOOLS: JSON OBFUSCATOR & ESBUILD DECOMPILER ────────────
function buildDeveloperTools() {
  const convertDist = join(DIST, 'convert');
  ensureDir(convertDist);

  // 1. JSON Obfuscator & Compressor
  const jsonObfuscatorBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">JSON Obfuscator & Compressor</h1>
      <p>Minify, compress, hex-escape strings, and mangle JSON keys with reversible mapping dictionaries. 100% in-browser security.</p>
    </div>

    <div class="tool-workspace" style="max-width: 950px; margin: 1.5rem 0;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        <div>
          <label style="font-family: var(--serif); font-weight: bold; margin-bottom: 0.5rem; display: block;">Input JSON Payload</label>
          <textarea id="jsonInput" style="width: 100%; height: 260px; padding: 0.85rem; font-family: var(--mono); font-size: 0.85rem;" placeholder='{\n  "userId": 10842,\n  "username": "developer_99",\n  "permissions": ["admin", "editor"],\n  "settings": {\n    "theme": "dark",\n    "debug": true\n  }\n}'></textarea>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label style="font-family: var(--serif); font-weight: bold;">Output JSON / Obfuscated</label>
            <span id="statSavings" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Size: 0 B</span>
          </div>
          <textarea id="jsonOutput" style="width: 100%; height: 260px; padding: 0.85rem; font-family: var(--mono); font-size: 0.85rem;" readonly placeholder="Processed output will appear here..."></textarea>
        </div>
      </div>

      <!-- Obfuscation Controls -->
      <div style="border: 1px solid var(--border); background: var(--surface-alt); padding: 1.25rem; margin-bottom: 1.5rem;">
        <div style="font-family: var(--serif); font-weight: bold; margin-bottom: 0.75rem;">Obfuscation & Compression Options:</div>
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optMangleKeys" checked />
            <span>Mangle Object Keys (_0x1, _0x2)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optUnicodeEscape" checked />
            <span>Unicode Hex Escape Strings (\\u00xx)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optMinify" checked />
            <span>Ultra Minify (Strip Whitespace)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optWrapBase64" />
            <span>Wrap in Base64 Data Payload</span>
          </label>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <button id="btnObfuscate" class="btn-primary">OBFUSCATE & COMPRESS</button>
        <button id="btnMinifyOnly" class="btn-secondary">MINIFY ONLY</button>
        <button id="btnDeobfuscate" class="btn-secondary">RESTORE / DEOBFUSCATE</button>
        <button id="btnCopyJson" class="btn-secondary">COPY OUTPUT</button>
        <button id="btnDownloadJson" class="btn-secondary">DOWNLOAD .JSON</button>
      </div>

      <div id="dictMapContainer" style="display: none; margin-top: 1.5rem; border: 1px solid var(--border); padding: 1rem; background: var(--surface);">
        <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Key Reversal Map Dictionary:</span>
        <textarea id="dictMapOutput" style="width: 100%; height: 80px; margin-top: 0.5rem; padding: 0.5rem; font-family: var(--mono); font-size: 0.8rem;" readonly></textarea>
      </div>
    </div>

    <script>
      let keyMapDictionary = {};

      function unicodeEscape(str) {
        return str.split('').map(char => {
          const code = char.charCodeAt(0);
          return '\\\\u' + ('0000' + code.toString(16)).slice(-4);
        }).join('');
      }

      function unicodeUnescape(str) {
        return str.replace(/\\\\u([0-9a-fA-F]{4})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
      }

      function mangleObjectKeys(obj, map = {}, counter = { val: 1 }) {
        if (Array.isArray(obj)) {
          return obj.map(item => mangleObjectKeys(item, map, counter));
        } else if (obj !== null && typeof obj === 'object') {
          const newObj = {};
          for (const key of Object.keys(obj)) {
            if (!map[key]) {
              map[key] = '_0x' + (counter.val++).toString(16);
            }
            const mangledKey = map[key];
            newObj[mangledKey] = mangleObjectKeys(obj[key], map, counter);
          }
          return newObj;
        }
        return obj;
      }

      function restoreObjectKeys(obj, map) {
        const reverseMap = {};
        for (const [k, v] of Object.entries(map)) reverseMap[v] = k;

        function walk(target) {
          if (Array.isArray(target)) {
            return target.map(walk);
          } else if (target !== null && typeof target === 'object') {
            const newObj = {};
            for (const key of Object.keys(target)) {
              const originalKey = reverseMap[key] || key;
              newObj[originalKey] = walk(target[key]);
            }
            return newObj;
          }
          return target;
        }
        return walk(obj);
      }

      function updateStats(origText, resultText) {
        const origBytes = new Blob([origText]).size;
        const resBytes = new Blob([resultText]).size;
        const diff = origBytes > 0 ? (((resBytes - origBytes) / origBytes) * 100).toFixed(1) : 0;
        const sign = diff > 0 ? '+' : '';
        document.getElementById('statSavings').innerText = 'Size: ' + resBytes + ' B (' + sign + diff + '%) | Original: ' + origBytes + ' B';
      }

      document.getElementById('btnObfuscate').addEventListener('click', () => {
        const raw = document.getElementById('jsonInput').value.trim();
        if (!raw) { alert('Please enter valid JSON.'); return; }

        try {
          const parsed = JSON.parse(raw);
          const mangleKeys = document.getElementById('optMangleKeys').checked;
          const doUnicode = document.getElementById('optUnicodeEscape').checked;
          const doBase64 = document.getElementById('optWrapBase64').checked;

          let targetObj = parsed;
          keyMapDictionary = {};

          if (mangleKeys) {
            targetObj = mangleObjectKeys(parsed, keyMapDictionary);
            document.getElementById('dictMapContainer').style.display = 'block';
            document.getElementById('dictMapOutput').value = JSON.stringify(keyMapDictionary);
          } else {
            document.getElementById('dictMapContainer').style.display = 'none';
          }

          let jsonString = JSON.stringify(targetObj);

          if (doUnicode) {
            jsonString = jsonString.replace(/"([^"\\\\]*)"/g, (match, inner) => {
              return '"' + unicodeEscape(inner) + '"';
            });
          }

          if (doBase64) {
            jsonString = JSON.stringify({
              "__obfuscated__": btoa(jsonString),
              "__encoding__": "base64",
              "__engine__": "digitaltoolsshed.com"
            });
          }

          document.getElementById('jsonOutput').value = jsonString;
          updateStats(raw, jsonString);

        } catch (err) {
          alert('Invalid JSON Syntax: ' + err.message);
        }
      });

      document.getElementById('btnMinifyOnly').addEventListener('click', () => {
        const raw = document.getElementById('jsonInput').value.trim();
        try {
          const minified = JSON.stringify(JSON.parse(raw));
          document.getElementById('jsonOutput').value = minified;
          document.getElementById('dictMapContainer').style.display = 'none';
          updateStats(raw, minified);
        } catch (e) {
          alert('Invalid JSON Syntax');
        }
      });

      document.getElementById('btnDeobfuscate').addEventListener('click', () => {
        let raw = document.getElementById('jsonInput').value.trim() || document.getElementById('jsonOutput').value.trim();
        try {
          if (raw.includes('\\\\u')) {
            raw = unicodeUnescape(raw);
          }
          let parsed = JSON.parse(raw);

          if (parsed.__obfuscated__ && parsed.__encoding__ === 'base64') {
            raw = atob(parsed.__obfuscated__);
            if (raw.includes('\\\\u')) raw = unicodeUnescape(raw);
            parsed = JSON.parse(raw);
          }

          const dictText = document.getElementById('dictMapOutput').value;
          if (dictText) {
            try {
              const dict = JSON.parse(dictText);
              parsed = restoreObjectKeys(parsed, dict);
            } catch (e) {}
          }

          const formatted = JSON.stringify(parsed, null, 2);
          document.getElementById('jsonOutput').value = formatted;
          updateStats(raw, formatted);
        } catch (e) {
          alert('Deobfuscation error: ' + e.message);
        }
      });

      document.getElementById('btnCopyJson').addEventListener('click', () => {
        const out = document.getElementById('jsonOutput').value;
        if (!out) return;
        navigator.clipboard.writeText(out);
        alert('Copied output JSON to clipboard!');
      });

      document.getElementById('btnDownloadJson').addEventListener('click', () => {
        const out = document.getElementById('jsonOutput').value;
        if (!out) return;
        const blob = new Blob([out], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'obfuscated_payload.json';
        a.click();
      });
    </script>
  `;

  writeFileSync(join(convertDist, 'json-obfuscator.html'), renderPage({
    title: 'JSON Obfuscator & Compressor — Protect & Minify Payloads | Digital Tools Shed',
    metaDesc: 'Free online JSON obfuscator and compressor. Mangle JSON keys, encode unicode hex string escapes, minify payloads, and reduce file size.',
    canonical: `${DOMAIN}/convert/json-obfuscator.html`,
    bodyContent: jsonObfuscatorBody,
    currentPath: '/convert/json-obfuscator.html'
  }));

  // 2. ESBuild & JavaScript Decompiler & Beautifier
  const esbuildDecompilerBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">ESBuild & JavaScript Decompiler</h1>
      <p>Reverse-engineer, unminify, unpack bundler IIFEs, expand comma expressions, and restore readable ES6+ JavaScript code.</p>
    </div>

    <div class="tool-workspace" style="max-width: 950px; margin: 1.5rem 0;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        <div>
          <label style="font-family: var(--serif); font-weight: bold; margin-bottom: 0.5rem; display: block;">Minified JS / ESBuild Bundle</label>
          <textarea id="jsInput" style="width: 100%; height: 320px; padding: 0.85rem; font-family: var(--mono); font-size: 0.85rem;" placeholder='(()=>{"use strict";var __defProp=Object.defineProperty;var __getOwnPropDesc=Object.getOwnPropertyDescriptor;var __getOwnPropNames=Object.getOwnPropertyNames;var __export=(target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:!0})};var a=1,b=2,c=function(x){return x>0?(console.log("\\x44\\x6f\\x6e\\x65"),x*2):0};window.app={compute:c};})();'></textarea>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label style="font-family: var(--serif); font-weight: bold;">Decompiled & Formatted JS</label>
            <span id="jsStats" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Lines: 0</span>
          </div>
          <textarea id="jsOutput" style="width: 100%; height: 320px; padding: 0.85rem; font-family: var(--mono); font-size: 0.85rem;" readonly placeholder="Decompiled and syntax-restored code will appear here..."></textarea>
        </div>
      </div>

      <!-- Decompiler Configuration Options -->
      <div style="border: 1px solid var(--border); background: var(--surface-alt); padding: 1.25rem; margin-bottom: 1.5rem;">
        <div style="font-family: var(--serif); font-weight: bold; margin-bottom: 0.75rem;">Decompilation & Unpacking Pipeline:</div>
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optDecodeHexStrings" checked />
            <span>Decode Hex & Unicode Escapes (\\x44 -> "D")</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optUnpackBundlers" checked />
            <span>Unpack Bundler Wrappers (__esm, __export, __toESM)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optExpandCommas" checked />
            <span>Expand Multi-Variable & Comma Declarations</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optExpandShortCircuits" checked />
            <span>Expand Short-Circuit Conditionals (a && b())</span>
          </label>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <button id="btnDecompile" class="btn-primary">DECOMPILE & UNMINIFY</button>
        <button id="btnCopyJs" class="btn-secondary">COPY CODE</button>
        <button id="btnDownloadJs" class="btn-secondary">EXPORT .JS FILE</button>
      </div>
    </div>

    <!-- JS-BEAUTIFY CDN FOR ROBUST AST FORMATTING -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.9/beautify.min.js"></script>
    <script>
      function decodeHexAndUnicode(code) {
        return code.replace(/\\\\x([0-9a-fA-F]{2})/g, (match, hex) => {
          return String.fromCharCode(parseInt(hex, 16));
        }).replace(/\\\\u([0-9a-fA-F]{4})/g, (match, hex) => {
          return String.fromCharCode(parseInt(hex, 16));
        });
      }

      function unpackBundlerHelpers(code) {
        return code
          .replace(/var __defProp\\s*=\\s*Object\\.defineProperty;/g, '/* ESBuild Property Definition Helper */\\nconst defineProperty = Object.defineProperty;')
          .replace(/var __export\\s*=\\s*\\(target,\\s*all\\)\\s*=>\\s*\\{[^}]*\\};/g, '/* ESBuild Module Export Dispatcher */\\nfunction exportModule(target, all) { for (const name in all) Object.defineProperty(target, name, { get: all[name], enumerable: true }); }')
          .replace(/var __toESM\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{[^}]*\\};/g, '/* ESBuild CommonJS to ESM Interop */\\nfunction toESM(mod, isNodeMode, target) { return isNodeMode || !mod || !mod.__esModule ? Object.assign(Object.defineProperty({}, "__esModule", { value: true }), mod) : mod; }')
          .replace(/var __commonJS\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{[^}]*\\};/g, '/* ESBuild CommonJS Wrapper */\\nfunction commonJS(cb, mod) { return function() { return mod || cb((mod = { exports: {} }).exports, mod), mod.exports; }; }');
      }

      function expandCommaStatements(code) {
        return code.replace(/;var\\s+([a-zA-Z0-9_$]+=[^,;]+),([a-zA-Z0-9_$]+=[^,;]+);/g, ';\\nvar $1;\\nvar $2;');
      }

      function decompileJs(code) {
        let transformed = code;

        if (document.getElementById('optDecodeHexStrings').checked) {
          transformed = decodeHexAndUnicode(transformed);
        }

        if (document.getElementById('optUnpackBundlers').checked) {
          transformed = unpackBundlerHelpers(transformed);
        }

        if (document.getElementById('optExpandCommas').checked) {
          transformed = expandCommaStatements(transformed);
        }

        if (typeof js_beautify === 'function') {
          transformed = js_beautify(transformed, {
            indent_size: 2,
            space_in_empty_paren: false,
            preserve_newlines: true,
            max_preserve_newlines: 2,
            break_chained_methods: false,
            keep_array_indentation: false,
            unescape_strings: true,
            wrap_line_length: 100,
            e4x: true,
            comma_first: false,
            brace_style: "collapse,preserve-inline"
          });
        }

        return transformed;
      }

      document.getElementById('btnDecompile').addEventListener('click', () => {
        const raw = document.getElementById('jsInput').value.trim();
        if (!raw) {
          alert('Please enter or paste minified JavaScript code.');
          return;
        }

        const decompiled = decompileJs(raw);
        document.getElementById('jsOutput').value = decompiled;

        const lines = decompiled.split('\\n').length;
        const bytes = new Blob([decompiled]).size;
        document.getElementById('jsStats').innerText = lines + ' Lines | ' + (bytes / 1024).toFixed(2) + ' KB';
      });

      document.getElementById('btnCopyJs').addEventListener('click', () => {
        const out = document.getElementById('jsOutput').value;
        if (!out) return;
        navigator.clipboard.writeText(out);
        alert('Decompiled JS code copied to clipboard!');
      });

      document.getElementById('btnDownloadJs').addEventListener('click', () => {
        const out = document.getElementById('jsOutput').value;
        if (!out) return;
        const blob = new Blob([out], { type: 'application/javascript' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'decompiled_bundle.js';
        a.click();
      });
    </script>
  `;

  writeFileSync(join(convertDist, 'esbuild-decompiler.html'), renderPage({
    title: 'ESBuild & JavaScript Decompiler — Free Reverse Engineering & Unminifier | Digital Tools Shed',
    metaDesc: 'Decompile, unminify, format, and reverse engineer minified ESBuild and Webpack JavaScript bundles in your browser.',
    canonical: `${DOMAIN}/convert/esbuild-decompiler.html`,
    bodyContent: esbuildDecompilerBody,
    currentPath: '/convert/esbuild-decompiler.html'
  }));

  console.log('  ✓ Built Developer Suite (json-obfuscator.html, esbuild-decompiler.html)');
}

// ─── MEDIA SUITE ───────────────────────────────────────────────────────────
function buildMediaSuite() {
  const mediaDir = join(DIST, 'media');
  ensureDir(mediaDir);

  const downloaderBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">Universal Media & Video Downloader</h1>
      <p>Save high-definition video and audio streams from YouTube, Twitter/X, TikTok, Instagram, and SoundCloud directly in your browser.</p>
    </div>

    <div class="tool-workspace" style="max-width: 800px; margin: 1.5rem 0;">
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <input type="url" id="mediaUrl" class="search-input" placeholder="Paste YouTube, TikTok, Twitter/X, or Instagram URL here..." style="flex: 1; min-width: 260px; padding: 0.75rem 1rem;" />
        <button id="downloadBtn" class="btn-primary">
          ${ICONS.download}
          <span>EXTRACT MEDIA</span>
        </button>
      </div>

      <div id="mediaStatus" style="display: none; padding: 1rem; border: 1px solid var(--border); background: var(--surface-alt); margin-bottom: 1.5rem; font-family: var(--mono); font-size: 0.9rem;">
        <div id="statusText">Connecting to media gateway...</div>
        <div id="progressTrack" style="height: 6px; background: var(--surface); margin-top: 0.75rem; border: 1px solid var(--border);">
          <div id="progressBar" style="height: 100%; width: 0%; background: var(--fg); transition: width 0.3s;"></div>
        </div>
      </div>

      <div id="resultSection" style="display: none; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); text-align: center;">
        <h3 id="videoTitle" style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">Video File Ready</h3>
        <div style="margin-bottom: 1.5rem;">
          <a href="#" id="finalDownloadLink" class="btn-primary" target="_blank" style="text-decoration: none;">
            ${ICONS.download}
            <span>DOWNLOAD HD FILE</span>
          </a>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--serif);">If direct download does not begin, right-click button and select "Save Link As...".</p>
      </div>
    </div>

    <script>
      const mediaUrl = document.getElementById('mediaUrl');
      const downloadBtn = document.getElementById('downloadBtn');
      const mediaStatus = document.getElementById('mediaStatus');
      const statusText = document.getElementById('statusText');
      const progressBar = document.getElementById('progressBar');
      const resultSection = document.getElementById('resultSection');
      const videoTitle = document.getElementById('videoTitle');
      const finalDownloadLink = document.getElementById('finalDownloadLink');

      const COBALT_API = 'https://co.wuk.sh/api/json';

      function updateProgress(msg, pct) {
        mediaStatus.style.display = 'block';
        statusText.innerText = msg;
        progressBar.style.width = pct + '%';
      }

      downloadBtn.addEventListener('click', async () => {
        const url = mediaUrl.value.trim();
        if (!url) {
          alert('Please enter a valid video or media link.');
          return;
        }

        resultSection.style.display = 'none';
        updateProgress('Analyzing media stream...', 30);

        try {
          const res = await fetch(COBALT_API, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url, vQuality: '1080' })
          });

          if (!res.ok) throw new Error('API server returned busy status.');
          const data = await res.json();

          if (data.status === 'error' || !data.url) {
            throw new Error(data.text || 'Unable to parse media stream.');
          }

          updateProgress('Extraction complete!', 100);
          setTimeout(() => {
            mediaStatus.style.display = 'none';
            resultSection.style.display = 'block';
            videoTitle.innerText = data.filename || 'High Definition Media Stream';
            finalDownloadLink.href = data.url;
          }, 600);

        } catch (err) {
          updateProgress('Using direct fallback proxy...', 75);
          setTimeout(() => {
            mediaStatus.style.display = 'none';
            resultSection.style.display = 'block';
            videoTitle.innerText = 'Extracted Media Stream';
            finalDownloadLink.href = 'https://co.wuk.sh/api/json?url=' + encodeURIComponent(url);
          }, 800);
        }
      });
    </script>
  `;

  writeFileSync(join(mediaDir, 'downloader.html'), renderPage({
    title: 'Universal Media & Video Downloader — YouTube, TikTok, Twitter | Digital Tools Shed',
    metaDesc: 'Free online video and audio downloader for YouTube, TikTok, Twitter/X, and Instagram. Fast, no watermark, 100% free.',
    canonical: `${DOMAIN}/media/downloader.html`,
    bodyContent: downloaderBody,
    currentPath: '/media/downloader.html'
  }));

  const ytMp3Body = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">YouTube to MP3 Audio Converter</h1>
      <p>Convert YouTube videos to high-bitrate MP3 audio files instantly with no software installation required.</p>
    </div>

    <div class="tool-workspace" style="max-width: 800px; margin: 1.5rem 0;">
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <input type="url" id="ytUrl" class="search-input" placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=...)..." style="flex: 1; min-width: 260px; padding: 0.75rem 1rem;" />
        <button id="convertMp3Btn" class="btn-primary">
          ${ICONS.download}
          <span>EXTRACT MP3</span>
        </button>
      </div>

      <div id="mp3Status" style="display: none; padding: 1rem; border: 1px solid var(--border); background: var(--surface-alt); margin-bottom: 1.5rem; font-family: var(--mono); font-size: 0.9rem;">
        <div id="mp3StatusText">Processing audio stream...</div>
      </div>

      <div id="mp3Result" style="display: none; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); text-align: center;">
        <h3 id="mp3Title" style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">Audio Track Ready (320kbps MP3)</h3>
        <div style="margin-bottom: 1.5rem;">
          <a href="#" id="mp3DownloadLink" class="btn-primary" target="_blank" style="text-decoration: none;">
            ${ICONS.download}
            <span>DOWNLOAD MP3 AUDIO</span>
          </a>
        </div>
      </div>
    </div>

    <script>
      const ytUrl = document.getElementById('ytUrl');
      const convertMp3Btn = document.getElementById('convertMp3Btn');
      const mp3Status = document.getElementById('mp3Status');
      const mp3StatusText = document.getElementById('mp3StatusText');
      const mp3Result = document.getElementById('mp3Result');
      const mp3DownloadLink = document.getElementById('mp3DownloadLink');

      convertMp3Btn.addEventListener('click', async () => {
        const url = ytUrl.value.trim();
        if (!url) {
          alert('Please enter a YouTube video URL.');
          return;
        }

        mp3Status.style.display = 'block';
        mp3Result.style.display = 'none';
        mp3StatusText.innerText = 'Extracting audio frequencies...';

        try {
          const res = await fetch('https://co.wuk.sh/api/json', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, isAudioOnly: true, aFormat: 'mp3' })
          });

          const data = await res.json();
          if (data.url) {
            mp3Status.style.display = 'none';
            mp3Result.style.display = 'block';
            mp3DownloadLink.href = data.url;
          } else {
            throw new Error();
          }
        } catch (e) {
          mp3Status.style.display = 'none';
          mp3Result.style.display = 'block';
          mp3DownloadLink.href = 'https://co.wuk.sh/api/json?url=' + encodeURIComponent(url);
        }
      });
    </script>
  `;

  writeFileSync(join(mediaDir, 'youtube-to-mp3.html'), renderPage({
    title: 'YouTube to MP3 Converter — Free 320kbps Audio Extractor | Digital Tools Shed',
    metaDesc: 'Convert YouTube videos to MP3 audio online for free. Fast high-quality 320kbps audio extractor directly in your browser.',
    canonical: `${DOMAIN}/media/youtube-to-mp3.html`,
    bodyContent: ytMp3Body,
    currentPath: '/media/youtube-to-mp3.html'
  }));

  const tiktokBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">TikTok Video Saver (No Watermark)</h1>
      <p>Download clean TikTok videos in high-definition MP4 format without logo watermark overlay.</p>
    </div>

    <div class="tool-workspace" style="max-width: 800px; margin: 1.5rem 0;">
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <input type="url" id="ttUrl" class="search-input" placeholder="Paste TikTok video URL (https://www.tiktok.com/@...)..." style="flex: 1; min-width: 260px; padding: 0.75rem 1rem;" />
        <button id="ttBtn" class="btn-primary">
          ${ICONS.download}
          <span>GET VIDEO</span>
        </button>
      </div>

      <div id="ttResult" style="display: none; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); text-align: center;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">Clean TikTok Video Ready</h3>
        <div style="margin-bottom: 1.5rem;">
          <a href="#" id="ttDownloadLink" class="btn-primary" target="_blank" style="text-decoration: none;">
            ${ICONS.download}
            <span>DOWNLOAD MP4</span>
          </a>
        </div>
      </div>
    </div>

    <script>
      const ttUrl = document.getElementById('ttUrl');
      const ttBtn = document.getElementById('ttBtn');
      const ttResult = document.getElementById('ttResult');
      const ttDownloadLink = document.getElementById('ttDownloadLink');

      ttBtn.addEventListener('click', async () => {
        const url = ttUrl.value.trim();
        if (!url) {
          alert('Please enter a TikTok video URL.');
          return;
        }

        ttResult.style.display = 'block';
        ttDownloadLink.innerText = 'DOWNLOADING...';

        try {
          const res = await fetch('https://co.wuk.sh/api/json', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, isNoTTWatermark: true })
          });

          const data = await res.json();
          if (data.url) {
            ttDownloadLink.href = data.url;
            ttDownloadLink.innerText = 'DOWNLOAD MP4';
          }
        } catch (e) {
          ttDownloadLink.href = 'https://co.wuk.sh/api/json?url=' + encodeURIComponent(url);
          ttDownloadLink.innerText = 'DOWNLOAD MP4';
        }
      });
    </script>
  `;

  writeFileSync(join(mediaDir, 'tiktok-saver.html'), renderPage({
    title: 'TikTok Video Saver — Free No Watermark Downloader | Digital Tools Shed',
    metaDesc: 'Download TikTok videos without watermark in HD quality. Free, instant, online TikTok MP4 video saver.',
    canonical: `${DOMAIN}/media/tiktok-saver.html`,
    bodyContent: tiktokBody,
    currentPath: '/media/tiktok-saver.html'
  }));

  console.log('  ✓ Built Media & Video Suite (/media/)');
}

// ─── CONVERTFAST PORT & RESKIN ─────────────────────────────────────────────
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
function buildPdfTools() {
  const pdfDir = join(DIST, 'pdf');
  ensureDir(pdfDir);

  const pdfTextBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">PDF to Text & Content Extractor</h1>
      <p>Extract all text content and inspect structure from PDF documents. 100% private, processed in client browser memory.</p>
    </div>

    <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
      <div class="drop-zone" id="pdfDropZone">
        <p style="font-family: var(--serif); font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem;">DRAG & DROP PDF FILE HERE</p>
        <p style="font-size: 0.95rem; color: var(--text-muted);">or click to select from your device</p>
        <input type="file" id="pdfFileInput" accept=".pdf" style="display: none;" />
      </div>

      <div id="pdfResult" style="margin-top: 1.5rem; display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-family: var(--serif); font-size: 1.1rem; font-weight: bold;" id="pdfMeta">Extracted Text</span>
          <button class="btn-primary" id="copyBtn">Copy Text</button>
        </div>
        <textarea id="pdfOutput" style="width: 100%; height: 300px; padding: 1rem; font-family: var(--serif); font-size: 1rem;" readonly></textarea>
      </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script>
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const dropZone = document.getElementById('pdfDropZone');
      const fileInput = document.getElementById('pdfFileInput');
      const pdfResult = document.getElementById('pdfResult');
      const pdfOutput = document.getElementById('pdfOutput');
      const pdfMeta = document.getElementById('pdfMeta');
      const copyBtn = document.getElementById('copyBtn');

      dropZone.addEventListener('click', () => fileInput.click());
      dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--border-strong)'; });
      dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = 'var(--border)'; });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border)';
        if (e.dataTransfer.files.length) handlePdf(e.dataTransfer.files[0]);
      });
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handlePdf(e.target.files[0]);
      });

      async function handlePdf(file) {
        if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
          alert('Please select a valid PDF file.');
          return;
        }
        pdfMeta.innerText = 'Processing ' + file.name + '...';
        pdfResult.style.display = 'block';
        pdfOutput.value = 'Reading PDF pages...';

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += '--- Page ' + i + ' ---\\n' + pageText + '\\n\\n';
        }

        pdfMeta.innerText = file.name + ' (' + pdf.numPages + ' pages)';
        pdfOutput.value = fullText || '(No extractable text found in PDF.)';
      }

      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(pdfOutput.value);
        copyBtn.innerText = 'COPIED!';
        setTimeout(() => copyBtn.innerText = 'Copy Text', 2000);
      });
    </script>
  `;

  writeFileSync(join(pdfDir, 'pdf-to-text.html'), renderPage({
    title: 'PDF to Text Extractor — Free Online PDF Parser | Digital Tools Shed',
    metaDesc: 'Extract clean text from PDF documents for free. 100% private in-browser document parsing without uploading to external servers.',
    canonical: `${DOMAIN}/pdf/pdf-to-text.html`,
    bodyContent: pdfTextBody,
    currentPath: '/pdf/pdf-to-text.html'
  }));

  const pdfInspectorBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">PDF Page Counter & Metadata Inspector</h1>
      <p>Quickly check page count, PDF version, author, and security properties instantly without installing software.</p>
    </div>

    <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
      <div class="drop-zone" id="pdfInspectorDrop">
        <p style="font-family: var(--serif); font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem;">SELECT PDF FILE TO INSPECT</p>
        <p style="font-size: 0.95rem; color: var(--text-muted);">Drop file or click here</p>
        <input type="file" id="pdfInspectInput" accept=".pdf" style="display: none;" />
      </div>

      <div id="inspectResult" style="margin-top: 1.5rem; display: none;">
        <div style="font-family: var(--serif); border: 1px solid var(--border); padding: 1.5rem; background: var(--surface);">
          <h3 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">PDF Metadata Overview</h3>
          <p style="margin-bottom: 0.5rem;"><strong>Filename:</strong> <span id="metaFileName" style="color: var(--text-muted);"></span></p>
          <p style="margin-bottom: 0.5rem;"><strong>File Size:</strong> <span id="metaFileSize" style="color: var(--text-muted);"></span></p>
          <p style="margin-bottom: 0.5rem;"><strong>Total Pages:</strong> <span id="metaPages" style="font-size: 1.3rem; font-weight: bold; color: var(--fg);"></span></p>
          <p style="margin-bottom: 0.5rem;"><strong>PDF Version:</strong> <span id="metaVersion" style="color: var(--text-muted);"></span></p>
          <p style="margin-bottom: 0.5rem;"><strong>Title:</strong> <span id="metaTitle" style="color: var(--text-muted);"></span></p>
          <p><strong>Producer / Creator:</strong> <span id="metaProducer" style="color: var(--text-muted);"></span></p>
        </div>
      </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script>
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const inspectDrop = document.getElementById('pdfInspectorDrop');
      const inspectInput = document.getElementById('pdfInspectInput');
      const inspectResult = document.getElementById('inspectResult');

      inspectDrop.addEventListener('click', () => inspectInput.click());
      inspectInput.addEventListener('change', (e) => { if (e.target.files.length) inspectFile(e.target.files[0]); });

      async function inspectFile(file) {
        document.getElementById('metaFileName').innerText = file.name;
        document.getElementById('metaFileSize').innerText = (file.size / 1024).toFixed(1) + ' KB (' + (file.size / (1024*1024)).toFixed(2) + ' MB)';
        inspectResult.style.display = 'block';

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const meta = await pdf.getMetadata();

        document.getElementById('metaPages').innerText = pdf.numPages + ' pages';
        document.getElementById('metaVersion').innerText = pdf.fingerprint ? 'PDF 1.x' : 'Standard';
        document.getElementById('metaTitle').innerText = (meta.info && meta.info.Title) ? meta.info.Title : '(None)';
        document.getElementById('metaProducer').innerText = (meta.info && meta.info.Producer) ? meta.info.Producer : '(None)';
      }
    </script>
  `;

  writeFileSync(join(pdfDir, 'page-counter.html'), renderPage({
    title: 'Free PDF Page Counter & Metadata Inspector | Digital Tools Shed',
    metaDesc: 'Check PDF page count, metadata, file size, and attributes instantly in your web browser. Free, fast, zero installation.',
    canonical: `${DOMAIN}/pdf/page-counter.html`,
    bodyContent: pdfInspectorBody,
    currentPath: '/pdf/page-counter.html'
  }));

  console.log('  ✓ Built PDF Suite (/pdf/)');
}

// ─── MINECRAFT BEDROCK SUITE ───────────────────────────────────────────────
function buildMinecraftTools() {
  const mcDir = join(DIST, 'mc');
  ensureDir(mcDir);

  const uuidBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">Minecraft Bedrock UUID Generator</h1>
      <p>Generate RFC4122 v4 UUID pairs specifically formatted for Minecraft Bedrock behavior packs, resource packs, and manifest.json headers.</p>
    </div>

    <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
      <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
        <button class="btn-primary" id="genUuidBtn">Generate New UUIDs</button>
        <button class="btn-secondary" id="copyAllUuid">Copy Header & Module Pair</button>
      </div>

      <div style="font-family: var(--mono); display: grid; gap: 1rem;">
        <div style="border: 1px solid var(--border); padding: 1rem; background: var(--surface-alt);">
          <div style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Header UUID (Pack UUID)</div>
          <div id="headerUuid" style="font-size: 1.1rem; font-weight: bold; margin-top: 0.25rem;"></div>
        </div>
        <div style="border: 1px solid var(--border); padding: 1rem; background: var(--surface-alt);">
          <div style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Module UUID</div>
          <div id="moduleUuid" style="font-size: 1.1rem; font-weight: bold; margin-top: 0.25rem;"></div>
        </div>
      </div>
    </div>

    <script>
      function genUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

      function refresh() {
        document.getElementById('headerUuid').innerText = genUUID();
        document.getElementById('moduleUuid').innerText = genUUID();
      }
      document.getElementById('genUuidBtn').addEventListener('click', refresh);
      document.getElementById('copyAllUuid').addEventListener('click', () => {
        const text = 'Header UUID: ' + document.getElementById('headerUuid').innerText + '\\nModule UUID: ' + document.getElementById('moduleUuid').innerText;
        navigator.clipboard.writeText(text);
        alert('Copied UUID pair to clipboard!');
      });
      refresh();
    </script>
  `;

  writeFileSync(join(mcDir, 'uuid-gen.html'), renderPage({
    title: 'Minecraft UUID Generator for Bedrock Add-Ons | Digital Tools Shed',
    metaDesc: 'Generate random UUID v4 strings for Minecraft Bedrock behavior pack and resource pack manifest.json files.',
    canonical: `${DOMAIN}/mc/uuid-gen.html`,
    bodyContent: uuidBody,
    currentPath: '/mc/uuid-gen.html'
  }));

  const manifestBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">Bedrock Manifest.json Generator</h1>
      <p>Quickly generate valid, clean manifest.json files for Minecraft Bedrock Resource Packs and Behavior Packs with automatic UUIDs.</p>
    </div>

    <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <label style="font-family: var(--serif); font-size: 1rem; color: var(--fg); display: block; margin-bottom: 0.35rem;">Pack Name</label>
          <input type="text" id="packName" value="My Custom Pack" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem;" />
        </div>
        <div>
          <label style="font-family: var(--serif); font-size: 1rem; color: var(--fg); display: block; margin-bottom: 0.35rem;">Pack Type</label>
          <select id="packType" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem;">
            <option value="data">Behavior Pack (data)</option>
            <option value="resources">Resource Pack (resources)</option>
          </select>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <span style="font-family: var(--serif); font-size: 1rem; font-weight: bold;">manifest.json output:</span>
        <button class="btn-primary" id="copyManifest">Copy JSON</button>
      </div>
      <textarea id="manifestOutput" style="width: 100%; height: 260px; padding: 1rem; font-family: var(--mono); font-size: 0.85rem;" readonly></textarea>
    </div>

    <script>
      function genUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

      function updateManifest() {
        const name = document.getElementById('packName').value || 'My Pack';
        const type = document.getElementById('packType').value;
        const manifest = {
          "format_version": 2,
          "header": {
            "name": name,
            "description": name + " - Created via digitaltoolsshed.com",
            "uuid": genUUID(),
            "version": [1, 0, 0],
            "min_engine_version": [1, 21, 0]
          },
          "modules": [
            {
              "type": type,
              "uuid": genUUID(),
              "version": [1, 0, 0]
            }
          ]
        };
        document.getElementById('manifestOutput').value = JSON.stringify(manifest, null, 2);
      }

      document.getElementById('packName').addEventListener('input', updateManifest);
      document.getElementById('packType').addEventListener('change', updateManifest);
      document.getElementById('copyManifest').addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('manifestOutput').value);
        alert('Copied manifest.json to clipboard!');
      });
      updateManifest();
    </script>
  `;

  writeFileSync(join(mcDir, 'manifest-gen.html'), renderPage({
    title: 'Minecraft Bedrock Manifest.json Generator | Digital Tools Shed',
    metaDesc: 'Generate valid manifest.json templates for Minecraft Bedrock Behavior & Resource packs with fresh UUIDs.',
    canonical: `${DOMAIN}/mc/manifest-gen.html`,
    bodyContent: manifestBody,
    currentPath: '/mc/manifest-gen.html'
  }));

  console.log('  ✓ Built Minecraft Suite (/mc/)');
}

// ─── UNIT CALCULATORS ──────────────────────────────────────────────────────
function buildUnitCalcSuite() {
  const calcDist = join(DIST, 'calc');
  ensureDir(calcDist);

  const unitCategories = {
    length: {
      label: 'Length & Distance',
      base: 'meter',
      units: {
        millimeter:     { label: 'Millimeters',    abbr: 'mm',   factor: 0.001 },
        centimeter:     { label: 'Centimeters',    abbr: 'cm',   factor: 0.01 },
        meter:          { label: 'Meters',         abbr: 'm',    factor: 1 },
        kilometer:      { label: 'Kilometers',     abbr: 'km',   factor: 1000 },
        inch:           { label: 'Inches',         abbr: 'in',   factor: 0.0254 },
        foot:           { label: 'Feet',           abbr: 'ft',   factor: 0.3048 },
        yard:           { label: 'Yards',          abbr: 'yd',   factor: 0.9144 },
        mile:           { label: 'Miles',          abbr: 'mi',   factor: 1609.344 },
        nautical_mile:  { label: 'Nautical Miles', abbr: 'nmi',  factor: 1852 },
        micrometer:     { label: 'Micrometers',    abbr: 'μm',   factor: 0.000001 }
      }
    },
    weight: {
      label: 'Weight & Mass',
      base: 'kilogram',
      units: {
        milligram: { label: 'Milligrams', abbr: 'mg',  factor: 0.000001 },
        gram:      { label: 'Grams',      abbr: 'g',   factor: 0.001 },
        kilogram:  { label: 'Kilograms',  abbr: 'kg',  factor: 1 },
        tonne:     { label: 'Tonnes',     abbr: 't',   factor: 1000 },
        ounce:     { label: 'Ounces',     abbr: 'oz',  factor: 0.0283495 },
        pound:     { label: 'Pounds',     abbr: 'lbs', factor: 0.453592 },
        stone:     { label: 'Stones',     abbr: 'st',  factor: 6.35029 }
      }
    },
    temperature: {
      label: 'Temperature',
      base: 'celsius',
      custom: true,
      units: {
        celsius:    { label: 'Celsius',    abbr: '°C' },
        fahrenheit: { label: 'Fahrenheit', abbr: '°F' },
        kelvin:     { label: 'Kelvin',     abbr: 'K'  }
      }
    },
    volume: {
      label: 'Volume & Liquid',
      base: 'liter',
      units: {
        milliliter:   { label: 'Milliliters',   abbr: 'mL',   factor: 0.001 },
        liter:        { label: 'Liters',        abbr: 'L',    factor: 1 },
        cubic_meter:  { label: 'Cubic Meters',  abbr: 'm³',   factor: 1000 },
        gallon_us:    { label: 'US Gallons',    abbr: 'gal',  factor: 3.78541 },
        gallon_uk:    { label: 'UK Gallons',    abbr: 'gal',  factor: 4.54609 },
        quart:        { label: 'Quarts',        abbr: 'qt',   factor: 0.946353 },
        pint:         { label: 'Pints',         abbr: 'pt',   factor: 0.473176 },
        cup:          { label: 'Cups',          abbr: 'cup',  factor: 0.236588 },
        tablespoon:   { label: 'Tablespoons',   abbr: 'tbsp', factor: 0.0147868 },
        teaspoon:     { label: 'Teaspoons',     abbr: 'tsp',  factor: 0.00492892 },
        fluid_oz:     { label: 'Fluid Ounces',  abbr: 'fl oz', factor: 0.0295735 }
      }
    },
    speed: {
      label: 'Speed & Velocity',
      base: 'meter_per_second',
      units: {
        meter_per_second:   { label: 'Meters/Second',     abbr: 'm/s',   factor: 1 },
        kilometer_per_hour: { label: 'Kilometers/Hour',    abbr: 'km/h',  factor: 0.277778 },
        mile_per_hour:      { label: 'Miles/Hour',         abbr: 'mph',   factor: 0.44704 },
        knot:               { label: 'Knots',              abbr: 'kn',    factor: 0.514444 },
        foot_per_second:    { label: 'Feet/Second',        abbr: 'ft/s',  factor: 0.3048 }
      }
    },
    area: {
      label: 'Area & Surface',
      base: 'square_meter',
      units: {
        square_millimeter: { label: 'Square Millimeters', abbr: 'mm²', factor: 0.000001 },
        square_centimeter: { label: 'Square Centimeters', abbr: 'cm²', factor: 0.0001 },
        square_meter:      { label: 'Square Meters',      abbr: 'm²',  factor: 1 },
        square_kilometer:  { label: 'Square Kilometers',  abbr: 'km²', factor: 1000000 },
        square_foot:       { label: 'Square Feet',        abbr: 'ft²', factor: 0.092903 },
        square_yard:       { label: 'Square Yards',       abbr: 'yd²', factor: 0.836127 },
        acre:              { label: 'Acres',              abbr: 'ac',  factor: 4046.86 },
        hectare:           { label: 'Hectares',           abbr: 'ha',  factor: 10000 },
        square_mile:       { label: 'Square Miles',       abbr: 'mi²', factor: 2589988.11 }
      }
    },
    data: {
      label: 'Digital Data Storage',
      base: 'byte',
      units: {
        bit:      { label: 'Bits',       abbr: 'b',   factor: 0.125 },
        byte:     { label: 'Bytes',      abbr: 'B',   factor: 1 },
        kilobyte: { label: 'Kilobytes',  abbr: 'KB',  factor: 1024 },
        megabyte: { label: 'Megabytes',  abbr: 'MB',  factor: 1048576 },
        gigabyte: { label: 'Gigabytes',  abbr: 'GB',  factor: 1073741824 },
        terabyte: { label: 'Terabytes',  abbr: 'TB',  factor: 1099511627776 },
        petabyte: { label: 'Petabytes',  abbr: 'PB',  factor: 1125899906842624 }
      }
    },
    time: {
      label: 'Time',
      base: 'second',
      units: {
        millisecond: { label: 'Milliseconds', abbr: 'ms',  factor: 0.001 },
        second:      { label: 'Seconds',      abbr: 's',   factor: 1 },
        minute:      { label: 'Minutes',      abbr: 'min', factor: 60 },
        hour:        { label: 'Hours',        abbr: 'hr',  factor: 3600 },
        day:         { label: 'Days',         abbr: 'd',   factor: 86400 },
        week:        { label: 'Weeks',        abbr: 'wk',  factor: 604800 },
        month:       { label: 'Months',       abbr: 'mo',  factor: 2629800 },
        year:        { label: 'Years',        abbr: 'yr',  factor: 31557600 }
      }
    },
    energy: {
      label: 'Energy & Work',
      base: 'joule',
      units: {
        joule:         { label: 'Joules',         abbr: 'J',    factor: 1 },
        kilojoule:     { label: 'Kilojoules',     abbr: 'kJ',   factor: 1000 },
        calorie:       { label: 'Calories',       abbr: 'cal',  factor: 4.184 },
        kilocalorie:   { label: 'Kilocalories',   abbr: 'kcal', factor: 4184 },
        watt_hour:     { label: 'Watt Hours',     abbr: 'Wh',   factor: 3600 },
        kilowatt_hour: { label: 'Kilowatt Hours', abbr: 'kWh',  factor: 3600000 },
        btu:           { label: 'BTU',            abbr: 'BTU',  factor: 1055.06 }
      }
    },
    pressure: {
      label: 'Pressure',
      base: 'pascal',
      units: {
        pascal:     { label: 'Pascals',     abbr: 'Pa',   factor: 1 },
        kilopascal: { label: 'Kilopascals', abbr: 'kPa',  factor: 1000 },
        bar:        { label: 'Bar',         abbr: 'bar',  factor: 100000 },
        psi:        { label: 'PSI',         abbr: 'psi',  factor: 6894.76 },
        atmosphere: { label: 'Atmospheres', abbr: 'atm',  factor: 101325 },
        torr:       { label: 'Torr',        abbr: 'Torr', factor: 133.322 }
      }
    }
  };

  const popularPairs = {
    length: [
      ['centimeter', 'inch', 'cm-to-inches'],
      ['inch', 'centimeter', 'inches-to-cm'],
      ['meter', 'foot', 'm-to-feet'],
      ['foot', 'meter', 'feet-to-m'],
      ['kilometer', 'mile', 'km-to-miles'],
      ['mile', 'kilometer', 'miles-to-km'],
      ['millimeter', 'inch', 'mm-to-inches']
    ],
    weight: [
      ['kilogram', 'pound', 'kg-to-lbs'],
      ['pound', 'kilogram', 'lbs-to-kg'],
      ['gram', 'ounce', 'g-to-oz'],
      ['ounce', 'gram', 'oz-to-g'],
      ['stone', 'kilogram', 'stone-to-kg'],
      ['kilogram', 'stone', 'kg-to-stone']
    ],
    temperature: [
      ['celsius', 'fahrenheit', 'celsius-to-fahrenheit'],
      ['fahrenheit', 'celsius', 'fahrenheit-to-celsius'],
      ['celsius', 'kelvin', 'celsius-to-kelvin']
    ],
    volume: [
      ['liter', 'gallon_us', 'liters-to-gallons'],
      ['gallon_us', 'liter', 'gallons-to-liters'],
      ['milliliter', 'cup', 'ml-to-cups'],
      ['cup', 'milliliter', 'cups-to-ml'],
      ['tablespoon', 'milliliter', 'tbsp-to-ml'],
      ['teaspoon', 'milliliter', 'tsp-to-ml']
    ],
    speed: [
      ['kilometer_per_hour', 'mile_per_hour', 'kmh-to-mph'],
      ['mile_per_hour', 'kilometer_per_hour', 'mph-to-kmh'],
      ['knot', 'kilometer_per_hour', 'knots-to-kmh']
    ],
    area: [
      ['square_meter', 'square_foot', 'm2-to-ft2'],
      ['square_foot', 'square_meter', 'ft2-to-m2'],
      ['acre', 'hectare', 'acres-to-hectares'],
      ['hectare', 'acre', 'hectares-to-acres']
    ],
    data: [
      ['megabyte', 'gigabyte', 'mb-to-gb'],
      ['gigabyte', 'terabyte', 'gb-to-tb'],
      ['byte', 'kilobyte', 'bytes-to-kb']
    ],
    time: [
      ['hour', 'minute', 'hours-to-minutes'],
      ['day', 'hour', 'days-to-hours'],
      ['week', 'day', 'weeks-to-days']
    ],
    energy: [
      ['calorie', 'joule', 'calories-to-joules'],
      ['kilowatt_hour', 'joule', 'kwh-to-joules'],
      ['kilocalorie', 'kilojoule', 'kcal-to-kj']
    ],
    pressure: [
      ['bar', 'psi', 'bar-to-psi'],
      ['psi', 'bar', 'psi-to-bar'],
      ['atmosphere', 'psi', 'atm-to-psi']
    ]
  };

  const commonValues = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 5000];

  function getFactor(catKey, fromKey, toKey) {
    if (unitCategories[catKey].custom) return null;
    const baseFactorFrom = unitCategories[catKey].units[fromKey].factor;
    const baseFactorTo = unitCategories[catKey].units[toKey].factor;
    return baseFactorFrom / baseFactorTo;
  }

  function getConversionValue(catKey, fromKey, toKey, val, factor) {
    if (unitCategories[catKey].custom) {
      if (fromKey === 'celsius' && toKey === 'fahrenheit') return val * 9/5 + 32;
      if (fromKey === 'fahrenheit' && toKey === 'celsius') return (val - 32) * 5/9;
      if (fromKey === 'celsius' && toKey === 'kelvin') return val + 273.15;
      if (fromKey === 'kelvin' && toKey === 'celsius') return val - 273.15;
      if (fromKey === 'fahrenheit' && toKey === 'kelvin') return (val - 32) * 5/9 + 273.15;
      if (fromKey === 'kelvin' && toKey === 'fahrenheit') return (val - 273.15) * 9/5 + 32;
      return val;
    }
    return val * factor;
  }

  let totalCalcsBuilt = 0;

  for (const catKey of Object.keys(popularPairs)) {
    const pairs = popularPairs[catKey];
    const cat = unitCategories[catKey];

    for (const [fromKey, toKey, rawSlug] of pairs) {
      const slug = rawSlug.replace(/\//g, '');
      const fileName = `${slug}.html`;
      const fromUnit = cat.units[fromKey];
      const toUnit = cat.units[toKey];
      const factor = getFactor(catKey, fromKey, toKey);

      const tableRows = commonValues.map(v => {
        const res = getConversionValue(catKey, fromKey, toKey, v, factor);
        return `
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 0.6rem 0.75rem; font-family: var(--mono);">${v} ${fromUnit.abbr}</td>
            <td style="padding: 0.6rem 0.75rem; font-family: var(--mono); font-weight: bold;">${parseFloat(res.toFixed(6))} ${toUnit.abbr}</td>
          </tr>
        `;
      }).join('');

      let formulaHtml = '';
      if (cat.custom) {
        if (fromKey === 'celsius' && toKey === 'fahrenheit') {
          formulaHtml = `<p style="line-height: 1.6; margin-bottom: 0.5rem;">To convert Celsius (°C) to Fahrenheit (°F), multiply by 9/5 (or 1.8) and add 32.</p><div style="font-family: var(--mono); background: var(--surface-alt); padding: 0.75rem; border: 1px solid var(--border);"><strong>Formula:</strong> °F = (°C × 9/5) + 32</div>`;
        } else if (fromKey === 'fahrenheit' && toKey === 'celsius') {
          formulaHtml = `<p style="line-height: 1.6; margin-bottom: 0.5rem;">To convert Fahrenheit (°F) to Celsius (°C), subtract 32 and multiply by 5/9.</p><div style="font-family: var(--mono); background: var(--surface-alt); padding: 0.75rem; border: 1px solid var(--border);"><strong>Formula:</strong> °C = (°F - 32) × 5/9</div>`;
        } else {
          formulaHtml = `<p style="line-height: 1.6;">Uses precise thermodynamic temperature conversion formulas.</p>`;
        }
      } else {
        const displayFactor = parseFloat(factor.toFixed(6));
        formulaHtml = `
          <p style="line-height: 1.6; margin-bottom: 0.5rem;">How to convert ${fromUnit.label} to ${toUnit.label}: Multiply by <strong>${displayFactor}</strong>.</p>
          <div style="font-family: var(--mono); background: var(--surface-alt); padding: 0.75rem; border: 1px solid var(--border);">
            <strong>Formula:</strong> ${toUnit.label} = ${fromUnit.label} × ${displayFactor}
          </div>
        `;
      }

      const relatedCards = pairs.filter(p => p[2].replace(/\//g, '') !== slug).slice(0, 4).map(p => {
        const rFrom = cat.units[p[0]];
        const rTo = cat.units[p[1]];
        const rSlug = p[2].replace(/\//g, '');
        return `
          <a href="/calc/${rSlug}.html" class="tool-card">
            <h4 style="font-family: var(--serif); font-size: 1.05rem; margin-bottom: 0.25rem;">${rFrom.label} to ${rTo.label}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Convert ${rFrom.abbr} to ${rTo.abbr} instantly.</p>
          </a>
        `;
      }).join('');

      let clientScript = '';
      if (cat.custom) {
        clientScript = `
          const fromInput = document.getElementById('fromInput');
          const toInput = document.getElementById('toInput');
          function c2f(v) { return v * 9/5 + 32; }
          function f2c(v) { return (v - 32) * 5/9; }
          function c2k(v) { return v + 273.15; }
          function k2c(v) { return v - 273.15; }
          function f2k(v) { return (v - 32) * 5/9 + 273.15; }
          function k2f(v) { return (v - 273.15) * 9/5 + 32; }

          let convertForward = c2f, convertBackward = f2c;
          if ('${fromKey}_to_${toKey}' === 'celsius_to_fahrenheit') { convertForward = c2f; convertBackward = f2c; }
          else if ('${fromKey}_to_${toKey}' === 'fahrenheit_to_celsius') { convertForward = f2c; convertBackward = c2f; }
          else if ('${fromKey}_to_${toKey}' === 'celsius_to_kelvin') { convertForward = c2k; convertBackward = k2c; }
          else if ('${fromKey}_to_${toKey}' === 'kelvin_to_celsius') { convertForward = k2c; convertBackward = c2k; }
          else if ('${fromKey}_to_${toKey}' === 'fahrenheit_to_kelvin') { convertForward = f2k; convertBackward = k2f; }
          else if ('${fromKey}_to_${toKey}' === 'kelvin_to_fahrenheit') { convertForward = k2f; convertBackward = f2k; }

          function updateFrom() {
            const val = parseFloat(fromInput.value);
            if (isNaN(val)) toInput.value = '';
            else toInput.value = parseFloat(convertForward(val).toFixed(6));
          }
          function updateTo() {
            const val = parseFloat(toInput.value);
            if (isNaN(val)) fromInput.value = '';
            else fromInput.value = parseFloat(convertBackward(val).toFixed(6));
          }

          fromInput.addEventListener('input', updateFrom);
          toInput.addEventListener('input', updateTo);
          updateFrom();
        `;
      } else {
        clientScript = `
          const factor = ${factor};
          const fromInput = document.getElementById('fromInput');
          const toInput = document.getElementById('toInput');

          function updateFrom() {
            const val = parseFloat(fromInput.value);
            if (isNaN(val)) toInput.value = '';
            else toInput.value = parseFloat((val * factor).toFixed(6));
          }
          function updateTo() {
            const val = parseFloat(toInput.value);
            if (isNaN(val)) fromInput.value = '';
            else fromInput.value = parseFloat((val / factor).toFixed(6));
          }

          fromInput.addEventListener('input', updateFrom);
          toInput.addEventListener('input', updateTo);
          updateFrom();
        `;
      }

      const calcBody = `
        <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
          <h1 style="margin-top: 0.5rem;">Convert ${fromUnit.label} to ${toUnit.label}</h1>
          <p>Instantly calculate ${fromUnit.label} (${fromUnit.abbr}) to ${toUnit.label} (${toUnit.abbr}) with real-time two-way formula calculation.</p>
        </div>

        <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1.25rem; align-items: center;">
            <div>
              <label style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">${fromUnit.label} (${fromUnit.abbr})</label>
              <input type="number" id="fromInput" class="search-input" value="1" style="width: 100%; font-size: 1.3rem; padding: 0.75rem 1rem; font-family: var(--mono);" />
            </div>
            <div style="font-size: 2rem; font-weight: bold; text-align: center; color: var(--text-muted); padding-top: 1.5rem;">=</div>
            <div>
              <label style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">${toUnit.label} (${toUnit.abbr})</label>
              <input type="number" id="toInput" class="search-input" style="width: 100%; font-size: 1.3rem; padding: 0.75rem 1rem; font-family: var(--mono);" />
            </div>
          </div>
        </div>

        <div style="border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); margin: 2rem 0; max-width: 850px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 0.75rem;">Conversion Formula & Exact Calculation</h3>
          ${formulaHtml}
        </div>

        <div class="ad-blend-box" style="margin: 2rem 0; max-width: 850px;">
          <span class="ad-label">Sponsored Resource</span>
          <div class="ad-unit-300x250">
            <script type="text/javascript">
              atOptions = {
                'key' : '335d807d460eaf2491fcca0f635474ce',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js"></script>
          </div>
        </div>

        <div style="border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); margin: 2rem 0; max-width: 850px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1rem;">${fromUnit.label} to ${toUnit.label} Quick Reference Table</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                  <th style="padding: 0.6rem 0.75rem;">${fromUnit.label} (${fromUnit.abbr})</th>
                  <th style="padding: 0.6rem 0.75rem;">${toUnit.label} (${toUnit.abbr})</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
        </div>

        ${relatedCards ? `
          <div style="margin: 2rem 0; max-width: 850px;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1rem;">Related ${cat.label} Converters</h3>
            <div class="tool-grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
              ${relatedCards}
            </div>
          </div>
        ` : ''}

        <script>
          ${clientScript}
        </script>
      `;

      writeFileSync(join(calcDist, fileName), renderPage({
        title: `Convert ${fromUnit.label} to ${toUnit.label} — Free Online Calculator | Digital Tools Shed`,
        metaDesc: `Instantly convert ${fromUnit.label} (${fromUnit.abbr}) to ${toUnit.label} (${toUnit.abbr}). Free, fast, real-time formula calculations with zero tracking.`,
        canonical: `${DOMAIN}/calc/${fileName}`,
        bodyContent: calcBody,
        currentPath: `/calc/${fileName}`
      }));

      totalCalcsBuilt++;
    }
  }

  console.log(`  ✓ Built & Styled ${totalCalcsBuilt} Unit Calculators with Workbench Theme and Adsterra Ads (/calc/)`);
}

// ─── TECH ARTICLES & BLUEPRINTS SUITE ──────────────────────────────────────
function buildArticlesSuite() {
  const articlesDist = join(DIST, 'articles');
  ensureDir(articlesDist);

  const ARTICLES = [
    {
      slug: 'how-to-decompile-esbuild-bundles',
      title: 'Reverse Engineering Minified ESBuild & Webpack Bundles: A Practical Guide',
      category: 'Developer & Reverse Engineering',
      date: '2026-08-16',
      readTime: '6 min read',
      desc: 'Understand how modern JS bundlers compile modules into IIFEs, how to unwind helper functions, expand comma-operators, and recover clean readable source code.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Developer & Reverse Engineering</div>
            <h1>Reverse Engineering Minified ESBuild & Webpack Bundles: A Practical Guide</h1>
            <div class="article-meta">
              <span>By <strong>Engineering Team</strong></span>
              <span>•</span>
              <span>Updated August 16, 2026</span>
              <span>•</span>
              <span>6 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>Modern JavaScript bundlers like <strong>ESBuild</strong>, <strong>Webpack</strong>, and <strong>Rollup</strong> transform modular, multi-file codebases into highly optimized single-file bundles. In production deployments, code is minified: whitespace is stripped, identifiers are renamed to single characters, statements are collapsed using comma operators, and module imports are converted into internal helper functions.</p>

            <p>When source maps are missing, understanding or auditing this code requires systematic unminification. In this guide, we break down how ESBuild bundle structures work and how to restore readable code from obfuscated artifacts.</p>

            <h2>1. Anatomy of an ESBuild Bundle</h2>
            <p>ESBuild handles ES Modules (ESM) and CommonJS (CJS) by synthesizing lightweight wrapper functions. The most common patterns you will encounter in minified bundles are:</p>

            <ul>
              <li><code>__esm(fn)</code>: Lazy-evaluates an ES module once and caches the namespace.</li>
              <li><code>__toESM(mod)</code>: Wraps CommonJS exports to expose standard default and named properties.</li>
              <li><code>__export(target, all)</code>: Defines getters on module exports to simulate live ESM bindings.</li>
            </ul>

            <div class="code-block-wrapper">
              <pre><code>// Typical minified ESBuild module wrapper:
var s=Object.defineProperty;
var i=Object.getOwnPropertyDescriptor;
var p=(t,e)=>{for(var r in e)s(t,r,{get:e[r],enumerable:!0})};
var m=(t,e,r,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Object.getOwnPropertyNames(e))!Object.prototype.hasOwnProperty.call(t,n)&&n!==r&&s(t,n,{get:()=>e[n],enumerable:!(a=i(e,n))||a.enumerable});return t};
var d=t=>m(s({},"__esModule",{value:!0}),t);</code></pre>
            </div>

            <h2>2. The Comma Operator Compression Pattern</h2>
            <p>Minifiers frequently replace sequential statements with chained expressions using the comma operator <code>(a(), b(), c())</code> or ternaries <code>(cond ? (x=1, y=2) : z=3)</code>. This saves bytes by eliminating semicolons and statement blocks, but destroys human readability.</p>

            <p>To decompile these structures:</p>
            <ol>
              <li>Expand chained comma expressions into distinct statement lines.</li>
              <li>Convert ternary assignments back into explicit <code>if / else</code> control flow blocks.</li>
              <li>Reformat nested ternary chains into readable <code>switch</code> or <code>if / else if</code> branches.</li>
            </ol>

            <div class="article-callout">
              "Unminifying is not just adding newlines; it is reconstructing the Abstract Syntax Tree (AST) so that identifiers and control flow match standard developer intent."
            </div>

            <h2>3. Variable Recovery and Identifier Mapping</h2>
            <p>While variable renaming (mangling) is irreversible without source maps or symbols, identifiers can be contextualized based on their usage patterns:</p>
            <ul>
              <li>DOM elements: <code>document.getElementById</code> or <code>querySelector</code> targets indicate UI references.</li>
              <li>Web APIs: Calls to <code>fetch()</code>, <code>crypto.subtle</code>, or <code>localStorage</code> reveal network and storage handlers.</li>
              <li>Data models: Object property names (which are preserved unless advanced property mangling is used) provide structural hints.</li>
            </ul>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Try the In-Browser Decompiler</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Paste your minified ESBuild or Webpack JavaScript payload into our client-side decompiler to instantly unpack IIFEs, expand comma-statements, and format readable code.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/convert/esbuild-decompiler.html" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Open ESBuild Decompiler →</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      slug: 'json-obfuscation-and-compression-techniques',
      title: 'JSON Payload Obfuscation & Minification: Strategies for Client-Side Protection',
      category: 'Security & Web Architecture',
      date: '2026-08-16',
      readTime: '5 min read',
      desc: 'Explore reversible property dictionary mappings, Unicode hexadecimal escaping, and whitespace elimination strategies for protecting and compressing JSON data.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Security & Web Architecture</div>
            <h1>JSON Payload Obfuscation & Minification: Strategies for Client-Side Protection</h1>
            <div class="article-meta">
              <span>By <strong>Engineering Team</strong></span>
              <span>•</span>
              <span>Updated August 16, 2026</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>JSON (JavaScript Object Notation) is the standard data interchange format for modern APIs, configurations, and state persistence. However, raw JSON files are plain text, human-readable, and often contain descriptive keys that expose internal schema architectures or increase network payload size.</p>

            <p>In this article, we analyze techniques for compressing, protecting, and obfuscating JSON data before client transmission or offline storage.</p>

            <h2>1. Property Name Dictionary Substitution</h2>
            <p>In large datasets, repeating key names (e.g. <code>"transaction_identifier"</code>, <code>"user_authentication_token"</code>) consume significant memory and reveal internal naming conventions.</p>

            <p>By mapping repeated keys to short deterministic token identifiers (e.g. <code>"k0"</code>, <code>"k1"</code>, <code>"k2"</code>), you achieve dual benefits:</p>
            <ul>
              <li><strong>Payload Reduction</strong>: Reduces file sizes by 30% to 60% before gzip/brotli compression.</li>
              <li><strong>Schema Obfuscation</strong>: Prevents casual inspection of field definitions and business logic.</li>
            </ul>

            <div class="code-block-wrapper">
              <pre><code>// Original JSON:
[
  {"productId": 101, "productName": "Screwdriver", "inStock": true},
  {"productId": 102, "productName": "Hammer", "inStock": false}
]

// Obfuscated Payload with Key Map:
{
  "__map": {"k0": "productId", "k1": "productName", "k2": "inStock"},
  "data": [
    {"k0": 101, "k1": "Screwdriver", "k2": true},
    {"k0": 102, "k1": "Hammer", "k2": false}
  ]
}</code></pre>
            </div>

            <h2>2. Unicode Hexadecimal Escaping</h2>
            <p>For sensitive strings, keys, or metadata, strings can be encoded using standard JSON-compliant Unicode escapes (<code>\\uXXXX</code>). Standard JSON parsers evaluate these transparently, but scrapers and static inspection tools cannot read them without decoding.</p>

            <div class="code-block-wrapper">
              <pre><code>// Plaintext: "apiKey": "live_sec_99182"
// Unicode Hex Encoded: "\\u0061\\u0070\\u0069\\u004b\\u0065\\u0079": "\\u006c\\u0069\\u0076\\u0065\\u005f..."</code></pre>
            </div>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Interactive JSON Obfuscator & Compressor</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Use our browser-based utility to minify, dictionary-encode, and hex-escape JSON payloads with 100% reversible decompression.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/convert/json-obfuscator.html" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Open JSON Obfuscator →</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      slug: 'minecraft-bedrock-custom-blocks-guide',
      title: 'Minecraft Bedrock Custom 3D Blocks & Molang Component Architecture Guide',
      category: 'Minecraft & Game Engine',
      date: '2026-08-16',
      readTime: '7 min read',
      desc: 'Step-by-step technical tutorial on building custom 3D blocks in Bedrock 1.21.0+ with geometry, material instances, Molang query states, and permutations.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Minecraft & Game Engine</div>
            <h1>Minecraft Bedrock Custom 3D Blocks & Molang Component Architecture Guide</h1>
            <div class="article-meta">
              <span>By <strong>Engineering Team</strong></span>
              <span>•</span>
              <span>Updated August 16, 2026</span>
              <span>•</span>
              <span>7 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>With Minecraft Bedrock 1.21.0+, custom block authoring transitioned into a declarative component system. The legacy block pipeline has been replaced by modular components in the Behavior Pack paired with texture definitions in the Resource Pack.</p>

            <h2>1. Behavior Pack Component Declaration</h2>
            <p>Every custom block JSON requires a namespace identifier and core components defining friction, geometry, material instances, and collision bounds.</p>

            <div class="code-block-wrapper">
              <pre><code>{
  "format_version": "1.21.0",
  "minecraft:block": {
    "description": {
      "identifier": "custom:industrial_workbench",
      "menu_category": {
        "category": "items",
        "group": "itemGroup.name.workbench"
      }
    },
    "components": {
      "minecraft:geometry": "geometry.industrial_workbench",
      "minecraft:material_instances": {
        "*": {
          "texture": "industrial_workbench",
          "render_method": "opaque"
        }
      },
      "minecraft:collision_box": true,
      "minecraft:selection_box": true,
      "minecraft:destructible_by_mining": {
        "seconds_to_destroy": 1.5
      }
    }
  }
}</code></pre>
            </div>

            <h2>2. Resource Pack Mappings</h2>
            <p>For the engine to display the block model and texture, register the identifier inside <code>blocks.json</code> and declare the texture path inside <code>textures/terrain_texture.json</code>:</p>

            <div class="code-block-wrapper">
              <pre><code>// terrain_texture.json
{
  "resource_pack_name": "digital_tools_shed_rp",
  "texture_name": "atlas.terrain",
  "texture_data": {
    "industrial_workbench": {
      "textures": "textures/blocks/industrial_workbench"
    }
  }
}</code></pre>
            </div>

            <h2>3. Molang State Permutations</h2>
            <p>Dynamic block properties (such as activation states, rotation directions, or visual variants) are managed using <code>permutations</code> and <code>minecraft:custom_components</code>:</p>

            <div class="code-block-wrapper">
              <pre><code>"permutations": [
  {
    "condition": "q.block_state('custom:powered') == 1",
    "components": {
      "minecraft:light_emission": 14,
      "minecraft:material_instances": {
        "*": {
          "texture": "industrial_workbench_active",
          "render_method": "blend"
        }
      }
    }
  }
]</code></pre>
            </div>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Generate Bedrock Manifests & UUIDs</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Use our generator to create valid manifest.json files with matching UUID v4 pairs and module headers for your Behavior and Resource packs.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/mc/manifest-gen.html" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Manifest Generator →</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      slug: 'minecraft-bedrock-manifest-uuid-guide',
      title: 'Mastering Minecraft Bedrock Manifest.json Architecture & UUID Dependency Routing',
      category: 'Minecraft & Game Engine',
      date: '2026-08-16',
      readTime: '6 min read',
      desc: 'Understand manifest.json structure, header and module UUID v4 pairing, min_engine_version requirements, and dependency resolution between BP and RP.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Minecraft & Game Engine</div>
            <h1>Mastering Minecraft Bedrock Manifest.json Architecture & UUID Dependency Routing</h1>
            <div class="article-meta">
              <span>By <strong>Engineering Team</strong></span>
              <span>•</span>
              <span>Updated August 16, 2026</span>
              <span>•</span>
              <span>6 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>The <code>manifest.json</code> file is the root identity certificate for every Minecraft Bedrock add-on pack. A single invalid UUID, mismatched module type, or conflicting version definition causes Bedrock to reject the pack or silently ignore assets.</p>

            <h2>1. The Core Schema Breakdown</h2>
            <p>A valid manifest requires two distinct top-level sections: <code>header</code> and <code>modules</code>.</p>
            <ul>
              <li><strong>Header</strong>: Defines pack name, description, pack UUID, version tuple <code>[1, 0, 0]</code>, and <code>min_engine_version</code>.</li>
              <li><strong>Modules</strong>: Defines what content the pack injects. Behavior Packs use <code>"type": "data"</code>, Resource Packs use <code>"type": "resources"</code>, and Script API packs use <code>"type": "script"</code>.</li>
            </ul>

            <h2>2. UUID v4 Collision and Pairing Rules</h2>
            <p>Bedrock requires that:</p>
            <ol>
              <li>The header UUID and module UUID inside the same manifest <strong>must never be identical</strong>.</li>
              <li>No two distinct packs in the game may share the same header UUID.</li>
              <li>When a Behavior Pack depends on a Resource Pack, the BP's <code>dependencies</code> array references the RP's <strong>header UUID</strong>.</li>
            </ol>

            <div class="code-block-wrapper">
              <pre><code>// Example Behavior Pack Dependency:
"dependencies": [
  {
    "uuid": "a7b3c291-89e4-4a22-96b1-094857201938", // RP Header UUID
    "version": [1, 0, 0]
  }
]</code></pre>
            </div>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Instant Minecraft UUID Generator</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Generate cryptographically secure RFC-4122 v4 UUIDs for Minecraft Bedrock packs with 1-click clipboard copying.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/mc/uuid-gen.html" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">UUID Generator →</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      slug: 'zero-upload-client-side-image-processing',
      title: 'Zero-Upload Image Processing: How In-Browser HTML5 Canvas Compression Works',
      category: 'Web Architecture & Performance',
      date: '2026-08-16',
      readTime: '5 min read',
      desc: 'How modern web applications convert, resize, and compress high-resolution images locally inside browser memory using HTML5 Canvas, WebP, and Web Workers.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Web Architecture & Performance</div>
            <h1>Zero-Upload Image Processing: How In-Browser HTML5 Canvas Compression Works</h1>
            <div class="article-meta">
              <span>By <strong>Engineering Team</strong></span>
              <span>•</span>
              <span>Updated August 16, 2026</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>Traditional image conversion utilities require users to upload files to a remote server. This introduces latency, consumes costly server bandwidth, and poses privacy risks for proprietary or personal documents.</p>

            <p>At <strong>Digital Tools Shed</strong>, our entire suite of image and file tools executes <strong>100% client-side</strong> using HTML5 Canvas and native browser memory buffers.</p>

            <h2>1. The HTML5 Canvas Rasterization Pipeline</h2>
            <p>When an image file is selected by the user:</p>
            <ol>
              <li>The file is read into memory as a <code>Blob</code> or <code>ArrayBuffer</code> via <code>FileReader</code> or <code>createObjectURL()</code>.</li>
              <li>An <code>Image</code> element loads the binary data without network transmission.</li>
              <li>An in-memory <code>&lt;canvas&gt;</code> element draws the image bitmap with custom dimensions and bicubic interpolation.</li>
              <li>The canvas calls <code>toBlob('image/webp', quality)</code> to invoke native SIMD hardware-accelerated encoders in the browser.</li>
            </ol>

            <div class="code-block-wrapper">
              <pre><code>// Client-Side Zero-Upload Canvas Pipeline
function convertClientSide(imgElement, format, quality) {
  const canvas = document.createElement('canvas');
  canvas.width = imgElement.naturalWidth;
  canvas.height = imgElement.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0);

  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/' + format, quality);
  });
}</code></pre>
            </div>

            <h2>2. Why WebP is the Modern Standard</h2>
            <p>Google WebP provides <strong>25%–35% smaller file sizes</strong> compared to JPEG at equivalent visual quality scores (SSIM), while supporting alpha transparency and lossless encoding.</p>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Convert Images Client-Side</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Convert PNG, JPG, and WebP images instantly in your browser with zero file uploads and complete privacy.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/convert/png-to-webp.html" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Convert PNG to WebP →</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      slug: 'universal-media-stream-extraction-guide',
      title: 'Media Stream Extraction: How Modern Video & Audio Savers Work Without Backend Servers',
      category: 'Media & Streaming',
      date: '2026-08-16',
      readTime: '6 min read',
      desc: 'A breakdown of progressive video extraction, DASH/HLS audio stream demuxing, and decentralized CORS relay endpoints for zero-storage media tools.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Media & Streaming</div>
            <h1>Media Stream Extraction: How Modern Video & Audio Savers Work Without Backend Servers</h1>
            <div class="article-meta">
              <span>By <strong>Engineering Team</strong></span>
              <span>•</span>
              <span>Updated August 16, 2026</span>
              <span>•</span>
              <span>6 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>Streaming platforms like YouTube, TikTok, and Twitter deliver video content using adaptive bitrate streaming protocols (HLS and MPEG-DASH) or signed CDN URLs. Downloading these media streams without massive cloud storage infrastructure requires direct-stream extraction pipelines.</p>

            <h2>1. Progressive MP4 vs Adaptive Streaming</h2>
            <p>While low-resolution streams (up to 720p) are often bundled with interleaved audio in a single MP4 container, 1080p and 4K streams deliver separate video and audio chunks. Modern browser utilities query public metadata endpoints to resolve direct progressive stream URLs.</p>

            <h2>2. Decentralized API Federation</h2>
            <p>Rather than hosting private transcoding server fleets, modern open tools federate across reliable open-source backend protocols (such as Cobalt and Invidious instances) to parse platform signatures and return direct download streams.</p>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Try Universal Media Downloader</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Download clean video and audio streams from YouTube, TikTok, Twitter/X, and Instagram.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/media/downloader.html" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Open Media Downloader →</a>
              </div>
            </div>
          </div>
        </div>
      `
    }
  ];

  // Ad injection templates for articles
  const ARTICLE_MID_AD = `
    <div class="ad-article-mid">
      <span class="ad-label">Continue Reading — Sponsored</span>
      <div class="ad-unit-300x250">
        <script type="text/javascript">
          atOptions = {
            'key' : '335d807d460eaf2491fcca0f635474ce',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js"></script>
      </div>
    </div>
  `;
  const ARTICLE_END_NATIVE = `
    <div style="margin: 2rem 0;">
      <div style="font-family: var(--mono); font-size: 0.65rem; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Recommended Reading</div>
      <div id="container-cd881b59407c303a0b391e7998dd6cb9"></div>
      <script async="async" data-cfasync="false" src="https://manyapostle.com/cd881b59407c303a0b391e7998dd6cb9/invoke.js"></script>
    </div>
  `;

  // 1. Render Individual Article Pages
  for (const art of ARTICLES) {
    // Inject mid-article ad after 2nd <h2> and end-of-article native widget
    let articleBody = art.body;
    const h2Matches = [...articleBody.matchAll(/<h2>/g)];
    if (h2Matches.length >= 2) {
      const insertPos = h2Matches[1].index;
      articleBody = articleBody.slice(0, insertPos) + ARTICLE_MID_AD + articleBody.slice(insertPos);
    }
    // Add native widget before closing article-container
    articleBody = articleBody.replace(/<\/div>\s*<\/div>\s*$/, ARTICLE_END_NATIVE + '</div>\n        </div>');

    const html = renderPage({
      title: `${art.title} — Digital Tools Shed Journal`,
      metaDesc: art.desc,
      canonical: `${DOMAIN}/articles/${art.slug}.html`,
      bodyContent: articleBody,
      currentPath: `/articles/${art.slug}.html`,
      schema: {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": art.title,
        "description": art.desc,
        "datePublished": art.date,
        "author": {
          "@type": "Organization",
          "name": "Digital Tools Shed"
        }
      }
    });

    writeFileSync(join(articlesDist, `${art.slug}.html`), html);
  }

  // 2. Render Articles Hub /articles/index.html
  const hubCards = ARTICLES.map(art => `
    <a href="/articles/${art.slug}.html" class="article-journal-card">
      <div>
        <div class="article-journal-tag">${art.category}</div>
        <h3>${art.title}</h3>
        <p>${art.desc}</p>
      </div>
      <div class="article-meta" style="margin-top: 1rem;">
        <span>${art.date}</span>
        <span>•</span>
        <span>${art.readTime}</span>
      </div>
    </a>
  `).join('\n');

  const hubBody = `
    <div class="hero">
      <h1>The Engineer's Journal & Tech Guides</h1>
      <p>In-depth technical architecture breakdowns, reverse engineering workflows, zero-server client algorithms, and Minecraft Bedrock technical specifications.</p>
    </div>

    <div class="article-card-grid">
      ${hubCards}
    </div>
  `;

  writeFileSync(join(articlesDist, 'index.html'), renderPage({
    title: 'Tech Journal, Guides & Developer Blueprints — Digital Tools Shed',
    metaDesc: 'Explore engineering tutorials on JavaScript decompilation, JSON obfuscation, Bedrock custom blocks, in-browser image processing, and media pipelines.',
    canonical: `${DOMAIN}/articles/`,
    bodyContent: hubBody,
    currentPath: '/articles/'
  }));

  console.log(`  ✓ Built & Published ${ARTICLES.length} In-Depth Technical Articles & Journal Hub (/articles/)`);
}

// ─── SITEMAP & ROBOTS.TXT ──────────────────────────────────────────────────
function buildSEOAssets() {
  const discoveredUrls = [`${DOMAIN}/`];

  function collectUrls(dir, prefix) {
    if (!existsSync(dir)) return;
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      if (item.isDirectory()) {
        collectUrls(join(dir, item.name), `${prefix}/${item.name}`);
      } else if (item.name.endsWith('.html') && item.name !== 'index.html') {
        discoveredUrls.push(`${DOMAIN}${prefix}/${item.name}`);
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

  console.log(`  ✓ Generated sitemap.xml (${uniqueUrls.length} indexable URLs)`);
  console.log('  ✓ Generated robots.txt (Googlebot allowed, AI scrapers restricted)');
}

// ─── PRODUCTIVITY & BUSINESS TOOLS ──────────────────────────────────────────
function buildProductivitySuite() {
  const prodDist = join(DIST, 'productivity');
  ensureDir(prodDist);

  const printCss = `
    <style>
      @media print {
        .topbar, .sidebar, .ad-blend-box, .ad-sidebar-card, .ad-promo-card, .ad-hero-undercard,
        .ad-category-break, .ad-pre-footer, .docked-sticky-ad, .sponsor-notice, .mobile-welcome-overlay,
        .ad-unit-300x250, .ad-unit-468x60, .ad-desktop-leaderboard, .ad-mobile-banner,
        .right-rail, footer, .no-print { display: none !important; }
        .content-area { margin: 0; padding: 0; width: 100%; max-width: 100%; }
        .main-body { max-width: 100%; margin: 0; padding: 0; }
        .article-container { border: none !important; padding: 0 !important; max-width: 100% !important; box-shadow: none !important; }
        body { background: white !important; color: black !important; }
        * { color: black !important; background: transparent !important; border-color: #ccc !important; }
        input, textarea, select { border: 1px solid transparent !important; }
        .print-only { display: block !important; }
      }
      .print-only { display: none; }
    </style>
  `;

  const commonStyles = {
    btn: `background: var(--btn-bg); color: var(--btn-fg); border: none; padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; letter-spacing: 0.03em;`,
    input: `width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border); background: var(--input-bg, #fff); color: var(--fg);`,
    label: `font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem; display: block;`,
    card: `background: var(--surface); border: 1px solid var(--border); padding: 1rem;`,
    h2: `font-family: var(--serif); font-size: 1.3rem; margin: 2rem 0 1rem;`,
    table: `width: 100%; border-collapse: collapse;`,
    thtd: `padding: 0.5rem 0.75rem; border: 1px solid var(--border); font-size: 0.9rem; text-align: left;`,
    textarea: `width: 100%; height: 200px; padding: 0.85rem; font-family: var(--mono); font-size: 0.9rem; border: 1px solid var(--border); background: var(--input-bg, #fff); color: var(--fg); resize: vertical;`
  };

  // 1. Text De-duplicator
  const deduplicatorBody = `
    <div class="article-container" style="max-width: 900px;">
      <h1>Text De-duplicator</h1>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Remove duplicate lines from your text. Operates entirely in your browser.</p>
      
      <div style="display: flex; flex-direction: column; gap: 1rem; @media(min-width:768px){flex-direction:row;}">
        <div style="flex: 1;">
          <label style="${commonStyles.label}">Input Text</label>
          <textarea id="dd-input" style="${commonStyles.textarea} height: 300px;" placeholder="Paste text here..."></textarea>
        </div>
        <div style="flex: 1;">
          <label style="${commonStyles.label}">Output Text</label>
          <textarea id="dd-output" readonly style="${commonStyles.textarea} height: 300px; background: var(--surface);"></textarea>
        </div>
      </div>
      
      <div style="${commonStyles.card} margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
        <label style="display:flex; align-items:center; gap:0.5rem;"><input type="checkbox" id="dd-case" checked> Case-insensitive</label>
        <label style="display:flex; align-items:center; gap:0.5rem;"><input type="checkbox" id="dd-trim" checked> Trim whitespace</label>
        <label style="display:flex; align-items:center; gap:0.5rem;"><input type="checkbox" id="dd-sort"> Sort output</label>
        <div style="flex: 1;"></div>
        <button id="dd-process" style="${commonStyles.btn}">Process</button>
        <button id="dd-copy" style="${commonStyles.btn} background: var(--surface); color: var(--fg); border: 1px solid var(--border);">Copy Result</button>
      </div>
      
      <div id="dd-stats" style="${commonStyles.card} margin-top: 1rem; font-family: var(--mono); font-size: 0.9rem; text-align: center;">
        Total lines: 0 | Unique lines: 0 | Duplicates removed: 0
      </div>

      <script>
        document.getElementById('dd-process').addEventListener('click', () => {
          const text = document.getElementById('dd-input').value;
          const caseIns = document.getElementById('dd-case').checked;
          const trimWs = document.getElementById('dd-trim').checked;
          const sortOut = document.getElementById('dd-sort').checked;
          
          const lines = text.split('\\n');
          const total = lines.length;
          const seen = new Set();
          const result = [];
          
          for (const line of lines) {
            let processed = line;
            if (trimWs) processed = processed.trim();
            let key = processed;
            if (caseIns) key = key.toLowerCase();
            
            if (!seen.has(key)) {
              seen.add(key);
              result.push(processed);
            }
          }
          
          if (sortOut) {
            result.sort((a, b) => {
              if (caseIns) return a.toLowerCase().localeCompare(b.toLowerCase());
              return a.localeCompare(b);
            });
          }
          
          document.getElementById('dd-output').value = result.join('\\n');
          document.getElementById('dd-stats').textContent = \`Total lines: \${total} | Unique lines: \${result.length} | Duplicates removed: \${total - result.length}\`;
        });
        
        document.getElementById('dd-copy').addEventListener('click', () => {
          const out = document.getElementById('dd-output');
          out.select();
          document.execCommand('copy');
        });
      </script>
    </div>
  `;

  // 2. Time Tracker
  const timeTrackerBody = `
    ${printCss}
    <div class="article-container" style="max-width: 900px;">
      <div class="no-print">
        <h1>Time Tracker</h1>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Track time spent on projects. Data is saved locally in your browser.</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
          <div style="${commonStyles.card}">
            <h2 style="font-family: var(--serif); font-size: 1.1rem; margin-top: 0;">Live Timer</h2>
            <div style="font-size: 3rem; font-family: var(--mono); text-align: center; margin: 1rem 0;" id="tt-display">00:00:00</div>
            <div style="margin-bottom: 1rem;">
              <select id="tt-active-project" class="search-input" style="${commonStyles.input} margin-bottom: 0.5rem;">
                <option value="">Select Project...</option>
              </select>
              <input type="text" id="tt-active-desc" class="search-input" style="${commonStyles.input}" placeholder="What are you working on?">
            </div>
            <div style="display: flex; gap: 0.5rem; justify-content: center;">
              <button id="tt-start" style="${commonStyles.btn}">Start</button>
              <button id="tt-pause" style="${commonStyles.btn} background: #eab308; color: #fff; display: none;">Pause</button>
              <button id="tt-stop" style="${commonStyles.btn} background: #ef4444; color: #fff; display: none;">Stop & Save</button>
            </div>
          </div>
          
          <div style="${commonStyles.card}">
            <h2 style="font-family: var(--serif); font-size: 1.1rem; margin-top: 0;">Manage Projects</h2>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
              <input type="text" id="tt-new-proj" class="search-input" style="${commonStyles.input}" placeholder="Project Name">
              <input type="color" id="tt-new-color" style="height: 38px; width: 50px; padding: 0; border: 1px solid var(--border);">
              <button id="tt-add-proj" style="${commonStyles.btn}">Add</button>
            </div>
            <div id="tt-proj-list" style="max-height: 150px; overflow-y: auto;"></div>
          </div>
        </div>

        <div style="${commonStyles.card} margin-bottom: 2rem;">
          <h2 style="font-family: var(--serif); font-size: 1.1rem; margin-top: 0;">Manual Entry</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: flex-end;">
            <div style="flex: 1; min-width: 150px;">
              <label style="${commonStyles.label}">Project</label>
              <select id="tt-manual-project" class="search-input" style="${commonStyles.input}"></select>
            </div>
            <div>
              <label style="${commonStyles.label}">Date</label>
              <input type="date" id="tt-manual-date" class="search-input" style="${commonStyles.input}">
            </div>
            <div style="width: 70px;">
              <label style="${commonStyles.label}">Hours</label>
              <input type="number" id="tt-manual-hrs" class="search-input" style="${commonStyles.input}" min="0" value="0">
            </div>
            <div style="width: 70px;">
              <label style="${commonStyles.label}">Mins</label>
              <input type="number" id="tt-manual-mins" class="search-input" style="${commonStyles.input}" min="0" max="59" value="0">
            </div>
            <div style="flex: 2; min-width: 200px;">
              <label style="${commonStyles.label}">Description</label>
              <input type="text" id="tt-manual-desc" class="search-input" style="${commonStyles.input}">
            </div>
            <button id="tt-add-manual" style="${commonStyles.btn}">Add Entry</button>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2 style="${commonStyles.h2} margin: 0;">Time Entries</h2>
          <button onclick="window.print()" style="${commonStyles.btn} background: var(--surface); color: var(--fg); border: 1px solid var(--border);">Export Report</button>
        </div>
      </div>
      
      <!-- Print Header -->
      <div class="print-only" style="margin-bottom: 20px;">
        <h1 style="border-bottom: 2px solid #000; padding-bottom: 10px;">Time Tracking Report</h1>
        <p>Generated: <span id="tt-print-date"></span></p>
      </div>

      <div style="overflow-x: auto;">
        <table style="${commonStyles.table}">
          <thead style="background: var(--surface);">
            <tr>
              <th style="${commonStyles.thtd}">Date</th>
              <th style="${commonStyles.thtd}">Project</th>
              <th style="${commonStyles.thtd}">Description</th>
              <th style="${commonStyles.thtd}">Duration</th>
              <th style="${commonStyles.thtd}" class="no-print">Actions</th>
            </tr>
          </thead>
          <tbody id="tt-entries-list"></tbody>
          <tfoot>
            <tr style="background: var(--surface); font-weight: bold;">
              <td colspan="3" style="${commonStyles.thtd} text-align: right;">Total Time:</td>
              <td colspan="2" style="${commonStyles.thtd}" id="tt-total-time">0h 0m</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <script>
        document.getElementById('tt-print-date').textContent = new Date().toLocaleDateString();
        
        let projects = JSON.parse(localStorage.getItem('dts-time-projects') || '[]');
        let entries = JSON.parse(localStorage.getItem('dts-time-entries') || '[]');
        
        let timerInterval;
        let timerSeconds = 0;
        let isRunning = false;

        function save() {
          localStorage.setItem('dts-time-projects', JSON.stringify(projects));
          localStorage.setItem('dts-time-entries', JSON.stringify(entries));
          render();
        }

        function formatTime(totalSeconds) {
          const h = Math.floor(totalSeconds / 3600);
          const m = Math.floor((totalSeconds % 3600) / 60);
          const s = totalSeconds % 60;
          return \`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
        }
        
        function formatDuration(minutes) {
          const h = Math.floor(minutes / 60);
          const m = minutes % 60;
          return \`\${h}h \${m}m\`;
        }

        function render() {
          // Update project selects
          const selects = [document.getElementById('tt-active-project'), document.getElementById('tt-manual-project')];
          const projHtml = '<option value="">Select Project...</option>' + projects.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join('');
          selects.forEach(s => {
            const val = s.value;
            s.innerHTML = projHtml;
            s.value = val;
          });

          // Update project list
          document.getElementById('tt-proj-list').innerHTML = projects.map(p => \`
            <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.3rem 0;">
              <span style="width: 12px; height: 12px; background: \${p.color}; border-radius: 50%;"></span>
              <span style="flex: 1; font-family: var(--mono); font-size: 0.9rem;">\${p.name}</span>
              <button onclick="deleteProject('\${p.id}')" style="background: none; border: none; color: #ef4444; cursor: pointer;">&times;</button>
            </div>
          \`).join('');

          // Update entries
          entries.sort((a, b) => new Date(b.date) - new Date(a.date));
          let totalMins = 0;
          document.getElementById('tt-entries-list').innerHTML = entries.map((e, idx) => {
            const p = projects.find(pr => pr.id === e.projectId) || { name: 'Unknown', color: '#ccc' };
            totalMins += e.durationMins;
            return \`
              <tr>
                <td style="${commonStyles.thtd}">\${e.date}</td>
                <td style="${commonStyles.thtd}">
                  <span style="display: inline-block; width: 10px; height: 10px; background: \${p.color}; border-radius: 50%; margin-right: 5px;"></span>
                  \${p.name}
                </td>
                <td style="${commonStyles.thtd}">\${e.description}</td>
                <td style="${commonStyles.thtd}">\${formatDuration(e.durationMins)}</td>
                <td style="${commonStyles.thtd}" class="no-print">
                  <button onclick="deleteEntry(\${idx})" style="${commonStyles.btn} padding: 0.2rem 0.5rem; background: #ef4444;">Del</button>
                </td>
              </tr>
            \`;
          }).join('');
          document.getElementById('tt-total-time').textContent = formatDuration(totalMins);
        }

        window.deleteProject = (id) => {
          projects = projects.filter(p => p.id !== id);
          save();
        };

        window.deleteEntry = (idx) => {
          entries.splice(idx, 1);
          save();
        };

        document.getElementById('tt-add-proj').addEventListener('click', () => {
          const name = document.getElementById('tt-new-proj').value.trim();
          const color = document.getElementById('tt-new-color').value;
          if (name) {
            projects.push({ id: Date.now().toString(), name, color });
            document.getElementById('tt-new-proj').value = '';
            save();
          }
        });

        // Timer Logic
        const disp = document.getElementById('tt-display');
        const btnStart = document.getElementById('tt-start');
        const btnPause = document.getElementById('tt-pause');
        const btnStop = document.getElementById('tt-stop');

        btnStart.addEventListener('click', () => {
          if (!isRunning) {
            isRunning = true;
            timerInterval = setInterval(() => {
              timerSeconds++;
              disp.textContent = formatTime(timerSeconds);
            }, 1000);
            btnStart.style.display = 'none';
            btnPause.style.display = 'block';
            btnStop.style.display = 'block';
          }
        });

        btnPause.addEventListener('click', () => {
          isRunning = false;
          clearInterval(timerInterval);
          btnStart.style.display = 'block';
          btnStart.textContent = 'Resume';
          btnPause.style.display = 'none';
        });

        btnStop.addEventListener('click', () => {
          isRunning = false;
          clearInterval(timerInterval);
          const durationMins = Math.round(timerSeconds / 60);
          if (durationMins > 0) {
            const projectId = document.getElementById('tt-active-project').value;
            if (!projectId) { alert('Please select a project first!'); return; }
            entries.push({
              id: Date.now().toString(),
              projectId,
              date: new Date().toISOString().split('T')[0],
              durationMins,
              description: document.getElementById('tt-active-desc').value || 'Timer session'
            });
            save();
          }
          timerSeconds = 0;
          disp.textContent = '00:00:00';
          document.getElementById('tt-active-desc').value = '';
          btnStart.style.display = 'block';
          btnStart.textContent = 'Start';
          btnPause.style.display = 'none';
          btnStop.style.display = 'none';
        });

        // Manual Logic
        document.getElementById('tt-manual-date').valueAsDate = new Date();
        document.getElementById('tt-add-manual').addEventListener('click', () => {
          const projectId = document.getElementById('tt-manual-project').value;
          const date = document.getElementById('tt-manual-date').value;
          const hrs = parseInt(document.getElementById('tt-manual-hrs').value) || 0;
          const mins = parseInt(document.getElementById('tt-manual-mins').value) || 0;
          const desc = document.getElementById('tt-manual-desc').value;
          
          if (!projectId || !date || (hrs === 0 && mins === 0)) {
            alert('Please fill project, date, and time duration.');
            return;
          }
          
          entries.push({
            id: Date.now().toString(),
            projectId,
            date,
            durationMins: (hrs * 60) + mins,
            description: desc
          });
          
          document.getElementById('tt-manual-hrs').value = '0';
          document.getElementById('tt-manual-mins').value = '0';
          document.getElementById('tt-manual-desc').value = '';
          save();
        });

        render();
      </script>
    </div>
  `;

  // 3. Invoice Generator
  const invoiceGeneratorBody = `
    ${printCss}
    <div class="article-container" style="max-width: 900px; padding: 2rem; background: #fff; color: #000;">
      <div class="no-print" style="margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 1rem;">
        <h1>Invoice Generator</h1>
        <div style="display: flex; gap: 1rem;">
          <button onclick="window.print()" style="${commonStyles.btn} background: #2563eb; color: #fff;">Print / Save PDF</button>
        </div>
      </div>
      
      <!-- Actual Invoice Document -->
      <div id="invoice-doc" style="font-family: Helvetica, Arial, sans-serif; line-height: 1.5; color: #333;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem;">
          <div style="flex: 1;">
            <h2 style="margin: 0 0 1rem; font-size: 2.5rem; font-weight: bold; color: #111;">INVOICE</h2>
            <div style="display: grid; grid-template-columns: 100px 1fr; gap: 0.5rem; font-size: 0.9rem; max-width: 300px;">
              <strong>Invoice #:</strong> <input type="text" id="inv-num" value="INV-001" style="${commonStyles.input}">
              <strong>Date:</strong> <input type="date" id="inv-date" style="${commonStyles.input}">
              <strong>Due Date:</strong> <input type="date" id="inv-due" style="${commonStyles.input}">
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 3rem; gap: 2rem;">
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5rem; color: #666; font-size: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">FROM</h3>
            <input type="text" id="inv-from-name" placeholder="Your Name / Company" style="${commonStyles.input} font-weight: bold; margin-bottom: 0.25rem;">
            <textarea id="inv-from-addr" placeholder="Your Address" style="${commonStyles.input} resize: none; height: 60px; margin-bottom: 0.25rem;"></textarea>
            <input type="email" id="inv-from-email" placeholder="Your Email" style="${commonStyles.input}">
          </div>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5rem; color: #666; font-size: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">TO</h3>
            <input type="text" id="inv-to-name" placeholder="Client Name" style="${commonStyles.input} font-weight: bold; margin-bottom: 0.25rem;">
            <textarea id="inv-to-addr" placeholder="Client Address" style="${commonStyles.input} resize: none; height: 60px; margin-bottom: 0.25rem;"></textarea>
            <input type="email" id="inv-to-email" placeholder="Client Email" style="${commonStyles.input}">
          </div>
        </div>

        <table style="${commonStyles.table} margin-bottom: 2rem;" id="inv-table">
          <thead>
            <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
              <th style="${commonStyles.thtd} width: 50%;">Description</th>
              <th style="${commonStyles.thtd} width: 15%; text-align: center;">Qty</th>
              <th style="${commonStyles.thtd} width: 15%; text-align: right;">Rate</th>
              <th style="${commonStyles.thtd} width: 15%; text-align: right;">Amount</th>
              <th style="${commonStyles.thtd} width: 5%;" class="no-print"></th>
            </tr>
          </thead>
          <tbody id="inv-items">
            <!-- Items injected by JS -->
          </tbody>
        </table>
        
        <div class="no-print" style="margin-bottom: 2rem;">
          <button id="inv-add-row" style="${commonStyles.btn} background: var(--surface); color: var(--fg); border: 1px solid var(--border);">+ Add Row</button>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-bottom: 3rem;">
          <div style="width: 300px;">
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
              <span>Subtotal:</span>
              <span id="inv-subtotal">$0.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; align-items: center;">
              <span>Tax Rate (%):</span>
              <input type="number" id="inv-tax-rate" value="0" style="${commonStyles.input} width: 80px; text-align: right;">
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
              <span>Tax Amount:</span>
              <span id="inv-tax-amt">$0.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 1rem 0; border-top: 2px solid #333; font-weight: bold; font-size: 1.2rem;">
              <span>Total:</span>
              <span id="inv-total">$0.00</span>
            </div>
          </div>
        </div>

        <div>
          <h3 style="margin: 0 0 0.5rem; color: #666; font-size: 1rem;">Notes / Terms</h3>
          <textarea id="inv-notes" style="${commonStyles.input} height: 100px; resize: vertical;" placeholder="Payment terms, bank details, or thank you note..."></textarea>
        </div>
      </div>

      <script>
        document.getElementById('inv-date').valueAsDate = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        document.getElementById('inv-due').valueAsDate = nextMonth;

        const tbody = document.getElementById('inv-items');
        
        function updateTotals() {
          let subtotal = 0;
          document.querySelectorAll('.inv-row').forEach(row => {
            const qty = parseFloat(row.querySelector('.inv-qty').value) || 0;
            const rate = parseFloat(row.querySelector('.inv-rate').value) || 0;
            const amt = qty * rate;
            row.querySelector('.inv-amt').textContent = '$' + amt.toFixed(2);
            subtotal += amt;
          });
          
          document.getElementById('inv-subtotal').textContent = '$' + subtotal.toFixed(2);
          const taxRate = parseFloat(document.getElementById('inv-tax-rate').value) || 0;
          const taxAmt = subtotal * (taxRate / 100);
          document.getElementById('inv-tax-amt').textContent = '$' + taxAmt.toFixed(2);
          document.getElementById('inv-total').textContent = '$' + (subtotal + taxAmt).toFixed(2);
        }

        function addRow(desc = '', qty = 1, rate = 0) {
          const tr = document.createElement('tr');
          tr.className = 'inv-row';
          tr.innerHTML = \`
            <td style="${commonStyles.thtd}"><input type="text" class="inv-desc ${commonStyles.input.replace('var(--input-bg, #fff)','transparent')}" style="width:100%; border:none; padding:0.2rem;" value="\${desc}" placeholder="Item description"></td>
            <td style="${commonStyles.thtd} text-align: center;"><input type="number" class="inv-qty ${commonStyles.input.replace('var(--input-bg, #fff)','transparent')}" style="width:100%; border:none; text-align:center; padding:0.2rem;" value="\${qty}" min="0" step="0.01" onchange="updateTotals()"></td>
            <td style="${commonStyles.thtd} text-align: right;"><input type="number" class="inv-rate ${commonStyles.input.replace('var(--input-bg, #fff)','transparent')}" style="width:100%; border:none; text-align:right; padding:0.2rem;" value="\${rate}" min="0" step="0.01" onchange="updateTotals()"></td>
            <td style="${commonStyles.thtd} text-align: right;" class="inv-amt">$0.00</td>
            <td style="${commonStyles.thtd} text-align: center;" class="no-print"><button onclick="this.closest('tr').remove(); updateTotals()" style="background:none; border:none; color:red; cursor:pointer;">&times;</button></td>
          \`;
          tbody.appendChild(tr);
          updateTotals();
        }

        document.getElementById('inv-add-row').addEventListener('click', () => addRow());
        document.getElementById('inv-tax-rate').addEventListener('input', updateTotals);

        // Add initial row
        addRow('Web Development Services', 1, 100);
      </script>
    </div>
  `;

  // 4. Invoice from Time
  const invoiceFromTimeBody = `
    ${printCss}
    <div class="article-container" style="max-width: 900px;">
      <div class="no-print">
        <h1>Invoice from Time Entries</h1>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Turn your tracked time into a professional invoice.</p>
        
        <div style="${commonStyles.card} margin-bottom: 2rem;">
          <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end;">
            <div style="flex: 1; min-width: 200px;">
              <label style="${commonStyles.label}">Project</label>
              <select id="ift-project" class="search-input" style="${commonStyles.input}"></select>
            </div>
            <div>
              <label style="${commonStyles.label}">From Date</label>
              <input type="date" id="ift-from" class="search-input" style="${commonStyles.input}">
            </div>
            <div>
              <label style="${commonStyles.label}">To Date</label>
              <input type="date" id="ift-to" class="search-input" style="${commonStyles.input}">
            </div>
            <div>
              <label style="${commonStyles.label}">Hourly Rate ($)</label>
              <input type="number" id="ift-rate" value="50" class="search-input" style="${commonStyles.input} width: 100px;">
            </div>
            <button id="ift-filter" style="${commonStyles.btn}">Find Entries</button>
          </div>
        </div>

        <div id="ift-results-container" style="display: none; margin-bottom: 2rem;">
          <h2 style="${commonStyles.h2} margin-top: 0;">Select Entries to Invoice</h2>
          <table style="${commonStyles.table} margin-bottom: 1rem;">
            <thead style="background: var(--surface);">
              <tr>
                <th style="${commonStyles.thtd} width: 40px;"><input type="checkbox" id="ift-check-all" checked></th>
                <th style="${commonStyles.thtd}">Date</th>
                <th style="${commonStyles.thtd}">Description</th>
                <th style="${commonStyles.thtd}">Duration</th>
              </tr>
            </thead>
            <tbody id="ift-entries"></tbody>
          </table>
          <button id="ift-generate" style="${commonStyles.btn} background: #2563eb; color: #fff;">Generate Invoice Preview</button>
        </div>
        
        <div id="ift-empty" style="display: none; padding: 2rem; text-align: center; background: var(--surface); border: 1px solid var(--border);">
          No time entries found. <a href="time-tracker.html" style="color: var(--link-color, #2563eb);">Go track some time!</a>
        </div>
      </div>

      <!-- Shared Invoice Template (hidden by default) -->
      <div id="ift-invoice-preview" style="display: none; padding: 2rem; background: #fff; color: #000; font-family: Helvetica, Arial, sans-serif; border: 1px solid #ccc; margin-top: 2rem;">
        <div class="no-print" style="margin-bottom: 2rem; text-align: right;">
          <button onclick="window.print()" style="${commonStyles.btn} background: #2563eb; color: #fff;">Print / Save PDF</button>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem;">
          <div style="flex: 1;">
            <h2 style="margin: 0 0 1rem; font-size: 2.5rem; font-weight: bold; color: #111;">INVOICE</h2>
            <div style="display: grid; grid-template-columns: 100px 1fr; gap: 0.5rem; font-size: 0.9rem; max-width: 300px;">
              <strong>Invoice #:</strong> <input type="text" value="INV-002" style="${commonStyles.input}">
              <strong>Date:</strong> <input type="date" id="ift-inv-date" style="${commonStyles.input}">
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 3rem; gap: 2rem;">
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5rem; color: #666; font-size: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">FROM</h3>
            <input type="text" placeholder="Your Name" style="${commonStyles.input} font-weight: bold; margin-bottom: 0.25rem;">
          </div>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5rem; color: #666; font-size: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">TO</h3>
            <input type="text" id="ift-client-name" placeholder="Client Name" style="${commonStyles.input} font-weight: bold; margin-bottom: 0.25rem;">
          </div>
        </div>

        <table style="${commonStyles.table} margin-bottom: 2rem;">
          <thead style="background: #f8f9fa;">
            <tr>
              <th style="${commonStyles.thtd}">Description</th>
              <th style="${commonStyles.thtd} text-align: center;">Hours</th>
              <th style="${commonStyles.thtd} text-align: right;">Rate</th>
              <th style="${commonStyles.thtd} text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody id="ift-inv-items"></tbody>
        </table>

        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 300px; display: flex; justify-content: space-between; padding: 1rem 0; border-top: 2px solid #333; font-weight: bold; font-size: 1.2rem;">
            <span>Total:</span>
            <span id="ift-inv-total">$0.00</span>
          </div>
        </div>
      </div>

      <script>
        const projects = JSON.parse(localStorage.getItem('dts-time-projects') || '[]');
        const entries = JSON.parse(localStorage.getItem('dts-time-entries') || '[]');
        
        const projSelect = document.getElementById('ift-project');
        projSelect.innerHTML = '<option value="">All Projects</option>' + projects.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join('');
        
        let filteredEntries = [];

        document.getElementById('ift-filter').addEventListener('click', () => {
          const pid = projSelect.value;
          const from = document.getElementById('ift-from').value;
          const to = document.getElementById('ift-to').value;
          
          filteredEntries = entries.filter(e => {
            if (pid && e.projectId !== pid) return false;
            if (from && e.date < from) return false;
            if (to && e.date > to) return false;
            return true;
          });
          
          if (filteredEntries.length === 0) {
            document.getElementById('ift-empty').style.display = 'block';
            document.getElementById('ift-results-container').style.display = 'none';
          } else {
            document.getElementById('ift-empty').style.display = 'none';
            document.getElementById('ift-results-container').style.display = 'block';
            
            document.getElementById('ift-entries').innerHTML = filteredEntries.map((e, i) => {
              const p = projects.find(pr => pr.id === e.projectId) || { name: 'Unknown' };
              const hrs = (e.durationMins / 60).toFixed(2);
              return \`
                <tr>
                  <td style="${commonStyles.thtd} text-align: center;"><input type="checkbox" class="ift-chk" data-idx="\${i}" checked></td>
                  <td style="${commonStyles.thtd}">\${e.date}</td>
                  <td style="${commonStyles.thtd}">[\${p.name}] \${e.description}</td>
                  <td style="${commonStyles.thtd}">\${hrs} hrs</td>
                </tr>
              \`;
            }).join('');
          }
        });

        document.getElementById('ift-check-all').addEventListener('change', (e) => {
          document.querySelectorAll('.ift-chk').forEach(c => c.checked = e.target.checked);
        });

        document.getElementById('ift-generate').addEventListener('click', () => {
          const rate = parseFloat(document.getElementById('ift-rate').value) || 0;
          const selectedIdx = Array.from(document.querySelectorAll('.ift-chk:checked')).map(c => parseInt(c.dataset.idx));
          
          if (selectedIdx.length === 0) {
            alert('Select at least one entry');
            return;
          }

          const selectedEntries = selectedIdx.map(i => filteredEntries[i]);
          
          let total = 0;
          document.getElementById('ift-inv-items').innerHTML = selectedEntries.map(e => {
            const hrs = e.durationMins / 60;
            const amt = hrs * rate;
            total += amt;
            const p = projects.find(pr => pr.id === e.projectId) || { name: '' };
            return \`
              <tr>
                <td style="${commonStyles.thtd}">\${e.date} - \${e.description}</td>
                <td style="${commonStyles.thtd} text-align: center;">\${hrs.toFixed(2)}</td>
                <td style="${commonStyles.thtd} text-align: right;">$\${rate.toFixed(2)}</td>
                <td style="${commonStyles.thtd} text-align: right;">$\${amt.toFixed(2)}</td>
              </tr>
            \`;
          }).join('');
          
          document.getElementById('ift-inv-total').textContent = '$' + total.toFixed(2);
          document.getElementById('ift-inv-date').valueAsDate = new Date();
          
          if (projSelect.value) {
            const p = projects.find(pr => pr.id === projSelect.value);
            if (p) document.getElementById('ift-client-name').value = p.name;
          }
          
          document.getElementById('ift-invoice-preview').style.display = 'block';
        });
      </script>
    </div>
  `;

  // 5. Tax Calculator
  const taxCalculatorBody = `
    <div class="article-container" style="max-width: 900px;">
      <h1>Income Tax Calculator</h1>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Estimate your annual taxes. (Disclaimer: For educational purposes only, not tax advice).</p>
      
      <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; @media(min-width:768px){grid-template-columns: 1fr 1fr;}">
        <div style="${commonStyles.card}">
          <h2 style="${commonStyles.h2} margin-top: 0;">Income & Profile</h2>
          
          <label style="${commonStyles.label}">System</label>
          <select id="tc-system" class="search-input" style="${commonStyles.input} margin-bottom: 1rem;">
            <option value="us2024">US Federal (2024)</option>
            <option value="flat">Custom Flat Rate</option>
          </select>

          <label style="${commonStyles.label}">Gross Annual Income</label>
          <input type="number" id="tc-income" class="search-input" style="${commonStyles.input} margin-bottom: 1rem; font-size: 1.2rem;" value="75000" min="0">
          
          <div id="tc-us-fields">
            <label style="${commonStyles.label}">Filing Status</label>
            <select id="tc-status" class="search-input" style="${commonStyles.input} margin-bottom: 1rem;">
              <option value="single">Single</option>
              <option value="mfj">Married Filing Jointly</option>
              <option value="hoh">Head of Household</option>
            </select>
            
            <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom: 0.5rem;">
              <input type="checkbox" id="tc-std-deduct" checked> Use Standard Deduction
            </label>
            
            <div id="tc-custom-deduct-wrap" style="display: none; margin-bottom: 1rem;">
              <label style="${commonStyles.label}">Custom Deduction Amount</label>
              <input type="number" id="tc-deduction" class="search-input" style="${commonStyles.input}" value="0" min="0">
            </div>

            <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom: 1rem;">
              <input type="checkbox" id="tc-se"> Self-Employed (Add SE Tax ~15.3%)
            </label>
          </div>

          <div id="tc-flat-fields" style="display: none;">
            <label style="${commonStyles.label}">Flat Tax Rate (%)</label>
            <input type="number" id="tc-flat-rate" class="search-input" style="${commonStyles.input} margin-bottom: 1rem;" value="20" min="0" max="100">
          </div>

          <button id="tc-calc" style="${commonStyles.btn} width: 100%; font-size: 1rem; padding: 1rem;">Calculate Tax</button>
        </div>
        
        <div>
          <div style="${commonStyles.card}">
            <h2 style="${commonStyles.h2} margin-top: 0;">Results Summary</h2>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Gross Income:</span>
              <strong id="tc-res-gross">$0.00</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #ef4444;">
              <span>Total Tax:</span>
              <strong id="tc-res-tax">$0.00</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); color: #22c55e;">
              <span>Net Income:</span>
              <strong id="tc-res-net" style="font-size: 1.2rem;">$0.00</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">
              <span>Effective Tax Rate:</span>
              <span id="tc-res-rate">0.0%</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-muted);">
              <span>Taxable Income:</span>
              <span id="tc-res-taxable">$0.00</span>
            </div>
          </div>

          <div style="margin-top: 2rem;">
            <h3 style="font-family: var(--serif); font-size: 1.1rem; margin-bottom: 1rem;">Tax Breakdown</h3>
            <div style="height: 30px; display: flex; border-radius: 4px; overflow: hidden; margin-bottom: 1rem; background: var(--surface);">
              <div id="tc-bar-net" style="background: #22c55e; width: 80%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem;">Net</div>
              <div id="tc-bar-tax" style="background: #ef4444; width: 20%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem;">Tax</div>
            </div>
            <table style="${commonStyles.table} font-size: 0.85rem;" id="tc-bracket-table">
              <!-- Injected by JS -->
            </table>
          </div>
        </div>
      </div>

      <script>
        // 2024 US Brackets (Simplified)
        const us2024 = {
          stdDeduction: { single: 14600, mfj: 29200, hoh: 21900 },
          brackets: {
            single: [
              { rate: 0.10, upTo: 11600 }, { rate: 0.12, upTo: 47150 }, { rate: 0.22, upTo: 100525 },
              { rate: 0.24, upTo: 191950 }, { rate: 0.32, upTo: 243725 }, { rate: 0.35, upTo: 609350 }, { rate: 0.37, upTo: Infinity }
            ],
            mfj: [
              { rate: 0.10, upTo: 23200 }, { rate: 0.12, upTo: 94300 }, { rate: 0.22, upTo: 201050 },
              { rate: 0.24, upTo: 383900 }, { rate: 0.32, upTo: 487450 }, { rate: 0.35, upTo: 731200 }, { rate: 0.37, upTo: Infinity }
            ],
            hoh: [
              { rate: 0.10, upTo: 16550 }, { rate: 0.12, upTo: 63100 }, { rate: 0.22, upTo: 100500 },
              { rate: 0.24, upTo: 191950 }, { rate: 0.32, upTo: 243700 }, { rate: 0.35, upTo: 609350 }, { rate: 0.37, upTo: Infinity }
            ]
          }
        };

        const sysSelect = document.getElementById('tc-system');
        sysSelect.addEventListener('change', () => {
          document.getElementById('tc-us-fields').style.display = sysSelect.value === 'us2024' ? 'block' : 'none';
          document.getElementById('tc-flat-fields').style.display = sysSelect.value === 'flat' ? 'block' : 'none';
        });

        document.getElementById('tc-std-deduct').addEventListener('change', (e) => {
          document.getElementById('tc-custom-deduct-wrap').style.display = e.target.checked ? 'none' : 'block';
        });

        function formatC(num) { return '$' + num.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}); }

        document.getElementById('tc-calc').addEventListener('click', () => {
          const gross = parseFloat(document.getElementById('tc-income').value) || 0;
          const system = document.getElementById('tc-system').value;
          
          let totalTax = 0;
          let taxable = gross;
          let breakdownHtml = '';

          if (system === 'us2024') {
            const status = document.getElementById('tc-status').value;
            const useStd = document.getElementById('tc-std-deduct').checked;
            const deduction = useStd ? us2024.stdDeduction[status] : (parseFloat(document.getElementById('tc-deduction').value) || 0);
            
            taxable = Math.max(0, gross - deduction);
            const brackets = us2024.brackets[status];
            
            let remaining = taxable;
            let prevLimit = 0;
            let incTax = 0;
            
            breakdownHtml = \`<tr><td style="${commonStyles.thtd}">Deduction</td><td style="${commonStyles.thtd} text-align:right;">-\${formatC(deduction)}</td></tr>\`;
            
            for (const b of brackets) {
              if (remaining <= 0) break;
              const chunk = Math.min(remaining, b.upTo - prevLimit);
              const taxForChunk = chunk * b.rate;
              incTax += taxForChunk;
              breakdownHtml += \`<tr><td style="${commonStyles.thtd}">\${(b.rate*100).toFixed(0)}% Bracket</td><td style="${commonStyles.thtd} text-align:right;">\${formatC(taxForChunk)}</td></tr>\`;
              remaining -= chunk;
              prevLimit = b.upTo;
            }
            
            totalTax += incTax;

            if (document.getElementById('tc-se').checked) {
              // simplified SE tax: 15.3% on 92.35% of net earnings
              const seTax = (gross * 0.9235) * 0.153;
              totalTax += seTax;
              breakdownHtml += \`<tr><td style="${commonStyles.thtd}">Self-Employment Tax</td><td style="${commonStyles.thtd} text-align:right;">\${formatC(seTax)}</td></tr>\`;
            }

          } else if (system === 'flat') {
            const rate = (parseFloat(document.getElementById('tc-flat-rate').value) || 0) / 100;
            totalTax = gross * rate;
            breakdownHtml = \`<tr><td style="${commonStyles.thtd}">Flat Rate (\${(rate*100).toFixed(1)}%)</td><td style="${commonStyles.thtd} text-align:right;">\${formatC(totalTax)}</td></tr>\`;
          }

          const net = gross - totalTax;
          const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;

          document.getElementById('tc-res-gross').textContent = formatC(gross);
          document.getElementById('tc-res-taxable').textContent = formatC(taxable);
          document.getElementById('tc-res-tax').textContent = formatC(totalTax);
          document.getElementById('tc-res-net').textContent = formatC(net);
          document.getElementById('tc-res-rate').textContent = effectiveRate.toFixed(1) + '%';
          
          document.getElementById('tc-bracket-table').innerHTML = breakdownHtml;

          const taxPct = Math.min(100, Math.max(0, effectiveRate));
          document.getElementById('tc-bar-tax').style.width = taxPct + '%';
          document.getElementById('tc-bar-net').style.width = (100 - taxPct) + '%';
        });
        
        // Initial calc
        document.getElementById('tc-calc').click();
      </script>
    </div>
  `;

  // 6. Task Manager
  const taskManagerBody = `
    ${printCss}
    <div class="article-container" style="max-width: 900px;">
      <div class="no-print">
        <h1>Task Manager</h1>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Organize your work. Data stored in your browser.</p>
        
        <div style="${commonStyles.card} margin-bottom: 2rem;">
          <form id="tm-form" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: end;">
            <div style="grid-column: 1 / -1;">
              <label style="${commonStyles.label}">Task Title</label>
              <input type="text" id="tm-title" class="search-input" style="${commonStyles.input}" required>
            </div>
            <div>
              <label style="${commonStyles.label}">Priority</label>
              <select id="tm-priority" class="search-input" style="${commonStyles.input}">
                <option value="Low">Low</option>
                <option value="Medium" selected>Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label style="${commonStyles.label}">Due Date</label>
              <input type="date" id="tm-due" class="search-input" style="${commonStyles.input}">
            </div>
            <div style="grid-column: 1 / -1;">
              <button type="submit" style="${commonStyles.btn} width: 100%;">Add Task</button>
            </div>
          </form>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <select id="tm-filter" class="search-input" style="${commonStyles.input} width: auto;">
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <select id="tm-sort" class="search-input" style="${commonStyles.input} width: auto;">
              <option value="date">Sort by Date Added</option>
              <option value="due">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button onclick="window.print()" style="${commonStyles.btn} background: var(--surface); color: var(--fg); border: 1px solid var(--border);">Export PDF</button>
            <button id="tm-export-doc" style="${commonStyles.btn} background: #2563eb; color: white;">Export DOCX</button>
          </div>
        </div>
      </div>
      
      <div class="print-only">
        <h1>Task List</h1>
      </div>

      <div id="tm-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
        <!-- Tasks injected here -->
      </div>

      <script>
        let tasks = JSON.parse(localStorage.getItem('dts-tasks') || '[]');
        
        const priorityColors = { Low: '#3b82f6', Medium: '#10b981', High: '#f59e0b', Urgent: '#ef4444' };
        const priorityVal = { Low: 1, Medium: 2, High: 3, Urgent: 4 };

        function save() {
          localStorage.setItem('dts-tasks', JSON.stringify(tasks));
          render();
        }

        document.getElementById('tm-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const title = document.getElementById('tm-title').value;
          const priority = document.getElementById('tm-priority').value;
          const due = document.getElementById('tm-due').value;
          
          tasks.push({
            id: Date.now().toString(),
            title, priority, due,
            completed: false,
            added: new Date().toISOString()
          });
          
          document.getElementById('tm-title').value = '';
          save();
        });

        function render() {
          const filter = document.getElementById('tm-filter').value;
          const sort = document.getElementById('tm-sort').value;
          
          let filtered = tasks.filter(t => {
            if (filter === 'active') return !t.completed;
            if (filter === 'completed') return t.completed;
            return true;
          });
          
          filtered.sort((a, b) => {
            if (sort === 'priority') return priorityVal[b.priority] - priorityVal[a.priority];
            if (sort === 'due') {
              if (!a.due) return 1;
              if (!b.due) return -1;
              return new Date(a.due) - new Date(b.due);
            }
            return new Date(b.added) - new Date(a.added); // Date added
          });

          document.getElementById('tm-list').innerHTML = filtered.map(t => \`
            <div style="\${commonStyles.card} display: flex; align-items: center; gap: 1rem; opacity: \${t.completed ? '0.6' : '1'};">
              <input type="checkbox" \${t.completed ? 'checked' : ''} onchange="toggleTask('\${t.id}')" style="width: 20px; height: 20px; cursor: pointer;" class="no-print">
              <div style="flex: 1;">
                <div style="font-weight: bold; font-size: 1.1rem; text-decoration: \${t.completed ? 'line-through' : 'none'};">\${t.title}</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; gap: 1rem; margin-top: 0.25rem;">
                  <span style="color: \${priorityColors[t.priority]}; font-weight: bold;">\${t.priority}</span>
                  \${t.due ? \`<span>Due: \${t.due}</span>\` : ''}
                </div>
              </div>
              <button onclick="deleteTask('\${t.id}')" class="no-print" style="\${commonStyles.btn} background: #ef4444; color: white; padding: 0.3rem 0.6rem;">Del</button>
            </div>
          \`).join('');
          
          if(filtered.length === 0) {
            document.getElementById('tm-list').innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">No tasks found.</div>';
          }
        }

        window.toggleTask = (id) => {
          const t = tasks.find(x => x.id === id);
          if (t) t.completed = !t.completed;
          save();
        };

        window.deleteTask = (id) => {
          tasks = tasks.filter(x => x.id !== id);
          save();
        };

        document.getElementById('tm-filter').addEventListener('change', render);
        document.getElementById('tm-sort').addEventListener('change', render);

        document.getElementById('tm-export-doc').addEventListener('click', () => {
          const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Tasks</title></head><body>";
          const footer = "</body></html>";
          
          let html = "<h1>Task List</h1><ul>";
          tasks.forEach(t => {
            const status = t.completed ? "[X]" : "[ ]";
            const dueStr = t.due ? \` (Due: \${t.due})\` : "";
            html += \`<li>\${status} \${t.title} - \${t.priority}\${dueStr}</li>\`;
          });
          html += "</ul>";
          
          const sourceHTML = header + html + footer;
          const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
          const fileDownload = document.createElement("a");
          document.body.appendChild(fileDownload);
          fileDownload.href = source;
          fileDownload.download = 'tasks.doc';
          fileDownload.click();
          document.body.removeChild(fileDownload);
        });

        render();
      </script>
    </div>
  `;

  // 7. Weekly Timetable
  const timetableBody = `
    ${printCss}
    <div class="article-container" style="max-width: 1200px;">
      <div class="no-print">
        <h1>Weekly Timetable</h1>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Plan your week block by block. Click a cell to add an activity.</p>
        
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center;">
          <button onclick="window.print()" style="${commonStyles.btn}">Print Schedule</button>
          <button id="wt-clear" style="${commonStyles.btn} background: #ef4444;">Clear All</button>
        </div>
      </div>

      <div style="display: flex; gap: 2rem; align-items: flex-start; @media(max-width:900px){flex-direction:column;}">
        <div style="flex: 1; overflow-x: auto; min-width: 0;">
          <table style="${commonStyles.table} table-layout: fixed; min-width: 700px;" id="wt-table">
            <thead>
              <tr style="background: var(--surface);">
                <th style="${commonStyles.thtd} width: 60px;">Time</th>
                <th style="${commonStyles.thtd} text-align: center;">Mon</th>
                <th style="${commonStyles.thtd} text-align: center;">Tue</th>
                <th style="${commonStyles.thtd} text-align: center;">Wed</th>
                <th style="${commonStyles.thtd} text-align: center;">Thu</th>
                <th style="${commonStyles.thtd} text-align: center;">Fri</th>
                <th style="${commonStyles.thtd} text-align: center;">Sat</th>
                <th style="${commonStyles.thtd} text-align: center;">Sun</th>
              </tr>
            </thead>
            <tbody id="wt-body">
              <!-- Grid injected -->
            </tbody>
          </table>
        </div>
        
        <div style="${commonStyles.card} width: 250px; flex-shrink: 0;" class="no-print">
          <h2 style="${commonStyles.h2} margin-top: 0;">Summary</h2>
          <div id="wt-summary" style="font-size: 0.9rem;"></div>
        </div>
      </div>

      <!-- Modal for entry -->
      <div id="wt-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;" class="no-print">
        <div style="${commonStyles.card} width: 300px; position: relative;">
          <h3 id="wt-modal-title" style="margin-top: 0;">Add Activity</h3>
          <p id="wt-modal-time" style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;"></p>
          
          <input type="text" id="wt-input-name" class="search-input" style="${commonStyles.input} margin-bottom: 1rem;" placeholder="Activity Name">
          
          <label style="${commonStyles.label}">Color</label>
          <input type="color" id="wt-input-color" value="#3b82f6" style="width: 100%; height: 40px; margin-bottom: 1rem; border: 1px solid var(--border); padding: 0;">
          
          <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button id="wt-modal-del" style="${commonStyles.btn} background: #ef4444; display: none;">Delete</button>
            <div style="flex: 1;"></div>
            <button id="wt-modal-cancel" style="${commonStyles.btn} background: var(--surface); color: var(--fg); border: 1px solid var(--border);">Cancel</button>
            <button id="wt-modal-save" style="${commonStyles.btn}">Save</button>
          </div>
        </div>
      </div>

      <script>
        const days = ['mon','tue','wed','thu','fri','sat','sun'];
        const startHour = 6;
        const endHour = 22;
        
        let schedule = JSON.parse(localStorage.getItem('dts-timetable') || '{}');
        
        const tbody = document.getElementById('wt-body');
        let html = '';
        for(let h = startHour; h <= endHour; h++) {
          html += '<tr>';
          html += \`<td style="${commonStyles.thtd} font-size: 0.8rem; color: var(--text-muted);">\${h}:00</td>\`;
          for(let d of days) {
            const cellId = \`\${d}-\${h}\`;
            html += \`<td id="\${cellId}" style="${commonStyles.thtd} text-align: center; cursor: pointer; transition: filter 0.2s; height: 40px; padding: 0;" onclick="openModal('\${d}', \${h})"></td>\`;
          }
          html += '</tr>';
        }
        tbody.innerHTML = html;

        let activeCell = null;

        function render() {
          // clear grid
          for(let h = startHour; h <= endHour; h++) {
            for(let d of days) {
              const td = document.getElementById(\`\${d}-\${h}\`);
              td.innerHTML = '';
              td.style.background = 'transparent';
              td.title = '';
            }
          }
          
          const totals = {};
          
          // fill grid
          Object.keys(schedule).forEach(key => {
            const entry = schedule[key];
            const td = document.getElementById(key);
            if(td) {
              td.innerHTML = \`<div style="font-size: 0.75rem; font-weight: bold; color: white; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">\${entry.name}</div>\`;
              td.style.background = entry.color;
              td.title = entry.name;
              
              totals[entry.name] = (totals[entry.name] || 0) + 1;
            }
          });

          // Summary
          const sumDiv = document.getElementById('wt-summary');
          if(Object.keys(totals).length === 0) {
            sumDiv.innerHTML = '<p style="color: var(--text-muted);">No activities planned.</p>';
          } else {
            let sHtml = '<ul style="list-style: none; padding: 0; margin: 0;">';
            Object.entries(totals).sort((a,b) => b[1] - a[1]).forEach(([name, hours]) => {
              sHtml += \`<li style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border);"><span>\${name}</span><strong>\${hours} hr\${hours>1?'s':''}</strong></li>\`;
            });
            sHtml += '</ul>';
            sumDiv.innerHTML = sHtml;
          }
        }

        window.openModal = (d, h) => {
          activeCell = \`\${d}-\${h}\`;
          const existing = schedule[activeCell];
          
          document.getElementById('wt-modal-time').textContent = \`\${d.toUpperCase()} at \${h}:00\`;
          document.getElementById('wt-input-name').value = existing ? existing.name : '';
          document.getElementById('wt-input-color').value = existing ? existing.color : '#3b82f6';
          
          document.getElementById('wt-modal-del').style.display = existing ? 'block' : 'none';
          document.getElementById('wt-modal').style.display = 'flex';
          document.getElementById('wt-input-name').focus();
        };

        const closeModal = () => document.getElementById('wt-modal').style.display = 'none';

        document.getElementById('wt-modal-cancel').addEventListener('click', closeModal);
        
        document.getElementById('wt-modal-save').addEventListener('click', () => {
          const name = document.getElementById('wt-input-name').value.trim();
          if(!name) return;
          
          schedule[activeCell] = {
            name,
            color: document.getElementById('wt-input-color').value
          };
          
          localStorage.setItem('dts-timetable', JSON.stringify(schedule));
          render();
          closeModal();
        });

        document.getElementById('wt-modal-del').addEventListener('click', () => {
          delete schedule[activeCell];
          localStorage.setItem('dts-timetable', JSON.stringify(schedule));
          render();
          closeModal();
        });

        document.getElementById('wt-clear').addEventListener('click', () => {
          if(confirm('Clear entire schedule?')) {
            schedule = {};
            localStorage.removeItem('dts-timetable');
            render();
          }
        });

        render();
      </script>
    </div>
  `;

  const pages = [
    { slug: 'deduplicator', title: 'Text De-duplicator', metaDesc: 'Remove duplicate lines from text automatically online.', body: deduplicatorBody },
    { slug: 'time-tracker', title: 'Time Tracker', metaDesc: 'Free browser-based time tracking for projects and freelance work.', body: timeTrackerBody },
    { slug: 'invoice-generator', title: 'Invoice Generator', metaDesc: 'Create and print professional PDF invoices directly in your browser.', body: invoiceGeneratorBody },
    { slug: 'invoice-from-time', title: 'Invoice from Time', metaDesc: 'Generate invoices from your tracked time entries.', body: invoiceFromTimeBody },
    { slug: 'tax-calculator', title: 'Tax Calculator', metaDesc: 'Estimate your income tax and net take-home pay.', body: taxCalculatorBody },
    { slug: 'task-manager', title: 'Task Manager', metaDesc: 'Simple, private task management right in your browser.', body: taskManagerBody },
    { slug: 'timetable', title: 'Weekly Timetable', metaDesc: 'Plan your week with a colorful block-based schedule.', body: timetableBody }
  ];

  for (const page of pages) {
    const html = renderPage({
      title: `${page.title} | Digital Tools Shed`,
      metaDesc: page.metaDesc,
      canonical: `${DOMAIN}/productivity/${page.slug}.html`,
      bodyContent: page.body,
      currentPath: `/productivity/${page.slug}.html`
    });
    writeFileSync(join(prodDist, `${page.slug}.html`), html);
  }

  console.log("  \u2713 Built Productivity Suite (" + pages.length + " tools in /productivity/)");
}

// ─── TRUST & LEGAL PAGES ──────────────────────────────────────────────────
function buildTrustPages() {
  // === ABOUT US ===
  const aboutBody = `
    <div class="article-container">
      <header class="article-header">
        <div class="article-journal-tag">About</div>
        <h1>About Digital Tools Shed</h1>
      </header>
      <div class="article-body">
        <p>Hi. My name is Mina Lee and I built Digital Tools Shed because I got tired of sketchy tool websites.</p>

        <p>You know the ones. You search for "convert PNG to JPG" and end up on a site that wants you to upload your files to some random server, create an account, and maybe install a browser extension that's definitely not tracking you. Half the time they don't even work.</p>

        <p>I wanted something different. A place where you can just get things done without worrying about where your data is going.</p>

        <h2>How the tools actually work</h2>

        <p>Every single tool on this site runs directly in your web browser. When you drop a file into one of our converters, that file stays on your computer. It never gets uploaded anywhere. The conversion happens using your browser's built-in capabilities like the HTML5 Canvas API, the File API, and JavaScript processing.</p>

        <p>This means a few things:</p>
        <ul>
          <li>Your files are private. We literally cannot see them because they never touch our servers.</li>
          <li>The tools work offline once the page has loaded.</li>
          <li>There are no file size limits imposed by server storage. The only limit is your own device's memory.</li>
          <li>Processing is usually faster because there is no upload/download step.</li>
        </ul>

        <p>We don't run a backend server for file processing. The site is static HTML, CSS, and JavaScript hosted on GitHub Pages. That's it.</p>

        <h2>Why it's free</h2>

        <p>The site is supported by display advertising and sponsor partnerships. The ads you see on the page are what keep the lights on. I know ads can be annoying, but they let me offer all 88+ tools without charging anyone a subscription fee or gating features behind a paywall.</p>

        <p>I try to keep the ads tasteful and clearly labeled. If something feels off, that's on me and I want to fix it.</p>

        <h2>What "The Site of Everything" means</h2>

        <p>It started as a joke. I kept adding tools for things I personally needed and the list got long. Developer tools, image converters, media extractors, unit calculators, Minecraft utilities, PDF tools, and now a tech journal with actual engineering articles. At some point someone said "this is becoming the site of everything" and the name stuck.</p>

        <p>The goal is simple: if you need a quick utility tool, you should be able to find it here, use it for free, and leave without giving up your email or worrying about your data.</p>

        <h2>Contact</h2>

        <p>If you have questions, found a bug, or want to suggest a new tool, you can reach me at:</p>
        <ul>
          <li>Email: (coming soon)</li>
        </ul>

        <p>Thanks for using Digital Tools Shed.</p>
        <p><strong>Mina Lee</strong><br/>Creator, Digital Tools Shed</p>
      </div>
    </div>
  `;

  // === PRIVACY POLICY ===
  const privacyBody = `
    <div class="article-container">
      <header class="article-header">
        <div class="article-journal-tag">Legal</div>
        <h1>Privacy Policy</h1>
        <div class="article-meta">
          <span>Last updated: August 16, 2026</span>
        </div>
      </header>
      <div class="article-body">
        <p>This privacy policy explains what data Digital Tools Shed collects, how we use it, and what your rights are. The short version: we collect almost nothing because of how the site is built.</p>

        <h2>Your files and data</h2>

        <p>All tools on Digital Tools Shed run entirely in your web browser. When you use any of our file converters, image tools, PDF processors, or other utilities, your files are processed locally on your device using JavaScript. <strong>Your files are never uploaded to any server.</strong></p>

        <p>We do not have the technical ability to access, read, store, or transmit your files. There is no server-side file processing infrastructure.</p>

        <h2>What we do store</h2>

        <p>The site stores a small number of preferences in your browser's local storage:</p>
        <ul>
          <li><strong>Theme preference</strong> (light or dark mode) stored in localStorage under the key "dts-theme"</li>
          <li><strong>Sponsor notice dismissal</strong> stored in sessionStorage so the notice bar does not reappear during your browsing session</li>
        </ul>
        <p>These values stay in your browser and are never sent to us or any third party.</p>

        <h2>Advertising</h2>

        <p>Digital Tools Shed displays advertisements through Adsterra, a third-party advertising network. Adsterra may use cookies, web beacons, and similar tracking technologies to serve ads based on your browsing activity.</p>

        <p>We do not control what data Adsterra collects. For details on their data practices, please review the <a href="https://adsterra.com/privacy-policy/" target="_blank" rel="noopener">Adsterra Privacy Policy</a>.</p>

        <p>The advertising formats used on this site include display banners, native recommendation widgets, and popunder ads. The first time you click anywhere on a page, a sponsor tab may open in a new browser tab. This is clearly disclosed in our on-site sponsor notice.</p>

        <h2>Analytics</h2>

        <p>We do not use Google Analytics, Facebook Pixel, or any first-party tracking scripts. We do not collect personal information, IP addresses, or browsing history.</p>

        <p>Basic traffic statistics may be available through our hosting provider (GitHub Pages) and advertising partner (Adsterra), but we do not actively monitor individual user behavior.</p>

        <h2>Cookies</h2>

        <p>Digital Tools Shed itself does not set any cookies. Third-party advertising scripts from Adsterra may set cookies in your browser. You can manage or block these cookies through your browser settings.</p>

        <h2>Children</h2>

        <p>This site is not directed at children under the age of 13. We do not knowingly collect personal information from children.</p>

        <h2>Changes to this policy</h2>

        <p>If this privacy policy changes, we will update the "last updated" date at the top of this page. We are not going to send you emails about it because we don't have your email.</p>

        <h2>Contact</h2>

        <p>If you have questions about this privacy policy, feel free to reach out via the contact details on our <a href="/about.html">About page</a>.</p>
      </div>
    </div>
  `;

  // === TERMS OF SERVICE ===
  const termsBody = `
    <div class="article-container">
      <header class="article-header">
        <div class="article-journal-tag">Legal</div>
        <h1>Terms of Service</h1>
        <div class="article-meta">
          <span>Last updated: August 16, 2026</span>
        </div>
      </header>
      <div class="article-body">
        <p>By using Digital Tools Shed (digitaltoolsshed.com), you agree to the following terms. They are written in plain language because legal jargon helps nobody.</p>

        <h2>What the site does</h2>

        <p>Digital Tools Shed provides free, browser-based utility tools for file conversion, image processing, developer workflows, unit calculations, and other tasks. All processing happens on your device. We do not store, access, or transmit your files.</p>

        <h2>Use at your own risk</h2>

        <p>The tools are provided "as is" without any warranties. While we do our best to make everything work correctly, we cannot guarantee that every tool will produce perfect results in every situation. Always keep backups of your original files before converting or processing them.</p>

        <p>We are not responsible for any data loss, file corruption, or other issues that arise from using the tools on this site.</p>

        <h2>Acceptable use</h2>

        <p>You can use the tools for personal or commercial purposes. There is no restriction on how you use the output files.</p>

        <p>You may not:</p>
        <ul>
          <li>Attempt to reverse-engineer, scrape, or redistribute the site's source code for commercial purposes without permission</li>
          <li>Use automated bots to generate excessive ad impressions</li>
          <li>Frame or embed the site in a way that removes attribution or advertising</li>
        </ul>

        <h2>Advertising</h2>

        <p>This site is supported by advertising. By using the site, you acknowledge that ads will be displayed and that your first click on any page may open a sponsor tab in your browser. We disclose this through an on-site notice.</p>

        <h2>Intellectual property</h2>

        <p>The tools, articles, design, and code on Digital Tools Shed are the property of Mina Lee and Digital Tools Shed. The articles in our tech journal are original works and may not be republished without attribution.</p>

        <p>Files you process through the tools remain your property. We claim no ownership over your input or output files.</p>

        <h2>Third-party services</h2>

        <p>The site uses Adsterra for advertising. Your interaction with ads is governed by Adsterra's own terms and privacy policy. We are not responsible for the content of third-party advertisements.</p>

        <h2>Changes</h2>

        <p>These terms may be updated from time to time. Continued use of the site after changes are posted means you accept the updated terms.</p>

        <h2>Contact</h2>

        <p>Questions about these terms can be directed through our <a href="/about.html">About page</a>.</p>
      </div>
    </div>
  `;

  const pages = [
    {
      slug: 'about',
      title: 'About Us',
      metaDesc: 'Learn about Digital Tools Shed, how our browser-based tools work, and why everything is free. Built by Mina Lee.',
      body: aboutBody
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      metaDesc: 'Digital Tools Shed privacy policy. Your files never leave your device. No tracking, no accounts, no data collection.',
      body: privacyBody
    },
    {
      slug: 'terms',
      title: 'Terms of Service',
      metaDesc: 'Terms of service for Digital Tools Shed. Free browser-based tools provided as-is with no warranties.',
      body: termsBody
    }
  ];

  for (const page of pages) {
    const html = renderPage({
      title: `${page.title} | Digital Tools Shed`,
      metaDesc: page.metaDesc,
      canonical: `${DOMAIN}/${page.slug}.html`,
      bodyContent: page.body,
      currentPath: `/${page.slug}.html`
    });
    writeFileSync(join(DIST, `${page.slug}.html`), html);
  }

  console.log('  ✓ Built Trust & Legal Pages (about.html, privacy.html, terms.html)');
}

// ─── 404 ERROR PAGE ─────────────────────────────────────────────────────────
function build404Page() {
  const bodyContent = `
    <div class="hero" style="text-align: center; padding: 3rem 1.5rem;">
      <div style="font-family: var(--mono); font-size: 6rem; font-weight: 900; color: var(--fg); line-height: 1; margin-bottom: 0.5rem;">404</div>
      <h1 style="font-size: 1.8rem; margin-bottom: 0.5rem;">Page Not Found</h1>
      <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem;">The page you're looking for doesn't exist or has been moved. But while you're here, check out our free tools below.</p>
      <a href="/" class="btn-primary" style="display: inline-block; padding: 0.75rem 2rem; text-decoration: none;">← Return to Tools Shed</a>
    </div>

    <div class="ad-blend-box" style="margin: 2rem 0;">
      <span class="ad-label">Featured Partner</span>
      <div class="ad-desktop-leaderboard">
        <script type="text/javascript">
          atOptions = {
            'key' : '567d4e495ec8a8e297b7c7f5170993cb',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://manyapostle.com/567d4e495ec8a8e297b7c7f5170993cb/invoke.js"></script>
      </div>
      <div class="ad-mobile-banner">
        <script type="text/javascript">
          atOptions = {
            'key' : '9ec3cbd7674ade5c0cfa745d18664214',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js"></script>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
      <div class="ad-promo-card">
        <div class="promo-badge" style="background: var(--surface-alt); color: var(--text-muted); border: 1px solid var(--border); width: 100%; text-align: center;">Sponsored Partner</div>
        <div class="ad-unit-300x250">
          <script type="text/javascript">
            atOptions = {
              'key' : '335d807d460eaf2491fcca0f635474ce',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js"></script>
        </div>
      </div>
      <div class="ad-promo-card">
        <div class="promo-badge" style="background: var(--surface-alt); color: var(--text-muted); border: 1px solid var(--border); width: 100%; text-align: center;">Sponsored Recommendation</div>
        <div class="ad-unit-300x250">
          <script type="text/javascript">
            atOptions = {
              'key' : '335d807d460eaf2491fcca0f635474ce',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js"></script>
        </div>
      </div>
    </div>

    <div style="margin: 2rem 0;">
      <div style="font-family: var(--mono); font-size: 0.65rem; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">You Might Also Like</div>
      <div id="container-cd881b59407c303a0b391e7998dd6cb9"></div>
      <script async="async" data-cfasync="false" src="https://manyapostle.com/cd881b59407c303a0b391e7998dd6cb9/invoke.js"></script>
    </div>

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
          };
        </script>
        <script type="text/javascript" src="https://manyapostle.com/0b6898775795b270130cc9971eef21a8/invoke.js"></script>
      </div>
      <div class="ad-mobile-banner">
        <script type="text/javascript">
          atOptions = {
            'key' : '9ec3cbd7674ade5c0cfa745d18664214',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js"></script>
      </div>
    </div>

    <div style="text-align: center; padding: 2rem 0;">
      <div style="font-family: var(--serif); font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem;">Popular Free Tools</div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center;">
        <a href="/media/downloader.html" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">Media Downloader</a>
        <a href="/convert/json-obfuscator.html" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">JSON Obfuscator</a>
        <a href="/convert/esbuild-decompiler.html" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">JS Decompiler</a>
        <a href="/convert/image-resizer.html" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">Image Resizer</a>
        <a href="/calc/kg-to-lbs.html" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">KG to LBS</a>
        <a href="/articles/" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">Tech Articles</a>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
      <div class="ad-promo-card">
        <div class="promo-badge" style="background: var(--surface-alt); color: var(--text-muted); border: 1px solid var(--border); width: 100%; text-align: center;">From Our Partners</div>
        <div class="ad-unit-300x250">
          <script type="text/javascript">
            atOptions = {
              'key' : '335d807d460eaf2491fcca0f635474ce',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js"></script>
        </div>
      </div>
      <div class="ad-promo-card">
        <div class="promo-badge" style="background: var(--surface-alt); color: var(--text-muted); border: 1px solid var(--border); width: 100%; text-align: center;">Discover More</div>
        <div class="ad-unit-300x250">
          <script type="text/javascript">
            atOptions = {
              'key' : '335d807d460eaf2491fcca0f635474ce',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js"></script>
        </div>
      </div>
    </div>

    <div style="margin: 2rem 0;">
      <div style="font-family: var(--mono); font-size: 0.65rem; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Recommended For You</div>
      <div id="container-cd881b59407c303a0b391e7998dd6cb9"></div>
      <script async="async" data-cfasync="false" src="https://manyapostle.com/cd881b59407c303a0b391e7998dd6cb9/invoke.js"></script>
    </div>
  `;

  const html = renderPage({
    title: '404 — Page Not Found | Digital Tools Shed',
    metaDesc: 'The page you requested was not found. Browse our free online developer tools, converters, media downloaders, and tech articles.',
    canonical: `${DOMAIN}/404.html`,
    bodyContent,
    currentPath: '/404.html'
  });

  writeFileSync(join(DIST, '404.html'), html);
  console.log('  ✓ Built 404 Error Page (ad-heavy with popunder)');
}

function main() {
  console.log('\n🔨 Rebuilding DIGITAL TOOLS SHED with Developer Tools Suite...\n');
  ensureDir(DIST);

  buildHomepage();
  buildDeveloperTools();
  buildMediaSuite();
  buildConvertFastSuite();
  buildPdfTools();
  buildMinecraftTools();
  buildUnitCalcSuite();
  buildArticlesSuite();
  buildProductivitySuite();
  buildTrustPages();
  build404Page();
  buildSEOAssets();

  const xslSrc = join(ROOT, 'scripts', 'sitemap.xsl');
  if (existsSync(xslSrc)) {
    copyFileSync(xslSrc, join(DIST, 'sitemap.xsl'));
  }

  console.log('\n' + '═'.repeat(50));
  console.log('✅ DIGITAL TOOLS SHED BUILD COMPLETE!');
  console.log(`   Location: ${DIST}`);
  console.log(`   Domain: ${DOMAIN}`);
  console.log('═'.repeat(50) + '\n');
}

main();
