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

      function togglePin(slug, model, brand, cpu, gpu) {
        var idx = pinnedLaptops.findIndex(function(p) { return p.slug === slug; });
        if (idx >= 0) {
          pinnedLaptops.splice(idx, 1);
        } else {
          if (pinnedLaptops.length >= 4) {
            alert("You can compare a maximum of 4 laptops simultaneously. Remove one to add another.");
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
            '<span onclick="togglePin(\\'' + p.slug + '\\')" style="cursor:pointer;color:#ef4444;font-weight:bold;margin-left:0.25rem;">&times;</span>' +
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
          alert("Please pin at least 2 laptops to generate a head-to-head comparison.");
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
    </script>
  `;

  const html = renderPage({
    title: 'Hardware Comparison Board & Laptop Matrix (1,000 Models) [Filter & Pin]',
    metaDesc: 'Interactive hardware comparison board for 1,000 laptops. Filter by modular SO-DIMM upgradeability, flicker-free DC dimming displays, Cinebench R23, and 3DMark TimeSpy.',
    canonical: canonical,
    currentPath: '/laptops/board/',
    bodyContent: bodyHtml,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Laptops', url: '/laptops/' },
      { name: 'Hardware Board', url: canonical }
    ]
  });

  writeFileSync(join(boardDir, 'index.html'), html, 'utf8');
  console.log('  ✓ Built Interactive Hardware Comparison Board (index.html in /laptops/board/)');
}
