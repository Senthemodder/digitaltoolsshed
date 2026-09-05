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
  const shoeBody = "\n    <div class=\"article-container\" style=\"max-width: 950px;\">\n      <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n        <a href=\"/\">Home</a> &gt; <a href=\"/calc/\">Calculators</a> &gt; Shoe Size Converter\n      </nav>\n\n      <header style=\"margin-bottom: 2rem;\">\n        <h1 style=\"font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;\">International Shoe Size Converter & Fit Visualizer</h1>\n        <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n          Convert shoe sizes bidirectionally across US Men, US Women, UK, EU (Paris Points), Mondopoint (mm), Japan (cm), and exact foot length in inches and centimeters. Includes width fittings (Narrow to 4E Extra Wide), activity toe-box clearance, and brand last adjustments.\n        </p>\n      </header>\n\n      <!-- Key Callout -->\n      <div style=\"background: var(--surface-alt); border-left: 4px solid var(--border-strong); padding: 0.85rem 1.15rem; margin-bottom: 1.5rem; font-size: 0.95rem; font-family: var(--serif);\">\n        <strong>Toe-Box Clearance Rule:</strong> Never buy shoes that match your exact bare foot length. Functional footwear requires a minimum <strong>10 mm to 15 mm (0.4 to 0.6 inches)</strong> toe buffer between your longest toe and the shoe front to accommodate foot elongation during the gait cycle and afternoon volume swelling.\n      </div>\n\n      <!-- Main Calculator Card -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;\">\n        \n        <!-- Top Row Selectors -->\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;\">\n          <div>\n            <label style=\"font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;\">Gender / Category</label>\n            <select id=\"shoeCategory\" onchange=\"onCategoryChange()\" style=\"width: 100%; padding: 0.6rem; background: var(--surface-alt); border: 1px solid var(--border); color: var(--fg); font-family: var(--sans); border-radius: 4px; font-size: 0.95rem;\">\n              <option value=\"men\" selected>Adult Men / Unisex</option>\n              <option value=\"women\">Adult Women</option>\n              <option value=\"kids\">Kids / Youth (Big Kids)</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;\">Convert From</label>\n            <select id=\"shoeInputType\" onchange=\"onInputTypeChange()\" style=\"width: 100%; padding: 0.6rem; background: var(--surface-alt); border: 1px solid var(--border); color: var(--fg); font-family: var(--sans); border-radius: 4px; font-size: 0.95rem;\">\n              <option value=\"foot_cm\">Foot Length (Centimeters)</option>\n              <option value=\"foot_in\">Foot Length (Inches)</option>\n              <option value=\"us\" selected>US Size</option>\n              <option value=\"uk\">UK Size</option>\n              <option value=\"eu\">EU Size (Continental)</option>\n              <option value=\"mondo\">Mondopoint (Millimeters)</option>\n              <option value=\"jp\">Japan / CM</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;\">Width Fitting</label>\n            <select id=\"shoeWidth\" onchange=\"recalculateShoe()\" style=\"width: 100%; padding: 0.6rem; background: var(--surface-alt); border: 1px solid var(--border); color: var(--fg); font-family: var(--sans); border-radius: 4px; font-size: 0.95rem;\">\n              <option value=\"narrow\">Narrow (B Men / 2A Women)</option>\n              <option value=\"standard\" selected>Standard (D Men / B Women)</option>\n              <option value=\"wide\">Wide (2E / EE Men / D Women)</option>\n              <option value=\"xwide\">Extra Wide (4E Men / 2E Women)</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;\">Intended Activity</label>\n            <select id=\"shoeActivity\" onchange=\"recalculateShoe()\" style=\"width: 100%; padding: 0.6rem; background: var(--surface-alt); border: 1px solid var(--border); color: var(--fg); font-family: var(--sans); border-radius: 4px; font-size: 0.95rem;\">\n              <option value=\"casual\" selected>Casual / Everyday (10mm buffer)</option>\n              <option value=\"running\">Running / Hiking (15mm buffer)</option>\n              <option value=\"dress\">Dress / Formal (7mm snug fit)</option>\n            </select>\n          </div>\n        </div>\n\n        <!-- Input Value Row -->\n        <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem;\">\n          <div style=\"display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;\">\n            <div style=\"flex: 1; min-width: 240px;\">\n              <label id=\"shoeValueLabel\" style=\"font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; font-weight: bold;\">\n                Select US Size:\n              </label>\n              <div id=\"shoeInputContainer\">\n                <!-- Injected dynamically: select dropdown or numeric input -->\n              </div>\n            </div>\n\n            <div style=\"text-align: right; min-width: 180px;\">\n              <span style=\"font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block;\">Effective Foot Length</span>\n              <span id=\"statFootLength\" style=\"font-family: var(--mono); font-size: 1.35rem; font-weight: bold; color: var(--fg);\">27.0 cm (10.63 in)</span>\n            </div>\n          </div>\n        </div>\n\n        <!-- Converted Key Results Badges -->\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;\" id=\"shoeBadgesGrid\">\n          <!-- Injected dynamically -->\n        </div>\n\n        <!-- Pure SVG Foot & Shoe Fit Visualizer -->\n        <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; margin-bottom: 1.5rem;\">\n          <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;\">\n            <h3 style=\"font-family: var(--serif); font-size: 1.1rem; margin: 0; color: var(--fg);\">Interactive Foot Silhouette & Toe-Box Clearance</h3>\n            <span id=\"svgClearanceBadge\" style=\"font-family: var(--mono); font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; background: rgba(16,185,129,0.15); color: #10b981; font-weight: bold;\">\n              10 mm Recommended Buffer\n            </span>\n          </div>\n          <div style=\"width: 100%; max-width: 700px; margin: 0 auto; overflow-x: auto;\">\n            <svg id=\"shoeSvg\" viewBox=\"0 0 700 180\" style=\"width: 100%; height: auto; display: block; font-family: var(--mono);\" xmlns=\"http://www.w3.org/2000/svg\">\n              <!-- SVG drawn by JS -->\n            </svg>\n          </div>\n          <div style=\"display: flex; justify-content: space-around; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); margin-top: 0.75rem;\">\n            <span><span style=\"display:inline-block; width:10px; height:10px; background:#3b82f6; border-radius:2px; margin-right:4px;\"></span>Bare Foot Length</span>\n            <span><span style=\"display:inline-block; width:10px; height:10px; background:#10b981; border-radius:2px; margin-right:4px;\"></span>Toe Clearance Buffer</span>\n            <span><span style=\"display:inline-block; width:10px; height:10px; background:var(--border-strong); border-radius:2px; margin-right:4px;\"></span>Shoe Last Outline</span>\n          </div>\n        </div>\n\n        <!-- Copy Sizing Report Button -->\n        <div style=\"display: flex; gap: 0.75rem; flex-wrap: wrap;\">\n          <button type=\"button\" id=\"btnCopyShoe\" onclick=\"copyShoeReport()\" class=\"btn\" style=\"padding: 0.65rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; font-weight: bold; background: var(--surface-alt); border: 1px solid var(--border); color: var(--fg); border-radius: 4px; cursor: pointer; transition: all 0.2s;\">\n            📋 Copy Complete Shoe Sizing Report\n          </button>\n        </div>\n      </div>\n\n      <!-- Comprehensive Brand-Specific Sizing Guidance -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <h3 style=\"font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 1rem; color: var(--fg);\">🏷️ Brand-Specific Last Geometry & Sizing Offsets</h3>\n        <p style=\"font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); margin-bottom: 1rem;\">\n          Shoe manufacturers construct shoes on proprietary mechanical lasts that deviate from standard ISO charts. Use these real-world brand offsets:\n        </p>\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; font-size: 0.88rem;\">\n          <div style=\"padding: 0.85rem; background: var(--surface-alt); border-left: 3px solid #ef4444; border-radius: 4px;\">\n            <strong style=\"color: var(--fg); display: block; margin-bottom: 0.25rem;\">Nike</strong>\n            <span style=\"color: var(--text-muted);\">Runs <strong>0.5 size small</strong> and generally narrow across the forefoot. Recommended: size up half a size if you have medium or wide feet.</span>\n          </div>\n          <div style=\"padding: 0.85rem; background: var(--surface-alt); border-left: 3px solid #3b82f6; border-radius: 4px;\">\n            <strong style=\"color: var(--fg); display: block; margin-bottom: 0.25rem;\">Adidas</strong>\n            <span style=\"color: var(--text-muted);\">Runs <strong>true to size</strong> in length, but features a snug midfoot and lower instep volume. Toe box tends to run slightly wider than Nike.</span>\n          </div>\n          <div style=\"padding: 0.85rem; background: var(--surface-alt); border-left: 3px solid #10b981; border-radius: 4px;\">\n            <strong style=\"color: var(--fg); display: block; margin-bottom: 0.25rem;\">New Balance</strong>\n            <span style=\"color: var(--text-muted);\">True to size length with the industry's most accurate width offerings (Standard D, 2E Wide, 4E Extra Wide). Forefoot offers ample anatomical splay.</span>\n          </div>\n          <div style=\"padding: 0.85rem; background: var(--surface-alt); border-left: 3px solid #f59e0b; border-radius: 4px;\">\n            <strong style=\"color: var(--fg); display: block; margin-bottom: 0.25rem;\">Hoka & On Running</strong>\n            <span style=\"color: var(--text-muted);\">Hoka standard lasts run slightly narrow; choose their Wide (2E) option for normal feet. On Running tends to fit snug—order 0.5 size up for marathon training.</span>\n          </div>\n        </div>\n      </div>\n\n      <!-- Master International Conversion Reference Table -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <h3 style=\"font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 1rem; color: var(--fg);\">📊 Master International Conversion Table (ISO 9407 Calibration)</h3>\n        <div style=\"overflow-x: auto;\">\n          <table style=\"width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; text-align: center;\">\n            <thead>\n              <tr style=\"background: var(--surface-alt); border-bottom: 2px solid var(--border);\">\n                <th style=\"padding: 0.6rem 0.5rem; text-align: left;\">Foot Length (cm)</th>\n                <th style=\"padding: 0.6rem 0.5rem;\">Foot Length (in)</th>\n                <th style=\"padding: 0.6rem 0.5rem; color: #10b981;\">US Men</th>\n                <th style=\"padding: 0.6rem 0.5rem; color: #ec4899;\">US Women</th>\n                <th style=\"padding: 0.6rem 0.5rem;\">UK</th>\n                <th style=\"padding: 0.6rem 0.5rem; color: #3b82f6;\">EU</th>\n                <th style=\"padding: 0.6rem 0.5rem;\">Mondo (mm)</th>\n                <th style=\"padding: 0.6rem 0.5rem;\">Japan (cm)</th>\n              </tr>\n            </thead>\n            <tbody id=\"masterTableBody\">\n              <!-- Dynamically populated -->\n            </tbody>\n          </table>\n        </div>\n      </div>\n\n      <!-- 5 Fatal Pitfalls Section -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <h3 style=\"font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);\">⚠️ 5 Fatal Shoe Sizing Pitfalls & Biomechanical Traps</h3>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;\">\n          Over 60% of adults wear ill-fitting footwear that causes blisters, bunions, plantar fasciitis, and subungual hematomas (runner's black toenail). Avoid these five costly measurement traps:\n        </p>\n\n        <div style=\"display: grid; gap: 1rem;\">\n          <div style=\"border-left: 3px solid #ef4444; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;\">\n            <strong style=\"color: var(--fg); font-size: 0.95rem;\">1. The Afternoon Foot Swelling Expansion Trap</strong>\n            <p style=\"margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;\">\n              Due to gravity and continuous hydrostatic pressure while standing, blood and lymphatic fluid pool in the lower extremities. Your feet expand by <strong>4% to 8% in total volume</strong> and up to a half-size in width by 4:00 PM to 6:00 PM. Measuring shoes in the morning almost guarantees buying footwear that pinches by dinner time.\n            </p>\n          </div>\n\n          <div style=\"border-left: 3px solid #f59e0b; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;\">\n            <strong style=\"color: var(--fg); font-size: 0.95rem;\">2. The Linear EU Paris Point vs UK Barleycorn Non-Integer Mismatch</strong>\n            <p style=\"margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;\">\n              European sizes are derived from the <em>Paris Point</em> (exactly 2/3 cm or 6.67 mm). US and UK systems derive from the British <em>Barleycorn</em> (1/3 inch or 8.47 mm, with half-sizes of 4.23 mm). Because 6.67 mm and 8.47 mm share no common integer factor, exact 1:1 conversions are mathematically impossible. An EU 43 (286.7 mm last) sits right between a US 9.5 and US 10.\n            </p>\n          </div>\n\n          <div style=\"border-left: 3px solid #10b981; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;\">\n            <strong style=\"color: var(--fg); font-size: 0.95rem;\">3. The US Men to Women Direct 1.5 Offset Width Fallacy</strong>\n            <p style=\"margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;\">\n              While a Men's US 8 is roughly equivalent in length to a Women's US 9.5, shoe lasts differ fundamentally in width. Standard Men's shoes are built on a <strong>D-width last</strong>, while standard Women's shoes are built on a <strong>B-width last</strong>. A woman buying a Men's size 8 is actually purchasing a Men's Wide shoe, causing heel slippage and ankle instability.\n            </p>\n          </div>\n\n          <div style=\"border-left: 3px solid #3b82f6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;\">\n            <strong style=\"color: var(--fg); font-size: 0.95rem;\">4. The Running Shoe Dynamic Foot Elongation Rule</strong>\n            <p style=\"margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;\">\n              During walking and running, the medial longitudinal arch flattens under 2.5× to 3.0× body weight impact force, driving the toes forward by 5 mm to 8 mm on every stride. If running shoes lack a <strong>full thumb's width (12 mm to 15 mm)</strong> of clearance beyond the longest toe, repetitive micro-trauma crushes the nail bed, resulting in painful subungual hematomas (\"black toenail\").\n            </p>\n          </div>\n\n          <div style=\"border-left: 3px solid #8b5cf6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;\">\n            <strong style=\"color: var(--fg); font-size: 0.95rem;\">5. The Longest Toe Assumption (Morton's Toe Anomaly)</strong>\n            <p style=\"margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;\">\n              Roughly 20% to 30% of the population has <em>Morton's Toe</em>, where the second toe is longer than the hallux (big toe). Always measure from the posterior point of the heel to the tip of your <strong>longest toe</strong>, regardless of whether it is the first or second digit. Furthermore, always fit the shoe to your larger foot—over 70% of people have asymmetrical feet differing by 1/4 to 1/2 size.\n            </p>\n          </div>\n        </div>\n      </div>\n\n    </div>\n\n    <script>\n      // ISO 9407 Master Calibration Data\n      var shoeData = [\n        { usM: \"4.0\", usW: \"5.5\", uk: \"3.5\", eu: \"36.0\", mondo: 220, cm: 22.0, in: 8.66 },\n        { usM: \"4.5\", usW: \"6.0\", uk: \"4.0\", eu: \"36.5\", mondo: 225, cm: 22.5, in: 8.86 },\n        { usM: \"5.0\", usW: \"6.5\", uk: \"4.5\", eu: \"37.5\", mondo: 230, cm: 23.0, in: 9.06 },\n        { usM: \"5.5\", usW: \"7.0\", uk: \"5.0\", eu: \"38.0\", mondo: 235, cm: 23.5, in: 9.25 },\n        { usM: \"6.0\", usW: \"7.5\", uk: \"5.5\", eu: \"38.5\", mondo: 240, cm: 24.0, in: 9.45 },\n        { usM: \"6.5\", usW: \"8.0\", uk: \"6.0\", eu: \"39.0\", mondo: 245, cm: 24.5, in: 9.65 },\n        { usM: \"7.0\", usW: \"8.5\", uk: \"6.5\", eu: \"40.0\", mondo: 250, cm: 25.0, in: 9.84 },\n        { usM: \"7.5\", usW: \"9.0\", uk: \"7.0\", eu: \"40.5\", mondo: 255, cm: 25.5, in: 10.04 },\n        { usM: \"8.0\", usW: \"9.5\", uk: \"7.5\", eu: \"41.0\", mondo: 260, cm: 26.0, in: 10.24 },\n        { usM: \"8.5\", usW: \"10.0\", uk: \"8.0\", eu: \"42.0\", mondo: 265, cm: 26.5, in: 10.43 },\n        { usM: \"9.0\", usW: \"10.5\", uk: \"8.5\", eu: \"42.5\", mondo: 270, cm: 27.0, in: 10.63 },\n        { usM: \"9.5\", usW: \"11.0\", uk: \"9.0\", eu: \"43.0\", mondo: 275, cm: 27.5, in: 10.83 },\n        { usM: \"10.0\", usW: \"11.5\", uk: \"9.5\", eu: \"44.0\", mondo: 280, cm: 28.0, in: 11.02 },\n        { usM: \"10.5\", usW: \"12.0\", uk: \"10.0\", eu: \"44.5\", mondo: 285, cm: 28.5, in: 11.22 },\n        { usM: \"11.0\", usW: \"12.5\", uk: \"10.5\", eu: \"45.0\", mondo: 290, cm: 29.0, in: 11.42 },\n        { usM: \"11.5\", usW: \"13.0\", uk: \"11.0\", eu: \"45.5\", mondo: 295, cm: 29.5, in: 11.61 },\n        { usM: \"12.0\", usW: \"13.5\", uk: \"11.5\", eu: \"46.0\", mondo: 300, cm: 30.0, in: 11.81 },\n        { usM: \"12.5\", usW: \"14.0\", uk: \"12.0\", eu: \"47.0\", mondo: 305, cm: 30.5, in: 12.01 },\n        { usM: \"13.0\", usW: \"14.5\", uk: \"12.5\", eu: \"47.5\", mondo: 310, cm: 31.0, in: 12.20 },\n        { usM: \"14.0\", usW: \"15.5\", uk: \"13.5\", eu: \"48.5\", mondo: 320, cm: 32.0, in: 12.60 }\n      ];\n\n      var currentShoeResult = null;\n\n      function renderMasterTable() {\n        var tbody = document.getElementById('masterTableBody');\n        if (!tbody) return;\n        var html = '';\n        for (var i = 0; i < shoeData.length; i++) {\n          var row = shoeData[i];\n          html += '<tr style=\"border-bottom: 1px solid var(--border);\">' +\n            '<td style=\"padding: 0.45rem 0.5rem; text-align: left; font-weight: bold;\">' + row.cm.toFixed(1) + ' cm</td>' +\n            '<td style=\"padding: 0.45rem 0.5rem; color: var(--text-muted);\">' + row.in.toFixed(2) + '\"</td>' +\n            '<td style=\"padding: 0.45rem 0.5rem; font-weight: bold; color: #10b981;\">' + row.usM + '</td>' +\n            '<td style=\"padding: 0.45rem 0.5rem; font-weight: bold; color: #ec4899;\">' + row.usW + '</td>' +\n            '<td style=\"padding: 0.45rem 0.5rem;\">' + row.uk + '</td>' +\n            '<td style=\"padding: 0.45rem 0.5rem; font-weight: bold; color: #3b82f6;\">' + row.eu + '</td>' +\n            '<td style=\"padding: 0.45rem 0.5rem;\">' + row.mondo + '</td>' +\n            '<td style=\"padding: 0.45rem 0.5rem;\">' + row.cm.toFixed(1) + '</td>' +\n          '</tr>';\n        }\n        tbody.innerHTML = html;\n      }\n\n      function onCategoryChange() {\n        rebuildInputControl();\n        recalculateShoe();\n      }\n\n      function onInputTypeChange() {\n        rebuildInputControl();\n        recalculateShoe();\n      }\n\n      function rebuildInputControl() {\n        var inputType = document.getElementById('shoeInputType').value;\n        var category = document.getElementById('shoeCategory').value;\n        var container = document.getElementById('shoeInputContainer');\n        var label = document.getElementById('shoeValueLabel');\n\n        if (inputType === 'foot_cm') {\n          label.textContent = 'Enter Bare Foot Length (cm):';\n          container.innerHTML = '<input type=\"number\" id=\"shoeValueInput\" value=\"27.0\" min=\"15.0\" max=\"35.0\" step=\"0.1\" oninput=\"recalculateShoe()\" style=\"width: 100%; padding: 0.6rem; background: var(--surface); border: 1px solid var(--border); color: var(--fg); font-family: var(--mono); font-size: 1.1rem; border-radius: 4px;\">';\n        } else if (inputType === 'foot_in') {\n          label.textContent = 'Enter Bare Foot Length (Inches):';\n          container.innerHTML = '<input type=\"number\" id=\"shoeValueInput\" value=\"10.63\" min=\"6.0\" max=\"14.0\" step=\"0.05\" oninput=\"recalculateShoe()\" style=\"width: 100%; padding: 0.6rem; background: var(--surface); border: 1px solid var(--border); color: var(--fg); font-family: var(--mono); font-size: 1.1rem; border-radius: 4px;\">';\n        } else if (inputType === 'mondo') {\n          label.textContent = 'Enter Mondopoint (mm):';\n          container.innerHTML = '<input type=\"number\" id=\"shoeValueInput\" value=\"270\" min=\"150\" max=\"350\" step=\"5\" oninput=\"recalculateShoe()\" style=\"width: 100%; padding: 0.6rem; background: var(--surface); border: 1px solid var(--border); color: var(--fg); font-family: var(--mono); font-size: 1.1rem; border-radius: 4px;\">';\n        } else {\n          var fieldName = 'usM';\n          var prefix = 'US ';\n          if (inputType === 'us') {\n            fieldName = (category === 'women') ? 'usW' : 'usM';\n            prefix = (category === 'women') ? 'US Women ' : 'US Men ';\n          } else if (inputType === 'uk') {\n            fieldName = 'uk';\n            prefix = 'UK ';\n          } else if (inputType === 'eu') {\n            fieldName = 'eu';\n            prefix = 'EU ';\n          } else if (inputType === 'jp') {\n            fieldName = 'cm';\n            prefix = 'JP ';\n          }\n\n          label.textContent = 'Select ' + prefix + 'Size:';\n          var selectHtml = '<select id=\"shoeValueInput\" onchange=\"recalculateShoe()\" style=\"width: 100%; padding: 0.6rem; background: var(--surface); border: 1px solid var(--border); color: var(--fg); font-family: var(--mono); font-size: 1rem; border-radius: 4px;\">';\n          for (var i = 0; i < shoeData.length; i++) {\n            var item = shoeData[i];\n            var val = item[fieldName];\n            var isSel = (item.usM === '10.0') ? ' selected' : '';\n            selectHtml += '<option value=\"' + i + '\"' + isSel + '>' + prefix + val + ' (' + item.cm.toFixed(1) + ' cm)</option>';\n          }\n          selectHtml += '</select>';\n          container.innerHTML = selectHtml;\n        }\n      }\n\n      function recalculateShoe() {\n        var inputType = document.getElementById('shoeInputType').value;\n        var category = document.getElementById('shoeCategory').value;\n        var width = document.getElementById('shoeWidth').value;\n        var activity = document.getElementById('shoeActivity').value;\n        var inputElem = document.getElementById('shoeValueInput');\n        if (!inputElem) return;\n\n        var targetCm = 27.0;\n\n        if (inputType === 'foot_cm') {\n          targetCm = parseFloat(inputElem.value) || 27.0;\n        } else if (inputType === 'foot_in') {\n          var inches = parseFloat(inputElem.value) || 10.63;\n          targetCm = inches * 2.54;\n        } else if (inputType === 'mondo') {\n          targetCm = (parseFloat(inputElem.value) || 270) / 10.0;\n        } else {\n          var idx = parseInt(inputElem.value, 10);\n          if (isNaN(idx) || idx < 0 || idx >= shoeData.length) idx = 10;\n          targetCm = shoeData[idx].cm;\n        }\n\n        // Find closest match in shoeData\n        var bestIdx = 0;\n        var minDiff = 9999;\n        for (var i = 0; i < shoeData.length; i++) {\n          var diff = Math.abs(shoeData[i].cm - targetCm);\n          if (diff < minDiff) {\n            minDiff = diff;\n            bestIdx = i;\n          }\n        }\n        var matched = shoeData[bestIdx];\n\n        // Clearance buffer by activity\n        var clearanceMm = 10;\n        var clearanceText = '10 mm (Standard Everyday Fit)';\n        if (activity === 'running') {\n          clearanceMm = 15;\n          clearanceText = '15 mm (Athletic / Running / Hiking)';\n        } else if (activity === 'dress') {\n          clearanceMm = 7;\n          clearanceText = '7 mm (Snug Dress / Formal Fit)';\n        }\n\n        // Width descriptions\n        var widthLabels = {\n          narrow: (category === 'women') ? 'Narrow (2A)' : 'Narrow (B)',\n          standard: (category === 'women') ? 'Standard (B / Medium)' : 'Standard (D)',\n          wide: (category === 'women') ? 'Wide (D)' : 'Wide (2E / EE)',\n          xwide: (category === 'women') ? 'Extra Wide (2E)' : 'Extra Wide (4E)'\n        };\n\n        var selectedUs = (category === 'women') ? matched.usW : matched.usM;\n\n        currentShoeResult = {\n          category: category,\n          footCm: targetCm,\n          footIn: targetCm / 2.54,\n          clearanceMm: clearanceMm,\n          clearanceText: clearanceText,\n          widthFitting: widthLabels[width],\n          us: selectedUs,\n          usMen: matched.usM,\n          usWomen: matched.usW,\n          uk: matched.uk,\n          eu: matched.eu,\n          mondo: matched.mondo,\n          jp: matched.cm.toFixed(1)\n        };\n\n        // Update stats\n        document.getElementById('statFootLength').textContent = targetCm.toFixed(1) + ' cm (' + (targetCm / 2.54).toFixed(2) + ' in)';\n        document.getElementById('svgClearanceBadge').textContent = clearanceMm + ' mm Recommended Buffer';\n\n        // Render Badges\n        var badgesHtml = \n          '<div style=\"padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; text-align: center;\">' +\n            '<span style=\"color: var(--text-muted); font-size: 0.75rem; font-family: var(--mono);\">' + ((category === 'women') ? 'US WOMEN' : 'US MEN') + '</span>' +\n            '<div style=\"font-size: 1.4rem; font-weight: bold; color: #10b981; font-family: var(--mono);\">' + selectedUs + '</div>' +\n          '</div>' +\n          '<div style=\"padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; text-align: center;\">' +\n            '<span style=\"color: var(--text-muted); font-size: 0.75rem; font-family: var(--mono);\">EU (PARIS PTS)</span>' +\n            '<div style=\"font-size: 1.4rem; font-weight: bold; color: #3b82f6; font-family: var(--mono);\">' + matched.eu + '</div>' +\n          '</div>' +\n          '<div style=\"padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; text-align: center;\">' +\n            '<span style=\"color: var(--text-muted); font-size: 0.75rem; font-family: var(--mono);\">UK SIZE</span>' +\n            '<div style=\"font-size: 1.4rem; font-weight: bold; color: var(--fg); font-family: var(--mono);\">' + matched.uk + '</div>' +\n          '</div>' +\n          '<div style=\"padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; text-align: center;\">' +\n            '<span style=\"color: var(--text-muted); font-size: 0.75rem; font-family: var(--mono);\">MONDOPOINT</span>' +\n            '<div style=\"font-size: 1.4rem; font-weight: bold; color: var(--fg); font-family: var(--mono);\">' + matched.mondo + ' mm</div>' +\n          '</div>' +\n          '<div style=\"padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; text-align: center;\">' +\n            '<span style=\"color: var(--text-muted); font-size: 0.75rem; font-family: var(--mono);\">WIDTH FITTING</span>' +\n            '<div style=\"font-size: 0.95rem; font-weight: bold; color: var(--fg); padding-top: 0.35rem;\">' + widthLabels[width] + '</div>' +\n          '</div>';\n        document.getElementById('shoeBadgesGrid').innerHTML = badgesHtml;\n\n        // Draw SVG\n        drawShoeSvg(targetCm, clearanceMm);\n      }\n\n      function drawShoeSvg(footCm, clearanceMm) {\n        var svg = document.getElementById('shoeSvg');\n        if (!svg) return;\n\n        var footPx = Math.max(140, Math.min(460, (footCm / 32.0) * 440));\n        var clearancePx = (clearanceMm / 10.0) * 14;\n        var shoePx = footPx + clearancePx + 20;\n\n        var startX = 60;\n        var startY = 90;\n\n        var svgContent = \n          '<!-- Background Grid Lines -->' +\n          '<line x1=\"60\" y1=\"10\" x2=\"60\" y2=\"160\" stroke=\"var(--border)\" stroke-dasharray=\"3,3\" stroke-width=\"1\"/>' +\n          '<line x1=\"' + (startX + footPx) + '\" y1=\"10\" x2=\"' + (startX + footPx) + '\" y2=\"160\" stroke=\"#3b82f6\" stroke-dasharray=\"3,3\" stroke-width=\"1\"/>' +\n          '<line x1=\"' + (startX + footPx + clearancePx) + '\" y1=\"10\" x2=\"' + (startX + footPx + clearancePx) + '\" y2=\"160\" stroke=\"#10b981\" stroke-width=\"2\"/>' +\n          '<line x1=\"' + (startX + shoePx) + '\" y1=\"10\" x2=\"' + (startX + shoePx) + '\" y2=\"160\" stroke=\"var(--border-strong)\" stroke-dasharray=\"2,2\" stroke-width=\"1\"/>' +\n\n          '<!-- Outer Shoe Last Outline -->' +\n          '<path d=\"M ' + (startX - 10) + ' 90 C ' + (startX - 10) + ' 55, ' + (startX + footPx * 0.4) + ' 45, ' + (startX + footPx * 0.8) + ' 45 C ' + (startX + shoePx) + ' 45, ' + (startX + shoePx) + ' 90, ' + (startX + shoePx) + ' 90 C ' + (startX + shoePx) + ' 90, ' + (startX + shoePx) + ' 135, ' + (startX + footPx * 0.8) + ' 135 C ' + (startX + footPx * 0.4) + ' 135, ' + (startX - 10) + ' 125, ' + (startX - 10) + ' 90 Z\" fill=\"rgba(100,116,139,0.06)\" stroke=\"var(--border-strong)\" stroke-width=\"2\"/>' +\n\n          '<!-- Bare Foot Anatomical Silhouette -->' +\n          '<path d=\"M ' + startX + ' 90 C ' + startX + ' 65, ' + (startX + footPx * 0.35) + ' 58, ' + (startX + footPx * 0.7) + ' 56 C ' + (startX + footPx) + ' 58, ' + (startX + footPx) + ' 80, ' + (startX + footPx) + ' 88 C ' + (startX + footPx) + ' 96, ' + (startX + footPx * 0.9) + ' 115, ' + (startX + footPx * 0.7) + ' 118 C ' + (startX + footPx * 0.35) + ' 120, ' + startX + ' 115, ' + startX + ' 90 Z\" fill=\"rgba(59,130,246,0.18)\" stroke=\"#3b82f6\" stroke-width=\"2\"/>' +\n\n          '<!-- Toe Clearance Zone -->' +\n          '<rect x=\"' + (startX + footPx) + '\" y=\"55\" width=\"' + clearancePx + '\" height=\"70\" fill=\"rgba(16,185,129,0.22)\" rx=\"3\"/>' +\n\n          '<!-- Dimension Arrows & Labels -->' +\n          '<!-- Foot Length Arrow -->' +\n          '<line x1=\"' + startX + '\" y1=\"155\" x2=\"' + (startX + footPx) + '\" y2=\"155\" stroke=\"#3b82f6\" stroke-width=\"2\"/>' +\n          '<text x=\"' + (startX + footPx / 2) + '\" y=\"148\" fill=\"#3b82f6\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"bold\">Foot: ' + footCm.toFixed(1) + ' cm</text>' +\n\n          '<!-- Clearance Label -->' +\n          '<text x=\"' + (startX + footPx + clearancePx / 2) + '\" y=\"42\" fill=\"#10b981\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"bold\">+' + clearanceMm + 'mm buffer</text>' +\n\n          '<!-- Heel Baseline -->' +\n          '<text x=\"' + (startX - 8) + '\" y=\"25\" fill=\"var(--text-muted)\" font-size=\"10\" text-anchor=\"end\">Heel Baseline</text>';\n\n        svg.innerHTML = svgContent;\n      }\n\n      function copyShoeReport() {\n        if (!currentShoeResult) return;\n        var r = currentShoeResult;\n        var text = \n          'INTERNATIONAL SHOE SIZING & FIT REPORT\\n' +\n          '========================================\\n' +\n          'Category: ' + ((r.category === 'women') ? 'Women' : (r.category === 'kids') ? 'Youth / Kids' : 'Men / Unisex') + '\\n' +\n          'Measured Foot Length: ' + r.footCm.toFixed(1) + ' cm (' + r.footIn.toFixed(2) + ' inches)\\n' +\n          'Toe-Box Buffer: ' + r.clearanceText + '\\n' +\n          'Width Fitting: ' + r.widthFitting + '\\n' +\n          '----------------------------------------\\n' +\n          'CONVERTED SIZES:\\n' +\n          '• US Size: ' + r.us + '\\n' +\n          '• EU Size (Paris Points): ' + r.eu + '\\n' +\n          '• UK Size: ' + r.uk + '\\n' +\n          '• Mondopoint (ISO 9407): ' + r.mondo + ' mm\\n' +\n          '• Japan / CM: ' + r.jp + ' cm\\n' +\n          '----------------------------------------\\n' +\n          'BRAND LAST GUIDELINES:\\n' +\n          '• Nike: Size up 0.5 size (runs narrow/short)\\n' +\n          '• Adidas: True to size (lower instep volume)\\n' +\n          '• New Balance: True to size (standard to wide)\\n' +\n          '========================================\\n' +\n          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/shoe-size-converter';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('btnCopyShoe');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '✓ Copied Sizing Report to Clipboard!';\n          btn.style.background = '#10b981';\n          btn.style.color = '#fff';\n          setTimeout(function() {\n            btn.innerHTML = orig;\n            btn.style.background = 'var(--surface-alt)';\n            btn.style.color = 'var(--fg)';\n          }, 2200);\n        });\n      }\n\n      document.addEventListener('DOMContentLoaded', function() {\n        renderMasterTable();\n        rebuildInputControl();\n        recalculateShoe();\n      });\n      renderMasterTable();\n      rebuildInputControl();\n      recalculateShoe();\n    </script>\n  ";

  writeFileSync(join(calcDir, 'shoe-size-converter.html'), renderPage({
    title: 'International Shoe Size Converter (US, UK, EU, cm, Mondo) & Fit Chart | Digital Tools Shed',
    metaDesc: 'Convert shoe sizes bidirectionally across US Men, US Women, UK, EU, Mondopoint (mm), and cm. Features width fittings (Narrow to 4E), toe-box clearance visualizer, brand guides, and 5 fatal traps.',
    canonical: `${DOMAIN}/calc/shoe-size-converter`,
    bodyContent: shoeBody,
    currentPath: '/calc/shoe-size-converter',
    faq: [
      { q: 'What is a US Men\'s 10 shoe size in European (EU), UK, and cm?', a: 'A US Men\'s size 10 is equal to European size EU 44 (or UK size 9.5), corresponding to approximately 28.0 cm Mondopoint / foot length (with a 27.5 cm to 28.0 cm foot length).' },
      { q: 'How do you convert Men\'s shoe sizes to Women\'s in the US?', a: 'In the US, Men\'s sizes are generally 1.5 sizes smaller in numerical designation than Women\'s sizes (e.g. Men\'s 8.5 = Women\'s 10.0). However, Men\'s shoes are manufactured on a wider standard \'D\' last, whereas Women\'s shoes are on a narrower \'B\' last. Women wearing men\'s sizes should expect a noticeably wider forefoot fit.' },
      { q: 'What is the Mondopoint shoe sizing system and how do you calculate it?', a: 'Mondopoint (governed by ISO 9407) is the only international standard defined by the true anatomical dimensions of the foot in millimeters (mm) rather than arbitrary shoe last numbers. A Mondopoint 270 corresponds to a foot length of 270 mm (27.0 cm) and is the gold standard for ski boots, military combat boots, and technical hiking footwear.' },
      { q: 'How much toe room or clearance should you have in front of your toes?', a: 'Functional footwear requires 10 mm to 15 mm (roughly 0.4 to 0.6 inches, or about one thumb\'s width) of empty space between your longest toe and the tip of the shoe. This accommodates natural foot elongation and arch depression under dynamic body weight during walking and running.' },
      { q: 'What do shoe width letters (Narrow B, Standard D, Wide 2E, Extra Wide 4E) mean?', a: 'Shoe widths denote the circumference around the ball of the foot (metatarsal heads). For Men: B is Narrow, D is Standard / Medium, 2E (EE) is Wide, and 4E is Extra Wide. For Women: 2A is Narrow, B is Standard / Medium, D is Wide, and 2E is Extra Wide. Each width step adds approximately 4.7 mm (3/16 inch) of forefoot circumference.' }
    ]
  }));

  console.log('  ✓ Built Body & Height Suite (feet-and-inches-to-cm, cm-to-feet-and-inches, shoe-size-converter in /calc/)');
}
