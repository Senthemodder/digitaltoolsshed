// scripts/senior_finance_tools.js - Senior Living & High-CPM Finance Tools

export function buildSeniorFinanceSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const finDist = join(DIST, 'finance');
  const healthDist = join(DIST, 'health');
  ensureDir(finDist);
  ensureDir(healthDist);

  const financeTools = [
  {
    "slug": "social-security-calculator",
    "title": "Social Security Benefit Calculator by Age (62 vs 67 vs 70)",
    "metaDesc": "Compare your estimated monthly and lifetime Social Security retirement benefits taking them early at 62, full retirement age (67), or delaying until 70 with COLA compounding and break-even analysis.",
    "body": `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Social Security Calculator
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Social Security Retirement Benefit Estimator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Compare monthly payouts and cumulative lifetime wealth across all claiming ages from 62 to 70. Features SSA actuarial formulas, annual COLA compounding, exact break-even crossover analysis, and spousal survivor benefits.
          </p>
        </header>

        <div class="tool-box">
          <!-- Primary Benefit & Target Age Inputs -->
          <div class="grid-inputs">
            <div class="field-group">
              <label class="field-label">Estimated Monthly Benefit at Full Age 67 (PIA in $ USD)</label>
              <input type="number" id="ss-base" class="text-input" value="2200" step="50" oninput="calcSS()" />
              <div style="display: flex; gap: 0.35rem; margin-top: 0.4rem; flex-wrap: wrap;">
                <button type="button" class="btn-sec" onclick="setSSPIA(1600)" style="font-size: 0.72rem; padding: 0.2rem 0.4rem; font-family: var(--mono);">$1,600 (Avg)</button>
                <button type="button" class="btn-sec" onclick="setSSPIA(2200)" style="font-size: 0.72rem; padding: 0.2rem 0.4rem; font-family: var(--mono); border-color: #3b82f6; color: #3b82f6; font-weight: bold;">$2,200 (Above Avg)</button>
                <button type="button" class="btn-sec" onclick="setSSPIA(2800)" style="font-size: 0.72rem; padding: 0.2rem 0.4rem; font-family: var(--mono);">$2,800 (High)</button>
                <button type="button" class="btn-sec" onclick="setSSPIA(3911)" style="font-size: 0.72rem; padding: 0.2rem 0.4rem; font-family: var(--mono);">$3,911 (2025 Max)</button>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Your Planned Claiming Age</label>
              <select id="ss-claim-age" class="text-input" onchange="calcSS()">
                <option value="62">Age 62 (-30.0% Early Reduction)</option>
                <option value="63">Age 63 (-25.0% Early Reduction)</option>
                <option value="64">Age 64 (-20.0% Early Reduction)</option>
                <option value="65">Age 65 (-13.3% Early Reduction)</option>
                <option value="66">Age 66 (-6.7% Early Reduction)</option>
                <option value="67" selected>Age 67 (100% Full Retirement Age)</option>
                <option value="68">Age 68 (+8.0% Delayed Credit)</option>
                <option value="69">Age 69 (+16.0% Delayed Credit)</option>
                <option value="70">Age 70 (+24.0% Maximum Bonus)</option>
              </select>
              <small style="color: var(--text-muted); font-size: 0.75rem;">FRA is 67 for all workers born 1960 or later.</small>
            </div>

            <div class="field-group">
              <label class="field-label">Life Expectancy Horizon (Age)</label>
              <input type="number" id="ss-age-limit" class="text-input" value="85" min="70" max="100" step="1" oninput="calcSS()" />
              <small style="color: var(--text-muted); font-size: 0.75rem;">Actuarial longevity projection (average is 84–87).</small>
            </div>
          </div>

          <!-- COLA & Spousal Settings -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; margin: 1.25rem 0;">
            <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; margin-bottom: 0.75rem; color: var(--fg); display: flex; align-items: center; justify-content: space-between;">
              <span>📈 Inflation & Household Claiming Variables</span>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #10b981;">Actuarial Precision</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
              <div>
                <label class="field-label" style="font-size: 0.75rem;">Annual COLA Compounding Rate</label>
                <select id="ss-cola" class="text-input" onchange="calcSS()" style="padding: 0.45rem; font-size: 0.85rem;">
                  <option value="0">0.0% (Purchasing Power / Flat Dollars)</option>
                  <option value="0.015">1.5% (Conservative Low Inflation)</option>
                  <option value="0.025" selected>2.5% (Historical SSA 20-Yr Average)</option>
                  <option value="0.035">3.5% (Higher Inflation Regime)</option>
                </select>
              </div>

              <div>
                <label class="field-label" style="font-size: 0.75rem;">Include Spousal Benefit Top-Up?</label>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem;">
                  <input type="checkbox" id="ss-spouse-toggle" onchange="calcSS()" style="width: 18px; height: 18px; cursor: pointer;" />
                  <span style="font-size: 0.85rem; color: var(--fg);">Calculate 50% spousal auxiliary check</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Milestone Comparison Cards (62 vs 67 vs 70) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <!-- AGE 62 -->
            <div style="background: var(--surface); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Early Claiming (Age 62)</div>
              <div style="font-size: 0.95rem; font-weight: bold; margin: 0.3rem 0; color: #ef4444;">-30.0% Reduction</div>
              <div id="ss-62-mo" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #ef4444; margin-bottom: 0.4rem;">$1,540 / mo</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 0.5rem;">
                Lifetime Total: <strong id="ss-62-life" style="color: var(--fg); font-family: var(--mono);">$425,040</strong>
              </div>
            </div>

            <!-- AGE 67 -->
            <div style="background: var(--surface); border: 1px solid var(--border); border-top: 4px solid #3b82f6; padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Full Retirement (Age 67)</div>
              <div style="font-size: 0.95rem; font-weight: bold; margin: 0.3rem 0; color: #3b82f6;">100% Full PIA</div>
              <div id="ss-67-mo" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.4rem;">$2,200 / mo</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 0.5rem;">
                Lifetime Total: <strong id="ss-67-life" style="color: var(--fg); font-family: var(--mono);">$475,200</strong>
              </div>
            </div>

            <!-- AGE 70 -->
            <div style="background: var(--surface); border: 1px solid var(--border); border-top: 4px solid #22c55e; padding: 1.25rem; border-radius: 6px; text-align: center;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Delayed Claiming (Age 70)</div>
              <div style="font-size: 0.95rem; font-weight: bold; margin: 0.3rem 0; color: #22c55e;">+24.0% Max Bonus</div>
              <div id="ss-70-mo" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #22c55e; margin-bottom: 0.4rem;">$2,728 / mo</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 0.5rem;">
                Lifetime Total: <strong id="ss-70-life" style="color: var(--fg); font-family: var(--mono);">$491,040</strong>
              </div>
            </div>
          </div>

          <!-- Selected Plan Summary Card -->
          <div class="result-card" style="margin-top: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap;">
              <div class="field-label">Your Planned Strategy Outcome</div>
              <div id="ss-plan-badge" style="font-family: var(--mono); font-size: 0.8rem; color: #3b82f6; font-weight: bold;">Claiming at Age 67</div>
            </div>
            <div id="ss-selected-monthly" class="result-val">$2,200 / mo</div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.25rem; border-top: 1px solid var(--border); padding-top: 1.25rem;">
              <div style="background: var(--surface); padding: 0.85rem; border-radius: 4px; border: 1px solid var(--border);">
                <span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; font-family: var(--mono);">Lifetime Cumulative Payout</span>
                <div id="ss-selected-lifetime" style="font-size: 1.4rem; font-weight: bold; color: #10b981; font-family: var(--mono);">$475,200</div>
                <div id="ss-selected-years" style="font-size: 0.75rem; color: var(--text-muted);">Over 18 years of retirement</div>
              </div>

              <div style="background: var(--surface); padding: 0.85rem; border-radius: 4px; border: 1px solid var(--border);">
                <span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; font-family: var(--mono);">Break-Even Age (Age 70 vs 62)</span>
                <div id="ss-breakeven" style="font-size: 1.4rem; font-weight: bold; color: #3b82f6; font-family: var(--mono);">Age 80.4</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Living past this age favors delaying to 70</div>
              </div>

              <div style="background: var(--surface); padding: 0.85rem; border-radius: 4px; border: 1px solid var(--border);">
                <span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; font-family: var(--mono);">Spousal Check Addition</span>
                <div id="ss-spouse-amount" style="font-size: 1.4rem; font-weight: bold; color: var(--fg); font-family: var(--mono);">$0 / mo</div>
                <div id="ss-spouse-desc" style="font-size: 0.75rem; color: var(--text-muted);">Toggle spousal benefit above</div>
              </div>
            </div>

            <button type="button" id="btnCopySS" onclick="copySSSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Social Security Strategy Report
            </button>
          </div>

          <!-- Step-by-Step Worked Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step SSA Actuarial Formula Derivation</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">42 U.S. Code § 402</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              The Social Security Administration calculates reductions and delayed credits on a monthly actuarial scale relative to Full Retirement Age (FRA 67):
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 1: Early Reduction & Delayed Credits Percentage</strong>
                <div id="ss-step-1" style="color: #3b82f6; margin-top: 0.25rem;">
                  Full Retirement Age (67): Multiplier = 100.0% of PIA ($2,200.00 / mo)
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 2: Actuarial Reduction Schedule</strong>
                <div id="ss-step-2" style="color: var(--text-muted); margin-top: 0.25rem;">
                  Early Reduction: 5/9 of 1% per month for first 36 months (20.0%) + 5/12 of 1% per month for next 24 months (10.0%) = 30.0% total reduction at age 62.<br>
                  Delayed Credit: 2/3 of 1% per month (8.0% per year) for 36 months = +24.0% total bonus at age 70.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 3: Cumulative Lifetime Value with COLA Compounding</strong>
                <div id="ss-step-3" style="color: var(--text-muted); margin-top: 0.25rem;">
                  Lifetime Cumulative = &Sigma; [Monthly &times; 12 &times; (1 + COLA)^t] from Age 67 to Age 85 = <strong>$475,200</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981; font-weight: 700;">Step 4: Break-Even Crossover Horizon</strong>
                <div id="ss-step-4" style="color: #10b981; margin-top: 0.25rem;">
                  Age 70 ($2,728/mo) starts 96 months after Age 62 ($1,540/mo). Cumulative lines cross at <strong>Age 80.4</strong>.
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Social Security Traps & Retirement Pitfalls -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Social Security Traps & Retirement Pitfalls</h3>
            <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; display: grid; gap: 0.6rem;">
              <li><strong>The Retirement Earnings Test Trap:</strong> If you claim before Full Retirement Age (FRA 67) and continue working, SSA will withhold $1 for every $2 you earn above $23,400 (in 2025/2026). While withheld benefits are actuarially recalculated at FRA, claiming early while working creates an immediate liquidity penalty.</li>
              <li><strong>The Social Security "Tax Torpedo":</strong> Up to 85% of your Social Security benefits become subject to ordinary federal income tax once your provisional income (AGI + tax-exempt interest + 50% of your Social Security) exceeds $25,000 for single filers or $32,000 for married couples filing jointly. These thresholds were established in 1983 and have NEVER been indexed to inflation!</li>
              <li><strong>The Survivor Benefit Asymmetry:</strong> When one spouse passes away, the smaller of the two Social Security checks vanishes forever, and the surviving spouse inherits the larger check. Delaying the higher-earning spouse's claim to age 70 locks in the maximum possible guaranteed, inflation-protected lifetime annuity for the surviving spouse.</li>
              <li><strong>The "Break-Even" Myopia Fallacy:</strong> Many retirees claim at 62 thinking "I break even at 80, so I'll take the money early." But Social Security is not an investment portfolio subject to market volatility; it is government-backed longevity insurance. Claiming late protects you precisely when you are most vulnerable: in your late 80s and 90s after other assets may have dwindled.</li>
            </ul>
          </div>
        </div>

        <div style="text-align: center; margin: 2rem 0;">
          <button onclick="window.print()" style="background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print Social Security Projection Report
          </button>
        </div>
      </div>

      <script>
        function fmtM(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

        window.setSSPIA = function(amt) {
          document.getElementById('ss-base').value = amt;
          calcSS();
        };

        function getAgeMultiplier(age) {
          // FRA = 67
          if (age === 67) return 1.00;
          if (age < 67) {
            var monthsEarly = (67 - age) * 12;
            var reduction = 0;
            if (monthsEarly <= 36) {
              reduction = monthsEarly * (5 / 9 / 100);
            } else {
              reduction = (36 * (5 / 9 / 100)) + ((monthsEarly - 36) * (5 / 12 / 100));
            }
            return 1.00 - reduction;
          } else {
            var monthsDelayed = (age - 67) * 12;
            var delayedCredit = monthsDelayed * (2 / 3 / 100);
            return 1.00 + delayedCredit;
          }
        }

        function calcLifetime(monthly, startAge, endAge, colaRate) {
          var total = 0;
          var curMo = monthly;
          for (var yr = startAge; yr < endAge; yr++) {
            total += curMo * 12;
            curMo *= (1 + colaRate);
          }
          return total;
        }

        function calcSS() {
          var base = parseFloat(document.getElementById('ss-base').value) || 0;
          var plannedAge = parseInt(document.getElementById('ss-claim-age').value, 10) || 67;
          var maxAge = Math.max(71, parseFloat(document.getElementById('ss-age-limit').value) || 85);
          var cola = parseFloat(document.getElementById('ss-cola').value) || 0;
          var hasSpouse = document.getElementById('ss-spouse-toggle').checked;

          var mult62 = getAgeMultiplier(62);
          var mult67 = getAgeMultiplier(67);
          var mult70 = getAgeMultiplier(70);
          var multPlan = getAgeMultiplier(plannedAge);

          var mo62 = base * mult62;
          var mo67 = base * mult67;
          var mo70 = base * mult70;
          var moPlan = base * multPlan;

          var spouseMo = hasSpouse ? (base * 0.50 * multPlan) : 0;
          var totalMoPlan = moPlan + spouseMo;

          var life62 = calcLifetime(mo62, 62, maxAge, cola);
          var life67 = calcLifetime(mo67, 67, maxAge, cola);
          var life70 = calcLifetime(mo70, 70, maxAge, cola);
          var lifePlan = calcLifetime(totalMoPlan, plannedAge, maxAge, cola);

          document.getElementById('ss-62-mo').textContent = fmtM(mo62) + ' / mo';
          document.getElementById('ss-67-mo').textContent = fmtM(mo67) + ' / mo';
          document.getElementById('ss-70-mo').textContent = fmtM(mo70) + ' / mo';

          document.getElementById('ss-62-life').textContent = fmtM(life62);
          document.getElementById('ss-67-life').textContent = fmtM(life67);
          document.getElementById('ss-70-life').textContent = fmtM(life70);

          // Selected Plan
          var pctDiff = Math.round((multPlan - 1.0) * 100);
          var pctStr = (pctDiff >= 0 ? '+' : '') + pctDiff + '% vs FRA 67';
          document.getElementById('ss-plan-badge').textContent = 'Claiming at Age ' + plannedAge + ' (' + pctStr + ')';
          document.getElementById('ss-selected-monthly').textContent = fmtM(totalMoPlan) + ' / mo';
          document.getElementById('ss-selected-lifetime').textContent = fmtM(lifePlan);
          document.getElementById('ss-selected-years').textContent = 'Over ' + (maxAge - plannedAge) + ' years of retirement (to Age ' + maxAge + ')';

          // Spousal
          if (hasSpouse) {
            document.getElementById('ss-spouse-amount').textContent = '+' + fmtM(spouseMo) + ' / mo';
            document.getElementById('ss-spouse-desc').textContent = '50% spousal auxiliary benefit';
          } else {
            document.getElementById('ss-spouse-amount').textContent = '$0 / mo';
            document.getElementById('ss-spouse-desc').textContent = 'Single earner calculation';
          }

          // Break-Even Age (70 vs 62)
          var beAge = 70;
          var cum62 = calcLifetime(mo62, 62, 70, cola);
          var cum70 = 0;
          var found = false;

          for (var testAge = 70; testAge <= 100; testAge += 0.1) {
            var c62 = calcLifetime(mo62, 62, testAge, cola);
            var c70 = calcLifetime(mo70, 70, testAge, cola);
            if (c70 >= c62) {
              beAge = testAge;
              found = true;
              break;
            }
          }
          document.getElementById('ss-breakeven').textContent = 'Age ' + beAge.toFixed(1);

          // Step Derivations
          document.getElementById('ss-step-1').innerHTML = 'Selected Claiming Age ' + plannedAge + ': Multiplier = <strong>' + (multPlan * 100).toFixed(1) + '%</strong> of PIA ($' + base.toFixed(2) + ' &times; ' + multPlan.toFixed(3) + ') = <strong>' + fmtM(moPlan) + ' / mo</strong>';
          document.getElementById('ss-step-3').innerHTML = 'Lifetime Cumulative (' + plannedAge + ' to ' + maxAge + ' with ' + (cola * 100).toFixed(1) + '% COLA) = <strong>' + fmtM(lifePlan) + '</strong>';
          document.getElementById('ss-step-4').innerHTML = 'Delaying to Age 70 ($' + fmtM(mo70) + '/mo) catches up and surpasses Age 62 ($' + fmtM(mo62) + '/mo) at <strong>Age ' + beAge.toFixed(1) + '</strong>.';
        }

        function copySSSummary() {
          var base = document.getElementById('ss-base').value;
          var age = document.getElementById('ss-claim-age').value;
          var maxAge = document.getElementById('ss-age-limit').value;
          var selectedMo = document.getElementById('ss-selected-monthly').textContent;
          var selectedLife = document.getElementById('ss-selected-lifetime').textContent;
          var be = document.getElementById('ss-breakeven').textContent;
          var mo62 = document.getElementById('ss-62-mo').textContent;
          var mo67 = document.getElementById('ss-67-mo').textContent;
          var mo70 = document.getElementById('ss-70-mo').textContent;

          var text = '🏛️ SOCIAL SECURITY CLAIMING STRATEGY REPORT\\n' +
            '----------------------------------------\\n' +
            '• PIA at Full Retirement Age (67): $' + base + ' / mo\\n' +
            '• Planned Claiming Age: Age ' + age + '\\n' +
            '• Estimated Monthly Benefit: ' + selectedMo + '\\n' +
            '• Cumulative Lifetime (to Age ' + maxAge + '): ' + selectedLife + '\\n' +
            '----------------------------------------\\n' +
            'CLAIMING AGE COMPARISON:\\n' +
            '• Early (Age 62): ' + mo62 + ' (-30% reduction)\\n' +
            '• Full Retirement (Age 67): ' + mo67 + ' (100% PIA)\\n' +
            '• Delayed Maximum (Age 70): ' + mo70 + ' (+24% delayed credit)\\n' +
            '• Delay Break-Even Crossover: ' + be + '\\n' +
            '----------------------------------------\\n' +
            'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/finance/social-security-calculator';

          navigator.clipboard.writeText(text).then(function() {
            var btn = document.getElementById('btnCopySS');
            var old = btn.innerHTML;
            btn.innerHTML = '✓ Copied Social Security Summary!';
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
    "slug": "rmd-calculator",
    "title": "IRS Required Minimum Distribution (RMD) Calculator (SECURE 2.0 & Table III)",
    "metaDesc": "Calculate your mandatory annual IRS Required Minimum Distribution (RMD) under SECURE 2.0. Includes IRS Uniform Lifetime Table III, 5-year projections, and QCD tax deductions.",
    "body": `
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

          <button type="button" id="btnCopyRMD" onclick="copyRMDSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
            📋 Copy Official IRS RMD Tax Worksheet
          </button>
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
        }

        function copyRMDSummary() {
          var bal = document.getElementById('rmd-bal').value;
          var age = document.getElementById('rmd-age').value;
          var gross = document.getElementById('rmd-amount').textContent;
          var factor = document.getElementById('rmd-factor').textContent;
          var taxable = document.getElementById('rmd-taxable').textContent;
          var netSpend = document.getElementById('rmd-net-spend').textContent;
          var qcd = document.getElementById('rmd-qcd').value;

          var text = '🏛️ IRS REQUIRED MINIMUM DISTRIBUTION (RMD) WORKSHEET\\n' +
            '----------------------------------------\\n' +
            '• Prior Dec 31 Pre-Tax Balance: $' + Number(bal).toLocaleString('en-US') + '\\n' +
            '• Current Tax Year Age: ' + age + ' (SECURE 2.0 Compliant)\\n' +
            '• IRS Table III Factor: ' + factor + '\\n' +
            '----------------------------------------\\n' +
            'DISTRIBUTION OBLIGATION:\\n' +
            '• Gross Mandatory RMD: ' + gross + ' (' + document.getElementById('rmd-mo').textContent + ')\\n' +
            '• Qualified Charitable Distribution (QCD): $' + Number(qcd).toLocaleString('en-US') + '\\n' +
            '• Net Taxable RMD: ' + taxable + '\\n' +
            '• Estimated Net Spendable: ' + netSpend + '\\n' +
            '----------------------------------------\\n' +
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
    "slug": "retirement-calculator",
    "title": "Retirement Nest Egg & Safe Withdrawal Calculator (Trinity 4% & Guardrails)",
    "metaDesc": "Determine how long your retirement portfolio will last using the Trinity 4% rule, Guyton-Klinger guardrails, inflation adjustments, and Sequence of Returns Risk modeling.",
    "body": `
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
            Portfolio decumulation is governed by the recurrence relation \( B_{t+1} = (B_t - W_t) \times (1 + r) \), where initial withdrawal \( W_0 \) indexes to inflation \( W_t = W_0 \times (1 + i)^t \):
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

          for (var yr = 1; yr <= 60; yr++) {
            if (balance <= 0) break;
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

            balance = (balance - curSpend) * (1 + yrReturn);
            curSpend = curSpend * (1 + inf);
            if (balance > 0) years++;
          }

          var yEl = document.getElementById('ret-years');
          var ySubEl = document.getElementById('ret-years-sub');
          if (years >= 50) {
            yEl.textContent = '50+ Years';
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
          document.getElementById('ret-step-4').textContent = 'At ' + rate.toFixed(2) + '% initial draw, simulated longevity is ' + (years >= 50 ? '50+ Years (Permanent)' : years + ' Years') + ' under selected scenario.';
        }

        function copyRetirementSummary() {
          var total = document.getElementById('ret-total').value;
          var spend = document.getElementById('ret-spend').value;
          var guar = document.getElementById('ret-guar').value;
          var rate = document.getElementById('ret-pct').textContent;
          var netDraw = document.getElementById('ret-net-draw').textContent;
          var longevity = document.getElementById('ret-years').textContent;
          var safeCap = document.getElementById('ret-safe').textContent;

          var text = '🏛️ RETIREMENT LONGEVITY & SAFE WITHDRAWAL REPORT\\n' +
            '----------------------------------------\\n' +
            '• Total Retirement Nest Egg: $' + Number(total).toLocaleString('en-US') + '\\n' +
            '• Annual Living Expenses: $' + Number(spend).toLocaleString('en-US') + ' / yr\\n' +
            '• Guaranteed Non-Portfolio Income: $' + Number(guar).toLocaleString('en-US') + ' / yr\\n' +
            '• Net Portfolio Annual Draw: ' + netDraw + '\\n' +
            '----------------------------------------\\n' +
            'LONGEVITY & SUSTAINABILITY BENCHMARK:\\n' +
            '• Initial Withdrawal Rate: ' + rate + '\\n' +
            '• Trinity 4% Recommended Cap: ' + safeCap + '\\n' +
            '• Projected Portfolio Longevity: ' + longevity + '\\n' +
            '• Solvency Status: ' + document.getElementById('ret-rate-status').textContent + '\\n' +
            '----------------------------------------\\n' +
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
    "slug": "annuity-calculator",
    "title": "Pension Annuity vs. Lump Sum Payout Calculator",
    "metaDesc": "Compare taking a guaranteed monthly lifetime pension annuity versus taking a single lump-sum payout invested in the market.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 950px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n          <a href=\"/\">Home</a> &gt; <a href=\"/finance/\">Finance</a> &gt; Annuity vs Lump Sum\n        </nav>\n\n        <header style=\"margin-bottom: 2rem;\">\n          <h1 style=\"font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;\">Pension Annuity vs. Lump Sum Calculator</h1>\n          <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n            Deciding between a monthly guaranteed pension check and a single lump sum? Calculate your break-even age and find out which option provides more retirement wealth.\n          </p>\n        </header>\n\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;\">\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Offered Lump Sum Payout ($):</label>\n              <input type=\"number\" id=\"an-lump\" value=\"350000\" step=\"10000\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcAnnuity()\" />\n            </div>\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Monthly Annuity Offer ($ / mo):</label>\n              <input type=\"number\" id=\"an-mo\" value=\"2200\" step=\"50\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcAnnuity()\" />\n            </div>\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Retirement Start Age:</label>\n              <input type=\"number\" id=\"an-age\" value=\"65\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcAnnuity()\" />\n            </div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-align: center; margin-top: 1.5rem;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);\">Break-Even Age (Simple Payback)</div>\n            <div id=\"an-be\" style=\"font-family: var(--mono); font-size: 2.5rem; font-weight: bold; color: var(--btn-bg, #3b82f6); margin: 0.5rem 0;\">Age 78.2</div>\n            <div style=\"font-size: 0.9rem; color: var(--text-muted);\">\n              Annual Annuity Payout: <strong id=\"an-yr\" style=\"color: var(--fg); font-family: var(--mono);\">$26,400 / yr</strong> (Equivalent to a <strong id=\"an-yield\" style=\"color: var(--fg); font-family: var(--mono);\">7.5%</strong> payout rate)\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <script>\n        function calcAnnuity() {\n          const lump = parseFloat(document.getElementById('an-lump').value) || 1;\n          const mo = parseFloat(document.getElementById('an-mo').value) || 0;\n          const age = parseFloat(document.getElementById('an-age').value) || 65;\n\n          const annual = mo * 12;\n          const yearsToBE = annual > 0 ? (lump / annual) : 0;\n          const beAge = age + yearsToBE;\n          const yieldPct = (annual / lump) * 100;\n\n          document.getElementById('an-be').textContent = 'Age ' + beAge.toFixed(1);\n          document.getElementById('an-yr').textContent = '$' + Math.round(annual).toLocaleString('en-US') + ' / yr';\n          document.getElementById('an-yield').textContent = yieldPct.toFixed(1) + '%';\n        }\n        document.addEventListener('DOMContentLoaded', calcAnnuity);\n      </script>\n    "
  },
  {
    "slug": "downsizing-calculator",
    "title": "Senior Home Downsizing & Net Equity Cash-Out Calculator",
    "metaDesc": "Calculate your net cash proceeds after selling a larger family home, paying closing costs, and moving into a smaller condo or retirement community.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 950px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n          <a href=\"/\">Home</a> &gt; <a href=\"/finance/\">Finance</a> &gt; Home Downsizing Calculator\n        </nav>\n\n        <header style=\"margin-bottom: 2rem;\">\n          <h1 style=\"font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;\">Senior Home Downsizing & Cash Flow Planner</h1>\n          <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n            Estimate the net cash released into your retirement accounts when selling your primary home and transitioning to lower-maintenance living.\n          </p>\n        </header>\n\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;\">\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Current Home Sale Price ($):</label>\n              <input type=\"number\" id=\"ds-sale\" value=\"650000\" step=\"10000\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcDown()\" />\n            </div>\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Remaining Mortgage Balance ($):</label>\n              <input type=\"number\" id=\"ds-mort\" value=\"80000\" step=\"5000\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcDown()\" />\n            </div>\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">New Downsized Home / Condo Price ($):</label>\n              <input type=\"number\" id=\"ds-new\" value=\"350000\" step=\"10000\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcDown()\" />\n            </div>\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Realtor Commission & Closing (%):</label>\n              <input type=\"number\" id=\"ds-fee\" value=\"7\" step=\"0.5\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcDown()\" />\n            </div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-align: center; margin-top: 1.5rem;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);\">Net Cash Added to Retirement Savings</div>\n            <div id=\"ds-net\" style=\"font-family: var(--mono); font-size: 2.8rem; font-weight: bold; color: #22c55e; margin: 0.5rem 0;\">+$174,500</div>\n            <div style=\"font-size: 0.9rem; color: var(--text-muted);\">\n              Sale Proceeds After Fees: <strong id=\"ds-proc\" style=\"color: var(--fg); font-family: var(--mono);\">$524,500</strong> | New Home Paid in Full (Debt-Free)\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <script>\n        function calcDown() {\n          const sale = parseFloat(document.getElementById('ds-sale').value) || 0;\n          const mort = parseFloat(document.getElementById('ds-mort').value) || 0;\n          const newH = parseFloat(document.getElementById('ds-new').value) || 0;\n          const feePct = (parseFloat(document.getElementById('ds-fee').value) || 0) / 100;\n\n          const fees = sale * feePct;\n          const netProceeds = sale - mort - fees;\n          const cashSurplus = netProceeds - newH;\n\n          document.getElementById('ds-proc').textContent = '$' + Math.round(netProceeds).toLocaleString('en-US');\n          const netEl = document.getElementById('ds-net');\n          netEl.textContent = (cashSurplus >= 0 ? '+$' : '-$') + Math.abs(Math.round(cashSurplus)).toLocaleString('en-US');\n          netEl.style.color = cashSurplus >= 0 ? '#22c55e' : '#ef4444';\n        }\n        document.addEventListener('DOMContentLoaded', calcDown);\n      </script>\n    "
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
    "slug": "social-security-tax",
    "title": "Social Security Taxability & Provisional Income Calculator",
    "metaDesc": "Calculate how much of your Social Security benefit is subject to federal income tax (0%, 50%, or 85%) using the IRS provisional combined income formula.",
    "body": `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Social Security Taxability
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Social Security Taxability Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Find out exactly what portion of your Social Security checks will be taxed by the IRS using the statutory Provisional (Combined) Income formula.
          </p>
        </header>

        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Tax Filing Status:</label>
              <select id="sst-status" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" onchange="calcSSTax()">
                <option value="single">Single / Head of Household</option>
                <option value="joint">Married Filing Jointly</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Annual Social Security Benefits ($):</label>
              <input type="number" id="sst-ss" value="28000" step="1000" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcSSTax()" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Other Taxable Income (Wages, Pensions, 401k/IRA):</label>
              <input type="number" id="sst-other" value="24000" step="1000" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcSSTax()" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Non-Taxable Interest (Muni Bonds):</label>
              <input type="number" id="sst-muni" value="0" step="500" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcSSTax()" />
            </div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-align: center; margin-top: 1.5rem;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Portion of Social Security Subject to Tax</div>
            <div id="sst-taxable" style="font-family: var(--mono); font-size: 2.8rem; font-weight: bold; color: var(--btn-bg, #3b82f6); margin: 0.5rem 0;">$14,000 (50%)</div>
            <div style="font-size: 0.9rem; color: var(--text-muted);">
              IRS Provisional Income: <strong id="sst-prov" style="color: var(--fg); font-family: var(--mono);">$38,000</strong> | 100% Tax-Free Amount: <strong id="sst-free" style="color: #22c55e; font-family: var(--mono);">$14,000</strong>
            </div>
          </div>
        </div>
      </div>

      <script>
        function calcSSTax() {
          var status = document.getElementById('sst-status').value;
          var ss = parseFloat(document.getElementById('sst-ss').value) || 0;
          var other = parseFloat(document.getElementById('sst-other').value) || 0;
          var muni = parseFloat(document.getElementById('sst-muni').value) || 0;

          var halfSS = ss * 0.5;
          var provisional = other + muni + halfSS;

          var base1 = (status === 'joint') ? 32000 : 25000;
          var base2 = (status === 'joint') ? 44000 : 34000;

          var taxable = 0;
          if (provisional <= base1) {
            taxable = 0;
          } else if (provisional <= base2) {
            taxable = Math.min(halfSS, (provisional - base1) * 0.5);
          } else {
            var tier1 = (base2 - base1) * 0.5;
            var tier2 = (provisional - base2) * 0.85;
            taxable = Math.min(ss * 0.85, tier1 + tier2);
          }

          var pct = ss > 0 ? ((taxable / ss) * 100).toFixed(0) : 0;
          var taxFree = Math.max(0, ss - taxable);

          document.getElementById('sst-taxable').textContent = '$' + Math.round(taxable).toLocaleString('en-US') + ' (' + pct + '%)';
          document.getElementById('sst-prov').textContent = '$' + Math.round(provisional).toLocaleString('en-US');
          document.getElementById('sst-free').textContent = '$' + Math.round(taxFree).toLocaleString('en-US');
        }
        document.addEventListener('DOMContentLoaded', calcSSTax);
      </script>
    `
  },
  {
    slug: 'car-depreciation-calculator',
    title: 'Car Depreciation Calculator (5-Year Value & Residual Loss)',
    metaDesc: 'Estimate vehicle depreciation over 5 years. Calculate monthly depreciation cost, residual trade-in value, and resale price for cars, SUVs, trucks, and EVs.',
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Car Depreciation
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Car Depreciation & Residual Value Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Calculate how much your car loses in value each year. Discover your 5-year residual resale value, annual dollar loss, and true monthly ownership cost.
          </p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Vehicle Information</h3>
            
            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Purchase Price ($ USD)</label>
              <input type="number" id="carPrice" value="38000" min="1000" step="500" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="calcCarDeprec()" />
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Vehicle Category</label>
              <select id="carType" class="search-input" style="width: 100%; padding: 0.65rem; font-size: 1rem;" onchange="calcCarDeprec()">
                <option value="truck">Truck / Full-Size Pickup (Slowest Depreciation)</option>
                <option value="suv" selected>Compact / Midsize SUV (Average Depreciation)</option>
                <option value="sedan">Sedan / Hatchback (Moderate Depreciation)</option>
                <option value="luxury">Luxury Vehicle (Rapid Depreciation)</option>
                <option value="ev">Electric Vehicle EV (Rapid Battery Depreciation)</option>
              </select>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Annual Mileage</label>
              <select id="carMiles" class="search-input" style="width: 100%; padding: 0.65rem; font-size: 1rem;" onchange="calcCarDeprec()">
                <option value="0.95">Low Mileage (&lt; 10,000 miles/yr)</option>
                <option value="1.0" selected>Average (12,000 to 15,000 miles/yr)</option>
                <option value="1.08">High Mileage (18,000+ miles/yr)</option>
              </select>
            </div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">5-Year Ownership Loss</h3>
            <div id="carSummary" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
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

        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem;">Year-by-Year Depreciation Schedule</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                  <th style="padding: 0.5rem 0.75rem;">Year</th>
                  <th style="padding: 0.5rem 0.75rem;">Residual Value</th>
                  <th style="padding: 0.5rem 0.75rem;">Annual Loss ($)</th>
                  <th style="padding: 0.5rem 0.75rem;">Total % Depreciated</th>
                </tr>
              </thead>
              <tbody id="deprecTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <script>
        var deprecRates = {
          truck: [0.17, 0.12, 0.10, 0.09, 0.08],
          suv: [0.20, 0.14, 0.12, 0.10, 0.09],
          sedan: [0.22, 0.15, 0.13, 0.11, 0.10],
          luxury: [0.26, 0.18, 0.15, 0.13, 0.11],
          ev: [0.28, 0.19, 0.16, 0.13, 0.12]
        };

        function calcCarDeprec() {
          var price = parseFloat(document.getElementById('carPrice').value) || 0;
          var cat = document.getElementById('carType').value || 'suv';
          var milesMult = parseFloat(document.getElementById('carMiles').value) || 1.0;

          var rates = deprecRates[cat];
          var currentVal = price;
          var totalLost = 0;
          var rowsHtml = '';

          for (var i = 0; i < 5; i++) {
            var yearRate = Math.min(0.35, rates[i] * milesMult);
            var annualLoss = currentVal * yearRate;
            currentVal -= annualLoss;
            totalLost += annualLoss;
            var pctLost = ((totalLost / price) * 100).toFixed(0);

            rowsHtml += 
              '<tr style="border-bottom: 1px solid var(--border);">' +
                '<td style="padding: 0.5rem 0.75rem; font-weight: bold;">Year ' + (i + 1) + '</td>' +
                '<td style="padding: 0.5rem 0.75rem; font-family: var(--mono); color: #22c55e; font-weight: bold;">$' + Math.round(currentVal).toLocaleString('en-US') + '</td>' +
                '<td style="padding: 0.5rem 0.75rem; font-family: var(--mono); color: #ef4444;">-$' + Math.round(annualLoss).toLocaleString('en-US') + '</td>' +
                '<td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">' + pctLost + '%</td>' +
              '</tr>';
          }

          document.getElementById('deprecTableBody').innerHTML = rowsHtml;

          var monthlyCost = totalLost / 60;
          document.getElementById('carSummary').innerHTML = 
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">5-YEAR RESALE VALUE</span>' +
              '<div style="font-size: 1.8rem; font-weight: bold; color: #22c55e;">$' + Math.round(currentVal).toLocaleString('en-US') + '</div>' +
              '<div style="font-size: 0.75rem; color: var(--text-muted);">' + (100 - Math.round((totalLost / price) * 100)) + '% of original purchase price retained</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL 5-YEAR DEPRECIATION LOSS</span>' +
              '<div style="font-size: 1.3rem; font-weight: bold; color: #ef4444;">-$' + Math.round(totalLost).toLocaleString('en-US') + '</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">AVERAGE MONTHLY DEPRECIATION COST</span>' +
              '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">$' + Math.round(monthlyCost) + ' / month</div>' +
              '<div style="font-size: 0.75rem; color: var(--text-muted);">Hidden ownership cost beyond gas and insurance</div>' +
            '</div>';
        }

        document.addEventListener('DOMContentLoaded', calcCarDeprec);
        calcCarDeprec();
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
    slug: 'net-worth-calculator',
    title: 'Net Worth Calculator (Assets minus Liabilities)',
    metaDesc: 'Calculate your total personal net worth by tallying cash, real estate, stocks, and retirement accounts against mortgages, student loans, and debt.',
    category: 'Finance',
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Net Worth Calculator
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Personal Net Worth Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Calculate your true financial standing: tally what you own (assets) and subtract what you owe (liabilities).
          </p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <!-- Assets -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-top: 4px solid #10b981; padding: 1.5rem; border-radius: 8px;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem; color: #10b981;">Assets (What You Own)</h3>
            <div style="display: grid; gap: 0.85rem;">
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block;">Cash & Bank Accounts ($)</label>
                <input type="number" id="nwCash" value="25000" min="0" step="500" class="search-input nw-asset" style="width: 100%; padding: 0.45rem;" oninput="calcNW()" />
              </div>
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block;">Retirement (401k, IRA) ($)</label>
                <input type="number" id="nwRet" value="120000" min="0" step="1000" class="search-input nw-asset" style="width: 100%; padding: 0.45rem;" oninput="calcNW()" />
              </div>
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block;">Real Estate Market Value ($)</label>
                <input type="number" id="nwHome" value="380000" min="0" step="5000" class="search-input nw-asset" style="width: 100%; padding: 0.45rem;" oninput="calcNW()" />
              </div>
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block;">Vehicles & Personal Property ($)</label>
                <input type="number" id="nwVeh" value="30000" min="0" step="1000" class="search-input nw-asset" style="width: 100%; padding: 0.45rem;" oninput="calcNW()" />
              </div>
            </div>
          </div>

          <!-- Liabilities -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.5rem; border-radius: 8px;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem; color: #ef4444;">Liabilities (What You Owe)</h3>
            <div style="display: grid; gap: 0.85rem;">
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block;">Mortgage Balance ($)</label>
                <input type="number" id="nwMort" value="240000" min="0" step="2000" class="search-input nw-debt" style="width: 100%; padding: 0.45rem;" oninput="calcNW()" />
              </div>
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block;">Auto Loans ($)</label>
                <input type="number" id="nwAuto" value="12000" min="0" step="500" class="search-input nw-debt" style="width: 100%; padding: 0.45rem;" oninput="calcNW()" />
              </div>
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block;">Student Loans ($)</label>
                <input type="number" id="nwStudent" value="15000" min="0" step="500" class="search-input nw-debt" style="width: 100%; padding: 0.45rem;" oninput="calcNW()" />
              </div>
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block;">Credit Cards & Other Debt ($)</label>
                <input type="number" id="nwCards" value="3000" min="0" step="200" class="search-input nw-debt" style="width: 100%; padding: 0.45rem;" oninput="calcNW()" />
              </div>
            </div>
          </div>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; text-align: center; margin-bottom: 2rem;">
          <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Total Net Worth</div>
          <div id="nwTotal" style="font-family: var(--mono); font-size: 2.8rem; font-weight: bold; color: #10b981; margin: 0.5rem 0;">$285,000</div>
          <div id="nwRatios" style="font-size: 0.95rem; color: var(--text-muted); font-family: var(--mono);">
            Total Assets: $555,000 | Total Liabilities: $270,000 | Debt Ratio: 48.6%
          </div>
        </div>
      </div>

      <script>
        function calcNW() {
          var assets = 0;
          document.querySelectorAll('.nw-asset').forEach(function(el) {
            assets += parseFloat(el.value) || 0;
          });

          var debts = 0;
          document.querySelectorAll('.nw-debt').forEach(function(el) {
            debts += parseFloat(el.value) || 0;
          });

          var netWorth = assets - debts;
          var debtRatio = assets > 0 ? ((debts / assets) * 100) : 0;

          var totalEl = document.getElementById('nwTotal');
          totalEl.textContent = (netWorth >= 0 ? '$' : '-$') + Math.abs(Math.round(netWorth)).toLocaleString('en-US');
          totalEl.style.color = netWorth >= 0 ? '#10b981' : '#ef4444';

          document.getElementById('nwRatios').textContent = 
            'Total Assets: $' + Math.round(assets).toLocaleString('en-US') + ' | ' +
            'Total Liabilities: $' + Math.round(debts).toLocaleString('en-US') + ' | ' +
            'Debt Ratio: ' + debtRatio.toFixed(1) + '%';
        }

        document.addEventListener('DOMContentLoaded', calcNW);
        calcNW();
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
