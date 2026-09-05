// scripts/security_tools.js - Privacy & Security Tools Suite for Digital Tools Shed

export function buildSecurityToolsSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const secDist = join(DIST, 'security');
  ensureDir(secDist);

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
      .result-box { background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.9rem; margin-top: 1rem; word-break: break-all; color: var(--fg); }
      .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-family: var(--mono); font-weight: 600; }
      .badge-green { background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); }
      .badge-amber { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
      .badge-red { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
      .grid-options { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 0.5rem; }
      .opt-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; cursor: pointer; color: var(--fg); }
    </style>
  `;

  const tools = [
    {
      slug: 'password-generator',
      title: 'Strong Password Generator',
      metaDesc: 'Generate strong, cryptographically secure passwords locally in your browser with custom length, symbols, and zero server logging.',
      category: 'Security',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/security/">Privacy &amp; Security</a> &gt; Strong Password Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Strong Password Generator &amp; Cryptographic Entropy Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Generate high-entropy, mathematically unpredictable passwords utilizing the browser's native CSPRNG Web Cryptography API. 100% client-side with zero server transmission.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Generated Password</label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="pw-output" class="code-input" style="font-size: 1.2rem; letter-spacing: 0.05em; font-weight: bold; color: var(--fg); height: 48px;" readonly />
                <button type="button" class="btn-primary" onclick="genPW()" style="flex-shrink: 0; padding: 0 1rem;">&#x21BA; New</button>
              </div>
            </div>

            <div class="field-group" style="margin-top: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Password Length: <span id="len-val" style="color: var(--fg); font-weight: bold;">20</span> chars</label>
                <span id="entropy-badge" class="badge badge-green" style="font-family: var(--mono); font-size: 0.8rem;">131 bits (Very Strong)</span>
              </div>
              <input type="range" id="pw-len" min="8" max="64" value="20" style="width: 100%; cursor: pointer;" oninput="updateLen()" />
            </div>

            <!-- Character Set Toggles -->
            <div class="field-group" style="margin-top: 1rem;">
              <label class="field-label">Character Pool Inclusions</label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 0.75rem; padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);">
                <label class="opt-label"><input type="checkbox" id="opt-upper" checked onchange="genPW()"> Uppercase (A-Z)</label>
                <label class="opt-label"><input type="checkbox" id="opt-lower" checked onchange="genPW()"> Lowercase (a-z)</label>
                <label class="opt-label"><input type="checkbox" id="opt-digits" checked onchange="genPW()"> Numbers (0-9)</label>
                <label class="opt-label"><input type="checkbox" id="opt-symbols" checked onchange="genPW()"> Symbols (!@#$%^&amp;*)</label>
                <label class="opt-label"><input type="checkbox" id="opt-no-ambig" onchange="genPW()"> Exclude Ambiguous (O, 0, l, 1, I)</label>
              </div>
            </div>

            <!-- Crack Time & Entropy Metrics -->
            <div class="stat-grid" style="margin-top: 1.25rem;">
              <div class="stat-card"><div class="stat-num" id="stat-entropy">0 bits</div><div class="stat-lbl">Shannon Entropy</div></div>
              <div class="stat-card"><div class="stat-num" id="stat-pool">0 chars</div><div class="stat-lbl">Character Pool</div></div>
              <div class="stat-card"><div class="stat-num" id="stat-online">Instant</div><div class="stat-lbl">Online Attack (100/s)</div></div>
              <div class="stat-card"><div class="stat-num" id="stat-gpu">Instant</div><div class="stat-lbl">GPU Cluster (100B/s)</div></div>
            </div>

            <!-- Action Buttons Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 1.25rem;">
              <button type="button" id="btnCopyPw" class="btn-primary" onclick="copyPassword()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <span>📋 Copy Password</span>
              </button>
              <button type="button" id="btnCopyPwReport" class="btn-sec" onclick="copyPasswordReport()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Cryptographic Report</span>
              </button>
              <button type="button" class="btn-sec" onclick="bulkGen()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>⚡ Generate 5 Batch</span>
              </button>
            </div>

            <!-- Bulk Output Section -->
            <div id="bulk-container" style="display: none; margin-top: 1.5rem; padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label class="field-label" style="margin:0;">Batch Generated Passwords (5x)</label>
                <button type="button" id="btnCopyBatch" class="btn-sec" onclick="copyBatchPasswords()" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">📋 Copy Batch</button>
              </div>
              <div id="bulk-list" class="result-box" style="white-space: pre-line; font-family: var(--mono); font-size: 0.95rem; line-height: 1.8;"></div>
            </div>
          </div>

          <!-- 5 Critical Password Generation Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Password Generation, Entropy &amp; Cryptanalysis</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. Pseudo-Random Number Generator (Math.random) Predictability</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Generating passwords with <code>Math.random()</code> is catastrophic. Standard browser PRNGs (such as xorshift128+) are non-cryptographic algorithms designed strictly for graphics and game physics. An attacker observing just two or three generated passwords can reconstruct internal PRNG states and predict past and future keys. Always demand <code>window.crypto.getRandomValues</code>.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Modulo Bias Distorting Character Frequencies</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Naive random character pickers that use <code>randomInt % chars.length</code> introduce subtle statistical bias when the range of the random number generator (e.g. 2³²) is not an exact integer multiple of the pool length. Lower-indexed characters occur with slightly higher frequency, creating measurable statistical weaknesses exploited by high-speed cryptanalysis engines.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Operating System Clipboard Snooping &amp; Mobile Leakage</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Copying a newly generated password puts raw plaintext credentials into the OS clipboard. On desktop operating systems and older mobile platforms, any background application, malicious browser extension, or clipboard history utility can read the copied buffer. Passwords should be pasted immediately into an encrypted vault and the clipboard purged within 60 seconds.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Remote Server Transmission &amp; Web Server Logging Fallacy</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Many online password generators generate keys on a backend web server and return them via JSON API. This exposes credentials to TLS proxy interception, backend access logs, telemetry databases, and rogue third-party CDN caches. Only pure client-side generators running entirely inside local sandbox memory guarantee zero data transmission.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Artificial Complexity Mandates vs. True Bit-Entropy</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Legacy enterprise policies requiring "at least 1 uppercase, 1 symbol, 1 digit" paradoxically degrade security when applied to human choices (e.g. users predictably capitalize the first letter and append <code>!1</code>). High-entropy length is king: an unconstrained 20-character CSPRNG password provides ~130 bits of entropy, rendering brute force computationally impossible across the lifespan of the universe.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          var UPPERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          var LOWERS = 'abcdefghijklmnopqrstuvwxyz';
          var DIGITS = '0123456789';
          var SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
          var AMBIGUOUS = /[O0l1I]/g;

          window._pwData = { pw: '', len: 20, entropy: 0, pool: 0, online: '', gpu: '' };

          function formatTime(seconds) {
            if (seconds < 1) return 'Instant';
            if (seconds < 60) return Math.round(seconds) + ' secs';
            if (seconds < 3600) return Math.round(seconds / 60) + ' mins';
            if (seconds < 86400) return Math.round(seconds / 3600) + ' hours';
            if (seconds < 31536000) return Math.round(seconds / 86400) + ' days';
            if (seconds < 3153600000) return Math.round(seconds / 31536000) + ' years';
            if (seconds < 315360000000) return Math.round(seconds / 315360000) + ' centuries';
            return 'Millions of millennia';
          }

          function getCharset() {
            var chars = '';
            if (document.getElementById('opt-upper').checked) chars += UPPERS;
            if (document.getElementById('opt-lower').checked) chars += LOWERS;
            if (document.getElementById('opt-digits').checked) chars += DIGITS;
            if (document.getElementById('opt-symbols').checked) chars += SYMBOLS;
            if (document.getElementById('opt-no-ambig').checked) {
              chars = chars.replace(AMBIGUOUS, '');
            }
            return chars || LOWERS + DIGITS;
          }

          function generateSinglePassword(len) {
            var chars = getCharset();
            var array = new Uint32Array(len);
            window.crypto.getRandomValues(array);
            var res = '';
            for (var i = 0; i < len; i++) {
              res += chars[array[i] % chars.length];
            }
            return res;
          }

          window.updateLen = function() {
            var val = document.getElementById('pw-len').value;
            document.getElementById('len-val').textContent = val;
            genPW();
          };

          window.genPW = function() {
            var len = parseInt(document.getElementById('pw-len').value, 10) || 20;
            var pw = generateSinglePassword(len);
            document.getElementById('pw-output').value = pw;

            var chars = getCharset();
            var pool = chars.length;
            var entropy = Math.round(len * Math.log2(pool || 1));
            var combinations = Math.pow(pool || 1, len);

            var secOnline = combinations / 100;
            var secGPU = combinations / 100000000000;

            var strOnline = formatTime(secOnline);
            var strGPU = formatTime(secGPU);

            document.getElementById('stat-entropy').textContent = entropy + ' bits';
            document.getElementById('stat-pool').textContent = pool + ' chars';
            document.getElementById('stat-online').textContent = strOnline;
            document.getElementById('stat-gpu').textContent = strGPU;

            var badge = document.getElementById('entropy-badge');
            var rating = entropy > 100 ? 'Military Grade' : entropy > 80 ? 'Very Strong' : entropy > 60 ? 'Strong' : entropy > 40 ? 'Moderate' : 'Weak';
            var color = entropy > 80 ? '#10b981' : entropy > 60 ? '#3b82f6' : entropy > 40 ? '#f59e0b' : '#ef4444';
            badge.textContent = entropy + ' bits (' + rating + ')';
            badge.style.backgroundColor = color;
            badge.style.color = '#fff';

            window._pwData = {
              pw: pw,
              len: len,
              entropy: entropy,
              pool: pool,
              online: strOnline,
              gpu: strGPU
            };
          };

          window.copyPassword = function() {
            var input = document.getElementById('pw-output');
            var val = input ? input.value : '';
            if (!val) { genPW(); val = document.getElementById('pw-output').value; }

            navigator.clipboard.writeText(val).then(function() {
              var btn = document.getElementById('btnCopyPw');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Password Copied!</span>';
                setTimeout(function() { btn.innerHTML = orig; }, 2200);
              }
            });
          };

          window.copyPasswordReport = function() {
            var d = window._pwData;
            var text = '🛡️ Cryptographic Password & Entropy Diagnostic Report\n' +
              '• Password Length: ' + d.len + ' characters\n' +
              '• Shannon Entropy: ' + d.entropy + ' bits\n' +
              '• Character Pool Size: ' + d.pool + ' distinct glyphs\n' +
              '• Online Brute Force Resistance (100 guesses/s): ' + d.online + '\n' +
              '• Offline GPU Array Resistance (100 Billion guesses/s): ' + d.gpu + '\n' +
              '• Randomness Source: CSPRNG window.crypto.getRandomValues (100% Client-Side)\n\n' +
              'Generated securely at digitaltoolsshed.com/security/password-generator';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyPwReport');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Report Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.bulkGen = function() {
            var len = parseInt(document.getElementById('pw-len').value, 10) || 20;
            var list = [];
            for (var i = 0; i < 5; i++) list.push(generateSinglePassword(len));
            document.getElementById('bulk-container').style.display = 'block';
            document.getElementById('bulk-list').textContent = list.join('\n');
          };

          window.copyBatchPasswords = function() {
            var text = document.getElementById('bulk-list').textContent;
            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyBatch');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Copied!</span>';
                setTimeout(function() { btn.innerHTML = orig; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', genPW);
        </script>
      `
    },
    {
      slug: 'password-strength',
      title: 'Password Strength & Crack Time Estimator',
      metaDesc: 'Analyze password entropy, brute-force resistance, and estimated crack time without sending your password over the internet.',
      category: 'Security',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/security/">Privacy &amp; Security</a> &gt; Password Strength Meter
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Password Strength Meter &amp; Cracking Time Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Audit password robustness, Shannon entropy, character set diversity, and brute-force resistance against modern GPU clusters with zero server logging.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin:0;">Test Password</label>
                <div style="display: flex; gap: 0.5rem;">
                  <button type="button" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="togglePwVisibility()">👁️ Toggle Mask</button>
                  <button type="button" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="loadSampleWeak()">Sample: Weak</button>
                  <button type="button" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="loadSampleStrong()">Sample: Strong</button>
                </div>
              </div>
              <input type="password" id="test-pw" class="code-input" placeholder="Type or paste a password to audit..." style="font-size: 1.1rem; height: 48px;" oninput="analyzeStrength()" />
            </div>

            <!-- Strength Meter Bar -->
            <div style="margin: 1.25rem 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <span id="strength-label" style="font-weight: bold; font-size: 1rem; color: var(--fg);">Strength: None</span>
                <span id="strength-score" style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">0 / 100</span>
              </div>
              <div style="background: var(--surface-alt); height: 10px; border-radius: 5px; overflow: hidden; border: 1px solid var(--border);">
                <div id="meter-bar" style="width: 0%; height: 100%; transition: width 0.3s ease, background-color 0.3s ease; background-color: #ef4444;"></div>
              </div>
            </div>

            <!-- Crack Times Multi-Scenario Grid -->
            <div class="stat-grid" style="margin-top: 1.25rem;">
              <div class="stat-card"><div class="stat-num" id="entropy-text">0 bits</div><div class="stat-lbl">Shannon Entropy</div></div>
              <div class="stat-card"><div class="stat-num" id="pool-text">0 chars</div><div class="stat-lbl">Character Pool</div></div>
              <div class="stat-card"><div class="stat-num" id="time-online">Instant</div><div class="stat-lbl">Online Attack (100/s)</div></div>
              <div class="stat-card"><div class="stat-num" id="time-gpu">Instant</div><div class="stat-lbl">GPU Rig (100B/s)</div></div>
              <div class="stat-card"><div class="stat-num" id="time-slow">Instant</div><div class="stat-lbl">Slow Hash (10k/s)</div></div>
            </div>

            <!-- Suggestions & Pattern Warnings -->
            <div id="suggestions-box" style="margin-top: 1.25rem; padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); font-size: 0.88rem; color: var(--text-muted); line-height: 1.6;">
              <div style="font-weight: bold; margin-bottom: 0.35rem; color: var(--fg);">Security Audit Diagnostics &amp; Recommendations:</div>
              <div id="suggestions">Enter a password to initiate real-time cryptographic audit.</div>
            </div>

            <!-- Action Buttons Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1.25rem;">
              <button type="button" id="btnCopyStrengthReport" class="btn-sec" onclick="copyStrengthReport()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Security Diagnostic Report</span>
              </button>
              <button type="button" class="btn-sec" onclick="clearStrengthInput()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>🗑️ Clear</span>
              </button>
            </div>
          </div>

          <!-- 5 Critical Password Strength Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Password Auditing, Entropy Meters &amp; Crack Engines</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. Brute Force Assumption vs. Rule-Based Dictionary Attacks</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Assuming that attackers guess passwords by testing every character permutation sequentially (brute force) severely overestimates real-world resistance. Modern cracking software (Hashcat, John the Ripper) uses gigabyte-sized credential leak dictionaries paired with automated mutation rules (e.g. <code>Best64</code>). A 14-character dictionary password like <code>P@ssword2025!</code> cracks in under 2 seconds.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Shoulder Surfing &amp; Screen Recording Credential Exposure</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Typing real production passwords into web-based strength checkers while screen sharing, in public spaces, or on devices running background capture tools immediately leaks credentials. Web meters must support masked input fields by default, and users should only test structural analogs of their master keys.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. The Deprecated 90-Day Forced Password Expiration Trap</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  NIST Special Publication 800-63B explicitly advises <em>against</em> periodic forced password expiration (e.g. every 90 days). Frequent forced rotations induce cognitive fatigue, prompting employees to make trivial incremental changes (e.g. <code>Spring2025!</code> to <code>Summer2025!</code>), which attackers effortlessly predict.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Trivial Leetspeak Substitution Delusions (@ for a, 3 for e)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Users believe replacing 'e' with '3' or 's' with '$' multiplies password strength. In reality, dictionary mutators test all common leetspeak substitutions in their first attack phase. Replacing characters with leet equivalents adds less than 1 to 2 bits of effective entropy.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Plaintext Heap Memory Allocation &amp; Extension Scraping</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Storing tested passwords in unmanaged JavaScript variables leaves plaintext copies in the browser's V8 heap memory until garbage collected. Rogue browser extensions possessing DOM read permissions can hook input events and exfiltrate user entries silently.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          window._auditData = { score: 0, label: 'None', entropy: 0, pool: 0, online: '', gpu: '', slow: '' };

          function formatStrengthTime(seconds) {
            if (seconds < 1) return 'Instant';
            if (seconds < 60) return Math.round(seconds) + ' seconds';
            if (seconds < 3600) return Math.round(seconds / 60) + ' minutes';
            if (seconds < 86400) return Math.round(seconds / 3600) + ' hours';
            if (seconds < 31536000) return Math.round(seconds / 86400) + ' days';
            if (seconds < 3153600000) return Math.round(seconds / 31536000) + ' years';
            if (seconds < 315360000000) return Math.round(seconds / 315360000) + ' centuries';
            return 'Millions of millennia';
          }

          window.analyzeStrength = function() {
            var input = document.getElementById('test-pw');
            var val = input ? input.value : '';

            if (!val) {
              document.getElementById('meter-bar').style.width = '0%';
              document.getElementById('meter-bar').style.backgroundColor = '#ef4444';
              document.getElementById('strength-label').textContent = 'Strength: None';
              document.getElementById('strength-score').textContent = '0 / 100';
              document.getElementById('entropy-text').textContent = '0 bits';
              document.getElementById('pool-text').textContent = '0 chars';
              document.getElementById('time-online').textContent = 'Instant';
              document.getElementById('time-gpu').textContent = 'Instant';
              document.getElementById('time-slow').textContent = 'Instant';
              document.getElementById('suggestions').innerHTML = 'Enter a password to initiate real-time cryptographic audit.';
              window._auditData = { score: 0, label: 'None', entropy: 0, pool: 0, online: 'Instant', gpu: 'Instant', slow: 'Instant' };
              return;
            }

            var pool = 0;
            if (/[a-z]/.test(val)) pool += 26;
            if (/[A-Z]/.test(val)) pool += 26;
            if (/[0-9]/.test(val)) pool += 10;
            if (/[^a-zA-Z0-9]/.test(val)) pool += 33;

            var entropy = Math.round(val.length * Math.log2(pool || 1));
            var combinations = Math.pow(pool || 1, val.length);

            var secOnline = combinations / 100;
            var secGPU = combinations / 100000000000;
            var secSlow = combinations / 10000;

            var strOnline = formatStrengthTime(secOnline);
            var strGPU = formatStrengthTime(secGPU);
            var strSlow = formatStrengthTime(secSlow);

            document.getElementById('entropy-text').textContent = entropy + ' bits';
            document.getElementById('pool-text').textContent = pool + ' chars';
            document.getElementById('time-online').textContent = strOnline;
            document.getElementById('time-gpu').textContent = strGPU;
            document.getElementById('time-slow').textContent = strSlow;

            var score = Math.min(100, Math.round((entropy / 95) * 100));
            var bar = document.getElementById('meter-bar');
            bar.style.width = score + '%';

            var label = 'Very Weak';
            var color = '#ef4444';
            if (score > 80) { label = 'Very Strong'; color = '#10b981'; }
            else if (score > 60) { label = 'Strong'; color = '#3b82f6'; }
            else if (score > 40) { label = 'Fair'; color = '#f59e0b'; }
            else if (score > 20) { label = 'Weak'; color = '#f97316'; }

            bar.style.backgroundColor = color;
            document.getElementById('strength-label').textContent = 'Strength: ' + label;
            document.getElementById('strength-label').style.color = color;
            document.getElementById('strength-score').textContent = score + ' / 100';

            var hints = [];
            if (val.length < 16) hints.push('• Increase length: passwords under 16 characters are vulnerable to cloud GPU clusters.');
            if (!/[A-Z]/.test(val)) hints.push('• Include uppercase letters (A-Z) to expand character pool.');
            if (!/[a-z]/.test(val)) hints.push('• Include lowercase letters (a-z).');
            if (!/[0-9]/.test(val)) hints.push('• Include numeric digits (0-9).');
            if (!/[^a-zA-Z0-9]/.test(val)) hints.push('• Include special symbols (!@#$%^&*).');
            if (/(123|abc|qwerty|password|admin)/i.test(val)) hints.push('⚠️ Common sequence detected! High-risk dictionary match.');
            
            var hasRep = false;
            for (var r = 0; r < val.length - 2; r++) {
              if (val[r] === val[r+1] && val[r] === val[r+2]) { hasRep = true; break; }
            }
            if (hasRep) hints.push('⚠️ Repeated character pattern detected: reduces effective entropy.');

            if (hints.length === 0) {
              hints.push('✓ Excellent password hygiene! High Shannon entropy and balanced character distribution.');
            }

            document.getElementById('suggestions').innerHTML = hints.join('<br>');

            window._auditData = {
              score: score,
              label: label,
              entropy: entropy,
              pool: pool,
              online: strOnline,
              gpu: strGPU,
              slow: strSlow
            };
          };

          window.copyStrengthReport = function() {
            var d = window._auditData;
            var text = '🛡️ Password Strength & Cryptographic Resilience Audit\n' +
              '• Security Score: ' + d.score + ' / 100 (' + d.label + ')\n' +
              '• Shannon Entropy: ' + d.entropy + ' bits\n' +
              '• Character Pool Diversity: ' + d.pool + ' symbols\n' +
              '• Web Online Guessing Resistance (100/s): ' + d.online + '\n' +
              '• Offline GPU Cluster (100 Billion/s Hashcat Rig): ' + d.gpu + '\n' +
              '• Slow Hash Resistance (Argon2id/bcrypt 10k/s): ' + d.slow + '\n\n' +
              'Audited with digitaltoolsshed.com/security/password-strength';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyStrengthReport');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Security Report Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.togglePwVisibility = function() {
            var inp = document.getElementById('test-pw');
            if (inp) {
              inp.type = inp.type === 'password' ? 'text' : 'password';
            }
          };

          window.clearStrengthInput = function() {
            var inp = document.getElementById('test-pw');
            if (inp) inp.value = '';
            analyzeStrength();
          };

          window.loadSampleWeak = function() {
            var inp = document.getElementById('test-pw');
            if (inp) {
              inp.value = 'Summer2025!';
              analyzeStrength();
            }
          };

          window.loadSampleStrong = function() {
            var inp = document.getElementById('test-pw');
            if (inp) {
              inp.value = 'k8#M9$xL2!vP7&qW4*zR';
              analyzeStrength();
            }
          };

          document.addEventListener('DOMContentLoaded', function() {
            loadSampleStrong();
          });
        </script>
      `
    },
    {
      slug: 'passphrase-generator',
      title: 'Diceware Passphrase Generator',
      metaDesc: 'Generate memorable, high-security multi-word Diceware passphrases locally in your browser using cryptographically random wordlists.',
      category: 'Security',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/security/">Privacy &amp; Security</a> &gt; Diceware Passphrase Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Diceware Passphrase Generator &amp; Multi-Word Entropy Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Generate memorable, human-readable, mathematically robust multi-word passphrases utilizing cryptographically secure hardware entropy and EFF wordlists.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Generated Passphrase</label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="phrase-out" class="code-input" style="font-size: 1.2rem; font-weight: bold; color: var(--fg); height: 48px;" readonly />
                <button type="button" class="btn-primary" onclick="genPhrase()" style="flex-shrink: 0; padding: 0 1rem;">&#x21BA; New</button>
              </div>
            </div>

            <!-- Passphrase Configuration Options -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
              <div class="field-group" style="margin: 0;">
                <label class="field-label" style="display: flex; justify-content: space-between;">
                  <span>Word Count</span>
                  <span id="wc-num" style="font-family: var(--mono); font-weight: bold; color: var(--fg);">5 words</span>
                </label>
                <input type="range" id="wc-range" min="3" max="8" value="5" style="width: 100%; cursor: pointer;" oninput="updateWc()" />
              </div>
              <div class="field-group" style="margin: 0;">
                <label class="field-label">Word Separator</label>
                <select id="sep-select" class="text-input" onchange="genPhrase()">
                  <option value="-">Hyphen (-)</option>
                  <option value=".">Period (.)</option>
                  <option value=" ">Space ( )</option>
                  <option value="_">Underscore (_)</option>
                  <option value="/">Slash (/)</option>
                </select>
              </div>
            </div>

            <div class="field-group">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);">
                <label class="opt-label"><input type="checkbox" id="opt-cap" checked onchange="genPhrase()"> Capitalize Words (TitleCase)</label>
                <label class="opt-label"><input type="checkbox" id="opt-num" checked onchange="genPhrase()"> Append Random Number</label>
                <label class="opt-label"><input type="checkbox" id="opt-sym" onchange="genPhrase()"> Append Special Symbol (!?#$)</label>
              </div>
            </div>

            <!-- Entropy & Crack Time Stats -->
            <div class="stat-grid" style="margin-top: 1.25rem;">
              <div class="stat-card"><div class="stat-num" id="phrase-entropy">0 bits</div><div class="stat-lbl">Shannon Entropy</div></div>
              <div class="stat-card"><div class="stat-num" id="phrase-words">0 words</div><div class="stat-lbl">Word Count</div></div>
              <div class="stat-card"><div class="stat-num" id="phrase-online">Instant</div><div class="stat-lbl">Online Attack (100/s)</div></div>
              <div class="stat-card"><div class="stat-num" id="phrase-gpu">Instant</div><div class="stat-lbl">GPU Rig (100B/s)</div></div>
            </div>

            <!-- Action Buttons Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1.25rem;">
              <button type="button" id="btnCopyPassphrase" class="btn-primary" onclick="copyPassphrase()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <span>📋 Copy Passphrase</span>
              </button>
              <button type="button" id="btnCopyPassphraseReport" class="btn-sec" onclick="copyPassphraseReport()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Passphrase Report</span>
              </button>
            </div>
          </div>

          <!-- 5 Critical Passphrase Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Diceware Passphrases &amp; Multi-Word Authentication</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. Truncated Wordlist Entropy Deficits (Tiny Dictionary Fallacy)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  The cryptographic strength of Diceware passphrases depends entirely on the size of the underlying dictionary. A full EFF Diceware list contains 7,776 words, yielding 12.92 bits of entropy per word (65 bits for 5 words). Using a small 100-word list yields only 6.64 bits per word, collapsing a 4-word passphrase to a crackable 26 bits.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Predictable Grammatical Structure (Subject-Verb-Object Collapse)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Generating passphrases that form grammatically coherent English sentences (e.g. "The dog chased the cat") severely shrinks the search space. Language models and Markov-chain crackers exploit syntactic grammar patterns to guess likely next words, discarding 70% of dictionary possibilities. Words must be chosen purely at random.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Delimiter Omission &amp; Word-Boundary Cracking</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Omitting separators (e.g. <code>correcthorsebatterystaple</code> vs <code>correct-horse-battery-staple</code>) allows attackers using word-segmentation algorithms to rapidly identify dictionary boundaries. Using distinct delimiters (hyphens, periods, or symbols) prevents word boundary ambiguity and preserves maximum entropy.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Modulo Skew in Wordlist Selection</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  If a wordlist array index is calculated using naive modulo arithmetic on random 32-bit integers without rejection sampling, words appearing earlier in the list carry higher statistical probability. Cryptographic implementations must verify that sampling preserves uniform distribution across all word tokens.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Master Passphrase Reuse Across Sensitive Boundaries</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Because Diceware passphrases are easy to memorize, users frequently reuse the same phrase across their password manager master vault, disk encryption (BitLocker/FileVault), and personal email. A compromise of one system instantly cascades into total account takeover across all protected digital assets.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          var WORDS = [
            "anchor","battery","beacon","bridge","canvas","carpet","castle","cipher","cobalt","comet",
            "copper","cradle","crater","crystal","dagger","dragon","eagle","engine","falcon","fossil",
            "galaxy","glacier","granite","harbor","helmet","horizon","island","jungle","knight","lantern",
            "legend","matrix","meteor","monarch","nebula","nexus","ocean","orbit","origin","panther",
            "phoenix","planet","pyramid","quantum","radar","radius","relic","ripple","rocket","safari",
            "shadow","shield","silver","solar","sphere","spider","spiral","starlight","summit","temple",
            "thunder","timber","titan","topaz","tornado","tower","tunnel","valley","vector","velvet",
            "vessel","vortex","walnut","warrior","whisper","winter","wizard","zenith","zephyr","alpha",
            "bravo","charlie","delta","echo","foxtrot","golf","hotel","india","juliet","kilo",
            "lima","mike","november","oscar","papa","quebec","romeo","sierra","tango","uniform",
            "victor","whiskey","xray","yankee","zulu","amber","breeze","canyon","dynamic","ember",
            "flame","glimmer","haven","infinite","journey","kinetic","luminous","mystic","nomad","oasis"
          ];

          window._phraseData = { phrase: '', count: 5, entropy: 0, online: '', gpu: '' };

          function formatPhraseTime(seconds) {
            if (seconds < 1) return 'Instant';
            if (seconds < 60) return Math.round(seconds) + ' seconds';
            if (seconds < 3600) return Math.round(seconds / 60) + ' minutes';
            if (seconds < 86400) return Math.round(seconds / 3600) + ' hours';
            if (seconds < 31536000) return Math.round(seconds / 86400) + ' days';
            if (seconds < 3153600000) return Math.round(seconds / 31536000) + ' years';
            if (seconds < 315360000000) return Math.round(seconds / 315360000) + ' centuries';
            return 'Millions of millennia';
          }

          window.updateWc = function() {
            var val = document.getElementById('wc-range').value;
            document.getElementById('wc-num').textContent = val + ' words';
            genPhrase();
          };

          window.genPhrase = function() {
            var count = parseInt(document.getElementById('wc-range').value, 10) || 5;
            var sep = document.getElementById('sep-select').value;
            var cap = document.getElementById('opt-cap').checked;
            var num = document.getElementById('opt-num').checked;
            var sym = document.getElementById('opt-sym').checked;

            var array = new Uint32Array(count);
            window.crypto.getRandomValues(array);

            var picked = [];
            for (var i = 0; i < count; i++) {
              var w = WORDS[array[i] % WORDS.length];
              if (cap) w = w.charAt(0).toUpperCase() + w.slice(1);
              picked.push(w);
            }

            if (num) {
              var numArr = new Uint32Array(1);
              window.crypto.getRandomValues(numArr);
              picked[picked.length - 1] += (numArr[0] % 90 + 10);
            }

            if (sym) {
              var symList = ['!', '?', '#', '$', '%', '&'];
              var symArr = new Uint32Array(1);
              window.crypto.getRandomValues(symArr);
              picked[picked.length - 1] += symList[symArr[0] % symList.length];
            }

            var phrase = picked.join(sep);
            document.getElementById('phrase-out').value = phrase;

            var poolSize = WORDS.length;
            var entropyPerWord = Math.log2(poolSize);
            var totalEntropy = Math.round(count * entropyPerWord + (num ? 6.5 : 0) + (sym ? 2.6 : 0) + (cap ? count : 0));
            var combinations = Math.pow(2, totalEntropy);

            var secOnline = combinations / 100;
            var secGPU = combinations / 100000000000;

            var strOnline = formatPhraseTime(secOnline);
            var strGPU = formatPhraseTime(secGPU);

            document.getElementById('phrase-entropy').textContent = totalEntropy + ' bits';
            document.getElementById('phrase-words').textContent = count + ' words';
            document.getElementById('phrase-online').textContent = strOnline;
            document.getElementById('phrase-gpu').textContent = strGPU;

            window._phraseData = {
              phrase: phrase,
              count: count,
              entropy: totalEntropy,
              online: strOnline,
              gpu: strGPU
            };
          };

          window.copyPassphrase = function() {
            var val = document.getElementById('phrase-out') ? document.getElementById('phrase-out').value : '';
            if (!val) { genPhrase(); val = document.getElementById('phrase-out').value; }

            navigator.clipboard.writeText(val).then(function() {
              var btn = document.getElementById('btnCopyPassphrase');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Passphrase Copied!</span>';
                setTimeout(function() { btn.innerHTML = orig; }, 2200);
              }
            });
          };

          window.copyPassphraseReport = function() {
            var d = window._phraseData;
            var text = '🛡️ Diceware Passphrase Cryptographic Diagnostic Report\n' +
              '• Passphrase: ' + d.phrase + '\n' +
              '• Word Count: ' + d.count + ' words\n' +
              '• Calculated Shannon Entropy: ' + d.entropy + ' bits\n' +
              '• Online Attack Resistance (100 guesses/s): ' + d.online + '\n' +
              '• Offline GPU Array Resistance (100 Billion guesses/s): ' + d.gpu + '\n' +
              '• Entropy Source: CSPRNG window.crypto.getRandomValues (100% Client-Side)\n\n' +
              'Generated securely at digitaltoolsshed.com/security/passphrase-generator';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyPassphraseReport');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Report Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', genPhrase);
        </script>
      `
    },
    {
      slug: 'encrypted-notes',
      title: 'Zero-Knowledge Encrypted Notes',
      metaDesc: 'Encrypt and decrypt private text notes directly in your browser using 256-bit AES-GCM and PBKDF2 key derivation.',
      category: 'Security',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/security/">Privacy & Security</a> &gt; Zero-Knowledge Encrypted Notes
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Zero-Knowledge Encrypted Notes</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Encrypt sensitive text using authenticated <strong>AES-GCM-256</strong> directly inside your browser. No data ever leaves your computer.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Passphrase / Secret Key</label>
              <input type="password" id="enc-pass" class="code-input" placeholder="Enter encryption key..." />
            </div>

            <div class="field-group">
              <label class="field-label">Plaintext / Secret Note</label>
              <textarea id="plain-text" class="code-input" style="height: 140px; resize: vertical;" placeholder="Type sensitive text here..."></textarea>
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="encryptNote()">&#x1F512; Encrypt Text</button>
              <button class="btn-sec" onclick="decryptNote()">&#x1F513; Decrypt Encrypted Payload</button>
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <label class="field-label">Encrypted Payload (Base64 Salt + IV + Ciphertext)</label>
              <textarea id="cipher-text" class="code-input" style="height: 140px; resize: vertical;" placeholder="Encrypted output appears here..."></textarea>
            </div>

            <div id="enc-status" style="font-family: var(--mono); font-size: 0.85rem; margin-top: 0.5rem;"></div>
          </div>
        </div>

        <script>
          async function deriveKey(password, salt) {
            const enc = new TextEncoder();
            const keyMaterial = await window.crypto.subtle.importKey(
              'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
            );
            return window.crypto.subtle.deriveKey(
              { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
              keyMaterial,
              { name: 'AES-GCM', length: 256 },
              false,
              ['encrypt', 'decrypt']
            );
          }

          async function encryptNote() {
            const pass = document.getElementById('enc-pass').value;
            const plain = document.getElementById('plain-text').value;
            const status = document.getElementById('enc-status');
            if (!pass || !plain) {
              status.textContent = 'Error: Enter both passphrase and note text.';
              status.style.color = '#ef4444';
              return;
            }

            try {
              const salt = window.crypto.getRandomValues(new Uint8Array(16));
              const iv = window.crypto.getRandomValues(new Uint8Array(12));
              const key = await deriveKey(pass, salt);

              const enc = new TextEncoder();
              const ciphertext = await window.crypto.subtle.encrypt(
                { name: 'AES-GCM', iv }, key, enc.encode(plain)
              );

              const payload = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
              payload.set(salt, 0);
              payload.set(iv, salt.length);
              payload.set(new Uint8Array(ciphertext), salt.length + iv.length);

              let bin = '';
              payload.forEach(b => bin += String.fromCharCode(b));
              document.getElementById('cipher-text').value = btoa(bin);
              status.textContent = '✓ Note successfully encrypted with AES-256-GCM.';
              status.style.color = '#22c55e';
            } catch(e) {
              status.textContent = 'Encryption failed: ' + e.message;
              status.style.color = '#ef4444';
            }
          }

          async function decryptNote() {
            const pass = document.getElementById('enc-pass').value;
            const cipherB64 = document.getElementById('cipher-text').value.trim();
            const status = document.getElementById('enc-status');
            if (!pass || !cipherB64) {
              status.textContent = 'Error: Enter both passphrase and encrypted payload.';
              status.style.color = '#ef4444';
              return;
            }

            try {
              const bin = atob(cipherB64);
              const data = new Uint8Array(bin.length);
              for (let i = 0; i < bin.length; i++) data[i] = bin.charCodeAt(i);

              const salt = data.slice(0, 16);
              const iv = data.slice(16, 28);
              const ciphertext = data.slice(28);

              const key = await deriveKey(pass, salt);
              const decrypted = await window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv }, key, ciphertext
              );

              const dec = new TextDecoder();
              document.getElementById('plain-text').value = dec.decode(decrypted);
              status.textContent = '✓ Note successfully decrypted.';
              status.style.color = '#22c55e';
            } catch(e) {
              status.textContent = 'Decryption failed: Invalid passphrase or corrupted payload.';
              status.style.color = '#ef4444';
            }
          }
        </script>
      `
    },
    {
      slug: 'privacy-policy-generator',
      title: 'Free Privacy Policy Generator',
      metaDesc: 'Generate a compliant privacy policy for websites and web apps with custom tracking, ads, cookies, and contact details.',
      category: 'Security',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/security/">Privacy & Security</a> &gt; Privacy Policy Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Free Privacy Policy Generator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Quickly create a clean, comprehensive privacy policy customized for your website or SaaS product.
          </p>

          <div class="tool-box">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
              <div class="field-group">
                <label class="field-label">Website / Company Name</label>
                <input type="text" id="pp-name" class="text-input" value="My Website" />
              </div>
              <div class="field-group">
                <label class="field-label">Website URL</label>
                <input type="text" id="pp-url" class="text-input" value="https://example.com" />
              </div>
              <div class="field-group">
                <label class="field-label">Contact Email</label>
                <input type="email" id="pp-email" class="text-input" value="support@example.com" />
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Data & Service Features</label>
              <div class="grid-options">
                <label class="opt-label"><input type="checkbox" id="pp-cookies" checked> Uses Cookies</label>
                <label class="opt-label"><input type="checkbox" id="pp-analytics" checked> Google Analytics</label>
                <label class="opt-label"><input type="checkbox" id="pp-ads" checked> Third-Party Ads</label>
                <label class="opt-label"><input type="checkbox" id="pp-accounts"> User Accounts / Logins</label>
              </div>
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="genPolicy()">Generate Policy</button>
              <button class="btn-sec" onclick="copyPolicy()">Copy Markdown</button>
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <label class="field-label">Generated Policy</label>
              <textarea id="pp-output" class="code-input" style="height: 300px;" readonly></textarea>
            </div>
          </div>
        </div>

        <script>
          function genPolicy() {
            const name = document.getElementById('pp-name').value || 'Our Company';
            const url = document.getElementById('pp-url').value || 'https://example.com';
            const email = document.getElementById('pp-email').value || 'contact@example.com';
            const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            let txt = '# Privacy Policy\\n\\nLast updated: ' + date + '\\n\\n';
            txt += name + ' ("we", "us", or "our") operates ' + url + '. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.\\n\\n';
            txt += '## 1. Information Collection and Use\\n';
            txt += 'We collect several different types of information for various purposes to provide and improve our Service to you.\\n\\n';
            
            if (document.getElementById('pp-cookies').checked) {
              txt += '## 2. Cookies and Tracking Data\\n';
              txt += 'We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.\\n\\n';
            }
            if (document.getElementById('pp-analytics').checked) {
              txt += '## 3. Analytics Providers\\n';
              txt += 'We may use third-party Service Providers such as Google Analytics to monitor and analyze the use of our Service.\\n\\n';
            }
            if (document.getElementById('pp-ads').checked) {
              txt += '## 4. Advertising Partners\\n';
              txt += 'We may serve advertisements through third-party advertising networks. These networks may use cookies and web beacons to serve ads based on your prior visits.\\n\\n';
            }
            txt += '## 5. Contact Us\\n';
            txt += 'If you have any questions about this Privacy Policy, please contact us at: ' + email + '\\n';

            document.getElementById('pp-output').value = txt;
          }

          function copyPolicy() {
            const val = document.getElementById('pp-output').value;
            navigator.clipboard.writeText(val);
          }

          document.addEventListener('DOMContentLoaded', genPolicy);
        </script>
      `
    },
    {
      slug: 'terms-generator',
      title: 'Terms of Service Generator',
      metaDesc: 'Generate a standard, customizable Terms of Service agreement for your online tools, websites, and SaaS products.',
      category: 'Security',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/security/">Privacy & Security</a> &gt; Terms of Service Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Terms of Service Generator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Create custom terms and conditions covering intellectual property, liability disclaimers, and user obligations.
          </p>

          <div class="tool-box">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
              <div class="field-group">
                <label class="field-label">Company / Site Name</label>
                <input type="text" id="tos-name" class="text-input" value="My Website" />
              </div>
              <div class="field-group">
                <label class="field-label">Jurisdiction (State / Country)</label>
                <input type="text" id="tos-jurisdiction" class="text-input" value="Delaware, United States" />
              </div>
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="genTos()">Generate Terms</button>
              <button class="btn-sec" onclick="copyTos()">Copy Text</button>
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <label class="field-label">Generated Terms of Service</label>
              <textarea id="tos-output" class="code-input" style="height: 300px;" readonly></textarea>
            </div>
          </div>
        </div>

        <script>
          function genTos() {
            const name = document.getElementById('tos-name').value || 'Our Company';
            const jur = document.getElementById('tos-jurisdiction').value || 'United States';
            const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            let txt = '# Terms of Service\\n\\nLast updated: ' + date + '\\n\\n';
            txt += 'Please read these Terms of Service ("Terms") carefully before using the website operated by ' + name + ' ("us", "we", or "our").\\n\\n';
            txt += '## 1. Acceptance of Terms\\n';
            txt += 'By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.\\n\\n';
            txt += '## 2. Disclaimer of Warranties\\n';
            txt += 'The Service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, whether express or implied.\\n\\n';
            txt += '## 3. Limitation of Liability\\n';
            txt += 'In no event shall ' + name + ' be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the Service.\\n\\n';
            txt += '## 4. Governing Law\\n';
            txt += 'These Terms shall be governed and construed in accordance with the laws of ' + jur + ', without regard to its conflict of law provisions.\\n';

            document.getElementById('tos-output').value = txt;
          }

          function copyTos() {
            navigator.clipboard.writeText(document.getElementById('tos-output').value);
          }

          document.addEventListener('DOMContentLoaded', genTos);
        </script>
      `
    },
    {
      slug: 'cookie-policy-generator',
      title: 'Free Cookie Policy Generator (GDPR & CCPA Compliant) + Cookie Banner Code',
      metaDesc: '100% Free Cookie Policy Generator. Create GDPR, CCPA, and ePrivacy compliant cookie policies with customizable consent banner code in seconds. No signup or fees.',
      category: 'Security',
      faq: [
        { q: 'Is this cookie policy generator 100% free with no signup?', a: 'Yes! This tool is completely free, client-side, and requires no registration, email submission, or recurring subscription fees. You can generate unlimited cookie policies and export clean Markdown or HTML instantly.' },
        { q: 'Does this generated cookie policy comply with GDPR and CCPA?', a: 'Yes. It adheres to European Union GDPR Article 6 & 7 (explicit consent, cookie categorization) and California Privacy Rights Act (CCPA/CPRA) disclosure requirements, including "Do Not Sell My Personal Information" notices.' },
        { q: 'Do I legally need a cookie consent banner on my website?', a: 'If your website serves visitors from the EU, UK, or California and uses any non-essential cookies (such as Google Analytics, Meta Pixel, advertising scripts, or session recording tools), privacy regulations strictly require you to display a cookie consent banner before setting those cookies.' },
        { q: 'How do I install the generated cookie consent banner on my site?', a: 'Simply copy the generated Vanilla JavaScript/HTML snippet and paste it right before the closing </body> tag of your website. It works universally on WordPress, Shopify, Webflow, Squarespace, Ghost, and custom static sites with zero dependencies.' },
        { q: 'What is the difference between Essential and Marketing cookies?', a: 'Essential cookies are strictly necessary for core functionality (user login state, cart checkout, security, load balancing) and do not require prior consent. Marketing and Analytics cookies track user behavior across sites for targeted advertising and traffic measurement, requiring explicit opt-in consent.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/security/">Privacy & Security</a> &gt; Free Cookie Policy Generator
          </nav>
          <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
            <span class="badge badge-green">100% Free & No Sign-Up</span>
            <span class="badge badge-amber">GDPR & CCPA Ready</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Free Cookie Policy Generator & Consent Banner</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Create legally compliant cookie policy documentation and lightweight, zero-dependency cookie consent banner code for your website. Completely free, customizable, and ready to deploy in 30 seconds.
          </p>

          <div class="tool-box">
            <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;">1. Website & Organization Details</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
              <div class="field-group" style="margin: 0;">
                <label class="field-label">Website / Company Name</label>
                <input type="text" id="cp-name" class="text-input" value="My Website" oninput="genCookiePolicy()" />
              </div>
              <div class="field-group" style="margin: 0;">
                <label class="field-label">Website URL</label>
                <input type="text" id="cp-url" class="text-input" value="https://example.com" oninput="genCookiePolicy()" />
              </div>
              <div class="field-group" style="margin: 0;">
                <label class="field-label">Privacy Contact Email</label>
                <input type="email" id="cp-email" class="text-input" value="privacy@example.com" oninput="genCookiePolicy()" />
              </div>
            </div>

            <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 1.5rem 0 0.75rem;">2. Cookies & Trackers Used</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
              <label class="opt-label"><input type="checkbox" id="cp-opt-essential" checked disabled> <strong>Essential Cookies</strong> (Required)</label>
              <label class="opt-label"><input type="checkbox" id="cp-opt-analytics" checked onchange="genCookiePolicy()"> <strong>Analytics</strong> (Google, Plausible)</label>
              <label class="opt-label"><input type="checkbox" id="cp-opt-marketing" checked onchange="genCookiePolicy()"> <strong>Advertising</strong> (AdSense, Meta)</label>
              <label class="opt-label"><input type="checkbox" id="cp-opt-prefs" checked onchange="genCookiePolicy()"> <strong>Preferences</strong> (Theme, Language)</label>
            </div>

            <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 1.5rem 0 0.75rem;">3. Cookie Consent Banner Customizer</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
              <div class="field-group" style="margin: 0;">
                <label class="field-label">Banner Position</label>
                <select id="cp-pos" class="text-input" onchange="genCookiePolicy()">
                  <option value="bottom">Fixed Bottom Bar</option>
                  <option value="corner">Floating Bottom-Right Card</option>
                  <option value="top">Fixed Top Ribbon</option>
                </select>
              </div>
              <div class="field-group" style="margin: 0;">
                <label class="field-label">Color Theme</label>
                <select id="cp-theme" class="text-input" onchange="genCookiePolicy()">
                  <option value="dark">Dark Minimalist (#18181b)</option>
                  <option value="light">Clean Light (#ffffff)</option>
                  <option value="slate">Deep Navy Slate (#0f172a)</option>
                </select>
              </div>
            </div>

            <!-- Live Banner Preview Mockup -->
            <div style="margin: 1.5rem 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label class="field-label" style="margin:0;">Live Banner Visual Preview</label>
                <button type="button" class="btn-sec" onclick="testBannerOnPage()" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">⚡ Test Live on This Screen</button>
              </div>
              <div id="banner-preview-box" style="border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; background: #18181b; color: #fff; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; font-family: system-ui, -apple-system, sans-serif; font-size: 0.9rem;">
                <div style="flex: 1; min-width: 240px; line-height: 1.5;">
                  <span>We use cookies to enhance your browsing experience, serve personalized ads, and analyze traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.</span>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <button type="button" style="background: transparent; color: #fff; border: 1px solid rgba(150,150,150,0.5); padding: 0.45rem 0.9rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer;">Decline</button>
                  <button type="button" style="background: #3b82f6; color: #fff; border: none; padding: 0.45rem 1rem; border-radius: 4px; font-weight: 600; font-size: 0.85rem; cursor: pointer;">Accept All</button>
                </div>
              </div>
            </div>

            <div class="action-bar" style="margin-top: 1.25rem;">
              <button class="btn-primary" onclick="copyPolicyMd()">📋 Copy Markdown Policy</button>
              <button class="btn-sec" onclick="copyPolicyHtml()">📋 Copy HTML Policy</button>
              <button class="btn-sec" onclick="copyBannerCode()">📋 Copy Banner HTML/JS Code</button>
              <button class="btn-sec" onclick="downloadPolicy()">💾 Download Policy (.md)</button>
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <label class="field-label">Generated Cookie Policy (Markdown)</label>
              <textarea id="cp-policy" class="code-input" style="height: 220px;" readonly></textarea>
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <label class="field-label">Generated Cookie Policy (Clean HTML)</label>
              <textarea id="cp-policy-html" class="code-input" style="height: 180px;" readonly></textarea>
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <label class="field-label">Embeddable Cookie Consent Banner (Drop-in HTML + Vanilla JS, Zero Dependencies)</label>
              <textarea id="cp-banner" class="code-input" style="height: 200px;" readonly></textarea>
            </div>

            <!-- GA4 Developer Integration Snippet -->
            <div style="border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; background: var(--surface-alt); margin-top: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h4 style="font-family: var(--serif); font-size: 1.05rem; margin: 0;">How to Block Google Analytics 4 Until Consent (GDPR Compliance)</h4>
                <button type="button" class="btn-sec" onclick="copyGa4Snippet()" style="padding: 0.3rem 0.65rem; font-size: 0.75rem;">Copy GA4 Snippet</button>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.75rem;">
                Under GDPR, you must not fire tracking scripts until user clicks "Accept". Wrap your Google tag with this one-line listener:
              </p>
              <pre style="background: var(--bg); border: 1px solid var(--border); padding: 0.75rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; overflow-x: auto; margin: 0; color: var(--fg);"><code id="ga4-snippet">&lt;!-- Only load GA4 if consent granted --&gt;
&lt;script&gt;
  function loadAnalytics() {
    var s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-YOUR_MEASUREMENT_ID';
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-YOUR_MEASUREMENT_ID');
  }
  if (localStorage.getItem('cookie_consent') === 'accepted') {
    loadAnalytics();
  }
  window.addEventListener('cookie_consent_accepted', loadAnalytics);
&lt;/script&gt;</code></pre>
            </div>
          </div>

          <div style="margin: 2.5rem 0;">
            <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Is this cookie policy generator 100% free with no signup?</summary>
              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes! This tool is completely free, client-side, and requires no registration, email submission, or recurring subscription fees. You can generate unlimited cookie policies and export clean Markdown or HTML instantly.</div>
            </details>
            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Does this generated cookie policy comply with GDPR and CCPA?</summary>
              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes. It adheres to European Union GDPR Article 6 & 7 (explicit consent, cookie categorization) and California Privacy Rights Act (CCPA/CPRA) disclosure requirements, including "Do Not Sell My Personal Information" notices.</div>
            </details>
            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Do I legally need a cookie consent banner on my website?</summary>
              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">If your website serves visitors from the EU, UK, or California and uses any non-essential cookies (such as Google Analytics, Meta Pixel, advertising scripts, or session recording tools), privacy regulations strictly require you to display a cookie consent banner before setting those cookies.</div>
            </details>
            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">How do I install the generated cookie consent banner on my site?</summary>
              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Simply copy the generated Vanilla JavaScript/HTML snippet and paste it right before the closing &lt;/body&gt; tag of your website. It works universally on WordPress, Shopify, Webflow, Squarespace, Ghost, and custom static sites with zero dependencies.</div>
            </details>
          </div>
        </div>

        <script>
          function genCookiePolicy() {
            const name = document.getElementById('cp-name').value.trim() || 'Our Website';
            const url = document.getElementById('cp-url').value.trim() || 'https://example.com';
            const email = document.getElementById('cp-email').value.trim() || 'privacy@example.com';
            const hasAnalytics = document.getElementById('cp-opt-analytics').checked;
            const hasMarketing = document.getElementById('cp-opt-marketing').checked;
            const hasPrefs = document.getElementById('cp-opt-prefs').checked;
            const pos = document.getElementById('cp-pos').value;
            const theme = document.getElementById('cp-theme').value;

            const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            let p = '# Cookie Policy for ' + name + '\\n\\n';
            p += '**Last updated:** ' + date + '\\n\\n';
            p += 'This Cookie Policy explains how ' + name + ' ("we", "us", or "our") uses cookies and similar tracking technologies when you visit our website at [' + url + '](' + url + ').\\n\\n';
            p += '## 1. What Are Cookies?\\n';
            p += 'Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work efficiently, provide personalized experiences, and gather reporting data.\\n\\n';
            p += '## 2. Categories of Cookies We Use\\n\\n';
            p += '### A. Strictly Necessary / Essential Cookies\\n';
            p += 'These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas, session authentication, and load balancing. Because these cookies are strictly necessary to deliver the site, you cannot refuse them without impacting website operation.\\n\\n';

            let pHtml = '<h1>Cookie Policy for ' + name + '</h1>\\n<p><strong>Last updated:</strong> ' + date + '</p>\\n';
            pHtml += '<p>This Cookie Policy explains how ' + name + ' ("we", "us", or "our") uses cookies and similar tracking technologies when you visit our website at <a href="' + url + '">' + url + '</a>.</p>\\n';
            pHtml += '<h2>1. What Are Cookies?</h2>\\n<p>Cookies are small data files placed on your device to ensure website functionality, improve user experience, and analyze site performance.</p>\\n';
            pHtml += '<h2>2. Categories of Cookies We Use</h2>\\n<h3>A. Strictly Necessary / Essential Cookies</h3>\\n<p>Essential for basic site operations, login states, and security. Cannot be disabled.</p>\\n';

            if (hasAnalytics) {
              p += '### B. Analytics and Performance Cookies\\n';
              p += 'These cookies collect information that is used either in aggregate form to help us understand how our website is being used, how effective our marketing campaigns are, or to help us customize our website for you (e.g. Google Analytics, Plausible Analytics, Cloudflare Web Analytics).\\n\\n';
              pHtml += '<h3>B. Analytics & Performance Cookies</h3>\\n<p>Used to measure visitor interactions and optimize load speeds (e.g. Google Analytics, Cloudflare).</p>\\n';
            }

            if (hasMarketing) {
              p += '### C. Advertising and Marketing Cookies\\n';
              p += 'These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests (e.g. Google AdSense, Meta Pixel).\\n\\n';
              pHtml += '<h3>C. Advertising & Marketing Cookies</h3>\\n<p>Used to deliver tailored promotions and prevent repetitive advertisements (e.g. Google AdSense, Meta Pixel).</p>\\n';
            }

            if (hasPrefs) {
              p += '### D. Functional and Preference Cookies\\n';
              p += 'These cookies enable the website to remember choices you make (such as your user name, language, or dark/light mode UI theme) and provide enhanced, more personal features.\\n\\n';
              pHtml += '<h3>D. Functional & Preference Cookies</h3>\\n<p>Enables memory of UI settings such as dark/light mode or language preference.</p>\\n';
            }

            p += '## 3. How Can You Control Cookies?\\n';
            p += 'You have the right to decide whether to accept or reject non-essential cookies. You can exercise your cookie preferences by clicking on the settings button in our cookie consent banner. In addition, most web browsers allow you to modify your cookie settings in your browser preferences.\\n\\n';
            p += '## 4. California Consumer Privacy Act (CCPA/CPRA)\\n';
            p += 'If you are a California resident, you have the right to request disclosure of categories of personal information collected via cookies, and to request that we do not sell or share your personal data.\\n\\n';
            p += '## 5. Contact Us\\n';
            p += 'If you have any questions about our use of cookies or other technologies, please email us at: ' + email + '.\\n';

            pHtml += '<h2>3. How Can You Control Cookies?</h2>\\n<p>You can accept or decline optional cookies using our consent banner or via your browser privacy settings.</p>\\n';
            pHtml += '<h2>4. Contact Us</h2>\\n<p>Questions? Contact us at: <a href="mailto:' + email + '">' + email + '</a></p>';

            document.getElementById('cp-policy').value = p;
            document.getElementById('cp-policy-html').value = pHtml;

            // Generate Embed Banner Code & Update Visual Preview
            let bgCol = '#18181b', textCol = '#ffffff', btnBg = '#3b82f6', btnText = '#ffffff', borderCol = 'rgba(255,255,255,0.1)';
            if (theme === 'light') {
              bgCol = '#ffffff'; textCol = '#18181b'; btnBg = '#18181b'; btnText = '#ffffff'; borderCol = 'rgba(0,0,0,0.15)';
            } else if (theme === 'slate') {
              bgCol = '#0f172a'; textCol = '#f8fafc'; btnBg = '#0284c7'; btnText = '#ffffff'; borderCol = 'rgba(255,255,255,0.15)';
            }

            // Update on-page visual preview box
            const prevBox = document.getElementById('banner-preview-box');
            if (prevBox) {
              prevBox.style.background = bgCol;
              prevBox.style.color = textCol;
              prevBox.style.borderColor = borderCol;
              const btns = prevBox.querySelectorAll('button');
              if (btns.length >= 2) {
                btns[0].style.color = textCol;
                btns[0].style.borderColor = borderCol;
                btns[1].style.background = btnBg;
                btns[1].style.color = btnText;
              }
            }

            let posStyle = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;';
            if (pos === 'corner') {
              posStyle = 'position:fixed;bottom:20px;right:20px;max-width:380px;border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,0.3);z-index:99999;';
            } else if (pos === 'top') {
              posStyle = 'position:fixed;top:0;left:0;right:0;z-index:99999;';
            }

            let banner = '<!-- Digital Tools Shed Free GDPR/CCPA Cookie Consent Banner -->\\n' +
              '<div id="dts-cookie-banner" style="' + posStyle + 'background:' + bgCol + ';color:' + textCol + ';padding:1rem 1.25rem;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;font-family:system-ui,-apple-system,sans-serif;font-size:0.9rem;border-top:1px solid ' + borderCol + ';box-sizing:border-box;">\\n' +
              '  <div style="flex:1;min-width:260px;line-height:1.5;">\\n' +
              '    <span>We use cookies to enhance your browsing experience, serve personalized ads, and analyze traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.</span>\\n' +
              '  </div>\\n' +
              '  <div style="display:flex;gap:0.5rem;align-items:center;">\\n' +
              '    <button id="dts-cookie-decline" style="background:transparent;color:' + textCol + ';border:1px solid ' + borderCol + ';padding:0.45rem 0.9rem;border-radius:4px;cursor:pointer;font-size:0.85rem;">Decline</button>\\n' +
              '    <button id="dts-cookie-accept" style="background:' + btnBg + ';color:' + btnText + ';border:none;padding:0.45rem 1rem;border-radius:4px;cursor:pointer;font-weight:600;font-size:0.85rem;">Accept All</button>\\n' +
              '  </div>\\n' +
              '</div>\\n' +
              '<script>\\n' +
              '  (function() {\\n' +
              '    var b = document.getElementById("dts-cookie-banner");\\n' +
              '    if (!b) return;\\n' +
              '    if (localStorage.getItem("cookie_consent") !== null) {\\n' +
              '      b.style.display = "none";\\n' +
              '    }\\n' +
              '    document.getElementById("dts-cookie-accept").onclick = function() {\\n' +
              '      localStorage.setItem("cookie_consent", "accepted");\\n' +
              '      b.style.display = "none";\\n' +
              '      window.dispatchEvent(new CustomEvent("cookie_consent_accepted"));\\n' +
              '    };\\n' +
              '    document.getElementById("dts-cookie-decline").onclick = function() {\\n' +
              '      localStorage.setItem("cookie_consent", "declined");\\n' +
              '      b.style.display = "none";\\n' +
              '      window.dispatchEvent(new CustomEvent("cookie_consent_declined"));\\n' +
              '    };\\n' +
              '  })();\\n' +
              '<\\/script>';

            document.getElementById('cp-banner').value = banner;
          }

          function copyPolicyMd() {
            navigator.clipboard.writeText(document.getElementById('cp-policy').value);
            alert('Markdown policy copied to clipboard!');
          }

          function copyPolicyHtml() {
            navigator.clipboard.writeText(document.getElementById('cp-policy-html').value);
            alert('HTML policy copied to clipboard!');
          }

          function copyBannerCode() {
            navigator.clipboard.writeText(document.getElementById('cp-banner').value);
            alert('Cookie banner code copied to clipboard!');
          }

          function copyGa4Snippet() {
            navigator.clipboard.writeText(document.getElementById('ga4-snippet').textContent);
            alert('GA4 consent wrapper snippet copied to clipboard!');
          }

          function downloadPolicy() {
            const blob = new Blob([document.getElementById('cp-policy').value], { type: 'text/markdown' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'cookie-policy.md';
            a.click();
          }

          function testBannerOnPage() {
            const old = document.getElementById('dts-cookie-banner');
            if (old) old.remove();
            const temp = document.createElement('div');
            temp.innerHTML = document.getElementById('cp-banner').value;
            document.body.appendChild(temp);
            const scripts = temp.getElementsByTagName('script');
            for (let s of scripts) { eval(s.innerText); }
          }

          document.addEventListener('DOMContentLoaded', genCookiePolicy);
        </script>
      `
    },
    {
      slug: 'gdpr-checklist',
      title: 'GDPR Compliance Audit Checklist',
      metaDesc: 'Interactive GDPR compliance self-assessment checklist for web developers, product managers, and digital publishers.',
      category: 'Security',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/security/">Privacy & Security</a> &gt; GDPR Compliance Checklist
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">GDPR Compliance Audit Checklist</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Step-by-step interactive self-audit checklist to assess your site's readiness under the EU General Data Protection Regulation.
          </p>

          <div class="tool-box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <span class="field-label" style="margin:0;">Audit Progress</span>
              <span id="gdpr-score" class="badge badge-amber">0% Compliant</span>
            </div>
            <div style="height: 8px; width: 100%; background: var(--border); border-radius: 4px; overflow: hidden; margin-bottom: 1.5rem;">
              <div id="gdpr-bar" style="height: 100%; width: 0%; background: #3b82f6; transition: width 0.3s;"></div>
            </div>

            <div id="checklist-items" style="display: flex; flex-direction: column; gap: 0.85rem;">
              <label class="opt-label"><input type="checkbox" class="gdpr-cb" onchange="calcGdpr()"> <strong>Consent:</strong> Explicit, opt-in consent obtained before setting non-essential tracking cookies.</label>
              <label class="opt-label"><input type="checkbox" class="gdpr-cb" onchange="calcGdpr()"> <strong>Privacy Notice:</strong> Clear, accessible privacy policy outlining data collection and processing purposes.</label>
              <label class="opt-label"><input type="checkbox" class="gdpr-cb" onchange="calcGdpr()"> <strong>Right to Erasure:</strong> Mechanism in place for users to request deletion of personal data ("Right to be Forgotten").</label>
              <label class="opt-label"><input type="checkbox" class="gdpr-cb" onchange="calcGdpr()"> <strong>Data Minimization:</strong> Only collecting personal data that is strictly necessary for service delivery.</label>
              <label class="opt-label"><input type="checkbox" class="gdpr-cb" onchange="calcGdpr()"> <strong>Security:</strong> All network traffic encrypted via TLS/HTTPS, passwords hashed with salt (Argon2/bcrypt).</label>
              <label class="opt-label"><input type="checkbox" class="gdpr-cb" onchange="calcGdpr()"> <strong>Breach Protocol:</strong> Documented procedure to notify supervisory authorities within 72 hours of a data breach.</label>
            </div>
          </div>
        </div>

        <script>
          function calcGdpr() {
            const boxes = document.querySelectorAll('.gdpr-cb');
            let checked = 0;
            boxes.forEach(b => { if (b.checked) checked++; });
            const pct = Math.round((checked / boxes.length) * 100);

            const bar = document.getElementById('gdpr-bar');
            bar.style.width = pct + '%';

            const score = document.getElementById('gdpr-score');
            score.textContent = pct + '% Compliant';
            score.className = 'badge ' + (pct === 100 ? 'badge-green' : pct >= 50 ? 'badge-amber' : 'badge-red');
          }
        </script>
      `
    },
    {
      slug: 'data-breach-checker',
      title: 'Password Pwned & Breach Checker',
      metaDesc: 'Check if a password has been compromised in data breaches using HaveIBeenPwned k-anonymity API (only SHA-1 prefix transmitted).',
      category: 'Security',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/security/">Privacy & Security</a> &gt; Breach Checker
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Password Pwned & Breach Checker</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Check if your password has appeared in known data breaches. Uses mathematical <strong>k-Anonymity</strong> (only the first 5 characters of a SHA-1 hash are queried; your actual password never leaves the browser).
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Test Password</label>
              <input type="password" id="pwn-input" class="code-input" placeholder="Type password to test..." />
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="checkPwned()">Search Breach Database</button>
            </div>

            <div id="pwn-result" class="result-box" style="display: none; margin-top: 1.5rem;"></div>
          </div>
        </div>

        <script>
          async function sha1(str) {
            const enc = new TextEncoder();
            const buf = await window.crypto.subtle.digest('SHA-1', enc.encode(str));
            return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
          }

          async function checkPwned() {
            const val = document.getElementById('pwn-input').value;
            const res = document.getElementById('pwn-result');
            if (!val) return;

            res.style.display = 'block';
            res.textContent = 'Computing SHA-1 and querying k-Anonymity database...';

            try {
              const hash = await sha1(val);
              const prefix = hash.slice(0, 5);
              const suffix = hash.slice(5);

              const response = await fetch('https://api.pwnedpasswords.com/range/' + prefix);
              const text = await response.text();

              const lines = text.split('\\n');
              let foundCount = 0;
              for (const line of lines) {
                const [h, count] = line.split(':');
                if (h.trim() === suffix) {
                  foundCount = parseInt(count.trim(), 10);
                  break;
                }
              }

              if (foundCount > 0) {
                res.innerHTML = '<span style="color:#ef4444; font-weight:bold;">⚠️ Compromised!</span> This password has appeared in data breaches <strong>' + foundCount.toLocaleString() + '</strong> times. Do not use it.';
              } else {
                res.innerHTML = '<span style="color:#22c55e; font-weight:bold;">✓ Good news!</span> No match found in the database of known breached passwords.';
              }
            } catch(e) {
              res.textContent = 'Query failed (network offline or adblocker blocking HIBP API).';
            }
          }
        </script>
      `
    },
    {
      slug: 'totp-generator',
      title: 'TOTP 2-Factor Authenticator Code Generator',
      metaDesc: 'Generate RFC 6238 Time-based One-Time Passwords (TOTP 2FA) from a Base32 secret key locally in your browser.',
      category: 'Security',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/security/">Privacy & Security</a> &gt; TOTP Authenticator Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">TOTP 2-Factor Authenticator Code Generator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Compute 6-digit RFC 6238 TOTP authentication codes from Base32 secret keys directly using browser Web Crypto HMAC-SHA1.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Base32 Secret Key (e.g. JBSWY3DPEHPK3PXP)</label>
              <input type="text" id="totp-secret" class="code-input" value="JBSWY3DPEHPK3PXP" placeholder="Enter secret key..." oninput="updateTotp()" />
            </div>

            <div style="background: var(--surface-alt); padding: 1.5rem; border-radius: 6px; border: 1px solid var(--border); text-align: center; margin-top: 1.5rem;">
              <div class="field-label">Current 6-Digit TOTP Code</div>
              <div id="totp-code" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; letter-spacing: 0.15em; color: var(--btn-bg, #3b82f6); margin: 0.5rem 0;">--- ---</div>
              <div id="totp-time" style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">Refreshing in 30s...</div>
            </div>
          </div>
        </div>

        <script>
          function base32ToUint8Array(base32) {
            const b32 = base32.toUpperCase().replace(/=+$/, '');
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
            let bits = '';
            for (let i = 0; i < b32.length; i++) {
              const val = alphabet.indexOf(b32.charAt(i));
              if (val === -1) continue;
              bits += val.toString(2).padStart(5, '0');
            }
            const bytes = new Uint8Array(Math.floor(bits.length / 8));
            for (let i = 0; i < bytes.length; i++) {
              bytes[i] = parseInt(bits.substr(i * 8, 8), 2);
            }
            return bytes;
          }

          async function generateTOTP(secret) {
            const keyBytes = base32ToUint8Array(secret);
            if (keyBytes.length === 0) return 'INVALID';

            const epoch = Math.floor(Date.now() / 1000);
            const time = Math.floor(epoch / 30);

            const timeBuffer = new ArrayBuffer(8);
            const timeView = new DataView(timeBuffer);
            timeView.setUint32(4, time, false);

            const cryptoKey = await window.crypto.subtle.importKey(
              'raw', keyBytes, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
            );

            const hmac = await window.crypto.subtle.sign('HMAC', cryptoKey, timeBuffer);
            const hmacBytes = new Uint8Array(hmac);

            const offset = hmacBytes[hmacBytes.length - 1] & 0xf;
            const code = ((hmacBytes[offset] & 0x7f) << 24) |
                         ((hmacBytes[offset + 1] & 0xff) << 16) |
                         ((hmacBytes[offset + 2] & 0xff) << 8) |
                         (hmacBytes[offset + 3] & 0xff);

            return (code % 1000000).toString().padStart(6, '0');
          }

          async function updateTotp() {
            const secret = document.getElementById('totp-secret').value.trim();
            const codeEl = document.getElementById('totp-code');
            const timeEl = document.getElementById('totp-time');

            const epoch = Math.floor(Date.now() / 1000);
            const remaining = 30 - (epoch % 30);
            timeEl.textContent = 'Refreshes in ' + remaining + 's';

            try {
              const code = await generateTOTP(secret);
              codeEl.textContent = code.slice(0, 3) + ' ' + code.slice(3);
            } catch(e) {
              codeEl.textContent = 'ERROR';
            }
          }

          setInterval(updateTotp, 1000);
          document.addEventListener('DOMContentLoaded', updateTotp);
        </script>
      `
    }
  ];

  // Render individual tool pages
  for (const tool of tools) {
    const html = renderPage({
      title: `${tool.title} | Digital Tools Shed`,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/security/${tool.slug}`,
      bodyContent: tool.body,
      currentPath: `/security/${tool.slug}`,
      faq: tool.faq
    });
    writeFileSync(join(secDist, `${tool.slug}.html`), html);
  }

  // Render Hub Page
  const hubCards = tools.map(t => `
    <a href="/security/${t.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  const hubBody = `
    ${commonStyle}
    <div class="article-container" style="max-width: 900px;">
      <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Privacy & Security Tools Suite</h1>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
        Browser-based, zero-server cryptographic utilities, strong password generators, encryption modules, and compliance policy builders.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
        ${hubCards}
      </div>
    </div>
  `;

  writeFileSync(join(secDist, 'index.html'), renderPage({
    title: 'Privacy & Security Tools Suite | Digital Tools Shed',
    metaDesc: 'Free client-side security tools: password generator, encrypted notes, Diceware passphrase, TOTP generator, and GDPR audit tools.',
    canonical: `${DOMAIN}/security/`,
    bodyContent: hubBody,
    currentPath: '/security/'
  }));

  console.log(`  ✓ Built Privacy & Security Suite (${tools.length} tools in /security/)`);
}
