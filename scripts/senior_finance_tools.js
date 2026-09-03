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
    "metaDesc": "Compare your estimated monthly and lifetime Social Security retirement benefits taking them early at 62, full retirement age (67), or delaying until 70.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 950px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n          <a href=\"/\">Home</a> &gt; <a href=\"/finance/\">Finance</a> &gt; Social Security Calculator\n        </nav>\n\n        <header style=\"margin-bottom: 2rem;\">\n          <h1 style=\"font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;\">Social Security Retirement Benefit Estimator</h1>\n          <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n            Estimate your monthly payout and compare the total lifetime benefits of claiming early at age 62, waiting for Full Retirement Age (67), or delaying until age 70 for the maximum 8% annual bonus.\n          </p>\n        </header>\n\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;\">\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Estimated Monthly Benefit at Full Age (67):</label>\n              <div style=\"position: relative;\">\n                <span style=\"position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);\">$</span>\n                <input type=\"number\" id=\"ss-base\" value=\"2000\" step=\"50\" style=\"width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcSS()\" />\n              </div>\n              <small style=\"color: var(--text-muted); font-size: 0.75rem;\">Average US benefit in 2026 is ~$1,900/mo.</small>\n            </div>\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Expected Longevity / Life Expectancy:</label>\n              <input type=\"number\" id=\"ss-age-limit\" value=\"85\" min=\"70\" max=\"100\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcSS()\" />\n              <small style=\"color: var(--text-muted); font-size: 0.75rem;\">Age to project lifetime cumulative benefits.</small>\n            </div>\n          </div>\n        </div>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;\">\n          <!-- AGE 62 -->\n          <div style=\"background: var(--surface); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.5rem; border-radius: 6px; text-align: center;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);\">Early Claiming (Age 62)</div>\n            <div style=\"font-size: 1.1rem; font-weight: bold; margin: 0.4rem 0;\">-30% Reduction</div>\n            <div id=\"ss-62-mo\" style=\"font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #ef4444; margin-bottom: 0.5rem;\">$1,400 / mo</div>\n            <div style=\"font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 0.75rem;\">\n              Lifetime Total: <strong id=\"ss-62-life\" style=\"color: var(--fg);\">$386,400</strong>\n            </div>\n          </div>\n\n          <!-- AGE 67 -->\n          <div style=\"background: var(--surface); border: 1px solid var(--border); border-top: 4px solid #3b82f6; padding: 1.5rem; border-radius: 6px; text-align: center;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);\">Full Retirement (Age 67)</div>\n            <div style=\"font-size: 1.1rem; font-weight: bold; margin: 0.4rem 0;\">100% Full Benefit</div>\n            <div id=\"ss-67-mo\" style=\"font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.5rem;\">$2,000 / mo</div>\n            <div style=\"font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 0.75rem;\">\n              Lifetime Total: <strong id=\"ss-67-life\" style=\"color: var(--fg);\">$432,000</strong>\n            </div>\n          </div>\n\n          <!-- AGE 70 -->\n          <div style=\"background: var(--surface); border: 1px solid var(--border); border-top: 4px solid #22c55e; padding: 1.5rem; border-radius: 6px; text-align: center;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);\">Delayed Claiming (Age 70)</div>\n            <div style=\"font-size: 1.1rem; font-weight: bold; margin: 0.4rem 0;\">+24% Maximum Bonus</div>\n            <div id=\"ss-70-mo\" style=\"font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #22c55e; margin-bottom: 0.5rem;\">$2,480 / mo</div>\n            <div style=\"font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 0.75rem;\">\n              Lifetime Total: <strong id=\"ss-70-life\" style=\"color: var(--fg);\">$446,400</strong>\n            </div>\n          </div>\n        </div>\n\n        <div style=\"text-align: center; margin: 2rem 0;\">\n          <button onclick=\"window.print()\" style=\"background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"display:inline-block;vertical-align:middle;margin-right:3px\"><polyline points=\"6 9 6 2 18 2 18 9\"/><path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"/><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\"/></svg> Print Social Security Projection Report\n          </button>\n        </div>\n\n        <section style=\"background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; line-height: 1.7; font-size: 0.95rem;\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem;\">Key Takeaways for Claiming Strategy</h3>\n          <ul style=\"margin: 0; padding-left: 1.25rem; color: var(--text-muted);\">\n            <li><strong>Break-Even Age:</strong> Waiting until age 70 typically breaks even against claiming at age 62 around ages 78–80. If your family has longevity, delaying maximizes lifetime wealth and survivor benefits.</li>\n            <li><strong>COLA Adjustments:</strong> Social Security payouts receive annual Cost-of-Living Adjustments (COLA), meaning larger starting checks compound higher percentage increases over time.</li>\n            <li><strong>Working in Retirement:</strong> Claiming before Full Retirement Age while continuing to work may temporarily withhold benefits under the earnings limit test.</li>\n          </ul>\n        </section>\n      </div>\n\n      <script>\n        function fmtM(n) { return '$' + Math.round(n).toLocaleString('en-US'); }\n        function calcSS() {\n          const base = parseFloat(document.getElementById('ss-base').value) || 0;\n          const maxAge = Math.max(71, parseFloat(document.getElementById('ss-age-limit').value) || 85);\n\n          const mo62 = base * 0.70;\n          const mo67 = base * 1.00;\n          const mo70 = base * 1.24;\n\n          const life62 = mo62 * (maxAge - 62) * 12;\n          const life67 = mo67 * (maxAge - 67) * 12;\n          const life70 = mo70 * (maxAge - 70) * 12;\n\n          document.getElementById('ss-62-mo').textContent = fmtM(mo62) + ' / mo';\n          document.getElementById('ss-67-mo').textContent = fmtM(mo67) + ' / mo';\n          document.getElementById('ss-70-mo').textContent = fmtM(mo70) + ' / mo';\n\n          document.getElementById('ss-62-life').textContent = fmtM(life62);\n          document.getElementById('ss-67-life').textContent = fmtM(life67);\n          document.getElementById('ss-70-life').textContent = fmtM(life70);\n        }\n        document.addEventListener('DOMContentLoaded', calcSS);\n      </script>\n    "
  },
  {
    "slug": "rmd-calculator",
    "title": "IRA & 401(k) Required Minimum Distribution (RMD) Calculator",
    "metaDesc": "Calculate your mandatory annual IRS Required Minimum Distribution (RMD) for Traditional IRAs and 401(k) accounts based on your age and IRS Uniform Lifetime Table.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 950px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n          <a href=\"/\">Home</a> &gt; <a href=\"/finance/\">Finance</a> &gt; RMD Calculator\n        </nav>\n\n        <header style=\"margin-bottom: 2rem;\">\n          <h1 style=\"font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;\">IRS Required Minimum Distribution (RMD) Calculator</h1>\n          <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n            Under the SECURE 2.0 Act, you must begin taking mandatory annual withdrawals from traditional IRAs, 401(k)s, and 403(b)s starting at age 73 to avoid hefty IRS penalties.\n          </p>\n        </header>\n\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;\">\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Total Pre-Tax Retirement Balance ($):</label>\n              <div style=\"position: relative;\">\n                <span style=\"position: absolute; left: 0.75rem; top: 0.6rem; color: var(--text-muted);\">$</span>\n                <input type=\"number\" id=\"rmd-bal\" value=\"500000\" step=\"10000\" style=\"width: 100%; padding: 0.6rem 0.6rem 0.6rem 1.8rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcRMD()\" />\n              </div>\n              <small style=\"color: var(--text-muted); font-size: 0.75rem;\">Balance on Dec 31 of previous tax year.</small>\n            </div>\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Your Age in Current Tax Year:</label>\n              <input type=\"number\" id=\"rmd-age\" value=\"75\" min=\"73\" max=\"100\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcRMD()\" />\n              <small style=\"color: var(--text-muted); font-size: 0.75rem;\">SECURE 2.0 starting age is 73.</small>\n            </div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-align: center; margin-top: 1.5rem;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);\">Mandatory Annual RMD Withdrawal</div>\n            <div id=\"rmd-amount\" style=\"font-family: var(--mono); font-size: 2.8rem; font-weight: bold; color: var(--btn-bg, #3b82f6); margin: 0.5rem 0;\">$20,325</div>\n            <div style=\"font-size: 0.9rem; color: var(--text-muted);\">\n              Monthly Equivalent: <strong id=\"rmd-mo\" style=\"color: var(--fg); font-family: var(--mono);\">$1,694 / mo</strong> | IRS Distribution Factor: <strong id=\"rmd-factor\" style=\"color: var(--fg); font-family: var(--mono);\">24.6</strong>\n            </div>\n          </div>\n        </div>\n\n        <div style=\"text-align: center; margin: 1.5rem 0;\">\n          <button onclick=\"window.print()\" style=\"background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"display:inline-block;vertical-align:middle;margin-right:3px\"><polyline points=\"6 9 6 2 18 2 18 9\"/><path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"/><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\"/></svg> Print IRS RMD Tax Worksheet\n          </button>\n        </div>\n      </div>\n\n      <script>\n        const irsTable = {\n          73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1,\n          80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2,\n          87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1,\n          94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4\n        };\n\n        function calcRMD() {\n          const bal = parseFloat(document.getElementById('rmd-bal').value) || 0;\n          let age = parseInt(document.getElementById('rmd-age').value, 10) || 73;\n          if (age < 73) age = 73;\n          if (age > 100) age = 100;\n\n          const factor = irsTable[age] || 24.6;\n          const rmd = bal / factor;\n          const mo = rmd / 12;\n\n          document.getElementById('rmd-amount').textContent = '$' + Math.round(rmd).toLocaleString('en-US');\n          document.getElementById('rmd-mo').textContent = '$' + Math.round(mo).toLocaleString('en-US') + ' / mo';\n          document.getElementById('rmd-factor').textContent = factor.toString();\n        }\n        document.addEventListener('DOMContentLoaded', calcRMD);\n      </script>\n    "
  },
  {
    "slug": "retirement-calculator",
    "title": "Retirement Nest Egg & 4% Safe Withdrawal Calculator",
    "metaDesc": "Determine how long your retirement savings will last based on your annual spending, investment growth rate, inflation, and the Trinity 4% rule.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 950px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n          <a href=\"/\">Home</a> &gt; <a href=\"/finance/\">Finance</a> &gt; Retirement Nest Egg Calculator\n        </nav>\n\n        <header style=\"margin-bottom: 2rem;\">\n          <h1 style=\"font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;\">Retirement Savings & 4% Withdrawal Planner</h1>\n          <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n            Calculate how many years your nest egg will last in retirement and verify if your current withdrawal rate satisfies the 4% safe withdrawal benchmark.\n          </p>\n        </header>\n\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;\">\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Total Retirement Nest Egg ($):</label>\n              <input type=\"number\" id=\"ret-total\" value=\"800000\" step=\"25000\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcRet()\" />\n            </div>\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Annual Spending ($ / Year):</label>\n              <input type=\"number\" id=\"ret-spend\" value=\"45000\" step=\"2000\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcRet()\" />\n            </div>\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Expected Portfolio Return (%):</label>\n              <input type=\"number\" id=\"ret-ret\" value=\"6\" step=\"0.5\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcRet()\" />\n            </div>\n            <div>\n              <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Expected Inflation (%):</label>\n              <input type=\"number\" id=\"ret-inf\" value=\"3\" step=\"0.5\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcRet()\" />\n            </div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-align: center; margin-top: 1.5rem;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);\">Estimated Nest Egg Longevity</div>\n            <div id=\"ret-years\" style=\"font-family: var(--mono); font-size: 2.8rem; font-weight: bold; color: #22c55e; margin: 0.5rem 0;\">32+ Years (Sustainable)</div>\n            <div style=\"font-size: 0.9rem; color: var(--text-muted);\">\n              Current Withdrawal Rate: <strong id=\"ret-pct\" style=\"color: var(--fg); font-family: var(--mono);\">5.6%</strong> | Recommended 4% Cap: <strong id=\"ret-safe\" style=\"color: var(--fg); font-family: var(--mono);\">$32,000 / yr</strong>\n            </div>\n          </div>\n        </div>\n\n        <div style=\"text-align: center; margin: 1.5rem 0;\">\n          <button onclick=\"window.print()\" style=\"background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"display:inline-block;vertical-align:middle;margin-right:3px\"><polyline points=\"6 9 6 2 18 2 18 9\"/><path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"/><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\"/></svg> Print Retirement Summary\n          </button>\n        </div>\n      </div>\n\n      <script>\n        function calcRet() {\n          const total = parseFloat(document.getElementById('ret-total').value) || 0;\n          const spend = parseFloat(document.getElementById('ret-spend').value) || 0;\n          const r = (parseFloat(document.getElementById('ret-ret').value) || 0) / 100;\n          const inf = (parseFloat(document.getElementById('ret-inf').value) || 0) / 100;\n\n          const rate = (total > 0) ? ((spend / total) * 100) : 0;\n          document.getElementById('ret-pct').textContent = rate.toFixed(1) + '%';\n          document.getElementById('ret-safe').textContent = '$' + Math.round(total * 0.04).toLocaleString('en-US') + ' / yr';\n\n          let balance = total;\n          let currentSpend = spend;\n          let years = 0;\n\n          while (balance > 0 && years < 60) {\n            balance = (balance * (1 + r)) - currentSpend;\n            currentSpend = currentSpend * (1 + inf);\n            years++;\n          }\n\n          const yEl = document.getElementById('ret-years');\n          if (years >= 50) {\n            yEl.textContent = 'Indefinite / Permanent';\n            yEl.style.color = '#22c55e';\n          } else if (years >= 25) {\n            yEl.textContent = years + ' Years';\n            yEl.style.color = '#22c55e';\n          } else if (years >= 15) {\n            yEl.textContent = years + ' Years';\n            yEl.style.color = '#f59e0b';\n          } else {\n            yEl.textContent = years + ' Years (Depletes Early)';\n            yEl.style.color = '#ef4444';\n          }\n        }\n        document.addEventListener('DOMContentLoaded', calcRet);\n      </script>\n    "
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
    title: 'Hourly to Salary Calculator (Annual, Monthly & Bi-Weekly Pay)',
    metaDesc: 'Convert hourly wage to annual salary, monthly income, and bi-weekly paychecks. Based on 40 hours per week, 2,080 working hours, with overtime and unpaid time off.',
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Hourly to Salary
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Hourly to Salary Wage Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Convert your hourly wage into total annual salary, monthly take-home estimates, bi-weekly paychecks, and daily earnings.
          </p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Wage & Work Schedule</h3>
            
            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Hourly Rate ($ USD / hr)</label>
              <input type="number" id="wageHourly" value="25" min="1" step="0.5" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="calcWage()" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Hours / Week</label>
                <input type="number" id="wageHours" value="40" min="1" max="80" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcWage()" />
              </div>
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Weeks / Year</label>
                <input type="number" id="wageWeeks" value="52" min="1" max="52" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcWage()" />
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.5rem;">
              <span style="font-size: 0.75rem; color: var(--text-muted); width: 100%;">Popular Hourly Rates:</span>
              <button type="button" class="btn-sm" onclick="setHourly(15)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">$15/hr</button>
              <button type="button" class="btn-sm" onclick="setHourly(20)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">$20/hr</button>
              <button type="button" class="btn-sm" onclick="setHourly(25)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">$25/hr</button>
              <button type="button" class="btn-sm" onclick="setHourly(30)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">$30/hr</button>
              <button type="button" class="btn-sm" onclick="setHourly(40)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">$40/hr</button>
              <button type="button" class="btn-sm" onclick="setHourly(50)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">$50/hr</button>
            </div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Salary Breakdown</h3>
            <div id="wageSummary" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
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
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem;">Hourly to Annual Salary Reference Table (40 hrs/wk, 52 wks)</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                  <th style="padding: 0.5rem 0.75rem;">Hourly Rate</th>
                  <th style="padding: 0.5rem 0.75rem;">Weekly Pay</th>
                  <th style="padding: 0.5rem 0.75rem;">Bi-Weekly Pay</th>
                  <th style="padding: 0.5rem 0.75rem;">Monthly Pay</th>
                  <th style="padding: 0.5rem 0.75rem;">Annual Salary</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">$15.00 / hr</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$600</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$1,200</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$2,600</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">$31,200</td></tr>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">$20.00 / hr</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$800</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$1,600</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$3,467</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">$41,600</td></tr>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">$25.00 / hr</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$1,000</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$2,000</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$4,333</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">$52,000</td></tr>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">$30.00 / hr</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$1,200</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$2,400</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$5,200</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">$62,400</td></tr>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">$40.00 / hr</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$1,600</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$3,200</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$6,933</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">$83,200</td></tr>
                <tr><td style="padding: 0.45rem 0.75rem; font-weight: bold;">$50.00 / hr</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$2,000</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$4,000</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">$8,667</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">$104,000</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <script>
        function calcWage() {
          var rate = parseFloat(document.getElementById('wageHourly').value) || 0;
          var hrs = parseFloat(document.getElementById('wageHours').value) || 40;
          var wks = parseFloat(document.getElementById('wageWeeks').value) || 52;

          var weekly = rate * hrs;
          var annual = weekly * wks;
          var monthly = annual / 12;
          var biweekly = annual / 26;
          var daily = weekly / 5;

          document.getElementById('wageSummary').innerHTML = 
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">ANNUAL SALARY (GROSS)</span>' +
              '<div style="font-size: 1.8rem; font-weight: bold; color: #10b981;">$' + Math.round(annual).toLocaleString('en-US') + ' / year</div>' +
              '<div style="font-size: 0.75rem; color: var(--text-muted);">' + (hrs * wks).toLocaleString('en-US') + ' total working hours per year</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">MONTHLY GROSS PAY</span>' +
              '<div style="font-size: 1.35rem; font-weight: bold; color: #3b82f6;">$' + Math.round(monthly).toLocaleString('en-US') + ' / month</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">BI-WEEKLY PAYCHECK</span>' +
              '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">$' + Math.round(biweekly).toLocaleString('en-US') + ' every 2 weeks</div>' +
              '<div style="font-size: 0.75rem; color: var(--text-muted);">Weekly: $' + Math.round(weekly).toLocaleString('en-US') + ' | Daily: $' + Math.round(daily).toLocaleString('en-US') + '</div>' +
            '</div>';
        }

        window.setHourly = function(val) {
          document.getElementById('wageHourly').value = val;
          calcWage();
        };

        document.addEventListener('DOMContentLoaded', calcWage);
        calcWage();
      </script>
    `
  },
  {
    slug: 'sales-tax-calculator',
    title: 'Sales Tax Calculator (Add Tax or Back Out Pre-Tax Price)',
    metaDesc: 'Calculate sales tax or reverse calculate price before tax. Features state presets for California, Texas, Florida, New York, and all 50 US states.',
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Sales Tax Calculator
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Sales Tax Calculator & Reverse Tax Finder</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Calculate sales tax on any purchase, or reverse calculate the original price before tax from a total receipt.
          </p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Calculation Mode</label>
              <select id="stMode" class="code-input" style="width: 100%; padding: 0.6rem;" onchange="calcSalesTax()">
                <option value="add" selected>Add Sales Tax (Amount is Before Tax)</option>
                <option value="reverse">Reverse / Back Out Tax (Amount is Total Paid)</option>
              </select>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label id="stAmountLabel" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Amount ($ USD)</label>
              <input type="number" id="stAmount" value="100.00" min="0" step="0.5" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="calcSalesTax()" />
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Tax Rate (% Percent)</label>
              <input type="number" id="stRate" value="8.25" min="0" max="30" step="0.05" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcSalesTax()" />
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              <span style="font-size: 0.75rem; color: var(--text-muted); width: 100%;">US State Presets:</span>
              <button type="button" class="btn-sm" onclick="setSTRate(7.25)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.75rem; cursor: pointer;">CA (7.25%)</button>
              <button type="button" class="btn-sm" onclick="setSTRate(6.25)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.75rem; cursor: pointer;">TX (6.25%)</button>
              <button type="button" class="btn-sm" onclick="setSTRate(4.00)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.75rem; cursor: pointer;">NY (4.0%)</button>
              <button type="button" class="btn-sm" onclick="setSTRate(6.00)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.75rem; cursor: pointer;">FL (6.0%)</button>
              <button type="button" class="btn-sm" onclick="setSTRate(6.50)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.75rem; cursor: pointer;">WA (6.5%)</button>
              <button type="button" class="btn-sm" onclick="setSTRate(0.00)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.75rem; cursor: pointer;">No Tax (0%)</button>
            </div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Tax Breakdown</h3>
            <div id="stSummary" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
          </div>
        </div>
      </div>

      <script>
        function calcSalesTax() {
          var mode = document.getElementById('stMode').value;
          var amt = parseFloat(document.getElementById('stAmount').value) || 0;
          var rate = parseFloat(document.getElementById('stRate').value) || 0;
          var rateDec = rate / 100;

          var preTax = 0, taxAmt = 0, total = 0;

          if (mode === 'add') {
            preTax = amt;
            taxAmt = preTax * rateDec;
            total = preTax + taxAmt;
          } else {
            total = amt;
            preTax = total / (1 + rateDec);
            taxAmt = total - preTax;
          }

          document.getElementById('stSummary').innerHTML = 
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL AMOUNT (WITH TAX)</span>' +
              '<div style="font-size: 1.8rem; font-weight: bold; color: #10b981;">$' + total.toFixed(2) + '</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">SALES TAX AMOUNT (' + rate + '%)</span>' +
              '<div style="font-size: 1.35rem; font-weight: bold; color: #3b82f6;">$' + taxAmt.toFixed(2) + '</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">ORIGINAL PRE-TAX PRICE</span>' +
              '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">$' + preTax.toFixed(2) + '</div>' +
            '</div>';
        }

        window.setSTRate = function(r) {
          document.getElementById('stRate').value = r;
          calcSalesTax();
        };

        document.addEventListener('DOMContentLoaded', calcSalesTax);
        calcSalesTax();
      </script>
    `
  },
  {
    slug: 'simple-interest-calculator',
    title: 'Simple Interest Calculator (I = Prt Loan & Savings)',
    metaDesc: 'Calculate simple interest with formula I = Prt. Find total interest earned or paid, total maturity balance, and monthly payback schedule.',
    category: 'Finance',
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Simple Interest
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Simple Interest Calculator (I = Prt)</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Calculate simple interest for personal loans, auto financing, notes, and short-term certificates of deposit.
          </p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Principal Amount ($ USD)</label>
              <input type="number" id="siPrinc" value="10000" min="1" step="100" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="calcSI()" />
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Annual Interest Rate (%)</label>
              <input type="number" id="siRate" value="6.5" min="0.1" max="100" step="0.1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcSI()" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Term Duration</label>
                <input type="number" id="siTerm" value="3" min="0.1" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcSI()" />
              </div>
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Time Unit</label>
                <select id="siUnit" class="code-input" style="width: 100%; padding: 0.55rem;" onchange="calcSI()">
                  <option value="years" selected>Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Repayment Summary</h3>
            <div id="siSummary" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
          </div>
        </div>
      </div>

      <script>
        function calcSI() {
          var p = parseFloat(document.getElementById('siPrinc').value) || 0;
          var r = (parseFloat(document.getElementById('siRate').value) || 0) / 100;
          var term = parseFloat(document.getElementById('siTerm').value) || 0;
          var unit = document.getElementById('siUnit').value;

          var tInYears = unit === 'months' ? (term / 12) : term;
          var interest = p * r * tInYears;
          var total = p + interest;
          var totalMonths = tInYears * 12;
          var moPayment = totalMonths > 0 ? (total / totalMonths) : total;

          document.getElementById('siSummary').innerHTML = 
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL REPAYMENT / FUTURE VALUE</span>' +
              '<div style="font-size: 1.8rem; font-weight: bold; color: #10b981;">$' + Math.round(total).toLocaleString('en-US') + '</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL INTEREST ACCRUED</span>' +
              '<div style="font-size: 1.35rem; font-weight: bold; color: #3b82f6;">$' + Math.round(interest).toLocaleString('en-US') + '</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">MONTHLY REPAYMENT COST</span>' +
              '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">$' + Math.round(moPayment).toLocaleString('en-US') + ' / mo</div>' +
              '<div style="font-size: 0.75rem; color: var(--text-muted);">Over ' + Math.round(totalMonths) + ' monthly payments</div>' +
            '</div>';
        }

        document.addEventListener('DOMContentLoaded', calcSI);
        calcSI();
      </script>
    `
  },
  {
    slug: 'overtime-calculator',
    title: 'Overtime Pay Calculator (1.5x Time and a Half & Double Time)',
    metaDesc: 'Calculate overtime wages, 1.5x time-and-a-half rate, 2.0x double-time holiday pay, and total gross paycheck breakdown under FLSA rules.',
    category: 'Finance',
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; Overtime Calculator
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Overtime & Double Time Wage Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Calculate time-and-a-half (1.5×) overtime and double-time (2.0×) earnings based on federal Fair Labor Standards Act (FLSA) guidelines.
          </p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Regular Hourly Rate ($ / hr)</label>
              <input type="number" id="otRate" value="24.00" min="1" step="0.5" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="calcOT()" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Regular Hours (≤ 40)</label>
                <input type="number" id="otRegHrs" value="40" min="0" max="40" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcOT()" />
              </div>
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Overtime Hours (1.5×)</label>
                <input type="number" id="otOthHrs" value="10" min="0" max="60" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcOT()" />
              </div>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Double Time Hours (2.0× Holidays/Sundays)</label>
              <input type="number" id="otDblHrs" value="0" min="0" max="40" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcOT()" />
            </div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Paycheck Breakdown</h3>
            <div id="otSummary" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
          </div>
        </div>
      </div>

      <script>
        function calcOT() {
          var rate = parseFloat(document.getElementById('otRate').value) || 0;
          var regHrs = parseFloat(document.getElementById('otRegHrs').value) || 0;
          var otHrs = parseFloat(document.getElementById('otOthHrs').value) || 0;
          var dblHrs = parseFloat(document.getElementById('otDblHrs').value) || 0;

          var regPay = regHrs * rate;
          var otRate = rate * 1.5;
          var otPay = otHrs * otRate;
          var dblRate = rate * 2.0;
          var dblPay = dblHrs * dblRate;

          var totalPay = regPay + otPay + dblPay;
          var totalHrs = regHrs + otHrs + dblHrs;
          var effectiveRate = totalHrs > 0 ? (totalPay / totalHrs) : rate;

          document.getElementById('otSummary').innerHTML = 
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL GROSS PAY</span>' +
              '<div style="font-size: 1.8rem; font-weight: bold; color: #10b981;">$' + totalPay.toFixed(2) + '</div>' +
              '<div style="font-size: 0.75rem; color: var(--text-muted);">' + totalHrs + ' total hours worked</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">OVERTIME (1.5× @ $' + otRate.toFixed(2) + '/hr)</span>' +
              '<div style="font-size: 1.35rem; font-weight: bold; color: #3b82f6;">$' + otPay.toFixed(2) + '</div>' +
              '<div style="font-size: 0.75rem; color: var(--text-muted);">' + otHrs + ' overtime hours</div>' +
            '</div>' +
            (dblHrs > 0 ? (
              '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                '<span style="color: var(--text-muted); font-size: 0.75rem;">DOUBLE TIME (2.0× @ $' + dblRate.toFixed(2) + '/hr)</span>' +
                '<div style="font-size: 1.35rem; font-weight: bold; color: #f59e0b;">$' + dblPay.toFixed(2) + '</div>' +
              '</div>'
            ) : '') +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">REGULAR PAY & EFFECTIVE RATE</span>' +
              '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">$' + regPay.toFixed(2) + ' (Regular)</div>' +
              '<div style="font-size: 0.75rem; color: var(--text-muted);">Effective rate: $' + effectiveRate.toFixed(2) + '/hr</div>' +
            '</div>';
        }

        document.addEventListener('DOMContentLoaded', calcOT);
        calcOT();
      </script>
    `
  },
  {
    slug: 'cagr-calculator',
    title: 'CAGR Calculator (Compound Annual Growth Rate)',
    metaDesc: 'Calculate Compound Annual Growth Rate (CAGR) for stocks, real estate, and business revenue. Includes total percentage return and Rule of 72 doubling timeline.',
    body: `
      <div class="article-container" style="max-width: 950px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/finance/">Finance</a> &gt; CAGR Calculator
        </nav>

        <header style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">CAGR (Compound Annual Growth Rate) Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
            Determine the annualized growth rate of an investment, business revenue, or asset portfolio across any number of years.
          </p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Beginning Value ($ USD)</label>
              <input type="number" id="cagrStart" value="10000" min="1" step="500" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="calcCAGR()" />
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Ending Value ($ USD)</label>
              <input type="number" id="cagrEnd" value="25000" min="1" step="500" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="calcCAGR()" />
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Time Period (Years)</label>
              <input type="number" id="cagrYears" value="5" min="0.1" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcCAGR()" />
            </div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Growth Analysis</h3>
            <div id="cagrSummary" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
          </div>
        </div>
      </div>

      <script>
        function calcCAGR() {
          var bv = parseFloat(document.getElementById('cagrStart').value) || 1;
          var ev = parseFloat(document.getElementById('cagrEnd').value) || 1;
          var t = parseFloat(document.getElementById('cagrYears').value) || 1;

          var cagr = (Math.pow(ev / bv, 1 / t) - 1) * 100;
          var totalReturn = ((ev - bv) / bv) * 100;
          var doublingYears = cagr > 0 ? (72 / cagr) : 0;

          document.getElementById('cagrSummary').innerHTML = 
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">ANNUALIZED GROWTH RATE (CAGR)</span>' +
              '<div style="font-size: 2rem; font-weight: bold; color: #10b981;">' + cagr.toFixed(2) + '% / year</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL OVERALL RETURN</span>' +
              '<div style="font-size: 1.35rem; font-weight: bold; color: #3b82f6;">+' + totalReturn.toFixed(1) + '% (+$' + Math.round(ev - bv).toLocaleString('en-US') + ')</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">RULE OF 72 (DOUBLING TIME)</span>' +
              '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">' + (doublingYears > 0 ? doublingYears.toFixed(1) + ' Years to Double' : 'N/A') + '</div>' +
            '</div>';
        }

        document.addEventListener('DOMContentLoaded', calcCAGR);
        calcCAGR();
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
      currentPath: `/finance/${t.slug}`
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
