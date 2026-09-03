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
          Calculate restaurant tips (15%, 18%, 20%, 25%) and split food & drink bills evenly among friends with dollar rounding.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Bill & Tip Percentage</h3>
          
          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Bill Amount ($ USD)</label>
            <input type="number" id="tipBill" value="65.00" min="0" step="0.5" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="calcTip()" />
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Select Tip Percentage</label>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 0.5rem;">
              <button type="button" class="btn-sm" onclick="setTipPct(15)" style="padding: 0.5rem; background: var(--surface-alt); border: 1px solid var(--border); font-family: var(--mono); font-size: 0.9rem; border-radius: 4px; cursor: pointer;">15%</button>
              <button type="button" class="btn-sm" onclick="setTipPct(18)" style="padding: 0.5rem; background: var(--surface-alt); border: 1px solid var(--border); font-family: var(--mono); font-size: 0.9rem; border-radius: 4px; cursor: pointer;">18%</button>
              <button type="button" class="btn-sm" onclick="setTipPct(20)" style="padding: 0.5rem; background: var(--surface-alt); border: 1px solid var(--border); font-family: var(--mono); font-size: 0.9rem; border-radius: 4px; cursor: pointer; color: #10b981; font-weight: bold;">20%</button>
              <button type="button" class="btn-sm" onclick="setTipPct(25)" style="padding: 0.5rem; background: var(--surface-alt); border: 1px solid var(--border); font-family: var(--mono); font-size: 0.9rem; border-radius: 4px; cursor: pointer;">25%</button>
            </div>
            <input type="number" id="tipPct" value="20" min="0" max="100" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1rem; font-family: var(--mono);" oninput="calcTip()" />
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Split Between (People)</label>
            <input type="number" id="tipPeople" value="2" min="1" max="50" step="1" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcTip()" />
          </div>

          <div>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
              <input type="checkbox" id="tipRoundUp" onchange="calcTip()" />
              <span>Round up total to nearest dollar</span>
            </label>
          </div>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Payment Summary</h3>
          <div id="tipResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
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
        var bill = parseFloat(document.getElementById('tipBill').value) || 0;
        var pct = parseFloat(document.getElementById('tipPct').value) || 0;
        var people = parseInt(document.getElementById('tipPeople').value, 10) || 1;
        var roundUp = document.getElementById('tipRoundUp').checked;

        var tipAmount = bill * (pct / 100);
        var total = bill + tipAmount;

        if (roundUp) {
          total = Math.ceil(total);
          tipAmount = total - bill;
        }

        var totalPerPerson = total / people;
        var tipPerPerson = tipAmount / people;
        var billPerPerson = bill / people;

        document.getElementById('tipResults').innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL PER PERSON (' + people + ' ' + (people > 1 ? 'PEOPLE' : 'PERSON') + ')</span>' +
            '<div style="font-size: 2rem; font-weight: bold; color: #10b981;">$' + totalPerPerson.toFixed(2) + '</div>' +
            '<div style="font-size: 0.75rem; color: var(--text-muted);">Bill: $' + billPerPerson.toFixed(2) + ' + Tip: $' + tipPerPerson.toFixed(2) + '</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL TIP (' + pct + '%)</span>' +
            '<div style="font-size: 1.35rem; font-weight: bold; color: #3b82f6;">$' + tipAmount.toFixed(2) + '</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">GRAND TOTAL BILL</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">$' + total.toFixed(2) + '</div>' +
          '</div>';
      }

      window.setTipPct = function(p) {
        document.getElementById('tipPct').value = p;
        calcTip();
      };

      document.addEventListener('DOMContentLoaded', calcTip);
      calcTip();
    </script>
  `;

  writeFileSync(join(calcDir, 'tip-calculator.html'), renderPage({
    title: 'Tip Calculator & Bill Splitter: 15%, 18%, 20% | Digital Tools Shed',
    metaDesc: 'Calculate tips and split dining bills evenly. Compare 15%, 18%, and 20% gratuity with dollar rounding and per-person breakdown.',
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
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Gas Cost Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Trip Gas & Fuel Cost Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Estimate driving gas costs for road trips and daily commutes based on distance, vehicle MPG, fuel prices, and passengers.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Trip & Vehicle Fuel Economy</h3>
          
          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Trip Distance (Miles)</label>
            <input type="number" id="gasMiles" value="250" min="1" step="5" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="calcGas()" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Fuel Economy (MPG)</label>
              <input type="number" id="gasMpg" value="28" min="5" max="100" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcGas()" />
            </div>
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Gas Price ($ / Gal)</label>
              <input type="number" id="gasPrice" value="3.50" min="0.5" max="15" step="0.05" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcGas()" />
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Split Cost with Passengers</label>
            <input type="number" id="gasPass" value="1" min="1" max="15" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcGas()" />
          </div>

          <div>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
              <input type="checkbox" id="gasRoundTrip" onchange="calcGas()" />
              <span>Calculate as Round Trip (Double Distance)</span>
            </label>
          </div>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Fuel Expense Estimate</h3>
          <div id="gasResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
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
      function calcGas() {
        var miles = parseFloat(document.getElementById('gasMiles').value) || 0;
        var mpg = parseFloat(document.getElementById('gasMpg').value) || 25;
        var ppg = parseFloat(document.getElementById('gasPrice').value) || 3.50;
        var pass = parseInt(document.getElementById('gasPass').value, 10) || 1;
        var isRound = document.getElementById('gasRoundTrip').checked;

        var totalMiles = isRound ? (miles * 2) : miles;
        var gallons = totalMiles / mpg;
        var totalCost = gallons * ppg;
        var costPerPerson = totalCost / pass;
        var costPerMile = totalMiles > 0 ? (totalCost / totalMiles) : 0;

        document.getElementById('gasResults').innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">ESTIMATED TOTAL GAS COST</span>' +
            '<div style="font-size: 2rem; font-weight: bold; color: #10b981;">$' + totalCost.toFixed(2) + '</div>' +
            '<div style="font-size: 0.75rem; color: var(--text-muted);">' + totalMiles.toFixed(0) + ' miles ' + (isRound ? '(round trip)' : '(one-way)') + '</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">GALLONS NEEDED</span>' +
            '<div style="font-size: 1.35rem; font-weight: bold; color: #3b82f6;">' + gallons.toFixed(1) + ' Gallons</div>' +
            '<div style="font-size: 0.75rem; color: var(--text-muted);">At ' + mpg + ' MPG</div>' +
          '</div>' +
          (pass > 1 ? (
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">COST PER PASSENGER (' + pass + ' PEOPLE)</span>' +
              '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">$' + costPerPerson.toFixed(2) + ' / person</div>' +
            '</div>'
          ) : '') +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">COST PER MILE</span>' +
            '<div style="font-size: 1.1rem; color: var(--text-muted);">' + (costPerMile * 100).toFixed(1) + '¢ / mile</div>' +
          '</div>';
      }

      document.addEventListener('DOMContentLoaded', calcGas);
      calcGas();
    </script>
  `;

  writeFileSync(join(calcDir, 'gas-cost-calculator.html'), renderPage({
    title: 'Trip Gas Cost Calculator: Road Trip Fuel & Mileage | Digital Tools Shed',
    metaDesc: 'Calculate road trip gas cost, fuel economy gallons, and cost per passenger. Features round-trip toggles and real-time cost-per-mile analysis.',
    canonical: `${DOMAIN}/calc/gas-cost-calculator`,
    bodyContent: gasBody,
    currentPath: '/calc/gas-cost-calculator',
    faq: [
      { q: 'How do you calculate gas cost for a trip?', a: 'Divide total trip miles by your vehicle MPG to determine gallons needed, then multiply by the current price of gas per gallon: (Miles / MPG) × Price Per Gallon.' },
      { q: 'How much does it cost to drive 500 miles?', a: 'For a vehicle getting 28 MPG with gas at $3.50 per gallon, driving 500 miles requires ~17.9 gallons of fuel, costing approximately $62.50.' },
      { q: 'How does vehicle speed affect MPG on highway road trips?', a: 'According to fuel economy studies, gas mileage decreases rapidly at speeds above 50 mph. Driving at 75 mph uses approximately 20% more fuel than driving at 60 mph.' }
    ]
  }));

  console.log('  ✓ Built Daily Calculators Suite (tip-calculator, gas-cost-calculator in /calc/)');
}
