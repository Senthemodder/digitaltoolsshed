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
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Feet & Inches to cm
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Feet and Inches to Centimeters (ft & in to cm)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Convert imperial height (feet and inches) to exact metric centimeters (cm), meters (m), and millimeters (mm). Features official DMV/passport document formatting, global percentile benchmarks, and step-by-step math derivations.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
        <!-- Input Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
          <div>
            <label style="display: block; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.35rem;">Feet (ft)</label>
            <input type="number" id="feetInput" value="5" min="0" max="8" step="1" style="width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.2rem;" oninput="calcFtInToCm()" />
          </div>
          <div>
            <label style="display: block; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.35rem;">Inches (in)</label>
            <input type="number" id="inchesInput" value="9" min="0" max="11" step="1" style="width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.2rem;" oninput="calcFtInToCm()" />
          </div>
          <div>
            <label style="display: block; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.35rem;">Fractional Inch</label>
            <select id="fracInput" style="width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.05rem;" onchange="calcFtInToCm()">
              <option value="0" selected>0" (Exact)</option>
              <option value="0.125">1/8" (0.125")</option>
              <option value="0.25">1/4" (0.250")</option>
              <option value="0.375">3/8" (0.375")</option>
              <option value="0.5">1/2" (0.500")</option>
              <option value="0.625">5/8" (0.625")</option>
              <option value="0.75">3/4" (0.750")</option>
              <option value="0.875">7/8" (0.875")</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.35rem;">Biological Sex (Percentile)</label>
            <select id="genderInput" style="width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.05rem;" onchange="calcFtInToCm()">
              <option value="male" selected>Adult Male</option>
              <option value="female">Adult Female</option>
            </select>
          </div>
        </div>

        <!-- Common Presets -->
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; margin-bottom: 1.5rem;">
          <span style="font-size: 0.75rem; font-family: var(--mono); color: var(--text-muted);">Quick Presets:</span>
          <button type="button" onclick="setHeight(5, 4)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">5' 4"</button>
          <button type="button" onclick="setHeight(5, 7)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">5' 7"</button>
          <button type="button" onclick="setHeight(5, 9)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">5' 9"</button>
          <button type="button" onclick="setHeight(5, 10)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">5' 10"</button>
          <button type="button" onclick="setHeight(5, 11)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">5' 11"</button>
          <button type="button" onclick="setHeight(6, 0)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">6' 0"</button>
          <button type="button" onclick="setHeight(6, 2)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">6' 2"</button>
          <button type="button" onclick="setHeight(6, 4)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">6' 4"</button>
        </div>

        <!-- Metric Output Hero Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Exact Centimeters</div>
            <div id="res-cm" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">175.26 cm</div>
            <div id="res-cm-round" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Rounded: 175 cm</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Meters (m)</div>
            <div id="res-m" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.35rem 0;">1.753 m</div>
            <div id="res-mm" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">1,752.6 mm</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Inches & Decimal Ft</div>
            <div id="res-tot-in" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: var(--fg); margin: 0.35rem 0;">69.00"</div>
            <div id="res-dec-ft" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">5.750 ft</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">US Adult Percentile</div>
            <div id="res-pct" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #8b5cf6; margin: 0.35rem 0;">50th %</div>
            <div id="res-pct-sub" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Exact Average US Male</div>
          </div>
        </div>

        <button type="button" id="btnCopyHeight" onclick="copyHeightSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
          📋 Copy Official Height Summary & Document Formats
        </button>
      </div>

      <!-- Official Document & Passport Formats -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">🪪 Official Document & Identification Formats</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <div style="color: var(--text-muted); font-size: 0.75rem;">US DRIVER'S LICENSE (DMV)</div>
            <div id="fmt-dmv" style="font-weight: bold; color: var(--fg); font-size: 1.1rem; margin-top: 0.2rem;">5'-09" (or 509)</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <div style="color: var(--text-muted); font-size: 0.75rem;">US PASSPORT / MILITARY</div>
            <div id="fmt-pass" style="font-weight: bold; color: var(--fg); font-size: 1.1rem; margin-top: 0.2rem;">69 in (175 cm)</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <div style="color: var(--text-muted); font-size: 0.75rem;">INTERNATIONAL / SCHENGEN VISA</div>
            <div id="fmt-intl" style="font-weight: bold; color: var(--fg); font-size: 1.1rem; margin-top: 0.2rem;">175 cm (1.75 m)</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <div style="color: var(--text-muted); font-size: 0.75rem;">UK / COMMONWEALTH ID</div>
            <div id="fmt-uk" style="font-weight: bold; color: var(--fg); font-size: 1.1rem; margin-top: 0.2rem;">175 cm (5 ft 9 in)</div>
          </div>
        </div>
      </div>

      <!-- Step-by-Step Worked Derivation -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Mathematical Derivation</h3>
          <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">1959 International Yard & Pound Standard</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
          By international treaty (1959), one imperial inch is defined as <strong>exactly 2.54 centimeters</strong> (25.4 mm). The full algebraic conversion follows:
        </p>
        <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 1: Convert Feet to Base Inches</strong>
            <div id="der-step-1" style="color: #3b82f6; margin-top: 0.25rem;">
              5 ft &times; 12 inches/ft = 60.0 inches
            </div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 2: Sum Total Inches (Including Fractions)</strong>
            <div id="der-step-2" style="color: var(--text-muted); margin-top: 0.25rem;">
              Total Inches = 60.0 in + 9.0 in + 0.0 in = 69.00 inches
            </div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 3: Multiply by Exact Constant (2.54 cm / inch)</strong>
            <div id="der-step-3" style="color: var(--text-muted); margin-top: 0.25rem;">
              Height in cm = 69.00 &times; 2.54 = 175.26 cm
            </div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: #10b981; font-weight: 700;">Step 4: Metric Unit Scales (Meters & Millimeters)</strong>
            <div id="der-step-4" style="color: #10b981; margin-top: 0.25rem;">
              175.26 cm &divide; 100 = 1.7526 m | 175.26 cm &times; 10 = 1,752.6 mm
            </div>
          </div>
        </div>
      </div>

      <!-- Critical Measurement Traps & Human Height Facts -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Human Height Traps & Measurement Reality</h3>
        <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; display: grid; gap: 0.6rem;">
          <li><strong>The Diurnal Spinal Compression Trap:</strong> You are between 1.5 cm and 2.5 cm (0.6 to 1.0 inch) taller when you wake up in the morning than when you go to bed. Throughout the day, gravity and body weight compress the fluid-filled intervertebral discs of your spine. Discs rehydrate and expand only when lying down horizontally during sleep.</li>
          <li><strong>The "Shoe Stack" Fallacy:</strong> Athletic running shoes add between 2.8 cm and 3.8 cm (1.1 to 1.5 inches) of artificial height, while work boots and dress shoes add up to 5.0 cm (2.0 inches). Official medical stadiometer protocols strictly mandate that shoes and thick socks be removed.</li>
          <li><strong>Driver's License Self-Reporting Inflation:</strong> CDC epidemiological studies demonstrate that American men over-report their height on driver's licenses by an average of 1.2 inches (3.0 cm), while women over-report by 0.5 inches (1.3 cm). Self-reported heights consistently exaggerate true stature.</li>
          <li><strong>The 5' 11" vs. 6' 0" Psychological Cliff:</strong> 5' 11" is exactly 180.34 cm, while 6' 0" is 182.88 cm—a physical gap of merely 2.54 cm. Yet in social surveys and dating apps, men claiming 6'0" outnumber men claiming 5'11" by nearly 400%, reflecting significant rounding bias.</li>
        </ul>
      </div>

      <!-- Height Reference Lookup Table -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem;">Feet & Inches to Centimeters Comprehensive Lookup Chart</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                <th style="padding: 0.5rem 0.75rem;">Imperial (ft & in)</th>
                <th style="padding: 0.5rem 0.75rem;">Total Inches</th>
                <th style="padding: 0.5rem 0.75rem;">Centimeters (cm)</th>
                <th style="padding: 0.5rem 0.75rem;">Meters (m)</th>
                <th style="padding: 0.5rem 0.75rem;">US Male %</th>
                <th style="padding: 0.5rem 0.75rem;">US Female %</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">4' 10"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">58"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">147.32 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.47 m</td><td style="padding: 0.45rem 0.75rem;">&lt; 0.1%</td><td style="padding: 0.45rem 0.75rem;">2.3%</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 0"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">60"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">152.40 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.52 m</td><td style="padding: 0.45rem 0.75rem;">0.1%</td><td style="padding: 0.45rem 0.75rem;">10.2%</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 2"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">62"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">157.48 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.57 m</td><td style="padding: 0.45rem 0.75rem;">0.9%</td><td style="padding: 0.45rem 0.75rem;">29.2%</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 4"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">64"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">162.56 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.63 m</td><td style="padding: 0.45rem 0.75rem;">4.5%</td><td style="padding: 0.45rem 0.75rem;">57.1% (Avg)</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 6"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">66"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">167.64 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.68 m</td><td style="padding: 0.45rem 0.75rem;">15.4%</td><td style="padding: 0.45rem 0.75rem;">81.8%</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 7"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">67"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">170.18 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.70 m</td><td style="padding: 0.45rem 0.75rem;">24.8%</td><td style="padding: 0.45rem 0.75rem;">89.8%</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 8"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">68"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">172.72 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.73 m</td><td style="padding: 0.45rem 0.75rem;">36.6%</td><td style="padding: 0.45rem 0.75rem;">94.9%</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #10b981;">5' 9"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #10b981;">69"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">175.26 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #10b981;">1.75 m</td><td style="padding: 0.45rem 0.75rem; color: #10b981; font-weight: bold;">50.0% (Avg)</td><td style="padding: 0.45rem 0.75rem;">97.7%</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 10"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">70"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">177.80 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.78 m</td><td style="padding: 0.45rem 0.75rem;">63.1%</td><td style="padding: 0.45rem 0.75rem;">99.1%</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">5' 11"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">71"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">180.34 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.80 m</td><td style="padding: 0.45rem 0.75rem;">74.9%</td><td style="padding: 0.45rem 0.75rem;">99.7%</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold; color: #3b82f6;">6' 0"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #3b82f6;">72"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #3b82f6;">182.88 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #3b82f6;">1.83 m</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6; font-weight: bold;">84.4%</td><td style="padding: 0.45rem 0.75rem;">&gt; 99.9%</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">6' 1"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">73"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">185.42 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.85 m</td><td style="padding: 0.45rem 0.75rem;">91.2%</td><td style="padding: 0.45rem 0.75rem;">&gt; 99.9%</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">6' 2"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">74"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">187.96 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.88 m</td><td style="padding: 0.45rem 0.75rem;">95.4%</td><td style="padding: 0.45rem 0.75rem;">&gt; 99.9%</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">6' 3"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">75"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">190.50 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.91 m</td><td style="padding: 0.45rem 0.75rem;">97.9%</td><td style="padding: 0.45rem 0.75rem;">&gt; 99.9%</td></tr>
              <tr><td style="padding: 0.45rem 0.75rem; font-weight: bold;">6' 4"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">76"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">193.04 cm</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.93 m</td><td style="padding: 0.45rem 0.75rem;">99.1%</td><td style="padding: 0.45rem 0.75rem;">&gt; 99.9%</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script>
      function normCdf(z) {
        if (z < -6) return 0;
        if (z > 6) return 1;
        var t = 1 / (1 + 0.2316419 * Math.abs(z));
        var d = 0.3989422804014327 * Math.exp(-z * z / 2);
        var prob = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
        return z > 0 ? (1 - prob) : prob;
      }

      function calcFtInToCm() {
        var feet = parseFloat(document.getElementById('feetInput').value) || 0;
        var inches = parseFloat(document.getElementById('inchesInput').value) || 0;
        var frac = parseFloat(document.getElementById('fracInput').value) || 0;
        var gender = document.getElementById('genderInput').value;

        var totalInches = (feet * 12) + inches + frac;
        var cm = totalInches * 2.54;
        var meters = cm / 100;
        var mm = cm * 10;
        var decFeet = totalInches / 12;

        document.getElementById('res-cm').textContent = cm.toFixed(2) + ' cm';
        document.getElementById('res-cm-round').textContent = 'Nearest Integer: ' + Math.round(cm) + ' cm';
        document.getElementById('res-m').textContent = meters.toFixed(3) + ' m';
        document.getElementById('res-mm').textContent = mm.toFixed(1) + ' mm';
        document.getElementById('res-tot-in').textContent = totalInches.toFixed(2) + '"';
        document.getElementById('res-dec-ft').textContent = decFeet.toFixed(3) + ' ft';

        // Percentile
        var mu = gender === 'male' ? 175.3 : 161.3;
        var sigma = gender === 'male' ? 7.5 : 7.0;
        var z = (cm - mu) / sigma;
        var pct = normCdf(z) * 100;

        var pctEl = document.getElementById('res-pct');
        var pctSubEl = document.getElementById('res-pct-sub');
        if (pct < 0.1) pctEl.textContent = '< 0.1%';
        else if (pct > 99.9) pctEl.textContent = '> 99.9%';
        else pctEl.textContent = pct.toFixed(1) + 'th %';

        var sexStr = gender === 'male' ? 'US Adult Males' : 'US Adult Females';
        if (pct >= 90) pctSubEl.textContent = 'Taller than ' + pct.toFixed(1) + '% of ' + sexStr;
        else if (pct >= 40 && pct <= 60) pctSubEl.textContent = 'Average range for ' + sexStr;
        else pctSubEl.textContent = 'Shorter than ' + (100 - pct).toFixed(1) + '% of ' + sexStr;

        // Official Formats
        var inRounded = Math.round(inches + frac);
        var inStr = inRounded < 10 ? ('0' + inRounded) : inRounded.toString();
        document.getElementById('fmt-dmv').textContent = feet + "'-" + inStr + '" (or ' + feet + inStr + ')';
        document.getElementById('fmt-pass').textContent = Math.round(totalInches) + ' in (' + Math.round(cm) + ' cm)';
        document.getElementById('fmt-intl').textContent = Math.round(cm) + ' cm (' + meters.toFixed(2) + ' m)';
        document.getElementById('fmt-uk').textContent = Math.round(cm) + ' cm (' + feet + ' ft ' + inRounded + ' in)';

        // Derivations
        document.getElementById('der-step-1').textContent = feet + ' ft × 12 in/ft = ' + (feet * 12).toFixed(1) + ' inches';
        document.getElementById('der-step-2').textContent = 'Total Inches = ' + (feet * 12).toFixed(1) + ' + ' + inches + (frac > 0 ? (' + ' + frac) : '') + ' = ' + totalInches.toFixed(3) + ' in';
        document.getElementById('der-step-3').textContent = 'Exact Height in cm = ' + totalInches.toFixed(3) + ' in × 2.54 cm/in = ' + cm.toFixed(2) + ' cm';
        document.getElementById('der-step-4').textContent = cm.toFixed(2) + ' cm ÷ 100 = ' + meters.toFixed(3) + ' m | ' + cm.toFixed(2) + ' cm × 10 = ' + mm.toFixed(1) + ' mm';
      }

      window.setHeight = function(ft, inch) {
        document.getElementById('feetInput').value = ft;
        document.getElementById('inchesInput').value = inch;
        document.getElementById('fracInput').value = '0';
        calcFtInToCm();
      };

      function copyHeightSummary() {
        var ft = document.getElementById('feetInput').value;
        var inch = document.getElementById('inchesInput').value;
        var frac = document.getElementById('fracInput');
        var fracText = frac.options[frac.selectedIndex].text;
        var cm = document.getElementById('res-cm').textContent;
        var m = document.getElementById('res-m').textContent;
        var totalIn = document.getElementById('res-tot-in').textContent;
        var pct = document.getElementById('res-pct').textContent;
        var dmv = document.getElementById('fmt-dmv').textContent;
        var pass = document.getElementById('fmt-pass').textContent;
        var intl = document.getElementById('fmt-intl').textContent;

        var text = '📏 OFFICIAL HEIGHT CONVERSION & PERCENTILE REPORT\\n' +
          '----------------------------------------\\n' +
          '• Imperial Height: ' + ft + "\\' " + inch + '\\" (' + fracText + ')\\n' +
          '• Exact Metric: ' + cm + ' (' + m + ')\\n' +
          '• Total Inches: ' + totalIn + '\\n' +
          '• Population Percentile: ' + pct + ' (' + document.getElementById('res-pct-sub').textContent + ')\\n' +
          '----------------------------------------\\n' +
          'OFFICIAL DOCUMENT FORMATS:\\n' +
          '• US Driver License (DMV): ' + dmv + '\\n' +
          '• US Passport / Military: ' + pass + '\\n' +
          '• International / Schengen: ' + intl + '\\n' +
          '----------------------------------------\\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/feet-and-inches-to-cm';

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('btnCopyHeight');
          var old = btn.innerHTML;
          btn.innerHTML = '✓ Copied Height Report!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          setTimeout(function() {
            btn.innerHTML = old;
            btn.style.background = 'var(--surface-alt)';
            btn.style.color = 'var(--fg)';
          }, 2000);
        });
      }

      document.addEventListener('DOMContentLoaded', calcFtInToCm);
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
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; cm to Feet & Inches
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Centimeters to Feet and Inches (cm to ft & in)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Convert metric centimeters (cm) to imperial feet, inches, and fractional measurements. Includes official DMV/passport document formatting, human population percentiles, and step-by-step reverse algebra.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
        <!-- Input Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
          <div>
            <label style="display: block; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.35rem;">Height in Centimeters (cm)</label>
            <input type="number" id="cmInput" value="175" min="40" max="250" step="0.5" style="width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.2rem;" oninput="calcCmToFtIn()" />
          </div>
          <div>
            <label style="display: block; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.35rem;">Biological Sex (Percentile)</label>
            <select id="cmGenderInput" style="width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.05rem;" onchange="calcCmToFtIn()">
              <option value="male" selected>Adult Male</option>
              <option value="female">Adult Female</option>
            </select>
          </div>
        </div>

        <!-- Common Presets -->
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; margin-bottom: 1.5rem;">
          <span style="font-size: 0.75rem; font-family: var(--mono); color: var(--text-muted);">Common Heights:</span>
          <button type="button" onclick="setCm(155)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">155 cm (5' 1")</button>
          <button type="button" onclick="setCm(165)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">165 cm (5' 5")</button>
          <button type="button" onclick="setCm(170)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">170 cm (5' 7")</button>
          <button type="button" onclick="setCm(175)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">175 cm (5' 9")</button>
          <button type="button" onclick="setCm(180)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">180 cm (5' 11")</button>
          <button type="button" onclick="setCm(183)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">183 cm (6' 0")</button>
          <button type="button" onclick="setCm(188)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">188 cm (6' 2")</button>
          <button type="button" onclick="setCm(193)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">193 cm (6' 4")</button>
        </div>

        <!-- Imperial Output Hero Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Exact Feet & Inches</div>
            <div id="res-cm-exact" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">5' 8.90"</div>
            <div id="res-cm-frac" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Nearest Fraction: 5' 8 7/8"</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Rounded Human Height</div>
            <div id="res-cm-rounded" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.35rem 0;">5' 9"</div>
            <div id="res-cm-m" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">1.750 m (1,750 mm)</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Inches & Decimal Ft</div>
            <div id="res-cm-tot-in" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: var(--fg); margin: 0.35rem 0;">68.90"</div>
            <div id="res-cm-dec-ft" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">5.742 ft</div>
          </div>
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">US Adult Percentile</div>
            <div id="res-cm-pct" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #8b5cf6; margin: 0.35rem 0;">48.4th %</div>
            <div id="res-cm-pct-sub" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Average range for US Males</div>
          </div>
        </div>

        <button type="button" id="btnCopyCm" onclick="copyCmSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
          📋 Copy Official Height Summary & Document Formats
        </button>
      </div>

      <!-- Official Document & Passport Formats -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">🪪 Official Document & Identification Formats</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <div style="color: var(--text-muted); font-size: 0.75rem;">US DRIVER'S LICENSE (DMV)</div>
            <div id="cm-fmt-dmv" style="font-weight: bold; color: var(--fg); font-size: 1.1rem; margin-top: 0.2rem;">5'-09" (or 509)</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <div style="color: var(--text-muted); font-size: 0.75rem;">US PASSPORT / MILITARY</div>
            <div id="cm-fmt-pass" style="font-weight: bold; color: var(--fg); font-size: 1.1rem; margin-top: 0.2rem;">69 in (175 cm)</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <div style="color: var(--text-muted); font-size: 0.75rem;">INTERNATIONAL / SCHENGEN VISA</div>
            <div id="cm-fmt-intl" style="font-weight: bold; color: var(--fg); font-size: 1.1rem; margin-top: 0.2rem;">175 cm (1.75 m)</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <div style="color: var(--text-muted); font-size: 0.75rem;">UK / COMMONWEALTH ID</div>
            <div id="cm-fmt-uk" style="font-weight: bold; color: var(--fg); font-size: 1.1rem; margin-top: 0.2rem;">175 cm (5 ft 9 in)</div>
          </div>
        </div>
      </div>

      <!-- Step-by-Step Worked Derivation -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Reverse Conversion Algebra</h3>
          <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">1959 International Yard & Pound Standard</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
          Converting metric centimeters to imperial units uses exact division by <strong>2.54 cm/inch</strong> followed by integer division by 12:
        </p>
        <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 1: Calculate Total Imperial Inches</strong>
            <div id="cm-der-step-1" style="color: #3b82f6; margin-top: 0.25rem;">
              Total Inches = 175.0 cm &divide; 2.54 = 68.8976 inches
            </div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 2: Extract Whole Feet via Floor Division</strong>
            <div id="cm-der-step-2" style="color: var(--text-muted); margin-top: 0.25rem;">
              Whole Feet = &lfloor; 68.8976 &divide; 12 &rfloor; = 5 feet (accounting for 60 inches)
            </div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 3: Extract Remaining Inches via Modulo</strong>
            <div id="cm-der-step-3" style="color: var(--text-muted); margin-top: 0.25rem;">
              Remaining Inches = 68.8976 - (5 &times; 12) = 8.8976" &approx; 8.90"
            </div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: #10b981; font-weight: 700;">Step 4: Common Rounding & Nearest 1/16th Fraction</strong>
            <div id="cm-der-step-4" style="color: #10b981; margin-top: 0.25rem;">
              Decimal fraction 0.8976 &approx; 14.36 / 16 &approx; 7/8" &rarr; Result: 5' 8 7/8" (Common Rounding: 5' 9")
            </div>
          </div>
        </div>
      </div>

      <!-- Critical Measurement Traps & Human Height Facts -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Stature Traps & Measurement Realities</h3>
        <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; display: grid; gap: 0.6rem;">
          <li><strong>The Metric Rounding Illusion (175 cm &ne; 5'9"):</strong> Exactly 5' 9" is 175.26 cm. A person measured at 175.0 cm is actually 5 feet 8.9 inches. While commonly rounded up, in precision athletics, aviation cockpit certifications, or military draft screenings, that 0.26 cm discrepancy can be decisive.</li>
          <li><strong>The Frankfort Horizontal Plane Mandate:</strong> Accurate medical stadiometer height requires the head to be positioned in the Frankfort plane—a line connecting the lower edge of the eye socket to the upper edge of the ear canal parallel to the ground. Tipping the chin upward or downward can alter recorded stature by 1.0 to 2.0 cm.</li>
          <li><strong>Diurnal Height Loss (Gravity Effect):</strong> Stature decreases by approximately 1.5 cm to 2.5 cm over the course of the day as spinal cartilage discs compress. To capture your authentic baseline height, measure within 1 hour of waking.</li>
          <li><strong>Wall Baseboard Measurement Distortion:</strong> Measuring height by backing up against a standard wall with baseboards often pushes heels 1 to 2 cm forward, tilting the pelvis and reducing true vertical height. Always measure against a flat vertical stadiometer or flush door frame.</li>
        </ul>
      </div>

      <!-- Quick Reference Table -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem;">Centimeters to Feet & Inches Quick Reference Table</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                <th style="padding: 0.5rem 0.75rem;">Centimeters (cm)</th>
                <th style="padding: 0.5rem 0.75rem;">Feet & Inches</th>
                <th style="padding: 0.5rem 0.75rem;">Rounded Height</th>
                <th style="padding: 0.5rem 0.75rem;">Decimal Feet</th>
                <th style="padding: 0.5rem 0.75rem;">Total Inches</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">150 cm</td><td style="padding: 0.45rem 0.75rem;">4' 11.06"</td><td style="padding: 0.45rem 0.75rem;">4' 11"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">4.92 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">59.06"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">155 cm</td><td style="padding: 0.45rem 0.75rem;">5' 1.02"</td><td style="padding: 0.45rem 0.75rem;">5' 1"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">5.09 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">61.02"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">160 cm</td><td style="padding: 0.45rem 0.75rem;">5' 2.99"</td><td style="padding: 0.45rem 0.75rem;">5' 3"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">5.25 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">62.99"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">165 cm</td><td style="padding: 0.45rem 0.75rem;">5' 4.96"</td><td style="padding: 0.45rem 0.75rem;">5' 5"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">5.41 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">64.96"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">170 cm</td><td style="padding: 0.45rem 0.75rem;">5' 6.93"</td><td style="padding: 0.45rem 0.75rem;">5' 7"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">5.58 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">66.93"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">175 cm</td><td style="padding: 0.45rem 0.75rem; color: #10b981; font-weight: bold;">5' 8.90"</td><td style="padding: 0.45rem 0.75rem; color: #10b981; font-weight: bold;">5' 9"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">5.74 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">68.90"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">180 cm</td><td style="padding: 0.45rem 0.75rem; color: #10b981; font-weight: bold;">5' 10.87"</td><td style="padding: 0.45rem 0.75rem; color: #10b981; font-weight: bold;">5' 11"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">5.91 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">70.87"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #3b82f6;">183 cm</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6; font-weight: bold;">6' 0.05"</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6; font-weight: bold;">6' 0"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">6.00 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">72.05"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #3b82f6;">185 cm</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6; font-weight: bold;">6' 0.83"</td><td style="padding: 0.45rem 0.75rem; color: #3b82f6; font-weight: bold;">6' 1"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">6.07 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">72.83"</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">190 cm</td><td style="padding: 0.45rem 0.75rem;">6' 2.80"</td><td style="padding: 0.45rem 0.75rem;">6' 3"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">6.23 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">74.80"</td></tr>
              <tr><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">195 cm</td><td style="padding: 0.45rem 0.75rem;">6' 4.77"</td><td style="padding: 0.45rem 0.75rem;">6' 5"</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">6.40 ft</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">76.77"</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script>
      function normCdfCm(z) {
        if (z < -6) return 0;
        if (z > 6) return 1;
        var t = 1 / (1 + 0.2316419 * Math.abs(z));
        var d = 0.3989422804014327 * Math.exp(-z * z / 2);
        var prob = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
        return z > 0 ? (1 - prob) : prob;
      }

      function getNearest16th(inches) {
        var whole = Math.floor(inches);
        var rem = inches - whole;
        var sixteenths = Math.round(rem * 16);
        if (sixteenths === 16) return { whole: whole + 1, frac: '' };
        if (sixteenths === 0) return { whole: whole, frac: '' };
        // simplify fraction
        var num = sixteenths;
        var den = 16;
        while (num % 2 === 0 && den % 2 === 0) {
          num /= 2;
          den /= 2;
        }
        return { whole: whole, frac: num + '/' + den + '\\"' };
      }

      function calcCmToFtIn() {
        var cm = parseFloat(document.getElementById('cmInput').value) || 0;
        var gender = document.getElementById('cmGenderInput').value;

        var totalInches = cm / 2.54;
        var feet = Math.floor(totalInches / 12);
        var inches = totalInches % 12;

        var roundedInches = Math.round(inches);
        var roundedFeet = feet;
        if (roundedInches === 12) {
          roundedFeet += 1;
          roundedInches = 0;
        }

        var decFeet = totalInches / 12;
        var m = cm / 100;
        var mm = cm * 10;
        var fracObj = getNearest16th(inches);

        document.getElementById('res-cm-exact').textContent = feet + "\\' " + inches.toFixed(2) + '\\"';
        document.getElementById('res-cm-frac').textContent = 'Nearest 1/16th: ' + feet + "\\' " + fracObj.whole + (fracObj.frac ? ' ' + fracObj.frac : '\\"');
        document.getElementById('res-cm-rounded').textContent = roundedFeet + "\\' " + roundedInches + '\\"';
        document.getElementById('res-cm-m').textContent = m.toFixed(3) + ' m (' + mm.toFixed(0) + ' mm)';
        document.getElementById('res-cm-tot-in').textContent = totalInches.toFixed(2) + '\\"';
        document.getElementById('res-cm-dec-ft').textContent = decFeet.toFixed(3) + ' ft';

        // Percentile
        var mu = gender === 'male' ? 175.3 : 161.3;
        var sigma = gender === 'male' ? 7.5 : 7.0;
        var z = (cm - mu) / sigma;
        var pct = normCdfCm(z) * 100;

        var pctEl = document.getElementById('res-cm-pct');
        var pctSubEl = document.getElementById('res-cm-pct-sub');
        if (pct < 0.1) pctEl.textContent = '< 0.1%';
        else if (pct > 99.9) pctEl.textContent = '> 99.9%';
        else pctEl.textContent = pct.toFixed(1) + 'th %';

        var sexStr = gender === 'male' ? 'US Adult Males' : 'US Adult Females';
        if (pct >= 90) pctSubEl.textContent = 'Taller than ' + pct.toFixed(1) + '% of ' + sexStr;
        else if (pct >= 40 && pct <= 60) pctSubEl.textContent = 'Average range for ' + sexStr;
        else pctSubEl.textContent = 'Shorter than ' + (100 - pct).toFixed(1) + '% of ' + sexStr;

        // Official Formats
        var inStr = roundedInches < 10 ? ('0' + roundedInches) : roundedInches.toString();
        document.getElementById('cm-fmt-dmv').textContent = roundedFeet + "'-" + inStr + '" (or ' + roundedFeet + inStr + ')';
        document.getElementById('cm-fmt-pass').textContent = Math.round(totalInches) + ' in (' + Math.round(cm) + ' cm)';
        document.getElementById('cm-fmt-intl').textContent = Math.round(cm) + ' cm (' + m.toFixed(2) + ' m)';
        document.getElementById('cm-fmt-uk').textContent = Math.round(cm) + ' cm (' + roundedFeet + ' ft ' + roundedInches + ' in)';

        // Derivations
        document.getElementById('cm-der-step-1').textContent = 'Total Inches = ' + cm.toFixed(1) + ' cm ÷ 2.54 = ' + totalInches.toFixed(4) + ' in';
        document.getElementById('cm-der-step-2').textContent = 'Whole Feet = ⌊ ' + totalInches.toFixed(4) + ' ÷ 12 ⌋ = ' + feet + ' ft (' + (feet * 12) + ' in accounted for)';
        document.getElementById('cm-der-step-3').textContent = 'Remaining Inches = ' + totalInches.toFixed(4) + ' - ' + (feet * 12) + ' = ' + inches.toFixed(4) + '" ≈ ' + inches.toFixed(2) + '"';
        document.getElementById('cm-der-step-4').textContent = 'Nearest 1/16th: ' + feet + "' " + fracObj.whole + (fracObj.frac ? ' ' + fracObj.frac : '"') + ' | Common Rounded Notation: ' + roundedFeet + "' " + roundedInches + '"';
      }

      window.setCm = function(val) {
        document.getElementById('cmInput').value = val;
        calcCmToFtIn();
      };

      function copyCmSummary() {
        var cm = document.getElementById('cmInput').value;
        var exact = document.getElementById('res-cm-exact').textContent;
        var rounded = document.getElementById('res-cm-rounded').textContent;
        var totalIn = document.getElementById('res-cm-tot-in').textContent;
        var m = document.getElementById('res-cm-m').textContent;
        var pct = document.getElementById('res-cm-pct').textContent;
        var dmv = document.getElementById('cm-fmt-dmv').textContent;
        var pass = document.getElementById('cm-fmt-pass').textContent;
        var intl = document.getElementById('cm-fmt-intl').textContent;

        var text = '📏 OFFICIAL HEIGHT CONVERSION REPORT (CM TO FT & IN)\\n' +
          '----------------------------------------\\n' +
          '• Metric Stature: ' + cm + ' cm (' + m + ')\\n' +
          '• Exact Imperial: ' + exact + '\\n' +
          '• Standard Rounded Height: ' + rounded + '\\n' +
          '• Total Inches: ' + totalIn + '\\n' +
          '• Population Standing: ' + pct + ' (' + document.getElementById('res-cm-pct-sub').textContent + ')\\n' +
          '----------------------------------------\\n' +
          'OFFICIAL DOCUMENT FORMATS:\\n' +
          '• US Driver License (DMV): ' + dmv + '\\n' +
          '• US Passport / Military: ' + pass + '\\n' +
          '• International / Schengen: ' + intl + '\\n' +
          '----------------------------------------\\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/cm-to-feet-and-inches';

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('btnCopyCm');
          var old = btn.innerHTML;
          btn.innerHTML = '✓ Copied Height Report!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          setTimeout(function() {
            btn.innerHTML = old;
            btn.style.background = 'var(--surface-alt)';
            btn.style.color = 'var(--fg)';
          }, 2000);
        });
      }

      document.addEventListener('DOMContentLoaded', calcCmToFtIn);
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
