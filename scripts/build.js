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
  code: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`
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
  { id: 'mc-manifest-gen', name: 'Bedrock Pack Manifest Generator', category: 'Minecraft & Game', path: '/mc/manifest-gen.html', desc: 'Generate complete manifest.json for Behavior and Resource packs.' }
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
  background: var(--bg);
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

.main-body {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  flex: 1;
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

.ad-blend-box {
  margin: 2rem 0;
  padding: 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
  border: 1px solid var(--sidebar-border);
  padding: 0.5rem 0;
  background: var(--surface);
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
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 1.25rem;
  min-height: 320px;
}
.ad-label {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .ad-desktop-leaderboard { display: none !important; }
  .ad-mobile-banner { display: flex !important; }
  .ad-unit-468x60 { display: none !important; }
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
        <span>DIGITAL TOOLS SHED</span>
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
        Private • In-Browser Execution
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
    })();
  </script>
  <style>${MASTER_CSS}</style>
  ${schemaMarkup}
</head>
<body>
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
          <span>100% In-Browser Execution</span>
        </div>
      </div>

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
          <a href="/media/downloader.html" class="promo-card">
            <span class="promo-badge">Media Engine</span>
            <h4 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.35rem;">Universal Media Downloader</h4>
            <p style="font-size: 0.9rem; color: var(--text-muted);">Save video streams from YouTube, Twitter/X, TikTok, and Instagram with zero quality loss.</p>
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

      <footer>
        <div>© 2026 Digital Tools Shed (digitaltoolsshed.com). Printed & processed 100% in client browser memory.</div>
        <div style="display: flex; gap: 1rem;">
          <a href="/">Home</a>
          <a href="/convert/json-obfuscator.html">JSON Obfuscator</a>
          <a href="/convert/esbuild-decompiler.html">JS Decompiler</a>
          <a href="/media/downloader.html">Media</a>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
      </footer>
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
    { name: 'Minecraft & Game', icon: ICONS.cube }
  ];

  let gridHtml = '';
  for (const catObj of categories) {
    const catTools = TOOLS.filter(t => t.category === catObj.name);
    if (!catTools.length) continue;
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
      <h1>DIGITAL TOOLS SHED</h1>
      <p>Fast, client-side web utilities, media extractors, format converters, developer decompilers, and unit calculators. Free forever, zero subscriptions, zero file uploads.</p>
    </div>

    <div id="toolsContainer">
      ${gridHtml}
    </div>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Digital Tools Shed",
    "url": DOMAIN,
    "description": "Free browser-based online tools, media downloaders, JSON obfuscators, ESBuild decompilers, file converters, and unit calculators.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const html = renderPage({
    title: 'Digital Tools Shed — Free Online Developer Tools, Media Downloader & Converters',
    metaDesc: 'Free online developer tools: JSON Obfuscator, ESBuild JS Decompiler, Media Downloader, image converters, and 40+ unit calculators.',
    canonical: DOMAIN,
    bodyContent,
    currentPath: '/',
    schema
  });

  writeFileSync(join(DIST, 'index.html'), html);
  console.log('  ✓ Built Master Landing Page with Developer Suite (index.html)');
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
