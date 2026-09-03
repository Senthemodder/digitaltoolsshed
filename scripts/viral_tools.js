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
          <div class="ticker-sub"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M15 11c0-3-2-5-5-5s-5 2-5 5c0 2.8 2 5 5 7 3-2 5-4.2 5-7z"/><path d="M19 11c0-3-2-5-5-5"/><path d="M19 11c0 2.8-2 5-5 7"/></svg> Global Beef & Cattle Farming</div>
          <div class="ticker-val" id="valCattleWater" style="color: #ef4444;">0.00 L</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">~58,000,000 Liters/sec (165,000x more water than all global AI)</div>
          <div class="bar-track"><div class="bar-fill" style="width: 100%; background: #ef4444;"></div></div>
        </div>

        <div class="ticker-card" style="border-left: 4px solid #22c55e;">
          <div class="ticker-sub"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M4 22V4l12 5-12 5"/><circle cx="4" cy="22" r="1" fill="currentColor" stroke="none"/></svg> Global Golf Course Irrigation</div>
          <div class="ticker-val" id="valGolfWater" style="color: #22c55e;">0.00 L</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">~115,000 Liters/sec (328x more water than all global AI)</div>
          <div class="bar-track"><div class="bar-fill" style="width: 25%; background: #22c55e;"></div></div>
        </div>

        <div class="ticker-card" style="border-left: 4px solid #f59e0b;">
          <div class="ticker-sub"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M20.4 5.6L16 4l-4 2-4-2-4.4 1.6L5 10h3v12h8V10h3l1.4-4.4z"/></svg> Cotton & Fast Fashion Manufacturing</div>
          <div class="ticker-val" id="valCottonWater" style="color: #f59e0b;">0.00 L</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">~2,900,000 Liters/sec (8,200x more water than all global AI)</div>
          <div class="bar-track"><div class="bar-fill" style="width: 60%; background: #f59e0b;"></div></div>
        </div>
      </div>

      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Personal AI Query Footprint Calculator</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          Based on the landmark UC Riverside / UT Arlington peer-reviewed study (<em>"Making AI Less Thirsty"</em>): 1 ChatGPT query uses approximately <strong>0.019 liters (19 ml / 3.8 teaspoons)</strong> of cooling water.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Prompts You Send Per Day</label>
            <input type="number" id="userPrompts" value="30" min="1" max="10000" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono); font-size: 1.1rem;" oninput="calcPersonalFootprint()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Display Units</label>
            <select id="waterUnit" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem;" onchange="calcPersonalFootprint()">
              <option value="L">Liters (L)</option>
              <option value="gal">US Gallons (gal)</option>
              <option value="bottles">500ml Water Bottles</option>
            </select>
          </div>
        </div>

        <div id="personalFootprintResults" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;"></div>
      </div>

      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
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
              <td style="padding: 0.5rem 0.75rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M4 4l2.5 2.5"/><path d="M13.5 6.5a4 4 0 0 0-5.7 5.7"/><circle cx="12" cy="15" r="1" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="1" fill="currentColor" stroke="none"/><circle cx="14" cy="18" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="21" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="21" r="1" fill="currentColor" stroke="none"/><circle cx="8" cy="21" r="1" fill="currentColor" stroke="none"/></svg> 1 Standard 8-Minute Shower</td>
              <td style="padding: 0.5rem 0.75rem;">65 L</td>
              <td style="padding: 0.5rem 0.75rem; color: #22c55e;"><strong>3,421 Queries</strong></td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem 0.75rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M4 15h16a2 2 0 0 1 0 4H4a2 2 0 0 1 0-4z"/><path d="M4 11h16c1.1 0 2-.4 2-1s-1.8-3-10-3S2 9.4 2 10s.9 1 2 1z"/><line x1="4" y1="13" x2="20" y2="13"/></svg> 1 Quarter-Pound Beef Burger</td>
              <td style="padding: 0.5rem 0.75rem; color: #ef4444;"><strong>1,750 L</strong></td>
              <td style="padding: 0.5rem 0.75rem; color: #ef4444;"><strong>92,105 Queries</strong></td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0.75rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M6 2h12v6l-3 14H9L6 8V2z"/><line x1="12" y1="8" x2="12" y2="22"/></svg> 1 Pair of Denim Jeans</td>
              <td style="padding: 0.5rem 0.75rem; color: #ef4444;"><strong>7,500 L</strong></td>
              <td style="padding: 0.5rem 0.75rem; color: #ef4444;"><strong>394,736 Queries</strong></td>
            </tr>
          </tbody>
        </table>
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

      calcPersonalFootprint();
      updateLiveTickers();
    </script>
  `;

  writeFileSync(join(calcDir, 'ai-water-calculator.html'), renderPage({
    title: 'How Much Water Does AI Use? Live Real-Time Reality Checker | Digital Tools Shed',
    metaDesc: 'Interactive live ticker comparing AI water consumption (ChatGPT, Claude, LLMs) vs cattle, golf courses, and coffee with personal footprint calculator.',
    canonical: `${DOMAIN}/calc/ai-water-calculator`,
    bodyContent: aiWaterHtml,
    currentPath: '/calc/ai-water-calculator'
  }));

  // 2. GRAPHING CALCULATOR (DESMOS CLONE)
  const graphHtml = `
    <div class="article-container" style="max-width: 1100px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/math/">Math Tools</a> &gt; Graphing Calculator
      </nav>

      <header style="margin-bottom: 1.5rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Online 2D Graphing Calculator (Desmos Alternative)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Plot mathematical functions, polynomials, trigonometric curves, and rational equations in real-time with pan, zoom, and coordinate tracing.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: 320px 1fr; gap: 1.25rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 8px; display: flex; flex-direction: column; gap: 1rem;">
          <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0;">Functions</h3>
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
            <button onclick="zoom(0.8)" class="btn-secondary" style="flex: 1; padding: 0.4rem; font-size: 0.85rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Zoom +</button>
            <button onclick="zoom(1.25)" class="btn-secondary" style="flex: 1; padding: 0.4rem; font-size: 0.85rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Zoom -</button>
            <button onclick="resetView()" class="btn-secondary" style="flex: 1; padding: 0.4rem; font-size: 0.85rem;">Reset</button>
          </div>
        </div>
        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; position: relative;">
          <div style="position: absolute; top: 1.5rem; right: 1.5rem; font-family: var(--mono); font-size: 0.8rem; background: rgba(0,0,0,0.6); color: #fff; padding: 0.2rem 0.6rem; border-radius: 4px;" id="coordHUD">x: 0.00, y: 0.00</div>
          <canvas id="graphCanvas" width="700" height="500" style="width: 100%; height: 500px; cursor: grab; background: #0f172a; border-radius: 4px;"></canvas>
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
            .replace(/\\^/g, '**')
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
      renderGraph();
    </script>
  `;

  writeFileSync(join(mathDir, 'graphing-calculator.html'), renderPage({
    title: 'Free 2D Graphing Calculator Online (Desmos Alternative) | Digital Tools Shed',
    metaDesc: 'Interactive in-browser 2D graphing calculator: plot math functions, derivatives, trigonometric curves, and polynomials in real-time.',
    canonical: `${DOMAIN}/math/graphing-calculator`,
    bodyContent: graphHtml,
    currentPath: '/math/graphing-calculator'
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

        <div id="scaleResults" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;"></div>
      </div>
    </div>

    <script>
      function setScale(num) {
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
            '<span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><circle cx="12" cy="13" r="9"/><polyline points="12 9 12 13 15 16"/><path d="M12 4V2"/><path d="M10 2h4"/></svg> In Seconds of Time</span>' +
            '<div style="font-size: 1.4rem; font-weight: bold; color: #3b82f6; margin-top: 0.25rem;">' + timeStr + '</div>' +
            '<div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem;">1M sec = 11.5 days | 1B sec = 31.7 years | 1T sec = 31,709 years</div>' +
          '</div>' +
          '<div style="padding: 1rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px;">' +
            '<span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/><line x1="12" y1="8" x2="12" y2="16"/><path d="M15 12H10.5a1.5 1.5 0 0 0 0 3H13.5a1.5 1.5 0 0 1 0 3H9"/></svg> In $100 Dollar Bills Stack</span>' +
            '<div style="font-size: 1.4rem; font-weight: bold; color: #22c55e; margin-top: 0.25rem;">' + heightStr + '</div>' +
            '<div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem;">1B in $100s = 43 miles high into the stratosphere</div>' +
          '</div>' +
          '<div style="padding: 1rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px;">' +
            '<span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> GPU AI Tokens / Words</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: #ef4444; margin-top: 0.25rem;">' + (num / 1000000).toLocaleString() + 'M Tokens</div>' +
            '<div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem;">At 100 tokens/sec = ' + (num / 100 / 3600).toFixed(1) + ' hours of continuous reading</div>' +
          '</div>';
      }

      setScale(1000000000);
    </script>
  `;

  writeFileSync(join(utilDir, 'scale-visualizer.html'), renderPage({
    title: 'Million vs Billion vs Trillion Number & Speed Scale Visualizer | Digital Tools Shed',
    metaDesc: 'Interactive scale visualizer comparing 1 million, 1 billion, and 1 trillion in time, height, and computing tokens.',
    canonical: `${DOMAIN}/util/scale-visualizer`,
    bodyContent: scaleHtml,
    currentPath: '/util/scale-visualizer'
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
        </div>

        <div id="drAnalysis" style="margin-top: 1.5rem; font-size: 0.95rem; line-height: 1.6; color: var(--fg); background: var(--surface); border: 1px solid var(--border); padding: 1rem 1.25rem; border-radius: 6px;"></div>
      </div>
    </div>

    <script>
      function setDrakePreset(type) {
        if (type === 'sagan') {
          document.getElementById('dr-r').value = 4.0;
          document.getElementById('dr-fp').value = 1.0;
          document.getElementById('dr-ne').value = 1.0;
          document.getElementById('dr-fl').value = 1.0;
          document.getElementById('dr-fi').value = 0.5;
          document.getElementById('dr-fc').value = 0.2;
          document.getElementById('dr-L').value = 1000000;
        } else if (type === 'rare_earth') {
          document.getElementById('dr-r').value = 1.5;
          document.getElementById('dr-fp').value = 0.8;
          document.getElementById('dr-ne').value = 0.1;
          document.getElementById('dr-fl').value = 0.001;
          document.getElementById('dr-fi').value = 0.0001;
          document.getElementById('dr-fc').value = 0.01;
          document.getElementById('dr-L').value = 300;
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

      function calcDrake() {
        var r = parseFloat(document.getElementById('dr-r').value) || 0;
        var fp = parseFloat(document.getElementById('dr-fp').value) || 0;
        var ne = parseFloat(document.getElementById('dr-ne').value) || 0;
        var fl = parseFloat(document.getElementById('dr-fl').value) || 0;
        var fi = parseFloat(document.getElementById('dr-fi').value) || 0;
        var fc = parseFloat(document.getElementById('dr-fc').value) || 0;
        var L = parseFloat(document.getElementById('dr-L').value) || 0;

        var N = r * fp * ne * fl * fi * fc * L;

        var nStr = '';
        if (N >= 1000000) nStr = (N / 1000000).toFixed(2) + ' Million';
        else if (N >= 1) nStr = Math.round(N).toLocaleString('en-US');
        else if (N > 0) nStr = N.toFixed(5);
        else nStr = '0';

        document.getElementById('drResultN').textContent = nStr;

        // Milky way volume approx: radius 50,000 LY, height 1,000 LY => Volume ~ 7.85e12 cubic LY
        // Average distance between civilizations d ~ (V / N)^(1/3)
        var distStr = '';
        var analysisStr = '';

        if (N >= 1) {
          var d = Math.round(Math.pow((Math.PI * 50000 * 50000 * 1000) / N, 1/3));
          distStr = d.toLocaleString('en-US') + ' LY';
          analysisStr = '<strong>Existential Assessment:</strong> With <strong>' + nStr + '</strong> active civilizations, the nearest contact is roughly <strong>' + distStr + '</strong> away. A two-way radio conversation would take <strong>' + (d * 2).toLocaleString('en-US') + ' years</strong>. If civilizations frequently self-destruct (L is small), they pass like ships in the night and never overlap.';
        } else {
          distStr = 'Alone';
          analysisStr = '<strong>Existential Assessment:</strong> N is less than 1 (' + N.toExponential(2) + '). Under these parameters, humanity is almost certainly the <strong>only conscious technological species</strong> currently active in our entire galaxy. The "Great Filter" is likely behind us in abiogenesis or complex multicellular evolution.';
        }

        document.getElementById('drResultDist').textContent = distStr;
        document.getElementById('drAnalysis').innerHTML = analysisStr;
      }

      document.addEventListener('DOMContentLoaded', calcDrake);
      calcDrake();
    </script>
  `;

  writeFileSync(join(utilDir, 'fermi-paradox-calculator.html'), renderPage({
    title: 'Drake Equation & Fermi Paradox Alien Contact Calculator | Digital Tools Shed',
    metaDesc: 'Calculate the probability of intelligent alien civilizations in the Milky Way using the Drake Equation. Estimates distance to nearest alien life and Great Filter odds.',
    canonical: `${DOMAIN}/util/fermi-paradox-calculator`,
    bodyContent: fermiHtml,
    currentPath: '/util/fermi-paradox-calculator'
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

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
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
      </div>
    </div>

    <script>
      function setCosmicPreset() {
        var sel = document.getElementById('cosmicPreset');
        var sec = parseFloat(sel.value);
        var text = sel.options[sel.selectedIndex].text;
        var parts = text.split(' — ');
        document.getElementById('cosmicClock').textContent = parts[0];
        document.getElementById('cosmicDesc').textContent = parts[1] || '';
      }
      document.addEventListener('DOMContentLoaded', setCosmicPreset);
    </script>
  `;

  writeFileSync(join(utilDir, 'cosmic-calendar-calculator.html'), renderPage({
    title: 'Cosmic Calendar Calculator: 13.8 Billion Years in 24 Hours | Digital Tools Shed',
    metaDesc: 'Compress the 13.8-billion-year history of the universe into 24 hours. See where Earth, dinosaurs, human history, and your life land on the cosmic clock.',
    canonical: `${DOMAIN}/util/cosmic-calendar-calculator`,
    bodyContent: cosmicHtml,
    currentPath: '/util/cosmic-calendar-calculator'
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

        <div id="liwContainer" class="week-grid"></div>
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

      document.addEventListener('DOMContentLoaded', renderLifeWeeks);
      renderLifeWeeks();
    </script>
  `;

  writeFileSync(join(utilDir, 'life-in-weeks.html'), renderPage({
    title: 'Your Life in Weeks: Interactive 4,680-Box Memento Mori Matrix | Digital Tools Shed',
    metaDesc: 'Interactive life in weeks grid visualizing a 90-year human life across 4,680 weeks. See lived weeks vs weeks remaining in your lifespan.',
    canonical: `${DOMAIN}/util/life-in-weeks`,
    bodyContent: lifeInWeeksHtml,
    currentPath: '/util/life-in-weeks'
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
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Billionth Second & Heartbeat Milestone Counter</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          You turn 1,000,000,000 seconds old at age <strong>31 years, 251 days</strong>. Track your exact milestone date and watch your cumulative heartbeats and cosmic distance tick live right now.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Birth Date</label>
            <input type="date" id="bsBirth" value="1995-03-24" class="search-input" style="padding: 0.55rem; font-family: var(--mono); font-size: 1.1rem;" onchange="updateBillionMilestone()" />
          </div>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; text-align: center; margin-bottom: 1.5rem;">
          <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Your 1 Billionth Second Date</div>
          <div id="bsTargetDate" style="font-family: var(--serif); font-size: 2.2rem; font-weight: bold; color: #ec4899; margin: 0.4rem 0;">December 1, 2026</div>
          <div id="bsCountdown" style="font-family: var(--mono); font-size: 1.1rem; color: var(--fg);"></div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; text-align: center;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:2px"><circle cx="12" cy="13" r="9"/><polyline points="12 9 12 13 15 16"/><path d="M12 4V2"/><path d="M10 2h4"/></svg> EXACT SECONDS ALIVE</span>
            <div id="bsLiveSeconds" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #3b82f6; margin-top: 0.25rem;">0</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:2px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> ESTIMATED HEARTBEATS</span>
            <div id="bsLiveBeats" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #ef4444; margin-top: 0.25rem;">0</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">~72 beats/min (~103,680/day)</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:2px"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> SOLAR ORBIT DISTANCE</span>
            <div id="bsLiveOrbit" style="font-family: var(--mono); font-size: 1.5rem; font-weight: bold; color: #10b981; margin-top: 0.25rem;">0 km</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Earth travels 29.8 km every second</div>
          </div>
        </div>
      </div>
    </div>

    <script>
      function updateBillionMilestone() {
        var bStr = document.getElementById('bsBirth').value;
        if (!bStr) return;
        var birthMs = new Date(bStr + 'T00:00:00').getTime();
        var billionMs = birthMs + (1000000000 * 1000);
        var targetDate = new Date(billionMs);

        document.getElementById('bsTargetDate').textContent = targetDate.toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
      }

      function tickLiveStats() {
        var bStr = document.getElementById('bsBirth').value;
        if (!bStr) return;
        var birthMs = new Date(bStr + 'T00:00:00').getTime();
        var nowMs = Date.now();
        var diffSec = (nowMs - birthMs) / 1000;

        if (diffSec > 0) {
          document.getElementById('bsLiveSeconds').textContent = Math.floor(diffSec).toLocaleString('en-US');
          var beats = Math.floor(diffSec * 1.2); // ~72 bpm
          document.getElementById('bsLiveBeats').textContent = beats.toLocaleString('en-US');
          var orbitKm = Math.floor(diffSec * 29.78);
          document.getElementById('bsLiveOrbit').textContent = (orbitKm / 1000000).toFixed(1) + 'M km';

          var billionSec = 1000000000;
          if (diffSec >= billionSec) {
            document.getElementById('bsCountdown').innerHTML = '<span style="color: #10b981; font-weight: bold;">✓ You have already surpassed 1 Billion Seconds!</span>';
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

      document.addEventListener('DOMContentLoaded', function() {
        updateBillionMilestone();
        setInterval(tickLiveStats, 1000);
        tickLiveStats();
      });
    </script>
  `;

  writeFileSync(join(utilDir, 'billion-seconds-calculator.html'), renderPage({
    title: 'Billionth Second & Real-Time Heartbeat Milestone Counter | Digital Tools Shed',
    metaDesc: 'Calculate when you turn 1 billion seconds old. Live real-time ticker tracking lifetime heartbeats, breaths taken, and kilometers traveled through the solar system.',
    canonical: `${DOMAIN}/util/billion-seconds-calculator`,
    bodyContent: billionHtml,
    currentPath: '/util/billion-seconds-calculator'
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
          Physics-based blast damage zones calculated via cube-root scaling laws ($R \\propto Y^{1/3}$) from tactical nukes to thermonuclear megatons and asteroid impacts.
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
            <div id="nbFireball" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #f97316; margin: 0.25rem 0;">0.89 km</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Instant vaporization zone</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.25rem; border-radius: 6px;">
            <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Heavy Blast (20 psi)</div>
            <div id="nbHeavy" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #ef4444; margin: 0.25rem 0;">1.85 km</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Reinforced concrete leveled</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #eab308; padding: 1.25rem; border-radius: 6px;">
            <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Moderate Blast (5 psi)</div>
            <div id="nbMod" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #eab308; margin: 0.25rem 0;">3.89 km</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Residential homes collapse</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #8b5cf6; padding: 1.25rem; border-radius: 6px;">
            <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Thermal Burns (3rd Deg)</div>
            <div id="nbThermal" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #8b5cf6; margin: 0.25rem 0;">8.41 km</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Severe 3rd-degree burns to bare skin</div>
          </div>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem 1.25rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
          Damage radius scales with the cube root of explosive energy yield: <code>R = k · Y^(1/3)</code>. Thermal radiation drops with inverse-square atmospheric extinction.
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
        var y_mt = y / 1000; // Mt

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

      document.addEventListener('DOMContentLoaded', calcBlast);
      calcBlast();
    </script>
  `;

  writeFileSync(join(utilDir, 'blast-radius-calculator.html'), renderPage({
    title: 'Nuclear Blast Radius & Thermal Damage Calculator | Digital Tools Shed',
    metaDesc: 'Calculate nuclear explosion damage zones using cube-root physics scaling laws. Estimates fireball, 20 psi overpressure, 5 psi residential collapse, and thermal burn radius.',
    canonical: `${DOMAIN}/util/blast-radius-calculator`,
    bodyContent: blastHtml,
    currentPath: '/util/blast-radius-calculator'
  }));

  console.log('  ✓ Built Viral & Reality Suite (AI Water Counter, Desmos Graphing Calculator, Scale Visualizer, Fermi Paradox, Cosmic Calendar, Life in Weeks, Billion Seconds, Blast Radius)');
}
