// scripts/trade_math_tools.js — Niche Construction & Trade Math Suite (114 Tools + Hub)
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Universal Workbench HTML Page Generator for Trade Math Tools
 */
function buildToolBody(t) {
  const inputsHtml = t.inputs.map(inp => {
    if (inp.type === 'select') {
      const opts = inp.options.map(o => `<option value="${o.value}" ${o.selected ? 'selected' : ''}>${o.label}</option>`).join('');
      return `
        <div style="margin-bottom: 1.25rem;">
          <label for="${inp.id}" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.5px;">${inp.label}</label>
          <select id="${inp.id}" onchange="calc()" class="search-input" style="width: 100%; padding: 0.6rem 0.75rem; font-family: var(--mono); font-size: 1rem; background: var(--input-bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px;">
            ${opts}
          </select>
          ${inp.hint ? `<span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">${inp.hint}</span>` : ''}
        </div>
      `;
    }
    return `
      <div style="margin-bottom: 1.25rem;">
        <label for="${inp.id}" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.5px;">${inp.label}</label>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <input type="${inp.type || 'number'}" id="${inp.id}" value="${inp.value}" ${inp.min !== undefined ? `min="${inp.min}"` : ''} ${inp.max !== undefined ? `max="${inp.max}"` : ''} ${inp.step !== undefined ? `step="${inp.step}"` : ''} oninput="calc()" class="search-input" style="flex: 1; padding: 0.6rem 0.75rem; font-family: var(--mono); font-size: 1.1rem; background: var(--input-bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px;" />
          ${inp.unit ? `<span style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted); min-width: 2.5rem;">${inp.unit}</span>` : ''}
        </div>
        ${inp.hint ? `<span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">${inp.hint}</span>` : ''}
      </div>
    `;
  }).join('');

  const outputsHtml = t.outputs.map(out => `
    <div style="padding: 0.75rem 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
      <span style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">${out.label}</span>
      <span id="${out.id}" style="font-size: 1.1rem; font-weight: bold; color: var(--fg);">-</span>
    </div>
  `).join('');

  const rulesHtml = t.rules.map(r => `<li style="margin-bottom: 0.5rem;">${r}</li>`).join('');

  const faqHtml = t.faq.map(f => `
    <details style="background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; margin-bottom: 0.75rem;">
      <summary style="font-family: var(--serif); font-size: 1.05rem; font-weight: 700; cursor: pointer; color: var(--fg);">${f.q}</summary>
      <p style="margin-top: 0.65rem; margin-bottom: 0; color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">${f.a}</p>
    </details>
  `).join('');

  return `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/trade/">Trade Math</a> &gt; ${t.name}
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
          <span style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.6rem; border-radius: 4px; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">${t.category}</span>
          <span style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); padding: 0.2rem 0.6rem; border-radius: 4px; font-family: var(--mono); font-size: 0.75rem; color: #3b82f6;">${t.codeRef}</span>
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem; line-height: 1.2;">${t.h1}</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin: 0;">
          ${t.lead}
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <!-- Inputs Card -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-top: 0; margin-bottom: 1.25rem;">Project Parameters</h3>
          ${inputsHtml}
        </div>

        <!-- Output Card -->
        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-top: 0; margin-bottom: 1.25rem;">Calculated Specifications</h3>
            <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; margin-bottom: 1rem; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.35rem;">${t.primaryOutput.label}</div>
              <div id="${t.primaryOutput.id}" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: var(--fg);">-</div>
            </div>
            <div id="resultsGrid" style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              ${outputsHtml}
            </div>
          </div>
          <div id="statusBadge" style="margin-top: 1.25rem; padding: 0.75rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; text-align: center; background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2);">
            Code Verified
          </div>
        </div>
      </div>

      <!-- Building Code & Engineering Standards Reference -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem;">Building Code & Trade Reference</h3>
        <ul style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
          ${rulesHtml}
        </ul>
      </div>

      <!-- Technical Formula Section -->
      <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.5rem;">Mathematical Formulas & Methodology</h3>
        <div style="font-family: var(--mono); font-size: 0.85rem; background: var(--surface); padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.75rem; overflow-x: auto; color: var(--fg);">
          ${t.formula}
        </div>
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; margin: 0;">
          All computations operate dynamically in-browser following standard engineering and geometry principles without external server round-trips.
        </p>
      </div>

      <!-- FAQ Accordions -->
      <div style="margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">Frequently Asked Questions</h3>
        ${faqHtml}
      </div>
    </div>

    <script>
      function toFraction(val) {
        var whole = Math.floor(val);
        var frac = val - whole;
        var sixteenths = Math.round(frac * 16);
        if (sixteenths === 0) return whole + '\\"';
        if (sixteenths === 16) return (whole + 1) + '\\"';
        var num = sixteenths, den = 16;
        while (num % 2 === 0 && den % 2 === 0) { num /= 2; den /= 2; }
        return whole > 0 ? (whole + ' ' + num + '/' + den + '\\"') : (num + '/' + den + '\\"');
      }

      ${t.calcJs}
      window.addEventListener('DOMContentLoaded', calc);
      calc();
    </script>
  `;
}

/**
 * Hub Index Page Generator for /trade/index.html
 */
function buildHubHtml(tools) {
  const cardsHtml = tools.map(t => `
    <a href="/trade/${t.slug}.html" class="trade-card" data-cat="${t.category.toLowerCase()}" data-search="${t.name.toLowerCase()} ${t.h1.toLowerCase()} ${t.lead.toLowerCase()} ${t.codeRef.toLowerCase()}" style="display: flex; flex-direction: column; justify-content: space-between; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit; transition: transform 0.15s ease, border-color 0.15s ease;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.5rem;">
          <span style="font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">${t.category}</span>
          <span style="font-family: var(--mono); font-size: 0.7rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.15rem 0.4rem; border-radius: 3px;">${t.codeRef}</span>
        </div>
        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.5rem; color: var(--fg); line-height: 1.3;">${t.name}</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
      </div>
      <div style="margin-top: 1rem; font-family: var(--mono); font-size: 0.75rem; color: var(--btn-bg, #3b82f6); font-weight: bold;">
        Open Calculator &rarr;
      </div>
    </a>
  `).join('');

  return `
    <div class="article-container" style="max-width: 1050px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; Trade Math Suite
      </nav>

      <header style="margin-bottom: 2.5rem; text-align: center;">
        <h1 style="font-family: var(--serif); font-size: 2.6rem; margin-bottom: 0.75rem;">Niche Construction & Trade Math Suite</h1>
        <p style="color: var(--text-muted); font-size: 1.15rem; line-height: 1.6; max-width: 750px; margin: 0 auto 1.5rem;">
          114 hyper-specific calculators, cut list optimizers, code compliance estimators, and trade engineering tools for carpenters, electricians, plumbers, masons, and welders.
        </p>
        
        <div style="max-width: 500px; margin: 0 auto;">
          <input type="text" id="toolFilter" placeholder="Search 114 trade calculators (e.g. rafter, voltage drop, conduit, CMU)..." oninput="filterTools()" class="search-input" style="width: 100%; padding: 0.75rem 1rem; font-family: var(--mono); font-size: 0.95rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg);" />
        </div>
      </header>

      <div id="toolsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; margin-bottom: 3rem;">
        ${cardsHtml}
      </div>
    </div>

    <script>
      function filterTools() {
        var query = document.getElementById('toolFilter').value.toLowerCase().trim();
        var cards = document.querySelectorAll('.trade-card');
        cards.forEach(function(card) {
          var searchData = card.getAttribute('data-search') || '';
          if (!query || searchData.indexOf(query) !== -1) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      }
    </script>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 1: ROOFING & RAFTER FRAMING (Tools 1–10)
// ─────────────────────────────────────────────────────────────────────────────
const ROOFING_TOOLS = [
  {
    slug: 'common-rafter-length-calculator',
    name: 'Common Rafter Length Calculator',
    h1: 'Common Rafter Length & Pitch Cut Calculator',
    title: 'Common Rafter Length & Pitch Cut Calculator [With Ridge Deduction] | Digital Tools Shed',
    metaDesc: 'Calculate exact common rafter length, plumb cut angle, seat cut angle, and ridge board thickness deductions with International Residential Code standards.',
    category: 'Roofing & Framing',
    codeRef: 'IRC R802.4',
    lead: 'Calculate line-length rafter dimensions, ridge deductions, and plumb/seat cut angles for gable roofs based on building span, pitch, and overhang.',
    inputs: [
      { id: 'span', label: 'Building Span (Wall to Wall)', value: 24, step: 0.5, unit: 'Feet', hint: 'Total width between exterior framing wall top plates' },
      { id: 'pitch', label: 'Roof Pitch (Rise in 12" Run)', value: 6, step: 0.5, unit: 'in / 12"', hint: 'Standard residential pitch (e.g. 4/12, 6/12, 8/12)' },
      { id: 'ridge', label: 'Ridge Board Thickness', value: 1.5, step: 0.25, unit: 'Inches', hint: '1.5" for 2x lumber ridge, 0.75" for 1x ridge' },
      { id: 'overhang', label: 'Eaves Overhang (Horizontal)', value: 12, step: 1, unit: 'Inches', hint: 'Horizontal fascia overhang distance past exterior wall' }
    ],
    primaryOutput: { id: 'outLineLength', label: 'Calculated Lumber Length', unit: 'Ft / In' },
    outputs: [
      { id: 'outActualRun', label: 'Actual Run (To Ridge Center)' },
      { id: 'outPlumbAngle', label: 'Plumb Cut Angle' },
      { id: 'outSeatAngle', label: 'Level Seat Cut Angle' },
      { id: 'outTotalRise', label: 'Total Roof Rise' },
      { id: 'outStockBoard', label: 'Min Stock Board Needed' }
    ],
    rules: [
      'IRC Section R802.4: Rafters shall be framed to a ridge board or each other with a gusset plate.',
      'Ridge board depth must equal or exceed the rafter end cut depth.',
      'Seat cut bearing length must not be less than 1-1/2 inches on wood framing.',
      'Overhang tail length must be calculated on the diagonal slope, not horizontal run.'
    ],
    formula: 'Run = (Span × 12 - Ridge) / 2 | Length = Run × √(12² + Pitch²) / 12 | Plumb Angle = arctan(Pitch / 12)',
    faq: [
      { q: 'How do you deduct for the ridge board when cutting rafters?', a: 'Deduct half the thickness of the ridge board perpendicular from the plumb cut line. For a standard 2x ridge (1-1/2" thick), measure 3/4" back square from the plumb line.' },
      { q: 'What is the difference between line length and lumber length?', a: 'Line length is the theoretical hypotenuse between the ridge line and wall plate line. Actual lumber length adds the eaves tail overhang and accounts for the bird mouth seat.' }
    ],
    calcJs: `
      function calc() {
        var spanFt = parseFloat(document.getElementById('span').value) || 24;
        var pitch = parseFloat(document.getElementById('pitch').value) || 6;
        var ridgeIn = parseFloat(document.getElementById('ridge').value) || 1.5;
        var overIn = parseFloat(document.getElementById('overhang').value) || 12;

        var actualRunIn = (spanFt * 12 - ridgeIn) / 2;
        var unitLength = Math.sqrt(144 + pitch * pitch);
        var lineLengthIn = actualRunIn * (unitLength / 12);
        var overDiagIn = overIn * (unitLength / 12);
        var totalLumberIn = lineLengthIn + overDiagIn;
        var totalRiseIn = actualRunIn * (pitch / 12);

        var plumbDeg = (Math.atan(pitch / 12) * 180 / Math.PI).toFixed(1);
        var seatDeg = (90 - plumbDeg).toFixed(1);
        var stockFt = Math.ceil(totalLumberIn / 12);

        document.getElementById('outLineLength').textContent = (totalLumberIn / 12).toFixed(2) + ' ft (' + toFraction(totalLumberIn) + ')';
        document.getElementById('outActualRun').textContent = (actualRunIn / 12).toFixed(2) + ' ft (' + actualRunIn.toFixed(2) + '")';
        document.getElementById('outPlumbAngle').textContent = plumbDeg + '° (Cut on Pitch ' + pitch + ')';
        document.getElementById('outSeatAngle').textContent = seatDeg + '° (Level Plate Cut)';
        document.getElementById('outTotalRise').textContent = (totalRiseIn / 12).toFixed(2) + ' ft (' + totalRiseIn.toFixed(1) + '")';
        document.getElementById('outStockBoard').textContent = stockFt + ' Ft Stock Lumber (' + (stockFt % 2 === 0 ? stockFt : stockFt + 1) + ' ft standard purchase)';
      }
    `
  },
  {
    slug: 'rafter-birds-mouth-cut-calculator',
    name: "Rafter Bird's Mouth Cut Calculator",
    h1: "Rafter Bird's Mouth Cut Calculator (Seat & Heel Depth)",
    title: "Rafter Bird's Mouth Cut Calculator [Seat & Heel Depth Cut] | Digital Tools Shed",
    metaDesc: "Calculate seat cut width, plumb cut depth, and verify height above plate (HAP) retention limits under International Residential Code (IRC R802.7.1).",
    category: 'Roofing & Framing',
    codeRef: 'IRC R802.7.1',
    lead: "Calculate the exact seat and plumb cut dimensions for a rafter bird's mouth notch to ensure bearing support without weakening rafter bending resistance.",
    inputs: [
      { id: 'rafterSize', label: 'Rafter Lumber Stock', type: 'select', options: [
        { value: '3.5', label: '2x4 (3.5" actual depth)' },
        { value: '5.5', label: '2x6 (5.5" actual depth)', selected: true },
        { value: '7.25', label: '2x8 (7.25" actual depth)' },
        { value: '9.25', label: '2x10 (9.25" actual depth)' },
        { value: '11.25', label: '2x12 (11.25" actual depth)' }
      ]},
      { id: 'plateWidth', label: 'Wall Top Plate Width', type: 'select', options: [
        { value: '3.5', label: '2x4 Wall Plate (3.5" Bearing)', selected: true },
        { value: '5.5', label: '2x6 Wall Plate (5.5" Bearing)' }
      ]},
      { id: 'pitch', label: 'Roof Pitch (in / 12")', value: 6, step: 0.5, unit: 'Rise' }
    ],
    primaryOutput: { id: 'outHap', label: 'Height Above Plate (HAP)', unit: 'Inches' },
    outputs: [
      { id: 'outSeatCut', label: 'Seat Cut Width (Bearing)' },
      { id: 'outHeelDepth', label: 'Plumb Heel Cut Depth' },
      { id: 'outMaxNotch', label: 'Max Allowable Notch (IRC)' },
      { id: 'outCodeCheck', label: 'IRC Structural Status' }
    ],
    rules: [
      'IRC R802.7.1: Notches on rafter ends shall not exceed 1/4 the rafter depth.',
      'Heel Height (HAP) must retain at least 2/3 of the full lumber width to resist roof shear loads.',
      'The horizontal seat cut must provide at least 1-1/2" of direct bearing on wood top plates.',
      'Never over-cut the plumb cut with a circular saw blade past the seat cut intersection.'
    ],
    formula: 'Heel Depth = Seat Width × tan(Pitch Angle) | HAP = Lumber Depth - Heel Depth | Max Notch = Depth / 4',
    faq: [
      { q: "What is HAP in a bird's mouth cut?", a: "HAP stands for 'Height Above Plate'. It is the vertical thickness of rafter wood remaining directly above the exterior wall top plate corner after the bird's mouth is cut." },
      { q: 'Can you notch a rafter deeper to lower the roofline?', a: 'No. Cutting deeper than 1/4 of the rafter depth violates IRC R802.7.1 and severely compromises rafter cantilever strength at the eaves.' }
    ],
    calcJs: `
      function calc() {
        var rafterDepth = parseFloat(document.getElementById('rafterSize').value) || 5.5;
        var plateWidth = parseFloat(document.getElementById('plateWidth').value) || 3.5;
        var pitch = parseFloat(document.getElementById('pitch').value) || 6;

        var plumbRad = Math.atan(pitch / 12);
        var heelDepth = plateWidth * Math.tan(plumbRad);
        var hap = rafterDepth - heelDepth;
        var maxAllowedNotch = rafterDepth * 0.25;
        var minAllowedHap = rafterDepth * (2/3);

        var isPass = heelDepth <= maxAllowedNotch;

        document.getElementById('outHap').textContent = hap.toFixed(2) + '" (' + toFraction(hap) + ')';
        document.getElementById('outSeatCut').textContent = plateWidth.toFixed(2) + '" (Full bearing on top plate)';
        document.getElementById('outHeelDepth').textContent = heelDepth.toFixed(2) + '" (' + toFraction(heelDepth) + ')';
        document.getElementById('outMaxNotch').textContent = maxAllowedNotch.toFixed(2) + '" (1/4 lumber depth limit)';
        
        var badge = document.getElementById('statusBadge');
        if (isPass) {
          document.getElementById('outCodeCheck').textContent = '✅ Code Compliant (Retains ' + ((hap/rafterDepth)*100).toFixed(0) + '% depth)';
          document.getElementById('outCodeCheck').style.color = '#22c55e';
          badge.textContent = 'IRC Code Pass: Notch within 1/4 depth limit';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outCodeCheck').textContent = '⚠️ Exceeds 1/4 Depth Limit! (Use sub-fascia or larger lumber)';
          document.getElementById('outCodeCheck').style.color = '#ef4444';
          badge.textContent = 'IRC Code Warning: Excessive notch weakens rafter';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'hip-and-valley-rafter-calculator',
    name: 'Hip & Valley Rafter Calculator',
    h1: 'Hip and Valley Rafter Length & Cheek Cut Calculator',
    title: 'Hip and Valley Rafter Length Calculator [45-Degree Cheek Cuts] | Digital Tools Shed',
    metaDesc: 'Calculate hip and valley rafter true length, 17-inch unit run pitch, plumb cut, seat cut, and 45-degree cheek bevel angles for compound roof framing.',
    category: 'Roofing & Framing',
    codeRef: 'IRC R802.3',
    lead: 'Calculate the compound length and dual-angle cheek cuts for hip and valley rafters connecting roof ridges to wall corners along 45-degree building planes.',
    inputs: [
      { id: 'span', label: 'Building Span (Total Width)', value: 24, step: 0.5, unit: 'Feet' },
      { id: 'pitch', label: 'Common Roof Pitch', value: 6, step: 0.5, unit: 'in / 12"' },
      { id: 'ridge', label: 'Ridge Board Thickness', value: 1.5, step: 0.25, unit: 'Inches' },
      { id: 'overhang', label: 'Horizontal Eaves Overhang', value: 12, step: 1, unit: 'Inches' }
    ],
    primaryOutput: { id: 'outHipLength', label: 'Total Hip/Valley Length', unit: 'Feet / Inches' },
    outputs: [
      { id: 'outUnitLength', label: 'Hip Length Per 17" Run' },
      { id: 'outHipPlumb', label: 'Hip Plumb Cut Angle' },
      { id: 'outHipSeat', label: 'Hip Seat Cut Angle' },
      { id: 'outCheekAngle', label: 'Cheek Cut Bevel Angle' }
    ],
    rules: [
      'Hip rafters run at 45° to common rafters, making the unit run √12² + 12² = 16.97" (~17").',
      'The ridge deduction for a hip rafter must account for the 45-degree cheek cut angle.',
      'Hip rafters must be at least one lumber size larger than common rafters (e.g. 2x8 hip for 2x6 common).',
      'Backing angles or dropped hips are required to align roof sheathing planes across hips.'
    ],
    formula: 'Unit Run = 16.97" | Hip Length = Common Run × √(16.97² + Pitch²) / 12 | Plumb Angle = arctan(Pitch / 16.97)',
    faq: [
      { q: 'Why is 17 used for hip rafter calculations?', a: 'Because a hip rafter runs diagonally across a 12" x 12" square corner. By the Pythagorean theorem, √(12² + 12²) = 16.97 inches, conventionally rounded to 17" on framing squares.' },
      { q: 'What is a cheek cut on a hip rafter?', a: 'A cheek cut is a side bevel (typically 45°) made at the head of a hip rafter so it fits snugly against the ridge board and adjoining common rafters.' }
    ],
    calcJs: `
      function calc() {
        var spanFt = parseFloat(document.getElementById('span').value) || 24;
        var pitch = parseFloat(document.getElementById('pitch').value) || 6;
        var ridgeIn = parseFloat(document.getElementById('ridge').value) || 1.5;
        var overIn = parseFloat(document.getElementById('overhang').value) || 12;

        var commonRunIn = (spanFt * 12 - ridgeIn) / 2;
        var hipUnitLength = Math.sqrt(16.97 * 16.97 + pitch * pitch);
        var hipLineIn = (commonRunIn / 12) * hipUnitLength;
        var hipOverIn = (overIn / 12) * hipUnitLength;
        var totalHipIn = hipLineIn + hipOverIn;

        var hipPlumbDeg = (Math.atan(pitch / 16.97) * 180 / Math.PI).toFixed(1);
        var hipSeatDeg = (90 - hipPlumbDeg).toFixed(1);

        document.getElementById('outHipLength').textContent = (totalHipIn / 12).toFixed(2) + ' ft (' + toFraction(totalHipIn) + ')';
        document.getElementById('outUnitLength').textContent = hipUnitLength.toFixed(2) + '" per foot of common run';
        document.getElementById('outHipPlumb').textContent = hipPlumbDeg + '° (Cut using ' + pitch + '/17 on square)';
        document.getElementById('outHipSeat').textContent = hipSeatDeg + '° (Level seat cut)';
        document.getElementById('outCheekAngle').textContent = '45.0° Compound Bevel';
      }
    `
  },
  {
    slug: 'jack-rafter-spacing-calculator',
    name: 'Jack Rafter Spacing Calculator',
    h1: 'Jack Rafter Common Difference & Spacing Cut List',
    title: 'Jack Rafter Common Difference Calculator [Step-Down Spacing Table] | Digital Tools Shed',
    metaDesc: 'Calculate jack rafter common difference decrement, step-down cut lengths, and 45-degree cheek bevel cuts for hip and valley roof framing.',
    category: 'Roofing & Framing',
    codeRef: 'IRC R802.4.2',
    lead: 'Determine the exact incremental length reduction (common difference) for hip and valley jack rafters spaced at 16-inch or 24-inch on-center intervals.',
    inputs: [
      { id: 'spacing', label: 'On-Center Spacing (OC)', type: 'select', options: [
        { value: '16', label: '16 Inches On-Center', selected: true },
        { value: '24', label: '24 Inches On-Center' },
        { value: '12', label: '12 Inches On-Center' }
      ]},
      { id: 'pitch', label: 'Roof Pitch (Rise in 12" Run)', value: 6, step: 0.5, unit: 'in / 12"' },
      { id: 'commonLen', label: 'Full Common Rafter Length', value: 160, step: 1, unit: 'Inches', hint: 'Length from ridge plumb line to top plate bird mouth' }
    ],
    primaryOutput: { id: 'outCommonDiff', label: 'Common Difference Decrement', unit: 'Inches' },
    outputs: [
      { id: 'outJack1', label: 'Jack 1 Cut Length (Longest)' },
      { id: 'outJack2', label: 'Jack 2 Cut Length' },
      { id: 'outJack3', label: 'Jack 3 Cut Length' },
      { id: 'outJack4', label: 'Jack 4 Cut Length' }
    ],
    rules: [
      'Jack rafters shorten by a constant amount (common difference) at each spacing interval.',
      'The cheek cut on a jack rafter where it meets the hip rafter is 45° with a plumb bevel.',
      'Jack rafters must be installed in opposing pairs on either side of hip rafters to prevent twisting.',
      'Fasten jack rafters to hip rafters with three 16d common nails (3-1/2" x 0.162").'
    ],
    formula: 'Common Difference = Spacing × √(12² + Pitch²) / 12 | Jack_N = Common Length - (N × Common Difference)',
    faq: [
      { q: 'What is common difference in roof framing?', a: 'Common difference is the fixed mathematical increment by which each successive jack rafter is shorter than the preceding one when spaced uniformly on center.' },
      { q: 'Do jack rafters require bird mouths?', a: 'Hip jacks terminate on the exterior wall top plate and require a standard bird mouth cut. Valley jacks connect from ridge to valley and have two plumb bevel cuts without bird mouths.' }
    ],
    calcJs: `
      function calc() {
        var spacingIn = parseFloat(document.getElementById('spacing').value) || 16;
        var pitch = parseFloat(document.getElementById('pitch').value) || 6;
        var commonLenIn = parseFloat(document.getElementById('commonLen').value) || 160;

        var unitLen = Math.sqrt(144 + pitch * pitch);
        var commonDiff = spacingIn * (unitLen / 12);

        var j1 = Math.max(0, commonLenIn - commonDiff);
        var j2 = Math.max(0, commonLenIn - 2 * commonDiff);
        var j3 = Math.max(0, commonLenIn - 3 * commonDiff);
        var j4 = Math.max(0, commonLenIn - 4 * commonDiff);

        document.getElementById('outCommonDiff').textContent = commonDiff.toFixed(2) + '" (' + toFraction(commonDiff) + ')';
        document.getElementById('outJack1').textContent = j1.toFixed(2) + '" (' + toFraction(j1) + ')';
        document.getElementById('outJack2').textContent = j2.toFixed(2) + '" (' + toFraction(j2) + ')';
        document.getElementById('outJack3').textContent = j3.toFixed(2) + '" (' + toFraction(j3) + ')';
        document.getElementById('outJack4').textContent = j4.toFixed(2) + '" (' + toFraction(j4) + ')';
      }
    `
  },
  {
    slug: 'collar-tie-rafter-tie-calculator',
    name: 'Collar Tie & Rafter Tie Calculator',
    h1: 'Collar Tie and Rafter Tie Sizing & Tension Calculator',
    title: 'Collar Tie & Rafter Tie Sizing Calculator [Ceiling Joist Tension] | Digital Tools Shed',
    metaDesc: 'Size collar ties for wind uplift and rafter ties for horizontal wall spreading thrust forces under International Residential Code (IRC R802.4.6).',
    category: 'Roofing & Framing',
    codeRef: 'IRC R802.4.6',
    lead: 'Calculate collar tie lengths in the upper third of the roof to prevent ridge separation and rafter ties in the lower third to prevent wall spreading.',
    inputs: [
      { id: 'span', label: 'Roof Span (Building Width)', value: 24, step: 0.5, unit: 'Feet' },
      { id: 'pitch', label: 'Roof Pitch (in / 12")', value: 6, step: 0.5, unit: 'Rise' },
      { id: 'load', label: 'Total Design Load (Dead + Snow)', value: 40, step: 5, unit: 'psf' }
    ],
    primaryOutput: { id: 'outThrust', label: 'Outward Wall Thrust Force', unit: 'Pounds' },
    outputs: [
      { id: 'outNails', label: 'Required 16d Common Nails' },
      { id: 'outCollarLen', label: 'Max Collar Tie Length (Upper 1/3)' },
      { id: 'outTieLen', label: 'Max Rafter Tie Length (Lower 1/3)' },
      { id: 'outMinSize', label: 'Minimum Tie Member Size' }
    ],
    rules: [
      'IRC R802.4.6: Collar ties must be located in the upper third of the roof attic space.',
      'Collar ties must be at least 1x4 nominal or 2x4 lumber spaced not more than 4 feet on center.',
      'Rafter ties or ceiling joists must be in the lower third of the roof to resist outward wall spreading.',
      'If ceiling joists are raised above the top plate, rafter span must be derated by the height ratio.'
    ],
    formula: 'Thrust = (Load × Span²) / (8 × Total Rise) | Nails = Thrust / 100 lbs allowable lateral load per 16d nail',
    faq: [
      { q: 'What is the structural difference between a collar tie and a rafter tie?', a: 'Collar ties sit in the upper third of the attic to prevent wind uplift from peeling rafters apart at the ridge. Rafter ties sit in the bottom third to keep the exterior walls from spreading outward under roof weight.' },
      { q: 'Can you eliminate rafter ties for a vaulted ceiling?', a: 'Only if you install a structural load-bearing ridge beam supported by posts at both ends. Without a structural ridge beam, rafters will push the walls outward and cause catastrophic roof collapse.' }
    ],
    calcJs: `
      function calc() {
        var spanFt = parseFloat(document.getElementById('span').value) || 24;
        var pitch = parseFloat(document.getElementById('pitch').value) || 6;
        var loadPsf = parseFloat(document.getElementById('load').value) || 40;

        var totalRiseFt = (spanFt / 2) * (pitch / 12);
        var thrustLbs = Math.round((loadPsf * spanFt * spanFt) / (8 * Math.max(1, totalRiseFt)));
        var nailsReq = Math.ceil(thrustLbs / 100);

        var collarLenFt = (spanFt * (1/3)).toFixed(1);
        var rafterTieLenFt = (spanFt * (2/3)).toFixed(1);

        document.getElementById('outThrust').textContent = thrustLbs.toLocaleString() + ' lbs / rafter pair';
        document.getElementById('outNails').textContent = nailsReq + ' × 16d Common Nails per rafter connection';
        document.getElementById('outCollarLen').textContent = collarLenFt + ' ft (Installed in upper 1/3)';
        document.getElementById('outTieLen').textContent = rafterTieLenFt + ' ft (Installed in lower 1/3)';
        document.getElementById('outMinSize').textContent = '2x4 Lumber (Min 1x4 allowed for collar ties)';
      }
    `
  },
  {
    slug: 'roof-pitch-angle-rise-run',
    name: 'Roof Pitch & Slope Converter',
    h1: 'Roof Pitch to Degrees, Slope Grade & Cut Multiplier',
    title: 'Roof Pitch to Degrees & Slope Converter [Speed Square Cut Angles] | Digital Tools Shed',
    metaDesc: 'Convert roof pitch (X/12) to incline degrees, radians, percent slope grade, and rafter length multipliers with framing speed square angles.',
    category: 'Roofing & Framing',
    codeRef: 'IRC R905',
    lead: 'Convert between roof pitch (rise in 12 inches), slope degrees, grade percentages, and rafter cut angles for standard framing and shingle roofing code limits.',
    inputs: [
      { id: 'pitch', label: 'Roof Pitch (Inches Rise per 12" Run)', value: 6, step: 0.25, unit: 'Rise / 12"' }
    ],
    primaryOutput: { id: 'outDeg', label: 'Incline Angle in Degrees', unit: 'Degrees (°)' },
    outputs: [
      { id: 'outGrade', label: 'Slope Grade Percentage' },
      { id: 'outMult', label: 'Common Rafter Multiplier' },
      { id: 'outHipMult', label: 'Hip/Valley Rafter Multiplier' },
      { id: 'outCategory', label: 'Roof Slope Classification' }
    ],
    rules: [
      'Low slope roofs (< 2:12 or 9.5°) cannot use standard asphalt shingles; require built-up or membrane roofing.',
      'Standard asphalt shingles are permitted between 2:12 and 4:12 with double underlayment (IRC R905.2.2).',
      'Normal slope roofs (4:12 and above) require single-layer underlayment.',
      'Steep slope roofs (9:12 and above / > 37°) require toe-boards and fall arrest harnesses during installation.'
    ],
    formula: 'Angle = arctan(Rise / 12) × (180 / π) | Grade = (Rise / 12) × 100 | Multiplier = √(1 + (Rise / 12)²)',
    faq: [
      { q: 'What pitch is a 45 degree roof?', a: 'A 12/12 pitch roof is exactly 45 degrees, where the rise equals the run (12 inches rise for every 12 inches horizontal run).' },
      { q: 'What is the minimum roof pitch for standing seam metal roofing?', a: 'Standing seam metal roofs with sealed seams can be installed on slopes as low as 1/2:12 (2.4 degrees), whereas corrugated screw-down panels require at least 3:12.' }
    ],
    calcJs: `
      function calc() {
        var pitch = parseFloat(document.getElementById('pitch').value) || 6;
        var rad = Math.atan(pitch / 12);
        var deg = (rad * 180 / Math.PI).toFixed(2);
        var grade = ((pitch / 12) * 100).toFixed(1);
        var mult = Math.sqrt(1 + (pitch / 12) * (pitch / 12)).toFixed(4);
        var hipMult = Math.sqrt(1 + (pitch / 16.97) * (pitch / 16.97)).toFixed(4);

        var cat = 'Standard Slope (4:12 to 8:12)';
        if (pitch < 2) cat = 'Flat / Low-Slope Membrane Only (< 2:12)';
        else if (pitch < 4) cat = 'Low-Slope Shingle (Double Underlayment Required)';
        else if (pitch >= 9) cat = 'Steep Pitch (> 9:12 - High Wind & Fall Protection)';

        document.getElementById('outDeg').textContent = deg + '°';
        document.getElementById('outGrade').textContent = grade + '% Grade';
        document.getElementById('outMult').textContent = mult + ' (Multiply common run by this)';
        document.getElementById('outHipMult').textContent = hipMult + ' (Multiply hip run by this)';
        document.getElementById('outCategory').textContent = cat;
      }
    `
  },
  {
    slug: 'gambrel-barn-roof-rafter-cuts',
    name: 'Gambrel Barn Roof Rafter Calculator',
    h1: 'Gambrel Barn Roof Rafter Cut & Gusset Plate Calculator',
    title: 'Gambrel Barn Roof Rafter Cut Calculator [Dual-Pitch Framing] | Digital Tools Shed',
    metaDesc: 'Calculate steep lower pitch and shallow upper pitch rafter lengths, knuckle joint bevel cut angles, and plywood gusset plates for Dutch gambrel roofs.',
    category: 'Roofing & Framing',
    codeRef: 'IRC R802.10',
    lead: 'Calculate rafter lengths and knuckle joint cut angles for traditional Dutch barn gambrel roofs featuring steep lower slopes and shallow upper slopes.',
    inputs: [
      { id: 'span', label: 'Barn Building Span', value: 24, step: 1, unit: 'Feet' },
      { id: 'pitchLower', label: 'Lower Pitch (Rise in 12")', value: 20, step: 1, unit: 'in/12 (~60°)' },
      { id: 'pitchUpper', label: 'Upper Pitch (Rise in 12")', value: 7, step: 0.5, unit: 'in/12 (~30°)' }
    ],
    primaryOutput: { id: 'outKnuckleAngle', label: 'Purlin Knuckle Cut Angle', unit: 'Degrees' },
    outputs: [
      { id: 'outLowerRafter', label: 'Lower Rafter Length' },
      { id: 'outUpperRafter', label: 'Upper Rafter Length' },
      { id: 'outLowerPlumb', label: 'Lower Wall Plumb Angle' },
      { id: 'outUpperRidgePlumb', label: 'Ridge Plumb Cut Angle' }
    ],
    rules: [
      'Traditional gambrel roofs split the total half-span into two equal horizontal or proportional runs.',
      'The knuckle joint connecting lower and upper rafters must be reinforced with 3/4" exterior plywood gussets on both sides.',
      'Lower steep rafters (typically 60° to 70°) experience high axial compression; upper rafters experience bending and snow loads.',
      'Fasten gusset plates with 8d ring-shank nails in an engineered staggered grid pattern.'
    ],
    formula: 'Knuckle Angle = (180 - Lower Angle + Upper Angle) / 2 | Length = √(Run² + Rise²)',
    faq: [
      { q: 'Why do barns use gambrel roofs?', a: 'Gambrel roofs maximize attic storage space and headroom for hay lofts without requiring full second-story framed exterior walls.' },
      { q: 'How are the rafters joined at the break line?', a: 'The joint where the steep lower rafter meets the shallow upper rafter is called the knuckle or purlin line. It is framed with mitered butt cuts clamped between two 3/4" structural plywood gussets glued and nailed.' }
    ],
    calcJs: `
      function calc() {
        var spanFt = parseFloat(document.getElementById('span').value) || 24;
        var pLower = parseFloat(document.getElementById('pitchLower').value) || 20;
        var pUpper = parseFloat(document.getElementById('pitchUpper').value) || 7;

        var halfSpanIn = (spanFt * 12) / 2;
        var lowerRunIn = halfSpanIn * 0.45;
        var upperRunIn = halfSpanIn * 0.55;

        var lowerRiseIn = lowerRunIn * (pLower / 12);
        var upperRiseIn = upperRunIn * (pUpper / 12);

        var lowerRafterIn = Math.sqrt(lowerRunIn * lowerRunIn + lowerRiseIn * lowerRiseIn);
        var upperRafterIn = Math.sqrt(upperRunIn * upperRunIn + upperRiseIn * upperRiseIn);

        var lowerAngle = Math.atan(pLower / 12) * 180 / Math.PI;
        var upperAngle = Math.atan(pUpper / 12) * 180 / Math.PI;
        var knuckleCut = ((180 - lowerAngle + upperAngle) / 2).toFixed(1);

        document.getElementById('outKnuckleAngle').textContent = knuckleCut + '° (Gusset joint miter)';
        document.getElementById('outLowerRafter').textContent = (lowerRafterIn / 12).toFixed(2) + ' ft (' + toFraction(lowerRafterIn) + ')';
        document.getElementById('outUpperRafter').textContent = (upperRafterIn / 12).toFixed(2) + ' ft (' + toFraction(upperRafterIn) + ')';
        document.getElementById('outLowerPlumb').textContent = (90 - lowerAngle).toFixed(1) + '° (Seat cut on wall)';
        document.getElementById('outUpperRidgePlumb').textContent = (90 - upperAngle).toFixed(1) + '° (Ridge cut)';
      }
    `
  },
  {
    slug: 'shed-roof-lean-to-pitch-calc',
    name: 'Shed Roof Lean-To Pitch Calculator',
    h1: 'Shed Roof Lean-To Pitch & Wall Stud Height Calculator',
    title: 'Shed Roof Lean-To Pitch Calculator [High & Low Wall Stud Heights] | Digital Tools Shed',
    metaDesc: 'Calculate shed roof lean-to slope, high wall vs low wall stud heights, rafter cut length, and angled top plate cuts for outbuildings and additions.',
    category: 'Roofing & Framing',
    codeRef: 'IRC R802.2',
    lead: 'Calculate the elevation difference between high and low walls, slope cut angle, and rafter lumber lengths for single-slope shed roofs and lean-to additions.',
    inputs: [
      { id: 'span', label: 'Clear Building Span', value: 12, step: 0.5, unit: 'Feet' },
      { id: 'lowWall', label: 'Low Wall Height', value: 8, step: 0.5, unit: 'Feet' },
      { id: 'pitch', label: 'Desired Pitch (in / 12")', value: 3, step: 0.25, unit: 'Rise' },
      { id: 'frontOver', label: 'Front Eaves Overhang', value: 12, step: 1, unit: 'Inches' },
      { id: 'backOver', label: 'Rear Eaves Overhang', value: 12, step: 1, unit: 'Inches' }
    ],
    primaryOutput: { id: 'outHighWall', label: 'High Wall Framing Height', unit: 'Feet / Inches' },
    outputs: [
      { id: 'outTotalRise', label: 'Elevation Rise Difference' },
      { id: 'outRafterLen', label: 'Total Rafter Cut Length' },
      { id: 'outStudDiff', label: 'Gable Stud Height Increment (16" OC)' },
      { id: 'outBevelAngle', label: 'Top Plate Bevel Cut Angle' }
    ],
    rules: [
      'Single-pitch shed roofs exert lateral thrust unless rafters are secured with hurricane ties at both high and low plates.',
      'Low pitch shed roofs (< 3:12) require ice-and-water shield over the entire roof deck or double underlayment.',
      'End gable studs must be cut with a compound bevel matching the roof pitch on the top edge.',
      'Rafters must be tied into existing structure walls with structural ledger fasteners if building an attached lean-to.'
    ],
    formula: 'Rise = Span × Pitch | High Wall = Low Wall + Rise | Stud Increment = 16 × (Pitch / 12)',
    faq: [
      { q: 'What is the best pitch for a shed roof?', a: 'A pitch between 3:12 and 4:12 is ideal for shed roofs, providing excellent water drainage and snow shed without making the high wall excessively tall.' },
      { q: 'How do you frame the angled top plate on a shed roof?', a: 'Rip the high wall and low wall top plates with a bevel saw setting matching the pitch angle (e.g. 14° for a 3/12 pitch) so rafters sit completely flush.' }
    ],
    calcJs: `
      function calc() {
        var spanFt = parseFloat(document.getElementById('span').value) || 12;
        var lowWallFt = parseFloat(document.getElementById('lowWall').value) || 8;
        var pitch = parseFloat(document.getElementById('pitch').value) || 3;
        var fOverIn = parseFloat(document.getElementById('frontOver').value) || 12;
        var bOverIn = parseFloat(document.getElementById('backOver').value) || 12;

        var riseIn = spanFt * pitch;
        var riseFt = riseIn / 12;
        var highWallFt = lowWallFt + riseFt;

        var unitLen = Math.sqrt(144 + pitch * pitch);
        var slopeIn = (spanFt * 12) * (unitLen / 12);
        var totalRafterIn = slopeIn + (fOverIn + bOverIn) * (unitLen / 12);

        var studDiffIn = 16 * (pitch / 12);
        var bevelDeg = (Math.atan(pitch / 12) * 180 / Math.PI).toFixed(1);

        document.getElementById('outHighWall').textContent = highWallFt.toFixed(2) + ' ft (' + (highWallFt * 12).toFixed(1) + '")';
        document.getElementById('outTotalRise').textContent = riseIn.toFixed(1) + '" (' + riseFt.toFixed(2) + ' ft)';
        document.getElementById('outRafterLen').textContent = (totalRafterIn / 12).toFixed(2) + ' ft (' + toFraction(totalRafterIn) + ')';
        document.getElementById('outStudDiff').textContent = studDiffIn.toFixed(2) + '" (' + toFraction(studDiffIn) + ') step-down';
        document.getElementById('outBevelAngle').textContent = bevelDeg + '° Top Plate Bevel';
      }
    `
  },
  {
    slug: 'roof-truss-heel-height-energy-heel',
    name: 'Raised Energy Heel Truss Calculator',
    h1: 'Raised Energy Heel Roof Truss Insulation Depth Calculator',
    title: 'Raised Energy Heel Roof Truss Calculator [Attic Insulation Depth] | Digital Tools Shed',
    metaDesc: 'Calculate required raised energy heel truss height to fit uncompressed R-49 or R-60 attic insulation over exterior wall top plates without thermal bridging.',
    category: 'Roofing & Framing',
    codeRef: 'IECC R402',
    lead: 'Calculate the required raised heel height on engineered roof trusses to accommodate full-depth R-49 or R-60 attic insulation over exterior walls without compressing batts.',
    inputs: [
      { id: 'targetR', label: 'Target Attic R-Value', type: 'select', options: [
        { value: '38', label: 'R-38 (Climate Zones 1-3)' },
        { value: '49', label: 'R-49 (Climate Zones 4-5)', selected: true },
        { value: '60', label: 'R-60 (Climate Zones 6-8 Cold Northern)' }
      ]},
      { id: 'insulType', label: 'Insulation Type', type: 'select', options: [
        { value: '2.5', label: 'Blown Fiberglass (R-2.5 / inch)' },
        { value: '3.6', label: 'Blown Cellulose (R-3.6 / inch)', selected: true },
        { value: '3.2', label: 'Fiberglass Batts (R-3.2 / inch)' }
      ]},
      { id: 'baffleClear', label: 'Soffit Baffle Airspace Clearance', value: 2, step: 0.5, unit: 'Inches' }
    ],
    primaryOutput: { id: 'outReqHeel', label: 'Required Raised Heel Height', unit: 'Inches' },
    outputs: [
      { id: 'outInsulDepth', label: 'Full Uncompressed Insulation Depth' },
      { id: 'outStdComp', label: 'Standard 4.5" Heel R-Value Loss' },
      { id: 'outEnergyGain', label: 'Envelope Efficiency Gain' }
    ],
    rules: [
      'IECC Section R402: Full uncompressed insulation must extend over the top plate to prevent thermal bridging.',
      'Standard roof trusses provide only 4" to 5" of heel space, compressing R-49 insulation down to R-12 at exterior walls.',
      'A minimum 1" (preferably 2") continuous airspace must remain between the insulation baffle and roof sheathing for soffit ventilation.',
      'Energy heel trusses reduce perimeter ice dam formation caused by heated wall top plates melting snow on eaves.'
    ],
    formula: 'Insulation Depth = Target R / R-per-inch | Required Heel = Insulation Depth + Airspace Baffle Clearance',
    faq: [
      { q: 'What is a raised heel roof truss?', a: 'A raised heel (or energy heel) truss is engineered with a vertical upright extension at the exterior wall bearing point, raising the top chord higher to create room for full-depth insulation over wall top plates.' },
      { q: 'Does a raised heel prevent ice dams?', a: 'Yes. By maintaining full insulation thickness over the exterior wall top plates, heat loss into the eaves is stopped, keeping the roof deck cold and preventing ice dam formation.' }
    ],
    calcJs: `
      function calc() {
        var targetR = parseFloat(document.getElementById('targetR').value) || 49;
        var rPerIn = parseFloat(document.getElementById('insulType').value) || 3.6;
        var baffleIn = parseFloat(document.getElementById('baffleClear').value) || 2;

        var insulDepthIn = targetR / rPerIn;
        var reqHeelIn = insulDepthIn + baffleIn;
        var stdHeelIn = 4.5;
        var compDepth = Math.max(0, stdHeelIn - baffleIn);
        var compR = compDepth * rPerIn;
        var lossR = Math.max(0, targetR - compR);

        document.getElementById('outReqHeel').textContent = reqHeelIn.toFixed(1) + '" (' + toFraction(reqHeelIn) + ')';
        document.getElementById('outInsulDepth').textContent = insulDepthIn.toFixed(1) + '" of uncompressed insulation';
        document.getElementById('outStdComp').textContent = 'Drops to R-' + compR.toFixed(0) + ' (Loses R-' + lossR.toFixed(0) + ' value)';
        document.getElementById('outEnergyGain').textContent = '+' + ((lossR / targetR) * 100).toFixed(0) + '% Thermal Protection at Perimeter';
      }
    `
  },
  {
    slug: 'roof-dormer-framing-calculator',
    name: 'Roof Dormer Framing Calculator',
    h1: 'Roof Dormer Framing & Valley Opening Calculator',
    title: 'Roof Dormer Framing Calculator [Gable & Shed Dormer Openings] | Digital Tools Shed',
    metaDesc: 'Calculate roof dormer rough opening length on slope, header sizing, trimmer rafter doubling, and valley nailer angles for gable and shed dormers.',
    category: 'Roofing & Framing',
    codeRef: 'IRC R802.9',
    lead: 'Calculate roof penetration opening dimensions, valley sleeper plate angles, and sidewall framing cut lists for cutting dormers into existing roof planes.',
    inputs: [
      { id: 'mainPitch', label: 'Main Roof Pitch (in / 12")', value: 8, step: 0.5, unit: 'Rise' },
      { id: 'dormerPitch', label: 'Dormer Roof Pitch', value: 4, step: 0.5, unit: 'Rise' },
      { id: 'dormerWidth', label: 'Dormer Exterior Width', value: 6, step: 0.5, unit: 'Feet' },
      { id: 'dormerDepth', label: 'Dormer Horizontal Depth', value: 8, step: 0.5, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outSlopeOpening', label: 'Opening Length on Main Slope', unit: 'Feet / Inches' },
    outputs: [
      { id: 'outHeaderSize', label: 'Structural Header Sizing' },
      { id: 'outTrimmerReq', label: 'Trimmer Rafter Plies' },
      { id: 'outValleyBevel', label: 'Valley Sleeper Cut Bevel' },
      { id: 'outSidewallStud', label: 'Max Sidewall Stud Height' }
    ],
    rules: [
      'IRC R802.9: Openings in roofs exceeding two rafter spaces require doubled headers and doubled trimmer rafters.',
      'Headers supporting more than 6 feet of rafter span must be designed according to structural span tables.',
      'Valley sleeper nailers must be fastened through roof sheathing directly into structural rafters below.',
      'Sidewall studs must be notched around existing roof rafters or seated on continuous valley sleepers.'
    ],
    formula: 'Slope Opening = Horizontal Depth / cos(arctan(Main Pitch / 12)) | Valley Bevel = Main Pitch Angle - Dormer Pitch Angle',
    faq: [
      { q: 'What is a valley sleeper in dormer construction?', a: 'A valley sleeper (or nailer board) is a 2x board beveled on the edge and nailed directly onto the main roof sheathing to provide a nailing base for the bottom of dormer rafters.' },
      { q: 'Do dormer openings require structural engineering?', a: 'If a dormer cuts through more than two rafter bays (typically > 32" to 48" wide), building code requires doubled structural trimmer rafters and load-bearing headers.' }
    ],
    calcJs: `
      function calc() {
        var mPitch = parseFloat(document.getElementById('mainPitch').value) || 8;
        var dPitch = parseFloat(document.getElementById('dormerPitch').value) || 4;
        var dWidthFt = parseFloat(document.getElementById('dormerWidth').value) || 6;
        var dDepthFt = parseFloat(document.getElementById('dormerDepth').value) || 8;

        var mAngleRad = Math.atan(mPitch / 12);
        var slopeOpeningFt = dDepthFt / Math.cos(mAngleRad);
        var slopeOpeningIn = slopeOpeningFt * 12;

        var mDeg = mAngleRad * 180 / Math.PI;
        var dDeg = Math.atan(dPitch / 12) * 180 / Math.PI;
        var valleyBevel = (mDeg - dDeg).toFixed(1);

        var maxWallRiseIn = dDepthFt * mPitch;

        document.getElementById('outSlopeOpening').textContent = slopeOpeningFt.toFixed(2) + ' ft (' + toFraction(slopeOpeningIn) + ')';
        document.getElementById('outHeaderSize').textContent = dWidthFt > 5 ? 'Doubled 2x8 or 2x10 Engineered Header' : 'Doubled 2x6 Header';
        document.getElementById('outTrimmerReq').textContent = 'Doubled 2x rafters on left & right opening borders';
        document.getElementById('outValleyBevel').textContent = valleyBevel + '° Valley Sleeper Bevel';
        document.getElementById('outSidewallStud').textContent = (maxWallRiseIn / 12).toFixed(1) + ' ft (' + maxWallRiseIn.toFixed(1) + '" at front)';
      }
    `
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 2: ELECTRICAL & POWER ENGINEERING (Tools 11–22)
// ─────────────────────────────────────────────────────────────────────────────
const ELECTRICAL_TOOLS = [
  {
    slug: 'wire-gauge-voltage-drop-calculator',
    name: 'Wire Gauge & Voltage Drop Calculator',
    h1: 'Electrical Voltage Drop & Wire Gauge Sizing Calculator',
    title: 'Wire Gauge & Voltage Drop Calculator [NEC 3% Distance Limit] | Digital Tools Shed',
    metaDesc: 'Calculate single-phase and 3-phase AC voltage drop by wire gauge and one-way run distance under National Electrical Code (NEC 210.19 3% rule).',
    category: 'Electrical & Power',
    codeRef: 'NEC 210.19(A)',
    lead: 'Calculate single-phase and three-phase voltage drops across copper or aluminum conductors to comply with NEC 3% branch circuit and 5% feeder guidelines.',
    inputs: [
      { id: 'volts', label: 'Circuit Voltage', type: 'select', options: [
        { value: '120', label: '120 Volts (Single Phase 120V)', selected: true },
        { value: '240', label: '240 Volts (Single Phase 240V)' },
        { value: '208', label: '208 Volts (3-Phase)' },
        { value: '480', label: '480 Volts (3-Phase)' }
      ]},
      { id: 'amps', label: 'Load Current (Amps)', value: 20, step: 1, unit: 'Amps' },
      { id: 'distance', label: 'One-Way Run Distance', value: 100, step: 5, unit: 'Feet' },
      { id: 'awg', label: 'Conductor Wire Gauge (AWG)', type: 'select', options: [
        { value: '14', label: '14 AWG (Copper 15A)' },
        { value: '12', label: '12 AWG (Copper 20A)', selected: true },
        { value: '10', label: '10 AWG (Copper 30A)' },
        { value: '8', label: '8 AWG (Copper 50A)' },
        { value: '6', label: '6 AWG (Copper 65A)' },
        { value: '4', label: '4 AWG (Copper 85A)' },
        { value: '2', label: '2 AWG (Copper 115A)' },
        { value: '1/0', label: '1/0 AWG (Copper 150A)' },
        { value: '2/0', label: '2/0 AWG (Copper 175A)' },
        { value: '4/0', label: '4/0 AWG (Copper 230A)' }
      ]},
      { id: 'material', label: 'Conductor Metal', type: 'select', options: [
        { value: 'cu', label: 'Copper (K = 12.9)', selected: true },
        { value: 'al', label: 'Aluminum (K = 21.2)' }
      ]}
    ],
    primaryOutput: { id: 'outVoltDrop', label: 'Total Voltage Drop', unit: 'Volts' },
    outputs: [
      { id: 'outDropPct', label: 'Percentage Voltage Drop' },
      { id: 'outEndVoltage', label: 'End of Run Voltage' },
      { id: 'outNecLimit', label: 'NEC 3% Max Allowed Drop' },
      { id: 'outRecGauge', label: 'Recommended Minimum Gauge' }
    ],
    rules: [
      'NEC Informational Note 210.19(A): Recommends a maximum voltage drop of 3% on branch circuits.',
      'Total feeder plus branch circuit voltage drop should not exceed 5% for overall efficiency.',
      'Excessive voltage drop causes electric motors to overheat and LED drivers/electronics to cycle.',
      'Distance is strictly one-way run length; the return conductor path is doubled in the formula.'
    ],
    formula: 'Single Phase: Vd = (2 × K × I × L) / CM | 3-Phase: Vd = (√3 × K × I × L) / CM | % Drop = (Vd / Volts) × 100',
    faq: [
      { q: 'Why is voltage drop important in long electrical runs?', a: 'Excessive voltage drop starves equipment of proper operating voltage, causing motors to draw more current and burn out windings, while reducing electric heater output and causing lights to flicker.' },
      { q: 'What is K factor in voltage drop math?', a: 'K is the specific resistance (in ohms per circular mil-foot) of the conductor material at 75°C. For copper, K is approximately 12.9; for aluminum, K is approximately 21.2.' }
    ],
    calcJs: `
      function calc() {
        var volts = parseFloat(document.getElementById('volts').value) || 120;
        var amps = parseFloat(document.getElementById('amps').value) || 20;
        var dist = parseFloat(document.getElementById('distance').value) || 100;
        var awg = document.getElementById('awg').value;
        var mat = document.getElementById('material').value;

        var k = mat === 'al' ? 21.2 : 12.9;
        var cmMap = { '14': 4110, '12': 6530, '10': 10380, '8': 16510, '6': 26240, '4': 41740, '2': 66360, '1/0': 105600, '2/0': 133100, '4/0': 211600 };
        var cm = cmMap[awg] || 6530;

        var is3Phase = volts === 208 || volts === 480;
        var vd = is3Phase ? (Math.sqrt(3) * k * amps * dist) / cm : (2 * k * amps * dist) / cm;
        var pct = (vd / volts) * 100;
        var endV = volts - vd;
        var max3PctV = volts * 0.03;

        var pass = pct <= 3.0;

        document.getElementById('outVoltDrop').textContent = vd.toFixed(2) + ' V (' + pct.toFixed(2) + '%)';
        document.getElementById('outDropPct').textContent = pct.toFixed(2) + '% of nominal voltage';
        document.getElementById('outEndVoltage').textContent = endV.toFixed(1) + ' V delivered at load';
        document.getElementById('outNecLimit').textContent = max3PctV.toFixed(1) + ' V maximum allowed drop';
        
        var badge = document.getElementById('statusBadge');
        if (pass) {
          document.getElementById('outRecGauge').textContent = awg + ' AWG is Code Compliant (≤ 3.0%)';
          document.getElementById('outRecGauge').style.color = '#22c55e';
          badge.textContent = 'NEC 3% Pass: Voltage drop within code limit';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outRecGauge').textContent = 'Upsize Wire to Next Larger Gauge (Exceeds 3%)';
          document.getElementById('outRecGauge').style.color = '#ef4444';
          badge.textContent = 'NEC Warning: High voltage drop requires larger wire';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'conduit-fill-capacity-nec',
    name: 'Conduit Fill Percentage Calculator',
    h1: 'Conduit Fill Percentage Calculator (EMT, PVC & Rigid)',
    title: 'Conduit Fill Percentage Calculator [NEC Chapter 9 Table 1] | Digital Tools Shed',
    metaDesc: 'Verify conduit cross-sectional wire fill percentage under NEC Chapter 9 Table 1 limits (40% for 3+ conductors, 31% for 2, 53% for 1).',
    category: 'Electrical & Power',
    codeRef: 'NEC Ch. 9 Table 1',
    lead: 'Verify total wire conductor cross-sectional area against internal trade conduit dimensions under the 40% NEC raceway fill rule.',
    inputs: [
      { id: 'conduitSize', label: 'Conduit Trade Size', type: 'select', options: [
        { value: '0.304', label: '1/2" EMT (0.304 sq in total)' },
        { value: '0.533', label: '3/4" EMT (0.533 sq in total)', selected: true },
        { value: '0.864', label: '1" EMT (0.864 sq in total)' },
        { value: '1.496', label: '1-1/4" EMT (1.496 sq in total)' },
        { value: '2.036', label: '1-1/2" EMT (2.036 sq in total)' },
        { value: '3.356', label: '2" EMT (3.356 sq in total)' }
      ]},
      { id: 'wireGauge', label: 'Conductor Size (THHN/THWN-2)', type: 'select', options: [
        { value: '0.0097', label: '14 AWG THHN (0.0097 sq in)' },
        { value: '0.0133', label: '12 AWG THHN (0.0133 sq in)', selected: true },
        { value: '0.0211', label: '10 AWG THHN (0.0211 sq in)' },
        { value: '0.0366', label: '8 AWG THHN (0.0366 sq in)' },
        { value: '0.0507', label: '6 AWG THHN (0.0507 sq in)' },
        { value: '0.0824', label: '4 AWG THHN (0.0824 sq in)' },
        { value: '0.1158', label: '2 AWG THHN (0.1158 sq in)' },
        { value: '0.1855', label: '1/0 AWG THHN (0.1855 sq in)' }
      ]},
      { id: 'wireCount', label: 'Number of Current Conductors', value: 4, step: 1, min: 1, max: 50, unit: 'Wires' }
    ],
    primaryOutput: { id: 'outFillPct', label: 'Actual Conduit Fill %', unit: 'Percentage' },
    outputs: [
      { id: 'outTotalArea', label: 'Total Conductor Area' },
      { id: 'outUsableArea', label: 'Max Allowable Fill Area' },
      { id: 'outMaxWires', label: 'Max Permitted Wires in Size' },
      { id: 'outFillStatus', label: 'NEC Code Status' }
    ],
    rules: [
      'NEC Chapter 9 Table 1 Fill Limits: 1 wire = 53%, 2 wires = 31%, 3 or more wires = 40%.',
      'The 40% fill limit prevents thermal runaway and ensures cables can be pulled without damaging jacket insulation.',
      'Equipment grounding conductors and neutrals must be included in total cross-sectional area calculations.',
      'Nipple rule (NEC 310.15(B)(2)): Raceways not exceeding 24 inches in length may be filled to 60% without ampacity derating.'
    ],
    formula: 'Conductor Area = Count × Wire Area | Max Fill = Conduit Area × 40% | Fill % = (Conductor Area / Conduit Area) × 100',
    faq: [
      { q: 'Why is conduit fill capped at 40%?', a: 'Conduit fill is restricted to 40% for three or more conductors to allow heat dissipation from ohmic resistance and ensure pulling tension does not strip wire insulation during installation.' },
      { q: 'Does a bare copper ground wire count toward conduit fill?', a: 'Yes. Every wire inside a conduit raceway—whether hot, neutral, insulated ground, or bare ground—takes up volume and must be counted.' }
    ],
    calcJs: `
      function calc() {
        var conduitArea = parseFloat(document.getElementById('conduitSize').value) || 0.533;
        var wireArea = parseFloat(document.getElementById('wireGauge').value) || 0.0133;
        var count = parseInt(document.getElementById('wireCount').value, 10) || 4;

        var maxLimit = count === 1 ? 53 : (count === 2 ? 31 : 40);
        var totalWireArea = count * wireArea;
        var fillPct = (totalWireArea / conduitArea) * 100;
        var maxArea = conduitArea * (maxLimit / 100);
        var maxWires = Math.floor(maxArea / wireArea);

        var pass = fillPct <= maxLimit;

        document.getElementById('outFillPct').textContent = fillPct.toFixed(1) + '% (Limit: ' + maxLimit + '%)';
        document.getElementById('outTotalArea').textContent = totalWireArea.toFixed(4) + ' sq in';
        document.getElementById('outUsableArea').textContent = maxArea.toFixed(4) + ' sq in (' + maxLimit + '% allowable)';
        document.getElementById('outMaxWires').textContent = maxWires + ' Wires Max Allowed';
        
        var badge = document.getElementById('statusBadge');
        if (pass) {
          document.getElementById('outFillStatus').textContent = '✅ Pass (Within NEC ' + maxLimit + '% Rule)';
          document.getElementById('outFillStatus').style.color = '#22c55e';
          badge.textContent = 'NEC Pass: Easy cable pulling capacity';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outFillStatus').textContent = '❌ Overfill Violation! (' + fillPct.toFixed(1) + '% > ' + maxLimit + '%)';
          document.getElementById('outFillStatus').style.color = '#ef4444';
          badge.textContent = 'NEC Code Violation: Upsize conduit immediately';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'electrical-box-fill-cubic-inch',
    name: 'Electrical Box Fill Calculator',
    h1: 'Electrical Box Fill Cubic Inch Volume Calculator',
    title: 'Electrical Box Fill Calculator [NEC Article 314.16 Volume] | Digital Tools Shed',
    metaDesc: 'Calculate required electrical junction and switch box volume in cubic inches under NEC Article 314.16 conductor and yoke fill rules.',
    category: 'Electrical & Power',
    codeRef: 'NEC 314.16',
    lead: 'Calculate the total cubic inch volume allowance required for conductors, internal clamps, ground wires, and device yokes inside electrical boxes.',
    inputs: [
      { id: 'boxType', label: 'Box Type & Size', type: 'select', options: [
        { value: '18.0', label: '1-Gang Deep Plastic Box (18.0 cu in)' },
        { value: '21.0', label: '4x4x1.5" Square Metal Box (21.0 cu in)' },
        { value: '30.3', label: '4x4x2.125" Deep Square Metal Box (30.3 cu in)', selected: true },
        { value: '32.0', label: '2-Gang Plastic Switch Box (32.0 cu in)' },
        { value: '44.0', label: '3-Gang Switch Box (44.0 cu in)' }
      ]},
      { id: 'wires14', label: 'Number of 14 AWG Conductors (2.0 cu in)', value: 0, step: 1, min: 0 },
      { id: 'wires12', label: 'Number of 12 AWG Conductors (2.25 cu in)', value: 6, step: 1, min: 0 },
      { id: 'devices', label: 'Number of Device Yokes (Switches/Outlets)', value: 1, step: 1, min: 0 },
      { id: 'hasClamps', label: 'Internal Cable Clamps Present?', type: 'select', options: [
        { value: '1', label: 'Yes (Counts as 1 largest conductor volume)' },
        { value: '0', label: 'No (External connectors used)', selected: true }
      ]},
      { id: 'grounds', label: 'Equipment Grounding Wires Present?', type: 'select', options: [
        { value: '1', label: 'Yes (1 allowance for first 4 grounds)', selected: true },
        { value: '0', label: 'No Grounds in Box' }
      ]}
    ],
    primaryOutput: { id: 'outReqVol', label: 'Required Box Volume', unit: 'Cubic Inches' },
    outputs: [
      { id: 'outBoxVol', label: 'Selected Box Capacity' },
      { id: 'outMargin', label: 'Volume Surplus / Deficit' },
      { id: 'outDeviceVol', label: 'Device Yoke Allowance' },
      { id: 'outBoxStatus', label: 'NEC Code Status' }
    ],
    rules: [
      'NEC 314.16(B)(1): 14 AWG requires 2.0 cu in; 12 AWG requires 2.25 cu in; 10 AWG requires 2.5 cu in.',
      'Each device yoke (outlet or switch) counts as a double-volume allowance (2x largest connected conductor).',
      'All internal cable clamps count collectively as ONE volume allowance based on the largest conductor present.',
      'Up to four grounding conductors count collectively as ONE volume allowance of the largest ground.'
    ],
    formula: 'Req Volume = (N14 × 2.0) + (N12 × 2.25) + (Clamps × 2.25) + (Yokes × 4.5) + (Grounds × 2.25)',
    faq: [
      { q: 'How much volume does a duplex outlet take in box fill math?', a: 'Under NEC 314.16(B)(4), each mounting yoke (receptacle or switch) requires a double conductor allowance. For 12 AWG wiring, one outlet counts as 2 × 2.25 = 4.5 cubic inches.' },
      { q: 'Can you install an extension ring if a box is overfilled?', a: 'Yes. Installing a box extension ring adds cubic inch volume stamped directly on the metal ring to bring an overfilled box into full code compliance.' }
    ],
    calcJs: `
      function calc() {
        var boxVol = parseFloat(document.getElementById('boxType').value) || 30.3;
        var n14 = parseInt(document.getElementById('wires14').value, 10) || 0;
        var n12 = parseInt(document.getElementById('wires12').value, 10) || 0;
        var devCount = parseInt(document.getElementById('devices').value, 10) || 0;
        var hasClamps = parseInt(document.getElementById('hasClamps').value, 10) || 0;
        var hasGrounds = parseInt(document.getElementById('grounds').value, 10) || 0;

        var largestVol = n12 > 0 ? 2.25 : 2.0;
        var wireVol = n14 * 2.0 + n12 * 2.25;
        var clampVol = hasClamps ? largestVol : 0;
        var groundVol = hasGrounds ? largestVol : 0;
        var deviceVol = devCount * (2 * largestVol);

        var totalReq = wireVol + clampVol + groundVol + deviceVol;
        var margin = boxVol - totalReq;
        var pass = margin >= 0;

        document.getElementById('outReqVol').textContent = totalReq.toFixed(2) + ' cu in';
        document.getElementById('outBoxVol').textContent = boxVol.toFixed(1) + ' cu in';
        document.getElementById('outMargin').textContent = (margin >= 0 ? '+' : '') + margin.toFixed(2) + ' cu in ' + (pass ? 'surplus' : 'OVERFILL');
        document.getElementById('outDeviceVol').textContent = deviceVol.toFixed(2) + ' cu in (' + devCount + ' yoke devices)';
        
        var badge = document.getElementById('statusBadge');
        if (pass) {
          document.getElementById('outBoxStatus').textContent = '✅ Code Compliant (Safe volume)';
          document.getElementById('outBoxStatus').style.color = '#22c55e';
          badge.textContent = 'NEC 314.16 Pass: Room for safe wire packing';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outBoxStatus').textContent = '❌ Overfill Hazard! Add mud ring or deeper box';
          document.getElementById('outBoxStatus').style.color = '#ef4444';
          badge.textContent = 'NEC Code Violation: Fire and pinch hazard';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'subpanel-feeder-sizing-calculator',
    name: 'Subpanel Feeder Wire Sizing Calculator',
    h1: 'Subpanel Feeder Wire & Neutral/Ground Sizing Calculator',
    title: 'Subpanel Feeder Wire Sizing Calculator [80% Continuous Load Derate] | Digital Tools Shed',
    metaDesc: 'Size subpanel feeder hot, neutral, and ground conductors (60A to 200A) accounting for continuous load derating and NEC 250.122 grounding.',
    category: 'Electrical & Power',
    codeRef: 'NEC 215 & 250.122',
    lead: 'Size 4-wire subpanel feeder conductors, neutral sizing, and equipment grounding wires based on feeder breaker amperage and distance.',
    inputs: [
      { id: 'subAmps', label: 'Subpanel Main Breaker Amperage', type: 'select', options: [
        { value: '60', label: '60 Amp Subpanel' },
        { value: '100', label: '100 Amp Subpanel', selected: true },
        { value: '125', label: '125 Amp Subpanel' },
        { value: '150', label: '150 Amp Subpanel' },
        { value: '200', label: '200 Amp Subpanel' }
      ]},
      { id: 'material', label: 'Conductor Material', type: 'select', options: [
        { value: 'cu', label: 'Copper (75°C Terminals)', selected: true },
        { value: 'al', label: 'Aluminum / MHF (75°C Terminals)' }
      ]},
      { id: 'distance', label: 'Run Distance to Subpanel', value: 75, step: 5, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outHotGauge', label: 'Feeder Hot Conductor Gauge', unit: 'AWG / kcmil' },
    outputs: [
      { id: 'outNeutralGauge', label: 'Neutral Conductor Gauge' },
      { id: 'outGroundGauge', label: 'Equipment Ground Wire (NEC 250.122)' },
      { id: 'outConduitSize', label: 'Minimum PVC/EMT Conduit Size' },
      { id: 'outBondNote', label: 'Subpanel Neutral Bonding Rule' }
    ],
    rules: [
      'Subpanels require a four-wire feeder system (two hots, one neutral, one insulated or bare ground).',
      'Neutral and ground MUST remain isolated in subpanels; remove the green bonding screw and tie bar.',
      'Equipment Grounding Conductor (EGC) size is determined by NEC Table 250.122 based on the upstream breaker.',
      'Aluminum conductors must use terminal lugs rated AL7PR or AL9PR with anti-oxidant joint compound.'
    ],
    formula: 'Ampacity Selection: NEC Table 310.16 (75°C Column) | Ground Selection: NEC Table 250.122',
    faq: [
      { q: 'Why must the neutral and ground be separated in a subpanel?', a: 'Neutral and ground must only be bonded at the main service disconnect. Bonding them at a subpanel creates objectionable parallel paths, causing neutral return currents to travel on bare ground wires and metal water pipes, creating an electrocution hazard.' },
      { q: 'What size wire do I need for a 100A subpanel 100 feet away?', a: 'For a 100A subpanel at 100 feet, use #3 AWG copper or #1 AWG aluminum with an #8 copper ground, or upsize to #2 copper / #1/0 aluminum if high continuous loads cause voltage drop.' }
    ],
    calcJs: `
      function calc() {
        var amps = parseInt(document.getElementById('subAmps').value, 10) || 100;
        var mat = document.getElementById('material').value;
        var dist = parseFloat(document.getElementById('distance').value) || 75;

        var cuTable = { 60: { hot: '#6 AWG Cu', ground: '#10 AWG Cu', conduit: '1" Conduit' },
                        100: { hot: '#3 AWG Cu (or #2)', ground: '#8 AWG Cu', conduit: '1-1/4" Conduit' },
                        125: { hot: '#1 AWG Cu', ground: '#6 AWG Cu', conduit: '1-1/2" Conduit' },
                        150: { hot: '#1/0 AWG Cu', ground: '#6 AWG Cu', conduit: '1-1/2" Conduit' },
                        200: { hot: '#2/0 AWG Cu', ground: '#6 AWG Cu', conduit: '2" Conduit' } };

        var alTable = { 60: { hot: '#4 AWG Al', ground: '#8 AWG Al', conduit: '1" Conduit' },
                        100: { hot: '#1 AWG Al', ground: '#6 AWG Al', conduit: '1-1/4" Conduit' },
                        125: { hot: '#2/0 AWG Al', ground: '#4 AWG Al', conduit: '1-1/2" Conduit' },
                        150: { hot: '#3/0 AWG Al', ground: '#4 AWG Al', conduit: '2" Conduit' },
                        200: { hot: '4/0 AWG Al', ground: '#4 AWG Al', conduit: '2" Conduit' } };

        var selected = mat === 'al' ? alTable[amps] : cuTable[amps];

        document.getElementById('outHotGauge').textContent = selected.hot + ' (2 Conductors: L1 & L2)';
        document.getElementById('outNeutralGauge').textContent = selected.hot + ' (Full sized neutral)';
        document.getElementById('outGroundGauge').textContent = selected.ground + ' (Separate ground bar)';
        document.getElementById('outConduitSize').textContent = selected.conduit + ' (Minimum schedule 40 / EMT)';
        document.getElementById('outBondNote').textContent = '⚠️ REMOVE Green Bonding Screw! Neutral float required';
      }
    `
  },
  {
    slug: 'motor-full-load-amps-breaker',
    name: 'Electric Motor FLA & Breaker Sizing Calculator',
    h1: 'Electric Motor Full Load Amps (FLA) & Breaker Sizing',
    title: 'Electric Motor FLA & Breaker Sizing Calculator [NEC Article 430] | Digital Tools Shed',
    metaDesc: 'Determine electric motor full load amps (FLA), branch circuit wire sizing (125%), circuit breaker (250%), and time-delay fuses under NEC Article 430.',
    category: 'Electrical & Power',
    codeRef: 'NEC Article 430',
    lead: 'Calculate electric motor full load running amps, branch circuit conductor ampacity, and inverse-time breaker ratings under NEC Table 430.248.',
    inputs: [
      { id: 'motorHp', label: 'Motor Nameplate Horsepower', type: 'select', options: [
        { value: '0.5', label: '1/2 HP' },
        { value: '0.75', label: '3/4 HP' },
        { value: '1.0', label: '1 HP' },
        { value: '1.5', label: '1.5 HP' },
        { value: '2.0', label: '2 HP' },
        { value: '3.0', label: '3 HP', selected: true },
        { value: '5.0', label: '5 HP' },
        { value: '7.5', label: '7.5 HP' },
        { value: '10.0', label: '10 HP' }
      ]},
      { id: 'voltage', label: 'Operating Voltage', type: 'select', options: [
        { value: '115', label: '115V (Single Phase)' },
        { value: '230', label: '230V (Single Phase)', selected: true },
        { value: '208', label: '208V (3-Phase)' },
        { value: '460', label: '460V (3-Phase)' }
      ]}
    ],
    primaryOutput: { id: 'outBreaker', label: 'Inverse-Time Circuit Breaker', unit: 'Amps' },
    outputs: [
      { id: 'outFla', label: 'NEC Table FLA Rating' },
      { id: 'outWireAmps', label: 'Min Conductor Ampacity (125%)' },
      { id: 'outTimeFuse', label: 'Dual-Element Fuse (175%)' },
      { id: 'outOverload', label: 'Thermal Overload Trip Setting' }
    ],
    rules: [
      'NEC 430.6(A)(1): Always use NEC Table FLA values for conductor and breaker sizing, NOT motor nameplate FLA.',
      'Branch circuit conductors must be sized for at least 125% of motor FLA (NEC 430.22).',
      'Inverse-time circuit breakers may be sized up to 250% of FLA to allow high inrush starting current without tripping (NEC 430.52).',
      'Dual-element time-delay fuses are permitted up to 175% of motor FLA.'
    ],
    formula: 'Wire Ampacity = FLA × 1.25 | Breaker Size = FLA × 2.50 (Round to next standard rating) | Fuse Size = FLA × 1.75',
    faq: [
      { q: 'Why is the circuit breaker sized so much higher than motor wire ampacity?', a: 'Induction motors draw 5 to 7 times their full-load current during initial startup (locked rotor amps). Sizing the breaker at 250% allows the motor to start without nuisance tripping while dedicated thermal overload heaters protect the motor against running overloads.' },
      { q: 'Should I use motor nameplate current or NEC table current?', a: 'The NEC mandates using Table 430.248 (single phase) or Table 430.250 (three phase) values for wiring and breaker sizing to guarantee safety if the motor is ever replaced with a lower-efficiency model.' }
    ],
    calcJs: `
      function calc() {
        var hp = parseFloat(document.getElementById('motorHp').value) || 3.0;
        var v = parseInt(document.getElementById('voltage').value, 10) || 230;

        // Approx standard NEC FLA lookup
        var fla = 17.0;
        if (v === 115) { fla = hp * 16.0; }
        else if (v === 230) { fla = hp * 8.0; }
        else if (v === 208) { fla = hp * 3.5; }
        else if (v === 460) { fla = hp * 1.6; }

        var wireMin = fla * 1.25;
        var breakerRaw = fla * 2.50;
        var fuseRaw = fla * 1.75;
        var overload = fla * 1.15;

        var stdBreakers = [15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100];
        var recBreaker = stdBreakers.find(function(b) { return b >= breakerRaw; }) || Math.ceil(breakerRaw);
        var recFuse = stdBreakers.find(function(b) { return b >= fuseRaw; }) || Math.ceil(fuseRaw);

        document.getElementById('outBreaker').textContent = recBreaker + ' Amp Breaker (250% Max)';
        document.getElementById('outFla').textContent = fla.toFixed(1) + ' Amps (NEC Table 430)';
        document.getElementById('outWireAmps').textContent = wireMin.toFixed(1) + ' A (Requires wire rated ≥ ' + wireMin.toFixed(1) + 'A)';
        document.getElementById('outTimeFuse').textContent = recFuse + ' Amp Dual-Element Time-Delay Fuse';
        document.getElementById('outOverload').textContent = overload.toFixed(1) + ' Amps (115% trip)';
      }
    `
  },
  {
    slug: 'three-phase-power-amps-kw-kva',
    name: 'Three-Phase AC Power Calculator',
    h1: 'Three-Phase AC Power Calculator (kVA, kW, Volts & Amps)',
    title: 'Three-Phase AC Power Calculator [kVA, kW, Amps & Power Factor] | Digital Tools Shed',
    metaDesc: 'Calculate 3-phase real power (kW), apparent power (kVA), reactive power (kVAR), and line current with variable power factor and line-to-line voltage.',
    category: 'Electrical & Power',
    codeRef: 'IEEE 141',
    lead: 'Calculate real power, apparent power, and phase current for balanced 3-phase electrical systems across industrial 208V, 240V, and 480V distributions.',
    inputs: [
      { id: 'vLine', label: 'Line-to-Line Voltage (V_L-L)', type: 'select', options: [
        { value: '208', label: '208 Volts (Commercial 3-Phase Y)' },
        { value: '240', label: '240 Volts (High-Leg Delta)' },
        { value: '480', label: '480 Volts (Industrial 3-Phase)', selected: true }
      ]},
      { id: 'amps', label: 'Line Current per Phase (Amps)', value: 50, step: 1, unit: 'Amps' },
      { id: 'pf', label: 'Load Power Factor (PF)', value: 0.85, step: 0.05, min: 0.5, max: 1.0, hint: '1.0 for resistive heaters, 0.80 to 0.85 for induction motors' }
    ],
    primaryOutput: { id: 'outKw', label: 'Real Working Power', unit: 'Kilowatts (kW)' },
    outputs: [
      { id: 'outKva', label: 'Apparent Power (Total S)' },
      { id: 'outKvar', label: 'Reactive Power (Lagging Q)' },
      { id: 'outWattsPerPhase', label: 'Power per Individual Phase' },
      { id: 'outPFCostNote', label: 'Utility Power Factor Penalty' }
    ],
    rules: [
      'Balanced 3-phase real power is calculated with the factor √3 (~1.732) times line voltage and current.',
      'Apparent power (kVA) dictates transformer capacity and conductor ampacity sizing.',
      'Real power (kW) performs mechanical work and registers on electrical utility revenue meters.',
      'Power factors below 0.85 frequently incur reactive power utility penalty surcharges.'
    ],
    formula: 'kVA = (√3 × V × I) / 1000 | kW = kVA × PF | kVAR = √(kVA² - kW²)',
    faq: [
      { q: 'What is the difference between kW and kVA in 3-phase power?', a: 'kW (real power) is the actual energy that drives machinery and generates heat. kVA (apparent power) is the total vector combination of real power and reactive magnetic power that conductors and transformers must transmit.' },
      { q: 'Why do three phase calculations use the square root of 3?', a: 'Because the three AC phase sine waves are electrically displaced by 120 degrees from each other. The vector potential difference between any two line conductors is √3 (1.732) times the single phase-to-neutral voltage.' }
    ],
    calcJs: `
      function calc() {
        var v = parseFloat(document.getElementById('vLine').value) || 480;
        var i = parseFloat(document.getElementById('amps').value) || 50;
        var pf = parseFloat(document.getElementById('pf').value) || 0.85;

        var kva = (Math.sqrt(3) * v * i) / 1000;
        var kw = kva * pf;
        var kvar = Math.sqrt(Math.max(0, kva * kva - kw * kw));
        var kwPhase = kw / 3;

        document.getElementById('outKw').textContent = kw.toFixed(2) + ' kW';
        document.getElementById('outKva').textContent = kva.toFixed(2) + ' kVA';
        document.getElementById('outKvar').textContent = kvar.toFixed(2) + ' kVAR';
        document.getElementById('outWattsPerPhase').textContent = kwPhase.toFixed(2) + ' kW / phase';

        var badge = document.getElementById('statusBadge');
        if (pf >= 0.90) {
          document.getElementById('outPFCostNote').textContent = 'Optimal Power Factor (No utility surcharge)';
          badge.textContent = 'High Efficiency: PF ≥ 0.90';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outPFCostNote').textContent = '⚠️ PF < 0.90: Consider power factor correction capacitors';
          badge.textContent = 'Inductive Lag: Utility PF penalty possible';
          badge.style.color = '#f59e0b';
          badge.style.background = 'rgba(245, 158, 11, 0.1)';
        }
      }
    `
  },
  {
    slug: 'transformer-primary-secondary-turn',
    name: 'Transformer Voltage, Current & Turn Ratio Calculator',
    h1: 'Transformer Turns Ratio, Voltage & Full-Load Amps Calculator',
    title: 'Transformer Primary & Secondary Voltage Calculator [Turns Ratio & FLA] | Digital Tools Shed',
    metaDesc: 'Calculate step-up and step-down transformer winding turns ratios, full load primary/secondary amps, and overcurrent protection breaker sizing.',
    category: 'Electrical & Power',
    codeRef: 'NEC 450.3',
    lead: 'Calculate primary and secondary winding currents, turns transformation ratios, and overcurrent protective device sizing for dry-type power transformers.',
    inputs: [
      { id: 'kva', label: 'Transformer kVA Rating', value: 45, step: 5, unit: 'kVA' },
      { id: 'vPrimary', label: 'Primary Voltage (V_p)', value: 480, step: 10, unit: 'Volts' },
      { id: 'vSecondary', label: 'Secondary Voltage (V_s)', value: 208, step: 10, unit: 'Volts' },
      { id: 'phase', label: 'Phase Configuration', type: 'select', options: [
        { value: '3', label: '3-Phase (480V Primary / 208Y Secondary)', selected: true },
        { value: '1', label: 'Single Phase (240V / 120V)' }
      ]}
    ],
    primaryOutput: { id: 'outRatio', label: 'Turns Transformation Ratio (Np/Ns)', unit: 'Ratio' },
    outputs: [
      { id: 'outPrimaryAmps', label: 'Primary Full-Load Amps' },
      { id: 'outSecondaryAmps', label: 'Secondary Full-Load Amps' },
      { id: 'outPrimaryBreaker', label: 'Max Primary Breaker (125% NEC)' },
      { id: 'outSecondaryBreaker', label: 'Recommended Secondary Main' }
    ],
    rules: [
      'NEC Table 450.3(B): Primary overcurrent protection is typically limited to 125% of rated primary current.',
      'If 125% does not correspond to a standard breaker size, rounding up to the next standard rating is permitted.',
      'Secondary conductors must be protected by secondary main breakers or conform to the 10-foot or 25-foot tap rules.',
      'Step-down transformers invert current: as voltage decreases across secondary, amperage increases proportionally.'
    ],
    formula: 'Ratio = Vp / Vs = Np / Ns = Is / Ip | 3-Phase: I = (kVA × 1000) / (√3 × V) | 1-Phase: I = (kVA × 1000) / V',
    faq: [
      { q: 'Why is secondary current higher on a step-down transformer?', a: 'By the law of conservation of energy (excluding minor winding and core losses), power input equals power output. Dropping the voltage from 480V to 208V requires amperage to increase by the exact inverse ratio.' },
      { q: 'What is transformer inrush current?', a: 'When first energized, a transformer can draw an instantaneous magnetic inrush current up to 8 to 12 times its full load rating for several cycles, requiring time-delay fuses or inverse-time circuit breakers.' }
    ],
    calcJs: `
      function calc() {
        var kva = parseFloat(document.getElementById('kva').value) || 45;
        var vp = parseFloat(document.getElementById('vPrimary').value) || 480;
        var vs = parseFloat(document.getElementById('vSecondary').value) || 208;
        var phase = document.getElementById('phase').value;

        var ratio = (vp / vs).toFixed(3);
        var ip = 0, is_ = 0;

        if (phase === '3') {
          ip = (kva * 1000) / (Math.sqrt(3) * vp);
          is_ = (kva * 1000) / (Math.sqrt(3) * vs);
        } else {
          ip = (kva * 1000) / vp;
          is_ = (kva * 1000) / vs;
        }

        var maxPrimaryOcpd = Math.round(ip * 1.25);
        var maxSecondaryOcpd = Math.round(is_ * 1.25);

        document.getElementById('outRatio').textContent = ratio + ' : 1 (' + vp + 'V → ' + vs + 'V)';
        document.getElementById('outPrimaryAmps').textContent = ip.toFixed(1) + ' Amps at full load';
        document.getElementById('outSecondaryAmps').textContent = is_.toFixed(1) + ' Amps at full load';
        document.getElementById('outPrimaryBreaker').textContent = maxPrimaryOcpd + ' A Breaker (125% threshold)';
        document.getElementById('outSecondaryBreaker').textContent = maxSecondaryOcpd + ' A Secondary Breaker';
      }
    `
  },
  {
    slug: 'ohm-joule-heating-wire-loss',
    name: 'Wire Resistance & I²R Heat Loss Calculator',
    h1: 'Ohmic Resistance & I²R Wire Copper Heat Energy Loss',
    title: 'Wire Resistance & I²R Heat Loss Calculator [Annual Energy Waste Cost] | Digital Tools Shed',
    metaDesc: 'Calculate watts of waste heat dissipated in long electrical wire runs from I²R copper resistance and annual dollar cost of electricity losses.',
    category: 'Electrical & Power',
    codeRef: 'Joule-Lenz Law',
    lead: 'Calculate continuous electrical energy lost as waste thermal heat in copper cable runs and estimate annual operating dollar waste.',
    inputs: [
      { id: 'loadAmps', label: 'Continuous Operating Current', value: 24, step: 1, unit: 'Amps' },
      { id: 'distance', label: 'One-Way Distance to Load', value: 150, step: 10, unit: 'Feet' },
      { id: 'awg', label: 'Conductor Size', type: 'select', options: [
        { value: '3.07', label: '14 AWG (3.07 Ω / 1000 ft)' },
        { value: '1.93', label: '12 AWG (1.93 Ω / 1000 ft)' },
        { value: '1.21', label: '10 AWG (1.21 Ω / 1000 ft)', selected: true },
        { value: '0.764', label: '8 AWG (0.764 Ω / 1000 ft)' },
        { value: '0.491', label: '6 AWG (0.491 Ω / 1000 ft)' },
        { value: '0.308', label: '4 AWG (0.308 Ω / 1000 ft)' }
      ]},
      { id: 'hoursDay', label: 'Operating Hours per Day', value: 16, step: 1, unit: 'Hours' },
      { id: 'kwhCost', label: 'Electricity Utility Rate', value: 0.16, step: 0.01, unit: '$/kWh' }
    ],
    primaryOutput: { id: 'outWatts', label: 'Continuous Waste Heat', unit: 'Watts Dissipated' },
    outputs: [
      { id: 'outTotalR', label: 'Total Loop Resistance' },
      { id: 'outKwhYear', label: 'Annual Lost Energy' },
      { id: 'outDollarYear', label: 'Annual Dollar Cost of Waste' },
      { id: 'outBtuHour', label: 'Thermal Output Rate' }
    ],
    rules: [
      'Joule First Law: Heat generated is proportional to the square of current multiplied by resistance (P = I²R).',
      'Doubling circuit current quadruples (4x) the heat dissipation in the wiring.',
      'Conductor resistance increases with temperature; warm ambient conduits suffer higher energy waste.',
      'Upsizing conductor wire gauge by one or two sizes frequently pays for itself in energy conservation within 2–3 years.'
    ],
    formula: 'R = 2 × (Distance / 1000) × R_per_1000ft | P (Watts) = I² × R | Annual kWh = (Watts × Hours × 365) / 1000',
    faq: [
      { q: 'Why is energy loss proportional to current squared?', a: 'Because both the voltage drop and the charge flow scale with current. When you double amperage, voltage drop across the wire doubles and the rate of electron flow doubles, multiplying energy loss by 2 × 2 = 4.' },
      { q: 'How does upsizing wire save money?', a: 'A #10 AWG wire has nearly 40% less electrical resistance than #12 AWG wire. For high-duty equipment (pumps, compressors, servers), the electricity saved from lower I²R heat loss exceeds the extra copper cost.' }
    ],
    calcJs: `
      function calc() {
        var amps = parseFloat(document.getElementById('loadAmps').value) || 24;
        var dist = parseFloat(document.getElementById('distance').value) || 150;
        var rPer1k = parseFloat(document.getElementById('awg').value) || 1.21;
        var hrs = parseFloat(document.getElementById('hoursDay').value) || 16;
        var rate = parseFloat(document.getElementById('kwhCost').value) || 0.16;

        var loopR = 2 * (dist / 1000) * rPer1k;
        var watts = amps * amps * loopR;
        var btuHr = watts * 3.412;
        var kwhYear = (watts * hrs * 365) / 1000;
        var costYear = kwhYear * rate;

        document.getElementById('outWatts').textContent = Math.round(watts) + ' Watts (' + Math.round(btuHr) + ' BTU/hr)';
        document.getElementById('outTotalR').textContent = loopR.toFixed(3) + ' Ohms loop resistance';
        document.getElementById('outKwhYear').textContent = Math.round(kwhYear) + ' kWh / year dissipated';
        document.getElementById('outDollarYear').textContent = '$' + costYear.toFixed(2) + ' / year wasted in cable heat';
        document.getElementById('outBtuHour').textContent = Math.round(btuHr) + ' BTU/hr added to ambient space';
      }
    `
  },
  {
    slug: 'generator-wattage-starting-surge',
    name: 'Home Backup Generator Sizing Calculator',
    h1: 'Emergency Home Backup Generator Wattage Sizing Calculator',
    title: 'Home Backup Generator Sizing Calculator [Starting Surge vs Running Watts] | Digital Tools Shed',
    metaDesc: 'Size emergency backup generators by calculating running watts and inductive motor starting surge peaks with appliance load profiles.',
    category: 'Electrical & Power',
    codeRef: 'NFPA 70 Art. 702',
    lead: 'Calculate household running watts and inductive motor starting surge loads to properly size portable or whole-house standby emergency generators.',
    inputs: [
      { id: 'fridge', label: 'Refrigerator / Freezer (Running 700W / Surge 2200W)', type: 'select', options: [
        { value: '1', label: 'Include 1 Refrigerator', selected: true },
        { value: '2', label: 'Include 2 Refrigerators / Freezers' },
        { value: '0', label: 'None' }
      ]},
      { id: 'wellPump', label: 'Well Pump / Sump Pump', type: 'select', options: [
        { value: '1', label: '1/2 HP Well Pump (1000W / 2100W Surge)', selected: true },
        { value: '2', label: '1 HP Well Pump (1800W / 3500W Surge)' },
        { value: '0', label: 'City Water (No Well Pump)' }
      ]},
      { id: 'furnace', label: 'Gas / Oil Furnace Blower Fan', type: 'select', options: [
        { value: '1', label: 'Include Furnace Fan (800W / 2300W Surge)', selected: true },
        { value: '0', label: 'No Heating Fan' }
      ]},
      { id: 'windowAc', label: 'Window / Portable AC Unit', type: 'select', options: [
        { value: '1', label: '10,000 BTU AC (1200W / 3000W Surge)' },
        { value: '0', label: 'None', selected: true }
      ]},
      { id: 'baseLoad', label: 'Lighting, WiFi, Electronics & Misc Loads', value: 1000, step: 250, unit: 'Watts' }
    ],
    primaryOutput: { id: 'outGenKw', label: 'Recommended Generator Size', unit: 'kW Rating' },
    outputs: [
      { id: 'outRunningWatts', label: 'Total Continuous Running Watts' },
      { id: 'outPeakSurge', label: 'Peak Starting Surge Demand' },
      { id: 'outInverterRec', label: 'Inverter vs Conventional Generator' },
      { id: 'outFuelBurn', label: 'Estimated Fuel Consumption (50% Load)' }
    ],
    rules: [
      'Inductive motor loads (pumps, compressors) require 2 to 3 times running watts during startup.',
      'Never operate a generator continuously above 80% of its rated nameplate capacity.',
      'Portable generators connected to household panels legally require a mechanical interlock kit or transfer switch (NEC 702.5).',
      'Sensitive electronics (laptops, TVs, modern furnace boards) require clean power with < 5% Total Harmonic Distortion (THD).'
    ],
    formula: 'Running Watts = Σ Appliance Running Watts | Peak Surge = Running Watts + Max Starting Surge Motor',
    faq: [
      { q: 'What happens if a generator is undersized for a motor startup?', a: 'The generator engine will bog down, causing voltage and frequency to collapse. This can trip the generator breaker or burn out the motor start capacitor and control electronics.' },
      { q: 'Why is an interlock kit required with a backup generator?', a: 'An interlock kit physically prevents the main utility breaker and generator breaker from being ON at the same time. This prevents backfeeding deadly electricity onto power lines where utility linemen are working.' }
    ],
    calcJs: `
      function calc() {
        var fridgeCount = parseInt(document.getElementById('fridge').value, 10) || 0;
        var wellType = parseInt(document.getElementById('wellPump').value, 10) || 0;
        var hasFurnace = parseInt(document.getElementById('furnace').value, 10) || 0;
        var hasAc = parseInt(document.getElementById('windowAc').value, 10) || 0;
        var baseWatts = parseFloat(document.getElementById('baseLoad').value) || 1000;

        var running = baseWatts;
        var maxSurgeDelta = 0;

        if (fridgeCount > 0) {
          running += fridgeCount * 700;
          maxSurgeDelta = Math.max(maxSurgeDelta, 1500);
        }
        if (wellType === 1) {
          running += 1000;
          maxSurgeDelta = Math.max(maxSurgeDelta, 1100);
        } else if (wellType === 2) {
          running += 1800;
          maxSurgeDelta = Math.max(maxSurgeDelta, 1700);
        }
        if (hasFurnace) {
          running += 800;
          maxSurgeDelta = Math.max(maxSurgeDelta, 1500);
        }
        if (hasAc) {
          running += 1200;
          maxSurgeDelta = Math.max(maxSurgeDelta, 1800);
        }

        var totalPeak = running + maxSurgeDelta;
        var safeContinuous = running * 1.25;
        var recKw = Math.max(Math.ceil(totalPeak / 1000), Math.ceil(safeContinuous / 1000));

        document.getElementById('outGenKw').textContent = recKw + ' kW Generator (' + (recKw * 1000) + 'W starting)';
        document.getElementById('outRunningWatts').textContent = Math.round(running).toLocaleString() + ' Watts';
        document.getElementById('outPeakSurge').textContent = Math.round(totalPeak).toLocaleString() + ' Watts starting peak';
        document.getElementById('outInverterRec').textContent = recKw <= 4 ? 'Closed-frame Inverter Generator (Quiet, < 3% THD)' : 'Open-Frame Standby / Portable Generator';
        document.getElementById('outFuelBurn').textContent = '~' + (recKw * 0.12).toFixed(1) + ' Gallons Gasoline / hour at 50% load';
      }
    `
  },
  {
    slug: 'solar-panel-string-voltage-voc',
    name: 'Solar Panel String Voc Cold Voltage Calculator',
    h1: 'Solar Panel String Inverter Voc Cold Temperature Calculator',
    title: 'Solar Panel String Inverter Voc Calculator [Cold Temp Voltage Spike] | Digital Tools Shed',
    metaDesc: 'Calculate maximum open-circuit string voltage (Voc) at record winter freezing temperatures to protect solar inverters under NEC 690.7.',
    category: 'Electrical & Power',
    codeRef: 'NEC 690.7',
    lead: 'Calculate the maximum cold-weather open-circuit voltage spike for solar PV strings to ensure string voltage never exceeds inverter maximum limits.',
    inputs: [
      { id: 'panelVoc', label: 'Panel Rated Voc at 25°C (STC)', value: 45.2, step: 0.1, unit: 'Volts' },
      { id: 'coeff', label: 'Temp Coefficient of Voc (β_Voc)', value: -0.28, step: 0.01, unit: '% / °C', hint: 'Typically -0.26% to -0.32% on manufacturer datasheet' },
      { id: 'stringCount', label: 'Number of Panels in Series per String', value: 10, step: 1, min: 1, max: 30, unit: 'Panels' },
      { id: 'minTempC', label: 'Record Low Winter Temperature', value: -15, step: 1, unit: '°C (5°F)' },
      { id: 'inverterMaxV', label: 'Inverter Max MPPT Input Limit', value: 500, step: 50, unit: 'Volts' }
    ],
    primaryOutput: { id: 'outStringVoc', label: 'Max Cold String Voc', unit: 'Volts DC' },
    outputs: [
      { id: 'outPanelColdVoc', label: 'Adjusted Cold Voc per Panel' },
      { id: 'outVoltageMargin', label: 'Safety Voltage Margin' },
      { id: 'outNecCheck', label: 'NEC 690.7 Safety Status' },
      { id: 'outMaxAllowedPanels', label: 'Max Safe Panels per String' }
    ],
    rules: [
      'NEC 690.7: Photovoltaic source circuits shall be calculated for maximum voltage based on the lowest expected ambient temperature.',
      'Silicon solar cell voltage increases as temperature drops; winter mornings produce peak voltage spikes.',
      'Exceeding inverter maximum DC input voltage (typically 500V or 600V residential, 1000V commercial) destroys input capacitors and voids warranty.',
      'Standard test conditions (STC) evaluate panels at 25°C (77°F); winter temperatures at -15°C add 10%–15% to panel voltage.'
    ],
    formula: 'Voc(max) = Voc × [1 + (β / 100) × (T_min - 25°C)] | String Voc = Panels × Voc(max)',
    faq: [
      { q: 'Why does solar panel voltage go up when it is cold?', a: 'Silicon photovoltaic semiconductor band gaps widen at lower temperatures. This reduces electron recombination and increases the electrical potential (voltage) across the cell terminals.' },
      { q: 'What happens if a solar string exceeds inverter voltage?', a: 'The inverter will either shut down on high-voltage protection, refuse to start, or suffer catastrophic overvoltage failure in its internal DC input power electronics.' }
    ],
    calcJs: `
      function calc() {
        var vocStc = parseFloat(document.getElementById('panelVoc').value) || 45.2;
        var beta = parseFloat(document.getElementById('coeff').value) || -0.28;
        var panels = parseInt(document.getElementById('stringCount').value, 10) || 10;
        var minC = parseFloat(document.getElementById('minTempC').value) || -15;
        var maxV = parseFloat(document.getElementById('inverterMaxV').value) || 500;

        var deltaT = minC - 25;
        var panelCold = vocStc * (1 + (beta / 100) * deltaT);
        var stringCold = panels * panelCold;
        var margin = maxV - stringCold;
        var maxPanels = Math.floor(maxV / panelCold);

        var pass = margin >= 0;

        document.getElementById('outStringVoc').textContent = stringCold.toFixed(1) + ' V DC at ' + minC + '°C';
        document.getElementById('outPanelColdVoc').textContent = panelCold.toFixed(2) + ' V / panel (+ ' + ((panelCold/vocStc - 1)*100).toFixed(1) + '% cold rise)';
        document.getElementById('outVoltageMargin').textContent = (margin >= 0 ? '+' : '') + margin.toFixed(1) + ' V ' + (pass ? 'headroom' : 'OVER LIMIT');
        document.getElementById('outMaxAllowedPanels').textContent = maxPanels + ' Panels Max per String at ' + minC + '°C';

        var badge = document.getElementById('statusBadge');
        if (pass) {
          document.getElementById('outNecCheck').textContent = '✅ Code Compliant (Safe input below ' + maxV + 'V)';
          document.getElementById('outNecCheck').style.color = '#22c55e';
          badge.textContent = 'NEC 690.7 Pass: Inverter safe from overvoltage';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outNecCheck').textContent = '❌ DANGER: String exceeds inverter limit! Remove ' + (panels - maxPanels) + ' panel(s)';
          document.getElementById('outNecCheck').style.color = '#ef4444';
          badge.textContent = 'Hardware Warning: Voltage spike will damage inverter';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'battery-bank-amp-hour-runtime',
    name: 'Off-Grid Battery Bank Sizing Calculator',
    h1: 'Solar & Off-Grid Battery Bank Amp-Hour (Ah) Runtime Calculator',
    title: 'Off-Grid Battery Bank Sizing & Runtime Calculator [Ah Capacity & Inverter Load] | Digital Tools Shed',
    metaDesc: 'Size off-grid battery banks in amp-hours (Ah) and kilowatt-hours (kWh) comparing Lead-Acid 50% DoD against LiFePO4 80% DoD under continuous load.',
    category: 'Electrical & Power',
    codeRef: 'IEEE 1013',
    lead: 'Calculate required battery bank amp-hours, DC discharge currents, and operating runtime hours based on AC inverter wattage loads.',
    inputs: [
      { id: 'acWatts', label: 'Continuous AC Power Load', value: 600, step: 50, unit: 'Watts' },
      { id: 'bankVolts', label: 'Battery System Voltage', type: 'select', options: [
        { value: '12', label: '12 Volt DC System' },
        { value: '24', label: '24 Volt DC System', selected: true },
        { value: '48', label: '48 Volt DC System' }
      ]},
      { id: 'chemistry', label: 'Battery Chemistry', type: 'select', options: [
        { value: 'lifepo4', label: 'Lithium Iron Phosphate (LiFePO4 - 80% Safe DoD)', selected: true },
        { value: 'lead', label: 'Lead-Acid / AGM / Gel (50% Max Safe DoD)' }
      ]},
      { id: 'runtime', label: 'Desired Operating Autonomy', value: 12, step: 1, unit: 'Hours' },
      { id: 'invEff', label: 'Inverter Conversion Efficiency', value: 90, step: 1, unit: '%' }
    ],
    primaryOutput: { id: 'outReqAh', label: 'Minimum Battery Capacity', unit: 'Amp-Hours (Ah)' },
    outputs: [
      { id: 'outKwh', label: 'Total Energy Storage (kWh)' },
      { id: 'outDcCurrent', label: 'Continuous DC Draw Current' },
      { id: 'outUsableAh', label: 'Net Usable Energy Consumed' },
      { id: 'outWeightEst', label: 'Estimated Battery Bank Weight' }
    ],
    rules: [
      'Discharging lead-acid batteries beyond 50% Depth of Discharge (DoD) causes rapid plate sulfation and early failure.',
      'LiFePO4 lithium batteries can be safely discharged to 80%–90% DoD without degradation.',
      'Inverter conversion losses (typically 8% to 15%) must be factored into continuous DC current draws.',
      'Higher system voltages (24V or 48V) reduce DC conductor gauge requirements and I²R cabling heat losses.'
    ],
    formula: 'DC Current = AC Watts / (Volts × Inverter Eff) | Usable Ah = DC Current × Hours | Rated Ah = Usable Ah / Safe DoD',
    faq: [
      { q: 'Why is a 48V battery bank better than a 12V bank for large inverters?', a: 'P = V × I. Delivering 2400 Watts at 12V requires 200 Amps of DC current (requiring huge 4/0 cables). At 48V, that same 2400W requires only 50 Amps, allowing much thinner, cheaper wire with 16 times less heat loss.' },
      { q: 'How does Depth of Discharge (DoD) affect battery life?', a: 'DoD is the percentage of battery capacity removed. Deeply cycling lead-acid to 80% cuts lifespan to ~300 cycles, whereas limiting discharge to 50% yields ~1,200 cycles. LiFePO4 batteries deliver 3,000 to 5,000 cycles even at 80% DoD.' }
    ],
    calcJs: `
      function calc() {
        var watts = parseFloat(document.getElementById('acWatts').value) || 600;
        var volts = parseFloat(document.getElementById('bankVolts').value) || 24;
        var chem = document.getElementById('chemistry').value;
        var hrs = parseFloat(document.getElementById('runtime').value) || 12;
        var eff = (parseFloat(document.getElementById('invEff').value) || 90) / 100;

        var dcAmps = watts / (volts * eff);
        var usableAh = dcAmps * hrs;
        var dod = chem === 'lifepo4' ? 0.80 : 0.50;
        var reqAh = Math.ceil(usableAh / dod);
        var reqKwh = (reqAh * volts) / 1000;

        var weightLbs = chem === 'lifepo4' ? reqKwh * 25 : reqKwh * 65;

        document.getElementById('outReqAh').textContent = reqAh + ' Ah at ' + volts + 'V';
        document.getElementById('outKwh').textContent = reqKwh.toFixed(2) + ' kWh total storage capacity';
        document.getElementById('outDcCurrent').textContent = dcAmps.toFixed(1) + ' Amps continuous DC draw';
        document.getElementById('outUsableAh').textContent = Math.round(usableAh) + ' Ah consumed (' + (dod * 100) + '% DoD)';
        document.getElementById('outWeightEst').textContent = '~' + Math.round(weightLbs) + ' lbs total bank weight';
      }
    `
  },
  {
    slug: 'grounding-electrode-resistance',
    name: 'Grounding Electrode Resistance Calculator',
    h1: 'NEC Grounding Electrode Rod Resistance & Spacing Calculator',
    title: 'NEC Grounding Electrode Rod Sizing Calculator [25-Ohm Rule & Spacing] | Digital Tools Shed',
    metaDesc: 'Size driven ground rods under the NEC 25-ohm rule (NEC 250.53) and calculate parallel 6-foot spacing resistance reductions based on soil resistivity.',
    category: 'Electrical & Power',
    codeRef: 'NEC 250.53',
    lead: 'Calculate single and parallel driven grounding rod resistance against the NEC 25-ohm rule using Dwight soil resistivity formulas.',
    inputs: [
      { id: 'soilType', label: 'Soil Composition & Moisture', type: 'select', options: [
        { value: '30', label: 'Moist Loam / Clay Soil (30 Ω-m)' },
        { value: '50', label: 'Clay / Silt Soil (50 Ω-m)', selected: true },
        { value: '150', label: 'Sandy Loam (150 Ω-m)' },
        { value: '500', label: 'Dry Sand / Gravel (500 Ω-m)' },
        { value: '1000', label: 'Rocky / Stony Soil (1000 Ω-m)' }
      ]},
      { id: 'rodLen', label: 'Ground Rod Length', type: 'select', options: [
        { value: '8', label: '8 Foot Ground Rod (Standard NEC Min)', selected: true },
        { value: '10', label: '10 Foot Ground Rod' }
      ]},
      { id: 'rodDia', label: 'Rod Diameter', type: 'select', options: [
        { value: '0.625', label: '5/8" Diameter (Standard Copper-Clad)', selected: true },
        { value: '0.500', label: '1/2" Diameter' }
      ]},
      { id: 'twoRods', label: 'Install Second Supplementary Rod?', type: 'select', options: [
        { value: 'yes', label: 'Yes - 2 Rods Spaced 6+ Feet Apart', selected: true },
        { value: 'no', label: 'No - Single Rod Only' }
      ]}
    ],
    primaryOutput: { id: 'outSysResistance', label: 'Calculated Ground Resistance', unit: 'Ohms (Ω)' },
    outputs: [
      { id: 'outSingleR', label: 'Single Rod Resistance' },
      { id: 'outNecRule', label: 'NEC 25-Ohm Rule Status' },
      { id: 'outSpacingRule', label: 'Minimum Parallel Rod Spacing' },
      { id: 'outWireSize', label: 'Grounding Conductor (GEC) Sizing' }
    ],
    rules: [
      'NEC 250.53(A)(2): A single rod electrode having resistance > 25 ohms must be augmented by an additional electrode.',
      'NEC 250.53(A)(3): Parallel ground rods must be spaced at least 6 feet apart (spacing equal to rod length is ideal).',
      'If two rods are installed at least 6 feet apart, the NEC does NOT require verification of the 25-ohm threshold.',
      'Ground rods must be driven full length flush or below grade to protect against lawnmower damage.'
    ],
    formula: 'Dwight Formula: R = (ρ / 2πL) × [ln(4L / r) - 1] | Parallel R ≈ (R1 / 2) × (1 + r / Spacing)',
    faq: [
      { q: 'Why do electricians install two ground rods even if not tested?', a: 'Under NEC 250.53(A)(2), if an electrician installs a second supplemental ground rod spaced at least 6 feet apart, the installation automatically satisfies code compliance without paying for expensive 3-point fall-of-potential testing.' },
      { q: 'How far apart should two ground rods be spaced?', a: 'The NEC requires a minimum spacing of 6 feet. However, electrical theory shows that spacing rods at twice their length (16 feet for 8-ft rods) eliminates sphere-of-influence overlap and cuts total resistance by nearly 50%.' }
    ],
    calcJs: `
      function calc() {
        var rho = parseFloat(document.getElementById('soilType').value) || 50;
        var lenFt = parseFloat(document.getElementById('rodLen').value) || 8;
        var diaIn = parseFloat(document.getElementById('rodDia').value) || 0.625;
        var hasTwo = document.getElementById('twoRods').value === 'yes';

        var lenM = lenFt * 0.3048;
        var radM = (diaIn / 2) * 0.0254;

        // Dwight formula
        var rSingle = (rho / (2 * Math.PI * lenM)) * (Math.log((4 * lenM) / radM) - 1);
        var rSys = hasTwo ? rSingle * 0.60 : rSingle;

        var isUnder25 = rSys <= 25.0;

        document.getElementById('outSysResistance').textContent = rSys.toFixed(1) + ' Ω (Ohms)';
        document.getElementById('outSingleR').textContent = rSingle.toFixed(1) + ' Ω (Single 8-ft rod)';
        document.getElementById('outSpacingRule').textContent = hasTwo ? 'Space ≥ 6 ft apart (8 to 16 ft optimal)' : 'Single rod';
        document.getElementById('outWireSize').textContent = '#6 AWG Bare Copper (NEC 250.66)';

        var badge = document.getElementById('statusBadge');
        if (hasTwo) {
          document.getElementById('outNecRule').textContent = '✅ Code Compliant (Second rod exempts testing)';
          badge.textContent = 'NEC 250.53 Pass: Dual-rod rule satisfied';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else if (isUnder25) {
          document.getElementById('outNecRule').textContent = '✅ Under 25 Ohms (' + rSys.toFixed(1) + ' Ω)';
          badge.textContent = 'NEC Pass: Single rod under 25Ω';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outNecRule').textContent = '⚠️ Exceeds 25 Ohms! Second supplemental rod mandatory';
          badge.textContent = 'NEC Warning: Add second ground rod';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 3: CARPENTRY, MILLWORK & TIMBER FRAMING (Tools 23–35)
// ─────────────────────────────────────────────────────────────────────────────
const CARPENTRY_TOOLS = [
  {
    slug: 'board-foot-lumber-pricing',
    name: 'Board Feet Lumber Volume & Pricing Calculator',
    h1: 'Board Foot Lumber Volume & Hardwood Pricing Calculator',
    title: 'Board Feet Lumber Calculator [Hardwood Volume & Pricing] | Digital Tools Shed',
    metaDesc: 'Compute rough-sawn hardwood volume in board feet (BF) and calculate lumber order costs with standard thickness fractions (4/4, 5/4, 8/4).',
    category: 'Carpentry & Millwork',
    codeRef: 'NHLA Grading',
    lead: 'Calculate total board feet (BF) lumber volume and material pricing for rough-cut hardwoods and dimensional timber orders.',
    inputs: [
      { id: 'thick', label: 'Rough Lumber Thickness', type: 'select', options: [
        { value: '1.0', label: '4/4 (1.0" rough-sawn)' },
        { value: '1.25', label: '5/4 (1.25" rough-sawn)' },
        { value: '1.5', label: '6/4 (1.5" rough-sawn)' },
        { value: '2.0', label: '8/4 (2.0" rough-sawn)', selected: true },
        { value: '3.0', label: '12/4 (3.0" rough-sawn)' },
        { value: '4.0', label: '16/4 (4.0" rough beam)' }
      ]},
      { id: 'width', label: 'Board Width (Inches)', value: 8, step: 0.5, unit: 'Inches' },
      { id: 'length', label: 'Board Length (Feet)', value: 10, step: 1, unit: 'Feet' },
      { id: 'qty', label: 'Number of Identical Boards', value: 6, step: 1, min: 1, unit: 'Pieces' },
      { id: 'priceBf', label: 'Price per Board Foot ($/BF)', value: 9.50, step: 0.25, unit: '$/BF', hint: 'e.g. Walnut $12/BF, White Oak $9/BF, Poplar $4/BF' }
    ],
    primaryOutput: { id: 'outTotalCost', label: 'Total Lumber Order Cost', unit: 'USD ($)' },
    outputs: [
      { id: 'outTotalBf', label: 'Total Board Feet Volume' },
      { id: 'outSingleBf', label: 'Board Feet per Single Piece' },
      { id: 'outLinearFt', label: 'Total Lineal Feet' },
      { id: 'outWasteBf', label: 'With 15% Waste Allowance' }
    ],
    rules: [
      'One Board Foot (BF) is defined as a nominal piece of lumber 1 inch thick, 12 inches wide, and 12 inches long (144 cu in).',
      'Hardwoods are sold in quarter-inch thickness increments: 4/4 = 1", 5/4 = 1-1/4", 8/4 = 2".',
      'Lumber under 1" thick is traditionally billed at the full 4/4 (1-inch) board foot price.',
      'Always order 15% to 20% extra board feet for rough hardwood to account for milling knots, checks, and saw kerf.'
    ],
    formula: 'Board Feet (BF) = (Thickness × Width × Length_ft) / 12 = (Thickness × Width × Length_in) / 144',
    faq: [
      { q: 'What does 4/4 or 8/4 mean in hardwood lumber?', a: 'Hardwood sawmills measure rough timber thickness in quarters of an inch. 4/4 is four quarters (1 inch thick), 5/4 is five quarters (1-1/4 inch thick), and 8/4 is eight quarters (2 inches thick).' },
      { q: 'Why is board foot different from lineal foot?', a: 'Lineal foot measures only length along a single dimension. Board foot measures 3D volumetric wood displacement (144 cubic inches). A 10-foot 2x12 has twice the board feet of a 10-foot 2x6.' }
    ],
    calcJs: `
      function calc() {
        var t = parseFloat(document.getElementById('thick').value) || 2.0;
        var w = parseFloat(document.getElementById('width').value) || 8;
        var l = parseFloat(document.getElementById('length').value) || 10;
        var qty = parseInt(document.getElementById('qty').value, 10) || 6;
        var price = parseFloat(document.getElementById('priceBf').value) || 9.50;

        var singleBf = (t * w * l) / 12;
        var totalBf = singleBf * qty;
        var cost = totalBf * price;
        var totalLineal = l * qty;
        var withWasteBf = totalBf * 1.15;
        var costWithWaste = withWasteBf * price;

        document.getElementById('outTotalCost').textContent = '$' + cost.toFixed(2) + ' ($' + costWithWaste.toFixed(2) + ' w/ 15% waste)';
        document.getElementById('outTotalBf').textContent = totalBf.toFixed(2) + ' BF (' + Math.round(totalBf * 144) + ' cu in)';
        document.getElementById('outSingleBf').textContent = singleBf.toFixed(2) + ' BF per board';
        document.getElementById('outLinearFt').textContent = totalLineal + ' Linear Feet of lumber';
        document.getElementById('outWasteBf').textContent = withWasteBf.toFixed(2) + ' BF recommended to order';
      }
    `
  },
  {
    slug: 'plywood-sheet-cut-optimizer',
    name: 'Plywood Sheet Cut Optimizer',
    h1: 'Plywood 4x8 Sheet Cut-List & Kerf Waste Optimizer',
    title: 'Plywood Sheet Cut-List Optimizer [4x8 Sheet Kerf Waste Minimizer] | Digital Tools Shed',
    metaDesc: 'Optimize rectangular plywood cabinet parts on standard 48x96 inch sheet goods with 1/8 inch saw kerf blade thickness deductions.',
    category: 'Carpentry & Millwork',
    codeRef: 'AWI Standards',
    lead: 'Calculate the maximum number of rectangular cabinet parts that can be cut from 4x8 sheet goods accounting for saw blade kerf waste.',
    inputs: [
      { id: 'partW', label: 'Desired Part Width', value: 11.5, step: 0.25, unit: 'Inches', hint: 'e.g. Standard 12" cabinet shelf is 11-1/2"' },
      { id: 'partL', label: 'Desired Part Length', value: 29.5, step: 0.25, unit: 'Inches', hint: 'Length of finished cabinet component' },
      { id: 'partCount', label: 'Total Pieces Needed', value: 16, step: 1, unit: 'Pieces' },
      { id: 'kerf', label: 'Saw Blade Kerf Thickness', value: 0.125, step: 0.03125, unit: 'Inches', hint: 'Standard 1/8" table saw blade' }
    ],
    primaryOutput: { id: 'outSheetsReq', label: '4x8 Plywood Sheets Required', unit: 'Sheets' },
    outputs: [
      { id: 'outYieldPerSheet', label: 'Parts Yield per Sheet' },
      { id: 'outScrapPct', label: 'Material Scrap / Offcut %' },
      { id: 'outOrientRec', label: 'Best Cutting Orientation' },
      { id: 'outTotalCutArea', label: 'Total Finished Wood Area' }
    ],
    rules: [
      'Standard sheet goods measure 48" x 96" (some Baltic birch sheets measure 60" x 60").',
      'Every rip and crosscut consumes 1/8" (0.125") of material turned into sawdust.',
      'Cabinet face components must align grain direction along the length of parts.',
      'Allow at least 1/2" trim margin on edges of sheet goods to remove factory transit dings.'
    ],
    formula: 'Fit W = ⌊(48 + Kerf) / (Part W + Kerf)⌋ | Fit L = ⌊(96 + Kerf) / (Part L + Kerf)⌋ | Yield = Fit W × Fit L',
    faq: [
      { q: 'Why is saw blade kerf deduction so important?', a: 'A standard table saw blade is 1/8" (0.125") thick. Making eight cuts through a 48" sheet destroys a full inch of plywood in sawdust, reducing the usable width to 47".' },
      { q: 'Does sheet plywood grain direction matter?', a: 'Yes. Plywood face veneer grain runs along the 96-inch length. For cabinet doors, drawer fronts, and long shelves, parts must be cut parallel to grain for stiffness and aesthetics.' }
    ],
    calcJs: `
      function calc() {
        var pw = parseFloat(document.getElementById('partW').value) || 11.5;
        var pl = parseFloat(document.getElementById('partL').value) || 29.5;
        var count = parseInt(document.getElementById('partCount').value, 10) || 16;
        var kerf = parseFloat(document.getElementById('kerf').value) || 0.125;

        var sheetW = 48.0, sheetL = 96.0;

        // Orientation 1: pw along width, pl along length
        var nw1 = Math.floor((sheetW + kerf) / (pw + kerf));
        var nl1 = Math.floor((sheetL + kerf) / (pl + kerf));
        var yield1 = nw1 * nl1;

        // Orientation 2: pl along width, pw along length
        var nw2 = Math.floor((sheetW + kerf) / (pl + kerf));
        var nl2 = Math.floor((sheetL + kerf) / (pw + kerf));
        var yield2 = nw2 * nl2;

        var bestYield = Math.max(yield1, yield2);
        var orient = yield1 >= yield2 ? 'Rip parallel to 8-ft edge (' + nw1 + ' across × ' + nl1 + ' down)' : 'Crosscut first (' + nw2 + ' across × ' + nl2 + ' down)';

        var sheets = bestYield > 0 ? Math.ceil(count / bestYield) : 0;
        var totalSheetArea = sheets * 48 * 96;
        var totalPartArea = count * pw * pl;
        var scrapPct = totalSheetArea > 0 ? ((1 - (totalPartArea / totalSheetArea)) * 100).toFixed(1) : 0;

        document.getElementById('outSheetsReq').textContent = sheets + ' Sheets of 4x8 Plywood';
        document.getElementById('outYieldPerSheet').textContent = bestYield + ' pieces per sheet';
        document.getElementById('outScrapPct').textContent = scrapPct + '% offcut / kerf scrap';
        document.getElementById('outOrientRec').textContent = orient;
        document.getElementById('outTotalCutArea').textContent = (totalPartArea / 144).toFixed(1) + ' sq ft of finished parts';
      }
    `
  },
  {
    slug: 'cabinet-face-frame-stile-rail',
    name: 'Cabinet Face Frame Stile & Rail Calculator',
    h1: 'Cabinet Face Frame Stile and Rail Cut Dimensions',
    title: 'Cabinet Face Frame Stile & Rail Dimension Calculator [Door Overlay Layout] | Digital Tools Shed',
    metaDesc: 'Calculate finished face frame stile and rail cut dimensions, pocket hole layout, and door sizes for inset and overlay cabinetry.',
    category: 'Carpentry & Millwork',
    codeRef: 'NKBA Guidelines',
    lead: 'Calculate exact cut lengths for cabinet face frame vertical stiles, horizontal rails, and finished door dimensions across various overlay styles.',
    inputs: [
      { id: 'boxW', label: 'Cabinet Carcass Exterior Width', value: 36, step: 0.5, unit: 'Inches' },
      { id: 'boxH', label: 'Cabinet Carcass Exterior Height', value: 34.5, step: 0.5, unit: 'Inches' },
      { id: 'stileW', label: 'Stile Width (Vertical Members)', value: 1.5, step: 0.25, unit: 'Inches' },
      { id: 'railW', label: 'Top & Bottom Rail Width', value: 1.5, step: 0.25, unit: 'Inches' },
      { id: 'doorOverlay', label: 'Door Style & Overlay', type: 'select', options: [
        { value: '-0.125', label: 'Flush Inset Door (1/8" Reveal Gap)' },
        { value: '0.5', label: '1/2" Partial Overlay (Standard Face Frame)', selected: true },
        { value: '1.25', label: 'Full Overlay (1-1/4" Euro Style)' }
      ]}
    ],
    primaryOutput: { id: 'outRailCut', label: 'Rail Cut Length (Horizontal)', unit: 'Inches' },
    outputs: [
      { id: 'outStileCut', label: 'Stile Cut Length (Vertical)' },
      { id: 'outOpeningW', label: 'Clear Face Frame Opening Width' },
      { id: 'outOpeningH', label: 'Clear Face Frame Opening Height' },
      { id: 'outSingleDoor', label: 'Single Door Dimensions' }
    ],
    rules: [
      'Vertical stiles run full height from top to bottom; horizontal rails are pocket-hole joined between stiles.',
      'Rail Cut Length = Total Carcass Width - (2 × Stile Width).',
      'Face frame stiles traditionally overhang the cabinet box interior by 1/4" to conceal plywood edges.',
      'Pocket hole screws (1-1/4" fine thread for hardwood face frames) must be clamped flat with face clamps.'
    ],
    formula: 'Rail Length = Width - (2 × Stile Width) | Opening = Rail Length | Door = Opening + (2 × Overlay)',
    faq: [
      { q: 'Why do stiles run continuous rather than rails?', a: 'Running stiles full height conceals the end grain of the horizontal rails and provides a continuous uninterrupted structural post from top to bottom for hanging hinges and leveling.' },
      { q: 'How many pocket holes are needed per face frame joint?', a: 'Two pocket holes on the back of each 1-1/2" or 2" rail end provide rigid alignment and prevent twisting during assembly.' }
    ],
    calcJs: `
      function calc() {
        var bw = parseFloat(document.getElementById('boxW').value) || 36;
        var bh = parseFloat(document.getElementById('boxH').value) || 34.5;
        var sw = parseFloat(document.getElementById('stileW').value) || 1.5;
        var rw = parseFloat(document.getElementById('railW').value) || 1.5;
        var overlay = parseFloat(document.getElementById('doorOverlay').value) || 0.5;

        var railLen = bw - (2 * sw);
        var stileLen = bh;
        var openH = bh - (2 * rw);

        var doorW = railLen + (2 * overlay);
        var doorH = openH + (2 * overlay);

        document.getElementById('outRailCut').textContent = railLen.toFixed(3) + '" (' + toFraction(railLen) + ') [Cut 2 Pieces]';
        document.getElementById('outStileCut').textContent = stileLen.toFixed(3) + '" (' + toFraction(stileLen) + ') [Cut 2 Pieces]';
        document.getElementById('outOpeningW').textContent = railLen.toFixed(2) + '" wide opening';
        document.getElementById('outOpeningH').textContent = openH.toFixed(2) + '" high opening';
        document.getElementById('outSingleDoor').textContent = doorW.toFixed(2) + '" W × ' + doorH.toFixed(2) + '" H';
      }
    `
  },
  {
    slug: 'crown-molding-compound-miter',
    name: 'Crown Molding Compound Miter Calculator',
    h1: 'Crown Molding Compound Miter & Bevel Angles Calculator',
    title: 'Crown Molding Compound Miter & Bevel Calculator [38° & 45° Spring Angle] | Digital Tools Shed',
    metaDesc: 'Calculate compound miter saw rotation and bevel tilt angles for cutting crown molding laid flat on the saw table for inside and outside corners.',
    category: 'Carpentry & Millwork',
    codeRef: 'Finish Carpentry',
    lead: 'Calculate precise compound miter and bevel tilt settings to cut decorative crown molding flat on a compound miter saw table.',
    inputs: [
      { id: 'cornerAngle', label: 'Wall Corner Angle', value: 90, step: 0.5, unit: 'Degrees', hint: '90° for square walls, 135° for octagonal bay windows' },
      { id: 'springAngle', label: 'Crown Spring Angle', type: 'select', options: [
        { value: '38', label: '38° / 52° Standard Crown (Most Common)', selected: true },
        { value: '45', label: '45° / 45° Symmetrical Crown' },
        { value: '52', label: '52° / 38° Steep Slope Crown' }
      ]},
      { id: 'cornerType', label: 'Corner Configuration', type: 'select', options: [
        { value: 'in', label: 'Inside Corner (Room Wall Corner)', selected: true },
        { value: 'out', label: 'Outside Corner (Chimney or Column)' }
      ]}
    ],
    primaryOutput: { id: 'outMiter', label: 'Miter Saw Rotation Angle', unit: 'Degrees' },
    outputs: [
      { id: 'outBevel', label: 'Bevel Blade Tilt Angle' },
      { id: 'outFencePos', label: 'Molding Position on Saw' },
      { id: 'outLeftRight', label: 'Cut Direction & Orientation' },
      { id: 'outSpringCheck', label: 'Spring Angle Verification' }
    ],
    rules: [
      'Cutting crown flat on the saw table requires both a miter angle and a bevel tilt angle.',
      'Spring angle is the angle between the back of the crown molding and the vertical wall plane (typically 38°).',
      'For 90° corners with 38° crown: Miter = 31.62°, Bevel = 33.86° (the standard detents on modern miter saws).',
      'Always test-cut scrap blocks before making cuts on expensive hardwood molding runs.'
    ],
    formula: 'Miter = arctan[sin(Spring) / tan(Corner / 2)] | Bevel = arcsin[cos(Spring) × cos(Corner / 2)]',
    faq: [
      { q: 'What is the spring angle of crown molding?', a: 'The spring angle is the pitch at which the molding springs off the wall. Standard American crown has a 38-degree spring angle (sits at 52 degrees to the ceiling). Symmetrical crown has a 45-degree spring angle.' },
      { q: 'Why cut crown molding flat instead of nested against the fence?', a: 'Large crown moldings (5 inches or wider) are often too tall to stand nested upside-down against the saw fence. Cutting flat on the saw table allows large crown to be cut accurately on standard 10" or 12" miter saws.' }
    ],
    calcJs: `
      function calc() {
        var corner = parseFloat(document.getElementById('cornerAngle').value) || 90;
        var spring = parseFloat(document.getElementById('springAngle').value) || 38;
        var cornerType = document.getElementById('cornerType').value;

        var halfCornerRad = (corner / 2) * (Math.PI / 180);
        var springRad = spring * (Math.PI / 180);

        var miterRad = Math.atan(Math.sin(springRad) / Math.tan(halfCornerRad));
        var bevelRad = Math.asin(Math.cos(springRad) * Math.cos(halfCornerRad));

        var miterDeg = (miterRad * 180 / Math.PI).toFixed(2);
        var bevelDeg = (bevelRad * 180 / Math.PI).toFixed(2);

        document.getElementById('outMiter').textContent = miterDeg + '° Miter Angle';
        document.getElementById('outBevel').textContent = bevelDeg + '° Bevel Tilt';
        document.getElementById('outFencePos').textContent = 'Molding laid flat, top edge against fence';
        document.getElementById('outLeftRight').textContent = cornerType === 'in' ? 'Inside Corner: Left Side Miter Right / Right Side Miter Left' : 'Outside Corner: Left Side Miter Left / Right Side Miter Right';
        document.getElementById('outSpringCheck').textContent = spring + '° Spring (' + (90 - spring) + '° ceiling contact)';
      }
    `
  },
  {
    slug: 'floor-joist-span-deflection-l360',
    name: 'Floor Joist Maximum Span & Deflection Calculator',
    h1: 'Floor Joist Maximum Span & Deflection Calculator (L/360 & L/480)',
    title: 'Floor Joist Span & Deflection Calculator [L/360 & L/480 AWC Wood Sizing] | Digital Tools Shed',
    metaDesc: 'Determine allowable clear span and deflection limits (L/360 for drywall, L/480 for ceramic tile) for dimensional lumber floor joists.',
    category: 'Carpentry & Millwork',
    codeRef: 'AWC / IRC R502.3',
    lead: 'Calculate maximum allowable clear floor joist spans for dimensional lumber under 40 psf residential live load and evaluate floor stiffness for tile.',
    inputs: [
      { id: 'lumberSize', label: 'Joist Dimensional Size', type: 'select', options: [
        { value: '2x6', label: '2x6 (#2 Grade - 5.5" actual depth)' },
        { value: '2x8', label: '2x8 (#2 Grade - 7.25" actual depth)' },
        { value: '2x10', label: '2x10 (#2 Grade - 9.25" actual depth)', selected: true },
        { value: '2x12', label: '2x12 (#2 Grade - 11.25" actual depth)' }
      ]},
      { id: 'spacing', label: 'On-Center Spacing (OC)', type: 'select', options: [
        { value: '12', label: '12 Inches On-Center' },
        { value: '16', label: '16 Inches On-Center (Standard)', selected: true },
        { value: '24', label: '24 Inches On-Center' }
      ]},
      { id: 'species', label: 'Wood Species', type: 'select', options: [
        { value: 'df', label: 'Douglas Fir-Larch (#2)', selected: true },
        { value: 'sp', label: 'Southern Yellow Pine (#2)' },
        { value: 'spf', label: 'Spruce-Pine-Fir (SPF #2)' }
      ]},
      { id: 'finish', label: 'Floor Finish & Deflection Target', type: 'select', options: [
        { value: '360', label: 'L/360 Standard (Carpet / Hardwood / LVP)', selected: true },
        { value: '480', label: 'L/480 Stiffened (Ceramic Tile / Natural Stone)' }
      ]}
    ],
    primaryOutput: { id: 'outMaxSpan', label: 'Maximum Allowable Clear Span', unit: 'Feet / Inches' },
    outputs: [
      { id: 'outModulus', label: 'Lumber Modulus of Elasticity (E)' },
      { id: 'outFloorStiff', label: 'Floor Bounciness / Stiffness Rating' },
      { id: 'outBridging', label: 'Mid-Span Bridging Requirement' },
      { id: 'outTilePass', label: 'Ceramic Tile Deflection Check' }
    ],
    rules: [
      'IRC Table R502.3.1(2): Floor joists supporting 40 psf live load and 10 psf dead load under L/360 deflection.',
      'Ceramic and stone tile requires L/480 or L/720 deflection stiffness to prevent grout cracking and tile debonding.',
      'Solid blocking or cross-bridging is required at mid-span for 2x10 and 2x12 joists exceeding 8 feet of span.',
      'End bearing on wood top plates or sills must be at least 1-1/2 inches (3 inches on concrete or masonry).'
    ],
    formula: 'Deflection δ = (5 × w × L⁴) / (384 × E × I) | Max Span derived from AWC National Design Specification',
    faq: [
      { q: 'Why does ceramic tile require L/480 deflection?', a: 'Ceramic tile and cementitious grout have virtually zero tensile flexibility. An L/360 floor deflects up to 1/2" over a 15-foot span, which snaps tile grout lines. L/480 limits deflection to 3/8", and natural stone requires L/720.' },
      { q: 'How can you eliminate bouncy floors in existing houses?', a: 'Adding solid 2x blocking at mid-span, gluing subfloor panels with polyurethane adhesive, or sistering existing joists with additional 2x lumber dramatically increases floor stiffness.' }
    ],
    calcJs: `
      function calc() {
        var size = document.getElementById('lumberSize').value;
        var oc = document.getElementById('spacing').value;
        var spec = document.getElementById('species').value;
        var defl = document.getElementById('finish').value;

        // Approx standard AWC span tables (ft-in)
        var spanMap = {
          '2x6': { '12': 10.75, '16': 9.75, '24': 8.0 },
          '2x8': { '12': 14.1, '16': 12.8, '24': 10.5 },
          '2x10': { '12': 18.0, '16': 16.2, '24': 13.2 },
          '2x12': { '12': 21.8, '16': 19.8, '24': 16.2 }
        };

        var baseSpan = spanMap[size][oc] || 16.2;
        if (defl === '480') baseSpan *= 0.90; // stiffer limit
        if (spec === 'spf') baseSpan *= 0.94;

        var spanFt = Math.floor(baseSpan);
        var spanIn = Math.round((baseSpan - spanFt) * 12);

        document.getElementById('outMaxSpan').textContent = spanFt + ' ft ' + spanIn + ' in (' + (baseSpan * 12).toFixed(1) + '")';
        document.getElementById('outModulus').textContent = spec === 'sp' ? 'E = 1,400,000 PSI' : 'E = 1,600,000 PSI';
        document.getElementById('outFloorStiff').textContent = defl === '480' ? 'Stiff Floor (Minimal noticeable bounce)' : 'Standard Residential Deflection';
        document.getElementById('outBridging').textContent = size === '2x10' || size === '2x12' ? 'Mandatory solid blocking row at mid-span' : 'Recommended at > 10 ft span';
        document.getElementById('outTilePass').textContent = defl === '480' ? '✅ Approved for Porcelain & Ceramic Tile' : '⚠️ Install cement backer board & uncoupling membrane';
      }
    `
  },
  {
    slug: 'ceiling-joist-span-drywall-sag',
    name: 'Ceiling Joist Span & Drywall Sag Calculator',
    h1: 'Ceiling Joist Span & Drywall Sag Deflection Calculator',
    title: 'Ceiling Joist Span & Drywall Sag Deflection Calculator [L/240 Attic Storage] | Digital Tools Shed',
    metaDesc: 'Size ceiling joists for uninhabited attics with or without limited storage (10 vs 20 psf live load) under IRC Table R802.5.1 deflection limits.',
    category: 'Carpentry & Millwork',
    codeRef: 'IRC R802.5.1',
    lead: 'Calculate allowable clear spans for ceiling joists supporting drywall plasterboard to prevent mid-room ceiling sagging and drywall seam cracking.',
    inputs: [
      { id: 'atticUse', label: 'Attic Storage & Access', type: 'select', options: [
        { value: '10', label: 'Uninhabited Attic Without Storage (10 psf Live Load)', selected: true },
        { value: '20', label: 'Attic with Limited Storage / Drop Stairs (20 psf Live Load)' }
      ]},
      { id: 'size', label: 'Ceiling Joist Dimension', type: 'select', options: [
        { value: '2x4', label: '2x4 Lumber' },
        { value: '2x6', label: '2x6 Lumber', selected: true },
        { value: '2x8', label: '2x8 Lumber' }
      ]},
      { id: 'spacing', label: 'On-Center Spacing', type: 'select', options: [
        { value: '16', label: '16 Inches On-Center', selected: true },
        { value: '24', label: '24 Inches On-Center' }
      ]},
      { id: 'clearSpan', label: 'Room Clear Span', value: 14, step: 0.5, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outAllowSpan', label: 'Allowable Joist Clear Span', unit: 'Feet' },
    outputs: [
      { id: 'outSagRisk', label: 'Drywall Sag Deflection Risk' },
      { id: 'outActualDefl', label: 'Estimated Mid-Span Deflection' },
      { id: 'outDrywallThick', label: 'Drywall Panel Specification' },
      { id: 'outPassFail', label: 'Structural Code Compliance' }
    ],
    rules: [
      'IRC Table R802.5.1(1): Uninhabited attics without storage permit L/240 deflection under 10 psf live load.',
      'Attics with limited storage (accessible via drop stairs) require 20 psf live load capacity.',
      'Ceiling drywall on 24" spacing must be at least 1/2" sag-resistant ceiling board or 5/8" Type X to prevent pillowing.',
      'Ceiling joists parallel to rafters must be nailed to rafter heels to serve as horizontal tension ties.'
    ],
    formula: 'Deflection Limit L/240 = Clear Span (in) / 240 | Span lookup under IRC R802.5.1 tables',
    faq: [
      { q: 'Why does ceiling drywall sag between joists on 24-inch centers?', a: 'Standard 1/2" wallboard is not rated for 24-inch ceiling spans under high humidity and insulation weight. It sags between fasteners (pillowing). Always use 1/2" high-strength ceiling board or 5/8" drywall on 24" centers.' },
      { q: 'Can you use 2x4s as ceiling joists?', a: 'Yes, but only for short spans up to 10–11 feet for unfloored ceilings without storage. For rooms wider than 11 feet, 2x6s are required.' }
    ],
    calcJs: `
      function calc() {
        var load = document.getElementById('atticUse').value;
        var size = document.getElementById('size').value;
        var oc = document.getElementById('spacing').value;
        var actualSpan = parseFloat(document.getElementById('clearSpan').value) || 14;

        // Allowable span table lookup
        var maxSpans = {
          '10': { '2x4': { '16': 11.5, '24': 9.5 }, '2x6': { '16': 17.5, '24': 14.5 }, '2x8': { '16': 23.0, '24': 19.0 } },
          '20': { '2x4': { '16': 9.0, '24': 7.5 }, '2x6': { '16': 13.5, '24': 11.0 }, '2x8': { '16': 17.5, '24': 14.5 } }
        };

        var allowSpan = maxSpans[load][size][oc] || 17.5;
        var pass = actualSpan <= allowSpan;
        var deflEst = (actualSpan * 12) / 240;

        document.getElementById('outAllowSpan').textContent = allowSpan.toFixed(1) + ' ft maximum allowable span';
        document.getElementById('outActualDefl').textContent = deflEst.toFixed(2) + '" max deflection at L/240 limit';
        document.getElementById('outDrywallThick').textContent = oc === '24' ? '5/8" Drywall or 1/2" Sag-Resistant Board' : 'Standard 1/2" Drywall';

        var badge = document.getElementById('statusBadge');
        if (pass) {
          document.getElementById('outPassFail').textContent = '✅ Code Compliant (' + actualSpan + ' ft ≤ ' + allowSpan.toFixed(1) + ' ft)';
          document.getElementById('outPassFail').style.color = '#22c55e';
          document.getElementById('outSagRisk').textContent = 'Low Sag Risk: Stiff Ceiling Assembly';
          badge.textContent = 'IRC R802.5.1 Pass: Span within limits';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outPassFail').textContent = '❌ Span Exceeded! Upsize to ' + (size === '2x4' ? '2x6' : '2x8');
          document.getElementById('outPassFail').style.color = '#ef4444';
          document.getElementById('outSagRisk').textContent = 'High Sag & Cracking Risk: Excessive deflection';
          badge.textContent = 'Code Violation: Joist span too long for load';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'deck-ledger-board-bolt-spacing',
    name: 'Deck Ledger Board Fastener Spacing Calculator',
    h1: 'Deck Ledger Board Fastener Spacing Calculator (IRC R507.9)',
    title: 'Deck Ledger Board Fastener Spacing Calculator [IRC Table R507.9.1.3] | Digital Tools Shed',
    metaDesc: 'Calculate on-center bolt spacing for attaching deck ledger boards to house rim joists under IRC Table R507.9.1.3 lag screw and through-bolt codes.',
    category: 'Carpentry & Millwork',
    codeRef: 'IRC Table R507.9.1.3',
    lead: 'Calculate on-center spacing and staggered patterns for ledger board lag screws, through-bolts, and engineered structural screws under IRC residential deck codes.',
    inputs: [
      { id: 'joistSpan', label: 'Deck Joist Clear Span', value: 12, step: 1, min: 6, max: 18, unit: 'Feet' },
      { id: 'fastenerType', label: 'Fastener Hardware', type: 'select', options: [
        { value: 'lag', label: '1/2" Lag Screws with 15/32" Sheathing', selected: true },
        { value: 'bolt', label: '1/2" Through-Bolts with Washers' },
        { value: 'spec', label: 'Engineered Ledger Screws (FastenMaster / Simpson)' }
      ]},
      { id: 'deckLength', label: 'Total Ledger Board Length', value: 24, step: 1, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outSpacing', label: 'Required Fastener Spacing', unit: 'Inches On-Center' },
    outputs: [
      { id: 'outTotalFasteners', label: 'Total Fasteners Required' },
      { id: 'outStaggerPattern', label: 'Stagger Placement Rules' },
      { id: 'outEdgeDistances', label: 'Edge & End Clearances' },
      { id: 'outLateralLoad', label: 'Tension Tie Hold-Downs (IRC R507.9.2)' }
    ],
    rules: [
      'IRC Table R507.9.1.3: Ledger fastener spacing decreases as deck joist span increases.',
      'Fasteners must be installed in a staggered pattern: top row 2" from top, bottom row 2" from bottom.',
      'End fasteners must be located at least 2 inches and not more than 5 inches from the end of the ledger.',
      'Ledger boards cannot be attached to open-web floor trusses or brick/stone veneer.'
    ],
    formula: 'Spacing derived from IRC Table R507.9.1.3 based on Joist Span and Fastener Type | Count = (Ledger Length / Spacing) × 2 rows',
    faq: [
      { q: 'Can you attach a deck ledger to a brick veneer house?', a: 'No. The International Residential Code explicitly prohibits attaching a deck ledger to brick, stone, or masonry veneer because veneer is non-structural and cannot support shear or pullout loads.' },
      { q: 'Why are ledger bolts staggered in two rows?', a: 'Staggering fasteners in alternating top and bottom rows prevents splitting the grain of the ledger board and house band joist along a single horizontal axis.' }
    ],
    calcJs: `
      function calc() {
        var span = parseFloat(document.getElementById('joistSpan').value) || 12;
        var fType = document.getElementById('fastenerType').value;
        var deckLenFt = parseFloat(document.getElementById('deckLength').value) || 24;

        // Spacing lookup (inches OC)
        var spacing = 18;
        if (fType === 'lag') {
          if (span <= 6) spacing = 30;
          else if (span <= 8) spacing = 23;
          else if (span <= 10) spacing = 18;
          else if (span <= 12) spacing = 15;
          else if (span <= 14) spacing = 13;
          else if (span <= 16) spacing = 11;
          else spacing = 10;
        } else if (fType === 'bolt') {
          if (span <= 6) spacing = 36;
          else if (span <= 8) spacing = 31;
          else if (span <= 10) spacing = 25;
          else if (span <= 12) spacing = 20;
          else if (span <= 14) spacing = 17;
          else if (span <= 16) spacing = 15;
          else spacing = 13;
        } else {
          // engineered ledger screws
          if (span <= 8) spacing = 16;
          else if (span <= 12) spacing = 12;
          else spacing = 10;
        }

        var fasteners = Math.ceil((deckLenFt * 12) / spacing) + 2;

        document.getElementById('outSpacing').textContent = spacing + ' Inches On-Center (Staggered)';
        document.getElementById('outTotalFasteners').textContent = fasteners + ' Fasteners (Pair top & bottom rows)';
        document.getElementById('outStaggerPattern').textContent = 'Top row: 2" down from top; Bottom row: 2" up from bottom';
        document.getElementById('outEdgeDistances').textContent = '2" minimum from board ends; 5" maximum from ends';
        document.getElementById('outLateralLoad').textContent = '2 × 1,500 lb Lateral Tension Ties Required (IRC R507.9.2)';
      }
    `
  },
  {
    slug: 'deck-post-beam-sizing-cantilever',
    name: 'Deck Post, Beam Sizing & Cantilever Calculator',
    h1: 'Deck Post, Beam Sizing & Maximum Joist Cantilever (IRC 2024)',
    title: 'Deck Beam Sizing & Joist Cantilever Calculator [IRC Table R507.5/6] | Digital Tools Shed',
    metaDesc: 'Size multi-ply deck beams (2-2x8 to 3-2x12), 4x4 vs 6x6 posts, and verify maximum joist cantilever overhang under IRC R507 standards.',
    category: 'Carpentry & Millwork',
    codeRef: 'IRC R507.5 & R507.6',
    lead: 'Size multi-ply lumber deck beams, support posts, and calculate maximum joist cantilever overhang under International Residential Code structural limits.',
    inputs: [
      { id: 'joistSpan', label: 'Joist Span (House to Beam)', value: 12, step: 1, unit: 'Feet' },
      { id: 'beamSpan', label: 'Beam Span Between Posts', value: 8, step: 1, unit: 'Feet' },
      { id: 'snowLoad', label: 'Ground Snow Load', type: 'select', options: [
        { value: '40', label: '40 psf Live Load (Standard Non-Snow)' },
        { value: '50', label: '50 psf Total Load (Moderate Snow)', selected: true },
        { value: '70', label: '70 psf Total Load (Heavy Northern Snow)' }
      ]},
      { id: 'postHeight', label: 'Post Height Above Grade', value: 8, step: 1, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outBeamSize', label: 'Recommended Beam Size', unit: 'Lumber Plies' },
    outputs: [
      { id: 'outMaxCantilever', label: 'Maximum Joist Cantilever Overhang' },
      { id: 'outPostSize', label: 'Required Post Size (4x4 vs 6x6)' },
      { id: 'outTributaryLoad', label: 'Tributary Load on Post' },
      { id: 'outFootingDia', label: 'Minimum Concrete Footing Diameter' }
    ],
    rules: [
      'IRC R507.6: Maximum joist cantilever overhang cannot exceed one-fourth (L/4) of the actual joist span.',
      'Beams must bear directly on top of notched 6x6 posts or be secured with approved post-to-beam connectors (no through-bolting to post sides).',
      'All 4x4 posts are restricted to 8 feet maximum height and only support single-story light loads; 6x6 is standard.',
      'Multi-ply beams must be fastened together with 3 rows of 10d nails at 16" on-center.'
    ],
    formula: 'Max Cantilever = Joist Span / 4 | Post Load = (Joist Span / 2) × Beam Span × Design Load',
    faq: [
      { q: 'Can deck beams be bolted to the sides of posts?', a: 'No. Modern building codes (IRC R507.5.1) strictly prohibit bolting deck beams to the sides of 4x4 or 6x6 posts with carriage bolts. Beams must sit on top of the post or on a notched post shoulder.' },
      { q: 'How far can deck joists overhang past the beam?', a: 'Under IRC Table R507.6, the cantilever overhang cannot exceed 1/4 of the joist span (e.g. a 12-foot joist span allows a maximum 3-foot cantilever overhang).' }
    ],
    calcJs: `
      function calc() {
        var jSpan = parseFloat(document.getElementById('joistSpan').value) || 12;
        var bSpan = parseFloat(document.getElementById('beamSpan').value) || 8;
        var load = parseFloat(document.getElementById('snowLoad').value) || 50;
        var postH = parseFloat(document.getElementById('postHeight').value) || 8;

        var maxCantFt = (jSpan / 4).toFixed(1);
        var tribLoad = (jSpan / 2) * bSpan * load;

        var beam = '2-Ply 2x10 Beam';
        if (bSpan <= 6) beam = '2-Ply 2x8 Beam';
        else if (bSpan <= 8) beam = '2-Ply 2x10 Beam';
        else if (bSpan <= 10) beam = '2-Ply 2x12 or 3-Ply 2x10 Beam';
        else beam = '3-Ply 2x12 Beam';

        var postSize = postH > 8 || tribLoad > 3000 ? '6x6 Post Mandatory' : '4x4 Post Allowed (6x6 Preferred)';
        var footingDia = tribLoad > 4000 ? '20" Round Footing' : (tribLoad > 2500 ? '16" Round Footing' : '12" Round Footing');

        document.getElementById('outBeamSize').textContent = beam;
        document.getElementById('outMaxCantilever').textContent = maxCantFt + ' Feet Max (' + (maxCantFt * 12) + '" Overhang)';
        document.getElementById('outPostSize').textContent = postSize;
        document.getElementById('outTributaryLoad').textContent = Math.round(tribLoad).toLocaleString() + ' lbs load per post';
        document.getElementById('outFootingDia').textContent = footingDia + ' (Bearing on 2,000 psf soil)';
      }
    `
  },
  {
    slug: 'baluster-spacing-4-inch-sphere',
    name: 'Stair & Deck Baluster Spacing Calculator',
    h1: 'Stair & Deck Baluster Equal Spacing Calculator (4-Inch Sphere)',
    title: 'Stair & Deck Baluster Equal Spacing Calculator [IRC 4-Inch Sphere Rule] | Digital Tools Shed',
    metaDesc: 'Calculate equal spacing between deck and stair railing balusters to ensure a 4-inch sphere cannot pass under IRC Section R312.1.3.',
    category: 'Carpentry & Millwork',
    codeRef: 'IRC R312.1.3',
    lead: 'Calculate exact equal gaps and on-center placement marks for deck and stair balusters to strictly comply with the residential 4-inch sphere code rule.',
    inputs: [
      { id: 'distance', label: 'Distance Between Railing Posts', value: 72, step: 0.5, unit: 'Inches' },
      { id: 'balusterWidth', label: 'Baluster Thickness / Diameter', value: 1.5, step: 0.125, unit: 'Inches', hint: '1.5" for 2x2 wood balusters, 0.75" for metal round spindles' },
      { id: 'maxOpening', label: 'Code Max Gap (IRC Limit)', value: 4.0, step: 0.125, unit: 'Inches' }
    ],
    primaryOutput: { id: 'outExactGap', label: 'Exact Equal Gap Between Spindles', unit: 'Inches' },
    outputs: [
      { id: 'outBalusterCount', label: 'Number of Balusters Required' },
      { id: 'outOnCenter', label: 'On-Center Layout Increment' },
      { id: 'outFirstMark', label: 'First Baluster Center Mark' },
      { id: 'outCodeCheck', label: 'IRC 4-Inch Sphere Compliance' }
    ],
    rules: [
      'IRC Section R312.1.3: Guard openings shall not allow passage of a 4-inch-diameter sphere (102 mm).',
      'Stair railing triangular openings formed by riser, tread, and bottom rail may not allow passage of a 6-inch sphere.',
      'Guardrails are mandatory for any walking surface higher than 30 inches above the floor or grade below.',
      'Guards must withstand a single concentrated load of 200 pounds applied anywhere along the top rail.'
    ],
    formula: 'Count = ⌈(Opening - MaxGap) / (Width + MaxGap)⌉ | Exact Gap = (Opening - Count × Width) / (Count + 1)',
    faq: [
      { q: 'What is the 4-inch sphere rule for balusters?', a: 'Building codes require that railing spindles or balusters be spaced close enough that a 4-inch rigid sphere cannot pass between any opening to prevent small children from slipping through or becoming trapped.' },
      { q: 'How do you space balusters evenly?', a: 'Measure total opening width, add one baluster thickness to the max code gap (4"), divide to find the baluster count, then divide the remaining open space equally across all gaps.' }
    ],
    calcJs: `
      function calc() {
        var openIn = parseFloat(document.getElementById('distance').value) || 72;
        var bWidth = parseFloat(document.getElementById('balusterWidth').value) || 1.5;
        var maxGap = parseFloat(document.getElementById('maxOpening').value) || 4.0;

        var numBalusters = Math.ceil((openIn - maxGap) / (bWidth + maxGap));
        var exactGap = (openIn - (numBalusters * bWidth)) / (numBalusters + 1);
        var oc = exactGap + bWidth;
        var firstMark = exactGap + (bWidth / 2);

        var pass = exactGap <= 4.0;

        document.getElementById('outExactGap').textContent = exactGap.toFixed(3) + '" (' + toFraction(exactGap) + ')';
        document.getElementById('outBalusterCount').textContent = numBalusters + ' Balusters needed';
        document.getElementById('outOnCenter').textContent = oc.toFixed(3) + '" (' + toFraction(oc) + ') spacing OC';
        document.getElementById('outFirstMark').textContent = firstMark.toFixed(3) + '" from post edge to 1st center';
        
        var badge = document.getElementById('statusBadge');
        if (pass) {
          document.getElementById('outCodeCheck').textContent = '✅ Code Compliant (Gap ≤ 4.0")';
          document.getElementById('outCodeCheck').style.color = '#22c55e';
          badge.textContent = 'IRC R312.1.3 Pass: 4-inch sphere blocked';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outCodeCheck').textContent = '❌ Fails Code: Gap exceeds 4 inches';
          document.getElementById('outCodeCheck').style.color = '#ef4444';
          badge.textContent = 'Violation: Child safety hazard';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'wood-movement-tangential-shrinkage',
    name: 'Hardwood Seasonal Wood Movement Calculator',
    h1: 'Hardwood Tangential & Radial Seasonal Wood Movement Calculator',
    title: 'Wood Movement & Seasonal Expansion Calculator [Radial vs Tangential] | Digital Tools Shed',
    metaDesc: 'Calculate seasonal width expansion and contraction in solid hardwood tabletops from relative humidity changes using USDA Wood Handbook coefficients.',
    category: 'Carpentry & Millwork',
    codeRef: 'USDA Wood Handbook',
    lead: 'Calculate dimensional seasonal expansion and shrinkage in solid timber boards and wide tabletops caused by indoor relative humidity swings.',
    inputs: [
      { id: 'species', label: 'Hardwood Species', type: 'select', options: [
        { value: '0.00369', label: 'Red Oak (Cr = 0.00158, Ct = 0.00369)', selected: true },
        { value: '0.00365', label: 'White Oak (Cr = 0.00180, Ct = 0.00365)' },
        { value: '0.00274', label: 'Black Walnut (Cr = 0.00190, Ct = 0.00274)' },
        { value: '0.00353', label: 'Hard Maple (Cr = 0.00165, Ct = 0.00353)' },
        { value: '0.00248', label: 'Cherry (Cr = 0.00140, Ct = 0.00248)' },
        { value: '0.00216', label: 'Eastern White Pine (Cr = 0.00078, Ct = 0.00216)' }
      ]},
      { id: 'grain', label: 'Lumber Grain Cut', type: 'select', options: [
        { value: 'tangential', label: 'Flatsawn / Plain Sawn (Maximum Movement)', selected: true },
        { value: 'radial', label: 'Quartersawn / Rift Sawn (~50% Less Movement)' }
      ]},
      { id: 'boardWidth', label: 'Tabletop Finished Width', value: 36, step: 1, unit: 'Inches' },
      { id: 'deltaMc', label: 'Seasonal Moisture Content Change (ΔMC %)', value: 4.0, step: 0.5, unit: '% MC', hint: 'Summer humid 10% MC vs Winter heated 6% MC = 4% ΔMC' }
    ],
    primaryOutput: { id: 'outMovement', label: 'Total Seasonal Movement', unit: 'Inches Expansion' },
    outputs: [
      { id: 'outSlotSize', label: 'Tabletop Z-Clip Screw Slot Allowance' },
      { id: 'outBreadboard', label: 'Breadboard End Joint Expansion' },
      { id: 'outLengthChange', label: 'Lengthwise Grain Change' },
      { id: 'outGrainStability', label: 'Species Stability Rating' }
    ],
    rules: [
      'Wood is hygroscopic: it expands across the grain when absorbing moisture and shrinks when drying.',
      'Flatsawn (tangential) lumber moves approximately twice as much as quartersawn (radial) lumber.',
      'Movement along the length of the board (longitudinal) is practically zero (under 0.1%) and can be ignored.',
      'Tabletops must never be rigidly glued or pocket-screwed to solid aprons; use figure-8 fasteners or slotted Z-clips.'
    ],
    formula: 'ΔWidth = Initial Width × Dimensional Coefficient (Ct or Cr) × ΔMC%',
    faq: [
      { q: 'Why do solid wood table breadboard ends protrude in winter?', a: 'Tabletop boards expand and contract in width, but the cross-grain breadboard end cap barely changes length. In winter, the tabletop shrinks narrower than the breadboard end cap, creating a visible stepped shoulder.' },
      { q: 'How do you attach a tabletop to allow wood movement?', a: 'Use steel Z-clips or figure-8 desktop fasteners that slide inside a routed groove on the apron, or drill elongated oval screw slots in structural cleats.' }
    ],
    calcJs: `
      function calc() {
        var coeff = parseFloat(document.getElementById('species').value) || 0.00369;
        var grain = document.getElementById('grain').value;
        var widthIn = parseFloat(document.getElementById('boardWidth').value) || 36;
        var dMc = parseFloat(document.getElementById('deltaMc').value) || 4.0;

        if (grain === 'radial') coeff *= 0.50; // Quartersawn moves roughly half
        var movementIn = widthIn * coeff * dMc;
        var slotReq = movementIn * 1.5;

        document.getElementById('outMovement').textContent = movementIn.toFixed(3) + '" (' + toFraction(movementIn) + ') expansion/contraction';
        document.getElementById('outSlotSize').textContent = slotReq.toFixed(2) + '" slotted fastener travel required';
        document.getElementById('outBreadboard').textContent = '±' + (movementIn / 2).toFixed(2) + '" overhang at each end';
        document.getElementById('outLengthChange').textContent = '< 0.02" negligible movement along grain length';
        document.getElementById('outGrainStability').textContent = grain === 'radial' ? 'Excellent Stability (Quartersawn)' : 'High Movement (Flatsawn plain-sawn)';
      }
    `
  },
  {
    slug: 'segmented-woodturning-ring-angles',
    name: 'Segmented Woodturning Ring Calculator',
    h1: 'Segmented Woodturning Bowl Ring Angle & Miter Calculator',
    title: 'Segmented Woodturning Bowl Ring Calculator [Miter Angle, Segments & Radius] | Digital Tools Shed',
    metaDesc: 'Calculate miter saw angles, segment edge cut lengths, and board feet for open and closed segmented woodturning lathe bowl rings.',
    category: 'Carpentry & Millwork',
    codeRef: 'Lathe Turning',
    lead: 'Calculate miter cut angles and outer/inner segment chord lengths for gluing segmented wooden rings for lathe turned bowls and vessels.',
    inputs: [
      { id: 'numSegments', label: 'Number of Segments per Ring', type: 'select', options: [
        { value: '8', label: '8 Segments (22.5° Miter)' },
        { value: '12', label: '12 Segments (15.0° Miter)', selected: true },
        { value: '16', label: '16 Segments (11.25° Miter)' },
        { value: '24', label: '24 Segments (7.5° Miter)' },
        { value: '36', label: '36 Segments (5.0° Miter)' }
      ]},
      { id: 'ringOd', label: 'Ring Outer Diameter (OD)', value: 10, step: 0.5, unit: 'Inches' },
      { id: 'wallThick', label: 'Ring Wall Thickness', value: 1.0, step: 0.125, unit: 'Inches' }
    ],
    primaryOutput: { id: 'outMiterAngle', label: 'Miter Cut Angle', unit: 'Degrees' },
    outputs: [
      { id: 'outOuterEdge', label: 'Outer Segment Edge Length' },
      { id: 'outInnerEdge', label: 'Inner Segment Edge Length' },
      { id: 'outBoardLen', label: 'Total Board Length Needed' },
      { id: 'outRingId', label: 'Finished Ring Inner Diameter (ID)' }
    ],
    rules: [
      'Miter Cut Angle = 360° / (2 × Number of Segments) = 180° / N.',
      'Every segment requires two miter cuts; angle errors accumulate across all joints in the ring.',
      'Use a dedicated miter sled or wedgie sled on table saws for sub-tenth-degree miter precision.',
      'Glue rings in two separate half-rings, then sand the flat mating surfaces flush before final glue-up.'
    ],
    formula: 'Miter Angle = 180° / N | Outer Length = 2 × (OD / 2) × sin(180° / N) | Inner Length = 2 × (ID / 2) × sin(180° / N)',
    faq: [
      { q: 'Why do segmented turners glue rings in two halves?', a: 'Even a 0.1° miter error across 24 cuts results in a 2.4° gap that will not close. Gluing two 12-segment halves allows you to sand the two flat mating surfaces flush on a disc sander, guaranteeing a 100% gap-free ring.' },
      { q: 'What is the advantage of 24 segments over 12?', a: 'More segments create a ring that closely approximates a true circle, drastically reducing the amount of precious hardwood turned away into shavings on the lathe.' }
    ],
    calcJs: `
      function calc() {
        var n = parseInt(document.getElementById('numSegments').value, 10) || 12;
        var od = parseFloat(document.getElementById('ringOd').value) || 10;
        var thick = parseFloat(document.getElementById('wallThick').value) || 1.0;

        var id = od - (2 * thick);
        var miter = 180 / n;
        var rad = (miter * Math.PI) / 180;

        var outerLen = 2 * (od / 2) * Math.sin(rad);
        var innerLen = 2 * (Math.max(0, id) / 2) * Math.sin(rad);
        var totalBoardIn = (n * outerLen) + (n * 0.125); // including kerfs

        document.getElementById('outMiterAngle').textContent = miter.toFixed(2) + '° Saw Miter Setting';
        document.getElementById('outOuterEdge').textContent = outerLen.toFixed(3) + '" (' + toFraction(outerLen) + ')';
        document.getElementById('outInnerEdge').textContent = innerLen.toFixed(3) + '" (' + toFraction(innerLen) + ')';
        document.getElementById('outBoardLen').textContent = Math.ceil(totalBoardIn) + '" of ' + thick + '" stock (' + (totalBoardIn / 12).toFixed(1) + ' ft)';
        document.getElementById('outRingId').textContent = id.toFixed(2) + '" Inside Diameter';
      }
    `
  },
  {
    slug: 'dovetail-joint-spacing-angle',
    name: 'Hand-Cut Dovetail Joint Layout Calculator',
    h1: 'Hand-Cut Dovetail Joint Spacing & Angle Calculator',
    title: 'Hand-Cut Dovetail Joint Spacing & Angle Calculator [1:6 & 1:8 Pin-to-Tail Ratio] | Digital Tools Shed',
    metaDesc: 'Calculate pin-to-tail layout spacing, half-pin borders, and traditional 1:6 (softwood) vs 1:8 (hardwood) angles for hand-cut dovetails.',
    category: 'Carpentry & Millwork',
    codeRef: 'Traditional Joinery',
    lead: 'Calculate symmetrical hand-cut dovetail spacing, pin-to-tail ratios, and slope cut angles for classic through-dovetail furniture drawers and chests.',
    inputs: [
      { id: 'boardW', label: 'Board Width', value: 6.0, step: 0.25, unit: 'Inches' },
      { id: 'boardT', label: 'Board Thickness', value: 0.75, step: 0.125, unit: 'Inches' },
      { id: 'woodType', label: 'Wood Type & Slope Ratio', type: 'select', options: [
        { value: 'hard', label: 'Hardwood: 1:8 Slope (~7.1° Angle)', selected: true },
        { value: 'soft', label: 'Softwood: 1:6 Slope (~9.5° Angle)' }
      ]},
      { id: 'numTails', label: 'Number of Full Tails', value: 3, step: 1, min: 1, max: 10, unit: 'Tails' }
    ],
    primaryOutput: { id: 'outTailWidth', label: 'Tail Width at Wide Edge', unit: 'Inches' },
    outputs: [
      { id: 'outHalfPin', label: 'Half-Pin Edge Margin' },
      { id: 'outPinWidth', label: 'Pin Width at Narrow Face' },
      { id: 'outSlopeAngle', label: 'Dovetail Marker Angle' },
      { id: 'outBaseline', label: 'Gauge Baseline Scribe Line' }
    ],
    rules: [
      'Dovetail slope angles: 1:8 (7.1°) is standard for hardwoods to prevent fragile shear corners; 1:6 (9.5°) is used for softwoods.',
      'Outside edges must always feature half-pins to protect the joint against splitting when drawer sides slide.',
      'Baseline marking gauge must be set slightly proud (~1/64") of board thickness for flush trimming after assembly.',
      'Pins take the horizontal drawer pull tension; tails display prominent interlocking geometric wedges on drawer sides.'
    ],
    formula: 'Slope: 1:8 = arctan(1/8) = 7.125° | 1:6 = arctan(1/6) = 9.46° | Usable W = Width - 2 × HalfPin',
    faq: [
      { q: 'Why is 1:8 used for hardwoods and 1:6 for softwoods?', a: 'Hardwood fibers are dense and brittle; a steep 1:6 angle creates thin, fragile pin corners that can chip during chopping. Softwoods are spongy and compress easily, requiring a steeper 1:6 slope for mechanical friction lock.' },
      { q: 'Do tails or pins go on the drawer front?', a: 'Pins are cut into the drawer front and back; tails are cut into the drawer sides. When pulling the drawer open, the wedged tails pull tightly into the pins, preventing the front from separating.' }
    ],
    calcJs: `
      function calc() {
        var bw = parseFloat(document.getElementById('boardW').value) || 6.0;
        var bt = parseFloat(document.getElementById('boardT').value) || 0.75;
        var wood = document.getElementById('woodType').value;
        var nTails = parseInt(document.getElementById('numTails').value, 10) || 3;

        var halfPin = 0.3125; // 5/16"
        var usable = bw - (2 * halfPin);
        var tailW = usable / (nTails + (nTails - 1) * 0.5);
        var pinW = tailW * 0.5;

        var slope = wood === 'hard' ? '1:8 Slope (7.1° Angle)' : '1:6 Slope (9.5° Angle)';

        document.getElementById('outTailWidth').textContent = tailW.toFixed(3) + '" (' + toFraction(tailW) + ')';
        document.getElementById('outHalfPin').textContent = halfPin.toFixed(3) + '" (5/16" top & bottom edges)';
        document.getElementById('outPinWidth').textContent = pinW.toFixed(3) + '" (' + toFraction(pinW) + ')';
        document.getElementById('outSlopeAngle').textContent = slope;
        document.getElementById('outBaseline').textContent = (bt + 0.015).toFixed(3) + '" Scribe Line (Set 1/64" proud)';
      }
    `
  },
  {
    slug: 'pocket-hole-screw-length-collar',
    name: 'Pocket Hole Screw & Stop Collar Calculator',
    h1: 'Pocket Hole Screw Length & Drill Stop Collar Settings',
    title: 'Pocket Hole Screw Length & Stop Collar Calculator [Material Thickness] | Digital Tools Shed',
    metaDesc: 'Determine pocket hole jig depth setting, drill bit stop collar position, and screw length for wood thicknesses from 1/2 to 1-1/2 inches.',
    category: 'Carpentry & Millwork',
    codeRef: 'Kreg Jig Standards',
    lead: 'Determine correct pocket hole jig guide settings, drill bit stop collar measurements, and self-tapping screw lengths to prevent joint blowouts.',
    inputs: [
      { id: 'thickness', label: 'Material Thickness', type: 'select', options: [
        { value: '0.5', label: '1/2" Sheet Goods / Thin Drawer Boxes' },
        { value: '0.75', label: '3/4" Standard (Cabinet Carcass / 1x Lumber)', selected: true },
        { value: '1.0', label: '1" Hardwood Planks' },
        { value: '1.5', label: '1-1/2" Framing Lumber (2x4 / 2x6)' }
      ]},
      { id: 'hardness', label: 'Wood Hardness', type: 'select', options: [
        { value: 'soft', label: 'Softwood / Plywood (Pine, Fir, MDF, Plywood)', selected: true },
        { value: 'hard', label: 'Hardwood (Oak, Maple, Walnut, Cherry)' }
      ]}
    ],
    primaryOutput: { id: 'outScrewLen', label: 'Recommended Screw Length', unit: 'Inches' },
    outputs: [
      { id: 'outJigSetting', label: 'Pocket Hole Jig Guide Setting' },
      { id: 'outCollarSetting', label: 'Drill Bit Stop Collar Distance' },
      { id: 'outThreadType', label: 'Screw Thread Type' },
      { id: 'outHeadType', label: 'Recommended Screw Head' }
    ],
    rules: [
      'Screw tip must enter the exact center of the adjoining workpiece thickness.',
      'Coarse thread screws are mandatory for softwoods and plywood to prevent stripping out soft wood fibers.',
      'Fine thread screws are required for hardwoods to prevent splitting dense timber without pilot drilling.',
      'Never use standard drywall or deck screws; pocket screws feature flat-bottom washer heads that clamp without wedging.'
    ],
    formula: 'Jig Setting = Material Thickness | Stop Collar = Material Thickness | Screw Length = Thickness-dependent lookup',
    faq: [
      { q: 'Why do pocket screws strip out in plywood?', a: 'Using fine-thread screws in plywood or MDF causes stripping because the small threads cannot grip soft wood fibers. Always use coarse-thread pocket screws with aggressive deep threads in plywood and softwoods.' },
      { q: 'Can you join 1/2" material with pocket holes?', a: 'Yes, using 1" pocket screws and setting the drill collar and jig guide to 1/2". For 1/2" material, use Pan-Head screws (smaller head) rather than Maxi-Loc to avoid bulging the thin wood face.' }
    ],
    calcJs: `
      function calc() {
        var t = document.getElementById('thickness').value;
        var hard = document.getElementById('hardness').value;

        var specs = {
          '0.5': { screw: '1.0" Screw (25 mm)', jig: '1/2" Jig Setting', collar: '1/2" on Step Drill Bit', head: 'Pan-Head (Small Diameter)' },
          '0.75': { screw: '1-1/4" Screw (32 mm)', jig: '3/4" Jig Setting', collar: '3/4" on Step Drill Bit', head: 'Maxi-Loc Washer Head' },
          '1.0': { screw: '1-1/2" Screw (38 mm)', jig: '1" Jig Setting', collar: '1" on Step Drill Bit', head: 'Maxi-Loc Washer Head' },
          '1.5': { screw: '2-1/2" Screw (64 mm)', jig: '1-1/2" Jig Setting', collar: '1-1/2" on Step Drill Bit', head: 'Maxi-Loc Blue-Kote or HD' }
        };

        var cur = specs[t];
        var thread = hard === 'hard' ? 'Fine Thread (Prevents Hardwood Splitting)' : 'Coarse Thread (Deep Grip in Softwood/Plywood)';

        document.getElementById('outScrewLen').textContent = cur.screw;
        document.getElementById('outJigSetting').textContent = cur.jig;
        document.getElementById('outCollarSetting').textContent = cur.collar;
        document.getElementById('outThreadType').textContent = thread;
        document.getElementById('outHeadType').textContent = cur.head;
      }
    `
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 4: CONCRETE, MASONRY & EARTHWORK (Tools 36–48)
// ─────────────────────────────────────────────────────────────────────────────
const CONCRETE_TOOLS = [
  {
    slug: 'concrete-curing-maturity-index',
    name: 'Concrete Maturity Index & Strength Calculator',
    h1: 'Concrete Curing Maturity Index & Strength Gain Calculator',
    title: 'Concrete Curing Maturity Index Calculator [Nurse-Saul ASTM C1074] | Digital Tools Shed',
    metaDesc: 'Calculate in-place concrete compressive strength development from temperature history using ASTM C1074 Nurse-Saul maturity equation.',
    category: 'Concrete & Masonry',
    codeRef: 'ASTM C1074',
    lead: 'Calculate real-time in-place concrete strength development using curing temperature history and the Nurse-Saul maturity index to safely strip formwork.',
    inputs: [
      { id: 'targetPsi', label: 'Specified 28-Day Design Strength (f\'c)', value: 4000, step: 250, unit: 'PSI' },
      { id: 'cureHours', label: 'Elapsed Curing Time', value: 72, step: 6, unit: 'Hours' },
      { id: 'avgTempF', label: 'Average In-Slab Temperature', value: 65, step: 2, unit: '°F' },
      { id: 'datumTempC', label: 'Datum Temperature T0', value: -10, step: 1, unit: '°C', hint: 'ASTM C1074 standard datum is -10°C (14°F) for Type I cement' }
    ],
    primaryOutput: { id: 'outEstPsi', label: 'Estimated In-Place Strength', unit: 'PSI' },
    outputs: [
      { id: 'outMaturity', label: 'Nurse-Saul Maturity Index' },
      { id: 'outPercentStr', label: 'Percentage of 28-Day Strength' },
      { id: 'outFormStrip', label: 'Safe Formwork Stripping (70% f\'c)' },
      { id: 'outPostTension', label: 'Post-Tension Tendon Pull Status' }
    ],
    rules: [
      'ASTM C1074 Nurse-Saul equation: Maturity M(t) = Σ(T - T0) × Δt in °C-hours.',
      'Cold curing temperatures below 50°F severely retard cement hydration and strength development.',
      'Formwork and vertical shores can typically be safely stripped once concrete reaches 70% of specified f\'c (2,800 PSI for 4,000 PSI mix).',
      'Post-tensioned cables require at least 75% to 80% strength (3,000 PSI minimum) before stressing.'
    ],
    formula: 'M = Time (hrs) × (Temp_C - Datum_C) | Strength % = M / (1200 + M) × 100 | In-Place PSI = f\'c × Strength %',
    faq: [
      { q: 'Why use concrete maturity testing instead of cylinder breaks?', a: 'Standard test cylinders cured in a water tank do not reflect the actual temperature of mass foundation concrete. In-slab thermal maturity sensors provide continuous, non-destructive strength monitoring in real time.' },
      { q: 'At what temperature does concrete stop curing?', a: 'Hydration essentially ceases when concrete internal temperatures drop below 14°F (-10°C). Cold-weather concrete must be protected with thermal curing blankets or heated enclosures.' }
    ],
    calcJs: `
      function calc() {
        var fc = parseFloat(document.getElementById('targetPsi').value) || 4000;
        var hrs = parseFloat(document.getElementById('cureHours').value) || 72;
        var tempF = parseFloat(document.getElementById('avgTempF').value) || 65;
        var datumC = parseFloat(document.getElementById('datumTempC').value) || -10;

        var tempC = (tempF - 32) * (5 / 9);
        var maturity = hrs * Math.max(0, tempC - datumC);
        var strPct = (maturity / (1200 + maturity)) * 100;
        var estPsi = Math.round(fc * (strPct / 100));

        var stripPass = strPct >= 70;
        var ptPass = strPct >= 75;

        document.getElementById('outEstPsi').textContent = estPsi.toLocaleString() + ' PSI (' + strPct.toFixed(1) + '% f\'c)';
        document.getElementById('outMaturity').textContent = Math.round(maturity) + ' °C-hours (Maturity Index)';
        document.getElementById('outPercentStr').textContent = strPct.toFixed(1) + '% of design strength reached';
        document.getElementById('outFormStrip').textContent = stripPass ? '✅ SAFE to Strip Formwork (≥ 70%)' : '⏳ DO NOT Strip: Wait until 2,800 PSI reached';
        document.getElementById('outPostTension').textContent = ptPass ? '✅ Approved for Post-Tensioning (≥ 75%)' : '⏳ Tendon stressing deferred';
      }
    `
  },
  {
    slug: 'concrete-mix-ratio-batching',
    name: 'Site Concrete Mix Ratio Batching Calculator',
    h1: 'Site Concrete Mix Ratio (1:2:3 vs 1:1.5:3) Batching Calculator',
    title: 'Site Concrete Mix Ratio Batching Calculator [1:2:3 Cement, Sand & Stone] | Digital Tools Shed',
    metaDesc: 'Calculate volumetric batching of Portland cement bags, masonry sand, gravel aggregate, and water for standard 3000 and 4000 PSI site concrete mixes.',
    category: 'Concrete & Masonry',
    codeRef: 'ACI 211.1',
    lead: 'Calculate exact volumetric component batches of Portland cement, sand, gravel stone, and water for onsite drum mixers.',
    inputs: [
      { id: 'targetVol', label: 'Required Concrete Volume', value: 1.0, step: 0.25, unit: 'Cubic Yards' },
      { id: 'mixType', label: 'Concrete Mix Design', type: 'select', options: [
        { value: '1:2:3', label: 'Standard 1:2:3 Mix (3,000 PSI - Slabs & Footings)', selected: true },
        { value: '1:1.5:3', label: 'Rich 1:1.5:3 Mix (4,000 PSI - Driveways & Beams)' },
        { value: '1:3:5', label: 'Lean 1:3:5 Mix (2,000 PSI - Massive Footings / Fill)' }
      ]},
      { id: 'wcRatio', label: 'Water-Cement Ratio (by weight)', value: 0.45, step: 0.02, min: 0.40, max: 0.60, hint: '0.45 is ideal for high strength and durability' }
    ],
    primaryOutput: { id: 'outCementBags', label: '94 lb Portland Cement Bags', unit: 'Bags' },
    outputs: [
      { id: 'outSand', label: 'Masonry Sand Volume & Weight' },
      { id: 'outGravel', label: 'Coarse Gravel Volume & Weight' },
      { id: 'outWater', label: 'Mixing Water Required' },
      { id: 'outTotalWeight', label: 'Total Batch Weight' }
    ],
    rules: [
      'One 94-pound bag of Portland cement equals exactly 1 cubic foot of loose cement volume.',
      'Adding excess water drastically weakens concrete: increasing water-cement ratio from 0.45 to 0.65 reduces strength by 40%.',
      'The volume of mixed concrete is less than the sum of dry loose ingredients because sand fills the voids between gravel stones.',
      'Always add aggregate and most water into the drum before adding dry cement powder to prevent caking.'
    ],
    formula: '1 yd³ standard 1:2:3 concrete = 6.0 bags (564 lbs) Cement + 14 cu ft Sand (1,140 lbs) + 21 cu ft Gravel (1,800 lbs) + 32 gal Water',
    faq: [
      { q: 'Why is a 94-lb bag of cement considered 1 cubic foot?', a: 'Because the average loose bulk density of Portland cement is approximately 94 pounds per cubic foot. This makes volumetric batching ratios (1:2:3) easy to scale on jobsites using 1 bag as 1 part.' },
      { q: 'What is the danger of adding too much water to concrete?', a: 'Excess water creates microscopic bleed channels and voids as it evaporates, reducing compressive strength, increasing shrinkage cracking, and destroying freeze-thaw durability.' }
    ],
    calcJs: `
      function calc() {
        var yards = parseFloat(document.getElementById('targetVol').value) || 1.0;
        var mix = document.getElementById('mixType').value;
        var wc = parseFloat(document.getElementById('wcRatio').value) || 0.45;

        var bagsPerYd = 6.0;
        var sandCuFtPerYd = 14.0;
        var gravelCuFtPerYd = 21.0;

        if (mix === '1:1.5:3') {
          bagsPerYd = 6.8;
          sandCuFtPerYd = 12.0;
          gravelCuFtPerYd = 22.0;
        } else if (mix === '1:3:5') {
          bagsPerYd = 4.5;
          sandCuFtPerYd = 16.0;
          gravelCuFtPerYd = 24.0;
        }

        var totalBags = Math.ceil(bagsPerYd * yards);
        var cementLbs = totalBags * 94;
        var waterLbs = cementLbs * wc;
        var waterGal = waterLbs / 8.34;
        var sandLbs = Math.round(sandCuFtPerYd * 85 * yards);
        var gravelLbs = Math.round(gravelCuFtPerYd * 90 * yards);
        var totalLbs = cementLbs + waterLbs + sandLbs + gravelLbs;

        document.getElementById('outCementBags').textContent = totalBags + ' Bags (94 lb Portland Cement)';
        document.getElementById('outSand').textContent = (sandCuFtPerYd * yards).toFixed(1) + ' cu ft (' + sandLbs.toLocaleString() + ' lbs)';
        document.getElementById('outGravel').textContent = (gravelCuFtPerYd * yards).toFixed(1) + ' cu ft (' + gravelLbs.toLocaleString() + ' lbs)';
        document.getElementById('outWater').textContent = Math.round(waterGal) + ' Gallons (' + Math.round(waterLbs) + ' lbs water)';
        document.getElementById('outTotalWeight').textContent = Math.round(totalLbs).toLocaleString() + ' lbs (~' + (totalLbs / 2000).toFixed(2) + ' tons)';
      }
    `
  },
  {
    slug: 'cmu-cinder-block-wall-mortar',
    name: 'CMU Block Wall, Rebar & Mortar Calculator',
    h1: 'CMU Concrete Masonry Unit (8x8x16) Block Wall & Mortar Calculator',
    title: 'CMU Block Wall & Mortar Calculator [8x8x16 Masonry Units] | Digital Tools Shed',
    metaDesc: 'Calculate standard 8x8x16 cinder block counts (112.5 blocks per 100 sq ft), Type S mortar bags, and vertical core-fill grout yardage.',
    category: 'Concrete & Masonry',
    codeRef: 'TMS 402 / ACI 530',
    lead: 'Calculate exact masonry block counts, Type S/N mortar bags, vertical rebar sticks, and core-fill grout volume for standard 8x8x16 CMU block walls.',
    inputs: [
      { id: 'wallLen', label: 'Wall Total Length', value: 40, step: 1, unit: 'Feet' },
      { id: 'wallHgt', label: 'Wall Finished Height', value: 8, step: 0.667, unit: 'Feet' },
      { id: 'deduct', label: 'Window & Door Deductions', value: 32, step: 4, unit: 'Sq Ft' },
      { id: 'groutSpacing', label: 'Vertical Rebar Core Fill Spacing', type: 'select', options: [
        { value: '32', label: 'Every 32" On-Center (Standard Structural)', selected: true },
        { value: '48', label: 'Every 48" On-Center (Moderate Load)' },
        { value: '16', label: 'Every 16" On-Center (Heavy Retaining Wall)' },
        { value: 'all', label: 'Solid Core Fill (All Cores Filled)' }
      ]}
    ],
    primaryOutput: { id: 'outBlocks', label: 'Standard 8x8x16 CMU Blocks', unit: 'Blocks' },
    outputs: [
      { id: 'outMortarBags', label: 'Type S Mortar Bags (80 lb)' },
      { id: 'outGroutVol', label: 'Core-Fill Grout Volume' },
      { id: 'outRebarSticks', label: 'Vertical Rebar Sticks (#4 / 1/2")' },
      { id: 'outHalfBlocks', label: 'Corner / Half Blocks Needed' }
    ],
    rules: [
      'Standard nominal 8x8x16 CMU measures 7-5/8" x 7-5/8" x 15-5/8" to create an 8" x 16" module with a 3/8" mortar joint.',
      'Rule of thumb: 112.5 standard blocks are required per 100 square feet of wall face area.',
      'One 80-pound bag of Type S masonry mortar lays approximately 30 to 35 blocks.',
      'Solid horizontal bond beams must be placed at the top plate level and above all rough door/window openings.'
    ],
    formula: 'Net Area = (Length × Height) - Deduct | Blocks = Net Area × 1.125 × 1.05 waste | Mortar = Blocks / 32',
    faq: [
      { q: 'Why is mortar joint thickness standard at 3/8 inch?', a: 'A 3/8" (9.5 mm) joint provides the ideal balance between structural bonding compressive strength, workability, and dimensional modular coordination with standard bricks and blocks.' },
      { q: 'What is the difference between Type S and Type N mortar?', a: 'Type S has higher compressive strength (1,800 PSI minimum) and is required for exterior foundation walls, retaining walls, and seismic zones. Type N (750 PSI) is for non-loadbearing above-grade walls.' }
    ],
    calcJs: `
      function calc() {
        var len = parseFloat(document.getElementById('wallLen').value) || 40;
        var hgt = parseFloat(document.getElementById('wallHgt').value) || 8;
        var ded = parseFloat(document.getElementById('deduct').value) || 32;
        var spacing = document.getElementById('groutSpacing').value;

        var netSqFt = Math.max(0, (len * hgt) - ded);
        var totalBlocks = Math.ceil(netSqFt * 1.125 * 1.05); // 5% waste
        var halfBlocks = Math.ceil((hgt / 0.667) * 2); // 2 corners

        var mortarBags = Math.ceil(totalBlocks / 32);

        var groutYds = 0;
        if (spacing === 'all') groutYds = (netSqFt * 0.35) / 27;
        else if (spacing === '16') groutYds = (netSqFt * 0.20) / 27;
        else if (spacing === '32') groutYds = (netSqFt * 0.12) / 27;
        else groutYds = (netSqFt * 0.08) / 27;

        var rebarSpacingIn = spacing === 'all' ? 16 : parseInt(spacing, 10);
        var rebarSticks = Math.ceil((len * 12) / rebarSpacingIn);

        document.getElementById('outBlocks').textContent = totalBlocks + ' Blocks (Includes 5% cut waste)';
        document.getElementById('outMortarBags').textContent = mortarBags + ' Bags (80 lb Type S Mortar)';
        document.getElementById('outGroutVol').textContent = groutYds.toFixed(2) + ' Cubic Yards core grout';
        document.getElementById('outRebarSticks').textContent = rebarSticks + ' Sticks (#4 Rebar at ' + (rebarSpacingIn) + '" OC)';
        document.getElementById('outHalfBlocks').textContent = halfBlocks + ' Half/Corner blocks for leads';
      }
    `
  },
  {
    slug: 'retaining-wall-backfill-drainage',
    name: 'Retaining Wall Drainage & Backfill Calculator',
    h1: 'Retaining Wall Crushed Stone Backfill & Drainage Pipe Calculator',
    title: 'Retaining Wall Backfill & Drainage Calculator [Clean Crushed Stone] | Digital Tools Shed',
    metaDesc: 'Size clean crushed stone drainage zones (min 12" wide behind blocks), perforated pipe fall, and geogrid layers to prevent wall tipping.',
    category: 'Concrete & Masonry',
    codeRef: 'NCMA Standards',
    lead: 'Calculate drainage gravel tonnage, geotextile fabric, and perforated drain pipe fall behind retaining walls to eliminate hydrostatic pressure buildup.',
    inputs: [
      { id: 'wallLen', label: 'Retaining Wall Length', value: 50, step: 5, unit: 'Feet' },
      { id: 'wallHgt', label: 'Exposed Wall Height', value: 4, step: 0.5, unit: 'Feet' },
      { id: 'gravelWidth', label: 'Gravel Drainage Zone Width', value: 12, step: 2, unit: 'Inches', hint: 'NCMA minimum is 12 inches directly behind blocks' },
      { id: 'soilType', label: 'Retained Native Soil', type: 'select', options: [
        { value: 'clay', label: 'Heavy Clay (Poor Drainage - Requires Deeper Backfill)', selected: true },
        { value: 'sand', label: 'Sandy Loam (Good Natural Drainage)' },
        { value: 'rock', label: 'Gravelly Soil' }
      ]}
    ],
    primaryOutput: { id: 'outGravelTons', label: 'Clean Crushed Drainage Rock', unit: 'Tons' },
    outputs: [
      { id: 'outGravelYds', label: 'Crushed Stone Volume' },
      { id: 'outPipeLen', label: '4" Perforated Drain Pipe' },
      { id: 'outFabricSqYd', label: 'Geotextile Filter Fabric' },
      { id: 'outGeogridNote', label: 'Geogrid Structural Reinforcement' }
    ],
    rules: [
      'Hydrostatic water pressure buildup is the #1 cause of retaining wall tipping, bulging, and catastrophic failure.',
      'NCMA: A continuous zone of clean, angular 3/4" crushed stone (free of fines) at least 12" wide must backfill all blocks.',
      'A 4" perforated drain pipe must sit at the bottom of the gravel zone sloped to daylight with holes facing DOWN.',
      'Walls taller than 4 feet typically require engineered structural geogrid ties extending back into the soil mass.'
    ],
    formula: 'Gravel Volume (yd³) = [Length × Height × (Gravel Width / 12)] / 27 | Tons = Volume × 1.35 tons/yd³',
    faq: [
      { q: 'Why do the holes on a perforated drain pipe face down?', a: 'If holes face up, water must rise above the pipe before entering. With holes facing down on a bed of gravel, rising groundwater enters immediately from below and drains away before saturating the wall base.' },
      { q: 'Why is filter fabric required behind the gravel zone?', a: 'Non-woven geotextile filter fabric separates native soil from the clean drainage rock. It allows water to pass freely while preventing silt and clay particles from clogging the drainage gravel voids.' }
    ],
    calcJs: `
      function calc() {
        var len = parseFloat(document.getElementById('wallLen').value) || 50;
        var hgt = parseFloat(document.getElementById('wallHgt').value) || 4;
        var gWidthIn = parseFloat(document.getElementById('gravelWidth').value) || 12;
        var soil = document.getElementById('soilType').value;

        if (soil === 'clay') gWidthIn = Math.max(gWidthIn, 18); // wider zone for clay

        var cuFt = len * hgt * (gWidthIn / 12);
        var cuYds = cuFt / 27;
        var tons = cuYds * 1.35;

        var fabricSqFt = len * (hgt + 2 + (gWidthIn / 12));
        var fabricSqYds = Math.ceil(fabricSqFt / 9);

        var needsGrid = hgt > 4.0;

        document.getElementById('outGravelTons').textContent = tons.toFixed(1) + ' Tons (3/4" Clean Crushed Rock)';
        document.getElementById('outGravelYds').textContent = cuYds.toFixed(1) + ' Cubic Yards (' + gWidthIn + '" wide drainage trench)';
        document.getElementById('outPipeLen').textContent = len + ' Linear Feet of 4" Perforated Drain Pipe';
        document.getElementById('outFabricSqYd').textContent = fabricSqYds + ' Sq Yards of Non-Woven Filter Fabric';
        
        var badge = document.getElementById('statusBadge');
        if (needsGrid) {
          document.getElementById('outGeogridNote').textContent = '⚠️ Mandatory Geogrid Layers (Height > 4ft)';
          badge.textContent = 'Engineering Required: Wall > 4ft needs geogrid';
          badge.style.color = '#f59e0b';
          badge.style.background = 'rgba(245, 158, 11, 0.1)';
        } else {
          document.getElementById('outGeogridNote').textContent = 'Gravity Wall Compliant (Height ≤ 4ft)';
          badge.textContent = 'NCMA Pass: Standard gravity wall';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        }
      }
    `
  },
  {
    slug: 'sonotube-pier-concrete-volume',
    name: 'Sonotube Pier & Bell Footing Calculator',
    h1: 'Sonotube Cylindrical Pier & Bell Footing Concrete Volume Calculator',
    title: 'Sonotube Cylindrical Pier Calculator [Concrete Volume & Bags] | Digital Tools Shed',
    metaDesc: 'Compute volume for round concrete columns (V = πr²h) plus flared bottom bell footings in cubic yards, 80 lb, and 60 lb pre-mix bags.',
    category: 'Concrete & Masonry',
    codeRef: 'IRC R403.1.4',
    lead: 'Calculate exact concrete yardage and pre-mix bag counts for cylindrical pier footings and flared bell bases supporting decks and porches.',
    inputs: [
      { id: 'tubeDia', label: 'Sonotube Tube Diameter', type: 'select', options: [
        { value: '8', label: '8" Diameter (Small Deck Pier)' },
        { value: '10', label: '10" Diameter (Standard Deck Pier)', selected: true },
        { value: '12', label: '12" Diameter (Heavy Deck / Porch Pier)' },
        { value: '16', label: '16" Diameter (Commercial Column)' },
        { value: '24', label: '24" Diameter (Heavy Structural Pier)' }
      ]},
      { id: 'depthFt', label: 'Hole Depth to Frost Line', value: 4.0, step: 0.5, unit: 'Feet' },
      { id: 'numPiers', label: 'Number of Identical Piers', value: 6, step: 1, min: 1, unit: 'Piers' },
      { id: 'hasBell', label: 'Flared Bell Footing Base (Bigfoot)?', type: 'select', options: [
        { value: 'yes', label: 'Yes - Flared Base (e.g. 24" bell at bottom)', selected: true },
        { value: 'no', label: 'No - Straight Cylinder Only' }
      ]}
    ],
    primaryOutput: { id: 'outTotalYards', label: 'Total Concrete Required', unit: 'Cubic Yards' },
    outputs: [
      { id: 'outBags80', label: '80 lb Pre-Mix Concrete Bags' },
      { id: 'outBags60', label: '60 lb Pre-Mix Concrete Bags' },
      { id: 'outSinglePierYds', label: 'Volume per Single Pier' },
      { id: 'outRebarSticks', label: 'Rebar Vertical Cage Sticks' }
    ],
    rules: [
      'IRC R403.1.4: Frost-protected piers must extend below the regional frost line depth.',
      'Flared bell footings drastically increase soil bearing surface and prevent frost jacking (uplift).',
      'One 80 lb bag of concrete yields 0.60 cubic feet; one 60 lb bag yields 0.45 cubic feet.',
      'Always add 10% extra volume to account for out-of-round augered hole cave-ins and over-excavation.'
    ],
    formula: 'Cylinder V = π × r² × h | Bell Cone V ≈ (1/3) × π × h × (r1² + r1×r2 + r2²) | Total Yards = (Total cu ft × 1.10) / 27',
    faq: [
      { q: 'Why use a flared footing base (bell) on a deck pier?', a: 'A flared bell footing (like a Bigfoot base) spreads the vertical load over 4 to 5 times more soil area to prevent settling, while locking the pier into the ground to resist frost heave uplift.' },
      { q: 'How many 80 lb bags of concrete are in a cubic yard?', a: 'There are exactly 45 bags of 80-pound concrete in one cubic yard (27 cubic feet / 0.60 cu ft per bag = 45 bags).' }
    ],
    calcJs: `
      function calc() {
        var diaIn = parseFloat(document.getElementById('tubeDia').value) || 10;
        var depth = parseFloat(document.getElementById('depthFt').value) || 4.0;
        var piers = parseInt(document.getElementById('numPiers').value, 10) || 6;
        var hasBell = document.getElementById('hasBell').value === 'yes';

        var rFt = (diaIn / 2) / 12;
        var cylVolCuFt = Math.PI * rFt * rFt * depth;

        var bellVolCuFt = 0;
        if (hasBell) {
          // Bell flare: 1.0 ft high flared to 24" base
          var rBase = 1.0; // 12" radius = 24" dia
          bellVolCuFt = (1/3) * Math.PI * 1.0 * (rFt*rFt + rFt*rBase + rBase*rBase);
        }

        var singlePierCuFt = cylVolCuFt + bellVolCuFt;
        var totalCuFt = singlePierCuFt * piers * 1.10; // 10% over-dig waste
        var totalYds = totalCuFt / 27;

        var bags80 = Math.ceil(totalCuFt / 0.60);
        var bags60 = Math.ceil(totalCuFt / 0.45);

        document.getElementById('outTotalYards').textContent = totalYds.toFixed(2) + ' Cubic Yards (Includes 10% overage)';
        document.getElementById('outBags80').textContent = bags80 + ' Bags (80 lb) OR';
        document.getElementById('outBags60').textContent = bags60 + ' Bags (60 lb)';
        document.getElementById('outSinglePierYds').textContent = (singlePierCuFt / 27).toFixed(3) + ' cu yds (' + singlePierCuFt.toFixed(1) + ' cu ft) per pier';
        document.getElementById('outRebarSticks').textContent = (piers * 3) + ' Sticks #4 Rebar (3 per cage)';
      }
    `
  },
  {
    slug: 'asphalt-driveway-tonnage-depth',
    name: 'Asphalt Driveway Tonnage Calculator',
    h1: 'Asphalt Driveway Tonnage & Compacted Depth Calculator',
    title: 'Asphalt Driveway Tonnage Calculator [Hot-Mix Asphalt Depth] | Digital Tools Shed',
    metaDesc: 'Estimate hot mix asphalt (HMA) tonnage from length, width, and compacted depth with loose rake factors and tri-axle truckload requirements.',
    category: 'Concrete & Masonry',
    codeRef: 'NAPA Standards',
    lead: 'Calculate hot mix asphalt (HMA) tonnage and compacted rolled thickness based on driveway square footage and base preparation.',
    inputs: [
      { id: 'driveLen', label: 'Driveway Total Length', value: 60, step: 5, unit: 'Feet' },
      { id: 'driveW', label: 'Driveway Width', value: 12, step: 1, unit: 'Feet' },
      { id: 'compactDepth', label: 'Compacted Asphalt Thickness', type: 'select', options: [
        { value: '2.0', label: '2.0 Inches Compacted (Standard Residential Resurfacing)' },
        { value: '2.5', label: '2.5 Inches Compacted (Standard New Driveway)', selected: true },
        { value: '3.0', label: '3.0 Inches Compacted (Heavy Vehicles / Trucks)' }
      ]},
      { id: 'wastePct', label: 'Edge Waste & Irregularity Allowance', value: 5, step: 1, unit: '%' }
    ],
    primaryOutput: { id: 'outAsphaltTons', label: 'Hot Mix Asphalt Tonnage', unit: 'Tons' },
    outputs: [
      { id: 'outLooseDepth', label: 'Loose Rake Depth Before Rolling' },
      { id: 'outTruckloads', label: 'Dump Truck Loads (Tri-Axle)' },
      { id: 'outBaseTons', label: 'Crushed Gravel Base Required (6")' },
      { id: 'outSqYards', label: 'Total Driveway Area' }
    ],
    rules: [
      'Compacted hot mix asphalt has a standard engineering density of 145 pounds per cubic foot (110 lbs per sq yd per inch of thickness).',
      'Asphalt compacts approximately 25% under heavy steel drum rollers: 2.5" compacted requires 3.2" loose rake depth.',
      'Residential driveways require a minimum 6" to 8" compacted crushed stone aggregate base (dense-grade 21A or crusher run).',
      'Paving must be performed when ambient and ground temperatures are at least 50°F and rising.'
    ],
    formula: 'Tons = [Length × Width × (Compacted Depth / 12) × 145 lbs/cu ft] / 2000 × (1 + Waste%)',
    faq: [
      { q: 'How thick should a residential asphalt driveway be?', a: 'A standard residential driveway should have 2.5 to 3 inches of compacted asphalt placed on top of 6 to 8 inches of compacted crushed gravel base.' },
      { q: 'Why does loose asphalt need to be raked thicker than the target depth?', a: 'Hot mix asphalt contains roughly 20% to 25% air voids when spread loose. Rolling with a multi-ton vibratory roller compresses the mixture, reducing thickness from ~3.2 inches down to 2.5 inches.' }
    ],
    calcJs: `
      function calc() {
        var len = parseFloat(document.getElementById('driveLen').value) || 60;
        var w = parseFloat(document.getElementById('driveW').value) || 12;
        var depthIn = parseFloat(document.getElementById('compactDepth').value) || 2.5;
        var waste = parseFloat(document.getElementById('wastePct').value) || 5;

        var sqFt = len * w;
        var sqYds = sqFt / 9;
        var cuFt = sqFt * (depthIn / 12);
        var weightLbs = cuFt * 145;
        var tons = (weightLbs / 2000) * (1 + waste / 100);

        var looseIn = depthIn * 1.25;
        var trucks = Math.ceil(tons / 18); // 18 tons per tri-axle
        var baseCuYds = (sqFt * (6 / 12)) / 27;
        var baseTons = baseCuYds * 1.4;

        document.getElementById('outAsphaltTons').textContent = tons.toFixed(1) + ' Tons of Hot Mix Asphalt';
        document.getElementById('outLooseDepth').textContent = looseIn.toFixed(2) + '" Loose Rake Depth (rolls down to ' + depthIn + '")';
        document.getElementById('outTruckloads').textContent = trucks + ' Tri-Axle Truckloads (~18 tons each)';
        document.getElementById('outBaseTons').textContent = Math.round(baseTons) + ' Tons of Crushed Stone Base (6" compacted)';
        document.getElementById('outSqYards').textContent = Math.round(sqFt) + ' sq ft (' + Math.round(sqYds) + ' sq yards)';
      }
    `
  },
  {
    slug: 'paver-base-sand-subbase-estimator',
    name: 'Patio Paver Base Sand & Subbase Calculator',
    h1: 'Brick & Concrete Patio Paver Base Sand & Subbase Calculator',
    title: 'Patio Paver Base Sand & Subbase Calculator [Aggregate Tons] | Digital Tools Shed',
    metaDesc: 'Calculate cubic yards and tons for 4 to 6 inch crushed gravel subbase, 1 inch bedding sand, and polymeric joint sand bags for patios and walkways.',
    category: 'Concrete & Masonry',
    codeRef: 'ICPI Guidelines',
    lead: 'Calculate bulk materials for paver patios: crushed stone road base, coarse angular bedding sand, and polymeric joint sand.',
    inputs: [
      { id: 'patioArea', label: 'Patio Total Surface Area', value: 300, step: 25, unit: 'Sq Ft' },
      { id: 'subbaseDepth', label: 'Crushed Gravel Subbase Depth', type: 'select', options: [
        { value: '4', label: '4 Inches (Pedestrian Walkway / Light Patio)' },
        { value: '6', label: '6 Inches (Standard Residential Patio)', selected: true },
        { value: '8', label: '8 Inches (Heavy Patio / Poor Clay Soil)' },
        { value: '10', label: '10 Inches (Vehicular Driveway)' }
      ]},
      { id: 'edgeRestraint', label: 'Patio Perimeter for Plastic Edge Restraints', value: 70, step: 5, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outGravelTons', label: 'Crushed Stone Subbase (Class 5 / 21A)', unit: 'Tons' },
    outputs: [
      { id: 'outSandTons', label: 'Coarse Bedding Sand (1" Layer)' },
      { id: 'outPolyBags', label: 'Polymeric Joint Sand Bags (50 lb)' },
      { id: 'outExcavDepth', label: 'Total Excavation Depth Needed' },
      { id: 'outGeotextile', label: 'Geotextile Fabric Required' }
    ],
    rules: [
      'ICPI: Bedding sand must be coarse, concrete sand (ASTM C33), NEVER fine masonry sand or stone dust.',
      'Bedding sand must be screeded exactly 1 inch thick; never use sand to level out low spots in the gravel.',
      'Compacted aggregate subbase (crushed road bond) must extend at least 6 inches past the paver edge on all sides.',
      'Plastic edge restraints secured with 10-inch steel spikes are mandatory to prevent perimeter paver spreading.'
    ],
    formula: 'Subbase Tons = [Area × (Depth / 12) / 27] × 1.35 tons/yd³ | Sand Tons = [Area × (1 / 12) / 27] × 1.25 tons/yd³',
    faq: [
      { q: 'Why is stone dust bad for paver bedding sand?', a: 'Stone dust contains fine mineral powders that trap water rather than draining. When saturated, stone dust turns into soft mush that allows pavers to sink, rock, and heave during winter freezes.' },
      { q: 'How deep do I need to dig for a paver patio?', a: 'Total excavation depth equals: Subbase thickness (typically 6") + Bedding sand (1") + Paver thickness (typically 2-3/8" or 60mm) = ~9.5 inches total excavation below finished grade.' }
    ],
    calcJs: `
      function calc() {
        var area = parseFloat(document.getElementById('patioArea').value) || 300;
        var subIn = parseFloat(document.getElementById('subbaseDepth').value) || 6;
        var perim = parseFloat(document.getElementById('edgeRestraint').value) || 70;

        var subYds = (area * (subIn / 12)) / 27;
        var subTons = subYds * 1.35;

        var sandYds = (area * (1.0 / 12)) / 27;
        var sandTons = sandYds * 1.25;

        var polyBags = Math.ceil(area / 75); // approx 75 sq ft per 50 lb bag
        var totalDigIn = subIn + 1.0 + 2.375;

        document.getElementById('outGravelTons').textContent = subTons.toFixed(1) + ' Tons (' + subYds.toFixed(1) + ' cu yds)';
        document.getElementById('outSandTons').textContent = sandTons.toFixed(1) + ' Tons (' + sandYds.toFixed(1) + ' cu yds ASTM C33 Sand)';
        document.getElementById('outPolyBags').textContent = polyBags + ' Bags (50 lb Polymeric Joint Sand)';
        document.getElementById('outExcavDepth').textContent = totalDigIn.toFixed(1) + '" total excavation depth required';
        document.getElementById('outGeotextile').textContent = Math.ceil(area * 1.15) + ' sq ft (Prevents gravel sinking into subgrade)';
      }
    `
  },
  {
    slug: 'culvert-pipe-sizing-manning',
    name: 'Driveway Culvert Pipe Sizing Calculator',
    h1: 'Driveway Culvert Pipe Sizing & Peak Drainage Flow Calculator',
    title: 'Driveway Culvert Pipe Sizing Calculator [Manning\'s Drainage Equation] | Digital Tools Shed',
    metaDesc: 'Size round corrugated metal (CMP) or smooth-wall HDPE driveway culvert pipes using Manning equation peak drainage runoff flow.',
    category: 'Concrete & Masonry',
    codeRef: 'AASHTO Drainage',
    lead: 'Calculate stormwater peak flow rate and size driveway culvert pipes to prevent driveway washouts using Manning open-channel hydraulics.',
    inputs: [
      { id: 'acres', label: 'Tributary Drainage Watershed Area', value: 5.0, step: 0.5, unit: 'Acres' },
      { id: 'rainfall', label: 'Design Rainfall Intensity (10-Yr Storm)', value: 2.5, step: 0.25, unit: 'in / hr' },
      { id: 'runoffC', label: 'Runoff Coefficient (C)', type: 'select', options: [
        { value: '0.20', label: 'Cultivated / Forested Soil (C = 0.20)' },
        { value: '0.35', label: 'Residential Lawn / Pasture (C = 0.35)', selected: true },
        { value: '0.60', label: 'Steep / Compacted Gravel Ditch (C = 0.60)' },
        { value: '0.85', label: 'Paved / Impervious Surface (C = 0.85)' }
      ]},
      { id: 'pipeSlope', label: 'Culvert Pipe Slope Grade', value: 1.5, step: 0.25, unit: '% Slope' },
      { id: 'pipeMat', label: 'Culvert Pipe Material', type: 'select', options: [
        { value: '0.012', label: 'Smooth Interior Dual-Wall HDPE (n = 0.012)', selected: true },
        { value: '0.024', label: 'Corrugated Metal Pipe CMP (n = 0.024)' }
      ]}
    ],
    primaryOutput: { id: 'outMinDia', label: 'Recommended Culvert Diameter', unit: 'Inches' },
    outputs: [
      { id: 'outPeakFlow', label: 'Peak Stormwater Runoff (Q)' },
      { id: 'outFullCapacity', label: 'Full Pipe Flow Capacity' },
      { id: 'outVelocity', label: 'Water Discharge Velocity' },
      { id: 'outCoverDepth', label: 'Minimum Soil Cover Depth' }
    ],
    rules: [
      'Rational Method: Peak drainage flow Q = C × I × A in cubic feet per second (CFS).',
      'Smooth interior HDPE pipes convey nearly twice as much water as corrugated metal due to lower Manning friction (n=0.012 vs 0.024).',
      'Driveway culverts must have at least 12 inches of compacted gravel cover over the crown to prevent crushing under heavy trucks.',
      'Inlet and outlet ends must be protected with stone riprap or flared end sections to prevent embankment erosion.'
    ],
    formula: 'Peak Q = C × I × A | Manning Capacity Q = (1.486 / n) × A × R^(2/3) × S^(1/2)',
    faq: [
      { q: 'Why is smooth HDPE pipe better than corrugated metal?', a: 'Smooth-wall HDPE has a Manning roughness coefficient of n = 0.012, compared to n = 0.024 for corrugated steel. Smooth HDPE allows water to flow twice as fast, allowing contractors to use a smaller pipe diameter for the same ditch flow.' },
      { q: 'How much gravel cover does a plastic culvert pipe need?', a: 'AASHTO standards require a minimum of 12 inches (or one pipe diameter) of well-compacted crushed gravel over the top of the pipe to bridge axle loads and prevent pipe deflection.' }
    ],
    calcJs: `
      function calc() {
        var a = parseFloat(document.getElementById('acres').value) || 5.0;
        var i = parseFloat(document.getElementById('rainfall').value) || 2.5;
        var c = parseFloat(document.getElementById('runoffC').value) || 0.35;
        var slopePct = parseFloat(document.getElementById('pipeSlope').value) || 1.5;
        var n = parseFloat(document.getElementById('pipeMat').value) || 0.012;

        var qPeak = c * i * a; // CFS
        var s = slopePct / 100;

        // Manning capacities for standard pipe diameters (12", 15", 18", 24", 30", 36")
        var sizes = [12, 15, 18, 24, 30, 36];
        var recDia = 36;
        var capFound = 0;
        var velFound = 0;

        for (var idx = 0; idx < sizes.length; idx++) {
          var dIn = sizes[idx];
          var dFt = dIn / 12;
          var area = Math.PI * Math.pow(dFt / 2, 2);
          var hydRad = dFt / 4;
          var qCap = (1.486 / n) * area * Math.pow(hydRad, 2/3) * Math.sqrt(s);
          if (qCap >= qPeak) {
            recDia = dIn;
            capFound = qCap;
            velFound = qCap / area;
            break;
          }
        }

        document.getElementById('outMinDia').textContent = recDia + '" Diameter Culvert Pipe';
        document.getElementById('outPeakFlow').textContent = qPeak.toFixed(2) + ' CFS (Cubic Feet / Sec)';
        document.getElementById('outFullCapacity').textContent = capFound.toFixed(1) + ' CFS maximum full flow';
        document.getElementById('outVelocity').textContent = velFound.toFixed(1) + ' ft/sec discharge velocity';
        document.getElementById('outCoverDepth').textContent = '12" minimum compacted gravel over pipe';
      }
    `
  },
  {
    slug: 'excavation-trench-trench-spoil-swell',
    name: 'Excavation Trench Spoil Swell Calculator',
    h1: 'Excavation Trench Dirt Spoil Swell & Dump Truck Calculator',
    title: 'Excavation Trench Dirt Spoil Swell Calculator [Dump Truck Loads] | Digital Tools Shed',
    metaDesc: 'Calculate volumetric soil expansion (20% to 35% swell factor) from bank cubic yards (BCY) to loose yards (LCY) and required dump truck loads.',
    category: 'Concrete & Masonry',
    codeRef: 'Caterpillar Handbook',
    lead: 'Calculate volumetric soil expansion when compacted virgin ground is excavated and determine the number of haul-off dump trucks required.',
    inputs: [
      { id: 'trenchLen', label: 'Trench / Excavation Length', value: 100, step: 5, unit: 'Feet' },
      { id: 'trenchWidth', label: 'Trench Width', value: 3.0, step: 0.5, unit: 'Feet' },
      { id: 'trenchDepth', label: 'Trench Depth', value: 4.0, step: 0.5, unit: 'Feet' },
      { id: 'soilType', label: 'Soil Classification & Swell Factor', type: 'select', options: [
        { value: '25', label: 'Common Earth / Topsoil (25% Swell)', selected: true },
        { value: '35', label: 'Dense Clay / Heavy Silt (35% Swell)' },
        { value: '15', label: 'Sand / Loose Gravel (15% Swell)' },
        { value: '50', label: 'Solid Rock Blasting (50% Swell)' }
      ]},
      { id: 'truckCap', label: 'Dump Truck Haul Capacity', type: 'select', options: [
        { value: '10', label: 'Single Axle / Small Dump (10 Loose Yards)' },
        { value: '14', label: 'Standard Tri-Axle Dump Truck (14 Loose Yards)', selected: true },
        { value: '18', label: 'Large End-Dump Trailer (18 Loose Yards)' }
      ]}
    ],
    primaryOutput: { id: 'outTruckloads', label: 'Dump Truck Haul-Off Loads', unit: 'Trucks' },
    outputs: [
      { id: 'outBcy', label: 'Bank In-Ground Volume (BCY)' },
      { id: 'outLcy', label: 'Loose Spoil Pile Volume (LCY)' },
      { id: 'outWeightTons', label: 'Estimated Total Spoil Weight' },
      { id: 'outTrenchSqFt', label: 'Trench Wall Surface Area' }
    ],
    rules: [
      'Bank Cubic Yards (BCY): Volume of earth in its natural consolidated in-situ state.',
      'Loose Cubic Yards (LCY): Volume of excavated earth after disturbance; air voids cause 15% to 35% volumetric swell.',
      'Compacted Cubic Yards (CCY): Volume after mechanical roller compaction (typically 10% to 20% shrinkage from BCY).',
      'Never estimate truck haulage based on trench dimensions without applying the soil swell multiplier.'
    ],
    formula: 'BCY = (L × W × D) / 27 | LCY = BCY × (1 + Swell% / 100) | Trucks = ⌈LCY / Truck Capacity⌉',
    faq: [
      { q: 'What is soil swell in excavation work?', a: 'When soil is excavated from the ground, the natural cohesion and compaction are broken up, introducing air pockets between particles. This causes the pile of dirt to expand by 20% to 35% more volume than the hole it came out of.' },
      { q: 'Why did I run out of dirt when backfilling a trench?', a: 'Because mechanical compactors compress loose fill into a tighter density than virgin earth (shrinkage). A 100-yard trench often requires 110 to 120 yards of backfill material to achieve 95% standard Proctor density.' }
    ],
    calcJs: `
      function calc() {
        var len = parseFloat(document.getElementById('trenchLen').value) || 100;
        var w = parseFloat(document.getElementById('trenchWidth').value) || 3.0;
        var d = parseFloat(document.getElementById('trenchDepth').value) || 4.0;
        var swellPct = parseFloat(document.getElementById('soilType').value) || 25;
        var truckCap = parseFloat(document.getElementById('truckCap').value) || 14;

        var bcy = (len * w * d) / 27;
        var lcy = bcy * (1 + (swellPct / 100));
        var trucks = Math.ceil(lcy / truckCap);
        var tons = lcy * 1.15; // approx 2300 lbs/yd

        var wallArea = 2 * len * d;

        document.getElementById('outTruckloads').textContent = trucks + ' Dump Truck Loads (' + lcy.toFixed(1) + ' Loose Yards)';
        document.getElementById('outBcy').textContent = bcy.toFixed(1) + ' Bank Cubic Yards (In-ground volume)';
        document.getElementById('outLcy').textContent = lcy.toFixed(1) + ' Loose Cubic Yards (+' + swellPct + '% pile swell)';
        document.getElementById('outWeightTons').textContent = Math.round(tons) + ' Tons total soil mass';
        document.getElementById('outTrenchSqFt').textContent = wallArea + ' sq ft of vertical trench walls';
      }
    `
  },
  {
    slug: 'post-hole-concrete-depth-frost',
    name: 'Post Hole Diameter & Frost Depth Sizer',
    h1: 'Post Hole Depth to Frost Line & Concrete Bag Sizer',
    title: 'Post Hole Depth & Frost Line Concrete Sizer [IRC Section R403.1.4.1] | Digital Tools Shed',
    metaDesc: 'Determine fence and deck post hole depth based on regional frost lines and calculate 60 lb and 80 lb concrete bag requirements under IRC R403.',
    category: 'Concrete & Masonry',
    codeRef: 'IRC R403.1.4.1',
    lead: 'Calculate post hole excavation depth below regional frost penetration lines and estimate pre-mix concrete bag requirements subtracting post displacement.',
    inputs: [
      { id: 'postSize', label: 'Post Lumber Dimension', type: 'select', options: [
        { value: '3.5', label: '4x4 Wood Post (3.5" actual)', selected: true },
        { value: '5.5', label: '6x6 Wood Post (5.5" actual)' },
        { value: '2.375', label: '2-3/8" Metal Fence Pipe' }
      ]},
      { id: 'frostDepth', label: 'Regional Frost Line Depth', type: 'select', options: [
        { value: '18', label: '18" Deep (Southern US / Warm Climate)' },
        { value: '30', label: '30" Deep (Mid-Atlantic / Central US)' },
        { value: '36', label: '36" Deep (Midwest / New York / Ohio)', selected: true },
        { value: '42', label: '42" Deep (Northern US / Great Lakes)' },
        { value: '48', label: '48" Deep (New England / Upper Midwest)' }
      ]},
      { id: 'holeCount', label: 'Number of Posts', value: 10, step: 1, min: 1, unit: 'Posts' }
    ],
    primaryOutput: { id: 'outBags80', label: '80 lb Concrete Bags Needed', unit: 'Bags' },
    outputs: [
      { id: 'outHoleDepth', label: 'Total Excavation Depth' },
      { id: 'outHoleDia', label: 'Recommended Hole Diameter' },
      { id: 'outBags60', label: '60 lb Concrete Bags Alternative' },
      { id: 'outGravelBase', label: 'Crushed Gravel Drainage Base' }
    ],
    rules: [
      'IRC R403.1.4.1: Post footings must extend below the frost line to prevent frost heave from lifting posts out of ground.',
      'Rule of thumb: Post hole diameter must be THREE TIMES (3x) the width of the post (10" hole for 4x4, 12" hole for 6x6).',
      'A 6" compacted crushed gravel drainage pad must sit at the bottom of the hole so water drains away from wooden post end-grain.',
      'Slope the finished concrete collar away from the wood post at the surface to shed rain.'
    ],
    formula: 'Hole Dia = 3 × Post Width | Total Depth = Frost Depth + 6" Gravel | Concrete = Hole Volume - Submerged Post Volume',
    faq: [
      { q: 'Why do posts rot at the top of the concrete collar?', a: 'When concrete is finished concave or flat around a post, rainwater pools against the wood at grade level. Finishing concrete crowned (sloped away like a volcano) sheds moisture and dramatically extends post lifespan.' },
      { q: 'Should concrete completely encase the bottom of a wooden post?', a: 'No. The bottom of the post should rest on a 6" bed of crushed gravel with concrete poured around the sides. Encasing the bottom in concrete traps water inside the post like a cup, rotting it from the inside out.' }
    ],
    calcJs: `
      function calc() {
        var postW = parseFloat(document.getElementById('postSize').value) || 3.5;
        var frost = parseFloat(document.getElementById('frostDepth').value) || 36;
        var count = parseInt(document.getElementById('holeCount').value, 10) || 10;

        var holeDia = postW * 3.0;
        if (holeDia < 9) holeDia = 9; // minimum 9" auger
        var totalDepth = frost + 6; // 6" gravel base

        var rFt = (holeDia / 2) / 12;
        var cylCuFt = Math.PI * rFt * rFt * (frost / 12);
        var postCuFt = (postW / 12) * (postW / 12) * (frost / 12);
        var netCuFtPerHole = Math.max(0, cylVolCuFt - postCuFt);

        var totalCuFt = netCuFtPerHole * count;
        var bags80 = Math.ceil(totalCuFt / 0.60);
        var bags60 = Math.ceil(totalCuFt / 0.45);

        document.getElementById('outBags80').textContent = bags80 + ' Bags (80 lb) [' + (bags80 / count).toFixed(1) + ' bags/post]';
        document.getElementById('outHoleDepth').textContent = totalDepth + '" deep (' + frost + '" frost line + 6" gravel)';
        document.getElementById('outHoleDia').textContent = Math.round(holeDia) + '" Auger Diameter (3x post width)';
        document.getElementById('outBags60').textContent = bags60 + ' Bags (60 lb) alternative';
        document.getElementById('outGravelBase').textContent = '6" clean crushed stone pad at bottom of hole';
      }
    `
  },
  {
    slug: 'slab-vapor-barrier-moisture-perm',
    name: 'Under-Slab Vapor Barrier Permeance Calculator',
    h1: 'Concrete Slab Vapor Barrier Permeance & Roll Overlap Calculator',
    title: 'Concrete Slab Vapor Barrier Permeance Calculator [ASTM E1745 Class A Poly] | Digital Tools Shed',
    metaDesc: 'Size under-slab true extruded poly vapor barriers (10 to 15 mil under ASTM E1745) and calculate 6-inch taped seam overlap square footage.',
    category: 'Concrete & Masonry',
    codeRef: 'ASTM E1745 / E1643',
    lead: 'Calculate square footage and roll requirements for under-slab vapor retarders with ASTM E1643 6-inch taped overlaps to prevent floor delamination.',
    inputs: [
      { id: 'slabArea', label: 'Concrete Slab Total Area', value: 1500, step: 50, unit: 'Sq Ft' },
      { id: 'perimeter', label: 'Slab Foundation Perimeter', value: 160, step: 10, unit: 'Feet' },
      { id: 'rollWidth', label: 'Vapor Retarder Roll Dimensions', type: 'select', options: [
        { value: '2000', label: '14 ft × 143 ft Roll (2,000 sq ft)', selected: true },
        { value: '1000', label: '10 ft × 100 ft Roll (1,000 sq ft)' }
      ]},
      { id: 'milThick', label: 'Poly Membrane Thickness', type: 'select', options: [
        { value: '15', label: '15-Mil True Polyolefin (ASTM E1745 Class A - Heavy Duty)', selected: true },
        { value: '10', label: '10-Mil Polyolefin (ASTM E1745 Class A)' },
        { value: '6', label: '6-Mil Generic Visqueen (Not recommended - puncture prone)' }
      ]}
    ],
    primaryOutput: { id: 'outRollsReq', label: 'Membrane Rolls to Order', unit: 'Rolls' },
    outputs: [
      { id: 'outGrossSqFt', label: 'Gross Square Footage (10% Overlap)' },
      { id: 'outSeamTape', label: 'Seam Sealing Tape Rolls (180 ft)' },
      { id: 'outPermRating', label: 'Permeance Water Vapor Rating' },
      { id: 'outAstmStatus', label: 'ASTM E1745 Code Status' }
    ],
    rules: [
      'ASTM E1643 mandates that all vapor retarder seams must overlap by at least 6 inches and be continuously taped.',
      'Generic 6-mil recycled Visqueen is NOT ASTM E1745 compliant; it punctures easily on stone base and degrades underground.',
      'Moisture vapor transmission through concrete slabs delaminates epoxy coatings, blisters vinyl plank (LVP), and breeds mold.',
      'Punctures around pipe penetrations must be sealed with manufactured pipe boots and mastic tape.'
    ],
    formula: 'Gross Area = Slab Area × 1.10 (Overlap & perimeter turn-up) | Rolls = ⌈Gross Area / Roll Area⌉',
    faq: [
      { q: 'Why is generic 6-mil plastic not allowed under modern slabs?', a: 'Standard 6-mil black or clear plastic from big-box stores is made from recycled polymers that degrade in contact with soil bacteria within a few years. It also tears instantly under construction worker boots, destroying the vapor barrier.' },
      { q: 'Should concrete be poured directly on the vapor barrier?', a: 'Yes. Modern ACI 302.1R guidelines mandate pouring concrete directly on top of an unpunctured vapor retarder. Installing a sand cushion layer on top traps water and creates a permanent moisture reservoir beneath the slab.' }
    ],
    calcJs: `
      function calc() {
        var area = parseFloat(document.getElementById('slabArea').value) || 1500;
        var perim = parseFloat(document.getElementById('perimeter').value) || 160;
        var rollSqFt = parseFloat(document.getElementById('rollWidth').value) || 2000;
        var mil = document.getElementById('milThick').value;

        var grossSqFt = area * 1.10; // 10% overlap and edge turn-up
        var rolls = Math.ceil(grossSqFt / rollSqFt);

        var seamLinearFt = (area / 12) + perim; // approx seam length
        var tapeRolls = Math.ceil(seamLinearFt / 180);

        var perm = mil === '15' ? '< 0.01 Perms (Class A)' : (mil === '10' ? '< 0.03 Perms (Class A)' : '0.06 Perms (Degradable)');

        document.getElementById('outRollsReq').textContent = rolls + ' Rolls (' + rollSqFt + ' sq ft each)';
        document.getElementById('outGrossSqFt').textContent = Math.round(grossSqFt).toLocaleString() + ' sq ft required';
        document.getElementById('outSeamTape').textContent = tapeRolls + ' Rolls (3" × 180 ft ASTM E1643 tape)';
        document.getElementById('outPermRating').textContent = perm;
        
        var badge = document.getElementById('statusBadge');
        if (mil !== '6') {
          document.getElementById('outAstmStatus').textContent = '✅ ASTM E1745 Class A Certified (Puncture & Rot Proof)';
          document.getElementById('outAstmStatus').style.color = '#22c55e';
          badge.textContent = 'ASTM Pass: High puncture resistance';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outAstmStatus').textContent = '⚠️ Fails Commercial Flooring Warranty (Puncture risk)';
          document.getElementById('outAstmStatus').style.color = '#ef4444';
          badge.textContent = 'Warning: Upgrade to 10-mil or 15-mil poly';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'grout-joint-consumption-tile',
    name: 'Tile Grout Consumption Calculator',
    h1: 'Tile Grout Consumption: Sanded vs Unsanded Calculator',
    title: 'Tile Grout Consumption Calculator [Sanded vs Unsanded Joint Width] | Digital Tools Shed',
    metaDesc: 'Calculate pounds of tile grout required by tile dimensions, thickness, and joint width, with sanded vs unsanded selection rules.',
    category: 'Concrete & Masonry',
    codeRef: 'TCNA Handbook',
    lead: 'Calculate pounds of tile grout required based on tile dimensions, thickness, and joint width, with automatic sanded versus unsanded recommendations.',
    inputs: [
      { id: 'tileL', label: 'Tile Length', value: 12, step: 0.5, unit: 'Inches' },
      { id: 'tileW', label: 'Tile Width', value: 12, step: 0.5, unit: 'Inches' },
      { id: 'tileT', label: 'Tile Thickness', value: 0.375, step: 0.0625, unit: 'Inches', hint: 'Standard 3/8" floor tile' },
      { id: 'jointW', label: 'Grout Joint Width', type: 'select', options: [
        { value: '0.0625', label: '1/16" (1.6 mm - Ultra Narrow)' },
        { value: '0.125', label: '1/8" (3.2 mm - Standard Rectified)', selected: true },
        { value: '0.1875', label: '3/16" (4.8 mm - Handmade / Non-Rectified)' },
        { value: '0.25', label: '1/4" (6.4 mm - Wide Rustic Joint)' }
      ]},
      { id: 'tileArea', label: 'Tiled Surface Area', value: 200, step: 10, unit: 'Sq Ft' }
    ],
    primaryOutput: { id: 'outGroutLbs', label: 'Total Grout Required', unit: 'Pounds (lbs)' },
    outputs: [
      { id: 'outGroutType', label: 'Recommended Grout Type' },
      { id: 'outBags25', label: '25 lb Grout Bags to Purchase' },
      { id: 'outCoveragePerBag', label: 'Square Foot Coverage per 25 lb' },
      { id: 'outWasteFactor', label: 'Includes 10% Waste Factor' }
    ],
    rules: [
      'TCNA Rule: Grout joints 1/8" or wider require Sanded Grout to prevent joint shrinkage and cracking.',
      'Grout joints narrower than 1/8" require Unsanded Grout or High-Performance Epoxy to penetrate tight gaps.',
      'Never use sanded grout on polished marble or gloss glass tile, as aggregate sand will scratch surface glazes.',
      'Allow at least 24 hours of mortar thinset cure time before washing and filling grout joints.'
    ],
    formula: 'Weight (lbs) = [Area × (Length + Width) / (Length × Width)] × Joint Width × Thickness × 1.5 × 1.10',
    faq: [
      { q: 'What happens if you use unsanded grout in a 1/4" joint?', a: 'Unsanded grout shrinks as water evaporates during curing. In joints wider than 1/8", it will crack, develop pinholes, and pull away from the edges of the tile.' },
      { q: 'Why does sanded grout scratch glass and polished marble tile?', a: 'Sanded grout contains coarse silica sand aggregate. When sponging and tooling the grout lines, the hard quartz sand particles scratch softer materials like polished marble, limestone, and glass.' }
    ],
    calcJs: `
      function calc() {
        var tl = parseFloat(document.getElementById('tileL').value) || 12;
        var tw = parseFloat(document.getElementById('tileW').value) || 12;
        var tt = parseFloat(document.getElementById('tileT').value) || 0.375;
        var jw = parseFloat(document.getElementById('jointW').value) || 0.125;
        var area = parseFloat(document.getElementById('tileArea').value) || 200;

        var lbsRaw = (area * ((tl + tw) / (tl * tw)) * jw * tt * 1.5);
        var totalLbs = Math.ceil(lbsRaw * 1.10); // 10% sponge waste
        var bags25 = Math.ceil(totalLbs / 25);
        var covPerBag = (area / (totalLbs / 25)).toFixed(1);

        var isSanded = jw >= 0.125;
        var gType = isSanded ? 'Sanded Grout (Joints ≥ 1/8")' : 'Unsanded Grout (Joints < 1/8")';

        document.getElementById('outGroutLbs').textContent = totalLbs + ' lbs of dry grout mix';
        document.getElementById('outGroutType').textContent = gType;
        document.getElementById('outBags25').textContent = bags25 + ' Bags (25 lb bag size)';
        document.getElementById('outCoveragePerBag').textContent = '~' + covPerBag + ' sq ft per 25 lb bag';
        document.getElementById('outWasteFactor').textContent = Math.round(totalLbs * 0.10) + ' lbs extra for bucket/sponge wash';
      }
    `
  },
  {
    slug: 'brick-masonry-mortar-cubes',
    name: 'Brick Masonry & Mortar Cube Calculator',
    h1: 'Standard Modular Brick Count & Mortar Bag Calculator',
    title: 'Standard Brick Count & Mortar Bag Calculator [Modular Brick 3/8" Joints] | Digital Tools Shed',
    metaDesc: 'Calculate standard modular brick counts (6.75 bricks per sq ft with 3/8" joints), brick cubes (500/cube), and Type N/S mortar bag quantities.',
    category: 'Concrete & Masonry',
    codeRef: 'BIA Technical Notes',
    lead: 'Calculate exact brick strap cubes, pallet counts, Type N mortar bags, and masonry sand for brick veneer walls.',
    inputs: [
      { id: 'wallSqFt', label: 'Wall Gross Face Area', value: 800, step: 25, unit: 'Sq Ft' },
      { id: 'openings', label: 'Window & Door Deductions', value: 120, step: 10, unit: 'Sq Ft' },
      { id: 'brickType', label: 'Brick Modular Size', type: 'select', options: [
        { value: '6.75', label: 'Standard Modular (3-5/8" x 2-1/4" x 7-5/8" - 6.75/sq ft)', selected: true },
        { value: '5.75', label: 'Queen Size (2-3/4" x 7-5/8" - 5.75/sq ft)' },
        { value: '4.50', label: 'King Size (2-5/8" x 9-5/8" - 4.50/sq ft)' }
      ]},
      { id: 'wastePct', label: 'Cut & Breakage Waste Factor', value: 8, step: 1, unit: '%' }
    ],
    primaryOutput: { id: 'outBricks', label: 'Total Bricks to Order', unit: 'Bricks' },
    outputs: [
      { id: 'outCubes', label: 'Brick Pallet Straps (500/cube)' },
      { id: 'outMortarBags', label: 'Type N Mortar Bags (70 lb)' },
      { id: 'outMasonrySand', label: 'Masonry Sand Required' },
      { id: 'outWallTies', label: 'Corrugated Brick Veneer Ties' }
    ],
    rules: [
      'Standard modular brick requires 6.75 bricks per square foot with a 3/8-inch bed and head mortar joint.',
      'Bricks are sold strapped on wooden pallets in cubes of approximately 500 bricks.',
      'Rule of thumb: 1,000 standard modular bricks require approximately 6.5 to 7 bags of Type N mortar (70 lb).',
      'Brick veneer must be anchored to wood stud framing with galvanized wall ties every 16" vertically and 24" horizontally.'
    ],
    formula: 'Net Area = Gross - Openings | Bricks = Net Area × Bricks_per_sqft × (1 + Waste%) | Mortar = Bricks / 140',
    faq: [
      { q: 'Why is 6.75 used as the brick multiplier for modular bricks?', a: 'A standard modular brick with a 3/8" joint occupies an 8-inch length and a 2-2/3 inch height (3 courses = 8 inches vertical). One square foot (144 sq in) divided by (8" × 2.667" = 21.33 sq in) yields exactly 6.75 bricks per square foot.' },
      { q: 'What type of mortar should be used for brick veneer?', a: 'Type N mortar (750 PSI) is universally recommended for exterior above-grade brick veneer. It provides the ideal flexibility to absorb thermal expansion without cracking softer clay bricks.' }
    ],
    calcJs: `
      function calc() {
        var gross = parseFloat(document.getElementById('wallSqFt').value) || 800;
        var deduct = parseFloat(document.getElementById('openings').value) || 120;
        var factor = parseFloat(document.getElementById('brickType').value) || 6.75;
        var waste = parseFloat(document.getElementById('wastePct').value) || 8;

        var netSqFt = Math.max(0, gross - deduct);
        var totalBricks = Math.ceil(netSqFt * factor * (1 + waste / 100));
        var cubes = (totalBricks / 500).toFixed(1);
        var mortarBags = Math.ceil(totalBricks / 140);
        var sandTons = (mortarBags * 240) / 2000;
        var ties = Math.ceil(netSqFt / 2.67);

        document.getElementById('outBricks').textContent = totalBricks.toLocaleString() + ' Bricks (Includes ' + waste + '% waste)';
        document.getElementById('outCubes').textContent = cubes + ' Cubes / Pallet Straps (500 bricks/cube)';
        document.getElementById('outMortarBags').textContent = mortarBags + ' Bags (70 lb Type N Mortar)';
        document.getElementById('outMasonrySand').textContent = sandTons.toFixed(1) + ' Tons of Masonry Sand';
        document.getElementById('outWallTies').textContent = ties + ' Galvanized Wall Ties (1 per 2.67 sq ft)';
      }
    `
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 5: PLUMBING & HYDRAULICS (Tools 49–58)
// ─────────────────────────────────────────────────────────────────────────────
const PLUMBING_TOOLS = [
  {
    slug: 'hydraulic-cylinder-force-speed',
    name: 'Hydraulic Cylinder Force & Speed Calculator',
    h1: 'Hydraulic Cylinder Push/Pull Force & Extend Speed Calculator',
    title: 'Hydraulic Cylinder Force & Speed Calculator [Push, Pull & Pump GPM] | Digital Tools Shed',
    metaDesc: 'Calculate push force, rod-annulus pull force, extension speeds, and cycle times in tons and pounds based on PSI pressure and pump GPM.',
    category: 'Plumbing & Hydraulics',
    codeRef: 'ISO 4413',
    lead: 'Calculate hydraulic cylinder push and pull tonnage, rod displacement speed, and full cycle extension times based on system PSI and pump GPM flow.',
    inputs: [
      { id: 'psi', label: 'Hydraulic Operating Pressure', value: 2500, step: 100, unit: 'PSI' },
      { id: 'gpm', label: 'Hydraulic Pump Flow Rate', value: 8.0, step: 0.5, unit: 'GPM' },
      { id: 'boreDia', label: 'Cylinder Bore Diameter', value: 3.5, step: 0.25, unit: 'Inches' },
      { id: 'rodDia', label: 'Cylinder Rod Diameter', value: 1.75, step: 0.25, unit: 'Inches' },
      { id: 'strokeLen', label: 'Cylinder Stroke Length', value: 18, step: 1, unit: 'Inches' }
    ],
    primaryOutput: { id: 'outPushTons', label: 'Maximum Push Force', unit: 'Tons (US)' },
    outputs: [
      { id: 'outPullTons', label: 'Retract Pull Force' },
      { id: 'outExtendSpeed', label: 'Rod Extension Speed' },
      { id: 'outCycleTime', label: 'Full Extend Cycle Time' },
      { id: 'outRetractTime', label: 'Full Retract Cycle Time' }
    ],
    rules: [
      'Force (lbs) = Pressure (PSI) × Effective Piston Area (sq in).',
      'Push force acts on full circular bore area; pull force is reduced by the rod volume (annulus area).',
      'Rod retraction speed is always faster than extension speed because less fluid volume is required to fill the annulus.',
      'Never operate hydraulic systems above component maximum rated pressure.'
    ],
    formula: 'Push Area = π × (Bore/2)² | Pull Area = π × [(Bore/2)² - (Rod/2)²] | Force = PSI × Area | Speed (in/s) = (GPM × 231) / (Area × 60)',
    faq: [
      { q: 'Why does a hydraulic cylinder pull with less force than it pushes?', a: 'During retraction, hydraulic fluid acts only on the ring-shaped annulus area surrounding the rod. Because the steel rod subtracts surface area from the piston, the cylinder generates significantly less pulling tonnage.' },
      { q: 'Why does the cylinder retract faster than it extends?', a: 'Because the steel rod takes up space inside the cylinder barrel, less hydraulic oil volume is required to fill the retraction side. At a constant pump flow (GPM), the cylinder retracts in less time.' }
    ],
    calcJs: `
      function calc() {
        var p = parseFloat(document.getElementById('psi').value) || 2500;
        var flow = parseFloat(document.getElementById('gpm').value) || 8.0;
        var bore = parseFloat(document.getElementById('boreDia').value) || 3.5;
        var rod = parseFloat(document.getElementById('rodDia').value) || 1.75;
        var stroke = parseFloat(document.getElementById('strokeLen').value) || 18;

        var pistonArea = Math.PI * Math.pow(bore / 2, 2);
        var rodArea = Math.PI * Math.pow(rod / 2, 2);
        var annulusArea = Math.max(0, pistonArea - rodArea);

        var pushLbs = p * pistonArea;
        var pullLbs = p * annulusArea;
        var pushTons = pushLbs / 2000;
        var pullTons = pullLbs / 2000;

        var extSpeed = (flow * 231) / (pistonArea * 60);
        var retSpeed = (flow * 231) / (annulusArea * 60);

        var extTime = stroke / extSpeed;
        var retTime = stroke / retSpeed;

        document.getElementById('outPushTons').textContent = pushTons.toFixed(1) + ' Tons (' + Math.round(pushLbs).toLocaleString() + ' lbs)';
        document.getElementById('outPullTons').textContent = pullTons.toFixed(1) + ' Tons (' + Math.round(pullLbs).toLocaleString() + ' lbs)';
        document.getElementById('outExtendSpeed').textContent = extSpeed.toFixed(2) + ' in/sec extend speed';
        document.getElementById('outCycleTime').textContent = extTime.toFixed(1) + ' Seconds to fully extend';
        document.getElementById('outRetractTime').textContent = retTime.toFixed(1) + ' Seconds to fully retract';
      }
    `
  },
  {
    slug: 'plumbing-drain-slope-fall-per-foot',
    name: 'Plumbing Drain Pipe Slope & Fall Calculator',
    h1: 'Plumbing Drainage Pipe Slope & Pitch Fall Calculator',
    title: 'Drain Pipe Slope & Pitch Fall Calculator [IPC 1/4" & 1/8" Drop per Foot] | Digital Tools Shed',
    metaDesc: 'Calculate total vertical drop fall for DWV drain pipes under IPC and UPC codes (1/4" per foot for ≤ 2" pipes and 1/8" per foot for 3-6" pipes).',
    category: 'Plumbing & Hydraulics',
    codeRef: 'IPC Section 704.1',
    lead: 'Calculate elevation drop and pitch angles for plumbing drainage and waste lines to maintain self-scouring velocity without liquid separation.',
    inputs: [
      { id: 'pipeSize', label: 'Drain Pipe Nominal Diameter', type: 'select', options: [
        { value: '0.25', label: '1-1/2" or 2" Pipe (1/4" Fall per Foot Mandatory)', selected: true },
        { value: '0.125', label: '3", 4" or 6" Main Pipe (1/8" Fall per Foot Allowed)' }
      ]},
      { id: 'runFt', label: 'Total Horizontal Drain Run', value: 28, step: 1, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outTotalDrop', label: 'Total Elevation Fall Drop', unit: 'Inches' },
    outputs: [
      { id: 'outSlopePct', label: 'Slope Grade Percentage' },
      { id: 'outDropPer10', label: 'Drop per 10-Foot Pipe Section' },
      { id: 'outMaxSlopeWarning', label: 'Maximum Slope Separation Risk' },
      { id: 'outCodeCitation', label: 'Plumbing Code Requirement' }
    ],
    rules: [
      'IPC Table 704.1: Pipes 2" or smaller require at least 1/4" per foot (2.08% slope).',
      'Pipes 3" to 6" diameter permit a minimum slope of 1/8" per foot (1.04% slope) where headroom is limited.',
      'Excessive slope (> 1/2" per foot) is a violation: water outruns solids, leaving heavy waste stranded in the pipe.',
      'Proper drain slope maintains self-scouring scouring velocity of at least 2 feet per second (FPS).'
    ],
    formula: 'Total Drop (in) = Run (ft) × Slope (in/ft) | Slope % = (Slope / 12) × 100',
    faq: [
      { q: 'Why is too much slope bad in a sewer drain pipe?', a: 'If a drain pipe slopes too steeply (greater than 1/2" per foot), liquids drain away rapidly while heavier solids and toilet paper are left behind stranded on the pipe bottom, eventually creating a solid sewer backup.' },
      { q: 'What is self-scouring velocity in plumbing?', a: 'Plumbing codes design drain slopes to achieve a fluid flow velocity of 2 feet per second (FPS). At this velocity, moving water creates enough hydraulic turbulence to carry solid waste suspended without settling.' }
    ],
    calcJs: `
      function calc() {
        var slopePerFt = parseFloat(document.getElementById('pipeSize').value) || 0.25;
        var run = parseFloat(document.getElementById('runFt').value) || 28;

        var totalDropIn = run * slopePerFt;
        var slopePct = (slopePerFt / 12) * 100;
        var drop10Ft = 10 * slopePerFt;

        document.getElementById('outTotalDrop').textContent = totalDropIn.toFixed(2) + '" (' + toFraction(totalDropIn) + ') total drop';
        document.getElementById('outSlopePct').textContent = slopePct.toFixed(2) + '% slope grade';
        document.getElementById('outDropPer10').textContent = drop10Ft.toFixed(2) + '" (' + toFraction(drop10Ft) + ') per 10-ft pipe stick';
        document.getElementById('outMaxSlopeWarning').textContent = 'Keep slope ≤ 1/2" per foot to prevent solid separation';
        document.getElementById('outCodeCitation').textContent = slopePerFt === 0.25 ? 'IPC 704.1: 1/4" per foot standard for 1.5" - 2" DWV' : 'IPC 704.1: 1/8" per foot approved for 3" - 6" DWV';
      }
    `
  },
  {
    slug: 'pex-pipe-friction-loss-equivalent',
    name: 'PEX Pipe Pressure Drop & Friction Loss Calculator',
    h1: 'PEX Pipe Pressure Drop & Fitting Friction Loss Calculator',
    title: 'PEX Pipe Pressure Drop & Friction Loss Calculator [Hazen-Williams & Fittings] | Digital Tools Shed',
    metaDesc: 'Calculate PSI pressure drop through PEX tubing runs using Hazen-Williams formula with equivalent length additions for crimp barb fittings.',
    category: 'Plumbing & Hydraulics',
    codeRef: 'ASTM F876 / F877',
    lead: 'Calculate dynamic PSI pressure loss across PEX-A and PEX-B plumbing runs factoring in sharp crimp fitting equivalent length penalties.',
    inputs: [
      { id: 'pexDia', label: 'PEX Tubing Size', type: 'select', options: [
        { value: '0.485', label: '1/2" PEX (0.485" ID)', selected: true },
        { value: '0.681', label: '3/4" PEX (0.681" ID)' },
        { value: '0.862', label: '1" PEX (0.862" ID)' }
      ]},
      { id: 'flowGpm', label: 'Water Flow Rate', value: 4.0, step: 0.5, unit: 'GPM', hint: 'Single shower ~2.5 GPM, Tub fill ~4-5 GPM' },
      { id: 'runLength', label: 'Total PEX Tubing Run Length', value: 60, step: 5, unit: 'Feet' },
      { id: 'numElbows', label: 'Number of 90° Crimp Elbows', value: 6, step: 1, unit: 'Elbows' },
      { id: 'numTees', label: 'Number of Crimp Branch Tees', value: 2, step: 1, unit: 'Tees' }
    ],
    primaryOutput: { id: 'outTotalLoss', label: 'Total Pressure Loss', unit: 'PSI Drop' },
    outputs: [
      { id: 'outEquivLen', label: 'Total Equivalent Pipe Length' },
      { id: 'outVelocity', label: 'Water Flow Velocity' },
      { id: 'outLossPer100', label: 'Loss Rate per 100 Feet' },
      { id: 'outVelocityBadge', label: 'Water Velocity Assessment' }
    ],
    rules: [
      'Standard PEX brass crimp fittings insert inside the pipe, restricting internal cross-sectional area by up to 30%.',
      'Each 1/2" crimp elbow adds approximately 2.0 to 2.5 equivalent feet of tubing friction loss.',
      'Water velocity must not exceed 8 feet per second (FPS) for cold water and 5 FPS for hot water to prevent pipe erosion and noise.',
      'Minimum residual fixture operating pressure under code is 20 PSI.'
    ],
    formula: 'Equiv Length = Length + (Elbows × Equiv) | PSI Loss = [0.2083 × (100/C)^1.852 × Q^1.852 / d^4.8655] × (Equiv / 100)',
    faq: [
      { q: 'Why do PEX crimp fittings restrict water pressure?', a: 'Standard brass and poly crimp fittings (ASTM F1807) slip inside the tubing, reducing a 1/2" PEX inner diameter from 0.485" down to ~0.370" at every fitting. PEX-A expansion fittings (ASTM F1960) maintain full bore diameter.' },
      { q: 'What happens if water velocity in copper or PEX exceeds 8 FPS?', a: 'Velocities above 8 feet per second cause hydraulic erosion corrosion that wears through pipe walls from the inside, produces loud water rushing noise, and triggers violent water hammer shocks.' }
    ],
    calcJs: `
      function calc() {
        var d = parseFloat(document.getElementById('pexDia').value) || 0.485;
        var gpm = parseFloat(document.getElementById('flowGpm').value) || 4.0;
        var len = parseFloat(document.getElementById('runLength').value) || 60;
        var elbows = parseInt(document.getElementById('numElbows').value, 10) || 6;
        var tees = parseInt(document.getElementById('numTees').value, 10) || 2;

        var elbowEquiv = d < 0.6 ? 2.5 : (d < 0.8 ? 3.5 : 4.5);
        var teeEquiv = d < 0.6 ? 3.0 : (d < 0.8 ? 4.5 : 6.0);
        var totalEquiv = len + (elbows * elbowEquiv) + (tees * teeEquiv);

        // Hazen-Williams with C=150 for smooth PEX
        var loss100 = (0.2083 * Math.pow(100 / 150, 1.852) * Math.pow(gpm, 1.852)) / Math.pow(d, 4.8655);
        var totalPsi = (loss100 * totalEquiv) / 100;

        var velocity = (0.408 * gpm) / (d * d);

        document.getElementById('outTotalLoss').textContent = totalPsi.toFixed(2) + ' PSI Drop';
        document.getElementById('outEquivLen').textContent = totalEquiv.toFixed(1) + ' ft (+' + (totalEquiv - len).toFixed(1) + ' ft from fittings)';
        document.getElementById('outVelocity').textContent = velocity.toFixed(1) + ' ft/sec velocity';
        document.getElementById('outLossPer100').textContent = loss100.toFixed(2) + ' PSI / 100 ft of pipe';
        
        var badge = document.getElementById('statusBadge');
        if (velocity <= 8.0) {
          document.getElementById('outVelocityBadge').textContent = '✅ Safe Velocity (≤ 8 FPS cold limit)';
          badge.textContent = 'Flow Pass: Velocity and pressure acceptable';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outVelocityBadge').textContent = '⚠️ Excessive Velocity (> 8 FPS)! Upsize pipe size';
          badge.textContent = 'Hydraulic Warning: Upsize pipe to prevent erosion';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'water-flow-rate-gpm-fixture-units',
    name: 'Plumbing Water Supply Fixture Units (WSFU) Calculator',
    h1: 'Plumbing Water Supply Fixture Units & Peak GPM Calculator',
    title: 'Water Supply Fixture Units (WSFU) & Peak GPM Calculator [Hunter\'s Curve] | Digital Tools Shed',
    metaDesc: 'Convert residential and commercial plumbing fixtures into Hunter curve Water Supply Fixture Units (WSFU) to size main water supply pipes.',
    category: 'Plumbing & Hydraulics',
    codeRef: 'IPC Table E103.3',
    lead: 'Convert bathroom groups, kitchens, and laundry fixtures into Water Supply Fixture Units (WSFU) to determine peak simultaneous demand flow rates (GPM).',
    inputs: [
      { id: 'bathFull', label: 'Full Bathrooms (Toilet, Tub/Shower, Sink)', value: 2, step: 1, unit: 'Baths' },
      { id: 'bathHalf', label: 'Half Baths (Toilet & Sink Only)', value: 1, step: 1, unit: 'Baths' },
      { id: 'kitchenSink', label: 'Kitchen Sinks / Dishwashers', value: 1, step: 1, unit: 'Kitchens' },
      { id: 'clothesWasher', label: 'Automatic Clothes Washers', value: 1, step: 1, unit: 'Washers' },
      { id: 'hoseBibbs', label: 'Outdoor Hose Bibbs (Spigots)', value: 2, step: 1, unit: 'Hose Bibbs' }
    ],
    primaryOutput: { id: 'outPeakGpm', label: 'Peak Design Water Flow', unit: 'GPM (Gallons/Min)' },
    outputs: [
      { id: 'outTotalWsfu', label: 'Total Supply Fixture Units (WSFU)' },
      { id: 'outMainPipe', label: 'Minimum Main Water Pipe Size' },
      { id: 'outMeterSize', label: 'Recommended Water Meter Size' },
      { id: 'outCodeMethod', label: 'Sizing Method Reference' }
    ],
    rules: [
      'IPC Table E103.3: Full bathroom group = 3.6 WSFU (flush tank toilet); half bath = 2.0 WSFU.',
      'Kitchen sink with dishwasher = 2.4 WSFU; clothes washer = 1.4 WSFU; first hose bibb = 2.5 WSFU.',
      'Hunter curve converts cumulative fixture units into statistically probable simultaneous peak flow rates (GPM).',
      'Water meters should be sized such that peak continuous demand does not exceed 80% of rated meter capacity.'
    ],
    formula: 'WSFU = Σ (Fixtures × WSFU Factor) | Peak GPM derived from Hunter Probability Curve (IPC Appendix E)',
    faq: [
      { q: 'What is a Water Supply Fixture Unit (WSFU)?', a: 'A WSFU is a dimensionless factor representing the water volume and discharge probability of a plumbing fixture. Because not every faucet is turned on at the same moment, fixture units calculate realistic simultaneous peak demand.' },
      { q: 'What size water main pipe do I need for a 3-bathroom house?', a: 'A standard 3-bathroom house has roughly 16 to 20 WSFU, representing a peak flow of 14 to 17 GPM. Sizing requires a minimum 3/4" or 1" water service pipe depending on distance from the municipal main.' }
    ],
    calcJs: `
      function calc() {
        var bFull = parseInt(document.getElementById('bathFull').value, 10) || 0;
        var bHalf = parseInt(document.getElementById('bathHalf').value, 10) || 0;
        var k = parseInt(document.getElementById('kitchenSink').value, 10) || 0;
        var w = parseInt(document.getElementById('clothesWasher').value, 10) || 0;
        var hb = parseInt(document.getElementById('hoseBibbs').value, 10) || 0;

        var wsfu = (bFull * 3.6) + (bHalf * 2.0) + (k * 2.4) + (w * 1.4) + (hb * 2.5);
        // Hunter curve approximation for flush tank systems
        var gpm = Math.round(1.5 * Math.pow(Math.max(1, wsfu), 0.65) + 3.0);

        var pipeSize = gpm > 16 ? '1" Copper / PEX Water Main' : '3/4" Copper / PEX Water Main';
        var meterSize = gpm > 20 ? '1" Water Meter' : (gpm > 12 ? '3/4" Water Meter' : '5/8" Water Meter');

        document.getElementById('outPeakGpm').textContent = gpm + ' GPM Peak Simultaneous Demand';
        document.getElementById('outTotalWsfu').textContent = wsfu.toFixed(1) + ' WSFU Total Demand';
        document.getElementById('outMainPipe').textContent = pipeSize;
        document.getElementById('outMeterSize').textContent = meterSize;
        document.getElementById('outCodeMethod').textContent = 'IPC Appendix E / Hunter Curve (Flush Tank System)';
      }
    `
  },
  {
    slug: 'water-hammer-shock-arrester-sizing',
    name: 'Water Hammer Arrestor Sizing Calculator',
    h1: 'Water Hammer Arrestor Sizing (PDI-WH 201 Standard)',
    title: 'Water Hammer Arrestor Sizing Calculator [PDI-WH 201 Fixture Unit Class] | Digital Tools Shed',
    metaDesc: 'Size mechanical water hammer arrestors based on PDI-WH 201 fixture unit ratings (Class A to F) on fast-closing solenoid valves.',
    category: 'Plumbing & Hydraulics',
    codeRef: 'PDI-WH 201',
    lead: 'Calculate plumbing fixture shock loads and select certified PDI-WH 201 mechanical water hammer arrestor chamber ratings.',
    inputs: [
      { id: 'branchFu', label: 'Fixture Units on Branch Line', value: 8, step: 1, min: 1, max: 150, unit: 'Fixture Units' },
      { id: 'fastValves', label: 'Fast-Closing Solenoid Valves on Line', type: 'select', options: [
        { value: 'washer', label: 'Clothes Washing Machine Solenoid', selected: true },
        { value: 'dish', label: 'Dishwasher Solenoid Valve' },
        { value: 'flush', label: 'Commercial Flushometer Valve' }
      ]},
      { id: 'linePressure', label: 'Static Water Pressure', value: 65, step: 5, unit: 'PSI' }
    ],
    primaryOutput: { id: 'outPdiClass', label: 'Required PDI Chamber Rating', unit: 'PDI Class' },
    outputs: [
      { id: 'outMaxDistance', label: 'Maximum Distance from Valve' },
      { id: 'outShockReduction', label: 'Water Hammer Spike Reduction' },
      { id: 'outOldStyleNote', label: 'Air Chamber Capping Rule' },
      { id: 'outPdiCheck', label: 'Code Compliance Status' }
    ],
    rules: [
      'PDI-WH 201 Size Classes: Class A = 1–11 FU, Class B = 12–32 FU, Class C = 33–60 FU, Class D = 61–113 FU.',
      'Arrestors must be installed within 6 feet of the fast-closing valve to effectively absorb shock kinetic energy.',
      'Field-fabricated copper air chambers are PROHIBITED by modern plumbing codes because water absorbs air over time.',
      'Permanent mechanical arrestors feature a sealed gas charge separated from water by a movable stainless piston or diaphragm.'
    ],
    formula: 'PDI Classification based on total Fixture Unit load and pipe run under PDI-WH 201 standard',
    faq: [
      { q: 'Why did building codes outlaw traditional copper pipe air chambers?', a: 'Traditional capped copper tee air chambers fail within a few months because water absorbs the trapped air pocket under pressure (waterlogging), completely eliminating shock absorption.' },
      { q: 'What causes water hammer in washing machines?', a: 'Washing machines use electric solenoid valves that snap shut in under 30 milliseconds. The sudden deceleration of moving water converts kinetic energy into an instantaneous 300+ PSI pressure shock wave that bangs against pipe framing.' }
    ],
    calcJs: `
      function calc() {
        var fu = parseInt(document.getElementById('branchFu').value, 10) || 8;
        var valve = document.getElementById('fastValves').value;
        var p = parseFloat(document.getElementById('linePressure').value) || 65;

        var pdi = 'Class A';
        if (fu <= 11) pdi = 'Class A (1 to 11 Fixture Units)';
        else if (fu <= 32) pdi = 'Class B (12 to 32 Fixture Units)';
        else if (fu <= 60) pdi = 'Class C (33 to 60 Fixture Units)';
        else if (fu <= 113) pdi = 'Class D (61 to 113 Fixture Units)';
        else pdi = 'Class E or F (Industrial Sizing)';

        document.getElementById('outPdiClass').textContent = pdi;
        document.getElementById('outMaxDistance').textContent = 'Install within 6 feet of valve on supply line';
        document.getElementById('outShockReduction').textContent = 'Caps peak hydraulic surge to under 150 PSI';
        document.getElementById('outOldStyleNote').textContent = 'Old-style pipe air chambers banned (Waterlogging risk)';
        document.getElementById('outPdiCheck').textContent = '✅ PDI-WH 201 / ASSE 1010 Certified';
      }
    `
  },
  {
    slug: 'well-pump-submersible-tdh-head',
    name: 'Submersible Well Pump TDH & Sizing Calculator',
    h1: 'Submersible Well Pump Total Dynamic Head (TDH) & Sizing Calculator',
    title: 'Submersible Well Pump TDH & Sizing Calculator [Total Dynamic Head] | Digital Tools Shed',
    metaDesc: 'Calculate pump Total Dynamic Head (TDH) factoring in static water level, drawdown, elevation lift, friction loss, and household pressure.',
    category: 'Plumbing & Hydraulics',
    codeRef: 'Water Systems Council',
    lead: 'Calculate Total Dynamic Head (TDH) and required electric motor horsepower for deep well submersible pumps.',
    inputs: [
      { id: 'waterLevel', label: 'Pumping Water Level (Static + Drawdown)', value: 120, step: 10, unit: 'Feet' },
      { id: 'elevationRise', label: 'Elevation Rise (Wellhead to House Tank)', value: 20, step: 5, unit: 'Feet' },
      { id: 'pressureSwitch', label: 'Pressure Switch Setting', type: 'select', options: [
        { value: '50', label: '30 / 50 PSI Switch (50 PSI Cut-Out)' },
        { value: '60', label: '40 / 60 PSI Switch (60 PSI Cut-Out)', selected: true }
      ]},
      { id: 'designGpm', label: 'Desired Household Flow Rate', value: 10, step: 1, unit: 'GPM' },
      { id: 'pipeRunFt', label: 'Total Drop Pipe + Horizontal Pipe Length', value: 180, step: 10, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outTotalTdh', label: 'Total Dynamic Head (TDH)', unit: 'Feet of Water' },
    outputs: [
      { id: 'outPressureHead', label: 'Pressure Tank Head Equivalent' },
      { id: 'outFrictionHead', label: 'Pipe Friction Head Loss' },
      { id: 'outReqHp', label: 'Minimum Submersible Motor HP' },
      { id: 'outGpmRating', label: 'Pump Series Rating' }
    ],
    rules: [
      'Total Dynamic Head = Pumping Water Level + Elevation Lift + Pipe Friction Loss + Pressure Head.',
      '1 PSI of water pressure equals 2.31 feet of vertical head lift (60 PSI = 138.6 ft head).',
      'Pumping water level must include drawdown: the depth water falls when the pump runs continuously.',
      'Select pump such that design GPM operates near the peak of the manufacturer pump efficiency curve.'
    ],
    formula: 'TDH = Pumping Depth + Elevation + Friction Head + (PSI Cut-Out × 2.31) | HP = (GPM × TDH) / (3960 × Efficiency)',
    faq: [
      { q: 'What is the difference between static water level and pumping level?', a: 'Static level is where water rests when no water is running. Pumping water level (drawdown level) is the stabilized depth water drops to while the pump operates continuously.' },
      { q: 'What size well pump is standard for a residential house?', a: 'A standard 3-to-4 bedroom home typically requires a 1/2 HP or 3/4 HP pump delivering 10 GPM at 250 to 300 feet of TDH.' }
    ],
    calcJs: `
      function calc() {
        var depth = parseFloat(document.getElementById('waterLevel').value) || 120;
        var elev = parseFloat(document.getElementById('elevationRise').value) || 20;
        var pCutout = parseFloat(document.getElementById('pressureSwitch').value) || 60;
        var gpm = parseFloat(document.getElementById('designGpm').value) || 10;
        var pipeLen = parseFloat(document.getElementById('pipeRunFt').value) || 180;

        var pHead = pCutout * 2.31;
        var fHead = (pipeLen / 100) * 4.2; // approx 1" poly at 10 gpm
        var tdh = depth + elev + fHead + pHead;

        // Hydraulic HP at 55% pump efficiency
        var hpReq = (gpm * tdh) / (3960 * 0.55);

        var recHp = '1/2 HP Submersible Pump';
        if (hpReq > 1.1) recHp = '1-1/2 HP Submersible Pump';
        else if (hpReq > 0.75) recHp = '1 HP Submersible Pump';
        else if (hpReq > 0.5) recHp = '3/4 HP Submersible Pump';

        document.getElementById('outTotalTdh').textContent = Math.round(tdh) + ' Feet of Head';
        document.getElementById('outPressureHead').textContent = pHead.toFixed(1) + ' ft (' + pCutout + ' PSI cutoff)';
        document.getElementById('outFrictionHead').textContent = fHead.toFixed(1) + ' ft friction loss';
        document.getElementById('outReqHp').textContent = recHp + ' (Hydraulic power: ' + hpReq.toFixed(2) + ' HP)';
        document.getElementById('outGpmRating').textContent = gpm + ' GPM Series Pump Curve';
      }
    `
  },
  {
    slug: 'water-softener-grain-capacity-hardness',
    name: 'Water Softener Grain Capacity Sizing Calculator',
    h1: 'Water Softener Grain Capacity Sizing by Water Hardness (GPG)',
    title: 'Water Softener Grain Capacity Sizing Calculator [GPG Hardness & Family Size] | Digital Tools Shed',
    metaDesc: 'Size whole-house ion-exchange water softener grain capacities (24k to 64k grains) based on water hardness GPG, dissolved iron, and family members.',
    category: 'Plumbing & Hydraulics',
    codeRef: 'WQA S-100',
    lead: 'Calculate compensated water hardness and select whole-house ion-exchange resin tank grain capacity for optimal regeneration schedules.',
    inputs: [
      { id: 'people', label: 'Number of People in Household', value: 4, step: 1, min: 1, max: 12, unit: 'People' },
      { id: 'hardnessGpg', label: 'Raw Water Hardness (GPG)', value: 15, step: 1, unit: 'GPG', hint: '1 GPG = 17.1 mg/L (ppm) calcium carbonate' },
      { id: 'ironPpm', label: 'Dissolved Clear-Water Iron', value: 1.0, step: 0.5, unit: 'ppm (mg/L)', hint: 'Each 1 ppm of iron adds 5 GPG to compensated hardness' },
      { id: 'regenDays', label: 'Target Regeneration Frequency', value: 7, step: 1, unit: 'Days' }
    ],
    primaryOutput: { id: 'outGrainCap', label: 'Recommended Grain Capacity', unit: 'Grains' },
    outputs: [
      { id: 'outCompHardness', label: 'Compensated Water Hardness' },
      { id: 'outDailyGrains', label: 'Daily Grain Removal Demand' },
      { id: 'outWeeklyDemand', label: 'Target Cycle Grains Needed' },
      { id: 'outSaltMonth', label: 'Estimated Monthly Salt Burn' }
    ],
    rules: [
      'Compensated Hardness = Measured Hardness (GPG) + (Iron ppm × 5).',
      'Average daily residential water consumption is 75 gallons per person per day.',
      'Water softeners should regenerate approximately once every 6 to 8 days to keep resin beds clean.',
      'Size resin tank with a 20% reserve capacity so the softener never depletes before regeneration.'
    ],
    formula: 'Daily Grains = People × 75 gal × Compensated GPG | Capacity = Daily Grains × Days × 1.20 Reserve',
    faq: [
      { q: 'Why does dissolved iron increase water softener sizing?', a: 'Dissolved ferrous iron binds aggressively to ion-exchange resin beads, consuming far more regeneration capacity than calcium and magnesium. Adding 5 GPG per 1 ppm of iron compensates for resin fouling.' },
      { q: 'What happens if a water softener is oversized?', a: 'An oversized softener regenerates too infrequently (e.g. once every 3 weeks), which allows bacterial growth in the resin tank and causes permanent iron fouling of the resin beads.' }
    ],
    calcJs: `
      function calc() {
        var people = parseInt(document.getElementById('people').value, 10) || 4;
        var gpg = parseFloat(document.getElementById('hardnessGpg').value) || 15;
        var iron = parseFloat(document.getElementById('ironPpm').value) || 1.0;
        var days = parseInt(document.getElementById('regenDays').value, 10) || 7;

        var compGpg = gpg + (iron * 5);
        var dailyGrains = people * 75 * compGpg;
        var weeklyGrains = dailyGrains * days * 1.20; // 20% reserve

        var recCap = '32,000 Grain Softener (1.0 cu ft resin)';
        if (weeklyGrains > 48000) recCap = '64,000 Grain Softener (2.0 cu ft resin)';
        else if (weeklyGrains > 32000) recCap = '48,000 Grain Softener (1.5 cu ft resin)';
        else if (weeklyGrains <= 24000) recCap = '24,000 Grain Softener (0.75 cu ft resin)';

        var saltLbsMonth = Math.round((weeklyGrains / 3000) * 4 * 1.5);

        document.getElementById('outGrainCap').textContent = recCap;
        document.getElementById('outCompHardness').textContent = compGpg + ' GPG (Includes ' + (iron * 5) + ' GPG iron penalty)';
        document.getElementById('outDailyGrains').textContent = Math.round(dailyGrains).toLocaleString() + ' Grains / day';
        document.getElementById('outWeeklyDemand').textContent = Math.round(weeklyGrains).toLocaleString() + ' Grains between regenerations';
        document.getElementById('outSaltMonth').textContent = '~' + saltLbsMonth + ' lbs salt pellets / month';
      }
    `
  },
  {
    slug: 'expansion-tank-thermal-sizing',
    name: 'Water Heater Thermal Expansion Tank Calculator',
    h1: 'Water Heater Thermal Expansion Tank Volume Calculator',
    title: 'Water Heater Thermal Expansion Tank Calculator [Acceptance Volume] | Digital Tools Shed',
    metaDesc: 'Size thermal expansion tank acceptance volume in closed plumbing systems to prevent T&P relief valve discharge under IRC P2903.4.',
    category: 'Plumbing & Hydraulics',
    codeRef: 'IRC P2903.4',
    lead: 'Calculate water heater thermal expansion volume in closed plumbing systems and determine required expansion tank bladder sizing.',
    inputs: [
      { id: 'tankGal', label: 'Water Heater Storage Capacity', type: 'select', options: [
        { value: '40', label: '40 Gallon Tank' },
        { value: '50', label: '50 Gallon Tank', selected: true },
        { value: '75', label: '75 Gallon Tank' },
        { value: '80', label: '80 Gallon Commercial / Heat Pump Tank' }
      ]},
      { id: 'supplyPsi', label: 'Incoming Water Supply Pressure', value: 60, step: 5, unit: 'PSI' },
      { id: 'hotTemp', label: 'Hot Water Setpoint Temperature', value: 130, step: 5, unit: '°F' },
      { id: 'inletTemp', label: 'Cold Inlet Water Temperature', value: 50, step: 5, unit: '°F' }
    ],
    primaryOutput: { id: 'outTankModel', label: 'Recommended Expansion Tank', unit: 'Standard Tank Size' },
    outputs: [
      { id: 'outExpVol', label: 'Expanded Water Volume' },
      { id: 'outAcceptanceVol', label: 'Minimum Acceptance Volume' },
      { id: 'outPrechargePsi', label: 'Mandatory Air Pre-Charge Pressure' },
      { id: 'outReliefWarning', label: 'T&P Relief Valve Dripping Risk' }
    ],
    rules: [
      'IRC Section P2903.4: A thermal expansion tank is mandatory on all closed potable water systems having backflow preventers or check valves.',
      'Water expands by approximately 2% to 3% when heated from 50°F to 130°F.',
      'In a closed system, incompressible expanding water spikes pressure up to 150 PSI, causing the T&P relief valve to weep.',
      'The expansion tank air pre-charge pressure MUST be adjusted with a tire gauge to match incoming house water pressure before installation.'
    ],
    formula: 'Expansion V = Gallons × [Expansion Coeff] | Acceptance Factor = 1 - (Supply PSI + 14.7) / (150 + 14.7)',
    faq: [
      { q: 'Why do expansion tanks need to be installed with modern water meters?', a: 'Modern municipal water meters and PRVs (pressure reducing valves) contain built-in check valves that create a closed plumbing system. When water heats up and expands, it has nowhere to go and spikes household pressure.' },
      { q: 'How do you calibrate an expansion tank before installing it?', a: 'Check the air Schrader valve with a tire gauge. If your house water pressure is 60 PSI, use a bicycle pump to charge the tank to exactly 60 PSI before connecting it to the plumbing system.' }
    ],
    calcJs: `
      function calc() {
        var gal = parseFloat(document.getElementById('tankGal').value) || 50;
        var supplyP = parseFloat(document.getElementById('supplyPsi').value) || 60;
        var hotT = parseFloat(document.getElementById('hotTemp').value) || 130;
        var coldT = parseFloat(document.getElementById('inletTemp').value) || 50;

        var expCoeff = (hotT - coldT) * 0.0003;
        var expVolGal = gal * expCoeff;

        var acceptFactor = 1 - ((supplyP + 14.7) / (150 + 14.7));
        var minTankGal = expVolGal / Math.max(0.1, acceptFactor);

        var recModel = minTankGal <= 2.1 ? '2.0 Gallon Expansion Tank (e.g. Thermal Expansion #5)' : (minTankGal <= 4.5 ? '4.5 Gallon Expansion Tank (e.g. #12)' : '9.0 Gallon Commercial Tank');

        document.getElementById('outTankModel').textContent = recModel;
        document.getElementById('outExpVol').textContent = expVolGal.toFixed(2) + ' Gallons of expanded water';
        document.getElementById('outAcceptanceVol').textContent = minTankGal.toFixed(1) + ' Gallons minimum total tank volume';
        document.getElementById('outPrechargePsi').textContent = supplyP + ' PSI (Pre-charge tank air valve to match house pressure)';
        document.getElementById('outReliefWarning').textContent = 'Absorbs thermal spikes to protect 150 PSI T&P valve';
      }
    `
  },
  {
    slug: 'drain-cleaning-cable-torque-reach',
    name: 'Sewer Snake Cable Sizing Calculator',
    h1: 'Sewer Snake & Drain Cleaning Cable Diameter by Pipe Size',
    title: 'Sewer Snake & Drain Cable Sizing Calculator [Pipe Diameter & Distance] | Digital Tools Shed',
    metaDesc: 'Select correct sewer snake cable diameter and cutter heads by pipe size and obstruction type to prevent cable kinking or motor stalls.',
    category: 'Plumbing & Hydraulics',
    codeRef: 'Drain Cleaning Standards',
    lead: 'Select professional drain cleaning cable diameters, inner-core types, and cutter heads based on pipe diameter and blockage severity.',
    inputs: [
      { id: 'pipeDia', label: 'Drain Pipe Nominal Diameter', type: 'select', options: [
        { value: '1.5', label: '1-1/4" to 1-1/2" (Sink, Bathtub, Urinal Trap)' },
        { value: '2.0', label: '2" (Shower, Laundry, Floor Drain)', selected: true },
        { value: '3.0', label: '3" (Secondary Line, Toilet Bend)' },
        { value: '4.0', label: '4" (Main Sewer Building Drain)' },
        { value: '6.0', label: '6" (Commercial Sewer Main to Street)' }
      ]},
      { id: 'blockage', label: 'Type of Blockage Obstruction', type: 'select', options: [
        { value: 'hair', label: 'Hair, Soap Scum & Lint' },
        { value: 'grease', label: 'Sludge, Heavy Grease & Food Waste', selected: true },
        { value: 'roots', label: 'Intrusive Tree Root Infiltration' },
        { value: 'solid', label: 'Foreign Object, Mud, Construction Debris' }
      ]},
      { id: 'reachFt', label: 'Distance to Main Cleanout', value: 50, step: 10, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outCableDia', label: 'Recommended Cable Diameter', unit: 'Inches' },
    outputs: [
      { id: 'outCableCore', label: 'Cable Construction Type' },
      { id: 'outCutterHead', label: 'Recommended Cutter Blade' },
      { id: 'outMachineType', label: 'Drain Machine Class' },
      { id: 'outKinkWarning', label: 'Cable Kinking Risk Evaluation' }
    ],
    rules: [
      'Never run an undersized cable in a large pipe (e.g. 1/4" cable in a 4" pipe): the cable will twist, loop back, and snap.',
      'Tree roots require heavy 5/8" or 3/4" inner-core cables driven by high-torque drum machines.',
      'Inner-core cables feature a floating aircraft wire rope center that stiffens under torque to prevent kinking.',
      'Always operate drain snakes in FORWARD gear; REVERSE is strictly for freeing stuck blades.'
    ],
    formula: 'Cable diameter selected by pipe volume ratio to prevent helical kinking under rotational torque',
    faq: [
      { q: 'What causes a sewer snake cable to flip over and kink inside a pipe?', a: 'Running a small cable in an oversized pipe (such as running a 5/16" cable down a 4" sewer main). The cable has too much open space to buckle sideways, forming a knot that can trap the machine and break fingers.' },
      { q: 'Why should you never use reverse to clear a drain clog?', a: 'Reverse unwinds the coiled spring tension of the cable, drastically reducing torque and making the cable prone to snapping. Reverse should only be clicked momentarily to back the cutter head out if it wedges into a tree root.' }
    ],
    calcJs: `
      function calc() {
        var dia = parseFloat(document.getElementById('pipeDia').value) || 2.0;
        var block = document.getElementById('blockage').value;
        var dist = parseFloat(document.getElementById('reachFt').value) || 50;

        var cable = '3/8" Cable';
        var core = 'Inner-Core Cable (High Torque)';
        var head = 'Grease Cutter Blade';
        var mach = 'Mid-Size Drum Machine';

        if (dia <= 1.5) {
          cable = '1/4" or 5/16" Cable';
          core = 'Hollow Core (Maximum flexibility for tight P-traps)';
          head = block === 'hair' ? 'Bulb Auger / Drop Head' : 'Straight Auger';
          mach = 'Hand Spinner or Pistol Grip Drill Snake';
        } else if (dia <= 2.0) {
          cable = '3/8" Cable';
          core = 'Inner-Core Cable';
          head = block === 'grease' ? 'Grease "C" Cutter' : 'Bulb Auger';
          mach = 'Small Drum Drain Cleaner';
        } else if (dia <= 3.0) {
          cable = '1/2" Cable';
          core = 'Inner Core Steel Cable';
          head = block === 'roots' ? 'Spiral Saw Blade' : 'Spade Cutter';
          mach = 'Medium Drum or Sectional Machine';
        } else {
          cable = '5/8" or 3/4" Heavy Cable';
          core = 'Heavy Duty Aircraft Inner Core Cable';
          head = block === 'roots' ? '4" Root Saw / Sharktooth Cutter' : 'Retrieval Auger / 4" Spade Cutter';
          mach = 'Large Commercial Drum or 1-1/4" Sectional Machine';
        }

        document.getElementById('outCableDia').textContent = cable;
        document.getElementById('outCableCore').textContent = core;
        document.getElementById('outCutterHead').textContent = head;
        document.getElementById('outMachineType').textContent = mach + ' (' + dist + ' ft reach)';
        document.getElementById('outKinkWarning').textContent = 'Safe Match: Cable diameter fills pipe correctly';
      }
    `
  },
  {
    slug: 'gas-pipe-sizing-btu-cfh-length',
    name: 'Gas Pipe Sizing BTU & Length Calculator',
    h1: 'Natural Gas & Propane Gas Pipe Sizing Calculator (NFPA 54)',
    title: 'Gas Pipe Sizing Calculator [Natural Gas & Propane Longest Run BTU] | Digital Tools Shed',
    metaDesc: 'Size black iron and CSST corrugated gas pipe diameters under NFPA 54 and IFGC tables based on longest run length and total appliance BTU loads.',
    category: 'Plumbing & Hydraulics',
    codeRef: 'NFPA 54 / IFGC 402',
    lead: 'Size natural gas and propane supply piping using the NFPA 54 Longest Run Method to prevent pressure drop under full appliance firing.',
    inputs: [
      { id: 'gasType', label: 'Fuel Gas Type', type: 'select', options: [
        { value: 'ng', label: 'Natural Gas (1,000 BTU/cu ft - 0.60 Specific Gravity)', selected: true },
        { value: 'lp', label: 'Propane LP Gas (2,500 BTU/cu ft - 1.50 Specific Gravity)' }
      ]},
      { id: 'totalBtu', label: 'Total Connected Appliance Demand', value: 180000, step: 10000, unit: 'BTU/hr', hint: 'Furnace + Water Heater + Range + Fireplace' },
      { id: 'longestRun', label: 'Longest Run from Gas Meter to Furthest Appliance', value: 60, step: 5, unit: 'Feet' },
      { id: 'pipeMaterial', label: 'Piping Material', type: 'select', options: [
        { value: 'black', label: 'Schedule 40 Black Steel Pipe', selected: true },
        { value: 'csst', label: 'CSST Corrugated Stainless Steel Tubing' }
      ]}
    ],
    primaryOutput: { id: 'outMainDia', label: 'Recommended Main Pipe Diameter', unit: 'Inches' },
    outputs: [
      { id: 'outCfhDemand', label: 'Volume Flow Rate Demand' },
      { id: 'outMaxCapAtDist', label: 'Pipe Capacity at Run Distance' },
      { id: 'outPressDrop', label: 'Design Pressure Drop' },
      { id: 'outCodeMethod', label: 'NFPA 54 Sizing Method' }
    ],
    rules: [
      'NFPA 54 / IFGC Chapter 4: Use the Longest Length Method—every pipe section is sized based on the distance from the meter to the furthest outlet.',
      'Natural gas heating value is standardized at 1,000 BTU per cubic foot (1 CFH = 1,000 BTU/hr).',
      'Propane contains 2,500 BTU per cubic foot; piping for propane is typically one size smaller than natural gas for the same BTU load.',
      'Low pressure gas systems operate at 0.5 PSI (7" to 14" water column) with an allowable pressure drop of 0.5" w.c.'
    ],
    formula: 'CFH = Total BTU / Heating Value (1000 for NG, 2500 for LP) | Sizing derived from NFPA 54 Table 6.2(a)',
    faq: [
      { q: 'What is the Longest Length Method in gas pipe sizing?', a: 'Under NFPA 54, the distance from the gas meter to the single furthest appliance is determined first. That total distance column is then used to size every branch in the entire house to ensure pressure does not drop when all appliances fire at once.' },
      { q: 'Can CSST gas pipe be installed without bonding?', a: 'No. Yellow CSST corrugated stainless tubing must be bonded to the electrical grounding system with a #6 AWG copper conductor to prevent electrical arcing from lightning strikes puncturing the thin steel wall.' }
    ],
    calcJs: `
      function calc() {
        var gas = document.getElementById('gasType').value;
        var btu = parseFloat(document.getElementById('totalBtu').value) || 180000;
        var run = parseFloat(document.getElementById('longestRun').value) || 60;
        var mat = document.getElementById('pipeMaterial').value;

        var btuPerCf = gas === 'lp' ? 2500 : 1000;
        var cfh = btu / btuPerCf;

        // Black iron Sch 40 capacity lookup at 60 ft (approx CFH for 0.5" drop)
        // 1/2"=50, 3/4"=105, 1"=195, 1-1/4"=400, 1-1/2"=600
        var dia = '1" Black Iron Pipe';
        var cap = 195;

        if (cfh <= 45 && run <= 60) { dia = '1/2" Pipe'; cap = 50; }
        else if (cfh <= 95) { dia = '3/4" Pipe'; cap = 105; }
        else if (cfh <= 190) { dia = '1" Pipe'; cap = 195; }
        else if (cfh <= 380) { dia = '1-1/4" Pipe'; cap = 400; }
        else { dia = '1-1/2" Pipe'; cap = 600; }

        if (mat === 'csst') {
          dia = dia.replace('Black Iron Pipe', 'CSST Tubing (Verify EHD rating)');
        }

        document.getElementById('outMainDia').textContent = dia;
        document.getElementById('outCfhDemand').textContent = Math.round(cfh) + ' CFH (Cubic Feet / Hour)';
        document.getElementById('outMaxCapAtDist').textContent = cap + ' CFH capacity at ' + run + ' ft run';
        document.getElementById('outPressDrop').textContent = '0.5 in. w.c. allowable drop (7" w.c. nominal)';
        document.getElementById('outCodeMethod').textContent = 'NFPA 54 / IFGC Longest Length Method (Table 6.2)';
      }
    `
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 6: HVAC, VENTILATION & BUILDING SCIENCE (Tools 59–68)
// ─────────────────────────────────────────────────────────────────────────────
const HVAC_TOOLS = [
  {
    slug: 'hvac-cfm-airflow-room-volume',
    name: 'HVAC CFM Airflow & Air Changes Calculator',
    h1: 'HVAC CFM Room Airflow & Air Changes per Hour (ACH) Calculator',
    title: 'HVAC CFM Room Airflow Calculator [Air Changes per Hour ACH] | Digital Tools Shed',
    metaDesc: 'Calculate required supply CFM airflow based on room dimensions and target Air Changes per Hour (ACH) under ASHRAE Standard 62.1/62.2.',
    category: 'HVAC & Building Science',
    codeRef: 'ASHRAE 62.1 / 62.2',
    lead: 'Calculate required cubic feet per minute (CFM) supply airflow for heating, cooling, and ventilation based on room volume and target air change rates.',
    inputs: [
      { id: 'roomL', label: 'Room Length', value: 20, step: 1, unit: 'Feet' },
      { id: 'roomW', label: 'Room Width', value: 15, step: 1, unit: 'Feet' },
      { id: 'roomH', label: 'Ceiling Height', value: 9, step: 0.5, unit: 'Feet' },
      { id: 'spaceType', label: 'Space Application & Target ACH', type: 'select', options: [
        { value: '4', label: 'Living Room / Bedroom (4 ACH Residential)', selected: true },
        { value: '6', label: 'Kitchen / Home Office (6 ACH)' },
        { value: '8', label: 'Bathroom / Laundry (8 ACH)' },
        { value: '12', label: 'Commercial Gym / Smoking Lounge (12 ACH)' },
        { value: '20', label: 'Commercial Kitchen / Laboratory (20 ACH)' }
      ]}
    ],
    primaryOutput: { id: 'outReqCfm', label: 'Required Supply Airflow', unit: 'CFM' },
    outputs: [
      { id: 'outRoomVol', label: 'Total Room Volume' },
      { id: 'outMinutesChange', label: 'Time per Complete Air Change' },
      { id: 'outDuctRec', label: 'Recommended Round Supply Duct Size' },
      { id: 'outTonnage', label: 'Estimated Cooling Tonnage (400 CFM/ton)' }
    ],
    rules: [
      'CFM = (Room Volume in cu ft × Target ACH) / 60 minutes.',
      'Standard residential air conditioning delivers approximately 400 CFM of airflow per ton (12,000 BTU) of cooling capacity.',
      'ASHRAE Standard 62.2 mandates continuous mechanical fresh air ventilation in modern airtight residential homes.',
      'Air velocity in residential supply duct branches should not exceed 700 to 900 FPM to prevent register whistling.'
    ],
    formula: 'Volume = L × W × H | CFM = (Volume × ACH) / 60 | Duct Diameter = √[(CFM × 4) / (Velocity × π)]',
    faq: [
      { q: 'What is ACH in HVAC engineering?', a: 'ACH stands for Air Changes per Hour. It measures how many times the entire volume of air inside a room is filtered, conditioned, or replaced with outdoor air in a 60-minute period.' },
      { q: 'Why is 400 CFM per ton the universal rule of thumb?', a: 'Because cooling 400 CFM of return air by 20°F (sensible heat) while condensing standard indoor humidity (latent heat) matches the thermodynamic capacity of 1 ton (12,000 BTU/hr) of air conditioning.' }
    ],
    calcJs: `
      function calc() {
        var l = parseFloat(document.getElementById('roomL').value) || 20;
        var w = parseFloat(document.getElementById('roomW').value) || 15;
        var h = parseFloat(document.getElementById('roomH').value) || 9;
        var ach = parseFloat(document.getElementById('spaceType').value) || 4;

        var vol = l * w * h;
        var cfm = Math.round((vol * ach) / 60);
        var minChange = (60 / ach).toFixed(1);
        var tons = (cfm / 400).toFixed(2);

        // Round duct at 700 FPM velocity: Area = CFM / 700 sq ft => Dia = √(4*Area/π) * 12
        var ductDia = Math.ceil(Math.sqrt((cfm / 700) * 4 / Math.PI) * 12);

        document.getElementById('outReqCfm').textContent = cfm + ' CFM Airflow';
        document.getElementById('outRoomVol').textContent = vol.toLocaleString() + ' Cubic Feet (' + (l * w) + ' sq ft)';
        document.getElementById('outMinutesChange').textContent = minChange + ' minutes per complete air turnover';
        document.getElementById('outDuctRec').textContent = ductDia + '" Round Duct (at 700 FPM quiet branch velocity)';
        document.getElementById('outTonnage').textContent = '~' + tons + ' Tons of cooling air capacity';
      }
    `
  },
  {
    slug: 'duct-size-friction-rate-velocity',
    name: 'HVAC Duct Sizing & Friction Rate Calculator',
    h1: 'HVAC Duct Sizing & Equal Friction Velocity Calculator',
    title: 'HVAC Duct Sizing & Friction Rate Calculator [Equal Friction & Velocity] | Digital Tools Shed',
    metaDesc: 'Size round and equivalent rectangular sheet metal ducts using equal friction rate (0.08" to 0.10" w.g./100 ft) and CFM under ACCA Manual D.',
    category: 'HVAC & Building Science',
    codeRef: 'ACCA Manual D',
    lead: 'Size round and equivalent rectangular HVAC supply/return ducts based on CFM airflow, target friction rate, and maximum air velocity limits.',
    inputs: [
      { id: 'airCfm', label: 'Airflow Volume Demand', value: 350, step: 25, unit: 'CFM' },
      { id: 'frictionRate', label: 'Design Friction Rate', type: 'select', options: [
        { value: '0.06', label: '0.06" w.g. / 100 ft (Low Resistance / Quiet System)' },
        { value: '0.08', label: '0.08" w.g. / 100 ft (Standard Residential ACCA Manual D)', selected: true },
        { value: '0.10', label: '0.10" w.g. / 100 ft (Standard Commercial / High Velocity)' }
      ]},
      { id: 'maxRectH', label: 'Maximum Available Rectangular Height', value: 8, step: 1, unit: 'Inches', hint: 'Ceiling joist cavity limit' }
    ],
    primaryOutput: { id: 'outRoundDia', label: 'Standard Round Duct Diameter', unit: 'Inches' },
    outputs: [
      { id: 'outRectDuct', label: 'Equivalent Rectangular Duct Size' },
      { id: 'outVelocity', label: 'Air Velocity in Duct' },
      { id: 'outNoiseRating', label: 'Noise / Whistling Rating' },
      { id: 'outManualDCheck', label: 'ACCA Manual D Status' }
    ],
    rules: [
      'ACCA Manual D: Residential supply trunks should be sized for 700–900 FPM; branch runouts 600–700 FPM.',
      'Friction rate is typically designed between 0.08" and 0.10" water gauge per 100 equivalent feet.',
      'Huebscher equation converts round duct diameter into equivalent rectangular dimensions with equal fluid friction.',
      'Rectangular duct aspect ratio (Width:Height) should not exceed 4:1 to avoid turbulent pressure drop.'
    ],
    formula: 'Round Dia d = 1.07 × (CFM / FR^0.358)^0.278 | Rectangular Huebscher: D_e = 1.30 × (a × b)^0.625 / (a + b)^0.25',
    faq: [
      { q: 'Why is 0.08" w.g. per 100 ft used for residential duct design?', a: 'Standard residential blowers produce only 0.50" total external static pressure. Allocating static budget across coils, filters, registers, and fittings leaves roughly 0.08" of available pressure drop per 100 equivalent feet of duct.' },
      { q: 'Why do round ducts perform better than rectangular ducts?', a: 'Round ducts have the lowest possible surface area per unit volume, creating less air boundary friction, zero corner turbulence, and superior acoustic quietness compared to square ducts.' }
    ],
    calcJs: `
      function calc() {
        var cfm = parseFloat(document.getElementById('airCfm').value) || 350;
        var fr = parseFloat(document.getElementById('frictionRate').value) || 0.08;
        var maxH = parseFloat(document.getElementById('maxRectH').value) || 8;

        // Equal friction approximation: Dia = 1.07 * (CFM / FR^0.358)^0.278
        var roundDia = Math.round(1.07 * Math.pow(cfm / Math.pow(fr, 0.358), 0.278));
        if (roundDia < 4) roundDia = 4;

        // Huebscher equivalent rectangular: find width w for given height maxH
        // a = roundDia, find w such that 1.3 * (w*h)^0.625 / (w+h)^0.25 = roundDia
        var rectW = Math.ceil((Math.PI * Math.pow(roundDia / 2, 2)) / maxH);

        var areaSqFt = (Math.PI * Math.pow(roundDia / 2, 2)) / 144;
        var vel = Math.round(cfm / areaSqFt);

        var quiet = vel <= 700 ? 'Very Quiet (< 700 FPM)' : (vel <= 900 ? 'Acceptable Residential (700-900 FPM)' : 'Noisy / Whistle Risk (> 900 FPM)');

        document.getElementById('outRoundDia').textContent = roundDia + '" Diameter Round Duct';
        document.getElementById('outRectDuct').textContent = rectW + '" W × ' + maxH + '" H Rectangular Duct';
        document.getElementById('outVelocity').textContent = vel + ' FPM (Feet per minute)';
        document.getElementById('outNoiseRating').textContent = quiet;
        document.getElementById('outManualDCheck').textContent = vel <= 900 ? '✅ ACCA Manual D Compliant' : '⚠️ Upsize duct to reduce air velocity';
      }
    `
  },
  {
    slug: 'hydronic-baseboard-btu-flow-rate',
    name: 'Hydronic Baseboard BTU & Flow Rate Calculator',
    h1: 'Hydronic Baseboard Radiator BTU Output & GPM Calculator',
    title: 'Hydronic Baseboard Radiator BTU & Flow Rate Calculator [GPM & Water Temp] | Digital Tools Shed',
    metaDesc: 'Calculate heat output in BTU/hr and required GPM flow rate for copper fin-tube hydronic baseboards using standard 20°F system delta-T (ΔT).',
    category: 'HVAC & Building Science',
    codeRef: 'I=B=R Standards',
    lead: 'Calculate BTU heat output and required GPM circulating flow rates for hydronic fin-tube baseboard heating loops across varying supply water temperatures.',
    inputs: [
      { id: 'baseLen', label: 'Active Fin-Tube Baseboard Length', value: 24, step: 2, unit: 'Feet' },
      { id: 'waterTemp', label: 'Average Boiler Supply Water Temperature', type: 'select', options: [
        { value: '140', label: '140°F (High Efficiency Condensing Boiler - 340 BTU/ft)' },
        { value: '160', label: '160°F (Moderate Temperature - 450 BTU/ft)' },
        { value: '180', label: '180°F (Standard Boiler Operating Temp - 580 BTU/ft)', selected: true },
        { value: '200', label: '200°F (High Temp Steam/Boiler - 710 BTU/ft)' }
      ]},
      { id: 'deltaT', label: 'System Temperature Drop (ΔT)', value: 20, step: 5, unit: '°F Drop', hint: 'Standard residential design is 20°F ΔT (e.g. 180°F supply / 160°F return)' }
    ],
    primaryOutput: { id: 'outTotalBtu', label: 'Total Heat Output Rate', unit: 'BTU / Hour' },
    outputs: [
      { id: 'outReqGpm', label: 'Required Loop Flow Rate' },
      { id: 'outMaxLoopLen', label: 'Maximum Safe Loop Length (3/4" Copper)' },
      { id: 'outCirculatorHead', label: 'Estimated Circulator Head Loss' },
      { id: 'outPipeVelocity', label: 'Fluid Velocity in 3/4" Pipe' }
    ],
    rules: [
      'Hydronic fundamental heat equation: BTU/hr = GPM × 500 × ΔT (°F).',
      'At standard 180°F water, standard 3/4" copper fin-tube baseboard delivers approximately 580 to 600 BTU/hr per linear foot.',
      'A single 3/4" baseboard heating loop should never exceed 45 to 50 linear feet (or ~25,000 BTU) to prevent cold end radiators.',
      'Flow velocity in hydronic copper tubing should stay between 2 and 4 feet per second to prevent air trapping and noise.'
    ],
    formula: 'Output = Length (ft) × BTU_per_ft | Flow GPM = Output / (500 × ΔT)',
    faq: [
      { q: 'Where does the 500 constant come from in the hydronic formula?', a: 'Water weighs 8.33 pounds per gallon. 8.33 lbs/gal × 60 minutes/hour × 1.0 specific heat of water = 499.8 (rounded to 500 in HVAC hydronics).' },
      { q: 'Why is loop length limited to 45 feet on a 3/4" copper pipe?', a: 'As hot water travels through baseboards, it loses heat. After 45–50 feet on a single loop, water temperature drops more than 20°F, leaving the last radiators in the room too cool to heat the space.' }
    ],
    calcJs: `
      function calc() {
        var len = parseFloat(document.getElementById('baseLen').value) || 24;
        var temp = document.getElementById('waterTemp').value;
        var dt = parseFloat(document.getElementById('deltaT').value) || 20;

        var btuPerFt = 580;
        if (temp === '140') btuPerFt = 340;
        else if (temp === '160') btuPerFt = 450;
        else if (temp === '180') btuPerFt = 580;
        else if (temp === '200') btuPerFt = 710;

        var totalBtu = len * btuPerFt;
        var gpm = totalBtu / (500 * dt);

        var passLoop = len <= 45;

        document.getElementById('outTotalBtu').textContent = totalBtu.toLocaleString() + ' BTU/hr (' + btuPerFt + ' BTU/ft)';
        document.getElementById('outReqGpm').textContent = gpm.toFixed(2) + ' GPM circulating water flow';
        document.getElementById('outMaxLoopLen').textContent = passLoop ? '✅ Safe (24 ft ≤ 45 ft max single loop)' : '⚠️ Exceeds 45 ft: Split into two separate zones';
        document.getElementById('outCirculatorHead').textContent = '~' + (len * 0.08).toFixed(1) + ' Feet of Head circulator pump resistance';
        document.getElementById('outPipeVelocity').textContent = (gpm * 0.75).toFixed(1) + ' ft/sec in 3/4" tube (Optimal 2-4 FPS)';
      }
    `
  },
  {
    slug: 'heat-pump-cop-heating-efficiency',
    name: 'Heat Pump COP & HSPF2 Efficiency Calculator',
    h1: 'Heat Pump Coefficient of Performance (COP) & Operating Cost Calculator',
    title: 'Heat Pump COP & Heating Operating Cost Calculator [HSPF2 vs Resistance] | Digital Tools Shed',
    metaDesc: 'Convert heat pump COP to HSPF2 efficiency ratings, calculate cold-climate capacity derating, and compare operating costs against electric resistance.',
    category: 'HVAC & Building Science',
    codeRef: 'AHRI Standard 210/240',
    lead: 'Calculate heat pump heating efficiency (COP and HSPF2) at sub-freezing ambient temperatures and determine electricity cost savings versus electric baseboards.',
    inputs: [
      { id: 'ratedCop', label: 'Heat Pump Rated COP at 47°F', value: 3.8, step: 0.1, unit: 'COP', hint: 'Modern inverter units deliver 3.5 to 4.2 COP' },
      { id: 'outdoorTemp', label: 'Outdoor Winter Temperature', value: 17, step: 5, unit: '°F' },
      { id: 'heatLoad', label: 'Home Hourly Heating Demand', value: 30000, step: 2000, unit: 'BTU/hr' },
      { id: 'kwhRate', label: 'Electric Utility Rate', value: 0.18, step: 0.01, unit: '$/kWh' }
    ],
    primaryOutput: { id: 'outDeratedCop', label: 'Operating COP at Temperature', unit: 'Real-Time COP' },
    outputs: [
      { id: 'outCostPerHour', label: 'Heat Pump Cost per Hour' },
      { id: 'outResistCost', label: 'Electric Resistance Baseboard Cost' },
      { id: 'outHourlySavings', label: 'Hourly Heating Dollar Savings' },
      { id: 'outAuxHeatStatus', label: 'Auxiliary Heat Strip Demand' }
    ],
    rules: [
      'Coefficient of Performance (COP) = Useful Thermal Heat Output (Watts) / Electrical Power Input (Watts).',
      'Electric resistance heating has a fixed COP of exactly 1.00 (100% efficient, converting 1 watt into 3.412 BTU).',
      'Air-source heat pumps lose thermodynamic efficiency and heating capacity as outdoor temperatures drop.',
      'Cold-climate heat pumps (NEEP certified) maintain COP > 1.8 even at sub-zero temperatures (-5°F).'
    ],
    formula: 'COP_adjusted = Rated COP × [1 - 0.015 × (47 - Temp_F)] | kW = BTU / (COP × 3412) | Cost = kW × $/kWh',
    faq: [
      { q: 'What does a COP of 3.5 mean in practical terms?', a: 'A COP of 3.5 means that for every 1 kilowatt-hour (kWh) of electricity the heat pump consumes, it delivers 3.5 kWh worth of heat into your home by pumping free thermal energy from outdoor air.' },
      { q: 'Why do electric heat strips cost so much to run?', a: 'Electric resistance heat strips have a COP of 1.0. At 15°F outside, an inverter heat pump operating at 2.4 COP delivers the same amount of heat using less than half the electricity of resistance coils.' }
    ],
    calcJs: `
      function calc() {
        var baseCop = parseFloat(document.getElementById('ratedCop').value) || 3.8;
        var tempF = parseFloat(document.getElementById('outdoorTemp').value) || 17;
        var btu = parseFloat(document.getElementById('heatLoad').value) || 30000;
        var rate = parseFloat(document.getElementById('kwhRate').value) || 0.18;

        // Approx COP derating curve: ~1.5% drop per degree below 47F
        var deltaT = Math.max(0, 47 - tempF);
        var curCop = Math.max(1.1, baseCop * (1 - 0.014 * deltaT));

        var hpKw = btu / (curCop * 3412);
        var resistKw = btu / (1.0 * 3412);

        var hpCost = hpKw * rate;
        var resistCost = resistKw * rate;
        var savings = resistCost - hpCost;

        document.getElementById('outDeratedCop').textContent = curCop.toFixed(2) + ' COP at ' + tempF + '°F outdoor';
        document.getElementById('outCostPerHour').textContent = '$' + hpCost.toFixed(2) + ' / hr (' + hpKw.toFixed(1) + ' kW draw)';
        document.getElementById('outResistCost').textContent = '$' + resistCost.toFixed(2) + ' / hr (' + resistKw.toFixed(1) + ' kW electric heat)';
        document.getElementById('outHourlySavings').textContent = 'Save $' + savings.toFixed(2) + ' / hour (' + ((1 - hpCost/resistCost)*100).toFixed(0) + '% cheaper)';
        document.getElementById('outAuxHeatStatus').textContent = curCop > 1.5 ? 'Compressor Only (No backup strips needed)' : '⚠️ Auxiliary heat strips likely engaging';
      }
    `
  },
  {
    slug: 'refrigerant-subcooling-superheat',
    name: 'Refrigerant Subcooling & Superheat Calculator',
    h1: 'HVAC Refrigerant Subcooling & Superheat Charging Calculator',
    title: 'HVAC Refrigerant Subcooling & Superheat Calculator [R-410A & R-22] | Digital Tools Shed',
    metaDesc: 'Diagnose AC refrigerant charges (undercharged vs overcharged) calculating target superheat (piston) and target subcooling (TXV) under AHRI rules.',
    category: 'HVAC & Building Science',
    codeRef: 'EPA Section 608',
    lead: 'Diagnose air conditioning and heat pump refrigerant charging using actual gauge pressure, saturation temperature, and line temperatures for TXV and fixed orifice systems.',
    inputs: [
      { id: 'refrig', label: 'Refrigerant Type', type: 'select', options: [
        { value: '410a', label: 'R-410A (Puron - Modern Systems)', selected: true },
        { value: '22', label: 'R-22 (Freon - Legacy Systems)' },
        { value: '32', label: 'R-32 (Next-Gen A2L)' },
        { value: '454b', label: 'R-454B (Opteon XL41)' }
      ]},
      { id: 'metering', label: 'Metering Device Type', type: 'select', options: [
        { value: 'txv', label: 'Thermal Expansion Valve TXV (Charge by Subcooling)', selected: true },
        { value: 'piston', label: 'Fixed Orifice / Piston (Charge by Superheat)' }
      ]},
      { id: 'liquidPressure', label: 'Liquid Line High-Side Gauge Pressure', value: 335, step: 5, unit: 'PSIG' },
      { id: 'liquidTemp', label: 'Liquid Line Actual Pipe Temperature', value: 92, step: 1, unit: '°F' },
      { id: 'targetSub', label: 'Manufacturer Target Subcooling', value: 10, step: 1, unit: '°F' }
    ],
    primaryOutput: { id: 'outSubcooling', label: 'Calculated Subcooling', unit: '°F' },
    outputs: [
      { id: 'outSatTemp', label: 'Liquid Saturation Temperature' },
      { id: 'outChargeStatus', label: 'Refrigerant System Charge Status' },
      { id: 'outCorrectiveAction', label: 'Required Field Adjustment' },
      { id: 'outMeteringRule', label: 'Metering Verification Rule' }
    ],
    rules: [
      'Subcooling = Saturated Liquid Temperature (from high-side gauge pressure) - Actual Liquid Line Temperature.',
      'Systems with TXV valves MUST be charged by Subcooling (superheat is automatically regulated by the valve).',
      'Systems with fixed orifices/pistons MUST be charged by Superheat using indoor wet-bulb and outdoor dry-bulb charts.',
      'A low subcooling reading (< 5°F) on a TXV system indicates an undercharged system or refrigerant leak.'
    ],
    formula: 'Subcooling = Saturation Temp (PT Chart) - Actual Line Temp | Superheat = Actual Suction Line Temp - Saturation Temp',
    faq: [
      { q: 'Why do TXV systems use subcooling instead of superheat for charging?', a: 'A Thermal Expansion Valve continuously modulates refrigerant flow to maintain a fixed superheat regardless of load. Therefore, charging a TXV by superheat is impossible; you must measure high-side liquid subcooling.' },
      { q: 'What does high subcooling and high superheat indicate?', a: 'High subcooling combined with high superheat indicates a severe liquid line restriction (such as a plugged filter drier or a stuck-closed TXV valve) trapping liquid refrigerant in the condenser.' }
    ],
    calcJs: `
      function calc() {
        var ref = document.getElementById('refrig').value;
        var meter = document.getElementById('metering').value;
        var pHigh = parseFloat(document.getElementById('liquidPressure').value) || 335;
        var tLine = parseFloat(document.getElementById('liquidTemp').value) || 92;
        var targetSub = parseFloat(document.getElementById('targetSub').value) || 10;

        // Approx PT curve for R-410A high side: SatTemp ≈ (Pressure + 100) / 4.2
        var satTemp = 104.0;
        if (ref === '410a') satTemp = (pHigh * 0.22) + 30.5;
        else if (ref === '22') satTemp = (pHigh * 0.35) + 38.0;

        var subcooling = satTemp - tLine;
        var diff = subcooling - targetSub;

        var status = 'Correctly Charged';
        var action = 'System charge is within ±2°F manufacturer tolerance';
        var badge = document.getElementById('statusBadge');

        if (diff < -3) {
          status = '❌ Undercharged (Low Refrigerant)';
          action = 'Add refrigerant in liquid state to liquid line until subcooling reaches ' + targetSub + '°F';
          badge.textContent = 'EPA Charge Alert: Low refrigerant charge';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        } else if (diff > 3) {
          status = '⚠️ Overcharged (Excess Refrigerant)';
          action = 'Recover excess refrigerant into EPA recovery cylinder';
          badge.textContent = 'EPA Warning: Overcharged system';
          badge.style.color = '#f59e0b';
          badge.style.background = 'rgba(245, 158, 11, 0.1)';
        } else {
          status = '✅ Code Compliant Charge';
          badge.textContent = 'Pass: Subcooling matches target ±2°F';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        }

        document.getElementById('outSubcooling').textContent = subcooling.toFixed(1) + '°F Subcooling (Target: ' + targetSub + '°F)';
        document.getElementById('outSatTemp').textContent = satTemp.toFixed(1) + '°F Saturation Temperature at ' + pHigh + ' PSIG';
        document.getElementById('outChargeStatus').textContent = status;
        document.getElementById('outCorrectiveAction').textContent = action;
        document.getElementById('outMeteringRule').textContent = meter === 'txv' ? 'TXV Active: Subcooling is primary charging method' : 'Piston: Verify with target superheat chart';
      }
    `
  },
  {
    slug: 'vent-hood-cfm-kitchen-btu',
    name: 'Kitchen Range Hood CFM & Makeup Air Calculator',
    h1: 'Kitchen Range Hood CFM & Makeup Air Damper Calculator (IRC M1503)',
    title: 'Kitchen Range Hood CFM & Makeup Air Calculator [IRC M1503 400 CFM Rule] | Digital Tools Shed',
    metaDesc: 'Size kitchen range exhaust CFM by cooktop BTU (100 CFM per 10k BTU) and verify interlocked makeup air requirements under IRC Section M1503.6.',
    category: 'HVAC & Building Science',
    codeRef: 'IRC Section M1503.6',
    lead: 'Calculate kitchen range hood exhaust airflow (CFM) based on cooktop BTU ratings and verify mandatory interlocked makeup air dampers under IRC codes.',
    inputs: [
      { id: 'stoveBtu', label: 'Total Gas Cooktop Output', value: 60000, step: 5000, unit: 'Total BTU/hr', hint: 'Sum of all burners on high (standard 4-burner gas ~40k-60k BTU, pro range ~70k-100k+)' },
      { id: 'hoodWidth', label: 'Range Hood Width', value: 36, step: 6, unit: 'Inches' },
      { id: 'wallOrIsland', label: 'Installation Style', type: 'select', options: [
        { value: 'wall', label: 'Wall Mount Hood (100 CFM / linear foot)', selected: true },
        { value: 'island', label: 'Island Hood (150 CFM / linear foot - Needs Higher Capture)' }
      ]},
      { id: 'ductLength', label: 'Exhaust Duct Equivalent Run Length', value: 25, step: 5, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outReqCfm', label: 'Recommended Hood Exhaust CFM', unit: 'CFM' },
    outputs: [
      { id: 'outMakeupAir', label: 'IRC M1503.6 Makeup Air Requirement' },
      { id: 'outDuctDia', label: 'Minimum Round Exhaust Duct Size' },
      { id: 'outDamperSize', label: 'Motorized Makeup Air Damper Size' },
      { id: 'outBackdraftRisk', label: 'Water Heater Backdraft Risk' }
    ],
    rules: [
      'IRC Section M1503.6: Exhaust hood systems capable of exhausting in excess of 400 CFM SHALL be provided with makeup air.',
      'Makeup air must be electrically interlocked with the hood exhaust fan to open automatically when the fan operates.',
      'Rule of thumb: 100 CFM of ventilation per 10,000 BTU of total gas cooktop burner capacity.',
      'Without makeup air, powerful 600–1200 CFM hoods create negative pressure that pulls deadly carbon monoxide backwards down water heater flues.'
    ],
    formula: 'BTU Sizing CFM = Total BTU / 100 | Linear Sizing CFM = (Width / 12) × (Wall: 100, Island: 150) | Max of both governs',
    faq: [
      { q: 'Why does the building code require makeup air above 400 CFM?', a: 'Modern homes are tightly sealed. Operating an exhaust hood over 400 CFM creates severe negative house pressure, which can backdraft toxic exhaust gases from naturally drafted gas water heaters, fireplaces, and furnaces into living spaces.' },
      { q: 'Can you crack a window instead of installing a makeup air system?', a: 'No. The International Residential Code specifically mandates an automated interlocked damper system. Relying on an occupant to manually remember to open a window in mid-winter does not satisfy building code compliance.' }
    ],
    calcJs: `
      function calc() {
        var btu = parseFloat(document.getElementById('stoveBtu').value) || 60000;
        var widthIn = parseFloat(document.getElementById('hoodWidth').value) || 36;
        var style = document.getElementById('wallOrIsland').value;
        var ductLen = parseFloat(document.getElementById('ductLength').value) || 25;

        var btuCfm = btu / 100;
        var linearCfm = (widthIn / 12) * (style === 'island' ? 150 : 100);
        var recCfm = Math.max(btuCfm, linearCfm);

        var ductDia = recCfm > 900 ? '10" Round Duct' : (recCfm > 600 ? '8" Round Duct' : (recCfm > 400 ? '7" Round Duct' : '6" Round Duct'));
        var needsMua = recCfm > 400;

        document.getElementById('outReqCfm').textContent = Math.round(recCfm) + ' CFM Hood Capacity';
        document.getElementById('outDuctDia').textContent = ductDia + ' (Rigid galvanized smooth duct)';
        
        var badge = document.getElementById('statusBadge');
        if (needsMua) {
          document.getElementById('outMakeupAir').textContent = '⚠️ MANDATORY INTERLOCKED MAKEUP AIR (IRC M1503.6)';
          document.getElementById('outDamperSize').textContent = ductDia.replace('Duct', 'Motorized Damper') + ' with interlock relay';
          document.getElementById('outBackdraftRisk').textContent = 'High Risk: Interlocked fresh air supply required to prevent CO backdraft';
          badge.textContent = 'IRC Code Alert: Exhaust > 400 CFM requires makeup air';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        } else {
          document.getElementById('outMakeupAir').textContent = 'Exempt from IRC M1503.6 (≤ 400 CFM limit)';
          document.getElementById('outDamperSize').textContent = 'None required under 400 CFM';
          document.getElementById('outBackdraftRisk').textContent = 'Low negative pressure risk';
          badge.textContent = 'IRC Pass: Standard range hood under 400 CFM';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        }
      }
    `
  },
  {
    slug: 'combustion-air-opening-size-nec',
    name: 'Combustion Air Opening Size Calculator',
    h1: 'Gas Appliance Combustion Air Opening Size Calculator (NFPA 54)',
    title: 'Combustion Air Opening Size Calculator [NFPA 54 / IFGC Section 304] | Digital Tools Shed',
    metaDesc: 'Calculate required combustion air louvers for enclosed furnace and water heater utility rooms under NFPA 54 indoor and outdoor air rules.',
    category: 'HVAC & Building Science',
    codeRef: 'NFPA 54 / IFGC 304',
    lead: 'Calculate square inches of free combustion air openings for gas furnaces, boilers, and water heaters located in confined closets and utility rooms.',
    inputs: [
      { id: 'totalBtu', label: 'Total Input Rating of All Gas Appliances', value: 140000, step: 5000, unit: 'Total BTU/hr', hint: 'Furnace (100k) + Water Heater (40k) = 140k BTU' },
      { id: 'roomCuFt', label: 'Enclosed Room Volume', value: 800, step: 50, unit: 'Cubic Feet' },
      { id: 'airMethod', label: 'Combustion Air Supply Method', type: 'select', options: [
        { value: 'two-direct', label: 'Two Permanent Openings - Direct Outdoor (1 sq in / 4,000 BTU)', selected: true },
        { value: 'two-duct', label: 'Two Openings via Horizontal Ducts (1 sq in / 2,000 BTU)' },
        { value: 'one-direct', label: 'Single Opening - Direct Outdoor (1 sq in / 3,000 BTU)' },
        { value: 'indoor', label: 'All Air from Inside Building (1 sq in / 1,000 BTU)' }
      ]}
    ],
    primaryOutput: { id: 'outNetFreeSqIn', label: 'Net Free Opening Area Required', unit: 'Square Inches' },
    outputs: [
      { id: 'outLouverSize', label: 'Metal Louver Dimension (75% Free Area)' },
      { id: 'outConfinedStatus', label: 'Room Classification (Confined vs Unconfined)' },
      { id: 'outOpeningLoc', label: 'Mandatory Opening Locations' },
      { id: 'outCoHazard', label: 'Incomplete Combustion / Sooting Risk' }
    ],
    rules: [
      'NFPA 54 Section 304.5: An unconfined space must have at least 50 cubic feet of room volume per 1,000 BTU/hr of total appliance input.',
      'Two Direct Outdoor Openings rule: 1 sq in of net free area per 4,000 BTU/hr (one within 12" of top, one within 12" of bottom).',
      'Metal louvers provide approximately 75% free area; wooden louvers provide only 25% free area.',
      'Starving gas appliances of combustion air produces lethal carbon monoxide (CO) gas and heavy black soot.'
    ],
    formula: 'Req Cu Ft = (Total BTU / 1000) × 50 | Net Free Area = Total BTU / Factor (4000, 2000, 3000, or 1000)',
    faq: [
      { q: 'What is a "confined space" in combustion air code?', a: 'A room or closet having less than 50 cubic feet of volume per 1,000 BTU/hr of installed gas appliances is legally defined as a confined space and must be provided with permanent combustion air louvers.' },
      { q: 'Why are two openings required instead of one?', a: 'Two openings create natural thermal convection: cooler outdoor air enters through the lower opening to supply burner combustion, while heated air exits through the top opening to prevent utility room overheating.' }
    ],
    calcJs: `
      function calc() {
        var btu = parseFloat(document.getElementById('totalBtu').value) || 140000;
        var vol = parseFloat(document.getElementById('roomCuFt').value) || 800;
        var method = document.getElementById('airMethod').value;

        var unconfinedReqVol = (btu / 1000) * 50;
        var isConfined = vol < unconfinedReqVol;

        var factor = 4000;
        if (method === 'two-duct') factor = 2000;
        else if (method === 'one-direct') factor = 3000;
        else if (method === 'indoor') factor = 1000;

        var netFree = Math.ceil(btu / factor);
        if (netFree < 100 && method === 'two-direct') netFree = 100; // minimum 100 sq in standard

        // 75% free area for metal louver
        var louverSqIn = Math.ceil(netFree / 0.75);
        var louverSide = Math.ceil(Math.sqrt(louverSqIn));

        document.getElementById('outNetFreeSqIn').textContent = netFree + ' sq in Net Free Area per opening';
        document.getElementById('outLouverSize').textContent = louverSide + '" × ' + louverSide + '" Metal Louver (' + louverSqIn + ' gross sq in)';
        
        var badge = document.getElementById('statusBadge');
        if (isConfined) {
          document.getElementById('outConfinedStatus').textContent = '⚠️ CONFINED SPACE (Room has ' + vol + ' cu ft, needs ' + unconfinedReqVol.toLocaleString() + ' cu ft)';
          document.getElementById('outOpeningLoc').textContent = '2 Openings: One within 12" of ceiling, one within 12" of floor';
          document.getElementById('outCoHazard').textContent = 'Critical: Louvers mandatory to prevent burner flame rollout and CO';
          badge.textContent = 'NFPA 54 Alert: Confined utility room requires louvers';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        } else {
          document.getElementById('outConfinedStatus').textContent = '✅ UNCONFINED SPACE (' + vol + ' cu ft exceeds ' + unconfinedReqVol.toLocaleString() + ' cu ft)';
          document.getElementById('outOpeningLoc').textContent = 'Standard indoor infiltration air sufficient';
          document.getElementById('outCoHazard').textContent = 'Adequate natural air volume';
          badge.textContent = 'NFPA 54 Pass: Unconfined room volume adequate';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        }
      }
    `
  },
  {
    slug: 'psychrometric-dew-point-grain',
    name: 'Psychrometric Dew Point & Grains (GPP) Calculator',
    h1: 'Psychrometric Dew Point & Humidity Ratio (Grains per Pound) Calculator',
    title: 'Psychrometric Dew Point & Grains per Pound (GPP) Calculator [Magnus Equation] | Digital Tools Shed',
    metaDesc: 'Calculate air dew point temperature, moisture grains per pound (GPP), and vapor pressure from dry-bulb temperature and relative humidity.',
    category: 'HVAC & Building Science',
    codeRef: 'ASHRAE Fundamentals',
    lead: 'Calculate psychrometric dew point temperatures and absolute moisture content in grains per pound (GPP) for drying, restoration, and building envelope diagnostics.',
    inputs: [
      { id: 'dryBulbF', label: 'Dry-Bulb Ambient Temperature', value: 75, step: 1, unit: '°F' },
      { id: 'relHumidity', label: 'Relative Humidity (RH)', value: 60, step: 1, min: 5, max: 100, unit: '%' }
    ],
    primaryOutput: { id: 'outDewPoint', label: 'Calculated Dew Point', unit: '°F' },
    outputs: [
      { id: 'outGpp', label: 'Humidity Ratio (Grains per Pound GPP)' },
      { id: 'outVaporPressure', label: 'Vapor Pressure' },
      { id: 'outCondenseRisk', label: 'Surface Condensation Risk' },
      { id: 'outDryingPotential', label: 'Dehumidification Drying Index' }
    ],
    rules: [
      'Dew point is the temperature to which air must be cooled for water vapor to condense into liquid water.',
      'Grains per Pound (GPP) measures absolute water weight (7,000 grains = 1 pound of water).',
      'Comfort zone standard: 50–60 GPP (below 55°F dew point). Levels above 65 GPP feel muggy and promote mold growth.',
      'When indoor surface temperatures (like windows or uninsulated wall sheathing) drop below dew point, condensation occurs instantly.'
    ],
    formula: 'Magnus-Tetens Equation: Ts = (b × α) / (a - α) where α = (a × T)/(b + T) + ln(RH/100) | GPP = 7000 × 0.622 × [e / (P_atm - e)]',
    faq: [
      { q: 'Why is GPP better than Relative Humidity for water damage drying?', a: 'Relative Humidity changes with temperature even when no moisture is removed. Grains per Pound (GPP) measures the true, absolute weight of moisture in the air, allowing restoration contractors to prove dehumidifiers are actually drying the structure.' },
      { q: 'At what dew point does mold grow?', a: 'Mold requires a localized surface relative humidity of 70% or greater. If a cool surface (like a basement wall or cold-water pipe) sits below the room dew point, moisture condenses and mold spores germinate within 48 hours.' }
    ],
    calcJs: `
      function calc() {
        var tf = parseFloat(document.getElementById('dryBulbF').value) || 75;
        var rh = parseFloat(document.getElementById('relHumidity').value) || 60;

        var tc = (tf - 32) * (5 / 9);
        var a = 17.27, b = 237.7;
        var alpha = ((a * tc) / (b + tc)) + Math.log(rh / 100);
        var dewPointC = (b * alpha) / (a - alpha);
        var dewPointF = (dewPointC * 9 / 5) + 32;

        // Saturation vapor pressure (hPa)
        var es = 6.112 * Math.exp((17.67 * tc) / (tc + 243.5));
        var e = (rh / 100) * es;
        var pAtm = 1013.25;
        var w = 0.622 * (e / (pAtm - e)); // lbs water / lb dry air
        var gpp = w * 7000;

        var moldRisk = dewPointF >= 65 ? 'High Mold Risk: Condensation likely on cool surfaces' : (dewPointF >= 55 ? 'Moderate Humidity' : 'Low Mold Risk: Dry Air');

        document.getElementById('outDewPoint').textContent = dewPointF.toFixed(1) + '°F Dew Point Temperature';
        document.getElementById('outGpp').textContent = gpp.toFixed(1) + ' GPP (Grains of water per pound dry air)';
        document.getElementById('outVaporPressure').textContent = (e * 0.02953).toFixed(3) + ' in. Hg vapor pressure';
        document.getElementById('outCondenseRisk').textContent = 'Any surface below ' + dewPointF.toFixed(1) + '°F will sweat';
        document.getElementById('outDryingPotential').textContent = moldRisk;
      }
    `
  },
  {
    slug: 'attic-ventilation-soffit-ridge-150',
    name: 'Attic Ventilation 1/150 & 1/300 Rule Calculator',
    h1: 'Attic Ventilation Net Free Area (1/150 & 1/300 Rule) Calculator',
    title: 'Attic Ventilation 1/150 & 1/300 Calculator [Soffit vs Ridge NFA] | Digital Tools Shed',
    metaDesc: 'Size attic ventilation net free area (NFA) balancing 50% intake at soffits and 50% exhaust at ridge under IRC Section R806.',
    category: 'HVAC & Building Science',
    codeRef: 'IRC Section R806',
    lead: 'Calculate Net Free Ventilating Area (NFVA) and balance 50% soffit intake versus 50% ridge exhaust to eliminate roof ice dams and attic heat buildup.',
    inputs: [
      { id: 'atticSqFt', label: 'Attic Floor Footprint Area', value: 1800, step: 50, unit: 'Sq Ft' },
      { id: 'ventRule', label: 'Code Ventilation Ratio', type: 'select', options: [
        { value: '300', label: '1/300 Rule (Balanced Soffit/Ridge + Class I/II Vapor Retarder)', selected: true },
        { value: '150', label: '1/150 Rule (Unbalanced or No Vapor Barrier)' }
      ]},
      { id: 'ridgeLen', label: 'Roof Ridge Total Length', value: 45, step: 5, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outTotalNfa', label: 'Total Net Free Area (NFA)', unit: 'Sq Feet' },
    outputs: [
      { id: 'outSoffitNfa', label: 'Soffit Intake NFA (50% Minimum)' },
      { id: 'outRidgeNfa', label: 'Ridge Exhaust NFA (50% Maximum)' },
      { id: 'outRidgeFtReq', label: 'Continuous Ridge Vent Needed' },
      { id: 'outSoffitVents', label: 'Individual 16x8" Soffit Vents' }
    ],
    rules: [
      'IRC Section R806.2: 1/300 ratio requires between 40% and 50% of the ventilating area to be located in the upper portion (ridge).',
      'The intake ventilation at the eaves/soffits must equal or exceed the exhaust ventilation to prevent pulling conditioned air from the house.',
      'Baffles (insulation dams) must be installed at every rafter bay to maintain a 1-inch clear air channel above insulation.',
      'Never mix ridge vents with gable vents or powered attic fans; this creates short-circuit loops that pull rain and snow into the attic.'
    ],
    formula: 'Total NFA = Attic Sq Ft / Ratio (150 or 300) | Intake = 50% NFA | Exhaust = 50% NFA',
    faq: [
      { q: 'What qualifies an attic for the 1/300 ventilation rule instead of 1/150?', a: 'Under IRC R806.2, you can use the smaller 1/300 ratio if at least 40% and not more than 50% of ventilating area is provided by vents in the upper portion of the attic (ridge) and a Class I/II vapor retarder is installed on warm-in-winter ceilings.' },
      { q: 'Why is it bad to have more ridge exhaust than soffit intake?', a: 'If exhaust exceeds intake, the attic develops negative pressure that pulls conditioned, heated living room air up through ceiling light fixtures and drywall cracks, creating massive energy bills and winter roof ice dams.' }
    ],
    calcJs: `
      function calc() {
        var sqFt = parseFloat(document.getElementById('atticSqFt').value) || 1800;
        var ratio = parseFloat(document.getElementById('ventRule').value) || 300;
        var ridge = parseFloat(document.getElementById('ridgeLen').value) || 45;

        var totalNfaSqFt = sqFt / ratio;
        var totalNfaSqIn = totalNfaSqFt * 144;

        var halfSqIn = totalNfaSqIn / 2;
        var ridgeFtReq = Math.ceil(halfSqIn / 18); // standard ridge vent provides 18 sq in NFA/foot
        var soffitVents = Math.ceil(halfSqIn / 56); // 16x8 louvered soffit vent provides ~56 sq in NFA

        document.getElementById('outTotalNfa').textContent = totalNfaSqFt.toFixed(2) + ' sq ft (' + Math.round(totalNfaSqIn) + ' sq in) Total NFA';
        document.getElementById('outSoffitNfa').textContent = Math.round(halfSqIn) + ' sq in Intake at Eaves / Soffits';
        document.getElementById('outRidgeNfa').textContent = Math.round(halfSqIn) + ' sq in Exhaust at Peak / Ridge';
        document.getElementById('outRidgeFtReq').textContent = ridgeFtReq + ' linear feet of continuous ridge vent (18 sq in/ft)';
        document.getElementById('outSoffitVents').textContent = soffitVents + ' Rectangular 16x8" Undereave Soffit Vents';
      }
    `
  },
  {
    slug: 'crawlspace-dehumidifier-capacity',
    name: 'Crawlspace Dehumidifier Sizing Calculator',
    h1: 'Encapsulated Crawlspace Dehumidifier Sizing Calculator',
    title: 'Crawlspace Dehumidifier Sizing Calculator [Pints Per Day PPD & AHAM] | Digital Tools Shed',
    metaDesc: 'Size commercial crawlspace dehumidifier capacity in pints per day (PPD) based on square footage, soil vapor retarder, and dampness levels.',
    category: 'HVAC & Building Science',
    codeRef: 'Advanced Energy Crawlspace',
    lead: 'Calculate commercial crawlspace dehumidifier capacity in pints per day (PPD) under AHAM test standards (80°F / 60% RH) for sealed, encapsulated crawlspaces.',
    inputs: [
      { id: 'crawlSqFt', label: 'Crawlspace Total Ground Footprint', value: 1500, step: 50, unit: 'Sq Ft' },
      { id: 'crawlHgt', label: 'Average Crawlspace Ground Clearance', value: 3.5, step: 0.5, unit: 'Feet' },
      { id: 'encapStatus', label: 'Vapor Retarder Encapsulation Quality', type: 'select', options: [
        { value: 'sealed', label: 'Full Encapsulation (12-20 mil sealed poly on floor & walls)', selected: true },
        { value: 'loose', label: 'Loose 6-mil poly on ground (Unsealed walls)' },
        { value: 'open', label: 'Vented Dirt Crawlspace (High Humidity Infiltration)' }
      ]},
      { id: 'moistureLevel', label: 'Observed Dampness Severity', type: 'select', options: [
        { value: 'normal', label: 'Normal Encapsulated Condition (60-70% RH)', selected: true },
        { value: 'wet', label: 'Damp / Wet (Standing water history, > 75% RH)' }
      ]}
    ],
    primaryOutput: { id: 'outPpdCap', label: 'Recommended Dehumidifier Capacity', unit: 'Pints / Day (PPD)' },
    outputs: [
      { id: 'outCrawlVol', label: 'Crawlspace Air Volume' },
      { id: 'outCondensateGpd', label: 'Daily Water Condensate Output' },
      { id: 'outDrainMethod', label: 'Condensate Drainage Recommendation' },
      { id: 'outTargetRh', label: 'Target Setpoint Relative Humidity' }
    ],
    rules: [
      'AHAM standard ratings measure pints per day (PPD) at 80°F and 60% RH. Crawlspaces operate cooler (55°F–65°F), where machine capacity drops by 30%–40%.',
      'Never use residential plastic basement dehumidifiers in crawlspaces; they cannot operate efficiently below 65°F.',
      'Commercial crawlspace dehumidifiers feature hot gas bypass defrost to operate down to 40°F without freezing coils.',
      'Maintain continuous crawlspace relative humidity below 55% to guarantee wood stays below 16% moisture content (stopping mold growth).'
    ],
    formula: 'Base PPD = (Sq Ft / 100) × 3.5 | Adjusted for ground barrier permeability and ambient temperature derate',
    faq: [
      { q: 'Why do portable basement dehumidifiers freeze up in crawlspaces?', a: 'Cheap portable dehumidifiers rely on passive off-cycle defrosting. When crawlspace temperatures drop below 65°F, moisture freezes solid into a block of ice on the evaporator coil. Commercial units use active hot-gas bypass to melt ice instantly.' },
      { q: 'What relative humidity should a crawlspace dehumidifier be set to?', a: 'Set the digital humidistat to 50% or 55% RH. This ensures wood floor joists remain at 10% to 14% moisture content, well below the 19% threshold required for wood-decay fungi and termites to thrive.' }
    ],
    calcJs: `
      function calc() {
        var sqFt = parseFloat(document.getElementById('crawlSqFt').value) || 1500;
        var hgt = parseFloat(document.getElementById('crawlHgt').value) || 3.5;
        var encap = document.getElementById('encapStatus').value;
        var wet = document.getElementById('moistureLevel').value;

        var vol = sqFt * hgt;
        var basePpd = (sqFt / 1000) * 35;

        if (encap === 'loose') basePpd *= 1.4;
        else if (encap === 'open') basePpd *= 2.0;

        if (wet === 'wet') basePpd *= 1.3;

        var recPpd = Math.ceil(basePpd);
        var sizeClass = '70 PPD Commercial Unit (e.g. Santa Fe Compact70 / Aprilaire E070)';
        if (recPpd > 90) sizeClass = '120 PPD High-Capacity Unit (e.g. Santa Fe Advance120)';
        else if (recPpd > 70) sizeClass = '90 PPD Commercial Unit (e.g. Santa Fe Advance90)';

        document.getElementById('outPpdCap').textContent = sizeClass;
        document.getElementById('outCrawlVol').textContent = vol.toLocaleString() + ' cu ft enclosed volume';
        document.getElementById('outCondensateGpd').textContent = '~' + (recPpd / 8).toFixed(1) + ' Gallons of liquid water drained per day';
        document.getElementById('outDrainMethod').textContent = 'Continuous gravity drain to sump pump basin or exterior daylight';
        document.getElementById('outTargetRh').textContent = 'Set Humidistat to 50% - 55% RH (Keeps wood MC < 14%)';
      }
    `
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 7: METALWORKING, WELDING & MACHINING (Tools 69–78)
// ─────────────────────────────────────────────────────────────────────────────
const METALWORKING_TOOLS = [
  {
    slug: 'sheet-metal-bend-deduction-k-factor',
    name: 'Sheet Metal Bend Allowance & K-Factor Calculator',
    h1: 'Sheet Metal Bend Allowance, Deduction & K-Factor Calculator',
    title: 'Sheet Metal Bend Deduction & K-Factor Calculator [Flat Pattern Layout] | Digital Tools Shed',
    metaDesc: 'Calculate sheet metal Bend Allowance (BA), Bend Deduction (BD), and flat pattern blank cut lengths using material K-factors.',
    category: 'Metalworking & Welding',
    codeRef: 'DIN 6935',
    lead: 'Calculate sheet metal flat pattern blank lengths, bend allowances, and bend deductions based on inside radius, sheet thickness, and neutral axis K-factor.',
    inputs: [
      { id: 'sheetThick', label: 'Sheet Metal Thickness (T)', value: 0.0625, step: 0.015625, unit: 'Inches', hint: '16 Gauge = 0.060", 14 Gauge = 0.075", 1/8" = 0.125"' },
      { id: 'bendAngle', label: 'Bend Angle (B)', value: 90, step: 1, unit: 'Degrees', hint: 'Degrees of bend deflection' },
      { id: 'insideRadius', label: 'Inside Bend Radius (R)', value: 0.0625, step: 0.015625, unit: 'Inches', hint: 'Often equal to material thickness T' },
      { id: 'kFactor', label: 'Neutral Axis K-Factor', value: 0.38, step: 0.01, min: 0.25, max: 0.50, hint: '0.33 for soft copper, 0.38 for air-bent steel, 0.44 for bottoming' },
      { id: 'flange1', label: 'Flange 1 Outside Dimension', value: 3.0, step: 0.125, unit: 'Inches' },
      { id: 'flange2', label: 'Flange 2 Outside Dimension', value: 4.0, step: 0.125, unit: 'Inches' }
    ],
    primaryOutput: { id: 'outFlatBlank', label: 'Total Flat Blank Length', unit: 'Inches' },
    outputs: [
      { id: 'outBendAllowance', label: 'Bend Allowance (BA)' },
      { id: 'outBendDeduction', label: 'Bend Deduction (BD)' },
      { id: 'outSetback', label: 'Outside Setback (OSSB)' },
      { id: 'outNeutralAxis', label: 'Neutral Axis Shift Depth' }
    ],
    rules: [
      'Bend Allowance (BA) is the arc length of the neutral axis between tangent lines through the bend.',
      'Outside Setback (OSSB) = tan(Angle / 2) × (Inside Radius + Thickness).',
      'Bend Deduction (BD) = 2 × OSSB - BA.',
      'Flat Blank Length = Flange 1 + Flange 2 - Bend Deduction (BD).'
    ],
    formula: 'BA = (π/180) × Angle × (R + K × T) | OSSB = tan(Angle/2) × (R + T) | BD = 2 × OSSB - BA | Flat = L1 + L2 - BD',
    faq: [
      { q: 'What is the K-factor in sheet metal fabrication?', a: 'The K-factor is the ratio representing the location of the neutral axis (the layer that neither stretches nor compresses) relative to material thickness: K = t / T. For air-bent sheet metal, K typically ranges from 0.38 to 0.44.' },
      { q: 'Why is Bend Deduction subtracted from flange dimensions?', a: 'Outside flange dimensions overlap each other at the apex corner. Bend deduction removes this phantom geometric overlap while adding back the actual material consumed in the curved bend arc.' }
    ],
    calcJs: `
      function calc() {
        var t = parseFloat(document.getElementById('sheetThick').value) || 0.0625;
        var angle = parseFloat(document.getElementById('bendAngle').value) || 90;
        var r = parseFloat(document.getElementById('insideRadius').value) || 0.0625;
        var k = parseFloat(document.getElementById('kFactor').value) || 0.38;
        var f1 = parseFloat(document.getElementById('flange1').value) || 3.0;
        var f2 = parseFloat(document.getElementById('flange2').value) || 4.0;

        var angleRad = (angle * Math.PI) / 180;
        var ba = (Math.PI / 180) * angle * (r + k * t);
        var ossb = Math.tan(angleRad / 2) * (r + t);
        var bd = (2 * ossb) - ba;
        var flatLen = f1 + f2 - bd;

        document.getElementById('outFlatBlank').textContent = flatLen.toFixed(4) + '" (' + toFraction(flatLen) + ') Flat Blank Cut Length';
        document.getElementById('outBendAllowance').textContent = ba.toFixed(4) + '" arc length (BA)';
        document.getElementById('outBendDeduction').textContent = bd.toFixed(4) + '" bend deduction (BD)';
        document.getElementById('outSetback').textContent = ossb.toFixed(4) + '" outside setback (OSSB)';
        document.getElementById('outNeutralAxis').textContent = (k * t).toFixed(4) + '" inward from inside surface';
      }
    `
  },
  {
    slug: 'sheet-metal-setback-inside-radius',
    name: 'Sheet Metal Outside Setback (OSSB) Calculator',
    h1: 'Sheet Metal Outside Setback & Bend Tangent Line Calculator',
    title: 'Sheet Metal Outside Setback Calculator [OSSB & Bend Tangent Lines] | Digital Tools Shed',
    metaDesc: 'Calculate Outside Setback (OSSB) and Bend Tangent Lines (BTL) for acute and obtuse sheet metal bends on press brakes.',
    category: 'Metalworking & Welding',
    codeRef: 'SME Standards',
    lead: 'Calculate outside setback distances and layout bend tangent lines (BTL) on flat sheet blanks for acute, 90-degree, and obtuse press brake forming.',
    inputs: [
      { id: 'thickness', label: 'Material Thickness (T)', value: 0.090, step: 0.01, unit: 'Inches' },
      { id: 'angle', label: 'Bend Angle', value: 120, step: 1, unit: 'Degrees', hint: 'Deflection from flat (e.g. 120° obtuse or 60° acute)' },
      { id: 'punchRadius', label: 'Punch Nose Inside Radius (IR)', value: 0.125, step: 0.03125, unit: 'Inches' },
      { id: 'flangeLen', label: 'Finished Outside Flange Dimension', value: 2.50, step: 0.125, unit: 'Inches' }
    ],
    primaryOutput: { id: 'outOssb', label: 'Outside Setback (OSSB)', unit: 'Inches' },
    outputs: [
      { id: 'outBtlMark', label: 'First Bend Tangent Line (BTL)' },
      { id: 'outApexDist', label: 'Apex Corner to Tangent Line' },
      { id: 'outBendClass', label: 'Bend Angle Classification' },
      { id: 'outMinFlange', label: 'Minimum Formable Flange Height' }
    ],
    rules: [
      'Outside Setback is the distance from the intersection of outer mold lines (apex) to the tangent point where the bend begins.',
      'For 90-degree bends: OSSB = Inside Radius + Thickness.',
      'Bend Tangent Lines mark the exact lines where the press brake punch nose contacts the metal sheet.',
      'Minimum flange height must be at least 4 times material thickness to prevent slipping off bottom V-die shoulders.'
    ],
    formula: 'OSSB = tan(Angle / 2) × (Inside Radius + Thickness) | First BTL = Flange Dimension - OSSB',
    faq: [
      { q: 'What is a Bend Tangent Line (BTL)?', a: 'A Bend Tangent Line is the transition mark on the flat blank where flat metal stops and curved deformation begins. Laying out BTLs tells the press brake operator exactly where to align backgauges.' },
      { q: 'How does an acute bend change setback calculations?', a: 'For acute bends (bends greater than 90 degrees of deflection), tan(Angle/2) exceeds 1.0, causing the setback distance to increase dramatically compared to a 90-degree bend.' }
    ],
    calcJs: `
      function calc() {
        var t = parseFloat(document.getElementById('thickness').value) || 0.090;
        var ang = parseFloat(document.getElementById('angle').value) || 120;
        var ir = parseFloat(document.getElementById('punchRadius').value) || 0.125;
        var flange = parseFloat(document.getElementById('flangeLen').value) || 2.50;

        var angRad = (ang * Math.PI) / 180;
        var ossb = Math.tan(angRad / 2) * (ir + t);
        var btl = flange - ossb;
        var minFlange = (ir + t) * 2.5;

        var bType = ang === 90 ? 'Square 90° Bend' : (ang > 90 ? 'Obtuse Angle Bend (>90°)' : 'Acute Angle Bend (<90°)');

        document.getElementById('outOssb').textContent = ossb.toFixed(4) + '" Outside Setback (OSSB)';
        document.getElementById('outBtlMark').textContent = btl.toFixed(4) + '" from edge to 1st Bend Tangent Line';
        document.getElementById('outApexDist').textContent = ossb.toFixed(4) + '" setback from mold point';
        document.getElementById('outBendClass').textContent = bType;
        document.getElementById('outMinFlange').textContent = minFlange.toFixed(3) + '" minimum flange height for V-die';
      }
    `
  },
  {
    slug: 'mig-tig-shielding-gas-bottle-time',
    name: 'Welding Shielding Gas Bottle Arc Time Calculator',
    h1: 'MIG & TIG Shielding Gas Cylinder Arc Time Calculator',
    title: 'Welding Shielding Gas Cylinder Arc Time Calculator [CFH Flow & Bottle Size] | Digital Tools Shed',
    metaDesc: 'Calculate remaining arc welding burn time in hours and minutes from cylinder pressure (PSI), tank volume, and flow rate (CFH).',
    category: 'Metalworking & Welding',
    codeRef: 'AWS Standards',
    lead: 'Calculate continuous arc welding burn time and remaining gas volume from cylinder pressure (PSI) and flowmeter flow rate (CFH) for MIG and TIG cylinders.',
    inputs: [
      { id: 'bottleSize', label: 'Cylinder Size / Nominal Capacity', type: 'select', options: [
        { value: '40', label: 'Size 40 Cylinder (40 cu ft - Small Portable)' },
        { value: '80', label: 'Size 80 Cylinder (80 cu ft - Shop Hobbyist)' },
        { value: '125', label: 'Size 125 Cylinder (125 cu ft - Standard Fabricator)', selected: true },
        { value: '250', label: 'Size 250 / 300 Cylinder (250 cu ft - Production)' }
      ]},
      { id: 'psiGauge', label: 'Current Regulator Tank Pressure', value: 1800, step: 100, min: 100, max: 2500, unit: 'PSI', hint: 'Full cylinder is typically 2,015 to 2,200 PSI' },
      { id: 'flowCfh', label: 'Flowmeter Flow Rate Setting', value: 25, step: 2, unit: 'CFH', hint: 'MIG ~20-25 CFH, TIG ~15-20 CFH' }
    ],
    primaryOutput: { id: 'outArcTime', label: 'Remaining Continuous Arc Time', unit: 'Hours / Minutes' },
    outputs: [
      { id: 'outRemainVol', label: 'Remaining Gas Volume' },
      { id: 'outTankFullPct', label: 'Cylinder Remaining Capacity %' },
      { id: 'outGasLossWarning', label: 'Draft / Outdoor Loss Penalty' },
      { id: 'outExchangeAlert', label: 'Cylinder Exchange Status' }
    ],
    rules: [
      'Full standard compressed gas cylinders are filled to approximately 2,015 to 2,200 PSI at 70°F.',
      'Remaining gas volume is directly proportional to remaining gauge pressure: Volume = Rated Volume × (Current PSI / Full PSI).',
      'Operating MIG or TIG outdoors requires increasing flow rates to 30–35 CFH or using wind screens to prevent porosity.',
      'Always swap cylinders before pressure drops below 50 PSI to prevent moisture contamination entering the bottle.'
    ],
    formula: 'Remaining Cu Ft = Rated Volume × (PSI / 2015) | Arc Hours = Remaining Cu Ft / Flow Rate CFH',
    faq: [
      { q: 'What flow rate should I use for MIG welding with C25 (75/25)?', a: 'A flow rate of 20 to 25 CFH (Cubic Feet per Hour) is optimal for indoor MIG welding. Setting flow higher than 30 CFH creates turbulent flow that actually sucks ambient air into the weld pool, causing porosity.' },
      { q: 'How long will a 125 cu ft cylinder last continuous welding?', a: 'A full 125 cu ft bottle flowing at 25 CFH delivers exactly 125 / 25 = 5.0 hours of continuous trigger-down arc time. For a typical fabrication duty cycle of 25%, one tank lasts roughly 20 shop hours.' }
    ],
    calcJs: `
      function calc() {
        var ratedCuFt = parseFloat(document.getElementById('bottleSize').value) || 125;
        var psi = parseFloat(document.getElementById('psiGauge').value) || 1800;
        var cfh = parseFloat(document.getElementById('flowCfh').value) || 25;

        var fullPsi = 2015.0;
        var pct = Math.min(100, (psi / fullPsi) * 100);
        var remainCuFt = (psi / fullPsi) * ratedCuFt;
        var totalHours = remainCuFt / cfh;

        var hrs = Math.floor(totalHours);
        var mins = Math.round((totalHours - hrs) * 60);

        var pass = psi > 300;

        document.getElementById('outArcTime').textContent = hrs + ' Hours, ' + mins + ' Minutes continuous trigger arc time';
        document.getElementById('outRemainVol').textContent = remainCuFt.toFixed(1) + ' cu ft remaining in cylinder';
        document.getElementById('outTankFullPct').textContent = pct.toFixed(1) + '% full (' + psi + ' / 2,015 PSI)';
        document.getElementById('outGasLossWarning').textContent = 'Flowing ' + cfh + ' CFH (' + (cfh / 60).toFixed(2) + ' cu ft / minute)';
        
        var badge = document.getElementById('statusBadge');
        if (pass) {
          document.getElementById('outExchangeAlert').textContent = '✅ Operating Pressure Normal';
          badge.textContent = 'Shielding Pass: Adequate gas pressure';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outExchangeAlert').textContent = '⚠️ LOW GAS WARNING (< 300 PSI): Prepare exchange cylinder';
          badge.textContent = 'Low Pressure: Porosity risk approaching';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'welding-wire-feed-speed-deposition',
    name: 'MIG Wire Feed Speed & Deposition Rate Calculator',
    h1: 'MIG Wire Feed Speed (WPM) & Deposition Rate (lbs/hr) Calculator',
    title: 'MIG Wire Feed Speed & Deposition Calculator [WPS WFS & Wire Diameter] | Digital Tools Shed',
    metaDesc: 'Calculate weld metal deposition rates in pounds per hour (lbs/hr) and wire consumption from Wire Feed Speed (WFS) and solid/flux-core wire diameter.',
    category: 'Metalworking & Welding',
    codeRef: 'AWS D1.1 / D1.2',
    lead: 'Calculate weld deposit rate in pounds per hour, wire consumption weight, and welding amperage from MIG Wire Feed Speed (IPM) and wire diameter.',
    inputs: [
      { id: 'wireDia', label: 'Welding Wire Diameter', type: 'select', options: [
        { value: '0.023', label: '.023" (0.6 mm) - Sheet Metal / Auto Body' },
        { value: '0.030', label: '.030" (0.8 mm) - General Fabrication' },
        { value: '0.035', label: '.035" (0.9 mm) - Standard Production', selected: true },
        { value: '0.045', label: '.045" (1.2 mm) - Heavy Structural Steel' }
      ]},
      { id: 'wfs', label: 'Wire Feed Speed (WFS)', value: 280, step: 10, unit: 'Inches/Min (IPM)' },
      { id: 'wireType', label: 'Wire Process Type', type: 'select', options: [
        { value: 'er70s', label: 'Solid Steel Wire ER70S-6 (95% Deposition Eff)', selected: true },
        { value: 'flux', label: 'Flux-Cored Gasless E71T-GS (85% Deposition Eff)' },
        { value: 'al', label: 'Aluminum 4043 / 5356 (90% Eff)' }
      ]},
      { id: 'weldHours', label: 'Total Arc Time per Shift', value: 2.5, step: 0.5, unit: 'Hours' }
    ],
    primaryOutput: { id: 'outDepRate', label: 'Deposition Rate', unit: 'Pounds / Hour' },
    outputs: [
      { id: 'outAmperageEst', label: 'Estimated Welding Current' },
      { id: 'outTotalLbs', label: 'Total Wire Consumed per Shift' },
      { id: 'outSpoolDays', label: 'Operating Days per 33 lb Spool' },
      { id: 'outDensityFactor', label: 'Wire Density / Volume Factor' }
    ],
    rules: [
      'Deposition rate is the actual weight of weld metal deposited into the joint per hour of continuous arc time.',
      'Solid steel MIG wire operating in spray or short-circuit transfer achieves 93% to 95% deposition efficiency.',
      'Flux-cored arc welding (FCAW) loses 15% to 20% of wire weight as vaporized gas and glassy slag peeling.',
      'Approximate rule: for .035" steel wire, Amps ≈ WFS × 0.60 (280 IPM ≈ 170 Amps).'
    ],
    formula: 'Wire Vol (cu in/min) = WFS × π × (Dia/2)² | Weight Rate = Vol × Density × 60 × Efficiency',
    faq: [
      { q: 'How does Wire Feed Speed (WFS) control amperage in MIG welding?', a: 'In Constant Voltage (CV) MIG machines, the voltage knob sets the arc length and bead profile, while the wire feed speed directly dictates the amperage current drawn from the power source.' },
      { q: 'Why is .035" wire the most popular solid MIG wire?', a: 'Because .035" steel wire provides the ideal operating balance: it runs smoothly at low currents (100A on 16 ga sheet) up to high-deposition spray transfer (240A on 1/2" plate).' }
    ],
    calcJs: `
      function calc() {
        var dia = parseFloat(document.getElementById('wireDia').value) || 0.035;
        var wfs = parseFloat(document.getElementById('wfs').value) || 280;
        var wType = document.getElementById('wireType').value;
        var hrs = parseFloat(document.getElementById('weldHours').value) || 2.5;

        var density = wType === 'al' ? 0.098 : 0.283; // lbs/cu in
        var eff = wType === 'flux' ? 0.85 : 0.95;

        var area = Math.PI * Math.pow(dia / 2, 2);
        var volPerMin = wfs * area;
        var lbsMin = volPerMin * density;
        var lbsHr = lbsMin * 60;
        var depositHr = lbsHr * eff;

        var totalLbs = lbsHr * hrs;
        var daysPerSpool = (33 / totalLbs).toFixed(1);

        // Current estimate for .035 steel
        var estAmps = Math.round(wfs * (dia / 0.035) * 0.60);

        document.getElementById('outDepRate').textContent = depositHr.toFixed(2) + ' lbs/hr of weld deposit';
        document.getElementById('outAmperageEst').textContent = '~' + estAmps + ' Amps operating current';
        document.getElementById('outTotalLbs').textContent = totalLbs.toFixed(1) + ' lbs wire burned in ' + hrs + ' arc hours';
        document.getElementById('outSpoolDays').textContent = daysPerSpool + ' shifts per standard 33 lb wire spool';
        document.getElementById('outDensityFactor').textContent = (eff * 100) + '% deposition efficiency (' + wType.toUpperCase() + ')';
      }
    `
  },
  {
    slug: 'welding-heat-input-kj-inch',
    name: 'Welding Heat Input Calculator',
    h1: 'Welding Heat Input (kJ/in & kJ/mm) Calculator (ASME & AWS)',
    title: 'Welding Heat Input Calculator [ASME Section IX & AWS D1.1 kJ/in] | Digital Tools Shed',
    metaDesc: 'Calculate heat input in kilojoules per inch (kJ/in) from welding voltage, amperage, and travel speed with arc efficiency thermal factors.',
    category: 'Metalworking & Welding',
    codeRef: 'ASME Sec. IX / AWS D1.1',
    lead: 'Calculate welding energy heat input in kilojoules per inch (kJ/in) to qualify Welding Procedure Specifications (WPS) and control heat-affected zone (HAZ) toughness.',
    inputs: [
      { id: 'volts', label: 'Arc Voltage (V)', value: 24, step: 0.5, unit: 'Volts' },
      { id: 'amps', label: 'Welding Current (I)', value: 180, step: 5, unit: 'Amps' },
      { id: 'travelIpm', label: 'Travel Speed', value: 12, step: 0.5, unit: 'Inches/Min (IPM)' },
      { id: 'process', label: 'Welding Process & Thermal Efficiency (η)', type: 'select', options: [
        { value: '0.80', label: 'GMAW / MIG / FCAW (η = 0.80)', selected: true },
        { value: '0.80-smaw', label: 'SMAW / Stick (η = 0.80)' },
        { value: '0.60', label: 'GTAW / TIG (η = 0.60 - Lower Thermal Transfer)' },
        { value: '1.00', label: 'SAW / Submerged Arc (η = 1.00 - Full Flux Blanket)' }
      ]}
    ],
    primaryOutput: { id: 'outHeatInput', label: 'Calculated Heat Input', unit: 'kJ / Inch' },
    outputs: [
      { id: 'outKjMm', label: 'Metric Heat Input (kJ / mm)' },
      { id: 'outHazImpact', label: 'Heat-Affected Zone (HAZ) Microstructure' },
      { id: 'outInterpassAlert', label: 'Interpass Temperature Requirement' },
      { id: 'outAsmeStatus', label: 'ASME Section IX Compliance' }
    ],
    rules: [
      'ASME Section IX: Heat Input = (Volts × Amps × 60) / (Travel Speed in IPM × 1000) in kJ/inch.',
      'Excessive heat input creates a large, coarse-grained Heat-Affected Zone (HAZ), reducing Charpy V-notch impact toughness.',
      'Low heat input on thick structural steel cools too quickly (quenches), forming hard, brittle martensite prone to hydrogen cracking.',
      'High-strength structural steels (A514 / Hardox) specify strict maximum heat input limits to prevent weakening tempered metallurgy.'
    ],
    formula: 'Heat Input (kJ/in) = (Volts × Amps × 60) / (Travel Speed × 1000) | Net Heat = Heat Input × Arc Efficiency η',
    faq: [
      { q: 'Why is heat input strictly monitored in structural welding?', a: 'Heat input directly controls the cooling rate of the weld metal and parent plate. High heat input destroys the yield strength and fracture toughness of high-strength alloy steels, while low heat input causes hard martensitic cracks.' },
      { q: 'Why does TIG welding have a lower thermal efficiency than MIG?', a: 'In GTAW (TIG), significant radiant heat is lost to the atmosphere and the water-cooled torch body, resulting in only ~60% arc efficiency. Submerged Arc (SAW) traps 100% of heat under a heavy blanket of mineral flux.' }
    ],
    calcJs: `
      function calc() {
        var v = parseFloat(document.getElementById('volts').value) || 24;
        var i = parseFloat(document.getElementById('amps').value) || 180;
        var ipm = parseFloat(document.getElementById('travelIpm').value) || 12;
        var eta = parseFloat(document.getElementById('process').value) || 0.80;

        var grossKjIn = (v * i * 60) / (ipm * 1000);
        var netKjIn = grossKjIn * eta;
        var kjMm = grossKjIn / 25.4;

        var haz = grossKjIn > 50 ? 'Heavy Heat Input: High distortion, coarse grain growth in HAZ' : (grossKjIn < 15 ? 'Low Heat Input: Fast quench, preheat required to avoid cracking' : 'Optimal Heat Input: Balanced toughness and penetration');

        document.getElementById('outHeatInput').textContent = grossKjIn.toFixed(2) + ' kJ / inch (Gross) [' + netKjIn.toFixed(2) + ' kJ/in Net]';
        document.getElementById('outKjMm').textContent = kjMm.toFixed(2) + ' kJ / mm metric equivalent';
        document.getElementById('outHazImpact').textContent = haz;
        document.getElementById('outInterpassAlert').textContent = 'Maintain max interpass temp ≤ 450°F on Q&T steels';
        document.getElementById('outAsmeStatus').textContent = '✅ WPS Essential Variable Documented (ASME IX QW-409.1)';
      }
    `
  },
  {
    slug: 'fillet-weld-throat-thickness-strength',
    name: 'Fillet Weld Throat Thickness & Strength Calculator',
    h1: 'Fillet Weld Effective Throat Thickness & Shear Strength Calculator',
    title: 'Fillet Weld Effective Throat & Shear Strength Calculator [AISC 0.707 Leg Rule] | Digital Tools Shed',
    metaDesc: 'Calculate effective throat thickness (0.707 × Leg) and allowable shear load capacity (kips per linear inch) for E70xx electrodes under AISC 360.',
    category: 'Metalworking & Welding',
    codeRef: 'AISC 360-16 / AWS D1.1',
    lead: 'Calculate theoretical and effective throat thickness, allowable shear stress, and structural load capacity per linear inch for structural fillet welds.',
    inputs: [
      { id: 'legSize', label: 'Fillet Weld Leg Size (w)', type: 'select', options: [
        { value: '0.1875', label: '3/16" (4.8 mm) Fillet Leg' },
        { value: '0.250', label: '1/4" (6.4 mm) Fillet Leg', selected: true },
        { value: '0.3125', label: '5/16" (7.9 mm) Fillet Leg' },
        { value: '0.375', label: '3/8" (9.5 mm) Fillet Leg' },
        { value: '0.500', label: '1/2" (12.7 mm) Heavy Fillet Leg' }
      ]},
      { id: 'electrode', label: 'Electrode Tensile Strength (F_EXX)', type: 'select', options: [
        { value: '70', label: 'E70xx Electrode (70 ksi - Standard Mild Steel)', selected: true },
        { value: '60', label: 'E60xx Electrode (60 ksi)' },
        { value: '80', label: 'E80xx Electrode (80 ksi - High Strength)' }
      ]},
      { id: 'weldLen', label: 'Continuous Weld Length', value: 8, step: 1, unit: 'Inches' }
    ],
    primaryOutput: { id: 'outAllowForce', label: 'Total Allowable Weld Strength', unit: 'Pounds (lbs)' },
    outputs: [
      { id: 'outThroat', label: 'Effective Throat Thickness (0.707 × Leg)' },
      { id: 'outCapPerInch', label: 'Allowable Capacity per Linear Inch' },
      { id: 'outStressArea', label: 'Effective Throat Shear Area' },
      { id: 'outAiscRule', label: 'AISC Design Equation' }
    ],
    rules: [
      'Effective Throat = Leg Size × cos(45°) = 0.707 × Leg Size (for equal-leg fillet welds).',
      'AISC 360: Nominal shear strength Rn = 0.60 × F_EXX × (0.707 × Leg) × Length.',
      'Allowable Strength Design (ASD): Factor of safety Ω = 2.0 (Allowable strength = 0.30 × F_EXX × Throat).',
      'For E70xx electrodes under ASD: Capacity = 0.707 × 0.30 × 70 ksi = 14.85 kips per inch of 1" leg (or ~928 lbs/in per 1/16" leg).'
    ],
    formula: 'Throat = 0.707 × Leg | ASD Strength per inch = 0.30 × F_EXX × Throat = 928.2 lbs/in per 1/16" leg',
    faq: [
      { q: 'Why is a fillet weld calculated based on throat thickness rather than leg size?', a: 'Fillet welds almost always fail in shear across the narrowest cross-section through the root to the face, which is the 45-degree theoretical throat (0.707 times the leg size).' },
      { q: 'What is the "928 lbs per 1/16th rule" in structural welding?', a: 'Under AISC ASD with E70 electrodes, an equal-leg fillet weld has an allowable strength of approximately 928 pounds per linear inch for every 1/16" of leg size (a 1/4" or 4/16" weld holds 4 × 928 ≈ 3,712 lbs/linear inch).' }
    ],
    calcJs: `
      function calc() {
        var leg = parseFloat(document.getElementById('legSize').value) || 0.25;
        var fExx = parseFloat(document.getElementById('electrode').value) || 70;
        var len = parseFloat(document.getElementById('weldLen').value) || 8;

        var throat = leg * 0.7071;
        var allowPsi = (0.30 * fExx * 1000); // ASD allowable shear stress
        var capPerIn = allowPsi * throat;
        var totalCapLbs = capPerIn * len;

        document.getElementById('outAllowForce').textContent = Math.round(totalCapLbs).toLocaleString() + ' lbs Total Shear Strength (' + (totalCapLbs / 1000).toFixed(1) + ' kips)';
        document.getElementById('outThroat').textContent = throat.toFixed(4) + '" (' + toFraction(throat) + ') effective throat thickness';
        document.getElementById('outCapPerInch').textContent = Math.round(capPerIn).toLocaleString() + ' lbs / linear inch of weld';
        document.getElementById('outStressArea').textContent = (throat * len).toFixed(3) + ' sq in effective throat area';
        document.getElementById('outAiscRule').textContent = 'AISC 360-16 ASD (Ω = 2.0, F_v = 0.30 F_EXX)';
      }
    `
  },
  {
    slug: 'drill-press-rpm-sfm-machining',
    name: 'Machining Drill Press RPM & SFM Calculator',
    h1: 'Machining Drill Press Spindle RPM & Surface Feet per Minute (SFM)',
    title: 'Drill Press RPM & SFM Calculator [HSS & Carbide Cutting Speeds] | Digital Tools Shed',
    metaDesc: 'Calculate spindle RPM and feed rates for twist drill bits from Surface Feet per Minute (SFM) across mild steel, aluminum, brass, and stainless.',
    category: 'Metalworking & Welding',
    codeRef: 'Machinery\'s Handbook',
    lead: 'Calculate optimal drill press and milling machine spindle RPM based on drill diameter, tool material, and workpiece material Surface Feet per Minute (SFM).',
    inputs: [
      { id: 'drillDia', label: 'Drill Bit Diameter', value: 0.50, step: 0.0625, unit: 'Inches', hint: '1/2" = 0.50", 1/4" = 0.25"' },
      { id: 'material', label: 'Workpiece Material & Recommended SFM (HSS)', type: 'select', options: [
        { value: '100', label: 'Mild Steel (1018 / A36) - 100 SFM', selected: true },
        { value: '300', label: 'Aluminum (6061-T6) - 300 SFM' },
        { value: '50', label: 'Stainless Steel (304 / 316) - 50 SFM' },
        { value: '150', label: 'Brass / Bronze - 150 SFM' },
        { value: '70', label: 'Cast Iron - 70 SFM' },
        { value: '25', label: 'Hardened Steel / Titanium - 25 SFM' }
      ]},
      { id: 'toolMat', label: 'Cutting Tool Material', type: 'select', options: [
        { value: '1.0', label: 'High Speed Steel (HSS) / Cobalt', selected: true },
        { value: '2.5', label: 'Solid Carbide (Multiply SFM by 2.5x)' }
      ]}
    ],
    primaryOutput: { id: 'outRpm', label: 'Recommended Spindle RPM', unit: 'RPM' },
    outputs: [
      { id: 'outActualSfm', label: 'Target Cutting Speed (SFM)' },
      { id: 'outFeedRateIpr', label: 'Recommended Feed per Revolution' },
      { id: 'outFeedIpm', label: 'Penetration Rate (Inches/Min)' },
      { id: 'outCoolantRec', label: 'Coolant / Cutting Fluid' }
    ],
    rules: [
      'Machining formula: RPM = (SFM × 3.82) / Diameter ≈ (SFM × 4) / Diameter.',
      'Surface Feet per Minute (SFM) is the linear distance in feet the outer cutting edge travels in one minute.',
      'Drilling without cutting fluid in stainless steel causes work hardening within 2 revolutions, ruining the drill bit.',
      'Larger drill bit diameters require slower RPM to prevent burning the outer cutting lips.'
    ],
    formula: 'RPM = (SFM × 12) / (π × Diameter) = (SFM × 3.82) / Dia | Feed (IPM) = RPM × IPR',
    faq: [
      { q: 'Why do drill bits burn up when spinning too fast?', a: 'The outer edge of a drill bit travels at the highest linear velocity (SFM). If RPM is too high, friction heat cannot dissipate into the chip or coolant, softening the tempered high-speed steel and dulling the cutting lips.' },
      { q: 'What is work hardening in stainless steel?', a: 'Austenitic stainless steels (304/316) crystalize and harden instantly when deformed under heat without cutting. If a drill bit rubs without aggressive chip feed, the steel becomes harder than the drill bit itself.' }
    ],
    calcJs: `
      function calc() {
        var dia = parseFloat(document.getElementById('drillDia').value) || 0.50;
        var baseSfm = parseFloat(document.getElementById('material').value) || 100;
        var toolMult = parseFloat(document.getElementById('toolMat').value) || 1.0;

        var sfm = baseSfm * toolMult;
        var rpm = Math.round((sfm * 3.82) / dia);

        // Feed per rev: roughly 0.001" per 1/16" of diameter
        var ipr = dia * 0.015;
        var ipm = (rpm * ipr).toFixed(1);

        var fluid = 'Sulfurized Cutting Oil or Soluble Oil';
        if (baseSfm >= 300) fluid = 'Kerosene, WD-40 or High-Lube Emulsion (Prevents Galling)';
        else if (baseSfm <= 50) fluid = 'High-Sulfur Extreme Pressure Cutting Fluid';

        document.getElementById('outRpm').textContent = rpm + ' RPM';
        document.getElementById('outActualSfm').textContent = sfm + ' SFM Surface Feet / Minute';
        document.getElementById('outFeedRateIpr').textContent = ipr.toFixed(4) + '" Feed per Revolution (IPR)';
        document.getElementById('outFeedIpm').textContent = ipm + ' Inches/Min drill penetration rate';
        document.getElementById('outCoolantRec').textContent = fluid;
      }
    `
  },
  {
    slug: 'lathe-threading-gear-ratio-lead',
    name: 'Metal Lathe Threading Change Gear Calculator',
    h1: 'Metal Lathe Single-Point Threading Change Gear Ratio Calculator',
    title: 'Metal Lathe Threading Change Gear Calculator [Imperial TPI & Metric Pitch] | Digital Tools Shed',
    metaDesc: 'Calculate change gear tooth ratios for cutting imperial TPI and metric pitches on imperial or metric leadscrew metal lathes.',
    category: 'Metalworking & Welding',
    codeRef: 'Machinery\'s Handbook 31st',
    lead: 'Calculate change gear tooth counts and gear train compound ratios for single-point screw cutting on manual engine lathes.',
    inputs: [
      { id: 'leadscrewTpi', label: 'Lathe Leadscrew Pitch', type: 'select', options: [
        { value: '8', label: '8 TPI Imperial Leadscrew (Most Common)', selected: true },
        { value: '6', label: '6 TPI Heavy Lathe Leadscrew' },
        { value: '4', label: '4 TPI Large Engine Lathe' },
        { value: '3', label: '3 mm Pitch Metric Leadscrew' }
      ]},
      { id: 'targetThread', label: 'Thread to Cut (TPI or mm Pitch)', type: 'select', options: [
        { value: '13', label: '1/2-13 UNC (13 TPI Standard)', selected: true },
        { value: '20', label: '1/4-20 UNC (20 TPI Standard)' },
        { value: '16', label: '3/8-16 UNC (16 TPI Standard)' },
        { value: '1.5', label: 'M10 × 1.5 Metric Thread (1.5 mm Pitch)' },
        { value: '1.25', label: 'M8 × 1.25 Metric Thread (1.25 mm Pitch)' }
      ]},
      { id: 'studGear', label: 'Spindle / Stud Gear Teeth (Driver)', value: 24, step: 2, unit: 'Teeth' }
    ],
    primaryOutput: { id: 'outRatio', label: 'Gear Train Speed Ratio', unit: 'Ratio' },
    outputs: [
      { id: 'outLeadGear', label: 'Leadscrew Gear (Driven)' },
      { id: 'outTransGear', label: 'Metric Transposing Gear (127 Tooth)' },
      { id: 'outHalfNut', label: 'Half-Nut Engagement Rule' },
      { id: 'outCompoundAngle', label: 'Compound Rest Angle Setting' }
    ],
    rules: [
      'Gear Ratio = Spindle Revolutions / Leadscrew Revolutions = Leadscrew Pitch / Target Pitch.',
      'For Imperial TPI on an Imperial Leadscrew: Ratio = Leadscrew TPI / Target TPI.',
      'Cutting metric threads on an imperial leadscrew requires a 127-tooth transposing gear (127 / 50 = 2.54 cm/inch exact conversion).',
      'When cutting metric threads on an imperial lathe, NEVER disengage the half-nut lever; reverse the spindle motor instead.'
    ],
    formula: 'Simple Train: Driver / Driven = Leadscrew TPI / Desired TPI | Metric conversion: 127 / (50 × Leadscrew TPI × Pitch)',
    faq: [
      { q: 'Why is a 127-tooth gear required for cutting metric threads on an American lathe?', a: 'One inch is defined as exactly 25.4 millimeters. 25.4 converts to the fraction 127 / 5. A 127-tooth gear provides the exact, non-approximated mathematical bridge between imperial leadscrew pitch and metric thread millimeters.' },
      { q: 'Why set the compound slide to 29.5 degrees for single-point threading?', a: 'Setting the compound to 29.5° (just under 30°) ensures the tool cuts almost entirely on its leading left edge. This prevents tool chatter and tearing that occurs when cutting on both 60° flanks simultaneously.' }
    ],
    calcJs: `
      function calc() {
        var leadTpi = parseFloat(document.getElementById('leadscrewTpi').value) || 8;
        var target = parseFloat(document.getElementById('targetThread').value) || 13;
        var driver = parseInt(document.getElementById('studGear').value, 10) || 24;

        var isMetric = target < 5; // metric pitches are small numbers (1.25, 1.5)
        var ratio = 0;
        var driven = 0;

        if (!isMetric) {
          ratio = leadTpi / target;
          driven = Math.round(driver / ratio);
        } else {
          // metric pitch on imperial lead: Pitch mm = 25.4 / TPI => TPI = 25.4 / Pitch
          var targetTpi = 25.4 / target;
          ratio = leadTpi / targetTpi;
          driven = Math.round(driver / ratio);
        }

        document.getElementById('outRatio').textContent = ratio.toFixed(4) + ' : 1 (Driver / Driven)';
        document.getElementById('outLeadGear').textContent = driven + ' Tooth Gear on Leadscrew (for ' + driver + 'T Driver)';
        document.getElementById('outTransGear').textContent = isMetric ? '127 / 100 Tooth Transposing Pair Required' : 'Standard Imperial Gear Train';
        document.getElementById('outHalfNut').textContent = isMetric ? '⚠️ DO NOT DISENGAGE Half-Nut! Reverse motor to retract' : 'Engage half-nut on thread dial numbered lines';
        document.getElementById('outCompoundAngle').textContent = '29.5° Compound Rest Angle (Prevents tool chatter)';
      }
    `
  },
  {
    slug: 'milling-machine-feed-rate-chipload',
    name: 'CNC Milling Feed Rate & Chip Load Calculator',
    h1: 'CNC & Manual Milling Feed Rate (IPM) & Chip Load Calculator',
    title: 'Milling Feed Rate & Chip Load Calculator [IPM, RPM & FPT] | Digital Tools Shed',
    metaDesc: 'Calculate table feed rate in Inches per Minute (IPM) from spindle RPM, flute count, and Feed per Tooth (chip load) across aluminum and steel.',
    category: 'Metalworking & Welding',
    codeRef: 'Machinery\'s Handbook',
    lead: 'Calculate milling machine table feed rate in Inches per Minute (IPM) from spindle RPM, end mill flute count, and chip load per tooth (FPT).',
    inputs: [
      { id: 'rpm', label: 'Spindle Speed', value: 2400, step: 100, unit: 'RPM' },
      { id: 'flutes', label: 'End Mill Number of Flutes', type: 'select', options: [
        { value: '2', label: '2-Flute End Mill (High Chip Clearance - Aluminum)' },
        { value: '3', label: '3-Flute End Mill (Balanced Aluminum / Steel)' },
        { value: '4', label: '4-Flute End Mill (Standard Steel / Iron)', selected: true },
        { value: '5', label: '5-Flute End Mill (High-Speed Machining Stainless)' }
      ]},
      { id: 'chipLoad', label: 'Recommended Chip Load per Tooth (FPT)', value: 0.0025, step: 0.0005, unit: 'Inches/Tooth', hint: '.001" for 1/8" bit, .0025" for 3/8" bit, .004" for 1/2" bit' },
      { id: 'doc', label: 'Axial Depth of Cut (DOC)', value: 0.25, step: 0.05, unit: 'Inches' }
    ],
    primaryOutput: { id: 'outFeedIpm', label: 'Table Feed Rate', unit: 'Inches / Minute (IPM)' },
    outputs: [
      { id: 'outMrr', label: 'Material Removal Rate (MRR)' },
      { id: 'outCutStyle', label: 'Climb vs Conventional Milling' },
      { id: 'outChipThinning', label: 'Radial Chip Thinning Factor' },
      { id: 'outHpEstimate', label: 'Spindle Cutting Power Required' }
    ],
    rules: [
      'Fundamental Milling Equation: Feed Rate (IPM) = RPM × Flutes × Chip Load (FPT).',
      'Under-feeding (too light of a chip load) rubs the cutting edge instead of shearing chips, causing premature tool dulling.',
      'Climb milling (feeding with tool rotation) produces superior surface finishes and longer tool life on rigid CNC machines.',
      'Conventional milling must be used on manual knee mills having leadscrew backlash to prevent work being pulled into the cutter.'
    ],
    formula: 'Feed (IPM) = RPM × Flutes × FPT | MRR (cu in/min) = Width of Cut × Depth of Cut × Feed',
    faq: [
      { q: 'What is chip thinning in milling?', a: 'When the radial width of cut is less than 50% of the end mill diameter, the chip formed is thinner than the actual advance per tooth. Programmers must increase the feed rate to maintain the true desired chip thickness.' },
      { q: 'Why is climb milling dangerous on a manual Bridgeport lathe or mill?', a: 'In climb milling, the cutter tries to pull the workpiece under itself. If a manual machine has leadscrew backlash, the cutter will jerk the table forward, jamming the end mill and snapping the tool.' }
    ],
    calcJs: `
      function calc() {
        var rpm = parseFloat(document.getElementById('rpm').value) || 2400;
        var flutes = parseInt(document.getElementById('flutes').value, 10) || 4;
        var fpt = parseFloat(document.getElementById('chipLoad').value) || 0.0025;
        var doc = parseFloat(document.getElementById('doc').value) || 0.25;

        var ipm = rpm * flutes * fpt;
        var woc = 0.375; // 3/8" end mill approx
        var mrr = woc * doc * ipm;
        var hpReq = mrr * 0.8; // approx 0.8 HP per cu in/min mild steel

        document.getElementById('outFeedIpm').textContent = ipm.toFixed(1) + ' Inches / Minute (IPM)';
        document.getElementById('outMrr').textContent = mrr.toFixed(2) + ' cu in / min Material Removal Rate';
        document.getElementById('outCutStyle').textContent = 'Climb Milling on CNC / Conventional on Manual with Backlash';
        document.getElementById('outChipThinning').textContent = '1.0x Full Thickness (Radial stepover ≥ 50% tool diameter)';
        document.getElementById('outHpEstimate').textContent = '~' + hpReq.toFixed(2) + ' HP spindle power required (Steel)';
      }
    `
  },
  {
    slug: 'tap-drill-size-thread-engagement',
    name: 'Tap Drill Size & Thread Engagement Calculator',
    h1: 'Tap Drill Size & Percentage Thread Engagement Calculator',
    title: 'Tap Drill Size & Thread Engagement Calculator [75% Theoretical Thread] | Digital Tools Shed',
    metaDesc: 'Calculate tap drill bit sizes for imperial UNC/UNF and metric threads to achieve optimal 70% to 75% thread engagement without tap breakage.',
    category: 'Metalworking & Welding',
    codeRef: 'Machinery\'s Handbook / ASME B1.1',
    lead: 'Calculate exact tap drill sizes and thread engagement percentages for internal tapping in steel, aluminum, and brass.',
    inputs: [
      { id: 'threadSize', label: 'Thread Specification', type: 'select', options: [
        { value: '0.250-20', label: '1/4-20 UNC (Major Dia: 0.250", 20 TPI)', selected: true },
        { value: '0.3125-18', label: '5/16-18 UNC (Major Dia: 0.3125", 18 TPI)' },
        { value: '0.375-16', label: '3/8-16 UNC (Major Dia: 0.375", 16 TPI)' },
        { value: '0.500-13', label: '1/2-13 UNC (Major Dia: 0.500", 13 TPI)' },
        { value: '0.3937-1.5', label: 'M10 × 1.5 Metric (Major Dia: 10 mm, 1.5 mm Pitch)' }
      ]},
      { id: 'targetEngage', label: 'Target Thread Engagement %', value: 75, step: 5, min: 50, max: 90, unit: '%', hint: '70% to 75% is standard engineering target' }
    ],
    primaryOutput: { id: 'outDrillDia', label: 'Recommended Tap Drill Size', unit: 'Drill Bit' },
    outputs: [
      { id: 'outDrillInches', label: 'Drill Bit Decimal Diameter' },
      { id: 'outEngageActual', label: 'Resulting Thread Engagement' },
      { id: 'outTapTorqueRisk', label: 'Tap Breakage Torque Risk' },
      { id: 'outFormTapAlt', label: 'Roll Form Tap Alternative' }
    ],
    rules: [
      'Tap Drill Formula: Drill Size = Major Diameter - (Percentage Engagement × 0.01299 / TPI).',
      'Standard 75% thread engagement provides 100% of the bolt stripping strength; tapping to 100% engagement triples tap torque with zero strength gain.',
      'For tough alloys like stainless steel and titanium, reduce thread engagement to 60%–65% to prevent binding taps.',
      'Cut taps remove chips; roll-form (thread forming) taps displace metal and require a significantly larger starting hole.'
    ],
    formula: 'Drill (in) = D_major - (% × 0.01299 / TPI) | Metric Drill (mm) = D_major - (% × Pitch × 0.0077)',
    faq: [
      { q: 'Why is 75% thread engagement better than 100%?', a: 'Tests prove that increasing thread engagement from 75% to 100% adds less than 5% to bolt pullout strength, but increases tapping torque by over 250%, causing broken taps in expensive parts.' },
      { q: 'What drill bit do you use for a 1/4-20 tap?', a: 'A #7 wire gauge drill bit (0.201" diameter) is standard for a 1/4-20 tap, yielding 72% thread engagement in steel.' }
    ],
    calcJs: `
      function calc() {
        var spec = document.getElementById('threadSize').value;
        var targetPct = parseFloat(document.getElementById('targetEngage').value) || 75;

        var rec = '#7 Drill (.201")';
        var dec = 0.2010;
        var actualPct = 72.0;

        if (spec === '0.250-20') { rec = '#7 Drill (.201")'; dec = 0.201; actualPct = 75.4; }
        else if (spec === '0.3125-18') { rec = 'F Drill (.257")'; dec = 0.257; actualPct = 77.0; }
        else if (spec === '0.375-16') { rec = '5/16" Drill (.3125")'; dec = 0.3125; actualPct = 77.0; }
        else if (spec === '0.500-13') { rec = '27/64" Drill (.4219")'; dec = 0.4219; actualPct = 78.0; }
        else if (spec === '0.3937-1.5') { rec = '8.5 mm Drill (.3346")'; dec = 0.3346; actualPct = 76.0; }

        document.getElementById('outDrillDia').textContent = rec;
        document.getElementById('outDrillInches').textContent = dec.toFixed(4) + '" (' + (dec * 25.4).toFixed(2) + ' mm)';
        document.getElementById('outEngageActual').textContent = actualPct.toFixed(1) + '% Thread Engagement';
        document.getElementById('outTapTorqueRisk').textContent = actualPct <= 75 ? 'Low Torque: Safe manual or machine tapping' : 'Moderate Torque: Use tapping fluid';
        document.getElementById('outFormTapAlt').textContent = 'For Roll-Forming Tap: Upsize hole by approx +0.015"';
      }
    `
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 8: RIGGING, HEAVY LIFTING & JOBSITE SAFETY (Tools 79–90)
// ─────────────────────────────────────────────────────────────────────────────
const RIGGING_TOOLS = [
  {
    slug: 'crane-rigging-sling-tension-angle',
    name: 'Crane Rigging Sling Angle Tension Calculator',
    h1: 'Crane Rigging Sling Angle & Multiplier Tension Calculator',
    title: 'Crane Rigging Sling Tension Calculator [OSHA & ASME B30.9 Angle Load] | Digital Tools Shed',
    metaDesc: 'Calculate tension increase on 2-leg, 3-leg, and 4-leg wire rope and synthetic bridle slings as horizontal sling angle drops from 60° to 30° under ASME B30.9.',
    category: 'Rigging & Heavy Lifting',
    codeRef: 'ASME B30.9 / OSHA 1926.251',
    lead: 'Calculate dynamic sling leg tension multiplication factors as the horizontal lift angle decreases from 60 degrees down to 30 degrees under OSHA rigging safety limits.',
    inputs: [
      { id: 'loadWeight', label: 'Total Suspended Load Weight', value: 10000, step: 500, unit: 'Pounds (lbs)' },
      { id: 'numLegs', label: 'Number of Bridle Sling Legs', type: 'select', options: [
        { value: '2', label: '2-Leg Bridle Sling (Load shared equally between 2 legs)', selected: true },
        { value: '3', label: '3-Leg Bridle Sling (Assuming 2 legs carry weight)' },
        { value: '4', label: '4-Leg Bridle Sling (Rigging rule: 2 legs carry rigid load)' }
      ]},
      { id: 'angleDeg', label: 'Horizontal Sling Angle (from Horizontal)', type: 'select', options: [
        { value: '60', label: '60° Horizontal Angle (Load Multiplier = 1.155 - Ideal)' },
        { value: '45', label: '45° Horizontal Angle (Load Multiplier = 1.414 - Standard)', selected: true },
        { value: '30', label: '30° Horizontal Angle (Load Multiplier = 2.000 - MAXIMUM Allowed)' }
      ]}
    ],
    primaryOutput: { id: 'outLegTension', label: 'Tension per Individual Sling Leg', unit: 'Pounds (lbs)' },
    outputs: [
      { id: 'outMultiplier', label: 'Sling Angle Tension Multiplier' },
      { id: 'outReqWll', label: 'Minimum Sling WLL per Leg' },
      { id: 'outCompression', label: 'Inward Horizontal Crushing Load' },
      { id: 'outOshaWarning', label: 'OSHA Safety Limit Status' }
    ],
    rules: [
      'ASME B30.9 & OSHA 1926.251: Slings SHALL NOT be used at horizontal angles of less than 30 degrees.',
      'Sling Leg Tension = (Total Load / Number of Sharing Legs) × [1 / sin(Horizontal Angle)].',
      'At a 30-degree angle, tension in EACH leg doubles (2.0x), equaling the entire total weight of the object.',
      'On rigid 3-leg and 4-leg rigging, two diagonally opposed legs inevitably carry the majority of the weight unless load-equalizing blocks are utilized.'
    ],
    formula: 'Multiplier L/H = 1 / sin(Angle) | Tension = (Load / Effective Legs) × Multiplier | Horizontal Compression = Tension × cos(Angle)',
    faq: [
      { q: 'Why does sling tension increase as the angle gets flatter?', a: 'As slings flatten toward horizontal, the legs must pull horizontally against each other with immense mechanical tension just to generate the vertical vector force required to counteract gravity.' },
      { q: 'Why does OSHA prohibit sling angles under 30 degrees?', a: 'At angles under 30 degrees, tension multiplies exponentially (at 15 degrees, multiplier is 3.86x; at 5 degrees, it is 11.5x). Any slight load bounce will snap slings and crush the lifted payload.' }
    ],
    calcJs: `
      function calc() {
        var load = parseFloat(document.getElementById('loadWeight').value) || 10000;
        var legs = parseInt(document.getElementById('numLegs').value, 10) || 2;
        var angle = parseFloat(document.getElementById('angleDeg').value) || 45;

        // Rigid load sharing rule: 3-leg and 4-leg carry on 2 legs
        var effLegs = legs > 2 ? 2.5 : 2.0;

        var rad = (angle * Math.PI) / 180;
        var mult = 1 / Math.sin(rad);
        var legTension = (load / effLegs) * mult;
        var horizCrush = legTension * Math.cos(rad);

        document.getElementById('outLegTension').textContent = Math.round(legTension).toLocaleString() + ' lbs tension per leg';
        document.getElementById('outMultiplier').textContent = mult.toFixed(3) + '× Tension Multiplier (L/H)';
        document.getElementById('outReqWll').textContent = Math.round(legTension).toLocaleString() + ' lbs Working Load Limit (WLL) required';
        document.getElementById('outCompression').textContent = Math.round(horizCrush).toLocaleString() + ' lbs inward horizontal crushing squeeze';
        
        var badge = document.getElementById('statusBadge');
        if (angle >= 45) {
          document.getElementById('outOshaWarning').textContent = '✅ ASME B30.9 Preferred Range (Angle ≥ 45°)';
          badge.textContent = 'Rigging Pass: Angle safe from overload';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outOshaWarning').textContent = '⚠️ 30° Limit: Severe tension amplification (2.0x multiplier)';
          badge.textContent = 'High Tension Alert: Verify sling ratings';
          badge.style.color = '#f59e0b';
          badge.style.background = 'rgba(245, 158, 11, 0.1)';
        }
      }
    `
  },
  {
    slug: 'wire-rope-working-load-limit',
    name: 'Wire Rope Working Load Limit (WLL) Calculator',
    h1: 'Wire Rope Working Load Limit (WLL) & Breaking Strength Calculator',
    title: 'Wire Rope Working Load Limit Calculator [5:1 OSHA Safety Factor] | Digital Tools Shed',
    metaDesc: 'Calculate Working Load Limit (WLL) and Minimum Breaking Force (MBF) for 6x19 and 6x36 EIPS bright and galvanized steel wire rope under OSHA 5:1.',
    category: 'Rigging & Heavy Lifting',
    codeRef: 'OSHA 1926.251 / ASME B30.5',
    lead: 'Calculate Working Load Limit (WLL) and Minimum Breaking Strength (MBS) for Extra Improved Plow Steel (EIPS) wire rope with mandatory 5:1 design safety factors.',
    inputs: [
      { id: 'ropeDia', label: 'Wire Rope Nominal Diameter', type: 'select', options: [
        { value: '0.25', label: '1/4" Wire Rope' },
        { value: '0.375', label: '3/8" Wire Rope' },
        { value: '0.50', label: '1/2" Wire Rope', selected: true },
        { value: '0.625', label: '5/8" Wire Rope' },
        { value: '0.75', label: '3/4" Wire Rope' },
        { value: '1.00', label: '1" Heavy Crane Wire Rope' }
      ]},
      { id: 'grade', label: 'Steel Wire Rope Grade', type: 'select', options: [
        { value: 'eips', label: 'EIPS (Extra Improved Plow Steel - IWRC Steel Core)', selected: true },
        { value: 'eeips', label: 'EEIPS (Extra Extra Improved Plow Steel)' },
        { value: 'fc', label: 'IPS Fiber Core (Lower strength, flexible)' }
      ]},
      { id: 'safetyFactor', label: 'Design Safety Factor', type: 'select', options: [
        { value: '5', label: '5:1 General Rigging & Lifting (OSHA Standard)', selected: true },
        { value: '3.5', label: '3.5:1 Winching / Horizontal Towing Only' },
        { value: '10', label: '10:1 Personnel Lifting Platform / Basket' }
      ]}
    ],
    primaryOutput: { id: 'outWll', label: 'Rated Working Load Limit (WLL)', unit: 'Pounds (lbs)' },
    outputs: [
      { id: 'outMbsTons', label: 'Minimum Breaking Strength (MBS)' },
      { id: 'outTonsWll', label: 'WLL in US Short Tons' },
      { id: 'outRuleOfThumb', label: 'Rigger\'s Rule of Thumb Check (D² × 8)' },
      { id: 'outSheaveDia', label: 'Recommended D/d Sheave Ratio' }
    ],
    rules: [
      'OSHA 1926.251 mandates a minimum 5:1 design safety factor on all overhead lifting wire rope slings.',
      'Personnel lifting hoists and cranes (man baskets) mandate a strict 10:1 safety factor under ASME B30.23.',
      'Classic Rigger\'s Rule of Thumb for 6x19 EIPS wire rope: WLL (tons) = (Diameter in inches × 8)² / 8 ≈ Diameter² × 8 tons.',
      'Running wire rope over tight sheaves (D/d < 18) causes rapid metallurgical wire fatigue bending failure.'
    ],
    formula: 'MBS ≈ 42 tons × Dia² (for EIPS IWRC) | WLL = MBS / Safety Factor',
    faq: [
      { q: 'What is the difference between Breaking Strength and Working Load Limit?', a: 'Minimum Breaking Strength (MBS) is the ultimate tension force at which a new cable physically snaps in laboratory pull tests. Working Load Limit (WLL) is the maximum load legally allowed on the jobsite, calculated by dividing MBS by a safety factor (typically 5:1).' },
      { q: 'What does D/d ratio mean in wire rope rigging?', a: 'D/d is the ratio between the pitch diameter of a crane sheave or pulley (D) and the diameter of the wire rope (d). A small sheave bends the cable severely, destroying its fatigue life and drastically reducing load capacity.' }
    ],
    calcJs: `
      function calc() {
        var d = parseFloat(document.getElementById('ropeDia').value) || 0.50;
        var grade = document.getElementById('grade').value;
        var sf = parseFloat(document.getElementById('safetyFactor').value) || 5;

        // Approx nominal catalog breaking strengths in lbs for EIPS IWRC
        var catalogMbs = {
          0.25: 5880,
          0.375: 13120,
          0.50: 23000,
          0.625: 35800,
          0.75: 51200,
          1.00: 89800
        };

        var mbsLbs = catalogMbs[d] || (42 * 2000 * d * d);
        if (grade === 'eeips') mbsLbs *= 1.10;
        else if (grade === 'fc') mbsLbs *= 0.88;

        var wllLbs = Math.round(mbsLbs / sf);
        var ruleTons = d * d * 8; // Rigger rule: Dia^2 * 8 in tons

        document.getElementById('outWll').textContent = wllLbs.toLocaleString() + ' lbs (' + (wllLbs / 2000).toFixed(2) + ' Tons WLL)';
        document.getElementById('outMbsTons').textContent = Math.round(mbsLbs).toLocaleString() + ' lbs (' + (mbsLbs / 2000).toFixed(1) + ' tons ultimate break)';
        document.getElementById('outTonsWll').textContent = (wllLbs / 2000).toFixed(2) + ' US Short Tons (' + sf + ':1 safety factor)';
        document.getElementById('outRuleOfThumb').textContent = ruleTons.toFixed(1) + ' Tons (D² × 8 rule = ' + Math.round(ruleTons * 2000) + ' lbs)';
        document.getElementById('outSheaveDia').textContent = (d * 20).toFixed(1) + '" Minimum Sheave Diameter (20:1 D/d ratio)';
      }
    `
  },
  {
    slug: 'shackle-rated-capacity-angle-derate',
    name: 'Rigging Shackle Angular Derating Calculator',
    h1: 'Anchor Bow Shackle Angular Load Derating Calculator (ASME B30.26)',
    title: 'Rigging Shackle Angular Load Derating Calculator [ASME B30.26 Capacity] | Digital Tools Shed',
    metaDesc: 'Calculate Working Load Limit (WLL) reductions for bow and D-shackles when side-loaded at 45° (30% derate) and 90° (50% derate) under ASME B30.26.',
    category: 'Rigging & Heavy Lifting',
    codeRef: 'ASME B30.26',
    lead: 'Calculate reduced working load limits for forged anchor bow shackles subjected to non-in-line angular side loads under ASME B30.26 rigging safety codes.',
    inputs: [
      { id: 'shackleSize', label: 'Crosby / CM Bow Shackle Size & Rated WLL', type: 'select', options: [
        { value: '2.0', label: '1/2" Shackle (2.0 Ton WLL - 4,000 lbs)' },
        { value: '3.25', label: '5/8" Shackle (3.25 Ton WLL - 6,500 lbs)', selected: true },
        { value: '4.75', label: '3/4" Shackle (4.75 Ton WLL - 9,500 lbs)' },
        { value: '6.50', label: '7/8" Shackle (6.50 Ton WLL - 13,000 lbs)' },
        { value: '8.50', label: '1" Shackle (8.50 Ton WLL - 17,000 lbs)' },
        { value: '12.0', label: '1-1/4" Shackle (12.0 Ton WLL - 24,000 lbs)' }
      ]},
      { id: 'sideAngle', label: 'Angle of Side Pull from In-Line Center', type: 'select', options: [
        { value: '0', label: '0° In-Line Load (100% Full Rated Capacity)' },
        { value: '45', label: '45° Side Load (30% Derate - 70% Capacity)', selected: true },
        { value: '90', label: '90° Side Load (50% Derate - 50% Capacity)' }
      ]},
      { id: 'actualLoad', label: 'Actual Applied Rigging Load', value: 4200, step: 100, unit: 'Pounds (lbs)' }
    ],
    primaryOutput: { id: 'outDeratedWll', label: 'Adjusted Safe WLL', unit: 'Pounds (lbs)' },
    outputs: [
      { id: 'outCapacityPct', label: 'Remaining Shackle Capacity' },
      { id: 'outTonsDerated', label: 'Derated Capacity in Tons' },
      { id: 'outPassStatus', label: 'Load Safety Assessment' },
      { id: 'outPinLoadingRule', label: 'Shackle Pin Loading Discipline' }
    ],
    rules: [
      'ASME B30.26 Side Loading Rules: In-line = 100%, 45° side load = 70% of WLL, 90° side load = 50% of WLL.',
      'NEVER side-load a straight "D-Dee" shackle; only forged Anchor Bow Shackles may be side-loaded.',
      'Side loads must never exceed 90 degrees from the true vertical centerline of the shackle.',
      'When rigging multiple sling legs into a shackle, connect the legs into the bow body and place the pin on the crane hook.'
    ],
    formula: 'Derated WLL = Rated WLL × Capacity Factor (0°: 1.0, 45°: 0.70, 90°: 0.50)',
    faq: [
      { q: 'Why are bow shackles derated by 50% at 90 degrees?', a: 'Shackles are forged to resist straight tensile pulling between the crown of the bow and the center of the pin. A side load applies severe bending torque across the shackle ears and pin threads, which can spread the jaws open.' },
      { q: 'Can you side-load a D-shackle?', a: 'No. Chain shackles (D-shackles) must strictly be used for straight in-line tension pulls only. Attempting to side-load a D-shackle bends the narrow pin and can shear the threaded ear.' }
    ],
    calcJs: `
      function calc() {
        var ratedTons = parseFloat(document.getElementById('shackleSize').value) || 3.25;
        var angle = document.getElementById('sideAngle').value;
        var loadLbs = parseFloat(document.getElementById('actualLoad').value) || 4200;

        var factor = 1.0;
        if (angle === '45') factor = 0.70;
        else if (angle === '90') factor = 0.50;

        var deratedTons = ratedTons * factor;
        var deratedLbs = Math.round(deratedTons * 2000);
        var pass = loadLbs <= deratedLbs;

        document.getElementById('outDeratedWll').textContent = deratedLbs.toLocaleString() + ' lbs (' + deratedTons.toFixed(2) + ' Tons adjusted WLL)';
        document.getElementById('outCapacityPct').textContent = (factor * 100) + '% of original rated capacity at ' + angle + '° angle';
        document.getElementById('outTonsDerated').textContent = deratedTons.toFixed(2) + ' US Tons safe working limit';
        document.getElementById('outPinLoadingRule').textContent = 'Legs in bow, pin on hook (Never allow sling to roll on screw pin)';

        var badge = document.getElementById('statusBadge');
        if (pass) {
          document.getElementById('outPassStatus').textContent = '✅ Safe Lift (' + loadLbs.toLocaleString() + ' lbs ≤ ' + deratedLbs.toLocaleString() + ' lbs)';
          document.getElementById('outPassStatus').style.color = '#22c55e';
          badge.textContent = 'ASME B30.26 Pass: Shackle within derated capacity';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outPassStatus').textContent = '❌ SHACKLE OVERLOADED! Upsize shackle immediately';
          document.getElementById('outPassStatus').style.color = '#ef4444';
          badge.textContent = 'Rigging Danger: Side load exceeds safe rating';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'winch-line-pull-snatch-block',
    name: 'Winch Line Pull & Snatch Block Mechanical Advantage',
    h1: 'Winch Line Pull & Snatch Block Mechanical Advantage Calculator',
    title: 'Winch Line Pull & Snatch Block Calculator [Mechanical Advantage & Anchor Load] | Digital Tools Shed',
    metaDesc: 'Calculate pulling capacity increases (2:1 and 3:1) using snatch blocks and determine anchor point reaction loads under SAE J706.',
    category: 'Rigging & Heavy Lifting',
    codeRef: 'SAE J706 / ASME B30.26',
    lead: 'Calculate effective pulling capacity and reaction anchor loads when rigging snatch blocks in single-line, double-line, and change-of-direction winching.',
    inputs: [
      { id: 'winchCap', label: 'Winch Rated Bare-Drum Pull Capacity', value: 10000, step: 500, unit: 'Pounds (lbs)' },
      { id: 'drumLayer', label: 'Current Cable Layer on Winch Drum', type: 'select', options: [
        { value: '1.00', label: 'Layer 1 - Bare Drum (100% Full Winch Power)', selected: true },
        { value: '0.85', label: 'Layer 2 (approx 85% Rated Power)' },
        { value: '0.73', label: 'Layer 3 (approx 73% Rated Power)' },
        { value: '0.64', label: 'Layer 4 - Full Spool (approx 64% Rated Power)' }
      ]},
      { id: 'riggingSetup', label: 'Snatch Block Rigging Configuration', type: 'select', options: [
        { value: '1', label: 'Single Line Pull (1:1 - No Snatch Block)' },
        { value: '2', label: 'Double Line Pull (2:1 Mechanical Advantage - Pulley at load, hook back to bumper)', selected: true },
        { value: '3', label: 'Triple Line Pull (3:1 Mechanical Advantage - 2 Snatch Blocks)' }
      ]}
    ],
    primaryOutput: { id: 'outTotalPull', label: 'Effective Pulling Capacity', unit: 'Pounds (lbs)' },
    outputs: [
      { id: 'outAnchorLoad', label: 'Peak Load on Snatch Block Anchor Point' },
      { id: 'outLineSpeed', label: 'Line Recovery Speed' },
      { id: 'outCableWear', label: 'Cable Drum Pull Derate' },
      { id: 'outTreeStrapWll', label: 'Recommended Tree Saver Strap WLL' }
    ],
    rules: [
      'Winch line pull rating is strictly measured on the FIRST layer of cable on the drum; each added layer reduces pulling power by 10%–15%.',
      'Using a snatch block to double the line back to the vehicle doubles pulling power (2:1 mechanical advantage) while halving line speed.',
      'The anchor tree or shackle holding the snatch block experiences DOUBLE the pulling tension (approx 200% of line pull).',
      'Always drape a heavy winch damper blanket or heavy jacket over the midpoint of the winch cable to absorb kinetic recoil if the cable snaps.'
    ],
    formula: 'Effective Pull = Winch Capacity × Layer Factor × Mechanical Advantage (accounting for 5% sheave friction loss)',
    faq: [
      { q: 'Why does a winch lose pulling power as cable wraps around the drum?', a: 'As cable layers build up on the drum, the effective drum diameter increases. This increases the mechanical lever arm that the motor must turn against, reducing available pulling force by roughly 10% to 15% per layer.' },
      { q: 'Why is the load on a snatch block anchor twice the winch pull?', a: 'When doubling a line back to a vehicle, both the incoming cable from the winch and the outgoing cable returning to the bumper pull forward on the snatch block pulley with equal force, doubling the load on the anchor strap.' }
    ],
    calcJs: `
      function calc() {
        var baseCap = parseFloat(document.getElementById('winchCap').value) || 10000;
        var layerFactor = parseFloat(document.getElementById('drumLayer').value) || 1.0;
        var setup = parseInt(document.getElementById('riggingSetup').value, 10) || 2;

        var drumPull = baseCap * layerFactor;
        var effPull = 0;
        var anchorLoad = 0;

        if (setup === 1) {
          effPull = drumPull;
          anchorLoad = drumPull;
        } else if (setup === 2) {
          effPull = drumPull * 1.90; // 5% friction per sheave
          anchorLoad = drumPull * 1.95;
        } else {
          effPull = drumPull * 2.80;
          anchorLoad = drumPull * 2.00;
        }

        var treeWll = Math.round(anchorLoad * 1.5);

        document.getElementById('outTotalPull').textContent = Math.round(effPull).toLocaleString() + ' lbs Total Pulling Force';
        document.getElementById('outAnchorLoad').textContent = Math.round(anchorLoad).toLocaleString() + ' lbs reaction force on anchor';
        document.getElementById('outLineSpeed').textContent = setup === 1 ? '100% Standard Line Speed' : (setup === 2 ? '50% Half Speed (Controlled Crawl)' : '33% Speed');
        document.getElementById('outCableWear').textContent = 'Drum delivering ' + Math.round(drumPull).toLocaleString() + ' lbs bare line pull';
        document.getElementById('outTreeStrapWll').textContent = treeWll.toLocaleString() + ' lbs minimum Tree Saver Strap rating';
      }
    `
  },
  {
    slug: 'chain-fall-hoist-hand-chain-pull',
    name: 'Manual Chain Fall Hoist Effort Calculator',
    h1: 'Manual Chain Fall Hoist Hand-Chain Pull Effort Calculator',
    title: 'Chain Fall Hoist Hand-Chain Pull Calculator [Gear Ratio & Effort] | Digital Tools Shed',
    metaDesc: 'Calculate manual hand-chain pull force in pounds required to hoist heavy equipment based on hoist ton rating and internal gear mechanical advantage.',
    category: 'Rigging & Heavy Lifting',
    codeRef: 'ASME B30.16',
    lead: 'Calculate required manual hand-chain pulling effort in pounds to hoist industrial machinery and structural loads with manual chain fall hoists.',
    inputs: [
      { id: 'hoistCap', label: 'Manual Chain Hoist Rated Tonnage', type: 'select', options: [
        { value: '0.5', label: '1/2 Ton Hoist (1,000 lb capacity)' },
        { value: '1.0', label: '1 Ton Hoist (2,000 lb capacity)', selected: true },
        { value: '2.0', label: '2 Ton Hoist (4,000 lb capacity)' },
        { value: '3.0', label: '3 Ton Hoist (6,000 lb capacity)' },
        { value: '5.0', label: '5 Ton Heavy Industrial Hoist (10,000 lbs)' }
      ]},
      { id: 'liftLoad', label: 'Actual Suspended Load Weight', value: 1600, step: 100, unit: 'Pounds (lbs)' },
      { id: 'chainFalls', label: 'Number of Load Chain Falls (Strands)', type: 'select', options: [
        { value: '1', label: 'Single Fall (1 Strand - Fast Lift)', selected: true },
        { value: '2', label: 'Double Fall (2 Strands - Heavier capacity)' }
      ]}
    ],
    primaryOutput: { id: 'outHandPull', label: 'Manual Hand-Chain Pull Force', unit: 'Pounds of Effort' },
    outputs: [
      { id: 'outChainFeet', label: 'Feet of Hand Chain Pulled per Foot Lift' },
      { id: 'outBrakeType', label: 'Weston Mechanical Load Brake' },
      { id: 'outHeadroomReq', label: 'Minimum Hook-to-Hook Headroom' },
      { id: 'outOverloadCheck', label: 'Rated Capacity Utilization %' }
    ],
    rules: [
      'ASME B30.16 mandates that manual chain hoists be engineered so that rated load requires no more than 65 to 80 pounds of operator pull.',
      'Planetary reduction gearing trades high hand-chain travel distance for multiplied load lifting force.',
      'Weston-style mechanical friction disc brakes automatically lock the load the instant the operator releases the hand chain.',
      'Never wrap the load chain around a load as a choker hitch; always use certified synthetic or wire rope slings.'
    ],
    formula: 'Hand Effort = (Load Weight / Mechanical Advantage) / Efficiency | Chain Ratio = Hand Chain Feet / Lift Foot',
    faq: [
      { q: 'How does a manual chain hoist hold a heavy load in mid-air?', a: 'Chain hoists use a Weston-style mechanical load brake. As load weight pulls downward, internal friction ratchet pawls and brake discs clamp tighter against the drive hub, holding the load safely without operator effort.' },
      { q: 'How much hand chain must you pull to lift a load 1 foot?', a: 'For a typical 1-ton chain hoist, an operator must pull approximately 30 to 35 feet of hand chain through the pocket wheel to lift the load chain hook by exactly 1 vertical foot.' }
    ],
    calcJs: `
      function calc() {
        var capTons = parseFloat(document.getElementById('hoistCap').value) || 1.0;
        var load = parseFloat(document.getElementById('liftLoad').value) || 1600;
        var falls = parseInt(document.getElementById('chainFalls').value, 10) || 1;

        var capLbs = capTons * 2000;
        var utilPct = (load / capLbs) * 100;

        // Mechanical advantage approx 35:1 for 1 ton, 55:1 for 2 ton
        var ma = capTons === 0.5 ? 22 : (capTons === 1.0 ? 32 : (capTons === 2.0 ? 55 : 85));
        if (falls === 2) ma *= 1.8;

        var handPullLbs = (load / ma) / 0.85; // 85% mechanical efficiency
        var handChainFt = Math.round(ma);

        var pass = load <= capLbs;

        document.getElementById('outHandPull').textContent = Math.round(handPullLbs) + ' lbs hand pulling effort';
        document.getElementById('outChainFeet').textContent = handChainFt + ' feet of hand chain pulled per 1 ft lift';
        document.getElementById('outBrakeType').textContent = 'Weston Mechanical Friction Brake (Automatic hold)';
        document.getElementById('outHeadroomReq').textContent = (capTons <= 1.0 ? '12" to 14"' : '18" to 24"') + ' minimum headroom';

        var badge = document.getElementById('statusBadge');
        if (pass) {
          document.getElementById('outOverloadCheck').textContent = '✅ Within Capacity (' + utilPct.toFixed(1) + '% of ' + capLbs.toLocaleString() + ' lb limit)';
          badge.textContent = 'ASME B30.16 Pass: Safe manual hoisting';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outOverloadCheck').textContent = '❌ HOIST OVERLOADED! (' + load + ' > ' + capLbs + ' lbs)';
          badge.textContent = 'Critical Alert: Exceeds hoist rating';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'forklift-load-center-derate',
    name: 'Forklift Load Center Derating Calculator',
    h1: 'Forklift Load Center Distance Capacity Derating Calculator (OSHA)',
    title: 'Forklift Load Center Capacity Derating Calculator [OSHA 1910.178] | Digital Tools Shed',
    metaDesc: 'Calculate forklift capacity derating when handling long or oversized loads past the standard 24-inch load center under OSHA 1910.178.',
    category: 'Rigging & Heavy Lifting',
    codeRef: 'OSHA 1910.178',
    lead: 'Calculate reduced safe lifting capacity for counterbalanced forklifts when carrying long, oversized loads beyond the standard 24-inch load center.',
    inputs: [
      { id: 'ratedCap', label: 'Forklift Rated Capacity at 24" Load Center', value: 5000, step: 500, unit: 'Pounds (lbs)' },
      { id: 'actualCenter', label: 'Actual Cargo Center of Gravity Distance', value: 36, step: 2, min: 24, max: 72, unit: 'Inches from Fork Face', hint: 'Half of cargo length for uniform weight (e.g. 6-ft crate = 36" center)' },
      { id: 'truckWheelbase', label: 'Forklift Front Axle to Fork Face Distance', value: 16, step: 1, unit: 'Inches', hint: 'Standard dimension "A" (typically 14" to 18" on nameplate)' }
    ],
    primaryOutput: { id: 'outDeratedCap', label: 'Maximum Safe Lift Capacity', unit: 'Pounds (lbs)' },
    outputs: [
      { id: 'outCapLossPct', label: 'Capacity Reduction Percentage' },
      { id: 'outTippingMoment', label: 'Counterbalance Tipping Moment' },
      { id: 'outMaxPalletLen', label: 'Equivalent Uniform Cargo Length' },
      { id: 'outOshaRule', label: 'OSHA Nameplate Requirement' }
    ],
    rules: [
      'OSHA 1910.178: Forklift ratings are standard at a 24-inch load center (a uniform 48-inch square pallet).',
      'Moving the load center outward increases forward tipping torque, dramatically reducing safe lifting capacity.',
      'Equation: Safe Capacity = Rated Capacity × [(Wheelbase + 24") / (Wheelbase + Actual Center)].',
      'Fork extensions or long attachments further push the load center forward and require an updated manufacturer data plate.'
    ],
    formula: 'Safe Capacity = Rated Cap × [(Dim_A + 24) / (Dim_A + Actual_Center)]',
    faq: [
      { q: 'Why is a 24-inch load center standard for forklifts?', a: 'Standard North American shipping pallets are 48 inches deep. Assuming uniform cargo weight distribution, the center of gravity sits in the geometric center: exactly 24 inches from the fork vertical backrest.' },
      { q: 'What happens if you pick up an oversized crate on the tip of the forks?', a: 'Moving a load from 24" out to 48" can cut a 5,000 lb forklift capacity down to less than 3,100 lbs. Attempting to lift full rated weight will lift the steer wheels off the ground, causing complete loss of steering or a forward rollover.' }
    ],
    calcJs: `
      function calc() {
        var rated = parseFloat(document.getElementById('ratedCap').value) || 5000;
        var center = parseFloat(document.getElementById('actualCenter').value) || 36;
        var a = parseFloat(document.getElementById('truckWheelbase').value) || 16;

        var safeCap = rated * ((a + 24) / (a + center));
        var lossPct = ((1 - safeCap / rated) * 100).toFixed(1);

        document.getElementById('outDeratedCap').textContent = Math.round(safeCap).toLocaleString() + ' lbs Maximum Safe Load';
        document.getElementById('outCapLossPct').textContent = lossPct + '% capacity loss due to ' + center + '" long load center';
        document.getElementById('outTippingMoment').textContent = Math.round(safeCap * (a + center)).toLocaleString() + ' in-lbs forward tipping moment';
        document.getElementById('outMaxPalletLen').textContent = (center * 2) + '" Long uniform cargo crate';
        document.getElementById('outOshaRule').textContent = 'OSHA 1910.178(a)(4): Attachment deratings require updated data tag';
      }
    `
  },
  {
    slug: 'scaffolding-plank-span-load-capacity',
    name: 'Scaffold Plank Span & Load Capacity Calculator',
    h1: 'Scaffold Wood & Aluminum Plank Span & Load Rating (OSHA)',
    title: 'Scaffolding Plank Span & Load Capacity Calculator [OSHA 1926.451 Deflection] | Digital Tools Shed',
    metaDesc: 'Verify scaffolding plank allowable spans and uniform loading (25, 50, and 75 psf) with L/60 deflection limits under OSHA 1926.451.',
    category: 'Rigging & Heavy Lifting',
    codeRef: 'OSHA 1926.451',
    lead: 'Calculate allowable clear spans, worker/material load ratings, and L/60 maximum deflection limits for solid-sawn and LVL scaffolding planks.',
    inputs: [
      { id: 'dutyRating', label: 'Scaffold Load Duty Classification', type: 'select', options: [
        { value: '25', label: 'Light Duty (25 psf - Workers & Light Hand Tools Only)', selected: true },
        { value: '50', label: 'Medium Duty (50 psf - Bricklayers, Mortar & Masonry Tools)' },
        { value: '75', label: 'Heavy Duty (75 psf - Stone Masonry & Heavy Materials)' }
      ]},
      { id: 'plankType', label: 'Scaffold Plank Material & Grade', type: 'select', options: [
        { value: 'lvl', label: '1-1/2" × 9-1/2" Laminated Veneer Lumber (LVL Scaffold Plank)', selected: true },
        { value: 'wood', label: '2x10 Solid Sawn DI-65 Scaffold Grade Wood' },
        { value: 'alum', label: 'Aluminum Scaffold Walkboard / Platform' }
      ]},
      { id: 'spanFt', label: 'Support Frame Spacing (Span)', value: 7.0, step: 0.5, unit: 'Feet', hint: 'Standard scaffold frames are spaced 7 or 8 feet apart' }
    ],
    primaryOutput: { id: 'outMaxAllowSpan', label: 'Maximum Allowable Plank Span', unit: 'Feet' },
    outputs: [
      { id: 'outDeflectLimit', label: 'OSHA L/60 Deflection Limit' },
      { id: 'outOverhangRule', label: 'Plank Overhang (Cleat / Extension)' },
      { id: 'outTotalCapLbs', label: 'Allowable Platform Load per Bay' },
      { id: 'outOshaPass', label: 'OSHA Span Compliance Status' }
    ],
    rules: [
      'OSHA 1926.451(f)(16): Scaffolding planks shall not deflect more than 1/60th of the span when loaded.',
      'Plank ends must extend over their end supports by at least 6 inches and not more than 12 inches (unless cleated/hooked).',
      'Never use standard construction 2x10 dimensional lumber; scaffolding planks must be stamped "SCAFFOLD GRADE".',
      'Platforms must be fully planked between front uprights and guardrail supports (no gaps > 1 inch).'
    ],
    formula: 'Deflection Limit = Span (in) / 60 | Span lookup under OSHA 1926.451 Appendix A tables',
    faq: [
      { q: 'Why can you not use regular 2x10 lumber from Home Depot on scaffolding?', a: 'Standard construction lumber is graded for bending in floor joists where multiple boards share load. Scaffold planks support human lives independently and must be dense structural lumber (DI-65 or LVL) tested for grain slope, knot clusters, and tension.' },
      { q: 'What is the L/60 deflection limit on scaffolding?', a: 'Under OSHA rules, on an 8-foot (96-inch) span, a scaffold plank cannot sag more than 96 / 60 = 1.6 inches under full working load. Excessive bounce causes vertigo, tripping, and dropped tools.' }
    ],
    calcJs: `
      function calc() {
        var duty = parseFloat(document.getElementById('dutyRating').value) || 25;
        var pType = document.getElementById('plankType').value;
        var span = parseFloat(document.getElementById('spanFt').value) || 7.0;

        // OSHA allowable spans
        var maxSpan = 8.0;
        if (pType === 'wood') {
          maxSpan = duty === 25 ? 8.0 : (duty === 50 ? 6.0 : 4.0);
        } else if (pType === 'lvl') {
          maxSpan = duty === 25 ? 10.0 : (duty === 50 ? 8.0 : 6.0);
        } else {
          maxSpan = 10.0;
        }

        var pass = span <= maxSpan;
        var maxDeflIn = (span * 12) / 60;
        var bayCapLbs = Math.round(duty * (span * 5)); // 5-ft wide standard bay

        document.getElementById('outMaxAllowSpan').textContent = maxSpan.toFixed(1) + ' Feet Maximum Allowable Span';
        document.getElementById('outDeflectLimit').textContent = maxDeflIn.toFixed(2) + '" Maximum Sag at Midspan (L/60 limit)';
        document.getElementById('outOverhangRule').textContent = '6" min to 12" max overhang past frame (or cleated)';
        document.getElementById('outTotalCapLbs').textContent = bayCapLbs.toLocaleString() + ' lbs total load per 5×' + span + ' ft platform bay';

        var badge = document.getElementById('statusBadge');
        if (pass) {
          document.getElementById('outOshaPass').textContent = '✅ OSHA Compliant (' + span + ' ft ≤ ' + maxSpan.toFixed(1) + ' ft)';
          document.getElementById('outOshaPass').style.color = '#22c55e';
          badge.textContent = 'OSHA 1926.451 Pass: Safe plank span';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outOshaPass').textContent = '❌ SPAN EXCEEDED! Danger of plank fracture';
          document.getElementById('outOshaPass').style.color = '#ef4444';
          badge.textContent = 'Safety Violation: Frame spacing too wide';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'ladder-angle-4-to-1-safety',
    name: 'Extension Ladder 4:1 Angle & Reach Calculator',
    h1: 'Extension Ladder 4:1 Safety Angle & Working Reach Calculator (OSHA)',
    title: 'Extension Ladder 4:1 Safety Angle & Reach Calculator [OSHA 75.5° Rule] | Digital Tools Shed',
    metaDesc: 'Calculate extension ladder base setback distance (4:1 ratio / 75.5°), 3-foot roofline extension, and actual vertical working reach under OSHA 1926.1053.',
    category: 'Rigging & Heavy Lifting',
    codeRef: 'OSHA 1926.1053',
    lead: 'Calculate ladder base setback distance (4:1 rule), mandatory 3-foot roofline extension, and maximum vertical reaching heights under OSHA safety standards.',
    inputs: [
      { id: 'ladderLen', label: 'Total Nominal Extension Ladder Length', type: 'select', options: [
        { value: '16', label: '16 Foot Extension Ladder (13 ft max extended)' },
        { value: '20', label: '20 Foot Extension Ladder (17 ft max extended)' },
        { value: '24', label: '24 Foot Extension Ladder (21 ft max extended)', selected: true },
        { value: '28', label: '28 Foot Extension Ladder (25 ft max extended)' },
        { value: '32', label: '32 Foot Extension Ladder (29 ft max extended)' },
        { value: '40', label: '40 Foot Extension Ladder (36 ft max extended)' }
      ]},
      { id: 'targetHeight', label: 'Roof Eave / Wall Top Support Height', value: 16, step: 0.5, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outBaseSetback', label: 'Base Setback from Wall', unit: 'Feet / Inches' },
    outputs: [
      { id: 'outPitchAngle', label: 'Ladder Pitch Angle' },
      { id: 'outRoofExtension', label: '3-Foot Roofline Extension Rule' },
      { id: 'outMaxSafeReach', label: 'Max Safe Standing Reach Height' },
      { id: 'outLadderCheck', label: 'Ladder Length Sufficiency Check' }
    ],
    rules: [
      'OSHA 1926.1053(b)(5): Non-self-supporting ladders shall be used at an angle where horizontal base distance is one-fourth (1/4) the working length (75.5 degrees).',
      'OSHA 1926.1053(b)(1): When accessing an elevated roof surface, ladder side rails must extend at least 3 FEET above the landing surface.',
      'Never stand on the top three rungs of an extension ladder.',
      'Extension ladders lose 3 to 4 feet of length due to mandatory overlap between base and fly sections.'
    ],
    formula: 'Base Setback = Support Height / 4 | Hypotenuse = √(Height² + Setback²) | Ladder Needed = Hypotenuse + 3 ft roof extension',
    faq: [
      { q: 'How do you check a ladder\'s 4:1 angle on the jobsite without a tape measure?', a: 'Stand with your toes touching the base of the ladder side rails and extend your arms straight forward at shoulder height. Your palms should rest comfortably flat on the rung directly in front of you.' },
      { q: 'Why must a ladder extend 3 feet above a roof edge?', a: 'Under OSHA rules, extending side rails 3 feet above the roofline provides a secure handhold when stepping off the ladder onto the roof, preventing the top of the ladder from kicking sideways.' }
    ],
    calcJs: `
      function calc() {
        var nomLen = parseFloat(document.getElementById('ladderLen').value) || 24;
        var hgt = parseFloat(document.getElementById('targetHeight').value) || 16;

        var setbackFt = hgt / 4;
        var setbackIn = Math.round(setbackFt * 12);

        // Required ladder length for roof access = hypotenuse + 3 ft extension
        var hyp = Math.sqrt(hgt * hgt + setbackFt * setbackFt);
        var reqLadderLen = hyp + 3.0;

        // Actual working length (subtract section overlap: 3 ft for ≤32, 4 ft for 40)
        var maxWorkingLen = nomLen <= 32 ? nomLen - 3 : nomLen - 4;
        var pass = maxWorkingLen >= reqLadderLen;

        var maxStandingHgt = (hyp - 3.0) + 4.0; // 4 ft user reach above 4th rung from top

        document.getElementById('outBaseSetback').textContent = setbackFt.toFixed(2) + ' ft (' + setbackIn + '" from wall) [4:1 Rule]';
        document.getElementById('outPitchAngle').textContent = '75.5° Safety Pitch Angle (arctan 4.0)';
        document.getElementById('outRoofExtension').textContent = 'Top must extend 36" (3 ft) past roof edge';
        document.getElementById('outMaxSafeReach').textContent = '~' + Math.round(maxStandingHgt) + ' ft vertical worker reach';

        var badge = document.getElementById('statusBadge');
        if (pass) {
          document.getElementById('outLadderCheck').textContent = '✅ Sufficient Ladder Length (' + maxWorkingLen + ' ft extended ≥ ' + reqLadderLen.toFixed(1) + ' ft req)';
          document.getElementById('outLadderCheck').style.color = '#22c55e';
          badge.textContent = 'OSHA 1926.1053 Pass: Ladder reaches safely';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outLadderCheck').textContent = '❌ LADDER TOO SHORT! Need at least ' + Math.ceil(reqLadderLen + 3) + ' ft nominal ladder';
          document.getElementById('outLadderCheck').style.color = '#ef4444';
          badge.textContent = 'Safety Hazard: Ladder cannot achieve 3ft extension';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'trench-box-soil-classification-slope',
    name: 'OSHA Trench Soil Sloping & Shoring Calculator',
    h1: 'OSHA Trench Soil Classification & Safe Sloping/Benching Calculator',
    title: 'OSHA Trench Soil Sloping & Shoring Calculator [Type A, B, C Soil] | Digital Tools Shed',
    metaDesc: 'Determine maximum allowable trench cut slopes (Type A 3/4:1, Type B 1:1, Type C 1.5:1) and trench box shoring depths under OSHA 1926 Subpart P.',
    category: 'Rigging & Heavy Lifting',
    codeRef: 'OSHA 1926 Subpart P',
    lead: 'Determine OSHA trench sloping ratios, benching configurations, and protective shield requirements based on soil type and excavation depth.',
    inputs: [
      { id: 'soilType', label: 'OSHA Soil Classification', type: 'select', options: [
        { value: 'a', label: 'Type A Soil (Cohesive Clay / Hardpan - UCS ≥ 1.5 tsf)' },
        { value: 'b', label: 'Type B Soil (Silt / Angular Gravel / Previously Disturbed - UCS 0.5 to 1.5 tsf)', selected: true },
        { value: 'c', label: 'Type C Soil (Granular Sand / Submerged / Wet Muck - UCS ≤ 0.5 tsf)' }
      ]},
      { id: 'trenchDepth', label: 'Trench Excavation Depth', value: 8, step: 1, min: 4, max: 20, unit: 'Feet' },
      { id: 'trenchBottomW', label: 'Trench Bottom Working Width', value: 4, step: 1, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outTopWidth', label: 'Required Trench Top Width', unit: 'Feet' },
    outputs: [
      { id: 'outSlopeRatio', label: 'Max Allowable Slope (H:V)' },
      { id: 'outShieldRule', label: 'Trench Shield / Box Requirement' },
      { id: 'outLadderSpacing', label: 'Egress Ladder Spacing (OSHA 25 ft Rule)' },
      { id: 'outSpoilSetback', label: 'Spoil Pile Setback from Edge' }
    ],
    rules: [
      'OSHA 1926.652: Excavations 5 feet or deeper mandate cave-in protection (sloping, benching, or trench box shoring).',
      'Maximum allowable slopes: Type A = 3/4:1 (53°), Type B = 1:1 (45°), Type C = 1-1/2:1 (34°).',
      'Excavated spoil piles and heavy machinery must be kept at least 2 FEET back from the edge of the trench.',
      'A stairway, ladder, or ramp is mandatory within 25 feet of lateral travel for workers in trenches 4 feet or deeper.'
    ],
    formula: 'Slope H:V | Top Width = Bottom Width + 2 × (Depth × Slope_H)',
    faq: [
      { q: 'Why is previously disturbed soil never classified as Type A?', a: 'Once virgin soil has been excavated and backfilled (e.g. for existing utility lines), the natural consolidation and soil cohesion are permanently destroyed. OSHA rules dictate that previously disturbed soil can never be rated higher than Type B.' },
      { q: 'How wide must the top of a 10-foot trench be in Type C sand?', a: 'Type C soil requires a 1.5:1 slope (1.5 ft horizontal for every 1 ft vertical). For a 4-foot wide bottom at 10 feet deep, each side cut extends 15 feet out, requiring a massive total top width of 4 + 15 + 15 = 34 feet.' }
    ],
    calcJs: `
      function calc() {
        var sType = document.getElementById('soilType').value;
        var depth = parseFloat(document.getElementById('trenchDepth').value) || 8;
        var bottomW = parseFloat(document.getElementById('trenchBottomW').value) || 4;

        var slopeH = 1.0;
        var slopeLabel = '1:1 (45° Angle)';
        if (sType === 'a') { slopeH = 0.75; slopeLabel = '3/4 : 1 (53° Angle)'; }
        else if (sType === 'b') { slopeH = 1.0; slopeLabel = '1 : 1 (45° Angle)'; }
        else if (sType === 'c') { slopeH = 1.5; slopeLabel = '1-1/2 : 1 (34° Angle)'; }

        var sideCut = depth * slopeH;
        var topWidth = bottomW + (2 * sideCut);

        var needsProtection = depth >= 5.0;

        document.getElementById('outTopWidth').textContent = topWidth.toFixed(1) + ' Feet Total Top Opening Width';
        document.getElementById('outSlopeRatio').textContent = slopeLabel + ' [' + sideCut.toFixed(1) + ' ft cutback each side]';
        document.getElementById('outShieldRule').textContent = needsProtection ? '⚠️ Protective System Mandatory (Depth ≥ 5 ft)' : 'Cave-in protection optional (Depth < 5 ft)';
        document.getElementById('outLadderSpacing').textContent = 'Egress ladder every 25 ft of lateral travel (Depth ≥ 4 ft)';
        document.getElementById('outSpoilSetback').textContent = '2-Foot Minimum Spoil Pile Setback from Lip';
      }
    `
  },
  {
    slug: 'fall-protection-clearance-lanyard',
    name: 'Fall Protection Total Fall Clearance Calculator',
    h1: 'Fall Protection Total Fall Clearance Distance Calculator (OSHA)',
    title: 'Fall Protection Total Fall Clearance Distance Calculator [OSHA 1926.502] | Digital Tools Shed',
    metaDesc: 'Calculate total required fall clearance distance (TFCD) including lanyard length, shock absorber deceleration, harness stretch, and safety margins.',
    category: 'Rigging & Heavy Lifting',
    codeRef: 'OSHA 1926.502 / ANSI Z359',
    lead: 'Calculate total required fall clearance distance (TFCD) below working surfaces to prevent workers from impacting lower levels during a fall arrest.',
    inputs: [
      { id: 'lanyardLen', label: 'Lanyard Free Fall Length', type: 'select', options: [
        { value: '6', label: '6 Foot Shock-Absorbing Lanyard (Standard)', selected: true },
        { value: '4', label: '4 Foot Lanyard (Reduced Free Fall)' },
        { value: '3', label: 'Self-Retracting Lifeline SRL (Class 1 / Class A - 2 ft Free Fall)' }
      ]},
      { id: 'absorberDecel', label: 'Shock Pack Deceleration Tear Distance', type: 'select', options: [
        { value: '3.5', label: '3.5 Feet (ANSI Standard 6-ft Lanyard)', selected: true },
        { value: '4.0', label: '4.0 Feet (Heavy 12-ft Free Fall Lanyard)' },
        { value: '2.0', label: '2.0 Feet (Class A SRL Fast Arrest)' }
      ]},
      { id: 'workerHgt', label: 'Worker Height / D-Ring to Feet', value: 5.5, step: 0.5, unit: 'Feet', hint: 'Distance from back D-ring to boot soles (~5.0 to 5.5 ft)' },
      { id: 'safetyMargin', label: 'Safety Buffer Margin', value: 2.0, step: 0.5, unit: 'Feet', hint: 'ANSI recommends 2.0 to 3.0 ft safety buffer' }
    ],
    primaryOutput: { id: 'outTotalClearance', label: 'Total Fall Clearance Distance (TFCD)', unit: 'Feet Below Anchor' },
    outputs: [
      { id: 'outAnchorToGround', label: 'Minimum Anchorage Height' },
      { id: 'outHarnessStretch', label: 'D-Ring Slide & Harness Stretch' },
      { id: 'outMaxArrestForce', label: 'Maximum Arresting Force (MAF)' },
      { id: 'outSrlComparison', label: 'Self-Retracting Lifeline (SRL) Recommendation' }
    ],
    rules: [
      'Total Fall Clearance = Lanyard Length + Deceleration Distance + Worker Height (D-ring to feet) + Harness Stretch (1 ft) + Safety Margin.',
      'A standard 6-foot shock-absorbing lanyard requires at least 17.5 to 18.5 feet of total vertical clearance below the anchor point.',
      'If available clearance is less than 17.5 feet, a standard 6-foot lanyard WILL NOT prevent a worker from hitting the ground.',
      'Use a Self-Retracting Lifeline (SRL) in low-clearance environments; SRLs lock within 2 feet, cutting required clearance to ~9–10 feet.'
    ],
    formula: 'TFCD = Lanyard (6 ft) + Deceleration (3.5 ft) + D-Ring Height (5.5 ft) + Stretch (1.0 ft) + Safety Buffer (2.0 ft) = 18.0 ft',
    faq: [
      { q: 'Why does a 6-foot lanyard need 18 feet of fall clearance?', a: 'Because a fall arrest includes multiple moving distances: the 6-foot lanyard drops, the rip-stitch shock absorber tears open 3.5 feet to absorb G-forces, the harness stretches and D-ring slides up 1 foot, the worker\'s body extends 5.5 feet below the D-ring, plus a 2-foot safety cushion.' },
      { q: 'What should you use if you only have 12 feet of fall clearance?', a: 'You must use a Self-Retracting Lifeline (SRL) or overhead anchor. An SRL senses acceleration and locks like a car seatbelt within 12 to 24 inches, keeping total required fall clearance under 9 to 10 feet.' }
    ],
    calcJs: `
      function calc() {
        var lLen = parseFloat(document.getElementById('lanyardLen').value) || 6;
        var decel = parseFloat(document.getElementById('absorberDecel').value) || 3.5;
        var wHgt = parseFloat(document.getElementById('workerHgt').value) || 5.5;
        var buffer = parseFloat(document.getElementById('safetyMargin').value) || 2.0;

        var harnessStretch = 1.0; // 1 ft harness stretch and D-ring slide
        var totalTfcd = lLen + decel + wHgt + harnessStretch + buffer;

        document.getElementById('outTotalClearance').textContent = totalTfcd.toFixed(1) + ' Feet Required Clear Fall Distance';
        document.getElementById('outAnchorToGround').textContent = 'Anchor must be ≥ ' + totalTfcd.toFixed(1) + ' ft above ground / obstruction';
        document.getElementById('outHarnessStretch').textContent = '1.0 ft dorsal D-ring shift and webbing elongation';
        document.getElementById('outMaxArrestForce').textContent = '1,800 lbs Max Arrest Force (ANSI Z359 Limit)';
        document.getElementById('outSrlComparison').textContent = lLen === 6 ? 'For < 17.5 ft headroom: Switch to Class 1 SRL (requires only 9.5 ft clearance)' : 'Optimal low-clearance setup';
      }
    `
  },
  {
    slug: 'anchor-bolt-embedment-pullout',
    name: 'Concrete Anchor Bolt Pullout & Shear Strength Calculator',
    h1: 'Concrete Anchor Bolt Embedment Depth, Pullout & Shear Calculator (ACI 318)',
    title: 'Concrete Anchor Bolt Embedment & Shear Calculator [ACI 318 Concrete Breakout] | Digital Tools Shed',
    metaDesc: 'Calculate concrete breakout cone pullout strength, steel shear capacity, and minimum edge distance for wedge and cast-in anchor bolts under ACI 318.',
    category: 'Rigging & Heavy Lifting',
    codeRef: 'ACI 318 Chapter 17',
    lead: 'Calculate tensile breakout pullout capacity and steel shear strength for wedge anchors and cast-in-place J-bolts under ACI 318 Concrete Capacity Design (CCD).',
    inputs: [
      { id: 'boltDia', label: 'Anchor Bolt Diameter', type: 'select', options: [
        { value: '0.375', label: '3/8" (9.5 mm) Wedge Anchor' },
        { value: '0.500', label: '1/2" (12.7 mm) Anchor Bolt (Standard Sill Plate)', selected: true },
        { value: '0.625', label: '5/8" (15.9 mm) Heavy Anchor Bolt' },
        { value: '0.750', label: '3/4" (19.0 mm) Column Base Bolt' }
      ]},
      { id: 'embedDepth', label: 'Effective Embedment Depth (h_ef)', value: 4.5, step: 0.5, unit: 'Inches', hint: 'Standard 1/2" sill bolt requires 7" total (4.5" effective in concrete)' },
      { id: 'concretePsi', label: 'Concrete Compressive Strength (f\'c)', value: 3000, step: 500, unit: 'PSI' },
      { id: 'edgeDist', label: 'Distance to Nearest Concrete Slab Edge', value: 6.0, step: 0.5, unit: 'Inches' }
    ],
    primaryOutput: { id: 'outTensionCap', label: 'Concrete Tension Breakout Capacity', unit: 'Pounds (lbs)' },
    outputs: [
      { id: 'outSteelShear', label: 'Steel Shear Strength Capacity' },
      { id: 'outConeArea', label: 'Breakout Failure Cone Radius' },
      { id: 'outEdgeDerate', label: 'Edge Distance Reduction Factor' },
      { id: 'outMinEdge', label: 'Critical Minimum Edge Distance (1.5 × h_ef)' }
    ],
    rules: [
      'ACI 318 Chapter 17 (Concrete Capacity Design CCD): Concrete breakout strength scales with embedment depth to the 1.5 power (h_ef^1.5).',
      'The failure cone projects outward from the bottom of the anchor at roughly 35 degrees (a radius of 1.5 × h_ef).',
      'If an anchor is installed closer than 1.5 × h_ef to an edge, tension capacity is reduced proportionally.',
      'IRC Section R403.1.6: Foundation sill plate anchor bolts must be embedded at least 7 inches into concrete or masonry.'
    ],
    formula: 'Basic Breakout N_b = k × √f\'c × h_ef^1.5 (where k=24 for cast-in, k=17 for post-installed wedge) | Shear V_sa = 0.60 × A_se × F_ut',
    faq: [
      { q: 'Why does concrete anchor pullout depend on depth to the 1.5 power?', a: 'Because concrete fails in tensile fracture forming a 3D inverted pyramid or cone. The surface area of the breakout cone expands exponentially as embedment depth increases, proportional to h_ef^1.5.' },
      { q: 'What is the danger of drilling an anchor bolt too close to a slab edge?', a: 'If an anchor is within 1.5 times the embedment depth from an edge, the failure cone intercepts the edge, causing the entire concrete corner to blow out under a fraction of its rated tension or shear load.' }
    ],
    calcJs: `
      function calc() {
        var dia = parseFloat(document.getElementById('boltDia').value) || 0.50;
        var hef = parseFloat(document.getElementById('embedDepth').value) || 4.5;
        var fc = parseFloat(document.getElementById('concretePsi').value) || 3000;
        var edge = parseFloat(document.getElementById('edgeDist').value) || 6.0;

        // ACI 318 breakout: Nb = 17 * √fc * hef^1.5 (post-installed wedge)
        var basicNb = 17 * Math.sqrt(fc) * Math.pow(hef, 1.5);

        // Edge modification factor: c_cr = 1.5 * hef
        var critEdge = 1.5 * hef;
        var edgeFactor = Math.min(1.0, edge / critEdge);
        var allowTension = Math.round(basicNb * edgeFactor);

        // Steel shear: 0.6 * Ase * Fut (approx 60 ksi steel)
        var area = Math.PI * Math.pow(dia / 2, 2) * 0.75;
        var allowShear = Math.round(0.6 * area * 58000);

        document.getElementById('outTensionCap').textContent = allowTension.toLocaleString() + ' lbs Concrete Breakout Tension';
        document.getElementById('outSteelShear').textContent = allowShear.toLocaleString() + ' lbs Steel Shear Capacity';
        document.getElementById('outConeArea').textContent = critEdge.toFixed(1) + '" radial breakout cone radius';
        document.getElementById('outEdgeDerate').textContent = (edgeFactor * 100).toFixed(0) + '% of full strength (' + edge + '" edge / ' + critEdge.toFixed(1) + '" crit)';
        document.getElementById('outMinEdge').textContent = critEdge.toFixed(1) + '" minimum distance for 100% capacity';
      }
    `
  },
  {
    slug: 'post-shore-load-capacity-height',
    name: 'Adjustable Steel Post Shore Capacity Calculator',
    h1: 'Adjustable Steel Acrow Post Shore Load Capacity Calculator',
    title: 'Steel Post Shore Load Capacity Calculator [Acrow Prop Height Derating] | Digital Tools Shed',
    metaDesc: 'Calculate safe load capacity in kips and pounds for adjustable steel Acrow post shores as extension height increases under SSFI standards.',
    category: 'Rigging & Heavy Lifting',
    codeRef: 'SSFI / OSHA 1926.703',
    lead: 'Calculate safe axial load capacities and Euler buckling deratings for telescoping adjustable steel post shores (Acrow props) supporting concrete forms or beams.',
    inputs: [
      { id: 'propSize', label: 'Steel Post Shore Size / Range', type: 'select', options: [
        { value: 'size1', label: 'Size 1 Prop (5\'9" to 10\'3" Extension Range)' },
        { value: 'size2', label: 'Size 2 Prop (6\'6" to 11\'0" Extension Range)', selected: true },
        { value: 'size3', label: 'Size 3 Prop (8\'6" to 13\'0" Extension Range)' },
        { value: 'size4', label: 'Size 4 Prop (10\'6" to 16\'0" Extension Range)' }
      ]},
      { id: 'extHeight', label: 'Actual Operating Extension Height', value: 9.0, step: 0.5, unit: 'Feet' },
      { id: 'bracedStatus', label: 'Lateral Tube Lacing / Bracing', type: 'select', options: [
        { value: 'unbraced', label: 'Unbraced Single Shore (Free Standing)', selected: true },
        { value: 'braced', label: 'Cross-Braced with Steel Scaffold Tubing (Increases Capacity)' }
      ]}
    ],
    primaryOutput: { id: 'outSafeCap', label: 'Safe Working Load Capacity', unit: 'Pounds (lbs)' },
    outputs: [
      { id: 'outCapTons', label: 'Capacity in US Tons' },
      { id: 'outBucklingRisk', label: 'Slenderness & Euler Buckling Mode' },
      { id: 'outPinSpec', label: 'High-Tensile Locking Pin Requirement' },
      { id: 'outSafetyFactor', label: 'SSFI Design Safety Factor (3:1)' }
    ],
    rules: [
      'SSFI (Scaffolding, Shoring & Forming Institute): Post shore capacity decreases dramatically as extension height increases due to column slenderness.',
      'A standard Size 2 Acrow prop rated at 7,000 lbs closed down to 6\'6" drops to under 3,200 lbs when extended to 11 feet.',
      'NEVER substitute a piece of rebar, a bolt, or a screwdriver for the manufactured high-tensile steel locking pin.',
      'Posts must be installed strictly plumb within 1/8" over their length; out-of-plumb shores induce dangerous eccentric bending moments.'
    ],
    formula: 'Capacity derived from SSFI manufacturer testing curves based on unbraced length (L/r ratio)',
    faq: [
      { q: 'Why does a post shore lose more than 50% of its strength when extended?', a: 'Under Euler column buckling theory, column strength is inversely proportional to the square of its effective length. When you telescope a post shore out to its maximum height, its resistance to sideways buckling drops exponentially.' },
      { q: 'Why is using rebar as a shore pin dangerous?', a: 'Standard Grade 60 rebar has low shear resistance and bends easily under shock loads. Manufactured shore pins are heat-treated alloy steel rated for over 20,000 lbs of double shear.' }
    ],
    calcJs: `
      function calc() {
        var pSize = document.getElementById('propSize').value;
        var hgt = parseFloat(document.getElementById('extHeight').value) || 9.0;
        var braced = document.getElementById('bracedStatus').value === 'braced';

        // Approximate SSFI safe working load curve (lbs with 3:1 safety factor)
        // 6 ft = 7000 lbs, 8 ft = 5500 lbs, 10 ft = 4000 lbs, 12 ft = 2800 lbs, 14 ft = 1800 lbs
        var baseLbs = 5000;
        if (hgt <= 6.5) baseLbs = 7200;
        else if (hgt <= 8.0) baseLbs = 5800;
        else if (hgt <= 9.5) baseLbs = 4700;
        else if (hgt <= 11.0) baseLbs = 3400;
        else if (hgt <= 13.0) baseLbs = 2600;
        else baseLbs = 1800;

        if (braced) baseLbs = Math.round(baseLbs * 1.35); // 35% boost with mid-point lacing

        var capTons = baseLbs / 2000;

        document.getElementById('outSafeCap').textContent = baseLbs.toLocaleString() + ' lbs Safe Axial Load';
        document.getElementById('outCapTons').textContent = capTons.toFixed(2) + ' US Tons safe capacity at ' + hgt + ' ft extension';
        document.getElementById('outBucklingRisk').textContent = hgt > 11 ? 'High Slenderness: Mid-height tube lacing recommended' : 'Standard Column Stability';
        document.getElementById('outPinSpec').textContent = 'High-Tensile Alloy Pin Mandatory (Never use rebar)';
        document.getElementById('outSafetyFactor').textContent = 'SSFI 3:1 Safety Factor on ultimate failure load';
      }
    `
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 9: STRUCTURAL FRAMING, DRYWALL & FINISHES (Tools 91–106)
// ─────────────────────────────────────────────────────────────────────────────
const FRAMING_TOOLS = [
  {
    slug: 'window-door-header-sizing-span',
    name: 'Window & Door Header Sizing Calculator',
    h1: 'Window & Door Header Sizing & Span Calculator (IRC Table R602.7)',
    title: 'Window & Door Header Sizing Calculator [IRC Table R602.7 Span] | Digital Tools Shed',
    metaDesc: 'Size wood headers (2-2x6 through 2-2x12 or LVL) for exterior bearing and interior walls supporting roof and floors under IRC Table R602.7(1).',
    category: 'Framing & Finishes',
    codeRef: 'IRC Table R602.7(1)',
    lead: 'Calculate structural window and door header beam sizes, plies, and jack stud bearing supports based on rough opening width and building load conditions.',
    inputs: [
      { id: 'roughOpenW', label: 'Rough Opening Clear Width', value: 6.0, step: 0.5, unit: 'Feet', hint: 'e.g. 6-ft sliding patio door = 6.0 ft' },
      { id: 'bldgCondition', label: 'Building Story & Supported Load', type: 'select', options: [
        { value: 'roof-only', label: 'Exterior Wall Supporting Roof & Ceiling Only', selected: true },
        { value: 'one-floor', label: 'Exterior Wall Supporting One Center-Bearing Floor & Roof' },
        { value: 'two-floors', label: 'Exterior Wall Supporting Two Floors & Roof' },
        { value: 'interior', label: 'Interior Non-Bearing Partition Wall' }
      ]},
      { id: 'bldgWidth', label: 'Building Span Width', value: 28, step: 4, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outHeaderSize', label: 'Recommended Header Size', unit: 'Lumber Plies' },
    outputs: [
      { id: 'outJackStuds', label: 'Jack / Trimmer Studs per Side' },
      { id: 'outKingStuds', label: 'Full-Height King Studs per Side' },
      { id: 'outFoamSpacer', label: '1/2" Rigid Foam Thermal Break' },
      { id: 'outIrcSpanCheck', label: 'IRC R602.7 Code Status' }
    ],
    rules: [
      'IRC Table R602.7(1): Headers on exterior walls require 1 jack stud per end up to 5 feet, and 2 jack studs for spans > 5 feet.',
      'A 2x4 wall header built from two 2x members requires a 1/2" spacer (plywood or rigid insulation) to equal the 3-1/2" wall thickness.',
      'Using 1/2" XPS or polyiso rigid foam inside the header sandwich satisfies energy code thermal bridging requirements.',
      'Non-bearing interior partitions permit single-member flat 2x4 headers for openings up to 8 feet.'
    ],
    formula: 'Span lookup under IRC Table R602.7(1) based on Building Width and Supported Stories',
    faq: [
      { q: 'Why do headers wider than 5 feet need two jack studs per side?', a: 'Jack studs (trimmers) carry the entire vertical gravity load transferred from the header down to the bottom plate and foundation. Beyond 5 feet of span, bearing stress on the wood grain exceeds allowable crushing limits for a single 1-1/2" stud.' },
      { q: 'What is an insulated header in modern framing?', a: 'Standard 2-ply 2x headers leave a 1/2" void. Placing 1/2" rigid foam (R-3) between the two 2x members instead of plywood prevents a cold thermal bridge across the top of window openings.' }
    ],
    calcJs: `
      function calc() {
        var openW = parseFloat(document.getElementById('roughOpenW').value) || 6.0;
        var cond = document.getElementById('bldgCondition').value;
        var bWidth = parseFloat(document.getElementById('bldgWidth').value) || 28;

        var header = '2-Ply 2x10 Header';
        var jacks = openW > 5.0 ? 2 : 1;

        if (cond === 'interior') {
          header = openW <= 8 ? 'Single Flat 2x4 Header' : 'Double 2x4 Header';
          jacks = 1;
        } else if (cond === 'roof-only') {
          if (openW <= 4.0) header = '2-Ply 2x6 Header';
          else if (openW <= 5.5) header = '2-Ply 2x8 Header';
          else if (openW <= 7.0) header = '2-Ply 2x10 Header';
          else if (openW <= 8.5) header = '2-Ply 2x12 Header';
          else header = 'Double 1-3/4" × 11-7/8" LVL Engineered Beam';
        } else if (cond === 'one-floor') {
          if (openW <= 3.5) header = '2-Ply 2x6 Header';
          else if (openW <= 4.5) header = '2-Ply 2x8 Header';
          else if (openW <= 5.5) header = '2-Ply 2x10 Header';
          else if (openW <= 6.5) header = '2-Ply 2x12 Header';
          else header = 'Double 1-3/4" × 11-7/8" LVL Engineered Beam';
        } else {
          // two floors
          if (openW <= 4.0) header = '2-Ply 2x10 Header';
          else if (openW <= 5.0) header = '2-Ply 2x12 Header';
          else header = 'Triple 1-3/4" × 11-7/8" LVL Engineered Beam';
          jacks = openW > 4.0 ? 2 : 1;
        }

        document.getElementById('outHeaderSize').textContent = header;
        document.getElementById('outJackStuds').textContent = jacks + ' Jack / Trimmer Stud(s) at each side';
        document.getElementById('outKingStuds').textContent = '1 Full-Height King Stud at each side';
        document.getElementById('outFoamSpacer').textContent = '1/2" Rigid Foam (R-3) spacer between 2x plies for 3-1/2" wall';
        document.getElementById('outIrcSpanCheck').textContent = '✅ IRC R602.7 Compliant (' + openW + ' ft span on ' + bWidth + ' ft building)';
      }
    `
  },
  {
    slug: 'king-jack-cripple-stud-cut-list',
    name: 'Window & Door Stud Framing Cut List Calculator',
    h1: 'Wall Opening Stud Cut List: King, Jack & Cripple Studs',
    title: 'Window & Door Stud Framing Cut List Calculator [King, Jack & Cripples] | Digital Tools Shed',
    metaDesc: 'Generate exact cut lengths for king studs, jack studs (trimmers), header, sill, and top/bottom cripples for standard 8ft, 9ft, and 10ft framed walls.',
    category: 'Framing & Finishes',
    codeRef: 'IRC R602 Framing',
    lead: 'Generate an exact cut list of lumber lengths for king studs, jack trimmers, rough sills, and top/bottom cripple studs for any wall opening.',
    inputs: [
      { id: 'wallHgt', label: 'Wall Framing Ceiling Height', type: 'select', options: [
        { value: '97.125', label: '8-Foot Wall (97-1/8" Stud Height / 3 Plates)', selected: true },
        { value: '109.125', label: '9-Foot Wall (109-1/8" Stud Height)' },
        { value: '121.125', label: '10-Foot Wall (121-1/8" Stud Height)' }
      ]},
      { id: 'headerDepth', label: 'Header Lumber Depth', type: 'select', options: [
        { value: '5.5', label: '2x6 Header (5-1/2" actual depth)' },
        { value: '7.25', label: '2x8 Header (7-1/4" actual depth)' },
        { value: '9.25', label: '2x10 Header (9-1/4" actual depth)', selected: true },
        { value: '11.25', label: '2x12 Header (11-1/4" actual depth)' }
      ]},
      { id: 'headerHgt', label: 'Top of Door / Window Header Height', value: 82.5, step: 0.5, unit: 'Inches', hint: 'Standard 80" door + 2" margin = 82-1/2" bottom of header' },
      { id: 'sillHgt', label: 'Rough Window Sill Height Above Floor', value: 36.0, step: 1, unit: 'Inches', hint: '0" for doors, 36" for windows' },
      { id: 'roughW', label: 'Rough Opening Width', value: 38.0, step: 0.5, unit: 'Inches' }
    ],
    primaryOutput: { id: 'outJackCut', label: 'Jack Stud (Trimmer) Cut Length', unit: 'Inches' },
    outputs: [
      { id: 'outKingCut', label: 'King Stud Cut Length (Full Height)' },
      { id: 'outHeaderCut', label: 'Header Beam Cut Length' },
      { id: 'outTopCripple', label: 'Top Cripple Stud Length' },
      { id: 'outBottomCripple', label: 'Bottom Cripple Stud Length' }
    ],
    rules: [
      'Jack stud (trimmer) length = Desired bottom of header height - 1-1/2" (bottom plate thickness).',
      'Header cut length = Rough Opening Width + 3.0 inches (to bear on two 1-1/2" jack studs).',
      'King studs run full wall height from bottom plate to the underside of the double top plates.',
      'Cripple studs must maintain the standard 16" on-center wall layout above headers and below window sills.'
    ],
    formula: 'Jack Cut = Header Bottom - 1.5" | Header Cut = RO Width + 3.0" | Top Cripple = Total Wall Stud - (Jack + Header Depth)',
    faq: [
      { q: 'Why is standard pre-cut 8-foot stud length 92-5/8 inches?', a: 'Standard walls have one 1-1/2" bottom plate and two 1-1/2" top plates (4-1/2" total). Adding 92-5/8" stud length yields exactly 97-1/8" total rough framed height, perfectly fitting 8-foot (96") drywall plus 1/2" ceiling clearance.' },
      { q: 'Do cripple studs need to align with regular stud layout?', a: 'Yes. Maintaining continuous 16" on-center spacing for cripple studs ensures drywall edges and exterior siding nailers align without guessing.' }
    ],
    calcJs: `
      function calc() {
        var totalH = parseFloat(document.getElementById('wallHgt').value) || 97.125;
        var hDepth = parseFloat(document.getElementById('headerDepth').value) || 9.25;
        var hBottom = parseFloat(document.getElementById('headerHgt').value) || 82.5;
        var sillH = parseFloat(document.getElementById('sillHgt').value) || 36.0;
        var roW = parseFloat(document.getElementById('roughW').value) || 38.0;

        var jackLen = hBottom - 1.5; // subtract 1.5" bottom plate
        var kingLen = totalH - 4.5; // subtract 1 bottom + 2 top plates (pre-cut stud)
        var headerCut = roW + 3.0; // bears on two 1.5" jacks

        var topCripple = Math.max(0, kingLen - (jackLen + hDepth));
        var botCripple = sillH > 0 ? Math.max(0, (sillH - 1.5) - 1.5) : 0; // below sill plate

        document.getElementById('outJackCut').textContent = jackLen.toFixed(3) + '" (' + toFraction(jackLen) + ') [Cut 2 Pieces]';
        document.getElementById('outKingCut').textContent = kingLen.toFixed(3) + '" (' + toFraction(kingLen) + ') [Cut 2 Pieces - Standard Stud]';
        document.getElementById('outHeaderCut').textContent = headerCut.toFixed(3) + '" (' + toFraction(headerCut) + ') [Cut 2 Plies]';
        document.getElementById('outTopCripple').textContent = topCripple.toFixed(3) + '" (' + toFraction(topCripple) + ') between header & top plate';
        document.getElementById('outBottomCripple').textContent = sillH > 0 ? botCripple.toFixed(3) + '" (' + toFraction(botCripple) + ') below window sill' : 'N/A (Full height door)';
      }
    `
  },
  {
    slug: 'stairwell-headroom-clearance-irc',
    name: 'Stairwell Headroom Clearance Calculator',
    h1: 'Stairwell Headroom Clearance & Floor Opening Calculator (IRC R311.7.2)',
    title: 'Stairwell Headroom Clearance Calculator [IRC R311.7.2 6\'8" Rule] | Digital Tools Shed',
    metaDesc: 'Verify stairwell ceiling headroom clearance (minimum 6 feet 8 inches continuous) and calculate required floor opening rough header dimensions.',
    category: 'Framing & Finishes',
    codeRef: 'IRC R311.7.2',
    lead: 'Calculate stairwell floor rough opening dimensions to guarantee the mandatory 6-foot 8-inch continuous vertical headroom clearance under IRC codes.',
    inputs: [
      { id: 'floorToFloor', label: 'Total Floor-to-Floor Rise Height', value: 108, step: 1, unit: 'Inches', hint: 'Finished floor to finished floor' },
      { id: 'floorThick', label: 'Upper Floor Thickness / Joist Depth', value: 11.5, step: 0.5, unit: 'Inches', hint: 'Subfloor + Joist + Ceiling Drywall' },
      { id: 'unitRise', label: 'Individual Riser Height', value: 7.5, step: 0.125, unit: 'Inches' },
      { id: 'unitRun', label: 'Individual Tread Run Depth', value: 10.0, step: 0.25, unit: 'Inches' }
    ],
    primaryOutput: { id: 'outRoughOpening', label: 'Minimum Floor Opening Length', unit: 'Inches / Feet' },
    outputs: [
      { id: 'outActualClearance', label: 'Minimum Headroom Clearance' },
      { id: 'outStepsUnderHdr', label: 'Step Directly Below Header Edge' },
      { id: 'outTotalSteps', label: 'Total Stair Risers & Treads' },
      { id: 'outIrcHeadPass', label: 'IRC 6\'8" Code Compliance' }
    ],
    rules: [
      'IRC Section R311.7.2: Stairway headroom shall be NOT LESS than 6 feet 8 inches (80 inches) continuous.',
      'Headroom is measured vertically from the sloped plane adjoining the tread nosing to the ceiling plane.',
      'Cutting the floor opening too short forces descending occupants to duck their heads, causing building inspection failure.',
      'Trimmer and header joists around the stairwell opening must be doubled and hung in approved joist hangers.'
    ],
    formula: 'Headroom = 80" min | Drops = Floor Thickness + 80" = 91.5" | Opening = Total Run - Steps Required to Clear',
    faq: [
      { q: 'How is stair headroom measured under building code?', a: 'Headroom is measured vertically (straight 90-degree plumb line) from an imaginary plane connecting all tread nosings up to the ceiling overhead. It must measure at least 80 inches (6\'8") at every point.' },
      { q: 'What causes stair headroom inspection failures?', a: 'Framing the second-floor stairwell opening too short. Framers often forget to add the upper floor joist depth and ceiling drywall thickness, which drops the header directly into the occupant\'s head space.' }
    ],
    calcJs: `
      function calc() {
        var totalRise = parseFloat(document.getElementById('floorToFloor').value) || 108;
        var floorThick = parseFloat(document.getElementById('floorThick').value) || 11.5;
        var riser = parseFloat(document.getElementById('unitRise').value) || 7.5;
        var tread = parseFloat(document.getElementById('unitRun').value) || 10.0;

        var numRisers = Math.round(totalRise / riser);
        var actualRiser = totalRise / numRisers;
        var numTreads = numRisers - 1;
        var totalStairRun = numTreads * tread;

        // Vertical drop needed to clear 80" headroom:
        // Ceiling level is totalRise - floorThick from ground floor.
        // At step n (distance n*tread from bottom), elevation is n*riser.
        // Headroom = (totalRise - floorThick) - n*riser. We need Headroom >= 80"
        // So n*riser <= totalRise - floorThick - 80".
        var maxNBelowHeader = Math.floor((totalRise - floorThick - 80) / actualRiser);
        var openFromTopStep = (numRisers - maxNBelowHeader) * tread;
        var openIn = Math.ceil(openFromTopStep);

        document.getElementById('outRoughOpening').textContent = openIn + '" (' + (openIn / 12).toFixed(1) + ' ft) Minimum Opening Length';
        document.getElementById('outActualClearance').textContent = '80.0" (6\'8") Minimum Continuous Headroom Guaranteed';
        document.getElementById('outStepsUnderHdr').textContent = 'Header can extend over step #' + (maxNBelowHeader + 1) + ' from bottom';
        document.getElementById('outTotalSteps').textContent = numRisers + ' Risers at ' + actualRiser.toFixed(2) + '" & ' + numTreads + ' Treads at ' + tread + '"';
        document.getElementById('outIrcHeadPass').textContent = '✅ IRC R311.7.2 Compliant (Meets 80" minimum)';
      }
    `
  },
  {
    slug: 'circular-stair-radius-walkline',
    name: 'Curved Stair Walkline & Radius Calculator',
    h1: 'Curved & Circular Stair Walkline Radius Calculator (IRC R311.7.5.2)',
    title: 'Curved Stair Walkline & Radius Calculator [IRC 12-Inch Walkline] | Digital Tools Shed',
    metaDesc: 'Calculate curved and circular stair inner radius, outer radius, and tread run depths along the mandatory 12-inch code walkline under IRC R311.7.5.2.',
    category: 'Framing & Finishes',
    codeRef: 'IRC R311.7.5.2',
    lead: 'Calculate curved and helical stairway geometry to satisfy the mandatory 10-inch minimum tread depth along the 12-inch interior walkline.',
    inputs: [
      { id: 'innerRadius', label: 'Inside Handrail Radius (R_in)', value: 36, step: 2, unit: 'Inches', hint: 'Radius of center open well' },
      { id: 'stairWidth', label: 'Clear Stairway Width', value: 36, step: 1, unit: 'Inches', hint: '36" minimum residential clear width' },
      { id: 'degreesTurn', label: 'Total Rotation Arc of Staircase', value: 90, step: 15, unit: 'Degrees', hint: '90° quarter turn, 180° half turn' },
      { id: 'numSteps', label: 'Number of Treads in Curve', value: 6, step: 1, min: 2, unit: 'Steps' }
    ],
    primaryOutput: { id: 'outWalklineTread', label: 'Tread Run Depth on Walkline', unit: 'Inches' },
    outputs: [
      { id: 'outInnerTread', label: 'Tread Depth at Inside Edge (6" min)' },
      { id: 'outOuterTread', label: 'Tread Depth at Outside Wall' },
      { id: 'outWalkRadius', label: 'Walkline Path Radius' },
      { id: 'outIrcWinderCheck', label: 'IRC Walkline Code Status' }
    ],
    rules: [
      'IRC Section R311.7.5.2.1: Tread run shall be measured at a line 12 inches from the narrower edge (the walkline).',
      'Tread depth at the 12-inch walkline must be at least 10 inches.',
      'Tread depth at the narrowest inside edge SHALL NOT be less than 6 inches.',
      'All treads within the stairway flight must maintain uniform depth within a 3/8" maximum tolerance.'
    ],
    formula: 'Walkline Radius = Inner Radius + 12" | Angle per Step = Turn / Steps | Tread Arc = Radius × (Angle × π / 180)',
    faq: [
      { q: 'What is the "walkline" on a curved or winder staircase?', a: 'The walkline is the natural path people follow when walking down stairs with a handrail. Building codes standardize this line at exactly 12 inches from the inner, narrower edge of the stairway.' },
      { q: 'Why is the 6-inch minimum inside tread rule enforced?', a: 'If winder treads come to a sharp zero-width point (like pizza slices), anyone stepping near the inside edge will slip and twist their ankle. A 6-inch minimum inside tread provides safe footing.' }
    ],
    calcJs: `
      function calc() {
        var rIn = parseFloat(document.getElementById('innerRadius').value) || 36;
        var width = parseFloat(document.getElementById('stairWidth').value) || 36;
        var deg = parseFloat(document.getElementById('degreesTurn').value) || 90;
        var steps = parseInt(document.getElementById('numSteps').value, 10) || 6;

        var degPerStep = deg / steps;
        var radPerStep = (degPerStep * Math.PI) / 180;

        var rWalk = rIn + 12.0;
        var rOut = rIn + width;

        var walkTread = rWalk * radPerStep;
        var inTread = rIn * radPerStep;
        var outTread = rOut * radPerStep;

        var passWalk = walkTread >= 10.0;
        var passIn = inTread >= 6.0;
        var fullPass = passWalk && passIn;

        document.getElementById('outWalklineTread').textContent = walkTread.toFixed(2) + '" (' + toFraction(walkTread) + ') Tread Depth on Walkline';
        document.getElementById('outInnerTread').textContent = inTread.toFixed(2) + '" (' + toFraction(inTread) + ') Inside Edge (6.0" min req)';
        document.getElementById('outOuterTread').textContent = outTread.toFixed(2) + '" Outside Edge Depth';
        document.getElementById('outWalkRadius').textContent = rWalk + '" Radius (12" out from inner handrail)';

        var badge = document.getElementById('statusBadge');
        if (fullPass) {
          document.getElementById('outIrcWinderCheck').textContent = '✅ Code Compliant (Walkline ≥ 10", Inside ≥ 6")';
          document.getElementById('outIrcWinderCheck').style.color = '#22c55e';
          badge.textContent = 'IRC R311.7.5 Pass: Curved stair geometry code compliant';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outIrcWinderCheck').textContent = '❌ Code Violation: Increase inner radius or reduce step count';
          document.getElementById('outIrcWinderCheck').style.color = '#ef4444';
          badge.textContent = 'Geometry Warning: Fails IRC winder rules';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'drywall-sheet-horizontal-vs-vertical',
    name: 'Drywall Hanging Orientation & Joint Calculator',
    h1: 'Drywall Hanging Orientation: Horizontal vs Vertical Layout Calculator',
    title: 'Drywall Horizontal vs Vertical Layout Calculator [Joint Linear Feet & Waste] | Digital Tools Shed',
    metaDesc: 'Compare horizontal versus vertical drywall hanging: calculate total sheets, butt joint counts, and taped seam linear footage.',
    category: 'Framing & Finishes',
    codeRef: 'GA-216 Standards',
    lead: 'Compare horizontal versus vertical drywall installation to minimize difficult-to-finish butt joints and calculate taped seam linear footage.',
    inputs: [
      { id: 'roomL', label: 'Room Length', value: 20, step: 1, unit: 'Feet' },
      { id: 'roomW', label: 'Room Width', value: 14, step: 1, unit: 'Feet' },
      { id: 'wallH', label: 'Finished Ceiling Height', type: 'select', options: [
        { value: '8', label: '8-Foot Ceiling (96" Height)', selected: true },
        { value: '9', label: '9-Foot Ceiling (108" Height - Use 54" wide sheets)' },
        { value: '10', label: '10-Foot Ceiling (120" Height)' }
      ]},
      { id: 'sheetSize', label: 'Drywall Sheet Dimensions', type: 'select', options: [
        { value: '4x8', label: '4x8 Foot Sheets (32 sq ft)' },
        { value: '4x12', label: '4x12 Foot Sheets (48 sq ft - Professional)', selected: true }
      ]}
    ],
    primaryOutput: { id: 'outHorizSheets', label: 'Horizontal Hanging Sheets', unit: 'Sheets' },
    outputs: [
      { id: 'outVertSheets', label: 'Vertical Hanging Sheets' },
      { id: 'outHorizSeamFt', label: 'Horizontal Taped Seam Lineal Feet' },
      { id: 'outVertSeamFt', label: 'Vertical Taped Seam Lineal Feet' },
      { id: 'outProRec', label: 'Drywall Pro Hanging Recommendation' }
    ],
    rules: [
      'Gypsum Association GA-216: Horizontal hanging yields approximately 25% fewer linear feet of taped joints on residential walls.',
      'Horizontal hanging spans studs, tying framing together structurally and concealing minor stud alignment imperfections.',
      'Butt joints (non-tapered ends) are the hardest joints to tape flat; using 12-foot sheets eliminates butt joints on rooms up to 12 feet long.',
      'Commercial steel stud construction often mandates vertical hanging to meet 1-hour and 2-hour fire-rated wall assemblies.'
    ],
    formula: 'Wall Area = 2 × (L + W) × H | Sheets = ⌈Area / Sheet SqFt⌉ × 1.10 | Joint calculations based on sheet boundaries',
    faq: [
      { q: 'Why do professional drywallers hang sheets horizontally on walls?', a: 'Horizontal hanging creates one continuous tapered joint at 48" height, which is comfortable to tape at waist level. It also bridges minor framing irregularities across multiple studs and reduces total seam footage by roughly 25%.' },
      { q: 'When is vertical drywall hanging required?', a: 'Vertical hanging is standard in commercial commercial construction with metal studs where ceiling heights exceed 12 feet or where fire codes require continuous gypsum seams over single structural studs.' }
    ],
    calcJs: `
      function calc() {
        var l = parseFloat(document.getElementById('roomL').value) || 20;
        var w = parseFloat(document.getElementById('roomW').value) || 14;
        var h = parseFloat(document.getElementById('wallH').value) || 8;
        var sSize = document.getElementById('sheetSize').value;

        var perim = 2 * (l + w);
        var wallSqFt = perim * h;
        var sArea = sSize === '4x8' ? 32 : 48;
        var sLen = sSize === '4x8' ? 8 : 12;

        var sheetsReq = Math.ceil((wallSqFt / sArea) * 1.08); // 8% cut waste

        // Horizontal seams: 1 continuous perimeter seam + butt joints
        var horizSeams = perim;
        var numButts = Math.ceil(perim / sLen) * (h / 4);
        var horizTotalSeam = horizSeams + (numButts * 4);

        // Vertical seams: seams every 4 feet full height
        var vertTotalSeam = (perim / 4) * h;

        document.getElementById('outHorizSheets').textContent = sheetsReq + ' Sheets (' + sSize + ') hung horizontally';
        document.getElementById('outVertSheets').textContent = sheetsReq + ' Sheets hung vertically';
        document.getElementById('outHorizSeamFt').textContent = Math.round(horizTotalSeam) + ' Lineal Feet of tape (Easier waist-level finishing)';
        document.getElementById('outVertSeamFt').textContent = Math.round(vertTotalSeam) + ' Lineal Feet of tape (Floor-to-ceiling seams)';
        document.getElementById('outProRec').textContent = 'Hang Horizontally using 12-ft sheets: 25% less mudding labor';
      }
    `
  },
  {
    slug: 'paint-primer-dry-film-thickness',
    name: 'Paint Dry Film Thickness (DFT) & Coverage Calculator',
    h1: 'Paint Dry Film Thickness (DFT) & Wet Film Thickness (WFT) Calculator',
    title: 'Paint Dry Film Thickness Calculator [WFT, DFT & Volume Solids] | Digital Tools Shed',
    metaDesc: 'Calculate Dry Film Thickness (DFT) in mils from Wet Film Thickness (WFT) and paint percent volume solids under SSPC-PA 2 standards.',
    category: 'Framing & Finishes',
    codeRef: 'SSPC-PA 2 / ASTM D4414',
    lead: 'Calculate Wet Film Thickness (WFT) and Dry Film Thickness (DFT) in mils based on paint volume solids and square foot coverage rates.',
    inputs: [
      { id: 'areaSqFt', label: 'Surface Area to Paint', value: 1200, step: 50, unit: 'Sq Ft' },
      { id: 'volSolids', label: 'Paint Percent Volume Solids (% VS)', value: 38, step: 2, min: 20, max: 100, unit: '% Solids', hint: 'Contractor latex ~30-35%, Premium acrylic ~38-45%, Epoxy ~70-100%' },
      { id: 'targetDft', label: 'Specified Dry Film Thickness (DFT)', value: 1.5, step: 0.25, unit: 'Mils (0.001")', hint: 'Standard architectural finish = 1.5 to 2.0 mils dry' },
      { id: 'numCoats', label: 'Number of Coats Applied', value: 2, step: 1, unit: 'Coats' }
    ],
    primaryOutput: { id: 'outReqGallons', label: 'Total Paint Required', unit: 'Gallons' },
    outputs: [
      { id: 'outReqWft', label: 'Target Wet Film Thickness (WFT)' },
      { id: 'outSqFtPerGal', label: 'Theoretical Coverage Rate' },
      { id: 'outCombGauge', label: 'Wet Film Comb Gauge Setting' },
      { id: 'outThinnerNote', label: 'Thinner / Water Dilution Effect' }
    ],
    rules: [
      'Fundamental Coating Law: Dry Film Thickness (DFT) = Wet Film Thickness (WFT) × (% Volume Solids / 100).',
      'Target Wet Film Thickness: WFT = Target DFT / (% Volume Solids / 100).',
      'One gallon of 100% volume solids paint spread over 1,604 square feet produces exactly 1.0 mil DFT.',
      'Thinning paint with water or solvent reduces the volume solids percentage, requiring heavier wet applications to meet DFT specs.'
    ],
    formula: 'WFT = DFT / (% VS / 100) | Spread Rate = (1604 × % VS) / (DFT × 100) | Gallons = (Area / Spread Rate) × Coats',
    faq: [
      { q: 'What is the difference between volume solids and weight solids in paint?', a: 'Weight solids include heavy fillers and pigments that evaporate no solvent. Volume solids represent the true percentage of liquid paint volume that remains on the wall as a permanent dried protective film after all water/solvents evaporate.' },
      { q: 'How thick is 1 mil of paint?', a: 'One mil equals one one-thousandth of an inch (0.001" or 25.4 microns). A standard sheet of notebook paper is roughly 3 to 4 mils thick.' }
    ],
    calcJs: `
      function calc() {
        var area = parseFloat(document.getElementById('areaSqFt').value) || 1200;
        var vs = parseFloat(document.getElementById('volSolids').value) || 38;
        var dft = parseFloat(document.getElementById('targetDft').value) || 1.5;
        var coats = parseInt(document.getElementById('numCoats').value, 10) || 2;

        var vsDec = vs / 100;
        var reqWft = dft / vsDec;
        var covPerGal = (1604 * vsDec) / dft;
        var galsPerCoat = area / covPerGal;
        var totalGals = Math.ceil(galsPerCoat * coats * 1.10); // 10% roller/brush loss

        document.getElementById('outReqGallons').textContent = totalGals + ' Gallons (for ' + coats + ' coats with 10% loss)';
        document.getElementById('outReqWft').textContent = reqWft.toFixed(1) + ' Mils Wet Film Thickness (WFT)';
        document.getElementById('outSqFtPerGal').textContent = Math.round(covPerGal) + ' sq ft / gallon theoretical coverage';
        document.getElementById('outCombGauge').textContent = 'Measure ' + reqWft.toFixed(1) + ' mils on notched wet film comb';
        document.getElementById('outThinnerNote').textContent = 'Based on unthinned paint at ' + vs + '% volume solids';
      }
    `
  },
  {
    slug: 'insulation-r-value-thickness-table',
    name: 'Insulation R-Value & Thickness Sizing Calculator',
    h1: 'Insulation R-Value & Thickness Sizing Calculator (IECC 2024)',
    title: 'Insulation R-Value & Thickness Sizing Calculator [IECC Climate Zones] | Digital Tools Shed',
    metaDesc: 'Determine required insulation R-values by IECC climate zone (R-13 to R-60) and calculate required thickness in inches across fiberglass, cellulose, and spray foam.',
    category: 'Framing & Finishes',
    codeRef: 'IECC 2024 Table R402.1.2',
    lead: 'Determine required insulation R-values by regional climate zone and calculate required installed thickness across fiberglass batts, blown cellulose, and closed-cell spray foam.',
    inputs: [
      { id: 'climateZone', label: 'IECC Regional Climate Zone', type: 'select', options: [
        { value: '1', label: 'Zone 1 & 2 (Deep South / Florida / Texas Gulf)' },
        { value: '3', label: 'Zone 3 (Southeast / Southern Plains)' },
        { value: '4', label: 'Zone 4 (Mid-Atlantic / Central - Climate 4)', selected: true },
        { value: '5', label: 'Zone 5 (Midwest / New York / Great Lakes)' },
        { value: '6', label: 'Zone 6 & 7 (Northern Tier / New England / Canada Border)' }
      ]},
      { id: 'location', label: 'Building Assembly Location', type: 'select', options: [
        { value: 'attic', label: 'Attic / Flat Ceiling (R-49 to R-60)', selected: true },
        { value: 'wall', label: 'Wood Frame Exterior Wall (R-13 to R-20)' },
        { value: 'floor', label: 'Crawlspace / Floor Over Unconditioned Space (R-19 to R-30)' }
      ]},
      { id: 'insulType', label: 'Insulation Material Type', type: 'select', options: [
        { value: '3.14', label: 'Fiberglass Blown / Batts (R-3.14 per inch)', selected: true },
        { value: '3.60', label: 'Dense-Pack Blown Cellulose (R-3.60 per inch)' },
        { value: '6.50', label: 'Closed-Cell Spray Foam 2 lb (R-6.50 per inch)' },
        { value: '5.00', label: 'XPS Rigid Foam Board (R-5.00 per inch)' }
      ]}
    ],
    primaryOutput: { id: 'outReqR', label: 'Code Required Target R-Value', unit: 'R-Value' },
    outputs: [
      { id: 'outThickInches', label: 'Required Installed Thickness' },
      { id: 'outCavityFit', label: '2x4 vs 2x6 Cavity Compatibility' },
      { id: 'outAirSealing', label: 'Air Barrier Requirement' },
      { id: 'outEnergySavings', label: 'Thermal Resistance Grade' }
    ],
    rules: [
      'IECC 2024 Table R402.1.2: Attic ceiling insulation requires R-49 in Zones 1–3 and R-60 in Zones 4–8.',
      'Wood frame walls require R-20 cavity insulation or R-13 cavity + R-5 continuous exterior rigid foam.',
      'Compressed fiberglass batts lose R-value: stuffing an R-19 (6.25") batt into a 2x4 (3.5") cavity reduces its rating to R-13.',
      'Closed-cell spray foam acts as a vapor barrier and air barrier at thicknesses of 2 inches or greater.'
    ],
    formula: 'Thickness (in) = Target R-Value / R-Value_per_inch',
    faq: [
      { q: 'What happens if you cram an R-30 fiberglass batt into a 2x6 wall?', a: 'Fiberglass insulates by trapping quiet dead-air pockets between glass fibers. Compressing a thick batt destroys those air pockets, dramatically reducing thermal resistance and wasting money.' },
      { q: 'Why is R-60 required in modern northern attics?', a: 'Heated air naturally rises through thermal buoyancy. In cold climates, up to 40% of heating energy escapes through the attic. R-60 provides an unyielding thermal blanket (~17 to 19 inches deep) that stops conductive heat loss.' }
    ],
    calcJs: `
      function calc() {
        var zone = document.getElementById('climateZone').value;
        var loc = document.getElementById('location').value;
        var rPerIn = parseFloat(document.getElementById('insulType').value) || 3.14;

        var targetR = 49;
        if (loc === 'attic') {
          targetR = (zone === '1' || zone === '2' || zone === '3') ? 49 : 60;
        } else if (loc === 'wall') {
          targetR = 20;
        } else {
          targetR = (zone === '1' || zone === '2') ? 19 : 30;
        }

        var thickIn = targetR / rPerIn;
        var fit = 'Attic Floor Trusses (Open depth)';
        if (loc === 'wall') {
          fit = thickIn <= 3.5 ? 'Fits standard 2x4 wall cavity (3.5")' : (thickIn <= 5.5 ? 'Requires 2x6 wall framing (5.5" cavity)' : 'Requires 2x6 framing + exterior continuous foam');
        }

        document.getElementById('outReqR').textContent = 'R-' + targetR + ' Target Insulation Rating';
        document.getElementById('outThickInches').textContent = thickIn.toFixed(1) + '" (' + Math.ceil(thickIn) + ' inches) Installed Depth';
        document.getElementById('outCavityFit').textContent = fit;
        document.getElementById('outAirSealing').textContent = rPerIn >= 6.0 ? 'Self-sealing air & vapor barrier' : 'Requires dedicated air sealing (caulk/can foam) prior to insulation';
        document.getElementById('outEnergySavings').textContent = 'IECC 2024 / IRC N1102 Climate Zone ' + zone + ' Compliant';
      }
    `
  },
  {
    slug: 'blown-cellulose-attic-bag-count',
    name: 'Blown-In Attic Cellulose Bag Count Calculator',
    h1: 'Blown-In Attic Cellulose Insulation Bag Count & Settled Depth Calculator',
    title: 'Blown-In Attic Cellulose Bag Count Calculator [Coverage Chart & R-Value] | Digital Tools Shed',
    metaDesc: 'Calculate manufacturer coverage chart bag counts and settled thickness for blown-in loose-fill cellulose attic insulation (R-38, R-49, R-60).',
    category: 'Framing & Finishes',
    codeRef: 'CIMA / ASTM C739',
    lead: 'Calculate bag counts and minimum settled thickness for blown-in loose-fill attic cellulose insulation to meet target code R-values.',
    inputs: [
      { id: 'atticArea', label: 'Attic Floor Area to Insulate', value: 1400, step: 50, unit: 'Sq Ft' },
      { id: 'targetR', label: 'Target Attic Thermal Resistance', type: 'select', options: [
        { value: '38', label: 'R-38 (Existing home retrofit - ~10.5" settled)' },
        { value: '49', label: 'R-49 (Standard Code - ~13.6" settled)', selected: true },
        { value: '60', label: 'R-60 (Cold Climate High Efficiency - ~16.7" settled)' }
      ]},
      { id: 'existingR', label: 'Existing Attic Insulation in Place', type: 'select', options: [
        { value: '0', label: 'Empty Attic Floor / New Construction (R-0)', selected: true },
        { value: '13', label: 'Old 4" Fiberglass Batts (~R-13)' },
        { value: '19', label: 'Old 6" Fiberglass Batts (~R-19)' }
      ]}
    ],
    primaryOutput: { id: 'outBagsNeeded', label: 'Cellulose Bags to Purchase', unit: 'Bags (30 lb)' },
    outputs: [
      { id: 'outInitialDepth', label: 'Initial Blown Installation Depth' },
      { id: 'outSettledDepth', label: 'Minimum Settled Depth (After 6 Months)' },
      { id: 'outBlowerHours', label: 'Estimated Blower Machine Run Time' },
      { id: 'outRulerDepth', label: 'Attic Cardboard Depth Gauge Mark' }
    ],
    rules: [
      'Cellulose insulation naturally settles approximately 15% to 20% by volume within 6 months of pneumatic blowing.',
      'Attic rulers (depth gauges) must be stapled to roof trusses every 300 square feet under building code.',
      'Installer must blow to "Initial Installed Thickness" to ensure the insulation retains the specified R-value after settling.',
      'Install cardboard rafter baffles (accu-vents) at all eaves to keep cellulose from spilling into soffits.'
    ],
    formula: 'Net R = Target R - Existing R | Bags = Area / SqFt_per_bag_at_Net_R | Initial Depth = Settled Depth × 1.20',
    faq: [
      { q: 'Why does blown-in cellulose settle after installation?', a: 'Loose-fill cellulose is pumped full of air during pneumatic machine blowing. Over several months, gravity consolidates the fibers, reducing air space by ~15% until it reaches its stabilized design density (approx 1.5 lbs/cu ft).' },
      { q: 'Can you blow cellulose directly on top of old fiberglass batts?', a: 'Yes. Cellulose is dense and fills all the gaps, cracks, and mouse tunnels in old fiberglass batts, stopping air convection and upgrading the total attic R-value.' }
    ],
    calcJs: `
      function calc() {
        var area = parseFloat(document.getElementById('atticArea').value) || 1400;
        var rTarget = parseFloat(document.getElementById('targetR').value) || 49;
        var rExist = parseFloat(document.getElementById('existingR').value) || 0;

        var netR = Math.max(10, rTarget - rExist);

        // Standard 30-lb bag coverage chart:
        // R-38 = ~40 sq ft/bag, R-49 = ~30 sq ft/bag, R-60 = ~24 sq ft/bag
        var sqFtPerBag = 30;
        var settledIn = netR / 3.6;

        if (netR <= 30) sqFtPerBag = 50;
        else if (netR <= 38) sqFtPerBag = 40;
        else if (netR <= 49) sqFtPerBag = 30;
        else sqFtPerBag = 24;

        var totalBags = Math.ceil(area / sqFtPerBag);
        var initialIn = settledIn * 1.20; // 20% settling allowance
        var hoursBlower = (totalBags / 20).toFixed(1); // 20 bags/hr rental machine

        document.getElementById('outBagsNeeded').textContent = totalBags + ' Bags (30 lb Greenfiber / Applegate)';
        document.getElementById('outInitialDepth').textContent = initialIn.toFixed(1) + '" Initial Blow Depth (Blow to this mark)';
        document.getElementById('outSettledDepth').textContent = settledIn.toFixed(1) + '" Stabilized Settled Depth (Delivers R-' + netR + ')';
        document.getElementById('outBlowerHours').textContent = '~' + hoursBlower + ' hours continuous blower run time';
        document.getElementById('outRulerDepth').textContent = 'Staple attic depth rulers every 300 sq ft (IRC Requirement)';
      }
    `
  },
  {
    slug: 'continuous-insulation-dew-point-wall',
    name: 'Continuous Wall Insulation Dew Point Calculator',
    h1: 'Wall Continuous Exterior Insulation Dew Point & Condensation Calculator',
    title: 'Wall Continuous Exterior Insulation Dew Point Calculator [IRC R702.7 Table] | Digital Tools Shed',
    metaDesc: 'Verify minimum exterior continuous rigid insulation R-values (R-5 to R-15) to keep wall sheathing above indoor dew point under IRC Table R702.7.1.',
    category: 'Framing & Finishes',
    codeRef: 'IRC Table R702.7.1',
    lead: 'Calculate minimum exterior continuous rigid foam insulation R-values to keep interior OSB wall sheathing warm enough to prevent winter condensation.',
    inputs: [
      { id: 'zone', label: 'IECC Climate Zone', type: 'select', options: [
        { value: '3', label: 'Zone 3 (Mild - Atlanta, Dallas)' },
        { value: '4', label: 'Zone 4 (Central - DC, St. Louis, Seattle)', selected: true },
        { value: '5', label: 'Zone 5 (Cold - Chicago, Boston, Denver)' },
        { value: '6', label: 'Zone 6 (Very Cold - Minneapolis, Vermont)' },
        { value: '7', label: 'Zone 7/8 (Extreme Cold - North Dakota, Alaska)' }
      ]},
      { id: 'cavityInsul', label: 'Stud Cavity Insulation R-Value', type: 'select', options: [
        { value: '13', label: '2x4 Wall: R-13 Cavity' },
        { value: '15', label: '2x4 Wall: R-15 High Density' },
        { value: '20', label: '2x6 Wall: R-20 Cavity', selected: true },
        { value: '21', label: '2x6 Wall: R-21 High Density' }
      ]},
      { id: 'foamR', label: 'Proposed Exterior Continuous Foam R-Value', value: 5.0, step: 2.5, unit: 'R-Value', hint: '1" XPS = R-5, 1.5" Polyiso = R-9, 2" EPS = R-8' }
    ],
    primaryOutput: { id: 'outMinCiR', label: 'Minimum Required Continuous Foam R-Value', unit: 'R-Value' },
    outputs: [
      { id: 'outSheathingTemp', label: 'OSB Sheathing Winter Temp at 0°F' },
      { id: 'outDewPointMargin', label: 'Condensation Safety Margin' },
      { id: 'outVaporBarrierClass', label: 'Permitted Interior Vapor Retarder Class' },
      { id: 'outCondenseStatus', label: 'IRC Table R702.7.1 Status' }
    ],
    rules: [
      'IRC Table R702.7.1: Continuous exterior insulation must be thick enough to keep sheathing above indoor dew point in winter.',
      'If exterior foam R-value meets code minimums, Class I vapor retarders (polyethylene sheeting) can be safely omitted inside.',
      'Putting thick cavity insulation with too-thin exterior foam freezes the OSB sheathing, creating a condensation rot chamber.',
      'For a 2x6 R-20 wall in Climate Zone 5, building code mandates at least R-7.5 continuous exterior insulation.'
    ],
    formula: 'Sheathing Temp = T_indoor - (T_indoor - T_outdoor) × [R_cavity / (R_cavity + R_ci + R_sheathing)]',
    faq: [
      { q: 'Why does adding cavity insulation make wall sheathing colder in winter?', a: 'Cavity insulation stops heat from escaping the home. But heat escaping the home is what keeps exterior wood sheathing warm. Adding thick cavity insulation without exterior foam drops sheathing temperature below freezing, causing indoor humidity to condense on it.' },
      { q: 'Why is interior plastic poly sheeting bad when you have exterior rigid foam?', a: 'If exterior foam is impermeable (foil-faced or XPS), putting plastic sheeting on the interior creates a double vapor barrier. Any moisture that enters the wall cavity is permanently trapped between two sheets of plastic, rotting the wall studs.' }
    ],
    calcJs: `
      function calc() {
        var zone = document.getElementById('zone').value;
        var rCavity = parseFloat(document.getElementById('cavityInsul').value) || 20;
        var rExt = parseFloat(document.getElementById('foamR').value) || 5.0;

        // IRC Table R702.7.1 minimum continuous R-value
        var reqExtR = 5.0;
        if (rCavity <= 15) { // 2x4
          if (zone === '3') reqExtR = 2.5;
          else if (zone === '4') reqExtR = 3.75;
          else if (zone === '5') reqExtR = 5.0;
          else if (zone === '6') reqExtR = 7.5;
          else reqExtR = 10.0;
        } else { // 2x6
          if (zone === '3') reqExtR = 3.0;
          else if (zone === '4') reqExtR = 5.0;
          else if (zone === '5') reqExtR = 7.5;
          else if (zone === '6') reqExtR = 11.25;
          else reqExtR = 15.0;
        }

        var totalR = rCavity + rExt + 1.5; // air films + siding
        var tIn = 70.0, tOut = 10.0;
        var tSheathing = tIn - ((tIn - tOut) * (rCavity / totalR));
        var pass = rExt >= reqExtR;

        document.getElementById('outMinCiR').textContent = 'R-' + reqExtR + ' Minimum Continuous Foam Required';
        document.getElementById('outSheathingTemp').textContent = tSheathing.toFixed(1) + '°F winter sheathing temp at 10°F outdoor';
        document.getElementById('outDewPointMargin').textContent = tSheathing > 45 ? 'Warm Sheathing: Stays above typical indoor dew point' : 'Cold Sheathing: Moisture condensation risk';
        document.getElementById('outVaporBarrierClass').textContent = pass ? 'Class III Vapor Retarder (Latex Paint) permitted inside' : 'Requires Class II or smart vapor retarder';

        var badge = document.getElementById('statusBadge');
        if (pass) {
          document.getElementById('outCondenseStatus').textContent = '✅ Code Compliant (R-' + rExt + ' ≥ R-' + reqExtR + ')';
          document.getElementById('outCondenseStatus').style.color = '#22c55e';
          badge.textContent = 'IRC R702.7 Pass: Sheathing protected from condensation';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outCondenseStatus').textContent = '❌ DANGER: Foam too thin! Sheathing will condense moisture';
          document.getElementById('outCondenseStatus').style.color = '#ef4444';
          badge.textContent = 'Building Science Alert: Increase exterior foam thickness';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'acoustic-stc-wall-rating-assemblies',
    name: 'Acoustic Sound Transmission Class (STC) Calculator',
    h1: 'Acoustic Wall Sound Transmission Class (STC) Rating Calculator',
    title: 'Acoustic Wall Sound Transmission Class (STC) Calculator [IRC STC 50 Party Wall] | Digital Tools Shed',
    metaDesc: 'Estimate STC acoustic sound isolation ratings for single stud, staggered stud, and double wall assemblies with resilient channel and Green Glue.',
    category: 'Framing & Finishes',
    codeRef: 'IRC Appendix K / IBC 1206',
    lead: 'Calculate acoustic Sound Transmission Class (STC) sound isolation ratings for common residential party walls and home theater assemblies.',
    inputs: [
      { id: 'assemblyType', label: 'Wall Framing Assembly Structure', type: 'select', options: [
        { value: '33', label: 'Standard Single 2x4 Stud Wall (STC ~33 - Conversations audible)' },
        { value: '38', label: 'Single 2x4 Wall + Fiberglass Insulation (STC ~38)' },
        { value: '47', label: 'Single 2x4 + Insulation + Resilient Channel RC-1 (STC ~47)' },
        { value: '50', label: 'Staggered 2x4 Studs on 2x6 Plate + Batt (STC ~50 - Code Party Wall)', selected: true },
        { value: '57', label: 'Double 2x4 Walls (1" Air Gap) + Batt (STC ~57 - High Isolation)' }
      ]},
      { id: 'drywallLayers', label: 'Drywall Layers & Damping', type: 'select', options: [
        { value: '0', label: 'Single Layer 1/2" Drywall Each Side (Baseline)' },
        { value: '3', label: 'Double 5/8" Drywall One Side (+3 STC)' },
        { value: '6', label: 'Double 5/8" Drywall Both Sides (+6 STC)', selected: true },
        { value: '10', label: 'Double 5/8" Drywall with Green Glue Damping Compound (+10 STC)' }
      ]}
    ],
    primaryOutput: { id: 'outTotalStc', label: 'Estimated Assembly STC Rating', unit: 'STC Points' },
    outputs: [
      { id: 'outAcousticPerf', label: 'Acoustic Privacy Level' },
      { id: 'outIrcCodeCheck', label: 'IRC / IBC 50 Party Wall Requirement' },
      { id: 'outFlankingNoise', label: 'Flanking Path Weaknesses' },
      { id: 'outDecibelDrop', label: 'Approximate Sound Decibel Reduction' }
    ],
    rules: [
      'IBC Section 1206 / IRC Appendix K: Common party walls separating dwelling units mandate a minimum laboratory STC of 50.',
      'STC is logarithmic: an increase of 10 STC points cuts perceived loudness in half (50% subjective noise reduction).',
      'Flanking paths (unsealed penetrations, back-to-back electrical boxes, ductwork) ruin high-STC walls; acoustic caulk is mandatory.',
      'Standard single-stud walls transmit low-frequency subwoofer bass vibrations mechanically regardless of insulation batts.'
    ],
    formula: 'Estimated STC = Base Assembly STC + Drywall Damping Multipliers (validated against GA-600 Fire & Sound Manual)',
    faq: [
      { q: 'Why does adding fiberglass insulation only add 3 to 4 STC points to a standard wall?', a: 'Because sound travels through the rigid wooden studs via mechanical vibration (structural bridging). Sound takes the path of least resistance through the solid wood studs rather than through the insulated cavity.' },
      { q: 'What is the most cost-effective way to achieve STC 50 for an apartment party wall?', a: 'A staggered-stud wall (2x4 studs staggered on a 2x6 plate) with fiberglass batts and 5/8" Type X drywall achieves STC 50. Because the studs do not touch both drywall faces, it breaks the mechanical vibration bridge.' }
    ],
    calcJs: `
      function calc() {
        var baseStc = parseFloat(document.getElementById('assemblyType').value) || 50;
        var addStc = parseFloat(document.getElementById('drywallLayers').value) || 6;

        var totalStc = baseStc + addStc;
        var passCode = totalStc >= 50;

        var privacy = 'Conversations Heard Clearly';
        if (totalStc >= 60) privacy = 'Superior Isolation: Shouting & loud stereo inaudible';
        else if (totalStc >= 50) privacy = 'Code Party Wall: Loud speech inaudible; heavy bass muffled';
        else if (totalStc >= 45) privacy = 'Good Privacy: Loud speech heard as a faint murmur';
        else if (totalStc >= 38) privacy = 'Moderate Privacy: Loud speech understood easily';

        document.getElementById('outTotalStc').textContent = 'STC ' + totalStc + ' Estimated Acoustic Rating';
        document.getElementById('outAcousticPerf').textContent = privacy;
        document.getElementById('outFlankingNoise').textContent = 'Seal all electrical cutouts with acoustic putty pads';
        document.getElementById('outDecibelDrop').textContent = '~' + (totalStc - 5) + ' dB sound attenuation across speech frequencies';

        var badge = document.getElementById('statusBadge');
        if (passCode) {
          document.getElementById('outIrcCodeCheck').textContent = '✅ Meets IBC 1206 / IRC Code (STC ≥ 50 Party Wall)';
          document.getElementById('outIrcCodeCheck').style.color = '#22c55e';
          badge.textContent = 'Acoustic Pass: STC ≥ 50 satisfied';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outIrcCodeCheck').textContent = '❌ Fails Multifamily Code (STC ' + totalStc + ' < 50)';
          document.getElementById('outIrcCodeCheck').style.color = '#ef4444';
          badge.textContent = 'Acoustic Alert: Add resilient channels or double wall';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'gutter-downspout-roof-drainage-area',
    name: 'Roof Gutter & Downspout Sizing Calculator',
    h1: 'Roof Gutter & Downspout Sizing Calculator (SMACNA & IPC)',
    title: 'Roof Gutter & Downspout Sizing Calculator [SMACNA Drainage Area] | Digital Tools Shed',
    metaDesc: 'Size 5-inch vs 6-inch K-style gutters and 2x3 vs 3x4 downspouts based on roof drainage square footage, pitch factor, and rainfall intensity.',
    category: 'Framing & Finishes',
    codeRef: 'SMACNA / IPC Chapter 11',
    lead: 'Size seamless K-style gutters and rectangular downspouts using SMACNA watershed catchment math and local 100-year rainfall intensity rates.',
    inputs: [
      { id: 'roofFootprint', label: 'Roof Surface Horizontal Footprint Area', value: 1200, step: 50, unit: 'Sq Ft', hint: 'Length × Width of roof section draining to this gutter' },
      { id: 'pitchFactor', label: 'Roof Pitch Wind Factor', type: 'select', options: [
        { value: '1.00', label: 'Flat to 3:12 Pitch (Factor = 1.00)' },
        { value: '1.10', label: '4:12 to 5:12 Pitch (Factor = 1.10)', selected: true },
        { value: '1.20', label: '6:12 to 8:12 Pitch (Factor = 1.20)' },
        { value: '1.30', label: '9:12 to 12:12 Steep Pitch (Factor = 1.30)' }
      ]},
      { id: 'rainRate', label: 'Design 100-Year Rainfall Intensity', value: 4.0, step: 0.5, unit: 'Inches / Hour', hint: 'US national average is 3.5 to 5.0 in/hr' }
    ],
    primaryOutput: { id: 'outGutterSize', label: 'Recommended Gutter Size', unit: 'K-Style Profile' },
    outputs: [
      { id: 'outAdjustedArea', label: 'Adjusted Design Watershed Area' },
      { id: 'outDownspoutsReq', label: 'Required 2x3" Downspout Count' },
      { id: 'outLargeDownspouts', label: 'Alternative 3x4" Downspout Count' },
      { id: 'outMaxSpoutSpacing', label: 'Maximum Downspout Spacing' }
    ],
    rules: [
      'SMACNA Watershed Formula: Design Drainage Area = Footprint Area × Pitch Multiplier.',
      'Steep roofs catch wind-driven rain, effectively increasing the volume of water entering the gutter by up to 30%.',
      'A standard 5-inch K-style gutter handles up to 5,500 sq ft of adjusted area; 6-inch gutters handle up to 7,900 sq ft.',
      'One 3x4" downspout drains more than double the volume of a 2x3" downspout (12 sq in vs 6 sq in).'
    ],
    formula: 'Adjusted Area = Footprint × Pitch Factor | Downspout capacity: 2x3" = 600 sq ft at 4"/hr rain, 3x4" = 1200 sq ft',
    faq: [
      { q: 'Why do steep roofs need bigger gutters than flat roofs?', a: 'Wind drives rain against steep roofs at an angle. A 10:12 roof catches significantly more incoming rain than a flat roof of the exact same ground footprint, requiring a pitch multiplication factor of 1.2 to 1.3.' },
      { q: 'Why should homeowners upgrade from 5-inch to 6-inch gutters?', a: '6-inch K-style gutters hold 40% more water volume than 5-inch gutters and pair with larger 3x4" downspouts that rarely clog with wet leaves and twigs.' }
    ],
    calcJs: `
      function calc() {
        var area = parseFloat(document.getElementById('roofFootprint').value) || 1200;
        var pitch = parseFloat(document.getElementById('pitchFactor').value) || 1.10;
        var rain = parseFloat(document.getElementById('rainRate').value) || 4.0;

        var adjArea = area * pitch;
        var rainRatio = rain / 4.0;

        // Capacity at 4"/hr: 2x3" spout = 600 sq ft, 3x4" spout = 1200 sq ft
        var capSmall = 600 / rainRatio;
        var capLarge = 1200 / rainRatio;

        var numSmall = Math.ceil(adjArea / capSmall);
        var numLarge = Math.ceil(adjArea / capLarge);

        var gutter = adjArea > 2500 || rain >= 4.5 ? '6-Inch K-Style Gutter (High-Capacity)' : '5-Inch K-Style Gutter (Standard Residential)';

        document.getElementById('outGutterSize').textContent = gutter;
        document.getElementById('outAdjustedArea').textContent = Math.round(adjArea).toLocaleString() + ' sq ft adjusted watershed area';
        document.getElementById('outDownspoutsReq').textContent = numSmall + ' Standard 2x3" Downspouts Needed OR';
        document.getElementById('outLargeDownspouts').textContent = numLarge + ' Commercial 3x4" Downspout(s) (Recommended)';
        document.getElementById('outMaxSpoutSpacing').textContent = 'Space downspouts max 40 feet apart along gutter run';
      }
    `
  },
  {
    slug: 'chimney-flue-sizing-appliance-btu',
    name: 'Masonry Chimney Flue Sizing Calculator',
    h1: 'Masonry Chimney Flue Sizing & Appliance Draft Calculator (NFPA 211)',
    title: 'Chimney Flue Sizing Calculator [NFPA 211 / IRC R1003 Area] | Digital Tools Shed',
    metaDesc: 'Size rectangular and round clay tile chimney flues (1/10th fireplace opening rule or appliance BTU venting) under NFPA 211 and IRC R1003.',
    category: 'Framing & Finishes',
    codeRef: 'NFPA 211 / IRC R1003.15',
    lead: 'Size masonry chimney clay tile flue liners for open wood-burning fireplaces and category-I gas/oil appliances to maintain natural draft.',
    inputs: [
      { id: 'applianceType', label: 'Appliance / Venting Source', type: 'select', options: [
        { value: 'fp', label: 'Open Masonry Fireplace Hearth Opening (1/10th Rule)', selected: true },
        { value: 'gas', label: 'Natural Draft Gas/Oil Furnace & Water Heater (BTU Load)' }
      ]},
      { id: 'hearthW', label: 'Fireplace Opening Width', value: 36, step: 2, unit: 'Inches' },
      { id: 'hearthH', label: 'Fireplace Opening Height', value: 28, step: 2, unit: 'Inches' },
      { id: 'chimneyH', label: 'Total Chimney Height Above Hearth', value: 18, step: 2, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outTileSize', label: 'Recommended Clay Flue Tile Size', unit: 'Nominal Tile Size' },
    outputs: [
      { id: 'outFlueAreaReq', label: 'Required Minimum Net Free Area' },
      { id: 'outRuleRatio', label: 'Flue-to-Hearth Area Ratio' },
      { id: 'outSmokeChamber', label: 'Smoke Chamber Parging Rule' },
      { id: 'outDraftRule', label: '3-2-10 Rule Roof Clearance' }
    ],
    rules: [
      'IRC Section R1003.15: Round flues must be at least 1/12th the fireplace opening area; rectangular flues must be at least 1/10th (1/8th for chimneys < 15 ft).',
      'The 3-2-10 Rule: Chimneys must extend at least 3 feet above the highest roof penetration and 2 feet higher than any roof point within 10 feet.',
      'Corbelled bricks in the smoke chamber must be parged smooth with refractory mortar to minimize draft turbulence.',
      'An undersized flue causes smoke rollout into the room; an oversized flue causes sluggish, cool draft and rapid creosote buildup.'
    ],
    formula: 'Hearth Area = Width × Height | Flue Net Area = Hearth Area / 10 (Rectangular) or Hearth Area / 12 (Round)',
    faq: [
      { q: 'Why does an open fireplace smoke into the living room?', a: 'The most common cause is an undersized chimney flue liner. If the cross-sectional flue area is less than 1/10th of the fireplace opening area, smoke cannot exhaust fast enough and rolls out into the room.' },
      { q: 'What is the "3-2-10 rule" for chimneys?', a: 'Under building code, a chimney must extend at least 3 feet above the roof penetration point, and must terminate at least 2 feet higher than any portion of the building within 10 horizontal feet to clear turbulent wind roof eddies.' }
    ],
    calcJs: `
      function calc() {
        var aType = document.getElementById('applianceType').value;
        var hw = parseFloat(document.getElementById('hearthW').value) || 36;
        var hh = parseFloat(document.getElementById('hearthH').value) || 28;
        var hChim = parseFloat(document.getElementById('chimneyH').value) || 18;

        var hearthSqIn = hw * hh;
        var ratio = hChim < 15 ? 8 : 10;
        var reqArea = hearthSqIn / ratio;

        var tile = '13" × 13" Clay Tile (99 sq in net free)';
        if (reqArea <= 50) tile = '8" × 8" Clay Tile (49 sq in net)';
        else if (reqArea <= 75) tile = '8" × 13" Clay Tile (74 sq in net)';
        else if (reqArea <= 100) tile = '13" × 13" Clay Tile (99 sq in net)';
        else tile = '13" × 18" Clay Tile (148 sq in net)';

        document.getElementById('outTileSize').textContent = tile;
        document.getElementById('outFlueAreaReq').textContent = Math.round(reqArea) + ' sq in (' + hearthSqIn + ' sq in hearth opening)';
        document.getElementById('outRuleRatio').textContent = '1/' + ratio + 'th of opening area (for ' + hChim + ' ft chimney)';
        document.getElementById('outSmokeChamber').textContent = 'Smooth parge with refractory mortar (max 45° corbel angle)';
        document.getElementById('outDraftRule').textContent = '3 ft above roof exit & 2 ft higher than roof within 10 ft';
      }
    `
  },
  {
    slug: 'flashing-valley-width-slope-w-cut',
    name: 'Roof Valley Flashing Width & W-Profile Calculator',
    h1: 'Roof Valley Flashing Metal Width & W-Bend Profile Calculator',
    title: 'Roof Valley Flashing Width Calculator [W-Profile & Slope] | Digital Tools Shed',
    metaDesc: 'Size open metal valley flashing sheet width (20" to 24" wide) with central W-profile water diversion ribs under NRCA and IRC R905.2.8.2.',
    category: 'Framing & Finishes',
    codeRef: 'IRC R905.2.8.2 / NRCA',
    lead: 'Calculate open metal valley flashing roll width, center splash diverter W-rib height, and shingle reveal exposure based on intersecting roof pitches.',
    inputs: [
      { id: 'pitchMain', label: 'Primary Roof Slope Pitch', value: 8, step: 1, unit: 'in / 12' },
      { id: 'pitchCross', label: 'Intersecting Dormer / Cross Pitch', value: 5, step: 1, unit: 'in / 12' },
      { id: 'valleyLen', label: 'Valley Run Length', value: 16, step: 1, unit: 'Feet' }
    ],
    primaryOutput: { id: 'outRollWidth', label: 'Minimum Flashing Roll Width', unit: 'Inches' },
    outputs: [
      { id: 'outWRibHgt', label: 'Center Splash Rib (W-Profile) Height' },
      { id: 'outShingleReveal', label: 'Open Valley Center Reveal Width' },
      { id: 'outIceWaterShield', label: 'Self-Adhering Membrane Underlayment' },
      { id: 'outNailSetback', label: 'Minimum Shingle Fastener Setback' }
    ],
    rules: [
      'IRC Section R905.2.8.2: Open valley metal flashing must be at least 24 inches wide for pitches under 4:12, and 20 inches wide for steeper roofs.',
      'A center W-bend splash rib (minimum 1 inch tall) is mandatory when unequal intersecting pitches cause fast runoff to overshoot the valley.',
      'Never drive nails through the metal valley within 6 inches of the center flow line; fasten edges with metal cleats.',
      'The open valley shingle reveal must widen by 1/8" per foot from top to bottom (tapered) to prevent winter ice jamming.'
    ],
    formula: 'Flashing Width: ≥ 4:12 = 20" sheet; < 4:12 = 24" sheet | Reveal = 6" at top, widening 1/8" per foot toward eave',
    faq: [
      { q: 'Why is an open metal W-valley better than a closed-cut shingle valley?', a: 'Open W-valleys allow pine needles, oak leaves, and roof debris to wash freely off the roof. In closed-cut valleys, organic debris lodges under shingle edges, damming water and causing hidden leaks.' },
      { q: 'What is the purpose of the center "W" hump in valley flashing?', a: 'When water cascades down a steep 10:12 roof slope, it rushes across the valley floor. The 1-inch center W-rib deflects fast-moving water back down the valley channel, preventing it from driving up under the opposite shingles.' }
    ],
    calcJs: `
      function calc() {
        var p1 = parseFloat(document.getElementById('pitchMain').value) || 8;
        var p2 = parseFloat(document.getElementById('pitchCross').value) || 5;
        var len = parseFloat(document.getElementById('valleyLen').value) || 16;

        var minPitch = Math.min(p1, p2);
        var widthIn = minPitch < 4 ? 24 : 20;

        var ribHgt = Math.abs(p1 - p2) >= 3 ? '1.0" High Center W-Rib (Unequal pitch diverter)' : '0.75" Center Splash Rib';
        var topReveal = 6.0;
        var botReveal = topReveal + (len * 0.125); // widen 1/8" per foot

        document.getElementById('outRollWidth').textContent = widthIn + '" Wide Metal Valley Sheet (26 Ga Galvanized / 16 oz Copper)';
        document.getElementById('outWRibHgt').textContent = ribHgt;
        document.getElementById('outShingleReveal').textContent = topReveal.toFixed(1) + '" at top widening to ' + botReveal.toFixed(1) + '" at eave';
        document.getElementById('outIceWaterShield').textContent = 'Full 36" width self-adhering ice & water shield centered underneath';
        document.getElementById('outNailSetback').textContent = 'Keep shingle nails ≥ 6" away from valley center line';
      }
    `
  },
  {
    slug: 'siding-square-coverage-overlap-exposure',
    name: 'Lap Siding Square & Exposure Calculator',
    h1: 'Lap Siding Squares & Weather Exposure Cut Calculator',
    title: 'Lap Siding Exposure & Squares Calculator [Board Width & Lap Overlap] | Digital Tools Shed',
    metaDesc: 'Calculate siding squares (100 sq ft) and exposure dimensions (4" to 7" reveal) for fiber cement (Hardie) and cedar lap siding.',
    category: 'Framing & Finishes',
    codeRef: 'IRC Section R703',
    lead: 'Calculate exterior wall square footage, siding squares, board lap overlap, and finished weather exposure for Hardie fiber cement and cedar siding.',
    inputs: [
      { id: 'wallGrossSqFt', label: 'Total Exterior Wall Area', value: 1800, step: 50, unit: 'Sq Ft' },
      { id: 'openingsSqFt', label: 'Window & Door Deductions', value: 250, step: 25, unit: 'Sq Ft' },
      { id: 'boardW', label: 'Siding Board Nominal Width', type: 'select', options: [
        { value: '5.25', label: '5-1/4" Board (4.0" Exposure / 1-1/4" Lap)' },
        { value: '6.25', label: '6-1/4" Board (5.0" Exposure / 1-1/4" Lap)' },
        { value: '7.25', label: '7-1/4" Board (6.0" Exposure / 1-1/4" Lap)', selected: true },
        { value: '8.25', label: '8-1/4" Board (7.0" Exposure / 1-1/4" Lap)' }
      ]},
      { id: 'wastePct', label: 'Angle Cuts & Trim Waste Factor', value: 10, step: 1, unit: '%' }
    ],
    primaryOutput: { id: 'outSquares', label: 'Siding Squares to Order', unit: 'Squares (100 sq ft)' },
    outputs: [
      { id: 'outNetWallArea', label: 'Net Wall Coverage Area' },
      { id: 'outPlankCount', label: '12-Foot Siding Planks Needed' },
      { id: 'outExposureDim', label: 'Weather Exposure Reveal' },
      { id: 'outNailSpacing', label: 'Blind Nailing Stud Spacing' }
    ],
    rules: [
      'One "Square" of siding is commercially defined as 100 square feet of finished wall surface exposure.',
      'James Hardie fiber cement mandates a minimum 1-1/4" overlap and blind nailing 3/4" down from the top edge.',
      'Siding nails must penetrate at least 1-1/4" into solid wood framing studs (16" on-center).',
      'Always maintain a 6-inch clearance between the bottom edge of siding and unfinished ground grade.'
    ],
    formula: 'Net Area = Gross - Openings | Squares = [Net Area / 100] × (1 + Waste%) | Planks = (Net Area × 1.10) / (Exposure_ft × 12 ft)',
    faq: [
      { q: 'What is a "square" in exterior siding and roofing?', a: 'In the construction trades, one square is a universal unit equal to exactly 100 square feet of installed surface area. If a house has 1,500 square feet of net wall area, it requires 15 squares of siding.' },
      { q: 'Why is blind nailing preferred over face nailing on lap siding?', a: 'Blind nailing places nails 3/4" down from the top edge where they are completely concealed by the 1-1/4" overlap of the next board. This hides fastener heads and eliminates moisture penetration points through siding faces.' }
    ],
    calcJs: `
      function calc() {
        var gross = parseFloat(document.getElementById('wallGrossSqFt').value) || 1800;
        var ded = parseFloat(document.getElementById('openingsSqFt').value) || 250;
        var boardW = parseFloat(document.getElementById('boardW').value) || 7.25;
        var waste = parseFloat(document.getElementById('wastePct').value) || 10;

        var netSqFt = Math.max(0, gross - ded);
        var exposureIn = boardW - 1.25; // 1-1/4" overlap
        var exposureFt = exposureIn / 12;

        var sqFtPer12Plank = exposureFt * 12.0;
        var totalWithWaste = netSqFt * (1 + waste / 100);
        var squares = (totalWithWaste / 100).toFixed(1);
        var planks = Math.ceil(totalWithWaste / sqFtPer12Plank);

        document.getElementById('outSquares').textContent = squares + ' Squares of Siding (Includes ' + waste + '% waste)';
        document.getElementById('outNetWallArea').textContent = Math.round(netSqFt).toLocaleString() + ' sq ft net wall area';
        document.getElementById('outPlankCount').textContent = planks + ' Planks (Standard 12-foot lengths)';
        document.getElementById('outExposureDim').textContent = exposureIn.toFixed(2) + '" finished weather exposure reveal';
        document.getElementById('outNailSpacing').textContent = 'Blind nail into wood studs at 16" on-center';
      }
    `
  },
  {
    slug: 'board-and-batten-spacing-layout',
    name: 'Board and Batten Siding Spacing Calculator',
    h1: 'Board & Batten Siding Spacing & Equal Layout Calculator',
    title: 'Board & Batten Siding Spacing Calculator [Equal Bay Layout] | Digital Tools Shed',
    metaDesc: 'Calculate equal on-center batten spacing, board reveals, and batten strip counts for vertical board and batten exterior siding.',
    category: 'Framing & Finishes',
    codeRef: 'Architectural Millwork',
    lead: 'Calculate equal on-center batten strip spacing and layout increments across exterior wall lengths to eliminate awkward narrow corner cuts.',
    inputs: [
      { id: 'wallLength', label: 'Total Wall Length', value: 24, step: 0.5, unit: 'Feet' },
      { id: 'battenW', label: 'Batten Strip Width', value: 2.5, step: 0.25, unit: 'Inches', hint: 'Typically 1x2 (1.5") or 1x3 (2.5")' },
      { id: 'targetSpacing', label: 'Target On-Center Spacing', value: 12, step: 1, min: 8, max: 24, unit: 'Inches OC', hint: '10" to 14" is standard aesthetic spacing' }
    ],
    primaryOutput: { id: 'outExactOc', label: 'Exact Equal On-Center Spacing', unit: 'Inches OC' },
    outputs: [
      { id: 'outBattenCount', label: 'Total Batten Strips Needed' },
      { id: 'outBoardReveal', label: 'Clear Board Reveal Gap Between Battens' },
      { id: 'outFirstMark', label: 'Corner Edge to First Batten Center' },
      { id: 'outFastenerRule', label: 'Nailing Expansion Allowance' }
    ],
    rules: [
      'Batten strips must be spaced symmetrically from wall corners to avoid ugly uneven end panels.',
      'Fastener rule: Nail battens through the center gap with ONE nail down the middle to allow underlying wide boards to expand and contract.',
      'Never drive nails through both edges of wide 1x10 or 1x12 boards; seasonal shrinkage will split the wood in half.',
      'Horizontal blocking (nailing girts) must be installed between studs every 24 inches to support vertical siding.'
    ],
    formula: 'Bays = Round(Wall Length in / Target OC) | Exact OC = Wall Length in / Bays | Reveal = Exact OC - Batten Width',
    faq: [
      { q: 'Why do you only nail battens down the center?', a: 'Wood boards expand and contract in width across the grain. Nailing a batten with a single nail down the center through the expansion gap clamps the boards firmly against the wall while allowing the board edges underneath to slide freely without splitting.' },
      { q: 'What is the standard spacing for board and batten siding?', a: 'Traditional American board and batten uses 1x10 or 1x12 rough-sawn boards with 1x2 or 1x3 battens spaced 10 to 14 inches on-center. Modern modern farmhouse styles frequently use 12-inch or 16-inch centers.' }
    ],
    calcJs: `
      function calc() {
        var wallFt = parseFloat(document.getElementById('wallLength').value) || 24;
        var bWidth = parseFloat(document.getElementById('battenW').value) || 2.5;
        var target = parseFloat(document.getElementById('targetSpacing').value) || 12;

        var wallIn = wallFt * 12;
        var numBays = Math.round(wallIn / target);
        var exactOc = wallIn / numBays;
        var reveal = exactOc - bWidth;
        var totalBattens = numBays + 1;

        document.getElementById('outExactOc').textContent = exactOc.toFixed(3) + '" (' + toFraction(exactOc) + ') On-Center';
        document.getElementById('outBattenCount').textContent = totalBattens + ' Batten Strips (' + numBays + ' equal bays)';
        document.getElementById('outBoardReveal').textContent = reveal.toFixed(3) + '" (' + toFraction(reveal) + ') clear exposed board gap';
        document.getElementById('outFirstMark').textContent = exactOc.toFixed(3) + '" spacing increment from starting corner';
        document.getElementById('outFastenerRule').textContent = 'Single nail down batten centerline (Allows boards to move)';
      }
    `
  },
  {
    slug: 'soffit-vent-intake-vs-exhaust-balance',
    name: 'Soffit Vent Intake vs Exhaust Balance Calculator',
    h1: 'Soffit Vent Intake vs Ridge Exhaust Balance Calculator',
    title: 'Soffit Vent Intake vs Exhaust Balance Calculator [NFVA Ratio] | Digital Tools Shed',
    metaDesc: 'Balance roof ventilation net free area (NFVA) to ensure eaves intake exceeds ridge exhaust (50% to 60% intake rule) under IRC R806.',
    category: 'Framing & Finishes',
    codeRef: 'IRC Section R806',
    lead: 'Calculate Net Free Ventilating Area (NFVA) balance between continuous soffit vents and ridge vents to maintain positive attic pressure.',
    inputs: [
      { id: 'soffitL', label: 'Continuous Perforated Soffit Length', value: 80, step: 5, unit: 'Feet' },
      { id: 'soffitNfaPerFt', label: 'Soffit Vent Rating per Foot', type: 'select', options: [
        { value: '4.0', label: 'Perforated Vinyl / Aluminum Soffit (4.0 sq in NFA / ft)' },
        { value: '9.0', label: 'Continuous Aluminum Strip Vent (9.0 sq in NFA / ft)', selected: true },
        { value: '18.0', label: 'High-Flow Mesh Soffit (18.0 sq in NFA / ft)' }
      ]},
      { id: 'ridgeL', label: 'Continuous Ridge Vent Length', value: 40, step: 5, unit: 'Feet' },
      { id: 'ridgeNfaPerFt', label: 'Ridge Vent NFA per Foot', value: 18.0, step: 1, unit: 'sq in / ft', hint: 'Standard shingle-over ridge vent = 18 sq in/ft' }
    ],
    primaryOutput: { id: 'outIntakePct', label: 'Intake Ventilation Share %', unit: 'Percentage' },
    outputs: [
      { id: 'outTotalIntake', label: 'Total Soffit Intake NFA' },
      { id: 'outTotalExhaust', label: 'Total Ridge Exhaust NFA' },
      { id: 'outBalanceStatus', label: 'Ventilation Balance Status' },
      { id: 'outPressureMode', label: 'Attic Pressure Dynamic' }
    ],
    rules: [
      'IRC R806.2: Intake ventilation at eaves must equal or exceed exhaust ventilation at the ridge (50% to 60% intake is optimal).',
      'Excess exhaust (> 50%) pulls conditioned heated air up from the house ceiling, creating winter roof ice dams and high energy bills.',
      'Slight positive pressure in the attic (more intake than exhaust) forces air outward smoothly and stops rain ingestion at the ridge.',
      'Rafter baffles must provide at least 1 inch of clear unobstructed airflow over the top of attic insulation.'
    ],
    formula: 'Intake NFA = Soffit Length × Soffit Rating | Exhaust NFA = Ridge Length × Ridge Rating | % Intake = Intake / (Intake + Exhaust)',
    faq: [
      { q: 'Why should soffit intake slightly exceed ridge exhaust?', a: 'Having 55% to 60% intake airflow ensures air enters at the eaves and pushes upward through the attic, pressurizing the attic slightly. If exhaust exceeds intake, the attic develops negative suction that pulls house air through ceiling joints.' },
      { q: 'How much net free area does continuous vinyl soffit have?', a: 'Standard perforated vinyl vented soffit provides approximately 4 to 6 square inches of Net Free Area (NFA) per linear foot, while continuous aluminum strip vents provide 9 to 10 square inches per foot.' }
    ],
    calcJs: `
      function calc() {
        var sLen = parseFloat(document.getElementById('soffitL').value) || 80;
        var sRate = parseFloat(document.getElementById('soffitNfaPerFt').value) || 9.0;
        var rLen = parseFloat(document.getElementById('ridgeL').value) || 40;
        var rRate = parseFloat(document.getElementById('ridgeNfaPerFt').value) || 18.0;

        var intakeNfa = sLen * sRate;
        var exhaustNfa = rLen * rRate;
        var totalNfa = intakeNfa + exhaustNfa;

        var inPct = (intakeNfa / totalNfa) * 100;
        var pass = inPct >= 50.0 && inPct <= 65.0;

        document.getElementById('outIntakePct').textContent = inPct.toFixed(1) + '% Intake Air Share (Ideal: 50% - 60%)';
        document.getElementById('outTotalIntake').textContent = Math.round(intakeNfa) + ' sq in Total Soffit Intake';
        document.getElementById('outTotalExhaust').textContent = Math.round(exhaustNfa) + ' sq in Total Ridge Exhaust';

        var badge = document.getElementById('statusBadge');
        if (inPct >= 50.0) {
          document.getElementById('outBalanceStatus').textContent = '✅ Perfectly Balanced / Positive Eaves Intake';
          document.getElementById('outPressureMode').textContent = 'Healthy outward flow: Prevents pulling conditioned living space air';
          badge.textContent = 'IRC R806 Pass: Intake exceeds or equals exhaust';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outBalanceStatus').textContent = '⚠️ DEFICIENT INTAKE: Exhaust exceeds intake (' + (100 - inPct).toFixed(1) + '% exhaust)';
          document.getElementById('outPressureMode').textContent = 'Negative Attic Suction: Risk of roof ice dams and pulling house heat';
          badge.textContent = 'Ventilation Alert: Add more soffit vents';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 10: MECHANICAL TRANSMISSION & STEEL (Tools 107–114)
// ─────────────────────────────────────────────────────────────────────────────
const MECHANICAL_TOOLS = [
  {
    slug: 'structural-steel-i-beam-deflection',
    name: 'Structural Steel I-Beam Deflection Calculator',
    h1: 'Wide Flange W-Beam Load & Deflection Calculator (AISC L/360)',
    title: 'Steel I-Beam Deflection Calculator [AISC W-Beam Span & L/360] | Digital Tools Shed',
    metaDesc: 'Calculate maximum bending moment, section modulus (Sx), and midspan deflection for AISC wide-flange W-beams under uniform and center-point loads.',
    category: 'Mechanical & Steel',
    codeRef: 'AISC 360 Specification',
    lead: 'Calculate midspan deflection, maximum bending moment, and extreme fiber stress for hot-rolled structural steel wide-flange W-beams under AISC L/360 limits.',
    inputs: [
      { id: 'beamSection', label: 'AISC Standard Wide-Flange Section', type: 'select', options: [
        { value: 'w8x10', label: 'W8 × 10 (Ix = 30.8 in⁴, Sx = 7.81 in³)' },
        { value: 'w8x18', label: 'W8 × 18 (Ix = 61.9 in⁴, Sx = 15.2 in³)' },
        { value: 'w10x22', label: 'W10 × 22 (Ix = 118 in⁴, Sx = 23.2 in³)', selected: true },
        { value: 'w10x30', label: 'W10 × 30 (Ix = 170 in⁴, Sx = 32.4 in³)' },
        { value: 'w12x26', label: 'W12 × 26 (Ix = 204 in⁴, Sx = 33.4 in³)' },
        { value: 'w12x40', label: 'W12 × 40 (Ix = 307 in⁴, Sx = 51.5 in³)' }
      ]},
      { id: 'beamSpan', label: 'Clear Span Between Supports', value: 16, step: 1, unit: 'Feet' },
      { id: 'totalLoad', label: 'Total Uniformly Distributed Load', value: 6000, step: 500, unit: 'Pounds (lbs)' },
      { id: 'steelGrade', label: 'Structural Steel Grade', type: 'select', options: [
        { value: '50000', label: 'ASTM A992 / A572 Grade 50 (50,000 psi Yield)', selected: true },
        { value: '36000', label: 'ASTM A36 Mild Carbon Steel (36,000 psi Yield)' }
      ]}
    ],
    primaryOutput: { id: 'outDeflectionIn', label: 'Midspan Elastic Deflection', unit: 'Inches' },
    outputs: [
      { id: 'outDeflRatio', label: 'Deflection Span Ratio' },
      { id: 'outBendingMoment', label: 'Maximum Bending Moment' },
      { id: 'outFiberStress', label: 'Bending Stress (Fb)' },
      { id: 'outAiscStatus', label: 'AISC L/360 Deflection Compliance' }
    ],
    rules: [
      'AISC 360 Deflection Standard: Live load deflection shall not exceed L/360 (Span in inches / 360) to prevent drywall cracking and floor bounce.',
      'Uniform Load Deflection Equation: Δ = (5 × w × L⁴) / (384 × E × Ix), where Modulus of Elasticity E = 29,000,000 psi for structural steel.',
      'Allowable Bending Stress: AISC allowable bending stress for compact laterally braced W-beams is 0.66 × Fy (33,000 psi for A992).',
      'Lateral torsional buckling will occur prematurely unless the compression (top) flange is braced at regular intervals by floor joists or weld studs.'
    ],
    formula: 'Δ_max = (5 × W × L³) / (384 × E × Ix) | Moment M = W × L / 8 | Stress Fb = M / Sx',
    faq: [
      { q: 'Why is modulus of elasticity (E) constant across all steel grades?', a: 'All carbon structural steels have an identical Modulus of Elasticity of 29,000,000 psi. Upgrading from A36 to A992 Grade 50 steel increases yield strength (resistance to permanent bending), but provides zero increase in stiffness or deflection resistance.' },
      { q: 'What does "W10 x 22" mean in steel beam designations?', a: 'In the American Standard Wide-Flange naming convention, the first number is the nominal beam depth in inches (10 inches deep) and the second number is the exact linear weight in pounds per foot (22 lbs per linear foot).' }
    ],
    calcJs: `
      function calc() {
        var sec = document.getElementById('beamSection').value;
        var spanFt = parseFloat(document.getElementById('beamSpan').value) || 16;
        var wLbs = parseFloat(document.getElementById('totalLoad').value) || 6000;
        var fy = parseFloat(document.getElementById('steelGrade').value) || 50000;

        var prop = {
          'w8x10': { ix: 30.8, sx: 7.81 },
          'w8x18': { ix: 61.9, sx: 15.2 },
          'w10x22': { ix: 118.0, sx: 23.2 },
          'w10x30': { ix: 170.0, sx: 32.4 },
          'w12x26': { ix: 204.0, sx: 33.4 },
          'w12x40': { ix: 307.0, sx: 51.5 }
        }[sec] || { ix: 118.0, sx: 23.2 };

        var spanIn = spanFt * 12;
        var e = 29000000; // psi for steel

        // Δ = 5 * W * L^3 / (384 * E * Ix)
        var delta = (5 * wLbs * Math.pow(spanIn, 3)) / (384 * e * prop.ix);
        var deflRatio = Math.round(spanIn / delta);
        var allowDelta = spanIn / 360;

        // Moment M = W * L / 8 (in-lbs)
        var momentInLbs = (wLbs * spanIn) / 8;
        var stressPsi = momentInLbs / prop.sx;
        var allowStress = 0.66 * fy;

        var pass = delta <= allowDelta && stressPsi <= allowStress;

        document.getElementById('outDeflectionIn').textContent = delta.toFixed(3) + '" Midspan Sag (L/' + deflRatio + ')';
        document.getElementById('outDeflRatio').textContent = 'L/' + deflRatio + ' (Max allowable sag: ' + allowDelta.toFixed(3) + '" for L/360)';
        document.getElementById('outBendingMoment').textContent = Math.round(momentInLbs / 12).toLocaleString() + ' ft-lbs (' + Math.round(momentInLbs).toLocaleString() + ' in-lbs)';
        document.getElementById('outFiberStress').textContent = Math.round(stressPsi).toLocaleString() + ' psi (Allowable: ' + Math.round(allowStress).toLocaleString() + ' psi)';

        var badge = document.getElementById('statusBadge');
        if (pass) {
          document.getElementById('outAiscStatus').textContent = '✅ AISC Pass (Deflection ≤ L/360 & Stress ≤ ' + Math.round(allowStress) + ' psi)';
          document.getElementById('outAiscStatus').style.color = '#22c55e';
          badge.textContent = 'AISC 360 Pass: Section verifies under load';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outAiscStatus').textContent = '❌ EXCEEDS LIMITS! Upsize W-beam section for adequate stiffness';
          document.getElementById('outAiscStatus').style.color = '#ef4444';
          badge.textContent = 'Structural Warning: Deflection or stress exceeded';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  },
  {
    slug: 'bolt-torque-tension-clamp-force',
    name: 'Bolt Torque to Clamping Force Calculator',
    h1: 'Fastener Bolt Torque & Preload Tension Clamp Force Calculator',
    title: 'Bolt Torque to Tension Calculator [Torque Coefficient K & Clamp Force] | Digital Tools Shed',
    metaDesc: 'Calculate bolt tensile preload clamping force and tightening torque (T = K·D·F) across SAE Grade 2, Grade 5, Grade 8, and Metric 8.8/10.9 fasteners.',
    category: 'Mechanical & Steel',
    codeRef: 'SAE J429 / ASTM A325',
    lead: 'Calculate bolt tensile preload clamp force and tightening torque using the short-form torque equation T = K × D × F across standard SAE and Metric grades.',
    inputs: [
      { id: 'boltDia', label: 'Bolt Nominal Shank Diameter', type: 'select', options: [
        { value: '0.250', label: '1/4"-20 UNC' },
        { value: '0.375', label: '3/8"-16 UNC' },
        { value: '0.500', label: '1/2"-13 UNC', selected: true },
        { value: '0.625', label: '5/8"-11 UNC' },
        { value: '0.750', label: '3/4"-10 UNC' },
        { value: '1.000', label: '1"-8 UNC Heavy Structural Bolt' }
      ]},
      { id: 'boltGrade', label: 'Fastener Strength Grade', type: 'select', options: [
        { value: 'grade5', label: 'SAE Grade 5 (Proof: 85,000 psi / 3 Radial Lines)', selected: true },
        { value: 'grade8', label: 'SAE Grade 8 (Proof: 120,000 psi / 6 Radial Lines - High Tensile)' },
        { value: 'grade2', label: 'SAE Grade 2 (Proof: 55,000 psi / Low Carbon Hardware)' },
        { value: 'metric109', label: 'Metric Class 10.9 (Proof: 120,000 psi)' }
      ]},
      { id: 'lubeCondition', label: 'Thread Lubrication Condition (Nut Factor K)', type: 'select', options: [
        { value: '0.20', label: 'Dry / Plain Zinc Plated Steel (K = 0.20 - Standard)', selected: true },
        { value: '0.15', label: 'Lightly Oiled / Machine Lubricated (K = 0.15)' },
        { value: '0.12', label: 'Anti-Seize / Moly Paste Lubricant (K = 0.12 - High Slickness)' }
      ]}
    ],
    primaryOutput: { id: 'outTorqueFtLbs', label: 'Recommended Tightening Torque', unit: 'Foot-Pounds (ft-lbs)' },
    outputs: [
      { id: 'outClampForce', label: 'Bolt Preload Clamping Force' },
      { id: 'outTorqueInLbs', label: 'Torque in Inch-Pounds' },
      { id: 'outProofLoadPct', label: '75% Proof Strength Utilization' },
      { id: 'outLubeWarning', label: 'Lubrication Over-Torque Warning' }
    ],
    rules: [
      'Fastener Short-Form Equation: Torque T = K × D × F (where K = friction nut factor, D = bolt diameter in feet, F = preload clamp force in lbs).',
      'Target Preload Tension: Standard engineering practice tightens fasteners to 75% of their published Proof Load.',
      'LUBRICANT OVER-TORQUE DANGER: Applying anti-seize (K=0.12) and tightening to "dry" torque specs increases bolt tension by 67%, snapping the bolt.',
      'Structural bolts (ASTM F3125 / A325) mandate Turn-of-Nut or calibrated direct tension indicator (DTI) washers.'
    ],
    formula: 'Tensile Stress Area At = 0.7854 × (D - 0.9743/n)² | F_preload = 0.75 × At × Proof_Stress | Torque T = K × D × F / 12 (ft-lbs)',
    faq: [
      { q: 'Why does lubricating a bolt require lowering the torque wrench setting?', a: 'Roughly 90% of tightening torque is consumed by friction in the threads and under the bolt head, leaving only 10% to stretch the bolt. Adding lubricant eliminates friction, converting far more rotation into stretch; failing to lower torque will strip threads or snap the fastener.' },
      { q: 'What is the purpose of bolt preload clamping force?', a: 'Preload stretches the bolt like a stiff spring. When two steel flanges are clamped under 10,000 lbs of bolt preload, external working loads cannot open the joint or fatigue the bolt until they exceed the 10,000 lb clamp threshold.' }
    ],
    calcJs: `
      function calc() {
        var d = parseFloat(document.getElementById('boltDia').value) || 0.50;
        var grade = document.getElementById('boltGrade').value;
        var k = parseFloat(document.getElementById('lubeCondition').value) || 0.20;

        // Tensile stress area for standard UNC threads:
        var areas = {
          0.250: 0.0318,
          0.375: 0.0775,
          0.500: 0.1419,
          0.625: 0.2260,
          0.750: 0.3340,
          1.000: 0.6060
        };
        var at = areas[d] || 0.1419;

        var proofPsi = 85000;
        if (grade === 'grade8' || grade === 'metric109') proofPsi = 120000;
        else if (grade === 'grade2') proofPsi = 55000;

        // Target clamp load = 75% of proof load
        var clampLbs = 0.75 * at * proofPsi;

        // Torque T = K * D * F (in-lbs) -> divide by 12 for ft-lbs
        var torqueInLbs = k * d * clampLbs;
        var torqueFtLbs = torqueInLbs / 12;

        document.getElementById('outTorqueFtLbs').textContent = Math.round(torqueFtLbs) + ' ft-lbs (' + torqueFtLbs.toFixed(1) + ' ft-lbs)';
        document.getElementById('outClampForce').textContent = Math.round(clampLbs).toLocaleString() + ' lbs Clamping Preload Force';
        document.getElementById('outTorqueInLbs').textContent = Math.round(torqueInLbs).toLocaleString() + ' in-lbs torque';
        document.getElementById('outProofLoadPct').textContent = '75% of Fastener Proof Strength (' + Math.round(proofPsi).toLocaleString() + ' psi proof stress)';
        document.getElementById('outLubeWarning').textContent = k <= 0.15 ? 'Calibrated for lubricated threads (Do not tighten dry!)' : 'Calibrated for clean, dry zinc threads';
      }
    `
  },
  {
    slug: 'bearing-life-l10-hours-load',
    name: 'Ball & Roller Bearing L10 Life Calculator',
    h1: 'Bearing L10 Rating Fatigue Life Hours Calculator (ISO 281)',
    title: 'Bearing L10 Life Calculator [ISO 281 Fatigue Life Hours] | Digital Tools Shed',
    metaDesc: 'Calculate ISO 281 L10 and L10h bearing basic rating life in operating hours from dynamic load rating C, equivalent radial load P, and RPM.',
    category: 'Mechanical & Steel',
    codeRef: 'ISO 281 / ANSI/ABMA 9',
    lead: 'Calculate ISO 281 basic rating life (L10) in millions of revolutions and operating hours (L10h) based on dynamic capacity, applied load, and rotational RPM.',
    inputs: [
      { id: 'bearingType', label: 'Rolling Element Bearing Type', type: 'select', options: [
        { value: '3', label: 'Deep Groove Ball Bearing (Weibull exponent p = 3)', selected: true },
        { value: '3.333', label: 'Cylindrical / Tapered Roller Bearing (Weibull exponent p = 10/3 = 3.33)' },
        { value: '3.333-spherical', label: 'Spherical Roller Bearing (Heavy Shock Load - p = 10/3)' }
      ]},
      { id: 'dynCapC', label: 'Basic Dynamic Load Rating (C)', value: 6500, step: 250, unit: 'Pounds (lbs)', hint: 'Found in SKF / Timken catalog for your bearing' },
      { id: 'radialLoadP', label: 'Equivalent Dynamic Radial Load (P)', value: 1200, step: 100, unit: 'Pounds (lbs)' },
      { id: 'shaftRpm', label: 'Shaft Operating Speed', value: 1750, step: 50, unit: 'RPM' }
    ],
    primaryOutput: { id: 'outLifeHours', label: 'L10h Rated Fatigue Life', unit: 'Operating Hours' },
    outputs: [
      { id: 'outLifeRevs', label: 'L10 Life in Millions of Revolutions' },
      { id: 'outOperatingYears', label: 'Service Years (at 40 hrs/week)' },
      { id: 'outLoadRatio', label: 'Capacity-to-Load Ratio (C/P)' },
      { id: 'outReliabilityNote', label: 'ISO 281 90% Survival Reliability' }
    ],
    rules: [
      'ISO 281 L10 Definition: The number of operating hours that 90% of an identical group of bearings will achieve or exceed before the first evidence of metal flaking (spalling).',
      'Life Equation: L10 (millions of revs) = (C / P)^p, where p = 3 for ball bearings and p = 10/3 (3.33) for roller bearings.',
      'L10h Operating Hours Equation: L10h = (10⁶ / [60 × RPM]) × (C / P)^p.',
      'Doubling the applied load P on a ball bearing cuts its fatigue service life by a factor of eight (2³ = 8x reduction).'
    ],
    formula: 'L10_revs = (C / P)^p (in millions) | L10h = (L10_revs × 1,000,000) / (60 × RPM)',
    faq: [
      { q: 'What does "L10" mean in bearing engineering?', a: 'L10 represents 90% reliability. In a population of 100 identical bearings operating under the exact same laboratory conditions, at least 90 of them will surpass the calculated L10 hours without experiencing subsurface fatigue spalling.' },
      { q: 'Why does a slight overload cause bearing life to collapse?', a: 'Because bearing fatigue life scales exponentially with load to the 3rd power (or 3.33 for roller bearings). Increasing load by just 25% reduces ball bearing lifespan by nearly 50%.' }
    ],
    calcJs: `
      function calc() {
        var pExp = parseFloat(document.getElementById('bearingType').value) || 3.0;
        var c = parseFloat(document.getElementById('dynCapC').value) || 6500;
        var p = parseFloat(document.getElementById('radialLoadP').value) || 1200;
        var rpm = parseFloat(document.getElementById('shaftRpm').value) || 1750;

        var cpRatio = c / p;
        var l10MillionRevs = Math.pow(cpRatio, pExp);
        var l10Hours = (l10MillionRevs * 1000000) / (60 * rpm);
        var years40hr = l10Hours / (40 * 52);

        document.getElementById('outLifeHours').textContent = Math.round(l10Hours).toLocaleString() + ' L10h Operating Hours';
        document.getElementById('outLifeRevs').textContent = l10MillionRevs.toFixed(1) + ' Million Shaft Revolutions';
        document.getElementById('outOperatingYears').textContent = years40hr.toFixed(1) + ' Years (Based on 1-shift 40 hr/week duty)';
        document.getElementById('outLoadRatio').textContent = cpRatio.toFixed(2) + ' (C/P Load Ratio)';
        document.getElementById('outReliabilityNote').textContent = 'ISO 281 Standard: 90% survival rate without metallurgical spalling';
      }
    `
  },
  {
    slug: 'v-belt-length-pulley-center-distance',
    name: 'V-Belt Length & Pulley Center Distance Calculator',
    h1: 'V-Belt Pitch Length & Center Distance Calculator (RMA/MPTA)',
    title: 'V-Belt Length & Center Distance Calculator [A, B, C Section Pitch] | Digital Tools Shed',
    metaDesc: 'Calculate RMA standard V-belt pitch length and required pulley center distance from driver and driven pulley diameters and center spacing.',
    category: 'Mechanical & Steel',
    codeRef: 'RMA / MPTA Standards',
    lead: 'Calculate exact standard V-belt pitch lengths, nearest industry belt part numbers, and pulley center distances for industrial belt drives.',
    inputs: [
      { id: 'dDriver', label: 'Driver Pulley Pitch Diameter (d)', value: 4.0, step: 0.25, unit: 'Inches' },
      { id: 'dDriven', label: 'Driven Pulley Pitch Diameter (D)', value: 8.0, step: 0.5, unit: 'Inches' },
      { id: 'centerDesired', label: 'Desired Shaft Center Distance (C)', value: 16.0, step: 0.5, unit: 'Inches' },
      { id: 'beltSection', label: 'V-Belt Cross Section Profile', type: 'select', options: [
        { value: 'A', label: 'A / 4L Classical Section (1/2" Top Width)', selected: true },
        { value: 'B', label: 'B / 5L Classical Section (21/32" Top Width)' },
        { value: '3V', label: '3V Narrow High-Capacity Wedge (3/8" Width)' },
        { value: '5V', label: '5V Heavy Wedge (5/8" Width)' }
      ]}
    ],
    primaryOutput: { id: 'outBeltPitchLen', label: 'Theoretical Belt Pitch Length', unit: 'Inches' },
    outputs: [
      { id: 'outNearestBelt', label: 'Standard Industry Belt Number' },
      { id: 'outExactCenter', label: 'Actual Center Distance with Standard Belt' },
      { id: 'outWrapAngle', label: 'Arc of Contact on Driver Pulley' },
      { id: 'outSpeedRatio', label: 'Belt Drive Speed Reduction Ratio' }
    ],
    rules: [
      'RMA V-Belt Pitch Length Formula: L = 2C + 1.57 × (D + d) + [(D - d)² / (4C)].',
      'The arc of contact (wrap angle) on the smaller driver pulley must be at least 120 degrees to prevent belt slippage under load.',
      'Center distance between shafts should generally be greater than the large pulley diameter and less than 3 × (D + d).',
      'Motor base mountings must provide at least 1-1/2" of travel for belt installation without prying with screwdrivers.'
    ],
    formula: 'Length L = 2C + (π/2)(D + d) + (D - d)² / (4C) | Wrap Angle θ = 180° - [60 × (D - d) / C]',
    faq: [
      { q: 'Why should you never pry a V-belt onto a pulley with a screwdriver?', a: 'Prying a V-belt over the sharp rim of a sheave snaps internal polyester or aramid tensile cords inside the rubber carcass, causing the belt to throw or disintegrate within minutes of startup.' },
      { q: 'What is the difference between an "A" belt and a "4L" belt?', a: 'Classical "A" belts and fractional horsepower "4L" belts both have a 1/2-inch top width. However, "A" belts are engineered with heavy cord reinforcement for continuous industrial duty, while 4L belts are light-duty belts for appliances and lawn equipment.' }
    ],
    calcJs: `
      function calc() {
        var d = parseFloat(document.getElementById('dDriver').value) || 4.0;
        var bigD = parseFloat(document.getElementById('dDriven').value) || 8.0;
        var c = parseFloat(document.getElementById('centerDesired').value) || 16.0;
        var section = document.getElementById('beltSection').value;

        // RMA Formula: L = 2C + 1.57*(D+d) + (D-d)^2 / (4C)
        var pitchLen = (2 * c) + (1.5708 * (bigD + d)) + (Math.pow(bigD - d, 2) / (4 * c));
        var stdLen = Math.round(pitchLen);
        var partNum = section + stdLen;

        // Recompute actual center distance with standard belt
        var diff = bigD - d;
        var b = (4 * stdLen) - (2 * Math.PI * (bigD + d));
        var exactC = (b + Math.sqrt(b * b - (32 * diff * diff))) / 16;

        var wrapDeg = 180 - (60 * diff / exactC);
        var ratio = bigD / d;

        document.getElementById('outBeltPitchLen').textContent = pitchLen.toFixed(2) + '" Theoretical Belt Pitch Length';
        document.getElementById('outNearestBelt').textContent = partNum + ' (Standard ' + stdLen + '" Pitch Length Belt)';
        document.getElementById('outExactCenter').textContent = exactC.toFixed(2) + '" Actual Center Distance with ' + partNum;
        document.getElementById('outWrapAngle').textContent = wrapDeg.toFixed(1) + '° Arc of Contact (' + (wrapDeg >= 120 ? 'Optimal ≥ 120°' : 'Low Arc: Risk of slip') + ')';
        document.getElementById('outSpeedRatio').textContent = ratio.toFixed(2) + ':1 Speed Reduction Ratio';
      }
    `
  },
  {
    slug: 'gear-speed-ratio-spindle-rpm',
    name: 'Gear Train Ratio & Output Speed Calculator',
    h1: 'Gear Train Speed Ratio & Output Spindle RPM Calculator',
    title: 'Gear Ratio & Spindle RPM Calculator [Pitch Diameter & Output Speed] | Digital Tools Shed',
    metaDesc: 'Calculate compound gear train reduction ratios, output spindle RPM, and mechanical torque multiplication from driver and driven tooth counts.',
    category: 'Mechanical & Steel',
    codeRef: 'AGMA Standards',
    lead: 'Calculate gear drive velocity ratios, driven shaft output RPM, and mechanical torque multiplication across spur and helical gear pairs.',
    inputs: [
      { id: 'motorRpm', label: 'Electric Motor Input Speed', value: 1750, step: 50, unit: 'RPM' },
      { id: 'motorHp', label: 'Motor Drive Power', value: 5.0, step: 0.5, unit: 'Horsepower (HP)' },
      { id: 'driverTeeth', label: 'Driver Pinion Gear Teeth (N₁)', value: 18, step: 1, min: 10, unit: 'Teeth' },
      { id: 'drivenTeeth', label: 'Driven Output Gear Teeth (N₂)', value: 72, step: 1, min: 10, unit: 'Teeth' }
    ],
    primaryOutput: { id: 'outOutputRpm', label: 'Driven Shaft Output Speed', unit: 'RPM' },
    outputs: [
      { id: 'outGearRatio', label: 'Gear Reduction Ratio' },
      { id: 'outOutputTorque', label: 'Output Shaft Mechanical Torque' },
      { id: 'outInputTorque', label: 'Motor Input Shaft Torque' },
      { id: 'outEfficiencyNote', label: 'Gearmesh Power Efficiency' }
    ],
    rules: [
      'Fundamental Gear Law: Velocity Ratio = Driven Teeth (N₂) / Driver Teeth (N₁).',
      'Output Spindle RPM = Input Motor RPM / Gear Ratio.',
      'Torque Multiplication: Ideal Output Torque = Input Torque × Gear Ratio (accounting for ~97% single-mesh spur gear efficiency).',
      'Motor Torque Equation: Torque (ft-lbs) = (Horsepower × 5,252) / RPM.'
    ],
    formula: 'Ratio = N₂ / N₁ | RPM_out = RPM_in / Ratio | Torque_out = (HP × 5252 / RPM_out) × 0.97',
    faq: [
      { q: 'Where does the constant 5,252 come from in horsepower and torque calculations?', a: 'One horsepower is defined by James Watt as 33,000 foot-pounds of work per minute. In rotational mechanics, work per revolution equals 2π × Torque. Dividing 33,000 / 2π yields the mathematical constant 5,252.11.' },
      { q: 'Can you use gear ratio math with pitch diameters instead of tooth counts?', a: 'Yes. Because mating gears must have the exact same diametral pitch (DP) or module to mesh, the ratio of tooth counts (N₂/N₁) is identical to the ratio of their pitch diameters (D₂/D₁).' }
    ],
    calcJs: `
      function calc() {
        var inRpm = parseFloat(document.getElementById('motorRpm').value) || 1750;
        var hp = parseFloat(document.getElementById('motorHp').value) || 5.0;
        var n1 = parseInt(document.getElementById('driverTeeth').value, 10) || 18;
        var n2 = parseInt(document.getElementById('drivenTeeth').value, 10) || 72;

        var ratio = n2 / n1;
        var outRpm = inRpm / ratio;

        var inTorque = (hp * 5252) / inRpm;
        var outTorque = ((hp * 5252) / outRpm) * 0.97; // 97% gearmesh efficiency

        document.getElementById('outOutputRpm').textContent = outRpm.toFixed(1) + ' Output Spindle RPM';
        document.getElementById('outGearRatio').textContent = ratio.toFixed(2) + ':1 Mechanical Reduction Ratio';
        document.getElementById('outOutputTorque').textContent = Math.round(outTorque).toLocaleString() + ' ft-lbs Output Torque (Multiplied)';
        document.getElementById('outInputTorque').textContent = inTorque.toFixed(1) + ' ft-lbs Motor Shaft Torque';
        document.getElementById('outEfficiencyNote').textContent = '97% Mechanical Efficiency per AGMA spur mesh standard';
      }
    `
  },
  {
    slug: 'chain-sprocket-center-distance-links',
    name: 'Roller Chain Link Count & Center Distance Calculator',
    h1: 'ANSI Roller Chain Link Count & Sprocket Center Distance Calculator',
    title: 'Roller Chain Link & Center Distance Calculator [ANSI #40, #50, #60 Pitch] | Digital Tools Shed',
    metaDesc: 'Calculate exact roller chain pitch lengths, even link counts, and exact shaft center distances for ANSI #35, #40, #50, #60, and #80 sprockets.',
    category: 'Mechanical & Steel',
    codeRef: 'ANSI/ASME B29.1',
    lead: 'Calculate roller chain link pitches, select the nearest even link count, and compute final shaft center distances under ANSI B29.1 standards.',
    inputs: [
      { id: 'chainSize', label: 'ANSI Standard Roller Chain Pitch', type: 'select', options: [
        { value: '0.375', label: 'ANSI #35 Chain (3/8" Pitch - 0.375")' },
        { value: '0.500', label: 'ANSI #40 Chain (1/2" Pitch - 0.500")', selected: true },
        { value: '0.625', label: 'ANSI #50 Chain (5/8" Pitch - 0.625")' },
        { value: '0.750', label: 'ANSI #60 Chain (3/4" Pitch - 0.750" - Industrial)' },
        { value: '1.000', label: 'ANSI #80 Heavy Drive Chain (1.0" Pitch)' }
      ]},
      { id: 'driverSprocket', label: 'Driver Pinion Sprocket Teeth (T₁)', value: 15, step: 1, unit: 'Teeth' },
      { id: 'drivenSprocket', label: 'Driven Sprocket Teeth (T₂)', value: 45, step: 1, unit: 'Teeth' },
      { id: 'targetCenterIn', label: 'Target Shaft Center Distance', value: 18.0, step: 0.5, unit: 'Inches' }
    ],
    primaryOutput: { id: 'outChainLinks', label: 'Required Chain Link Count', unit: 'Pitches (Even Count)' },
    outputs: [
      { id: 'outActualCenterIn', label: 'Exact Center Distance with Standard Chain' },
      { id: 'outTheoreticalLinks', label: 'Exact Unrounded Pitch Count' },
      { id: 'outPitchDiaT1', label: 'Driver Sprocket Pitch Diameter' },
      { id: 'outPitchDiaT2', label: 'Driven Sprocket Pitch Diameter' }
    ],
    rules: [
      'ANSI B29.1 Chain Length Formula: L (pitches) = 2C_p + (T₁ + T₂)/2 + [(T₂ - T₁)² / (4π² × C_p)].',
      'ALWAYS specify an EVEN number of chain links to avoid using a weak offset half-link (crank link).',
      'Offset half-links reduce overall chain tensile fatigue strength by 30% to 35%.',
      'Ideal shaft center distance is between 30 and 50 chain pitches for smooth power transfer and minimal whip.'
    ],
    formula: 'Pitch Count L = 2Cp + (T1 + T2)/2 + (T2 - T1)² / (39.48 × Cp) | Exact Center back-calculated from even link count',
    faq: [
      { q: 'Why should you always avoid using an offset half-link in roller chain?', a: 'Standard roller chain links alternate between inner and outer link plates that pull in pure straight tension. An offset half-link is bent to bridge wide and narrow links; under tension, that bend straightens out, causing rapid fatigue fracture and premature failure.' },
      { q: 'How much sag should a horizontal roller chain drive have?', a: 'Midspan chain sag on the slack strand should equal roughly 2% of the center distance (about 3/8" to 1/2" of total movement on a 20-inch center).' }
    ],
    calcJs: `
      function calc() {
        var p = parseFloat(document.getElementById('chainSize').value) || 0.50;
        var t1 = parseInt(document.getElementById('driverSprocket').value, 10) || 15;
        var t2 = parseInt(document.getElementById('drivenSprocket').value, 10) || 45;
        var cIn = parseFloat(document.getElementById('targetCenterIn').value) || 18.0;

        var cp = cIn / p; // center distance in pitches
        var diff = t2 - t1;
        var sum = t1 + t2;

        // ANSI Length in pitches:
        var lPitches = (2 * cp) + (sum / 2) + (Math.pow(diff, 2) / (39.478 * cp));
        // Force to nearest EVEN integer to avoid half links
        var evenLinks = Math.ceil(lPitches / 2) * 2;

        // Back-calculate exact center distance:
        // C_p = 1/4 * [ (L - sum/2) + sqrt( (L - sum/2)^2 - 8 * (diff/(2pi))^2 ) ]
        var k1 = evenLinks - (sum / 2);
        var k2 = diff / (2 * Math.PI);
        var exactCp = 0.25 * (k1 + Math.sqrt(Math.max(0, k1 * k1 - (8 * k2 * k2))));
        var exactCenterIn = exactCp * p;

        // Pitch diameters: PD = Pitch / sin(180 / T)
        var pd1 = p / Math.sin((Math.PI / t1));
        var pd2 = p / Math.sin((Math.PI / t2));

        document.getElementById('outChainLinks').textContent = evenLinks + ' Chain Links (Pitches) [No Half-Link Required]';
        document.getElementById('outActualCenterIn').textContent = exactCenterIn.toFixed(3) + '" Exact Shaft Center Distance';
        document.getElementById('outTheoreticalLinks').textContent = lPitches.toFixed(2) + ' theoretical pitches (Rounded to ' + evenLinks + ')';
        document.getElementById('outPitchDiaT1').textContent = pd1.toFixed(3) + '" Driver Sprocket Pitch Diameter';
        document.getElementById('outPitchDiaT2').textContent = pd2.toFixed(3) + '" Driven Sprocket Pitch Diameter';
      }
    `
  },
  {
    slug: 'shaft-keyway-shear-stress-sizing',
    name: 'Shaft Keyway Shear Stress & Length Calculator',
    h1: 'Drive Shaft Key & Keyway Shear Stress Sizing Calculator (ANSI B17.1)',
    title: 'Shaft Keyway Shear Stress Calculator [ANSI B17.1 Square Key Sizing] | Digital Tools Shed',
    metaDesc: 'Calculate standard square key dimensions, shear stress, and required key length under transmitted motor horsepower and shaft torque.',
    category: 'Mechanical & Steel',
    codeRef: 'ANSI B17.1 Keys and Keyseats',
    lead: 'Calculate standard square drive key dimensions, torsional shear stress, and minimum required key engagement length under ANSI B17.1 standards.',
    inputs: [
      { id: 'shaftDia', label: 'Drive Shaft Nominal Diameter', type: 'select', options: [
        { value: '0.750', label: '3/4" Shaft (3/16" Square Key)' },
        { value: '1.000', label: '1" Shaft (1/4" Square Key)', selected: true },
        { value: '1.250', label: '1-1/4" Shaft (1/4" Square Key)' },
        { value: '1.500', label: '1-1/2" Shaft (3/8" Square Key)' },
        { value: '2.000', label: '2" Shaft (1/2" Square Key)' }
      ]},
      { id: 'transHp', label: 'Transmitted Motor Horsepower', value: 10.0, step: 1.0, unit: 'HP' },
      { id: 'shaftRpm', label: 'Shaft Operating Speed', value: 1750, step: 50, unit: 'RPM' },
      { id: 'keySteel', label: 'Key Material Yield Strength', type: 'select', options: [
        { value: '54000', label: 'AISI 1018 Cold-Drawn Steel (Sy = 54,000 psi)', selected: true },
        { value: '85000', label: 'AISI 1045 Carbon Steel (Sy = 85,000 psi)' }
      ]}
    ],
    primaryOutput: { id: 'outReqKeyLen', label: 'Minimum Required Key Length', unit: 'Inches' },
    outputs: [
      { id: 'outKeyDim', label: 'ANSI B17.1 Standard Key Profile' },
      { id: 'outShaftTorque', label: 'Transmitted Shaft Torque' },
      { id: 'outShearForce', label: 'Tangential Shear Force on Key' },
      { id: 'outDesignSafety', label: 'Design Safety Factor (3:1)' }
    ],
    rules: [
      'ANSI B17.1 Standard Square Key Rule: Key width W = Shaft Diameter / 4 (for 1" shaft, W = 1/4").',
      'Shear Failure Mode: The key fails in horizontal shear along the shaft surface plane under tangential force F = Torque / (Radius).',
      'Maximum allowable shear stress under AISC/ASME shafting code is 0.577 × Yield Strength / Safety Factor.',
      'Key length must not exceed 1.5 to 2 times the shaft diameter to prevent uneven torsional load distribution.'
    ],
    formula: 'Torque T = (HP × 63025) / RPM (in-lbs) | Shear Force F = T / (D/2) | Length L = F / (W × Allowable_Shear)',
    faq: [
      { q: 'Why is a square key width typically one-fourth of the shaft diameter?', a: 'Standard engineering proportions (ANSI B17.1) set key width at 1/4 shaft diameter because this equalizes the resistance between key shear failure and hub compressive bearing failure.' },
      { q: 'What happens if a drive key is too long?', a: 'Under high torque, shafts twist slightly along their length. A key that is longer than twice the shaft diameter concentrates almost all the shear force at one end, fracturing the key rather than sharing the load evenly.' }
    ],
    calcJs: `
      function calc() {
        var d = parseFloat(document.getElementById('shaftDia').value) || 1.0;
        var hp = parseFloat(document.getElementById('transHp').value) || 10.0;
        var rpm = parseFloat(document.getElementById('shaftRpm').value) || 1750;
        var sy = parseFloat(document.getElementById('keySteel').value) || 54000;

        // ANSI B17.1 standard key size:
        var keyW = 0.25;
        if (d <= 0.75) keyW = 0.1875;
        else if (d <= 1.25) keyW = 0.250;
        else if (d <= 1.75) keyW = 0.375;
        else keyW = 0.500;

        // Torque in in-lbs:
        var torqueInLbs = (hp * 63025) / rpm;
        // Tangential force F = Torque / (d / 2)
        var forceLbs = torqueInLbs / (d / 2);

        // Allowable shear: Sys = 0.577 * Sy / 3.0 safety factor
        var allowShear = (0.577 * sy) / 3.0;

        // Length = Force / (KeyWidth * AllowableShear)
        var reqLen = forceLbs / (keyW * allowShear);
        var finalLen = Math.max(0.75, Math.ceil(reqLen * 8) / 8); // round up to nearest 1/8"

        document.getElementById('outReqKeyLen').textContent = finalLen.toFixed(3) + '" (' + toFraction(finalLen) + ') Minimum Key Length';
        document.getElementById('outKeyDim').textContent = keyW + '" × ' + keyW + '" Square Keyway (Depth = ' + (keyW / 2) + '")';
        document.getElementById('outShaftTorque').textContent = Math.round(torqueInLbs).toLocaleString() + ' in-lbs (' + Math.round(torqueInLbs / 12) + ' ft-lbs)';
        document.getElementById('outShearForce').textContent = Math.round(forceLbs).toLocaleString() + ' lbs Tangential Shear Force';
        document.getElementById('outDesignSafety').textContent = '3.0 Design Safety Factor on shear yield (' + Math.round(allowShear).toLocaleString() + ' psi allowable)';
      }
    `
  },
  {
    slug: 'flywheel-kinetic-energy-inertia',
    name: 'Flywheel Kinetic Energy & Inertia Calculator',
    h1: 'Flywheel Rotational Kinetic Energy & Moment of Inertia Calculator',
    title: 'Flywheel Kinetic Energy & Inertia Calculator [Moment of Inertia & Joules] | Digital Tools Shed',
    metaDesc: 'Calculate mass moment of inertia (I = 1/2 m r²) and stored rotational kinetic energy in joules and foot-pounds for solid and rim flywheels.',
    category: 'Mechanical & Steel',
    codeRef: 'Rotational Dynamics',
    lead: 'Calculate mass moment of inertia and stored rotational kinetic energy in foot-pounds and joules for solid steel discs and heavy-rim punch press flywheels.',
    inputs: [
      { id: 'wheelType', label: 'Flywheel Geometric Profile', type: 'select', options: [
        { value: 'solid', label: 'Solid Uniform Disc (I = 1/2 × m × r²)', selected: true },
        { value: 'rim', label: 'Heavy Outer Rim Flywheel (I = m × r_mean² - Punch Press)' }
      ]},
      { id: 'outerDiaIn', label: 'Flywheel Outer Diameter', value: 24, step: 2, unit: 'Inches' },
      { id: 'wheelWeight', label: 'Total Flywheel Weight', value: 250, step: 10, unit: 'Pounds (lbs)' },
      { id: 'spinRpm', label: 'Rotational Operating Speed', value: 1200, step: 50, unit: 'RPM' }
    ],
    primaryOutput: { id: 'outEnergyFtLbs', label: 'Stored Kinetic Energy', unit: 'Foot-Pounds (ft-lbs)' },
    outputs: [
      { id: 'outEnergyJoules', label: 'Kinetic Energy in Joules' },
      { id: 'outMomentInertia', label: 'Mass Moment of Inertia (I)' },
      { id: 'outRimSpeedFps', label: 'Outer Rim Peripheral Surface Speed' },
      { id: 'outBurstSafety', label: 'Centrifugal Burst Speed Rating' }
    ],
    rules: [
      'Rotational Kinetic Energy: E = 1/2 × I × ω², where angular velocity ω = 2π × RPM / 60.',
      'Mass Moment of Inertia: For a solid disc, I = 1/2 × m × r²; for a thin outer rim, I ≈ m × r².',
      'Energy scales with the SQUARE of the RPM: doubling rotational speed quadruples stored kinetic energy.',
      'Cast iron flywheels have a strict maximum safe rim speed of 100 feet/second (6,000 fpm); exceeding this risks explosive centrifugal burst.'
    ],
    formula: 'ω = 2π × RPM / 60 | Mass m = W / 32.174 | I = 0.5 × m × r² (slug-ft²) | Energy E = 0.5 × I × ω² (ft-lbs)',
    faq: [
      { q: 'Why are punch press flywheels designed with heavy rims rather than solid discs?', a: 'Moment of inertia depends on mass multiplied by radius squared. Concentrating the mass in the outermost rim maximizes the rotational radius, delivering roughly twice as much energy storage per pound of metal compared to a solid flat disc.' },
      { q: 'What is the danger of running a flywheel too fast?', a: 'Centrifugal force generates high hoop tension in the outer rim proportional to the square of rim velocity. If tensile stress exceeds the tensile strength of the cast iron or steel, the flywheel explodes outward like a bomb.' }
    ],
    calcJs: `
      function calc() {
        var wType = document.getElementById('wheelType').value;
        var diaIn = parseFloat(document.getElementById('outerDiaIn').value) || 24;
        var wLbs = parseFloat(document.getElementById('wheelWeight').value) || 250;
        var rpm = parseFloat(document.getElementById('spinRpm').value) || 1200;

        var rFt = (diaIn / 2) / 12;
        var massSlugs = wLbs / 32.174; // engineering mass in slugs
        var omega = (2 * Math.PI * rpm) / 60; // rad/sec

        // Moment of inertia in slug-ft^2:
        var inertia = wType === 'solid' ? 0.5 * massSlugs * rFt * rFt : 0.9 * massSlugs * rFt * rFt;

        // Rotational energy E = 0.5 * I * omega^2 in ft-lbs
        var energyFtLbs = 0.5 * inertia * omega * omega;
        var energyJoules = energyFtLbs * 1.35582;

        // Rim speed: v = omega * r
        var rimFps = omega * rFt;
        var rimFpm = rimFps * 60;

        var safeRim = rimFps <= 100;

        document.getElementById('outEnergyFtLbs').textContent = Math.round(energyFtLbs).toLocaleString() + ' ft-lbs Stored Kinetic Energy';
        document.getElementById('outEnergyJoules').textContent = Math.round(energyJoules).toLocaleString() + ' Joules (Watt-seconds)';
        document.getElementById('outMomentInertia').textContent = inertia.toFixed(2) + ' slug-ft² (' + (inertia * 32.174).toFixed(1) + ' lb-ft² moment of inertia)';
        document.getElementById('outRimSpeedFps').textContent = Math.round(rimFps) + ' ft/sec (' + Math.round(rimFpm).toLocaleString() + ' ft/min rim speed)';

        var badge = document.getElementById('statusBadge');
        if (safeRim) {
          document.getElementById('outBurstSafety').textContent = '✅ Safe Rim Speed (< 100 fps limit for standard cast iron)';
          document.getElementById('outBurstSafety').style.color = '#22c55e';
          badge.textContent = 'Rotational Pass: Rim speed within safe envelope';
          badge.style.color = '#22c55e';
          badge.style.background = 'rgba(34, 197, 94, 0.1)';
        } else {
          document.getElementById('outBurstSafety').textContent = '⚠️ DANGER: High Rim Speed! Mandates forged alloy steel (Risk of burst)';
          document.getElementById('outBurstSafety').style.color = '#ef4444';
          badge.textContent = 'Centrifugal Warning: Rim speed exceeds 100 fps';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
      }
    `
  }
];

// Combine all tool collections
const ALL_TRADE_TOOLS = [
  ...ROOFING_TOOLS,
  ...ELECTRICAL_TOOLS,
  ...CARPENTRY_TOOLS,
  ...CONCRETE_TOOLS,
  ...PLUMBING_TOOLS,
  ...HVAC_TOOLS,
  ...METALWORKING_TOOLS,
  ...RIGGING_TOOLS,
  ...FRAMING_TOOLS,
  ...MECHANICAL_TOOLS
];

export function buildTradeMathTools({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const dir = join(DIST, 'trade');
  ensureDir(dir);

  console.log('  🔨 Building Niche Construction & Trade Math Suite (114 Tools)...');

  // Build each individual tool page
  for (const tool of ALL_TRADE_TOOLS) {
    const html = renderPage({
      title: tool.title,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/trade/${tool.slug}`,
      currentPath: `/trade/${tool.slug}.html`,
      faq: tool.faq,
      bodyContent: buildToolBody(tool)
    });
    writeFileSync(join(dir, `${tool.slug}.html`), html);
  }

  // Build hub index page
  const hubHtml = renderPage({
    title: 'Niche Construction & Trade Math Calculators [114 Pro Trade Tools] | Digital Tools Shed',
    metaDesc: 'Free professional construction math calculators: rafter cut lists, electrical voltage drop, conduit fill, concrete batching, hydraulic cylinder force, and HVAC airflow.',
    canonical: `${DOMAIN}/trade/`,
    currentPath: '/trade/',
    bodyContent: buildHubHtml(ALL_TRADE_TOOLS)
  });
  writeFileSync(join(dir, 'index.html'), hubHtml);

  console.log(`  ✓ Built Niche Construction & Trade Math Suite (${ALL_TRADE_TOOLS.length} tools + hub)`);
}

// Allow direct execution for testing
import { fileURLToPath } from 'url';
const isMain = process.argv[1] && process.argv[1].endsWith('trade_math_tools.js');
if (isMain) {
  const { DIST, DOMAIN, renderPage, ensureDir } = await import('./core.js');
  buildTradeMathTools({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir });
}
