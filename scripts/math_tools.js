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
      title: 'Percentage Calculator (5-in-1 Master Solver with Visual Proportion Bar)',
      metaDesc: 'Calculate percentages easily: percentage of a number, proportion, percentage increase/decrease, reverse percentages, and percentage difference with step-by-step math.',
      category: 'Math & Finance',
      faq: [
        { q: 'What is the formula to find the percentage of a number (X% of Y)?', a: 'To find X% of Y, convert the percentage to a decimal by dividing by 100, then multiply by Y: Value = (X / 100) × Y. For example, to find 15% of 240: (15 / 100) × 240 = 0.15 × 240 = 36.' },
        { q: 'How do you calculate percentage increase or percentage decrease?', a: 'To calculate percentage change between an old value and a new value, subtract the old value from the new value, divide by the absolute old value, and multiply by 100%: Percentage Change = [(New - Old) / |Old|] × 100%. A positive result denotes an increase; a negative result denotes a decrease.' },
        { q: 'What is a reverse percentage and how do you calculate the original price?', a: 'A reverse percentage finds the original base value before a percentage markup, tax, or discount was applied. If an item costs $84 after a 20% discount, that $84 represents 80% (100% - 20%) of the original price: Original Price = Final Value / (1 - Discount/100) = $84 / 0.80 = $105.' },
        { q: 'What is the difference between percentage change and percentage difference?', a: 'Percentage change has a chronological direction (old value to new value) and divides by the initial starting value. Percentage difference compares two concurrent values without direction or hierarchy and divides by the average (mean) of both values: Difference % = [|A - B| / ((A + B) / 2)] × 100%.' },
        { q: 'Why does a 50% loss require a 100% gain to break even?', a: 'This is the law of asymmetric percentage recovery. If an investment of $100 drops by 50%, its balance becomes $50. To return to the original $100, that $50 must gain $50, which is a 100% increase on the new reduced base. Similarly, an 80% loss requires a 400% gain, and a 90% loss requires a 900% gain to break even.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math &amp; Calculators</a> &gt; Percentage Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">5-in-1 Master Percentage Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Instant bidirectional calculation for standard percentages, proportions, percentage change (increase/decrease), reverse percentages (original price), and relative difference with visual proportion bars.
          </p>

          <!-- MODE 1: What is X% of Y? -->
          <div class="tool-box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0; color: var(--fg);">1. Percentage of a Number: What is X% of Y?</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">P = (X / 100) &times; Y</span>
            </div>
            <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
              <span style="font-family: var(--mono); font-size: 0.9rem;">What is</span>
              <input type="number" id="p1-x" class="code-input" style="width: 110px; font-size: 1.15rem;" value="15" step="any" oninput="calcP1()" />
              <span style="font-family: var(--mono); font-size: 0.9rem;">% of</span>
              <input type="number" id="p1-y" class="code-input" style="width: 140px; font-size: 1.15rem;" value="240" step="any" oninput="calcP1()" />
              <span style="font-family: var(--mono); font-size: 1.2rem; font-weight: bold;">=</span>
              <strong id="p1-res" style="font-family: var(--mono); font-size: 1.8rem; color: #3b82f6; margin-left: 0.5rem;">36.00</strong>
            </div>

            <!-- Visual Proportion Bar -->
            <div style="margin-top: 1rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; padding: 0.75rem;">
              <div style="display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.35rem;">
                <span id="p1-bar-label">Share: 36.00 of 240 (15%)</span>
                <span id="p1-bar-rem">Remainder: 204.00 (85%)</span>
              </div>
              <div style="display: flex; width: 100%; height: 18px; border-radius: 3px; overflow: hidden; background: var(--border);">
                <div id="p1-bar-fill" style="width: 15%; background: #3b82f6; transition: width 0.2s ease;"></div>
                <div id="p1-bar-fill-rem" style="width: 85%; background: #64748b; opacity: 0.5; transition: width 0.2s ease;"></div>
              </div>
            </div>
          </div>

          <!-- MODE 2: X is what percent of Y? -->
          <div class="tool-box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0; color: var(--fg);">2. Proportion to Percentage: X is what % of Y?</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">% = (X / Y) &times; 100</span>
            </div>
            <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
              <input type="number" id="p2-x" class="code-input" style="width: 110px; font-size: 1.15rem;" value="45" step="any" oninput="calcP2()" />
              <span style="font-family: var(--mono); font-size: 0.9rem;">is what % of</span>
              <input type="number" id="p2-y" class="code-input" style="width: 140px; font-size: 1.15rem;" value="180" step="any" oninput="calcP2()" />
              <span style="font-family: var(--mono); font-size: 1.2rem; font-weight: bold;">=</span>
              <strong id="p2-res" style="font-family: var(--mono); font-size: 1.8rem; color: #10b981; margin-left: 0.5rem;">25.00%</strong>
              <span id="p2-fraction" style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">(Fraction: 1/4)</span>
            </div>
          </div>

          <!-- MODE 3: Percentage Increase / Decrease -->
          <div class="tool-box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0; color: var(--fg);">3. Percentage Change: From X to Y (Increase or Decrease)</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #8b5cf6; background: rgba(139, 92, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">&Delta;% = ((New - Old) / Old) &times; 100</span>
            </div>
            <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
              <span style="font-family: var(--mono); font-size: 0.9rem;">From</span>
              <input type="number" id="p3-x" class="code-input" style="width: 120px; font-size: 1.15rem;" value="80" step="any" oninput="calcP3()" />
              <span style="font-family: var(--mono); font-size: 0.9rem;">to</span>
              <input type="number" id="p3-y" class="code-input" style="width: 120px; font-size: 1.15rem;" value="120" step="any" oninput="calcP3()" />
              <span style="font-family: var(--mono); font-size: 1.2rem; font-weight: bold;">=</span>
              <strong id="p3-res" style="font-family: var(--mono); font-size: 1.8rem; color: #10b981; margin-left: 0.5rem;">+50.00%</strong>
              <span id="p3-badge" style="font-family: var(--mono); font-size: 0.82rem; font-weight: bold; padding: 0.25rem 0.5rem; border-radius: 4px; background: rgba(16, 185, 129, 0.1); color: #10b981;">▲ Increase of 40.00</span>
            </div>
          </div>

          <!-- MODE 4: Reverse Percentage Solver (Original Value) -->
          <div class="tool-box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0; color: var(--fg);">4. Reverse Percentage Solver: X is Y% of What?</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #f59e0b; background: rgba(245, 158, 11, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Original = X / (Y / 100)</span>
            </div>
            <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
              <input type="number" id="p4-x" class="code-input" style="width: 110px; font-size: 1.15rem;" value="84" step="any" oninput="calcP4()" />
              <span style="font-family: var(--mono); font-size: 0.9rem;">is</span>
              <input type="number" id="p4-y" class="code-input" style="width: 100px; font-size: 1.15rem;" value="80" step="any" oninput="calcP4()" />
              <span style="font-family: var(--mono); font-size: 0.9rem;">% of what? =</span>
              <strong id="p4-res" style="font-family: var(--mono); font-size: 1.8rem; color: #f59e0b; margin-left: 0.5rem;">105.00</strong>
              <span style="font-family: var(--mono); font-size: 0.82rem; color: var(--text-muted);">(e.g. $84 after 20% discount = $105 original)</span>
            </div>
          </div>

          <!-- MODE 5: Relative Percentage Difference -->
          <div class="tool-box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0; color: var(--fg);">5. Percentage Difference Between Two Values: X and Y</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #ec4899; background: rgba(236, 72, 153, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Diff = (|X - Y| / ((X + Y)/2)) &times; 100</span>
            </div>
            <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
              <span style="font-family: var(--mono); font-size: 0.9rem;">Difference between</span>
              <input type="number" id="p5-x" class="code-input" style="width: 110px; font-size: 1.15rem;" value="120" step="any" oninput="calcP5()" />
              <span style="font-family: var(--mono); font-size: 0.9rem;">and</span>
              <input type="number" id="p5-y" class="code-input" style="width: 110px; font-size: 1.15rem;" value="150" step="any" oninput="calcP5()" />
              <span style="font-family: var(--mono); font-size: 1.2rem; font-weight: bold;">=</span>
              <strong id="p5-res" style="font-family: var(--mono); font-size: 1.8rem; color: #ec4899; margin-left: 0.5rem;">22.22%</strong>
              <span style="font-family: var(--mono); font-size: 0.82rem; color: var(--text-muted);">(Average: 135.00 &bull; Spread: 30.00)</span>
            </div>
          </div>

          <!-- Asymmetric Gain vs. Loss Breakeven Matrix -->
          <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0; color: var(--fg);">
                ⚖️ The Asymmetric Gain vs. Loss Breakeven Matrix
              </h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Mathematical Law of Capital Recovery</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.5; margin-bottom: 1rem;">
              Because percentage decreases shrink the capital base, recovering from a drawdown requires a mathematically higher percentage gain:
            </p>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; text-align: center;">
                <thead>
                  <tr style="background: var(--surface-alt); border-bottom: 1px solid var(--border);">
                    <th style="padding: 0.5rem; color: #ef4444;">Portfolio Loss</th>
                    <th style="padding: 0.5rem;">$1,000 Balance Drops To</th>
                    <th style="padding: 0.5rem; color: #10b981;">Gain Required to Break Even</th>
                    <th style="padding: 0.5rem; color: var(--text-muted);">Formula: [Loss / (1 - Loss)]</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem; color: #ef4444; font-weight: bold;">-10%</td><td>$900</td><td style="padding: 0.4rem; color: #10b981; font-weight: bold;">+11.11%</td><td style="color: var(--text-muted);">0.10 / 0.90</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem; color: #ef4444; font-weight: bold;">-20%</td><td>$800</td><td style="padding: 0.4rem; color: #10b981; font-weight: bold;">+25.00%</td><td style="color: var(--text-muted);">0.20 / 0.80</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem; color: #ef4444; font-weight: bold;">-30%</td><td>$700</td><td style="padding: 0.4rem; color: #10b981; font-weight: bold;">+42.86%</td><td style="color: var(--text-muted);">0.30 / 0.70</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem; color: #ef4444; font-weight: bold;">-50%</td><td>$500</td><td style="padding: 0.4rem; color: #10b981; font-weight: bold;">+100.00%</td><td style="color: var(--text-muted);">0.50 / 0.50</td></tr>
                  <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem; color: #ef4444; font-weight: bold;">-75%</td><td>$250</td><td style="padding: 0.4rem; color: #10b981; font-weight: bold;">+300.00%</td><td style="color: var(--text-muted);">0.75 / 0.25</td></tr>
                  <tr><td style="padding: 0.4rem; color: #ef4444; font-weight: bold;">-90%</td><td>$100</td><td style="padding: 0.4rem; color: #10b981; font-weight: bold;">+900.00%</td><td style="color: var(--text-muted);">0.90 / 0.10</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Sequential Percentage Chain Simulator -->
          <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
            <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-top: 0; margin-bottom: 0.5rem; color: var(--fg);">
              🔗 Sequential Percentage Chain Calculator (Stacking Taxes &amp; Discounts)
            </h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
              Calculate compounding multi-stage percentage changes (e.g. Retail Price &rarr; 20% discount &rarr; 8.5% sales tax &rarr; 15% tip):
            </p>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <span style="font-family: var(--mono); font-size: 0.85rem;">Start ($):</span>
              <input type="number" id="chain-start" class="code-input" style="width: 100px;" value="100" oninput="calcChain()" />
              <span style="font-family: var(--mono); font-size: 0.85rem;">Step 1 (%):</span>
              <input type="number" id="chain-p1" class="code-input" style="width: 90px;" value="-20" oninput="calcChain()" />
              <span style="font-family: var(--mono); font-size: 0.85rem;">Step 2 (%):</span>
              <input type="number" id="chain-p2" class="code-input" style="width: 90px;" value="8.5" oninput="calcChain()" />
              <span style="font-family: var(--mono); font-size: 0.85rem;">Step 3 (%):</span>
              <input type="number" id="chain-p3" class="code-input" style="width: 90px;" value="15" oninput="calcChain()" />
            </div>
            <div id="chain-summary" style="margin-top: 0.75rem; padding: 0.6rem 0.8rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; color: var(--fg);">
              $100.00 &rarr; (-20%) $80.00 &rarr; (+8.5%) $86.80 &rarr; (+15%) <strong>$99.82 Final</strong> (Effective Change: -0.18%)
            </div>
          </div>

          <!-- Action Copy Button -->
          <button type="button" id="btnCopyPct" onclick="copyPercentageSummary()" class="btn-sec" style="margin-top: 1.5rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
            📋 Copy Comprehensive Percentage Calculations Summary
          </button>

          <!-- Step-by-Step Worked Derivations -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Mathematical Derivations &amp; Formulas</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Universal Percentage Algebra</span>
            </div>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Formula 1: Value of a Percentage (What is X% of Y?)</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">Value = (X / 100) &times; Y</div>
                <div id="p-step-1" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  Worked: (15 / 100) &times; 240 = 0.15 &times; 240 = <strong>36.00</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Formula 2: Percentage Proportion (X is what % of Y?)</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">Percentage = (X / Y) &times; 100%</div>
                <div id="p-step-2" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  Worked: (45 / 180) &times; 100% = 0.25 &times; 100% = <strong>25.00%</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Formula 3: Percentage Change (Increase or Decrease)</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">Change % = [(New - Old) / Old] &times; 100%</div>
                <div id="p-step-3" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  Worked: [(120 - 80) / 80] &times; 100% = (40 / 80) &times; 100% = <strong>+50.00% (Increase)</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Formula 4: Reverse Percentage (Finding Original Base)</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">Original = Final / (Y / 100)</div>
                <div id="p-step-4" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  Worked: 84 / (80 / 100) = 84 / 0.80 = <strong>105.00</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Formula 5: Relative Percentage Difference</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">Diff % = [ |X - Y| / ((X + Y) / 2) ] &times; 100%</div>
                <div id="p-step-5" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  Worked: [ |120 - 150| / 135 ] &times; 100% = (30 / 135) &times; 100% = <strong>22.22%</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Pitfalls & Common Traps -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Percentage Pitfalls &amp; Costly Misunderstandings</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Asymmetric Recovery Trap (Loss vs Gain):</strong> A 50% drop in portfolio value requires a <strong>+100% gain</strong> to break even, NOT a 50% gain! If $100 drops by 50% to $50, a 50% gain on $50 is only $75. Always calculate recovery based on the new reduced base.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Percentage Points vs Relative Percentages:</strong> An interest rate increasing from 4% to 5% is a <strong>1 percentage point increase</strong>, but a <strong>25% relative increase</strong> [(5 - 4) / 4 &times; 100%]. Confusing these two in financial contracts, inflation reporting, or tax brackets causes catastrophic errors.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Sequential Discounting Illusion:</strong> Stacking a 20% coupon on top of a 20% store sale is NOT a 40% discount! $100 - 20% = $80; $80 - 20% = $64, which is a 36% total discount. Consecutive percentage changes cannot be added directly.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Base Shifting in Inflation &amp; Pay Raises:</strong> If prices inflate by 10% and your salary increases by 10%, your purchasing power does NOT increase—it remains virtually flat. But if prices rise 10% and then drop 10%, they end up 1% cheaper than the original price ($100 &times; 1.10 = $110 &times; 0.90 = $99).</li>
            </ul>
          </div>
        </div>

        <script>
          function calcP1() {
            const x = parseFloat(document.getElementById('p1-x').value) || 0;
            const y = parseFloat(document.getElementById('p1-y').value) || 0;
            const res = (x / 100) * y;
            document.getElementById('p1-res').textContent = res.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

            // Visual bar
            const barFill = document.getElementById('p1-bar-fill');
            const barRem = document.getElementById('p1-bar-fill-rem');
            const lbl = document.getElementById('p1-bar-label');
            const remLbl = document.getElementById('p1-bar-rem');

            const pctClamped = Math.min(100, Math.max(0, x));
            barFill.style.width = pctClamped + '%';
            barRem.style.width = (100 - pctClamped) + '%';
            lbl.textContent = 'Share: ' + res.toFixed(2) + ' of ' + y.toFixed(2) + ' (' + x.toFixed(1) + '%)';
            remLbl.textContent = 'Remainder: ' + (y - res).toFixed(2) + ' (' + (100 - x).toFixed(1) + '%)';

            document.getElementById('p-step-1').innerHTML = 'Worked: (' + x + ' / 100) &times; ' + y + ' = ' + (x / 100).toFixed(4) + ' &times; ' + y + ' = <strong>' + res.toFixed(2) + '</strong>';
          }

          function gcd(a, b) {
            a = Math.abs(a);
            b = Math.abs(b);
            while (b) {
              const t = b;
              b = a % b;
              a = t;
            }
            return a;
          }

          function calcP2() {
            const x = parseFloat(document.getElementById('p2-x').value) || 0;
            const y = parseFloat(document.getElementById('p2-y').value) || 1;
            const pct = (x / y) * 100;
            document.getElementById('p2-res').textContent = pct.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) + '%';

            // Fraction simplification
            if (Number.isInteger(x) && Number.isInteger(y) && y !== 0) {
              const div = gcd(Math.round(x), Math.round(y));
              const simX = Math.round(x) / div;
              const simY = Math.round(y) / div;
              document.getElementById('p2-fraction').textContent = '(Fraction: ' + simX + '/' + simY + ')';
            } else {
              document.getElementById('p2-fraction').textContent = '(Ratio: ' + (x / y).toFixed(4) + ')';
            }

            document.getElementById('p-step-2').innerHTML = 'Worked: (' + x + ' / ' + y + ') &times; 100% = ' + (x / y).toFixed(6) + ' &times; 100% = <strong>' + pct.toFixed(2) + '%</strong>';
          }

          function calcP3() {
            const x = parseFloat(document.getElementById('p3-x').value) || 0;
            const y = parseFloat(document.getElementById('p3-y').value) || 0;

            const resEl = document.getElementById('p3-res');
            const badgeEl = document.getElementById('p3-badge');

            if (x === 0) {
              resEl.textContent = 'Undefined (0 base)';
              badgeEl.textContent = 'Cannot divide by 0';
              return;
            }

            const diff = y - x;
            const pctChange = (diff / Math.abs(x)) * 100;

            if (diff > 0) {
              resEl.textContent = '+' + pctChange.toFixed(2) + '%';
              resEl.style.color = '#10b981';
              badgeEl.textContent = '▲ Increase of ' + diff.toFixed(2);
              badgeEl.style.color = '#10b981';
              badgeEl.style.background = 'rgba(16, 185, 129, 0.1)';
            } else if (diff < 0) {
              resEl.textContent = pctChange.toFixed(2) + '%';
              resEl.style.color = '#ef4444';
              badgeEl.textContent = '▼ Decrease of ' + Math.abs(diff).toFixed(2);
              badgeEl.style.color = '#ef4444';
              badgeEl.style.background = 'rgba(239, 68, 68, 0.1)';
            } else {
              resEl.textContent = '0.00%';
              resEl.style.color = 'var(--fg)';
              badgeEl.textContent = 'No Change';
              badgeEl.style.color = 'var(--text-muted)';
              badgeEl.style.background = 'var(--surface)';
            }

            document.getElementById('p-step-3').innerHTML = 'Worked: [(' + y + ' - ' + x + ') / ' + x + '] &times; 100% = (' + diff.toFixed(2) + ' / ' + x + ') &times; 100% = <strong>' + (pctChange >= 0 ? '+' : '') + pctChange.toFixed(2) + '%</strong>';
          }

          function calcP4() {
            const x = parseFloat(document.getElementById('p4-x').value) || 0;
            const y = parseFloat(document.getElementById('p4-y').value) || 1;
            const original = x / (y / 100);
            document.getElementById('p4-res').textContent = original.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

            document.getElementById('p-step-4').innerHTML = 'Worked: ' + x + ' / (' + y + ' / 100) = ' + x + ' / ' + (y / 100).toFixed(4) + ' = <strong>' + original.toFixed(2) + '</strong>';
          }

          function calcP5() {
            const x = parseFloat(document.getElementById('p5-x').value) || 0;
            const y = parseFloat(document.getElementById('p5-y').value) || 0;
            const avg = (x + y) / 2;
            let diffPct = 0;
            if (avg !== 0) {
              diffPct = (Math.abs(x - y) / Math.abs(avg)) * 100;
            }
            document.getElementById('p5-res').textContent = diffPct.toFixed(2) + '%';

            document.getElementById('p-step-5').innerHTML = 'Worked: [ |' + x + ' - ' + y + '| / ((' + x + ' + ' + y + ') / 2) ] &times; 100% = (' + Math.abs(x - y).toFixed(2) + ' / ' + avg.toFixed(2) + ') &times; 100% = <strong>' + diffPct.toFixed(2) + '%</strong>';
          }

          function calcChain() {
            const start = parseFloat(document.getElementById('chain-start').value) || 0;
            const p1 = (parseFloat(document.getElementById('chain-p1').value) || 0) / 100;
            const p2 = (parseFloat(document.getElementById('chain-p2').value) || 0) / 100;
            const p3 = (parseFloat(document.getElementById('chain-p3').value) || 0) / 100;

            const s1 = start * (1 + p1);
            const s2 = s1 * (1 + p2);
            const s3 = s2 * (1 + p3);

            const effChange = start !== 0 ? ((s3 - start) / start) * 100 : 0;
            const sign = effChange >= 0 ? '+' : '';

            document.getElementById('chain-summary').innerHTML = '$' + start.toFixed(2) + ' &rarr; (' + (p1 >= 0 ? '+' : '') + (p1 * 100).toFixed(1) + '%) $' + s1.toFixed(2) + ' &rarr; (' + (p2 >= 0 ? '+' : '') + (p2 * 100).toFixed(1) + '%) $' + s2.toFixed(2) + ' &rarr; (' + (p3 >= 0 ? '+' : '') + (p3 * 100).toFixed(1) + '%) <strong style="color: #10b981;">$' + s3.toFixed(2) + ' Final</strong> (Effective Change: ' + sign + effChange.toFixed(2) + '%)';
          }

          window.copyPercentageSummary = function() {
            const p1 = document.getElementById('p1-res').textContent;
            const p2 = document.getElementById('p2-res').textContent;
            const p3 = document.getElementById('p3-res').textContent;
            const p4 = document.getElementById('p4-res').textContent;
            const p5 = document.getElementById('p5-res').textContent;
            const chain = document.getElementById('chain-summary').innerText;

            const report = [
              '=== 5-IN-1 PERCENTAGE CALCULATION SUMMARY ===',
              '1. What is X% of Y: ' + p1,
              '2. X is what % of Y: ' + p2,
              '3. Percentage Change: ' + p3,
              '4. Reverse Percentage (Original Base): ' + p4,
              '5. Percentage Difference: ' + p5,
              '--------------------------------------------',
              'Sequential Chain: ' + chain,
              'Standard: Universal Decimal Mathematics',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/percentage-calculator'
            ].join('\n');

            navigator.clipboard.writeText(report).then(function() {
              const btn = document.getElementById('btnCopyPct');
              if (btn) {
                const old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Percentage Calculations!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() {
            calcP1();
            calcP2();
            calcP3();
            calcP4();
            calcP5();
            calcChain();
          });
          calcP1();
          calcP2();
          calcP3();
          calcP4();
          calcP5();
          calcChain();
        </script>
      `
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
      slug: 'mortgage-calculator',
      title: 'Mortgage Calculator with PITI, Extra Payments & Amortization Schedule',
      metaDesc: 'Calculate monthly mortgage payments (P&I, taxes, insurance, PMI), total interest cost, amortization schedules, and payoffs with extra principal payments.',
      category: 'Math & Finance',
      faq: [
        { q: 'What is included in a PITI mortgage payment?', a: 'PITI stands for Principal, Interest, Taxes, and Insurance. While your base loan payment covers Principal and Interest (P&I), most lenders require an escrow account that collects 1/12th of your annual property taxes and homeowners hazard insurance each month. If your down payment is under 20%, Private Mortgage Insurance (PMI) is also added to the monthly payment.' },
        { q: 'How does an extra monthly principal payment reduce mortgage payoff time?', a: 'Extra payments apply 100% directly to reducing your loan principal, bypassing accrued interest. Because interest is recalculated monthly based on the remaining balance, lower principal permanently reduces all future interest accrual. On a $350,000 30-year mortgage at 6.5%, adding just $200/month cuts over 5 years off your term and saves over $75,000 in interest.' },
        { q: 'What is Private Mortgage Insurance (PMI) and when does it cancel?', a: 'PMI is insurance that protects the lender in case you default on your loan. Conventional loans typically require PMI if your down payment is less than 20% of the purchase price (loan-to-value ratio > 80%). Under the Homeowners Protection Act of 1998, lenders must automatically cancel PMI once your loan balance reaches 78% of the original home value, or you can request cancellation at 80%.' },
        { q: 'What is the difference between a 15-year and a 30-year fixed-rate mortgage?', a: 'A 15-year mortgage has higher monthly payments (typically 30%–45% higher) because the principal is repaid over half the time, but usually carries a lower interest rate (0.5%–0.75% lower) and saves over 60% in total lifetime interest. A 30-year mortgage offers lower required monthly payments, providing greater cash flow flexibility during economic downturns.' },
        { q: 'What is the front-loaded amortization schedule?', a: 'In fixed-rate mortgages, your total monthly payment is identical every month, but the internal allocation changes drastically. In the early years, the vast majority of each payment goes toward interest (often 80%+), with only a small fraction paying down principal. As the balance decreases over decades, the ratio shifts until payments become predominantly principal in the final years.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Mortgage Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Mortgage &amp; Loan Amortization Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Calculate total monthly PITI payments (Principal, Interest, Property Taxes, Home Insurance, PMI, HOA), visualize amortization schedules, and discover how extra principal payments accelerate early payoff.
          </p>

          <div class="tool-box">
            <!-- Loan Parameters Grid -->
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Home Purchase Price ($)</label>
                <input type="number" id="mg-price" class="code-input" value="400000" min="10000" step="5000" oninput="recalcMG('price')" style="font-size: 1.2rem;" />
              </div>
              <div class="field-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <label class="field-label" style="margin: 0;">Down Payment ($ / %)</label>
                  <div style="display: flex; gap: 0.25rem;">
                    <button type="button" class="btn-sec" onclick="setMGDownPct(5)" style="padding: 0.15rem 0.35rem; font-size: 0.68rem;">5%</button>
                    <button type="button" class="btn-sec" onclick="setMGDownPct(10)" style="padding: 0.15rem 0.35rem; font-size: 0.68rem;">10%</button>
                    <button type="button" class="btn-sec" onclick="setMGDownPct(20)" style="padding: 0.15rem 0.35rem; font-size: 0.68rem; border-color: #10b981; color: #10b981; font-weight: bold;">20% (No PMI)</button>
                  </div>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                  <input type="number" id="mg-down-d" class="code-input" value="80000" min="0" step="1000" oninput="recalcMG('down-d')" style="font-size: 1.15rem;" />
                  <input type="number" id="mg-down-p" class="code-input" value="20" min="0" max="90" step="1" oninput="recalcMG('down-p')" style="width: 85px; text-align: center; font-size: 1.15rem;" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Interest Rate (% APR)</label>
                <input type="number" id="mg-rate" class="code-input" value="6.75" min="0.1" max="25" step="0.05" oninput="recalcMG()" style="font-size: 1.2rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Loan Term</label>
                <select id="mg-term" class="code-input" onchange="recalcMG()" style="font-size: 1.05rem;">
                  <option value="30" selected>30 Years Fixed (Standard)</option>
                  <option value="20">20 Years Fixed</option>
                  <option value="15">15 Years Fixed (Lower Interest)</option>
                  <option value="10">10 Years Fixed</option>
                </select>
              </div>
            </div>

            <!-- Escrow, Taxes, PMI & Extra Payments Dropdown -->
            <div style="margin-top: 1rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 0.6rem;">
                🏡 Escrow Expenses (PITI) &amp; Accelerated Early Payoff:
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.75rem;">
                <div>
                  <label style="display: block; font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.2rem;">Property Tax (% / yr)</label>
                  <input type="number" id="mg-tax-rate" class="code-input" value="1.2" step="0.1" min="0" oninput="recalcMG()" style="padding: 0.4rem; font-size: 0.85rem;" />
                </div>
                <div>
                  <label style="display: block; font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.2rem;">Home Insurance ($ / yr)</label>
                  <input type="number" id="mg-ins-yr" class="code-input" value="1500" step="100" min="0" oninput="recalcMG()" style="padding: 0.4rem; font-size: 0.85rem;" />
                </div>
                <div>
                  <label style="display: block; font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.2rem;">PMI Rate (% if &lt;20% down)</label>
                  <input type="number" id="mg-pmi-rate" class="code-input" value="0.75" step="0.05" min="0" oninput="recalcMG()" style="padding: 0.4rem; font-size: 0.85rem;" />
                </div>
                <div>
                  <label style="display: block; font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.2rem;">HOA Dues ($ / month)</label>
                  <input type="number" id="mg-hoa" class="code-input" value="0" step="25" min="0" oninput="recalcMG()" placeholder="0" style="padding: 0.4rem; font-size: 0.85rem;" />
                </div>
                <div>
                  <label style="display: block; font-family: var(--mono); font-size: 0.7rem; color: #10b981; font-weight: bold; margin-bottom: 0.2rem;">Extra Monthly Principal ($)</label>
                  <input type="number" id="mg-extra" class="code-input" value="200" step="50" min="0" oninput="recalcMG()" style="padding: 0.4rem; font-size: 0.85rem; border-color: #10b981;" />
                </div>
              </div>
            </div>

            <!-- Hero Results Dashboard -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Monthly Payment (PITI)</div>
                <div id="mg-monthly-total" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">$2,601 / mo</div>
                <div id="mg-pi-only" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">P&amp;I: $2,076 &bull; Escrow: $525</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Lifetime Interest Cost</div>
                <div id="mg-interest-total" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #ef4444; margin: 0.25rem 0;">$427,243</div>
                <div id="mg-ratio-interest" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">133.5% of original loan borrowed</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Loan Principal Borrowed</div>
                <div id="mg-principal-out" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: var(--fg); margin: 0.25rem 0;">$320,000</div>
                <div id="mg-ltv-disp" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">LTV: 80.0% &bull; Down: $80,000</div>
              </div>
            </div>

            <!-- Extra Principal Acceleration Alert Banner -->
            <div id="mg-savings-banner" style="margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 6px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); font-family: var(--mono); font-size: 0.85rem; line-height: 1.5;">
              <!-- Populated dynamically -->
            </div>

            <!-- Visual Monthly Breakdown Stacked Bar -->
            <div style="margin-top: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">
                <span>Monthly Payment Allocation Breakdown:</span>
                <span id="mg-bar-label" style="color: var(--fg);">$2,601 / month</span>
              </div>
              <div style="display: flex; width: 100%; height: 26px; border-radius: 4px; overflow: hidden; font-family: var(--mono); font-size: 0.72rem; font-weight: bold; color: #fff; text-align: center; line-height: 26px;">
                <div id="mg-bar-p" style="width: 10.6%; background: #3b82f6;" title="Principal">Principal</div>
                <div id="mg-bar-i" style="width: 69.2%; background: #ef4444;" title="Interest">Interest</div>
                <div id="mg-bar-tax" style="width: 15.4%; background: #10b981;" title="Property Tax">Tax</div>
                <div id="mg-bar-ins" style="width: 4.8%; background: #f59e0b;" title="Homeowners Insurance">Ins</div>
                <div id="mg-bar-pmi" style="width: 0%; background: #8b5cf6;" title="PMI">PMI</div>
              </div>
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted);">
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #3b82f6; border-radius: 2px;"></span> Principal</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #ef4444; border-radius: 2px;"></span> Interest</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #10b981; border-radius: 2px;"></span> Property Tax</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #f59e0b; border-radius: 2px;"></span> Home Insurance</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #8b5cf6; border-radius: 2px;"></span> PMI</span>
              </div>
            </div>

            <!-- Year-by-Year Amortization Schedule Table -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; color: var(--fg);">
                  📅 Annual Loan Amortization Schedule:
                </div>
                <span id="mg-sched-summary" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">360 Payments Projected</span>
              </div>
              <div style="overflow-x: auto; max-height: 280px; overflow-y: auto;">
                <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; text-align: right;">
                  <thead style="position: sticky; top: 0; background: var(--surface-alt); z-index: 1;">
                    <tr style="border-bottom: 1px solid var(--border);">
                      <th style="padding: 0.4rem 0.6rem; text-align: center;">Year</th>
                      <th style="padding: 0.4rem 0.6rem;">Start Balance</th>
                      <th style="padding: 0.4rem 0.6rem; color: #3b82f6;">Principal Paid</th>
                      <th style="padding: 0.4rem 0.6rem; color: #ef4444;">Interest Paid</th>
                      <th style="padding: 0.4rem 0.6rem; color: var(--fg);">Ending Balance</th>
                    </tr>
                  </thead>
                  <tbody id="mg-sched-tbody">
                    <!-- Populated dynamically -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopyMG" onclick="copyMortgageSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Complete Mortgage PITI Breakdown &amp; Payoff Schedule
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
                <div id="mg-step-1" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  Where M = Monthly Payment, P = Loan Principal ($400,000 - $80,000 = $320,000), r = Monthly interest rate (6.75% / 12 = 0.005625), n = Total payments (30 &times; 12 = 360 months).
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 2: Base Monthly Payment (Principal &amp; Interest)</strong>
                <div id="mg-step-2" style="color: #3b82f6; margin-top: 0.25rem;">
                  M = $320,000 &times; 0.006486 = <strong>$2,075.52 / month</strong>.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981; font-weight: 700;">Step 3: Escrow Expenses (Taxes + Insurance + PMI)</strong>
                <div id="mg-step-3" style="color: #10b981; margin-top: 0.25rem;">
                  Tax ($400/mo) + Insurance ($125/mo) = $525/mo &bull; Total PITI = $2,075.52 + $525 = <strong>$2,600.52 / month</strong>.
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Mortgage Pitfalls & Hidden Costs -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Mortgage Pitfalls &amp; Hidden Homeowner Costs</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Front-Loaded Amortization Trap:</strong> In the first year of a 30-year 6.75% mortgage, over <strong>86% of your monthly payment goes directly to interest</strong> ($1,800 interest vs only $275 principal). You do not start paying more principal than interest until year 19!</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The PITI Escrow Shock:</strong> Principal and Interest (P&amp;I) is only part of homeownership. Property taxes, homeowners hazard insurance, and PMI (Private Mortgage Insurance if down payment is under 20%) typically add <strong>$400 to $900+ per month</strong> to your actual out-of-pocket housing payment.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The 1-Extra-Payment Acceleration Strategy:</strong> Paying just one extra monthly payment per year (or adding $150–$250/mo to principal) applies 100% directly to reducing loan principal. On a $320,000 loan, this cuts <strong>4.8 years off your mortgage</strong> and saves over <strong>$70,000 in interest</strong>.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Discount Points vs. Larger Down Payment:</strong> Paying "discount points" upfront to buy down interest rates (typically 1 point = 1% of loan amount for ~0.25% rate reduction) requires 5 to 7 years to break even. If you refinance or move within 5 years, paying points is a guaranteed financial loss.</li>
            </ul>
          </div>
        </div>

        <script>
          window.setMGDownPct = function(pct) {
            var price = parseFloat(document.getElementById('mg-price').value) || 0;
            var downD = price * (pct / 100);
            document.getElementById('mg-down-d').value = Math.round(downD);
            document.getElementById('mg-down-p').value = pct;
            recalcMG();
          };

          function recalcMG(source) {
            var price = parseFloat(document.getElementById('mg-price').value) || 0;
            var downD = parseFloat(document.getElementById('mg-down-d').value) || 0;
            var downP = parseFloat(document.getElementById('mg-down-p').value) || 0;

            if (source === 'price' || source === 'down-p') {
              downD = price * (downP / 100);
              document.getElementById('mg-down-d').value = Math.round(downD);
            } else if (source === 'down-d') {
              downP = price > 0 ? ((downD / price) * 100) : 0;
              document.getElementById('mg-down-p').value = downP.toFixed(1);
            }

            var P = Math.max(0, price - downD);
            var annualRate = parseFloat(document.getElementById('mg-rate').value) || 0;
            var r = (annualRate / 100) / 12;
            var years = parseInt(document.getElementById('mg-term').value, 10) || 30;
            var totalMonths = years * 12;

            var extraPay = parseFloat(document.getElementById('mg-extra').value) || 0;
            var taxRate = (parseFloat(document.getElementById('mg-tax-rate').value) || 0) / 100;
            var insYr = parseFloat(document.getElementById('mg-ins-yr').value) || 0;
            var pmiRate = (parseFloat(document.getElementById('mg-pmi-rate').value) || 0) / 100;
            var hoa = parseFloat(document.getElementById('mg-hoa').value) || 0;

            // Monthly base P&I
            var M = 0;
            if (r > 0) {
              M = (P * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
            } else {
              M = P / totalMonths;
            }

            // Escrow costs
            var monthlyTax = (price * taxRate) / 12;
            var monthlyIns = insYr / 12;
            var ltv = price > 0 ? (P / price) * 100 : 0;
            var monthlyPmi = (ltv > 80 && pmiRate > 0) ? ((P * pmiRate) / 12) : 0;

            var totalMonthly = M + monthlyTax + monthlyIns + monthlyPmi + hoa;

            // Calculate standard amortization vs extra payment amortization
            var standardTotalInterest = (M * totalMonths) - P;

            // Extra payment simulation
            var balanceWithExtra = P;
            var monthsWithExtra = 0;
            var totalInterestWithExtra = 0;

            while (balanceWithExtra > 0.01 && monthsWithExtra < totalMonths) {
              monthsWithExtra++;
              var curInterest = balanceWithExtra * r;
              var curPrincipal = (M - curInterest) + extraPay;

              if (curPrincipal > balanceWithExtra) {
                curPrincipal = balanceWithExtra;
              }

              totalInterestWithExtra += curInterest;
              balanceWithExtra -= curPrincipal;
            }

            var monthsSaved = totalMonths - monthsWithExtra;
            var yearsSaved = (monthsSaved / 12).toFixed(1);
            var interestSaved = Math.max(0, standardTotalInterest - totalInterestWithExtra);

            // Update Hero Outputs
            document.getElementById('mg-monthly-total').textContent = '$' + Math.round(totalMonthly).toLocaleString('en-US') + ' / mo';
            document.getElementById('mg-pi-only').textContent = 'P&I: $' + Math.round(M).toLocaleString('en-US') + ' • Escrow: $' + Math.round(monthlyTax + monthlyIns + monthlyPmi + hoa).toLocaleString('en-US');

            document.getElementById('mg-interest-total').textContent = '$' + Math.round(standardTotalInterest).toLocaleString('en-US');
            var intRatio = P > 0 ? ((standardTotalInterest / P) * 100).toFixed(1) : 0;
            document.getElementById('mg-ratio-interest').textContent = intRatio + '% of original loan borrowed';

            document.getElementById('mg-principal-out').textContent = '$' + Math.round(P).toLocaleString('en-US');
            document.getElementById('mg-ltv-disp').textContent = 'LTV: ' + ltv.toFixed(1) + '% • Down: $' + Math.round(downD).toLocaleString('en-US');

            // Savings banner
            var banner = document.getElementById('mg-savings-banner');
            if (extraPay > 0 && monthsSaved > 0) {
              banner.innerHTML = '<span style="color: #10b981; font-weight: bold;">🚀 ACCELERATED PAYOFF IMPACT:</span> Adding <strong>$' + extraPay + '/month</strong> extra principal cuts <strong style="color: #10b981;">' + yearsSaved + ' Years (' + monthsSaved + ' payments)</strong> off your loan and saves <strong style="color: #10b981;">$' + Math.round(interestSaved).toLocaleString('en-US') + ' in total interest</strong>!';
              banner.style.display = 'block';
            } else if (extraPay > 0) {
              banner.innerHTML = 'Extra monthly principal applies directly to pay off your mortgage faster.';
              banner.style.display = 'block';
            } else {
              banner.style.display = 'none';
            }

            // Stacked bar
            if (totalMonthly > 0) {
              var firstMonthInterest = P * r;
              var firstMonthPrincipal = Math.max(0, M - firstMonthInterest);

              var pPct = (firstMonthPrincipal / totalMonthly) * 100;
              var iPct = (firstMonthInterest / totalMonthly) * 100;
              var taxPct = (monthlyTax / totalMonthly) * 100;
              var insPct = (monthlyIns / totalMonthly) * 100;
              var pmiPct = (monthlyPmi / totalMonthly) * 100;

              document.getElementById('mg-bar-p').style.width = pPct.toFixed(1) + '%';
              document.getElementById('mg-bar-i').style.width = iPct.toFixed(1) + '%';
              document.getElementById('mg-bar-tax').style.width = taxPct.toFixed(1) + '%';
              document.getElementById('mg-bar-ins').style.width = insPct.toFixed(1) + '%';
              document.getElementById('mg-bar-pmi').style.width = pmiPct.toFixed(1) + '%';

              document.getElementById('mg-bar-label').textContent = '$' + Math.round(totalMonthly).toLocaleString('en-US') + ' / month (PITI)';
            }

            // Generate Amortization Table (Standard schedule)
            document.getElementById('mg-sched-summary').textContent = years + ' Years (' + totalMonths + ' Payments)';
            var curBal = P;
            var tbody = document.getElementById('mg-sched-tbody');
            var tbHtml = '';

            for (var y = 1; y <= years; y++) {
              var startYBal = curBal;
              var princPaidThisYear = 0;
              var intPaidThisYear = 0;

              for (var m = 1; m <= 12; m++) {
                if (curBal <= 0) break;
                var curMInt = curBal * r;
                var curMPrinc = Math.min(curBal, M - curMInt);
                intPaidThisYear += curMInt;
                princPaidThisYear += curMPrinc;
                curBal -= curMPrinc;
              }

              tbHtml += '<tr style="border-bottom: 1px solid var(--border);">' +
                '<td style="padding: 0.4rem 0.6rem; text-align: center; font-weight: bold; color: var(--text-muted);">' + y + '</td>' +
                '<td style="padding: 0.4rem 0.6rem;">$' + Math.round(startYBal).toLocaleString('en-US') + '</td>' +
                '<td style="padding: 0.4rem 0.6rem; color: #3b82f6; font-weight: bold;">$' + Math.round(princPaidThisYear).toLocaleString('en-US') + '</td>' +
                '<td style="padding: 0.4rem 0.6rem; color: #ef4444;">$' + Math.round(intPaidThisYear).toLocaleString('en-US') + '</td>' +
                '<td style="padding: 0.4rem 0.6rem; font-weight: bold; color: var(--fg);">$' + Math.round(curBal).toLocaleString('en-US') + '</td>' +
                '</tr>';

              if (curBal <= 0) break;
            }
            tbody.innerHTML = tbHtml;

            // Step text
            document.getElementById('mg-step-1').innerHTML = 'Where M = Monthly Payment, P = $' + Math.round(P).toLocaleString('en-US') + ', r = ' + (annualRate / 12).toFixed(4) + '%, n = ' + totalMonths + ' months.';
            document.getElementById('mg-step-2').innerHTML = 'M = $' + Math.round(P).toLocaleString('en-US') + ' &times; ' + ((M / P)).toFixed(6) + ' = <strong>$' + M.toFixed(2) + ' / month (Principal &amp; Interest)</strong>.';
            document.getElementById('mg-step-3').innerHTML = 'Taxes ($' + Math.round(monthlyTax) + ') + Insurance ($' + Math.round(monthlyIns) + ')' + (monthlyPmi > 0 ? ' + PMI ($' + Math.round(monthlyPmi) + ')' : '') + (hoa > 0 ? ' + HOA ($' + hoa + ')' : '') + ' = <strong>$' + Math.round(totalMonthly).toLocaleString('en-US') + ' Total Monthly PITI</strong>.';
          }

          window.copyMortgageSummary = function() {
            var price = document.getElementById('mg-price').value;
            var down = document.getElementById('mg-down-d').value;
            var rate = document.getElementById('mg-rate').value;
            var term = document.getElementById('mg-term').value;
            var totalMonthly = document.getElementById('mg-monthly-total').textContent;
            var pi = document.getElementById('mg-pi-only').textContent;
            var totalInterest = document.getElementById('mg-interest-total').textContent;
            var principal = document.getElementById('mg-principal-out').textContent;

            var text = [
              '=== MORTGAGE & PITI PAYMENT SUMMARY ===',
              'Home Purchase Price: $' + parseFloat(price).toLocaleString('en-US'),
              'Down Payment: $' + parseFloat(down).toLocaleString('en-US'),
              'Loan Principal Borrowed: ' + principal,
              'Interest Rate: ' + rate + '% APR (' + term + '-Year Fixed)',
              '--------------------------------------',
              'Total Monthly Payment (PITI): ' + totalMonthly,
              pi,
              'Total Lifetime Interest Paid: ' + totalInterest,
              '--------------------------------------',
              'Standard: Universal Banking Amortization Equation',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/mortgage-calculator'
            ].join('\n');

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyMG');
              if (btn) {
                var old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Mortgage Breakdown!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() { recalcMG(); });
          recalcMG();
        </script>
      `
    },
    {
      slug: 'tip-calculator',
      title: 'Tip & Bill Split Calculator (Pre-Tax vs Post-Tax & Dollar Rounding)',
      metaDesc: 'Calculate restaurant tips accurately on pre-tax subtotal, sales tax, split the bill evenly per person, and round up to whole dollars for cash or Venmo.',
      category: 'Math & Finance',
      faq: [
        { q: 'Should you calculate tip on the pre-tax subtotal or post-tax total?', a: 'Proper dining etiquette (endorsed by the Emily Post Institute and restaurant industry standards) dictates that gratuity should be calculated on the pre-tax food and beverage subtotal. Sales tax is a mandatory government levy that does not reflect service quality; tipping on tax means you are paying gratuity on government taxes.' },
        { q: 'What is the standard tipping percentage for dining in the United States?', a: 'In the United States, 15% is considered baseline for acceptable service, 18% to 20% is standard for good to great table service, and 22% to 25% is customary for exceptional hospitality or fine dining. For takeout or counter service where no seated hospitality is provided, 0% to 10% is typical.' },
        { q: 'How does the calculator round up to whole dollars for Venmo or cash?', a: 'The calculator provides rounding options to eliminate awkward cent amounts ($0.37, $0.89). You can choose to round up the tip amount to the nearest whole dollar or round up each person\'s final payment to the nearest whole dollar or nearest $5, making split cash payments and digital transfers seamless.' },
        { q: 'What is an automatic service charge and should I tip on top of it?', a: 'Many restaurants automatically add an 18% to 20% gratuity or \'service charge\' for large parties (typically 6 or more guests) or in certain urban areas. Always inspect your itemized bill before tipping: if an automatic gratuity or service charge is already included in the total, you do not need to add another 20% tip unless you wish to provide an extra discretionary bonus.' },
        { q: 'How does tipping etiquette vary internationally (Europe, Japan, Australia)?', a: 'In Europe (UK, France, Italy), a 10%–12.5% discretionary service charge is often included, or rounding up the bill is customary because servers earn statutory living wages. In Australia and New Zealand, tipping is entirely optional (0%–10%). In Japan and South Korea, tipping is culturally taboo and can be perceived as an insult to the professional pride of the staff.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math &amp; Calculators</a> &gt; Tip Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Tip &amp; Bill Split Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Calculate restaurant tips, sales tax, equal or itemized bill splits, and whole-dollar roundups. Adheres to dining etiquette by supporting pre-tax subtotal gratuity calculations.
          </p>

          <div class="tool-box">
            <!-- Quick Tip Preset Buttons -->
            <div style="margin-bottom: 1.25rem;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem; font-weight: 600;">
                Quick Gratuity Presets:
              </div>
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                <button type="button" class="btn-sec" onclick="setTipPct(10)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">10% (Buffet/Fair)</button>
                <button type="button" class="btn-sec" onclick="setTipPct(15)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">15% (Baseline)</button>
                <button type="button" class="btn-sec" onclick="setTipPct(18)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">18% (Good)</button>
                <button type="button" class="btn-sec" onclick="setTipPct(20)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem; border-color: #10b981; color: #10b981; font-weight: bold;">20% (Standard Great)</button>
                <button type="button" class="btn-sec" onclick="setTipPct(22)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">22% (Fine Dining)</button>
                <button type="button" class="btn-sec" onclick="setTipPct(25)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">25% (VIP Hospitality)</button>
              </div>
            </div>

            <!-- Primary Inputs Grid -->
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Bill Subtotal ($ USD)</label>
                <input type="number" id="tip-bill" class="code-input" value="95.00" min="0" step="0.5" oninput="calcTip()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Sales Tax Rate (%)</label>
                <input type="number" id="tip-tax-pct" class="code-input" value="8.50" min="0" max="30" step="0.1" oninput="calcTip()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Tip Percentage (%)</label>
                <input type="number" id="tip-pct" class="code-input" value="20" min="0" max="100" step="0.5" oninput="calcTip()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Gratuity Base</label>
                <select id="tip-base" class="code-input" onchange="calcTip()" style="font-size: 0.95rem;">
                  <option value="pre" selected>Pre-Tax Subtotal (Etiquette Standard)</option>
                  <option value="post">Post-Tax Total (Higher Tip)</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Number of People Splitting</label>
                <input type="number" id="tip-people" class="code-input" value="3" min="1" max="50" step="1" oninput="calcTip()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Cash / Venmo Rounding</label>
                <select id="tip-round" class="code-input" onchange="calcTip()" style="font-size: 0.95rem;">
                  <option value="none" selected>Exact Cents ($0.01 Precision)</option>
                  <option value="round-person">Round Up Per Person to Whole $1</option>
                  <option value="round-5">Round Up Per Person to Nearest $5</option>
                  <option value="round-tip">Round Up Tip to Whole $1</option>
                </select>
              </div>
            </div>

            <!-- Hero Output Results Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Per Person</div>
                <div id="tip-per-person" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">$40.70</div>
                <div id="tip-per-person-sub" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">$6.33 tip + $2.69 tax + $31.67 meal</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Tip Amount</div>
                <div id="tip-amount-out" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">$19.00</div>
                <div id="tip-base-savings" style="font-size: 0.82rem; color: #10b981; font-family: var(--mono);">Pre-tax tip saves $1.62 vs post-tax</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Grand Total Bill</div>
                <div id="tip-total-out" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: var(--fg); margin: 0.25rem 0;">$122.08</div>
                <div id="tip-tax-out" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">Includes $8.08 sales tax (8.5%)</div>
              </div>
            </div>

            <!-- Visual Receipt Breakdown Waterfall Bar -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">
                <span>Itemized Receipt Share Breakdown:</span>
                <span id="tip-bar-summary" style="color: var(--fg); font-weight: bold;">Grand Total: $122.08 (100%)</span>
              </div>
              <div style="display: flex; width: 100%; height: 26px; border-radius: 4px; overflow: hidden; font-family: var(--mono); font-size: 0.72rem; font-weight: bold; color: #fff; text-align: center; line-height: 26px;">
                <div id="tip-bar-food" style="width: 77.8%; background: #10b981;" title="Food & Drinks Subtotal">Food Subtotal ($95.00)</div>
                <div id="tip-bar-tax" style="width: 6.6%; background: #64748b;" title="Sales Tax">Tax</div>
                <div id="tip-bar-tip" style="width: 15.6%; background: #3b82f6;" title="Gratuity">Tip ($19.00)</div>
              </div>
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted);">
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #10b981; border-radius: 2px;"></span> Food &amp; Beverage Subtotal</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #64748b; border-radius: 2px;"></span> Government Sales Tax</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #3b82f6; border-radius: 2px;"></span> Staff Gratuity Tip</span>
              </div>
            </div>

            <!-- Global Tipping Etiquette Reference Table -->
            <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <h4 style="margin: 0 0 0.75rem; font-family: var(--serif); font-size: 1.1rem; color: var(--fg);">
                🌍 Global Dining Gratuity Etiquette Cheat Sheet:
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.8rem;">
                <div style="background: var(--surface); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <strong style="color: #ef4444; display: block; margin-bottom: 0.25rem;">🇺🇸 United States &amp; Canada</strong>
                  <div style="color: var(--fg); font-weight: bold;">18% – 22% Expected</div>
                  <div style="color: var(--text-muted); font-size: 0.72rem; margin-top: 0.2rem;">Servers rely on tips due to tipped subminimum wage laws. 15% is bare minimum.</div>
                </div>

                <div style="background: var(--surface); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <strong style="color: #3b82f6; display: block; margin-bottom: 0.25rem;">🇬🇧 UK &amp; Western Europe</strong>
                  <div style="color: var(--fg); font-weight: bold;">10% – 12.5% Optional</div>
                  <div style="color: var(--text-muted); font-size: 0.72rem; margin-top: 0.2rem;">Often auto-included as 'Servizio/Service'. Full statutory minimum wages paid.</div>
                </div>

                <div style="background: var(--surface); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <strong style="color: #10b981; display: block; margin-bottom: 0.25rem;">🇯🇵 Japan &amp; South Korea</strong>
                  <div style="color: var(--fg); font-weight: bold;">0% (Strictly Taboo)</div>
                  <div style="color: var(--text-muted); font-size: 0.72rem; margin-top: 0.2rem;">Exceptional service is standard culture. Leaving cash on table can be perceived as an insult.</div>
                </div>

                <div style="background: var(--surface); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <strong style="color: #f59e0b; display: block; margin-bottom: 0.25rem;">🇦🇺 Australia &amp; New Zealand</strong>
                  <div style="color: var(--fg); font-weight: bold;">0% – 10% Discretionary</div>
                  <div style="color: var(--text-muted); font-size: 0.72rem; margin-top: 0.2rem;">High baseline wages. Tips are only left for standout restaurant hospitality.</div>
                </div>
              </div>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopyTip" onclick="copyTipSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Itemized Dining Bill &amp; Venmo Split Report
            </button>
          </div>

          <!-- Step-by-Step Worked Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Gratuity &amp; Bill Derivation</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Etiquette Standard</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Gratuity and equal share derivation based on your bill inputs:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">1. Sales Tax Assessment:</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">Tax = Subtotal &times; (Tax Rate / 100)</div>
                <div id="tip-step-tax" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  Worked: $95.00 &times; (8.50 / 100) = <strong>$8.08</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">2. Tip Calculation (Pre-Tax Standard):</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">Tip = Base &times; (Tip Rate / 100)</div>
                <div id="tip-step-tip" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  Worked: $95.00 &times; 20% = <strong>$19.00</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981; font-weight: 700;">3. Grand Total &amp; Per Person Division:</strong>
                <div id="tip-step-total" style="color: #10b981; margin-top: 0.25rem;">
                  Total = $95.00 + $8.08 + $19.00 = $122.08 &bull; Split 3 ways: <strong>$40.70 per person</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Pitfalls & Dining Gotchas -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Dining Pitfalls &amp; Tip Traps</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Double-Tipping Auto-Gratuity Trap:</strong> For parties of 6 or more, restaurants almost universally add an automatic 18% or 20% gratuity onto the bill. Many diners inadvertently sign the merchant credit card slip and add another 20% tip, unintentionally tipping 40% on their meal. Always review itemized lines before signing.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Point-of-Sale (POS) Tip Creep:</strong> Tablet checkout terminals (Toast, Square, Clover) calculate recommended tip percentages on the post-tax, post-fee grand total by default, rather than the pre-tax food cost. On a $100 food order with 10% tax and a 3% card fee, a "20% tip" prompt charges $22.60 instead of $20.00.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Mandatory Service Fees vs Gratuity:</strong> In some jurisdictions (e.g. California, New York), restaurants assess a 3% to 5% "kitchen wellness" or "employee health fee". Legally, these fees belong to the restaurant owners and are NOT gratuities distributed directly to waitstaff. Ask your server if the fee reaches their pocket.</li>
            </ul>
          </div>
        </div>

        <script>
          window.setTipPct = function(pct) {
            document.getElementById('tip-pct').value = pct;
            calcTip();
          };

          function calcTip() {
            const bill = parseFloat(document.getElementById('tip-bill').value) || 0;
            const taxPct = (parseFloat(document.getElementById('tip-tax-pct').value) || 0) / 100;
            const tipPct = (parseFloat(document.getElementById('tip-pct').value) || 0) / 100;
            const baseMode = document.getElementById('tip-base').value;
            const people = parseInt(document.getElementById('tip-people').value, 10) || 1;
            const roundMode = document.getElementById('tip-round').value;

            const taxAmount = bill * taxPct;
            let tipAmount = 0;

            if (baseMode === 'pre') {
              tipAmount = bill * tipPct;
            } else {
              tipAmount = (bill + taxAmount) * tipPct;
            }

            // Post-tax difference savings
            const postTaxTip = (bill + taxAmount) * tipPct;
            const preTaxTip = bill * tipPct;
            const diffSavings = postTaxTip - preTaxTip;

            if (baseMode === 'pre' && diffSavings > 0.05) {
              document.getElementById('tip-base-savings').textContent = 'Pre-tax tip saves $' + diffSavings.toFixed(2) + ' vs post-tax';
              document.getElementById('tip-base-savings').style.color = '#10b981';
            } else {
              document.getElementById('tip-base-savings').textContent = 'Calculated on post-tax total';
              document.getElementById('tip-base-savings').style.color = 'var(--text-muted)';
            }

            // Rounding logic
            if (roundMode === 'round-tip') {
              tipAmount = Math.ceil(tipAmount);
            }

            let totalBill = bill + taxAmount + tipAmount;
            let perPerson = totalBill / people;

            if (roundMode === 'round-person') {
              perPerson = Math.ceil(perPerson);
              totalBill = perPerson * people;
              tipAmount = Math.max(0, totalBill - bill - taxAmount);
            } else if (roundMode === 'round-5') {
              perPerson = Math.ceil(perPerson / 5) * 5;
              totalBill = perPerson * people;
              tipAmount = Math.max(0, totalBill - bill - taxAmount);
            }

            const tipPerPerson = tipAmount / people;
            const taxPerPerson = taxAmount / people;
            const mealPerPerson = bill / people;

            // DOM Updates
            document.getElementById('tip-per-person').textContent = '$' + perPerson.toFixed(2);
            document.getElementById('tip-amount-out').textContent = '$' + tipAmount.toFixed(2);
            document.getElementById('tip-total-out').textContent = '$' + totalBill.toFixed(2);

            document.getElementById('tip-per-person-sub').textContent = '$' + tipPerPerson.toFixed(2) + ' tip + $' + taxPerPerson.toFixed(2) + ' tax + $' + mealPerPerson.toFixed(2) + ' meal';
            document.getElementById('tip-tax-out').textContent = 'Includes $' + taxAmount.toFixed(2) + ' sales tax (' + (taxPct * 100).toFixed(1) + '%)';

            // Waterfall Bar
            if (totalBill > 0) {
              const foodPct = (bill / totalBill) * 100;
              const taxP = (taxAmount / totalBill) * 100;
              const tipP = (tipAmount / totalBill) * 100;

              document.getElementById('tip-bar-food').style.width = foodPct.toFixed(1) + '%';
              document.getElementById('tip-bar-tax').style.width = taxP.toFixed(1) + '%';
              document.getElementById('tip-bar-tip').style.width = tipP.toFixed(1) + '%';

              document.getElementById('tip-bar-food').textContent = 'Food ($' + bill.toFixed(2) + ')';
              document.getElementById('tip-bar-tip').textContent = 'Tip ($' + tipAmount.toFixed(2) + ')';
              document.getElementById('tip-bar-summary').textContent = 'Grand Total: $' + totalBill.toFixed(2) + ' (100%)';
            }

            // Steps
            document.getElementById('tip-step-tax').innerHTML = '$' + bill.toFixed(2) + ' &times; ' + (taxPct * 100).toFixed(2) + '% = <strong>$' + taxAmount.toFixed(2) + '</strong>';
            document.getElementById('tip-step-tip').innerHTML = (baseMode === 'pre' ? '$' + bill.toFixed(2) : '$' + (bill + taxAmount).toFixed(2)) + ' &times; ' + (tipPct * 100).toFixed(1) + '% = <strong>$' + tipAmount.toFixed(2) + '</strong>';
            document.getElementById('tip-step-total').innerHTML = 'Total = $' + bill.toFixed(2) + ' + $' + taxAmount.toFixed(2) + ' + $' + tipAmount.toFixed(2) + ' = $' + totalBill.toFixed(2) + ' &bull; Split ' + people + ' ways: <strong>$' + perPerson.toFixed(2) + ' per person</strong>';
          }

          window.copyTipSummary = function() {
            const bill = document.getElementById('tip-bill').value;
            const perPerson = document.getElementById('tip-per-person').textContent;
            const tip = document.getElementById('tip-amount-out').textContent;
            const total = document.getElementById('tip-total-out').textContent;
            const people = document.getElementById('tip-people').value;
            const tax = document.getElementById('tip-tax-out').textContent;

            const text = [
              '=== DINING BILL & TIP SPLIT SUMMARY ===',
              'Bill Subtotal: $' + parseFloat(bill).toFixed(2),
              tax,
              'Total Tip: ' + tip,
              'Grand Total Bill: ' + total,
              '--------------------------------------',
              'Number of People: ' + people,
              'Total Payment Per Person: ' + perPerson,
              '--------------------------------------',
              'Etiquette Standard: Pre-Tax Subtotal Gratuity',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/tip-calculator'
            ].join('\n');

            navigator.clipboard.writeText(text).then(function() {
              const btn = document.getElementById('btnCopyTip');
              if (btn) {
                const old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Dining Split Report!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() { calcTip(); });
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
      title: 'Fraction to Decimal Converter (with Repeating Decimals & Tape Measure)',
      metaDesc: 'Convert proper, improper, and mixed fractions into decimals, percentages, and millimeter equivalents. Detects repeating decimals and plots on an interactive tape measure.',
      category: 'Math & Units',
      faq: [
        { q: 'How do you convert a fraction to a decimal?', a: 'To convert any fraction to a decimal, divide the numerator (top number) by the denominator (bottom number): Decimal = Numerator ÷ Denominator. For a mixed number (such as 2 3/4), convert the fraction part (3 ÷ 4 = 0.75) and add it to the whole number (2 + 0.75 = 2.75).' },
        { q: 'How do you know if a fraction produces a terminating or repeating decimal?', a: 'In a fully reduced fraction (where numerator and denominator share no common factors), the decimal will terminate if and only if the prime factorization of the denominator contains ONLY 2s, 5s, or both (such as 1/2, 1/4, 1/5, 1/8, 1/10). If the denominator contains any other prime factor (such as 3, 7, 11, 13), the decimal will repeat infinitely.' },
        { q: 'What is 3/8 as a decimal and on a tape measure?', a: '3/8 as a decimal is exactly 0.375 (3 ÷ 8 = 0.375, or 37.5%). On an imperial construction tape measure, 3/8 of an inch equals exactly 6 sixteenths (6/16\"), 12 thirty-seconds (12/32\"), or 9.525 millimeters.' },
        { q: 'How do you convert an improper fraction to a mixed number and decimal?', a: 'Divide the numerator by the denominator using integer division. The quotient becomes the whole number, and the remainder becomes the new numerator over the original denominator. For example, 17/5: 17 ÷ 5 = 3 with remainder 2, which equals the mixed number 3 2/5, or 3.40 as a decimal.' },
        { q: 'Why do fractions like 1/3 and 1/7 repeat forever?', a: 'Because our base-10 number system is built on powers of 10 (prime factors 2 and 5), any fraction whose denominator cannot evenly divide a power of 10 produces an infinite recurring cycle. 1/3 produces a single repeating digit (0.333...), while 1/7 produces a 6-digit recurring period (0.142857142857...).' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math &amp; Calculators</a> &gt; Fraction to Decimal
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Fraction to Decimal Converter</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Convert proper fractions, improper fractions, and mixed numbers into exact decimals, percentages, and millimeter equivalents. Features automated repeating decimal period detection and interactive tape measure snapping.
          </p>

          <div class="tool-box">
            <!-- Input Fraction Form -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div class="field-group">
                <label class="field-label">Whole Number (Optional)</label>
                <input type="number" id="f2d-whole" class="code-input" placeholder="e.g. 2" oninput="calcF2D()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Numerator (Top)</label>
                <input type="number" id="f2d-num" class="code-input" value="3" oninput="calcF2D()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Denominator (Bottom)</label>
                <input type="number" id="f2d-den" class="code-input" value="8" min="1" oninput="calcF2D()" style="font-size: 1.25rem;" />
              </div>
            </div>

            <!-- Quick Fraction Presets -->
            <div style="margin-top: 1rem;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem; font-weight: 600;">
                Common Construction &amp; Math Presets:
              </div>
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                <button type="button" class="btn-sec" onclick="setF2D(0, 1, 2)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">1/2 (0.5)</button>
                <button type="button" class="btn-sec" onclick="setF2D(0, 1, 3)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">1/3 (0.333...)</button>
                <button type="button" class="btn-sec" onclick="setF2D(0, 1, 4)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">1/4 (0.25)</button>
                <button type="button" class="btn-sec" onclick="setF2D(0, 3, 8)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem; border-color: #10b981; color: #10b981; font-weight: bold;">3/8 (0.375)</button>
                <button type="button" class="btn-sec" onclick="setF2D(0, 5, 8)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">5/8 (0.625)</button>
                <button type="button" class="btn-sec" onclick="setF2D(0, 7, 16)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">7/16 (0.4375)</button>
                <button type="button" class="btn-sec" onclick="setF2D(1, 3, 4)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">1 3/4 (1.75)</button>
                <button type="button" class="btn-sec" onclick="setF2D(0, 1, 7)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">1/7 (Repeating 6)</button>
              </div>
            </div>

            <!-- Hero Output Results Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Exact Decimal Equivalent</div>
                <div id="f2d-dec-hero" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">0.375</div>
                <div id="f2d-type-badge" style="font-size: 0.82rem; color: #10b981; font-family: var(--mono); font-weight: bold;">Terminating Decimal</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Percentage &amp; Metric (mm)</div>
                <div id="f2d-pct-hero" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">37.50%</div>
                <div id="f2d-mm-sub" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">3/8" = 9.525 mm</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Simplified &amp; Improper Form</div>
                <div id="f2d-simplified-hero" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: var(--fg); margin: 0.25rem 0;">3/8</div>
                <div id="f2d-improper-sub" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">Fully Reduced Form (GCD: 1)</div>
              </div>
            </div>

            <!-- Interactive Visual Imperial Tape Measure Ruler (1 Inch Span) -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <h4 style="font-family: var(--serif); font-size: 1.05rem; margin: 0; color: var(--fg);">
                  📏 Construction Tape Measure Position (0" to 1" Span):
                </h4>
                <span id="f2d-ruler-reading" style="font-family: var(--mono); font-size: 0.75rem; color: #10b981; font-weight: bold;">Position: 3/8" (0.375")</span>
              </div>

              <div style="position: relative; width: 100%; height: 50px; background: #fbbf24; border: 2px solid #b45309; border-radius: 4px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Dynamic SVG Ruler Marks -->
                <svg id="f2d-tape-svg" width="100%" height="50" style="display: block;"></svg>

                <!-- Indicator Needle Marker -->
                <div id="f2d-ruler-needle" style="position: absolute; top: 0; left: 37.5%; transform: translateX(-50%); width: 3px; height: 100%; background: #ef4444; z-index: 2; transition: left 0.2s ease;"></div>
              </div>

              <div style="display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted); margin-top: 0.4rem;">
                <span>0" (0.000)</span>
                <span>1/4" (0.250)</span>
                <span>1/2" (0.500)</span>
                <span>3/4" (0.750)</span>
                <span>1" (1.000)</span>
              </div>
            </div>

            <!-- Precision Metric & Tape Measure Equivalents Table -->
            <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <h4 style="margin: 0 0 0.75rem; font-family: var(--serif); font-size: 1.1rem; color: var(--fg);">
                📋 Standard Fraction to Decimal &amp; Metric Conversion Table:
              </h4>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; text-align: center;">
                  <thead>
                    <tr style="background: var(--surface); border-bottom: 1px solid var(--border);">
                      <th style="padding: 0.45rem; text-align: left;">Fraction</th>
                      <th style="padding: 0.45rem; color: #10b981;">Exact Decimal</th>
                      <th style="padding: 0.45rem; color: #3b82f6;">Millimeters (mm)</th>
                      <th style="padding: 0.45rem; color: var(--text-muted);">16ths / 32nds</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem; text-align: left; font-weight: bold;">1/16"</td><td>0.0625</td><td>1.5875 mm</td><td style="color: var(--text-muted);">1/16" = 2/32"</td></tr>
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem; text-align: left; font-weight: bold;">1/8"</td><td>0.1250</td><td>3.1750 mm</td><td style="color: var(--text-muted);">2/16" = 4/32"</td></tr>
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem; text-align: left; font-weight: bold;">3/16"</td><td>0.1875</td><td>4.7625 mm</td><td style="color: var(--text-muted);">3/16" = 6/32"</td></tr>
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem; text-align: left; font-weight: bold;">1/4"</td><td>0.2500</td><td>6.3500 mm</td><td style="color: var(--text-muted);">4/16" = 8/32"</td></tr>
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem; text-align: left; font-weight: bold;">5/16"</td><td>0.3125</td><td>7.9375 mm</td><td style="color: var(--text-muted);">5/16" = 10/32"</td></tr>
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem; text-align: left; font-weight: bold;">3/8"</td><td>0.3750</td><td>9.5250 mm</td><td style="color: var(--text-muted);">6/16" = 12/32"</td></tr>
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem; text-align: left; font-weight: bold;">1/2"</td><td>0.5000</td><td>12.7000 mm</td><td style="color: var(--text-muted);">8/16" = 16/32"</td></tr>
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem; text-align: left; font-weight: bold;">5/8"</td><td>0.6250</td><td>15.8750 mm</td><td style="color: var(--text-muted);">10/16" = 20/32"</td></tr>
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem; text-align: left; font-weight: bold;">3/4"</td><td>0.7500</td><td>19.0500 mm</td><td style="color: var(--text-muted);">12/16" = 24/32"</td></tr>
                    <tr><td style="padding: 0.4rem; text-align: left; font-weight: bold;">7/8"</td><td>0.8750</td><td>22.2250 mm</td><td style="color: var(--text-muted);">14/16" = 28/32"</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopyF2D" onclick="copyF2DSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Fraction to Decimal Conversion Report
            </button>
          </div>

          <!-- Step-by-Step Worked Long Division -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Division &amp; Period Derivation</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Long Division Algorithm</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Conversion derivation showing synthetic decimal division and recurring period analysis:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">1. Decimal Long Division:</strong>
                <div id="f2d-step-div" style="color: #3b82f6; margin-top: 0.25rem;">
                  Numerator ÷ Denominator = 3 ÷ 8 = <strong>0.375</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">2. Recurring Decimal Period Status:</strong>
                <div id="f2d-step-period" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.8rem;">
                  Denominator 8 factors into 2 &times; 2 &times; 2. Because it contains only prime factors of 2 and 5, the decimal terminates completely after 3 digits.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981; font-weight: 700;">3. Imperial &amp; Metric Invariance:</strong>
                <div id="f2d-step-metric" style="color: #10b981; margin-top: 0.25rem;">
                  0.375 in &times; 25.4 mm/in = <strong>9.525 mm</strong> &bull; Percentage: 0.375 &times; 100% = <strong>37.50%</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Mathematical Pitfalls -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Fraction &amp; Decimal Conversion Traps</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Floating-Point Truncation Error in CAD &amp; CNC:</strong> When converting 1/3" or 1/7" to decimal for CNC machining or CAD modeling, rounding to 0.33" introduces an unacceptable error of 0.0033" (over 3 thou). In tight-tolerance aerospace or engine machining, always work with exact fractions or at least 6 decimal places (0.333333").</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Base-10 Prime Factorization Rule:</strong> A fraction only terminates if its fully simplified denominator\'s prime factors are strictly 2 and/or 5. Denominators with 3, 7, 11, 13 (or multiples like 6, 12, 14, 15) repeat indefinitely.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Negative Mixed Number Trap:</strong> When evaluating a negative mixed number like -2 3/4, the negative sign applies to the ENTIRE quantity [-(2 + 3/4) = -2.75], NOT (-2 + 0.75 = -1.25).</li>
            </ul>
          </div>
        </div>

        <script>
          window.setF2D = function(w, n, d) {
            document.getElementById('f2d-whole').value = w || '';
            document.getElementById('f2d-num').value = n;
            document.getElementById('f2d-den').value = d;
            calcF2D();
          };

          function gcd(a, b) {
            a = Math.abs(a);
            b = Math.abs(b);
            while (b) {
              const t = b;
              b = a % b;
              a = t;
            }
            return a;
          }

          // Detect repeating decimal cycle
          function getDecimalRepresentation(num, den) {
            const integerPart = Math.floor(num / den);
            let remainder = num % den;
            if (remainder === 0) {
              return { isRepeating: false, text: integerPart.toString(), period: 0 };
            }

            const remainders = {};
            let decimalDigits = '';
            let index = 0;
            let repeatIndex = -1;

            while (remainder !== 0) {
              if (remainders[remainder] !== undefined) {
                repeatIndex = remainders[remainder];
                break;
              }
              remainders[remainder] = index;
              remainder *= 10;
              const digit = Math.floor(remainder / den);
              decimalDigits += digit;
              remainder %= den;
              index++;
              if (index > 200) break; // Guard against extreme periods
            }

            if (repeatIndex !== -1) {
              const nonRepeat = decimalDigits.substring(0, repeatIndex);
              const repeat = decimalDigits.substring(repeatIndex);
              return {
                isRepeating: true,
                text: integerPart + '.' + nonRepeat + '(' + repeat + ')',
                nonRepeat: nonRepeat,
                repeat: repeat,
                period: repeat.length
              };
            } else {
              return { isRepeating: false, text: integerPart + '.' + decimalDigits, period: 0 };
            }
          }

          function renderTapeMeasureSVG(decimalFraction) {
            const svg = document.getElementById('f2d-tape-svg');
            if (!svg) return;
            let html = '';
            // 16ths ticks
            for (let i = 0; i <= 16; i++) {
              const xPct = (i / 16) * 100;
              let tickH = 12; // 1/16
              let strokeW = 1;
              if (i % 8 === 0) { tickH = 28; strokeW = 2; } // 0, 1/2, 1
              else if (i % 4 === 0) { tickH = 22; strokeW = 1.5; } // 1/4, 3/4
              else if (i % 2 === 0) { tickH = 17; strokeW = 1.2; } // 1/8s

              html += '<line x1="' + xPct + '%" y1="0" x2="' + xPct + '%" y2="' + tickH + '" stroke="#78350f" stroke-width="' + strokeW + '" />';
            }
            svg.innerHTML = html;

            // Needle positioning (clamped 0 to 100%)
            const needlePct = Math.min(100, Math.max(0, decimalFraction * 100));
            document.getElementById('f2d-ruler-needle').style.left = needlePct.toFixed(2) + '%';
          }

          function calcF2D() {
            const wholeVal = document.getElementById('f2d-whole').value;
            const w = wholeVal !== '' ? parseInt(wholeVal, 10) : 0;
            let n = parseInt(document.getElementById('f2d-num').value, 10) || 0;
            let d = parseInt(document.getElementById('f2d-den').value, 10) || 1;
            if (d === 0) d = 1;

            const isNegative = w < 0 || n < 0 || d < 0;
            n = Math.abs(n);
            d = Math.abs(d);
            const absW = Math.abs(w);

            // Improper form
            const totalNumerator = (absW * d) + n;
            const decVal = totalNumerator / d;
            const signedDec = isNegative ? -decVal : decVal;

            // Simplified fraction
            const commonDiv = gcd(n, d);
            const simN = n / commonDiv;
            const simD = d / commonDiv;
            const totalDiv = gcd(totalNumerator, d);
            const simTotalN = totalNumerator / totalDiv;
            const simTotalD = d / totalDiv;

            // Recurring analysis
            const rep = getDecimalRepresentation(totalNumerator, d);

            // DOM Updates
            const heroDec = document.getElementById('f2d-dec-hero');
            const typeBadge = document.getElementById('f2d-type-badge');

            if (rep.isRepeating) {
              heroDec.innerHTML = (isNegative ? '-' : '') + rep.text.replace(/\(([0-9]+)\)/, '<span style="text-decoration: overline;">$1</span>');
              typeBadge.textContent = 'Repeating Decimal (Period: ' + rep.period + ' digits)';
              typeBadge.style.color = '#f59e0b';
            } else {
              heroDec.textContent = signedDec.toString();
              typeBadge.textContent = 'Terminating Decimal';
              typeBadge.style.color = '#10b981';
            }

            const pctVal = (signedDec * 100).toFixed(2);
            document.getElementById('f2d-pct-hero').textContent = pctVal + '%';

            const mmVal = (signedDec * 25.4).toFixed(3);
            document.getElementById('f2d-mm-sub').textContent = 'Inches to Metric: ' + mmVal + ' mm';

            // Simplified display
            if (absW > 0) {
              document.getElementById('f2d-simplified-hero').textContent = (isNegative ? '-' : '') + absW + ' ' + simN + '/' + simD;
              document.getElementById('f2d-improper-sub').textContent = 'Improper: ' + (isNegative ? '-' : '') + simTotalN + '/' + simTotalD;
            } else {
              document.getElementById('f2d-simplified-hero').textContent = (isNegative ? '-' : '') + simN + '/' + simD;
              document.getElementById('f2d-improper-sub').textContent = 'Fully Reduced Form (GCD: ' + commonDiv + ')';
            }

            // Tape measure visualization (fractional remainder between 0 and 1)
            const fractionalPart = (n / d) % 1;
            renderTapeMeasureSVG(fractionalPart);
            document.getElementById('f2d-ruler-reading').textContent = 'Position: ' + (absW > 0 ? absW + ' ' : '') + simN + '/' + simD + '" (' + signedDec.toFixed(4) + '")';

            // Steps
            document.getElementById('f2d-step-div').innerHTML = (absW > 0 ? '(' + absW + ' &times; ' + d + ' + ' + n + ') / ' + d + ' = ' : '') + totalNumerator + ' ÷ ' + d + ' = <strong>' + (rep.isRepeating ? rep.text : signedDec.toString()) + '</strong>';

            if (rep.isRepeating) {
              document.getElementById('f2d-step-period').innerHTML = 'Denominator ' + d + ' contains prime factors other than 2 and 5. This generates a repeating cycle of <strong>' + rep.period + ' digits</strong> (' + rep.repeat + ').';
            } else {
              document.getElementById('f2d-step-period').innerHTML = 'Denominator ' + d + ' factors exclusively into powers of 2 and/or 5, guaranteeing a finite terminating decimal with zero remainder.';
            }

            document.getElementById('f2d-step-metric').innerHTML = signedDec.toFixed(4) + ' in &times; 25.4 mm/in = <strong>' + mmVal + ' mm</strong> &bull; Percentage: <strong>' + pctVal + '%</strong>';
          }

          window.copyF2DSummary = function() {
            const dec = document.getElementById('f2d-dec-hero').innerText;
            const type = document.getElementById('f2d-type-badge').innerText;
            const pct = document.getElementById('f2d-pct-hero').innerText;
            const mm = document.getElementById('f2d-mm-sub').innerText;
            const sim = document.getElementById('f2d-simplified-hero').innerText;

            const text = [
              '=== FRACTION TO DECIMAL CONVERSION REPORT ===',
              'Fraction Form: ' + sim,
              'Exact Decimal: ' + dec,
              'Decimal Classification: ' + type,
              'Percentage Value: ' + pct,
              mm,
              '--------------------------------------------',
              'Standard: Pure Rational Number Mathematics',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/fraction-to-decimal'
            ].join('\n');

            navigator.clipboard.writeText(text).then(function() {
              const btn = document.getElementById('btnCopyF2D');
              if (btn) {
                const old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Conversion Report!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() { calcF2D(); });
          calcF2D();
        </script>
      `
    },
    {
      slug: 'decimal-to-fraction',
      title: 'Decimal to Fraction Converter (Simplified, Mixed & Tape Measure)',
      metaDesc: 'Convert any decimal to a fully simplified fraction or mixed number. Solves terminating and repeating decimals with nearest 16th, 32nd, and 64th tape measure snapping.',
      category: 'Math & Units',
      faq: [
        { q: 'How do you convert a terminating decimal into a simplified fraction?', a: 'Count the number of decimal places after the point (N). Place the decimal digits over 10^N (for example, 0.75 has 2 decimal places, so it becomes 75/100). Then find the greatest common divisor (GCD) of the numerator and denominator (GCD of 75 and 100 is 25) and divide both numbers to get the simplest form: 75/25 = 3 and 100/25 = 4, resulting in 3/4.' },
        { q: 'How do you convert a repeating decimal into an exact fraction?', a: 'Use algebraic substitution. Let x equal the repeating decimal (e.g., x = 0.666...). Multiply both sides by 10^k (where k is the length of the repeating cycle). For a 1-digit cycle, multiply by 10: 10x = 6.666... Subtract the first equation from the second: 10x - x = 6.666... - 0.666..., yielding 9x = 6. Divide both sides by 9 to get x = 6/9 = 2/3.' },
        { q: 'What is 0.625 as a fraction and on a tape measure?', a: '0.625 as an exact simplified fraction is 5/8 (625/1000 simplified by dividing numerator and denominator by 125). On an imperial tape measure, 0.625 inches corresponds exactly to 5/8 of an inch (or 10 sixteenths, 20 thirty-seconds, and 15.875 mm).' },
        { q: 'How does the calculator find the nearest tape measure fraction for woodworkers?', a: 'The calculator multiplies the fractional decimal part by the desired resolution denominator (16, 32, or 64), rounds to the nearest integer, and simplifies the resulting fraction. For example, for 0.385 inches: 0.385 × 16 = 6.16 &rarr; rounds to 6/16 = 3/8\" with a tiny error deviation of +0.010 inches.' },
        { q: 'Can every decimal be converted into a fraction?', a: 'Only rational numbers (terminating decimals and repeating decimals) can be converted into fractions of integers (p/q). Irrational numbers (such as Pi = 3.14159..., Euler\'s number e = 2.71828..., and the square root of 2 = 1.41421...) have infinite non-repeating decimal expansions and cannot be expressed as exact ratios of two integers.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math &amp; Calculators</a> &gt; Decimal to Fraction
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Decimal to Fraction Converter</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Convert any terminating or repeating decimal into an exact, fully simplified fraction and mixed number. Automatically calculates nearest imperial tape measure marks (16ths, 32nds, 64ths) with tolerance error.
          </p>

          <div class="tool-box">
            <!-- Input Form Grid -->
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Decimal Value to Convert</label>
                <input type="number" id="d2f-in" class="code-input" value="0.625" step="any" oninput="calcD2F()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Decimal Type</label>
                <select id="d2f-type" class="code-input" onchange="toggleD2FType()" style="font-size: 1rem;">
                  <option value="term" selected>Terminating Decimal (e.g. 0.625, 2.75)</option>
                  <option value="repeat">Repeating Decimal (e.g. 0.333..., 0.142857...)</option>
                </select>
              </div>
              <div class="field-group" id="grp-repeat-len" style="display: none;">
                <label class="field-label">Repeating Cycle Length (Digits)</label>
                <input type="number" id="d2f-repeat-len" class="code-input" value="1" min="1" max="10" step="1" oninput="calcD2F()" style="font-size: 1.25rem;" />
                <span style="font-size: 0.72rem; color: var(--text-muted);">Length of recurring pattern at end</span>
              </div>
            </div>

            <!-- Quick Decimal Presets -->
            <div style="margin-top: 1rem;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem; font-weight: 600;">
                Popular Decimal Presets:
              </div>
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                <button type="button" class="btn-sec" onclick="setD2F('0.5')" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">0.5 (1/2)</button>
                <button type="button" class="btn-sec" onclick="setD2F('0.25')" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">0.25 (1/4)</button>
                <button type="button" class="btn-sec" onclick="setD2F('0.75')" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">0.75 (3/4)</button>
                <button type="button" class="btn-sec" onclick="setD2F('0.125')" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">0.125 (1/8)</button>
                <button type="button" class="btn-sec" onclick="setD2F('0.375')" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">0.375 (3/8)</button>
                <button type="button" class="btn-sec" onclick="setD2F('0.625')" style="font-size: 0.78rem; padding: 0.35rem 0.65rem; border-color: #10b981; color: #10b981; font-weight: bold;">0.625 (5/8)</button>
                <button type="button" class="btn-sec" onclick="setD2F('0.875')" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">0.875 (7/8)</button>
                <button type="button" class="btn-sec" onclick="setD2F('2.3333333333', 'repeat', 1)" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">2.333... (2 1/3)</button>
              </div>
            </div>

            <!-- Hero Output Results Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Simplified Fraction</div>
                <div id="d2f-fraction-hero" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">5/8</div>
                <div id="d2f-improper-sub" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">Proper Fraction (5 ÷ 8)</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Mixed Number Form</div>
                <div id="d2f-mixed-hero" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">5/8</div>
                <div id="d2f-pct-sub" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">Percentage: 62.50%</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Nearest Tape Measure (16th)</div>
                <div id="d2f-tape-hero" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: var(--fg); margin: 0.25rem 0;">5/8"</div>
                <div id="d2f-tape-error" style="font-size: 0.82rem; color: #10b981; font-family: var(--mono); font-weight: bold;">Exact Match (0.000" error)</div>
              </div>
            </div>

            <!-- Tape Measure Tolerances Breakdown Card (16th, 32nd, 64th) -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <h4 style="margin: 0 0 0.75rem; font-family: var(--serif); font-size: 1.1rem; color: var(--fg);">
                📏 Woodworking &amp; Machinist Tape Measure Snapping:
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.82rem;">
                <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.72rem;">Nearest 1/16 Inch:</div>
                  <div id="d2f-snap-16" style="font-size: 1.3rem; font-weight: bold; color: var(--fg); margin: 0.2rem 0;">5/8"</div>
                  <div id="d2f-err-16" style="font-size: 0.75rem; color: #10b981;">Error: 0.0000"</div>
                </div>

                <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.72rem;">Nearest 1/32 Inch:</div>
                  <div id="d2f-snap-32" style="font-size: 1.3rem; font-weight: bold; color: var(--fg); margin: 0.2rem 0;">20/32" (5/8")</div>
                  <div id="d2f-err-32" style="font-size: 0.75rem; color: #10b981;">Error: 0.0000"</div>
                </div>

                <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: var(--text-muted); font-size: 0.72rem;">Nearest 1/64 Inch:</div>
                  <div id="d2f-snap-64" style="font-size: 1.3rem; font-weight: bold; color: var(--fg); margin: 0.2rem 0;">40/64" (5/8")</div>
                  <div id="d2f-err-64" style="font-size: 0.75rem; color: #10b981;">Error: 0.0000"</div>
                </div>
              </div>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopyD2F" onclick="copyD2FSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Decimal to Fraction Calculation &amp; Tape Snapping
            </button>
          </div>

          <!-- Step-by-Step Worked Algebraic Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Algebraic Derivation</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Euclidean Reduction</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Conversion of rational decimal to simplest integer fraction:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">1. Power of Ten Base Transformation:</strong>
                <div id="d2f-step-base" style="color: #3b82f6; margin-top: 0.25rem;">
                  0.625 has 3 decimal places &rarr; 625 / 10³ = <strong>625 / 1000</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">2. Greatest Common Divisor (GCD) Factorization:</strong>
                <div id="d2f-step-gcd" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.8rem;">
                  GCD(625, 1000) = 125 &bull; Divide numerator and denominator by 125.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981; font-weight: 700;">3. Simplified Final Fraction:</strong>
                <div id="d2f-step-final" style="color: #10b981; margin-top: 0.25rem;">
                  (625 ÷ 125) / (1000 ÷ 125) = <strong>5/8</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Mathematical Pitfalls -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Decimal to Fraction Conversion Traps</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Infinite Repeating Decimal Illusion:</strong> Entering 0.3333 into a basic calculator converts it to 3333/10000, which cannot be simplified to 1/3. If a decimal has a recurring period, you must use algebraic subtraction ($10x - x = 9x$) to find the true denominator of 9, 99, or 999.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Machinist Tolerance vs Rounding Errors:</strong> When cutting stock in a machine shop, rounding 0.387" to 3/8" (0.375") produces a 0.012" error (12 thousandths), which can easily ruin a precision press-fit bearing or sleeve. Snapping to 25/64" (0.3906") cuts the error to just 0.0036".</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Irrational Number Impossibility:</strong> Decimals originating from square roots (e.g. &radic;2 = 1.41421356...) or transcendental constants (&pi; = 3.14159...) can never be exactly converted to a fraction. Ratios like 22/7 or 355/113 are merely close approximations, not exact equivalents.</li>
            </ul>
          </div>
        </div>

        <script>
          window.setD2F = function(val, type, repeatLen) {
            document.getElementById('d2f-in').value = val;
            if (type) document.getElementById('d2f-type').value = type;
            else document.getElementById('d2f-type').value = 'term';
            if (repeatLen) document.getElementById('d2f-repeat-len').value = repeatLen;
            toggleD2FType();
            calcD2F();
          };

          window.toggleD2FType = function() {
            const mode = document.getElementById('d2f-type').value;
            const repGrp = document.getElementById('grp-repeat-len');
            if (mode === 'repeat') {
              repGrp.style.display = 'block';
            } else {
              repGrp.style.display = 'none';
            }
            calcD2F();
          };

          function gcd(a, b) {
            a = Math.abs(a);
            b = Math.abs(b);
            while (b) {
              const t = b;
              b = a % b;
              a = t;
            }
            return a;
          }

          function getNearestTapeFraction(val, denom) {
            const rounded = Math.round(val * denom);
            const common = gcd(rounded, denom);
            const n = rounded / common;
            const d = denom / common;
            const actualVal = rounded / denom;
            const error = actualVal - val;
            return {
              n: n,
              d: d,
              rawN: rounded,
              rawD: denom,
              error: error
            };
          }

          function calcD2F() {
            const rawIn = document.getElementById('d2f-in').value.trim();
            if (rawIn === '') return;

            const dec = parseFloat(rawIn) || 0;
            const isNegative = dec < 0;
            const absDec = Math.abs(dec);
            const mode = document.getElementById('d2f-type').value;

            const whole = Math.floor(absDec);
            const frac = absDec - whole;

            let n = 0;
            let d = 1;
            let stepBaseText = '';
            let stepGcdText = '';

            if (mode === 'term') {
              // Terminating decimal
              const parts = rawIn.split('.');
              const decPlaces = parts.length > 1 ? parts[1].length : 0;
              d = Math.pow(10, decPlaces);
              n = Math.round(frac * d);

              stepBaseText = rawIn + ' has ' + decPlaces + ' decimal places &rarr; ' + n + ' / 10<sup>' + decPlaces + '</sup> = <strong>' + n + ' / ' + d + '</strong>';
            } else {
              // Repeating decimal
              const repLen = parseInt(document.getElementById('d2f-repeat-len').value, 10) || 1;
              const parts = rawIn.split('.');
              const fracStr = parts.length > 1 ? parts[1] : '0';
              const nonRepLen = Math.max(0, fracStr.length - repLen);

              const denomRepeat = Math.pow(10, repLen) - 1;
              d = denomRepeat * Math.pow(10, nonRepLen);
              n = Math.round(frac * d);

              stepBaseText = 'Repeating period of ' + repLen + ' digits &rarr; Algebraic denominator: 10<sup>' + (nonRepLen + repLen) + '</sup> - 10<sup>' + nonRepLen + '</sup> = <strong>' + d + '</strong>, Numerator: <strong>' + n + '</strong>';
            }

            const common = gcd(n, d);
            const simN = n / common;
            const simD = d / common;

            // Total improper fraction
            const totalNumerator = (whole * simD) + simN;

            stepGcdText = 'GCD(' + n + ', ' + d + ') = ' + common + ' &bull; (' + n + ' ÷ ' + common + ') / (' + d + ' ÷ ' + common + ') = <strong>' + simN + '/' + simD + '</strong>';

            // Tape measure snapping
            const snap16 = getNearestTapeFraction(frac, 16);
            const snap32 = getNearestTapeFraction(frac, 32);
            const snap64 = getNearestTapeFraction(frac, 64);

            // DOM Updates
            const fracHero = document.getElementById('d2f-fraction-hero');
            const mixedHero = document.getElementById('d2f-mixed-hero');
            const improperSub = document.getElementById('d2f-improper-sub');
            const pctSub = document.getElementById('d2f-pct-sub');

            if (whole > 0) {
              fracHero.textContent = (isNegative ? '-' : '') + totalNumerator + '/' + simD;
              improperSub.textContent = 'Improper Fraction (GCD: ' + common + ')';
              mixedHero.textContent = (isNegative ? '-' : '') + whole + ' ' + simN + '/' + simD;
            } else {
              fracHero.textContent = (isNegative ? '-' : '') + simN + '/' + simD;
              improperSub.textContent = 'Proper Fraction (GCD: ' + common + ')';
              mixedHero.textContent = (isNegative ? '-' : '') + simN + '/' + simD;
            }

            pctSub.textContent = 'Percentage: ' + (dec * 100).toFixed(2) + '%';

            // Tape display
            const tapeHero = document.getElementById('d2f-tape-hero');
            const tapeErr = document.getElementById('d2f-tape-error');

            const snap16Text = (whole > 0 ? whole + ' ' : '') + snap16.n + '/' + snap16.d + '"';
            tapeHero.textContent = snap16Text;

            if (Math.abs(snap16.error) < 0.0001) {
              tapeErr.textContent = 'Exact Tape Match (0.000" error)';
              tapeErr.style.color = '#10b981';
            } else {
              const sign = snap16.error >= 0 ? '+' : '';
              tapeErr.textContent = 'Off by ' + sign + snap16.error.toFixed(4) + '"';
              tapeErr.style.color = Math.abs(snap16.error) < 0.015 ? '#f59e0b' : '#ef4444';
            }

            // Snapping card rows
            document.getElementById('d2f-snap-16').textContent = (whole > 0 ? whole + ' ' : '') + snap16.n + '/' + snap16.d + '"';
            document.getElementById('d2f-err-16').textContent = 'Error: ' + (snap16.error >= 0 ? '+' : '') + snap16.error.toFixed(4) + '"';
            document.getElementById('d2f-err-16').style.color = Math.abs(snap16.error) < 0.001 ? '#10b981' : '#f59e0b';

            document.getElementById('d2f-snap-32').textContent = (whole > 0 ? whole + ' ' : '') + snap32.n + '/' + snap32.d + '"';
            document.getElementById('d2f-err-32').textContent = 'Error: ' + (snap32.error >= 0 ? '+' : '') + snap32.error.toFixed(4) + '"';
            document.getElementById('d2f-err-32').style.color = Math.abs(snap32.error) < 0.001 ? '#10b981' : '#f59e0b';

            document.getElementById('d2f-snap-64').textContent = (whole > 0 ? whole + ' ' : '') + snap64.n + '/' + snap64.d + '"';
            document.getElementById('d2f-err-64').textContent = 'Error: ' + (snap64.error >= 0 ? '+' : '') + snap64.error.toFixed(4) + '"';
            document.getElementById('d2f-err-64').style.color = Math.abs(snap64.error) < 0.001 ? '#10b981' : '#f59e0b';

            // Derivations
            document.getElementById('d2f-step-base').innerHTML = stepBaseText;
            document.getElementById('d2f-step-gcd').innerHTML = stepGcdText;
            document.getElementById('d2f-step-final').innerHTML = (whole > 0 ? whole + ' + ' : '') + simN + '/' + simD + ' = <strong>' + (whole > 0 ? whole + ' ' + simN + '/' + simD + ' (' + totalNumerator + '/' + simD + ')' : simN + '/' + simD) + '</strong>';
          }

          window.copyD2FSummary = function() {
            const frac = document.getElementById('d2f-fraction-hero').innerText;
            const mixed = document.getElementById('d2f-mixed-hero').innerText;
            const tape = document.getElementById('d2f-tape-hero').innerText;
            const tapeErr = document.getElementById('d2f-tape-error').innerText;
            const rawIn = document.getElementById('d2f-in').value;

            const text = [
              '=== DECIMAL TO FRACTION CONVERSION REPORT ===',
              'Decimal Input: ' + rawIn,
              'Simplified Fraction: ' + frac,
              'Mixed Number Form: ' + mixed,
              'Nearest Tape Measure (16th): ' + tape + ' (' + tapeErr + ')',
              'Nearest 32nd: ' + document.getElementById('d2f-snap-32').innerText,
              'Nearest 64th: ' + document.getElementById('d2f-snap-64').innerText,
              '--------------------------------------------',
              'Standard: Euclidean Rational Number Reduction',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/decimal-to-fraction'
            ].join('\n');

            navigator.clipboard.writeText(text).then(function() {
              const btn = document.getElementById('btnCopyD2F');
              if (btn) {
                const old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Fraction Breakdown!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() { calcD2F(); });
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
      slug: 'markup-margin-calculator',
      title: 'Markup vs Profit Margin Calculator (eCommerce, Retail & Agency Pricing)',
      metaDesc: 'Convert between cost markup and gross profit margin. Calculate optimal retail selling price, net profit after merchant fees & CAC, discount sensitivity, and break-even volume.',
      category: 'Finance & eCommerce',
      faq: [
        { q: 'What is the mathematical difference between markup and profit margin?', a: 'Markup is the percentage added to the cost of a product to determine its selling price: Markup = (Profit / Cost) × 100%. Profit margin is the percentage of the selling price that is profit: Margin = (Profit / Revenue) × 100%. Because cost is lower than selling price, markup percentage is always higher than gross margin percentage for the same product.' },
        { q: 'Why does a 50% markup NOT equal a 50% profit margin?', a: 'If an item costs $50 and you mark it up by 50%, you add $25 to reach a selling price of $75. Your profit is $25. Your profit margin is $25 / $75 = 33.33%, NOT 50%. To achieve a true 50% profit margin on a $50 cost, you must price the item at $50 / (1 - 0.50) = $100, which is a 100% markup (keystoning).' },
        { q: 'How does discounting a product affect gross profit margin?', a: 'Discounts disproportionately destroy gross profit. If a product with a 25% markup ($100 cost, $125 price, $25 profit) is discounted by 20% ($25 off, new price $100), 100% of your profit is erased. A 20% discount on a 25% markup leaves you at zero profit.' },
        { q: 'What is Keystoning in retail pricing?', a: 'Keystoning is a traditional retail pricing strategy where merchandise is priced at double the wholesale cost—representing a 100% markup on cost and a 50% gross profit margin. While standard in apparel and gift retail, high-competition eCommerce often operates at lower margins (25%–40%).' },
        { q: 'What is the difference between Gross Margin and Net Profit Margin?', a: 'Gross margin accounts only for the direct Cost of Goods Sold (COGS). Net profit margin accounts for all expenses: merchant credit card processing fees (~2.9% + $0.30), marketplace referral fees (Amazon 15%), customer acquisition ad spend (CAC), shipping, returns, and operating overhead.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/math/">Math & Calculators</a> &gt; Markup vs Margin
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Markup vs. Profit Margin Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Convert cost markup to gross profit margin and vice versa. Calculate selling price, net profit after merchant processing fees and ad spend, and simulate discount impact on sales volume.
          </p>

          <div class="tool-box">
            <!-- Mode Selector -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              <button type="button" class="btn-sec" id="mm-mode-cost-markup" onclick="setMMMode('cost-markup')" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; border-color: #3b82f6; color: #3b82f6; font-weight: bold;">Cost &amp; Markup % &rarr; Price</button>
              <button type="button" class="btn-sec" id="mm-mode-cost-margin" onclick="setMMMode('cost-margin')" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;">Cost &amp; Target Margin % &rarr; Price</button>
              <button type="button" class="btn-sec" id="mm-mode-cost-price" onclick="setMMMode('cost-price')" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;">Cost &amp; Selling Price &rarr; Margins</button>
              <button type="button" class="btn-sec" id="mm-mode-price-margin" onclick="setMMMode('price-margin')" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;">Target Costing (Price &amp; Margin &rarr; Max Cost)</button>
            </div>

            <!-- Primary Inputs Grid -->
            <div class="grid-inputs">
              <div class="field-group" id="mm-grp-cost">
                <label class="field-label">Unit Cost of Goods (COGS $)</label>
                <input type="number" id="mm-cost" class="code-input" value="40" min="0" step="0.01" oninput="recalcMM()" style="font-size: 1.2rem;" />
              </div>
              <div class="field-group" id="mm-grp-markup">
                <label class="field-label">Cost Markup (% on Cost)</label>
                <input type="number" id="mm-markup" class="code-input" value="50" min="0" step="0.5" oninput="recalcMM('markup')" style="font-size: 1.2rem;" />
              </div>
              <div class="field-group" id="mm-grp-margin">
                <label class="field-label">Gross Margin (% of Revenue)</label>
                <input type="number" id="mm-margin" class="code-input" value="33.33" min="0" max="99.9" step="0.1" oninput="recalcMM('margin')" style="font-size: 1.2rem;" />
              </div>
              <div class="field-group" id="mm-grp-price" style="display: none;">
                <label class="field-label">Target Selling Price ($)</label>
                <input type="number" id="mm-input-price" class="code-input" value="60" min="0" step="0.01" oninput="recalcMM('price')" style="font-size: 1.2rem;" />
              </div>
            </div>

            <!-- Real-World Deductions & Fee Waterfall Accordion -->
            <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; margin-top: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <span style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">
                  💳 Optional Real-World Deductions (Net Margin Waterfall):
                </span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Credit card fees, marketplace cut, ad CAC</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.75rem;">
                <div>
                  <label style="display: block; font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.2rem;">Payment Processing (%)</label>
                  <input type="number" id="mm-pay-pct" class="code-input" value="2.9" step="0.1" min="0" oninput="recalcMM()" style="padding: 0.4rem; font-size: 0.85rem;" />
                </div>
                <div>
                  <label style="display: block; font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.2rem;">Payment Fixed Fee ($)</label>
                  <input type="number" id="mm-pay-fixed" class="code-input" value="0.30" step="0.05" min="0" oninput="recalcMM()" style="padding: 0.4rem; font-size: 0.85rem;" />
                </div>
                <div>
                  <label style="display: block; font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.2rem;">Marketplace / Platform Fee (%)</label>
                  <input type="number" id="mm-plat-pct" class="code-input" value="0" step="0.5" min="0" oninput="recalcMM()" placeholder="Amazon 15%, Etsy 6.5%" style="padding: 0.4rem; font-size: 0.85rem;" />
                </div>
                <div>
                  <label style="display: block; font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.2rem;">Ad Spend / CAC ($ per unit)</label>
                  <input type="number" id="mm-cac" class="code-input" value="0" step="0.5" min="0" oninput="recalcMM()" placeholder="0.00" style="padding: 0.4rem; font-size: 0.85rem;" />
                </div>
              </div>
            </div>

            <!-- Hero Results Dashboard -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Recommended Selling Price</div>
                <div id="mm-price" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">$60.00</div>
                <div id="mm-markup-disp" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">Markup: 50.0% on cost</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Gross Profit &amp; Margin</div>
                <div id="mm-gross-profit" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">$20.00</div>
                <div id="mm-gross-margin" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">Gross Margin: 33.33%</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">True Net Profit (After Fees)</div>
                <div id="mm-net-profit" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #8b5cf6; margin: 0.25rem 0;">$17.96</div>
                <div id="mm-net-margin" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">Net Margin: 29.93%</div>
              </div>
            </div>

            <!-- Revenue Waterfall Stacked Bar (Pure CSS) -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                <span>Revenue Share Waterfall:</span>
                <span id="mm-bar-legend" style="color: var(--fg);">100% Selling Price ($60.00)</span>
              </div>
              <div style="display: flex; width: 100%; height: 28px; border-radius: 4px; overflow: hidden; font-family: var(--mono); font-size: 0.75rem; font-weight: bold; color: #fff; text-align: center; line-height: 28px;">
                <div id="mm-bar-cost" style="width: 66.7%; background: #ef4444;" title="COGS">COGS</div>
                <div id="mm-bar-fees" style="width: 3.4%; background: #f59e0b;" title="Payment Fees">Fee</div>
                <div id="mm-bar-plat" style="width: 0%; background: #a855f7;" title="Marketplace">Mkt</div>
                <div id="mm-bar-cac" style="width: 0%; background: #3b82f6;" title="Ad CAC">CAC</div>
                <div id="mm-bar-net" style="width: 29.9%; background: #10b981;" title="Net Profit">Profit</div>
              </div>
              <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem; font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted);">
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #ef4444; border-radius: 2px;"></span> Cost of Goods</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #f59e0b; border-radius: 2px;"></span> Processing Fees</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #a855f7; border-radius: 2px;"></span> Marketplace Cut</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #3b82f6; border-radius: 2px;"></span> Ad Spend (CAC)</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #10b981; border-radius: 2px;"></span> Net Profit</span>
              </div>
            </div>

            <!-- Asymmetric Discounting & Volume Multiplier Engine -->
            <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #ef4444; border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                <h4 style="font-family: var(--serif); font-size: 1.05rem; margin: 0; color: var(--fg);">
                  📉 The Asymmetric Discounting Trap &amp; Required Sales Volume Multiplier:
                </h4>
                <span style="font-family: var(--mono); font-size: 0.75rem; color: #ef4444; font-weight: bold;">Margin Protection Alert</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
                See how promotional discounts disproportionately destroy unit profitability, and calculate how many more units you must sell to break even on gross profit:
              </p>
              <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: center;">
                <div>
                  <label class="field-label">Simulate Promotional Discount: <span id="mm-disc-val" style="color: #ef4444; font-size: 1rem;">10% Off</span></label>
                  <input type="range" id="mm-disc-slider" min="0" max="50" value="10" step="1" oninput="updateMMDiscount(this.value)" style="width: 100%; cursor: pointer;" />
                </div>
                <div style="text-align: right; min-width: 130px;">
                  <div style="font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted);">Discounted Price:</div>
                  <div id="mm-disc-price" style="font-family: var(--mono); font-size: 1.25rem; font-weight: bold; color: var(--fg);">$54.00</div>
                </div>
              </div>
              <div id="mm-disc-breakdown" style="margin-top: 0.75rem; padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.82rem; line-height: 1.5;">
                <!-- Populated dynamically -->
              </div>
            </div>

            <!-- Industry Margin Benchmarks Table -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; margin-bottom: 0.75rem; color: var(--fg);">
                📊 Standard Industry Margin &amp; Markup Benchmarks (Click to Load):
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(135px, 1fr)); gap: 0.5rem; font-family: var(--mono); font-size: 0.8rem; text-align: center;">
                <div onclick="loadMMBenchmark(2, 18)" style="background: var(--surface-alt); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border); cursor: pointer; transition: border-color 0.2s;" class="btn-sec">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Grocery Store</div>
                  <strong style="color: #3b82f6;">15% Margin</strong>
                  <div style="font-size: 0.7rem; color: var(--text-muted);">18% Markup</div>
                </div>
                <div onclick="loadMMBenchmark(150, 33.3)" style="background: var(--surface-alt); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border); cursor: pointer; transition: border-color 0.2s;" class="btn-sec">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Consumer Tech</div>
                  <strong style="color: #3b82f6;">25% Margin</strong>
                  <div style="font-size: 0.7rem; color: var(--text-muted);">33% Markup</div>
                </div>
                <div onclick="loadMMBenchmark(25, 100)" style="background: var(--surface-alt); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border); cursor: pointer; transition: border-color 0.2s;" class="btn-sec">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Apparel Keystoning</div>
                  <strong style="color: #10b981;">50% Margin</strong>
                  <div style="font-size: 0.7rem; color: var(--text-muted);">100% Markup</div>
                </div>
                <div onclick="loadMMBenchmark(6, 250)" style="background: var(--surface-alt); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border); cursor: pointer; transition: border-color 0.2s;" class="btn-sec">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Restaurant Food</div>
                  <strong style="color: #f59e0b;">71% Margin</strong>
                  <div style="font-size: 0.7rem; color: var(--text-muted);">250% Markup</div>
                </div>
                <div onclick="loadMMBenchmark(1.5, 450)" style="background: var(--surface-alt); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border); cursor: pointer; transition: border-color 0.2s;" class="btn-sec">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Bar Beverages</div>
                  <strong style="color: #8b5cf6;">82% Margin</strong>
                  <div style="font-size: 0.7rem; color: var(--text-muted);">450% Markup</div>
                </div>
                <div onclick="loadMMBenchmark(5, 566)" style="background: var(--surface-alt); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border); cursor: pointer; transition: border-color 0.2s;" class="btn-sec">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">SaaS / Digital</div>
                  <strong style="color: #10b981;">85% Margin</strong>
                  <div style="font-size: 0.7rem; color: var(--text-muted);">566% Markup</div>
                </div>
              </div>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopyMM" onclick="copyMMSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Pricing, Profit Margins &amp; Fee Waterfall Analysis
            </button>
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
                <div id="mm-step-markup" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  For $40 cost and $60 price: ($20 / $40) &times; 100 = <strong>50.0% Markup</strong>.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981;">Gross Margin Equation (Denominator = Revenue)</strong>
                <div style="color: var(--fg); margin-top: 0.25rem;">
                  Margin % = [ (Selling Price - Cost) / Selling Price ] &times; 100
                </div>
                <div id="mm-step-margin" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  For $40 cost and $60 price: ($20 / $60) &times; 100 = <strong>33.3% Margin</strong>.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #8b5cf6;">Direct Reciprocal Conversion Formulas</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  Price = Cost / [ 1 - (Margin % / 100) ] &bull; Markup % = [ Margin % / (100 - Margin %) ] &times; 100<br>
                  Margin % = [ Markup % / (100 + Markup %) ] &times; 100
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Business Pitfalls -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Retail Pitfalls &amp; Profit Bleed Traps</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The 50% Markup vs 50% Margin Confusion:</strong> New eCommerce store owners frequently assume adding a 50% markup gives them a 50% profit margin. In reality, a 50% markup yields only a 33.3% gross margin. To achieve a 50% profit margin, you must use a <strong>100% markup</strong> (selling at double your unit cost). Confusing these numbers leads to catastrophic cash flow collapse.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Asymmetric Discounting Trap:</strong> If you markup a product by 25% ($100 to $125) and later discount it by 20%, you return to break-even ($100). If you discount by 25%, you actually lose money ($93.75). Percentage discounts always hit harder than percentage markups of equal value.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Payment Processing &amp; Ad Spend Blindspot:</strong> Gross profit margin accounts solely for Cost of Goods Sold (COGS). It does not include payment gateway fees (Stripe/PayPal ~2.9% + $0.30), platform transaction fees (Shopify/Amazon ~8%–15%), or customer acquisition cost (CAC). If your gross margin is 25% and your ad CAC takes 20%, you are operating at net negative cash flow after returns and shipping damages.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Keystoning &amp; Wholesale Pricing Trap:</strong> If you sell wholesale to retailers, the retailer will want to keystone your wholesale price (double it). That means if your MSRP is $100, wholesale price must be $50, which means your unit manufacturing cost cannot exceed $20–$25 if you want to retain a viable brand margin.</li>
            </ul>
          </div>
        </div>

        <script>
          var curMMMode = 'cost-markup';

          window.setMMMode = function(mode) {
            curMMMode = mode;
            ['cost-markup', 'cost-margin', 'cost-price', 'price-margin'].forEach(function(m) {
              var btn = document.getElementById('mm-mode-' + m);
              if (btn) {
                if (m === mode) {
                  btn.style.borderColor = '#3b82f6';
                  btn.style.color = '#3b82f6';
                  btn.style.fontWeight = 'bold';
                } else {
                  btn.style.borderColor = 'var(--border)';
                  btn.style.color = 'var(--fg)';
                  btn.style.fontWeight = 'normal';
                }
              }
            });

            // Adjust input visibility
            document.getElementById('mm-grp-cost').style.display = 'block';
            document.getElementById('mm-grp-markup').style.display = (mode === 'cost-markup' || mode === 'cost-price') ? 'block' : 'none';
            document.getElementById('mm-grp-margin').style.display = (mode === 'cost-margin' || mode === 'price-margin') ? 'block' : 'none';
            document.getElementById('mm-grp-price').style.display = (mode === 'cost-price' || mode === 'price-margin') ? 'block' : 'none';

            recalcMM();
          };

          window.loadMMBenchmark = function(cost, markup) {
            document.getElementById('mm-cost').value = cost;
            document.getElementById('mm-markup').value = markup;
            setMMMode('cost-markup');
          };

          function recalcMM(source) {
            var cost = parseFloat(document.getElementById('mm-cost').value) || 0;
            var markup = parseFloat(document.getElementById('mm-markup').value) || 0;
            var margin = parseFloat(document.getElementById('mm-margin').value) || 0;
            var inPrice = parseFloat(document.getElementById('mm-input-price').value) || 0;

            var price = 0;
            var profit = 0;

            if (curMMMode === 'cost-markup') {
              price = cost * (1 + (markup / 100));
              profit = price - cost;
              margin = price > 0 ? ((profit / price) * 100) : 0;
              document.getElementById('mm-margin').value = margin.toFixed(2);
            } else if (curMMMode === 'cost-margin') {
              if (margin >= 100) margin = 99.9;
              price = cost / (1 - (margin / 100));
              profit = price - cost;
              markup = cost > 0 ? ((profit / cost) * 100) : 0;
              document.getElementById('mm-markup').value = markup.toFixed(2);
            } else if (curMMMode === 'cost-price') {
              price = inPrice;
              profit = price - cost;
              markup = cost > 0 ? ((profit / cost) * 100) : 0;
              margin = price > 0 ? ((profit / price) * 100) : 0;
              document.getElementById('mm-markup').value = markup.toFixed(2);
              document.getElementById('mm-margin').value = margin.toFixed(2);
            } else if (curMMMode === 'price-margin') {
              price = inPrice;
              if (margin >= 100) margin = 99.9;
              cost = price * (1 - (margin / 100));
              profit = price - cost;
              markup = cost > 0 ? ((profit / cost) * 100) : 0;
              document.getElementById('mm-cost').value = cost.toFixed(2);
              document.getElementById('mm-markup').value = markup.toFixed(2);
            }

            // Real-World Fee Waterfall
            var payPct = parseFloat(document.getElementById('mm-pay-pct').value) || 0;
            var payFixed = parseFloat(document.getElementById('mm-pay-fixed').value) || 0;
            var platPct = parseFloat(document.getElementById('mm-plat-pct').value) || 0;
            var cac = parseFloat(document.getElementById('mm-cac').value) || 0;

            var payFee = price > 0 ? ((price * (payPct / 100)) + payFixed) : 0;
            var platFee = price > 0 ? (price * (platPct / 100)) : 0;
            var totalDeductions = payFee + platFee + cac;
            var netProfit = profit - totalDeductions;
            var netMargin = price > 0 ? ((netProfit / price) * 100) : 0;

            // Update Primary Hero Results
            document.getElementById('mm-price').textContent = '$' + price.toFixed(2);
            document.getElementById('mm-markup-disp').textContent = 'Markup: ' + markup.toFixed(1) + '% on cost';

            document.getElementById('mm-gross-profit').textContent = '$' + profit.toFixed(2);
            document.getElementById('mm-gross-margin').textContent = 'Gross Margin: ' + margin.toFixed(2) + '%';

            var netEl = document.getElementById('mm-net-profit');
            netEl.textContent = '$' + netProfit.toFixed(2);
            netEl.style.color = netProfit >= 0 ? '#10b981' : '#ef4444';

            var netMarginEl = document.getElementById('mm-net-margin');
            netMarginEl.textContent = 'Net Margin: ' + netMargin.toFixed(2) + '% (' + (netProfit >= 0 ? 'Profitable' : 'LOSS') + ')';
            netMarginEl.style.color = netProfit >= 0 ? 'var(--text-muted)' : '#ef4444';

            // Update Waterfall Bar
            if (price > 0) {
              var costPct = Math.max(0, (cost / price) * 100);
              var payFeePct = Math.max(0, (payFee / price) * 100);
              var platFeePct = Math.max(0, (platFee / price) * 100);
              var cacPct = Math.max(0, (cac / price) * 100);
              var netPct = Math.max(0, netMargin);

              document.getElementById('mm-bar-cost').style.width = costPct.toFixed(1) + '%';
              document.getElementById('mm-bar-fees').style.width = payFeePct.toFixed(1) + '%';
              document.getElementById('mm-bar-plat').style.width = platFeePct.toFixed(1) + '%';
              document.getElementById('mm-bar-cac').style.width = cacPct.toFixed(1) + '%';
              document.getElementById('mm-bar-net').style.width = netPct.toFixed(1) + '%';

              document.getElementById('mm-bar-legend').textContent = '100% Selling Price ($' + price.toFixed(2) + ')';
            }

            // Update Step Worked Text
            document.getElementById('mm-step-markup').innerHTML = 'For $' + cost.toFixed(2) + ' cost and $' + price.toFixed(2) + ' price: ($' + profit.toFixed(2) + ' / $' + cost.toFixed(2) + ') &times; 100 = <strong>' + markup.toFixed(1) + '% Markup</strong>.';
            document.getElementById('mm-step-margin').innerHTML = 'For $' + cost.toFixed(2) + ' cost and $' + price.toFixed(2) + ' price: ($' + profit.toFixed(2) + ' / $' + price.toFixed(2) + ') &times; 100 = <strong>' + margin.toFixed(1) + '% Margin</strong>.';

            // Run Discount Simulator
            updateMMDiscount(document.getElementById('mm-disc-slider').value);
          }

          window.updateMMDiscount = function(discPct) {
            document.getElementById('mm-disc-val').textContent = discPct + '% Off';
            var cost = parseFloat(document.getElementById('mm-cost').value) || 0;
            var markup = parseFloat(document.getElementById('mm-markup').value) || 0;
            var origPrice = cost * (1 + (markup / 100));
            var origProfit = origPrice - cost;

            var disc = parseFloat(discPct) || 0;
            var discPrice = origPrice * (1 - (disc / 100));
            var newProfit = discPrice - cost;
            var newMargin = discPrice > 0 ? ((newProfit / discPrice) * 100) : 0;
            var profitLost = origProfit - newProfit;

            document.getElementById('mm-disc-price').textContent = '$' + discPrice.toFixed(2);

            var box = document.getElementById('mm-disc-breakdown');
            if (newProfit <= 0) {
              box.innerHTML = '<span style="color: #ef4444; font-weight: bold;">⛔ FATAL PRICING LOSS:</span> Offering a ' + disc + '% discount cuts your price below cost ($' + discPrice.toFixed(2) + ' vs cost $' + cost.toFixed(2) + '). You lose $' + Math.abs(newProfit).toFixed(2) + ' on every unit sold. <strong>No volume increase can overcome this loss!</strong>';
            } else {
              var volumeMultiplier = origProfit / newProfit;
              var requiredVolIncrease = (volumeMultiplier - 1) * 100;
              box.innerHTML = 'A <strong>' + disc + '% discount</strong> reduces gross profit from $' + origProfit.toFixed(2) + ' to <strong>$' + newProfit.toFixed(2) + '</strong> (-$' + profitLost.toFixed(2) + ', margin drops to ' + newMargin.toFixed(1) + '%).<br>' +
                'To generate the exact same total dollar profit, you must sell <strong>' + volumeMultiplier.toFixed(2) + 'x as many units (+' + requiredVolIncrease.toFixed(1) + '% sales volume)</strong>!';
            }
          };

          window.copyMMSummary = function() {
            var cost = document.getElementById('mm-cost').value;
            var markup = document.getElementById('mm-markup').value;
            var margin = document.getElementById('mm-margin').value;
            var price = document.getElementById('mm-price').textContent;
            var grossProfit = document.getElementById('mm-gross-profit').textContent;
            var netProfit = document.getElementById('mm-net-profit').textContent;
            var netMargin = document.getElementById('mm-net-margin').textContent;

            var text = [
              '=== PRICING & PROFIT MARGIN ANALYSIS ===',
              'Cost of Goods (COGS): $' + parseFloat(cost).toFixed(2),
              'Cost Markup: ' + markup + '%',
              'Gross Profit Margin: ' + margin + '%',
              'Recommended Retail Price: ' + price,
              'Gross Profit per Unit: ' + grossProfit,
              'Net Profit (After Fees & CAC): ' + netProfit + ' (' + netMargin + ')',
              '---------------------------------------',
              'Standard: GAAP Cost Accounting Principles',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/math/markup-margin-calculator'
            ].join('\n');

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

          document.addEventListener('DOMContentLoaded', function() { recalcMM(); });
          recalcMM();
        </script>
      `
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
