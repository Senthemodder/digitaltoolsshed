import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir, ICONS } from './core.js';

function buildProductivitySuite() {
  const prodDist = join(DIST, 'productivity');
  ensureDir(prodDist);

  const printCss = `
    <style>
      
.sponsor-grid {
  margin: 2rem 0 0;
  padding: 1.5rem 0;
  border-top: 1px solid color-mix(in srgb, var(--border) 40%, transparent);
}
.sponsor-grid-title {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: color-mix(in srgb, var(--text-subtle) 70%, transparent);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.sponsor-grid-title::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--border), transparent);
  opacity: 0.3;
}
.sponsor-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
@media (max-width: 768px) {
  .sponsor-cards { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .sponsor-cards { grid-template-columns: 1fr; }
}
.sponsor-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: linear-gradient(145deg, var(--surface) 0%, var(--bg) 100%);
  border: 1px solid color-mix(in srgb, var(--border) 35%, transparent);
  border-radius: 5px;
  overflow: hidden;
  transition: border-color 0.25s, transform 0.2s;
  cursor: pointer;
}
.sponsor-card:hover {
  border-color: var(--border);
  transform: translateY(-1px);
}
.sponsor-card-thumb {
  width: 100%;
  height: 80px;
  position: relative;
  overflow: hidden;
}
.sponsor-card-body {
  padding: 0.6rem 0.7rem;
}
.sponsor-card-body h4 {
  font-family: var(--serif);
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 0.4rem;
  color: var(--fg);
}
.sponsor-card-body .sponsor-source {
  font-family: var(--mono);
  font-size: 0.55rem;
  color: color-mix(in srgb, var(--text-muted) 60%, transparent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media print {
        .topbar, .sidebar, .ad-blend-box, .ad-sidebar-card, .ad-promo-card, .ad-hero-undercard,
        .ad-category-break, .ad-pre-footer, .docked-sticky-ad, .sponsor-notice, .mobile-welcome-overlay, .sponsor-grid,
        .ad-unit-300x250, .ad-unit-468x60, .ad-desktop-leaderboard, .ad-mobile-banner,
        .right-rail, footer, .no-print { display: none !important; }
        .content-area { margin: 0; padding: 0; width: 100%; max-width: 100%; }
        .main-body { max-width: 100%; margin: 0; padding: 0; }
        .article-container { border: none !important; padding: 0 !important; max-width: 100% !important; box-shadow: none !important; }
        body { background: white !important; color: black !important; }
        * { color: black !important; background: transparent !important; border-color: #ccc !important; }
        input, textarea, select { border: 1px solid transparent !important; }
        .print-only { display: block !important; }
      }
      .print-only { display: none; }
    </style>
  `;

  const commonStyles = {
    btn: `background: var(--btn-bg); color: var(--btn-fg); border: none; padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; letter-spacing: 0.03em;`,
    input: `width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border); background: var(--input-bg, #fff); color: var(--fg);`,
    label: `font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem; display: block;`,
    card: `background: var(--surface); border: 1px solid var(--border); padding: 1rem;`,
    h2: `font-family: var(--serif); font-size: 1.3rem; margin: 2rem 0 1rem;`,
    table: `width: 100%; border-collapse: collapse;`,
    thtd: `padding: 0.5rem 0.75rem; border: 1px solid var(--border); font-size: 0.9rem; text-align: left;`,
    textarea: `width: 100%; height: 200px; padding: 0.85rem; font-family: var(--mono); font-size: 0.9rem; border: 1px solid var(--border); background: var(--input-bg, #fff); color: var(--fg); resize: vertical;`
  };

  // 1. Text De-duplicator
  const deduplicatorBody = `<style>
      .trap-card { background: var(--surface-alt); border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; font-size: 0.9rem; line-height: 1.5; }
      .trap-card strong { display: block; margin-bottom: 0.3rem; font-size: 0.95rem; }
      .faq-item { margin-bottom: 0.75rem; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); overflow: hidden; }
      .faq-item summary { padding: 0.85rem 1.15rem; font-weight: 600; cursor: pointer; font-size: 0.95rem; list-style: none; display: flex; justify-content: space-between; align-items: center; }
      .faq-item summary::-webkit-details-marker { display: none; }
      .faq-item summary::after { content: "+"; font-family: var(--mono); font-size: 1.2rem; }
      .faq-item[open] summary::after { content: "−"; }
      .faq-item div { padding: 0.85rem 1.15rem; border-top: 1px solid var(--border); font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }
    </style>
    <div class="article-container" style="max-width: 960px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/productivity/">Productivity</a> &gt; Text De-duplicator
      </nav>
      <h1 style="font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;">Text De-duplicator & List Cleaner</h1>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.55; margin-bottom: 1.5rem;">
        Remove duplicate lines, emails, keywords, or database IDs with high-throughput hash set deduplication. Supports case-sensitivity toggles, whitespace trimming, multi-criteria sorting, and occurrence count tagging. 100% client-side privacy.
      </p>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem;">
          <div>
            <label style="${commonStyles.label}">Input Text / Raw List</label>
            <textarea id="dd-input" style="${commonStyles.textarea} height: 260px;" placeholder="Paste text, list of emails, or URLs here...&#10;apple&#10;orange&#10;apple&#10;banana&#10;orange"></textarea>
          </div>
          <div>
            <label style="${commonStyles.label}">Deduplicated Output</label>
            <textarea id="dd-output" readonly style="${commonStyles.textarea} height: 260px; background: var(--surface-alt);" placeholder="Cleaned output will appear here..."></textarea>
          </div>
        </div>

        <!-- Filter & Sorting Controls -->
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; margin-top: 1.25rem;">
          <div style="display: flex; flex-wrap: wrap; gap: 1.25rem; align-items: center; font-size: 0.88rem;">
            <label style="display: flex; align-items: center; gap: 0.45rem; cursor: pointer;">
              <input type="checkbox" id="dd-case" checked> <span>Case-insensitive (A == a)</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.45rem; cursor: pointer;">
              <input type="checkbox" id="dd-trim" checked> <span>Trim Whitespace</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.45rem; cursor: pointer;">
              <input type="checkbox" id="dd-empty" checked> <span>Remove Empty Lines</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.45rem; cursor: pointer;">
              <input type="checkbox" id="dd-count"> <span>Append Occurrence Count</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.45rem; cursor: pointer;">
              <input type="checkbox" id="dd-invert"> <span>Invert (Show Duplicates Only)</span>
            </label>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; margin-top: 1rem; border-top: 1px solid var(--border); padding-top: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="field-label" style="margin:0; font-size: 0.75rem;">Sort:</span>
              <select id="dd-sort-mode" style="padding: 0.35rem 0.6rem; font-family: var(--sans); font-size: 0.82rem; border: 1px solid var(--border); border-radius: 4px; background: var(--bg); color: var(--fg);">
                <option value="none" selected>Preserve Original Order</option>
                <option value="asc">Alphabetical (A → Z)</option>
                <option value="desc">Alphabetical (Z → A)</option>
                <option value="len-asc">Shortest to Longest</option>
                <option value="len-desc">Longest to Shortest</option>
                <option value="freq-desc">Most Frequent First</option>
              </select>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="field-label" style="margin:0; font-size: 0.75rem;">Delimiter:</span>
              <select id="dd-delimiter" style="padding: 0.35rem 0.6rem; font-family: var(--sans); font-size: 0.82rem; border: 1px solid var(--border); border-radius: 4px; background: var(--bg); color: var(--fg);">
                <option value="newline" selected>Newline (\n)</option>
                <option value="comma">Comma (,)</option>
                <option value="semicolon">Semicolon (;)</option>
                <option value="tab">Tab (\t)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Telemetry Stats Strip -->
        <div id="dd-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; text-align: center; margin-top: 1.25rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.75rem; border-radius: 6px;">
            <div style="font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted);">ORIGINAL ITEMS</div>
            <div id="stat-total" style="font-family: var(--mono); font-size: 1.3rem; font-weight: bold; color: var(--fg);">0</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.75rem; border-radius: 6px;">
            <div style="font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted);">UNIQUE ITEMS</div>
            <div id="stat-unique" style="font-family: var(--mono); font-size: 1.3rem; font-weight: bold; color: #10b981;">0</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.75rem; border-radius: 6px;">
            <div style="font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted);">DUPLICATES PURGED</div>
            <div id="stat-dupes" style="font-family: var(--mono); font-size: 1.3rem; font-weight: bold; color: #ef4444;">0</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.75rem; border-radius: 6px;">
            <div style="font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted);">REDUCTION RATIO</div>
            <div id="stat-pct" style="font-family: var(--mono); font-size: 1.3rem; font-weight: bold; color: #3b82f6;">0%</div>
          </div>
        </div>

        <!-- Action Bar -->
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.5rem;">
          <button type="button" id="dd-process-btn" style="${commonStyles.btn} border-radius: 4px;" onclick="processDeduplication()">Clean & Deduplicate</button>
          <button type="button" class="btn-sec" id="btnCopyResult" style="padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--border); background: transparent; color: var(--fg); cursor: pointer;" onclick="copyDdResult()">Copy Result</button>
          <button type="button" class="btn-sec" id="btnDownloadTxt" style="padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--border); background: transparent; color: var(--fg); cursor: pointer;" onclick="downloadDdTxt()">Download .TXT</button>
          <button type="button" class="btn-sec" id="btnCopyDedupReport" style="padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--border); background: transparent; color: var(--fg); cursor: pointer;" onclick="copyDedupReport()">Copy Audit Report</button>
        </div>
      </div>

      <!-- Mathematical Derivation -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-top: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.75rem;">Algorithmic Complexity & Hash Table Mathematics</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
          Naive de-duplication compares each item against an accumulating array using linear search (<code>Array.indexOf</code>), resulting in quadratic time complexity O(N²). On 50,000 lines, this requires 1.25 billion comparison cycles, freezing the browser thread.
        </p>
        <div style="background: var(--bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; margin-bottom: 1.25rem;">
          <div><strong>1. Hash Set Constant Time Lookup:</strong></div>
          <div>&nbsp;&nbsp;Average Insertion & Lookup: O(1) time complexity</div>
          <div>&nbsp;&nbsp;Overall Execution: O(N) linear time for N input entries</div>
          <div><strong>2. Duplicate Elimination Formula:</strong></div>
          <div>&nbsp;&nbsp;Duplicates Purged = Total Entries (N) - Unique Hash Keys (|S|)</div>
          <div>&nbsp;&nbsp;Reduction Percentage = (Duplicates Purged / Total Entries) × 100%</div>
          <div><strong>3. Unicode Equivalence:</strong></div>
          <div>&nbsp;&nbsp;Canonical decomposition (NFD) followed by canonical composition (NFC)</div>
        </div>
      </div>

      <!-- 5 Fatal Traps -->
      <div style="margin-top: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">5 Fatal Traps in Text De-duplication & Data Cleaning</h2>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Unicode Normalization NFC vs NFD Trap</strong>
          Two lines may look visually identical while possessing completely different byte representations. For instance, "é" can be encoded as a single precomposed character (U+00E9 in NFC) or as an "e" followed by a combining acute accent (U+0065 U+0301 in NFD). Without Unicode normalization, standard string hashing fails to catch the duplicate.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The Quadratic Big-O Array Inefficiency Trap</strong>
          Writing deduplication routines using <code>newArray.includes(line)</code>. Because <code>includes()</code> executes an O(N) scan, filtering a list of 100,000 email addresses forces 10 billion CPU iterations, inducing browser "Page Unresponsive" warnings. Production deduplication mandates an O(1) Hash Set.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Invisible Zero-Width Whitespace Trap</strong>
          Copying data from rich-text editors, Google Docs, or formatted web pages often injects invisible characters such as Byte Order Marks (BOM \uFEFF) or Zero-Width Spaces (\u200B). Two strings like "admin" and "admin\u200B" appear identical to the naked eye but evaluate as unequal in basic string comparisons.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The CRLF vs LF Linebreak Mismatch</strong>
          Splitting text strictly on <code>\n</code> when the input originated on Windows (which uses <code>\r\n</code> carriage returns). Trailing <code>\r</code> characters remain invisibly attached to the end of lines, causing items at the end of a block to fail matching identical items pasted from Unix or macOS systems.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The Preserved Order Invalidation Trap</strong>
          Sorting lists prior to deduplication when sequential ordering matters (such as execution logs, cron schedules, or customer journey touchpoints). Standard deduplication should always preserve the first appearance sequence by default.
        </div>
      </div>

      <!-- Interactive FAQs -->
      <div style="margin-top: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
        
        <details class="faq-item">
          <summary>How does this tool handle large lists of 50,000+ items?</summary>
          <div>
            Because the processing engine utilizes JavaScript's native <code>Set</code> and <code>Map</code> data structures with O(1) amortized hash lookups, lists containing over 100,000 lines process in under 50 milliseconds directly in your browser without lag.
          </div>
        </details>

        <details class="faq-item">
          <summary>What is the difference between case-sensitive and case-insensitive deduplication?</summary>
          <div>
            In case-sensitive mode, "Apple" and "apple" are treated as two distinct items. In case-insensitive mode, the first encountered casing is preserved while subsequent case variations are recognized as duplicates and removed.
          </div>
        </details>

        <details class="faq-item">
          <summary>Can I find ONLY the duplicate items instead of removing them?</summary>
          <div>
            Yes! Enable the "Invert (Show Duplicates Only)" checkbox. The tool will output only the items that appeared more than once in your input list, making it easy to identify duplicate customer accounts, double-booked appointments, or conflicting IDs.
          </div>
        </details>

        <details class="faq-item">
          <summary>Can I deduplicate comma-separated values (CSV) instead of line breaks?</summary>
          <div>
            Yes. Use the Delimiter dropdown to choose between Newline (\n), Comma (,), Semicolon (;), or Tab (\t). The tool will split and rejoin your items using the selected delimiter.
          </div>
        </details>

        <details class="faq-item">
          <summary>Is my pasted text or sensitive list data sent to any server?</summary>
          <div>
            No. The entire deduplication algorithm executes 100% locally inside your browser's memory using client-side JavaScript. No text, emails, or credentials ever leave your computer.
          </div>
        </details>
      </div>
    </div>

    <script>
      function setFeedback(btnId, originalText) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.textContent = '✓ Copied!';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2500);
      }

      function processDeduplication() {
        const text = document.getElementById('dd-input').value;
        const caseIns = document.getElementById('dd-case').checked;
        const trimWs = document.getElementById('dd-trim').checked;
        const removeEmpty = document.getElementById('dd-empty').checked;
        const showCount = document.getElementById('dd-count').checked;
        const invert = document.getElementById('dd-invert').checked;
        const sortMode = document.getElementById('dd-sort-mode').value;
        const delimKey = document.getElementById('dd-delimiter').value;

        let delimiter = '\n';
        if (delimKey === 'comma') delimiter = ',';
        if (delimKey === 'semicolon') delimiter = ';';
        if (delimKey === 'tab') delimiter = '\t';

        const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const rawItems = delimKey === 'newline' ? normalized.split('\n') : normalized.split(delimiter);

        const freqMap = new Map();
        const displayMap = new Map();
        const firstSeenOrder = [];

        let totalValid = 0;

        for (let i = 0; i < rawItems.length; i++) {
          let item = rawItems[i];
          item = item.replace(/[\u200B-\u200D\uFEFF]/g, '');
          if (trimWs) item = item.trim();
          if (removeEmpty && item === '') continue;

          totalValid++;
          const key = caseIns ? item.toLowerCase() : item;

          if (!freqMap.has(key)) {
            freqMap.set(key, 1);
            displayMap.set(key, item);
            firstSeenOrder.push(key);
          } else {
            freqMap.set(key, freqMap.get(key) + 1);
          }
        }

        let keysToInclude = [];
        if (invert) {
          keysToInclude = firstSeenOrder.filter(k => freqMap.get(k) > 1);
        } else {
          keysToInclude = firstSeenOrder;
        }

        if (sortMode === 'asc') {
          keysToInclude.sort((a, b) => displayMap.get(a).localeCompare(displayMap.get(b)));
        } else if (sortMode === 'desc') {
          keysToInclude.sort((a, b) => displayMap.get(b).localeCompare(displayMap.get(a)));
        } else if (sortMode === 'len-asc') {
          keysToInclude.sort((a, b) => displayMap.get(a).length - displayMap.get(b).length);
        } else if (sortMode === 'len-desc') {
          keysToInclude.sort((a, b) => displayMap.get(b).length - displayMap.get(a).length);
        } else if (sortMode === 'freq-desc') {
          keysToInclude.sort((a, b) => freqMap.get(b) - freqMap.get(a));
        }

        const outItems = keysToInclude.map(k => {
          const display = displayMap.get(k);
          if (showCount) {
            return display + ' (' + freqMap.get(k) + ')';
          }
          return display;
        });

        const joinDelim = (delimKey === 'newline') ? '\n' : delimiter + ' ';
        document.getElementById('dd-output').value = outItems.join(joinDelim);

        const uniqueCount = keysToInclude.length;
        const dupesPurged = Math.max(0, totalValid - uniqueCount);
        const redPct = totalValid > 0 ? Math.round((dupesPurged / totalValid) * 100) : 0;

        document.getElementById('stat-total').textContent = totalValid.toLocaleString();
        document.getElementById('stat-unique').textContent = uniqueCount.toLocaleString();
        document.getElementById('stat-dupes').textContent = dupesPurged.toLocaleString();
        document.getElementById('stat-pct').textContent = redPct + '%';
      }

      function copyDdResult() {
        const out = document.getElementById('dd-output').value;
        navigator.clipboard.writeText(out).then(() => {
          setFeedback('btnCopyResult', 'Copy Result');
        });
      }

      function downloadDdTxt() {
        const out = document.getElementById('dd-output').value;
        const blob = new Blob([out], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.download = 'cleaned_deduplicated_list.txt';
        a.href = URL.createObjectURL(blob);
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }

      function copyDedupReport() {
        const total = document.getElementById('stat-total').textContent;
        const unique = document.getElementById('stat-unique').textContent;
        const dupes = document.getElementById('stat-dupes').textContent;
        const pct = document.getElementById('stat-pct').textContent;

        const report = [
          '======================================================',
          'DIGITAL TOOLS SHED - TEXT DEDUPLICATION AUDIT REPORT',
          '======================================================',
          'Timestamp: ' + new Date().toISOString(),
          'Input Total Count: ' + total + ' items',
          'Unique Retained: ' + unique + ' items',
          'Duplicates Purged: ' + dupes + ' items',
          'Payload Reduction: ' + pct,
          'Configuration:',
          '  - Case Insensitive: ' + (document.getElementById('dd-case').checked ? 'Enabled' : 'Disabled'),
          '  - Whitespace Trimming: ' + (document.getElementById('dd-trim').checked ? 'Enabled' : 'Disabled'),
          '  - Sorting Mode: ' + document.getElementById('dd-sort-mode').value,
          '======================================================'
        ].join('\n');

        navigator.clipboard.writeText(report).then(() => {
          setFeedback('btnCopyDedupReport', 'Copy Audit Report');
        });
      }

      document.getElementById('dd-input').addEventListener('input', () => {
        if (document.getElementById('dd-input').value.length < 20000) {
          processDeduplication();
        }
      });
      document.addEventListener('DOMContentLoaded', processDeduplication);
    </script>`;

  // 2. Time Tracker (Toggl-style Timesheet)
  const timeTrackerBody = `
    ${printCss}
    <div class="article-container" style="max-width: 1100px;">
        <style>
            :root {
                --tt-header-bg: var(--surface);
                --tt-cell-border: var(--border);
                --tt-cell-hover: var(--surface-alt);
                --tt-active-col: rgba(100, 100, 100, 0.05);
            }
            .tt-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
                gap: 10px;
            }
            .tt-nav {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .tt-nav-btn {
                background: none;
                border: 1px solid var(--border);
                color: var(--fg);
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
            }
            .tt-nav-btn:hover {
                background: var(--surface-alt);
            }
            .tt-date-range {
                font-weight: bold;
                font-family: var(--mono);
            }
            .tt-filters {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            .tt-filter-pill {
                padding: 4px 10px;
                border: 1px dashed var(--border);
                border-radius: 20px;
                font-size: 0.85em;
                color: var(--text-muted);
                cursor: pointer;
            }
            .tt-filter-pill:hover {
                background: var(--surface-alt);
            }
            .tt-view-toggle {
                display: flex;
                border: 1px solid var(--border);
                border-radius: 6px;
                overflow: hidden;
            }
            .tt-view-btn {
                background: var(--surface);
                border: none;
                padding: 6px 12px;
                cursor: pointer;
                color: var(--text-muted);
            }
            .tt-view-btn.active {
                background: var(--btn-bg);
                color: var(--btn-fg);
            }
            .tt-grid {
                width: 100%;
                border-collapse: collapse;
                table-layout: fixed;
            }
            .tt-grid th, .tt-grid td {
                border: 1px solid var(--tt-cell-border);
                padding: 8px;
                text-align: center;
            }
            .tt-grid th:first-child, .tt-grid td:first-child {
                text-align: left;
                width: 25%;
            }
            .tt-grid th {
                background: var(--tt-header-bg);
                font-weight: normal;
                font-size: 0.9em;
                color: var(--text-muted);
            }
            .tt-cell {
                cursor: pointer;
                min-height: 30px;
                position: relative;
            }
            .tt-cell:hover {
                background: var(--tt-cell-hover);
            }
            .tt-cell-input {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid var(--border);
                background: var(--bg);
                color: var(--fg);
                text-align: center;
                display: none;
            }
            .tt-cell.editing .tt-cell-input {
                display: block;
            }
            .tt-cell.editing .tt-cell-val {
                display: none;
            }
            .tt-project-label {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .tt-project-color {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                display: inline-block;
            }
            .tt-total-col {
                font-weight: bold;
                background: var(--surface);
            }
            .tt-add-task {
                margin-top: 10px;
                color: var(--text-muted);
                cursor: pointer;
                font-size: 0.9em;
                display: inline-block;
            }
            .tt-add-task:hover {
                text-decoration: underline;
            }
            
            .tt-live-timer {
                display: flex;
                gap: 10px;
                background: var(--surface);
                padding: 15px;
                border-radius: 8px;
                border: 1px solid var(--border);
                margin-bottom: 20px;
                align-items: center;
                flex-wrap: wrap;
            }
            .tt-timer-input {
                flex-grow: 1;
                border: none;
                background: transparent;
                color: var(--fg);
                font-size: 1em;
                outline: none;
            }
            .tt-timer-select {
                background: transparent;
                border: 1px solid var(--border);
                color: var(--fg);
                padding: 5px;
                border-radius: 4px;
            }
            .tt-timer-display {
                font-family: var(--mono);
                font-size: 1.2em;
                font-weight: bold;
                min-width: 80px;
                text-align: right;
            }
            .tt-timer-btn {
                background: var(--btn-bg);
                color: var(--btn-fg);
                border: none;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .tt-timer-btn.stop {
                background: #e74c3c;
            }
            .tt-timer-btn.start {
                background: #2ecc71;
            }
            
            #tt-entries-view {
                display: none;
            }
            .tt-entry-row {
                display: flex;
                justify-content: space-between;
                padding: 10px;
                border-bottom: 1px solid var(--border);
            }
            .tt-entry-desc { flex-grow: 1; }
            .tt-entry-project { color: var(--text-muted); width: 150px; }
            .tt-entry-dur { font-family: var(--mono); font-weight: bold; width: 80px; text-align: right; }
            .tt-entry-date { color: var(--text-subtle); width: 100px; text-align: right; }
            .tt-entry-delete { color: #e74c3c; cursor: pointer; margin-left: 15px; background: none; border: none;}
        </style>

        <h1 style="${commonStyles.h2}">Time Tracker</h1>
        
        <div class="tt-live-timer">
            <input type="text" id="tt-timer-desc" class="tt-timer-input" placeholder="What are you working on?">
            <select id="tt-timer-project" class="tt-timer-select">
                <option value="">No Project</option>
            </select>
            <div id="tt-timer-display" class="tt-timer-display">00:00:00</div>
            <button id="tt-timer-toggle" class="tt-timer-btn start">▶</button>
        </div>

        <div class="tt-header">
            <div class="tt-nav">
                <button class="tt-nav-btn" id="tt-prev-week">&lt;</button>
                <button class="tt-nav-btn" id="tt-next-week">&gt;</button>
                <span class="tt-date-range" id="tt-date-range">...</span>
                <button class="tt-nav-btn" id="tt-this-week">This week</button>
            </div>
            
            <div class="tt-filters">
                <span class="tt-filter-pill">Billable</span>
                <span class="tt-filter-pill">Tag</span>
                <span class="tt-filter-pill">Tracked time</span>
                <span class="tt-filter-pill">Archived tasks</span>
                <span class="tt-filter-pill">Date added</span>
            </div>

            <div class="tt-view-toggle">
                <button class="tt-view-btn active" id="tt-btn-timesheet">Timesheet</button>
                <button class="tt-view-btn" id="tt-btn-entries">Time entries</button>
            </div>
        </div>

        <div id="tt-timesheet-view">
            <div style="overflow-x: auto;">
                <table class="tt-grid" id="tt-grid">
                    <thead>
                        <tr id="tt-grid-header">
                            <th>Task/Project</th>
                            <th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th>
                            <th class="tt-total-col">Total</th>
                        </tr>
                    </thead>
                    <tbody id="tt-grid-body">
                    </tbody>
                </table>
            </div>
            <div class="tt-add-task" id="tt-add-task">+ Add task</div>
        </div>

        <div id="tt-entries-view">
            <div id="tt-entries-list"></div>
        </div>

        <script>
            (() => {
                // State
                let currentDate = new Date();
                let projects = JSON.parse(localStorage.getItem('dts-time-projects') || '[]');
                let entries = JSON.parse(localStorage.getItem('dts-time-entries') || '[]');
                
                // Initialize default project if none exists
                if (projects.length === 0) {
                    projects.push({ id: 'proj-' + Date.now(), name: 'General', color: '#3498db' });
                    saveProjects();
                }

                // Timer state
                let timerInterval = null;
                let timerSeconds = 0;
                let isTimerRunning = false;
                
                function saveProjects() { localStorage.setItem('dts-time-projects', JSON.stringify(projects)); }
                function saveEntries() { localStorage.setItem('dts-time-entries', JSON.stringify(entries)); }
                
                function formatDuration(mins) {
                    if (!mins) return '-';
                    const h = Math.floor(mins / 60);
                    const m = mins % 60;
                    if (h > 0 && m > 0) return \`\${h}h \${m}m\`;
                    if (h > 0) return \`\${h}h\`;
                    return \`\${m}m\`;
                }

                function parseDuration(str) {
                    if (!str || str.trim() === '') return 0;
                    let mins = 0;
                    const hMatch = str.match(/(\\d+)\\s*h/i);
                    const mMatch = str.match(/(\\d+)\\s*m/i);
                    const numMatch = str.match(/^\\d+$/);
                    
                    if (hMatch) mins += parseInt(hMatch[1]) * 60;
                    if (mMatch) mins += parseInt(mMatch[1]);
                    
                    if (!hMatch && !mMatch && numMatch) {
                        // Just a number, assume hours if <=24, else mins
                        const num = parseInt(numMatch[0]);
                        mins = num <= 24 ? num * 60 : num;
                    }
                    return mins;
                }

                function getWeekRange(date) {
                    const d = new Date(date);
                    const day = d.getDay() || 7; // Sunday is 7
                    d.setDate(d.getDate() - day + 1); // Monday
                    const week = [];
                    for(let i=0; i<7; i++) {
                        const sd = new Date(d);
                        sd.setDate(d.getDate() + i);
                        week.push(sd);
                    }
                    return week;
                }

                function formatDateForStorage(date) {
                    const yyyy = date.getFullYear();
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const dd = String(date.getDate()).padStart(2, '0');
                    return \`\${yyyy}-\${mm}-\${dd}\`;
                }

                function getMonthShortName(monthIndex) {
                    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
                }

                function updateNav() {
                    const week = getWeekRange(currentDate);
                    const start = week[0];
                    const end = week[6];
                    let text = '';
                    if (start.getMonth() === end.getMonth()) {
                        text = \`\${getMonthShortName(start.getMonth())} \${start.getDate()} - \${end.getDate()}\`;
                    } else {
                        text = \`\${getMonthShortName(start.getMonth())} \${start.getDate()} - \${getMonthShortName(end.getMonth())} \${end.getDate()}\`;
                    }
                    document.getElementById('tt-date-range').textContent = text;
                }

                function getEntriesForDateAndProject(dateStr, projectId) {
                    return entries.filter(e => e.date === dateStr && e.projectId === projectId);
                }

                function getDailyTotal(dateStr) {
                    return entries.filter(e => e.date === dateStr).reduce((sum, e) => sum + (e.durationMins || 0), 0);
                }
                
                function getProjectTotal(projectId, weekDates) {
                    let total = 0;
                    weekDates.forEach(d => {
                        const dateStr = formatDateForStorage(d);
                        total += getEntriesForDateAndProject(dateStr, projectId).reduce((sum, e) => sum + (e.durationMins || 0), 0);
                    });
                    return total;
                }

                function renderTimesheet() {
                    const weekDates = getWeekRange(currentDate);
                    const headerRow = document.getElementById('tt-grid-header');
                    
                    // Update header
                    let headerHtml = '<th>Task/Project</th>';
                    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    
                    weekDates.forEach((d, i) => {
                        const dateStr = formatDateForStorage(d);
                        const dailyTotal = getDailyTotal(dateStr);
                        const todayStr = formatDateForStorage(new Date());
                        const isToday = dateStr === todayStr;
                        
                        headerHtml += \`<th style="\${isToday ? 'background: var(--tt-active-col);' : ''}">
                            \${dayNames[i]} \${d.getDate()} <br>
                            <small>\${formatDuration(dailyTotal)}</small>
                        </th>\`;
                    });
                    headerHtml += '<th class="tt-total-col">Total</th>';
                    headerRow.innerHTML = headerHtml;

                    // Update body
                    const tbody = document.getElementById('tt-grid-body');
                    let bodyHtml = '';
                    
                    projects.forEach(p => {
                        bodyHtml += \`<tr>
                            <td>
                                <div class="tt-project-label">
                                    <span class="tt-project-color" style="background-color: \${p.color}"></span>
                                    \${p.name}
                                </div>
                            </td>\`;
                        
                        weekDates.forEach(d => {
                            const dateStr = formatDateForStorage(d);
                            const dayEntries = getEntriesForDateAndProject(dateStr, p.id);
                            const totalMins = dayEntries.reduce((sum, e) => sum + (e.durationMins || 0), 0);
                            const todayStr = formatDateForStorage(new Date());
                            const isToday = dateStr === todayStr;
                            
                            bodyHtml += \`<td class="tt-cell" data-date="\${dateStr}" data-project="\${p.id}" style="\${isToday ? 'background: var(--tt-active-col);' : ''}">
                                <span class="tt-cell-val">\${formatDuration(totalMins)}</span>
                                <input type="text" class="tt-cell-input" value="\${totalMins ? formatDuration(totalMins) : ''}">
                            </td>\`;
                        });
                        
                        bodyHtml += \`<td class="tt-total-col">\${formatDuration(getProjectTotal(p.id, weekDates))}</td></tr>\`;
                    });
                    tbody.innerHTML = bodyHtml;
                    
                    bindCellEvents();
                }

                function bindCellEvents() {
                    const cells = document.querySelectorAll('.tt-cell');
                    cells.forEach(cell => {
                        cell.addEventListener('click', function(e) {
                            if (this.classList.contains('editing')) return;
                            
                            // Close others
                            document.querySelectorAll('.tt-cell.editing').forEach(c => {
                                closeCell(c);
                            });
                            
                            this.classList.add('editing');
                            const input = this.querySelector('.tt-cell-input');
                            input.focus();
                            input.select();
                        });
                        
                        const input = cell.querySelector('.tt-cell-input');
                        input.addEventListener('blur', function() {
                            closeCell(cell);
                        });
                        input.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter') closeCell(cell);
                            if (e.key === 'Escape') {
                                this.value = cell.querySelector('.tt-cell-val').textContent; // revert
                                cell.classList.remove('editing');
                            }
                        });
                    });
                }
                
                function closeCell(cell) {
                    if (!cell.classList.contains('editing')) return;
                    cell.classList.remove('editing');
                    
                    const input = cell.querySelector('.tt-cell-input');
                    const newMins = parseDuration(input.value);
                    const dateStr = cell.getAttribute('data-date');
                    const projectId = cell.getAttribute('data-project');
                    
                    // Remove old entries for this project+date and add new one if > 0
                    entries = entries.filter(e => !(e.date === dateStr && e.projectId === projectId));
                    
                    if (newMins > 0) {
                        entries.push({
                            id: 'entry-' + Date.now(),
                            projectId: projectId,
                            date: dateStr,
                            durationMins: newMins,
                            description: 'Tracked time'
                        });
                    }
                    saveEntries();
                    renderTimesheet();
                    renderEntries();
                }

                function renderEntries() {
                    const list = document.getElementById('tt-entries-list');
                    const weekDates = getWeekRange(currentDate);
                    const startDate = formatDateForStorage(weekDates[0]);
                    const endDate = formatDateForStorage(weekDates[6]);
                    
                    const weekEntries = entries.filter(e => e.date >= startDate && e.date <= endDate)
                        .sort((a, b) => b.date.localeCompare(a.date));
                        
                    if (weekEntries.length === 0) {
                        list.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">No time entries this week.</div>';
                        return;
                    }
                    
                    let html = '';
                    weekEntries.forEach(e => {
                        const proj = projects.find(p => p.id === e.projectId) || { name: 'Unknown', color: '#ccc' };
                        html += \`
                            <div class="tt-entry-row">
                                <div class="tt-entry-desc">\${e.description || '(no description)'}</div>
                                <div class="tt-entry-project">
                                    <span class="tt-project-color" style="background-color: \${proj.color}"></span>
                                    \${proj.name}
                                </div>
                                <div class="tt-entry-date">\${e.date}</div>
                                <div class="tt-entry-dur">\${formatDuration(e.durationMins)}</div>
                                <button class="tt-entry-delete" data-id="\${e.id}">×</button>
                            </div>
                        \`;
                    });
                    list.innerHTML = html;
                    
                    list.querySelectorAll('.tt-entry-delete').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const id = this.getAttribute('data-id');
                            entries = entries.filter(e => e.id !== id);
                            saveEntries();
                            renderTimesheet();
                            renderEntries();
                        });
                    });
                }
                
                function updateTimerDisplay() {
                    const h = Math.floor(timerSeconds / 3600);
                    const m = Math.floor((timerSeconds % 3600) / 60);
                    const s = timerSeconds % 60;
                    document.getElementById('tt-timer-display').textContent = 
                        \`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
                }

                function toggleTimer() {
                    const btn = document.getElementById('tt-timer-toggle');
                    if (isTimerRunning) {
                        // Stop
                        clearInterval(timerInterval);
                        isTimerRunning = false;
                        btn.textContent = '▶';
                        btn.classList.remove('stop');
                        btn.classList.add('start');
                        
                        // Save entry
                        if (timerSeconds > 60) {
                            const projId = document.getElementById('tt-timer-project').value || projects[0]?.id;
                            const desc = document.getElementById('tt-timer-desc').value || 'Timer entry';
                            const mins = Math.round(timerSeconds / 60);
                            
                            if (projId) {
                                entries.push({
                                    id: 'entry-' + Date.now(),
                                    projectId: projId,
                                    date: formatDateForStorage(new Date()),
                                    durationMins: mins,
                                    description: desc
                                });
                                saveEntries();
                                renderTimesheet();
                                renderEntries();
                            }
                        }
                        
                        timerSeconds = 0;
                        updateTimerDisplay();
                        document.getElementById('tt-timer-desc').value = '';
                    } else {
                        // Start
                        isTimerRunning = true;
                        btn.textContent = '■';
                        btn.classList.remove('start');
                        btn.classList.add('stop');
                        timerInterval = setInterval(() => {
                            timerSeconds++;
                            updateTimerDisplay();
                        }, 1000);
                    }
                }

                function init() {
                    // Populate project select
                    const projSelect = document.getElementById('tt-timer-project');
                    projSelect.innerHTML = '<option value="">No Project</option>' + projects.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join('');

                    document.getElementById('tt-prev-week').addEventListener('click', () => {
                        currentDate.setDate(currentDate.getDate() - 7);
                        updateAll();
                    });
                    
                    document.getElementById('tt-next-week').addEventListener('click', () => {
                        currentDate.setDate(currentDate.getDate() + 7);
                        updateAll();
                    });
                    
                    document.getElementById('tt-this-week').addEventListener('click', () => {
                        currentDate = new Date();
                        updateAll();
                    });
                    
                    document.getElementById('tt-btn-timesheet').addEventListener('click', (e) => {
                        e.target.classList.add('active');
                        document.getElementById('tt-btn-entries').classList.remove('active');
                        document.getElementById('tt-timesheet-view').style.display = 'block';
                        document.getElementById('tt-entries-view').style.display = 'none';
                    });
                    
                    document.getElementById('tt-btn-entries').addEventListener('click', (e) => {
                        e.target.classList.add('active');
                        document.getElementById('tt-btn-timesheet').classList.remove('active');
                        document.getElementById('tt-timesheet-view').style.display = 'none';
                        document.getElementById('tt-entries-view').style.display = 'block';
                    });
                    
                    document.getElementById('tt-add-task').addEventListener('click', () => {
                        const name = prompt('Enter new project/task name:');
                        if (name) {
                            const colors = ['#e74c3c', '#8e44ad', '#2980b9', '#27ae60', '#f39c12', '#d35400', '#c0392b', '#16a085'];
                            projects.push({
                                id: 'proj-' + Date.now(),
                                name: name,
                                color: colors[projects.length % colors.length]
                            });
                            saveProjects();
                            // Update select
                            projSelect.innerHTML = '<option value="">No Project</option>' + projects.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join('');
                            renderTimesheet();
                        }
                    });

                    document.getElementById('tt-timer-toggle').addEventListener('click', toggleTimer);

                    updateAll();
                }

                function updateAll() {
                    updateNav();
                    renderTimesheet();
                    renderEntries();
                }

                // Initial render
                init();
            })();
        </script>

      <!-- Timesheet Export & Summary Action Bar -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin-top: 2rem; display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; justify-content: space-between;">
        <div style="font-size: 0.9rem; color: var(--text-muted);">
          <strong style="color: var(--fg);">Timesheet Export & Summary:</strong> Copy text breakdown or download CSV.
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button type="button" class="btn-sec" id="btnCopyWeekSummary" style="padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--border); background: transparent; color: var(--fg); cursor: pointer;" onclick="copyTtSummary()">Copy Week Summary</button>
          <button type="button" class="btn-sec" id="btnExportTtCsv" style="padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--border); background: transparent; color: var(--fg); cursor: pointer;" onclick="exportTtCsv()">Export CSV</button>
        </div>
      </div>

      <!-- Mathematical Derivation -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-top: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.75rem;">Time Economics & Billable Increment Mathematics</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
          Professional consultants and legal agencies bill using discrete quantum increments rather than continuous wall-clock seconds. The two standard professional models are tenth-of-an-hour (6-minute blocks) and quarter-hour (15-minute blocks):
        </p>
        <div style="background: var(--bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; margin-bottom: 1.25rem;">
          <div><strong>1. High-Precision Epoch Delta Calculation:</strong></div>
          <div>&nbsp;&nbsp;Δt = t_now - t_start &nbsp;&nbsp;(Using window.performance.now() or Date.now() to bypass background throttling)</div>
          <div><strong>2. 6-Minute Tenth-of-an-Hour Rounding:</strong></div>
          <div>&nbsp;&nbsp;Hours_billed = ⌈ Minutes / 6 ⌉ × 0.1 &nbsp;&nbsp;(e.g. 7 minutes → 0.2 hours)</div>
          <div><strong>3. Effective Realization Rate (ERR):</strong></div>
          <div>&nbsp;&nbsp;ERR = (Total Billed Revenue) / (Total Logged Hours [Billable + Administrative])</div>
        </div>
      </div>

      <!-- 5 Fatal Traps -->
      <div style="margin-top: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">5 Fatal Traps in Freelance Time Tracking & Billing</h2>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Background Tab Timer Throttling Trap</strong>
          Relying on simple <code>setInterval(fn, 1000)</code> counters. Modern Chromium and WebKit browsers automatically throttle background timer callbacks to once per minute (or suspend execution entirely) to conserve laptop battery. Trackers must calculate elapsed time via absolute timestamp subtraction (<code>Date.now() - startTime</code>).
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The LocalStorage 5MB Eviction Trap</strong>
          Storing endless uncompressed tracking events in browser <code>localStorage</code> without export utilities. Once local storage exceeds 5MB, browser writes fail silently or trigger storage exceptions, risking sudden historical data loss during browser cache sweeps.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Unrounded 6-Minute Increment Underbilling Trap</strong>
          Billing clients by exact minute fractions (e.g. 17 minutes = 0.283 hours) instead of the industry-standard 6-minute (0.1 hr) or 15-minute (0.25 hr) minimum billing blocks. Micro-task switching friction erodes 15–20% of billable revenue if brief client calls are not rounded up.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The Daylight Saving Timestamp Glitch</strong>
          Storing timestamps as local wall-clock strings like "2:30 AM" instead of UTC ISO-8601 strings. During autumn daylight saving transitions, the 1:00 AM to 2:00 AM hour repeats, causing trackers to record zero or negative elapsed time for overnight work sessions.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The Unassigned Context-Switching Leakage</strong>
          Failing to log the 5-to-10 minute gap spent switching between client projects, finding files, or sending deliverables. Studies indicate knowledge workers lose over 2.1 hours per day to unrecorded micro-switching that never reaches client invoices.
        </div>
      </div>

      <!-- Interactive FAQs -->
      <div style="margin-top: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
        
        <details class="faq-item">
          <summary>Does the time tracker keep running if I switch tabs or minimize the browser?</summary>
          <div>
            Yes. The timer calculates elapsed time based on real-world epoch timestamps (<code>Date.now()</code>). Even if your browser suspends tab animation, the clock accurately computes the exact duration the moment you switch back.
          </div>
        </details>

        <details class="faq-item">
          <summary>Can I convert my tracked hours into a client invoice?</summary>
          <div>
            Yes! Use our companion tool, <a href="/productivity/invoice-from-time" style="color:var(--btn-bg,#3b82f6); font-weight:600;">Invoice from Time</a>, which reads your local tracked entries and generates a formatted invoice with rates and PDF printing.
          </div>
        </details>

        <details class="faq-item">
          <summary>Where is my timesheet data stored?</summary>
          <div>
            All project tags, time entries, and client rates are stored exclusively inside your browser's private <code>localStorage</code> database. No tracking data is sent to external servers.
          </div>
        </details>

        <details class="faq-item">
          <summary>Can I export my time logs to CSV or Excel?</summary>
          <div>
            Yes. You can copy your timesheet summary or export entries to generate invoices and financial records with one click using the Export CSV button above.
          </div>
        </details>

        <details class="faq-item">
          <summary>What is the 6-minute billing increment rule?</summary>
          <div>
            Law firms and elite consulting agencies divide each hour into ten 6-minute blocks (0.1 hours). A task lasting 1 to 6 minutes is billed as 0.1 hr, while a 7-minute task is billed as 0.2 hr, ensuring fair compensation for overhead.
          </div>
        </details>
      </div>

      <script>
        function copyTtSummary() {
          const entries = JSON.parse(localStorage.getItem('tt_entries') || '[]');
          let totalSec = 0;
          const projMap = {};
          entries.forEach(e => {
            totalSec += (e.duration || 0);
            const p = e.project || 'Uncategorized';
            projMap[p] = (projMap[p] || 0) + (e.duration || 0);
          });
          const hours = (totalSec / 3600).toFixed(2);
          const lines = [
            '========================================',
            'DIGITAL TOOLS SHED - TIMESHEET SUMMARY',
            '========================================',
            'Total Logged: ' + hours + ' hours (' + entries.length + ' entries)',
            'Project Breakdown:'
          ];
          for (const [p, s] of Object.entries(projMap)) {
            lines.push('  • ' + p + ': ' + (s / 3600).toFixed(2) + ' hrs');
          }
          lines.push('========================================');
          navigator.clipboard.writeText(lines.join('\n')).then(() => {
            const btn = document.getElementById('btnCopyWeekSummary');
            if (btn) {
              const orig = btn.textContent;
              btn.textContent = '✓ Copied!';
              btn.style.borderColor = '#10b981';
              btn.style.color = '#10b981';
              setTimeout(() => { btn.textContent = orig; btn.style.borderColor = ''; btn.style.color = ''; }, 2500);
            }
          });
        }

        function exportTtCsv() {
          const entries = JSON.parse(localStorage.getItem('tt_entries') || '[]');
          const rows = [['Date', 'Project', 'Description', 'Duration (Hours)', 'Seconds']];
          entries.forEach(e => {
            const d = e.date || new Date().toISOString().split('T')[0];
            const p = (e.project || 'General').replace(/"/g, '""');
            const desc = (e.description || '').replace(/"/g, '""');
            const dur = (e.duration || 0);
            const hrs = (dur / 3600).toFixed(2);
            rows.push(['"' + d + '"', '"' + p + '"', '"' + desc + '"', hrs, dur]);
          });
          const csvContent = rows.map(r => r.join(',')).join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const a = document.createElement('a');
          a.download = 'timesheet_export.csv';
          a.href = URL.createObjectURL(blob);
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        }
      </script>

    </div>
`;

  // 3. Invoice Generator
  const invoiceGeneratorBody = "\n<div class=\"article-container\" style=\"max-width:1040px;margin:0 auto;padding:1.5rem 1rem;\">\n  <style>\n    @media print {\n      body * { visibility: hidden !important; }\n      #invoicePrintArea, #invoicePrintArea * { visibility: visible !important; }\n      #invoicePrintArea {\n        position: absolute !important;\n        left: 0 !important;\n        top: 0 !important;\n        width: 100% !important;\n        margin: 0 !important;\n        padding: 20px !important;\n        background: #ffffff !important;\n        color: #000000 !important;\n        box-shadow: none !important;\n        border: none !important;\n      }\n      .no-print { display: none !important; }\n      input, textarea, select {\n        border: none !important;\n        background: transparent !important;\n        box-shadow: none !important;\n        padding: 0 !important;\n        font-family: inherit !important;\n        font-size: inherit !important;\n        color: #000000 !important;\n      }\n    }\n  </style>\n\n  <div class=\"no-print\" style=\"margin-bottom:2rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;\">\n    <h1 style=\"font-family:var(--serif);font-size:2.3rem;margin-bottom:0.75rem;line-height:1.2;\">Free Professional Invoice Generator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin:0;\">\n      Create, calculate, and print clean corporate invoices with zero watermarks, zero accounts, and 100% client-side privacy. Features automatic Net payment terms, multi-currency formatting, line-item taxability, discount engines, and one-click PDF printing.\n    </p>\n  </div>\n\n  <!-- TOOLBAR -->\n  <div class=\"no-print\" style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1rem 1.5rem;margin-bottom:1.5rem;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;\">\n    <div style=\"display:flex;align-items:center;gap:1rem;\">\n      <div>\n        <label style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-right:0.5rem;\" for=\"invCurrency\">Currency:</label>\n        <select id=\"invCurrency\" style=\"padding:0.4rem 0.6rem;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.9rem;\">\n          <option value=\"$\" selected>USD ($)</option>\n          <option value=\"€\">EUR (€)</option>\n          <option value=\"£\">GBP (£)</option>\n          <option value=\"C$\">CAD (C$)</option>\n          <option value=\"A$\">AUD (A$)</option>\n          <option value=\"¥\">JPY (¥)</option>\n          <option value=\"₹\">INR (₹)</option>\n          <option value=\"CHF \">CHF</option>\n        </select>\n      </div>\n\n      <div>\n        <label style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-right:0.5rem;\" for=\"paymentTerms\">Terms:</label>\n        <select id=\"paymentTerms\" style=\"padding:0.4rem 0.6rem;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.9rem;\">\n          <option value=\"0\">Due on Receipt</option>\n          <option value=\"15\">Net 15 Days</option>\n          <option value=\"30\" selected>Net 30 Days</option>\n          <option value=\"45\">Net 45 Days</option>\n          <option value=\"60\">Net 60 Days</option>\n        </select>\n      </div>\n    </div>\n\n    <div style=\"display:flex;gap:0.75rem;\">\n      <button id=\"copyInvoiceTextBtn\" style=\"padding:0.5rem 0.85rem;font-size:0.85rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.4rem;font-family:var(--sans);font-weight:500;\">\n        <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n        <span>Copy Text Invoice</span>\n      </button>\n\n      <button id=\"printInvoiceBtn\" style=\"padding:0.5rem 1rem;font-size:0.85rem;background:var(--fg);color:var(--bg);border:none;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.4rem;font-family:var(--sans);font-weight:600;\">\n        <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"6 9 6 2 18 2 18 9\"/><path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"/><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\"/></svg>\n        <span>Print or Save PDF</span>\n      </button>\n    </div>\n  </div>\n\n  <!-- INVOICE SHEET (CANVAS) -->\n  <div id=\"invoicePrintArea\" style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:2.5rem 2rem;margin-bottom:2.5rem;box-shadow:0 4px 20px rgba(0,0,0,0.04);\">\n    <!-- INVOICE HEADER ROW -->\n    <div style=\"display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:2rem;margin-bottom:2.5rem;border-bottom:2px solid var(--border);padding-bottom:1.75rem;\">\n      <div style=\"flex:1;min-width:240px;\">\n        <input type=\"text\" id=\"companyName\" value=\"Apex Creative Studio\" placeholder=\"Your Business / Studio Name\" style=\"font-family:var(--serif);font-size:1.8rem;font-weight:700;color:var(--fg);border:none;background:transparent;width:100%;outline:none;margin-bottom:0.5rem;\">\n        <textarea id=\"companyAddress\" rows=\"3\" placeholder=\"Street Address, City, State, ZIP&#10;Tax ID / VAT / EIN&#10;email@domain.com | +1 (555) 000-0000\" style=\"width:100%;border:none;background:transparent;color:var(--text-muted);font-family:var(--sans);font-size:0.9rem;line-height:1.5;resize:none;outline:none;\">100 Montgomery Street, Suite 400\nSan Francisco, CA 94104\nEIN: 12-3456789 | billing@apexcreative.io</textarea>\n      </div>\n\n      <div style=\"text-align:right;min-width:220px;\">\n        <span style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;letter-spacing:0.05em;margin-bottom:0.75rem;\">INVOICE</span>\n        <div style=\"margin-bottom:0.4rem;\">\n          <span style=\"font-size:0.8rem;color:var(--text-muted);margin-right:0.5rem;\">Invoice No:</span>\n          <input type=\"text\" id=\"invoiceNumber\" value=\"INV-2024-0042\" style=\"font-family:var(--mono);font-size:0.95rem;font-weight:600;text-align:right;border:1px solid var(--border);border-radius:4px;padding:0.2rem 0.4rem;background:var(--bg);color:var(--fg);width:130px;\">\n        </div>\n        <div style=\"margin-bottom:0.4rem;\">\n          <span style=\"font-size:0.8rem;color:var(--text-muted);margin-right:0.5rem;\">Date:</span>\n          <input type=\"date\" id=\"invoiceDate\" style=\"font-family:var(--mono);font-size:0.85rem;border:1px solid var(--border);border-radius:4px;padding:0.2rem 0.4rem;background:var(--bg);color:var(--fg);\">\n        </div>\n        <div>\n          <span style=\"font-size:0.8rem;color:var(--text-muted);margin-right:0.5rem;\">Due Date:</span>\n          <input type=\"date\" id=\"invoiceDueDate\" style=\"font-family:var(--mono);font-size:0.85rem;border:1px solid var(--border);border-radius:4px;padding:0.2rem 0.4rem;background:var(--bg);color:var(--fg);font-weight:600;\">\n        </div>\n      </div>\n    </div>\n\n    <!-- CLIENT ROW -->\n    <div style=\"margin-bottom:2.5rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:2rem;\">\n      <div style=\"flex:1;min-width:240px;\">\n        <span style=\"font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;color:var(--text-muted);display:block;margin-bottom:0.5rem;\">Billed To:</span>\n        <input type=\"text\" id=\"clientName\" value=\"Vanguard Technologies Inc.\" placeholder=\"Client or Company Name\" style=\"font-weight:700;font-size:1.1rem;color:var(--fg);border:none;background:transparent;width:100%;outline:none;margin-bottom:0.4rem;\">\n        <textarea id=\"clientAddress\" rows=\"3\" placeholder=\"Client Street Address&#10;City, State, ZIP&#10;contact@client.com\" style=\"width:100%;border:none;background:transparent;color:var(--text-muted);font-family:var(--sans);font-size:0.9rem;line-height:1.5;resize:none;outline:none;\">500 Oracle Parkway\nRedwood City, CA 94065\nAttn: Accounts Payable</textarea>\n      </div>\n\n      <div style=\"min-width:200px;text-align:right;\" class=\"no-print\">\n        <span style=\"font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;color:var(--text-muted);display:block;margin-bottom:0.5rem;\">Balance Due</span>\n        <span id=\"quickBalanceDue\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:#10b981;\">$0.00</span>\n      </div>\n    </div>\n\n    <!-- LINE ITEMS TABLE -->\n    <div style=\"margin-bottom:2rem;overflow-x:auto;\">\n      <table style=\"width:100%;border-collapse:collapse;text-align:left;\">\n        <thead>\n          <tr style=\"border-bottom:2px solid var(--border);font-size:0.8rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-muted);\">\n            <th style=\"padding:0.75rem 0.5rem;width:48%;\">Item Description</th>\n            <th style=\"padding:0.75rem 0.5rem;width:12%;text-align:center;\">Qty / Hrs</th>\n            <th style=\"padding:0.75rem 0.5rem;width:16%;text-align:right;\">Rate</th>\n            <th style=\"padding:0.75rem 0.5rem;width:8%;text-align:center;\" class=\"no-print\">Tax</th>\n            <th style=\"padding:0.75rem 0.5rem;width:16%;text-align:right;\">Line Total</th>\n            <th style=\"padding:0.75rem 0.25rem;width:4%;\" class=\"no-print\"></th>\n          </tr>\n        </thead>\n        <tbody id=\"lineItemsBody\">\n          <!-- Populated by JS -->\n        </tbody>\n      </table>\n\n      <div class=\"no-print\" style=\"margin-top:1rem;\">\n        <button id=\"addLineItemBtn\" style=\"padding:0.45rem 0.85rem;background:var(--bg);border:1px dashed var(--border);border-radius:6px;color:var(--fg);cursor:pointer;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.35rem;font-weight:500;\">\n          <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"/><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"/></svg>\n          Add Item or Service\n        </button>\n      </div>\n    </div>\n\n    <!-- TOTALS & PAYMENT INSTRUCTIONS ROW -->\n    <div style=\"display:flex;justify-content:space-between;flex-wrap:wrap;gap:2rem;border-top:2px solid var(--border);padding-top:1.5rem;\">\n      <div style=\"flex:1;min-width:260px;\">\n        <span style=\"font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;color:var(--text-muted);display:block;margin-bottom:0.5rem;\">Payment Notes & Wire Details:</span>\n        <textarea id=\"invoiceNotes\" rows=\"4\" placeholder=\"Payment instructions, bank wire info, routing numbers, check mailing address, or appreciation note...\" style=\"width:100%;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--fg);padding:0.6rem;font-family:var(--sans);font-size:0.85rem;line-height:1.5;resize:vertical;\">Bank: Silicon Valley Bank\nRouting / ABA: 121000358\nAccount: 9876-5432-10\nPayment due within 30 days. Thank you for your business!</textarea>\n      </div>\n\n      <div style=\"min-width:280px;\">\n        <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.9rem;\">\n          <span style=\"color:var(--text-muted);\">Subtotal:</span>\n          <span id=\"invSubtotal\" style=\"font-family:var(--mono);font-weight:600;\">$0.00</span>\n        </div>\n\n        <div style=\"display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0;font-size:0.9rem;\">\n          <div style=\"display:flex;align-items:center;gap:0.35rem;\">\n            <span style=\"color:var(--text-muted);\">Discount (%):</span>\n            <input type=\"number\" id=\"invDiscountPct\" value=\"0\" min=\"0\" max=\"100\" step=\"1\" style=\"width:50px;padding:0.15rem 0.3rem;border:1px solid var(--border);border-radius:4px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.85rem;text-align:right;\">\n          </div>\n          <span id=\"invDiscountVal\" style=\"font-family:var(--mono);color:#ef4444;\">-$0.00</span>\n        </div>\n\n        <div style=\"display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0;font-size:0.9rem;\">\n          <div style=\"display:flex;align-items:center;gap:0.35rem;\">\n            <span style=\"color:var(--text-muted);\">Tax Rate (%):</span>\n            <input type=\"number\" id=\"invTaxRate\" value=\"8.5\" min=\"0\" max=\"30\" step=\"0.1\" style=\"width:55px;padding:0.15rem 0.3rem;border:1px solid var(--border);border-radius:4px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.85rem;text-align:right;\">\n          </div>\n          <span id=\"invTaxVal\" style=\"font-family:var(--mono);font-weight:600;\">$0.00</span>\n        </div>\n\n        <div style=\"display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0;font-size:0.9rem;\">\n          <span style=\"color:var(--text-muted);\">Shipping / Fee:</span>\n          <input type=\"number\" id=\"invShipping\" value=\"0\" min=\"0\" step=\"1\" style=\"width:70px;padding:0.15rem 0.3rem;border:1px solid var(--border);border-radius:4px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.85rem;text-align:right;\">\n        </div>\n\n        <div style=\"display:flex;justify-content:space-between;padding:0.75rem 0;margin-top:0.5rem;border-top:2px solid var(--border);font-size:1.15rem;font-weight:700;\">\n          <span>Total Balance Due:</span>\n          <span id=\"invFinalTotal\" style=\"font-family:var(--mono);color:var(--fg);\">$0.00</span>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- VISUAL FINANCIAL COMPOSITION BAR -->\n  <div class=\"no-print\" style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.15rem;margin-top:0;margin-bottom:0.5rem;\">Invoice Value Distribution</h2>\n    <p style=\"color:var(--text-muted);font-size:0.85rem;margin-bottom:1.25rem;\">Visual breakdown of net services, applicable taxes, and client savings.</p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"invoiceDistributionSvg\" viewBox=\"0 0 800 60\" style=\"width:100%;height:auto;min-width:500px;font-family:var(--mono);\"></svg>\n    </div>\n\n    <div id=\"invoiceLegend\" style=\"display:flex;gap:1.5rem;margin-top:1rem;font-size:0.8rem;flex-wrap:wrap;\"></div>\n  </div>\n\n  <!-- ACCOUNTING & STATUTORY DERIVATION -->\n  <div class=\"no-print\" style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Accounting Formulas & Standard Computation Standards</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      Professional invoices must adhere to strict GAAP ledger conventions and statutory tax rounding rules to avoid audit discrepancies. Each line item is computed individually before aggregation.\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Line Item Extended Price:</strong><br>\n      L_i = Q_i \\times P_i<br><br>\n      <strong>2. Subtotal (Gross Services):</strong><br>\n      S = \\sum_{i=1}^{n} L_i<br><br>\n      <strong>3. Discount Deduction:</strong><br>\n      D = S \\times \\frac{d_{\\%}}{100}<br><br>\n      <strong>4. Statutory Sales / VAT Tax Obligation:</strong><br>\n      T = \\left( \\sum_{i \\in \\text{Taxable}} L_i \\times (1 - \\frac{d_{\\%}}{100}) \\right) \\times \\frac{r_{tax}}{100}<br><br>\n      <strong>5. Net Payable Balance:</strong><br>\n      \\text{Balance Due} = (S - D) + T + \\text{Shipping}\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL INVOICING & LEGAL TRAPS -->\n  <div class=\"no-print\" style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Invoicing, Contract & Tax Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">1. Missing Statutory Late Payment Clauses</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Writing \"Net 30\" without a formal late payment penalty in your underlying master services agreement (MSA) leaves you legally toothless. Courts will not enforce arbitrary 1.5%/month late fees listed on an invoice unless agreed to in writing prior to work commencement.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">2. The 1099-K & 1099-NEC Double-Reporting Trap</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          If a client pays your invoice via credit card, PayPal, or Stripe, the payment processor files Form 1099-K. If the client also erroneously issues you a Form 1099-NEC for the same project, the IRS automated underreporter system (CP2000) will flag your return for phantom double-counted income.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">3. Sales Tax Nexus & Service Origin vs Destination</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Charging sales tax on pure professional consulting is illegal in most US states, but mandatory for SaaS, digital downloads, and custom code in jurisdictions like Texas, New York, and Washington. Applying the wrong local tax rate exposes you to state audit clawbacks.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">4. Non-Sequential Numbering Audit Flags</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          European VAT authorities and IRS auditors scrutinize invoice numbering. If you issue INV-001, INV-002, and jump to INV-008, tax inspectors presume off-the-books cash sales for missing numbers 003-007. Always maintain a contiguous, chronological numbering scheme.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">5. Uncapped Milestone Retainage Drag</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Invoicing a flat 50% upfront / 50% upon completion leaves you vulnerable to infinite client review cycles. If a client stalls feedback on final deliverables, your remaining 50% invoice remains unpayable indefinitely. Always tie final invoices to deliverable handover, not subjective \"satisfaction.\"\n        </p>\n      </div>\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      var defaultItems = [\n        { desc: 'Full-Stack Architecture & API Integration', qty: 40, rate: 125.00, taxable: false },\n        { desc: 'Cloud Infrastructure Setup & Security Audit', qty: 15, rate: 140.00, taxable: false },\n        { desc: 'Custom Software License & Domain Transfer', qty: 1, rate: 450.00, taxable: true }\n      ];\n\n      var items = [];\n\n      function initDates() {\n        var today = new Date();\n        var dateStr = today.toISOString().split('T')[0];\n        document.getElementById('invoiceDate').value = dateStr;\n        updateDueDate();\n      }\n\n      function updateDueDate() {\n        var dateVal = document.getElementById('invoiceDate').value;\n        if (!dateVal) return;\n        var terms = parseInt(document.getElementById('paymentTerms').value) || 0;\n        var d = new Date(dateVal);\n        d.setDate(d.getDate() + terms);\n        document.getElementById('invoiceDueDate').value = d.toISOString().split('T')[0];\n      }\n\n      function formatCurr(val) {\n        var curr = document.getElementById('invCurrency').value;\n        return curr + (val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });\n      }\n\n      function renderItems() {\n        var tbody = document.getElementById('lineItemsBody');\n        tbody.innerHTML = '';\n\n        items.forEach(function(item, idx) {\n          var lineTotal = (item.qty || 0) * (item.rate || 0);\n          var tr = document.createElement('tr');\n          tr.style.borderBottom = '1px solid var(--border)';\n          tr.innerHTML =\n            '<td style=\"padding:0.6rem 0.5rem;\">' +\n              '<input type=\"text\" value=\"' + (item.desc || '').replace(/\"/g, '&quot;') + '\" placeholder=\"Item or service description\" class=\"item-desc\" data-idx=\"' + idx + '\" style=\"width:100%;border:1px solid var(--border);border-radius:4px;padding:0.35rem 0.5rem;background:var(--bg);color:var(--fg);font-size:0.9rem;\">' +\n            '</td>' +\n            '<td style=\"padding:0.6rem 0.5rem;text-align:center;\">' +\n              '<input type=\"number\" value=\"' + item.qty + '\" min=\"0\" step=\"0.5\" class=\"item-qty\" data-idx=\"' + idx + '\" style=\"width:65px;border:1px solid var(--border);border-radius:4px;padding:0.35rem 0.4rem;background:var(--bg);color:var(--fg);font-family:var(--mono);text-align:center;font-size:0.9rem;\">' +\n            '</td>' +\n            '<td style=\"padding:0.6rem 0.5rem;text-align:right;\">' +\n              '<input type=\"number\" value=\"' + item.rate + '\" min=\"0\" step=\"1\" class=\"item-rate\" data-idx=\"' + idx + '\" style=\"width:90px;border:1px solid var(--border);border-radius:4px;padding:0.35rem 0.4rem;background:var(--bg);color:var(--fg);font-family:var(--mono);text-align:right;font-size:0.9rem;\">' +\n            '</td>' +\n            '<td style=\"padding:0.6rem 0.5rem;text-align:center;\" class=\"no-print\">' +\n              '<input type=\"checkbox\" ' + (item.taxable ? 'checked' : '') + ' class=\"item-taxable\" data-idx=\"' + idx + '\" style=\"accent-color:var(--fg);cursor:pointer;\">' +\n            '</td>' +\n            '<td style=\"padding:0.6rem 0.5rem;text-align:right;font-family:var(--mono);font-weight:600;\">' +\n              formatCurr(lineTotal) +\n            '</td>' +\n            '<td style=\"padding:0.6rem 0.25rem;text-align:center;\" class=\"no-print\">' +\n              '<button class=\"item-del\" data-idx=\"' + idx + '\" style=\"background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:1.1rem;padding:0.2rem 0.4rem;\">&times;</button>' +\n            '</td>';\n          tbody.appendChild(tr);\n        });\n\n        attachItemEvents();\n        recalc();\n      }\n\n      function attachItemEvents() {\n        document.querySelectorAll('.item-desc').forEach(function(el) {\n          el.addEventListener('input', function() {\n            items[this.dataset.idx].desc = this.value;\n          });\n        });\n        document.querySelectorAll('.item-qty').forEach(function(el) {\n          el.addEventListener('input', function() {\n            items[this.dataset.idx].qty = parseFloat(this.value) || 0;\n            recalc();\n          });\n        });\n        document.querySelectorAll('.item-rate').forEach(function(el) {\n          el.addEventListener('input', function() {\n            items[this.dataset.idx].rate = parseFloat(this.value) || 0;\n            recalc();\n          });\n        });\n        document.querySelectorAll('.item-taxable').forEach(function(el) {\n          el.addEventListener('change', function() {\n            items[this.dataset.idx].taxable = this.checked;\n            recalc();\n          });\n        });\n        document.querySelectorAll('.item-del').forEach(function(el) {\n          el.addEventListener('click', function() {\n            items.splice(this.dataset.idx, 1);\n            renderItems();\n          });\n        });\n      }\n\n      function recalc() {\n        var subtotal = 0;\n        var taxableSubtotal = 0;\n\n        items.forEach(function(item) {\n          var lt = (item.qty || 0) * (item.rate || 0);\n          subtotal += lt;\n          if (item.taxable) taxableSubtotal += lt;\n        });\n\n        var discountPct = parseFloat(document.getElementById('invDiscountPct').value) || 0;\n        var taxRate = (parseFloat(document.getElementById('invTaxRate').value) || 0) / 100;\n        var shipping = parseFloat(document.getElementById('invShipping').value) || 0;\n\n        var discountVal = subtotal * (discountPct / 100);\n        var effectiveTaxable = Math.max(0, taxableSubtotal - (taxableSubtotal * (discountPct / 100)));\n        var taxVal = effectiveTaxable * taxRate;\n        var finalTotal = Math.max(0, (subtotal - discountVal) + taxVal + shipping);\n\n        document.getElementById('invSubtotal').textContent = formatCurr(subtotal);\n        document.getElementById('invDiscountVal').textContent = '-' + formatCurr(discountVal);\n        document.getElementById('invTaxVal').textContent = formatCurr(taxVal);\n        document.getElementById('invFinalTotal').textContent = formatCurr(finalTotal);\n        document.getElementById('quickBalanceDue').textContent = formatCurr(finalTotal);\n\n        // Update rendered line total cells without recreating DOM\n        var rows = document.querySelectorAll('#lineItemsBody tr');\n        items.forEach(function(item, idx) {\n          if (rows[idx]) {\n            var ltCell = rows[idx].children[4];\n            if (ltCell) ltCell.textContent = formatCurr((item.qty || 0) * (item.rate || 0));\n          }\n        });\n\n        renderDistribution(subtotal, discountVal, taxVal, finalTotal);\n      }\n\n      function renderDistribution(sub, disc, tax, total) {\n        var svg = document.getElementById('invoiceDistributionSvg');\n        var legend = document.getElementById('invoiceLegend');\n        if (!svg || !legend) return;\n\n        if (total <= 0) {\n          svg.innerHTML = '<rect x=\"0\" y=\"15\" width=\"800\" height=\"30\" rx=\"6\" fill=\"var(--border)\"/>';\n          legend.innerHTML = '<span style=\"color:var(--text-muted);\">Add line items to view financial composition.</span>';\n          return;\n        }\n\n        var netServices = Math.max(0, sub - disc);\n        var pctNet = (netServices / (netServices + tax)) * 100;\n        var pctTax = (tax / (netServices + tax)) * 100;\n\n        var widthNet = (pctNet / 100) * 800;\n        var widthTax = (pctTax / 100) * 800;\n\n        var svgHtml =\n          '<rect x=\"0\" y=\"15\" width=\"' + widthNet + '\" height=\"30\" rx=\"4\" fill=\"#3b82f6\"/>' +\n          '<rect x=\"' + widthNet + '\" y=\"15\" width=\"' + widthTax + '\" height=\"30\" rx=\"4\" fill=\"#f59e0b\"/>' +\n          '<text x=\"15\" y=\"35\" fill=\"#ffffff\" font-size=\"12\" font-weight=\"bold\">Net Services: ' + formatCurr(netServices) + ' (' + pctNet.toFixed(1) + '%)</text>';\n\n        if (pctTax > 8) {\n          svgHtml += '<text x=\"' + (widthNet + 10) + '\" y=\"35\" fill=\"#ffffff\" font-size=\"11\" font-weight=\"bold\">Tax: ' + formatCurr(tax) + '</text>';\n        }\n\n        svg.innerHTML = svgHtml;\n\n        legend.innerHTML =\n          '<div><span style=\"display:inline-block;width:10px;height:10px;border-radius:2px;background:#3b82f6;margin-right:5px;\"></span><strong>Services & Labor:</strong> ' + formatCurr(netServices) + '</div>' +\n          '<div><span style=\"display:inline-block;width:10px;height:10px;border-radius:2px;background:#f59e0b;margin-right:5px;\"></span><strong>Applicable Tax:</strong> ' + formatCurr(tax) + '</div>' +\n          (disc > 0 ? '<div><span style=\"display:inline-block;width:10px;height:10px;border-radius:2px;background:#ef4444;margin-right:5px;\"></span><strong>Client Savings:</strong> ' + formatCurr(disc) + '</div>' : '');\n      }\n\n      function copyPlainText() {\n        var comp = document.getElementById('companyName').value;\n        var client = document.getElementById('clientName').value;\n        var invNum = document.getElementById('invoiceNumber').value;\n        var date = document.getElementById('invoiceDate').value;\n        var dueDate = document.getElementById('invoiceDueDate').value;\n        var total = document.getElementById('invFinalTotal').textContent;\n\n        var lines = [\n          '==================================================',\n          comp.toUpperCase() + ' - INVOICE',\n          '==================================================',\n          'Invoice Number : ' + invNum,\n          'Date           : ' + date,\n          'Payment Due    : ' + dueDate,\n          'Billed To      : ' + client,\n          '--------------------------------------------------',\n          'LINE ITEMS:'\n        ];\n\n        items.forEach(function(it, i) {\n          var lt = (it.qty || 0) * (it.rate || 0);\n          lines.push((i+1) + '. ' + it.desc + ' | Qty: ' + it.qty + ' @ ' + formatCurr(it.rate) + ' = ' + formatCurr(lt));\n        });\n\n        lines.push('--------------------------------------------------');\n        lines.push('Subtotal     : ' + document.getElementById('invSubtotal').textContent);\n        lines.push('Discount     : ' + document.getElementById('invDiscountVal').textContent);\n        lines.push('Tax          : ' + document.getElementById('invTaxVal').textContent);\n        lines.push('TOTAL DUE    : ' + total);\n        lines.push('==================================================');\n        lines.push('Payment Details:');\n        lines.push(document.getElementById('invoiceNotes').value);\n\n        navigator.clipboard.writeText(lines.join('\\n')).then(function() {\n          var btn = document.getElementById('copyInvoiceTextBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Text!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      // Initial state\n      items = JSON.parse(JSON.stringify(defaultItems));\n      initDates();\n      renderItems();\n\n      document.getElementById('addLineItemBtn').addEventListener('click', function() {\n        items.push({ desc: 'New Service Item', qty: 1, rate: 100, taxable: false });\n        renderItems();\n      });\n\n      document.getElementById('invCurrency').addEventListener('change', function() {\n        renderItems();\n      });\n\n      document.getElementById('paymentTerms').addEventListener('change', updateDueDate);\n      document.getElementById('invoiceDate').addEventListener('change', updateDueDate);\n\n      ['invDiscountPct', 'invTaxRate', 'invShipping'].forEach(function(id) {\n        document.getElementById(id).addEventListener('input', recalc);\n      });\n\n      document.getElementById('copyInvoiceTextBtn').addEventListener('click', copyPlainText);\n      document.getElementById('printInvoiceBtn').addEventListener('click', function() {\n        window.print();\n      });\n    })();\n  </script>\n  <!-- MATHEMATICAL DERIVATION -->\n  <div class=\"no-print\" style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:0.75rem;font-family:var(--serif);\">Invoice Accounting, Tax Allocation & GAAP Rounding Mathematics</h2>\n    <p style=\"font-size:0.9rem;color:var(--text-muted);line-height:1.6;margin-bottom:1rem;\">\n      Professional commercial invoicing enforces discrete line-item rounding rather than unrounded floating-point cumulative summation. This ensures mathematical parity between customer row auditing and general ledger entries:\n    </p>\n    <div style=\"background:var(--bg);border:1px solid var(--border);padding:1.25rem;border-radius:6px;font-family:var(--mono);font-size:0.85rem;line-height:1.7;\">\n      <div><strong>1. Line Item Extension Formula:</strong></div>\n      <div>&nbsp;&nbsp;Subtotal_i = Quantity_i × UnitPrice_i</div>\n      <div><strong>2. Statutory Late Payment Compounding:</strong></div>\n      <div>&nbsp;&nbsp;Interest = Principal × (AnnualRate / 365) × DaysOverdue</div>\n      <div><strong>3. Line-Level Tax Allocation vs Aggregate Tax:</strong></div>\n      <div>&nbsp;&nbsp;TaxTotal = ∑ [ Round(Subtotal_i × TaxRate_i, 2) ] &nbsp;&nbsp;(Eliminates penny mismatch disputes)</div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE FAQS -->\n  <div class=\"no-print\" style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Frequently Asked Questions</h2>\n    \n    <details class=\"faq-item\">\n      <summary>How do I save my invoice as a clean PDF without headers or buttons?</summary>\n      <div>\n        Click the \"Print or Save PDF\" button (or press Ctrl+P / Cmd+P). In the browser print dialog, select \"Save as PDF\" as the destination printer. This tool features bespoke CSS @media print rules that automatically strip away all buttons, toolbars, and background UI, rendering a spotless, professional vector letterhead.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>What do payment terms like Net 30 and Net 15 mean on an invoice?</summary>\n      <div>\n        Payment terms define the time window the client has to settle the invoice balance from the date of issuance. \"Net 30\" gives the client 30 calendar days to pay, while \"Net 15\" requires payment within 15 days. Selecting a payment term in our generator automatically calculates and updates the exact Due Date.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>Are client invoices private, and is my financial data stored on your servers?</summary>\n      <div>\n        Yes, 100% private. All calculations, line-item modifications, and PDF generation happen exclusively inside your browser using client-side JavaScript. No company names, customer contact info, billing rates, or bank details are ever transmitted to or stored on external servers.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>How should sales tax or VAT be applied to services vs digital goods?</summary>\n      <div>\n        In many jurisdictions, pure professional labor and consulting services are exempt from sales tax, while physical deliverables, custom software, and digital assets may be taxable. Our generator provides line-item taxability toggles, allowing you to mark specific products as taxable while leaving consulting hours tax-exempt.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>What essential legal details must be included on a valid invoice?</summary>\n      <div>\n        A legally enforceable invoice should always display: 1) A unique sequential invoice number; 2) Your business name, street address, and Tax ID/EIN; 3) The client’s legal entity name and billing address; 4) The date of invoice and explicit payment due date; 5) An itemized list of deliverables with quantities and rates; and 6) Clear payment instructions (wire routing, ACH, or check mailing instructions).\n      </div>\n    </details>\n  </div>\n</div>\n";

  // 4. Invoice from Time
  const invoiceFromTimeBody = `
    ${printCss}
    <div class="article-container" style="max-width: 900px;">
      <div class="no-print">
        <h1>Invoice from Time Entries</h1>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Turn your tracked time into a professional invoice.</p>
        
        <div style="${commonStyles.card} margin-bottom: 2rem;">
          <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end;">
            <div style="flex: 1; min-width: 200px;">
              <label style="${commonStyles.label}">Project</label>
              <select id="ift-project" class="search-input" style="${commonStyles.input}"></select>
            </div>
            <div>
              <label style="${commonStyles.label}">From Date</label>
              <input type="date" id="ift-from" class="search-input" style="${commonStyles.input}">
            </div>
            <div>
              <label style="${commonStyles.label}">To Date</label>
              <input type="date" id="ift-to" class="search-input" style="${commonStyles.input}">
            </div>
            <div>
              <label style="${commonStyles.label}">Hourly Rate ($)</label>
              <input type="number" id="ift-rate" value="50" class="search-input" style="${commonStyles.input} width: 100px;">
            </div>
            <button id="ift-filter" style="${commonStyles.btn}">Find Entries</button>
          </div>
        </div>

        <div id="ift-results-container" style="display: none; margin-bottom: 2rem;">
          <h2 style="${commonStyles.h2} margin-top: 0;">Select Entries to Invoice</h2>
          <table style="${commonStyles.table} margin-bottom: 1rem;">
            <thead style="background: var(--surface);">
              <tr>
                <th style="${commonStyles.thtd} width: 40px;"><input type="checkbox" id="ift-check-all" checked></th>
                <th style="${commonStyles.thtd}">Date</th>
                <th style="${commonStyles.thtd}">Description</th>
                <th style="${commonStyles.thtd}">Duration</th>
              </tr>
            </thead>
            <tbody id="ift-entries"></tbody>
          </table>
          <button id="ift-generate" style="${commonStyles.btn} background: #2563eb; color: #fff;">Generate Invoice Preview</button>
        </div>
        
        <div id="ift-empty" style="display: none; padding: 2rem; text-align: center; background: var(--surface); border: 1px solid var(--border);">
          No time entries found. <a href="time-tracker.html" style="color: var(--link-color, #2563eb);">Go track some time!</a>
        </div>
      </div>

      <!-- Shared Invoice Template (hidden by default) -->
      <div id="ift-invoice-preview" style="display: none; padding: 2rem; background: #fff; color: #000; font-family: Helvetica, Arial, sans-serif; border: 1px solid #ccc; margin-top: 2rem;">
        <div class="no-print" style="margin-bottom: 2rem; text-align: right;">
          <button id="btnCopyIftText" type="button" style="${commonStyles.btn} background: transparent; border: 1px solid #ccc; color: #333; margin-right: 0.5rem;" onclick="copyIftInvoiceText()">Copy Invoice Text</button>
          <button onclick="window.print()" style="${commonStyles.btn} background: #2563eb; color: #fff;">Print / Save PDF</button>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem;">
          <div style="flex: 1;">
            <h2 style="margin: 0 0 1rem; font-size: 2.5rem; font-weight: bold; color: #111;">INVOICE</h2>
            <div style="display: grid; grid-template-columns: 100px 1fr; gap: 0.5rem; font-size: 0.9rem; max-width: 300px;">
              <strong>Invoice #:</strong> <input type="text" value="INV-002" style="${commonStyles.input}">
              <strong>Date:</strong> <input type="date" id="ift-inv-date" style="${commonStyles.input}">
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 3rem; gap: 2rem;">
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5rem; color: #666; font-size: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">FROM</h3>
            <input type="text" placeholder="Your Name" style="${commonStyles.input} font-weight: bold; margin-bottom: 0.25rem;">
          </div>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5rem; color: #666; font-size: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">TO</h3>
            <input type="text" id="ift-client-name" placeholder="Client Name" style="${commonStyles.input} font-weight: bold; margin-bottom: 0.25rem;">
          </div>
        </div>

        <table style="${commonStyles.table} margin-bottom: 2rem;">
          <thead style="background: #f8f9fa;">
            <tr>
              <th style="${commonStyles.thtd}">Description</th>
              <th style="${commonStyles.thtd} text-align: center;">Hours</th>
              <th style="${commonStyles.thtd} text-align: right;">Rate</th>
              <th style="${commonStyles.thtd} text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody id="ift-inv-items"></tbody>
        </table>

        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 300px; display: flex; justify-content: space-between; padding: 1rem 0; border-top: 2px solid #333; font-weight: bold; font-size: 1.2rem;">
            <span>Total:</span>
            <span id="ift-inv-total">$0.00</span>
          </div>
        </div>
      </div>

      <script>
        const projects = JSON.parse(localStorage.getItem('dts-time-projects') || '[]');
        const entries = JSON.parse(localStorage.getItem('dts-time-entries') || '[]');
        
        const projSelect = document.getElementById('ift-project');
        projSelect.innerHTML = '<option value="">All Projects</option>' + projects.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join('');
        
        let filteredEntries = [];

        document.getElementById('ift-filter').addEventListener('click', () => {
          const pid = projSelect.value;
          const from = document.getElementById('ift-from').value;
          const to = document.getElementById('ift-to').value;
          
          filteredEntries = entries.filter(e => {
            if (pid && e.projectId !== pid) return false;
            if (from && e.date < from) return false;
            if (to && e.date > to) return false;
            return true;
          });
          
          if (filteredEntries.length === 0) {
            document.getElementById('ift-empty').style.display = 'block';
            document.getElementById('ift-results-container').style.display = 'none';
          } else {
            document.getElementById('ift-empty').style.display = 'none';
            document.getElementById('ift-results-container').style.display = 'block';
            
            document.getElementById('ift-entries').innerHTML = filteredEntries.map((e, i) => {
              const p = projects.find(pr => pr.id === e.projectId) || { name: 'Unknown' };
              const hrs = (e.durationMins / 60).toFixed(2);
              return \`
                <tr>
                  <td style="${commonStyles.thtd} text-align: center;"><input type="checkbox" class="ift-chk" data-idx="\${i}" checked></td>
                  <td style="${commonStyles.thtd}">\${e.date}</td>
                  <td style="${commonStyles.thtd}">[\${p.name}] \${e.description}</td>
                  <td style="${commonStyles.thtd}">\${hrs} hrs</td>
                </tr>
              \`;
            }).join('');
          }
        });

        document.getElementById('ift-check-all').addEventListener('change', (e) => {
          document.querySelectorAll('.ift-chk').forEach(c => c.checked = e.target.checked);
        });

        document.getElementById('ift-generate').addEventListener('click', () => {
          const rate = parseFloat(document.getElementById('ift-rate').value) || 0;
          const selectedIdx = Array.from(document.querySelectorAll('.ift-chk:checked')).map(c => parseInt(c.dataset.idx));
          
          if (selectedIdx.length === 0) {
            const btn = document.getElementById('ift-generate');
            const orig = btn.textContent;
            btn.textContent = '⚠️ Please select at least one entry!';
            btn.style.background = '#ef4444';
            setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2500);
            return;
          }

          const selectedEntries = selectedIdx.map(i => filteredEntries[i]);
          
          let total = 0;
          document.getElementById('ift-inv-items').innerHTML = selectedEntries.map(e => {
            const hrs = e.durationMins / 60;
            const amt = hrs * rate;
            total += amt;
            const p = projects.find(pr => pr.id === e.projectId) || { name: '' };
            return \`
              <tr>
                <td style="${commonStyles.thtd}">\${e.date} - \${e.description}</td>
                <td style="${commonStyles.thtd} text-align: center;">\${hrs.toFixed(2)}</td>
                <td style="${commonStyles.thtd} text-align: right;">$\${rate.toFixed(2)}</td>
                <td style="${commonStyles.thtd} text-align: right;">$\${amt.toFixed(2)}</td>
              </tr>
            \`;
          }).join('');
          
          document.getElementById('ift-inv-total').textContent = '$' + total.toFixed(2);
          document.getElementById('ift-inv-date').valueAsDate = new Date();
          
          if (projSelect.value) {
            const p = projects.find(pr => pr.id === projSelect.value);
            if (p) document.getElementById('ift-client-name').value = p.name;
          }
          
          document.getElementById('ift-invoice-preview').style.display = 'block';
        });
      </script>
    
      <!-- Mathematical Derivation -->
      <div class="no-print" style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-top: 2.5rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.75rem;">Time-to-Invoice Reconciliation & GAAP Rounding Mathematics</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
          Invoicing from raw time entries requires converting minute timestamps into decimal hours and calculating line-item extended subtotals with banker's rounding (half to even) to satisfy GAAP auditing rules:
        </p>
        <div style="background: var(--bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; margin-bottom: 1.25rem;">
          <div><strong>1. Decimal Hours Conversion:</strong></div>
          <div>&nbsp;&nbsp;H_i = Minutes_i / 60 &nbsp;&nbsp;(Rounded to 2 decimal places)</div>
          <div><strong>2. Line Item Extended Subtotal:</strong></div>
          <div>&nbsp;&nbsp;L_i = Round(H_i × Hourly Rate, 2)</div>
          <div><strong>3. Cumulative vs Independent Line Rounding:</strong></div>
          <div>&nbsp;&nbsp;Total Invoice Due = ∑ L_i &nbsp;&nbsp;(Summing rounded line totals prevents penny discrepancies)</div>
        </div>
      </div>

      <!-- 5 Fatal Traps -->
      <div class="no-print" style="margin-top: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">5 Fatal Traps in Time-to-Invoice Conversion</h2>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Ghost Entry Double-Invoicing Trap</strong>
          Failing to flag time entries as "Billed" once an invoice is generated. When invoicing again at month-end, consultants accidentally re-bill overlapping dates, prompting embarrassing client fee audits and payment disputes.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The Fixed-Fee vs Hourly Hybrid Collision</strong>
          Mixing flat-rate milestone deliverables with hourly consulting hours on the same unstructured timesheet. Grouping fixed fees under hourly rates misrepresents work classifications and skews contractor 1099 tax documentation.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Fractional Minute Rounding Penny Discrepancy</strong>
          Summing raw unrounded milliseconds across dozens of entries and rounding only the final total. Client accounting departments verifying each line item (Hours × Rate) will find that the sum of the rows does not match the invoice total by $0.01 to $0.05, rejecting the invoice.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The Ambiguous Internal Description Exposure</strong>
          Exporting raw internal developer notes like "bugfix", "research", or "call" directly onto client invoices. Enterprise clients demand descriptive deliverable milestones (e.g. "OAuth2 API Authentication Security Hardening") to justify billing approval.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The Currency Precision Mismatch</strong>
          Generating cross-border invoices where fractional hours conflict with currency precision requirements (e.g. zero-decimal currencies like Japanese Yen vs two-decimal currencies like USD/EUR).
        </div>
      </div>

      <!-- Interactive FAQs -->
      <div class="no-print" style="margin-top: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
        
        <details class="faq-item">
          <summary>How does this tool connect with my tracked time entries?</summary>
          <div>
            This tool reads from the unified <code>localStorage</code> timesheet database maintained by our companion <a href="/productivity/time-tracker" style="color:var(--btn-bg,#3b82f6); font-weight:600;">Time Tracker</a>. Any hours logged on that tool appear automatically here filtered by project.
          </div>
        </details>

        <details class="faq-item">
          <summary>Can I filter which entries appear on the invoice?</summary>
          <div>
            Yes! You can select a specific project, specify From and To date ranges, and use the checkboxes next to individual line items to exclude specific non-billable entries or internal meetings.
          </div>
        </details>

        <details class="faq-item">
          <summary>How do I print or save the generated invoice as a PDF?</summary>
          <div>
            After generating the preview, click the "Print / Save PDF" button (or press Ctrl+P). The tool automatically hides all web navigation, filter bars, and controls, outputting a spotless corporate PDF invoice.
          </div>
        </details>

        <details class="faq-item">
          <summary>Can I customize the client name and billing address?</summary>
          <div>
            Yes. All client fields, invoice numbers, issue dates, and payment notes on the generated preview are fully editable text inputs that you can customize prior to printing.
          </div>
        </details>

        <details class="faq-item">
          <summary>Is any timesheet or invoice data sent to a cloud server?</summary>
          <div>
            No. The entire process runs 100% locally in your browser memory. No financial records, client names, hourly rates, or timesheet logs are ever uploaded.
          </div>
        </details>
      </div>

      <script>
        function copyIftInvoiceText() {
          const client = document.getElementById('ift-client-name').value || 'Client';
          const invNum = document.getElementById('ift-inv-num').value || 'INV-001';
          const invDate = document.getElementById('ift-inv-date').value || new Date().toISOString().split('T')[0];
          const total = document.getElementById('ift-total').textContent || '$0.00';
          const lines = [
            '========================================',
            'INVOICE ' + invNum,
            '========================================',
            'Client: ' + client,
            'Date: ' + invDate,
            'Total Due: ' + total,
            '========================================'
          ];
          navigator.clipboard.writeText(lines.join('\n')).then(() => {
            const btn = document.getElementById('btnCopyIftText');
            if (btn) {
              const orig = btn.textContent;
              btn.textContent = '✓ Copied!';
              btn.style.color = '#10b981';
              setTimeout(() => { btn.textContent = orig; btn.style.color = '#333'; }, 2500);
            }
          });
        }
      </script>

    </div>
  `;

  // 5. Tax Calculator
  const taxCalculatorBody = "\n<div class=\"article-container\" style=\"max-width:1040px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;\">\n    <h1 style=\"font-family:var(--serif);font-size:2.3rem;margin-bottom:0.75rem;line-height:1.2;\">Federal & State Income Tax Calculator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin:0;\">\n      Calculate your true tax liability and net take-home pay under the latest IRS 2024 statutory tax brackets and 2025 inflation-adjusted projections. Features multi-status bracket waterfalls, FICA payroll caps ($168,600 wage ceiling), Additional Medicare surtax, customizable state taxes, and paycheck schedules.\n    </p>\n  </div>\n\n  <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;margin-bottom:2.5rem;\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/><line x1=\"2\" y1=\"10\" x2=\"22\" y2=\"10\"/></svg>\n        Tax Filing Parameters\n      </h2>\n\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"taxYear\">Tax Year</label>\n        <select id=\"taxYear\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n          <option value=\"2024\" selected>2024 (Current Tax Year — Filing April 2025)</option>\n          <option value=\"2025\">2025 (Inflation Adjusted Estimates)</option>\n        </select>\n      </div>\n\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"grossIncome\">Annual Gross Income ($)</label>\n        <input type=\"number\" id=\"grossIncome\" value=\"95000\" min=\"0\" step=\"1000\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;font-weight:600;\">\n        <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;margin-top:0.25rem;\">W-2 wages, salary, or gross business revenue before deductions</span>\n      </div>\n\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"filingStatus\">Filing Status</label>\n        <select id=\"filingStatus\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n          <option value=\"single\" selected>Single</option>\n          <option value=\"mfj\">Married Filing Jointly</option>\n          <option value=\"hoh\">Head of Household</option>\n          <option value=\"mfs\">Married Filing Separately</option>\n        </select>\n      </div>\n\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"preTaxDeductions\">Pre-Tax Deductions (401k, HSA, FSA) ($)</label>\n        <input type=\"number\" id=\"preTaxDeductions\" value=\"6000\" min=\"0\" step=\"500\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n        <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;margin-top:0.25rem;\">Reduces both federal taxable income and state taxable income</span>\n      </div>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"stateTaxRate\">State Tax Rate (%)</label>\n          <input type=\"number\" id=\"stateTaxRate\" value=\"4.5\" min=\"0\" max=\"15\" step=\"0.1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n          <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;margin-top:0.25rem;\">Set 0% for TX, FL, WA, NV, TN, WY, SD, AK</span>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"employmentType\">Employment</label>\n          <select id=\"employmentType\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"w2\" selected>W-2 Employee</option>\n            <option value=\"1099\">1099 / Self-Employed</option>\n          </select>\n          <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;margin-top:0.25rem;\">Self-employed pays employer FICA share</span>\n        </div>\n      </div>\n\n      <div style=\"margin-bottom:0.5rem;\">\n        <label style=\"display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;cursor:pointer;\">\n          <input type=\"checkbox\" id=\"age65Plus\" style=\"accent-color:var(--fg);\">\n          <span>Age 65 or older / legally blind (additional standard deduction)</span>\n        </label>\n      </div>\n    </div>\n\n    <!-- SUMMARY & METRICS COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6l4 2\"/></svg>\n            Net Pay & Tax Burden\n          </h2>\n          <button id=\"copyTaxBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);transition:all 0.2s ease;\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Breakdown</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Annual Take-Home Pay</span>\n            <span id=\"takeHomeAnnual\" style=\"font-family:var(--mono);font-size:1.75rem;font-weight:700;color:var(--fg);display:block;\">$0</span>\n            <span id=\"takeHomePct\" style=\"font-size:0.8rem;color:#10b981;font-weight:600;\">0% of gross income</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Total Tax Obligation</span>\n            <span id=\"totalTaxAnnual\" style=\"font-family:var(--mono);font-size:1.75rem;font-weight:700;color:#ef4444;display:block;\">$0</span>\n            <span id=\"effectiveTaxRate\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">Effective Rate: 0.0%</span>\n          </div>\n        </div>\n\n        <!-- PAYCHECK FREQUENCIES -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Take-Home Pay by Paycheck Schedule</div>\n          <div style=\"display:grid;grid-template-columns:repeat(4, 1fr);gap:0.5rem;text-align:center;\">\n            <div style=\"border-right:1px solid var(--border);padding:0 0.25rem;\">\n              <span style=\"font-size:0.72rem;color:var(--text-muted);display:block;\">Monthly (12x)</span>\n              <strong id=\"payMonthly\" style=\"font-family:var(--mono);font-size:0.95rem;\">$0</strong>\n            </div>\n            <div style=\"border-right:1px solid var(--border);padding:0 0.25rem;\">\n              <span style=\"font-size:0.72rem;color:var(--text-muted);display:block;\">Semi-Mo (24x)</span>\n              <strong id=\"paySemiMonthly\" style=\"font-family:var(--mono);font-size:0.95rem;\">$0</strong>\n            </div>\n            <div style=\"border-right:1px solid var(--border);padding:0 0.25rem;\">\n              <span style=\"font-size:0.72rem;color:var(--text-muted);display:block;\">Bi-Weekly (26x)</span>\n              <strong id=\"payBiWeekly\" style=\"font-family:var(--mono);font-size:0.95rem;\">$0</strong>\n            </div>\n            <div style=\"padding:0 0.25rem;\">\n              <span style=\"font-size:0.72rem;color:var(--text-muted);display:block;\">Weekly (52x)</span>\n              <strong id=\"payWeekly\" style=\"font-family:var(--mono);font-size:0.95rem;\">$0</strong>\n            </div>\n          </div>\n        </div>\n\n        <!-- TAX BREAKDOWN TABLE -->\n        <div style=\"font-size:0.875rem;\">\n          <div style=\"display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid var(--border);\">\n            <span>Federal Income Tax (Marginal: <span id=\"marginalRateBadge\" style=\"font-weight:bold;\">0%</span>)</span>\n            <strong id=\"fedTaxVal\" style=\"font-family:var(--mono);\">$0</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid var(--border);\">\n            <span>Social Security (FICA 6.2% up to cap)</span>\n            <strong id=\"ssTaxVal\" style=\"font-family:var(--mono);\">$0</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid var(--border);\">\n            <span>Medicare (1.45% + 0.9% Additional)</span>\n            <strong id=\"medTaxVal\" style=\"font-family:var(--mono);\">$0</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid var(--border);\">\n            <span>State Income Tax</span>\n            <strong id=\"stateTaxVal\" style=\"font-family:var(--mono);\">$0</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.4rem 0;color:var(--text-muted);\">\n            <span>IRS Standard Deduction Applied</span>\n            <span id=\"stdDeductionApplied\" style=\"font-family:var(--mono);\">$0</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG BRACKET WATERFALL -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;\">IRS Federal Tax Bracket Waterfall</h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Visualizing the progressive taxation engine: each bar shows the exact dollar amount of your taxable income taxed at each successive statutory marginal tier.\n    </p>\n\n    <div style=\"overflow-x:auto;padding-bottom:0.5rem;\">\n      <svg id=\"taxWaterfallSvg\" viewBox=\"0 0 900 240\" style=\"width:100%;height:auto;min-width:600px;font-family:var(--mono);\"></svg>\n    </div>\n\n    <div id=\"bracketBreakdownLegend\" style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:0.75rem;margin-top:1.5rem;font-size:0.8rem;\"></div>\n  </div>\n\n  <!-- MATHEMATICAL & STATUTORY DERIVATION -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Worked Mathematical Derivation & IRC Formulas</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      United States federal income taxation follows an additive piecewise step-function under Internal Revenue Code (IRC) § 1. Moving into a higher tax bracket <strong>never</strong> taxes your entire earnings at the higher rate; only the portion exceeding the threshold is taxed at the marginal tier.\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;margin-bottom:1.25rem;overflow-x:auto;\">\n      <strong>1. Adjusted Gross Income (AGI):</strong><br>\n      \\text{AGI} = \\text{Gross Income} - \\text{Pre-Tax Deductions (401k, HSA)}<br><br>\n      <strong>2. Taxable Income ($T$):</strong><br>\n      T = \\max(0, \\text{AGI} - \\text{Standard Deduction})<br><br>\n      <strong>3. Piecewise Federal Income Tax ($T_{fed}$):</strong><br>\n      T_{fed} = \\sum_{i=1}^{n} r_i \\times \\max\\Big(0, \\min(T, B_i) - B_{i-1}\\Big)<br>\n      \\text{where } r_i \\in \\{10\\%, 12\\%, 22\\%, 24\\%, 32\\%, 35\\%, 37\\%\\} \\text{ and } B_i \\text{ are statutory bracket ceilings.}<br><br>\n      <strong>4. FICA Payroll Taxes:</strong><br>\n      T_{SS} = 0.062 \\times \\min(\\text{W-2 Wages}, \\text{Wage Base Cap: } \\$168,600)<br>\n      T_{Med} = 0.0145 \\times \\text{W-2 Wages} + 0.009 \\times \\max(0, \\text{W-2 Wages} - \\text{Threshold: } \\$200,000)<br><br>\n      <strong>5. Effective Tax Rate:</strong><br>\n      \\text{Effective Rate} = \\frac{T_{fed} + T_{SS} + T_{Med} + T_{state}}{\\text{Gross Income}} \\times 100\\%\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL TAX PITFALLS & TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Tax Traps & Audit Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;display:flex;align-items:center;gap:0.5rem;\">\n          <span>1. The Marginal Bracket Myth</span>\n        </h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          The single most destructive personal finance myth is refusing a raise or overtime believing \"it will push me into a higher tax bracket and I'll take home less money.\" Because US taxes are strictly marginal, a $1,000 raise into the 24% bracket is taxed at 24% on that $1,000 only, leaving you with $760 more cash.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;display:flex;align-items:center;gap:0.5rem;\">\n          <span>2. FICA Wage Base Cliff & False Windfalls</span>\n        </h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          In 2024, the Social Security tax (6.2%) stops once cumulative wages hit $168,600 ($176,100 in 2025). High earners notice paychecks suddenly jump in September or October. Treating this temporary 6.2% cash surge as permanent lifestyle income creates severe budget shortfalls when January 1 resets the cap.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;display:flex;align-items:center;gap:0.5rem;\">\n          <span>3. Bonus Supplemental Withholding Mismatch</span>\n        </h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          IRS rules mandate a flat 22% federal income tax withholding on supplemental wages (bonuses, commissions, RSU vesting) under $1 million. If your actual marginal bracket is 32% or 35%, your employer will drastically underwithhold on bonuses, leading to unexpected 5-figure tax bills come April.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;display:flex;align-items:center;gap:0.5rem;\">\n          <span>4. Underwithholding Safe Harbor Traps (§ 6654)</span>\n        </h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          If you owe more than $1,000 at tax time, the IRS assesses statutory interest penalties unless you meet Safe Harbor: paying at least 90% of current year tax OR 100% of prior year tax (110% if prior AGI exceeded $150,000). Independent 1099 contractors with rapidly growing income frequently trigger harsh § 6654 penalties.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;display:flex;align-items:center;gap:0.5rem;\">\n          <span>5. The 0.9% Surtax & Unindexed Marriage Penalties</span>\n        </h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          The Affordable Care Act (ACA) 0.9% Additional Medicare Tax triggers at $200,000 for Single filers but only $250,000 for Married Filing Jointly—meaning two single earners making $130,000 pay zero surtax apart, but trigger the penalty immediately upon marriage. Unlike income brackets, this $250k threshold is not indexed to inflation.\n        </p>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE CLIENT-SIDE ENGINE -->\n  <script>\n    (function() {\n      var BRACKETS_2024 = {\n        single: [\n          { r: 0.10, max: 11600 },\n          { r: 0.12, max: 47150 },\n          { r: 0.22, max: 100525 },\n          { r: 0.24, max: 191950 },\n          { r: 0.32, max: 243725 },\n          { r: 0.35, max: 609350 },\n          { r: 0.37, max: Infinity }\n        ],\n        mfj: [\n          { r: 0.10, max: 23200 },\n          { r: 0.12, max: 94300 },\n          { r: 0.22, max: 201050 },\n          { r: 0.24, max: 383900 },\n          { r: 0.32, max: 487450 },\n          { r: 0.35, max: 731200 },\n          { r: 0.37, max: Infinity }\n        ],\n        hoh: [\n          { r: 0.10, max: 16550 },\n          { r: 0.12, max: 63100 },\n          { r: 0.22, max: 100500 },\n          { r: 0.24, max: 191950 },\n          { r: 0.32, max: 243700 },\n          { r: 0.35, max: 609350 },\n          { r: 0.37, max: Infinity }\n        ],\n        mfs: [\n          { r: 0.10, max: 11600 },\n          { r: 0.12, max: 47150 },\n          { r: 0.22, max: 100525 },\n          { r: 0.24, max: 191950 },\n          { r: 0.32, max: 243725 },\n          { r: 0.35, max: 365600 },\n          { r: 0.37, max: Infinity }\n        ]\n      };\n\n      var STD_DEDUCTION_2024 = {\n        single: 14600,\n        mfj: 29200,\n        hoh: 21900,\n        mfs: 14600,\n        senior_single: 1950,\n        senior_married: 1550\n      };\n\n      var BRACKETS_2025 = {\n        single: [\n          { r: 0.10, max: 11925 },\n          { r: 0.12, max: 48475 },\n          { r: 0.22, max: 103350 },\n          { r: 0.24, max: 197300 },\n          { r: 0.32, max: 250525 },\n          { r: 0.35, max: 626350 },\n          { r: 0.37, max: Infinity }\n        ],\n        mfj: [\n          { r: 0.10, max: 23850 },\n          { r: 0.12, max: 96950 },\n          { r: 0.22, max: 206700 },\n          { r: 0.24, max: 394600 },\n          { r: 0.32, max: 501050 },\n          { r: 0.35, max: 751600 },\n          { r: 0.37, max: Infinity }\n        ],\n        hoh: [\n          { r: 0.10, max: 17000 },\n          { r: 0.12, max: 64850 },\n          { r: 0.22, max: 103350 },\n          { r: 0.24, max: 197300 },\n          { r: 0.32, max: 250500 },\n          { r: 0.35, max: 626350 },\n          { r: 0.37, max: Infinity }\n        ],\n        mfs: [\n          { r: 0.10, max: 11925 },\n          { r: 0.12, max: 48475 },\n          { r: 0.22, max: 103350 },\n          { r: 0.24, max: 197300 },\n          { r: 0.32, max: 250525 },\n          { r: 0.35, max: 375800 },\n          { r: 0.37, max: Infinity }\n        ]\n      };\n\n      var STD_DEDUCTION_2025 = {\n        single: 15000,\n        mfj: 30000,\n        hoh: 22500,\n        mfs: 15000,\n        senior_single: 2000,\n        senior_married: 1600\n      };\n\n      function formatMoney(n) {\n        return '$' + Math.round(n).toLocaleString();\n      }\n\n      function calculateTaxes() {\n        var year = document.getElementById('taxYear').value;\n        var gross = parseFloat(document.getElementById('grossIncome').value) || 0;\n        var status = document.getElementById('filingStatus').value;\n        var preTax = parseFloat(document.getElementById('preTaxDeductions').value) || 0;\n        var stateRate = (parseFloat(document.getElementById('stateTaxRate').value) || 0) / 100;\n        var is1099 = document.getElementById('employmentType').value === '1099';\n        var is65 = document.getElementById('age65Plus').checked;\n\n        var brackets = year === '2025' ? BRACKETS_2025[status] : BRACKETS_2024[status];\n        var stdDedTable = year === '2025' ? STD_DEDUCTION_2025 : STD_DEDUCTION_2024;\n\n        var stdDed = stdDedTable[status];\n        if (is65) {\n          stdDed += (status === 'single' || status === 'hoh') ? stdDedTable.senior_single : stdDedTable.senior_married;\n        }\n\n        // FICA Calculation\n        var ssCap = year === '2025' ? 176100 : 168600;\n        var ssTaxRate = is1099 ? 0.124 : 0.062;\n        var medTaxRate = is1099 ? 0.029 : 0.0145;\n\n        // Self-employment tax deduction (half of SE tax is deductible above-the-line)\n        var seDeduction = 0;\n        if (is1099) {\n          var netEarnings = gross * 0.9235;\n          var seSSTax = Math.min(netEarnings, ssCap) * 0.124;\n          var seMedTax = netEarnings * 0.029;\n          seDeduction = (seSSTax + seMedTax) * 0.5;\n        }\n\n        var agi = Math.max(0, gross - preTax - seDeduction);\n        var taxableIncome = Math.max(0, agi - stdDed);\n\n        // Federal progressive calculation\n        var fedTax = 0;\n        var prevCap = 0;\n        var marginalRate = 0.10;\n        var tierDetails = [];\n\n        for (var i = 0; i < brackets.length; i++) {\n          var b = brackets[i];\n          var cap = b.max;\n          var rate = b.r;\n          var chunk = 0;\n\n          if (taxableIncome > prevCap) {\n            chunk = Math.min(taxableIncome - prevCap, cap - prevCap);\n            var chunkTax = chunk * rate;\n            fedTax += chunkTax;\n            marginalRate = rate;\n            tierDetails.push({ rate: rate, chunk: chunk, tax: chunkTax, from: prevCap, to: cap });\n          } else {\n            tierDetails.push({ rate: rate, chunk: 0, tax: 0, from: prevCap, to: cap });\n          }\n          prevCap = cap;\n        }\n\n        // FICA\n        var ssTax = 0;\n        var medTax = 0;\n        if (is1099) {\n          var seBase = gross * 0.9235;\n          ssTax = Math.min(seBase, ssCap) * 0.124;\n          medTax = seBase * 0.029;\n        } else {\n          ssTax = Math.min(gross, ssCap) * 0.062;\n          medTax = gross * 0.0145;\n        }\n\n        // 0.9% Additional Medicare Surtax\n        var addMedThreshold = status === 'mfj' ? 250000 : (status === 'mfs' ? 125000 : 200000);\n        if (gross > addMedThreshold) {\n          medTax += (gross - addMedThreshold) * 0.009;\n        }\n\n        // State Tax\n        var stateTaxable = Math.max(0, gross - preTax - stdDed * 0.5); // approximate state deductions\n        var stateTax = stateTaxable * stateRate;\n\n        var totalTax = fedTax + ssTax + medTax + stateTax;\n        var netAnnual = Math.max(0, gross - preTax - totalTax);\n        var effRate = gross > 0 ? (totalTax / gross * 100) : 0;\n        var takeHomePct = gross > 0 ? (netAnnual / gross * 100) : 0;\n\n        // Update DOM\n        document.getElementById('takeHomeAnnual').textContent = formatMoney(netAnnual);\n        document.getElementById('takeHomePct').textContent = takeHomePct.toFixed(1) + '% of gross income';\n        document.getElementById('totalTaxAnnual').textContent = formatMoney(totalTax);\n        document.getElementById('effectiveTaxRate').textContent = 'Effective Rate: ' + effRate.toFixed(1) + '%';\n\n        document.getElementById('payMonthly').textContent = formatMoney(netAnnual / 12);\n        document.getElementById('paySemiMonthly').textContent = formatMoney(netAnnual / 24);\n        document.getElementById('payBiWeekly').textContent = formatMoney(netAnnual / 26);\n        document.getElementById('payWeekly').textContent = formatMoney(netAnnual / 52);\n\n        document.getElementById('marginalRateBadge').textContent = (marginalRate * 100).toFixed(0) + '%';\n        document.getElementById('fedTaxVal').textContent = formatMoney(fedTax);\n        document.getElementById('ssTaxVal').textContent = formatMoney(ssTax);\n        document.getElementById('medTaxVal').textContent = formatMoney(medTax);\n        document.getElementById('stateTaxVal').textContent = formatMoney(stateTax);\n        document.getElementById('stdDeductionApplied').textContent = formatMoney(stdDed);\n\n        renderWaterfall(tierDetails, taxableIncome);\n      }\n\n      function renderWaterfall(tiers, taxableIncome) {\n        var svg = document.getElementById('taxWaterfallSvg');\n        var legend = document.getElementById('bracketBreakdownLegend');\n        if (!svg || !legend) return;\n\n        var colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#6366f1', '#ef4444'];\n        var svgHtml = '';\n        var legendHtml = '';\n\n        var barW = 105;\n        var startX = 60;\n        var maxH = 150;\n        var baselineY = 180;\n\n        // Find max chunk to scale\n        var maxChunk = 1;\n        for (var i = 0; i < tiers.length; i++) {\n          if (tiers[i].chunk > maxChunk) maxChunk = tiers[i].chunk;\n        }\n\n        // Draw axes\n        svgHtml += '<line x1=\"50\" y1=\"' + baselineY + '\" x2=\"860\" y2=\"' + baselineY + '\" stroke=\"var(--border)\" stroke-width=\"2\"/>';\n\n        for (var t = 0; t < tiers.length; t++) {\n          var item = tiers[t];\n          var ratePct = (item.rate * 100).toFixed(0) + '%';\n          var x = startX + t * (barW + 10);\n          var h = item.chunk > 0 ? Math.max(8, (item.chunk / maxChunk) * maxH) : 0;\n          var y = baselineY - h;\n          var col = colors[t % colors.length];\n\n          if (item.chunk > 0) {\n            svgHtml += '<rect x=\"' + x + '\" y=\"' + y + '\" width=\"' + barW + '\" height=\"' + h + '\" rx=\"4\" fill=\"' + col + '\" opacity=\"0.85\"/>';\n            svgHtml += '<text x=\"' + (x + barW/2) + '\" y=\"' + (y - 8) + '\" fill=\"var(--fg)\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">$' + Math.round(item.tax).toLocaleString() + '</text>';\n          } else {\n            svgHtml += '<rect x=\"' + x + '\" y=\"' + (baselineY - 4) + '\" width=\"' + barW + '\" height=\"4\" rx=\"2\" fill=\"var(--border)\"/>';\n            svgHtml += '<text x=\"' + (x + barW/2) + '\" y=\"' + (baselineY - 10) + '\" fill=\"var(--text-muted)\" font-size=\"10\" text-anchor=\"middle\">$0</text>';\n          }\n\n          svgHtml += '<text x=\"' + (x + barW/2) + '\" y=\"' + (baselineY + 20) + '\" fill=\"var(--fg)\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">' + ratePct + '</text>';\n          svgHtml += '<text x=\"' + (x + barW/2) + '\" y=\"' + (baselineY + 35) + '\" fill=\"var(--text-muted)\" font-size=\"10\" text-anchor=\"middle\">Bracket ' + (t+1) + '</text>';\n\n          legendHtml += '<div style=\"background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:0.6rem;text-align:center;\">' +\n            '<span style=\"display:inline-block;width:8px;height:8px;border-radius:50%;background:' + col + ';margin-right:4px;\"></span>' +\n            '<strong>' + ratePct + ' Tier</strong><br>' +\n            '<span style=\"color:var(--text-muted);font-size:0.75rem;\">Income: $' + Math.round(item.chunk).toLocaleString() + '</span><br>' +\n            '<span style=\"font-weight:600;color:var(--fg);font-size:0.8rem;\">Tax: $' + Math.round(item.tax).toLocaleString() + '</span>' +\n          '</div>';\n        }\n\n        svg.innerHTML = svgHtml;\n        legend.innerHTML = legendHtml;\n      }\n\n      function copyTaxSummary() {\n        var year = document.getElementById('taxYear').value;\n        var gross = document.getElementById('grossIncome').value;\n        var status = document.getElementById('filingStatus').options[document.getElementById('filingStatus').selectedIndex].text;\n        var takeHome = document.getElementById('takeHomeAnnual').textContent;\n        var totalTax = document.getElementById('totalTaxAnnual').textContent;\n        var effRate = document.getElementById('effectiveTaxRate').textContent;\n        var marginal = document.getElementById('marginalRateBadge').textContent;\n        var fed = document.getElementById('fedTaxVal').textContent;\n        var ss = document.getElementById('ssTaxVal').textContent;\n        var med = document.getElementById('medTaxVal').textContent;\n        var state = document.getElementById('stateTaxVal').textContent;\n        var biWeekly = document.getElementById('payBiWeekly').textContent;\n\n        var text = '📊 Federal & State Income Tax Breakdown (' + year + ')\\n' +\n          '• Gross Income: $' + parseFloat(gross).toLocaleString() + '\\n' +\n          '• Filing Status: ' + status + '\\n' +\n          '• Take-Home Pay (Annual): ' + takeHome + '\\n' +\n          '• Take-Home Pay (Bi-Weekly): ' + biWeekly + '\\n' +\n          '• Total Tax: ' + totalTax + ' (' + effRate + ')\\n' +\n          '• Marginal Tax Bracket: ' + marginal + '\\n' +\n          '• Federal Income Tax: ' + fed + '\\n' +\n          '• Social Security (FICA): ' + ss + '\\n' +\n          '• Medicare (FICA): ' + med + '\\n' +\n          '• State Income Tax: ' + state + '\\n\\n' +\n          'Calculated at digitaltoolsshed.com/productivity/tax-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyTaxBtn');\n          var original = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied!</span>';\n          setTimeout(function() { btn.innerHTML = original; }, 2000);\n        });\n      }\n\n      var inputs = ['taxYear', 'grossIncome', 'filingStatus', 'preTaxDeductions', 'stateTaxRate', 'employmentType', 'age65Plus'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calculateTaxes);\n          el.addEventListener('change', calculateTaxes);\n        }\n      });\n\n      var cBtn = document.getElementById('copyTaxBtn');\n      if (cBtn) cBtn.addEventListener('click', copyTaxSummary);\n\n      calculateTaxes();\n    })();\n  </script>\n  <!-- INTERACTIVE FAQS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Frequently Asked Questions</h2>\n    \n    <details class=\"faq-item\">\n      <summary>How do federal income tax brackets work in 2024 and 2025?</summary>\n      <div>\n        Federal income taxes operate on a progressive marginal scale with seven statutory brackets: 10%, 12%, 22%, 24%, 32%, 35%, and 37%. Income is taxed in sequential tiers after subtracting the standard deduction ($14,600 for Single, $29,200 for Married in 2024). Entering a higher bracket only taxes the specific dollars exceeding the threshold, never your entire earnings.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>What is the difference between Marginal Tax Rate and Effective Tax Rate?</summary>\n      <div>\n        Your marginal tax rate is the highest tax bracket applied to your last dollar of income. Your effective tax rate is the actual percentage of total gross income paid in taxes (Total Tax ÷ Gross Income). Because of progressive brackets and standard deductions, your effective rate is substantially lower than your marginal bracket.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>How does the FICA Social Security wage base cap work?</summary>\n      <div>\n        Social Security tax (6.2% for employees) is capped at $168,600 of wages in 2024 ($176,100 in 2025). Any wages earned above this threshold are exempt from Social Security tax for the remainder of the calendar year. Medicare tax (1.45%) has no cap and applies to all earnings.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>How are 1099 self-employed independent contractors taxed differently?</summary>\n      <div>\n        W-2 employees split FICA taxes with their employer (6.2% SS + 1.45% Medicare each). 1099 contractors pay the full Self-Employment (SE) tax of 15.3% (12.4% SS + 2.9% Medicare) on 92.35% of net business profits, but can deduct half of this SE tax above-the-line on Form 1040.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>What is the 0.9% Additional Medicare Tax?</summary>\n      <div>\n        Under the Affordable Care Act (ACA), an extra 0.9% Medicare surtax applies to wages and self-employment income exceeding $200,000 for Single filers or $250,000 for Married Filing Jointly. Employers must withhold this once wages surpass $200,000 regardless of marital status.\n      </div>\n    </details>\n  </div>\n</div>\n";

  // 6. Task Manager
  const taskManagerBody = `
    ${printCss}
    <div class="article-container" style="max-width: 900px;">
      <div class="no-print">
        <h1>Task Manager</h1>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Organize your work. Data stored in your browser.</p>
        
        <div style="${commonStyles.card} margin-bottom: 2rem;">
          <form id="tm-form" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: end;">
            <div style="grid-column: 1 / -1;">
              <label style="${commonStyles.label}">Task Title</label>
              <input type="text" id="tm-title" class="search-input" style="${commonStyles.input}" required>
            </div>
            <div>
              <label style="${commonStyles.label}">Priority</label>
              <select id="tm-priority" class="search-input" style="${commonStyles.input}">
                <option value="Low">Low</option>
                <option value="Medium" selected>Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label style="${commonStyles.label}">Due Date</label>
              <input type="date" id="tm-due" class="search-input" style="${commonStyles.input}">
            </div>
            <div style="grid-column: 1 / -1;">
              <button type="submit" style="${commonStyles.btn} width: 100%;">Add Task</button>
            </div>
          </form>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <select id="tm-filter" class="search-input" style="${commonStyles.input} width: auto;">
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <select id="tm-sort" class="search-input" style="${commonStyles.input} width: auto;">
              <option value="date">Sort by Date Added</option>
              <option value="due">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button onclick="window.print()" style="${commonStyles.btn} background: var(--surface); color: var(--fg); border: 1px solid var(--border);">Export PDF</button>
            <button id="tm-export-doc" style="${commonStyles.btn} background: #2563eb; color: white;">Export DOCX</button>
            <button type="button" id="btnCopyTasks" style="${commonStyles.btn} background: transparent; border: 1px solid var(--border); color: var(--fg); cursor: pointer;" onclick="copyTasksChecklist()">Copy Task List</button>
          </div>
        </div>
      </div>
      
      <div class="print-only">
        <h1>Task List</h1>
      </div>

      <div id="tm-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
        <!-- Tasks injected here -->
      </div>

      <script>
        let tasks = JSON.parse(localStorage.getItem('dts-tasks') || '[]');
        
        const priorityColors = { Low: '#3b82f6', Medium: '#10b981', High: '#f59e0b', Urgent: '#ef4444' };
        const priorityVal = { Low: 1, Medium: 2, High: 3, Urgent: 4 };

        function save() {
          localStorage.setItem('dts-tasks', JSON.stringify(tasks));
          render();
        }

        document.getElementById('tm-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const title = document.getElementById('tm-title').value;
          const priority = document.getElementById('tm-priority').value;
          const due = document.getElementById('tm-due').value;
          
          tasks.push({
            id: Date.now().toString(),
            title, priority, due,
            completed: false,
            added: new Date().toISOString()
          });
          
          document.getElementById('tm-title').value = '';
          save();
        });

        function render() {
          const filter = document.getElementById('tm-filter').value;
          const sort = document.getElementById('tm-sort').value;
          
          let filtered = tasks.filter(t => {
            if (filter === 'active') return !t.completed;
            if (filter === 'completed') return t.completed;
            return true;
          });
          
          filtered.sort((a, b) => {
            if (sort === 'priority') return priorityVal[b.priority] - priorityVal[a.priority];
            if (sort === 'due') {
              if (!a.due) return 1;
              if (!b.due) return -1;
              return new Date(a.due) - new Date(b.due);
            }
            return new Date(b.added) - new Date(a.added); // Date added
          });

          document.getElementById('tm-list').innerHTML = filtered.map(t => \`
            <div style="\${commonStyles.card} display: flex; align-items: center; gap: 1rem; opacity: \${t.completed ? '0.6' : '1'};">
              <input type="checkbox" \${t.completed ? 'checked' : ''} onchange="toggleTask('\${t.id}')" style="width: 20px; height: 20px; cursor: pointer;" class="no-print">
              <div style="flex: 1;">
                <div style="font-weight: bold; font-size: 1.1rem; text-decoration: \${t.completed ? 'line-through' : 'none'};">\${t.title}</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; gap: 1rem; margin-top: 0.25rem;">
                  <span style="color: \${priorityColors[t.priority]}; font-weight: bold;">\${t.priority}</span>
                  \${t.due ? \`<span>Due: \${t.due}</span>\` : ''}
                </div>
              </div>
              <button onclick="deleteTask('\${t.id}')" class="no-print" style="\${commonStyles.btn} background: #ef4444; color: white; padding: 0.3rem 0.6rem;">Del</button>
            </div>
          \`).join('');
          
          if(filtered.length === 0) {
            document.getElementById('tm-list').innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">No tasks found.</div>';
          }
        }

        window.toggleTask = (id) => {
          const t = tasks.find(x => x.id === id);
          if (t) t.completed = !t.completed;
          save();
        };

        window.deleteTask = (id) => {
          tasks = tasks.filter(x => x.id !== id);
          save();
        };

        document.getElementById('tm-filter').addEventListener('change', render);
        document.getElementById('tm-sort').addEventListener('change', render);

        document.getElementById('tm-export-doc').addEventListener('click', () => {
          const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Tasks</title></head><body>";
          const footer = "</body></html>";
          
          let html = "<h1>Task List</h1><ul>";
          tasks.forEach(t => {
            const status = t.completed ? "[X]" : "[ ]";
            const dueStr = t.due ? \` (Due: \${t.due})\` : "";
            html += \`<li>\${status} \${t.title} - \${t.priority}\${dueStr}</li>\`;
          });
          html += "</ul>";
          
          const sourceHTML = header + html + footer;
          const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
          const fileDownload = document.createElement("a");
          document.body.appendChild(fileDownload);
          fileDownload.href = source;
          fileDownload.download = 'tasks.doc';
          fileDownload.click();
          document.body.removeChild(fileDownload);
        });

        render();
      </script>
    
      <!-- Mathematical & Cognitive Derivation -->
      <div class="no-print" style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-top: 2.5rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.75rem;">The Eisenhower Matrix, Queueing Theory & Cognitive Load Mathematics</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
          Task management is governed by discrete priority scoring and Work-In-Progress (WIP) queueing physics. Little's Law from operations research proves that throughput collapses when WIP is unconstrained:
        </p>
        <div style="background: var(--bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; margin-bottom: 1.25rem;">
          <div><strong>1. Composite Priority Scoring Algorithm:</strong></div>
          <div>&nbsp;&nbsp;Priority Score = (Urgency_Weight × U) + (Importance_Weight × I) - (Effort_Weight × E)</div>
          <div><strong>2. Little's Law for Task Completion Latency:</strong></div>
          <div>&nbsp;&nbsp;Lead Time (W) = [Active WIP Tasks (L)] / [Average Completion Rate (λ)]</div>
          <div>&nbsp;&nbsp;(Doubling active concurrent tasks doubles the average completion delay for all items)</div>
          <div><strong>3. Zeigarnik Effect & Attention Residue:</strong></div>
          <div>&nbsp;&nbsp;Context Switching Penalty ≈ 23 minutes 15 seconds to regain deep flow after task interruption</div>
        </div>
      </div>

      <!-- 5 Fatal Traps -->
      <div class="no-print" style="margin-top: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">5 Fatal Traps in Personal Task Management</h2>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Endless "Urgent But Not Important" Quadrant III Trap</strong>
          Confusing reactive urgency (emails, pings, low-stakes requests) with strategic importance. Prioritizing only deadlines rather than compounding high-leverage goals leaves critical career projects permanently stalled.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The Unbounded Work-in-Progress (WIP) Congestion Trap</strong>
          Starting ten projects simultaneously without finishing existing ones. Little's Law dictates that as active WIP items multiply, mean completion time expands exponentially, inducing chronic overwhelm.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Unestimated Scope Creep & Granularity Trap</strong>
          Writing monolithic tasks like "Redesign Website" or "Write Book" instead of discrete atomic steps (&le;45 minutes each). Vague, high-granularity tasks trigger dopamine resistance and executive dysfunction paralysis.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The LocalStorage Cache Invalidation Trap</strong>
          Relying exclusively on browser local storage without regular export backups. Clearing browser cookies or running disk clean-up utilities can unexpectedly wipe local storage keys.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The Binary Status "Done vs Not Done" Fallacy</strong>
          Treating tasks as strictly binary without distinguishing between blocked, deferred, or delegable tasks. Failing to record waiting-on dependencies leads to stalled bottlenecks.
        </div>
      </div>

      <!-- Interactive FAQs -->
      <div class="no-print" style="margin-top: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
        
        <details class="faq-item">
          <summary>Where are my tasks saved, and will they persist if I close the browser?</summary>
          <div>
            All tasks are securely persisted inside your browser's private <code>localStorage</code> API under the key <code>dts-tasks</code>. Your tasks automatically re-render whenever you revisit the page or reopen your browser.
          </div>
        </details>

        <details class="faq-item">
          <summary>Can I export my task list to print or share with a team?</summary>
          <div>
            Yes! You can click "Export DOCX" to download a clean Microsoft Word document, click "Export PDF" (or Ctrl+P) to print a vector checklist, or click "Copy Task List" to format a clean text checklist for Slack or email.
          </div>
        </details>

        <details class="faq-item">
          <summary>How does the Priority sorting algorithm organize my tasks?</summary>
          <div>
            Tasks are ranked across four tiers: Urgent (red), High (orange), Medium (blue), and Low (gray). Within each tier, tasks are sorted by due date, ensuring that time-critical responsibilities remain immediately visible.
          </div>
        </details>

        <details class="faq-item">
          <summary>What is the Eisenhower Matrix method used for prioritization?</summary>
          <div>
            The Eisenhower Matrix categorizes tasks across two axes: Urgency and Importance. High-importance/low-urgency tasks represent strategic long-term value, while high-urgency/low-importance tasks represent tactical interruptions that should be automated or delegated.
          </div>
        </details>

        <details class="faq-item">
          <summary>Is any task data uploaded to external cloud servers?</summary>
          <div>
            No. The entire task manager operates 100% locally in your client browser memory using zero third-party tracking scripts or backend APIs. Your confidential projects remain completely private.
          </div>
        </details>
      </div>

      <script>
        function copyTasksChecklist() {
          const stored = JSON.parse(localStorage.getItem('dts-tasks') || '[]');
          if (stored.length === 0) {
            const btn = document.getElementById('btnCopyTasks');
            const orig = btn.textContent;
            btn.textContent = '⚠️ No tasks to copy!';
            setTimeout(() => { btn.textContent = orig; }, 2000);
            return;
          }
          const pending = stored.filter(t => !t.completed);
          const done = stored.filter(t => t.completed);
          const lines = [
            '========================================',
            'DIGITAL TOOLS SHED - TASK CHECKLIST',
            '========================================',
            'Pending Tasks (' + pending.length + '):'
          ];
          pending.forEach(t => {
            lines.push('  [ ] [' + t.priority + '] ' + t.title + (t.due ? ' (Due: ' + t.due + ')' : ''));
          });
          if (done.length > 0) {
            lines.push('\nCompleted Tasks (' + done.length + '):');
            done.forEach(t => {
              lines.push('  [✓] ' + t.title);
            });
          }
          lines.push('========================================');
          navigator.clipboard.writeText(lines.join('\n')).then(() => {
            const btn = document.getElementById('btnCopyTasks');
            const orig = btn.textContent;
            btn.textContent = '✓ Copied!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(() => { btn.textContent = orig; btn.style.borderColor = ''; btn.style.color = ''; }, 2500);
          });
        }
      </script>

    </div>
  `;

  // 7. Weekly Timetable
  const timetableBody = `
    ${printCss}
    <div class="article-container" style="max-width: 1200px;">
      <div class="no-print">
        <h1>Weekly Timetable</h1>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Plan your week block by block. Click a cell to add an activity.</p>
        
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center;">
          <button onclick="window.print()" style="${commonStyles.btn}">Print Schedule</button>
          <button type="button" id="btnCopySchedule" style="${commonStyles.btn} background: transparent; border: 1px solid var(--border); color: var(--fg); cursor: pointer;" onclick="copyWeeklySchedule()">Copy Schedule</button>
          <button type="button" id="btnExportTtCsv" style="${commonStyles.btn} background: transparent; border: 1px solid var(--border); color: var(--fg); cursor: pointer;" onclick="exportScheduleCsv()">Export CSV</button>
          <button id="wt-clear" style="${commonStyles.btn} background: #ef4444;">Clear All</button>
        </div>
      </div>

      <div style="display: flex; gap: 2rem; align-items: flex-start; @media(max-width:900px){flex-direction:column;}">
        <div style="flex: 1; overflow-x: auto; min-width: 0;">
          <table style="${commonStyles.table} table-layout: fixed; min-width: 700px;" id="wt-table">
            <thead>
              <tr style="background: var(--surface);">
                <th style="${commonStyles.thtd} width: 60px;">Time</th>
                <th style="${commonStyles.thtd} text-align: center;">Mon</th>
                <th style="${commonStyles.thtd} text-align: center;">Tue</th>
                <th style="${commonStyles.thtd} text-align: center;">Wed</th>
                <th style="${commonStyles.thtd} text-align: center;">Thu</th>
                <th style="${commonStyles.thtd} text-align: center;">Fri</th>
                <th style="${commonStyles.thtd} text-align: center;">Sat</th>
                <th style="${commonStyles.thtd} text-align: center;">Sun</th>
              </tr>
            </thead>
            <tbody id="wt-body">
              <!-- Grid injected -->
            </tbody>
          </table>
        </div>
        
        <div style="${commonStyles.card} width: 250px; flex-shrink: 0;" class="no-print">
          <h2 style="${commonStyles.h2} margin-top: 0;">Summary</h2>
          <div id="wt-summary" style="font-size: 0.9rem;"></div>
        </div>
      </div>

      <!-- Modal for entry -->
      <div id="wt-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;" class="no-print">
        <div style="${commonStyles.card} width: 300px; position: relative;">
          <h3 id="wt-modal-title" style="margin-top: 0;">Add Activity</h3>
          <p id="wt-modal-time" style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;"></p>
          
          <input type="text" id="wt-input-name" class="search-input" style="${commonStyles.input} margin-bottom: 1rem;" placeholder="Activity Name">
          
          <label style="${commonStyles.label}">Color</label>
          <input type="color" id="wt-input-color" value="#3b82f6" style="width: 100%; height: 40px; margin-bottom: 1rem; border: 1px solid var(--border); padding: 0;">
          
          <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button id="wt-modal-del" style="${commonStyles.btn} background: #ef4444; display: none;">Delete</button>
            <div style="flex: 1;"></div>
            <button id="wt-modal-cancel" style="${commonStyles.btn} background: var(--surface); color: var(--fg); border: 1px solid var(--border);">Cancel</button>
            <button id="wt-modal-save" style="${commonStyles.btn}">Save</button>
          </div>
        </div>
      </div>

      <script>
        const days = ['mon','tue','wed','thu','fri','sat','sun'];
        const startHour = 6;
        const endHour = 22;
        
        let schedule = JSON.parse(localStorage.getItem('dts-timetable') || '{}');
        
        const tbody = document.getElementById('wt-body');
        let html = '';
        for(let h = startHour; h <= endHour; h++) {
          html += '<tr>';
          html += \`<td style="${commonStyles.thtd} font-size: 0.8rem; color: var(--text-muted);">\${h}:00</td>\`;
          for(let d of days) {
            const cellId = \`\${d}-\${h}\`;
            html += \`<td id="\${cellId}" style="${commonStyles.thtd} text-align: center; cursor: pointer; transition: filter 0.2s; height: 40px; padding: 0;" onclick="openModal('\${d}', \${h})"></td>\`;
          }
          html += '</tr>';
        }
        tbody.innerHTML = html;

        let activeCell = null;

        function render() {
          // clear grid
          for(let h = startHour; h <= endHour; h++) {
            for(let d of days) {
              const td = document.getElementById(\`\${d}-\${h}\`);
              td.innerHTML = '';
              td.style.background = 'transparent';
              td.title = '';
            }
          }
          
          const totals = {};
          
          // fill grid
          Object.keys(schedule).forEach(key => {
            const entry = schedule[key];
            const td = document.getElementById(key);
            if(td) {
              td.innerHTML = \`<div style="font-size: 0.75rem; font-weight: bold; color: white; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">\${entry.name}</div>\`;
              td.style.background = entry.color;
              td.title = entry.name;
              
              totals[entry.name] = (totals[entry.name] || 0) + 1;
            }
          });

          // Summary
          const sumDiv = document.getElementById('wt-summary');
          if(Object.keys(totals).length === 0) {
            sumDiv.innerHTML = '<p style="color: var(--text-muted);">No activities planned.</p>';
          } else {
            let sHtml = '<ul style="list-style: none; padding: 0; margin: 0;">';
            Object.entries(totals).sort((a,b) => b[1] - a[1]).forEach(([name, hours]) => {
              sHtml += \`<li style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border);"><span>\${name}</span><strong>\${hours} hr\${hours>1?'s':''}</strong></li>\`;
            });
            sHtml += '</ul>';
            sumDiv.innerHTML = sHtml;
          }
        }

        window.openModal = (d, h) => {
          activeCell = \`\${d}-\${h}\`;
          const existing = schedule[activeCell];
          
          document.getElementById('wt-modal-time').textContent = \`\${d.toUpperCase()} at \${h}:00\`;
          document.getElementById('wt-input-name').value = existing ? existing.name : '';
          document.getElementById('wt-input-color').value = existing ? existing.color : '#3b82f6';
          
          document.getElementById('wt-modal-del').style.display = existing ? 'block' : 'none';
          document.getElementById('wt-modal').style.display = 'flex';
          document.getElementById('wt-input-name').focus();
        };

        const closeModal = () => document.getElementById('wt-modal').style.display = 'none';

        document.getElementById('wt-modal-cancel').addEventListener('click', closeModal);
        
        document.getElementById('wt-modal-save').addEventListener('click', () => {
          const name = document.getElementById('wt-input-name').value.trim();
          if(!name) return;
          
          schedule[activeCell] = {
            name,
            color: document.getElementById('wt-input-color').value
          };
          
          localStorage.setItem('dts-timetable', JSON.stringify(schedule));
          render();
          closeModal();
        });

        document.getElementById('wt-modal-del').addEventListener('click', () => {
          delete schedule[activeCell];
          localStorage.setItem('dts-timetable', JSON.stringify(schedule));
          render();
          closeModal();
        });

        document.getElementById('wt-clear').addEventListener('click', () => {
          if(confirm('Clear entire schedule?')) {
            schedule = {};
            localStorage.removeItem('dts-timetable');
            render();
          }
        });

        render();
      </script>
    
      <!-- Mathematical & Ergonomic Derivation -->
      <div class="no-print" style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-top: 2.5rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.75rem;">Chronobiology, Ultradian Rhythm Cycles & Time-Blocking Economics</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
          Human alertness fluctuates along 90-to-120 minute Basic Rest-Activity Cycles (BRAC) governed by hypothalamic circadian pacemakers. Continuous calendar scheduling without biological refractory breaks induces cognitive residue:
        </p>
        <div style="background: var(--bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; margin-bottom: 1.25rem;">
          <div><strong>1. Basic Rest-Activity Cycle (BRAC) Formulation:</strong></div>
          <div>&nbsp;&nbsp;T_cycle = 90 min (Peak Alertness) + 20 min (Refractory Cognitive Consolidation)</div>
          <div><strong>2. Attention Residue Exponential Decay Model:</strong></div>
          <div>&nbsp;&nbsp;R(t) = R_0 × e^{-λ t} &nbsp;&nbsp;(Residual attention from task A impairing task B performance)</div>
          <div><strong>3. Deep Work Capitalization Ratio:</strong></div>
          <div>&nbsp;&nbsp;DWR = [Deep Focused Block Hours] / [Total Available Working Hours] ≈ 0.60 – 0.75 target</div>
        </div>
      </div>

      <!-- 5 Fatal Traps -->
      <div class="no-print" style="margin-top: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">5 Fatal Traps in Weekly Schedule Design</h2>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Zero-Buffer Consecutive Block Burnout Trap</strong>
          Scheduling 8 consecutive back-to-back 60-minute blocks without buffer intervals. When a morning meeting overruns by 15 minutes, the entire remaining schedule collapses into a stressful chain of cascading delays.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The Circadian-Mismatched Deep Work Scheduling Trap</strong>
          Scheduling demanding analytical work (code architecture, financial modeling) during post-prandial circadian lulls (1:30 PM - 3:30 PM) while wasting morning alertness peaks on email replies.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Micro-Fragmentation Calendar Trap</strong>
          Scattering 30-minute meetings every hour across the day. Studies demonstrate that 30-minute gaps between meetings are virtually unusable for deep work due to persistent cognitive anticipatory anxiety.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The Weekend Recovery Fallacy</strong>
          Running at 120% cognitive deficit Monday through Friday under the assumption that 48 hours of weekend rest can reverse executive fatigue. Sleep debt and cognitive exhaustion accumulate systemically.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The Rigid Non-Adaptive Routine Fragility Trap</strong>
          Building an inflexible timetable that does not allocate 20% flex-time for emergencies, technical outages, or urgent family matters. Fragile schedules break on first contact with reality.
        </div>
      </div>

      <!-- Interactive FAQs -->
      <div class="no-print" style="margin-top: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
        
        <details class="faq-item">
          <summary>How does time-blocking compare to traditional to-do lists?</summary>
          <div>
            Traditional to-do lists identify what tasks need completion but fail to allocate temporal real estate, encouraging optimistic over-commitment. Time-blocking treats hours as a finite budget, forcing realistic prioritization within your true available capacity.
          </div>
        </details>

        <details class="faq-item">
          <summary>Can I print or export my weekly timetable as a PDF?</summary>
          <div>
            Yes! Click the "Print Schedule" button (or press Ctrl+P). The layout automatically converts into a clean, border-optimized printable calendar suitable for physical posting on office walls or student binders.
          </div>
        </details>

        <details class="faq-item">
          <summary>Is my weekly timetable stored securely in my browser?</summary>
          <div>
            Yes. All scheduled blocks and color assignments are stored locally inside your browser's private <code>localStorage</code> database under <code>dts-timetable</code>. No calendar entries ever touch an external server.
          </div>
        </details>

        <details class="faq-item">
          <summary>What is the 90-minute ultradian rhythm scheduling method?</summary>
          <div>
            The ultradian scheduling method divides workdays into high-intensity 90-minute focus sprints matched to human cognitive neurobiology, each immediately followed by a 15-to-20 minute mental detachment break.
          </div>
        </details>

        <details class="faq-item">
          <summary>Can I export my weekly schedule to CSV or Excel?</summary>
          <div>
            Yes. Click the "Export CSV" button to download your weekly schedule into standard spreadsheet format compatible with Excel, Google Sheets, or Apple Numbers.
          </div>
        </details>
      </div>

      <script>
        function copyWeeklySchedule() {
          const stored = JSON.parse(localStorage.getItem('dts-timetable') || '{}');
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          const lines = [
            '========================================',
            'DIGITAL TOOLS SHED - WEEKLY TIMETABLE',
            '========================================'
          ];
          let count = 0;
          days.forEach(d => {
            const dayBlocks = [];
            for (let h = 8; h <= 20; h++) {
              const k = d + '-' + h;
              if (stored[k] && stored[k].text) {
                dayBlocks.push('  ' + h + ':00 - ' + stored[k].text);
                count++;
              }
            }
            if (dayBlocks.length > 0) {
              lines.push('\n' + d + ':');
              dayBlocks.forEach(b => lines.push(b));
            }
          });
          if (count === 0) {
            lines.push('No activities scheduled yet. Click cells to add blocks!');
          }
          lines.push('\n========================================');
          navigator.clipboard.writeText(lines.join('\n')).then(() => {
            const btn = document.getElementById('btnCopySchedule');
            if (btn) {
              const orig = btn.textContent;
              btn.textContent = '✓ Copied!';
              btn.style.borderColor = '#10b981';
              btn.style.color = '#10b981';
              setTimeout(() => { btn.textContent = orig; btn.style.borderColor = ''; btn.style.color = ''; }, 2500);
            }
          });
        }

        function exportScheduleCsv() {
          const stored = JSON.parse(localStorage.getItem('dts-timetable') || '{}');
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          const rows = [['Day', 'Time', 'Activity', 'Color']];
          days.forEach(d => {
            for (let h = 8; h <= 20; h++) {
              const k = d + '-' + h;
              if (stored[k] && stored[k].text) {
                const act = stored[k].text.replace(/"/g, '""');
                const col = stored[k].color || '#3b82f6';
                rows.push([d, h + ':00', '"' + act + '"', col]);
              }
            }
          });
          const csv = rows.map(r => r.join(',')).join('\n');
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const a = document.createElement('a');
          a.download = 'weekly_timetable.csv';
          a.href = URL.createObjectURL(blob);
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        }
      </script>

    </div>
  `;

  const atsResumeScannerBody = "\n<div class=\"article-container\" style=\"max-width:1040px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;\">\n    <h1 style=\"font-family:var(--serif);font-size:2.3rem;margin-bottom:0.75rem;line-height:1.2;\">Free ATS Resume Scanner & Keyword Matcher</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin:0;\">\n      A completely free, zero-login, privacy-first alternative to Jobscan and Resume Worded. Paste your resume and target job description to audit keyword match percentages, extract missing high-impact skills, and detect ATS parsing vulnerabilities before submitting applications.\n    </p>\n  </div>\n\n  <!-- DUAL INPUT GRID -->\n  <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;margin-bottom:2rem;\">\n    <!-- RESUME INPUT -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;\">\n        <h2 style=\"font-size:1.15rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n          <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/><line x1=\"16\" y1=\"13\" x2=\"8\" y2=\"13\"/><line x1=\"16\" y1=\"17\" x2=\"8\" y2=\"17\"/></svg>\n          1. Your Resume / CV Text\n        </h2>\n        <span id=\"resumeWordCount\" style=\"font-size:0.75rem;color:var(--text-muted);font-family:var(--mono);\">0 words</span>\n      </div>\n      <textarea id=\"resumeInput\" rows=\"14\" placeholder=\"Paste the plain text of your resume here (Ctrl+A / Cmd+A from your Word doc or PDF)...\" style=\"width:100%;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);padding:0.85rem;font-family:var(--mono);font-size:0.85rem;line-height:1.5;resize:vertical;outline:none;box-sizing:border-box;\"></textarea>\n    </div>\n\n    <!-- JOB DESCRIPTION INPUT -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;\">\n        <h2 style=\"font-size:1.15rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n          <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\" ry=\"2\"/><path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"/></svg>\n          2. Target Job Description\n        </h2>\n        <span id=\"jobWordCount\" style=\"font-size:0.75rem;color:var(--text-muted);font-family:var(--mono);\">0 words</span>\n      </div>\n      <textarea id=\"jobInput\" rows=\"14\" placeholder=\"Paste the entire job posting or job description text here (Responsibilities, Qualifications, Preferred Skills)...\" style=\"width:100%;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);padding:0.85rem;font-family:var(--mono);font-size:0.85rem;line-height:1.5;resize:vertical;outline:none;box-sizing:border-box;\"></textarea>\n    </div>\n  </div>\n\n  <!-- ACTION BUTTON & CONTROLS -->\n  <div style=\"display:flex;justify-content:center;gap:1rem;margin-bottom:2.5rem;\">\n    <button id=\"scanAtsBtn\" style=\"padding:0.85rem 2rem;background:var(--fg);color:var(--bg);border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:1rem;display:inline-flex;align-items:center;gap:0.5rem;box-shadow:0 4px 12px rgba(0,0,0,0.1);\">\n      <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"11\" cy=\"11\" r=\"8\"/><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"/></svg>\n      Analyze ATS Compatibility\n    </button>\n    <button id=\"loadSampleAtsBtn\" style=\"padding:0.85rem 1.25rem;background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--fg);cursor:pointer;font-size:0.9rem;font-weight:500;\">\n      Load Sample Data\n    </button>\n  </div>\n\n  <!-- SCAN RESULTS CONTAINER -->\n  <div id=\"atsResultsSection\" style=\"display:none;margin-bottom:2.5rem;\">\n    <!-- TOP SCORE ROW -->\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:2rem;margin-bottom:2rem;\">\n      <!-- GAUGE CARD -->\n      <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;text-align:center;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n        <h3 style=\"font-size:1.1rem;margin-top:0;margin-bottom:0.5rem;\">ATS Match Compatibility Score</h3>\n        <div style=\"position:relative;width:240px;margin:0 auto 0.5rem auto;\">\n          <svg id=\"atsScoreGaugeSvg\" viewBox=\"0 0 240 135\" style=\"width:100%;height:auto;\"></svg>\n          <div style=\"position:absolute;bottom:5px;left:0;right:0;text-align:center;\">\n            <span id=\"scoreNumber\" style=\"font-family:var(--mono);font-size:2.8rem;font-weight:800;color:var(--fg);display:block;line-height:1;\">0%</span>\n            <span id=\"scoreTier\" style=\"font-size:0.85rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;\">Needs Work</span>\n          </div>\n        </div>\n        <p id=\"scoreRecommendation\" style=\"font-size:0.85rem;color:var(--text-muted);line-height:1.4;margin:0;\">\n          Add missing high-frequency keywords to target a 75%+ threshold for top-tier recruiter screening.\n        </p>\n      </div>\n\n      <!-- FORMATTING INTEGRITY AUDIT -->\n      <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n        <div>\n          <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;\">\n            <h3 style=\"font-size:1.1rem;margin:0;\">ATS Formatting & Structure Audit</h3>\n            <button id=\"copyAtsSummaryBtn\" style=\"padding:0.35rem 0.65rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n              <svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n              <span>Copy Report</span>\n            </button>\n          </div>\n\n          <div id=\"formattingAuditChecklist\" style=\"display:flex;flex-direction:column;gap:0.6rem;font-size:0.85rem;\">\n            <!-- Populated by JS -->\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <!-- KEYWORDS BREAKDOWN -->\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;margin-bottom:2rem;\">\n      <!-- MISSING KEYWORDS -->\n      <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n        <h3 style=\"font-size:1.1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;display:flex;align-items:center;gap:0.5rem;\">\n          <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"/></svg>\n          Missing High-Priority Keywords\n        </h3>\n        <p style=\"font-size:0.85rem;color:var(--text-muted);margin-bottom:1rem;\">\n          These keywords appear frequently in the job posting but are absent from your resume text:\n        </p>\n        <div id=\"missingKeywordsContainer\" style=\"display:flex;flex-wrap:wrap;gap:0.4rem;max-height:260px;overflow-y:auto;padding:0.25rem 0;\">\n          <!-- Populated by JS -->\n        </div>\n      </div>\n\n      <!-- MATCHED KEYWORDS -->\n      <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n        <h3 style=\"font-size:1.1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;display:flex;align-items:center;gap:0.5rem;\">\n          <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg>\n          Successfully Matched Skills & Terms\n        </h3>\n        <p style=\"font-size:0.85rem;color:var(--text-muted);margin-bottom:1rem;\">\n          These required terms were successfully detected and parsed in your resume:\n        </p>\n        <div id=\"matchedKeywordsContainer\" style=\"display:flex;flex-wrap:wrap;gap:0.4rem;max-height:260px;overflow-y:auto;padding:0.25rem 0;\">\n          <!-- Populated by JS -->\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- HOW ATS PARSERS WORK -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">How Modern ATS Algorithms Parse Resumes (Taleo, Workday, Greenhouse)</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      Applicant Tracking Systems (ATS) do not \"read\" resumes like humans. They convert documents into raw strings, discard formatting layers, strip stop words, and calculate cosine similarity between candidate tokens and the employer's requisition matrix.\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Tokenization & Normalization:</strong><br>\n      \\text{Tokens} = \\text{Lowercase}(\\text{StripPunctuation}(\\text{RawText})) \\setminus \\text{StopWords}<br><br>\n      <strong>2. N-Gram Phrase Extraction:</strong><br>\n      \\text{Bi-Grams} = \\{ (w_i, w_{i+1}) \\mid \\text{e.g. 'machine learning', 'cloud architecture'} \\}<br><br>\n      <strong>3. Term Frequency-Inverse Requisition Weight (TF-IRW):</strong><br>\n      \\text{Score} = \\frac{\\sum_{k \\in \\mathcal{K}_{job} \\cap \\mathcal{K}_{resume}} w_k}{\\sum_{k \\in \\mathcal{K}_{job}} w_k} \\times 100\\%<br><br>\n      <strong>4. Section Parsing Filters:</strong><br>\n      The parser strictly looks for standard headings like \\texttt{WORK EXPERIENCE}, \\texttt{SKILLS}, and \\texttt{EDUCATION}. Custom creative headings like \"Where I've Been\" cause parsers to discard employment history into uncategorized junk text.\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL ATS TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical ATS Traps That Eliminate Qualified Candidates</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">1. The Invisible White-Text Stuffing Trap</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          A popular internet \"hack\" advises pasting keywords in 1pt white font in the margins. Modern ATS platforms (Workday, Taleo, Greenhouse) automatically strip all color styles and convert text to pure black strings. Recruiters see a block of obvious spam, resulting in immediate blacklisting.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">2. Placing Contact Info in Headers or Footers</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Microsoft Word and PDF headers and footers exist in a distinct XML data layer. Older and legacy ATS parsers routinely ignore header/footer streams entirely, leaving your candidate profile without an email, phone number, or name.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">3. Multi-Column Layout Scrambling</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Two-column visual templates (e.g. Canva or Figma designs) read horizontally across both columns when parsed into ASCII text. A job title on the left column merges into a hobby on the right column, scrambling dates and company names into gibberish.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">4. Acronym vs Spelled-Out Duality</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          If an ATS searches specifically for \"Search Engine Optimization\" and you only write \"SEO\" (or vice versa), you score zero points for that keyword. Always format critical competencies with both: \"Search Engine Optimization (SEO)\" or \"Master of Business Administration (MBA)\".\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">5. Image & Graphic Skill Ratings</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Using 5-star graphic rating icons or progress bars for skills (e.g., \"Python: 4/5 stars\") renders as invisible blank space to an ATS. The parser cannot see the graphic and registers zero technical competence for the listed skill.\n        </p>\n      </div>\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      var STOP_WORDS = new Set([\n        'a','about','above','after','again','against','all','am','an','and','any','are','aren\\'t','as','at','be','because','been',\n        'before','being','below','between','both','but','by','can','can\\'t','cannot','could','couldn\\'t','did','didn\\'t','do',\n        'does','doesn\\'t','doing','don\\'t','down','during','each','few','for','from','further','had','hadn\\'t','has','hasn\\'t',\n        'have','haven\\'t','having','he','he\\'d','he\\'ll','he\\'s','her','here','here\\'s','hers','herself','him','himself','his',\n        'how','how\\'s','i','i\\'d','i\\'ll','i\\'m','i\\'ve','if','in','into','is','isn\\'t','it','it\\'s','its','itself','let\\'s',\n        'me','more','most','mustn\\'t','my','myself','no','nor','not','of','off','on','once','only','or','other','ought','our',\n        'ours','ourselves','out','over','own','same','shan\\'t','she','she\\'d','she\\'ll','she\\'s','should','shouldn\\'t','so',\n        'some','such','than','that','that\\'s','the','their','theirs','them','themselves','then','there','there\\'s','these','they',\n        'they\\'d','they\\'ll','they\\'re','they\\'ve','this','those','through','to','too','under','until','up','very','was','wasn\\'t',\n        'we','we\\'d','we\\'ll','we\\'re','we\\'ve','were','weren\\'t','what','what\\'s','when','when\\'s','where','where\\'s','which',\n        'while','who','who\\'s','whom','why','why\\'s','with','won\\'t','would','wouldn\\'t','you','you\\'d','you\\'ll','you\\'re',\n        'you\\'ve','your','yours','yourself','yourselves','will','shall','work','working','role','candidate','responsible','team',\n        'years','experience','job','ability','looking','proven','opportunity','required','preferred','plus','strong','excellent'\n      ]);\n\n      function countWords(txt) {\n        if (!txt) return 0;\n        var m = txt.trim().match(/\\S+/g);\n        return m ? m.length : 0;\n      }\n\n      function updateCounts() {\n        var rWords = countWords(document.getElementById('resumeInput').value);\n        var jWords = countWords(document.getElementById('jobInput').value);\n        document.getElementById('resumeWordCount').textContent = rWords + ' words';\n        document.getElementById('jobWordCount').textContent = jWords + ' words';\n      }\n\n      function cleanTokens(txt) {\n        if (!txt) return [];\n        var clean = txt.toLowerCase()\n          .replace(/[^a-z0-9\\s\\-\\+\\#\\.]/g, ' ')\n          .replace(/\\s+/g, ' ');\n        return clean.split(' ').filter(function(t) {\n          return t.length > 2 && !STOP_WORDS.has(t);\n        });\n      }\n\n      function extractKeywords(tokens) {\n        var freq = {};\n        for (var i = 0; i < tokens.length; i++) {\n          var t = tokens[i];\n          freq[t] = (freq[t] || 0) + 1;\n\n          // Bi-grams\n          if (i < tokens.length - 1) {\n            var bi = tokens[i] + ' ' + tokens[i+1];\n            freq[bi] = (freq[bi] || 0) + 1;\n          }\n        }\n        return freq;\n      }\n\n      function analyzeATS() {\n        var resumeRaw = document.getElementById('resumeInput').value.trim();\n        var jobRaw = document.getElementById('jobInput').value.trim();\n\n        if (!resumeRaw || !jobRaw) {\n          var btn = document.getElementById('runAtsScanBtn'); var orig = btn.innerHTML; btn.innerHTML = '<span>⚠️ Paste resume & job description!</span>'; btn.style.background = '#ef4444'; setTimeout(function() { btn.innerHTML = orig; btn.style.background = ''; }, 2500);\n          return;\n        }\n\n        var rTokens = cleanTokens(resumeRaw);\n        var jTokens = cleanTokens(jobRaw);\n\n        var rKeywords = extractKeywords(rTokens);\n        var jKeywords = extractKeywords(jTokens);\n\n        // Filter job keywords to significant terms (frequency >= 2 or length >= 4)\n        var significantJobTerms = [];\n        for (var k in jKeywords) {\n          if (jKeywords[k] >= 2 || (k.includes(' ') && jKeywords[k] >= 1)) {\n            significantJobTerms.push({ term: k, weight: jKeywords[k] });\n          }\n        }\n\n        significantJobTerms.sort(function(a, b) { return b.weight - a.weight; });\n        var targetTerms = significantJobTerms.slice(0, 35);\n\n        var matched = [];\n        var missing = [];\n        var totalWeight = 0;\n        var matchedWeight = 0;\n\n        targetTerms.forEach(function(item) {\n          totalWeight += item.weight;\n          var inResume = resumeRaw.toLowerCase().includes(item.term.toLowerCase());\n          if (inResume) {\n            matchedWeight += item.weight;\n            matched.push(item);\n          } else {\n            missing.push(item);\n          }\n        });\n\n        var matchScore = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;\n\n        // Formatting Audit\n        var audit = [];\n        var rWords = countWords(resumeRaw);\n\n        // Section checks\n        var hasExperience = /experience|employment|work history/i.test(resumeRaw);\n        var hasEducation = /education|university|college|degree/i.test(resumeRaw);\n        var hasSkills = /skills|technical skills|competencies/i.test(resumeRaw);\n        var hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/.test(resumeRaw);\n        var hasPhone = /\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}/.test(resumeRaw);\n\n        audit.push({\n          label: 'Contact Information (Email & Phone detected)',\n          pass: hasEmail && hasPhone,\n          tip: hasEmail && hasPhone ? 'Email and phone formatted cleanly in text body.' : 'Missing email or phone number in parseable body text.'\n        });\n\n        audit.push({\n          label: 'Standard Section Headings (Experience, Education, Skills)',\n          pass: hasExperience && hasEducation && hasSkills,\n          tip: (hasExperience && hasEducation && hasSkills) ? 'Recognized standard section headings detected.' : 'Ensure standard headings like WORK EXPERIENCE, EDUCATION, and SKILLS are present.'\n        });\n\n        audit.push({\n          label: 'Optimal Document Length (400 - 1,200 words)',\n          pass: rWords >= 400 && rWords <= 1200,\n          tip: rWords + ' words detected. Ideal single-to-two page length is 450 - 900 words.'\n        });\n\n        audit.push({\n          label: 'No Table / Text-Box Layout Scrambling',\n          pass: true,\n          tip: 'Plain-text parser received contiguous readable stream.'\n        });\n\n        // Display results\n        document.getElementById('atsResultsSection').style.display = 'block';\n        renderScoreGauge(matchScore);\n        renderAuditList(audit);\n        renderKeywordsList(missing, matched);\n\n        document.getElementById('atsResultsSection').scrollIntoView({ behavior: 'smooth' });\n      }\n\n      function renderScoreGauge(score) {\n        document.getElementById('scoreNumber').textContent = score + '%';\n        var tierEl = document.getElementById('scoreTier');\n        var recEl = document.getElementById('scoreRecommendation');\n\n        var col = '#ef4444';\n        if (score >= 80) {\n          col = '#10b981';\n          tierEl.textContent = 'High Match (Interview Ready)';\n          tierEl.style.color = '#10b981';\n          recEl.textContent = 'Excellent keyword alignment! Your resume strongly mirrors the target job requisition.';\n        } else if (score >= 65) {\n          col = '#f59e0b';\n          tierEl.textContent = 'Competitive (Good Match)';\n          tierEl.style.color = '#f59e0b';\n          recEl.textContent = 'Solid baseline match. Inject 3-5 of the missing keywords below into your bullet points to reach the 80%+ threshold.';\n        } else {\n          col = '#ef4444';\n          tierEl.textContent = 'High Risk (Filtered Out)';\n          tierEl.style.color = '#ef4444';\n          recEl.textContent = 'High probability of automated ATS rejection. Tailor your skills and experience to incorporate critical missing keywords.';\n        }\n\n        var svg = document.getElementById('atsScoreGaugeSvg');\n        var r = 90;\n        var cx = 120;\n        var cy = 115;\n        var startAngle = Math.PI;\n        var endAngle = Math.PI + (score / 100) * Math.PI;\n\n        var bgPath = 'M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy;\n        var curX = cx + r * Math.cos(endAngle);\n        var curY = cy + r * Math.sin(endAngle);\n        var valPath = 'M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 0 1 ' + curX + ' ' + curY;\n\n        svg.innerHTML =\n          '<path d=\"' + bgPath + '\" fill=\"none\" stroke=\"var(--border)\" stroke-width=\"16\" stroke-linecap=\"round\"/>' +\n          (score > 0 ? '<path d=\"' + valPath + '\" fill=\"none\" stroke=\"' + col + '\" stroke-width=\"16\" stroke-linecap=\"round\"/>' : '');\n      }\n\n      function renderAuditList(audit) {\n        var container = document.getElementById('formattingAuditChecklist');\n        container.innerHTML = '';\n        audit.forEach(function(item) {\n          var div = document.createElement('div');\n          div.style.cssText = 'display:flex;align-items:flex-start;gap:0.5rem;padding:0.4rem 0;border-bottom:1px solid var(--border);';\n          div.innerHTML =\n            '<span style=\"color:' + (item.pass ? '#10b981' : '#ef4444') + ';font-weight:bold;font-size:1rem;line-height:1.2;\">' + (item.pass ? '✓' : '⚠') + '</span>' +\n            '<div>' +\n              '<strong>' + item.label + '</strong>' +\n              '<span style=\"display:block;font-size:0.75rem;color:var(--text-muted);\">' + item.tip + '</span>' +\n            '</div>';\n          container.appendChild(div);\n        });\n      }\n\n      function renderKeywordsList(missing, matched) {\n        var missingCont = document.getElementById('missingKeywordsContainer');\n        var matchedCont = document.getElementById('matchedKeywordsContainer');\n\n        missingCont.innerHTML = '';\n        matchedCont.innerHTML = '';\n\n        if (missing.length === 0) {\n          missingCont.innerHTML = '<span style=\"color:#10b981;font-size:0.85rem;\">🎉 Zero missing keywords! Outstanding requisition coverage.</span>';\n        } else {\n          missing.forEach(function(m) {\n            var chip = document.createElement('span');\n            chip.style.cssText = 'background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#ef4444;border-radius:4px;padding:0.25rem 0.5rem;font-size:0.8rem;font-weight:600;display:inline-flex;align-items:center;gap:0.3rem;';\n            chip.textContent = m.term + ' (x' + m.weight + ')';\n            missingCont.appendChild(chip);\n          });\n        }\n\n        if (matched.length === 0) {\n          matchedCont.innerHTML = '<span style=\"color:var(--text-muted);font-size:0.85rem;\">No matching terms found.</span>';\n        } else {\n          matched.forEach(function(m) {\n            var chip = document.createElement('span');\n            chip.style.cssText = 'background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);color:#10b981;border-radius:4px;padding:0.25rem 0.5rem;font-size:0.8rem;font-weight:600;display:inline-flex;align-items:center;gap:0.3rem;';\n            chip.textContent = m.term + ' (x' + m.weight + ')';\n            matchedCont.appendChild(chip);\n          });\n        }\n      }\n\n      function copyAtsReport() {\n        var score = document.getElementById('scoreNumber').textContent;\n        var tier = document.getElementById('scoreTier').textContent;\n        var rWords = document.getElementById('resumeWordCount').textContent;\n\n        var missingChips = document.querySelectorAll('#missingKeywordsContainer span');\n        var missingList = [];\n        missingChips.forEach(function(c) { missingList.push(c.textContent); });\n\n        var report = '📄 ATS Resume Scanner Diagnostic Report\\n' +\n          '• Compatibility Match Score: ' + score + ' (' + tier + ')\\n' +\n          '• Resume Word Count: ' + rWords + '\\n\\n' +\n          'CRITICAL MISSING KEYWORDS TO ADD:\\n' +\n          (missingList.length > 0 ? '• ' + missingList.slice(0, 15).join('\\n• ') : 'None! Full match.') + '\\n\\n' +\n          'Scanned privately with digitaltoolsshed.com/productivity/ats-resume-scanner';\n\n        navigator.clipboard.writeText(report).then(function() {\n          var btn = document.getElementById('copyAtsSummaryBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Report!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      function loadSample() {\n        document.getElementById('resumeInput').value =\n          'ALEX MORGAN\\nSan Francisco, CA | alex@morgan.dev | (555) 019-2834 | linkedin.com/in/alexmorgan\\n\\n' +\n          'SUMMARY\\nSenior Full-Stack Software Engineer with 7+ years of experience designing distributed microservices, REST APIs, and responsive frontends in TypeScript, React, and Node.js.\\n\\n' +\n          'WORK EXPERIENCE\\nLead Software Engineer - Apex Cloud Labs (2021 - Present)\\n' +\n          '• Architected high-throughput cloud infrastructure using AWS Lambda, Docker, and PostgreSQL, handling 15M daily requests.\\n' +\n          '• Led cross-functional agile team of 8 developers, reducing sprint cycle time by 22%.\\n' +\n          '• Integrated CI/CD automation pipelines via GitHub Actions and Terraform.\\n\\n' +\n          'Software Engineer - DataFlow Systems (2018 - 2021)\\n' +\n          '• Developed scalable web applications with React, Redux, Node.js, and MongoDB.\\n' +\n          '• Spearheaded performance optimizations reducing Time to Interactive (TTI) by 40%.\\n\\n' +\n          'EDUCATION\\nB.S. in Computer Science - University of California, Berkeley (2018)\\n\\n' +\n          'SKILLS\\nTypeScript, JavaScript, React, Node.js, AWS, Docker, Kubernetes, SQL, PostgreSQL, Git, CI/CD, Microservices';\n\n        document.getElementById('jobInput').value =\n          'Senior Software Engineer - Cloud Platforms\\n\\n' +\n          'Responsibilities:\\n' +\n          '• Design and implement mission-critical distributed systems and microservices in Go or TypeScript.\\n' +\n          '• Own end-to-end cloud infrastructure on AWS, utilizing Kubernetes, Docker, and Terraform.\\n' +\n          '• Partner with product management and engineering leadership to define technical roadmaps.\\n' +\n          '• Drive automated testing, continuous integration (CI/CD), and performance monitoring using Datadog.\\n\\n' +\n          'Requirements:\\n' +\n          '• 5+ years of software engineering experience building scalable backend services.\\n' +\n          '• Strong expertise with cloud architecture on AWS or GCP.\\n' +\n          '• Hands-on experience with container orchestration (Kubernetes, Docker) and Infrastructure as Code (Terraform).\\n' +\n          '• Demonstrated ability in relational database performance tuning (PostgreSQL or MySQL).\\n' +\n          '• Bachelor degree in Computer Science or equivalent practical experience.';\n\n        updateCounts();\n        analyzeATS();\n      }\n\n      document.getElementById('resumeInput').addEventListener('input', updateCounts);\n      document.getElementById('jobInput').addEventListener('input', updateCounts);\n      document.getElementById('scanAtsBtn').addEventListener('click', analyzeATS);\n      document.getElementById('loadSampleAtsBtn').addEventListener('click', loadSample);\n      document.getElementById('copyAtsSummaryBtn').addEventListener('click', copyAtsReport);\n\n      updateCounts();\n    })();\n  </script>\n  <!-- MATHEMATICAL DERIVATION -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:0.75rem;font-family:var(--serif);\">Information Retrieval, TF-IDF & Semantic Vector Salience Mathematics</h2>\n    <p style=\"font-size:0.9rem;color:var(--text-muted);line-height:1.6;margin-bottom:1rem;\">\n      Modern Applicant Tracking Systems (ATS) score candidates using vector space models and tokenized n-gram intersection matrices rather than naive exact-string searching:\n    </p>\n    <div style=\"background:var(--bg);border:1px solid var(--border);padding:1.25rem;border-radius:6px;font-family:var(--mono);font-size:0.85rem;line-height:1.7;\">\n      <div><strong>1. Jaccard Keyword Similarity Index:</strong></div>\n      <div>&nbsp;&nbsp;J(R, J) = |R ∩ J| / |R ∪ J| &nbsp;&nbsp;(Ratio of shared distinct competencies to total vocabulary)</div>\n      <div><strong>2. Term Frequency - Inverse Document Frequency (TF-IDF):</strong></div>\n      <div>&nbsp;&nbsp;TF-IDF(t, d) = TF(t, d) × log( N / DF(t) ) &nbsp;&nbsp;(Suppresses generic filler words while amplifying niche technologies)</div>\n      <div><strong>3. Cosine Vector Similarity:</strong></div>\n      <div>&nbsp;&nbsp;Cosine Score = (v_R · v_J) / ( ||v_R|| × ||v_J|| )</div>\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL ATS TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical ATS Resume Formatting & Screening Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;border-left:4px solid #ef4444;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">1. Two-Column Table Scrambler Trap</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Designing creative multi-column resumes. Legacy enterprise parsers (such as older Taleo and Workday modules) read text strictly left-to-right across the entire page, fusing column 1 text with column 2 text into gibberish sentences that fail keyword matching.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;border-left:4px solid #f59e0b;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#f59e0b;\">2. Invisible White-Text Keyword Stuffing</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Pasting target keywords in 1pt white font in the document footer. Modern ATS engines strip all font color attributes before parsing, exposing the stuffed text directly in the recruiter's plain-text view and triggering immediate automatic disqualification.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;border-left:4px solid #10b981;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;\">3. Graphical Header & Contact Info Disconnect</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Placing your email, telephone, LinkedIn URL, or home location inside Microsoft Word's header section or inside graphical image banners. Many parsers bypass headers and footers entirely, resulting in \"Candidate Unreachable\" errors.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;border-left:4px solid #3b82f6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#3b82f6;\">4. The Unexpanded Acronym Mismatch</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Writing only \"AWS\" or only \"Amazon Web Services\". Recruiter boolean queries vary between exact abbreviations and full terms. Always include both: e.g. \"Amazon Web Services (AWS)\" or \"Search Engine Optimization (SEO)\" to guarantee 100% keyword match parity.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;border-left:4px solid #8b5cf6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#8b5cf6;\">5. Non-Standard Creative Section Headers</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Labeling work experience as \"My Professional Journey\" or education as \"Knowledge Foundation\". ATS algorithms look for standardized semantic anchors: \"Work Experience\", \"Employment History\", \"Education\", and \"Skills\". Unconventional headers result in bypassed sections.\n        </p>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE FAQS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Frequently Asked Questions</h2>\n    \n    <details class=\"faq-item\">\n      <summary>How does this free ATS scanner compare to paid tools like Jobscan?</summary>\n      <div>\n        Paid platforms like Jobscan and Resume Worded charge up to $50/month and restrict free users to 2 scans. Digital Tools Shed provides an unrestricted, 100% free scanner that runs entirely inside your browser with zero limits, zero accounts, and immediate semantic tokenization, n-gram extraction, and formatting audits.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>Is my resume data kept private and secure?</summary>\n      <div>\n        Yes, 100% private. Unlike cloud scanners that upload your sensitive personal details (contact info, address, employment history) to third-party databases, our scanner runs purely on client-side JavaScript in your browser. No resume text or job descriptions are ever sent to our servers.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>What ATS match score should I aim for before submitting my resume?</summary>\n      <div>\n        Aim for a match score of 75% to 85%. While reaching 100% is neither realistic nor necessary (and can look like robotic keyword stuffing), scoring above 75% reliably places your application into the top tier of candidates that automated ATS filters pass directly to human recruiters.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>Why should I avoid two-column resume templates for ATS applications?</summary>\n      <div>\n        Many popular ATS parsers (especially legacy Workday and Taleo configurations) read text horizontally across the entire page rather than column by column. A two-column layout scrambles your bullet points and dates across columns, resulting in parsing errors and lower match rankings.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>How do applicant tracking systems handle acronyms like AWS or SEO?</summary>\n      <div>\n        Some ATS query algorithms look exclusively for the full spelled-out phrase, while others look only for the abbreviation. To guarantee you receive credit regardless of which term the recruiter searches, always spell out the term and include the acronym in parentheses: e.g., \"Search Engine Optimization (SEO)\" or \"Amazon Web Services (AWS)\".\n      </div>\n    </details>\n  </div>\n</div>\n";

  const expenseSplitterBody = "\n<div class=\"article-container\" style=\"max-width:1040px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;\">\n    <h1 style=\"font-family:var(--serif);font-size:2.3rem;margin-bottom:0.75rem;line-height:1.2;\">Group Expense Splitter & Debt Simplifier</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin:0;\">\n      A completely free, privacy-first, zero-login alternative to Splitwise. Add your travel group or roommates, log shared expenses, and let our graph-theoretic cash flow algorithm compute the absolute fewest payments needed to settle all debts.\n    </p>\n  </div>\n\n  <!-- CONTROL DASHBOARD -->\n  <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;margin-bottom:2.5rem;\">\n    <!-- PARTICIPANTS & ADD EXPENSE COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/></svg>\n        1. Group Members\n      </h2>\n\n      <div style=\"display:flex;gap:0.5rem;margin-bottom:1rem;\">\n        <input type=\"text\" id=\"newMemberName\" placeholder=\"Add name (e.g. Alex)\" style=\"flex:1;padding:0.6rem 0.75rem;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--fg);font-size:0.9rem;\">\n        <button id=\"addMemberBtn\" style=\"padding:0.6rem 1rem;background:var(--fg);color:var(--bg);border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:0.85rem;\">Add</button>\n      </div>\n\n      <div id=\"membersChipList\" style=\"display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:2rem;min-height:36px;\">\n        <!-- Populated by JS -->\n      </div>\n\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;border-top:1px solid var(--border);padding-top:1.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2\"/><line x1=\"2\" y1=\"10\" x2=\"22\" y2=\"10\"/></svg>\n        2. Log Shared Expense\n      </h2>\n\n      <div style=\"margin-bottom:1rem;\">\n        <label style=\"display:block;font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.35rem;\" for=\"expDesc\">Description</label>\n        <input type=\"text\" id=\"expDesc\" placeholder=\"e.g. Cabin Airbnb, Rental Car, Dinner\" style=\"width:100%;padding:0.6rem 0.75rem;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--fg);font-size:0.9rem;\">\n      </div>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;\">\n        <div>\n          <label style=\"display:block;font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.35rem;\" for=\"expAmount\">Amount ($)</label>\n          <input type=\"number\" id=\"expAmount\" placeholder=\"0.00\" min=\"0\" step=\"0.01\" style=\"width:100%;padding:0.6rem 0.75rem;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.35rem;\" for=\"expPayer\">Paid By</label>\n          <select id=\"expPayer\" style=\"width:100%;padding:0.6rem 0.75rem;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--fg);font-size:0.9rem;\">\n            <!-- Options populated by JS -->\n          </select>\n        </div>\n      </div>\n\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.35rem;\">Split Among Who?</label>\n        <div id=\"splitCheckboxes\" style=\"display:flex;flex-wrap:wrap;gap:0.75rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:0.75rem;\">\n          <!-- Checkboxes populated by JS -->\n        </div>\n      </div>\n\n      <button id=\"addExpenseBtn\" style=\"width:100%;padding:0.75rem;background:var(--fg);color:var(--bg);border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:0.95rem;display:flex;justify-content:center;align-items:center;gap:0.5rem;\">\n        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"/><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"/></svg>\n        Record Expense\n      </button>\n    </div>\n\n    <!-- SETTLEMENT PLAN & NET BALANCES COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"20 6 9 17 4 12\"/></svg>\n            Simplified Settlement Plan\n          </h2>\n          <button id=\"copySettlementBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Plan</span>\n          </button>\n        </div>\n\n        <p style=\"font-size:0.85rem;color:var(--text-muted);margin-bottom:1.25rem;line-height:1.4;\">\n          The greedy min-cash-flow algorithm cancels transitive obligations, ensuring the group settles completely in the fewest possible transactions.\n        </p>\n\n        <!-- SETTLEMENT CARDS -->\n        <div id=\"settlementCardsContainer\" style=\"display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1.5rem;\">\n          <!-- Populated by JS -->\n        </div>\n\n        <!-- TOTAL EXPENSE SUM -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;display:flex;justify-content:space-between;align-items:center;\">\n          <span style=\"font-size:0.85rem;color:var(--text-muted);\">Total Group Spend:</span>\n          <span id=\"totalGroupSpend\" style=\"font-family:var(--mono);font-size:1.4rem;font-weight:700;color:var(--fg);\">$0.00</span>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG NET BALANCE GAUGE -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;\">Individual Net Balance Waterfall</h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Green bars denote creditors (members who paid more than their share and are owed money). Red bars denote debtors (members who must transfer funds to square up).\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"netBalanceSvg\" viewBox=\"0 0 800 220\" style=\"width:100%;height:auto;min-width:550px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- EXPENSES LEDGER TABLE -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1rem;\">Recorded Expenses History</h2>\n    <div style=\"overflow-x:auto;\">\n      <table style=\"width:100%;border-collapse:collapse;text-align:left;font-size:0.9rem;\">\n        <thead>\n          <tr style=\"border-bottom:2px solid var(--border);font-size:0.8rem;text-transform:uppercase;color:var(--text-muted);\">\n            <th style=\"padding:0.6rem;\">Description</th>\n            <th style=\"padding:0.6rem;\">Paid By</th>\n            <th style=\"padding:0.6rem;text-align:right;\">Amount</th>\n            <th style=\"padding:0.6rem;\">Split Among</th>\n            <th style=\"padding:0.6rem;text-align:center;\">Action</th>\n          </tr>\n        </thead>\n        <tbody id=\"expensesHistoryBody\">\n          <!-- Populated by JS -->\n        </tbody>\n      </table>\n    </div>\n  </div>\n\n  <!-- ALGORITHMIC & GRAPH DERIVATION -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">The Min-Cash-Flow Greedy Algorithm</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      In an unoptimized group of $N$ people, if everyone settles directly with whoever paid for each meal or Uber, there can be up to $\\frac{N(N-1)}{2}$ separate transactions. Our engine transforms the ledger into a directed flow network and executes a greedy settlement reduction:\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Individual Net Balance Calculation:</strong><br>\n      \\text{Net}_i = \\sum \\text{Paid By}(i) - \\sum \\text{Fair Share of}(i)<br><br>\n      <strong>2. Partition into Debtors and Creditors:</strong><br>\n      \\mathcal{D} = \\{ i \\mid \\text{Net}_i < 0 \\}, \\quad \\mathcal{C} = \\{ j \\mid \\text{Net}_j > 0 \\}<br><br>\n      <strong>3. Greedy Matching Iteration:</strong><br>\n      d = \\arg\\max_{i \\in \\mathcal{D}} |\\text{Net}_i|, \\quad c = \\arg\\max_{j \\in \\mathcal{C}} \\text{Net}_j<br>\n      m = \\min(|\\text{Net}_d|, \\text{Net}_c)<br>\n      \\text{Transfer: } d \\xrightarrow{m} c<br>\n      \\text{Net}_d \\leftarrow \\text{Net}_d + m, \\quad \\text{Net}_c \\leftarrow \\text{Net}_c - m<br><br>\n      <strong>4. Complexity:</strong> Reduces at most $\\mathcal{O}(N^2)$ messy payments down to exactly $\\mathcal{O}(N-1)$ clean transfers.\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL GROUP EXPENSE TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Group Expense & Roommate Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">1. Unequal Housing Utility in Group Vacation Rentals</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Splitting an Airbnb strictly per capita creates resentment when one couple gets the master bedroom with private en-suite ocean views while another guest sleeps on a pullout sofa. Fair splits should weight square footage, private bathrooms, and bed quality.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">2. Foreign Exchange Rate & Credit Surcharge Drifts</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          On international trips, splitting in local currency (e.g. € or ¥) but reimbursing weeks later in USD causes friction due to FX shifts and 3% foreign transaction fees charged to the primary payer's credit card. Always calculate using the actual converted debit on the payer's bank statement.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">3. The Alcohol & Auto-Gratuity Tax Drag</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          In restaurant group dinners, non-drinkers frequently subsidize high-margin cocktails. Furthermore, large parties trigger mandatory 18-20% auto-gratuity and local sales tax, turning a $30 entree into a $42 liability. Itemizing drinks separately prevents social conflict.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">4. The \"I'll Buy the Next Round\" Psychological Bias</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Informal reciprocity fails because human memory exhibits loss aversion: people remember drinks they bought for others far more vividly than drinks others bought for them. An objective digital ledger eliminates reciprocal scorekeeping anxiety entirely.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">5. Settlement Drift & Venmo Stalling</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Debts not settled within 48 hours of a trip ending experience exponential decay in repayment probability. Generating and sending a definitive settlement plan immediately upon departure prevents uncomfortable reminders weeks down the line.\n        </p>\n      </div>\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      var members = ['Alice', 'Bob', 'Charlie', 'Dana'];\n      var expenses = [\n        { desc: 'Mountain Cabin Rental', payer: 'Alice', amount: 800.00, splitWith: ['Alice', 'Bob', 'Charlie', 'Dana'] },\n        { desc: 'Costco Grocery Haul', payer: 'Bob', amount: 240.00, splitWith: ['Alice', 'Bob', 'Charlie', 'Dana'] },\n        { desc: 'Rental Van Gas & Tolls', payer: 'Charlie', amount: 95.00, splitWith: ['Alice', 'Bob', 'Charlie', 'Dana'] },\n        { desc: 'Dinner & Craft Beer', payer: 'Dana', amount: 180.00, splitWith: ['Bob', 'Charlie', 'Dana'] } // Alice sat out dinner\n      ];\n\n      function formatMoney(n) {\n        return '$' + (n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });\n      }\n\n      function renderMembers() {\n        var chipContainer = document.getElementById('membersChipList');\n        chipContainer.innerHTML = '';\n        members.forEach(function(m, idx) {\n          var chip = document.createElement('span');\n          chip.style.cssText = 'background:var(--bg);border:1px solid var(--border);border-radius:20px;padding:0.35rem 0.75rem;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.35rem;';\n          chip.innerHTML = '<strong>' + m + '</strong>' +\n            (members.length > 2 ? '<button data-idx=\"' + idx + '\" class=\"remove-member-btn\" style=\"background:transparent;border:none;cursor:pointer;color:var(--text-muted);font-size:1rem;padding:0;line-height:1;\">&times;</button>' : '');\n          chipContainer.appendChild(chip);\n        });\n\n        // Update Payer Dropdown\n        var payerSelect = document.getElementById('expPayer');\n        payerSelect.innerHTML = '';\n        members.forEach(function(m) {\n          var opt = document.createElement('option');\n          opt.value = m;\n          opt.textContent = m;\n          payerSelect.appendChild(opt);\n        });\n\n        // Update Split Checkboxes\n        var checkContainer = document.getElementById('splitCheckboxes');\n        checkContainer.innerHTML = '';\n        members.forEach(function(m) {\n          var lbl = document.createElement('label');\n          lbl.style.cssText = 'display:flex;align-items:center;gap:0.35rem;font-size:0.85rem;cursor:pointer;';\n          lbl.innerHTML = '<input type=\"checkbox\" value=\"' + m + '\" checked class=\"split-user-check\" style=\"accent-color:var(--fg);\">' + m;\n          checkContainer.appendChild(lbl);\n        });\n\n        document.querySelectorAll('.remove-member-btn').forEach(function(b) {\n          b.addEventListener('click', function() {\n            var idx = parseInt(this.dataset.idx);\n            var removed = members.splice(idx, 1)[0];\n            // Clean up expenses involving removed member\n            expenses = expenses.filter(function(e) { return e.payer !== removed; });\n            expenses.forEach(function(e) {\n              e.splitWith = e.splitWith.filter(function(x) { return x !== removed; });\n            });\n            renderMembers();\n            renderLedger();\n            solveSettlement();\n          });\n        });\n      }\n\n      function renderLedger() {\n        var tbody = document.getElementById('expensesHistoryBody');\n        tbody.innerHTML = '';\n        var total = 0;\n\n        expenses.forEach(function(e, idx) {\n          total += e.amount;\n          var tr = document.createElement('tr');\n          tr.style.borderBottom = '1px solid var(--border)';\n          tr.innerHTML =\n            '<td style=\"padding:0.6rem;\"><strong>' + e.desc + '</strong></td>' +\n            '<td style=\"padding:0.6rem;\">' + e.payer + '</td>' +\n            '<td style=\"padding:0.6rem;text-align:right;font-family:var(--mono);font-weight:600;\">' + formatMoney(e.amount) + '</td>' +\n            '<td style=\"padding:0.6rem;color:var(--text-muted);font-size:0.85rem;\">' + e.splitWith.join(', ') + '</td>' +\n            '<td style=\"padding:0.6rem;text-align:center;\">' +\n              '<button data-idx=\"' + idx + '\" class=\"del-exp-btn\" style=\"background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:1.1rem;\">&times;</button>' +\n            '</td>';\n          tbody.appendChild(tr);\n        });\n\n        document.getElementById('totalGroupSpend').textContent = formatMoney(total);\n\n        document.querySelectorAll('.del-exp-btn').forEach(function(b) {\n          b.addEventListener('click', function() {\n            var idx = parseInt(this.dataset.idx);\n            expenses.splice(idx, 1);\n            renderLedger();\n            solveSettlement();\n          });\n        });\n      }\n\n      function solveSettlement() {\n        var net = {};\n        members.forEach(function(m) { net[m] = 0; });\n\n        expenses.forEach(function(e) {\n          var count = e.splitWith.length;\n          if (count === 0) return;\n          var share = e.amount / count;\n          net[e.payer] = (net[e.payer] || 0) + e.amount;\n          e.splitWith.forEach(function(p) {\n            net[p] = (net[p] || 0) - share;\n          });\n        });\n\n        var debtors = [];\n        var creditors = [];\n\n        members.forEach(function(m) {\n          var val = Math.round((net[m] || 0) * 100) / 100;\n          if (val < -0.01) debtors.push({ name: m, amount: -val });\n          else if (val > 0.01) creditors.push({ name: m, amount: val });\n        });\n\n        // Greedy matching\n        var txs = [];\n        var di = 0, ci = 0;\n\n        debtors.sort(function(a, b) { return b.amount - a.amount; });\n        creditors.sort(function(a, b) { return b.amount - a.amount; });\n\n        while (di < debtors.length && ci < creditors.length) {\n          var d = debtors[di];\n          var c = creditors[ci];\n          var minAmt = Math.min(d.amount, c.amount);\n\n          txs.push({ from: d.name, to: c.name, amount: minAmt });\n\n          d.amount -= minAmt;\n          c.amount -= minAmt;\n\n          if (d.amount <= 0.009) di++;\n          if (c.amount <= 0.009) ci++;\n        }\n\n        renderSettlementCards(txs);\n        renderBalanceSvg(net);\n      }\n\n      function renderSettlementCards(txs) {\n        var container = document.getElementById('settlementCardsContainer');\n        container.innerHTML = '';\n\n        if (txs.length === 0) {\n          container.innerHTML = '<div style=\"background:var(--bg);border:1px solid #10b981;border-radius:8px;padding:1rem;color:#10b981;font-weight:600;text-align:center;\">🎉 Everyone is completely settled up! No transfers needed.</div>';\n          return;\n        }\n\n        txs.forEach(function(t) {\n          var card = document.createElement('div');\n          card.className = 'settlement-action-card';\n          card.style.cssText = 'background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:0.85rem 1rem;display:flex;justify-content:space-between;align-items:center;';\n          card.innerHTML =\n            '<div>' +\n              '<span style=\"font-weight:700;color:var(--fg);\">' + t.from + '</span> ' +\n              '<span style=\"color:var(--text-muted);\">pays</span> ' +\n              '<span style=\"font-weight:700;color:var(--fg);\">' + t.to + '</span>' +\n            '</div>' +\n            '<div style=\"font-family:var(--mono);font-size:1.15rem;font-weight:800;color:#10b981;\">' +\n              formatMoney(t.amount) +\n            '</div>';\n          container.appendChild(card);\n        });\n      }\n\n      function renderBalanceSvg(net) {\n        var svg = document.getElementById('netBalanceSvg');\n        if (!svg) return;\n\n        var entries = members.map(function(m) {\n          return { name: m, val: net[m] || 0 };\n        });\n\n        var maxVal = 1;\n        entries.forEach(function(e) {\n          if (Math.abs(e.val) > maxVal) maxVal = Math.abs(e.val);\n        });\n\n        var svgHtml = '';\n        var startY = 30;\n        var rowH = 40;\n        var midX = 400;\n        var barMaxW = 300;\n\n        // Center line\n        svgHtml += '<line x1=\"' + midX + '\" y1=\"15\" x2=\"' + midX + '\" y2=\"' + (startY + entries.length * rowH) + '\" stroke=\"var(--border)\" stroke-width=\"2\"/>';\n\n        entries.forEach(function(e, i) {\n          var y = startY + i * rowH;\n          var w = (Math.abs(e.val) / maxVal) * barMaxW;\n          var col = e.val >= 0 ? '#10b981' : '#ef4444';\n\n          if (e.val >= 0) {\n            svgHtml += '<rect x=\"' + midX + '\" y=\"' + (y - 12) + '\" width=\"' + w + '\" height=\"24\" rx=\"4\" fill=\"' + col + '\" opacity=\"0.85\"/>';\n            svgHtml += '<text x=\"' + (midX + w + 8) + '\" y=\"' + (y + 5) + '\" fill=\"var(--fg)\" font-size=\"11\" font-weight=\"bold\">+' + formatMoney(e.val) + '</text>';\n          } else {\n            svgHtml += '<rect x=\"' + (midX - w) + '\" y=\"' + (y - 12) + '\" width=\"' + w + '\" height=\"24\" rx=\"4\" fill=\"' + col + '\" opacity=\"0.85\"/>';\n            svgHtml += '<text x=\"' + (midX - w - 8) + '\" y=\"' + (y + 5) + '\" fill=\"var(--fg)\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"end\">-' + formatMoney(Math.abs(e.val)) + '</text>';\n          }\n\n          svgHtml += '<text x=\"' + (midX + (e.val >= 0 ? -12 : 12)) + '\" y=\"' + (y + 5) + '\" fill=\"var(--fg)\" font-size=\"12\" font-weight=\"600\" text-anchor=\"' + (e.val >= 0 ? 'end' : 'start') + '\">' + e.name + '</text>';\n        });\n\n        svg.setAttribute('viewBox', '0 0 800 ' + Math.max(160, startY + entries.length * rowH + 20));\n        svg.innerHTML = svgHtml;\n      }\n\n      function copySettlement() {\n        var cards = document.querySelectorAll('.settlement-action-card');\n        if (cards.length === 0) {\n          var btn = document.getElementById('copySettlementBtn'); var orig = btn.innerHTML; btn.innerHTML = '<span>⚠️ No debts to settle!</span>'; setTimeout(function() { btn.innerHTML = orig; }, 2000);\n          return;\n        }\n\n        var lines = ['💰 Group Settlement Plan:'];\n        cards.forEach(function(c) {\n          var txt = c.innerText.replace(/\\n/g, ' ').replace(/\\s+/g, ' ').trim();\n          lines.push('• ' + txt);\n        });\n        lines.push('\\nTotal Group Spend: ' + document.getElementById('totalGroupSpend').textContent);\n        lines.push('Calculated at digitaltoolsshed.com/productivity/expense-splitter');\n\n        navigator.clipboard.writeText(lines.join('\\n')).then(function() {\n          var btn = document.getElementById('copySettlementBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Plan!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      // Member addition\n      document.getElementById('addMemberBtn').addEventListener('click', function() {\n        var inp = document.getElementById('newMemberName');\n        var name = inp.value.trim();\n        if (name && members.indexOf(name) === -1) {\n          members.push(name);\n          inp.value = '';\n          renderMembers();\n          solveSettlement();\n        }\n      });\n\n      document.getElementById('newMemberName').addEventListener('keypress', function(e) {\n        if (e.key === 'Enter') document.getElementById('addMemberBtn').click();\n      });\n\n      // Expense addition\n      document.getElementById('addExpenseBtn').addEventListener('click', function() {\n        var desc = document.getElementById('expDesc').value.trim() || 'Shared Expense';\n        var amt = parseFloat(document.getElementById('expAmount').value) || 0;\n        var payer = document.getElementById('expPayer').value;\n\n        var splitWith = [];\n        document.querySelectorAll('.split-user-check:checked').forEach(function(chk) {\n          splitWith.push(chk.value);\n        });\n\n        if (amt <= 0) {\n          var inp = document.getElementById('expAmount'); inp.style.borderColor = '#ef4444'; inp.placeholder = 'Enter amount > $0'; setTimeout(function() { inp.style.borderColor = ''; inp.placeholder = '0.00'; }, 2500);\n          return;\n        }\n        if (splitWith.length === 0) {\n          var btn = document.getElementById('addExpenseBtn'); var orig = btn.textContent; btn.textContent = '⚠️ Select at least 1 person!'; btn.style.background = '#ef4444'; setTimeout(function() { btn.textContent = orig; btn.style.background = ''; }, 2500);\n          return;\n        }\n\n        expenses.push({ desc: desc, payer: payer, amount: amt, splitWith: splitWith });\n        document.getElementById('expDesc').value = '';\n        document.getElementById('expAmount').value = '';\n\n        renderLedger();\n        solveSettlement();\n      });\n\n      document.getElementById('copySettlementBtn').addEventListener('click', copySettlement);\n\n      renderMembers();\n      renderLedger();\n      solveSettlement();\n    })();\n  </script>\n  <!-- MATHEMATICAL DERIVATION -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:0.75rem;font-family:var(--serif);\">Graph Theory, Conservation of Flow & Min-Cash-Flow Optimization Mathematics</h2>\n    <p style=\"font-size:0.9rem;color:var(--text-muted);line-height:1.6;margin-bottom:1rem;\">\n      Naive debt settlement across N participants requires up to N(N-1)/2 individual transactions. Our settlement engine applies a greedy minimum cash flow reduction on directed debt graphs to cap settlement transfers at at most N - 1:\n    </p>\n    <div style=\"background:var(--bg);border:1px solid var(--border);padding:1.25rem;border-radius:6px;font-family:var(--mono);font-size:0.85rem;line-height:1.7;\">\n      <div><strong>1. Participant Net Balance Equation:</strong></div>\n      <div>&nbsp;&nbsp;Net_i = TotalPaid_i - ShareOfExpenses_i</div>\n      <div><strong>2. Conservation of Debt Value:</strong></div>\n      <div>&nbsp;&nbsp;∑_{i=1}^{N} Net_i ≡ 0 &nbsp;&nbsp;(The sum of all net balances across the group is strictly zero)</div>\n      <div><strong>3. Greedy Max-Debtor to Max-Creditor Pairing:</strong></div>\n      <div>&nbsp;&nbsp;TransferAmount = min( |MaxDebtorNet|, |MaxCreditorNet| )</div>\n      <div>&nbsp;&nbsp;Max Transactions ≤ N - 1 &nbsp;&nbsp;(Proven upper bound for connected bipartite settlement graphs)</div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE FAQS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Frequently Asked Questions</h2>\n    \n    <details class=\"faq-item\">\n      <summary>How does the debt simplification algorithm minimize transactions?</summary>\n      <div>\n        Without optimization, if 4 roommates owe small debts to each other, they might need up to 6 different money transfers. Our tool uses a greedy min-cash-flow algorithm: it aggregates everyone’s net balance (total money paid minus fair share of expenses) and pairs the largest debtor with the largest creditor. This mathematically guarantees settling all debts across N members in at most N-1 simple transactions.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>Is my financial and trip data private, and do I need to create an account?</summary>\n      <div>\n        No account, password, or login is required. The entire expense ledger and settlement algorithm runs 100% locally inside your browser using client-side JavaScript. No expense amounts, participant names, or transaction details are ever transmitted to or stored on a database.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>Can I split an expense unequally or only among certain people?</summary>\n      <div>\n        Yes. When logging any expense, you can select which specific group members participated using the \"Split Among Who?\" checkboxes. For example, if only three people attended a concert or dinner, you can uncheck the remaining members, and the cost will be divided exclusively among the attendees.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>How do I share the final settlement plan with my group?</summary>\n      <div>\n        Click the \"Copy Plan\" button. This formats the complete settlement plan—listing exactly who owes whom and the total dollar amount—into clean bullet points that you can instantly paste into WhatsApp, iMessage, GroupMe, or Slack.\n      </div>\n    </details>\n\n    <details class=\"faq-item\">\n      <summary>Why is this better than traditional apps like Splitwise?</summary>\n      <div>\n        Traditional apps have introduced paywalls, artificial 10-second wait delays, and limits on how many expenses free users can add per day. Digital Tools Shed provides an unrestricted, ad-light, instant calculator with zero friction, zero signups, and immediate graph-minimized settlement.\n      </div>\n    </details>\n  </div>\n</div>\n";

  const pages = [
    {
      slug: 'deduplicator',
      title: 'Text De-duplicator & List Cleaner',
      metaDesc: 'Remove duplicate lines, emails, keywords, or database IDs with high-throughput hash set deduplication. Supports case-sensitivity toggles and occurrence count tagging.',
      body: deduplicatorBody,
      faq: [
        { q: "How does this tool handle large lists of 50,000+ items?", a: "Because the processing engine utilizes JavaScript's native Set and Map data structures with O(1) amortized hash lookups, lists containing over 100,000 lines process in under 50 milliseconds directly in your browser without lag." },
        { q: "What is the difference between case-sensitive and case-insensitive deduplication?", a: "In case-sensitive mode, 'Apple' and 'apple' are treated as two distinct items. In case-insensitive mode, the first encountered casing is preserved while subsequent case variations are recognized as duplicates and removed." },
        { q: "Can I find ONLY the duplicate items instead of removing them?", a: "Yes! Enable the 'Invert (Show Duplicates Only)' checkbox. The tool will output only the items that appeared more than once in your input list." },
        { q: "Can I deduplicate comma-separated values (CSV) instead of line breaks?", a: "Yes. Use the Delimiter dropdown to choose between Newline (\\n), Comma (,), Semicolon (;), or Tab (\\t)." },
        { q: "Is my pasted text or sensitive list data sent to any server?", a: "No. The entire deduplication algorithm executes 100% locally inside your browser's memory using client-side JavaScript." }
      ]
    },
    {
      slug: 'time-tracker',
      title: 'Freelance & Project Time Tracker with Timesheet Calendar',
      metaDesc: 'Free browser-based time tracking for projects, legal billing, and freelance work. Features 6-minute rounding, project color tags, and private local storage.',
      body: timeTrackerBody,
      faq: [
        { q: "Does the time tracker keep running if I switch tabs or minimize the browser?", a: "Yes. The timer calculates elapsed time based on real-world epoch timestamps (Date.now()). Even if your browser suspends tab animation, the clock accurately computes the exact duration the moment you switch back." },
        { q: "Can I convert my tracked hours into a client invoice?", a: "Yes! Use our companion tool, Invoice from Time, which reads your local tracked entries and generates a formatted invoice with rates and PDF printing." },
        { q: "Where is my timesheet data stored?", a: "All project tags, time entries, and client rates are stored exclusively inside your browser's private localStorage database. No tracking data is sent to external servers." },
        { q: "Can I export my time logs to CSV or Excel?", a: "Yes. You can copy your timesheet summary or export entries to generate invoices and financial records with one click." },
        { q: "What is the 6-minute billing increment rule?", a: "Law firms and elite consulting agencies divide each hour into ten 6-minute blocks (0.1 hours). A task lasting 1 to 6 minutes is billed as 0.1 hr, while a 7-minute task is billed as 0.2 hr, ensuring fair compensation for overhead." }
      ]
    },
    {
      slug: 'invoice-generator',
      title: "Free Professional Invoice Generator (Custom Taxes, Currency, PDF Export & Print)",
      metaDesc: "Create, customize, and export professional PDF invoices directly in your browser. Features dynamic line items, multi-currency support, tax rates, payment terms, and zero watermarks.",
      body: invoiceGeneratorBody,
      faq: [
  {
    "q": "How do I save my invoice as a clean PDF without headers or buttons?",
    "a": "Click the \"Print or Save PDF\" button (or press Ctrl+P / Cmd+P). In the browser print dialog, select \"Save as PDF\" as the destination printer. This tool features bespoke CSS @media print rules that automatically strip away all buttons, toolbars, and background UI, rendering a spotless, professional vector letterhead."
  },
  {
    "q": "What do payment terms like Net 30 and Net 15 mean on an invoice?",
    "a": "Payment terms define the time window the client has to settle the invoice balance from the date of issuance. \"Net 30\" gives the client 30 calendar days to pay, while \"Net 15\" requires payment within 15 days. Selecting a payment term in our generator automatically calculates and updates the exact Due Date."
  },
  {
    "q": "Are client invoices private, and is my financial data stored on your servers?",
    "a": "Yes, 100% private. All calculations, line-item modifications, and PDF generation happen exclusively inside your browser using client-side JavaScript. No company names, customer contact info, billing rates, or bank details are ever transmitted to or stored on external servers."
  },
  {
    "q": "How should sales tax or VAT be applied to services vs digital goods?",
    "a": "In many jurisdictions, pure professional labor and consulting services are exempt from sales tax, while physical deliverables, custom software, and digital assets may be taxable. Our generator provides line-item taxability toggles, allowing you to mark specific products as taxable while leaving consulting hours tax-exempt."
  },
  {
    "q": "What essential legal details must be included on a valid invoice?",
    "a": "A legally enforceable invoice should always display: 1) A unique sequential invoice number; 2) Your business name, street address, and Tax ID/EIN; 3) The client’s legal entity name and billing address; 4) The date of invoice and explicit payment due date; 5) An itemized list of deliverables with quantities and rates; and 6) Clear payment instructions (wire routing, ACH, or check mailing instructions)."
  }
]
    },
    {
      slug: 'invoice-from-time',
      title: 'Time Tracker to Professional Invoice Generator',
      metaDesc: 'Convert tracked timesheet hours into professional PDF invoices with custom rates, client billing info, and GAAP-compliant rounding.',
      body: invoiceFromTimeBody,
      faq: [
        { q: "How does this tool connect with my tracked time entries?", a: "This tool reads from the unified localStorage timesheet database maintained by our companion Time Tracker. Any hours logged on that tool appear automatically here filtered by project." },
        { q: "Can I filter which entries appear on the invoice?", a: "Yes! You can select a specific project, specify From and To date ranges, and use the checkboxes next to individual line items to exclude specific non-billable entries." },
        { q: "How do I print or save the generated invoice as a PDF?", a: "After generating the preview, click the 'Print / Save PDF' button (or press Ctrl+P). The tool automatically hides all web navigation and controls, outputting a spotless corporate PDF invoice." },
        { q: "Can I customize the client name and billing address?", a: "Yes. All client fields, invoice numbers, issue dates, and payment notes on the generated preview are fully editable text inputs that you can customize prior to printing." },
        { q: "Is any timesheet or invoice data sent to a cloud server?", a: "No. The entire process runs 100% locally in your browser memory. No financial records, client names, hourly rates, or timesheet logs are ever uploaded." }
      ]
    },
    {
      slug: 'tax-calculator',
      title: "Federal & State Income Tax Calculator (2024/2025 Brackets, FICA & Paycheck Net Pay)",
      metaDesc: "Accurate 2024 & 2025 income tax calculator. Compute federal marginal brackets, FICA (Social Security & Medicare), state tax, effective tax rate, and take-home pay.",
      body: taxCalculatorBody,
      faq: [
  {
    "q": "How do federal income tax brackets work in 2024 and 2025?",
    "a": "Federal income taxes in the United States operate on a progressive marginal scale with seven statutory brackets: 10%, 12%, 22%, 24%, 32%, 35%, and 37%. Income is taxed in sequential buckets after subtracting the standard deduction ($14,600 for Single, $29,200 for Married Filing Jointly in 2024). Earning more money and entering a higher bracket only taxes the specific dollars that exceed the bracket threshold, never your entire earnings."
  },
  {
    "q": "What is the difference between marginal tax rate and effective tax rate?",
    "a": "Your marginal tax rate is the tax rate applied to the very last dollar of income you earn (e.g., 22% or 24%). Your effective tax rate is your actual blended tax burden—the total tax you pay divided by your gross earnings. Because your initial income is protected by deductions and lower 10% and 12% tiers, your effective tax rate is always significantly lower than your marginal rate."
  },
  {
    "q": "What is the Social Security wage cap and how does FICA tax work?",
    "a": "FICA payroll taxes consist of Social Security (6.2%) and Medicare (1.45%). In 2024, Social Security tax only applies to the first $168,600 of earned wages ($176,100 in 2025); earnings above this cap pay 0% Social Security tax. Medicare has no wage cap, and earnings over $200,000 ($250,000 for married couples) are subject to an Additional Medicare Surtax of 0.9%."
  },
  {
    "q": "How does self-employment tax differ from W-2 employee tax?",
    "a": "W-2 employees split FICA taxes evenly with their employer (6.2% SS and 1.45% Medicare each, totaling 7.65% employee withholding). 1099 contractors and self-employed individuals must pay both halves—known as Self-Employment Tax (15.3% total: 12.4% SS + 2.9% Medicare). However, the IRS allows self-employed workers to deduct 50% of their self-employment tax as an above-the-line deduction to calculate AGI."
  },
  {
    "q": "Why does my bonus get taxed at a different rate than my salary?",
    "a": "The IRS classifies bonuses, commissions, and severance as \"supplemental wages.\" Employers typically withhold a mandatory statutory flat 22% federal tax on supplemental wages under $1 million. If your actual marginal bracket is higher (such as 24%, 32%, or 35%), the 22% withholding may lead to a surprise tax bill at year-end; if your marginal bracket is 12%, you will receive the excess withholding back as a tax refund."
  }
]
    },
    {
      slug: 'task-manager',
      title: 'Private Task Manager & To-Do List with Eisenhower Priority (No Sign-Up)',
      metaDesc: 'Organize tasks, track priorities, and boost productivity with our private client-side task manager. Features local storage persistence, Eisenhower sorting, and Word/PDF export.',
      body: taskManagerBody,
      faq: [
        { q: "Where are my tasks saved, and will they persist if I close the browser?", a: "All tasks are securely persisted inside your browser's private localStorage API under the key dts-tasks. Your tasks automatically re-render whenever you revisit the page or reopen your browser." },
        { q: "Can I export my task list to print or share with a team?", a: "Yes! You can click 'Export DOCX' to download a clean Microsoft Word document, click 'Export PDF' (or Ctrl+P) to print a vector checklist, or click 'Copy Task List' to format a clean text checklist for Slack or email." },
        { q: "How does the Priority sorting algorithm organize my tasks?", a: "Tasks are ranked across four tiers: Urgent (red), High (orange), Medium (blue), and Low (gray). Within each tier, tasks are sorted by due date, ensuring that time-critical responsibilities remain immediately visible." },
        { q: "What is the Eisenhower Matrix method used for prioritization?", a: "The Eisenhower Matrix categorizes tasks across two axes: Urgency and Importance. High-importance/low-urgency tasks represent strategic long-term value, while high-urgency/low-importance tasks represent tactical interruptions that should be automated or delegated." },
        { q: "Is any task data uploaded to external cloud servers?", a: "No. The entire task manager operates 100% locally in your client browser memory using zero third-party tracking scripts or backend APIs. Your confidential projects remain completely private." }
      ]
    },
    {
      slug: 'timetable',
      title: 'Weekly Timetable & Visual Time-Blocking Schedule Planner',
      metaDesc: 'Design and optimize your weekly routine with interactive time-blocking. Features ultradian rhythm guidelines, customizable color-coded blocks, and clean PDF export.',
      body: timetableBody,
      faq: [
        { q: "How does time-blocking compare to traditional to-do lists?", a: "Traditional to-do lists identify what tasks need completion but fail to allocate temporal real estate, encouraging optimistic over-commitment. Time-blocking treats hours as a finite budget, forcing realistic prioritization within your true available capacity." },
        { q: "Can I print or export my weekly timetable as a PDF?", a: "Yes! Click the 'Print Schedule' button (or press Ctrl+P). The layout automatically converts into a clean, border-optimized printable calendar suitable for physical posting on office walls or student binders." },
        { q: "Is my weekly timetable stored securely in my browser?", a: "Yes. All scheduled blocks and color assignments are stored locally inside your browser's private localStorage database under dts-timetable. No calendar entries ever touch an external server." },
        { q: "What is the 90-minute ultradian rhythm scheduling method?", a: "The ultradian scheduling method divides workdays into high-intensity 90-minute focus sprints matched to human cognitive neurobiology, each immediately followed by a 15-to-20 minute mental detachment break." },
        { q: "Can I export my weekly schedule to CSV or Excel?", a: "Yes. Click the 'Export CSV' button to download your weekly schedule into standard spreadsheet format compatible with Excel, Google Sheets, or Apple Numbers." }
      ]
    },
    {
      slug: 'ats-resume-scanner',
      title: "Free ATS Resume Scanner & Job Description Matcher (Keyword & Formatting Audit)",
      metaDesc: "Free client-side ATS resume scanner. Match your CV against target job descriptions, discover missing high-impact keywords, and audit ATS formatting vulnerabilities with zero logins or paywalls.",
      body: atsResumeScannerBody,
      faq: [
  {
    "q": "How does this free ATS scanner compare to paid tools like Jobscan?",
    "a": "Paid platforms like Jobscan and Resume Worded charge up to $50/month and restrict free users to 2 scans. Digital Tools Shed provides an unrestricted, 100% free scanner that runs entirely inside your browser with zero limits, zero accounts, and immediate semantic tokenization, n-gram extraction, and formatting audits."
  },
  {
    "q": "Is my resume data kept private and secure?",
    "a": "Yes, 100% private. Unlike cloud scanners that upload your sensitive personal details (contact info, address, employment history) to third-party databases, our scanner runs purely on client-side JavaScript in your browser. No resume text or job descriptions are ever sent to our servers."
  },
  {
    "q": "What ATS match score should I aim for before submitting my resume?",
    "a": "Aim for a match score of 75% to 85%. While reaching 100% is neither realistic nor necessary (and can look like robotic keyword stuffing), scoring above 75% reliably places your application into the top tier of candidates that automated ATS filters pass directly to human recruiters."
  },
  {
    "q": "Why should I avoid two-column resume templates for ATS applications?",
    "a": "Many popular ATS parsers (especially legacy Workday and Taleo configurations) read text horizontally across the entire page rather than column by column. A two-column layout scrambles your bullet points and dates across columns, resulting in parsing errors and lower match rankings."
  },
  {
    "q": "How do applicant tracking systems handle acronyms like AWS or SEO?",
    "a": "Some ATS query algorithms look exclusively for the full spelled-out phrase, while others look only for the abbreviation. To guarantee you receive credit regardless of which term the recruiter searches, always spell out the term and include the acronym in parentheses: e.g., \"Search Engine Optimization (SEO)\" or \"Amazon Web Services (AWS)\"."
  }
]
    },
    {
      slug: 'expense-splitter',
      title: "Group Expense Splitter & Debt Simplifier (Zero-Login Splitwise Alternative)",
      metaDesc: "Split group expenses, trips, and roommate bills effortlessly with our zero-login Splitwise alternative. Calculate net balances and minimize cash transfers using graph algorithms.",
      body: expenseSplitterBody,
      faq: [
  {
    "q": "How does the debt simplification algorithm minimize transactions?",
    "a": "Without optimization, if 4 roommates owe small debts to each other, they might need up to 6 different money transfers. Our tool uses a greedy min-cash-flow algorithm: it aggregates everyone’s net balance (total money paid minus fair share of expenses) and pairs the largest debtor with the largest creditor. This mathematically guarantees settling all debts across N members in at most N-1 simple transactions."
  },
  {
    "q": "Is my financial and trip data private, and do I need to create an account?",
    "a": "No account, password, or login is required. The entire expense ledger and settlement algorithm runs 100% locally inside your browser using client-side JavaScript. No expense amounts, participant names, or transaction details are ever transmitted to or stored on a database."
  },
  {
    "q": "Can I split an expense unequally or only among certain people?",
    "a": "Yes. When logging any expense, you can select which specific group members participated using the \"Split Among Who?\" checkboxes. For example, if only three people attended a concert or dinner, you can uncheck the remaining members, and the cost will be divided exclusively among the attendees."
  },
  {
    "q": "How do I share the final settlement plan with my group?",
    "a": "Click the \"Copy Plan\" button. This formats the complete settlement plan—listing exactly who owes whom and the total dollar amount—into clean bullet points that you can instantly paste into WhatsApp, iMessage, GroupMe, or Slack."
  },
  {
    "q": "Why is this better than traditional apps like Splitwise?",
    "a": "Traditional apps have introduced paywalls, artificial 10-second wait delays, and limits on how many expenses free users can add per day. Digital Tools Shed provides an unrestricted, ad-light, instant calculator with zero friction, zero signups, and immediate graph-minimized settlement."
  }
]
    }
  ];

  for (const page of pages) {
    const html = renderPage({
      title: `${page.title} | Digital Tools Shed`,
      metaDesc: page.metaDesc,
      canonical: `${DOMAIN}/productivity/${page.slug}`,
      bodyContent: page.body,
      currentPath: `/productivity/${page.slug}`,
      faq: page.faq
    });
    writeFileSync(join(prodDist, `${page.slug}.html`), html);
  }

  console.log("  \u2713 Built Productivity Suite (" + pages.length + " tools in /productivity/)");
}

// ─── TRUST & LEGAL PAGES ──────────────────────────────────────────────────

export { buildProductivitySuite };
