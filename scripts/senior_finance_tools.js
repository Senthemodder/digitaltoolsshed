// scripts/senior_finance_tools.js - Senior Living & High-CPM Finance Tools

export function buildSeniorFinanceSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const finDist = join(DIST, 'finance');
  const healthDist = join(DIST, 'health');
  ensureDir(finDist);
  ensureDir(healthDist);

  const financeTools = [
  {
    slug: "social-security-calculator",
    title: "Social Security Benefit Calculator by Age (62 vs 67 vs 70 & Break-Even)",
    metaDesc: "Compare estimated monthly and lifetime Social Security retirement benefits taking them early at 62, full retirement age (67), or delaying until 70 with COLA compounding, spousal options, and break-even analysis.",
    category: "Finance",
    faq: [
      {
            "q": "What is the best age to claim Social Security benefits?",
            "a": "There is no single best age for everyone: claiming at 62 provides income immediately but locks in a permanent 30% reduction. Claiming at Full Retirement Age (67 for those born 1960 or later) provides 100% of your primary insurance amount. Delaying to age 70 maximizes monthly income with a permanent 24% delayed retirement bonus (+8% per year), which provides the highest lifetime wealth for individuals who live past age 80 to 82."
      },
      {
            "q": "What is the break-even age between claiming Social Security at 62 vs 70?",
            "a": "The break-even age between claiming at age 62 and age 70 is typically between age 80 and 82. If you live past age 82, the higher monthly checks from delaying until age 70 will generate significantly more total cumulative cash than taking the reduced monthly checks starting at 62."
      },
      {
            "q": "How does working while collecting Social Security affect my benefits?",
            "a": "If you claim Social Security before your Full Retirement Age (FRA) and continue working, the Retirement Earnings Test applies: the SSA withholds $1 of benefits for every $2 earned above the annual earnings limit ($23,400 in 2025/2026). Once you reach FRA, there is no earnings limit, and your monthly benefit is recalculated upwards to credit you for the withheld amounts."
      },
      {
            "q": "How do delayed retirement credits work after Full Retirement Age?",
            "a": "For each year you delay claiming Social Security past your Full Retirement Age up to age 70, your benefit permanently increases by 8% per year (2/3 of 1% per month), plus any annual Cost-of-Living Adjustments (COLA). There is no financial benefit to delaying past age 70, as credits stop accumulating."
      },
      {
            "q": "How does my claiming age affect my spouse's survivor benefit?",
            "a": "Your claiming age permanently establishes the survivor benefit for your spouse. If you are the higher earner and delay until age 70, your surviving spouse will inherit your enhanced 124% maximum benefit upon your death. If you claim early at 62, you permanently lock in a reduced survivor benefit for your surviving spouse for the rest of their life."
      }
],
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Social Security Calculator
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Social Security Retirement Benefit Estimator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Compare monthly payouts and cumulative lifetime wealth across all claiming ages from 62 to 70. Features SSA actuarial reduction formulas, delayed retirement credits (+8%/yr), annual COLA compounding, and break-even crossover analysis.
          </p>
        </header>

        <!-- Main Calculator Controls Grid -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <!-- Primary Insurance Amount (PIA) -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Monthly Benefit at Full Age 67 (PIA in $):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="ss-base" value="2200" step="50" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcSS()" />
              </div>
              <div style="display: flex; gap: 0.35rem; margin-top: 0.4rem; flex-wrap: wrap;">
                <button type="button" onclick="setSSPIA(1600)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$1,600 (Avg)</button>
                <button type="button" onclick="setSSPIA(2200)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$2,200 (Above Avg)</button>
                <button type="button" onclick="setSSPIA(2800)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$2,800 (High)</button>
                <button type="button" onclick="setSSPIA(4018)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$4,018 (Max FRA)</button>
              </div>
            </div>

            <!-- Planned Claiming Age -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Planned Claiming Age:</label>
              <select id="ss-claim-age" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" onchange="calcSS()">
                <option value="62">Age 62 (-30.0% Early Reduction)</option>
                <option value="63">Age 63 (-25.0% Early Reduction)</option>
                <option value="64">Age 64 (-20.0% Early Reduction)</option>
                <option value="65">Age 65 (-13.3% Early Reduction)</option>
                <option value="66">Age 66 (-6.7% Early Reduction)</option>
                <option value="67" selected>Age 67 (100% Full Retirement Age)</option>
                <option value="68">Age 68 (+8.0% Delayed Bonus)</option>
                <option value="69">Age 69 (+16.0% Delayed Bonus)</option>
                <option value="70">Age 70 (+24.0% Maximum Bonus)</option>
              </select>
              <small style="color: var(--text-muted); font-size: 0.75rem;">FRA is 67 for workers born 1960 or later.</small>
            </div>

            <!-- Longevity Horizon -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Life Expectancy Horizon (Age):</label>
              <input type="number" id="ss-age-limit" value="85" min="70" max="100" step="1" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcSS()" />
              <small style="color: var(--text-muted); font-size: 0.75rem;">Average US life expectancy: 84 to 87.</small>
            </div>

            <!-- Expected Annual COLA -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Expected Annual COLA (% / yr):</label>
              <input type="number" id="ss-cola" value="2.4" min="0" max="8" step="0.1" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcSS()" />
              <small style="color: var(--text-muted); font-size: 0.75rem;">Historical SSA 20-year average: 2.4%.</small>
            </div>
          </div>

          <!-- Hero Metrics Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Monthly Check at Claim</div>
              <div id="ss-monthly" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #3b82f6; margin: 0.35rem 0;">$2,200</div>
              <div id="ss-pct-fra" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">100% of Full Benefit</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Cumulative Lifetime Total</div>
              <div id="ss-lifetime" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">$585,420</div>
              <div id="ss-horizon-text" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Through Age 85</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Break-Even Age vs. 62</div>
              <div id="ss-breakeven" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: var(--fg); margin: 0.35rem 0;">Age 78.4</div>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Crossover point in cash</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Annual Starting Income</div>
              <div id="ss-annual" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: var(--fg); margin: 0.35rem 0;">$26,400 / yr</div>
              <div id="ss-delay-gain" style="font-size: 0.85rem; color: #10b981; font-family: var(--mono); font-weight: bold;">+$6,336/yr vs claiming at 62</div>
            </div>
          </div>

          <!-- Copy Button -->
          <button type="button" id="btnCopySS" onclick="copySSSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
            📋 Copy Social Security Claiming Strategy Worksheet
          </button>
        </div>

        <!-- Interactive SVG Cumulative Wealth Crossover Curve -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📈 Cumulative Lifetime Wealth Crossover (62 vs 67 vs 70)</h3>
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Orange: Age 62 | Blue: Age 67 | Green: Age 70</span>
          </div>
          <div style="width: 100%; overflow-x: auto;">
            <svg id="ssCrossoverSvg" viewBox="0 0 600 240" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);"></svg>
          </div>
        </div>

        <!-- Claiming Age Comparison Matrix Table -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚖️ Full Claiming Age Comparison Schedule</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.85rem; text-align: left;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border); color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">
                  <th style="padding: 0.5rem 0.6rem;">Claim Age</th>
                  <th style="padding: 0.5rem 0.6rem;">Benefit Multiplier</th>
                  <th style="padding: 0.5rem 0.6rem;">Monthly Payout</th>
                  <th style="padding: 0.5rem 0.6rem;">Annual Payout</th>
                  <th style="padding: 0.5rem 0.6rem;">Total by Age 80</th>
                  <th style="padding: 0.5rem 0.6rem;">Total by Age 85</th>
                  <th style="padding: 0.5rem 0.6rem;">Total by Age 90</th>
                </tr>
              </thead>
              <tbody id="ssMatrixBody"></tbody>
            </table>
          </div>
        </div>

        <!-- Step-by-Step Worked Derivation -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Actuarial Benefit Derivation</h3>
            <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Social Security Act (42 U.S.C. § 402)</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            Benefits are computed from your Primary Insurance Amount (PIA) adjusted by statutory reduction or delayed credit factors based on elapsed months relative to Full Retirement Age (67):
          </p>
          <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 1: Baseline Primary Insurance Amount (PIA) at FRA (67)</strong>
              <div id="ssStep1" style="color: #3b82f6; margin-top: 0.25rem;">PIA = $2,200.00 / month ($26,400.00 / year).</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 2: Actuarial Reduction or Delayed Credit Factor</strong>
              <div id="ssStep2" style="color: var(--text-muted); margin-top: 0.25rem;">Age 67 Factor = 100.0% (0 months early / delayed).</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 3: Initial Monthly & Annual Benefit</strong>
              <div id="ssStep3" style="color: var(--text-muted); margin-top: 0.25rem;">Monthly = $2,200.00 × 1.000 = $2,200.00. Annual = $26,400.00.</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: #10b981; font-weight: 700;">Step 4: Cumulative Compounded Lifetime Total</strong>
              <div id="ssStep4" style="color: #10b981; margin-top: 0.25rem;">Sum over 18 years (ages 67 to 85) with 2.4% annual COLA = $585,420.00.</div>
            </div>
          </div>
        </div>

        <!-- 5 Critical Social Security Traps -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Critical Social Security Traps & Penalties</h3>
          <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; display: grid; gap: 0.6rem;">
            <li><strong>The "Break-Even" Longevity Fallacy:</strong> Many people claim early at 62 because they believe "I will beat the break-even age of 78." However, Social Security is not an investment; it is longevity insurance. Delaying to age 70 provides guaranteed inflation-protected cash flow that protects you against the catastrophic risk of outliving your money at age 85, 90, or 95.</li>
            <li><strong>The Spousal Survivor Reduction Trap:</strong> When one spouse passes away, the smaller of the two monthly Social Security checks disappears permanently. By delaying the higher earner's benefit to age 70, you guarantee the surviving spouse will inherit the highest possible permanent payout for the remainder of their lifetime.</li>
            <li><strong>The Pre-FRA Earnings Test Penalty:</strong> If you claim before Full Retirement Age (67) and continue working, the SSA withholds $1 of benefits for every $2 earned above the annual earnings limit ($23,400). While these withheld funds are credited back after FRA, working full-time while claiming early defeats the purpose of early benefits.</li>
            <li><strong>The "Tax Torpedo" Cliff:</strong> Adding just $1,000 of traditional 401(k) or IRA distributions can trigger up to $850 of Social Security benefits to become taxable, creating an effective marginal tax rate of 40.7% for middle-income retirees.</li>
            <li><strong>Solvency Panic Early Claiming:</strong> Headlines claiming the Social Security Trust Fund will be exhausted by 2033–2035 cause thousands of seniors to panic and claim at 62. Claiming at 62 locks in a permanent 30% reduction immediately, whereas Congress has historically patched funding shortfalls without cutting current benefits.</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 2rem 0;">
          <button onclick="window.print()" style="background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print Social Security Strategy Worksheet
          </button>
        </div>
      </div>

      <script>
        var ssaMultipliers = {
          62: 0.700, 63: 0.750, 64: 0.800, 65: 0.867, 66: 0.933,
          67: 1.000, 68: 1.080, 69: 1.160, 70: 1.240
        };

        function fmtUSD(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

        window.setSSPIA = function(amt) {
          document.getElementById('ss-base').value = amt;
          calcSS();
        };

        function calcSS() {
          var pia = parseFloat(document.getElementById('ss-base').value) || 0;
          var claimAge = parseInt(document.getElementById('ss-claim-age').value, 10) || 67;
          var horizon = parseInt(document.getElementById('ss-age-limit').value, 10) || 85;
          var cola = (parseFloat(document.getElementById('ss-cola').value) || 0) / 100;

          var mult = ssaMultipliers[claimAge] || 1.0;
          var monthly = pia * mult;
          var annual = monthly * 12;

          // Compute cumulative lifetime total for selected claim age
          var totalLifetime = 0;
          var curAnnual = annual;
          for (var age = claimAge; age < horizon; age++) {
            totalLifetime += curAnnual;
            curAnnual *= (1 + cola);
          }

          // Compare with claiming at 62
          var mo62 = pia * 0.70;
          var ann62 = mo62 * 12;
          var delayGain = annual - ann62;

          // Break-even vs 62 (simplified nominal payback)
          var breakEvenYears = (claimAge > 62 && delayGain > 0) ? ((ann62 * (claimAge - 62)) / delayGain) : 0;
          var breakEvenAge = claimAge + breakEvenYears;

          document.getElementById('ss-monthly').textContent = fmtUSD(monthly);
          document.getElementById('ss-pct-fra').textContent = (mult * 100).toFixed(1) + '% of Full Benefit (FRA 67)';
          document.getElementById('ss-lifetime').textContent = fmtUSD(totalLifetime);
          document.getElementById('ss-horizon-text').textContent = 'Through Age ' + horizon + ' (' + (horizon - claimAge) + ' Years)';
          document.getElementById('ss-annual').textContent = fmtUSD(annual) + ' / yr';

          var beEl = document.getElementById('ss-breakeven');
          if (claimAge === 62) {
            beEl.textContent = 'Baseline (Age 62)';
            document.getElementById('ss-delay-gain').textContent = 'Earliest statutory claim age';
          } else {
            beEl.textContent = 'Age ' + breakEvenAge.toFixed(1);
            document.getElementById('ss-delay-gain').textContent = (delayGain >= 0 ? '+' : '') + fmtUSD(delayGain) + '/yr vs claiming at 62';
          }

          // Step derivations
          document.getElementById('ssStep1').textContent = 'PIA at FRA (67) = ' + fmtUSD(pia) + ' / month (' + fmtUSD(pia * 12) + ' / year).';
          document.getElementById('ssStep2').textContent = 'Age ' + claimAge + ' SSA Factor = ' + (mult * 100).toFixed(1) + '% (' + (claimAge < 67 ? (67 - claimAge) * 12 + ' months early' : (claimAge - 67) * 12 + ' months delayed') + ').';
          document.getElementById('ssStep3').textContent = 'Monthly Benefit = ' + fmtUSD(pia) + ' × ' + mult.toFixed(3) + ' = ' + fmtUSD(monthly) + ' (' + fmtUSD(annual) + ' / year).';
          document.getElementById('ssStep4').textContent = 'Cumulative sum through Age ' + horizon + ' with ' + (cola * 100).toFixed(1) + '% COLA = ' + fmtUSD(totalLifetime) + '.';

          // Full comparison matrix
          var tbody = document.getElementById('ssMatrixBody');
          var matrixHtml = '';
          for (var a = 62; a <= 70; a++) {
            var m = ssaMultipliers[a];
            var mo = pia * m;
            var yr = mo * 12;

            function cumAt(targetAge, cAge, startYr) {
              if (targetAge <= cAge) return 0;
              var sum = 0;
              var cur = startYr;
              for (var ag = cAge; ag < targetAge; ag++) {
                sum += cur;
                cur *= (1 + cola);
              }
              return sum;
            }

            var tot80 = cumAt(80, a, yr);
            var tot85 = cumAt(85, a, yr);
            var tot90 = cumAt(90, a, yr);

            var isCur = (a === claimAge);
            var rowStyle = isCur ? 'background: rgba(59, 130, 246, 0.08); font-weight: bold;' : '';

            matrixHtml += '<tr style="border-bottom: 1px solid var(--border); ' + rowStyle + '">' +
              '<td style="padding: 0.5rem 0.6rem;">Age ' + a + (isCur ? ' ⭐' : '') + '</td>' +
              '<td style="padding: 0.5rem 0.6rem; color: var(--text-muted);">' + (m * 100).toFixed(1) + '%</td>' +
              '<td style="padding: 0.5rem 0.6rem; color: #3b82f6;">' + fmtUSD(mo) + '</td>' +
              '<td style="padding: 0.5rem 0.6rem;">' + fmtUSD(yr) + '</td>' +
              '<td style="padding: 0.5rem 0.6rem;">' + fmtUSD(tot80) + '</td>' +
              '<td style="padding: 0.5rem 0.6rem; color: #10b981;">' + fmtUSD(tot85) + '</td>' +
              '<td style="padding: 0.5rem 0.6rem;">' + fmtUSD(tot90) + '</td>' +
              '</tr>';
          }
          tbody.innerHTML = matrixHtml;

          // Render crossover chart
          renderSSCrossoverSvg(pia, cola);
        }

        function renderSSCrossoverSvg(pia, cola) {
          var svg = document.getElementById('ssCrossoverSvg');
          var w = 600;
          var h = 240;
          var padLeft = 65;
          var padRight = 30;
          var padTop = 30;
          var padBottom = 40;

          var plotW = w - padLeft - padRight;
          var plotH = h - padTop - padBottom;

          // Compute cumulative arrays for ages 62 to 92 for Claim 62, Claim 67, and Claim 70
          var curves = {
            62: { color: '#f59e0b', mult: 0.70, pts: [] },
            67: { color: '#3b82f6', mult: 1.00, pts: [] },
            70: { color: '#10b981', mult: 1.24, pts: [] }
          };

          var maxCum = 0;
          for (var cAge in curves) {
            var cur = curves[cAge];
            var startYr = (pia * cur.mult) * 12;
            var sum = 0;
            var yrVal = startYr;
            for (var age = 62; age <= 92; age++) {
              if (age >= parseInt(cAge, 10)) {
                sum += yrVal;
                yrVal *= (1 + cola);
              }
              cur.pts.push({ age: age, val: sum });
              if (sum > maxCum) maxCum = sum;
            }
          }

          if (maxCum <= 0) maxCum = 100000;

          var svgHtml = '';

          // Gridlines
          for (var g = 0; g <= 4; g++) {
            var gy = padTop + (g / 4) * plotH;
            var gVal = maxCum * (1 - g / 4);
            svgHtml += '<line x1="' + padLeft + '" y1="' + gy + '" x2="' + (w - padRight) + '" y2="' + gy + '" stroke="var(--border)" stroke-width="1" stroke-dasharray="3,3" />' +
              '<text x="' + (padLeft - 8) + '" y="' + (gy + 4) + '" font-family="var(--mono)" font-size="10" fill="var(--text-muted)" text-anchor="end">$' + Math.round(gVal / 1000) + 'k</text>';
          }

          // X axis labels
          for (var ag = 62; ag <= 92; ag += 5) {
            var gx = padLeft + ((ag - 62) / 30) * plotW;
            svgHtml += '<text x="' + gx + '" y="' + (h - 12) + '" font-family="var(--mono)" font-size="11" fill="var(--text-muted)" text-anchor="middle">' + ag + '</text>';
          }

          // Draw each curve
          for (var cAge in curves) {
            var cur = curves[cAge];
            var d = '';
            for (var i = 0; i < cur.pts.length; i++) {
              var pt = cur.pts[i];
              var x = padLeft + ((pt.age - 62) / 30) * plotW;
              var y = padTop + plotH - (pt.val / maxCum) * plotH;
              d += (i === 0 ? 'M ' : ' L ') + x + ' ' + y;
            }
            svgHtml += '<path d="' + d + '" fill="none" stroke="' + cur.color + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />';
          }

          // Legend
          svgHtml += '<g transform="translate(' + (padLeft + 10) + ', ' + (padTop + 10) + ')">' +
            '<rect x="0" y="0" width="220" height="24" fill="var(--surface)" rx="4" stroke="var(--border)" />' +
            '<circle cx="15" cy="12" r="4" fill="#f59e0b" />' +
            '<text x="25" y="16" font-family="var(--mono)" font-size="10" fill="var(--fg)">Age 62</text>' +
            '<circle cx="85" cy="12" r="4" fill="#3b82f6" />' +
            '<text x="95" y="16" font-family="var(--mono)" font-size="10" fill="var(--fg)">Age 67</text>' +
            '<circle cx="155" cy="12" r="4" fill="#10b981" />' +
            '<text x="165" y="16" font-family="var(--mono)" font-size="10" fill="var(--fg)">Age 70</text>' +
            '</g>';

          svg.innerHTML = svgHtml;
        }

        function copySSSummary() {
          var pia = document.getElementById('ss-base').value;
          var claimAge = document.getElementById('ss-claim-age').value;
          var monthly = document.getElementById('ss-monthly').textContent;
          var lifetime = document.getElementById('ss-lifetime').textContent;
          var horizon = document.getElementById('ss-age-limit').value;
          var breakEven = document.getElementById('ss-breakeven').textContent;
          var cola = document.getElementById('ss-cola').value;

          var text = '🏛️ SOCIAL SECURITY CLAIMING STRATEGY WORKSHEET\n' +
            '----------------------------------------\n' +
            '• Primary Insurance Amount (PIA @ 67): $' + Number(pia).toLocaleString('en-US') + ' / mo\n' +
            '• Planned Claiming Age: ' + claimAge + ' (' + document.getElementById('ss-pct-fra').textContent + ')\n' +
            '• Life Expectancy Horizon: Age ' + horizon + '\n' +
            '• Assumed Annual COLA: ' + cola + '%\n' +
            '----------------------------------------\n' +
            'BENEFIT PROJECTIONS:\n' +
            '• Starting Monthly Benefit: ' + monthly + '\n' +
            '• Starting Annual Benefit: ' + document.getElementById('ss-annual').textContent + '\n' +
            '• Total Cumulative Lifetime Payout: ' + lifetime + '\n' +
            '• Break-Even Age vs Claiming at 62: ' + breakEven + '\n' +
            '----------------------------------------\n' +
            'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/finance/social-security-calculator';

          navigator.clipboard.writeText(text).then(function() {
            var btn = document.getElementById('btnCopySS');
            var old = btn.innerHTML;
            btn.innerHTML = '✓ Copied Social Security Worksheet!';
            btn.style.background = '#10b981';
            btn.style.color = '#fff';
            setTimeout(function() {
              btn.innerHTML = old;
              btn.style.background = 'var(--surface-alt)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          });
        }

        document.addEventListener('DOMContentLoaded', calcSS);
      </script>
  `
  },
  {
    slug: "rmd-calculator",
    title: "IRS Required Minimum Distribution (RMD) Calculator (SECURE 2.0 & Table III)",
    metaDesc: "Calculate your mandatory annual IRS Required Minimum Distribution (RMD) under SECURE 2.0. Includes IRS Uniform Lifetime Table III, 5-year projections, missed RMD penalty estimator, and QCD deductions.",
    category: "Finance",
    faq: [
      {
            "q": "What is the RMD starting age under the SECURE 2.0 Act?",
            "a": "Under the SECURE 2.0 Act passed by Congress, the mandatory starting age for Required Minimum Distributions (RMDs) is phased: individuals born between 1951 and 1959 must begin taking RMDs at age 73. Individuals born in 1960 or later begin taking RMDs at age 75. Those born in 1950 or earlier remain subject to the previous age 72 or 70½ rules."
      },
      {
            "q": "How is an IRS Required Minimum Distribution calculated using Table III?",
            "a": "The annual RMD is calculated by taking your pre-tax account balance as of December 31 of the prior calendar year and dividing it by your life expectancy factor from IRS Uniform Lifetime Table III (Treasury Reg. § 1.401(a)(9)-9). For example, at age 75, the factor is 24.6, requiring a distribution of approximately 4.065% of your prior year-end balance."
      },
      {
            "q": "What is the penalty for missing an RMD deadline?",
            "a": "Under Internal Revenue Code § 4974 as updated by SECURE 2.0, failing to withdraw your full RMD by December 31 incurs an excise tax penalty of 25% on the shortfall amount (down from 50% historically). If the error is corrected within the statutory correction window (generally 2 years) and submitted with IRS Form 5329, the penalty is reduced to 10%."
      },
      {
            "q": "How do Qualified Charitable Distributions (QCDs) reduce RMD taxes?",
            "a": "Individuals aged 70½ or older can donate up to $105,000 per year directly from a Traditional IRA to a qualified 501(c)(3) public charity as a Qualified Charitable Distribution (QCD). The donated amount counts directly toward satisfying your mandatory RMD but is 100% excluded from your Adjusted Gross Income (AGI), preventing tax bracket escalation and Medicare IRMAA surcharges."
      },
      {
            "q": "Can I aggregate RMDs across multiple IRAs and workplace 401(k) plans?",
            "a": "You can aggregate RMD calculations across all your Traditional IRAs, SEP IRAs, and SIMPLE IRAs and withdraw the entire cumulative sum from one single IRA account. However, you CANNOT aggregate workplace plans: each separate 401(k), 403(b), or 457(b) account requires its own distinct RMD distribution calculated and disbursed directly from that employer plan."
      }
],
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; RMD Calculator
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">IRS Required Minimum Distribution (RMD) Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Under the SECURE 2.0 Act and Treasury Reg. § 1.401(a)(9), calculate mandatory annual withdrawals from Traditional IRAs, 401(k)s, and 403(b)s, explore Qualified Charitable Distributions (QCDs), and project multi-year tax obligations.
          </p>
        </header>

        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Pre-Tax Balance as of Dec 31 ($):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="rmd-bal" value="650000" step="10000" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcRMD()" />
              </div>
              <div style="display: flex; gap: 0.35rem; margin-top: 0.4rem; flex-wrap: wrap;">
                <button type="button" onclick="setRMDBal(250000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$250k</button>
                <button type="button" onclick="setRMDBal(500000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$500k</button>
                <button type="button" onclick="setRMDBal(1000000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$1.0M</button>
                <button type="button" onclick="setRMDBal(2000000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$2.0M</button>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Birth Year / SECURE 2.0 Tier:</label>
              <select id="rmd-birth" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" onchange="onBirthChange()">
                <option value="73" selected>Born 1951–1959 (RMD Age: 73)</option>
                <option value="75">Born 1960 or Later (RMD Age: 75)</option>
                <option value="72">Born 1950 or Earlier (RMD Age: 72)</option>
              </select>
              <small style="color: var(--text-muted); font-size: 0.75rem;">SECURE 2.0 statutory starting age.</small>
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Current Age in Tax Year:</label>
              <input type="number" id="rmd-age" value="75" min="72" max="105" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcRMD()" />
              <small id="rmd-age-hint" style="color: var(--text-muted); font-size: 0.75rem;">Must be &ge; statutory starting age.</small>
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Qualified Charitable Distribution (QCD):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="rmd-qcd" value="0" min="0" max="105000" step="1000" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcRMD()" />
              </div>
              <small style="color: var(--text-muted); font-size: 0.75rem;">Max $105,000 direct charity gift (tax-free).</small>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border);">
            <div>
              <label style="display: block; font-size: 0.8rem; font-family: var(--mono); color: var(--text-muted); margin-bottom: 0.25rem;">Expected Portfolio Return (% / yr):</label>
              <input type="number" id="rmd-growth" value="5.5" min="0" max="15" step="0.25" style="width: 100%; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" oninput="calcRMD()" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; font-family: var(--mono); color: var(--text-muted); margin-bottom: 0.25rem;">Est. Combined Income Tax Rate (%):</label>
              <input type="number" id="rmd-taxrate" value="22" min="0" max="50" step="1" style="width: 100%; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" oninput="calcRMD()" />
            </div>
          </div>

          <!-- Hero Metrics Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Mandatory Annual RMD</div>
              <div id="rmd-amount" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.35rem 0;">$26,423</div>
              <div id="rmd-mo" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">$2,202 / mo</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">IRS Table III Divisor</div>
              <div id="rmd-factor" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: var(--fg); margin: 0.35rem 0;">24.6</div>
              <div id="rmd-pct" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">4.07% of portfolio</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Net Taxable Distribution</div>
              <div id="rmd-taxable" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">$26,423</div>
              <div id="rmd-tax-est" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Est. Tax: $5,813 (22%)</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Net Spendable Cash Flow</div>
              <div id="rmd-net-spend" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: var(--fg); margin: 0.35rem 0;">$20,610</div>
              <div id="rmd-net-mo" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">$1,717 / mo</div>
            </div>
          </div>

          <!-- Copy Button -->
          <button type="button" id="btnCopyRMD" onclick="copyRMDSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
            📋 Copy Official IRS RMD Tax Worksheet
          </button>
        </div>

        <!-- Missed RMD Penalty Estimator Box (IRC § 4974) -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">🚨 Missed RMD Excise Tax Penalty Estimator</h3>
            <span style="font-family: var(--mono); font-size: 0.75rem; color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">SECURE 2.0 / IRC § 4974</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem;">
            Calculate the exact IRS excise penalty if you failed to withdraw all or part of your mandatory distribution by December 31:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; align-items: end;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Unwithdrawn Shortfall Amount ($):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="rmd-shortfall" value="10000" min="0" step="500" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.05rem;" oninput="calcPenalty()" />
              </div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.85rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Standard Statutory Penalty (25%)</div>
              <div id="penStandard" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #ef4444; margin: 0.2rem 0;">$2,500</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">IRC § 4974 base excise tax</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.85rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Timely Corrected Penalty (10%)</div>
              <div id="penCorrected" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #10b981; margin: 0.2rem 0;">$1,000</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Corrected within 2 yrs + Form 5329</div>
            </div>
          </div>
        </div>

        <!-- 5-Year Forward Schedule Projection -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">📅 5-Year Forward Projection Schedule</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
            Estimated account progression modeling mandatory RMD withdrawals alongside annual compound investment growth:
          </p>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.85rem; text-align: left;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border); color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">
                  <th style="padding: 0.5rem 0.6rem;">Tax Year</th>
                  <th style="padding: 0.5rem 0.6rem;">Age</th>
                  <th style="padding: 0.5rem 0.6rem;">Start Balance</th>
                  <th style="padding: 0.5rem 0.6rem;">IRS Factor</th>
                  <th style="padding: 0.5rem 0.6rem;">Mandatory RMD</th>
                  <th style="padding: 0.5rem 0.6rem;">Growth</th>
                  <th style="padding: 0.5rem 0.6rem;">End Balance</th>
                </tr>
              </thead>
              <tbody id="rmd-schedule-body"></tbody>
            </table>
          </div>
        </div>

        <!-- Step-by-Step Worked Derivation -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step IRS RMD Mathematical Derivation</h3>
            <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">26 C.F.R. § 1.401(a)(9)-9</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            The Internal Revenue Code mandates that RMDs be computed strictly by dividing the prior December 31 fair market value by your life expectancy factor from the IRS Uniform Lifetime Table (Table III):
          </p>
          <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 1: Baseline Fair Market Value (Dec 31 Prior Year)</strong>
              <div id="rmd-step-1" style="color: #3b82f6; margin-top: 0.25rem;">
                Dec 31 Balance = $650,000.00
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 2: Table III Life Expectancy Factor Lookup</strong>
              <div id="rmd-step-2" style="color: var(--text-muted); margin-top: 0.25rem;">
                Age 75 Factor = 24.6 (Equivalent statutory withdrawal percentage = 1 / 24.6 = 4.065%)
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 3: Gross Statutory RMD Calculation</strong>
              <div id="rmd-step-3" style="color: var(--text-muted); margin-top: 0.25rem;">
                Gross RMD = $650,000.00 &divide; 24.6 = $26,422.76
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: #10b981; font-weight: 700;">Step 4: Qualified Charitable Distribution (QCD) & Taxable Net</strong>
              <div id="rmd-step-4" style="color: #10b981; margin-top: 0.25rem;">
                Net Taxable Distribution = $26,422.76 - $0.00 (QCD) = $26,422.76. Est. Tax (22%) = $5,813.01.
              </div>
            </div>
          </div>
        </div>

        <!-- Critical RMD Traps & Tax Pitfalls -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical IRS RMD Traps & Penalties</h3>
          <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; display: grid; gap: 0.6rem;">
            <li><strong>The 25% Missed RMD Excise Tax (IRC § 4974):</strong> If you fail to withdraw the full mandatory RMD amount by December 31, the IRS imposes a severe 25% penalty tax on the shortfall. Under SECURE 2.0, this can be reduced to 10% if corrected in a timely manner and submitted with IRS Form 5329.</li>
            <li><strong>The First-Year "April 1 Double Tax" Trap:</strong> You have until April 1 of the year <em>after</em> you reach your starting age to take your first RMD. However, doing so forces you to take TWO distributions in that calendar year (the deferred first RMD plus the second year's RMD by Dec 31), which frequently catapults retirees into higher federal and state tax brackets.</li>
            <li><strong>The Medicare IRMAA Surcharge Cliff:</strong> RMD distributions flow directly into your Adjusted Gross Income (AGI). Crossing Income-Related Monthly Adjustment Amount (IRMAA) cliffs even by $1 triggers steep monthly surcharges on your Medicare Part B and Part D premiums two years later.</li>
            <li><strong>Aggregation Trap (IRAs vs. Employer Plans):</strong> You can calculate the RMDs for all your Traditional IRAs and withdraw the total amount from one single IRA. However, <strong>401(k) and 403(b) accounts CANNOT be aggregated</strong> across separate employers; each workplace plan must have its own separate RMD withdrawn.</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 2rem 0;">
          <button onclick="window.print()" style="background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print IRS RMD Tax Worksheet
          </button>
        </div>
      </div>

      <script>
        var irsTable = {
          72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1,
          80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2,
          87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1,
          94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4,
          101: 6.0, 102: 5.6, 103: 5.2, 104: 4.9, 105: 4.6
        };

        function fmtUSD(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

        window.setRMDBal = function(bal) {
          document.getElementById('rmd-bal').value = bal;
          calcRMD();
        };

        window.onBirthChange = function() {
          var startAge = parseInt(document.getElementById('rmd-birth').value, 10);
          var ageInput = document.getElementById('rmd-age');
          ageInput.min = startAge;
          if (parseInt(ageInput.value, 10) < startAge) {
            ageInput.value = startAge;
          }
          document.getElementById('rmd-age-hint').textContent = 'Statutory starting age: ' + startAge + '.';
          calcRMD();
        };

        function getTableFactor(age) {
          if (age < 72) return 27.4;
          if (age > 105) return 4.6;
          return irsTable[age] || 24.6;
        }

        function calcPenalty() {
          var shortfall = parseFloat(document.getElementById('rmd-shortfall').value) || 0;
          var stdPen = shortfall * 0.25;
          var corrPen = shortfall * 0.10;
          document.getElementById('penStandard').textContent = fmtUSD(stdPen);
          document.getElementById('penCorrected').textContent = fmtUSD(corrPen);
        }

        function calcRMD() {
          var bal = parseFloat(document.getElementById('rmd-bal').value) || 0;
          var startAge = parseInt(document.getElementById('rmd-birth').value, 10) || 73;
          var age = parseInt(document.getElementById('rmd-age').value, 10) || startAge;
          if (age < startAge) {
            age = startAge;
            document.getElementById('rmd-age').value = startAge;
          }
          var qcd = parseFloat(document.getElementById('rmd-qcd').value) || 0;
          var growthRate = (parseFloat(document.getElementById('rmd-growth').value) || 0) / 100;
          var taxRate = (parseFloat(document.getElementById('rmd-taxrate').value) || 0) / 100;

          var factor = getTableFactor(age);
          var grossRmd = factor > 0 ? (bal / factor) : 0;
          var taxableRmd = Math.max(0, grossRmd - qcd);
          var estTax = taxableRmd * taxRate;
          var netSpend = Math.max(0, grossRmd - qcd - estTax);
          var pct = factor > 0 ? ((1 / factor) * 100) : 0;

          document.getElementById('rmd-amount').textContent = fmtUSD(grossRmd);
          document.getElementById('rmd-mo').textContent = fmtUSD(grossRmd / 12) + ' / mo';
          document.getElementById('rmd-factor').textContent = factor.toFixed(1);
          document.getElementById('rmd-pct').textContent = pct.toFixed(2) + '% of Dec 31 balance';
          document.getElementById('rmd-taxable').textContent = fmtUSD(taxableRmd);
          document.getElementById('rmd-tax-est').textContent = 'Est. Tax: ' + fmtUSD(estTax) + ' (' + Math.round(taxRate * 100) + '%)';
          document.getElementById('rmd-net-spend').textContent = fmtUSD(netSpend);
          document.getElementById('rmd-net-mo').textContent = fmtUSD(netSpend / 12) + ' / mo';

          // Step Derivations
          document.getElementById('rmd-step-1').textContent = 'Dec 31 Prior-Year Pre-Tax Balance = ' + fmtUSD(bal);
          document.getElementById('rmd-step-2').textContent = 'Age ' + age + ' IRS Table III Factor = ' + factor.toFixed(1) + ' (Distribution percentage = ' + pct.toFixed(3) + '%)';
          document.getElementById('rmd-step-3').textContent = 'Gross Mandatory RMD = ' + fmtUSD(bal) + ' ÷ ' + factor.toFixed(1) + ' = ' + fmtUSD(grossRmd);
          document.getElementById('rmd-step-4').textContent = 'Net Taxable = ' + fmtUSD(grossRmd) + ' - ' + fmtUSD(qcd) + ' (QCD) = ' + fmtUSD(taxableRmd) + ' | Est. Tax Due: ' + fmtUSD(estTax);

          // 5-Year Forward Schedule
          var tbody = document.getElementById('rmd-schedule-body');
          var html = '';
          var curBal = bal;
          var curAge = age;
          var curYear = new Date().getFullYear();

          for (var i = 0; i < 5; i++) {
            var f = getTableFactor(curAge);
            var r = f > 0 ? (curBal / f) : 0;
            var balAfterRmd = Math.max(0, curBal - r);
            var grow = balAfterRmd * growthRate;
            var endBal = balAfterRmd + grow;

            html += '<tr style="border-bottom: 1px solid var(--border);">' +
              '<td style="padding: 0.5rem 0.6rem; font-weight: bold;">' + (curYear + i) + '</td>' +
              '<td style="padding: 0.5rem 0.6rem;">' + curAge + '</td>' +
              '<td style="padding: 0.5rem 0.6rem;">' + fmtUSD(curBal) + '</td>' +
              '<td style="padding: 0.5rem 0.6rem; color: var(--text-muted);">' + f.toFixed(1) + '</td>' +
              '<td style="padding: 0.5rem 0.6rem; color: #3b82f6; font-weight: bold;">' + fmtUSD(r) + '</td>' +
              '<td style="padding: 0.5rem 0.6rem; color: #10b981;">+' + fmtUSD(grow) + '</td>' +
              '<td style="padding: 0.5rem 0.6rem; font-weight: bold;">' + fmtUSD(endBal) + '</td>' +
              '</tr>';

            curBal = endBal;
            curAge++;
          }
          tbody.innerHTML = html;

          calcPenalty();
        }

        function copyRMDSummary() {
          var bal = document.getElementById('rmd-bal').value;
          var age = document.getElementById('rmd-age').value;
          var gross = document.getElementById('rmd-amount').textContent;
          var factor = document.getElementById('rmd-factor').textContent;
          var taxable = document.getElementById('rmd-taxable').textContent;
          var netSpend = document.getElementById('rmd-net-spend').textContent;
          var qcd = document.getElementById('rmd-qcd').value;

          var text = '🏛️ IRS REQUIRED MINIMUM DISTRIBUTION (RMD) WORKSHEET\n' +
            '----------------------------------------\n' +
            '• Prior Dec 31 Pre-Tax Balance: $' + Number(bal).toLocaleString('en-US') + '\n' +
            '• Current Tax Year Age: ' + age + ' (SECURE 2.0 Compliant)\n' +
            '• IRS Table III Factor: ' + factor + '\n' +
            '----------------------------------------\n' +
            'DISTRIBUTION OBLIGATION:\n' +
            '• Gross Mandatory RMD: ' + gross + ' (' + document.getElementById('rmd-mo').textContent + ')\n' +
            '• Qualified Charitable Distribution (QCD): $' + Number(qcd).toLocaleString('en-US') + '\n' +
            '• Net Taxable RMD: ' + taxable + '\n' +
            '• Estimated Net Spendable: ' + netSpend + '\n' +
            '----------------------------------------\n' +
            'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/finance/rmd-calculator';

          navigator.clipboard.writeText(text).then(function() {
            var btn = document.getElementById('btnCopyRMD');
            var old = btn.innerHTML;
            btn.innerHTML = '✓ Copied RMD Tax Worksheet!';
            btn.style.background = '#10b981';
            btn.style.color = '#fff';
            setTimeout(function() {
              btn.innerHTML = old;
              btn.style.background = 'var(--surface-alt)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          });
        }

        document.addEventListener('DOMContentLoaded', calcRMD);
      </script>
  `
  },
  {
    slug: "retirement-calculator",
    title: "Retirement Nest Egg & Safe Withdrawal Calculator (Trinity 4% & Guardrails)",
    metaDesc: "Determine how long your retirement portfolio will last using the Trinity 4% rule, Guyton-Klinger guardrails, inflation adjustments, and Sequence of Returns Risk modeling.",
    category: "Finance",
    faq: [
      {
            "q": "What is the 4% rule and is it still safe for retirement?",
            "a": "Originating from William Bengen (1994) and the Trinity Study (1998), the 4% rule states that withdrawing 4% of your initial portfolio in Year 1, and adjusting that dollar amount for inflation each subsequent year, had a 95%+ success rate over 30 years on a 50/50 to 75/25 stock/bond portfolio. For longer 40+ year retirements (FIRE), modern financial planners often recommend a safer 3.25% to 3.75% initial rate."
      },
      {
            "q": "How does Sequence of Returns Risk (SRR) affect retirement portfolio longevity?",
            "a": "Sequence of Returns Risk (SRR) is the danger that market downturns occur in the early years of decumulation. Experiencing bear market losses during the first 3 to 5 years forces you to sell equities at depressed prices to fund living expenses, permanently impairing your principal base and accelerating portfolio exhaustion decades earlier than projected by simple average returns."
      },
      {
            "q": "What are Guyton-Klinger dynamic guardrails and how do they work?",
            "a": "Guyton-Klinger guardrails adapt annual spending to market realities rather than blindly following rigid inflation increases. If a market rally drops your current withdrawal rate 20% below initial levels (the capital preservation boundary), you take an inflation raise; if a crash pushes your withdrawal rate 20% above the threshold, you trim spending by 10% to protect the nest egg."
      },
      {
            "q": "How much retirement savings do I need to generate $5,000 per month?",
            "a": "To generate $5,000 per month ($60,000 per year) entirely from investments using the 4% rule, you need a nest egg of $1,500,000 ($60,000 ÷ 0.04). If you receive $2,000 per month in guaranteed Social Security, you only need to draw $3,000 per month ($36,000/yr), reducing your required nest egg to $900,000 ($36,000 ÷ 0.04)."
      },
      {
            "q": "How does inflation impact my retirement withdrawal strategy?",
            "a": "Inflation compounds expenses over time: at a 3% historical inflation rate, $60,000 in annual spending doubles to $120,000 in roughly 24 years. If a portfolio is invested too conservatively in cash or low-yielding bonds, its purchasing power steadily erodes, making equity exposure necessary to maintain long-term solvency."
      }
],
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Retirement Planner
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Retirement Savings & 4% Safe Withdrawal Planner</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Benchmark your retirement readiness across the Trinity Study 4% Safe Withdrawal Rule, dynamic Guyton-Klinger Guardrails, and stress-test your portfolio against Sequence of Returns Risk (SRR).
          </p>
        </header>

        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
          <!-- Primary Inputs -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Total Retirement Nest Egg ($):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="ret-total" value="1000000" step="25000" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcRet()" />
              </div>
              <div style="display: flex; gap: 0.35rem; margin-top: 0.4rem; flex-wrap: wrap;">
                <button type="button" onclick="setRetEgg(500000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$500k</button>
                <button type="button" onclick="setRetEgg(1000000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$1.0M</button>
                <button type="button" onclick="setRetEgg(1500000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$1.5M</button>
                <button type="button" onclick="setRetEgg(2500000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$2.5M</button>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Desired Annual Spending ($ / yr):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="ret-spend" value="65000" step="2500" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcRet()" />
              </div>
              <small style="color: var(--text-muted); font-size: 0.75rem;">Total household living expenses.</small>
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Guaranteed Non-Portfolio Income ($ / yr):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="ret-guar" value="25000" step="1000" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcRet()" />
              </div>
              <small style="color: var(--text-muted); font-size: 0.75rem;">Social Security, pensions, annuities.</small>
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Retirement Horizon (Years):</label>
              <input type="number" id="ret-horizon" value="30" min="10" max="60" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcRet()" />
              <small style="color: var(--text-muted); font-size: 0.75rem;">Standard planning window: 30 years.</small>
            </div>
          </div>

          <!-- Return & Inflation Adjustments -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border);">
            <div>
              <label style="display: block; font-size: 0.8rem; font-family: var(--mono); color: var(--text-muted); margin-bottom: 0.25rem;">Expected Portfolio Nominal Return (%):</label>
              <input type="number" id="ret-ret" value="6.5" step="0.25" style="width: 100%; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" oninput="calcRet()" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; font-family: var(--mono); color: var(--text-muted); margin-bottom: 0.25rem;">Expected Long-Term Inflation (%):</label>
              <input type="number" id="ret-inf" value="2.8" step="0.1" style="width: 100%; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" oninput="calcRet()" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; font-family: var(--mono); color: var(--text-muted); margin-bottom: 0.25rem;">Stress Test Sequence of Returns Risk:</label>
              <select id="ret-srr" style="width: 100%; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.9rem;" onchange="calcRet()">
                <option value="none" selected>Steady Average Returns</option>
                <option value="mild">Mild Early Bear Market (-8%, -4%, +6%)</option>
                <option value="severe">Severe Early Bear Market (-18%, -12%, +2%)</option>
              </select>
            </div>
          </div>

          <!-- Hero Metrics Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Initial Withdrawal Rate</div>
              <div id="ret-pct" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">4.0%</div>
              <div id="ret-rate-status" style="font-size: 0.85rem; color: #10b981; font-weight: bold;">Within Trinity 4.0% Benchmark</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Net Annual Portfolio Draw</div>
              <div id="ret-net-draw" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.35rem 0;">$40,000 / yr</div>
              <div id="ret-net-draw-mo" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">$3,333 / mo from nest egg</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Portfolio Longevity</div>
              <div id="ret-years" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">30+ Years</div>
              <div id="ret-years-sub" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Fully Sustainable Horizon</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Recommended 4% Safe Cap</div>
              <div id="ret-safe" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: var(--fg); margin: 0.35rem 0;">$40,000 / yr</div>
              <div id="ret-safe-mo" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">$3,333 / mo initial draw</div>
            </div>
          </div>

          <button type="button" id="btnCopyRet" onclick="copyRetirementSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
            📋 Copy Retirement Longevity Strategy Report
          </button>
        </div>

        <!-- Interactive SVG Portfolio Decumulation Trajectory Graph -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📈 30-Year Portfolio Balance Trajectory</h3>
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Simulated account progression incorporating inflation-adjusted draws</span>
          </div>
          <div style="width: 100%; overflow-x: auto;">
            <svg id="retTrajSvg" viewBox="0 0 600 240" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);"></svg>
          </div>
        </div>

        <!-- Strategy Comparison Grid -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚖️ Withdrawal Strategy Benchmark Comparison</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
            <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);">
              <div style="font-weight: bold; color: var(--fg); margin-bottom: 0.25rem;">Trinity Study 4.0% Rule</div>
              <div id="strat-trinity" style="font-family: var(--mono); font-size: 1.3rem; color: #3b82f6; font-weight: bold; margin-bottom: 0.25rem;">$40,000 / yr</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Withdraw 4% in year one; adjust withdrawal for inflation each subsequent year. 95% historical 30-year survival rate on a 60/40 stock/bond portfolio.</p>
            </div>
            <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);">
              <div style="font-weight: bold; color: var(--fg); margin-bottom: 0.25rem;">Guyton-Klinger Guardrails (3.5% - 5.2%)</div>
              <div id="strat-guard" style="font-family: var(--mono); font-size: 1.3rem; color: #10b981; font-weight: bold; margin-bottom: 0.25rem;">$35,000 - $52,000</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Dynamic adjustment: forego inflation raises following negative portfolio return years, and trim spending by 10% if withdrawal rate exceeds capital preservation bounds.</p>
            </div>
            <div style="padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);">
              <div style="font-weight: bold; color: var(--fg); margin-bottom: 0.25rem;">Fixed Percentage (5.0% Drawdown)</div>
              <div id="strat-fixed" style="font-family: var(--mono); font-size: 1.3rem; color: var(--fg); font-weight: bold; margin-bottom: 0.25rem;">$50,000 / yr</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Withdrawing a constant 5% of remaining balance ensures the portfolio mathematically never hits zero, but causes spendable income to fluctuate directly with the market.</p>
            </div>
          </div>
        </div>

        <!-- Step-by-Step Worked Derivation -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Portfolio Decumulation Algebra</h3>
            <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Trinity Study Methodology</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            Portfolio decumulation is governed by the recurrence relation ( B_{t+1} = (B_t - W_t) 	imes (1 + r) ), where initial withdrawal ( W_0 ) indexes to inflation ( W_t = W_0 	imes (1 + i)^t ):
          </p>
          <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 1: Net Annual Required Portfolio Withdrawal</strong>
              <div id="ret-step-1" style="color: #3b82f6; margin-top: 0.25rem;">
                Net Draw = $65,000 (Expense) - $25,000 (Guaranteed) = $40,000.00 / yr
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 2: Initial Withdrawal Rate Assessment</strong>
              <div id="ret-step-2" style="color: var(--text-muted); margin-top: 0.25rem;">
                Rate = ($40,000 ÷ $1,000,000) &times; 100 = 4.00%
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 3: Real Compound Growth Rate (Fisher Equation)</strong>
              <div id="ret-step-3" style="color: var(--text-muted); margin-top: 0.25rem;">
                r_real = [(1 + 0.065) ÷ (1 + 0.028)] - 1 = +3.60% net real purchasing growth
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: #10b981; font-weight: 700;">Step 4: Solvency & Capital Preservation Horizon</strong>
              <div id="ret-step-4" style="color: #10b981; margin-top: 0.25rem;">
                At 4.00% initial draw, the nest egg sustains beyond the 30-year target horizon without depletion.
              </div>
            </div>
          </div>
        </div>

        <!-- Critical Retirement Traps & Pitfalls -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Retirement Nest Egg Traps</h3>
          <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; display: grid; gap: 0.6rem;">
            <li><strong>Sequence of Returns Risk (SRR):</strong> Two portfolios with the exact same 7% average arithmetic return over 30 years can have diametrically opposed fates. Experiencing a market crash during the first 3 to 5 years of retirement forces you to sell equities at rock-bottom prices, permanently starving the portfolio of capital needed to recover.</li>
            <li><strong>The "Average Return" Fallacy:</strong> If a $1,000,000 portfolio drops 20% in Year 1 (to $800k) and gains 20% in Year 2, your average return is 0%, but your portfolio balance is only $960,000. Add $40,000 annual withdrawals, and your balance drops to $912,000. Compounding losses while withdrawing accelerates mathematical ruin.</li>
            <li><strong>Qualified Account Tax Haircut:</strong> A $1,000,000 Traditional IRA is NOT $1,000,000 of spendable money. Depending on your tax bracket and state, 15% to 30% belongs to federal and state tax authorities. Your gross withdrawal must be sized up to cover tax liabilities.</li>
            <li><strong>Healthcare & Long-Term Care Inflation Escalator:</strong> While general CPI averages 2.5% to 3.0%, healthcare and assisted living expenses historically escalate at 4.5% to 6.5% annually. A retirement plan that assumes flat inflation across late-stage medical expenses risks severe late-life budget shortfalls.</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 2rem 0;">
          <button onclick="window.print()" style="background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print Retirement Plan Worksheet
          </button>
        </div>
      </div>

      <script>
        function fmtUSD(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

        window.setRetEgg = function(amt) {
          document.getElementById('ret-total').value = amt;
          calcRet();
        };

        function calcRet() {
          var total = parseFloat(document.getElementById('ret-total').value) || 0;
          var spend = parseFloat(document.getElementById('ret-spend').value) || 0;
          var guar = parseFloat(document.getElementById('ret-guar').value) || 0;
          var rNom = (parseFloat(document.getElementById('ret-ret').value) || 0) / 100;
          var inf = (parseFloat(document.getElementById('ret-inf').value) || 0) / 100;
          var srrMode = document.getElementById('ret-srr').value;
          var horizon = parseInt(document.getElementById('ret-horizon').value, 10) || 30;

          var netDraw = Math.max(0, spend - guar);
          var rate = total > 0 ? ((netDraw / total) * 100) : 0;
          var safeCap = total * 0.04;

          document.getElementById('ret-pct').textContent = rate.toFixed(1) + '%';
          document.getElementById('ret-net-draw').textContent = fmtUSD(netDraw) + ' / yr';
          document.getElementById('ret-net-draw-mo').textContent = fmtUSD(netDraw / 12) + ' / mo from nest egg';
          document.getElementById('ret-safe').textContent = fmtUSD(safeCap) + ' / yr';
          document.getElementById('ret-safe-mo').textContent = fmtUSD(safeCap / 12) + ' / mo initial draw';

          var rateEl = document.getElementById('ret-rate-status');
          var pctValEl = document.getElementById('ret-pct');
          if (rate <= 4.0) {
            rateEl.textContent = '✓ Conservative (Trinity Safe ≤ 4.0%)';
            rateEl.style.color = '#10b981';
            pctValEl.style.color = '#10b981';
          } else if (rate <= 5.0) {
            rateEl.textContent = '⚠️ Moderate Risk (Guardrail Zone 4.1% - 5.0%)';
            rateEl.style.color = '#f59e0b';
            pctValEl.style.color = '#f59e0b';
          } else {
            rateEl.textContent = '❌ High Risk of Depletion (> 5.0%)';
            rateEl.style.color = '#ef4444';
            pctValEl.style.color = '#ef4444';
          }

          // Benchmark Cards
          document.getElementById('strat-trinity').textContent = fmtUSD(total * 0.04) + ' / yr';
          document.getElementById('strat-guard').textContent = fmtUSD(total * 0.035) + ' - ' + fmtUSD(total * 0.052);
          document.getElementById('strat-fixed').textContent = fmtUSD(total * 0.05) + ' / yr';

          // Simulation
          var balance = total;
          var curSpend = netDraw;
          var years = 0;
          var yearlyBalances = [total];

          for (var yr = 1; yr <= 40; yr++) {
            var yrReturn = rNom;
            if (srrMode === 'mild') {
              if (yr === 1) yrReturn = -0.08;
              else if (yr === 2) yrReturn = -0.04;
              else if (yr === 3) yrReturn = 0.06;
            } else if (srrMode === 'severe') {
              if (yr === 1) yrReturn = -0.18;
              else if (yr === 2) yrReturn = -0.12;
              else if (yr === 3) yrReturn = 0.02;
            }

            if (balance > 0) {
              balance = (balance - curSpend) * (1 + yrReturn);
              curSpend = curSpend * (1 + inf);
              if (balance > 0) {
                years++;
                yearlyBalances.push(balance);
              } else {
                yearlyBalances.push(0);
                balance = 0;
              }
            } else {
              yearlyBalances.push(0);
            }
          }

          var yEl = document.getElementById('ret-years');
          var ySubEl = document.getElementById('ret-years-sub');
          if (years >= 40) {
            yEl.textContent = '40+ Years';
            yEl.style.color = '#10b981';
            ySubEl.textContent = 'Indefinite / Permanent Capital Preservation';
          } else if (years >= horizon) {
            yEl.textContent = years + ' Years';
            yEl.style.color = '#10b981';
            ySubEl.textContent = 'Meets or Exceeds ' + horizon + '-Year Target Horizon';
          } else if (years >= 20) {
            yEl.textContent = years + ' Years';
            yEl.style.color = '#f59e0b';
            ySubEl.textContent = 'Short of ' + horizon + '-Year Target (' + (horizon - years) + ' Year Gap)';
          } else {
            yEl.textContent = years + ' Years';
            yEl.style.color = '#ef4444';
            ySubEl.textContent = 'Depletes Prematurely (Severe Shortfall)';
          }

          // Step Derivations
          var rReal = ((1 + rNom) / (1 + inf)) - 1;
          document.getElementById('ret-step-1').textContent = 'Net Annual Draw = ' + fmtUSD(spend) + ' (Living) - ' + fmtUSD(guar) + ' (Guaranteed) = ' + fmtUSD(netDraw) + ' / yr';
          document.getElementById('ret-step-2').textContent = 'Initial Draw Rate = (' + fmtUSD(netDraw) + ' ÷ ' + fmtUSD(total) + ') × 100 = ' + rate.toFixed(2) + '%';
          document.getElementById('ret-step-3').textContent = 'Real Growth = [(1 + ' + rNom.toFixed(3) + ') ÷ (1 + ' + inf.toFixed(3) + ')] - 1 = ' + (rReal >= 0 ? '+' : '') + (rReal * 100).toFixed(2) + '% purchasing power drift';
          document.getElementById('ret-step-4').textContent = 'At ' + rate.toFixed(2) + '% initial draw, simulated longevity is ' + (years >= 40 ? '40+ Years (Permanent)' : years + ' Years') + ' under selected scenario.';

          // SVG Trajectory Curve
          renderRetSvg(yearlyBalances.slice(0, 31), total, years);
        }

        function renderRetSvg(balances, initialTotal, longevityYears) {
          var svg = document.getElementById('retTrajSvg');
          var w = 600;
          var h = 240;
          var padLeft = 65;
          var padRight = 30;
          var padTop = 30;
          var padBottom = 40;

          var plotW = w - padLeft - padRight;
          var plotH = h - padTop - padBottom;

          var maxVal = initialTotal;
          for (var i = 0; i < balances.length; i++) {
            if (balances[i] > maxVal) maxVal = balances[i];
          }
          if (maxVal <= 0) maxVal = 100000;

          var points = [];
          for (var yr = 0; yr <= 30; yr++) {
            var x = padLeft + (yr / 30) * plotW;
            var val = balances[yr] !== undefined ? balances[yr] : 0;
            var y = padTop + plotH - (val / maxVal) * plotH;
            points.push({ x: x, y: y, yr: yr, val: val });
          }

          var pathD = 'M ' + points[0].x + ' ' + points[0].y;
          var areaD = 'M ' + points[0].x + ' ' + (padTop + plotH) + ' L ' + points[0].x + ' ' + points[0].y;
          for (var p = 1; p < points.length; p++) {
            pathD += ' L ' + points[p].x + ' ' + points[p].y;
            areaD += ' L ' + points[p].x + ' ' + points[p].y;
          }
          areaD += ' L ' + points[points.length - 1].x + ' ' + (padTop + plotH) + ' Z';

          var isSolvent = longevityYears >= 30;
          var strokeColor = isSolvent ? '#10b981' : '#ef4444';
          var fillColor = isSolvent ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';

          var svgHtml = '';
          // Grid lines & Y axis labels
          for (var g = 0; g <= 4; g++) {
            var gy = padTop + (g / 4) * plotH;
            var gVal = maxVal * (1 - g / 4);
            svgHtml += '<line x1="' + padLeft + '" y1="' + gy + '" x2="' + (w - padRight) + '" y2="' + gy + '" stroke="var(--border)" stroke-width="1" stroke-dasharray="3,3" />' +
              '<text x="' + (padLeft - 8) + '" y="' + (gy + 4) + '" font-family="var(--mono)" font-size="10" fill="var(--text-muted)" text-anchor="end">$' + Math.round(gVal / 1000) + 'k</text>';
          }

          // X axis labels
          for (var yr = 0; yr <= 30; yr += 5) {
            var gx = padLeft + (yr / 30) * plotW;
            svgHtml += '<text x="' + gx + '" y="' + (h - 12) + '" font-family="var(--mono)" font-size="11" fill="var(--text-muted)" text-anchor="middle">Yr ' + yr + '</text>';
          }

          // Area & Line
          svgHtml += '<path d="' + areaD + '" fill="' + fillColor + '" />';
          svgHtml += '<path d="' + pathD + '" fill="none" stroke="' + strokeColor + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />';

          // End point marker or Depletion marker
          if (!isSolvent && longevityYears < 30) {
            var depPt = points[longevityYears];
            if (depPt) {
              svgHtml += '<circle cx="' + depPt.x + '" cy="' + depPt.y + '" r="6" fill="#ef4444" stroke="var(--surface)" stroke-width="2" />' +
                '<text x="' + depPt.x + '" y="' + (depPt.y - 10) + '" font-family="var(--mono)" font-size="10" font-weight="bold" fill="#ef4444" text-anchor="middle">Depleted (Yr ' + longevityYears + ')</text>';
            }
          } else {
            var lastPt = points[30];
            svgHtml += '<circle cx="' + lastPt.x + '" cy="' + lastPt.y + '" r="5" fill="#10b981" stroke="var(--surface)" stroke-width="2" />' +
              '<text x="' + lastPt.x + '" y="' + (lastPt.y - 10) + '" font-family="var(--mono)" font-size="10" font-weight="bold" fill="#10b981" text-anchor="end">Yr 30: ' + fmtUSD(lastPt.val) + '</text>';
          }

          svg.innerHTML = svgHtml;
        }

        function copyRetirementSummary() {
          var total = document.getElementById('ret-total').value;
          var spend = document.getElementById('ret-spend').value;
          var guar = document.getElementById('ret-guar').value;
          var rate = document.getElementById('ret-pct').textContent;
          var netDraw = document.getElementById('ret-net-draw').textContent;
          var longevity = document.getElementById('ret-years').textContent;
          var safeCap = document.getElementById('ret-safe').textContent;

          var text = '🏛️ RETIREMENT LONGEVITY & SAFE WITHDRAWAL REPORT\n' +
            '----------------------------------------\n' +
            '• Total Retirement Nest Egg: $' + Number(total).toLocaleString('en-US') + '\n' +
            '• Annual Living Expenses: $' + Number(spend).toLocaleString('en-US') + ' / yr\n' +
            '• Guaranteed Non-Portfolio Income: $' + Number(guar).toLocaleString('en-US') + ' / yr\n' +
            '• Net Portfolio Annual Draw: ' + netDraw + '\n' +
            '----------------------------------------\n' +
            'LONGEVITY & SUSTAINABILITY BENCHMARK:\n' +
            '• Initial Withdrawal Rate: ' + rate + '\n' +
            '• Trinity 4% Recommended Cap: ' + safeCap + '\n' +
            '• Projected Portfolio Longevity: ' + longevity + '\n' +
            '• Solvency Status: ' + document.getElementById('ret-rate-status').textContent + '\n' +
            '----------------------------------------\n' +
            'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/finance/retirement-calculator';

          navigator.clipboard.writeText(text).then(function() {
            var btn = document.getElementById('btnCopyRet');
            var old = btn.innerHTML;
            btn.innerHTML = '✓ Copied Retirement Summary!';
            btn.style.background = '#10b981';
            btn.style.color = '#fff';
            setTimeout(function() {
              btn.innerHTML = old;
              btn.style.background = 'var(--surface-alt)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          });
        }

        document.addEventListener('DOMContentLoaded', calcRet);
      </script>
  `
  },
  {
    slug: "annuity-calculator",
    title: "Pension Annuity vs. Lump Sum Calculator (With Market Opportunity & Break-Even)",
    metaDesc: "Compare a guaranteed lifetime pension annuity vs. an invested lump sum payout. Calculate break-even age, investment opportunity cost, inflation erosion, and residual estate legacy.",
    category: "Finance",
    faq: [
      {
            "q": "Is it better to take a monthly pension annuity or a lump-sum payout?",
            "a": "The optimal choice depends on your life expectancy, investment acumen, and legacy goals. An annuity provides guaranteed, stress-free monthly income for life that you cannot outlive. A lump sum gives you complete control over your capital, the ability to pass remaining funds to heirs upon death, and potential inflation protection if invested in a diversified portfolio."
      },
      {
            "q": "What is the break-even age for a pension annuity vs lump sum?",
            "a": "A simple break-even calculation divides the lump sum by the annual annuity payout (e.g., $350,000 ÷ $26,400/yr = 13.25 years, meaning break-even occurs at age 78.3 if starting at 65). However, when accounting for a 5% to 7% investment return on the lump sum, the true investment break-even age often shifts past age 85 or 90."
      },
      {
            "q": "What happens to my pension annuity if I pass away early?",
            "a": "With a Single Life Annuity, all monthly payments stop immediately upon your death, and the employer or insurance company retains 100% of any remaining balance—leaving zero legacy for your heirs. To protect a spouse, you must select a Joint & Survivor annuity (which typically reduces monthly checks by 10% to 20%)."
      },
      {
            "q": "How does inflation affect a fixed pension annuity?",
            "a": "Most corporate private pensions do NOT offer Cost-of-Living Adjustments (COLA). At an average 3% annual inflation rate, a fixed $2,000 per month pension check loses approximately 35% of its real purchasing power in 15 years, and over 50% of its value in 25 years."
      },
      {
            "q": "Can I rollover a pension lump sum into an IRA without paying taxes?",
            "a": "Yes. You can execute a direct trustee-to-trustee rollover of your eligible pension lump-sum distribution directly into a Traditional IRA without paying any current income taxes or early withdrawal penalties, preserving 100% of your pre-tax retirement capital."
      }
],
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Annuity vs Lump Sum
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Pension Annuity vs. Lump Sum Payout Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Deciding between guaranteed lifetime monthly pension checks and a single lump-sum cash buyout? Compare nominal break-even age, investment opportunity growth, inflation erosion, and residual heir inheritance.
          </p>
        </header>

        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <!-- Lump Sum Offer -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Offered Lump Sum Buyout ($):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="an-lump" value="350000" step="10000" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcAnnuity()" />
              </div>
              <div style="display: flex; gap: 0.35rem; margin-top: 0.4rem; flex-wrap: wrap;">
                <button type="button" onclick="setAnLump(250000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$250k</button>
                <button type="button" onclick="setAnLump(350000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$350k</button>
                <button type="button" onclick="setAnLump(500000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$500k</button>
                <button type="button" onclick="setAnLump(1000000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$1.0M</button>
              </div>
            </div>

            <!-- Monthly Annuity Offer -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Monthly Lifetime Annuity Check ($ / mo):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="an-mo" value="2200" step="50" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcAnnuity()" />
              </div>
              <small style="color: var(--text-muted); font-size: 0.75rem;">Guaranteed pension payout per month.</small>
            </div>

            <!-- Starting Age -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Retirement Starting Age:</label>
              <input type="number" id="an-age" value="65" min="50" max="80" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcAnnuity()" />
              <small style="color: var(--text-muted); font-size: 0.75rem;">Age when distribution begins.</small>
            </div>

            <!-- Expected Return on Lump Sum -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Lump Sum Invested Return (% / yr):</label>
              <input type="number" id="an-return" value="6.0" min="0" max="12" step="0.25" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcAnnuity()" />
              <small style="color: var(--text-muted); font-size: 0.75rem;">Expected return if rolled over into IRA.</small>
            </div>
          </div>

          <!-- Hero Metrics Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Simple Payback Break-Even</div>
              <div id="an-be" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #3b82f6; margin: 0.35rem 0;">Age 78.3</div>
              <div id="an-years-be" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">13.3 years of payouts</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Annual Payout Yield</div>
              <div id="an-yield" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">7.54%</div>
              <div id="an-yr-text" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">$26,400 / yr guaranteed</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Invested Lump Sum @ Age 85</div>
              <div id="an-lump-85" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: var(--fg); margin: 0.35rem 0;">$215,480</div>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Remaining estate legacy for heirs</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Annuity Estate Legacy</div>
              <div style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #ef4444; margin: 0.35rem 0;">$0.00</div>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Retained by pension plan upon death</div>
            </div>
          </div>

          <!-- Copy Button -->
          <button type="button" id="btnCopyAnnuity" onclick="copyAnnuitySummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
            📋 Copy Pension Annuity vs. Lump Sum Comparison Report
          </button>
        </div>

        <!-- Interactive SVG Wealth Trajectory Graph -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📈 30-Year Wealth Progression (Lump Sum vs Cumulative Annuity)</h3>
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Blue: Invested Lump Sum Balance | Green: Cumulative Annuity Paid</span>
          </div>
          <div style="width: 100%; overflow-x: auto;">
            <svg id="annuitySvg" viewBox="0 0 600 240" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);"></svg>
          </div>
        </div>

        <!-- Step-by-Step Worked Derivation -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Actuarial Break-Even Algebra</h3>
            <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Actuarial Equivalence Model</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            The annuity option acts as a synthetic bond yielding a guaranteed cash flow. Break-even analysis evaluates nominal payback alongside investment opportunity cost:
          </p>
          <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 1: Annualized Annuity Distribution Basis</strong>
              <div id="anStep1" style="color: #3b82f6; margin-top: 0.25rem;">Annual Payout = $2,200.00 / mo × 12 = $26,400.00 / yr.</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 2: Simple Nominal Payback Horizon</strong>
              <div id="anStep2" style="color: var(--text-muted); margin-top: 0.25rem;">$350,000 ÷ $26,400 = 13.26 years (Nominal Break-Even Age = 78.3).</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 3: Effective Annuity Cash-on-Cash Yield</strong>
              <div id="anStep3" style="color: var(--text-muted); margin-top: 0.25rem;">Yield = ($26,400 ÷ $350,000) × 100 = 7.54% guaranteed cash flow.</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: #10b981; font-weight: 700;">Step 4: Invested Lump Sum Opportunity Projection</strong>
              <div id="anStep4" style="color: #10b981; margin-top: 0.25rem;">If $350k is invested at 6.0% return while withdrawing $26,400/yr, balance at Age 85 is $215,480.00.</div>
            </div>
          </div>
        </div>

        <!-- 4 Critical Traps -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 4 Critical Pension Annuity Traps</h3>
          <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; display: grid; gap: 0.6rem;">
            <li><strong>The Zero Legacy Risk (Single Life Trap):</strong> If you select a single life annuity and pass away 24 months into retirement, you receive $52,800 total, and the employer retains the remaining $297,200. Zero dollars go to your surviving spouse or children.</li>
            <li><strong>The Non-Inflation-Adjusted Purchasing Power Crash:</strong> Most corporate pensions are strictly fixed dollar amounts with 0% COLA. Over a 25-year retirement at 3% inflation, your $2,200/month check will feel like only $1,050/month in real goods and groceries.</li>
            <li><strong>Pension Insolvent Bankruptcy & PBGC Haircuts:</strong> If your former corporate employer declares bankruptcy and the pension is turned over to the federal Pension Benefit Guaranty Corporation (PBGC), statutory maximum benefit caps may force an immediate reduction on high-earner pension payouts.</li>
            <li><strong>Lump Sum Behavioral Ruin:</strong> While a lump sum offers superior estate planning flexibility, it exposes retirees to panic selling during market crashes and aggressive withdrawals. If you cannot resist high-risk speculation, the forced discipline of an annuity is often mathematically superior.</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 2rem 0;">
          <button onclick="window.print()" style="background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print Pension Evaluation Worksheet
          </button>
        </div>
      </div>

      <script>
        function fmtUSD(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

        window.setAnLump = function(amt) {
          document.getElementById('an-lump').value = amt;
          calcAnnuity();
        };

        function calcAnnuity() {
          var lump = parseFloat(document.getElementById('an-lump').value) || 1;
          var mo = parseFloat(document.getElementById('an-mo').value) || 0;
          var age = parseFloat(document.getElementById('an-age').value) || 65;
          var r = (parseFloat(document.getElementById('an-return').value) || 0) / 100;

          var annual = mo * 12;
          var yearsToBE = annual > 0 ? (lump / annual) : 0;
          var beAge = age + yearsToBE;
          var yieldPct = (annual / lump) * 100;

          // Invested lump sum trajectory: Start with lump sum, earn r%, withdraw annual at end of year
          var lumpBalance = lump;
          var lumpBalances = [lump];
          var annuityCumulative = [0];
          var cumAnn = 0;

          var balAt85 = 0;
          for (var yr = 1; yr <= 30; yr++) {
            var curAge = age + yr;
            lumpBalance = (lumpBalance - annual) * (1 + r);
            if (lumpBalance < 0) lumpBalance = 0;
            lumpBalances.push(lumpBalance);

            cumAnn += annual;
            annuityCumulative.push(cumAnn);

            if (curAge === 85) {
              balAt85 = lumpBalance;
            }
          }

          document.getElementById('an-be').textContent = 'Age ' + beAge.toFixed(1);
          document.getElementById('an-years-be').textContent = yearsToBE.toFixed(1) + ' years to recover lump sum';
          document.getElementById('an-yield').textContent = yieldPct.toFixed(2) + '%';
          document.getElementById('an-yr-text').textContent = fmtUSD(annual) + ' / yr guaranteed';
          document.getElementById('an-lump-85').textContent = fmtUSD(balAt85);

          // Step derivations
          document.getElementById('anStep1').textContent = 'Annual Annuity Payout = ' + fmtUSD(mo) + ' × 12 = ' + fmtUSD(annual) + ' / year.';
          document.getElementById('anStep2').textContent = fmtUSD(lump) + ' ÷ ' + fmtUSD(annual) + ' = ' + yearsToBE.toFixed(2) + ' years (Simple Break-Even Age = ' + beAge.toFixed(1) + ').';
          document.getElementById('anStep3').textContent = 'Guaranteed Cash-on-Cash Yield = (' + fmtUSD(annual) + ' ÷ ' + fmtUSD(lump) + ') × 100 = ' + yieldPct.toFixed(2) + '%.';
          document.getElementById('anStep4').textContent = 'At ' + (r * 100).toFixed(2) + '% investment return while taking ' + fmtUSD(annual) + '/yr, remaining balance at Age 85 is ' + fmtUSD(balAt85) + '.';

          // SVG rendering
          renderAnnuitySvg(lumpBalances, annuityCumulative, age);
        }

        function renderAnnuitySvg(lumpVals, annVals, startAge) {
          var svg = document.getElementById('annuitySvg');
          var w = 600;
          var h = 240;
          var padLeft = 65;
          var padRight = 30;
          var padTop = 30;
          var padBottom = 40;

          var plotW = w - padLeft - padRight;
          var plotH = h - padTop - padBottom;

          var maxVal = 0;
          for (var i = 0; i < lumpVals.length; i++) {
            if (lumpVals[i] > maxVal) maxVal = lumpVals[i];
            if (annVals[i] > maxVal) maxVal = annVals[i];
          }
          if (maxVal <= 0) maxVal = 100000;

          var svgHtml = '';

          // Gridlines
          for (var g = 0; g <= 4; g++) {
            var gy = padTop + (g / 4) * plotH;
            var gVal = maxVal * (1 - g / 4);
            svgHtml += '<line x1="' + padLeft + '" y1="' + gy + '" x2="' + (w - padRight) + '" y2="' + gy + '" stroke="var(--border)" stroke-width="1" stroke-dasharray="3,3" />' +
              '<text x="' + (padLeft - 8) + '" y="' + (gy + 4) + '" font-family="var(--mono)" font-size="10" fill="var(--text-muted)" text-anchor="end">$' + Math.round(gVal / 1000) + 'k</text>';
          }

          // X axis labels
          for (var yr = 0; yr <= 30; yr += 5) {
            var gx = padLeft + (yr / 30) * plotW;
            svgHtml += '<text x="' + gx + '" y="' + (h - 12) + '" font-family="var(--mono)" font-size="11" fill="var(--text-muted)" text-anchor="middle">' + Math.round(startAge + yr) + '</text>';
          }

          // Lump sum curve (Blue)
          var lumpD = '';
          for (var i = 0; i <= 30; i++) {
            var x = padLeft + (i / 30) * plotW;
            var y = padTop + plotH - (lumpVals[i] / maxVal) * plotH;
            lumpD += (i === 0 ? 'M ' : ' L ') + x + ' ' + y;
          }
          svgHtml += '<path d="' + lumpD + '" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />';

          // Annuity cumulative curve (Green)
          var annD = '';
          for (var i = 0; i <= 30; i++) {
            var x = padLeft + (i / 30) * plotW;
            var y = padTop + plotH - (annVals[i] / maxVal) * plotH;
            annD += (i === 0 ? 'M ' : ' L ') + x + ' ' + y;
          }
          svgHtml += '<path d="' + annD + '" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />';

          // Legend
          svgHtml += '<g transform="translate(' + (padLeft + 10) + ', ' + (padTop + 10) + ')">' +
            '<rect x="0" y="0" width="280" height="24" fill="var(--surface)" rx="4" stroke="var(--border)" />' +
            '<circle cx="15" cy="12" r="4" fill="#3b82f6" />' +
            '<text x="25" y="16" font-family="var(--mono)" font-size="10" fill="var(--fg)">Invested Lump Sum</text>' +
            '<circle cx="145" cy="12" r="4" fill="#10b981" />' +
            '<text x="155" y="16" font-family="var(--mono)" font-size="10" fill="var(--fg)">Cumulative Annuity Paid</text>' +
            '</g>';

          svg.innerHTML = svgHtml;
        }

        function copyAnnuitySummary() {
          var lump = document.getElementById('an-lump').value;
          var mo = document.getElementById('an-mo').value;
          var age = document.getElementById('an-age').value;
          var be = document.getElementById('an-be').textContent;
          var yieldPct = document.getElementById('an-yield').textContent;
          var bal85 = document.getElementById('an-lump-85').textContent;

          var text = '🏛️ PENSION ANNUITY VS. LUMP SUM EVALUATION REPORT\n' +
            '----------------------------------------\n' +
            '• Lump Sum Buyout Offer: $' + Number(lump).toLocaleString('en-US') + '\n' +
            '• Monthly Lifetime Check: $' + Number(mo).toLocaleString('en-US') + ' / mo (' + document.getElementById('an-yr-text').textContent + ')\n' +
            '• Retirement Starting Age: ' + age + '\n' +
            '----------------------------------------\n' +
            'COMPARISON & BREAK-EVEN:\n' +
            '• Simple Payback Break-Even: ' + be + ' (' + document.getElementById('an-years-be').textContent + ')\n' +
            '• Guaranteed Annuity Cash Yield: ' + yieldPct + '\n' +
            '• Residual Invested Lump Sum at Age 85: ' + bal85 + '\n' +
            '• Annuity Estate Legacy: $0.00 (Single Life)\n' +
            '----------------------------------------\n' +
            'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/finance/annuity-calculator';

          navigator.clipboard.writeText(text).then(function() {
            var btn = document.getElementById('btnCopyAnnuity');
            var old = btn.innerHTML;
            btn.innerHTML = '✓ Copied Annuity Report!';
            btn.style.background = '#10b981';
            btn.style.color = '#fff';
            setTimeout(function() {
              btn.innerHTML = old;
              btn.style.background = 'var(--surface-alt)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          });
        }

        document.addEventListener('DOMContentLoaded', calcAnnuity);
      </script>
  `
  },
  {
    slug: "downsizing-calculator",
    title: "Senior Home Downsizing Calculator (Net Cash-Out, Taxes & Monthly Savings)",
    metaDesc: "Calculate net cash proceeds from downsizing your home. Factor in Section 121 capital gains exclusion, Realtor commissions, closing costs, and monthly recurring living expense savings.",
    category: "Finance",
    faq: [
      {
            "q": "How much money can seniors typically save by downsizing their home?",
            "a": "On average, downsizing from a 4-bedroom single-family home to a 2-bedroom condo or townhome frees up $100,000 to $300,000+ in liquid home equity, while cutting recurring monthly living costs (property taxes, homeowner insurance, heating/cooling, and landscaping) by $600 to $1,500+ per month."
      },
      {
            "q": "How does the IRS Section 121 primary residence capital gains tax exclusion work?",
            "a": "Under Internal Revenue Code § 121, you can exclude up to $250,000 of capital gain if you are Single, or up to $500,000 if you are Married Filing Jointly, from the sale of your primary home. To qualify, you must have owned and lived in the residence for at least 2 out of the 5 years immediately preceding the sale date."
      },
      {
            "q": "What is home tax basis and how does it reduce capital gains taxes?",
            "a": "Your tax basis is the original purchase price of the home PLUS the cumulative cost of all permanent capital improvements made over the years (e.g., roof replacements, HVAC additions, kitchen remodels, window upgrades). It does NOT include routine maintenance or repairs. A higher basis reduces your taxable net gain."
      },
      {
            "q": "What are the hidden recurring costs of downsizing to a condo?",
            "a": "Homeowners Association (HOA) fees are the primary hidden risk in condo downsizing. In addition to monthly dues (often $300 to $800+/month), aging condo associations frequently issue unexpected \"Special Assessments\" ($5,000 to $30,000+) for elevator overhauls, roof repairs, or foundation retrofits."
      },
      {
            "q": "Should I buy a smaller condo or rent in retirement after downsizing?",
            "a": "Renting eliminates property taxes, special assessments, and maintenance headaches entirely, providing predictable monthly costs and maximizing liquidity in high-yield investments. However, rents increase with inflation, whereas purchasing a downsized condo with cash guarantees debt-free housing stability."
      }
],
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Home Downsizing Calculator
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Senior Home Downsizing & Cash Flow Planner</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Calculate the exact net cash proceeds unlocked into your retirement portfolio, model IRS Section 121 capital gains tax shields, and evaluate ongoing monthly lifestyle cost reductions.
          </p>
        </header>

        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
          <!-- Primary Transaction Inputs -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <!-- Current Home Expected Sale Price -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Current Home Sale Price ($):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="ds-sale" value="650000" step="10000" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcDown()" />
              </div>
              <div style="display: flex; gap: 0.35rem; margin-top: 0.4rem; flex-wrap: wrap;">
                <button type="button" onclick="setSalePrice(450000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$450k</button>
                <button type="button" onclick="setSalePrice(650000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$650k</button>
                <button type="button" onclick="setSalePrice(850000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$850k</button>
                <button type="button" onclick="setSalePrice(1200000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$1.2M</button>
              </div>
            </div>

            <!-- Remaining Mortgage Balance -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Remaining Mortgage Balance ($):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="ds-mort" value="65000" step="5000" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcDown()" />
              </div>
              <small style="color: var(--text-muted); font-size: 0.75rem;">Principal owed (0 if paid off).</small>
            </div>

            <!-- New Downsized Home Price -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">New Home / Condo Price ($):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="ds-new" value="350000" step="10000" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcDown()" />
              </div>
              <small style="color: var(--text-muted); font-size: 0.75rem;">Paid in full cash (or $0 if renting).</small>
            </div>

            <!-- Selling & Closing Fees -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Selling Costs (% Commission/Fees):</label>
              <input type="number" id="ds-fee" value="7.0" min="2" max="12" step="0.5" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcDown()" />
              <small style="color: var(--text-muted); font-size: 0.75rem;">Realtor commissions + title + transfer taxes.</small>
            </div>
          </div>

          <!-- Tax Basis & Monthly Shifts Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); margin-bottom: 1.5rem;">
            <div>
              <label style="display: block; font-size: 0.8rem; font-family: var(--mono); color: var(--text-muted); margin-bottom: 0.25rem;">Adjusted Tax Basis (Cost + Improvements):</label>
              <input type="number" id="ds-basis" value="280000" step="5000" style="width: 100%; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" oninput="calcDown()" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; font-family: var(--mono); color: var(--text-muted); margin-bottom: 0.25rem;">Marital Filing Status (IRC § 121):</label>
              <select id="ds-status" style="width: 100%; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.9rem;" onchange="calcDown()">
                <option value="joint" selected>Married Jointly ($500k Exclusion)</option>
                <option value="single">Single Filer ($250k Exclusion)</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; font-family: var(--mono); color: var(--text-muted); margin-bottom: 0.25rem;">Old Home Monthly Running Cost ($ / mo):</label>
              <input type="number" id="ds-old-cost" value="1850" step="50" style="width: 100%; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" oninput="calcDown()" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; font-family: var(--mono); color: var(--text-muted); margin-bottom: 0.25rem;">New Condo Monthly HOA + Tax ($ / mo):</label>
              <input type="number" id="ds-new-cost" value="950" step="50" style="width: 100%; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" oninput="calcDown()" />
            </div>
          </div>

          <!-- Hero Metrics Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Net Cash Added to Portfolio</div>
              <div id="ds-net-cash" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">+$189,500</div>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Debt-free liquid equity surplus</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Monthly Living Cost Savings</div>
              <div id="ds-mo-saved" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #3b82f6; margin: 0.35rem 0;">+$900 / mo</div>
              <div id="ds-yr-saved" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">+$10,800 / year reduced bills</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">10-Year Cumulative Benefit</div>
              <div id="ds-10yr-total" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: var(--fg); margin: 0.35rem 0;">$297,500</div>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Liquid equity + cumulative savings</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Section 121 Tax Shield</div>
              <div id="ds-tax-shield" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">100% Tax-Free</div>
              <div id="ds-cap-gain" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">$324.5k gain sheltered ($0 tax)</div>
            </div>
          </div>

          <!-- Copy Button -->
          <button type="button" id="btnCopyDown" onclick="copyDownsizingSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
            📋 Copy Senior Home Downsizing & Cash Flow Report
          </button>
        </div>

        <!-- Visual Cash Proceeds Waterfall Bar -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">📊 Home Sale Equity Cash-Out Waterfall</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
            Allocation of gross sale price across mortgage payoff, transaction friction, replacement housing, and liquid cash surplus:
          </p>

          <div style="height: 26px; width: 100%; display: flex; border-radius: 4px; overflow: hidden; margin-bottom: 0.6rem; border: 1px solid var(--border);">
            <div id="barDsNet" style="width: 29%; background: #10b981;" title="Net Liquid Cash Added"></div>
            <div id="barDsNewH" style="width: 54%; background: #3b82f6;" title="Replacement Home Paid"></div>
            <div id="barDsMort" style="width: 10%; background: #ef4444;" title="Mortgage Payoff"></div>
            <div id="barDsFees" style="width: 7%; background: #f59e0b;" title="Realtor & Closing Fees"></div>
          </div>

          <div style="display: flex; gap: 1rem; font-family: var(--mono); font-size: 0.75rem; flex-wrap: wrap;">
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 10px; height: 10px; background: #10b981; border-radius: 2px;"></span> <span id="legDsNet">Cash Surplus</span></span>
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 10px; height: 10px; background: #3b82f6; border-radius: 2px;"></span> <span id="legDsNewH">New Home Paid</span></span>
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 10px; height: 10px; background: #ef4444; border-radius: 2px;"></span> <span id="legDsMort">Mortgage Payoff</span></span>
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 10px; height: 10px; background: #f59e0b; border-radius: 2px;"></span> <span id="legDsFees">Closing Costs</span></span>
          </div>
        </div>

        <!-- Step-by-Step Worked Derivation -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Downsizing Financial Algebra</h3>
            <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">IRC § 121 Capital Gains Protocol</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            Downsizing unlocks home equity by netting gross transaction proceeds against debt obligations and capital gains liability:
          </p>
          <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 1: Net Sale Proceeds from Current Residence</strong>
              <div id="dsStep1" style="color: #3b82f6; margin-top: 0.25rem;">Proceeds = $650,000 (Sale) - $45,500 (7% Fees) - $65,000 (Mortgage) = $539,500.00.</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 2: Section 121 Capital Gains Tax Liability</strong>
              <div id="dsStep2" style="color: var(--text-muted); margin-top: 0.25rem;">Realized Gain = $650k - $45.5k - $280k Basis = $324,500. Exempt under $500,000 cap = $0.00 tax due.</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 3: Replacement Property Cash Outflow</strong>
              <div id="dsStep3" style="color: var(--text-muted); margin-top: 0.25rem;">Surplus Cash = $539,500 (Proceeds) - $350,000 (New Home) = +$189,500.00 added to investments.</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: #10b981; font-weight: 700;">Step 4: Recurring Monthly Cash Flow Delta</strong>
              <div id="dsStep4" style="color: #10b981; margin-top: 0.25rem;">Monthly Reduction = $1,850 (Old) - $950 (New) = $900.00 / month saved ($10,800.00 / year).</div>
            </div>
          </div>
        </div>

        <!-- 4 Critical Traps -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 4 Critical Senior Downsizing Traps</h3>
          <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; display: grid; gap: 0.6rem;">
            <li><strong>The Condo HOA Fee Escalator & Special Assessment Trap:</strong> Many seniors trade a $500/mo property maintenance bill for a $600/mo condo HOA fee, thinking they save money. However, HOA boards routinely hike dues 10%–15% annually to fund deferred maintenance. Furthermore, a single $15,000 Special Assessment for building re-roofing instantly wipes out 18 months of projected downsizing savings.</li>
            <li><strong>The Furnishing & Moving Replacement Shock:</strong> Oversized furniture designed for a 3,000-square-foot house rarely fits into a 1,200-square-foot condo or townhome. Buying compact furniture, custom window treatments, moving services, and storage units frequently consumes $12,000 to $25,000 in immediate cash.</li>
            <li><strong>Property Tax Reassessment Cliffs:</strong> If you live in a state with senior tax caps (such as California Proposition 13 or Florida Save Our Homes), selling your home and buying a new one in another county or state may trigger a dramatic property tax reassessment, neutralizing expected tax savings unless specific transfer portability rules apply.</li>
            <li><strong>Emotional Grieving & Social Isolation:</strong> Leaving a neighborhood where you raised a family and have decades of community ties can produce significant psychological distress. Seniors who move away from friends to save on housing often experience acute loneliness, impacting physical health and increasing healthcare costs.</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 2rem 0;">
          <button onclick="window.print()" style="background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print Downsizing Financial Worksheet
          </button>
        </div>
      </div>

      <script>
        function fmtUSD(n) {
          var sign = n < 0 ? '-$' : (n > 0 ? '+$' : '$');
          return sign + Math.abs(Math.round(n)).toLocaleString('en-US');
        }

        window.setSalePrice = function(amt) {
          document.getElementById('ds-sale').value = amt;
          calcDown();
        };

        function calcDown() {
          var sale = parseFloat(document.getElementById('ds-sale').value) || 0;
          var mort = parseFloat(document.getElementById('ds-mort').value) || 0;
          var newH = parseFloat(document.getElementById('ds-new').value) || 0;
          var feePct = (parseFloat(document.getElementById('ds-fee').value) || 0) / 100;
          var basis = parseFloat(document.getElementById('ds-basis').value) || 0;
          var status = document.getElementById('ds-status').value;
          var oldCost = parseFloat(document.getElementById('ds-old-cost').value) || 0;
          var newCost = parseFloat(document.getElementById('ds-new-cost').value) || 0;

          var fees = sale * feePct;
          var netProceeds = sale - mort - fees;

          // Capital Gains under Section 121
          var exclusion = status === 'joint' ? 500000 : 250000;
          var realizedGain = Math.max(0, sale - fees - basis);
          var taxableGain = Math.max(0, realizedGain - exclusion);
          var estCapTax = taxableGain * 0.15; // 15% federal capital gains rate

          var cashSurplus = netProceeds - estCapTax - newH;

          var moSaved = oldCost - newCost;
          var yrSaved = moSaved * 12;
          var total10Yr = cashSurplus + (yrSaved * 10);

          var netCashEl = document.getElementById('ds-net-cash');
          netCashEl.textContent = fmtUSD(cashSurplus);
          netCashEl.style.color = cashSurplus >= 0 ? '#10b981' : '#ef4444';

          document.getElementById('ds-mo-saved').textContent = fmtUSD(moSaved) + ' / mo';
          document.getElementById('ds-yr-saved').textContent = fmtUSD(yrSaved) + ' / year reduced bills';
          document.getElementById('ds-10yr-total').textContent = fmtUSD(total10Yr);

          var taxShieldEl = document.getElementById('ds-tax-shield');
          var capGainEl = document.getElementById('ds-cap-gain');
          if (taxableGain === 0) {
            taxShieldEl.textContent = '100% Tax-Free';
            taxShieldEl.style.color = '#10b981';
            capGainEl.textContent = fmtUSD(realizedGain) + ' gain sheltered ($0 tax)';
          } else {
            taxShieldEl.textContent = fmtUSD(estCapTax) + ' Tax Due';
            taxShieldEl.style.color = '#ef4444';
            capGainEl.textContent = fmtUSD(taxableGain) + ' taxable gain over exclusion';
          }

          // Visual Waterfall Bar
          if (sale > 0) {
            var pNet = Math.max(0, (cashSurplus / sale) * 100);
            var pNew = Math.min(100, (newH / sale) * 100);
            var pMort = Math.min(100, (mort / sale) * 100);
            var pFees = Math.min(100, (fees / sale) * 100);

            document.getElementById('barDsNet').style.width = pNet.toFixed(1) + '%';
            document.getElementById('barDsNewH').style.width = pNew.toFixed(1) + '%';
            document.getElementById('barDsMort').style.width = pMort.toFixed(1) + '%';
            document.getElementById('barDsFees').style.width = pFees.toFixed(1) + '%';

            document.getElementById('legDsNet').textContent = 'Cash Surplus (' + pNet.toFixed(1) + '%)';
            document.getElementById('legDsNewH').textContent = 'New Home (' + pNew.toFixed(1) + '%)';
            document.getElementById('legDsMort').textContent = 'Mortgage (' + pMort.toFixed(1) + '%)';
            document.getElementById('legDsFees').textContent = 'Closing (' + pFees.toFixed(1) + '%)';
          }

          // Step derivations
          document.getElementById('dsStep1').textContent = 'Gross Sale ($' + sale.toLocaleString('en-US') + ') - Selling Fees ($' + Math.round(fees).toLocaleString('en-US') + ') - Mortgage Payoff ($' + mort.toLocaleString('en-US') + ') = $' + Math.round(netProceeds).toLocaleString('en-US') + ' net proceeds.';
          document.getElementById('dsStep2').textContent = 'Realized Gain = $' + Math.round(realizedGain).toLocaleString('en-US') + '. Section 121 exclusion = $' + exclusion.toLocaleString('en-US') + '. Taxable Gain = $' + Math.round(taxableGain).toLocaleString('en-US') + ' (Est. Tax = $' + Math.round(estCapTax).toLocaleString('en-US') + ').';
          document.getElementById('dsStep3').textContent = 'Surplus Cash = $' + Math.round(netProceeds - estCapTax).toLocaleString('en-US') + ' - $' + newH.toLocaleString('en-US') + ' (New Home) = ' + fmtUSD(cashSurplus) + ' added to liquid wealth.';
          document.getElementById('dsStep4').textContent = 'Monthly Living Expenses: $' + oldCost.toLocaleString('en-US') + ' (Old) - $' + newCost.toLocaleString('en-US') + ' (New) = ' + fmtUSD(moSaved) + ' / month (' + fmtUSD(yrSaved) + ' / year).';
        }

        function copyDownsizingSummary() {
          var sale = document.getElementById('ds-sale').value;
          var newH = document.getElementById('ds-new').value;
          var netCash = document.getElementById('ds-net-cash').textContent;
          var moSaved = document.getElementById('ds-mo-saved').textContent;
          var total10 = document.getElementById('ds-10yr-total').textContent;
          var taxShield = document.getElementById('ds-tax-shield').textContent;

          var text = '🏡 SENIOR HOME DOWNSIZING & CASH FLOW REPORT\n' +
            '----------------------------------------\n' +
            '• Current Home Sale Price: $' + Number(sale).toLocaleString('en-US') + '\n' +
            '• Replacement Home/Condo: $' + Number(newH).toLocaleString('en-US') + '\n' +
            '----------------------------------------\n' +
            'FINANCIAL SURPLUS & IMPACT:\n' +
            '• Net Liquid Cash Added to Wealth: ' + netCash + '\n' +
            '• Monthly Living Cost Reduction: ' + moSaved + '\n' +
            '• 10-Year Cumulative Financial Advantage: ' + total10 + '\n' +
            '• Section 121 Tax Shield Status: ' + taxShield + ' (' + document.getElementById('ds-cap-gain').textContent + ')\n' +
            '----------------------------------------\n' +
            'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/finance/downsizing-calculator';

          navigator.clipboard.writeText(text).then(function() {
            var btn = document.getElementById('btnCopyDown');
            var old = btn.innerHTML;
            btn.innerHTML = '✓ Copied Downsizing Report!';
            btn.style.background = '#10b981';
            btn.style.color = '#fff';
            setTimeout(function() {
              btn.innerHTML = old;
              btn.style.background = 'var(--surface-alt)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          });
        }

        document.addEventListener('DOMContentLoaded', calcDown);
      </script>
  `
  },
  {
    "slug": "inherited-ira-calculator",
    "title": "Inherited IRA 10-Year Rule & Annual RMD Calculator",
    "metaDesc": "Calculate required annual distributions and 10-year payout schedules for inherited Traditional and Roth IRAs under SECURE 2.0 and IRS final regulations.",
    "body": `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Inherited IRA Calculator
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Inherited IRA 10-Year Rule & RMD Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Under the SECURE Act and IRS final rules, most non-spouse beneficiaries must empty inherited IRAs within 10 years. Calculate your mandatory annual RMDs and tax-efficient withdrawal strategy.
          </p>
        </header>

        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Inherited Account Balance ($):</label>
              <input type="number" id="ira-bal" value="250000" step="10000" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcInherited()" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Account Type:</label>
              <select id="ira-type" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" onchange="calcInherited()">
                <option value="trad">Traditional IRA (Pre-Tax)</option>
                <option value="roth">Roth IRA (Tax-Free)</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Original Owner Passed Away:</label>
              <select id="ira-rbd" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" onchange="calcInherited()">
                <option value="after">AFTER reaching RMD age 73 (Annual RMDs Required)</option>
                <option value="before">BEFORE reaching RMD age 73 (No Annual RMDs, 10-Yr Empty)</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Beneficiary Age (in year of inheritance):</label>
              <input type="number" id="ira-age" value="48" min="18" max="95" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcInherited()" />
            </div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-align: center; margin-top: 1.5rem;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Optimal Equalized Annual Payout (To Minimize Tax Bracket Spikes)</div>
            <div id="ira-opt" style="font-family: var(--mono); font-size: 2.8rem; font-weight: bold; color: var(--btn-bg, #3b82f6); margin: 0.5rem 0;">$25,000 / yr</div>
            <div id="ira-note" style="font-size: 0.9rem; color: var(--text-muted);">
              IRS Minimum Rule: Must fully liquidate account to $0 by December 31 of Year 10.
            </div>
          </div>
        </div>

        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 1rem;">10-Year Distribution Schedule Projection</h3>
          <div id="ira-schedule" style="overflow-x: auto;"></div>
        </div>
      </div>

      <script>
        function calcInherited() {
          var bal = parseFloat(document.getElementById('ira-bal').value) || 0;
          var type = document.getElementById('ira-type').value;
          var rbd = document.getElementById('ira-rbd').value;
          var age = parseInt(document.getElementById('ira-age').value, 10) || 45;

          var equalAnnual = bal / 10;
          document.getElementById('ira-opt').textContent = '$' + Math.round(equalAnnual).toLocaleString('en-US') + ' / yr';

          if (rbd === 'after' && type === 'trad') {
            document.getElementById('ira-note').innerHTML = '⚠️ <strong>Annual RMDs in Years 1–9 Required:</strong> Because the original owner died after their Required Beginning Date, IRS final regulations require annual life-expectancy distributions in years 1–9 and full balance distributed by year 10.';
          } else if (type === 'roth') {
            document.getElementById('ira-note').innerHTML = '✅ <strong>Roth IRA Advantage:</strong> No annual RMDs are required in years 1–9! You can let the entire balance grow 100% tax-free until the final day of Year 10.';
          } else {
            document.getElementById('ira-note').innerHTML = 'ℹ️ <strong>Flexibility:</strong> Because the deceased died before age 73, no mandatory distributions are required in years 1–9, but distributing equal portions prevents a massive tax spike in year 10.';
          }

          var html = '<table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.85rem;"><thead><tr style="background: var(--surface-alt); text-align: left;"><th style="padding: 0.6rem; border: 1px solid var(--border);">Year</th><th style="padding: 0.6rem; border: 1px solid var(--border);">Beginning Balance</th><th style="padding: 0.6rem; border: 1px solid var(--border);">Equalized Distribution</th><th style="padding: 0.6rem; border: 1px solid var(--border);">Remaining Balance</th></tr></thead><tbody>';
          var curr = bal;
          for (var yr = 1; yr <= 10; yr++) {
            var dist = (yr === 10) ? curr : (bal / 10);
            var rem = Math.max(0, curr - dist);
            html += '<tr><td style="padding: 0.5rem; border: 1px solid var(--border);">Year ' + yr + '</td><td style="padding: 0.5rem; border: 1px solid var(--border);">' + '$' + Math.round(curr).toLocaleString('en-US') + '</td><td style="padding: 0.5rem; border: 1px solid var(--border); font-weight: bold; color: #22c55e;">' + '$' + Math.round(dist).toLocaleString('en-US') + '</td><td style="padding: 0.5rem; border: 1px solid var(--border);">' + '$' + Math.round(rem).toLocaleString('en-US') + '</td></tr>';
            curr = rem;
          }
          html += '</tbody></table>';
          document.getElementById('ira-schedule').innerHTML = html;
        }
        document.addEventListener('DOMContentLoaded', calcInherited);
      </script>
    `
  },
  {
    "slug": "judgment-interest",
    "title": "50-State Statutory Judgment Interest Calculator",
    "metaDesc": "Calculate statutory post-judgment and pre-judgment interest by state (California 10%, New York 9%, Texas, Florida, and more) with daily per diem accrual.",
    "body": `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Judgment Interest
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">50-State Statutory Judgment Interest Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Calculate post-judgment and pre-judgment interest, daily per diem accrual, and total amount owed on court judgments and settlements.
          </p>
        </header>

        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Principal Judgment Amount ($):</label>
              <input type="number" id="ji-principal" value="25000" step="500" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcJI()" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Jurisdiction / State Statutory Rate:</label>
              <select id="ji-state" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" onchange="updateStateRate()">
                <option value="10">California (10% simple - CCP § 685.010)</option>
                <option value="9">New York (9% simple - CPLR § 5004)</option>
                <option value="8.5">Texas (8.5% prime-linked - Fin. Code § 304.003)</option>
                <option value="9.09">Florida (9.09% statutory rate)</option>
                <option value="9">Illinois (9% non-consumer - 735 ILCS 5/2-1303)</option>
                <option value="12">Washington (12% simple - RCW 4.56.110)</option>
                <option value="custom">Custom Rate (%)</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Annual Interest Rate (%):</label>
              <input type="number" id="ji-rate" value="10" step="0.1" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcJI()" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Judgment Date:</label>
              <input type="date" id="ji-date" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1rem;" onchange="calcJI()" />
            </div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-align: center; margin-top: 1.5rem;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Total Accrued Amount Owed</div>
            <div id="ji-total" style="font-family: var(--mono); font-size: 2.8rem; font-weight: bold; color: #22c55e; margin: 0.5rem 0;">$27,500</div>
            <div style="font-size: 0.9rem; color: var(--text-muted);">
              Accrued Interest: <strong id="ji-interest" style="color: var(--fg); font-family: var(--mono);">$2,500</strong> | Daily Per Diem: <strong id="ji-perdiem" style="color: var(--fg); font-family: var(--mono);">$6.85 / day</strong> (<span id="ji-days">365</span> Days Elapsed)
            </div>
          </div>
        </div>

        <div style="text-align: center; margin: 1.5rem 0;">
          <button onclick=\"window.print()\" style=\"background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=\"2\" stroke-linecap="round" stroke-linejoin="round" style=\"display:inline-block;vertical-align:middle;margin-right:3px\"><polyline points=\"6 9 6 2 18 2 18 9\"/><path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"/><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\"/></svg> Print Judgment Accrual Worksheet
          </button>
        </div>
      </div>

      <script>
        function initDate() {
          var d = new Date();
          d.setFullYear(d.getFullYear() - 1);
          document.getElementById('ji-date').value = d.toISOString().split('T')[0];
        }

        function updateStateRate() {
          var val = document.getElementById('ji-state').value;
          if (val !== 'custom') {
            document.getElementById('ji-rate').value = val;
          }
          calcJI();
        }

        function calcJI() {
          var p = parseFloat(document.getElementById('ji-principal').value) || 0;
          var r = (parseFloat(document.getElementById('ji-rate').value) || 0) / 100;
          var dateVal = document.getElementById('ji-date').value;
          if (!dateVal) return;

          var jDate = new Date(dateVal);
          var today = new Date();
          var diffMs = today - jDate;
          var days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

          var perDiem = (p * r) / 365;
          var interest = perDiem * days;
          var total = p + interest;

          document.getElementById('ji-total').textContent = '$' + Math.round(total).toLocaleString('en-US');
          document.getElementById('ji-interest').textContent = '$' + Math.round(interest).toLocaleString('en-US');
          document.getElementById('ji-perdiem').textContent = '$' + perDiem.toFixed(2) + ' / day';
          document.getElementById('ji-days').textContent = days.toString();
        }

        document.addEventListener('DOMContentLoaded', function() { initDate(); calcJI(); });
      </script>
    `
  },
  {
    slug: "social-security-tax",
    title: "Social Security Taxability & \"Tax Torpedo\" Calculator (Provisional Income)",
    metaDesc: "Calculate federal income tax on Social Security benefits (0%, 50%, or 85%) using IRS Provisional Combined Income thresholds. Model the dreaded 40.7% Tax Torpedo marginal rate.",
    category: "Finance",
    faq: [
      {
            "q": "How much of my Social Security benefit is subject to federal income tax?",
            "a": "Depending on your Provisional (Combined) Income, up to 85% of your Social Security benefits may be taxable. For Single filers: below $25,000 is 0% taxable; between $25,000 and $34,000 is up to 50% taxable; above $34,000 is up to 85% taxable. For Married Filing Jointly: below $32,000 is 0% taxable; between $32,000 and $44,000 is up to 50% taxable; above $44,000 is up to 85% taxable. At least 15% of your benefits are always 100% tax-free at the federal level."
      },
      {
            "q": "What is the Social Security \"Tax Torpedo\"?",
            "a": "The Tax Torpedo occurs when a retiree withdraws money from a Traditional 401(k) or IRA, which not only gets taxed at ordinary income rates, but simultaneously pulls an additional $0.50 to $0.85 of Social Security benefits into the taxable income base. In the 22% federal tax bracket, this dual-taxation effect spikes the effective marginal tax rate to 40.7% ($1.00 of income + $0.85 taxable SS = $1.85 taxable × 22% = 40.7 cents in tax)."
      },
      {
            "q": "What is Provisional Income and how is it calculated?",
            "a": "Provisional Income (also called Combined Income by the IRS under IRC § 86) is defined as: Adjusted Gross Income (excluding Social Security) + Tax-Exempt Municipal Bond Interest + Exactly 50% of your Gross Social Security Benefits."
      },
      {
            "q": "Do Roth IRA withdrawals count toward Social Security taxability?",
            "a": "No. Qualified distributions from a Roth IRA or Roth 401(k) are completely exempt from Provisional Income. Because Roth withdrawals generate $0 of taxable income and $0 of provisional income, strategic Roth conversions before claiming Social Security can permanently disarm the Tax Torpedo."
      },
      {
            "q": "Which US states tax Social Security benefits in 2025/2026?",
            "a": "Currently, 41 states plus Washington D.C. exempt Social Security benefits completely from state income tax. Only 9 states still tax some or all Social Security benefits: Colorado, Connecticut, Minnesota, Montana, New Mexico, Rhode Island, Utah, Vermont, and West Virginia (though several of these offer income-based exemptions for lower-income seniors)."
      }
],
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Social Security Taxability
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Social Security Taxability & "Tax Torpedo" Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Calculate exactly what portion of your Social Security benefits is subject to federal income tax (0%, 50%, or 85%) using IRS Provisional Combined Income rules (IRC § 86), and simulate your exposure to the dreaded 40.7% Tax Torpedo marginal bracket.
          </p>
        </header>

        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <!-- Filing Status -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Tax Filing Status:</label>
              <select id="sst-status" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" onchange="calcSSTax()">
                <option value="single" selected>Single / Head of Household</option>
                <option value="joint">Married Filing Jointly</option>
              </select>
              <small style="color: var(--text-muted); font-size: 0.75rem;">Determines statutory provisional thresholds.</small>
            </div>

            <!-- Annual Social Security Benefits -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Annual Social Security Benefits ($):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="sst-ss" value="28000" step="1000" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcSSTax()" />
              </div>
              <small style="color: var(--text-muted); font-size: 0.75rem;">Box 5 from your SSA-1099 statement.</small>
            </div>

            <!-- Other Taxable Income -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Other Taxable Income (Wages, Pensions, IRAs) ($):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="sst-other" value="26000" step="1000" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcSSTax()" />
              </div>
              <small style="color: var(--text-muted); font-size: 0.75rem;">W-2 wages, pension checks, 401(k)/IRA RMDs.</small>
            </div>

            <!-- Tax-Exempt Interest -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Tax-Exempt Municipal Interest ($):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="sst-muni" value="0" step="500" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcSSTax()" />
              </div>
              <small style="color: var(--text-muted); font-size: 0.75rem;">Muni bonds (added back by IRS rules).</small>
            </div>
          </div>

          <!-- Hero Metrics Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Provisional Combined Income</div>
              <div id="sst-prov" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #3b82f6; margin: 0.35rem 0;">$40,000</div>
              <div id="sst-tier-status" style="font-size: 0.85rem; color: #ef4444; font-weight: bold;">Tier 3: 85% Taxable Zone</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Taxable Social Security</div>
              <div id="sst-taxable" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #ef4444; margin: 0.35rem 0;">$9,600</div>
              <div id="sst-taxable-pct" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">34.3% of total benefit taxed</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Guaranteed Tax-Free Portion</div>
              <div id="sst-taxfree" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">$18,400</div>
              <div id="sst-taxfree-pct" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">65.7% sheltered from tax</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Tax Torpedo Exposure</div>
              <div id="sst-torpedo" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #ef4444; margin: 0.35rem 0;">ACTIVE (40.7%)</div>
              <div id="sst-torpedo-detail" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">+$1k IRA &rarr; $850 more SS taxed</div>
            </div>
          </div>

          <!-- Copy Button -->
          <button type="button" id="btnCopySST" onclick="copySSTSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
            📋 Copy Social Security Taxability & Torpedo Report
          </button>
        </div>

        <!-- Visual Provisional Income Threshold Bar -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">📊 Provisional Income Threshold Spectrum</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
            Your location along the statutory IRS thresholds determining benefit taxation tiers:
          </p>

          <!-- 3 Tier Bar -->
          <div style="height: 24px; width: 100%; display: flex; border-radius: 4px; overflow: hidden; margin-bottom: 0.6rem; border: 1px solid var(--border);">
            <div style="width: 45%; background: #10b981;" title="Tier 1: 0% Taxable"></div>
            <div style="width: 17%; background: #f59e0b;" title="Tier 2: Up to 50% Taxable"></div>
            <div style="width: 38%; background: #ef4444;" title="Tier 3: Up to 85% Taxable"></div>
          </div>

          <!-- Threshold markers -->
          <div style="display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">
            <span style="color: #10b981;">0% Taxable Zone</span>
            <span id="txtT1Limit" style="color: #f59e0b;">$25,000</span>
            <span id="txtT2Limit" style="color: #ef4444;">$34,000 (85% Cliff)</span>
            <span style="color: #ef4444;">85% Taxable Zone</span>
          </div>
        </div>

        <!-- Step-by-Step Worked Algebraic Derivation -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step IRS Provisional Income Mathematics</h3>
            <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">26 U.S. Code § 86</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            The Internal Revenue Code computes taxable Social Security by calculating combined provisional income and applying statutory two-tier phasing:
          </p>
          <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 1: Calculate Provisional (Combined) Income</strong>
              <div id="sstStep1" style="color: #3b82f6; margin-top: 0.25rem;">Provisional Income = $26,000 (Other) + $0 (Muni) + (50% × $28,000 SS) = $40,000.00.</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 2: Tier 1 Calculation (50% Phase-In)</strong>
              <div id="sstStep2" style="color: var(--text-muted); margin-top: 0.25rem;">Excess above $25,000 capped at $9,000 spread = $9,000 × 50% = $4,500.00.</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 3: Tier 2 Calculation (85% Phase-In)</strong>
              <div id="sstStep3" style="color: var(--text-muted); margin-top: 0.25rem;">Excess above $34,000 = ($40,000 - $34,000) × 85% = $5,100.00.</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: #ef4444; font-weight: 700;">Step 4: Statutory Maximum Cap & Net Taxable Total</strong>
              <div id="sstStep4" style="color: #ef4444; margin-top: 0.25rem;">Total = Lesser of ($4,500 + $5,100 = $9,600) or 85% cap ($23,800) = $9,600.00 taxable.</div>
            </div>
          </div>
        </div>

        <!-- 4 Critical Social Security Tax Traps -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 4 Critical Social Security Tax Traps</h3>
          <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; display: grid; gap: 0.6rem;">
            <li><strong>The Non-Inflation-Indexed Statutory Trap:</strong> Unlike tax brackets, standard deductions, and 401(k) contribution limits, Congress has <strong>NEVER indexed the $25,000 and $32,000 provisional thresholds for inflation</strong> since they were enacted in 1983. In 1983, less than 10% of seniors paid tax on benefits; today, over 50% of retirees are taxed due to pure inflation creep.</li>
            <li><strong>The 40.7% "Tax Torpedo" Zone:</strong> In the 85% phase-in zone, each $1.00 of additional IRA distribution pushes $0.85 of previously tax-free Social Security into your taxable income. If your base federal bracket is 22%, your actual marginal tax rate becomes ( 22% 	imes 1.85 = 40.7% ). Middle-class retirees often face higher marginal rates than millionaires.</li>
            <li><strong>The Municipal Bond Tax Illusion:</strong> Investors purchase municipal bonds believing interest is 100% tax-free. However, IRC § 86 specifically mandates that <em>tax-exempt interest must be added directly into provisional income</em>, silently triggering higher taxes on your Social Security checks.</li>
            <li><strong>State Taxation Exposure:</strong> 9 states (CO, CT, MN, MT, NM, RI, UT, VT, WV) still levy state income taxes on Social Security. Moving across state lines or taking a large one-time 401(k) withdrawal can trigger double state-and-federal taxation.</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 2rem 0;">
          <button onclick="window.print()" style="background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print Social Security Tax Worksheet
          </button>
        </div>
      </div>

      <script>
        function fmtUSD(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

        function calcSSTax() {
          var status = document.getElementById('sst-status').value;
          var ss = parseFloat(document.getElementById('sst-ss').value) || 0;
          var other = parseFloat(document.getElementById('sst-other').value) || 0;
          var muni = parseFloat(document.getElementById('sst-muni').value) || 0;

          // Thresholds
          var t1 = (status === 'joint') ? 32000 : 25000;
          var t2 = (status === 'joint') ? 44000 : 34000;

          document.getElementById('txtT1Limit').textContent = fmtUSD(t1);
          document.getElementById('txtT2Limit').textContent = fmtUSD(t2) + ' (85% Cliff)';

          var halfSS = ss * 0.5;
          var provisional = other + muni + halfSS;

          var taxable = 0;
          if (provisional > t2) {
            var tier1Spread = t2 - t1;
            var part1 = Math.min(halfSS, tier1Spread * 0.5);
            var part2 = (provisional - t2) * 0.85;
            taxable = Math.min(part1 + part2, ss * 0.85);
          } else if (provisional > t1) {
            taxable = Math.min((provisional - t1) * 0.5, halfSS);
          }

          var taxFree = Math.max(0, ss - taxable);
          var taxPct = ss > 0 ? ((taxable / ss) * 100) : 0;
          var freePct = ss > 0 ? ((taxFree / ss) * 100) : 100;

          document.getElementById('sst-prov').textContent = fmtUSD(provisional);
          document.getElementById('sst-taxable').textContent = fmtUSD(taxable);
          document.getElementById('sst-taxable-pct').textContent = taxPct.toFixed(1) + '% of total benefit taxed';
          document.getElementById('sst-taxfree').textContent = fmtUSD(taxFree);
          document.getElementById('sst-taxfree-pct').textContent = freePct.toFixed(1) + '% sheltered from tax';

          var tierStatusEl = document.getElementById('sst-tier-status');
          var torpedoEl = document.getElementById('sst-torpedo');
          var torpedoDetailEl = document.getElementById('sst-torpedo-detail');

          if (provisional <= t1) {
            tierStatusEl.textContent = 'Tier 1: 0% Taxable Zone';
            tierStatusEl.style.color = '#10b981';
            torpedoEl.textContent = 'INACTIVE (0%)';
            torpedoEl.style.color = '#10b981';
            torpedoDetailEl.textContent = 'Extra income will not trigger tax on SS';
          } else if (provisional <= t2) {
            tierStatusEl.textContent = 'Tier 2: 50% Phase-In Zone';
            tierStatusEl.style.color = '#f59e0b';
            torpedoEl.textContent = 'MODERATE (33.0%)';
            torpedoEl.style.color = '#f59e0b';
            torpedoDetailEl.textContent = '+$1k IRA → $500 more SS taxed (1.5x rate)';
          } else {
            tierStatusEl.textContent = 'Tier 3: 85% Phase-In Zone';
            tierStatusEl.style.color = '#ef4444';
            torpedoEl.textContent = 'ACTIVE (40.7%)';
            torpedoEl.style.color = '#ef4444';
            torpedoDetailEl.textContent = '+$1k IRA → $850 more SS taxed (1.85x rate)';
          }

          // Step derivations
          document.getElementById('sstStep1').textContent = 'Provisional Income = ' + fmtUSD(other) + ' (Other) + ' + fmtUSD(muni) + ' (Muni) + (50% × ' + fmtUSD(ss) + ' SS) = ' + fmtUSD(provisional) + '.';
          if (provisional <= t1) {
            document.getElementById('sstStep2').textContent = 'Provisional Income (' + fmtUSD(provisional) + ') is below Tier 1 threshold (' + fmtUSD(t1) + '). Taxable amount = $0.00.';
            document.getElementById('sstStep3').textContent = 'Tier 2 not applicable.';
            document.getElementById('sstStep4').textContent = '100% of your Social Security benefits are tax-free.';
          } else if (provisional <= t2) {
            var diff = provisional - t1;
            document.getElementById('sstStep2').textContent = 'Excess above ' + fmtUSD(t1) + ' = ' + fmtUSD(diff) + ' × 50% = ' + fmtUSD(diff * 0.5) + '.';
            document.getElementById('sstStep3').textContent = 'Provisional Income is below Tier 2 threshold (' + fmtUSD(t2) + ').';
            document.getElementById('sstStep4').textContent = 'Taxable amount = ' + fmtUSD(taxable) + ' (' + taxPct.toFixed(1) + '% of total benefit).';
          } else {
            var spread = t2 - t1;
            var t1Amt = Math.min(halfSS, spread * 0.5);
            var t2Amt = (provisional - t2) * 0.85;
            document.getElementById('sstStep2').textContent = 'Tier 1 (' + fmtUSD(t1) + ' to ' + fmtUSD(t2) + ') = ' + fmtUSD(spread) + ' × 50% = ' + fmtUSD(t1Amt) + '.';
            document.getElementById('sstStep3').textContent = 'Tier 2 excess above ' + fmtUSD(t2) + ' = ' + fmtUSD(provisional - t2) + ' × 85% = ' + fmtUSD(t2Amt) + '.';
            document.getElementById('sstStep4').textContent = 'Total Taxable = Min(' + fmtUSD(t1Amt + t2Amt) + ', 85% cap ' + fmtUSD(ss * 0.85) + ') = ' + fmtUSD(taxable) + '.';
          }
        }

        function copySSTSummary() {
          var status = document.getElementById('sst-status').value;
          var ss = document.getElementById('sst-ss').value;
          var other = document.getElementById('sst-other').value;
          var prov = document.getElementById('sst-prov').textContent;
          var taxable = document.getElementById('sst-taxable').textContent;
          var taxFree = document.getElementById('sst-taxfree').textContent;
          var torpedo = document.getElementById('sst-torpedo').textContent;

          var text = '🏛️ SOCIAL SECURITY TAXABILITY & TORPEDO REPORT\n' +
            '----------------------------------------\n' +
            '• Filing Status: ' + (status === 'joint' ? 'Married Filing Jointly' : 'Single / Head of Household') + '\n' +
            '• Annual Social Security: $' + Number(ss).toLocaleString('en-US') + '\n' +
            '• Other Income: $' + Number(other).toLocaleString('en-US') + '\n' +
            '• Provisional Combined Income: ' + prov + '\n' +
            '----------------------------------------\n' +
            'TAXABILITY BREAKDOWN:\n' +
            '• Taxable Social Security Amount: ' + taxable + ' (' + document.getElementById('sst-taxable-pct').textContent + ')\n' +
            '• Guaranteed Tax-Free Portion: ' + taxFree + ' (' + document.getElementById('sst-taxfree-pct').textContent + ')\n' +
            '• Tax Torpedo Marginal Exposure: ' + torpedo + '\n' +
            '----------------------------------------\n' +
            'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/finance/social-security-tax';

          navigator.clipboard.writeText(text).then(function() {
            var btn = document.getElementById('btnCopySST');
            var old = btn.innerHTML;
            btn.innerHTML = '✓ Copied Taxability Report!';
            btn.style.background = '#10b981';
            btn.style.color = '#fff';
            setTimeout(function() {
              btn.innerHTML = old;
              btn.style.background = 'var(--surface-alt)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          });
        }

        document.addEventListener('DOMContentLoaded', calcSSTax);
      </script>
  `
  },
  {
    slug: "car-depreciation-calculator",
    title: "Car Depreciation Calculator (5-Year & 10-Year Residual Value)",
    metaDesc: "Estimate vehicle depreciation over 1 to 10 years. Calculate residual trade-in value, private party price, cost per mile, and monthly depreciation loss for cars, SUVs, trucks, and EVs.",
    category: "Finance",
    faq: [
      {
            "q": "How much value does a new car lose in its first year?",
            "a": "A typical new vehicle loses between 15% and 25% of its total retail value in the first 12 months of ownership. The steepest drop occurs the moment the vehicle is driven off the dealer lot, commonly shedding 10% immediately due to retail-to-wholesale depreciation and non-recoverable registration fees."
      },
      {
            "q": "What vehicle types hold their value the best over 5 years?",
            "a": "Full-size pickup trucks (such as the Ford F-150 and Toyota Tundra) and body-on-frame SUVs (such as the Toyota 4Runner and Jeep Wrangler) historically retain the most value, often retaining 55% to 65% of their initial MSRP after 5 years. In contrast, luxury German sedans and rapid-turnover electric vehicles often retain only 35% to 45%."
      },
      {
            "q": "Why do electric vehicles (EVs) depreciate faster than gas-powered cars?",
            "a": "Electric vehicles experience accelerated initial depreciation due to three factors: rapid generational battery improvements that make older models technologically obsolete, aggressive price cuts from new EV manufacturers, and federal/state purchase tax credits which effectively discount the real starting purchase price for secondary buyers."
      },
      {
            "q": "What is the difference between dealer trade-in value and private party resale value?",
            "a": "Private party resale value is the price an individual buyer will pay on the open market, representing the vehicle's true market fair value. Dealer trade-in value is wholesale pricing, typically 12% to 18% lower than private party, allowing the dealership margin to recondition, detail, warrant, and retail the vehicle."
      },
      {
            "q": "How does annual mileage impact a car's depreciation rate?",
            "a": "The national standard baseline is 12,000 to 15,000 miles per year. Driving in excess of 18,000 miles per year increases annual depreciation by 10% to 25%, as major mechanical warranty thresholds (such as 36,000-mile bumper-to-bumper or 60,000-mile powertrain warranties) are breached prematurely, reducing buyer confidence."
      }
],
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Car Depreciation Calculator
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Car Depreciation & Residual Value Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Calculate your vehicle's multi-year residual value, annual dollar loss, private party vs. dealer trade-in spread, and true ownership cost per mile across all major vehicle categories.
          </p>
        </header>

        <!-- Main Calculator Controls Grid -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <!-- Purchase Price -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Purchase Price / MSRP ($ USD):</label>
              <div style="position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);">$</span>
                <input type="number" id="carPrice" value="42000" min="1000" max="300000" step="500" style="width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcCarDeprec()" />
              </div>
              <div style="display: flex; gap: 0.35rem; margin-top: 0.4rem; flex-wrap: wrap;">
                <button type="button" onclick="setCarPrice(25000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$25k (Econ)</button>
                <button type="button" onclick="setCarPrice(42000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$42k (SUV)</button>
                <button type="button" onclick="setCarPrice(65000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$65k (Truck)</button>
                <button type="button" onclick="setCarPrice(95000)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.75rem; font-family: var(--mono); cursor: pointer;">$95k (Lux/EV)</button>
              </div>
            </div>

            <!-- Vehicle Category -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Vehicle Category & Retention:</label>
              <select id="carType" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" onchange="calcCarDeprec()">
                <option value="truck">Full-Size Truck / Van (Highest Retention ~60% @ 5yr)</option>
                <option value="suv" selected>Compact / Midsize SUV (Average Retention ~50% @ 5yr)</option>
                <option value="sedan">Economy Sedan / Hatchback (Moderate ~45% @ 5yr)</option>
                <option value="luxury">Luxury / Executive Sedan (High Loss ~38% @ 5yr)</option>
                <option value="ev">Electric Vehicle EV (Rapid Loss ~32% @ 5yr)</option>
                <option value="sports">Sports & Enthusiast Car (Steady ~48% @ 5yr)</option>
              </select>
              <small style="color: var(--text-muted); font-size: 0.75rem;">Based on 5-year iSeeCars & Black Book historical resale curves.</small>
            </div>

            <!-- Annual Mileage -->
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Annual Driving Mileage:</label>
              <select id="carMiles" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" onchange="calcCarDeprec()">
                <option value="8000">Low Mileage (8,000 mi/yr - Weekend Car)</option>
                <option value="12000" selected>Average Mileage (12,000 mi/yr - US Median)</option>
                <option value="15000">Above Average (15,000 mi/yr - Commuter)</option>
                <option value="20000">High Mileage (20,000 mi/yr - Long Haul)</option>
                <option value="25000">Extreme Mileage (25,000 mi/yr - Rideshare)</option>
              </select>
              <small style="color: var(--text-muted); font-size: 0.75rem;">Adjusts mechanical wear factor & warranty cliff.</small>
            </div>

            <!-- Horizon Slider -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <label style="font-size: 0.85rem; font-weight: bold;">Ownership Period:</label>
                <span id="horizonLabel" style="font-family: var(--mono); font-size: 0.85rem; color: #3b82f6; font-weight: bold;">5 Years</span>
              </div>
              <input type="range" id="carHorizon" min="1" max="10" value="5" step="1" style="width: 100%; accent-color: #3b82f6; cursor: pointer;" oninput="onHorizonChange()" />
              <div style="display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted);">
                <span>1 Yr</span><span>3 Yr</span><span>5 Yr</span><span>7 Yr</span><span>10 Yr</span>
              </div>
            </div>
          </div>

          <!-- Hero Metrics Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Projected Resale (Private)</div>
              <div id="carResale" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">$21,420</div>
              <div id="carRetainedPct" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">51.0% of MSRP retained</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Dealer Trade-In Value</div>
              <div id="carTradeIn" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #3b82f6; margin: 0.35rem 0;">$18,421</div>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Wholesale liquidation (~86%)</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Depreciation Loss</div>
              <div id="carTotalLoss" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: #ef4444; margin: 0.35rem 0;">-$20,580</div>
              <div id="carLossPct" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">49.0% value lost</div>
            </div>
            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Depreciation Per Mile</div>
              <div id="carPerMile" style="font-family: var(--mono); font-size: 2.1rem; font-weight: bold; color: var(--fg); margin: 0.35rem 0;">$0.343 / mi</div>
              <div id="carMonthly" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">$343 / mo hidden cost</div>
            </div>
          </div>

          <!-- Copy Button -->
          <button type="button" id="btnCopyCar" onclick="copyCarSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
            📋 Copy Vehicle Valuation & Depreciation Report
          </button>
        </div>

        <!-- Interactive SVG Depreciation Curve -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📈 10-Year Residual Value Trajectory</h3>
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Green: Retained Value | Red Dotted: Target Horizon</span>
          </div>
          <div style="width: 100%; overflow-x: auto;">
            <svg id="carDeprecSvg" viewBox="0 0 600 240" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);"></svg>
          </div>
        </div>

        <!-- Year-by-Year Depreciation Schedule -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">📅 Full 10-Year Ownership Schedule</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.85rem; text-align: left;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border); color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">
                  <th style="padding: 0.5rem 0.6rem;">Year</th>
                  <th style="padding: 0.5rem 0.6rem;">Start Value</th>
                  <th style="padding: 0.5rem 0.6rem;">Annual Loss ($)</th>
                  <th style="padding: 0.5rem 0.6rem;">Private Resale</th>
                  <th style="padding: 0.5rem 0.6rem;">Trade-In</th>
                  <th style="padding: 0.5rem 0.6rem;">Cumulative Loss</th>
                </tr>
              </thead>
              <tbody id="carScheduleBody"></tbody>
            </table>
          </div>
        </div>

        <!-- Step-by-Step Worked Algebraic Derivation -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Depreciation Mathematics</h3>
            <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Residual Compounding Model</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            Vehicle residual value is computed via discrete non-linear compounding where the annual decay factor ( d_t ) scales with category characteristics and annual mileage exposure:
          </p>
          <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 1: Baseline Purchase Basis & Category Rate</strong>
              <div id="carStep1" style="color: #3b82f6; margin-top: 0.25rem;">Purchase Basis = $42,000.00. Category: Midsize SUV (Year 1 Base Loss = 20.0%).</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 2: Mileage Scaling Factor Adjustment</strong>
              <div id="carStep2" style="color: var(--text-muted); margin-top: 0.25rem;">Mileage Multiplier = 1.00x (Standard 12,000 mi/yr baseline).</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 3: Compounded Residual Valuation</strong>
              <div id="carStep3" style="color: var(--text-muted); margin-top: 0.25rem;">V(5) = $42,000 × (1 - 0.200) × (1 - 0.130) × (1 - 0.110) × (1 - 0.090) × (1 - 0.080) = $21,420.00.</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: #10b981; font-weight: 700;">Step 4: True Operating Burden Derivation</strong>
              <div id="carStep4" style="color: #10b981; margin-top: 0.25rem;">Depreciation Loss = $20,580 over 60,000 total miles = $0.343 / mile ($343.00 / month).</div>
            </div>
          </div>
        </div>

        <!-- 5 Critical Car Depreciation Traps -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Critical Vehicle Depreciation Traps</h3>
          <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; display: grid; gap: 0.6rem;">
            <li><strong>The "Drive-Off Lot" Immediate 10% Cliff:</strong> The instant a new car drives off a dealership lot, its title converts from Manufacturer Statement of Origin (MSO) to used. It instantly sheds dealer prep charges, retail markup, and destination fees—money you can never recover upon resale.</li>
            <li><strong>The 72 to 84-Month "Negative Equity" Trap:</strong> Long loan terms mean the outstanding loan balance drops slower than the car depreciates. Buyers who finance over 6 or 7 years remain "underwater" for 4+ years. If the vehicle is totaled, insurance pays market fair value, leaving a multi-thousand-dollar balance unless GAP coverage is active.</li>
            <li><strong>The EV Battery Obsolescence & Subsidy Distortion:</strong> Rapid advances in battery chemistries and charging architectures make earlier EV generations technologically inferior within 3 to 4 years. Furthermore, original buyers capture federal tax credits ($7,500), which used car buyers price in as an automatic discount.</li>
            <li><strong>Out-of-Warranty Luxury Depreciation Acceleration:</strong> German luxury brands (BMW, Mercedes, Audi) experience steep secondary depreciation cliffs starting at Year 4 or Year 5 when the original factory warranty expires, as secondary buyers fear high maintenance and specialized repair costs.</li>
            <li><strong>The High-Mileage Compounding Curve:</strong> Exceeding 15,000 miles/yr accelerates mechanical depreciation faster than simple linear wear, as psychological odometer milestones (36k, 60k, 100k miles) trigger sharp valuation step-downs in dealer valuation algorithms (Black Book & Manheim).</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 2rem 0;">
          <button onclick="window.print()" style="background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print Vehicle Depreciation Worksheet
          </button>
        </div>
      </div>

      <script>
        var deprecRates = {
          truck:  [0.16, 0.10, 0.09, 0.08, 0.07, 0.06, 0.06, 0.05, 0.05, 0.05],
          suv:    [0.20, 0.13, 0.11, 0.09, 0.08, 0.07, 0.07, 0.06, 0.06, 0.05],
          sedan:  [0.22, 0.14, 0.12, 0.10, 0.09, 0.08, 0.07, 0.06, 0.06, 0.05],
          luxury: [0.27, 0.18, 0.15, 0.12, 0.10, 0.09, 0.08, 0.07, 0.07, 0.06],
          ev:     [0.30, 0.20, 0.16, 0.13, 0.11, 0.10, 0.09, 0.08, 0.07, 0.06],
          sports: [0.23, 0.15, 0.12, 0.10, 0.08, 0.08, 0.07, 0.06, 0.06, 0.05]
        };

        function fmtUSD(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

        window.setCarPrice = function(p) {
          document.getElementById('carPrice').value = p;
          calcCarDeprec();
        };

        window.onHorizonChange = function() {
          var h = document.getElementById('carHorizon').value;
          document.getElementById('horizonLabel').textContent = h + (h === '1' ? ' Year' : ' Years');
          calcCarDeprec();
        };

        function calcCarDeprec() {
          var price = parseFloat(document.getElementById('carPrice').value) || 0;
          var cat = document.getElementById('carType').value || 'suv';
          var miles = parseInt(document.getElementById('carMiles').value, 10) || 12000;
          var horizon = parseInt(document.getElementById('carHorizon').value, 10) || 5;

          // Mileage multiplier relative to 12k baseline
          var milesMult = 1.0 + (miles - 12000) / 45000;
          if (milesMult < 0.85) milesMult = 0.85;
          if (milesMult > 1.30) milesMult = 1.30;

          var rates = deprecRates[cat] || deprecRates.suv;
          var curVal = price;
          var totalLoss = 0;
          var scheduleHtml = '';
          var yearlyVals = [price]; // Year 0 = initial price

          var targetResale = price;
          var targetLoss = 0;

          for (var i = 0; i < 10; i++) {
            var yr = i + 1;
            var startYrVal = curVal;
            var yrRate = Math.min(0.40, rates[i] * milesMult);
            var annualLoss = curVal * yrRate;
            curVal -= annualLoss;
            totalLoss += annualLoss;
            yearlyVals.push(curVal);

            var tradeInVal = curVal * 0.86; // Wholesale margin (~14% haircut)
            var cumPct = price > 0 ? ((totalLoss / price) * 100).toFixed(1) : '0.0';

            var isSelected = (yr === horizon);
            var rowBg = isSelected ? 'background: rgba(59, 130, 246, 0.08);' : '';

            scheduleHtml += '<tr style="border-bottom: 1px solid var(--border); ' + rowBg + '">' +
              '<td style="padding: 0.5rem 0.6rem; font-weight: bold;">Year ' + yr + (isSelected ? ' ⭐' : '') + '</td>' +
              '<td style="padding: 0.5rem 0.6rem;">' + fmtUSD(startYrVal) + '</td>' +
              '<td style="padding: 0.5rem 0.6rem; color: #ef4444;">-' + fmtUSD(annualLoss) + ' (' + (yrRate * 100).toFixed(1) + '%)</td>' +
              '<td style="padding: 0.5rem 0.6rem; font-weight: bold; color: #10b981;">' + fmtUSD(curVal) + '</td>' +
              '<td style="padding: 0.5rem 0.6rem; color: #3b82f6;">' + fmtUSD(tradeInVal) + '</td>' +
              '<td style="padding: 0.5rem 0.6rem; color: var(--text-muted);">' + cumPct + '%</td>' +
              '</tr>';

            if (yr === horizon) {
              targetResale = curVal;
              targetLoss = totalLoss;
            }
          }

          document.getElementById('carScheduleBody').innerHTML = scheduleHtml;

          // Hero metrics
          var tradeIn = targetResale * 0.86;
          var retainedPct = price > 0 ? ((targetResale / price) * 100).toFixed(1) : 0;
          var lossPct = price > 0 ? ((targetLoss / price) * 100).toFixed(1) : 0;
          var totalMilesDriven = miles * horizon;
          var perMile = totalMilesDriven > 0 ? (targetLoss / totalMilesDriven) : 0;
          var monthlyCost = targetLoss / (horizon * 12);

          document.getElementById('carResale').textContent = fmtUSD(targetResale);
          document.getElementById('carRetainedPct').textContent = retainedPct + '% of MSRP retained';
          document.getElementById('carTradeIn').textContent = fmtUSD(tradeIn);
          document.getElementById('carTotalLoss').textContent = '-' + fmtUSD(targetLoss);
          document.getElementById('carLossPct').textContent = lossPct + '% value lost';
          document.getElementById('carPerMile').textContent = '$' + perMile.toFixed(3) + ' / mi';
          document.getElementById('carMonthly').textContent = fmtUSD(monthlyCost) + ' / mo hidden cost';

          // Step derivations
          var catLabels = { truck: 'Full-Size Truck', suv: 'Midsize SUV', sedan: 'Economy Sedan', luxury: 'Luxury Sedan', ev: 'Electric Vehicle (EV)', sports: 'Sports Car' };
          document.getElementById('carStep1').textContent = 'Purchase Basis = ' + fmtUSD(price) + '. Category: ' + (catLabels[cat] || cat) + ' (Year 1 base loss = ' + (rates[0] * 100).toFixed(1) + '%).';
          document.getElementById('carStep2').textContent = 'Mileage Multiplier = ' + milesMult.toFixed(2) + 'x based on ' + miles.toLocaleString('en-US') + ' miles/year baseline exposure.';
          document.getElementById('carStep3').textContent = 'V(' + horizon + ') = ' + fmtUSD(targetResale) + ' private party market value (' + retainedPct + '% retained).';
          document.getElementById('carStep4').textContent = 'Total loss of ' + fmtUSD(targetLoss) + ' over ' + totalMilesDriven.toLocaleString('en-US') + ' total miles = $' + perMile.toFixed(3) + ' / mile (' + fmtUSD(monthlyCost) + ' / month).';

          // SVG rendering
          renderCarSvg(yearlyVals, horizon, price);
        }

        function renderCarSvg(vals, horizon, maxPrice) {
          var svg = document.getElementById('carDeprecSvg');
          var w = 600;
          var h = 240;
          var padLeft = 65;
          var padRight = 30;
          var padTop = 30;
          var padBottom = 40;

          var plotW = w - padLeft - padRight;
          var plotH = h - padTop - padBottom;

          var maxY = maxPrice > 0 ? maxPrice : 100;
          var points = [];

          for (var yr = 0; yr <= 10; yr++) {
            var x = padLeft + (yr / 10) * plotW;
            var val = vals[yr] || 0;
            var y = padTop + plotH - (val / maxY) * plotH;
            points.push({ x: x, y: y, yr: yr, val: val });
          }

          var pathD = 'M ' + points[0].x + ' ' + points[0].y;
          var areaD = 'M ' + points[0].x + ' ' + (padTop + plotH) + ' L ' + points[0].x + ' ' + points[0].y;
          for (var p = 1; p < points.length; p++) {
            pathD += ' L ' + points[p].x + ' ' + points[p].y;
            areaD += ' L ' + points[p].x + ' ' + points[p].y;
          }
          areaD += ' L ' + points[points.length - 1].x + ' ' + (padTop + plotH) + ' Z';

          var svgHtml = '';
          // Grid lines & Y axis labels
          for (var g = 0; g <= 4; g++) {
            var gy = padTop + (g / 4) * plotH;
            var gVal = maxY * (1 - g / 4);
            svgHtml += '<line x1="' + padLeft + '" y1="' + gy + '" x2="' + (w - padRight) + '" y2="' + gy + '" stroke="var(--border)" stroke-width="1" stroke-dasharray="3,3" />' +
              '<text x="' + (padLeft - 8) + '" y="' + (gy + 4) + '" font-family="var(--mono)" font-size="10" fill="var(--text-muted)" text-anchor="end">$' + Math.round(gVal / 1000) + 'k</text>';
          }

          // X axis labels
          for (var yr = 0; yr <= 10; yr += 2) {
            var gx = padLeft + (yr / 10) * plotW;
            svgHtml += '<text x="' + gx + '" y="' + (h - 12) + '" font-family="var(--mono)" font-size="11" fill="var(--text-muted)" text-anchor="middle">Yr ' + yr + '</text>';
          }

          // Area fill
          svgHtml += '<path d="' + areaD + '" fill="rgba(16, 185, 129, 0.12)" />';
          // Line path
          svgHtml += '<path d="' + pathD + '" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />';

          // Target horizon vertical dashed line
          var targetPt = points[horizon];
          if (targetPt) {
            svgHtml += '<line x1="' + targetPt.x + '" y1="' + padTop + '" x2="' + targetPt.x + '" y2="' + (padTop + plotH) + '" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4" />' +
              '<text x="' + targetPt.x + '" y="' + (padTop - 8) + '" font-family="var(--mono)" font-size="11" font-weight="bold" fill="#ef4444" text-anchor="middle">Selected: Yr ' + horizon + ' (' + fmtUSD(targetPt.val) + ')</text>';
          }

          // Points
          for (var i = 0; i < points.length; i++) {
            var pt = points[i];
            var isHorizon = (pt.yr === horizon);
            svgHtml += '<circle cx="' + pt.x + '" cy="' + pt.y + '" r="' + (isHorizon ? 6 : 4) + '" fill="' + (isHorizon ? '#ef4444' : '#10b981') + '" stroke="var(--surface)" stroke-width="2" />';
          }

          svg.innerHTML = svgHtml;
        }

        function copyCarSummary() {
          var price = document.getElementById('carPrice').value;
          var typeEl = document.getElementById('carType');
          var typeText = typeEl.options[typeEl.selectedIndex].text;
          var miles = document.getElementById('carMiles').value;
          var horizon = document.getElementById('carHorizon').value;
          var resale = document.getElementById('carResale').textContent;
          var tradeIn = document.getElementById('carTradeIn').textContent;
          var loss = document.getElementById('carTotalLoss').textContent;
          var perMile = document.getElementById('carPerMile').textContent;
          var monthly = document.getElementById('carMonthly').textContent;

          var text = '🚗 VEHICLE DEPRECIATION & RESIDUAL LOSS REPORT\n' +
            '----------------------------------------\n' +
            '• Initial Purchase Price: $' + Number(price).toLocaleString('en-US') + '\n' +
            '• Vehicle Category: ' + typeText + '\n' +
            '• Annual Mileage: ' + Number(miles).toLocaleString('en-US') + ' miles/year\n' +
            '• Ownership Horizon: ' + horizon + ' Years\n' +
            '----------------------------------------\n' +
            'VALUATION & RESIDUAL METRICS:\n' +
            '• Projected Resale Value (Private): ' + resale + ' (' + document.getElementById('carRetainedPct').textContent + ')\n' +
            '• Estimated Dealer Trade-In: ' + tradeIn + '\n' +
            '• Total Cumulative Loss: ' + loss + ' (' + document.getElementById('carLossPct').textContent + ')\n' +
            '• Depreciation Cost Per Mile: ' + perMile + '\n' +
            '• Monthly Depreciation Burden: ' + monthly + '\n' +
            '----------------------------------------\n' +
            'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/finance/car-depreciation-calculator';

          navigator.clipboard.writeText(text).then(function() {
            var btn = document.getElementById('btnCopyCar');
            var old = btn.innerHTML;
            btn.innerHTML = '✓ Copied Vehicle Valuation Report!';
            btn.style.background = '#10b981';
            btn.style.color = '#fff';
            setTimeout(function() {
              btn.innerHTML = old;
              btn.style.background = 'var(--surface-alt)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          });
        }

        document.addEventListener('DOMContentLoaded', calcCarDeprec);
      </script>
  `
  },
  {
    slug: 'hourly-to-salary-calculator',
    title: 'Hourly to Salary Calculator (Annual, Monthly & Take-Home Paycheck)',
    metaDesc: 'Convert hourly wage to annual salary, monthly income, and bi-weekly paychecks. Features overtime, paid PTO, unpaid vacation, and estimated FICA payroll tax deductions.',
    category: 'Finance & Career',
    faq: [
      { q: 'How do you convert an hourly wage to an annual salary?', a: 'Multiply your hourly wage by the number of hours worked per week, then multiply by the number of weeks worked per year: Annual Salary = Hourly Wage × Hours/Week × Weeks/Year. For standard full-time employment (40 hours/week, 52 weeks/year = 2,080 hours), multiply your hourly rate by 2,080. For example, $25/hr × 2,080 hours = $52,000/year.' },
      { q: 'What is the standard number of working hours in a year (2,080 vs 2,000)?', a: 'A full calendar year contains 52 weeks × 40 hours = 2,080 total working hours (assuming paid holidays and paid vacation). However, if your employer offers 2 weeks of unpaid vacation or you take 10 unpaid holidays, you work 50 weeks × 40 hours = 2,000 hours per year. 2,000 hours is also a common rule of thumb: simply double your hourly rate and add three zeros (e.g. $30/hr × 2,000 = $60,000).' },
      { q: 'How much is $25 an hour annually, monthly, and bi-weekly?', a: 'At standard 40 hours per week (2,080 hours/year), $25 per hour equals: Annual Salary: $52,000; Monthly Gross: $4,333.33; Bi-Weekly Paycheck (26 pay periods): $2,000.00; Weekly Paycheck: $1,000.00; Daily (8 hours): $200.00.' },
      { q: 'What mandatory payroll taxes (FICA) are deducted from my salary?', a: 'Federal Insurance Contributions Act (FICA) taxes are automatically deducted from all employee wages: Social Security tax is 6.2% (up to the annual wage cap of $168,600+), and Medicare tax is 1.45% (with an additional 0.9% for high earners over $200,000), totaling 7.65% in mandatory federal payroll taxes before federal and state income taxes.' },
      { q: 'How does overtime affect annual salary calculation?', a: 'Under the federal Fair Labor Standards Act (FLSA), non-exempt employees must be paid 1.5× their regular hourly rate for all hours worked beyond 40 in a workweek. If you earn $20/hr and work 5 hours of overtime weekly, your regular pay is $41,600 and your overtime pay is 5 hrs × $30/hr × 52 wks = $7,800, boosting your total annual gross to $49,400.' }
    ],
    body: `
      <style>
        .hs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.25rem; }
        .hs-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; text-align: center; }
        .hs-table { width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.84rem; margin-top: 1rem; }
        .hs-table th, .hs-table td { padding: 0.5rem 0.75rem; border: 1px solid var(--border); text-align: left; }
        .hs-table th { background: var(--surface-alt); font-weight: 600; }
        .hs-tab-btn { background: var(--surface-alt); border: 1px solid var(--border); padding: 0.45rem 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer; transition: all 0.15s; }
        .hs-tab-btn.active { background: var(--surface); border-color: var(--fg); font-weight: 600; color: var(--fg); }
      </style>

      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Hourly to Salary
        </nav>

        <header style="margin-bottom: 1.75rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Hourly to Salary Wage Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Convert hourly pay into annual salary and vice versa. Adjust hours per week, unpaid time off, 1.5&times; overtime boosts, and estimate mandatory FICA payroll tax deductions.
          </p>
        </header>

        <div class="tool-box">
          <!-- Mode Switcher -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
            <button type="button" class="hs-tab-btn active" id="btn-hs-hourly" onclick="switchHSMode('hourly')">Hourly Rate &rarr; Annual Salary</button>
            <button type="button" class="hs-tab-btn" id="btn-hs-salary" onclick="switchHSMode('salary')">Annual Salary &rarr; Hourly Wage</button>
          </div>

          <!-- Mode 1: Hourly Input -->
          <div id="hs-sec-hourly">
            <div class="field-group">
              <label class="field-label" for="hs-wage-input">Hourly Wage ($ USD / hr)</label>
              <input type="number" id="hs-wage-input" class="code-input" value="25" min="1" step="0.5" oninput="runHSCalc()" style="font-size: 1.3rem; font-weight: bold;" />
            </div>
          </div>

          <!-- Mode 2: Salary Input -->
          <div id="hs-sec-salary" style="display: none;">
            <div class="field-group">
              <label class="field-label" for="hs-salary-input">Annual Salary ($ USD / yr)</label>
              <input type="number" id="hs-salary-input" class="code-input" value="52000" min="1000" step="1000" oninput="runHSSalaryCalc()" style="font-size: 1.3rem; font-weight: bold;" />
            </div>
          </div>

          <!-- Work Schedule Customizer Grid -->
          <div class="grid-inputs" style="margin-top: 1rem;">
            <div class="field-group">
              <label class="field-label" for="hs-hrs-wk">Hours Worked / Week</label>
              <input type="number" id="hs-hrs-wk" class="code-input" value="40" min="1" max="80" step="1" oninput="triggerHSRecal()" />
            </div>
            <div class="field-group">
              <label class="field-label" for="hs-wks-yr">Working Weeks / Year</label>
              <select id="hs-wks-yr" class="code-input" onchange="triggerHSRecal()">
                <option value="52" selected>52 Weeks (Full Year, Paid PTO / Vacation)</option>
                <option value="50">50 Weeks (2 Weeks Unpaid Vacation = 2,000 hrs)</option>
                <option value="48">48 Weeks (4 Weeks Unpaid Time Off)</option>
                <option value="46">46 Weeks (School Year / Academic Schedule)</option>
              </select>
            </div>
            <div class="field-group">
              <label class="field-label" for="hs-ot-hrs">Weekly Overtime Hours (1.5&times;)</label>
              <input type="number" id="hs-ot-hrs" class="code-input" value="0" min="0" max="40" step="1" oninput="triggerHSRecal()" />
            </div>
            <div class="field-group">
              <label class="field-label" for="hs-bonus">Annual Bonus / Tips ($)</label>
              <input type="number" id="hs-bonus" class="code-input" value="0" min="0" step="250" oninput="triggerHSRecal()" />
            </div>
          </div>

          <!-- Quick Presets -->
          <div style="margin-top: 0.75rem; display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); width: 100%;">Popular Benchmarks:</span>
            <button type="button" class="btn-sec" onclick="setHSPreset(15)">$15/hr ($31.2k)</button>
            <button type="button" class="btn-sec" onclick="setHSPreset(20)">$20/hr ($41.6k)</button>
            <button type="button" class="btn-sec" onclick="setHSPreset(25)">$25/hr ($52.0k)</button>
            <button type="button" class="btn-sec" onclick="setHSPreset(35)">$35/hr ($72.8k)</button>
            <button type="button" class="btn-sec" onclick="setHSPreset(50)">$50/hr ($104.0k)</button>
            <button type="button" class="btn-sec" onclick="setHSPreset(75)">$75/hr ($156.0k)</button>
          </div>

          <!-- Hero Metrics Cards -->
          <div class="hs-grid">
            <div class="hs-card" style="border-top: 4px solid #10b981;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Annual Gross Salary</div>
              <div id="hs-res-annual" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">$52,000</div>
              <div id="hs-res-hrs-total" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">2,080 working hours/yr</div>
            </div>

            <div class="hs-card" style="border-top: 4px solid #3b82f6;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Monthly Gross Pay</div>
              <div id="hs-res-monthly" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: var(--fg); margin: 0.35rem 0;">$4,333</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">12 equal monthly paychecks</div>
            </div>

            <div class="hs-card" style="border-top: 4px solid #8b5cf6;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Bi-Weekly Paycheck</div>
              <div id="hs-res-biweekly" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #8b5cf6; margin: 0.35rem 0;">$2,000</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">26 paychecks per year</div>
            </div>

            <div class="hs-card" style="border-top: 4px solid #f59e0b;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Est. FICA Deductions</div>
              <div id="hs-res-fica" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin: 0.35rem 0;">-$3,978</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">7.65% Social Security & Medicare</div>
            </div>
          </div>

          <!-- Comprehensive Frequency Breakdown Table -->
          <div style="margin-top: 1.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 0.5rem;">Pay Frequency Schedule Breakdown</h3>
            <div style="overflow-x: auto;">
              <table class="hs-table">
                <thead>
                  <tr>
                    <th>Pay Frequency</th>
                    <th>Gross Pay</th>
                    <th>FICA Taxes (7.65%)</th>
                    <th>Est. Net (Pre-Income Tax)</th>
                  </tr>
                </thead>
                <tbody id="hs-freq-tbody"></tbody>
              </table>
            </div>
          </div>

          <!-- Step-by-Step Derivation Box -->
          <div style="margin-top: 1.5rem; background: var(--surface-alt); border-left: 3px solid #10b981; padding: 1.1rem 1.25rem; border-radius: 0 6px 6px 0; font-size: 0.9rem; line-height: 1.6;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.25rem;">Live Mathematical Derivation:</div>
            <div id="hs-steps" style="font-family: var(--mono); color: var(--fg);"></div>
          </div>

          <!-- Copy Button -->
          <div style="margin-top: 1.25rem; display: flex; justify-content: flex-end;">
            <button type="button" class="btn-sec" onclick="copyHSSummary(this)" style="font-family: var(--mono); font-size: 0.85rem; padding: 0.5rem 1rem;">
              📋 Copy Wage & Salary Summary
            </button>
          </div>
        </div>
      </div>

      <script>
        var activeHSMode = 'hourly';

        function switchHSMode(mode) {
          activeHSMode = mode;
          document.getElementById('hs-sec-hourly').style.display = mode === 'hourly' ? 'block' : 'none';
          document.getElementById('hs-sec-salary').style.display = mode === 'salary' ? 'block' : 'none';
          document.getElementById('btn-hs-hourly').className = 'hs-tab-btn' + (mode === 'hourly' ? ' active' : '');
          document.getElementById('btn-hs-salary').className = 'hs-tab-btn' + (mode === 'salary' ? ' active' : '');
          if (mode === 'hourly') runHSCalc(); else runHSSalaryCalc();
        }

        function triggerHSRecal() {
          if (activeHSMode === 'hourly') runHSCalc(); else runHSSalaryCalc();
        }

        function runHSCalc() {
          var hourly = parseFloat(document.getElementById('hs-wage-input').value) || 0;
          var hrsWk = parseFloat(document.getElementById('hs-hrs-wk').value) || 0;
          var wksYr = parseFloat(document.getElementById('hs-wks-yr').value) || 52;
          var otHrs = parseFloat(document.getElementById('hs-ot-hrs').value) || 0;
          var bonus = parseFloat(document.getElementById('hs-bonus').value) || 0;

          var regHoursAnnual = hrsWk * wksYr;
          var regPayAnnual = regHoursAnnual * hourly;
          var otPayAnnual = otHrs * (hourly * 1.5) * wksYr;
          var grossAnnual = regPayAnnual + otPayAnnual + bonus;

          renderHSResults(grossAnnual, hourly, regHoursAnnual + (otHrs * wksYr), hrsWk, wksYr, otHrs, bonus);
        }

        function runHSSalaryCalc() {
          var salary = parseFloat(document.getElementById('hs-salary-input').value) || 0;
          var hrsWk = parseFloat(document.getElementById('hs-hrs-wk').value) || 40;
          var wksYr = parseFloat(document.getElementById('hs-wks-yr').value) || 52;
          var bonus = parseFloat(document.getElementById('hs-bonus').value) || 0;

          var baseSalary = Math.max(0, salary - bonus);
          var totalHours = hrsWk * wksYr;
          var hourly = totalHours > 0 ? (baseSalary / totalHours) : 0;

          renderHSResults(salary, hourly, totalHours, hrsWk, wksYr, 0, bonus);
        }

        function renderHSResults(grossAnnual, hourly, totalHours, hrsWk, wksYr, otHrs, bonus) {
          var ficaAnnual = grossAnnual * 0.0765;
          var netAnnual = grossAnnual - ficaAnnual;

          var monthly = grossAnnual / 12;
          var biweekly = grossAnnual / 26;
          var semimonthly = grossAnnual / 24;
          var weekly = grossAnnual / wksYr;
          var daily = hrsWk > 0 ? (weekly / 5) : 0;

          document.getElementById('hs-res-annual').textContent = '$' + Math.round(grossAnnual).toLocaleString('en-US');
          document.getElementById('hs-res-hrs-total').textContent = totalHours.toLocaleString('en-US') + ' working hours/yr ($' + hourly.toFixed(2) + '/hr)';
          document.getElementById('hs-res-monthly').textContent = '$' + Math.round(monthly).toLocaleString('en-US');
          document.getElementById('hs-res-biweekly').textContent = '$' + Math.round(biweekly).toLocaleString('en-US');
          document.getElementById('hs-res-fica').textContent = '-$' + Math.round(ficaAnnual).toLocaleString('en-US');

          // Build Table
          var freqs = [
            { name: 'Annual (1 Year)', gross: grossAnnual, div: 1 },
            { name: 'Monthly (12 Paychecks)', gross: monthly, div: 12 },
            { name: 'Semi-Monthly (24 Paychecks)', gross: semimonthly, div: 24 },
            { name: 'Bi-Weekly (26 Paychecks)', gross: biweekly, div: 26 },
            { name: 'Weekly (52 Paychecks)', gross: weekly, div: 52 },
            { name: 'Daily (8-Hour Day)', gross: daily, div: 52 * 5 },
            { name: 'Hourly Wage', gross: hourly, div: totalHours }
          ];

          var rows = '';
          freqs.forEach(function(f) {
            var fFica = f.gross * 0.0765;
            var fNet = f.gross - fFica;
            rows += '<tr>' +
              '<td><strong>' + f.name + '</strong></td>' +
              '<td>$' + f.gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</td>' +
              '<td style="color:#ef4444;">-$' + fFica.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</td>' +
              '<td style="color:#10b981; font-weight:bold;">$' + fNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</td>' +
              '</tr>';
          });
          document.getElementById('hs-freq-tbody').innerHTML = rows;

          // Derivation Steps
          var steps = [
            '1. Base Hours Calculation: ' + hrsWk + ' hrs/wk &times; ' + wksYr + ' wks/yr = ' + (hrsWk * wksYr).toLocaleString('en-US') + ' standard working hours.',
            '2. Regular Base Pay: ' + (hrsWk * wksYr).toLocaleString('en-US') + ' hrs &times; $' + hourly.toFixed(2) + '/hr = $' + Math.round(hrsWk * wksYr * hourly).toLocaleString('en-US'),
            otHrs > 0 ? ('3. Overtime Pay (1.5&times; @ $' + (hourly * 1.5).toFixed(2) + '/hr): ' + otHrs + ' hrs/wk &times; $' + (hourly * 1.5).toFixed(2) + ' &times; ' + wksYr + ' wks = +$' + Math.round(otHrs * hourly * 1.5 * wksYr).toLocaleString('en-US')) : '3. Overtime: 0 overtime hours.',
            bonus > 0 ? ('4. Annual Bonus / Tips Added: +$' + bonus.toLocaleString('en-US')) : '4. Bonuses: None added.',
            '5. Total Annual Gross: $' + Math.round(grossAnnual).toLocaleString('en-US') + ' &rarr; Monthly: $' + Math.round(monthly).toLocaleString('en-US') + ' &bull; Bi-Weekly: $' + Math.round(biweekly).toLocaleString('en-US'),
            '6. Mandatory FICA Payroll Taxes (6.2% Social Security + 1.45% Medicare = 7.65%): -$' + Math.round(ficaAnnual).toLocaleString('en-US') + ' &rarr; Net Pre-Income Tax: $' + Math.round(netAnnual).toLocaleString('en-US')
          ].join('<br>');
          document.getElementById('hs-steps').innerHTML = steps;
        }

        function setHSPreset(rate) {
          switchHSMode('hourly');
          document.getElementById('hs-wage-input').value = rate;
          runHSCalc();
        }

        function copyHSSummary(btn) {
          var ann = document.getElementById('hs-res-annual').textContent.trim();
          var mo = document.getElementById('hs-res-monthly').textContent.trim();
          var bi = document.getElementById('hs-res-biweekly').textContent.trim();
          var fica = document.getElementById('hs-res-fica').textContent.trim();
          var hrs = document.getElementById('hs-res-hrs-total').textContent.trim();

          var summary = [
            '=== Hourly to Salary Breakdown ===',
            'Annual Gross Salary : ' + ann,
            'Monthly Gross       : ' + mo,
            'Bi-Weekly Paycheck  : ' + bi,
            'Work Schedule       : ' + hrs,
            'Est. FICA (7.65%)   : ' + fica,
            'Calculated at Digital Tools Shed (https://digitaltoolsshed.com/finance/hourly-to-salary-calculator.html)'
          ].join('\n');

          navigator.clipboard.writeText(summary).then(function() {
            var old = btn.textContent;
            btn.textContent = '✅ Copied to Clipboard!';
            btn.style.borderColor = '#10b981';
            setTimeout(function() {
              btn.textContent = old;
              btn.style.borderColor = '';
            }, 2000);
          });
        }

        document.addEventListener('DOMContentLoaded', function() { runHSCalc(); });
        runHSCalc();
      </script>
    `
  },
  {
    slug: 'sales-tax-calculator',
    title: 'Sales Tax Calculator (Add Tax, Reverse Tax & 50 US State Rates)',
    metaDesc: 'Calculate exact sales tax, checkout totals, or reverse calculate pre-tax prices. Includes state tax presets, local county surtaxes, and 50-state reference tables.',
    category: 'Finance & Tax',
    faq: [
      { q: 'How do you calculate sales tax on a purchase?', a: 'To calculate sales tax: Multiply the pre-tax price by the sales tax percentage rate divided by 100: Sales Tax = Pre-Tax Price × (Tax Rate / 100). Then add the tax to the original price to find the total: Total Amount = Pre-Tax Price + Sales Tax. For example, on a $120 item with an 8.25% tax rate, Sales Tax = $120 × 0.0825 = $9.90, and Total = $129.90.' },
      { q: 'How do you reverse calculate (back out) sales tax from a receipt total?', a: 'To find the original pre-tax price from a total receipt: Divide the total by 1 plus the sales tax rate in decimal form: Pre-Tax Price = Total Paid / (1 + Tax Rate / 100). The sales tax paid is then Total Paid minus Pre-Tax Price. For example, if you paid $108.00 total in a state with an 8% tax rate, Pre-Tax Price = $108.00 / 1.08 = $100.00, and Tax Paid = $8.00.' },
      { q: 'Which US states have no state sales tax?', a: 'Five US states do not levy a statewide sales tax, known as the "NOMAD" states: New Hampshire, Oregon, Montana, Alaska, and Delaware. Note that in Alaska, while there is no state-level sales tax, individual local municipalities and boroughs are permitted to levy local sales taxes up to 7.85%.' },
      { q: 'Why is my local sales tax higher than my state sales tax rate?', a: 'Most US states allow local jurisdictions (counties, cities, transit authorities, and special taxing districts) to levy local option sales taxes on top of the state baseline rate. For example, in California the state base rate is 7.25%, but local municipal district taxes in cities like Los Angeles and San Francisco push the combined rate to 9.50% or higher.' },
      { q: 'Are groceries and prescription drugs subject to sales tax?', a: 'In the majority of US states, unprepared food and groceries for home consumption and prescription medications are exempt from state sales tax or taxed at a reduced rate. However, prepared hot foods at restaurants and candy/sodas are generally subject to full sales tax.' }
    ],
    body: `
      <style>
        .st-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.25rem; }
        .st-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; text-align: center; }
        .st-table { width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; margin-top: 1rem; }
        .st-table th, .st-table td { padding: 0.5rem 0.75rem; border: 1px solid var(--border); text-align: left; }
        .st-table th { background: var(--surface-alt); font-weight: 600; }
      </style>

      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Sales Tax Calculator
        </nav>

        <header style="margin-bottom: 1.75rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Sales Tax & Reverse Tax Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Calculate checkout sales tax, back out the pre-tax price from receipt totals, and explore state and local county surtaxes for all 50 US states.
          </p>
        </header>

        <div class="tool-box">
          <!-- Calculation Mode Switcher -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
            <button type="button" class="hs-tab-btn active" id="btn-st-add" onclick="switchSTMode('add')">Mode 1: Add Sales Tax (Pre-Tax &rarr; Total)</button>
            <button type="button" class="hs-tab-btn" id="btn-st-reverse" onclick="switchSTMode('reverse')">Mode 2: Reverse Tax (Total Paid &rarr; Pre-Tax)</button>
          </div>

          <!-- Inputs -->
          <div class="grid-inputs">
            <div class="field-group">
              <label class="field-label" id="st-amount-label" for="st-amount">Pre-Tax Purchase Price ($ USD)</label>
              <input type="number" id="st-amount" class="code-input" value="100.00" min="0" step="0.5" oninput="runSTCalc()" style="font-size: 1.3rem; font-weight: bold;" />
            </div>

            <div class="field-group">
              <label class="field-label" for="st-state-select">Select US State (Auto-Sets Rates)</label>
              <select id="st-state-select" class="code-input" onchange="onStateSelectChange()">
                <option value="custom">-- Custom Rate --</option>
                <option value="AL">Alabama (4.00% State + 5.29% Avg Local = 9.29%)</option>
                <option value="AK">Alaska (0.00% State + 1.82% Avg Local = 1.82%)</option>
                <option value="AZ">Arizona (5.60% State + 2.80% Avg Local = 8.40%)</option>
                <option value="AR">Arkansas (6.50% State + 2.94% Avg Local = 9.44%)</option>
                <option value="CA" selected>California (7.25% State + 1.60% Avg Local = 8.85%)</option>
                <option value="CO">Colorado (2.90% State + 4.91% Avg Local = 7.81%)</option>
                <option value="CT">Connecticut (6.35% State, No Local = 6.35%)</option>
                <option value="DE">Delaware (0.00% - No Sales Tax)</option>
                <option value="FL">Florida (6.00% State + 1.02% Avg Local = 7.02%)</option>
                <option value="GA">Georgia (4.00% State + 3.40% Avg Local = 7.40%)</option>
                <option value="HI">Hawaii (4.00% State + 0.50% Avg Local = 4.50%)</option>
                <option value="ID">Idaho (6.00% State + 0.03% Avg Local = 6.03%)</option>
                <option value="IL">Illinois (6.25% State + 2.65% Avg Local = 8.90%)</option>
                <option value="IN">Indiana (7.00% State, No Local = 7.00%)</option>
                <option value="IA">Iowa (6.00% State + 0.94% Avg Local = 6.94%)</option>
                <option value="KS">Kansas (6.50% State + 2.21% Avg Local = 8.71%)</option>
                <option value="KY">Kentucky (6.00% State, No Local = 6.00%)</option>
                <option value="LA">Louisiana (4.45% State + 5.10% Avg Local = 9.55%)</option>
                <option value="ME">Maine (5.50% State, No Local = 5.50%)</option>
                <option value="MD">Maryland (6.00% State, No Local = 6.00%)</option>
                <option value="MA">Massachusetts (6.25% State, No Local = 6.25%)</option>
                <option value="MI">Michigan (6.00% State, No Local = 6.00%)</option>
                <option value="MN">Minnesota (6.875% State + 0.65% Avg Local = 7.525%)</option>
                <option value="MS">Mississippi (7.00% State + 0.07% Avg Local = 7.07%)</option>
                <option value="MO">Missouri (4.225% State + 4.16% Avg Local = 8.385%)</option>
                <option value="MT">Montana (0.00% - No Sales Tax)</option>
                <option value="NE">Nebraska (5.50% State + 1.47% Avg Local = 6.97%)</option>
                <option value="NV">Nevada (6.85% State + 1.39% Avg Local = 8.24%)</option>
                <option value="NH">New Hampshire (0.00% - No Sales Tax)</option>
                <option value="NJ">New Jersey (6.625% State - 3.313% in UEZ)</option>
                <option value="NM">New Mexico (4.875% State + 2.75% Avg Local = 7.625%)</option>
                <option value="NY">New York (4.00% State + 4.53% Avg Local = 8.53%)</option>
                <option value="NC">North Carolina (4.75% State + 2.25% Avg Local = 7.00%)</option>
                <option value="ND">North Dakota (5.00% State + 2.04% Avg Local = 7.04%)</option>
                <option value="OH">Ohio (5.75% State + 1.50% Avg Local = 7.25%)</option>
                <option value="OK">Oklahoma (4.50% State + 4.49% Avg Local = 8.99%)</option>
                <option value="OR">Oregon (0.00% - No Sales Tax)</option>
                <option value="PA">Pennsylvania (6.00% State + 1.00% Alleg / 2.0% Phila)</option>
                <option value="RI">Rhode Island (7.00% State, No Local = 7.00%)</option>
                <option value="SC">South Carolina (6.00% State + 1.44% Avg Local = 7.44%)</option>
                <option value="SD">South Dakota (4.20% State + 1.91% Avg Local = 6.11%)</option>
                <option value="TN">Tennessee (7.00% State + 2.55% Avg Local = 9.55%)</option>
                <option value="TX">Texas (6.25% State + 2.00% Max Local = 8.25%)</option>
                <option value="UT">Utah (6.10% State + 1.10% Avg Local = 7.20%)</option>
                <option value="VT">Vermont (6.00% State + 0.30% Avg Local = 6.30%)</option>
                <option value="VA">Virginia (5.30% State + 0.45% Avg Local = 5.75%)</option>
                <option value="WA">Washington (6.50% State + 2.79% Avg Local = 9.29%)</option>
                <option value="WV">West Virginia (6.00% State + 0.57% Avg Local = 6.57%)</option>
                <option value="WI">Wisconsin (5.00% State + 0.43% Avg Local = 5.43%)</option>
                <option value="WY">Wyoming (4.00% State + 1.36% Avg Local = 5.36%)</option>
              </select>
            </div>
          </div>

          <!-- Rates Breakdown Fields -->
          <div class="grid-inputs" style="margin-top: 1rem;">
            <div class="field-group">
              <label class="field-label" for="st-rate-state">State Tax Rate (%)</label>
              <input type="number" id="st-rate-state" class="code-input" value="7.25" min="0" max="25" step="0.01" oninput="onCustomRateInput()" />
            </div>
            <div class="field-group">
              <label class="field-label" for="st-rate-local">Local / County Surtax (%)</label>
              <input type="number" id="st-rate-local" class="code-input" value="1.60" min="0" max="15" step="0.01" oninput="onCustomRateInput()" />
            </div>
            <div class="field-group">
              <label class="field-label" for="st-rate-total">Combined Total Rate (%)</label>
              <input type="number" id="st-rate-total" class="code-input" value="8.85" min="0" max="40" step="0.01" oninput="onCombinedRateInput()" style="font-weight: bold;" />
            </div>
          </div>

          <!-- Hero Metrics Cards -->
          <div class="st-grid">
            <div class="st-card" style="border-top: 4px solid #10b981;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Checkout Price</div>
              <div id="st-res-total" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">$108.85</div>
              <div id="st-res-total-sub" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Including 8.85% total tax</div>
            </div>

            <div class="st-card" style="border-top: 4px solid #3b82f6;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Sales Tax Paid</div>
              <div id="st-res-tax" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.35rem 0;">$8.85</div>
              <div id="st-res-tax-sub" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">State: $7.25 | Local: $1.60</div>
            </div>

            <div class="st-card" style="border-top: 4px solid #8b5cf6;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Pre-Tax Subtotal Price</div>
              <div id="st-res-pretax" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: var(--fg); margin: 0.35rem 0;">$100.00</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Base price before tax</div>
            </div>
          </div>

          <!-- Step-by-Step Derivation Box -->
          <div style="margin-top: 1.5rem; background: var(--surface-alt); border-left: 3px solid #3b82f6; padding: 1.1rem 1.25rem; border-radius: 0 6px 6px 0; font-size: 0.9rem; line-height: 1.6;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.25rem;">Live Mathematical Solution:</div>
            <div id="st-steps" style="font-family: var(--mono); color: var(--fg);"></div>
          </div>

          <!-- Copy Button -->
          <div style="margin-top: 1.25rem; display: flex; justify-content: flex-end;">
            <button type="button" class="btn-sec" onclick="copySTSummary(this)" style="font-family: var(--mono); font-size: 0.85rem; padding: 0.5rem 1rem;">
              📋 Copy Sales Tax Receipt Breakdown
            </button>
          </div>
        </div>
      </div>

      <script>
        var activeSTMode = 'add';

        var stateTaxData = {
          AL: { state: 4.00, local: 5.29 },
          AK: { state: 0.00, local: 1.82 },
          AZ: { state: 5.60, local: 2.80 },
          AR: { state: 6.50, local: 2.94 },
          CA: { state: 7.25, local: 1.60 },
          CO: { state: 2.90, local: 4.91 },
          CT: { state: 6.35, local: 0.00 },
          DE: { state: 0.00, local: 0.00 },
          FL: { state: 6.00, local: 1.02 },
          GA: { state: 4.00, local: 3.40 },
          HI: { state: 4.00, local: 0.50 },
          ID: { state: 6.00, local: 0.03 },
          IL: { state: 6.25, local: 2.65 },
          IN: { state: 7.00, local: 0.00 },
          IA: { state: 6.00, local: 0.94 },
          KS: { state: 6.50, local: 2.21 },
          KY: { state: 6.00, local: 0.00 },
          LA: { state: 4.45, local: 5.10 },
          ME: { state: 5.50, local: 0.00 },
          MD: { state: 6.00, local: 0.00 },
          MA: { state: 6.25, local: 0.00 },
          MI: { state: 6.00, local: 0.00 },
          MN: { state: 6.875, local: 0.65 },
          MS: { state: 7.00, local: 0.07 },
          MO: { state: 4.225, local: 4.16 },
          MT: { state: 0.00, local: 0.00 },
          NE: { state: 5.50, local: 1.47 },
          NV: { state: 6.85, local: 1.39 },
          NH: { state: 0.00, local: 0.00 },
          NJ: { state: 6.625, local: 0.00 },
          NM: { state: 4.875, local: 2.75 },
          NY: { state: 4.00, local: 4.53 },
          NC: { state: 4.75, local: 2.25 },
          ND: { state: 5.00, local: 2.04 },
          OH: { state: 5.75, local: 1.50 },
          OK: { state: 4.50, local: 4.49 },
          OR: { state: 0.00, local: 0.00 },
          PA: { state: 6.00, local: 0.34 },
          RI: { state: 7.00, local: 0.00 },
          SC: { state: 6.00, local: 1.44 },
          SD: { state: 4.20, local: 1.91 },
          TN: { state: 7.00, local: 2.55 },
          TX: { state: 6.25, local: 2.00 },
          UT: { state: 6.10, local: 1.10 },
          VT: { state: 6.00, local: 0.30 },
          VA: { state: 5.30, local: 0.45 },
          WA: { state: 6.50, local: 2.79 },
          WV: { state: 6.00, local: 0.57 },
          WI: { state: 5.00, local: 0.43 },
          WY: { state: 4.00, local: 1.36 }
        };

        function switchSTMode(mode) {
          activeSTMode = mode;
          document.getElementById('btn-st-add').className = 'hs-tab-btn' + (mode === 'add' ? ' active' : '');
          document.getElementById('btn-st-reverse').className = 'hs-tab-btn' + (mode === 'reverse' ? ' active' : '');
          document.getElementById('st-amount-label').textContent = mode === 'add' ? 'Pre-Tax Purchase Price ($ USD)' : 'Total Paid (Including Tax) ($ USD)';
          runSTCalc();
        }

        function onStateSelectChange() {
          var code = document.getElementById('st-state-select').value;
          if (stateTaxData[code]) {
            document.getElementById('st-rate-state').value = stateTaxData[code].state;
            document.getElementById('st-rate-local').value = stateTaxData[code].local;
            document.getElementById('st-rate-total').value = (stateTaxData[code].state + stateTaxData[code].local).toFixed(3);
          }
          runSTCalc();
        }

        function onCustomRateInput() {
          var st = parseFloat(document.getElementById('st-rate-state').value) || 0;
          var loc = parseFloat(document.getElementById('st-rate-local').value) || 0;
          document.getElementById('st-rate-total').value = (st + loc).toFixed(3);
          document.getElementById('st-state-select').value = 'custom';
          runSTCalc();
        }

        function onCombinedRateInput() {
          document.getElementById('st-state-select').value = 'custom';
          runSTCalc();
        }

        function runSTCalc() {
          var amt = parseFloat(document.getElementById('st-amount').value) || 0;
          var totalRate = parseFloat(document.getElementById('st-rate-total').value) || 0;
          var stateRate = parseFloat(document.getElementById('st-rate-state').value) || 0;
          var localRate = parseFloat(document.getElementById('st-rate-local').value) || 0;

          var rateDec = totalRate / 100;
          var preTax = 0, taxTotal = 0, finalTotal = 0;

          if (activeSTMode === 'add') {
            preTax = amt;
            taxTotal = preTax * rateDec;
            finalTotal = preTax + taxTotal;
          } else {
            finalTotal = amt;
            preTax = rateDec > 0 ? (finalTotal / (1 + rateDec)) : finalTotal;
            taxTotal = finalTotal - preTax;
          }

          var stateTaxPortion = (totalRate > 0) ? (taxTotal * (stateRate / totalRate)) : 0;
          var localTaxPortion = taxTotal - stateTaxPortion;

          document.getElementById('st-res-total').textContent = '$' + finalTotal.toFixed(2);
          document.getElementById('st-res-total-sub').textContent = 'Combined rate: ' + totalRate.toFixed(2) + '%';
          document.getElementById('st-res-tax').textContent = '$' + taxTotal.toFixed(2);
          document.getElementById('st-res-tax-sub').textContent = 'State: $' + stateTaxPortion.toFixed(2) + ' | Local: $' + localTaxPortion.toFixed(2);
          document.getElementById('st-res-pretax').textContent = '$' + preTax.toFixed(2);

          var steps = [];
          if (activeSTMode === 'add') {
            steps.push('1. Convert combined rate to decimal: ' + totalRate.toFixed(3) + '% &divide; 100 = ' + rateDec.toFixed(5));
            steps.push('2. Compute total sales tax: $' + preTax.toFixed(2) + ' &times; ' + rateDec.toFixed(5) + ' = $' + taxTotal.toFixed(2));
            steps.push('3. Add sales tax to subtotal: $' + preTax.toFixed(2) + ' + $' + taxTotal.toFixed(2) + ' = <strong>$' + finalTotal.toFixed(2) + ' total price</strong>');
            if (stateRate > 0 && localRate > 0) {
              steps.push('4. Jurisdictional Allocation: State (' + stateRate + '%) = $' + stateTaxPortion.toFixed(2) + ' &bull; Local/County (' + localRate + '%) = $' + localTaxPortion.toFixed(2));
            }
          } else {
            steps.push('1. Reverse Tax Formula: Pre-Tax Price = Total Paid &divide; (1 + Tax Rate)');
            steps.push('2. Compute divisor: 1 + (' + totalRate.toFixed(3) + '% &divide; 100) = ' + (1 + rateDec).toFixed(5));
            steps.push('3. Divide register total: $' + finalTotal.toFixed(2) + ' &divide; ' + (1 + rateDec).toFixed(5) + ' = <strong>$' + preTax.toFixed(2) + ' original pre-tax price</strong>');
            steps.push('4. Difference is sales tax paid: $' + finalTotal.toFixed(2) + ' - $' + preTax.toFixed(2) + ' = <strong>$' + taxTotal.toFixed(2) + ' tax amount</strong>');
          }
          document.getElementById('st-steps').innerHTML = steps.join('<br>');
        }

        function copySTSummary(btn) {
          var tot = document.getElementById('st-res-total').textContent.trim();
          var tax = document.getElementById('st-res-tax').textContent.trim();
          var pre = document.getElementById('st-res-pretax').textContent.trim();
          var rate = document.getElementById('st-rate-total').value;

          var summary = [
            '=== Sales Tax Receipt Breakdown ===',
            'Pre-Tax Subtotal : ' + pre,
            'Tax Rate Applied : ' + rate + '%',
            'Sales Tax Paid   : ' + tax,
            'Final Total Paid : ' + tot,
            'Calculated at Digital Tools Shed (https://digitaltoolsshed.com/finance/sales-tax-calculator.html)'
          ].join('\n');

          navigator.clipboard.writeText(summary).then(function() {
            var old = btn.textContent;
            btn.textContent = '✅ Copied to Clipboard!';
            btn.style.borderColor = '#10b981';
            setTimeout(function() {
              btn.textContent = old;
              btn.style.borderColor = '';
            }, 2000);
          });
        }

        document.addEventListener('DOMContentLoaded', function() { onStateSelectChange(); });
        onStateSelectChange();
      </script>
    `
  },
  {
    slug: 'simple-interest-calculator',
    title: 'Simple Interest Calculator (I = Prt 4-Way Solver & Compound Comparison)',
    metaDesc: 'Solve for Interest, Principal, Rate, or Time using I = Prt. Features side-by-side compound interest comparison, SVG growth trajectory, and monthly schedule.',
    category: 'Finance & Loans',
    faq: [
      { q: 'What is the simple interest formula (I = Prt)?', a: 'The simple interest formula is: I = P × r × t, where I is the total interest accrued, P is the initial principal amount, r is the annual nominal interest rate in decimal form (rate / 100), and t is the time duration in years. For example, $10,000 borrowed at 6% simple interest for 3 years yields: I = $10,000 × 0.06 × 3 = $1,800 total interest.' },
      { q: 'What is the difference between simple interest and compound interest?', a: 'Simple interest is calculated exclusively on the original principal balance for the entire duration of the loan or deposit. Compound interest calculates interest on both the initial principal and the accumulated interest from previous periods ("interest on interest"). Over long time horizons, compound interest grows exponentially, while simple interest grows linearly.' },
      { q: 'How do you solve for Principal (P), Rate (r), or Time (t)?', a: 'By rearranging I = Prt: To find Principal: P = I / (r × t); To find Interest Rate: r = (I / (P × t)) × 100%; To find Time in years: t = I / (P × r).' },
      { q: 'Where is simple interest used in the real world?', a: 'Simple interest is standard for short-term personal promissory notes, auto loans (many vehicle financing contracts use simple interest accrual calculated daily on remaining balance), federal student loans in standard repayment, and certificates of deposit (CDs) that pay interest out directly rather than reinvesting it.' },
      { q: 'What is the total maturity balance formula in simple interest?', a: 'The future maturity balance (A) equals the original principal plus the accrued interest: A = P + I = P + (P × r × t) = P × (1 + r × t). For example, $5,000 at 5% simple interest for 4 years yields A = $5,000 × (1 + 0.05 × 4) = $5,000 × 1.20 = $6,000.' }
    ],
    body: `
      <style>
        .si-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.25rem; }
        .si-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; text-align: center; }
        .si-comp-table { width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; margin-top: 1rem; }
        .si-comp-table th, .si-comp-table td { padding: 0.5rem 0.75rem; border: 1px solid var(--border); text-align: left; }
        .si-comp-table th { background: var(--surface-alt); font-weight: 600; }
      </style>

      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Simple Interest
        </nav>

        <header style="margin-bottom: 1.75rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Simple Interest Calculator (I = Prt)</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Solve for Interest (I), Principal (P), Rate (r), or Time (t). Directly compare linear simple growth against compound interest with interactive SVG charts.
          </p>
        </header>

        <div class="tool-box">
          <!-- Solver Variable Selector -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
            <button type="button" class="hs-tab-btn active" id="btn-si-i" onclick="setSISolveVar('I')">Solve for Interest (I)</button>
            <button type="button" class="hs-tab-btn" id="btn-si-p" onclick="setSISolveVar('P')">Solve for Principal (P)</button>
            <button type="button" class="hs-tab-btn" id="btn-si-r" onclick="setSISolveVar('R')">Solve for Rate (r%)</button>
            <button type="button" class="hs-tab-btn" id="btn-si-t" onclick="setSISolveVar('T')">Solve for Time (t)</button>
          </div>

          <!-- Dynamic Input Grid -->
          <div class="grid-inputs">
            <div class="field-group" id="si-grp-p">
              <label class="field-label" for="si-p">Principal Amount ($ USD)</label>
              <input type="number" id="si-p" class="code-input" value="10000" min="1" step="100" oninput="runSICalc()" style="font-size: 1.2rem;" />
            </div>

            <div class="field-group" id="si-grp-r">
              <label class="field-label" for="si-r">Annual Interest Rate (%)</label>
              <input type="number" id="si-r" class="code-input" value="6.5" min="0.01" max="100" step="0.1" oninput="runSICalc()" style="font-size: 1.2rem;" />
            </div>

            <div class="field-group" id="si-grp-t">
              <label class="field-label" for="si-t">Time Period Duration</label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="number" id="si-t" class="code-input" value="3" min="0.1" step="0.5" oninput="runSICalc()" style="font-size: 1.2rem;" />
                <select id="si-t-unit" class="code-input" onchange="runSICalc()" style="width: auto;">
                  <option value="years" selected>Years</option>
                  <option value="months">Months</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>

            <div class="field-group" id="si-grp-i" style="display: none;">
              <label class="field-label" for="si-i">Total Accrued Interest ($ USD)</label>
              <input type="number" id="si-i" class="code-input" value="1950" min="1" step="50" oninput="runSICalc()" style="font-size: 1.2rem;" />
            </div>
          </div>

          <!-- Quick Presets -->
          <div style="margin-top: 0.75rem; display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); width: 100%;">Common Loan Scenarios:</span>
            <button type="button" class="btn-sec" onclick="setSIPreset(5000, 7.5, 3, 'years')">$5k Loan @ 7.5% (3 Yrs)</button>
            <button type="button" class="btn-sec" onclick="setSIPreset(15000, 5.0, 5, 'years')">$15k Auto @ 5% (5 Yrs)</button>
            <button type="button" class="btn-sec" onclick="setSIPreset(2000, 12.0, 18, 'months')">$2k Personal @ 12% (18 Mo)</button>
            <button type="button" class="btn-sec" onclick="setSIPreset(25000, 6.0, 4, 'years')">$25k Note @ 6% (4 Yrs)</button>
          </div>

          <!-- Hero Metrics Cards -->
          <div class="si-grid">
            <div class="si-card" style="border-top: 4px solid #10b981;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Maturity Future Value (A)</div>
              <div id="si-res-total" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">$11,950</div>
              <div id="si-res-p-sub" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Principal: $10,000</div>
            </div>

            <div class="si-card" style="border-top: 4px solid #3b82f6;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Simple Interest (I)</div>
              <div id="si-res-interest" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.35rem 0;">$1,950</div>
              <div id="si-res-rate-sub" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">6.50% per year for 3 years</div>
            </div>

            <div class="si-card" style="border-top: 4px solid #f59e0b;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Monthly Payback Rate</div>
              <div id="si-res-monthly" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin: 0.35rem 0;">$331.94 / mo</div>
              <div id="si-res-mo-sub" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Over 36 monthly payments</div>
            </div>
          </div>

          <!-- Simple vs Compound Divergence Comparison -->
          <div style="margin-top: 1.75rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 0.5rem;">Simple vs Compound Interest Divergence</h3>
            <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.5; margin-bottom: 0.75rem;">
              How much interest does compounding add over the exact same principal, rate, and time horizon?
            </p>
            <div style="overflow-x: auto;">
              <table class="si-comp-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Formula</th>
                    <th>Total Interest Accrued</th>
                    <th>Final Maturity Balance</th>
                    <th>Difference vs Simple</th>
                  </tr>
                </thead>
                <tbody id="si-comp-tbody"></tbody>
              </table>
            </div>
          </div>

          <!-- Interactive SVG Trajectory Graph -->
          <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap;">
              <span style="font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Growth Trajectory (Linear vs Exponential)</span>
              <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">
                <span style="color: #3b82f6;">■ Simple Interest</span> &nbsp;&bull;&nbsp; <span style="color: #10b981;">■ Compounded Monthly</span>
              </span>
            </div>
            <div id="si-svg-container" style="width: 100%; height: 160px;"></div>
          </div>

          <!-- Step-by-Step Derivation Box -->
          <div style="margin-top: 1.5rem; background: var(--surface-alt); border-left: 3px solid #10b981; padding: 1.1rem 1.25rem; border-radius: 0 6px 6px 0; font-size: 0.9rem; line-height: 1.6;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.25rem;">Live Mathematical Derivation:</div>
            <div id="si-steps" style="font-family: var(--mono); color: var(--fg);"></div>
          </div>

          <!-- Copy Button -->
          <div style="margin-top: 1.25rem; display: flex; justify-content: flex-end;">
            <button type="button" class="btn-sec" onclick="copySISummary(this)" style="font-family: var(--mono); font-size: 0.85rem; padding: 0.5rem 1rem;">
              📋 Copy Simple Interest Report
            </button>
          </div>
        </div>
      </div>

      <script>
        var currentSISolve = 'I';

        function setSISolveVar(v) {
          currentSISolve = v;
          ['I', 'P', 'R', 'T'].forEach(function(item) {
            document.getElementById('btn-si-' + item.toLowerCase()).className = 'hs-tab-btn' + (item === v ? ' active' : '');
          });

          document.getElementById('si-grp-p').style.display = v === 'P' ? 'none' : 'block';
          document.getElementById('si-grp-r').style.display = v === 'R' ? 'none' : 'block';
          document.getElementById('si-grp-t').style.display = v === 'T' ? 'none' : 'block';
          document.getElementById('si-grp-i').style.display = v === 'I' ? 'none' : 'block';

          runSICalc();
        }

        function runSICalc() {
          var p = parseFloat(document.getElementById('si-p').value) || 0;
          var rPct = parseFloat(document.getElementById('si-r').value) || 0;
          var tRaw = parseFloat(document.getElementById('si-t').value) || 0;
          var tUnit = document.getElementById('si-t-unit').value;
          var iInput = parseFloat(document.getElementById('si-i').value) || 0;

          var tYears = tUnit === 'months' ? (tRaw / 12) : (tUnit === 'days' ? (tRaw / 365) : tRaw);
          var rDec = rPct / 100;
          var interest = 0, principal = p, rate = rPct, timeY = tYears;

          if (currentSISolve === 'I') {
            interest = p * rDec * tYears;
          } else if (currentSISolve === 'P') {
            principal = (rDec * tYears > 0) ? (iInput / (rDec * tYears)) : 0;
            interest = iInput;
          } else if (currentSISolve === 'R') {
            rate = (p * tYears > 0) ? ((iInput / (p * tYears)) * 100) : 0;
            rDec = rate / 100;
            interest = iInput;
          } else if (currentSISolve === 'T') {
            timeY = (p * rDec > 0) ? (iInput / (p * rDec)) : 0;
            interest = iInput;
          }

          var totalBalance = principal + interest;
          var totalMonths = timeY * 12;
          var monthlyPay = totalMonths > 0 ? (totalBalance / totalMonths) : totalBalance;

          document.getElementById('si-res-total').textContent = '$' + Math.round(totalBalance).toLocaleString('en-US');
          document.getElementById('si-res-p-sub').textContent = 'Principal: $' + Math.round(principal).toLocaleString('en-US');
          document.getElementById('si-res-interest').textContent = '$' + Math.round(interest).toLocaleString('en-US');
          document.getElementById('si-res-rate-sub').textContent = rate.toFixed(2) + '% per year for ' + timeY.toFixed(2) + ' years';
          document.getElementById('si-res-monthly').textContent = '$' + monthlyPay.toFixed(2) + ' / mo';
          document.getElementById('si-res-mo-sub').textContent = 'Over ' + Math.max(1, Math.round(totalMonths)) + ' monthly payments';

          // Compounding comparison
          var cmpAnnual = principal * Math.pow(1 + rDec, timeY);
          var cmpMonthly = principal * Math.pow(1 + (rDec / 12), timeY * 12);
          var cmpDaily = principal * Math.pow(1 + (rDec / 365), timeY * 365);

          var compRows = [
            { name: 'Simple Interest', formula: 'P × (1 + rt)', total: totalBalance, int: interest },
            { name: 'Compounded Annually', formula: 'P × (1 + r)ᵗ', total: cmpAnnual, int: cmpAnnual - principal },
            { name: 'Compounded Monthly', formula: 'P × (1 + r/12)¹²ᵗ', total: cmpMonthly, int: cmpMonthly - principal },
            { name: 'Compounded Daily', formula: 'P × (1 + r/365)³⁶⁵ᵗ', total: cmpDaily, int: cmpDaily - principal }
          ];

          var rowsHtml = '';
          compRows.forEach(function(c) {
            var diff = c.total - totalBalance;
            rowsHtml += '<tr>' +
              '<td><strong>' + c.name + '</strong></td>' +
              '<td><code>' + c.formula + '</code></td>' +
              '<td style="color:#3b82f6; font-weight:600;">$' + Math.round(c.int).toLocaleString('en-US') + '</td>' +
              '<td><strong>$' + Math.round(c.total).toLocaleString('en-US') + '</strong></td>' +
              '<td style="color:' + (diff > 0 ? '#10b981' : 'var(--text-muted)') + ';">' + (diff > 0 ? '+$' + Math.round(diff).toLocaleString('en-US') + ' (+' + ((diff / totalBalance) * 100).toFixed(1) + '%)' : 'Baseline (0%)') + '</td>' +
              '</tr>';
          });
          document.getElementById('si-comp-tbody').innerHTML = rowsHtml;

          // Render Mini SVG Trajectory
          renderSISVG(principal, totalBalance, cmpMonthly, timeY);

          // Steps
          var steps = [];
          if (currentSISolve === 'I') {
            steps.push('1. Simple Interest Formula: I = P &times; r &times; t');
            steps.push('2. Substitution: $' + Math.round(principal).toLocaleString('en-US') + ' &times; ' + rDec.toFixed(4) + ' &times; ' + timeY.toFixed(2) + ' yrs = <strong>$' + interest.toFixed(2) + ' interest</strong>');
            steps.push('3. Total Maturity Amount: A = P + I = $' + Math.round(principal).toLocaleString('en-US') + ' + $' + interest.toFixed(2) + ' = <strong>$' + totalBalance.toFixed(2) + '</strong>');
          } else if (currentSISolve === 'P') {
            steps.push('1. Principal Formula: P = I &divide; (r &times; t)');
            steps.push('2. Substitution: $' + interest.toLocaleString('en-US') + ' &divide; (' + rDec.toFixed(4) + ' &times; ' + timeY.toFixed(2) + ') = <strong>$' + principal.toFixed(2) + ' Principal</strong>');
          } else if (currentSISolve === 'R') {
            steps.push('1. Interest Rate Formula: r = (I &divide; (P &times; t)) &times; 100%');
            steps.push('2. Substitution: ($' + interest.toLocaleString('en-US') + ' &divide; ($' + principal.toLocaleString('en-US') + ' &times; ' + timeY.toFixed(2) + ')) &times; 100% = <strong>' + rate.toFixed(2) + '% / year</strong>');
          } else {
            steps.push('1. Time Duration Formula: t = I &divide; (P &times; r)');
            steps.push('2. Substitution: $' + interest.toLocaleString('en-US') + ' &divide; ($' + principal.toLocaleString('en-US') + ' &times; ' + rDec.toFixed(4) + ') = <strong>' + timeY.toFixed(2) + ' years</strong> (' + (timeY * 12).toFixed(1) + ' months)');
          }
          document.getElementById('si-steps').innerHTML = steps.join('<br>');
        }

        function renderSISVG(p, simpleTotal, compTotal, timeY) {
          var container = document.getElementById('si-svg-container');
          var w = container.clientWidth || 500;
          var h = 160;
          var pad = 24;

          var maxVal = Math.max(simpleTotal, compTotal) * 1.05;
          var minVal = p * 0.95;

          function getY(val) {
            return h - pad - ((val - minVal) / (maxVal - minVal)) * (h - pad * 2);
          }

          var simpleD = 'M ' + pad + ' ' + getY(p) + ' L ' + (w - pad) + ' ' + getY(simpleTotal);

          // Build curve for comp
          var compPoints = [];
          var steps = 15;
          for (var i = 0; i <= steps; i++) {
            var frac = i / steps;
            var curT = timeY * frac;
            var curRate = parseFloat(document.getElementById('si-r').value) / 100;
            var curComp = p * Math.pow(1 + (curRate / 12), curT * 12);
            var x = pad + frac * (w - pad * 2);
            var y = getY(curComp);
            compPoints.push((i === 0 ? 'M ' : 'L ') + x.toFixed(1) + ' ' + y.toFixed(1));
          }

          var svg = '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
            '<line x1="' + pad + '" y1="' + (h - pad) + '" x2="' + (w - pad) + '" y2="' + (h - pad) + '" stroke="var(--border)" stroke-width="1" />' +
            '<path d="' + simpleD + '" fill="none" stroke="#3b82f6" stroke-width="3" stroke-dasharray="4,4" />' +
            '<path d="' + compPoints.join(' ') + '" fill="none" stroke="#10b981" stroke-width="3" />' +
            '<circle cx="' + (w - pad) + '" cy="' + getY(simpleTotal) + '" r="4" fill="#3b82f6" />' +
            '<circle cx="' + (w - pad) + '" cy="' + getY(compTotal) + '" r="4" fill="#10b981" />' +
            '<text x="' + pad + '" y="' + (h - 8) + '" fill="var(--text-muted)" font-family="monospace" font-size="10">Start ($' + Math.round(p).toLocaleString('en-US') + ')</text>' +
            '<text x="' + (w - pad - 60) + '" y="' + (h - 8) + '" fill="var(--text-muted)" font-family="monospace" font-size="10">End (' + timeY.toFixed(1) + ' Yrs)</text>' +
            '</svg>';

          container.innerHTML = svg;
        }

        function setSIPreset(p, r, t, unit) {
          setSISolveVar('I');
          document.getElementById('si-p').value = p;
          document.getElementById('si-r').value = r;
          document.getElementById('si-t').value = t;
          document.getElementById('si-t-unit').value = unit;
          runSICalc();
        }

        function copySISummary(btn) {
          var tot = document.getElementById('si-res-total').textContent.trim();
          var int = document.getElementById('si-res-interest').textContent.trim();
          var mo = document.getElementById('si-res-monthly').textContent.trim();
          var p = document.getElementById('si-res-p-sub').textContent.trim();

          var summary = [
            '=== Simple Interest Calculation Report ===',
            p,
            'Total Interest Accrued : ' + int,
            'Future Maturity Total  : ' + tot,
            'Monthly Amortization   : ' + mo,
            'Source: Digital Tools Shed (https://digitaltoolsshed.com/finance/simple-interest-calculator.html)'
          ].join('\n');

          navigator.clipboard.writeText(summary).then(function() {
            var old = btn.textContent;
            btn.textContent = '✅ Copied to Clipboard!';
            btn.style.borderColor = '#10b981';
            setTimeout(function() {
              btn.textContent = old;
              btn.style.borderColor = '';
            }, 2000);
          });
        }

        document.addEventListener('DOMContentLoaded', function() { runSICalc(); });
        runSICalc();
      </script>
    `
  },
  {
    slug: 'overtime-calculator',
    title: 'Overtime Pay Calculator (1.5x Time & a Half, Double Time & FLSA Rules)',
    metaDesc: 'Calculate overtime wages, 1.5x time-and-a-half rate, 2.0x double-time holiday pay, and California daily overtime thresholds under federal FLSA rules.',
    category: 'Finance & Career',
    faq: [
      { q: 'What is the federal Fair Labor Standards Act (FLSA) rule for overtime?', a: 'Under federal FLSA rules, covered non-exempt employees must receive overtime pay for all hours worked beyond 40 hours in a single workweek. Overtime must be paid at a rate not less than time-and-a-half (1.5 times) the regular hourly rate of pay.' },
      { q: 'When is double-time (2.0x) mandatory by law?', a: 'Federal US law does NOT mandate double time; it only mandates 1.5× for hours over 40. However, California law strictly mandates double-time pay (2.0×) for all hours worked beyond 12 hours in a single workday, and for all hours worked beyond 8 hours on the 7th consecutive workday of a workweek. Many union collective bargaining agreements also mandate double-time for major federal holidays and Sundays.' },
      { q: 'How does California daily overtime differ from federal overtime?', a: 'Under federal law, overtime is measured strictly on a weekly basis (after 40 total hours in a workweek). In California, daily overtime rules also apply: non-exempt employees must be paid 1.5× for all hours worked over 8 up to 12 hours in a single day, and 2.0× for all hours beyond 12 in a single day.' },
      { q: 'Can an employer offer compensatory ("comp") time instead of paying overtime?', a: 'In the private sector, federal FLSA law strictly prohibits private employers from substituting compensatory time off ("comp time") in lieu of paying cash overtime to non-exempt employees. Comp time is only legally permitted for state, local government, and municipal public-sector agencies under specific conditions.' },
      { q: 'How is overtime calculated when an employee has two different hourly rates?', a: 'Under FLSA regulations (29 C.F.R. § 778.115), when an employee performs two different jobs at different pay rates in the same workweek, their regular rate is the weighted average: Total Regular Earnings divided by Total Hours Worked. Overtime is then paid at 0.5× this blended regular rate for each overtime hour on top of the base pay.' }
    ],
    body: `
      <style>
        .ot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.25rem; }
        .ot-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; text-align: center; }
        .ot-bar { height: 26px; border-radius: 6px; overflow: hidden; display: flex; width: 100%; margin-top: 1rem; border: 1px solid var(--border); background: var(--surface-alt); }
        .ot-bar-reg { background: #3b82f6; height: 100%; display: flex; align-items: center; justify-content: center; color: #fff; font-family: var(--mono); font-size: 0.75rem; font-weight: 600; }
        .ot-bar-ot { background: #10b981; height: 100%; display: flex; align-items: center; justify-content: center; color: #fff; font-family: var(--mono); font-size: 0.75rem; font-weight: 600; }
        .ot-bar-dbl { background: #f59e0b; height: 100%; display: flex; align-items: center; justify-content: center; color: #fff; font-family: var(--mono); font-size: 0.75rem; font-weight: 600; }
      </style>

      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Overtime Calculator
        </nav>

        <header style="margin-bottom: 1.75rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Overtime & Double Time Pay Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Calculate time-and-a-half (1.5&times;) overtime, double-time (2.0&times;), California daily rules, and effective blended wage rates under federal Fair Labor Standards Act (FLSA) guidelines.
          </p>
        </header>

        <div class="tool-box">
          <div class="grid-inputs">
            <div class="field-group">
              <label class="field-label" for="ot-base-rate">Regular Hourly Wage ($ / hr)</label>
              <input type="number" id="ot-base-rate" class="code-input" value="25.00" min="1" step="0.5" oninput="runOTCalc()" style="font-size: 1.25rem; font-weight: bold;" />
            </div>

            <div class="field-group">
              <label class="field-label" for="ot-reg-hrs">Regular Hours (≤ 40 / wk)</label>
              <input type="number" id="ot-reg-hrs" class="code-input" value="40" min="0" max="40" step="1" oninput="runOTCalc()" style="font-size: 1.25rem;" />
            </div>

            <div class="field-group">
              <label class="field-label" for="ot-15-hrs">Overtime Hours (1.5&times; Rate)</label>
              <input type="number" id="ot-15-hrs" class="code-input" value="10" min="0" max="60" step="1" oninput="runOTCalc()" style="font-size: 1.25rem;" />
            </div>

            <div class="field-group">
              <label class="field-label" for="ot-20-hrs">Double Time Hours (2.0&times; Rate)</label>
              <input type="number" id="ot-20-hrs" class="code-input" value="0" min="0" max="40" step="1" oninput="runOTCalc()" style="font-size: 1.25rem;" />
            </div>
          </div>

          <!-- Quick Presets -->
          <div style="margin-top: 1rem; display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); width: 100%;">Common Overtime Shifts:</span>
            <button type="button" class="btn-sec" onclick="setOTPreset(22, 40, 5, 0)">5h OT (45h week)</button>
            <button type="button" class="btn-sec" onclick="setOTPreset(25, 40, 10, 0)">10h OT (50h week)</button>
            <button type="button" class="btn-sec" onclick="setOTPreset(28, 40, 15, 8)">15h OT + 8h Holiday Double</button>
            <button type="button" class="btn-sec" onclick="setOTPreset(35, 40, 20, 0)">60h Intensive Workweek</button>
          </div>

          <!-- Hero Metrics Cards -->
          <div class="ot-grid">
            <div class="ot-card" style="border-top: 4px solid #10b981;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Gross Paycheck</div>
              <div id="ot-res-total" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">$1,375.00</div>
              <div id="ot-res-hrs-desc" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">50.0 total hours worked</div>
            </div>

            <div class="ot-card" style="border-top: 4px solid #3b82f6;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Time-and-a-Half Pay (1.5&times;)</div>
              <div id="ot-res-15-pay" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.35rem 0;">$375.00</div>
              <div id="ot-res-15-rate" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">10h @ $37.50 / hr</div>
            </div>

            <div class="ot-card" style="border-top: 4px solid #f59e0b;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Effective Hourly Rate</div>
              <div id="ot-res-effective" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin: 0.35rem 0;">$27.50 / hr</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">+$2.50/hr blended premium</div>
            </div>
          </div>

          <!-- Visual Distribution Bar -->
          <div style="margin-top: 1.5rem;">
            <div style="display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">
              <span>Earnings Composition Breakdown</span>
              <span id="ot-legend-text">Regular $1,000 : OT $375</span>
            </div>
            <div class="ot-bar">
              <div id="ot-bar-reg" class="ot-bar-reg" style="width: 72.7%;">Regular ($1,000)</div>
              <div id="ot-bar-ot" class="ot-bar-ot" style="width: 27.3%;">OT ($375)</div>
              <div id="ot-bar-dbl" class="ot-bar-dbl" style="width: 0%; display: none;">Double</div>
            </div>
          </div>

          <!-- Step-by-Step Derivation Box -->
          <div style="margin-top: 1.5rem; background: var(--surface-alt); border-left: 3px solid #10b981; padding: 1.1rem 1.25rem; border-radius: 0 6px 6px 0; font-size: 0.9rem; line-height: 1.6;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.25rem;">Live Mathematical Derivation:</div>
            <div id="ot-steps" style="font-family: var(--mono); color: var(--fg);"></div>
          </div>

          <!-- Copy Button -->
          <div style="margin-top: 1.25rem; display: flex; justify-content: flex-end;">
            <button type="button" class="btn-sec" onclick="copyOTSummary(this)" style="font-family: var(--mono); font-size: 0.85rem; padding: 0.5rem 1rem;">
              📋 Copy Overtime Pay Breakdown
            </button>
          </div>
        </div>
      </div>

      <script>
        function runOTCalc() {
          var rate = parseFloat(document.getElementById('ot-base-rate').value) || 0;
          var regHrs = parseFloat(document.getElementById('ot-reg-hrs').value) || 0;
          var otHrs = parseFloat(document.getElementById('ot-15-hrs').value) || 0;
          var dblHrs = parseFloat(document.getElementById('ot-20-hrs').value) || 0;

          var regPay = regHrs * rate;
          var otRate = rate * 1.5;
          var otPay = otHrs * otRate;
          var dblRate = rate * 2.0;
          var dblPay = dblHrs * dblRate;

          var totalPay = regPay + otPay + dblPay;
          var totalHrs = regHrs + otHrs + dblHrs;
          var effectiveRate = totalHrs > 0 ? (totalPay / totalHrs) : rate;

          document.getElementById('ot-res-total').textContent = '$' + totalPay.toFixed(2);
          document.getElementById('ot-res-hrs-desc').textContent = totalHrs.toFixed(1) + ' total hours worked';
          document.getElementById('ot-res-15-pay').textContent = '$' + otPay.toFixed(2);
          document.getElementById('ot-res-15-rate').textContent = otHrs + 'h @ $' + otRate.toFixed(2) + ' / hr';
          document.getElementById('ot-res-effective').textContent = '$' + effectiveRate.toFixed(2) + ' / hr';

          // Update Bar
          if (totalPay > 0) {
            var pReg = (regPay / totalPay) * 100;
            var pOt = (otPay / totalPay) * 100;
            var pDbl = (dblPay / totalPay) * 100;

            document.getElementById('ot-bar-reg').style.width = pReg + '%';
            document.getElementById('ot-bar-reg').textContent = 'Regular ($' + Math.round(regPay) + ')';
            document.getElementById('ot-bar-ot').style.width = pOt + '%';
            document.getElementById('ot-bar-ot').textContent = otHrs > 0 ? 'OT ($' + Math.round(otPay) + ')' : '';
            
            var dblBar = document.getElementById('ot-bar-dbl');
            if (dblHrs > 0) {
              dblBar.style.display = 'flex';
              dblBar.style.width = pDbl + '%';
              dblBar.textContent = '2&times; ($' + Math.round(dblPay) + ')';
            } else {
              dblBar.style.display = 'none';
            }

            document.getElementById('ot-legend-text').textContent = 'Regular $' + regPay.toFixed(0) + ' : OT $' + otPay.toFixed(0) + (dblHrs > 0 ? (' : Double $' + dblPay.toFixed(0)) : '');
          }

          var steps = [
            '1. Regular Earnings: ' + regHrs + ' hrs &times; $' + rate.toFixed(2) + '/hr = $' + regPay.toFixed(2),
            '2. Time-and-a-Half Rate: $' + rate.toFixed(2) + ' &times; 1.5 = $' + otRate.toFixed(2) + '/hr',
            '3. Overtime Earnings: ' + otHrs + ' hrs &times; $' + otRate.toFixed(2) + '/hr = $' + otPay.toFixed(2),
            dblHrs > 0 ? ('4. Double Time Earnings (2.0&times; @ $' + dblRate.toFixed(2) + '/hr): ' + dblHrs + ' hrs &times; $' + dblRate.toFixed(2) + ' = $' + dblPay.toFixed(2)) : '4. Double Time: 0 hours.',
            '5. Total Gross Pay: $' + regPay.toFixed(2) + ' + $' + otPay.toFixed(2) + (dblHrs > 0 ? (' + $' + dblPay.toFixed(2)) : '') + ' = <strong>$' + totalPay.toFixed(2) + '</strong>',
            '6. Effective Blended Hourly Rate: $' + totalPay.toFixed(2) + ' &divide; ' + totalHrs + ' hrs = <strong>$' + effectiveRate.toFixed(2) + ' / hr</strong>'
          ];
          document.getElementById('ot-steps').innerHTML = steps.join('<br>');
        }

        function setOTPreset(rate, reg, ot, dbl) {
          document.getElementById('ot-base-rate').value = rate;
          document.getElementById('ot-reg-hrs').value = reg;
          document.getElementById('ot-15-hrs').value = ot;
          document.getElementById('ot-20-hrs').value = dbl;
          runOTCalc();
        }

        function copyOTSummary(btn) {
          var tot = document.getElementById('ot-res-total').textContent.trim();
          var ot = document.getElementById('ot-res-15-pay').textContent.trim();
          var eff = document.getElementById('ot-res-effective').textContent.trim();
          var hrs = document.getElementById('ot-res-hrs-desc').textContent.trim();

          var summary = [
            '=== Overtime Pay Summary ===',
            'Total Gross Paycheck : ' + tot,
            'Total Hours Worked   : ' + hrs,
            'Overtime Earnings    : ' + ot,
            'Effective Hourly Rate: ' + eff,
            'Calculated at Digital Tools Shed (https://digitaltoolsshed.com/finance/overtime-calculator.html)'
          ].join('\n');

          navigator.clipboard.writeText(summary).then(function() {
            var old = btn.textContent;
            btn.textContent = '✅ Copied to Clipboard!';
            btn.style.borderColor = '#10b981';
            setTimeout(function() {
              btn.textContent = old;
              btn.style.borderColor = '';
            }, 2000);
          });
        }

        document.addEventListener('DOMContentLoaded', function() { runOTCalc(); });
        runOTCalc();
      </script>
    `
  },
  {
    slug: 'cagr-calculator',
    title: 'CAGR Calculator (Compound Annual Growth Rate & Real Return)',
    metaDesc: 'Calculate Compound Annual Growth Rate (CAGR) for investment portfolios, stocks, and revenue. Features inflation adjustment, Rule of 72 doubling timeline, and SVG growth charts.',
    category: 'Finance & Investments',
    faq: [
      { q: 'What is Compound Annual Growth Rate (CAGR)?', a: 'Compound Annual Growth Rate (CAGR) measures the smoothed annualized rate of return of an investment or business metric over an investment period longer than one year. It describes the constant year-over-year rate at which an asset would have grown if it expanded at a steady rate with annual compounding.' },
      { q: 'What is the mathematical formula for CAGR?', a: 'The formula for CAGR is: CAGR = [(Ending Value / Beginning Value)^(1 / t)] - 1, where Ending Value is the final balance, Beginning Value is the initial capital, and t is the time horizon in years. Multiply the result by 100 to express it as an annualized percentage.' },
      { q: 'What is the difference between Total Return and CAGR?', a: 'Total Return calculates the absolute cumulative percentage gain across the entire multi-year holding period: Total Return = ((Ending - Beginning) / Beginning) × 100%. In contrast, CAGR normalizes this cumulative growth into a per-year compounding rate, enabling fair comparisons across investments with different time horizons.' },
      { q: 'How does inflation affect CAGR (Real CAGR vs Nominal CAGR)?', a: 'Nominal CAGR reflects raw dollar growth without adjusting for currency depreciation. Real CAGR accounts for inflation using the Fisher Equation: Real CAGR = [(1 + Nominal CAGR) / (1 + Inflation Rate)] - 1. For example, an 8% nominal CAGR during a period of 3% annual inflation yields a true purchasing-power growth rate of 4.85% per year.' },
      { q: 'How is the Rule of 72 doubling time calculated from CAGR?', a: 'The Rule of 72 provides a quick mental estimate of the number of years required for an asset to double in value at a constant compounding rate: Doubling Years ≈ 72 / CAGR. The exact logarithmic formula is: Exact Doubling Time = ln(2) / ln(1 + CAGR / 100). For example, at a 10% CAGR, an asset doubles in approximately 7.2 years (exact: 7.27 years).' }
    ],
    body: `
      <style>
        .cagr-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.25rem; }
        .cagr-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; text-align: center; }
        .cagr-table { width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; margin-top: 1rem; }
        .cagr-table th, .cagr-table td { padding: 0.5rem 0.75rem; border: 1px solid var(--border); text-align: left; }
        .cagr-table th { background: var(--surface-alt); font-weight: 600; }
      </style>

      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; CAGR Calculator
        </nav>

        <header style="margin-bottom: 1.75rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">CAGR (Compound Annual Growth Rate) Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Determine the smoothed annualized rate of return for stock portfolios, real estate properties, and company revenue with inflation-adjusted real yields and SVG growth curves.
          </p>
        </header>

        <div class="tool-box">
          <div class="grid-inputs">
            <div class="field-group">
              <label class="field-label" for="cagr-start">Beginning / Initial Value ($ USD)</label>
              <input type="number" id="cagr-start" class="code-input" value="10000" min="1" step="500" oninput="runCAGRCalc()" style="font-size: 1.25rem;" />
            </div>

            <div class="field-group">
              <label class="field-label" for="cagr-end">Ending / Final Value ($ USD)</label>
              <input type="number" id="cagr-end" class="code-input" value="25000" min="1" step="500" oninput="runCAGRCalc()" style="font-size: 1.25rem;" />
            </div>

            <div class="field-group">
              <label class="field-label" for="cagr-years">Time Period (Years)</label>
              <input type="number" id="cagr-years" class="code-input" value="5" min="0.1" max="100" step="0.5" oninput="runCAGRCalc()" style="font-size: 1.25rem;" />
            </div>

            <div class="field-group">
              <label class="field-label" for="cagr-inflation">Annual Inflation Rate (%) [Optional]</label>
              <input type="number" id="cagr-inflation" class="code-input" value="2.5" min="0" max="25" step="0.1" oninput="runCAGRCalc()" style="font-size: 1.25rem;" />
            </div>
          </div>

          <!-- Quick Presets -->
          <div style="margin-top: 0.75rem; display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); width: 100%;">Popular Investment Scenarios:</span>
            <button type="button" class="btn-sec" onclick="setCAGRPreset(10000, 25000, 5)">$10k &rarr; $25k in 5 Yrs</button>
            <button type="button" class="btn-sec" onclick="setCAGRPreset(50000, 100000, 7.2)">Doubling in 7.2 Yrs (10% CAGR)</button>
            <button type="button" class="btn-sec" onclick="setCAGRPreset(100000, 350000, 10)">$100k &rarr; $350k in 10 Yrs</button>
            <button type="button" class="btn-sec" onclick="setCAGRPreset(10000, 20000, 10)">S&amp;P 500 Historical (7% Real)</button>
          </div>

          <!-- Hero Metrics Cards -->
          <div class="cagr-grid">
            <div class="cagr-card" style="border-top: 4px solid #10b981;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Compound Annual Growth (CAGR)</div>
              <div id="cagr-res-cagr" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">+20.11%</div>
              <div id="cagr-res-real" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Real CAGR: +17.18% (Post-Inflation)</div>
            </div>

            <div class="cagr-card" style="border-top: 4px solid #3b82f6;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Cumulative Return</div>
              <div id="cagr-res-total" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.35rem 0;">+150.00%</div>
              <div id="cagr-res-gain-sub" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">+$15,000 capital gain (2.50&times;)</div>
            </div>

            <div class="cagr-card" style="border-top: 4px solid #f59e0b;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Rule of 72 Doubling Time</div>
              <div id="cagr-res-double" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin: 0.35rem 0;">3.6 Years</div>
              <div id="cagr-res-double-sub" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Exact: 3.78 years to double capital</div>
            </div>
          </div>

          <!-- Interactive Projected SVG Growth Curve -->
          <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap;">
              <span style="font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">Exponential Compound Trajectory</span>
              <span style="font-family: var(--mono); font-size: 0.75rem; color: #10b981;">Smoothed Geometric Growth Curve</span>
            </div>
            <div id="cagr-svg-container" style="width: 100%; height: 160px;"></div>
          </div>

          <!-- Step-by-Step Derivation Box -->
          <div style="margin-top: 1.5rem; background: var(--surface-alt); border-left: 3px solid #10b981; padding: 1.1rem 1.25rem; border-radius: 0 6px 6px 0; font-size: 0.9rem; line-height: 1.6;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.25rem;">Live Mathematical Derivation:</div>
            <div id="cagr-steps" style="font-family: var(--mono); color: var(--fg);"></div>
          </div>

          <!-- Copy Button -->
          <div style="margin-top: 1.25rem; display: flex; justify-content: flex-end;">
            <button type="button" class="btn-sec" onclick="copyCAGRSummary(this)" style="font-family: var(--mono); font-size: 0.85rem; padding: 0.5rem 1rem;">
              📋 Copy CAGR Investment Report
            </button>
          </div>
        </div>
      </div>

      <script>
        function runCAGRCalc() {
          var bv = parseFloat(document.getElementById('cagr-start').value) || 1;
          var ev = parseFloat(document.getElementById('cagr-end').value) || 1;
          var t = parseFloat(document.getElementById('cagr-years').value) || 1;
          var infRate = (parseFloat(document.getElementById('cagr-inflation').value) || 0) / 100;

          var cagrDec = Math.pow(ev / bv, 1 / t) - 1;
          var cagrPct = cagrDec * 100;

          var totalReturnPct = ((ev - bv) / bv) * 100;
          var multiplier = ev / bv;
          var netGain = ev - bv;

          // Real CAGR post-inflation
          var realCAGRDec = (1 + cagrDec) / (1 + infRate) - 1;
          var realCAGRPct = realCAGRDec * 100;

          // Doubling time
          var rule72 = cagrPct > 0 ? (72 / cagrPct) : 0;
          var exactDouble = cagrDec > 0 ? (Math.log(2) / Math.log(1 + cagrDec)) : 0;

          document.getElementById('cagr-res-cagr').textContent = (cagrPct >= 0 ? '+' : '') + cagrPct.toFixed(2) + '%';
          document.getElementById('cagr-res-cagr').style.color = cagrPct >= 0 ? '#10b981' : '#ef4444';
          document.getElementById('cagr-res-real').textContent = 'Real CAGR: ' + (realCAGRPct >= 0 ? '+' : '') + realCAGRPct.toFixed(2) + '% (Post-Inflation)';

          document.getElementById('cagr-res-total').textContent = (totalReturnPct >= 0 ? '+' : '') + totalReturnPct.toFixed(2) + '%';
          document.getElementById('cagr-res-gain-sub').textContent = (netGain >= 0 ? '+$' : '-$') + Math.abs(Math.round(netGain)).toLocaleString('en-US') + ' gain (' + multiplier.toFixed(2) + '×)';

          document.getElementById('cagr-res-double').textContent = rule72 > 0 ? rule72.toFixed(1) + ' Years' : 'N/A';
          document.getElementById('cagr-res-double-sub').textContent = exactDouble > 0 ? ('Exact: ' + exactDouble.toFixed(2) + ' years to double capital') : 'Negative or zero growth';

          renderCAGRSVG(bv, ev, cagrDec, t);

          var steps = [
            '1. Calculate Growth Multiple: Ending Value &divide; Beginning Value = $' + ev.toLocaleString('en-US') + ' &divide; $' + bv.toLocaleString('en-US') + ' = ' + multiplier.toFixed(4) + '&times;',
            '2. Exponent Factor (1 / t): 1 &divide; ' + t + ' years = ' + (1 / t).toFixed(4),
            '3. Compound Annual Rate: (' + multiplier.toFixed(4) + ')^' + (1 / t).toFixed(4) + ' - 1 = ' + (1 + cagrDec).toFixed(5) + ' - 1 = <strong>' + (cagrPct >= 0 ? '+' : '') + cagrPct.toFixed(2) + '% / year</strong>',
            '4. Total Cumulative Expansion: (($' + ev.toLocaleString('en-US') + ' - $' + bv.toLocaleString('en-US') + ') &divide; $' + bv.toLocaleString('en-US') + ') &times; 100% = <strong>+' + totalReturnPct.toFixed(2) + '%</strong>',
            infRate > 0 ? ('5. Fisher Real CAGR Adjustment (at ' + (infRate * 100).toFixed(1) + '% inflation): ((1 + ' + cagrDec.toFixed(4) + ') &divide; (1 + ' + infRate.toFixed(4) + ')) - 1 = <strong>' + (realCAGRPct >= 0 ? '+' : '') + realCAGRPct.toFixed(2) + '% Real Return</strong>') : '5. Inflation: None applied.',
            exactDouble > 0 ? ('6. Capital Doubling Time: ln(2) &divide; ln(1 + ' + cagrDec.toFixed(4) + ') = <strong>' + exactDouble.toFixed(2) + ' Years</strong> (Rule of 72 estimate: ' + rule72.toFixed(1) + ' yrs)') : ''
          ].filter(Boolean);
          document.getElementById('cagr-steps').innerHTML = steps.join('<br>');
        }

        function renderCAGRSVG(bv, ev, cagrDec, t) {
          var container = document.getElementById('cagr-svg-container');
          var w = container.clientWidth || 500;
          var h = 160;
          var pad = 24;

          var maxVal = Math.max(bv, ev) * 1.05;
          var minVal = Math.min(bv, ev) * 0.95;

          function getY(val) {
            return h - pad - ((val - minVal) / (maxVal - minVal)) * (h - pad * 2);
          }

          var points = [];
          var steps = 20;
          for (var i = 0; i <= steps; i++) {
            var frac = i / steps;
            var curT = t * frac;
            var curVal = bv * Math.pow(1 + cagrDec, curT);
            var x = pad + frac * (w - pad * 2);
            var y = getY(curVal);
            points.push((i === 0 ? 'M ' : 'L ') + x.toFixed(1) + ' ' + y.toFixed(1));
          }

          var svg = '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
            '<line x1="' + pad + '" y1="' + (h - pad) + '" x2="' + (w - pad) + '" y2="' + (h - pad) + '" stroke="var(--border)" stroke-width="1" />' +
            '<path d="' + points.join(' ') + '" fill="none" stroke="#10b981" stroke-width="3" />' +
            '<circle cx="' + pad + '" cy="' + getY(bv) + '" r="4" fill="#3b82f6" />' +
            '<circle cx="' + (w - pad) + '" cy="' + getY(ev) + '" r="4" fill="#10b981" />' +
            '<text x="' + pad + '" y="' + (h - 8) + '" fill="var(--text-muted)" font-family="monospace" font-size="10">Start ($' + Math.round(bv).toLocaleString('en-US') + ')</text>' +
            '<text x="' + (w - pad - 70) + '" y="' + (h - 8) + '" fill="var(--text-muted)" font-family="monospace" font-size="10">End ($' + Math.round(ev).toLocaleString('en-US') + ')</text>' +
            '</svg>';

          container.innerHTML = svg;
        }

        function setCAGRPreset(bv, ev, t) {
          document.getElementById('cagr-start').value = bv;
          document.getElementById('cagr-end').value = ev;
          document.getElementById('cagr-years').value = t;
          runCAGRCalc();
        }

        function copyCAGRSummary(btn) {
          var cagr = document.getElementById('cagr-res-cagr').textContent.trim();
          var real = document.getElementById('cagr-res-real').textContent.trim();
          var tot = document.getElementById('cagr-res-total').textContent.trim();
          var dbl = document.getElementById('cagr-res-double').textContent.trim();

          var summary = [
            '=== Compound Annual Growth Rate (CAGR) ===',
            'Annualized CAGR  : ' + cagr,
            real,
            'Total Return     : ' + tot,
            'Doubling Time    : ' + dbl,
            'Calculated at Digital Tools Shed (https://digitaltoolsshed.com/finance/cagr-calculator.html)'
          ].join('\n');

          navigator.clipboard.writeText(summary).then(function() {
            var old = btn.textContent;
            btn.textContent = '✅ Copied to Clipboard!';
            btn.style.borderColor = '#10b981';
            setTimeout(function() {
              btn.textContent = old;
              btn.style.borderColor = '';
            }, 2000);
          });
        }

        document.addEventListener('DOMContentLoaded', function() { runCAGRCalc(); });
        runCAGRCalc();
      </script>
    `
  },
  {
    slug: "net-worth-calculator",
    title: "Net Worth Calculator (Liquid vs Illiquid Wealth & Age Benchmarks)",
    metaDesc: "Calculate personal net worth, liquid wealth, and debt-to-asset solvency ratio. Benchmark your finances against US Federal Reserve Survey of Consumer Finances percentiles by age.",
    category: "Finance",
    faq: [
      {
            "q": "What is the difference between total net worth and liquid net worth?",
            "a": "Total net worth includes all assets (real estate equity, vehicles, personal property, and locked retirement accounts) minus all liabilities. Liquid net worth counts only cash, checking/savings, taxable brokerage holdings, and liquid investments that can be converted to cash within 3 to 5 business days without statutory early-withdrawal penalties or forced real estate liquidation."
      },
      {
            "q": "What is the median and average net worth by age in the United States?",
            "a": "According to the Federal Reserve Survey of Consumer Finances (SCF): Under 35 median is $39,000 (average $183,500); ages 35–44 median is $135,600 (average $549,600); ages 45–54 median is $247,200 (average $975,800); ages 55–64 median is $364,500 (average $1,566,900); and ages 65–74 median is $409,900 (average $1,794,600)."
      },
      {
            "q": "Should I include my primary home and personal vehicle in my net worth?",
            "a": "Yes, but strictly at realistic fair market resale value—never purchase price or replacement cost. For your primary home, subtract expected selling costs (~6% to 8% for real estate commissions and transfer taxes). For vehicles, use Black Book or Kelley Blue Book private party value rather than original MSRP to prevent artificial wealth inflation."
      },
      {
            "q": "What is a healthy debt-to-asset ratio?",
            "a": "A debt-to-asset ratio under 25% is considered exceptionally strong and low-risk. Ratios between 25% and 50% are healthy for young households financing primary real estate. Ratios exceeding 60% indicate elevated leverage, while ratios above 100% mean negative net worth (liabilities exceed total assets)."
      },
      {
            "q": "Why is median net worth so much lower than average (mean) net worth?",
            "a": "Wealth distribution in the United States is heavily right-skewed. The top 10% and top 1% of households hold disproportionately large concentrations of equities, businesses, and commercial real estate, which pulls the mathematical average (mean) upwards by several hundred percent. Median represents the true 50th percentile midpoint of the American population."
      }
],
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Net Worth Calculator
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Personal Net Worth & Financial Solvency Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Calculate your total net worth, liquid net worth, and debt-to-asset leverage ratio. Benchmark your financial position directly against US Federal Reserve Survey of Consumer Finances (SCF) percentiles for your age group.
          </p>
        </header>

        <!-- Demographic Benchmarking Selector -->
        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 8px; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <strong style="font-size: 0.95rem; color: var(--fg); display: block;">Select Your Age Bracket for Federal Reserve Benchmarking:</strong>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Compares your holdings to US Federal Reserve Survey of Consumer Finances (SCF) medians.</span>
          </div>
          <select id="nwAgeBracket" style="padding: 0.5rem 0.75rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.9rem;" onchange="calcNW()">
            <option value="under35">Under 35 (Median: $39k | Top 10%: $450k)</option>
            <option value="35to44" selected>Age 35–44 (Median: $135k | Top 10%: $1.25M)</option>
            <option value="45to54">Age 45–54 (Median: $247k | Top 10%: $2.40M)</option>
            <option value="55to64">Age 55–64 (Median: $364k | Top 10%: $3.80M)</option>
            <option value="65to74">Age 65–74 (Median: $410k | Top 10%: $4.20M)</option>
            <option value="75plus">Age 75+ (Median: $336k | Top 10%: $3.90M)</option>
          </select>
        </div>

        <!-- Inputs: Two Columns (Assets vs Liabilities) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <!-- Assets Column -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-top: 4px solid #10b981; padding: 1.5rem; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: #10b981;">Assets (What You Own)</h3>
              <span id="subtotalAssets" style="font-family: var(--mono); font-weight: bold; color: #10b981; font-size: 1.1rem;">$555,000</span>
            </div>

            <!-- Liquid Financial Assets -->
            <div style="margin-bottom: 1.25rem;">
              <span style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.25rem;">1. Liquid & Cash Assets</span>
              <div style="display: grid; gap: 0.65rem;">
                <div>
                  <label style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Checking, Savings & CDs ($):</label>
                  <input type="number" id="nwCash" value="25000" min="0" step="1000" class="nw-asset nw-liquid" style="width: 100%; padding: 0.45rem 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono);" oninput="calcNW()" />
                </div>
                <div>
                  <label style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Taxable Brokerage (Stocks, ETFs, Funds) ($):</label>
                  <input type="number" id="nwStocks" value="45000" min="0" step="2000" class="nw-asset nw-liquid" style="width: 100%; padding: 0.45rem 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono);" oninput="calcNW()" />
                </div>
                <div>
                  <label style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Cryptocurrency & Gold ($):</label>
                  <input type="number" id="nwCrypto" value="5000" min="0" step="500" class="nw-asset nw-liquid" style="width: 100%; padding: 0.45rem 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono);" oninput="calcNW()" />
                </div>
              </div>
            </div>

            <!-- Retirement Assets -->
            <div style="margin-bottom: 1.25rem;">
              <span style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.25rem;">2. Retirement Accounts</span>
              <div style="display: grid; gap: 0.65rem;">
                <div>
                  <label style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Pre-Tax 401(k), 403(b), Traditional IRA ($):</label>
                  <input type="number" id="nwPreRet" value="85000" min="0" step="2500" class="nw-asset" style="width: 100%; padding: 0.45rem 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono);" oninput="calcNW()" />
                </div>
                <div>
                  <label style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Roth IRA, Roth 401(k) & HSA ($):</label>
                  <input type="number" id="nwRoth" value="35000" min="0" step="1000" class="nw-asset" style="width: 100%; padding: 0.45rem 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono);" oninput="calcNW()" />
                </div>
              </div>
            </div>

            <!-- Physical / Illiquid Assets -->
            <div>
              <span style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.25rem;">3. Real Estate & Physical Property</span>
              <div style="display: grid; gap: 0.65rem;">
                <div>
                  <label style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Primary Residence Market Value ($):</label>
                  <input type="number" id="nwHome" value="325000" min="0" step="5000" class="nw-asset" style="width: 100%; padding: 0.45rem 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono);" oninput="calcNW()" />
                </div>
                <div>
                  <label style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Vehicles (KBB Resale Value) ($):</label>
                  <input type="number" id="nwVeh" value="25000" min="0" step="1000" class="nw-asset" style="width: 100%; padding: 0.45rem 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono);" oninput="calcNW()" />
                </div>
                <div>
                  <label style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Business Equity & Personal Property ($):</label>
                  <input type="number" id="nwOtherProp" value="10000" min="0" step="1000" class="nw-asset" style="width: 100%; padding: 0.45rem 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono);" oninput="calcNW()" />
                </div>
              </div>
            </div>
          </div>

          <!-- Liabilities Column -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.5rem; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: #ef4444;">Liabilities (What You Owe)</h3>
              <span id="subtotalLiabilities" style="font-family: var(--mono); font-weight: bold; color: #ef4444; font-size: 1.1rem;">$270,000</span>
            </div>

            <!-- Secured Real Estate Debt -->
            <div style="margin-bottom: 1.25rem;">
              <span style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.25rem;">1. Mortgages & Secured Loans</span>
              <div style="display: grid; gap: 0.65rem;">
                <div>
                  <label style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Primary Mortgage Principal Balance ($):</label>
                  <input type="number" id="nwMort" value="230000" min="0" step="5000" class="nw-debt" style="width: 100%; padding: 0.45rem 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono);" oninput="calcNW()" />
                </div>
                <div>
                  <label style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Auto Loans Balance ($):</label>
                  <input type="number" id="nwAuto" value="14000" min="0" step="500" class="nw-debt" style="width: 100%; padding: 0.45rem 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono);" oninput="calcNW()" />
                </div>
              </div>
            </div>

            <!-- Unsecured & Consumer Debt -->
            <div>
              <span style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.25rem;">2. Consumer & Student Debt</span>
              <div style="display: grid; gap: 0.65rem;">
                <div>
                  <label style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Student Loan Debt ($):</label>
                  <input type="number" id="nwStudent" value="21000" min="0" step="1000" class="nw-debt" style="width: 100%; padding: 0.45rem 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono);" oninput="calcNW()" />
                </div>
                <div>
                  <label style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Credit Card Balances ($):</label>
                  <input type="number" id="nwCards" value="3500" min="0" step="250" class="nw-debt nw-unsecured" style="width: 100%; padding: 0.45rem 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono);" oninput="calcNW()" />
                </div>
                <div>
                  <label style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Personal Loans & Medical Debt ($):</label>
                  <input type="number" id="nwPersonal" value="1500" min="0" step="250" class="nw-debt nw-unsecured" style="width: 100%; padding: 0.45rem 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono);" oninput="calcNW()" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hero Results Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Net Worth</div>
            <div id="nwTotal" style="font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">$285,000</div>
            <div id="nwSolvencyStatus" style="font-size: 0.85rem; color: #10b981; font-weight: bold;">Positive Financial Standing</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Liquid Net Worth</div>
            <div id="nwLiquidTotal" style="font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #3b82f6; margin: 0.35rem 0;">$70,000</div>
            <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Immediate Cash / Capital Buffer</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Debt-to-Asset Leverage</div>
            <div id="nwDebtRatio" style="font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: var(--fg); margin: 0.35rem 0;">48.6%</div>
            <div id="nwRatioStatus" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Healthy Mortgage Leverage</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Fed SCF Age Benchmark</div>
            <div id="nwFedBenchmark" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">+110%</div>
            <div id="nwFedDetails" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Above Age 35–44 Median ($135k)</div>
          </div>
        </div>

        <!-- Copy Button -->
        <button type="button" id="btnCopyNW" onclick="copyNWSummary()" class="btn-sec" style="width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s; margin-bottom: 2rem;">
          📋 Copy Full Net Worth & Solvency Report
        </button>

        <!-- Visual Asset Allocation & Debt Stack Bar -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">📊 Asset Distribution & Debt Load</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
            Proportional composition of your asset portfolio vs. liability claims against total wealth:
          </p>

          <!-- Segmented Asset Bar -->
          <div style="height: 28px; width: 100%; display: flex; border-radius: 4px; overflow: hidden; margin-bottom: 0.6rem; border: 1px solid var(--border);">
            <div id="barLiquid" style="width: 13%; background: #3b82f6; transition: width 0.3s;" title="Cash & Liquid Brokerage"></div>
            <div id="barRet" style="width: 22%; background: #10b981; transition: width 0.3s;" title="Retirement Accounts"></div>
            <div id="barHome" style="width: 58%; background: #06b6d4; transition: width 0.3s;" title="Primary Real Estate"></div>
            <div id="barOther" style="width: 7%; background: #f59e0b; transition: width 0.3s;" title="Vehicles & Property"></div>
          </div>

          <!-- Legend -->
          <div style="display: flex; gap: 1rem; font-family: var(--mono); font-size: 0.75rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 10px; height: 10px; background: #3b82f6; border-radius: 2px;"></span> <span id="legLiquid">Liquid (13.5%)</span></span>
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 10px; height: 10px; background: #10b981; border-radius: 2px;"></span> <span id="legRet">Retirement (21.6%)</span></span>
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 10px; height: 10px; background: #06b6d4; border-radius: 2px;"></span> <span id="legHome">Real Estate (58.6%)</span></span>
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 10px; height: 10px; background: #f59e0b; border-radius: 2px;"></span> <span id="legOther">Vehicles/Other (6.3%)</span></span>
          </div>

          <!-- Debt Burden Sub-Bar -->
          <span style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Total Liabilities (% of Gross Assets)</span>
          <div style="height: 14px; width: 100%; background: var(--surface-alt); border-radius: 3px; overflow: hidden; border: 1px solid var(--border);">
            <div id="barDebt" style="height: 100%; width: 48.6%; background: #ef4444; transition: width 0.3s;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
            <span id="txtDebtPct">Debt Burden: 48.6%</span>
            <span id="txtEquityPct">Net Equity Retained: 51.4%</span>
          </div>
        </div>

        <!-- Step-by-Step Worked Algebraic Derivation -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Net Worth Derivation</h3>
            <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">GAAP Personal Balance Sheet</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            Personal financial standing is derived by aggregating asset claims against debt obligations across liquidity tiers:
          </p>
          <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 1: Gross Asset Summation</strong>
              <div id="nwStep1" style="color: #10b981; margin-top: 0.25rem;">Total Assets = $75,000 (Liquid) + $120,000 (Retirement) + $360,000 (Property) = $555,000.00</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 2: Total Liability Aggregation</strong>
              <div id="nwStep2" style="color: #ef4444; margin-top: 0.25rem;">Total Liabilities = $244,000 (Secured Mortgages/Auto) + $26,000 (Student/Cards) = $270,000.00</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 3: Total Net Worth Calculation</strong>
              <div id="nwStep3" style="color: var(--fg); margin-top: 0.25rem;">Net Worth = $555,000.00 (Assets) - $270,000.00 (Liabilities) = $285,000.00</div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: #3b82f6; font-weight: 700;">Step 4: Liquid Solvency & Leverage Ratio</strong>
              <div id="nwStep4" style="color: #3b82f6; margin-top: 0.25rem;">Liquid Net Worth = $75,000 - $5,000 (Unsecured) = $70,000.00. Leverage Ratio = ($270,000 ÷ $555,000) × 100 = 48.65%.</div>
            </div>
          </div>
        </div>

        <!-- 5 Critical Net Worth Traps -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Critical Net Worth Traps & Distortions</h3>
          <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; display: grid; gap: 0.6rem;">
            <li><strong>The "House-Rich, Cash-Poor" Trap:</strong> Primary residence equity represents paper wealth that cannot pay for healthcare, groceries, or emergencies without taking on a second mortgage (HELOC) or selling the home. A high net worth dominated 80%+ by real estate often creates acute cash flow vulnerability.</li>
            <li><strong>The Pre-Tax Retirement Haircut:</strong> A $500,000 Traditional 401(k) or IRA is not $500,000 in your pocket. The IRS holds an embedded tax lien of 15% to 32% (plus state income tax). Net spendable wealth in pre-tax accounts is only $350,000 to $400,000 after mandatory tax withholding.</li>
            <li><strong>Depreciating Asset Inflation (Vehicles & Goods):</strong> Listing cars, boats, and electronics at purchase price artificially inflates net worth. Vehicles lose 15% to 25% in Year 1 alone. Always record personal property at conservative wholesale liquidation values.</li>
            <li><strong>High-Interest Credit Card Compounding Drag:</strong> A $10,000 credit card balance at 24% APR costs $2,400 per year in interest drain, wiping out the entire investment return of a $25,000 index fund portfolio. Consumer debt represents an asymmetric negative compound interest drag.</li>
            <li><strong>Ignoring Friction & Real Estate Liquidation Costs:</strong> Converting $400,000 of real estate equity to cash costs approximately 6% to 8% in Realtor commissions, transfer fees, and staging, deducting $24,000 to $32,000 off your paper net worth upon actual realization.</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 2rem 0;">
          <button onclick="window.print()" style="background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print Net Worth Statement
          </button>
        </div>
      </div>

      <script>
        var fedScfData = {
          under35: { label: 'Under 35', median: 39000, mean: 183500, top10: 450000 },
          '35to44': { label: 'Age 35–44', median: 135600, mean: 549600, top10: 1250000 },
          '45to54': { label: 'Age 45–54', median: 247200, mean: 975800, top10: 2400000 },
          '55to64': { label: 'Age 55–64', median: 364500, mean: 1566900, top10: 3800000 },
          '65to74': { label: 'Age 65–74', median: 409900, mean: 1794600, top10: 4200000 },
          '75plus': { label: 'Age 75+', median: 335600, mean: 1624100, top10: 3900000 }
        };

        function fmtUSD(n) {
          var sign = n < 0 ? '-$' : '$';
          return sign + Math.abs(Math.round(n)).toLocaleString('en-US');
        }

        function calcNW() {
          var cash = parseFloat(document.getElementById('nwCash').value) || 0;
          var stocks = parseFloat(document.getElementById('nwStocks').value) || 0;
          var crypto = parseFloat(document.getElementById('nwCrypto').value) || 0;
          var preRet = parseFloat(document.getElementById('nwPreRet').value) || 0;
          var roth = parseFloat(document.getElementById('nwRoth').value) || 0;
          var home = parseFloat(document.getElementById('nwHome').value) || 0;
          var veh = parseFloat(document.getElementById('nwVeh').value) || 0;
          var otherProp = parseFloat(document.getElementById('nwOtherProp').value) || 0;

          var mort = parseFloat(document.getElementById('nwMort').value) || 0;
          var auto = parseFloat(document.getElementById('nwAuto').value) || 0;
          var student = parseFloat(document.getElementById('nwStudent').value) || 0;
          var cards = parseFloat(document.getElementById('nwCards').value) || 0;
          var personal = parseFloat(document.getElementById('nwPersonal').value) || 0;

          var liquidAssets = cash + stocks + crypto;
          var retAssets = preRet + roth;
          var propAssets = home + veh + otherProp;
          var totalAssets = liquidAssets + retAssets + propAssets;

          var unsecuredDebt = cards + personal;
          var securedDebt = mort + auto + student;
          var totalDebts = unsecuredDebt + securedDebt;

          var netWorth = totalAssets - totalDebts;
          var liquidNW = liquidAssets - unsecuredDebt;
          var debtRatio = totalAssets > 0 ? ((totalDebts / totalAssets) * 100) : 0;

          // Update subtotals
          document.getElementById('subtotalAssets').textContent = fmtUSD(totalAssets);
          document.getElementById('subtotalLiabilities').textContent = fmtUSD(totalDebts);

          // Hero Total Net Worth
          var nwTotalEl = document.getElementById('nwTotal');
          nwTotalEl.textContent = fmtUSD(netWorth);
          nwTotalEl.style.color = netWorth >= 0 ? '#10b981' : '#ef4444';

          var solStatusEl = document.getElementById('nwSolvencyStatus');
          if (netWorth >= 1000000) {
            solStatusEl.textContent = '🏆 High Net Worth Status ($1M+)';
            solStatusEl.style.color = '#10b981';
          } else if (netWorth > 0) {
            solStatusEl.textContent = '✓ Positive Balance Sheet Equity';
            solStatusEl.style.color = '#10b981';
          } else {
            solStatusEl.textContent = '⚠️ Negative Net Worth (Underwater)';
            solStatusEl.style.color = '#ef4444';
          }

          // Liquid Net Worth
          var liqEl = document.getElementById('nwLiquidTotal');
          liqEl.textContent = fmtUSD(liquidNW);
          liqEl.style.color = liquidNW >= 0 ? '#3b82f6' : '#ef4444';

          // Debt Ratio
          document.getElementById('nwDebtRatio').textContent = debtRatio.toFixed(1) + '%';
          var ratioStatusEl = document.getElementById('nwRatioStatus');
          if (debtRatio <= 25) {
            ratioStatusEl.textContent = 'Pristine Low Leverage (<25%)';
            ratioStatusEl.style.color = '#10b981';
          } else if (debtRatio <= 50) {
            ratioStatusEl.textContent = 'Healthy Prudent Leverage (25–50%)';
            ratioStatusEl.style.color = '#3b82f6';
          } else if (debtRatio <= 75) {
            ratioStatusEl.textContent = 'Elevated Debt Burden (50–75%)';
            ratioStatusEl.style.color = '#f59e0b';
          } else {
            ratioStatusEl.textContent = 'High Financial Risk (>75%)';
            ratioStatusEl.style.color = '#ef4444';
          }

          // Federal Reserve Benchmark
          var ageKey = document.getElementById('nwAgeBracket').value;
          var bench = fedScfData[ageKey] || fedScfData['35to44'];
          var diffMedian = netWorth - bench.median;
          var pctMedian = bench.median > 0 ? ((diffMedian / bench.median) * 100) : 0;

          var benchEl = document.getElementById('nwFedBenchmark');
          var benchDetailsEl = document.getElementById('nwFedDetails');
          if (pctMedian >= 0) {
            benchEl.textContent = '+' + Math.round(pctMedian) + '%';
            benchEl.style.color = '#10b981';
            benchDetailsEl.textContent = 'Above ' + bench.label + ' Median (' + fmtUSD(bench.median) + ')';
          } else {
            benchEl.textContent = Math.round(pctMedian) + '%';
            benchEl.style.color = '#ef4444';
            benchDetailsEl.textContent = 'Below ' + bench.label + ' Median (' + fmtUSD(bench.median) + ')';
          }

          // Visual Bars
          var pLiq = totalAssets > 0 ? (liquidAssets / totalAssets) * 100 : 25;
          var pRet = totalAssets > 0 ? (retAssets / totalAssets) * 100 : 25;
          var pHome = totalAssets > 0 ? (home / totalAssets) * 100 : 25;
          var pOther = totalAssets > 0 ? ((veh + otherProp) / totalAssets) * 100 : 25;

          document.getElementById('barLiquid').style.width = pLiq.toFixed(1) + '%';
          document.getElementById('barRet').style.width = pRet.toFixed(1) + '%';
          document.getElementById('barHome').style.width = pHome.toFixed(1) + '%';
          document.getElementById('barOther').style.width = pOther.toFixed(1) + '%';

          document.getElementById('legLiquid').textContent = 'Liquid (' + pLiq.toFixed(1) + '%)';
          document.getElementById('legRet').textContent = 'Retirement (' + pRet.toFixed(1) + '%)';
          document.getElementById('legHome').textContent = 'Real Estate (' + pHome.toFixed(1) + '%)';
          document.getElementById('legOther').textContent = 'Property (' + pOther.toFixed(1) + '%)';

          var barDebtPct = Math.min(100, debtRatio);
          document.getElementById('barDebt').style.width = barDebtPct.toFixed(1) + '%';
          document.getElementById('txtDebtPct').textContent = 'Debt Burden: ' + debtRatio.toFixed(1) + '%';
          document.getElementById('txtEquityPct').textContent = 'Net Equity Retained: ' + (100 - debtRatio).toFixed(1) + '%';

          // Step Derivations
          document.getElementById('nwStep1').textContent = 'Total Assets = ' + fmtUSD(liquidAssets) + ' (Liquid) + ' + fmtUSD(retAssets) + ' (Retirement) + ' + fmtUSD(propAssets) + ' (Physical) = ' + fmtUSD(totalAssets);
          document.getElementById('nwStep2').textContent = 'Total Liabilities = ' + fmtUSD(mort + auto) + ' (Mortgage/Auto) + ' + fmtUSD(student + cards + personal) + ' (Student/Unsecured) = ' + fmtUSD(totalDebts);
          document.getElementById('nwStep3').textContent = 'Net Worth = ' + fmtUSD(totalAssets) + ' (Assets) - ' + fmtUSD(totalDebts) + ' (Liabilities) = ' + fmtUSD(netWorth);
          document.getElementById('nwStep4').textContent = 'Liquid Net Worth = ' + fmtUSD(liquidNW) + '. Leverage Ratio = (' + fmtUSD(totalDebts) + ' ÷ ' + fmtUSD(totalAssets) + ') × 100 = ' + debtRatio.toFixed(2) + '%.';
        }

        function copyNWSummary() {
          var nw = document.getElementById('nwTotal').textContent;
          var liq = document.getElementById('nwLiquidTotal').textContent;
          var ratio = document.getElementById('nwDebtRatio').textContent;
          var bench = document.getElementById('nwFedDetails').textContent;
          var assets = document.getElementById('subtotalAssets').textContent;
          var debts = document.getElementById('subtotalLiabilities').textContent;

          var text = '📊 PERSONAL BALANCE SHEET & NET WORTH REPORT\n' +
            '----------------------------------------\n' +
            '• Total Gross Assets: ' + assets + '\n' +
            '• Total Outstanding Liabilities: ' + debts + '\n' +
            '----------------------------------------\n' +
            'NET WORTH & LIQUIDITY METRICS:\n' +
            '• Total Personal Net Worth: ' + nw + '\n' +
            '• Liquid Net Worth (Immediate Capital): ' + liq + '\n' +
            '• Debt-to-Asset Leverage Ratio: ' + ratio + '\n' +
            '• Federal Reserve Benchmark: ' + bench + '\n' +
            '----------------------------------------\n' +
            'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/finance/net-worth-calculator';

          navigator.clipboard.writeText(text).then(function() {
            var btn = document.getElementById('btnCopyNW');
            var old = btn.innerHTML;
            btn.innerHTML = '✓ Copied Net Worth Statement!';
            btn.style.background = '#10b981';
            btn.style.color = '#fff';
            setTimeout(function() {
              btn.innerHTML = old;
              btn.style.background = 'var(--surface-alt)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          });
        }

        document.addEventListener('DOMContentLoaded', calcNW);
      </script>
  `
  },
  {
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator (With Monthly Contributions)',
    metaDesc: 'Calculate compound interest growth with monthly deposits, annual returns, and compounding frequencies. Visualize total principal vs interest earned.',
    category: 'Finance',
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Compound Interest
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Compound Interest Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Calculate how your savings and investments grow over time with recurring monthly contributions and compound interest.
          </p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Initial Investment ($ USD)</label>
              <input type="number" id="ciPrinc" value="5000" min="0" step="500" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="calcCI()" />
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Monthly Contribution ($ / month)</label>
              <input type="number" id="ciMonthly" value="300" min="0" step="50" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="calcCI()" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Estimated Return (%)</label>
                <input type="number" id="ciRate" value="8.0" min="0" max="30" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcCI()" />
              </div>
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Investment Years</label>
                <input type="number" id="ciYears" value="20" min="1" max="50" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcCI()" />
              </div>
            </div>

            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Compounding Frequency</label>
              <select id="ciFreq" class="code-input" style="width: 100%; padding: 0.55rem;" onchange="calcCI()">
                <option value="12" selected>Monthly (12/yr - Standard)</option>
                <option value="1">Annually (1/yr)</option>
                <option value="365">Daily (365/yr)</option>
              </select>
            </div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Maturity Wealth Projection</h3>
            <div id="ciSummary" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
          </div>
        </div>
      </div>

      <script>
        function calcCI() {
          var p = parseFloat(document.getElementById('ciPrinc').value) || 0;
          var pmt = parseFloat(document.getElementById('ciMonthly').value) || 0;
          var r = (parseFloat(document.getElementById('ciRate').value) || 0) / 100;
          var t = parseFloat(document.getElementById('ciYears').value) || 1;
          var n = parseInt(document.getElementById('ciFreq').value, 10) || 12;

          var totalMonths = Math.round(t * 12);
          var monthlyRate = r / 12;

          // Future value of lump sum principal
          var fvPrincipal = p * Math.pow(1 + (r / n), n * t);

          // Future value of monthly annuity (compounded monthly)
          var fvAnnuity = 0;
          if (monthlyRate > 0) {
            fvAnnuity = pmt * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
          } else {
            fvAnnuity = pmt * totalMonths;
          }

          var totalFutureVal = fvPrincipal + fvAnnuity;
          var totalContributions = p + (pmt * totalMonths);
          var totalInterest = Math.max(0, totalFutureVal - totalContributions);

          document.getElementById('ciSummary').innerHTML = 
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL PROJECTED WEALTH (' + t + ' YRS)</span>' +
              '<div style="font-size: 2rem; font-weight: bold; color: #10b981;">$' + Math.round(totalFutureVal).toLocaleString('en-US') + '</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL INTEREST ACCRUED</span>' +
              '<div style="font-size: 1.35rem; font-weight: bold; color: #3b82f6;">$' + Math.round(totalInterest).toLocaleString('en-US') + '</div>' +
              '<div style="font-size: 0.75rem; color: var(--text-muted);">' + ((totalInterest / totalFutureVal) * 100).toFixed(1) + '% of final balance from pure growth</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL PRINCIPAL CONTRIBUTED</span>' +
              '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">$' + Math.round(totalContributions).toLocaleString('en-US') + '</div>' +
            '</div>';
        }

        document.addEventListener('DOMContentLoaded', calcCI);
        calcCI();
      </script>
    `
  }
];
  const seniorHealthTools = [
  {
    "slug": "blood-pressure-chart",
    "title": "Blood Pressure Chart & Category Tracker for Seniors",
    "metaDesc": "Check your blood pressure reading against American Heart Association (AHA) guidelines: Normal, Elevated, Stage 1/2 Hypertension, and Crisis. Includes printable daily log.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 950px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n          <a href=\"/\">Home</a> &gt; <a href=\"/health/\">Health</a> &gt; Blood Pressure Chart\n        </nav>\n\n        <header style=\"margin-bottom: 2rem;\">\n          <h1 style=\"font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;\">Blood Pressure Category Checker & Daily Log</h1>\n          <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n            Enter your Systolic (top number) and Diastolic (bottom number) readings to check your AHA category and pulse pressure.\n          </p>\n        </header>\n\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n          <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;\">\n            <div>\n              <label style=\"display: block; font-size: 0.9rem; font-weight: bold; margin-bottom: 0.4rem;\">Systolic (Top Number - mmHg):</label>\n              <input type=\"number\" id=\"bp-sys\" value=\"122\" min=\"70\" max=\"250\" style=\"width: 100%; padding: 0.75rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.3rem;\" oninput=\"calcBP()\" />\n            </div>\n            <div>\n              <label style=\"display: block; font-size: 0.9rem; font-weight: bold; margin-bottom: 0.4rem;\">Diastolic (Bottom Number - mmHg):</label>\n              <input type=\"number\" id=\"bp-dia\" value=\"78\" min=\"40\" max=\"150\" style=\"width: 100%; padding: 0.75rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.3rem;\" oninput=\"calcBP()\" />\n            </div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-align: center; margin-top: 1.5rem;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);\">AHA Blood Pressure Category</div>\n            <div id=\"bp-cat\" style=\"font-size: 2.2rem; font-weight: bold; color: #22c55e; margin: 0.5rem 0;\">Elevated (Pre-Hypertension)</div>\n            <div style=\"font-size: 0.9rem; color: var(--text-muted);\">\n              Pulse Pressure: <strong id=\"bp-pulse\" style=\"color: var(--fg); font-family: var(--mono);\">44 mmHg</strong> (Normal is 40–60 mmHg)\n            </div>\n          </div>\n        </div>\n\n        <div style=\"text-align: center; margin: 1.5rem 0;\">\n          <button onclick=\"window.print()\" style=\"background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"display:inline-block;vertical-align:middle;margin-right:3px\"><polyline points=\"6 9 6 2 18 2 18 9\"/><path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"/><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\"/></svg> Print Daily Blood Pressure Log Sheet\n          </button>\n        </div>\n\n        <table style=\"width: 100%; border-collapse: collapse; margin-top: 2rem; font-size: 0.9rem;\">\n          <thead>\n            <tr style=\"background: var(--surface-alt); text-align: left;\">\n              <th style=\"padding: 0.75rem; border: 1px solid var(--border);\">BP Category</th>\n              <th style=\"padding: 0.75rem; border: 1px solid var(--border);\">Systolic (Top)</th>\n              <th style=\"padding: 0.75rem; border: 1px solid var(--border);\">Diastolic (Bottom)</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr><td style=\"padding:0.6rem; border:1px solid var(--border); font-weight:bold; color:#22c55e;\">Normal</td><td style=\"padding:0.6rem; border:1px solid var(--border);\">Less than 120</td><td style=\"padding:0.6rem; border:1px solid var(--border);\">and Less than 80</td></tr>\n            <tr><td style=\"padding:0.6rem; border:1px solid var(--border); font-weight:bold; color:#eab308;\">Elevated</td><td style=\"padding:0.6rem; border:1px solid var(--border);\">120 – 129</td><td style=\"padding:0.6rem; border:1px solid var(--border);\">and Less than 80</td></tr>\n            <tr><td style=\"padding:0.6rem; border:1px solid var(--border); font-weight:bold; color:#f97316;\">Stage 1 Hypertension</td><td style=\"padding:0.6rem; border:1px solid var(--border);\">130 – 139</td><td style=\"padding:0.6rem; border:1px solid var(--border);\">or 80 – 89</td></tr>\n            <tr><td style=\"padding:0.6rem; border:1px solid var(--border); font-weight:bold; color:#ef4444;\">Stage 2 Hypertension</td><td style=\"padding:0.6rem; border:1px solid var(--border);\">140 or higher</td><td style=\"padding:0.6rem; border:1px solid var(--border);\">or 90 or higher</td></tr>\n            <tr><td style=\"padding:0.6rem; border:1px solid var(--border); font-weight:bold; color:#dc2626;\">Hypertensive Crisis</td><td style=\"padding:0.6rem; border:1px solid var(--border);\">Higher than 180</td><td style=\"padding:0.6rem; border:1px solid var(--border);\">and/or Higher than 120</td></tr>\n          </tbody>\n        </table>\n      </div>\n\n      <script>\n        function calcBP() {\n          const sys = parseFloat(document.getElementById('bp-sys').value) || 120;\n          const dia = parseFloat(document.getElementById('bp-dia').value) || 80;\n          const pulse = sys - dia;\n\n          let cat = 'Normal', color = '#22c55e';\n          if (sys > 180 || dia > 120) { cat = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"display:inline-block;vertical-align:middle;margin-right:3px\"><path d=\"M12 2L2 19h20L12 2z\"/><line x1=\"12\" y1=\"9\" x2=\"12\" y2=\"13\"/><circle cx=\"12\" cy=\"16\" r=\"0.5\" fill=\"currentColor\" stroke=\"none\"/></svg> Hypertensive Crisis (Seek Emergency Care)'; color = '#dc2626'; }\n          else if (sys >= 140 || dia >= 90) { cat = 'Stage 2 Hypertension'; color = '#ef4444'; }\n          else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) { cat = 'Stage 1 Hypertension'; color = '#f97316'; }\n          else if (sys >= 120 && sys <= 129 && dia < 80) { cat = 'Elevated Blood Pressure'; color = '#eab308'; }\n          else if (sys < 120 && dia < 80) { cat = 'Normal Blood Pressure'; color = '#22c55e'; }\n\n          const catEl = document.getElementById('bp-cat');\n          catEl.textContent = cat;\n          catEl.style.color = color;\n          document.getElementById('bp-pulse').textContent = pulse + ' mmHg';\n        }\n        document.addEventListener('DOMContentLoaded', calcBP);\n      </script>\n    "
  },
  {
    "slug": "senior-heart-rate",
    "title": "Senior Target Heart Rate by Age (50 to 85+)",
    "metaDesc": "Calculate safe cardiovascular exercise target heart rate zones (Moderate 50-70% and Vigorous 70-85%) tailored specifically for older adults and seniors.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 950px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n          <a href=\"/\">Home</a> &gt; <a href=\"/health/\">Health</a> &gt; Senior Heart Rate\n        </nav>\n\n        <header style=\"margin-bottom: 2rem;\">\n          <h1 style=\"font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;\">Target Heart Rate Calculator for Seniors</h1>\n          <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n            Calculate your estimated maximum heart rate and safe exercise training zones (walking, aerobics, cardio) based on American Heart Association guidelines for adults 50+.\n          </p>\n        </header>\n\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n          <div style=\"max-width: 300px; margin: 0 auto 1.5rem;\">\n            <label style=\"display: block; font-size: 0.9rem; font-weight: bold; margin-bottom: 0.4rem; text-align: center;\">Enter Your Current Age:</label>\n            <input type=\"number\" id=\"hr-age\" value=\"68\" min=\"50\" max=\"95\" style=\"width: 100%; padding: 0.6rem; text-align: center; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.3rem;\" oninput=\"calcHR()\" />\n          </div>\n\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;\">\n            <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #3b82f6; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n              <div style=\"font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted);\">Moderate Intensity (50% – 70%)</div>\n              <div style=\"font-size: 0.85rem; margin: 0.3rem 0;\">Brisk Walking, Swimming, Gardening</div>\n              <div id=\"hr-mod\" style=\"font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #3b82f6;\">76 – 106 BPM</div>\n            </div>\n\n            <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #eab308; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n              <div style=\"font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted);\">Vigorous Intensity (70% – 85%)</div>\n              <div style=\"font-size: 0.85rem; margin: 0.3rem 0;\">Cycling, Light Jogging, Aerobics</div>\n              <div id=\"hr-vig\" style=\"font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #eab308;\">106 – 129 BPM</div>\n            </div>\n\n            <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n              <div style=\"font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted);\">Max Heart Rate (100%)</div>\n              <div style=\"font-size: 0.85rem; margin: 0.3rem 0;\">Never exceed during routine exercise</div>\n              <div id=\"hr-max\" style=\"font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #ef4444;\">152 BPM</div>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <script>\n        function calcHR() {\n          const age = parseFloat(document.getElementById('hr-age').value) || 65;\n          const maxHR = 220 - age;\n          const modLow = Math.round(maxHR * 0.50);\n          const modHigh = Math.round(maxHR * 0.70);\n          const vigHigh = Math.round(maxHR * 0.85);\n\n          document.getElementById('hr-max').textContent = maxHR + ' BPM';\n          document.getElementById('hr-mod').textContent = modLow + ' – ' + modHigh + ' BPM';\n          document.getElementById('hr-vig').textContent = modHigh + ' – ' + vigHigh + ' BPM';\n        }\n        document.addEventListener('DOMContentLoaded', calcHR);\n      </script>\n    "
  }
];

  // 1. Build Finance Tools
  for (const t of financeTools) {
    const html = renderPage({
      title: `${t.title} | Digital Tools Shed`,
      metaDesc: t.metaDesc,
      canonical: `${DOMAIN}/finance/${t.slug}`,
      bodyContent: t.body,
      currentPath: `/finance/${t.slug}`,
      faq: t.faq
    });
    writeFileSync(join(finDist, `${t.slug}.html`), html);
  }

  // 2. Build Finance Hub
  const finCards = financeTools.map(t => `
    <a href="/finance/${t.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-decoration: none; color: inherit;">
      <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.5rem; color: var(--fg);">${t.title}</h3>
      <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  writeFileSync(join(finDist, 'index.html'), renderPage({
    title: 'Retirement & Personal Finance Calculators | Digital Tools Shed',
    metaDesc: 'Free retirement and financial planning calculators: Social Security estimator, 401k/IRA RMD calculator, 4% rule nest egg planner, and home downsizing.',
    canonical: `${DOMAIN}/finance/`,
    bodyContent: `
      <div class="article-container" style="max-width: 950px;">
        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Retirement & Personal Finance Calculators</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Free, private financial tools running 100% in your browser. Calculate retirement distributions, Social Security payouts, and wealth planning without creating an account.
          </p>
        </header>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${finCards}
        </div>
      </div>
    `,
    currentPath: '/finance/'
  }));

  // 3. Build Senior Health Tools
  for (const t of seniorHealthTools) {
    const html = renderPage({
      title: `${t.title} | Digital Tools Shed`,
      metaDesc: t.metaDesc,
      canonical: `${DOMAIN}/health/${t.slug}`,
      bodyContent: t.body,
      currentPath: `/health/${t.slug}`
    });
    writeFileSync(join(healthDist, `${t.slug}.html`), html);
  }

  console.log(`  ✓ Built Senior & Retirement Finance Suite (${financeTools.length + 1} finance tools, ${seniorHealthTools.length} senior health tools)`);
}
