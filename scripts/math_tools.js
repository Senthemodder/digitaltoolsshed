// scripts/math_tools.js - Math & Financial Calculators Suite for Digital Tools Shed

export function buildMathToolsSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const mathDist = join(DIST, 'math');
  ensureDir(mathDist);

  const commonStyle = `
    <style>
      .tool-box { background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0; }
      .field-group { margin-bottom: 1.25rem; }
      .field-label { display: block; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; font-weight: 600; }
      .code-input, .text-input { width: 100%; padding: 0.75rem; font-family: var(--mono); font-size: 0.95rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; box-sizing: border-box; }
      .btn-primary { background: var(--btn-bg, #3b82f6); color: var(--btn-fg, #fff); border: none; padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.85rem; font-weight: 600; cursor: pointer; border-radius: 4px; transition: opacity 0.2s; }
      .btn-primary:hover { opacity: 0.9; }
      .btn-sec { background: transparent; color: var(--fg); border: 1px solid var(--border); padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; border-radius: 4px; }
      .btn-sec:hover { background: var(--surface-alt); }
      .action-bar { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem; align-items: center; }
      .result-card { background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center; margin-top: 1.5rem; }
      .result-val { font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: var(--btn-bg, #3b82f6); margin: 0.25rem 0; }
      .grid-inputs { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    </style>
  `;

  const tools = [
    {
      slug: 'percentage-calculator',
      title: '3-Way Percentage Calculator',
      metaDesc: 'Calculate percentages easily: What is X% of Y, X is what % of Y, and percentage increase or decrease between two numbers.',
      category: 'Math & Finance',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Percentage Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">3-Way Percentage Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Instant calculation for common percentage scenarios: find value of a percentage, determine proportion, or measure percentage change.
          </p>

          <div class="tool-box">
            <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;">1. What is X% of Y?</h3>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <span>What is</span>
              <input type="number" id="p1-x" class="text-input" style="width: 100px;" value="15" oninput="calcP1()" />
              <span>% of</span>
              <input type="number" id="p1-y" class="text-input" style="width: 120px;" value="250" oninput="calcP1()" />
              <span>=</span>
              <strong id="p1-res" style="font-family: var(--mono); font-size: 1.2rem; color: var(--btn-bg, #3b82f6); margin-left: 0.5rem;">37.5</strong>
            </div>
          </div>

          <div class="tool-box">
            <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;">2. X is what percent of Y?</h3>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <input type="number" id="p2-x" class="text-input" style="width: 100px;" value="45" oninput="calcP2()" />
              <span>is what % of</span>
              <input type="number" id="p2-y" class="text-input" style="width: 120px;" value="180" oninput="calcP2()" />
              <span>=</span>
              <strong id="p2-res" style="font-family: var(--mono); font-size: 1.2rem; color: var(--btn-bg, #3b82f6); margin-left: 0.5rem;">25%</strong>
            </div>
          </div>

          <div class="tool-box">
            <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;">3. Percentage Increase / Decrease</h3>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <span>From</span>
              <input type="number" id="p3-x" class="text-input" style="width: 100px;" value="80" oninput="calcP3()" />
              <span>to</span>
              <input type="number" id="p3-y" class="text-input" style="width: 100px;" value="120" oninput="calcP3()" />
              <span>=</span>
              <strong id="p3-res" style="font-family: var(--mono); font-size: 1.2rem; color: #22c55e; margin-left: 0.5rem;">+50% (Increase)</strong>
            </div>
            <button type="button" id="btnCopyPct" onclick="copyPercentageSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy All Percentage Results
            </button>
          </div>

          <!-- Step-by-Step Worked Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Percentage Derivations & Formulas</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Universal Math Rules</span>
            </div>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Formula 1: Value of a Percentage (What is X% of Y?)</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">Value = (X / 100) × Y &bull; Worked Example: 15% of 250 = (15 / 100) × 250 = 0.15 × 250 = <strong>37.5</strong></div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Formula 2: Percentage of a Whole (X is what % of Y?)</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">Percentage = (X / Y) × 100% &bull; Worked Example: 45 of 180 = (45 / 180) × 100% = 0.25 × 100% = <strong>25%</strong></div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Formula 3: Percentage Change (Increase or Decrease)</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">Change % = [(New - Old) / Old] × 100% &bull; Worked Example: (120 - 80) / 80 = 40 / 80 = +0.50 × 100% = <strong>+50% (Increase)</strong></div>
              </div>
            </div>
          </div>

          <!-- Critical Mathematical Pitfalls & Common Mistakes -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Percentage Pitfalls & Costly Misunderstandings</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Asymmetric Recovery Trap (Loss vs Gain):</strong> A 50% drop in portfolio value requires a <strong>+100% gain</strong> to break even, NOT a 50% gain! If $100 drops by 50% to $50, a 50% gain on $50 is only $75. Always calculate recovery based on the new reduced base.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Percentage Points vs Relative Percentages:</strong> An interest rate increasing from 4% to 5% is a <strong>1 percentage point increase</strong>, but a <strong>25% relative increase</strong> [(5 - 4) / 4 × 100%]. Confusing these two in financial contracts, inflation reporting, or tax brackets causes catastrophic errors.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Sequential Discounting Illusion:</strong> Stacking a 20% coupon on top of a 20% store sale is NOT a 40% discount! $100 - 20% = $80; $80 - 20% = $64, which is a 36% total discount. Consecutive percentage changes cannot be added directly.</li>
            </ul>
          </div>
        </div>

        <script>
          function calcP1() {
            const x = parseFloat(document.getElementById('p1-x').value) || 0;
            const y = parseFloat(document.getElementById('p1-y').value) || 0;
            document.getElementById('p1-res').textContent = ((x / 100) * y).toFixed(2);
          }
          function calcP2() {
            const x = parseFloat(document.getElementById('p2-x').value) || 0;
            const y = parseFloat(document.getElementById('p2-y').value) || 1;
            document.getElementById('p2-res').textContent = ((x / y) * 100).toFixed(2) + '%';
          }
          function calcP3() {
            const x = parseFloat(document.getElementById('p3-x').value) || 0;
            const y = parseFloat(document.getElementById('p3-y').value) || 0;
            if (x === 0) { document.getElementById('p3-res').textContent = 'N/A'; return; }
            const diff = ((y - x) / x) * 100;
            const el = document.getElementById('p3-res');
            el.textContent = (diff >= 0 ? '+' : '') + diff.toFixed(2) + '% (' + (diff >= 0 ? 'Increase' : 'Decrease') + ')';
            el.style.color = diff >= 0 ? '#22c55e' : '#ef4444';
          }
          window.copyPercentageSummary = function() {
            const p1x = document.getElementById('p1-x').value;
            const p1y = document.getElementById('p1-y').value;
            const p1r = document.getElementById('p1-res').textContent;
            const p2x = document.getElementById('p2-x').value;
            const p2y = document.getElementById('p2-y').value;
            const p2r = document.getElementById('p2-res').textContent;
            const p3x = document.getElementById('p3-x').value;
            const p3y = document.getElementById('p3-y').value;
            const p3r = document.getElementById('p3-res').textContent;

            const text = [
              '=== PERCENTAGE CALCULATION SUMMARY ===',
              '1. Value of Percentage: ' + p1x + '% of ' + p1y + ' = ' + p1r,
              '2. Percentage of Whole: ' + p2x + ' is ' + p2r + ' of ' + p2y,
              '3. Percentage Change: From ' + p3x + ' to ' + p3y + ' = ' + p3r,
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/percentage-calculator'
            ].join('\\n');

            navigator.clipboard.writeText(text).then(function() {
              const btn = document.getElementById('btnCopyPct');
              if (btn) {
                const old = btn.innerHTML;
                btn.innerHTML = '✓ Copied All Results!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };
        </script>
      `
    },
    {
      slug: 'compound-interest',
      title: 'Compound Interest & Investment Calculator',
      metaDesc: 'Calculate investment growth, total principal, interest compounded annually/monthly, and future portfolio value.',
      category: 'Math & Finance',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Compound Interest Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Compound Interest & Investment Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Project long-term compound investment growth with regular contributions and compounding frequencies.
          </p>

          <div class="tool-box">
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Initial Principal ($)</label>
                <input type="number" id="ci-principal" class="text-input" value="5000" oninput="calcCompound()" />
              </div>
              <div class="field-group">
                <label class="field-label">Annual Interest Rate (%)</label>
                <input type="number" id="ci-rate" class="text-input" value="7.5" step="0.1" oninput="calcCompound()" />
              </div>
              <div class="field-group">
                <label class="field-label">Investment Period (Years)</label>
                <input type="number" id="ci-years" class="text-input" value="10" min="1" max="50" oninput="calcCompound()" />
              </div>
              <div class="field-group">
                <label class="field-label">Compounding Frequency</label>
                <select id="ci-freq" class="text-input" onchange="calcCompound()">
                  <option value="12" selected>Monthly (12x/yr)</option>
                  <option value="1">Annually (1x/yr)</option>
                  <option value="4">Quarterly (4x/yr)</option>
                  <option value="365">Daily (365x/yr)</option>
                </select>
              </div>
            </div>

            <div class="result-card">
              <div class="field-label">Future Investment Balance</div>
              <div id="ci-total" class="result-val">$10,511.75</div>
              <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">
                Total Principal: <strong id="ci-p-out" style="color: var(--fg);">$5,000.00</strong> |
                Total Interest Earned: <strong id="ci-i-out" style="color: #22c55e;">$5,511.75</strong>
              </div>
            <button type="button" id="btnCopyCI" onclick="copyCompoundSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Investment Growth Projection
            </button>
          </div>

          <!-- Step-by-Step Worked Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Compound Interest Derivation</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Universal Investment Formula</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Compound interest generates exponential growth because interest earned in each period is reinvested to generate additional interest in subsequent periods:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 1: Governing Formula</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem; word-break: break-all;">
                  A = P &times; (1 + r/n)<sup>n&times;t</sup>
                </div>
                <div style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  Where P = Principal, r = Annual nominal interest rate (as decimal), n = Compounding frequency per year, t = Time in years, A = Final portfolio balance.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 2: Periodic Interest Rate Calculation</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  Periodic Rate (i) = r / n &bull; For 7.5% compounded monthly: 0.075 / 12 = <strong>0.00625 (0.625% per month)</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 3: Total Compounding Periods</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  Total Periods (N) = n &times; t &bull; For 10 years monthly: 12 &times; 10 = <strong>120 compounding cycles</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 4: Exponential Multiplier & Final Balance</strong>
                <div style="color: #10b981; font-weight: 700; margin-top: 0.25rem;">
                  Growth Multiplier = (1 + 0.00625)<sup>120</sup> = 2.10235 &bull; Final Balance: $5,000 &times; 2.10235 = <strong>$10,511.75</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Compounding Pitfalls & Wealth Traps -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Compounding Pitfalls & Wealth Traps</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Inflation Erosion Reality:</strong> Nominal returns do not equal real purchasing power. If your portfolio returns 7.5% but consumer inflation runs at 3.5%, your real compound growth rate is only ~3.86% via the Fisher Equation [(1 + 0.075) / (1 + 0.035) - 1]. Always adjust long-term retirement targets for inflation.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Devastating Drag of Expense Ratios (Reverse Compounding):</strong> A seemingly harmless 1.5% annual management fee or fund expense ratio doesn't take 1.5% of your gains—it compounds in reverse against your growing balance. Over a 30-year horizon, a 1.5% fee consumes over <strong>33% of your total potential portfolio value</strong>.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Compounding Frequency Myth:</strong> Many beginners fixate on compounding daily vs monthly. In reality, shifting from monthly to daily compounding on $10,000 at 7% over 10 years yields only an extra ~$6 total! The true driver of compound wealth is <strong>time and ongoing regular principal additions</strong>, not hyper-frequent compounding.</li>
            </ul>
          </div>
        </div>

        <script>
          function calcCompound() {
            const P = parseFloat(document.getElementById('ci-principal').value) || 0;
            const r = (parseFloat(document.getElementById('ci-rate').value) || 0) / 100;
            const t = parseFloat(document.getElementById('ci-years').value) || 1;
            const n = parseInt(document.getElementById('ci-freq').value, 10) || 12;

            const A = P * Math.pow(1 + (r / n), n * t);
            const interest = A - P;

            document.getElementById('ci-total').textContent = '$' + A.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            document.getElementById('ci-p-out').textContent = '$' + P.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            document.getElementById('ci-i-out').textContent = '$' + interest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
          window.copyCompoundSummary = function() {
            const P = document.getElementById('ci-principal').value;
            const r = document.getElementById('ci-rate').value;
            const t = document.getElementById('ci-years').value;
            const freq = document.getElementById('ci-freq').options[document.getElementById('ci-freq').selectedIndex].text;
            const total = document.getElementById('ci-total').textContent;
            const pOut = document.getElementById('ci-p-out').textContent;
            const iOut = document.getElementById('ci-i-out').textContent;

            const text = [
              '=== COMPOUND INTEREST PROJECTION ===',
              'Initial Principal: $' + P,
              'Annual Interest Rate: ' + r + '%',
              'Investment Duration: ' + t + ' Years',
              'Compounding Frequency: ' + freq,
              '------------------------------------',
              'Total Future Balance: ' + total,
              'Total Principal Invested: ' + pOut,
              'Total Interest Earned: ' + iOut,
              '------------------------------------',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/compound-interest'
            ].join('\\n');

            navigator.clipboard.writeText(text).then(function() {
              const btn = document.getElementById('btnCopyCI');
              if (btn) {
                const old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Investment Projection!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };
          document.addEventListener('DOMContentLoaded', calcCompound);
        </script>
      `
    },
    {
      slug: 'mortgage-calculator',
      title: 'Mortgage & Loan Payment Calculator',
      metaDesc: 'Calculate monthly mortgage payments, loan amortization, total interest cost, and principal payoff schedule.',
      category: 'Math & Finance',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Mortgage Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Mortgage & Loan Payment Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Estimate monthly principal and interest payments, total borrowing cost, and amortization schedule.
          </p>

          <div class="tool-box">
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Home Price / Loan Amount ($)</label>
                <input type="number" id="mg-amount" class="text-input" value="350000" oninput="calcMortgage()" />
              </div>
              <div class="field-group">
                <label class="field-label">Down Payment ($)</label>
                <input type="number" id="mg-down" class="text-input" value="70000" oninput="calcMortgage()" />
              </div>
              <div class="field-group">
                <label class="field-label">Interest Rate (%)</label>
                <input type="number" id="mg-rate" class="text-input" value="6.5" step="0.1" oninput="calcMortgage()" />
              </div>
              <div class="field-group">
                <label class="field-label">Loan Term (Years)</label>
                <select id="mg-term" class="text-input" onchange="calcMortgage()">
                  <option value="30" selected>30 Years Fixed</option>
                  <option value="15">15 Years Fixed</option>
                  <option value="20">20 Years</option>
                  <option value="10">10 Years</option>
                </select>
              </div>
            </div>

            <div class="result-card">
              <div class="field-label">Estimated Monthly Payment (P&I)</div>
              <div id="mg-monthly" class="result-val">$1,769.79 / mo</div>
              <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">
                Loan Principal: <strong id="mg-p-out" style="color: var(--fg);">$280,000.00</strong> |
            <button type="button" id="btnCopyMG" onclick="copyMortgageSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Amortization Breakdown
            </button>
          </div>

          <!-- Step-by-Step Worked Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Mortgage Payment Derivation</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Standard Banking Formula</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Mortgages use standard fixed-rate amortization math where equal monthly payments cover accrued monthly interest while gradually paying down principal balance:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 1: Governing Amortization Equation</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem; word-break: break-all;">
                  M = P &times; [ r(1 + r)<sup>n</sup> ] / [ (1 + r)<sup>n</sup> - 1 ]
                </div>
                <div style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  Where M = Monthly Payment, P = Loan Principal ($350,000 - $70,000 = $280,000), r = Monthly interest rate (6.5% / 12 = 0.005417), n = Total payment count (30 &times; 12 = 360 months).
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 2: Monthly Factor Calculation</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  (1 + r)<sup>n</sup> = (1 + 0.0054167)<sup>360</sup> = <strong>6.9858</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 3: Monthly Payment (Principal & Interest)</strong>
                <div style="color: #10b981; font-weight: 700; margin-top: 0.25rem;">
                  M = $280,000 &times; [0.0054167 &times; 6.9858] / [6.9858 - 1] = $280,000 &times; 0.00632068 = <strong>$1,769.79 / month</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 4: Total Lifetime Interest Cost</strong>
                <div style="color: #ef4444; font-weight: 700; margin-top: 0.25rem;">
                  Total Repaid = $1,769.79 &times; 360 = $637,124.40 &bull; Total Interest = $637,124.40 - $280,000 = <strong>$357,124.40</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Mortgage Pitfalls & Hidden Costs -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Mortgage Pitfalls & Hidden Homeowner Costs</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Front-Loaded Amortization Trap:</strong> In the first year of a 30-year 6.5% mortgage, over <strong>85% of your monthly payment goes directly to interest</strong> ($1,516.67 interest vs only $253.12 principal). You do not start paying more principal than interest until year 18.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The PITI Escrow Shock:</strong> Principal and Interest (P&I) is only part of homeownership. Property taxes, homeowners hazard insurance, and PMI (Private Mortgage Insurance if down payment is under 20%) typically add <strong>$400 to $900+ per month</strong> to your actual out-of-pocket housing payment.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The 1-Extra-Payment Acceleration Strategy:</strong> Paying just one extra monthly payment per year (or switching to bi-weekly half-payments) applies directly to principal. On a $280,000 loan, this cuts <strong>4.5 years off your mortgage</strong> and saves over <strong>$55,000 in interest</strong>.</li>
            </ul>
          </div>
        </div>

        <script>
          function calcMortgage() {
            const price = parseFloat(document.getElementById('mg-amount').value) || 0;
            const down = parseFloat(document.getElementById('mg-down').value) || 0;
            const P = Math.max(0, price - down);
            const annualRate = parseFloat(document.getElementById('mg-rate').value) || 0;
            const r = (annualRate / 100) / 12;
            const years = parseInt(document.getElementById('mg-term').value, 10) || 30;
            const n = years * 12;

            let M = 0;
            if (r > 0) {
              M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            } else {
              M = P / n;
            }

            const totalRepayment = M * n;
            const totalInterest = totalRepayment - P;

            document.getElementById('mg-monthly').textContent = '$' + M.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' / mo';
            document.getElementById('mg-p-out').textContent = '$' + P.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            document.getElementById('mg-i-out').textContent = '$' + totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
          window.copyMortgageSummary = function() {
            const price = document.getElementById('mg-amount').value;
            const down = document.getElementById('mg-down').value;
            const rate = document.getElementById('mg-rate').value;
            const term = document.getElementById('mg-term').options[document.getElementById('mg-term').selectedIndex].text;
            const monthly = document.getElementById('mg-monthly').textContent;
            const pOut = document.getElementById('mg-p-out').textContent;
            const iOut = document.getElementById('mg-i-out').textContent;

            const text = [
              '=== MORTGAGE AMORTIZATION BREAKDOWN ===',
              'Home Price: $' + parseFloat(price).toLocaleString(),
              'Down Payment: $' + parseFloat(down).toLocaleString(),
              'Loan Principal: ' + pOut,
              'Interest Rate: ' + rate + '%',
              'Loan Term: ' + term,
              '---------------------------------------',
              'Estimated Monthly Payment (P&I): ' + monthly,
              'Total Lifetime Interest: ' + iOut,
              '---------------------------------------',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/mortgage-calculator'
            ].join('\\n');

            navigator.clipboard.writeText(text).then(function() {
              const btn = document.getElementById('btnCopyMG');
              if (btn) {
                const old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Amortization Breakdown!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };
          document.addEventListener('DOMContentLoaded', calcMortgage);
        </script>
      `
    },
    {
      slug: 'tip-calculator',
      title: 'Tip & Bill Split Calculator (Pre-Tax vs Post-Tax & Dollar Rounding)',
      metaDesc: 'Calculate restaurant tips accurately on pre-tax subtotal, sales tax, split the bill evenly per person, and round up to whole dollars for cash or Venmo.',
      category: 'Math & Finance',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Tip Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Tip & Bill Split Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Calculate restaurant tips, sales tax, and equal bill splits. Complies with dining etiquette by allowing gratuity calculation on pre-tax food subtotal with optional whole-dollar rounding.
          </p>

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
                  <div style="color: #3b82f6; margin-top: 0.25rem;">
                    Tip = Subtotal &times; (Tip % / 100) = $85.50 &times; 0.20 = <strong>$17.10</strong>
                  </div>
                </div>
                <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                  <strong style="color: var(--fg);">Step 2: Sales Tax Assessment</strong>
                  <div style="color: var(--text-muted); margin-top: 0.25rem;">
                    Tax = Subtotal &times; (Tax % / 100) = $85.50 &times; 0.0825 = <strong>$7.05</strong>
                  </div>
                </div>
                <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                  <strong style="color: var(--fg);">Step 3: Grand Total Bill</strong>
                  <div style="color: var(--text-muted); margin-top: 0.25rem;">
                    Total = Subtotal + Tax + Tip = $85.50 + $7.05 + $17.10 = <strong>$109.65</strong>
                  </div>
                </div>
                <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                  <strong style="color: #10b981; font-weight: 700;">Step 4: Equal Party Split</strong>
                  <div style="color: #10b981; margin-top: 0.25rem;">
                    Per Person = $109.65 / 3 = <strong>$36.55 / person</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Critical Dining Pitfalls & Tipping Rules -->
            <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Dining Pitfalls & Tipping Etiquette Traps</h3>
              <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
                <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The "Tipping on Sales Tax" Trap:</strong> Many point-of-sale receipt printers automatically compute 18% or 20% suggested tip amounts based on the <em>post-tax</em> total. In cities with combined state and local sales tax approaching 10% (e.g. Seattle, Chicago, Los Angeles), tipping on tax adds an artificial 1.8% to 2.0% stealth surcharge to your gratuity. Always calculate tip based on pre-tax food subtotal.</li>
                <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Large-Party "Auto-Gratuity" Double Dip:</strong> Dining parties of 6 or more persons frequently have a mandatory 18% or 20% gratuity or "service fee" automatically added to the itemized bill. Always inspect the receipt line items before filling out the tip line to ensure you do not inadvertently tip twice.</li>
                <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Counter-Service POS Screen Inflation:</strong> Touchscreen tablet checkouts for takeaway counters (where no sit-down table service or bussing is provided) often prompt 22%, 25%, or 30% defaults. Standard North American etiquette reserves 18%–20%+ for full-service table dining, while counter pickup gratuities are discretionary ($1–$2 or 10%).</li>
              </ul>
            </div>
          </div>
        </div>

        <script>
          window.setTipPct = function(pct) {
            document.getElementById('tip-pct').value = pct;
            calcTip();
          };

          function calcTip() {
            var subtotal = parseFloat(document.getElementById('tip-bill').value) || 0;
            var taxPct = parseFloat(document.getElementById('tip-tax-pct').value) || 0;
            var tipPct = parseFloat(document.getElementById('tip-pct').value) || 0;
            var tipBase = document.getElementById('tip-base').value;
            var people = parseInt(document.getElementById('tip-people').value, 10) || 1;
            var roundMode = document.getElementById('tip-round').value;

            var taxAmount = subtotal * (taxPct / 100);
            var baseForTip = (tipBase === 'post') ? (subtotal + taxAmount) : subtotal;
            var tipAmount = baseForTip * (tipPct / 100);

            if (roundMode === 'tip') {
              tipAmount = Math.ceil(tipAmount);
            }

            var grandTotal = subtotal + taxAmount + tipAmount;
            var perPerson = grandTotal / people;

            if (roundMode === 'total') {
              perPerson = Math.ceil(perPerson);
              grandTotal = perPerson * people;
              tipAmount = grandTotal - subtotal - taxAmount;
            }

            var tipPerPerson = tipAmount / people;

            document.getElementById('tip-per-person').textContent = '$' + perPerson.toFixed(2);
            document.getElementById('tip-amount-out').textContent = '$' + tipAmount.toFixed(2);
            document.getElementById('tip-tax-out').textContent = '$' + taxAmount.toFixed(2);
            document.getElementById('tip-total-out').textContent = '$' + grandTotal.toFixed(2);
            document.getElementById('tip-per-person-tip').textContent = 'Tip contribution per person: $' + tipPerPerson.toFixed(2);
          }

          window.copyTipSummary = function() {
            var subtotal = document.getElementById('tip-bill').value;
            var tax = document.getElementById('tip-tax-out').textContent;
            var tip = document.getElementById('tip-amount-out').textContent;
            var total = document.getElementById('tip-total-out').textContent;
            var perPerson = document.getElementById('tip-per-person').textContent;
            var people = document.getElementById('tip-people').value;

            var text = [
              '=== RESTAURANT BILL & TIP SPLIT REPORT ===',
              'Bill Subtotal: $' + parseFloat(subtotal).toFixed(2),
              'Sales Tax: ' + tax,
              'Gratuity (Tip): ' + tip,
              'Grand Total Bill: ' + total,
              'Party Size: ' + people + ' people',
              '-----------------------------------------',
              'EACH PERSON PAYS: ' + perPerson,
              '-----------------------------------------',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/tip-calculator'
            ].join('\\n');

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyTip');
              if (btn) {
                var old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Bill Split Report!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', calcTip);
        </script>
      `
    },
    {
      slug: 'roman-numerals',
      title: 'Roman Numerals Converter & Decoder (Standard & Vinculum Extended)',
      metaDesc: 'Convert numbers to Roman numerals and Roman numerals to numbers (1 to 3,999,999). Includes subtractive notation rules, Vinculum overline notation, and clockface IIII history.',
      category: 'Math & History',
      faq: [
        { q: 'What are the 7 primary Roman numeral symbols and their values?', a: 'The seven classical Roman numerals are I (1), V (5), X (10), L (50), C (100), D (500), and M (1,000).' },
        { q: 'Why do luxury clocks and watches use IIII instead of IV for four?', a: 'Watchmakers use IIII primarily for visual symmetry (balancing the four-character VIII on the opposite side of the dial), historical tradition dating back to King Charles V of France, and ancient Roman religious respect avoiding the prefix for Jupiter (IVPPITER).' },
        { q: 'How do you write numbers larger than 3,999 in Roman numerals?', a: 'Numbers 4,000 and above use the Vinculum system—a horizontal bar placed above the numeral that multiplies its face value by 1,000. For example, V̄ represents 5,000 and X̄ represents 10,000.' },
        { q: 'Did ancient Romans have a symbol for zero?', a: 'No. Ancient Roman numerals had no symbol for zero. In accounting and ledger records, the absence of an amount was represented with a blank space or the Latin word nulla (meaning "none").' },
        { q: 'What are the strict subtractive notation rules in Roman numerals?', a: 'Subtractive prefixes are restricted to powers of ten (I, X, C). Each can only precede the next two higher symbols: I before V or X (IV=4, IX=9); X before L or C (XL=40, XC=90); C before D or M (CD=400, CM=900). You cannot subtract across multiple tiers (e.g. 99 is XCIX, never IC).' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Roman Numerals Converter
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Roman Numerals Converter & Decoder</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Convert any Arabic integer to Roman numerals or decode Roman text back to decimals. Supports both standard classical notation (1 to 3,999) and extended Vinculum overline notation (up to 3,999,999).
          </p>

          <div class="tool-box">
            <!-- Input Grid -->
            <div class="grid-inputs" style="margin-bottom: 1rem;">
              <div class="field-group">
                <label class="field-label" for="num-in">Standard Arabic Number (1 – 3,999,999)</label>
                <input type="number" id="num-in" class="code-input" value="2026" min="1" max="3999999" oninput="intToRoman()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label" for="roman-in">Roman Numeral String (e.g. MMXXVI or V̄)</label>
                <input type="text" id="roman-in" class="code-input" value="MMXXVI" oninput="romanToInt()" style="text-transform: uppercase; font-size: 1.25rem; letter-spacing: 0.05em;" />
              </div>
            </div>

            <!-- Quick Historical & Date Presets -->
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              <span style="font-size: 0.78rem; color: var(--text-muted); width: 100%;">Historical & Calendar Milestones:</span>
              <button type="button" class="btn-sec" onclick="setRomanPreset(2026)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">2026 (Current)</button>
              <button type="button" class="btn-sec" onclick="setRomanPreset(1776)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">1776 (MDCCLXXVI)</button>
              <button type="button" class="btn-sec" onclick="setRomanPreset(1984)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">1984 (MCMLXXXIV)</button>
              <button type="button" class="btn-sec" onclick="setRomanPreset(1066)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">1066 (MLXVI)</button>
              <button type="button" class="btn-sec" onclick="setRomanPreset(476)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">476 (Fall of Rome)</button>
              <button type="button" class="btn-sec" onclick="setRomanPreset(3999)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">3999 (Max Classical)</button>
              <button type="button" class="btn-sec" onclick="setRomanPreset(10000)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">10,000 (X̄ Vinculum)</button>
            </div>

            <!-- Dynamic Result Card -->
            <div class="result-card" style="margin-top: 1.25rem; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Roman Numeral Output</div>
              <div id="roman-hero" class="result-val" style="font-size: 2.6rem; letter-spacing: 0.08em; word-break: break-all; margin: 0.35rem 0;">MMXXVI</div>
              <div id="roman-expansion" style="font-size: 0.95rem; color: var(--text-muted); font-family: var(--mono); margin-top: 0.35rem;">
                2,000 (MM) + 20 (XX) + 6 (VI) = 2,026
              </div>

              <!-- One-Click Copy Report Button -->
              <button type="button" id="btnCopyRoman" onclick="copyRomanSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
                📋 Copy Roman Numeral & Breakdown
              </button>
            </div>
          </div>

          <!-- Extended Vinculum Notation Guide -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">🏛️ The Vinculum System: Values 4,000 to 3,999,999</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Extended Roman Notation</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin: 0 0 1rem 0;">
              Classical Roman numerals stop at <strong>MMMCMXCIX (3,999)</strong> because Roman scribes rarely repeated <em>M</em> more than three times. For larger demographic censuses, military legions, and imperial taxes, Romans used the <strong>Vinculum</strong>—a horizontal macron overline multiplying any base symbol by <strong>1,000</strong>:
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.6rem; background: var(--surface-alt); border-radius: 4px; text-align: center; border: 1px solid var(--border);">
                <div style="font-size: 1.2rem; font-weight: bold; color: #3b82f6;">V̄</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">5,000</div>
              </div>
              <div style="padding: 0.6rem; background: var(--surface-alt); border-radius: 4px; text-align: center; border: 1px solid var(--border);">
                <div style="font-size: 1.2rem; font-weight: bold; color: #3b82f6;">X̄</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">10,000</div>
              </div>
              <div style="padding: 0.6rem; background: var(--surface-alt); border-radius: 4px; text-align: center; border: 1px solid var(--border);">
                <div style="font-size: 1.2rem; font-weight: bold; color: #3b82f6;">L̄</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">50,000</div>
              </div>
              <div style="padding: 0.6rem; background: var(--surface-alt); border-radius: 4px; text-align: center; border: 1px solid var(--border);">
                <div style="font-size: 1.2rem; font-weight: bold; color: #3b82f6;">C̄</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">100,000</div>
              </div>
              <div style="padding: 0.6rem; background: var(--surface-alt); border-radius: 4px; text-align: center; border: 1px solid var(--border);">
                <div style="font-size: 1.2rem; font-weight: bold; color: #3b82f6;">D̄</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">500,000</div>
              </div>
              <div style="padding: 0.6rem; background: var(--surface-alt); border-radius: 4px; text-align: center; border: 1px solid var(--border);">
                <div style="font-size: 1.2rem; font-weight: bold; color: #3b82f6;">M̄</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">1,000,000</div>
              </div>
            </div>
          </div>

          <!-- Master Reference Table -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.5rem 0; color: var(--fg);">📜 Master Roman Numeral Reference Chart</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              Complete tier reference covering Classical and Vinculum symbols:
            </p>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; text-align: left;">
                <thead>
                  <tr style="background: var(--surface-alt); border-bottom: 1px solid var(--border);">
                    <th style="padding: 0.5rem 0.75rem;">Arabic</th>
                    <th style="padding: 0.5rem 0.75rem;">Roman</th>
                    <th style="padding: 0.5rem 0.75rem;">Subtractive Equivalent</th>
                    <th style="padding: 0.5rem 0.75rem;">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem;">1</td><td style="padding: 0.45rem 0.75rem; font-weight: bold;">I</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">-</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6;">Units</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem;">4</td><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">IV</td><td style="padding: 0.45rem 0.75rem;">5 - 1</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6;">Units</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem;">5</td><td style="padding: 0.45rem 0.75rem; font-weight: bold;">V</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">-</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6;">Units</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem;">9</td><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">IX</td><td style="padding: 0.45rem 0.75rem;">10 - 1</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6;">Units</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem;">10</td><td style="padding: 0.45rem 0.75rem; font-weight: bold;">X</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">-</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6;">Tens</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem;">40</td><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">XL</td><td style="padding: 0.45rem 0.75rem;">50 - 10</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6;">Tens</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem;">50</td><td style="padding: 0.45rem 0.75rem; font-weight: bold;">L</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">-</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6;">Tens</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem;">90</td><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">XC</td><td style="padding: 0.45rem 0.75rem;">100 - 10</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6;">Tens</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem;">100</td><td style="padding: 0.45rem 0.75rem; font-weight: bold;">C</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">-</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6;">Hundreds</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem;">400</td><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">CD</td><td style="padding: 0.45rem 0.75rem;">500 - 100</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6;">Hundreds</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem;">500</td><td style="padding: 0.45rem 0.75rem; font-weight: bold;">D</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">-</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6;">Hundreds</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem;">900</td><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">CM</td><td style="padding: 0.45rem 0.75rem;">1000 - 100</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6;">Hundreds</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem;">1,000</td><td style="padding: 0.45rem 0.75rem; font-weight: bold;">M</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">-</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6;">Thousands</td></tr>
                  <tr><td style="padding: 0.45rem 0.75rem;">5,000</td><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #8b5cf6;">V̄</td><td style="padding: 0.45rem 0.75rem;">5 &times; 1,000</td><td style="padding: 0.45rem 0.75rem; color: #8b5cf6;">Vinculum</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 3 Historical Gotchas & Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem; color: var(--fg);">⚠️ 3 Fascinating Historical Rules & Traps</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); border-left: 3px solid #f59e0b;">
                <strong style="color: #f59e0b; font-size: 0.95rem;">1. The Watchmaker's "IIII" vs "IV" Tradition</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.35rem 0 0 0; line-height: 1.5;">
                  Nearly all luxury analog timepieces (Rolex, Cartier, Patek Philippe) print <strong>IIII</strong> instead of <strong>IV</strong>. Horologists maintain this for three reasons: (1) <strong>Visual balance</strong> with the heavy four-character <em>VIII</em> on the opposite side; (2) Ancient Roman religious taboo, as <em>IV</em> was the Latin abbreviation for the supreme god <em>IVPPITER</em> (Jupiter); and (3) King Charles V of France famously declared in 1364 that he did not wish to subtract from his royal hours.
                </p>
              </div>

              <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); border-left: 3px solid #ef4444;">
                <strong style="color: #ef4444; font-size: 0.95rem;">2. The Subtractive Distance Fallacy (99 is XCIX, NEVER IC)</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.35rem 0 0 0; line-height: 1.5;">
                  A widespread misconception is that 99 can be written as <em>IC</em> (100 - 1). In classical Latin grammar, subtractive notation is strictly limited to powers of ten preceding the next two symbols within the same order of magnitude. <em>I</em> can only precede <em>V</em> or <em>X</em>; <em>X</em> can only precede <em>L</em> or <em>C</em>; <em>C</em> can only precede <em>D</em> or <em>M</em>. You can never subtract across two full tiers. Therefore, 99 is decomposed as (90) + (9) = <strong>XCIX</strong>.
                </p>
              </div>

              <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); border-left: 3px solid #3b82f6;">
                <strong style="color: #3b82f6; font-size: 0.95rem;">3. The Non-Existence of Zero (Nulla)</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.35rem 0 0 0; line-height: 1.5;">
                  Roman numerals have no character for zero. Because their numbering originated on tally sticks and merchant abacuses, there was no need to tally a quantity that did not exist. In accounting records, Roman bookkeepers left spaces blank or penned the word <em>nulla</em> (Latin for "none"). Zero as an operational placeholder only arrived in Western Europe with Fibonacci's 1202 translation of Arabic algebra (*Liber Abaci*).
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          // Master numeral tables supporting up to 3,999,999 (with Unicode Vinculum)
          const VINCULUM_MAP = [
            [1000000, 'M̄'], [900000, 'C̄M̄'], [500000, 'D̄'], [400000, 'C̄D̄'],
            [100000, 'C̄'], [90000, 'X̄C̄'], [50000, 'L̄'], [40000, 'X̄L̄'],
            [10000, 'X̄'], [9000, 'ĪX̄'], [5000, 'V̄'], [4000, 'ĪV̄'],
            [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
            [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
            [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
          ];

          window.setRomanPreset = function(val) {
            document.getElementById('num-in').value = val;
            intToRoman();
          };

          function intToRoman() {
            let num = parseInt(document.getElementById('num-in').value, 10);
            if (isNaN(num) || num <= 0) {
              document.getElementById('roman-in').value = '';
              document.getElementById('roman-hero').textContent = '—';
              document.getElementById('roman-expansion').textContent = 'Enter a positive whole number (1 - 3,999,999).';
              return;
            }
            if (num > 3999999) {
              document.getElementById('roman-hero').textContent = 'Max Exceeded';
              document.getElementById('roman-expansion').textContent = 'Maximum Vinculum capacity is 3,999,999.';
              return;
            }

            let remaining = num;
            let res = '';
            for (const [val, sym] of VINCULUM_MAP) {
              while (remaining >= val) {
                res += sym;
                remaining -= val;
              }
            }

            document.getElementById('roman-in').value = res;
            document.getElementById('roman-hero').textContent = res;
            buildExpansion(num);
          }

          function buildExpansion(num) {
            const thousands = Math.floor(num / 1000);
            const hundreds = Math.floor((num % 1000) / 100);
            const tens = Math.floor((num % 100) / 10);
            const units = num % 10;

            const parts = [];
            if (thousands > 0) parts.push((thousands * 1000).toLocaleString('en-US') + ' (' + toRomanSub(thousands * 1000) + ')');
            if (hundreds > 0) parts.push((hundreds * 100) + ' (' + toRomanSub(hundreds * 100) + ')');
            if (tens > 0) parts.push((tens * 10) + ' (' + toRomanSub(tens * 10) + ')');
            if (units > 0) parts.push(units + ' (' + toRomanSub(units) + ')');

            document.getElementById('roman-expansion').textContent = parts.length ? parts.join(' + ') + ' = ' + num.toLocaleString('en-US') : num;
          }

          function toRomanSub(n) {
            let s = '';
            for (const [val, sym] of VINCULUM_MAP) {
              while (n >= val) {
                s += sym;
                n -= val;
              }
            }
            return s;
          }

          function romanToInt() {
            let raw = document.getElementById('roman-in').value.trim();
            if (!raw) {
              document.getElementById('num-in').value = '';
              document.getElementById('roman-hero').textContent = '—';
              document.getElementById('roman-expansion').textContent = '';
              return;
            }

            // Normalization: support ASCII notation like _V for V̄
            raw = raw.replace(/_([IVXLCDM])/g, '$1̄');

            // Values dictionary
            const values = {
              'M̄': 1000000, 'D̄': 500000, 'C̄': 100000, 'L̄': 50000, 'X̄': 10000, 'V̄': 5000, 'Ī': 1000,
              'M': 1000, 'D': 500, 'C': 100, 'L': 50, 'X': 10, 'V': 5, 'I': 1
            };

            // Tokenize symbols considering combining macron
            const tokens = [];
            for (let i = 0; i < raw.length; i++) {
              let ch = raw[i].toUpperCase();
              if (raw[i + 1] === '\u0304' || raw[i + 1] === '̄') {
                tokens.push(ch + '̄');
                i++;
              } else {
                tokens.push(ch);
              }
            }

            let total = 0;
            for (let i = 0; i < tokens.length; i++) {
              const cur = values[tokens[i]] || 0;
              const next = values[tokens[i + 1]] || 0;
              if (cur < next) {
                total -= cur;
              } else {
                total += cur;
              }
            }

            if (total > 0 && total <= 3999999) {
              document.getElementById('num-in').value = total;
              document.getElementById('roman-hero').textContent = raw;
              buildExpansion(total);
            } else {
              document.getElementById('roman-hero').textContent = 'Invalid String';
              document.getElementById('roman-expansion').textContent = 'Unrecognized Roman numeral sequence.';
            }
          }

          window.copyRomanSummary = function() {
            const btn = document.getElementById('btnCopyRoman');
            const arabic = document.getElementById('num-in').value;
            const roman = document.getElementById('roman-hero').textContent;
            const expansion = document.getElementById('roman-expansion').textContent;

            const text = '--- Roman Numeral Conversion ---\n' +
              'Arabic Integer: ' + arabic + '\n' +
              'Roman Numeral: ' + roman + '\n' +
              'Expansion: ' + expansion + '\n' +
              'Calculated on Digital Tools Shed (https://digitaltoolsshed.com/math/roman-numerals)';

            navigator.clipboard.writeText(text).then(() => {
              btn.textContent = '✓ Copied to Clipboard!';
              btn.style.borderColor = '#10b981';
              btn.style.color = '#10b981';
              setTimeout(() => {
                btn.textContent = '📋 Copy Roman Numeral & Breakdown';
                btn.style.borderColor = 'var(--border)';
                btn.style.color = 'var(--fg)';
              }, 2500);
            });
          };

          document.addEventListener('DOMContentLoaded', intToRoman);
          intToRoman();
        </script>
      `
    },
    {
      slug: 'age-calculator',
      title: 'Exact Age Calculator (Years, Months, Days, Lifetime Milestones & Next Birthday)',
      metaDesc: 'Free exact age calculator: compute chronological age in years, months, days, hours, and seconds. Discover total heartbeats, planetary ages, astrological zodiac signs, and next birthday countdown.',
      category: 'Math & Calculation',
      faq: [
        { q: 'How is exact chronological age calculated across leap years and variable month lengths?', a: 'Chronological age is calculated using calendar month and day borrowing. If the target day is smaller than the birth day, we borrow the exact number of days from the preceding month (28, 29, 30, or 31). If the target month is smaller than the birth month, we borrow 12 months from the year.' },
        { q: 'What happens if I was born on Leap Day (February 29)? When is my legal birthday?', a: 'In non-leap years, legal maturity for leap day babies varies by jurisdiction. In the United Kingdom and common-law countries, statutory age increments on March 1st. In some US states (like California) and Taiwan, rights legally vest on February 28th.' },
        { q: 'What is the difference between chronological age and biological age?', a: 'Chronological age measures the elapsed orbital cycles around the Sun since birth. Biological age reflects cellular senescence, DNA methylation (epigenetic clocks like Horvath\'s clock), telomere length, and cardiovascular health.' },
        { q: 'Why did South Korea abolish its traditional East Asian age reckoning system?', a: 'Under traditional East Asian reckoning, a baby was considered 1 year old at birth and gained a year every January 1st (meaning a baby born on Dec 31 turned 2 the next day). South Korea officially abolished this in June 2023 to eliminate administrative and legal confusion.' },
        { q: 'How are planetary ages (Mars, Venus, Jupiter) calculated?', a: 'Planetary age divides your total days alive by the orbital period of the planet. For example, a Mars year is 686.98 Earth days, so someone aged 30 on Earth is approximately 15.9 Mars years old.' }
      ],
      body: `
        \${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/util/">Daily Utilities</a> &gt; Age Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;">Exact Age Calculator & Lifetime Milestones</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Compute your exact chronological age in years, months, and days down to the second. Explore biological vitality milestones, planetary orbits, astrological signs, and live next-birthday countdowns.
          </p>

          <div class="tool-box">
            <!-- Input Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label class="field-label" for="dobInput">Date of Birth</label>
                <input type="date" id="dobInput" class="text-input" value="1995-06-15" oninput="calcAge()" />
                <span id="dobWeekdayLabel" style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;"></span>
              </div>
              <div>
                <label class="field-label" for="ageAtDate">Age at Date (Target Date)</label>
                <input type="date" id="ageAtDate" class="text-input" oninput="calcAge()" />
                <span id="targetWeekdayLabel" style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;"></span>
              </div>
            </div>

            <!-- Quick Presets -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              <button type="button" class="btn" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="setDobPreset(2000, 0, 1)">Born Jan 1, 2000</button>
              <button type="button" class="btn" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="setDobPreset(1990, 5, 15)">Born 1990</button>
              <button type="button" class="btn" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="setDobPreset(1980, 9, 20)">Born 1980</button>
              <button type="button" class="btn" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="resetTargetToToday()">Set Target to Today</button>
            </div>

            <!-- Live Results Container -->
            <div id="ageResults" style="display: grid; gap: 1rem; font-family: var(--mono); font-size: 0.9rem;"></div>

            <!-- One-Click Copy Report Button -->
            <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button type="button" id="copyAgeReportBtn" class="btn" style="background: #10b981; color: #fff; font-weight: 600; padding: 0.6rem 1.25rem; font-size: 0.85rem;" onclick="copyAgeReport()">
                📋 Copy Complete Milestone Report
              </button>
            </div>
          </div>

          <!-- Step-by-Step Derivation & Calendar Borrowing Math -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; margin: 1.5rem 0; font-family: var(--mono); font-size: 0.85rem;">
            <div style="font-weight: bold; color: var(--fg); margin-bottom: 0.5rem; font-size: 0.95rem;">Step-by-Step Calendar Borrowing Derivation</div>
            <div id="ageDerivationBox" style="display: grid; gap: 0.4rem; color: var(--text-muted); line-height: 1.5;"></div>
          </div>

          <!-- 3 Real-World Pitfalls & Legal Gotchas -->
          <div style="margin: 2rem 0; display: grid; gap: 1rem;">
            <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="font-weight: bold; color: #ef4444; font-size: 0.95rem; margin-bottom: 0.4rem;">⚠️ Gotcha 1: The Leap Day Baby Legal Age Paradox (Feb 29)</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                If you were born on February 29th (a Leap Year), when do you legally turn 18 or 21 in non-leap years? Statutory laws diverge globally. Under English common law (rooted in <em>21 Henry III</em>) and UK precedent, legal age is attained on <strong>March 1st</strong>. Conversely, several US state administrative codes and Taiwan civil law declare legal rights vest on <strong>February 28th</strong>.
              </p>
            </div>

            <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="font-weight: bold; color: #eab308; font-size: 0.95rem; margin-bottom: 0.4rem;">⚠️ Gotcha 2: East Asian Age Reckoning (Korean Age Abolition)</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                Traditionally in Korea, China, and Japan, babies were considered 1 year old on their day of birth, and everyone gained an additional year together on New Year\'s Day. Under this system, an infant born on December 31st would turn 2 years old on January 1st despite having lived for less than 24 hours. On June 28, 2023, South Korea officially abolished this legal standard, mandating international chronological age across all administrative contracts and civil law.
              </p>
            </div>

            <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="font-weight: bold; color: #3b82f6; font-size: 0.95rem; margin-bottom: 0.4rem;">⚠️ Gotcha 3: Chronological Age vs Biological Epigenetic Age</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                Chronological age is merely a measure of how many 365.2425-day astronomical orbits Earth has completed since your birth. In contrast, modern biomedical science evaluates <strong>Biological Age</strong> through epigenetic clocks (such as Steve Horvath\'s DNA methylation clock), telomere length attrition, and organ biomarkers. A 45-year-old marathon runner with optimal cardiovascular markers may register a biological age of 38, while chronic inflammation can elevate biological age far above calendar years.
              </p>
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
          var currentAgeData = null;
          var weekdaysArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

          function getWesternZodiac(m, d) {
            if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return { sign: 'Aries ♈', element: 'Fire 🔥', dates: 'Mar 21 - Apr 19' };
            if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return { sign: 'Taurus ♉', element: 'Earth 🌍', dates: 'Apr 20 - May 20' };
            if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return { sign: 'Gemini ♊', element: 'Air 💨', dates: 'May 21 - Jun 20' };
            if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return { sign: 'Cancer ♋', element: 'Water 💧', dates: 'Jun 21 - Jul 22' };
            if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return { sign: 'Leo ♌', element: 'Fire 🔥', dates: 'Jul 23 - Aug 22' };
            if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return { sign: 'Virgo ♍', element: 'Earth 🌍', dates: 'Aug 23 - Sep 22' };
            if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return { sign: 'Libra ♎', element: 'Air 💨', dates: 'Sep 23 - Oct 22' };
            if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return { sign: 'Scorpio ♏', element: 'Water 💧', dates: 'Oct 23 - Nov 21' };
            if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return { sign: 'Sagittarius ♐', element: 'Fire 🔥', dates: 'Nov 22 - Dec 21' };
            if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return { sign: 'Capricorn ♑', element: 'Earth 🌍', dates: 'Dec 22 - Jan 19' };
            if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return { sign: 'Aquarius ♒', element: 'Air 💨', dates: 'Jan 20 - Feb 18' };
            return { sign: 'Pisces ♓', element: 'Water 💧', dates: 'Feb 19 - Mar 20' };
          }

          function getChineseZodiac(year) {
            var animals = [
              { name: 'Rat 🐀', trait: 'Quick-witted & resourceful' },
              { name: 'Ox 🐂', trait: 'Diligent & dependable' },
              { name: 'Tiger 🐅', trait: 'Brave & confident' },
              { name: 'Rabbit 🐇', trait: 'Quiet, elegant & kind' },
              { name: 'Dragon 🐉', trait: 'Enthusiastic & bold' },
              { name: 'Snake 🐍', trait: 'Wise & intuitive' },
              { name: 'Horse 🐎', trait: 'Animated & energetic' },
              { name: 'Goat 🐐', trait: 'Gentle & sympathetic' },
              { name: 'Monkey 🐒', trait: 'Smart & curious' },
              { name: 'Rooster 🐓', trait: 'Hardworking & observant' },
              { name: 'Dog 🐕', trait: 'Honest & loyal' },
              { name: 'Pig 🐖', trait: 'Compassionate & generous' }
            ];
            var idx = (year - 4) % 12;
            if (idx < 0) idx += 12;
            var animal = animals[idx];

            var lastDigit = Math.abs(year) % 10;
            var element = '';
            if (lastDigit === 0 || lastDigit === 1) element = 'Metal';
            else if (lastDigit === 2 || lastDigit === 3) element = 'Water';
            else if (lastDigit === 4 || lastDigit === 5) element = 'Wood';
            else if (lastDigit === 6 || lastDigit === 7) element = 'Fire';
            else if (lastDigit === 8 || lastDigit === 9) element = 'Earth';

            return { animal: animal.name, element: element, trait: animal.trait };
          }

          function calcAge() {
            var dobVal = document.getElementById('dobInput').value;
            var atVal = document.getElementById('ageAtDate').value;
            if (!dobVal || !atVal) return;

            var dob = new Date(dobVal + 'T00:00:00');
            var at = new Date(atVal + 'T00:00:00');

            document.getElementById('dobWeekdayLabel').textContent = weekdaysArr[dob.getDay()] + ', ' + dob.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            document.getElementById('targetWeekdayLabel').textContent = weekdaysArr[at.getDay()] + ', ' + at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            if (at < dob) {
              document.getElementById('ageResults').innerHTML = '<div style="padding:1rem; background:#fee2e2; border:1px solid #ef4444; border-radius:4px; color:#b91c1c;">Target date cannot precede your date of birth! Please pick a date after ' + dobVal + '.</div>';
              document.getElementById('ageDerivationBox').innerHTML = '<em>Awaiting valid forward chronological dates...</em>';
              return;
            }

            var years = at.getFullYear() - dob.getFullYear();
            var months = at.getMonth() - dob.getMonth();
            var days = at.getDate() - dob.getDate();

            var borrowedDays = 0;
            var borrowedMonthDaysCount = 0;
            if (days < 0) {
              months--;
              var prevMonth = new Date(at.getFullYear(), at.getMonth(), 0);
              borrowedMonthDaysCount = prevMonth.getDate();
              days += borrowedMonthDaysCount;
              borrowedDays = 1;
            }
            var borrowedMonths = 0;
            if (months < 0) {
              years--;
              months += 12;
              borrowedMonths = 1;
            }

            var totalMs = at.getTime() - dob.getTime();
            var totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
            var totalHours = totalDays * 24;
            var totalMinutes = totalHours * 60;
            var totalSeconds = totalMinutes * 60;
            var totalWeeks = Math.floor(totalDays / 7);
            var remWeekDays = totalDays % 7;
            var decimalYears = (totalDays / 365.2425).toFixed(2);

            // Weekday of birth
            var bornWeekday = weekdaysArr[dob.getDay()];

            // Next birthday countdown
            var nextBday = new Date(at.getFullYear(), dob.getMonth(), dob.getDate());
            var isLeapBaby = (dob.getMonth() === 1 && dob.getDate() === 29);
            var checkLeapYear = function(y) { return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0); };

            if (isLeapBaby && !checkLeapYear(nextBday.getFullYear())) {
              nextBday = new Date(nextBday.getFullYear(), 2, 1); // March 1st
            }
            if (nextBday < at) {
              var nextYr = at.getFullYear() + 1;
              nextBday = new Date(nextYr, dob.getMonth(), dob.getDate());
              if (isLeapBaby && !checkLeapYear(nextYr)) {
                nextBday = new Date(nextYr, 2, 1);
              }
            }
            var msUntilBday = nextBday.getTime() - at.getTime();
            var daysUntilBday = Math.ceil(msUntilBday / (1000 * 60 * 60 * 24));
            var nextAge = (nextBday.getFullYear() - dob.getFullYear());
            var nextBdayWeekday = weekdaysArr[nextBday.getDay()];

            // Half-birthday calculation (6 months after birth month)
            var halfBdayMonth = (dob.getMonth() + 6) % 12;
            var halfBdayMonthName = new Date(2000, halfBdayMonth, 1).toLocaleDateString('en-US', { month: 'long' });

            // Vitality Estimates
            var totalHeartbeats = Math.round(totalDays * 103680); // 72 bpm avg
            var totalBreaths = Math.round(totalDays * 23040); // 16 breaths/min
            var sleepYears = (totalDays * (8 / 24) / 365.2425).toFixed(1);
            var pctLifespan = Math.min(100, (totalDays / (73.4 * 365.2425)) * 100).toFixed(1);

            // Zodiacs
            var wz = getWesternZodiac(dob.getMonth() + 1, dob.getDate());
            var cz = getChineseZodiac(dob.getFullYear());

            // Planetary Ages
            var mercuryAge = (totalDays / 87.97).toFixed(1);
            var venusAge = (totalDays / 224.7).toFixed(1);
            var marsAge = (totalDays / 686.98).toFixed(1);
            var jupiterAge = (totalDays / 4332.59).toFixed(2);

            var container = document.getElementById('ageResults');
            container.innerHTML = 
              '<!-- Primary Hero Card -->' +
              '<div style="padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Exact Chronological Age</span>' +
                  '<span style="font-size: 0.75rem; color: #10b981; font-weight: bold;">' + decimalYears + ' Solar Years</span>' +
                '</div>' +
                '<div style="font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">' + years + ' Years, ' + months + ' Months, ' + days + ' Days</div>' +
                '<div style="font-size: 0.85rem; color: var(--fg);">' +
                  'Born on a <strong>' + bornWeekday + '</strong>' + (isLeapBaby ? ' <span style="background:#fef3c7; color:#b45309; padding:2px 6px; border-radius:3px; font-size:0.75rem; font-weight:bold;">Leap Day Baby (Feb 29)</span>' : '') +
                '</div>' +
              '</div>' +

              '<!-- Next Birthday Card -->' +
              '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem;">' +
                '<div style="padding: 0.85rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Next Birthday Countdown</span>' +
                  '<div style="font-size: 1.4rem; font-weight: bold; color: #eab308; margin: 0.2rem 0;">' + (daysUntilBday === 0 ? 'Today! 🎂' : daysUntilBday + ' Days Away') + '</div>' +
                  '<div style="font-size: 0.75rem; color: var(--text-muted);">Turns ' + nextAge + ' on ' + nextBdayWeekday + ', ' + nextBday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + '</div>' +
                '</div>' +
                '<div style="padding: 0.85rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Annual Half-Birthday</span>' +
                  '<div style="font-size: 1.4rem; font-weight: bold; color: #3b82f6; margin: 0.2rem 0;">' + halfBdayMonthName + ' ' + dob.getDate() + '</div>' +
                  '<div style="font-size: 0.75rem; color: var(--text-muted);">Exact 6-month halfway milestone mark</div>' +
                '</div>' +
              '</div>' +

              '<!-- Lifetime Milestones Grid -->' +
              '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem;">' +
                '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Total Days</span>' +
                  '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">' + totalDays.toLocaleString() + '</div>' +
                '</div>' +
                '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Weeks & Days</span>' +
                  '<div style="font-size: 1.05rem; font-weight: bold; color: var(--fg);">' + totalWeeks.toLocaleString() + 'w ' + remWeekDays + 'd</div>' +
                '</div>' +
                '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Total Hours</span>' +
                  '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">' + totalHours.toLocaleString() + 'h</div>' +
                '</div>' +
                '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Total Minutes</span>' +
                  '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">' + totalMinutes.toLocaleString() + 'm</div>' +
                '</div>' +
                '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Total Seconds</span>' +
                  '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">' + totalSeconds.toLocaleString() + 's</div>' +
                '</div>' +
              '</div>' +

              '<!-- Biological & Physiological Vitality Stats -->' +
              '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">' +
                '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Estimated Heartbeats</span>' +
                  '<div style="font-size: 1.25rem; font-weight: bold; color: #ef4444; margin: 0.15rem 0;">' + totalHeartbeats.toLocaleString() + '</div>' +
                  '<div style="font-size: 0.72rem; color: var(--text-muted);">Based on standard 72 bpm resting pulse</div>' +
                '</div>' +
                '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Breaths Inhaled</span>' +
                  '<div style="font-size: 1.25rem; font-weight: bold; color: #06b6d4; margin: 0.15rem 0;">' + totalBreaths.toLocaleString() + '</div>' +
                  '<div style="font-size: 0.72rem; color: var(--text-muted);">Based on standard 16 breaths/minute</div>' +
                '</div>' +
                '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Cumulative Sleep</span>' +
                  '<div style="font-size: 1.25rem; font-weight: bold; color: #8b5cf6; margin: 0.15rem 0;">' + sleepYears + ' Years</div>' +
                  '<div style="font-size: 0.72rem; color: var(--text-muted);">~8 hours nightly restorative sleep</div>' +
                '</div>' +
              '</div>' +

              '<!-- Cosmic & Astrological Profile -->' +
              '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">' +
                '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Western Zodiac Sign</span>' +
                  '<div style="font-size: 1.2rem; font-weight: bold; color: var(--fg); margin: 0.15rem 0;">' + wz.sign + '</div>' +
                  '<div style="font-size: 0.75rem; color: var(--text-muted);">' + wz.element + ' • ' + wz.dates + '</div>' +
                '</div>' +
                '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Chinese Zodiac</span>' +
                  '<div style="font-size: 1.2rem; font-weight: bold; color: var(--fg); margin: 0.15rem 0;">' + cz.element + ' ' + cz.animal + '</div>' +
                  '<div style="font-size: 0.75rem; color: var(--text-muted);">' + cz.trait + '</div>' +
                '</div>' +
              '</div>' +

              '<!-- Planetary Ages -->' +
              '<div style="padding: 0.85rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; display: block; margin-bottom: 0.4rem;">Planetary Orbits (Your Age on Other Worlds)</span>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem; text-align: center;">' +
                  '<div style="padding: 0.4rem; background: var(--bg); border-radius: 3px;">' +
                    '<div style="font-size: 0.68rem; color: var(--text-muted);">Mercury ☿</div>' +
                    '<div style="font-size: 1rem; font-weight: bold; color: #f59e0b;">' + mercuryAge + ' yrs</div>' +
                  '</div>' +
                  '<div style="padding: 0.4rem; background: var(--bg); border-radius: 3px;">' +
                    '<div style="font-size: 0.68rem; color: var(--text-muted);">Venus ♀</div>' +
                    '<div style="font-size: 1rem; font-weight: bold; color: #ec4899;">' + venusAge + ' yrs</div>' +
                  '</div>' +
                  '<div style="padding: 0.4rem; background: var(--bg); border-radius: 3px;">' +
                    '<div style="font-size: 0.68rem; color: var(--text-muted);">Mars ♂</div>' +
                    '<div style="font-size: 1rem; font-weight: bold; color: #ef4444;">' + marsAge + ' yrs</div>' +
                  '</div>' +
                  '<div style="padding: 0.4rem; background: var(--bg); border-radius: 3px;">' +
                    '<div style="font-size: 0.68rem; color: var(--text-muted);">Jupiter ♃</div>' +
                    '<div style="font-size: 1rem; font-weight: bold; color: #8b5cf6;">' + jupiterAge + ' yrs</div>' +
                  '</div>' +
                '</div>' +
              '</div>';

            var deriv = document.getElementById('ageDerivationBox');
            deriv.innerHTML = 
              '<div><strong>1. Calendar Year Math:</strong> ' + at.getFullYear() + ' &minus; ' + dob.getFullYear() + ' = ' + (at.getFullYear() - dob.getFullYear()) + ' years' + (borrowedMonths ? ' &minus; 1 borrowed year = <strong>' + years + ' years</strong>' : '') + '</div>' +
              '<div><strong>2. Month Borrowing Math:</strong> ' + at.getMonth() + ' &minus; ' + dob.getMonth() + ' = ' + (at.getMonth() - dob.getMonth()) + ' months' + (borrowedMonths ? ' + 12 = ' + (at.getMonth() - dob.getMonth() + 12) : '') + (borrowedDays ? ' &minus; 1 borrowed month = <strong>' + months + ' months</strong>' : '') + '</div>' +
              '<div><strong>3. Day Borrowing Math:</strong> ' + at.getDate() + ' &minus; ' + dob.getDate() + ' = ' + (at.getDate() - dob.getDate()) + ' days' + (borrowedDays ? ' + ' + borrowedMonthDaysCount + ' (days in preceding month) = <strong>' + days + ' days</strong>' : '') + '</div>' +
              '<div><strong>4. Epoch Duration:</strong> &Delta;T = ' + totalMs.toLocaleString() + ' ms &divide; 86,400,000 ms/day = <strong>' + totalDays.toLocaleString() + ' total days alive</strong></div>';

            currentAgeData = {
              dob: dobVal,
              target: atVal,
              years: years,
              months: months,
              days: days,
              decimalYears: decimalYears,
              bornWeekday: bornWeekday,
              totalDays: totalDays,
              totalWeeks: totalWeeks,
              remWeekDays: remWeekDays,
              totalHours: totalHours,
              totalMinutes: totalMinutes,
              totalHeartbeats: totalHeartbeats,
              totalBreaths: totalBreaths,
              sleepYears: sleepYears,
              daysUntilBday: daysUntilBday,
              nextAge: nextAge,
              nextBdayWeekday: nextBdayWeekday,
              nextBdayDateStr: nextBday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              zodiacWestern: wz.sign,
              zodiacChinese: cz.element + ' ' + cz.animal
            };
          }

          window.setDobPreset = function(y, m, d) {
            var dateObj = new Date(y, m, d);
            document.getElementById('dobInput').value = dateObj.toISOString().slice(0, 10);
            calcAge();
          };

          window.resetTargetToToday = function() {
            document.getElementById('ageAtDate').value = new Date().toISOString().slice(0, 10);
            calcAge();
          };

          window.copyAgeReport = function() {
            if (!currentAgeData) return;
            var text = 
              '[Exact Chronological Age & Lifetime Milestone Report]\\n' +
              '• Date of Birth: ' + currentAgeData.dob + ' (' + currentAgeData.bornWeekday + ')\\n' +
              '• As of Date: ' + currentAgeData.target + '\\n' +
              '• Exact Age: ' + currentAgeData.years + ' Years, ' + currentAgeData.months + ' Months, ' + currentAgeData.days + ' Days (' + currentAgeData.decimalYears + ' solar years)\\n' +
              '• Lifetime Traversed: ' + currentAgeData.totalDays.toLocaleString() + ' Days (' + currentAgeData.totalWeeks.toLocaleString() + ' weeks, ' + currentAgeData.remWeekDays + ' days)\\n' +
              '• Total Hours Lived: ' + currentAgeData.totalHours.toLocaleString() + ' Hours (' + currentAgeData.totalMinutes.toLocaleString() + ' minutes)\\n' +
              '• Estimated Heartbeats: ~' + currentAgeData.totalHeartbeats.toLocaleString() + ' beats\\n' +
              '• Restorative Sleep: ~' + currentAgeData.sleepYears + ' cumulative years\\n' +
              '• Western Zodiac: ' + currentAgeData.zodiacWestern + '\\n' +
              '• Chinese Zodiac: ' + currentAgeData.zodiacChinese + '\\n' +
              '• Next Birthday: ' + (currentAgeData.daysUntilBday === 0 ? 'Today! 🎂' : currentAgeData.daysUntilBday + ' days away (Turns ' + currentAgeData.nextAge + ' on ' + currentAgeData.nextBdayWeekday + ', ' + currentAgeData.nextBdayDateStr + ')') + '\\n' +
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/util/age-calculator';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('copyAgeReportBtn');
              var orig = btn.innerHTML;
              btn.innerHTML = '<span style=\"color:#fff; font-weight:bold;\">✓ Copied Milestone Report!</span>';
              setTimeout(function() { btn.innerHTML = orig; }, 2200);
            });
          };

          document.addEventListener('DOMContentLoaded', function() {
            var today = new Date().toISOString().slice(0, 10);
            document.getElementById('ageAtDate').value = today;
            calcAge();
          });
        </script>
      `
    },
    {
      slug: 'gpa-calculator',
      title: 'College & High School GPA Calculator (Weighted & Unweighted)',
      metaDesc: 'Calculate your semester and cumulative GPA on a 4.0 scale with weighted Honors (+0.5) and AP/IB (+1.0) credit support.',
      category: 'Math & Education',
      faq: [
        { q: 'How is cumulative GPA calculated?', a: 'Cumulative GPA is calculated by multiplying the grade point value of each letter grade by the course credit hours to get quality points, summing all quality points across semesters, and dividing by total credit hours completed.' },
        { q: 'What is the difference between weighted and unweighted GPA?', a: 'An unweighted GPA measures academic achievement on a standard 4.0 scale regardless of course rigor. A weighted GPA provides extra points for advanced coursework (typically +0.5 points for Honors and +1.0 points for AP or IB courses).' },
        { q: 'What grade point does an A- or B+ equal on a 4.0 scale?', a: 'On standard 4.0 scales, A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, C+ = 2.3, C = 2.0, D = 1.0, and F = 0.0.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 950px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; GPA Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">College & High School GPA Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Calculate your semester and cumulative Grade Point Average on a 4.0 scale with weighted course support (Honors, AP, IB, and College courses).
          </p>

          <div class="tool-box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.2rem; margin: 0;">Current Semester Courses</h3>
              <button class="btn-sec" onclick="addGpaRow()" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">+ Add Course</button>
            </div>

            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.85rem;" id="gpaTable">
                <thead>
                  <tr style="border-bottom: 1px solid var(--border); text-align: left; color: var(--text-muted);">
                    <th style="padding: 0.5rem;">Course Name</th>
                    <th style="padding: 0.5rem;">Grade</th>
                    <th style="padding: 0.5rem;">Credits</th>
                    <th style="padding: 0.5rem;">Level / Weight</th>
                    <th style="padding: 0.5rem; width: 40px;"></th>
                  </tr>
                </thead>
                <tbody id="gpaRows">
                  <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 0.5rem;"><input type="text" value="English 101" class="text-input" style="padding: 0.4rem;" /></td>
                    <td style="padding: 0.5rem;">
                      <select class="text-input grade-select" onchange="calcGpa()" style="padding: 0.4rem;">
                        <option value="4.0" selected>A (4.0)</option>
                        <option value="3.7">A- (3.7)</option>
                        <option value="3.3">B+ (3.3)</option>
                        <option value="3.0">B (3.0)</option>
                        <option value="2.7">B- (2.7)</option>
                        <option value="2.3">C+ (2.3)</option>
                        <option value="2.0">C (2.0)</option>
                        <option value="1.7">C- (1.7)</option>
                        <option value="1.0">D (1.0)</option>
                        <option value="0.0">F (0.0)</option>
                      </select>
                    </td>
                    <td style="padding: 0.5rem;"><input type="number" value="3" min="0.5" step="0.5" class="text-input credit-input" oninput="calcGpa()" style="padding: 0.4rem; width: 60px;" /></td>
                    <td style="padding: 0.5rem;">
                      <select class="text-input weight-select" onchange="calcGpa()" style="padding: 0.4rem;">
                        <option value="0" selected>Standard (Regular)</option>
                        <option value="0.5">Honors (+0.5)</option>
                        <option value="1.0">AP / IB / College (+1.0)</option>
                      </select>
                    </td>
                    <td style="padding: 0.5rem;"><button onclick="removeGpaRow(this)" style="background:none; border:none; color:var(--text-muted); cursor:pointer;">✕</button></td>
                  </tr>
                  <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 0.5rem;"><input type="text" value="Calculus BC" class="text-input" style="padding: 0.4rem;" /></td>
                    <td style="padding: 0.5rem;">
                      <select class="text-input grade-select" onchange="calcGpa()" style="padding: 0.4rem;">
                        <option value="4.0">A (4.0)</option>
                        <option value="3.7" selected>A- (3.7)</option>
                        <option value="3.3">B+ (3.3)</option>
                        <option value="3.0">B (3.0)</option>
                        <option value="2.7">B- (2.7)</option>
                        <option value="2.3">C+ (2.3)</option>
                        <option value="2.0">C (2.0)</option>
                        <option value="1.7">C- (1.7)</option>
                        <option value="1.0">D (1.0)</option>
                        <option value="0.0">F (0.0)</option>
                      </select>
                    </td>
                    <td style="padding: 0.5rem;"><input type="number" value="4" min="0.5" step="0.5" class="text-input credit-input" oninput="calcGpa()" style="padding: 0.4rem; width: 60px;" /></td>
                    <td style="padding: 0.5rem;">
                      <select class="text-input weight-select" onchange="calcGpa()" style="padding: 0.4rem;">
                        <option value="0">Standard (Regular)</option>
                        <option value="0.5">Honors (+0.5)</option>
                        <option value="1.0" selected>AP / IB / College (+1.0)</option>
                      </select>
                    </td>
                    <td style="padding: 0.5rem;"><button onclick="removeGpaRow(this)" style="background:none; border:none; color:var(--text-muted); cursor:pointer;">✕</button></td>
                  </tr>
                  <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 0.5rem;"><input type="text" value="Biology Lab" class="text-input" style="padding: 0.4rem;" /></td>
                    <td style="padding: 0.5rem;">
                      <select class="text-input grade-select" onchange="calcGpa()" style="padding: 0.4rem;">
                        <option value="4.0">A (4.0)</option>
                        <option value="3.7">A- (3.7)</option>
                        <option value="3.3" selected>B+ (3.3)</option>
                        <option value="3.0">B (3.0)</option>
                        <option value="2.7">B- (2.7)</option>
                        <option value="2.3">C+ (2.3)</option>
                        <option value="2.0">C (2.0)</option>
                        <option value="1.7">C- (1.7)</option>
                        <option value="1.0">D (1.0)</option>
                        <option value="0.0">F (0.0)</option>
                      </select>
                    </td>
                    <td style="padding: 0.5rem;"><input type="number" value="4" min="0.5" step="0.5" class="text-input credit-input" oninput="calcGpa()" style="padding: 0.4rem; width: 60px;" /></td>
                    <td style="padding: 0.5rem;">
                      <select class="text-input weight-select" onchange="calcGpa()" style="padding: 0.4rem;">
                        <option value="0">Standard (Regular)</option>
                        <option value="0.5" selected>Honors (+0.5)</option>
                        <option value="1.0">AP / IB / College (+1.0)</option>
                      </select>
                    </td>
                    <td style="padding: 0.5rem;"><button onclick="removeGpaRow(this)" style="background:none; border:none; color:var(--text-muted); cursor:pointer;">✕</button></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div class="result-card" style="margin:0;">
                <div class="field-label">Unweighted Semester GPA</div>
                <div id="unweightedGpa" class="result-val">3.64</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Standard 4.00 Max</div>
              </div>
              <div class="result-card" style="margin:0;">
                <div class="field-label">Weighted Semester GPA</div>
                <div id="weightedGpa" class="result-val" style="color:#22c55e;">4.18</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Honors/AP Weighted Scale</div>
              </div>
              <div class="result-card" style="margin:0;">
                <div class="field-label">Total Credit Hours</div>
                <div id="totalCredits" class="result-val" style="color:var(--fg); font-size:1.8rem;">11.0</div>
                <div id="totalPoints" style="font-size:0.75rem; color:var(--text-muted);">46.0 Quality Points</div>
              </div>
            </div>

            <div style="margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 1.5rem;">
              <h4 style="font-family: var(--serif); font-size: 1.1rem; margin-bottom: 0.75rem;">Cumulative GPA (Optional)</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; max-width: 500px;">
                <div>
                  <label class="field-label">Prior Cumulative GPA</label>
                  <input type="number" id="priorGpa" value="3.50" step="0.01" min="0" max="5" class="text-input" oninput="calcGpa()" />
                </div>
                <div>
                  <label class="field-label">Prior Completed Credits</label>
                  <input type="number" id="priorCredits" value="30" step="1" min="0" class="text-input" oninput="calcGpa()" />
                </div>
              </div>
              <div id="cumulResult" style="margin-top: 0.75rem; font-family: var(--mono); font-size: 0.95rem; color: #3b82f6;"></div>
            <button type="button" id="btnCopyGPA" onclick="copyGPASummary()" class="btn-sec" style="margin-top: 1.5rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Official GPA Transcript Breakdown
            </button>
          </div>

          <!-- Step-by-Step Quality Points Worked Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step GPA & Quality Points Derivation</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">AACRAO Collegiate Standard</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Grade Point Average is a credit-weighted arithmetic mean where each letter grade is converted to quality points and normalized by total attempted credits:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 1: Calculate Course Quality Points</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">
                  Quality Points = Course Credit Hours &times; Grade Numerical Value
                </div>
                <div style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  Example: 3-credit course with an A (4.0) = 3 &times; 4.0 = 12.0 Quality Points &bull; 4-credit course with an A- (3.7) = 4 &times; 3.7 = 14.8 Quality Points.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 2: Weighted GPA Multiplier Allocation</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  Honors Course: Grade + 0.50 &bull; AP / IB / Dual-Enrollment College Course: Grade + 1.00
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981; font-weight: 700;">Step 3: Semester GPA Formula</strong>
                <div style="color: #10b981; margin-top: 0.25rem;">
                  Semester GPA = &Sigma; (Quality Points) / &Sigma; (Attempted Credit Hours)
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #8b5cf6;">Step 4: Cumulative GPA Compounding Formula</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  Cumulative GPA = [ (Prior GPA &times; Prior Credits) + New Quality Points ] / (Prior Credits + New Credits)
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Academic Pitfalls & GPA Traps -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Academic Pitfalls & GPA Calculation Traps</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Credit Hour Weighting Trap:</strong> A 4.0 in a 1-credit elective (e.g. Physical Education or Choir) generates only 4.0 quality points, whereas a 2.0 (C) in a 4-credit Organic Chemistry or Engineering Physics lecture/lab generates 8.0 quality points across 4 credits. High-credit STEM courses exert <strong>300% to 400% more gravitational pull</strong> on your final transcript GPA than 1-credit courses.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Institutional Retake / Forgiveness Myth:</strong> While your university registrar may replace an F with a B on your internal diploma transcript, professional graduate admissions boards (such as AMCAS for US medical schools or LSAC for law schools) <strong>re-calculate GPA by counting every single grade attempt</strong>, completely nullifying institutional grade forgiveness.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The High School Weighted Inflation Mirage:</strong> High school weighted GPAs often reach 4.5 to 5.0+ due to local bonus policies. Highly selective universities (Ivy League, Stanford, MIT) strip out high school weighting entirely during the holistic review phase, re-calculating all applicant GPAs on an unweighted, rigorous 4.0 academic core scale.</li>
            </ul>
          </div>
        </div>

        <script>
          function addGpaRow() {
            var tbody = document.getElementById('gpaRows');
            var tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--border)';
            tr.innerHTML = 
              '<td style="padding: 0.5rem;"><input type="text" placeholder="Course Name" class="text-input" style="padding: 0.4rem;" /></td>' +
              '<td style="padding: 0.5rem;">' +
                '<select class="text-input grade-select" onchange="calcGpa()" style="padding: 0.4rem;">' +
                  '<option value="4.0" selected>A (4.0)</option>' +
                  '<option value="3.7">A- (3.7)</option>' +
                  '<option value="3.3">B+ (3.3)</option>' +
                  '<option value="3.0">B (3.0)</option>' +
                  '<option value="2.7">B- (2.7)</option>' +
                  '<option value="2.3">C+ (2.3)</option>' +
                  '<option value="2.0">C (2.0)</option>' +
                  '<option value="1.7">C- (1.7)</option>' +
                  '<option value="1.0">D (1.0)</option>' +
                  '<option value="0.0">F (0.0)</option>' +
                '</select>' +
              '</td>' +
              '<td style="padding: 0.5rem;"><input type="number" value="3" min="0.5" step="0.5" class="text-input credit-input" oninput="calcGpa()" style="padding: 0.4rem; width: 60px;" /></td>' +
              '<td style="padding: 0.5rem;">' +
                '<select class="text-input weight-select" onchange="calcGpa()" style="padding: 0.4rem;">' +
                  '<option value="0" selected>Standard (Regular)</option>' +
                  '<option value="0.5">Honors (+0.5)</option>' +
                  '<option value="1.0">AP / IB / College (+1.0)</option>' +
                '</select>' +
              '</td>' +
              '<td style="padding: 0.5rem;"><button onclick="removeGpaRow(this)" style="background:none; border:none; color:var(--text-muted); cursor:pointer;">✕</button></td>';
            tbody.appendChild(tr);
            calcGpa();
          }

          function removeGpaRow(btn) {
            var row = btn.closest('tr');
            if (document.querySelectorAll('#gpaRows tr').length > 1) {
              row.remove();
              calcGpa();
            }
          }

          function calcGpa() {
            var rows = document.querySelectorAll('#gpaRows tr');
            var totalCreds = 0;
            var unweightedPoints = 0;
            var weightedPoints = 0;

            rows.forEach(function(r) {
              var g = parseFloat(r.querySelector('.grade-select').value) || 0;
              var c = parseFloat(r.querySelector('.credit-input').value) || 0;
              var w = parseFloat(r.querySelector('.weight-select').value) || 0;
              if (c > 0) {
                totalCreds += c;
                unweightedPoints += (g * c);
                var weightedGrade = g > 0 ? (g + w) : 0;
                weightedPoints += (weightedGrade * c);
              }
            });

            var unweightedGpa = totalCreds > 0 ? (unweightedPoints / totalCreds) : 0;
            var weightedGpa = totalCreds > 0 ? (weightedPoints / totalCreds) : 0;

            document.getElementById('unweightedGpa').textContent = unweightedGpa.toFixed(2);
            document.getElementById('weightedGpa').textContent = weightedGpa.toFixed(2);
            document.getElementById('totalCredits').textContent = totalCreds.toFixed(1);
            document.getElementById('totalPoints').textContent = weightedPoints.toFixed(1) + ' Quality Points';

            var priorGpa = parseFloat(document.getElementById('priorGpa').value);
            var priorCreds = parseFloat(document.getElementById('priorCredits').value);
            if (!isNaN(priorGpa) && !isNaN(priorCreds) && priorCreds > 0) {
              var newTotalCreds = priorCreds + totalCreds;
              var newCumulGpa = ((priorGpa * priorCreds) + unweightedPoints) / newTotalCreds;
              document.getElementById('cumulResult').textContent = 'Updated Cumulative GPA: ' + newCumulGpa.toFixed(2) + ' across ' + newTotalCreds.toFixed(1) + ' total credits';
            } else {
              document.getElementById('cumulResult').textContent = '';
            }
          }

          window.copyGPASummary = function() {
            var unweighted = document.getElementById('unweightedGpa').textContent;
            var weighted = document.getElementById('weightedGpa').textContent;
            var credits = document.getElementById('totalCredits').textContent;
            var points = document.getElementById('totalPoints').textContent;
            var cumul = document.getElementById('cumulResult').textContent;

            var rows = document.querySelectorAll('#gpaRows tr');
            var courseLines = [];
            rows.forEach(function(r) {
              var name = r.querySelector('input[type="text"]').value || 'Course';
              var gradeSel = r.querySelector('.grade-select');
              var gradeText = gradeSel.options[gradeSel.selectedIndex].text;
              var creds = r.querySelector('.credit-input').value;
              var weightSel = r.querySelector('.weight-select');
              var weightText = weightSel.options[weightSel.selectedIndex].text;
              courseLines.push('  • ' + name + ': ' + gradeText + ' (' + creds + ' cr, ' + weightText + ')');
            });

            var text = [
              '=== OFFICIAL GPA TRANSCRIPT BREAKDOWN ===',
              'Semester Unweighted GPA (4.0 Max): ' + unweighted,
              'Semester Weighted GPA (Honors/AP): ' + weighted,
              'Total Attempted Credits: ' + credits,
              'Cumulative Quality Points: ' + points,
              cumul ? (cumul) : '',
              '-----------------------------------------',
              'Course Itemization:',
              courseLines.join('\\n'),
              '-----------------------------------------',
              'Standard: AACRAO Collegiate Grading Guidelines',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/gpa-calculator'
            ].filter(Boolean).join('\\n');

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyGPA');
              if (btn) {
                var old = btn.innerHTML;
                btn.innerHTML = '✓ Copied GPA Breakdown!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', calcGpa);
          calcGpa();
        </script>
      `
    },
    {
      slug: 'fraction-to-decimal',
      title: 'Fraction to Decimal Converter (with Inches & Tape Measure)',
      metaDesc: 'Convert fractions to decimals instantly. Includes mixed numbers, repeating decimals, percentage conversion, and imperial tape measure chart.',
      category: 'Math & Units',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Fraction to Decimal
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Fraction to Decimal Converter</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Convert proper fractions, improper fractions, and mixed numbers into exact decimals, percentages, and tape measure equivalents.
          </p>

          <div class="tool-box">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div class="field-group">
                <label class="field-label">Whole Number (Optional)</label>
                <input type="number" id="f2d-whole" class="code-input" placeholder="e.g. 2" oninput="calcF2D()" />
              </div>
              <div class="field-group">
                <label class="field-label">Numerator (Top)</label>
                <input type="number" id="f2d-num" class="code-input" value="3" oninput="calcF2D()" />
              </div>
              <div class="field-group">
                <label class="field-label">Denominator (Bottom)</label>
                <input type="number" id="f2d-den" class="code-input" value="8" min="1" oninput="calcF2D()" />
              </div>
            </div>

            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 1rem;">
              <span style="font-size: 0.8rem; color: var(--text-muted); width: 100%;">Popular Fraction Presets:</span>
              <button type="button" class="btn-sec" onclick="setF2D(0, 1, 2)">1/2</button>
              <button type="button" class="btn-sec" onclick="setF2D(0, 1, 3)">1/3</button>
              <button type="button" class="btn-sec" onclick="setF2D(0, 1, 4)">1/4</button>
              <button type="button" class="btn-sec" onclick="setF2D(0, 3, 4)">3/4</button>
              <button type="button" class="btn-sec" onclick="setF2D(0, 3, 8)">3/8</button>
              <button type="button" class="btn-sec" onclick="setF2D(0, 5, 8)">5/8</button>
              <button type="button" class="btn-sec" onclick="setF2D(0, 7, 16)">7/16</button>
            </div>

            <div class="result-card" style="margin-top: 1.5rem;">
              <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Decimal Equivalent</div>
              <div id="f2d-dec" class="result-val">0.375</div>
              <div id="f2d-details" style="font-size: 0.95rem; color: var(--text-muted); font-family: var(--mono); margin-top: 0.5rem;">37.5% | Formula: 3 ÷ 8 = 0.375</div>
            </div>
          </div>

          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1rem;">Standard Imperial Tape Measure Chart (16ths & 32nds)</h3>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                <thead>
                  <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                    <th style="padding: 0.5rem 0.75rem;">Fraction</th>
                    <th style="padding: 0.5rem 0.75rem;">Decimal</th>
                    <th style="padding: 0.5rem 0.75rem;">Millimeters (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">1/16 in</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">0.0625</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">1.5875 mm</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">1/8 in</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">0.125</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">3.1750 mm</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">3/16 in</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">0.1875</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">4.7625 mm</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">1/4 in</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">0.25</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">6.3500 mm</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">5/16 in</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">0.3125</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">7.9375 mm</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">3/8 in</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">0.375</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">9.5250 mm</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">1/2 in</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">0.50</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">12.700 mm</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">5/8 in</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">0.625</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">15.875 mm</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">3/4 in</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">0.75</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">19.050 mm</td></tr>
                  <tr><td style="padding: 0.4rem 0.75rem; font-weight: bold;">7/8 in</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">0.875</td><td style="padding: 0.4rem 0.75rem; font-family: var(--mono);">22.225 mm</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <script>
          function calcF2D() {
            var w = parseFloat(document.getElementById('f2d-whole').value) || 0;
            var num = parseFloat(document.getElementById('f2d-num').value) || 0;
            var den = parseFloat(document.getElementById('f2d-den').value) || 1;
            if (den === 0) den = 1;

            var dec = w >= 0 ? (w + (num / den)) : (w - (num / den));
            var pct = (dec * 100).toFixed(2);

            document.getElementById('f2d-dec').textContent = parseFloat(dec.toFixed(8)).toString();
            document.getElementById('f2d-details').textContent = pct + '% | Formula: (' + (w ? w + ' + ' : '') + num + ' ÷ ' + den + ') = ' + parseFloat(dec.toFixed(8));
          }

          window.setF2D = function(w, n, d) {
            document.getElementById('f2d-whole').value = w || '';
            document.getElementById('f2d-num').value = n;
            document.getElementById('f2d-den').value = d;
            calcF2D();
          };

          document.addEventListener('DOMContentLoaded', calcF2D);
          calcF2D();
        </script>
      `
    },
    {
      slug: 'decimal-to-fraction',
      title: 'Decimal to Fraction Converter (Simplified & Mixed Numbers)',
      metaDesc: 'Convert any decimal to an exact reduced fraction or mixed number. Automatically find nearest tape measure fraction (16ths, 32nds, 64ths).',
      category: 'Math & Units',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Decimal to Fraction
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Decimal to Fraction Converter</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Convert terminating or repeating decimals into fully simplified fractions, mixed numbers, and nearest construction tape measure inches.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Decimal Value</label>
              <input type="number" id="d2f-in" class="code-input" value="0.625" step="0.001" oninput="calcD2F()" style="font-size: 1.25rem;" />
            </div>

            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 1rem;">
              <span style="font-size: 0.8rem; color: var(--text-muted); width: 100%;">Sample Decimals:</span>
              <button type="button" class="btn-sec" onclick="setD2F('0.125')">0.125 (1/8)</button>
              <button type="button" class="btn-sec" onclick="setD2F('0.375')">0.375 (3/8)</button>
              <button type="button" class="btn-sec" onclick="setD2F('0.625')">0.625 (5/8)</button>
              <button type="button" class="btn-sec" onclick="setD2F('0.875')">0.875 (7/8)</button>
              <button type="button" class="btn-sec" onclick="setD2F('2.5')">2.5 (2 1/2)</button>
            </div>

            <div class="result-card" style="margin-top: 1.5rem;">
              <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Simplified Fraction</div>
              <div id="d2f-res" class="result-val">5/8</div>
              <div id="d2f-mixed" style="font-size: 1rem; color: var(--fg); font-family: var(--mono); margin-top: 0.4rem;"></div>
              <div id="d2f-tape" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono); margin-top: 0.5rem;"></div>
            </div>
          </div>
        </div>

        <script>
          function gcd(a, b) {
            a = Math.abs(a);
            b = Math.abs(b);
            while (b) { var t = b; b = a % b; a = t; }
            return a;
          }

          function calcD2F() {
            var val = parseFloat(document.getElementById('d2f-in').value);
            if (isNaN(val)) {
              document.getElementById('d2f-res').textContent = '-';
              return;
            }

            var sign = val < 0 ? -1 : 1;
            val = Math.abs(val);

            var whole = Math.floor(val);
            var fracPart = val - whole;

            // Find denominator based on decimal places (up to 6 places)
            var str = fracPart.toFixed(6).replace(/0+$/, '');
            var decPlaces = (str.split('.')[1] || '').length;
            var den = Math.pow(10, Math.min(decPlaces, 6));
            var num = Math.round(fracPart * den);

            var g = gcd(num, den);
            var simpNum = num / g;
            var simpDen = den / g;

            var totalNum = (whole * simpDen + simpNum) * sign;

            var resStr = simpNum === 0 ? whole.toString() : (simpDen === 1 ? totalNum.toString() : (totalNum + '/' + simpDen));
            document.getElementById('d2f-res').textContent = resStr;

            if (whole > 0 && simpNum > 0) {
              document.getElementById('d2f-mixed').textContent = 'Mixed Number: ' + (sign < 0 ? '-' : '') + whole + ' ' + simpNum + '/' + simpDen;
            } else {
              document.getElementById('d2f-mixed').textContent = '';
            }

            // Nearest 16th and 32nd inch
            var sixteenths = Math.round(fracPart * 16);
            var g16 = gcd(sixteenths, 16);
            var tapeStr = (sixteenths / g16) + '/' + (16 / g16) + ' in';
            document.getElementById('d2f-tape').textContent = 'Nearest Tape Measure: ' + (whole > 0 ? whole + ' ' : '') + tapeStr + ' (within 1/16")';
          }

          window.setD2F = function(v) {
            document.getElementById('d2f-in').value = v;
            calcD2F();
          };

          document.addEventListener('DOMContentLoaded', calcD2F);
          calcD2F();
        </script>
      `
    },
    {
      slug: 'fraction-calculator',
      title: 'Fraction Calculator (Add, Subtract, Multiply, Divide & Mixed Numbers)',
      metaDesc: 'Add, subtract, multiply, and divide fractions and mixed numbers. Instant step-by-step solutions with LCD least common denominator, mixed number simplification, and one-click copy.',
      category: 'Math & Units',
      faq: [
        { q: 'How do you add or subtract fractions with different denominators?', a: 'Find the Least Common Denominator (LCD) of the fractions by calculating the Least Common Multiple (LCM) of the denominators. Multiply the numerator and denominator of each fraction by the factor needed to reach the LCD, add or subtract the adjusted numerators while keeping the common denominator, and simplify the final fraction using the Greatest Common Divisor (GCD).' },
        { q: 'What is the Keep-Change-Flip rule for dividing fractions?', a: 'To divide two fractions (A/B ÷ C/D), keep the first fraction (A/B), change the division operator to multiplication (×), and flip the second fraction to its reciprocal (D/C). Then multiply straight across: (A × D) / (B × C), and reduce to lowest terms.' },
        { q: 'What is the difference between a proper fraction, improper fraction, and mixed number?', a: 'A proper fraction has a numerator smaller than its denominator (e.g., 3/4). An improper fraction has a numerator equal to or greater than its denominator (e.g., 7/4). A mixed number expresses an improper fraction as an integer combined with a proper fraction (e.g., 1 3/4).' },
        { q: 'Why can you not just add the numerators and denominators together directly?', a: 'Adding numerators and denominators directly (e.g., 1/2 + 1/3 = 2/5) is known as the "Freshman’s Dream" error. 2/5 (0.4) is smaller than 1/2 (0.5), which is impossible when adding two positive values. Adding top-and-bottom computes the mediant, which always falls strictly between the two fractions rather than calculating their combined sum (5/6 ≈ 0.833).' },
        { q: 'How do you convert a mixed number to an improper fraction?', a: 'Multiply the whole integer part by the denominator, add the numerator to that product, and place the resulting sum over the original denominator: W N/D = (W × D + N) / D. For example, 3 2/5 = (3 × 5 + 2) / 5 = 17/5.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Fraction Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Fraction Arithmetic Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Add, subtract, multiply, and divide two fractions or mixed numbers with full step-by-step LCD solutions, improper conversions, decimal approximations, and tape measure markings.
          </p>

          <div class="tool-box">
            <!-- Quick Presets -->
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              <span style="font-size: 0.78rem; color: var(--text-muted); width: 100%;">Popular Problems & Quick Presets:</span>
              <button type="button" class="btn-sec" onclick="setFracPreset(0, 1, 2, '+', 0, 3, 4)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">1/2 + 3/4</button>
              <button type="button" class="btn-sec" onclick="setFracPreset(2, 1, 3, '*', 1, 1, 2)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">2 1/3 &times; 1 1/2</button>
              <button type="button" class="btn-sec" onclick="setFracPreset(0, 5, 6, '-', 0, 2, 3)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">5/6 &minus; 2/3</button>
              <button type="button" class="btn-sec" onclick="setFracPreset(3, 3, 4, '/', 0, 1, 8)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">3 3/4 &divide; 1/8 (Carpentry)</button>
              <button type="button" class="btn-sec" onclick="setFracPreset(0, 7, 8, '-', 0, 5, 16)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">7/8 &minus; 5/16 (Machining)</button>
              <button type="button" class="btn-sec" onclick="setFracPreset(0, 1, 4, '+', 0, 1, 3)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">1/4 + 1/3 (Freshman Trap)</button>
            </div>

            <!-- Input Grid -->
            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center;">
              <!-- Fraction 1 -->
              <div style="background: var(--surface-alt); padding: 1.25rem; border-radius: 6px; border: 1px solid var(--border);">
                <div class="field-label">Fraction 1 (Mixed or Simple)</div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <div style="text-align: center;">
                    <span style="font-size: 0.68rem; color: var(--text-muted); font-family: var(--mono); display: block; margin-bottom: 0.2rem;">Whole</span>
                    <input type="number" id="fc-w1" class="code-input" placeholder="0" style="width: 70px; text-align: center; font-size: 1.15rem;" oninput="calcFracCalc()" />
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 0.35rem; align-items: center;">
                    <input type="number" id="fc-n1" class="code-input" value="1" style="width: 75px; text-align: center; font-size: 1.15rem;" oninput="calcFracCalc()" title="Numerator" />
                    <div style="width: 100%; height: 2px; background: var(--border);"></div>
                    <input type="number" id="fc-d1" class="code-input" value="2" min="1" style="width: 75px; text-align: center; font-size: 1.15rem;" oninput="calcFracCalc()" title="Denominator" />
                  </div>
                </div>
              </div>

              <!-- Operator Selector -->
              <div style="text-align: center;">
                <label class="field-label" style="margin-bottom: 0.3rem;">Operator</label>
                <select id="fc-op" class="code-input" style="font-size: 1.6rem; padding: 0.4rem 0.8rem; font-weight: bold; width: auto; text-align: center; cursor: pointer; border-color: #3b82f6;" onchange="calcFracCalc()">
                  <option value="+">&plus;</option>
                  <option value="-">&minus;</option>
                  <option value="*">&times;</option>
                  <option value="/">&divide;</option>
                </select>
              </div>

              <!-- Fraction 2 -->
              <div style="background: var(--surface-alt); padding: 1.25rem; border-radius: 6px; border: 1px solid var(--border);">
                <div class="field-label">Fraction 2 (Mixed or Simple)</div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <div style="text-align: center;">
                    <span style="font-size: 0.68rem; color: var(--text-muted); font-family: var(--mono); display: block; margin-bottom: 0.2rem;">Whole</span>
                    <input type="number" id="fc-w2" class="code-input" placeholder="0" style="width: 70px; text-align: center; font-size: 1.15rem;" oninput="calcFracCalc()" />
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 0.35rem; align-items: center;">
                    <input type="number" id="fc-n2" class="code-input" value="3" style="width: 75px; text-align: center; font-size: 1.15rem;" oninput="calcFracCalc()" title="Numerator" />
                    <div style="width: 100%; height: 2px; background: var(--border);"></div>
                    <input type="number" id="fc-d2" class="code-input" value="4" min="1" style="width: 75px; text-align: center; font-size: 1.15rem;" oninput="calcFracCalc()" title="Denominator" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Dynamic Result Card -->
            <div class="result-card" style="margin-top: 1.5rem; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;">Simplified Solution</div>
              <div id="fc-res" class="result-val" style="font-size: 2.8rem; margin: 0.4rem 0; color: #10b981;">1 1/4</div>
              <div id="fc-subtext" style="font-family: var(--mono); font-size: 1rem; color: var(--fg); margin-bottom: 0.75rem;">
                1/2 &plus; 3/4 = 1 1/4
              </div>

              <!-- Multi-representation metrics -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-top: 1rem; font-family: var(--mono); font-size: 0.85rem;">
                <div style="background: var(--surface); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.72rem;">Improper Fraction</div>
                  <div id="fc-improper" style="font-weight: bold; color: #3b82f6; font-size: 1.05rem; margin-top: 0.2rem;">5/4</div>
                </div>
                <div style="background: var(--surface); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.72rem;">Decimal Value</div>
                  <div id="fc-decimal" style="font-weight: bold; color: var(--fg); font-size: 1.05rem; margin-top: 0.2rem;">1.25</div>
                </div>
                <div style="background: var(--surface); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.72rem;">Percentage</div>
                  <div id="fc-percent" style="font-weight: bold; color: var(--fg); font-size: 1.05rem; margin-top: 0.2rem;">125%</div>
                </div>
                <div style="background: var(--surface); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.72rem;">Reciprocal (Inverse)</div>
                  <div id="fc-reciprocal" style="font-weight: bold; color: #8b5cf6; font-size: 1.05rem; margin-top: 0.2rem;">4/5 (0.8)</div>
                </div>
              </div>

              <!-- One-Click Copy Button -->
              <button type="button" id="btnCopyFrac" onclick="copyFractionSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
                📋 Copy Complete Fraction Solution & Work
              </button>
            </div>
          </div>

          <!-- Step-by-Step Worked Derivation Engine -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #10b981; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Algebraic Solution</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">LCD & Reduction Proof</span>
            </div>
            <div id="fc-steps-box" style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <!-- Dynamic worked steps populated by calcFracCalc() -->
            </div>
          </div>

          <!-- Master Reference Table: Imperial 16th Fractions to Decimals & Metric -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.5rem 0; color: var(--fg);">📏 Imperial Tape Measure & Workshop Fraction Chart</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              Exact decimal equivalents and millimeter conversions for standard 16th-inch increments used in carpentry, machining, and cooking:
            </p>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; text-align: left;">
                <thead>
                  <tr style="background: var(--surface-alt); border-bottom: 1px solid var(--border);">
                    <th style="padding: 0.5rem 0.75rem;">Fraction</th>
                    <th style="padding: 0.5rem 0.75rem;">Decimal (in)</th>
                    <th style="padding: 0.5rem 0.75rem;">Metric (mm)</th>
                    <th style="padding: 0.5rem 0.75rem;">Percent (%)</th>
                    <th style="padding: 0.5rem 0.75rem;">Workshop Benchmark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">1/16"</td><td style="padding: 0.45rem 0.75rem;">0.0625"</td><td style="padding: 0.45rem 0.75rem;">1.588 mm</td><td style="padding: 0.45rem 0.75rem;">6.25%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Sheet steel gauge tolerance</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">1/8"</td><td style="padding: 0.45rem 0.75rem;">0.1250"</td><td style="padding: 0.45rem 0.75rem;">3.175 mm</td><td style="padding: 0.45rem 0.75rem;">12.50%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Hardboard / Table saw blade kerf</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">3/16"</td><td style="padding: 0.45rem 0.75rem;">0.1875"</td><td style="padding: 0.45rem 0.75rem;">4.763 mm</td><td style="padding: 0.45rem 0.75rem;">18.75%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Masonry screw pilot hole</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">1/4"</td><td style="padding: 0.45rem 0.75rem;">0.2500"</td><td style="padding: 0.45rem 0.75rem;">6.350 mm</td><td style="padding: 0.45rem 0.75rem;">25.00%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Standard plywood / 1/4 cup</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">5/16"</td><td style="padding: 0.45rem 0.75rem;">0.3125"</td><td style="padding: 0.45rem 0.75rem;">7.938 mm</td><td style="padding: 0.45rem 0.75rem;">31.25%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Lag bolt diameter</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">3/8"</td><td style="padding: 0.45rem 0.75rem;">0.3750"</td><td style="padding: 0.45rem 0.75rem;">9.525 mm</td><td style="padding: 0.45rem 0.75rem;">37.50%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Ratchet drive / Drywall sheathing</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">7/16"</td><td style="padding: 0.45rem 0.75rem;">0.4375"</td><td style="padding: 0.45rem 0.75rem;">11.113 mm</td><td style="padding: 0.45rem 0.75rem;">43.75%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">OSB roof sheathing</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">1/2"</td><td style="padding: 0.45rem 0.75rem;">0.5000"</td><td style="padding: 0.45rem 0.75rem;">12.700 mm</td><td style="padding: 0.45rem 0.75rem;">50.00%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Standard wall drywall / 1/2 cup</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">9/16"</td><td style="padding: 0.45rem 0.75rem;">0.5625"</td><td style="padding: 0.45rem 0.75rem;">14.288 mm</td><td style="padding: 0.45rem 0.75rem;">56.25%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Spark plug hex socket</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">5/8"</td><td style="padding: 0.45rem 0.75rem;">0.6250"</td><td style="padding: 0.45rem 0.75rem;">15.875 mm</td><td style="padding: 0.45rem 0.75rem;">62.50%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Type X fire-rated drywall</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">11/16"</td><td style="padding: 0.45rem 0.75rem;">0.6875"</td><td style="padding: 0.45rem 0.75rem;">17.463 mm</td><td style="padding: 0.45rem 0.75rem;">68.75%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Hardwood flooring tongue</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">3/4"</td><td style="padding: 0.45rem 0.75rem;">0.7500"</td><td style="padding: 0.45rem 0.75rem;">19.050 mm</td><td style="padding: 0.45rem 0.75rem;">75.00%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Subflooring / Cabinet carcase</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">13/16"</td><td style="padding: 0.45rem 0.75rem;">0.8125"</td><td style="padding: 0.45rem 0.75rem;">20.638 mm</td><td style="padding: 0.45rem 0.75rem;">81.25%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Rough sawn 4/4 lumber surfaced</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">7/8"</td><td style="padding: 0.45rem 0.75rem;">0.8750"</td><td style="padding: 0.45rem 0.75rem;">22.225 mm</td><td style="padding: 0.45rem 0.75rem;">87.50%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Heavy structural steel bolt</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">15/16"</td><td style="padding: 0.45rem 0.75rem;">0.9375"</td><td style="padding: 0.45rem 0.75rem;">23.813 mm</td><td style="padding: 0.45rem 0.75rem;">93.75%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Plumbing union coupling</td></tr>
                  <tr><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">1"</td><td style="padding: 0.45rem 0.75rem;">1.0000"</td><td style="padding: 0.45rem 0.75rem;">25.400 mm</td><td style="padding: 0.45rem 0.75rem;">100.00%</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Full imperial base unit</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 3 Fraction Traps & Historical Gotchas -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem; color: var(--fg);">⚠️ 3 Critical Fraction Pitfalls & Common Mistakes</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); border-left: 3px solid #ef4444;">
                <strong style="color: #ef4444; font-size: 0.95rem;">1. The Freshman's Dream: Adding Numerators and Denominators Directly</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.35rem 0 0 0; line-height: 1.5;">
                  A frequent elementary mistake is writing <code style="color: var(--fg); font-family: var(--mono);">1/2 + 1/3 = 2/5</code>. Notice that 2/5 = 0.4, which is <em>smaller</em> than the 1/2 (0.5) you started with! In mathematics, <code style="color: var(--fg); font-family: var(--mono);">(a+c)/(b+d)</code> is known as the <strong>mediant</strong>—a weighted average that always lies strictly <em>between</em> the two values. To calculate the combined sum, denominators MUST be unified through the Least Common Denominator: <code style="color: var(--fg); font-family: var(--mono);">3/6 + 2/6 = 5/6 &approx; 0.833</code>.
                </p>
              </div>

              <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); border-left: 3px solid #f59e0b;">
                <strong style="color: #f59e0b; font-size: 0.95rem;">2. Division by Zero & Reciprocal Singularities</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.35rem 0 0 0; line-height: 1.5;">
                  Fractions represent division: <code style="color: var(--fg); font-family: var(--mono);">N / D</code>. Setting <code style="color: var(--fg); font-family: var(--mono);">D = 0</code> yields an undefined mathematical singularity because no real number multiplied by 0 can recreate N. Furthermore, when dividing by a fraction with a numerator of zero (<code style="color: var(--fg); font-family: var(--mono);">&divide; 0/D</code>), the Keep-Change-Flip rule attempts to multiply by its reciprocal <code style="color: var(--fg); font-family: var(--mono);">D/0</code>, immediately causing an illegal division by zero.
                </p>
              </div>

              <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); border-left: 3px solid #3b82f6;">
                <strong style="color: #3b82f6; font-size: 0.95rem;">3. Floating-Point Binary Imprecision vs Exact Rational Arithmetic</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.35rem 0 0 0; line-height: 1.5;">
                  In standard computer hardware (IEEE 754 double precision), fractions like 1/3 or 1/10 cannot be represented with finite binary bits. Evaluating <code style="color: var(--fg); font-family: var(--mono);">1/3 + 1/3 + 1/3</code> in raw floating-point code produces <code style="color: var(--fg); font-family: var(--mono);">0.9999999999999999</code> instead of <code style="color: var(--fg); font-family: var(--mono);">1.0</code>. Digital Tools Shed performs exact rational integer arithmetic behind the scenes, ensuring 100% precision with zero accumulated rounding error.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          function gcdFrac(a, b) {
            a = Math.abs(a);
            b = Math.abs(b);
            while (b) { var t = b; b = a % b; a = t; }
            return a;
          }

          function lcmFrac(a, b) {
            if (a === 0 || b === 0) return 0;
            return Math.abs(a * b) / gcdFrac(a, b);
          }

          window.setFracPreset = function(w1, n1, d1, op, w2, n2, d2) {
            document.getElementById('fc-w1').value = w1 || '';
            document.getElementById('fc-n1').value = n1;
            document.getElementById('fc-d1').value = d1;
            document.getElementById('fc-op').value = op;
            document.getElementById('fc-w2').value = w2 || '';
            document.getElementById('fc-n2').value = n2;
            document.getElementById('fc-d2').value = d2;
            calcFracCalc();
          };

          function calcFracCalc() {
            var rawW1 = parseFloat(document.getElementById('fc-w1').value) || 0;
            var rawN1 = parseFloat(document.getElementById('fc-n1').value) || 0;
            var rawD1 = parseFloat(document.getElementById('fc-d1').value) || 1;

            var rawW2 = parseFloat(document.getElementById('fc-w2').value) || 0;
            var rawN2 = parseFloat(document.getElementById('fc-n2').value) || 0;
            var rawD2 = parseFloat(document.getElementById('fc-d2').value) || 1;

            var op = document.getElementById('fc-op').value;

            if (rawD1 === 0 || rawD2 === 0) {
              document.getElementById('fc-res').textContent = 'Undefined';
              document.getElementById('fc-res').style.color = '#ef4444';
              document.getElementById('fc-subtext').textContent = 'Denominator cannot be zero';
              document.getElementById('fc-steps-box').innerHTML = '<div style="color: #ef4444;">Error: Denominator is 0. Division by zero is undefined.</div>';
              return;
            }

            // Convert to improper fractions
            var top1 = (Math.abs(rawW1) * rawD1) + rawN1;
            if (rawW1 < 0) top1 = -top1;
            var d1 = rawD1;

            var top2 = (Math.abs(rawW2) * rawD2) + rawN2;
            if (rawW2 < 0) top2 = -top2;
            var d2 = rawD2;

            var resNum = 0, resDen = 1;
            var stepHtml = '';

            // Step 1: Improper Fractions
            var f1Str = (rawW1 ? rawW1 + ' ' : '') + rawN1 + '/' + rawD1;
            var f2Str = (rawW2 ? rawW2 + ' ' : '') + rawN2 + '/' + rawD2;
            stepHtml += '<div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">' +
              '<strong style="color: var(--fg);">Step 1: Convert to Improper Fractions</strong>' +
              '<div style="color: #3b82f6; margin-top: 0.25rem;">Fraction 1: ' + top1 + '/' + d1 + ' &bull; Fraction 2: ' + top2 + '/' + d2 + '</div>' +
              '</div>';

            // Step 2: Common Denominator & Calculation
            if (op === '+' || op === '-') {
              var lcd = lcmFrac(d1, d2);
              var m1 = lcd / d1;
              var m2 = lcd / d2;
              var scaledTop1 = top1 * m1;
              var scaledTop2 = top2 * m2;

              if (op === '+') {
                resNum = scaledTop1 + scaledTop2;
              } else {
                resNum = scaledTop1 - scaledTop2;
              }
              resDen = lcd;

              stepHtml += '<div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">' +
                '<strong style="color: var(--fg);">Step 2: Find Least Common Denominator (LCD)</strong>' +
                '<div style="color: #3b82f6; margin-top: 0.25rem;">LCD(' + d1 + ', ' + d2 + ') = <strong>' + lcd + '</strong></div>' +
                '<div style="margin-top: 0.25rem; color: var(--text-muted);">' +
                  'Fraction 1: (' + top1 + ' &times; ' + m1 + ') / (' + d1 + ' &times; ' + m1 + ') = ' + scaledTop1 + '/' + lcd + '<br>' +
                  'Fraction 2: (' + top2 + ' &times; ' + m2 + ') / (' + d2 + ' &times; ' + m2 + ') = ' + scaledTop2 + '/' + lcd +
                '</div>' +
                '</div>';

              stepHtml += '<div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">' +
                '<strong style="color: var(--fg);">Step 3: Perform Operation on Numerators</strong>' +
                '<div style="color: #3b82f6; margin-top: 0.25rem;">' + scaledTop1 + ' ' + (op === '+' ? '&plus;' : '&minus;') + ' ' + scaledTop2 + ' = <strong>' + resNum + '</strong> &rarr; ' + resNum + '/' + resDen + '</div>' +
                '</div>';
            } else if (op === '*') {
              resNum = top1 * top2;
              resDen = d1 * d2;

              stepHtml += '<div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">' +
                '<strong style="color: var(--fg);">Step 2: Multiply Numerators and Denominators Straight Across</strong>' +
                '<div style="color: #3b82f6; margin-top: 0.25rem;">' +
                  'Numerators: ' + top1 + ' &times; ' + top2 + ' = <strong>' + resNum + '</strong><br>' +
                  'Denominators: ' + d1 + ' &times; ' + d2 + ' = <strong>' + resDen + '</strong> &rarr; ' + resNum + '/' + resDen +
                '</div>' +
                '</div>';
            } else if (op === '/') {
              if (top2 === 0) {
                document.getElementById('fc-res').textContent = 'Undefined';
                document.getElementById('fc-res').style.color = '#ef4444';
                document.getElementById('fc-subtext').textContent = 'Division by zero is undefined';
                document.getElementById('fc-steps-box').innerHTML = '<div style="color: #ef4444;">Cannot divide by zero fraction (0/' + d2 + ').</div>';
                return;
              }
              resNum = top1 * d2;
              resDen = d1 * top2;

              stepHtml += '<div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">' +
                '<strong style="color: var(--fg);">Step 2: Keep, Change, Flip (Multiply by Reciprocal)</strong>' +
                '<div style="color: #3b82f6; margin-top: 0.25rem;">' +
                  '(' + top1 + '/' + d1 + ') &divide; (' + top2 + '/' + d2 + ') = (' + top1 + '/' + d1 + ') &times; (' + d2 + '/' + top2 + ')<br>' +
                  '= (' + top1 + ' &times; ' + d2 + ') / (' + d1 + ' &times; ' + top2 + ') = <strong>' + resNum + '/' + resDen + '</strong>' +
                '</div>' +
                '</div>';
            }

            if (resDen < 0) {
              resNum = -resNum;
              resDen = -resDen;
            }

            // Step 4: Reduce via GCD
            var g = gcdFrac(resNum, resDen);
            var redNum = resNum / g;
            var redDen = resDen / g;

            stepHtml += '<div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">' +
              '<strong style="color: var(--fg);">Step ' + (op === '+' || op === '-' ? '4' : '3') + ': Simplify with Greatest Common Divisor (GCD)</strong>' +
              '<div style="color: #3b82f6; margin-top: 0.25rem;">GCD(' + resNum + ', ' + resDen + ') = ' + g + ' &bull; (' + resNum + ' &divide; ' + g + ') / (' + resDen + ' &divide; ' + g + ') = <strong>' + redNum + '/' + redDen + '</strong></div>' +
              '</div>';

            // Step 5: Convert to Mixed
            var whole = Math.floor(Math.abs(redNum) / redDen);
            var rem = Math.abs(redNum) % redDen;
            var isNeg = redNum < 0;

            var mixedStr = '';
            if (rem === 0) {
              mixedStr = (isNeg ? '-' : '') + whole;
            } else if (whole === 0) {
              mixedStr = (isNeg ? '-' : '') + rem + '/' + redDen;
            } else {
              mixedStr = (isNeg ? '-' : '') + whole + ' ' + rem + '/' + redDen;
            }

            if (whole > 0 && rem > 0) {
              stepHtml += '<div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">' +
                '<strong style="color: var(--fg);">Step ' + (op === '+' || op === '-' ? '5' : '4') + ': Extract Whole Mixed Number</strong>' +
                '<div style="color: #10b981; margin-top: 0.25rem;">' + Math.abs(redNum) + ' &divide; ' + redDen + ' = <strong>' + whole + '</strong> with remainder <strong>' + rem + '</strong> &rarr; <strong>' + mixedStr + '</strong></div>' +
                '</div>';
            }

            // Render Results
            var resEl = document.getElementById('fc-res');
            resEl.textContent = mixedStr;
            resEl.style.color = '#10b981';

            var opSymbol = op === '+' ? '+' : (op === '-' ? '−' : (op === '*' ? '×' : '÷'));
            document.getElementById('fc-subtext').textContent = f1Str + ' ' + opSymbol + ' ' + f2Str + ' = ' + mixedStr;

            document.getElementById('fc-improper').textContent = redNum + '/' + redDen;
            var decVal = redNum / redDen;
            document.getElementById('fc-decimal').textContent = Number.isInteger(decVal) ? decVal.toString() : decVal.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
            document.getElementById('fc-percent').textContent = (decVal * 100).toFixed(2).replace(/\.00$/, '') + '%';

            if (redNum !== 0) {
              var recipNum = redDen;
              var recipDen = redNum;
              if (recipDen < 0) { recipNum = -recipNum; recipDen = -recipDen; }
              var recipDec = (recipNum / recipDen).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
              document.getElementById('fc-reciprocal').textContent = recipNum + '/' + recipDen + ' (' + recipDec + ')';
            } else {
              document.getElementById('fc-reciprocal').textContent = 'Undefined (0 has no inverse)';
            }

            document.getElementById('fc-steps-box').innerHTML = stepHtml;
          }

          window.copyFractionSummary = function() {
            var btn = document.getElementById('btnCopyFrac');
            var res = document.getElementById('fc-res').textContent;
            var eq = document.getElementById('fc-subtext').textContent;
            var improper = document.getElementById('fc-improper').textContent;
            var dec = document.getElementById('fc-decimal').textContent;
            var pct = document.getElementById('fc-percent').textContent;
            var recip = document.getElementById('fc-reciprocal').textContent;

            var text = '--- Fraction Calculation Report ---\n' +
              'Equation: ' + eq + '\n' +
              'Simplified Result: ' + res + '\n' +
              'Improper Fraction: ' + improper + '\n' +
              'Decimal Value: ' + dec + '\n' +
              'Percentage: ' + pct + '\n' +
              'Reciprocal: ' + recip + '\n' +
              'Calculated on Digital Tools Shed (https://digitaltoolsshed.com/math/fraction-calculator)';

            navigator.clipboard.writeText(text).then(function() {
              btn.textContent = '✓ Fraction Solution Copied!';
              btn.style.borderColor = '#10b981';
              btn.style.color = '#10b981';
              setTimeout(function() {
                btn.textContent = '📋 Copy Complete Fraction Solution & Work';
                btn.style.borderColor = 'var(--border)';
                btn.style.color = 'var(--fg)';
              }, 2500);
            });
          };

          document.addEventListener('DOMContentLoaded', calcFracCalc);
          calcFracCalc();
        </script>
      `
    },
    {
      slug: 'aspect-ratio-calculator',
      title: 'Aspect Ratio Calculator & Resolution Scaler (16:9, 9:16, 4:3 & Ultrawide)',
      metaDesc: 'Calculate aspect ratios, scale video resolutions, and calculate display PPI. Presets for 16:9 (YouTube), 9:16 (TikTok), 4:3, 1:1, and 21:9 ultrawide with live CSS visual preview.',
      category: 'Design & Media',
      faq: [
        { q: 'How do you calculate the aspect ratio from pixel width and height?', a: 'Find the Greatest Common Divisor (GCD) of width and height using the Euclidean algorithm, then divide both dimensions by that GCD. For example, for 1920 × 1080, GCD(1920, 1080) = 120. 1920 ÷ 120 = 16 and 1080 ÷ 120 = 9, yielding a 16:9 ratio.' },
        { q: 'What is the difference between DAR, PAR, and SAR?', a: 'Storage Aspect Ratio (SAR) is the horizontal to vertical pixel count stored in the file (e.g. 720×480). Pixel Aspect Ratio (PAR) is the physical rectangular shape of individual pixels (square 1:1 in modern LCDs, but non-square in legacy DVDs). Display Aspect Ratio (DAR) is the actual geometric image shape rendered on screen (DAR = SAR × PAR).' },
        { q: 'What is the difference between 16:9 and 9:16?', a: '16:9 is landscape widescreen orientation (1.778:1) standard for HDTV, YouTube desktop, television broadcasts, and computer monitors (e.g. 1920×1080). 9:16 is vertical portrait orientation (0.562:1) standard for mobile smartphones, TikTok, Instagram Reels, and YouTube Shorts (e.g. 1080×1920).' },
        { q: 'Why are 21:9 ultrawide monitors actually 64:27?', a: '21:9 is a consumer marketing simplification. True 21 ÷ 9 is 2.333:1. However, standard ultrawide monitors have resolutions like 2560×1080 or 3440×1440. Reducing these reveals an exact mathematical aspect ratio of 64:27 (2.370:1), matching the ITU-R BT.709 cinema expansion ratio.' },
        { q: 'How do you calculate display PPI (Pixels Per Inch) from diagonal screen size?', a: 'Using the Pythagorean theorem: d_pixels = √(width² + height²), then divide by diagonal screen inches: PPI = d_pixels / diagonal inches. For example, a 27-inch 2560×1440 monitor has 2937.2 ÷ 27 = 108.8 PPI.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Aspect Ratio Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Aspect Ratio Calculator & Resolution Scaler</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Find aspect ratios from pixel dimensions, scale video and photography resolutions proportionally without distortion, and compute physical screen PPI density.
          </p>

          <div class="tool-box">
            <!-- Popular Presets -->
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              <span style="font-size: 0.78rem; color: var(--text-muted); width: 100%;">Popular Standards & Presets:</span>
              <button type="button" class="btn-sec" onclick="setRatioPreset(16, 9, 1920, 1080, '16:9 (HDTV / YouTube)')" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">16:9 (1080p Full HD)</button>
              <button type="button" class="btn-sec" onclick="setRatioPreset(9, 16, 1080, 1920, '9:16 (TikTok / Reels)')" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">9:16 (TikTok / Shorts)</button>
              <button type="button" class="btn-sec" onclick="setRatioPreset(4, 3, 1024, 768, '4:3 (Classic TV / iPad)')" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">4:3 (SD / iPad)</button>
              <button type="button" class="btn-sec" onclick="setRatioPreset(1, 1, 1080, 1080, '1:1 (Square Instagram)')" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">1:1 (Square)</button>
              <button type="button" class="btn-sec" onclick="setRatioPreset(64, 27, 2560, 1080, '21:9 / 64:27 (Ultrawide)')" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">21:9 (Ultrawide Monitor)</button>
              <button type="button" class="btn-sec" onclick="setRatioPreset(4, 5, 1080, 1350, '4:5 (Instagram Portrait)')" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">4:5 (IG Portrait)</button>
              <button type="button" class="btn-sec" onclick="setRatioPreset(3, 2, 1080, 720, '3:2 (35mm Photography)')" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">3:2 (DSLR / 35mm)</button>
              <button type="button" class="btn-sec" onclick="setRatioPreset(1920, 803, 1920, 803, '2.39:1 (CinemaScope)')" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">2.39:1 (CinemaScope)</button>
            </div>

            <!-- Inputs & Lock -->
            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center;">
              <div class="field-group" style="margin-bottom: 0;">
                <label class="field-label" for="ar-w">Width (Pixels)</label>
                <input type="number" id="ar-w" class="code-input" value="1920" min="1" oninput="onWidthChange()" style="font-size: 1.25rem;" />
              </div>

              <!-- Lock Ratio Button -->
              <div style="text-align: center; padding-top: 1.2rem;">
                <button type="button" id="btnLockRatio" onclick="toggleLock()" class="btn-sec" style="padding: 0.5rem 0.75rem; font-family: var(--mono); font-size: 0.8rem; display: flex; flex-direction: column; align-items: center; gap: 0.2rem; cursor: pointer; border-color: #3b82f6; color: #3b82f6;">
                  <span id="lock-icon" style="font-size: 1.2rem;">🔒</span>
                  <span id="lock-text" style="font-size: 0.68rem; font-weight: bold;">Locked</span>
                </button>
              </div>

              <div class="field-group" style="margin-bottom: 0;">
                <label class="field-label" for="ar-h">Height (Pixels)</label>
                <input type="number" id="ar-h" class="code-input" value="1080" min="1" oninput="onHeightChange()" style="font-size: 1.25rem;" />
              </div>
            </div>

            <!-- Live Visual Preview Box Container -->
            <div style="margin-top: 1.75rem; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--surface-alt); border: 1px dashed var(--border); border-radius: 8px; padding: 1.5rem; min-height: 220px;">
              <div style="font-family: var(--mono); font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem; letter-spacing: 0.05em;">
                Live Proportional Preview Frame
              </div>
              <div id="ar-preview-frame" style="max-width: 320px; max-height: 180px; width: 280px; height: 157.5px; background: rgba(59, 130, 246, 0.12); border: 2px solid #3b82f6; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 0.25s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 0.5rem; text-align: center;">
                <div id="preview-ratio-label" style="font-family: var(--mono); font-size: 1.15rem; font-weight: bold; color: #3b82f6;">16:9</div>
                <div id="preview-dim-label" style="font-family: var(--mono); font-size: 0.75rem; color: var(--fg); margin-top: 0.2rem;">1920 &times; 1080</div>
                <div id="preview-orient-badge" style="font-family: var(--mono); font-size: 0.65rem; color: var(--text-muted); background: var(--surface); padding: 0.15rem 0.4rem; border-radius: 3px; margin-top: 0.3rem; border: 1px solid var(--border);">Landscape</div>
              </div>
            </div>

            <!-- Results Card -->
            <div class="result-card" style="margin-top: 1.5rem; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;">Calculated Aspect Ratio</div>
              <div id="ar-res" class="result-val" style="font-size: 2.8rem; margin: 0.4rem 0; color: #3b82f6;">16:9</div>
              <div id="ar-factor" style="font-family: var(--mono); font-size: 1.05rem; color: var(--fg); margin-bottom: 0.75rem;">
                Decimal Factor: 1.778 : 1 (Landscape)
              </div>

              <!-- Multi-representation metrics -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-top: 1rem; font-family: var(--mono); font-size: 0.85rem;">
                <div style="background: var(--surface); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.72rem;">Total Pixels</div>
                  <div id="ar-pixels" style="font-weight: bold; color: var(--fg); font-size: 1rem; margin-top: 0.2rem;">2,073,600 px</div>
                </div>
                <div style="background: var(--surface); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.72rem;">Megapixels (MP)</div>
                  <div id="ar-mp" style="font-weight: bold; color: #10b981; font-size: 1rem; margin-top: 0.2rem;">2.07 MP</div>
                </div>
                <div style="background: var(--surface); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.72rem;">Inverse Ratio</div>
                  <div id="ar-inverse" style="font-weight: bold; color: #8b5cf6; font-size: 1rem; margin-top: 0.2rem;">9:16 (0.563:1)</div>
                </div>
                <div style="background: var(--surface); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.72rem;">Industry Category</div>
                  <div id="ar-cat" style="font-weight: bold; color: var(--fg); font-size: 1rem; margin-top: 0.2rem;">Standard HDTV</div>
                </div>
              </div>

              <!-- One-Click Copy Button -->
              <button type="button" id="btnCopyAR" onclick="copyARSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
                📋 Copy Aspect Ratio & Dimension Specs
              </button>
            </div>
          </div>

          <!-- Physical Screen Size & PPI Calculator -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">🖥️ Physical Display Dimensions & PPI Density</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Pythagorean Optics Engine</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              Enter your monitor, TV, or phone screen diagonal size to calculate true physical inches, centimeters, and pixel density (PPI):
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: center;">
              <div class="field-group" style="margin-bottom: 0;">
                <label class="field-label" for="ar-diag">Diagonal Screen Size (Inches)</label>
                <input type="number" id="ar-diag" class="code-input" value="27" step="0.1" min="1" oninput="calcPPI()" style="font-size: 1.15rem;" />
              </div>
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center;">
                <span style="font-size: 0.75rem; color: var(--text-muted); width: 100%;">Device Presets:</span>
                <button type="button" class="btn-sec" onclick="setDiagPreset(6.1)" style="font-size: 0.72rem; padding: 0.3rem 0.5rem;">6.1" Phone</button>
                <button type="button" class="btn-sec" onclick="setDiagPreset(13.3)" style="font-size: 0.72rem; padding: 0.3rem 0.5rem;">13.3" Laptop</button>
                <button type="button" class="btn-sec" onclick="setDiagPreset(15.6)" style="font-size: 0.72rem; padding: 0.3rem 0.5rem;">15.6" Laptop</button>
                <button type="button" class="btn-sec" onclick="setDiagPreset(24)" style="font-size: 0.72rem; padding: 0.3rem 0.5rem;">24" Monitor</button>
                <button type="button" class="btn-sec" onclick="setDiagPreset(27)" style="font-size: 0.72rem; padding: 0.3rem 0.5rem;">27" Monitor</button>
                <button type="button" class="btn-sec" onclick="setDiagPreset(34)" style="font-size: 0.72rem; padding: 0.3rem 0.5rem;">34" Ultrawide</button>
                <button type="button" class="btn-sec" onclick="setDiagPreset(55)" style="font-size: 0.72rem; padding: 0.3rem 0.5rem;">55" TV</button>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; margin-top: 1.25rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                <div style="color: var(--text-muted); font-size: 0.72rem;">Pixel Density</div>
                <div id="ppi-val" style="font-size: 1.25rem; font-weight: bold; color: #3b82f6; margin-top: 0.2rem;">81.6 PPI</div>
                <div id="ppi-badge" style="font-size: 0.68rem; color: var(--text-muted); margin-top: 0.2rem;">Standard Desktop</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                <div style="color: var(--text-muted); font-size: 0.72rem;">Physical Width</div>
                <div id="ppi-w" style="font-size: 1.1rem; font-weight: bold; color: var(--fg); margin-top: 0.2rem;">23.53 in</div>
                <div id="ppi-w-cm" style="font-size: 0.68rem; color: var(--text-muted); margin-top: 0.2rem;">59.77 cm</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                <div style="color: var(--text-muted); font-size: 0.72rem;">Physical Height</div>
                <div id="ppi-h" style="font-size: 1.1rem; font-weight: bold; color: var(--fg); margin-top: 0.2rem;">13.24 in</div>
                <div id="ppi-h-cm" style="font-size: 0.68rem; color: var(--text-muted); margin-top: 0.2rem;">33.62 cm</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                <div style="color: var(--text-muted); font-size: 0.72rem;">Screen Area</div>
                <div id="ppi-area" style="font-size: 1.1rem; font-weight: bold; color: var(--fg); margin-top: 0.2rem;">311.5 sq in</div>
                <div id="ppi-area-cm" style="font-size: 0.68rem; color: var(--text-muted); margin-top: 0.2rem;">2,009.7 cm&sup2;</div>
              </div>
            </div>
          </div>

          <!-- Standard Resolution Scaler Ladder Table -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.5rem 0; color: var(--fg);">🪜 Standard Industry Resolution Ladder</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              Common digital video, gaming, and broadcast dimensions dynamically matched to the active aspect ratio:
            </p>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; text-align: left;">
                <thead>
                  <tr style="background: var(--surface-alt); border-bottom: 1px solid var(--border);">
                    <th style="padding: 0.5rem 0.75rem;">Resolution Standard</th>
                    <th style="padding: 0.5rem 0.75rem;">Dimensions (W &times; H)</th>
                    <th style="padding: 0.5rem 0.75rem;">Total Pixels</th>
                    <th style="padding: 0.5rem 0.75rem;">Megapixels</th>
                    <th style="padding: 0.5rem 0.75rem;">Primary Use Case</th>
                  </tr>
                </thead>
                <tbody id="res-ladder-body">
                  <!-- Dynamically populated by updateLadder() -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- 3 Real-World Pitfalls -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem; color: var(--fg);">⚠️ 3 Common Video & Display Aspect Ratio Pitfalls</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); border-left: 3px solid #ef4444;">
                <strong style="color: #ef4444; font-size: 0.95rem;">1. Non-Square Pixels: The PAR vs DAR vs SAR Trap</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.35rem 0 0 0; line-height: 1.5;">
                  Modern screens have square pixels (Pixel Aspect Ratio 1:1). However, legacy DVD and broadcast video (like 720&times;480 NTSC) stored non-square rectangular pixels (PAR 0.912 for 4:3 or 1.212 for 16:9 anamorphic). If an editor assumes pixels are square, the raw 720&times;480 video appears squeezed at 3:2. Always distinguish between the Storage Aspect Ratio (720&times;480 = 3:2) and the rendered Display Aspect Ratio (16:9).
                </p>
              </div>

              <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); border-left: 3px solid #f59e0b;">
                <strong style="color: #f59e0b; font-size: 0.95rem;">2. Letterboxing vs Pillarboxing vs Center Cropping</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.35rem 0 0 0; line-height: 1.5;">
                  Fitting widescreen 16:9 video onto a 9:16 mobile screen requires a creative compromise: <strong>Pillarboxing/Letterboxing</strong> preserves 100% of the visual canvas by adding black bars at the top and bottom (shrinking content to 31.6% of screen area), whereas <strong>Center Cropping</strong> fills the phone screen completely but discards 68.4% of the original video canvas, cutting out flanking subjects.
                </p>
              </div>

              <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); border-left: 3px solid #3b82f6;">
                <strong style="color: #3b82f6; font-size: 0.95rem;">3. The Marketing Myth of "21:9" Ultrawide Monitors</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.35rem 0 0 0; line-height: 1.5;">
                  Display manufacturers advertise ultrawide gaming monitors as "21:9". But true 21 &divide; 9 is 2.333:1. Real ultrawide panels actually measure 2560&times;1080, 3440&times;1440, or 5120&times;2160. Reducing these dimensions by their GCD yields <strong>64:27</strong> (2.370:1)—which is noticeably wider than 21:9! The term "21:9" is solely a consumer marketing label designed to echo the familiar "16:9" nomenclature.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          function gcdAR(a, b) {
            a = Math.abs(a);
            b = Math.abs(b);
            while (b) { var t = b; b = a % b; a = t; }
            return a;
          }

          var isRatioLocked = true;
          var lockedRatio = 16 / 9;

          window.toggleLock = function() {
            isRatioLocked = !isRatioLocked;
            var btn = document.getElementById('btnLockRatio');
            var icon = document.getElementById('lock-icon');
            var text = document.getElementById('lock-text');
            if (isRatioLocked) {
              var w = parseInt(document.getElementById('ar-w').value, 10) || 1920;
              var h = parseInt(document.getElementById('ar-h').value, 10) || 1080;
              lockedRatio = w / h;
              btn.style.borderColor = '#3b82f6';
              btn.style.color = '#3b82f6';
              icon.textContent = '🔒';
              text.textContent = 'Locked';
            } else {
              btn.style.borderColor = 'var(--border)';
              btn.style.color = 'var(--text-muted)';
              icon.textContent = '🔓';
              text.textContent = 'Unlocked';
            }
          };

          window.setRatioPreset = function(rw, rh, defW, defH, label) {
            lockedRatio = rw / rh;
            isRatioLocked = true;
            document.getElementById('lock-icon').textContent = '🔒';
            document.getElementById('lock-text').textContent = 'Locked';
            document.getElementById('btnLockRatio').style.borderColor = '#3b82f6';
            document.getElementById('btnLockRatio').style.color = '#3b82f6';

            document.getElementById('ar-w').value = defW;
            document.getElementById('ar-h').value = defH;
            calcAR();
          };

          window.onWidthChange = function() {
            var w = parseInt(document.getElementById('ar-w').value, 10) || 1;
            if (isRatioLocked && lockedRatio > 0) {
              document.getElementById('ar-h').value = Math.max(1, Math.round(w / lockedRatio));
            } else {
              var h = parseInt(document.getElementById('ar-h').value, 10) || 1;
              lockedRatio = w / h;
            }
            calcAR();
          };

          window.onHeightChange = function() {
            var h = parseInt(document.getElementById('ar-h').value, 10) || 1;
            if (isRatioLocked && lockedRatio > 0) {
              document.getElementById('ar-w').value = Math.max(1, Math.round(h * lockedRatio));
            } else {
              var w = parseInt(document.getElementById('ar-w').value, 10) || 1;
              lockedRatio = w / h;
            }
            calcAR();
          };

          function calcAR() {
            var w = parseInt(document.getElementById('ar-w').value, 10) || 1920;
            var h = parseInt(document.getElementById('ar-h').value, 10) || 1080;

            var g = gcdAR(w, h);
            var rw = w / g;
            var rh = h / g;

            var ratioStr = rw + ':' + rh;
            document.getElementById('ar-res').textContent = ratioStr;

            var dec = (w / h).toFixed(3);
            var orient = w > h ? 'Landscape' : (w < h ? 'Portrait' : 'Square');
            document.getElementById('ar-factor').textContent = 'Decimal Factor: ' + dec + ' : 1 (' + orient + ')';

            var totalPx = w * h;
            document.getElementById('ar-pixels').textContent = totalPx.toLocaleString('en-US') + ' px';
            var mp = (totalPx / 1000000).toFixed(2);
            document.getElementById('ar-mp').textContent = mp + ' MP';

            var invDec = (h / w).toFixed(3);
            document.getElementById('ar-inverse').textContent = rh + ':' + rw + ' (' + invDec + ':1)';

            // Category classification
            var cat = 'Custom Ratio';
            if (rw === 16 && rh === 9) cat = 'Standard HDTV / YouTube';
            else if (rw === 9 && rh === 16) cat = 'Mobile Vertical Video';
            else if (rw === 4 && rh === 3) cat = 'Classic SD / iPad';
            else if (rw === 1 && rh === 1) cat = 'Square Feed';
            else if (rw === 64 && rh === 27) cat = 'Ultrawide 21:9 Monitor';
            else if (rw === 4 && rh === 5) cat = 'Instagram Portrait';
            else if (rw === 3 && rh === 2) cat = '35mm Film / Surface';
            document.getElementById('ar-cat').textContent = cat;

            // Live visual frame scaling
            var maxBoxW = 280;
            var maxBoxH = 160;
            var frameW = maxBoxW;
            var frameH = frameW * (h / w);
            if (frameH > maxBoxH) {
              frameH = maxBoxH;
              frameW = frameH * (w / h);
            }
            frameW = Math.max(40, Math.round(frameW));
            frameH = Math.max(40, Math.round(frameH));

            var frame = document.getElementById('ar-preview-frame');
            frame.style.width = frameW + 'px';
            frame.style.height = frameH + 'px';
            document.getElementById('preview-ratio-label').textContent = ratioStr;
            document.getElementById('preview-dim-label').innerHTML = w + ' &times; ' + h;
            document.getElementById('preview-orient-badge').textContent = orient;

            calcPPI();
            updateLadder(w / h);
          }

          window.setDiagPreset = function(diag) {
            document.getElementById('ar-diag').value = diag;
            calcPPI();
          };

          function calcPPI() {
            var w = parseInt(document.getElementById('ar-w').value, 10) || 1920;
            var h = parseInt(document.getElementById('ar-h').value, 10) || 1080;
            var diag = parseFloat(document.getElementById('ar-diag').value) || 27;

            var diagPx = Math.sqrt((w * w) + (h * h));
            var ppi = diagPx / diag;

            document.getElementById('ppi-val').textContent = ppi.toFixed(1) + ' PPI';

            var badge = 'Standard Desktop (90-110 PPI)';
            if (ppi < 90) badge = 'Low Density TV / Large Screen';
            else if (ppi >= 110 && ppi < 160) badge = 'Sharp QHD / 2K Display';
            else if (ppi >= 160 && ppi < 220) badge = 'Ultra-Sharp 4K UHD Desktop';
            else if (ppi >= 220 && ppi < 320) badge = 'High-DPI Retina Laptop';
            else if (ppi >= 320) badge = 'Ultra-High-DPI Mobile Retina';
            document.getElementById('ppi-badge').textContent = badge;

            // Physical width and height
            var angle = Math.atan(h / w);
            var physW = diag * Math.cos(angle);
            var physH = diag * Math.sin(angle);
            var physArea = physW * physH;

            document.getElementById('ppi-w').textContent = physW.toFixed(2) + ' in';
            document.getElementById('ppi-w-cm').textContent = (physW * 2.54).toFixed(2) + ' cm';

            document.getElementById('ppi-h').textContent = physH.toFixed(2) + ' in';
            document.getElementById('ppi-h-cm').textContent = (physH * 2.54).toFixed(2) + ' cm';

            document.getElementById('ppi-area').textContent = physArea.toFixed(1) + ' sq in';
            document.getElementById('ppi-area-cm').innerHTML = (physArea * 6.4516).toFixed(1) + ' cm&sup2;';
          }

          function updateLadder(ratio) {
            var tbody = document.getElementById('res-ladder-body');
            var heights = [360, 480, 720, 1080, 1440, 2160, 4320];
            var names = ['360p (Mobile SD)', '480p (DVD Quality)', '720p (HD Ready)', '1080p (Full HD)', '1440p (2K QHD)', '2160p (4K UHD)', '4320p (8K UHD)'];
            var html = '';

            for (var i = 0; i < heights.length; i++) {
              var ch = heights[i];
              var cw = Math.round(ch * ratio);
              // Ensure even numbers for video codecs
              if (cw % 2 !== 0) cw++;
              var px = cw * ch;
              var mp = (px / 1000000).toFixed(2);

              var isCurrent = (ch === parseInt(document.getElementById('ar-h').value, 10) && cw === parseInt(document.getElementById('ar-w').value, 10));
              var rowBg = isCurrent ? 'background: rgba(59, 130, 246, 0.1); font-weight: bold;' : 'border-bottom: 1px solid var(--border);';

              html += '<tr style="' + rowBg + '">' +
                '<td style="padding: 0.45rem 0.75rem; color: #3b82f6;">' + names[i] + '</td>' +
                '<td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">' + cw + ' &times; ' + ch + (isCurrent ? ' <span style="color:#10b981;">(Active)</span>' : '') + '</td>' +
                '<td style="padding: 0.45rem 0.75rem;">' + px.toLocaleString('en-US') + '</td>' +
                '<td style="padding: 0.45rem 0.75rem;">' + mp + ' MP</td>' +
                '<td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">' + (ch >= 2160 ? 'Master Broadcast / Cinema' : (ch >= 1080 ? 'Web Streaming / Gaming' : 'Legacy / Bandwidth Saver')) + '</td>' +
                '</tr>';
            }
            tbody.innerHTML = html;
          }

          window.copyARSummary = function() {
            var btn = document.getElementById('btnCopyAR');
            var w = document.getElementById('ar-w').value;
            var h = document.getElementById('ar-h').value;
            var ratio = document.getElementById('ar-res').textContent;
            var factor = document.getElementById('ar-factor').textContent;
            var px = document.getElementById('ar-pixels').textContent;
            var mp = document.getElementById('ar-mp').textContent;
            var ppi = document.getElementById('ppi-val').textContent;
            var diag = document.getElementById('ar-diag').value;
            var physW = document.getElementById('ppi-w').textContent;
            var physH = document.getElementById('ppi-h').textContent;

            var text = '--- Aspect Ratio & Resolution Report ---\n' +
              'Dimensions: ' + w + ' x ' + h + ' px\n' +
              'Aspect Ratio: ' + ratio + '\n' +
              factor + '\n' +
              'Total Pixels: ' + px + ' (' + mp + ')\n' +
              'Physical Display Size: ' + diag + '" (' + physW + ' x ' + physH + ')\n' +
              'Pixel Density: ' + ppi + '\n' +
              'Calculated on Digital Tools Shed (https://digitaltoolsshed.com/math/aspect-ratio-calculator)';

            navigator.clipboard.writeText(text).then(function() {
              btn.textContent = '✓ Specs Copied!';
              btn.style.borderColor = '#10b981';
              btn.style.color = '#10b981';
              setTimeout(function() {
                btn.textContent = '📋 Copy Aspect Ratio & Dimension Specs';
                btn.style.borderColor = 'var(--border)';
                btn.style.color = 'var(--fg)';
              }, 2500);
            });
          };

          document.addEventListener('DOMContentLoaded', calcAR);
          calcAR();
        </script>
      `
    },
    {
      slug: 'scientific-notation-converter',
      title: 'Scientific Notation Converter (Standard & Engineering E-Notation)',
      metaDesc: 'Convert scientific notation (1.23 × 10^6) to standard decimal numbers and E-notation. Includes order of magnitude and metric prefix steps.',
      category: 'Math & Science',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Scientific Notation Converter
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Scientific Notation Converter</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Convert between standard decimal numbers, scientific notation ($a \\times 10^b$), and engineering E-notation.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Enter Number (Decimal, Scientific, or E-Notation)</label>
              <input type="text" id="sn-in" class="code-input" value="4500000" oninput="calcSN()" style="font-size: 1.25rem;" />
            </div>

            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 1rem;">
              <span style="font-size: 0.8rem; color: var(--text-muted); width: 100%;">Sample Inputs:</span>
              <button type="button" class="btn-sec" onclick="setSN('4500000')">4,500,000</button>
              <button type="button" class="btn-sec" onclick="setSN('0.00028')">0.00028</button>
              <button type="button" class="btn-sec" onclick="setSN('3.0e8')">Speed of Light (3e8)</button>
              <button type="button" class="btn-sec" onclick="setSN('6.022e23')">Avogadro (6.022e23)</button>
            </div>

            <div class="result-card" style="margin-top: 1.5rem;">
              <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Scientific Notation</div>
              <div id="sn-sci" class="result-val">4.5 × 10⁶</div>
              <div id="sn-eng" style="font-size: 1rem; color: var(--fg); font-family: var(--mono); margin-top: 0.4rem;">Engineering: 4.5e+6</div>
              <div id="sn-dec" style="font-size: 0.9rem; color: var(--text-muted); font-family: var(--mono); margin-top: 0.4rem;">Standard Decimal: 4,500,000</div>
            </div>
          </div>
        </div>

        <script>
          function toSuperscript(num) {
            var chars = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '+': '' };
            return num.toString().split('').map(function(c) { return chars[c] || c; }).join('');
          }

          function calcSN() {
            var raw = document.getElementById('sn-in').value.trim().replace(/,/g, '');
            var val = parseFloat(raw);
            if (isNaN(val)) {
              document.getElementById('sn-sci').textContent = '-';
              return;
            }

            var expStr = val.toExponential();
            var parts = expStr.split('e');
            var coef = parseFloat(parseFloat(parts[0]).toFixed(6));
            var exp = parseInt(parts[1], 10);

            document.getElementById('sn-sci').textContent = coef + ' × 10' + toSuperscript(exp);
            document.getElementById('sn-eng').textContent = 'E-Notation: ' + coef + 'e' + (exp >= 0 ? '+' : '') + exp;
            document.getElementById('sn-dec').textContent = 'Decimal: ' + (Math.abs(val) >= 1e15 || Math.abs(val) < 1e-6 ? val.toString() : val.toLocaleString('en-US', { maximumFractionDigits: 10 }));
          }

          window.setSN = function(v) {
            document.getElementById('sn-in').value = v;
            calcSN();
          };

          document.addEventListener('DOMContentLoaded', calcSN);
          calcSN();
        </script>
      `
    },
    {
      slug: 'percentage-increase-calculator',
      title: 'Percentage Increase Calculator (Formula & Steps)',
      metaDesc: 'Calculate percentage increase from starting value to final value. Includes difference, growth factor multiplier, and step-by-step formula solution.',
      category: 'Math & Finance',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Percentage Increase
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Percentage Increase Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Calculate percentage growth, price rises, and revenue increases between two numbers with full formula breakdown.
          </p>

          <div class="tool-box">
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Initial / Starting Value</label>
                <input type="number" id="pi-init" class="code-input" value="80" oninput="calcPI()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Final / New Value</label>
                <input type="number" id="pi-final" class="code-input" value="120" oninput="calcPI()" style="font-size: 1.25rem;" />
              </div>
            </div>

            <div class="result-card" style="margin-top: 1.5rem;">
              <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Percentage Increase</div>
              <div id="pi-pct" class="result-val" style="color: #10b981;">+50.00%</div>
              <div id="pi-diff" style="font-size: 1rem; color: var(--fg); font-family: var(--mono); margin-top: 0.4rem;">Absolute Increase: +40</div>
              <div id="pi-formula" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono); margin-top: 0.5rem;">Formula: ((120 - 80) ÷ 80) × 100 = 50%</div>
            </div>
          </div>
        </div>

        <script>
          function calcPI() {
            var v1 = parseFloat(document.getElementById('pi-init').value);
            var v2 = parseFloat(document.getElementById('pi-final').value);
            if (isNaN(v1) || isNaN(v2) || v1 === 0) {
              document.getElementById('pi-pct').textContent = '-';
              return;
            }

            var diff = v2 - v1;
            var pct = (diff / Math.abs(v1)) * 100;
            var mult = v2 / v1;

            var sign = pct >= 0 ? '+' : '';
            var pctEl = document.getElementById('pi-pct');
            pctEl.textContent = sign + pct.toFixed(2) + '%';
            pctEl.style.color = pct >= 0 ? '#10b981' : '#ef4444';

            document.getElementById('pi-diff').textContent = 'Absolute Change: ' + (diff >= 0 ? '+' : '') + diff.toLocaleString('en-US') + ' (Multiplier: ' + mult.toFixed(3) + '×)';
            document.getElementById('pi-formula').textContent = 'Formula: ((' + v2 + ' - ' + v1 + ') ÷ |' + v1 + '|) × 100 = ' + pct.toFixed(2) + '%';
          }

          document.addEventListener('DOMContentLoaded', calcPI);
          calcPI();
        </script>
      `
    },
    {
      slug: 'percentage-decrease-calculator',
      title: 'Percentage Decrease & Discount Calculator',
      metaDesc: 'Calculate percentage decrease, price drops, markdown discounts, and savings between original and discounted prices.',
      category: 'Math & Finance',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Percentage Decrease
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Percentage Decrease Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Determine percentage drops, retail markdown discounts, and loss margins from initial to reduced value.
          </p>

          <div class="tool-box">
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Original / Starting Value</label>
                <input type="number" id="pd-init" class="code-input" value="150" oninput="calcPD()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Reduced / Final Value</label>
                <input type="number" id="pd-final" class="code-input" value="105" oninput="calcPD()" style="font-size: 1.25rem;" />
              </div>
            </div>

            <div class="result-card" style="margin-top: 1.5rem;">
              <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Percentage Decrease</div>
              <div id="pd-pct" class="result-val" style="color: #ef4444;">-30.00%</div>
              <div id="pd-diff" style="font-size: 1rem; color: var(--fg); font-family: var(--mono); margin-top: 0.4rem;">Total Savings: $45.00</div>
              <div id="pd-formula" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono); margin-top: 0.5rem;">Formula: ((150 - 105) ÷ 150) × 100 = 30% reduction</div>
            </div>
          </div>
        </div>

        <script>
          function calcPD() {
            var v1 = parseFloat(document.getElementById('pd-init').value);
            var v2 = parseFloat(document.getElementById('pd-final').value);
            if (isNaN(v1) || isNaN(v2) || v1 === 0) {
              document.getElementById('pd-pct').textContent = '-';
              return;
            }

            var drop = v1 - v2;
            var pct = (drop / Math.abs(v1)) * 100;

            var pctEl = document.getElementById('pd-pct');
            pctEl.textContent = '-' + pct.toFixed(2) + '%';

            document.getElementById('pd-diff').textContent = 'Total Reduction: ' + drop.toLocaleString('en-US') + ' (Remaining: ' + ((v2 / v1) * 100).toFixed(1) + '%)';
            document.getElementById('pd-formula').textContent = 'Formula: ((' + v1 + ' - ' + v2 + ') ÷ |' + v1 + '|) × 100 = ' + pct.toFixed(2) + '% decrease';
          }

          document.addEventListener('DOMContentLoaded', calcPD);
          calcPD();
        </script>
      `
    },
    {
      slug: 'standard-deviation-calculator',
      title: 'Standard Deviation Calculator (Sample & Population)',
      metaDesc: 'Calculate sample standard deviation, population standard deviation, variance, mean, and sum of squares for any list of numbers.',
      category: 'Math & Statistics',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Standard Deviation
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Standard Deviation Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Compute sample standard deviation ($s$), population standard deviation ($\\sigma$), variance, and statistical mean.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.5rem;">
                <label class="field-label" style="margin: 0;">Enter Numbers (Comma, Space, or Newline Separated)</label>
                <div style="display: flex; gap: 0.35rem;">
                  <button type="button" class="btn-sec" onclick="setSDPreset('exam')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Exam Scores</button>
                  <button type="button" class="btn-sec" onclick="setSDPreset('returns')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Daily Returns</button>
                  <button type="button" class="btn-sec" onclick="setSDPreset('heights')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Heights (cm)</button>
                </div>
              </div>
              <textarea id="sd-data" class="code-input" rows="3" oninput="calcSD()" style="font-size: 1.1rem; line-height: 1.5;">10, 12, 23, 23, 16, 23, 21, 16</textarea>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Sample Std Deviation (s)</div>
                <div id="sd-s" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">5.2372</div>
                <div id="sd-s-var" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Variance (s²): 27.4286</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Population Std Dev (σ)</div>
                <div id="sd-p" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">4.8990</div>
                <div id="sd-p-var" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Variance (σ²): 24.0000</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Mean & Sample Size</div>
                <div id="sd-mean" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: var(--fg); margin: 0.25rem 0;">18.00</div>
                <div id="sd-count" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Count (N): 8 | Sum: 144</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Std Error of Mean (SE)</div>
                <div id="sd-se" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #8b5cf6; margin: 0.25rem 0;">1.8516</div>
                <div id="sd-ci" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">95% CI: [14.37, 21.63]</div>
              </div>
            </div>

            <button type="button" id="btnCopySD" onclick="copySDSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Statistical Summary & Confidence Intervals
            </button>
          </div>

          <!-- Step-by-Step Worked Statistical Derivations -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Standard Deviation Derivation (Bessel's Correction)</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">NIST Engineering Statistics Standard</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Standard deviation quantifies the dispersion or spread of data values around the central mean:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 1: Compute Arithmetic Sample Mean</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">
                  x̄ = (&Sigma; x<sub>i</sub>) / n = 144 / 8 = <strong>18.00</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 2: Sum of Squared Deviations (SS)</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  SS = &Sigma; (x<sub>i</sub> - x̄)<sup>2</sup> = (10 - 18)<sup>2</sup> + (12 - 18)<sup>2</sup> + ... = 64 + 36 + 25 + 25 + 4 + 25 + 9 + 4 = <strong>192.00</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #3b82f6;">Step 3: Sample Variance vs Population Variance</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  Sample Variance s<sup>2</sup> = SS / (n - 1) = 192 / 7 = <strong>27.4286</strong> (Bessel's Correction unbiased)<br>
                  Population Variance &sigma;<sup>2</sup> = SS / N = 192 / 8 = <strong>24.0000</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981; font-weight: 700;">Step 4: Standard Deviation (Square Root)</strong>
                <div style="color: #10b981; margin-top: 0.25rem;">
                  Sample s = &radic;27.4286 = <strong>5.2372</strong> &bull; Population &sigma; = &radic;24.0000 = <strong>4.8990</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Statistical Pitfalls -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Statistical Pitfalls & Bessel's Bias</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Bessel's Correction Trap:</strong> When analyzing a subset (sample) of a larger population, dividing by $N$ rather than $n - 1$ produces a mathematically biased underestimate of variance. This occurs because the sample mean $\bar{x}$ is calculated from the sample itself, naturally lying closer to the sample observations than the true unknown population mean $\mu$. Always use $n - 1$ for samples.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Outlier Distortion Vulnerability:</strong> Because deviations are squared before summing, standard deviation is extraordinarily sensitive to outliers. A single extreme observation (e.g. data entry error or fat-tailed market crash) will artificially balloon $s$. For skewed or non-Gaussian data, report the Interquartile Range (IQR) or Median Absolute Deviation (MAD).</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The 68-95-99.7 Empirical Rule Limitation:</strong> The rule stating that 68% of data falls within $\pm 1s$ and 95% within $\pm 2s$ is <em>only valid for normal (Gaussian) bell-curve distributions</em>. For multimodal or heavily skewed distributions (such as wealth or website latency), Chebyshev's Inequality ($\ge 75\%$ within $\pm 2s$) is the only mathematically guaranteed boundary.</li>
            </ul>
          </div>
        </div>

        <script>
          window.setSDPreset = function(type) {
            var area = document.getElementById('sd-data');
            if (type === 'exam') area.value = '72, 85, 91, 64, 78, 88, 95, 82, 79, 89';
            if (type === 'returns') area.value = '1.2, -0.8, 2.1, -1.5, 0.4, -0.2, 1.8, -2.4, 0.9';
            if (type === 'heights') area.value = '165, 172, 178, 181, 169, 175, 188, 162, 174';
            calcSD();
          };

          function calcSD() {
            var text = document.getElementById('sd-data').value;
            var nums = text.split(/[,\\s]+/).map(parseFloat).filter(function(n) { return !isNaN(n); });

            if (nums.length < 2) {
              document.getElementById('sd-s').textContent = '-';
              document.getElementById('sd-p').textContent = '-';
              document.getElementById('sd-mean').textContent = nums.length === 1 ? nums[0].toFixed(2) : '-';
              document.getElementById('sd-se').textContent = '-';
              document.getElementById('sd-ci').textContent = '-';
              return;
            }

            var n = nums.length;
            var sum = nums.reduce(function(a, b) { return a + b; }, 0);
            var mean = sum / n;

            var sumSqDiff = nums.reduce(function(acc, x) {
              var d = x - mean;
              return acc + (d * d);
            }, 0);

            var sampleVar = sumSqDiff / (n - 1);
            var sampleSD = Math.sqrt(sampleVar);

            var popVar = sumSqDiff / n;
            var popSD = Math.sqrt(popVar);

            var se = sampleSD / Math.sqrt(n);
            var ciLow = mean - (1.96 * se);
            var ciHigh = mean + (1.96 * se);

            document.getElementById('sd-s').textContent = sampleSD.toFixed(4);
            document.getElementById('sd-s-var').textContent = 'Variance (s²): ' + sampleVar.toFixed(4);

            document.getElementById('sd-p').textContent = popSD.toFixed(4);
            document.getElementById('sd-p-var').textContent = 'Variance (σ²): ' + popVar.toFixed(4);

            document.getElementById('sd-mean').textContent = mean.toFixed(2);
            document.getElementById('sd-count').textContent = 'Count (N): ' + n + ' | Sum: ' + sum.toLocaleString('en-US');

            document.getElementById('sd-se').textContent = se.toFixed(4);
            document.getElementById('sd-ci').textContent = '95% CI: [' + ciLow.toFixed(2) + ', ' + ciHigh.toFixed(2) + ']';
          }

          window.copySDSummary = function() {
            var s = document.getElementById('sd-s').textContent;
            var p = document.getElementById('sd-p').textContent;
            var mean = document.getElementById('sd-mean').textContent;
            var count = document.getElementById('sd-count').textContent;
            var se = document.getElementById('sd-se').textContent;
            var ci = document.getElementById('sd-ci').textContent;

            var text = [
              '=== STATISTICAL DESCRIPTIVE SUMMARY ===',
              'Sample Standard Deviation (s): ' + s,
              'Population Standard Deviation (σ): ' + p,
              'Arithmetic Mean (x̄): ' + mean,
              count,
              'Standard Error of the Mean (SE): ' + se,
              ci,
              '---------------------------------------',
              'Standard: NIST Engineering Statistics Handbook',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/standard-deviation-calculator'
            ].join('\\n');

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopySD');
              if (btn) {
                var old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Statistical Summary!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', calcSD);
          calcSD();
        </script>
      `
    },
    {
      slug: 'markup-margin-calculator',
      title: 'Markup vs Profit Margin Calculator (eCommerce & Retail Pricing)',
      metaDesc: 'Convert between cost markup and gross profit margin. Calculate optimal retail selling price, dollar profit, and COGS with instant two-way formulas.',
      category: 'Finance & eCommerce',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Markup vs Margin
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Markup vs. Profit Margin Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Convert cost markup to gross profit margin and vice versa. Eliminate pricing mistakes that eat into eCommerce profits, agency billings, and wholesale distribution margins.
          </p>

          <div class="tool-box">
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Cost of Goods / Item Cost ($)</label>
                <input type="number" id="mm-cost" class="code-input" value="40" min="0" step="1" oninput="calcMMFromCost()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Target Markup (% on Cost)</label>
                <input type="number" id="mm-markup" class="code-input" value="50" min="0" step="1" oninput="calcMMFromMarkup()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Gross Profit Margin (% of Revenue)</label>
                <input type="number" id="mm-margin" class="code-input" value="33.33" min="0" max="99.9" step="0.5" oninput="calcMMFromMargin()" style="font-size: 1.25rem;" />
              </div>
            </div>

            <div class="result-card" style="margin-top: 1.5rem;">
              <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Recommended Retail Selling Price</div>
              <div id="mm-price" class="result-val" style="color: #10b981;">$60.00</div>
              <div id="mm-profit" style="font-size: 1.15rem; color: #3b82f6; font-family: var(--mono); margin-top: 0.4rem;">Gross Profit: $20.00 per unit</div>
              <div id="mm-expl" style="font-size: 0.88rem; color: var(--text-muted); font-family: var(--mono); margin-top: 0.5rem;">
                50.0% Markup on Cost = 33.3% Gross Margin on Revenue
              </div>

              <!-- Fast Benchmark Table -->
              <div style="margin-top: 1.5rem; text-align: left; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
                <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; margin-bottom: 0.5rem; color: var(--fg);">
                  📊 Margin vs Markup Conversion Benchmark Table:
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem; font-family: var(--mono); font-size: 0.8rem; text-align: center;">
                  <div style="background: var(--surface-alt); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border);">
                    <div style="color: var(--text-muted);">20% Margin</div>
                    <strong style="color: #3b82f6;">25.0% Markup</strong>
                  </div>
                  <div style="background: var(--surface-alt); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border);">
                    <div style="color: var(--text-muted);">33.3% Margin</div>
                    <strong style="color: #3b82f6;">50.0% Markup</strong>
                  </div>
                  <div style="background: var(--surface-alt); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border);">
                    <div style="color: var(--text-muted);">50% Margin</div>
                    <strong style="color: #10b981;">100% Markup</strong>
                  </div>
                  <div style="background: var(--surface-alt); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border);">
                    <div style="color: var(--text-muted);">60% Margin</div>
                    <strong style="color: #f59e0b;">150% Markup</strong>
                  </div>
                  <div style="background: var(--surface-alt); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border);">
                    <div style="color: var(--text-muted);">75% Margin</div>
                    <strong style="color: #8b5cf6;">300% Markup</strong>
                  </div>
                </div>
              </div>

              <button type="button" id="btnCopyMM" onclick="copyMMSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
                📋 Copy Pricing & Profit Margin Analysis
              </button>
            </div>
          </div>

          <!-- Step-by-Step Worked Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Markup vs Margin Mathematical Derivation</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Accounting GAAP Standard</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              The distinction between markup and margin is the mathematical denominator used in the percentage ratio:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #3b82f6;">Markup Equation (Denominator = Cost)</strong>
                <div style="color: var(--fg); margin-top: 0.25rem;">
                  Markup % = [ (Selling Price - Cost) / Cost ] &times; 100
                </div>
                <div style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  For $40 cost and $60 price: ($20 / $40) &times; 100 = <strong>50.0% Markup</strong>.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981;">Gross Margin Equation (Denominator = Revenue)</strong>
                <div style="color: var(--fg); margin-top: 0.25rem;">
                  Margin % = [ (Selling Price - Cost) / Selling Price ] &times; 100
                </div>
                <div style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  For $40 cost and $60 price: ($20 / $60) &times; 100 = <strong>33.3% Margin</strong>.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #8b5cf6;">Direct Conversion Formula</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  Price = Cost / [ 1 - (Margin % / 100) ] &bull; Markup % = [ Margin % / (100 - Margin %) ] &times; 100
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Business Pitfalls -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Retail Pitfalls & Profit Bleed Traps</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The 50% Markup vs 50% Margin Confusion:</strong> New eCommerce store owners frequently assume adding a 50% markup gives them a 50% profit margin. In reality, a 50% markup yields only a 33.3% gross margin. To achieve a 50% profit margin, you must use a <strong>100% markup</strong> (selling at double your unit cost). Confusing these numbers leads to catastrophic cash flow collapse.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Payment Processing & Ad Spend Blindspot:</strong> Gross profit margin accounts solely for Cost of Goods Sold (COGS). It does not include payment gateway fees (Stripe/PayPal ~2.9% + $0.30), platform transaction fees (Shopify/Amazon ~8%–15%), or customer acquisition cost (CAC). If your gross margin is 25% and your ad CAC takes 20%, you are operating at net negative cash flow after returns and shipping damages.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Asymmetric Discounting Trap:</strong> If you markup a product by 25% ($100 to $125) and later discount it by 20%, you return to break-even ($100). If you discount by 25%, you actually lose money ($93.75). Percentage discounts always hit harder than percentage markups of equal value.</li>
            </ul>
          </div>
        </div>

        <script>
          function calcMMFromCost() {
            var cost = parseFloat(document.getElementById('mm-cost').value) || 0;
            var markup = parseFloat(document.getElementById('mm-markup').value) || 0;
            var price = cost * (1 + (markup / 100));
            var profit = price - cost;
            var margin = price > 0 ? ((profit / price) * 100) : 0;

            document.getElementById('mm-margin').value = margin.toFixed(2);
            updateMMResults(price, profit, markup, margin);
          }

          function calcMMFromMarkup() {
            calcMMFromCost();
          }

          function calcMMFromMargin() {
            var cost = parseFloat(document.getElementById('mm-cost').value) || 0;
            var margin = parseFloat(document.getElementById('mm-margin').value) || 0;
            if (margin >= 100) margin = 99.9;

            var price = cost / (1 - (margin / 100));
            var profit = price - cost;
            var markup = cost > 0 ? ((profit / cost) * 100) : 0;

            document.getElementById('mm-markup').value = markup.toFixed(2);
            updateMMResults(price, profit, markup, margin);
          }

          function updateMMResults(price, profit, markup, margin) {
            document.getElementById('mm-price').textContent = '$' + price.toFixed(2);
            document.getElementById('mm-profit').textContent = 'Gross Profit: $' + profit.toFixed(2) + ' per unit';
            document.getElementById('mm-expl').textContent = markup.toFixed(1) + '% Markup on Cost = ' + margin.toFixed(1) + '% Gross Margin on Revenue';
          }

          window.copyMMSummary = function() {
            var cost = document.getElementById('mm-cost').value;
            var markup = document.getElementById('mm-markup').value;
            var margin = document.getElementById('mm-margin').value;
            var price = document.getElementById('mm-price').textContent;
            var profit = document.getElementById('mm-profit').textContent;

            var text = [
              '=== PRICING & PROFIT MARGIN ANALYSIS ===',
              'Cost of Goods (COGS): $' + parseFloat(cost).toFixed(2),
              'Cost Markup: ' + markup + '%',
              'Gross Profit Margin: ' + margin + '%',
              '---------------------------------------',
              'Recommended Selling Price: ' + price,
              profit,
              '---------------------------------------',
              'Standard: GAAP Cost Accounting Principles',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/markup-margin-calculator'
            ].join('\\n');

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyMM');
              if (btn) {
                var old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Pricing Analysis!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', calcMMFromCost);
          calcMMFromCost();
        </script>
      `
    },
    {
      slug: 'permutation-combination-calculator',
      title: 'Permutation and Combination Calculator (nPr & nCr)',
      metaDesc: 'Calculate permutations (nPr order matters) and combinations (nCr order does not matter) with factorial solutions and step-by-step formulas.',
      category: 'Math & Probability',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Permutations & Combinations
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Permutations & Combinations Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Calculate total arrangements (nPr) and selections (nCr) from a set of $n$ distinct objects taken $r$ at a time.
          </p>

          <div class="tool-box">
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Total Set Size (n)</label>
                <input type="number" id="pc-n" class="code-input" value="10" min="0" max="100" step="1" oninput="calcPC()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Subset Sample Size (r)</label>
                <input type="number" id="pc-r" class="code-input" value="3" min="0" max="100" step="1" oninput="calcPC()" style="font-size: 1.25rem;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Combinations (nCr)</div>
                <div id="pc-ncr" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">120</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Order does not matter</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Permutations (nPr)</div>
                <div id="pc-npr" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">720</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Order matters</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Factorials (n! and r!)</div>
                <div id="pc-fact" style="font-family: var(--mono); font-size: 1.25rem; font-weight: bold; color: var(--fg); margin: 0.5rem 0;">n! = 3,628,800</div>
                <div id="pc-rfact" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">r! = 6</div>
              </div>
            </div>
          </div>
        </div>

        <script>
          function factorial(num) {
            if (num < 0) return 0;
            if (num === 0 || num === 1) return 1;
            var res = 1;
            for (var i = 2; i <= num; i++) {
              res *= i;
              if (res > 1e15) break; // overflow safety
            }
            return res;
          }

          function calcPC() {
            var n = parseInt(document.getElementById('pc-n').value, 10);
            var r = parseInt(document.getElementById('pc-r').value, 10);

            if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) {
              document.getElementById('pc-ncr').textContent = '-';
              document.getElementById('pc-npr').textContent = '-';
              return;
            }

            // nPr = n! / (n-r)!
            var npr = 1;
            for (var i = n; i > (n - r); i--) {
              npr *= i;
            }

            // nCr = nPr / r!
            var rFact = factorial(r);
            var ncr = Math.round(npr / rFact);

            document.getElementById('pc-ncr').textContent = ncr.toLocaleString('en-US');
            document.getElementById('pc-npr').textContent = npr.toLocaleString('en-US');

            var nFact = n <= 20 ? factorial(n).toLocaleString('en-US') : '> 10^18';
            document.getElementById('pc-fact').textContent = 'n! = ' + nFact;
            document.getElementById('pc-rfact').textContent = 'r! = ' + (r <= 20 ? rFact.toLocaleString('en-US') : '> 10^18');
          }

          document.addEventListener('DOMContentLoaded', calcPC);
          calcPC();
        </script>
      `
    },
    {
      slug: 'birthday-paradox-calculator',
      title: 'Birthday Paradox Calculator & Monte Carlo Simulator (Collision Math)',
      metaDesc: 'Why does a room of 23 people have a 50.7% chance of two sharing a birthday? Calculate probability, run 10,000-trial Monte Carlo simulations, and explore cryptographic hash collision attacks.',
      category: 'Math & Probability',
      faq: [
        { q: 'Why does a room of only 23 people have a 50% chance of two people sharing a birthday?', a: 'We are not asking if someone shares your specific birthday—we are checking if ANY two people in the room share a birthday. With 23 people, there are 23 × 22 / 2 = 253 unique comparison pairs. Each pair has a 364/365 chance of not sharing a birthday. Compounding these 253 independent comparisons yields (364/365)^253 ≈ 49.95% chance of no matches, meaning there is a 50.05% (exact: 50.73%) probability of at least one shared birthday.' },
        { q: 'How many people are needed for a 50% chance of someone sharing MY specific birthday?', a: 'To have a 50% chance of someone matching a single targeted birthday, you need 253 people. The formula is 1 - (364/365)^n = 0.50, which solves to n = ln(0.5) / ln(364/365) ≈ 252.65.' },
        { q: 'How is the Birthday Paradox used in cybersecurity and cryptographic hash functions?', a: 'The Birthday Attack shows that finding a collision between any two random hash outputs requires evaluating only roughly the square root of total hash possibilities (√N = 2^(b/2) for a b-bit hash). Consequently, a 128-bit hash (like MD5) only provides 64 bits of collision resistance (~2^64 operations), which is why modern cryptography requires 256-bit hashes (SHA-256) offering 128-bit collision resistance.' },
        { q: 'Does the leap year (February 29) significantly alter the Birthday Paradox probability?', a: 'Incorporating leap years (366 possible days) changes the probability for 23 people from 50.73% to 50.63%—a negligible reduction of 0.1%. Furthermore, real-world birth rates are non-uniformly distributed (more births in September, fewer on weekends), and any deviation from uniform distribution actually increases the likelihood of a collision.' },
        { q: 'What is the Taylor series approximation formula for the Birthday Problem?', a: 'The probability of at least one collision can be approximated as P(n) ≈ 1 - exp(-n² / (2 × d)), where d is the number of possible days (365). For n = 23: P(23) ≈ 1 - exp(-529 / 730) = 1 - exp(-0.7247) ≈ 1 - 0.4845 = 51.55%.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Birthday Paradox
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">The Birthday Paradox & Collision Simulator</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            One of the most famous counter-intuitive probability problems: How many people must be in a room before there is at least a 50% chance two share the exact same birthday? (The answer is only <strong>23 people</strong>). Run high-speed Monte Carlo simulations and explore cryptographic hash collision bounds.
          </p>

          <div class="tool-box">
            <!-- Room Size Controls -->
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: center;">
              <div>
                <div class="field-label">Number of People in Room (n): <span id="bp-n-val" style="color: #3b82f6; font-size: 1.1rem; font-weight: bold;">23</span></div>
                <input type="range" id="bp-range" min="2" max="100" value="23" oninput="updateBPSlider(this.value)" style="width: 100%; cursor: pointer;" />
              </div>
              <div>
                <input type="number" id="bp-num-input" class="code-input" value="23" min="2" max="500" oninput="updateBPInput(this.value)" style="width: 80px; text-align: center; font-size: 1.15rem;" />
              </div>
            </div>

            <!-- Quick Preset Room Buttons -->
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin: 1rem 0 1.25rem 0;">
              <span style="font-size: 0.78rem; color: var(--text-muted); width: 100%;">Milestone Room Sizes:</span>
              <button type="button" class="btn-sec" onclick="setBPRoom(10)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">10 People (11.7%)</button>
              <button type="button" class="btn-sec" onclick="setBPRoom(23)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem; border-color: #10b981; color: #10b981; font-weight: bold;">23 People (50.7% 50-50 Break-Even)</button>
              <button type="button" class="btn-sec" onclick="setBPRoom(30)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">30 People (70.6%)</button>
              <button type="button" class="btn-sec" onclick="setBPRoom(50)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">50 People (97.0%)</button>
              <button type="button" class="btn-sec" onclick="setBPRoom(70)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">70 People (99.9% Near Certainty)</button>
              <button type="button" class="btn-sec" onclick="setBPRoom(253)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">253 (50% Matches YOUR Birthday)</button>
            </div>

            <!-- Results Hero Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.25rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Probability of Shared Birthday</div>
                <div id="bp-prob" style="font-family: var(--mono); font-size: 2.5rem; font-weight: bold; color: #10b981; margin: 0.3rem 0;">50.73%</div>
                <div id="bp-odds" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">Odds: 1.03 to 1 in favor</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Comparison Pairs</div>
                <div id="bp-pairs" style="font-family: var(--mono); font-size: 2.5rem; font-weight: bold; color: #3b82f6; margin: 0.3rem 0;">253 Pairs</div>
                <div style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">n &times; (n &minus; 1) / 2 unique pairings</div>
              </div>
            </div>

            <!-- Detailed Sub-Metrics Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; margin-top: 1rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="background: var(--surface-alt); padding: 0.65rem; border-radius: 4px; border: 1px solid var(--border); text-align: center;">
                <div style="color: var(--text-muted); font-size: 0.7rem;">All Birthdays Unique</div>
                <div id="bp-unique" style="font-weight: bold; color: var(--fg); font-size: 1.05rem; margin-top: 0.2rem;">49.27%</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.65rem; border-radius: 4px; border: 1px solid var(--border); text-align: center;">
                <div style="color: var(--text-muted); font-size: 0.7rem;">Match YOUR Birthday</div>
                <div id="bp-target" style="font-weight: bold; color: #f59e0b; font-size: 1.05rem; margin-top: 0.2rem;">6.12%</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.65rem; border-radius: 4px; border: 1px solid var(--border); text-align: center;">
                <div style="color: var(--text-muted); font-size: 0.7rem;">Taylor Approximation</div>
                <div id="bp-taylor" style="font-weight: bold; color: var(--fg); font-size: 1.05rem; margin-top: 0.2rem;">51.55%</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.65rem; border-radius: 4px; border: 1px solid var(--border); text-align: center;">
                <div style="color: var(--text-muted); font-size: 0.7rem;">Collision Bound (d=365)</div>
                <div style="font-weight: bold; color: #8b5cf6; font-size: 1.05rem; margin-top: 0.2rem;">&radic;(2 &times; 365) &approx; 27</div>
              </div>
            </div>

            <!-- Action bar with One-Click Copy -->
            <button type="button" id="btnCopyBP" onclick="copyBPSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Probability & Simulation Report
            </button>
          </div>

          <!-- High-Speed Monte Carlo Simulation Engine -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #10b981; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">🎲 High-Speed Monte Carlo Batch Simulator</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Empirical Law of Large Numbers</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
              Simulate thousands of real rooms filled with random birthdays directly in your browser. Watch the empirical match frequency converge to the theoretical 50.73% probability:
            </p>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; margin-bottom: 1.25rem;">
              <button type="button" class="btn-primary" onclick="runMonteCarlo(1000)" style="padding: 0.6rem 1.1rem; font-size: 0.85rem;">
                Run 1,000 Trials
              </button>
              <button type="button" class="btn-primary" onclick="runMonteCarlo(5000)" style="padding: 0.6rem 1.1rem; font-size: 0.85rem;">
                Run 5,000 Trials
              </button>
              <button type="button" class="btn-primary" onclick="runMonteCarlo(10000)" style="padding: 0.6rem 1.2rem; font-size: 0.85rem; background: #10b981;">
                Run 10,000 Trials (Flagship Benchmark)
              </button>
              <button type="button" class="btn-sec" onclick="runSingleRoomSim()" style="padding: 0.6rem 1rem; font-size: 0.85rem;">
                🎲 Roll 1 Room (Visualizer)
              </button>
            </div>

            <!-- Simulation Output Scoreboard -->
            <div id="mc-scoreboard" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                <div style="color: var(--text-muted); font-size: 0.7rem;">Simulated Rooms</div>
                <div id="mc-trials" style="font-size: 1.2rem; font-weight: bold; color: var(--fg); margin-top: 0.2rem;">0</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                <div style="color: var(--text-muted); font-size: 0.7rem;">Rooms with Shared Birthday</div>
                <div id="mc-hits" style="font-size: 1.2rem; font-weight: bold; color: #10b981; margin-top: 0.2rem;">0</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                <div style="color: var(--text-muted); font-size: 0.7rem;">Empirical Match Rate</div>
                <div id="mc-rate" style="font-size: 1.2rem; font-weight: bold; color: #10b981; margin-top: 0.2rem;">0.00%</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                <div style="color: var(--text-muted); font-size: 0.7rem;">Variance from Theory (&Delta;)</div>
                <div id="mc-delta" style="font-size: 1.2rem; font-weight: bold; color: #3b82f6; margin-top: 0.2rem;">0.00%</div>
              </div>
            </div>

            <div id="bp-single-room-log" style="margin-top: 1rem; font-family: var(--mono); font-size: 0.85rem; padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border); min-height: 24px;">
              Click "Roll 1 Room" or run a batch Monte Carlo simulation above to inspect individual collision mechanics.
            </div>
          </div>

          <!-- Generalized Cryptographic Collision Space Explorer -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #8b5cf6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">🔐 Cryptographic Collision Bounds (The Birthday Attack)</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #8b5cf6; background: rgba(139, 92, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">&radic;N Vulnerability Limit</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              The Birthday Paradox is the fundamental reason why cryptographic hashes must have double the intended security bits. To have a 50% probability of a hash collision, an attacker only needs approximately <strong>1.1774 &times; &radic;D</strong> attempts:
            </p>

            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              <button type="button" class="btn-sec" onclick="setCryptoSpace(10000, '4-Digit PIN (10,000 Codes)')" style="font-size: 0.72rem; padding: 0.3rem 0.55rem;">4-Digit PIN (10k)</button>
              <button type="button" class="btn-sec" onclick="setCryptoSpace(1000000, '6-Digit OTP (1M Codes)')" style="font-size: 0.72rem; padding: 0.3rem 0.55rem;">6-Digit OTP (1M)</button>
              <button type="button" class="btn-sec" onclick="setCryptoSpace(65536, '16-Bit Token (65,536)')" style="font-size: 0.72rem; padding: 0.3rem 0.55rem;">16-Bit ID (65k)</button>
              <button type="button" class="btn-sec" onclick="setCryptoSpace(4294967296, '32-Bit CRC32 / IPv4 (4.29B)')" style="font-size: 0.72rem; padding: 0.3rem 0.55rem;">32-Bit Hash (4.29B)</button>
              <button type="button" class="btn-sec" onclick="setCryptoSpace(668, 'Martian Year (668 Sols)')" style="font-size: 0.72rem; padding: 0.3rem 0.55rem;">Mars Colony (668 Sols)</button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                <div style="color: var(--text-muted); font-size: 0.7rem;">Target Keyspace (D)</div>
                <div id="crypto-d" style="font-size: 1.1rem; font-weight: bold; color: var(--fg); margin-top: 0.2rem;">10,000 Codes</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                <div style="color: var(--text-muted); font-size: 0.7rem;">50% Collision Threshold (n)</div>
                <div id="crypto-n" style="font-size: 1.1rem; font-weight: bold; color: #8b5cf6; margin-top: 0.2rem;">Only 119 Items!</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                <div style="color: var(--text-muted); font-size: 0.7rem;">Effective Security Bits</div>
                <div id="crypto-bits" style="font-size: 1.1rem; font-weight: bold; color: #ef4444; margin-top: 0.2rem;">&approx; 6.6 Bits</div>
              </div>
            </div>
          </div>

          <!-- Master Reference Table -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.5rem 0; color: var(--fg);">📊 Master Room Size vs Shared Birthday Probability Table</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              Calculated exactly across standard room capacities from intimate gatherings to concert auditoriums:
            </p>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; text-align: left;">
                <thead>
                  <tr style="background: var(--surface-alt); border-bottom: 1px solid var(--border);">
                    <th style="padding: 0.5rem 0.75rem;">People in Room (n)</th>
                    <th style="padding: 0.5rem 0.75rem;">Comparison Pairs</th>
                    <th style="padding: 0.5rem 0.75rem;">Shared Probability (%)</th>
                    <th style="padding: 0.5rem 0.75rem;">Odds in Favor</th>
                    <th style="padding: 0.5rem 0.75rem;">Real-World Scenario</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5 people</td><td style="padding: 0.45rem 0.75rem;">10 pairs</td><td style="padding: 0.45rem 0.75rem; color: #f59e0b;">2.71%</td><td style="padding: 0.45rem 0.75rem;">35.9 to 1 against</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Family dinner</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">10 people</td><td style="padding: 0.45rem 0.75rem;">45 pairs</td><td style="padding: 0.45rem 0.75rem; color: #f59e0b;">11.69%</td><td style="padding: 0.45rem 0.75rem;">7.5 to 1 against</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Startup team sprint</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">15 people</td><td style="padding: 0.45rem 0.75rem;">105 pairs</td><td style="padding: 0.45rem 0.75rem; color: #f59e0b;">25.29%</td><td style="padding: 0.45rem 0.75rem;">2.95 to 1 against</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Dinner party</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">20 people</td><td style="padding: 0.45rem 0.75rem;">190 pairs</td><td style="padding: 0.45rem 0.75rem; color: #f59e0b;">41.14%</td><td style="padding: 0.45rem 0.75rem;">1.43 to 1 against</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">College seminar</td></tr>
                  <tr style="border-bottom: 1px solid var(--border); background: rgba(16, 185, 129, 0.08);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">23 people (Milestone)</td><td style="padding: 0.45rem 0.75rem; font-weight: bold;">253 pairs</td><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">50.73%</td><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">1.03 to 1 in favor</td><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Soccer squad + 1 ref (Break-even)</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">25 people</td><td style="padding: 0.45rem 0.75rem;">300 pairs</td><td style="padding: 0.45rem 0.75rem; color: #10b981;">56.87%</td><td style="padding: 0.45rem 0.75rem;">1.32 to 1 in favor</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Typical elementary classroom</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">30 people</td><td style="padding: 0.45rem 0.75rem;">435 pairs</td><td style="padding: 0.45rem 0.75rem; color: #10b981;">70.63%</td><td style="padding: 0.45rem 0.75rem;">2.40 to 1 in favor</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">High school classroom</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">40 people</td><td style="padding: 0.45rem 0.75rem;">780 pairs</td><td style="padding: 0.45rem 0.75rem; color: #10b981;">89.12%</td><td style="padding: 0.45rem 0.75rem;">8.19 to 1 in favor</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Tour bus group</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">50 people</td><td style="padding: 0.45rem 0.75rem;">1,225 pairs</td><td style="padding: 0.45rem 0.75rem; color: #10b981;">97.04%</td><td style="padding: 0.45rem 0.75rem;">32.8 to 1 in favor</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Corporate department</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">60 people</td><td style="padding: 0.45rem 0.75rem;">1,770 pairs</td><td style="padding: 0.45rem 0.75rem; color: #10b981;">99.41%</td><td style="padding: 0.45rem 0.75rem;">169.5 to 1 in favor</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Wedding guest hall</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">70 people</td><td style="padding: 0.45rem 0.75rem;">2,415 pairs</td><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">99.92%</td><td style="padding: 0.45rem 0.75rem;">1,190 to 1 in favor</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Airplane passenger cabin</td></tr>
                  <tr><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">100 people</td><td style="padding: 0.45rem 0.75rem;">4,950 pairs</td><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">99.99997%</td><td style="padding: 0.45rem 0.75rem;">3.3 million to 1 in favor</td><td style="padding: 0.45rem 0.75rem; color: var(--text-muted);">Lecture hall auditorium</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 3 Real-World Paradox Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem; color: var(--fg);">⚠️ 3 Counter-Intuitive Traps of the Birthday Problem</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); border-left: 3px solid #ef4444;">
                <strong style="color: #ef4444; font-size: 0.95rem;">1. The "Targeted Birthday" Fallacy: 23 vs 253 People</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.35rem 0 0 0; line-height: 1.5;">
                  Human intuition expects the Birthday Paradox to answer: <em>"What are the chances someone shares MY birthday?"</em> If you ask about a single fixed date, each person has a 364/365 failure rate, requiring <strong>253 people</strong> before reaching a 50% probability. The paradox resolves because you are checking <strong>any two people</strong>: with 23 people, there are 253 pairwise comparisons, exactly matching the 253 individuals required in the single-target case!
                </p>
              </div>

              <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); border-left: 3px solid #f59e0b;">
                <strong style="color: #f59e0b; font-size: 0.95rem;">2. Non-Uniform Real-World Birth Distribution</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.35rem 0 0 0; line-height: 1.5;">
                  Standard textbook calculations assume births are evenly distributed across all 365 days (1/365 &approx; 0.274% per day). In reality, hospital birth records show significant non-uniformity: late September experiences a sharp birth peak (conceptions around the winter holidays), while weekends and federal holidays have significantly lower birth rates due to scheduled cesareans. According to mathematical probability theory, <em>any deviation from uniform distribution increases the likelihood of a birthday collision</em>—making 23 people even more likely to share a birthday in real life than on paper!
                </p>
              </div>

              <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); border-left: 3px solid #3b82f6;">
                <strong style="color: #3b82f6; font-size: 0.95rem;">3. Cryptographic Hash Collisions and the Square Root Vulnerability</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.35rem 0 0 0; line-height: 1.5;">
                  A naive engineer might assume that a 64-bit cryptographic hash requires 2^64 (18 quintillion) attempts to break. Due to the Birthday Paradox, finding <strong>any two messages with identical hashes</strong> (a collision attack) requires only &radic;(2^64) = 2^32 &approx; 4.29 billion operations—an effort easily executed on a consumer gaming PC in under 10 seconds. This is why standard cryptography mandates 256-bit hashes (SHA-256), which retain a safe 128-bit collision resistance floor.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          var curN = 23;

          function updateBPSlider(val) {
            curN = parseInt(val, 10);
            document.getElementById('bp-n-val').textContent = curN;
            document.getElementById('bp-num-input').value = curN;
            calcBP(curN);
          }

          function updateBPInput(val) {
            curN = Math.max(2, Math.min(500, parseInt(val, 10) || 2));
            document.getElementById('bp-n-val').textContent = curN;
            if (curN <= 100) document.getElementById('bp-range').value = curN;
            calcBP(curN);
          }

          window.setBPRoom = function(n) {
            curN = n;
            document.getElementById('bp-n-val').textContent = n;
            document.getElementById('bp-num-input').value = n;
            if (n <= 100) document.getElementById('bp-range').value = n;
            calcBP(n);
          };

          function calcBP(n) {
            var pairs = (n * (n - 1)) / 2;
            document.getElementById('bp-pairs').textContent = pairs.toLocaleString('en-US') + ' Pairs';

            if (n >= 365) {
              document.getElementById('bp-prob').textContent = '100.00%';
              document.getElementById('bp-prob').style.color = '#10b981';
              document.getElementById('bp-odds').textContent = 'Pigeonhole principle: Guaranteed 100%';
              document.getElementById('bp-unique').textContent = '0.00%';
              document.getElementById('bp-target').textContent = (100 * (1 - Math.pow(364/365, n))).toFixed(2) + '%';
              document.getElementById('bp-taylor').textContent = '100.00%';
              return;
            }

            // Exact calculation: P(unique) = product_{i=0}^{n-1} (365 - i) / 365
            var pUnique = 1.0;
            for (var i = 0; i < n; i++) {
              pUnique *= (365 - i) / 365;
            }

            var pShared = (1 - pUnique) * 100;
            var probEl = document.getElementById('bp-prob');
            probEl.textContent = pShared.toFixed(2) + '%';
            probEl.style.color = pShared >= 50 ? '#10b981' : (pShared >= 20 ? '#f59e0b' : 'var(--fg)');

            document.getElementById('bp-unique').textContent = (pUnique * 100).toFixed(2) + '%';

            // Targeted birthday: chance someone matches YOU
            var pTarget = (1 - Math.pow(364 / 365, n)) * 100;
            document.getElementById('bp-target').textContent = pTarget.toFixed(2) + '%';

            // Taylor approximation: 1 - exp(-n^2 / (2 * 365))
            var pTaylor = (1 - Math.exp(-(n * n) / (2 * 365))) * 100;
            document.getElementById('bp-taylor').textContent = pTaylor.toFixed(2) + '%';

            var odds = pUnique > 0 ? ((1 - pUnique) / pUnique) : 999;
            document.getElementById('bp-odds').textContent = pShared >= 50 ?
              ('Odds: ' + odds.toFixed(2) + ' to 1 in favor') :
              ('Odds: ' + (1 / odds).toFixed(2) + ' to 1 against');
          }

          window.runMonteCarlo = function(trials) {
            var n = curN;
            var collisions = 0;
            var startTime = performance.now();

            for (var t = 0; t < trials; t++) {
              var seen = new Uint8Array(366);
              var hit = false;
              for (var i = 0; i < n; i++) {
                var day = Math.floor(Math.random() * 365);
                if (seen[day]) {
                  hit = true;
                  break;
                }
                seen[day] = 1;
              }
              if (hit) collisions++;
            }

            var elapsed = (performance.now() - startTime).toFixed(1);
            var rate = (collisions / trials) * 100;

            // Theoretical
            var pUnique = 1.0;
            if (n < 365) {
              for (var j = 0; j < n; j++) pUnique *= (365 - j) / 365;
            } else {
              pUnique = 0;
            }
            var pTheory = (1 - pUnique) * 100;
            var delta = rate - pTheory;

            document.getElementById('mc-trials').textContent = trials.toLocaleString('en-US');
            document.getElementById('mc-hits').textContent = collisions.toLocaleString('en-US');
            document.getElementById('mc-rate').textContent = rate.toFixed(2) + '%';

            var deltaEl = document.getElementById('mc-delta');
            deltaEl.textContent = (delta >= 0 ? '+' : '') + delta.toFixed(2) + '%';
            deltaEl.style.color = Math.abs(delta) < 1.0 ? '#10b981' : '#f59e0b';

            document.getElementById('bp-single-room-log').innerHTML = '<strong>' + trials.toLocaleString('en-US') + ' Monte Carlo Rooms Tested</strong> for n=' + n + ' people in ' + elapsed + ' ms.<br>' +
              'Observed ' + collisions.toLocaleString('en-US') + ' rooms with collisions (' + rate.toFixed(2) + '%). Theoretical target was ' + pTheory.toFixed(2) + '%. Variance: ' + (delta >= 0 ? '+' : '') + delta.toFixed(2) + '%.';
          };

          window.runSingleRoomSim = function() {
            var n = curN;
            var seen = {};
            var collision = false;
            var colDay = -1;
            var colPeople = [];

            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

            function dayToDateStr(dayIndex) {
              var d = dayIndex;
              for (var m = 0; m < 12; m++) {
                if (d < daysInMonth[m]) {
                  return months[m] + ' ' + (d + 1);
                }
                d -= daysInMonth[m];
              }
              return 'Dec 31';
            }

            for (var i = 1; i <= n; i++) {
              var day = Math.floor(Math.random() * 365);
              if (seen[day] !== undefined) {
                collision = true;
                colDay = day;
                colPeople = [seen[day], i];
                break;
              }
              seen[day] = i;
            }

            var logEl = document.getElementById('bp-single-room-log');
            if (collision) {
              var dateName = dayToDateStr(colDay);
              logEl.innerHTML = '<span style="color: #10b981; font-weight: bold;">✓ SHARED BIRTHDAY FOUND!</span> Person #' + colPeople[0] + ' and Person #' + colPeople[1] + ' both share a birthday on <strong>' + dateName + '</strong> (Day #' + (colDay + 1) + ' of 365).';
            } else {
              logEl.innerHTML = '<span style="color: #ef4444; font-weight: bold;">✗ NO MATCH IN THIS ROOM:</span> All ' + n + ' people rolled completely distinct days of the year.';
            }
          };

          window.setCryptoSpace = function(d, label) {
            document.getElementById('crypto-d').textContent = label;
            var n50 = Math.round(1.1774 * Math.sqrt(d));
            document.getElementById('crypto-n').textContent = 'Only ' + n50.toLocaleString('en-US') + ' Items!';
            var bits = (Math.log2(n50)).toFixed(1);
            document.getElementById('crypto-bits').textContent = '&approx; ' + bits + ' Bits of Collision Resistance';
          };

          window.copyBPSummary = function() {
            var btn = document.getElementById('btnCopyBP');
            var n = curN;
            var prob = document.getElementById('bp-prob').textContent;
            var pairs = document.getElementById('bp-pairs').textContent;
            var odds = document.getElementById('bp-odds').textContent;
            var unique = document.getElementById('bp-unique').textContent;
            var target = document.getElementById('bp-target').textContent;
            var mcTrials = document.getElementById('mc-trials').textContent;
            var mcRate = document.getElementById('mc-rate').textContent;

            var text = '--- Birthday Paradox & Collision Report ---\n' +
              'Room Size (n): ' + n + ' people\n' +
              'Comparison Pairs: ' + pairs + '\n' +
              'Shared Birthday Probability: ' + prob + ' (' + odds + ')\n' +
              'Probability All Unique: ' + unique + '\n' +
              'Probability Someone Matches YOUR Birthday: ' + target + '\n' +
              'Monte Carlo Simulation: ' + mcTrials + ' rooms tested -> ' + mcRate + ' empirical collision rate\n' +
              'Calculated on Digital Tools Shed (https://digitaltoolsshed.com/math/birthday-paradox-calculator)';

            navigator.clipboard.writeText(text).then(function() {
              btn.textContent = '✓ Probability Report Copied!';
              btn.style.borderColor = '#10b981';
              btn.style.color = '#10b981';
              setTimeout(function() {
                btn.textContent = '📋 Copy Probability & Simulation Report';
                btn.style.borderColor = 'var(--border)';
                btn.style.color = 'var(--fg)';
              }, 2500);
            });
          };

          document.addEventListener('DOMContentLoaded', function() { calcBP(23); });
          calcBP(23);
        </script>
      `
    }
  ];

  // Render individual pages
  for (const tool of tools) {
    const html = renderPage({
      title: `${tool.title} | Digital Tools Shed`,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/math/${tool.slug}`,
      bodyContent: tool.body,
      currentPath: `/math/${tool.slug}`,
      faq: tool.faq
    });
    writeFileSync(join(mathDist, `${tool.slug}.html`), html);
  }

  // Render Hub Page
  const hubCards = tools.map(t => `
    <a href="/math/${t.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  const hubBody = `
    ${commonStyle}
    <div class="article-container" style="max-width: 900px;">
      <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Math & Financial Calculators</h1>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
        Fast browser-based financial and mathematical calculators: compound interest, mortgage amortization, 3-way percentages, and age metrics.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
        ${hubCards}
      </div>
    </div>
  `;

  writeFileSync(join(mathDist, 'index.html'), renderPage({
    title: 'Math & Financial Calculators | Digital Tools Shed',
    metaDesc: 'Free online financial and math calculators: compound interest, mortgage, percentage change, tips, and Roman numerals.',
    canonical: `${DOMAIN}/math/`,
    bodyContent: hubBody,
    currentPath: '/math/'
  }));

  console.log(`  ✓ Built Math Suite (${tools.length} tools in /math/)`);
}
