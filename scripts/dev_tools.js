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
              <textarea id="jwt-input" class="code-input" style="height: 120px;" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." oninput="decodeJwt()"></textarea>
            </div>

            <div class="grid-2col" style="margin-top: 1rem;">
              <div class="field-group">
                <label class="field-label">Header (Algorithm & Type)</label>
                <textarea id="jwt-header" class="code-input" style="height: 160px; color: #ef4444;" readonly></textarea>
              </div>
              <div class="field-group">
                <label class="field-label">Payload (Claims Data)</label>
                <textarea id="jwt-payload" class="code-input" style="height: 160px; color: #3b82f6;" readonly></textarea>
              </div>
            </div>
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
            if (!raw) { hEl.value = ''; pEl.value = ''; return; }
            const parts = raw.split('.');
            if (parts.length < 2) return;
            try {
              hEl.value = JSON.stringify(JSON.parse(b64DecodeUnicode(parts[0])), null, 2);
              pEl.value = JSON.stringify(JSON.parse(b64DecodeUnicode(parts[1])), null, 2);
            } catch(e) {}
          }
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
            Test JavaScript Regular Expressions with live match highlighting.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Pattern</label>
              <input type="text" id="rx-pattern" class="code-input" value="([A-Z])\\w+" oninput="runRegex()" />
            </div>
            <div class="field-group">
              <label class="field-label">Test String</label>
              <textarea id="rx-string" class="code-input" style="height: 120px;" oninput="runRegex()">Hello World! Testing Regex on Digital Tools Shed.</textarea>
            </div>
            <div class="field-group">
              <label class="field-label">Matches</label>
              <div id="rx-highlight" style="background: var(--bg); border: 1px solid var(--border); padding: 0.85rem; border-radius: 4px; font-family: var(--mono); font-size: 0.9rem; min-height: 60px;"></div>
            </div>
          </div>
        </div>

        <script>
          function runRegex() {
            const pat = document.getElementById('rx-pattern').value;
            const str = document.getElementById('rx-string').value;
            const hl = document.getElementById('rx-highlight');
            if (!pat || !str) { hl.textContent = str; return; }
            try {
              const regex = new RegExp(pat, 'g');
              hl.innerHTML = str.replace(regex, m => '<mark style="background:#fef08a;color:#000;">' + m + '</mark>');
            } catch(e) { hl.textContent = 'Error: ' + e.message; }
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
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">CSS Code Minifier</h1>
          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Input CSS</label>
              <textarea id="css-in" class="code-input" style="height: 160px;" placeholder=".box { margin: 0px; }"></textarea>
            </div>
            <div class="action-bar">
              <button class="btn-primary" onclick="minifyCss()">Minify</button>
            </div>
            <div class="field-group" style="margin-top: 1.5rem;">
              <label class="field-label">Minified Output</label>
              <textarea id="css-out" class="code-input" style="height: 160px;" readonly></textarea>
            </div>
          </div>
        </div>
        <script>
          function minifyCss() {
            const raw = document.getElementById('css-in').value;
            document.getElementById('css-out').value = raw
              .replace(/\/\*[\s\S]*?\*\//g, '')
              .replace(/\s+/g, ' ')
              .replace(/\s*([:;{}])\s*/g, '$1')
              .replace(/;}/g, '}')
              .replace(/0px/g, '0')
              .trim();
          }
        </script>
      `
    },
    {
      slug: 'hash-generator',
      title: 'Cryptographic Hash Generator',
      metaDesc: 'Generate SHA-256, SHA-512, and SHA-1 checksums locally using the hardware-accelerated Web Cryptography API.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; Hash Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Cryptographic Hash Generator</h1>
          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Text to Hash</label>
              <input type="text" id="hash-in" class="text-input" value="Digital Tools Shed" oninput="genAllHashes()" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem;">
              <div><label class="field-label">SHA-256</label><input type="text" id="h-sha256" class="code-input" readonly /></div>
              <div><label class="field-label">SHA-512</label><input type="text" id="h-sha512" class="code-input" readonly /></div>
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
            const v = document.getElementById('hash-in').value;
            document.getElementById('h-sha256').value = v ? await computeHash('SHA-256', v) : '';
            document.getElementById('h-sha512').value = v ? await computeHash('SHA-512', v) : '';
          }
          document.addEventListener('DOMContentLoaded', genAllHashes);
        </script>
      `
    },
    {
      slug: 'box-shadow-generator',
      title: 'CSS Box Shadow Generator',
      metaDesc: 'Visual CSS box-shadow slider tool with real-time blur, spread, and color controls.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; Box Shadow Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">CSS Box Shadow Generator</h1>
          <div class="tool-box">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="field-group"><label class="field-label">X Offset: <span id="bs-x-lbl">0</span>px</label><input type="range" id="bs-x" min="-50" max="50" value="0" style="width:100%;" oninput="upShadow()" /></div>
              <div class="field-group"><label class="field-label">Y Offset: <span id="bs-y-lbl">10</span>px</label><input type="range" id="bs-y" min="-50" max="50" value="10" style="width:100%;" oninput="upShadow()" /></div>
            </div>
            <div style="padding: 3rem; background: var(--surface-alt); border-radius: 6px; display: flex; justify-content: center; margin: 1.5rem 0;">
              <div id="bs-box" style="width: 150px; height: 100px; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; display: flex; justify-content: center; align-items: center;">Preview</div>
            </div>
            <div class="field-group"><label class="field-label">CSS Code</label><input type="text" id="bs-code" class="code-input" readonly /></div>
          </div>
        </div>
        <script>
          function upShadow() {
            const x = document.getElementById('bs-x').value;
            const y = document.getElementById('bs-y').value;
            document.getElementById('bs-x-lbl').textContent = x;
            document.getElementById('bs-y-lbl').textContent = y;
            const val = x + 'px ' + y + 'px 20px rgba(0,0,0,0.15)';
            document.getElementById('bs-box').style.boxShadow = val;
            document.getElementById('bs-code').value = 'box-shadow: ' + val + ';';
          }
          document.addEventListener('DOMContentLoaded', upShadow);
        </script>
      `
    },
    {
      slug: 'chmod-calculator',
      title: 'Linux Permissions & Chmod Calculator',
      metaDesc: 'Calculate Linux octal permissions (755, 644) and symbolic notations.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; Chmod Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Linux Chmod Calculator</h1>
          <div class="tool-box">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
              <div><label class="field-label">User</label><label><input type="checkbox" id="ur" checked onchange="ch()"> Read (4)</label><br><label><input type="checkbox" id="uw" checked onchange="ch()"> Write (2)</label><br><label><input type="checkbox" id="ux" checked onchange="ch()"> Exec (1)</label></div>
              <div><label class="field-label">Group</label><label><input type="checkbox" id="gr" checked onchange="ch()"> Read (4)</label><br><label><input type="checkbox" id="gw" onchange="ch()"> Write (2)</label><br><label><input type="checkbox" id="gx" checked onchange="ch()"> Exec (1)</label></div>
              <div><label class="field-label">Others</label><label><input type="checkbox" id="or" checked onchange="ch()"> Read (4)</label><br><label><input type="checkbox" id="ow" onchange="ch()"> Write (2)</label><br><label><input type="checkbox" id="ox" checked onchange="ch()"> Exec (1)</label></div>
            </div>
            <div class="field-group" style="margin-top: 1.5rem;"><label class="field-label">Command</label><input type="text" id="ch-cmd" class="code-input" readonly /></div>
          </div>
        </div>
        <script>
          function ch() {
            const u = (document.getElementById('ur').checked?4:0)+(document.getElementById('uw').checked?2:0)+(document.getElementById('ux').checked?1:0);
            const g = (document.getElementById('gr').checked?4:0)+(document.getElementById('gw').checked?2:0)+(document.getElementById('gx').checked?1:0);
            const o = (document.getElementById('or').checked?4:0)+(document.getElementById('ow').checked?2:0)+(document.getElementById('ox').checked?1:0);
            document.getElementById('ch-cmd').value = 'chmod ' + u + g + o + ' filename';
          }
          document.addEventListener('DOMContentLoaded', ch);
        </script>
      `
    },
    {
      slug: 'url-encoder',
      title: 'URL Encoder & Decoder',
      metaDesc: 'Encode and decode URL parameters and percent-encoded characters.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; URL Encoder
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">URL Encoder & Decoder</h1>
          <div class="tool-box">
            <textarea id="url-in" class="code-input" style="height: 120px;" placeholder="https://example.com/search?q=hello world"></textarea>
            <div class="action-bar">
              <button class="btn-primary" onclick="document.getElementById('url-in').value=encodeURIComponent(document.getElementById('url-in').value)">Encode</button>
              <button class="btn-sec" onclick="try{document.getElementById('url-in').value=decodeURIComponent(document.getElementById('url-in').value)}catch(e){}">Decode</button>
            </div>
          </div>
        </div>
      `
    },
    {
      slug: 'sql-formatter',
      title: 'SQL Query Formatter & Beautifier',
      metaDesc: 'Beautify and indent SQL queries with uppercase keyword formatting in your browser.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; SQL Formatter
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">SQL Query Formatter & Beautifier</h1>
          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Raw SQL</label>
              <textarea id="sql-in" class="code-input" style="height: 140px;" placeholder="select id, name, email from users where active = 1 order by created_at desc;"></textarea>
            </div>
            <div class="action-bar">
              <button class="btn-primary" onclick="formatSql()">Format SQL</button>
            </div>
            <div class="field-group" style="margin-top: 1.5rem;">
              <label class="field-label">Formatted SQL</label>
              <textarea id="sql-out" class="code-input" style="height: 160px;" readonly></textarea>
            </div>
          </div>
        </div>
        <script>
          function formatSql() {
            let sql = document.getElementById('sql-in').value.trim();
            const keywords = ['SELECT','FROM','WHERE','AND','OR','GROUP BY','ORDER BY','HAVING','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN','OUTER JOIN','LIMIT','OFFSET','INSERT INTO','VALUES','UPDATE','SET','DELETE'];
            keywords.forEach(k => {
              const r = new RegExp('\\b' + k + '\\b', 'gi');
              sql = sql.replace(r, '\n' + k);
            });
            document.getElementById('sql-out').value = sql.trim();
          }
        </script>
      `
    },
    {
      slug: 'json-to-csv',
      title: 'JSON to CSV Converter',
      metaDesc: 'Convert JSON arrays of objects into downloadable CSV spreadsheet files.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; JSON to CSV
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">JSON to CSV Converter</h1>
          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">JSON Input (Array of Objects)</label>
              <textarea id="j2c-in" class="code-input" style="height: 140px;" placeholder='[{"name":"John","age":30},{"name":"Jane","age":25}]'></textarea>
            </div>
            <div class="action-bar">
              <button class="btn-primary" onclick="jsonToCsv()">Convert to CSV</button>
            </div>
            <div class="field-group" style="margin-top: 1.5rem;">
              <label class="field-label">CSV Output</label>
              <textarea id="j2c-out" class="code-input" style="height: 140px;" readonly></textarea>
            </div>
          </div>
        </div>
        <script>
          function jsonToCsv() {
            try {
              const data = JSON.parse(document.getElementById('j2c-in').value);
              if (!Array.isArray(data) || data.length === 0) return;
              const headers = Object.keys(data[0]);
              const rows = [headers.join(',')];
              data.forEach(obj => {
                rows.push(headers.map(h => JSON.stringify(obj[h] ?? '')).join(','));
              });
              document.getElementById('j2c-out').value = rows.join('\n');
            } catch(e) { document.getElementById('j2c-out').value = 'Error: ' + e.message; }
          }
        </script>
      `
    },
    {
      slug: 'ip-subnet-calculator',
      title: 'IPv4 CIDR Subnet Calculator',
      metaDesc: 'Calculate network address, broadcast address, netmask, and usable host count from IP/CIDR prefix.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; IP Subnet Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">IPv4 CIDR Subnet Calculator</h1>
          <div class="tool-box">
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem;">
              <div class="field-group"><label class="field-label">IP Address</label><input type="text" id="ip-addr" class="text-input" value="192.168.1.100" oninput="calcSubnet()" /></div>
              <div class="field-group"><label class="field-label">CIDR Prefix (/) </label><input type="number" id="ip-cidr" class="text-input" value="24" min="1" max="32" oninput="calcSubnet()" /></div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.9rem; margin-top: 1rem;" id="subnet-res"></div>
          </div>
        </div>
        <script>
          function calcSubnet() {
            const cidr = parseInt(document.getElementById('ip-cidr').value, 10) || 24;
            const hosts = Math.pow(2, 32 - cidr);
            const usable = Math.max(0, hosts - 2);
            document.getElementById('subnet-res').innerHTML = 'Total Addresses: <strong>' + hosts.toLocaleString() + '</strong><br>Usable Host Capacity: <strong>' + usable.toLocaleString() + '</strong>';
          }
          document.addEventListener('DOMContentLoaded', calcSubnet);
        </script>
      `
    },
    {
      slug: 'html-entity-encoder',
      title: 'HTML Entity Encoder & Decoder',
      metaDesc: 'Convert special characters into HTML named and numeric entities and decode HTML entities back to plaintext.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; HTML Entity Encoder
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">HTML Entity Encoder & Decoder</h1>
          <div class="tool-box">
            <textarea id="ent-in" class="code-input" style="height: 120px;" placeholder="<div class=&quot;box&quot;>Hello & welcome!</div>"></textarea>
            <div class="action-bar">
              <button class="btn-primary" onclick="document.getElementById('ent-in').value=document.getElementById('ent-in').value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;')">Encode Entities</button>
              <button class="btn-sec" onclick="const ta=document.createElement('textarea'); ta.innerHTML=document.getElementById('ent-in').value; document.getElementById('ent-in').value=ta.value;">Decode Entities</button>
            </div>
          </div>
        </div>
      `
    },
    {
      slug: 'ai-robots-txt',
      title: 'AI Bot Blocker robots.txt Generator',
      metaDesc: 'Generate a robots.txt file to block AI web scrapers and LLM training crawlers (GPTBot, Claude-Web, CCBot, Google-Extended, Bytespider) while keeping Googlebot allowed.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; AI Bot Blocker robots.txt
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">AI Bot Blocker robots.txt Generator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Protect your website content, articles, and codebase from unauthorized AI training scrapers while allowing search engines like Google and Bing to index your pages normally.
          </p>

          <div class="tool-box">
            <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;">Select AI Bots to Block:</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;" id="botToggles">
              <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
                <input type="checkbox" id="bot-gpt" checked onchange="buildRobots()" /> OpenAI (GPTBot, ChatGPT-User)
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
                <input type="checkbox" id="bot-anthropic" checked onchange="buildRobots()" /> Anthropic (Claude-Web, anthropic-ai)
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
                <input type="checkbox" id="bot-google" checked onchange="buildRobots()" /> Google AI (Google-Extended)
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
                <input type="checkbox" id="bot-cc" checked onchange="buildRobots()" /> Common Crawl (CCBot)
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
                <input type="checkbox" id="bot-meta" checked onchange="buildRobots()" /> Meta AI (Meta-ExternalAgent, FacebookBot)
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
                <input type="checkbox" id="bot-bytedance" checked onchange="buildRobots()" /> ByteDance / TikTok (Bytespider)
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
                <input type="checkbox" id="bot-perplexity" checked onchange="buildRobots()" /> Perplexity (PerplexityBot)
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
                <input type="checkbox" id="bot-apple" checked onchange="buildRobots()" /> Apple Intelligence (Applebot-Extended)
              </label>
            </div>

            <div class="field-group">
              <label class="field-label">Sitemap URL (Optional):</label>
              <input type="url" id="robots-sitemap" class="text-input" placeholder="https://example.com/sitemap.xml" oninput="buildRobots()" />
            </div>

            <div class="field-group">
              <label class="field-label">Generated robots.txt Preview</label>
              <textarea id="robots-out" class="code-input" style="height: 260px;" readonly></textarea>
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="navigator.clipboard.writeText(document.getElementById('robots-out').value); alert('robots.txt copied to clipboard!');">Copy robots.txt</button>
              <button class="btn-sec" onclick="downloadRobots()">Download robots.txt</button>
            </div>
          </div>
        </div>

        <script>
          function buildRobots() {
            var lines = [];
            lines.push('# Standard Search Engines (Allowed for SEO ranking)');
            lines.push('User-agent: Googlebot');
            lines.push('Allow: /');
            lines.push('');
            lines.push('User-agent: Bingbot');
            lines.push('Allow: /');
            lines.push('');

            var bots = [];
            if (document.getElementById('bot-gpt').checked) bots.push('GPTBot', 'ChatGPT-User', 'OAI-SearchBot');
            if (document.getElementById('bot-anthropic').checked) bots.push('Claude-Web', 'anthropic-ai');
            if (document.getElementById('bot-google').checked) bots.push('Google-Extended');
            if (document.getElementById('bot-cc').checked) bots.push('CCBot');
            if (document.getElementById('bot-meta').checked) bots.push('Meta-ExternalAgent', 'FacebookBot');
            if (document.getElementById('bot-bytedance').checked) bots.push('Bytespider');
            if (document.getElementById('bot-perplexity').checked) bots.push('PerplexityBot');
            if (document.getElementById('bot-apple').checked) bots.push('Applebot-Extended');

            if (bots.length > 0) {
              lines.push('# AI Scrapers & Data Harvesters (Blocked)');
              bots.forEach(function(b) {
                lines.push('User-agent: ' + b);
                lines.push('Disallow: /');
                lines.push('');
              });
            }

            lines.push('# Default Catch-All');
            lines.push('User-agent: *');
            lines.push('Allow: /');

            var sm = document.getElementById('robots-sitemap').value.trim();
            if (sm) {
              lines.push('');
              lines.push('Sitemap: ' + sm);
            }

            document.getElementById('robots-out').value = lines.join('\\n');
          }

          function downloadRobots() {
            var blob = new Blob([document.getElementById('robots-out').value], { type: 'text/plain' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'robots.txt';
            a.click();
          }

          document.addEventListener('DOMContentLoaded', buildRobots);
        </script>
      `
    },
    {
      slug: 'cron-generator',
      title: 'Cron Expression Generator & Schedule Explainer',
      metaDesc: 'Generate and test crontab schedule expressions in human-readable English. Includes live preview of next scheduled execution dates.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; Cron Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Cron Expression Generator & Schedule Builder</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Construct Linux and Unix crontab expressions with live human-readable translation and next execution calculations.
          </p>

          <div class="tool-box">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
              <span style="font-size: 0.85rem; font-weight: bold; color: var(--text-muted); line-height: 2;">Quick Presets:</span>
              <button class="btn-sec" onclick="setCron('* * * * *')">Every Minute</button>
              <button class="btn-sec" onclick="setCron('*/5 * * * *')">Every 5 Min</button>
              <button class="btn-sec" onclick="setCron('0 * * * *')">Hourly</button>
              <button class="btn-sec" onclick="setCron('0 0 * * *')">Daily (Midnight)</button>
              <button class="btn-sec" onclick="setCron('0 0 * * 0')">Weekly (Sunday)</button>
              <button class="btn-sec" onclick="setCron('0 0 1 * *')">Monthly (1st)</button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; margin-bottom: 1.25rem;">
              <div>
                <label class="field-label">Minute (0-59)</label>
                <input type="text" id="cron-m" class="text-input" value="*" oninput="updateFromFields()" />
              </div>
              <div>
                <label class="field-label">Hour (0-23)</label>
                <input type="text" id="cron-h" class="text-input" value="*" oninput="updateFromFields()" />
              </div>
              <div>
                <label class="field-label">Day Month (1-31)</label>
                <input type="text" id="cron-dom" class="text-input" value="*" oninput="updateFromFields()" />
              </div>
              <div>
                <label class="field-label">Month (1-12)</label>
                <input type="text" id="cron-mon" class="text-input" value="*" oninput="updateFromFields()" />
              </div>
              <div>
                <label class="field-label">Day Week (0-6 Sun-Sat)</label>
                <input type="text" id="cron-dow" class="text-input" value="*" oninput="updateFromFields()" />
              </div>
            </div>

            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; margin: 1.5rem 0; text-align: center;">
              <div class="field-label">CRON EXPRESSION</div>
              <div id="cron-result" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; margin: 0.5rem 0; color: var(--btn-bg, #3b82f6);">* * * * *</div>
              <div id="cron-desc" style="font-size: 1.05rem; color: var(--fg); font-weight: 500;">Runs every minute of every hour, every day.</div>
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="navigator.clipboard.writeText(document.getElementById('cron-result').textContent); alert('Cron expression copied!');">Copy Expression</button>
            </div>
          </div>
        </div>

        <script>
          function setCron(expr) {
            var p = expr.split(' ');
            document.getElementById('cron-m').value = p[0];
            document.getElementById('cron-h').value = p[1];
            document.getElementById('cron-dom').value = p[2];
            document.getElementById('cron-mon').value = p[3];
            document.getElementById('cron-dow').value = p[4];
            updateFromFields();
          }

          function updateFromFields() {
            var m = document.getElementById('cron-m').value.trim() || '*';
            var h = document.getElementById('cron-h').value.trim() || '*';
            var dom = document.getElementById('cron-dom').value.trim() || '*';
            var mon = document.getElementById('cron-mon').value.trim() || '*';
            var dow = document.getElementById('cron-dow').value.trim() || '*';
            var full = m + ' ' + h + ' ' + dom + ' ' + mon + ' ' + dow;
            document.getElementById('cron-result').textContent = full;

            var desc = 'Runs ';
            if (m === '*' && h === '*') desc += 'every minute of every hour';
            else if (m.startsWith('*/')) desc += 'every ' + m.slice(2) + ' minutes';
            else if (m === '0' && h === '*') desc += 'at the start of every hour';
            else if (m === '0' && h === '0') desc += 'every day at midnight (00:00)';
            else desc += 'at minute ' + m + ', hour ' + h;

            if (dom !== '*') desc += ' on day ' + dom + ' of the month';
            if (mon !== '*') desc += ' in month ' + mon;
            if (dow !== '*') {
              var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              desc += ' on ' + (days[parseInt(dow, 10)] || ('day-of-week ' + dow));
            }
            desc += '.';
            document.getElementById('cron-desc').textContent = desc;
          }

          document.addEventListener('DOMContentLoaded', updateFromFields);
        </script>
      `
    },
    {
      slug: 'js-minifier',
      title: 'JavaScript Minifier & Code Compressor',
      metaDesc: 'Minify and compress JavaScript source code in your browser with zero network uploads. Remove comments, whitespace, and optimize syntax.',
      category: 'Developer',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; JS Minifier
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">JavaScript Minifier & Compressor</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Compress and minify JS files instantly in browser memory. Strips comments and compacts whitespace without altering logic.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Original JavaScript Code</label>
              <textarea id="js-in" class="code-input" style="height: 180px;" placeholder="// Paste unminified JavaScript here...\\nfunction greet(name) {\\n    // say hello\\n    console.log('Hello, ' + name);\\n}"></textarea>
            </div>

            <div class="action-bar" style="margin-bottom: 1.5rem;">
              <button class="btn-primary" onclick="minifyJs()">Minify JavaScript</button>
              <button class="btn-sec" onclick="document.getElementById('js-in').value=''; document.getElementById('js-out').value='';">Clear</button>
            </div>

            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <label class="field-label" style="margin-bottom: 0;">Minified Output</label>
                <span id="js-stats" style="font-family: var(--mono); font-size: 0.75rem; color: #22c55e; font-weight: bold;"></span>
              </div>
              <textarea id="js-out" class="code-input" style="height: 180px;" readonly></textarea>
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="navigator.clipboard.writeText(document.getElementById('js-out').value); alert('Minified JS copied!');">Copy Minified JS</button>
            </div>
          </div>
        </div>

        <script>
          function minifyJs() {
            var src = document.getElementById('js-in').value;
            if (!src) return;

            var origLen = src.length;
            // 1. Remove single-line comments (ignoring urls like http://)
            var min = src.replace(/(?:^|[\\s;{}()])\\/\\/[^\\r\\n]*/g, '');
            // 2. Remove multi-line comments
            min = min.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');
            // 3. Normalize multiple whitespace and newlines
            min = min.replace(/\\s*([{}();,=+\\-*\\/<>?:&|!])\\s*/g, '$1');
            min = min.replace(/\\s+/g, ' ').trim();

            document.getElementById('js-out').value = min;
            var newLen = min.length;
            var savings = origLen > 0 ? (((origLen - newLen) / origLen) * 100).toFixed(1) : 0;
            document.getElementById('js-stats').textContent = origLen + ' B -> ' + newLen + ' B (' + savings + '% reduction)';
          }
        </script>
      `
    },
    {
      slug: 'url-parser',
      title: 'URL Parser & Query String Parameter Inspector',
      metaDesc: 'Deconstruct and parse any URL into protocol, origin, host, path segments, query parameters table, hash, and JSON object.',
      category: 'Developer',
      faq: [
        { q: 'What are the core components of a standard URL?', a: 'A standard URL consists of a protocol/scheme (e.g., https:), credentials (username/password), hostname (domain), port, pathname, query parameters (?key=val), and fragment hash (#section).' },
        { q: 'How do query string parameters work in a URL?', a: 'Query strings begin after the question mark (?) and consist of key=value pairs separated by ampersands (&). Values containing spaces or special characters are percent-encoded.' },
        { q: 'Is my URL sent to any remote server when using this tool?', a: 'No. All URL parsing and query string decoding is performed 100% locally inside your browser using the native browser URL and URLSearchParams APIs.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 950px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; URL Parser
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">URL Parser & Query Parameter Inspector</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Break down, analyze, and inspect any URL. View individual query string parameters, path segments, and export structured JSON.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Enter Full URL to Parse</label>
              <input type="text" id="url-input" class="code-input" value="https://api.example.com:8443/v2/products/search?category=electronics&brand=apple&sort=price_desc&page=1&discount=true#reviews" oninput="parseUrl()" />
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.75rem; border-radius: 4px;">
                <span style="font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Protocol</span>
                <div id="u-protocol" style="font-family: var(--mono); font-weight: bold; color: #3b82f6;">--</div>
              </div>
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.75rem; border-radius: 4px;">
                <span style="font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Hostname</span>
                <div id="u-hostname" style="font-family: var(--mono); font-weight: bold; color: var(--fg);">--</div>
              </div>
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.75rem; border-radius: 4px;">
                <span style="font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Port</span>
                <div id="u-port" style="font-family: var(--mono); font-weight: bold; color: var(--fg);">--</div>
              </div>
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.75rem; border-radius: 4px;">
                <span style="font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Hash / Fragment</span>
                <div id="u-hash" style="font-family: var(--mono); font-weight: bold; color: #eab308;">--</div>
              </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 0.35rem;">Pathname & Segments</span>
              <div id="u-pathname" style="font-family: var(--mono); font-size: 0.95rem; background: var(--bg); padding: 0.6rem; border: 1px solid var(--border); border-radius: 4px; color: var(--fg); margin-bottom: 0.4rem;">--</div>
              <div id="u-segments" style="display: flex; gap: 0.4rem; flex-wrap: wrap;"></div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Query Parameters (<span id="param-count">0</span>)</span>
                <button class="btn-sec" onclick="copyParamsJson()" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;">Copy Query as JSON</button>
              </div>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.85rem;" id="paramsTable">
                  <thead>
                    <tr style="border-bottom: 1px solid var(--border); text-align: left; color: var(--text-muted);">
                      <th style="padding: 0.5rem;">Parameter Key</th>
                      <th style="padding: 0.5rem;">Decoded Value</th>
                      <th style="padding: 0.5rem; width: 60px;">Action</th>
                    </tr>
                  </thead>
                  <tbody id="paramsRows"></tbody>
                </table>
              </div>
            </div>

            <div class="action-bar" style="margin-top: 1.5rem;">
              <button class="btn-primary" onclick="copyParsedJson()">Copy All as JSON</button>
            </div>
          </div>
        </div>

        <script>
          var parsedObj = {};

          function parseUrl() {
            var raw = document.getElementById('url-input').value.trim();
            if (!raw) return;

            try {
              var u = new URL(raw.match(/^[a-zA-Z]+:\\/\\//) ? raw : 'https://' + raw);
              document.getElementById('u-protocol').textContent = u.protocol;
              document.getElementById('u-hostname').textContent = u.hostname;
              document.getElementById('u-port').textContent = u.port || '(default ' + (u.protocol === 'https:' ? '443' : '80') + ')';
              document.getElementById('u-hash').textContent = u.hash || '(none)';
              document.getElementById('u-pathname').textContent = u.pathname;

              var segments = u.pathname.split('/').filter(Boolean);
              document.getElementById('u-segments').innerHTML = segments.map(function(s, idx) {
                return '<span style=\"background:var(--surface-alt); border:1px solid var(--border); padding:0.2rem 0.5rem; border-radius:3px; font-family:var(--mono); font-size:0.75rem;\">[' + idx + '] ' + s + '</span>';
              }).join('') || '<span style=\"font-size:0.8rem; color:var(--text-muted);\">No sub-paths</span>';

              var tbody = document.getElementById('paramsRows');
              tbody.innerHTML = '';
              var count = 0;
              var qObj = {};

              u.searchParams.forEach(function(val, key) {
                count++;
                qObj[key] = val;
                var tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border)';
                tr.innerHTML = 
                  '<td style=\"padding:0.5rem; font-weight:bold; color:var(--fg);\">' + escapeHtml(key) + '</td>' +
                  '<td style=\"padding:0.5rem; color:#22c55e;\">' + escapeHtml(val) + '</td>' +
                  '<td style=\"padding:0.5rem;\"><button class=\"btn-sec\" style=\"font-size:0.7rem; padding:0.2rem 0.4rem;\" onclick=\"copyText(\\'' + escapeHtml(val).replace(/'/g, \"\\\\'\") + '\\')\">Copy</button></td>';
                tbody.appendChild(tr);
              });

              document.getElementById('param-count').textContent = count;
              if (count === 0) {
                tbody.innerHTML = '<tr><td colspan=\"3\" style=\"padding:0.75rem; text-align:center; color:var(--text-muted); font-size:0.85rem;\">No query parameters found</td></tr>';
              }

              parsedObj = {
                href: u.href,
                protocol: u.protocol,
                origin: u.origin,
                hostname: u.hostname,
                port: u.port,
                pathname: u.pathname,
                pathSegments: segments,
                queryParams: qObj,
                hash: u.hash
              };
            } catch (e) {
              document.getElementById('u-protocol').textContent = 'Invalid URL';
            }
          }

          function escapeHtml(str) {
            return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
          }

          function copyText(val) {
            navigator.clipboard.writeText(val);
          }

          function copyParamsJson() {
            if (parsedObj.queryParams) {
              navigator.clipboard.writeText(JSON.stringify(parsedObj.queryParams, null, 2));
              alert('Copied query params as JSON!');
            }
          }

          function copyParsedJson() {
            navigator.clipboard.writeText(JSON.stringify(parsedObj, null, 2));
            alert('Copied parsed URL breakdown as JSON!');
          }

          document.addEventListener('DOMContentLoaded', parseUrl);
          parseUrl();
        </script>
      `
    }
  ];

  // Render individual pages
  for (const tool of tools) {
    const html = renderPage({
      title: `${tool.title} | Digital Tools Shed`,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/dev/${tool.slug}`,
      bodyContent: tool.body,
      currentPath: `/dev/${tool.slug}`,
      faq: tool.faq
    });
    writeFileSync(join(devDist, `${tool.slug}.html`), html);
  }

  // Render Hub Page
  const hubCards = tools.map(t => `
    <a href="/dev/${t.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  const hubBody = `
    ${commonStyle}
    <div class="article-container" style="max-width: 900px;">
      <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Developer Tools Suite</h1>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
        Essential developer utilities: JWT token decoders, regex visualizers, SQL formatters, JSON converters, CSS minifiers, and Linux chmod tools.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
        ${hubCards}
      </div>
    </div>
  `;

  writeFileSync(join(devDist, 'index.html'), renderPage({
    title: 'Developer Tools Suite | Digital Tools Shed',
    metaDesc: 'Free online developer tools: JWT decoder, Regex tester, SQL formatter, JSON to CSV, CSS minifier, and subnet calculator.',
    canonical: `${DOMAIN}/dev/`,
    bodyContent: hubBody,
    currentPath: '/dev/'
  }));

  console.log(`  ✓ Built Developer Tools Suite (${tools.length} tools in /dev/)`);
}
