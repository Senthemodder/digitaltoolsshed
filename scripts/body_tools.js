import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

export function buildBodyTools() {
  const calcDir = join(DIST, 'calc');
  ensureDir(calcDir);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. FEET AND INCHES TO CM (HEIGHT CONVERTER)
  // ─────────────────────────────────────────────────────────────────────────────
  const ftInToCmBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Feet & Inches to cm
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Feet and Inches to Centimeters (ft & in to cm)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Convert imperial height (feet and inches) to exact centimeters (cm), meters (m), and millimeters (mm) with instant calculation and height lookup chart.
        </p>
      </header>

      <div style="background: var(--surface-alt); border-left: 4px solid var(--border-strong); padding: 0.85rem 1.15rem; margin-bottom: 1.5rem; font-size: 1.05rem; font-family: var(--serif);">
        <strong>Quick Rule:</strong> Multiply feet by 30.48, multiply inches by 2.54, and add them together. <strong>5' 9" = 175.26 cm</strong> | <strong>6' 0" = 182.88 cm</strong>.
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Enter Imperial Height</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Feet (ft)</label>
              <input type="number" id="feetInput" value="5" min="0" max="9" step="1" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" />
            </div>
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Inches (in)</label>
              <input type="number" id="inchesInput" value="9" min="0" max="11.99" step="0.25" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" />
            </div>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
            <span style="font-size: 0.75rem; color: var(--text-muted); width: 100%;">Common Heights:</span>
            <button type="button" class="btn-sm" onclick="setHeight(5, 7)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">5' 7"</button>
            <button type="button" class="btn-sm" onclick="setHeight(5, 9)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">5' 9"</button>
            <button type="button" class="btn-sm" onclick="setHeight(5, 10)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">5' 10"</button>
            <button type="button" class="btn-sm" onclick="setHeight(5, 11)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">5' 11"</button>
            <button type="button" class="btn-sm" onclick="setHeight(6, 0)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">6' 0"</button>
            <button type="button" class="btn-sm" onclick="setHeight(6, 2)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">6' 2"</button>
          </div>

          <button class="btn-primary" onclick="calcFtInToCm()" style="width: 100%; padding: 0.75rem; font-size: 1rem;">Convert Height</button>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Metric Results</h3>
          <div id="metricResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
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
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem;">Feet and Inches to Centimeters Height Lookup Chart</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                <th style="padding: 0.5rem 0.75rem;">Feet & Inches</th>
                <th style="padding: 0.5rem 0.75rem;">Total Inches</th>
                <th style="padding: 0.5rem 0.75rem;">Centimeters (cm)</th>
                <th style="padding: 0.5rem 0.75rem;">Meters (m)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">4' 10"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">58"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">147.32 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.47 m</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 0"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">60"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">152.40 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.52 m</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 2"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">62"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">157.48 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.57 m</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 4"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">64"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">162.56 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.63 m</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 6"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">66"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">167.64 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.68 m</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 7"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">67"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">170.18 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.70 m</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 8"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">68"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">172.72 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.73 m</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 9"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #10b981; font-weight: bold;">175.26 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.75 m</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 10"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #10b981; font-weight: bold;">177.80 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.78 m</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 11"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #10b981; font-weight: bold;">180.34 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.80 m</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">6' 0"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #3b82f6; font-weight: bold;">182.88 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.83 m</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">6' 1"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">185.42 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.85 m</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">6' 2"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">187.96 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.88 m</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">6' 3"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">190.50 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.91 m</td></tr>
              <tr><td style="padding: 0.45rem 0.75rem; font-weight: bold;">6' 4"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">193.04 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.93 m</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script>
      function calcFtInToCm() {
        var feet = parseFloat(document.getElementById('feetInput').value) || 0;
        var inches = parseFloat(document.getElementById('inchesInput').value) || 0;

        var totalInches = (feet * 12) + inches;
        var cm = totalInches * 2.54;
        var meters = cm / 100;
        var mm = cm * 10;

        var container = document.getElementById('metricResults');
        container.innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">CENTIMETERS (CM)</span>' +
            '<div style="font-size: 1.8rem; font-weight: bold; color: #10b981;">' + cm.toFixed(2) + ' cm</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">METERS (M)</span>' +
            '<div style="font-size: 1.3rem; font-weight: bold; color: var(--fg);">' + meters.toFixed(3) + ' m</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL INCHES & MILLIMETERS</span>' +
            '<div style="font-size: 1.05rem; color: var(--text-muted);">' + totalInches.toFixed(2) + ' inches | ' + mm.toFixed(1) + ' mm</div>' +
          '</div>';
      }

      window.setHeight = function(ft, inch) {
        document.getElementById('feetInput').value = ft;
        document.getElementById('inchesInput').value = inch;
        calcFtInToCm();
      };

      document.getElementById('feetInput').addEventListener('input', calcFtInToCm);
      document.getElementById('inchesInput').addEventListener('input', calcFtInToCm);
      calcFtInToCm();
    </script>
  `;

  writeFileSync(join(calcDir, 'feet-and-inches-to-cm.html'), renderPage({
    title: 'Feet and Inches to cm (ft in to cm) Converter & Height Chart | Digital Tools Shed',
    metaDesc: 'Convert feet and inches to cm instantly. 5\' 9" = 175.26 cm, 6\' 0" = 182.88 cm. Free personal height chart, exact math formulas, and meter calculations.',
    canonical: `${DOMAIN}/calc/feet-and-inches-to-cm`,
    bodyContent: ftInToCmBody,
    currentPath: '/calc/feet-and-inches-to-cm',
    faq: [
      { q: 'How tall is 5\' 9" in cm?', a: '5 feet 9 inches (5\' 9") is equal to exactly 175.26 centimeters (or 1.75 meters).' },
      { q: 'How tall is 6\' 0" in cm?', a: '6 feet 0 inches (6\' 0") is equal to exactly 182.88 centimeters (or 1.83 meters).' },
      { q: 'What is the formula to convert feet and inches to cm?', a: 'Multiply the number of feet by 30.48, multiply the number of inches by 2.54, and sum the two results: Height in cm = (Feet × 30.48) + (Inches × 2.54).' },
      { q: 'How tall is 5\' 11" in cm?', a: '5 feet 11 inches (5\' 11") is equal to 180.34 centimeters (or 1.80 meters).' }
    ]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. CM TO FEET AND INCHES (HEIGHT CONVERTER)
  // ─────────────────────────────────────────────────────────────────────────────
  const cmToFtInBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; cm to Feet & Inches
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Centimeters to Feet and Inches (cm to ft & in)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Convert centimeters (cm) to imperial feet and inches (ft & in) for human height, driver license, and medical forms.
        </p>
      </header>

      <div style="background: var(--surface-alt); border-left: 4px solid var(--border-strong); padding: 0.85rem 1.15rem; margin-bottom: 1.5rem; font-size: 1.05rem; font-family: var(--serif);">
        <strong>Quick Rule:</strong> Divide cm by 2.54 to get total inches. Then divide total inches by 12 to find feet. <strong>175 cm = 5' 8.9" (~5' 9")</strong> | <strong>180 cm = 5' 10.9" (~5' 11")</strong>.
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Enter Centimeters</h3>
          
          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Height in Centimeters (cm)</label>
            <input type="number" id="cmInput" value="175" min="50" max="250" step="0.5" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" />
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
            <span style="font-size: 0.75rem; color: var(--text-muted); width: 100%;">Common Heights:</span>
            <button type="button" class="btn-sm" onclick="setCm(165)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">165 cm</button>
            <button type="button" class="btn-sm" onclick="setCm(170)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">170 cm</button>
            <button type="button" class="btn-sm" onclick="setCm(175)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">175 cm</button>
            <button type="button" class="btn-sm" onclick="setCm(180)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">180 cm</button>
            <button type="button" class="btn-sm" onclick="setCm(183)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">183 cm (6'0")</button>
            <button type="button" class="btn-sm" onclick="setCm(188)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">188 cm</button>
          </div>

          <button class="btn-primary" onclick="calcCmToFtIn()" style="width: 100%; padding: 0.75rem; font-size: 1rem;">Convert cm to Feet</button>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Imperial Height Results</h3>
          <div id="ftInResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
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
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem;">Centimeters to Feet & Inches Quick Reference Table</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                <th style="padding: 0.5rem 0.75rem;">Centimeters (cm)</th>
                <th style="padding: 0.5rem 0.75rem;">Feet & Inches</th>
                <th style="padding: 0.5rem 0.75rem;">Decimal Feet</th>
                <th style="padding: 0.5rem 0.75rem;">Total Inches</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">150 cm</td><td style="padding: 0.45rem 0.75rem;">4' 11.06"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">4.92 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">59.06"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">155 cm</td><td style="padding: 0.45rem 0.75rem;">5' 1.02"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">5.09 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">61.02"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">160 cm</td><td style="padding: 0.45rem 0.75rem;">5' 2.99" (~5' 3")</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">5.25 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">62.99"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">165 cm</td><td style="padding: 0.45rem 0.75rem;">5' 4.96" (~5' 5")</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">5.41 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">64.96"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">170 cm</td><td style="padding: 0.45rem 0.75rem;">5' 6.93" (~5' 7")</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">5.58 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">66.93"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">175 cm</td><td style="padding: 0.45rem 0.75rem; color: #10b981; font-weight: bold;">5' 8.90" (~5' 9")</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">5.74 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">68.90"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">180 cm</td><td style="padding: 0.45rem 0.75rem; color: #10b981; font-weight: bold;">5' 10.87" (~5' 11")</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">5.91 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">70.87"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">183 cm</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6; font-weight: bold;">6' 0.05" (~6' 0")</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">6.00 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">72.05"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">185 cm</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6; font-weight: bold;">6' 0.83" (~6' 1")</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">6.07 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">72.83"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">190 cm</td><td style="padding: 0.45rem 0.75rem;">6' 2.80" (~6' 3")</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">6.23 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">74.80"</td></tr>
              <tr><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">195 cm</td><td style="padding: 0.45rem 0.75rem;">6' 4.77" (~6' 5")</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">6.40 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">76.77"</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script>
      function calcCmToFtIn() {
        var cm = parseFloat(document.getElementById('cmInput').value) || 0;
        var totalInches = cm / 2.54;
        var feet = Math.floor(totalInches / 12);
        var inches = totalInches % 12;
        var roundedInches = Math.round(inches);
        var roundedFeet = feet;
        if (roundedInches === 12) { roundedFeet += 1; roundedInches = 0; }

        var decimalFeet = totalInches / 12;

        var container = document.getElementById('ftInResults');
        container.innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">EXACT FEET & INCHES</span>' +
            '<div style="font-size: 1.8rem; font-weight: bold; color: #10b981;">' + feet + "\\' " + inches.toFixed(2) + '\\"</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">STANDARD ROUNDED NOTATION</span>' +
            '<div style="font-size: 1.3rem; font-weight: bold; color: var(--fg);">' + roundedFeet + "\\' " + roundedInches + '\\"</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">DECIMAL FEET & TOTAL INCHES</span>' +
            '<div style="font-size: 1.05rem; color: var(--text-muted);">' + decimalFeet.toFixed(2) + ' ft | ' + totalInches.toFixed(2) + ' inches</div>' +
          '</div>';
      }

      window.setCm = function(val) {
        document.getElementById('cmInput').value = val;
        calcCmToFtIn();
      };

      document.getElementById('cmInput').addEventListener('input', calcCmToFtIn);
      calcCmToFtIn();
    </script>
  `;

  writeFileSync(join(calcDir, 'cm-to-feet-and-inches.html'), renderPage({
    title: 'cm to Feet and Inches (cm to ft in) Converter & Height Chart | Digital Tools Shed',
    metaDesc: 'Convert centimeters to feet and inches instantly. 175 cm = 5\' 9", 180 cm = 5\' 11", 183 cm = 6\' 0". Free height conversion chart and decimal feet calculation.',
    canonical: `${DOMAIN}/calc/cm-to-feet-and-inches`,
    bodyContent: cmToFtInBody,
    currentPath: '/calc/cm-to-feet-and-inches',
    faq: [
      { q: 'What is 175 cm in feet and inches?', a: '175 centimeters is equal to 5 feet 8.90 inches, which is typically rounded to 5 feet 9 inches (5\' 9").' },
      { q: 'What is 180 cm in feet and inches?', a: '180 centimeters is equal to 5 feet 10.87 inches, which is commonly rounded to 5 feet 11 inches (5\' 11").' },
      { q: 'What is 183 cm in feet and inches?', a: '183 centimeters is equal to 6 feet 0.05 inches, which corresponds to exactly 6 feet (6\' 0").' },
      { q: 'How do you calculate cm to feet and inches?', a: 'First divide the centimeters by 2.54 to get total inches. Then divide total inches by 12: the integer quotient is feet, and the remainder is inches.' }
    ]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. SHOE SIZE CONVERTER (US, UK, EU, CM)
  // ─────────────────────────────────────────────────────────────────────────────
  const shoeBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Shoe Size Converter
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">International Shoe Size Converter & Chart</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Convert shoe sizes between US, UK, European (EU), and Foot Length in Centimeters (cm) and Inches for Men, Women, and Kids.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Gender / Category</label>
            <select id="shoeGender" class="search-input" style="width: 100%; padding: 0.65rem; font-size: 1rem;" onchange="renderShoeOptions()">
              <option value="men">Men\\'s Shoes</option>
              <option value="women">Women\\'s Shoes</option>
            </select>
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Input Region / Unit</label>
            <select id="shoeRegion" class="search-input" style="width: 100%; padding: 0.65rem; font-size: 1rem;" onchange="renderShoeOptions()">
              <option value="us">US Size</option>
              <option value="eu">EU Size</option>
              <option value="uk">UK Size</option>
              <option value="cm">Foot Length (cm)</option>
            </select>
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Select Size</label>
            <select id="shoeSelect" class="search-input" style="width: 100%; padding: 0.65rem; font-size: 1rem;" onchange="convertShoe()"></select>
          </div>
        </div>

        <div id="shoeResults" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-top: 1.5rem; font-family: var(--mono);"></div>
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
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem;">Men\\'s Shoe Size Conversion Table</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                <th style="padding: 0.45rem 0.75rem;">US Men</th>
                <th style="padding: 0.45rem 0.75rem;">UK</th>
                <th style="padding: 0.45rem 0.75rem;">EU</th>
                <th style="padding: 0.45rem 0.75rem;">Foot (cm)</th>
                <th style="padding: 0.45rem 0.75rem;">Inches</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">7.0</td><td style="padding: 0.4rem 0.75rem;">6.5</td><td style="padding: 0.4rem 0.75rem;">40</td><td style="padding: 0.4rem 0.75rem;">24.8 cm</td><td style="padding: 0.4rem 0.75rem;">9.75"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">8.0</td><td style="padding: 0.4rem 0.75rem;">7.5</td><td style="padding: 0.4rem 0.75rem;">41</td><td style="padding: 0.4rem 0.75rem;">25.7 cm</td><td style="padding: 0.4rem 0.75rem;">10.12"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">8.5</td><td style="padding: 0.4rem 0.75rem;">8.0</td><td style="padding: 0.4rem 0.75rem;">42</td><td style="padding: 0.4rem 0.75rem;">26.0 cm</td><td style="padding: 0.4rem 0.75rem;">10.25"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">9.0</td><td style="padding: 0.4rem 0.75rem;">8.5</td><td style="padding: 0.4rem 0.75rem;">42.5</td><td style="padding: 0.4rem 0.75rem;">26.7 cm</td><td style="padding: 0.4rem 0.75rem;">10.50"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">9.5</td><td style="padding: 0.4rem 0.75rem;">9.0</td><td style="padding: 0.4rem 0.75rem;">43</td><td style="padding: 0.4rem 0.75rem;">27.0 cm</td><td style="padding: 0.4rem 0.75rem;">10.62"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">10.0</td><td style="padding: 0.4rem 0.75rem;">9.5</td><td style="padding: 0.4rem 0.75rem;">44</td><td style="padding: 0.4rem 0.75rem;">27.5 cm</td><td style="padding: 0.4rem 0.75rem;">10.87"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">10.5</td><td style="padding: 0.4rem 0.75rem;">10.0</td><td style="padding: 0.4rem 0.75rem;">44.5</td><td style="padding: 0.4rem 0.75rem;">28.0 cm</td><td style="padding: 0.4rem 0.75rem;">11.00"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">11.0</td><td style="padding: 0.4rem 0.75rem;">10.5</td><td style="padding: 0.4rem 0.75rem;">45</td><td style="padding: 0.4rem 0.75rem;">28.5 cm</td><td style="padding: 0.4rem 0.75rem;">11.25"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.4rem 0.75rem; font-weight: bold;">11.5</td><td style="padding: 0.4rem 0.75rem;">11.0</td><td style="padding: 0.4rem 0.75rem;">45.5</td><td style="padding: 0.4rem 0.75rem;">29.0 cm</td><td style="padding: 0.4rem 0.75rem;">11.37"</td></tr>
              <tr><td style="padding: 0.4rem 0.75rem; font-weight: bold;">12.0</td><td style="padding: 0.4rem 0.75rem;">11.5</td><td style="padding: 0.4rem 0.75rem;">46</td><td style="padding: 0.4rem 0.75rem;">29.5 cm</td><td style="padding: 0.4rem 0.75rem;">11.62"</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script>
      var shoeDb = {
        men: [
          { us: "6.0", uk: "5.5", eu: "38.5", cm: "24.0", in: "9.45" },
          { us: "6.5", uk: "6.0", eu: "39.0", cm: "24.5", in: "9.65" },
          { us: "7.0", uk: "6.5", eu: "40.0", cm: "24.8", in: "9.75" },
          { us: "7.5", uk: "7.0", eu: "40.5", cm: "25.2", in: "9.92" },
          { us: "8.0", uk: "7.5", eu: "41.0", cm: "25.7", in: "10.12" },
          { us: "8.5", uk: "8.0", eu: "42.0", cm: "26.0", in: "10.25" },
          { us: "9.0", uk: "8.5", eu: "42.5", cm: "26.7", in: "10.50" },
          { us: "9.5", uk: "9.0", eu: "43.0", cm: "27.0", in: "10.62" },
          { us: "10.0", uk: "9.5", eu: "44.0", cm: "27.5", in: "10.87" },
          { us: "10.5", uk: "10.0", eu: "44.5", cm: "28.0", in: "11.00" },
          { us: "11.0", uk: "10.5", eu: "45.0", cm: "28.5", in: "11.25" },
          { us: "11.5", uk: "11.0", eu: "45.5", cm: "29.0", in: "11.37" },
          { us: "12.0", uk: "11.5", eu: "46.0", cm: "29.5", in: "11.62" },
          { us: "13.0", uk: "12.5", eu: "47.5", cm: "30.5", in: "12.00" }
        ],
        women: [
          { us: "5.0", uk: "3.0", eu: "35.5", cm: "22.0", in: "8.66" },
          { us: "5.5", uk: "3.5", eu: "36.0", cm: "22.5", in: "8.86" },
          { us: "6.0", uk: "4.0", eu: "36.5", cm: "23.0", in: "9.06" },
          { us: "6.5", uk: "4.5", eu: "37.5", cm: "23.5", in: "9.25" },
          { us: "7.0", uk: "5.0", eu: "38.0", cm: "24.0", in: "9.45" },
          { us: "7.5", uk: "5.5", eu: "38.5", cm: "24.5", in: "9.65" },
          { us: "8.0", uk: "6.0", eu: "39.0", cm: "25.0", in: "9.84" },
          { us: "8.5", uk: "6.5", eu: "40.0", cm: "25.5", in: "10.04" },
          { us: "9.0", uk: "7.0", eu: "40.5", cm: "26.0", in: "10.24" },
          { us: "9.5", uk: "7.5", eu: "41.0", cm: "26.5", in: "10.43" },
          { us: "10.0", uk: "8.0", eu: "42.0", cm: "27.0", in: "10.63" },
          { us: "11.0", uk: "9.0", eu: "43.0", cm: "28.0", in: "11.02" }
        ]
      };

      function renderShoeOptions() {
        var gender = document.getElementById('shoeGender').value;
        var region = document.getElementById('shoeRegion').value;
        var select = document.getElementById('shoeSelect');
        var list = shoeDb[gender];

        select.innerHTML = '';
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          var opt = document.createElement('option');
          opt.value = i;
          opt.textContent = region.toUpperCase() + ' ' + item[region];
          select.appendChild(opt);
        }
        // Default select middle size
        select.value = Math.floor(list.length / 2);
        convertShoe();
      }

      function convertShoe() {
        var gender = document.getElementById('shoeGender').value;
        var index = parseInt(document.getElementById('shoeSelect').value, 10);
        var item = shoeDb[gender][index];
        if (!item) return;

        var container = document.getElementById('shoeResults');
        container.innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">US SIZE</span>' +
            '<div style="font-size: 1.3rem; font-weight: bold; color: #10b981;">' + item.us + '</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">EU SIZE</span>' +
            '<div style="font-size: 1.3rem; font-weight: bold; color: #3b82f6;">' + item.eu + '</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">UK SIZE</span>' +
            '<div style="font-size: 1.3rem; font-weight: bold; color: var(--fg);">' + item.uk + '</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">FOOT LENGTH</span>' +
            '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">' + item.cm + ' cm</div>' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">' + item.in + '"</span>' +
          '</div>';
      }

      renderShoeOptions();
    </script>
  `;

  writeFileSync(join(calcDir, 'shoe-size-converter.html'), renderPage({
    title: 'Shoe Size Converter (US, UK, EU, cm) & Chart | Digital Tools Shed',
    metaDesc: 'Convert shoe sizes between US, UK, EU, and foot length in cm. Accurate conversion charts for men and women shoes with international sizing rules.',
    canonical: `${DOMAIN}/calc/shoe-size-converter`,
    bodyContent: shoeBody,
    currentPath: '/calc/shoe-size-converter',
    faq: [
      { q: 'What is a US Men\'s 10 shoe size in European (EU) size?', a: 'A US Men\'s size 10 is equal to European size EU 44 (or UK size 9.5), corresponding to approximately 27.5 cm foot length.' },
      { q: 'What is a US Women\'s 8 in EU shoe size?', a: 'A US Women\'s size 8 corresponds to European size EU 39 (or UK size 6.0), fitting a 25.0 cm foot length.' },
      { q: 'How do you convert Men\'s shoe sizes to Women\'s in the US?', a: 'In the US, Men\'s sizes are generally 1.5 sizes smaller than Women\'s sizes. For example, a Men\'s size 8 is equivalent to a Women\'s size 9.5.' }
    ]
  }));

  console.log('  ✓ Built Body & Height Suite (feet-and-inches-to-cm, cm-to-feet-and-inches, shoe-size-converter in /calc/)');
}
