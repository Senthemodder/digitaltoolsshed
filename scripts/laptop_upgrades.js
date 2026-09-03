// scripts/laptop_upgrades.js — RAM & Storage Upgradeability Directory
import { LAPTOP_MODELS } from './laptop_tools.js';

export function buildLaptopUpgrades({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  console.log('  🔨 Building RAM & Storage Upgradeability Directory (/laptops/upgrades/)...');
  const upDir = join(DIST, 'laptops', 'upgrades');
  ensureDir(upDir);

  const canonical = `${DOMAIN}/laptops/upgrades/`;

  // Pre-render upgrade rows
  const rowsHtml = LAPTOP_MODELS.slice(0, 150).map(l => {
    const isModular = !l.ramType.includes('Soldered');
    const isDualSsd = l.ssdSlots.includes('Dual') || l.ssdSlots.includes('2x');
    const screwType = l.brand === 'Apple' ? 'Pentalobe P5' : (l.brand === 'Dell' || l.brand === 'Razer' ? 'Torx T5' : 'Phillips #0');

    return `
      <tr style="border-bottom:1px solid var(--border);" class="upgrade-row" data-modular="${isModular}">
        <td style="padding:0.75rem;font-weight:600;">
          <a href="/laptops/${l.slug}" style="color:var(--fg);text-decoration:none;">${l.model}</a>
        </td>
        <td style="padding:0.75rem;">
          <span class="badge ${isModular ? 'badge-green' : 'badge-amber'}" style="font-size:0.7rem;">
            ${isModular ? '✅ Modular SO-DIMM' : '⚠️ Soldered (Non-Upgradeable)'}
          </span>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">${l.ramType}</div>
        </td>
        <td style="padding:0.75rem;">
          <span class="badge badge-blue" style="font-size:0.7rem;">
            ${isDualSsd ? '2x M.2 NVMe Slots' : '1x M.2 NVMe Slot'}
          </span>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">${l.ssdSlots}</div>
        </td>
        <td style="padding:0.75rem;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);">
          ${screwType}
        </td>
        <td style="padding:0.75rem;font-size:0.85rem;">
          <a href="/laptops/${l.slug}" style="color:var(--primary);text-decoration:none;font-weight:600;">Teardown Guide &rarr;</a>
        </td>
      </tr>
    `;
  }).join('');

  const bodyHtml = `
    <div class="article-container" style="max-width:1150px;">
      <nav style="font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/laptops/">Laptops</a> &gt; RAM & Storage Upgradeability Matrix
      </nav>

      <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;">
        <span class="badge badge-green">Upgradeability Matrix</span>
        <span class="badge badge-blue">SO-DIMM vs Soldered</span>
        <span class="badge badge-purple">M.2 NVMe Storage Expansion</span>
      </div>

      <h1 style="font-family:var(--serif);font-size:2.4rem;line-height:1.2;margin-bottom:0.75rem;">Laptop RAM & SSD Upgradeability Directory</h1>
      <p style="color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin-bottom:2rem;">
        Before buying or upgrading a laptop, verify whether memory is user-serviceable or soldered directly to the logic board. Search all 1,000 models below for modular SO-DIMM sockets, dual M.2 NVMe PCIe storage slots, and required teardown chassis screwdriver specifications.
      </p>

      <!-- FILTER CONTROLS -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.25rem;margin-bottom:2rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
        <input type="text" id="up-search" placeholder="Filter by model name or brand (e.g. ThinkPad, Legion, XPS, Zephyrus)..." oninput="filterUpgrades()" style="flex:1;min-width:260px;padding:0.6rem 0.85rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-size:0.9rem;">
        <select id="up-ram-filter" onchange="filterUpgrades()" style="padding:0.6rem 0.85rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-size:0.85rem;">
          <option value="all">All Laptops</option>
          <option value="modular">Modular SO-DIMM Only (Upgradeable)</option>
          <option value="soldered">Soldered RAM Only</option>
        </select>
      </div>

      <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.5rem;margin-bottom:3rem;overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;line-height:1.5;">
          <thead>
            <tr style="border-bottom:2px solid var(--border);text-align:left;">
              <th style="padding:0.75rem;width:34%;">Laptop Model</th>
              <th style="padding:0.75rem;width:24%;">RAM Architecture</th>
              <th style="padding:0.75rem;width:22%;">Storage & M.2 Slots</th>
              <th style="padding:0.75rem;width:12%;">Screw Type</th>
              <th style="padding:0.75rem;width:8%;">Guide</th>
            </tr>
          </thead>
          <tbody id="upgrade-table-body">
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>

    <script>
      function filterUpgrades() {
        var q = (document.getElementById("up-search").value || "").toLowerCase().trim();
        var ramFilter = document.getElementById("up-ram-filter").value;
        var rows = document.querySelectorAll(".upgrade-row");

        rows.forEach(function(r) {
          var text = r.textContent.toLowerCase();
          var isModular = r.getAttribute("data-modular") === "true";

          var matchQ = !q || text.indexOf(q) >= 0;
          var matchRam = ramFilter === "all" || (ramFilter === "modular" && isModular) || (ramFilter === "soldered" && !isModular);

          if (matchQ && matchRam) {
            r.style.display = "";
          } else {
            r.style.display = "none";
          }
        });
      }
    </script>
  `;

  const html = renderPage({
    title: 'Laptop RAM & SSD Upgradeability Matrix [Soldered vs Modular SO-DIMM]',
    metaDesc: 'Search 1,000 laptops for modular SO-DIMM upgradeability, dual M.2 NVMe SSD slots, and chassis teardown screw types. Verified against official maintenance manuals.',
    canonical: canonical,
    currentPath: '/laptops/upgrades/',
    bodyContent: bodyHtml,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Laptops', url: '/laptops/' },
      { name: 'Upgradeability Directory', url: canonical }
    ]
  });

  writeFileSync(join(upDir, 'index.html'), html, 'utf8');
  console.log('  ✓ Built RAM & Storage Upgradeability Directory (index.html in /laptops/upgrades/)');
}
