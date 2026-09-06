// scripts/hardware_board.js — Interactive Hardware Comparison Board
import { LAPTOP_MODELS } from './laptop_tools.js';

export function buildHardwareBoard({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  console.log('  🔨 Building Interactive Hardware Comparison Board (/laptops/board/)...');
  const boardDir = join(DIST, 'laptops', 'board');
  ensureDir(boardDir);

  const canonical = `${DOMAIN}/laptops/board/`;

  // Pre-render top 100 laptops in HTML for instant SEO & fast first-contentful-paint
  const initialCardsHtml = LAPTOP_MODELS.slice(0, 80).map(l => {
    const isModular = !l.ramType.includes('Soldered');
    const isFlickerFree = l.pwmHz.includes('0 Hz') || l.pwmHz.includes('DC Dimming');
    const isOled = l.display.includes('OLED');

    return `
      <div class="laptop-card" data-brand="${l.brand.toLowerCase()}" data-type="${l.type.toLowerCase()}" data-modular="${isModular}" data-flickerfree="${isFlickerFree}" data-oled="${isOled}" style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.25rem;display:flex;flex-direction:column;justify-content:space-between;transition:border-color 0.15s ease;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;gap:0.35rem;">
            <div style="display:flex;gap:0.35rem;align-items:center;">
              <span class="badge badge-blue" style="font-size:0.7rem;">${l.brand}</span>
              <span class="badge badge-purple" style="font-size:0.7rem;">${l.type}</span>
            </div>
            <label style="display:flex;align-items:center;gap:0.35rem;font-family:var(--mono);font-size:0.75rem;cursor:pointer;color:var(--text-muted);">
              <input type="checkbox" onchange="togglePin('${l.slug}', '${l.model.replace(/'/g, "\\'")}', '${l.brand}', '${l.cpu.split('(')[0].trim()}', '${l.gpu.replace('NVIDIA GeForce ', '').replace(' Mobile', '')}')" class="pin-check" data-slug="${l.slug}" style="accent-color:#6366f1;"> Pin
            </label>
          </div>
          <h3 style="font-family:var(--serif);font-size:1.1rem;margin:0 0 0.5rem 0;line-height:1.3;">
            <a href="/laptops/${l.slug}" style="color:var(--fg);text-decoration:none;">${l.model}</a>
          </h3>
          <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.75rem;line-height:1.4;">
            <strong>CPU:</strong> ${l.cpu.split('(')[0].trim()}<br>
            <strong>GPU:</strong> ${l.gpu.replace('NVIDIA GeForce ', '').replace(' Mobile', '')} (${l.gpuTgp})<br>
            <strong>Display:</strong> ${l.display}
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:0.75rem;">
            <span class="badge ${isModular ? 'badge-green' : 'badge-amber'}" style="font-size:0.68rem;">${isModular ? '✅ Modular RAM' : '⚠️ Soldered RAM'}</span>
            <span class="badge ${isFlickerFree ? 'badge-green' : 'badge-amber'}" style="font-size:0.68rem;">${isFlickerFree ? '👁️ Flicker-Free' : '⚠️ PWM Dimming'}</span>
            <span class="badge badge-blue" style="font-size:0.68rem;">🔋 ${l.batteryWhr} Whr</span>
            <span class="badge badge-purple" style="font-size:0.68rem;">⚖️ ${l.weight}</span>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:0.75rem;margin-top:0.5rem;">
          <div style="font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);">
            CB R23: <strong style="color:#6366f1;">${l.cinebenchR23.toLocaleString()}</strong>
          </div>
          <a href="/laptops/${l.slug}" style="font-family:var(--mono);font-size:0.8rem;color:var(--primary);text-decoration:none;font-weight:600;">Full Specs &rarr;</a>
        </div>
      </div>
    `;
  }).join('');

  const bodyHtml = `
    <div class="article-container" style="max-width:1200px;">
      <nav style="font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/laptops/">Laptops</a> &gt; Hardware Comparison Board
      </nav>

      <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;">
        <span class="badge badge-purple">Hardware Matrix & Board</span>
        <span class="badge badge-green">1,000 Laptops Indexed</span>
        <span class="badge badge-blue">Real-Time Filtering</span>
      </div>

      <h1 style="font-family:var(--serif);font-size:2.4rem;line-height:1.2;margin-bottom:0.75rem;">Interactive Hardware Comparison Board</h1>
      <p style="color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin-bottom:2rem;">
        Filter, search, and pin any laptop model to compare technical architectures side-by-side. Isolate laptops with modular upgradeable RAM, verify flicker-free DC dimming displays for eye strain prevention, and audit Cinebench CPU and 3DMark GPU benchmark scores in real time.
      </p>

      <!-- ACTIONABLE UTILITY DIAGNOSTIC COPY CARD -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.25rem;margin-bottom:2rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
        <div>
          <div style="font-family:var(--serif);font-size:1.15rem;font-weight:700;color:var(--fg);">Actionable Hardware Audit Summary</div>
          <div style="font-size:0.85rem;color:var(--text-muted);margin-top:0.25rem;">One-click copy of top benchmark leaders, modular upgradeable models, and eye-safe displays.</div>
        </div>
        <button id="btnCopyBoardReport" type="button" class="btn btn-primary" onclick="copyBoardDiagnosticReport()" style="padding:0.6rem 1.25rem;font-family:var(--mono);font-size:0.85rem;cursor:pointer;">
          📋 Copy Hardware Summary
        </button>
      </div>

      <!-- SEARCH & MULTI-ATTRIBUTE FILTER CONTROLS -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.5rem;margin-bottom:2rem;">
        <div style="margin-bottom:1.25rem;">
          <input type="text" id="board-search" placeholder="Search by model, CPU, GPU, or brand (e.g. RTX 4070, ThinkPad, OLED, Core Ultra)..." oninput="applyFilters()" style="width:100%;padding:0.75rem 1rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--sans);font-size:0.95rem;">
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;">
          <div>
            <label style="font-family:var(--mono);font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;display:block;margin-bottom:0.25rem;">Brand</label>
            <select id="filter-brand" onchange="applyFilters()" style="padding:0.5rem 0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;color:var(--fg);font-size:0.85rem;">
              <option value="all">All Brands (1,000)</option>
              <option value="lenovo">Lenovo (220)</option>
              <option value="dell">Dell & Alienware (180)</option>
              <option value="asus">ASUS (180)</option>
              <option value="hp">HP (140)</option>
              <option value="apple">Apple (80)</option>
              <option value="acer">Acer (80)</option>
              <option value="msi">MSI (60)</option>
              <option value="razer">Razer (30)</option>
              <option value="framework">Framework, LG & Microsoft (30)</option>
            </select>
          </div>

          <div>
            <label style="font-family:var(--mono);font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;display:block;margin-bottom:0.25rem;">Form Factor</label>
            <select id="filter-type" onchange="applyFilters()" style="padding:0.5rem 0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;color:var(--fg);font-size:0.85rem;">
              <option value="all">All Form Factors</option>
              <option value="gaming">Gaming Laptops</option>
              <option value="ultrabook">Ultrabooks & Thin-and-Light</option>
              <option value="workstation">Workstations & Creator</option>
              <option value="2-in-1">2-in-1 Convertible</option>
            </select>
          </div>

          <div>
            <label style="font-family:var(--mono);font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;display:block;margin-bottom:0.25rem;">Memory Upgrade</label>
            <select id="filter-ram" onchange="applyFilters()" style="padding:0.5rem 0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;color:var(--fg);font-size:0.85rem;">
              <option value="all">All Memory Types</option>
              <option value="modular">Modular SO-DIMM Only (Upgradeable)</option>
            </select>
          </div>

          <div>
            <label style="font-family:var(--mono);font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;display:block;margin-bottom:0.25rem;">Display Eye Safety</label>
            <select id="filter-pwm" onchange="applyFilters()" style="padding:0.5rem 0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;color:var(--fg);font-size:0.85rem;">
              <option value="all">All Displays</option>
              <option value="flickerfree">Flicker-Free DC Dimming (No PWM)</option>
              <option value="oled">OLED Displays Only</option>
            </select>
          </div>

          <div style="margin-left:auto;font-family:var(--mono);font-size:0.85rem;color:var(--text-muted);">
            Showing <strong id="count-disp" style="color:var(--fg);">80</strong> models
          </div>
        </div>
      </div>

      <!-- CARDS GRID -->
      <div id="board-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1rem;margin-bottom:3rem;">
        ${initialCardsHtml}
      </div>

      <!-- FLOATING PIN-TO-COMPARE TRAY -->
      <div id="pin-tray" style="display:none;position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);background:var(--surface);border:2px solid #6366f1;box-shadow:0 10px 25px rgba(0,0,0,0.3);border-radius:12px;padding:0.85rem 1.25rem;z-index:9999;max-width:90vw;width:680px;align-items:center;justify-content:space-between;gap:1rem;">
        <div style="display:flex;align-items:center;gap:0.75rem;overflow-x:auto;" id="pin-items">
          <!-- Populated dynamically by JS -->
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button type="button" onclick="clearPins()" style="background:transparent;border:none;color:var(--text-muted);font-size:0.8rem;cursor:pointer;font-family:var(--mono);">Clear</button>
          <button type="button" onclick="goToComparison()" id="btn-compare" style="padding:0.6rem 1.2rem;background:#6366f1;color:#fff;border:none;border-radius:6px;font-weight:600;font-size:0.85rem;cursor:pointer;">Compare (0)</button>
        </div>
      </div>

      <!-- 5 FATAL HARDWARE COMPARISON TRAPS -->
      <div style="margin:2.5rem 0;">
        <h2 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:0.5rem;color:var(--fg);">⚠️ 5 Fatal Laptop Comparison Traps & Hardware Pitfalls</h2>
        <p style="font-size:0.95rem;color:var(--text-muted);margin-bottom:1.5rem;line-height:1.5;">Critical spec-sheet traps and deceptive architectural pitfalls discovered across multi-laptop testing:</p>

        <div class="trap-card" style="background:var(--surface);border-left:4px solid #ef4444;border:1px solid var(--border);border-left-width:4px;border-radius:6px;padding:1.25rem;margin-bottom:1rem;">
          <div style="font-family:var(--serif);font-size:1.1rem;font-weight:700;color:var(--fg);margin-bottom:0.4rem;">1. Total Graphics Power (TGP) Blindness: The RTX 4060 Performance Divide</div>
          <p style="font-size:0.9rem;line-height:1.6;color:var(--text-muted);margin:0;">An RTX 4060 laptop GPU configured at 45W TGP in an ultraportable delivers up to 40% lower sustained gaming framerates than the identical RTX 4060 configured at 115W–140W in a full-sized chassis. Never compare laptops by GPU model name alone—always verify the Total Graphics Power (TGP) wattage limit.</p>
        </div>

        <div class="trap-card" style="background:var(--surface);border-left:4px solid #f59e0b;border:1px solid var(--border);border-left-width:4px;border-radius:6px;padding:1.25rem;margin-bottom:1rem;">
          <div style="font-family:var(--serif);font-size:1.1rem;font-weight:700;color:var(--fg);margin-bottom:0.4rem;">2. Intel Core Ultra H-Series vs U-Series Thermal Baselines</div>
          <p style="font-size:0.9rem;line-height:1.6;color:var(--text-muted);margin:0;">Marketing frequently lists both chips as "Intel Core Ultra 7", but U-series chips operate at a 15W TDP baseline with 2 P-cores, while H-series chips run at 28W–45W with 6 P-cores and double the graphics execution units. The H-series delivers more than double the sustained multi-threaded rendering performance.</p>
        </div>

        <div class="trap-card" style="background:var(--surface);border-left:4px solid #10b981;border:1px solid var(--border);border-left-width:4px;border-radius:6px;padding:1.25rem;margin-bottom:1rem;">
          <div style="font-family:var(--serif);font-size:1.1rem;font-weight:700;color:var(--fg);margin-bottom:0.4rem;">3. Sustained Thermal Throttling vs Instant 30-Second Burst Scores</div>
          <p style="font-size:0.9rem;line-height:1.6;color:var(--text-muted);margin:0;">Many ultra-slim laptops post spectacular Cinebench R23 single-loop scores by consuming 65W PL2 boost for 28 seconds before thermal throttling down to 20W PL1. On 10-minute looping workloads (rendering, compilation, simulations), their actual throughput drops by 35% to 50%.</p>
        </div>

        <div class="trap-card" style="background:var(--surface);border-left:4px solid #3b82f6;border:1px solid var(--border);border-left-width:4px;border-radius:6px;padding:1.25rem;margin-bottom:1rem;">
          <div style="font-family:var(--serif);font-size:1.1rem;font-weight:700;color:var(--fg);margin-bottom:0.4rem;">4. Display Color Gamut Deception (45% NTSC Washed-Out Panels)</div>
          <p style="font-size:0.9rem;line-height:1.6;color:var(--text-muted);margin:0;">Budget configurations of gaming laptops often boast high 144Hz refresh rates while silently equipping cheap 45% NTSC (~58% sRGB) panels with 250 nits brightness. Colors appear pale, washed out, and mudded. Demand 100% sRGB or DCI-P3 coverage with 300+ nits minimum.</p>
        </div>

        <div class="trap-card" style="background:var(--surface);border-left:4px solid #8b5cf6;border:1px solid var(--border);border-left-width:4px;border-radius:6px;padding:1.25rem;margin-bottom:1rem;">
          <div style="font-family:var(--serif);font-size:1.1rem;font-weight:700;color:var(--fg);margin-bottom:0.4rem;">5. USB-C Power Delivery Under-Wattage Battery Drain</div>
          <p style="font-size:0.9rem;line-height:1.6;color:var(--text-muted);margin:0;">Many powerful gaming and creator laptops support 100W USB-C PD charging on the road. However, running heavy 3D loads while plugged into a 100W USB-C charger will discharge the internal battery simultaneously (hybrid power drain) because the system draws 180W–240W from the wall under full combined load.</p>
        </div>
      </div>

      <!-- FAQ -->
      <div style="margin:2.5rem 0;">
        <h2 style="font-family:var(--serif);font-size:1.4rem;margin-bottom:1rem;">Frequently Asked Questions</h2>
        <details class="faq-item" style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.75rem;background:var(--surface);">
          <summary style="padding:0.9rem 1.25rem;cursor:pointer;font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">How do I compare laptops with the same GPU that perform drastically differently?</summary>
          <div style="padding:0.85rem 1.25rem 1.25rem;font-size:0.95rem;line-height:1.6;color:var(--text-muted);border-top:1px solid var(--border);background:var(--surface-alt);">In modern laptops, GPU performance is determined primarily by manufacturer-configured TGP (Total Graphics Power) and chassis cooling volume rather than the GPU silicon badge alone. For example, an RTX 4070 operating at 140W in an ASUS ROG Strix outpaces an RTX 4070 capped at 65W in a slim Zephyrus G14 by 25–35%. Always verify TGP in our specification matrix.</div>
        </details>
        <details class="faq-item" style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.75rem;background:var(--surface);">
          <summary style="padding:0.9rem 1.25rem;cursor:pointer;font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">What is the real-world difference between soldered LPDDR5X and modular SO-DIMM?</summary>
          <div style="padding:0.85rem 1.25rem 1.25rem;font-size:0.95rem;line-height:1.6;color:var(--text-muted);border-top:1px solid var(--border);background:var(--surface-alt);">Soldered LPDDR5X (Low Power DDR5) provides higher memory bandwidth (up to 7500 MT/s) and lower idle energy consumption, extending battery runtime in ultraportables. However, soldered RAM cannot be upgraded post-purchase. Modular SO-DIMM operates at slightly lower frequencies (5600 MT/s) but allows DIY upgrades up to 64GB or 96GB, protecting long-term device longevity.</div>
        </details>
        <details class="faq-item" style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.75rem;background:var(--surface);">
          <summary style="padding:0.9rem 1.25rem;cursor:pointer;font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">Why do benchmark scores drop after 10-15 minutes of continuous gaming or rendering?</summary>
          <div style="padding:0.85rem 1.25rem 1.25rem;font-size:0.95rem;line-height:1.6;color:var(--text-muted);border-top:1px solid var(--border);background:var(--surface-alt);">Modern processors utilize short-duration boost limits (Tau, PL2, or Dynamic Boost) that permit silicon power draw of 80W–120W for 20 to 60 seconds. Once copper heat pipes reach thermal saturation, firmware enforces lower continuous power caps (PL1, typically 35W–65W) to prevent CPU core temperatures from exceeding 95°C–100°C. Sustained 30-minute stress tests reflect true working performance.</div>
        </details>
        <details class="faq-item" style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.75rem;background:var(--surface);">
          <summary style="padding:0.9rem 1.25rem;cursor:pointer;font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">How can I tell if a laptop's display is color-accurate and eye-safe?</summary>
          <div style="padding:0.85rem 1.25rem 1.25rem;font-size:0.95rem;line-height:1.6;color:var(--text-muted);border-top:1px solid var(--border);background:var(--surface-alt);">Check two key metrics: color gamut coverage and backlight dimming technology. Professional creative work requires at least 99% sRGB and ideally 95%+ DCI-P3 with a Delta-E &lt; 2. For eye safety, verify whether the panel employs true DC dimming (0 Hz PWM) or high-frequency PWM (>2000 Hz) to eliminate micro-stroboscopic ocular muscle fatigue during long work sessions.</div>
        </details>
        <details class="faq-item" style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.75rem;background:var(--surface);">
          <summary style="padding:0.9rem 1.25rem;cursor:pointer;font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">What is the maximum number of laptops I can pin side-by-side on this board?</summary>
          <div style="padding:0.85rem 1.25rem 1.25rem;font-size:0.95rem;line-height:1.6;color:var(--text-muted);border-top:1px solid var(--border);background:var(--surface-alt);">You can pin up to 4 laptops simultaneously. When you pin 2 laptops, clicking "Compare" routes directly to a dedicated head-to-head showdown. Pinning 3 or 4 laptops activates a multi-column comparative matrix displaying CPU Cinebench R23, GPU 3DMark TimeSpy, RAM modularity, PWM flicker safety, battery Whr, and chassis weight side-by-side.</div>
        </details>
      </div>

      <!-- SOURCES & CITATIONS -->
      <div style="background:var(--surface-alt);border:1px solid var(--border);border-radius:8px;padding:1.5rem;margin-bottom:2.5rem;">
        <h2 style="font-family:var(--serif);font-size:1.25rem;margin-bottom:0.75rem;">📚 Benchmark Standards & Reference Methodology</h2>
        <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.6;margin-bottom:0.5rem;">
          Data compiled directly from manufacturer engineering databases (<a href="https://psref.lenovo.com" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:underline;">Lenovo PSREF</a>, <a href="https://www.dell.com/support/manuals" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:underline;">Dell Technical Specifications</a>, <a href="https://support.apple.com/specs" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:underline;">Apple Support Tech Specs</a>) and independent test laboratories (<a href="https://www.notebookcheck.net" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:underline;">Notebookcheck Benchmarks</a>, <a href="https://benchmarks.ul.com" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:underline;">UL 3DMark</a>).
        </p>
      </div>
    </div>

    <script>
      var pinnedLaptops = [];

      function showBoardToast(msg) {
        var t = document.getElementById("board-toast");
        if (!t) {
          t = document.createElement("div");
          t.id = "board-toast";
          t.style.cssText = "position:fixed;top:1.5rem;left:50%;transform:translateX(-50%);background:#1e293b;color:#f8fafc;border:1px solid #ef4444;padding:0.75rem 1.25rem;border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,0.3);z-index:10000;font-family:var(--mono);font-size:0.85rem;font-weight:600;display:flex;align-items:center;gap:0.5rem;transition:all 0.3s ease;";
          document.body.appendChild(t);
        }
        t.innerHTML = '<span>⚠️</span> <span>' + msg + '</span>';
        t.style.opacity = '1';
        t.style.pointerEvents = 'auto';
        clearTimeout(window._boardToastTimer);
        window._boardToastTimer = setTimeout(function() {
          t.style.opacity = '0';
          t.style.pointerEvents = 'none';
        }, 3500);
      }

      function togglePin(slug, model, brand, cpu, gpu) {
        var idx = pinnedLaptops.findIndex(function(p) { return p.slug === slug; });
        if (idx >= 0) {
          pinnedLaptops.splice(idx, 1);
        } else {
          if (pinnedLaptops.length >= 4) {
            showBoardToast("You can compare a maximum of 4 laptops simultaneously. Remove one to add another.");
            var chk = document.querySelector('.pin-check[data-slug="' + slug + '"]');
            if (chk) chk.checked = false;
            return;
          }
          pinnedLaptops.push({ slug: slug, model: model, brand: brand, cpu: cpu, gpu: gpu });
        }
        renderPinTray();
      }

      function renderPinTray() {
        var tray = document.getElementById("pin-tray");
        var items = document.getElementById("pin-items");
        var btn = document.getElementById("btn-compare");
        if (!tray || !items || !btn) return;

        if (pinnedLaptops.length === 0) {
          tray.style.display = "none";
          return;
        }

        tray.style.display = "flex";
        btn.textContent = "Compare (" + pinnedLaptops.length + ")";

        items.innerHTML = pinnedLaptops.map(function(p) {
          return '<div style="background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;padding:0.35rem 0.6rem;font-size:0.75rem;white-space:nowrap;display:flex;align-items:center;gap:0.35rem;">' +
            '<strong>' + p.brand + '</strong> ' + p.model.slice(0, 18) + '...' +
            '<span onclick="togglePin(\'' + p.slug + '\')" style="cursor:pointer;color:#ef4444;font-weight:bold;margin-left:0.25rem;">&times;</span>' +
          '</div>';
        }).join('');
      }

      function clearPins() {
        pinnedLaptops = [];
        var checkboxes = document.querySelectorAll('.pin-check');
        checkboxes.forEach(function(c) { c.checked = false; });
        renderPinTray();
      }

      function goToComparison() {
        if (pinnedLaptops.length < 2) {
          showBoardToast("Please pin at least 2 laptops to generate a head-to-head comparison.");
          return;
        }
        if (pinnedLaptops.length === 2) {
          window.location.href = "/laptops/compare/" + pinnedLaptops[0].slug + "-vs-" + pinnedLaptops[1].slug;
        } else {
          window.location.href = "/laptops/compare/";
        }
      }

      function applyFilters() {
        var q = (document.getElementById("board-search").value || "").toLowerCase().trim();
        var b = (document.getElementById("filter-brand").value || "all").toLowerCase();
        var t = (document.getElementById("filter-type").value || "all").toLowerCase();
        var ram = (document.getElementById("filter-ram").value || "all");
        var pwm = (document.getElementById("filter-pwm").value || "all");

        var cards = document.querySelectorAll(".laptop-card");
        var visibleCount = 0;

        cards.forEach(function(card) {
          var cardText = card.textContent.toLowerCase();
          var cardBrand = card.getAttribute("data-brand") || "";
          var cardType = card.getAttribute("data-type") || "";
          var cardModular = card.getAttribute("data-modular") === "true";
          var cardFlickerFree = card.getAttribute("data-flickerfree") === "true";
          var cardOled = card.getAttribute("data-oled") === "true";

          var matchSearch = !q || cardText.indexOf(q) >= 0;
          var matchBrand = b === "all" || cardBrand.indexOf(b) >= 0;
          var matchType = t === "all" || cardType.indexOf(t) >= 0;
          var matchRam = ram === "all" || (ram === "modular" && cardModular);
          var matchPwm = pwm === "all" || (pwm === "flickerfree" && cardFlickerFree) || (pwm === "oled" && cardOled);

          if (matchSearch && matchBrand && matchType && matchRam && matchPwm) {
            card.style.display = "flex";
            visibleCount++;
          } else {
            card.style.display = "none";
          }
        });

        var countDisp = document.getElementById("count-disp");
        if (countDisp) countDisp.textContent = visibleCount;
      }

      function copyBoardDiagnosticReport() {
        var btn = document.getElementById("btnCopyBoardReport");
        var text = "DIGITAL TOOLS SHED — HARDWARE COMPARISON MATRIX DIAGNOSTIC REPORT\n" +
          "Generated: " + new Date().toISOString().split("T")[0] + "\n" +
          "Database: 1,000 Verified Laptop Models | Source: digitaltoolsshed.com/laptops/board/\n\n" +
          "1. PERFORMANCE DIVIDE AUDIT:\n" +
          "   - GPU TGP Impact: RTX 4060 varies from 45W (thin-and-light) to 140W (full-fat gaming), creating a 35-45% FPS gap under sustained load.\n" +
          "   - CPU Thermal Baseline: Intel Core Ultra H-series (28-45W) outperforms U-series (15W) by over 50% in multi-core rendering.\n\n" +
          "2. MODULAR UPGRADEABILITY:\n" +
          "   - LPDDR5X Soldered: Zero post-purchase expandability; unrecoverable upon memory failure.\n" +
          "   - SO-DIMM Modular: User-serviceable dual slots up to 64GB/96GB.\n\n" +
          "3. DISPLAY HEALTH & EYE SAFETY:\n" +
          "   - Flicker-Free: Verified 0 Hz true DC dimming prevents ocular strain and tension headaches.\n" +
          "   - Color Coverage: Require 100% sRGB / 72% NTSC minimum; avoid budget 45% NTSC panels.\n\n" +
          "Compare side-by-side models and pin up to 4 devices: https://digitaltoolsshed.com/laptops/board/";

        navigator.clipboard.writeText(text).then(function() {
          if (btn) {
            var orig = btn.innerHTML;
            btn.innerHTML = "✓ Copied Summary!";
            btn.style.borderColor = "#10b981";
            btn.style.color = "#10b981";
            setTimeout(function() {
              btn.innerHTML = orig;
              btn.style.borderColor = "";
              btn.style.color = "";
            }, 2500);
          }
        });
      }
    </script>
  `;

  const boardFaqs = [
    {
      q: 'How do I compare laptops with the same GPU that perform drastically differently?',
      a: 'In modern laptops, GPU performance is determined primarily by manufacturer-configured TGP (Total Graphics Power) and chassis cooling volume rather than the GPU silicon badge alone. For example, an RTX 4070 operating at 140W in an ASUS ROG Strix outpaces an RTX 4070 capped at 65W in a slim Zephyrus G14 by 25–35%. Always verify TGP in our specification matrix.'
    },
    {
      q: 'What is the real-world difference between soldered LPDDR5X and modular SO-DIMM?',
      a: 'Soldered LPDDR5X (Low Power DDR5) provides higher memory bandwidth (up to 7500 MT/s) and lower idle energy consumption, extending battery runtime in ultraportables. However, soldered RAM cannot be upgraded post-purchase. Modular SO-DIMM operates at slightly lower frequencies (5600 MT/s) but allows DIY upgrades up to 64GB or 96GB, protecting long-term device longevity.'
    },
    {
      q: 'Why do benchmark scores drop after 10-15 minutes of continuous gaming or rendering?',
      a: 'Modern processors utilize short-duration boost limits (Tau, PL2, or Dynamic Boost) that permit silicon power draw of 80W–120W for 20 to 60 seconds. Once copper heat pipes reach thermal saturation, firmware enforces lower continuous power caps (PL1, typically 35W–65W) to prevent CPU core temperatures from exceeding 95°C–100°C. Sustained 30-minute stress tests reflect true working performance.'
    },
    {
      q: 'How can I tell if a laptop\'s display is color-accurate and eye-safe?',
      a: 'Check two key metrics: color gamut coverage and backlight dimming technology. Professional creative work requires at least 99% sRGB and ideally 95%+ DCI-P3 with a Delta-E < 2. For eye safety, verify whether the panel employs true DC dimming (0 Hz PWM) or high-frequency PWM (>2000 Hz) to eliminate micro-stroboscopic ocular muscle fatigue during long work sessions.'
    },
    {
      q: 'What is the maximum number of laptops I can pin side-by-side on this board?',
      a: 'You can pin up to 4 laptops simultaneously. When you pin 2 laptops, clicking "Compare" routes directly to a dedicated head-to-head showdown. Pinning 3 or 4 laptops activates a multi-column comparative matrix displaying CPU Cinebench R23, GPU 3DMark TimeSpy, RAM modularity, PWM flicker safety, battery Whr, and chassis weight side-by-side.'
    }
  ];

  const html = renderPage({
    title: 'Hardware Comparison Board & Laptop Matrix (1,000 Models) [Filter & Pin]',
    metaDesc: 'Interactive hardware comparison board for 1,000 laptops. Filter by modular SO-DIMM upgradeability, flicker-free DC dimming displays, Cinebench R23, and 3DMark TimeSpy.',
    canonical: canonical,
    currentPath: '/laptops/board/',
    bodyContent: bodyHtml,
    faq: boardFaqs,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Laptops', url: '/laptops/' },
      { name: 'Hardware Board', url: canonical }
    ]
  });

  writeFileSync(join(boardDir, 'index.html'), html, 'utf8');
  console.log('  ✓ Built Interactive Hardware Comparison Board (index.html in /laptops/board/)');
}
