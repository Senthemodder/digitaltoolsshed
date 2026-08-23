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
        <span style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">⏱️ Tracking live resource consumption for: <strong id="elapsedTimer" style="color: var(--fg);">0.0s</strong></span>
        <span style="font-size: 0.8rem; background: rgba(34,197,94,0.15); color: #22c55e; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: bold;">● LIVE REAL-TIME CALCULATION</span>
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
          <div style="font-size: 0.85rem; color: var(--text-muted);">~58,000,000 Liters/sec (165,000x more water than all global AI)</div>
          <div class="bar-track"><div class="bar-fill" style="width: 100%; background: #ef4444;"></div></div>
        </div>

        <div class="ticker-card" style="border-left: 4px solid #22c55e;">
          <div class="ticker-sub">⛳ Global Golf Course Irrigation</div>
          <div class="ticker-val" id="valGolfWater" style="color: #22c55e;">0.00 L</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">~115,000 Liters/sec (328x more water than all global AI)</div>
          <div class="bar-track"><div class="bar-fill" style="width: 25%; background: #22c55e;"></div></div>
        </div>

        <div class="ticker-card" style="border-left: 4px solid #f59e0b;">
          <div class="ticker-sub">👕 Cotton & Fast Fashion Manufacturing</div>
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
    canonical: `${DOMAIN}/calc/ai-water-calculator.html`,
    bodyContent: aiWaterHtml,
    currentPath: '/calc/ai-water-calculator.html'
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
            <button onclick="zoom(0.8)" class="btn-secondary" style="flex: 1; padding: 0.4rem; font-size: 0.85rem;">🔍 Zoom +</button>
            <button onclick="zoom(1.25)" class="btn-secondary" style="flex: 1; padding: 0.4rem; font-size: 0.85rem;">🔍 Zoom -</button>
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
    canonical: `${DOMAIN}/math/graphing-calculator.html`,
    bodyContent: graphHtml,
    currentPath: '/math/graphing-calculator.html'
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
            '<span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">⏱️ In Seconds of Time</span>' +
            '<div style="font-size: 1.4rem; font-weight: bold; color: #3b82f6; margin-top: 0.25rem;">' + timeStr + '</div>' +
            '<div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem;">1M sec = 11.5 days | 1B sec = 31.7 years | 1T sec = 31,709 years</div>' +
          '</div>' +
          '<div style="padding: 1rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px;">' +
            '<span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">💵 In $100 Dollar Bills Stack</span>' +
            '<div style="font-size: 1.4rem; font-weight: bold; color: #22c55e; margin-top: 0.25rem;">' + heightStr + '</div>' +
            '<div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem;">1B in $100s = 43 miles high into the stratosphere</div>' +
          '</div>' +
          '<div style="padding: 1rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px;">' +
            '<span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">⚡ GPU AI Tokens / Words</span>' +
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
    canonical: `${DOMAIN}/util/scale-visualizer.html`,
    bodyContent: scaleHtml,
    currentPath: '/util/scale-visualizer.html'
  }));

  console.log('  ✓ Built Viral & Reality Suite (AI Water Counter, Desmos Graphing Calculator, Scale Visualizer)');
}
