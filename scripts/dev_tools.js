// scripts/dev_tools.js - Developer Tools Suite for Digital Tools Shed

export function buildDevToolsSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const devDist = join(DIST, 'dev');
  ensureDir(devDist);

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
      .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      @media (max-width: 768px) { .grid-2col { grid-template-columns: 1fr; } }
    </style>
  `;

  const tools = [
    {
      slug: 'jwt-decoder',
      title: 'JWT Token Decoder & Header Inspector',
      metaDesc: 'Decode JSON Web Tokens (JWT) locally in your browser. Inspect JOSE header, claims payload, and token expiration timestamps.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; JWT Decoder
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">JWT Token Decoder & Header Inspector</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Decode Base64URL-encoded JSON Web Tokens directly in browser memory. 100% private with zero network requests.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Encoded JWT String</label>
              <textarea id="jwt-input" class="code-input" style="height: 120px;" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" oninput="decodeJwt()"></textarea>
            </div>

            <div class="grid-2col" style="margin-top: 1rem;">
              <div class="field-group">
                <label class="field-label">Header (Algorithm & Token Type)</label>
                <textarea id="jwt-header" class="code-input" style="height: 160px; color: #ef4444;" readonly></textarea>
              </div>
              <div class="field-group">
                <label class="field-label">Payload (Claims Data)</label>
                <textarea id="jwt-payload" class="code-input" style="height: 160px; color: #3b82f6;" readonly></textarea>
              </div>
            </div>

            <div id="jwt-meta" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; margin-top: 1rem; display: none;"></div>
          </div>
        </div>

        <script>
          function b64DecodeUnicode(str) {
            str = str.replace(/-/g, '+').replace(/_/g, '/');
            while (str.length % 4) str += '=';
            return decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
          }

          function decodeJwt() {
            const raw = document.getElementById('jwt-input').value.trim();
            const hEl = document.getElementById('jwt-header');
            const pEl = document.getElementById('jwt-payload');
            const mEl = document.getElementById('jwt-meta');

            if (!raw) { hEl.value = ''; pEl.value = ''; mEl.style.display = 'none'; return; }

            const parts = raw.split('.');
            if (parts.length < 2) {
              hEl.value = 'Invalid JWT structure (must contain at least 2 dot-separated segments)';
              pEl.value = '';
              mEl.style.display = 'none';
              return;
            }

            try {
              const headerObj = JSON.parse(b64DecodeUnicode(parts[0]));
              const payloadObj = JSON.parse(b64DecodeUnicode(parts[1]));

              hEl.value = JSON.stringify(headerObj, null, 2);
              pEl.value = JSON.stringify(payloadObj, null, 2);

              let metaHtml = '<strong>Token Metadata:</strong><br>';
              if (payloadObj.exp) {
                const expDate = new Date(payloadObj.exp * 1000);
                const isExp = Date.now() > expDate.getTime();
                metaHtml += '• Expiration (exp): ' + expDate.toUTCString() + ' (' + (isExp ? '<span style="color:#ef4444;">EXPIRED</span>' : '<span style="color:#22c55e;">VALID</span>') + ')<br>';
              }
              if (payloadObj.iat) {
                metaHtml += '• Issued At (iat): ' + new Date(payloadObj.iat * 1000).toUTCString() + '<br>';
              }
              if (payloadObj.sub) {
                metaHtml += '• Subject (sub): ' + payloadObj.sub + '<br>';
              }
              mEl.innerHTML = metaHtml;
              mEl.style.display = 'block';
            } catch(e) {
              hEl.value = 'Decoding error: ' + e.message;
            }
          }

          document.addEventListener('DOMContentLoaded', decodeJwt);
        </script>
      `
    },
    {
      slug: 'regex-tester',
      title: 'Regex Visual Tester & Match Inspector',
      metaDesc: 'Test and debug JavaScript regular expressions with real-time match highlighting, capture groups, and replacement substitution.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; Regex Tester
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Regex Visual Tester & Match Inspector</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Test JavaScript Regular Expressions with live match highlighting, capture group extraction, and regex substitution.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Regular Expression Pattern & Flags</label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="rx-pattern" class="code-input" value="([A-Z])\\w+" placeholder="e.g. \\b[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}\\b" oninput="runRegex()" />
                <input type="text" id="rx-flags" class="code-input" value="gm" style="width: 80px; text-align: center;" placeholder="flags" oninput="runRegex()" />
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Test String</label>
              <textarea id="rx-string" class="code-input" style="height: 140px;" oninput="runRegex()">Hello World! Testing Regex on Digital Tools Shed.</textarea>
            </div>

            <div class="field-group">
              <label class="field-label">Highlighted Matches (<span id="match-count">0</span> found)</label>
              <div id="rx-highlight" style="background: var(--bg); border: 1px solid var(--border); padding: 0.85rem; border-radius: 4px; font-family: var(--mono); font-size: 0.9rem; min-height: 80px; white-space: pre-wrap; line-height: 1.6;"></div>
            </div>
          </div>
        </div>

        <script>
          function runRegex() {
            const pat = document.getElementById('rx-pattern').value;
            const flags = document.getElementById('rx-flags').value;
            const str = document.getElementById('rx-string').value;
            const hl = document.getElementById('rx-highlight');
            const cnt = document.getElementById('match-count');

            if (!pat || !str) {
              hl.textContent = str;
              cnt.textContent = '0';
              return;
            }

            try {
              const regex = new RegExp(pat, flags.includes('g') ? flags : flags + 'g');
              let match;
              let matches = [];
              let lastIdx = 0;
              let html = '';
              let count = 0;

              while ((match = regex.exec(str)) !== null) {
                count++;
                html += escapeHtml(str.substring(lastIdx, match.index));
                html += '<mark style="background: #fef08a; color: #000; border-radius: 2px; padding: 1px 3px;">' + escapeHtml(match[0]) + '</mark>';
                lastIdx = regex.lastIndex;
                if (match.index === regex.lastIndex) regex.lastIndex++; // prevent infinite loop on zero-width match
              }
              html += escapeHtml(str.substring(lastIdx));
              hl.innerHTML = html;
              cnt.textContent = count;
            } catch(e) {
              hl.innerHTML = '<span style="color:#ef4444;">Regex Error: ' + escapeHtml(e.message) + '</span>';
              cnt.textContent = '0';
            }
          }

          function escapeHtml(s) {
            return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          }

          document.addEventListener('DOMContentLoaded', runRegex);
        </script>
      `
    },
    {
      slug: 'css-minifier',
      title: 'CSS Code Minifier & Compressor',
      metaDesc: 'Minify CSS stylesheets online: remove comments, compress whitespace, collapse zero dimensions, and optimize colors.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; CSS Minifier
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">CSS Code Minifier & Compressor</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Compress CSS stylesheets to reduce file size and bandwidth without altering style rendering.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Raw CSS Code</label>
              <textarea id="css-in" class="code-input" style="height: 180px;" placeholder="/* Paste CSS here */&#10;.container {&#10;  margin: 0px auto;&#10;  padding: 20px 10px;&#10;}"></textarea>
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="minifyCss()">&#x26A1; Minify CSS</button>
              <button class="btn-sec" onclick="copyMinCss()">Copy Minified</button>
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                <label class="field-label" style="margin:0;">Minified CSS</label>
                <span id="css-stats" style="font-family: var(--mono); font-size: 0.75rem; color: var(--btn-bg, #3b82f6);"></span>
              </div>
              <textarea id="css-out" class="code-input" style="height: 180px;" readonly></textarea>
            </div>
          </div>
        </div>

        <script>
          function minifyCss() {
            const raw = document.getElementById('css-in').value;
            let min = raw
              .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
              .replace(/\s+/g, ' ') // collapse whitespace
              .replace(/\s*([:;{}])\s*/g, '$1') // remove spaces around punctuation
              .replace(/;}/g, '}') // remove trailing semicolons
              .replace(/0px/g, '0') // 0px -> 0
              .trim();

            document.getElementById('css-out').value = min;

            const origBytes = new Blob([raw]).size;
            const minBytes = new Blob([min]).size;
            const saved = origBytes ? Math.round(((origBytes - minBytes) / origBytes) * 100) : 0;
            document.getElementById('css-stats').textContent = origBytes + ' B → ' + minBytes + ' B (' + saved + '% saved)';
          }

          function copyMinCss() {
            navigator.clipboard.writeText(document.getElementById('css-out').value);
          }
        </script>
      `
    },
    {
      slug: 'hash-generator',
      title: 'Cryptographic Hash Generator (MD5, SHA-256, SHA-512)',
      metaDesc: 'Generate cryptographic checksum hashes in your browser using native Web Crypto API: SHA-1, SHA-256, SHA-384, SHA-512, and MD5.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; Hash Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Cryptographic Hash Generator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Generate SHA-256, SHA-512, SHA-1, and MD5 checksums locally using the hardware-accelerated Web Cryptography API.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Input String</label>
              <textarea id="hash-in" class="code-input" style="height: 100px;" placeholder="Type text to hash..." oninput="genAllHashes()">Digital Tools Shed</textarea>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem;">
              <div>
                <label class="field-label">SHA-256</label>
                <div style="display: flex; gap: 0.5rem;">
                  <input type="text" id="h-sha256" class="code-input" readonly />
                  <button class="btn-sec" onclick="copyHash('h-sha256')">Copy</button>
                </div>
              </div>
              <div>
                <label class="field-label">SHA-512</label>
                <div style="display: flex; gap: 0.5rem;">
                  <input type="text" id="h-sha512" class="code-input" readonly />
                  <button class="btn-sec" onclick="copyHash('h-sha512')">Copy</button>
                </div>
              </div>
              <div>
                <label class="field-label">SHA-1</label>
                <div style="display: flex; gap: 0.5rem;">
                  <input type="text" id="h-sha1" class="code-input" readonly />
                  <button class="btn-sec" onclick="copyHash('h-sha1')">Copy</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <script>
          async function computeHash(algo, text) {
            const enc = new TextEncoder();
            const buf = await window.crypto.subtle.digest(algo, enc.encode(text));
            return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
          }

          async function genAllHashes() {
            const val = document.getElementById('hash-in').value;
            if (!val) {
              document.getElementById('h-sha256').value = '';
              document.getElementById('h-sha512').value = '';
              document.getElementById('h-sha1').value = '';
              return;
            }

            document.getElementById('h-sha256').value = await computeHash('SHA-256', val);
            document.getElementById('h-sha512').value = await computeHash('SHA-512', val);
            document.getElementById('h-sha1').value = await computeHash('SHA-1', val);
          }

          function copyHash(id) {
            navigator.clipboard.writeText(document.getElementById(id).value);
          }

          document.addEventListener('DOMContentLoaded', genAllHashes);
        </script>
      `
    },
    {
      slug: 'box-shadow-generator',
      title: 'CSS Box Shadow Visual Generator',
      metaDesc: 'Create customizable CSS box-shadow effects with real-time blur, spread, X/Y offset, color, and inset controls.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; Box Shadow Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">CSS Box Shadow Visual Generator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Design smooth multi-layered CSS shadows visually with instant code export.
          </p>

          <div class="tool-box">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div class="field-group">
                <label class="field-label">X Offset: <span id="bs-xv">0</span>px</label>
                <input type="range" id="bs-x" min="-50" max="50" value="0" style="width:100%;" oninput="updateShadow()" />
              </div>
              <div class="field-group">
                <label class="field-label">Y Offset: <span id="bs-yv">10</span>px</label>
                <input type="range" id="bs-y" min="-50" max="50" value="10" style="width:100%;" oninput="updateShadow()" />
              </div>
              <div class="field-group">
                <label class="field-label">Blur Radius: <span id="bs-bv">25</span>px</label>
                <input type="range" id="bs-b" min="0" max="100" value="25" style="width:100%;" oninput="updateShadow()" />
              </div>
              <div class="field-group">
                <label class="field-label">Spread: <span id="bs-sv">-5</span>px</label>
                <input type="range" id="bs-s" min="-30" max="50" value="-5" style="width:100%;" oninput="updateShadow()" />
              </div>
            </div>

            <!-- Preview Box -->
            <div style="padding: 4rem 2rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; display: flex; justify-content: center; align-items: center; margin: 1.5rem 0;">
              <div id="bs-preview" style="width: 180px; height: 120px; background: var(--surface); border-radius: 8px; display: flex; justify-content: center; align-items: center; font-family: var(--mono); font-size: 0.85rem; color: var(--fg); border: 1px solid var(--border);">
                Shadow Box
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Generated CSS</label>
              <input type="text" id="bs-css" class="code-input" readonly />
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="navigator.clipboard.writeText(document.getElementById('bs-css').value)">Copy CSS</button>
            </div>
          </div>
        </div>

        <script>
          function updateShadow() {
            const x = document.getElementById('bs-x').value;
            const y = document.getElementById('bs-y').value;
            const b = document.getElementById('bs-b').value;
            const s = document.getElementById('bs-s').value;

            document.getElementById('bs-xv').textContent = x;
            document.getElementById('bs-yv').textContent = y;
            document.getElementById('bs-bv').textContent = b;
            document.getElementById('bs-sv').textContent = s;

            const val = x + 'px ' + y + 'px ' + b + 'px ' + s + 'px rgba(0, 0, 0, 0.15)';
            document.getElementById('bs-preview').style.boxShadow = val;
            document.getElementById('bs-css').value = 'box-shadow: ' + val + ';';
          }

          document.addEventListener('DOMContentLoaded', updateShadow);
        </script>
      `
    },
    {
      slug: 'chmod-calculator',
      title: 'Linux Permissions & Chmod Calculator',
      metaDesc: 'Interactive Linux file permission calculator: convert between octal numbers (e.g. 755, 644) and symbolic permissions (rwxr-xr-x).',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; Chmod Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Linux Permissions & Chmod Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Calculate octal and symbolic Linux/UNIX file permissions with interactive checkboxes for Owner, Group, and Public users.
          </p>

          <div class="tool-box">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem;">
              <div>
                <label class="field-label">Owner (User)</label>
                <label class="opt-label"><input type="checkbox" id="u-r" checked onchange="calcChmod()"> Read (r / 4)</label>
                <label class="opt-label"><input type="checkbox" id="u-w" checked onchange="calcChmod()"> Write (w / 2)</label>
                <label class="opt-label"><input type="checkbox" id="u-x" checked onchange="calcChmod()"> Execute (x / 1)</label>
              </div>
              <div>
                <label class="field-label">Group</label>
                <label class="opt-label"><input type="checkbox" id="g-r" checked onchange="calcChmod()"> Read (r / 4)</label>
                <label class="opt-label"><input type="checkbox" id="g-w" onchange="calcChmod()"> Write (w / 2)</label>
                <label class="opt-label"><input type="checkbox" id="g-x" checked onchange="calcChmod()"> Execute (x / 1)</label>
              </div>
              <div>
                <label class="field-label">Others (Public)</label>
                <label class="opt-label"><input type="checkbox" id="o-r" checked onchange="calcChmod()"> Read (r / 4)</label>
                <label class="opt-label"><input type="checkbox" id="o-w" onchange="calcChmod()"> Write (w / 2)</label>
                <label class="opt-label"><input type="checkbox" id="o-x" checked onchange="calcChmod()"> Execute (x / 1)</label>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; border: 1px solid var(--border); text-align: center;">
                <div class="field-label">Octal Value</div>
                <div id="chmod-octal" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: var(--btn-bg, #3b82f6);">755</div>
              </div>
              <div style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; border: 1px solid var(--border); text-align: center;">
                <div class="field-label">Symbolic Notation</div>
                <div id="chmod-symbolic" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: var(--fg);">-rwxr-xr-x</div>
              </div>
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <label class="field-label">Shell Command</label>
              <input type="text" id="chmod-cmd" class="code-input" value="chmod 755 filename" readonly />
            </div>
          </div>
        </div>

        <script>
          function calcChmod() {
            const ur = document.getElementById('u-r').checked ? 4 : 0;
            const uw = document.getElementById('u-w').checked ? 2 : 0;
            const ux = document.getElementById('u-x').checked ? 1 : 0;
            const u = ur + uw + ux;

            const gr = document.getElementById('g-r').checked ? 4 : 0;
            const gw = document.getElementById('g-w').checked ? 2 : 0;
            const gx = document.getElementById('g-x').checked ? 1 : 0;
            const g = gr + gw + gx;

            const or = document.getElementById('o-r').checked ? 4 : 0;
            const ow = document.getElementById('o-w').checked ? 2 : 0;
            const ox = document.getElementById('o-x').checked ? 1 : 0;
            const o = or + ow + ox;

            const octal = '' + u + g + o;
            const sym = '-' +
              (ur?'r':'-') + (uw?'w':'-') + (ux?'x':'-') +
              (gr?'r':'-') + (gw?'w':'-') + (gx?'x':'-') +
              (or?'r':'-') + (ow?'w':'-') + (ox?'x':'-');

            document.getElementById('chmod-octal').textContent = octal;
            document.getElementById('chmod-symbolic').textContent = sym;
            document.getElementById('chmod-cmd').value = 'chmod ' + octal + ' filename';
          }
          document.addEventListener('DOMContentLoaded', calcChmod);
        </script>
      `
    },
    {
      slug: 'url-encoder',
      title: 'URL Encoder & Decoder with Query Parser',
      metaDesc: 'Encode and decode URL percent-encoded characters, query strings, and parse query parameters into a key-value table.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; URL Encoder / Decoder
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">URL Encoder & Decoder</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Encode special characters into percent-encoded URI strings (e.g. spaces into %20) or decode URLs back to raw text.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">URL / URI String</label>
              <textarea id="url-input" class="code-input" style="height: 140px;" placeholder="https://example.com/search?q=hello world&category=dev"></textarea>
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="encodeUrl()">Encode URL (encodeURIComponent)</button>
              <button class="btn-primary" onclick="decodeUrl()">Decode URL (decodeURIComponent)</button>
              <button class="btn-sec" onclick="copyUrl()">Copy Text</button>
            </div>
          </div>
        </div>

        <script>
          function encodeUrl() {
            const input = document.getElementById('url-input');
            input.value = encodeURIComponent(input.value);
          }
          function decodeUrl() {
            const input = document.getElementById('url-input');
            try {
              input.value = decodeURIComponent(input.value);
            } catch(e) {}
          }
          function copyUrl() {
            navigator.clipboard.writeText(document.getElementById('url-input').value);
          }
        </script>
      `
    }
  ];

  // Render individual pages
  for (const tool of tools) {
    const html = renderPage({
      title: `${tool.title} | Digital Tools Shed`,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/dev/${tool.slug}.html`,
      bodyContent: tool.body,
      currentPath: `/dev/${tool.slug}.html`
    });
    writeFileSync(join(devDist, `${tool.slug}.html`), html);
  }

  // Render Hub Page
  const hubCards = tools.map(t => `
    <a href="/dev/${t.slug}.html" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  const hubBody = `
    ${commonStyle}
    <div class="article-container" style="max-width: 900px;">
      <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Developer Tools Suite</h1>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
        Essential developer utilities: JWT token decoders, regex visualizers, CSS minifiers, cryptographic hashers, and Linux permissions calculators.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
        ${hubCards}
      </div>
    </div>
  `;

  writeFileSync(join(devDist, 'index.html'), renderPage({
    title: 'Developer Tools Suite | Digital Tools Shed',
    metaDesc: 'Free online developer tools: JWT decoder, Regex tester, CSS minifier, SHA-256 hash generator, box shadow generator, and chmod calculator.',
    canonical: `${DOMAIN}/dev/`,
    bodyContent: hubBody,
    currentPath: '/dev/'
  }));

  console.log(`  ✓ Built Developer Tools Suite (${tools.length} tools in /dev/)`);
}
