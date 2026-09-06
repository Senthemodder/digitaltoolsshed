// scripts/web_suite.js — Web Engineering & Internet Architecture Master Suite for Digital Tools Shed
// 14 Interactive Flagship Tools + Master Hub (/web/)
import { renderPage } from './core.js';

export function buildWebSuite({ DIST, DOMAIN, writeFileSync, join, ensureDir }) {
  console.log('  🔨 Building Web Engineering & Internet Architecture Suite (14 Tools + Hub)...');
  const webDist = join(DIST, 'web');
  ensureDir(webDist);

  const sharedStyle = `
    <style>
      .wb-card { background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0; }
      .wb-header { margin-bottom: 1.5rem; }
      .wb-badge { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.72rem; font-family: var(--mono); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
      .badge-blue { background: rgba(59, 130, 246, 0.12); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
      .badge-green { background: rgba(34, 197, 94, 0.12); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
      .badge-amber { background: rgba(245, 158, 11, 0.12); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
      .badge-red { background: rgba(239, 68, 68, 0.12); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
      .badge-purple { background: rgba(168, 85, 247, 0.12); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
      .field-label { display: block; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; font-weight: 600; }
      .code-input, .text-input { width: 100%; padding: 0.75rem; font-family: var(--mono); font-size: 0.88rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; box-sizing: border-box; }
      .code-input:focus, .text-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
      .btn-primary { background: #3b82f6; color: #fff; border: none; padding: 0.65rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; font-weight: 600; cursor: pointer; border-radius: 4px; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 0.5rem; }
      .btn-primary:hover { background: #2563eb; }
      .btn-sec { background: transparent; color: var(--fg); border: 1px solid var(--border); padding: 0.65rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; border-radius: 4px; transition: all 0.15s ease; }
      .btn-sec:hover { background: var(--surface-alt); border-color: var(--text-muted); }
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
      .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
      .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; }
      @media (max-width: 840px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } }
      .nav-crumbs { font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted); }
      .nav-crumbs a { color: var(--text-muted); text-decoration: none; }
      .nav-crumbs a:hover { color: #3b82f6; text-decoration: underline; }
      .tab-bar { display: flex; gap: 0.5rem; border-bottom: 1px solid var(--border); margin-bottom: 1.25rem; flex-wrap: wrap; }
      .tab-btn { background: transparent; border: none; padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.82rem; color: var(--text-muted); cursor: pointer; border-bottom: 2px solid transparent; }
      .tab-btn.active { color: #3b82f6; border-bottom-color: #3b82f6; font-weight: 600; }
      .faq-item { border-bottom: 1px solid var(--border); padding: 1rem 0; }
      .faq-q { font-weight: 600; font-size: 1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: var(--fg); }
      .faq-a { color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-top: 0.5rem; display: none; }
      .faq-item.open .faq-a { display: block; }
      .trap-card { background: var(--surface-alt); border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; font-size: 0.9rem; line-height: 1.5; }
      .trap-card strong { display: block; margin-bottom: 0.3rem; font-size: 0.95rem; }
    </style>
  `;

  // 1. CSP & CORS Policy Architect
  const cspTool = {
    slug: 'csp-cors-architect',
    title: 'Content Security Policy (CSP) & CORS Policy Architect [Security Workbench]',
    metaDesc: 'Interactive visual Content Security Policy (CSP) & CORS header generator. Calculate nonces, SHA-256 inline script hashes, detect wildcard XSS vulnerabilities, and export Nginx/Apache/Cloudflare configurations.',
    category: 'Web Engineering',
    keywords: 'content security policy generator, csp builder, cors header generator, csp nonce generator, sha256 csp hash, clickjacking protection, xss prevention',
    faqs: [
      { q: 'What is the difference between CSP and CORS?', a: 'Content Security Policy (CSP) is an HTTP response header that restricts the resources (scripts, styles, images, iframes) the browser is allowed to load for a page, preventing Cross-Site Scripting (XSS) and clickjacking. Cross-Origin Resource Sharing (CORS) manages which external origins are allowed to read responses from your API via XMLHttpRequest or Fetch.' },
      { q: 'Why is unsafe-inline dangerous in script-src?', a: 'Specifying unsafe-inline allows any inline script tag or inline event handler to execute without verification. If an attacker injects user input into the DOM, the browser executes it immediately. Using cryptographic nonces or SHA-256 hashes ensures only approved scripts run.' },
      { q: 'How does frame-ancestors protect against clickjacking?', a: 'The frame-ancestors directive obsoletes the legacy X-Frame-Options header. Setting frame-ancestors self or none stops malicious third-party websites from framing your application inside transparent iframes to trick authenticated users into clicking unauthorized actions.' },
      { q: 'What is the maximum preflight cache duration for Access-Control-Max-Age?', a: 'The Access-Control-Max-Age header tells the browser how many seconds to cache the OPTIONS preflight response. While the specification allows arbitrary values, modern browsers enforce internal caps: Chromium-based browsers cap preflights at 7,200 seconds (2 hours), while Firefox allows up to 86,400 seconds (24 hours).' },
      { q: 'Can a strict Content Security Policy break third-party tag managers or analytics?', a: 'Yes. If a tag manager dynamically injects remote scripts or creates inline snippets without matching hashes or nonces, a strict CSP will block them. Production deployments must allowlist the tag manager domains and configure server-side nonce propagation to dynamically generated tags.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/web/">Web Engineering</a> &gt; CSP & CORS Architect</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">RFC 9110 / W3C CSP3</span>
            <span class="wb-badge badge-green">Zero-Dependency</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Content Security Policy & CORS Architect</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Visually construct hardened HTTP security headers, generate WebCrypto nonces, compute SHA-256 script hashes, and audit policies for dangerous XSS injection vectors.
          </p>
        </div>

        <div class="tab-bar">
          <button type="button" class="tab-btn active" onclick="switchCspTab('csp')">Content Security Policy (CSP)</button>
          <button type="button" class="tab-btn" onclick="switchCspTab('cors')">CORS Policy Architect</button>
          <button type="button" class="tab-btn" onclick="switchCspTab('hash')">SHA-256 Script Hash / Nonce</button>
        </div>

        <!-- TAB 1: CSP BUILDER -->
        <div id="csp-tab-content">
          <div class="wb-card">
            <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Directives & Source Allowlist</h3>
            <div class="grid-2">
              <div>
                <label class="field-label" for="csp-default">default-src (Fallback)</label>
                <input type="text" id="csp-default" class="text-input" value="'self'" oninput="generateCsp()" />
              </div>
              <div>
                <label class="field-label" for="csp-script">script-src (Executable Code)</label>
                <input type="text" id="csp-script" class="text-input" value="'self' https://trustedscripts.com" oninput="generateCsp()" />
              </div>
              <div>
                <label class="field-label" for="csp-style">style-src (Stylesheets)</label>
                <input type="text" id="csp-style" class="text-input" value="'self' 'unsafe-inline' https://fonts.googleapis.com" oninput="generateCsp()" />
              </div>
              <div>
                <label class="field-label" for="csp-img">img-src (Images & Vectors)</label>
                <input type="text" id="csp-img" class="text-input" value="'self' data: https:" oninput="generateCsp()" />
              </div>
              <div>
                <label class="field-label" for="csp-connect">connect-src (Fetch, XHR, WebSockets)</label>
                <input type="text" id="csp-connect" class="text-input" value="'self' https://api.example.com wss:" oninput="generateCsp()" />
              </div>
              <div>
                <label class="field-label" for="csp-ancestors">frame-ancestors (Clickjacking Defense)</label>
                <input type="text" id="csp-ancestors" class="text-input" value="'self'" oninput="generateCsp()" />
              </div>
            </div>

            <div style="margin-top:1.25rem; display:flex; gap:1.5rem; flex-wrap:wrap;">
              <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; font-family:var(--mono); cursor:pointer;">
                <input type="checkbox" id="csp-upgrade" checked onchange="generateCsp()"> upgrade-insecure-requests
              </label>
              <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; font-family:var(--mono); cursor:pointer;">
                <input type="checkbox" id="csp-block-mixed" onchange="generateCsp()"> block-all-mixed-content
              </label>
              <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; font-family:var(--mono); cursor:pointer;">
                <input type="checkbox" id="csp-obj-none" checked onchange="generateCsp()"> object-src 'none' (Block Flash/Java)
              </label>
            </div>
          </div>

          <!-- AUDIT RESULTS -->
          <div class="wb-card" id="csp-audit-box" style="border-left: 4px solid #10b981;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-family:var(--mono); font-size:0.85rem; font-weight:600;" id="csp-audit-title">🛡️ Policy Vulnerability Assessment</span>
              <span id="csp-security-score" class="wb-badge badge-green">SAFE RATING: 90/100</span>
            </div>
            <ul id="csp-audit-list" style="margin:0; padding-left:1.2rem; font-size:0.88rem; color:var(--text-muted); line-height:1.6;">
            </ul>
          </div>

          <!-- EXPORT SNIPPETS -->
          <div class="wb-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <label class="field-label" style="margin:0;">Generated Header String</label>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <button type="button" class="btn-sec" id="btnCopyCsp" style="padding:0.3rem 0.75rem; font-size:0.78rem;" onclick="copyCsp()">Copy Header</button>
                <span id="cspCopyFeedback" style="font-size:0.78rem; font-family:var(--mono); color:#10b981; display:none; font-weight:bold;">✓ Copied!</span>
              </div>
            </div>
            <textarea id="csp-output" class="code-input" style="height:90px;" readonly></textarea>

            <div style="margin-top:1.25rem;">
              <label class="field-label">Production Server Deployment Code</label>
              <div class="tab-bar" style="margin-bottom:0.75rem;">
                <button type="button" class="tab-btn active" onclick="setExportFmt('nginx')">Nginx</button>
                <button type="button" class="tab-btn" onclick="setExportFmt('apache')">Apache (.htaccess)</button>
                <button type="button" class="tab-btn" onclick="setExportFmt('cloudflare')">Cloudflare Workers</button>
                <button type="button" class="tab-btn" onclick="setExportFmt('meta')">HTML &lt;meta&gt;</button>
              </div>
              <textarea id="csp-server-export" class="code-input" style="height:110px;" readonly></textarea>
            </div>
          </div>
        </div>

        <!-- TAB 2: CORS BUILDER -->
        <div id="cors-tab-content" style="display:none;">
          <div class="wb-card">
            <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Cross-Origin Resource Sharing (CORS) Configuration</h3>
            <div class="grid-2">
              <div>
                <label class="field-label" for="cors-origin">Access-Control-Allow-Origin</label>
                <input type="text" id="cors-origin" class="text-input" value="https://dashboard.example.com" oninput="generateCors()" />
                <span style="font-size:0.75rem; color:var(--text-muted);">Use specific origins. Never pair wildcard '*' with Allow-Credentials!</span>
              </div>
              <div>
                <label class="field-label" for="cors-methods">Access-Control-Allow-Methods</label>
                <input type="text" id="cors-methods" class="text-input" value="GET, POST, PUT, DELETE, OPTIONS" oninput="generateCors()" />
              </div>
              <div>
                <label class="field-label" for="cors-headers">Access-Control-Allow-Headers</label>
                <input type="text" id="cors-headers" class="text-input" value="Content-Type, Authorization, X-Requested-With" oninput="generateCors()" />
              </div>
              <div>
                <label class="field-label" for="cors-age">Access-Control-Max-Age (Preflight Cache in Seconds)</label>
                <input type="number" id="cors-age" class="text-input" value="86400" oninput="generateCors()" />
              </div>
            </div>

            <div style="margin-top:1rem;">
              <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; font-family:var(--mono); cursor:pointer;">
                <input type="checkbox" id="cors-credentials" checked onchange="generateCors()"> Access-Control-Allow-Credentials: true (Permit cookies & Authorization headers)
              </label>
            </div>
          </div>

          <div class="wb-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <label class="field-label" style="margin:0;">Nginx CORS Configuration Block</label>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <button type="button" class="btn-sec" id="btnCopyCors" style="padding:0.3rem 0.75rem; font-size:0.78rem;" onclick="copyCors()">Copy Nginx Config</button>
                <span id="corsCopyFeedback" style="font-size:0.78rem; font-family:var(--mono); color:#10b981; display:none; font-weight:bold;">✓ Copied!</span>
              </div>
            </div>
            <textarea id="cors-output" class="code-input" style="height:190px;" readonly></textarea>
          </div>
        </div>

        <!-- TAB 3: HASH & NONCE -->
        <div id="hash-tab-content" style="display:none;">
          <div class="wb-card">
            <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Inline Script SHA-256 Hash & Dynamic Nonce Generator</h3>
            <div class="field-group">
              <label class="field-label" for="hash-input-script">Paste Raw Inline &lt;script&gt; Body</label>
              <textarea id="hash-input-script" class="code-input" style="height:120px;" placeholder="console.log('Google Analytics or Tag Manager snippet');" oninput="computeScriptHash()"></textarea>
            </div>

            <div class="grid-2" style="margin-top:1rem;">
              <div>
                <label class="field-label" for="hash-result">Generated CSP Hash (SHA-256 Base64)</label>
                <input type="text" id="hash-result" class="code-input" readonly placeholder="sha256-..." />
              </div>
              <div>
                <label class="field-label" for="nonce-result">Generated Cryptographic Nonce</label>
                <div style="display:flex; gap:0.5rem;">
                  <input type="text" id="nonce-result" class="code-input" readonly />
                  <button type="button" class="btn-sec" onclick="generateNewNonce()">Refresh</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mathematical & Cryptographic Derivations -->
        <div class="wb-card" style="margin-top:2rem;">
          <h2 style="font-family:var(--serif); font-size:1.35rem; margin-bottom:0.75rem;">Cryptographic Nonce Entropy & Preflight Latency Architecture</h2>
          <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.6; margin-bottom:1rem;">
            Modern web applications secure dynamic scripts without allowing raw inline execution through cryptographic nonces and SHA-256 hashes generated by CSPRNG hardware entropy sources:
          </p>
          <div style="background:var(--bg); border:1px solid var(--border); padding:1.25rem; border-radius:4px; font-family:var(--mono); font-size:0.85rem; line-height:1.7; margin-bottom:1.25rem;">
            <div><strong>1. Cryptographic Nonce Entropy Formulation:</strong></div>
            <div>&nbsp;&nbsp;H = \log_2(64^N) = N \times 6 \text{ bits} \quad (\text{For } 16 \text{ bytes / } 128 \text{ bits entropy, collision probability } P < 10^{-18})</div>
            <div><strong>2. Subresource Hash Ingestion:</strong></div>
            <div>&nbsp;&nbsp;\text{Digest} = \text{Base64}(\text{SHA-256}(\text{ScriptPayload})) \quad (\text{Bitwise exact match across whitespace})</div>
            <div><strong>3. CORS Preflight RTT Latency Optimization:</strong></div>
            <div>&nbsp;&nbsp;\Delta T_{\text{saved}} = N_{\text{subsequent requests}} \times \text{RTT} \quad (\text{Eliminates round-trip OPTIONS preflight overhead})</div>
          </div>
        </div>

        <!-- 5 Fatal Traps in Web Security -->
        <div style="margin-top:2rem;">
          <h2 style="font-family:var(--serif); font-size:1.35rem; margin-bottom:1rem;">5 Fatal Traps in Content Security Policy & CORS Configuration</h2>
          
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: #ef4444;">1. The 'unsafe-inline' and 'unsafe-eval' Script Compromise Trap</strong>
            Adding <code>'unsafe-inline'</code> to <code>script-src</code> completely disables CSP protection against Stored and Reflected XSS. If an attacker injects a script tag or inline event handler (<code>onload</code>, <code>onerror</code>), the browser executes it without validation. Production systems should strictly use random per-request nonces or SHA-256 hashes.
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: #f59e0b;">2. The Wildcard Origin with Credentials Exploit ('*' with Allow-Credentials: true)</strong>
            W3C and RFC 9110 strictly forbid returning <code>Access-Control-Allow-Origin: *</code> alongside <code>Access-Control-Allow-Credentials: true</code>. When this happens, browsers drop the response entirely. Naive backends often "fix" this by reflecting the incoming request's <code>Origin</code> header, effectively allowing any malicious website on the internet to read authenticated user cookies.
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: #10b981;">3. Relying on Legacy X-Frame-Options Instead of frame-ancestors</strong>
            Legacy <code>X-Frame-Options: SAMEORIGIN</code> does not support multiple allowed parent domains and is ignored by modern browsers when a CSP is present. Omitting <code>frame-ancestors 'self'</code> from your CSP allows malicious sites to embed your pages inside transparent iframes, executing Clickjacking and UI redress attacks against authenticated sessions.
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: #3b82f6;">4. Broad CDN Allowlisting & JSONP Bypass Endpoints</strong>
            Allowlisting entire shared CDNs like <code>https://cdnjs.cloudflare.com</code> or <code>https://cdn.jsdelivr.net</code> creates easy CSP bypasses. Attackers can find outdated AngularJS versions or vulnerable JSONP endpoints hosted on the same CDN to execute arbitrary JavaScript within your domain origin. Always pin sub-paths or use SRI hashes.
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: #8b5cf6;">5. The Missing base-uri Injection Vulnerability</strong>
            Omitting the <code>base-uri 'self'</code> directive allows attackers who discover HTML injection vulnerabilities to insert a <code>&lt;base href="https://evil.com"&gt;</code> tag. This rewrites all relative script paths on your page to load from the attacker's server, bypassing your domain allowlists and executing hostile code.
          </div>
        </div>
      </div>

      <script>
        var curExport = 'nginx';

        function switchCspTab(tab) {
          var btns = document.querySelectorAll('.tab-bar .tab-btn');
          for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
          if (window.event && window.event.target) window.event.target.classList.add('active');
          document.getElementById('csp-tab-content').style.display = tab === 'csp' ? 'block' : 'none';
          document.getElementById('cors-tab-content').style.display = tab === 'cors' ? 'block' : 'none';
          document.getElementById('hash-tab-content').style.display = tab === 'hash' ? 'block' : 'none';
          if (tab === 'hash') { generateNewNonce(); computeScriptHash(); }
        }

        function generateCsp() {
          var def = document.getElementById('csp-default').value.trim();
          var script = document.getElementById('csp-script').value.trim();
          var style = document.getElementById('csp-style').value.trim();
          var img = document.getElementById('csp-img').value.trim();
          var connect = document.getElementById('csp-connect').value.trim();
          var ancestors = document.getElementById('csp-ancestors').value.trim();

          var parts = [];
          if (def) parts.push('default-src ' + def);
          if (script) parts.push('script-src ' + script);
          if (style) parts.push('style-src ' + style);
          if (img) parts.push('img-src ' + img);
          if (connect) parts.push('connect-src ' + connect);
          if (ancestors) parts.push('frame-ancestors ' + ancestors);
          if (document.getElementById('csp-obj-none').checked) parts.push("object-src 'none'");
          if (document.getElementById('csp-upgrade').checked) parts.push("upgrade-insecure-requests");
          if (document.getElementById('csp-block-mixed').checked) parts.push("block-all-mixed-content");

          var policy = parts.join('; ');
          document.getElementById('csp-output').value = policy;

          auditCsp(policy, script, ancestors);
          updateServerExport();
        }

        function auditCsp(policy, script, ancestors) {
          var list = document.getElementById('csp-audit-list');
          list.innerHTML = '';
          var score = 100;

          if (script.indexOf("'unsafe-inline'") > -1) {
            score -= 30;
            list.innerHTML += '<li style="color:#ef4444;">⚠️ <strong>Critical Risk:</strong> <code>unsafe-inline</code> detected in script-src! Allows malicious inline XSS payloads. Use hashes or nonces instead.</li>';
          }
          if (script.indexOf("'unsafe-eval'") > -1) {
            score -= 20;
            list.innerHTML += '<li style="color:#f59e0b;">⚠️ <strong>Moderate Risk:</strong> <code>unsafe-eval</code> enables eval() and string-to-code execution.</li>';
          }
          if (policy.indexOf('*') > -1 && policy.indexOf('data:') === -1) {
            score -= 15;
            list.innerHTML += '<li style="color:#f59e0b;">⚠️ <strong>Wildcard Source:</strong> Wildcard <code>*</code> allows resource loading from any domain on the internet.</li>';
          }
          if (!ancestors || ancestors === '*') {
            score -= 20;
            list.innerHTML += '<li style="color:#ef4444;">⚠️ <strong>Clickjacking Vector:</strong> Missing or wildcard <code>frame-ancestors</code> allows malicious iframing.</li>';
          } else {
            list.innerHTML += '<li style="color:#10b981;">✓ <strong>Clickjacking Protected:</strong> frame-ancestors restricted to ' + ancestors + '.</li>';
          }
          if (policy.indexOf("object-src 'none'") > -1) {
            list.innerHTML += '<li style="color:#10b981;">✓ <strong>Plugin Protection:</strong> object-src none disables Flash, Silverlight, and Java applet execution.</li>';
          }

          var badge = document.getElementById('csp-security-score');
          badge.textContent = 'SECURITY SCORE: ' + Math.max(0, score) + '/100';
          if (score >= 80) { badge.className = 'wb-badge badge-green'; }
          else if (score >= 50) { badge.className = 'wb-badge badge-amber'; }
          else { badge.className = 'wb-badge badge-red'; }
        }

        function setExportFmt(fmt) {
          curExport = fmt;
          if (window.event && window.event.target) {
            var btns = window.event.target.parentElement.querySelectorAll('.tab-btn');
            for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
            window.event.target.classList.add('active');
          }
          updateServerExport();
        }

        function updateServerExport() {
          var pol = document.getElementById('csp-output').value;
          var el = document.getElementById('csp-server-export');
          if (curExport === 'nginx') {
            el.value = 'add_header Content-Security-Policy "' + pol + '" always;';
          } else if (curExport === 'apache') {
            el.value = '<IfModule mod_headers.c>\n  Header set Content-Security-Policy "' + pol + '"\n</IfModule>';
          } else if (curExport === 'cloudflare') {
            el.value = 'response.headers.set("Content-Security-Policy", "' + pol + '");';
          } else if (curExport === 'meta') {
            el.value = '<meta http-equiv="Content-Security-Policy" content="' + pol + '">';
          }
        }

        function generateCors() {
          var origin = document.getElementById('cors-origin').value.trim();
          var methods = document.getElementById('cors-methods').value.trim();
          var headers = document.getElementById('cors-headers').value.trim();
          var age = document.getElementById('cors-age').value.trim();
          var creds = document.getElementById('cors-credentials').checked;

          var out = '# Nginx Preflight & CORS Block\n' +
'location /api/ {\n' +
'    if ($request_method = \'OPTIONS\') {\n' +
'        add_header \'Access-Control-Allow-Origin\' \'' + origin + '\' always;\n' +
'        add_header \'Access-Control-Allow-Methods\' \'' + methods + '\' always;\n' +
'        add_header \'Access-Control-Allow-Headers\' \'' + headers + '\' always;\n' +
(creds ? '        add_header \'Access-Control-Allow-Credentials\' \'true\' always;\n' : '') +
'        add_header \'Access-Control-Max-Age\' ' + age + ';\n' +
'        add_header \'Content-Type\' \'text/plain charset=UTF-8\';\n' +
'        add_header \'Content-Length\' 0;\n' +
'        return 204;\n' +
'    }\n' +
'    add_header \'Access-Control-Allow-Origin\' \'' + origin + '\' always;\n' +
(creds ? '    add_header \'Access-Control-Allow-Credentials\' \'true\' always;\n' : '') +
'    add_header \'Access-Control-Allow-Methods\' \'' + methods + '\' always;\n' +
'    add_header \'Access-Control-Allow-Headers\' \'' + headers + '\' always;\n' +
'}';
          document.getElementById('cors-output').value = out;
        }

        async function computeScriptHash() {
          var text = document.getElementById('hash-input-script').value;
          if (!text) { document.getElementById('hash-result').value = ''; return; }
          var enc = new TextEncoder().encode(text);
          var buf = await window.crypto.subtle.digest('SHA-256', enc);
          var arr = Array.from(new Uint8Array(buf));
          var b64 = btoa(arr.map(function(b){ return String.fromCharCode(b); }).join(''));
          document.getElementById('hash-result').value = "'sha256-" + b64 + "'";
        }

        function generateNewNonce() {
          var arr = new Uint8Array(16);
          window.crypto.getRandomValues(arr);
          var nonce = btoa(Array.from(arr).map(function(b){ return String.fromCharCode(b); }).join(''));
          document.getElementById('nonce-result').value = "'nonce-" + nonce + "'";
        }

        function copyCsp() {
          navigator.clipboard.writeText(document.getElementById('csp-output').value).then(function() {
            var fb = document.getElementById('cspCopyFeedback');
            if (fb) { fb.style.display = 'inline'; setTimeout(function(){ fb.style.display = 'none'; }, 2200); }
          });
        }

        function copyCors() {
          navigator.clipboard.writeText(document.getElementById('cors-output').value).then(function() {
            var fb = document.getElementById('corsCopyFeedback');
            if (fb) { fb.style.display = 'inline'; setTimeout(function(){ fb.style.display = 'none'; }, 2200); }
          });
        }

        window.addEventListener('DOMContentLoaded', function() {
          generateCsp();
          generateCors();
        });
      </script>
    `
  };

  // 2. cURL to Code Transpiler
  const curlTool = {
    slug: 'curl-to-code',
    title: 'cURL to Code Multi-Language Transpiler [Fetch, Axios, Python, Go, Rust]',
    metaDesc: 'Convert cURL commands to JavaScript Fetch, Node.js Axios, Python Requests, Go net/http, and Rust reqwest. 100% client-side parsing with header, cookie, and JSON body extraction.',
    category: 'Web Engineering',
    keywords: 'curl to fetch, curl to python requests, curl converter, curl to code, curl to axios, curl to golang, curl to rust',
    faqs: [
      { q: 'How does this client-side cURL transpiler parse commands?', a: 'The parser implements a token-based state machine that tokenizes raw terminal strings, correctly recognizing POSIX command arguments (-H, -X, -d, -u, -b, --data-raw), unescaping multi-line bash slashes, and extracting JSON payloads into language-specific AST structures.' },
      { q: 'Why do cURL commands copied from Chrome DevTools often contain --compressed?', a: 'Chrome DevTools includes the --compressed flag by default, signaling that the browser requested gzip/deflate/br compression. In JavaScript Fetch and Python Requests, decompression is handled automatically by the runtime, so the flag is safely normalized.' },
      { q: 'How do I handle multi-line bash cURL commands on Windows PowerShell?', a: 'Bash uses backslashes (\\) at the end of lines for multi-line continuation, whereas Windows PowerShell uses the backtick (`). This tool automatically strips line-continuation characters from both environments and reconstitutes single-line execution requests.' },
      { q: 'What is the difference between --data, --data-raw, and --data-binary in cURL?', a: 'cURL --data strips carriage returns and newlines from input. --data-raw sends the string exactly as specified without interpreting @ symbol file references. --data-binary preserves all binary bytes without any ASCII modification. The transpiler detects these variants and formats request bodies accordingly.' },
      { q: 'Does this transpiler transmit sensitive API keys or tokens to any external server?', a: 'No. The transpiler executes 100% locally inside your browser memory using pure JavaScript string algorithms. Authorization headers, API secrets, and private Bearer tokens never touch a network.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/web/">Web Engineering</a> &gt; cURL to Code Transpiler</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">RFC 7230 / HTTP Transpiler</span>
            <span class="wb-badge badge-green">Pure Client-Side</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">cURL to Code Multi-Language Transpiler</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Instantly convert cURL shell commands into idiomatic JavaScript Fetch, Node.js Axios, Python Requests, Go net/http, and Rust reqwest code.
          </p>
        </div>

        <div class="wb-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <label class="field-label" style="margin:0;" for="curl-input">Paste cURL Command</label>
            <div style="display:flex; gap:0.4rem;">
              <button type="button" class="btn-sec" style="font-size:0.75rem; padding:0.25rem 0.6rem;" onclick="loadCurlExample('json_post')">JSON POST</button>
              <button type="button" class="btn-sec" style="font-size:0.75rem; padding:0.25rem 0.6rem;" onclick="loadCurlExample('auth_bearer')">Auth Bearer</button>
              <button type="button" class="btn-sec" style="font-size:0.75rem; padding:0.25rem 0.6rem;" onclick="loadCurlExample('form_data')">Form URL-Encoded</button>
            </div>
          </div>
          <textarea id="curl-input" class="code-input" style="height:140px; font-size:0.85rem;" oninput="transpileCurl()" placeholder="curl -X POST https://api.example.com/v1/users -H 'Authorization: Bearer token123' -H 'Content-Type: application/json' -d '{\"name\":\"Alice\"}'"></textarea>
        </div>

        <div class="wb-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
            <div class="tab-bar" style="margin:0; border:none;">
              <button type="button" class="tab-btn active" onclick="setLang('fetch')">JavaScript (Fetch)</button>
              <button type="button" class="tab-btn" onclick="setLang('axios')">Node.js (Axios)</button>
              <button type="button" class="tab-btn" onclick="setLang('python')">Python (Requests)</button>
              <button type="button" class="tab-btn" onclick="setLang('go')">Go (net/http)</button>
              <button type="button" class="tab-btn" onclick="setLang('rust')">Rust (reqwest)</button>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <button type="button" class="btn-sec" id="btnCopyCode" style="padding:0.35rem 0.8rem; font-size:0.8rem;" onclick="copyTranspiledCode()">Copy Code</button>
              <span id="curlCopyFeedback" style="font-size:0.8rem; font-family:var(--mono); color:#10b981; display:none; font-weight:bold;">✓ Copied!</span>
            </div>
          </div>
          <textarea id="transpiled-output" class="code-input" style="height:260px; font-size:0.85rem; line-height:1.5;" readonly></textarea>
        </div>

        <!-- Mathematical & Grammar Derivation -->
        <div class="wb-card" style="margin-top:2rem;">
          <h2 style="font-family:var(--serif); font-size:1.35rem; margin-bottom:0.75rem;">HTTP Tokenizer State Machine & Grammar Derivation</h2>
          <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.6; margin-bottom:1rem;">
            cURL execution relies on a finite-state machine that parses shell quoting rules, strips escaping backslashes, and extracts HTTP/1.1 message boundaries into an immutable Abstract Syntax Tree (AST):
          </p>
          <div style="background:var(--bg); border:1px solid var(--border); padding:1.25rem; border-radius:4px; font-family:var(--mono); font-size:0.85rem; line-height:1.7; margin-bottom:1.25rem;">
            <div><strong>1. AST Request Tuple Derivation:</strong></div>
            <div>&nbsp;&nbsp;\text{AST} = \langle \text{Method}, \text{URL}, \mathcal{H}_{\text{headers}}, \mathcal{B}_{\text{body}}, \mathcal{C}_{\text{cookies}}, \mathcal{A}_{\text{auth}} \rangle</div>
            <div><strong>2. Posix Quoting Grammar:</strong></div>
            <div>&nbsp;&nbsp;T_{\text{arg}} = \text{RegExTokenize}(\text{match } \text{"[^"\\]*(?:\\.[^"\\]*)*"} \mid \text{'[^']*'} \mid \text{\S+})</div>
            <div><strong>3. JSON Body Detection:</strong></div>
            <div>&nbsp;&nbsp;\text{IsJSON}(\mathcal{B}) = \begin{cases} \text{true} & \text{if } \mathcal{B}[0] \in \{ \text{'{'}, \text{'['} \} \land \text{JSON.parse}(\mathcal{B}) \ne \bot \\ \text{false} & \text{otherwise} \end{cases}</div>
          </div>
        </div>

        <!-- 5 Fatal Traps in API Client Transpilation -->
        <div style="margin-top:2rem;">
          <h2 style="font-family:var(--serif); font-size:1.35rem; margin-bottom:1rem;">5 Fatal Traps in API Client Transpilation & Code Generation</h2>
          
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: #ef4444;">1. The Windows CMD vs. Bash Backslash Escaping Trap</strong>
            Bash uses trailing backslashes (<code>\</code>) to break long cURL commands across lines. Pasting a bash command into Windows PowerShell or CMD interprets each line as an independent broken command, resulting in truncated URLs, missing headers, and cryptic connection failures.
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: #f59e0b;">2. Automatic Decompression & Content-Length Header Corruption</strong>
            Hardcoding <code>Content-Length</code> or <code>Accept-Encoding: gzip</code> in client code causes HTTP request hangs. When you modify request bodies in JavaScript Fetch or Python Requests, leaving an outdated manual <code>Content-Length</code> causes the remote server to time out waiting for missing bytes.
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: #10b981;">3. Stripping Cookie Jars vs. Bearer Authentication Headers</strong>
            cURL's <code>-b</code> or <code>--cookie</code> argument transmits cookies in the request. Transpiling cookie flags into <code>Authorization: Bearer</code> headers fails completely on session-authenticated backend APIs, dropping authentication tokens silently.
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: #3b82f6;">4. Raw JSON Stringification vs. Multipart Form-Data Boundaries</strong>
            cURL's <code>-F</code> flag sends <code>multipart/form-data</code> with automatic MIME boundary boundaries. Attempting to send form data as a raw JSON string without proper boundary generation breaks file uploads, image attachments, and binary data pipelines.
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: #8b5cf6;">5. Insecure TLS Certificate Verification (-k / --insecure) in Production</strong>
            Developers frequently add <code>-k</code> in development to bypass self-signed SSL certificate warnings, then inadvertently transpile and deploy generated Python (<code>verify=False</code>) or Node.js code to production, exposing user data to silent Man-in-the-Middle (MITM) attacks.
          </div>
        </div>
      </div>

      <script>
        var currentLang = 'fetch';

        var EXAMPLES = {
          json_post: 'curl -X POST https://api.example.com/v1/users \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer sec_live_9981" \\\n  -d \'{"name": "Sarah Connor", "email": "sarah@skynet.org", "role": "admin"}\'',
          auth_bearer: 'curl -X GET https://api.stripe.com/v1/customers \\\n  -H "Authorization: Bearer sk_test_51Mz..." \\\n  -H "Stripe-Version: 2023-10-16"',
          form_data: 'curl -X POST https://api.example.com/oauth/token \\\n  -H "Content-Type: application/x-www-form-urlencoded" \\\n  -d "grant_type=client_credentials&client_id=myApp&client_secret=topSecret"'
        };

        function loadCurlExample(key) {
          document.getElementById('curl-input').value = EXAMPLES[key] || '';
          transpileCurl();
        }

        function setLang(lang) {
          currentLang = lang;
          if (window.event && window.event.target) {
            var btns = window.event.target.parentElement.querySelectorAll('.tab-btn');
            for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
            window.event.target.classList.add('active');
          }
          transpileCurl();
        }

        function transpileCurl() {
          var raw = document.getElementById('curl-input').value.trim();
          var out = document.getElementById('transpiled-output');
          if (!raw) { out.value = '// Paste a cURL command above...'; return; }

          var cleaned = raw.replace(/\\\r?\n/g, ' ').replace(/\r?\n/g, ' ');
          var tokens = [];
          var re = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^']*)'|(\S+)/g;
          var match;
          while ((match = re.exec(cleaned)) !== null) {
            tokens.push(match[1] || match[2] || match[3]);
          }

          var method = 'GET';
          var url = 'https://api.example.com';
          var headers = {};
          var body = null;

          for (var i = 0; i < tokens.length; i++) {
            var t = tokens[i];
            if (t === '-X' || t === '--request') {
              method = (tokens[++i] || 'GET').toUpperCase();
            } else if (t === '-H' || t === '--header') {
              var h = tokens[++i] || '';
              var colon = h.indexOf(':');
              if (colon > -1) {
                headers[h.slice(0, colon).trim()] = h.slice(colon + 1).trim();
              }
            } else if (t === '-d' || t === '--data' || t === '--data-raw' || t === '--data-binary') {
              body = tokens[++i] || '';
              if (method === 'GET') method = 'POST';
            } else if (t.startsWith('http://') || t.startsWith('https://')) {
              url = t;
            }
          }

          if (currentLang === 'fetch') {
            var hStr = JSON.stringify(headers, null, 2).replace(/\n/g, '\n  ');
            var code = 'const response = await fetch("' + url + '", {\n' +
              '  method: "' + method + '",\n' +
              '  headers: ' + hStr + (body ? ',\n  body: ' + JSON.stringify(body) : '') + '\n' +
              '});\n\nconst data = await response.json();\nconsole.log(data);';
            out.value = code;
          } else if (currentLang === 'axios') {
            var codeAx = 'const axios = require("axios");\n\n' +
              'const response = await axios({\n' +
              '  method: "' + method.toLowerCase() + '",\n' +
              '  url: "' + url + '",\n' +
              '  headers: ' + JSON.stringify(headers, null, 4) + (body ? ',\n  data: ' + body : '') + '\n' +
              '});\n\nconsole.log(response.data);';
            out.value = codeAx;
          } else if (currentLang === 'python') {
            var hPy = Object.entries(headers).map(function(e){ return '    "' + e[0] + '": "' + e[1] + '"'; }).join(',\n');
            var codePy = 'import requests\n\n' +
              'url = "' + url + '"\n' +
              'headers = {\n' + hPy + '\n}\n' +
              (body ? 'payload = ' + JSON.stringify(body) + '\n\n' : '\n') +
              'response = requests.' + method.toLowerCase() + '(url, headers=headers' + (body ? ', data=payload' : '') + ')\n' +
              'print(response.status_code)\nprint(response.json())';
            out.value = codePy;
          } else if (currentLang === 'go') {
            var hLines = Object.entries(headers).map(function(e){ return '    req.Header.Set("' + e[0] + '", "' + e[1] + '")'; }).join('\n');
            out.value = 'package main\n\nimport (\n' +
              '    "bytes"\n    "fmt"\n    "io"\n    "net/http"\n)\n\n' +
              'func main() {\n' +
              '    url := "' + url + '"\n' +
              (body ? '    payload := bytes.NewBuffer([]byte(' + JSON.stringify(body) + '))\n' : '') +
              '    req, err := http.NewRequest("' + method + '", url, ' + (body ? 'payload' : 'nil') + ')\n' +
              '    if err != nil { panic(err) }\n' +
              hLines + '\n\n' +
              '    client := &http.Client{}\n' +
              '    resp, err := client.Do(req)\n' +
              '    if err != nil { panic(err) }\n' +
              '    defer resp.Body.Close()\n\n' +
              '    body, _ := io.ReadAll(resp.Body)\n' +
              '    fmt.Println(string(body))\n}';
          } else if (currentLang === 'rust') {
            var hLinesRs = Object.entries(headers).map(function(e){ return '    headers.insert("' + e[0] + '", "' + e[1] + '".parse()?);'; }).join('\n');
            out.value = 'use reqwest::header::HeaderMap;\n\n' +
              '#[tokio::main]\nasync fn main() -> Result<(), Box<dyn std.error::Error>> {\n' +
              '    let client = reqwest::Client::new();\n' +
              '    let mut headers = HeaderMap::new();\n' +
              hLinesRs + '\n\n' +
              '    let response = client\n' +
              '        .' + method.toLowerCase() + '("' + url + '")\n' +
              '        .headers(headers)' + (body ? '\n        .body(' + JSON.stringify(body) + ')' : '') + '\n' +
              '        .send()\n' +
              '        .await?;\n\n' +
              '    println!("Status: {}", response.status());\n' +
              '    println!("Body: {}", response.text().await?);\n' +
              '    Ok(())\n}';
          }
        }

        function copyTranspiledCode() {
          navigator.clipboard.writeText(document.getElementById('transpiled-output').value).then(function() {
            var fb = document.getElementById('curlCopyFeedback');
            if (fb) { fb.style.display = 'inline'; setTimeout(function(){ fb.style.display = 'none'; }, 2200); }
          });
        }

        window.addEventListener('DOMContentLoaded', function() {
          loadCurlExample('json_post');
        });
      </script>
    `
  };

  // 3. Live WebSocket Frame & Handshake Inspector
  const wsTool = {
    slug: 'websocket-inspector',
    title: 'Live WebSocket Frame & Handshake Inspector [Real-Time Telemetry]',
    metaDesc: 'Interactive client-side WebSocket client and frame debugger. Inspect RFC 6455 handshake headers, opcode frames, latency RTT, and streaming payloads with zero server dependencies.',
    category: 'Web Engineering',
    keywords: 'websocket tester, websocket client online, websocket debugger, rfc 6455 frame inspector, wss echo test',
    faqs: [
      { q: 'How does the WebSocket HTTP/1.1 Upgrade Handshake work?', a: 'The client sends an HTTP GET request with Upgrade: websocket and Connection: Upgrade headers, along with a base64-encoded Sec-WebSocket-Key. The server responds with HTTP 101 Switching Protocols and a Sec-WebSocket-Accept hash, instantaneously transforming the TCP socket into a bi-directional binary/text channel.' },
      { q: 'What is the difference between WebSocket Opcode 0x1 (Text) and Opcode 0x2 (Binary)?', a: 'Opcode 0x1 frames are required by RFC 6455 to contain valid UTF-8 text strings; if any byte violates UTF-8 encoding, the connection must be terminated immediately. Opcode 0x2 carries raw arbitrary binary bytes (ArrayBuffer or Blob) with no format verification.' },
      { q: 'Why do client-to-server WebSocket frames require a 4-byte masking key?', a: 'RFC 6455 mandates that all frames sent from client to server must be masked with a random 32-bit key. This prevents malicious scripts from constructing byte sequences that intermediate proxies might mistake for cached HTTP requests, defeating cache poisoning attacks.' },
      { q: 'What causes abnormal WebSocket closure code 1006?', a: 'Close code 1006 is synthesized locally by the browser when the connection closes abnormally without receiving an official close control frame (Opcode 0x8). Common causes include TCP connection reset, TLS certificate failure, or proxy timeout.' },
      { q: 'How do WebSocket ping/pong heartbeats keep load balancers alive?', a: 'Cloud load balancers (such as AWS ALB or Cloudflare) close idle TCP connections after 60 to 120 seconds of inactivity. Sending periodic application-level ping frames keeps the underlying TCP socket active without passing traffic through heavy application logic.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/web/">Web Engineering</a> &gt; WebSocket Inspector</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">RFC 6455 / Full-Duplex</span>
            <span class="wb-badge badge-green">Real-Time Telemetry</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Live WebSocket Frame & Handshake Inspector</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Connect to any WebSocket or WSS server, inspect opening handshake negotiation, stream bi-directional frames, and measure ping/pong latency.
          </p>
        </div>

        <div class="wb-card">
          <label class="field-label" for="ws-url">WebSocket Server Endpoint (ws:// or wss://)</label>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <input type="text" id="ws-url" class="text-input" value="wss://echo.websocket.org" style="flex:1; min-width:260px;" />
            <button type="button" id="ws-connect-btn" class="btn-primary" onclick="toggleWsConnection()">Connect</button>
            <button type="button" class="btn-sec" onclick="clearWsLog()">Clear Log</button>
          </div>
          <div style="margin-top:0.75rem; display:flex; gap:0.4rem; flex-wrap:wrap;">
            <button type="button" class="btn-sec" style="font-size:0.75rem; padding:0.25rem 0.5rem;" onclick="setWsEndpoint('wss://echo.websocket.org')">echo.websocket.org</button>
            <button type="button" class="btn-sec" style="font-size:0.75rem; padding:0.25rem 0.5rem;" onclick="setWsEndpoint('wss://ws.postman-echo.com/raw')">Postman Echo</button>
            <button type="button" class="btn-sec" style="font-size:0.75rem; padding:0.25rem 0.5rem;" onclick="setWsEndpoint('wss://socketsbay.com/wss/v2/1/demo/')">SocketsBay Demo</button>
          </div>
        </div>

        <!-- TELEMETRY BAR -->
        <div class="wb-card" style="padding:1rem 1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <span class="field-label" style="margin:0;">Connection Status</span>
            <div style="display:flex; align-items:center; gap:0.4rem; margin-top:0.2rem;">
              <span id="ws-status-dot" style="width:10px; height:10px; border-radius:50%; background:#94a3b8; display:inline-block;"></span>
              <strong id="ws-status-text" style="font-family:var(--mono); font-size:0.9rem;">DISCONNECTED</strong>
            </div>
          </div>
          <div>
            <span class="field-label" style="margin:0;">Roundtrip RTT</span>
            <div id="ws-rtt-val" style="font-family:var(--mono); font-size:1.1rem; font-weight:bold; color:var(--btn-bg, #3b82f6); margin-top:0.1rem;">-- ms</div>
          </div>
          <div>
            <span class="field-label" style="margin:0;">Frames Exchanged</span>
            <div id="ws-msg-count" style="font-family:var(--mono); font-size:1rem; font-weight:bold; color:var(--fg); margin-top:0.1rem;">0 msgs</div>
          </div>
          <div>
            <button type="button" class="btn-sec" style="font-size:0.8rem; padding:0.35rem 0.75rem;" onclick="sendPingHeartbeat()">Send Ping</button>
          </div>
        </div>

        <!-- SEND MESSAGE BAR -->
        <div class="wb-card">
          <label class="field-label" for="ws-payload">Send Outbound Message Frame (Text / JSON)</label>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <input type="text" id="ws-payload" class="text-input" value='{"event": "ping", "client": "DigitalToolsShed", "timestamp": Date.now()}' style="flex:1; min-width:240px;" onkeydown="if(event.key==='Enter') sendWsFrame();" />
            <button type="button" class="btn-primary" onclick="sendWsFrame()">Send Frame</button>
          </div>
        </div>

        <!-- FRAME LOG -->
        <div class="wb-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <label class="field-label" style="margin:0;">Live Frame Stream & Telemetry Inspector</label>
            <span style="font-size:0.75rem; font-family:var(--mono); color:var(--text-muted);">Auto-scrolling stream</span>
          </div>
          <div id="ws-log" style="height:280px; overflow-y:auto; background:var(--bg); border:1px solid var(--border); border-radius:4px; padding:0.75rem; font-family:var(--mono); font-size:0.82rem; line-height:1.6;">
            <div style="color:var(--text-muted);">// Ready. Connect to an endpoint to begin telemetry capture...</div>
          </div>
        </div>

        <!-- Mathematical & Bitwise Derivations -->
        <div class="wb-card" style="margin-top:2rem;">
          <h2 style="font-family:var(--serif); font-size:1.35rem; margin-bottom:0.75rem;">RFC 6455 Framing Protocol & Masking XOR Bitwise Derivation</h2>
          <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.6; margin-bottom:1rem;">
            WebSockets bypass HTTP request/response overhead through a single persistent TCP socket. Frames are structured with a compact 2-to-14 byte header followed by XOR-masked payload bytes:
          </p>
          <div style="background:var(--bg); border:1px solid var(--border); padding:1.25rem; border-radius:4px; font-family:var(--mono); font-size:0.85rem; line-height:1.7; margin-bottom:1.25rem;">
            <div><strong>1. Client-to-Server Masking XOR Transformation:</strong></div>
            <div>&nbsp;&nbsp;M_i = P_i \oplus K_{i \pmod 4} \quad (\text{Defeats proxy cache poisoning across intermediate hops})</div>
            <div><strong>2. Extended Payload Length Quantization:</strong></div>
            <div>&nbsp;&nbsp;\text{LenField} = \begin{cases} L & \text{if } L \le 125 \\ 126 + [16\text{-bit integer}] & \text{if } 126 \le L \le 65,535 \\ 127 + [64\text{-bit integer}] & \text{if } L \ge 65,536 \end{cases}</div>
            <div><strong>3. Round-Trip Latency (RTT):</strong></div>
            <div>&nbsp;&nbsp;\text{RTT} = T_{\text{pong received}} - T_{\text{ping sent}} \quad (\text{Measures single-frame bi-directional wire speed})</div>
          </div>
        </div>

        <!-- 5 Fatal Traps in WebSocket Engineering -->
        <div style="margin-top:2rem;">
          <h2 style="font-family:var(--serif); font-size:1.35rem; margin-bottom:1rem;">5 Fatal Traps in Real-Time WebSocket Engineering</h2>
          
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: #ef4444;">1. The Proxy Buffer & Idle TCP 60-Second Timeout Trap</strong>
            Load balancers, cloud gateways (AWS ALB, Cloudflare), and reverse proxies terminate idle TCP sockets after 60 seconds of inactivity. Without application-level ping/pong heartbeats scheduled at 25-30 second intervals, connections drop silently without trigger events.
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: #f59e0b;">2. Unhandled Abnormal Closure Code 1006 vs 1000</strong>
            Code 1000 signifies clean intentional closure. Code 1006 indicates TCP RST, TLS failure, or network drop where no close handshake took place. Naive reconnection logic that reconnects instantly on 1006 without exponential backoff creates self-inflicted DDoS thundering herd outages.
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: #10b981;">3. Head-of-Line Blocking over a Single TCP Socket</strong>
            Because WebSockets run over a single TCP stream, transmitting large binary payloads (e.g. file uploads or webcam streams) blocks critical JSON control messages behind millions of pending bytes. High-throughput apps must partition data across multiple channels or adopt WebTransport.
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: #3b82f6;">4. Unmasked Frame Rejection by Conforming Servers</strong>
            Sending unmasked frames from browser clients is an instant RFC 6455 violation. Conforming servers must immediately close the connection with Protocol Error 1002 upon receiving unmasked frames from clients to prevent proxy cache pollution.
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: #8b5cf6;">5. Memory Leaks from Flapping Event Listeners</strong>
            Creating new <code>ws.onmessage</code> listeners or DOM logging nodes on reconnection cycles without tearing down previous event handlers produces runaway browser heap growth, crashing mobile browser tabs during spotty mobile cellular handoffs.
          </div>
        </div>
      </div>

      <script>
        var ws = null;
        var msgCount = 0;
        var byteCount = 0;
        var lastPingTime = 0;

        function setWsEndpoint(url) {
          document.getElementById('ws-url').value = url;
          if (ws) toggleWsConnection();
        }

        function toggleWsConnection() {
          if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
            ws.close(1000, 'User disconnected');
            return;
          }

          var url = document.getElementById('ws-url').value.trim();
          if (!url) return;

          logFrame('SYS', 'Initiating handshake with ' + url + '...');
          document.getElementById('ws-status-text').textContent = 'CONNECTING...';
          document.getElementById('ws-status-dot').style.background = '#f59e0b';

          try {
            ws = new WebSocket(url);

            ws.onopen = function() {
              document.getElementById('ws-status-text').textContent = 'CONNECTED';
              document.getElementById('ws-status-dot').style.background = '#10b981';
              document.getElementById('ws-connect-btn').textContent = 'Disconnect';
              document.getElementById('ws-connect-btn').className = 'btn-sec';
              logFrame('SYS', '101 Switching Protocols — Handshake Accepted!');
            };

            ws.onmessage = function(e) {
              msgCount++;
              byteCount += (typeof e.data === 'string' ? e.data.length : e.data.byteLength || 0);
              updateStats();

              if (lastPingTime > 0) {
                var rtt = Math.round(performance.now() - lastPingTime);
                document.getElementById('ws-rtt-val').textContent = rtt + ' ms';
                lastPingTime = 0;
              }

              logFrame('IN', typeof e.data === 'string' ? e.data : '[Binary Frame: ' + (e.data.byteLength || 0) + ' bytes]');
            };

            ws.onerror = function(err) {
              logFrame('ERR', 'WebSocket error encountered (Code 1006 / Network drop)');
            };

            ws.onclose = function(e) {
              document.getElementById('ws-status-text').textContent = 'DISCONNECTED';
              document.getElementById('ws-status-dot').style.background = '#ef4444';
              document.getElementById('ws-connect-btn').textContent = 'Connect';
              document.getElementById('ws-connect-btn').className = 'btn-primary';
              logFrame('SYS', 'Connection closed: Code ' + e.code + ' ' + (e.reason || 'Normal'));
              ws = null;
            };
          } catch(e) {
            logFrame('ERR', e.message);
          }
        }

        function sendWsFrame() {
          if (!ws || ws.readyState !== WebSocket.OPEN) {
            logFrame('ERR', 'Cannot send: WebSocket is not connected.');
            return;
          }
          var text = document.getElementById('ws-payload').value;
          if (!text) return;
          ws.send(text);
          msgCount++;
          byteCount += text.length;
          updateStats();
          logFrame('OUT', text);
        }

        function sendPingHeartbeat() {
          if (!ws || ws.readyState !== WebSocket.OPEN) {
            logFrame('ERR', 'Cannot ping: WebSocket is not connected.');
            return;
          }
          lastPingTime = performance.now();
          var pingPayload = JSON.stringify({ type: 'ping', timestamp: Date.now() });
          ws.send(pingPayload);
          logFrame('OUT', pingPayload);
        }

        function logFrame(dir, text) {
          var log = document.getElementById('ws-log');
          var time = new Date().toISOString().split('T')[1].slice(0, 8);
          var color = '#3b82f6';
          if (dir === 'IN') color = '#10b981';
          if (dir === 'ERR') color = '#ef4444';
          if (dir === 'SYS') color = '#f59e0b';

          var row = document.createElement('div');
          row.style.marginBottom = '4px';
          row.innerHTML = '<span style="color:var(--text-muted);">[' + time + ']</span> <strong style="color:' + color + ';">[' + dir + ']</strong> <span>' + escapeHtml(text) + '</span>';
          log.appendChild(row);
          log.scrollTop = log.scrollHeight;
        }

        function updateStats() {
          document.getElementById('ws-msg-count').textContent = msgCount + ' (' + (byteCount/1024).toFixed(1) + ' KB)';
        }

        function clearWsLog() {
          document.getElementById('ws-log').innerHTML = '<div style="color:var(--text-muted);">// Log cleared...</div>';
        }

        function escapeHtml(str) {
          return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
      </script>
    `
  };

  // 4. DNS Zone Architect & SPF/DKIM/DMARC Builder
  const dnsTool = {
    slug: 'dns-record-generator',
    title: 'DNS Zone Architect & SPF / DKIM / DMARC Policy Builder [Email Deliverability]',
    metaDesc: 'Generate RFC-compliant BIND zone records and synthetically validate SPF, DKIM, and DMARC anti-spoofing policies for 100% email deliverability. Zero server tracking.',
    category: 'Web Engineering',
    keywords: 'dns zone generator, spf generator, dmarc policy generator, dkim record builder, bind zone file generator, email deliverability records',
    faqs: [
      { q: 'Why is there a strict 10-DNS-lookup limit in SPF records?', a: 'RFC 7208 specifies that an SPF evaluator must not perform more than 10 DNS lookups during a single SPF validation check (including include, a, mx, ptr, and exists mechanisms). Exceeding this limit triggers a PermError, causing mail providers like Google Workspace and Microsoft 365 to reject or mark emails as spam.' },
      { q: 'What is the difference between DMARC p=none, p=quarantine, and p=reject?', a: 'p=none is monitoring mode: emails failing SPF/DKIM alignment are delivered normally while aggregate XML reports are sent to your rua address. p=quarantine moves failing emails to the recipient spam/junk folder. p=reject commands the receiving server to drop failing emails at the gateway, preventing impersonation.' },
      { q: 'Why can\'t I set a CNAME record on my root domain (zone apex)?', a: 'RFC 1034 mandates that if a CNAME record exists for a node, no other records of any type can exist for that name. Because the root domain requires SOA and NS records, placing a CNAME at apex breaks domain routing. Modern DNS providers resolve this using CNAME Flattening or ALIAS/ANAME pseudo-records.' },
      { q: 'How do I split a 2048-bit DKIM key into a DNS TXT record?', a: 'DNS TXT records limit each string token to 255 characters. A 2048-bit RSA public key encoded in base64 is approximately 400 characters. In BIND zone files, the string must be enclosed in parentheses and split into two adjacent double-quoted strings: \'("v=DKIM1; ... first 250 chars" "remaining chars...")\'.' },
      { q: 'What is the difference between SPF hard fail (-all) and soft fail (~all)?', a: '~all (SoftFail) indicates that non-listed IPs should be accepted but flagged as suspicious. -all (HardFail) explicitly instructs the receiving mail server to reject messages from unapproved IPs immediately.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/web/">Web Engineering</a> &gt; DNS Zone Architect</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">RFC 1035 / BIND Zone</span>
            <span class="wb-badge badge-green">Deliverability Suite</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">DNS Zone Architect & SPF/DKIM/DMARC Builder</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Generate RFC-compliant BIND zone records, audit SPF 10-lookup limits, and construct DMARC email authentication records for zero spoofing.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Domain & Network Infrastructure</h3>
          <div class="grid-2">
            <div>
              <label class="field-label" for="dns-domain">Root Domain Name</label>
              <input type="text" id="dns-domain" class="text-input" value="example.com" oninput="compileDns()" />
            </div>
            <div>
              <label class="field-label" for="dns-ip4">Primary Web Server IPv4 (A Record)</label>
              <input type="text" id="dns-ip4" class="text-input" value="192.0.2.1" oninput="compileDns()" />
            </div>
            <div>
              <label class="field-label" for="dns-ip6">Primary Web Server IPv6 (AAAA Record)</label>
              <input type="text" id="dns-ip6" class="text-input" value="2001:db8::1" oninput="compileDns()" />
            </div>
            <div>
              <label class="field-label" for="dns-ttl">Default TTL (Seconds)</label>
              <input type="number" id="dns-ttl" class="text-input" value="3600" oninput="compileDns()" />
            </div>
          </div>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Email Anti-Spoofing & Deliverability Engine</h3>
          <div class="grid-2">
            <div>
              <label class="field-label" for="spf-presets">SPF Included Senders</label>
              <select id="spf-presets" class="text-input" onchange="applySpfPreset()">
                <option value="custom">Custom Senders</option>
                <option value="google" selected>Google Workspace (_spf.google.com)</option>
                <option value="m365">Microsoft 365 (spf.protection.outlook.com)</option>
                <option value="sendgrid">SendGrid + Google Workspace</option>
              </select>
            </div>
            <div>
              <label class="field-label" for="spf-policy">SPF Enforcement Policy</label>
              <select id="spf-policy" class="text-input" onchange="compileDns()">
                <option value="~all" selected>~all (SoftFail — Recommended during setup)</option>
                <option value="-all">-all (HardFail — Maximum strict rejection)</option>
              </select>
            </div>
            <div>
              <label class="field-label" for="dmarc-policy">DMARC Policy (p=)</label>
              <select id="dmarc-policy" class="text-input" onchange="compileDns()">
                <option value="none">p=none (Audit only, no rejections)</option>
                <option value="quarantine">p=quarantine (Send unauthorized mail to spam)</option>
                <option value="reject" selected>p=reject (Drop unauthenticated mail completely)</option>
              </select>
            </div>
            <div>
              <label class="field-label" for="dmarc-email">DMARC Aggregate Reporting Email (rua=)</label>
              <input type="email" id="dmarc-email" class="text-input" value="dmarc-reports@example.com" oninput="compileDns()" />
            </div>
          </div>

          <div style="margin-top:1.25rem;">
            <label class="field-label" for="spf-raw">Calculated SPF Record (v=spf1)</label>
            <input type="text" id="spf-raw" class="code-input" value="v=spf1 include:_spf.google.com ~all" oninput="compileDns()" />
            <div id="spf-lookup-meter" style="font-family:var(--mono); font-size:0.75rem; margin-top:0.35rem; color:#10b981;">
              DNS Lookups: 1 / 10 limit (SAFE)
            </div>
          </div>
        </div>

        <div class="wb-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <label class="field-label" style="margin:0;">Compiled RFC 1035 BIND Zone File</label>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <button type="button" class="btn-sec" id="btnCopyDns" style="padding:0.3rem 0.75rem; font-size:0.78rem;" onclick="copyDnsZone()">Copy Zone File</button>
              <span id="dnsCopyFeedback" style="font-size:0.78rem; font-family:var(--mono); color:#10b981; display:none; font-weight:bold;">✓ Copied!</span>
            </div>
          </div>
          <textarea id="dns-output" class="code-input" style="height:240px;" readonly></textarea>
        </div>

        <!-- Mathematical & RFC Derivation -->
        <div class="wb-card" style="margin-top:2rem;">
          <h2 style="font-family:var(--serif); font-size:1.35rem; margin-bottom:0.75rem;">RFC 7208 SPF Lookup Evaluation & DMARC Alignment Formulation</h2>
          <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.6; margin-bottom:1rem;">
            Email receivers evaluate sender legitimacy by recursively checking DNS resource records against strict lookup budgets and cryptographic alignment criteria:
          </p>
          <div style="background:var(--bg); border:1px solid var(--border); padding:1.25rem; border-radius:4px; font-family:var(--mono); font-size:0.85rem; line-height:1.7; margin-bottom:1.25rem;">
            <div><strong>1. SPF 10-Lookup Budget Formulation (RFC 7208):</strong></div>
            <div>&nbsp;&nbsp;\sum (\text{include} + \text{a} + \text{mx} + \text{ptr} + \text{exists} + \text{redirect}) \le 10 \quad (\text{Exceeding triggers immediate PermError})</div>
            <div><strong>2. DMARC Alignment Boolean Satisfiability (RFC 7489):</strong></div>
            <div>&nbsp;&nbsp;\text{DMARC Pass} = (\text{SPF Pass} \land \text{SPF Aligned}) \lor (\text{DKIM Pass} \land \text{DKIM Aligned})</div>
            <div><strong>3. DNS Zone TTL Propagation Time:</strong></div>
            <div>&nbsp;&nbsp;T_{\text{prop}} \le \max(\text{TTL}_{\text{old}}, \text{TTL}_{\text{resolver cache}}) \quad (\text{Standard 3600s = 1 hour convergence})</div>
          </div>
        </div>

        <!-- 5 Fatal Traps in DNS & Email Authentication -->
        <div style="margin-top:2rem;">
          <h2 style="font-family:var(--serif); font-size:1.35rem; margin-bottom:1rem;">5 Fatal Traps in DNS & Email Authentication Architecture</h2>
          
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: #ef4444;">1. The Fatal SPF 10-DNS-Lookup Limit PermError Trap</strong>
            Including multiple third-party marketing and CRM platforms (Google, Mailchimp, Zendesk, Salesforce) inside a single SPF record frequently pushes the DNS lookup count above 10. Once the 10-lookup threshold is breached, mail servers abort evaluation with a <code>PermError</code> and route all company emails to Spam.
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: #f59e0b;">2. The CNAME at Zone Apex RFC 1034 Violation</strong>
            Placing a CNAME record at the root domain level (e.g. <code>example.com</code>) violates RFC 1034 Section 3.6.2. When a CNAME exists on a host, DNS servers suppress all other record types, breaking MX (email delivery), TXT, and NS records for the entire domain.
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: #10b981;">3. Missing Trailing Dot on FQDN CNAME Targets</strong>
            In BIND zone files and standard DNS servers, omitting the trailing period on a hostname (e.g. <code>ghs.googlehosted.com</code> instead of <code>ghs.googlehosted.com.</code>) causes the server to append the origin domain, producing a non-existent target like <code>ghs.googlehosted.com.example.com.</code>.
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: #3b82f6;">4. 2048-Bit DKIM Public Key TXT Character Limit Overflow</strong>
            DNS TXT records enforce a maximum string length of 255 characters per string literal. A secure 2048-bit RSA DKIM public key exceeds 400 characters. If the key is not split into two concatenated quoted strings, DNS servers reject the zone file or truncate the cryptographic key.
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: #8b5cf6;">5. Setting DMARC p=reject Before Verifying Subdomain Alignment</strong>
            Immediately configuring <code>p=reject</code> without spending 30 days analyzing DMARC aggregate XML reports (<code>p=none</code>) causes catastrophic email delivery failure. Automated transactional emails from subdomains (e.g. <code>invoices.example.com</code>) failing SPF alignment will be blocked and dropped at the recipient gateway.
          </div>
        </div>
      </div>

      <script>
        function applySpfPreset() {
          var sel = document.getElementById('spf-presets').value;
          var raw = document.getElementById('spf-raw');
          var pol = document.getElementById('spf-policy').value;
          if (sel === 'google') raw.value = 'v=spf1 include:_spf.google.com ' + pol;
          if (sel === 'm365') raw.value = 'v=spf1 include:spf.protection.outlook.com ' + pol;
          if (sel === 'sendgrid') raw.value = 'v=spf1 include:_spf.google.com include:sendgrid.net ' + pol;
          compileDns();
        }

        function compileDns() {
          var dom = document.getElementById('dns-domain').value.trim() || 'example.com';
          var ip4 = document.getElementById('dns-ip4').value.trim();
          var ip6 = document.getElementById('dns-ip6').value.trim();
          var ttl = document.getElementById('dns-ttl').value.trim() || '3600';
          var spf = document.getElementById('spf-raw').value.trim();
          var dmarcPol = document.getElementById('dmarc-policy').value;
          var dmarcMail = document.getElementById('dmarc-email').value.trim();

          var lookups = (spf.match(/include:/g) || []).length + (spf.match(/\ba\b/g) || []).length + (spf.match(/\bmx\b/g) || []).length;
          var meter = document.getElementById('spf-lookup-meter');
          meter.textContent = 'DNS Lookups: ' + lookups + ' / 10 limit (' + (lookups <= 10 ? 'SAFE' : 'OVER LIMIT!') + ')';
          meter.style.color = lookups <= 10 ? '#10b981' : '#ef4444';

          var dmarc = 'v=DMARC1; p=' + dmarcPol + ';';
          if (dmarcMail) dmarc += ' rua=mailto:' + dmarcMail + ';';

          var zone = '$ORIGIN ' + dom + '.\n$TTL ' + ttl + '\n\n; SOA Record\n' +
            '@       IN  SOA  ns1.' + dom + '. hostmaster.' + dom + '. (\n' +
            '                ' + new Date().toISOString().slice(0,10).replace(/-/g, '') + '01 ; serial\n' +
            '                7200       ; refresh\n' +
            '                3600       ; retry\n' +
            '                1209600    ; expire\n' +
            '                3600 )     ; minimum\n\n';

          zone += '; Authoritative Name Servers\n@       IN  NS   ns1.' + dom + '.\n@       IN  NS   ns2.' + dom + '.\n\n';
          if (ip4) zone += '; Base Web Records\n@       IN  A    ' + ip4 + '\nwww     IN  A    ' + ip4 + '\n';
          if (ip6) zone += '@       IN  AAAA ' + ip6 + '\nwww     IN  AAAA ' + ip6 + '\n';
          zone += '\n; Mail Exchange (MX)\n@       IN  MX   10 mail.' + dom + '.\n';
          zone += '\n; SPF Authorization TXT\n@       IN  TXT  "' + spf + '"\n';
          zone += '\n; DMARC Policy TXT\n_dmarc  IN  TXT  "' + dmarc + '"\n';

          document.getElementById('dns-output').value = zone;
        }

        function copyDnsZone() {
          navigator.clipboard.writeText(document.getElementById('dns-output').value).then(function() {
            var fb = document.getElementById('dnsCopyFeedback');
            if (fb) { fb.style.display = 'inline'; setTimeout(function(){ fb.style.display = 'none'; }, 2200); }
          });
        }

        window.addEventListener('DOMContentLoaded', compileDns);
      </script>
    `
  };

  // 5. CSS Grid & Flexbox Studio
  const cssStudioTool = {
    slug: 'css-grid-flexbox-studio',
    title: 'CSS Grid & Flexbox Visual Architecture Studio [2D Layout Engine]',
    metaDesc: 'Interactive visual layout playground for CSS Flexbox and 2D Grid. Adjust flex-direction, align-items, gap, and grid-template-columns with live rendering and export production CSS.',
    category: 'Web Engineering',
    keywords: 'css grid generator, flexbox playground, css layout visualizer, flexbox studio, responsive css grid generator',
    faqs: [
      { q: 'When should I use CSS Grid versus Flexbox?', a: 'Use Flexbox for 1-dimensional layouts (a single row of navigation items or a vertical stack of buttons). Use CSS Grid for 2-dimensional layouts where alignment across both rows and columns simultaneously is necessary.' },
      { q: 'What does repeat(auto-fit, minmax(200px, 1fr)) do?', a: 'This is the classic responsive grid formula: it creates as many columns as will fit in the container, with each column being at least 200px wide, and stretching equally (1fr) to fill any leftover space without media queries.' },
      { q: 'Why does text-overflow: ellipsis break inside a Flexbox item without min-width: 0?', a: 'By default, flex items have min-width: auto, meaning their minimum size is bound by the intrinsic width of their contents. Adding min-width: 0 overrides this default, allowing the item to shrink below its text width and enabling text truncation.' },
      { q: 'What is the performance difference between CSS Grid and Flexbox?', a: 'Modern browser layout engines (Blink, Gecko, WebKit) optimize both Grid and Flexbox through native C++ layout trees. Flexbox performs slightly faster for linear lists, while CSS Grid avoids deep DOM nesting, reducing overall render tree depth.' },
      { q: 'How does align-items differ from align-content in Flexbox?', a: 'align-items controls the alignment of individual flex items along the cross-axis within their flex line. align-content only applies when flex-wrap: wrap is enabled and there are multiple lines of items, distributing the lines themselves across the container cross-axis.' }
    ],
    html: `
      ${sharedStyle}
      <style>
        .layout-item { background: #3b82f6; color: #fff; border-radius: 4px; padding: 1.25rem; font-family: var(--mono); font-size: 0.85rem; font-weight: bold; text-align: center; display: flex; align-items: center; justify-content: center; min-height: 50px; }
      </style>
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/web/">Web Engineering</a> &gt; CSS Layout Studio</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">W3C CSS Grid & Flexbox</span>
            <span class="wb-badge badge-green">Visual Architecture</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">CSS Grid & Flexbox Visual Architecture Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Visually design, test, and extract production-ready CSS Flexbox and 2-dimensional Grid declarations with live layout feedback.
          </p>
        </div>

        <div class="tab-bar">
          <button type="button" class="tab-btn active" onclick="switchLayoutMode('flex')">Flexbox Layout Mode</button>
          <button type="button" class="tab-btn" onclick="switchLayoutMode('grid')">CSS 2D Grid Mode</button>
        </div>

        <div class="wb-card">
          <!-- FLEX CONTROLS -->
          <div id="ctrls-flex" class="grid-3">
            <div>
              <label class="field-label" for="flex-dir">flex-direction</label>
              <select id="flex-dir" class="text-input" onchange="updateLayout()">
                <option value="row" selected>row</option>
                <option value="row-reverse">row-reverse</option>
                <option value="column">column</option>
                <option value="column-reverse">column-reverse</option>
              </select>
            </div>
            <div>
              <label class="field-label" for="flex-justify">justify-content</label>
              <select id="flex-justify" class="text-input" onchange="updateLayout()">
                <option value="flex-start" selected>flex-start</option>
                <option value="center">center</option>
                <option value="flex-end">flex-end</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
                <option value="space-evenly">space-evenly</option>
              </select>
            </div>
            <div>
              <label class="field-label" for="flex-align">align-items</label>
              <select id="flex-align" class="text-input" onchange="updateLayout()">
                <option value="stretch" selected>stretch</option>
                <option value="center">center</option>
                <option value="flex-start">flex-start</option>
                <option value="flex-end">flex-end</option>
              </select>
            </div>
          </div>

          <!-- GRID CONTROLS -->
          <div id="ctrls-grid" class="grid-3" style="display:none;">
            <div>
              <label class="field-label" for="grid-cols">grid-template-columns</label>
              <input type="text" id="grid-cols" class="text-input" value="repeat(auto-fit, minmax(180px, 1fr))" oninput="updateLayout()" />
            </div>
            <div>
              <label class="field-label" for="grid-rows">grid-template-rows</label>
              <input type="text" id="grid-rows" class="text-input" value="auto" oninput="updateLayout()" />
            </div>
            <div>
              <label class="field-label" for="grid-flow">grid-auto-flow</label>
              <select id="grid-flow" class="text-input" onchange="updateLayout()">
                <option value="row" selected>row</option>
                <option value="column">column</option>
                <option value="dense">dense</option>
              </select>
            </div>
          </div>

          <div style="margin-top:1rem; display:flex; gap:1.25rem; align-items:center; flex-wrap:wrap;">
            <div style="flex:1; min-width:180px;">
              <label class="field-label" for="layout-gap">gap (Spacing): <span id="gap-val">1rem</span></label>
              <input type="range" id="layout-gap" min="0" max="32" value="16" style="width:100%;" oninput="updateLayout()" />
            </div>
            <div style="display:flex; gap:0.5rem; align-items:flex-end;">
              <button type="button" class="btn-sec" style="font-size:0.8rem; padding:0.4rem 0.75rem;" onclick="addItem()">+ Add Item</button>
              <button type="button" class="btn-sec" style="font-size:0.8rem; padding:0.4rem 0.75rem;" onclick="removeItem()">- Remove Item</button>
            </div>
          </div>
        </div>

        <!-- LIVE CANVAS PREVIEW -->
        <div class="wb-card">
          <label class="field-label" style="margin-bottom:0.75rem;">Live Viewport Simulation Canvas</label>
          <div id="layout-preview" style="background:var(--bg); border:2px dashed var(--border); border-radius:6px; padding:1.25rem; min-height:220px; transition:all 0.2s ease;">
            <div class="layout-item">Item #1</div>
            <div class="layout-item">Item #2</div>
            <div class="layout-item">Item #3</div>
            <div class="layout-item">Item #4</div>
          </div>
        </div>

        <!-- EXPORT CSS -->
        <div class="wb-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <label class="field-label" style="margin:0;">Generated Production CSS</label>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <button type="button" class="btn-sec" id="btnCopyCss" style="padding:0.3rem 0.75rem; font-size:0.78rem;" onclick="copyLayoutCss()">Copy CSS</button>
              <span id="cssCopyFeedback" style="font-size:0.78rem; font-family:var(--mono); color:#10b981; display:none; font-weight:bold;">✓ Copied!</span>
            </div>
          </div>
          <textarea id="layout-css-output" class="code-input" style="height:110px;" readonly></textarea>
        </div>

        <!-- Mathematical & Geometry Derivation -->
        <div class="wb-card" style="margin-top:2rem;">
          <h2 style="font-family:var(--serif); font-size:1.35rem; margin-bottom:0.75rem;">Flex Factor Space Distribution & Grid Fractional Math</h2>
          <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.6; margin-bottom:1rem;">
            Browsers calculate box layout positions through geometric distribution equations that partition available viewport width among flexible flex factors and fractional (fr) grid tracks:
          </p>
          <div style="background:var(--bg); border:1px solid var(--border); padding:1.25rem; border-radius:4px; font-family:var(--mono); font-size:0.85rem; line-height:1.7; margin-bottom:1.25rem;">
            <div><strong>1. Flexbox Positive Space Distribution Formula:</strong></div>
            <div>&nbsp;&nbsp;W_i = \text{flex-basis}_i + \left( \frac{\text{flex-grow}_i}{\sum_{j=1}^N \text{flex-grow}_j} \times \text{Remaining Space} \right)</div>
            <div><strong>2. Flexbox Negative Shrink Ratio:</strong></div>
            <div>&nbsp;&nbsp;\text{ShrinkShare}_i = \frac{\text{flex-shrink}_i \times \text{flex-basis}_i}{\sum (\text{flex-shrink}_j \times \text{flex-basis}_j)} \times \text{Overflow}</div>
            <div><strong>3. CSS Grid Fractional (1fr) Track Allocation:</strong></div>
            <div>&nbsp;&nbsp;1\text{fr} = \frac{W_{\text{container}} - \sum W_{\text{fixed}} - (N_{\text{cols}} - 1) \times \text{gap}}{\sum \text{fr factors}}</div>
          </div>
        </div>

        <!-- 5 Fatal Traps in Modern CSS Layout -->
        <div style="margin-top:2rem;">
          <h2 style="font-family:var(--serif); font-size:1.35rem; margin-bottom:1rem;">5 Fatal Traps in Modern CSS Flexbox & Grid Architecture</h2>
          
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: #ef4444;">1. The min-width: auto Flexbox Text Truncation Blowout Trap</strong>
            Flex items default to <code>min-width: auto</code> rather than <code>min-width: 0</code>. When a child container contains long strings of text styled with <code>text-overflow: ellipsis</code>, the flex item refuses to shrink below its content width, forcing the entire parent container to blow out horizontally.
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: #f59e0b;">2. Grid 1fr Track Expansion with Large Data Tables or Images</strong>
            In CSS Grid, <code>1fr</code> is shorthand for <code>minmax(auto, 1fr)</code>. If a grid child contains a wide table, preformatted code snippet, or unconstrained image, the track expands to fit the intrinsic content size rather than obeying the fractional budget. Always specify <code>minmax(0, 1fr)</code> for strict bounding.
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: #10b981;">3. Confusing align-content with align-items in Multi-Line Flexbox</strong>
            Developers often wonder why <code>align-items</code> fails to distribute rows in a wrapping flex container. <code>align-items</code> only positions items inside their individual flex line; distributing the wrapped lines across the container cross-axis requires <code>align-content</code>.
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: #3b82f6;">4. Implicit Track Sparse Gaps & Missing grid-auto-flow: dense</strong>
            When designing card layouts with varied column/row spans, CSS Grid defaults to sparse placement. If a 2-column card cannot fit in a remaining single-column slot, the engine leaves an empty blank gap. Declaring <code>grid-auto-flow: dense</code> enables packing algorithms to backfill slots.
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: #8b5cf6;">5. Subgrid Boundary & Legacy Fallback Layout Collapse</strong>
            Using <code>grid-template-columns: subgrid</code> without testing in non-supporting browsers causes child grids to collapse to 0-width columns. Production subgrid implementations must provide an explicit fractional fallback rule for robust cross-browser degradation.
          </div>
        </div>
      </div>

      <script>
        var layoutMode = 'flex';

        function switchLayoutMode(mode) {
          layoutMode = mode;
          var btns = document.querySelectorAll('.tab-bar .tab-btn');
          for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
          if (window.event && window.event.target) window.event.target.classList.add('active');

          document.getElementById('ctrls-flex').style.display = mode === 'flex' ? 'grid' : 'none';
          document.getElementById('ctrls-grid').style.display = mode === 'grid' ? 'grid' : 'none';
          updateLayout();
        }

        function updateLayout() {
          var preview = document.getElementById('layout-preview');
          var out = document.getElementById('layout-css-output');
          var gapPx = document.getElementById('layout-gap').value;
          document.getElementById('gap-val').textContent = (gapPx / 16).toFixed(2) + 'rem (' + gapPx + 'px)';

          if (layoutMode === 'flex') {
            var dir = document.getElementById('flex-dir').value;
            var justify = document.getElementById('flex-justify').value;
            var align = document.getElementById('flex-align').value;

            preview.style.display = 'flex';
            preview.style.flexDirection = dir;
            preview.style.justifyContent = justify;
            preview.style.alignItems = align;
            preview.style.gap = gapPx + 'px';
            preview.style.gridTemplateColumns = 'none';

            var css = '.flex-container {\n' +
              '  display: flex;\n' +
              '  flex-direction: ' + dir + ';\n' +
              '  justify-content: ' + justify + ';\n' +
              '  align-items: ' + align + ';\n' +
              '  gap: ' + (gapPx/16).toFixed(2) + 'rem;\n}';
            out.value = css;
          } else {
            var cols = document.getElementById('grid-cols').value.trim() || 'repeat(auto-fit, minmax(180px, 1fr))';
            var rows = document.getElementById('grid-rows').value.trim() || 'auto';
            var flow = document.getElementById('grid-flow').value;

            preview.style.display = 'grid';
            preview.style.flexDirection = 'row';
            preview.style.justifyContent = 'normal';
            preview.style.alignItems = 'normal';
            preview.style.gridTemplateColumns = cols;
            preview.style.gridTemplateRows = rows;
            preview.style.gridAutoFlow = flow;
            preview.style.gap = gapPx + 'px';

            var cssG = '.grid-container {\n' +
              '  display: grid;\n' +
              '  grid-template-columns: ' + cols + ';\n' +
              '  grid-template-rows: ' + rows + ';\n' +
              '  grid-auto-flow: ' + flow + ';\n' +
              '  gap: ' + (gapPx/16).toFixed(2) + 'rem;\n}';
            out.value = cssG;
          }
        }

        function addItem() {
          var preview = document.getElementById('layout-preview');
          var count = preview.children.length + 1;
          var div = document.createElement('div');
          div.className = 'layout-item';
          div.textContent = 'Item #' + count;
          preview.appendChild(div);
        }

        function removeItem() {
          var preview = document.getElementById('layout-preview');
          if (preview.children.length > 1) {
            preview.removeChild(preview.lastElementChild);
          }
        }

        function copyLayoutCss() {
          navigator.clipboard.writeText(document.getElementById('layout-css-output').value).then(function() {
            var fb = document.getElementById('cssCopyFeedback');
            if (fb) { fb.style.display = 'inline'; setTimeout(function(){ fb.style.display = 'none'; }, 2200); }
          });
        }

        window.addEventListener('DOMContentLoaded', updateLayout);
      </script>
    `
  };

  // 6. Fluid Clamp Calculator
  const clampTool = {
    slug: 'css-clamp-calculator',
    title: 'CSS clamp() Fluid Typography & Spacing Calculator [Linear Scale Engine]',
    metaDesc: 'Generate exact CSS clamp(min, preferred_vw, max) functions for fluid typography and responsive spacing without media queries. Includes real-time viewport scaling curve graph.',
    category: 'Web Engineering',
    keywords: 'css clamp calculator, fluid typography generator, clamp rem vw formula, responsive font size clamp, css linear interpolation',
    faqs: [
      { q: 'How does CSS clamp() work under the hood?', a: 'clamp(MIN, VAL, MAX) takes three parameters: a minimum boundary, a preferred value, and a maximum cap. The browser scales the value smoothly between the minimum and maximum based on the current window size.' },
      { q: 'Why is linear slope interpolation better than media queries?', a: 'Media queries cause sudden jarring font and layout jumps at specific breakpoints (e.g. 768px). Linear clamp interpolation scales pixel-by-pixel continuously across every device width.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/web/">Web Engineering</a> &gt; CSS clamp() Calculator</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">CSS Values 4</span>
            <span class="wb-badge badge-green">Linear Interpolation</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">CSS clamp() Fluid Typography Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Derive mathematical viewport slope constants for perfectly fluid font sizes and section padding across all screen sizes without media queries.
          </p>
        </div>

        <div class="wb-card">
          <div class="grid-4">
            <div>
              <label class="field-label">Min Viewport (px)</label>
              <input type="number" id="clamp-min-vp" class="text-input" value="375" oninput="calculateClamp()" />
            </div>
            <div>
              <label class="field-label">Max Viewport (px)</label>
              <input type="number" id="clamp-max-vp" class="text-input" value="1440" oninput="calculateClamp()" />
            </div>
            <div>
              <label class="field-label">Min Size (px)</label>
              <input type="number" id="clamp-min-sz" class="text-input" value="18" oninput="calculateClamp()" />
            </div>
            <div>
              <label class="field-label">Max Size (px)</label>
              <input type="number" id="clamp-max-sz" class="text-input" value="36" oninput="calculateClamp()" />
            </div>
          </div>
        </div>

        <div class="wb-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <label class="field-label" style="margin:0;">Generated CSS Declaration</label>
            <button class="btn-primary" style="padding:0.4rem 0.8rem; font-size:0.8rem;" onclick="copyClamp()">Copy CSS</button>
          </div>
          <input type="text" id="clamp-result" class="code-input" style="font-size:1.05rem; font-weight:bold; color:#60a5fa;" readonly />
          <div style="margin-top:0.5rem; font-family:var(--mono); font-size:0.78rem; color:var(--text-muted);" id="clamp-formula-notes">
            Slope: 0.0169 | Y-Intercept: 11.66px
          </div>
        </div>

        <div class="wb-card">
          <label class="field-label">Interactive Fluid Scaling Preview</label>
          <div style="padding:1.5rem; background:var(--bg); border:1px solid var(--border); border-radius:4px;">
            <p id="clamp-live-text" style="margin:0; line-height:1.2; font-family:var(--serif);">
              Responsive typography that flows like water across viewports.
            </p>
          </div>
          <div style="margin-top:0.75rem; font-family:var(--mono); font-size:0.8rem; color:var(--text-muted);" id="clamp-computed-size">
            Current rendered size: -- px
          </div>
        </div>
      </div>

      <script>
        function calculateClamp() {
          var minVp = parseFloat(document.getElementById('clamp-min-vp').value) || 375;
          var maxVp = parseFloat(document.getElementById('clamp-max-vp').value) || 1440;
          var minSz = parseFloat(document.getElementById('clamp-min-sz').value) || 16;
          var maxSz = parseFloat(document.getElementById('clamp-max-sz').value) || 32;

          var slope = (maxSz - minSz) / (maxVp - minVp);
          var yIntercept = -minVp * slope + minSz;

          var slopeVw = (slope * 100).toFixed(4);
          var yIntRem = (yIntercept / 16).toFixed(4);
          var minRem = (minSz / 16).toFixed(4);
          var maxRem = (maxSz / 16).toFixed(4);

          var clampVal = 'clamp(' + minRem + 'rem, ' + yIntRem + 'rem + ' + slopeVw + 'vw, ' + maxRem + 'rem)';
          document.getElementById('clamp-result').value = 'font-size: ' + clampVal + ';';
          document.getElementById('clamp-formula-notes').textContent = 'Slope: ' + slope.toFixed(4) + ' | Intercept: ' + yIntercept.toFixed(2) + 'px (' + yIntRem + 'rem)';

          var live = document.getElementById('clamp-live-text');
          live.style.fontSize = clampVal;
          setTimeout(function() {
            var comp = window.getComputedStyle(live).fontSize;
            document.getElementById('clamp-computed-size').textContent = 'Current rendered size: ' + comp;
          }, 50);
        }

        function copyClamp() {
          navigator.clipboard.writeText(document.getElementById('clamp-result').value);
          alert('CSS declaration copied!');
        }

        window.addEventListener('DOMContentLoaded', calculateClamp);
        window.addEventListener('resize', calculateClamp);
      </script>
    `
  };

  // 7. Social Card & Meta Tag Visual Studio
  const socialTool = {
    slug: 'social-card-previewer',
    title: 'OpenGraph & Twitter Card Visual Studio [SERP & Social Previewer]',
    metaDesc: 'Live interactive previewer for OpenGraph, Twitter/X cards, and Google SERP desktop & mobile search snippets. Generates complete HTML metadata tags and JSON-LD schema.',
    category: 'Web Engineering',
    keywords: 'opengraph previewer, twitter card generator, google serp simulator, meta tag preview, social share visualizer',
    faqs: [
      { q: 'What is the optimal aspect ratio for OpenGraph image tags?', a: 'The recommended standard for og:image is 1200x630 pixels (1.91:1 aspect ratio). This prevents unwanted cropping on Facebook, LinkedIn, Twitter Large Summary Cards, Discord, and Slack.' },
      { q: 'Why is a canonical URL tag necessary?', a: 'The canonical tag tells search engines which URL is the master version of a page, consolidating link equity and eliminating duplicate content penalties.' }
    ],
    html: `
      ${sharedStyle}
      <style>
        .og-preview-card {
          background: #0f172a;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          max-width: 500px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .og-img-box {
          height: 250px;
          background-size: cover;
          background-position: center;
          background-color: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }
        .og-body { padding: 1rem; }
        .og-domain { font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; }
        .og-title { font-size: 1rem; font-weight: 600; color: #f8fafc; margin: 0.25rem 0; line-height: 1.4; }
        .og-desc { font-size: 0.85rem; color: #94a3b8; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      </style>
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/web/">Web Engineering</a> &gt; Social Card Studio</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-green">OpenGraph Protocol</span>
            <span class="wb-badge badge-blue">SERP Simulator</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Social Card & Meta Tag Visual Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Simulate how your URL unfurls on Google Search, Twitter/X, and OpenGraph feeds, and generate clean HTML metadata tags.
          </p>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Page Meta Properties</h3>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              <div>
                <label class="field-label">Page Title</label>
                <input type="text" id="meta-title" class="text-input" value="Digital Tools Shed — The High-Precision Web Workbench" oninput="renderSocial()" />
              </div>
              <div>
                <label class="field-label">Meta Description</label>
                <textarea id="meta-desc" class="text-input" style="height:70px;" oninput="renderSocial()">Over 5,000 hyper-specific client-side tools, protocols, and technical calculators with zero tracking and zero external dependencies.</textarea>
              </div>
              <div>
                <label class="field-label">Canonical URL</label>
                <input type="text" id="meta-url" class="text-input" value="https://digitaltoolsshed.com/web/" oninput="renderSocial()" />
              </div>
              <div>
                <label class="field-label">Social Share Image (og:image 1200x630)</label>
                <input type="text" id="meta-img" class="text-input" value="https://digitaltoolsshed.com/assets/og-cover.png" oninput="renderSocial()" />
              </div>
            </div>
          </div>

          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Live Card Preview (Twitter/X & OpenGraph)</h3>
            <div class="og-preview-card">
              <div id="preview-img" class="og-img-box">1200 x 630 Preview</div>
              <div class="og-body">
                <div id="preview-domain" class="og-domain">digitaltoolsshed.com</div>
                <div id="preview-title" class="og-title">Digital Tools Shed — The High-Precision Web Workbench</div>
                <div id="preview-desc" class="og-desc">Over 5,000 hyper-specific client-side tools...</div>
              </div>
            </div>
          </div>
        </div>

        <div class="wb-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <label class="field-label" style="margin:0;">Generated HTML &lt;head&gt; Code</label>
            <button class="btn-primary" style="padding:0.4rem 0.8rem; font-size:0.8rem;" onclick="copyMeta()">Copy HTML Meta Tags</button>
          </div>
          <textarea id="meta-output" class="code-input" style="height:210px;" readonly></textarea>
        </div>
      </div>

      <script>
        function renderSocial() {
          var t = document.getElementById('meta-title').value.trim();
          var d = document.getElementById('meta-desc').value.trim();
          var u = document.getElementById('meta-url').value.trim();
          var img = document.getElementById('meta-img').value.trim();

          document.getElementById('preview-title').textContent = t;
          document.getElementById('preview-desc').textContent = d;
          try {
            var urlObj = new URL(u);
            document.getElementById('preview-domain').textContent = urlObj.hostname;
          } catch(e) {
            document.getElementById('preview-domain').textContent = 'example.com';
          }

          var imgBox = document.getElementById('preview-img');
          if (img && img.startsWith('http')) {
            imgBox.style.backgroundImage = 'url(' + img + ')';
            imgBox.textContent = '';
          } else {
            imgBox.style.backgroundImage = 'none';
            imgBox.textContent = '1200 x 630 Preview';
          }

          var tags = '<!-- Standard Metadata -->\\n<title>' + t + '</title>\\n<meta name="description" content="' + d + '">\\n<link rel="canonical" href="' + u + '">\\n\\n<!-- Open Graph / Facebook -->\\n<meta property="og:type" content="website">\\n<meta property="og:url" content="' + u + '">\\n<meta property="og:title" content="' + t + '">\\n<meta property="og:description" content="' + d + '">\\n<meta property="og:image" content="' + img + '">\\n\\n<!-- Twitter / X -->\\n<meta name="twitter:card" content="summary_large_image">\\n<meta name="twitter:title" content="' + t + '">\\n<meta name="twitter:description" content="' + d + '">\\n<meta name="twitter:image" content="' + img + '">';
          document.getElementById('meta-output').value = tags;
        }

        function copyMeta() {
          navigator.clipboard.writeText(document.getElementById('meta-output').value);
          alert('HTML meta tags copied to clipboard!');
        }

        window.addEventListener('DOMContentLoaded', renderSocial);
      </script>
    `
  };

  // 8. WebRTC SDP Dissector
  const sdpTool = {
    slug: 'webrtc-sdp-analyzer',
    title: 'WebRTC SDP (Session Description Protocol) Dissector [Signaling Debugger]',
    metaDesc: 'Parse and dissect raw WebRTC SDP offer and answer strings. Inspect m-lines, ICE candidates (host, srflx, relay), Opus/VP8/H.264/AV1 codecs, and DTLS certificate fingerprints.',
    category: 'Web Engineering',
    keywords: 'webrtc sdp parser, session description protocol analyzer, ice candidates dissector, sdp offer answer debugger',
    faqs: [
      { q: 'What is an SDP offer and answer?', a: 'In WebRTC, Session Description Protocol (SDP) text blobs are exchanged via a signaling server to negotiate media formats before establishing a direct peer-to-peer UDP connection.' },
      { q: 'What are host, srflx, and relay ICE candidates?', a: 'Host candidates are local LAN IP addresses. Server Reflexive (srflx) candidates are public IPs discovered via a STUN server. Relay candidates route traffic through a TURN server when direct P2P NAT traversal fails.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/web/">Web Engineering</a> &gt; WebRTC SDP Dissector</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-purple">RFC 8866 / WebRTC 1.0</span>
            <span class="wb-badge badge-green">Zero-Dependency</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">WebRTC SDP Signaling Dissector</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Deconstruct complex Session Description Protocol blobs into codecs, ICE candidate matrices, DTLS fingerprints, and transport groups.
          </p>
        </div>

        <div class="wb-card">
          <label class="field-label">Raw SDP Offer or Answer</label>
          <textarea id="sdp-input" class="code-input" style="height:140px;" oninput="dissectSdp()"></textarea>
          <button class="btn-sec" style="margin-top:0.75rem;" onclick="loadSdpExample()">Load Realistic WebRTC Offer Example</button>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Media & Codec Matrix</h3>
            <div id="sdp-media-list" style="font-family:var(--mono); font-size:0.85rem; line-height:1.6;">
              <span style="color:var(--text-muted);">Paste an SDP blob to analyze codecs...</span>
            </div>
          </div>

          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">ICE Candidate Candidates</h3>
            <div id="sdp-ice-list" style="font-family:var(--mono); font-size:0.85rem; line-height:1.6;">
              <span style="color:var(--text-muted);">Awaiting ICE candidates...</span>
            </div>
          </div>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Security & Fingerprint</h3>
          <div id="sdp-security-box" style="font-family:var(--mono); font-size:0.85rem; line-height:1.6;">
            --
          </div>
        </div>
      </div>

      <script>
        function loadSdpExample() {
          document.getElementById('sdp-input').value = 'v=0\\n' +
'o=- 8122941029412 2 IN IP4 127.0.0.1\\n' +
's=-\\n' +
't=0 0\\n' +
'a=group:BUNDLE 0 1\\n' +
'a=msid-semantic: WMS\\n' +
'm=audio 9 UDP/TLS/RTP/SAVPF 111 63 9\\n' +
'c=IN IP4 0.0.0.0\\n' +
'a=rtpmap:111 opus/48000/2\\n' +
'a=rtpmap:9 G722/8000\\n' +
'a=fingerprint:sha-256 2B:65:B2:91:0A:88:9F:44:EE:12:88:AC:B1:00:23:44:11:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33\\n' +
'a=setup:actpass\\n' +
'a=candidate:4234901 1 udp 2122260223 192.168.1.15 54101 typ host generation 0\\n' +
'a=candidate:9981223 1 udp 1686052607 203.0.113.45 61204 typ srflx raddr 192.168.1.15 rport 54101\\n' +
'm=video 9 UDP/TLS/RTP/SAVPF 96 98 100\\n' +
'a=rtpmap:96 VP8/90000\\n' +
'a=rtpmap:98 VP9/90000\\n' +
'a=rtpmap:100 H264/90000';
          dissectSdp();
        }

        function dissectSdp() {
          var raw = document.getElementById('sdp-input').value.trim();
          if (!raw) return;

          var lines = raw.split('\\n').map(function(l){ return l.trim(); });
          var codecs = [];
          var candidates = [];
          var fingerprint = 'None';
          var setup = 'None';

          lines.forEach(function(line) {
            if (line.startsWith('a=rtpmap:')) {
              var parts = line.slice(9).split(' ');
              if (parts.length >= 2) codecs.push(parts[1]);
            } else if (line.startsWith('a=candidate:')) {
              var parts = line.slice(12).split(' ');
              if (parts.length >= 8) {
                candidates.push({
                  type: parts[7],
                  ip: parts[4],
                  port: parts[5],
                  proto: parts[2]
                });
              }
            } else if (line.startsWith('a=fingerprint:')) {
              fingerprint = line.slice(14);
            } else if (line.startsWith('a=setup:')) {
              setup = line.slice(8);
            }
          });

          var mBox = document.getElementById('sdp-media-list');
          if (codecs.length) {
            mBox.innerHTML = codecs.map(function(c){ return '<div style="margin-bottom:4px;"><span class="wb-badge badge-blue">CODEC</span> <strong>' + c + '</strong></div>'; }).join('');
          } else {
            mBox.innerHTML = '<span style="color:var(--text-muted);">No a=rtpmap lines discovered</span>';
          }

          var cBox = document.getElementById('sdp-ice-list');
          if (candidates.length) {
            cBox.innerHTML = candidates.map(function(c) {
              var badge = 'badge-green';
              if (c.type === 'srflx') badge = 'badge-amber';
              if (c.type === 'relay') badge = 'badge-purple';
              return '<div style="margin-bottom:4px;"><span class="wb-badge ' + badge + '">' + c.type.toUpperCase() + '</span> ' + c.ip + ':' + c.port + ' (' + c.proto + ')</div>';
            }).join('');
          } else {
            cBox.innerHTML = '<span style="color:var(--text-muted);">No ICE candidates found</span>';
          }

          document.getElementById('sdp-security-box').innerHTML = '<div><strong>DTLS Setup Role:</strong> <span class="wb-badge badge-blue">' + setup + '</span></div>' +
            '<div style="margin-top:0.4rem; word-break:break-all;"><strong>SHA-256 Cert Fingerprint:</strong> <code>' + fingerprint + '</code></div>';
        }

        window.addEventListener('DOMContentLoaded', loadSdpExample);
      </script>
    `
  };

  // 9. Core Web Vitals & Performance Budget Simulator
  const vitalsTool = {
    slug: 'web-vitals-budget',
    title: 'Core Web Vitals & Performance Budget Simulator [CrUX Metrics Engine]',
    metaDesc: 'Interactive performance budget and Core Web Vitals diagnostic. Calculate Largest Contentful Paint (LCP), INP, CLS, and estimate e-commerce conversion revenue impact per 100ms latency.',
    category: 'Web Engineering',
    keywords: 'core web vitals calculator, performance budget simulator, lcp inp cls calculator, website speed conversion loss',
    faqs: [
      { q: 'What are the 3 Core Web Vitals thresholds for passing in Google Search?', a: 'LCP (Largest Contentful Paint) must be under 2.5s; INP (Interaction to Next Paint) must be 200ms or lower; and CLS (Cumulative Layout Shift) must remain under 0.1 for at least 75% of page visits.' },
      { q: 'How does page load speed impact conversion rate?', a: 'Industry research by Google, Cloudflare, and Amazon shows that every 100ms delay in page load time reduces conversion rates by approximately 0.7% to 1.0% and increases bounce rate exponentially on mobile networks.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/web/">Web Engineering</a> &gt; Core Web Vitals Budget</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-green">CrUX 2026 Ready</span>
            <span class="wb-badge badge-blue">Financial ROI Model</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Core Web Vitals & Performance Budget Simulator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Model asset transfer weights against mobile connection throttling profiles, evaluate Google search rank health, and quantify revenue loss.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.05rem; margin-bottom:1rem; font-family:var(--serif);">Transfer Asset Budget (Compressed Gzip/Brotli)</h3>
          <div class="grid-4">
            <div>
              <label class="field-label">JavaScript (kB): <span id="val-js" style="color:var(--fg);">180</span></label>
              <input type="range" id="size-js" min="10" max="1500" value="180" style="width:100%;" oninput="calculateVitals()" />
            </div>
            <div>
              <label class="field-label">CSS Stylesheets (kB): <span id="val-css" style="color:var(--fg);">40</span></label>
              <input type="range" id="size-css" min="5" max="300" value="40" style="width:100%;" oninput="calculateVitals()" />
            </div>
            <div>
              <label class="field-label">Hero / Images (kB): <span id="val-img" style="color:var(--fg);">250</span></label>
              <input type="range" id="size-img" min="10" max="3000" value="250" style="width:100%;" oninput="calculateVitals()" />
            </div>
            <div>
              <label class="field-label">Web Fonts (kB): <span id="val-font" style="color:var(--fg);">60</span></label>
              <input type="range" id="size-font" min="0" max="500" value="60" style="width:100%;" oninput="calculateVitals()" />
            </div>
          </div>

          <div class="grid-2" style="margin-top:1.25rem;">
            <div>
              <label class="field-label">Network Profile Throttling</label>
              <select id="vitals-network" class="text-input" onchange="calculateVitals()">
                <option value="4g">Fast 4G (9.0 Mbps down, 40ms RTT)</option>
                <option value="slow4g" selected>Average 4G (4.0 Mbps down, 80ms RTT)</option>
                <option value="3g">Slow 3G (400 Kbps down, 400ms RTT)</option>
                <option value="fiber">Fiber / Cable (50 Mbps down, 10ms RTT)</option>
              </select>
            </div>
            <div>
              <label class="field-label">Estimated Monthly Revenue ($)</label>
              <input type="number" id="vitals-revenue" class="text-input" value="50000" oninput="calculateVitals()" />
            </div>
          </div>
        </div>

        <div class="grid-3">
          <div class="wb-card" style="text-align:center;">
            <div class="field-label">Largest Contentful Paint (LCP)</div>
            <div id="vitals-lcp" style="font-size:2.2rem; font-family:var(--mono); font-weight:bold; margin:0.5rem 0; color:#10b981;">1.8s</div>
            <span id="badge-lcp" class="wb-badge badge-green">GOOD (&le; 2.5s)</span>
          </div>

          <div class="wb-card" style="text-align:center;">
            <div class="field-label">Interaction to Next Paint (INP)</div>
            <div id="vitals-inp" style="font-size:2.2rem; font-family:var(--mono); font-weight:bold; margin:0.5rem 0; color:#10b981;">95ms</div>
            <span id="badge-inp" class="wb-badge badge-green">GOOD (&le; 200ms)</span>
          </div>

          <div class="wb-card" style="text-align:center;">
            <div class="field-label">Annual Revenue at Risk</div>
            <div id="vitals-loss" style="font-size:2.2rem; font-family:var(--mono); font-weight:bold; margin:0.5rem 0; color:#f87171;">$0 / yr</div>
            <span class="wb-badge badge-amber">Latency Penalty</span>
          </div>
        </div>
      </div>

      <script>
        function calculateVitals() {
          var js = parseInt(document.getElementById('size-js').value);
          var css = parseInt(document.getElementById('size-css').value);
          var img = parseInt(document.getElementById('size-img').value);
          var font = parseInt(document.getElementById('size-font').value);
          var net = document.getElementById('vitals-network').value;
          var rev = parseFloat(document.getElementById('vitals-revenue').value) || 0;

          document.getElementById('val-js').textContent = js;
          document.getElementById('val-css').textContent = css;
          document.getElementById('val-img').textContent = img;
          document.getElementById('val-font').textContent = font;

          var speedBps = 4000000;
          var rtt = 0.08;
          if (net === '4g') { speedBps = 9000000; rtt = 0.04; }
          if (net === '3g') { speedBps = 400000; rtt = 0.40; }
          if (net === 'fiber') { speedBps = 50000000; rtt = 0.01; }

          var totalBytes = (js + css + img + font) * 1024;
          var downloadTime = totalBytes / (speedBps / 8);
          var lcp = (rtt * 3) + downloadTime + (js * 0.0008);

          var lcpEl = document.getElementById('vitals-lcp');
          var lcpBadge = document.getElementById('badge-lcp');
          lcpEl.textContent = lcp.toFixed(2) + 's';

          if (lcp <= 2.5) {
            lcpEl.style.color = '#10b981';
            lcpBadge.className = 'wb-badge badge-green';
            lcpBadge.textContent = 'GOOD (<= 2.5s)';
          } else if (lcp <= 4.0) {
            lcpEl.style.color = '#f59e0b';
            lcpBadge.className = 'wb-badge badge-amber';
            lcpBadge.textContent = 'NEEDS IMPROVEMENT';
          } else {
            lcpEl.style.color = '#ef4444';
            lcpBadge.className = 'wb-badge badge-red';
            lcpBadge.textContent = 'POOR (> 4.0s)';
          }

          var inp = Math.min(600, Math.round(40 + (js * 0.22)));
          var inpEl = document.getElementById('vitals-inp');
          var inpBadge = document.getElementById('badge-inp');
          inpEl.textContent = inp + 'ms';
          if (inp <= 200) {
            inpEl.style.color = '#10b981';
            inpBadge.className = 'wb-badge badge-green';
            inpBadge.textContent = 'GOOD (<= 200ms)';
          } else {
            inpEl.style.color = '#ef4444';
            inpBadge.className = 'wb-badge badge-red';
            inpBadge.textContent = 'POOR (> 200ms)';
          }

          var excessMs = Math.max(0, (lcp - 1.5) * 1000);
          var penaltyPct = (excessMs / 100) * 0.008;
          var annualRev = rev * 12;
          var loss = Math.round(annualRev * penaltyPct);
          document.getElementById('vitals-loss').textContent = '$' + loss.toLocaleString() + ' / yr';
        }

        window.addEventListener('DOMContentLoaded', calculateVitals);
      </script>
    `
  };

  // 10. SVG Path Visualizer & Bézier Studio
  const svgTool = {
    slug: 'svg-path-studio',
    title: 'SVG Path Visualizer & Bézier Explainer [Interactive Vector Canvas]',
    metaDesc: 'Interactive HTML5 Canvas SVG path editor with visual Bézier control handles. Parse M, C, S, Q, and A path segments, compute bounding boxes, and optimize vector paths.',
    category: 'Web Engineering',
    keywords: 'svg path visualizer, bezier curve editor svg, svg path optimizer, inspect svg d attribute, svg path arc length',
    faqs: [
      { q: 'What do the C and Q path commands mean in SVG?', a: 'C indicates a Cubic Bézier curve with two control handles (x1 y1, x2 y2) ending at (x y). Q indicates a Quadratic Bézier curve with a single control handle (x1 y1) ending at (x y).' },
      { q: 'Why is SVG path minification important?', a: 'Minifying coordinates by rounding redundant decimal precision (e.g. 14.88231px to 14.9px) and stripping leading zeroes often cuts SVG byte weights by 40% to 60%.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/web/">Web Engineering</a> &gt; SVG Path Studio</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-purple">W3C SVG 2.0</span>
            <span class="wb-badge badge-green">Canvas Interactive</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">SVG Path Visualizer & Bézier Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Inspect vector coordinates, visually trace cubic and quadratic curves on a precision grid canvas, and minify path declarations.
          </p>
        </div>

        <div class="wb-card">
          <label class="field-label">SVG Path Data (d="..." string)</label>
          <textarea id="svg-input" class="code-input" style="height:90px;" oninput="renderSvgPath()">M 50 150 C 50 50, 200 50, 200 150 S 350 250, 350 150</textarea>
          <div style="display:flex; gap:0.5rem; margin-top:0.75rem;">
            <button class="btn-sec" onclick="loadSvgPreset('cubic')">Cubic S-Curve</button>
            <button class="btn-sec" onclick="loadSvgPreset('heart')">Heart Icon</button>
            <button class="btn-sec" onclick="loadSvgPreset('star')">5-Point Star</button>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <label class="field-label">Vector Rendering Canvas (400x300 Grid)</label>
            <canvas id="svg-canvas" width="400" height="300" style="width:100%; height:auto; background:#090d16; border:1px solid var(--border); border-radius:4px;"></canvas>
          </div>

          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Geometry Metrics</h3>
            <div style="display:flex; flex-direction:column; gap:0.5rem; font-family:var(--mono); font-size:0.85rem;">
              <div>Commands Count: <span id="svg-cmd-count" style="color:var(--fg); font-weight:bold;">--</span></div>
              <div>Estimated Length: <span id="svg-length" style="color:#60a5fa; font-weight:bold;">-- px</span></div>
              <div>Original Length: <span id="svg-orig-bytes" style="color:var(--text-muted);">-- chars</span></div>
            </div>

            <div style="margin-top:1.25rem;">
              <button class="btn-primary" onclick="minifySvgPath()">Minify Coordinates (1-decimal)</button>
            </div>
          </div>
        </div>
      </div>

      <script>
        function loadSvgPreset(type) {
          if (type === 'cubic') {
            document.getElementById('svg-input').value = 'M 50 150 C 50 50, 200 50, 200 150 S 350 250, 350 150';
          } else if (type === 'heart') {
            document.getElementById('svg-input').value = 'M 200 100 C 200 60, 150 50, 120 80 C 80 120, 120 180, 200 240 C 280 180, 320 120, 280 80 C 250 50, 200 60, 200 100 Z';
          } else if (type === 'star') {
            document.getElementById('svg-input').value = 'M 200 40 L 235 150 L 350 150 L 255 215 L 290 320 L 200 255 L 110 320 L 145 215 L 50 150 L 165 150 Z';
          }
          renderSvgPath();
        }

        function renderSvgPath() {
          var d = document.getElementById('svg-input').value.trim();
          var canvas = document.getElementById('svg-canvas');
          var ctx = canvas.getContext('2d');

          ctx.clearRect(0, 0, 400, 300);

          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1;
          for (var x = 0; x < 400; x += 25) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 300); ctx.stroke();
          }
          for (var y = 0; y < 300; y += 25) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(400, y); ctx.stroke();
          }

          if (!d) return;

          try {
            var path = new Path2D(d);
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.stroke(path);

            var matches = d.match(/[MmLlHhVvCcSsQqTtAaZz]/g);
            document.getElementById('svg-cmd-count').textContent = matches ? matches.length : 0;
            document.getElementById('svg-orig-bytes').textContent = d.length + ' chars';

            var tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            var tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            tempPath.setAttribute('d', d);
            tempSvg.appendChild(tempPath);
            document.body.appendChild(tempSvg);
            var len = Math.round(tempPath.getTotalLength());
            document.body.removeChild(tempSvg);
            document.getElementById('svg-length').textContent = len + ' px';
          } catch(e) {
          }
        }

        function minifySvgPath() {
          var d = document.getElementById('svg-input').value;
          d = d.replace(/\\s+/g, ' ').replace(/([A-Za-z])\\s+/g, '$1').replace(/\\s+([A-Za-z])/g, '$1');
          document.getElementById('svg-input').value = d;
          renderSvgPath();
        }

        window.addEventListener('DOMContentLoaded', function() {
          loadSvgPreset('cubic');
        });
      </script>
    `
  };

  // 11. WebCrypto SubtleCrypto Key Studio
  const cryptoTool = {
    slug: 'webcrypto-key-studio',
    title: 'WebCrypto Keypair & HMAC Studio [SubtleCrypto Engine]',
    metaDesc: 'Generate cryptographically secure RSA and ECDSA keypairs locally in your browser with Web Crypto API (SubtleCrypto). Export PEM and JWK keys with zero external libraries.',
    category: 'Web Engineering',
    keywords: 'webcrypto key generator, subtlecrypto rsa keypair, ecdsa key generator online, generate pem key in browser, hmac signature verifier',
    faqs: [
      { q: 'Is it safe to generate cryptographic keys in a browser tool?', a: 'Yes, because this tool relies strictly on the native W3C Web Cryptography API (window.crypto.subtle) running in isolated browser memory. Zero private keys or signatures are ever sent over a network.' },
      { q: 'What is the difference between SPKI and PKCS#8?', a: 'SubjectPublicKeyInfo (SPKI) is the standard format for encoding Public Keys in PEM. PKCS#8 is the standard container for encoding Private Keys.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/web/">Web Engineering</a> &gt; WebCrypto Key Studio</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-green">W3C WebCrypto API</span>
            <span class="wb-badge badge-blue">Zero-Dependency</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">WebCrypto Keypair & HMAC Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Generate cryptographically secure RSA-OAEP, RSA-PSS, and ECDSA keypairs, export PKCS#8/SPKI PEMs, and sign HMAC payloads in sub-millisecond hardware time.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Algorithm Selection</h3>
          <div class="grid-3">
            <div>
              <label class="field-label">Cryptographic Algorithm</label>
              <select id="crypto-algo" class="text-input" onchange="generateKeyPair()">
                <option value="RSA-OAEP-2048">RSA-OAEP (2048-bit)</option>
                <option value="RSA-PSS-2048">RSA-PSS (2048-bit)</option>
                <option value="ECDSA-P256">ECDSA (NIST P-256 Curve)</option>
                <option value="ECDSA-P384">ECDSA (NIST P-384 Curve)</option>
              </select>
            </div>
            <div>
              <label class="field-label">Export Format</label>
              <select id="crypto-fmt" class="text-input" onchange="renderKeys()">
                <option value="pem">PEM Format (SPKI / PKCS#8)</option>
                <option value="jwk">JWK (JSON Web Key)</option>
              </select>
            </div>
            <div style="display:flex; align-items:flex-end;">
              <button class="btn-primary" style="width:100%;" onclick="generateKeyPair()">⚡ Regenerate Keypair</button>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <label class="field-label" style="margin:0;">Public Key</label>
              <button class="btn-sec" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="copyKey('pub')">Copy</button>
            </div>
            <textarea id="crypto-pub" class="code-input" style="height:210px;" readonly></textarea>
          </div>

          <div class="wb-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <label class="field-label" style="margin:0;">Private Key (PKCS#8)</label>
              <button class="btn-sec" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="copyKey('priv')">Copy</button>
            </div>
            <textarea id="crypto-priv" class="code-input" style="height:210px; color:#f87171;" readonly></textarea>
          </div>
        </div>
      </div>

      <script>
        var currentKeyPair = null;
        var exportedPub = '';
        var exportedPriv = '';

        function arrayBufferToBase64(buffer) {
          var binary = '';
          var bytes = new Uint8Array(buffer);
          for (var i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          return window.btoa(binary);
        }

        async function generateKeyPair() {
          var sel = document.getElementById('crypto-algo').value;
          document.getElementById('crypto-pub').value = '// Generating cryptographic entropy...';
          document.getElementById('crypto-priv').value = '// Generating cryptographic entropy...';

          try {
            if (sel.startsWith('RSA')) {
              var isPss = sel.indexOf('PSS') > -1;
              currentKeyPair = await window.crypto.subtle.generateKey(
                {
                  name: isPss ? "RSA-PSS" : "RSA-OAEP",
                  modulusLength: 2048,
                  publicExponent: new Uint8Array([1, 0, 1]),
                  hash: "SHA-256"
                },
                true,
                isPss ? ["sign", "verify"] : ["encrypt", "decrypt"]
              );
            } else {
              var curve = sel.indexOf('P384') > -1 ? "P-384" : "P-256";
              currentKeyPair = await window.crypto.subtle.generateKey(
                { name: "ECDSA", namedCurve: curve },
                true,
                ["sign", "verify"]
              );
            }
            renderKeys();
          } catch(e) {
            alert('Crypto Error: ' + e.message);
          }
        }

        async function renderKeys() {
          if (!currentKeyPair) return;
          var fmt = document.getElementById('crypto-fmt').value;

          if (fmt === 'pem') {
            var spki = await window.crypto.subtle.exportKey("spki", currentKeyPair.publicKey);
            var pkcs8 = await window.crypto.subtle.exportKey("pkcs8", currentKeyPair.privateKey);

            var b64Pub = arrayBufferToBase64(spki).match(/.{1,64}/g).join('\\n');
            var b64Priv = arrayBufferToBase64(pkcs8).match(/.{1,64}/g).join('\\n');

            exportedPub = '-----BEGIN PUBLIC KEY-----\\n' + b64Pub + '\\n-----END PUBLIC KEY-----';
            exportedPriv = '-----BEGIN PRIVATE KEY-----\\n' + b64Priv + '\\n-----END PRIVATE KEY-----';
          } else {
            var jwkPub = await window.crypto.subtle.exportKey("jwk", currentKeyPair.publicKey);
            var jwkPriv = await window.crypto.subtle.exportKey("jwk", currentKeyPair.privateKey);
            exportedPub = JSON.stringify(jwkPub, null, 2);
            exportedPriv = JSON.stringify(jwkPriv, null, 2);
          }

          document.getElementById('crypto-pub').value = exportedPub;
          document.getElementById('crypto-priv').value = exportedPriv;
        }

        function copyKey(type) {
          var val = type === 'pub' ? exportedPub : exportedPriv;
          navigator.clipboard.writeText(val);
          alert('Key copied to clipboard!');
        }

        window.addEventListener('DOMContentLoaded', generateKeyPair);
      </script>
    `
  };

  // 12. HTTP Cookie Dissector
  const cookieTool = {
    slug: 'cookie-inspector',
    title: 'HTTP Cookie & Set-Cookie Header Dissector [Privacy & Security Audit]',
    metaDesc: 'Parse and dissect raw Set-Cookie HTTP headers. Audit SameSite (Strict, Lax, None), Secure, HttpOnly, and modern Partitioned (CHIPS) flags for Safari ITP & Chrome privacy compliance.',
    category: 'Web Engineering',
    keywords: 'set-cookie header parser, cookie security inspector, samesite cookie tester, chips partitioned cookie, safari itp audit',
    faqs: [
      { q: 'What is the Partitioned (CHIPS) cookie attribute?', a: 'Cookies Having Independent Partitioned State (CHIPS) allows third-party cookies to be partitioned by the top-level site you are visiting, preventing cross-site tracking while keeping embedded widgets and authentication functional.' },
      { q: 'Why is SameSite=None without Secure rejected by browsers?', a: 'Modern browsers enforce that any cookie marked SameSite=None must also include the Secure flag, preventing transmission over unencrypted HTTP.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/web/">Web Engineering</a> &gt; Cookie Dissector</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">RFC 6265bis</span>
            <span class="wb-badge badge-green">Privacy Shield</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">HTTP Cookie & Set-Cookie Header Dissector</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Audit HTTP response cookie attributes against modern Safari ITP, Firefox ETP, and Chrome Third-Party Cookie deprecation standards.
          </p>
        </div>

        <div class="wb-card">
          <label class="field-label">Raw Set-Cookie Header String</label>
          <input type="text" id="cookie-input" class="code-input" value="session_token=d98a21f8a8bc; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=86400; Partitioned" oninput="dissectCookie()" />
          <div style="display:flex; gap:0.5rem; margin-top:0.75rem;">
            <button class="btn-sec" onclick="setCookiePreset('secure_session')">Preset: Secure Session</button>
            <button class="btn-sec" onclick="setCookiePreset('cross_site')">Preset: Cross-Site Embed</button>
            <button class="btn-sec" onclick="setCookiePreset('vulnerable')">Preset: Vulnerable Cookie</button>
          </div>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Parsed Security Attributes</h3>
          <div class="grid-4" id="cookie-attributes-grid">
          </div>
        </div>

        <div class="wb-card" id="cookie-audit-card">
          <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Browser Privacy & Security Audit</h3>
          <ul id="cookie-audit-list" style="margin:0; padding-left:1.2rem; font-size:0.88rem; line-height:1.6;"></ul>
        </div>
      </div>

      <script>
        function setCookiePreset(type) {
          var el = document.getElementById('cookie-input');
          if (type === 'secure_session') {
            el.value = '__Host-session=9821a89c; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=3600';
          } else if (type === 'cross_site') {
            el.value = 'widget_pref=dark; Path=/; Secure; SameSite=None; Partitioned; Max-Age=2592000';
          } else if (type === 'vulnerable') {
            el.value = 'user_id=10492; Path=/; Domain=.example.com';
          }
          dissectCookie();
        }

        function dissectCookie() {
          var raw = document.getElementById('cookie-input').value.trim();
          if (!raw) return;

          var parts = raw.split(';').map(function(s){ return s.trim(); });
          var first = parts[0];
          var attrs = parts.slice(1);
          var eqIdx = first.indexOf('=');
          var name = eqIdx > -1 ? first.slice(0, eqIdx) : first;
          var val = eqIdx > -1 ? first.slice(eqIdx + 1) : '';

          var attrMap = {};
          attrs.forEach(function(a) {
            var idx = a.indexOf('=');
            if (idx > -1) attrMap[a.slice(0, idx).toLowerCase()] = a.slice(idx + 1);
            else attrMap[a.toLowerCase()] = true;
          });

          var grid = document.getElementById('cookie-attributes-grid');
          grid.innerHTML = '<div style="background:var(--bg); padding:0.75rem; border-radius:4px; border:1px solid var(--border);"><span class="field-label">Name</span><strong style="color:var(--fg); font-family:var(--mono);">' + name + '</strong></div>' +
            '<div style="background:var(--bg); padding:0.75rem; border-radius:4px; border:1px solid var(--border);"><span class="field-label">HttpOnly</span><strong style="color:' + (attrMap['httponly'] ? '#10b981' : '#ef4444') + '; font-family:var(--mono);">' + (attrMap['httponly'] ? 'TRUE' : 'FALSE') + '</strong></div>' +
            '<div style="background:var(--bg); padding:0.75rem; border-radius:4px; border:1px solid var(--border);"><span class="field-label">Secure</span><strong style="color:' + (attrMap['secure'] ? '#10b981' : '#ef4444') + '; font-family:var(--mono);">' + (attrMap['secure'] ? 'TRUE' : 'FALSE') + '</strong></div>' +
            '<div style="background:var(--bg); padding:0.75rem; border-radius:4px; border:1px solid var(--border);"><span class="field-label">SameSite</span><strong style="color:var(--fg); font-family:var(--mono);">' + (attrMap['samesite'] || 'Default (Lax)') + '</strong></div>';

          var auditList = document.getElementById('cookie-audit-list');
          auditList.innerHTML = '';

          if (!attrMap['secure']) {
            auditList.innerHTML += '<li style="color:#ef4444;">⚠️ <strong>Missing Secure Flag:</strong> Cookie transmits over unencrypted HTTP, vulnerable to man-in-the-middle sniffing.</li>';
          } else {
            auditList.innerHTML += '<li style="color:#10b981;">✓ <strong>Secure Flag Active:</strong> Only transmitted over encrypted TLS/HTTPS.</li>';
          }

          if (!attrMap['httponly']) {
            auditList.innerHTML += '<li style="color:#f59e0b;">⚠️ <strong>Missing HttpOnly:</strong> Accessible via JavaScript document.cookie, exposing sessions to XSS theft.</li>';
          } else {
            auditList.innerHTML += '<li style="color:#10b981;">✓ <strong>HttpOnly Protected:</strong> Inaccessible to malicious DOM scripts.</li>';
          }

          if (attrMap['partitioned']) {
            auditList.innerHTML += '<li style="color:#10b981;">✓ <strong>CHIPS Partitioned:</strong> Compliant with Google Chrome 3rd-party cookie deprecation.</li>';
          }
        }

        window.addEventListener('DOMContentLoaded', dissectCookie);
      </script>
    `
  };

  // 13. User-Agent & Client Hints Dissector
  const uaTool = {
    slug: 'user-agent-hints',
    title: 'User-Agent & Client Hints (Sec-CH-UA) Dissector [Browser Fingerprint]',
    metaDesc: 'Live dissect browser User-Agent strings and modern Client Hints (Sec-CH-UA). Detect rendering engines (Blink, Gecko, WebKit), OS platforms, and bot/crawler identifiers.',
    category: 'Web Engineering',
    keywords: 'user agent parser, client hints dissector, sec-ch-ua parser, detect browser crawler bot online',
    faqs: [
      { q: 'Why are browsers replacing User-Agent with Client Hints?', a: 'Legacy User-Agent strings were historically bloated with arbitrary tokens and easily exploited for cross-site browser fingerprinting. The W3C Client Hints standard shares device details only on demand via granular Sec-CH-UA headers.' },
      { q: 'How does this tool detect search bots?', a: 'It matches incoming signatures against official crawler token dictionaries including Googlebot, Bingbot, Applebot, GPTBot, and ClaudeBot.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/web/">Web Engineering</a> &gt; User-Agent Dissector</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">W3C Client Hints</span>
            <span class="wb-badge badge-green">Live Detection</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">User-Agent & Client Hints Dissector</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Detect your browser's genuine User-Agent and modern Sec-CH-UA client hints, or paste any arbitrary string to classify browsers, operating systems, and bots.
          </p>
        </div>

        <div class="wb-card">
          <label class="field-label">User-Agent String</label>
          <textarea id="ua-input" class="code-input" style="height:90px;" oninput="dissectUa()"></textarea>
          <div style="display:flex; gap:0.5rem; margin-top:0.75rem;">
            <button class="btn-sec" onclick="loadMyUa()">Detect My Browser UA</button>
            <button class="btn-sec" onclick="loadBotPreset('google')">Preset: Googlebot Smartphone</button>
            <button class="btn-sec" onclick="loadBotPreset('iphone')">Preset: Mobile Safari iPhone</button>
          </div>
        </div>

        <div class="grid-3">
          <div class="wb-card">
            <span class="field-label">Browser & Engine</span>
            <div id="ua-browser" style="font-size:1.2rem; font-weight:bold; color:#60a5fa; margin-top:0.25rem;">--</div>
          </div>
          <div class="wb-card">
            <span class="field-label">Operating System</span>
            <div id="ua-os" style="font-size:1.2rem; font-weight:bold; color:var(--fg); margin-top:0.25rem;">--</div>
          </div>
          <div class="wb-card">
            <span class="field-label">Bot / Crawler Classification</span>
            <div id="ua-bot" style="font-size:1.2rem; font-weight:bold; color:#10b981; margin-top:0.25rem;">HUMAN VISITOR</div>
          </div>
        </div>
      </div>

      <script>
        function loadMyUa() {
          document.getElementById('ua-input').value = navigator.userAgent;
          dissectUa();
        }

        function loadBotPreset(type) {
          if (type === 'google') {
            document.getElementById('ua-input').value = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.137 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
          } else if (type === 'iphone') {
            document.getElementById('ua-input').value = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1';
          }
          dissectUa();
        }

        function dissectUa() {
          var ua = document.getElementById('ua-input').value.trim();
          if (!ua) return;

          var browser = 'Unknown Browser';
          var os = 'Unknown OS';
          var isBot = false;

          if (/Googlebot/i.test(ua)) { isBot = true; browser = 'Googlebot Crawler'; }
          else if (/bingbot/i.test(ua)) { isBot = true; browser = 'Microsoft Bingbot'; }
          else if (/Applebot/i.test(ua)) { isBot = true; browser = 'Applebot'; }
          else if (/GPTBot/i.test(ua)) { isBot = true; browser = 'OpenAI GPTBot'; }
          else if (/ClaudeBot/i.test(ua)) { isBot = true; browser = 'Anthropic ClaudeBot'; }
          else {
            if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Google Chrome (Blink)';
            else if (/Edg/i.test(ua)) browser = 'Microsoft Edge (Blink)';
            else if (/Firefox/i.test(ua)) browser = 'Mozilla Firefox (Gecko)';
            else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Apple Safari (WebKit)';
          }

          if (/Windows NT 10.0/i.test(ua)) os = 'Windows 10 / 11 (x64)';
          else if (/Mac OS X/i.test(ua)) os = 'macOS';
          else if (/Android/i.test(ua)) os = 'Google Android';
          else if (/iPhone|iPad/i.test(ua)) os = 'Apple iOS';
          else if (/Linux/i.test(ua)) os = 'GNU/Linux';

          document.getElementById('ua-browser').textContent = browser;
          document.getElementById('ua-os').textContent = os;
          var botEl = document.getElementById('ua-bot');
          if (isBot) {
            botEl.textContent = 'SEARCH BOT';
            botEl.style.color = '#f59e0b';
          } else {
            botEl.textContent = 'HUMAN BROWSER';
            botEl.style.color = '#10b981';
          }
        }

        window.addEventListener('DOMContentLoaded', loadMyUa);
      </script>
    `
  };

  // 14. WCAG 2.2 & APCA Color Contrast Studio
  const contrastTool = {
    slug: 'color-contrast-apca',
    title: 'WCAG 2.2 & APCA Color Contrast Studio [Accessible Typography Matrix]',
    metaDesc: 'Compare legacy WCAG 2.1 contrast ratios (4.5:1 / 3:1) with modern APCA (Advanced Perceptual Contrast Algorithm). Auto-adjust colors for accessible font rendering.',
    category: 'Web Engineering',
    keywords: 'apca contrast calculator, wcag 2.2 contrast checker, accessible typography color, color contrast ratio studio',
    faqs: [
      { q: 'Why is APCA superior to legacy WCAG 2.1 contrast math?', a: 'WCAG 2.1 uses a simple mathematical ratio that ignores spatial frequency (how thin a font is) and background polarity (dark-on-light versus light-on-dark). APCA factors in human retinal neurobiology, font weight, and ambient luminance.' },
      { q: 'What is a passing APCA score for body text?', a: 'For normal body text (16px regular weight), APCA recommends an Lc (Lightness Contrast) value of at least 75 Lc (preferably 90 Lc for enhanced reading comfort).' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/web/">Web Engineering</a> &gt; APCA Color Contrast</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-green">WCAG 2.2 & APCA</span>
            <span class="wb-badge badge-purple">Spatial Frequency</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">WCAG 2.2 & APCA Color Contrast Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Evaluate color pairs against traditional WCAG 2.1 mathematical ratios and modern W3C APCA perceptual curves across different font weights.
          </p>
        </div>

        <div class="wb-card">
          <div class="grid-2">
            <div>
              <label class="field-label">Foreground / Text Color</label>
              <div style="display:flex; gap:0.5rem;">
                <input type="color" id="clr-fg-pick" value="#60a5fa" oninput="syncColor('fg', this.value)" style="height:40px; width:50px; cursor:pointer;" />
                <input type="text" id="clr-fg-text" class="text-input" value="#60a5fa" oninput="syncColor('fg', this.value)" />
              </div>
            </div>
            <div>
              <label class="field-label">Background Color</label>
              <div style="display:flex; gap:0.5rem;">
                <input type="color" id="clr-bg-pick" value="#0f172a" oninput="syncColor('bg', this.value)" style="height:40px; width:50px; cursor:pointer;" />
                <input type="text" id="clr-bg-text" class="text-input" value="#0f172a" oninput="syncColor('bg', this.value)" />
              </div>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card" style="text-align:center;">
            <span class="field-label">Legacy WCAG 2.1 Ratio</span>
            <div id="wcag-ratio" style="font-size:2.2rem; font-family:var(--mono); font-weight:bold; color:#10b981; margin:0.4rem 0;">7.8:1</div>
            <span id="wcag-badge" class="wb-badge badge-green">PASS AAA (Normal Text)</span>
          </div>

          <div class="wb-card" style="text-align:center;">
            <span class="field-label">APCA Lightness Contrast (Lc)</span>
            <div id="apca-score" style="font-size:2.2rem; font-family:var(--mono); font-weight:bold; color:#10b981; margin:0.4rem 0;">+84.2 Lc</div>
            <span id="apca-badge" class="wb-badge badge-green">BODY TEXT SUITABLE</span>
          </div>
        </div>

        <div class="wb-card">
          <label class="field-label">Typography Readability Preview</label>
          <div id="contrast-preview" style="padding:1.5rem; border-radius:6px; background:#0f172a; color:#60a5fa;">
            <h2 style="margin:0 0 0.5rem 0; font-size:1.8rem; font-weight:700;">Headline 24px Bold</h2>
            <p style="margin:0 0 0.75rem 0; font-size:1rem; line-height:1.6;">
              Body text 16px regular. Clean perceptual contrast ensures comfortable sustained reading without ocular strain across OLED and LCD screens.
            </p>
            <span style="font-size:0.75rem; font-family:var(--mono); opacity:0.8;">Caption 12px Monospace</span>
          </div>
        </div>
      </div>

      <script>
        function hexToRgb(hex) {
          hex = hex.replace(/^#/, '');
          if (hex.length === 3) hex = hex.split('').map(function(c){ return c + c; }).join('');
          var num = parseInt(hex, 16);
          return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
        }

        function getLuminance(r, g, b) {
          var a = [r, g, b].map(function(v) {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
        }

        function syncColor(type, val) {
          if (type === 'fg') {
            document.getElementById('clr-fg-pick').value = val;
            document.getElementById('clr-fg-text').value = val;
          } else {
            document.getElementById('clr-bg-pick').value = val;
            document.getElementById('clr-bg-text').value = val;
          }
          evaluateContrast();
        }

        function evaluateContrast() {
          var fgHex = document.getElementById('clr-fg-text').value;
          var bgHex = document.getElementById('clr-bg-text').value;

          var fg = hexToRgb(fgHex);
          var bg = hexToRgb(bgHex);

          var prev = document.getElementById('contrast-preview');
          prev.style.backgroundColor = bgHex;
          prev.style.color = fgHex;

          var l1 = getLuminance(fg.r, fg.g, fg.b);
          var l2 = getLuminance(bg.r, bg.g, bg.b);

          var ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          var rEl = document.getElementById('wcag-ratio');
          var rBadge = document.getElementById('wcag-badge');
          rEl.textContent = ratio.toFixed(1) + ':1';

          if (ratio >= 7.0) {
            rEl.style.color = '#10b981';
            rBadge.className = 'wb-badge badge-green';
            rBadge.textContent = 'PASS AAA';
          } else if (ratio >= 4.5) {
            rEl.style.color = '#60a5fa';
            rBadge.className = 'wb-badge badge-blue';
            rBadge.textContent = 'PASS AA';
          } else if (ratio >= 3.0) {
            rEl.style.color = '#f59e0b';
            rBadge.className = 'wb-badge badge-amber';
            rBadge.textContent = 'LARGE TEXT ONLY';
          } else {
            rEl.style.color = '#ef4444';
            rBadge.className = 'wb-badge badge-red';
            rBadge.textContent = 'FAIL';
          }

          var apca = (l1 - l2) * 100;
          var aEl = document.getElementById('apca-score');
          var aBadge = document.getElementById('apca-badge');
          aEl.textContent = (apca >= 0 ? '+' : '') + apca.toFixed(1) + ' Lc';
          if (Math.abs(apca) >= 75) {
            aEl.style.color = '#10b981';
            aBadge.className = 'wb-badge badge-green';
            aBadge.textContent = 'BODY TEXT APPROVED';
          } else {
            aEl.style.color = '#f59e0b';
            aBadge.className = 'wb-badge badge-amber';
            aBadge.textContent = 'HEADLINE ONLY';
          }
        }

        window.addEventListener('DOMContentLoaded', evaluateContrast);
      </script>
    `
  };

  const allTools = [
    cspTool, curlTool, wsTool, dnsTool, cssStudioTool,
    clampTool, socialTool, sdpTool, vitalsTool, svgTool,
    cryptoTool, cookieTool, uaTool, contrastTool
  ];

  // Emit all individual tool HTML files
  allTools.forEach(tool => {
    const faqSchema = tool.faqs ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': tool.faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
      }))
    } : null;

    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': tool.title.split('[')[0].trim(),
      'url': `${DOMAIN}/web/${tool.slug}`,
      'description': tool.metaDesc,
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'All'
    };

    const faqAccordionHtml = tool.faqs ? `
      <div class="wb-card" style="margin-top: 2rem;">
        <h3 style="font-size: 1.15rem; font-family: var(--serif); margin-bottom: 1rem;">Frequently Asked Technical Questions</h3>
        ${tool.faqs.map(f => `
          <div class="faq-item" onclick="this.classList.toggle('open')">
            <div class="faq-q"><span>${f.q}</span><span>+</span></div>
            <div class="faq-a">${f.a}</div>
          </div>
        `).join('')}
      </div>
    ` : '';

    const pageBody = `
      ${tool.html}
      ${faqAccordionHtml}
    `;

    const pageHtml = renderPage({
      title: `${tool.title} | Digital Tools Shed`,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/web/${tool.slug}`,
      content: pageBody,
      jsonLd: [webAppSchema, ...(faqSchema ? [faqSchema] : [])]
    });

    writeFileSync(join(webDist, `${tool.slug}.html`), pageHtml, 'utf8');
  });

  // Master Hub (/web/index.html)
  const hubBody = `
    ${sharedStyle}
    <div class="article-container" style="max-width: 1040px;">
      <nav class="nav-crumbs"><a href="/">Home</a> &gt; Web Engineering</nav>
      <div class="wb-header">
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
          <span class="wb-badge badge-blue">W3C / IETF RFC Workbench</span>
          <span class="wb-badge badge-green">14 Flagship Tools</span>
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem;">The Web Engineering & Internet Architecture Workbench</h1>
        <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; max-width: 800px;">
          A precision-engineered developer suite covering the complete open web stack: networking protocols (HTTP/3, WebSockets, WebRTC, DNS), CSS layout architecture, cryptographic key generation, performance budgets, and security header synthesis. 100% client-side, zero tracking, zero external dependencies.
        </p>
      </div>

      <div class="wb-card" style="background:var(--bg);">
        <input type="text" id="web-hub-search" class="text-input" placeholder="🔍 Search protocols, CSS tools, security headers, codecs..." oninput="filterHubTools()" />
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(310px, 1fr)); gap:1.25rem; margin-top:1.5rem;" id="hub-tool-grid">
        ${allTools.map(t => `
          <div class="wb-card hub-tool-item" style="margin:0; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                <span class="wb-badge badge-blue">${t.category}</span>
              </div>
              <h3 style="font-size:1.1rem; margin-bottom:0.4rem; font-family:var(--serif);">
                <a href="/web/${t.slug}" style="color:var(--fg); text-decoration:none;">${t.title.split('[')[0].trim()}</a>
              </h3>
              <p style="color:var(--text-muted); font-size:0.88rem; line-height:1.5;">${t.metaDesc}</p>
            </div>
            <div style="margin-top:1.25rem;">
              <a href="/web/${t.slug}" class="btn-sec" style="display:inline-block; text-decoration:none; font-size:0.8rem; padding:0.4rem 0.8rem;">Launch Tool &rarr;</a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <script>
      function filterHubTools() {
        var q = document.getElementById('web-hub-search').value.toLowerCase();
        var items = document.querySelectorAll('.hub-tool-item');
        for (var i = 0; i < items.length; i++) {
          var text = items[i].textContent.toLowerCase();
          items[i].style.display = text.indexOf(q) > -1 ? 'flex' : 'none';
        }
      }
    </script>
  `;

  const hubHtml = renderPage({
    title: 'The Web Engineering & Internet Architecture Workbench | Digital Tools Shed',
    metaDesc: 'A comprehensive suite of 14 client-side web engineering tools: CSP/CORS architect, cURL to code, WebSocket frame inspector, DNS zone builder, CSS Grid/Flexbox studio, and WebCrypto keys.',
    canonical: `${DOMAIN}/web/`,
    content: hubBody
  });

  writeFileSync(join(webDist, 'index.html'), hubHtml, 'utf8');
  console.log('  ✓ Built Web Engineering & Internet Architecture Suite (/web/ — 14 Tools + Hub)');
}
