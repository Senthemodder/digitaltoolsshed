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
  "slug": "percentage-calculator",
  "title": "Percentage Calculator — 5-in-1 Master Solver with Proportional Bar",
  "metaDesc": "Free online percentage calculator. 5-in-1 solver for percentage of a number, proportion, percentage increase/decrease, reverse percentages, and relative difference with interactive SVG visual proportion bar.",
  "category": "Math & Finance",
  "faq": [
    {
      "q": "How do you calculate the percentage of a number?",
      "a": "To calculate the percentage of any number, divide the percentage by 100 to convert it into a decimal, then multiply by the total base value: Value = (P / 100) × Base. For example, to find 15% of 240: (15 / 100) × 240 = 0.15 × 240 = 36."
    },
    {
      "q": "How do you calculate percentage increase or decrease?",
      "a": "To calculate percentage change between an original value and a new value, subtract the original value from the new value, divide by the absolute original value, and multiply by 100%: Percentage Change = [(New - Old) / |Old|] × 100%. A positive result indicates growth (increase); a negative result indicates contraction (decrease)."
    },
    {
      "q": "Why does a 50% loss require a 100% gain to break even?",
      "a": "This is the mathematical law of asymmetric recovery. If a $100 investment falls by 50%, its value drops to $50. To return to the original $100, that remaining $50 must gain $50, which is a 100% increase on its new reduced base. Similarly, an 80% loss requires a 400% gain to recover."
    },
    {
      "q": "What is a reverse percentage and how is an original price found?",
      "a": "A reverse percentage calculates the original value before a discount, markup, or sales tax was added. If an item costs $80 after a 20% discount, that $80 represents 80% (100% - 20%) of the original price. Divide the final price by the decimal remaining fraction: $80 / 0.80 = $100.00 original price."
    },
    {
      "q": "What is the difference between percentage change and percentage difference?",
      "a": "Percentage change has chronological direction (from an old value to a new value) and divides by the original starting baseline. Percentage difference compares two concurrent values without directional order and divides by the average (mean) of both values: Difference % = [|A - B| / ((A + B) / 2)] × 100%."
    }
  ],
  "body": "\n<div class=\"article-container\" style=\"max-width:1050px;margin:0 auto;padding:1.5rem 1rem;\">\n  <nav style=\"font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);\">\n    <a href=\"/\">Home</a> &gt; <a href=\"/math/\">Math &amp; Finance</a> &gt; Percentage Calculator\n  </nav>\n\n  <header style=\"margin-bottom:2rem;text-align:center;\">\n    <h1 style=\"font-family:var(--serif);font-size:2.2rem;margin-bottom:0.5rem;letter-spacing:-0.02em;\">5-in-1 Master Percentage Solver</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;max-width:780px;margin:0 auto;line-height:1.6;\">\n      Instant bidirectional solver for percentage of a number, part-to-whole proportions, percentage increase/decrease with asymmetric recovery, reverse original prices, and relative difference.\n    </p>\n  </header>\n\n  <!-- SOLVER MODE TABS -->\n  <div style=\"display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin-bottom:2rem;\">\n    <button type=\"button\" id=\"tabPctOfNum\" class=\"pct-tab-btn\" style=\"padding:0.6rem 1rem;background:#3b82f6;color:#ffffff;border:1px solid #3b82f6;border-radius:8px;font-weight:600;font-size:0.9rem;cursor:pointer;\">1. % of a Number</button>\n    <button type=\"button\" id=\"tabWhatPct\" class=\"pct-tab-btn\" style=\"padding:0.6rem 1rem;background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:8px;font-weight:600;font-size:0.9rem;cursor:pointer;\">2. What % is X of Y?</button>\n    <button type=\"button\" id=\"tabChange\" class=\"pct-tab-btn\" style=\"padding:0.6rem 1rem;background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:8px;font-weight:600;font-size:0.9rem;cursor:pointer;\">3. % Change (Inc / Dec)</button>\n    <button type=\"button\" id=\"tabReverse\" class=\"pct-tab-btn\" style=\"padding:0.6rem 1rem;background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:8px;font-weight:600;font-size:0.9rem;cursor:pointer;\">4. Reverse (Original Price)</button>\n    <button type=\"button\" id=\"tabDiff\" class=\"pct-tab-btn\" style=\"padding:0.6rem 1rem;background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:8px;font-weight:600;font-size:0.9rem;cursor:pointer;\">5. % Difference</button>\n  </div>\n\n  <div style=\"display:grid;grid-template-columns:1fr;gap:2rem;margin-bottom:2.5rem;\" class=\"calc-grid\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 id=\"pctModeTitle\" style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M9 9h.01M15 15h.01M9 15l6-6\"/></svg>\n        Calculate Percentage of a Value\n      </h2>\n\n      <!-- DYNAMIC INPUT FIELDS -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.5rem;\">\n        <div>\n          <label id=\"lblInputA\" style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"pctInputA\">Percentage (%)</label>\n          <input type=\"number\" id=\"pctInputA\" value=\"15\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.2rem;\">\n        </div>\n        <div>\n          <label id=\"lblInputB\" style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"pctInputB\">Total Base Value</label>\n          <input type=\"number\" id=\"pctInputB\" value=\"240\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.2rem;\">\n        </div>\n      </div>\n\n      <!-- QUICK PRESETS ROW -->\n      <div id=\"quickPresetsContainer\" style=\"margin-bottom:1.25rem;\">\n        <span style=\"font-size:0.75rem;font-weight:600;color:var(--text-muted);display:block;text-transform:uppercase;margin-bottom:0.5rem;\">Quick Presets:</span>\n        <div style=\"display:flex;gap:0.4rem;flex-wrap:wrap;\">\n          <button type=\"button\" class=\"preset-btn\" onclick=\"applyPreset(5)\" style=\"padding:0.35rem 0.65rem;border:1px solid var(--border);background:var(--bg);color:var(--fg);border-radius:6px;font-family:var(--mono);font-size:0.8rem;cursor:pointer;\">5%</button>\n          <button type=\"button\" class=\"preset-btn\" onclick=\"applyPreset(10)\" style=\"padding:0.35rem 0.65rem;border:1px solid var(--border);background:var(--bg);color:var(--fg);border-radius:6px;font-family:var(--mono);font-size:0.8rem;cursor:pointer;\">10%</button>\n          <button type=\"button\" class=\"preset-btn\" onclick=\"applyPreset(15)\" style=\"padding:0.35rem 0.65rem;border:1px solid var(--border);background:var(--bg);color:var(--fg);border-radius:6px;font-family:var(--mono);font-size:0.8rem;cursor:pointer;\">15%</button>\n          <button type=\"button\" class=\"preset-btn\" onclick=\"applyPreset(20)\" style=\"padding:0.35rem 0.65rem;border:1px solid var(--border);background:var(--bg);color:var(--fg);border-radius:6px;font-family:var(--mono);font-size:0.8rem;cursor:pointer;\">20%</button>\n          <button type=\"button\" class=\"preset-btn\" onclick=\"applyPreset(25)\" style=\"padding:0.35rem 0.65rem;border:1px solid var(--border);background:var(--bg);color:var(--fg);border-radius:6px;font-family:var(--mono);font-size:0.8rem;cursor:pointer;\">25%</button>\n          <button type=\"button\" class=\"preset-btn\" onclick=\"applyPreset(50)\" style=\"padding:0.35rem 0.65rem;border:1px solid var(--border);background:var(--bg);color:var(--fg);border-radius:6px;font-family:var(--mono);font-size:0.8rem;cursor:pointer;\">50%</button>\n        </div>\n      </div>\n    </div>\n\n    <!-- SUMMARY & OUTPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg>\n            Calculation Solution\n          </h2>\n          <button id=\"copyPctBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Solution</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span id=\"resPrimaryLabel\" style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Calculated Value</span>\n            <span id=\"resPrimaryVal\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:#3b82f6;display:block;\">36.00</span>\n            <span id=\"resPrimarySub\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">15% of 240</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span id=\"resSecondaryLabel\" style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Complement / Remaining</span>\n            <span id=\"resSecondaryVal\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">204.00</span>\n            <span id=\"resSecondarySub\" style=\"font-size:0.8rem;color:#10b981;font-weight:600;\">85% remaining portion</span>\n          </div>\n        </div>\n\n        <!-- MATHEMATICAL STEPS BREAKDOWN -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Arithmetic Steps</div>\n          <div id=\"mathStep1\" style=\"padding:0.35rem 0;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:0.875rem;\">\n            1. Convert percentage to decimal: 15 / 100 = 0.15\n          </div>\n          <div id=\"mathStep2\" style=\"padding:0.35rem 0;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:0.875rem;\">\n            2. Multiply by base: 0.15 × 240 = 36.00\n          </div>\n          <div id=\"mathStep3\" style=\"padding:0.35rem 0;font-family:var(--mono);font-size:0.875rem;color:#10b981;\">\n            3. Final Answer: 15% of 240 is exactly 36.00\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG PROPORTION BAR -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.5rem;\">\n      <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"2\" y=\"7\" width=\"20\" height=\"10\" rx=\"2\"/><line x1=\"12\" y1=\"7\" x2=\"12\" y2=\"17\"/></svg>\n      Visual Proportion &amp; Share Bar\n    </h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Proportional visualization representing the calculated percentage share (blue) versus the remaining balance (slate).\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"pctProportionSvg\" viewBox=\"0 0 800 160\" style=\"width:100%;height:auto;min-width:600px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & ALGEBRAIC DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Percentage Formulas &amp; Asymmetric Recovery Laws</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      A percentage is a dimensionless ratio expressing fractions of 100. Key formulas governing algebraic, financial, and geometric percentage calculations include:\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Basic Percentage of a Number:</strong><br>\n      V = \\left( \\frac{P}{100} \\right) \\times B<br><br>\n      <strong>2. Percentage Proportion (X is what % of Y):</strong><br>\n      P = \\left( \\frac{X}{Y} \\right) \\times 100\\%<br><br>\n      <strong>3. Chronological Percentage Change:</strong><br>\n      \\Delta\\% = \\left( \\frac{V_2 - V_1}{|V_1|} \\right) \\times 100\\%<br><br>\n      <strong>4. Asymmetric Break-Even Recovery Multiplier:</strong><br>\n      \\text{Gain Required to Break Even} = \\left( \\frac{1}{1 - L} - 1 \\right) \\times 100\\% \\quad \\text{where } L \\text{ is fractional loss}<br>\n      \\text{Example: A 50% loss (} L=0.5 \\text{) requires } \\left( \\frac{1}{0.5} - 1 \\right) = +100\\% \\text{ gain to recover!}<br><br>\n      <strong>5. Reverse Percentage (Original Price before Discount / Tax):</strong><br>\n      \\text{Original Price} = \\frac{\\text{Discounted Price}}{1 - (D / 100)} \\quad \\text{or} \\quad \\frac{\\text{Final Price with Tax}}{1 + (T / 100)}\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL PERCENTAGE TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Percentage Fallacies &amp; Costly Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">1. The Asymmetric Volatility Trap</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          If an investment portfolio falls by 50%, a 50% gain will NOT return you to even. A $100,000 account dropping 50% becomes $50,000. A subsequent 50% gain on $50,000 only brings you to $75,000. You need a 100% gain to recover from a 50% loss, and an 80% loss requires a 400% gain!\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">2. Adding Sequential Discounts (20% + 20% ≠ 40%)</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Shoppers frequently assume an extra 20% clearance coupon on an item already 20% off equals 40% off. In reality, discounts compound sequentially: $100 - 20% = $80. Taking 20% off $80 subtracts $16, resulting in $64 (a 36% total discount, not 40%).\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">3. Percentage Points vs. Percentage Change</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          If mortgage rates rise from 3% to 4%, the interest rate increased by <strong>1 percentage point</strong>, but your borrowing cost rose by <strong>33.3% relative percentage</strong>. Confusing percentage points with percentage change obscures huge financial impacts.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">4. Confusing Markup with Margin</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          A product bought for $100 and sold for $150 has a 50% markup ($50 profit / $100 cost), but only a 33.3% gross margin ($50 profit / $150 revenue). Business owners who set target margins using markup formulas underprice inventory and run out of cash.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">5. Incorrectly Reversing Sales Tax</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          If a receipt total is $108 with 8% sales tax, subtracting 8% ($108 - $8.64 = $99.36) is mathematically false! The tax was applied to the base, not the total. The correct reverse calculation is $108 / 1.08 = exactly $100.00 base and $8.00 tax.\n        </p>\n      </div>\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      var currentMode = 'pctOfNum'; // pctOfNum, whatPct, change, reverse, diff\n\n      function updateModeLabels() {\n        var lblA = document.getElementById('lblInputA');\n        var lblB = document.getElementById('lblInputB');\n        var inpA = document.getElementById('pctInputA');\n        var inpB = document.getElementById('pctInputB');\n        var title = document.getElementById('pctModeTitle');\n\n        if (currentMode === 'pctOfNum') {\n          title.innerHTML = '<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M9 9h.01M15 15h.01M9 15l6-6\"/></svg> Calculate Percentage of a Value';\n          lblA.textContent = 'Percentage (%)';\n          lblB.textContent = 'Total Base Value';\n          inpA.value = 15;\n          inpB.value = 240;\n        } else if (currentMode === 'whatPct') {\n          title.innerHTML = '<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"/><line x1=\"12\" y1=\"17\" x2=\"12.01\" y2=\"17\"/></svg> What % is Part of Total?';\n          lblA.textContent = 'Part Value (X)';\n          lblB.textContent = 'Whole / Total (Y)';\n          inpA.value = 36;\n          inpB.value = 240;\n        } else if (currentMode === 'change') {\n          title.innerHTML = '<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"23 6 13.5 15.5 8.5 10.5 1 18\"/><polyline points=\"17 6 23 6 23 12\"/></svg> Percentage Increase or Decrease';\n          lblA.textContent = 'Initial Old Value (V1)';\n          lblB.textContent = 'Final New Value (V2)';\n          inpA.value = 80;\n          inpB.value = 120;\n        } else if (currentMode === 'reverse') {\n          title.innerHTML = '<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/></svg> Reverse Percentage (Find Original Price)';\n          lblA.textContent = 'Discount or Tax Rate (%)';\n          lblB.textContent = 'Final Paid Amount ($)';\n          inpA.value = 20;\n          inpB.value = 80;\n        } else if (currentMode === 'diff') {\n          title.innerHTML = '<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"/></svg> Percentage Difference Between Two Values';\n          lblA.textContent = 'First Value (A)';\n          lblB.textContent = 'Second Value (B)';\n          inpA.value = 100;\n          inpB.value = 125;\n        }\n\n        calcPct();\n      }\n\n      function calcPct() {\n        var a = parseFloat(document.getElementById('pctInputA').value) || 0;\n        var b = parseFloat(document.getElementById('pctInputB').value) || 0;\n\n        var pVal = 0, sVal = 0, pctShare = 0;\n        var pLbl = '', sLbl = '', pSub = '', sSub = '';\n        var step1 = '', step2 = '', step3 = '';\n\n        if (currentMode === 'pctOfNum') {\n          pVal = (a / 100) * b;\n          sVal = b - pVal;\n          pctShare = Math.min(100, Math.max(0, a));\n\n          pLbl = 'Calculated ' + a + '% Share';\n          sLbl = 'Remaining ' + (100 - a) + '% Share';\n          pSub = a + '% of ' + b;\n          sSub = (100 - a) + '% remaining';\n\n          step1 = '1. Convert rate to decimal: ' + a + ' / 100 = ' + (a / 100).toFixed(4);\n          step2 = '2. Multiply by base value: ' + (a / 100).toFixed(4) + ' × ' + b + ' = ' + pVal.toFixed(2);\n          step3 = '3. Result: ' + a + '% of ' + b + ' is exactly ' + pVal.toFixed(2);\n        } else if (currentMode === 'whatPct') {\n          pVal = (b !== 0) ? (a / b) * 100 : 0;\n          sVal = 100 - pVal;\n          pctShare = Math.min(100, Math.max(0, pVal));\n\n          pLbl = 'Percentage Share';\n          sLbl = 'Complement Percentage';\n          pSub = a + ' out of ' + b;\n          sSub = (b - a).toFixed(2) + ' remaining';\n\n          step1 = '1. Divide part by whole: ' + a + ' / ' + b + ' = ' + (b !== 0 ? (a / b).toFixed(4) : 0);\n          step2 = '2. Convert to percentage: ' + (b !== 0 ? (a / b).toFixed(4) : 0) + ' × 100 = ' + pVal.toFixed(2) + '%';\n          step3 = '3. Result: ' + a + ' is ' + pVal.toFixed(2) + '% of ' + b;\n        } else if (currentMode === 'change') {\n          var delta = b - a;\n          pVal = (a !== 0) ? (delta / Math.abs(a)) * 100 : 0;\n          var isInc = pVal >= 0;\n\n          // Asymmetric recovery calculation\n          var recovGain = 0;\n          if (!isInc && Math.abs(pVal) < 100) {\n            var lossFrac = Math.abs(pVal) / 100;\n            recovGain = ((1 / (1 - lossFrac)) - 1) * 100;\n          }\n\n          pLbl = isInc ? 'Percentage Increase (+)' : 'Percentage Decrease (-)';\n          sLbl = isInc ? 'Absolute Dollar/Unit Gain' : 'Break-Even Recovery Needed';\n          pSub = 'From ' + a + ' to ' + b;\n          sSub = isInc ? '+' + delta.toFixed(2) + ' net units' : '+' + recovGain.toFixed(1) + '% gain needed to break even!';\n\n          sVal = isInc ? delta : recovGain;\n          pctShare = Math.min(100, Math.max(0, (b / (a + b || 1)) * 100));\n\n          step1 = '1. Calculate difference: ' + b + ' - ' + a + ' = ' + delta.toFixed(2);\n          step2 = '2. Divide by initial starting base: ' + delta.toFixed(2) + ' / |' + a + '| = ' + (a !== 0 ? (delta / Math.abs(a)).toFixed(4) : 0);\n          step3 = '3. Result: ' + (isInc ? '+' : '') + pVal.toFixed(2) + '% ' + (isInc ? 'Increase' : 'Decrease');\n        } else if (currentMode === 'reverse') {\n          // b is final, a is discount\n          pVal = (a < 100) ? b / (1 - (a / 100)) : 0;\n          sVal = pVal - b;\n          pctShare = Math.min(100, Math.max(0, 100 - a));\n\n          pLbl = 'Original Base Price';\n          sLbl = 'Total Discount Saved';\n          pSub = 'Before ' + a + '% discount';\n          sSub = '$' + sVal.toFixed(2) + ' saved';\n\n          step1 = '1. Calculate remaining fraction: 100% - ' + a + '% = ' + (100 - a) + '% (or ' + ((100 - a) / 100).toFixed(2) + ')';\n          step2 = '2. Divide final price by remaining fraction: ' + b + ' / ' + ((100 - a) / 100).toFixed(2) + ' = ' + pVal.toFixed(2);\n          step3 = '3. Result: Original price before ' + a + '% discount was $' + pVal.toFixed(2);\n        } else if (currentMode === 'diff') {\n          var diff = Math.abs(a - b);\n          var avg = (a + b) / 2;\n          pVal = (avg !== 0) ? (diff / avg) * 100 : 0;\n          sVal = avg;\n          pctShare = (a + b > 0) ? (a / (a + b)) * 100 : 50;\n\n          pLbl = 'Percentage Difference';\n          sLbl = 'Average Midpoint';\n          pSub = '|' + a + ' - ' + b + '| / Average';\n          sSub = 'Average = ' + avg.toFixed(2);\n\n          step1 = '1. Calculate absolute difference: |' + a + ' - ' + b + '| = ' + diff.toFixed(2);\n          step2 = '2. Calculate midpoint average: (' + a + ' + ' + b + ') / 2 = ' + avg.toFixed(2);\n          step3 = '3. Result: Relative difference between ' + a + ' and ' + b + ' is ' + pVal.toFixed(2) + '%';\n        }\n\n        document.getElementById('resPrimaryLabel').textContent = pLbl;\n        document.getElementById('resSecondaryLabel').textContent = sLbl;\n        document.getElementById('resPrimaryVal').textContent = (currentMode === 'whatPct' || currentMode === 'change' || currentMode === 'diff') ? pVal.toFixed(2) + '%' : pVal.toFixed(2);\n        document.getElementById('resSecondaryVal').textContent = (currentMode === 'change' && pVal < 0) ? '+' + sVal.toFixed(1) + '%' : sVal.toFixed(2);\n        document.getElementById('resPrimarySub').textContent = pSub;\n        document.getElementById('resSecondarySub').textContent = sSub;\n\n        document.getElementById('mathStep1').textContent = step1;\n        document.getElementById('mathStep2').textContent = step2;\n        document.getElementById('mathStep3').textContent = step3;\n\n        renderProportionSvg(pctShare);\n      }\n\n      function renderProportionSvg(pct) {\n        var svg = document.getElementById('pctProportionSvg');\n        if (!svg) return;\n\n        var svgHtml = '';\n        var clampedPct = Math.min(100, Math.max(0, pct));\n        var barW = 680;\n        var fillW = (clampedPct / 100) * barW;\n\n        // Background Bar\n        svgHtml += '<rect x=\"60\" y=\"45\" width=\"' + barW + '\" height=\"50\" fill=\"#cbd5e1\" opacity=\"0.4\" rx=\"6\"/>';\n\n        // Filled Share Bar\n        if (fillW > 0) {\n          svgHtml += '<rect x=\"60\" y=\"45\" width=\"' + fillW + '\" height=\"50\" fill=\"#3b82f6\" rx=\"6\"/>';\n        }\n\n        // Percentage text inside/outside\n        svgHtml += '<text x=\"75\" y=\"75\" fill=\"#ffffff\" font-size=\"14\" font-weight=\"bold\">' + clampedPct.toFixed(1) + '%</text>';\n        if (clampedPct < 85) {\n          svgHtml += '<text x=\"' + (60 + fillW + 15) + '\" y=\"75\" fill=\"var(--fg)\" font-size=\"14\" font-weight=\"bold\">' + (100 - clampedPct).toFixed(1) + '% Remaining</text>';\n        }\n\n        // Tick marks 0, 25, 50, 75, 100\n        [0, 25, 50, 75, 100].forEach(function(tick) {\n          var tx = 60 + ((tick / 100) * barW);\n          svgHtml += '<line x1=\"' + tx + '\" y1=\"95\" x2=\"' + tx + '\" y2=\"105\" stroke=\"var(--border)\" stroke-width=\"2\"/>';\n          svgHtml += '<text x=\"' + tx + '\" y=\"125\" text-anchor=\"middle\" fill=\"var(--text-muted)\" font-size=\"11\">' + tick + '%</text>';\n        });\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyPctSolution() {\n        var res = document.getElementById('resPrimaryVal').textContent;\n        var lbl = document.getElementById('resPrimaryLabel').textContent;\n        var sub = document.getElementById('resPrimarySub').textContent;\n        var s1 = document.getElementById('mathStep1').textContent;\n        var s2 = document.getElementById('mathStep2').textContent;\n        var s3 = document.getElementById('mathStep3').textContent;\n\n        var text = '📋 Percentage Calculation Solution\\n' +\n          '• Result: ' + res + ' (' + lbl + ')\\n' +\n          '• Context: ' + sub + '\\n' +\n          '• Steps:\\n  ' + s1 + '\\n  ' + s2 + '\\n  ' + s3 + '\\n\\n' +\n          'Calculated at digitaltoolsshed.com/math/percentage-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyPctBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Solution!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      // Tab handlers\n      var tabs = [\n        { id: 'tabPctOfNum', mode: 'pctOfNum' },\n        { id: 'tabWhatPct', mode: 'whatPct' },\n        { id: 'tabChange', mode: 'change' },\n        { id: 'tabReverse', mode: 'reverse' },\n        { id: 'tabDiff', mode: 'diff' }\n      ];\n\n      tabs.forEach(function(t) {\n        document.getElementById(t.id).addEventListener('click', function() {\n          currentMode = t.mode;\n          tabs.forEach(function(other) {\n            var btn = document.getElementById(other.id);\n            if (other.id === t.id) {\n              btn.style.background = '#3b82f6';\n              btn.style.color = '#ffffff';\n              btn.style.borderColor = '#3b82f6';\n            } else {\n              btn.style.background = 'var(--bg)';\n              btn.style.color = 'var(--fg)';\n              btn.style.borderColor = 'var(--border)';\n            }\n          });\n          updateModeLabels();\n        });\n      });\n\n      window.applyPreset = function(val) {\n        document.getElementById('pctInputA').value = val;\n        calcPct();\n      };\n\n      document.getElementById('pctInputA').addEventListener('input', calcPct);\n      document.getElementById('pctInputB').addEventListener('input', calcPct);\n      document.getElementById('copyPctBtn').addEventListener('click', copyPctSolution);\n\n      calcPct();\n    })();\n  </script>\n</div>\n"
},
    {
      slug: 'compound-interest',
      title: 'Compound Interest Calculator with Monthly Deposits & Growth Chart',
      metaDesc: 'Calculate compound interest with initial principal, recurring monthly contributions, inflation adjustment, and year-by-year amortization schedule.',
      category: 'Math & Finance',
      faq: [
        { q: 'What is compound interest and how does it work?', a: 'Compound interest is the interest calculated on the initial principal and also on the accumulated interest from previous periods. Unlike simple interest, which only grows linearly on the principal, compound interest grows exponentially because your earned interest continuously generates its own interest over time.' },
        { q: 'How do ongoing regular monthly contributions affect compound growth?', a: 'Regular monthly contributions dramatically accelerate the compounding flywheel. For example, investing $5,000 at 8% for 30 years without contributions grows to $50,313. Adding just $300 per month turns that into $497,844 ($113,000 invested, $384,844 interest earned). The ongoing deposits ensure new capital is constantly starting its own multi-year compounding curve.' },
        { q: 'What is the Rule of 72?', a: 'The Rule of 72 is a quick mental math shortcut to estimate how many years it takes for an investment to double at a fixed annual interest rate. Divide 72 by the annual interest rate: at 8% annual return, your money doubles in approximately 72 / 8 = 9 years; at 10%, it doubles in approximately 7.2 years.' },
        { q: 'What is the difference between nominal interest rate and real (inflation-adjusted) return?', a: 'The nominal rate is the stated percentage return before adjusting for purchasing power erosion. The real return accounts for inflation using the Fisher Equation: Real Rate = (1 + Nominal Rate) / (1 + Inflation Rate) - 1. If a portfolio gains 8% in a year when CPI inflation is 3%, the true real purchasing power growth is approximately 4.85%.' },
        { q: 'What is the difference between APR and APY?', a: 'Annual Percentage Rate (APR) reflects the simple annual interest rate without taking into account the effects of intra-year compounding. Annual Percentage Yield (APY) reflects the true effective annual rate including compounding: APY = (1 + r/n)^n - 1. For example, a 6.00% APR compounded monthly yields an APY of 6.17%.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Compound Interest
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Compound Interest &amp; Wealth Accumulator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Project long-term investment growth with initial principal, recurring regular contributions, compounding frequency, inflation adjustment, and an interactive amortization schedule.
          </p>

          <div class="tool-box">
            <!-- Quick Preset Buttons -->
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              <span style="font-size: 0.78rem; color: var(--text-muted); width: 100%;">Milestone Investment Strategies:</span>
              <button type="button" class="btn-sec" onclick="setCIPreset(10000, 500, 10, 30, 'S&amp;P 500 Historical (10%)')" style="font-size: 0.75rem; padding: 0.35rem 0.6rem; border-color: #10b981; color: #10b981; font-weight: bold;">S&amp;P 500 Index (10%)</button>
              <button type="button" class="btn-sec" onclick="setCIPreset(5000, 300, 7, 20, 'Moderate Growth (7%)')" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">Balanced 60/40 (7%)</button>
              <button type="button" class="btn-sec" onclick="setCIPreset(20000, 200, 4.5, 5, 'High-Yield Savings (4.5%)')" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">Cash HYSA (4.5%)</button>
              <button type="button" class="btn-sec" onclick="setCIPreset(2500, 250, 8, 18, 'Child 529 College Fund')" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">College 529 Fund (18 Yrs)</button>
            </div>

            <!-- Primary Inputs Grid -->
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Initial Starting Principal ($)</label>
                <input type="number" id="ci-principal" class="code-input" value="10000" min="0" step="500" oninput="calcCompound()" style="font-size: 1.2rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Regular Monthly Deposit ($)</label>
                <input type="number" id="ci-contrib" class="code-input" value="500" min="0" step="50" oninput="calcCompound()" style="font-size: 1.2rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Annual Interest Rate (% APR)</label>
                <input type="number" id="ci-rate" class="code-input" value="8.0" min="0" max="100" step="0.1" oninput="calcCompound()" style="font-size: 1.2rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Investment Duration (Years)</label>
                <input type="number" id="ci-years" class="code-input" value="25" min="1" max="60" step="1" oninput="calcCompound()" style="font-size: 1.2rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Compounding Frequency</label>
                <select id="ci-freq" class="code-input" onchange="calcCompound()">
                  <option value="12" selected>Monthly (12 times / year)</option>
                  <option value="365">Daily (365 times / year)</option>
                  <option value="4">Quarterly (4 times / year)</option>
                  <option value="1">Annually (1 time / year)</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Est. Inflation Rate (% / Year)</label>
                <input type="number" id="ci-inflation" class="code-input" value="2.5" min="0" max="20" step="0.1" oninput="calcCompound()" style="font-size: 1.2rem;" />
              </div>
            </div>

            <!-- Hero Output Results -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Future Portfolio Balance</div>
                <div id="ci-total" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">$544,228</div>
                <div id="ci-real-total" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">Real Purchasing Power: $293,526</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Compound Interest Earned</div>
                <div id="ci-i-out" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">$384,228</div>
                <div id="ci-i-pct" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">Interest is 70.6% of portfolio</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Principal Invested</div>
                <div id="ci-p-out" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: var(--fg); margin: 0.25rem 0;">$160,000</div>
                <div id="ci-p-breakdown" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">$10k start + $150k deposits</div>
              </div>
            </div>

            <!-- Visual Stacked Wealth Bar -->
            <div style="margin-top: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">
                <span>Wealth Composition:</span>
                <span id="ci-doubling-time" style="color: var(--fg);">Money Doubles Every ~9.0 Years (Rule of 72)</span>
              </div>
              <div style="display: flex; width: 100%; height: 26px; border-radius: 4px; overflow: hidden; font-family: var(--mono); font-size: 0.72rem; font-weight: bold; color: #fff; text-align: center; line-height: 26px;">
                <div id="ci-bar-start" style="width: 1.8%; background: #64748b;" title="Initial Principal">Start</div>
                <div id="ci-bar-contrib" style="width: 27.6%; background: #3b82f6;" title="Monthly Contributions">Deposits</div>
                <div id="ci-bar-interest" style="width: 70.6%; background: #10b981;" title="Compound Interest">Interest Earned</div>
              </div>
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted);">
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #64748b; border-radius: 2px;"></span> Initial Principal</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #3b82f6; border-radius: 2px;"></span> Recurring Deposits</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #10b981; border-radius: 2px;"></span> Compound Interest</span>
              </div>
            </div>

            <!-- Interactive Year-by-Year Growth Chart (Pure SVG) -->
            <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; color: var(--fg);">
                  📈 Multi-Year Growth Trajectory (Principal vs. Compound Growth):
                </div>
                <div style="display: flex; gap: 0.75rem; font-family: var(--mono); font-size: 0.72rem;">
                  <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 12px; height: 3px; background: #10b981;"></span> Total Balance</span>
                  <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 12px; height: 3px; background: #3b82f6;"></span> Total Contributions</span>
                </div>
              </div>
              <div style="width: 100%; height: 200px; position: relative;">
                <svg id="ci-growth-svg" width="100%" height="200" style="display: block; overflow: visible;"></svg>
              </div>
            </div>

            <!-- Year-by-Year Amortization Schedule Table -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; color: var(--fg);">
                  📅 Annual Wealth Accumulation Schedule:
                </div>
                <span id="ci-schedule-sub" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">25 Years Projected</span>
              </div>
              <div style="overflow-x: auto; max-height: 280px; overflow-y: auto;">
                <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; text-align: right;">
                  <thead style="position: sticky; top: 0; background: var(--surface-alt); z-index: 1;">
                    <tr style="border-bottom: 1px solid var(--border);">
                      <th style="padding: 0.4rem 0.6rem; text-align: center;">Year</th>
                      <th style="padding: 0.4rem 0.6rem;">Start Balance</th>
                      <th style="padding: 0.4rem 0.6rem; color: #3b82f6;">Annual Deposits</th>
                      <th style="padding: 0.4rem 0.6rem; color: #10b981;">Interest Earned</th>
                      <th style="padding: 0.4rem 0.6rem; color: var(--fg);">End Balance</th>
                    </tr>
                  </thead>
                  <tbody id="ci-schedule-tbody">
                    <!-- Populated dynamically -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopyCI" onclick="copyCompoundSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Investment Growth Projection &amp; Schedule
            </button>
          </div>

          <!-- Step-by-Step Worked Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Compound Interest Derivation</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Future Value of Annuity Formula</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              When ongoing monthly contributions are made, the future balance combines lump-sum compounding on the initial principal plus the future value of an ordinary annuity:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 1: Lump-Sum Principal Compounding</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem; word-break: break-all;">
                  A<sub>P</sub> = P &times; (1 + r/n)<sup>nt</sup>
                </div>
                <div id="ci-step-1" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  For $10,000 at 8% monthly over 25 years: $10,000 &times; (1 + 0.08/12)<sup>300</sup> = $10,000 &times; 7.34018 = <strong>$73,402</strong>.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 2: Future Value of Recurring Monthly Deposits</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem; word-break: break-all;">
                  A<sub>PMT</sub> = PMT &times; [ (1 + r/n)<sup>nt</sup> - 1 ] / (r/n)
                </div>
                <div id="ci-step-2" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  For $500/mo: $500 &times; [7.34018 - 1] / (0.006667) = $500 &times; 951.026 = <strong>$475,513</strong>.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981; font-weight: 700;">Step 3: Total Portfolio Balance &amp; Interest</strong>
                <div id="ci-step-3" style="color: #10b981; margin-top: 0.25rem;">
                  Total Balance = A<sub>P</sub> + A<sub>PMT</sub> = $73,402 + $475,513 = <strong>$548,915</strong> &bull; Interest = $548,915 - $160,000 = <strong>$388,915</strong>.
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Compounding Pitfalls & Wealth Traps -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Compounding Pitfalls &amp; Wealth Traps</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Inflation Erosion Reality:</strong> Nominal returns do not equal real purchasing power. If your portfolio returns 7.5% but consumer inflation runs at 3.0%, your real compound growth rate is only ~4.37% via the Fisher Equation [(1 + 0.075) / (1 + 0.03) - 1]. Always adjust long-term retirement targets for inflation.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Devastating Drag of Expense Ratios (Reverse Compounding):</strong> A seemingly harmless 1.5% annual management fee or fund expense ratio doesn\'t take 1.5% of your gains—it compounds in reverse against your growing balance. Over a 30-year horizon, a 1.5% fee consumes over <strong>33% of your total potential portfolio value</strong>.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Compounding Frequency Myth:</strong> Many beginners fixate on compounding daily vs monthly. In reality, shifting from monthly to daily compounding on $10,000 at 7% over 10 years yields only an extra ~$6 total! The true driver of compound wealth is <strong>time and ongoing regular principal additions</strong>, not hyper-frequent compounding.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Taxes in Non-Sheltered Accounts:</strong> In a taxable brokerage account, realizing dividends and capital gains every year triggers immediate tax drag, cutting annual compound efficiency by 15% to 25%. Prioritize tax-advantaged vehicles (Roth IRA, 401(k), HSA) to compound tax-free.</li>
            </ul>
          </div>
        </div>

        <script>
          window.setCIPreset = function(p, pmt, r, t, desc) {
            document.getElementById('ci-principal').value = p;
            document.getElementById('ci-contrib').value = pmt;
            document.getElementById('ci-rate').value = r;
            document.getElementById('ci-years').value = t;
            calcCompound();
          };

          function calcCompound() {
            var P = parseFloat(document.getElementById('ci-principal').value) || 0;
            var PMT = parseFloat(document.getElementById('ci-contrib').value) || 0;
            var r = (parseFloat(document.getElementById('ci-rate').value) || 0) / 100;
            var t = parseFloat(document.getElementById('ci-years').value) || 1;
            var n = parseInt(document.getElementById('ci-freq').value, 10) || 12;
            var infRate = (parseFloat(document.getElementById('ci-inflation').value) || 0) / 100;

            // Monthly periodic interest rate
            var iPeriodic = r / 12;
            var totalMonths = Math.round(t * 12);

            // Compute year-by-year trajectory
            var currentBal = P;
            var totalDeposited = P;
            var scheduleData = [];

            for (var year = 1; year <= t; year++) {
              var startBal = currentBal;
              var annualDeposits = PMT * 12;

              // Compound month by month within the year
              for (var m = 1; m <= 12; m++) {
                currentBal = (currentBal * (1 + iPeriodic)) + PMT;
              }

              var endBal = currentBal;
              var interestThisYear = endBal - startBal - annualDeposits;
              totalDeposited += annualDeposits;

              scheduleData.push({
                year: year,
                start: startBal,
                deposits: annualDeposits,
                interest: interestThisYear,
                end: endBal,
                cumDeposits: totalDeposited
              });
            }

            var finalBal = currentBal;
            var totalInterest = finalBal - totalDeposited;
            var realPurchasingPower = infRate > 0 ? (finalBal / Math.pow(1 + infRate, t)) : finalBal;

            // Update Hero Outputs
            document.getElementById('ci-total').textContent = '$' + Math.round(finalBal).toLocaleString('en-US');
            document.getElementById('ci-real-total').textContent = 'Real Purchasing Power: $' + Math.round(realPurchasingPower).toLocaleString('en-US');

            document.getElementById('ci-i-out').textContent = '$' + Math.round(totalInterest).toLocaleString('en-US');
            var interestPct = finalBal > 0 ? ((totalInterest / finalBal) * 100).toFixed(1) : 0;
            document.getElementById('ci-i-pct').textContent = 'Interest is ' + interestPct + '% of portfolio';

            document.getElementById('ci-p-out').textContent = '$' + Math.round(totalDeposited).toLocaleString('en-US');
            var monthlyDepositsTotal = PMT * 12 * t;
            document.getElementById('ci-p-breakdown').textContent = '$' + Math.round(P).toLocaleString('en-US') + ' start + $' + Math.round(monthlyDepositsTotal).toLocaleString('en-US') + ' deposits';

            // Doubling time (Rule of 72)
            var dTime = r > 0 ? (72 / (r * 100)).toFixed(1) : '∞';
            document.getElementById('ci-doubling-time').textContent = 'Money Doubles Every ~' + dTime + ' Years (Rule of 72)';

            // Stacked bar
            if (finalBal > 0) {
              var startPct = ((P / finalBal) * 100);
              var contribPct = ((monthlyDepositsTotal / finalBal) * 100);
              var intPct = ((totalInterest / finalBal) * 100);

              document.getElementById('ci-bar-start').style.width = startPct.toFixed(1) + '%';
              document.getElementById('ci-bar-contrib').style.width = contribPct.toFixed(1) + '%';
              document.getElementById('ci-bar-interest').style.width = intPct.toFixed(1) + '%';
            }

            // Render Schedule Table
            document.getElementById('ci-schedule-sub').textContent = t + ' Years Projected (' + totalMonths + ' Months)';
            var tbody = document.getElementById('ci-schedule-tbody');
            var tbHtml = '';
            for (var y = 0; y < scheduleData.length; y++) {
              var row = scheduleData[y];
              tbHtml += '<tr style="border-bottom: 1px solid var(--border);">' +
                '<td style="padding: 0.4rem 0.6rem; text-align: center; color: var(--text-muted); font-weight: bold;">' + row.year + '</td>' +
                '<td style="padding: 0.4rem 0.6rem;">$' + Math.round(row.start).toLocaleString('en-US') + '</td>' +
                '<td style="padding: 0.4rem 0.6rem; color: #3b82f6;">$' + Math.round(row.deposits).toLocaleString('en-US') + '</td>' +
                '<td style="padding: 0.4rem 0.6rem; color: #10b981; font-weight: bold;">+$' + Math.round(row.interest).toLocaleString('en-US') + '</td>' +
                '<td style="padding: 0.4rem 0.6rem; font-weight: bold; color: var(--fg);">$' + Math.round(row.end).toLocaleString('en-US') + '</td>' +
                '</tr>';
            }
            tbody.innerHTML = tbHtml;

            // Draw SVG Chart
            drawCIGrowthChart(scheduleData, P, finalBal);

            // Update step text
            document.getElementById('ci-step-1').innerHTML = 'For $' + P.toLocaleString('en-US') + ' at ' + (r * 100).toFixed(1) + '% monthly over ' + t + ' years: <strong>$' + Math.round(P * Math.pow(1 + (r/12), 12*t)).toLocaleString('en-US') + '</strong>.';
            document.getElementById('ci-step-2').innerHTML = 'For $' + PMT.toLocaleString('en-US') + '/mo recurring additions: <strong>$' + Math.round(finalBal - (P * Math.pow(1 + (r/12), 12*t))).toLocaleString('en-US') + '</strong>.';
            document.getElementById('ci-step-3').innerHTML = 'Total Balance: <strong>$' + Math.round(finalBal).toLocaleString('en-US') + '</strong> &bull; Total Compound Interest: <strong style="color: #10b981;">+$' + Math.round(totalInterest).toLocaleString('en-US') + '</strong>.';
          }

          function drawCIGrowthChart(data, startP, maxVal) {
            var svg = document.getElementById('ci-growth-svg');
            if (!svg) return;
            var w = svg.clientWidth || 800;
            var h = 200;
            var padL = 50;
            var padR = 25;
            var padT = 15;
            var padB = 25;
            var plotW = w - padL - padR;
            var plotH = h - padT - padB;

            if (data.length === 0 || maxVal <= 0) return;

            var pointsTotal = [];
            var pointsDeposits = [];

            // Add year 0
            pointsTotal.push({ x: padL, y: padT + plotH - ((startP / maxVal) * plotH) });
            pointsDeposits.push({ x: padL, y: padT + plotH - ((startP / maxVal) * plotH) });

            for (var i = 0; i < data.length; i++) {
              var d = data[i];
              var px = padL + ((i + 1) / data.length) * plotW;
              var pyTotal = padT + plotH - ((d.end / maxVal) * plotH);
              var pyDeposits = padT + plotH - ((d.cumDeposits / maxVal) * plotH);

              pointsTotal.push({ x: px, y: pyTotal });
              pointsDeposits.push({ x: px, y: pyDeposits });
            }

            var pathTotal = 'M ' + pointsTotal.map(function(p) { return p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' L ');
            var pathDeposits = 'M ' + pointsDeposits.map(function(p) { return p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' L ');

            // Area polygon for total
            var areaTotal = pathTotal + ' L ' + (padL + plotW) + ' ' + (padT + plotH) + ' L ' + padL + ' ' + (padT + plotH) + ' Z';
            // Area polygon for deposits
            var areaDeposits = pathDeposits + ' L ' + (padL + plotW) + ' ' + (padT + plotH) + ' L ' + padL + ' ' + (padT + plotH) + ' Z';

            var svgHtml = '';
            // Background grid lines
            for (var g = 0; g <= 4; g++) {
              var gy = padT + (g * (plotH / 4));
              var gVal = maxVal * (1 - (g / 4));
              svgHtml += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (padL + plotW) + '" y2="' + gy + '" stroke="var(--border)" stroke-width="1" stroke-dasharray="2,2" />';
              svgHtml += '<text x="' + (padL - 6) + '" y="' + (gy + 3) + '" font-family="monospace" font-size="9" fill="var(--text-muted)" text-anchor="end">$' + (gVal >= 1000000 ? (gVal / 1000000).toFixed(1) + 'M' : Math.round(gVal / 1000) + 'k') + '</text>';
            }

            // Fill areas
            svgHtml += '<path d="' + areaTotal + '" fill="#10b981" fill-opacity="0.25" />';
            svgHtml += '<path d="' + areaDeposits + '" fill="#3b82f6" fill-opacity="0.35" />';

            // Stroke lines
            svgHtml += '<path d="' + pathDeposits + '" fill="none" stroke="#3b82f6" stroke-width="2" />';
            svgHtml += '<path d="' + pathTotal + '" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" />';

            // Year markers on X-axis
            var stepYear = Math.max(1, Math.round(data.length / 5));
            for (var yr = stepYear; yr <= data.length; yr += stepYear) {
              var xPos = padL + (yr / data.length) * plotW;
              svgHtml += '<text x="' + xPos + '" y="' + (h - 6) + '" font-family="monospace" font-size="9" fill="var(--text-muted)" text-anchor="middle">Yr ' + yr + '</text>';
            }

            svg.innerHTML = svgHtml;
          }

          window.copyCompoundSummary = function() {
            var P = document.getElementById('ci-principal').value;
            var PMT = document.getElementById('ci-contrib').value;
            var r = document.getElementById('ci-rate').value;
            var t = document.getElementById('ci-years').value;
            var total = document.getElementById('ci-total').textContent;
            var real = document.getElementById('ci-real-total').textContent;
            var interest = document.getElementById('ci-i-out').textContent;
            var pOut = document.getElementById('ci-p-out').textContent;

            var text = [
              '=== COMPOUND INTEREST GROWTH PROJECTION ===',
              'Initial Principal: $' + parseFloat(P).toLocaleString('en-US'),
              'Monthly Contribution: $' + parseFloat(PMT).toLocaleString('en-US') + '/month',
              'Annual Interest Rate: ' + r + '% APR',
              'Investment Horizon: ' + t + ' Years',
              '------------------------------------------',
              'Future Portfolio Value: ' + total,
              real,
              'Total Compound Interest Earned: ' + interest,
              'Total Principal Invested: ' + pOut,
              '------------------------------------------',
              'Standard: Universal Future Value of Annuity Equation',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/compound-interest'
            ].join('\n');

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyCI');
              if (btn) {
                var old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Investment Projection!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', calcCompound);
          calcCompound();
        </script>
      `
    },
    {
  "slug": "mortgage-calculator",
  "title": "Mortgage Calculator with PITI, Amortization Schedule & Extra Payments",
  "metaDesc": "Free contractor-grade mortgage calculator. Computes exact PITI (Principal, Interest, Taxes, Insurance), PMI, extra payments, interest savings, and interactive SVG amortization schedule.",
  "category": "Math & Finance",
  "faq": [
    {
      "q": "What is included in a complete PITI mortgage payment?",
      "a": "PITI stands for Principal, Interest, Taxes, and Insurance. While your base loan payment covers Principal and Interest (P&I), most lenders establish an escrow account that collects 1/12th of your annual property taxes and homeowners insurance each month. If your down payment is under 20%, Private Mortgage Insurance (PMI) is also added."
    },
    {
      "q": "How does an extra monthly principal payment reduce mortgage payoff time?",
      "a": "Extra payments apply 100% directly toward reducing your loan principal, bypassing accrued interest. Because interest is recalculated monthly based on the remaining balance, lower principal permanently reduces all future interest accrual. Adding just $200/month on a $360,000 30-year mortgage cuts nearly 5 years off your term and saves over $70,000 in interest."
    },
    {
      "q": "What is Private Mortgage Insurance (PMI) and when does it cancel?",
      "a": "PMI is insurance that protects the lender if you default on your loan. Conventional loans require PMI if your down payment is less than 20% (loan-to-value ratio > 80%). Under the Homeowners Protection Act of 1998, lenders must automatically cancel PMI once your loan balance reaches 78% of the original home purchase value, or you can request cancellation once equity reaches 80%."
    },
    {
      "q": "What is the difference between a 15-year and a 30-year fixed-rate mortgage?",
      "a": "A 15-year mortgage has higher monthly payments (typically 30% to 45% higher) because principal is amortized in half the time. However, 15-year loans carry lower interest rates (typically 0.5% to 0.75% lower) and save well over 60% in total lifetime interest compared to a 30-year loan."
    },
    {
      "q": "Why does my mortgage payment increase in year two even with a fixed interest rate?",
      "a": "Even with a fixed interest rate, your monthly payment can increase due to your property tax escrow. Municipalities frequently reassess a home's property value following a sale to match the new purchase price. The resulting higher property taxes create an escrow shortage that the lender passes on through higher monthly payments."
    }
  ],
  "body": "\n<div class=\"article-container\" style=\"max-width:1050px;margin:0 auto;padding:1.5rem 1rem;\">\n  <nav style=\"font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);\">\n    <a href=\"/\">Home</a> &gt; <a href=\"/math/\">Math &amp; Finance</a> &gt; Mortgage Calculator\n  </nav>\n\n  <header style=\"margin-bottom:2rem;text-align:center;\">\n    <h1 style=\"font-family:var(--serif);font-size:2.2rem;margin-bottom:0.5rem;letter-spacing:-0.02em;\">PITI Mortgage & Amortization Calculator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;max-width:780px;margin:0 auto;line-height:1.6;\">\n      Calculate your complete monthly housing payment (Principal, Interest, Property Taxes, Homeowners Insurance, and PMI). Model extra monthly principal payments to calculate exact interest savings and loan payoff acceleration.\n    </p>\n  </header>\n\n  <div style=\"display:grid;grid-template-columns:1fr;gap:2rem;margin-bottom:2.5rem;\" class=\"calc-grid\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/><polyline points=\"9 22 9 12 15 12 15 22\"/></svg>\n        Loan Details & Property Expenses\n      </h2>\n\n      <!-- HOME PRICE & DOWN PAYMENT -->\n      <div style=\"display:grid;grid-template-columns:1.2fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"mortHomePrice\">Home Purchase Price ($)</label>\n          <input type=\"number\" id=\"mortHomePrice\" value=\"450000\" min=\"10000\" step=\"5000\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"mortDownPct\">Down Payment (%)</label>\n          <div style=\"display:grid;grid-template-columns:1fr 1.2fr;gap:0.5rem;\">\n            <input type=\"number\" id=\"mortDownPct\" value=\"20\" min=\"0\" max=\"95\" step=\"0.5\" style=\"width:100%;padding:0.65rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n            <span id=\"mortDownDollars\" style=\"padding:0.65rem 0.4rem;font-family:var(--mono);font-size:0.85rem;color:var(--text-muted);display:flex;align-items:center;\">$90,000</span>\n          </div>\n        </div>\n      </div>\n\n      <!-- INTEREST RATE & LOAN TERM -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"mortRate\">Interest Rate (% APR)</label>\n          <input type=\"number\" id=\"mortRate\" value=\"6.75\" min=\"0.1\" max=\"25\" step=\"0.125\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"mortTermYears\">Loan Term</label>\n          <select id=\"mortTermYears\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"30\" selected>30-Year Fixed Rate</option>\n            <option value=\"20\">20-Year Fixed Rate</option>\n            <option value=\"15\">15-Year Fixed Rate</option>\n            <option value=\"10\">10-Year Fixed Rate</option>\n          </select>\n        </div>\n      </div>\n\n      <!-- ESCROW: TAXES & INSURANCE -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"mortAnnualTax\">Annual Property Taxes ($)</label>\n          <input type=\"number\" id=\"mortAnnualTax\" value=\"5400\" min=\"0\" step=\"100\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n          <span style=\"font-size:0.75rem;color:var(--text-muted);\">(~1.2% national average)</span>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"mortAnnualIns\">Annual Homeowners Ins. ($)</label>\n          <input type=\"number\" id=\"mortAnnualIns\" value=\"1800\" min=\"0\" step=\"50\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n          <span style=\"font-size:0.75rem;color:var(--text-muted);\">(Hazard & fire policy)</span>\n        </div>\n      </div>\n\n      <!-- HOA & EXTRA PAYMENTS -->\n      <div style=\"display:grid;grid-template-columns:1fr 1.2fr;gap:1rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"mortMonthlyHOA\">Monthly HOA Dues ($)</label>\n          <input type=\"number\" id=\"mortMonthlyHOA\" value=\"0\" min=\"0\" step=\"25\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"mortExtraMonthly\">Extra Monthly Principal ($)</label>\n          <input type=\"number\" id=\"mortExtraMonthly\" value=\"200\" min=\"0\" step=\"50\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n      </div>\n    </div>\n\n    <!-- SUMMARY & OUTPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"23\"/><path d=\"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"/></svg>\n            Monthly Housing Takeoff (PITI)\n          </h2>\n          <button id=\"copyMortgageBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Takeoff</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Total Monthly PITI</span>\n            <span id=\"mortTotalMonthly\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:#3b82f6;display:block;\">$2,935</span>\n            <span id=\"mortPITIBreakdown\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">$2,335 P&amp;I + $600 Escrow</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Total Interest Paid</span>\n            <span id=\"mortTotalInterest\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">$480,528</span>\n            <span id=\"mortInterestSavedVal\" style=\"font-size:0.8rem;color:#10b981;font-weight:600;\">Saves $74,210 with extra</span>\n          </div>\n        </div>\n\n        <!-- PAYMENT COMPOSITION LEDGER -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Monthly Itemized Distribution</div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Principal &amp; Interest (P&amp;I):</span>\n            <strong id=\"mortPIVal\" style=\"font-family:var(--mono);color:#3b82f6;\">$2,335 / mo</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Property Taxes:</span>\n            <strong id=\"mortTaxVal\" style=\"font-family:var(--mono);color:var(--fg);\">$450 / mo</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Homeowners Insurance:</span>\n            <strong id=\"mortInsVal\" style=\"font-family:var(--mono);color:var(--fg);\">$150 / mo</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Private Mortgage Insurance (PMI):</span>\n            <strong id=\"mortPMIVal\" style=\"font-family:var(--mono);color:#ef4444;\">$0 / mo (20% Down)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;\">\n            <span>Loan Payoff Acceleration:</span>\n            <strong id=\"mortPayoffDelta\" style=\"font-family:var(--mono);color:#10b981;\">Pay off 4.8 Years Early</strong>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG AMORTIZATION WATERFALL -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.5rem;\">\n      <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"/></svg>\n      Amortization Balance & Cumulative Interest Decay Curve\n    </h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Visualization tracking remaining principal balance over time (blue) versus cumulative interest accrued (red), highlighting the critical \"amortization crossover point\" and extra payment velocity.\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"mortgageAmortSvg\" viewBox=\"0 0 800 280\" style=\"width:100%;height:auto;min-width:600px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & FINANCIAL DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Standard Fixed-Rate Amortization Formulas</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      Under federal banking standards, fixed-rate mortgage payments are derived using the actuarial annuity present-value formula. Monthly compounding calculates the exact periodic payment required to amortize principal $P_0$ to zero over $N$ months at periodic rate $r$:\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Monthly Principal &amp; Interest Formula:</strong><br>\n      M = P_0 \\times \\frac{r(1 + r)^N}{(1 + r)^N - 1}<br>\n      \\text{Where } r = \\frac{\\text{Annual Interest Rate}}{12}, \\quad N = \\text{Term Years} \\times 12, \\quad P_0 = \\text{Purchase Price} - \\text{Down Payment}<br><br>\n      <strong>2. Monthly Escrow Components (PITI):</strong><br>\n      \\text{Monthly Tax} = \\frac{\\text{Annual Property Tax}}{12}, \\quad \\text{Monthly Insurance} = \\frac{\\text{Annual Premium}}{12}<br>\n      \\text{Monthly PMI} = \\begin{cases} \\frac{P_0 \\times 0.0075}{12} & \\text{if } \\text{Down Payment} < 20\\% \\\\ 0 & \\text{if } \\text{Down Payment} \\ge 20\\% \\end{cases}<br><br>\n      <strong>3. Periodic Balance Recurrence:</strong><br>\n      I_k = B_{k-1} \\times r \\quad \\text{(Interest Due)}, \\qquad P_k = (M - I_k) + P_{\\text{extra}} \\quad \\text{(Principal Paid)}<br>\n      B_k = B_{k-1} - P_k \\quad \\text{(Ending Balance)}\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL MORTGAGE TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Mortgage Traps &amp; Hidden Lending Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">1. The Year-Two Escrow Shortage Shock</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Lenders calculate initial property tax escrow based on the previous homeowner's old tax assessment. In year two, county assessors reset taxable value to your actual new purchase price. The resulting tax increase creates an \"escrow shortage,\" causing lenders to hike monthly payments by $300 to $600 to recoup past deficits.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">2. Paying for Lender \"Discount Points\" You Never Recover</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Lenders encourage borrowers to buy \"discount points\" (paying 1% of the loan amount upfront to lower the interest rate by 0.25%). On a $400,000 loan, 2 points cost $8,000 upfront to save ~$65/month. The break-even period is 10.2 years. If you refinance or sell within 7 years, you lose thousands.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">3. FHA Loan MIP is Permanent (Unlike Conventional PMI)</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          On conventional loans, Private Mortgage Insurance (PMI) cancels automatically once equity reaches 20% to 22%. On FHA loans with less than 10% down, Mortgage Insurance Premium (MIP) remains for the entire 30-year life of the loan. The only way to eliminate FHA MIP is to refinance into a conventional mortgage.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">4. The \"Bi-Weekly Mortgage Payment\" Fee Scam</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Third-party companies charge $300 to $500 setup fees plus monthly maintenance to administer \"bi-weekly payment plans.\" Paying 26 half-payments a year simply equals 13 full payments (one extra payment per year). You can achieve the exact same interest savings for free by adding 1/12th of your monthly payment to principal each month.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">5. Miscalculating Early vs Late Prepayment Velocity</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          A $5,000 lump sum principal payment made in Year 2 saves over $22,000 in compounding interest over a 30-year loan because it eliminates 28 years of interest accrual on that capital. Making that same $5,000 payment in Year 26 saves less than $900 in interest. Early prepayment velocity is vastly superior to late payoff.\n        </p>\n      </div>\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      function calcMortgage() {\n        var price = parseFloat(document.getElementById('mortHomePrice').value) || 0;\n        var downPct = parseFloat(document.getElementById('mortDownPct').value) || 0;\n        var rate = parseFloat(document.getElementById('mortRate').value) || 0;\n        var termYears = parseInt(document.getElementById('mortTermYears').value) || 30;\n        var annualTax = parseFloat(document.getElementById('mortAnnualTax').value) || 0;\n        var annualIns = parseFloat(document.getElementById('mortAnnualIns').value) || 0;\n        var hoa = parseFloat(document.getElementById('mortMonthlyHOA').value) || 0;\n        var extraPrincipal = parseFloat(document.getElementById('mortExtraMonthly').value) || 0;\n\n        var downDollars = price * (downPct / 100);\n        document.getElementById('mortDownDollars').textContent = '$' + Math.round(downDollars).toLocaleString();\n\n        var principal = Math.max(0, price - downDollars);\n        var r = (rate / 100) / 12;\n        var n = termYears * 12;\n\n        var monthlyPI = 0;\n        if (r > 0 && n > 0 && principal > 0) {\n          monthlyPI = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);\n        }\n\n        var monthlyTax = annualTax / 12;\n        var monthlyIns = annualIns / 12;\n        var monthlyPMI = (downPct < 20 && principal > 0) ? (principal * 0.0075 / 12) : 0;\n\n        var totalMonthly = monthlyPI + monthlyTax + monthlyIns + monthlyPMI + hoa;\n\n        // Amortization simulation with & without extra payment\n        var balanceStd = principal;\n        var totalInterestStd = 0;\n        for (var m = 0; m < n; m++) {\n          var intPmt = balanceStd * r;\n          var prinPmt = monthlyPI - intPmt;\n          totalInterestStd += intPmt;\n          balanceStd = Math.max(0, balanceStd - prinPmt);\n          if (balanceStd <= 0) break;\n        }\n\n        var balanceExtra = principal;\n        var totalInterestExtra = 0;\n        var monthsToPayoff = 0;\n        var curveData = [];\n\n        for (var m2 = 0; m2 < n; m2++) {\n          var intPmt2 = balanceExtra * r;\n          var prinPmt2 = (monthlyPI - intPmt2) + extraPrincipal;\n          totalInterestExtra += intPmt2;\n          balanceExtra = Math.max(0, balanceExtra - prinPmt2);\n          monthsToPayoff++;\n\n          if (m2 % 12 === 0 || balanceExtra <= 0) {\n            curveData.push({\n              year: Math.round(m2 / 12),\n              balance: balanceExtra,\n              interest: totalInterestExtra\n            });\n          }\n\n          if (balanceExtra <= 0) break;\n        }\n\n        var interestSaved = Math.max(0, totalInterestStd - totalInterestExtra);\n        var yearsSaved = Math.max(0, (n - monthsToPayoff) / 12);\n\n        // Update DOM\n        document.getElementById('mortTotalMonthly').textContent = '$' + Math.round(totalMonthly).toLocaleString();\n        document.getElementById('mortPITIBreakdown').textContent = '$' + Math.round(monthlyPI).toLocaleString() + ' P&I + $' + Math.round(monthlyTax + monthlyIns + monthlyPMI).toLocaleString() + ' Escrow';\n        document.getElementById('mortTotalInterest').textContent = '$' + Math.round(totalInterestExtra).toLocaleString();\n        document.getElementById('mortInterestSavedVal').textContent = (extraPrincipal > 0) ? 'Saves $' + Math.round(interestSaved).toLocaleString() + ' with extra' : 'Standard 30-year amortization';\n\n        document.getElementById('mortPIVal').textContent = '$' + Math.round(monthlyPI).toLocaleString() + ' / mo';\n        document.getElementById('mortTaxVal').textContent = '$' + Math.round(monthlyTax).toLocaleString() + ' / mo';\n        document.getElementById('mortInsVal').textContent = '$' + Math.round(monthlyIns).toLocaleString() + ' / mo';\n        document.getElementById('mortPMIVal').textContent = (monthlyPMI > 0) ? '$' + Math.round(monthlyPMI).toLocaleString() + ' / mo (<20% Down)' : '$0 / mo (No PMI)';\n        document.getElementById('mortPayoffDelta').textContent = (extraPrincipal > 0) ? 'Pay off ' + yearsSaved.toFixed(1) + ' Years Early (' + (monthsToPayoff / 12).toFixed(1) + ' yrs)' : termYears + '-Year Standard Schedule';\n\n        renderMortgageSvg(curveData, principal, totalInterestStd, termYears);\n      }\n\n      function renderMortgageSvg(curve, origPrincipal, maxInterest, termYears) {\n        var svg = document.getElementById('mortgageAmortSvg');\n        if (!svg) return;\n\n        var svgHtml = '';\n        var x0 = 80, x1 = 730;\n        var y0 = 30, y1 = 220;\n        var maxVal = Math.max(origPrincipal, maxInterest) * 1.05;\n\n        // Grid lines\n        svgHtml += '<line x1=\"' + x0 + '\" y1=\"' + y1 + '\" x2=\"' + x1 + '\" y2=\"' + y1 + '\" stroke=\"var(--border)\" stroke-width=\"2\"/>';\n        svgHtml += '<line x1=\"' + x0 + '\" y1=\"' + y0 + '\" x2=\"' + x0 + '\" y2=\"' + y1 + '\" stroke=\"var(--border)\" stroke-width=\"2\"/>';\n\n        // Curve path for Balance (Blue)\n        var balPoints = [];\n        var intPoints = [];\n\n        curve.forEach(function(pt) {\n          var x = x0 + ((pt.year / termYears) * (x1 - x0));\n          var yBal = y1 - ((pt.balance / maxVal) * (y1 - y0));\n          var yInt = y1 - ((pt.interest / maxVal) * (y1 - y0));\n          balPoints.push(x.toFixed(1) + ',' + yBal.toFixed(1));\n          intPoints.push(x.toFixed(1) + ',' + yInt.toFixed(1));\n        });\n\n        // Balance line\n        svgHtml += '<polyline points=\"' + balPoints.join(' ') + '\" fill=\"none\" stroke=\"#3b82f6\" stroke-width=\"3\"/>';\n        // Interest line\n        svgHtml += '<polyline points=\"' + intPoints.join(' ') + '\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"3\" stroke-dasharray=\"6,4\"/>';\n\n        // X labels\n        svgHtml += '<text x=\"' + x0 + '\" y=\"' + (y1 + 20) + '\" fill=\"var(--text-muted)\" font-size=\"10\">Year 0</text>';\n        svgHtml += '<text x=\"' + ((x0 + x1) / 2) + '\" y=\"' + (y1 + 20) + '\" text-anchor=\"middle\" fill=\"var(--text-muted)\" font-size=\"10\">Year ' + Math.round(termYears / 2) + '</text>';\n        svgHtml += '<text x=\"' + x1 + '\" y=\"' + (y1 + 20) + '\" text-anchor=\"end\" fill=\"var(--text-muted)\" font-size=\"10\">Year ' + termYears + '</text>';\n\n        // Legend\n        svgHtml += '<line x1=\"120\" y1=\"260\" x2=\"145\" y2=\"260\" stroke=\"#3b82f6\" stroke-width=\"3\"/>';\n        svgHtml += '<text x=\"155\" y=\"264\" fill=\"var(--fg)\" font-size=\"11\">Remaining Principal Balance</text>';\n\n        svgHtml += '<line x1=\"370\" y1=\"260\" x2=\"395\" y2=\"260\" stroke=\"#ef4444\" stroke-width=\"3\" stroke-dasharray=\"6,4\"/>';\n        svgHtml += '<text x=\"405\" y=\"264\" fill=\"var(--fg)\" font-size=\"11\">Cumulative Interest Paid</text>';\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyMortgageTakeoff() {\n        var monthly = document.getElementById('mortTotalMonthly').textContent;\n        var pi = document.getElementById('mortPIVal').textContent;\n        var tax = document.getElementById('mortTaxVal').textContent;\n        var ins = document.getElementById('mortInsVal').textContent;\n        var pmi = document.getElementById('mortPMIVal').textContent;\n        var interest = document.getElementById('mortTotalInterest').textContent;\n        var delta = document.getElementById('mortPayoffDelta').textContent;\n        var price = document.getElementById('mortHomePrice').value;\n        var rate = document.getElementById('mortRate').value;\n        var term = document.getElementById('mortTermYears').value;\n\n        var text = '📋 Mortgage Loan & PITI Takeoff\\n' +\n          '• Home Price: $' + Number(price).toLocaleString() + ' (' + rate + '% APR, ' + term + '-Year Fixed)\\n' +\n          '• Total Monthly Payment: ' + monthly + ' PITI\\n' +\n          '• Principal & Interest: ' + pi + '\\n' +\n          '• Property Taxes: ' + tax + '\\n' +\n          '• Homeowners Insurance: ' + ins + '\\n' +\n          '• Private Mortgage Insurance: ' + pmi + '\\n' +\n          '• Total Loan Interest: ' + interest + '\\n' +\n          '• Payoff Schedule: ' + delta + '\\n\\n' +\n          'Calculated at digitaltoolsshed.com/math/mortgage-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyMortgageBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Takeoff!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      var inputs = ['mortHomePrice', 'mortDownPct', 'mortRate', 'mortTermYears', 'mortAnnualTax', 'mortAnnualIns', 'mortMonthlyHOA', 'mortExtraMonthly'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calcMortgage);\n          el.addEventListener('change', calcMortgage);\n        }\n      });\n\n      document.getElementById('copyMortgageBtn').addEventListener('click', copyMortgageTakeoff);\n\n      calcMortgage();\n    })();\n  </script>\n</div>\n"
},
      {
    slug: "tip-calculator",
    title: "Tip & Bill Split Calculator (Pre-Tax vs Post-Tax & Dollar Rounding)",
    metaDesc: "Calculate restaurant tips accurately on pre-tax subtotal or post-tax total, split bills evenly across 1 to 30 diners, round up to whole dollars for cash or Venmo, and inspect service quality benchmarks.",
    category: "Math & Finance",
    faq: [
        {
            "q": "Should you calculate tip on the pre-tax subtotal or post-tax total?",
            "a": "Proper dining etiquette, endorsed by the Emily Post Institute and restaurant industry standards, dictates that gratuity should be calculated on the pre-tax food and beverage subtotal. Sales tax is a mandatory government levy that does not reflect service quality; tipping on tax means you are paying a gratuity on government taxes. On a $150 meal with 9.5% sales tax ($14.25), tipping 20% on pre-tax is $30.00, whereas tipping on post-tax adds an unnecessary $2.85 surcharge."
        },
        {
            "q": "What is the standard tipping percentage for dining in the United States?",
            "a": "In the United States, standard gratuity benchmarks are: 15% for baseline acceptable service, 18% to 20% for good to attentive seated table service, and 22% to 25% for exceptional hospitality, sommeliers, or fine dining. For counter-service pickup where no table hospitality is provided, 0% to 10% is customary. Buffet attendants typically receive 10% for clearing plates and refilling drinks."
        },
        {
            "q": "How does rounding up to whole dollars or $5 increments simplify group payments?",
            "a": "Splitting bills down to exact cents ($34.83 each) creates friction when paying in cash or transferring funds via Venmo, Zelle, or Cash App. Choosing \"Round Total Per Person Up to Whole Dollar\" rounds $34.83 to $35.00, giving the server a modest extra tip ($0.17 per diner) while eliminating awkward cent transfers. Rounding to the nearest $5 makes cash bill settlement effortless without needing coins."
        },
        {
            "q": "What is the legal difference between an auto-gratuity and a voluntary tip?",
            "a": "Under IRS Revenue Ruling 2012-18, an automatic gratuity (e.g., \"18% added for parties of 6 or more\") is legally classified as a service charge, not a tip. Because the patron does not have the unrestricted right to determine the amount, the funds legally belong to the restaurant employer, must be treated as regular wages subject to payroll tax withholding, and are not required by federal law to be distributed directly to your server."
        },
        {
            "q": "Are restaurants allowed to deduct credit card processing fees from employee tips?",
            "a": "Yes, under federal Fair Labor Standards Act (FLSA) regulations and rulings in most US states (including California and New York under specific restrictions), an employer may deduct the actual transactional interchange fee (typically 2.0% to 2.75%) charged by the credit card processor to convert the charged tip into cash. However, the employer cannot deduct more than the actual merchant processing fee."
        }
    ],
    body: `
<div class="article-container" style="max-width:1050px;margin:0 auto;padding:1.5rem 1rem;">
  <nav style="font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);">
    <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Tip & Bill Split Calculator
  </nav>

  <header style="margin-bottom:2rem;text-align:center;">
    <h1 style="font-family:var(--serif);font-size:2.2rem;margin-bottom:0.5rem;letter-spacing:-0.02em;">Tip &amp; Bill Split Calculator</h1>
    <p style="color:var(--text-muted);font-size:1.05rem;max-width:750px;margin:0 auto;line-height:1.6;">
      Compute exact hospitality gratuity on pre-tax or post-tax totals, split expenses across groups, and round up to whole dollars for seamless cash and Venmo settlement.
    </p>
  </header>

  <style>
    .tip-box { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:1.75rem; margin-bottom:2rem; }
    .tip-grid-3 { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem; margin-bottom:1.25rem; }
    .tip-grid-4 { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1.5rem; }
    .tip-card { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; text-align:center; position:relative; }
    .tip-badge { position:absolute; top:8px; right:8px; font-family:var(--mono); font-size:0.65rem; padding:2px 6px; border-radius:4px; }
    .tip-tab-btn { background:var(--surface-alt); border:1px solid var(--border); color:var(--text-muted); padding:0.5rem 1rem; font-family:var(--mono); font-size:0.82rem; border-radius:4px; cursor:pointer; transition:all 0.15s ease; }
    .tip-tab-btn.active { background:#3b82f6; border-color:#2563eb; color:#ffffff; font-weight:600; }
    .tip-trap-card { background:var(--surface-alt); border-left:4px solid #ef4444; border-radius:0 6px 6px 0; padding:1rem 1.25rem; margin-bottom:1rem; }
    .tip-trap-title { font-family:var(--serif); font-weight:600; font-size:1.05rem; color:var(--fg); margin-bottom:0.25rem; }
    .tip-trap-desc { font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin:0; }
    .tip-svg-box { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; margin-top:1.5rem; }
  </style>

  <div class="tip-box">
    <!-- Row 1: Bill Amounts -->
    <div class="tip-grid-3">
      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Food &amp; Beverage Subtotal ($ USD)</label>
        <input type="number" id="tip-subtotal" value="85.00" min="0" step="0.5" oninput="calcTip()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.25rem;font-weight:bold;box-sizing:border-box;">
      </div>

      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Sales Tax ($ USD)</label>
        <input type="number" id="tip-tax" value="7.23" min="0" step="0.1" oninput="calcTip()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.25rem;font-weight:bold;box-sizing:border-box;">
      </div>

      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Number of Guests Splitting</label>
        <input type="number" id="tip-diners" value="2" min="1" max="50" step="1" oninput="calcTip()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.25rem;font-weight:bold;box-sizing:border-box;">
      </div>
    </div>

    <!-- Tip Percentage Selector Buttons -->
    <div style="margin-bottom:1.25rem;">
      <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.4rem;">Select Gratuity Rate</label>
      <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
        <button type="button" class="tip-tab-btn" onclick="setTipPct(10)">10% (Counter/Pickup)</button>
        <button type="button" class="tip-tab-btn" onclick="setTipPct(15)">15% (Baseline)</button>
        <button type="button" class="tip-tab-btn" onclick="setTipPct(18)">18% (Good)</button>
        <button type="button" class="tip-tab-btn active" id="btn-tip-20" onclick="setTipPct(20)">20% (Great Standard)</button>
        <button type="button" class="tip-tab-btn" onclick="setTipPct(22)">22% (Excellent)</button>
        <button type="button" class="tip-tab-btn" onclick="setTipPct(25)">25% (Fine Dining)</button>
      </div>
    </div>

    <!-- Row 2: Custom Rate & Options -->
    <div class="tip-grid-3">
      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Custom Tip Percentage (%)</label>
        <input type="number" id="tip-pct" value="20" min="0" max="100" step="0.5" oninput="onCustomTipInput()" style="width:100%;padding:0.6rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1rem;box-sizing:border-box;">
      </div>

      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Tipping Basis Policy</label>
        <select id="tip-basis" onchange="calcTip()" style="width:100%;padding:0.6rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:0.92rem;box-sizing:border-box;">
          <option value="pretax" selected>Pre-Tax Subtotal (Etiquette Standard)</option>
          <option value="posttax">Post-Tax Total (Includes Sales Tax)</option>
        </select>
      </div>

      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Settlement Rounding Option</label>
        <select id="tip-round" onchange="calcTip()" style="width:100%;padding:0.6rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:0.92rem;box-sizing:border-box;">
          <option value="exact" selected>Exact Cents ($0.01)</option>
          <option value="round_tip">Round Tip Up to Nearest Dollar</option>
          <option value="round_person">Round Per Person Up to Nearest $1</option>
          <option value="round_five">Round Per Person Up to Nearest $5</option>
        </select>
      </div>
    </div>

    <!-- Hero Metrics Cards -->
    <div class="tip-grid-4">
      <div class="tip-card" style="border-top:4px solid #10b981;">
        <span class="tip-badge" style="background:rgba(16,185,129,0.15);color:#10b981;">Each Diner</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Total Per Person</div>
        <div id="card-tip-person-tot" style="font-family:var(--mono);font-size:1.85rem;font-weight:bold;color:#10b981;">$54.62</div>
        <div id="card-tip-person-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Tip included: $8.50</div>
      </div>

      <div class="tip-card" style="border-top:4px solid #3b82f6;">
        <span class="tip-badge" style="background:rgba(59,130,246,0.15);color:#3b82f6;">Total Gratuity</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Tip Amount</div>
        <div id="card-tip-total-amt" style="font-family:var(--mono);font-size:1.85rem;font-weight:bold;color:#3b82f6;">$17.00</div>
        <div id="card-tip-rate-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">20.0% on pre-tax subtotal</div>
      </div>

      <div class="tip-card" style="border-top:4px solid #8b5cf6;">
        <span class="tip-badge" style="background:rgba(139,92,246,0.15);color:#8b5cf6;">Full Check</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Total Register Bill</div>
        <div id="card-tip-grand-total" style="font-family:var(--mono);font-size:1.85rem;font-weight:bold;color:var(--fg);">$109.23</div>
        <div style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Subtotal + Tax + Tip</div>
      </div>

      <div class="tip-card" style="border-top:4px solid #f59e0b;">
        <span class="tip-badge" style="background:rgba(245,158,11,0.15);color:#f59e0b;">Tax Rate</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Sales Tax Paid</div>
        <div id="card-tip-tax-amt" style="font-family:var(--mono);font-size:1.85rem;font-weight:bold;color:#f59e0b;">$7.23</div>
        <div id="card-tip-tax-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">8.51% effective tax</div>
      </div>
    </div>

    <!-- Pure SVG Dining Cost Breakdown -->
    <div class="tip-svg-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;">
        <span style="font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">Dining Check Allocation Stack</span>
        <span style="font-family:var(--mono);font-size:0.78rem;color:var(--text-muted);">Proportional Bill Distribution</span>
      </div>
      <div id="tip-svg-container" style="width:100%;height:75px;"></div>
      <div style="display:flex;gap:1.5rem;margin-top:0.75rem;font-family:var(--mono);font-size:0.75rem;color:var(--text-muted);flex-wrap:wrap;">
        <span style="display:inline-flex;align-items:center;gap:0.4rem;"><span style="width:10px;height:10px;background:#64748b;border-radius:2px;"></span> Food &amp; Drink Subtotal</span>
        <span style="display:inline-flex;align-items:center;gap:0.4rem;"><span style="width:10px;height:10px;background:#f59e0b;border-radius:2px;"></span> Sales Tax</span>
        <span style="display:inline-flex;align-items:center;gap:0.4rem;"><span style="width:10px;height:10px;background:#3b82f6;border-radius:2px;"></span> Gratuity Tip</span>
      </div>
    </div>

    <!-- Live Step-by-Step Derivations -->
    <div style="margin-top:1.5rem;background:var(--surface-alt);border-left:3px solid #3b82f6;padding:1.1rem 1.25rem;border-radius:0 6px 6px 0;font-size:0.88rem;line-height:1.6;">
      <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Live Mathematical Derivations:</div>
      <div id="tip-derivations" style="font-family:var(--mono);color:var(--fg);"></div>
    </div>

    <!-- One-Click Copy Button -->
    <div style="margin-top:1.5rem;display:flex;justify-content:flex-end;">
      <button type="button" class="btn-sec" onclick="copyTipBreakdown(this)" style="font-family:var(--mono);font-size:0.85rem;padding:0.6rem 1.25rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;cursor:pointer;color:var(--fg);">
        📋 Copy Dining Bill Split Breakdown
      </button>
    </div>
  </div>

  <!-- Real-World Traps Section -->
  <div style="margin-bottom:2.5rem;">
    <h2 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:1rem;letter-spacing:-0.01em;">5 Fatal Traps &amp; Gotchas in Restaurant Tipping &amp; Bill Splitting</h2>

    <div class="tip-trap-card">
      <div class="tip-trap-title">1. The "Double Tipping on Sales Tax" Trap</div>
      <p class="tip-trap-desc">
        Many point-of-sale terminals (e.g., Toast, Clover, Square) automatically calculate suggested tip percentages on the post-tax balance rather than the pre-tax food subtotal. In metropolitan cities with high combined sales and restaurant meal taxes (such as Chicago at 10.75% or Seattle at 10.25%), tipping 20% on the tax amounts to paying gratuity to your server on money that goes directly to municipal government coffers.
      </p>
    </div>

    <div class="tip-trap-card">
      <div class="tip-trap-title">2. Mandatory "Service Charge" vs. Voluntary Tip (IRS Revenue Ruling 2012-18)</div>
      <p class="tip-trap-desc">
        When an eatery automatically adds an "18% auto-gratuity for large parties" or a "4% kitchen wellness fee", this money legally belongs to the restaurant entity, not your server. Restaurants can legally use service charges to subsidize rent, back-of-house utility expenses, or manager bonuses. Unless explicitly stated in writing that 100% of the charge is transferred to your front-of-house server, your server may receive none of it.
      </p>
    </div>

    <div class="tip-trap-card">
      <div class="tip-trap-title">3. The Counter-Service iPad Guilt-Trip Screen</div>
      <p class="tip-trap-desc">
        Self-ordering kiosks, coffee shops, and counter-service bakeries frequently swivel an iPad terminal displaying preset tip buttons starting at 20%, 25%, and 30%. Historically, gratuity compensates servers who provide ongoing table service (menu recommendations, drink refills, clearing courses). For over-the-counter retail transactions where you carry your own food to a table, a tip of 0% to 10% is customary.
      </p>
    </div>

    <div class="tip-trap-card">
      <div class="tip-trap-title">4. Credit Card Interchange Fee Tip Deductions</div>
      <p class="tip-trap-desc">
        Under federal FLSA regulations, restaurant operators are legally permitted to deduct the actual credit card processing fee (2.0% to 2.75%) from employee tips paid via credit card. For example, on a $20.00 credit card tip, the employer can withhold approximately $0.50 to cover the Visa/Mastercard interchange fee, paying the employee $19.50. Some states (such as California and Massachusetts) strictly prohibit this deduction, requiring the employer to absorb the full transaction fee.
      </p>
    </div>

    <div class="tip-trap-card">
      <div class="tip-trap-title">5. Delivery App Service Fee &amp; Driver Tip Stacking</div>
      <p class="tip-trap-desc">
        Ordering via third-party delivery apps (DoorDash, UberEats, Grubhub) incurs stacked surcharges: higher menu prices (often 15-30% higher than in-store), delivery fees, service fees, regulatory response fees, and courier tips. Many customers mistakenly believe the "delivery fee" goes to the delivery driver; in reality, drivers rely almost entirely on the separate in-app tip to cover fuel, vehicle depreciation, and liveable compensation.
      </p>
    </div>
  </div>
</div>

<script>
  function setTipPct(pct) {
    document.getElementById('tip-pct').value = pct;
    var btns = document.querySelectorAll('.tip-tab-btn');
    btns.forEach(function(b) { b.classList.remove('active'); });
    var matchBtn = Array.from(btns).find(function(b) { return b.textContent.indexOf(pct + '%') !== -1; });
    if (matchBtn) matchBtn.classList.add('active');
    calcTip();
  }

  function onCustomTipInput() {
    var btns = document.querySelectorAll('.tip-tab-btn');
    btns.forEach(function(b) { b.classList.remove('active'); });
    calcTip();
  }

  function calcTip() {
    var subtotal = parseFloat(document.getElementById('tip-subtotal').value) || 0;
    var tax = parseFloat(document.getElementById('tip-tax').value) || 0;
    var diners = parseInt(document.getElementById('tip-diners').value, 10) || 1;
    var tipPct = parseFloat(document.getElementById('tip-pct').value) || 0;
    var basis = document.getElementById('tip-basis').value;
    var roundMode = document.getElementById('tip-round').value;

    if (diners < 1) diners = 1;

    var tipBase = (basis === 'posttax') ? (subtotal + tax) : subtotal;
    var rawTip = tipBase * (tipPct / 100);

    var finalTip = rawTip;
    var grandTotal = subtotal + tax + rawTip;
    var perPersonTotal = grandTotal / diners;
    var perPersonTip = rawTip / diners;

    // Apply Rounding Modes
    if (roundMode === 'round_tip') {
      finalTip = Math.ceil(rawTip);
      grandTotal = subtotal + tax + finalTip;
      perPersonTotal = grandTotal / diners;
      perPersonTip = finalTip / diners;
    } else if (roundMode === 'round_person') {
      perPersonTotal = Math.ceil(perPersonTotal);
      grandTotal = perPersonTotal * diners;
      finalTip = Math.max(0, grandTotal - subtotal - tax);
      perPersonTip = finalTip / diners;
    } else if (roundMode === 'round_five') {
      perPersonTotal = Math.ceil(perPersonTotal / 5) * 5;
      grandTotal = perPersonTotal * diners;
      finalTip = Math.max(0, grandTotal - subtotal - tax);
      perPersonTip = finalTip / diners;
    }

    var effTipPct = (subtotal > 0) ? ((finalTip / subtotal) * 100) : 0;
    var effTaxPct = (subtotal > 0) ? ((tax / subtotal) * 100) : 0;

    // Display Hero metrics
    document.getElementById('card-tip-person-tot').textContent = '$' + perPersonTotal.toFixed(2);
    document.getElementById('card-tip-person-sub').textContent = 'Tip share: $' + perPersonTip.toFixed(2) + ' (' + diners + ' guest' + (diners > 1 ? 's' : '') + ')';

    document.getElementById('card-tip-total-amt').textContent = '$' + finalTip.toFixed(2);
    document.getElementById('card-tip-rate-sub').textContent = tipPct.toFixed(1) + '% on ' + (basis === 'posttax' ? 'total check' : 'pre-tax subtotal');

    document.getElementById('card-tip-grand-total').textContent = '$' + grandTotal.toFixed(2);

    document.getElementById('card-tip-tax-amt').textContent = '$' + tax.toFixed(2);
    document.getElementById('card-tip-tax-sub').textContent = effTaxPct.toFixed(2) + '% effective tax rate';

    renderTipVisual(subtotal, tax, finalTip, grandTotal);

    // Derivations
    var deriv = [
      '1. Tipping Base Amount: ' + (basis === 'posttax' ? ('Post-Tax Total ($' + subtotal.toFixed(2) + ' + $' + tax.toFixed(2) + ' = $' + (subtotal + tax).toFixed(2) + ')') : ('Pre-Tax Subtotal ($' + subtotal.toFixed(2) + ')')),
      '2. Gratuity Computation: $' + tipBase.toFixed(2) + ' &times; (' + tipPct.toFixed(1) + '% &divide; 100) = <strong>$' + rawTip.toFixed(2) + ' raw tip</strong>',
      '3. Full Dining Check: $' + subtotal.toFixed(2) + ' (food) + $' + tax.toFixed(2) + ' (tax) + $' + finalTip.toFixed(2) + ' (tip) = <strong>$' + grandTotal.toFixed(2) + ' total</strong>'
    ];

    if (diners > 1) {
      deriv.push('4. Bill Split (' + diners + ' diners): $' + grandTotal.toFixed(2) + ' &divide; ' + diners + ' = <strong>$' + perPersonTotal.toFixed(2) + ' per person</strong> (Tip contribution: $' + perPersonTip.toFixed(2) + ' each)');
    }

    if (roundMode !== 'exact') {
      deriv.push('5. Rounding Adjustment Applied: ' + (roundMode === 'round_tip' ? 'Tip rounded up to whole dollar' : ('Per-person amount rounded up to nearest ' + (roundMode === 'round_five' ? '$5.00' : '$1.00') + ' (generates an extra $' + (finalTip - rawTip).toFixed(2) + ' gratuity for the server)')));
    }

    document.getElementById('tip-derivations').innerHTML = deriv.join('<br>');
  }

  function renderTipVisual(subtotal, tax, tip, total) {
    var c = document.getElementById('tip-svg-container');
    if (!c || total <= 0) return;

    var w = c.clientWidth || 600;
    var h = 65;

    var pctSub = subtotal / total;
    var pctTax = tax / total;
    var pctTip = tip / total;

    var barH = 26;
    var y = 14;

    var wSub = Math.max(1, pctSub * (w - 4));
    var wTax = Math.max(0, pctTax * (w - 4));
    var wTip = Math.max(0, pctTip * (w - 4));

    var svg = '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" style="display:block;">';

    svg += '<rect x="2" y="' + y + '" width="' + (w - 4) + '" height="' + barH + '" rx="4" fill="#334155" />';
    svg += '<rect x="2" y="' + y + '" width="' + wSub + '" height="' + barH + '" rx="4" fill="#64748b" />';

    if (wTax > 0) {
      svg += '<rect x="' + (2 + wSub) + '" y="' + y + '" width="' + wTax + '" height="' + barH + '" fill="#f59e0b" />';
    }

    if (wTip > 0) {
      svg += '<rect x="' + (2 + wSub + wTax) + '" y="' + y + '" width="' + wTip + '" height="' + barH + '" rx="4" fill="#3b82f6" />';
    }

    svg += '<text x="4" y="' + (y + barH + 16) + '" fill="var(--text-muted)" font-family="var(--mono)" font-size="11">Food: $' + subtotal.toFixed(2) + ' (' + (pctSub * 100).toFixed(1) + '%)</text>';
    svg += '<text x="' + (w - 4) + '" y="' + (y + barH + 16) + '" fill="#3b82f6" font-family="var(--mono)" font-size="11" text-anchor="end">Tip: $' + tip.toFixed(2) + ' (' + (pctTip * 100).toFixed(1) + '%)</text>';

    svg += '</svg>';
    c.innerHTML = svg;
  }

  function copyTipBreakdown(btn) {
    var sub = document.getElementById('tip-subtotal').value;
    var tax = document.getElementById('card-tip-tax-amt').textContent.trim();
    var tip = document.getElementById('card-tip-total-amt').textContent.trim();
    var grand = document.getElementById('card-tip-grand-total').textContent.trim();
    var each = document.getElementById('card-tip-person-tot').textContent.trim();
    var diners = document.getElementById('tip-diners').value;
    var tipPct = document.getElementById('tip-pct').value;

    var lines = [
      '========================================',
      '     RESTAURANT BILL SPLIT BREAKDOWN',
      '========================================',
      'Food & Drink Subtotal : $' + Number(sub).toFixed(2),
      'Sales Tax             : ' + tax,
      'Gratuity (' + tipPct + '%)         : ' + tip,
      '----------------------------------------',
      'TOTAL REGISTER BILL   : ' + grand,
      'Number of Diners      : ' + diners,
      'TOTAL PER PERSON      : ' + each,
      '========================================',
      'Source: Digital Tools Shed (https://digitaltoolsshed.com/math/tip-calculator.html)'
    ];

    navigator.clipboard.writeText(lines.join('\n')).then(function() {
      var orig = btn.innerHTML;
      btn.innerHTML = '✅ Copied Bill Split!';
      btn.style.borderColor = '#10b981';
      setTimeout(function() {
        btn.innerHTML = orig;
        btn.style.borderColor = '';
      }, 2000);
    });
  }

  window.addEventListener('resize', calcTip);
  document.addEventListener('DOMContentLoaded', calcTip);
  calcTip();
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
    slug: "age-calculator",
    title: "Exact Age Calculator (Years, Months, Days, Lifetime Milestones & Next Birthday)",
    metaDesc: "Calculate exact chronological age in years, months, days, hours, and minutes. Includes actuarial life progression SVG bar, planetary orbital ages, next birthday countdown, and biological milestone trackers.",
    category: "Math & Calculation",
    faq: [
        {
            "q": "How is exact chronological age calculated across leap years and variable month lengths?",
            "a": "Chronological age uses strict calendar date borrowing rather than average month division. If the current target day is less than the birth day, the calculation borrows the exact number of days from the preceding month (28, 29, 30, or 31 depending on the calendar month and leap year status). If the target month is less than the birth month, it borrows 12 months from the year. Naive division by 365.25 or 30.44 days creates systematic 1 to 2-day errors."
        },
        {
            "q": "What happens if I was born on Leap Day (February 29)? When is my legal birthday?",
            "a": "For individuals born on February 29 during a leap year, statutory maturity in non-leap years varies by jurisdiction. In the United Kingdom, common-law countries, and Hong Kong, statutory age increments on March 1st. In some US states (such as California) and Taiwan, legal rights vest on February 28th. Aviation and passport authorities internationally typically recognize March 1st as the standard non-leap year renewal date."
        },
        {
            "q": "What is the difference between chronological age and biological age?",
            "a": "Chronological age measures elapsed calendar orbital revolutions around the Sun since birth. Biological (or epigenetic) age reflects cellular senescence, telomere attrition, DNA methylation patterns (such as the Horvath epigenetic clock), and physiological cardiovascular elasticity. An individual with a chronological age of 45 may possess a biological biomarker age of 38 or 52 depending on metabolic health, sleep, and lifestyle."
        },
        {
            "q": "Why did South Korea officially abolish its traditional \"Korean Age\" counting system in 2023?",
            "a": "Prior to June 28, 2023, South Korea used the traditional \"Korean age\" system (K-age), where infants were considered 1 year old on the day of birth and gained an additional year every January 1st regardless of their actual birthday. This meant a baby born on December 31st became 2 years old on January 1st at just two days old. South Korea passed landmark legislation officially standardizing on international chronological age for all civil, legal, and administrative matters."
        },
        {
            "q": "How are planetary ages calculated on other planets in our solar system?",
            "a": "Planetary age is determined by dividing total Earth days lived by the orbital period (sidereal year) of each target planet: Mercury (87.97 Earth days), Venus (224.7 Earth days), Mars (686.98 Earth days), Jupiter (4,332.59 Earth days / 11.86 Earth years), and Saturn (10,759.22 Earth days / 29.46 Earth years). An Earthling aged 30 is approximately 124.5 years old on Mercury, but only 2.53 years old on Jupiter."
        }
    ],
    body: `
<div class="article-container" style="max-width:1050px;margin:0 auto;padding:1.5rem 1rem;">
  <nav style="font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);">
    <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Exact Age Calculator
  </nav>

  <header style="margin-bottom:2rem;text-align:center;">
    <h1 style="font-family:var(--serif);font-size:2.2rem;margin-bottom:0.5rem;letter-spacing:-0.02em;">Exact Chronological Age Calculator</h1>
    <p style="color:var(--text-muted);font-size:1.05rem;max-width:750px;margin:0 auto;line-height:1.6;">
      Calculate exact elapsed age in years, months, days, and seconds. Discover your planetary solar ages, countdown to your next birthday, and inspect actuarial life progression.
    </p>
  </header>

  <style>
    .age-box { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:1.75rem; margin-bottom:2rem; }
    .age-grid-3 { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem; margin-bottom:1.25rem; }
    .age-grid-4 { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1.5rem; }
    .age-grid-5 { display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:0.75rem; margin-top:1.25rem; }
    .age-card { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; text-align:center; position:relative; }
    .age-badge { position:absolute; top:8px; right:8px; font-family:var(--mono); font-size:0.65rem; padding:2px 6px; border-radius:4px; }
    .age-trap-card { background:var(--surface-alt); border-left:4px solid #ef4444; border-radius:0 6px 6px 0; padding:1rem 1.25rem; margin-bottom:1rem; }
    .age-trap-title { font-family:var(--serif); font-weight:600; font-size:1.05rem; color:var(--fg); margin-bottom:0.25rem; }
    .age-trap-desc { font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin:0; }
    .age-svg-box { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; margin-top:1.5rem; }
  </style>

  <div class="age-box">
    <!-- Row 1: Inputs -->
    <div class="age-grid-3">
      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Date of Birth</label>
        <input type="date" id="age-dob" value="1995-06-15" onchange="calcAge()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.15rem;font-weight:bold;box-sizing:border-box;">
      </div>

      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Calculate Age As Of Date</label>
        <input type="date" id="age-target" onchange="calcAge()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.15rem;font-weight:bold;box-sizing:border-box;">
      </div>

      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Time of Birth (Optional)</label>
        <input type="time" id="age-tob" value="12:00" onchange="calcAge()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.15rem;box-sizing:border-box;">
      </div>
    </div>

    <!-- Quick Date Presets -->
    <div style="margin-bottom:1.5rem;display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
      <span style="font-family:var(--mono);font-size:0.75rem;color:var(--text-muted);margin-right:0.25rem;">Sample Milestones:</span>
      <button type="button" class="btn-sec" onclick="setAgePreset('2000-01-01')" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">Y2K Baby (Jan 1, 2000)</button>
      <button type="button" class="btn-sec" onclick="setAgePreset('1990-10-15')" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">Millennial (Oct 15, 1990)</button>
      <button type="button" class="btn-sec" onclick="setAgePreset('1980-05-20')" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">Gen X (May 20, 1980)</button>
      <button type="button" class="btn-sec" onclick="setAgePreset('1960-03-12')" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">Boomer (Mar 12, 1960)</button>
    </div>

    <!-- Hero Cards -->
    <div class="age-grid-4">
      <div class="age-card" style="border-top:4px solid #10b981;">
        <span class="age-badge" style="background:rgba(16,185,129,0.15);color:#10b981;">Exact Age</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Chronological Age</div>
        <div id="card-age-main" style="font-family:var(--mono);font-size:1.7rem;font-weight:bold;color:#10b981;">31 Yrs 2 Mos</div>
        <div id="card-age-days" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">and 18 Days</div>
      </div>

      <div class="age-card" style="border-top:4px solid #3b82f6;">
        <span class="age-badge" style="background:rgba(59,130,246,0.15);color:#3b82f6;">Next Birthday</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Countdown</div>
        <div id="card-age-next" style="font-family:var(--mono);font-size:1.7rem;font-weight:bold;color:#3b82f6;">283 Days</div>
        <div id="card-age-next-dow" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Falling on a Tuesday</div>
      </div>

      <div class="age-card" style="border-top:4px solid #8b5cf6;">
        <span class="age-badge" style="background:rgba(139,92,246,0.15);color:#8b5cf6;">Total Days</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Days Lived</div>
        <div id="card-age-total-days" style="font-family:var(--mono);font-size:1.7rem;font-weight:bold;color:var(--fg);">11,398</div>
        <div id="card-age-hours" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">273,552 Hours</div>
      </div>

      <div class="age-card" style="border-top:4px solid #f59e0b;">
        <span class="age-badge" style="background:rgba(245,158,11,0.15);color:#f59e0b;">Biology</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Heartbeats Elapsed</div>
        <div id="card-age-heartbeats" style="font-family:var(--mono);font-size:1.7rem;font-weight:bold;color:#f59e0b;">1.23 Billion</div>
        <div id="card-age-breaths" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">~262 Million Breaths</div>
      </div>
    </div>

    <!-- Pure SVG Life Expectancy Progression -->
    <div class="age-svg-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;">
        <span style="font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">Actuarial Life Horizon Progression (79.5 Yr Benchmark)</span>
        <span id="age-pct-lived-text" style="font-family:var(--mono);font-size:0.78rem;color:var(--text-muted);">39.2% of statistical life lived</span>
      </div>
      <div id="age-svg-container" style="width:100%;height:65px;"></div>
      <div style="display:flex;justify-content:space-between;margin-top:0.5rem;font-family:var(--mono);font-size:0.72rem;color:var(--text-muted);flex-wrap:wrap;">
        <span>Birth (0)</span>
        <span>Youth (18-21)</span>
        <span>Prime (35)</span>
        <span>Midlife (50)</span>
        <span>Retirement (65)</span>
        <span>Expectancy (79.5)</span>
      </div>
    </div>

    <!-- Planetary Solar System Ages Grid -->
    <div style="margin-top:1.5rem;">
      <h3 style="font-family:var(--serif);font-size:1.15rem;margin-bottom:0.75rem;color:var(--fg);">Your Planetary Solar Ages (Orbital Revolution Years)</h3>
      <div class="age-grid-5">
        <div class="age-card">
          <div style="font-family:var(--mono);font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">Mercury (88d)</div>
          <div id="planet-mercury" style="font-family:var(--mono);font-size:1.25rem;font-weight:bold;color:#38bdf8;margin:0.25rem 0;">129.5 Yrs</div>
          <div style="font-size:0.7rem;color:var(--text-muted);font-family:var(--mono);">Orbital speed: 47 km/s</div>
        </div>
        <div class="age-card">
          <div style="font-family:var(--mono);font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">Venus (225d)</div>
          <div id="planet-venus" style="font-family:var(--mono);font-size:1.25rem;font-weight:bold;color:#fbbf24;margin:0.25rem 0;">50.7 Yrs</div>
          <div style="font-size:0.7rem;color:var(--text-muted);font-family:var(--mono);">Orbital period: 224.7d</div>
        </div>
        <div class="age-card">
          <div style="font-family:var(--mono);font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">Mars (687d)</div>
          <div id="planet-mars" style="font-family:var(--mono);font-size:1.25rem;font-weight:bold;color:#f87171;margin:0.25rem 0;">16.6 Yrs</div>
          <div style="font-size:0.7rem;color:var(--text-muted);font-family:var(--mono);">1 Sol = 24h 39m</div>
        </div>
        <div class="age-card">
          <div style="font-family:var(--mono);font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">Jupiter (11.9y)</div>
          <div id="planet-jupiter" style="font-family:var(--mono);font-size:1.25rem;font-weight:bold;color:#a78bfa;margin:0.25rem 0;">2.63 Yrs</div>
          <div style="font-size:0.7rem;color:var(--text-muted);font-family:var(--mono);">4,333 Earth days</div>
        </div>
        <div class="age-card">
          <div style="font-family:var(--mono);font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">Saturn (29.5y)</div>
          <div id="planet-saturn" style="font-family:var(--mono);font-size:1.25rem;font-weight:bold;color:#f472b6;margin:0.25rem 0;">1.06 Yrs</div>
          <div style="font-size:0.7rem;color:var(--text-muted);font-family:var(--mono);">10,759 Earth days</div>
        </div>
      </div>
    </div>

    <!-- Live Step-by-Step Derivations -->
    <div style="margin-top:1.5rem;background:var(--surface-alt);border-left:3px solid #10b981;padding:1.1rem 1.25rem;border-radius:0 6px 6px 0;font-size:0.88rem;line-height:1.6;">
      <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Live Calendar Borrowing Derivations:</div>
      <div id="age-derivations" style="font-family:var(--mono);color:var(--fg);"></div>
    </div>

    <!-- One-Click Copy Button -->
    <div style="margin-top:1.5rem;display:flex;justify-content:flex-end;">
      <button type="button" class="btn-sec" onclick="copyAgeProfile(this)" style="font-family:var(--mono);font-size:0.85rem;padding:0.6rem 1.25rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;cursor:pointer;color:var(--fg);">
        📋 Copy Biographical Age Profile
      </button>
    </div>
  </div>

  <!-- Real-World Traps Section -->
  <div style="margin-bottom:2.5rem;">
    <h2 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:1rem;letter-spacing:-0.01em;">5 Fatal Traps &amp; Gotchas in Age &amp; Date Calculation</h2>

    <div class="age-trap-card">
      <div class="age-trap-title">1. The "Average 30.4375 Days Per Month" Mathematical Flaw</div>
      <p class="age-trap-desc">
        Many amateur calculators divide elapsed days by 365.25 or 30.4375 to determine years and months. Because calendar months vary between 28, 29, 30, and 31 days, naive floating-point division produces errors of 1 to 3 days when computing age intervals. The only actuarially accurate method is calendar borrowing: tracking exact days elapsed within the specific Gregorian month cycle.
      </p>
    </div>

    <div class="age-trap-card">
      <div class="age-trap-title">2. Leap Day Statutory Maturity (February 29 Birthdays)</div>
      <p class="age-trap-desc">
        If you were born on Leap Day (February 29), your legal age increments on different dates depending on national laws. Under English common law and UK statute, a leap year baby does not legally turn 18 or 21 until March 1st. In contrast, under Taiwanese and New Zealand legislation, rights vest on February 28th. Airline booking systems frequently reject Feb 29 birthdates on non-leap departure years without automatic rollover logic.
      </p>
    </div>

    <div class="age-trap-card">
      <div class="age-trap-title">3. South Korea's Historic 2023 Age Law Abolition</div>
      <p class="age-trap-desc">
        Until June 28, 2023, South Korea operated three competing age systems: "Korean Age" (where you are 1 year old at birth and age up every New Year's Day), "Counting Age" (used for military conscription and alcohol purchase), and "International Age". The confusion resulted in severe administrative disputes regarding COVID-19 vaccine eligibility and insurance payouts until the National Assembly officially mandated the international chronological system.
      </p>
    </div>

    <div class="age-trap-card">
      <div class="age-trap-title">4. The 1752 Calendar Act (The Missing 11 Days Trap)</div>
      <p class="age-trap-desc">
        When Great Britain and the American colonies transitioned from the Julian to the Gregorian calendar in September 1752, eleven calendar days were dropped entirely: Wednesday, September 2 was followed directly by Thursday, September 14! Historical figures born before 1752 (such as George Washington, originally born February 11, 1731/32) had their birthdays shifted to February 22, 1732.
      </p>
    </div>

    <div class="age-trap-card">
      <div class="age-trap-title">5. Daylight Saving Time &amp; Midnight Birth Boundary Errors</div>
      <p class="age-trap-desc">
        Individuals born within one hour of midnight during the "Fall Back" or "Spring Forward" transitions of Daylight Saving Time can suffer statutory birthdate discrepancies. An infant born at 1:45 AM during the fallback hour might be registered after a twin born at 1:15 AM if clocks were set back to 1:00 AM between births, creating permanent legal identification and birth certificate timing anomalies.
      </p>
    </div>
  </div>
</div>

<script>
  function setAgePreset(dateStr) {
    document.getElementById('age-dob').value = dateStr;
    calcAge();
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function calcAge() {
    var dobInput = document.getElementById('age-dob').value;
    if (!dobInput) return;

    var targetInput = document.getElementById('age-target').value;
    var targetDate = targetInput ? new Date(targetInput + 'T12:00:00') : new Date();

    var dobParts = dobInput.split('-');
    var bYear = parseInt(dobParts[0], 10);
    var bMonth = parseInt(dobParts[1], 10) - 1;
    var bDay = parseInt(dobParts[2], 10);
    var dob = new Date(bYear, bMonth, bDay, 12, 0, 0);

    var tYear = targetDate.getFullYear();
    var tMonth = targetDate.getMonth();
    var tDay = targetDate.getDate();

    if (targetDate < dob) {
      document.getElementById('card-age-main').textContent = 'Future Date';
      document.getElementById('card-age-days').textContent = 'Born after target';
      return;
    }

    // Exact calendar difference with borrowing
    var years = tYear - bYear;
    var months = tMonth - bMonth;
    var days = tDay - bDay;

    if (days < 0) {
      months -= 1;
      var prevMonthDays = getDaysInMonth(tYear, (tMonth === 0 ? 11 : tMonth - 1));
      days += prevMonthDays;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total milliseconds and days
    var diffMs = targetDate.getTime() - dob.getTime();
    var totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    var totalHours = totalDays * 24;

    // Next Birthday Countdown
    var nextBday = new Date(tYear, bMonth, bDay, 12, 0, 0);
    if (nextBday < targetDate) {
      nextBday = new Date(tYear + 1, bMonth, bDay, 12, 0, 0);
    }
    var msToNext = nextBday.getTime() - targetDate.getTime();
    var daysToNext = Math.ceil(msToNext / (1000 * 60 * 60 * 24));

    var dows = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var birthDow = dows[dob.getDay()];
    var nextBdayDow = dows[nextBday.getDay()];

    // Biological approximations
    var heartbeats = totalDays * 24 * 60 * 75; // 75 bpm
    var breaths = totalDays * 24 * 60 * 16; // 16 bpm

    // Planetary Ages
    var pMercury = (totalDays / 87.97).toFixed(1);
    var pVenus = (totalDays / 224.7).toFixed(1);
    var pMars = (totalDays / 686.98).toFixed(1);
    var pJupiter = (totalDays / 4332.59).toFixed(2);
    var pSaturn = (totalDays / 10759.22).toFixed(2);

    // Hero Cards
    document.getElementById('card-age-main').textContent = years + ' Yrs ' + months + ' Mos';
    document.getElementById('card-age-days').textContent = 'and ' + days + ' Day' + (days === 1 ? '' : 's');

    document.getElementById('card-age-next').textContent = (daysToNext === 0 ? '🎉 TODAY!' : (daysToNext + ' Days'));
    document.getElementById('card-age-next-dow').textContent = (daysToNext === 0 ? 'Happy Birthday!' : ('Falling on a ' + nextBdayDow));

    document.getElementById('card-age-total-days').textContent = totalDays.toLocaleString('en-US');
    document.getElementById('card-age-hours').textContent = totalHours.toLocaleString('en-US') + ' Hours lived';

    document.getElementById('card-age-heartbeats').textContent = (heartbeats / 1e9).toFixed(2) + ' Billion';
    document.getElementById('card-age-breaths').textContent = '~' + Math.round(breaths / 1e6) + ' Million Breaths';

    // Planetary Grid
    document.getElementById('planet-mercury').textContent = pMercury + ' Yrs';
    document.getElementById('planet-venus').textContent = pVenus + ' Yrs';
    document.getElementById('planet-mars').textContent = pMars + ' Yrs';
    document.getElementById('planet-jupiter').textContent = pJupiter + ' Yrs';
    document.getElementById('planet-saturn').textContent = pSaturn + ' Yrs';

    // Life Expectancy Percentage (79.5 yrs)
    var decimalAge = years + (months / 12) + (days / 365.25);
    var pctLife = Math.min(100, Math.max(0, (decimalAge / 79.5) * 100));
    document.getElementById('age-pct-lived-text').textContent = pctLife.toFixed(1) + '% of 79.5-year statistical life lived';

    renderAgeVisual(pctLife, decimalAge);

    // Derivations
    var deriv = [
      '1. Birth Record: ' + dob.toISOString().split('T')[0] + ' (' + birthDow + ') &bull; Target Evaluation Date: ' + targetDate.toISOString().split('T')[0],
      '2. Calendar Borrowing Calculation: Year delta (' + (tYear - bYear) + ') &bull; Month delta adjusted (' + months + ') &bull; Day delta adjusted (' + days + ')',
      '3. Exact Chronological Age: <strong>' + years + ' Years, ' + months + ' Months, ' + days + ' Days</strong>',
      '4. Total Duration: <strong>' + totalDays.toLocaleString('en-US') + ' days</strong> (' + totalHours.toLocaleString('en-US') + ' hours &bull; ' + (totalDays * 1440).toLocaleString('en-US') + ' minutes elapsed)',
      '5. Next Milestone: ' + daysToNext + ' days until turning ' + (years + 1) + ' years old on ' + nextBdayDow + ', ' + nextBday.toISOString().split('T')[0]
    ];
    document.getElementById('age-derivations').innerHTML = deriv.join('<br>');
  }

  function renderAgeVisual(pct, age) {
    var c = document.getElementById('age-svg-container');
    if (!c) return;

    var w = c.clientWidth || 600;
    var h = 55;
    var barH = 22;
    var y = 14;

    var wFill = Math.max(2, Math.min(w - 4, (pct / 100) * (w - 4)));

    var svg = '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" style="display:block;">';

    // Base background bar
    svg += '<rect x="2" y="' + y + '" width="' + (w - 4) + '" height="' + barH + '" rx="4" fill="#334155" />';

    // Elapsed life bar (gradient-like emerald)
    svg += '<rect x="2" y="' + y + '" width="' + wFill + '" height="' + barH + '" rx="4" fill="#10b981" />';

    // Current needle marker
    svg += '<line x1="' + (2 + wFill) + '" y1="' + (y - 4) + '" x2="' + (2 + wFill) + '" y2="' + (y + barH + 4) + '" stroke="#ffffff" stroke-width="2" />';

    // Current age label
    svg += '<text x="' + (2 + wFill) + '" y="' + (y + barH + 16) + '" fill="#10b981" font-family="var(--mono)" font-size="11" text-anchor="middle" font-weight="bold">You: ' + age.toFixed(1) + ' yrs (' + pct.toFixed(1) + '%)</text>';

    svg += '</svg>';
    c.innerHTML = svg;
  }

  function copyAgeProfile(btn) {
    var age = document.getElementById('card-age-main').textContent + ' ' + document.getElementById('card-age-days').textContent;
    var totalDays = document.getElementById('card-age-total-days').textContent;
    var hours = document.getElementById('card-age-hours').textContent;
    var next = document.getElementById('card-age-next').textContent + ' (' + document.getElementById('card-age-next-dow').textContent + ')';
    var dob = document.getElementById('age-dob').value;
    var merc = document.getElementById('planet-mercury').textContent;
    var mars = document.getElementById('planet-mars').textContent;
    var jup = document.getElementById('planet-jupiter').textContent;

    var lines = [
      '========================================',
      '      EXACT CHRONOLOGICAL AGE PROFILE',
      '========================================',
      'Date of Birth       : ' + dob,
      'Exact Age           : ' + age,
      'Total Days Lived    : ' + totalDays + ' Days',
      'Total Hours Lived   : ' + hours,
      'Next Birthday       : ' + next,
      '----------------------------------------',
      'Solar Planetary Ages:',
      '  - Mercury (88d)   : ' + merc,
      '  - Mars (687d)     : ' + mars,
      '  - Jupiter (11.9y) : ' + jup,
      '========================================',
      'Source: Digital Tools Shed (https://digitaltoolsshed.com/math/age-calculator.html)'
    ];

    navigator.clipboard.writeText(lines.join('\n')).then(function() {
      var orig = btn.innerHTML;
      btn.innerHTML = '✅ Copied Age Profile!';
      btn.style.borderColor = '#10b981';
      setTimeout(function() {
        btn.innerHTML = orig;
        btn.style.borderColor = '';
      }, 2000);
    });
  }

  window.addEventListener('resize', calcAge);
  document.addEventListener('DOMContentLoaded', function() {
    var now = new Date();
    document.getElementById('age-target').value = now.toISOString().split('T')[0];
    calcAge();
  });
  var now = new Date();
  document.getElementById('age-target').value = now.toISOString().split('T')[0];
  calcAge();
</script>
`
  },
      {
    slug: "gpa-calculator",
    title: "College & High School GPA Calculator (Weighted, Unweighted & Target GPA Planner)",
    metaDesc: "Calculate college and high school semester and cumulative GPA on 4.0, 4.33, and 5.0 weighted scales. Includes Honors and AP/IB credit weighting, target GPA graduation planner, and SVG honors standing gauge.",
    category: "Math & Education",
    faq: [
        {
            "q": "How is cumulative GPA calculated from quality points and credit hours?",
            "a": "Cumulative GPA is calculated by determining the \"quality points\" earned in every course (multiplying the numeric grade value by the course credit hours), summing all quality points earned across all semesters, and dividing by the total number of graded credit hours completed: Cumulative GPA = Total Quality Points / Total Graded Credits. Non-graded courses (Pass/Fail, Audited, Incomplete) are excluded from the divisor."
        },
        {
            "q": "What is the mathematical difference between weighted and unweighted GPA?",
            "a": "An unweighted GPA evaluates every class on a standard 4.0 scale regardless of academic rigor, where an A is worth 4.0 points. A weighted GPA rewards students for enrolling in more challenging curricula by adding a grade-weight bonus: typically +0.5 points for Honors courses (maximum 4.5) and +1.0 points for Advanced Placement (AP), International Baccalaureate (IB), or Dual Enrollment college courses (maximum 5.0)."
        },
        {
            "q": "How does the Target GPA Planner calculate the grades needed to graduate with honors?",
            "a": "To find the required grade point average across remaining credit hours to hit a target graduation goal, the planner uses the deficit allocation formula: Required GPA = [(Target GPA × Total Degree Credits) - Current Cumulative Quality Points] / Remaining Credit Hours. If the resulting required GPA exceeds 4.0 (or the maximum institutional cap), the goal is mathematically unreachable without repeating previously graded courses."
        },
        {
            "q": "What numeric values correspond to letter grades on standard 4.0 vs 4.33 scales?",
            "a": "On the standard 4.0 scale: A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, C+ = 2.3, C = 2.0, C- = 1.7, D+ = 1.3, D = 1.0, D- = 0.7, and F = 0.0. On a 4.33 scale (used by institutions such as Columbia, Cornell, and Stanford Law), an A+ is awarded 4.33 quality points, allowing high-performing students to exceed a 4.00 unweighted average."
        },
        {
            "q": "How do Pass/Fail credits, course repeats, and transfer credits affect your GPA?",
            "a": "Pass/Fail courses that you pass add to your completed degree credits but have zero mathematical impact on your GPA (they do not help raise a low GPA). A failing grade (\"No Pass\" / \"F\") in a P/F course is frequently calculated as 0.0 quality points. Transfer credits from other universities usually fulfill degree requirements but are excluded from institutional GPA calculations used for Latin Honors (Cum Laude, Magna Cum Laude)."
        }
    ],
    body: `
<div class="article-container" style="max-width:1050px;margin:0 auto;padding:1.5rem 1rem;">
  <nav style="font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);">
    <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; GPA Calculator
  </nav>

  <header style="margin-bottom:2rem;text-align:center;">
    <h1 style="font-family:var(--serif);font-size:2.2rem;margin-bottom:0.5rem;letter-spacing:-0.02em;">College &amp; High School GPA Calculator</h1>
    <p style="color:var(--text-muted);font-size:1.05rem;max-width:750px;margin:0 auto;line-height:1.6;">
      Compute semester and cumulative GPA on 4.0 and 5.0 weighted scales, model AP/IB honors grade points, and calculate the exact grades needed to reach graduation honors.
    </p>
  </header>

  <style>
    .gpa-box { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:1.75rem; margin-bottom:2rem; }
    .gpa-grid-3 { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem; margin-bottom:1.25rem; }
    .gpa-grid-4 { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1.5rem; }
    .gpa-card { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; text-align:center; position:relative; }
    .gpa-badge { position:absolute; top:8px; right:8px; font-family:var(--mono); font-size:0.65rem; padding:2px 6px; border-radius:4px; }
    .gpa-table { width:100%; border-collapse:collapse; font-family:var(--mono); font-size:0.88rem; margin-top:0.75rem; }
    .gpa-table th, .gpa-table td { padding:0.6rem 0.75rem; border:1px solid var(--border); text-align:left; }
    .gpa-table th { background:var(--surface-alt); font-weight:600; color:var(--text-muted); }
    .gpa-trap-card { background:var(--surface-alt); border-left:4px solid #ef4444; border-radius:0 6px 6px 0; padding:1rem 1.25rem; margin-bottom:1rem; }
    .gpa-trap-title { font-family:var(--serif); font-weight:600; font-size:1.05rem; color:var(--fg); margin-bottom:0.25rem; }
    .gpa-trap-desc { font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin:0; }
    .gpa-svg-box { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; margin-top:1.5rem; }
  </style>

  <div class="gpa-box">
    <!-- Row 1: Scale & Prior History -->
    <div class="gpa-grid-3">
      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Grading Scale Model</label>
        <select id="gpa-scale" onchange="calcGPA()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:0.95rem;box-sizing:border-box;">
          <option value="4.0" selected>Standard 4.0 Scale (A = 4.0, A- = 3.7)</option>
          <option value="4.33">4.33 Scale (A+ = 4.33, A = 4.0)</option>
          <option value="weighted">Weighted High School (Honors +0.5, AP/IB +1.0)</option>
        </select>
      </div>

      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Prior Cumulative GPA (Optional)</label>
        <input type="number" id="gpa-prior-gpa" value="3.40" min="0" max="5.0" step="0.01" oninput="calcGPA()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.15rem;box-sizing:border-box;">
      </div>

      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Prior Credits Completed</label>
        <input type="number" id="gpa-prior-credits" value="45" min="0" max="200" step="1" oninput="calcGPA()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.15rem;box-sizing:border-box;">
      </div>
    </div>

    <!-- Target Goal Setting Row -->
    <div class="gpa-grid-3" style="background:var(--surface-alt);padding:1rem;border-radius:6px;margin-bottom:1.5rem;border:1px dashed var(--border);">
      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">🎯 Graduation Target GPA Goal</label>
        <input type="number" id="gpa-target-goal" value="3.60" min="2.0" max="4.5" step="0.05" oninput="calcGPA()" style="width:100%;padding:0.6rem;background:var(--surface);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:bold;box-sizing:border-box;">
      </div>
      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Total Credits Required for Degree</label>
        <input type="number" id="gpa-total-degree-credits" value="120" min="60" max="180" step="1" oninput="calcGPA()" style="width:100%;padding:0.6rem;background:var(--surface);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1rem;box-sizing:border-box;">
      </div>
      <div style="display:flex;align-items:flex-end;">
        <div id="gpa-target-status" style="font-family:var(--mono);font-size:0.85rem;color:#3b82f6;padding-bottom:0.6rem;">Target GPA calculations active</div>
      </div>
    </div>

    <!-- Courses Schedule Table -->
    <div style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-family:var(--serif);font-size:1.15rem;font-weight:600;color:var(--fg);">Current Semester Course Roster</span>
      <button type="button" class="btn-sec" onclick="addGPACourseRow()" style="font-family:var(--mono);font-size:0.8rem;padding:0.4rem 0.8rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">+ Add Course</button>
    </div>

    <div style="overflow-x:auto;">
      <table class="gpa-table">
        <thead>
          <tr>
            <th style="width:35%;">Course Name</th>
            <th style="width:20%;">Letter Grade</th>
            <th style="width:15%;">Credits</th>
            <th style="width:20%;">Course Weight</th>
            <th style="width:10%;text-align:center;">Action</th>
          </tr>
        </thead>
        <tbody id="gpa-course-tbody">
          <!-- Rows injected dynamically -->
        </tbody>
      </table>
    </div>

    <!-- Hero Cards -->
    <div class="gpa-grid-4">
      <div class="gpa-card" style="border-top:4px solid #10b981;">
        <span class="gpa-badge" style="background:rgba(16,185,129,0.15);color:#10b981;">Term GPA</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Semester GPA</div>
        <div id="card-gpa-term" style="font-family:var(--mono);font-size:1.85rem;font-weight:bold;color:#10b981;">3.67</div>
        <div id="card-gpa-weighted-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Unweighted: 3.67</div>
      </div>

      <div class="gpa-card" style="border-top:4px solid #3b82f6;">
        <span class="gpa-badge" style="background:rgba(59,130,246,0.15);color:#3b82f6;">Overall</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">New Cumulative GPA</div>
        <div id="card-gpa-cum" style="font-family:var(--mono);font-size:1.85rem;font-weight:bold;color:#3b82f6;">3.47</div>
        <div id="card-gpa-credits-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">60 total credits completed</div>
      </div>

      <div class="gpa-card" style="border-top:4px solid #8b5cf6;">
        <span class="gpa-badge" style="background:rgba(139,92,246,0.15);color:#8b5cf6;">Quality Pts</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Total Quality Points</div>
        <div id="card-gpa-qp" style="font-family:var(--mono);font-size:1.85rem;font-weight:bold;color:var(--fg);">208.1</div>
        <div style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Cumulative earned points</div>
      </div>

      <div class="gpa-card" style="border-top:4px solid #f59e0b;">
        <span class="gpa-badge" style="background:rgba(245,158,11,0.15);color:#f59e0b;">Target Goal</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Required Remaining GPA</div>
        <div id="card-gpa-needed" style="font-family:var(--mono);font-size:1.85rem;font-weight:bold;color:#f59e0b;">3.73</div>
        <div id="card-gpa-needed-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Across remaining 60 credits</div>
      </div>
    </div>

    <!-- Pure SVG Academic Standing Gauge -->
    <div class="gpa-svg-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;">
        <span style="font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">Academic Standing &amp; Latin Honors Spectrum</span>
        <span id="gpa-standing-text" style="font-family:var(--mono);font-size:0.78rem;color:#10b981;">Dean's List / Honors Standing</span>
      </div>
      <div id="gpa-svg-container" style="width:100%;height:65px;"></div>
      <div style="display:flex;justify-content:space-between;margin-top:0.5rem;font-family:var(--mono);font-size:0.72rem;color:var(--text-muted);flex-wrap:wrap;">
        <span>Good Standing (2.0)</span>
        <span>Honors (3.0)</span>
        <span>Dean's List (3.5)</span>
        <span>Cum Laude (3.6)</span>
        <span>Magna Cum Laude (3.8)</span>
        <span>Summa (3.9+)</span>
      </div>
    </div>

    <!-- Live Step-by-Step Derivation -->
    <div style="margin-top:1.5rem;background:var(--surface-alt);border-left:3px solid #3b82f6;padding:1.1rem 1.25rem;border-radius:0 6px 6px 0;font-size:0.88rem;line-height:1.6;">
      <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Live Mathematical Quality Points Derivation:</div>
      <div id="gpa-derivations" style="font-family:var(--mono);color:var(--fg);"></div>
    </div>

    <!-- One-Click Copy Button -->
    <div style="margin-top:1.5rem;display:flex;justify-content:flex-end;">
      <button type="button" class="btn-sec" onclick="copyGPAReport(this)" style="font-family:var(--mono);font-size:0.85rem;padding:0.6rem 1.25rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;cursor:pointer;color:var(--fg);">
        📋 Copy Academic GPA Transcript Report
      </button>
    </div>
  </div>

  <!-- Real-World Traps Section -->
  <div style="margin-bottom:2.5rem;">
    <h2 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:1rem;letter-spacing:-0.01em;">5 Fatal Traps &amp; Gotchas in Academic GPA Calculations</h2>

    <div class="gpa-trap-card">
      <div class="gpa-trap-title">1. The Credit-Hour Weighting Distortion</div>
      <p class="gpa-trap-desc">
        A common student error is taking the simple average of letter grades. An 'F' in a 4-credit Organic Chemistry lab carries four times the mathematical drag of an 'A' in a 1-credit physical education seminar. Quality points are strictly proportional to credit units; neglecting course credits produces wildly inaccurate GPA predictions that can lead to unexpected academic probation.
      </p>
    </div>

    <div class="gpa-trap-card">
      <div class="gpa-trap-title">2. The Pass/Fail (P/F) Credit Illusion</div>
      <p class="gpa-trap-desc">
        Enrolling in classes on a Pass/Fail (or Credit/No Credit) grading option fulfills graduation requirements, but passing grades do <em>not</em> factor into your GPA numerator or denominator. Therefore, Pass credits cannot be used to raise a depressed GPA. Furthermore, at many major universities, a failing grade ('No Pass' / 'F') in a P/F class is computed as a 0.00 quality point failure, causing your GPA to plummet.
      </p>
    </div>

    <div class="gpa-trap-card">
      <div class="gpa-trap-title">3. Institutional Course Repeat &amp; Grade Forgiveness Rules</div>
      <p class="gpa-trap-desc">
        University policies on retaking classes diverge sharply. Under strict "Grade Replacement", the new grade replaces the prior grade in your institutional GPA. However, centralized graduate school admissions application services (e.g., AMCAS for Medical School, LSAC for Law School) reverse institutional grade forgiveness, recalculating every attempt and averaging original 'F' grades back into your cumulative admission GPA.
      </p>
    </div>

    <div class="gpa-trap-card">
      <div class="gpa-trap-title">4. Transfer Credit Exclusion for Latin Honors</div>
      <p class="gpa-trap-desc">
        Students who transfer credits from community colleges often discover that transfer coursework carries credit units but zero institutional GPA points. At universities like UCLA, UC Berkeley, and NYU, Latin Honors (Cum Laude, Magna Cum Laude, Summa Cum Laude) are evaluated exclusively on grades earned in residence, meaning a single B- in your senior year can knock you out of the honors cutoff.
      </p>
    </div>

    <div class="gpa-trap-card">
      <div class="gpa-trap-title">5. The Unweighted High School Class Rank Ceiling</div>
      <p class="gpa-trap-desc">
        In competitive secondary schools with weighted class ranking, maintaining a perfect 4.00 unweighted GPA in standard college-prep classes will not earn valedictorian status. Students taking 8 to 12 Advanced Placement (AP) or International Baccalaureate (IB) courses receive +1.0 grade point bumps, achieving weighted GPAs of 4.60 to 4.90, displacing unweighted students in percentile rank.
      </p>
    </div>
  </div>
</div>

<script>
  var courseRows = [
    { name: 'Calculus II', grade: 'A', credits: 4, type: 'ap' },
    { name: 'Organic Chemistry', grade: 'A-', credits: 4, type: 'standard' },
    { name: 'World History', grade: 'B+', credits: 3, type: 'honors' },
    { name: 'Computer Science', grade: 'A', credits: 4, type: 'ap' }
  ];

  var GRADE_POINTS = {
    '4.0': { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0 },
    '4.33': { 'A+': 4.33, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0 },
    'weighted': { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0 }
  };

  function renderGPATable() {
    var tb = document.getElementById('gpa-course-tbody');
    if (!tb) return;

    var html = '';
    for (var i = 0; i < courseRows.length; i++) {
      var r = courseRows[i];
      html += '<tr style="border-bottom:1px solid var(--border);">' +
        '<td><input type="text" value="' + r.name + '" oninput="updateCourse(' + i + ', \'name\', this.value)" style="width:100%;padding:0.4rem;background:var(--surface);border:1px solid var(--border);border-radius:4px;color:var(--fg);font-family:var(--mono);font-size:0.85rem;box-sizing:border-box;"></td>' +
        '<td><select onchange="updateCourse(' + i + ', \'grade\', this.value)" style="width:100%;padding:0.4rem;background:var(--surface);border:1px solid var(--border);border-radius:4px;color:var(--fg);font-family:var(--mono);font-size:0.85rem;box-sizing:border-box;">' +
          ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'].map(function(g) {
            return '<option value="' + g + '"' + (r.grade === g ? ' selected' : '') + '>' + g + '</option>';
          }).join('') +
        '</select></td>' +
        '<td><input type="number" value="' + r.credits + '" min="0.5" max="12" step="0.5" oninput="updateCourse(' + i + ', \'credits\', this.value)" style="width:100%;padding:0.4rem;background:var(--surface);border:1px solid var(--border);border-radius:4px;color:var(--fg);font-family:var(--mono);font-size:0.85rem;box-sizing:border-box;"></td>' +
        '<td><select onchange="updateCourse(' + i + ', \'type\', this.value)" style="width:100%;padding:0.4rem;background:var(--surface);border:1px solid var(--border);border-radius:4px;color:var(--fg);font-family:var(--mono);font-size:0.85rem;box-sizing:border-box;">' +
          '<option value="standard"' + (r.type === 'standard' ? ' selected' : '') + '>Standard (+0.0)</option>' +
          '<option value="honors"' + (r.type === 'honors' ? ' selected' : '') + '>Honors (+0.5)</option>' +
          '<option value="ap"' + (r.type === 'ap' ? ' selected' : '') + '>AP / IB / College (+1.0)</option>' +
        '</select></td>' +
        '<td style="text-align:center;"><button type="button" onclick="removeGPACourseRow(' + i + ')" style="background:transparent;border:none;color:#ef4444;cursor:pointer;font-family:var(--mono);font-size:1rem;">&times;</button></td>' +
      '</tr>';
    }
    tb.innerHTML = html;
  }

  function addGPACourseRow() {
    courseRows.push({ name: 'Course ' + (courseRows.length + 1), grade: 'A', credits: 3, type: 'standard' });
    renderGPATable();
    calcGPA();
  }

  function removeGPACourseRow(idx) {
    if (courseRows.length > 1) {
      courseRows.splice(idx, 1);
      renderGPATable();
      calcGPA();
    }
  }

  function updateCourse(idx, field, val) {
    if (field === 'credits') {
      courseRows[idx][field] = parseFloat(val) || 0;
    } else {
      courseRows[idx][field] = val;
    }
    calcGPA();
  }

  function calcGPA() {
    var scaleMode = document.getElementById('gpa-scale').value;
    var priorGPA = parseFloat(document.getElementById('gpa-prior-gpa').value) || 0;
    var priorCredits = parseFloat(document.getElementById('gpa-prior-credits').value) || 0;
    var targetGoal = parseFloat(document.getElementById('gpa-target-goal').value) || 0;
    var totalDegreeCredits = parseFloat(document.getElementById('gpa-total-degree-credits').value) || 120;

    var termQualityPts = 0;
    var termUnweightedPts = 0;
    var termCredits = 0;

    var pointMap = GRADE_POINTS[scaleMode] || GRADE_POINTS['4.0'];

    for (var i = 0; i < courseRows.length; i++) {
      var r = courseRows[i];
      var basePt = pointMap[r.grade] !== undefined ? pointMap[r.grade] : 0.0;
      var bonus = 0;
      if (scaleMode === 'weighted') {
        if (r.type === 'honors') bonus = 0.5;
        if (r.type === 'ap') bonus = 1.0;
      }
      var coursePt = basePt + bonus;
      termQualityPts += coursePt * r.credits;
      termUnweightedPts += basePt * r.credits;
      termCredits += r.credits;
    }

    var termGPA = termCredits > 0 ? (termQualityPts / termCredits) : 0;
    var termUnweightedGPA = termCredits > 0 ? (termUnweightedPts / termCredits) : 0;

    var priorQualityPts = priorGPA * priorCredits;
    var totalQualityPts = priorQualityPts + termQualityPts;
    var totalCredits = priorCredits + termCredits;

    var newCumGPA = totalCredits > 0 ? (totalQualityPts / totalCredits) : termGPA;

    // Target GPA Planning
    var remainingCredits = Math.max(0, totalDegreeCredits - totalCredits);
    var targetQPNeeded = (targetGoal * totalDegreeCredits) - totalQualityPts;
    var requiredRemainingGPA = remainingCredits > 0 ? (targetQPNeeded / remainingCredits) : 0;

    // Display Hero cards
    document.getElementById('card-gpa-term').textContent = termGPA.toFixed(2);
    document.getElementById('card-gpa-weighted-sub').textContent = 'Unweighted: ' + termUnweightedGPA.toFixed(2) + ' (' + termCredits + ' credits)';

    document.getElementById('card-gpa-cum').textContent = newCumGPA.toFixed(2);
    document.getElementById('card-gpa-credits-sub').textContent = totalCredits + ' total credits completed';

    document.getElementById('card-gpa-qp').textContent = totalQualityPts.toFixed(1);

    var neededEl = document.getElementById('card-gpa-needed');
    var neededSubEl = document.getElementById('card-gpa-needed-sub');

    if (remainingCredits <= 0) {
      neededEl.textContent = 'Graduated';
      neededSubEl.textContent = 'All ' + totalDegreeCredits + ' degree credits finished';
    } else if (requiredRemainingGPA > 4.0 && scaleMode !== 'weighted') {
      neededEl.textContent = requiredRemainingGPA.toFixed(2) + ' ⚠️';
      neededEl.style.color = '#ef4444';
      neededSubEl.textContent = 'Exceeds 4.0 cap (mathematically unreachable without repeats)';
    } else if (requiredRemainingGPA <= 0) {
      neededEl.textContent = 'Achieved';
      neededEl.style.color = '#10b981';
      neededSubEl.textContent = 'Target guaranteed even with 0.0 remaining GPA';
    } else {
      neededEl.textContent = requiredRemainingGPA.toFixed(2);
      neededEl.style.color = '#f59e0b';
      neededSubEl.textContent = 'Required average across remaining ' + remainingCredits + ' credits';
    }

    renderGPAGauge(newCumGPA);

    // Derivations
    var deriv = [
      '1. Term Quality Points: &sum;(Course Points &times; Credits) = <strong>' + termQualityPts.toFixed(2) + ' quality points</strong> across ' + termCredits + ' credits',
      '2. Semester GPA Formula: ' + termQualityPts.toFixed(2) + ' &divide; ' + termCredits + ' = <strong>' + termGPA.toFixed(3) + ' Term GPA</strong>',
      '3. Cumulative GPA Formula: (' + priorQualityPts.toFixed(1) + ' prior QP + ' + termQualityPts.toFixed(2) + ' term QP) &divide; ' + totalCredits + ' credits = <strong>' + newCumGPA.toFixed(3) + ' Cumulative GPA</strong>'
    ];

    if (remainingCredits > 0) {
      deriv.push('4. Target GPA Formula: [(' + targetGoal.toFixed(2) + ' target &times; ' + totalDegreeCredits + ' credits) - ' + totalQualityPts.toFixed(1) + ' earned QP] &divide; ' + remainingCredits + ' remaining credits = <strong>' + requiredRemainingGPA.toFixed(2) + ' required average GPA</strong>');
    }

    document.getElementById('gpa-derivations').innerHTML = deriv.join('<br>');
  }

  function renderGPAGauge(gpa) {
    var c = document.getElementById('gpa-svg-container');
    if (!c) return;

    var w = c.clientWidth || 600;
    var h = 55;
    var barH = 20;
    var y = 14;

    var minG = 2.0;
    var maxG = 4.0;
    var clamped = Math.max(minG, Math.min(maxG, gpa));
    var pct = (clamped - minG) / (maxG - minG);

    var needleX = 2 + pct * (w - 4);

    var svg = '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" style="display:block;">';

    // Zones
    var wGood = 0.5 * (w - 4); // 2.0 to 3.0
    var wHonors = 0.25 * (w - 4); // 3.0 to 3.5
    var wDeans = 0.15 * (w - 4); // 3.5 to 3.8
    var wSumma = 0.10 * (w - 4); // 3.8 to 4.0

    svg += '<rect x="2" y="' + y + '" width="' + wGood + '" height="' + barH + '" rx="4" fill="#64748b" />';
    svg += '<rect x="' + (2 + wGood) + '" y="' + y + '" width="' + wHonors + '" height="' + barH + '" fill="#3b82f6" />';
    svg += '<rect x="' + (2 + wGood + wHonors) + '" y="' + y + '" width="' + wDeans + '" height="' + barH + '" fill="#8b5cf6" />';
    svg += '<rect x="' + (2 + wGood + wHonors + wDeans) + '" y="' + y + '" width="' + wSumma + '" height="' + barH + '" rx="4" fill="#10b981" />';

    // Needle
    svg += '<line x1="' + needleX + '" y1="' + (y - 4) + '" x2="' + needleX + '" y2="' + (y + barH + 4) + '" stroke="#ffffff" stroke-width="2.5" />';
    svg += '<text x="' + needleX + '" y="' + (y + barH + 16) + '" fill="#10b981" font-family="var(--mono)" font-size="11" text-anchor="middle" font-weight="bold">GPA: ' + gpa.toFixed(2) + '</text>';

    svg += '</svg>';
    c.innerHTML = svg;

    var standing = 'Good Standing';
    if (gpa >= 3.9) standing = 'Summa Cum Laude (Top Tier Honors)';
    else if (gpa >= 3.75) standing = 'Magna Cum Laude Honors';
    else if (gpa >= 3.5) standing = "Dean's List / Cum Laude Standing";
    else if (gpa >= 3.0) standing = 'Academic Honors Standing';
    document.getElementById('gpa-standing-text').textContent = standing;
  }

  function copyGPAReport(btn) {
    var term = document.getElementById('card-gpa-term').textContent;
    var cum = document.getElementById('card-gpa-cum').textContent;
    var qp = document.getElementById('card-gpa-qp').textContent;
    var needed = document.getElementById('card-gpa-needed').textContent + ' (' + document.getElementById('card-gpa-needed-sub').textContent + ')';
    var scale = document.getElementById('gpa-scale').value;

    var lines = [
      '========================================',
      '      ACADEMIC GPA TRANSCRIPT REPORT',
      '========================================',
      'Grading Scale Model : ' + scale,
      'Semester Term GPA   : ' + term,
      'Cumulative Total GPA: ' + cum,
      'Total Quality Points: ' + qp,
      'Target Goal Status  : ' + needed,
      '----------------------------------------',
      'Course Schedule Summary:'
    ];

    for (var i = 0; i < courseRows.length; i++) {
      var r = courseRows[i];
      lines.push('  • ' + r.name + ': Grade ' + r.grade + ' (' + r.credits + ' cr, ' + r.type + ')');
    }

    lines.push('========================================');
    lines.push('Source: Digital Tools Shed (https://digitaltoolsshed.com/math/gpa-calculator.html)');

    navigator.clipboard.writeText(lines.join('\n')).then(function() {
      var orig = btn.innerHTML;
      btn.innerHTML = '✅ Copied GPA Report!';
      btn.style.borderColor = '#10b981';
      setTimeout(function() {
        btn.innerHTML = orig;
        btn.style.borderColor = '';
      }, 2000);
    });
  }

  window.addEventListener('resize', calcGPA);
  document.addEventListener('DOMContentLoaded', function() {
    renderGPATable();
    calcGPA();
  });
  renderGPATable();
  calcGPA();
</script>
`
  },
      {
    slug: "fraction-to-decimal",
    title: "Fraction to Decimal Converter (with Repeating Decimals & Tape Measure)",
    metaDesc: "Convert proper, improper, and mixed fractions into decimals, percentages, and millimeter equivalents. Detects repeating decimals and plots on an interactive tape measure.",
    category: "Math & Units",
    faq: [
        {
            "q": "How do you convert any fraction into a decimal?",
            "a": "To convert any fraction to a decimal, divide the numerator (top number) by the denominator (bottom number): Decimal = Numerator ÷ Denominator. For a mixed number (such as 2 3/4), first convert the fractional part (3 ÷ 4 = 0.75) and then add the whole integer: 2 + 0.75 = 2.75."
        },
        {
            "q": "How do you know if a fraction produces a terminating or repeating decimal?",
            "a": "In a fully reduced fraction (where numerator and denominator share no common divisors), the decimal terminates in base-10 if and only if the prime factorization of the denominator contains ONLY 2s, 5s, or both (such as 1/2, 1/4, 1/5, 1/8, 1/10, 1/16, 1/32). If the denominator contains any other prime factor (such as 3, 7, 11, 13), the decimal is mathematically guaranteed to repeat infinitely."
        },
        {
            "q": "What is 3/8 as a decimal, percentage, and on a tape measure?",
            "a": "3/8 as a decimal is exactly 0.375 (3 ÷ 8 = 0.375), which equals 37.5%. On a standard imperial construction tape measure, 3/8 of an inch equals exactly 6 sixteenths (6/16\"), 12 thirty-seconds (12/32\"), or 9.525 millimeters in metric units."
        },
        {
            "q": "What is the difference between a terminating decimal and a repeating decimal?",
            "a": "A terminating decimal has a finite number of digits following the decimal point (e.g., 1/4 = 0.25, 7/8 = 0.875). A repeating decimal continues infinitely, repeating a single digit or a multi-digit sequence known as a repetend (e.g., 1/3 = 0.333..., 1/7 = 0.142857142857...). Both terminating and repeating decimals are rational numbers."
        },
        {
            "q": "How do you convert fraction of an inch measurements to metric millimeters?",
            "a": "By international agreement since 1959, exactly 1 inch is defined as 25.4 millimeters. To convert any fraction of an inch to millimeters, compute its decimal equivalent and multiply by 25.4. For example, 5/16\" = 0.3125 inches × 25.4 mm/inch = 7.9375 mm."
        }
    ],
    body: `
<div class="article-container" style="max-width:1050px;margin:0 auto;padding:1.5rem 1rem;">
  <nav style="font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);">
    <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Fraction to Decimal Converter
  </nav>

  <header style="margin-bottom:2rem;text-align:center;">
    <h1 style="font-family:var(--serif);font-size:2.2rem;margin-bottom:0.5rem;letter-spacing:-0.02em;">Fraction to Decimal Converter</h1>
    <p style="color:var(--text-muted);font-size:1.05rem;max-width:750px;margin:0 auto;line-height:1.6;">
      Convert proper, improper, and mixed fractions into decimals, percentages, and metric millimeters. Detects repeating cycles and plots positions on an interactive construction tape measure.
    </p>
  </header>

  <style>
    .f2d-box { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:1.75rem; margin-bottom:2rem; }
    .f2d-entry-row { display:flex; align-items:center; justify-content:center; gap:1.25rem; margin-bottom:1.5rem; flex-wrap:wrap; }
    .f2d-unit { display:inline-flex; align-items:center; gap:0.5rem; background:var(--surface-alt); padding:1rem; border-radius:8px; border:1px solid var(--border); }
    .f2d-stacked { display:inline-flex; flex-direction:column; align-items:center; width:75px; }
    .f2d-input { width:70px; text-align:center; padding:0.5rem; background:var(--surface); border:1px solid var(--border); border-radius:4px; color:var(--fg); font-family:var(--mono); font-size:1.2rem; font-weight:bold; }
    .f2d-bar { width:100%; height:2px; background:var(--fg); margin:3px 0; }
    .f2d-grid-4 { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1.5rem; }
    .f2d-card { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; text-align:center; position:relative; }
    .f2d-badge { position:absolute; top:8px; right:8px; font-family:var(--mono); font-size:0.65rem; padding:2px 6px; border-radius:4px; }
    .f2d-trap-card { background:var(--surface-alt); border-left:4px solid #ef4444; border-radius:0 6px 6px 0; padding:1rem 1.25rem; margin-bottom:1rem; }
    .f2d-trap-title { font-family:var(--serif); font-weight:600; font-size:1.05rem; color:var(--fg); margin-bottom:0.25rem; }
    .f2d-trap-desc { font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin:0; }
    .f2d-svg-box { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; margin-top:1.5rem; }
  </style>

  <div class="f2d-box">
    <!-- Fraction Entry -->
    <div class="f2d-entry-row">
      <div class="f2d-unit">
        <div>
          <label style="display:block;font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);text-align:center;margin-bottom:2px;">Whole (Opt)</label>
          <input type="number" id="f2d-w" value="0" min="0" step="1" oninput="calcF2D()" class="f2d-input" placeholder="0">
        </div>
        <div class="f2d-stacked">
          <label style="display:block;font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);text-align:center;margin-bottom:2px;">Numerator</label>
          <input type="number" id="f2d-n" value="3" min="0" step="1" oninput="calcF2D()" class="f2d-input">
          <div class="f2d-bar"></div>
          <input type="number" id="f2d-d" value="8" min="1" step="1" oninput="calcF2D()" class="f2d-input">
          <label style="display:block;font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);text-align:center;margin-top:2px;">Denominator</label>
        </div>
      </div>
    </div>

    <!-- Quick Presets -->
    <div style="margin-bottom:1.5rem;display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;justify-content:center;">
      <span style="font-family:var(--mono);font-size:0.75rem;color:var(--text-muted);margin-right:0.25rem;">Standard Fractions:</span>
      <button type="button" class="btn-sec" onclick="setF2DPreset(0, 1, 8)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">1/8 (0.125)</button>
      <button type="button" class="btn-sec" onclick="setF2DPreset(0, 1, 4)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">1/4 (0.250)</button>
      <button type="button" class="btn-sec" onclick="setF2DPreset(0, 3, 8)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">3/8 (0.375)</button>
      <button type="button" class="btn-sec" onclick="setF2DPreset(0, 5, 8)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">5/8 (0.625)</button>
      <button type="button" class="btn-sec" onclick="setF2DPreset(1, 3, 4)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">1 3/4 (1.750)</button>
      <button type="button" class="btn-sec" onclick="setF2DPreset(0, 1, 3)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">1/3 (0.333...)</button>
    </div>

    <!-- Hero Cards -->
    <div class="f2d-grid-4">
      <div class="f2d-card" style="border-top:4px solid #10b981;">
        <span class="f2d-badge" style="background:rgba(16,185,129,0.15);color:#10b981;">Decimal</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Decimal Output</div>
        <div id="card-f2d-dec" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:#10b981;">0.3750</div>
        <div id="card-f2d-type-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Terminating Decimal</div>
      </div>

      <div class="f2d-card" style="border-top:4px solid #3b82f6;">
        <span class="f2d-badge" style="background:rgba(59,130,246,0.15);color:#3b82f6;">Percent</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Percentage</div>
        <div id="card-f2d-pct" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:#3b82f6;">37.50%</div>
        <div id="card-f2d-improper-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Improper: 3/8</div>
      </div>

      <div class="f2d-card" style="border-top:4px solid #8b5cf6;">
        <span class="f2d-badge" style="background:rgba(139,92,246,0.15);color:#8b5cf6;">Metric</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Metric Millimeters</div>
        <div id="card-f2d-mm" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:var(--fg);">9.53 mm</div>
        <div style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Exact: 9.525 mm</div>
      </div>

      <div class="f2d-card" style="border-top:4px solid #f59e0b;">
        <span class="f2d-badge" style="background:rgba(245,158,11,0.15);color:#f59e0b;">Tape</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Ruler 16ths</div>
        <div id="card-f2d-tape" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:#f59e0b;">3/8"</div>
        <div id="card-f2d-tape-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">6 sixteenths (6/16")</div>
      </div>
    </div>

    <!-- Pure SVG Tape Measure Visualizer -->
    <div class="f2d-svg-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;">
        <span style="font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">Visual Tape Measure Alignment Indicator</span>
        <span id="f2d-svg-info" style="font-family:var(--mono);font-size:0.78rem;color:var(--text-muted);">Position: 0.375" (3/8")</span>
      </div>
      <div id="f2d-svg-container" style="width:100%;height:80px;"></div>
    </div>

    <!-- Live Step-by-Step Derivations -->
    <div style="margin-top:1.5rem;background:var(--surface-alt);border-left:3px solid #3b82f6;padding:1.1rem 1.25rem;border-radius:0 6px 6px 0;font-size:0.88rem;line-height:1.6;">
      <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Live Mathematical Derivations:</div>
      <div id="f2d-derivations" style="font-family:var(--mono);color:var(--fg);"></div>
    </div>

    <!-- One-Click Copy Button -->
    <div style="margin-top:1.5rem;display:flex;justify-content:flex-end;">
      <button type="button" class="btn-sec" onclick="copyF2DReport(this)" style="font-family:var(--mono);font-size:0.85rem;padding:0.6rem 1.25rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;cursor:pointer;color:var(--fg);">
        📋 Copy Fraction to Decimal Takeoff
      </button>
    </div>
  </div>

  <!-- Real-World Traps Section -->
  <div style="margin-bottom:2.5rem;">
    <h2 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:1rem;letter-spacing:-0.01em;">5 Fatal Traps &amp; Gotchas in Fraction to Decimal Conversion</h2>

    <div class="f2d-trap-card">
      <div class="f2d-trap-title">1. The Denominator Prime Factorization Rule</div>
      <p class="f2d-trap-desc">
        Why does 1/8 terminate (0.125) while 1/6 repeats (0.1666...)? In base-10 mathematics (factors 2 and 5), a reduced fraction terminates if and only if its denominator's prime factorization contains exclusively 2s and 5s ($2^a 	imes 5^b$). The denominator of 1/6 contains the prime factor 3 ($2 	imes 3$), making an infinite repeating cycle mathematically unavoidable.
      </p>
    </div>

    <div class="f2d-trap-card">
      <div class="f2d-trap-title">2. Dropping Whole Numbers in Mixed Fractions</div>
      <p class="f2d-trap-desc">
        A common calculation error is computing the decimal of the fraction part and forgetting the integer: converting <code>3 5/8</code> into <code>0.625</code> instead of <code>3.625</code>. In architectural estimates, cutting a 3-foot board at 0.625 feet results in 73% material waste and ruined construction framing.
      </p>
    </div>

    <div class="f2d-trap-card">
      <div class="f2d-trap-title">3. Premature Rounding of Repeating Decimals</div>
      <p class="f2d-trap-desc">
        Rounding 1/3 to <code>0.33</code> in multi-step engineering calculations introduces a 1.0% compound error. In structural civil engineering or pharmaceutical chemical compounding, accumulating rounded decimals across twenty calculation stages causes severe structural drift or hazardous dosage deviations. Always preserve fractions in memory until the final result.
      </p>
    </div>

    <div class="f2d-trap-card">
      <div class="f2d-trap-title">4. Metric Millimeter Imperial Conversion Inaccuracy</div>
      <p class="f2d-trap-desc">
        Some international tradespeople use the shortcut rule that 1 inch ≈ 25 mm. Because 1 inch is legally defined as exactly <code>25.4 mm</code>, using 25 mm creates a -1.57% compounding shrinkage error. Over a 100-inch architectural beam span, this shortcut creates an error of nearly 1.6 inches (40 mm), guaranteeing structural misalignment.
      </p>
    </div>

    <div class="f2d-trap-card">
      <div class="f2d-trap-title">5. Sign Placement with Negative Mixed Numbers</div>
      <p class="f2d-trap-desc">
        When evaluating <code>-1 1/2</code>, beginners often write <code>-1 + 0.5 = -0.5</code>. In mathematical notation, the negative sign factors across the entire mixed expression: <code>-(1 + 1/2) = -(1.5) = -1.5</code>. Neglecting the parenthesis changes both the sign and magnitude of the result.
      </p>
    </div>
  </div>
</div>

<script>
  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      var t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  function setF2DPreset(w, n, d) {
    document.getElementById('f2d-w').value = w;
    document.getElementById('f2d-n').value = n;
    document.getElementById('f2d-d').value = d;
    calcF2D();
  }

  function checkTerminating(den) {
    var d = den;
    while (d % 2 === 0) d /= 2;
    while (d % 5 === 0) d /= 5;
    return d === 1;
  }

  function calcF2D() {
    var w = parseInt(document.getElementById('f2d-w').value, 10) || 0;
    var n = parseInt(document.getElementById('f2d-n').value, 10) || 0;
    var d = parseInt(document.getElementById('f2d-d').value, 10) || 1;
    if (d <= 0) d = 1;

    var g = gcd(n, d);
    var redN = n / g;
    var redD = d / g;

    var impN = (w * redD) + redN;
    var rawDec = impN / redD;
    var isTerm = checkTerminating(redD);

    var decStr = rawDec.toFixed(6);
    if (isTerm) {
      // Strip trailing zeros after decimal
      decStr = parseFloat(rawDec.toFixed(8)).toString();
    }

    var pct = rawDec * 100;
    var mm = rawDec * 25.4;

    // Tape measure 16ths
    var tape16 = Math.round(rawDec * 16);
    var tWhole = Math.floor(tape16 / 16);
    var tRem = tape16 % 16;
    var g16 = gcd(tRem, 16);

    var tapeStr = '';
    if (tRem === 0) {
      tapeStr = tWhole + '"';
    } else if (tWhole === 0) {
      tapeStr = (tRem / g16) + '/' + (16 / g16) + '"';
    } else {
      tapeStr = tWhole + ' ' + (tRem / g16) + '/' + (16 / g16) + '"';
    }

    // Display Hero cards
    document.getElementById('card-f2d-dec').textContent = decStr;
    document.getElementById('card-f2d-type-sub').textContent = isTerm ? 'Terminating Decimal' : 'Infinite Repeating Cycle';

    document.getElementById('card-f2d-pct').textContent = pct.toFixed(2) + '%';
    document.getElementById('card-f2d-improper-sub').textContent = 'Improper: ' + impN + '/' + redD;

    document.getElementById('card-f2d-mm').textContent = mm.toFixed(2) + ' mm';

    document.getElementById('card-f2d-tape').textContent = tapeStr;
    document.getElementById('card-f2d-tape-sub').textContent = tape16 + ' sixteenths (' + tape16 + '/16")';

    document.getElementById('f2d-svg-info').textContent = 'Position: ' + (rawDec % 1).toFixed(3) + '" (' + tapeStr + ')';

    renderF2DTape(rawDec);

    // Derivations
    var deriv = [
      '1. Simplified Fraction: ' + (w > 0 ? (w + ' ' + redN + '/' + redD) : (redN + '/' + redD)) + ' &bull; Improper: ' + impN + '/' + redD,
      '2. Long Division: ' + impN + ' &divide; ' + redD + ' = <strong>' + decStr + '</strong>',
      '3. Decimal Classification: Denominator ' + redD + ' ' + (isTerm ? 'contains ONLY prime factors of 2 and 5 &rarr; <strong>Terminates exactly</strong>' : 'contains other prime factors &rarr; <strong>Repeats infinitely</strong>'),
      '4. Percentage Equivalent: ' + decStr + ' &times; 100% = <strong>' + pct.toFixed(4) + '%</strong>',
      '5. Metric Conversion: ' + decStr + ' inches &times; 25.4 mm/inch = <strong>' + mm.toFixed(4) + ' mm</strong>'
    ];
    document.getElementById('f2d-derivations').innerHTML = deriv.join('<br>');
  }

  function renderF2DTape(val) {
    var c = document.getElementById('f2d-svg-container');
    if (!c) return;

    var w = c.clientWidth || 600;
    var h = 65;
    var pad = 30;
    var rulerW = w - (pad * 2);

    var fracPart = Math.abs(val) % 1;
    var markerX = pad + (fracPart * rulerW);

    var svg = '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" style="display:block;">';

    svg += '<rect x="' + pad + '" y="10" width="' + rulerW + '" height="36" rx="2" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />';

    for (var i = 0; i <= 16; i++) {
      var tx = pad + (i / 16) * rulerW;
      var tickH = 10;
      if (i % 8 === 0) tickH = 24;
      else if (i % 4 === 0) tickH = 18;
      else if (i % 2 === 0) tickH = 14;

      svg += '<line x1="' + tx + '" y1="10" x2="' + tx + '" y2="' + (10 + tickH) + '" stroke="#1e293b" stroke-width="' + (i % 4 === 0 ? 1.5 : 1) + '" />';

      if (i === 0) {
        svg += '<text x="' + tx + '" y="42" fill="#1e293b" font-family="var(--mono)" font-size="10" text-anchor="start">0"</text>';
      } else if (i === 8) {
        svg += '<text x="' + tx + '" y="42" fill="#1e293b" font-family="var(--mono)" font-size="9" text-anchor="middle">1/2"</text>';
      } else if (i === 16) {
        svg += '<text x="' + tx + '" y="42" fill="#1e293b" font-family="var(--mono)" font-size="10" text-anchor="end">1"</text>';
      }
    }

    svg += '<line x1="' + markerX + '" y1="4" x2="' + markerX + '" y2="48" stroke="#ef4444" stroke-width="2.5" />';
    svg += '<polygon points="' + (markerX - 4) + ',4 ' + (markerX + 4) + ',4 ' + markerX + ',10" fill="#ef4444" />';
    svg += '<text x="' + markerX + '" y="60" fill="#ef4444" font-family="var(--mono)" font-size="11" font-weight="bold" text-anchor="middle">' + fracPart.toFixed(3) + '"</text>';

    svg += '</svg>';
    c.innerHTML = svg;
  }

  function copyF2DReport(btn) {
    var dec = document.getElementById('card-f2d-dec').textContent;
    var pct = document.getElementById('card-f2d-pct').textContent;
    var mm = document.getElementById('card-f2d-mm').textContent;
    var tape = document.getElementById('card-f2d-tape').textContent;
    var w = document.getElementById('f2d-w').value;
    var n = document.getElementById('f2d-n').value;
    var d = document.getElementById('f2d-d').value;

    var fracStr = (w && w !== '0' ? (w + ' ') : '') + n + '/' + d;

    var lines = [
      '========================================',
      '      FRACTION TO DECIMAL CONVERSION',
      '========================================',
      'Input Fraction      : ' + fracStr,
      'Decimal Output      : ' + dec,
      'Percentage          : ' + pct,
      'Metric Equivalent   : ' + mm,
      'Tape Measure Snapped: ' + tape,
      '========================================',
      'Source: Digital Tools Shed (https://digitaltoolsshed.com/math/fraction-to-decimal.html)'
    ];

    navigator.clipboard.writeText(lines.join('\n')).then(function() {
      var orig = btn.innerHTML;
      btn.innerHTML = '✅ Copied Fraction Takeoff!';
      btn.style.borderColor = '#10b981';
      setTimeout(function() {
        btn.innerHTML = orig;
        btn.style.borderColor = '';
      }, 2000);
    });
  }

  window.addEventListener('resize', calcF2D);
  document.addEventListener('DOMContentLoaded', calcF2D);
  calcF2D();
</script>
`
  },
      {
    slug: "decimal-to-fraction",
    title: "Decimal to Fraction Converter (Simplified, Mixed & Tape Measure)",
    metaDesc: "Convert any terminating or repeating decimal into a fully simplified fraction or mixed number. Solves repeating cycles algebraically with nearest 1/16\", 1/32\", and 1/64\" tape measure ruler snapping.",
    category: "Math & Units",
    faq: [
        {
            "q": "How do you convert a terminating decimal into a simplified fraction?",
            "a": "To convert a terminating decimal into a simplified fraction: 1) Count the number of decimal digits (N) to the right of the decimal point; 2) Write the decimal digits as the numerator over a denominator of 10^N (for example, 0.375 has 3 decimal places, so it becomes 375 / 1000); 3) Compute the Greatest Common Divisor (GCD) of the numerator and denominator using Euclid's algorithm [GCD(375, 1000) = 125]; 4) Divide both by the GCD: 375 ÷ 125 = 3 and 1000 ÷ 125 = 8, yielding the simplified fraction 3/8."
        },
        {
            "q": "How do you convert a repeating decimal into an exact rational fraction?",
            "a": "Use algebraic substitution to eliminate the infinite repeating tail. Let x equal the decimal (e.g., x = 0.1666...). Multiply x by 10 to shift the non-repeating digit past the decimal point: 10x = 1.666... Then multiply by 100 to shift one repeating cycle past: 100x = 16.666... Subtract the first equation from the second: 100x - 10x = 16.666... - 1.666..., giving 90x = 15. Finally, divide to isolate x: x = 15/90 = 1/6."
        },
        {
            "q": "Why can some decimals not be converted into fractions?",
            "a": "Decimals that are both non-terminating and non-repeating are irrational numbers (such as π = 3.14159..., e = 2.71828..., and √2 = 1.41421...). By definition, an irrational number cannot be expressed as a ratio of two integers (A / B). A decimal can be converted into an exact fraction if and only if it terminates or eventually enters an infinitely repeating cycle of digits."
        },
        {
            "q": "How do you know if a fraction produces a terminating or repeating decimal?",
            "a": "In a fully reduced fraction (coprime numerator and denominator), the decimal terminates in base-10 if and only if the prime factorization of the denominator contains ONLY powers of 2, powers of 5, or both (e.g., 2, 4, 5, 8, 10, 16, 20, 25, 32, 40, 50). If the denominator contains ANY other prime factor (such as 3, 7, 11, 13), the decimal is mathematically guaranteed to repeat infinitely."
        },
        {
            "q": "What is the difference between an improper fraction and a mixed number?",
            "a": "An improper fraction has a numerator greater than or equal to its denominator (such as 19/8), representing a single ratio. A mixed number converts the improper fraction into a whole integer combined with a remaining proper fraction (such as 2 3/8). In construction, woodworking, and machining, mixed numbers are universally preferred because they align directly with tape measure inch markings."
        }
    ],
    body: `
<div class="article-container" style="max-width:1050px;margin:0 auto;padding:1.5rem 1rem;">
  <nav style="font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);">
    <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Decimal to Fraction Converter
  </nav>

  <header style="margin-bottom:2rem;text-align:center;">
    <h1 style="font-family:var(--serif);font-size:2.2rem;margin-bottom:0.5rem;letter-spacing:-0.02em;">Decimal to Fraction Converter</h1>
    <p style="color:var(--text-muted);font-size:1.05rem;max-width:750px;margin:0 auto;line-height:1.6;">
      Convert terminating and repeating decimals into fully simplified fractions and mixed numbers. Features Euclidean GCD reduction and imperial construction tape measure snapping.
    </p>
  </header>

  <style>
    .d2f-box { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:1.75rem; margin-bottom:2rem; }
    .d2f-grid-3 { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem; margin-bottom:1.25rem; }
    .d2f-grid-4 { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1.5rem; }
    .d2f-card { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; text-align:center; position:relative; }
    .d2f-badge { position:absolute; top:8px; right:8px; font-family:var(--mono); font-size:0.65rem; padding:2px 6px; border-radius:4px; }
    .d2f-tab-btn { background:var(--surface-alt); border:1px solid var(--border); color:var(--text-muted); padding:0.6rem 1.25rem; font-family:var(--mono); font-size:0.85rem; border-radius:6px; cursor:pointer; transition:all 0.15s ease; }
    .d2f-tab-btn.active { background:#3b82f6; border-color:#2563eb; color:#ffffff; font-weight:600; }
    .d2f-trap-card { background:var(--surface-alt); border-left:4px solid #ef4444; border-radius:0 6px 6px 0; padding:1rem 1.25rem; margin-bottom:1rem; }
    .d2f-trap-title { font-family:var(--serif); font-weight:600; font-size:1.05rem; color:var(--fg); margin-bottom:0.25rem; }
    .d2f-trap-desc { font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin:0; }
    .d2f-svg-box { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; margin-top:1.5rem; }
  </style>

  <div class="d2f-box">
    <!-- Mode Switcher -->
    <div style="display:flex;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap;">
      <button type="button" class="d2f-tab-btn active" id="btn-d2f-term" onclick="setD2FMode('term')">Mode 1: Terminating Decimal (e.g. 0.375, 2.625)</button>
      <button type="button" class="d2f-tab-btn" id="btn-d2f-rep" onclick="setD2FMode('rep')">Mode 2: Repeating Decimal (e.g. 0.333..., 0.1666...)</button>
    </div>

    <!-- Inputs Row -->
    <div class="d2f-grid-3">
      <div id="d2f-input-col-main">
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;" id="lbl-d2f-val">Decimal Number to Convert</label>
        <input type="text" id="d2f-val" value="2.375" oninput="calcD2F()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.25rem;font-weight:bold;box-sizing:border-box;">
      </div>

      <div id="d2f-rep-prefix-col" style="display:none;">
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Non-Repeating Part (e.g. 0.1 for 0.166...)</label>
        <input type="text" id="d2f-rep-non" value="0.1" oninput="calcD2F()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.25rem;box-sizing:border-box;">
      </div>

      <div id="d2f-rep-cycle-col" style="display:none;">
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Repeating Cycle Digits (e.g. 6 for 0.166...)</label>
        <input type="text" id="d2f-rep-cycle" value="6" oninput="calcD2F()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.25rem;font-weight:bold;box-sizing:border-box;">
      </div>

      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Tape Measure Ruler Snapping</label>
        <select id="d2f-tape-res" onchange="calcD2F()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:0.95rem;box-sizing:border-box;">
          <option value="16" selected>Nearest 1/16" (Standard Construction)</option>
          <option value="32">Nearest 1/32" (Fine Cabinetry / Joinery)</option>
          <option value="64">Nearest 1/64" (Machining / Engineering)</option>
        </select>
      </div>
    </div>

    <!-- Quick Presets -->
    <div style="margin-bottom:1.5rem;display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
      <span style="font-family:var(--mono);font-size:0.75rem;color:var(--text-muted);margin-right:0.25rem;">Standard Conversions:</span>
      <button type="button" class="btn-sec" onclick="setD2FPreset('0.125')" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">0.125 &rarr; 1/8</button>
      <button type="button" class="btn-sec" onclick="setD2FPreset('0.375')" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">0.375 &rarr; 3/8</button>
      <button type="button" class="btn-sec" onclick="setD2FPreset('0.625')" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">0.625 &rarr; 5/8</button>
      <button type="button" class="btn-sec" onclick="setD2FPreset('2.875')" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">2.875 &rarr; 2 7/8</button>
      <button type="button" class="btn-sec" onclick="setD2FRepPreset('0', '3')" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">0.333... &rarr; 1/3</button>
    </div>

    <!-- Hero Cards -->
    <div class="d2f-grid-4">
      <div class="d2f-card" style="border-top:4px solid #10b981;">
        <span class="d2f-badge" style="background:rgba(16,185,129,0.15);color:#10b981;">Simplified</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Simplified Fraction</div>
        <div id="card-d2f-mixed" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:#10b981;">2 3/8</div>
        <div id="card-d2f-gcd-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Euclid GCD: &divide; 125</div>
      </div>

      <div class="d2f-card" style="border-top:4px solid #3b82f6;">
        <span class="d2f-badge" style="background:rgba(59,130,246,0.15);color:#3b82f6;">Improper</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Improper Fraction</div>
        <div id="card-d2f-improper" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:#3b82f6;">19/8</div>
        <div id="card-d2f-pct-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">237.5% of unity</div>
      </div>

      <div class="d2f-card" style="border-top:4px solid #f59e0b;">
        <span class="d2f-badge" style="background:rgba(245,158,11,0.15);color:#f59e0b;">Tape Measure</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Ruler Snapping</div>
        <div id="card-d2f-tape" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:#f59e0b;">2 3/8"</div>
        <div id="card-d2f-tape-delta" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Exact match (&Delta; 0.000")</div>
      </div>

      <div class="d2f-card" style="border-top:4px solid #8b5cf6;">
        <span class="d2f-badge" style="background:rgba(139,92,246,0.15);color:#8b5cf6;">Metric</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Millimeters (mm)</div>
        <div id="card-d2f-mm" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:var(--fg);">60.33 mm</div>
        <div style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">1 inch = 25.4 mm</div>
      </div>
    </div>

    <!-- Pure SVG Tape Measure Visualizer -->
    <div class="d2f-svg-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;">
        <span style="font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">Precision Imperial Tape Measure Tick Marker</span>
        <span id="d2f-svg-tick-info" style="font-family:var(--mono);font-size:0.78rem;color:var(--text-muted);">Snapped to 3/8" mark (6/16")</span>
      </div>
      <div id="d2f-svg-container" style="width:100%;height:80px;"></div>
    </div>

    <!-- Live Step-by-Step Derivations -->
    <div style="margin-top:1.5rem;background:var(--surface-alt);border-left:3px solid #10b981;padding:1.1rem 1.25rem;border-radius:0 6px 6px 0;font-size:0.88rem;line-height:1.6;">
      <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Live Mathematical Derivation:</div>
      <div id="d2f-derivations" style="font-family:var(--mono);color:var(--fg);"></div>
    </div>

    <!-- One-Click Copy Button -->
    <div style="margin-top:1.5rem;display:flex;justify-content:flex-end;">
      <button type="button" class="btn-sec" onclick="copyD2FReport(this)" style="font-family:var(--mono);font-size:0.85rem;padding:0.6rem 1.25rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;cursor:pointer;color:var(--fg);">
        📋 Copy Decimal to Fraction Takeoff
      </button>
    </div>
  </div>

  <!-- Real-World Traps Section -->
  <div style="margin-bottom:2.5rem;">
    <h2 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:1rem;letter-spacing:-0.01em;">5 Fatal Traps &amp; Gotchas in Decimal to Fraction Conversion</h2>

    <div class="d2f-trap-card">
      <div class="d2f-trap-title">1. Truncating Repeating Decimals (The 0.33 vs 1/3 Trap)</div>
      <p class="d2f-trap-desc">
        Entering <code>0.33</code> or <code>0.66</code> into a terminating converter produces <code>33/100</code> and <code>33/50</code>, neither of which is 1/3 or 2/3! Repeating decimals have an infinite sequence of repeating digits. To convert repeating decimals to exact fractions, you must use algebraic subtraction: <code>10x - x = 9x &rarr; x = 3/9 = 1/3</code>.
      </p>
    </div>

    <div class="d2f-trap-card">
      <div class="d2f-trap-title">2. Binary Floating-Point Rounding Drift</div>
      <p class="d2f-trap-desc">
        Computers store decimals in IEEE-754 binary floating-point format. Numbers like <code>0.1</code> or <code>0.7</code> cannot be represented with exact precision in binary (e.g., 0.7 is internally stored as <code>0.699999999999999955...</code>). Naive fraction algorithms that do not apply epsilon rounding tolerances can fail to identify simple fractions like 7/10, outputting absurd ratios like <code>7000000000000001 / 10000000000000000</code>.
      </p>
    </div>

    <div class="d2f-trap-card">
      <div class="d2f-trap-title">3. Carpentry Ruler Tolerance Drift</div>
      <p class="d2f-trap-desc">
        Architectural blueprints often specify decimal dimensions such as <code>0.350"</code>. Snapping 0.350" to the nearest 1/16" tick gives 6/16" (3/8" = 0.375"). This introduces an error of +0.025 inches (+25 thousandths). For structural framing, 25 thousandths is acceptable, but in cabinetry, mortise-and-tenon joinery, or metal lathe turning, this error will ruin the fit.
      </p>
    </div>

    <div class="d2f-trap-card">
      <div class="d2f-trap-title">4. Attempting to Convert Irrational Numbers</div>
      <p class="d2f-trap-desc">
        Constants like π (3.14159...) or √2 (1.41421...) are irrational and possess non-repeating infinite decimals. Any fraction representation (like 22/7 for π = 3.142857...) is strictly an engineering approximation. Trying to find an exact integer fraction for an irrational number is mathematically impossible.
      </p>
    </div>

    <div class="d2f-trap-card">
      <div class="d2f-trap-title">5. Negative Decimal Mixed Number Formatting</div>
      <p class="d2f-trap-desc">
        When converting negative decimals like <code>-2.375</code>, writing <code>-2 3/8</code> means <code>-(2 + 3/8) = -19/8</code>. A frequent coding bug treats the negative sign as applying only to the integer: <code>-2 + 3/8 = -13/8 = -1.625</code>. The negative sign must factor out across the entire mixed expression.
      </p>
    </div>
  </div>
</div>

<script>
  var curD2FMode = 'term';

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      var t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  function setD2FMode(m) {
    curD2FMode = m;
    document.getElementById('btn-d2f-term').className = 'd2f-tab-btn' + (m === 'term' ? ' active' : '');
    document.getElementById('btn-d2f-rep').className = 'd2f-tab-btn' + (m === 'rep' ? ' active' : '');

    var mainCol = document.getElementById('d2f-input-col-main');
    var nonCol = document.getElementById('d2f-rep-prefix-col');
    var cycCol = document.getElementById('d2f-rep-cycle-col');

    if (m === 'rep') {
      mainCol.style.display = 'none';
      nonCol.style.display = 'block';
      cycCol.style.display = 'block';
    } else {
      mainCol.style.display = 'block';
      nonCol.style.display = 'none';
      cycCol.style.display = 'none';
    }
    calcD2F();
  }

  function setD2FPreset(val) {
    setD2FMode('term');
    document.getElementById('d2f-val').value = val;
    calcD2F();
  }

  function setD2FRepPreset(non, cyc) {
    setD2FMode('rep');
    document.getElementById('d2f-rep-non').value = non;
    document.getElementById('d2f-rep-cycle').value = cyc;
    calcD2F();
  }

  function calcD2F() {
    var tapeRes = parseInt(document.getElementById('d2f-tape-res').value, 10) || 16;
    var num = 0, den = 1;
    var rawDec = 0;
    var deriv = [];

    if (curD2FMode === 'term') {
      var strVal = (document.getElementById('d2f-val').value || '').trim();
      rawDec = parseFloat(strVal) || 0;

      var isNeg = rawDec < 0;
      var cleanStr = strVal.replace('-', '');
      var parts = cleanStr.split('.');

      var intPart = parseInt(parts[0], 10) || 0;
      var decPart = parts[1] || '';

      if (decPart.length === 0) {
        num = rawDec;
        den = 1;
        deriv.push('1. Integer Value: ' + rawDec + ' = ' + rawDec + '/1');
      } else {
        var decLen = decPart.length;
        var rawNum = parseInt(decPart, 10) || 0;
        var rawDen = Math.pow(10, decLen);

        var g = gcd(rawNum, rawDen);
        var simpN = rawNum / g;
        var simpD = rawDen / g;

        num = (intPart * simpD) + simpN;
        den = simpD;
        if (isNeg) num = -num;

        deriv.push('1. Identify Decimal Places: ' + decLen + ' digits after point &rarr; Denominator 10^' + decLen + ' = <strong>' + rawDen + '</strong>');
        deriv.push('2. Initial Ratio: ' + cleanStr + ' = ' + (intPart > 0 ? (intPart + ' + ' + rawNum + '/' + rawDen) : (rawNum + '/' + rawDen)));
        deriv.push('3. Euclid GCD Reduction: GCD(' + rawNum + ', ' + rawDen + ') = ' + g + ' &rarr; Fractional Part: <strong>' + simpN + '/' + simpD + '</strong>');
      }
    } else {
      var nonStr = (document.getElementById('d2f-rep-non').value || '0').trim();
      var cycStr = (document.getElementById('d2f-rep-cycle').value || '3').trim();

      var nonDec = parseFloat(nonStr) || 0;
      var isNeg = nonDec < 0;

      var nonParts = nonStr.replace('-', '').split('.');
      var intPart = parseInt(nonParts[0], 10) || 0;
      var nonDecPart = nonParts[1] || '';

      var dNon = nonDecPart.length;
      var dCyc = cycStr.length;

      var p1 = Math.pow(10, dNon + dCyc);
      var p2 = Math.pow(10, dNon);

      var fullNumStr = nonParts[0] + nonDecPart + cycStr;
      var prefixNumStr = nonParts[0] + nonDecPart;

      var fullVal = parseInt(fullNumStr, 10) || 0;
      var prefVal = parseInt(prefixNumStr, 10) || 0;

      var repNum = fullVal - prefVal;
      var repDen = p1 - p2;

      var g = gcd(repNum, repDen);
      num = repNum / g;
      den = repDen / g;
      if (isNeg) num = -num;

      rawDec = num / den;

      deriv.push('1. Algebraic Setup: Let x = ' + nonStr + (cycStr ? cycStr.repeat(3) : '') + '...');
      deriv.push('2. Multiply to shift repeat period: ' + p1 + 'x = ' + fullNumStr + '.' + cycStr + '... and ' + p2 + 'x = ' + prefixNumStr + '.' + cycStr + '...');
      deriv.push('3. Subtract equations: (' + p1 + ' &minus; ' + p2 + ')x = ' + repDen + 'x = ' + repNum);
      deriv.push('4. Isolate x &amp; Reduce: ' + repNum + '/' + repDen + ' &divide; ' + g + ' = <strong>' + num + '/' + den + '</strong>');
    }

    var divG = gcd(num, den);
    var redNum = num / divG;
    var redDen = den / divG;

    var isNegative = redNum < 0;
    var absN = Math.abs(redNum);
    var whole = Math.floor(absN / redDen);
    var rem = absN % redDen;

    var mixedStr = '';
    if (redDen === 1) {
      mixedStr = (isNegative ? '-' : '') + absN;
    } else if (whole === 0) {
      mixedStr = (isNegative ? '-' : '') + rem + '/' + redDen;
    } else {
      mixedStr = (isNegative ? '-' : '') + whole + ' ' + rem + '/' + redDen;
    }

    // Tape measure snap
    var absDec = Math.abs(rawDec);
    var tapeTicks = Math.round(absDec * tapeRes);
    var tapeWhole = Math.floor(tapeTicks / tapeRes);
    var tapeRem = tapeTicks % tapeRes;
    var gTape = gcd(tapeRem, tapeRes);

    var tapeSimpN = tapeRem / gTape;
    var tapeSimpD = tapeRes / gTape;

    var tapeFractionStr = '';
    if (tapeSimpN === 0) {
      tapeFractionStr = (isNegative ? '-' : '') + tapeWhole + '"';
    } else if (tapeWhole === 0) {
      tapeFractionStr = (isNegative ? '-' : '') + tapeSimpN + '/' + tapeSimpD + '"';
    } else {
      tapeFractionStr = (isNegative ? '-' : '') + tapeWhole + ' ' + tapeSimpN + '/' + tapeSimpD + '"';
    }

    var snappedDec = tapeTicks / tapeRes;
    var delta = absDec - snappedDec;
    var deltaStr = Math.abs(delta) < 0.0001 ? 'Exact match (Δ 0.000")' : ('Δ ' + (delta >= 0 ? '+' : '') + delta.toFixed(4) + '" from ruler mark');

    var mmVal = rawDec * 25.4;

    // Display Hero cards
    document.getElementById('card-d2f-mixed').textContent = mixedStr;
    document.getElementById('card-d2f-gcd-sub').textContent = 'Euclid reduction: ' + redNum + '/' + redDen;

    document.getElementById('card-d2f-improper').textContent = redNum + '/' + redDen;
    document.getElementById('card-d2f-pct-sub').textContent = (rawDec * 100).toFixed(2) + '% of unity';

    document.getElementById('card-d2f-tape').textContent = tapeFractionStr;
    document.getElementById('card-d2f-tape-delta').textContent = deltaStr;

    document.getElementById('card-d2f-mm').textContent = mmVal.toFixed(2) + ' mm';

    document.getElementById('d2f-svg-tick-info').textContent = 'Snapped to ' + tapeFractionStr + ' (' + tapeTicks + '/' + tapeRes + '")';

    renderD2FTape(rawDec, tapeWhole, tapeRem, tapeRes);

    deriv.push('5. Mixed Number: ' + (whole > 0 ? (whole + ' ' + rem + '/' + redDen) : (rem + '/' + redDen)) + ' &bull; Decimal Check: ' + (redNum / redDen).toFixed(6));
    document.getElementById('d2f-derivations').innerHTML = deriv.join('<br>');
  }

  function renderD2FTape(val, whole, rem, res) {
    var c = document.getElementById('d2f-svg-container');
    if (!c) return;

    var w = c.clientWidth || 600;
    var h = 65;
    var pad = 30;
    var rulerW = w - (pad * 2);

    // Render an authentic 1-inch ruler span around the fraction
    var fracPart = Math.abs(val) % 1;
    var markerX = pad + (fracPart * rulerW);

    var svg = '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" style="display:block;">';

    // Yellow tape body
    svg += '<rect x="' + pad + '" y="10" width="' + rulerW + '" height="36" rx="2" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />';

    // Ruler ticks for 16ths
    for (var i = 0; i <= 16; i++) {
      var tx = pad + (i / 16) * rulerW;
      var tickH = 10;
      if (i % 8 === 0) tickH = 24;
      else if (i % 4 === 0) tickH = 18;
      else if (i % 2 === 0) tickH = 14;

      svg += '<line x1="' + tx + '" y1="10" x2="' + tx + '" y2="' + (10 + tickH) + '" stroke="#1e293b" stroke-width="' + (i % 4 === 0 ? 1.5 : 1) + '" />';

      if (i === 0) {
        svg += '<text x="' + tx + '" y="42" fill="#1e293b" font-family="var(--mono)" font-size="10" text-anchor="start">0"</text>';
      } else if (i === 8) {
        svg += '<text x="' + tx + '" y="42" fill="#1e293b" font-family="var(--mono)" font-size="9" text-anchor="middle">1/2"</text>';
      } else if (i === 16) {
        svg += '<text x="' + tx + '" y="42" fill="#1e293b" font-family="var(--mono)" font-size="10" text-anchor="end">1"</text>';
      }
    }

    // Hairline marker for input value
    svg += '<line x1="' + markerX + '" y1="4" x2="' + markerX + '" y2="48" stroke="#ef4444" stroke-width="2.5" />';
    svg += '<polygon points="' + (markerX - 4) + ',4 ' + (markerX + 4) + ',4 ' + markerX + ',10" fill="#ef4444" />';
    svg += '<text x="' + markerX + '" y="60" fill="#ef4444" font-family="var(--mono)" font-size="11" font-weight="bold" text-anchor="middle">' + fracPart.toFixed(3) + '"</text>';

    svg += '</svg>';
    c.innerHTML = svg;
  }

  function copyD2FReport(btn) {
    var mixed = document.getElementById('card-d2f-mixed').textContent;
    var improper = document.getElementById('card-d2f-improper').textContent;
    var tape = document.getElementById('card-d2f-tape').textContent + ' (' + document.getElementById('card-d2f-tape-delta').textContent + ')';
    var mm = document.getElementById('card-d2f-mm').textContent;
    var val = (curD2FMode === 'term') ? document.getElementById('d2f-val').value : (document.getElementById('d2f-rep-non').value + '(' + document.getElementById('d2f-rep-cycle').value + ')');

    var lines = [
      '========================================',
      '      DECIMAL TO FRACTION CONVERSION',
      '========================================',
      'Decimal Input       : ' + val,
      'Simplified Fraction : ' + mixed,
      'Improper Equivalent : ' + improper,
      'Tape Measure Snap   : ' + tape,
      'Metric Conversion   : ' + mm,
      '========================================',
      'Source: Digital Tools Shed (https://digitaltoolsshed.com/math/decimal-to-fraction.html)'
    ];

    navigator.clipboard.writeText(lines.join('\n')).then(function() {
      var orig = btn.innerHTML;
      btn.innerHTML = '✅ Copied Fraction Takeoff!';
      btn.style.borderColor = '#10b981';
      setTimeout(function() {
        btn.innerHTML = orig;
        btn.style.borderColor = '';
      }, 2000);
    });
  }

  window.addEventListener('resize', calcD2F);
  document.addEventListener('DOMContentLoaded', calcD2F);
  calcD2F();
</script>
`
  },
      {
    slug: "fraction-calculator",
    title: "Fraction Calculator (Add, Subtract, Multiply, Divide & Mixed Numbers)",
    metaDesc: "Add, subtract, multiply, and divide fractions and mixed numbers. Instant step-by-step solutions with Least Common Denominator (LCD), Euclidean GCD reduction, and pure SVG visual fraction comparison bars.",
    category: "Math & Units",
    faq: [
        {
            "q": "How do you add or subtract fractions with different denominators?",
            "a": "To add or subtract fractions with unlike denominators, find the Least Common Denominator (LCD), which is the Least Common Multiple (LCM) of the two denominators. Convert each fraction to an equivalent fraction with the LCD as its denominator by multiplying both numerator and denominator by the required scaling factor. Then, add or subtract the numerators while keeping the common denominator unchanged, and simplify the final fraction to lowest terms using the Greatest Common Divisor (GCD)."
        },
        {
            "q": "What is the Keep-Change-Flip rule for dividing fractions?",
            "a": "To divide any two fractions (A/B ÷ C/D): 1) Keep the first fraction (A/B) exactly as it is; 2) Change the division operator (÷) into multiplication (×); 3) Flip the second fraction upside down to create its reciprocal (D/C). Then multiply the numerators straight across and the denominators straight across: (A × D) / (B × C), and reduce to lowest terms."
        },
        {
            "q": "What is the difference between a proper fraction, improper fraction, and mixed number?",
            "a": "A proper fraction has a numerator smaller than its denominator (e.g., 3/4), representing a value between 0 and 1. An improper fraction has a numerator greater than or equal to its denominator (e.g., 11/4), representing a value equal to or greater than 1. A mixed number combines a non-zero integer with a proper fraction (e.g., 2 3/4), which is mathematically identical to 11/4."
        },
        {
            "q": "How does the Euclidean algorithm find the Greatest Common Divisor (GCD) for fraction simplification?",
            "a": "The Euclidean algorithm is an ancient, highly efficient algorithm based on the principle that the GCD of two numbers also divides their remainder: GCD(A, B) = GCD(B, A mod B). By repeatedly taking remainders until the remainder reaches 0, the final non-zero divisor is the exact GCD. Dividing both the numerator and denominator by this GCD guarantees that the fraction is reduced to its simplest, coprime lowest terms."
        },
        {
            "q": "How do you convert decimal values to carpentry tape measure fractions (1/16, 1/32, 1/64)?",
            "a": "To find the nearest tape measure fraction on standard Imperial rulers, multiply the decimal fraction by the desired ruler resolution (e.g., 16 for 1/16\", 32 for 1/32\", or 64 for 1/64\"), round to the nearest whole integer, and simplify the resulting fraction. For example, 0.6875 × 16 = 11, giving exactly 11/16\". For 0.70\", 0.70 × 16 = 11.2 ≈ 11/16\" with a minor measurement tolerance deviation of +0.0125\"."
        }
    ],
    body: `
<div class="article-container" style="max-width:1050px;margin:0 auto;padding:1.5rem 1rem;">
  <nav style="font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);">
    <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Fraction Calculator
  </nav>

  <header style="margin-bottom:2rem;text-align:center;">
    <h1 style="font-family:var(--serif);font-size:2.2rem;margin-bottom:0.5rem;letter-spacing:-0.02em;">Fraction &amp; Mixed Number Calculator</h1>
    <p style="color:var(--text-muted);font-size:1.05rem;max-width:750px;margin:0 auto;line-height:1.6;">
      Add, subtract, multiply, and divide fractions and mixed numbers. Get step-by-step Least Common Denominator (LCD) solutions, tape measure equivalents, and visual SVG fraction bars.
    </p>
  </header>

  <style>
    .frac-box { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:1.75rem; margin-bottom:2rem; }
    .frac-entry-row { display:flex; align-items:center; justify-content:center; gap:1.25rem; margin-bottom:1.5rem; flex-wrap:wrap; }
    .frac-unit { display:inline-flex; align-items:center; gap:0.5rem; background:var(--surface-alt); padding:1rem; border-radius:8px; border:1px solid var(--border); }
    .frac-stacked { display:inline-flex; flex-direction:column; align-items:center; width:65px; }
    .frac-input { width:60px; text-align:center; padding:0.45rem; background:var(--surface); border:1px solid var(--border); border-radius:4px; color:var(--fg); font-family:var(--mono); font-size:1.15rem; font-weight:bold; }
    .frac-bar { width:100%; height:2px; background:var(--fg); margin:3px 0; }
    .frac-op-select { padding:0.6rem 0.8rem; background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; color:var(--fg); font-family:var(--mono); font-size:1.4rem; font-weight:bold; cursor:pointer; }
    .frac-grid-4 { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1.5rem; }
    .frac-card { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; text-align:center; position:relative; }
    .frac-badge { position:absolute; top:8px; right:8px; font-family:var(--mono); font-size:0.65rem; padding:2px 6px; border-radius:4px; }
    .frac-trap-card { background:var(--surface-alt); border-left:4px solid #ef4444; border-radius:0 6px 6px 0; padding:1rem 1.25rem; margin-bottom:1rem; }
    .frac-trap-title { font-family:var(--serif); font-weight:600; font-size:1.05rem; color:var(--fg); margin-bottom:0.25rem; }
    .frac-trap-desc { font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin:0; }
    .frac-svg-box { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; margin-top:1.5rem; }
  </style>

  <div class="frac-box">
    <!-- Equation Entry Container -->
    <div class="frac-entry-row">
      <!-- Fraction 1 -->
      <div class="frac-unit">
        <div>
          <label style="display:block;font-family:var(--mono);font-size:0.65rem;color:var(--text-muted);text-align:center;margin-bottom:2px;">Whole</label>
          <input type="number" id="f1-w" value="1" min="0" step="1" oninput="calcFrac()" class="frac-input" placeholder="0">
        </div>
        <div class="frac-stacked">
          <label style="display:block;font-family:var(--mono);font-size:0.65rem;color:var(--text-muted);text-align:center;margin-bottom:2px;">Num</label>
          <input type="number" id="f1-n" value="1" min="0" step="1" oninput="calcFrac()" class="frac-input">
          <div class="frac-bar"></div>
          <input type="number" id="f1-d" value="2" min="1" step="1" oninput="calcFrac()" class="frac-input">
          <label style="display:block;font-family:var(--mono);font-size:0.65rem;color:var(--text-muted);text-align:center;margin-top:2px;">Den</label>
        </div>
      </div>

      <!-- Operator -->
      <div>
        <select id="frac-op" onchange="calcFrac()" class="frac-op-select">
          <option value="add" selected>+</option>
          <option value="sub">&minus;</option>
          <option value="mul">&times;</option>
          <option value="div">&divide;</option>
        </select>
      </div>

      <!-- Fraction 2 -->
      <div class="frac-unit">
        <div>
          <label style="display:block;font-family:var(--mono);font-size:0.65rem;color:var(--text-muted);text-align:center;margin-bottom:2px;">Whole</label>
          <input type="number" id="f2-w" value="0" min="0" step="1" oninput="calcFrac()" class="frac-input" placeholder="0">
        </div>
        <div class="frac-stacked">
          <label style="display:block;font-family:var(--mono);font-size:0.65rem;color:var(--text-muted);text-align:center;margin-bottom:2px;">Num</label>
          <input type="number" id="f2-n" value="3" min="0" step="1" oninput="calcFrac()" class="frac-input">
          <div class="frac-bar"></div>
          <input type="number" id="f2-d" value="4" min="1" step="1" oninput="calcFrac()" class="frac-input">
          <label style="display:block;font-family:var(--mono);font-size:0.65rem;color:var(--text-muted);text-align:center;margin-top:2px;">Den</label>
        </div>
      </div>
    </div>

    <!-- Quick Presets -->
    <div style="margin-bottom:1.5rem;display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;justify-content:center;">
      <span style="font-family:var(--mono);font-size:0.75rem;color:var(--text-muted);margin-right:0.25rem;">Quick Scenarios:</span>
      <button type="button" class="btn-sec" onclick="setFracPreset(0,1,2, 'add', 0,3,4)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">1/2 + 3/4</button>
      <button type="button" class="btn-sec" onclick="setFracPreset(2,3,8, 'sub', 1,5,16)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">2 3/8 &minus; 1 5/16 (Carpentry)</button>
      <button type="button" class="btn-sec" onclick="setFracPreset(0,5,6, 'mul', 0,2,3)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">5/6 &times; 2/3</button>
      <button type="button" class="btn-sec" onclick="setFracPreset(0,7,8, 'div', 0,1,4)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">7/8 &divide; 1/4 (Keep-Flip)</button>
    </div>

    <!-- Hero Cards -->
    <div class="frac-grid-4">
      <div class="frac-card" style="border-top:4px solid #10b981;">
        <span class="frac-badge" style="background:rgba(16,185,129,0.15);color:#10b981;">Simplified</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Mixed / Final Result</div>
        <div id="card-frac-mixed" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:#10b981;">2 1/4</div>
        <div id="card-frac-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Reduced to lowest terms</div>
      </div>

      <div class="frac-card" style="border-top:4px solid #3b82f6;">
        <span class="frac-badge" style="background:rgba(59,130,246,0.15);color:#3b82f6;">Improper</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Improper Fraction</div>
        <div id="card-frac-improper" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:#3b82f6;">9/4</div>
        <div style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Single numerator / denominator</div>
      </div>

      <div class="frac-card" style="border-top:4px solid #8b5cf6;">
        <span class="frac-badge" style="background:rgba(139,92,246,0.15);color:#8b5cf6;">Decimal</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Decimal Equivalent</div>
        <div id="card-frac-dec" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:var(--fg);">2.2500</div>
        <div id="card-frac-pct" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">225.0% of whole</div>
      </div>

      <div class="frac-card" style="border-top:4px solid #f59e0b;">
        <span class="frac-badge" style="background:rgba(245,158,11,0.15);color:#f59e0b;">Carpentry</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Tape Measure (1/16")</div>
        <div id="card-frac-tape" style="font-family:var(--mono);font-size:1.85rem;font-weight:bold;color:#f59e0b;">2 1/4"</div>
        <div id="card-frac-tape-32" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Exact: 2 8/32"</div>
      </div>
    </div>

    <!-- Pure SVG Fraction Comparison Visualizer -->
    <div class="frac-svg-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;">
        <span style="font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">Visual Fraction Magnitude Comparison Bars</span>
        <span style="font-family:var(--mono);font-size:0.78rem;color:var(--text-muted);">Proportional Value Scale</span>
      </div>
      <div id="frac-svg-container" style="width:100%;height:100px;"></div>
      <div style="display:flex;gap:1.5rem;margin-top:0.75rem;font-family:var(--mono);font-size:0.75rem;color:var(--text-muted);flex-wrap:wrap;">
        <span style="display:inline-flex;align-items:center;gap:0.4rem;"><span style="width:10px;height:10px;background:#3b82f6;border-radius:2px;"></span> Fraction 1</span>
        <span style="display:inline-flex;align-items:center;gap:0.4rem;"><span style="width:10px;height:10px;background:#8b5cf6;border-radius:2px;"></span> Fraction 2</span>
        <span style="display:inline-flex;align-items:center;gap:0.4rem;"><span style="width:10px;height:10px;background:#10b981;border-radius:2px;"></span> Result Output</span>
      </div>
    </div>

    <!-- Live Step-by-Step Derivations -->
    <div style="margin-top:1.5rem;background:var(--surface-alt);border-left:3px solid #10b981;padding:1.1rem 1.25rem;border-radius:0 6px 6px 0;font-size:0.88rem;line-height:1.6;">
      <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Live Step-by-Step Mathematical Derivation:</div>
      <div id="frac-derivations" style="font-family:var(--mono);color:var(--fg);"></div>
    </div>

    <!-- One-Click Copy Button -->
    <div style="margin-top:1.5rem;display:flex;justify-content:flex-end;">
      <button type="button" class="btn-sec" onclick="copyFracReport(this)" style="font-family:var(--mono);font-size:0.85rem;padding:0.6rem 1.25rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;cursor:pointer;color:var(--fg);">
        📋 Copy Fraction Solution Report
      </button>
    </div>
  </div>

  <!-- Real-World Traps Section -->
  <div style="margin-bottom:2.5rem;">
    <h2 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:1rem;letter-spacing:-0.01em;">5 Fatal Traps &amp; Gotchas in Fraction Math</h2>

    <div class="frac-trap-card">
      <div class="frac-trap-title">1. The "Numerator &amp; Denominator Addition" Fallacy</div>
      <p class="frac-trap-desc">
        The most notorious arithmetic fallacy is adding numerators and denominators straight across: <code>1/2 + 1/3 = 2/5</code>. In reality, 1/2 (0.50) plus 1/3 (0.333) equals 5/6 (0.833). Adding denominators changes the fractional unit size rather than accumulating equal quantities. You must normalize denominators to the Least Common Denominator (LCD) before adding.
      </p>
    </div>

    <div class="frac-trap-card">
      <div class="frac-trap-title">2. Dividing Mixed Numbers Without Converting to Improper Fractions</div>
      <p class="frac-trap-desc">
        When dividing mixed numbers such as <code>4 1/2 &divide; 1 1/2</code>, novice students frequently divide the whole numbers (4 &divide; 1 = 4) and then divide the fractions (1/2 &divide; 1/2 = 1) to get an incorrect answer of 5. You must convert both operands into improper fractions first: <code>9/2 &divide; 3/2 = (9/2) &times; (2/3) = 18/6 = 3</code>.
      </p>
    </div>

    <div class="frac-trap-card">
      <div class="frac-trap-title">3. The Cross-Multiplication Overuse Confusion</div>
      <p class="frac-trap-desc">
        Cross-multiplication is a valid mathematical technique <em>only</em> for solving proportional equations (<code>A/B = C/D &rarr; A &times; D = B &times; C</code>) or testing inequality magnitudes. Using cross-multiplication when multiplying two fractions (e.g., cross-multiplying <code>2/3 &times; 4/5</code>) results in complete mathematical chaos; fraction multiplication requires multiplying straight across: <code>(2 &times; 4) / (3 &times; 5) = 8/15</code>.
      </p>
    </div>

    <div class="frac-trap-card">
      <div class="frac-trap-title">4. Negative Sign Distribution in Subtracted Fractions</div>
      <p class="frac-trap-desc">
        When subtracting an algebraic fraction with a compound numerator, such as <code>(X - 3) / 4</code>, the subtraction applies to the entire numerator. Neglecting to distribute the negative sign yields <code>-X - 3</code> instead of the mathematically correct <code>-X + 3</code>. Similarly, a negative fraction <code>-3/4</code> means either <code>(-3)/4</code> or <code>3/(-4)</code>, but not <code>(-3)/(-4)</code> which is positive <code>+3/4</code>.
      </p>
    </div>

    <div class="frac-trap-card">
      <div class="frac-trap-title">5. Tape Measure Imperial Conversion Rounding Tolerance</div>
      <p class="frac-trap-desc">
        Carpenters frequently convert engineering decimal specs (e.g., 0.350 inches) to ruler ticks. Rounding 0.350" directly to 3/8" (0.375") introduces a +0.025" (+25 thousandths of an inch) error. In precision joinery, cabinetry, and CNC milling, this exceeds allowable tolerance limits. Always verify the deviation delta between the exact decimal and the nearest 1/16" or 1/32" tick.
      </p>
    </div>
  </div>
</div>

<script>
  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      var t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
  }

  function setFracPreset(w1, n1, d1, op, w2, n2, d2) {
    document.getElementById('f1-w').value = w1;
    document.getElementById('f1-n').value = n1;
    document.getElementById('f1-d').value = d1;
    document.getElementById('frac-op').value = op;
    document.getElementById('f2-w').value = w2;
    document.getElementById('f2-n').value = n2;
    document.getElementById('f2-d').value = d2;
    calcFrac();
  }

  function calcFrac() {
    var w1 = parseInt(document.getElementById('f1-w').value, 10) || 0;
    var n1 = parseInt(document.getElementById('f1-n').value, 10) || 0;
    var d1 = parseInt(document.getElementById('f1-d').value, 10) || 1;

    var op = document.getElementById('frac-op').value;

    var w2 = parseInt(document.getElementById('f2-w').value, 10) || 0;
    var n2 = parseInt(document.getElementById('f2-n').value, 10) || 0;
    var d2 = parseInt(document.getElementById('f2-d').value, 10) || 1;

    if (d1 === 0) d1 = 1;
    if (d2 === 0) d2 = 1;

    // Convert to improper
    var imp1 = (w1 * d1) + n1;
    var imp2 = (w2 * d2) + n2;

    var resNum = 0;
    var resDen = 1;
    var steps = [];

    steps.push('1. Convert Mixed to Improper: Fraction 1 = (' + w1 + ' &times; ' + d1 + ' + ' + n1 + ')/' + d1 + ' = <strong>' + imp1 + '/' + d1 + '</strong> &bull; Fraction 2 = (' + w2 + ' &times; ' + d2 + ' + ' + n2 + ')/' + d2 + ' = <strong>' + imp2 + '/' + d2 + '</strong>');

    if (op === 'add') {
      var commonDen = lcm(d1, d2);
      var scale1 = commonDen / d1;
      var scale2 = commonDen / d2;
      var adjNum1 = imp1 * scale1;
      var adjNum2 = imp2 * scale2;
      resNum = adjNum1 + adjNum2;
      resDen = commonDen;
      steps.push('2. Least Common Denominator (LCD): LCM(' + d1 + ', ' + d2 + ') = <strong>' + commonDen + '</strong>');
      steps.push('3. Scale Numerators: (' + imp1 + ' &times; ' + scale1 + ') + (' + imp2 + ' &times; ' + scale2 + ') = ' + adjNum1 + ' + ' + adjNum2 + ' = <strong>' + resNum + '/' + resDen + '</strong>');
    } else if (op === 'sub') {
      var commonDen = lcm(d1, d2);
      var scale1 = commonDen / d1;
      var scale2 = commonDen / d2;
      var adjNum1 = imp1 * scale1;
      var adjNum2 = imp2 * scale2;
      resNum = adjNum1 - adjNum2;
      resDen = commonDen;
      steps.push('2. Least Common Denominator (LCD): LCM(' + d1 + ', ' + d2 + ') = <strong>' + commonDen + '</strong>');
      steps.push('3. Scale & Subtract: (' + imp1 + ' &times; ' + scale1 + ') - (' + imp2 + ' &times; ' + scale2 + ') = ' + adjNum1 + ' - ' + adjNum2 + ' = <strong>' + resNum + '/' + resDen + '</strong>');
    } else if (op === 'mul') {
      resNum = imp1 * imp2;
      resDen = d1 * d2;
      steps.push('2. Multiply Straight Across: (' + imp1 + ' &times; ' + imp2 + ') &divide; (' + d1 + ' &times; ' + d2 + ') = <strong>' + resNum + '/' + resDen + '</strong>');
    } else if (op === 'div') {
      if (imp2 === 0) {
        document.getElementById('card-frac-mixed').textContent = 'Undefined';
        document.getElementById('card-frac-improper').textContent = 'Div by 0';
        return;
      }
      resNum = imp1 * d2;
      resDen = d1 * imp2;
      steps.push('2. Keep-Change-Flip: (' + imp1 + '/' + d1 + ') &times; (' + d2 + '/' + imp2 + ') = (' + imp1 + ' &times; ' + d2 + ') &divide; (' + d1 + ' &times; ' + imp2 + ') = <strong>' + resNum + '/' + resDen + '</strong>');
    }

    // Simplification via GCD
    var div = gcd(resNum, resDen);
    var simpNum = resNum / div;
    var simpDen = resDen / div;

    if (simpDen < 0) {
      simpNum = -simpNum;
      simpDen = -simpDen;
    }

    // Mixed number format
    var wholePart = Math.floor(Math.abs(simpNum) / simpDen);
    var remNum = Math.abs(simpNum) % simpDen;
    var isNeg = (simpNum < 0);

    var mixedStr = '';
    if (simpDen === 1) {
      mixedStr = (isNeg ? '-' : '') + Math.abs(simpNum);
    } else if (wholePart === 0) {
      mixedStr = (isNeg ? '-' : '') + remNum + '/' + simpDen;
    } else {
      mixedStr = (isNeg ? '-' : '') + wholePart + ' ' + remNum + '/' + simpDen;
    }

    var decVal = simpNum / simpDen;

    // Display Hero cards
    document.getElementById('card-frac-mixed').textContent = mixedStr;
    document.getElementById('card-frac-sub').textContent = 'GCD reduction: &divide; ' + div;

    document.getElementById('card-frac-improper').textContent = simpNum + '/' + simpDen;
    document.getElementById('card-frac-dec').textContent = decVal.toFixed(4);
    document.getElementById('card-frac-pct').textContent = (decVal * 100).toFixed(1) + '% of whole';

    // Tape measure nearest 1/16"
    var tape16 = Math.round(decVal * 16);
    var tapeWhole = Math.floor(tape16 / 16);
    var tapeRem16 = tape16 % 16;
    var tapeDiv16 = gcd(tapeRem16, 16);
    var tapeStr = tapeWhole > 0 ? (tapeWhole + (tapeRem16 > 0 ? (' ' + (tapeRem16 / tapeDiv16) + '/' + (16 / tapeDiv16)) : '') + '"') : ((tapeRem16 / tapeDiv16) + '/' + (16 / tapeDiv16) + '"');
    document.getElementById('card-frac-tape').textContent = tapeStr;

    var tape32 = Math.round(decVal * 32);
    var tapeWhole32 = Math.floor(tape32 / 32);
    var tapeRem32 = tape32 % 32;
    var tapeDiv32 = gcd(tapeRem32, 32);
    var tapeStr32 = tapeWhole32 > 0 ? (tapeWhole32 + (tapeRem32 > 0 ? (' ' + (tapeRem32 / tapeDiv32) + '/' + (32 / tapeDiv32)) : '') + '"') : ((tapeRem32 / tapeDiv32) + '/' + (32 / tapeDiv32) + '"');
    document.getElementById('card-frac-tape-32').textContent = 'Nearest 1/32": ' + tapeStr32;

    steps.push('3. Reduce to Lowest Terms: GCD(' + resNum + ', ' + resDen + ') = ' + div + ' &rarr; <strong>' + simpNum + '/' + simpDen + '</strong>');
    if (simpDen !== 1 && wholePart > 0) {
      steps.push('4. Mixed Number Conversion: ' + Math.abs(simpNum) + ' &divide; ' + simpDen + ' = ' + wholePart + ' with remainder ' + remNum + ' &rarr; <strong>' + mixedStr + '</strong>');
    }
    steps.push('5. Decimal Equivalent: ' + simpNum + ' &divide; ' + simpDen + ' = <strong>' + decVal.toFixed(6) + '</strong>');

    document.getElementById('frac-derivations').innerHTML = steps.join('<br>');

    renderFracVisual(imp1 / d1, imp2 / d2, decVal);
  }

  function renderFracVisual(v1, v2, vRes) {
    var c = document.getElementById('frac-svg-container');
    if (!c) return;

    var w = c.clientWidth || 600;
    var h = 95;
    var maxVal = Math.max(1, v1, v2, Math.abs(vRes));

    var barH = 16;
    var y1 = 10, y2 = 38, y3 = 66;

    function getBarW(v) {
      return Math.max(2, Math.min(w - 120, (Math.abs(v) / maxVal) * (w - 120)));
    }

    var svg = '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" style="display:block;">';

    // Fraction 1 Bar
    svg += '<text x="0" y="' + (y1 + 12) + '" fill="var(--text-muted)" font-family="var(--mono)" font-size="11">Fraction 1:</text>';
    svg += '<rect x="90" y="' + y1 + '" width="' + (w - 100) + '" height="' + barH + '" rx="3" fill="#334155" />';
    svg += '<rect x="90" y="' + y1 + '" width="' + getBarW(v1) + '" height="' + barH + '" rx="3" fill="#3b82f6" />';
    svg += '<text x="' + (95 + getBarW(v1)) + '" y="' + (y1 + 12) + '" fill="#3b82f6" font-family="var(--mono)" font-size="11">' + v1.toFixed(3) + '</text>';

    // Fraction 2 Bar
    svg += '<text x="0" y="' + (y2 + 12) + '" fill="var(--text-muted)" font-family="var(--mono)" font-size="11">Fraction 2:</text>';
    svg += '<rect x="90" y="' + y2 + '" width="' + (w - 100) + '" height="' + barH + '" rx="3" fill="#334155" />';
    svg += '<rect x="90" y="' + y2 + '" width="' + getBarW(v2) + '" height="' + barH + '" rx="3" fill="#8b5cf6" />';
    svg += '<text x="' + (95 + getBarW(v2)) + '" y="' + (y2 + 12) + '" fill="#8b5cf6" font-family="var(--mono)" font-size="11">' + v2.toFixed(3) + '</text>';

    // Result Bar
    svg += '<text x="0" y="' + (y3 + 12) + '" fill="var(--text-muted)" font-family="var(--mono)" font-size="11">Result:</text>';
    svg += '<rect x="90" y="' + y3 + '" width="' + (w - 100) + '" height="' + barH + '" rx="3" fill="#334155" />';
    svg += '<rect x="90" y="' + y3 + '" width="' + getBarW(vRes) + '" height="' + barH + '" rx="3" fill="#10b981" />';
    svg += '<text x="' + (95 + getBarW(vRes)) + '" y="' + (y3 + 12) + '" fill="#10b981" font-family="var(--mono)" font-size="11" font-weight="bold">' + vRes.toFixed(3) + '</text>';

    svg += '</svg>';
    c.innerHTML = svg;
  }

  function copyFracReport(btn) {
    var mixed = document.getElementById('card-frac-mixed').textContent;
    var improper = document.getElementById('card-frac-improper').textContent;
    var dec = document.getElementById('card-frac-dec').textContent;
    var tape = document.getElementById('card-frac-tape').textContent;
    var op = document.getElementById('frac-op').value;

    var lines = [
      '========================================',
      '       FRACTION ARITHMETIC SOLUTION',
      '========================================',
      'Operation Performed : ' + op.toUpperCase(),
      'Simplified Result   : ' + mixed,
      'Improper Equivalent : ' + improper,
      'Decimal Equivalent  : ' + dec,
      'Tape Measure (1/16"): ' + tape,
      '========================================',
      'Source: Digital Tools Shed (https://digitaltoolsshed.com/math/fraction-calculator.html)'
    ];

    navigator.clipboard.writeText(lines.join('\n')).then(function() {
      var orig = btn.innerHTML;
      btn.innerHTML = '✅ Copied Fraction Solution!';
      btn.style.borderColor = '#10b981';
      setTimeout(function() {
        btn.innerHTML = orig;
        btn.style.borderColor = '';
      }, 2000);
    });
  }

  window.addEventListener('resize', calcFrac);
  document.addEventListener('DOMContentLoaded', calcFrac);
  calcFrac();
</script>
`
  },
    {
  "slug": "aspect-ratio-calculator",
  "title": "Aspect Ratio Calculator — 16:9, 9:16, 4K Resizing & Video Scales",
  "metaDesc": "Free online aspect ratio calculator. Calculate pixel dimensions, reduce to simplified ratios via Euclidean GCD, preview letterboxing, and resize video formats (16:9, 9:16, 4:3, 21:9).",
  "category": "Math & Finance",
  "faq": [
    {
      "q": "How do you calculate the aspect ratio from width and height?",
      "a": "To calculate aspect ratio, find the Greatest Common Divisor (GCD) of the width and height using Euclid's algorithm, then divide both numbers by the GCD. For example, for 1920 × 1080, the GCD is 120. 1920 / 120 = 16, and 1080 / 120 = 9, yielding an exact 16:9 aspect ratio."
    },
    {
      "q": "What is the standard aspect ratio for social media platforms in 2025/2026?",
      "a": "YouTube long-form video uses 16:9 ($1920 \\times 1080$). Vertical video for TikTok, YouTube Shorts, and Instagram Reels uses 9:16 ($1080 \\times 1920$). Instagram in-feed portrait posts use 4:5 ($1080 \\times 1350$), and standard profile/carousel posts use 1:1 square ($1080 \\times 1080$)."
    },
    {
      "q": "Why must video dimensions be divisible by 2 or 16?",
      "a": "Video compression codecs such as H.264 (AVC) and H.265 (HEVC) divide frames into $16 \\times 16$ pixel macroblocks or coding tree units. Dimensions that are not divisible by 2 cause sub-pixel interpolation errors or render-time failures, while dimensions divisible by 16 compress with maximum hardware encoder efficiency."
    },
    {
      "q": "What is the difference between 16:9 and 21:9 aspect ratios?",
      "a": "16:9 (1.78:1) is the universal widescreen standard for televisions, laptops, and YouTube. 21:9 (approximately 2.39:1 to 2.37:1) is an ultra-widescreen format matching theatrical CinemaScope movies. On a standard 16:9 monitor, 21:9 movies display horizontal black bars (letterboxing) above and below."
    },
    {
      "q": "How do I resize an image while keeping the exact same aspect ratio?",
      "a": "To resize an image without distortion, use cross-multiplication: New Height = (Original Height × New Width) / Original Width, or New Width = (Original Width × New Height) / Original Height. This ensures pixels scale evenly along both axes."
    }
  ],
  "body": "\n<div class=\"article-container\" style=\"max-width:1050px;margin:0 auto;padding:1.5rem 1rem;\">\n  <nav style=\"font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);\">\n    <a href=\"/\">Home</a> &gt; <a href=\"/math/\">Math &amp; Finance</a> &gt; Aspect Ratio Calculator\n  </nav>\n\n  <header style=\"margin-bottom:2rem;text-align:center;\">\n    <h1 style=\"font-family:var(--serif);font-size:2.2rem;margin-bottom:0.5rem;letter-spacing:-0.02em;\">Aspect Ratio &amp; Resolution Workbench</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;max-width:780px;margin:0 auto;line-height:1.6;\">\n      Calculate proportional dimensions, simplify exact ratios using Euclidean GCD algorithms, resize digital video, and optimize canvas resolutions for YouTube, TikTok, Instagram, and widescreen cinema.\n    </p>\n  </header>\n\n  <div style=\"display:grid;grid-template-columns:1fr;gap:2rem;margin-bottom:2.5rem;\" class=\"calc-grid\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"2\" y=\"3\" width=\"20\" height=\"14\" rx=\"2\"/><line x1=\"8\" y1=\"21\" x2=\"16\" y2=\"21\"/><line x1=\"12\" y1=\"17\" x2=\"12\" y2=\"21\"/></svg>\n        Original Dimensions &amp; Target Resize\n      </h2>\n\n      <!-- ORIGINAL WIDTH & HEIGHT -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"origWidth\">Original Width (W₁ px)</label>\n          <input type=\"number\" id=\"origWidth\" value=\"1920\" min=\"1\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.15rem;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"origHeight\">Original Height (H₁ px)</label>\n          <input type=\"number\" id=\"origHeight\" value=\"1080\" min=\"1\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.15rem;\">\n        </div>\n      </div>\n\n      <!-- STANDARD RATIO PRESETS -->\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"standardPresetSelect\">Quick Format &amp; Social Presets</label>\n        <select id=\"standardPresetSelect\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n          <option value=\"1920|1080\" selected>16:9 Widescreen (YouTube, 1080p Full HD)</option>\n          <option value=\"3840|2160\">16:9 4K Ultra HD (3840 × 2160)</option>\n          <option value=\"1080|1920\">9:16 Vertical Video (TikTok, Shorts, Reels)</option>\n          <option value=\"1080|1350\">4:5 Portrait (Instagram Feed Post)</option>\n          <option value=\"1080|1080\">1:1 Square (Instagram Grid, Profile)</option>\n          <option value=\"1440|1080\">4:3 Standard (Classic TV, iPad Native)</option>\n          <option value=\"3440|1440\">21:9 Ultra-Wide (Ultrawide Gaming)</option>\n          <option value=\"2048|858\">2.39:1 Anamorphic (CinemaScope Theatrical)</option>\n        </select>\n      </div>\n\n      <!-- RESIZING CALCULATOR: NEW WIDTH OR HEIGHT -->\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n        <span style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);display:block;text-transform:uppercase;margin-bottom:0.75rem;\">Scale to New Dimensions</span>\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;\">\n          <div>\n            <label style=\"display:block;font-weight:600;font-size:0.8rem;margin-bottom:0.35rem;\" for=\"targetWidth\">New Width (W₂ px)</label>\n            <input type=\"number\" id=\"targetWidth\" value=\"1280\" min=\"1\" step=\"1\" style=\"width:100%;padding:0.55rem 0.75rem;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:var(--fg);font-family:var(--mono);font-size:1rem;\">\n          </div>\n          <div>\n            <label style=\"display:block;font-weight:600;font-size:0.8rem;margin-bottom:0.35rem;\" for=\"targetHeight\">New Height (H₂ px)</label>\n            <input type=\"number\" id=\"targetHeight\" value=\"720\" min=\"1\" step=\"1\" style=\"width:100%;padding:0.55rem 0.75rem;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:var(--fg);font-family:var(--mono);font-size:1rem;\">\n          </div>\n        </div>\n        <span style=\"font-size:0.72rem;color:var(--text-muted);display:block;margin-top:0.5rem;\">Editing either box automatically recalculates the other to preserve the exact aspect ratio.</span>\n      </div>\n    </div>\n\n    <!-- SUMMARY & OUTPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M15 3h6v6\"/><path d=\"M9 21H3v-6\"/><path d=\"M21 3l-7 7\"/><path d=\"M3 21l7-7\"/></svg>\n            Aspect Ratio &amp; Pixel Ratios\n          </h2>\n          <button id=\"copyAspectBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Specs</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Simplified Aspect Ratio</span>\n            <span id=\"simplifiedRatioVal\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:#3b82f6;display:block;\">16:9</span>\n            <span id=\"decimalRatioVal\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">1.78 : 1 (Decimal)</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Total Megapixels</span>\n            <span id=\"megapixelsVal\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:#10b981;display:block;\">2.07 MP</span>\n            <span id=\"totalPixelsVal\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">2,073,600 Total Pixels</span>\n          </div>\n        </div>\n\n        <!-- RESOLUTION SPECS LEDGER -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Display &amp; Codec Compatibility</div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Euclidean GCD Divisor:</span>\n            <strong id=\"gcdDivisorVal\" style=\"font-family:var(--mono);color:var(--fg);\">120</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Orientation:</span>\n            <strong id=\"orientationVal\" style=\"font-family:var(--mono);color:#3b82f6;\">Landscape (Horizontal)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Video Macroblock Alignment (Mod 16):</span>\n            <strong id=\"macroblockAlignVal\" style=\"font-family:var(--mono);color:#10b981;\">✓ Both Divisible by 16</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;\">\n            <span>Resized Resolution:</span>\n            <strong id=\"resizedSummaryVal\" style=\"font-family:var(--mono);color:var(--fg);\">1280 × 720 (0.92 MP)</strong>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG VIEWPORT CANVAS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.5rem;\">\n      <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\"/><polyline points=\"21 15 16 10 5 21\"/></svg>\n      Geometric Aspect Canvas Visualizer\n    </h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Live geometric canvas rendering the true rectangular proportions, diagonal sightline, and dimension calipers based on current input parameters.\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"aspectCanvasSvg\" viewBox=\"0 0 800 300\" style=\"width:100%;height:auto;min-width:600px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & EUCLIDEAN DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Aspect Ratio Geometry &amp; Euclidean GCD Reduction</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      An aspect ratio represents the proportional relationship between width $W$ and height $H$. To express this ratio in standard lowest integer terms (e.g. 16:9 rather than 1920:1080), the dimensions are reduced by their Greatest Common Divisor using Euclid's algorithm:\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Euclidean Algorithm for Greatest Common Divisor (GCD):</strong><br>\n      \\gcd(a, b) = \\begin{cases} a & \\text{if } b = 0 \\\\ \\gcd(b, a \\bmod b) & \\text{if } b > 0 \\end{cases}<br>\n      \\text{Example: For } 1920 \\times 1080: \\quad \\gcd(1920, 1080) = \\gcd(1080, 840) = \\gcd(840, 240) = \\gcd(240, 120) = 120.<br><br>\n      <strong>2. Simplified Integer Ratio:</strong><br>\n      R_w = \\frac{W}{\\gcd(W, H)} = \\frac{1920}{120} = 16, \\qquad R_h = \\frac{H}{\\gcd(W, H)} = \\frac{1080}{120} = 9 \\implies 16:9<br><br>\n      <strong>3. Proportional Dimension Scaling (Cross-Multiplication):</strong><br>\n      \\frac{W_1}{H_1} = \\frac{W_2}{H_2} \\implies W_2 = \\frac{W_1 \\times H_2}{H_1}, \\qquad H_2 = \\frac{H_1 \\times W_2}{W_1}<br><br>\n      <strong>4. Video Compression Macroblock Divisibility (Mod 16):</strong><br>\n      \\text{H.264 / H.265 encoding assigns pixels into } 16 \\times 16 \\text{ macroblocks.}\\<br>\n      \\text{Enforce: } W \\bmod 16 = 0 \\quad \\text{and} \\quad H \\bmod 16 = 0 \\text{ to avoid padding artifacts.}\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL ASPECT RATIO TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Video Encoding &amp; Aspect Ratio Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">1. Non-Divisible Macroblock Dimensions (Mod 2 / Mod 16)</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Video codecs (H.264, HEVC, ProRes) compress frames in blocks of $8 \\times 8$ or $16 \\times 16$ pixels. If your scaled height or width is an odd number (e.g. 721px) or not divisible by 2, video encoders will either throw a rendering error or pad the edge with an ugly 1-pixel green or black glitch bar. Always round scaled dimensions to even numbers.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">2. Pillarboxing vs Center Cropping in Vertical Video</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Converting 16:9 horizontal footage to 9:16 vertical for TikTok or Instagram Reels by center cropping cuts off 67% of the original visual canvas. Important speaker gestures, logos, and lower-third graphics disappear. Use dynamic pan-and-scan or reframe with blurred letterbox margins rather than hard center cropping.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">3. Instagram 4:5 Feed Compression vs 9:16 Story Crop</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Instagram Stories and Reels support full 9:16 vertical video ($1080 \\times 1920$). However, standard in-feed posts restrict maximum vertical aspect ratio to 4:5 ($1080 \\times 1350$). Posting a 9:16 video directly to the main profile grid forces automatic top-and-bottom cropping that amputates text captions.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">4. Storage Aspect Ratio (SAR) vs Display Aspect Ratio (DAR)</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Standard DVD and broadcast media often store video in $720 \\times 480$ pixels (a 3:2 storage ratio), but display it at 16:9 widescreen using non-square anamorphic pixels (Pixel Aspect Ratio = 1.185). Treating anamorphic footage as square pixels causes actors to look squished and circles to appear as ovals.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">5. Sub-Pixel Blur from Non-Integer Downscaling</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Arbitrarily scaling 4K video ($3840 \\times 2160$) down to custom non-standard resolutions (e.g. $1400 \\times 788$) causes bilinear interpolation algorithms to blend neighboring pixels, softening crisp text and rendering UI icons blurry. Stick to standard fractional steps (e.g. 50% scale to $1920 \\times 1080$).\n        </p>\n      </div>\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      function gcd(a, b) {\n        a = Math.abs(Math.round(a));\n        b = Math.abs(Math.round(b));\n        while (b) {\n          var t = b;\n          b = a % b;\n          a = t;\n        }\n        return a || 1;\n      }\n\n      function calcAspect(trigger) {\n        var w1 = parseFloat(document.getElementById('origWidth').value) || 1920;\n        var h1 = parseFloat(document.getElementById('origHeight').value) || 1080;\n        var w2 = parseFloat(document.getElementById('targetWidth').value) || 1280;\n        var h2 = parseFloat(document.getElementById('targetHeight').value) || 720;\n\n        // Bidirectional sync\n        if (trigger === 'w2' && w1 > 0) {\n          h2 = Math.round((h1 * w2) / w1);\n          document.getElementById('targetHeight').value = h2;\n        } else if (trigger === 'h2' && h1 > 0) {\n          w2 = Math.round((w1 * h2) / h1);\n          document.getElementById('targetWidth').value = w2;\n        } else if (trigger === 'orig' || !trigger) {\n          if (w1 > 0) {\n            h2 = Math.round((h1 * w2) / w1);\n            document.getElementById('targetHeight').value = h2;\n          }\n        }\n\n        var d = gcd(w1, h1);\n        var rW = Math.round(w1 / d);\n        var rH = Math.round(h1 / d);\n\n        var dec = (h1 !== 0) ? (w1 / h1) : 1;\n        var totalPixels = w1 * h1;\n        var mp = totalPixels / 1000000;\n\n        var orient = (w1 > h1) ? 'Landscape (Horizontal)' : ((w1 < h1) ? 'Portrait (Vertical)' : 'Square (1:1)');\n        var mod16 = (w1 % 16 === 0 && h1 % 16 === 0) ? '✓ Both Divisible by 16' : ((w1 % 2 === 0 && h1 % 2 === 0) ? '⚠ Even (Mod 2), but not Mod 16' : '❌ Odd Number Pixel Error');\n        var resSummary = w2 + ' × ' + h2 + ' (' + ((w2 * h2) / 1000000).toFixed(2) + ' MP)';\n\n        // Update DOM\n        document.getElementById('simplifiedRatioVal').textContent = rW + ':' + rH;\n        document.getElementById('decimalRatioVal').textContent = dec.toFixed(2) + ' : 1 (Decimal)';\n        document.getElementById('megapixelsVal').textContent = mp.toFixed(2) + ' MP';\n        document.getElementById('totalPixelsVal').textContent = totalPixels.toLocaleString() + ' Total Pixels';\n\n        document.getElementById('gcdDivisorVal').textContent = d;\n        document.getElementById('orientationVal').textContent = orient;\n        document.getElementById('macroblockAlignVal').textContent = mod16;\n        document.getElementById('resizedSummaryVal').textContent = resSummary;\n\n        renderCanvasSvg(w1, h1, rW, rH);\n      }\n\n      function renderCanvasSvg(w, h, rw, rh) {\n        var svg = document.getElementById('aspectCanvasSvg');\n        if (!svg) return;\n\n        var svgHtml = '';\n        var maxBoxW = 400;\n        var maxBoxH = 200;\n        var aspect = w / h;\n\n        var rectW, rectH;\n        if (aspect >= 1) {\n          rectW = maxBoxW;\n          rectH = maxBoxW / aspect;\n          if (rectH > maxBoxH) {\n            rectH = maxBoxH;\n            rectW = maxBoxH * aspect;\n          }\n        } else {\n          rectH = maxBoxH;\n          rectW = maxBoxH * aspect;\n          if (rectW > maxBoxW) {\n            rectW = maxBoxW;\n            rectH = maxBoxW / aspect;\n          }\n        }\n\n        var cx = 400;\n        var cy = 140;\n        var x0 = cx - (rectW / 2);\n        var y0 = cy - (rectH / 2);\n\n        // Surrounding container grid\n        svgHtml += '<rect x=\"60\" y=\"20\" width=\"680\" height=\"240\" fill=\"var(--bg)\" stroke=\"var(--border)\" stroke-width=\"1.5\" rx=\"6\"/>';\n\n        // Proportional Aspect Rectangle\n        svgHtml += '<rect x=\"' + x0 + '\" y=\"' + y0 + '\" width=\"' + rectW + '\" height=\"' + rectH + '\" fill=\"#3b82f6\" opacity=\"0.25\" stroke=\"#3b82f6\" stroke-width=\"2.5\" rx=\"4\"/>';\n\n        // Diagonal Line\n        svgHtml += '<line x1=\"' + x0 + '\" y1=\"' + (y0 + rectH) + '\" x2=\"' + (x0 + rectW) + '\" y2=\"' + y0 + '\" stroke=\"#3b82f6\" stroke-width=\"1.5\" stroke-dasharray=\"6,4\"/>';\n\n        // Ratio Tag in center\n        svgHtml += '<rect x=\"' + (cx - 45) + '\" y=\"' + (cy - 14) + '\" width=\"90\" height=\"28\" fill=\"var(--surface)\" stroke=\"#3b82f6\" stroke-width=\"1.5\" rx=\"4\"/>';\n        svgHtml += '<text x=\"' + cx + '\" y=\"' + (cy + 5) + '\" text-anchor=\"middle\" fill=\"#3b82f6\" font-size=\"14\" font-weight=\"bold\">' + rw + ':' + rh + '</text>';\n\n        // Dimension arrows\n        // Width top\n        svgHtml += '<line x1=\"' + x0 + '\" y1=\"' + (y0 - 10) + '\" x2=\"' + (x0 + rectW) + '\" y2=\"' + (y0 - 10) + '\" stroke=\"var(--fg)\" stroke-width=\"1.5\"/>';\n        svgHtml += '<text x=\"' + cx + '\" y=\"' + (y0 - 16) + '\" text-anchor=\"middle\" fill=\"var(--fg)\" font-size=\"11\" font-weight=\"bold\">' + w + ' px (' + rw + ')</text>';\n\n        // Height right\n        svgHtml += '<line x1=\"' + (x0 + rectW + 10) + '\" y1=\"' + y0 + '\" x2=\"' + (x0 + rectW + 10) + '\" y2=\"' + (y0 + rectH) + '\" stroke=\"var(--fg)\" stroke-width=\"1.5\"/>';\n        svgHtml += '<text x=\"' + (x0 + rectW + 16) + '\" y=\"' + (cy + 4) + '\" fill=\"var(--fg)\" font-size=\"11\" font-weight=\"bold\">' + h + ' px</text>';\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyAspectSpecs() {\n        var ratio = document.getElementById('simplifiedRatioVal').textContent;\n        var dec = document.getElementById('decimalRatioVal').textContent;\n        var mp = document.getElementById('megapixelsVal').textContent;\n        var w = document.getElementById('origWidth').value;\n        var h = document.getElementById('origHeight').value;\n        var w2 = document.getElementById('targetWidth').value;\n        var h2 = document.getElementById('targetHeight').value;\n\n        var text = '📋 Aspect Ratio & Resolution Specs\\n' +\n          '• Dimensions: ' + w + ' × ' + h + ' px (' + mp + ')\\n' +\n          '• Simplified Ratio: ' + ratio + ' (' + dec + ')\\n' +\n          '• Resized Resolution: ' + w2 + ' × ' + h2 + ' px\\n\\n' +\n          'Calculated at digitaltoolsshed.com/math/aspect-ratio-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyAspectBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Specs!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      document.getElementById('standardPresetSelect').addEventListener('change', function() {\n        var parts = this.value.split('|');\n        document.getElementById('origWidth').value = parts[0];\n        document.getElementById('origHeight').value = parts[1];\n        calcAspect('orig');\n      });\n\n      document.getElementById('origWidth').addEventListener('input', function() { calcAspect('orig'); });\n      document.getElementById('origHeight').addEventListener('input', function() { calcAspect('orig'); });\n      document.getElementById('targetWidth').addEventListener('input', function() { calcAspect('w2'); });\n      document.getElementById('targetHeight').addEventListener('input', function() { calcAspect('h2'); });\n\n      document.getElementById('copyAspectBtn').addEventListener('click', copyAspectSpecs);\n\n      calcAspect('orig');\n    })();\n  </script>\n</div>\n"
},
    {
      slug: 'scientific-notation-converter',
      title: 'Scientific Notation Converter (Standard, E-Notation & Metric Prefixes)',
      metaDesc: 'Convert between standard decimal numbers, scientific notation (a × 10^b), engineering notation, and SI metric prefixes with significant figures and step-by-step math.',
      category: 'Math & Science',
      faq: [
        { q: 'What is the difference between scientific notation and engineering notation?', a: 'In scientific notation, the coefficient (a) must be between 1 and 10 (1 <= |a| < 10) and the exponent of 10 can be any integer. In engineering notation, the exponent must be a multiple of 3 (e.g., 10^3, 10^6, 10^-9) to align directly with SI metric prefixes (kilo, mega, nano), and the coefficient is between 1 and 1,000 (1 <= |a| < 1,000).' },
        { q: 'How do you count significant figures in scientific notation?', a: 'All digits in the coefficient of a number in scientific notation are significant. For example, 4.50 × 10^6 has 3 significant figures (the trailing zero after the decimal indicates precision). In contrast, standard decimal 4,500,000 is ambiguous without notation (it could have between 2 and 7 significant figures). Scientific notation removes all ambiguity.' },
        { q: 'What does E-notation mean (e.g., 4.5e+06)?', a: 'E-notation is a shorthand computer format for scientific notation where "e" or "E" stands for "exponent of 10". For example, 4.5e+06 means 4.5 × 10^6, and 2.8e-04 means 2.8 × 10^-4. It is standard syntax in programming languages (C, Python, JavaScript), spreadsheets (Excel, Google Sheets), and handheld calculators.' },
        { q: 'How do you convert a decimal number to scientific notation manually?', a: 'First, move the decimal point until there is exactly one non-zero digit to its left. Second, count the number of places (k) you moved the decimal point. If you moved it to the left, the exponent is positive (+k). If you moved it to the right, the exponent is negative (-k). Finally, write the number as the new coefficient multiplied by 10 raised to the exponent.' },
        { q: 'What are the SI metric prefixes from nano to giga?', a: 'Common SI prefixes based on powers of 10^3 include: nano (n, 10^-9), micro (μ, 10^-6), milli (m, 10^-3), kilo (k, 10^3), mega (M, 10^6), giga (G, 10^9), and tera (T, 10^12). Engineering notation directly converts numbers to these unit prefixes.' }
      ],
      body: `
        ${commonStyle}
        <style>
          .sn-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1.25rem; }
          .sn-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.2rem; display: flex; flex-direction: column; justify-content: space-between; position: relative; transition: border-color 0.2s; }
          .sn-card:hover { border-color: var(--fg); }
          .sn-tag { font-family: var(--mono); font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 0.35rem; display: flex; justify-content: space-between; align-items: center; }
          .sn-val { font-family: var(--mono); font-size: 1.35rem; font-weight: 700; color: var(--fg); word-break: break-all; margin: 0.25rem 0; line-height: 1.3; }
          .sn-sub { font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); }
          .copy-btn-mini { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 2px 7px; font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
          .copy-btn-mini:hover { color: var(--fg); border-color: var(--fg); }
          .preset-chip { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 20px; padding: 0.3rem 0.75rem; font-size: 0.78rem; font-family: var(--mono); color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
          .preset-chip:hover { border-color: var(--fg); color: var(--fg); background: var(--surface); }
          .prefix-table { width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; margin-top: 1rem; }
          .prefix-table th, .prefix-table td { padding: 0.5rem 0.75rem; border: 1px solid var(--border); text-align: left; }
          .prefix-table th { background: var(--surface-alt); font-weight: 600; color: var(--fg); }
          .prefix-table tr:nth-child(even) td { background: rgba(0,0,0,0.02); }
          .step-box { background: var(--surface-alt); border-left: 3px solid var(--fg); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0; margin-top: 1rem; font-size: 0.9rem; line-height: 1.6; }
        </style>

        <div class="article-container" style="max-width: 960px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Scientific Notation Converter
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Scientific Notation Converter</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Convert seamlessly between standard decimal numbers, scientific notation (\(a \times 10^b\)), engineering notation (powers of 3), and SI metric prefixes with automatic significant figure counting and step-by-step algebraic derivations.
          </p>

          <div class="tool-box">
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.2rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; flex-wrap: wrap;">
              <button type="button" class="btn-sec" id="tab-single" onclick="setMode('single')" style="font-weight: 600; border-color: var(--fg);">Single Input (Decimal / Scientific / E)</button>
              <button type="button" class="btn-sec" id="tab-split" onclick="setMode('split')">Coefficient & Exponent (a × 10ᵇ)</button>
            </div>

            <!-- Single Input Mode -->
            <div id="mode-single">
              <div class="field-group">
                <label class="field-label" for="sn-in">Enter Number (Decimal, 4.5e6, 4.5 x 10^6, or -0.00028)</label>
                <input type="text" id="sn-in" class="code-input" value="4500000" oninput="calcSN()" style="font-size: 1.25rem; font-weight: bold;" placeholder="e.g. 4500000 or 6.022e23" />
              </div>
            </div>

            <!-- Split Mode -->
            <div id="mode-split" style="display: none;">
              <div class="grid-inputs">
                <div class="field-group">
                  <label class="field-label" for="sn-coef">Coefficient (a)</label>
                  <input type="number" step="any" id="sn-coef" class="code-input" value="4.5" oninput="calcSNSplit()" style="font-size: 1.2rem;" />
                </div>
                <div class="field-group">
                  <label class="field-label" for="sn-exp">Exponent of 10 (b)</label>
                  <input type="number" step="1" id="sn-exp" class="code-input" value="6" oninput="calcSNSplit()" style="font-size: 1.2rem;" />
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; flex-wrap: wrap; gap: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <label for="sn-sigfigs" style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted);">Significant Figures:</label>
                <select id="sn-sigfigs" onchange="calcSN()" class="code-input" style="padding: 0.3rem 0.6rem; font-size: 0.82rem; width: auto;">
                  <option value="auto" selected>Auto (Input Precision)</option>
                  <option value="1">1 Sig Fig</option>
                  <option value="2">2 Sig Figs</option>
                  <option value="3">3 Sig Figs</option>
                  <option value="4">4 Sig Figs</option>
                  <option value="5">5 Sig Figs</option>
                  <option value="6">6 Sig Figs</option>
                  <option value="8">8 Sig Figs</option>
                  <option value="10">10 Sig Figs</option>
                </select>
              </div>

              <div style="font-family: var(--mono); font-size: 0.82rem; color: var(--text-muted);" id="sn-detected-sig">
                Detected: <strong style="color: var(--fg);" id="detected-sig-val">2</strong> sig figs
              </div>
            </div>

            <!-- Presets -->
            <div style="margin-top: 1.2rem;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Scientific Constants & Presets:</div>
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                <button type="button" class="preset-chip" onclick="applyPreset('299792458', 'Speed of Light (c)')">Light (2.998e8 m/s)</button>
                <button type="button" class="preset-chip" onclick="applyPreset('6.02214076e23', 'Avogadro Constant (N_A)')">Avogadro (6.022e23)</button>
                <button type="button" class="preset-chip" onclick="applyPreset('6.62607015e-34', 'Planck Constant (h)')">Planck (6.626e-34)</button>
                <button type="button" class="preset-chip" onclick="applyPreset('9.1093837e-31', 'Electron Rest Mass')">Electron Mass (9.109e-31 kg)</button>
                <button type="button" class="preset-chip" onclick="applyPreset('5.9722e24', 'Earth Mass')">Earth Mass (5.972e24 kg)</button>
                <button type="button" class="preset-chip" onclick="applyPreset('0.000000000001', 'One Picometer')">Picometer (1e-12)</button>
                <button type="button" class="preset-chip" onclick="applyPreset('4500000', 'Four Point Five Million')">4,500,000</button>
              </div>
            </div>

            <!-- Conversion Results Cards -->
            <div class="sn-card-grid">
              <div class="sn-card" style="border-top: 3px solid #3b82f6;">
                <div>
                  <div class="sn-tag">
                    <span>Scientific Notation (1 &le; |a| &lt; 10)</span>
                    <button type="button" class="copy-btn-mini" onclick="copyCardVal('sn-sci-val', this)">Copy</button>
                  </div>
                  <div id="sn-sci-val" class="sn-val">4.5 &times; 10⁶</div>
                </div>
                <div class="sn-sub" id="sn-latex">LaTeX: <code>4.5 \times 10^{6}</code></div>
              </div>

              <div class="sn-card" style="border-top: 3px solid #10b981;">
                <div>
                  <div class="sn-tag">
                    <span>Engineering Notation (10³ᵏ)</span>
                    <button type="button" class="copy-btn-mini" onclick="copyCardVal('sn-eng-val', this)">Copy</button>
                  </div>
                  <div id="sn-eng-val" class="sn-val">4.5 &times; 10⁶</div>
                </div>
                <div class="sn-sub" id="sn-eng-sub">Exponent multiple of 3</div>
              </div>

              <div class="sn-card" style="border-top: 3px solid #8b5cf6;">
                <div>
                  <div class="sn-tag">
                    <span>SI Metric Prefix</span>
                    <button type="button" class="copy-btn-mini" onclick="copyCardVal('sn-si-val', this)">Copy</button>
                  </div>
                  <div id="sn-si-val" class="sn-val">4.5 M (Mega)</div>
                </div>
                <div class="sn-sub" id="sn-si-sub">Multiplier: 10⁶ (1,000,000)</div>
              </div>

              <div class="sn-card" style="border-top: 3px solid #f59e0b;">
                <div>
                  <div class="sn-tag">
                    <span>Standard Decimal Number</span>
                    <button type="button" class="copy-btn-mini" onclick="copyCardVal('sn-dec-val', this)">Copy</button>
                  </div>
                  <div id="sn-dec-val" class="sn-val">4,500,000</div>
                </div>
                <div class="sn-sub" id="sn-spoken-sub">Short scale: 4.5 million</div>
              </div>

              <div class="sn-card" style="border-top: 3px solid #64748b;">
                <div>
                  <div class="sn-tag">
                    <span>E-Notation (Computer / Excel)</span>
                    <button type="button" class="copy-btn-mini" onclick="copyCardVal('sn-e-val', this)">Copy</button>
                  </div>
                  <div id="sn-e-val" class="sn-val">4.5e+06</div>
                </div>
                <div class="sn-sub">Order of magnitude: ~10⁶</div>
              </div>

              <div class="sn-card" style="border-top: 3px solid #ec4899;">
                <div>
                  <div class="sn-tag">
                    <span>Precision & Sig Figs</span>
                  </div>
                  <div id="sn-sig-val" class="sn-val">2 Sig Figs</div>
                </div>
                <div class="sn-sub" id="sn-uncertainty">Uncertainty: &plusmn;0.05 &times; 10⁶</div>
              </div>
            </div>

            <!-- Copy Summary Button -->
            <div style="margin-top: 1.25rem; display: flex; justify-content: flex-end;">
              <button type="button" class="btn-sec" onclick="copyFullSNSummary(this)" style="font-family: var(--mono); font-size: 0.85rem; padding: 0.5rem 1rem;">
                📋 Copy All Formats & Derivation
              </button>
            </div>

            <!-- Step-by-Step Derivation -->
            <div style="margin-top: 1.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 0.5rem;">Step-by-Step Algebraic Conversion</h3>
              <div id="sn-steps" class="step-box"></div>
            </div>
          </div>

          <!-- SI Metric Prefix Reference Table -->
          <div style="margin-top: 2.5rem;">
            <h2 style="font-family: var(--serif); font-size: 1.5rem; margin-bottom: 0.75rem;">SI Metric Prefixes Reference Guide</h2>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
              Engineering notation groups numbers into exponents divisible by three (\(10^{3k}\)) because each corresponds directly to an official International System of Units (SI) metric prefix:
            </p>
            <div style="overflow-x: auto;">
              <table class="prefix-table">
                <thead>
                  <tr>
                    <th>Prefix</th>
                    <th>Symbol</th>
                    <th>Factor (10ⁿ)</th>
                    <th>Decimal Multiplier</th>
                    <th>Short Scale Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Tera</td><td>T</td><td>10¹²</td><td>1,000,000,000,000</td><td>Trillion</td></tr>
                  <tr><td>Giga</td><td>G</td><td>10⁹</td><td>1,000,000,000</td><td>Billion</td></tr>
                  <tr><td>Mega</td><td>M</td><td>10⁶</td><td>1,000,000</td><td>Million</td></tr>
                  <tr><td>Kilo</td><td>k</td><td>10³</td><td>1,000</td><td>Thousand</td></tr>
                  <tr><td>(Base)</td><td>-</td><td>10⁰</td><td>1</td><td>One</td></tr>
                  <tr><td>Milli</td><td>m</td><td>10⁻³</td><td>0.001</td><td>Thousandth</td></tr>
                  <tr><td>Micro</td><td>&mu;</td><td>10⁻⁶</td><td>0.000 001</td><td>Millionth</td></tr>
                  <tr><td>Nano</td><td>n</td><td>10⁻⁹</td><td>0.000 000 001</td><td>Billionth</td></tr>
                  <tr><td>Pico</td><td>p</td><td>10⁻¹²</td><td>0.000 000 000 001</td><td>Trillionth</td></tr>
                  <tr><td>Femto</td><td>f</td><td>10⁻¹⁵</td><td>0.000 000 000 000 001</td><td>Quadrillionth</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <script>
          var currentMode = 'single';

          function toSuperscript(num) {
            var chars = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '+': '' };
            return num.toString().split('').map(function(c) { return chars[c] !== undefined ? chars[c] : c; }).join('');
          }

          function setMode(mode) {
            currentMode = mode;
            document.getElementById('mode-single').style.display = mode === 'single' ? 'block' : 'none';
            document.getElementById('mode-split').style.display = mode === 'split' ? 'block' : 'none';
            document.getElementById('tab-single').style.fontWeight = mode === 'single' ? '600' : 'normal';
            document.getElementById('tab-single').style.borderColor = mode === 'single' ? 'var(--fg)' : 'var(--border)';
            document.getElementById('tab-split').style.fontWeight = mode === 'split' ? '600' : 'normal';
            document.getElementById('tab-split').style.borderColor = mode === 'split' ? 'var(--fg)' : 'var(--border)';
            if (mode === 'single') calcSN(); else calcSNSplit();
          }

          function countSigFigs(str) {
            str = str.trim().replace(/^[-+]/, '').replace(/,/g, '');
            // Check scientific/E notation
            var eMatch = str.match(/^([0-9.]+)[eE]([-+]?[0-9]+)$/);
            if (eMatch) str = eMatch[1];
            var xMatch = str.match(/^([0-9.]+)s*[*xX×]s*10^?(?([-+]?[0-9]+))?$/);
            if (xMatch) str = xMatch[1];

            if (!str || isNaN(Number(str))) return 2;
            if (str.indexOf('.') !== -1) {
              // Decimal present
              var clean = str.replace(/^0+/, ''); // strip leading zeros before decimal
              if (clean.startsWith('.')) {
                clean = clean.replace(/^.0*/, ''); // strip zeros right after decimal point
              } else {
                clean = clean.replace('.', '');
              }
              return clean.length || 1;
            } else {
              // No decimal: trailing zeros are not significant in standard convention
              var stripped = str.replace(/^0+/, '');
              var trailingStripped = stripped.replace(/0+$/, '');
              return trailingStripped.length || 1;
            }
          }

          function parseAnyInput(raw) {
            raw = raw.trim().replace(/,/g, '').replace(/\s+/g, ' ');
            if (!raw) return null;

            // Check if matches a * 10^b or a x 10^b
            var sciMatch = raw.match(/^([-+]?[0-9]*\.?[0-9]+)\s*(?:\*|[xX×]|&times;)\s*10\^?\(?([-+]?[0-9]+)\)?$/);
            if (sciMatch) {
              var a = parseFloat(sciMatch[1]);
              var b = parseInt(sciMatch[2], 10);
              return { val: a * Math.pow(10, b), coef: a, exp: b, rawSig: countSigFigs(sciMatch[1]) };
            }

            // Check E-notation: 4.5e6
            var eMatch = raw.match(/^([-+]?[0-9]*\.?[0-9]+)[eE]([-+]?[0-9]+)$/);
            if (eMatch) {
              var aE = parseFloat(eMatch[1]);
              var bE = parseInt(eMatch[2], 10);
              return { val: aE * Math.pow(10, bE), coef: aE, exp: bE, rawSig: countSigFigs(eMatch[1]) };
            }

            // Standard decimal
            var d = parseFloat(raw);
            if (!isNaN(d)) {
              return { val: d, rawSig: countSigFigs(raw) };
            }
            return null;
          }

          var siPrefixes = [
            { exp: 24, sym: 'Y', name: 'Yotta', mult: '10²⁴' },
            { exp: 21, sym: 'Z', name: 'Zetta', mult: '10²¹' },
            { exp: 18, sym: 'E', name: 'Exa', mult: '10¹⁸' },
            { exp: 15, sym: 'P', name: 'Peta', mult: '10¹⁵' },
            { exp: 12, sym: 'T', name: 'Tera', mult: '10¹²' },
            { exp: 9, sym: 'G', name: 'Giga', mult: '10⁹' },
            { exp: 6, sym: 'M', name: 'Mega', mult: '10⁶' },
            { exp: 3, sym: 'k', name: 'kilo', mult: '10³' },
            { exp: 0, sym: '', name: 'Unit', mult: '10⁰' },
            { exp: -3, sym: 'm', name: 'milli', mult: '10⁻³' },
            { exp: -6, sym: 'μ', name: 'micro', mult: '10⁻⁶' },
            { exp: -9, sym: 'n', name: 'nano', mult: '10⁻⁹' },
            { exp: -12, sym: 'p', name: 'pico', mult: '10⁻¹²' },
            { exp: -15, sym: 'f', name: 'femto', mult: '10⁻¹⁵' },
            { exp: -18, sym: 'a', name: 'atto', mult: '10⁻¹⁸' },
            { exp: -21, sym: 'z', name: 'zepto', mult: '10⁻²¹' },
            { exp: -24, sym: 'y', name: 'yocto', mult: '10⁻²⁴' }
          ];

          function formatDecimalExpanded(val) {
            if (val === 0) return '0';
            var sign = val < 0 ? '-' : '';
            var abs = Math.abs(val);

            // For manageable ranges
            if (abs >= 1e-6 && abs < 1e15) {
              return val.toLocaleString('en-US', { maximumFractionDigits: 10 });
            }

            // Big or tiny numbers: use BigInt or toPrecision
            var str = abs.toString();
            if (str.indexOf('e') === -1) {
              return sign + str;
            }
            return sign + str;
          }

          function getSpokenName(exp, coef) {
            var sign = coef < 0 ? 'negative ' : '';
            var c = Math.abs(coef);
            if (exp >= 12 && exp < 15) return sign + (c * Math.pow(10, exp - 12)).toFixed(2) + ' trillion';
            if (exp >= 9 && exp < 12) return sign + (c * Math.pow(10, exp - 9)).toFixed(2) + ' billion';
            if (exp >= 6 && exp < 9) return sign + (c * Math.pow(10, exp - 6)).toFixed(2) + ' million';
            if (exp >= 3 && exp < 6) return sign + (c * Math.pow(10, exp - 3)).toFixed(2) + ' thousand';
            if (exp >= 0 && exp < 3) return sign + (c * Math.pow(10, exp)).toFixed(2);
            if (exp <= -3 && exp > -6) return sign + (c * Math.pow(10, exp + 3)).toFixed(2) + ' thousandths';
            if (exp <= -6 && exp > -9) return sign + (c * Math.pow(10, exp + 6)).toFixed(2) + ' millionths';
            if (exp <= -9 && exp > -12) return sign + (c * Math.pow(10, exp + 9)).toFixed(2) + ' billionths';
            return 'Order of magnitude: 10' + toSuperscript(exp);
          }

          function calcSNSplit() {
            var a = parseFloat(document.getElementById('sn-coef').value);
            var b = parseInt(document.getElementById('sn-exp').value, 10);
            if (isNaN(a) || isNaN(b)) return;
            var val = a * Math.pow(10, b);
            renderCalculations(val, Math.max(1, countSigFigs(document.getElementById('sn-coef').value)));
          }

          function calcSN() {
            var raw = document.getElementById('sn-in').value;
            var parsed = parseAnyInput(raw);
            if (!parsed || isNaN(parsed.val)) {
              document.getElementById('sn-sci-val').textContent = '-';
              return;
            }

            var sigOption = document.getElementById('sn-sigfigs').value;
            var sig = sigOption === 'auto' ? parsed.rawSig : parseInt(sigOption, 10);
            document.getElementById('detected-sig-val').textContent = parsed.rawSig;

            renderCalculations(parsed.val, sig);
          }

          function renderCalculations(val, sigFigs) {
            if (val === 0) {
              document.getElementById('sn-sci-val').textContent = '0';
              document.getElementById('sn-eng-val').textContent = '0';
              document.getElementById('sn-si-val').textContent = '0';
              document.getElementById('sn-dec-val').textContent = '0';
              document.getElementById('sn-e-val').textContent = '0e+00';
              document.getElementById('sn-sig-val').textContent = sigFigs + ' Sig Figs';
              document.getElementById('sn-steps').innerHTML = 'Value is zero.';
              return;
            }

            var expStr = val.toExponential(Math.max(0, sigFigs - 1));
            var parts = expStr.split('e');
            var coef = parseFloat(parts[0]);
            var exp = parseInt(parts[1], 10);

            // Format Scientific
            var sciFormatted = coef + ' × 10' + toSuperscript(exp);
            document.getElementById('sn-sci-val').textContent = sciFormatted;
            document.getElementById('sn-latex').innerHTML = 'LaTeX: <code>' + coef + ' \\times 10^{' + exp + '}</code>';

            // Engineering Notation (exp must be multiple of 3)
            var engExp = Math.floor(exp / 3) * 3;
            var expDiff = exp - engExp;
            var engCoef = +(coef * Math.pow(10, expDiff)).toFixed(Math.max(0, sigFigs - 1 - expDiff));
            document.getElementById('sn-eng-val').textContent = engCoef + ' × 10' + toSuperscript(engExp);
            document.getElementById('sn-eng-sub').textContent = 'Grouping: 10' + toSuperscript(engExp) + ' (divisible by 3)';

            // SI Prefix
            var matchedPrefix = siPrefixes.find(function(p) { return p.exp === engExp; });
            if (matchedPrefix && matchedPrefix.sym !== '') {
              document.getElementById('sn-si-val').textContent = engCoef + ' ' + matchedPrefix.sym + ' (' + matchedPrefix.name + ')';
              document.getElementById('sn-si-sub').textContent = 'Multiplier: 10' + toSuperscript(engExp) + ' (' + matchedPrefix.name + ')';
            } else if (engExp === 0) {
              document.getElementById('sn-si-val').textContent = engCoef + ' (base units)';
              document.getElementById('sn-si-sub').textContent = 'No prefix (10⁰ = 1)';
            } else {
              document.getElementById('sn-si-val').textContent = engCoef + ' × 10' + toSuperscript(engExp);
              document.getElementById('sn-si-sub').textContent = 'No standard SI prefix for 10' + toSuperscript(engExp);
            }

            // Decimal & Spoken
            document.getElementById('sn-dec-val').textContent = formatDecimalExpanded(val);
            document.getElementById('sn-spoken-sub').textContent = getSpokenName(exp, coef);

            // E-Notation
            var eSign = exp >= 0 ? '+' : '';
            var ePad = Math.abs(exp) < 10 ? '0' : '';
            document.getElementById('sn-e-val').textContent = coef + 'e' + eSign + ePad + Math.abs(exp);

            // Sig Figs & Uncertainty
            document.getElementById('sn-sig-val').textContent = sigFigs + ' Sig Figs';
            var decimalPlaces = (coef.toString().split('.')[1] || '').length;
            var halfStep = 0.5 * Math.pow(10, -decimalPlaces);
            document.getElementById('sn-uncertainty').innerHTML = 'Estimated uncertainty: &plusmn;' + halfStep.toFixed(decimalPlaces + 1) + ' &times; 10' + toSuperscript(exp);

            // Step-by-Step Derivation text
            var stepsHtml = '';
            stepsHtml += '<div><strong>Step 1 (Normalize Coefficient):</strong> Shift the decimal point until exactly one non-zero digit is on the left: <code>' + coef + '</code>.</div>';
            if (exp > 0) {
              stepsHtml += '<div style="margin-top:0.4rem;"><strong>Step 2 (Determine Exponent):</strong> The decimal point was shifted <strong>' + exp + ' places to the left</strong>, meaning the exponent of 10 is positive: <code>+ ' + exp + '</code>.</div>';
            } else if (exp < 0) {
              stepsHtml += '<div style="margin-top:0.4rem;"><strong>Step 2 (Determine Exponent):</strong> The decimal point was shifted <strong>' + Math.abs(exp) + ' places to the right</strong>, meaning the exponent of 10 is negative: <code>' + exp + '</code>.</div>';
            } else {
              stepsHtml += '<div style="margin-top:0.4rem;"><strong>Step 2 (Determine Exponent):</strong> No decimal shift was needed, so the exponent is <code>10⁰ = 1</code>.</div>';
            }
            stepsHtml += '<div style="margin-top:0.4rem;"><strong>Step 3 (Scientific Form):</strong> Multiply coefficient by power of 10: <strong>' + coef + ' &times; 10' + toSuperscript(exp) + '</strong> (' + sigFigs + ' significant figures).</div>';
            stepsHtml += '<div style="margin-top:0.4rem;"><strong>Step 4 (Engineering & SI Form):</strong> Adjust exponent to nearest lower multiple of 3 (<code>' + engExp + '</code>): <strong>' + engCoef + ' &times; 10' + toSuperscript(engExp) + '</strong>' + (matchedPrefix ? ' = <strong>' + engCoef + ' ' + matchedPrefix.sym + '</strong>' : '') + '.</div>';

            document.getElementById('sn-steps').innerHTML = stepsHtml;
          }

          function applyPreset(valStr, name) {
            setMode('single');
            document.getElementById('sn-in').value = valStr;
            document.getElementById('sn-sigfigs').value = 'auto';
            calcSN();
          }

          function copyCardVal(id, btn) {
            var text = document.getElementById(id).textContent.trim();
            navigator.clipboard.writeText(text).then(function() {
              var old = btn.textContent;
              btn.textContent = 'Copied!';
              btn.style.color = '#10b981';
              btn.style.borderColor = '#10b981';
              setTimeout(function() {
                btn.textContent = old;
                btn.style.color = '';
                btn.style.borderColor = '';
              }, 1500);
            });
          }

          function copyFullSNSummary(btn) {
            var sci = document.getElementById('sn-sci-val').textContent.trim();
            var eng = document.getElementById('sn-eng-val').textContent.trim();
            var si = document.getElementById('sn-si-val').textContent.trim();
            var dec = document.getElementById('sn-dec-val').textContent.trim();
            var e = document.getElementById('sn-e-val').textContent.trim();
            var sig = document.getElementById('sn-sig-val').textContent.trim();

            var summary = [
              '=== Scientific Notation Conversion ===',
              'Scientific Notation : ' + sci,
              'Engineering Notation: ' + eng,
              'SI Metric Prefix    : ' + si,
              'Standard Decimal    : ' + dec,
              'E-Notation (Excel)  : ' + e,
              'Significant Figures : ' + sig,
              'Source: Digital Tools Shed (https://digitaltoolsshed.com/math/scientific-notation-converter.html)'
            ].join('\n');

            navigator.clipboard.writeText(summary).then(function() {
              var old = btn.textContent;
              btn.textContent = '✅ Summary Copied to Clipboard!';
              btn.style.borderColor = '#10b981';
              setTimeout(function() {
                btn.textContent = old;
                btn.style.borderColor = '';
              }, 2000);
            });
          }

          document.addEventListener('DOMContentLoaded', function() { calcSN(); });
          calcSN();
        </script>
      `
    },
      {
    slug: "percentage-increase-calculator",
    title: "Percentage Increase Calculator (Formula, Steps & Multi-Period Projections)",
    metaDesc: "Calculate percentage increase from starting value to final value, apply growth rates, avoid the asymmetric reversal trap, and project multi-period compound gains with interactive SVG growth bars.",
    category: "Math & Finance",
    faq: [
        {
            "q": "What is the mathematical formula for percentage increase?",
            "a": "The formula for percentage increase is: Percentage Increase = [ (Final Value - Initial Value) / |Initial Value| ] × 100%. For example, if a company's revenue rises from $80,000 to $120,000: Difference = $120,000 - $80,000 = $40,000. Percentage Increase = ($40,000 / $80,000) × 100% = +50.0%."
        },
        {
            "q": "How do you calculate percentage increase when the starting value is negative?",
            "a": "When the initial value is negative (such as moving from a net loss of -$50 to a profit of +$50), you must divide by the absolute value of the starting point: [ (50 - (-50)) / |-50| ] × 100% = (100 / 50) × 100% = +200.0%. Without using the absolute value, the resulting percentage would have a false negative sign."
        },
        {
            "q": "What is the \"Asymmetric Reversal Trap\" in percentage growth vs decline?",
            "a": "Because percentage changes are always calculated relative to their immediate baseline, a percentage increase is never canceled out by an equivalent percentage decrease. A +50% gain on $100 brings you to $150. However, to return to $100 from $150 requires a loss of only -33.33% ($50 / $150). Conversely, a +100% gain ($100 to $200) is completely erased by just a -50% decline."
        },
        {
            "q": "What is the difference between \"Percentage Points\" and \"Percentage Increase\"?",
            "a": "Percentage points represent the simple arithmetic difference between two percentage rates, whereas percentage increase measures the relative proportional change. If an interest rate climbs from 4.0% to 6.0%, it increased by 2.0 percentage points (6.0 - 4.0), but the relative percentage increase is +50.0% [ (6.0 - 4.0) / 4.0 × 100% ]. Confusing these two metrics causes major financial and legal misinterpretations."
        },
        {
            "q": "How do you convert a percentage increase into a growth multiplier factor?",
            "a": "To convert a percentage increase into a multiplier, divide the percentage by 100 and add 1: Multiplier = 1 + (Percentage / 100). For example, a 28% increase equals a multiplier of 1.28. Multiplying any base amount by 1.28 yields the increased value directly in a single step."
        }
    ],
    body: `
<div class="article-container" style="max-width:1050px;margin:0 auto;padding:1.5rem 1rem;">
  <nav style="font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);">
    <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Percentage Increase Calculator
  </nav>

  <header style="margin-bottom:2rem;text-align:center;">
    <h1 style="font-family:var(--serif);font-size:2.2rem;margin-bottom:0.5rem;letter-spacing:-0.02em;">Percentage Increase Calculator</h1>
    <p style="color:var(--text-muted);font-size:1.05rem;max-width:750px;margin:0 auto;line-height:1.6;">
      Compute relative percentage expansion between two numbers, apply growth rates, model multi-period compound gains, and calculate exact asymmetric drop recovery thresholds.
    </p>
  </header>

  <style>
    .pinc-box { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:1.75rem; margin-bottom:2rem; }
    .pinc-grid-3 { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem; margin-bottom:1.25rem; }
    .pinc-grid-4 { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1.5rem; }
    .pinc-card { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; text-align:center; position:relative; }
    .pinc-badge { position:absolute; top:8px; right:8px; font-family:var(--mono); font-size:0.65rem; padding:2px 6px; border-radius:4px; }
    .pinc-tab-btn { background:var(--surface-alt); border:1px solid var(--border); color:var(--text-muted); padding:0.6rem 1.25rem; font-family:var(--mono); font-size:0.85rem; border-radius:6px; cursor:pointer; transition:all 0.15s ease; }
    .pinc-tab-btn.active { background:#10b981; border-color:#059669; color:#ffffff; font-weight:600; }
    .pinc-trap-card { background:var(--surface-alt); border-left:4px solid #ef4444; border-radius:0 6px 6px 0; padding:1rem 1.25rem; margin-bottom:1rem; }
    .pinc-trap-title { font-family:var(--serif); font-weight:600; font-size:1.05rem; color:var(--fg); margin-bottom:0.25rem; }
    .pinc-trap-desc { font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin:0; }
    .pinc-svg-box { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; margin-top:1.5rem; }
  </style>

  <div class="pinc-box">
    <!-- Mode Switcher -->
    <div style="display:flex;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap;">
      <button type="button" class="pinc-tab-btn active" id="btn-pinc-diff" onclick="setPINCMode('diff')">Mode 1: Find % Increase (V1 &rarr; V2)</button>
      <button type="button" class="pinc-tab-btn" id="btn-pinc-apply" onclick="setPINCMode('apply')">Mode 2: Apply % Increase (V1 + % &rarr; V2)</button>
    </div>

    <!-- Inputs Grid -->
    <div class="pinc-grid-3">
      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Initial / Starting Value (V1)</label>
        <input type="number" id="pinc-v1" value="80" step="any" oninput="calcPINC()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.25rem;font-weight:bold;box-sizing:border-box;">
      </div>

      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;" id="lbl-pinc-v2">Final / New Value (V2)</label>
        <input type="number" id="pinc-v2" value="120" step="any" oninput="calcPINC()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.25rem;font-weight:bold;box-sizing:border-box;">
      </div>

      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Compound Periods (Years/Cycles)</label>
        <input type="number" id="pinc-periods" value="1" min="1" max="50" step="1" oninput="calcPINC()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.25rem;box-sizing:border-box;">
      </div>
    </div>

    <!-- Quick Presets -->
    <div style="margin-bottom:1.5rem;display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
      <span style="font-family:var(--mono);font-size:0.75rem;color:var(--text-muted);margin-right:0.25rem;">Popular Growth Presets:</span>
      <button type="button" class="btn-sec" onclick="setPINCPreset(50, 75)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">50 &rarr; 75 (+50%)</button>
      <button type="button" class="btn-sec" onclick="setPINCPreset(100, 200)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">Doubling 100 &rarr; 200 (+100%)</button>
      <button type="button" class="btn-sec" onclick="setPINCPreset(65000, 78000)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">Salary Raise $65k &rarr; $78k</button>
      <button type="button" class="btn-sec" onclick="setPINCPreset(250, 350)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">Rent $250 &rarr; $350 (+40%)</button>
    </div>

    <!-- Hero Cards -->
    <div class="pinc-grid-4">
      <div class="pinc-card" style="border-top:4px solid #10b981;">
        <span class="pinc-badge" style="background:rgba(16,185,129,0.15);color:#10b981;">Growth Rate</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Percentage Increase</div>
        <div id="card-pinc-pct" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:#10b981;">+50.00%</div>
        <div id="card-pinc-pct-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Relative to starting base</div>
      </div>

      <div class="pinc-card" style="border-top:4px solid #3b82f6;">
        <span class="pinc-badge" style="background:rgba(59,130,246,0.15);color:#3b82f6;">Absolute</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Absolute Unit Gain</div>
        <div id="card-pinc-diff" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:#3b82f6;">+40.00</div>
        <div id="card-pinc-diff-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">V2 &minus; V1 difference</div>
      </div>

      <div class="pinc-card" style="border-top:4px solid #8b5cf6;">
        <span class="pinc-badge" style="background:rgba(139,92,246,0.15);color:#8b5cf6;">Multiple</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Growth Multiplier</div>
        <div id="card-pinc-mult" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:var(--fg);">1.50&times;</div>
        <div id="card-pinc-mult-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Scale expansion factor</div>
      </div>

      <div class="pinc-card" style="border-top:4px solid #f59e0b;">
        <span class="pinc-badge" style="background:rgba(245,158,11,0.15);color:#f59e0b;">Reversal</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Reverse Drop Needed</div>
        <div id="card-pinc-reversal" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:#f59e0b;">-33.33%</div>
        <div style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">To return to V1 from V2</div>
      </div>
    </div>

    <!-- Pure SVG Growth Bar Visualizer -->
    <div class="pinc-svg-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;">
        <span style="font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">Visual Scale Expansion Comparison</span>
        <span style="font-family:var(--mono);font-size:0.78rem;color:var(--text-muted);">Baseline vs. Expanded Quantity</span>
      </div>
      <div id="pinc-svg-container" style="width:100%;height:85px;"></div>
      <div style="display:flex;gap:1.5rem;margin-top:0.75rem;font-family:var(--mono);font-size:0.75rem;color:var(--text-muted);flex-wrap:wrap;">
        <span style="display:inline-flex;align-items:center;gap:0.4rem;"><span style="width:10px;height:10px;background:#64748b;border-radius:2px;"></span> Initial Base (V1)</span>
        <span style="display:inline-flex;align-items:center;gap:0.4rem;"><span style="width:10px;height:10px;background:#10b981;border-radius:2px;"></span> Increased Value (V2)</span>
        <span style="display:inline-flex;align-items:center;gap:0.4rem;"><span style="width:10px;height:10px;background:#3b82f6;border-radius:2px;"></span> Absolute Gain (&Delta;)</span>
      </div>
    </div>

    <!-- Live Step-by-Step Derivations -->
    <div style="margin-top:1.5rem;background:var(--surface-alt);border-left:3px solid #10b981;padding:1.1rem 1.25rem;border-radius:0 6px 6px 0;font-size:0.88rem;line-height:1.6;">
      <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Live Mathematical Derivations:</div>
      <div id="pinc-derivations" style="font-family:var(--mono);color:var(--fg);"></div>
    </div>

    <!-- One-Click Copy Button -->
    <div style="margin-top:1.5rem;display:flex;justify-content:flex-end;">
      <button type="button" class="btn-sec" onclick="copyPINCReport(this)" style="font-family:var(--mono);font-size:0.85rem;padding:0.6rem 1.25rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;cursor:pointer;color:var(--fg);">
        📋 Copy Percentage Increase Report
      </button>
    </div>
  </div>

  <!-- Real-World Traps Section -->
  <div style="margin-bottom:2.5rem;">
    <h2 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:1rem;letter-spacing:-0.01em;">5 Fatal Traps &amp; Gotchas in Percentage Increase Calculations</h2>

    <div class="pinc-trap-card">
      <div class="pinc-trap-title">1. The Asymmetric Reversal Fallacy (Why a 50% Gain Needs Only a 33% Loss)</div>
      <p class="pinc-trap-desc">
        A dangerous misconception in finance is assuming that an increase of X% can be undone by a decrease of X%. Because percentages are calculated from their new starting points, gaining +50% on $100 yields $150. Losing 50% of $150 drops you to $75—a catastrophic 25% net loss! The reverse percentage drop required to restore the original baseline is <code>Reverse Drop = Increase / (1 + Increase)</code>.
      </p>
    </div>

    <div class="pinc-trap-card">
      <div class="pinc-trap-title">2. Percentage Points vs. Relative Percentage Increase</div>
      <p class="pinc-trap-desc">
        News outlets and corporate earnings reports routinely blur the line between percentage points and percentage increase. If a company's market share expands from 2% to 4%, it gained 2 percentage points. However, its business grew by an astounding +100% relative percentage increase! Conflating these two figures produces massive discrepancies in marketing claims and scientific studies.
      </p>
    </div>

    <div class="pinc-trap-card">
      <div class="pinc-trap-title">3. The Negative Starting Base Division Trap</div>
      <p class="pinc-trap-desc">
        When an initial number is negative (such as moving from -$10,000 net income to +$20,000 net income), standard formulas fail if they omit absolute value signs: <code>(20,000 - (-10,000)) / (-10,000) = 30,000 / -10,000 = -300%</code>. A profit turnaround displayed as negative 300% is nonsensical. Dividing by <code>|-10,000|</code> correctly reflects a +300% improvement.
      </p>
    </div>

    <div class="pinc-trap-card">
      <div class="pinc-trap-title">4. Multi-Period Compounding vs. Simple Summation</div>
      <p class="pinc-trap-desc">
        If a stock gains +10% in Year 1 and +10% in Year 2, simple addition predicts a +20% gain. In reality, compounding expands the portfolio: <code>$100 &times; 1.10 &times; 1.10 = $121.00</code>, representing a +21% cumulative increase. Over 10 years of +10% annual gains, simple addition yields +100%, whereas compound reality delivers an astounding +159.37% (a 2.59&times; multiple).
      </p>
    </div>

    <div class="pinc-trap-card">
      <div class="pinc-trap-title">5. Base Effect Skew (Cherry-Picking Depressed Reference Dates)</div>
      <p class="pinc-trap-desc">
        Economic metrics measured immediately following a crisis or lockdown often boast staggering percentage increases. For instance, airline travel surging +80% year-over-year following a pandemic trough may sound extraordinary, but if travel was initially down -70%, an 80% rebound still leaves total passengers 46% below pre-crisis operational capacity.
      </p>
    </div>
  </div>
</div>

<script>
  var curPINCMode = 'diff';

  function setPINCMode(m) {
    curPINCMode = m;
    document.getElementById('btn-pinc-diff').className = 'pinc-tab-btn' + (m === 'diff' ? ' active' : '');
    document.getElementById('btn-pinc-apply').className = 'pinc-tab-btn' + (m === 'apply' ? ' active' : '');
    document.getElementById('lbl-pinc-v2').textContent = (m === 'diff') ? 'Final / New Value (V2)' : 'Percentage Increase to Apply (%)';
    calcPINC();
  }

  function setPINCPreset(v1, v2) {
    curPINCMode = 'diff';
    document.getElementById('btn-pinc-diff').className = 'pinc-tab-btn active';
    document.getElementById('btn-pinc-apply').className = 'pinc-tab-btn';
    document.getElementById('lbl-pinc-v2').textContent = 'Final / New Value (V2)';
    document.getElementById('pinc-v1').value = v1;
    document.getElementById('pinc-v2').value = v2;
    document.getElementById('pinc-periods').value = 1;
    calcPINC();
  }

  function calcPINC() {
    var v1 = parseFloat(document.getElementById('pinc-v1').value) || 0;
    var inp2 = parseFloat(document.getElementById('pinc-v2').value) || 0;
    var periods = parseInt(document.getElementById('pinc-periods').value, 10) || 1;
    if (periods < 1) periods = 1;

    var v2 = 0;
    var pctIncrease = 0;
    var absDiff = 0;
    var mult = 1;
    var reversalPct = 0;

    if (curPINCMode === 'diff') {
      v2 = inp2;
      absDiff = v2 - v1;
      var denom = Math.abs(v1) === 0 ? 1 : Math.abs(v1);
      pctIncrease = (absDiff / denom) * 100;
      mult = v1 !== 0 ? (v2 / v1) : (1 + pctIncrease / 100);
      reversalPct = v2 !== 0 ? ((v1 - v2) / Math.abs(v2)) * 100 : 0;
    } else {
      pctIncrease = inp2;
      mult = 1 + (pctIncrease / 100);
      v2 = v1 * Math.pow(mult, periods);
      absDiff = v2 - v1;
      reversalPct = v2 !== 0 ? ((v1 - v2) / Math.abs(v2)) * 100 : 0;
    }

    var sign = pctIncrease >= 0 ? '+' : '';
    document.getElementById('card-pinc-pct').textContent = sign + pctIncrease.toFixed(2) + '%';
    document.getElementById('card-pinc-pct').style.color = pctIncrease >= 0 ? '#10b981' : '#ef4444';

    var diffSign = absDiff >= 0 ? '+' : '';
    document.getElementById('card-pinc-diff').textContent = diffSign + absDiff.toFixed(2);
    document.getElementById('card-pinc-diff-sub').textContent = 'Final value: ' + v2.toFixed(2);

    document.getElementById('card-pinc-mult').textContent = mult.toFixed(2) + '×';

    document.getElementById('card-pinc-reversal').textContent = reversalPct.toFixed(2) + '%';

    renderPINCVisual(v1, v2);

    // Derivations
    var deriv = [];
    if (curPINCMode === 'diff') {
      deriv.push('1. Absolute Gain: Final (' + v2 + ') &minus; Initial (' + v1 + ') = <strong>' + diffSign + absDiff.toFixed(4) + '</strong>');
      deriv.push('2. Relative Decimal Ratio: ' + diffSign + absDiff.toFixed(4) + ' &divide; |' + v1 + '| = ' + (absDiff / (Math.abs(v1) || 1)).toFixed(5));
      deriv.push('3. Percentage Increase Formula: ' + (absDiff / (Math.abs(v1) || 1)).toFixed(5) + ' &times; 100% = <strong>' + sign + pctIncrease.toFixed(2) + '%</strong>');
      deriv.push('4. Growth Multiplier: ' + v2 + ' &divide; ' + v1 + ' = <strong>' + mult.toFixed(4) + '&times;</strong>');
      deriv.push('5. Asymmetric Drop Recovery: [(' + v1 + ' &minus; ' + v2 + ') &divide; |' + v2 + '|] &times; 100% = <strong>' + reversalPct.toFixed(2) + '%</strong> needed to return to baseline');
    } else {
      deriv.push('1. Growth Factor per Period: 1 + (' + pctIncrease + '% &divide; 100) = <strong>' + mult.toFixed(4) + '&times;</strong>');
      deriv.push('2. Applied Expansion (' + periods + ' period' + (periods > 1 ? 's' : '') + '): ' + v1 + ' &times; (' + mult.toFixed(4) + ')^' + periods + ' = <strong>' + v2.toFixed(2) + ' final value</strong>');
      deriv.push('3. Net Absolute Gain: ' + v2.toFixed(2) + ' &minus; ' + v1 + ' = <strong>+' + absDiff.toFixed(2) + '</strong>');
    }
    document.getElementById('pinc-derivations').innerHTML = deriv.join('<br>');
  }

  function renderPINCVisual(v1, v2) {
    var c = document.getElementById('pinc-svg-container');
    if (!c) return;

    var w = c.clientWidth || 600;
    var h = 80;
    var maxVal = Math.max(1, Math.abs(v1), Math.abs(v2));

    var barH = 18;
    var y1 = 12, y2 = 42;

    function getW(v) {
      return Math.max(2, Math.min(w - 130, (Math.abs(v) / maxVal) * (w - 130)));
    }

    var w1 = getW(v1);
    var w2 = getW(v2);

    var svg = '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" style="display:block;">';

    // Bar 1 (V1)
    svg += '<text x="0" y="' + (y1 + 14) + '" fill="var(--text-muted)" font-family="var(--mono)" font-size="11">Initial (V1):</text>';
    svg += '<rect x="90" y="' + y1 + '" width="' + (w - 110) + '" height="' + barH + '" rx="3" fill="#334155" />';
    svg += '<rect x="90" y="' + y1 + '" width="' + w1 + '" height="' + barH + '" rx="3" fill="#64748b" />';
    svg += '<text x="' + (95 + w1) + '" y="' + (y1 + 14) + '" fill="var(--fg)" font-family="var(--mono)" font-size="11">' + v1.toFixed(1) + '</text>';

    // Bar 2 (V2)
    svg += '<text x="0" y="' + (y2 + 14) + '" fill="var(--text-muted)" font-family="var(--mono)" font-size="11">Final (V2):</text>';
    svg += '<rect x="90" y="' + y2 + '" width="' + (w - 110) + '" height="' + barH + '" rx="3" fill="#334155" />';
    svg += '<rect x="90" y="' + y2 + '" width="' + w2 + '" height="' + barH + '" rx="3" fill="#10b981" />';
    svg += '<text x="' + (95 + w2) + '" y="' + (y2 + 14) + '" fill="#10b981" font-family="var(--mono)" font-size="11" font-weight="bold">' + v2.toFixed(1) + '</text>';

    svg += '</svg>';
    c.innerHTML = svg;
  }

  function copyPINCReport(btn) {
    var pct = document.getElementById('card-pinc-pct').textContent;
    var diff = document.getElementById('card-pinc-diff').textContent;
    var mult = document.getElementById('card-pinc-mult').textContent;
    var rev = document.getElementById('card-pinc-reversal').textContent;
    var v1 = document.getElementById('pinc-v1').value;
    var v2 = document.getElementById('pinc-v2').value;

    var lines = [
      '========================================',
      '     PERCENTAGE INCREASE GROWTH REPORT',
      '========================================',
      'Initial Base (V1)    : ' + v1,
      'Final Value (V2)     : ' + v2,
      '----------------------------------------',
      'Percentage Increase  : ' + pct,
      'Absolute Unit Gain   : ' + diff,
      'Growth Multiplier    : ' + mult,
      'Reverse Drop Needed  : ' + rev,
      '========================================',
      'Source: Digital Tools Shed (https://digitaltoolsshed.com/math/percentage-increase-calculator.html)'
    ];

    navigator.clipboard.writeText(lines.join('\n')).then(function() {
      var orig = btn.innerHTML;
      btn.innerHTML = '✅ Copied Growth Report!';
      btn.style.borderColor = '#10b981';
      setTimeout(function() {
        btn.innerHTML = orig;
        btn.style.borderColor = '';
      }, 2000);
    });
  }

  window.addEventListener('resize', calcPINC);
  document.addEventListener('DOMContentLoaded', calcPINC);
  calcPINC();
</script>
`
  },
      {
    slug: "percentage-decrease-calculator",
    title: "Percentage Decrease Calculator (Discount, Savings & Asymmetric Loss Recovery)",
    metaDesc: "Calculate percentage decrease, markdown sale discounts, stacked coupon savings, and the exact asymmetric gain required to recover from financial losses with interactive SVG contraction bars.",
    category: "Math & Finance",
    faq: [
        {
            "q": "What is the mathematical formula for percentage decrease?",
            "a": "The formula for percentage decrease is: Percentage Decrease = [ (Initial Value - Final Value) / Initial Value ] × 100%. For example, if a product price drops from $150.00 to $105.00: Difference = $150.00 - $105.00 = $45.00. Percentage Decrease = ($45.00 / $150.00) × 100% = 30.0% savings."
        },
        {
            "q": "Why do financial portfolio losses require a disproportionately larger percentage gain to recover?",
            "a": "Because percentage changes are always evaluated against their immediate baseline. A -50% loss reduces a $10,000 portfolio to $5,000. To recover the $5,000 lost, you must earn $5,000 on a $5,000 base—which requires an extraordinary +100% gain! The formula for the required recovery gain is: Required Gain = [ Loss % / (1 - Loss %) ] × 100%."
        },
        {
            "q": "How do stacked discounts work (e.g., 20% off storewide plus an extra 15% VIP coupon)?",
            "a": "Stacked discounts are applied sequentially (multiplicatively), never additively. Adding 20% + 15% does NOT equal 35% off. Instead, the first 20% discount reduces a $100 item to $80. The second 15% discount applies to the remaining $80 balance, saving an extra $12.00. The final price is $68.00, representing an effective cumulative discount of 32.0%."
        },
        {
            "q": "Can a percentage decrease ever exceed 100%?",
            "a": "In standard arithmetic regarding physical quantities, prices, or populations, a percentage decrease cannot exceed 100% because dropping by 100% reaches absolute zero. A decrease greater than 100% is mathematically possible only when a quantity can cross zero into negative territory (such as an operating profit dropping from +$10,000 to -$5,000, representing a -150% change)."
        },
        {
            "q": "What is the difference between a percentage discount and a price markup?",
            "a": "A discount is calculated backward from the retail selling price, while a markup is calculated forward from the wholesale cost. If an item costs $80 wholesale and retails for $100, the markup is +25% ($20 / $80), but discounting the $100 retail price back to cost is only a -20% discount ($20 / $100)."
        }
    ],
    body: `
<div class="article-container" style="max-width:1050px;margin:0 auto;padding:1.5rem 1rem;">
  <nav style="font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);">
    <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Percentage Decrease Calculator
  </nav>

  <header style="margin-bottom:2rem;text-align:center;">
    <h1 style="font-family:var(--serif);font-size:2.2rem;margin-bottom:0.5rem;letter-spacing:-0.02em;">Percentage Decrease Calculator</h1>
    <p style="color:var(--text-muted);font-size:1.05rem;max-width:750px;margin:0 auto;line-height:1.6;">
      Calculate percentage reductions, markdown savings, stacked coupon sequences, and determine the exact asymmetric gain required to recover from portfolio losses.
    </p>
  </header>

  <style>
    .pdec-box { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:1.75rem; margin-bottom:2rem; }
    .pdec-grid-3 { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem; margin-bottom:1.25rem; }
    .pdec-grid-4 { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:1.5rem; }
    .pdec-card { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; text-align:center; position:relative; }
    .pdec-badge { position:absolute; top:8px; right:8px; font-family:var(--mono); font-size:0.65rem; padding:2px 6px; border-radius:4px; }
    .pdec-tab-btn { background:var(--surface-alt); border:1px solid var(--border); color:var(--text-muted); padding:0.6rem 1.25rem; font-family:var(--mono); font-size:0.85rem; border-radius:6px; cursor:pointer; transition:all 0.15s ease; }
    .pdec-tab-btn.active { background:#ef4444; border-color:#dc2626; color:#ffffff; font-weight:600; }
    .pdec-trap-card { background:var(--surface-alt); border-left:4px solid #ef4444; border-radius:0 6px 6px 0; padding:1rem 1.25rem; margin-bottom:1rem; }
    .pdec-trap-title { font-family:var(--serif); font-weight:600; font-size:1.05rem; color:var(--fg); margin-bottom:0.25rem; }
    .pdec-trap-desc { font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin:0; }
    .pdec-svg-box { background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; padding:1.25rem; margin-top:1.5rem; }
  </style>

  <div class="pdec-box">
    <!-- Mode Switcher -->
    <div style="display:flex;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap;">
      <button type="button" class="pdec-tab-btn active" id="btn-pdec-diff" onclick="setPDECMode('diff')">Mode 1: Find % Decrease (V1 &rarr; V2)</button>
      <button type="button" class="pdec-tab-btn" id="btn-pdec-apply" onclick="setPDECMode('apply')">Mode 2: Apply % Discount (V1 &minus; % &rarr; V2)</button>
      <button type="button" class="pdec-tab-btn" id="btn-pdec-stacked" onclick="setPDECMode('stacked')">Mode 3: Stacked Coupons (D1 + D2)</button>
    </div>

    <!-- Inputs Grid -->
    <div class="pdec-grid-3">
      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Original / Initial Value (V1)</label>
        <input type="number" id="pdec-v1" value="150" step="any" oninput="calcPDEC()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.25rem;font-weight:bold;box-sizing:border-box;">
      </div>

      <div>
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;" id="lbl-pdec-v2">New Reduced Value (V2)</label>
        <input type="number" id="pdec-v2" value="105" step="any" oninput="calcPDEC()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.25rem;font-weight:bold;box-sizing:border-box;">
      </div>

      <div id="pdec-stacked-col" style="display:none;">
        <label style="display:block;font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;">Secondary Stacked Discount (%)</label>
        <input type="number" id="pdec-stacked-pct" value="15" min="0" max="100" step="1" oninput="calcPDEC()" style="width:100%;padding:0.75rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;color:var(--fg);font-family:var(--mono);font-size:1.25rem;box-sizing:border-box;">
      </div>
    </div>

    <!-- Quick Presets -->
    <div style="margin-bottom:1.5rem;display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
      <span style="font-family:var(--mono);font-size:0.75rem;color:var(--text-muted);margin-right:0.25rem;">Quick Scenarios:</span>
      <button type="button" class="btn-sec" onclick="setPDECpreset(100, 75)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">100 &rarr; 75 (-25%)</button>
      <button type="button" class="btn-sec" onclick="setPDECpreset(100, 50)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">Halving 100 &rarr; 50 (-50%)</button>
      <button type="button" class="btn-sec" onclick="setPDECpreset(200, 160)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">Retail Sale $200 &rarr; $160 (-20%)</button>
      <button type="button" class="btn-sec" onclick="setPDECpreset(1000, 100)" style="font-family:var(--mono);font-size:0.75rem;padding:0.35rem 0.65rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--fg);">Crash $1,000 &rarr; $100 (-90%)</button>
    </div>

    <!-- Hero Cards -->
    <div class="pdec-grid-4">
      <div class="pdec-card" style="border-top:4px solid #ef4444;">
        <span class="pdec-badge" style="background:rgba(239,68,68,0.15);color:#ef4444;">Reduction</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Percentage Decrease</div>
        <div id="card-pdec-pct" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:#ef4444;">-30.00%</div>
        <div id="card-pdec-pct-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Relative to initial price</div>
      </div>

      <div class="pdec-card" style="border-top:4px solid #3b82f6;">
        <span class="pdec-badge" style="background:rgba(59,130,246,0.15);color:#3b82f6;">Savings</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Absolute Unit Reduction</div>
        <div id="card-pdec-diff" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:#3b82f6;">-$45.00</div>
        <div id="card-pdec-diff-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">V1 &minus; V2 savings</div>
      </div>

      <div class="pdec-card" style="border-top:4px solid #8b5cf6;">
        <span class="pdec-badge" style="background:rgba(139,92,246,0.15);color:#8b5cf6;">Factor</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Remaining Multiple</div>
        <div id="card-pdec-mult" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:var(--fg);">0.70&times;</div>
        <div id="card-pdec-mult-sub" style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Portion retained</div>
      </div>

      <div class="pdec-card" style="border-top:4px solid #10b981;">
        <span class="pdec-badge" style="background:rgba(16,185,129,0.15);color:#10b981;">Break-Even</span>
        <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">Required Recovery Gain</div>
        <div id="card-pdec-recovery" style="font-family:var(--mono);font-size:2rem;font-weight:bold;color:#10b981;">+42.86%</div>
        <div style="font-size:0.78rem;color:var(--text-muted);font-family:var(--mono);margin-top:0.25rem;">Gain needed from V2 to reach V1</div>
      </div>
    </div>

    <!-- Pure SVG Contraction Visualizer -->
    <div class="pdec-svg-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;">
        <span style="font-family:var(--serif);font-size:1.05rem;font-weight:600;color:var(--fg);">Visual Contraction &amp; Retention Scale</span>
        <span style="font-family:var(--mono);font-size:0.78rem;color:var(--text-muted);">Baseline vs. Shrunk Quantity</span>
      </div>
      <div id="pdec-svg-container" style="width:100%;height:80px;"></div>
      <div style="display:flex;gap:1.5rem;margin-top:0.75rem;font-family:var(--mono);font-size:0.75rem;color:var(--text-muted);flex-wrap:wrap;">
        <span style="display:inline-flex;align-items:center;gap:0.4rem;"><span style="width:10px;height:10px;background:#64748b;border-radius:2px;"></span> Original Value (V1)</span>
        <span style="display:inline-flex;align-items:center;gap:0.4rem;"><span style="width:10px;height:10px;background:#ef4444;border-radius:2px;"></span> Reduced Balance (V2)</span>
        <span style="display:inline-flex;align-items:center;gap:0.4rem;"><span style="width:10px;height:10px;background:#3b82f6;border-radius:2px;"></span> Shaved Off Discount (&Delta;)</span>
      </div>
    </div>

    <!-- Live Step-by-Step Derivations -->
    <div style="margin-top:1.5rem;background:var(--surface-alt);border-left:3px solid #ef4444;padding:1.1rem 1.25rem;border-radius:0 6px 6px 0;font-size:0.88rem;line-height:1.6;">
      <div style="font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Live Mathematical Derivations:</div>
      <div id="pdec-derivations" style="font-family:var(--mono);color:var(--fg);"></div>
    </div>

    <!-- One-Click Copy Button -->
    <div style="margin-top:1.5rem;display:flex;justify-content:flex-end;">
      <button type="button" class="btn-sec" onclick="copyPDECReport(this)" style="font-family:var(--mono);font-size:0.85rem;padding:0.6rem 1.25rem;background:var(--surface-alt);border:1px solid var(--border);border-radius:6px;cursor:pointer;color:var(--fg);">
        📋 Copy Percentage Decrease Report
      </button>
    </div>
  </div>

  <!-- Real-World Traps Section -->
  <div style="margin-bottom:2.5rem;">
    <h2 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:1rem;letter-spacing:-0.01em;">5 Fatal Traps &amp; Gotchas in Percentage Decrease Calculations</h2>

    <div class="pdec-trap-card">
      <div class="pdec-trap-title">1. The Asymmetric Drawdown Recovery Trap</div>
      <p class="pdec-trap-desc">
        The most punishing law of arithmetic is that losses require exponential percentage gains to break even. A -20% loss needs +25% to recover. A -50% crash cuts wealth in half, requiring a massive +100% gain to restore principal. A catastrophic -90% drop leaves only 10% of capital, requiring an almost insurmountable +900% gain just to return to the starting line.
      </p>
    </div>

    <div class="pdec-trap-card">
      <div class="pdec-trap-title">2. The Stacked Coupon Addition Illusion</div>
      <p class="pdec-trap-desc">
        Retailers frequently advertise "Take 30% off, plus an extra 20% off at checkout!". Shoppers often assume this equals a 50% discount. In reality, discounts compound sequentially: <code>(1 - 0.30) &times; (1 - 0.20) = 0.70 &times; 0.80 = 0.56</code>. You pay 56% of the original price, meaning the true cumulative discount is 44.0%, leaving you paying 6% more than expected.
      </p>
    </div>

    <div class="pdec-trap-card">
      <div class="pdec-trap-title">3. Margin Reduction vs. Retail Discount Inversion</div>
      <p class="pdec-trap-desc">
        A merchant selling a $100 item with a 40% gross margin makes $40 profit on a $60 cost of goods. If the merchant offers a seemingly modest 20% discount ($80 price), profit drops to $20. A 20% price cut cut gross dollar profits in half (-50% reduction in earnings)! Price discounts disproportionately crush net profit margins.
      </p>
    </div>

    <div class="pdec-trap-card">
      <div class="pdec-trap-title">4. The Negative Price / "Over 100% Decrease" Trap</div>
      <p class="pdec-trap-desc">
        Markdowns on retail goods, weight loss, or inventory units cannot logically exceed 100%. A 100% decrease means the item is completely free or the inventory is 0. Claiming an item is "120% off" would imply the retailer pays the customer to take the merchandise, which violates physical commercial constraints.
      </p>
    </div>

    <div class="pdec-trap-card">
      <div class="pdec-trap-title">5. Inflation Purchasing Power Decay</div>
      <p class="pdec-trap-desc">
        Holding uninvested cash during inflation creates a silent, guaranteed percentage decrease in purchasing power. At a 3.5% annual inflation rate, the purchasing power of $100,000 decays to $70,891 over 10 years—a -29.1% permanent erosion in real goods and services that your savings can purchase.
      </p>
    </div>
  </div>
</div>

<script>
  var curPDECMode = 'diff';

  function setPDECMode(m) {
    curPDECMode = m;
    document.getElementById('btn-pdec-diff').className = 'pdec-tab-btn' + (m === 'diff' ? ' active' : '');
    document.getElementById('btn-pdec-apply').className = 'pdec-tab-btn' + (m === 'apply' ? ' active' : '');
    document.getElementById('btn-pdec-stacked').className = 'pdec-tab-btn' + (m === 'stacked' ? ' active' : '');

    var stackCol = document.getElementById('pdec-stacked-col');
    if (m === 'stacked') {
      stackCol.style.display = 'block';
      document.getElementById('lbl-pdec-v2').textContent = 'Primary Discount (%)';
    } else {
      stackCol.style.display = 'none';
      document.getElementById('lbl-pdec-v2').textContent = (m === 'diff') ? 'New Reduced Value (V2)' : 'Percentage Discount (%)';
    }
    calcPDEC();
  }

  function setPDECpreset(v1, v2) {
    curPDECMode = 'diff';
    document.getElementById('btn-pdec-diff').className = 'pdec-tab-btn active';
    document.getElementById('btn-pdec-apply').className = 'pdec-tab-btn';
    document.getElementById('btn-pdec-stacked').className = 'pdec-tab-btn';
    document.getElementById('pdec-stacked-col').style.display = 'none';
    document.getElementById('lbl-pdec-v2').textContent = 'New Reduced Value (V2)';
    document.getElementById('pdec-v1').value = v1;
    document.getElementById('pdec-v2').value = v2;
    calcPDEC();
  }

  function calcPDEC() {
    var v1 = parseFloat(document.getElementById('pdec-v1').value) || 0;
    var inp2 = parseFloat(document.getElementById('pdec-v2').value) || 0;

    var v2 = 0;
    var pctDecrease = 0;
    var absDiff = 0;
    var mult = 1;
    var recoveryGain = 0;

    if (curPDECMode === 'diff') {
      v2 = inp2;
      absDiff = v1 - v2;
      var denom = Math.abs(v1) === 0 ? 1 : Math.abs(v1);
      pctDecrease = (absDiff / denom) * 100;
      mult = v1 !== 0 ? (v2 / v1) : (1 - pctDecrease / 100);
      recoveryGain = v2 > 0 ? ((v1 - v2) / v2) * 100 : 0;
    } else if (curPDECMode === 'apply') {
      pctDecrease = inp2;
      mult = Math.max(0, 1 - (pctDecrease / 100));
      v2 = v1 * mult;
      absDiff = v1 - v2;
      recoveryGain = v2 > 0 ? ((v1 - v2) / v2) * 100 : 0;
    } else if (curPDECMode === 'stacked') {
      var d1 = inp2 / 100;
      var d2 = (parseFloat(document.getElementById('pdec-stacked-pct').value) || 0) / 100;
      mult = Math.max(0, (1 - d1) * (1 - d2));
      pctDecrease = (1 - mult) * 100;
      v2 = v1 * mult;
      absDiff = v1 - v2;
      recoveryGain = v2 > 0 ? ((v1 - v2) / v2) * 100 : 0;
    }

    var sign = pctDecrease > 0 ? '-' : '+';
    document.getElementById('card-pdec-pct').textContent = (pctDecrease > 0 ? '-' : '') + Math.abs(pctDecrease).toFixed(2) + '%';
    document.getElementById('card-pdec-pct').style.color = pctDecrease > 0 ? '#ef4444' : '#10b981';

    var diffSign = absDiff >= 0 ? '-$' : '+$';
    document.getElementById('card-pdec-diff').textContent = diffSign + Math.abs(absDiff).toFixed(2);
    document.getElementById('card-pdec-diff-sub').textContent = 'Final value: $' + v2.toFixed(2);

    document.getElementById('card-pdec-mult').textContent = mult.toFixed(2) + '×';

    document.getElementById('card-pdec-recovery').textContent = recoveryGain > 0 ? ('+' + recoveryGain.toFixed(2) + '%') : '0.00%';

    renderPDECVisual(v1, v2);

    // Derivations
    var deriv = [];
    if (curPDECMode === 'diff') {
      deriv.push('1. Absolute Reduction: Initial ($' + v1.toFixed(2) + ') &minus; Final ($' + v2.toFixed(2) + ') = <strong>$' + absDiff.toFixed(2) + ' savings</strong>');
      deriv.push('2. Decimal Ratio: $' + absDiff.toFixed(2) + ' &divide; $' + v1.toFixed(2) + ' = ' + (absDiff / (v1 || 1)).toFixed(5));
      deriv.push('3. Percentage Decrease Formula: ' + (absDiff / (v1 || 1)).toFixed(5) + ' &times; 100% = <strong>-' + pctDecrease.toFixed(2) + '%</strong>');
      deriv.push('4. Break-Even Recovery: ($' + absDiff.toFixed(2) + ' &divide; $' + v2.toFixed(2) + ') &times; 100% = <strong>+' + recoveryGain.toFixed(2) + '% gain required</strong> to break even');
    } else if (curPDECMode === 'apply') {
      deriv.push('1. Retention Factor: 1 &minus; (' + pctDecrease.toFixed(2) + '% &divide; 100) = <strong>' + mult.toFixed(4) + '&times;</strong>');
      deriv.push('2. Reduced Price: $' + v1.toFixed(2) + ' &times; ' + mult.toFixed(4) + ' = <strong>$' + v2.toFixed(2) + ' checkout price</strong>');
      deriv.push('3. Total Discount Saved: $' + v1.toFixed(2) + ' &minus; $' + v2.toFixed(2) + ' = <strong>$' + absDiff.toFixed(2) + '</strong>');
    } else {
      deriv.push('1. Sequential Multiplier: (1 &minus; ' + (inp2 / 100).toFixed(2) + ') &times; (1 &minus; ' + ((parseFloat(document.getElementById('pdec-stacked-pct').value) || 0) / 100).toFixed(2) + ') = <strong>' + mult.toFixed(4) + '&times;</strong>');
      deriv.push('2. True Combined Discount: (1 &minus; ' + mult.toFixed(4) + ') &times; 100% = <strong>' + pctDecrease.toFixed(2) + '% effective savings</strong> (Notice: Not ' + (inp2 + (parseFloat(document.getElementById('pdec-stacked-pct').value) || 0)) + '%)');
      deriv.push('3. Final Sale Total: $' + v1.toFixed(2) + ' &times; ' + mult.toFixed(4) + ' = <strong>$' + v2.toFixed(2) + '</strong>');
    }
    document.getElementById('pdec-derivations').innerHTML = deriv.join('<br>');
  }

  function renderPDECVisual(v1, v2) {
    var c = document.getElementById('pdec-svg-container');
    if (!c) return;

    var w = c.clientWidth || 600;
    var h = 75;
    var maxVal = Math.max(1, Math.abs(v1), Math.abs(v2));

    var barH = 18;
    var y1 = 10, y2 = 38;

    function getW(v) {
      return Math.max(2, Math.min(w - 130, (Math.abs(v) / maxVal) * (w - 130)));
    }

    var w1 = getW(v1);
    var w2 = getW(v2);

    var svg = '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" style="display:block;">';

    // Original Bar (V1)
    svg += '<text x="0" y="' + (y1 + 14) + '" fill="var(--text-muted)" font-family="var(--mono)" font-size="11">Initial (V1):</text>';
    svg += '<rect x="90" y="' + y1 + '" width="' + (w - 110) + '" height="' + barH + '" rx="3" fill="#334155" />';
    svg += '<rect x="90" y="' + y1 + '" width="' + w1 + '" height="' + barH + '" rx="3" fill="#64748b" />';
    svg += '<text x="' + (95 + w1) + '" y="' + (y1 + 14) + '" fill="var(--fg)" font-family="var(--mono)" font-size="11">$' + v1.toFixed(1) + '</text>';

    // Reduced Bar (V2)
    svg += '<text x="0" y="' + (y2 + 14) + '" fill="var(--text-muted)" font-family="var(--mono)" font-size="11">Reduced (V2):</text>';
    svg += '<rect x="90" y="' + y2 + '" width="' + (w - 110) + '" height="' + barH + '" rx="3" fill="#334155" />';
    svg += '<rect x="90" y="' + y2 + '" width="' + w2 + '" height="' + barH + '" rx="3" fill="#ef4444" />';
    svg += '<text x="' + (95 + w2) + '" y="' + (y2 + 14) + '" fill="#ef4444" font-family="var(--mono)" font-size="11" font-weight="bold">$' + v2.toFixed(1) + '</text>';

    svg += '</svg>';
    c.innerHTML = svg;
  }

  function copyPDECReport(btn) {
    var pct = document.getElementById('card-pdec-pct').textContent;
    var diff = document.getElementById('card-pdec-diff').textContent;
    var mult = document.getElementById('card-pdec-mult').textContent;
    var rec = document.getElementById('card-pdec-recovery').textContent;
    var v1 = document.getElementById('pdec-v1').value;
    var v2 = document.getElementById('pdec-v2').value;

    var lines = [
      '========================================',
      '     PERCENTAGE DECREASE REDUCTION REPORT',
      '========================================',
      'Initial Base (V1)    : $' + v1,
      'Final Reduced (V2)   : $' + v2,
      '----------------------------------------',
      'Percentage Decrease  : ' + pct,
      'Absolute Savings     : ' + diff,
      'Remaining Factor     : ' + mult,
      'Break-Even Recovery  : ' + rec + ' gain needed',
      '========================================',
      'Source: Digital Tools Shed (https://digitaltoolsshed.com/math/percentage-decrease-calculator.html)'
    ];

    navigator.clipboard.writeText(lines.join('\n')).then(function() {
      var orig = btn.innerHTML;
      btn.innerHTML = '✅ Copied Reduction Report!';
      btn.style.borderColor = '#10b981';
      setTimeout(function() {
        btn.innerHTML = orig;
        btn.style.borderColor = '';
      }, 2000);
    });
  }

  window.addEventListener('resize', calcPDEC);
  document.addEventListener('DOMContentLoaded', calcPDEC);
  calcPDEC();
</script>
`
  },
    {
      slug: 'standard-deviation-calculator',
      title: 'Standard Deviation Calculator (Sample & Population) with Step-by-Step Solution',
      metaDesc: 'Calculate sample (s) and population (σ) standard deviation, variance, mean, standard error, confidence intervals, quartiles, and outliers with step-by-step math.',
      category: 'Math & Statistics',
      faq: [
        { q: 'What is the difference between sample standard deviation (s) and population standard deviation (σ)?', a: 'Sample standard deviation (s) is used when your data represents a sample (subset) drawn from a larger population. It divides the sum of squared deviations by n - 1 (Bessel\'s correction) to provide an unbiased estimate of the true population variance. Population standard deviation (σ) is used when your dataset contains every single member of the population (a complete census) and divides by N.' },
        { q: 'Why does Bessel\'s correction divide by n - 1 instead of n?', a: 'When calculating sample variance, you calculate deviations around the sample mean x̄, not the true unknown population mean μ. The sample observations naturally cluster closer to their own sample mean than to μ. Consequently, dividing by n systematically underestimates true variability. Dividing by n - 1 restores degrees of freedom and mathematically unbiases the variance estimator.' },
        { q: 'What is the difference between Standard Deviation (SD) and Standard Error (SE)?', a: 'Standard deviation (SD) measures the variability and dispersion among individual data points within a dataset. Standard error of the mean (SE = s / √n) measures the precision of the sample mean as an estimate of the true population mean. As sample size n grows, SD remains roughly constant (reflecting the population spread), while SE shrinks toward zero.' },
        { q: 'What is the 68-95-99.7 Empirical Rule?', a: 'For any dataset following a normal (Gaussian) bell-curve distribution: approximately 68.27% of observations fall within ±1 standard deviation of the mean, 95.45% fall within ±2 standard deviations, and 99.73% fall within ±3 standard deviations. For non-normal or skewed distributions, Chebyshev\'s inequality guarantees at least 1 - 1/k² of values lie within k standard deviations (e.g. at least 75% within ±2 SD).' },
        { q: 'How does Tukey\'s method detect statistical outliers?', a: 'Tukey\'s method uses the Interquartile Range (IQR = Q3 - Q1). Lower Inner Fence is Q1 - 1.5 × IQR and Upper Inner Fence is Q3 + 1.5 × IQR. Any data point outside these fences is flagged as a statistical outlier. Values beyond 3 × IQR are classified as extreme outliers.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Standard Deviation
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Standard Deviation Calculator (Sample &amp; Population)</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Calculate sample standard deviation ($s$), population standard deviation ($\sigma$), variance, mean, standard error, confidence intervals, quartiles, and statistical outliers with complete step-by-step worked deviations.
          </p>

          <div class="tool-box">
            <!-- Presets and Input Textarea -->
            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.5rem;">
                <label class="field-label" style="margin: 0;">Enter Numbers (Comma, Space, Tab, or Newline Separated)</label>
                <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                  <button type="button" class="btn-sec" onclick="setSDPreset('exam')" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;">Exam Scores</button>
                  <button type="button" class="btn-sec" onclick="setSDPreset('returns')" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;">Daily Returns (%)</button>
                  <button type="button" class="btn-sec" onclick="setSDPreset('heights')" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;">Heights (cm)</button>
                  <button type="button" class="btn-sec" onclick="setSDPreset('tolerances')" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;">Tolerance (mm)</button>
                  <button type="button" class="btn-sec" onclick="setSDPreset('outliers')" style="padding: 0.25rem 0.5rem; font-size: 0.72rem; border-color: #f59e0b; color: #f59e0b;">Outlier Test</button>
                </div>
              </div>
              <textarea id="sd-data" class="code-input" rows="3" oninput="calcSD()" style="font-size: 1.05rem; line-height: 1.5;">10, 12, 23, 23, 16, 23, 21, 16</textarea>
            </div>

            <!-- Calculation Mode Toggle -->
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; background: var(--surface-alt); padding: 0.6rem 1rem; border-radius: 6px; border: 1px solid var(--border);">
              <span style="font-family: var(--mono); font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Standard Deviation Mode:</span>
              <label style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.35rem; cursor: pointer; color: var(--fg);">
                <input type="radio" name="sd-mode" value="sample" checked onchange="calcSD()" /> Sample ($s$, $n - 1$ Bessel\'s Correction)
              </label>
              <label style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.35rem; cursor: pointer; color: var(--fg);">
                <input type="radio" name="sd-mode" value="population" onchange="calcSD()" /> Population ($\sigma$, Divisor $N$)
              </label>
              <label style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.35rem; cursor: pointer; color: var(--fg);">
                <input type="radio" name="sd-mode" value="both" onchange="calcSD()" /> Show Both
              </label>
            </div>

            <!-- Hero Metrics Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Sample Std Deviation (s)</div>
                <div id="sd-s" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">5.2372</div>
                <div id="sd-s-var" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Variance (s²): 27.4286</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Population Std Dev (σ)</div>
                <div id="sd-p" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">4.8990</div>
                <div id="sd-p-var" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Variance (σ²): 24.0000</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Arithmetic Mean (x̄)</div>
                <div id="sd-mean" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: var(--fg); margin: 0.25rem 0;">18.00</div>
                <div id="sd-count" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Count (N): 8 | Sum: 144</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Std Error of Mean (SE)</div>
                <div id="sd-se" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #8b5cf6; margin: 0.25rem 0;">1.8516</div>
                <div id="sd-ci" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">95% CI: [14.37, 21.63]</div>
              </div>
            </div>

            <!-- Deep Statistical Summary Grid (10 Metrics) -->
            <div style="margin-top: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.75rem; font-weight: 600;">
                📊 Comprehensive Statistical Distribution Metrics:
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.82rem;">
                <div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Median (Q2 / 50%)</div>
                  <strong id="sd-median" style="color: var(--fg); font-size: 1.05rem;">18.50</strong>
                </div>
                <div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Mode(s)</div>
                  <strong id="sd-mode" style="color: #3b82f6; font-size: 1.05rem;">23 (count: 3)</strong>
                </div>
                <div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Min / Max / Range</div>
                  <strong id="sd-range" style="color: var(--fg); font-size: 0.95rem;">10 – 23 (13)</strong>
                </div>
                <div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Quartiles (Q1 &bull; Q3)</div>
                  <strong id="sd-quartiles" style="color: var(--fg); font-size: 0.95rem;">13.00 &bull; 23.00</strong>
                </div>
                <div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Interquartile Range (IQR)</div>
                  <strong id="sd-iqr" style="color: #10b981; font-size: 1.05rem;">10.00</strong>
                </div>
                <div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Sum of Squares (SS)</div>
                  <strong id="sd-ss" style="color: var(--fg); font-size: 1.05rem;">192.00</strong>
                </div>
                <div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Coeff of Variation (CV)</div>
                  <strong id="sd-cv" style="color: var(--fg); font-size: 1.05rem;">29.10%</strong>
                </div>
                <div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Pearson Skewness</div>
                  <strong id="sd-skew" style="color: var(--fg); font-size: 1.05rem;">-0.29 (Slight Left)</strong>
                </div>
                <div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Tukey Outliers</div>
                  <strong id="sd-outliers" style="color: #10b981; font-size: 0.85rem;">None Detected</strong>
                </div>
                <div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Geometric / Harmonic</div>
                  <strong id="sd-means-other" style="color: var(--fg); font-size: 0.85rem;">17.28 &bull; 16.54</strong>
                </div>
              </div>
            </div>

            <!-- Interactive Frequency Histogram & Bell Curve (Pure SVG) -->
            <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; color: var(--fg);">
                  📈 Frequency Histogram &amp; Normal Distribution Bell Curve:
                </div>
                <div style="display: flex; gap: 0.75rem; font-family: var(--mono); font-size: 0.72rem;">
                  <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="display: inline-block; width: 10px; height: 10px; background: #3b82f6; border-radius: 2px;"></span> Sample Frequency</span>
                  <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="display: inline-block; width: 12px; height: 2px; background: #10b981;"></span> Normal Curve</span>
                  <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="display: inline-block; width: 12px; height: 2px; background: #f59e0b; border-bottom: 1px dashed #f59e0b;"></span> Mean (x̄)</span>
                </div>
              </div>
              <div id="sd-histogram-container" style="width: 100%; height: 220px; position: relative;">
                <svg id="sd-svg" width="100%" height="220" style="display: block; overflow: visible;"></svg>
              </div>
              <!-- Box & Whisker Plot (Pure SVG) -->
              <div style="margin-top: 1rem; border-top: 1px dashed var(--border); padding-top: 0.75rem;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">
                  📦 Box and Whisker Plot (Min, Q1, Median, Q3, Max):
                </div>
                <svg id="sd-boxplot-svg" width="100%" height="55" style="display: block; overflow: visible;"></svg>
              </div>
            </div>

            <!-- Step-by-Step Interactive Deviation Table -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; color: var(--fg);">
                  🔢 Step-by-Step Deviation Work Table:
                </div>
                <span id="sd-table-count" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">8 observations</span>
              </div>
              <div style="overflow-x: auto; max-height: 280px; overflow-y: auto;">
                <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; text-align: right;">
                  <thead style="position: sticky; top: 0; background: var(--surface-alt); z-index: 1;">
                    <tr style="border-bottom: 1px solid var(--border);">
                      <th style="padding: 0.4rem 0.6rem; text-align: center;">i</th>
                      <th style="padding: 0.4rem 0.6rem;">Data Point (x<sub>i</sub>)</th>
                      <th style="padding: 0.4rem 0.6rem;">Deviation (x<sub>i</sub> - x̄)</th>
                      <th style="padding: 0.4rem 0.6rem;">Squared Deviation (x<sub>i</sub> - x̄)²</th>
                    </tr>
                  </thead>
                  <tbody id="sd-table-body">
                    <!-- Populated dynamically -->
                  </tbody>
                  <tfoot style="position: sticky; bottom: 0; background: var(--surface-alt); font-weight: bold; border-top: 2px solid var(--border);">
                    <tr id="sd-table-foot">
                      <td style="padding: 0.5rem 0.6rem; text-align: center;">&Sigma;</td>
                      <td id="sd-foot-sum" style="padding: 0.5rem 0.6rem; color: var(--fg);">144.00</td>
                      <td id="sd-foot-dev" style="padding: 0.5rem 0.6rem; color: var(--text-muted);">0.00</td>
                      <td id="sd-foot-ss" style="padding: 0.5rem 0.6rem; color: #3b82f6;">192.00</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Copy Button -->
            <button type="button" id="btnCopySD" onclick="copySDSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Complete Statistical Summary &amp; Confidence Intervals
            </button>
          </div>

          <!-- Step-by-Step Worked Statistical Derivations -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Standard Deviation Derivation (Bessel\'s Correction)</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">NIST Engineering Statistics Standard</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Standard deviation quantifies the dispersion or spread of data values around the central arithmetic mean:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 1: Compute Arithmetic Sample Mean (x̄)</strong>
                <div id="sd-step-1" style="color: #3b82f6; margin-top: 0.25rem;">
                  x̄ = (&Sigma; x<sub>i</sub>) / n = 144 / 8 = <strong>18.00</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 2: Sum of Squared Deviations (SS)</strong>
                <div id="sd-step-2" style="color: var(--text-muted); margin-top: 0.25rem;">
                  SS = &Sigma; (x<sub>i</sub> - x̄)<sup>2</sup> = (10 - 18)<sup>2</sup> + (12 - 18)<sup>2</sup> + ... = <strong>192.00</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #3b82f6;">Step 3: Sample Variance vs Population Variance</strong>
                <div id="sd-step-3" style="color: var(--text-muted); margin-top: 0.25rem;">
                  Sample Variance s<sup>2</sup> = SS / (n - 1) = 192 / 7 = <strong>27.4286</strong> (Unbiased Bessel\'s Correction)<br>
                  Population Variance &sigma;<sup>2</sup> = SS / N = 192 / 8 = <strong>24.0000</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981; font-weight: 700;">Step 4: Standard Deviation (Square Root Extraction)</strong>
                <div id="sd-step-4" style="color: #10b981; margin-top: 0.25rem;">
                  Sample s = &radic;27.4286 = <strong>5.2372</strong> &bull; Population &sigma; = &radic;24.0000 = <strong>4.8990</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #8b5cf6;">Step 5: Standard Error of the Mean (SE) &amp; 95% Confidence Interval</strong>
                <div id="sd-step-5" style="color: var(--text-muted); margin-top: 0.25rem;">
                  SE = s / &radic;n = 5.2372 / &radic;8 = <strong>1.8516</strong><br>
                  95% Confidence Interval: [18.00 &plusmn; 1.96 &times; 1.8516] = <strong>[14.37, 21.63]</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Statistical Pitfalls -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Statistical Pitfalls &amp; Bessel\'s Bias</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Bessel\'s Correction Trap:</strong> When analyzing a subset (sample) of a larger population, dividing by $N$ rather than $n - 1$ produces a mathematically biased underestimate of variance. This occurs because the sample mean $\bar{x}$ is calculated from the sample itself, naturally lying closer to the sample observations than the true unknown population mean $\mu$. Always use $n - 1$ for samples.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Standard Deviation vs Standard Error Confusion:</strong> Standard deviation ($s$) measures the dispersion of individual observations. Standard error ($\text{SE} = s / \sqrt{n}$) measures the precision of your sample mean. Confusing these leads to misleading scientific claims—increasing sample size makes SE smaller, but does NOT reduce the true standard deviation of the population.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Outlier Distortion Vulnerability:</strong> Because deviations are squared before summing, standard deviation is extraordinarily sensitive to outliers. A single extreme observation (e.g. data entry error or fat-tailed market crash) will artificially balloon $s$. For skewed or non-Gaussian data, report the Interquartile Range (IQR) or Median Absolute Deviation (MAD).</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The 68-95-99.7 Empirical Rule Limitation:</strong> The rule stating that 68% of data falls within $\pm 1s$ and 95% within $\pm 2s$ is <em>only valid for normal (Gaussian) bell-curve distributions</em>. For multimodal or heavily skewed distributions (such as wealth or website latency), Chebyshev\'s Inequality ($\ge 75\%$ within $\pm 2s$) is the only mathematically guaranteed boundary.</li>
            </ul>
          </div>
        </div>

        <script>
          window.setSDPreset = function(type) {
            var area = document.getElementById('sd-data');
            if (type === 'exam') area.value = '72, 85, 91, 64, 78, 88, 95, 82, 79, 89';
            if (type === 'returns') area.value = '1.2, -0.8, 2.1, -1.5, 0.4, -0.2, 1.8, -2.4, 0.9';
            if (type === 'heights') area.value = '165, 172, 178, 181, 169, 175, 188, 162, 174';
            if (type === 'tolerances') area.value = '10.02, 9.98, 10.05, 9.99, 10.01, 10.04, 9.97, 10.00';
            if (type === 'outliers') area.value = '14, 15, 16, 15, 17, 14, 16, 15, 85';
            calcSD();
          };

          function calcSD() {
            var text = document.getElementById('sd-data').value;
            var nums = text.split(/[,\s\t\n]+/).map(parseFloat).filter(function(n) { return !isNaN(n); });

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

            // Sort for median and quartiles
            var sorted = nums.slice().sort(function(a, b) { return a - b; });

            // Median
            var median = 0;
            if (n % 2 === 1) {
              median = sorted[Math.floor(n / 2)];
            } else {
              median = (sorted[(n / 2) - 1] + sorted[n / 2]) / 2;
            }

            // Quartiles (Type 7 / standard interpolation)
            function getPercentile(arr, p) {
              if (arr.length === 1) return arr[0];
              var idx = (arr.length - 1) * p;
              var lo = Math.floor(idx);
              var hi = Math.ceil(idx);
              var weight = idx - lo;
              return arr[lo] + (weight * (arr[hi] - arr[lo]));
            }
            var q1 = getPercentile(sorted, 0.25);
            var q3 = getPercentile(sorted, 0.75);
            var iqr = q3 - q1;
            var lowerFence = q1 - (1.5 * iqr);
            var upperFence = q3 + (1.5 * iqr);
            var outliers = sorted.filter(function(x) { return x < lowerFence || x > upperFence; });

            // Mode
            var freq = {};
            var maxFreq = 0;
            sorted.forEach(function(x) {
              freq[x] = (freq[x] || 0) + 1;
              if (freq[x] > maxFreq) maxFreq = freq[x];
            });
            var modes = [];
            if (maxFreq > 1) {
              for (var k in freq) {
                if (freq[k] === maxFreq) modes.push(k);
              }
            }

            // Sum of squared deviations
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

            var minVal = sorted[0];
            var maxVal = sorted[sorted.length - 1];
            var rangeVal = maxVal - minVal;

            var cv = mean !== 0 ? ((sampleSD / Math.abs(mean)) * 100) : 0;
            var skew = sampleSD > 0 ? (3 * (mean - median) / sampleSD) : 0;
            var skewDesc = Math.abs(skew) < 0.2 ? 'Approx Symmetric' : (skew > 0 ? 'Right / Pos Skew' : 'Left / Neg Skew');

            // Geometric and Harmonic (if positive)
            var allPos = nums.every(function(x) { return x > 0; });
            var geoMeanStr = '-';
            var harMeanStr = '-';
            if (allPos) {
              var sumLn = nums.reduce(function(a, b) { return a + Math.log(b); }, 0);
              var gm = Math.exp(sumLn / n);
              var sumRecip = nums.reduce(function(a, b) { return a + (1 / b); }, 0);
              var hm = n / sumRecip;
              geoMeanStr = gm.toFixed(2);
              harMeanStr = hm.toFixed(2);
            }

            // Update UI Elements
            document.getElementById('sd-s').textContent = sampleSD.toFixed(4);
            document.getElementById('sd-s-var').textContent = 'Variance (s²): ' + sampleVar.toFixed(4);

            document.getElementById('sd-p').textContent = popSD.toFixed(4);
            document.getElementById('sd-p-var').textContent = 'Variance (σ²): ' + popVar.toFixed(4);

            document.getElementById('sd-mean').textContent = mean.toFixed(2);
            document.getElementById('sd-count').textContent = 'Count (N): ' + n + ' | Sum: ' + sum.toLocaleString('en-US', { maximumFractionDigits: 2 });

            document.getElementById('sd-se').textContent = se.toFixed(4);
            document.getElementById('sd-ci').textContent = '95% CI: [' + ciLow.toFixed(2) + ', ' + ciHigh.toFixed(2) + ']';

            document.getElementById('sd-median').textContent = median.toFixed(2);
            document.getElementById('sd-mode').textContent = modes.length > 0 ? (modes.join(', ') + ' (n=' + maxFreq + ')') : 'No unique mode';
            document.getElementById('sd-range').textContent = minVal.toFixed(2) + ' – ' + maxVal.toFixed(2) + ' (' + rangeVal.toFixed(2) + ')';
            document.getElementById('sd-quartiles').textContent = q1.toFixed(2) + ' • ' + q3.toFixed(2);
            document.getElementById('sd-iqr').textContent = iqr.toFixed(2);
            document.getElementById('sd-ss').textContent = sumSqDiff.toFixed(2);
            document.getElementById('sd-cv').textContent = cv.toFixed(2) + '%';
            document.getElementById('sd-skew').textContent = skew.toFixed(2) + ' (' + skewDesc + ')';
            document.getElementById('sd-outliers').textContent = outliers.length > 0 ? (outliers.join(', ') + ' (' + outliers.length + ')') : 'None Detected';
            document.getElementById('sd-outliers').style.color = outliers.length > 0 ? '#ef4444' : '#10b981';
            document.getElementById('sd-means-other').textContent = geoMeanStr + ' • ' + harMeanStr;

            // Render Work Table
            var tbody = document.getElementById('sd-table-body');
            var tableRows = '';
            var sumDevCheck = 0;
            var maxDisplayRows = Math.min(n, 50);

            for (var i = 0; i < maxDisplayRows; i++) {
              var val = nums[i];
              var dev = val - mean;
              sumDevCheck += dev;
              var sq = dev * dev;
              tableRows += '<tr style="border-bottom: 1px solid var(--border);">' +
                '<td style="padding: 0.35rem 0.6rem; text-align: center; color: var(--text-muted);">' + (i + 1) + '</td>' +
                '<td style="padding: 0.35rem 0.6rem; font-weight: bold;">' + val.toFixed(2) + '</td>' +
                '<td style="padding: 0.35rem 0.6rem; color: ' + (dev >= 0 ? '#10b981' : '#f59e0b') + ';">' + (dev >= 0 ? '+' : '') + dev.toFixed(2) + '</td>' +
                '<td style="padding: 0.35rem 0.6rem; color: #3b82f6;">' + sq.toFixed(4) + '</td>' +
                '</tr>';
            }
            if (n > 50) {
              tableRows += '<tr><td colspan="4" style="text-align: center; padding: 0.5rem; color: var(--text-muted);">... (' + (n - 50) + ' more rows calculated in summary totals) ...</td></tr>';
            }
            tbody.innerHTML = tableRows;
            document.getElementById('sd-table-count').textContent = n + ' observations';
            document.getElementById('sd-foot-sum').textContent = sum.toFixed(2);
            document.getElementById('sd-foot-dev').textContent = Math.abs(sumDevCheck) < 0.0001 ? '0.00' : sumDevCheck.toFixed(2);
            document.getElementById('sd-foot-ss').textContent = sumSqDiff.toFixed(2);

            // Update Step Derivations
            document.getElementById('sd-step-1').innerHTML = 'x̄ = (&Sigma; x<sub>i</sub>) / n = ' + sum.toFixed(2) + ' / ' + n + ' = <strong>' + mean.toFixed(4) + '</strong>';
            document.getElementById('sd-step-2').innerHTML = 'SS = &Sigma; (x<sub>i</sub> - x̄)<sup>2</sup> = <strong>' + sumSqDiff.toFixed(4) + '</strong>';
            document.getElementById('sd-step-3').innerHTML = 'Sample Variance s<sup>2</sup> = SS / (n - 1) = ' + sumSqDiff.toFixed(2) + ' / ' + (n - 1) + ' = <strong>' + sampleVar.toFixed(4) + '</strong><br>' +
              'Population Variance &sigma;<sup>2</sup> = SS / N = ' + sumSqDiff.toFixed(2) + ' / ' + n + ' = <strong>' + popVar.toFixed(4) + '</strong>';
            document.getElementById('sd-step-4').innerHTML = 'Sample s = &radic;' + sampleVar.toFixed(4) + ' = <strong>' + sampleSD.toFixed(4) + '</strong> &bull; Population &sigma; = &radic;' + popVar.toFixed(4) + ' = <strong>' + popSD.toFixed(4) + '</strong>';
            document.getElementById('sd-step-5').innerHTML = 'SE = s / &radic;n = ' + sampleSD.toFixed(4) + ' / &radic;' + n + ' = <strong>' + se.toFixed(4) + '</strong><br>' +
              '95% CI: [' + mean.toFixed(2) + ' &plusmn; 1.96 &times; ' + se.toFixed(4) + '] = <strong>[' + ciLow.toFixed(2) + ', ' + ciHigh.toFixed(2) + ']</strong>';

            // Draw SVG Histogram and Bell Curve
            drawSDHistogram(nums, minVal, maxVal, mean, sampleSD);

            // Draw SVG Box Plot
            drawSDBoxPlot(minVal, q1, median, q3, maxVal, outliers);
          }

          function drawSDHistogram(nums, minVal, maxVal, mean, sd) {
            var svg = document.getElementById('sd-svg');
            if (!svg) return;
            var w = svg.clientWidth || 800;
            var h = 220;
            var padL = 35;
            var padR = 25;
            var padT = 20;
            var padB = 30;
            var plotW = w - padL - padR;
            var plotH = h - padT - padB;

            var numBins = Math.max(5, Math.min(10, Math.ceil(Math.sqrt(nums.length))));
            var binWidth = (maxVal - minVal) / numBins;
            if (binWidth === 0) binWidth = 1;

            var bins = new Array(numBins).fill(0);
            nums.forEach(function(x) {
              var idx = Math.floor((x - minVal) / binWidth);
              if (idx >= numBins) idx = numBins - 1;
              bins[idx]++;
            });
            var maxFreq = Math.max.apply(null, bins.concat([1]));

            var svgHtml = '';
            var barW = plotW / numBins;

            // Render histogram bars
            for (var b = 0; b < numBins; b++) {
              var count = bins[b];
              var barH = (count / maxFreq) * plotH;
              var bx = padL + (b * barW);
              var by = padT + (plotH - barH);
              var binStart = minVal + (b * binWidth);
              var binEnd = binStart + binWidth;

              svgHtml += '<rect x="' + (bx + 2) + '" y="' + by + '" width="' + Math.max(2, barW - 4) + '" height="' + barH + '" fill="#3b82f6" fill-opacity="0.65" stroke="#3b82f6" stroke-width="1" rx="2">';
              svgHtml += '<title>Range [' + binStart.toFixed(1) + ' - ' + binEnd.toFixed(1) + ']: ' + count + ' observations</title></rect>';

              if (count > 0) {
                svgHtml += '<text x="' + (bx + (barW / 2)) + '" y="' + (by - 4) + '" font-family="monospace" font-size="10" fill="var(--fg)" text-anchor="middle">' + count + '</text>';
              }
              // X axis label
              svgHtml += '<text x="' + (bx + (barW / 2)) + '" y="' + (h - 8) + '" font-family="monospace" font-size="9" fill="var(--text-muted)" text-anchor="middle">' + binStart.toFixed(1) + '</text>';
            }

            // Render Normal Distribution Curve (Gaussian PDF)
            if (sd > 0) {
              var pathPoints = [];
              var steps = 60;
              for (var s = 0; s <= steps; s++) {
                var curXVal = minVal + (s * (maxVal - minVal) / steps);
                var z = (curXVal - mean) / sd;
                var pdf = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
                // Scale pdf so peak roughly matches highest bar
                var pdfPeak = 1 / (sd * Math.sqrt(2 * Math.PI));
                var scaledY = padT + plotH - ((pdf / pdfPeak) * plotH * 0.9);
                var plotX = padL + ((curXVal - minVal) / (maxVal - minVal || 1)) * plotW;
                pathPoints.push((s === 0 ? 'M' : 'L') + plotX.toFixed(1) + ',' + scaledY.toFixed(1));
              }
              svgHtml += '<path d="' + pathPoints.join(' ') + '" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" />';
            }

            // Mean vertical dashed line
            if (maxVal > minVal) {
              var meanX = padL + ((mean - minVal) / (maxVal - minVal)) * plotW;
              svgHtml += '<line x1="' + meanX.toFixed(1) + '" y1="' + padT + '" x2="' + meanX.toFixed(1) + '" y2="' + (padT + plotH) + '" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" />';
              svgHtml += '<text x="' + meanX.toFixed(1) + '" y="' + (padT - 5) + '" font-family="monospace" font-size="10" font-weight="bold" fill="#f59e0b" text-anchor="middle">x̄=' + mean.toFixed(1) + '</text>';
            }

            svg.innerHTML = svgHtml;
          }

          function drawSDBoxPlot(minVal, q1, med, q3, maxVal, outliers) {
            var svg = document.getElementById('sd-boxplot-svg');
            if (!svg) return;
            var w = svg.clientWidth || 800;
            var h = 55;
            var padL = 35;
            var padR = 25;
            var plotW = w - padL - padR;
            var range = maxVal - minVal || 1;

            function valToX(v) {
              return padL + (((v - minVal) / range) * plotW);
            }

            var xMin = valToX(minVal);
            var xQ1 = valToX(q1);
            var xMed = valToX(med);
            var xQ3 = valToX(q3);
            var xMax = valToX(maxVal);

            var boxY = 12;
            var boxH = 24;
            var midY = boxY + (boxH / 2);

            var svgHtml = '';
            // Whiskers
            svgHtml += '<line x1="' + xMin.toFixed(1) + '" y1="' + midY + '" x2="' + xQ1.toFixed(1) + '" y2="' + midY + '" stroke="var(--fg)" stroke-width="1.5" stroke-dasharray="2,2" />';
            svgHtml += '<line x1="' + xQ3.toFixed(1) + '" y1="' + midY + '" x2="' + xMax.toFixed(1) + '" y2="' + midY + '" stroke="var(--fg)" stroke-width="1.5" stroke-dasharray="2,2" />';
            // Whisker caps
            svgHtml += '<line x1="' + xMin.toFixed(1) + '" y1="' + (midY - 6) + '" x2="' + xMin.toFixed(1) + '" y2="' + (midY + 6) + '" stroke="var(--fg)" stroke-width="2" />';
            svgHtml += '<line x1="' + xMax.toFixed(1) + '" y1="' + (midY - 6) + '" x2="' + xMax.toFixed(1) + '" y2="' + (midY + 6) + '" stroke="var(--fg)" stroke-width="2" />';

            // IQR Box
            var boxW = Math.max(2, xQ3 - xQ1);
            svgHtml += '<rect x="' + xQ1.toFixed(1) + '" y="' + boxY + '" width="' + boxW.toFixed(1) + '" height="' + boxH + '" fill="var(--surface-alt)" stroke="#3b82f6" stroke-width="2" rx="2" />';

            // Median line
            svgHtml += '<line x1="' + xMed.toFixed(1) + '" y1="' + boxY + '" x2="' + xMed.toFixed(1) + '" y2="' + (boxY + boxH) + '" stroke="#10b981" stroke-width="2.5" />';

            // Outliers as red dots
            outliers.forEach(function(out) {
              var ox = valToX(out);
              svgHtml += '<circle cx="' + ox.toFixed(1) + '" cy="' + midY + '" r="4" fill="#ef4444" stroke="var(--bg)" stroke-width="1"><title>Outlier: ' + out + '</title></circle>';
            });

            // Labels below
            svgHtml += '<text x="' + xMin.toFixed(1) + '" y="' + (h - 2) + '" font-family="monospace" font-size="9" fill="var(--text-muted)" text-anchor="middle">' + minVal.toFixed(1) + '</text>';
            svgHtml += '<text x="' + xMed.toFixed(1) + '" y="' + (h - 2) + '" font-family="monospace" font-size="9" fill="#10b981" font-weight="bold" text-anchor="middle">' + med.toFixed(1) + '</text>';
            svgHtml += '<text x="' + xMax.toFixed(1) + '" y="' + (h - 2) + '" font-family="monospace" font-size="9" fill="var(--text-muted)" text-anchor="middle">' + maxVal.toFixed(1) + '</text>';

            svg.innerHTML = svgHtml;
          }

          window.copySDSummary = function() {
            var s = document.getElementById('sd-s').textContent;
            var p = document.getElementById('sd-p').textContent;
            var mean = document.getElementById('sd-mean').textContent;
            var count = document.getElementById('sd-count').textContent;
            var se = document.getElementById('sd-se').textContent;
            var ci = document.getElementById('sd-ci').textContent;
            var median = document.getElementById('sd-median').textContent;
            var iqr = document.getElementById('sd-iqr').textContent;
            var outliers = document.getElementById('sd-outliers').textContent;

            var text = [
              '=== STATISTICAL DESCRIPTIVE SUMMARY ===',
              'Sample Standard Deviation (s): ' + s,
              'Population Standard Deviation (σ): ' + p,
              'Arithmetic Mean (x̄): ' + mean,
              count,
              'Median: ' + median + ' | IQR: ' + iqr,
              'Standard Error of the Mean (SE): ' + se,
              ci,
              'Tukey Outliers: ' + outliers,
              '---------------------------------------',
              'Standard: NIST Engineering Statistics Handbook',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/standard-deviation-calculator'
            ].join('\n');

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
  "slug": "markup-margin-calculator",
  "title": "Markup vs Margin Calculator — Profit, COGS & E-Commerce Fees",
  "metaDesc": "Free commercial markup and margin calculator. Converts markup % to gross margin %, factors Stripe/Amazon marketplace fees, shipping costs, and generates interactive SVG profit waterfalls.",
  "category": "Math & Finance",
  "faq": [
    {
      "q": "What is the exact mathematical difference between markup and margin?",
      "a": "Markup is the percentage added to the cost of a product to determine its selling price: Markup = (Profit / Cost) × 100%. Gross margin is the percentage of the final selling price that is retained as profit: Margin = (Profit / Revenue) × 100%. For example, an item costing $50 and sold for $100 has a 100% markup on cost, but a 50% gross margin on revenue."
    },
    {
      "q": "How do you convert a target gross margin into a required markup?",
      "a": "To convert a desired gross margin into markup, divide the margin decimal by (1 minus the margin decimal): Markup = Margin / (1 - Margin). If your retail business targets a 40% gross margin, your required markup is 0.40 / (1 - 0.40) = 0.40 / 0.60 = 66.7% markup on cost."
    },
    {
      "q": "How do credit card and marketplace fees affect net profit margins?",
      "a": "Credit card payment gateways (such as Stripe or Shopify Payments) charge 2.9% + $0.30 on the gross transaction total (including sales tax and shipping charged to the buyer). Online marketplaces like Amazon or Etsy take 6.5% to 15% in referral fees. On a product with a 20% gross margin, platform fees can consume more than half of your actual net profit."
    },
    {
      "q": "What is a good gross margin for an e-commerce or retail business?",
      "a": "Healthy direct-to-consumer (DTC) e-commerce businesses generally target gross margins of 60% to 75% to absorb digital ad acquisition costs (CAC), payment fees, and returns. Retail brick-and-mortar stores typically operate at 45% to 50% gross margins (keystone pricing), while grocery stores operate on ultra-thin 20% to 25% gross margins with rapid volume turnover."
    },
    {
      "q": "How do I calculate the minimum break-even selling price for a product?",
      "a": "To calculate your break-even selling price where net profit equals exactly zero, divide the sum of your unit production cost, shipping, and fixed gateway fees by (1 minus the percentage transaction fee rate): Break-Even Price = (COGS + Shipping + Fixed Fee) / (1 - Fee Rate)."
    }
  ],
  "body": "\n<div class=\"article-container\" style=\"max-width:1050px;margin:0 auto;padding:1.5rem 1rem;\">\n  <nav style=\"font-family:var(--mono);font-size:0.8rem;margin-bottom:1.5rem;color:var(--text-muted);\">\n    <a href=\"/\">Home</a> &gt; <a href=\"/math/\">Math &amp; Finance</a> &gt; Markup vs Margin Calculator\n  </nav>\n\n  <header style=\"margin-bottom:2rem;text-align:center;\">\n    <h1 style=\"font-family:var(--serif);font-size:2.2rem;margin-bottom:0.5rem;letter-spacing:-0.02em;\">Markup vs Margin Commercial Profit Calculator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;max-width:780px;margin:0 auto;line-height:1.6;\">\n      Convert between markup and profit margin, price inventory for target returns, and factor payment gateway fees, marketplace commissions, and shipping overhead to reveal true net profit.\n    </p>\n  </header>\n\n  <div style=\"display:grid;grid-template-columns:1fr;gap:2rem;margin-bottom:2.5rem;\" class=\"calc-grid\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"23\"/><path d=\"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"/></svg>\n        Cost of Goods &amp; Pricing Strategy\n      </h2>\n\n      <!-- COST OF GOODS (COGS) -->\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"cogsCost\">Unit Cost of Goods Sold (COGS in $)</label>\n        <input type=\"number\" id=\"cogsCost\" value=\"45.00\" min=\"0.01\" step=\"1.00\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.15rem;\">\n        <span style=\"font-size:0.75rem;color:var(--text-muted);\">Direct manufacturing, supplier purchase, or inventory acquisition cost</span>\n      </div>\n\n      <!-- PRICING MODE & VALUE -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"pricingStrategyMode\">Pricing Objective Mode</label>\n          <select id=\"pricingStrategyMode\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"targetMargin\" selected>Target Gross Margin (%)</option>\n            <option value=\"targetMarkup\">Target Markup (%)</option>\n            <option value=\"fixedPrice\">Set Fixed Selling Price ($)</option>\n          </select>\n        </div>\n        <div>\n          <label id=\"lblTargetValue\" style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"targetValInput\">Target Gross Margin (%)</label>\n          <input type=\"number\" id=\"targetValInput\" value=\"50\" min=\"0\" max=\"99.9\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.15rem;\">\n        </div>\n      </div>\n\n      <!-- PLATFORM & TRANSACTION FEES -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"platformFeePreset\">Payment Gateway / Platform Fee</label>\n          <select id=\"platformFeePreset\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"0.029|0.30\" selected>Stripe / Shopify Basic (2.9% + $0.30)</option>\n            <option value=\"0.150|0.00\">Amazon Marketplace FBA (~15% Referral)</option>\n            <option value=\"0.065|0.20\">Etsy Transaction (6.5% + $0.20)</option>\n            <option value=\"0.000|0.00\">Direct B2B / Cash / Zero Fee (0%)</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"shippingCost\">Packaging &amp; Shipping Overhead ($)</label>\n          <input type=\"number\" id=\"shippingCost\" value=\"6.50\" min=\"0\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n      </div>\n    </div>\n\n    <!-- SUMMARY & OUTPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z\"/><line x1=\"7\" y1=\"7\" x2=\"7.01\" y2=\"7\"/></svg>\n            Unit Pricing &amp; Profitability Takeoff\n          </h2>\n          <button id=\"copyMarkupBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Pricing Sheet</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Recommended Retail Price</span>\n            <span id=\"sellingPriceVal\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:#3b82f6;display:block;\">$90.00</span>\n            <span id=\"sellingPriceSub\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">Gross Unit Revenue</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">True Net Realized Profit</span>\n            <span id=\"netProfitVal\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:#10b981;display:block;\">$35.59</span>\n            <span id=\"netMarginSub\" style=\"font-size:0.8rem;color:#10b981;font-weight:600;\">39.5% Net Margin (after fees)</span>\n          </div>\n        </div>\n\n        <!-- METRICS LEDGER -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Financial Ratios &amp; Deductions</div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Gross Margin (before fees):</span>\n            <strong id=\"grossMarginVal\" style=\"font-family:var(--mono);color:var(--fg);\">50.0% ($45.00)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Markup on Cost:</span>\n            <strong id=\"markupPctVal\" style=\"font-family:var(--mono);color:var(--fg);\">100.0% Markup</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Transaction &amp; Gateway Fees:</span>\n            <strong id=\"platformFeesVal\" style=\"font-family:var(--mono);color:#ef4444;\">-$2.91 (2.9% + $0.30)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Shipping &amp; Packaging:</span>\n            <strong id=\"shippingDeductVal\" style=\"font-family:var(--mono);color:var(--fg);\">-$6.50</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;\">\n            <span>Minimum Break-Even Price:</span>\n            <strong id=\"breakEvenPriceVal\" style=\"font-family:var(--mono);color:#f59e0b;\">$53.35 (0% Net Profit)</strong>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG REVENUE WATERFALL -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.5rem;\">\n      <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18M9 21V9\"/></svg>\n      Unit Revenue Waterfall: COGS vs Fees vs Net Profit\n    </h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Proportional breakdown of gross selling price allocated across production costs (slate), gateway fees (red), fulfillment (orange), and retained net profit (emerald green).\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"markupWaterfallSvg\" viewBox=\"0 0 800 180\" style=\"width:100%;height:auto;min-width:600px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Markup vs Margin Conversion &amp; Fee Factoring Formulas</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      While markup expresses profit as a percentage of <em>cost</em>, gross margin expresses profit as a percentage of <em>selling price</em>. Because selling price is always larger than cost, markup is always mathematically larger than margin:\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Markup to Margin Conversion:</strong><br>\n      \\text{Margin} = \\frac{\\text{Markup}}{1 + \\text{Markup}}, \\qquad \\text{Markup} = \\frac{\\text{Margin}}{1 - \\text{Margin}}<br>\n      \\text{Example: A 100% markup on cost equals a 50% gross margin: } \\frac{1.0}{1 + 1.0} = 0.50.<br><br>\n      <strong>2. Selling Price Derived from Target Gross Margin:</strong><br>\n      P = \\frac{C}{1 - M_{\\text{gross}}}<br><br>\n      <strong>3. Selling Price Derived from Target Markup:</strong><br>\n      P = C \\times (1 + K_{\\text{markup}})<br><br>\n      <strong>4. True Net Realized Margin with Payment &amp; Marketplace Fees:</strong><br>\n      \\text{Platform Fees} = (P \\times f_{\\text{pct}}) + f_{\\text{fixed}}<br>\n      \\text{Net Profit} = P - C - \\text{Shipping} - \\text{Platform Fees}<br>\n      \\text{Net Margin} = \\left( \\frac{\\text{Net Profit}}{P} \\right) \\times 100\\%<br><br>\n      <strong>5. Break-Even Minimum Selling Price:</strong><br>\n      P_{\\text{breakeven}} = \\frac{C + \\text{Shipping} + f_{\\text{fixed}}}{1 - f_{\\text{pct}}}\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL PRICING TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Retail &amp; E-Commerce Pricing Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">1. Confusing Markup with Gross Margin</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          If an item costs $60 and you apply a 40% markup, you sell it for $84 with $24 profit. However, $24 profit on $84 revenue is only a <strong>28.6% gross margin</strong>! If your business overhead requires a 40% margin to break even, your company will bleed cash and fail while believing it is operating profitably.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">2. Payment Gateways Charge on Gross Transaction Value</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Credit card processors (Stripe, PayPal, Square) charge their 2.9% fee on the <em>total charged to the customer</em>, including sales tax and shipping fees. If you charge $100 product + $10 shipping + $8 tax = $118 total, the processing fee is $3.72, not $2.90. On tight margins, this eats into bottom-line profit.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">3. Ignoring Return Rates and Shrinkage</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          In e-commerce apparel, average return rates hover between 20% and 30%. Between two-way shipping costs, damaged packaging, inspection labor, and restocking depreciation, a return costs 30% of original item value. Sellers pricing inventory without an actuarial return buffer see healthy paper profits vanish.\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">4. The Tiered Volume Discount Margin Cliff</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Offering a \"Buy 2 Get 1 Free\" (a 33.3% discount) or a 20% B2B volume discount requires exponential sales increases to maintain gross dollar profit. On a 40% margin product, a 20% price cut cuts dollar profit in half, requiring you to sell <strong>100% more units</strong> just to generate the same gross income!\n        </p>\n      </div>\n\n      <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;\">5. Working Capital Starvation on Wholesale Terms</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Selling wholesale to department stores or big-box retailers at a 50% discount on MSRP seems lucrative until Net 60 or Net 90 payment terms take effect. Having your cash locked in accounts receivable for 90 days while having to prepay your manufacturer for the next production run causes insolvency despite strong margins.\n        </p>\n      </div>\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      function calcMarkupMargin() {\n        var cogs = parseFloat(document.getElementById('cogsCost').value) || 0;\n        var mode = document.getElementById('pricingStrategyMode').value;\n        var targetVal = parseFloat(document.getElementById('targetValInput').value) || 0;\n        var feeParts = (document.getElementById('platformFeePreset').value || '0.029|0.30').split('|');\n        var feePct = parseFloat(feeParts[0]) || 0;\n        var feeFixed = parseFloat(feeParts[1]) || 0;\n        var shipping = parseFloat(document.getElementById('shippingCost').value) || 0;\n\n        var price = 0;\n        var grossMarginPct = 0;\n        var markupPct = 0;\n\n        if (mode === 'targetMargin') {\n          grossMarginPct = Math.min(99, Math.max(0, targetVal));\n          price = (cogs > 0 && grossMarginPct < 100) ? cogs / (1 - (grossMarginPct / 100)) : cogs;\n          markupPct = (cogs > 0) ? ((price - cogs) / cogs) * 100 : 0;\n        } else if (mode === 'targetMarkup') {\n          markupPct = Math.max(0, targetVal);\n          price = cogs * (1 + (markupPct / 100));\n          grossMarginPct = (price > 0) ? ((price - cogs) / price) * 100 : 0;\n        } else {\n          price = Math.max(0, targetVal);\n          grossMarginPct = (price > 0) ? ((price - cogs) / price) * 100 : 0;\n          markupPct = (cogs > 0) ? ((price - cogs) / cogs) * 100 : 0;\n        }\n\n        var grossProfit = Math.max(0, price - cogs);\n        var platformFeeTotal = (price * feePct) + feeFixed;\n        var netProfit = price - cogs - shipping - platformFeeTotal;\n        var netMarginPct = (price > 0) ? (netProfit / price) * 100 : 0;\n\n        var breakEven = (1 - feePct > 0) ? (cogs + shipping + feeFixed) / (1 - feePct) : 0;\n\n        // Update DOM\n        document.getElementById('sellingPriceVal').textContent = '$' + price.toFixed(2);\n        document.getElementById('sellingPriceSub').textContent = 'Gross Unit Revenue ($' + price.toFixed(2) + ')';\n        document.getElementById('netProfitVal').textContent = (netProfit >= 0 ? '$' : '-$') + Math.abs(netProfit).toFixed(2);\n        document.getElementById('netMarginSub').textContent = netMarginPct.toFixed(1) + '% Net Margin (after all fees)';\n\n        document.getElementById('grossMarginVal').textContent = grossMarginPct.toFixed(1) + '% ($' + grossProfit.toFixed(2) + ')';\n        document.getElementById('markupPctVal').textContent = markupPct.toFixed(1) + '% Markup';\n        document.getElementById('platformFeesVal').textContent = '-$' + platformFeeTotal.toFixed(2) + ' (' + (feePct * 100).toFixed(1) + '% + $' + feeFixed.toFixed(2) + ')';\n        document.getElementById('shippingDeductVal').textContent = '-$' + shipping.toFixed(2);\n        document.getElementById('breakEvenPriceVal').textContent = '$' + breakEven.toFixed(2) + ' (0% Net Profit)';\n\n        renderWaterfallSvg(price, cogs, platformFeeTotal, shipping, Math.max(0, netProfit));\n      }\n\n      function renderWaterfallSvg(price, cogs, fees, ship, profit) {\n        var svg = document.getElementById('markupWaterfallSvg');\n        if (!svg) return;\n\n        var svgHtml = '';\n        var barW = 680;\n        var total = Math.max(price, cogs + fees + ship + profit);\n        if (total <= 0) return;\n\n        var cogsW = (cogs / total) * barW;\n        var feesW = (fees / total) * barW;\n        var shipW = (ship / total) * barW;\n        var profitW = (profit / total) * barW;\n\n        var curX = 60;\n\n        // COGS segment (slate)\n        if (cogsW > 0) {\n          svgHtml += '<rect x=\"' + curX + '\" y=\"40\" width=\"' + cogsW + '\" height=\"50\" fill=\"#64748b\" rx=\"4\"/>';\n          if (cogsW > 50) svgHtml += '<text x=\"' + (curX + cogsW / 2) + '\" y=\"70\" text-anchor=\"middle\" fill=\"#ffffff\" font-size=\"12\" font-weight=\"bold\">COGS</text>';\n          curX += cogsW;\n        }\n\n        // Fees segment (red)\n        if (feesW > 0) {\n          svgHtml += '<rect x=\"' + curX + '\" y=\"40\" width=\"' + feesW + '\" height=\"50\" fill=\"#ef4444\" rx=\"4\"/>';\n          if (feesW > 35) svgHtml += '<text x=\"' + (curX + feesW / 2) + '\" y=\"70\" text-anchor=\"middle\" fill=\"#ffffff\" font-size=\"11\" font-weight=\"bold\">Fee</text>';\n          curX += feesW;\n        }\n\n        // Shipping segment (amber)\n        if (shipW > 0) {\n          svgHtml += '<rect x=\"' + curX + '\" y=\"40\" width=\"' + shipW + '\" height=\"50\" fill=\"#f59e0b\" rx=\"4\"/>';\n          if (shipW > 40) svgHtml += '<text x=\"' + (curX + shipW / 2) + '\" y=\"70\" text-anchor=\"middle\" fill=\"#ffffff\" font-size=\"11\" font-weight=\"bold\">Ship</text>';\n          curX += shipW;\n        }\n\n        // Net profit segment (emerald green)\n        if (profitW > 0) {\n          svgHtml += '<rect x=\"' + curX + '\" y=\"40\" width=\"' + profitW + '\" height=\"50\" fill=\"#10b981\" rx=\"4\"/>';\n          if (profitW > 50) svgHtml += '<text x=\"' + (curX + profitW / 2) + '\" y=\"70\" text-anchor=\"middle\" fill=\"#ffffff\" font-size=\"12\" font-weight=\"bold\">Net Profit</text>';\n        }\n\n        // Legend\n        svgHtml += '<rect x=\"60\" y=\"115\" width=\"12\" height=\"12\" fill=\"#64748b\" rx=\"2\"/>';\n        svgHtml += '<text x=\"78\" y=\"125\" fill=\"var(--fg)\" font-size=\"11\">COGS ($' + cogs.toFixed(2) + ')</text>';\n\n        svgHtml += '<rect x=\"220\" y=\"115\" width=\"12\" height=\"12\" fill=\"#ef4444\" rx=\"2\"/>';\n        svgHtml += '<text x=\"238\" y=\"125\" fill=\"var(--fg)\" font-size=\"11\">Fees ($' + fees.toFixed(2) + ')</text>';\n\n        svgHtml += '<rect x=\"370\" y=\"115\" width=\"12\" height=\"12\" fill=\"#f59e0b\" rx=\"2\"/>';\n        svgHtml += '<text x=\"388\" y=\"125\" fill=\"var(--fg)\" font-size=\"11\">Shipping ($' + ship.toFixed(2) + ')</text>';\n\n        svgHtml += '<rect x=\"530\" y=\"115\" width=\"12\" height=\"12\" fill=\"#10b981\" rx=\"2\"/>';\n        svgHtml += '<text x=\"548\" y=\"125\" fill=\"var(--fg)\" font-size=\"11\">Net Profit ($' + profit.toFixed(2) + ')</text>';\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyMarkupSheet() {\n        var price = document.getElementById('sellingPriceVal').textContent;\n        var profit = document.getElementById('netProfitVal').textContent;\n        var margin = document.getElementById('grossMarginVal').textContent;\n        var markup = document.getElementById('markupPctVal').textContent;\n        var fees = document.getElementById('platformFeesVal').textContent;\n        var ship = document.getElementById('shippingDeductVal').textContent;\n        var be = document.getElementById('breakEvenPriceVal').textContent;\n        var cogs = document.getElementById('cogsCost').value;\n\n        var text = '📋 Product Pricing & Profitability Takeoff\\n' +\n          '• Unit COGS: $' + cogs + '\\n' +\n          '• Retail Selling Price: ' + price + '\\n' +\n          '• Gross Margin: ' + margin + '\\n' +\n          '• Markup on Cost: ' + markup + '\\n' +\n          '• Gateway & Marketplace Fees: ' + fees + '\\n' +\n          '• Shipping & Packaging: ' + ship + '\\n' +\n          '• True Net Profit: ' + profit + '\\n' +\n          '• Minimum Break-Even: ' + be + '\\n\\n' +\n          'Calculated at digitaltoolsshed.com/math/markup-margin-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyMarkupBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Pricing Sheet!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      document.getElementById('pricingStrategyMode').addEventListener('change', function() {\n        var m = this.value;\n        var lbl = document.getElementById('lblTargetValue');\n        var inp = document.getElementById('targetValInput');\n        if (m === 'targetMargin') {\n          lbl.textContent = 'Target Gross Margin (%)';\n          inp.value = 50;\n        } else if (m === 'targetMarkup') {\n          lbl.textContent = 'Target Markup (%)';\n          inp.value = 100;\n        } else {\n          lbl.textContent = 'Fixed Selling Price ($)';\n          inp.value = 90;\n        }\n        calcMarkupMargin();\n      });\n\n      var inputs = ['cogsCost', 'targetValInput', 'platformFeePreset', 'shippingCost'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calcMarkupMargin);\n          el.addEventListener('change', calcMarkupMargin);\n        }\n      });\n\n      document.getElementById('copyMarkupBtn').addEventListener('click', copyMarkupSheet);\n\n      calcMarkupMargin();\n    })();\n  </script>\n</div>\n"
},
    {
      slug: 'permutation-combination-calculator',
      title: 'Permutation and Combination Calculator (nPr & nCr with BigInt Precision)',
      metaDesc: 'Calculate permutations (nPr) and combinations (nCr) with exact BigInt factorials, repetition modes, step-by-step cancelation proofs, and lottery odds.',
      category: 'Math & Probability',
      faq: [
        { q: 'What is the fundamental difference between a permutation and a combination?', a: 'In permutations, order matters (AB ≠ BA). In combinations, order does NOT matter (AB = BA). For example, selecting 1st, 2nd, and 3rd place winners in a race is a permutation (nPr), whereas selecting a committee of 3 members from a group is a combination (nCr).' },
        { q: 'Why is a standard padlock called a "combination lock" if order matters?', a: 'Everyday language often confuses permutations and combinations. A combination lock is mathematically a permutation lock because entering the digits in the wrong order (e.g. 10-20-30 instead of 30-20-10) will not open the lock!' },
        { q: 'How does repetition affect permutations and combinations?', a: 'Without repetition: each item can be chosen at most once (nPr = n! / (n-r)! and nCr = n! / (r!(n-r)!)). With repetition: items can be picked multiple times. Permutations with repetition equals n^r (like 4-digit PINs: 10^4 = 10,000). Combinations with repetition equals (n + r - 1)! / (r!(n - 1)!) (Stars and Bars theorem, like picking 3 scoops of ice cream from 5 flavors: (5+3-1)! / (3! 4!) = 35).' },
        { q: 'What are the odds of winning the Powerball or Mega Millions jackpot?', a: 'In Powerball, you choose 5 white balls out of 69 without replacement (69 choose 5 = 11,238,513) and 1 red Powerball out of 26 (26). Total jackpot combinations = 11,238,513 × 26 = 292,201,338 (1 in 292.2 million). In Mega Millions, you choose 5 of 70 (70 choose 5 = 12,103,014) and 1 of 25, yielding 302,575,350 combinations (1 in 302.6 million).' },
        { q: 'Why is 0! = 1 in factorial mathematics?', a: 'Mathematically, n! = n × (n-1)!, which means (n-1)! = n! / n. Setting n = 1 yields 0! = 1! / 1 = 1. In combinatorics, 0! = 1 represents the single unique way to arrange zero objects (the empty set). Without this convention, formulas like n choose n = n! / (n! 0!) = 1 and n choose 0 = n! / (0! n!) = 1 would break.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Permutations &amp; Combinations
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Permutations and Combinations Calculator (nPr &amp; nCr)</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Calculate total arrangements ($n\text{P}r$) and selections ($n\text{C}r$) with exact arbitrary-precision BigInt integers, repetition modes, step-by-step factorial cancellations, and lottery probability odds.
          </p>

          <div class="tool-box">
            <!-- Quick Preset Buttons -->
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              <span style="font-size: 0.78rem; color: var(--text-muted); width: 100%;">Real-World Presets:</span>
              <button type="button" class="btn-sec" onclick="setPCPreset(69, 5)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">Powerball White (69 C 5)</button>
              <button type="button" class="btn-sec" onclick="setPCPreset(70, 5)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">Mega Millions (70 C 5)</button>
              <button type="button" class="btn-sec" onclick="setPCPreset(52, 5)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem; border-color: #10b981; color: #10b981; font-weight: bold;">Poker Hands (52 C 5)</button>
              <button type="button" class="btn-sec" onclick="setPCPreset(10, 4)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">4-Digit PIN (10 P 4)</button>
              <button type="button" class="btn-sec" onclick="setPCPreset(16, 2)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">Handshakes (16 C 2)</button>
              <button type="button" class="btn-sec" onclick="setPCPreset(8, 3)" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;">Ice Cream Scoops (8 C 3)</button>
            </div>

            <!-- Primary Inputs Grid -->
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Total Set Size (n items in pool)</label>
                <input type="number" id="pc-n" class="code-input" value="10" min="0" max="500" step="1" oninput="calcPC()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Sample Size Chosen (r items selected)</label>
                <input type="number" id="pc-r" class="code-input" value="3" min="0" max="500" step="1" oninput="calcPC()" style="font-size: 1.25rem;" />
              </div>
            </div>

            <!-- 4 Core Results Hero Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Combinations (nCr)</div>
                <div id="pc-ncr" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0; word-break: break-word;">120</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Order DOES NOT matter &bull; No Repetition</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Permutations (nPr)</div>
                <div id="pc-npr" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0; word-break: break-word;">720</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Order MATTERS &bull; No Repetition</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Permutations WITH Repetition</div>
                <div id="pc-prep" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #f59e0b; margin: 0.25rem 0; word-break: break-word;">1,000</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Formula: n<sup>r</sup> (PINs &bull; Passwords)</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Combinations WITH Repetition</div>
                <div id="pc-crep" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #8b5cf6; margin: 0.25rem 0; word-break: break-word;">220</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Stars &amp; Bars: (n + r - 1) C r</div>
              </div>
            </div>

            <!-- Factorials Breakdown Bar -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1rem; font-family: var(--mono); font-size: 0.82rem;">
              <div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border); text-align: center;">
                <div style="color: var(--text-muted); font-size: 0.7rem;">Total Pool Factorial (n!)</div>
                <div id="pc-fact" style="font-weight: bold; color: var(--fg); font-size: 0.95rem; margin-top: 0.2rem; word-break: break-all;">3,628,800</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border); text-align: center;">
                <div style="color: var(--text-muted); font-size: 0.7rem;">Selection Factorial (r!)</div>
                <div id="pc-rfact" style="font-weight: bold; color: var(--fg); font-size: 0.95rem; margin-top: 0.2rem; word-break: break-all;">6</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border); text-align: center;">
                <div style="color: var(--text-muted); font-size: 0.7rem;">Remainder Factorial ((n - r)!)</div>
                <div id="pc-remfact" style="font-weight: bold; color: var(--fg); font-size: 0.95rem; margin-top: 0.2rem; word-break: break-all;">5,040</div>
              </div>
            </div>

            <!-- Full Exact Digits Modal / Drawer Toggle (if huge) -->
            <div id="pc-huge-note" style="display: none; margin-top: 0.75rem; padding: 0.6rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.78rem; text-align: center;">
              Numbers exceed standard display width. <button type="button" class="btn-sec" onclick="toggleExactModal()" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; margin-left: 0.5rem;">View Exact Full Digits</button>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopyPC" onclick="copyPCSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Permutations &amp; Combinations Evaluation Report
            </button>
          </div>

          <!-- Step-by-Step Factorial Cancellation Engine -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #10b981; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Factorial Cancellation Proofs</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Algebraic Simplification</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Directly expanding large factorials is computationally wasteful. Instead, $(n - r)!$ cancels completely from the numerator:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #3b82f6;">Permutations (nPr) Cancellation:</strong>
                <div id="pc-step-npr" style="color: var(--fg); margin-top: 0.25rem;">
                  nPr = 10! / (10 - 3)! = (10 &times; 9 &times; 8 &times; 7!) / 7! = 10 &times; 9 &times; 8 = <strong>720</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981;">Combinations (nCr) Cancellation &amp; Division:</strong>
                <div id="pc-step-ncr" style="color: var(--fg); margin-top: 0.25rem;">
                  nCr = nPr / r! = 720 / 3! = 720 / (3 &times; 2 &times; 1) = 720 / 6 = <strong>120</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Poker Hands & Probability Benchmark Table -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">🃏 Standard 5-Card Poker Hand Combinations (52 C 5)</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Total Hands = 2,598,960</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              Combinatorics gives exact counts and probabilities for every poker hand in a standard 52-card deck:
            </p>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; text-align: left;">
                <thead>
                  <tr style="background: var(--surface-alt); border-bottom: 1px solid var(--border);">
                    <th style="padding: 0.5rem 0.75rem;">Poker Hand</th>
                    <th style="padding: 0.5rem 0.75rem;">Combinatorics Formula</th>
                    <th style="padding: 0.5rem 0.75rem;">Total Possible Hands</th>
                    <th style="padding: 0.5rem 0.75rem;">Exact Odds</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold; color: #10b981;">Royal Flush</td><td style="padding: 0.4rem 0.75rem;">4 suits &times; 1</td><td style="padding: 0.4rem 0.75rem;">4</td><td style="padding: 0.4rem 0.75rem;">1 in 649,740</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">Straight Flush</td><td style="padding: 0.4rem 0.75rem;">(10 - 1) &times; 4</td><td style="padding: 0.4rem 0.75rem;">36</td><td style="padding: 0.4rem 0.75rem;">1 in 72,193</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">Four of a Kind</td><td style="padding: 0.4rem 0.75rem;">13 &times; (48 C 1)</td><td style="padding: 0.4rem 0.75rem;">624</td><td style="padding: 0.4rem 0.75rem;">1 in 4,165</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">Full House</td><td style="padding: 0.4rem 0.75rem;">(13 C 1)(4 C 3) &times; (12 C 1)(4 C 2)</td><td style="padding: 0.4rem 0.75rem;">3,744</td><td style="padding: 0.4rem 0.75rem;">1 in 694</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">Flush</td><td style="padding: 0.4rem 0.75rem;">4 &times; (13 C 5) - 40</td><td style="padding: 0.4rem 0.75rem;">5,108</td><td style="padding: 0.4rem 0.75rem;">1 in 509</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">Straight</td><td style="padding: 0.4rem 0.75rem;">10 &times; (4^5) - 40</td><td style="padding: 0.4rem 0.75rem;">10,200</td><td style="padding: 0.4rem 0.75rem;">1 in 255</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">Three of a Kind</td><td style="padding: 0.4rem 0.75rem;">13 &times; (4 C 3) &times; (12 C 2) &times; 4^2</td><td style="padding: 0.4rem 0.75rem;">54,912</td><td style="padding: 0.4rem 0.75rem;">1 in 47</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">Two Pair</td><td style="padding: 0.4rem 0.75rem;">(13 C 2)(4 C 2)^2 &times; (11 C 1)(4 C 1)</td><td style="padding: 0.4rem 0.75rem;">123,552</td><td style="padding: 0.4rem 0.75rem;">1 in 21</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">One Pair</td><td style="padding: 0.4rem 0.75rem;">13 &times; (4 C 2) &times; (12 C 3) &times; 4^3</td><td style="padding: 0.4rem 0.75rem;">1,098,240</td><td style="padding: 0.4rem 0.75rem;">1 in 2.37 (42.26%)</td></tr>
                  <tr><td style="padding: 0.4rem 0.75rem; color: var(--text-muted);">High Card</td><td style="padding: 0.4rem 0.75rem;">[(13 C 5) - 10] &times; (4^5 - 4)</td><td style="padding: 0.4rem 0.75rem;">1,302,540</td><td style="padding: 0.4rem 0.75rem;">1 in 2 (50.12%)</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Critical Combinatorics Traps -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Combinatorics Traps &amp; Common Fallacies</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Combination Lock Misnomer:</strong> A standard rotary dial lock is mathematically a <em>permutation lock</em>, because order matters. Dialing 30-10-20 will not open a lock keyed to 10-20-30. True combinations occur only when the order of items is irrelevant (like picking lotto balls or lottery tickets).</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Overcounting Fallacy (Duplicate Items):</strong> When calculating arrangements of words with repeated letters (like "MISSISSIPPI"), standard $n!$ drastically overcounts. You must divide by the factorials of each repeated letter count ($11! / (4! 	imes 4! 	imes 2!) = 34,650$).</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Sampling With vs. Without Replacement:</strong> Drawing cards from a deck without replacement changes the pool size from $52 	o 51 	o 50$. Rolling dice or guessing passwords has replacement, meaning each choice is independent ($n^r$). Mixing these models ruins probability estimates.</li>
            </ul>
          </div>
        </div>

        <script>
          // BigInt Arbitrary-Precision Factorial and Combinatorics
          function bigFact(num) {
            if (num < 0) return 0n;
            if (num === 0 || num === 1) return 1n;
            var res = 1n;
            var bigN = BigInt(num);
            for (var i = 2n; i <= bigN; i++) {
              res *= i;
            }
            return res;
          }

          function bigNPr(n, r) {
            if (n < 0 || r < 0 || r > n) return 0n;
            var res = 1n;
            var bigN = BigInt(n);
            var limit = BigInt(n - r);
            for (var i = bigN; i > limit; i--) {
              res *= i;
            }
            return res;
          }

          function bigNCr(n, r) {
            if (n < 0 || r < 0 || r > n) return 0n;
            if (r === 0 || r === n) return 1n;
            // Symmetry optimization
            if (r > n - r) r = n - r;
            var npr = bigNPr(n, r);
            var rfact = bigFact(r);
            return npr / rfact;
          }

          function formatBigInt(val) {
            var s = val.toString();
            if (s.length <= 18) {
              return Number(s).toLocaleString('en-US');
            } else {
              // Scientific notation + length
              var exp = s.length - 1;
              var lead = s.substring(0, 4);
              var formattedLead = lead[0] + '.' + lead.substring(1);
              return formattedLead + ' &times; 10<sup>' + exp + '</sup> <span style="font-size: 0.72rem; color: var(--text-muted);">(' + s.length + ' digits)</span>';
            }
          }

          window.setPCPreset = function(n, r) {
            document.getElementById('pc-n').value = n;
            document.getElementById('pc-r').value = r;
            calcPC();
          };

          function calcPC() {
            var n = parseInt(document.getElementById('pc-n').value, 10);
            var r = parseInt(document.getElementById('pc-r').value, 10);

            if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
              document.getElementById('pc-ncr').textContent = '-';
              document.getElementById('pc-npr').textContent = '-';
              document.getElementById('pc-prep').textContent = '-';
              document.getElementById('pc-crep').textContent = '-';
              return;
            }

            if (r > n) {
              document.getElementById('pc-ncr').textContent = '0 (r > n)';
              document.getElementById('pc-npr').textContent = '0 (r > n)';
            } else {
              var ncrVal = bigNCr(n, r);
              var nprVal = bigNPr(n, r);
              document.getElementById('pc-ncr').innerHTML = formatBigInt(ncrVal);
              document.getElementById('pc-npr').innerHTML = formatBigInt(nprVal);
            }

            // Permutations with repetition: n^r
            var prepVal = 0n;
            try {
              if (n <= 1000 && r <= 200) {
                prepVal = BigInt(n) ** BigInt(r);
                document.getElementById('pc-prep').innerHTML = formatBigInt(prepVal);
              } else {
                document.getElementById('pc-prep').textContent = '> 10^300 (Overflow)';
              }
            } catch (e) {
              document.getElementById('pc-prep').textContent = 'Overflow';
            }

            // Combinations with repetition: (n + r - 1) C r
            if (n > 0) {
              var crepVal = bigNCr(n + r - 1, r);
              document.getElementById('pc-crep').innerHTML = formatBigInt(crepVal);
            } else {
              document.getElementById('pc-crep').textContent = '-';
            }

            // Factorials
            var nFact = n <= 50 ? formatBigInt(bigFact(n)) : '> 10^64 (' + n + '!)';
            var rFact = r <= 50 ? formatBigInt(bigFact(r)) : '> 10^64 (' + r + '!)';
            var remFact = (n >= r && (n - r) <= 50) ? formatBigInt(bigFact(n - r)) : '> 10^64';

            document.getElementById('pc-fact').innerHTML = nFact;
            document.getElementById('pc-rfact').innerHTML = rFact;
            document.getElementById('pc-remfact').innerHTML = remFact;

            // Step Cancellation text
            if (r <= n && r <= 10) {
              var prodTerms = [];
              for (var k = n; k > (n - r); k--) {
                prodTerms.push(k);
              }
              var numStr = prodTerms.join(' &times; ');
              var denTerms = [];
              for (var d = r; d >= 1; d--) {
                denTerms.push(d);
              }
              var denStr = denTerms.join(' &times; ');

              document.getElementById('pc-step-npr').innerHTML = 'nPr = ' + n + '! / (' + n + ' - ' + r + ')! = (' + numStr + ' &times; ' + (n - r) + '!) / ' + (n - r) + '! = ' + (numStr ? numStr : '1') + ' = <strong>' + formatBigInt(bigNPr(n, r)) + '</strong>';
              document.getElementById('pc-step-ncr').innerHTML = 'nCr = nPr / ' + r + '! = ' + formatBigInt(bigNPr(n, r)) + ' / (' + (denStr ? denStr : '1') + ') = <strong>' + formatBigInt(bigNCr(n, r)) + '</strong>';
            } else if (r <= n) {
              document.getElementById('pc-step-npr').innerHTML = 'nPr = ' + n + '! / (' + n + ' - ' + r + ')! = <strong>' + formatBigInt(bigNPr(n, r)) + '</strong>';
              document.getElementById('pc-step-ncr').innerHTML = 'nCr = nPr / ' + r + '! = <strong>' + formatBigInt(bigNCr(n, r)) + '</strong>';
            }
          }

          window.copyPCSummary = function() {
            var n = document.getElementById('pc-n').value;
            var r = document.getElementById('pc-r').value;
            var ncr = document.getElementById('pc-ncr').innerText;
            var npr = document.getElementById('pc-npr').innerText;
            var prep = document.getElementById('pc-prep').innerText;
            var crep = document.getElementById('pc-crep').innerText;

            var text = [
              '=== COMBINATORICS EVALUATION REPORT ===',
              'Set Size (n): ' + n,
              'Sample Size (r): ' + r,
              'Combinations Without Repetition (nCr): ' + ncr,
              'Permutations Without Repetition (nPr): ' + npr,
              'Permutations WITH Repetition (n^r): ' + prep,
              'Combinations WITH Repetition (n+r-1 C r): ' + crep,
              '---------------------------------------',
              'Precision: Native Arbitrary-Precision BigInt',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/permutation-combination-calculator'
            ].join('\n');

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyPC');
              if (btn) {
                var old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Combinatorics Report!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

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
