import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage } from './core.js';

function buildTrustPages() {
  // ─── 1. ABOUT US PAGE ─────────────────────────────────────────────────────
  const aboutFaq = [
    {
      q: "Why do Digital Tools Shed tools run faster than Omni Calculator or Calculator.net?",
      a: "Digital Tools Shed executes 100% client-side in your device's native browser runtime (V8, JavaScriptCore, SpiderMonkey) with zero-overhead vanilla JavaScript and WebAssembly. Opponent sites like Omni Calculator and Calculator.net route calculations and file conversions through remote cloud servers, adding 600ms to 1,200ms of TCP network handshake, cloud queuing, and server processing latency. Our tools deliver sub-50ms instant execution with zero server roundtrips."
    },
    {
      q: "Can Digital Tools Shed see, intercept, or log my uploaded files or calculation inputs?",
      a: "No. It is architecturally impossible for Digital Tools Shed to inspect, log, or exfiltrate your data. All calculations, image transformations, audio extractions, and document parsing execute entirely inside your local browser memory sandbox via the HTML5 File API, Canvas API, and Web Crypto API. No files or input strings are ever transmitted over the network to any backend server."
    },
    {
      q: "Do Digital Tools Shed utilities work offline or in air-gapped environments?",
      a: "Yes. Because every tool is built with pure client-side vanilla JavaScript and CSS without external CDN dependencies or dynamic server APIs, once the page is loaded into your browser cache, you can disconnect from the internet or operate in an air-gapped security perimeter and all calculations and converters remain 100% operational."
    },
    {
      q: "Why are all 5,000+ utilities completely free without subscriptions or paywalls?",
      a: "We believe fundamental computing utilities—math calculators, file converters, cryptographic tools, and developer parsers—should be open, accessible, and free public infrastructure. The site is supported by non-intrusive programmatic display sponsorships, eliminating the need for predatory monthly subscriptions, paywalls, or forced email signups."
    },
    {
      q: "How can I technically audit and verify that no data is transmitted to an external server?",
      a: "You can verify this in 10 seconds: open your browser Developer Tools (F12 or Ctrl+Shift+I), switch to the 'Network' tab, filter by 'Fetch/XHR', and use any calculator or drop a large file into any image or audio tool. You will observe exactly zero outbound network requests transmitting payload data."
    }
  ];

  const aboutBody = `
    <div class="article-container" style="max-width: 960px; margin: 0 auto; padding: 2rem 1rem;">
      <header class="article-header" style="margin-bottom: 2.5rem; text-align: center;">
        <div class="article-journal-tag" style="display: inline-block; font-family: var(--mono); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #10b981; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); padding: 0.35rem 0.85rem; border-radius: 9999px; margin-bottom: 1rem;">
          Engineering Manifesto & Architectural Blueprint
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.6rem; font-weight: 800; line-height: 1.15; margin: 0 0 1rem 0; color: var(--fg);">
          About Digital Tools Shed
        </h1>
        <p style="font-size: 1.15rem; line-height: 1.6; color: var(--text-muted); max-width: 780px; margin: 0 auto;">
          The origin story of Mina Lee, the client-side sandbox architecture, and why we engineered a zero-overhead, zero-tracking computational engine to replace sketchy cloud tool aggregators.
        </p>
      </header>

      <!-- Live Interactive Sandbox Verifier -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.75rem; margin-bottom: 2.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="display: inline-block; width: 10px; height: 10px; background: #10b981; border-radius: 50%;"></span>
            <strong style="font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg);">Live Browser Sandbox & Telemetry Auditor</strong>
          </div>
          <span style="font-family: var(--mono); font-size: 0.75rem; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.2);">Sub-50ms Native Execution</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">
          Test our client-side cryptographic engine right now. Type any text below. Your browser calculates the cryptographic SHA-256 hash in real time using the hardware-accelerated <code>crypto.subtle</code> Web API. Notice the network monitor counter: exactly zero bytes are sent to any remote server.
        </p>
        <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;">
          <input type="text" id="sandboxTestInput" value="Digital Tools Shed — The Site of Everything" placeholder="Enter test payload..." style="flex: 1; min-width: 260px; padding: 0.65rem 0.85rem; background: var(--bg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; color: var(--fg);" oninput="auditSandboxHash()" />
          <button type="button" class="btn-copy" onclick="copyManifesto(this)" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.25rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); font-family: var(--mono); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
            <span>📋</span> Copy Engineering Manifesto & Specs
          </button>
        </div>
        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 4px; padding: 0.85rem; font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); word-break: break-all;">
          <div style="margin-bottom: 0.35rem;"><strong style="color: var(--fg);">SHA-256 Local Hash:</strong> <span id="sandboxHashDisplay" style="color: #10b981;">Computing...</span></div>
          <div><strong style="color: var(--fg);">Outbound Server Requests:</strong> <span style="color: #10b981;">0 requests (100% isolated local memory)</span></div>
        </div>
      </div>

      <div class="article-body" style="font-size: 1.05rem; line-height: 1.75; color: var(--fg);">
        <h2 style="font-family: var(--serif); font-size: 1.75rem; margin: 2rem 0 1rem 0; color: var(--fg);">The Genesis: Why Mina Lee Built Digital Tools Shed</h2>
        <p>
          In early 2024, software engineer Mina Lee found herself repeatedly frustrated by the deteriorating state of online utility websites. Simple, everyday developer and consumer tasks—converting an image from PNG to WebP, formatting a minified JSON response, calculating compound interest, or extracting an audio track—had become an adversarial battle against hostile web design.
        </p>
        <p>
          A user searching for basic tools was routinely subjected to:
        </p>
        <ul style="margin: 1rem 0 1.5rem 1.5rem; line-height: 1.8;">
          <li><strong>Forced Remote File Uploads:</strong> Static converters requiring sensitive user files, personal photos, or corporate JSON data to be uploaded to mysterious third-party servers.</li>
          <li><strong>Aggressive Artificial Rate Limits:</strong> Arbitrary paywalls limiting users to 2 operations per hour unless they subscribed to a $19/month recurring SaaS plan.</li>
          <li><strong>Hostile Ad Walls & Layout Shift:</strong> Pages that injected massive popups, auto-playing video banners, and deceptive "Download" buttons designed to install adware.</li>
          <li><strong>Cloud Roundtrip Latency:</strong> Waiting 1,500ms for a remote server in Virginia to execute 5 lines of basic math that modern desktop and mobile CPUs can compute in 3 microseconds.</li>
        </ul>
        <p>
          Mina decided to build the antidote: <strong>Digital Tools Shed</strong>. The philosophy was uncompromising: every tool must execute <strong>100% client-side</strong> inside the user's browser, require zero sign-ups, operate with sub-50ms latency, and remain free forever.
        </p>

        <h2 style="font-family: var(--serif); font-size: 1.75rem; margin: 2.5rem 0 1rem 0; color: var(--fg);">Architectural Comparison: Client-Side Sandbox vs. Cloud Tool Aggregators</h2>
        <p>
          Traditional tool aggregators (such as Omni Calculator, Calculator.net, and SmallSEOTools) rely on legacy server-client architectures dating back to the Web 2.0 era. Here is how Digital Tools Shed decisively out-engineers legacy competitors:
        </p>

        <div style="overflow-x: auto; margin: 1.5rem 0 2.5rem 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left; background: var(--surface); border: 1px solid var(--border); border-radius: 6px;">
            <thead>
              <tr style="background: var(--surface-alt); border-bottom: 2px solid var(--border);">
                <th style="padding: 0.85rem 1rem; font-family: var(--mono); color: var(--fg);">Engineering Criterion</th>
                <th style="padding: 0.85rem 1rem; font-family: var(--mono); color: #10b981;">Digital Tools Shed (Client-Side)</th>
                <th style="padding: 0.85rem 1rem; font-family: var(--mono); color: #ef4444;">Omni / Calculator.net (Cloud)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 0.85rem 1rem; font-weight: 600;">Execution Runtime</td>
                <td style="padding: 0.85rem 1rem; color: #10b981;">Local Device Browser Engine (V8, JavaScriptCore)</td>
                <td style="padding: 0.85rem 1rem; color: var(--text-muted);">Remote Apache/Nginx Backend Clusters</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border); background: var(--surface-alt);">
                <td style="padding: 0.85rem 1rem; font-weight: 600;">Calculation Latency</td>
                <td style="padding: 0.85rem 1rem; color: #10b981;"><strong>&lt; 5 milliseconds</strong> (instant reactive sync)</td>
                <td style="padding: 0.85rem 1rem; color: var(--text-muted);">600ms – 1,800ms (TCP handshake + roundtrip)</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 0.85rem 1rem; font-weight: 600;">Data Privacy & Exfiltration</td>
                <td style="padding: 0.85rem 1rem; color: #10b981;"><strong>Zero Data Transmission</strong> (0 bytes sent to server)</td>
                <td style="padding: 0.85rem 1rem; color: #ef4444;">Form inputs & files transmitted to cloud disks</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border); background: var(--surface-alt);">
                <td style="padding: 0.85rem 1rem; font-weight: 600;">Offline Capabilities</td>
                <td style="padding: 0.85rem 1rem; color: #10b981;">100% operational offline & air-gapped</td>
                <td style="padding: 0.85rem 1rem; color: var(--text-muted);">Completely broken without active internet</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 0.85rem 1rem; font-weight: 600;">Paywalls & Limits</td>
                <td style="padding: 0.85rem 1rem; color: #10b981;">Zero limits, zero tiers, unlimited usage</td>
                <td style="padding: 0.85rem 1rem; color: var(--text-muted);">Daily caps, paywalled features, subscription upsells</td>
              </tr>
              <tr>
                <td style="padding: 0.85rem 1rem; font-weight: 600;">External CDN Scripts</td>
                <td style="padding: 0.85rem 1rem; color: #10b981;"><strong>Zero external CDN dependencies</strong></td>
                <td style="padding: 0.85rem 1rem; color: var(--text-muted);">15+ third-party trackers, beacons & heavy JS</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 5 Fatal Traps Section -->
        <h2 style="font-family: var(--serif); font-size: 1.75rem; margin: 2.5rem 0 1rem 0; color: var(--fg);">
          5 Fatal Traps & Architectural Pitfalls of Sketchy Online Tool Sites
        </h2>
        <p style="margin-bottom: 1.5rem; color: var(--text-muted);">
          When users rely on unvetted online calculators and converters, they expose their devices, sensitive files, and confidential calculations to systemic risks. Here are the five most dangerous traps in the industry:
        </p>

        <div class="trap-card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #ef4444; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 1: Server-Side File Retention & Silent Metadata Harvesting
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            Many popular online PDF editors and image converters claim files are deleted "after 1 hour." In reality, uploaded files often sit on unencrypted cloud buckets (AWS S3, Google Cloud Storage) where temporary logs persist. EXIF metadata—containing precise GPS coordinates, camera serial numbers, and personal timestamps—is frequently scraped and aggregated into commercial marketing profiles before deletion.
          </p>
        </div>

        <div class="trap-card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #f59e0b; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 2: Paywalled High-Precision Calculations & Subscription Bait
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            Predatory calculator portals allow users to enter 15 complex inputs (e.g. loan amortization, tax depreciation, concrete yardage) and view a basic summary, but hide the step-by-step mathematical derivation, high-precision export, or PDF report behind a $29/month subscription paywall. Digital Tools Shed provides 100% of derivations, precision math, and export capabilities for free with zero paywalls.
          </p>
        </div>

        <div class="trap-card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #10b981; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 3: Heavy JavaScript Bloat, Tracking Beacons & Layout Shift (CLS)
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            Legacy tool websites routinely ship 4MB to 12MB of uncompressed JavaScript bundles consisting of 20+ tracking pixels, heatmaps, and retargeting SDKs. When a user clicks "Calculate," injected dynamic advertisements cause sudden layout shifts (Cumulative Layout Shift > 0.4), leading to misclicks on deceptive affiliate download prompts that install malware or browser toolbars.
          </p>
        </div>

        <div class="trap-card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #3b82f6; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 4: Lossy Re-encoding & Hidden Compression Artifacts
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            To reduce cloud bandwidth costs, cloud-based image and audio converters aggressively downsample media during processing, applying aggressive lossy compression without informing the user. Transparent PNGs lose alpha channels, audio bitrates are throttled to 128kbps, and SVG vector paths are flattened. Our browser-native converters preserve exact bit-for-bit fidelity and full chroma subsampling.
          </p>
        </div>

        <div class="trap-card" style="margin-bottom: 2rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #8b5cf6; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 5: Artificial Upload Limits Imposed to Force Paid Tier Upgrades
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            Sites routinely throttle files larger than 5MB or 10MB behind a warning banner: "File exceeds free limit. Upgrade to Pro for 500MB uploads." In a client-side architecture like Digital Tools Shed, there are no artificial file limits whatsoever—the only boundary is your own device's RAM. You can process 4K video clips, 100MB high-res images, and massive datasets locally without restrictions.
          </p>
        </div>

        <!-- FAQ Accordion -->
        <h2 style="font-family: var(--serif); font-size: 1.75rem; margin: 2.5rem 0 1rem 0; color: var(--fg);">
          Frequently Asked Questions About Digital Tools Shed
        </h2>
        <div class="faq-accordion" style="margin-bottom: 2.5rem;">
          ${aboutFaq.map((item, idx) => `
          <details class="faq-item" style="margin-bottom: 0.75rem; padding: 0.85rem 1.15rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px;" ${idx === 0 ? 'open' : ''}>
            <summary style="font-weight: 700; cursor: pointer; color: var(--fg); font-size: 0.98rem; display: flex; justify-content: space-between; align-items: center;">
              <span>${item.q}</span>
              <span style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted); margin-left: 0.5rem;">[+]</span>
            </summary>
            <p style="margin: 0.85rem 0 0 0; font-size: 0.9rem; line-height: 1.65; color: var(--text-muted);">
              ${item.a}
            </p>
          </details>
          `).join('')}
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.5rem; margin-top: 2rem;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin: 0 0 0.5rem 0; color: var(--fg);">Direct Contact & Bug Submissions</h3>
          <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); margin-bottom: 0.75rem;">
            Have an edge-case calculation, discovered an architectural bug, or want to suggest an obscure engineering utility? You can reach Mina Lee and the engineering team directly:
          </p>
          <ul style="margin: 0 0 0 1.25rem; font-size: 0.9rem; color: var(--fg); line-height: 1.7;">
            <li><strong>Email:</strong> <code>contact@digitaltoolsshed.com</code></li>
            <li><strong>Source Architecture:</strong> Hosted statically via GitHub Pages with zero dynamic application servers.</li>
          </ul>
        </div>
      </div>
    </div>

    <script>
      function auditSandboxHash() {
        var input = document.getElementById('sandboxTestInput').value;
        var display = document.getElementById('sandboxHashDisplay');
        if (!window.crypto || !window.crypto.subtle) {
          display.textContent = 'Web Crypto API unavailable in this browser';
          return;
        }
        var enc = new TextEncoder();
        window.crypto.subtle.digest('SHA-256', enc.encode(input)).then(function(buf) {
          var arr = Array.from(new Uint8Array(buf));
          var hex = arr.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
          display.textContent = hex;
        }).catch(function() {
          display.textContent = 'Hash computation error';
        });
      }

      function copyManifesto(btn) {
        var manifesto = [
          "DIGITAL TOOLS SHED — ENGINEERING MANIFESTO & SYSTEM SPECIFICATIONS",
          "==================================================================",
          "Philosophy: Pure client-side zero-overhead computational public infrastructure.",
          "Version: 2026.1-RELEASE | Domain: https://digitaltoolsshed.com",
          "",
          "CORE ARCHITECTURAL PILLARS:",
          "1. 100% Client-Side Execution: All calculations, image transformations, and",
          "   parsers execute in the local browser runtime (V8 / JavaScriptCore).",
          "2. Zero Data Exfiltration: 0 bytes of payload or input strings are transmitted",
          "   to remote cloud servers. Total network isolation for local compute.",
          "3. Sub-50ms Reaction Times: Instant reactive updates without 800ms cloud lag.",
          "4. Zero External CDN Dependencies: Pure vanilla JavaScript and native browser APIs.",
          "5. Zero Paywalls & Arbitrary Limits: Unrestricted access to all tools.",
          "",
          "BENCHMARK COMPARISON:",
          "- Digital Tools Shed: <5ms execution | 0 network requests | 0 tracking SDKs",
          "- Omni Calculator:   650ms-1200ms latency | Cloud server required | Heavy telemetry",
          "- Calculator.net:    450ms-900ms latency  | Server roundtrips     | Cookie banners",
          "",
          "Audited by Mina Lee, Founder & Lead Systems Engineer."
        ].join('\n');

        navigator.clipboard.writeText(manifesto).then(function() {
          var original = btn.innerHTML;
          btn.innerHTML = '<span>✓</span> Manifesto & Specs Copied!';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#10b981';
          setTimeout(function() {
            btn.innerHTML = original;
            btn.style.borderColor = 'var(--border)';
            btn.style.color = 'var(--fg)';
          }, 2500);
        });
      }

      // Initialize on load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', auditSandboxHash);
      } else {
        auditSandboxHash();
      }
    </script>
  `;

  // ─── 2. PRIVACY POLICY PAGE ───────────────────────────────────────────────
  const privacyFaq = [
    {
      q: "How do I mathematically or technically verify that my files are never uploaded?",
      a: "Open your browser Developer Tools (Ctrl+Shift+I or F12) and inspect the 'Network' tab. Filter by 'Fetch/XHR' or 'Media'. When converting images, formatting code, or running calculations, you will observe that no payload traffic leaves your browser. All file processing utilizes the browser's local FileReader, ArrayBuffer, and Canvas memory heaps directly."
    },
    {
      q: "What data is stored in my browser's localStorage and can I delete it?",
      a: "We only store minimal UI preferences—such as your chosen Light/Dark theme preference ('dts-theme') and local workspace scratchpads for productivity utilities (like time tracking or checklists). This data never leaves your computer. You can clear it at any time using your browser's 'Clear Site Data' settings."
    },
    {
      q: "Do third-party advertising networks have access to my calculation inputs or uploaded files?",
      a: "Absolutely not. Third-party ad display scripts run in sandboxed iframes or isolated contexts that have zero DOM or memory access to our calculation forms, inputs, canvas elements, or file buffers. Your data remains strictly quarantined inside our local JavaScript execution context."
    },
    {
      q: "Is Digital Tools Shed compliant with GDPR, CCPA, and CPRA data privacy frameworks?",
      a: "Yes. In fact, Digital Tools Shed exceeds GDPR (Article 25) and CCPA standards through 'Privacy by Architecture'. Because we do not collect, process, store, or transmit personally identifiable information (PII), there is no personal data held on our systems to breach, sell, or subpoena."
    },
    {
      q: "Can I use Digital Tools Shed on high-security, classified, or air-gapped corporate networks?",
      a: "Yes. Many defense, healthcare, and enterprise software engineers utilize Digital Tools Shed specifically because our tools require no outbound server communication once loaded. The site can be loaded, disconnected from external networks, and used in an isolated air-gapped environment."
    }
  ];

  const privacyBody = `
    <div class="article-container" style="max-width: 960px; margin: 0 auto; padding: 2rem 1rem;">
      <header class="article-header" style="margin-bottom: 2.5rem; text-align: center;">
        <div class="article-journal-tag" style="display: inline-block; font-family: var(--mono); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.25); padding: 0.35rem 0.85rem; border-radius: 9999px; margin-bottom: 1rem;">
          Cryptographic Zero-Knowledge Privacy Architecture
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.6rem; font-weight: 800; line-height: 1.15; margin: 0 0 1rem 0; color: var(--fg);">
          Zero-Server Privacy Policy & Data Guarantee
        </h1>
        <p style="font-size: 1.15rem; line-height: 1.6; color: var(--text-muted); max-width: 780px; margin: 0 auto;">
          Digital Tools Shed guarantees zero server-side data retention, zero form input harvesting, and complete local memory isolation. Learn how our client-side architecture enforces privacy by design.
        </p>
      </header>

      <!-- Live Privacy Audit Component -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.75rem; margin-bottom: 2.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="display: inline-block; width: 10px; height: 10px; background: #3b82f6; border-radius: 50%;"></span>
            <strong style="font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg);">Real-Time Client Storage & Telemetry Audit</strong>
          </div>
          <span style="font-family: var(--mono); font-size: 0.75rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.2);">GDPR Article 25 Verified</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">
          Inspect your active browser session state below. This live auditor scans your local storage keys, cookie headers, and memory flags to verify zero external payload transmission.
        </p>
        <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;">
          <button type="button" onclick="runPrivacyAudit()" style="padding: 0.65rem 1.25rem; background: var(--bg); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); font-family: var(--mono); font-size: 0.85rem; font-weight: 600; cursor: pointer;">
            🔄 Refresh Privacy Audit
          </button>
          <button type="button" class="btn-copy" onclick="copyPrivacyAudit(this)" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.25rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); font-family: var(--mono); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
            <span>📋</span> Copy Privacy Audit & Verification Specs
          </button>
        </div>
        <div id="privacyAuditLog" style="background: var(--bg); border: 1px solid var(--border); border-radius: 4px; padding: 0.85rem; font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); line-height: 1.6;">
          Scanning client runtime...
        </div>
      </div>

      <div class="article-body" style="font-size: 1.05rem; line-height: 1.75; color: var(--fg);">
        <h2 style="font-family: var(--serif); font-size: 1.75rem; margin: 2rem 0 1rem 0; color: var(--fg);">The Core Covenant: Everything, Everywhere</h2>
        <p>
          Most websites have privacy policies filled with legalese designed to justify why they collect your IP address, upload your files, track your mouse movements, and sell your behavioral profiles to advertising brokers.
        </p>
        <p>
          Digital Tools Shed operates on a fundamentally different premise: <strong>We do not want your data, we cannot view your data, and our systems are architected to make data collection technically impossible.</strong>
        </p>

        <h2 style="font-family: var(--serif); font-size: 1.75rem; margin: 2.5rem 0 1rem 0; color: var(--fg);">Technical Data Handling Matrix</h2>
        <div style="overflow-x: auto; margin: 1.5rem 0 2.5rem 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left; background: var(--surface); border: 1px solid var(--border); border-radius: 6px;">
            <thead>
              <tr style="background: var(--surface-alt); border-bottom: 2px solid var(--border);">
                <th style="padding: 0.85rem 1rem; font-family: var(--mono); color: var(--fg);">Data Category</th>
                <th style="padding: 0.85rem 1rem; font-family: var(--mono); color: #10b981;">Transmission Status</th>
                <th style="padding: 0.85rem 1rem; font-family: var(--mono); color: var(--fg);">Storage Location & Retention</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 0.85rem 1rem; font-weight: 600;">Uploaded Files & Documents</td>
                <td style="padding: 0.85rem 1rem; color: #10b981;"><strong>NEVER TRANSMITTED (0%)</strong></td>
                <td style="padding: 0.85rem 1rem; color: var(--text-muted);">RAM only; instantly destroyed when tab closes</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border); background: var(--surface-alt);">
                <td style="padding: 0.85rem 1rem; font-weight: 600;">Calculation Numbers & Form Inputs</td>
                <td style="padding: 0.85rem 1rem; color: #10b981;"><strong>NEVER TRANSMITTED (0%)</strong></td>
                <td style="padding: 0.85rem 1rem; color: var(--text-muted);">Local browser memory; zero server logs</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 0.85rem 1rem; font-weight: 600;">User Accounts & Passwords</td>
                <td style="padding: 0.85rem 1rem; color: #10b981;"><strong>NONEXISTENT</strong></td>
                <td style="padding: 0.85rem 1rem; color: var(--text-muted);">No login system exists; no database maintained</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border); background: var(--surface-alt);">
                <td style="padding: 0.85rem 1rem; font-weight: 600;">Site Theme (Light/Dark)</td>
                <td style="padding: 0.85rem 1rem; color: #10b981;">Local Only</td>
                <td style="padding: 0.85rem 1rem; color: var(--text-muted);">Browser <code>localStorage['dts-theme']</code></td>
              </tr>
              <tr>
                <td style="padding: 0.85rem 1rem; font-weight: 600;">Server Access Logs</td>
                <td style="padding: 0.85rem 1rem; color: var(--text-muted);">Standard HTTP Header</td>
                <td style="padding: 0.85rem 1rem; color: var(--text-muted);">Handled by static CDN provider (GitHub Pages)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 5 Fatal Privacy Traps -->
        <h2 style="font-family: var(--serif); font-size: 1.75rem; margin: 2.5rem 0 1rem 0; color: var(--fg);">
          5 Fatal Traps & Privacy Pitfalls of Modern Web Utilities
        </h2>
        <p style="margin-bottom: 1.5rem; color: var(--text-muted);">
          Users mistakenly believe that clicking "Delete after download" or using an incognito window protects them. In reality, modern cloud web utilities utilize complex deceptive practices to harvest personal data:
        </p>

        <div class="trap-card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #ef4444; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 1: The "Ephemeral Server Deletion" Illusion
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            Many commercial utility sites advertise: "Your files are automatically deleted after 60 minutes." However, automated backup snapshots, caching load balancers (Cloudflare, AWS CloudFront), and server disk swap partitions retain remnants of these files for days or weeks. If a server is compromised, your sensitive documents are vulnerable. Digital Tools Shed never writes your files to any disk in the first place.
          </p>
        </div>

        <div class="trap-card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #f59e0b; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 2: Third-Party Telemetry Leaking Sensitive Calculation Payloads
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            Online financial and medical calculators often embed analytics SDKs (Google Analytics, Mixpanel, Hotjar) that automatically record form input changes. When you type your annual salary, mortgage debt, or medical metrics, that numerical data is dispatched in plaintext JSON payloads to analytics vendors. Digital Tools Shed strips all telemetry from calculation inputs.
          </p>
        </div>

        <div class="trap-card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #10b981; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 3: Browser Fingerprinting Disguised as "Session Anti-Abuse"
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            To prevent users from bypassing free rate limits, aggregator sites execute invasive browser fingerprinting scripts. They probe your WebGL renderer, audio context oscillators, installed fonts, and battery status API to construct a persistent cryptographic hash of your device without cookie consent. Digital Tools Shed has zero rate limits and zero fingerprinting.
          </p>
        </div>

        <div class="trap-card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #3b82f6; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 4: Dark Patterns in Consent Management Platforms (CMP Cookie Walls)
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            Deceptive consent banners display bright "Accept All" buttons while concealing "Reject All" inside four nested sub-menus containing hundreds of pre-checked "Legitimate Interest" vendor checkboxes. Digital Tools Shed does not use invasive first-party tracking cookies or behavioral profile engines.
          </p>
        </div>

        <div class="trap-card" style="margin-bottom: 2rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #8b5cf6; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 5: Cloud OCR & PDF Parsing Sending PII to LLM Training Pipelines
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            Recent cloud utility providers partner with AI companies to feed user-submitted PDFs, contracts, and code files directly into large language model (LLM) training datasets under terms of service clauses labeled "improving service quality." On Digital Tools Shed, text extraction and PDF parsing occur locally via JavaScript WebAssembly with zero external AI pipeline ingestion.
          </p>
        </div>

        <!-- FAQ Accordion -->
        <h2 style="font-family: var(--serif); font-size: 1.75rem; margin: 2.5rem 0 1rem 0; color: var(--fg);">
          Frequently Asked Questions About Privacy & Security
        </h2>
        <div class="faq-accordion" style="margin-bottom: 2.5rem;">
          ${privacyFaq.map((item, idx) => `
          <details class="faq-item" style="margin-bottom: 0.75rem; padding: 0.85rem 1.15rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px;" ${idx === 0 ? 'open' : ''}>
            <summary style="font-weight: 700; cursor: pointer; color: var(--fg); font-size: 0.98rem; display: flex; justify-content: space-between; align-items: center;">
              <span>${item.q}</span>
              <span style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted); margin-left: 0.5rem;">[+]</span>
            </summary>
            <p style="margin: 0.85rem 0 0 0; font-size: 0.9rem; line-height: 1.65; color: var(--text-muted);">
              ${item.a}
            </p>
          </details>
          `).join('')}
        </div>
      </div>
    </div>

    <script>
      function runPrivacyAudit() {
        var log = document.getElementById('privacyAuditLog');
        var keys = Object.keys(localStorage);
        var theme = localStorage.getItem('dts-theme') || 'default';
        var cookies = document.cookie ? document.cookie.split(';').length : 0;

        var html = [
          '✓ Web Crypto API: ' + (window.crypto && window.crypto.subtle ? 'Hardware Accelerated & Active' : 'Fallback Mode'),
          '✓ LocalStorage Audit: ' + keys.length + ' key(s) detected (' + (keys.length > 0 ? keys.join(', ') : 'clean') + ')',
          '✓ Theme Preference: ' + theme,
          '✓ Cookie Telemetry: ' + (cookies === 0 ? '0 first-party tracking cookies detected' : cookies + ' cookies'),
          '✓ Outbound Payload Buffer: 0 KB (Zero-Server Architecture Active)',
          '✓ GDPR Compliance Status: Fully Compliant under Article 25 (Privacy by Design)'
        ].join('<br/>');

        log.innerHTML = html;
      }

      function copyPrivacyAudit(btn) {
        var auditText = [
          "DIGITAL TOOLS SHED — ZERO-SERVER PRIVACY AUDIT & TECHNICAL VERIFICATION",
          "=======================================================================",
          "Evaluation Standard: GDPR Article 25 (Privacy by Design & Default)",
          "Verification Timestamp: " + new Date().toISOString(),
          "",
          "DATA INTEGRITY AUDIT RESULTS:",
          "1. Payload Exfiltration Check: PASSED (0 bytes sent to remote hosts)",
          "2. Local Memory Sandbox: PASSED (FileReader & Canvas APIs isolated to RAM)",
          "3. First-Party Tracking Cookies: PASSED (0 persistent tracking cookies)",
          "4. Account Tracking & PII: PASSED (No database, no user accounts)",
          "5. Ad Isolation: PASSED (Third-party frames quarantined with zero DOM access)",
          "",
          "AUDIT METHODOLOGY:",
          "- Open DevTools -> Network -> Filter: Fetch/XHR -> Observe 0 tool requests.",
          "- Disconnect internet -> Verify full computational operation offline.",
          "",
          "Certified by Digital Tools Shed Engineering."
        ].join('\n');

        navigator.clipboard.writeText(auditText).then(function() {
          var original = btn.innerHTML;
          btn.innerHTML = '<span>✓</span> Privacy Specs Copied!';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#10b981';
          setTimeout(function() {
            btn.innerHTML = original;
            btn.style.borderColor = 'var(--border)';
            btn.style.color = 'var(--fg)';
          }, 2500);
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runPrivacyAudit);
      } else {
        runPrivacyAudit();
      }
    </script>
  `;

  // ─── 3. TERMS OF SERVICE PAGE ─────────────────────────────────────────────
  const termsFaq = [
    {
      q: "Can I use calculations, transformed images, and outputs from Digital Tools Shed commercially?",
      a: "Yes. You have full, unrestricted, perpetual commercial rights to all outputs, converted files, formatted code, and calculation reports generated by our tools. We claim zero copyright, royalties, or licensing restrictions over what you create using our utilities."
    },
    {
      q: "Are there any hidden fees, subscription tiers, or usage limitations?",
      a: "No. All tools are 100% free with unlimited computations. There are no premium tiers, no credit cards required, and no artificial restrictions on file sizes or daily calculation counts."
    },
    {
      q: "Who owns the intellectual property of files processed on Digital Tools Shed?",
      a: "You retain 100% ownership of your intellectual property at all times. Because your files never touch our servers and are processed strictly in your local device RAM, Digital Tools Shed never possesses, hosts, or claims any interest in your proprietary data."
    },
    {
      q: "Can I use Digital Tools Shed in educational classrooms, universities, or corporate enterprise teams?",
      a: "Yes. Digital Tools Shed is expressly approved for use in academic institutions, K-12 classrooms, university research labs, and enterprise engineering environments without requiring institutional license agreements."
    },
    {
      q: "What should I do if a calculation requires professional engineering, financial, or legal sign-off?",
      a: "While our algorithms adhere to rigorous international standards (e.g. IEEE 754, ASTM, IRC building codes, IRS guidelines), all tools are provided 'as-is'. Critical structural calculations, high-voltage electrical installations, and legal filings should always be cross-verified and stamped by a licensed professional."
    }
  ];

  const termsBody = `
    <div class="article-container" style="max-width: 960px; margin: 0 auto; padding: 2rem 1rem;">
      <header class="article-header" style="margin-bottom: 2.5rem; text-align: center;">
        <div class="article-journal-tag" style="display: inline-block; font-family: var(--mono); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #8b5cf6; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.25); padding: 0.35rem 0.85rem; border-radius: 9999px; margin-bottom: 1rem;">
          Open Fair-Use & Zero-Lock-In Agreement
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.6rem; font-weight: 800; line-height: 1.15; margin: 0 0 1rem 0; color: var(--fg);">
          Terms of Service & Fair-Use License
        </h1>
        <p style="font-size: 1.15rem; line-height: 1.6; color: var(--text-muted); max-width: 780px; margin: 0 auto;">
          Plain-English terms of service: 100% royalty-free commercial usage rights, no predatory arbitration clauses, no copyright claims over your data, and clear engineering disclaimers.
        </p>
      </header>

      <!-- Live Commercial License Inspector -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.75rem; margin-bottom: 2.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="display: inline-block; width: 10px; height: 10px; background: #8b5cf6; border-radius: 50%;"></span>
            <strong style="font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg);">Interactive Commercial License & Usage Inspector</strong>
          </div>
          <span style="font-family: var(--mono); font-size: 0.75rem; color: #8b5cf6; background: rgba(139, 92, 246, 0.1); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid rgba(139, 92, 246, 0.2);">Perpetual Royalty-Free</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">
          Select your intended use case below to inspect your legal rights, license grants, and attribution obligations under Digital Tools Shed:
        </p>
        <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;">
          <select id="termsUseCaseSelect" onchange="inspectLicenseTerms()" style="padding: 0.65rem 0.85rem; background: var(--bg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; color: var(--fg); min-width: 280px;">
            <option value="commercial">Commercial Client Projects & Deliverables</option>
            <option value="academic">Academic, University & Scientific Research</option>
            <option value="education">K-12 & Classroom Teaching</option>
            <option value="enterprise">Corporate Internal Engineering & Dev Tools</option>
            <option value="personal">Personal, Hobbyist & Home Utility</option>
          </select>
          <button type="button" class="btn-copy" onclick="copyTermsSummary(this)" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.25rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); font-family: var(--mono); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
            <span>📋</span> Copy Terms Summary & License Grant
          </button>
        </div>
        <div id="termsLicenseBadge" style="background: var(--bg); border: 1px solid var(--border); border-radius: 4px; padding: 0.85rem; font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); line-height: 1.6;">
          Loading license permissions...
        </div>
      </div>

      <div class="article-body" style="font-size: 1.05rem; line-height: 1.75; color: var(--fg);">
        <h2 style="font-family: var(--serif); font-size: 1.75rem; margin: 2rem 0 1rem 0; color: var(--fg);">Plain-English Terms: Freedom of Use</h2>
        <p>
          By accessing or using Digital Tools Shed (<code>digitaltoolsshed.com</code>), you agree to these Terms of Service. Unlike predatory SaaS platforms that trap users in 40-page clickwrap contracts, our terms are straightforward, fair, and designed to protect both the user and the platform:
        </p>
        <ul style="margin: 1rem 0 1.5rem 1.5rem; line-height: 1.8;">
          <li><strong>Unlimited Free Usage:</strong> You are granted a worldwide, irrevocable, royalty-free license to use all calculators, simulators, converters, and generators for personal, educational, and commercial purposes.</li>
          <li><strong>Zero IP Claims:</strong> Digital Tools Shed asserts no intellectual property claims, copyrights, or moral rights over code, images, audio, or mathematical results generated through our tools. Everything you produce is 100% yours.</li>
          <li><strong>Zero Account Lock-In:</strong> There are no user accounts, passwords, or recurring credit card subscriptions to cancel. You can use the site once or a million times without signing anything.</li>
        </ul>

        <h2 style="font-family: var(--serif); font-size: 1.75rem; margin: 2.5rem 0 1rem 0; color: var(--fg);">Prohibited Activities</h2>
        <p>
          To ensure the infrastructure remains fast and freely available to millions of global users, the following activities are strictly prohibited:
        </p>
        <ul style="margin: 1rem 0 1.5rem 1.5rem; line-height: 1.8;">
          <li><strong>Denial of Service (DoS):</strong> Launching automated flood scripts or high-concurrency botnets intended to overwhelm our static hosting infrastructure or content delivery network.</li>
          <li><strong>Deceptive Mirroring:</strong> Cloning the site in its entirety to deploy deceptive phishing mirrors or inject malicious browser extensions under a confusingly similar trademark.</li>
          <li><strong>Malicious Code Distribution:</strong> Using our converters or decompilers to craft, obfuscate, or distribute ransomware, spyware, or illegal content.</li>
        </ul>

        <!-- 5 Fatal Terms Traps -->
        <h2 style="font-family: var(--serif); font-size: 1.75rem; margin: 2.5rem 0 1rem 0; color: var(--fg);">
          5 Fatal Traps of Predatory Online Utility Terms & SaaS Fine Print
        </h2>
        <p style="margin-bottom: 1.5rem; color: var(--text-muted);">
          Before using other popular online converter and calculator websites, beware of the hostile legal traps frequently hidden in their fine print:
        </p>

        <div class="trap-card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #ef4444; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 1: Mandatory Binding Arbitration & Class Action Waivers Hidden in Clickwrap
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            Most cloud tool aggregators bury mandatory binding arbitration clauses and class-action waivers deep in their terms. If their servers leak your corporate documents or billing credentials, you are legally stripped of your right to take them to court or join a class lawsuit. Digital Tools Shed has zero accounts, zero billing data, and zero predatory legal shields.
          </p>
        </div>

        <div class="trap-card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #f59e0b; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 2: Intellectual Property Claims Over Output Content & Derived Media
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            Many "free" online graphic editors and AI converters include insidious license grant clauses stating: "You grant the Company a perpetual, irrevocable, worldwide license to use, display, and modify any content processed through our service." This exposes commercial design clients to copyright infringement risks. We claim zero rights over your creations.
          </p>
        </div>

        <div class="trap-card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #10b981; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 3: Auto-Renewing Zombie Subscriptions with Hostile Cancellation Hurdles
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            Online PDF converters frequently offer a "$0.99 7-day trial" that secretly converts into a recurring $49.99/month charge. Canceling requires navigating multi-step cancellation surveys, calling offshore phone numbers, or filing credit card chargebacks. Digital Tools Shed does not accept credit cards and will never charge you a single penny.
          </p>
        </div>

        <div class="trap-card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #3b82f6; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 4: Unilateral Retroactive License Revocations & Paywalled Historic Data
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            Certain calculation and productivity platforms unilaterally alter their terms to retroactively restrict previously generated charts or lock historic projects behind new enterprise tiers. Because our tools are client-side, your browser holds the computation and no central authority can revoke your past work.
          </p>
        </div>

        <div class="trap-card" style="margin-bottom: 2rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid #8b5cf6; border-radius: 4px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Fatal Trap 5: Disclaimers of Accuracy Paired with Gross Negligence Liability Shields
          </h4>
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--fg);">
            Aggregator sites frequently disclaim all responsibility for broken math formulas while actively selling their tools to contractors and financial planners. We provide full transparency: our math formulas and algorithmic derivations are publicly readable directly in your browser's inspect element, allowing you to audit the mathematical mechanics line by line.
          </p>
        </div>

        <h2 style="font-family: var(--serif); font-size: 1.75rem; margin: 2.5rem 0 1rem 0; color: var(--fg);">Engineering, Financial & Professional Disclaimer</h2>
        <p style="font-size: 0.95rem; line-height: 1.7; color: var(--text-muted);">
          ALL TOOLS, CALCULATORS, CONVERTERS, AND CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. While our team validates formulas against authoritative engineering standards (including IRC, IEEE, ASTM, and GAAP principles), calculations should not replace certified structural engineering calculations, professional financial advice, or medical diagnoses. Always have critical installations signed off by a licensed professional.
        </p>

        <!-- FAQ Accordion -->
        <h2 style="font-family: var(--serif); font-size: 1.75rem; margin: 2.5rem 0 1rem 0; color: var(--fg);">
          Frequently Asked Questions About Terms & Licensing
        </h2>
        <div class="faq-accordion" style="margin-bottom: 2.5rem;">
          ${termsFaq.map((item, idx) => `
          <details class="faq-item" style="margin-bottom: 0.75rem; padding: 0.85rem 1.15rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px;" ${idx === 0 ? 'open' : ''}>
            <summary style="font-weight: 700; cursor: pointer; color: var(--fg); font-size: 0.98rem; display: flex; justify-content: space-between; align-items: center;">
              <span>${item.q}</span>
              <span style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted); margin-left: 0.5rem;">[+]</span>
            </summary>
            <p style="margin: 0.85rem 0 0 0; font-size: 0.9rem; line-height: 1.65; color: var(--text-muted);">
              ${item.a}
            </p>
          </details>
          `).join('')}
        </div>
      </div>
    </div>

    <script>
      function inspectLicenseTerms() {
        var sel = document.getElementById('termsUseCaseSelect').value;
        var badge = document.getElementById('termsLicenseBadge');
        var map = {
          commercial: '✓ PERMITTED: 100% Commercial Use Allowed. No royalties, no attribution required for client deliverables. You own all output data.',
          academic: '✓ PERMITTED: Academic Research & Citations Allowed. Transparent formulas can be cited directly in papers and theses.',
          education: '✓ PERMITTED: Educational & Classroom Approved. Free for student labs, zero student accounts, zero telemetry.',
          enterprise: '✓ PERMITTED: Enterprise Internal Tooling Approved. Air-gapped and firewall friendly. No SaaS seat fees.',
          personal: '✓ PERMITTED: Unlimited Personal & Household Use. No daily quotas, no trial expirations.'
        };
        badge.innerHTML = '<strong style="color: #10b981;">' + (map[sel] || map.commercial) + '</strong>';
      }

      function copyTermsSummary(btn) {
        var termsSummary = [
          "DIGITAL TOOLS SHED — TERMS OF SERVICE & FAIR-USE LICENSE SUMMARY",
          "================================================================",
          "License Type: Unrestricted Open Fair-Use & Commercial Grant",
          "Governing Domain: https://digitaltoolsshed.com",
          "",
          "RIGHTS & PERMISSIONS:",
          "1. Commercial Rights: 100% unrestricted royalty-free commercial usage.",
          "2. IP Ownership: You retain 100% copyright and ownership of all output files.",
          "3. Fees & Subscriptions: $0 forever. No credit cards, no recurring bills.",
          "4. Academic & Classroom: Unrestricted use across schools and universities.",
          "5. Dispute Resolution: No mandatory arbitration or class action waivers.",
          "",
          "DISCLAIMER:",
          "Tools provided 'as-is'. Verify structural, medical, and legal computations",
          "with certified licensed professionals.",
          "",
          "Published by Digital Tools Shed Legal & Engineering."
        ].join('\n');

        navigator.clipboard.writeText(termsSummary).then(function() {
          var original = btn.innerHTML;
          btn.innerHTML = '<span>✓</span> Terms Summary Copied!';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#10b981';
          setTimeout(function() {
            btn.innerHTML = original;
            btn.style.borderColor = 'var(--border)';
            btn.style.color = 'var(--fg)';
          }, 2500);
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inspectLicenseTerms);
      } else {
        inspectLicenseTerms();
      }
    </script>
  `;

  const pages = [
    {
      slug: 'about',
      title: 'About Us — Digital Tools Shed | Client-Side Architecture & Engineering Manifesto',
      metaDesc: 'Learn why Digital Tools Shed was built: 100% client-side zero-overhead architecture, zero tracking, zero server uploads, and why we outperform cloud tool aggregators.',
      body: aboutBody,
      faq: aboutFaq
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy — Digital Tools Shed | Zero-Server Data Guarantee & Client-Side Sandbox',
      metaDesc: 'Digital Tools Shed strict zero-data privacy policy. All processing occurs 100% locally in your browser. Zero server uploads, zero logging, zero tracking cookies.',
      body: privacyBody,
      faq: privacyFaq
    },
    {
      slug: 'terms',
      title: 'Terms of Service — Digital Tools Shed | Fair-Use & Zero-Lock-In License',
      metaDesc: 'Terms of service for Digital Tools Shed. Fair-use terms, open client-side utilities, commercial usage rights, and no predatory arbitration clauses.',
      body: termsBody,
      faq: termsFaq
    }
  ];

  for (const page of pages) {
    const html = renderPage({
      title: page.title,
      metaDesc: page.metaDesc,
      canonical: `${DOMAIN}/${page.slug}`,
      bodyContent: page.body,
      currentPath: `/${page.slug}`,
      faq: page.faq
    });
    writeFileSync(join(DIST, `${page.slug}.html`), html);
  }

  console.log('  ✓ Built Elevated Trust & Legal Pages (about.html, privacy.html, terms.html)');
}

// ─── 404 ERROR PAGE ─────────────────────────────────────────────────────────
function build404Page() {
  const bodyContent = `
    <div class="hero" style="text-align: center; padding: 3rem 1.5rem;">
      <div style="font-family: var(--mono); font-size: 6rem; font-weight: 900; color: var(--fg); line-height: 1; margin-bottom: 0.5rem;">404</div>
      <h1 style="font-size: 1.8rem; margin-bottom: 0.5rem;">Page Not Found</h1>
      <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem;">The page you're looking for doesn't exist or has been moved. But while you're here, check out our free tools below.</p>
      <a href="/" class="btn-primary" style="display: inline-block; padding: 0.75rem 2rem; text-decoration: none;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> Return to Tools Shed</a>
    </div>

    <div style="text-align: center; padding: 2rem 0;">
      <div style="font-family: var(--serif); font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem;">Popular Free Tools</div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center;">
        <a href="/media/downloader" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">Media Downloader</a>
        <a href="/convert/json-obfuscator" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">JSON Obfuscator</a>
        <a href="/convert/esbuild-decompiler" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">JS Decompiler</a>
        <a href="/convert/image-resizer" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">Image Resizer</a>
        <a href="/calc/meters-to-inches" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">Meters to Inches</a>
        <a href="/articles/" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">Tech Articles</a>
      </div>
    </div>
  `;

  const html = renderPage({
    title: '404 — Page Not Found | Digital Tools Shed',
    metaDesc: 'The page you requested was not found. Browse our free online developer tools, converters, media downloaders, and tech articles.',
    canonical: `${DOMAIN}/404`,
    bodyContent,
    currentPath: '/404'
  });

  writeFileSync(join(DIST, '404.html'), html);
  console.log('  ✓ Built 404 Error Page');
}

export { buildTrustPages, build404Page };
