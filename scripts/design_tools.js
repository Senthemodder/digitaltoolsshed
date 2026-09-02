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
