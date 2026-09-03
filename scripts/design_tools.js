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

  const tools = [
    {
      slug: 'qr-code-generator',
      title: 'QR Code Generator with Custom Colors',
      metaDesc: 'Generate high-resolution, downloadable QR codes locally in your browser with custom colors, size scaling, and zero tracking.',
      category: 'Design',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/design/">Design & Image</a> &gt; QR Code Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">QR Code Generator with Custom Colors</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Generate high-resolution PNG QR codes for URLs, Wi-Fi networks, and contact cards instantly. Zero server uploads.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Content / URL</label>
              <input type="text" id="qr-data" class="text-input" value="https://digitaltoolsshed.com" placeholder="Enter URL or text..." oninput="drawQR()" />
            </div>

            <div class="grid-controls">
              <div class="field-group">
                <label class="field-label">Foreground Color</label>
                <input type="color" id="qr-fg" value="#000000" class="text-input" style="height: 40px; padding: 2px;" onchange="drawQR()" />
              </div>
              <div class="field-group">
                <label class="field-label">Background Color</label>
                <input type="color" id="qr-bg" value="#ffffff" class="text-input" style="height: 40px; padding: 2px;" onchange="drawQR()" />
              </div>
              <div class="field-group">
                <label class="field-label">Size (Pixels)</label>
                <select id="qr-size" class="text-input" onchange="drawQR()">
                  <option value="256">256 x 256 px</option>
                  <option value="512" selected>512 x 512 px</option>
                  <option value="1024">1024 x 1024 px</option>
                </select>
              </div>
            </div>

            <div class="preview-box">
              <canvas id="qr-canvas" style="max-width: 256px; border: 1px solid var(--border); border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);"></canvas>
            </div>

            <div class="action-bar" style="justify-content: center;">
              <button class="btn-primary" onclick="downloadQR()">&#x2913; Download PNG</button>
            </div>
          </div>
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"></script>
        <script>
          let qr = null;
          function drawQR() {
            const data = document.getElementById('qr-data').value || ' ';
            const fg = document.getElementById('qr-fg').value;
            const bg = document.getElementById('qr-bg').value;
            const size = parseInt(document.getElementById('qr-size').value, 10);
            const canvas = document.getElementById('qr-canvas');

            if (typeof QRious !== 'undefined') {
              qr = new QRious({
                element: canvas,
                value: data,
                size: size,
                foreground: fg,
                background: bg,
                level: 'H'
              });
            } else {
              // Fallback canvas matrix if CDN blocked
              const ctx = canvas.getContext('2d');
              canvas.width = size; canvas.height = size;
              ctx.fillStyle = bg; ctx.fillRect(0, 0, size, size);
              ctx.fillStyle = fg; ctx.font = '16px sans-serif';
              ctx.fillText('Loading QR Engine...', 20, size/2);
            }
          }

          function downloadQR() {
            const canvas = document.getElementById('qr-canvas');
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
          }

          window.addEventListener('load', drawQR);
        </script>
      `
    },
    {
      slug: 'color-contrast',
      title: 'WCAG Color Contrast Checker',
      metaDesc: 'Check color contrast ratios against WCAG 2.1 AA and AAA standards for normal text, large text, and UI components.',
      category: 'Design',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/design/">Design & Image</a> &gt; Contrast Checker
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">WCAG Color Contrast Checker</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Ensure accessibility compliance with real-time luminance contrast calculations and WCAG AA/AAA ratings.
          </p>

          <div class="tool-box">
            <div class="grid-controls">
              <div class="field-group">
                <label class="field-label">Foreground Text Color</label>
                <div style="display: flex; gap: 0.5rem;">
                  <input type="color" id="fg-color" value="#111111" class="text-input" style="width: 50px; height: 40px; padding: 2px;" onchange="updateContrastFromPicker('fg')" />
                  <input type="text" id="fg-hex" value="#111111" class="code-input" oninput="updateContrastFromHex('fg')" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Background Color</label>
                <div style="display: flex; gap: 0.5rem;">
                  <input type="color" id="bg-color" value="#ffffff" class="text-input" style="width: 50px; height: 40px; padding: 2px;" onchange="updateContrastFromPicker('bg')" />
                  <input type="text" id="bg-hex" value="#ffffff" class="code-input" oninput="updateContrastFromHex('bg')" />
                </div>
              </div>
            </div>

            <div id="preview-panel" style="padding: 2rem; border-radius: 6px; text-align: center; margin: 1.5rem 0; border: 1px solid var(--border); transition: background 0.2s, color 0.2s;">
              <h2 style="margin: 0 0 0.5rem; font-size: 1.6rem;">Accessible Typography Preview</h2>
              <p style="margin: 0; font-size: 1rem;">This is a preview of normal body text against the selected background color.</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; text-align: center;">
              <div style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; border: 1px solid var(--border);">
                <div class="field-label">Contrast Ratio</div>
                <div id="ratio-num" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: var(--fg);">16.1 : 1</div>
              </div>
              <div style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; border: 1px solid var(--border);">
                <div class="field-label">WCAG AA (Normal)</div>
                <div id="badge-aa" style="font-family: var(--mono); font-size: 1.2rem; font-weight: bold; color: #22c55e;">PASS</div>
              </div>
              <div style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; border: 1px solid var(--border);">
                <div class="field-label">WCAG AAA (Normal)</div>
                <div id="badge-aaa" style="font-family: var(--mono); font-size: 1.2rem; font-weight: bold; color: #22c55e;">PASS</div>
              </div>
            </div>
          </div>
        </div>

        <script>
          function hexToRgb(hex) {
            hex = hex.replace(/^#/, '');
            if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
            const num = parseInt(hex, 16);
            return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
          }

          function getLuminance([r, g, b]) {
            const a = [r, g, b].map(v => {
              v /= 255;
              return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
          }

          function calcRatio() {
            const fg = document.getElementById('fg-hex').value;
            const bg = document.getElementById('bg-hex').value;

            try {
              const l1 = getLuminance(hexToRgb(fg));
              const l2 = getLuminance(hexToRgb(bg));
              const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

              document.getElementById('ratio-num').textContent = ratio.toFixed(2) + ' : 1';

              const panel = document.getElementById('preview-panel');
              panel.style.backgroundColor = bg;
              panel.style.color = fg;

              const passAA = ratio >= 4.5;
              const passAAA = ratio >= 7.0;

              const bAA = document.getElementById('badge-aa');
              bAA.textContent = passAA ? 'PASS (4.5+)' : 'FAIL';
              bAA.style.color = passAA ? '#22c55e' : '#ef4444';

              const bAAA = document.getElementById('badge-aaa');
              bAAA.textContent = passAAA ? 'PASS (7.0+)' : 'FAIL';
              bAAA.style.color = passAAA ? '#22c55e' : '#ef4444';
            } catch(e) {}
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

          document.addEventListener('DOMContentLoaded', calcRatio);
        </script>
      `
    },
    {
      slug: 'glassmorphism',
      title: 'Glassmorphism CSS Generator',
      metaDesc: 'Generate modern frosted-glass blur and transparency UI effects with customizable backdrop filters and live CSS code.',
      category: 'Design',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/design/">Design & Image</a> &gt; Glassmorphism Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Glassmorphism CSS Generator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Create beautiful frosted-glass backdrop-filter UI cards with custom transparency, blur radius, and border highlights.
          </p>

          <div class="tool-box">
            <div class="grid-controls">
              <div class="field-group">
                <label class="field-label">Blur Radius: <span id="blur-val">12</span>px</label>
                <input type="range" id="glass-blur" min="0" max="40" value="12" style="width:100%;" oninput="updateGlass()" />
              </div>
              <div class="field-group">
                <label class="field-label">Opacity: <span id="op-val">0.2</span></label>
                <input type="range" id="glass-op" min="0.05" max="0.95" step="0.05" value="0.2" style="width:100%;" oninput="updateGlass()" />
              </div>
              <div class="field-group">
                <label class="field-label">Border Radius: <span id="rad-val">16</span>px</label>
                <input type="range" id="glass-rad" min="0" max="40" value="16" style="width:100%;" oninput="updateGlass()" />
              </div>
            </div>

            <!-- Preview Container with Colorful Gradient Background -->
            <div style="background: linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%); padding: 3rem 1.5rem; border-radius: 8px; margin: 1.5rem 0; display: flex; justify-content: center; align-items: center;">
              <div id="glass-card" style="width: 280px; padding: 2rem; color: #ffffff; text-align: center;">
                <h3 style="margin: 0 0 0.5rem; font-size: 1.3rem;">Frosted Glass</h3>
                <p style="margin: 0; font-size: 0.85rem; opacity: 0.9;">Modern UI component preview</p>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Generated CSS</label>
              <textarea id="glass-css" class="code-input" style="height: 140px;" readonly></textarea>
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="copyGlass()">Copy CSS</button>
            </div>
          </div>
        </div>

        <script>
          function updateGlass() {
            const blur = document.getElementById('glass-blur').value;
            const op = document.getElementById('glass-op').value;
            const rad = document.getElementById('glass-rad').value;

            document.getElementById('blur-val').textContent = blur;
            document.getElementById('op-val').textContent = op;
            document.getElementById('rad-val').textContent = rad;

            const card = document.getElementById('glass-card');
            card.style.background = 'rgba(255, 255, 255, ' + op + ')';
            card.style.backdropFilter = 'blur(' + blur + 'px)';
            card.style.webkitBackdropFilter = 'blur(' + blur + 'px)';
            card.style.borderRadius = rad + 'px';
            card.style.border = '1px solid rgba(255, 255, 255, 0.3)';
            card.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.2)';

            const css = 'background: rgba(255, 255, 255, ' + op + ');\nbackdrop-filter: blur(' + blur + 'px);\n-webkit-backdrop-filter: blur(' + blur + 'px);\nborder-radius: ' + rad + 'px;\nborder: 1px solid rgba(255, 255, 255, 0.3);\nbox-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);';
            document.getElementById('glass-css').value = css;
          }

          function copyGlass() {
            navigator.clipboard.writeText(document.getElementById('glass-css').value);
          }

          document.addEventListener('DOMContentLoaded', updateGlass);
        </script>
      `
    },
    {
      slug: 'pixel-art',
      title: '16x16 Pixel Art Sprite Editor',
      metaDesc: 'Interactive 16x16 pixel art canvas editor with custom palette, pencil, fill bucket, eraser, and PNG export.',
      category: 'Design',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/design/">Design & Image</a> &gt; Pixel Art Editor
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">16x16 Pixel Art Sprite Editor</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Design 16x16 retro game sprites, Minecraft textures, and custom pixel icons in your browser.
          </p>

          <div class="tool-box">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <label class="field-label" style="margin:0;">Color:</label>
                <input type="color" id="px-color" value="#ef4444" style="height: 36px; width: 44px; padding: 2px; cursor: pointer;" />
              </div>
              <button class="btn-sec" id="btn-draw" style="background:var(--surface-alt); font-weight:bold;" onclick="setTool('draw')">&#x270F;&#xFE0F; Pencil</button>
              <button class="btn-sec" id="btn-erase" onclick="setTool('erase')">&#x232B; Eraser</button>
              <button class="btn-sec" onclick="clearPixelGrid()">Clear Canvas</button>
            </div>

            <div style="display: flex; justify-content: center; overflow-x: auto; padding: 1rem 0;">
              <canvas id="pixel-canvas" width="320" height="320" style="border: 2px solid var(--border); cursor: crosshair; background: #ffffff; image-rendering: pixelated; box-shadow: 0 4px 12px rgba(0,0,0,0.05);"></canvas>
            </div>

            <div class="action-bar" style="justify-content: center;">
              <button class="btn-primary" onclick="exportPixelPNG()">&#x2913; Download 16x16 PNG</button>
              <button class="btn-sec" onclick="exportUpscaledPNG()">Download Upscaled (256x256)</button>
            </div>
          </div>
        </div>

        <script>
          const GRID_SIZE = 16;
          const PIXEL_SCALE = 20; // 16 * 20 = 320
          let currentTool = 'draw';
          const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
          let isMouseDown = false;

          const canvas = document.getElementById('pixel-canvas');
          const ctx = canvas.getContext('2d');

          function drawGridLines() {
            ctx.clearRect(0, 0, 320, 320);
            for (let r = 0; r < GRID_SIZE; r++) {
              for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c]) {
                  ctx.fillStyle = grid[r][c];
                  ctx.fillRect(c * PIXEL_SCALE, r * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);
                } else {
                  ctx.fillStyle = (r + c) % 2 === 0 ? '#f4f4f5' : '#ffffff';
                  ctx.fillRect(c * PIXEL_SCALE, r * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);
                }
                ctx.strokeStyle = 'rgba(0,0,0,0.08)';
                ctx.strokeRect(c * PIXEL_SCALE, r * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);
              }
            }
          }

          function paintPixel(e) {
            const rect = canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / (rect.width / GRID_SIZE));
            const y = Math.floor((e.clientY - rect.top) / (rect.height / GRID_SIZE));

            if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
              grid[y][x] = currentTool === 'draw' ? document.getElementById('px-color').value : '';
              drawGridLines();
            }
          }

          canvas.addEventListener('mousedown', (e) => { isMouseDown = true; paintPixel(e); });
          window.addEventListener('mouseup', () => { isMouseDown = false; });
          canvas.addEventListener('mousemove', (e) => { if (isMouseDown) paintPixel(e); });

          function setTool(t) {
            currentTool = t;
            document.getElementById('btn-draw').style.fontWeight = t === 'draw' ? 'bold' : 'normal';
            document.getElementById('btn-erase').style.fontWeight = t === 'erase' ? 'bold' : 'normal';
          }

          function clearPixelGrid() {
            for (let r = 0; r < GRID_SIZE; r++) {
              for (let c = 0; c < GRID_SIZE; c++) grid[r][c] = '';
            }
            drawGridLines();
          }

          function exportPixelPNG() {
            const off = document.createElement('canvas');
            off.width = 16; off.height = 16;
            const offCtx = off.getContext('2d');
            for (let r = 0; r < 16; r++) {
              for (let c = 0; c < 16; c++) {
                if (grid[r][c]) {
                  offCtx.fillStyle = grid[r][c];
                  offCtx.fillRect(c, r, 1, 1);
                }
              }
            }
            const a = document.createElement('a');
            a.download = 'sprite_16x16.png';
            a.href = off.toDataURL();
            a.click();
          }

          function exportUpscaledPNG() {
            const off = document.createElement('canvas');
            off.width = 256; off.height = 256;
            const offCtx = off.getContext('2d');
            offCtx.imageSmoothingEnabled = false;
            for (let r = 0; r < 16; r++) {
              for (let c = 0; c < 16; c++) {
                if (grid[r][c]) {
                  offCtx.fillStyle = grid[r][c];
                  offCtx.fillRect(c * 16, r * 16, 16, 16);
                }
              }
            }
            const a = document.createElement('a');
            a.download = 'sprite_256x256.png';
            a.href = off.toDataURL();
            a.click();
          }

          document.addEventListener('DOMContentLoaded', drawGridLines);
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
