import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ICONS, TOOLS } from './core.js';

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
    <div style="margin: 2rem 0; padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="display: inline-block; width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></span>
          <h2 style="font-family: var(--serif); font-size: 1.25rem; margin: 0;">Featured & Trending Tools</h2>
        </div>
        <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">High Demand Utilities</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.85rem;">
        <a href="/calc/meters-to-inches" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">Meters to Inches</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Height & length chart (m to in/ft)</span>
        </a>
        <a href="/calc/sq-cm-to-sq-m" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">cm² to m² Converter</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Area conversion & calculation</span>
        </a>
        <a href="/calc/tsp-to-ml" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">Teaspoons to mL</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Cooking & medicine spoon doses</span>
        </a>
        <a href="/calc/ml-to-cups" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">mL to Cups (Baking)</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Liquid & dry cup fraction chart</span>
        </a>
        <a href="/calc/kwh-to-joules" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">kWh to Joules</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Energy physics derivation & math</span>
        </a>
        <a href="/convert/image-resizer" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">Bulk Image Resizer</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Batch resize PNG, JPG & WebP</span>
        </a>
        <a href="/design/passport-photo" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">US Passport Photo 2x2"</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Biometric crop & 4x6" printable sheet</span>
        </a>
        <a href="/calc/framing-stud-calculator" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">Wall Stud Calculator</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">16" & 24" O.C. lumber framing</span>
        </a>
        <a href="/calc/gravel-calculator" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">Gravel & Stone Tonnage</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Tons & cubic yards estimator</span>
        </a>
        <a href="/math/gpa-calculator" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">GPA Calculator (4.0 Scale)</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Weighted & unweighted grade points</span>
        </a>
        <a href="/dev/url-parser" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">URL Parser & Inspector</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Query parameters & breakdown</span>
        </a>
        <a href="/text/markdown-preview" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">Markdown Live Preview</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Side-by-side GFM editor & HTML</span>
        </a>
        <a href="/calc/feet-and-inches-to-cm" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">Feet & Inches to cm</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Height converter (ft & in to cm)</span>
        </a>
        <a href="/calc/grams-to-cups" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">Grams to Cups</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Baking density: flour, sugar, butter</span>
        </a>
        <a href="/calc/drywall-calculator" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">Drywall Sheet Calculator</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">4x8 & 4x12 panels, mud, tape</span>
        </a>
        <a href="/calc/mulch-calculator" style="display: flex; flex-direction: column; padding: 0.85rem 1rem; background: var(--surface-alt); border: 1px solid var(--border); text-decoration: none; color: inherit; border-radius: 4px; transition: border-color 0.15s ease;">
          <strong style="font-size: 0.95rem; margin-bottom: 0.25rem;">Mulch & Topsoil Yardage</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Cubic yards & store 2 cu ft bags</span>
        </a>
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

export { buildHomepage };
