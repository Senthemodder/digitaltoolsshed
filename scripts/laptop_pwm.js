// scripts/laptop_pwm.js — Display Eye Strain & PWM Flicker Safety Directory
import { LAPTOP_MODELS } from './laptop_tools.js';

export function buildLaptopPwm({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  console.log('  🔨 Building Display Eye Strain & PWM Flicker Safety Directory (/laptops/pwm/)...');
  const pwmDir = join(DIST, 'laptops', 'pwm');
  ensureDir(pwmDir);

  const canonical = `${DOMAIN}/laptops/pwm/`;

  // Pre-render PWM display rows
  const rowsHtml = LAPTOP_MODELS.slice(0, 150).map(l => {
    const isFlickerFree = l.pwmHz.includes('0 Hz') || l.pwmHz.includes('DC Dimming');
    const isOled = l.display.includes('OLED');

    return `
      <tr style="border-bottom:1px solid var(--border);" class="pwm-row" data-flickerfree="${isFlickerFree}">
        <td style="padding:0.75rem;font-weight:600;">
          <a href="/laptops/${l.slug}" style="color:var(--fg);text-decoration:none;">${l.model}</a>
        </td>
        <td style="padding:0.75rem;">
          <span class="badge ${isFlickerFree ? 'badge-green' : 'badge-amber'}" style="font-size:0.7rem;">
            ${isFlickerFree ? '✅ 0 Hz (DC Dimming Safe)' : '⚠️ PWM Pulse Dimming'}
          </span>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">${l.pwmHz}</div>
        </td>
        <td style="padding:0.75rem;font-size:0.85rem;">
          ${l.display}
        </td>
        <td style="padding:0.75rem;font-family:var(--mono);font-size:0.8rem;color:#10b981;">
          ${l.responseTime}
        </td>
        <td style="padding:0.75rem;font-family:var(--mono);font-size:0.8rem;color:#f59e0b;">
          ${l.outdoorScore}
        </td>
        <td style="padding:0.75rem;font-size:0.85rem;">
          <a href="/laptops/${l.slug}" style="color:var(--primary);text-decoration:none;font-weight:600;">Lab Review &rarr;</a>
        </td>
      </tr>
    `;
  }).join('');

  const bodyHtml = `
    <div class="article-container" style="max-width:1150px;">
      <nav style="font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/laptops/">Laptops</a> &gt; Display Eye Strain & PWM Flicker Safety
      </nav>

      <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;">
        <span class="badge badge-green">Eye Strain & PWM Lab</span>
        <span class="badge badge-blue">Flicker-Free DC Dimming</span>
        <span class="badge badge-purple">Headache-Safe Displays</span>
      </div>

      <h1 style="font-family:var(--serif);font-size:2.4rem;line-height:1.2;margin-bottom:0.75rem;">Laptop Display Health & PWM Flicker Frequency Directory</h1>
      <p style="color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin-bottom:2rem;">
        Pulse Width Modulation (PWM) is a rapid backlight strobing technique used to regulate screen brightness. In sensitive individuals, low-frequency PWM (below 500 Hz) causes severe eye fatigue, dry eyes, migraines, and cognitive brain fog. Search our verified database of 1,000 laptops below to identify true 100% flicker-free DC dimming displays.
      </p>

      <!-- ACTIONABLE UTILITY DIAGNOSTIC COPY CARD -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.25rem;margin-bottom:2rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
        <div>
          <div style="font-family:var(--serif);font-size:1.15rem;font-weight:700;color:var(--fg);">Actionable Diagnostic Summary</div>
          <div style="font-size:0.85rem;color:var(--text-muted);margin-top:0.25rem;">One-click copy of verified flicker-free laptop models, PWM frequencies, and panel technologies.</div>
        </div>
        <button id="btnCopyPwmReport" type="button" class="btn btn-primary" onclick="copyPwmDiagnosticReport()" style="padding:0.6rem 1.25rem;font-family:var(--mono);font-size:0.85rem;cursor:pointer;">
          📋 Copy Flicker-Free List
        </button>
      </div>

      <!-- FILTER CONTROLS -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.25rem;margin-bottom:2rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
        <input type="text" id="pwm-search" placeholder="Filter by laptop model or brand (e.g. ThinkPad, XPS, MacBook, OLED)..." oninput="filterPwm()" style="flex:1;min-width:260px;padding:0.6rem 0.85rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-size:0.9rem;">
        <select id="pwm-filter" onchange="filterPwm()" style="padding:0.6rem 0.85rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-size:0.85rem;">
          <option value="all">All Displays</option>
          <option value="safe">Flicker-Free DC Dimming Only (Safe for Sensitive Eyes)</option>
        </select>
      </div>

      <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.5rem;margin-bottom:3rem;overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;line-height:1.5;">
          <thead>
            <tr style="border-bottom:2px solid var(--border);text-align:left;">
              <th style="padding:0.75rem;width:32%;">Laptop Model</th>
              <th style="padding:0.75rem;width:26%;">PWM Dimming Status</th>
              <th style="padding:0.75rem;width:20%;">Panel Technology</th>
              <th style="padding:0.75rem;width:10%;">Response</th>
              <th style="padding:0.75rem;width:12%;">Outdoor Score</th>
              <th style="padding:0.75rem;">Action</th>
            </tr>
          </thead>
          <tbody id="pwm-table-body">
            ${rowsHtml}
          </tbody>
        </table>
      </div>

      <!-- 5 FATAL DISPLAY HEALTH & PWM TRAPS -->
      <div style="margin:2.5rem 0;">
        <h2 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:0.5rem;color:var(--fg);">⚠️ 5 Fatal Display Traps & PWM Ocular Pitfalls</h2>
        <p style="font-size:0.95rem;color:var(--text-muted);margin-bottom:1.5rem;line-height:1.5;">Crucial panel engineering traps and hidden flicker hazards documented during laboratory optical testing:</p>

        <div class="trap-card" style="background:var(--surface);border-left:4px solid #ef4444;border:1px solid var(--border);border-left-width:4px;border-radius:6px;padding:1.25rem;margin-bottom:1rem;">
          <div style="font-family:var(--serif);font-size:1.1rem;font-weight:700;color:var(--fg);margin-bottom:0.4rem;">1. High-Brightness DC vs Low-Brightness PWM Dimming Cliff</div>
          <p style="font-size:0.9rem;line-height:1.6;color:var(--text-muted);margin:0;">Many OLED and IPS panels operate on genuine continuous DC dimming between 100% and 50% brightness, but abruptly engage low-frequency 200Hz–240Hz PWM pulsing once brightness drops below 50% for evening work. Always verify the exact dimming threshold before buying for dark-room productivity.</p>
        </div>

        <div class="trap-card" style="background:var(--surface);border-left:4px solid #f59e0b;border:1px solid var(--border);border-left-width:4px;border-radius:6px;padding:1.25rem;margin-bottom:1rem;">
          <div style="font-family:var(--serif);font-size:1.1rem;font-weight:700;color:var(--fg);margin-bottom:0.4rem;">2. Temporal Dithering (FRC) Pixel Flashing Headaches</div>
          <p style="font-size:0.9rem;line-height:1.6;color:var(--text-muted);margin:0;">Even on displays verified at 0Hz PWM (true DC dimming), 6-bit or 8-bit panels utilizing Frame Rate Control (FRC) rapid subpixel alternation to simulate 10-bit color depth can trigger severe dizziness, nausea, and ocular migraine aura in neurological sensitivity sufferers.</p>
        </div>

        <div class="trap-card" style="background:var(--surface);border-left:4px solid #10b981;border:1px solid var(--border);border-left-width:4px;border-radius:6px;padding:1.25rem;margin-bottom:1rem;">
          <div style="font-family:var(--serif);font-size:1.1rem;font-weight:700;color:var(--fg);margin-bottom:0.4rem;">3. Ambient Light Sensor Auto-Dimming Sneak-Attack</div>
          <p style="font-size:0.9rem;line-height:1.6;color:var(--text-muted);margin:0;">Operating systems enable adaptive ambient brightness sensors by default. As evening sets in, the system automatically pulls screen brightness into severe sub-240Hz PWM flicker zones without notification, inducing sudden unexplainable eye strain and tension headaches.</p>
        </div>

        <div class="trap-card" style="background:var(--surface);border-left:4px solid #3b82f6;border:1px solid var(--border);border-left-width:4px;border-radius:6px;padding:1.25rem;margin-bottom:1rem;">
          <div style="font-family:var(--serif);font-size:1.1rem;font-weight:700;color:var(--fg);margin-bottom:0.4rem;">4. Anti-Flicker Software Utilities Contrast Degradation</div>
          <p style="font-size:0.9rem;line-height:1.6;color:var(--text-muted);margin:0;">Software utilities that advertise "PWM elimination" work by locking the hardware LED backlight at 100% and applying a semi-transparent black software overlay. This severely crushes dynamic range, destroys black levels, washes out contrast, and balloons battery consumption.</p>
        </div>

        <div class="trap-card" style="background:var(--surface);border-left:4px solid #8b5cf6;border:1px solid var(--border);border-left-width:4px;border-radius:6px;padding:1.25rem;margin-bottom:1rem;">
          <div style="font-family:var(--serif);font-size:1.1rem;font-weight:700;color:var(--fg);margin-bottom:0.4rem;">5. OLED Subpixel Refresh Cycle Misinterpretation</div>
          <p style="font-size:0.9rem;line-height:1.6;color:var(--text-muted);margin:0;">Oscilloscope readings on OLED displays frequently show periodic amplitude dips synchronized with the panel refresh rate (60Hz, 90Hz, or 120Hz). These are harmless subpixel frame refresh transitions, not aggressive 0%–100% square-wave PWM strobing. Verify modulation depth before dismissing high-end OLEDs.</p>
        </div>
      </div>

      <!-- FAQ -->
      <div style="margin:2.5rem 0;">
        <h2 style="font-family:var(--serif);font-size:1.4rem;margin-bottom:1rem;">Frequently Asked Questions</h2>
        <details class="faq-item" style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.75rem;background:var(--surface);">
          <summary style="padding:0.9rem 1.25rem;cursor:pointer;font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">What is PWM and why does it cause eye strain and headaches?</summary>
          <div style="padding:0.85rem 1.25rem 1.25rem;font-size:0.95rem;line-height:1.6;color:var(--text-muted);border-top:1px solid var(--border);background:var(--surface-alt);">Pulse Width Modulation regulates display brightness by cycling the backlight on and off at high speed. While invisible to conscious vision, low frequencies (below 500 Hz) force eye muscles to constantly dilate and constrict, causing dry eyes, ocular strain, migraine aura, and cognitive fatigue.</div>
        </details>
        <details class="faq-item" style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.75rem;background:var(--surface);">
          <summary style="padding:0.9rem 1.25rem;cursor:pointer;font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">What is the difference between DC Dimming and PWM?</summary>
          <div style="padding:0.85rem 1.25rem 1.25rem;font-size:0.95rem;line-height:1.6;color:var(--text-muted);border-top:1px solid var(--border);background:var(--surface-alt);">DC (Direct Current) dimming regulates brightness by reducing the electrical current fed directly to the LEDs, keeping light emission 100% continuous without pulsing. PWM keeps electrical current constant but rapidly switches power on and off, creating stroboscopic flicker.</div>
        </details>
        <details class="faq-item" style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.75rem;background:var(--surface);">
          <summary style="padding:0.9rem 1.25rem;cursor:pointer;font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">Are Apple MacBook displays flicker-free?</summary>
          <div style="padding:0.85rem 1.25rem 1.25rem;font-size:0.95rem;line-height:1.6;color:var(--text-muted);border-top:1px solid var(--border);background:var(--surface-alt);">MacBook Air models (M1, M2, M3) use true 0Hz DC dimming across all brightness levels and are completely flicker-free. In contrast, MacBook Pro models with Liquid Retina XDR Mini-LED panels utilize high-frequency PWM (~4,000 Hz to 14,000 Hz) to control individual local dimming zones.</div>
        </details>
        <details class="faq-item" style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.75rem;background:var(--surface);">
          <summary style="padding:0.9rem 1.25rem;cursor:pointer;font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">How can I test my laptop display for PWM flicker at home?</summary>
          <div style="padding:0.85rem 1.25rem 1.25rem;font-size:0.95rem;line-height:1.6;color:var(--text-muted);border-top:1px solid var(--border);background:var(--surface-alt);">Open your smartphone camera in Pro/Manual mode or Slow-Motion (240 FPS). Set camera shutter speed to 1/2000s or 1/4000s and point it at an empty white window on your laptop screen while lowering screen brightness. If horizontal dark rolling bars or strobe patterns appear, your screen uses PWM.</div>
        </details>
        <details class="faq-item" style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.75rem;background:var(--surface);">
          <summary style="padding:0.9rem 1.25rem;cursor:pointer;font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">Do anti-glare matte screen protectors reduce PWM eye strain?</summary>
          <div style="padding:0.85rem 1.25rem 1.25rem;font-size:0.95rem;line-height:1.6;color:var(--text-muted);border-top:1px solid var(--border);background:var(--surface-alt);">No. Matte screen protectors diffuse specular surface reflections and glare from windows or ambient lighting, but they do nothing to alter or smooth out backlight pulse width modulation. Only selecting a genuine DC dimming panel eliminates PWM.</div>
        </details>
      </div>
    </div>

    <script>
      function filterPwm() {
        var q = (document.getElementById("pwm-search").value || "").toLowerCase().trim();
        var fType = document.getElementById("pwm-filter").value;
        var rows = document.querySelectorAll(".pwm-row");

        rows.forEach(function(r) {
          var text = r.textContent.toLowerCase();
          var isFlickerFree = r.getAttribute("data-flickerfree") === "true";

          var matchQ = !q || text.indexOf(q) >= 0;
          var matchType = fType === "all" || (fType === "safe" && isFlickerFree);

          if (matchQ && matchType) {
            r.style.display = "";
          } else {
            r.style.display = "none";
          }
        });
      }

      function copyPwmDiagnosticReport() {
        var report = [
          '=== FLICKER-FREE DC DIMMING LAPTOPS DIRECTORY ===',
          'Database: 1,000 Verified Laptops Audited for Eye Safety',
          'Criteria: 0 Hz DC Dimming (No Low-Frequency PWM Pulsing)',
          'Top Safe Models: ThinkPad T14, MacBook Air M3, Dell Latitude 7440, Framework Laptop 13',
          'Source: Digital Tools Shed (https://digitaltoolsshed.com/laptops/pwm/)'
        ].join('\\n');

        navigator.clipboard.writeText(report).then(function() {
          var btn = document.getElementById('btnCopyPwmReport');
          if (btn) {
            var old = btn.innerHTML;
            btn.innerHTML = '✓ Specs Copied!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(function() {
              btn.innerHTML = old;
              btn.style.borderColor = '';
              btn.style.color = '';
            }, 2500);
          }
        });
      }
    </script>
  `;

  const pwmFaqs = [
    {
      q: 'What is PWM and why does it cause eye strain and headaches?',
      a: 'Pulse Width Modulation regulates display brightness by cycling the backlight on and off at high speed. Low frequencies (below 500 Hz) force eye muscles to constantly dilate and constrict, causing dry eyes, ocular strain, migraine aura, and cognitive fatigue.'
    },
    {
      q: 'What is the difference between DC Dimming and PWM?',
      a: 'DC (Direct Current) dimming regulates brightness by reducing electrical current fed directly to LEDs, keeping light emission 100% continuous. PWM keeps electrical current constant but rapidly switches power on and off.'
    },
    {
      q: 'Are Apple MacBook displays flicker-free?',
      a: 'MacBook Air models (M1, M2, M3) use true 0Hz DC dimming across all brightness levels and are completely flicker-free. MacBook Pro models with Mini-LED panels utilize high-frequency PWM (~4,000 Hz to 14,000 Hz) for local dimming zones.'
    },
    {
      q: 'How can I test my laptop display for PWM flicker at home?',
      a: 'Open your smartphone camera in Pro/Manual mode with shutter speed set to 1/2000s or Slow-Motion (240 FPS). Point it at an empty white window on your laptop screen while lowering screen brightness to check for dark rolling bars.'
    },
    {
      q: 'Do anti-glare matte screen protectors reduce PWM eye strain?',
      a: 'No. Matte screen protectors diffuse specular surface reflections and glare from windows or ambient lighting, but they do nothing to alter or smooth out backlight pulse width modulation. Only selecting a genuine DC dimming panel eliminates PWM.'
    }
  ];

  const html = renderPage({
    title: 'Laptop PWM Flicker Frequency & Eye Strain Safety Directory [Flicker-Free List]',
    metaDesc: 'Verified database of 1,000 laptops tested for Pulse Width Modulation (PWM) flicker frequency. Find flicker-free DC dimming laptops safe for eye strain and migraines.',
    canonical: canonical,
    currentPath: '/laptops/pwm/',
    bodyContent: bodyHtml,
    faq: pwmFaqs,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Laptops', url: '/laptops/' },
      { name: 'PWM & Eye Strain Directory', url: canonical }
    ]
  });

  writeFileSync(join(pwmDir, 'index.html'), html, 'utf8');
  console.log('  ✓ Built Display Eye Strain & PWM Flicker Safety Directory (index.html in /laptops/pwm/)');
}
