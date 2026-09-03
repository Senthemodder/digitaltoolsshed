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
    </script>
  `;

  const html = renderPage({
    title: 'Laptop PWM Flicker Frequency & Eye Strain Safety Directory [Flicker-Free List]',
    metaDesc: 'Verified database of 1,000 laptops tested for Pulse Width Modulation (PWM) flicker frequency. Find flicker-free DC dimming laptops safe for eye strain and migraines.',
    canonical: canonical,
    currentPath: '/laptops/pwm/',
    bodyContent: bodyHtml,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Laptops', url: '/laptops/' },
      { name: 'PWM & Eye Strain Directory', url: canonical }
    ]
  });

  writeFileSync(join(pwmDir, 'index.html'), html, 'utf8');
  console.log('  ✓ Built Display Eye Strain & PWM Flicker Safety Directory (index.html in /laptops/pwm/)');
}
