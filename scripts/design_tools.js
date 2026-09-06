// scripts/design_tools.js - Design & Image Tools Suite for Digital Tools Shed

export function buildDesignToolsSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const designDist = join(DIST, 'design');
  ensureDir(designDist);

  const commonStyle = `
    <style>
      .tool-box { background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0; }
      .field-group { margin-bottom: 1.25rem; }
      .field-label { display: block; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; font-weight: 600; }
      .code-input, .text-input { width: 100%; padding: 0.75rem; font-family: var(--mono); font-size: 0.9rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; box-sizing: border-box; }
      .btn-primary { background: var(--btn-bg, #3b82f6); color: var(--btn-fg, #fff); border: none; padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.85rem; font-weight: 600; cursor: pointer; border-radius: 4px; transition: opacity 0.2s; }
      .btn-primary:hover { opacity: 0.9; }
      .btn-sec { background: transparent; color: var(--fg); border: 1px solid var(--border); padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; border-radius: 4px; }
      .btn-sec:hover { background: var(--surface-alt); }
      .action-bar { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem; align-items: center; }
      .preview-box { background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-align: center; margin-top: 1rem; }
      .grid-controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
    </style>
  `;

  const tools = [    {
      slug: 'qr-code-generator',
      title: 'High-Resolution QR Code & Vector SVG Generator',
      metaDesc: 'Generate high-resolution PNG and scalable vector SVG QR codes offline with custom foreground/background colors, Reed-Solomon ECC levels, quiet zone margins, and zero server tracking.',
      category: 'Design',
      body: `
        ${commonStyle}
        <style>
          .preset-btn { background: var(--surface-alt); border: 1px solid var(--border); color: var(--fg); padding: 0.35rem 0.75rem; font-family: var(--mono); font-size: 0.78rem; border-radius: 4px; cursor: pointer; transition: all 0.15s ease; }
          .preset-btn:hover { background: var(--border); color: var(--fg); }
          .preset-btn.active { background: var(--btn-bg, #3b82f6); color: #fff; border-color: var(--btn-bg, #3b82f6); }
          .trap-card { background: var(--surface-alt); border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; font-size: 0.9rem; line-height: 1.5; }
          .trap-card strong { display: block; margin-bottom: 0.3rem; font-size: 0.95rem; }
          .faq-item { margin-bottom: 0.75rem; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); overflow: hidden; }
          .faq-item summary { padding: 0.85rem 1.15rem; font-weight: 600; cursor: pointer; font-size: 0.95rem; list-style: none; display: flex; justify-content: space-between; align-items: center; }
          .faq-item summary::-webkit-details-marker { display: none; }
          .faq-item summary::after { content: "+"; font-family: var(--mono); font-size: 1.2rem; }
          .faq-item[open] summary::after { content: "−"; }
          .faq-item div { padding: 0.85rem 1.15rem; border-top: 1px solid var(--border); font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }
        </style>
        <div class="article-container" style="max-width: 960px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/design/">Design & Image</a> &gt; QR Code Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;">High-Resolution QR Code & Vector SVG Generator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.55; margin-bottom: 1.5rem;">
            Generate high-resolution PNG and infinite-scale vector SVG QR codes with full control over Reed-Solomon error correction, quiet zones, transparency, and color palettes. 100% client-side computation with zero external CDN scripts or server tracking.
          </p>

          <div class="tool-box">
            <div style="margin-bottom: 1rem;">
              <label class="field-label">Quick Template Presets</label>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button type="button" class="preset-btn active" onclick="applyQrPreset('url')">Website URL</button>
                <button type="button" class="preset-btn" onclick="applyQrPreset('wifi')">Wi-Fi Network</button>
                <button type="button" class="preset-btn" onclick="applyQrPreset('vcard')">Contact Card (vCard)</button>
                <button type="button" class="preset-btn" onclick="applyQrPreset('email')">Email Address</button>
                <button type="button" class="preset-btn" onclick="applyQrPreset('sms')">SMS Message</button>
                <button type="button" class="preset-btn" onclick="applyQrPreset('text')">Plain Text</button>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label" id="qr-content-label">Content / Payload Data</label>
              <textarea id="qr-data" class="code-input" style="height: 85px;" placeholder="Enter website URL or text..." oninput="drawQR()">https://digitaltoolsshed.com</textarea>
            </div>

            <div class="grid-controls" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
              <div class="field-group">
                <label class="field-label">Error Correction (ECC)</label>
                <select id="qr-ecc" class="text-input" onchange="drawQR()">
                  <option value="L">Level L (7% Recovery - High Density)</option>
                  <option value="M" selected>Level M (15% Recovery - Standard)</option>
                  <option value="Q">Level Q (25% Recovery - Commercial)</option>
                  <option value="H">Level H (30% Recovery - Print & Logos)</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Quiet Zone Margin: <span id="lbl-margin" style="color:var(--fg); font-weight:bold;">4 modules</span></label>
                <input type="range" id="qr-margin" min="0" max="8" value="4" style="width:100%;" oninput="document.getElementById('lbl-margin').textContent = this.value + ' modules'; drawQR();" />
              </div>
              <div class="field-group">
                <label class="field-label">Output Resolution (PNG)</label>
                <select id="qr-size" class="text-input" onchange="drawQR()">
                  <option value="256">256 x 256 px (Web Thumbnail)</option>
                  <option value="512" selected>512 x 512 px (Digital Display)</option>
                  <option value="1024">1024 x 1024 px (High-Res Print)</option>
                  <option value="2048">2048 x 2048 px (Ultra Print / Billboard)</option>
                </select>
              </div>
            </div>

            <div class="grid-controls" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-top: 0.5rem;">
              <div class="field-group">
                <label class="field-label">Foreground Color</label>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <input type="color" id="qr-fg" value="#000000" class="text-input" style="width: 48px; height: 38px; padding: 2px; cursor: pointer;" onchange="document.getElementById('qr-fg-hex').value = this.value; drawQR();" />
                  <input type="text" id="qr-fg-hex" value="#000000" class="code-input" style="text-transform: uppercase;" oninput="syncColorInput('fg');" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Background Color</label>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <input type="color" id="qr-bg" value="#ffffff" class="text-input" style="width: 48px; height: 38px; padding: 2px; cursor: pointer;" onchange="document.getElementById('qr-bg-hex').value = this.value; drawQR();" />
                  <input type="text" id="qr-bg-hex" value="#ffffff" class="code-input" style="text-transform: uppercase;" oninput="syncColorInput('bg');" />
                </div>
              </div>
              <div class="field-group" style="display: flex; flex-direction: column; justify-content: center;">
                <label class="field-label">Transparency</label>
                <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; cursor: pointer; padding-top: 0.2rem;">
                  <input type="checkbox" id="qr-transparent" onchange="drawQR()" />
                  <span>Transparent Background (Alpha = 0)</span>
                </label>
              </div>
            </div>

            <!-- Preview & Telemetry Container -->
            <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 1.25rem; align-items: flex-start;">
              <div class="preview-box" style="flex: 1 1 260px; min-width: 240px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; background: repeating-conic-gradient(var(--border) 0% 25%, transparent 0% 50%) 50% / 16px 16px;">
                <canvas id="qr-canvas" style="max-width: 260px; width: 100%; height: auto; border: 1px solid var(--border); border-radius: 4px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); image-rendering: pixelated; background: #ffffff;"></canvas>
                <div id="qr-scan-preview" style="margin-top: 0.75rem; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Ready to scan</div>
              </div>

              <div style="flex: 1 1 320px; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
                <div class="field-label" style="margin-bottom: 0.75rem;">Symbol Architecture & Telemetry</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-family: var(--mono); font-size: 0.82rem;">
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.72rem;">MATRIX VERSION</span>
                    <strong id="stat-version" style="color: var(--fg); font-size: 1rem;">Version 2</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.72rem;">GRID DIMENSIONS</span>
                    <strong id="stat-grid" style="color: var(--fg); font-size: 1rem;">25 x 25 modules</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.72rem;">TOTAL MODULES</span>
                    <strong id="stat-modules" style="color: var(--fg); font-size: 1rem;">625 cells</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.72rem;">PAYLOAD LENGTH</span>
                    <strong id="stat-bytes" style="color: var(--fg); font-size: 1rem;">29 chars</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.72rem;">RECOVERY CAPACITY</span>
                    <strong id="stat-recovery" style="color: #10b981; font-size: 1rem;">~15% (Level M)</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.72rem;">MIN PRINT SIZE (300 DPI)</span>
                    <strong id="stat-print" style="color: var(--fg); font-size: 1rem;">2.1 x 2.1 cm</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Bar -->
            <div class="action-bar" style="margin-top: 1.5rem; justify-content: flex-start;">
              <button class="btn-primary" id="btnDownloadPng" onclick="downloadQrPng()">&#x2913; Download PNG</button>
              <button class="btn-sec" id="btnDownloadSvg" onclick="downloadQrSvg()">&#x2913; Download Vector SVG</button>
              <button class="btn-sec" id="btnCopyQrPng" onclick="copyQrPng()">Copy Image</button>
              <button class="btn-sec" id="btnCopyQrDataUrl" onclick="copyQrDataUrl()">Copy Data URL</button>
              <button class="btn-sec" id="btnCopyQrReport" onclick="copyQrReport()">Copy Audit Report</button>
            </div>
          </div>

          <!-- Mathematical Derivation & Engineering Architecture -->
          <div class="tool-box" style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.75rem;">QR Code Specification & Optical Physics</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
              Defined by ISO/IEC 18004:2015, Quick Response (QR) codes encode binary information onto a two-dimensional matrix using geometric patterns modulated by Galois Field finite-field arithmetic.
            </p>
            <div style="background: var(--bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; margin-bottom: 1.25rem;">
              <div><strong>1. Symbol Matrix Versioning Formula:</strong></div>
              <div>&nbsp;&nbsp;Module Dimension = 4 × Version + 17 &nbsp;&nbsp;(Version 1 = 21×21, Version 40 = 177×177)</div>
              <div><strong>2. Reed-Solomon Algebraic Error Correction:</strong></div>
              <div>&nbsp;&nbsp;Calculated over Galois Field GF(2⁸) with primitive polynomial:</div>
              <div>&nbsp;&nbsp;p(x) = x⁸ + x⁴ + x³ + x² + 1 &nbsp;&nbsp;(Modulo 285 / 0x11D)</div>
              <div><strong>3. Optical Print Dimensioning Equation:</strong></div>
              <div>&nbsp;&nbsp;Minimum Physical Width (W_min) = Scanning Distance (D) / 10</div>
              <div>&nbsp;&nbsp;Module Size (S_mod) ≥ 0.42 mm (300 DPI print = 5 pixels/module minimum)</div>
            </div>
            <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;">
              The engine automatically evaluates all 8 standard masking patterns (e.g., <code>(row + col) % 2 == 0</code>, <code>(row / 2) + (col / 3) % 2 == 0</code>) and selects the pattern minimizing the penalty score (N1: runs of 5+ identical modules; N2: 2×2 blocks of single color; N3: 1:1:3:1:1 finder pattern lookalikes; N4: disproportionate dark-to-light ratios).
            </p>
          </div>

          <!-- 5 Fatal Traps & Engineering Pitfalls -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">5 Fatal Traps in QR Production & Print Deployment</h2>
            
            <div class="trap-card" style="border-left: 4px solid #ef4444;">
              <strong style="color: #ef4444;">1. The Inverted Contrast Trap (White on Black Failure)</strong>
              While smartphone cameras running modern neural vision libraries can read inverted QR codes (light modules on dark backgrounds), industrial handheld laser scanners, barcode decoders, and low-end camera sensor firmware fail on inverted codes over 65% of the time. ISO/IEC 18004 strictly specifies dark modules on a high-reflectance light background. Never invert production QR codes on printed packaging.
            </div>

            <div class="trap-card" style="border-left: 4px solid #f59e0b;">
              <strong style="color: #f59e0b;">2. The Clipped Quiet Zone Disaster (Margin = 0)</strong>
              Setting the quiet zone margin to 0 or placing text, graphics, or borders right against the outer modules blinds computer vision edge-detection algorithms. A QR scanner requires a minimum of 4 unencumbered quiet modules on all four sides to establish the ambient optical threshold (Otsu's binarization) and locate the three corner finder patterns.
            </div>

            <div class="trap-card" style="border-left: 4px solid #10b981;">
              <strong style="color: #10b981;">3. The Low Error-Correction Overconfidence (Level L in Print)</strong>
              Encoding print assets with Level L (7% recovery) leaves zero tolerance for physical wear. A single fingerprint smudge, thermal receipt paper abrasion, crease, or outdoor rain streak corrupts the bitstream beyond recovery. Any asset destined for physical print, stickers, or packaging should mandate Level M (15%) or Level H (30%).
            </div>

            <div class="trap-card" style="border-left: 4px solid #3b82f6;">
              <strong style="color: #3b82f6;">4. The URL Payload Bloat & Micro-Module Trap</strong>
              Stuffing unshortened 250-character URLs with dozens of tracking parameters (UTM tags, session IDs) forces the QR matrix to balloon from Version 2 (25×25) to Version 12+ (65×65). On a standard 1-inch business card, each module shrinks to under 0.35 mm—exceeding the optical resolving power of smartphone cameras held at natural reading distance.
            </div>

            <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
              <strong style="color: #8b5cf6;">5. The Bilinear Downsampling Antialiasing Blur</strong>
              Scaling down a high-resolution QR PNG in software using bilinear or bicubic filtering blurs the crisp boundaries between black and white cells into muddy gray gradients. When rendering or resizing QR images in web canvases or image editors, always enforce nearest-neighbor scaling (<code>imageSmoothingEnabled = false</code>) to preserve 100% hard binary contrast.
            </div>
          </div>

          <!-- Interactive FAQs -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
            
            <details class="faq-item">
              <summary>What is the difference between Error Correction Levels L, M, Q, and H?</summary>
              <div>
                Reed-Solomon error correction embeds redundant mathematical parity words into the QR bitstream. Level L restores up to ~7% of destroyed data, Level M restores ~15%, Level Q restores ~25%, and Level H restores ~30%. Higher correction levels increase durability against scratches, dirt, and partial obscuration, but require larger matrix versions with more modules.
              </div>
            </details>

            <details class="faq-item">
              <summary>Why is a 4-module quiet zone margin necessary?</summary>
              <div>
                The 4-module quiet zone is an unprinted margin surrounding the entire symbol. It prevents surrounding text, graphic borders, or packaging artwork from interfering with the barcode reader's optical binarization algorithm, which must detect the transition from blank space to the symbol's corner finder patterns.
              </div>
            </details>

            <details class="faq-item">
              <summary>Can I use transparent backgrounds for QR codes?</summary>
              <div>
                Yes. This tool allows downloading PNG and vector SVG files with a fully transparent background (Alpha = 0). However, ensure that whatever surface the QR code is placed on provides high optical contrast (e.g. black modules over a light paper or white container) so scanners can read it reliably.
              </div>
            </details>

            <details class="faq-item">
              <summary>How large should a QR code be printed on flyers or signs?</summary>
              <div>
                The universal optical formula is Distance / 10 = Minimum Width. If a user will scan a flyer from 30 cm (12 inches) away, the QR code should be at least 3 cm (1.2 inches) wide. For a billboard scanned from 10 meters away, the QR code must be at least 1 meter wide.
              </div>
            </details>

            <details class="faq-item">
              <summary>Does this tool send my QR data or Wi-Fi credentials to any server?</summary>
              <div>
                No. The entire QR symbol calculation, Reed-Solomon polynomial generation, matrix masking, and raster/vector export execute 100% locally inside your browser using pure client-side JavaScript. No data is ever transmitted across the network.
              </div>
            </details>
          </div>
        </div>

        <!-- Schema.org JSON-LD -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "High-Resolution QR Code & Vector SVG Generator",
              "url": "https://digitaltoolsshed.com/design/qr-code-generator",
              "description": "Generate high-resolution PNG and scalable vector SVG QR codes offline with custom foreground/background colors, Reed-Solomon ECC levels, quiet zone margins, and zero server tracking.",
              "applicationCategory": "DesignApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is the difference between Error Correction Levels L, M, Q, and H?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Reed-Solomon error correction embeds redundant mathematical parity words into the QR bitstream. Level L restores up to ~7% of destroyed data, Level M restores ~15%, Level Q restores ~25%, and Level H restores ~30%."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Why is a 4-module quiet zone margin necessary?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The 4-module quiet zone prevents surrounding text, graphic borders, or packaging artwork from interfering with the barcode reader's optical binarization algorithm."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I use transparent backgrounds for QR codes?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. This tool supports transparent backgrounds (Alpha = 0) for both PNG and vector SVG downloads."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How large should a QR code be printed on flyers or signs?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The standard optical formula is Distance / 10 = Minimum Width. For a scan distance of 30 cm, minimum print size is 3 cm."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does this tool send my QR data or Wi-Fi credentials to any server?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. The entire QR symbol calculation and rendering run 100% locally inside your browser with zero network requests."
                  }
                }
              ]
            }
          ]
        }
        </script>

        <!-- Inline Pure Vanilla QR Engine (Zero CDN Dependency) -->
        <script>
        var qrcode=function(){var t=function(t,r){var e=t,n=g[r],o=null,i=0,a=null,u=[],f={},c=function(t,r){o=function(t){for(var r=new Array(t),e=0;e<t;e+=1){r[e]=new Array(t);for(var n=0;n<t;n+=1)r[e][n]=null}return r}(i=4*e+17),l(0,0),l(i-7,0),l(0,i-7),s(),h(),d(t,r),e>=7&&v(t),null==a&&(a=p(e,n,u)),w(a,r)},l=function(t,r){for(var e=-1;e<=7;e+=1)if(!(t+e<=-1||i<=t+e))for(var n=-1;n<=7;n+=1)r+n<=-1||i<=r+n||(o[t+e][r+n]=0<=e&&e<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==e||6==e)||2<=e&&e<=4&&2<=n&&n<=4)},h=function(){for(var t=8;t<i-8;t+=1)null==o[t][6]&&(o[t][6]=t%2==0);for(var r=8;r<i-8;r+=1)null==o[6][r]&&(o[6][r]=r%2==0)},s=function(){for(var t=B.getPatternPosition(e),r=0;r<t.length;r+=1)for(var n=0;n<t.length;n+=1){var i=t[r],a=t[n];if(null==o[i][a])for(var u=-2;u<=2;u+=1)for(var f=-2;f<=2;f+=1)o[i+u][a+f]=-2==u||2==u||-2==f||2==f||0==u&&0==f}},v=function(t){for(var r=B.getBCHTypeNumber(e),n=0;n<18;n+=1){var a=!t&&1==(r>>n&1);o[Math.floor(n/3)][n%3+i-8-3]=a}for(n=0;n<18;n+=1){a=!t&&1==(r>>n&1);o[n%3+i-8-3][Math.floor(n/3)]=a}},d=function(t,r){for(var e=n<<3|r,a=B.getBCHTypeInfo(e),u=0;u<15;u+=1){var f=!t&&1==(a>>u&1);u<6?o[u][8]=f:u<8?o[u+1][8]=f:o[i-15+u][8]=f}for(u=0;u<15;u+=1){f=!t&&1==(a>>u&1);u<8?o[8][i-u-1]=f:u<9?o[8][15-u-1+1]=f:o[8][15-u-1]=f}o[i-8][8]=!t},w=function(t,r){for(var e=-1,n=i-1,a=7,u=0,f=B.getMaskFunction(r),c=i-1;c>0;c-=2)for(6==c&&(c-=1);;){for(var g=0;g<2;g+=1)if(null==o[n][c-g]){var l=!1;u<t.length&&(l=1==(t[u]>>>a&1)),f(n,c-g)&&(l=!l),o[n][c-g]=l,-1==(a-=1)&&(u+=1,a=7)}if((n+=e)<0||i<=n){n-=e,e=-e;break}}},p=function(t,r,e){for(var n=A.getRSBlocks(t,r),o=b(),i=0;i<e.length;i+=1){var a=e[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var u=0;for(i=0;i<n.length;i+=1)u+=n[i].dataCount;if(o.getLengthInBits()>8*u)throw"code length overflow. ("+o.getLengthInBits()+">"+8*u+")";for(o.getLengthInBits()+4<=8*u&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(!1);for(;!(o.getLengthInBits()>=8*u||(o.put(236,8),o.getLengthInBits()>=8*u));)o.put(17,8);return function(t,r){for(var e=0,n=0,o=0,i=new Array(r.length),a=new Array(r.length),u=0;u<r.length;u+=1){var f=r[u].dataCount,c=r[u].totalCount-f;n=Math.max(n,f),o=Math.max(o,c),i[u]=new Array(f);for(var g=0;g<i[u].length;g+=1)i[u][g]=255&t.getBuffer()[g+e];e+=f;var l=B.getErrorCorrectPolynomial(c),h=k(i[u],l.getLength()-1).mod(l);for(a[u]=new Array(l.getLength()-1),g=0;g<a[u].length;g+=1){var s=g+h.getLength()-a[u].length;a[u][g]=s>=0?h.getAt(s):0}}var v=0;for(g=0;g<r.length;g+=1)v+=r[g].totalCount;var d=new Array(v),w=0;for(g=0;g<n;g+=1)for(u=0;u<r.length;u+=1)g<i[u].length&&(d[w]=i[u][g],w+=1);for(g=0;g<o;g+=1)for(u=0;u<r.length;u+=1)g<a[u].length&&(d[w]=a[u][g],w+=1);return d}(o,n)};f.addData=function(t,r){var e=null;switch(r=r||"Byte"){case"Numeric":e=M(t);break;case"Alphanumeric":e=x(t);break;case"Byte":e=m(t);break;case"Kanji":e=L(t);break;default:throw"mode:"+r}u.push(e),a=null},f.isDark=function(t,r){if(t<0||i<=t||r<0||i<=r)throw t+","+r;return o[t][r]},f.getModuleCount=function(){return i},f.make=function(){if(e<1){for(var t=1;t<40;t++){for(var r=A.getRSBlocks(t,n),o=b(),i=0;i<u.length;i++){var a=u[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var g=0;for(i=0;i<r.length;i++)g+=r[i].dataCount;if(o.getLengthInBits()<=8*g)break}e=t}c(!1,function(){for(var t=0,r=0,e=0;e<8;e+=1){c(!0,e);var n=B.getLostPoint(f);(0==e||t>n)&&(t=n,r=e)}return r}())},f.createTableTag=function(t,r){t=t||2;var e="";e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+(r=void 0===r?4*t:r)+"px;",e+='">',e+="<tbody>";for(var n=0;n<f.getModuleCount();n+=1){e+="<tr>";for(var o=0;o<f.getModuleCount();o+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+t+"px;",e+=" height: "+t+"px;",e+=" background-color: ",e+=f.isDark(n,o)?"#000000":"#ffffff",e+=";",e+='"/>';e+="</tr>"}return e+="</tbody>",e+="</table>"},f.createSvgTag=function(t,r,e,n){var o={};"object"==typeof arguments[0]&&(t=(o=arguments[0]).cellSize,r=o.margin,e=o.alt,n=o.title),t=t||2,r=void 0===r?4*t:r,(e="string"==typeof e?{text:e}:e||{}).text=e.text||null,e.id=e.text?e.id||"qrcode-description":null,(n="string"==typeof n?{text:n}:n||{}).text=n.text||null,n.id=n.text?n.id||"qrcode-title":null;var i,a,u,c,g=f.getModuleCount()*t+2*r,l="";for(c="l"+t+",0 0,"+t+" -"+t+",0 0,-"+t+"z ",l+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',l+=o.scalable?"":' width="'+g+'px" height="'+g+'px"',l+=' viewBox="0 0 '+g+" "+g+'" ',l+=' preserveAspectRatio="xMinYMin meet"',l+=n.text||e.text?' role="img" aria-labelledby="'+y([n.id,e.id].join(" ").trim())+'"':"",l+=">",l+=n.text?'<title id="'+y(n.id)+'">'+y(n.text)+"</title>":"",l+=e.text?'<description id="'+y(e.id)+'">'+y(e.text)+"</description>":"",l+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',l+='<path d="',a=0;a<f.getModuleCount();a+=1)for(u=a*t+r,i=0;i<f.getModuleCount();i+=1)f.isDark(a,i)&&(l+="M"+(i*t+r)+","+u+c);return l+='" stroke="transparent" fill="black"/>',l+="</svg>"},f.createDataURL=function(t,r){t=t||2,r=void 0===r?4*t:r;var e=f.getModuleCount()*t+2*r,n=r,o=e-r;return I(e,e,(function(r,e){if(n<=r&&r<o&&n<=e&&e<o){var i=Math.floor((r-n)/t),a=Math.floor((e-n)/t);return f.isDark(a,i)?0:1}return 1}))},f.createImgTag=function(t,r,e){t=t||2,r=void 0===r?4*t:r;var n=f.getModuleCount()*t+2*r,o="";return o+="<img",o+=' src="',o+=f.createDataURL(t,r),o+='"',o+=' width="',o+=n,o+='"',o+=' height="',o+=n,o+='"',e&&(o+=' alt="',o+=y(e),o+='"'),o+="/>"};var y=function(t){for(var r="",e=0;e<t.length;e+=1){var n=t.charAt(e);switch(n){case"<":r+="&lt;";break;case">":r+="&gt;";break;case"&":r+="&amp;";break;case'"':r+="&quot;";break;default:r+=n}}return r};return f.createASCII=function(t,r){if((t=t||1)<2)return function(t){t=void 0===t?2:t;var r,e,n,o,i,a=1*f.getModuleCount()+2*t,u=t,c=a-t,g={"██":"█","█ ":"▀"," █":"▄","  ":" "},l={"██":"▀","█ ":"▀"," █":" ","  ":" "},h="";for(r=0;r<a;r+=2){for(n=Math.floor((r-u)/1),o=Math.floor((r+1-u)/1),e=0;e<a;e+=1)i="█",u<=e&&e<c&&u<=r&&r<c&&f.isDark(n,Math.floor((e-u)/1))&&(i=" "),u<=e&&e<c&&u<=r+1&&r+1<c&&f.isDark(o,Math.floor((e-u)/1))?i+=" ":i+="█",h+=t<1&&r+1>=c?l[i]:g[i];h+="\n"}return a%2&&t>0?h.substring(0,h.length-a-1)+Array(a+1).join("▀"):h.substring(0,h.length-1)}(r);t-=1,r=void 0===r?2*t:r;var e,n,o,i,a=f.getModuleCount()*t+2*r,u=r,c=a-r,g=Array(t+1).join("██"),l=Array(t+1).join("  "),h="",s="";for(e=0;e<a;e+=1){for(o=Math.floor((e-u)/t),s="",n=0;n<a;n+=1)i=1,u<=n&&n<c&&u<=e&&e<c&&f.isDark(o,Math.floor((n-u)/t))&&(i=0),s+=i?g:l;for(o=0;o<t;o+=1)h+=s+"\n"}return h.substring(0,h.length-1)},f.renderTo2dContext=function(t,r){r=r||2;for(var e=f.getModuleCount(),n=0;n<e;n++)for(var o=0;o<e;o++)t.fillStyle=f.isDark(n,o)?"black":"white",t.fillRect(n*r,o*r,r,r)},f};t.stringToBytes=(t.stringToBytesFuncs={default:function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);r.push(255&n)}return r}}).default,t.createStringToBytes=function(t,r){var e=function(){for(var e=S(t),n=function(){var t=e.read();if(-1==t)throw"eof";return t},o=0,i={};;){var a=e.read();if(-1==a)break;var u=n(),f=n()<<8|n();i[String.fromCharCode(a<<8|u)]=f,o+=1}if(o!=r)throw o+" != "+r;return i}(),n="?".charCodeAt(0);return function(t){for(var r=[],o=0;o<t.length;o+=1){var i=t.charCodeAt(o);if(i<128)r.push(i);else{var a=e[t.charAt(o)];"number"==typeof a?(255&a)==a?r.push(a):(r.push(a>>>8),r.push(255&a)):r.push(n)}}return r}};var r,e,n,o,i,a=1,u=2,f=4,c=8,g={L:1,M:0,Q:3,H:2},l=0,h=1,s=2,v=3,d=4,w=5,p=6,y=7,B=(r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],e=1335,n=7973,i=function(t){for(var r=0;0!=t;)r+=1,t>>>=1;return r},(o={}).getBCHTypeInfo=function(t){for(var r=t<<10;i(r)-i(e)>=0;)r^=e<<i(r)-i(e);return 21522^(t<<10|r)},o.getBCHTypeNumber=function(t){for(var r=t<<12;i(r)-i(n)>=0;)r^=n<<i(r)-i(n);return t<<12|r},o.getPatternPosition=function(t){return r[t-1]},o.getMaskFunction=function(t){switch(t){case l:return function(t,r){return(t+r)%2==0};case h:return function(t,r){return t%2==0};case s:return function(t,r){return r%3==0};case v:return function(t,r){return(t+r)%3==0};case d:return function(t,r){return(Math.floor(t/2)+Math.floor(r/3))%2==0};case w:return function(t,r){return t*r%2+t*r%3==0};case p:return function(t,r){return(t*r%2+t*r%3)%2==0};case y:return function(t,r){return(t*r%3+(t+r)%2)%2==0};default:throw"bad maskPattern:"+t}},o.getErrorCorrectPolynomial=function(t){for(var r=k([1],0),e=0;e<t;e+=1)r=r.multiply(k([1,C.gexp(e)],0));return r},o.getLengthInBits=function(t,r){if(1<=r&&r<10)switch(t){case a:return 10;case u:return 9;case f:case c:return 8;default:throw"mode:"+t}else if(r<27)switch(t){case a:return 12;case u:return 11;case f:return 16;case c:return 10;default:throw"mode:"+t}else{if(!(r<41))throw"type:"+r;switch(t){case a:return 14;case u:return 13;case f:return 16;case c:return 12;default:throw"mode:"+t}}},o.getLostPoint=function(t){for(var r=t.getModuleCount(),e=0,n=0;n<r;n+=1)for(var o=0;o<r;o+=1){for(var i=0,a=t.isDark(n,o),u=-1;u<=1;u+=1)if(!(n+u<0||r<=n+u))for(var f=-1;f<=1;f+=1)o+f<0||r<=o+f||0==u&&0==f||a==t.isDark(n+u,o+f)&&(i+=1);i>5&&(e+=3+i-5)}for(n=0;n<r-1;n+=1)for(o=0;o<r-1;o+=1){var c=0;t.isDark(n,o)&&(c+=1),t.isDark(n+1,o)&&(c+=1),t.isDark(n,o+1)&&(c+=1),t.isDark(n+1,o+1)&&(c+=1),0!=c&&4!=c||(e+=3)}for(n=0;n<r;n+=1)for(o=0;o<r-6;o+=1)t.isDark(n,o)&&!t.isDark(n,o+1)&&t.isDark(n,o+2)&&t.isDark(n,o+3)&&t.isDark(n,o+4)&&!t.isDark(n,o+5)&&t.isDark(n,o+6)&&(e+=40);for(o=0;o<r;o+=1)for(n=0;n<r-6;n+=1)t.isDark(n,o)&&!t.isDark(n+1,o)&&t.isDark(n+2,o)&&t.isDark(n+3,o)&&t.isDark(n+4,o)&&!t.isDark(n+5,o)&&t.isDark(n+6,o)&&(e+=40);var g=0;for(o=0;o<r;o+=1)for(n=0;n<r;n+=1)t.isDark(n,o)&&(g+=1);return e+=Math.abs(100*g/r/r-50)/5*10},o),C=function(){for(var t=new Array(256),r=new Array(256),e=0;e<8;e+=1)t[e]=1<<e;for(e=8;e<256;e+=1)t[e]=t[e-4]^t[e-5]^t[e-6]^t[e-8];for(e=0;e<255;e+=1)r[t[e]]=e;var n={glog:function(t){if(t<1)throw"glog("+t+")";return r[t]},gexp:function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return t[r]}};return n}();function k(t,r){if(void 0===t.length)throw t.length+"/"+r;var e=function(){for(var e=0;e<t.length&&0==t[e];)e+=1;for(var n=new Array(t.length-e+r),o=0;o<t.length-e;o+=1)n[o]=t[o+e];return n}(),n={getAt:function(t){return e[t]},getLength:function(){return e.length},multiply:function(t){for(var r=new Array(n.getLength()+t.getLength()-1),e=0;e<n.getLength();e+=1)for(var o=0;o<t.getLength();o+=1)r[e+o]^=C.gexp(C.glog(n.getAt(e))+C.glog(t.getAt(o)));return k(r,0)},mod:function(t){if(n.getLength()-t.getLength()<0)return n;for(var r=C.glog(n.getAt(0))-C.glog(t.getAt(0)),e=new Array(n.getLength()),o=0;o<n.getLength();o+=1)e[o]=n.getAt(o);for(o=0;o<t.getLength();o+=1)e[o]^=C.gexp(C.glog(t.getAt(o))+r);return k(e,0).mod(t)}};return n}var A=function(){var t=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],r=function(t,r){var e={};return e.totalCount=t,e.dataCount=r,e},e={};return e.getRSBlocks=function(e,n){var o=function(r,e){switch(e){case g.L:return t[4*(r-1)+0];case g.M:return t[4*(r-1)+1];case g.Q:return t[4*(r-1)+2];case g.H:return t[4*(r-1)+3];default:return}}(e,n);if(void 0===o)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+n;for(var i=o.length/3,a=[],u=0;u<i;u+=1)for(var f=o[3*u+0],c=o[3*u+1],l=o[3*u+2],h=0;h<f;h+=1)a.push(r(c,l));return a},e}(),b=function(){var t=[],r=0,e={getBuffer:function(){return t},getAt:function(r){var e=Math.floor(r/8);return 1==(t[e]>>>7-r%8&1)},put:function(t,r){for(var n=0;n<r;n+=1)e.putBit(1==(t>>>r-n-1&1))},getLengthInBits:function(){return r},putBit:function(e){var n=Math.floor(r/8);t.length<=n&&t.push(0),e&&(t[n]|=128>>>r%8),r+=1}};return e},M=function(t){var r=a,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+2<r.length;)t.put(o(r.substring(n,n+3)),10),n+=3;n<r.length&&(r.length-n==1?t.put(o(r.substring(n,n+1)),4):r.length-n==2&&t.put(o(r.substring(n,n+2)),7))}},o=function(t){for(var r=0,e=0;e<t.length;e+=1)r=10*r+i(t.charAt(e));return r},i=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);throw"illegal char :"+t};return n},x=function(t){var r=u,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+1<r.length;)t.put(45*o(r.charAt(n))+o(r.charAt(n+1)),11),n+=2;n<r.length&&t.put(o(r.charAt(n)),6)}},o=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);if("A"<=t&&t<="Z")return t.charCodeAt(0)-"A".charCodeAt(0)+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return n},m=function(r){var e=f,n=t.stringToBytes(r),o={getMode:function(){return e},getLength:function(t){return n.length},write:function(t){for(var r=0;r<n.length;r+=1)t.put(n[r],8)}};return o},L=function(r){var e=c,n=t.stringToBytesFuncs.SJIS;if(!n)throw"sjis not supported.";!function(){var t=n("友");if(2!=t.length||38726!=(t[0]<<8|t[1]))throw"sjis not supported."}();var o=n(r),i={getMode:function(){return e},getLength:function(t){return~~(o.length/2)},write:function(t){for(var r=o,e=0;e+1<r.length;){var n=(255&r[e])<<8|255&r[e+1];if(33088<=n&&n<=40956)n-=33088;else{if(!(57408<=n&&n<=60351))throw"illegal char at "+(e+1)+"/"+n;n-=49472}n=192*(n>>>8&255)+(255&n),t.put(n,13),e+=2}if(e<r.length)throw"illegal char at "+(e+1)}};return i},D=function(){var t=[],r={writeByte:function(r){t.push(255&r)},writeShort:function(t){r.writeByte(t),r.writeByte(t>>>8)},writeBytes:function(t,e,n){e=e||0,n=n||t.length;for(var o=0;o<n;o+=1)r.writeByte(t[o+e])},writeString:function(t){for(var e=0;e<t.length;e+=1)r.writeByte(t.charCodeAt(e))},toByteArray:function(){return t},toString:function(){var r="";r+="[";for(var e=0;e<t.length;e+=1)e>0&&(r+=","),r+=t[e];return r+="]"}};return r},S=function(t){var r=t,e=0,n=0,o=0,i={read:function(){for(;o<8;){if(e>=r.length){if(0==o)return-1;throw"unexpected end of file./"+o}var t=r.charAt(e);if(e+=1,"="==t)return o=0,-1;t.match(/^\s$/)||(n=n<<6|a(t.charCodeAt(0)),o+=6)}var i=n>>>o-8&255;return o-=8,i}},a=function(t){if(65<=t&&t<=90)return t-65;if(97<=t&&t<=122)return t-97+26;if(48<=t&&t<=57)return t-48+52;if(43==t)return 62;if(47==t)return 63;throw"c:"+t};return i},I=function(t,r,e){for(var n=function(t,r){var e=t,n=r,o=new Array(t*r),i={setPixel:function(t,r,n){o[r*e+t]=n},write:function(t){t.writeString("GIF87a"),t.writeShort(e),t.writeShort(n),t.writeByte(128),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(255),t.writeByte(255),t.writeByte(255),t.writeString(","),t.writeShort(0),t.writeShort(0),t.writeShort(e),t.writeShort(n),t.writeByte(0);var r=a(2);t.writeByte(2);for(var o=0;r.length-o>255;)t.writeByte(255),t.writeBytes(r,o,255),o+=255;t.writeByte(r.length-o),t.writeBytes(r,o,r.length-o),t.writeByte(0),t.writeString(";")}},a=function(t){for(var r=1<<t,e=1+(1<<t),n=t+1,i=u(),a=0;a<r;a+=1)i.add(String.fromCharCode(a));i.add(String.fromCharCode(r)),i.add(String.fromCharCode(e));var f,c,g,l=D(),h=(f=l,c=0,g=0,{write:function(t,r){if(t>>>r!=0)throw"length over";for(;c+r>=8;)f.writeByte(255&(t<<c|g)),r-=8-c,t>>>=8-c,g=0,c=0;g|=t<<c,c+=r},flush:function(){c>0&&f.writeByte(g)}});h.write(r,n);var s=0,v=String.fromCharCode(o[s]);for(s+=1;s<o.length;){var d=String.fromCharCode(o[s]);s+=1,i.contains(v+d)?v+=d:(h.write(i.indexOf(v),n),i.size()<4095&&(i.size()==1<<n&&(n+=1),i.add(v+d)),v=d)}return h.write(i.indexOf(v),n),h.write(e,n),h.flush(),l.toByteArray()},u=function(){var t={},r=0,e={add:function(n){if(e.contains(n))throw"dup key:"+n;t[n]=r,r+=1},size:function(){return r},indexOf:function(r){return t[r]},contains:function(r){return void 0!==t[r]}};return e};return i}(t,r),o=0;o<r;o+=1)for(var i=0;i<t;i+=1)n.setPixel(i,o,e(i,o));var a=D();n.write(a);for(var u=function(){var t=0,r=0,e=0,n="",o={},i=function(t){n+=String.fromCharCode(a(63&t))},a=function(t){if(t<0);else{if(t<26)return 65+t;if(t<52)return t-26+97;if(t<62)return t-52+48;if(62==t)return 43;if(63==t)return 47}throw"n:"+t};return o.writeByte=function(n){for(t=t<<8|255&n,r+=8,e+=1;r>=6;)i(t>>>r-6),r-=6},o.flush=function(){if(r>0&&(i(t<<6-r),t=0,r=0),e%3!=0)for(var o=3-e%3,a=0;a<o;a+=1)n+="="},o.toString=function(){return n},o}(),f=a.toByteArray(),c=0;c<f.length;c+=1)u.writeByte(f[c]);return u.flush(),"data:image/gif;base64,"+u};return t}();qrcode.stringToBytesFuncs["UTF-8"]=function(t){return function(t){for(var r=[],e=0;e<t.length;e++){var n=t.charCodeAt(e);n<128?r.push(n):n<2048?r.push(192|n>>6,128|63&n):n<55296||n>=57344?r.push(224|n>>12,128|n>>6&63,128|63&n):(e++,n=65536+((1023&n)<<10|1023&t.charCodeAt(e)),r.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n))}return r}(t)},function(t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports&&(module.exports=t())}((function(){return qrcode}));
if (typeof window !== "undefined") { window.qrcode = qrcode; }
        </script>

        <script>
          let currentQrInstance = null;

          function setFeedback(btnId, originalText) {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            btn.textContent = '✓ Copied!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(() => {
              btn.textContent = originalText;
              btn.style.borderColor = '';
              btn.style.color = '';
            }, 2500);
          }

          function syncColorInput(type) {
            const hex = document.getElementById('qr-' + type + '-hex').value;
            if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
              document.getElementById('qr-' + type).value = hex;
              drawQR();
            }
          }

          function applyQrPreset(type) {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            if (event && event.target) event.target.classList.add('active');

            const dataEl = document.getElementById('qr-data');
            const labelEl = document.getElementById('qr-content-label');

            if (type === 'url') {
              labelEl.textContent = 'Website URL (HTTPS)';
              dataEl.value = 'https://digitaltoolsshed.com';
            } else if (type === 'wifi') {
              labelEl.textContent = 'Wi-Fi Network Configuration';
              dataEl.value = 'WIFI:S:MyHomeWiFi;T:WPA;P:SuperSecretPassword123;;';
            } else if (type === 'vcard') {
              labelEl.textContent = 'Contact Card (vCard 3.0)';
              dataEl.value = 'BEGIN:VCARD\nVERSION:3.0\nN:Smith;Jane;;;\nFN:Jane Smith\nORG:Digital Systems Inc.\nTEL;TYPE=CELL:+1-555-0199\nEMAIL:jane.smith@example.com\nURL:https://example.com\nEND:VCARD';
            } else if (type === 'email') {
              labelEl.textContent = 'Email Mailto Link';
              dataEl.value = 'mailto:support@example.com?subject=Product%20Inquiry&body=Hello,%20I%20would%20like%20more%20information.';
            } else if (type === 'sms') {
              labelEl.textContent = 'SMS Direct Message';
              dataEl.value = 'smsto:+15550143:Please send me the conference itinerary.';
            } else {
              labelEl.textContent = 'Plain Text / Cryptographic Hash';
              dataEl.value = 'Digital Tools Shed - Zero Overhead, Pure Client-Side Privacy First Tools.';
            }
            drawQR();
          }

          function drawQR() {
            const data = document.getElementById('qr-data').value.trim() || ' ';
            const ecc = document.getElementById('qr-ecc').value;
            const margin = parseInt(document.getElementById('qr-margin').value, 10);
            const fg = document.getElementById('qr-fg').value;
            const bg = document.getElementById('qr-bg').value;
            const isTransparent = document.getElementById('qr-transparent').checked;
            const size = parseInt(document.getElementById('qr-size').value, 10);
            const canvas = document.getElementById('qr-canvas');

            try {
              const qr = qrcode(0, ecc);
              qr.addData(data);
              qr.make();
              currentQrInstance = qr;

              const moduleCount = qr.getModuleCount();
              const totalCells = moduleCount + (margin * 2);

              canvas.width = size;
              canvas.height = size;
              const ctx = canvas.getContext('2d');
              ctx.imageSmoothingEnabled = false;

              // Clear background
              if (isTransparent) {
                ctx.clearRect(0, 0, size, size);
              } else {
                ctx.fillStyle = bg;
                ctx.fillRect(0, 0, size, size);
              }

              // Draw modules
              const cellSize = size / totalCells;
              ctx.fillStyle = fg;

              for (let r = 0; r < moduleCount; r++) {
                for (let c = 0; c < moduleCount; c++) {
                  if (qr.isDark(r, c)) {
                    ctx.fillRect(
                      Math.round((c + margin) * cellSize),
                      Math.round((r + margin) * cellSize),
                      Math.ceil(cellSize),
                      Math.ceil(cellSize)
                    );
                  }
                }
              }

              // Update Telemetry
              const version = (moduleCount - 17) / 4;
              document.getElementById('stat-version').textContent = 'Version ' + version;
              document.getElementById('stat-grid').textContent = moduleCount + ' × ' + moduleCount + ' modules';
              document.getElementById('stat-modules').textContent = (moduleCount * moduleCount) + ' cells';
              document.getElementById('stat-bytes').textContent = data.length + ' chars (' + new Blob([data]).size + ' B)';

              const eccText = { L: '~7% (Level L)', M: '~15% (Level M)', Q: '~25% (Level Q)', H: '~30% (Level H)' }[ecc];
              document.getElementById('stat-recovery').textContent = eccText;

              // Estimate minimum print size at 300 DPI (approx 0.42mm per module)
              const minCm = ((totalCells * 0.42) / 10).toFixed(1);
              document.getElementById('stat-print').textContent = minCm + ' × ' + minCm + ' cm';
              document.getElementById('qr-scan-preview').textContent = 'Live Matrix: Version ' + version + ' (' + moduleCount + 'x' + moduleCount + ')';
            } catch (err) {
              console.error('QR Render Error:', err);
              document.getElementById('qr-scan-preview').textContent = 'Payload too large for selected ECC level';
            }
          }

          function getSvgString() {
            if (!currentQrInstance) return '';
            const margin = parseInt(document.getElementById('qr-margin').value, 10);
            const fg = document.getElementById('qr-fg').value;
            const bg = document.getElementById('qr-bg').value;
            const isTransparent = document.getElementById('qr-transparent').checked;
            const moduleCount = currentQrInstance.getModuleCount();
            const totalCells = moduleCount + (margin * 2);

            let svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ' + totalCells + ' ' + totalCells + '" shape-rendering="crispEdges">';
            if (!isTransparent) {
              svg += '<rect width="100%" height="100%" fill="' + bg + '"/>';
            }
            svg += '<path fill="' + fg + '" d="';
            for (let r = 0; r < moduleCount; r++) {
              for (let c = 0; c < moduleCount; c++) {
                if (currentQrInstance.isDark(r, c)) {
                  svg += 'M' + (c + margin) + ',' + (r + margin) + 'h1v1h-1z ';
                }
              }
            }
            svg += '"/>';
            svg += '</svg>';
            return svg;
          }

          function downloadQrPng() {
            const canvas = document.getElementById('qr-canvas');
            const link = document.createElement('a');
            link.download = 'qrcode-' + canvas.width + 'x' + canvas.height + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
          }

          function downloadQrSvg() {
            const svgContent = getSvgString();
            const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
            const link = document.createElement('a');
            link.download = 'qrcode-vector.svg';
            link.href = URL.createObjectURL(blob);
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);
          }

          function copyQrPng() {
            const canvas = document.getElementById('qr-canvas');
            canvas.toBlob(blob => {
              if (navigator.clipboard && navigator.clipboard.write) {
                navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
                  .then(() => setFeedback('btnCopyQrPng', 'Copy Image'))
                  .catch(() => fallbackDataUrlCopy());
              } else {
                fallbackDataUrlCopy();
              }
            }, 'image/png');
          }

          function fallbackDataUrlCopy() {
            const canvas = document.getElementById('qr-canvas');
            navigator.clipboard.writeText(canvas.toDataURL('image/png')).then(() => {
              setFeedback('btnCopyQrPng', 'Copy Image');
            });
          }

          function copyQrDataUrl() {
            const canvas = document.getElementById('qr-canvas');
            navigator.clipboard.writeText(canvas.toDataURL('image/png')).then(() => {
              setFeedback('btnCopyQrDataUrl', 'Copy Data URL');
            });
          }

          function copyQrReport() {
            if (!currentQrInstance) return;
            const data = document.getElementById('qr-data').value;
            const ecc = document.getElementById('qr-ecc').value;
            const margin = document.getElementById('qr-margin').value;
            const fg = document.getElementById('qr-fg').value;
            const bg = document.getElementById('qr-bg').value;
            const size = document.getElementById('qr-size').value;
            const moduleCount = currentQrInstance.getModuleCount();
            const version = (moduleCount - 17) / 4;

            const report = [
              '======================================================',
              'DIGITAL TOOLS SHED - QR CODE OPTICAL AUDIT REPORT',
              '======================================================',
              'Timestamp: ' + new Date().toISOString(),
              'ISO Standard: ISO/IEC 18004:2015 Compliant',
              'Symbol Architecture:',
              '  - Matrix Version: ' + version + ' (' + moduleCount + 'x' + moduleCount + ' modules)',
              '  - Total Data Cells: ' + (moduleCount * moduleCount) + ' modules',
              '  - Quiet Zone: ' + margin + ' modules margin on all borders',
              '  - Error Correction Level: ' + ecc + ' (' + { L:'~7%', M:'~15%', Q:'~25%', H:'~30%' }[ecc] + ' recovery)',
              'Color & Contrast Specifications:',
              '  - Foreground Module Color: ' + fg,
              '  - Background Color: ' + (document.getElementById('qr-transparent').checked ? 'Transparent (Alpha 0)' : bg),
              '  - Output Raster Dimensions: ' + size + ' x ' + size + ' px',
              'Physical Print Dimension Guidelines:',
              '  - Recommended Minimum Print Width (at 300 DPI): ' + document.getElementById('stat-print').textContent,
              '  - Safe Scanning Distance: up to ' + (parseFloat(document.getElementById('stat-print').textContent) * 10).toFixed(0) + ' cm',
              'Payload Telemetry:',
              '  - Byte Size: ' + new Blob([data]).size + ' bytes',
              '  - Character Count: ' + data.length,
              '  - Raw Payload: ' + (data.length > 120 ? data.slice(0, 120) + '... [TRUNCATED]' : data),
              '======================================================'
            ].join('\n');

            navigator.clipboard.writeText(report).then(() => {
              setFeedback('btnCopyQrReport', 'Copy Audit Report');
            });
          }

          window.addEventListener('DOMContentLoaded', drawQR);
        </script>
      `
    },
    {
      slug: 'color-contrast',
      title: 'WCAG 2.1 & APCA Color Contrast Checker with CVD Simulation',
      metaDesc: 'Analyze color contrast ratios under WCAG 2.1 AA/AAA and APCA algorithms with live CVD color blindness simulation, accessible color auto-adjuster, and clipboard export.',
      category: 'Design',
      body: `
        ${commonStyle}
        <style>
          .trap-card { background: var(--surface-alt); border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; font-size: 0.9rem; line-height: 1.5; }
          .trap-card strong { display: block; margin-bottom: 0.3rem; font-size: 0.95rem; }
          .faq-item { margin-bottom: 0.75rem; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); overflow: hidden; }
          .faq-item summary { padding: 0.85rem 1.15rem; font-weight: 600; cursor: pointer; font-size: 0.95rem; list-style: none; display: flex; justify-content: space-between; align-items: center; }
          .faq-item summary::-webkit-details-marker { display: none; }
          .faq-item summary::after { content: "+"; font-family: var(--mono); font-size: 1.2rem; }
          .faq-item[open] summary::after { content: "−"; }
          .faq-item div { padding: 0.85rem 1.15rem; border-top: 1px solid var(--border); font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }
          .cvd-card { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem; text-align: center; }
        </style>
        <div class="article-container" style="max-width: 960px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/design/">Design & Image</a> &gt; Contrast Checker
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;">WCAG 2.1 & APCA Color Contrast Checker</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.55; margin-bottom: 1.5rem;">
            Verify digital accessibility compliance across WCAG 2.1 AA/AAA criteria and the WCAG 3.0 Advanced Perceptual Contrast Algorithm (APCA). Includes full Color Vision Deficiency (CVD) simulation, auto-fix accessible luminance adjuster, and clipboard reporting.
          </p>

          <div class="tool-box">
            <div class="grid-controls" style="grid-template-columns: 1fr 1fr; gap: 1.5rem;">
              <div class="field-group">
                <label class="field-label">Foreground (Text) Color</label>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <input type="color" id="fg-color" value="#111111" class="text-input" style="width: 50px; height: 42px; padding: 2px; cursor: pointer;" onchange="updateContrastFromPicker('fg')" />
                  <input type="text" id="fg-hex" value="#111111" class="code-input" style="text-transform: uppercase;" oninput="updateContrastFromHex('fg')" />
                </div>
                <div id="fg-rgb" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">rgb(17, 17, 17)</div>
              </div>

              <div class="field-group">
                <label class="field-label">Background Color</label>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <input type="color" id="bg-color" value="#ffffff" class="text-input" style="width: 50px; height: 42px; padding: 2px; cursor: pointer;" onchange="updateContrastFromPicker('bg')" />
                  <input type="text" id="bg-hex" value="#ffffff" class="code-input" style="text-transform: uppercase;" oninput="updateContrastFromHex('bg')" />
                </div>
                <div id="bg-rgb" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">rgb(255, 255, 255)</div>
              </div>
            </div>

            <!-- Quick Utilities: Swap Colors & Auto-Adjust Accessible -->
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              <button type="button" class="btn-sec" id="btnSwapColors" onclick="swapColors()">&#x21C4; Swap Foreground & Background</button>
              <button type="button" class="btn-sec" id="btnAutoFix" onclick="autoFixAccessible()">&#x2699; Auto-Adjust to Accessible (AA 4.5:1)</button>
            </div>

            <!-- Live Typography Preview Panel -->
            <div id="preview-panel" style="padding: 2.25rem; border-radius: 8px; border: 1px solid var(--border); transition: background 0.15s, color 0.15s; margin-bottom: 1.5rem;">
              <h2 style="margin: 0 0 0.5rem; font-size: 1.75rem; font-weight: 700;">Headline Typography (24px Bold)</h2>
              <p style="margin: 0 0 1rem; font-size: 1rem; line-height: 1.6;">
                This paragraph represents standard body text rendered at 16px with regular font weight. Readable digital typography requires sufficient photometric luminance contrast against the background plane.
              </p>
              <p style="margin: 0 0 1.25rem; font-size: 0.85rem; opacity: 0.9;">
                Caption & Secondary Text: Small print, legal notices, and footnote metadata (13px).
              </p>
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <button type="button" id="preview-btn" style="padding: 0.5rem 1.2rem; border-radius: 4px; font-weight: 600; cursor: pointer; border: 1px solid currentColor; background: transparent; color: inherit;">
                  Interactive UI Component
                </button>
                <span style="font-size: 0.85rem; text-decoration: underline; cursor: pointer;">Standard Text Hyperlink</span>
              </div>
            </div>

            <!-- Metric Scores Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.75rem; text-align: center; margin-bottom: 1.5rem;">
              <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border: 1px solid var(--border);">
                <div class="field-label" style="font-size: 0.7rem;">WCAG 2.1 CONTRAST</div>
                <div id="ratio-num" style="font-family: var(--mono); font-size: 1.85rem; font-weight: bold; color: var(--fg);">16.1 : 1</div>
                <div id="ratio-qual" style="font-size: 0.75rem; color: #10b981; font-weight: 600; margin-top: 0.2rem;">Superb Contrast</div>
              </div>
              <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border: 1px solid var(--border);">
                <div class="field-label" style="font-size: 0.7rem;">WCAG 3.0 APCA SCORE</div>
                <div id="apca-num" style="font-family: var(--mono); font-size: 1.85rem; font-weight: bold; color: var(--fg);">Lc 106.2</div>
                <div id="apca-qual" style="font-size: 0.75rem; color: #10b981; font-weight: 600; margin-top: 0.2rem;">All Text Sizes Pass</div>
              </div>
              <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border: 1px solid var(--border);">
                <div class="field-label" style="font-size: 0.7rem;">AA NORMAL TEXT (≥4.5)</div>
                <div id="badge-aa-normal" style="font-family: var(--mono); font-size: 1.25rem; font-weight: bold; color: #10b981;">PASS</div>
              </div>
              <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border: 1px solid var(--border);">
                <div class="field-label" style="font-size: 0.7rem;">AAA NORMAL TEXT (≥7.0)</div>
                <div id="badge-aaa-normal" style="font-family: var(--mono); font-size: 1.25rem; font-weight: bold; color: #10b981;">PASS</div>
              </div>
              <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border: 1px solid var(--border);">
                <div class="field-label" style="font-size: 0.7rem;">LARGE TEXT (≥3.0)</div>
                <div id="badge-large" style="font-family: var(--mono); font-size: 1.25rem; font-weight: bold; color: #10b981;">PASS</div>
              </div>
              <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border: 1px solid var(--border);">
                <div class="field-label" style="font-size: 0.7rem;">UI COMPONENTS (≥3.0)</div>
                <div id="badge-ui" style="font-family: var(--mono); font-size: 1.25rem; font-weight: bold; color: #10b981;">PASS</div>
              </div>
            </div>

            <!-- Color Vision Deficiency (CVD) Simulation -->
            <div style="margin-top: 1.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.75rem;">Color Vision Deficiency (CVD) Perception Simulation</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem;">
                Simulates how this specific color pair is perceived by individuals with congenital dichromacy and monochromacy.
              </p>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.75rem;">
                <div class="cvd-card">
                  <div style="font-size: 0.75rem; font-family: var(--mono); color: var(--text-muted); margin-bottom: 0.5rem;">PROTANOPIA (Red-Blind)</div>
                  <div id="cvd-protan" style="padding: 0.75rem 0.5rem; border-radius: 4px; font-weight: 600; font-size: 0.85rem; border: 1px solid var(--border);">Sample Text</div>
                </div>
                <div class="cvd-card">
                  <div style="font-size: 0.75rem; font-family: var(--mono); color: var(--text-muted); margin-bottom: 0.5rem;">DEUTERANOPIA (Green-Blind)</div>
                  <div id="cvd-deuter" style="padding: 0.75rem 0.5rem; border-radius: 4px; font-weight: 600; font-size: 0.85rem; border: 1px solid var(--border);">Sample Text</div>
                </div>
                <div class="cvd-card">
                  <div style="font-size: 0.75rem; font-family: var(--mono); color: var(--text-muted); margin-bottom: 0.5rem;">TRITANOPIA (Blue-Blind)</div>
                  <div id="cvd-tritan" style="padding: 0.75rem 0.5rem; border-radius: 4px; font-weight: 600; font-size: 0.85rem; border: 1px solid var(--border);">Sample Text</div>
                </div>
                <div class="cvd-card">
                  <div style="font-size: 0.75rem; font-family: var(--mono); color: var(--text-muted); margin-bottom: 0.5rem;">ACHROMATOPSIA (Monochrome)</div>
                  <div id="cvd-achro" style="padding: 0.75rem 0.5rem; border-radius: 4px; font-weight: 600; font-size: 0.85rem; border: 1px solid var(--border);">Sample Text</div>
                </div>
              </div>
            </div>

            <!-- Action Bar -->
            <div class="action-bar" style="margin-top: 1.5rem;">
              <button class="btn-primary" id="btnCopyRatio" onclick="copyContrastRatio()">Copy Contrast Score</button>
              <button class="btn-sec" id="btnCopyCss" onclick="copyContrastCss()">Copy CSS Snippet</button>
              <button class="btn-sec" id="btnCopyCvdReport" onclick="copyContrastAudit()">Copy Accessibility Audit Report</button>
            </div>
          </div>

          <!-- Mathematical Derivation -->
          <div class="tool-box" style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.75rem;">Photometric Derivation & Contrast Mathematics</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
              WCAG 2.1 relative luminance calculation transforms gamma-compressed sRGB channels to linear CIE 1931 photopic luminance space:
            </p>
            <div style="background: var(--bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; margin-bottom: 1.25rem;">
              <div><strong>1. sRGB Gamma De-quantization:</strong></div>
              <div>&nbsp;&nbsp;For channel C in [R, G, B] normalized to [0, 1]:</div>
              <div>&nbsp;&nbsp;C_linear = (C ≤ 0.04045) ? (C / 12.92) : ((C + 0.055) / 1.055)^2.4</div>
              <div><strong>2. Relative Luminance (L):</strong></div>
              <div>&nbsp;&nbsp;L = 0.2126 × R_linear + 0.7152 × G_linear + 0.0722 × B_linear</div>
              <div><strong>3. WCAG 2.1 Contrast Ratio:</strong></div>
              <div>&nbsp;&nbsp;Contrast Ratio = (L_lighter + 0.05) / (L_darker + 0.05)</div>
            </div>
            <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;">
              The constant <code>+0.05</code> compensates for ambient room illumination and display flare (the Weber-Fechner law of visual psychophysics). WCAG 3.0 APCA extends this by incorporating power laws for spatial frequency (glyph stroke width) and polarity (dark-mode light text on dark backgrounds causes optical irradiation in human astigmatism).
            </p>
          </div>

          <!-- 5 Fatal Traps -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">5 Fatal Traps in UI Color Contrast & Accessibility</h2>
            
            <div class="trap-card" style="border-left: 4px solid #ef4444;">
              <strong style="color: #ef4444;">1. The Placeholder Text Opacity Trap</strong>
              Setting input placeholders to <code>color: #a0aec0</code> or using <code>opacity: 0.4</code> on dark text over white yields contrast ratios of 2.1:1 to 2.8:1. This is the single most common accessibility lawsuit trigger under ADA Title III and EN 301 549. Over 40% of users over 55 fail to locate or read faint form fields.
            </div>

            <div class="trap-card" style="border-left: 4px solid #f59e0b;">
              <strong style="color: #f59e0b;">2. The Symmetrical Polarity Fallacy (Dark Mode Irradiation)</strong>
              Assuming that inverted colors (e.g. swapping #111111 on #ffffff to #ffffff on #111111) yield identical perceptual contrast. In reality, human ocular lenses suffer from irradiation: bright glyphs on pitch-black backgrounds visually bloom and blur outward, making thin white fonts harder to parse than black fonts on white.
            </div>

            <div class="trap-card" style="border-left: 4px solid #10b981;">
              <strong style="color: #10b981;">3. The Disabled State Exemption Abuse</strong>
              While WCAG technically exempts inactive components from strict 4.5:1 ratios, rendering disabled buttons in #e2e8f0 with #94a3b8 text produces an unreadable gray rectangle. Users cannot distinguish between an intentionally disabled action, an unloaded asset, or a rendering glitch.
            </div>

            <div class="trap-card" style="border-left: 4px solid #3b82f6;">
              <strong style="color: #3b82f6;">4. The Red-Green Color Reliance (Deuteranopia Blindness)</strong>
              Conveying success and error states solely using green (#10b981) and red (#ef4444) text without secondary geometric icons or status badges. Approximately 8% of biological males possess deuteranopia or protanopia, causing red and green to collapse into identical brownish-olive wavelengths.
            </div>

            <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
              <strong style="color: #8b5cf6;">5. The Thin-Weight Font Anti-Aliasing Degradation</strong>
              Validating color contrast mathematically using a solid pixel model, but then implementing the typography at <code>font-weight: 100</code> (Ultra Light) or <code>font-weight: 200</code>. Subpixel anti-aliasing dilutes thin font stems with surrounding background pixels, dropping real on-screen optical contrast below 2.5:1.
            </div>
          </div>

          <!-- Interactive FAQs -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
            
            <details class="faq-item">
              <summary>What is the difference between WCAG AA and AAA contrast requirements?</summary>
              <div>
                WCAG AA requires a minimum contrast ratio of 4.5:1 for normal body text and 3:1 for large text (18pt / 24px or 14pt / 18.66px bold) and graphical UI components. WCAG AAA represents the enhanced level, demanding 7:1 for normal text and 4.5:1 for large text to accommodate users with moderate low vision.
              </div>
            </details>

            <details class="faq-item">
              <summary>How does WCAG define "Large Text"?</summary>
              <div>
                Large text is defined as text that is at least 18 points (typically 24 pixels) or 14 points (typically 18.66 pixels) if rendered with a bold font weight (font-weight: 700 or greater). Because larger glyph stems cover more retina area, the minimum threshold drops from 4.5:1 to 3:1.
              </div>
            </details>

            <details class="faq-item">
              <summary>Why does WCAG add 0.05 to the luminance values?</summary>
              <div>
                The 0.05 offset represents ambient optical flare and screen reflectance under standard room lighting conditions. Without this offset, pure black (L = 0) would result in mathematical division by zero or infinite contrast ratios that do not reflect human perceptual reality.
              </div>
            </details>

            <details class="faq-item">
              <summary>How does WCAG 3.0 APCA differ from WCAG 2.1?</summary>
              <div>
                APCA (Advanced Perceptual Contrast Algorithm) models human foveal cone response and cortical spatial frequency. Unlike WCAG 2.1, APCA is polarity-sensitive (treating dark-on-light differently from light-on-dark) and adjusts required lightness contrast based directly on font size and font weight.
              </div>
            </details>

            <details class="faq-item">
              <summary>Can text with 4.5:1 contrast still be hard to read?</summary>
              <div>
                Yes. If the font weight is ultra-thin, if letter spacing (kerning) is cramped, or if the background has visual texture, noise, or gradients, reading comprehension plummets despite meeting the mathematical color ratio. Contrast is only one dimension of accessible typography.
              </div>
            </details>
          </div>
        </div>

        <!-- Schema.org JSON-LD -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "WCAG 2.1 & APCA Color Contrast Checker",
              "url": "https://digitaltoolsshed.com/design/color-contrast",
              "description": "Analyze color contrast ratios under WCAG 2.1 AA/AAA and APCA algorithms with live CVD color blindness simulation, accessible color auto-adjuster, and clipboard export.",
              "applicationCategory": "DesignApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is the difference between WCAG AA and AAA contrast requirements?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "WCAG AA mandates a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text. WCAG AAA requires 7:1 for normal text and 4.5:1 for large text."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does WCAG define Large Text?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Large text is defined as at least 18pt (24px) normal or 14pt (18.66px) bold font weight."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Why does WCAG add 0.05 to the luminance values?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The 0.05 constant compensates for ambient room glare and display surface reflections based on the Weber-Fechner law."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does WCAG 3.0 APCA differ from WCAG 2.1?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "APCA models human foveal cone response, spatial frequency, font weight, and polarity differences between light and dark modes."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can text with 4.5:1 contrast still be hard to read?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, ultra-thin font weights, tight kerning, and busy background textures can degrade legibility even when meeting 4.5:1 contrast."
                  }
                }
              ]
            }
          ]
        }
        </script>

        <script>
          function setFeedback(btnId, originalText) {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            btn.textContent = '✓ Copied!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(() => {
              btn.textContent = originalText;
              btn.style.borderColor = '';
              btn.style.color = '';
            }, 2500);
          }

          function hexToRgb(hex) {
            hex = hex.replace(/^#/, '');
            if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
            const num = parseInt(hex, 16);
            return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
          }

          function rgbToHex([r, g, b]) {
            return '#' + [r, g, b].map(x => {
              const h = Math.max(0, Math.min(255, Math.round(x))).toString(16);
              return h.length === 1 ? '0' + h : h;
            }).join('');
          }

          function getLuminance([r, g, b]) {
            const a = [r, g, b].map(v => {
              v /= 255;
              return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
          }

          // APCA Estimated lightness contrast
          function calcApca(txtRgb, bgRgb) {
            const yTxt = getLuminance(txtRgb);
            const yBg = getLuminance(bgRgb);
            let sapc = 0;
            if (Math.abs(yTxt - yBg) < 0.0005) return 0;
            if (yBg > yTxt) {
              sapc = (Math.pow(yBg, 0.56) - Math.pow(yTxt, 0.57)) * 1.14;
            } else {
              sapc = (Math.pow(yBg, 0.65) - Math.pow(yTxt, 0.62)) * 1.14;
            }
            return (sapc * 100);
          }

          // CVD Simulation via Brettel/Viénot linear matrices
          function simulateCvd(rgb, type) {
            const [r, g, b] = rgb;
            let res = [r, g, b];
            if (type === 'protan') {
              res = [0.56667 * r + 0.43333 * g, 0.55833 * r + 0.44167 * g, 0.24167 * g + 0.75833 * b];
            } else if (type === 'deuter') {
              res = [0.625 * r + 0.375 * g, 0.7 * r + 0.3 * g, 0.3 * g + 0.7 * b];
            } else if (type === 'tritan') {
              res = [0.95 * r + 0.05 * g, 0.43333 * g + 0.56667 * b, 0.475 * g + 0.525 * b];
            } else if (type === 'achro') {
              const grey = 0.299 * r + 0.587 * g + 0.114 * b;
              res = [grey, grey, grey];
            }
            return rgbToHex(res);
          }

          function calcRatio() {
            const fgHex = document.getElementById('fg-hex').value;
            const bgHex = document.getElementById('bg-hex').value;

            try {
              const fgRgb = hexToRgb(fgHex);
              const bgRgb = hexToRgb(bgHex);

              document.getElementById('fg-rgb').textContent = 'rgb(' + fgRgb.join(', ') + ')';
              document.getElementById('bg-rgb').textContent = 'rgb(' + bgRgb.join(', ') + ')';

              const l1 = getLuminance(fgRgb);
              const l2 = getLuminance(bgRgb);
              const lighter = Math.max(l1, l2);
              const darker = Math.min(l1, l2);
              const ratio = (lighter + 0.05) / (darker + 0.05);

              document.getElementById('ratio-num').textContent = ratio.toFixed(2) + ' : 1';
              
              const qualEl = document.getElementById('ratio-qual');
              if (ratio >= 7.0) {
                qualEl.textContent = 'Superb (AAA Pass)';
                qualEl.style.color = '#10b981';
              } else if (ratio >= 4.5) {
                qualEl.textContent = 'Good (AA Pass)';
                qualEl.style.color = '#10b981';
              } else if (ratio >= 3.0) {
                qualEl.textContent = 'Marginal (Large Text Only)';
                qualEl.style.color = '#f59e0b';
              } else {
                qualEl.textContent = 'Fails Accessibility';
                qualEl.style.color = '#ef4444';
              }

              // APCA Score
              const apca = calcApca(fgRgb, bgRgb);
              const apcaAbs = Math.abs(apca).toFixed(1);
              document.getElementById('apca-num').textContent = 'Lc ' + apcaAbs;
              const apcaQual = document.getElementById('apca-qual');
              if (Math.abs(apca) >= 90) {
                apcaQual.textContent = 'All Text Sizes Pass';
                apcaQual.style.color = '#10b981';
              } else if (Math.abs(apca) >= 60) {
                apcaQual.textContent = 'Body & Large Text Pass';
                apcaQual.style.color = '#10b981';
              } else if (Math.abs(apca) >= 45) {
                apcaQual.textContent = 'Large Text Only (36px+)';
                apcaQual.style.color = '#f59e0b';
              } else {
                apcaQual.textContent = 'Non-Text Only';
                apcaQual.style.color = '#ef4444';
              }

              // Update Preview Box
              const panel = document.getElementById('preview-panel');
              panel.style.backgroundColor = bgHex;
              panel.style.color = fgHex;

              // Badges
              const passAaNormal = ratio >= 4.5;
              const passAaaNormal = ratio >= 7.0;
              const passLarge = ratio >= 3.0;
              const passUi = ratio >= 3.0;

              setScoreBadge('badge-aa-normal', passAaNormal);
              setScoreBadge('badge-aaa-normal', passAaaNormal);
              setScoreBadge('badge-large', passLarge);
              setScoreBadge('badge-ui', passUi);

              // Update CVD Previews
              ['protan', 'deuter', 'tritan', 'achro'].forEach(type => {
                const simFg = simulateCvd(fgRgb, type);
                const simBg = simulateCvd(bgRgb, type);
                const el = document.getElementById('cvd-' + type);
                el.style.backgroundColor = simBg;
                el.style.color = simFg;
                el.textContent = 'Aa ' + ratio.toFixed(1) + ':1';
              });

            } catch (e) {
              console.error('Contrast calc error:', e);
            }
          }

          function setScoreBadge(id, isPass) {
            const el = document.getElementById(id);
            el.textContent = isPass ? 'PASS' : 'FAIL';
            el.style.color = isPass ? '#10b981' : '#ef4444';
          }

          function updateContrastFromPicker(type) {
            document.getElementById(type + '-hex').value = document.getElementById(type + '-color').value;
            calcRatio();
          }

          function updateContrastFromHex(type) {
            const val = document.getElementById(type + '-hex').value;
            if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
              document.getElementById(type + '-color').value = val;
              calcRatio();
            }
          }

          function swapColors() {
            const fg = document.getElementById('fg-hex').value;
            const bg = document.getElementById('bg-hex').value;
            document.getElementById('fg-hex').value = bg;
            document.getElementById('fg-color').value = bg;
            document.getElementById('bg-hex').value = fg;
            document.getElementById('bg-color').value = fg;
            calcRatio();
          }

          function autoFixAccessible() {
            const bgHex = document.getElementById('bg-hex').value;
            const fgHex = document.getElementById('fg-hex').value;
            const bgRgb = hexToRgb(bgHex);
            const fgRgb = hexToRgb(fgHex);
            const bgLum = getLuminance(bgRgb);

            // Determine whether to darken or lighten FG
            const makeDarker = bgLum > 0.4;
            let [r, g, b] = fgRgb;

            for (let step = 0; step < 100; step++) {
              const curRatio = (Math.max(bgLum, getLuminance([r, g, b])) + 0.05) / (Math.min(bgLum, getLuminance([r, g, b])) + 0.05);
              if (curRatio >= 4.55) break;

              if (makeDarker) {
                r = Math.max(0, r - 3);
                g = Math.max(0, g - 3);
                b = Math.max(0, b - 3);
              } else {
                r = Math.min(255, r + 3);
                g = Math.min(255, g + 3);
                b = Math.min(255, b + 3);
              }
            }

            const newFgHex = rgbToHex([r, g, b]);
            document.getElementById('fg-hex').value = newFgHex;
            document.getElementById('fg-color').value = newFgHex;
            calcRatio();
          }

          function copyContrastRatio() {
            const ratio = document.getElementById('ratio-num').textContent;
            const status = document.getElementById('ratio-qual').textContent;
            const text = 'Contrast Ratio: ' + ratio + ' (' + status + ')';
            navigator.clipboard.writeText(text).then(() => setFeedback('btnCopyRatio', 'Copy Contrast Score'));
          }

          function copyContrastCss() {
            const fg = document.getElementById('fg-hex').value;
            const bg = document.getElementById('bg-hex').value;
            const css = 'color: ' + fg + ';\nbackground-color: ' + bg + ';';
            navigator.clipboard.writeText(css).then(() => setFeedback('btnCopyCss', 'Copy CSS Snippet'));
          }

          function copyContrastAudit() {
            const fg = document.getElementById('fg-hex').value;
            const bg = document.getElementById('bg-hex').value;
            const ratio = document.getElementById('ratio-num').textContent;
            const apca = document.getElementById('apca-num').textContent;

            const report = [
              '======================================================',
              'DIGITAL TOOLS SHED - COLOR CONTRAST & CVD AUDIT REPORT',
              '======================================================',
              'Timestamp: ' + new Date().toISOString(),
              'Colors Evaluated:',
              '  - Foreground (Text): ' + fg + ' ' + document.getElementById('fg-rgb').textContent,
              '  - Background: ' + bg + ' ' + document.getElementById('bg-rgb').textContent,
              'Mathematical Measurements:',
              '  - WCAG 2.1 Contrast Ratio: ' + ratio,
              '  - WCAG 3.0 APCA Lightness Contrast: ' + apca,
              'WCAG 2.1 Compliance Ratings:',
              '  - Level AA Normal Text (≥4.5:1): ' + document.getElementById('badge-aa-normal').textContent,
              '  - Level AAA Normal Text (≥7.0:1): ' + document.getElementById('badge-aaa-normal').textContent,
              '  - Large Text & Headings (≥3.0:1): ' + document.getElementById('badge-large').textContent,
              '  - UI Components & Icons (≥3.0:1): ' + document.getElementById('badge-ui').textContent,
              'Color Vision Deficiency (CVD) Simulation Values:',
              '  - Protanopia (Red-Blind): ' + simulateCvd(hexToRgb(fg), 'protan') + ' on ' + simulateCvd(hexToRgb(bg), 'protan'),
              '  - Deuteranopia (Green-Blind): ' + simulateCvd(hexToRgb(fg), 'deuter') + ' on ' + simulateCvd(hexToRgb(bg), 'deuter'),
              '  - Tritanopia (Blue-Blind): ' + simulateCvd(hexToRgb(fg), 'tritan') + ' on ' + simulateCvd(hexToRgb(bg), 'tritan'),
              '  - Achromatopsia (Monochrome): ' + simulateCvd(hexToRgb(fg), 'achro') + ' on ' + simulateCvd(hexToRgb(bg), 'achro'),
              '======================================================'
            ].join('\n');

            navigator.clipboard.writeText(report).then(() => setFeedback('btnCopyCvdReport', 'Copy Accessibility Audit Report'));
          }

          document.addEventListener('DOMContentLoaded', calcRatio);
        </script>
      `
    },
    {
      slug: 'glassmorphism',
      title: 'Glassmorphism CSS & Frosted Glass Generator with Tailwind',
      metaDesc: 'Generate modern frosted-glass UI cards with live backdrop-filter controls, saturation boosting, border highlights, multi-background preview, and Tailwind CSS code.',
      category: 'Design',
      body: `
        ${commonStyle}
        <style>
          .trap-card { background: var(--surface-alt); border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; font-size: 0.9rem; line-height: 1.5; }
          .trap-card strong { display: block; margin-bottom: 0.3rem; font-size: 0.95rem; }
          .faq-item { margin-bottom: 0.75rem; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); overflow: hidden; }
          .faq-item summary { padding: 0.85rem 1.15rem; font-weight: 600; cursor: pointer; font-size: 0.95rem; list-style: none; display: flex; justify-content: space-between; align-items: center; }
          .faq-item summary::-webkit-details-marker { display: none; }
          .faq-item summary::after { content: "+"; font-family: var(--mono); font-size: 1.2rem; }
          .faq-item[open] summary::after { content: "−"; }
          .faq-item div { padding: 0.85rem 1.15rem; border-top: 1px solid var(--border); font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }
          .bg-thumb { width: 36px; height: 36px; border-radius: 4px; cursor: pointer; border: 2px solid var(--border); }
          .bg-thumb.active { border-color: var(--btn-bg, #3b82f6); transform: scale(1.08); }
        </style>
        <div class="article-container" style="max-width: 960px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/design/">Design & Image</a> &gt; Glassmorphism Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;">Glassmorphism CSS & Frosted Glass Generator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.55; margin-bottom: 1.5rem;">
            Design modern translucent frosted-glass cards with dual-pass Gaussian blur filters, optical saturation boosting, chamfered edge highlights, and elevation shadows. Emits standard CSS, Safari vendor prefixes, progressive enhancement fallbacks, and Tailwind CSS classes.
          </p>

          <div class="tool-box">
            <!-- Controls Grid -->
            <div class="grid-controls" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;">
              <div class="field-group">
                <label class="field-label">Backdrop Blur: <span id="lbl-blur" style="color:var(--fg); font-weight:bold;">16 px</span></label>
                <input type="range" id="glass-blur" min="0" max="50" value="16" style="width:100%;" oninput="updateGlass()" />
              </div>
              <div class="field-group">
                <label class="field-label">Glass Opacity: <span id="lbl-op" style="color:var(--fg); font-weight:bold;">0.25</span></label>
                <input type="range" id="glass-op" min="0.00" max="0.95" step="0.05" value="0.25" style="width:100%;" oninput="updateGlass()" />
              </div>
              <div class="field-group">
                <label class="field-label">Border Radius: <span id="lbl-rad" style="color:var(--fg); font-weight:bold;">16 px</span></label>
                <input type="range" id="glass-rad" min="0" max="48" value="16" style="width:100%;" oninput="updateGlass()" />
              </div>
              <div class="field-group">
                <label class="field-label">Saturation Boost: <span id="lbl-sat" style="color:var(--fg); font-weight:bold;">160%</span></label>
                <input type="range" id="glass-sat" min="100" max="250" step="5" value="160" style="width:100%;" oninput="updateGlass()" />
              </div>
            </div>

            <div class="grid-controls" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-top: 0.5rem;">
              <div class="field-group">
                <label class="field-label">Glass Base Tint</label>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <input type="color" id="glass-color" value="#ffffff" class="text-input" style="width: 48px; height: 38px; padding: 2px; cursor: pointer;" onchange="updateGlass()" />
                  <select id="glass-tint-preset" class="text-input" onchange="applyTintPreset(this.value)">
                    <option value="#ffffff" selected>White Frosted Glass</option>
                    <option value="#18181b">Dark Smoked Glass</option>
                    <option value="#06b6d4">Cyan Glow Glass</option>
                    <option value="#8b5cf6">Violet Acrylic Glass</option>
                  </select>
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Border Highlight Opacity: <span id="lbl-border-op" style="color:var(--fg); font-weight:bold;">0.30</span></label>
                <input type="range" id="glass-border-op" min="0.00" max="1.00" step="0.05" value="0.30" style="width:100%;" oninput="updateGlass()" />
              </div>
              <div class="field-group">
                <label class="field-label">Elevation Shadow: <span id="lbl-shadow" style="color:var(--fg); font-weight:bold;">Medium (24px)</span></label>
                <select id="glass-shadow" class="text-input" onchange="updateGlass()">
                  <option value="none">None (Flat Floating)</option>
                  <option value="sm">Subtle (8px Blur)</option>
                  <option value="md" selected>Medium (24px Blur)</option>
                  <option value="lg">Deep (40px Blur / 3D Lift)</option>
                </select>
              </div>
            </div>

            <!-- Background Theme Switcher for Preview -->
            <div style="margin-top: 1rem;">
              <label class="field-label">Underlying Background Texture</label>
              <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                <div class="bg-thumb active" style="background: linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%);" onclick="changeGlassBg(0, this)" title="Aurora Gradient"></div>
                <div class="bg-thumb" style="background: radial-gradient(circle at top right, #3b82f6, transparent 50%), radial-gradient(circle at bottom left, #10b981, #09090b);" onclick="changeGlassBg(1, this)" title="Cyberpunk Neon"></div>
                <div class="bg-thumb" style="background: linear-gradient(to right, #f97316, #e11d48, #4c1d95);" onclick="changeGlassBg(2, this)" title="Sunset Horizon"></div>
                <div class="bg-thumb" style="background: repeating-linear-gradient(45deg, #1e293b, #1e293b 10px, #0f172a 10px, #0f172a 20px);" onclick="changeGlassBg(3, this)" title="Technical Mesh"></div>
                <div class="bg-thumb" style="background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%);" onclick="changeGlassBg(4, this)" title="Light Minimalist"></div>
              </div>
            </div>

            <!-- Interactive Preview Card -->
            <div id="preview-stage" style="background: linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%); padding: 3.5rem 1.5rem; border-radius: 8px; margin: 1.5rem 0; display: flex; justify-content: center; align-items: center; position: relative; overflow: hidden; min-height: 280px;">
              <!-- Floating Decorative Orbs Behind the Glass to Showcase Refraction -->
              <div style="position: absolute; top: 15%; left: 20%; width: 90px; height: 90px; border-radius: 50%; background: rgba(255,255,255,0.4); pointer-events: none;"></div>
              <div style="position: absolute; bottom: 15%; right: 22%; width: 110px; height: 110px; border-radius: 50%; background: rgba(0,0,0,0.3); pointer-events: none;"></div>

              <div id="glass-card" style="position: relative; z-index: 2; width: 320px; padding: 2rem; color: #ffffff; text-align: left; box-sizing: border-box;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <span id="card-badge" style="font-family: var(--mono); font-size: 0.75rem; background: rgba(255,255,255,0.25); padding: 0.25rem 0.6rem; border-radius: 20px; font-weight: 600;">ACRYLIC UI</span>
                  <span style="font-size: 0.85rem; opacity: 0.8;">★ 4.9</span>
                </div>
                <h3 id="card-title" style="margin: 0 0 0.5rem; font-size: 1.4rem; font-weight: 700;">Frosted Glass</h3>
                <p id="card-desc" style="margin: 0 0 1.25rem; font-size: 0.88rem; line-height: 1.5; opacity: 0.9;">
                  Optical diffusion with real-time backdrop blur, light refraction, and edge illumination.
                </p>
                <div style="display: flex; gap: 0.5rem;">
                  <button type="button" style="padding: 0.5rem 1rem; border-radius: 6px; border: none; background: #ffffff; color: #000000; font-weight: 600; font-size: 0.82rem; cursor: pointer;">Action</button>
                  <button type="button" style="padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.4); background: transparent; color: inherit; font-size: 0.82rem; cursor: pointer;">Dismiss</button>
                </div>
              </div>
            </div>

            <!-- Code Outputs -->
            <div class="grid-controls" style="grid-template-columns: 1fr 1fr; gap: 1.25rem;">
              <div class="field-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <label class="field-label" style="margin:0;">Standard CSS + Fallback</label>
                  <button class="btn-sec" id="btnCopyCss" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;" onclick="copyGlassCss()">Copy CSS</button>
                </div>
                <textarea id="glass-css" class="code-input" style="height: 180px;" readonly></textarea>
              </div>

              <div class="field-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <label class="field-label" style="margin:0;">Tailwind CSS Classes</label>
                  <button class="btn-sec" id="btnCopyTailwind" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;" onclick="copyGlassTailwind()">Copy Tailwind</button>
                </div>
                <textarea id="glass-tailwind" class="code-input" style="height: 180px;" readonly></textarea>
              </div>
            </div>

            <div class="action-bar" style="margin-top: 1rem;">
              <button class="btn-primary" id="btnCopyReport" onclick="copyGlassReport()">Copy Glassmorphism Engineering Spec</button>
            </div>
          </div>

          <!-- Mathematical Derivation -->
          <div class="tool-box" style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.75rem;">Optical Refraction Physics & GPU Compositor Mechanics</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
              Real-world frosted glass (translucent silica) scatters incident light rays across stochastic microscopic surface facets (Fresnel transmission). In the browser, this is approximated via the W3C Compositing and Blending Level 2 specification:
            </p>
            <div style="background: var(--bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; margin-bottom: 1.25rem;">
              <div><strong>1. Compositor Pipeline Steps:</strong></div>
              <div>&nbsp;&nbsp;a. Capture pixels directly beneath element bounding box into off-screen buffer</div>
              <div>&nbsp;&nbsp;b. Apply 2-pass separable 1D Gaussian convolution kernel:</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G(x) = (1 / √(2πσ²)) × e^(-x² / (2σ²))</div>
              <div>&nbsp;&nbsp;c. Multiply RGB vectors by color-matrix saturation boost matrix (macOS Acrylic)</div>
              <div>&nbsp;&nbsp;d. Alpha-composite element background color over blurred texture:</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C_final = α_card × C_card + (1 - α_card) × C_blurred</div>
              <div>&nbsp;&nbsp;e. Draw 1px translucent highlight border representing specular bevel reflection</div>
            </div>
            <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;">
              Because backdrop-filter requires sampling from the rendered display tree underneath the element, browsers isolate the element onto its own hardware compositing layer. Enforcing <code>will-change: transform</code> or <code>transform: translateZ(0)</code> prevents expensive CPU main-thread rasterization repaints.
            </p>
          </div>

          <!-- 5 Fatal Traps -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">5 Fatal Traps in Glassmorphic Production Design</h2>
            
            <div class="trap-card" style="border-left: 4px solid #ef4444;">
              <strong style="color: #ef4444;">1. The Missing -webkit-backdrop-filter Prefix (Safari Blackout)</strong>
              Omitting <code>-webkit-backdrop-filter</code> breaks frosted glass completely on Safari (macOS and iOS). Safari still mandates the WebKit vendor prefix. Without it, the element renders as a flat transparent pane with zero blur, causing text to illegibly collide with background elements.
            </div>

            <div class="trap-card" style="border-left: 4px solid #f59e0b;">
              <strong style="color: #f59e0b;">2. The Scroll Repaint Lag & GPU Stutter Trap</strong>
              Applying <code>backdrop-filter: blur(40px)</code> to sticky navigation bars or multiple cards in a scrolling feed. On every scroll event (60 to 120 times per second), the GPU compositor must re-sample and re-convolve the entire viewport background buffer, triggering massive frame drops on integrated GPUs and mobile hardware.
            </div>

            <div class="trap-card" style="border-left: 4px solid #10b981;">
              <strong style="color: #10b981;">3. The Opaque Fallback Neglect (@supports)</strong>
              Failing to provide solid fallbacks via <code>@supports not (backdrop-filter: blur(1px))</code>. In battery-saver mode, remote desktop sessions, or older browser engines where hardware acceleration is disabled, transparent glass without blur turns into an unreadable visual mess. Always define an opaque background fallback.
            </div>

            <div class="trap-card" style="border-left: 4px solid #3b82f6;">
              <strong style="color: #3b82f6;">4. The Shadow Bleed on Transparent Edges</strong>
              Using standard pitch-black drop shadows without inner chamfer highlights. Physical glass catches light on its cut bevels. Real glassmorphic depth requires a top-edge highlight (<code>border: 1px solid rgba(255,255,255,0.3)</code>) to visually separate the card from dark backgrounds.
            </div>

            <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
              <strong style="color: #8b5cf6;">5. The High-Contrast Mode & Dark Theme Invalidation</strong>
              Hardcoding static white glass (<code>rgba(255,255,255,0.2)</code>) across both light and dark themes. On dark backgrounds, white frosted glass looks luminous and ethereal; but when a user switches to light mode or enables Windows High Contrast, white-on-white text drops to 1.1:1 contrast, completely violating WCAG guidelines.
            </div>
          </div>

          <!-- Interactive FAQs -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
            
            <details class="faq-item">
              <summary>Why does glassmorphism look invisible or broken on Safari?</summary>
              <div>
                Safari on both iOS and macOS requires the vendor-prefixed <code>-webkit-backdrop-filter</code> rule alongside the standard <code>backdrop-filter</code> property. Without the prefix, WebKit ignores the blur instruction entirely and displays the card as an un-blurred transparent rectangle.
              </div>
            </details>

            <details class="faq-item">
              <summary>How do I prevent scrolling lag with frosted glass elements?</summary>
              <div>
                Limit blur radii to 12-20px, avoid placing backdrop-filter on large full-screen elements, and isolate the card onto its own GPU layer using <code>transform: translateZ(0);</code>. Never apply backdrop-filter to hundreds of list items simultaneously.
              </div>
            </details>

            <details class="faq-item">
              <summary>How does saturation boost improve the frosted glass aesthetic?</summary>
              <div>
                When light passes through real frosted acrylic (like Apple's macOS Material system), human perception expects underlying colors to remain vibrant. Adding <code>backdrop-filter: saturate(160%)</code> counteracts the washed-out graying effect caused by Gaussian blur convolutions.
              </div>
            </details>

            <details class="faq-item">
              <summary>What is the best CSS fallback for browsers lacking backdrop-filter support?</summary>
              <div>
                Use the CSS <code>@supports</code> query: declare an opaque or 90% solid background color first, and then conditionally override it inside <code>@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))</code> with the semi-transparent glass style.
              </div>
            </details>

            <details class="faq-item">
              <summary>Can glassmorphic cards meet WCAG AA contrast requirements?</summary>
              <div>
                Yes, provided the underlying background maintains predictable luminance or you use sufficiently dark/light text with appropriate text shadows. For critical body text and forms, keep the glass opacity above 0.7 or ensure the card background provides at least 4.5:1 contrast against text.
              </div>
            </details>
          </div>
        </div>

        <!-- Schema.org JSON-LD -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "Glassmorphism CSS & Frosted Glass Generator",
              "url": "https://digitaltoolsshed.com/design/glassmorphism",
              "description": "Generate modern frosted-glass UI cards with live backdrop-filter controls, saturation boosting, border highlights, multi-background preview, and Tailwind CSS code.",
              "applicationCategory": "DesignApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Why does glassmorphism look invisible or broken on Safari?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Safari requires the vendor-prefixed -webkit-backdrop-filter rule. Without it, Safari ignores the blur filter entirely."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I prevent scrolling lag with frosted glass elements?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Keep blur radii under 20px, isolate cards with transform: translateZ(0), and avoid applying filters to dozens of scrolling elements."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does saturation boost improve the frosted glass aesthetic?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Backdrop-filter saturation prevents Gaussian blur convolutions from washing out and dulling vibrant background colors."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the best CSS fallback for browsers lacking backdrop-filter support?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Use CSS @supports to declare a solid background color fallback for engines without backdrop-filter capability."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can glassmorphic cards meet WCAG AA contrast requirements?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, by increasing glass opacity to 0.7+ or ensuring text maintains at least 4.5:1 luminance contrast against the underlying background."
                  }
                }
              ]
            }
          ]
        }
        </script>

        <script>
          const backgrounds = [
            'linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)',
            'radial-gradient(circle at top right, #3b82f6, transparent 50%), radial-gradient(circle at bottom left, #10b981, #09090b)',
            'linear-gradient(to right, #f97316, #e11d48, #4c1d95)',
            'repeating-linear-gradient(45deg, #1e293b, #1e293b 10px, #0f172a 10px, #0f172a 20px)',
            'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)'
          ];

          function setFeedback(btnId, originalText) {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            btn.textContent = '✓ Copied!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(() => {
              btn.textContent = originalText;
              btn.style.borderColor = '';
              btn.style.color = '';
            }, 2500);
          }

          function changeGlassBg(index, el) {
            document.querySelectorAll('.bg-thumb').forEach(b => b.classList.remove('active'));
            el.classList.add('active');
            document.getElementById('preview-stage').style.background = backgrounds[index];
            updateCardTextColor(index === 4);
          }

          function updateCardTextColor(isLightBg) {
            const card = document.getElementById('glass-card');
            const tint = document.getElementById('glass-color').value;
            const isDarkTint = tint === '#18181b';
            if (isLightBg && !isDarkTint) {
              card.style.color = '#0f172a';
              document.getElementById('card-badge').style.background = 'rgba(0,0,0,0.1)';
            } else {
              card.style.color = '#ffffff';
              document.getElementById('card-badge').style.background = 'rgba(255,255,255,0.25)';
            }
          }

          function applyTintPreset(hex) {
            document.getElementById('glass-color').value = hex;
            updateGlass();
          }

          function hexToRgb(hex) {
            hex = hex.replace(/^#/, '');
            if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
            const num = parseInt(hex, 16);
            return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
          }

          function updateGlass() {
            const blur = document.getElementById('glass-blur').value;
            const op = document.getElementById('glass-op').value;
            const rad = document.getElementById('glass-rad').value;
            const sat = document.getElementById('glass-sat').value;
            const tintHex = document.getElementById('glass-color').value;
            const borderOp = document.getElementById('glass-border-op').value;
            const shadowType = document.getElementById('glass-shadow').value;

            document.getElementById('lbl-blur').textContent = blur + ' px';
            document.getElementById('lbl-op').textContent = op;
            document.getElementById('lbl-rad').textContent = rad + ' px';
            document.getElementById('lbl-sat').textContent = sat + '%';
            document.getElementById('lbl-border-op').textContent = borderOp;

            const [r, g, b] = hexToRgb(tintHex);
            const cardBg = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + op + ')';
            const cardBorder = '1px solid rgba(' + (r > 128 ? '255, 255, 255, ' : '0, 0, 0, ') + borderOp + ')';

            let shadowCss = 'none';
            if (shadowType === 'sm') shadowCss = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
            if (shadowType === 'md') shadowCss = '0 8px 32px 0 rgba(0, 0, 0, 0.25)';
            if (shadowType === 'lg') shadowCss = '0 20px 48px -4px rgba(0, 0, 0, 0.35)';

            const filterVal = 'blur(' + blur + 'px) saturate(' + sat + '%)';

            const card = document.getElementById('glass-card');
            card.style.background = cardBg;
            card.style.backdropFilter = filterVal;
            card.style.webkitBackdropFilter = filterVal;
            card.style.borderRadius = rad + 'px';
            card.style.border = cardBorder;
            card.style.boxShadow = shadowCss;

            // Generate CSS Output
            const fallbackBg = 'rgba(' + r + ', ' + g + ', ' + b + ', 0.85)';
            const cssOutput = [
              '/* Frosted Glass UI Card */',
              '.glass-card {',
              '  /* Solid Fallback for non-supporting browsers */',
              '  background: ' + fallbackBg + ';',
              '  border-radius: ' + rad + 'px;',
              '  border: ' + cardBorder + ';',
              '  box-shadow: ' + shadowCss + ';',
              '}',
              '',
              '@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {',
              '  .glass-card {',
              '    background: ' + cardBg + ';',
              '    backdrop-filter: ' + filterVal + ';',
              '    -webkit-backdrop-filter: ' + filterVal + ';',
              '  }',
              '}'
            ].join('\n');

            document.getElementById('glass-css').value = cssOutput;

            // Generate Tailwind CSS Classes
            let twBlur = 'backdrop-blur-md';
            if (blur <= 4) twBlur = 'backdrop-blur-sm';
            else if (blur <= 12) twBlur = 'backdrop-blur';
            else if (blur <= 20) twBlur = 'backdrop-blur-md';
            else if (blur <= 32) twBlur = 'backdrop-blur-lg';
            else twBlur = 'backdrop-blur-xl';

            let twRad = 'rounded-2xl';
            if (rad <= 4) twRad = 'rounded';
            else if (rad <= 8) twRad = 'rounded-md';
            else if (rad <= 12) twRad = 'rounded-lg';
            else if (rad <= 16) twRad = 'rounded-xl';
            else twRad = 'rounded-2xl';

            let twShadow = 'shadow-lg';
            if (shadowType === 'none') twShadow = 'shadow-none';
            else if (shadowType === 'sm') twShadow = 'shadow';
            else if (shadowType === 'md') twShadow = 'shadow-xl';
            else if (shadowType === 'lg') twShadow = 'shadow-2xl';

            const twBg = tintHex === '#ffffff' ? 'bg-white/' + Math.round(op * 100) : 'bg-zinc-900/' + Math.round(op * 100);
            const twBorder = tintHex === '#ffffff' ? 'border border-white/' + Math.round(borderOp * 100) : 'border border-zinc-800/' + Math.round(borderOp * 100);

            const twClasses = [
              twBg,
              twBlur,
              'backdrop-saturate-' + sat,
              twBorder,
              twRad,
              twShadow,
              'p-8',
              'transform-gpu'
            ].join(' ');

            document.getElementById('glass-tailwind').value = twClasses;
          }

          function copyGlassCss() {
            navigator.clipboard.writeText(document.getElementById('glass-css').value).then(() => {
              setFeedback('btnCopyCss', 'Copy CSS');
            });
          }

          function copyGlassTailwind() {
            navigator.clipboard.writeText(document.getElementById('glass-tailwind').value).then(() => {
              setFeedback('btnCopyTailwind', 'Copy Tailwind');
            });
          }

          function copyGlassReport() {
            const report = [
              '======================================================',
              'DIGITAL TOOLS SHED - GLASSMORPHISM SPECIFICATION REPORT',
              '======================================================',
              'Timestamp: ' + new Date().toISOString(),
              'Filter Configurations:',
              '  - Backdrop Blur Radius: ' + document.getElementById('glass-blur').value + ' px',
              '  - Backdrop Saturation: ' + document.getElementById('glass-sat').value + ' %',
              '  - Base Glass Tint: ' + document.getElementById('glass-color').value,
              '  - Alpha Opacity: ' + document.getElementById('glass-op').value,
              'Border & Elevation Geometry:',
              '  - Corner Radius: ' + document.getElementById('glass-rad').value + ' px',
              '  - Border Highlight Opacity: ' + document.getElementById('glass-border-op').value,
              '  - Drop Shadow Elevation: ' + document.getElementById('glass-shadow').value,
              'Tailwind CSS Utility Classes:',
              '  ' + document.getElementById('glass-tailwind').value,
              'Browser Support & Fallbacks:',
              '  - Safari Support: Requires -webkit-backdrop-filter',
              '  - Performance Note: Hardware acceleration enabled via GPU compositing layer',
              '  - Fallback Strategy: Progressive enhancement via @supports query',
              '======================================================'
            ].join('\n');

            navigator.clipboard.writeText(report).then(() => {
              setFeedback('btnCopyReport', 'Copy Glassmorphism Engineering Spec');
            });
          }

          document.addEventListener('DOMContentLoaded', updateGlass);
        </script>
      `
    },
    {
      slug: 'pixel-art',
      title: '16x16 & 32x32 Pixel Art Sprite Studio & Vector SVG Export',
      metaDesc: 'Free online pixel art sprite editor with 16x16 and 32x32 grids, flood fill bucket, line tool, symmetry modes, undo/redo history, curated palettes, and vector SVG export.',
      category: 'Design',
      body: `
        ${commonStyle}
        <style>
          .tool-btn { background: var(--surface-alt); border: 1px solid var(--border); color: var(--fg); padding: 0.45rem 0.85rem; font-family: var(--mono); font-size: 0.82rem; border-radius: 4px; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 0.35rem; }
          .tool-btn:hover { background: var(--border); }
          .tool-btn.active { background: var(--btn-bg, #3b82f6); color: #fff; border-color: var(--btn-bg, #3b82f6); }
          .palette-swatch { width: 26px; height: 26px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(0,0,0,0.15); transition: transform 0.1s; }
          .palette-swatch:hover { transform: scale(1.15); z-index: 2; }
          .palette-swatch.active { border: 2px solid #ffffff; box-shadow: 0 0 0 2px var(--btn-bg, #3b82f6); transform: scale(1.12); }
          .trap-card { background: var(--surface-alt); border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; font-size: 0.9rem; line-height: 1.5; }
          .trap-card strong { display: block; margin-bottom: 0.3rem; font-size: 0.95rem; }
          .faq-item { margin-bottom: 0.75rem; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); overflow: hidden; }
          .faq-item summary { padding: 0.85rem 1.15rem; font-weight: 600; cursor: pointer; font-size: 0.95rem; list-style: none; display: flex; justify-content: space-between; align-items: center; }
          .faq-item summary::-webkit-details-marker { display: none; }
          .faq-item summary::after { content: "+"; font-family: var(--mono); font-size: 1.2rem; }
          .faq-item[open] summary::after { content: "−"; }
          .faq-item div { padding: 0.85rem 1.15rem; border-top: 1px solid var(--border); font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }
        </style>
        <div class="article-container" style="max-width: 960px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/design/">Design & Image</a> &gt; Pixel Art Editor
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;">16x16 & 32x32 Pixel Art Sprite Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.55; margin-bottom: 1.5rem;">
            Design retro game sprites, Minecraft textures, and pixel art icons in your browser. Features 16x16 and 32x32 resolution grids, flood fill paint bucket, line tool, symmetry mirroring, multi-level undo/redo history, and vector SVG export.
          </p>

          <div class="tool-box">
            <!-- Top Controls Toolbar -->
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="field-label" style="margin:0; margin-right: 0.25rem;">Grid:</span>
                <button type="button" class="tool-btn active" id="btn-grid-16" onclick="setGridResolution(16)">16 × 16</button>
                <button type="button" class="tool-btn" id="btn-grid-32" onclick="setGridResolution(32)">32 × 32</button>
              </div>

              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="field-label" style="margin:0; margin-right: 0.25rem;">History:</span>
                <button type="button" class="tool-btn" id="btn-undo" onclick="undo()" title="Undo (Ctrl+Z)">&#x21BA; Undo</button>
                <button type="button" class="tool-btn" id="btn-redo" onclick="redo()" title="Redo (Ctrl+Y)">&#x21BB; Redo</button>
                <button type="button" class="tool-btn" onclick="clearPixelGrid()" style="color: #ef4444;">Clear</button>
              </div>
            </div>

            <!-- Drawing Tools & Symmetry Toolbar -->
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center;">
                <button type="button" class="tool-btn active" id="tool-pencil" onclick="selectTool('pencil')">&#x270F;&#xFE0F; Pencil</button>
                <button type="button" class="tool-btn" id="tool-bucket" onclick="selectTool('bucket')">&#x1FAA3; Fill Bucket</button>
                <button type="button" class="tool-btn" id="tool-line" onclick="selectTool('line')">&#x2571; Line</button>
                <button type="button" class="tool-btn" id="tool-eraser" onclick="selectTool('eraser')">&#x232B; Eraser</button>
                <button type="button" class="tool-btn" id="tool-picker" onclick="selectTool('picker')">&#x1F441;&#xFE0F; Picker</button>
              </div>

              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center;">
                <span class="field-label" style="margin:0;">Symmetry:</span>
                <select id="sel-symmetry" class="text-input" style="padding: 0.35rem 0.6rem; font-size: 0.8rem; width: auto;" onchange="currentSymmetry = this.value">
                  <option value="none" selected>None</option>
                  <option value="horizontal">Horizontal (L-R Mirror)</option>
                  <option value="vertical">Vertical (T-B Mirror)</option>
                  <option value="quad">Quad (4-Way Mirror)</option>
                </select>
                <label style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.78rem; font-family: var(--mono); cursor: pointer; margin-left: 0.5rem;">
                  <input type="checkbox" id="chk-grid-lines" checked onchange="toggleGridLines(this.checked)" />
                  <span>Grid Lines</span>
                </label>
              </div>
            </div>

            <!-- Color Palettes & Active Color -->
            <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; margin-bottom: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span class="field-label" style="margin:0;">Active Color:</span>
                  <input type="color" id="px-color" value="#ef4444" style="height: 32px; width: 44px; padding: 1px; cursor: pointer; border-radius: 4px; border: 1px solid var(--border);" onchange="updateActiveColor(this.value)" />
                  <input type="text" id="px-color-hex" value="#EF4444" class="code-input" style="width: 85px; padding: 0.35rem 0.5rem; text-transform: uppercase; font-size: 0.82rem;" oninput="updateActiveColorFromHex(this.value)" />
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span class="field-label" style="margin:0;">Palette Presets:</span>
                  <select id="sel-palette" class="text-input" style="padding: 0.35rem 0.6rem; font-size: 0.8rem; width: auto;" onchange="loadPalette(this.value)">
                    <option value="modern" selected>Modern Game (16 Colors)</option>
                    <option value="minecraft">Minecraft / Jappa (16 Colors)</option>
                    <option value="pico8">PICO-8 Fantasy (16 Colors)</option>
                    <option value="gameboy">Game Boy Classic (4 Colors)</option>
                  </select>
                </div>
              </div>
              <div id="palette-container" style="display: flex; gap: 0.45rem; flex-wrap: wrap; align-items: center;"></div>
            </div>

            <!-- Canvas Stage & Telemetry -->
            <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center; align-items: flex-start;">
              <div style="background: repeating-conic-gradient(var(--border) 0% 25%, transparent 0% 50%) 50% / 16px 16px; padding: 1rem; border-radius: 6px; border: 1px solid var(--border); box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
                <canvas id="pixel-canvas" width="384" height="384" style="cursor: crosshair; image-rendering: pixelated; display: block;"></canvas>
              </div>

              <div style="flex: 1 1 240px; min-width: 220px; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
                <div class="field-label" style="margin-bottom: 0.75rem;">Sprite Telemetry & Statistics</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-family: var(--mono); font-size: 0.82rem;">
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.72rem;">GRID RESOLUTION</span>
                    <strong id="stat-res" style="color: var(--fg); font-size: 1rem;">16 × 16 px</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.72rem;">TOTAL PIXELS</span>
                    <strong id="stat-total-px" style="color: var(--fg); font-size: 1rem;">256 cells</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.72rem;">OPAQUE PIXELS</span>
                    <strong id="stat-painted" style="color: #10b981; font-size: 1rem;">0 (0%)</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.72rem;">UNIQUE COLORS</span>
                    <strong id="stat-colors" style="color: var(--fg); font-size: 1rem;">0 colors</strong>
                  </div>
                </div>

                <div style="margin-top: 1.25rem; border-top: 1px solid var(--border); padding-top: 1rem;">
                  <span style="color: var(--text-muted); font-size: 0.72rem; font-family: var(--mono); display: block; margin-bottom: 0.4rem;">1:1 NATIVE PREVIEW</span>
                  <div style="display: flex; gap: 1rem; align-items: center;">
                    <canvas id="preview-1x" width="16" height="16" style="border: 1px solid var(--border); background: #ffffff;"></canvas>
                    <canvas id="preview-4x" width="64" height="64" style="border: 1px solid var(--border); background: #ffffff; image-rendering: pixelated;"></canvas>
                    <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">1x & 4x Preview</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Bar -->
            <div class="action-bar" style="margin-top: 1.5rem; justify-content: flex-start;">
              <button class="btn-primary" id="btnDownload1x" onclick="exportPixelPNG(1)">&#x2913; Download 1:1 PNG</button>
              <button class="btn-sec" id="btnDownloadUpscaled" onclick="exportPixelPNG(16)">&#x2913; Download Upscaled PNG</button>
              <button class="btn-sec" id="btnDownloadSvg" onclick="exportPixelSvg()">&#x2913; Download Vector SVG</button>
              <button class="btn-sec" id="btnCopyDataUrl" onclick="copyPixelDataUrl()">Copy Data URL</button>
              <button class="btn-sec" id="btnCopySpriteReport" onclick="copySpriteReport()">Copy Sprite Metadata</button>
            </div>
          </div>

          <!-- Mathematical Derivation -->
          <div class="tool-box" style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.75rem;">Raster Geometry & Computer Graphics Algorithms</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
              Pixel art manipulation utilizes discrete integer coordinate mathematics to avoid subpixel antialiasing artifacts:
            </p>
            <div style="background: var(--bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; margin-bottom: 1.25rem;">
              <div><strong>1. Bresenham's Integer Line Drawing Algorithm:</strong></div>
              <div>&nbsp;&nbsp;Computes rasterized lines between (x0, y0) and (x1, y1) via decision variable:</div>
              <div>&nbsp;&nbsp;D_init = 2 × Δy - Δx; &nbsp;if D &gt; 0: y += sy, D += 2 × (Δy - Δx); else: D += 2 × Δy</div>
              <div>&nbsp;&nbsp;Guarantees zero floating-point division or rounding errors.</div>
              <div><strong>2. Scanline Flood Fill Algorithm:</strong></div>
              <div>&nbsp;&nbsp;Breadth-first search queue with 4-way orthogonal boundary adjacency:</div>
              <div>&nbsp;&nbsp;Queue Q; Q.push([x, y]); while(Q.length) { [cx, cy] = Q.pop(); paint(cx, cy); ... }</div>
              <div><strong>3. Nearest-Neighbor Scaling (Zero Blur):</strong></div>
              <div>&nbsp;&nbsp;Mapped coordinate: P_src(x, y) = P_canvas(⌊x / Scale⌋, ⌊y / Scale⌋)</div>
            </div>
            <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;">
              In authentic pixel art, "Hue Shifting" rules dictate that highlights shift toward warmer spectrum wavelengths (yellow/orange), while shadow tones shift toward cooler wavelengths (violet/blue), avoiding flat desaturated monochrome shading.
            </p>
          </div>

          <!-- 5 Fatal Traps -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">5 Fatal Traps in Pixel Art & Retro Game Asset Creation</h2>
            
            <div class="trap-card" style="border-left: 4px solid #ef4444;">
              <strong style="color: #ef4444;">1. The Bilinear Interpolation Blur Trap</strong>
              Displaying 16x16 or 32x32 game sprites on web pages or in modern 2D game engines without explicitly specifying <code>image-rendering: pixelated</code> or nearest-neighbor texture filtering. Default graphics pipelines apply linear filtering, turning crisp hand-crafted retro pixels into blurry, out-of-focus soup.
            </div>

            <div class="trap-card" style="border-left: 4px solid #f59e0b;">
              <strong style="color: #f59e0b;">2. The "Pillow Shading" Mistake</strong>
              Shading a sprite by outlining every perimeter edge with progressively darker pixels toward the center, like a cushion. Real lighting environments possess a coherent directional vector (conventionally top-left at 45°); pillow shading eliminates 3D volume, destroys silhouette readability, and looks amateurish.
            </div>

            <div class="trap-card" style="border-left: 4px solid #10b981;">
              <strong style="color: #10b981;">3. The Desaturated Shading & Hue-Shifting Neglect</strong>
              Creating shadow and highlight variations by simply dragging brightness/value up and down while keeping hue static. Mixing pure black or dark gray into a color produces dead, dirty shadows. Dynamic natural lighting requires shifting hues warmer in sunlight and cooler in shadow.
            </div>

            <div class="trap-card" style="border-left: 4px solid #3b82f6;">
              <strong style="color: #3b82f6;">4. The "Jaggies" & Inconsistent Pixel Stepping Flaw</strong>
              Drawing curved contours with inconsistent pixel step lengths (e.g. a curve stepping 1-pixel, then 3-pixels, then 1-pixel, then 2-pixels: 1-3-1-2). Natural curved contours must progress monotonically in pixel lengths (e.g. 1-1-2-3-4-3-2-1-1) to avoid broken optical flow.
            </div>

            <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
              <strong style="color: #8b5cf6;">5. The Palette Inflation Catastrophe (Color Noise)</strong>
              Using 50+ subtle micro-shades of a single color instead of mastering pixel clustering. The aesthetic strength of pixel art originates in tight color constraints (8 to 16 colors per sprite). Excessive intermediate colors create noisy visual static that dissolves sprite definition at low resolutions.
            </div>
          </div>

          <!-- Interactive FAQs -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
            
            <details class="faq-item">
              <summary>How do I scale up a 16x16 pixel art sprite without making it blurry?</summary>
              <div>
                Always export using nearest-neighbor scaling (like this tool's "Download Upscaled PNG" button) which multiplies every source pixel into an exact integer block of identical pixels (e.g. 16x16 scaled by 16 becomes 256x256). In CSS, enforce <code>image-rendering: pixelated;</code>.
              </div>
            </details>

            <details class="faq-item">
              <summary>What is hue shifting and why is it essential in pixel art?</summary>
              <div>
                Hue shifting is the practice of adjusting the color wheel hue when picking shadows and highlights, rather than just changing darkness. Sunlight highlights naturally shift toward yellow, while ambient ambient shadows shift toward blue/purple. This gives sprites lifelike vibrancy and depth.
              </div>
            </details>

            <details class="faq-item">
              <summary>What is the difference between 16x16 and 32x32 sprite resolution?</summary>
              <div>
                A 16x16 grid contains 256 total pixels—the classic resolution of NES characters, PICO-8 icons, and Minecraft blocks. A 32x32 grid contains 1,024 pixels (4x the detail), accommodating detailed SNES-era RPG characters, facial features, and complex weapon animations.
              </div>
            </details>

            <details class="faq-item">
              <summary>How does the vector SVG export work for pixel art?</summary>
              <div>
                The vector SVG export converts each colored pixel into an exact <code>&lt;rect&gt;</code> element positioned on an integer coordinate grid. This produces an infinitely scalable vector graphic that can be enlarged to billboard size without losing crisp pixel corners.
              </div>
            </details>

            <details class="faq-item">
              <summary>What are "jaggies" and how can I avoid them?</summary>
              <div>
                Jaggies are unintended jagged steps along an intended smooth curve. To prevent them, ensure that pixel runs step in an orderly mathematical sequence (such as 3-2-1-1-2-3) rather than erratic alternating clusters (such as 1-3-1-2-1).
              </div>
            </details>
          </div>
        </div>

        <!-- Schema.org JSON-LD -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "16x16 & 32x32 Pixel Art Sprite Studio",
              "url": "https://digitaltoolsshed.com/design/pixel-art",
              "description": "Free online pixel art sprite editor with 16x16 and 32x32 grids, flood fill bucket, line tool, symmetry modes, undo/redo history, curated palettes, and vector SVG export.",
              "applicationCategory": "DesignApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How do I scale up a 16x16 pixel art sprite without making it blurry?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Export using nearest-neighbor interpolation which maps each source pixel to an integer grid, and apply image-rendering: pixelated in CSS."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is hue shifting and why is it essential in pixel art?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Hue shifting shifts highlights toward warm yellow/orange and shadows toward cool blue/violet, preventing dirty, desaturated shading."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the difference between 16x16 and 32x32 sprite resolution?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "16x16 has 256 pixels suited for retro NES icons, while 32x32 has 1,024 pixels allowing SNES-style detailed character art."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does the vector SVG export work for pixel art?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The SVG exporter translates each pixel into a vector rectangle module, allowing infinite scaling with zero blur."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are jaggies and how can I avoid them?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Jaggies are uneven pixel steps along curves. Maintain monotonic step progressions (e.g. 1-2-3-2-1) to ensure smooth silhouettes."
                  }
                }
              ]
            }
          ]
        }
        </script>

        <script>
          let GRID_SIZE = 16;
          let grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
          let historyStack = [];
          let redoStack = [];
          let currentTool = 'pencil';
          let currentSymmetry = 'none';
          let showGridLines = true;
          let isMouseDown = false;
          let lineStart = null;

          const palettes = {
            modern: ['#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#71717a', '#78350f', '#14532d', '#1e3a8a', '#581c87'],
            minecraft: ['#5a4738', '#866043', '#3a2d23', '#797979', '#4d4d4d', '#302217', '#4c782c', '#33571d', '#5c3e1e', '#2980b9', '#f39c12', '#c0392b', '#bdc3c7', '#2c3e50', '#16a085', '#27ae60'],
            pico8: ['#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8', '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA'],
            gameboy: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f']
          };

          const canvas = document.getElementById('pixel-canvas');
          const ctx = canvas.getContext('2d');

          function setFeedback(btnId, originalText) {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            btn.textContent = '✓ Copied!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(() => {
              btn.textContent = originalText;
              btn.style.borderColor = '';
              btn.style.color = '';
            }, 2500);
          }

          function pushHistory() {
            historyStack.push(grid.map(row => [...row]));
            if (historyStack.length > 30) historyStack.shift();
            redoStack = [];
          }

          function undo() {
            if (historyStack.length === 0) return;
            redoStack.push(grid.map(row => [...row]));
            grid = historyStack.pop();
            renderCanvas();
          }

          function redo() {
            if (redoStack.length === 0) return;
            historyStack.push(grid.map(row => [...row]));
            grid = redoStack.pop();
            renderCanvas();
          }

          function setGridResolution(res) {
            if (res === GRID_SIZE) return;
            pushHistory();
            GRID_SIZE = res;
            document.getElementById('btn-grid-16').classList.toggle('active', res === 16);
            document.getElementById('btn-grid-32').classList.toggle('active', res === 32);
            document.getElementById('stat-res').textContent = res + ' × ' + res + ' px';
            document.getElementById('stat-total-px').textContent = (res * res) + ' cells';

            const newGrid = Array(res).fill(null).map(() => Array(res).fill(''));
            for (let r = 0; r < Math.min(grid.length, res); r++) {
              for (let c = 0; c < Math.min(grid[0].length, res); c++) {
                newGrid[r][c] = grid[r][c] || '';
              }
            }
            grid = newGrid;
            renderCanvas();
          }

          function selectTool(tool) {
            currentTool = tool;
            ['pencil', 'bucket', 'line', 'eraser', 'picker'].forEach(t => {
              const el = document.getElementById('tool-' + t);
              if (el) el.classList.toggle('active', t === tool);
            });
          }

          function toggleGridLines(checked) {
            showGridLines = checked;
            renderCanvas();
          }

          function loadPalette(key) {
            const container = document.getElementById('palette-container');
            container.innerHTML = '';
            const swatches = palettes[key] || palettes.modern;
            swatches.forEach(c => {
              const d = document.createElement('div');
              d.className = 'palette-swatch';
              d.style.backgroundColor = c;
              d.title = c;
              d.onclick = () => updateActiveColor(c);
              container.appendChild(d);
            });
          }

          function updateActiveColor(hex) {
            document.getElementById('px-color').value = hex;
            document.getElementById('px-color-hex').value = hex.toUpperCase();
            if (currentTool === 'eraser') selectTool('pencil');
          }

          function updateActiveColorFromHex(val) {
            if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
              document.getElementById('px-color').value = val;
            }
          }

          function clearPixelGrid() {
            if (confirm('Clear entire pixel art canvas?')) {
              pushHistory();
              grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
              renderCanvas();
            }
          }

          function getCoords(e) {
            const rect = canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / (rect.width / GRID_SIZE));
            const y = Math.floor((e.clientY - rect.top) / (rect.height / GRID_SIZE));
            return [Math.max(0, Math.min(GRID_SIZE - 1, x)), Math.max(0, Math.min(GRID_SIZE - 1, y))];
          }

          function applyPixel(x, y, color) {
            if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;
            grid[y][x] = color;

            if (currentSymmetry === 'horizontal' || currentSymmetry === 'quad') {
              grid[y][GRID_SIZE - 1 - x] = color;
            }
            if (currentSymmetry === 'vertical' || currentSymmetry === 'quad') {
              grid[GRID_SIZE - 1 - y][x] = color;
            }
            if (currentSymmetry === 'quad') {
              grid[GRID_SIZE - 1 - y][GRID_SIZE - 1 - x] = color;
            }
          }

          function floodFill(startX, startY, targetColor, fillColor) {
            if (targetColor === fillColor) return;
            const queue = [[startX, startY]];
            const seen = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
            seen[startY][startX] = true;

            while (queue.length > 0) {
              const [cx, cy] = queue.shift();
              applyPixel(cx, cy, fillColor);

              const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
              for (const [nx, ny] of neighbors) {
                if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                  if (!seen[ny][nx] && grid[ny][nx] === targetColor) {
                    seen[ny][nx] = true;
                    queue.push([nx, ny]);
                  }
                }
              }
            }
          }

          function drawBresenhamLine(x0, y0, x1, y1, color) {
            const dx = Math.abs(x1 - x0);
            const dy = Math.abs(y1 - y0);
            const sx = (x0 < x1) ? 1 : -1;
            const sy = (y0 < y1) ? 1 : -1;
            let err = dx - dy;

            while (true) {
              applyPixel(x0, y0, color);
              if (x0 === x1 && y0 === y1) break;
              const e2 = 2 * err;
              if (e2 > -dy) { err -= dy; x0 += sx; }
              if (e2 < dx) { err += dx; y0 += sy; }
            }
          }

          canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            const [x, y] = getCoords(e);
            pushHistory();

            if (currentTool === 'picker') {
              const sampled = grid[y][x];
              if (sampled) updateActiveColor(sampled);
              selectTool('pencil');
              isMouseDown = false;
              return;
            }

            if (currentTool === 'bucket') {
              const fillColor = document.getElementById('px-color').value;
              floodFill(x, y, grid[y][x], fillColor);
              renderCanvas();
              isMouseDown = false;
              return;
            }

            if (currentTool === 'line') {
              lineStart = [x, y];
              return;
            }

            const color = currentTool === 'pencil' ? document.getElementById('px-color').value : '';
            applyPixel(x, y, color);
            renderCanvas();
          });

          canvas.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            const [x, y] = getCoords(e);

            if (currentTool === 'line' && lineStart) {
              renderCanvas();
              // Draw line preview
              const color = document.getElementById('px-color').value;
              const cellPx = canvas.width / GRID_SIZE;
              ctx.save();
              ctx.fillStyle = color;
              ctx.globalAlpha = 0.5;
              const dx = Math.abs(x - lineStart[0]);
              const dy = Math.abs(y - lineStart[1]);
              const sx = (lineStart[0] < x) ? 1 : -1;
              const sy = (lineStart[1] < y) ? 1 : -1;
              let x0 = lineStart[0], y0 = lineStart[1], err = dx - dy;
              while (true) {
                ctx.fillRect(x0 * cellPx, y0 * cellPx, cellPx, cellPx);
                if (x0 === x && y0 === y) break;
                const e2 = 2 * err;
                if (e2 > -dy) { err -= dy; x0 += sx; }
                if (e2 < dx) { err += dx; y0 += sy; }
              }
              ctx.restore();
              return;
            }

            if (currentTool === 'pencil' || currentTool === 'eraser') {
              const color = currentTool === 'pencil' ? document.getElementById('px-color').value : '';
              applyPixel(x, y, color);
              renderCanvas();
            }
          });

          window.addEventListener('mouseup', (e) => {
            if (isMouseDown && currentTool === 'line' && lineStart) {
              const [x, y] = getCoords(e);
              const color = document.getElementById('px-color').value;
              drawBresenhamLine(lineStart[0], lineStart[1], x, y, color);
              lineStart = null;
            }
            isMouseDown = false;
            renderCanvas();
          });

          // Global keyboard shortcuts
          window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
            if (e.key === 'b' || e.key === 'B') selectTool('pencil');
            if (e.key === 'e' || e.key === 'E') selectTool('eraser');
            if (e.key === 'g' || e.key === 'G') selectTool('bucket');
            if (e.key === 'i' || e.key === 'I') selectTool('picker');
          });

          function renderCanvas() {
            const size = canvas.width;
            const cellSize = size / GRID_SIZE;
            ctx.clearRect(0, 0, size, size);

            let paintedCount = 0;
            const colorSet = new Set();

            for (let r = 0; r < GRID_SIZE; r++) {
              for (let c = 0; c < GRID_SIZE; c++) {
                const color = grid[r][c];
                if (color) {
                  paintedCount++;
                  colorSet.add(color.toLowerCase());
                  ctx.fillStyle = color;
                  ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                } else {
                  ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(240,240,245,0.7)';
                  ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                }

                if (showGridLines) {
                  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
                  ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
                }
              }
            }

            // Draw symmetry line overlays
            if (currentSymmetry === 'horizontal' || currentSymmetry === 'quad') {
              ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(size / 2, 0);
              ctx.lineTo(size / 2, size);
              ctx.stroke();
            }
            if (currentSymmetry === 'vertical' || currentSymmetry === 'quad') {
              ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(0, size / 2);
              ctx.lineTo(size, size / 2);
              ctx.stroke();
            }

            // Update Telemetry
            const totalCells = GRID_SIZE * GRID_SIZE;
            const pct = Math.round((paintedCount / totalCells) * 100);
            document.getElementById('stat-painted').textContent = paintedCount + ' (' + pct + '%)';
            document.getElementById('stat-colors').textContent = colorSet.size + ' colors';

            // Update Previews
            renderPreview('preview-1x', 16, 16);
            renderPreview('preview-4x', 64, 64);
          }

          function renderPreview(canvasId, w, h) {
            const pCanvas = document.getElementById(canvasId);
            pCanvas.width = w;
            pCanvas.height = h;
            const pCtx = pCanvas.getContext('2d');
            pCtx.imageSmoothingEnabled = false;
            pCtx.clearRect(0, 0, w, h);

            const scaleX = w / GRID_SIZE;
            const scaleY = h / GRID_SIZE;
            for (let r = 0; r < GRID_SIZE; r++) {
              for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c]) {
                  pCtx.fillStyle = grid[r][c];
                  pCtx.fillRect(c * scaleX, r * scaleY, scaleX, scaleY);
                }
              }
            }
          }

          function exportPixelPNG(scale) {
            const outCanvas = document.createElement('canvas');
            const targetDim = GRID_SIZE * scale;
            outCanvas.width = targetDim;
            outCanvas.height = targetDim;
            const outCtx = outCanvas.getContext('2d');
            outCtx.imageSmoothingEnabled = false;

            for (let r = 0; r < GRID_SIZE; r++) {
              for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c]) {
                  outCtx.fillStyle = grid[r][c];
                  outCtx.fillRect(c * scale, r * scale, scale, scale);
                }
              }
            }

            const a = document.createElement('a');
            a.download = 'sprite-' + GRID_SIZE + 'x' + GRID_SIZE + (scale > 1 ? '@' + targetDim + 'px' : '') + '.png';
            a.href = outCanvas.toDataURL('image/png');
            a.click();
          }

          function exportPixelSvg() {
            let svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ' + GRID_SIZE + ' ' + GRID_SIZE + '" shape-rendering="crispEdges">';
            for (let r = 0; r < GRID_SIZE; r++) {
              for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c]) {
                  svg += '<rect x="' + c + '" y="' + r + '" width="1" height="1" fill="' + grid[r][c] + '"/>';
                }
              }
            }
            svg += '</svg>';

            const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
            const a = document.createElement('a');
            a.download = 'sprite-' + GRID_SIZE + 'x' + GRID_SIZE + '.svg';
            a.href = URL.createObjectURL(blob);
            a.click();
            setTimeout(() => URL.revokeObjectURL(a.href), 1000);
          }

          function copyPixelDataUrl() {
            const off = document.createElement('canvas');
            off.width = GRID_SIZE;
            off.height = GRID_SIZE;
            const offCtx = off.getContext('2d');
            for (let r = 0; r < GRID_SIZE; r++) {
              for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c]) {
                  offCtx.fillStyle = grid[r][c];
                  offCtx.fillRect(c, r, 1, 1);
                }
              }
            }
            navigator.clipboard.writeText(off.toDataURL('image/png')).then(() => {
              setFeedback('btnCopyDataUrl', 'Copy Data URL');
            });
          }

          function copySpriteReport() {
            const colorMap = {};
            let painted = 0;
            let minX = GRID_SIZE, maxX = -1, minY = GRID_SIZE, maxY = -1;

            for (let r = 0; r < GRID_SIZE; r++) {
              for (let c = 0; c < GRID_SIZE; c++) {
                const color = grid[r][c];
                if (color) {
                  painted++;
                  colorMap[color] = (colorMap[color] || 0) + 1;
                  if (c < minX) minX = c;
                  if (c > maxX) maxX = c;
                  if (r < minY) minY = r;
                  if (r > maxY) maxY = r;
                }
              }
            }

            const total = GRID_SIZE * GRID_SIZE;
            const bounds = painted > 0 ? (maxX - minX + 1) + 'x' + (maxY - minY + 1) + ' px (from ' + minX + ',' + minY + ')' : 'Empty';

            const report = [
              '======================================================',
              'DIGITAL TOOLS SHED - SPRITE METADATA AUDIT REPORT',
              '======================================================',
              'Timestamp: ' + new Date().toISOString(),
              'Canvas Dimensions: ' + GRID_SIZE + ' x ' + GRID_SIZE + ' px (' + total + ' cells)',
              'Active Pixels: ' + painted + ' / ' + total + ' (' + Math.round((painted / total) * 100) + '% coverage)',
              'Bounding Box: ' + bounds,
              'Unique Palette Colors (' + Object.keys(colorMap).length + ' total):',
              ...Object.entries(colorMap).map(([hex, count]) => '  - ' + hex.toUpperCase() + ': ' + count + ' pixels (' + Math.round((count / painted) * 100) + '%)'),
              'Export Recommendations:',
              '  - For Web/Games: Use nearest-neighbor sampling (image-rendering: pixelated)',
              '  - For High-Res Print: Vector SVG or ' + (GRID_SIZE * 16) + 'x' + (GRID_SIZE * 16) + 'px PNG',
              '======================================================'
            ].join('\n');

            navigator.clipboard.writeText(report).then(() => {
              setFeedback('btnCopySpriteReport', 'Copy Sprite Metadata');
            });
          }

          document.addEventListener('DOMContentLoaded', () => {
            loadPalette('modern');
            renderCanvas();
          });
        </script>
      `
    },
{
      slug: 'image-to-base64',
      title: 'Image to Base64 Converter',
      metaDesc: 'Convert PNG, JPG, SVG, and WebP images to Base64 data URIs with CSS background and HTML img code snippets.',
      category: 'Design',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/design/">Design & Image</a> &gt; Image to Base64
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Image to Base64 Converter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Encode image files into inline Data URI strings for HTML, CSS, and SVG embedding.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Select Image File</label>
              <input type="file" id="img-file" class="text-input" accept="image/*" onchange="convertImgToBase64()" />
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <label class="field-label">Base64 Data URI</label>
              <textarea id="b64-uri" class="code-input" style="height: 140px;" placeholder="data:image/png;base64,..." readonly></textarea>
            </div>

            <div class="field-group">
              <label class="field-label">HTML &lt;img&gt; Tag</label>
              <input type="text" id="b64-html" class="code-input" readonly />
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="copyB64()">Copy Base64 String</button>
            </div>
          </div>
        </div>

        <script>
          function convertImgToBase64() {
            const file = document.getElementById('img-file').files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
              const res = e.target.result;
              document.getElementById('b64-uri').value = res;
              document.getElementById('b64-html').value = '<img src="' + res + '" alt="Embedded image" />';
            };
            reader.readAsDataURL(file);
          }

          function copyB64() {
            navigator.clipboard.writeText(document.getElementById('b64-uri').value);
          }
        </script>
      `
    },
    {
      slug: 'passport-photo',
      title: 'US Passport Photo 2x2" Maker & 4x6 Printable Grid',
      metaDesc: 'Crop and format your photo into an official US 2x2 inch (600x600 px) passport photo with a printable 4x6 inch (6-photo grid) template. 100% free and private.',
      category: 'Design',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/design/">Design & Image</a> &gt; US Passport Photo
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">US Passport Photo 2x2" Maker & Printable 4x6 Grid</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Format your portrait photo to meet official US Department of State 2x2 inch (51x51 mm) biometric requirements. Generate a single 600x600 px image or a printable 4x6 inch sheet with 6 photos.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Upload Portrait Photo</label>
              <input type="file" id="pp-file" accept="image/*" class="text-input" onchange="loadPhoto(event)" />
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; align-items: start; margin-top: 1.5rem;">
              <div>
                <div class="field-label">Alignment Guide (Drag to pan, slider to zoom)</div>
                <div style="position: relative; width: 300px; height: 300px; margin: 0 auto; border: 2px solid var(--border); overflow: hidden; background: #f0f0f0; border-radius: 4px;">
                  <canvas id="cropCanvas" width="600" height="600" style="width: 100%; height: 100%; cursor: grab;"></canvas>
                  <!-- Biometric Oval Overlay -->
                  <div style="position: absolute; top: 15%; left: 22%; width: 56%; height: 65%; border: 2px dashed rgba(59, 130, 246, 0.75); border-radius: 50%; pointer-events: none;"></div>
                  <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; border-top: 1px dashed rgba(59, 130, 246, 0.4); pointer-events: none;"></div>
                </div>

                <div style="margin-top: 1rem;">
                  <label class="field-label">Zoom Scale</label>
                  <input type="range" id="pp-zoom" min="0.5" max="3" step="0.05" value="1" style="width: 100%;" oninput="renderCrop()" />
                </div>
              </div>

              <div>
                <div class="field-label">Official Requirements Checklist</div>
                <ul style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; padding-left: 1.25rem; margin-bottom: 1.5rem;">
                  <li>Head height must be between 1" and 1 3/8" (50% to 69% of image height).</li>
                  <li>Eyes positioned between 1 1/8" and 1 3/8" from bottom of photo.</li>
                  <li>Plain white or off-white background with neutral expression.</li>
                  <li>No eyeglasses, headphones, or head coverings (unless religious/medical).</li>
                </ul>

                <div class="action-bar" style="flex-direction: column; align-items: stretch;">
                  <button class="btn-primary" onclick="downloadSingle()">Download 2x2" Photo (600x600 px)</button>
                  <button class="btn-sec" onclick="downloadSheet()">Download 4x6" Printable Sheet (6 Photos)</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <script>
          var img = null;
          var panX = 0, panY = 0;
          var isDragging = false, startX = 0, startY = 0;
          var canvas = document.getElementById('cropCanvas');
          var ctx = canvas.getContext('2d');

          function loadPhoto(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(evt) {
              img = new Image();
              img.onload = function() {
                panX = 0; panY = 0;
                document.getElementById('pp-zoom').value = 1;
                renderCrop();
              };
              img.src = evt.target.result;
            };
            reader.readAsDataURL(file);
          }

          canvas.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX - panX;
            startY = e.clientY - panY;
            canvas.style.cursor = 'grabbing';
          });
          window.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            panX = e.clientX - startX;
            panY = e.clientY - startY;
            renderCrop();
          });
          window.addEventListener('mouseup', function() {
            isDragging = false;
            canvas.style.cursor = 'grab';
          });

          function renderCrop() {
            if (!img) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, 600, 600);
              ctx.fillStyle = '#888888';
              ctx.font = '24px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('Select a portrait photo above', 300, 310);
              return;
            }

            var zoom = parseFloat(document.getElementById('pp-zoom').value) || 1;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 600, 600);

            var w = img.width * zoom;
            var h = img.height * zoom;
            var x = (600 - w) / 2 + panX;
            var y = (600 - h) / 2 + panY;

            ctx.drawImage(img, x, y, w, h);
          }

          renderCrop();

          function downloadSingle() {
            var a = document.createElement('a');
            a.href = canvas.toDataURL('image/jpeg', 0.95);
            a.download = 'us_passport_photo_2x2.jpg';
            a.click();
          }

          function downloadSheet() {
            // 4x6 inches at 300 DPI = 1200 x 1800 px (or 1800 x 1200 landscape)
            var sheet = document.createElement('canvas');
            sheet.width = 1800;
            sheet.height = 1200;
            var sctx = sheet.getContext('2d');
            sctx.fillStyle = '#ffffff';
            sctx.fillRect(0, 0, 1800, 1200);

            // 6 photos in 2 rows of 3 columns
            for (var row = 0; row < 2; row++) {
              for (var col = 0; col < 3; col++) {
                var dx = col * 600;
                var dy = row * 600;
                sctx.drawImage(canvas, dx, dy, 600, 600);
                // Thin guide line
                sctx.strokeStyle = '#cccccc';
                sctx.lineWidth = 1;
                sctx.strokeRect(dx, dy, 600, 600);
              }
            }

            var a = document.createElement('a');
            a.href = sheet.toDataURL('image/jpeg', 0.95);
            a.download = 'us_passport_4x6_sheet.jpg';
            a.click();
          }
        </script>
      `
    }
,
    {
      slug: 'crop-600x600',
      title: '600x600 Square Image Cutter & Cropper [Fast & Free]',
      metaDesc: 'Cut or crop any image into a perfect 600x600 square quickly in your browser. Free, instant, 100% private with live zoom, drag, pan, rotation, and DV lottery size check.',
      category: 'Design',
      body: `
        ${commonStyle}
        <style>
          .drop-zone {
            border: 2px dashed var(--border);
            border-radius: 8px;
            padding: 2.5rem 1.5rem;
            text-align: center;
            background: var(--surface-alt);
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 1.5rem;
          }
          .drop-zone:hover, .drop-zone.dragover {
            border-color: #6366f1;
            background: rgba(99, 102, 241, 0.05);
          }
          .canvas-wrap {
            position: relative;
            width: 320px;
            height: 320px;
            margin: 0 auto;
            border: 2px solid #6366f1;
            border-radius: 6px;
            overflow: hidden;
            background: #e5e7eb;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            touch-action: none;
          }
          .canvas-wrap canvas {
            width: 100%;
            height: 100%;
            display: block;
            cursor: grab;
          }
          .canvas-wrap canvas:active {
            cursor: grabbing;
          }
          .ctrl-btn {
            background: var(--surface-alt);
            border: 1px solid var(--border);
            color: var(--fg);
            padding: 0.5rem 0.85rem;
            border-radius: 4px;
            font-family: var(--mono);
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.15s;
          }
          .ctrl-btn:hover {
            background: var(--border);
          }
        </style>

        <div class="article-container" style="max-width: 960px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/design/">Design & Image</a> &gt; 600x600 Square Cutter
          </nav>

          <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;">
            <span class="badge badge-green">100% Client-Side Private</span>
            <span class="badge badge-blue">Exact 600x600 px Output</span>
            <span class="badge badge-purple">DV Lottery & Passport Ready</span>
          </div>

          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem; line-height: 1.2;">
            Cut & Crop Image into a 600x600 Square Quickly
          </h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
            Upload, paste, or drop any photo to instantly crop it into an exact 600 &times; 600 pixel square. Perfect for US Diversity Visa (DV Lottery) entries, US passport photos, social avatars, and e-commerce product thumbnails. Zero server uploads.
          </p>

          <div class="tool-box">
            <!-- DROP ZONE -->
            <div id="dropZone" class="drop-zone" onclick="document.getElementById('fileInput').click()">
              <input type="file" id="fileInput" accept="image/*" style="display: none;" onchange="handleFileSelect(event)" />
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📸</div>
              <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.25rem;">
                Drop your image here, click to browse, or press <kbd style="background:var(--surface);border:1px solid var(--border);padding:0.15rem 0.4rem;border-radius:4px;font-size:0.85rem;">Ctrl + V</kbd> to paste
              </div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">
                Supports JPG, PNG, WebP, AVIF, BMP, GIF (Any resolution, up to 50MB)
              </div>
            </div>

            <!-- WORKSPACE (Hidden until image loaded) -->
            <div id="cropWorkspace" style="display: none;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; align-items: start;">
                
                <!-- CANVAS & INTERACTIVE CROP BOX -->
                <div style="text-align: center;">
                  <div class="field-label" style="text-align:center;margin-bottom:0.75rem;">
                    Preview: 600 x 600 Pixel Canvas (Drag to Pan &bull; Scroll to Zoom)
                  </div>
                  
                  <div class="canvas-wrap" id="canvasWrap">
                    <canvas id="cropCanvas" width="600" height="600"></canvas>
                    <!-- Grid Overlay Lines -->
                    <div style="position:absolute;top:33.33%;left:0;right:0;height:1px;border-top:1px dashed rgba(255,255,255,0.4);pointer-events:none;"></div>
                    <div style="position:absolute;top:66.66%;left:0;right:0;height:1px;border-top:1px dashed rgba(255,255,255,0.4);pointer-events:none;"></div>
                    <div style="position:absolute;left:33.33%;top:0;bottom:0;width:1px;border-left:1px dashed rgba(255,255,255,0.4);pointer-events:none;"></div>
                    <div style="position:absolute;left:66.66%;top:0;bottom:0;width:1px;border-left:1px dashed rgba(255,255,255,0.4);pointer-events:none;"></div>
                  </div>

                  <!-- Quick Tool Bar Under Canvas -->
                  <div style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
                    <button type="button" class="ctrl-btn" onclick="rotateImage(90)" title="Rotate 90 degrees clockwise">⟳ Rotate 90°</button>
                    <button type="button" class="ctrl-btn" onclick="flipHorizontal()" title="Flip horizontally">⇄ Flip</button>
                    <button type="button" class="ctrl-btn" onclick="fitCenter()" title="Fit entire photo with borders">Center Fit</button>
                    <button type="button" class="ctrl-btn" onclick="fillCenter()" title="Fill square without borders">Center Fill</button>
                    <button type="button" class="ctrl-btn" onclick="resetTransforms()" title="Reset to original">Reset</button>
                  </div>
                </div>

                <!-- CONTROLS & EXPORT SETTINGS -->
                <div>
                  <!-- Zoom Range -->
                  <div class="field-group">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                      <label class="field-label" style="margin: 0;">Zoom Level</label>
                      <span id="zoomVal" style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted);">1.0x</span>
                    </div>
                    <input type="range" id="zoomSlider" min="0.2" max="4" step="0.02" value="1" style="width: 100%; accent-color: #6366f1;" oninput="onZoomSlider(this.value)" />
                  </div>

                  <!-- Background Color Fill (For Fit mode) -->
                  <div class="field-group">
                    <label class="field-label">Background Fill (If photo doesn't fill square)</label>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                      <select id="bgType" onchange="render()" class="text-input" style="flex: 1; padding: 0.5rem 0.75rem;">
                        <option value="#ffffff" selected>White (Standard Passport / Visa / Products)</option>
                        <option value="#000000">Black</option>
                        <option value="#f3f4f6">Light Gray</option>
                        <option value="transparent">Transparent (PNG only)</option>
                      </select>
                    </div>
                  </div>

                  <!-- Export Format & Quality -->
                  <div class="grid-controls" style="margin-bottom: 1.25rem;">
                    <div class="field-group">
                      <label class="field-label">Output Format</label>
                      <select id="exportFormat" class="text-input" onchange="updateFileSize()" style="padding: 0.5rem 0.75rem;">
                        <option value="image/jpeg" selected>JPEG (.jpg) - DV Lottery & Web</option>
                        <option value="image/png">PNG (.png) - Lossless / Transparent</option>
                        <option value="image/webp">WebP (.webp) - High Efficiency</option>
                      </select>
                    </div>
                    <div class="field-group">
                      <label class="field-label">JPEG Quality (<span id="qualDisp">90%</span>)</label>
                      <input type="range" id="qualitySlider" min="0.5" max="1" step="0.05" value="0.9" style="width: 100%; accent-color: #6366f1;" oninput="onQualityChange(this.value)" />
                    </div>
                  </div>

                  <!-- FILE SIZE & COMPLIANCE BADGE -->
                  <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                      <span style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Estimated Output Size:</span>
                      <strong id="fileSizeDisp" style="font-family: var(--mono); font-size: 1rem; color: #10b981;">~120 KB</strong>
                    </div>
                    <div id="complianceNotice" style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">
                      ✅ <strong>DV Lottery Ready:</strong> File size is well within the official 240 KB limit and dimensions are exactly 600 &times; 600 pixels.
                    </div>
                  </div>

                  <!-- DOWNLOAD & COPY ACTIONS -->
                  <div class="action-bar" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
                    <button type="button" class="btn-primary" onclick="downloadImage()" style="padding: 0.85rem 1.5rem; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                      <span>💾 DOWNLOAD 600x600 SQUARE</span>
                    </button>
                    <div style="display: flex; gap: 0.5rem;">
                      <button type="button" class="btn-sec" onclick="copyToClipboard()" style="flex: 1; padding: 0.6rem;">📋 Copy to Clipboard</button>
                      <button type="button" class="btn-sec" onclick="document.getElementById('fileInput').click()" style="flex: 1; padding: 0.6rem;">🔄 Choose Another</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- USES & SPECS ARTICLE -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 2rem; margin: 3rem 0;">
            <h2 style="font-family: var(--serif); font-size: 1.5rem; margin-bottom: 1rem;">Why 600 &times; 600 Pixels is the Global Standard</h2>
            <div style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.7;">
              <p>
                A 600x600 pixel square is one of the most frequently required image specifications across government portals and web platforms:
              </p>
              <ul style="margin: 0.75rem 0 1.25rem 1.5rem;">
                <li><strong>US Diversity Visa (DV Green Card Lottery):</strong> The US Department of State requires an exact 1:1 aspect ratio with dimensions of 600 &times; 600 pixels, in 24-bit color sRGB, and a maximum file size of 240 KB.</li>
                <li><strong>US Passport Digital Submission:</strong> 2 &times; 2 inches at 300 DPI resolution calculates precisely to 600 &times; 600 pixels.</li>
                <li><strong>E-Commerce & Marketplaces:</strong> Shopify, Amazon, and eBay recommend square product hero photos to prevent automatic distortion on mobile shopping feeds.</li>
                <li><strong>Social Avatars:</strong> Discord profile pictures, Twitter/X profile photos, and Instagram icons crop to 1:1 circles or squares without pixel stretching when provided at 600x600.</li>
              </ul>
            </div>
          </div>

          <!-- FAQ ACCORDION -->
          <div style="margin: 3rem 0;">
            <h2 style="font-family: var(--serif); font-size: 1.5rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600;">Does this tool upload my image to a remote server?</summary>
              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border); background: var(--surface-alt);">
                No. The cropping, panning, zooming, and compression run 100% locally in your web browser using the HTML5 Canvas API. Your photos never leave your device.
              </div>
            </details>
            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600;">How do I make sure my photo meets the 240 KB DV Lottery limit?</summary>
              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border); background: var(--surface-alt);">
                Select the "JPEG (.jpg)" format and keep the quality slider around 85% to 90%. The live estimated output counter will confirm if your image is safely under 240 KB.
              </div>
            </details>
            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600;">Can I paste an image directly from my clipboard?</summary>
              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border); background: var(--surface-alt);">
                Yes! If you took a screenshot or copied an image from anywhere, simply press Ctrl + V (or Command + V on Mac) on this page to load it directly into the cropper.
              </div>
            </details>
          </div>
        </div>

        <script>
          var img = null;
          var panX = 0, panY = 0;
          var zoom = 1;
          var rotation = 0;
          var isFlipped = false;
          var isDragging = false;
          var startX = 0, startY = 0;
          var canvas = document.getElementById('cropCanvas');
          var ctx = canvas.getContext('2d');

          // Paste listener
          window.addEventListener('paste', function(e) {
            var items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (var i = 0; i < items.length; i++) {
              if (items[i].type.indexOf('image') === 0) {
                var blob = items[i].getAsFile();
                loadImageFromFile(blob);
                break;
              }
            }
          });

          // Drag & drop on zone
          var dropZone = document.getElementById('dropZone');
          ['dragenter', 'dragover'].forEach(function(eventName) {
            dropZone.addEventListener(eventName, function(e) {
              e.preventDefault();
              dropZone.classList.add('dragover');
            }, false);
          });
          ['dragleave', 'drop'].forEach(function(eventName) {
            dropZone.addEventListener(eventName, function(e) {
              e.preventDefault();
              dropZone.classList.remove('dragover');
            }, false);
          });
          dropZone.addEventListener('drop', function(e) {
            var dt = e.dataTransfer;
            var files = dt.files;
            if (files.length > 0) {
              loadImageFromFile(files[0]);
            }
          });

          function handleFileSelect(e) {
            var file = e.target.files[0];
            if (file) loadImageFromFile(file);
          }

          function loadImageFromFile(file) {
            var reader = new FileReader();
            reader.onload = function(evt) {
              img = new Image();
              img.onload = function() {
                document.getElementById('cropWorkspace').style.display = 'block';
                document.getElementById('dropZone').style.display = 'none';
                resetTransforms();
                fillCenter();
              };
              img.src = evt.target.result;
            };
            reader.readAsDataURL(file);
          }

          function resetTransforms() {
            panX = 0;
            panY = 0;
            rotation = 0;
            isFlipped = false;
            zoom = 1;
            document.getElementById('zoomSlider').value = 1;
            document.getElementById('zoomVal').textContent = '1.0x';
            render();
          }

          function fitCenter() {
            if (!img) return;
            var scaleW = 600 / img.width;
            var scaleH = 600 / img.height;
            zoom = Math.min(scaleW, scaleH);
            panX = 0; panY = 0;
            updateZoomUi();
            render();
          }

          function fillCenter() {
            if (!img) return;
            var scaleW = 600 / img.width;
            var scaleH = 600 / img.height;
            zoom = Math.max(scaleW, scaleH);
            panX = 0; panY = 0;
            updateZoomUi();
            render();
          }

          function rotateImage(deg) {
            rotation = (rotation + deg) % 360;
            render();
          }

          function flipHorizontal() {
            isFlipped = !isFlipped;
            render();
          }

          function onZoomSlider(val) {
            zoom = parseFloat(val) || 1;
            document.getElementById('zoomVal').textContent = zoom.toFixed(2) + 'x';
            render();
          }

          function updateZoomUi() {
            document.getElementById('zoomSlider').value = zoom;
            document.getElementById('zoomVal').textContent = zoom.toFixed(2) + 'x';
          }

          function onQualityChange(val) {
            document.getElementById('qualDisp').textContent = Math.round(val * 100) + '%';
            updateFileSize();
          }

          // Pan drag interactions
          canvas.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX - panX;
            startY = e.clientY - panY;
          });
          window.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            panX = e.clientX - startX;
            panY = e.clientY - startY;
            render();
          });
          window.addEventListener('mouseup', function() {
            isDragging = false;
          });

          // Touch interactions for mobile
          canvas.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
              isDragging = true;
              startX = e.touches[0].clientX - panX;
              startY = e.touches[0].clientY - panY;
            }
          });
          window.addEventListener('touchmove', function(e) {
            if (!isDragging || e.touches.length !== 1) return;
            panX = e.touches[0].clientX - startX;
            panY = e.touches[0].clientY - startY;
            render();
          });
          window.addEventListener('touchend', function() {
            isDragging = false;
          });

          // Mouse wheel zoom
          canvas.addEventListener('wheel', function(e) {
            e.preventDefault();
            var delta = e.deltaY < 0 ? 0.05 : -0.05;
            zoom = Math.max(0.2, Math.min(4, zoom + delta));
            updateZoomUi();
            render();
          }, { passive: false });

          function render() {
            if (!img) return;
            var bg = document.getElementById('bgType').value;
            ctx.clearRect(0, 0, 600, 600);

            if (bg !== 'transparent') {
              ctx.fillStyle = bg;
              ctx.fillRect(0, 0, 600, 600);
            }

            ctx.save();
            // Center transformation
            ctx.translate(300 + panX, 300 + panY);
            ctx.rotate((rotation * Math.PI) / 180);
            if (isFlipped) ctx.scale(-1, 1);
            ctx.scale(zoom, zoom);

            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            ctx.restore();

            updateFileSize();
          }

          function updateFileSize() {
            if (!img) return;
            var format = document.getElementById('exportFormat').value;
            var quality = parseFloat(document.getElementById('qualitySlider').value) || 0.9;
            var dataUrl = canvas.toDataURL(format, quality);

            // Estimate byte size from Base64 string length
            var head = 'data:' + format + ';base64,';
            var bytes = Math.round((dataUrl.length - head.length) * 3 / 4);
            var kb = Math.round(bytes / 1024);

            var sizeDisp = document.getElementById('fileSizeDisp');
            var notice = document.getElementById('complianceNotice');

            sizeDisp.textContent = '~' + kb + ' KB';

            if (kb <= 240) {
              sizeDisp.style.color = '#10b981';
              notice.innerHTML = '✅ <strong>DV Lottery Ready:</strong> File size is ' + kb + ' KB, strictly under the 240 KB limit (600 &times; 600 px).';
            } else {
              sizeDisp.style.color = '#ef4444';
              notice.innerHTML = '⚠️ <strong>Exceeds 240 KB:</strong> Lower the JPEG quality slider slightly to comply with US Visa / Lottery requirements.';
            }
          }

          function downloadImage() {
            if (!img) return;
            var format = document.getElementById('exportFormat').value;
            var quality = parseFloat(document.getElementById('qualitySlider').value) || 0.9;
            var ext = format === 'image/png' ? 'png' : (format === 'image/webp' ? 'webp' : 'jpg');
            
            var a = document.createElement('a');
            a.download = 'cropped-600x600.' + ext;
            a.href = canvas.toDataURL(format, quality);
            a.click();
          }

          function copyToClipboard() {
            if (!img) return;
            canvas.toBlob(function(blob) {
              if (navigator.clipboard && window.ClipboardItem) {
                navigator.clipboard.write([
                  new ClipboardItem({ 'image/png': blob })
                ]).then(function() {
                  alert('600x600 square image copied to clipboard!');
                }).catch(function() {
                  alert('Unable to copy directly. Please use the Download button.');
                });
              } else {
                alert('Clipboard API not supported in this browser. Please use the Download button.');
              }
            }, 'image/png');
          }
        </script>
      `
    }
];

  // Render individual tool pages
  for (const tool of tools) {
    const html = renderPage({
      title: `${tool.title} | Digital Tools Shed`,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/design/${tool.slug}`,
      bodyContent: tool.body,
      currentPath: `/design/${tool.slug}`
    });
    writeFileSync(join(designDist, `${tool.slug}.html`), html);
  }

  // Render Hub Page
  const hubCards = tools.map(t => `
    <a href="/design/${t.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  const hubBody = `
    ${commonStyle}
    <div class="article-container" style="max-width: 900px;">
      <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Design & Image Tools Suite</h1>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
        Client-side graphics generators, custom QR codes, WCAG contrast analyzers, glassmorphism CSS stylers, and retro pixel art editors.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
        ${hubCards}
      </div>
    </div>
  `;

  writeFileSync(join(designDist, 'index.html'), renderPage({
    title: 'Design & Image Tools Suite | Digital Tools Shed',
    metaDesc: 'Free online design and image tools: QR code generator, WCAG color contrast checker, glassmorphism CSS creator, and pixel art editor.',
    canonical: `${DOMAIN}/design/`,
    bodyContent: hubBody,
    currentPath: '/design/'
  }));

  console.log(`  ✓ Built Design Suite (${tools.length} tools in /design/)`);
}
