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
