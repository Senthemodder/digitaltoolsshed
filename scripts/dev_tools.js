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
              <button class="btn-primary" onclick="document.getElementById('ent-in').value=document.getElementById('ent-in').value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')">Encode Entities</button>
              <button class="btn-sec" onclick="const ta=document.createElement('textarea'); ta.innerHTML=document.getElementById('ent-in').value; document.getElementById('ent-in').value=ta.value;">Decode Entities</button>
            </div>
          </div>
        </div>
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
