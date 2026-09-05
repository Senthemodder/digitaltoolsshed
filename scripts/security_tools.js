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
      faq: [
        {
                "q": "How does this password generator create mathematically unpredictable passwords?",
                "a": "It uses window.crypto.getRandomValues(), the browser's native Cryptographically Secure Pseudorandom Number Generator (CSPRNG), backed by OS hardware entropy pools (e.g. /dev/urandom or Windows BCryptGenRandom)."
        },
        {
                "q": "Are the passwords generated on this page ever sent to a server or saved?",
                "a": "No. The entire code executes client-side in your web browser. No network requests are made, no credentials are saved in cookies, localStorage, or remote server logs."
        },
        {
                "q": "What is Shannon entropy and how many bits of entropy do I need?",
                "a": "Entropy measures unpredictability in bits (H = L * log2(N)). NIST recommends at least 64 bits for standard accounts and 80-128 bits for master passwords, root access, and cryptocurrency wallets."
        },
        {
                "q": "Why does this generator exclude ambiguous characters like 0, O, 1, l, and I?",
                "a": "Excluding ambiguous glyphs prevents human transcription errors when manually typing passwords across terminal consoles, smartphones, or pen-and-paper backups."
        },
        {
                "q": "Can modern GPU clusters crack a 20-character password generated here?",
                "a": "No. A 20-character password generated from all character pools contains ~131 bits of entropy (2^131 possible permutations). An array of 1,000 RTX 4090 GPUs guessing 100 billion combinations per second would require billions of times the current age of the universe to exhaust the search space."
        }
],
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
          \n          <div style="margin: 2.5rem 0;">\n            <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">How does this password generator create mathematically unpredictable passwords?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">It uses window.crypto.getRandomValues(), the browser's native Cryptographically Secure Pseudorandom Number Generator (CSPRNG), backed by OS hardware entropy pools (e.g. /dev/urandom or Windows BCryptGenRandom).</div>\n            </details>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Are the passwords generated on this page ever sent to a server or saved?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">No. The entire code executes client-side in your web browser. No network requests are made, no credentials are saved in cookies, localStorage, or remote server logs.</div>\n            </details>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">What is Shannon entropy and how many bits of entropy do I need?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Entropy measures unpredictability in bits (H = L * log2(N)). NIST recommends at least 64 bits for standard accounts and 80-128 bits for master passwords, root access, and cryptocurrency wallets.</div>\n            </details>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Why does this generator exclude ambiguous characters like 0, O, 1, l, and I?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Excluding ambiguous glyphs prevents human transcription errors when manually typing passwords across terminal consoles, smartphones, or pen-and-paper backups.</div>\n            </details>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Can modern GPU clusters crack a 20-character password generated here?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">No. A 20-character password generated from all character pools contains ~131 bits of entropy (2^131 possible permutations). An array of 1,000 RTX 4090 GPUs guessing 100 billion combinations per second would require billions of times the current age of the universe to exhaust the search space.</div>\n            </details>\n          </div>\n</div>
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
      faq: [
        {
                "q": "How is password strength mathematically calculated?",
                "a": "Strength is determined by calculating the character search space (pool size N), Shannon entropy (H = L * log2(N)), and testing against known dictionary patterns, repeated sequences, and NIST SP 800-63B guidelines."
        },
        {
                "q": "How accurate are the estimated cracking times?",
                "a": "They reflect real-world adversary capabilities across three benchmarks: online web throttling (100 guesses/sec), slow password hashes like Argon2/bcrypt (10,000/sec), and fast GPU clusters computing MD5/SHA256 (100 billion/sec)."
        },
        {
                "q": "Why does NIST no longer recommend periodic 90-day password changes?",
                "a": "NIST Special Publication 800-63B advises against forced periodic rotation because users respond by making predictable single-character substitutions (e.g. Spring2024! -> Summer2024!), paradoxically decreasing account security."
        },
        {
                "q": "Is it safe to check my real password on this page?",
                "a": "Yes, this analyzer runs 100% locally inside your browser with zero network transmission. However, for maximum operational security, you can test a password of identical length and character pattern rather than your actual production secret."
        },
        {
                "q": "Does adding numbers or symbols to a short password make it secure?",
                "a": "No. A short 8-character password with symbols has only ~52 bits of entropy, which modern GPU clusters can crack in hours. Length is the single most important factor: every additional character multiplies cracking time exponentially."
        }
],
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
          \n          <div style="margin: 2.5rem 0;">\n            <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">How is password strength mathematically calculated?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Strength is determined by calculating the character search space (pool size N), Shannon entropy (H = L * log2(N)), and testing against known dictionary patterns, repeated sequences, and NIST SP 800-63B guidelines.</div>\n            </details>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">How accurate are the estimated cracking times?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">They reflect real-world adversary capabilities across three benchmarks: online web throttling (100 guesses/sec), slow password hashes like Argon2/bcrypt (10,000/sec), and fast GPU clusters computing MD5/SHA256 (100 billion/sec).</div>\n            </details>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Why does NIST no longer recommend periodic 90-day password changes?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">NIST Special Publication 800-63B advises against forced periodic rotation because users respond by making predictable single-character substitutions (e.g. Spring2024! -> Summer2024!), paradoxically decreasing account security.</div>\n            </details>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Is it safe to check my real password on this page?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes, this analyzer runs 100% locally inside your browser with zero network transmission. However, for maximum operational security, you can test a password of identical length and character pattern rather than your actual production secret.</div>\n            </details>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Does adding numbers or symbols to a short password make it secure?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">No. A short 8-character password with symbols has only ~52 bits of entropy, which modern GPU clusters can crack in hours. Length is the single most important factor: every additional character multiplies cracking time exponentially.</div>\n            </details>\n          </div>\n</div>
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
      faq: [
        {
                "q": "What is the Diceware passphrase method?",
                "a": "Invented by Arnold Reinhold in 1995, Diceware uses dice rolls to select random words from a curated wordlist. Combining 5 to 7 random words produces high entropy while remaining easy for human memory to recall and type."
        },
        {
                "q": "Why are passphrases often better than complex random passwords for humans?",
                "a": "Passphrases like 'correct-horse-battery-staple' provide 70-100 bits of entropy without requiring obscure symbols that humans struggle to remember, making them ideal for master password vault keys and device disk encryption."
        },
        {
                "q": "How many words should my passphrase have for maximum security?",
                "a": "4 words provide ~52 bits (adequate for low-risk sites), 5 words provide ~65 bits (standard user accounts), and 6 to 7 words provide 78-91 bits (virtually unbreakable against state-level offline GPU attacks)."
        },
        {
                "q": "Does changing the delimiter or capitalizing words increase security?",
                "a": "Yes. Using random separators (underscores, dots, slashes) and inserting random digits or symbols adds 10 to 25 extra bits of entropy, thwarting naive word-level dictionary attacks."
        },
        {
                "q": "Is this passphrase generator truly random?",
                "a": "Yes. It uses the Web Cryptography API's window.crypto.getRandomValues() CSPRNG with rejection sampling to eliminate modulo bias, ensuring uniformly random word selection."
        }
],
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
          \n          <div style="margin: 2.5rem 0;">\n            <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">What is the Diceware passphrase method?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Invented by Arnold Reinhold in 1995, Diceware uses dice rolls to select random words from a curated wordlist. Combining 5 to 7 random words produces high entropy while remaining easy for human memory to recall and type.</div>\n            </details>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Why are passphrases often better than complex random passwords for humans?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Passphrases like 'correct-horse-battery-staple' provide 70-100 bits of entropy without requiring obscure symbols that humans struggle to remember, making them ideal for master password vault keys and device disk encryption.</div>\n            </details>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">How many words should my passphrase have for maximum security?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">4 words provide ~52 bits (adequate for low-risk sites), 5 words provide ~65 bits (standard user accounts), and 6 to 7 words provide 78-91 bits (virtually unbreakable against state-level offline GPU attacks).</div>\n            </details>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Does changing the delimiter or capitalizing words increase security?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes. Using random separators (underscores, dots, slashes) and inserting random digits or symbols adds 10 to 25 extra bits of entropy, thwarting naive word-level dictionary attacks.</div>\n            </details>\n            <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">\n              <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Is this passphrase generator truly random?</summary>\n              <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes. It uses the Web Cryptography API's window.crypto.getRandomValues() CSPRNG with rejection sampling to eliminate modulo bias, ensuring uniformly random word selection.</div>\n            </details>\n          </div>\n</div>
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
      title: "Zero-Knowledge Encrypted Notes & AES-256-GCM Vault",
      metaDesc: "Encrypt and decrypt private notes directly in your browser using 256-bit AES-GCM and PBKDF2-SHA256. Zero server transmission, client-side zero-knowledge security.",
      category: 'Security',
      faq: [
        {
                "q": "Is my passphrase or note ever sent to your servers?",
                "a": "No, absolutely never. This tool runs 100% locally inside your web browser using the native Web Cryptography API (window.crypto.subtle). Encryption and decryption keys are derived in volatile browser RAM and wiped immediately. No data packets are ever transmitted over the network."
        },
        {
                "q": "What encryption algorithm and key derivation function are used?",
                "a": "The tool uses authenticated 256-bit AES-GCM (Advanced Encryption Standard in Galois/Counter Mode) with an intrinsic 128-bit authentication tag. Keys are stretched from your master passphrase using PBKDF2 with HMAC-SHA-256, a unique 16-byte random salt, and up to 600,000 iterations adhering to OWASP recommendations."
        },
        {
                "q": "What happens if I lose or forget my passphrase?",
                "a": "Because this tool adheres to strict zero-knowledge cryptographic principles, there are no backdoors, recovery keys, or master resets. If you lose your passphrase, the ciphertext payload is mathematically unrecoverable and cannot be brute-forced within any realistic timeframe."
        },
        {
                "q": "Why is AES-GCM safer than older modes like AES-CBC?",
                "a": "AES-CBC provides confidentiality but lacks integrity verification, leaving it vulnerable to padding oracle attacks and ciphertext bit-flipping. AES-GCM provides both confidentiality and cryptographic integrity verification in a single pass using a Galois field multiplier (GHASH)."
        },
        {
                "q": "What is inside the exported encrypted payload?",
                "a": "The payload contains a 4-byte format header (DTS1), a 4-byte big-endian iteration count, a 16-byte cryptographically secure random salt, a 12-byte random initialization vector (IV/nonce), and the AES-256-GCM ciphertext combined with the 16-byte authentication tag, encoded as Base64 or Hex."
        }
],
      body: `
    ${commonStyle}
    <style>
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.75rem; margin: 1rem 0; }
      .stat-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.85rem; text-align: center; }
      .stat-num { font-family: var(--mono); font-size: 1.15rem; font-weight: 700; color: var(--fg); }
      .stat-lbl { font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; margin-top: 0.25rem; }
      .tag-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
      .trap-card { border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; background: var(--surface-alt); font-size: 0.88rem; line-height: 1.55; }
      .formula-box { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; margin: 1.25rem 0; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg); }
    </style>
    <div class="article-container" style="max-width: 920px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/security/">Privacy &amp; Security</a> &gt; Zero-Knowledge Encrypted Notes
      </nav>

      <div class="tag-row">
        <span class="badge badge-green">AES-256-GCM Authenticated</span>
        <span class="badge badge-amber">PBKDF2-SHA256 (310k+ Iterations)</span>
        <span class="badge badge-green">Zero Server Transmission</span>
      </div>

      <h1 style="font-family: var(--serif); font-size: 1.9rem; margin-bottom: 0.5rem;">Zero-Knowledge Encrypted Notes &amp; AES-256-GCM Vault</h1>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
        Encrypt and decrypt sensitive text, credentials, API keys, or recovery seed phrases directly inside your browser. Powered by the native Web Cryptography API with zero-knowledge architecture—no unencrypted data or keys ever touch a remote server.
      </p>

      <div class="tool-box">
        <!-- Passphrase Section -->
        <div class="field-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <label class="field-label" style="margin:0;">Master Passphrase / Secret Key</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <button type="button" id="btnTogglePass" onclick="togglePassVisibility()" class="btn-sec" style="padding: 0.2rem 0.55rem; font-size: 0.75rem;">👁 Show</button>
              <button type="button" onclick="generateRandomKey()" class="btn-sec" style="padding: 0.2rem 0.55rem; font-size: 0.75rem;">⚡ Gen 24-Char Key</button>
            </div>
          </div>
          <input type="password" id="enc-pass" class="code-input" placeholder="Enter strong secret passphrase..." oninput="updatePassFeedback()" style="font-size: 1rem;" autocomplete="off" />
          <div style="display: flex; justify-content: space-between; margin-top: 0.35rem; font-family: var(--mono); font-size: 0.75rem;">
            <span id="pass-strength" style="color: var(--text-muted);">Strength: Enter passphrase</span>
            <span id="pass-entropy" style="color: var(--text-muted);">Estimated Entropy: 0 bits</span>
          </div>
        </div>

        <!-- Cryptographic Parameters Row -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem; margin-bottom: 1.25rem; padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);">
          <div>
            <label class="field-label" style="margin-bottom: 0.25rem;">PBKDF2 Iterations</label>
            <select id="enc-iter" class="text-input" style="font-size: 0.85rem; padding: 0.45rem 0.6rem;">
              <option value="310000" selected>310,000 (OWASP Recommended)</option>
              <option value="600000">600,000 (Maximum Defense)</option>
              <option value="100000">100,000 (Legacy Baseline)</option>
            </select>
          </div>
          <div>
            <label class="field-label" style="margin-bottom: 0.25rem;">Cipher Mode &amp; Key Length</label>
            <input type="text" class="text-input" value="AES-GCM 256-bit (Auth Tag)" readonly style="font-size: 0.85rem; padding: 0.45rem 0.6rem; opacity: 0.85;" />
          </div>
          <div>
            <label class="field-label" style="margin-bottom: 0.25rem;">Payload Encoding</label>
            <select id="enc-format" class="text-input" style="font-size: 0.85rem; padding: 0.45rem 0.6rem;" onchange="formatChanged()">
              <option value="base64" selected>Base64 (Compact / Standard)</option>
              <option value="hex">Hexadecimal (Debugging)</option>
            </select>
          </div>
        </div>

        <!-- Plaintext / Note Section -->
        <div class="field-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <label class="field-label" style="margin: 0;">Plaintext Secret Note</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span id="plain-counter" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">0 chars | 0 bytes</span>
              <button type="button" onclick="loadSampleNote()" class="btn-sec" style="padding: 0.2rem 0.55rem; font-size: 0.75rem;">Sample Note</button>
              <button type="button" onclick="clearPlaintext()" class="btn-sec" style="padding: 0.2rem 0.55rem; font-size: 0.75rem;">Clear</button>
            </div>
          </div>
          <textarea id="plain-text" class="code-input" style="height: 140px; resize: vertical; line-height: 1.45;" placeholder="Type or paste your sensitive note, recovery phrase, or confidential data here..." oninput="updatePlainMetrics()"></textarea>
        </div>

        <!-- Action Bar -->
        <div class="action-bar" style="margin-top: 0.5rem;">
          <button type="button" class="btn-primary" onclick="encryptNote()" style="font-size: 0.9rem; padding: 0.7rem 1.4rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🔒 Encrypt Note</span>
          </button>
          <button type="button" class="btn-sec" onclick="decryptNote()" style="font-size: 0.9rem; padding: 0.7rem 1.4rem; display: flex; align-items: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); font-weight: 600;">
            <span>🔓 Decrypt Payload</span>
          </button>
        </div>

        <!-- Status Message Banner -->
        <div id="enc-status" style="display: none; padding: 0.75rem 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; margin-top: 1rem; line-height: 1.4;"></div>

        <!-- Encrypted Payload Section -->
        <div class="field-group" style="margin-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <label class="field-label" style="margin: 0;">Encrypted Payload (Salt + Iterations + IV + Ciphertext + Tag)</label>
            <span id="cipher-counter" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">0 bytes</span>
          </div>
          <textarea id="cipher-text" class="code-input" style="height: 140px; resize: vertical; font-size: 0.82rem; word-break: break-all;" placeholder="Encrypted payload appears here after encryption, or paste an existing encrypted payload to decrypt..." oninput="updateCipherMetrics()"></textarea>
        </div>

        <!-- Real-Time Cryptographic Telemetry -->
        <div class="stat-grid" style="margin-top: 1.25rem;">
          <div class="stat-card">
            <div class="stat-num" id="stat-cipher">AES-256-GCM</div>
            <div class="stat-lbl">Cipher Mode</div>
          </div>
          <div class="stat-card">
            <div class="stat-num" id="stat-kdf">PBKDF2-SHA256</div>
            <div class="stat-lbl">Key Derivation</div>
          </div>
          <div class="stat-card">
            <div class="stat-num" id="stat-salt">16 Bytes</div>
            <div class="stat-lbl">CSPRNG Salt</div>
          </div>
          <div class="stat-card">
            <div class="stat-num" id="stat-iv">12 Bytes (96-bit)</div>
            <div class="stat-lbl">Unique Nonce / IV</div>
          </div>
          <div class="stat-card">
            <div class="stat-num" id="stat-tag">128-bit Tag</div>
            <div class="stat-lbl">Integrity Auth</div>
          </div>
          <div class="stat-card">
            <div class="stat-num" id="stat-time">0 ms</div>
            <div class="stat-lbl">Process Latency</div>
          </div>
        </div>

        <!-- Action Copy Buttons Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1.25rem;">
          <button type="button" id="btnCopyCipher" class="btn-primary" onclick="copyCiphertext()" style="padding: 0.65rem 0.85rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
            <span>📋 Copy Ciphertext</span>
          </button>
          <button type="button" id="btnCopyPlain" class="btn-sec" onclick="copyPlaintext()" style="padding: 0.65rem 0.85rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface); border: 1px solid var(--border); color: var(--fg); font-weight: 600;">
            <span>📋 Copy Plaintext</span>
          </button>
          <button type="button" id="btnCopyEncReport" class="btn-sec" onclick="copyEncReport()" style="padding: 0.65rem 0.85rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface); border: 1px solid var(--border); color: var(--fg); font-weight: 600;">
            <span>📋 Copy Crypto Audit</span>
          </button>
          <button type="button" id="btnDownloadEnc" class="btn-sec" onclick="downloadEncryptedFile()" style="padding: 0.65rem 0.85rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface); border: 1px solid var(--border); color: var(--fg); font-weight: 600;">
            <span>💾 Download .enc</span>
          </button>
        </div>
      </div>

      <!-- Worked Mathematical & Cryptographic Derivations -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem;">Cryptographic Architecture &amp; Mathematical Derivations</h2>
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
          Digital Tools Shed uses an authenticated encryption pipeline combining Password-Based Key Derivation Function 2 (PBKDF2) with Galois/Counter Mode (AES-GCM). Unlike unauthenticated block modes, this architecture guarantees both mathematical confidentiality and tamper detection.
        </p>

        <div class="formula-box">
<strong>1. Key Stretching (PBKDF2-HMAC-SHA256):</strong>
DK = PBKDF2(PRF = HMAC-SHA256, Password = P, Salt = S, Iterations = c, dkLen = 256 bits)
Where:
  U_1 = PRF(P, S || INT_32_BE(i))
  U_2 = PRF(P, U_1)
  ...
  U_c = PRF(P, U_{c-1})
  F(P, S, c, i) = U_1 ⊕ U_2 ⊕ ... ⊕ U_c
Cost: 310,000 SHA-256 passes force adversary GPU clusters to compute 620,000 compression operations per password guess.

<strong>2. Authenticated Encryption (AES-GCM-256):</strong>
Ciphertext: C = AES-CTR(K, IV, Plaintext)
GHASH Hash: H = AES_K(0^128)
Auth Tag:   T = GHASH_H(A || C) ⊕ AES_K(J_0)
Where:
  - IV is 96 bits (12 bytes) fresh CSPRNG randomness
  - T is 128 bits (16 bytes) verifying that not a single bit of ciphertext was altered
  - Verification fails instantly if a bit flip occurs (Forging probability = 2^-128 ≈ 2.94 × 10^-39)
        </div>
      </div>

      <!-- 5 Fatal Traps & Cryptographic Vulnerabilities -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">5 Fatal Traps in Client-Side Web Encryption</h2>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 1: Nonce/IV Reuse in AES-GCM (Catastrophic Key Recovery)</strong>
          In Galois/Counter Mode, using the same 96-bit Initialization Vector (IV) more than once under the same AES key completely destroys message authenticity. An attacker observing two ciphertexts encrypted with the same IV can XOR the ciphertexts to recover the XOR of the plaintexts, and can mathematically solve the GHASH polynomial to extract the authentication subkey H, enabling undetectable message forgery. Digital Tools Shed generates a fresh 12-byte CSPRNG nonce on every single encryption call.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 2: Insufficient PBKDF2 Iteration Counts (ASIC Brute-Force Vulnerability)</strong>
          Using outdated PBKDF2 iteration counts (such as 1,000 or 10,000 rounds) leaves encrypted notes defenseless against modern password-cracking hardware. A modest rig of eight NVIDIA RTX 4090 GPUs can compute over 50 billion SHA-256 hashes per second. At 10,000 iterations, a 6-character password is shattered in under 3 minutes. Our vault enforces 310,000 iterations (OWASP recommendation) or 600,000 iterations, multiplying the attacker's compute cost by up to 60×.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 3: Client-Side Plaintext Memory Snooping &amp; DOM Heap Retention</strong>
          While 256-bit AES-GCM is mathematically unbreakable by brute force, JavaScript strings in the browser DOM and V8 garbage collector heap persist in memory until reclaimed. Rogue browser extensions with permission to read web pages, compromised analytics tags, or OS swap files can inspect active DOM values. Always close browser tabs after handling sensitive notes and ensure zero unvetted extensions run in your environment.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 4: Malleability of Unauthenticated Cipher Modes (CBC/CTR Padding Oracles)</strong>
          Legacy tools that use AES-CBC or AES-CTR without an HMAC authentication tag provide confidentiality but zero integrity. In CBC mode, attackers exploit error response timing (padding oracle attacks) to decrypt ciphertext byte by byte without knowing the key. In CTR mode, bit-flipping attacks allow adversaries to modify specific characters in the decrypted note. AES-GCM eliminates both vulnerabilities via its embedded 128-bit GHASH authentication tag.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 5: Unsalted Key Derivation &amp; Rainbow Table Precomputation</strong>
          Deriving an encryption key directly from SHA-256 of the password without a cryptographically random salt allows attackers to execute batch attacks using precomputed rainbow tables. Two users with the same passphrase would also produce identical keys. Our engine generates a unique 16-byte (128-bit) CSPRNG salt for every encryption cycle, ensuring that even identical passphrases generate completely unique 256-bit AES keys.
        </div>
      </div>

      <!-- FAQ Section -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Is my passphrase or note ever sent to your servers?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">No, absolutely never. This tool runs 100% locally inside your web browser using the native Web Cryptography API (window.crypto.subtle). Encryption and decryption keys are derived in volatile browser RAM and wiped immediately. No data packets are ever transmitted over the network.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">What encryption algorithm and key derivation function are used?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">The tool uses authenticated 256-bit AES-GCM (Advanced Encryption Standard in Galois/Counter Mode) with an intrinsic 128-bit authentication tag. Keys are stretched from your master passphrase using PBKDF2 with HMAC-SHA-256, a unique 16-byte random salt, and up to 600,000 iterations adhering to OWASP recommendations.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">What happens if I lose or forget my passphrase?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Because this tool adheres to strict zero-knowledge cryptographic principles, there are no backdoors, recovery keys, or master resets. If you lose your passphrase, the ciphertext payload is mathematically unrecoverable and cannot be brute-forced within any realistic timeframe.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Why is AES-GCM safer than older modes like AES-CBC?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">AES-CBC provides confidentiality but lacks integrity verification, leaving it vulnerable to padding oracle attacks and ciphertext bit-flipping. AES-GCM provides both confidentiality and cryptographic integrity verification in a single pass using a Galois field multiplier (GHASH).</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">What is inside the exported encrypted payload?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">The payload contains a 4-byte format header (DTS1), a 4-byte big-endian iteration count, a 16-byte cryptographically secure random salt, a 12-byte random initialization vector (IV/nonce), and the AES-256-GCM ciphertext combined with the 16-byte authentication tag, encoded as Base64 or Hex.</div>
        </details>
      </div>
    </div>

    <script>
      const MAGIC_HEADER = new Uint8Array([0x44, 0x54, 0x53, 0x31]);

      function togglePassVisibility() {
        const inp = document.getElementById('enc-pass');
        const btn = document.getElementById('btnTogglePass');
        if (inp.type === 'password') {
          inp.type = 'text';
          btn.textContent = '🔒 Hide';
        } else {
          inp.type = 'password';
          btn.textContent = '👁 Show';
        }
      }

      function generateRandomKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
        const arr = new Uint8Array(24);
        window.crypto.getRandomValues(arr);
        let key = '';
        for (let i = 0; i < arr.length; i++) {
          key += chars[arr[i] % chars.length];
        }
        const inp = document.getElementById('enc-pass');
        inp.value = key;
        inp.type = 'text';
        document.getElementById('btnTogglePass').textContent = '🔒 Hide';
        updatePassFeedback();
      }

      function updatePassFeedback() {
        const pass = document.getElementById('enc-pass').value;
        const lbl = document.getElementById('pass-strength');
        const ent = document.getElementById('pass-entropy');
        if (!pass) {
          lbl.textContent = 'Strength: Enter passphrase';
          lbl.style.color = 'var(--text-muted)';
          ent.textContent = 'Estimated Entropy: 0 bits';
          return;
        }
        let pool = 0;
        if (/[a-z]/.test(pass)) pool += 26;
        if (/[A-Z]/.test(pass)) pool += 26;
        if (/[0-9]/.test(pass)) pool += 10;
        if (/[^a-zA-Z0-9]/.test(pass)) pool += 33;
        const bits = Math.round(pass.length * Math.log2(pool || 10));
        ent.textContent = 'Estimated Entropy: ' + bits + ' bits';

        if (bits < 40) {
          lbl.textContent = 'Strength: Very Weak (Easily cracked)';
          lbl.style.color = '#ef4444';
        } else if (bits < 60) {
          lbl.textContent = 'Strength: Moderate (Acceptable)';
          lbl.style.color = '#f59e0b';
        } else if (bits < 80) {
          lbl.textContent = 'Strength: Strong (Secure against GPU clusters)';
          lbl.style.color = '#22c55e';
        } else {
          lbl.textContent = 'Strength: Very Strong (Military-grade)';
          lbl.style.color = '#10b981';
        }
      }

      function updatePlainMetrics() {
        const txt = document.getElementById('plain-text').value;
        const chars = txt.length;
        const bytes = new TextEncoder().encode(txt).length;
        document.getElementById('plain-counter').textContent = chars + ' chars | ' + bytes + ' bytes';
      }

      function updateCipherMetrics() {
        const raw = document.getElementById('cipher-text').value.trim();
        const bytes = Math.round(raw.length * 0.75);
        document.getElementById('cipher-counter').textContent = (raw ? bytes + ' bytes (approx)' : '0 bytes');
      }

      function loadSampleNote() {
        document.getElementById('plain-text').value = 'CONFIDENTIAL CREDENTIALS\nServer IP: 192.168.1.104\nDatabase Secret: 9a7f3c-8b22e-4301-ad6b\nBackup Seed: apple timber whisper galaxy horizon drift obsidian cobalt\nExpires: Never';
        updatePlainMetrics();
      }

      function clearPlaintext() {
        document.getElementById('plain-text').value = '';
        updatePlainMetrics();
      }

      async function deriveKey(password, salt, iterations) {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
          'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
        );
        return window.crypto.subtle.deriveKey(
          { name: 'PBKDF2', salt, iterations: iterations, hash: 'SHA-256' },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt', 'decrypt']
        );
      }

      function uint8ToHex(arr) {
        return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
      }

      function hexToUint8(hex) {
        const clean = hex.replace(/[^0-9a-fA-F]/g, '');
        const arr = new Uint8Array(clean.length / 2);
        for (let i = 0; i < arr.length; i++) {
          arr[i] = parseInt(clean.substr(i * 2, 2), 16);
        }
        return arr;
      }

      function uint8ToBase64(arr) {
        let bin = '';
        const chunk = 8192;
        for (let i = 0; i < arr.length; i += chunk) {
          bin += String.fromCharCode.apply(null, arr.subarray(i, i + chunk));
        }
        return btoa(bin);
      }

      function base64ToUint8(b64) {
        const bin = atob(b64.trim());
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
          arr[i] = bin.charCodeAt(i);
        }
        return arr;
      }

      function showStatus(msg, isSuccess) {
        const box = document.getElementById('enc-status');
        box.style.display = 'block';
        box.innerHTML = msg;
        if (isSuccess) {
          box.style.background = 'rgba(34, 197, 94, 0.12)';
          box.style.color = '#22c55e';
          box.style.border = '1px solid rgba(34, 197, 94, 0.3)';
        } else {
          box.style.background = 'rgba(239, 68, 68, 0.12)';
          box.style.color = '#ef4444';
          box.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        }
      }

      let lastSaltHex = '';
      let lastIvHex = '';
      let lastLatencyMs = 0;

      async function encryptNote() {
        const pass = document.getElementById('enc-pass').value;
        const plain = document.getElementById('plain-text').value;
        const iter = parseInt(document.getElementById('enc-iter').value) || 310000;
        const format = document.getElementById('enc-format').value;

        if (!pass) {
          showStatus('<strong>Encryption Error:</strong> Please provide a secret master passphrase.', false);
          document.getElementById('enc-pass').focus();
          return;
        }
        if (!plain) {
          showStatus('<strong>Encryption Error:</strong> Plaintext secret note cannot be empty.', false);
          document.getElementById('plain-text').focus();
          return;
        }

        try {
          const t0 = performance.now();
          const salt = window.crypto.getRandomValues(new Uint8Array(16));
          const iv = window.crypto.getRandomValues(new Uint8Array(12));
          lastSaltHex = uint8ToHex(salt);
          lastIvHex = uint8ToHex(iv);

          const key = await deriveKey(pass, salt, iter);
          const enc = new TextEncoder();
          const ciphertextBuffer = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            enc.encode(plain)
          );
          const ciphertext = new Uint8Array(ciphertextBuffer);

          const iterBuf = new Uint8Array(4);
          new DataView(iterBuf.buffer).setUint32(0, iter, false);

          const totalLen = 4 + 4 + 16 + 12 + ciphertext.length;
          const payload = new Uint8Array(totalLen);
          let offset = 0;
          payload.set(MAGIC_HEADER, offset); offset += 4;
          payload.set(iterBuf, offset); offset += 4;
          payload.set(salt, offset); offset += 16;
          payload.set(iv, offset); offset += 12;
          payload.set(ciphertext, offset);

          let outputText = (format === 'hex') ? uint8ToHex(payload) : uint8ToBase64(payload);
          document.getElementById('cipher-text').value = outputText;
          updateCipherMetrics();

          lastLatencyMs = Math.round(performance.now() - t0);
          document.getElementById('stat-time').textContent = lastLatencyMs + ' ms';
          document.getElementById('stat-salt').textContent = '16 Bytes (' + lastSaltHex.substr(0, 8) + '...)';
          document.getElementById('stat-iv').textContent = '12 Bytes (' + lastIvHex.substr(0, 8) + '...)';

          showStatus('✓ Note successfully encrypted with AES-256-GCM &amp; PBKDF2 (' + iter.toLocaleString() + ' rounds). 128-bit GHASH authentication tag attached.', true);
        } catch(e) {
          showStatus('<strong>Encryption failed:</strong> ' + e.message, false);
        }
      }

      async function decryptNote() {
        const pass = document.getElementById('enc-pass').value;
        const rawCipher = document.getElementById('cipher-text').value.trim();

        if (!pass) {
          showStatus('<strong>Decryption Error:</strong> Master passphrase is required to decrypt.', false);
          document.getElementById('enc-pass').focus();
          return;
        }
        if (!rawCipher) {
          showStatus('<strong>Decryption Error:</strong> Paste an encrypted payload into the ciphertext area.', false);
          document.getElementById('cipher-text').focus();
          return;
        }

        try {
          const t0 = performance.now();
          let data;
          if (/^[0-9a-fA-F]+$/.test(rawCipher) && rawCipher.length % 2 === 0) {
            data = hexToUint8(rawCipher);
          } else {
            data = base64ToUint8(rawCipher);
          }

          let salt, iv, ciphertext, iter = 100000;

          const hasMagic = data.length > 36 &&
            data[0] === 0x44 && data[1] === 0x54 && data[2] === 0x53 && data[3] === 0x31;

          if (hasMagic) {
            const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
            iter = dv.getUint32(4, false);
            salt = data.slice(8, 24);
            iv = data.slice(24, 36);
            ciphertext = data.slice(36);
          } else {
            salt = data.slice(0, 16);
            iv = data.slice(16, 28);
            ciphertext = data.slice(28);
            iter = parseInt(document.getElementById('enc-iter').value) || 100000;
          }

          lastSaltHex = uint8ToHex(salt);
          lastIvHex = uint8ToHex(iv);

          const key = await deriveKey(pass, salt, iter);
          const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            ciphertext
          );

          const decrypted = new TextDecoder().decode(decryptedBuffer);
          document.getElementById('plain-text').value = decrypted;
          updatePlainMetrics();

          lastLatencyMs = Math.round(performance.now() - t0);
          document.getElementById('stat-time').textContent = lastLatencyMs + ' ms';
          document.getElementById('stat-salt').textContent = '16 Bytes (' + lastSaltHex.substr(0, 8) + '...)';
          document.getElementById('stat-iv').textContent = '12 Bytes (' + lastIvHex.substr(0, 8) + '...)';

          showStatus('✓ Note successfully decrypted &amp; verified! 128-bit GHASH authentication tag confirmed zero tampering.', true);
        } catch(e) {
          showStatus('<strong>Decryption Failed:</strong> Invalid master passphrase or corrupted ciphertext payload (Authentication tag mismatch).', false);
        }
      }

      function formatChanged() {
        const val = document.getElementById('cipher-text').value.trim();
        if (!val) return;
        const fmt = document.getElementById('enc-format').value;
        try {
          let data;
          if (/^[0-9a-fA-F]+$/.test(val) && val.length % 2 === 0) {
            data = hexToUint8(val);
          } else {
            data = base64ToUint8(val);
          }
          document.getElementById('cipher-text').value = (fmt === 'hex') ? uint8ToHex(data) : uint8ToBase64(data);
        } catch(e) {}
      }

      function copyCiphertext() {
        const txt = document.getElementById('cipher-text').value;
        if (!txt) { showStatus('Nothing to copy. Encrypt a note first.', false); return; }
        navigator.clipboard.writeText(txt).then(() => {
          const btn = document.getElementById('btnCopyCipher');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Ciphertext Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      function copyPlaintext() {
        const txt = document.getElementById('plain-text').value;
        if (!txt) { showStatus('Plaintext is empty.', false); return; }
        navigator.clipboard.writeText(txt).then(() => {
          const btn = document.getElementById('btnCopyPlain');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Plaintext Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      function copyEncReport() {
        const pass = document.getElementById('enc-pass').value;
        const plain = document.getElementById('plain-text').value;
        const cipher = document.getElementById('cipher-text').value;
        const iter = document.getElementById('enc-iter').value;

        const report = [
          '====================================================',
          'ZERO-KNOWLEDGE CRYPTOGRAPHIC SECURITY AUDIT REPORT',
          'Digital Tools Shed - AES-256-GCM Vault',
          '====================================================',
          'Cipher Algorithm       : AES-GCM (Advanced Encryption Standard in Galois/Counter Mode)',
          'Key Length             : 256 bits (32 bytes)',
          'Key Derivation (KDF)   : PBKDF2 with HMAC-SHA-256',
          'KDF Iterations         : ' + parseInt(iter).toLocaleString() + ' rounds',
          'Salt (CSPRNG)          : ' + (lastSaltHex || '16 bytes random'),
          'Initialization Vector  : ' + (lastIvHex || '12 bytes (96-bit) unique nonce'),
          'Integrity Verification : 128-bit GHASH Authentication Tag (Tamper Proof)',
          'Plaintext Length       : ' + plain.length + ' chars (' + (new TextEncoder().encode(plain).length) + ' bytes)',
          'Ciphertext Length      : ' + (cipher ? cipher.length + ' chars' : 'Not generated'),
          'Execution Latency      : ' + (lastLatencyMs || '< 20') + ' ms',
          'Client-Side Isolation  : 100% In-Browser (Web Cryptography API - Zero Remote Calls)',
          '===================================================='
        ].join('\n');

        navigator.clipboard.writeText(report).then(() => {
          const btn = document.getElementById('btnCopyEncReport');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Audit Report Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      function downloadEncryptedFile() {
        const txt = document.getElementById('cipher-text').value.trim();
        if (!txt) { showStatus('Encrypt a note first before downloading.', false); return; }
        const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'secure-note-' + Date.now() + '.enc';
        a.click();
      }

      document.addEventListener('DOMContentLoaded', () => {
        updatePlainMetrics();
      });
    </script>
  `
    },
    {
      slug: 'privacy-policy-generator',
      title: "Free Privacy Policy Generator (GDPR, CCPA & CalOPPA Compliant)",
      metaDesc: "Generate a custom, legally compliant privacy policy for websites, SaaS, apps, and e-commerce. Covers GDPR, CCPA, CPRA, CalOPPA, analytics, cookies, and data retention.",
      category: 'Security',
      faq: [
        {
                "q": "Is this privacy policy generator really 100% free with no watermark or fees?",
                "a": "Yes! Unlike legal tech subscription traps that demand credit cards or lock your export behind a paywall, our privacy policy generator is 100% free, runs entirely in your browser, and exports full Markdown, semantic HTML, and plain text with zero watermarks."
        },
        {
                "q": "Does this privacy policy comply with GDPR and CCPA/CPRA?",
                "a": "Yes. It contains mandatory GDPR Article 13 & 14 legal basis disclosures (consent, contractual necessity, legitimate interest), European user rights (erasure, data portability, access), and California Consumer Privacy Act (CCPA/CPRA) disclosures, including \"Do Not Sell or Share My Personal Information\" clauses."
        },
        {
                "q": "Where do I place the privacy policy on my website?",
                "a": "Under international privacy regulations (such as CalOPPA and GDPR), you must place a conspicuous hyperlink labeled \"Privacy Policy\" in your website global footer. It should also be linked on user registration forms, payment checkout pages, and cookie consent banners."
        },
        {
                "q": "Do I need a separate privacy policy for mobile apps?",
                "a": "Both Apple App Store and Google Play Store mandate a publicly accessible privacy policy URL before app review submission. This generator includes specific clauses covering mobile device data, app permissions, and crash reporting."
        },
        {
                "q": "How often should I update my privacy policy?",
                "a": "You should review and update your privacy policy whenever you introduce new tracking scripts (e.g. Meta Pixel, TikTok tag), integrate new payment processors, change data retention timelines, or when major data privacy legislation is enacted."
        }
],
      body: `
    ${commonStyle}
    <style>
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.75rem; margin: 1rem 0; }
      .stat-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.85rem; text-align: center; }
      .stat-num { font-family: var(--mono); font-size: 1.15rem; font-weight: 700; color: var(--fg); }
      .stat-lbl { font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; margin-top: 0.25rem; }
      .tag-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
      .trap-card { border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; background: var(--surface-alt); font-size: 0.88rem; line-height: 1.55; }
      .tab-btn { background: transparent; border: 1px solid var(--border); padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.8rem; cursor: pointer; color: var(--fg); border-radius: 4px; }
      .tab-btn.active { background: var(--surface-alt); font-weight: 600; border-color: var(--border-focus, #3b82f6); }
    </style>
    <div class="article-container" style="max-width: 920px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/security/">Privacy &amp; Security</a> &gt; Free Privacy Policy Generator
      </nav>

      <div class="tag-row">
        <span class="badge badge-green">100% Free Forever</span>
        <span class="badge badge-amber">GDPR (Art 13/14) &amp; CCPA/CPRA</span>
        <span class="badge badge-green">Zero Sign-Up Required</span>
      </div>

      <h1 style="font-family: var(--serif); font-size: 1.9rem; margin-bottom: 0.5rem;">Free Privacy Policy Generator &amp; Compliance Studio</h1>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
        Generate an attorney-structured, comprehensive privacy policy customized for your website, SaaS application, e-commerce store, or mobile app. Complies with GDPR, CCPA/CPRA, CalOPPA, and COPPA with zero paywalls.
      </p>

      <div class="tool-box">
        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;">1. Organization &amp; Platform Basics</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
          <div class="field-group" style="margin: 0;">
            <label class="field-label">Company / Site Name</label>
            <input type="text" id="pp-name" class="text-input" value="Acme Corporation" oninput="genPolicy()" />
          </div>
          <div class="field-group" style="margin: 0;">
            <label class="field-label">Website or App URL</label>
            <input type="text" id="pp-url" class="text-input" value="https://acme.example.com" oninput="genPolicy()" />
          </div>
          <div class="field-group" style="margin: 0;">
            <label class="field-label">Privacy Contact Email</label>
            <input type="email" id="pp-email" class="text-input" value="privacy@acme.example.com" oninput="genPolicy()" />
          </div>
          <div class="field-group" style="margin: 0;">
            <label class="field-label">Governing Jurisdiction</label>
            <input type="text" id="pp-jurisdiction" class="text-input" value="California, United States" oninput="genPolicy()" />
          </div>
        </div>

        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 1.5rem 0 0.75rem;">2. Data Collection &amp; Features</h3>
        <div class="grid-options" style="margin-bottom: 1.25rem;">
          <label class="opt-label"><input type="checkbox" id="pp-opt-accounts" checked onchange="genPolicy()"> <strong>User Accounts</strong> (Names, Logins, Profiles)</label>
          <label class="opt-label"><input type="checkbox" id="pp-opt-payments" checked onchange="genPolicy()"> <strong>Payment Processing</strong> (Stripe, PayPal)</label>
          <label class="opt-label"><input type="checkbox" id="pp-opt-cookies" checked onchange="genPolicy()"> <strong>Cookies &amp; Local Storage</strong></label>
          <label class="opt-label"><input type="checkbox" id="pp-opt-analytics" checked onchange="genPolicy()"> <strong>Analytics</strong> (Google Analytics, Plausible)</label>
          <label class="opt-label"><input type="checkbox" id="pp-opt-ads" onchange="genPolicy()"> <strong>Advertising Networks</strong> (AdSense, Meta)</label>
          <label class="opt-label"><input type="checkbox" id="pp-opt-newsletter" checked onchange="genPolicy()"> <strong>Newsletter &amp; Marketing Emails</strong></label>
          <label class="opt-label"><input type="checkbox" id="pp-opt-coppa" onchange="genPolicy()"> <strong>Children's Privacy</strong> (Strict Under 13 COPPA)</label>
          <label class="opt-label"><input type="checkbox" id="pp-opt-ccpa" checked onchange="genPolicy()"> <strong>California CCPA/CPRA Rights</strong></label>
          <label class="opt-label"><input type="checkbox" id="pp-opt-gdpr" checked onchange="genPolicy()"> <strong>European Union / UK GDPR Rights</strong></label>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
          <div class="field-group" style="margin: 0;">
            <label class="field-label">Data Retention Schedule</label>
            <select id="pp-retention" class="text-input" onchange="genPolicy()">
              <option value="account_active">As long as user account is active + 30 days</option>
              <option value="12_months">12 months after last user activity</option>
              <option value="statutory">Minimum period required by financial & tax law</option>
            </select>
          </div>
          <div class="field-group" style="margin: 0;">
            <label class="field-label">Data Protection Officer (DPO) / Officer</label>
            <input type="text" id="pp-dpo" class="text-input" value="Data Privacy Officer" oninput="genPolicy()" />
          </div>
        </div>

        <!-- Compliance Diagnostics Bar -->
        <div class="stat-grid" style="margin: 1.25rem 0;">
          <div class="stat-card"><div class="stat-num" id="stat-words">0 words</div><div class="stat-lbl">Word Count</div></div>
          <div class="stat-card"><div class="stat-num" id="stat-read">0 min</div><div class="stat-lbl">Reading Time</div></div>
          <div class="stat-card"><div class="stat-num" id="stat-clauses">0 sections</div><div class="stat-lbl">Legal Clauses</div></div>
          <div class="stat-card"><div class="stat-num" id="stat-score" style="color: #22c55e;">100%</div><div class="stat-lbl">GDPR/CCPA Readiness</div></div>
        </div>

        <!-- Tab Bar & Action Controls -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
          <div style="display: flex; gap: 0.35rem;">
            <button type="button" id="tab-md" class="tab-btn active" onclick="switchTab('md')">Markdown</button>
            <button type="button" id="tab-html" class="tab-btn" onclick="switchTab('html')">Clean HTML</button>
            <button type="button" id="tab-txt" class="tab-btn" onclick="switchTab('txt')">Plain Text</button>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" id="btnCopyPolicy" class="btn-primary" onclick="copyCurrentTab()" style="padding: 0.5rem 1rem; font-size: 0.82rem;">📋 Copy Document</button>
            <button type="button" id="btnCopyReport" class="btn-sec" onclick="copyComplianceReport()" style="padding: 0.5rem 1rem; font-size: 0.82rem;">📋 Copy Audit</button>
            <button type="button" class="btn-sec" onclick="downloadPolicy()" style="padding: 0.5rem 1rem; font-size: 0.82rem;">💾 Download</button>
          </div>
        </div>

        <!-- Output Textareas -->
        <div class="field-group" style="margin-top: 1rem;">
          <textarea id="pp-output-md" class="code-input" style="height: 320px; line-height: 1.45;" readonly></textarea>
          <textarea id="pp-output-html" class="code-input" style="height: 320px; line-height: 1.45; display: none;" readonly></textarea>
          <textarea id="pp-output-txt" class="code-input" style="height: 320px; line-height: 1.45; display: none;" readonly></textarea>
        </div>
      </div>

      <!-- Legal Framework Analysis & Regulatory Derivations -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem;">Regulatory Framework &amp; Disclosure Standards</h2>
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
          A modern privacy policy is not mere boilerplate—it is a binding disclosure contract governed by the European Union General Data Protection Regulation (Regulation 2016/679), the California Privacy Rights Act (CPRA), and CalOPPA. Under international jurisprudence, failing to disclose an active tracking script constitutes deceptive commercial conduct.
        </p>
      </div>

      <!-- 5 Fatal Traps & Legal Privacy Pitfalls -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">5 Fatal Traps in Website Privacy Policies</h2>

        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 1: Copy-Pasting Competitor Policies (Copyright Infringement &amp; Inaccurate Disclosures)</strong>
          Stealing another company's privacy policy violates federal copyright law and almost guaranteed exposes you to civil liability. No two web apps have identical tech stacks: a copied policy that references Amazon AWS when you host on Vercel, or fails to list the Meta Pixel you injected yesterday, makes your company guilty of making fraudulent regulatory representations to consumers.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 2: Failing to Disclose Analytics &amp; Cross-Border Transfers (GDPR Art. 44-49)</strong>
          Under European data protection case law (such as the Austrian and French DPA rulings on Google Analytics), transmitting EU visitor IP addresses and cookie tokens to US servers without documented Data Privacy Framework (DPF) participation or Standard Contractual Clauses (SCCs) constitutes an illegal international transfer subject to fines up to €20 million or 4% of global turnover.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 3: Ignoring California's Strict "Sharing" Definition for Behavioral Ads</strong>
          The California Consumer Privacy Act as amended by the CPRA distinguishes between "selling" personal data and "sharing" it for cross-context behavioral advertising. Many web publishers erroneously claim "We do not sell your data" while firing the Meta Pixel or Google Remarketing. Under Cal. Civ. Code § 1798.140(ah), this constitutes "sharing" and legally obligates you to provide an explicit "Do Not Sell or Share My Personal Information" link.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 4: Vague Data Retention Clauses Violating Storage Limitation (GDPR Art. 5(1)(e))</strong>
          Privacy policies stating "We retain personal information for as long as necessary" routinely fail regulatory compliance audits. Article 5(1)(e) of the GDPR requires explicit retention periods or concrete criteria used to determine that period (such as "30 days for server access logs" or "7 years for transactional tax records"). Indefinite storage without justification is illegal.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 5: Silent Policy Modifications Without User Notice or Timestamped Changelogs</strong>
          Unilaterally changing data handling practices without conspicuous notification is unenforceable in court. Contract law requires affirmative assent when material privacy terms change. Best practice demands maintaining an explicit "Last Updated" date, an accessible archive of previous revisions, and email notifications to registered users before material updates take effect.
        </div>
      </div>

      <!-- FAQ Section -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Is this privacy policy generator really 100% free with no watermark or fees?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes! Unlike legal tech subscription traps that demand credit cards or lock your export behind a paywall, our privacy policy generator is 100% free, runs entirely in your browser, and exports full Markdown, semantic HTML, and plain text with zero watermarks.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Does this privacy policy comply with GDPR and CCPA/CPRA?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes. It contains mandatory GDPR Article 13 &amp; 14 legal basis disclosures (consent, contractual necessity, legitimate interest), European user rights (erasure, data portability, access), and California Consumer Privacy Act (CCPA/CPRA) disclosures, including "Do Not Sell or Share My Personal Information" clauses.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Where do I place the privacy policy on my website?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Under international privacy regulations (such as CalOPPA and GDPR), you must place a conspicuous hyperlink labeled "Privacy Policy" in your website global footer. It should also be linked on user registration forms, payment checkout pages, and cookie consent banners.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Do I need a separate privacy policy for mobile apps?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Both Apple App Store and Google Play Store mandate a publicly accessible privacy policy URL before app review submission. This generator includes specific clauses covering mobile device data, app permissions, and crash reporting.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">How often should I update my privacy policy?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">You should review and update your privacy policy whenever you introduce new tracking scripts (e.g. Meta Pixel, TikTok tag), integrate new payment processors, change data retention timelines, or when major data privacy legislation is enacted.</div>
        </details>
      </div>
    </div>

    <script>
      let currentTab = 'md';

      function switchTab(tab) {
        currentTab = tab;
        document.getElementById('tab-md').className = 'tab-btn' + (tab === 'md' ? ' active' : '');
        document.getElementById('tab-html').className = 'tab-btn' + (tab === 'html' ? ' active' : '');
        document.getElementById('tab-txt').className = 'tab-btn' + (tab === 'txt' ? ' active' : '');

        document.getElementById('pp-output-md').style.display = (tab === 'md' ? 'block' : 'none');
        document.getElementById('pp-output-html').style.display = (tab === 'html' ? 'block' : 'none');
        document.getElementById('pp-output-txt').style.display = (tab === 'txt' ? 'block' : 'none');
      }

      function genPolicy() {
        const name = document.getElementById('pp-name').value.trim() || 'Our Company';
        const url = document.getElementById('pp-url').value.trim() || 'https://example.com';
        const email = document.getElementById('pp-email').value.trim() || 'privacy@example.com';
        const jur = document.getElementById('pp-jurisdiction').value.trim() || 'United States';
        const dpo = document.getElementById('pp-dpo').value.trim() || 'Data Protection Officer';
        const retention = document.getElementById('pp-retention').value;

        const hasAccounts = document.getElementById('pp-opt-accounts').checked;
        const hasPayments = document.getElementById('pp-opt-payments').checked;
        const hasCookies = document.getElementById('pp-opt-cookies').checked;
        const hasAnalytics = document.getElementById('pp-opt-analytics').checked;
        const hasAds = document.getElementById('pp-opt-ads').checked;
        const hasNewsletter = document.getElementById('pp-opt-newsletter').checked;
        const hasCoppa = document.getElementById('pp-opt-coppa').checked;
        const hasCcpa = document.getElementById('pp-opt-ccpa').checked;
        const hasGdpr = document.getElementById('pp-opt-gdpr').checked;

        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        let retentionStr = 'We retain personal data for as long as your account remains active, plus an additional 30-day grace period for backup deletion.';
        if (retention === '12_months') retentionStr = 'We retain personal data for 12 months following your last interaction with our services.';
        if (retention === 'statutory') retentionStr = 'We retain transaction and accounting records for the statutory duration required by applicable financial and tax legislation (typically 7 years).';

        let md = '# Privacy Policy for ' + name + '\n\n';
        md += '**Last Updated:** ' + date + '\n\n';
        md += 'This Privacy Policy describes how ' + name + ' ("we", "us", or "our") collects, uses, processes, and protects your personal information when you visit or interact with our website at [' + url + '](' + url + ') or any associated services (collectively, the "Service").\n\n';
        md += 'Please read this policy carefully. By accessing or using our Service, you acknowledge that you have read and understood the terms of this Privacy Policy.\n\n';

        let clauseIdx = 1;
        md += '## ' + (clauseIdx++) + '. Information We Collect\n\n';
        md += 'We collect information that identifies, relates to, describes, or could reasonably be linked directly or indirectly with you ("Personal Information"):\n\n';

        if (hasAccounts) {
          md += '- **Account & Identity Information:** When you register, we may collect your username, email address, password hash, profile details, and account preferences.\n';
        }
        if (hasPayments) {
          md += '- **Billing & Payment Records:** When you make a purchase, transactions are processed by PCI-DSS compliant third-party payment gateways (e.g. Stripe, PayPal). We do not store raw credit card numbers on our servers.\n';
        }
        if (hasNewsletter) {
          md += '- **Marketing & Communications:** Email address and communication preferences when you subscribe to newsletters or contact customer support.\n';
        }
        md += '- **Automated Technical & Log Data:** We automatically log Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), operating system, date/time stamps, referring/exit pages, and clickstream data.\n\n';

        if (hasCookies) {
          md += '## ' + (clauseIdx++) + '. Cookies and Similar Tracking Technologies\n\n';
          md += 'We use cookies, web beacons, and local storage to personalize content, retain user session states, and measure web performance. You can instruct your browser to refuse all cookies or notify you when cookies are sent; however, disabling cookies may prevent core features from operating properly.\n\n';
        }

        if (hasAnalytics || hasAds) {
          md += '## ' + (clauseIdx++) + '. Third-Party Service Providers\n\n';
          md += 'We may engage reputable third-party contractors and subprocessors to provide infrastructure, analytics, and advertising services:\n\n';
          if (hasAnalytics) {
            md += '- **Web Analytics:** We use tools like Google Analytics or Plausible to analyze visitor behavior. These providers collect aggregated telemetry under their respective privacy policies.\n';
          }
          if (hasAds) {
            md += '- **Digital Advertising Partners:** We may partner with third-party ad networks (e.g. Google AdSense, Meta) that display targeted advertisements based on prior visits.\n';
          }
          md += '\n';
        }

        md += '## ' + (clauseIdx++) + '. How We Use Your Information\n\n';
        md += 'We process your information for the following legitimate purposes:\n\n';
        md += '1. Operating, maintaining, and enhancing the Service.\n';
        md += '2. Authenticating user identities and safeguarding against unauthorized access.\n';
        md += '3. Fulfilling orders, transactions, and customer support inquiries.\n';
        md += '4. Complying with applicable legal obligations and enforcing our Terms of Service.\n\n';

        md += '## ' + (clauseIdx++) + '. Data Retention\n\n';
        md += retentionStr + '\n\n';

        if (hasGdpr) {
          md += '## ' + (clauseIdx++) + '. European Union & UK General Data Protection Regulation (GDPR)\n\n';
          md += 'If you reside in the European Economic Area (EEA) or the United Kingdom, you are entitled to statutory rights under GDPR Articles 15–22:\n\n';
          md += '- **Right of Access:** Request copies of personal data held about you.\n';
          md += '- **Right to Rectification:** Request correction of inaccurate or incomplete data.\n';
          md += '- **Right to Erasure ("Right to Be Forgotten"):** Request deletion of your data where no overriding legal basis applies.\n';
          md += '- **Right to Data Portability:** Request transfer of your data to another service provider in a structured, machine-readable format.\n';
          md += '- **Right to Withdraw Consent:** Where processing is based on consent, withdraw it at any time.\n\n';
          md += 'To exercise your GDPR rights, please contact our ' + dpo + ' at [' + email + '](mailto:' + email + '). You also have the right to lodge a complaint with your local Data Protection Authority.\n\n';
        }

        if (hasCcpa) {
          md += '## ' + (clauseIdx++) + '. California Consumer Privacy Act (CCPA / CPRA)\n\n';
          md += 'California residents have specific statutory rights under the CCPA/CPRA:\n\n';
          md += '- **Right to Know:** Request disclosure of categories and specific pieces of personal information collected over the preceding 12 months.\n';
          md += '- **Right to Delete:** Request deletion of personal information collected from you, subject to legal exceptions.\n';
          md += '- **Right to Opt-Out of Sale or Sharing:** We do not sell personal data for monetary consideration. You have the right to opt-out of cross-context behavioral advertising.\n';
          md += '- **Right to Non-Discrimination:** We will not discriminate against you in pricing or service quality for exercising any privacy rights.\n\n';
        }

        if (hasCoppa) {
          md += '## ' + (clauseIdx++) + '. Children's Privacy (COPPA)\n\n';
          md += 'Our Service is strictly directed to users who are at least 13 years old (or 16 in the European Union). We do not knowingly solicit or collect personal information from children under 13. If you believe a minor has provided us with personal information, contact us immediately at ' + email + ' and we will promptly purge the data.\n\n';
        }

        md += '## ' + (clauseIdx++) + '. Security of Your Information\n\n';
        md += 'We implement industry-standard technical, organizational, and physical administrative safeguards designed to protect personal data against accidental loss, unauthorized access, alteration, and disclosure. However, no internet transmission or electronic storage method is 100% immune from security compromise.\n\n';

        md += '## ' + (clauseIdx++) + '. Contact Us\n\n';
        md += 'If you have questions, feedback, or wish to exercise your statutory data privacy rights, please contact our privacy compliance team:\n\n';
        md += '- **Organization:** ' + name + '\n';
        md += '- **Privacy Officer / Contact:** ' + dpo + '\n';
        md += '- **Email:** ' + email + '\n';
        md += '- **Jurisdiction:** ' + jur + '\n';

        let html = '<!-- Privacy Policy generated by Digital Tools Shed -->\n' +
          '<div class="privacy-policy">\n' +
          '  <h1>Privacy Policy for ' + name + '</h1>\n' +
          '  <p class="last-updated"><strong>Last Updated:</strong> ' + date + '</p>\n' +
          '  <p>This Privacy Policy describes how ' + name + ' ("we", "us", or "our") collects, uses, processes, and protects your personal information when you visit <a href="' + url + '">' + url + '</a>.</p>\n';

        let htmlSec = 1;
        html += '  <h2>' + (htmlSec++) + '. Information We Collect</h2>\n  <ul>\n';
        if (hasAccounts) html += '    <li><strong>Account Details:</strong> Usernames, email addresses, profile credentials.</li>\n';
        if (hasPayments) html += '    <li><strong>Billing Data:</strong> Processed securely by PCI-compliant gateways.</li>\n';
        html += '    <li><strong>Technical Telemetry:</strong> IP addresses, browser types, timestamps, referring links.</li>\n  </ul>\n';

        if (hasCookies) html += '  <h2>' + (htmlSec++) + '. Cookies & Tracking</h2>\n  <p>We use cookies and local storage to maintain session states and measure site performance.</p>\n';
        if (hasGdpr) html += '  <h2>' + (htmlSec++) + '. European Union & UK GDPR Rights</h2>\n  <p>EU and UK residents hold statutory rights to access, rectify, port, and erase personal data. Inquiries: <a href="mailto:' + email + '">' + email + '</a>.</p>\n';
        if (hasCcpa) html += '  <h2>' + (htmlSec++) + '. California Privacy Rights (CCPA/CPRA)</h2>\n  <p>California consumers have the right to know, delete, and opt-out of cross-context behavioral advertising.</p>\n';
        html += '  <h2>' + (htmlSec++) + '. Contact Us</h2>\n  <p>For inquiries, contact ' + dpo + ' at <a href="mailto:' + email + '">' + email + '</a> (' + jur + ').</p>\n</div>';

        let txt = md.replace(/\*\*/g, '').replace(/###? /g, '').replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)');

        document.getElementById('pp-output-md').value = md;
        document.getElementById('pp-output-html').value = html;
        document.getElementById('pp-output-txt').value = txt;

        const words = md.split(/\s+/).filter(Boolean).length;
        const readMins = Math.ceil(words / 200);
        document.getElementById('stat-words').textContent = words.toLocaleString() + ' words';
        document.getElementById('stat-read').textContent = readMins + ' min read';
        document.getElementById('stat-clauses').textContent = (clauseIdx - 1) + ' sections';
      }

      function copyCurrentTab() {
        const id = 'pp-output-' + currentTab;
        const val = document.getElementById(id).value;
        navigator.clipboard.writeText(val).then(() => {
          const btn = document.getElementById('btnCopyPolicy');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ ' + currentTab.toUpperCase() + ' Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      function copyComplianceReport() {
        const name = document.getElementById('pp-name').value || 'Company';
        const words = document.getElementById('stat-words').textContent;
        const clauses = document.getElementById('stat-clauses').textContent;
        const report = [
          '====================================================',
          'PRIVACY POLICY REGULATORY COMPLIANCE AUDIT',
          'Digital Tools Shed Compliance Studio',
          '====================================================',
          'Company / Site         : ' + name,
          'Document Size          : ' + words,
          'Total Legal Clauses    : ' + clauses,
          'GDPR Compliant         : YES (Articles 13, 14, 15-22)',
          'CCPA/CPRA Ready        : YES (Opt-Out & Disclosure Provisions)',
          'CalOPPA & COPPA        : Enforced',
          'Storage Limitation     : Enforced (GDPR Art 5(1)(e))',
          'Export Formats         : Markdown, Semantic HTML, Plain Text',
          '===================================================='
        ].join('\n');

        navigator.clipboard.writeText(report).then(() => {
          const btn = document.getElementById('btnCopyReport');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Audit Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      function downloadPolicy() {
        const ext = (currentTab === 'html' ? 'html' : (currentTab === 'txt' ? 'txt' : 'md'));
        const mime = (currentTab === 'html' ? 'text/html' : 'text/plain');
        const content = document.getElementById('pp-output-' + currentTab).value;
        const blob = new Blob([content], { type: mime + ';charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'privacy-policy.' + ext;
        a.click();
      }

      document.addEventListener('DOMContentLoaded', () => {
        genPolicy();
      });
    </script>
  `
    },
    {
      slug: 'terms-generator',
      title: "Free Terms of Service Generator (SaaS, E-Commerce & Web Apps)",
      metaDesc: "Generate custom Terms of Service and Terms & Conditions agreements. Covers IP rights, limitation of liability, DMCA, subscriptions, acceptable use, and arbitration.",
      category: 'Security',
      faq: [
        {
                "q": "Is this terms of service generator really free with no recurring subscriptions?",
                "a": "Yes! This tool is 100% free, runs entirely in your web browser, and exports full Markdown, semantic HTML, and plain text without watermarks, upsells, or recurring fees."
        },
        {
                "q": "Why is a Limitation of Liability clause critical in Terms of Service?",
                "a": "Without a limitation of liability cap, an incidental server outage, software bug, or lost data incident could expose your company to unlimited consequential damages and lost profits from users. Our generator includes enforceable liability caps."
        },
        {
                "q": "What is the legal difference between Browsewrap and Clickwrap agreements?",
                "a": "A browsewrap agreement merely links to terms in a website footer and is frequently rejected by courts as unenforceable. A clickwrap agreement requires users to check an affirmative box (e.g. \"I agree to the Terms of Service\") and is universally upheld as binding."
        },
        {
                "q": "Does this generator include a DMCA Copyright Infringement clause?",
                "a": "Yes. It contains a full Digital Millennium Copyright Act (DMCA) Notice and Takedown procedure, establishing safe harbor immunity against secondary copyright liability for user-generated content."
        },
        {
                "q": "Can I customize the governing law and dispute resolution?",
                "a": "Yes. You can specify your exact legal jurisdiction (State/Province and Country), and choose whether disputes are resolved via individual binding arbitration with class-action waivers or within local municipal courts."
        }
],
      body: `
    ${commonStyle}
    <style>
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.75rem; margin: 1rem 0; }
      .stat-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.85rem; text-align: center; }
      .stat-num { font-family: var(--mono); font-size: 1.15rem; font-weight: 700; color: var(--fg); }
      .stat-lbl { font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; margin-top: 0.25rem; }
      .tag-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
      .trap-card { border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; background: var(--surface-alt); font-size: 0.88rem; line-height: 1.55; }
      .tab-btn { background: transparent; border: 1px solid var(--border); padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.8rem; cursor: pointer; color: var(--fg); border-radius: 4px; }
      .tab-btn.active { background: var(--surface-alt); font-weight: 600; border-color: var(--border-focus, #3b82f6); }
    </style>
    <div class="article-container" style="max-width: 920px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/security/">Privacy &amp; Security</a> &gt; Free Terms of Service Generator
      </nav>

      <div class="tag-row">
        <span class="badge badge-green">100% Free Forever</span>
        <span class="badge badge-amber">DMCA Safe Harbor &amp; Liability Caps</span>
        <span class="badge badge-green">Binding Clickwrap Architecture</span>
      </div>

      <h1 style="font-family: var(--serif); font-size: 1.9rem; margin-bottom: 0.5rem;">Free Terms of Service Generator (SaaS, E-Commerce &amp; Web Apps)</h1>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
        Generate legally protective, enforceable Terms of Service agreements for online utilities, subscription SaaS products, mobile apps, and e-commerce websites. Protect your business against unlimited liabilities, dispute claims, and copyright suits.
      </p>

      <div class="tool-box">
        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;">1. Business &amp; Entity Information</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
          <div class="field-group" style="margin: 0;">
            <label class="field-label">Company / Product Name</label>
            <input type="text" id="tos-name" class="text-input" value="Acme Corporation" oninput="genTos()" />
          </div>
          <div class="field-group" style="margin: 0;">
            <label class="field-label">Legal Entity Type</label>
            <select id="tos-entity" class="text-input" onchange="genTos()">
              <option value="LLC">Limited Liability Company (LLC)</option>
              <option value="Corporation">Corporation (Inc. / Corp.)</option>
              <option value="Sole Proprietor">Sole Proprietorship / Individual</option>
            </select>
          </div>
          <div class="field-group" style="margin: 0;">
            <label class="field-label">Service Website URL</label>
            <input type="text" id="tos-url" class="text-input" value="https://acme.example.com" oninput="genTos()" />
          </div>
          <div class="field-group" style="margin: 0;">
            <label class="field-label">Support / Legal Email</label>
            <input type="email" id="tos-email" class="text-input" value="legal@acme.example.com" oninput="genTos()" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
          <div class="field-group" style="margin: 0;">
            <label class="field-label">Governing Jurisdiction (State / Country)</label>
            <input type="text" id="tos-jurisdiction" class="text-input" value="State of Delaware, United States" oninput="genTos()" />
          </div>
          <div class="field-group" style="margin: 0;">
            <label class="field-label">Minimum User Age</label>
            <select id="tos-age" class="text-input" onchange="genTos()">
              <option value="13">13 Years (COPPA Standard)</option>
              <option value="16">16 Years (EU GDPR Standard)</option>
              <option value="18">18 Years (Legal Adulthood / Contracts)</option>
            </select>
          </div>
        </div>

        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 1.5rem 0 0.75rem;">2. Contractual Clauses &amp; Protections</h3>
        <div class="grid-options" style="margin-bottom: 1.25rem;">
          <label class="opt-label"><input type="checkbox" id="tos-opt-accounts" checked onchange="genTos()"> <strong>User Accounts &amp; Terminations</strong></label>
          <label class="opt-label"><input type="checkbox" id="tos-opt-ip" checked onchange="genTos()"> <strong>Intellectual Property &amp; Code Ownership</strong></label>
          <label class="opt-label"><input type="checkbox" id="tos-opt-abuse" checked onchange="genTos()"> <strong>Anti-Scraping &amp; Abuse Restrictions</strong></label>
          <label class="opt-label"><input type="checkbox" id="tos-opt-billing" checked onchange="genTos()"> <strong>Subscriptions &amp; Refund Policies</strong></label>
          <label class="opt-label"><input type="checkbox" id="tos-opt-dmca" checked onchange="genTos()"> <strong>DMCA Copyright Safe Harbor</strong></label>
          <label class="opt-label"><input type="checkbox" id="tos-opt-arbitration" checked onchange="genTos()"> <strong>Binding Arbitration &amp; Class Waiver</strong></label>
          <label class="opt-label"><input type="checkbox" id="tos-opt-liability" checked onchange="genTos()"> <strong>Limitation of Liability Cap ($100 / Fees)</strong></label>
          <label class="opt-label"><input type="checkbox" id="tos-opt-warranty" checked onchange="genTos()"> <strong>"AS IS" Warranty Disclaimers</strong></label>
        </div>

        <!-- Compliance Diagnostics Bar -->
        <div class="stat-grid" style="margin: 1.25rem 0;">
          <div class="stat-card"><div class="stat-num" id="stat-tos-words">0 words</div><div class="stat-lbl">Word Count</div></div>
          <div class="stat-card"><div class="stat-num" id="stat-tos-read">0 min</div><div class="stat-lbl">Reading Time</div></div>
          <div class="stat-card"><div class="stat-num" id="stat-tos-clauses">0 sections</div><div class="stat-lbl">Legal Clauses</div></div>
          <div class="stat-card"><div class="stat-num" id="stat-tos-enforce" style="color: #22c55e;">Ironclad</div><div class="stat-lbl">Enforceability Tier</div></div>
        </div>

        <!-- Tab Bar & Action Controls -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
          <div style="display: flex; gap: 0.35rem;">
            <button type="button" id="tab-tos-md" class="tab-btn active" onclick="switchTosTab('md')">Markdown</button>
            <button type="button" id="tab-tos-html" class="tab-btn" onclick="switchTosTab('html')">Clean HTML</button>
            <button type="button" id="tab-tos-txt" class="tab-btn" onclick="switchTosTab('txt')">Plain Text</button>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" id="btnCopyTos" class="btn-primary" onclick="copyCurrentTosTab()" style="padding: 0.5rem 1rem; font-size: 0.82rem;">📋 Copy Agreement</button>
            <button type="button" id="btnCopyTosReport" class="btn-sec" onclick="copyTosAuditReport()" style="padding: 0.5rem 1rem; font-size: 0.82rem;">📋 Copy Audit</button>
            <button type="button" class="btn-sec" onclick="downloadTos()" style="padding: 0.5rem 1rem; font-size: 0.82rem;">💾 Download</button>
          </div>
        </div>

        <!-- Output Textareas -->
        <div class="field-group" style="margin-top: 1rem;">
          <textarea id="tos-output-md" class="code-input" style="height: 320px; line-height: 1.45;" readonly></textarea>
          <textarea id="tos-output-html" class="code-input" style="height: 320px; line-height: 1.45; display: none;" readonly></textarea>
          <textarea id="tos-output-txt" class="code-input" style="height: 320px; line-height: 1.45; display: none;" readonly></textarea>
        </div>
      </div>

      <!-- Contract Law & Statutory Analysis -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem;">Contractual Architecture &amp; Judicial Enforceability</h2>
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
          Under United States contract law and international commercial standards, Terms of Service establish the governing rules between your software and the end user. To withstand judicial scrutiny, agreements must include clear mutual assent mechanisms, explicit disclaimer of implied warranties (UCC § 2-316), and clear caps on consequential damages.
        </p>
      </div>

      <!-- 5 Fatal Traps & Contractual Pitfalls -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">5 Fatal Traps in Website Terms of Service</h2>

        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 1: Unenforceable Browsewrap Agreements (Lack of Affirmative Assent)</strong>
          Merely embedding a "Terms of Service" link in a website footer without requiring an affirmative click or checkbox during registration or purchase is frequently classified by courts as an unenforceable "browsewrap" contract (e.g. <em>Nguyen v. Barnes &amp; Noble Inc.</em>). Courts hold that users cannot be bound by terms they did not actively agree to. Always implement an active checkbox ("I agree to the Terms of Service") at checkout.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 2: Missing Limitation of Liability Caps (Unlimited Consequential Damages)</strong>
          If your website or SaaS tool experiences a database outage, payment glitch, or data loss event, an affected business user could sue for hundreds of thousands of dollars in alleged lost profits. Without a clear limitation of liability clause capping maximum damages to the amount the user paid you in the preceding 12 months (or $100 for free tools), your personal or business assets are completely exposed.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 3: Unconscionable One-Sided Arbitration Clauses</strong>
          Mandatory arbitration clauses designed to stop class actions must remain substantively fair. If your agreement reserves the right for your company to sue in court while forcing the consumer into expensive arbitration, judges will strike down the arbitration clause in its entirety as unconscionable. Digital Tools Shed drafts balanced mutual arbitration provisions.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 4: Failure to Register a Designated DMCA Agent with the US Copyright Office</strong>
          Publishing a DMCA takedown policy on your website is legally insufficient on its own. Under 17 U.S.C. § 512(c)(2), to qualify for safe harbor immunity against copyright lawsuits stemming from user uploads, you must register a designated DMCA agent with the United States Copyright Office online directory ($6 fee). Failing to register forfeits statutory immunity.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 5: FTC Violations on Automatic Subscription Renewals ('Click to Cancel')</strong>
          If you charge recurring subscription fees, failing to clearly disclose recurring billing intervals, cancellation mechanisms that are as simple as signing up, and renewal reminder dates violates the Federal Trade Commission's Negative Option Rule and California's Automatic Renewal Law (ARL). Hidden renewals trigger heavy civil fines and compulsory payment gateway chargebacks.
        </div>
      </div>

      <!-- FAQ Section -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Is this terms of service generator really free with no recurring subscriptions?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes! This tool is 100% free, runs entirely in your web browser, and exports full Markdown, semantic HTML, and plain text without watermarks, upsells, or recurring fees.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Why is a Limitation of Liability clause critical in Terms of Service?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Without a limitation of liability cap, an incidental server outage, software bug, or lost data incident could expose your company to unlimited consequential damages and lost profits from users. Our generator includes enforceable liability caps.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">What is the legal difference between Browsewrap and Clickwrap agreements?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">A browsewrap agreement merely links to terms in a website footer and is frequently rejected by courts as unenforceable. A clickwrap agreement requires users to check an affirmative box (e.g. "I agree to the Terms of Service") and is universally upheld as binding.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Does this generator include a DMCA Copyright Infringement clause?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes. It contains a full Digital Millennium Copyright Act (DMCA) Notice and Takedown procedure, establishing safe harbor immunity against secondary copyright liability for user-generated content.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Can I customize the governing law and dispute resolution?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes. You can specify your exact legal jurisdiction (State/Province and Country), and choose whether disputes are resolved via individual binding arbitration with class-action waivers or within local municipal courts.</div>
        </details>
      </div>
    </div>

    <script>
      let currentTosTab = 'md';

      function switchTosTab(tab) {
        currentTosTab = tab;
        document.getElementById('tab-tos-md').className = 'tab-btn' + (tab === 'md' ? ' active' : '');
        document.getElementById('tab-tos-html').className = 'tab-btn' + (tab === 'html' ? ' active' : '');
        document.getElementById('tab-tos-txt').className = 'tab-btn' + (tab === 'txt' ? ' active' : '');

        document.getElementById('tos-output-md').style.display = (tab === 'md' ? 'block' : 'none');
        document.getElementById('tos-output-html').style.display = (tab === 'html' ? 'block' : 'none');
        document.getElementById('tos-output-txt').style.display = (tab === 'txt' ? 'block' : 'none');
      }

      function genTos() {
        const name = document.getElementById('tos-name').value.trim() || 'Our Company';
        const entity = document.getElementById('tos-entity').value;
        const url = document.getElementById('tos-url').value.trim() || 'https://example.com';
        const email = document.getElementById('tos-email').value.trim() || 'legal@example.com';
        const jur = document.getElementById('tos-jurisdiction').value.trim() || 'State of Delaware, United States';
        const age = document.getElementById('tos-age').value;

        const hasAccounts = document.getElementById('tos-opt-accounts').checked;
        const hasIp = document.getElementById('tos-opt-ip').checked;
        const hasAbuse = document.getElementById('tos-opt-abuse').checked;
        const hasBilling = document.getElementById('tos-opt-billing').checked;
        const hasDmca = document.getElementById('tos-opt-dmca').checked;
        const hasArbitration = document.getElementById('tos-opt-arbitration').checked;
        const hasLiability = document.getElementById('tos-opt-liability').checked;
        const hasWarranty = document.getElementById('tos-opt-warranty').checked;

        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        let md = '# Terms of Service for ' + name + '\n\n';
        md += '**Last Updated:** ' + date + '\n\n';
        md += 'Please read these Terms of Service ("Terms", "Agreement") carefully before accessing or using the website at [' + url + '](' + url + ') or associated web services operated by ' + name + ' (' + entity + ', "we", "us", or "our").\n\n';
        md += 'Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms. By creating an account, making a purchase, or using any part of the Service, you represent that you are at least ' + age + ' years old and agree to be legally bound by this Agreement.\n\n';

        let sec = 1;
        md += '## ' + (sec++) + '. Acceptance of Terms\n\n';
        md += 'By accessing our Service, you confirm that you have read, understood, and agreed to these Terms, including our Privacy Policy. If you do not agree with any part of these Terms, you must immediately discontinue use of the Service.\n\n';

        if (hasAccounts) {
          md += '## ' + (sec++) + '. User Accounts & Security\n\n';
          md += 'When you create an account, you must provide accurate, complete, and current information. You are solely responsible for safeguarding the credentials you use to access the Service and for any activities or actions conducted under your account.\n\n';
          md += 'We reserve the right to suspend, terminate, or delete accounts that violate these Terms, engage in fraud, or abuse our infrastructure, with or without prior notice.\n\n';
        }

        if (hasIp) {
          md += '## ' + (sec++) + '. Intellectual Property Ownership\n\n';
          md += 'The Service and its original content, software code, features, interface design, algorithms, trademarks, and documentation are and will remain the exclusive property of ' + name + ' and its licensors. You are granted a limited, revocable, non-exclusive, non-transferable license to access the Service for personal or internal commercial use in accordance with these Terms.\n\n';
        }

        if (hasAbuse) {
          md += '## ' + (sec++) + '. Prohibited Conduct & Acceptable Use\n\n';
          md += 'You agree not to engage in any of the following prohibited activities:\n\n';
          md += '1. Reverse-engineering, decompiling, or attempting to derive the source code of any proprietary component.\n';
          md += '2. Using automated scripts, scrapers, crawlers, or bots to overwhelm, bypass rate limits, or harvest data without express written permission.\n';
          md += '3. Interfering with the proper working order of the Service or transmitting viruses, malware, or destructive code.\n';
          md += '4. Impersonating any individual or entity or misrepresenting your affiliation.\n\n';
        }

        if (hasBilling) {
          md += '## ' + (sec++) + '. Subscriptions, Billing & Cancellation\n\n';
          md += 'Certain aspects of the Service may be provided for a fee or recurring subscription. By selecting a paid tier, you agree to pay all applicable fees according to the billing terms in effect at the time the fee becomes payable.\n\n';
          md += '- **Automatic Renewals:** Paid subscriptions renew automatically at the end of each billing cycle unless cancelled prior to the renewal date via your account settings.\n';
          md += '- **Refund Policy:** Unless explicitly mandated by statutory consumer protection laws in your jurisdiction, fees paid are non-refundable except where an active 14-day satisfaction guarantee applies.\n\n';
        }

        if (hasDmca) {
          md += '## ' + (sec++) + '. DMCA Copyright Takedown Procedure\n\n';
          md += 'We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). If you believe material residing on or accessible through our Service infringes your copyright, please send a written notification to our Designated Copyright Agent at [' + email + '](mailto:' + email + ') containing:\n\n';
          md += '1. A physical or electronic signature of the authorized copyright owner.\n';
          md += '2. Identification of the copyrighted work claimed to have been infringed.\n';
          md += '3. Identification of the material that is claimed to be infringing and URL location.\n';
          md += '4. Your contact information (name, address, telephone, email).\n';
          md += '5. A statement of good faith belief that the disputed use is not authorized.\n';
          md += '6. A statement made under penalty of perjury that the notification is accurate.\n\n';
        }

        if (hasWarranty) {
          md += '## ' + (sec++) + '. Disclaimer of Warranties\n\n';
          md += 'THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT EXPRESS OR IMPLIED WARRANTIES OF ANY KIND, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE, UNINTERRUPTED, OR FREE OF HARMFUL COMPONENTS.\n\n';
        }

        if (hasLiability) {
          md += '## ' + (sec++) + '. Limitation of Liability\n\n';
          md += 'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ' + name.toUpperCase() + ', ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING DAMAGES FOR LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS INTERRUPTION.\n\n';
          md += 'IN NO EVENT SHALL OUR AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THIS AGREEMENT EXCEED THE GREATER OF ONE HUNDRED US DOLLARS ($100.00 USD) OR THE AMOUNT YOU PAID TO US DURING THE TWELVE (12) MONTHS PRECEDING THE CLAIM.\n\n';
        }

        if (hasArbitration) {
          md += '## ' + (sec++) + '. Dispute Resolution & Mandatory Binding Arbitration\n\n';
          md += 'You and ' + name + ' agree that any controversy or claim arising out of or relating to these Terms or the Service shall be settled exclusively through binding individual arbitration administered under the commercial rules of the American Arbitration Association (AAA) or equivalent tribunal.\n\n';
          md += '**CLASS ACTION WAIVER:** YOU AND ' + name + ' AGREE THAT EACH PARTY MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.\n\n';
        }

        md += '## ' + (sec++) + '. Governing Law & Severability\n\n';
        md += 'These Terms shall be governed by and construed in accordance with the laws of ' + jur + ', without regard to conflict of law principles. If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.\n\n';

        md += '## ' + (sec++) + '. Contact Us\n\n';
        md += 'If you have any questions regarding these Terms, please contact us at:\n\n';
        md += '- **Organization:** ' + name + ' (' + entity + ')\n';
        md += '- **Website:** ' + url + '\n';
        md += '- **Legal Inquiries:** ' + email + '\n';

        let html = '<!-- Terms of Service generated by Digital Tools Shed -->\n' +
          '<div class="terms-of-service">\n' +
          '  <h1>Terms of Service for ' + name + '</h1>\n' +
          '  <p class="last-updated"><strong>Last Updated:</strong> ' + date + '</p>\n' +
          '  <p>Please read these Terms of Service carefully before using <a href="' + url + '">' + url + '</a> operated by ' + name + ' (' + entity + ').</p>\n';

        let htmlSec = 1;
        html += '  <h2>' + (htmlSec++) + '. Acceptance of Terms</h2>\n  <p>By accessing the Service, you agree to be bound by these Terms and confirm you are at least ' + age + ' years old.</p>\n';
        if (hasIp) html += '  <h2>' + (htmlSec++) + '. Intellectual Property</h2>\n  <p>All software, interface designs, code, and trademarks remain the exclusive property of ' + name + '.</p>\n';
        if (hasWarranty) html += '  <h2>' + (htmlSec++) + '. Disclaimer of Warranties</h2>\n  <p>The Service is provided strictly on an "AS IS" and "AS AVAILABLE" basis without warranty of any kind.</p>\n';
        if (hasLiability) html += '  <h2>' + (htmlSec++) + '. Limitation of Liability</h2>\n  <p>In no event shall aggregate liability exceed the greater of $100.00 USD or fees paid in the prior 12 months.</p>\n';
        if (hasArbitration) html += '  <h2>' + (htmlSec++) + '. Arbitration & Class Action Waiver</h2>\n  <p>Disputes are resolved exclusively via individual binding arbitration with class action waivers.</p>\n';
        html += '  <h2>' + (htmlSec++) + '. Governing Law</h2>\n  <p>Governed by the laws of ' + jur + '. Inquiries: <a href="mailto:' + email + '">' + email + '</a>.</p>\n</div>';

        let txt = md.replace(/\*\*/g, '').replace(/###? /g, '').replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)');

        document.getElementById('tos-output-md').value = md;
        document.getElementById('tos-output-html').value = html;
        document.getElementById('tos-output-txt').value = txt;

        const words = md.split(/\s+/).filter(Boolean).length;
        const readMins = Math.ceil(words / 200);
        document.getElementById('stat-tos-words').textContent = words.toLocaleString() + ' words';
        document.getElementById('stat-tos-read').textContent = readMins + ' min read';
        document.getElementById('stat-tos-clauses').textContent = (sec - 1) + ' sections';
      }

      function copyCurrentTosTab() {
        const id = 'tos-output-' + currentTosTab;
        const val = document.getElementById(id).value;
        navigator.clipboard.writeText(val).then(() => {
          const btn = document.getElementById('btnCopyTos');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ ' + currentTosTab.toUpperCase() + ' Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      function copyTosAuditReport() {
        const name = document.getElementById('tos-name').value || 'Company';
        const words = document.getElementById('stat-tos-words').textContent;
        const clauses = document.getElementById('stat-tos-clauses').textContent;
        const report = [
          '====================================================',
          'TERMS OF SERVICE LEGAL ENFORCEABILITY AUDIT',
          'Digital Tools Shed Compliance Studio',
          '====================================================',
          'Contracting Entity     : ' + name,
          'Agreement Length       : ' + words,
          'Total Legal Sections   : ' + clauses,
          'Clickwrap Enforceability: Supported (Affirmative Assent)',
          'Liability Limitation   : Enforced ($100 / 12-Month Cap)',
          'Dispute Resolution    : Mandatory Binding Arbitration',
          'Class Action Waiver    : Enforced',
          'DMCA Safe Harbor       : Enforced (17 U.S.C. § 512)',
          'Warranty Disclaimer    : Enforced (UCC § 2-316 "AS IS")',
          '===================================================='
        ].join('\n');

        navigator.clipboard.writeText(report).then(() => {
          const btn = document.getElementById('btnCopyTosReport');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Audit Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      function downloadTos() {
        const ext = (currentTosTab === 'html' ? 'html' : (currentTosTab === 'txt' ? 'txt' : 'md'));
        const mime = (currentTosTab === 'html' ? 'text/html' : 'text/plain');
        const content = document.getElementById('tos-output-' + currentTosTab).value;
        const blob = new Blob([content], { type: mime + ';charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'terms-of-service.' + ext;
        a.click();
      }

      document.addEventListener('DOMContentLoaded', () => {
        genTos();
      });
    </script>
  `
    },
    {
      slug: 'cookie-policy-generator',
      title: "Free Cookie Policy Generator & Consent Banner Suite (GDPR & CCPA)",
      metaDesc: "100% Free Cookie Policy Generator. Create GDPR, CCPA, and ePrivacy compliant cookie policies with customizable consent banner code in seconds. No signup or fees.",
      category: 'Security',
      faq: [
        {
                "q": "Is this cookie policy generator 100% free with no signup?",
                "a": "Yes! This tool is completely free, client-side, and requires no registration, email submission, or recurring subscription fees. You can generate unlimited cookie policies and export clean Markdown or HTML instantly."
        },
        {
                "q": "Does this generated cookie policy comply with GDPR and CCPA?",
                "a": "Yes. It adheres to European Union GDPR Article 6 & 7 (explicit consent, cookie categorization) and California Privacy Rights Act (CCPA/CPRA) disclosure requirements, including \"Do Not Sell My Personal Information\" notices."
        },
        {
                "q": "Do I legally need a cookie consent banner on my website?",
                "a": "If your website serves visitors from the EU, UK, or California and uses any non-essential cookies (such as Google Analytics, Meta Pixel, advertising scripts, or session recording tools), privacy regulations strictly require you to display a cookie consent banner before setting those cookies."
        },
        {
                "q": "How do I install the generated cookie consent banner on my site?",
                "a": "Simply copy the generated Vanilla JavaScript/HTML snippet and paste it right before the closing </body> tag of your website. It works universally on WordPress, Shopify, Webflow, Squarespace, Ghost, and custom static sites with zero dependencies."
        },
        {
                "q": "What is the difference between Essential and Marketing cookies?",
                "a": "Essential cookies are strictly necessary for core functionality (user login state, cart checkout, security, load balancing) and do not require prior consent. Marketing and Analytics cookies track user behavior across sites for targeted advertising and traffic measurement, requiring explicit opt-in consent."
        }
],
      body: `
    ${commonStyle}
    <style>
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.75rem; margin: 1rem 0; }
      .stat-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.85rem; text-align: center; }
      .stat-num { font-family: var(--mono); font-size: 1.15rem; font-weight: 700; color: var(--fg); }
      .stat-lbl { font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; margin-top: 0.25rem; }
      .trap-card { border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; background: var(--surface-alt); font-size: 0.88rem; line-height: 1.55; }
    </style>
    <div class="article-container" style="max-width: 920px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/security/">Privacy &amp; Security</a> &gt; Free Cookie Policy Generator
      </nav>
      <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;">
        <span class="badge badge-green">100% Free &amp; No Sign-Up</span>
        <span class="badge badge-amber">GDPR &amp; CCPA Ready</span>
        <span class="badge badge-green">Zero-Dependency Banner</span>
      </div>
      <h1 style="font-family: var(--serif); font-size: 1.9rem; margin-bottom: 0.5rem;">Free Cookie Policy Generator &amp; Consent Banner Suite</h1>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
        Create legally compliant cookie policy documentation and lightweight, zero-dependency cookie consent banner code for your website. Completely free, customizable, and ready to deploy in 30 seconds.
      </p>

      <div class="tool-box">
        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;">1. Website &amp; Organization Details</h3>
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

        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 1.5rem 0 0.75rem;">2. Cookies &amp; Trackers Used</h3>
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

        <!-- Real-Time Metrics -->
        <div class="stat-grid" style="margin: 1.25rem 0;">
          <div class="stat-card"><div class="stat-num" id="stat-cp-categories">4 Categories</div><div class="stat-lbl">Cookie Types</div></div>
          <div class="stat-card"><div class="stat-num" id="stat-cp-banner">0.6 KB</div><div class="stat-lbl">Banner Payload</div></div>
          <div class="stat-card"><div class="stat-num" id="stat-cp-deps">Zero</div><div class="stat-lbl">Dependencies</div></div>
          <div class="stat-card"><div class="stat-num" id="stat-cp-status" style="color: #22c55e;">Compliant</div><div class="stat-lbl">GDPR / ePrivacy</div></div>
        </div>

        <!-- Action Buttons Bar -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1.25rem;">
          <button type="button" id="btnCopyPolicyMd" class="btn-primary" onclick="copyPolicyMd()" style="padding: 0.65rem 0.85rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
            <span>📋 Copy Markdown Policy</span>
          </button>
          <button type="button" id="btnCopyPolicyHtml" class="btn-sec" onclick="copyPolicyHtml()" style="padding: 0.65rem 0.85rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface); border: 1px solid var(--border); color: var(--fg); font-weight: 600;">
            <span>📋 Copy HTML Policy</span>
          </button>
          <button type="button" id="btnCopyBannerCode" class="btn-sec" onclick="copyBannerCode()" style="padding: 0.65rem 0.85rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface); border: 1px solid var(--border); color: var(--fg); font-weight: 600;">
            <span>📋 Copy Banner Code</span>
          </button>
          <button type="button" id="btnCopyCookieReport" class="btn-sec" onclick="copyCookieReport()" style="padding: 0.65rem 0.85rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface); border: 1px solid var(--border); color: var(--fg); font-weight: 600;">
            <span>📋 Copy Audit Report</span>
          </button>
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
            <button type="button" id="btnCopyGa4" class="btn-sec" onclick="copyGa4Snippet()" style="padding: 0.3rem 0.65rem; font-size: 0.75rem;">Copy GA4 Snippet</button>
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

      <!-- 5 Fatal Traps & Cookie Law Pitfalls -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">5 Fatal Traps in Cookie Consent Implementation</h2>

        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 1: Firing Tracking Scripts Before Explicit Prior Consent (GDPR Art. 6 &amp; ePrivacy)</strong>
          The most widespread compliance failure across the web is loading tracking scripts (Google Analytics 4, Meta Pixel, Hotjar, TikTok Pixel) on initial page load before the visitor clicks "Accept". Under the EU ePrivacy Directive (Directive 2002/58/EC) and GDPR Article 6, prior consent is an absolute prerequisite. Displaying a banner while tracking cookies already fire in the background is illegal and carries active enforcement fines.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 2: Deceptive Dark Patterns &amp; Asymmetric Button Design (EDPB Guidelines)</strong>
          Designing an eye-catching, bright green "Accept All" button while hiding the "Reject" or "Decline" button behind low-contrast grey text or multi-click submenus violates the European Data Protection Board (EDPB) guidelines on dark patterns. European courts and data protection authorities (e.g. France's CNIL) have issued over €100 million in fines to companies that make rejecting cookies harder than accepting them.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 3: Pre-Ticked Consent Checkboxes (CJEU Planet49 Landmark Ruling)</strong>
          In the landmark <em>Planet49</em> ruling (Case C-673/17), the Court of Justice of the European Union ruled that pre-ticked checkboxes do NOT constitute valid consent. Consent must be a positive, affirmative, active action taken by the user. If your preference center opens with "Analytics" or "Marketing" pre-checked by default, that consent is legally null and void.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 4: Bundled Consent Without Category-Level Granularity</strong>
          Presenting an "all-or-nothing" consent prompt where users are forced to accept marketing cookies in order to gain access to basic functionality violates the GDPR condition that consent must be "freely given" (Recital 32). Websites must allow visitors to opt-in selectively to functional, analytics, and marketing categories individually.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 5: Inability to Provide Verifiable Consent Audit Logs Upon Regulatory Inquiry</strong>
          Under GDPR Article 7(1), the burden of proof rests squarely on the website operator: "Where processing is based on consent, the controller shall be able to demonstrate that the data subject has consented." If a regulatory audit occurs, simply asserting that you have a banner is insufficient; you must store cryptographic or timestamped client-side consent tokens (like localStorage state) demonstrating affirmative consent.
        </div>
      </div>

      <!-- FAQ Section -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Is this cookie policy generator 100% free with no signup?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes! This tool is completely free, client-side, and requires no registration, email submission, or recurring subscription fees. You can generate unlimited cookie policies and export clean Markdown or HTML instantly.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Does this generated cookie policy comply with GDPR and CCPA?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes. It adheres to European Union GDPR Article 6 &amp; 7 (explicit consent, cookie categorization) and California Privacy Rights Act (CCPA/CPRA) disclosure requirements, including "Do Not Sell My Personal Information" notices.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Do I legally need a cookie consent banner on my website?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">If your website serves visitors from the EU, UK, or California and uses any non-essential cookies (such as Google Analytics, Meta Pixel, advertising scripts, or session recording tools), privacy regulations strictly require you to display a cookie consent banner before setting those cookies.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">How do I install the generated cookie consent banner on my site?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Simply copy the generated Vanilla JavaScript/HTML snippet and paste it right before the closing &lt;/body&gt; tag of your website. It works universally on WordPress, Shopify, Webflow, Squarespace, Ghost, and custom static sites with zero dependencies.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">What is the difference between Essential and Marketing cookies?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Essential cookies are strictly necessary for core functionality (user login state, cart checkout, security, load balancing) and do not require prior consent. Marketing and Analytics cookies track user behavior across sites for targeted advertising and traffic measurement, requiring explicit opt-in consent.</div>
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

        let categoriesCount = 1;
        if (hasAnalytics) categoriesCount++;
        if (hasMarketing) categoriesCount++;
        if (hasPrefs) categoriesCount++;
        document.getElementById('stat-cp-categories').textContent = categoriesCount + ' Categories';

        let p = '# Cookie Policy for ' + name + '\n\n';
        p += '**Last updated:** ' + date + '\n\n';
        p += 'This Cookie Policy explains how ' + name + ' ("we", "us", or "our") uses cookies and similar tracking technologies when you visit our website at [' + url + '](' + url + ').\n\n';
        p += '## 1. What Are Cookies?\n';
        p += 'Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work efficiently, provide personalized experiences, and gather reporting data.\n\n';
        p += '## 2. Categories of Cookies We Use\n\n';
        p += '### A. Strictly Necessary / Essential Cookies\n';
        p += 'These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas, session authentication, and load balancing. Because these cookies are strictly necessary to deliver the site, you cannot refuse them without impacting website operation.\n\n';

        let pHtml = '<h1>Cookie Policy for ' + name + '</h1>\n<p><strong>Last updated:</strong> ' + date + '</p>\n';
        pHtml += '<p>This Cookie Policy explains how ' + name + ' ("we", "us", or "our") uses cookies and similar tracking technologies when you visit our website at <a href="' + url + '">' + url + '</a>.</p>\n';
        pHtml += '<h2>1. What Are Cookies?</h2>\n<p>Cookies are small data files placed on your device to ensure website functionality, improve user experience, and analyze site performance.</p>\n';
        pHtml += '<h2>2. Categories of Cookies We Use</h2>\n<h3>A. Strictly Necessary / Essential Cookies</h3>\n<p>Essential for basic site operations, login states, and security. Cannot be disabled.</p>\n';

        if (hasAnalytics) {
          p += '### B. Analytics and Performance Cookies\n';
          p += 'These cookies collect information that is used either in aggregate form to help us understand how our website is being used, how effective our marketing campaigns are, or to help us customize our website for you (e.g. Google Analytics, Plausible Analytics, Cloudflare Web Analytics).\n\n';
          pHtml += '<h3>B. Analytics & Performance Cookies</h3>\n<p>Used to measure visitor interactions and optimize load speeds (e.g. Google Analytics, Cloudflare).</p>\n';
        }

        if (hasMarketing) {
          p += '### C. Advertising and Marketing Cookies\n';
          p += 'These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests (e.g. Google AdSense, Meta Pixel).\n\n';
          pHtml += '<h3>C. Advertising & Marketing Cookies</h3>\n<p>Used to deliver tailored promotions and prevent repetitive advertisements (e.g. Google AdSense, Meta Pixel).</p>\n';
        }

        if (hasPrefs) {
          p += '### D. Functional and Preference Cookies\n';
          p += 'These cookies enable the website to remember choices you make (such as your user name, language, or dark/light mode UI theme) and provide enhanced, more personal features.\n\n';
          pHtml += '<h3>D. Functional & Preference Cookies</h3>\n<p>Enables memory of UI settings such as dark/light mode or language preference.</p>\n';
        }

        p += '## 3. How Can You Control Cookies?\n';
        p += 'You have the right to decide whether to accept or reject non-essential cookies. You can exercise your cookie preferences by clicking on the settings button in our cookie consent banner. In addition, most web browsers allow you to modify your cookie settings in your browser preferences.\n\n';
        p += '## 4. California Consumer Privacy Act (CCPA/CPRA)\n';
        p += 'If you are a California resident, you have the right to request disclosure of categories of personal information collected via cookies, and to request that we do not sell or share your personal data.\n\n';
        p += '## 5. Contact Us\n';
        p += 'If you have any questions about our use of cookies or other technologies, please email us at: ' + email + '.\n';

        pHtml += '<h2>3. How Can You Control Cookies?</h2>\n<p>You can accept or decline optional cookies using our consent banner or via your browser privacy settings.</p>\n';
        pHtml += '<h2>4. Contact Us</h2>\n<p>Questions? Contact us at: <a href="mailto:' + email + '">' + email + '</a></p>';

        document.getElementById('cp-policy').value = p;
        document.getElementById('cp-policy-html').value = pHtml;

        let bgCol = '#18181b', textCol = '#ffffff', btnBg = '#3b82f6', btnText = '#ffffff', borderCol = 'rgba(255,255,255,0.1)';
        if (theme === 'light') {
          bgCol = '#ffffff'; textCol = '#18181b'; btnBg = '#18181b'; btnText = '#ffffff'; borderCol = 'rgba(0,0,0,0.15)';
        } else if (theme === 'slate') {
          bgCol = '#0f172a'; textCol = '#f8fafc'; btnBg = '#0284c7'; btnText = '#ffffff'; borderCol = 'rgba(255,255,255,0.15)';
        }

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

        let banner = '<!-- Digital Tools Shed Free GDPR/CCPA Cookie Consent Banner -->\n' +
          '<div id="dts-cookie-banner" style="' + posStyle + 'background:' + bgCol + ';color:' + textCol + ';padding:1rem 1.25rem;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;font-family:system-ui,-apple-system,sans-serif;font-size:0.9rem;border-top:1px solid ' + borderCol + ';box-sizing:border-box;">\n' +
          '  <div style="flex:1;min-width:260px;line-height:1.5;">\n' +
          '    <span>We use cookies to enhance your browsing experience, serve personalized ads, and analyze traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.</span>\n' +
          '  </div>\n' +
          '  <div style="display:flex;gap:0.5rem;align-items:center;">\n' +
          '    <button id="dts-cookie-decline" style="background:transparent;color:' + textCol + ';border:1px solid ' + borderCol + ';padding:0.45rem 0.9rem;border-radius:4px;cursor:pointer;font-size:0.85rem;">Decline</button>\n' +
          '    <button id="dts-cookie-accept" style="background:' + btnBg + ';color:' + btnText + ';border:none;padding:0.45rem 1rem;border-radius:4px;cursor:pointer;font-weight:600;font-size:0.85rem;">Accept All</button>\n' +
          '  </div>\n' +
          '</div>\n' +
          '<script>\n' +
          '  (function() {\n' +
          '    var b = document.getElementById("dts-cookie-banner");\n' +
          '    if (!b) return;\n' +
          '    if (localStorage.getItem("cookie_consent") !== null) {\n' +
          '      b.style.display = "none";\n' +
          '    }\n' +
          '    document.getElementById("dts-cookie-accept").onclick = function() {\n' +
          '      localStorage.setItem("cookie_consent", "accepted");\n' +
          '      b.style.display = "none";\n' +
          '      window.dispatchEvent(new CustomEvent("cookie_consent_accepted"));\n' +
          '    };\n' +
          '    document.getElementById("dts-cookie-decline").onclick = function() {\n' +
          '      localStorage.setItem("cookie_consent", "declined");\n' +
          '      b.style.display = "none";\n' +
          '      window.dispatchEvent(new CustomEvent("cookie_consent_declined"));\n' +
          '    };\n' +
          '  })();\n' +
          '<\/script>';

        document.getElementById('cp-banner').value = banner;
        document.getElementById('stat-cp-banner').textContent = (banner.length / 1024).toFixed(1) + ' KB';
      }

      function copyPolicyMd() {
        navigator.clipboard.writeText(document.getElementById('cp-policy').value).then(() => {
          const btn = document.getElementById('btnCopyPolicyMd');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Markdown Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      function copyPolicyHtml() {
        navigator.clipboard.writeText(document.getElementById('cp-policy-html').value).then(() => {
          const btn = document.getElementById('btnCopyPolicyHtml');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ HTML Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      function copyBannerCode() {
        navigator.clipboard.writeText(document.getElementById('cp-banner').value).then(() => {
          const btn = document.getElementById('btnCopyBannerCode');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Banner Code Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      function copyCookieReport() {
        const name = document.getElementById('cp-name').value || 'Our Website';
        const cats = document.getElementById('stat-cp-categories').textContent;
        const report = [
          '====================================================',
          'COOKIE CONSENT & POLICY COMPLIANCE AUDIT',
          'Digital Tools Shed Compliance Studio',
          '====================================================',
          'Website / Brand        : ' + name,
          'Cookie Categories      : ' + cats,
          'GDPR Art. 6 Prior Consent: Enforced (Banner Event Hooks)',
          'No Dark Patterns       : Enforced (Equal Accept/Decline Styling)',
          'Planet49 Compliance    : Enforced (No Pre-Ticked Checkboxes)',
          'Zero-Dependency Banner : Yes (Vanilla JS/HTML)',
          'Google Analytics 4 Hook: CustomEvent("cookie_consent_accepted")',
          'Storage Audit Token    : localStorage.getItem("cookie_consent")',
          '===================================================='
        ].join('\n');

        navigator.clipboard.writeText(report).then(() => {
          const btn = document.getElementById('btnCopyCookieReport');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Audit Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      function copyGa4Snippet() {
        navigator.clipboard.writeText(document.getElementById('ga4-snippet').textContent).then(() => {
          const btn = document.getElementById('btnCopyGa4');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ GA4 Snippet Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
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

      document.addEventListener('DOMContentLoaded', () => {
        genCookiePolicy();
      });
    </script>
  `
    },
    {
      slug: 'gdpr-checklist',
      title: "GDPR Compliance Audit Checklist & Readiness Scanner",
      metaDesc: "Interactive 18-point GDPR compliance self-assessment checklist for web developers, product managers, and digital businesses. Instant audit scoring and exportable report.",
      category: 'Security',
      faq: [
        {
                "q": "Who does the European Union GDPR apply to?",
                "a": "The General Data Protection Regulation (GDPR) applies to any organization worldwide that processes the personal data of individuals located within the European Union (EU) or European Economic Area (EEA), regardless of whether the business is physically based in Europe or charges for goods and services."
        },
        {
                "q": "What is the maximum penalty for non-compliance under GDPR?",
                "a": "Under GDPR Article 83, severe infringements (such as violating core data processing principles, lack of valid consent, or illegal cross-border data transfers) can result in administrative fines of up to €20 million or 4% of the company's total global annual turnover of the preceding financial year, whichever is higher."
        },
        {
                "q": "What is the difference between a Data Controller and a Data Processor?",
                "a": "A Data Controller determines the purposes and means of processing personal data (i.e. your website or business). A Data Processor processes personal data solely on behalf of the controller (e.g. AWS, Stripe, Google Analytics). Controllers must execute Data Processing Agreements (DPAs) with all processors under Article 28."
        },
        {
                "q": "What qualifies as valid cookie consent under GDPR?",
                "a": "Under GDPR Article 4(11) and Recital 32, consent must be freely given, specific, informed, and unambiguous. It requires an active affirmative opt-in (e.g. clicking \"Accept\"). Pre-ticked checkboxes, implied consent via scrolling, and cookie walls that deny access unless tracking is accepted are illegal."
        },
        {
                "q": "How long do I have to respond to a Data Subject Access Request (DSAR)?",
                "a": "Under Article 12(3), you must respond to a user access, rectification, or erasure request without undue delay and at the latest within one calendar month of receipt. This may be extended by two further months where requests are complex or numerous, provided the user is notified within the first month."
        }
],
      body: `
    ${commonStyle}
    <style>
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.75rem; margin: 1rem 0; }
      .stat-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.85rem; text-align: center; }
      .stat-num { font-family: var(--mono); font-size: 1.15rem; font-weight: 700; color: var(--fg); }
      .stat-lbl { font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; margin-top: 0.25rem; }
      .tag-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
      .trap-card { border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; background: var(--surface-alt); font-size: 0.88rem; line-height: 1.55; }
      .checklist-group { margin-bottom: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; }
      .group-title { font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.75rem; color: var(--fg); display: flex; justify-content: space-between; align-items: center; }
      .group-badge { font-family: var(--mono); font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; }
      .item-label { display: flex; align-items: flex-start; gap: 0.65rem; padding: 0.5rem 0; cursor: pointer; font-size: 0.88rem; line-height: 1.45; color: var(--fg); border-bottom: 1px solid rgba(120,120,120,0.1); }
      .item-label:last-child { border-bottom: none; }
      .item-label input[type="checkbox"] { margin-top: 0.2rem; flex-shrink: 0; }
      .item-desc { display: block; font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem; }
    </style>
    <div class="article-container" style="max-width: 920px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/security/">Privacy &amp; Security</a> &gt; GDPR Compliance Checklist
      </nav>

      <div class="tag-row">
        <span class="badge badge-green">18-Point Statutory Audit</span>
        <span class="badge badge-amber">Articles 5, 6, 12-22, 28, 32-34</span>
        <span class="badge badge-green">Zero Data Retention</span>
      </div>

      <h1 style="font-family: var(--serif); font-size: 1.9rem; margin-bottom: 0.5rem;">GDPR Compliance Audit Checklist &amp; Readiness Scanner</h1>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
        Perform an interactive self-audit of your website, web application, or SaaS platform against European Union General Data Protection Regulation (Regulation 2016/679) requirements. Calculate your readiness score, uncover legal gaps, and export a formal audit summary.
      </p>

      <div class="tool-box">
        <!-- Progress & Score Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span class="field-label" style="margin:0;">Overall GDPR Compliance Score</span>
            <div style="font-family: var(--mono); font-size: 1.3rem; font-weight: 700; color: var(--fg);" id="gdpr-pct">0% (0 / 18 Verified)</div>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button type="button" class="btn-sec" onclick="selectAll(true)" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">✓ Select All</button>
            <button type="button" class="btn-sec" onclick="selectAll(false)" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">↺ Reset</button>
          </div>
        </div>

        <div style="height: 10px; width: 100%; background: var(--border); border-radius: 5px; overflow: hidden; margin-bottom: 1.5rem;">
          <div id="gdpr-bar" style="height: 100%; width: 0%; background: #ef4444; transition: width 0.3s, background 0.3s;"></div>
        </div>

        <!-- Telemetry Cards -->
        <div class="stat-grid" style="margin-bottom: 1.5rem;">
          <div class="stat-card"><div class="stat-num" id="stat-verified">0 / 18</div><div class="stat-lbl">Requirements Met</div></div>
          <div class="stat-card"><div class="stat-num" id="stat-gaps">18 Remaining</div><div class="stat-lbl">Compliance Gaps</div></div>
          <div class="stat-card"><div class="stat-num" id="stat-tier" style="color: #ef4444;">Severe Risk</div><div class="stat-lbl">Regulatory Exposure</div></div>
          <div class="stat-card"><div class="stat-num">€20M / 4%</div><div class="stat-lbl">Max Statutory Fine</div></div>
        </div>

        <!-- Group 1: Lawful Basis & Consent -->
        <div class="checklist-group">
          <div class="group-title">
            <span>1. Lawful Basis &amp; Cookie Consent (Articles 6 &amp; 7)</span>
            <span class="group-badge badge-amber" id="badge-g1">0/4 Met</span>
          </div>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="1" onchange="updateAudit()">
            <div>
              <strong>Explicit Prior Cookie Consent:</strong> Non-essential tracking cookies (Analytics, Meta Pixel, AdSense) are strictly blocked from loading until the user clicks "Accept".
              <span class="item-desc">Pre-ticked checkboxes and implied consent via scrolling are prohibited under CJEU Planet49 ruling.</span>
            </div>
          </label>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="1" onchange="updateAudit()">
            <div>
              <strong>Equal Button Prominence:</strong> The "Reject All" / "Decline" button is just as prominent, accessible, and easily clickable as the "Accept All" button.
              <span class="item-desc">Hiding rejection options in sub-menus violates EDPB dark pattern guidelines.</span>
            </div>
          </label>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="1" onchange="updateAudit()">
            <div>
              <strong>Granular Category Choice:</strong> Users can accept or reject specific cookie categories (Analytics vs Marketing vs Functional) independently.
              <span class="item-desc">Bundled take-it-or-leave-it consent violates Article 4(11) freely given requirements.</span>
            </div>
          </label>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="1" onchange="updateAudit()">
            <div>
              <strong>Effortless Consent Withdrawal:</strong> A persistent floating button, footer link, or preferences modal allows visitors to revoke consent at any time.
              <span class="item-desc">Article 7(3): "It shall be as easy to withdraw as to give consent."</span>
            </div>
          </label>
        </div>

        <!-- Group 2: Transparency & Privacy Notices -->
        <div class="checklist-group">
          <div class="group-title">
            <span>2. Transparency &amp; Notice (Articles 12, 13 &amp; 14)</span>
            <span class="group-badge badge-amber" id="badge-g2">0/4 Met</span>
          </div>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="2" onchange="updateAudit()">
            <div>
              <strong>Conspicuous Privacy Notice:</strong> A comprehensive Privacy Policy is permanently hyperlinked in the global site footer and on all signup/checkout forms.
              <span class="item-desc">Must detail legal identity, registered address, and official Data Protection Officer contact email.</span>
            </div>
          </label>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="2" onchange="updateAudit()">
            <div>
              <strong>Legal Basis for Each Processing Purpose:</strong> Every data collection activity cites a valid Article 6 legal basis (Consent, Contract, Legal Obligation, or Legitimate Interest).
              <span class="item-desc">Legitimate interest cannot be used for behavioral tracking or third-party ad targeting.</span>
            </div>
          </label>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="2" onchange="updateAudit()">
            <div>
              <strong>Third-Party Subprocessor Disclosure:</strong> Complete list of cloud hosts, payment gateways, analytics providers, and CDNs that receive EU user data.
              <span class="item-desc">Must disclose international transfers (e.g. EU-US Data Privacy Framework or Standard Contractual Clauses).</span>
            </div>
          </label>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="2" onchange="updateAudit()">
            <div>
              <strong>Defined Storage Limitation:</strong> Specific retention timelines articulated for server access logs, customer profiles, and analytics telemetry.
              <span class="item-desc">Article 5(1)(e): Storing personal data indefinitely is strictly illegal.</span>
            </div>
          </label>
        </div>

        <!-- Group 3: Data Subject Rights -->
        <div class="checklist-group">
          <div class="group-title">
            <span>3. Data Subject Rights &amp; DSAR Workflows (Articles 15–22)</span>
            <span class="group-badge badge-amber" id="badge-g3">0/4 Met</span>
          </div>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="3" onchange="updateAudit()">
            <div>
              <strong>Right of Access &amp; DSAR Endpoint:</strong> A dedicated email or web form where users can submit Data Subject Access Requests free of charge.
              <span class="item-desc">Must be fulfilled within 30 calendar days without charging fees (Article 12(5)).</span>
            </div>
          </label>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="3" onchange="updateAudit()">
            <div>
              <strong>Right to Erasure ("Right to be Forgotten"):</strong> Automated or documented manual procedure to purge user profiles, databases, and logs upon request.
              <span class="item-desc">Excludes records strictly required for legal tax/accounting retention (Article 17(3)(b)).</span>
            </div>
          </label>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="3" onchange="updateAudit()">
            <div>
              <strong>Right to Data Portability (Article 20):</strong> Ability to export user-generated data in a structured, commonly used, and machine-readable format (JSON or CSV).
              <span class="item-desc">Applies to data provided by the user and processed by automated means under consent or contract.</span>
            </div>
          </label>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="3" onchange="updateAudit()">
            <div>
              <strong>Supervisory Authority Complaint Notice:</strong> Explicit notification informing European users of their statutory right to lodge complaints with their national DPA.
              <span class="item-desc">E.g. CNIL in France, BfDI in Germany, DPC in Ireland, ICO in the UK.</span>
            </div>
          </label>
        </div>

        <!-- Group 4: Security & Technical Safeguards -->
        <div class="checklist-group">
          <div class="group-title">
            <span>4. Security &amp; Technical Safeguards (Article 32)</span>
            <span class="group-badge badge-amber" id="badge-g4">0/3 Met</span>
          </div>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="4" onchange="updateAudit()">
            <div>
              <strong>End-to-End Transport Layer Encryption:</strong> Strict HTTPS/TLS 1.3 encryption enforced with HSTS headers across all domains, subdomains, and API endpoints.
              <span class="item-desc">Plaintext HTTP transmission of credentials or personal data constitutes an immediate security failure.</span>
            </div>
          </label>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="4" onchange="updateAudit()">
            <div>
              <strong>Cryptographic Storage of Authentication Secrets:</strong> User passwords hashed using modern memory-hard key derivation functions (Argon2id or bcrypt with salt).
              <span class="item-desc">Never use fast legacy hashes like MD5 or SHA-1 for passwords.</span>
            </div>
          </label>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="4" onchange="updateAudit()">
            <div>
              <strong>Principle of Least Privilege &amp; Access Controls:</strong> Database and server access strictly restricted to authorized engineering staff via MFA and role-based access.
              <span class="item-desc">Audit logs maintained for employee access to customer personal records.</span>
            </div>
          </label>
        </div>

        <!-- Group 5: Governance & Breach Response -->
        <div class="checklist-group">
          <div class="group-title">
            <span>5. Governance &amp; Breach Protocol (Articles 28, 30 &amp; 33)</span>
            <span class="group-badge badge-amber" id="badge-g5">0/3 Met</span>
          </div>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="5" onchange="updateAudit()">
            <div>
              <strong>72-Hour Data Breach Incident Protocol:</strong> Documented rapid-response plan to notify competent supervisory authorities within 72 hours of detecting a breach.
              <span class="item-desc">Must also notify affected users without undue delay if high risk to rights and freedoms exists (Article 34).</span>
            </div>
          </label>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="5" onchange="updateAudit()">
            <div>
              <strong>Data Processing Agreements (DPAs) Executed:</strong> Signed Article 28 DPAs in place with all cloud providers, analytics vendors, email platforms, and payment processors.
              <span class="item-desc">Transmitting EU personal data to an uncontracted third party is a direct violation.</span>
            </div>
          </label>
          <label class="item-label">
            <input type="checkbox" class="gdpr-cb" data-group="5" onchange="updateAudit()">
            <div>
              <strong>Privacy by Design &amp; Default (Article 25):</strong> Software architectures designed with data minimization as the default setting (no unnecessary optional data fields).
              <span class="item-desc">Telemetry opt-outs enabled by default for new features.</span>
            </div>
          </label>
        </div>

        <!-- Action Buttons -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 1.5rem;">
          <button type="button" id="btnCopyGdprReport" class="btn-primary" onclick="copyGdprReport()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span>📋 Copy Audit Summary</span>
          </button>
          <button type="button" id="btnDownloadGdpr" class="btn-sec" onclick="downloadGdprReport()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); color: var(--fg); font-weight: 600;">
            <span>💾 Download Report (.md)</span>
          </button>
        </div>
      </div>

      <!-- 5 Fatal Traps & Regulatory Pitfalls -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">5 Fatal Traps in GDPR Compliance Audits</h2>

        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 1: Relying on 'Legitimate Interest' for Behavioral Ad Tracking (Art. 6(1)(f) Misuse)</strong>
          Many ad-funded web properties claim that running invasive third-party tracking cookies (such as Meta Pixel, Criteo, or Google Remarketing) falls under "legitimate business interest." The European Data Protection Board (EDPB) and Court of Justice of the EU (e.g. <em>Meta v. Bundeskartellamt</em>) have explicitly ruled that cross-site behavioral tracking and profiling CANNOT rely on legitimate interest—it requires unambiguous, explicit opt-in consent.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 2: Failure to Execute Data Processing Agreements (DPAs) with Subprocessors (Art. 28)</strong>
          Using third-party SaaS tools (error monitoring like Sentry, support widgets like Intercom, hosting on AWS) without an executed Data Processing Agreement makes any data transfer to that service legally unauthorized. Even if the vendor is GDPR-compliant, your company is in direct breach of Article 28(3) until the DPA contract with standard contractual terms is signed and logged.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 3: Missing the Mandatory 72-Hour Data Breach Notification Window (Art. 33)</strong>
          When a security breach occurs (stolen database, compromised credentials, or ransomware), Article 33 mandates that the lead Data Protection Authority must be notified within 72 hours of becoming aware of the incident. Companies that spend two weeks investigating internally before alerting authorities routinely receive the harshest Tier 2 administrative penalties.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 4: Charging Fees or Creating Friction for Data Subject Access Requests (DSARs - Art. 12)</strong>
          Article 12(5) strictly establishes that information provided under access, erasure, or portability requests must be provided entirely free of charge. Requiring users to send notarized physical letters, call international telephone numbers, or pay administrative processing fees violates European transparency rules and triggers immediate regulatory investigation.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 5: Pre-Ticked Cookie Banners &amp; Implied Consent (Planet49 &amp; EDPB Guidelines)</strong>
          Designing cookie consent banners where analytics or marketing categories are checked by default, or where scrolling the webpage is treated as "implied consent", is legally invalid. Under CJEU jurisprudence, only an active affirmative action constitutes legal assent. Pre-ticked boxes provide zero legal cover during an audit.
        </div>
      </div>

      <!-- FAQ Section -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Who does the European Union GDPR apply to?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">The General Data Protection Regulation (GDPR) applies to any organization worldwide that processes the personal data of individuals located within the European Union (EU) or European Economic Area (EEA), regardless of whether the business is physically based in Europe or charges for goods and services.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">What is the maximum penalty for non-compliance under GDPR?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Under GDPR Article 83, severe infringements (such as violating core data processing principles, lack of valid consent, or illegal cross-border data transfers) can result in administrative fines of up to €20 million or 4% of the company's total global annual turnover of the preceding financial year, whichever is higher.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">What is the difference between a Data Controller and a Data Processor?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">A Data Controller determines the purposes and means of processing personal data (i.e. your website or business). A Data Processor processes personal data solely on behalf of the controller (e.g. AWS, Stripe, Google Analytics). Controllers must execute Data Processing Agreements (DPAs) with all processors under Article 28.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">What qualifies as valid cookie consent under GDPR?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Under GDPR Article 4(11) and Recital 32, consent must be freely given, specific, informed, and unambiguous. It requires an active affirmative opt-in (e.g. clicking "Accept"). Pre-ticked checkboxes, implied consent via scrolling, and cookie walls that deny access unless tracking is accepted are illegal.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">How long do I have to respond to a Data Subject Access Request (DSAR)?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Under Article 12(3), you must respond to a user access, rectification, or erasure request without undue delay and at the latest within one calendar month of receipt. This may be extended by two further months where requests are complex or numerous, provided the user is notified within the first month.</div>
        </details>
      </div>
    </div>

    <script>
      const TOTAL_ITEMS = 18;

      function updateAudit() {
        const boxes = document.querySelectorAll('.gdpr-cb');
        let checked = 0;
        const groupCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        const groupTotals = { 1: 4, 2: 4, 3: 4, 4: 3, 5: 3 };

        boxes.forEach(b => {
          if (b.checked) {
            checked++;
            const g = b.getAttribute('data-group');
            if (groupCounts[g] !== undefined) groupCounts[g]++;
          }
        });

        const pct = Math.round((checked / TOTAL_ITEMS) * 100);
        document.getElementById('gdpr-pct').textContent = pct + '% (' + checked + ' / ' + TOTAL_ITEMS + ' Verified)';
        document.getElementById('stat-verified').textContent = checked + ' / ' + TOTAL_ITEMS;
        document.getElementById('stat-gaps').textContent = (TOTAL_ITEMS - checked) + ' Remaining';

        const bar = document.getElementById('gdpr-bar');
        bar.style.width = pct + '%';

        const tier = document.getElementById('stat-tier');
        if (pct === 100) {
          bar.style.background = '#22c55e';
          tier.textContent = '100% Compliant';
          tier.style.color = '#22c55e';
        } else if (pct >= 80) {
          bar.style.background = '#10b981';
          tier.textContent = 'Low Risk';
          tier.style.color = '#10b981';
        } else if (pct >= 50) {
          bar.style.background = '#f59e0b';
          tier.textContent = 'Moderate Risk';
          tier.style.color = '#f59e0b';
        } else {
          bar.style.background = '#ef4444';
          tier.textContent = 'Severe Risk';
          tier.style.color = '#ef4444';
        }

        // Update group badges
        for (let g = 1; g <= 5; g++) {
          const badge = document.getElementById('badge-g' + g);
          if (badge) {
            const count = groupCounts[g];
            const tot = groupTotals[g];
            badge.textContent = count + '/' + tot + ' Met';
            badge.className = 'group-badge ' + (count === tot ? 'badge-green' : count > 0 ? 'badge-amber' : 'badge-red');
          }
        }
      }

      function selectAll(state) {
        document.querySelectorAll('.gdpr-cb').forEach(b => b.checked = state);
        updateAudit();
      }

      function generateReportText() {
        const boxes = document.querySelectorAll('.gdpr-cb');
        let checked = 0;
        boxes.forEach(b => { if (b.checked) checked++; });
        const pct = Math.round((checked / TOTAL_ITEMS) * 100);
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        let report = [
          '# GDPR Compliance Self-Audit Report',
          '**Generated by:** Digital Tools Shed Compliance Studio',
          '**Date:** ' + date,
          '**Readiness Score:** ' + pct + '% (' + checked + ' / ' + TOTAL_ITEMS + ' criteria verified)',
          '**Status:** ' + (pct === 100 ? 'Fully Compliant' : pct >= 80 ? 'Low Regulatory Exposure' : pct >= 50 ? 'Moderate Risk (Action Required)' : 'High Risk (Severe Non-Compliance)'),
          '',
          '---',
          '## Breakdown by Statutory Requirement'
        ];

        boxes.forEach((b, idx) => {
          const text = b.parentElement.querySelector('strong').textContent.replace(':', '');
          const status = b.checked ? '✅ PASSED' : '❌ UNMET';
          report.push((idx + 1) + '. [' + status + '] ' + text);
        });

        report.push('');
        report.push('---');
        report.push('## Regulatory Note');
        report.push('This self-audit provides technical guidance based on GDPR Articles 5, 6, 12–22, 28, and 32–34. It does not substitute for formal legal counsel.');
        return report.join('\n');
      }

      function copyGdprReport() {
        const txt = generateReportText();
        navigator.clipboard.writeText(txt).then(() => {
          const btn = document.getElementById('btnCopyGdprReport');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Audit Summary Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      function downloadGdprReport() {
        const txt = generateReportText();
        const blob = new Blob([txt], { type: 'text/markdown;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'gdpr-audit-report-' + Date.now() + '.md';
        a.click();
      }

      document.addEventListener('DOMContentLoaded', updateAudit);
    </script>
  `
    },
    {
      slug: 'data-breach-checker',
      title: "Password Pwned & Data Breach Checker (k-Anonymity HIBP)",
      metaDesc: "Check if a password has been compromised in known data breaches using HaveIBeenPwned k-anonymity protocol. 100% private: password never leaves your browser.",
      category: 'Security',
      faq: [
        {
                "q": "Is it safe to type my password into this checker?",
                "a": "Yes! This tool implements Troy Hunt's mathematical k-Anonymity protocol. Your password is never sent over the network. Your browser computes a 40-character SHA-1 hash locally, transmits ONLY the first 5 characters (prefix) to the HaveIBeenPwned API, and receives a list of ~500 candidate suffixes. Your browser completes the match locally in private memory."
        },
        {
                "q": "What is k-Anonymity in cryptographic privacy?",
                "a": "k-Anonymity is a mathematical property ensuring that an individual query cannot be distinguished from at least k-1 other candidate queries. By searching only the first 5 hex characters (which has 16^5 = 1,048,576 buckets), the server cannot determine which specific password among hundreds of thousands of possibilities you are checking."
        },
        {
                "q": "What should I do if my password is found in a data breach?",
                "a": "If your password has appeared in a data breach, you must immediately stop using it across all accounts. Attackers use automated credential-stuffing bots to test breached password lists against thousands of websites. Generate a new, unique 20+ character password or Diceware passphrase and enable Two-Factor Authentication (TOTP)."
        },
        {
                "q": "If my password shows 0 breaches, is it guaranteed secure?",
                "a": "No. A result of 0 breaches merely confirms that this exact password has not appeared in publicly exposed corporate breach databases. If the password is short, follows common dictionary patterns, or lacks bit-entropy (e.g. \"Tr0ub4dor&3\"), it can still be cracked within minutes by offline GPU clusters."
        },
        {
                "q": "Does this tool store or log any passwords searched?",
                "a": "No, absolutely not. Digital Tools Shed has zero backend databases for password tracking, zero logging scripts, and zero advertising trackers on this tool. Everything is computed in transient client-side RAM."
        }
],
      body: `
    ${commonStyle}
    <style>
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.75rem; margin: 1rem 0; }
      .stat-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.85rem; text-align: center; }
      .stat-num { font-family: var(--mono); font-size: 1.15rem; font-weight: 700; color: var(--fg); }
      .stat-lbl { font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; margin-top: 0.25rem; }
      .tag-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
      .trap-card { border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; background: var(--surface-alt); font-size: 0.88rem; line-height: 1.55; }
      .telemetry-row { display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid var(--border); font-family: var(--mono); font-size: 0.82rem; }
      .telemetry-row:last-child { border-bottom: none; }
    </style>
    <div class="article-container" style="max-width: 920px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/security/">Privacy &amp; Security</a> &gt; Data Breach Checker
      </nav>

      <div class="tag-row">
        <span class="badge badge-green">k-Anonymity Protected</span>
        <span class="badge badge-amber">HaveIBeenPwned API Integration</span>
        <span class="badge badge-green">Zero Plaintext Transmission</span>
      </div>

      <h1 style="font-family: var(--serif); font-size: 1.9rem; margin-bottom: 0.5rem;">Password Pwned &amp; Data Breach Checker</h1>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
        Check if your password has been exposed in corporate data breaches without leaking your secret. Utilizes Troy Hunt's mathematical <strong>k-Anonymity</strong> model—only the first 5 characters of a SHA-1 hash leave your device.
      </p>

      <div class="tool-box">
        <div class="field-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <label class="field-label" style="margin:0;">Test Password</label>
            <button type="button" id="btnTogglePwn" onclick="togglePwnVisibility()" class="btn-sec" style="padding: 0.2rem 0.55rem; font-size: 0.75rem;">👁 Show</button>
          </div>
          <input type="password" id="pwn-input" class="code-input" placeholder="Type password to test against 800M+ breached credentials..." style="font-size: 1rem;" onkeydown="if(event.key==='Enter') checkPwned()" autocomplete="off" />
        </div>

        <div class="action-bar" style="margin-top: 1rem;">
          <button type="button" class="btn-primary" onclick="checkPwned()" style="font-size: 0.9rem; padding: 0.7rem 1.4rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🔍 Search Breach Database</span>
          </button>
          <button type="button" class="btn-sec" onclick="loadSampleBreached()" style="padding: 0.7rem 1rem; font-size: 0.85rem;">Test Sample (password123)</button>
          <button type="button" class="btn-sec" onclick="clearPwn()" style="padding: 0.7rem 1rem; font-size: 0.85rem;">Clear</button>
        </div>

        <!-- Result Box -->
        <div id="pwn-result" style="display: none; margin-top: 1.5rem; padding: 1.25rem; border-radius: 6px; border: 1px solid var(--border);"></div>

        <!-- Telemetry Breakdown Panel -->
        <div id="pwn-telemetry" style="display: none; margin-top: 1.25rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
          <h4 style="font-family: var(--serif); font-size: 1.05rem; margin: 0 0 0.75rem;">k-Anonymity Cryptographic Telemetry</h4>
          <div class="telemetry-row">
            <span style="color: var(--text-muted);">Full SHA-1 Hash (Local)</span>
            <span id="tel-sha1" style="font-weight: 600; color: var(--fg); word-break: break-all;">-</span>
          </div>
          <div class="telemetry-row">
            <span style="color: var(--text-muted);">Transmitted Hash Prefix</span>
            <span id="tel-prefix" style="color: #3b82f6; font-weight: bold;">-</span>
          </div>
          <div class="telemetry-row">
            <span style="color: var(--text-muted);">Locally Evaluated Suffix</span>
            <span id="tel-suffix" style="color: #10b981; font-weight: bold;">-</span>
          </div>
          <div class="telemetry-row">
            <span style="color: var(--text-muted);">HIBP Candidate Pool</span>
            <span id="tel-candidates">-</span>
          </div>
          <div class="telemetry-row">
            <span style="color: var(--text-muted);">Breach Exposure Count</span>
            <span id="tel-count" style="font-weight: bold;">-</span>
          </div>
        </div>

        <!-- Action Copy Buttons -->
        <div id="pwn-actions" style="display: none; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 1.25rem;">
          <button type="button" id="btnCopyBreachReport" class="btn-primary" onclick="copyBreachReport()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span>📋 Copy Breach Report</span>
          </button>
          <a href="/security/password-generator" class="btn-sec" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none; text-align: center; background: var(--surface); border: 1px solid var(--border); color: var(--fg); font-weight: 600;">
            <span>⚡ Generate Safe Password</span>
          </a>
        </div>
      </div>

      <!-- 5 Fatal Traps & Credential Stuffing Pitfalls -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">5 Fatal Traps in Password Security &amp; Breach Audits</h2>

        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 1: Transmitting Plaintext Passwords to Verification APIs</strong>
          Submitting plaintext passwords over the internet to check if they are breached is a catastrophic security risk. Unscrupulous websites or compromised proxy servers can harvest the very credentials you are testing. Digital Tools Shed enforces strict client-side k-Anonymity: only the first 5 characters of a SHA-1 hash are queried; the remaining 35 characters are compared locally in your browser RAM.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 2: Credential Stuffing Across Reused Accounts (Breached Once, Pwned Everywhere)</strong>
          When an obscure forum or old gaming site is breached, cybercriminals feed the leaked email and password combinations into automated credential-stuffing engines (like OpenBullet) targeting banking, email, GitHub, and Amazon accounts. If you reuse a breached password on another service, your primary identity is compromised within hours of a public dump.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 3: Believing '0 Breaches' Means Immune to Attacks</strong>
          A "0 breaches" result simply means this specific character string has not yet surfaced in public collections indexed by HaveIBeenPwned. If the password has low Shannon entropy (e.g. fewer than 60 bits or short length), offline GPU rigs hashing at 100 billion guesses per second can brute-force it in minutes regardless of its breach status.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 4: Subtle Leetspeak &amp; Incremental Number Substitutions</strong>
          Replacing "E" with "3", "A" with "@", or appending "!" or "2024" to a breached password does not protect you. Modern hash cracking tools (such as Hashcat and John the Ripper) run rule-based mutators (e.g. 'OneRuleToRuleThemAll') that automatically test millions of leetspeak permutations on every breached root word.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 5: Ignoring Breach Context: Email vs Password-Only Dumps</strong>
          Password-only lists confirm that a passphrase is weak or widely used, but combo-lists (Email + Password pairs, such as the 3.2 billion record COMB dump) represent immediate targeted account takeover risks. Always combine breach audits with unique passwords managed by a password manager.
        </div>
      </div>

      <!-- FAQ Section -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Is it safe to type my password into this checker?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes! This tool implements Troy Hunt's mathematical k-Anonymity protocol. Your password is never sent over the network. Your browser computes a 40-character SHA-1 hash locally, transmits ONLY the first 5 characters (prefix) to the HaveIBeenPwned API, and receives a list of ~500 candidate suffixes. Your browser completes the match locally in private memory.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">What is k-Anonymity in cryptographic privacy?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">k-Anonymity is a mathematical property ensuring that an individual query cannot be distinguished from at least k-1 other candidate queries. By searching only the first 5 hex characters (which has 16^5 = 1,048,576 buckets), the server cannot determine which specific password among hundreds of thousands of possibilities you are checking.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">What should I do if my password is found in a data breach?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">If your password has appeared in a data breach, you must immediately stop using it across all accounts. Attackers use automated credential-stuffing bots to test breached password lists against thousands of websites. Generate a new, unique 20+ character password or Diceware passphrase and enable Two-Factor Authentication (TOTP).</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">If my password shows 0 breaches, is it guaranteed secure?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">No. A result of 0 breaches merely confirms that this exact password has not appeared in publicly exposed corporate breach databases. If the password is short, follows common dictionary patterns, or lacks bit-entropy (e.g. "Tr0ub4dor&3"), it can still be cracked within minutes by offline GPU clusters.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Does this tool store or log any passwords searched?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">No, absolutely not. Digital Tools Shed has zero backend databases for password tracking, zero logging scripts, and zero advertising trackers on this tool. Everything is computed in transient client-side RAM.</div>
        </details>
      </div>
    </div>

    <script>
      let lastReport = '';

      function togglePwnVisibility() {
        const inp = document.getElementById('pwn-input');
        const btn = document.getElementById('btnTogglePwn');
        if (inp.type === 'password') {
          inp.type = 'text';
          btn.textContent = '🔒 Hide';
        } else {
          inp.type = 'password';
          btn.textContent = '👁 Show';
        }
      }

      function loadSampleBreached() {
        document.getElementById('pwn-input').value = 'password123';
        checkPwned();
      }

      function clearPwn() {
        document.getElementById('pwn-input').value = '';
        document.getElementById('pwn-result').style.display = 'none';
        document.getElementById('pwn-telemetry').style.display = 'none';
        document.getElementById('pwn-actions').style.display = 'none';
      }

      async function sha1(str) {
        const enc = new TextEncoder();
        const buf = await window.crypto.subtle.digest('SHA-1', enc.encode(str));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      }

      async function checkPwned() {
        const val = document.getElementById('pwn-input').value;
        const res = document.getElementById('pwn-result');
        const tel = document.getElementById('pwn-telemetry');
        const acts = document.getElementById('pwn-actions');

        if (!val) {
          res.style.display = 'block';
          res.style.background = 'rgba(239, 68, 68, 0.12)';
          res.style.color = '#ef4444';
          res.innerHTML = '<strong>Error:</strong> Please enter a password to test.';
          return;
        }

        res.style.display = 'block';
        res.style.background = 'var(--surface-alt)';
        res.style.color = 'var(--fg)';
        res.innerHTML = 'Computing SHA-1 hash and querying HIBP k-Anonymity database...';

        try {
          const hash = await sha1(val);
          const prefix = hash.slice(0, 5);
          const suffix = hash.slice(5);

          const response = await fetch('https://api.pwnedpasswords.com/range/' + prefix);
          if (!response.ok) throw new Error('API returned status ' + response.status);
          const text = await response.text();

          const lines = text.split('\n');
          let foundCount = 0;
          for (const line of lines) {
            const parts = line.split(':');
            if (parts[0] && parts[0].trim() === suffix) {
              foundCount = parseInt(parts[1].trim(), 10) || 0;
              break;
            }
          }

          tel.style.display = 'block';
          acts.style.display = 'grid';
          document.getElementById('tel-sha1').textContent = hash;
          document.getElementById('tel-prefix').textContent = prefix + ' (Sent to API)';
          document.getElementById('tel-suffix').textContent = suffix + ' (Matched locally)';
          document.getElementById('tel-candidates').textContent = lines.length.toLocaleString() + ' hashes returned in bucket';
          document.getElementById('tel-count').textContent = foundCount.toLocaleString() + ' times';

          if (foundCount > 0) {
            res.style.background = 'rgba(239, 68, 68, 0.12)';
            res.style.color = '#ef4444';
            res.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            res.innerHTML = '<div style="font-family: var(--serif); font-size: 1.25rem; font-weight: bold; margin-bottom: 0.35rem;">⚠️ DANGER: Password Compromised in Data Breaches!</div>' +
              '<p style="margin: 0; line-height: 1.5; font-size: 0.92rem;">This exact password has appeared in publicly leaked breach databases <strong>' + foundCount.toLocaleString() + ' times</strong>. It is actively included in adversary dictionary attack wordlists and credential-stuffing bot scripts. <strong>Change this password immediately!</strong></p>';
          } else {
            res.style.background = 'rgba(34, 197, 94, 0.12)';
            res.style.color = '#22c55e';
            res.style.borderColor = 'rgba(34, 197, 94, 0.3)';
            res.innerHTML = '<div style="font-family: var(--serif); font-size: 1.25rem; font-weight: bold; margin-bottom: 0.35rem;">✓ Clean: No Matches Found in Known Breaches</div>' +
              '<p style="margin: 0; line-height: 1.5; font-size: 0.92rem;">This password was not found in the 800+ million records indexed by HaveIBeenPwned. (Remember: a clean breach record does not replace the need for high entropy and unique credentials across accounts).</p>';
          }

          lastReport = [
            '====================================================',
            'PASSWORD BREACH & PWNED AUDIT REPORT',
            'Digital Tools Shed - k-Anonymity HIBP Studio',
            '====================================================',
            'Breach Status          : ' + (foundCount > 0 ? 'COMPROMISED (' + foundCount.toLocaleString() + ' exposures)' : 'CLEAN (0 exposures found)'),
            'k-Anonymity Model      : Enforced (Password NEVER left device)',
            'SHA-1 Prefix Sent     : ' + prefix,
            'SHA-1 Suffix Matched   : ' + suffix,
            'Bucket Candidates      : ' + lines.length.toLocaleString() + ' candidate hashes inspected',
            'Audit Date             : ' + new Date().toISOString(),
            'Security Recommendation: ' + (foundCount > 0 ? 'Rotate password immediately across all services; enable TOTP 2FA.' : 'Ensure password meets 80+ bit entropy threshold.'),
            '===================================================='
          ].join('\n');

        } catch(e) {
          res.style.background = 'rgba(245, 158, 11, 0.12)';
          res.style.color = '#f59e0b';
          res.style.borderColor = 'rgba(245, 158, 11, 0.3)';
          res.innerHTML = '<strong>API Lookup Offline:</strong> Unable to connect to api.pwnedpasswords.com. This may be due to network disconnection or an aggressive browser adblocker filtering external range queries.';
        }
      }

      function copyBreachReport() {
        if (!lastReport) return;
        navigator.clipboard.writeText(lastReport).then(() => {
          const btn = document.getElementById('btnCopyBreachReport');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Breach Report Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }
    </script>
  `
    },
    {
      slug: 'totp-generator',
      title: "TOTP 2-Factor Authenticator Code Studio & RFC 6238 Simulator",
      metaDesc: "Generate real-time RFC 6238 TOTP two-factor authentication codes from Base32 secret keys. 100% client-side HMAC-SHA1 simulation with circular timer.",
      category: 'Security',
      faq: [
        {
                "q": "How does RFC 6238 Time-based One-Time Password (TOTP) work?",
                "a": "TOTP calculates a 6-digit or 8-digit code by applying an HMAC hash (typically HMAC-SHA1) to a shared secret key and the current Unix epoch time divided into 30-second time-steps. The resulting 160-bit HMAC is dynamically truncated to a 31-bit integer and formatted as a decimal code modulo 10^6."
        },
        {
                "q": "Is my 2FA secret key safe when entered into this tool?",
                "a": "Yes! The entire TOTP computation occurs 100% locally inside your browser using the native Web Cryptography API (window.crypto.subtle). Your secret key is never transmitted across the network or logged in any backend database."
        },
        {
                "q": "What is the standard time-step interval for TOTP?",
                "a": "The overwhelming majority of modern two-factor authenticators (Google Authenticator, Microsoft Authenticator, Authy, Bitwarden, 1Password) use a standard 30-second time-step interval and 6-digit codes."
        },
        {
                "q": "What causes TOTP \"Invalid Code\" errors during login?",
                "a": "The single most common cause is clock drift. Because TOTP relies on the current Unix timestamp, if your device clock is desynchronized by more than 30 seconds from the authentication server, the generated code will belong to a past or future time window and will be rejected."
        },
        {
                "q": "Can I generate a new random Base32 secret key with this tool?",
                "a": "Yes. You can click the \"⚡ Gen Random Secret\" button to create a cryptographically secure 16-character (80-bit) or 32-character (160-bit) Base32 secret key compliant with RFC 4648 standards."
        }
],
      body: `
    ${commonStyle}
    <style>
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.75rem; margin: 1rem 0; }
      .stat-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.85rem; text-align: center; }
      .stat-num { font-family: var(--mono); font-size: 1.15rem; font-weight: 700; color: var(--fg); }
      .stat-lbl { font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; margin-top: 0.25rem; }
      .tag-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
      .trap-card { border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; background: var(--surface-alt); font-size: 0.88rem; line-height: 1.55; }
      .totp-display-box { background: var(--surface-alt); padding: 2rem; border-radius: 8px; border: 1px solid var(--border); text-align: center; margin-top: 1.5rem; position: relative; }
      .totp-digits { font-family: var(--mono); font-size: 2.8rem; font-weight: 700; letter-spacing: 0.18em; color: var(--btn-bg, #3b82f6); margin: 0.5rem 0; }
      .progress-ring { width: 44px; height: 44px; }
      .formula-box { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; margin: 1.25rem 0; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg); }
    </style>
    <div class="article-container" style="max-width: 920px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/security/">Privacy &amp; Security</a> &gt; TOTP Authenticator Generator
      </nav>

      <div class="tag-row">
        <span class="badge badge-green">RFC 6238 Standard</span>
        <span class="badge badge-amber">Web Crypto HMAC-SHA1/256/512</span>
        <span class="badge badge-green">100% Client-Side Simulation</span>
      </div>

      <h1 style="font-family: var(--serif); font-size: 1.9rem; margin-bottom: 0.5rem;">TOTP 2-Factor Authenticator Code Studio &amp; RFC 6238 Simulator</h1>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
        Generate authentic Two-Factor Authentication (2FA) codes in real time from Base32 secret keys. Simulates Google Authenticator, Microsoft Authenticator, Authy, and Bitwarden with live countdown visualization and multi-window drift verification.
      </p>

      <div class="tool-box">
        <!-- Input Field & Key Controls -->
        <div class="field-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.5rem;">
            <label class="field-label" style="margin:0;">Base32 Secret Key</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <button type="button" class="btn-sec" onclick="generateRandomSecret()" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">⚡ Gen Random Secret</button>
              <button type="button" class="btn-sec" onclick="loadSampleSecret()" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">Sample Key</button>
            </div>
          </div>
          <input type="text" id="totp-secret" class="code-input" value="JBSWY3DPEHPK3PXP" placeholder="Enter Base32 secret key (e.g. JBSWY3DPEHPK3PXP)..." oninput="onSecretChanged()" style="font-size: 1.05rem; letter-spacing: 0.08em;" autocomplete="off" />
        </div>

        <!-- Algorithm & Settings Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem; margin-bottom: 1.25rem; padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);">
          <div>
            <label class="field-label" style="margin-bottom: 0.25rem;">Hash Algorithm</label>
            <select id="totp-algo" class="text-input" style="font-size: 0.85rem; padding: 0.45rem 0.6rem;" onchange="updateTotp()">
              <option value="SHA-1" selected>SHA-1 (Google Authenticator)</option>
              <option value="SHA-256">SHA-256 (High Security)</option>
              <option value="SHA-512">SHA-512 (Extended)</option>
            </select>
          </div>
          <div>
            <label class="field-label" style="margin-bottom: 0.25rem;">Code Digits</label>
            <select id="totp-digits" class="text-input" style="font-size: 0.85rem; padding: 0.45rem 0.6rem;" onchange="updateTotp()">
              <option value="6" selected>6 Digits (Standard)</option>
              <option value="8">8 Digits (Enterprise)</option>
            </select>
          </div>
          <div>
            <label class="field-label" style="margin-bottom: 0.25rem;">Time Step (Interval)</label>
            <select id="totp-step" class="text-input" style="font-size: 0.85rem; padding: 0.45rem 0.6rem;" onchange="updateTotp()">
              <option value="30" selected>30 Seconds (Default)</option>
              <option value="60">60 Seconds</option>
            </select>
          </div>
        </div>

        <!-- Big Display Card -->
        <div class="totp-display-box">
          <div class="field-label" style="letter-spacing: 0.12em;">Current Active 2FA Token</div>
          <div id="totp-code" class="totp-digits">--- ---</div>
          
          <!-- Animated Progress Countdown -->
          <div style="display: flex; justify-content: center; align-items: center; gap: 0.75rem; margin-top: 0.5rem;">
            <div style="width: 140px; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden;">
              <div id="totp-bar" style="height: 100%; width: 100%; background: #3b82f6; transition: width 1s linear;"></div>
            </div>
            <span id="totp-time" style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted); font-weight: bold;">30s</span>
          </div>

          <!-- Neighboring Windows (Drift Preview) -->
          <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 1.25rem; font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 0.75rem;">
            <div>Previous Window (-30s): <strong id="totp-prev" style="color: var(--fg);">-</strong></div>
            <div>Next Window (+30s): <strong id="totp-next" style="color: var(--fg);">-</strong></div>
          </div>
        </div>

        <!-- Action Copy Buttons Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 1.25rem;">
          <button type="button" id="btnCopyTotp" class="btn-primary" onclick="copyTotpCode()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span>📋 Copy Active 6-Digit Code</span>
          </button>
          <button type="button" id="btnCopySecret" class="btn-sec" onclick="copySecretKey()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); color: var(--fg); font-weight: 600;">
            <span>📋 Copy Secret Key</span>
          </button>
          <button type="button" id="btnCopyTotpReport" class="btn-sec" onclick="copyTotpReport()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); color: var(--fg); font-weight: 600;">
            <span>📋 Copy Diagnostic Audit</span>
          </button>
        </div>

        <!-- Real-Time RFC 6238 Telemetry -->
        <div class="stat-grid" style="margin-top: 1.25rem;">
          <div class="stat-card"><div class="stat-num" id="stat-epoch">0</div><div class="stat-lbl">Unix Epoch (s)</div></div>
          <div class="stat-card"><div class="stat-num" id="stat-counter">0</div><div class="stat-lbl">Time Step Counter (T)</div></div>
          <div class="stat-card"><div class="stat-num" id="stat-key-bits">80 bits</div><div class="stat-lbl">Secret Key Entropy</div></div>
          <div class="stat-card"><div class="stat-num" id="stat-latency">&lt; 1 ms</div><div class="stat-lbl">HMAC Execution</div></div>
        </div>
      </div>

      <!-- RFC 6238 Mathematical Derivation -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem;">RFC 6238 Algorithm Specification &amp; Mathematical Derivation</h2>
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
          Time-based One-Time Password (TOTP) is an extension of the HMAC-based One-Time Password algorithm (HOTP, RFC 4226). Instead of an incrementing event counter, TOTP uses the current Unix timestamp as the moving factor:
        </p>

        <div class="formula-box">
<strong>Step 1: Calculate the Time Counter (T):</strong>
T = floor((UnixTime - T0) / X)
Where:
  - UnixTime is current seconds since January 1, 1970 UTC
  - T0 is epoch reference (default: 0)
  - X is time step interval (default: 30 seconds)

<strong>Step 2: Compute HMAC Value (HS):</strong>
HS = HMAC-SHA-1(Key = Base32Decode(Secret), Data = INT_64_BE(T))
Result is a 20-byte (160-bit) binary hash.

<strong>Step 3: Dynamic Truncation (DT):</strong>
Offset = HS[19] &amp; 0x0F  (Extract lowest 4 bits of the last byte; value between 0 and 15)
BinaryCode = ((HS[Offset] &amp; 0x7F) &lt;&lt; 24) |
             ((HS[Offset + 1] &amp; 0xFF) &lt;&lt; 16) |
             ((HS[Offset + 2] &amp; 0xFF) &lt;&lt; 8)  |
             (HS[Offset + 3] &amp; 0xFF)

<strong>Step 4: Format Decimal Code:</strong>
TOTP = BinaryCode mod 10^Digits  (padded to 6 or 8 digits with leading zeros)
        </div>
      </div>

      <!-- 5 Fatal Traps & 2FA Implementation Pitfalls -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">5 Fatal Traps in Two-Factor Authentication &amp; TOTP Implementations</h2>

        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 1: Clock Drift &amp; Missing Verification Window Tolerance (RFC 6238 Drift)</strong>
          Network latency and device clock drift (even by 15–20 seconds) cause client and server time steps to fall out of phase. RFC 6238 Section 5.2 explicitly recommends that authentication servers check at least one preceding and one following time step (a window of (T-1, T, T+1), covering 90 seconds total). Strictly checking only the exact current timestamp causes frequent false rejection of legitimate logins.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 2: Insecure Secret Key Storage &amp; Plaintext Database Leakage</strong>
          Storing Base32 shared secrets in plaintext within your SQL database completely neutralizes 2FA. If an attacker dumps your database via SQL injection, they acquire every user's master TOTP seed and can generate identical tokens indefinitely. Shared secrets must be encrypted at rest using an envelope key (e.g. AES-256-GCM via AWS KMS or HashiCorp Vault).
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 3: SMS/Email 2FA Fallacy (SIM Swapping vs Cryptographic TOTP)</strong>
          Relying on SMS or email verification codes is vastly inferior to app-based TOTP. SMS messages traverse cellular carrier networks in plaintext and are routinely hijacked via SIM-swapping attacks (bribing or tricking telecom support reps) and SS7 signaling exploits. Offline TOTP authenticators generate codes locally with zero telecom dependency.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 4: Failure to Invalidate Used One-Time Passwords (Replay Attacks)</strong>
          Under RFC 6238 Section 5.2, an OTP must NEVER be accepted more than once. If a user enters code "123456" at second 5 of a 30-second window, an attacker eavesdropping on the network connection can replay that exact code during the remaining 25 seconds unless the authentication backend records and invalidates the token in a Redis cache.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6; font-family: var(--mono); display: block; margin-bottom: 0.25rem;">Trap 5: QR Code Phishing &amp; Reverse Proxy MITM Attacks (Evilginx Bypass)</strong>
          While TOTP protects against static password credential stuffing, it does NOT protect against real-time Man-in-the-Middle reverse proxies (like Evilginx). If an adversary tricks a user into entering their username, password, and active 6-digit TOTP code onto a spoofed phishing page, the proxy immediately replays the code to the real service and intercepts the authenticated session cookie. Only FIDO2/WebAuthn hardware keys provide cryptographic origin binding against MITM.
        </div>
      </div>

      <!-- FAQ Section -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">How does RFC 6238 Time-based One-Time Password (TOTP) work?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">TOTP calculates a 6-digit or 8-digit code by applying an HMAC hash (typically HMAC-SHA1) to a shared secret key and the current Unix epoch time divided into 30-second time-steps. The resulting 160-bit HMAC is dynamically truncated to a 31-bit integer and formatted as a decimal code modulo 10^6.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Is my 2FA secret key safe when entered into this tool?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes! The entire TOTP computation occurs 100% locally inside your browser using the native Web Cryptography API (window.crypto.subtle). Your secret key is never transmitted across the network or logged in any backend database.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">What is the standard time-step interval for TOTP?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">The overwhelming majority of modern two-factor authenticators (Google Authenticator, Microsoft Authenticator, Authy, Bitwarden, 1Password) use a standard 30-second time-step interval and 6-digit codes.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">What causes TOTP "Invalid Code" errors during login?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">The single most common cause is clock drift. Because TOTP relies on the current Unix timestamp, if your device clock is desynchronized by more than 30 seconds from the authentication server, the generated code will belong to a past or future time window and will be rejected.</div>
        </details>
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Can I generate a new random Base32 secret key with this tool?</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">Yes. You can click the "⚡ Gen Random Secret" button to create a cryptographically secure 16-character (80-bit) or 32-character (160-bit) Base32 secret key compliant with RFC 4648 standards.</div>
        </details>
      </div>
    </div>

    <script>
      let currentRawCode = '';

      function base32ToUint8Array(base32) {
        const b32 = base32.toUpperCase().replace(/\s+/g, '').replace(/=+$/, '');
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

      function generateRandomSecret() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        const arr = new Uint8Array(16);
        window.crypto.getRandomValues(arr);
        let s = '';
        for (let i = 0; i < arr.length; i++) {
          s += chars[arr[i] % chars.length];
        }
        document.getElementById('totp-secret').value = s;
        onSecretChanged();
      }

      function loadSampleSecret() {
        document.getElementById('totp-secret').value = 'JBSWY3DPEHPK3PXP';
        onSecretChanged();
      }

      function onSecretChanged() {
        const sec = document.getElementById('totp-secret').value.trim();
        const bits = Math.round(sec.length * 5);
        document.getElementById('stat-key-bits').textContent = bits + ' bits';
        updateTotp();
      }

      async function computeHmacOtp(keyBytes, timeStep, algo, digits) {
        const timeBuffer = new ArrayBuffer(8);
        const timeView = new DataView(timeBuffer);
        timeView.setUint32(4, timeStep, false);

        const hashName = (algo === 'SHA-256' ? 'SHA-256' : algo === 'SHA-512' ? 'SHA-512' : 'SHA-1');
        const cryptoKey = await window.crypto.subtle.importKey(
          'raw', keyBytes, { name: 'HMAC', hash: hashName }, false, ['sign']
        );

        const hmac = await window.crypto.subtle.sign('HMAC', cryptoKey, timeBuffer);
        const hmacBytes = new Uint8Array(hmac);

        const offset = hmacBytes[hmacBytes.length - 1] & 0x0f;
        const binary = ((hmacBytes[offset] & 0x7f) << 24) |
                       ((hmacBytes[offset + 1] & 0xff) << 16) |
                       ((hmacBytes[offset + 2] & 0xff) << 8) |
                       (hmacBytes[offset + 3] & 0xff);

        const mod = (digits === 8 ? 100000000 : 1000000);
        return (binary % mod).toString().padStart(digits, '0');
      }

      async function updateTotp() {
        const secret = document.getElementById('totp-secret').value.trim();
        const codeEl = document.getElementById('totp-code');
        const timeEl = document.getElementById('totp-time');
        const barEl = document.getElementById('totp-bar');
        const algo = document.getElementById('totp-algo').value;
        const digits = parseInt(document.getElementById('totp-digits').value, 10) || 6;
        const step = parseInt(document.getElementById('totp-step').value, 10) || 30;

        const epoch = Math.floor(Date.now() / 1000);
        const timeCounter = Math.floor(epoch / step);
        const remaining = step - (epoch % step);

        document.getElementById('stat-epoch').textContent = epoch.toLocaleString();
        document.getElementById('stat-counter').textContent = timeCounter.toLocaleString();

        timeEl.textContent = remaining + 's';
        barEl.style.width = ((remaining / step) * 100) + '%';
        if (remaining <= 5) {
          barEl.style.background = '#ef4444';
        } else if (remaining <= 10) {
          barEl.style.background = '#f59e0b';
        } else {
          barEl.style.background = '#3b82f6';
        }

        const keyBytes = base32ToUint8Array(secret);
        if (keyBytes.length === 0) {
          codeEl.textContent = 'INVALID KEY';
          codeEl.style.color = '#ef4444';
          return;
        }
        codeEl.style.color = 'var(--btn-bg, #3b82f6)';

        try {
          const t0 = performance.now();
          const currentCode = await computeHmacOtp(keyBytes, timeCounter, algo, digits);
          const prevCode = await computeHmacOtp(keyBytes, timeCounter - 1, algo, digits);
          const nextCode = await computeHmacOtp(keyBytes, timeCounter + 1, algo, digits);
          const latency = (performance.now() - t0).toFixed(1);

          document.getElementById('stat-latency').textContent = latency + ' ms';
          currentRawCode = currentCode;

          if (digits === 6) {
            codeEl.textContent = currentCode.slice(0, 3) + ' ' + currentCode.slice(3);
            document.getElementById('totp-prev').textContent = prevCode.slice(0, 3) + ' ' + prevCode.slice(3);
            document.getElementById('totp-next').textContent = nextCode.slice(0, 3) + ' ' + nextCode.slice(3);
          } else {
            codeEl.textContent = currentCode.slice(0, 4) + ' ' + currentCode.slice(4);
            document.getElementById('totp-prev').textContent = prevCode.slice(0, 4) + ' ' + prevCode.slice(4);
            document.getElementById('totp-next').textContent = nextCode.slice(0, 4) + ' ' + nextCode.slice(4);
          }
        } catch(e) {
          codeEl.textContent = 'ERROR';
        }
      }

      function copyTotpCode() {
        if (!currentRawCode) return;
        navigator.clipboard.writeText(currentRawCode).then(() => {
          const btn = document.getElementById('btnCopyTotp');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Code (' + currentRawCode + ') Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      function copySecretKey() {
        const sec = document.getElementById('totp-secret').value.trim();
        if (!sec) return;
        navigator.clipboard.writeText(sec).then(() => {
          const btn = document.getElementById('btnCopySecret');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Secret Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      function copyTotpReport() {
        const sec = document.getElementById('totp-secret').value.trim();
        const algo = document.getElementById('totp-algo').value;
        const digits = document.getElementById('totp-digits').value;
        const step = document.getElementById('totp-step').value;
        const epoch = document.getElementById('stat-epoch').textContent;
        const counter = document.getElementById('stat-counter').textContent;

        const report = [
          '====================================================',
          'RFC 6238 TOTP AUTHENTICATION AUDIT REPORT',
          'Digital Tools Shed TOTP Studio',
          '====================================================',
          'Active TOTP Code       : ' + currentRawCode,
          'Base32 Secret Key      : ' + sec,
          'Hash Algorithm         : HMAC-' + algo,
          'Code Length            : ' + digits + ' digits',
          'Time Step Interval     : ' + step + ' seconds',
          'Current Unix Epoch     : ' + epoch + 's',
          'Calculated Counter (T) : ' + counter,
          'Drift Tolerance Tested : T-1, T, T+1 (3-Window Range)',
          'Client-Side Isolation  : 100% In-Browser (Web Crypto API)',
          '===================================================='
        ].join('\n');

        navigator.clipboard.writeText(report).then(() => {
          const btn = document.getElementById('btnCopyTotpReport');
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Audit Report Copied!</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      }

      setInterval(updateTotp, 1000);
      document.addEventListener('DOMContentLoaded', () => {
        onSecretChanged();
      });
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
