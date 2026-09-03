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
            </div>
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
      title: 'Fraction Calculator (Add, Subtract, Multiply, Divide Fractions)',
      metaDesc: 'Add, subtract, multiply, and divide fractions with step-by-step solutions, LCD least common denominator, and mixed number simplification.',
      category: 'Math & Units',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Fraction Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Fraction Arithmetic Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Add, subtract, multiply, and divide two fractions or mixed numbers with full step-by-step work and common denominator solving.
          </p>

          <div class="tool-box">
            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center;">
              <!-- Fraction 1 -->
              <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border: 1px solid var(--border);">
                <div class="field-label">Fraction 1</div>
                <div style="display: flex; gap: 0.4rem; align-items: center;">
                  <input type="number" id="fc-w1" class="code-input" placeholder="Whole" style="width: 70px;" oninput="calcFracCalc()" />
                  <div style="display: flex; flex-direction: column; gap: 0.3rem;">
                    <input type="number" id="fc-n1" class="code-input" value="1" style="width: 70px;" oninput="calcFracCalc()" />
                    <input type="number" id="fc-d1" class="code-input" value="2" min="1" style="width: 70px;" oninput="calcFracCalc()" />
                  </div>
                </div>
              </div>

              <!-- Operation -->
              <div>
                <select id="fc-op" class="code-input" style="font-size: 1.5rem; padding: 0.5rem; font-weight: bold; width: auto;" onchange="calcFracCalc()">
                  <option value="+">+</option>
                  <option value="-">−</option>
                  <option value="*">×</option>
                  <option value="/">÷</option>
                </select>
              </div>

              <!-- Fraction 2 -->
              <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border: 1px solid var(--border);">
                <div class="field-label">Fraction 2</div>
                <div style="display: flex; gap: 0.4rem; align-items: center;">
                  <input type="number" id="fc-w2" class="code-input" placeholder="Whole" style="width: 70px;" oninput="calcFracCalc()" />
                  <div style="display: flex; flex-direction: column; gap: 0.3rem;">
                    <input type="number" id="fc-n2" class="code-input" value="3" style="width: 70px;" oninput="calcFracCalc()" />
                    <input type="number" id="fc-d2" class="code-input" value="4" min="1" style="width: 70px;" oninput="calcFracCalc()" />
                  </div>
                </div>
              </div>
            </div>

            <div class="result-card" style="margin-top: 1.5rem;">
              <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Result</div>
              <div id="fc-res" class="result-val">1 1/4</div>
              <div id="fc-steps" style="font-size: 0.95rem; color: var(--text-muted); font-family: var(--mono); margin-top: 0.5rem;">Decimal: 1.25 | Improper Fraction: 5/4</div>
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

          function calcFracCalc() {
            var w1 = parseFloat(document.getElementById('fc-w1').value) || 0;
            var n1 = parseFloat(document.getElementById('fc-n1').value) || 0;
            var d1 = parseFloat(document.getElementById('fc-d1').value) || 1;

            var w2 = parseFloat(document.getElementById('fc-w2').value) || 0;
            var n2 = parseFloat(document.getElementById('fc-n2').value) || 0;
            var d2 = parseFloat(document.getElementById('fc-d2').value) || 1;

            var op = document.getElementById('fc-op').value;

            // Convert to improper fractions
            var top1 = (w1 * d1) + n1;
            var top2 = (w2 * d2) + n2;

            var resNum = 0, resDen = 1;

            if (op === '+') {
              resNum = (top1 * d2) + (top2 * d1);
              resDen = d1 * d2;
            } else if (op === '-') {
              resNum = (top1 * d2) - (top2 * d1);
              resDen = d1 * d2;
            } else if (op === '*') {
              resNum = top1 * top2;
              resDen = d1 * d2;
            } else if (op === '/') {
              resNum = top1 * d2;
              resDen = d1 * top2;
            }

            if (resDen === 0) {
              document.getElementById('fc-res').textContent = 'Undefined';
              return;
            }

            var g = gcdFrac(resNum, resDen);
            resNum = resNum / g;
            resDen = resDen / g;

            if (resDen < 0) {
              resNum = -resNum;
              resDen = -resDen;
            }

            var whole = Math.floor(Math.abs(resNum) / resDen);
            var rem = Math.abs(resNum) % resDen;
            var sign = resNum < 0 ? '-' : '';

            var outStr = '';
            if (rem === 0) {
              outStr = (sign ? '-' : '') + whole;
            } else if (whole === 0) {
              outStr = (sign ? '-' : '') + rem + '/' + resDen;
            } else {
              outStr = (sign ? '-' : '') + whole + ' ' + rem + '/' + resDen;
            }

            document.getElementById('fc-res').textContent = outStr;
            var dec = (resNum / resDen).toFixed(4).replace(/0+$/, '').replace(/\\.$/, '');
            document.getElementById('fc-steps').textContent = 'Decimal: ' + dec + ' | Improper Fraction: ' + resNum + '/' + resDen;
          }

          document.addEventListener('DOMContentLoaded', calcFracCalc);
          calcFracCalc();
        </script>
      `
    },
    {
      slug: 'aspect-ratio-calculator',
      title: 'Aspect Ratio Calculator (16:9, 4:3, 21:9 & Pixel Resizer)',
      metaDesc: 'Calculate aspect ratios, resize video resolutions, and scale image dimensions. Presets for 16:9 (YouTube), 9:16 (TikTok), 4:3, 1:1, and 21:9 ultrawide.',
      category: 'Design & Media',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Aspect Ratio Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Aspect Ratio & Resolution Scaler</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Find aspect ratios from pixel dimensions or scale video/image resolutions proportionally without distortion.
          </p>

          <div class="tool-box">
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              <span style="font-size: 0.8rem; color: var(--text-muted); width: 100%;">Popular Ratios:</span>
              <button type="button" class="btn-sec" onclick="setRatio(16, 9, 1920, 1080)">16:9 (YouTube / 1080p)</button>
              <button type="button" class="btn-sec" onclick="setRatio(9, 16, 1080, 1920)">9:16 (TikTok / Reels)</button>
              <button type="button" class="btn-sec" onclick="setRatio(4, 3, 1024, 768)">4:3 (SD / iPad)</button>
              <button type="button" class="btn-sec" onclick="setRatio(1, 1, 1080, 1080)">1:1 (Instagram)</button>
              <button type="button" class="btn-sec" onclick="setRatio(21, 9, 2560, 1080)">21:9 (Ultrawide)</button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
              <div class="field-group">
                <label class="field-label">Width (Pixels)</label>
                <input type="number" id="ar-w" class="code-input" value="1920" oninput="calcARWidth()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Height (Pixels)</label>
                <input type="number" id="ar-h" class="code-input" value="1080" oninput="calcARHeight()" style="font-size: 1.25rem;" />
              </div>
            </div>

            <div class="result-card" style="margin-top: 1.5rem;">
              <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Aspect Ratio</div>
              <div id="ar-res" class="result-val">16:9</div>
              <div id="ar-factor" style="font-size: 0.95rem; color: var(--text-muted); font-family: var(--mono); margin-top: 0.5rem;">Decimal Factor: 1.778:1</div>
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

          var lockedRatio = 16 / 9;

          function calcAR() {
            var w = parseInt(document.getElementById('ar-w').value, 10) || 1;
            var h = parseInt(document.getElementById('ar-h').value, 10) || 1;

            var g = gcdAR(w, h);
            var rw = w / g;
            var rh = h / g;

            document.getElementById('ar-res').textContent = rw + ':' + rh;
            document.getElementById('ar-factor').textContent = 'Decimal Factor: ' + (w / h).toFixed(3) + ':1';
          }

          function calcARWidth() {
            var w = parseInt(document.getElementById('ar-w').value, 10) || 1;
            document.getElementById('ar-h').value = Math.round(w / lockedRatio);
            calcAR();
          }

          function calcARHeight() {
            var h = parseInt(document.getElementById('ar-h').value, 10) || 1;
            document.getElementById('ar-w').value = Math.round(h * lockedRatio);
            calcAR();
          }

          window.setRatio = function(rw, rh, defW, defH) {
            lockedRatio = rw / rh;
            document.getElementById('ar-w').value = defW;
            document.getElementById('ar-h').value = defH;
            calcAR();
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
              <label class="field-label">Enter Numbers (Comma or Space Separated)</label>
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
            </div>
          </div>
        </div>

        <script>
          function calcSD() {
            var text = document.getElementById('sd-data').value;
            var nums = text.split(/[,\\s]+/).map(parseFloat).filter(function(n) { return !isNaN(n); });

            if (nums.length < 2) {
              document.getElementById('sd-s').textContent = '-';
              document.getElementById('sd-p').textContent = '-';
              document.getElementById('sd-mean').textContent = nums.length === 1 ? nums[0].toFixed(2) : '-';
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

            document.getElementById('sd-s').textContent = sampleSD.toFixed(4);
            document.getElementById('sd-s-var').textContent = 'Variance (s²): ' + sampleVar.toFixed(4);

            document.getElementById('sd-p').textContent = popSD.toFixed(4);
            document.getElementById('sd-p-var').textContent = 'Variance (σ²): ' + popVar.toFixed(4);

            document.getElementById('sd-mean').textContent = mean.toFixed(2);
            document.getElementById('sd-count').textContent = 'Count (N): ' + n + ' | Sum: ' + sum.toLocaleString('en-US');
          }

          document.addEventListener('DOMContentLoaded', calcSD);
          calcSD();
        </script>
      `
    },
    {
      slug: 'markup-margin-calculator',
      title: 'Markup vs Margin Calculator (Gross Profit & Selling Price)',
      metaDesc: 'Understand the difference between markup and profit margin. Calculate selling price, gross profit, and cost of goods sold (COGS).',
      category: 'Finance & eCommerce',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Markup vs Margin
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Markup vs. Profit Margin Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Convert between cost markup and gross profit margin to ensure your retail products, client services, and quotes are profitable.
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
                <label class="field-label">Profit Margin (% of Revenue)</label>
                <input type="number" id="mm-margin" class="code-input" value="33.33" min="0" max="99.9" step="0.5" oninput="calcMMFromMargin()" style="font-size: 1.25rem;" />
              </div>
            </div>

            <div class="result-card" style="margin-top: 1.5rem;">
              <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Recommended Selling Price</div>
              <div id="mm-price" class="result-val" style="color: #10b981;">$60.00</div>
              <div id="mm-profit" style="font-size: 1.1rem; color: #3b82f6; font-family: var(--mono); margin-top: 0.4rem;">Gross Profit: $20.00</div>
              <div id="mm-expl" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono); margin-top: 0.5rem;">
                50% Markup = 33.3% Gross Margin
              </div>
            </div>
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
            document.getElementById('mm-profit').textContent = 'Gross Profit: $' + profit.toFixed(2);
            document.getElementById('mm-expl').textContent = markup.toFixed(1) + '% Markup on Cost = ' + margin.toFixed(1) + '% Gross Margin';
          }

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
