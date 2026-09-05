import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

export function buildDailyCalcTools() {
  const calcDir = join(DIST, 'calc');
  ensureDir(calcDir);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. TIP & BILL SPLIT CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const tipBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Tip Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Tip & Bill Split Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Calculate restaurant tips, sales tax, pre-tax vs post-tax gratuity, and split dining bills evenly among friends with dollar rounding and worked derivations.
        </p>
      </header>

      <div class="tool-box">
        <div class="grid-inputs">
          <div class="field-group">
            <label class="field-label">Bill Subtotal ($ USD)</label>
            <input type="number" id="tip-bill" class="text-input" value="85.50" step="0.5" oninput="calcTip()" />
          </div>
          <div class="field-group">
            <label class="field-label">Sales Tax Rate (%)</label>
            <input type="number" id="tip-tax-pct" class="text-input" value="8.25" step="0.25" oninput="calcTip()" />
          </div>
          <div class="field-group">
            <label class="field-label">Tip Percentage (%)</label>
            <input type="number" id="tip-pct" class="text-input" value="20" min="0" max="100" oninput="calcTip()" />
          </div>
        </div>

        <!-- Quick Tip Presets -->
        <div style="margin-bottom: 1.25rem;">
          <label class="field-label">Quick Tip Presets</label>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="btn-sec" onclick="setTipPct(15)" style="padding: 0.4rem 0.8rem; font-family: var(--mono); font-size: 0.85rem;">15% (Fair)</button>
            <button type="button" class="btn-sec" onclick="setTipPct(18)" style="padding: 0.4rem 0.8rem; font-family: var(--mono); font-size: 0.85rem;">18% (Good)</button>
            <button type="button" class="btn-sec" onclick="setTipPct(20)" style="padding: 0.4rem 0.8rem; font-family: var(--mono); font-size: 0.85rem; border-color: #3b82f6; color: #3b82f6; font-weight: bold;">20% (Standard)</button>
            <button type="button" class="btn-sec" onclick="setTipPct(25)" style="padding: 0.4rem 0.8rem; font-family: var(--mono); font-size: 0.85rem;">25% (Great)</button>
            <button type="button" class="btn-sec" onclick="setTipPct(30)" style="padding: 0.4rem 0.8rem; font-family: var(--mono); font-size: 0.85rem;">30% (Exceptional)</button>
          </div>
        </div>

        <div class="grid-inputs" style="margin-bottom: 1rem;">
          <div class="field-group">
            <label class="field-label">Gratuity Base</label>
            <select id="tip-base" class="text-input" onchange="calcTip()">
              <option value="pre" selected>Pre-Tax Subtotal (Etiquette Standard)</option>
              <option value="post">Post-Tax Total (Higher Gratuity)</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Number of People Splitting</label>
            <input type="number" id="tip-people" class="text-input" value="3" min="1" max="50" oninput="calcTip()" />
          </div>
          <div class="field-group">
            <label class="field-label">Rounding Preference</label>
            <select id="tip-round" class="text-input" onchange="calcTip()">
              <option value="none" selected>Exact Cents ($0.01)</option>
              <option value="tip">Round Up Tip to Whole Dollar</option>
              <option value="total">Round Up Total Per Person to Whole Dollar</option>
            </select>
          </div>
        </div>

        <div class="result-card" style="margin-top: 1.5rem;">
          <div class="field-label">Total Payment Per Person</div>
          <div id="tip-per-person" class="result-val">$36.55</div>
          <div id="tip-breakdown-details" style="font-size: 0.95rem; color: var(--text-muted); margin-top: 0.5rem; font-family: var(--mono); line-height: 1.6;">
            Tip Amount: <strong id="tip-amount-out" style="color: #10b981;">$17.10</strong> &bull;
            Sales Tax: <strong id="tip-tax-out" style="color: var(--fg);">$7.05</strong> &bull;
            Grand Total: <strong id="tip-total-out" style="color: var(--fg);">$109.65</strong>
          </div>
          <div id="tip-per-person-tip" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem; font-family: var(--mono);">
            Tip contribution per person: $5.70
          </div>

          <button type="button" id="btnCopyTip" onclick="copyTipSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
            📋 Copy Dining Bill & Tip Split Report
          </button>
        </div>

        <!-- Step-by-Step Worked Derivation -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Restaurant Gratuity Derivation</h3>
            <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Etiquette Standard</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            Proper restaurant etiquette calculates gratuity strictly on the food and beverage subtotal prior to government sales tax assessment:
          </p>
          <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 1: Food & Beverage Gratuity</strong>
              <div id="tip-step-1" style="color: #3b82f6; margin-top: 0.25rem;">
                Tip = Subtotal &times; (Tip % / 100) = $85.50 &times; 0.20 = <strong>$17.10</strong>
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 2: Sales Tax Assessment</strong>
              <div id="tip-step-2" style="color: var(--text-muted); margin-top: 0.25rem;">
                Tax = Subtotal &times; (Tax % / 100) = $85.50 &times; 0.0825 = <strong>$7.05</strong>
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 3: Grand Total Bill</strong>
              <div id="tip-step-3" style="color: var(--text-muted); margin-top: 0.25rem;">
                Total = Subtotal + Tax + Tip = $85.50 + $7.05 + $17.10 = <strong>$109.65</strong>
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: #10b981; font-weight: 700;">Step 4: Equal Party Split</strong>
              <div id="tip-step-4" style="color: #10b981; margin-top: 0.25rem;">
                Per Person = $109.65 / 3 = <strong>$36.55 / person</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Critical Gratuity Traps & Etiquette Pitfalls -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Dining & Gratuity Pitfalls</h3>
          <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; display: grid; gap: 0.6rem;">
            <li><strong>Tipping on Sales Tax:</strong> Automated POS card terminals (Toast, Square, Clover) default to calculating gratuity on the post-tax bill. In high-tax jurisdictions (e.g. 10%), a "20% tip" button actually charges 22% on your consumed food and drink.</li>
            <li><strong>The Large-Party Auto-Gratuity Double Dip:</strong> Many restaurants automatically assess an 18% or 20% service charge for parties of 6 or more. Always check the itemized receipt before writing an additional tip on the merchant copy line.</li>
            <li><strong>Counter Service & Takeout Inflation:</strong> Digital touchscreens prompt 18%, 20%, or 25% tips for counter pickup where full table service was not provided. Standard etiquette for carryout is 0% to 10%, or rounding up to the nearest dollar.</li>
            <li><strong>Alcohol Subtotal Asymmetry:</strong> For high-end dining with expensive wine bottles ($200+), standard dining protocol allows tipping a reduced percentage (10% to 15%) on the wine bottle portion, rather than a full 20% on cellar markups.</li>
          </ul>
        </div>
      </div>

      <div class="ad-blend-box" style="margin: 2rem 0;">
        <span class="ad-label">Sponsored Resource</span>
        <div class="ad-unit-300x250">
          <script type="text/javascript">
            atOptions = {
              'key' : '335d807d460eaf2491fcca0f635474ce',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js"></script>
        </div>
      </div>
    </div>

    <script>
      function calcTip() {
        var bill = parseFloat(document.getElementById('tip-bill').value) || 0;
        var taxPct = parseFloat(document.getElementById('tip-tax-pct').value) || 0;
        var tipPct = parseFloat(document.getElementById('tip-pct').value) || 0;
        var base = document.getElementById('tip-base').value;
        var people = Math.max(1, parseInt(document.getElementById('tip-people').value, 10) || 1);
        var roundMode = document.getElementById('tip-round').value;

        var taxAmount = bill * (taxPct / 100);
        var tipBase = (base === 'post') ? (bill + taxAmount) : bill;
        var tipAmount = tipBase * (tipPct / 100);

        if (roundMode === 'tip') {
          tipAmount = Math.ceil(tipAmount);
        }

        var grandTotal = bill + taxAmount + tipAmount;
        var perPersonTotal = grandTotal / people;

        if (roundMode === 'total') {
          perPersonTotal = Math.ceil(perPersonTotal);
          grandTotal = perPersonTotal * people;
          tipAmount = grandTotal - bill - taxAmount;
        }

        var perPersonTip = tipAmount / people;

        document.getElementById('tip-per-person').textContent = '$' + perPersonTotal.toFixed(2);
        document.getElementById('tip-amount-out').textContent = '$' + tipAmount.toFixed(2);
        document.getElementById('tip-tax-out').textContent = '$' + taxAmount.toFixed(2);
        document.getElementById('tip-total-out').textContent = '$' + grandTotal.toFixed(2);
        document.getElementById('tip-per-person-tip').textContent = 'Tip contribution per person: $' + perPersonTip.toFixed(2);

        // Update Derivation
        document.getElementById('tip-step-1').innerHTML = 'Tip = ' + (base === 'post' ? 'Post-Tax Total' : 'Subtotal') + ' &times; (' + tipPct + '% / 100) = $' + tipBase.toFixed(2) + ' &times; ' + (tipPct/100).toFixed(2) + ' = <strong>$' + tipAmount.toFixed(2) + '</strong>';
        document.getElementById('tip-step-2').innerHTML = 'Tax = Subtotal &times; (' + taxPct + '% / 100) = $' + bill.toFixed(2) + ' &times; ' + (taxPct/100).toFixed(4) + ' = <strong>$' + taxAmount.toFixed(2) + '</strong>';
        document.getElementById('tip-step-3').innerHTML = 'Total = Subtotal ($' + bill.toFixed(2) + ') + Tax ($' + taxAmount.toFixed(2) + ') + Tip ($' + tipAmount.toFixed(2) + ') = <strong>$' + grandTotal.toFixed(2) + '</strong>';
        document.getElementById('tip-step-4').innerHTML = 'Per Person (' + people + ' ' + (people > 1 ? 'diners' : 'diner') + ') = $' + grandTotal.toFixed(2) + ' / ' + people + ' = <strong>$' + perPersonTotal.toFixed(2) + ' / person</strong>';
      }

      window.setTipPct = function(pct) {
        document.getElementById('tip-pct').value = pct;
        calcTip();
      };

      function copyTipSummary() {
        var bill = parseFloat(document.getElementById('tip-bill').value) || 0;
        var tipPct = document.getElementById('tip-pct').value;
        var people = document.getElementById('tip-people').value;
        var perPerson = document.getElementById('tip-per-person').textContent;
        var grandTotal = document.getElementById('tip-total-out').textContent;
        var tipAmt = document.getElementById('tip-amount-out').textContent;
        var taxAmt = document.getElementById('tip-tax-out').textContent;

        var text = 'DINING BILL & TIP BREAKDOWN\\n' +
          '----------------------------------------\\n' +
          '• Bill Subtotal: $' + bill.toFixed(2) + '\\n' +
          '• Sales Tax: ' + taxAmt + '\\n' +
          '• Tip (' + tipPct + '%): ' + tipAmt + '\\n' +
          '• Grand Total: ' + grandTotal + '\\n' +
          '• Party Size: ' + people + ' person(s)\\n' +
          '• Total Due Per Person: ' + perPerson + '\\n' +
          '----------------------------------------\\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/tip-calculator';

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('btnCopyTip');
          var old = btn.innerHTML;
          btn.innerHTML = '✓ Copied Dining Summary!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          setTimeout(function() {
            btn.innerHTML = old;
            btn.style.background = 'var(--surface-alt)';
            btn.style.color = 'var(--fg)';
          }, 2000);
        });
      }

      document.addEventListener('DOMContentLoaded', calcTip);
      calcTip();
    </script>
  `;

  writeFileSync(join(calcDir, 'tip-calculator.html'), renderPage({
    title: 'Tip Calculator & Bill Splitter: 15%, 18%, 20% | Digital Tools Shed',
    metaDesc: 'Calculate restaurant tips and split dining bills evenly. Compare pre-tax vs post-tax gratuity, 15%, 18%, and 20% tip with dollar rounding and worked derivations.',
    canonical: `${DOMAIN}/calc/tip-calculator`,
    bodyContent: tipBody,
    currentPath: '/calc/tip-calculator',
    faq: [
      { q: 'What is the standard tip at a restaurant in the United States?', a: 'The standard tipping range for sit-down dining in the US is 15% to 20% of the pre-tax bill. 15% is typical for adequate service, 18% for good service, and 20% or more for excellent service.' },
      { q: 'Should you tip on the pre-tax or post-tax bill amount?', a: 'Etiquette experts and the IRS recommend calculating tips on the pre-tax subtotal. However, many automated payment terminals calculate percentages on the total with tax.' },
      { q: 'How much should you tip for takeout or delivery?', a: 'For delivery, a $3 to $5 minimum or 15% to 20% is customary. For counter takeout pickup, 10% or rounding up to the nearest dollar is common.' }
    ]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. TRIP GAS COST CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const gasBody = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Gas Cost Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Trip Gas & Fuel Cost Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Accurately calculate road trip gas cost, fuel consumption, and passenger splits. Includes Metric/Imperial modes, realistic vehicle presets, aerodynamic drag & cargo penalties, and complete vehicle cost of ownership.
        </p>
      </header>

      <!-- Unit Mode Switcher -->
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
        <button type="button" id="btnGasImperial" onclick="setGasUnit('imperial')" class="btn-sec" style="flex: 1; padding: 0.6rem; font-family: var(--mono); font-size: 0.85rem; border-color: #3b82f6; color: #3b82f6; font-weight: bold; cursor: pointer;">
          🇺🇸 Imperial (Miles, MPG, $ / Gal)
        </button>
        <button type="button" id="btnGasMetric" onclick="setGasUnit('metric')" class="btn-sec" style="flex: 1; padding: 0.6rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
          🌍 Metric (Kilometers, L/100km, Currency / L)
        </button>
      </div>

      <div class="tool-box">
        <!-- Vehicle Presets -->
        <div style="margin-bottom: 1.5rem;">
          <label class="field-label" style="margin-bottom: 0.5rem; display: block;">Quick Vehicle Efficiency Presets</label>
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <button type="button" class="btn-sec" onclick="setVehiclePreset(34, 6.9, 'Compact Sedan (Civic / Corolla)')" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-family: var(--mono);">🚗 Compact Sedan (34 MPG / 6.9L)</button>
            <button type="button" class="btn-sec" onclick="setVehiclePreset(29, 8.1, 'Midsize Sedan (Camry / Accord)')" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-family: var(--mono);">🚘 Midsize Sedan (29 MPG / 8.1L)</button>
            <button type="button" class="btn-sec" onclick="setVehiclePreset(27, 8.7, 'Compact Crossover (RAV4 / CR-V)')" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-family: var(--mono); border-color: #10b981; color: #10b981; font-weight: bold;">🚙 Crossover / SUV (27 MPG / 8.7L)</button>
            <button type="button" class="btn-sec" onclick="setVehiclePreset(21, 11.2, 'Large SUV / Minivan (Explorer / Odyssey)')" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-family: var(--mono);">🚐 Large SUV (21 MPG / 11.2L)</button>
            <button type="button" class="btn-sec" onclick="setVehiclePreset(17, 13.8, 'Full-Size Pickup (F-150 / Silverado)')" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-family: var(--mono);">🛻 Pickup Truck (17 MPG / 13.8L)</button>
            <button type="button" class="btn-sec" onclick="setVehiclePreset(52, 4.5, 'Hybrid (Prius / Ioniq)')" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-family: var(--mono);">🔋 Hybrid (52 MPG / 4.5L)</button>
          </div>
          <div id="gas-vehicle-label" style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem; font-family: var(--mono);">
            Selected: Compact Crossover (RAV4 / CR-V)
          </div>
        </div>

        <div class="grid-inputs">
          <div class="field-group">
            <label id="lbl-distance" class="field-label">Trip Distance (Miles)</label>
            <input type="number" id="gas-dist" class="text-input" value="350" min="1" step="5" oninput="calcGas()" />
            <div style="display: flex; gap: 0.3rem; margin-top: 0.35rem; flex-wrap: wrap;">
              <button type="button" onclick="setDistPreset(100, 160)" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.4rem; font-family: var(--mono);">100 mi (Getaway)</button>
              <button type="button" onclick="setDistPreset(350, 560)" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.4rem; font-family: var(--mono);">350 mi (Regional)</button>
              <button type="button" onclick="setDistPreset(600, 960)" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.4rem; font-family: var(--mono);">600 mi (Cross-State)</button>
              <button type="button" onclick="setDistPreset(1200, 1930)" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.4rem; font-family: var(--mono);">1200 mi (Road Trip)</button>
            </div>
          </div>

          <div class="field-group">
            <label id="lbl-economy" class="field-label">Fuel Economy (MPG)</label>
            <input type="number" id="gas-efficiency" class="text-input" value="27" min="1" max="150" step="0.5" oninput="calcGas()" />
            <small style="color: var(--text-muted); font-size: 0.75rem;">EPA highway rating</small>
          </div>

          <div class="field-group">
            <label id="lbl-price" class="field-label">Gas Price ($ / Gallon)</label>
            <input type="number" id="gas-price" class="text-input" value="3.55" min="0.1" max="30" step="0.05" oninput="calcGas()" />
            <small style="color: var(--text-muted); font-size: 0.75rem;">Average local pump rate</small>
          </div>
        </div>

        <!-- Real-World Drag & Load Modifiers -->
        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; margin: 1.25rem 0;">
          <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; margin-bottom: 0.75rem; color: var(--fg); display: flex; align-items: center; justify-content: space-between;">
            <span>⚙️ Real-World Aerodynamic & Load Modifiers</span>
            <span style="font-family: var(--mono); font-size: 0.72rem; color: #10b981;">Combats Lab-Only EPA Bias</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
              <label class="field-label" style="font-size: 0.75rem;">Cruising Speed (Aerodynamic Drag)</label>
              <select id="gas-mod-speed" class="text-input" onchange="calcGas()" style="padding: 0.45rem; font-size: 0.85rem;">
                <option value="0">55–65 mph / 90–105 km/h (EPA Baseline)</option>
                <option value="0.12" selected>70–75 mph / 110–120 km/h (+12% Fuel)</option>
                <option value="0.22">80+ mph / 130+ km/h (+22% Wind Drag)</option>
              </select>
            </div>
            <div>
              <label class="field-label" style="font-size: 0.75rem;">Air Conditioning (Compressor)</label>
              <select id="gas-mod-ac" class="text-input" onchange="calcGas()" style="padding: 0.45rem; font-size: 0.85rem;">
                <option value="0">A/C Off / Windows (+0%)</option>
                <option value="0.05" selected>A/C Auto / Moderate (+5%)</option>
                <option value="0.10">A/C Max Summer Heatwave (+10%)</option>
              </select>
            </div>
            <div>
              <label class="field-label" style="font-size: 0.75rem;">Roof Racks & Exterior Cargo</label>
              <select id="gas-mod-cargo" class="text-input" onchange="calcGas()" style="padding: 0.45rem; font-size: 0.85rem;">
                <option value="0" selected>Clean Roof / Aerodynamic (+0%)</option>
                <option value="0.08">Hitch Bike Rack (+8%)</option>
                <option value="0.18">Roof Cargo Box / Kayak (+18% Drag)</option>
              </select>
            </div>
            <div>
              <label class="field-label" style="font-size: 0.75rem;">Vehicle Payload & Passengers</label>
              <select id="gas-mod-load" class="text-input" onchange="calcGas()" style="padding: 0.45rem; font-size: 0.85rem;">
                <option value="0" selected>Driver & Light Gear (+0%)</option>
                <option value="0.06">Full Passenger Load & Luggage (+6%)</option>
                <option value="0.30">Towing Utility Trailer / Boat (+30%)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="grid-inputs" style="margin-bottom: 1rem;">
          <div class="field-group">
            <label class="field-label">Split Among Passengers</label>
            <input type="number" id="gas-passengers" class="text-input" value="3" min="1" max="15" step="1" oninput="calcGas()" />
            <small style="color: var(--text-muted); font-size: 0.75rem;">Diners / road trippers</small>
          </div>
          <div class="field-group" style="display: flex; align-items: center; gap: 0.75rem; margin-top: 1.5rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.95rem;">
              <input type="checkbox" id="gas-round-trip" onchange="calcGas()" style="width: 18px; height: 18px; cursor: pointer;" />
              <span style="font-weight: bold;">Round Trip (Double Distance)</span>
            </label>
          </div>
          <div class="field-group">
            <label class="field-label">Fuel Tank Capacity (Est. Stops)</label>
            <input type="number" id="gas-tank" class="text-input" value="14" min="5" max="50" step="1" oninput="calcGas()" />
            <small id="gas-tank-unit" style="color: var(--text-muted); font-size: 0.75rem;">Gallons (Avg compact/crossover = 13–16 gal)</small>
          </div>
        </div>

        <!-- Primary Calculation Results -->
        <div class="result-card" style="margin-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap;">
            <div class="field-label">Total Estimated Fuel Cost</div>
            <div id="gas-total-miles-label" style="font-family: var(--mono); font-size: 0.82rem; color: var(--text-muted);">350 Total Miles (One-Way)</div>
          </div>
          <div id="gas-total-cost" class="result-val">$51.52</div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 1.25rem; border-top: 1px solid var(--border); padding-top: 1.25rem;">
            <div style="background: var(--surface); padding: 0.85rem; border-radius: 4px; border: 1px solid var(--border);">
              <span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; font-family: var(--mono);">Cost Per Passenger (3 People)</span>
              <div id="gas-per-person" style="font-size: 1.5rem; font-weight: bold; color: #10b981; font-family: var(--mono);">$17.17</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Even Venmo split</div>
            </div>

            <div style="background: var(--surface); padding: 0.85rem; border-radius: 4px; border: 1px solid var(--border);">
              <span id="gas-fuel-vol-label" style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; font-family: var(--mono);">Fuel Consumed</span>
              <div id="gas-fuel-volume" style="font-size: 1.5rem; font-weight: bold; color: #3b82f6; font-family: var(--mono);">14.5 Gallons</div>
              <div id="gas-effective-mpg" style="font-size: 0.75rem; color: var(--text-muted);">Eff. MPG: 24.1 (After drag)</div>
            </div>

            <div style="background: var(--surface); padding: 0.85rem; border-radius: 4px; border: 1px solid var(--border);">
              <span id="gas-cpm-label" style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; font-family: var(--mono);">Cost Per Distance Unit</span>
              <div id="gas-cpm" style="font-size: 1.5rem; font-weight: bold; color: var(--fg); font-family: var(--mono);">$0.147 / mi</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Fuel only (14.7¢)</div>
            </div>

            <div style="background: var(--surface); padding: 0.85rem; border-radius: 4px; border: 1px solid var(--border);">
              <span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; font-family: var(--mono);">Fuel Stops Needed</span>
              <div id="gas-stops" style="font-size: 1.5rem; font-weight: bold; color: #f59e0b; font-family: var(--mono);">1 Stop</div>
              <div id="gas-range" style="font-size: 0.75rem; color: var(--text-muted);">Tank Range: ~337 mi</div>
            </div>
          </div>

          <!-- Total Cost of Ownership (IRS Rate Comparison) -->
          <div style="margin-top: 1.25rem; padding: 1rem; background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <span style="font-family: var(--mono); font-size: 0.82rem; font-weight: bold; color: #3b82f6;">💡 Full Vehicle Ownership Cost (IRS Benchmark $0.67/mi):</span>
              <span id="gas-tco-total" style="font-family: var(--mono); font-size: 1.1rem; font-weight: bold; color: var(--fg);">$234.50 Total</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.35rem 0 0; line-height: 1.5;">
              While fuel costs <strong>$51.52</strong>, vehicle wear (tire tread wear, brake friction, oil degradation, and vehicle depreciation) accounts for an additional <strong>~$182.98</strong>.
            </p>
          </div>

          <button type="button" id="btnCopyTrip" onclick="copyTripSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
            📋 Copy Road Trip Fuel Expense Report
          </button>
        </div>

        <!-- Step-by-Step Worked Mathematical Derivation -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Road Trip Fuel Derivation</h3>
            <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Thermodynamic & Drag Physics</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            Automotive engineering calculations apply aerodynamic drag coefficients and accessory power draw to compute actual volumetric fuel burn:
          </p>
          <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 1: Total Distance Calculation</strong>
              <div id="gas-step-1" style="color: var(--text-muted); margin-top: 0.25rem;">
                Distance = 350 miles (One-Way) = <strong>350.0 miles</strong>
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 2: Real-World Efficiency Penalty Factor</strong>
              <div id="gas-step-2" style="color: #3b82f6; margin-top: 0.25rem;">
                Penalty = 1 + (Speed: +12%) + (A/C: +5%) + (Cargo: +0%) + (Load: +0%) = 1.17x<br>
                Effective Fuel Economy = 27 MPG / 1.17 = <strong>23.08 MPG</strong>
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 3: Total Fuel Volume Consumed</strong>
              <div id="gas-step-3" style="color: var(--text-muted); margin-top: 0.25rem;">
                Gallons = Distance / Effective MPG = 350 / 23.08 = <strong>15.17 Gallons</strong>
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: #10b981; font-weight: 700;">Step 4: Total Financial Cost & Passenger Split</strong>
              <div id="gas-step-4" style="color: #10b981; margin-top: 0.25rem;">
                Fuel Cost = 15.17 gal &times; $3.55/gal = <strong>$53.84</strong><br>
                Per Passenger (3 people) = $53.84 / 3 = <strong>$17.95 / person</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Critical Road Trip Traps & Driving Pitfalls -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Road Trip Fuel Traps & Aerodynamic Pitfalls</h3>
          <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; display: grid; gap: 0.6rem;">
            <li><strong>The Quadratic Aerodynamic Drag Law:</strong> Aerodynamic drag scales quadratically ($F_d \propto v^2$), and engine horsepower required to overcome drag scales cubically ($P \propto v^3$). Cruising at 80 mph requires ~35% more power than cruising at 65 mph. Slowing down from 80 to 68 mph saves between 15% and 22% in total gasoline expenses on long interstate journeys.</li>
            <li><strong>The "AC vs. Windows Down" 45 MPH Crossover:</strong> Below 45 mph (70 km/h) in suburban traffic, rolling down windows consumes less fuel than powering the air conditioning compressor. Above 45 mph on highways, aerodynamic boundary layer disruption from open windows generates more turbulent drag than running modern variable-displacement A/C compressors. Keep windows up on highways!</li>
            <li><strong>Underinflated Tire Rolling Resistance:</strong> The US Department of Energy warns that tires lose ~1 PSI per month and 1 PSI for every 10°F drop in ambient temperature. Driving with tires 5 PSI underinflated increases rolling resistance by 10% and reduces highway fuel economy by ~1%–2% while drastically accelerating tread wear.</li>
            <li><strong>Interstate Highway Exit Gas Gouging:</strong> Gas stations situated directly on off-ramps of major interstates frequently charge a 25¢ to 55¢ per gallon convenience premium compared to fuel stations located just 1 to 2 miles off the highway into local neighborhoods.</li>
            <li><strong>The "Fuel-Only" Road Trip Fallacy:</strong> Fuel represents only 20%–30% of your vehicle's true running expense. According to AAA and the IRS standard mileage rate ($0.67/mile in 2024), engine oil degradation, brake pad friction, tire wear, and vehicle mileage depreciation cost roughly 2 to 3 times more than the gasoline consumed.</li>
          </ul>
        </div>
      </div>

      <div class="ad-blend-box" style="margin: 2rem 0;">
        <span class="ad-label">Sponsored Resource</span>
        <div class="ad-unit-300x250">
          <script type="text/javascript">
            atOptions = {
              'key' : '335d807d460eaf2491fcca0f635474ce',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js"></script>
        </div>
      </div>
    </div>

    <script>
      var gasUnitMode = 'imperial'; // 'imperial' or 'metric'

      function setGasUnit(mode) {
        gasUnitMode = mode;
        var btnImp = document.getElementById('btnGasImperial');
        var btnMet = document.getElementById('btnGasMetric');

        if (mode === 'imperial') {
          btnImp.style.borderColor = '#3b82f6';
          btnImp.style.color = '#3b82f6';
          btnImp.style.fontWeight = 'bold';
          btnMet.style.borderColor = 'var(--border)';
          btnMet.style.color = 'var(--fg)';
          btnMet.style.fontWeight = 'normal';

          document.getElementById('lbl-distance').textContent = 'Trip Distance (Miles)';
          document.getElementById('lbl-economy').textContent = 'Fuel Economy (MPG)';
          document.getElementById('lbl-price').textContent = 'Gas Price ($ / Gallon)';
          document.getElementById('gas-tank-unit').textContent = 'Gallons (Avg compact/crossover = 13–16 gal)';
          document.getElementById('gas-fuel-vol-label').textContent = 'FUEL CONSUMED (GALLONS)';
          document.getElementById('gas-cpm-label').textContent = 'COST PER MILE';

          var curDist = parseFloat(document.getElementById('gas-dist').value) || 350;
          if (curDist > 500) document.getElementById('gas-dist').value = Math.round(curDist * 0.621371);
          document.getElementById('gas-efficiency').value = 27;
          document.getElementById('gas-price').value = 3.55;
          document.getElementById('gas-tank').value = 14;
        } else {
          btnMet.style.borderColor = '#3b82f6';
          btnMet.style.color = '#3b82f6';
          btnMet.style.fontWeight = 'bold';
          btnImp.style.borderColor = 'var(--border)';
          btnImp.style.color = 'var(--fg)';
          btnImp.style.fontWeight = 'normal';

          document.getElementById('lbl-distance').textContent = 'Trip Distance (Kilometers)';
          document.getElementById('lbl-economy').textContent = 'Fuel Consumption (L / 100km)';
          document.getElementById('lbl-price').textContent = 'Fuel Price (Currency / Liter)';
          document.getElementById('gas-tank-unit').textContent = 'Liters (Avg compact/crossover = 50–60 L)';
          document.getElementById('gas-fuel-vol-label').textContent = 'FUEL CONSUMED (LITERS)';
          document.getElementById('gas-cpm-label').textContent = 'COST PER KILOMETER';

          var curDist2 = parseFloat(document.getElementById('gas-dist').value) || 350;
          if (curDist2 < 500) document.getElementById('gas-dist').value = Math.round(curDist2 * 1.60934);
          document.getElementById('gas-efficiency').value = 8.7;
          document.getElementById('gas-price').value = 1.75;
          document.getElementById('gas-tank').value = 55;
        }
        calcGas();
      }

      window.setVehiclePreset = function(mpg, l100, label) {
        if (gasUnitMode === 'imperial') {
          document.getElementById('gas-efficiency').value = mpg;
        } else {
          document.getElementById('gas-efficiency').value = l100;
        }
        document.getElementById('gas-vehicle-label').textContent = 'Selected: ' + label;
        calcGas();
      };

      window.setDistPreset = function(mi, km) {
        document.getElementById('gas-dist').value = (gasUnitMode === 'imperial') ? mi : km;
        calcGas();
      };

      function calcGas() {
        var dist = parseFloat(document.getElementById('gas-dist').value) || 0;
        var efficiency = parseFloat(document.getElementById('gas-efficiency').value) || (gasUnitMode === 'imperial' ? 25 : 8.5);
        var price = parseFloat(document.getElementById('gas-price').value) || (gasUnitMode === 'imperial' ? 3.50 : 1.75);
        var pass = Math.max(1, parseInt(document.getElementById('gas-passengers').value, 10) || 1);
        var isRound = document.getElementById('gas-round-trip').checked;
        var tankCap = parseFloat(document.getElementById('gas-tank').value) || (gasUnitMode === 'imperial' ? 14 : 55);

        // Modifiers
        var modSpeed = parseFloat(document.getElementById('gas-mod-speed').value) || 0;
        var modAc = parseFloat(document.getElementById('gas-mod-ac').value) || 0;
        var modCargo = parseFloat(document.getElementById('gas-mod-cargo').value) || 0;
        var modLoad = parseFloat(document.getElementById('gas-mod-load').value) || 0;

        var totalPenalty = modSpeed + modAc + modCargo + modLoad;
        var penaltyMult = 1 + totalPenalty;

        var totalDist = isRound ? (dist * 2) : dist;
        var fuelVol = 0;
        var effectiveEfficiency = 0;

        if (gasUnitMode === 'imperial') {
          effectiveEfficiency = efficiency / penaltyMult;
          fuelVol = effectiveEfficiency > 0 ? (totalDist / effectiveEfficiency) : 0;
        } else {
          effectiveEfficiency = efficiency * penaltyMult;
          fuelVol = (totalDist / 100) * effectiveEfficiency;
        }

        var totalCost = fuelVol * price;
        var costPerPerson = totalCost / pass;
        var costPerDist = totalDist > 0 ? (totalCost / totalDist) : 0;

        // Estimated Range & Stops
        var rangePerTank = 0;
        if (gasUnitMode === 'imperial') {
          rangePerTank = tankCap * effectiveEfficiency;
        } else {
          rangePerTank = effectiveEfficiency > 0 ? ((tankCap / effectiveEfficiency) * 100) : 0;
        }
        var stops = Math.max(0, Math.floor(totalDist / rangePerTank));

        // TCO Benchmark (IRS $0.67/mile or €0.41/km)
        var tcoPerDist = (gasUnitMode === 'imperial') ? 0.67 : 0.41;
        var totalTco = totalDist * tcoPerDist;

        // Update DOM
        var distUnit = gasUnitMode === 'imperial' ? 'miles' : 'km';
        var volUnit = gasUnitMode === 'imperial' ? 'Gallons' : 'Liters';
        var cpmUnit = gasUnitMode === 'imperial' ? '/ mi' : '/ km';

        document.getElementById('gas-total-miles-label').textContent = totalDist.toLocaleString('en-US') + ' Total ' + distUnit.charAt(0).toUpperCase() + distUnit.slice(1) + (isRound ? ' (Round Trip)' : ' (One-Way)');
        document.getElementById('gas-total-cost').textContent = '$' + totalCost.toFixed(2);
        document.getElementById('gas-per-person').textContent = '$' + costPerPerson.toFixed(2);
        document.getElementById('gas-fuel-volume').textContent = fuelVol.toFixed(1) + ' ' + volUnit;
        
        if (gasUnitMode === 'imperial') {
          document.getElementById('gas-effective-mpg').textContent = 'Eff. MPG: ' + effectiveEfficiency.toFixed(1) + ' (Base: ' + efficiency + ')';
        } else {
          document.getElementById('gas-effective-mpg').textContent = 'Eff. Consumption: ' + effectiveEfficiency.toFixed(1) + ' L/100km (Base: ' + efficiency + ')';
        }

        document.getElementById('gas-cpm').textContent = '$' + costPerDist.toFixed(3) + ' ' + cpmUnit;
        document.getElementById('gas-stops').textContent = (stops === 0 ? '0 Stops (Direct)' : stops + (stops === 1 ? ' Stop' : ' Stops'));
        document.getElementById('gas-range').textContent = 'Tank Range: ~' + Math.round(rangePerTank) + ' ' + distUnit;

        document.getElementById('gas-tco-total').textContent = '$' + totalTco.toFixed(2) + ' Total TCO';

        // Step-by-step math derivation
        document.getElementById('gas-step-1').innerHTML = 'Distance = ' + dist + ' ' + distUnit + (isRound ? ' &times; 2 (Round Trip)' : '') + ' = <strong>' + totalDist.toFixed(1) + ' ' + distUnit + '</strong>';
        
        var penPct = Math.round(totalPenalty * 100);
        if (gasUnitMode === 'imperial') {
          document.getElementById('gas-step-2').innerHTML = 'Penalty Multiplier = 1 + ' + (totalPenalty > 0 ? '(+' + penPct + '% drag/load)' : '0%') + ' = ' + penaltyMult.toFixed(2) + 'x<br>Effective Fuel Economy = ' + efficiency + ' MPG / ' + penaltyMult.toFixed(2) + ' = <strong>' + effectiveEfficiency.toFixed(2) + ' MPG</strong>';
          document.getElementById('gas-step-3').innerHTML = 'Gallons = Total Miles / Effective MPG = ' + totalDist.toFixed(1) + ' / ' + effectiveEfficiency.toFixed(2) + ' = <strong>' + fuelVol.toFixed(2) + ' Gallons</strong>';
        } else {
          document.getElementById('gas-step-2').innerHTML = 'Penalty Multiplier = 1 + ' + (totalPenalty > 0 ? '(+' + penPct + '% drag/load)' : '0%') + ' = ' + penaltyMult.toFixed(2) + 'x<br>Effective Fuel Consumption = ' + efficiency + ' &times; ' + penaltyMult.toFixed(2) + ' = <strong>' + effectiveEfficiency.toFixed(2) + ' L/100km</strong>';
          document.getElementById('gas-step-3').innerHTML = 'Liters = (' + totalDist.toFixed(1) + ' km / 100) &times; ' + effectiveEfficiency.toFixed(2) + ' = <strong>' + fuelVol.toFixed(2) + ' Liters</strong>';
        }

        document.getElementById('gas-step-4').innerHTML = 'Total Fuel Cost = ' + fuelVol.toFixed(2) + ' ' + volUnit.toLowerCase() + ' &times; $' + price.toFixed(2) + ' = <strong>$' + totalCost.toFixed(2) + '</strong><br>Per Passenger (' + pass + ' ' + (pass > 1 ? 'passengers' : 'passenger') + ') = $' + totalCost.toFixed(2) + ' / ' + pass + ' = <strong>$' + costPerPerson.toFixed(2) + ' / person</strong>';
      }

      function copyTripSummary() {
        var totalDistLabel = document.getElementById('gas-total-miles-label').textContent;
        var totalCost = document.getElementById('gas-total-cost').textContent;
        var perPerson = document.getElementById('gas-per-person').textContent;
        var fuelVol = document.getElementById('gas-fuel-volume').textContent;
        var cpm = document.getElementById('gas-cpm').textContent;
        var stops = document.getElementById('gas-stops').textContent;
        var range = document.getElementById('gas-range').textContent;
        var pass = document.getElementById('gas-passengers').value;

        var text = '🚗 ROAD TRIP FUEL & EXPENSE REPORT\\n' +
          '----------------------------------------\\n' +
          '• Trip Distance: ' + totalDistLabel + '\\n' +
          '• Estimated Gas Cost: ' + totalCost + '\\n' +
          '• Passenger Split: ' + perPerson + ' / person (' + pass + ' travelers)\\n' +
          '• Fuel Needed: ' + fuelVol + '\\n' +
          '• Cost Per Unit: ' + cpm + '\\n' +
          '• Refuel Stops Needed: ' + stops + ' (' + range + ')\\n' +
          '----------------------------------------\\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/gas-cost-calculator';

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('btnCopyTrip');
          var old = btn.innerHTML;
          btn.innerHTML = '✓ Copied Road Trip Summary!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          setTimeout(function() {
            btn.innerHTML = old;
            btn.style.background = 'var(--surface-alt)';
            btn.style.color = 'var(--fg)';
          }, 2000);
        });
      }

      document.addEventListener('DOMContentLoaded', calcGas);
      calcGas();
    </script>
  `;

  writeFileSync(join(calcDir, 'gas-cost-calculator.html'), renderPage({
    title: 'Trip Gas Cost Calculator: Road Trip Fuel & Mileage | Digital Tools Shed',
    metaDesc: 'Calculate road trip gas cost, fuel economy gallons, and cost per passenger. Features Metric/Imperial toggles, vehicle presets, aerodynamic drag penalties, and cost-per-mile analysis.',
    canonical: `${DOMAIN}/calc/gas-cost-calculator`,
    bodyContent: gasBody,
    currentPath: '/calc/gas-cost-calculator',
    faq: [
      { q: 'How do you calculate gas cost for a trip?', a: 'Divide total trip miles by your vehicle MPG to determine gallons needed, then multiply by the price of gas per gallon: (Miles / MPG) × Price Per Gallon. For metric: (Distance in km / 100) × L/100km × Price Per Liter.' },
      { q: 'How much does it cost to drive 500 miles?', a: 'For a typical crossover getting 27 MPG with gas at $3.50 per gallon, driving 500 miles requires ~18.5 gallons of fuel, costing approximately $64.80 for gas alone.' },
      { q: 'How does cruising speed affect highway gas mileage?', a: 'Because aerodynamic drag increases with the square of speed, driving at 75 to 80 mph increases fuel consumption by 15% to 25% compared to driving at 60 to 65 mph.' },
      { q: 'Is it cheaper to run the air conditioner or roll down windows?', a: 'Below 45 mph (70 km/h), rolling down windows is more fuel-efficient. Above 45 mph on highways, aerodynamic drag caused by open windows consumes more fuel than running modern vehicle air conditioning.' }
    ]
  }));

  console.log('  ✓ Built Daily Calculators Suite (tip-calculator, gas-cost-calculator in /calc/)');
}
