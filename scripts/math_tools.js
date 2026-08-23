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
            </div>
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
                Total Interest: <strong id="mg-i-out" style="color: #ef4444;">$357,124.40</strong>
              </div>
            </div>
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
          document.addEventListener('DOMContentLoaded', calcMortgage);
        </script>
      `
    },
    {
      slug: 'tip-calculator',
      title: 'Tip & Bill Split Calculator',
      metaDesc: 'Calculate restaurant tips, custom percentages, tax amounts, and split the bill evenly per person.',
      category: 'Math & Finance',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Tip Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Tip & Bill Split Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Quickly calculate gratuity, total bill with tip, and per-person split for group dining.
          </p>

          <div class="tool-box">
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Bill Subtotal ($)</label>
                <input type="number" id="tip-bill" class="text-input" value="85.50" step="0.5" oninput="calcTip()" />
              </div>
              <div class="field-group">
                <label class="field-label">Tip Percentage (%)</label>
                <input type="number" id="tip-pct" class="text-input" value="18" min="0" max="100" oninput="calcTip()" />
              </div>
              <div class="field-group">
                <label class="field-label">Number of People</label>
                <input type="number" id="tip-people" class="text-input" value="3" min="1" max="50" oninput="calcTip()" />
              </div>
            </div>

            <div class="result-card">
              <div class="field-label">Total Per Person</div>
              <div id="tip-per-person" class="result-val">$33.63</div>
              <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">
                Tip Amount: <strong id="tip-amount-out" style="color: #22c55e;">$15.39</strong> |
                Total Bill: <strong id="tip-total-out" style="color: var(--fg);">$100.89</strong>
              </div>
            </div>
          </div>
        </div>

        <script>
          function calcTip() {
            const bill = parseFloat(document.getElementById('tip-bill').value) || 0;
            const pct = parseFloat(document.getElementById('tip-pct').value) || 0;
            const people = parseInt(document.getElementById('tip-people').value, 10) || 1;

            const tip = bill * (pct / 100);
            const total = bill + tip;
            const perPerson = total / people;

            document.getElementById('tip-per-person').textContent = '$' + perPerson.toFixed(2);
            document.getElementById('tip-amount-out').textContent = '$' + tip.toFixed(2);
            document.getElementById('tip-total-out').textContent = '$' + total.toFixed(2);
          }
          document.addEventListener('DOMContentLoaded', calcTip);
        </script>
      `
    },
    {
      slug: 'roman-numerals',
      title: 'Roman Numerals Converter',
      metaDesc: 'Convert standard numbers to Roman numerals (e.g. 2026 to MMXXVI) and decode Roman numeral strings back to integers.',
      category: 'Math & Finance',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Roman Numerals Converter
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Roman Numerals Converter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Convert any Arabic number (1 to 3,999,999) to Roman numerals or decode Roman strings to decimal values.
          </p>

          <div class="tool-box">
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Arabic Number (Integer)</label>
                <input type="number" id="num-in" class="text-input" value="2026" min="1" oninput="intToRoman()" />
              </div>
              <div class="field-group">
                <label class="field-label">Roman Numeral</label>
                <input type="text" id="roman-in" class="text-input" value="MMXXVI" oninput="romanToInt()" style="text-transform: uppercase;" />
              </div>
            </div>
          </div>
        </div>

        <script>
          const ROMAN_MAP = [
            [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
            [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
            [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
          ];

          function intToRoman() {
            let num = parseInt(document.getElementById('num-in').value, 10);
            if (isNaN(num) || num <= 0) { document.getElementById('roman-in').value = ''; return; }
            let res = '';
            for (const [val, sym] of ROMAN_MAP) {
              while (num >= val) {
                res += sym;
                num -= val;
              }
            }
            document.getElementById('roman-in').value = res;
          }

          function romanToInt() {
            const str = document.getElementById('roman-in').value.toUpperCase().trim();
            const vals = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
            let total = 0;
            for (let i = 0; i < str.length; i++) {
              const cur = vals[str[i]] || 0;
              const next = vals[str[i+1]] || 0;
              if (cur < next) {
                total -= cur;
              } else {
                total += cur;
              }
            }
            document.getElementById('num-in').value = total || '';
          }
        </script>
      `
    },
    {
      slug: 'age-calculator',
      title: 'Exact Age & Birthday Countdown Calculator',
      metaDesc: 'Calculate your exact age in years, months, weeks, days, hours, and minutes, along with days until next birthday.',
      category: 'Math & Finance',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Age Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Exact Age & Birthday Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Find out your precise age broken down into years, months, days, and total days lived.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Date of Birth</label>
              <input type="date" id="dob-input" class="text-input" value="2000-01-01" onchange="calcAge()" />
            </div>

            <div class="result-card">
              <div class="field-label">Exact Age</div>
              <div id="age-out" class="result-val">-- Years</div>
              <div id="age-breakdown" style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;"></div>
            </div>
          </div>
        </div>

        <script>
          function calcAge() {
            const dobVal = document.getElementById('dob-input').value;
            if (!dobVal) return;

            const dob = new Date(dobVal);
            const now = new Date();

            let years = now.getFullYear() - dob.getFullYear();
            let months = now.getMonth() - dob.getMonth();
            let days = now.getDate() - dob.getDate();

            if (days < 0) {
              months--;
              days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            }
            if (months < 0) {
              years--;
              months += 12;
            }

            const diffMs = now - dob;
            const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            document.getElementById('age-out').textContent = years + ' Years, ' + months + ' Months, ' + days + ' Days';
            document.getElementById('age-breakdown').textContent = 'Total days lived: ' + totalDays.toLocaleString() + ' days';
          }
          document.addEventListener('DOMContentLoaded', calcAge);
        </script>
      `
    }
  ];

  // Render individual pages
  for (const tool of tools) {
    const html = renderPage({
      title: `${tool.title} | Digital Tools Shed`,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/math/${tool.slug}.html`,
      bodyContent: tool.body,
      currentPath: `/math/${tool.slug}.html`
    });
    writeFileSync(join(mathDist, `${tool.slug}.html`), html);
  }

  // Render Hub Page
  const hubCards = tools.map(t => `
    <a href="/math/${t.slug}.html" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
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
