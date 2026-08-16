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

// ─── MASTER TOOL REGISTRY ──────────────────────────────────────────────────
const TOOLS = [
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
  { id: 'pdf-to-text', name: 'PDF to Text / DOCX Extractor', category: 'PDF & Docs', path: '/pdf/pdf-to-text.html', desc: 'Extract readable text and document content from PDF files locally.' },
  { id: 'pdf-page-counter', name: 'PDF Page Counter & Inspector', category: 'PDF & Docs', path: '/pdf/page-counter.html', desc: 'Inspect PDF metadata, dimensions, and total page count without uploading.' },

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

// ─── MASTER BRUTALIST B&W CSS ──────────────────────────────────────────────
const MASTER_CSS = `
:root {
  --bg: #000000;
  --fg: #ffffff;
  --surface: #0a0a0a;
  --surface-hover: #141414;
  --border: #222222;
  --border-strong: #ffffff;
  --text-muted: #888888;
  --mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--sans);
  line-height: 1.5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  border-bottom: 2px solid var(--border-strong);
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg);
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  font-family: var(--mono);
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: var(--fg);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.brand-badge {
  background: var(--fg);
  color: var(--bg);
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
}

nav a {
  color: var(--text-muted);
  text-decoration: none;
  font-family: var(--mono);
  font-size: 0.85rem;
  margin-left: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.15s;
}
nav a:hover { color: var(--fg); }

main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.hero {
  padding: 2rem 0 3rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 2.5rem;
}
.hero h1 {
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin-bottom: 1rem;
}
.hero p {
  color: var(--text-muted);
  font-size: 1.15rem;
  max-width: 700px;
  margin-bottom: 1.75rem;
  font-family: var(--sans);
}

.search-wrapper {
  position: relative;
  max-width: 650px;
}
.search-input {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--fg);
  font-family: var(--mono);
  font-size: 1rem;
  padding: 0.9rem 1.25rem;
  outline: none;
  transition: border-color 0.15s;
}
.search-input:focus {
  border-color: var(--border-strong);
}

.category-title {
  font-family: var(--mono);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin: 2.5rem 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.category-title::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--border);
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
  font-family: var(--mono);
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: var(--fg);
}
.tool-card p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.4;
}
.tool-card .tag {
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 1rem;
  display: inline-block;
}

.ad-slot-container {
  margin: 2rem 0;
  padding: 1rem;
  background: var(--surface);
  border: 1px dashed var(--border);
  text-align: center;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.ad-label {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}

.promo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}
.promo-card {
  border: 1px solid var(--border);
  background: #000;
  padding: 1.25rem;
  text-decoration: none;
  color: inherit;
}
.promo-card:hover { border-color: #fff; }
.promo-badge {
  font-family: var(--mono);
  font-size: 0.65rem;
  background: #fff;
  color: #000;
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
  background: #000000;
  transition: border-color 0.15s;
}
.drop-zone:hover { border-color: var(--border-strong); }
.btn-primary {
  background: #ffffff;
  color: #000000;
  border: none;
  padding: 0.8rem 1.5rem;
  font-family: var(--mono);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.btn-primary:hover { background: #e0e0e0; }
.btn-secondary {
  background: transparent;
  color: #ffffff;
  border: 1px solid var(--border);
  padding: 0.8rem 1.5rem;
  font-family: var(--mono);
  font-size: 0.9rem;
  cursor: pointer;
}
.btn-secondary:hover { border-color: #ffffff; }

footer {
  border-top: 1px solid var(--border);
  padding: 2.5rem 2rem;
  background: var(--bg);
  margin-top: auto;
  font-family: var(--mono);
  font-size: 0.85rem;
  color: var(--text-muted);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
footer a { color: var(--fg); text-decoration: none; }
footer a:hover { text-decoration: underline; }

@media (max-width: 768px) {
  header { padding: 1rem; }
  main { padding: 1.5rem 1rem; }
  .tools-grid { grid-template-columns: 1fr; }
}
`;

function renderPage({ title, metaDesc, canonical, bodyContent, schema }) {
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
  <style>${MASTER_CSS}</style>
  ${schemaMarkup}
  <!-- Adsterra Header Container Slot -->
</head>
<body>
  <header>
    <a href="/" class="brand">
      <span>DIGITAL TOOLS SHED</span>
      <span class="brand-badge">PRO</span>
    </a>
    <nav>
      <a href="/#converters">Converters</a>
      <a href="/#calculators">Calculators</a>
      <a href="/#pdf">PDF</a>
      <a href="/#mc">Gaming</a>
    </nav>
  </header>

  <main>
    <div class="ad-slot-container" id="ad-top-banner">
      <span class="ad-label">Advertisement</span>
      <div id="ad-slot-728x90"></div>
    </div>

    ${bodyContent}

    <div class="promo-grid">
      <a href="https://tierspecs.com" target="_blank" class="promo-card">
        <span class="promo-badge">Hardware & Reviews</span>
        <h4 style="font-family: var(--mono); margin-bottom: 0.35rem;">TierSpecs — Tech & Laptop Specs</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Compare GPU tiers, CPU benchmarks, and find authentic hardware performance analysis.</p>
      </a>
      <a href="/convert/json-formatter.html" class="promo-card">
        <span class="promo-badge">Free Developer Tool</span>
        <h4 style="font-family: var(--mono); margin-bottom: 0.35rem;">JSON Formatter & Validator</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Beautify, inspect, and parse complex JSON structures directly in client browser memory.</p>
      </a>
      <a href="/calc/kg-to-lbs.html" class="promo-card">
        <span class="promo-badge">Instant Calculator</span>
        <h4 style="font-family: var(--mono); margin-bottom: 0.35rem;">Unit & Metric Calculators</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Convert weight, distance, temperature, and data measurements with zero delay.</p>
      </a>
    </div>

    <div class="ad-slot-container" id="ad-bottom-banner">
      <span class="ad-label">Advertisement</span>
      <div id="ad-slot-bottom"></div>
    </div>
  </main>

  <footer>
    <div>© 2026 Digital Tools Shed (digitaltoolsshed.com). 100% In-Browser. Zero Server Uploads.</div>
    <div style="display: flex; gap: 1rem;">
      <a href="/">Home</a>
      <a href="/#converters">Converters</a>
      <a href="/#calculators">Calculators</a>
      <a href="/sitemap.xml">Sitemap</a>
    </div>
  </footer>
  <div id="adsterra-social-bar-slot"></div>
</body>
</html>`;
}

function buildHomepage() {
  const categories = [...new Set(TOOLS.map(t => t.category))];

  let gridHtml = '';
  for (const cat of categories) {
    const catTools = TOOLS.filter(t => t.category === cat);
    const catAnchor = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    gridHtml += `<h2 class="category-title" id="${catAnchor}">${cat} Suite (${catTools.length})</h2>\n`;
    gridHtml += `<div class="tools-grid">\n`;
    for (const tool of catTools) {
      gridHtml += `  <a href="${tool.path}" class="tool-card" data-name="${tool.name.toLowerCase()} ${tool.desc.toLowerCase()}">
    <div>
      <h3>${tool.name}</h3>
      <p>${tool.desc}</p>
    </div>
    <span class="tag">→ Open Tool</span>
  </a>\n`;
    }
    gridHtml += `</div>\n`;
  }

  const bodyContent = `
    <div class="hero">
      <h1>DIGITAL TOOLS SHED</h1>
      <p>Fast, client-side web utilities, format converters, and unit calculators. Free forever, zero subscriptions, zero file uploads.</p>
      <div class="search-wrapper">
        <input type="text" id="toolSearch" class="search-input" placeholder="Search 60+ tools (e.g. 'png to jpg', 'kg to lbs', 'pdf', 'uuid')..." autofocus />
      </div>
    </div>

    <div id="toolsContainer">
      ${gridHtml}
    </div>

    <script>
      const searchInput = document.getElementById('toolSearch');
      const cards = document.querySelectorAll('.tool-card');
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        cards.forEach(card => {
          const text = card.getAttribute('data-name');
          if (!query || text.includes(query)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    </script>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Digital Tools Shed",
    "url": DOMAIN,
    "description": "Free browser-based online tools, file converters, unit calculators, and Minecraft Bedrock utilities.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const html = renderPage({
    title: 'Digital Tools Shed — Free Online Converters, PDF & Calculator Tools',
    metaDesc: 'Free client-side digital tools. Convert images (PNG, JPG, WebP), format JSON, calculate units (kg to lbs, Celsius to Fahrenheit), and process PDFs in your browser.',
    canonical: DOMAIN,
    bodyContent,
    schema
  });

  writeFileSync(join(DIST, 'index.html'), html);
  console.log('  ✓ Built Master Landing Page (index.html)');
}

function buildPdfTools() {
  const pdfDir = join(DIST, 'pdf');
  ensureDir(pdfDir);

  const pdfTextBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <a href="/" style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); text-decoration: none;">← Back to Tools Shed</a>
      <h1 style="margin-top: 0.75rem;">PDF to Text & Content Extractor</h1>
      <p>Extract all text content and inspect structure from PDF documents. 100% private, processed in client browser memory.</p>
    </div>

    <div class="tool-workspace">
      <div class="drop-zone" id="pdfDropZone">
        <p style="font-family: var(--mono); font-weight: bold; margin-bottom: 0.5rem;">DRAG & DROP PDF FILE HERE</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">or click to select from your device</p>
        <input type="file" id="pdfFileInput" accept=".pdf" style="display: none;" />
      </div>

      <div id="pdfResult" style="margin-top: 1.5rem; display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-family: var(--mono); font-size: 0.9rem; font-weight: bold;" id="pdfMeta">Extracted Text</span>
          <button class="btn-primary" id="copyBtn">Copy Text</button>
        </div>
        <textarea id="pdfOutput" style="width: 100%; height: 300px; background: #000; color: #fff; border: 1px solid var(--border); font-family: var(--mono); padding: 1rem; font-size: 0.85rem; outline: none;" readonly></textarea>
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
      dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = '#fff'; });
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
    bodyContent: pdfTextBody
  }));

  const pdfInspectorBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <a href="/" style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); text-decoration: none;">← Back to Tools Shed</a>
      <h1 style="margin-top: 0.75rem;">PDF Page Counter & Metadata Inspector</h1>
      <p>Quickly check page count, PDF version, author, and security properties instantly without installing software.</p>
    </div>

    <div class="tool-workspace">
      <div class="drop-zone" id="pdfInspectorDrop">
        <p style="font-family: var(--mono); font-weight: bold; margin-bottom: 0.5rem;">SELECT PDF FILE TO INSPECT</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Drop file or click here</p>
        <input type="file" id="pdfInspectInput" accept=".pdf" style="display: none;" />
      </div>

      <div id="inspectResult" style="margin-top: 1.5rem; display: none;">
        <div style="font-family: var(--mono); border: 1px solid var(--border); padding: 1.5rem; background: #000;">
          <h3 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">PDF Metadata Overview</h3>
          <p style="margin-bottom: 0.5rem;"><strong>Filename:</strong> <span id="metaFileName" style="color: var(--text-muted);"></span></p>
          <p style="margin-bottom: 0.5rem;"><strong>File Size:</strong> <span id="metaFileSize" style="color: var(--text-muted);"></span></p>
          <p style="margin-bottom: 0.5rem;"><strong>Total Pages:</strong> <span id="metaPages" style="font-size: 1.2rem; font-weight: bold; color: #fff;"></span></p>
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
    bodyContent: pdfInspectorBody
  }));

  console.log('  ✓ Built PDF Suite (/pdf/)');
}

function buildMinecraftTools() {
  const mcDir = join(DIST, 'mc');
  ensureDir(mcDir);

  const uuidBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <a href="/" style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); text-decoration: none;">← Back to Tools Shed</a>
      <h1 style="margin-top: 0.75rem;">Minecraft Bedrock UUID Generator</h1>
      <p>Generate RFC4122 v4 UUID pairs specifically formatted for Minecraft Bedrock behavior packs, resource packs, and manifest.json headers.</p>
    </div>

    <div class="tool-workspace">
      <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
        <button class="btn-primary" id="genUuidBtn">Generate New UUIDs</button>
        <button class="btn-secondary" id="copyAllUuid">Copy Header & Module Pair</button>
      </div>

      <div style="font-family: var(--mono); display: grid; gap: 1rem;">
        <div style="border: 1px solid var(--border); padding: 1rem; background: #000;">
          <div style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Header UUID (Pack UUID)</div>
          <div id="headerUuid" style="font-size: 1.1rem; font-weight: bold; margin-top: 0.25rem;"></div>
        </div>
        <div style="border: 1px solid var(--border); padding: 1rem; background: #000;">
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
    bodyContent: uuidBody
  }));

  const manifestBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <a href="/" style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); text-decoration: none;">← Back to Tools Shed</a>
      <h1 style="margin-top: 0.75rem;">Bedrock Manifest.json Generator</h1>
      <p>Quickly generate valid, clean manifest.json files for Minecraft Bedrock Resource Packs and Behavior Packs with automatic UUIDs.</p>
    </div>

    <div class="tool-workspace">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <label style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Pack Name</label>
          <input type="text" id="packName" value="My Custom Pack" class="search-input" style="width: 100%;" />
        </div>
        <div>
          <label style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Pack Type</label>
          <select id="packType" class="search-input" style="width: 100%;">
            <option value="data">Behavior Pack (data)</option>
            <option value="resources">Resource Pack (resources)</option>
          </select>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <span style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold;">manifest.json output:</span>
        <button class="btn-primary" id="copyManifest">Copy JSON</button>
      </div>
      <textarea id="manifestOutput" style="width: 100%; height: 260px; background: #000; color: #fff; border: 1px solid var(--border); font-family: var(--mono); padding: 1rem; font-size: 0.85rem;" readonly></textarea>
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
    bodyContent: manifestBody
  }));

  console.log('  ✓ Built Minecraft Suite (/mc/)');
}

function copyExistingSuites() {
  // 1. Copy ConvertFast
  const cfDist = join(ROOT, '..', 'ConvertFast', 'dist');
  const convertDist = join(DIST, 'convert');
  ensureDir(convertDist);

  if (existsSync(cfDist)) {
    copyDirRecursive(cfDist, convertDist);
    const cfConverters = join(cfDist, 'converters');
    if (existsSync(cfConverters)) {
      copyDirRecursive(cfConverters, convertDist);
    }
  }

  // 2. Copy UnitCalc
  const ucDist = join(ROOT, '..', 'UnitCalc', 'dist');
  const calcDist = join(DIST, 'calc');
  ensureDir(calcDist);

  if (existsSync(ucDist)) {
    copyDirRecursive(ucDist, calcDist);
  }

  console.log('  ✓ Ported ConvertFast & UnitCalc suites to /convert/ and /calc/');
}

function buildSEOAssets() {
  // Discover all HTML files in dist/
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

  collectUrls(join(DIST, 'convert'), '/convert');
  collectUrls(join(DIST, 'calc'), '/calc');
  collectUrls(join(DIST, 'pdf'), '/pdf');
  collectUrls(join(DIST, 'mc'), '/mc');

  const uniqueUrls = [...new Set(discoveredUrls)];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
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

# Restrict aggressive AI training crawlers from zero-click scraping
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
  console.log('\n🔨 Building DIGITAL TOOLS SHED Master Site...\n');
  ensureDir(DIST);

  buildHomepage();
  buildPdfTools();
  buildMinecraftTools();
  copyExistingSuites();
  buildSEOAssets();

  console.log('\n' + '═'.repeat(50));
  console.log('✅ DIGITAL TOOLS SHED BUILD COMPLETE!');
  console.log(`   Location: ${DIST}`);
  console.log(`   Domain: ${DOMAIN}`);
  console.log('═'.repeat(50) + '\n');
}

main();
