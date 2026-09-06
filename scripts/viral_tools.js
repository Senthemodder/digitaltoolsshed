import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

export function buildViralTools() {
  const calcDir = join(DIST, 'calc');
  const mathDir = join(DIST, 'math');
  const utilDir = join(DIST, 'util');

  ensureDir(calcDir);
  ensureDir(mathDir);
  ensureDir(utilDir);
  function renderViralPage(opts) {
    let visibleFaqHtml = '';
    if (opts.faq && opts.faq.length > 0) {
      visibleFaqHtml = `
        <div class="wb-card" style="margin-top:2.5rem; background:var(--surface); border:1px solid var(--border); padding:1.5rem; border-radius:8px;">
          <h2 style="font-family:var(--serif); font-size:1.4rem; margin-bottom:1.25rem;">Frequently Asked Questions</h2>
          ${opts.faq.map(f => `
            <div class="faq-item" style="border-bottom:1px solid var(--border); padding:0.85rem 0;" onclick="this.classList.toggle('open')">
              <div style="font-weight:600; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:1rem;">${f.q}</span>
                <span class="faq-icon" style="font-size:1.2rem; transition:transform 0.2s; color:var(--text-muted);">+</span>
              </div>
              <div class="faq-answer" style="display:none; margin-top:0.6rem; color:var(--text-muted); font-size:0.92rem; line-height:1.65;">
                ${f.a}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
    const fullBody = opts.bodyContent + visibleFaqHtml + `
      <style>
        .faq-item.open .faq-answer { display: block !important; }
        .faq-item.open .faq-icon { transform: rotate(45deg); color: #10b981; }
        .trap-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 1.15rem;
          margin-bottom: 1rem;
          font-size: 0.92rem;
          line-height: 1.6;
        }
        .trap-card strong {
          display: block;
          margin-bottom: 0.35rem;
          font-size: 1rem;
        }
      </style>
    `;
    return renderPage({
      ...opts,
      bodyContent: fullBody
    });
  }

  // 1. AI WATER & ENERGY REALITY CHECKER
  const aiWaterHtml = `
    <style>
      .ticker-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; }
      .ticker-val { font-family: var(--mono); font-size: 1.8rem; font-weight: bold; margin: 0.35rem 0; }
      .ticker-sub { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
      .bar-track { height: 12px; background: var(--surface-alt); border-radius: 6px; overflow: hidden; margin-top: 0.5rem; }
      .bar-fill { height: 100%; border-radius: 6px; transition: width 0.3s ease; }
    </style>

    <div class="article-container" style="max-width: 1050px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; AI Water & Energy Reality Checker
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem;">How Much Water Does AI Actually Use?</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Real-time live comparison ticker tracking global AI water consumption (ChatGPT, Claude, Gemini data center cooling) versus livestock agriculture, golf courses, cotton textiles, and municipal water since you opened this page.
        </p>
      </header>

      <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.75rem 1.25rem; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
        <span style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><circle cx="12" cy="13" r="9"/><polyline points="12 9 12 13 15 16"/><path d="M12 4V2"/><path d="M10 2h4"/></svg> Tracking live resource consumption for: <strong id="elapsedTimer" style="color: var(--fg);">0.0s</strong></span>
        <span style="font-size: 0.8rem; background: rgba(34,197,94,0.15); color: #22c55e; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: bold;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;margin-right:4px"></span> LIVE REAL-TIME CALCULATION</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem;">
        <div class="ticker-card" style="border-left: 4px solid #3b82f6;">
          <div class="ticker-sub">🤖 Global AI Data Centers (ChatGPT, LLMs)</div>
          <div class="ticker-val" id="valAiWater" style="color: #3b82f6;">0.00 L</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">Water for cooling servers & evaporative towers (~350 L/sec globally)</div>
          <div class="bar-track"><div class="bar-fill" style="width: 0.5%; background: #3b82f6;"></div></div>
        </div>

        <div class="ticker-card" style="border-left: 4px solid #ef4444;">
          <div class="ticker-sub">🥩 Global Beef & Cattle Farming</div>
          <div class="ticker-val" id="valCattleWater" style="color: #ef4444;">0.00 L</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">Livestock feed irrigation & livestock drinking water (~58,000,000 L/sec)</div>
          <div class="bar-track"><div class="bar-fill" style="width: 100%; background: #ef4444;"></div></div>
        </div>

        <div class="ticker-card" style="border-left: 4px solid #10b981;">
          <div class="ticker-sub">⛳ Global Golf Course Irrigation</div>
          <div class="ticker-val" id="valGolfWater" style="color: #10b981;">0.00 L</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">Turf grass maintenance & chemical irrigation (~115,000 L/sec)</div>
          <div class="bar-track"><div class="bar-fill" style="width: 15%; background: #10b981;"></div></div>
        </div>

        <div class="ticker-card" style="border-left: 4px solid #f59e0b;">
          <div class="ticker-sub">👕 Global Cotton & Fast Fashion</div>
          <div class="ticker-val" id="valCottonWater" style="color: #f59e0b;">0.00 L</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">Textile crops & garment chemical dyeing (~2,900,000 L/sec)</div>
          <div class="bar-track"><div class="bar-fill" style="width: 35%; background: #f59e0b;"></div></div>
        </div>
      </div>

      <!-- PERSONAL USAGE CALCULATOR -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.5rem;">Calculate Your Personal AI Water Footprint</h3>
        <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          How many queries (prompts) do you send to ChatGPT, Claude, Copilot, or Midjourney per day?
        </p>

        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <div style="flex: 1; min-width: 200px;">
            <label style="font-size: 0.85rem; font-family: var(--mono); color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Daily AI Prompts:</label>
            <input type="number" id="userPrompts" value="25" min="1" max="1000" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcPersonalFootprint()" />
          </div>

          <div style="flex: 1; min-width: 200px;">
            <label style="font-size: 0.85rem; font-family: var(--mono); color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Preferred Unit:</label>
            <select id="waterUnit" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" onchange="calcPersonalFootprint()">
              <option value="liters">Liters (L)</option>
              <option value="bottles">500ml Water Bottles</option>
              <option value="gal">US Gallons (gal)</option>
            </select>
          </div>
        </div>

        <div id="personalFootprintResults" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;"></div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button onclick="copyAiWaterAudit()" id="copyAiWaterBtn" class="btn-primary" style="padding: 0.6rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">📋 Copy AI Water Footprint Audit</button>
        </div>
      </div>

      <!-- COMPARISON TABLE -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1rem;">Perspective Comparison: How Much Water Does It Take?</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; font-family: var(--mono);">
          <thead>
            <tr style="border-bottom: 2px solid var(--border); text-align: left;">
              <th style="padding: 0.5rem 0.75rem;">Action / Item</th>
              <th style="padding: 0.5rem 0.75rem;">Water Used</th>
              <th style="padding: 0.5rem 0.75rem;">Equivalent in ChatGPT Queries</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem 0.75rem;">🤖 <strong>1 ChatGPT Query</strong></td>
              <td style="padding: 0.5rem 0.75rem; color: #3b82f6;"><strong>0.019 L (19 ml)</strong></td>
              <td style="padding: 0.5rem 0.75rem;"><strong>1 Query</strong></td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem 0.75rem;">☕ 1 Cup of Coffee</td>
              <td style="padding: 0.5rem 0.75rem;">140 L</td>
              <td style="padding: 0.5rem 0.75rem; color: #22c55e;"><strong>7,368 Queries</strong></td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem 0.75rem;">🚿 1 Standard 8-Minute Shower</td>
              <td style="padding: 0.5rem 0.75rem;">65 L</td>
              <td style="padding: 0.5rem 0.75rem; color: #22c55e;"><strong>3,421 Queries</strong></td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem 0.75rem;">🍔 1 Quarter-Pound Beef Burger</td>
              <td style="padding: 0.5rem 0.75rem; color: #ef4444;"><strong>1,750 L</strong></td>
              <td style="padding: 0.5rem 0.75rem; color: #ef4444;"><strong>92,105 Queries</strong></td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0.75rem;">👖 1 Pair of Denim Jeans</td>
              <td style="padding: 0.5rem 0.75rem; color: #ef4444;"><strong>7,500 L</strong></td>
              <td style="padding: 0.5rem 0.75rem; color: #ef4444;"><strong>394,736 Queries</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ENGINEERING & THERMODYNAMIC DERIVATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Thermodynamic Derivation of Data Center Water & Power Consumption</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          Based on empirical peer-reviewed research by Dr. Shaolei Ren (UC Riverside) and Cornell University (2023), AI water consumption combines on-site evaporative cooling with off-site thermoelectric grid generation:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.25rem;">
          1. Scope 1 (Direct On-Site Evaporative Cooling):<br>
          &nbsp;&nbsp;&nbsp;Water_direct = Energy_IT (kWh) &times; WUE_onsite (L/kWh)<br>
          &nbsp;&nbsp;&nbsp;Modern hyper-scale data centers average WUE &approx; 0.25 to 1.8 L/kWh of IT load.<br><br>
          2. Scope 2 (Indirect Off-Site Power Plant Water):<br>
          &nbsp;&nbsp;&nbsp;Water_indirect = Energy_Total (kWh) &times; Water_Intensity_Grid (L/kWh)<br>
          &nbsp;&nbsp;&nbsp;Thermoelectric coal/gas/nuclear generation evaporates 2.0 to 9.5 L/kWh for turbine cooling.<br><br>
          3. Total Per-Prompt Volumetric Footprint:<br>
          &nbsp;&nbsp;&nbsp;W_prompt &approx; (0.0003 kWh / prompt) &times; (1.2 PUE) &times; (2.5 L/kWh combined) &approx; 0.0019 to 0.019 L (1.9 to 19 ml per 50-token output).
        </div>
      </div>

      <!-- FATAL TRAPS & WATER MISCONCEPTIONS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Misconceptions in AI Environmental Accounting</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Potable Drinking Water Confusion</strong>
          Assuming that data center cooling towers consume bottled drinking water. Most modern facilities utilize recycled graywater, non-potable municipal effluent, or closed-loop air-chilled condensers that evaporate negligible moisture.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. Geographic Water-Stress Blindspot</strong>
          Treating 100 liters evaporated in rainy, hydro-rich regions (e.g. Ireland, Norway) as ecologically equivalent to 100 liters drawn in water-stressed desert basins (e.g. Phoenix, Arizona). Location matters more than gross volume.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Training vs. Inference Disparity</strong>
          Focusing exclusively on the headline-grabbing water cost of training GPT-4 (approx. 700,000 liters), ignoring that hundreds of millions of daily inference queries surpass the one-time training footprint in a matter of months.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The Electricity-Water Decoupling Fallacy</strong>
          Ignoring indirect Scope 2 water consumption. Over 70% of the water attributed to AI compute is actually evaporated off-site at coal, gas, and nuclear power stations supplying electricity to the grid.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. Out-of-Context Ecological Alarmism</strong>
          Sensationalizing AI water use without comparative perspective: an individual who sends 30 ChatGPT prompts a day consumes less water in a year than what is required to produce a single cup of coffee or a half-pound of beef.
        </div>
      </div>
    </div>

    <script>
      var startTime = Date.now();
      var AI_WATER_PER_MS = 350 / 1000;
      var CATTLE_WATER_PER_MS = 58000000 / 1000;
      var GOLF_WATER_PER_MS = 115000 / 1000;
      var COTTON_WATER_PER_MS = 2900000 / 1000;

      function updateLiveTickers() {
        var elapsedMs = Date.now() - startTime;
        document.getElementById('elapsedTimer').textContent = (elapsedMs / 1000).toFixed(1) + 's';

        var aiL = elapsedMs * AI_WATER_PER_MS;
        var cattleL = elapsedMs * CATTLE_WATER_PER_MS;
        var golfL = elapsedMs * GOLF_WATER_PER_MS;
        var cottonL = elapsedMs * COTTON_WATER_PER_MS;

        document.getElementById('valAiWater').textContent = formatLiters(aiL);
        document.getElementById('valCattleWater').textContent = formatLiters(cattleL);
        document.getElementById('valGolfWater').textContent = formatLiters(golfL);
        document.getElementById('valCottonWater').textContent = formatLiters(cottonL);

        requestAnimationFrame(updateLiveTickers);
      }

      function formatLiters(liters) {
        if (liters >= 1000000000) return (liters / 1000000000).toFixed(2) + ' Billion L';
        if (liters >= 1000000) return (liters / 1000000).toFixed(2) + ' Million L';
        if (liters >= 1000) return (liters / 1000).toFixed(1) + ' kL';
        return liters.toFixed(1) + ' L';
      }

      function calcPersonalFootprint() {
        var prompts = parseFloat(document.getElementById('userPrompts').value) || 0;
        var unit = document.getElementById('waterUnit').value;

        var dailyL = prompts * 0.019;
        var annualL = dailyL * 365;

        var conv = function(l) {
          if (unit === 'gal') return (l * 0.264172).toFixed(2) + ' gal';
          if (unit === 'bottles') return (l / 0.5).toFixed(1) + ' bottles';
          return l.toFixed(2) + ' L';
        };

        var burgerEquiv = (annualL / 1750).toFixed(3);
        var showerEquiv = (annualL / 65).toFixed(2);

        document.getElementById('personalFootprintResults').innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="font-size: 0.75rem; color: var(--text-muted);">DAILY AI WATER USAGE</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: #3b82f6;">' + conv(dailyL) + '</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="font-size: 0.75rem; color: var(--text-muted);">ANNUAL AI WATER FOOTPRINT</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">' + conv(annualL) + ' / year</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="font-size: 0.75rem; color: var(--text-muted);">EQUAL TO BURGERS</span>' +
            '<div style="font-size: 1.1rem; font-weight: bold; color: #ef4444;">' + burgerEquiv + ' Burgers</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="font-size: 0.75rem; color: var(--text-muted);">EQUAL TO SHOWERS</span>' +
            '<div style="font-size: 1.1rem; font-weight: bold; color: #22c55e;">' + showerEquiv + ' Showers</div>' +
          '</div>';
      }

      function copyAiWaterAudit() {
        var p = document.getElementById('userPrompts').value;
        var text = '=== AI DATA CENTER WATER & ENERGY AUDIT ===\n' +
          'Daily Prompts Analyzed: ' + p + ' prompts/day\n' +
          'Estimated Per-Prompt Water Usage: ~19 ml (0.019 L)\n' +
          'Annual Consumption: ' + (p * 0.019 * 365).toFixed(2) + ' Liters/year\n\n' +
          'COMPARATIVE CONTEXT:\n' +
          '1 Cup of Coffee = 140 Liters (~7,368 ChatGPT prompts)\n' +
          '1 Beef Burger = 1,750 Liters (~92,105 ChatGPT prompts)\n' +
          'Most AI water consumption occurs through off-site power generation rather than direct on-site evaporation.';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyAiWaterBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied AI Water Audit!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }

      calcPersonalFootprint();
      updateLiveTickers();
    </script>
  `;

  writeFileSync(join(calcDir, 'ai-water-calculator.html'), renderViralPage({
    title: "How Much Water Does AI Use? Live Real-Time Reality Checker | Digital Tools Shed",
    metaDesc: "Interactive live ticker comparing AI water consumption (ChatGPT, Claude, LLMs) vs cattle, golf courses, and coffee with personal footprint calculator.",
    canonical: `${DOMAIN}/calc/ai-water-calculator`,
    bodyContent: aiWaterHtml,
    currentPath: '/calc/ai-water-calculator',
    faq: [
      {
        q: "Why do AI data centers require water for operation?",
        a: "High-density GPU clusters (such as Nvidia H100s) generate intense thermal heat. To prevent hardware throttling, evaporative cooling towers circulate chilled water to dissipate heat into the atmosphere."
      },
      {
        q: "How much water does a single ChatGPT prompt consume?",
        a: "According to research from UC Riverside, a typical 20-50 prompt exchange consumes approximately 500 milliliters (one standard water bottle), averaging between 10 and 25 milliliters per individual text prompt."
      },
      {
        q: "What is the difference between Scope 1 and Scope 2 water usage?",
        a: "Scope 1 refers to direct on-site water evaporated in cooling towers at the data center. Scope 2 refers to indirect water consumed off-site at thermoelectric power plants (coal, nuclear, natural gas) generating the electricity to power the servers."
      },
      {
        q: "How does AI water usage compare to global agriculture?",
        a: "Global livestock agriculture consumes approximately 58 million liters of freshwater every second, which is over 160,000 times greater than global AI data center consumption."
      },
      {
        q: "Can data centers transition to water-free cooling systems?",
        a: "Yes. Many hyperscalers are transitioning to direct-to-chip liquid cooling with closed-loop radiators, submerged dielectric fluid tanks, and air-cooled heat exchangers that eliminate evaporative water loss entirely."
      }
    ]
  }));

  // 2. GRAPHING CALCULATOR (DESMOS CLONE)
  const graphHtml = `
    <div class="article-container" style="max-width: 1100px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/math/">Math Tools</a> &gt; Graphing Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem;">Free 2D Graphing Calculator (Desmos Alternative)</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Plot multiple algebraic and trigonometric equations, find intersections, explore polynomial roots, and compute slopes with zero page reloads or external math CDNs.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin: 0;">Function Inputs</h3>
          <div>
            <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--mono); font-size: 0.85rem; margin-bottom: 0.25rem;">
              <span style="color: #3b82f6; font-weight: bold;">f(x) =</span>
            </label>
            <input type="text" id="fn1" value="sin(x)" class="search-input" style="width: 100%; padding: 0.4rem 0.6rem; font-family: var(--mono); font-size: 0.9rem;" oninput="renderGraph()" />
          </div>
          <div>
            <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--mono); font-size: 0.85rem; margin-bottom: 0.25rem;">
              <span style="color: #ef4444; font-weight: bold;">g(x) =</span>
            </label>
            <input type="text" id="fn2" value="0.2 * x^2 - 3" class="search-input" style="width: 100%; padding: 0.4rem 0.6rem; font-family: var(--mono); font-size: 0.9rem;" oninput="renderGraph()" />
          </div>
          <div>
            <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--mono); font-size: 0.85rem; margin-bottom: 0.25rem;">
              <span style="color: #22c55e; font-weight: bold;">h(x) =</span>
            </label>
            <input type="text" id="fn3" value="cos(2 * x)" class="search-input" style="width: 100%; padding: 0.4rem 0.6rem; font-family: var(--mono); font-size: 0.9rem;" oninput="renderGraph()" />
          </div>
          <div>
            <h4 style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin: 0.5rem 0 0.25rem;">Preset Curves</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              <button onclick="setPreset('sin(x)', 'cos(x)', '')" class="btn-secondary" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Sine/Cosine</button>
              <button onclick="setPreset('x^3 - 3*x', '3*x^2 - 3', '')" class="btn-secondary" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Cubic + Deriv</button>
              <button onclick="setPreset('exp(-x^2)', '', '')" class="btn-secondary" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Bell Curve</button>
              <button onclick="setPreset('1 / x', 'tan(x)', '')" class="btn-secondary" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Rational</button>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; margin-top: auto;">
            <button onclick="zoom(0.8)" class="btn-secondary" style="flex: 1; padding: 0.4rem; font-size: 0.85rem;">Zoom +</button>
            <button onclick="zoom(1.25)" class="btn-secondary" style="flex: 1; padding: 0.4rem; font-size: 0.85rem;">Zoom -</button>
            <button onclick="resetView()" class="btn-secondary" style="flex: 1; padding: 0.4rem; font-size: 0.85rem;">Reset</button>
          </div>
          <div style="margin-top: 0.5rem;">
            <button onclick="copyGraphState()" id="copyGraphBtn" class="btn-primary" style="width: 100%; padding: 0.45rem; font-size: 0.8rem; cursor: pointer;">📋 Copy Equations</button>
          </div>
        </div>
        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; position: relative;">
          <div style="position: absolute; top: 1.5rem; right: 1.5rem; font-family: var(--mono); font-size: 0.8rem; background: rgba(0,0,0,0.6); color: #fff; padding: 0.2rem 0.6rem; border-radius: 4px;" id="coordHUD">x: 0.00, y: 0.00</div>
          <canvas id="graphCanvas" width="700" height="500" style="width: 100%; height: 500px; cursor: grab; background: #0f172a; border-radius: 4px;"></canvas>
        </div>
      </div>

      <!-- MATHEMATICAL FOUNDATIONS OF 2D GRAPHING -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Mathematical Foundations of 2D Function Plotting</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          In-browser canvas graphing transforms continuous mathematical functions into pixel coordinate space via affine linear mapping:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.25rem;">
          1. Viewport Coordinate Mapping:<br>
          &nbsp;&nbsp;&nbsp;x_{pixel} = Origin_x + (x_{math} &times; Scale)<br>
          &nbsp;&nbsp;&nbsp;y_{pixel} = Origin_y - (y_{math} &times; Scale) (Inverted Y-axis in 2D Canvas)<br><br>
          2. Inverse Screen-to-World Transform (Mouse Pointer):<br>
          &nbsp;&nbsp;&nbsp;x_{math} = (x_{pixel} - Origin_x) / Scale<br>
          &nbsp;&nbsp;&nbsp;y_{math} = -(y_{pixel} - Origin_y) / Scale<br><br>
          3. Numerical Continuity & Discretization:<br>
          &nbsp;&nbsp;&nbsp;Sampling interval &Delta;x = 2 / Scale pixels. Discontinuities (&plusmn;&infin;) are detected by evaluating finite bounds.
        </div>
      </div>

      <!-- FATAL TRAPS & GRAPHING PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Graphing & Mathematical Plotting Pitfalls</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Vertical Asymptote Interpolation Artifact</strong>
          Connecting sampled points across poles (such as $f(x) = 1/x$ or $	an(x)$). Naive plotters draw a false vertical connecting line between $+infty$ and $-infty$, creating a misleading line across asymptotes.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. Nyquist Aliasing on High-Frequency Waves</strong>
          Plotting high-frequency functions like $sin(100x)$ with fixed 2-pixel steps. When the sampling frequency drops below the Nyquist limit, the canvas renders bizarre pseudo-waves that have no mathematical reality.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. Floating-Point Subtraction Cancellation</strong>
          Evaluating expressions like $sqrt{x^2+1} - x$ for large $x$. IEEE-754 floating-point numbers lose precision due to catastrophic cancellation, causing smooth analytical curves to break into jagged stepped noise.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. Non-Isometric Aspect Ratio Distortion</strong>
          Plotting functions with unequal horizontal and vertical pixel scales. When scaling is non-uniform, circles ($x^2+y^2=r^2$) distort into ovals and perpendicular lines ($m_1 cdot m_2 = -1$) fail to appear orthogonal.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. Undefined Domain NaN Propagation</strong>
          Evaluating functions outside their real domain (e.g. $log(x)$ or $sqrt{x}$ for $x le 0$) without boundary checking, which silently aborts the active path stroke in HTML5 Canvas.
        </div>
      </div>
    </div>

    <script>
      var canvas = document.getElementById('graphCanvas');
      var ctx = canvas.getContext('2d');
      var scale = 40;
      var originX = canvas.width / 2;
      var originY = canvas.height / 2;
      var isDragging = false;
      var lastX = 0, lastY = 0;

      canvas.addEventListener('mousedown', function(e) {
        isDragging = true; lastX = e.clientX; lastY = e.clientY; canvas.style.cursor = 'grabbing';
      });
      window.addEventListener('mouseup', function() { isDragging = false; canvas.style.cursor = 'grab'; });
      canvas.addEventListener('mousemove', function(e) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        var mathX = (mouseX - originX) / scale;
        var mathY = -(mouseY - originY) / scale;
        document.getElementById('coordHUD').textContent = 'x: ' + mathX.toFixed(2) + ', y: ' + mathY.toFixed(2);
        if (isDragging) {
          originX += e.clientX - lastX;
          originY += e.clientY - lastY;
          lastX = e.clientX;
          lastY = e.clientY;
          renderGraph();
        }
      });
      canvas.addEventListener('wheel', function(e) {
        e.preventDefault();
        scale *= (e.deltaY < 0 ? 1.1 : 0.9);
        renderGraph();
      });
      function zoom(f) { scale /= f; renderGraph(); }
      function resetView() { scale = 40; originX = canvas.width / 2; originY = canvas.height / 2; renderGraph(); }
      function setPreset(f1, f2, f3) {
        document.getElementById('fn1').value = f1;
        document.getElementById('fn2').value = f2;
        document.getElementById('fn3').value = f3;
        renderGraph();
      }
      function compileFn(expr) {
        if (!expr || !expr.trim()) return null;
        try {
          var js = expr
            .replace(/\^/g, '**')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/abs/g, 'Math.abs')
            .replace(/log/g, 'Math.log10')
            .replace(/ln/g, 'Math.log')
            .replace(/exp/g, 'Math.exp')
            .replace(/pi/g, 'Math.PI')
            .replace(/e/g, 'Math.E');
          return new Function('x', 'return ' + js + ';');
        } catch(e) { return null; }
      }
      function renderGraph() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
        var step = scale >= 80 ? scale / 2 : (scale <= 20 ? scale * 2 : scale);
        for (var x = originX % step; x < canvas.width; x += step) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (var y = originY % step; y < canvas.height; y += step) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }
        ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(0, originY); ctx.lineTo(canvas.width, originY);
        ctx.moveTo(originX, 0); ctx.lineTo(originX, canvas.height);
        ctx.stroke();

        plot(compileFn(document.getElementById('fn1').value), '#3b82f6');
        plot(compileFn(document.getElementById('fn2').value), '#ef4444');
        plot(compileFn(document.getElementById('fn3').value), '#22c55e');
      }
      function plot(fn, color) {
        if (!fn) return;
        ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.beginPath();
        var first = true;
        for (var px = 0; px < canvas.width; px += 2) {
          var mathX = (px - originX) / scale;
          try {
            var mathY = fn(mathX);
            if (!isNaN(mathY) && isFinite(mathY)) {
              var py = originY - mathY * scale;
              if (first) { ctx.moveTo(px, py); first = false; } else { ctx.lineTo(px, py); }
            } else { first = true; }
          } catch(e) { first = true; }
        }
        ctx.stroke();
      }

      function copyGraphState() {
        var f1 = document.getElementById('fn1').value;
        var f2 = document.getElementById('fn2').value;
        var f3 = document.getElementById('fn3').value;
        var text = '=== 2D GRAPHING CALCULATOR EQUATIONS ===\n' +
          'f(x) = ' + f1 + '\n' +
          'g(x) = ' + f2 + '\n' +
          'h(x) = ' + f3 + '\n\n' +
          'Scale: ' + scale.toFixed(1) + ' px/unit\n' +
          'Origin: (' + originX.toFixed(1) + ', ' + originY.toFixed(1) + ')';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyGraphBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied Equations!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }

      renderGraph();
    </script>
  `;

  writeFileSync(join(mathDir, 'graphing-calculator.html'), renderViralPage({
    title: "Free 2D Graphing Calculator Online (Desmos Alternative) | Digital Tools Shed",
    metaDesc: "Interactive in-browser 2D graphing calculator: plot math functions, derivatives, trigonometric curves, and polynomials in real-time.",
    canonical: `${DOMAIN}/math/graphing-calculator`,
    bodyContent: graphHtml,
    currentPath: '/math/graphing-calculator',
    faq: [
      {
        q: "What mathematical functions does this graphing calculator support?",
        a: "It supports standard algebraic operations (+, -, *, /, ^), trigonometric functions (sin, cos, tan), logarithmic functions (log, ln), square roots (sqrt), absolute values (abs), exponentials (exp), and constants like pi and e."
      },
      {
        q: "How does this graphing calculator differ from Desmos or GeoGebra?",
        a: "Unlike heavy proprietary platforms that load megabytes of remote scripts and telemetry, this tool executes 100% in your local browser using pure HTML5 Canvas, rendering in sub-10ms with zero server latency."
      },
      {
        q: "How do I plot trigonometric curves like sine and cosine?",
        a: "Simply type sin(x) or cos(x) into any function input box. The calculator automatically uses radians for all angle arguments in compliance with standard calculus conventions."
      },
      {
        q: "How can I pan and zoom the coordinate grid?",
        a: "Click and drag anywhere on the canvas to pan the origin. Use your mouse scroll wheel or click the Zoom + and Zoom - buttons to scale the view."
      },
      {
        q: "Can I graph derivatives alongside a parent polynomial?",
        a: "Yes. Click the 'Cubic + Deriv' preset to plot f(x) = x^3 - 3x alongside its first derivative g(x) = 3x^2 - 3, allowing visual verification of local extrema and critical points."
      }
    ]
  }));

  // 3. SCALE VISUALIZER
  const scaleHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Scale & Speed Visualizer
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Million vs. Billion vs. Trillion Scale Visualizer</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Human intuition fails at scale. Interact with time, height, and speed comparisons to truly understand the astronomical difference between 1 million, 1 billion, and 1 trillion.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1rem;">Select Magnitude Scale</h3>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <button onclick="setScale(1000)" id="btn1k" class="btn-secondary">1 Thousand (1,000)</button>
          <button onclick="setScale(1000000)" id="btn1m" class="btn-secondary">1 Million (1,000,000)</button>
          <button onclick="setScale(1000000000)" id="btn1b" class="btn-primary">1 Billion (1,000,000,000)</button>
          <button onclick="setScale(1000000000000)" id="btn1t" class="btn-secondary">1 Trillion (1,000,000,000,000)</button>
        </div>

        <div id="scaleResults" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;"></div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button onclick="copyScaleSummary()" id="copyScaleBtn" class="btn-primary" style="padding: 0.6rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">📋 Copy Scale Comparison Summary</button>
        </div>
      </div>

      <!-- COGNITIVE & DIMENSIONAL DERIVATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Logarithmic Scaling & Weber-Fechner Neurological Distortion</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          The human nervous system maps numerical quantities logarithmically rather than linearly to compress massive dynamic sensory ranges:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.25rem;">
          1. Weber-Fechner Psychophysical Law:<br>
          &nbsp;&nbsp;&nbsp;Perceived_Magnitude S = k &times; ln(I / I_0)<br>
          &nbsp;&nbsp;&nbsp;Because perception scales with the logarithm of physical stimulus, $1,000,000,000 feels only slightly larger than $1,000,000 to uncalibrated intuition.<br><br>
          2. Physical Temporal Conversion:<br>
          &nbsp;&nbsp;&nbsp;&bull; 10^3 seconds = 16.67 minutes<br>
          &nbsp;&nbsp;&nbsp;&bull; 10^6 seconds = 11.57 days<br>
          &nbsp;&nbsp;&nbsp;&bull; 10^9 seconds = 31.69 years (1,000&times; greater than 1 million seconds)<br>
          &nbsp;&nbsp;&nbsp;&bull; 10^{12} seconds = 31,688 years (Recorded civilization is only ~6,000 years old).<br><br>
          3. Physical Paper Stride (Thickness &approx; 0.0043 inches per bill):<br>
          &nbsp;&nbsp;&nbsp;Height(1T in $100s) = (10^{10} bills &times; 0.0043 in) / (12 &times; 5280) &approx; 67.86 miles high into the thermosphere.
        </div>
      </div>

      <!-- FATAL TRAPS & COGNITIVE SCALE PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Fallacies in Human Numerical Scale Perception</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Linear Scale Illusion</strong>
          Intuitively treating a billion as "a few times larger" than a million. The difference between 1 million and 1 billion is virtually the entire billion (999 million). A million seconds is 1.5 weeks; a billion seconds is nearly 32 years.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The Cubic Volume Expansion Blindspot</strong>
          Forgetting the square-cube law. If you double the linear dimension of a cube, its surface area quadruples ($2^2$) and its volume and weight octuple ($2^3$). Scaling wealth or physical structures creates exponential volume explosions.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Temporal Equivalence Error</strong>
          Conflating 10,000 years with 10 million years in evolutionary biology or climate discussions. Human recorded history spans 5,000 years; 1 million years ago, Homo sapiens did not even exist.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The National Budget / Household Budget Analogy Fallacy</strong>
          Treating a $34 trillion sovereign national balance sheet like a family credit card. Sovereign currency-issuing governments operate under macroeconomic monetary velocity and intergenerational bond yields that cannot be modeled as household debt.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The "Too Big to Matter" Apathy Trap</strong>
          When numbers exceed billions, psychological numbing sets in. People care intensely about a $50 fee, but become indifferent to a $50 billion municipal bond project because both exceed sensory comprehension.
        </div>
      </div>
    </div>

    <script>
      var currentScaleNum = 1000000000;

      function setScale(num) {
        currentScaleNum = num;
        document.querySelectorAll("#btn1k, #btn1m, #btn1b, #btn1t").forEach(function(b) {
          b.className = "btn-secondary";
        });
        if (num === 1000) document.getElementById("btn1k").className = "btn-primary";
        if (num === 1000000) document.getElementById("btn1m").className = "btn-primary";
        if (num === 1000000000) document.getElementById("btn1b").className = "btn-primary";
        if (num === 1000000000000) document.getElementById("btn1t").className = "btn-primary";

        var seconds = num;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;
        var years = days / 365.25;

        var timeStr = "";
        if (years >= 1) timeStr = years.toLocaleString(undefined, {maximumFractionDigits: 1}) + " Years";
        else if (days >= 1) timeStr = days.toFixed(1) + " Days";
        else if (hours >= 1) timeStr = hours.toFixed(1) + " Hours";
        else timeStr = minutes.toFixed(1) + " Minutes";

        var heightMiles = (num * 0.0043) / 12 / 5280;
        var heightStr = heightMiles >= 1 ? heightMiles.toFixed(1) + " Miles high" : (heightMiles * 5280).toFixed(0) + " Feet high";

        document.getElementById("scaleResults").innerHTML = 
          '<div style="padding: 1rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px;">' +
            '<span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">In Seconds of Time</span>' +
            '<div style="font-size: 1.4rem; font-weight: bold; color: #3b82f6; margin-top: 0.25rem;">' + timeStr + '</div>' +
            '<div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem;">1M sec = 11.5 days | 1B sec = 31.7 years | 1T sec = 31,709 years</div>' +
          '</div>' +
          '<div style="padding: 1rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px;">' +
            '<span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">In $100 Dollar Bills Stack</span>' +
            '<div style="font-size: 1.4rem; font-weight: bold; color: #22c55e; margin-top: 0.25rem;">' + heightStr + '</div>' +
            '<div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem;">1B in $100s = 43 miles high into the stratosphere</div>' +
          '</div>' +
          '<div style="padding: 1rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px;">' +
            '<span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">GPU AI Tokens / Words</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: #ef4444; margin-top: 0.25rem;">' + (num / 1000000).toLocaleString() + 'M Tokens</div>' +
            '<div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem;">At 100 tokens/sec = ' + (num / 100 / 3600).toFixed(1) + ' hours of continuous reading</div>' +
          '</div>';
      }

      function copyScaleSummary() {
        var num = currentScaleNum;
        var name = num === 1000 ? '1 Thousand' : (num === 1000000 ? '1 Million' : (num === 1000000000 ? '1 Billion' : '1 Trillion'));
        var text = '=== SCALE & MAGNITUDE PERSPECTIVE REPORT ===\n' +
          'Selected Number: ' + name + ' (' + num.toLocaleString() + ')\n\n' +
          'TEMPORAL EQUIVALENCE:\n' +
          '  - 1,000 Seconds = 16.7 Minutes\n' +
          '  - 1,000,000 Seconds = 11.6 Days\n' +
          '  - 1,000,000,000 Seconds = 31.7 Years\n' +
          '  - 1,000,000,000,000 Seconds = 31,709 Years (5x recorded civilization)\n\n' +
          'PHYSICAL BILLS STACK:\n' +
          'A stack of ' + name + ' in $100 bills would reach ' + ((num * 0.0043)/12/5280).toFixed(1) + ' miles into the atmosphere.';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyScaleBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied Scale Summary!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }

      setScale(1000000000);
    </script>
  `;

  writeFileSync(join(utilDir, 'scale-visualizer.html'), renderViralPage({
    title: "Million vs Billion vs Trillion Number & Speed Scale Visualizer | Digital Tools Shed",
    metaDesc: "Interactive scale visualizer comparing 1 million, 1 billion, and 1 trillion in time, height, and computing tokens.",
    canonical: `${DOMAIN}/util/scale-visualizer`,
    bodyContent: scaleHtml,
    currentPath: '/util/scale-visualizer',
    faq: [
      {
        q: "What is the simplest way to visualize the difference between a million and a billion?",
        a: "Use seconds of time: 1 million seconds is approximately 11.5 days. 1 billion seconds is approximately 31.7 years. The difference between 1 million and 1 billion is almost an entire human lifetime."
      },
      {
        q: "How high would a stack of one billion dollars reach?",
        a: "A standard US banknote is approximately 0.0043 inches thick. A stack of 10 million $100 bills (equaling $1 billion) would stand approximately 43 miles (69 kilometers) high, penetrating well into the mesosphere."
      },
      {
        q: "How long is one trillion seconds in human history?",
        a: "One trillion seconds equals 31,709 years. Thirty-one thousand years ago, Neanderthals had only recently gone extinct and modern humans were creating the Chauvet cave paintings during the Upper Paleolithic."
      },
      {
        q: "Why does the human brain struggle with numbers larger than a few thousand?",
        a: "Evolutionary psychology reveals that human ancestors rarely had survival need to count beyond a few hundred tribal members or animals. Neurologically, humans perceive quantities logarithmically via the Weber-Fechner law rather than linearly."
      },
      {
        q: "How many tokens is one billion tokens in generative AI models?",
        a: "One billion tokens is approximately 750 million English words, which is equivalent to reading the complete Harry Potter series 700 times consecutively."
      }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 4. THE DRAKE EQUATION & FERMI PARADOX ALIEN CALCULATOR (/util/fermi-paradox-calculator.html)
  // ──────────────────────────────────────────────────────────────────────────
  const fermiHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Fermi Paradox Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #a855f7; margin-bottom: 0.5rem;">2 AM Cosmic Rabbit Hole</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">The Drake Equation & Fermi Paradox Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          If intelligent life is likely, <em>"Where is everybody?"</em> Calculate the number of communicating extraterrestrial civilizations in the Milky Way right now, and how far away the closest one is.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <span style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); align-self: center;">Model Presets:</span>
          <button type="button" class="btn-sm" onclick="setDrakePreset('sagan')" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.35rem 0.75rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">Carl Sagan (Optimistic)</button>
          <button type="button" class="btn-sm" onclick="setDrakePreset('rare_earth')" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.35rem 0.75rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">Rare Earth (Pessimistic)</button>
          <button type="button" class="btn-sm" onclick="setDrakePreset('seti')" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.35rem 0.75rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">Standard SETI Baseline</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">R* (Star Formation Rate / yr)</label>
            <input type="number" id="dr-r" value="2.0" step="0.5" min="0.1" class="search-input" style="width: 100%; padding: 0.45rem;" oninput="calcDrake()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">fp (Fraction with Planets: 0 to 1)</label>
            <input type="number" id="dr-fp" value="0.9" step="0.05" min="0.01" max="1" class="search-input" style="width: 100%; padding: 0.45rem;" oninput="calcDrake()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">ne (Habitable Planets per System)</label>
            <input type="number" id="dr-ne" value="0.4" step="0.1" min="0.01" class="search-input" style="width: 100%; padding: 0.45rem;" oninput="calcDrake()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">fl (Fraction Where Life Begins: 0 to 1)</label>
            <input type="number" id="dr-fl" value="0.2" step="0.05" min="0.0001" max="1" class="search-input" style="width: 100%; padding: 0.45rem;" oninput="calcDrake()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">fi (Fraction Becoming Intelligent: 0 to 1)</label>
            <input type="number" id="dr-fi" value="0.1" step="0.02" min="0.0001" max="1" class="search-input" style="width: 100%; padding: 0.45rem;" oninput="calcDrake()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">fc (Fraction with Detectable Signals)</label>
            <input type="number" id="dr-fc" value="0.1" step="0.02" min="0.0001" max="1" class="search-input" style="width: 100%; padding: 0.45rem;" oninput="calcDrake()" />
          </div>
          <div style="grid-column: 1 / -1;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">L (Lifespan of Communicating Civilization in Years)</label>
            <input type="number" id="dr-L" value="10000" step="500" min="10" class="search-input" style="width: 100%; padding: 0.5rem; font-size: 1.1rem; font-family: var(--mono);" oninput="calcDrake()" />
          </div>
        </div>
      </div>

      <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Active Civilizations (N)</span>
            <div id="drResultN" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #a855f7; margin: 0.25rem 0;">144</div>
            <div id="drDescN" style="font-size: 0.8rem; color: var(--text-muted);">Transmitting radio/tech signals in Milky Way</div>
          </div>

          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Est. Distance to Nearest Neighbor</span>
            <div id="drResultDist" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">3,850 LY</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Light-years away across the galactic disk</div>
          </div>

          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">The Great Filter Location</span>
            <div id="drResultFilter" style="font-family: var(--mono); font-size: 1.5rem; font-weight: bold; color: #10b981; margin: 0.5rem 0;">Behind Us?</div>
            <div id="drDescFilter" style="font-size: 0.8rem; color: var(--text-muted);">Where the statistical bottleneck lies</div>
          </div>
        </div>

        <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button onclick="copyDrakeCalc()" id="copyDrakeCalcBtn" class="btn-primary" style="padding: 0.6rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">📋 Copy Drake Equation Calculation</button>
        </div>
      </div>

      <!-- MATHEMATICAL & ASTROPHYSICAL DERIVATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Astrophysical & Mathematical Derivation: The Drake Equation</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          Formulated by radio astronomer Frank Drake at Green Bank Observatory in 1961, the equation multiplies seven sequential conditional astrophysical and evolutionary probabilities:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.25rem;">
          1. Number of Communicating Civilizations (N):<br>
          &nbsp;&nbsp;&nbsp;N = R_* &times; f_p &times; n_e &times; f_l &times; f_i &times; f_c &times; L<br><br>
          2. Mean Distance to Nearest Neighbor (Galactic Disk Cylinder Model):<br>
          &nbsp;&nbsp;&nbsp;V_{disk} &approx; &pi; &times; R_{MW}^2 &times; h_{MW} &approx; &pi; &times; (50,000 ly)^2 &times; 1,000 ly &approx; 7.85 &times; 10^{12} ly^3<br>
          &nbsp;&nbsp;&nbsp;d_{neighbor} &approx; (V_{disk} / N)^{1/3} light-years<br><br>
          3. Robin Hanson's Great Filter Formulation:<br>
          &nbsp;&nbsp;&nbsp;P_{civilization} = &prod;_{k=1}^9 p_k (From abiogenesis & eukaryotic cells to intergalactic colonizers).<br>
          &nbsp;&nbsp;&nbsp;If N &approx; 1, abiogenesis or intelligence is an astronomical near-impossibility. If N &gt;&gt; 1, the filter looms in our existential future (extinction).
        </div>
      </div>

      <!-- FATAL TRAPS & ASTROBIOLOGICAL PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Fallacies in Extraterrestrial Search & The Fermi Paradox</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Unbounded Guess Multiplication Trap</strong>
          Treating the Drake Equation as an exact scientific prediction rather than a taxonomy of ignorance. Multiplying seven speculative subjective estimates can produce any arbitrary answer from $10^{-12}$ to $10^9$.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. Temporal Synchronization Myopia</strong>
          Forgetting that the Milky Way is 13.6 billion years old. Two advanced technological civilizations with $L = 10,000$ years could easily exist in the same star cluster, yet miss each other by 500 million years.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Radio Emission Era Illusion</strong>
          Assuming advanced species leak detectable omnidirectional electromagnetic radio signals for millennia. Human civilization leaked powerful broadcast radio for barely 70 years before transitioning to directed fiber, digital compression, and laser satellites.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The Dark Forest Communication Blindspot</strong>
          Assuming that intelligent civilizations will voluntarily broadcast their spatial coordinates into deep space. Game-theoretic analysis demonstrates that concealing biosignatures is the minimax dominant strategy in an uncertain galaxy.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. Carbon-Water Biochemical Chauvinism</strong>
          Assuming extraterrestrial life must replicate Earth-like carbon and liquid-water biochemistry in narrow Goldilocks circumstellar zones, ignoring synthetic, post-biological, or cryogenic methane ecosystems.
        </div>
      </div>
    </div>

    <script>
      function calcDrake() {
        var r = parseFloat(document.getElementById('dr-r').value) || 0;
        var fp = parseFloat(document.getElementById('dr-fp').value) || 0;
        var ne = parseFloat(document.getElementById('dr-ne').value) || 0;
        var fl = parseFloat(document.getElementById('dr-fl').value) || 0;
        var fi = parseFloat(document.getElementById('dr-fi').value) || 0;
        var fc = parseFloat(document.getElementById('dr-fc').value) || 0;
        var L = parseFloat(document.getElementById('dr-L').value) || 0;

        var N = r * fp * ne * fl * fi * fc * L;
        var nRounded = Math.round(N);

        var nEl = document.getElementById('drResultN');
        var descEl = document.getElementById('drDescN');
        var distEl = document.getElementById('drResultDist');
        var filtEl = document.getElementById('drResultFilter');
        var filtDesc = document.getElementById('drDescFilter');

        if (nRounded <= 0) {
          nEl.textContent = '0 (We are Alone)';
          descEl.textContent = 'Statistical probability of other active civilizations is near-zero';
          distEl.textContent = '> 100,000 LY';
          filtEl.textContent = 'Behind Us';
          filtEl.style.color = '#10b981';
          filtDesc.textContent = 'Abiogenesis or intelligence is virtually impossible';
        } else if (nRounded === 1) {
          nEl.textContent = '1 (Just Humanity)';
          descEl.textContent = 'Earth is likely the solitary beacon in the galaxy';
          distEl.textContent = '> 50,000 LY';
          filtEl.textContent = 'Behind Us';
          filtEl.style.color = '#10b981';
          filtDesc.textContent = 'We passed the Great Filter early';
        } else {
          nEl.textContent = nRounded.toLocaleString();
          descEl.textContent = 'Active communicating civilizations in the Milky Way';

          var vGal = Math.PI * 50000 * 50000 * 1000;
          var d = Math.round(Math.pow(vGal / N, 1/3));
          distEl.textContent = d.toLocaleString() + ' LY';

          if (nRounded > 1000) {
            filtEl.textContent = 'Ahead of Us!';
            filtEl.style.color = '#ef4444';
            filtDesc.textContent = 'Life is common, but technological civilizations self-destruct quickly';
          } else {
            filtEl.textContent = 'Balanced';
            filtEl.style.color = '#f59e0b';
            filtDesc.textContent = 'Moderate filter distribution across biology and technology';
          }
        }
      }

      function setDrakePreset(type) {
        if (type === 'sagan') {
          document.getElementById('dr-r').value = 4.0;
          document.getElementById('dr-fp').value = 1.0;
          document.getElementById('dr-ne').value = 1.0;
          document.getElementById('dr-fl').value = 0.5;
          document.getElementById('dr-fi').value = 0.25;
          document.getElementById('dr-fc').value = 0.2;
          document.getElementById('dr-L').value = 100000;
        } else if (type === 'rare_earth') {
          document.getElementById('dr-r').value = 1.0;
          document.getElementById('dr-fp').value = 0.5;
          document.getElementById('dr-ne').value = 0.05;
          document.getElementById('dr-fl').value = 0.001;
          document.getElementById('dr-fi').value = 0.0001;
          document.getElementById('dr-fc').value = 0.01;
          document.getElementById('dr-L').value = 1000;
        } else {
          document.getElementById('dr-r').value = 2.0;
          document.getElementById('dr-fp').value = 0.9;
          document.getElementById('dr-ne').value = 0.4;
          document.getElementById('dr-fl').value = 0.2;
          document.getElementById('dr-fi').value = 0.1;
          document.getElementById('dr-fc').value = 0.1;
          document.getElementById('dr-L').value = 10000;
        }
        calcDrake();
      }

      function copyDrakeCalc() {
        var n = document.getElementById('drResultN').textContent;
        var dist = document.getElementById('drResultDist').textContent;
        var filt = document.getElementById('drResultFilter').textContent;
        var text = '=== DRAKE EQUATION & FERMI PARADOX CALCULATION ===\n' +
          'Active Communicating Civilizations in Milky Way: ' + n + '\n' +
          'Estimated Distance to Nearest Neighbor: ' + dist + '\n' +
          'Great Filter Status: ' + filt + '\n\n' +
          'KEY PARAMETERS:\n' +
          '  - Star Formation Rate R*: ' + document.getElementById('dr-r').value + ' /yr\n' +
          '  - Fraction with Planets fp: ' + document.getElementById('dr-fp').value + '\n' +
          '  - Habitable Planets ne: ' + document.getElementById('dr-ne').value + '\n' +
          '  - Civilization Longevity L: ' + document.getElementById('dr-L').value + ' years\n\n' +
          'COSMOLOGICAL IMPLICATION:\n' +
          'If intelligent life is abundant but silent, the Great Filter looms ahead as an existential extinction barrier.';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyDrakeCalcBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied Drake Equation Calculation!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }

      document.addEventListener('DOMContentLoaded', calcDrake);
    </script>
  `;

  writeFileSync(join(utilDir, 'fermi-paradox-calculator.html'), renderViralPage({
    title: "The Drake Equation & Fermi Paradox Calculator | Digital Tools Shed",
    metaDesc: "Calculate the probability of intelligent alien civilizations in the Milky Way using the Drake Equation. Estimates distance to nearest alien life and Great Filter odds.",
    canonical: `${DOMAIN}/util/fermi-paradox-calculator`,
    bodyContent: fermiHtml,
    currentPath: '/util/fermi-paradox-calculator',
    faq: [
      {
        q: "What is the Fermi Paradox and what did Enrico Fermi ask?",
        a: "During a 1950 lunchtime conversation at Los Alamos, physicist Enrico Fermi remarked on the vast age and number of stars in the galaxy, asking: 'Where is everybody?' If interstellar travel takes only a few million years, the galaxy should already be colonized."
      },
      {
        q: "What is the Drake Equation and who created it?",
        a: "Formulated by astronomer Frank Drake in 1961 for the first SETI conference, it multiplies astronomical, biological, and technological factors to estimate the number of communicative extraterrestrial civilizations in the Milky Way."
      },
      {
        q: "What is Robin Hanson's 'Great Filter' theory?",
        a: "Introduced in 1996, the Great Filter argues that there is an evolutionary barrier that is extremely difficult for life to surpass. If the filter lies behind us (e.g., abiogenesis is exceedingly rare), humanity is safe. If it lies ahead (e.g., nuclear war or synthetic biology), extinction awaits."
      },
      {
        q: "Why does civilization longevity (L) dominate the Drake Equation?",
        a: "Parameters like star formation and planetary occurrence are now empirically measured by Kepler. Civilization lifespan L varies from 100 years to billions of years, shifting the result from a solitary civilization to millions."
      },
      {
        q: "What is the Dark Forest hypothesis?",
        a: "Popularized by Liu Cixin's science fiction trilogy, the hypothesis applies game theory: since technological progress is exponential and intentions are unknowable, any detected civilization represents a mortal threat, compelling all civilizations to stay silent."
      }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 5. THE COSMIC CALENDAR: 13.8B YEARS IN 24 HOURS (/util/cosmic-calendar-calculator.html)
  // ──────────────────────────────────────────────────────────────────────────
  const cosmicHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Cosmic Calendar
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; margin-bottom: 0.5rem;">2 AM Time Scaler</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">The Cosmic Calendar: 13.8 Billion Years in 24 Hours</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Compress the entire 13.8-billion-year lifespan of the universe into a single 24-hour day. See where dinosaurs, the Roman Empire, and your entire life fit on the cosmic clock.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Selected Cosmic Time</div>
          <div id="cosmicClock" style="font-family: var(--mono); font-size: 3rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">23:59:59.89</div>
          <div id="cosmicDesc" style="font-size: 1.05rem; color: var(--fg); max-width: 600px; margin: 0.5rem auto 0;">Recorded human history begins (Pyramids, writing)</div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Explore Milestones Across The 24-Hour Day:</label>
          <select id="cosmicPreset" class="code-input" style="width: 100%; padding: 0.65rem; font-size: 1rem;" onchange="setCosmicPreset()">
            <option value="0">00:00:00 — The Big Bang (13.8 Billion Years Ago)</option>
            <option value="22500">06:15:00 — Milky Way Galaxy Forms (9.8 Billion Years Ago)</option>
            <option value="58080">16:08:00 — Solar System & Earth Form (4.5 Billion Years Ago)</option>
            <option value="63300">17:35:00 — First Microscopic Single-Cell Life (3.8 Billion Years Ago)</option>
            <option value="73680">20:28:00 — Photosynthesis & First Free Oxygen (2.1 Billion Years Ago)</option>
            <option value="84300">23:25:00 — First Dinosaurs Emerge (230 Million Years Ago)</option>
            <option value="85980">23:53:00 — Asteroid Hits Earth, Dinosaurs Extinct (66 Million Years Ago)</option>
            <option value="86386">23:59:46 — Anatomically Modern Humans Appear (200,000 Years Ago)</option>
            <option value="86399.89" selected>23:59:59.89 — Invention of Agriculture & Pyramids (5,000 Years Ago)</option>
            <option value="86399.999">23:59:59.999 — The Moon Landing & Modern Internet (50 Years Ago)</option>
          </select>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; margin-bottom: 1.25rem;">
          <h4 style="font-family: var(--serif); font-size: 1.1rem; margin-bottom: 0.75rem;">Your Life Duration on the Cosmic Clock</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; font-family: var(--mono); font-size: 0.9rem;">
            <div>
              <span style="color: var(--text-muted); font-size: 0.75rem;">AN 80-YEAR HUMAN LIFESPAN</span>
              <div style="font-size: 1.4rem; font-weight: bold; color: #10b981;">0.0005 Seconds</div>
            </div>
            <div>
              <span style="color: var(--text-muted); font-size: 0.75rem;">1 COSMIC SECOND EQUALS</span>
              <div style="font-size: 1.4rem; font-weight: bold; color: #3b82f6;">159,722 Years</div>
            </div>
            <div>
              <span style="color: var(--text-muted); font-size: 0.75rem;">1 COSMIC HOUR EQUALS</span>
              <div style="font-size: 1.4rem; font-weight: bold; color: #a855f7;">575 Million Years</div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button onclick="copyCosmicMilestone()" id="copyCosmicMilestoneBtn" class="btn-primary" style="padding: 0.6rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">📋 Copy Cosmic Milestone Summary</button>
        </div>
      </div>

      <!-- TEMPORAL & MATHEMATICAL DERIVATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Chronological Scaling & Unit Derivation</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          The 24-hour Cosmic Clock compresses $13.8 	imes 10^9$ solar years into 86,400 seconds:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.25rem;">
          1. Exact Second Scaling Factor (&sigma;):<br>
          &nbsp;&nbsp;&nbsp;&sigma; = 13,800,000,000 years / 86,400 seconds &approx; 159,722.22 years per cosmic second.<br><br>
          2. Exact Hour Scaling Factor (&theta;):<br>
          &nbsp;&nbsp;&nbsp;&theta; = 13,800,000,000 years / 24 hours &approx; 575,000,000 years per cosmic hour.<br><br>
          3. Recorded History on the Clock:<br>
          &nbsp;&nbsp;&nbsp;All recorded human civilization (~5,000 years) = 5,000 / 159,722 &approx; 0.031 seconds.<br><br>
          4. Individual Biological Lifespan (80 Years):<br>
          &nbsp;&nbsp;&nbsp;T_{human} = 80 / 159,722.22 &approx; 0.0005008 cosmic seconds (&approx; 0.5 milliseconds).
        </div>
      </div>

      <!-- FATAL TRAPS & TEMPORAL ILLUSIONS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Fallacies in Deep Time & Evolutionary Scaling</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Pre-Cambrian Compression Illusion</strong>
          Assuming that complex animal life existed for most of Earth's history. Earth formed at 4:08 PM, but multi-cellular macroscopic animals didn't emerge until 9:05 PM—more than 75% of Earth's timeline was purely microscopic sludge.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The Teleological Summit Delusion</strong>
          Viewing the cosmic clock as a purposeful countdown culminating in modern humans. Dinosaurs inhabited the Earth for over 45 cosmic minutes; humans have been here for less than 1.5 minutes.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Linear Uniformity Error</strong>
          Imagining that geological changes occur at a steady, gentle linear pace. Deep time is punctuated by catastrophic epochal phase shifts: snowball Earth glaciations, supervolcanic eruptions, and asteroid impacts.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The "Brevity Equals Futility" Nihilism</strong>
          Concluding that because human existence occupies half a millisecond on the 24-hour clock, human ethics and art are pointless. Meaning is an emergent property of consciousness, not spatial volume or physical duration.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The Finished Universe Illusion</strong>
          Thinking that 23:59:59 means the universe is nearing its end. In reality, the universe is in its early infancy: the Stelliferous Era will last another 100 trillion years, equivalent to thousands more cosmic calendar years.
        </div>
      </div>
    </div>

    <script>
      function setCosmicPreset() {
        var sel = document.getElementById('cosmicPreset');
        var text = sel.options[sel.selectedIndex].text;
        var parts = text.split(' — ');
        document.getElementById('cosmicClock').textContent = parts[0];
        document.getElementById('cosmicDesc').textContent = parts[1] || '';
      }

      function copyCosmicMilestone() {
        var time = document.getElementById('cosmicClock').textContent;
        var desc = document.getElementById('cosmicDesc').textContent;
        var text = '=== CARLE SAGAN COSMIC CALENDAR REPORT ===\n' +
          'Selected 24-Hour Time: ' + time + '\n' +
          'Historical Milestone: ' + desc + '\n\n' +
          'TEMPORAL CONVERSIONS:\n' +
          '  - 1 Cosmic Second = 159,722 Earth Years\n' +
          '  - 1 Cosmic Hour = 575 Million Years\n' +
          '  - 80-Year Human Lifespan = 0.0005 Seconds (0.5 ms)\n' +
          '  - All Recorded Civilization = Final 0.03 Seconds before Midnight';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyCosmicMilestoneBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied Cosmic Milestone!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }

      document.addEventListener('DOMContentLoaded', setCosmicPreset);
    </script>
  `;

  writeFileSync(join(utilDir, 'cosmic-calendar-calculator.html'), renderViralPage({
    title: "Cosmic Calendar Calculator: 13.8 Billion Years in 24 Hours | Digital Tools Shed",
    metaDesc: "Compress the 13.8-billion-year history of the universe into 24 hours. See where Earth, dinosaurs, human history, and your life land on the cosmic clock.",
    canonical: `${DOMAIN}/util/cosmic-calendar-calculator`,
    bodyContent: cosmicHtml,
    currentPath: '/util/cosmic-calendar-calculator',
    faq: [
      {
        q: "What is Carl Sagan's Cosmic Calendar?",
        a: "A conceptual framework popularized by astronomer Carl Sagan in his book 'The Dragons of Eden' and television series 'Cosmos', mapping the entire 13.8-billion-year history of the universe onto a single human calendar year or 24-hour day."
      },
      {
        q: "How many real-world years equal one second on the 24-hour Cosmic Clock?",
        a: "One second on the 24-hour cosmic clock equals approximately 159,722 solar years. One cosmic minute equals roughly 9.58 million years, and one cosmic hour equals 575 million years."
      },
      {
        q: "When do modern humans arrive on the 24-hour cosmic timeline?",
        a: "Anatomically modern humans (Homo sapiens) emerge at 23:59:46—just 14 seconds before midnight. All of recorded human civilization (agriculture, writing, cities) takes place in the final 0.03 seconds."
      },
      {
        q: "How long is an 80-year human life on the Cosmic Clock?",
        a: "An 80-year human life represents approximately 0.0005 seconds (half a millisecond) on the 24-hour cosmic clock."
      },
      {
        q: "When did the dinosaurs live and go extinct on this scale?",
        a: "Dinosaurs appeared at 23:25 (11:25 PM) and flourished for over 28 minutes before being wiped out by the Chicxulub asteroid impact at 23:53 (11:53 PM)."
      }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 6. YOUR LIFE IN WEEKS (MEMENTO MORI 4,680-BOX MATRIX) (/util/life-in-weeks.html)
  // ──────────────────────────────────────────────────────────────────────────
  const lifeInWeeksHtml = `
    <style>
      .week-box { width: 9px; height: 9px; border-radius: 1px; display: inline-block; background: var(--surface-alt); border: 1px solid var(--border); }
      .week-past { background: #3b82f6; border-color: #2563eb; }
      .week-now { background: #ef4444; border-color: #dc2626; box-shadow: 0 0 6px rgba(239,68,68,0.8); }
      .week-grid { display: grid; grid-template-columns: repeat(52, 1fr); gap: 3px; max-width: 650px; margin: 1.5rem auto; }
    </style>

    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Life in Weeks
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ef4444; margin-bottom: 0.5rem;">2 AM Memento Mori</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Your Life in Weeks (4,680-Week Matrix)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          A typical 90-year human life contains only <strong>4,680 weeks</strong>. Enter your birthdate to visualize your lived time against the time you have remaining.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Your Birth Date</label>
            <input type="date" id="liwBirth" value="1995-06-15" class="search-input" style="padding: 0.55rem; font-family: var(--mono); font-size: 1.1rem;" onchange="renderLifeWeeks()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Target Age (Years)</label>
            <input type="number" id="liwAge" value="85" min="50" max="100" class="search-input" style="width: 100px; padding: 0.55rem; font-family: var(--mono); font-size: 1.1rem;" oninput="renderLifeWeeks()" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; text-align: center;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">WEEKS LIVED</span>
            <div id="liwLived" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #3b82f6;">1,625</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">WEEKS REMAINING</span>
            <div id="liwRemaining" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #10b981;">2,795</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">LIFESPAN COMPLETED</span>
            <div id="liwPercent" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #ef4444;">36.8%</div>
          </div>
        </div>

        <div style="text-align: center; margin-bottom: 1rem;">
          <span style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted);">Each square represents 1 week (52 weeks per row = 1 full year)</span>
        </div>

        <div id="liwContainer" class="week-grid" style="margin-bottom: 1.5rem;"></div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button onclick="copyLifeWeeksSummary()" id="copyLifeWeeksBtn" class="btn-primary" style="padding: 0.6rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">📋 Copy Life in Weeks Ledger</button>
        </div>
      </div>

      <!-- MEMENTO MORI DERIVATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Mathematical & Biological Framework: The 4,680-Week Matrix</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          First visualized by Tim Urban in <em>Wait But Why</em> (2014), the weekly grid translates abstract actuarial metrics into finite discrete spatial blocks:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.25rem;">
          1. Total Lifetime Capacity (90 Years):<br>
          &nbsp;&nbsp;&nbsp;W_{total} = 90 &times; 52.1775 &approx; 4,696 weeks (Matrix conventionally rounded to 52 &times; 90 = 4,680 boxes).<br><br>
          2. Elapsed Weeks Formula:<br>
          &nbsp;&nbsp;&nbsp;W_{lived} = floor((T_{now} - T_{birth}) / (7 &times; 86,400 &times; 1000))<br><br>
          3. Life Phase Allocation:<br>
          &nbsp;&nbsp;&nbsp;&bull; Youth & Education (Ages 0-22): 1,144 weeks (24.4%)<br>
          &nbsp;&nbsp;&nbsp;&bull; Core Building & Career (Ages 22-65): 2,236 weeks (47.8%)<br>
          &nbsp;&nbsp;&nbsp;&bull; Senior Wisdom & Legacy (Ages 65-90): 1,300 weeks (27.8%)<br><br>
          4. The "Tail End" Principle:<br>
          &nbsp;&nbsp;&nbsp;By high school graduation (week 936), approximately 90% of in-person time with parents is already consumed.
        </div>
      </div>

      <!-- FATAL TRAPS & TIME PERCEPTION PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Fallacies in Human Time & Lifespan Perception</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Abundance Illusion</strong>
          Assuming that life is an endless expanse because daily routines feel repetitive. An adult aged 35 has only approximately 2,600 weeks left, containing fewer than 2,600 weekends.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The Deferral of Living Fallacy</strong>
          Postponing authentic relationships, creative passions, and meaningful travel until 'after retirement', assuming peak physical vitality and mental clarity are guaranteed at week 3,500.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Routine Compression Acceleration Trap</strong>
          Allowing weeks to blend together into unmemorable blur. Novelty stimulates dopamine and creates dense memory anchors; monotony causes 5 years (260 weeks) to feel like 5 months.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. Morbid Paralysis vs. Stoic Liberation</strong>
          Reacting to Memento Mori with existential dread and nihilistic despair rather than recognizing that finite boundaries give human choices weight, beauty, and urgency.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The Sunk Week Rumination Trap</strong>
          Wasting present weeks ruminating over 'misspent' past boxes. Past weeks are fixed and unrecoverable; your agency exists exclusively in the active red box marking today.
        </div>
      </div>
    </div>

    <script>
      function renderLifeWeeks() {
        var bStr = document.getElementById('liwBirth').value;
        var maxYears = parseInt(document.getElementById('liwAge').value, 10) || 85;
        if (!bStr) return;

        var birth = new Date(bStr);
        var now = new Date();
        var diffMs = now - birth;
        var weeksLived = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
        var totalWeeks = maxYears * 52;
        var weeksLeft = Math.max(0, totalWeeks - weeksLived);
        var pct = Math.min(100, (weeksLived / totalWeeks) * 100);

        document.getElementById('liwLived').textContent = weeksLived.toLocaleString('en-US');
        document.getElementById('liwRemaining').textContent = weeksLeft.toLocaleString('en-US');
        document.getElementById('liwPercent').textContent = pct.toFixed(1) + '%';

        var html = '';
        for (var i = 0; i < totalWeeks; i++) {
          var cls = 'week-box';
          if (i < weeksLived) cls += ' week-past';
          else if (i === weeksLived) cls += ' week-now';
          html += '<div class="' + cls + '" title="Week ' + (i + 1) + ' (Age ' + Math.floor(i / 52) + ')"></div>';
        }
        document.getElementById('liwContainer').innerHTML = html;
      }

      function copyLifeWeeksSummary() {
        var lived = document.getElementById('liwLived').textContent;
        var remaining = document.getElementById('liwRemaining').textContent;
        var pct = document.getElementById('liwPercent').textContent;
        var text = '=== YOUR LIFE IN WEEKS (MEMENTO MORI LEDGER) ===\n' +
          'Weeks Lived: ' + lived + ' weeks\n' +
          'Weeks Remaining: ' + remaining + ' weeks\n' +
          'Lifespan Completed: ' + pct + '\n\n' +
          'STOIC MEMENTO MORI REFLECTION:\n' +
          'A typical human life is approximately 4,680 weeks long. ' +
          'Every Saturday that passes fills another irreversible box. ' +
          'Spend today on what truly matters to you and let go of trivial noise.';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyLifeWeeksBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied Life in Weeks Ledger!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }

      document.addEventListener('DOMContentLoaded', renderLifeWeeks);
      renderLifeWeeks();
    </script>
  `;

  writeFileSync(join(utilDir, 'life-in-weeks.html'), renderViralPage({
    title: "Your Life in Weeks: Interactive 4,680-Box Memento Mori Matrix | Digital Tools Shed",
    metaDesc: "Interactive life in weeks grid visualizing a 90-year human life across 4,680 weeks. See lived weeks vs weeks remaining in your lifespan.",
    canonical: `${DOMAIN}/util/life-in-weeks`,
    bodyContent: lifeInWeeksHtml,
    currentPath: '/util/life-in-weeks',
    faq: [
      {
        q: "What is the 'Life in Weeks' concept and who popularized it?",
        a: "Popularized by writer Tim Urban on 'Wait But Why' in 2014, the concept visualizes an entire human life on a single sheet of paper using 4,680 small boxes (52 weeks across by 90 years down)."
      },
      {
        q: "How many weeks are in an average 80 to 90-year human lifespan?",
        a: "An 80-year life contains approximately 4,160 weeks. A 90-year life contains approximately 4,680 weeks."
      },
      {
        q: "How does seeing life in weeks affect time perception?",
        a: "Humans naturally perceive time in short recurring cycles (days, weeks) or abstract distant years. Visualizing the entire finite matrix simultaneously breaks the illusion of endless time, sharpening focus on present priorities."
      },
      {
        q: "What is the 'Tail End' phenomenon regarding relationships with parents?",
        a: "Because childhood involves daily cohabitation, the average person consumes roughly 90% of their total in-person face time with their parents before graduating high school and leaving home."
      },
      {
        q: "How does Memento Mori enhance psychological well-being?",
        a: "Originating in ancient Stoic philosophy, Memento Mori ('remember you will die') reduces petty anxiety, eliminates trivial conflicts, deepens daily gratitude, and clarifies genuine life priorities."
      }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 7. BILLION SECONDS & REAL-TIME HEARTBEAT TICKER (/util/billion-seconds-calculator.html)
  // ──────────────────────────────────────────────────────────────────────────
  const billionHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Billion Seconds & Heartbeat Ticker
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ec4899; margin-bottom: 0.5rem;">2 AM Real-Time Biological Ticker</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Billionth Second & Real-Time Heartbeat Milestone Counter</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          You turn 1,000,000,000 seconds old at age <strong>31 years, 251 days, 13 hours, 46 minutes, and 40 seconds</strong>. Track your exact milestone date and watch your cumulative heartbeats, breaths taken, and solar orbital distance tick live right now.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <div style="flex: 1; min-width: 220px;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Birth Date</label>
            <input type="date" id="bsBirth" value="1995-03-24" class="search-input" style="width: 100%; padding: 0.55rem; font-family: var(--mono); font-size: 1.1rem;" onchange="updateBillionMilestone()" />
          </div>
          <div style="flex: 1; min-width: 180px;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Resting Heart Rate (BPM)</label>
            <input type="number" id="bsBpm" value="72" min="40" max="150" class="search-input" style="width: 100%; padding: 0.55rem; font-family: var(--mono); font-size: 1.1rem;" oninput="updateBillionMilestone()" />
          </div>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; text-align: center; margin-bottom: 1.5rem;">
          <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Your 1 Billionth Second Date</div>
          <div id="bsTargetDate" style="font-family: var(--serif); font-size: 2.2rem; font-weight: bold; color: #ec4899; margin: 0.4rem 0;">December 1, 2026</div>
          <div id="bsCountdown" style="font-family: var(--mono); font-size: 1.1rem; color: var(--fg); margin-bottom: 0.75rem;"></div>
          <div style="background: var(--surface); border-radius: 999px; height: 12px; width: 100%; max-width: 400px; margin: 0 auto; overflow: hidden; border: 1px solid var(--border);">
            <div id="bsProgressFill" style="background: linear-gradient(90deg, #3b82f6, #ec4899); height: 100%; width: 0%; transition: width 0.3s ease;"></div>
          </div>
          <div id="bsProgressText" style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); margin-top: 0.4rem;">0% of 1B seconds lived</div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; text-align: center; margin-bottom: 1.5rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:2px"><circle cx="12" cy="13" r="9"/><polyline points="12 9 12 13 15 16"/><path d="M12 4V2"/><path d="M10 2h4"/></svg> EXACT SECONDS ALIVE</span>
            <div id="bsLiveSeconds" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #3b82f6; margin-top: 0.25rem;">0</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:2px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> ESTIMATED HEARTBEATS</span>
            <div id="bsLiveBeats" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #ef4444; margin-top: 0.25rem;">0</div>
            <div id="bsBeatsSub" style="font-size: 0.75rem; color: var(--text-muted);">~72 beats/min (~103,680/day)</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:2px"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> SOLAR ORBIT DISTANCE</span>
            <div id="bsLiveOrbit" style="font-family: var(--mono); font-size: 1.5rem; font-weight: bold; color: #10b981; margin-top: 0.25rem;">0 km</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Earth travels 29.78 km/s</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:2px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> BREATHS TAKEN</span>
            <div id="bsLiveBreaths" style="font-family: var(--mono); font-size: 1.5rem; font-weight: bold; color: #8b5cf6; margin-top: 0.25rem;">0</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">~16 breaths/min (~23,040/day)</div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-bottom: 1rem;">
          <button type="button" id="copyBillionBtn" onclick="copyBillionSummary()" class="btn-sm" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.5rem 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
            📋 Copy Lifetime Milestone Report
          </button>
        </div>
      </div>

      <!-- STEP-BY-STEP MATHEMATICAL DERIVATIONS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">1 Billion Seconds: Complete Mathematical & Temporal Derivations</h2>
        <div style="display: grid; gap: 1rem; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">1. Raw Calendar Conversion Formula</strong>
            $$1,000,000,000\text{ seconds} \div 60 = 16,666,666.67\text{ minutes}$$
            $$16,666,666.67 \div 60 = 277,777.78\text{ hours}$$
            $$277,777.78 \div 24 = 11,574.074\text{ days}$$
            $$11,574.074 \div 365.2425 = 31.688765\text{ Gregorian solar years}$$
            Exact duration: <strong>31 years, 251 days, 13 hours, 46 minutes, and 40 seconds</strong>.
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #ef4444;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">2. Cardiac Expenditure Integral</strong>
            $$\text{Total Heartbeats} = T_{\text{seconds}} \times \left(\frac{\text{BPM}}{60}\right)$$
            At standard resting heart rate of 72 bpm (1.2 beats per second), the human myocardium contracts approximately <strong>1,200,000,000 times</strong> (1.2 billion strokes) during this epoch, pumping approximately <strong>84 million liters (22.2 million gallons)</strong> of blood through 60,000 miles of vascular capillaries.
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #10b981;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">3. Planetary Heliocentric Kinematics</strong>
            $$\text{Distance} = T_{\text{seconds}} \times v_{\text{orbit}} = 10^9\text{ s} \times 29.78\text{ km/s} = 29,780,000,000\text{ km}$$
            Over your first billion seconds, Earth carries you across <strong>29.78 billion kilometers (18.5 billion miles)</strong> through interplanetary space—the equivalent of 199.1 Astronomical Units (AU), or traveling to Pluto and back three full round-trips.
          </div>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & ENGINEERING/BIOLOGICAL PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">5 Critical Traps & Temporal Pitfalls in Lifespan Calculation</h2>
        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #ef4444;">1. The Leap Year & Leap Second Drift Fallacy</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Many online calculators compute 1 billion seconds simply as (10^9 / (365 \times 86400) = 31.7098) years, ignoring leap years. Over a 31-year span, you experience either 7 or 8 leap days ((7 \times 86,400 = 604,800) seconds). Failing to incorporate the leap calendar miscalculates your true billionth second moment by nearly an entire week.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #f59e0b;">2. Resting vs Dynamic Heart Rate Variability (HRV) Bias</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Assuming a static 72 bpm ignores circadian rhythms (nocturnal bradycardia drops rates to 50–55 bpm) and physical exertion (aerobic exercise spikes rates to 130–170 bpm). Over 11,574 days, this variance causes the true cardiac stroke count to deviate by (\pm 150,000,000) beats from static linear estimates.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #10b981;">3. The General Relativistic Gravitational Time Dilation</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              By Einstein\'s General Theory of Relativity, clocks tick faster at higher gravitational potential. A human residing in Denver, Colorado (elevation 1,600m) ages roughly 90 microseconds faster over 1 billion seconds than someone at sea level in Miami. While imperceptible psychologically, atomic clocks easily detect this discrepancy.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #3b82f6;">4. The 2 Billion & 2.5 Billion Second Lifespan Horizon</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Turning 1 billion seconds old happens in your prime at age 31. However, turning <strong>2 billion seconds</strong> occurs at age <strong>63.37 years</strong>, and <strong>2.5 billion seconds</strong> occurs at age <strong>79.22 years</strong> (the exact modern life expectancy in developed nations). Only centenarians surpass 3 billion seconds (95.06 years).
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #8b5cf6;">5. The Decimal Anthropic Fallacy</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Humans celebrate (10^9) seconds because of base-10 anatomy (ten fingers). If our civilization used hexadecimal or binary, we would celebrate (2^{30}) seconds ((1,073,741,824) seconds, or age 34.02 years). The universe acknowledges solar revolutions and entropy, not decimal powers of ten.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ ACCORDION SECTION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions: Lifespan Seconds & Heartbeats</h2>
        <div class="faq-accordion" style="display: grid; gap: 0.75rem;">
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>At what exact age does a person reach 1 billion seconds old?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              A human reaches 1 billion seconds old at precisely <strong>31 years, 251 days, 13 hours, 46 minutes, and 40 seconds</strong>. The exact calendar date varies slightly depending on whether your 31-year lifespan contains 7 or 8 leap years.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How many times does the human heart beat in a lifetime?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              At an average resting rate of 72 beats per minute, the heart beats roughly 103,680 times per day, 37.8 million times per year, and approximately <strong>1.2 billion times by age 31.7</strong>. Over a full 80-year lifetime, the human heart beats approximately <strong>3.0 billion times</strong> without a single pause.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How far does the Earth carry you through space in 1 billion seconds?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Earth orbits the Sun at an average velocity of 29.78 kilometers per second (66,600 mph). In 1 billion seconds, you travel <strong>29.78 billion kilometers (18.5 billion miles)</strong> around the Sun. Relative to the Milky Way galactic core (220 km/s), you travel over 220 billion kilometers.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Can a human reach 3 billion seconds old?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Yes. 3 billion seconds corresponds to <strong>95 years, 36 days</strong>. While reaching 3 billion seconds requires reaching exceptional longevity, hundreds of thousands of people alive today have surpassed this threshold. The oldest recorded person, Jeanne Calment (122 years, 164 days), lived approximately 3.86 billion seconds.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is the Year 2038 Unix epoch problem?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Unix systems count time as seconds elapsed since January 1, 1970 (UTC). Legacy 32-bit signed integers overflow at (2^{31} - 1 = 2,147,483,647) seconds, which occurs on <strong>January 19, 2038 at 03:14:07 UTC</strong>. At that moment, 32-bit systems will interpret the time as December 13, 1901 unless migrated to 64-bit timestamps.
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      function toggleFaq(btn) {
        var answer = btn.nextElementSibling;
        var icon = btn.querySelector('.faq-icon');
        var item = btn.closest('.faq-item');
        if (answer.style.display === 'block') {
          answer.style.display = 'none';
          icon.textContent = '+';
          item.classList.remove('open');
        } else {
          answer.style.display = 'block';
          icon.textContent = '−';
          item.classList.add('open');
        }
      }

      function updateBillionMilestone() {
        var bStr = document.getElementById('bsBirth').value;
        if (!bStr) return;
        var birthMs = new Date(bStr + 'T00:00:00').getTime();
        var billionMs = birthMs + (1000000000 * 1000);
        var targetDate = new Date(billionMs);

        document.getElementById('bsTargetDate').textContent = targetDate.toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        var bpm = parseFloat(document.getElementById('bsBpm').value) || 72;
        var beatsPerDay = Math.round(bpm * 60 * 24);
        document.getElementById('bsBeatsSub').textContent = '~' + bpm + ' beats/min (~' + beatsPerDay.toLocaleString('en-US') + '/day)';

        tickLiveStats();
      }

      function tickLiveStats() {
        var bStr = document.getElementById('bsBirth').value;
        if (!bStr) return;
        var birthMs = new Date(bStr + 'T00:00:00').getTime();
        var nowMs = Date.now();
        var diffSec = (nowMs - birthMs) / 1000;

        if (diffSec > 0) {
          document.getElementById('bsLiveSeconds').textContent = Math.floor(diffSec).toLocaleString('en-US');
          var bpm = parseFloat(document.getElementById('bsBpm').value) || 72;
          var beats = Math.floor(diffSec * (bpm / 60));
          document.getElementById('bsLiveBeats').textContent = beats.toLocaleString('en-US');
          var orbitKm = Math.floor(diffSec * 29.78);
          document.getElementById('bsLiveOrbit').textContent = (orbitKm / 1000000).toFixed(1) + 'M km';
          var breaths = Math.floor(diffSec * (16 / 60));
          document.getElementById('bsLiveBreaths').textContent = breaths.toLocaleString('en-US');

          var billionSec = 1000000000;
          var progressPct = Math.min(100, Math.max(0, (diffSec / billionSec) * 100));
          document.getElementById('bsProgressFill').style.width = progressPct.toFixed(2) + '%';
          document.getElementById('bsProgressText').textContent = progressPct.toFixed(2) + '% of 1 Billion Seconds Lived';

          if (diffSec >= billionSec) {
            var overYears = ((diffSec - billionSec) / 31557600).toFixed(2);
            document.getElementById('bsCountdown').innerHTML = '<span style="color: #10b981; font-weight: bold;">✓ Surpassed 1 Billion Seconds (' + overYears + ' years ago)</span>';
          } else {
            var left = billionSec - diffSec;
            var days = Math.floor(left / 86400);
            var hrs = Math.floor((left % 86400) / 3600);
            var mins = Math.floor((left % 3600) / 60);
            var s = Math.floor(left % 60);
            document.getElementById('bsCountdown').textContent = days + 'd ' + hrs + 'h ' + mins + 'm ' + s + 's until 1,000,000,000 seconds';
          }
        }
      }

      function copyBillionSummary() {
        var birthDate = document.getElementById('bsBirth').value;
        var targetDate = document.getElementById('bsTargetDate').textContent;
        var liveSec = document.getElementById('bsLiveSeconds').textContent;
        var liveBeats = document.getElementById('bsLiveBeats').textContent;
        var liveOrbit = document.getElementById('bsLiveOrbit').textContent;
        var liveBreaths = document.getElementById('bsLiveBreaths').textContent;
        var progress = document.getElementById('bsProgressText').textContent;

        var text = '=== BILLIONTH SECOND & BIOLOGICAL LIFESPAN REPORT ===\n' +
          'Birth Date: ' + birthDate + '\n' +
          'Exact 1 Billionth Second Date: ' + targetDate + '\n' +
          'Progress: ' + progress + '\n' +
          'Total Seconds Alive: ' + liveSec + ' s\n' +
          'Cumulative Heartbeats: ' + liveBeats + '\n' +
          'Cumulative Breaths Taken: ' + liveBreaths + '\n' +
          'Solar Orbital Distance Traveled: ' + liveOrbit + '\n' +
          'Calculated via Digital Tools Shed: ' + window.location.href;

        var btn = document.getElementById('copyBillionBtn');
        navigator.clipboard.writeText(text).then(function() {
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Milestone Report Copied!';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#10b981';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 2500);
        });
      }

      document.addEventListener('DOMContentLoaded', function() {
        updateBillionMilestone();
        setInterval(tickLiveStats, 1000);
        tickLiveStats();
      });
    </script>
  `;

  writeFileSync(join(utilDir, 'billion-seconds-calculator.html'), renderPage({
    title: 'Billionth Second & Real-Time Heartbeat Milestone Counter | Digital Tools Shed',
    metaDesc: 'Calculate when you turn 1 billion seconds old (age 31.7). Live real-time ticker tracking lifetime heartbeats, breaths taken, and solar orbital distance.',
    canonical: `${DOMAIN}/util/billion-seconds-calculator`,
    bodyContent: billionHtml,
    currentPath: '/util/billion-seconds-calculator',
    faqSchema: [
      {
        q: "At what exact age does a person reach 1 billion seconds old?",
        a: "A human reaches 1 billion seconds old at precisely 31 years, 251 days, 13 hours, 46 minutes, and 40 seconds."
      },
      {
        q: "How many times does the human heart beat in a lifetime?",
        a: "At an average resting rate of 72 bpm, the human heart beats approximately 1.2 billion times by age 31.7, and roughly 3.0 billion times over an 80-year lifespan."
      },
      {
        q: "How far does the Earth carry you through space in 1 billion seconds?",
        a: "In 1 billion seconds, Earth's orbital velocity of 29.78 km/s carries you approximately 29.78 billion kilometers (18.5 billion miles) around the Sun."
      },
      {
        q: "Can a human reach 3 billion seconds old?",
        a: "Yes. 3 billion seconds corresponds to 95 years and 36 days. Jeanne Calment, the longest living verified human, reached approximately 3.86 billion seconds."
      },
      {
        q: "What is the Year 2038 Unix epoch problem?",
        a: "Unix timestamps on legacy 32-bit systems overflow at 2,147,483,647 seconds on January 19, 2038, requiring complete migration to 64-bit integers."
      }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 8. NUCLEAR BLAST RADIUS & DAMAGE SIMULATOR (/util/blast-radius-calculator.html)
  // ──────────────────────────────────────────────────────────────────────────
  const blastHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Blast Radius Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ef4444; margin-bottom: 0.5rem;">2 AM Physics & Survival Scaler</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Nuclear Blast Radius & Thermal Damage Estimator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Physics-based blast damage zones calculated via Glasstone & Dolan cube-root scaling laws (\(R \propto Y^{1/3}\)) from tactical sub-kiloton devices to thermonuclear megatons.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Historical & Modern Presets</label>
            <select id="nbPreset" class="code-input" style="width: 100%; padding: 0.6rem;" onchange="applyNBPreset()">
              <option value="15">Hiroshima "Little Boy" (15 Kilotons)</option>
              <option value="21">Nagasaki "Fat Man" (21 Kilotons)</option>
              <option value="475" selected>W88 Trident SLBM Warhead (475 Kilotons)</option>
              <option value="1200">B83 Gravity Bomb (1.2 Megatons)</option>
              <option value="15000">Castle Bravo Test (15 Megatons)</option>
              <option value="50000">Tsar Bomba Maximum (50 Megatons)</option>
              <option value="custom">Custom Yield...</option>
            </select>
          </div>

          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Yield (Kilotons TNT Equivalent)</label>
            <input type="number" id="nbYield" value="475" min="0.1" max="100000" step="10" class="search-input" style="width: 100%; padding: 0.55rem 0.75rem; font-family: var(--mono); font-size: 1.1rem;" oninput="calcBlast()" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #f97316; padding: 1.25rem; border-radius: 6px;">
            <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Fireball Radius</div>
            <div id="nbFireball" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #f97316; margin: 0.25rem 0;">0.89 km</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Instant vaporization zone</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.25rem; border-radius: 6px;">
            <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Heavy Blast (20 psi)</div>
            <div id="nbHeavy" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #ef4444; margin: 0.25rem 0;">1.85 km</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Reinforced concrete leveled</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #eab308; padding: 1.25rem; border-radius: 6px;">
            <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Moderate Blast (5 psi)</div>
            <div id="nbMod" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #eab308; margin: 0.25rem 0;">3.89 km</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Residential homes collapse</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #8b5cf6; padding: 1.25rem; border-radius: 6px;">
            <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Thermal Burns (3rd Deg)</div>
            <div id="nbThermal" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #8b5cf6; margin: 0.25rem 0;">8.41 km</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Severe 3rd-degree burns to bare skin</div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
          <button type="button" id="copyBlastBtn" onclick="copyBlastAssessment()" class="btn-sm" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.5rem 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
            📋 Copy Blast Zones Assessment
          </button>
        </div>
      </div>

      <!-- STEP-BY-STEP MATHEMATICAL DERIVATIONS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Glasstone & Dolan Blast Physics: Step-by-Step Scaling Derivations</h2>
        <div style="display: grid; gap: 1rem; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #f97316;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">1. Nuclear Fireball Radius ((R_f))</strong>
            $$R_{\text{fireball}} \approx 0.11 \times Y^{0.4}\text{ km (where }Y\text{ is in kilotons)}$$
            For a <span id="derYield1">475</span> kt warhead:
            $$R_f = 0.11 \times (475)^{0.4} = 0.11 \times 11.75 = 1.29\text{ km}$$
            Inside this plasma bubble, peak temperatures exceed 100,000,000°C, producing total molecular disintegration.
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #ef4444;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">2. Shockwave Overpressure Cube-Root Scaling Law</strong>
            $$R_{\text{overpressure}} = k \times Y^{1/3}$$
            $$\text{Heavy Damage (20 psi): } R_{20} = 0.237 \times Y^{1/3}$$
            $$\text{Moderate Collapse (5 psi): } R_5 = 0.50 \times Y^{1/3}$$
            Shockwave energy expands spherically through the atmosphere. Because volume is proportional to (R^3), blast overpressure scales strictly with the cube root of the explosive yield.
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #8b5cf6;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">3. Thermal Radiation & Flash Burns ((Q \propto Y / R^2))</strong>
            $$R_{\text{thermal (3rd deg)}} \approx 1.08 \times Y^{0.41}\text{ km}$$
            Because thermal energy travels at the speed of light unimpeded by mechanical drag, its effective lethality radius expands significantly faster ((Y^{0.41})) than the acoustic blast shockwave ((Y^{0.333})).
          </div>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & MILITARY SURVIVAL PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">5 Critical Nuclear Blast & Survival Fallacies</h2>
        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #ef4444;">1. The Airburst Mach Stem Amplification Trap</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Nuclear weapons are almost never detonated at ground level against cities. When detonated at optimal altitude (airburst), the downward shockwave reflects off the ground and merges with the incident wave, creating a horizontal shock front called the <strong>Mach Stem</strong> that nearly doubles the 5 psi residential collapse radius.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #f59e0b;">2. Atmospheric Extinction & Meteorological Attenuation</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Thermal burn equations assume clear, pristine desert air. Cloud cover, heavy fog, rain, or high humidity can attenuate thermal flash fluence by 50% to 80%. Conversely, detonation above dense low cloud decks can reflect thermal energy downward, igniting unpredictable secondary fires.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #10b981;">3. The Dangerous Neglect of Local Radioactive Fallout</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Airburst models show minimal prompt fallout because the fireball never touches soil. However, if an adversary attacks hardened underground missile silos with surface bursts, hundreds of thousands of tons of dirt are pulverized, vaporized, neutron-activated, and carried downwind for hundreds of miles as lethal black fallout.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #3b82f6;">4. The Linear Intuition Fallacy in Explosive Yield</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              The human mind defaults to linear proportionality: expecting a 10-megaton weapon to have 10 times the destructive radius of a 1-megaton weapon. Due to the cube-root law ((10^{1/3} \approx 2.15)), a tenfold increase in explosive yield yields only a 2.15-fold increase in blast distance.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #8b5cf6;">5. High-Altitude Electromagnetic Pulse (HEMP) Decoupling</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              A weapon detonated 100 to 400 km above the atmosphere causes zero overpressure, zero fireball damage, and zero direct blast injuries at the surface. Instead, gamma rays interact with the Earth\'s magnetic field to generate thousands of volts per meter of electrical transient pulse, permanently destroying electrical grids and communications across continental scales.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ ACCORDION SECTION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions: Nuclear Blast Physics & Survivability</h2>
        <div class="faq-accordion" style="display: grid; gap: 0.75rem;">
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How does explosive yield scale with blast radius?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Blast radius scales according to the cube root of explosive energy yield: (R \propto Y^{1/3}). To double the distance of a specific overpressure threshold (such as 5 psi residential destruction), the warhead yield must be multiplied by 8 ((2^3 = 8)).
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is the difference between 20 psi and 5 psi overpressure?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              20 psi overpressure creates catastrophic structural failure, pulverizing heavily reinforced concrete and steel buildings with wind velocities exceeding 500 mph (fatalities approach 100%). 5 psi overpressure collapses standard residential timber and brick homes with 160 mph winds, causing widespread structural entrapment and moderate-to-severe injuries.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Why does thermal radiation travel further than the physical shockwave?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Thermal radiation consists of electromagnetic waves traveling instantaneously at the speed of light ((300,000\text{ km/s})). The blast shockwave is a mechanical acoustic wave that loses energy rapidly compressing ambient air, traveling at merely supersonic speeds before decaying to sonic speed.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is an airburst and why do military strategists prefer it?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              An airburst detonates several hundred to thousands of meters above the surface. This prevents shock energy from being absorbed by cratering the soil, maximizes Mach stem ground reflection, and substantially enlarges the ground footprint of lethal overpressure without creating heavy local radioactive fallout.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How does the Tsar Bomba compare to modern tactical warheads?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              The 1961 Soviet Tsar Bomba detonated at 50 megatons (50,000 kilotons)—over 3,300 times more powerful than Hiroshima (15 kt). Modern arsenals favor smaller MIRV warheads (100–475 kt) because distributing multiple smaller warheads destroys a vastly larger total surface area than a single monster bomb.
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      function applyNBPreset() {
        var v = document.getElementById('nbPreset').value;
        if (v !== 'custom') {
          document.getElementById('nbYield').value = v;
          calcBlast();
        }
      }

      function calcBlast() {
        var y = parseFloat(document.getElementById('nbYield').value) || 1; // kt
        var d1 = document.getElementById('derYield1');
        if (d1) d1.textContent = y.toLocaleString('en-US');

        // Standard Glasstone & Dolan scaling approximations (km):
        // Fireball radius ~ 0.11 * Y^0.4 (km for Y in kt)
        var r_fireball = 0.11 * Math.pow(y, 0.4);

        // 20 psi overpressure radius ~ 0.237 * Y^(1/3) (km for Y in kt)
        var r_heavy = 0.237 * Math.pow(y, 1/3);

        // 5 psi moderate blast ~ 0.50 * Y^(1/3) (km for Y in kt)
        var r_mod = 0.50 * Math.pow(y, 1/3);

        // 3rd degree burn thermal radius ~ 1.08 * Y^0.41 (km for Y in kt)
        var r_thermal = 1.08 * Math.pow(y, 0.41);

        document.getElementById('nbFireball').textContent = r_fireball.toFixed(2) + ' km (' + (r_fireball * 0.621371).toFixed(2) + ' mi)';
        document.getElementById('nbHeavy').textContent = r_heavy.toFixed(2) + ' km (' + (r_heavy * 0.621371).toFixed(2) + ' mi)';
        document.getElementById('nbMod').textContent = r_mod.toFixed(2) + ' km (' + (r_mod * 0.621371).toFixed(2) + ' mi)';
        document.getElementById('nbThermal').textContent = r_thermal.toFixed(2) + ' km (' + (r_thermal * 0.621371).toFixed(2) + ' mi)';
      }

      function copyBlastAssessment() {
        var y = document.getElementById('nbYield').value;
        var fb = document.getElementById('nbFireball').textContent;
        var hv = document.getElementById('nbHeavy').textContent;
        var md = document.getElementById('nbMod').textContent;
        var th = document.getElementById('nbThermal').textContent;

        var text = '=== NUCLEAR BLAST RADIUS & DAMAGE ZONES ASSESSMENT ===\n' +
          'Explosive Yield: ' + y + ' Kilotons TNT Equivalent\n' +
          'Fireball Radius (Instant Vaporization): ' + fb + '\n' +
          'Heavy Blast Zone (20 psi, Reinforced Concrete Leveled): ' + hv + '\n' +
          'Moderate Blast Zone (5 psi, Residential Collapse): ' + md + '\n' +
          'Thermal Radiation Zone (3rd-Degree Flash Burns): ' + th + '\n' +
          'Physics Engine: Glasstone & Dolan Scaling Equations\n' +
          'Calculated via Digital Tools Shed: ' + window.location.href;

        var btn = document.getElementById('copyBlastBtn');
        navigator.clipboard.writeText(text).then(function() {
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Blast Zones Copied!';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#10b981';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 2500);
        });
      }

      document.addEventListener('DOMContentLoaded', calcBlast);
      calcBlast();
    </script>
  `;

  writeFileSync(join(utilDir, 'blast-radius-calculator.html'), renderPage({
    title: 'Nuclear Blast Radius & Thermal Damage Calculator | Digital Tools Shed',
    metaDesc: 'Calculate nuclear explosion damage zones using cube-root physics scaling laws. Estimates fireball, 20 psi overpressure, 5 psi residential collapse, and thermal burn radius.',
    canonical: `${DOMAIN}/util/blast-radius-calculator`,
    bodyContent: blastHtml,
    currentPath: '/util/blast-radius-calculator',
    faqSchema: [
      {
        q: "How does explosive yield scale with blast radius?",
        a: "Blast radius scales according to the cube root of explosive energy yield: R ∝ Y^(1/3). Multiplying warhead yield by 8 doubles the blast radius."
      },
      {
        q: "What is the difference between 20 psi and 5 psi overpressure?",
        a: "20 psi demolishes reinforced concrete structures with 500 mph winds, while 5 psi collapses ordinary residential structures with 160 mph winds."
      },
      {
        q: "Why does thermal radiation travel further than the physical shockwave?",
        a: "Thermal radiation travels at the speed of light without mechanical resistance, whereas the blast shockwave slows as it displaces air mass."
      },
      {
        q: "What is an airburst and why do military strategists prefer it?",
        a: "An airburst detonation optimizes horizontal ground blast via Mach stem reflection, maximizing destruction without significant local fallout."
      },
      {
        q: "How does the Tsar Bomba compare to modern tactical warheads?",
        a: "The 50-megaton Tsar Bomba was over 3,300 times larger than Hiroshima, but modern arsenals use clusters of smaller 100-475 kt MIRV warheads for far greater coverage efficiency."
      }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 9. INFINITE MONKEY THEOREM CALCULATOR (/util/infinite-monkey-calculator.html)
  // ──────────────────────────────────────────────────────────────────────────
  const monkeyHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Infinite Monkey Theorem
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; margin-bottom: 0.5rem;">2 AM Probability & Deep Time</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">The Infinite Monkey Theorem Odds & Time Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Calculate the statistical permutations, probability, and chronological time required for an idealized primate typing randomly at 10 keystrokes/second to produce any phrase, word, or sentence.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="margin-bottom: 1.25rem;">
          <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Enter Word or Phrase (Letters & Spaces Only)</label>
          <input type="text" id="monkeyText" value="BANANA" maxlength="30" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.25rem; font-family: var(--mono); text-transform: uppercase;" oninput="calcMonkey()" />
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <span style="font-size: 0.75rem; color: var(--text-muted); align-self: center;">Test Presets:</span>
          <button type="button" class="btn-sm" onclick="setMonkeyPreset('CAT')" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.6rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">CAT (3 chars)</button>
          <button type="button" class="btn-sm" onclick="setMonkeyPreset('BANANA')" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.6rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">BANANA (6 chars)</button>
          <button type="button" class="btn-sm" onclick="setMonkeyPreset('TO BE OR NOT')" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.6rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">TO BE OR NOT (12 chars)</button>
          <button type="button" class="btn-sm" onclick="setMonkeyPreset('HAMLET')" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.6rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">HAMLET (6 chars)</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; text-align: center;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Probability Per Attempt</span>
            <div id="monkeyProb" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #f59e0b; margin: 0.25rem 0;">1 in 387M</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">27 available keys (A-Z + space)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Expected Keystrokes</span>
            <div id="monkeyKeys" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">387,420,489</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">27^L total permutations</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Time for 1 Monkey</span>
            <div id="monkeyTime" style="font-family: var(--mono); font-size: 1.4rem; font-weight: bold; color: #ef4444; margin: 0.25rem 0;">1.2 Years</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">At 10 keys / second continuously</div>
          </div>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-family: var(--mono); font-size: 0.8rem; font-weight: bold;">Virtual Monkey Live Keystroke Stream:</span>
            <button type="button" class="btn-sm" id="btnToggleSim" onclick="toggleMonkeySim()" style="background: var(--surface); border: 1px solid var(--border); padding: 0.25rem 0.6rem; border-radius: 4px; font-family: var(--mono); font-size: 0.75rem; cursor: pointer;">Start Simulation</button>
          </div>
          <div id="monkeyStream" style="font-family: var(--mono); font-size: 0.9rem; background: var(--surface); border: 1px solid var(--border); padding: 0.75rem; border-radius: 4px; height: 65px; overflow: hidden; word-break: break-all; color: var(--text-muted);">Click 'Start Simulation' to watch a virtual monkey type randomly...</div>
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="button" id="copyMonkeyBtn" onclick="copyMonkeyAssessment()" class="btn-sm" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.5rem 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
            📋 Copy Combinatorial Odds Report
          </button>
        </div>
      </div>

      <!-- STEP-BY-STEP MATHEMATICAL DERIVATIONS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Infinite Monkey Combinatorics: Step-by-Step Derivations</h2>
        <div style="display: grid; gap: 1rem; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">1. Permutation Search Space Formulation</strong>
            Given an alphabet size (K = 27) (letters A–Z plus whitespace) and a target phrase length (L), every individual keystroke is modeled as an independent identically distributed (i.i.d.) discrete random variable:
            $$P(\text{single character match}) = \frac{1}{27}$$
            $$P(\text{exact } L\text{-character match}) = \left(\frac{1}{27}\right)^L = 27^{-L}$$
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #ef4444;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">2. Expected Keystrokes & Geometric Distribution</strong>
            The waiting time until the first occurrence of a non-overlapping Bernoulli sequence follows a geometric distribution with mean:
            $$E[\text{keystrokes}] = 27^L$$
            For length (L=6) (e.g. "BANANA"), (E = 27^6 = 387,420,489) keystrokes.
            For length (L=12) (e.g. "TO BE OR NOT"), (E = 27^{12} \approx 1.50 \times 10^{17}) keystrokes.
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #10b981;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">3. Deep Time vs Cosmic Age Benchmarking</strong>
            $$\text{Time in Seconds} = \frac{E[\text{keystrokes}]}{\text{Typing Speed (10 keys/s)}}$$
            The observable universe is approximately 13.8 billion years old ((4.35 \times 10^{17}\) seconds). A single monkey typing at 10 keystrokes/s produces (4.35 \times 10^{18}) characters in the entire history of the universe—sufficient only to reliably produce strings of length (L \le 13).
          </div>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & PROBABILITY PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">5 Critical Misconceptions & Combinatorial Traps</h2>
        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #ef4444;">1. The Independent Trials vs Continuous Stream Trap</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              In a continuous stream, trials are not independent disjoint blocks of (L) characters. Because a target word can begin at any keystroke index, overlapping subsequences reduce the mean waiting time. However, if the word has periodic autocorrelations (like \"ANANAS\"), self-overlaps increase the variance and conditional waiting time.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #f59e0b;">2. Combinatorial Explosion Exceeds Physical Reality</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Typing a short 40-character phrase requires (27^{40} \approx 1.79 \times 10^{57}) keystrokes. By comparison, planet Earth contains approximately (1.33 \times 10^{50}) atoms. Even if every atom on Earth were an ultra-fast quantum computer typing a billion words per second since the Big Bang, they would not yet have produced a single 40-character sentence.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #10b981;">3. Biological Primates Are Not Uniform Pseudo-Random Generators</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              In 2002, researchers at Paignton Zoo gave a computer keyboard to six Celebes crested macaques. The monkeys did not produce random text; they mashed the letter 'S' repeatedly, hit the keyboard with a rock, and urinated on the electronics. Real animals exhibit heavy biological bias, destroying mathematical randomness.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #3b82f6;">4. The Hamlet Delusion & The Heat Death Limit</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Popular culture claims monkeys will eventually type Shakespeare\'s complete works. But the entire universe will suffer thermodynamic Heat Death ((10^{100}) years) long before a monkey randomly types even the first scene of Hamlet ((27^{130,000}) permutations). Mathematical infinity cannot be realized in a finite universe.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #8b5cf6;">5. The Mathematical Definition of "Almost Surely"</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              In measure theory, an event occurring \"almost surely\" (probability 1) means the set of non-occurring sequences has Lebesgue measure zero. However, measure zero does NOT mean impossible—a monkey could theoretically type the letter \"A\" for eternity. Probability 1 does not guarantee physical manifestation in finite spacetime.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ ACCORDION SECTION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions: Infinite Monkey Theorem</h2>
        <div class="faq-accordion" style="display: grid; gap: 0.75rem;">
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is the mathematical premise of the Infinite Monkey Theorem?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              The theorem states that an infinite sequence of random keystrokes on a typewriter will almost surely contain any given text, including the complete works of William Shakespeare, because the probability of the string appearing somewhere in an infinite sequence approaches 1.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Why does adding just one letter make the time 27 times longer?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Because the search space scales exponentially ((27^L)). Each additional character increases the number of possible permutations by a factor of 27. Going from a 6-letter word to an 8-letter word multiplies the expected keystrokes by (27 \times 27 = 729).
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How long would it take a monkey to type the word 'BANANA'?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              'BANANA' has 6 letters. On a 27-key keyboard, there are (27^6 = 387,420,489) combinations. At 10 keystrokes per second, a single monkey would take approximately <strong>38.7 million seconds (1.23 years)</strong> of non-stop typing to produce it.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Has this ever been tested with actual living monkeys?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Yes. In 2002, the University of Plymouth tested six crested macaques. Over one month, they produced five pages of text largely composed of the letter 'S', smashed the computer with a stone, and defecated on it, demonstrating that living primates do not behave like statistical random variables.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is the difference between a random number generator and a physical monkey?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              A pseudo-random algorithm produces uniform character distributions across all keys. Physical primates exhibit motor fatigue, positional preferences (hitting keys nearest their dominant hand), and behavioral patterns that introduce heavy entropy distortions.
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      function setMonkeyPreset(str) {
        document.getElementById('monkeyText').value = str;
        calcMonkey();
      }

      function calcMonkey() {
        var text = document.getElementById('monkeyText').value.toUpperCase().replace(/[^A-Z ]/g, '');
        var L = text.length;
        if (L === 0) return;

        var keys = Math.pow(27, L);
        var probStr = '';
        if (keys < 1e6) probStr = '1 in ' + Math.round(keys).toLocaleString('en-US');
        else if (keys < 1e9) probStr = '1 in ' + (keys / 1e6).toFixed(1) + ' Million';
        else if (keys < 1e12) probStr = '1 in ' + (keys / 1e9).toFixed(1) + ' Billion';
        else probStr = '1 in 10^' + Math.round(Math.log10(keys));

        document.getElementById('monkeyProb').textContent = probStr;
        document.getElementById('monkeyKeys').textContent = keys < 1e15 ? Math.round(keys).toLocaleString('en-US') : '10^' + Math.round(Math.log10(keys));

        // Time at 10 keys / second
        var seconds = keys / 10;
        var universeAges = seconds / 4.35e17; // 13.8B years ~ 4.35e17 seconds
        var timeStr = '';

        if (seconds < 60) timeStr = seconds.toFixed(1) + ' Seconds';
        else if (seconds < 3600) timeStr = (seconds / 60).toFixed(1) + ' Minutes';
        else if (seconds < 86400) timeStr = (seconds / 3600).toFixed(1) + ' Hours';
        else if (seconds < 31557600) timeStr = (seconds / 86400).toFixed(1) + ' Days';
        else if (universeAges < 1) timeStr = (seconds / 31557600).toLocaleString(undefined, {maximumFractionDigits: 1}) + ' Years';
        else timeStr = universeAges.toExponential(1) + '× Age of Universe';

        document.getElementById('monkeyTime').textContent = timeStr;
      }

      function copyMonkeyAssessment() {
        var text = document.getElementById('monkeyText').value;
        var prob = document.getElementById('monkeyProb').textContent;
        var keys = document.getElementById('monkeyKeys').textContent;
        var time = document.getElementById('monkeyTime').textContent;

        var report = '=== INFINITE MONKEY THEOREM ODDS & DEEP TIME REPORT ===\n' +
          'Target String: "' + text + '" (' + text.length + ' characters)\n' +
          'Alphabet Search Space: 27 Characters (A-Z + Space)\n' +
          'Probability Per Window: ' + prob + '\n' +
          'Expected Keystrokes (27^L): ' + keys + '\n' +
          'Expected Time for 1 Monkey (10 keys/s): ' + time + '\n' +
          'Calculated via Digital Tools Shed: ' + window.location.href;

        var btn = document.getElementById('copyMonkeyBtn');
        navigator.clipboard.writeText(report).then(function() {
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Odds Copied!';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#10b981';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 2500);
        });
      }

      var simRunning = false;
      var simTimer = null;
      var simChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';

      function toggleMonkeySim() {
        simRunning = !simRunning;
        var btn = document.getElementById('btnToggleSim');
        if (simRunning) {
          btn.textContent = 'Stop Simulation';
          simTimer = setInterval(function() {
            var stream = document.getElementById('monkeyStream');
            var chunk = '';
            for (var i = 0; i < 5; i++) {
              chunk += simChars.charAt(Math.floor(Math.random() * simChars.length));
            }
            stream.textContent = (stream.textContent + chunk).slice(-200);
          }, 50);
        } else {
          btn.textContent = 'Start Simulation';
          clearInterval(simTimer);
        }
      }

      document.addEventListener('DOMContentLoaded', calcMonkey);
      calcMonkey();
    </script>
  `;

  writeFileSync(join(utilDir, 'infinite-monkey-calculator.html'), renderPage({
    title: 'Infinite Monkey Theorem Calculator: Typo Odds & Time | Digital Tools Shed',
    metaDesc: 'Calculate the mathematical probability and time required for a monkey typing randomly to produce any word or phrase. Compares against the age of the universe.',
    canonical: `${DOMAIN}/util/infinite-monkey-calculator`,
    bodyContent: monkeyHtml,
    currentPath: '/util/infinite-monkey-calculator',
    faqSchema: [
      {
        q: "What is the mathematical premise of the Infinite Monkey Theorem?",
        a: "An infinite sequence of random keystrokes will almost surely contain any finite text, including the complete works of Shakespeare."
      },
      {
        q: "Why does adding just one letter make the time 27 times longer?",
        a: "Because each additional character multiplies the total permutation space by 27 (27^L)."
      },
      {
        q: "How long would it take a monkey to type the word 'BANANA'?",
        a: "At 10 keys per second on a 27-key keyboard (387,420,489 combinations), a single monkey takes approximately 1.23 years of continuous typing."
      },
      {
        q: "Has this ever been tested with actual living monkeys?",
        a: "Yes, in 2002 at Paignton Zoo, macaques mainly produced the letter 'S', smashed the computer with stones, and urinated on it."
      },
      {
        q: "What is the difference between a random number generator and a physical monkey?",
        a: "Physical primates have biomechanical biases, preferred strike positions, and fatigue, destroying uniform randomness."
      }
    ]
  }));

  // 10. SIMULATION HYPOTHESIS CALCULATOR (/util/simulation-argument-calculator.html)
  // ──────────────────────────────────────────────────────────────────────────
  const simHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Simulation Hypothesis
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #10b981; margin-bottom: 0.5rem;">2 AM Metaphysical Trilemma</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">The Simulation Argument Probability Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Are we living in primordial base reality or inside an ancestor computer simulation? Calculate the Bayesian probability using Oxford philosopher Nick Bostrom\'s 2003 Trilemma.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">f_p: Civilizations Reaching Posthuman Tech (%)</label>
            <input type="range" id="sim-fp" min="1" max="100" value="40" oninput="calcSim()" style="width: 100%; cursor: pointer;" />
            <div id="sim-fp-val" style="font-family: var(--mono); font-size: 0.9rem; color: #3b82f6;">40% (Survives extinction)</div>
          </div>

          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">f_sim: Posthuman Species Running Ancestor Sims (%)</label>
            <input type="range" id="sim-fsim" min="1" max="100" value="50" oninput="calcSim()" style="width: 100%; cursor: pointer;" />
            <div id="sim-fsim-val" style="font-family: var(--mono); font-size: 0.9rem; color: #8b5cf6;">50% (Interested in ancestor history)</div>
          </div>

          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">N_I: Simulations Run Per Posthuman Species</label>
            <input type="range" id="sim-ni" min="1" max="1000" value="100" oninput="calcSim()" style="width: 100%; cursor: pointer;" />
            <div id="sim-ni-val" style="font-family: var(--mono); font-size: 0.9rem; color: #10b981;">100 simulations</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; text-align: center; margin-bottom: 1.5rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Probability of Being Simulated</span>
            <div id="simResult" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #ef4444; margin: 0.25rem 0;">95.2%</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Simulated minds outnumber biological originals</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #3b82f6; padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Probability of Base Reality</span>
            <div id="baseResult" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">4.8%</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Living in original primordial universe</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #10b981; padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Simulated-to-Real Mind Ratio</span>
            <div id="simRatio" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">20 : 1</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Virtual observers per real biological human</div>
          </div>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem 1.25rem; border-radius: 6px; font-size: 0.9rem; line-height: 1.6; color: var(--fg); margin-bottom: 1.25rem;">
          <strong>Bostrom\'s Trilemma:</strong> At least one of the following three propositions must be true:
          <ol style="margin-top: 0.5rem; padding-left: 1.2rem; color: var(--text-muted);">
            <li><strong>Proposition 1:</strong> Almost all human-level civilizations go extinct before reaching technological maturity.</li>
            <li><strong>Proposition 2:</strong> There is strong convergence among technologically mature civilizations not to run ancestor simulations.</li>
            <li><strong>Proposition 3:</strong> We are almost certainly living inside a computer simulation right now.</li>
          </ol>
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="button" id="copySimBtn" onclick="copySimAssessment()" class="btn-sm" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.5rem 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
            📋 Copy Bayesian Simulation Report
          </button>
        </div>
      </div>

      <!-- STEP-BY-STEP MATHEMATICAL DERIVATIONS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Nick Bostrom (2003) Bayesian Simulation Derivations</h2>
        <div style="display: grid; gap: 1rem; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">1. Expected Observers Formulation</strong>
            Let (f_p) be the fraction of civilizations reaching posthuman capability, and (f_{\text{sim}}) be the fraction that create ancestor simulations. If each simulating civilization runs (N_I) simulations, the expected ratio of simulated observers to biological originals is:
            $$\text{Ratio} = f_p \times f_{\text{sim}} \times N_I$$
            With current slider settings: <span id="derSimCalc">0.40 × 0.50 × 100 = 20.0 simulated minds per biological mind</span>.
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #ef4444;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">2. Self-Sampling Assumption (SSA) Bayesian Inversion</strong>
            According to the Self-Sampling Assumption: \"One should reason as if one were a random sample from the set of all observers in one\'s reference class.\"
            $$P(\text{Simulation}) = \frac{N_{\text{sim}}}{N_{\text{sim}} + N_{\text{bio}}} = \frac{f_p \cdot f_{\text{sim}} \cdot N_I}{1 + f_p \cdot f_{\text{sim}} \cdot N_I}$$
            When (N_I \gg 1), the denominator is dominated by (N_{\text{sim}}), causing (P(\text{Simulation}) \to 100\%).
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #10b981;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">3. Planetary Computational Bound (Bremermann\'s Limit)</strong>
            A single planetary supercomputer converting all mass into a quantum computer (computational limit (\approx 1.36 \times 10^{50}\) operations per second per kilogram) could execute the entire mental history of humanity (roughly (10^{35}) operations) in less than (10^{-15}) seconds, making the energy cost of running ancestor simulations negligible for posthumans.
          </div>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & METAPHYSICAL PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">5 Critical Traps & Fallacies in the Simulation Argument</h2>
        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #ef4444;">1. The Infinite Recursive Hierarchy Resource Collapse</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              If simulated beings create their own simulations (nested simulations), each tier demands an exponential multiplier of parent computing power. A civilization cannot simulate a universe with the same depth of quantum physics as its own without encountering a hard thermodynamic computational wall.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #f59e0b;">2. The Unproven Substrate-Independence Axiom</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Bostrom\'s trilemma relies entirely on functionalism: the philosophical premise that subjective consciousness is substrate-independent and can arise from silicon transistors or optical logic gates just as it does from carbon synapses. If consciousness requires biological or non-computable quantum biology (e.g. Penrose\'s Orch-OR), simulation probability drops to zero.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #10b981;">3. The Posthuman Ethics Prohibition (Proposition 2)</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Simulating conscious sentient human ancestors inherently involves recreating trillions of hours of human disease, physical agony, torture, heartbreak, and warfare. Technologically mature posthumans with advanced moral frameworks might legally outlaw ancestor simulations as extreme ethical crimes against sentient minds.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #3b82f6;">4. The Cognitive Glitch & Mandela Effect Misattribution</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Internet forums often cite memory slips, déjà vu, optical illusions, or the \"Mandela Effect\" as evidence of \"simulation render bugs.\" In reality, human memory is reconstructive and prone to neurobiological confabulation. A posthuman simulation engine would easily patch low-level memory discrepancies without leaving obvious perceptual glitches.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #8b5cf6;">5. Self-Sampling (SSA) vs Self-Indication (SIA) Discrepancy</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Under the Self-Indication Assumption (SIA), being alive gives evidence that the total number of observers in existence is huge. Physicists like Robin Hanson demonstrate that different observer reference classes produce wildly varying simulation probabilities, meaning our confidence in the 95%+ figure is subject to epistemic prior uncertainty.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ ACCORDION SECTION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions: The Simulation Argument</h2>
        <div class="faq-accordion" style="display: grid; gap: 0.75rem;">
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is Nick Bostrom\'s Simulation Argument?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Published in 2003 by Oxford philosopher Nick Bostrom, the argument proves mathematically that at least one of three statements must be true: either humanity goes extinct before creating simulated realities, advanced species choose never to simulate ancestors, or we are almost certainly simulated right now.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Does the argument prove we are definitely in a simulation?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              No. It is a strict trilemma. If you believe humanity will destroy itself before developing mature supercomputers (Proposition 1), or that posthumans consider ancestor simulations unethical or boring (Proposition 2), then the probability of being in a simulation remains very low.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How could a computer possibly simulate all atoms in the universe?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              A simulator does not need to compute trillions of galaxies down to the Planck scale continuously. Modern game engines use occlusion culling and lazy evaluation: rendering high resolution only where conscious observers are actively looking (analogous to the quantum wave function collapsing upon measurement).
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How does this differ from Descartes\' Evil Demon?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Descartes used philosophical skepticism to demonstrate that sensory experience could be fabricated by an evil demon. Bostrom\'s argument is not skeptical solipsism; it relies on modern evolutionary cosmology, probability theory, and computer science to deduce relative observer populations.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Can we perform any scientific test to detect if we are in a simulation?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Physicists like Silas Beane have proposed testing for grid artifacts in ultra-high-energy cosmic rays (Greisen-Zatsepin-Kuzmin cutoff) to determine if spacetime is discretized on a spatial lattice, which would be an engineering signature of a computational simulation.
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      function toggleFaq(btn) {
        var answer = btn.nextElementSibling;
        var icon = btn.querySelector('.faq-icon');
        var item = btn.closest('.faq-item');
        if (answer.style.display === 'block') {
          answer.style.display = 'none';
          icon.textContent = '+';
          item.classList.remove('open');
        } else {
          answer.style.display = 'block';
          icon.textContent = '−';
          item.classList.add('open');
        }
      }

      function calcSim() {
        var fp = parseFloat(document.getElementById('sim-fp').value) / 100;
        var fsim = parseFloat(document.getElementById('sim-fsim').value) / 100;
        var ni = parseFloat(document.getElementById('sim-ni').value);

        document.getElementById('sim-fp-val').textContent = (fp * 100).toFixed(0) + '% (Survives extinction)';
        document.getElementById('sim-fsim-val').textContent = (fsim * 100).toFixed(0) + '% (Interested in ancestor sims)';
        document.getElementById('sim-ni-val').textContent = ni.toLocaleString('en-US') + ' simulations per civilization';

        // Expected simulated minds per biological original
        var simRatio = fp * fsim * ni;
        var pSim = (simRatio / (1 + simRatio)) * 100;
        var pBase = 100 - pSim;

        document.getElementById('simResult').textContent = pSim.toFixed(1) + '%';
        document.getElementById('baseResult').textContent = pBase.toFixed(1) + '%';
        document.getElementById('simRatio').textContent = simRatio >= 1 ? simRatio.toFixed(1) + ' : 1' : '1 : ' + (1 / Math.max(0.001, simRatio)).toFixed(1);

        var dCalc = document.getElementById('derSimCalc');
        if (dCalc) {
          dCalc.textContent = fp.toFixed(2) + ' × ' + fsim.toFixed(2) + ' × ' + ni.toFixed(0) + ' = ' + simRatio.toFixed(1) + ' simulated minds per biological mind';
        }
      }

      function copySimAssessment() {
        var fp = document.getElementById('sim-fp-val').textContent;
        var fsim = document.getElementById('sim-fsim-val').textContent;
        var ni = document.getElementById('sim-ni-val').textContent;
        var pSim = document.getElementById('simResult').textContent;
        var pBase = document.getElementById('baseResult').textContent;
        var ratio = document.getElementById('simRatio').textContent;

        var report = '=== BOSTROM SIMULATION ARGUMENT BAYESIAN REPORT ===\n' +
          'Civilizations Reaching Maturity (f_p): ' + fp + '\n' +
          'Civilizations Running Ancestor Sims (f_sim): ' + fsim + '\n' +
          'Simulations Run Per Species (N_I): ' + ni + '\n' +
          'Simulated-to-Base Mind Ratio: ' + ratio + '\n' +
          'Probability We Live in a Simulation: ' + pSim + '\n' +
          'Probability of Base Primordial Reality: ' + pBase + '\n' +
          'Calculated via Digital Tools Shed: ' + window.location.href;

        var btn = document.getElementById('copySimBtn');
        navigator.clipboard.writeText(report).then(function() {
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Simulation Report Copied!';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#10b981';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 2500);
        });
      }

      document.addEventListener('DOMContentLoaded', calcSim);
      calcSim();
    </script>
  `;

  writeFileSync(join(utilDir, 'simulation-argument-calculator.html'), renderPage({
    title: 'Simulation Hypothesis Calculator: Are We in a Simulation? | Digital Tools Shed',
    metaDesc: 'Calculate the probability that we are living in a computer simulation using Nick Bostrom\'s 2003 Trilemma, Bayesian observer self-sampling, and posthuman computing limits.',
    canonical: `${DOMAIN}/util/simulation-argument-calculator`,
    bodyContent: simHtml,
    currentPath: '/util/simulation-argument-calculator',
    faqSchema: [
      {
        q: "What is Nick Bostrom's Simulation Argument?",
        a: "Published in 2003 by Oxford philosopher Nick Bostrom, it mathematically proves at least one of three statements must be true regarding extinction, desire to simulate, or living in a simulation."
      },
      {
        q: "Does the argument prove we are definitely in a simulation?",
        a: "No, it is a trilemma. If civilizations always go extinct or choose never to simulate ancestors, the simulation probability is near zero."
      },
      {
        q: "How could a computer possibly simulate all atoms in the universe?",
        a: "A posthuman simulation engine can utilize lazy evaluation and observer-relative rendering, computing high resolution only when conscious beings observe it."
      },
      {
        q: "How does this differ from Descartes' Evil Demon?",
        a: "Descartes used radical skepticism, whereas Bostrom uses empirical computational bounds, evolutionary biology, and anthropic probability theory."
      },
      {
        q: "Can we perform any scientific test to detect if we are in a simulation?",
        a: "Physicists have proposed searching for lattice discretization signatures in high-energy cosmic rays to identify computational boundaries."
      }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 11. EXISTENTIAL RISK & DOOM CALCULATOR (/util/existential-risk-calculator.html)
  // ──────────────────────────────────────────────────────────────────────────
  const xriskHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Existential Risk
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ef4444; margin-bottom: 0.5rem;">2 AM Civilizational Survival</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Existential Risk & 100-Year Human Survival Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Calculate the statistical odds of human civilizational survival over the next century across AI, engineered pandemics, nuclear war, and natural hazards based on Oxford philosopher Toby Ord\'s <em>The Precipice</em>.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <span style="font-size: 0.75rem; color: var(--text-muted); align-self: center;">Model Presets:</span>
          <button type="button" class="btn-sm" onclick="setXRPreset('ord')" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.6rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">Oxford (Toby Ord Precipice: ~1 in 6)</button>
          <button type="button" class="btn-sm" onclick="setXRPreset('optimist')" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.6rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">Techno-Optimist (~1 in 50)</button>
          <button type="button" class="btn-sm" onclick="setXRPreset('pessimist')" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.6rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">Existential Doom Peak (~1 in 2)</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Unaligned Artificial Superintelligence (%)</label>
            <input type="range" id="xr-ai" min="0" max="50" step="0.5" value="10" oninput="calcXR()" style="width: 100%; cursor: pointer;" />
            <div id="xr-ai-val" style="font-family: var(--mono); font-size: 0.85rem; color: #ef4444;">10.0% (Ord: 1 in 10)</div>
          </div>

          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Engineered Pandemics / Synthetic Bio (%)</label>
            <input type="range" id="xr-bio" min="0" max="30" step="0.5" value="3.3" oninput="calcXR()" style="width: 100%; cursor: pointer;" />
            <div id="xr-bio-val" style="font-family: var(--mono); font-size: 0.85rem; color: #f59e0b;">3.3% (Ord: 1 in 30)</div>
          </div>

          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Nuclear War & Severe Nuclear Winter (%)</label>
            <input type="range" id="xr-nuke" min="0" max="20" step="0.1" value="1.0" oninput="calcXR()" style="width: 100%; cursor: pointer;" />
            <div id="xr-nuke-val" style="font-family: var(--mono); font-size: 0.85rem; color: #eab308;">1.0% (Ord: 1 in 1,000 to 1 in 100)</div>
          </div>

          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Runaway Climate Change & Environmental (%)</label>
            <input type="range" id="xr-clim" min="0" max="15" step="0.1" value="0.1" oninput="calcXR()" style="width: 100%; cursor: pointer;" />
            <div id="xr-clim-val" style="font-family: var(--mono); font-size: 0.85rem; color: #10b981;">0.1% (Ord: 1 in 1,000)</div>
          </div>

          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Unforeseen Anthropogenic Risks (Nanotech, Physics) (%)</label>
            <input type="range" id="xr-other" min="0" max="20" step="0.5" value="3.3" oninput="calcXR()" style="width: 100%; cursor: pointer;" />
            <div id="xr-other-val" style="font-family: var(--mono); font-size: 0.85rem; color: #8b5cf6;">3.3% (Ord: 1 in 30)</div>
          </div>

          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Natural Risks (Supervolcanoes, Asteroids, Supernovae) (%)</label>
            <input type="range" id="xr-nat" min="0" max="5" step="0.01" value="0.01" oninput="calcXR()" style="width: 100%; cursor: pointer;" />
            <div id="xr-nat-val" style="font-family: var(--mono); font-size: 0.85rem; color: #3b82f6;">0.01% (Ord: 1 in 10,000)</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; text-align: center; margin-bottom: 1.5rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">100-Year Extinction Probability</span>
            <div id="xrTotal" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #ef4444; margin: 0.25rem 0;">16.7%</div>
            <div id="xrOdds" style="font-size: 0.75rem; color: var(--text-muted);">~1 in 6 chance of civilizational collapse</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #10b981; padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">100-Year Survival Probability</span>
            <div id="xrSurvival" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">83.3%</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Human potential reaches the next century</div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="button" id="copyXRBtn" onclick="copyXRAssessment()" class="btn-sm" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.5rem 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
            📋 Copy Existential Risk Assessment
          </button>
        </div>
      </div>

      <!-- STEP-BY-STEP MATHEMATICAL DERIVATIONS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">The Precipice Risk Model: Mathematical Derivations</h2>
        <div style="display: grid; gap: 1rem; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #ef4444;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">1. Joint Survival Probability Multiplicative Law</strong>
            Assuming statistical independence across major existential threat vectors (r_1, r_2, \dots, r_n), the probability that humanity survives all vectors across the 100-year window is:
            $$P(\text{Survival}) = \prod_{i=1}^n (1 - r_i) = (1 - r_{\text{AI}})(1 - r_{\text{Bio}})(1 - r_{\text{Nuke}})(1 - r_{\text{Clim}})(1 - r_{\text{Other}})(1 - r_{\text{Nat}})$$
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #f59e0b;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">2. Complementary Extinction Formulation</strong>
            $$P(\text{Extinction}) = 1 - P(\text{Survival})$$
            $$\text{Odds of Collapse} = 1 \text{ in } \left(\frac{100}{P(\text{Extinction})\%}\right)$$
            Under Toby Ord\'s baseline estimates ((r_{\text{AI}} = 10\%, r_{\text{Bio}} = 3.3\%, r_{\text{Other}} = 3.3\%, r_{\text{Nuke}} = 1\%)), (P(\text{Survival}) = 0.833) ((83.3\%)), yielding an exact total risk of (16.7\%) ((1 \text{ in } 6.0)).
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #10b981;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">3. Nick Bostrom\'s Astronomical Value Principle</strong>
            If human civilization survives and colonizes our local supercluster, the future could support approximately (10^{52}) happy, conscious biological and digital lives over cosmic time. Therefore, reducing existential risk by just <strong>one millionth of one percent</strong> ((10^{-8})) has an expected value equivalent to saving (10^{44}) future human lives.
          </div>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & EXISTENTIAL RISK PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">5 Critical Fallacies in Existential Risk Modeling</h2>
        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #ef4444;">1. The Statistical Risk Independence Fallacy (Poly-Crisis Cascade)</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              The multiplicative model assumes AI, bioweapons, climate disruption, and nuclear tensions are uncorrelated independent variables. In reality, a severe climate failure will collapse agricultural trade, driving desperate nuclear superpowers into conflict, while competitive AI races lead nations to bypass critical safety protocols.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #f59e0b;">2. Anthropogenic vs Natural Risk Asymmetry (2,000x Disparity)</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Homo sapiens have survived 200,000 years of natural hazards (supervolcanoes, ice ages, comets) without going extinct. The background natural extinction rate is less than 1 in 10,000 per century. Anthropogenic threats created by human technology account for over <strong>99.9%</strong> of our current extinction danger.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #10b981;">3. Confusing Global Catastrophe with Existential Extinction</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              A catastrophic event that kills 90% of humanity (like the Black Death or a localized nuclear exchange) is an unimaginable tragedy, but NOT an existential catastrophe if the remaining 10% can eventually recover and rebuild civilizational technological capabilities. True existential risk requires the <strong>permanent and irrevocable destruction</strong> of human potential.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #3b82f6;">4. Anthropic Survivorship Bias (The Silent Graveyard)</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              People assume that because humanity survived the 1962 Cuban Missile Crisis and the Cold War, our institutions are fundamentally robust. But an observer can only ever find themselves in a timeline where their civilization did not blow itself up. Historical survival provides zero statistical proof of ongoing systemic safety.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #8b5cf6;">5. Unrecoverable Dystopian Lock-In (Permanent Tyranny)</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Existential risk includes not only biological extinction, but also permanent stagnation or unrecoverable totalitarian dystopias. Ubiquitous AI facial recognition, biometric monitoring, and autonomous enforcement drones could allow a totalitarian regime to achieve permanent lock-in, forever extinguishing freedom and potential.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ ACCORDION SECTION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions: Existential Risk & Human Survival</h2>
        <div class="faq-accordion" style="display: grid; gap: 0.75rem;">
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is an existential risk as defined by modern philosophy?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              An existential risk is a risk that threatens the premature extinction of Earth-originating intelligent life or the permanent and drastic destruction of its potential for desirable future development.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Why did Oxford philosopher Toby Ord calculate a 1 in 6 risk this century?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              In his 2020 book <em>The Precipice</em>, Ord aggregated comprehensive peer-reviewed scientific studies across AI safety, bioweapon proliferation, nuclear war, and climate feedback loops, concluding humanity\'s total extinction risk this century is approximately 1 in 6 (Russian roulette with a six-chambered revolver).
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Why is artificial intelligence considered the single highest existential threat?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Unlike past technologies that amplified human physical strength, AI amplifies cognitive steering. An artificial superintelligence with goals misaligned with human survival would possess strategic, social, and technological capabilities vastly exceeding all of humanity combined.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Why are natural extinction risks considered negligible compared to tech?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Fossil records demonstrate that mammalian species survive an average of 1 to 2 million years before natural extinction. Humanity survived roughly 2,000 centuries as hunter-gatherers, proving the background natural risk is on the order of 1 in 10,000 per century.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What can humanity do right now to safeguard civilizational survival?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Key priorities include technical AI alignment research, international DNA synthesis screening to prevent synthetic pathogen printing, early pathogen detection wastewater sequencing, hardening critical infrastructure against EMPs, and maintaining diplomatic de-escalation hotlines.
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      function setXRPreset(preset) {
        if (preset === 'ord') {
          document.getElementById('xr-ai').value = 10.0;
          document.getElementById('xr-bio').value = 3.3;
          document.getElementById('xr-nuke').value = 1.0;
          document.getElementById('xr-clim').value = 0.1;
          document.getElementById('xr-other').value = 3.3;
          document.getElementById('xr-nat').value = 0.01;
        } else if (preset === 'optimist') {
          document.getElementById('xr-ai').value = 1.0;
          document.getElementById('xr-bio').value = 0.5;
          document.getElementById('xr-nuke').value = 0.2;
          document.getElementById('xr-clim').value = 0.1;
          document.getElementById('xr-other').value = 0.2;
          document.getElementById('xr-nat').value = 0.01;
        } else if (preset === 'pessimist') {
          document.getElementById('xr-ai').value = 35.0;
          document.getElementById('xr-bio').value = 15.0;
          document.getElementById('xr-nuke').value = 5.0;
          document.getElementById('xr-clim').value = 3.0;
          document.getElementById('xr-other').value = 8.0;
          document.getElementById('xr-nat').value = 0.05;
        }
        calcXR();
      }

      function calcXR() {
        var ai = parseFloat(document.getElementById('xr-ai').value) / 100;
        var bio = parseFloat(document.getElementById('xr-bio').value) / 100;
        var nuke = parseFloat(document.getElementById('xr-nuke').value) / 100;
        var clim = parseFloat(document.getElementById('xr-clim').value) / 100;
        var other = parseFloat(document.getElementById('xr-other').value) / 100;
        var nat = parseFloat(document.getElementById('xr-nat').value) / 100;

        document.getElementById('xr-ai-val').textContent = (ai * 100).toFixed(1) + '% (Ord: 1 in 10)';
        document.getElementById('xr-bio-val').textContent = (bio * 100).toFixed(1) + '% (Ord: 1 in 30)';
        document.getElementById('xr-nuke-val').textContent = (nuke * 100).toFixed(1) + '% (Ord: 1 in 100)';
        document.getElementById('xr-clim-val').textContent = (clim * 100).toFixed(1) + '% (Ord: 1 in 1,000)';
        document.getElementById('xr-other-val').textContent = (other * 100).toFixed(1) + '% (Ord: 1 in 30)';
        document.getElementById('xr-nat-val').textContent = (nat * 100).toFixed(2) + '% (Ord: 1 in 10,000)';

        // Multiplicative survival model: P(Survive) = Product(1 - r_i)
        var pSurvive = (1 - ai) * (1 - bio) * (1 - nuke) * (1 - clim) * (1 - other) * (1 - nat);
        var pDoom = (1 - pSurvive) * 100;
        var odds = pDoom > 0 ? (100 / pDoom) : 999;

        document.getElementById('xrTotal').textContent = pDoom.toFixed(1) + '%';
        document.getElementById('xrSurvival').textContent = (pSurvive * 100).toFixed(1) + '%';
        document.getElementById('xrOdds').textContent = '~1 in ' + odds.toFixed(1) + ' chance of civilizational collapse';
      }

      function copyXRAssessment() {
        var ai = document.getElementById('xr-ai-val').textContent;
        var bio = document.getElementById('xr-bio-val').textContent;
        var nuke = document.getElementById('xr-nuke-val').textContent;
        var clim = document.getElementById('xr-clim-val').textContent;
        var other = document.getElementById('xr-other-val').textContent;
        var nat = document.getElementById('xr-nat-val').textContent;
        var total = document.getElementById('xrTotal').textContent;
        var surv = document.getElementById('xrSurvival').textContent;
        var odds = document.getElementById('xrOdds').textContent;

        var report = '=== 100-YEAR EXISTENTIAL RISK & CIVILIZATIONAL SURVIVAL REPORT ===\n' +
          'Artificial Superintelligence Risk: ' + ai + '\n' +
          'Engineered Pandemics / Synthetic Bio: ' + bio + '\n' +
          'Nuclear War & Nuclear Winter: ' + nuke + '\n' +
          'Runaway Climate Change: ' + clim + '\n' +
          'Unforeseen Anthropogenic Tech: ' + other + '\n' +
          'Natural Hazards (Supervolcano, Asteroid): ' + nat + '\n' +
          'Cumulative 100-Year Extinction Risk: ' + total + ' (' + odds + ')\n' +
          'Cumulative 100-Year Survival Probability: ' + surv + '\n' +
          'Model Reference: Oxford Toby Ord (The Precipice)\n' +
          'Calculated via Digital Tools Shed: ' + window.location.href;

        var btn = document.getElementById('copyXRBtn');
        navigator.clipboard.writeText(report).then(function() {
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Risk Report Copied!';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#10b981';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 2500);
        });
      }

      document.addEventListener('DOMContentLoaded', calcXR);
      calcXR();
    </script>
  `;

  writeFileSync(join(utilDir, 'existential-risk-calculator.html'), renderPage({
    title: 'Existential Risk & 100-Year Human Survival Calculator | Digital Tools Shed',
    metaDesc: 'Calculate the probability of humanity surviving the next 100 years across artificial intelligence, bioweapons, and nuclear war based on Oxford\'s The Precipice.',
    canonical: `${DOMAIN}/util/existential-risk-calculator`,
    bodyContent: xriskHtml,
    currentPath: '/util/existential-risk-calculator',
    faqSchema: [
      {
        q: "What is an existential risk as defined by modern philosophy?",
        a: "An existential risk threatens the premature extinction of intelligent life or the permanent destruction of its potential for desirable development."
      },
      {
        q: "Why did Oxford philosopher Toby Ord calculate a 1 in 6 risk this century?",
        a: "In The Precipice, Ord aggregated peer-reviewed studies across AI safety, bioweapons, nuclear war, and climate disruption, deriving a 1 in 6 cumulative risk."
      },
      {
        q: "Why is artificial intelligence considered the single highest existential threat?",
        a: "Because superintelligence steers capabilities faster than biological humans, misaligned goals could permanently disempower or eliminate humanity."
      },
      {
        q: "Why are natural extinction risks considered negligible compared to tech?",
        a: "Humanity survived 200,000 years of nature; fossil records show mammalian species survive ~1-2 million years, making natural background risk < 1 in 10,000/century."
      },
      {
        q: "What can humanity do right now to safeguard civilizational survival?",
        a: "Priorities include technical AI alignment, DNA synthesis biosecurity screening, early metagenomic wastewater pathogen detection, and de-escalation hotlines."
      }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 12. HEAT DEATH OF THE UNIVERSE TIMELINE (/util/heat-death-timeline.html)
  // ──────────────────────────────────────────────────────────────────────────
  const heatDeathHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Heat Death Timeline
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #a855f7; margin-bottom: 0.5rem;">2 AM Deep Time Void</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">The Heat Death of the Universe Logarithmic Timeline</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Scrub across 100 orders of magnitude of cosmological deep time: from the death of the Sun to proton decay, the evaporation of black holes, and the eternal Dark Era.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Logarithmic Deep Time Scrubber (10^X Years into Future)</label>
            <span id="hdExpDisplay" style="font-family: var(--mono); font-size: 0.85rem; color: #a855f7; font-weight: bold;">10^10 Years</span>
          </div>
          <input type="range" id="hdSlider" min="0" max="100" value="10" oninput="updateHDTimeline(this.value)" style="width: 100%; cursor: pointer;" />
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; text-align: center; margin-bottom: 1.5rem;">
          <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Future Cosmic Epoch</div>
          <div id="hdYear" style="font-family: var(--mono); font-size: 2.4rem; font-weight: bold; color: #a855f7; margin: 0.25rem 0;">Year 10^10 (10 Billion)</div>
          <div id="hdEra" style="font-family: var(--serif); font-size: 1.3rem; color: var(--fg); margin-top: 0.35rem;">The Stelliferous Era</div>
          <div id="hdThermodynamics" style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem;">Active Hydrogen Fusion & Galactic Evolution</div>
        </div>

        <div id="hdDetails" style="background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; font-size: 0.95rem; line-height: 1.6; color: var(--fg); margin-bottom: 1.25rem;"></div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="button" id="copyHDBtn" onclick="copyTimelineAssessment()" class="btn-sm" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.5rem 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
            📋 Copy Cosmological Epoch Details
          </button>
        </div>
      </div>

      <!-- STEP-BY-STEP MATHEMATICAL & PHYSICAL DERIVATIONS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Fred Adams & Gregory Laughlin 5 Cosmic Eras: Step-by-Step Derivations</h2>
        <div style="display: grid; gap: 1rem; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">1. The 5 Thermodynamic Cosmic Eras</strong>
            <ul>
              <li><strong>1. Primordial Era ((10^{-50} \le t < 10^5) yrs):</strong> Inflation, Big Bang nucleosynthesis, CMB recombination.</li>
              <li><strong>2. Stelliferous Era ((10^6 \le t < 10^{14}) yrs):</strong> Star birth, nuclear burning, biological life (WE ARE HERE: age (1.38 \times 10^{10}) yrs is only 0.0138% through!).</li>
              <li><strong>3. Degenerate Era ((10^{15} \le t < 10^{39}) yrs):</strong> White dwarfs, neutron stars, black holes, brown dwarfs. All stars dead.</li>
              <li><strong>4. Black Hole Era ((10^{40} \le t < 10^{100}) yrs):</strong> Proton decay wipes atomic matter; only black holes survive.</li>
              <li><strong>5. Dark Era ((t \ge 10^{101}) yrs):</strong> Hawking evaporation completes; diffuse photons, leptons, absolute cold.</li>
            </ul>
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #a855f7;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">2. Hawking Radiation Evaporation Time Formula</strong>
            For a Schwarzschild black hole of mass (M), quantum virtual particle pairs at the event horizon evaporate the mass over timescale:
            $$\tau = \frac{5120 \pi G^2 M^3}{\hbar c^4} \approx 2.1 \times 10^{67} \left(\frac{M}{M_\odot}\right)^3\text{ years}$$
            For a stellar black hole ((3 M_\odot)), (\tau \approx 5.6 \times 10^{68}) years. For TON 618 (66 billion (M_\odot)), (\tau \approx 6.0 \times 10^{99}) years.
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #ef4444;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">3. Proton Decay & Grand Unification (GUT Scale)</strong>
            $$p^+ \to e^+ + \pi^0 \to e^+ + 2\gamma$$
            Under minimal GUT models, baryon number is not conserved. With a half-life of (10^{34}) to (10^{38}) years, every atomic nucleus in every dead star, planet, and asteroid dissolves into positrons, neutrinos, and gamma-ray photons by year (10^{40}).
          </div>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & COSMOLOGICAL PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">5 Critical Fallacies in Deep Time & Cosmology</h2>
        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #ef4444;">1. The Logarithmic Scale Collapse Delusion</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              The human mind treats a slider from 0 to 100 as linear. Moving from (10^{10}) to (10^{20}) is not \"twice as long\"—it is ten billion times longer than the entire age of the universe. (10^{100}) exceeds the total number of atoms in the observable universe ((10^{80})) by twenty orders of magnitude.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #f59e0b;">2. The Unobserved Proton Decay Hypothesis</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Proton decay is essential for the transition to the Black Hole Era. However, giant subterranean water Cherenkov detectors like Super-Kamiokande have not detected a single proton decay event, establishing an empirical lower bound of (\tau_p > 1.6 \times 10^{34}) years. If protons never decay, cold matter persists until quantum tunneling converts all matter into iron stars at year (10^{1500}).
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #10b981;">3. Phantom Dark Energy & The Big Rip Alternative</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Heat Death assumes dark energy obeys an exact cosmological constant (w = -1). If dark energy is phantom energy ((w < -1)), the expansion rate accelerates asymptotically into a <strong>Big Rip</strong> within ~22 billion years, tearing galaxies, stars, planets, and atomic nuclei apart long before the Stelliferous Era can naturally conclude.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #3b82f6;">4. The Boltzmann Brain Paradox in de Sitter Vacuum</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              In an eternal de Sitter vacuum with temperature (T \sim 10^{-30}) K, rare thermodynamic quantum fluctuations will eventually spontaneously assemble conscious observer brains complete with false memories. Over infinite time, these \"Boltzmann Brains\" vastly outnumber biologically evolved observers unless vacuum decay triggers first.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #8b5cf6;">5. The True Definition of Absolute Zero Asymptote</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              The Third Law of Thermodynamics strictly prevents any physical system from reaching absolute zero ((0\text{ K})) in a finite number of steps. The expanding cosmic cosmological event horizon emits de Sitter Gibbons-Hawking radiation at roughly (T_{\text{dS}} \approx 10^{-30}\text{ K}), ensuring an eternal quantum thermal floor.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ ACCORDION SECTION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions: The Heat Death of the Universe</h2>
        <div class="faq-accordion" style="display: grid; gap: 0.75rem;">
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is the Heat Death of the universe?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Heat Death (the Big Freeze) is the ultimate thermodynamic state of the universe where all physical processes cease. As entropy reaches its absolute maximum, temperature gradients flatten, stars burn out, black holes evaporate, and no thermodynamic work can ever be extracted again.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Why are we living in the very dawn of the universe right now?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              The Stelliferous Era (the star-bearing era) lasts roughly 100 trillion years ((10^{14}) years). Our universe is currently only 13.8 billion years old ((1.38 \times 10^{10}) years), meaning only <strong>0.0138%</strong> of the star-forming era has elapsed. We exist in the earliest cosmological morning.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How do black holes evaporate if nothing can escape their gravity?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              In 1974, Stephen Hawking proved quantum vacuum fluctuations create virtual particle-antiparticle pairs near the event horizon. One particle falls in while the other escapes as thermal radiation. To conserve energy, the black hole loses mass, evaporating completely over (10^{67}) to (10^{100}) years.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is proton decay and why does it dissolve solid matter?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Protons form atomic nuclei. Grand Unified Theories predict that protons are slightly unstable with half-lives around (10^{34}) to (10^{38}) years. When protons decay into leptons and gamma rays, atoms dissolve completely, turning all solid rocks, dead planets, and white dwarfs into pure radiation.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Could conscious life survive in the Black Hole Era?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Theoretically, advanced civilizations could harvest energy from rotating black holes using the Penrose Process or by encircling black holes with Dyson swarms to capture Hawking radiation. By slowing down subjective clock speeds (computational hibernation), digital minds could extract subjective eons of thought.
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      var hdMilestones = [
        { exp: 0, title: 'Year 1 (Today)', era: 'The Present Day', thermo: 'Active Stellar Fusion & Anthropocene Biosphere', desc: 'Conscious biological beings build supercomputers, gaze at starry skies, and peer into deep time. Stars actively form across hundreds of billions of galaxies.' },
        { exp: 8, title: 'Year 10^8 (100 Million Yrs)', era: 'Saturn Ring Evaporation', thermo: 'Planetary Gravitational Resonances', desc: 'Saturn\'s magnificent ice rings are completely drained into the planet\'s upper atmosphere by magnetic ring-rain. Earth experiences continuous continental drift.' },
        { exp: 9, title: 'Year 10^9 (1 Billion Yrs)', era: 'The Solar Evaporation Era', thermo: 'Solar Core Helium Accumulation', desc: 'The Sun\'s core temperature rises, expanding solar luminosity by 10%. Terrestrial oceans boil away entirely into space. Surface life vanishes; only subterranean extremophiles survive.' },
        { exp: 10, title: 'Year 10^10 (10 Billion Yrs)', era: 'The Stelliferous Era (Sun Dies)', thermo: 'Red Giant Transition & White Dwarf Cooling', desc: 'The Sun exhausts core hydrogen, expands into a red giant consuming Mercury and Venus, and sheds its outer envelope into a planetary nebula, leaving behind a cold white dwarf.' },
        { exp: 12, title: 'Year 10^12 (1 Trillion Yrs)', era: 'The Milkomeda Elliptical Galaxy', thermo: 'Intergalactic Gas Starvation', desc: 'The Milky Way and Andromeda merge into a giant elliptical galaxy. Cosmological acceleration pulls distant galactic clusters beyond our cosmological event horizon.' },
        { exp: 14, title: 'Year 10^14 (100 Trillion Yrs)', era: 'End of Star Formation', thermo: 'Exhaustion of Interstellar Molecular Clouds', desc: 'The longest-lived red dwarf stars exhaust their hydrogen reserves. The last stars burn out. The universe goes permanently dark to human vision. Only stellar remnants remain.' },
        { exp: 15, title: 'Year 10^15 (1 Quadrillion Yrs)', era: 'The Degenerate Era', thermo: 'Gravitational Dynamical Relaxation', desc: 'Dead stars and planets encounter rogue bodies. Orbits decay via gravitational radiation. Dead planets are stripped from parent stars and tossed into the cosmic void.' },
        { exp: 19, title: 'Year 10^19 (10 Quintillion Yrs)', era: 'Galaxy Evaporation', thermo: 'Gravitational Scattering & Slingshots', desc: 'Over 99% of dead stellar remnants in galaxies are flung out into intergalactic space by near-miss gravitational slingshots. The remaining 1% collapse into central supermassive black holes.' },
        { exp: 34, title: 'Year 10^34 (Minimal Proton Decay)', era: 'Onset of Nucleon Instability', thermo: 'Grand Unified Scale Baryon Decay', desc: 'The minimal theoretical threshold for proton decay is breached. Positrons and pions begin radiating from inside atomic nuclei across all matter.' },
        { exp: 40, title: 'Year 10^40 (Total Proton Decay)', era: 'The Black Hole Era', thermo: 'Total Dissolution of Baryonic Matter', desc: 'All protons and neutrons within atomic nuclei have decayed into positrons, neutrinos, and radiation. All planets, moons, and dead stars completely dissolve. Only black holes exist.' },
        { exp: 67, title: 'Year 10^67 (Stellar Black Holes Die)', era: 'Hawking Radiation Evaporation', thermo: 'Quantum Virtual Particle Radiation', desc: 'Stellar-mass black holes (3 to 20 solar masses) completely evaporate into photons and gravitons, ending with a violent final burst of high-energy gamma rays.' },
        { exp: 100, title: 'Year 10^100 (The Big Freeze)', era: 'The Dark Era', thermo: 'Thermodynamic Maximum Entropy', desc: 'The most gargantuan supermassive black holes (TON 618, Phoenix A) evaporate in blinding flashes of radiation. No thermodynamic free energy remains anywhere. The universe reaches maximum entropy.' }
      ];

      function updateHDTimeline(val) {
        var exp = parseInt(val, 10);
        document.getElementById('hdExpDisplay').textContent = '10^' + exp + ' Years';

        var cur = hdMilestones[0];
        for (var i = 0; i < hdMilestones.length; i++) {
          if (exp >= hdMilestones[i].exp) {
            cur = hdMilestones[i];
          }
        }

        document.getElementById('hdYear').textContent = 'Year 10^' + exp;
        document.getElementById('hdEra').textContent = cur.era;
        document.getElementById('hdThermodynamics').textContent = cur.thermo;
        document.getElementById('hdDetails').innerHTML = '<strong>' + cur.title + ':</strong> ' + cur.desc;
      }

      function copyTimelineAssessment() {
        var year = document.getElementById('hdYear').textContent;
        var era = document.getElementById('hdEra').textContent;
        var thermo = document.getElementById('hdThermodynamics').textContent;
        var details = document.getElementById('hdDetails').textContent;

        var report = '=== COSMOLOGICAL DEEP TIME & HEAT DEATH REPORT ===\n' +
          'Selected Cosmic Epoch: ' + year + '\n' +
          'Thermodynamic Era: ' + era + '\n' +
          'Dominant Physical Process: ' + thermo + '\n' +
          'Cosmic Event Summary: ' + details + '\n' +
          'Reference: Adams & Laughlin (1997) Five Cosmic Eras\n' +
          'Calculated via Digital Tools Shed: ' + window.location.href;

        var btn = document.getElementById('copyHDBtn');
        navigator.clipboard.writeText(report).then(function() {
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Epoch Details Copied!';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#10b981';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 2500);
        });
      }

      document.addEventListener('DOMContentLoaded', function() { updateHDTimeline(10); });
    </script>
  `;

  writeFileSync(join(utilDir, 'heat-death-timeline.html'), renderPage({
    title: 'The Heat Death of the Universe: Deep Time Logarithmic Timeline | Digital Tools Shed',
    metaDesc: 'Interactive deep time logarithmic slider tracking the universe from the death of the Sun to proton decay, black hole evaporation, and the Big Freeze.',
    canonical: `${DOMAIN}/util/heat-death-timeline`,
    bodyContent: heatDeathHtml,
    currentPath: '/util/heat-death-timeline',
    faqSchema: [
      {
        q: "What is the Heat Death of the universe?",
        a: "Heat Death (the Big Freeze) is the ultimate thermodynamic state of maximum entropy where temperature gradients flatten and all physical work ceases."
      },
      {
        q: "Why are we living in the very dawn of the universe right now?",
        a: "The star-forming Stelliferous Era lasts 100 trillion years; at 13.8 billion years old, only 0.0138% of the star-forming era has elapsed."
      },
      {
        q: "How do black holes evaporate if nothing can escape their gravity?",
        a: "Quantum vacuum fluctuations at the event horizon produce Hawking radiation, causing black holes to slowly lose mass over 10^67 to 10^100 years."
      },
      {
        q: "What is proton decay and why does it dissolve solid matter?",
        a: "Predicted by GUT models, proton decay causes atomic nuclei to decay into positrons and photons, completely dissolving all baryonic matter."
      },
      {
        q: "Could conscious life survive in the Black Hole Era?",
        a: "Digital minds could theoretically harvest energy from rotating black holes via the Penrose process, slowing clock speeds to survive subjective eons."
      }
    ]
  }));

  console.log('  ✓ Built Viral & Reality Suite (AI Water Counter, Desmos Graphing Calculator, Scale Visualizer, Fermi Paradox, Cosmic Calendar, Life in Weeks, Billion Seconds, Blast Radius, Infinite Monkey, Simulation Argument, Existential Risk, Heat Death Timeline)');
}
