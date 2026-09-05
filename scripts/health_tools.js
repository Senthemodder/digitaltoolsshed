// scripts/health_tools.js - Health & Fitness Tools Suite for Digital Tools Shed

export function buildHealthToolsSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const healthDist = join(DIST, 'health');
  ensureDir(healthDist);

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
      slug: 'bmi-calculator',
      title: 'BMI Calculator (Standard & Oxford New BMI with Waist-to-Height Ratio)',
      metaDesc: 'Calculate Body Mass Index (BMI), Oxford New BMI, Ponderal Index, and Waist-to-Height Ratio (WHtR) with WHO healthy weight ranges and metric & imperial units.',
      category: 'Health & Fitness',
      faq: [
        { q: 'What is a healthy BMI range according to the World Health Organization (WHO)?', a: 'According to WHO clinical criteria for adults, a BMI between 18.5 and 24.9 is considered Normal / Healthy Weight. A BMI below 18.5 is Underweight, 25.0 to 29.9 is Overweight (Pre-obese), 30.0 to 34.9 is Obese Class I, 35.0 to 39.9 is Obese Class II, and 40.0 or higher is Obese Class III (Morbid Obesity).' },
        { q: 'What is the Oxford \'New BMI\' formula and why is it more accurate?', a: 'Invented by Professor Nick Trefethen of Oxford University, the New BMI formula [New BMI = 1.3 × Weight (kg) / Height (m)^2.5] addresses the mathematical scaling flaw of the 1830s Quetelet formula (Weight / Height^2). In standard 2D BMI, taller people are artificially classified as heavier/more obese, while shorter individuals are made to appear leaner than they truly are. The 2.5 power aligns closer with 3D human volumetric mass.' },
        { q: 'Why is Waist-to-Height Ratio (WHtR) often recommended over BMI alone?', a: 'In 2022, the UK National Institute for Health and Care Excellence (NICE) updated clinical guidelines recommending that adults keep their waist circumference to less than half their height (WHtR < 0.5). WHtR specifically measures central visceral adiposity—the fat stored around vital organs—which is far more predictive of type 2 diabetes, hypertension, and cardiovascular disease than total scale weight.' },
        { q: 'Can BMI be inaccurate for muscular athletes and bodybuilders?', a: 'Yes. BMI measures total body mass divided by height squared without distinguishing between dense skeletal muscle and adipose fat tissue. Because muscle is approximately 18% denser than fat, muscular athletes frequently register as \'Overweight\' or \'Obese\' on BMI charts despite having sub-12% body fat and optimal metabolic health.' },
        { q: 'How do I calculate how much weight I need to lose to reach a normal BMI?', a: 'Multiply the square of your height in meters by 24.9 to find your maximum normal weight limit: Max Healthy Weight = 24.9 × [Height (m)]^2. Subtract this value from your current weight to find the exact number of kilograms or pounds you must lose to enter the normal range.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health &amp; Fitness</a> &gt; BMI Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">BMI Calculator (Standard &amp; Oxford New BMI)</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Assess your Body Mass Index (BMI), Oxford University New BMI, Ponderal Index, and clinical Waist-to-Height Ratio (WHtR) with simultaneous metric and imperial conversion.
          </p>

          <div class="tool-box">
            <!-- Unit Selector -->
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
              <button type="button" id="btnBmiMetric" onclick="setBmiUnit('metric')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid #3b82f6; background: rgba(59, 130, 246, 0.15); color: #3b82f6; cursor: pointer; font-weight: 600;">Metric (kg, cm)</button>
              <button type="button" id="btnBmiImperial" onclick="setBmiUnit('imperial')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--border); background: var(--surface-alt); color: var(--fg); cursor: pointer;">US Imperial (lbs, ft/in)</button>
            </div>

            <!-- Primary Inputs Grid -->
            <div class="grid-inputs">
              <!-- Metric Fields -->
              <div class="field-group" id="bmi-grp-w-metric">
                <label class="field-label">Current Weight (kg)</label>
                <input type="number" id="bmi-w-kg" class="code-input" value="72" min="20" max="350" step="0.5" oninput="syncBmiFromMetric()" style="font-size: 1.15rem;" />
              </div>
              <div class="field-group" id="bmi-grp-h-metric">
                <label class="field-label">Height (cm)</label>
                <input type="number" id="bmi-h-cm" class="code-input" value="175" min="50" max="250" step="0.5" oninput="syncBmiFromMetric()" style="font-size: 1.15rem;" />
              </div>

              <!-- Imperial Fields -->
              <div class="field-group" id="bmi-grp-w-imperial" style="display: none;">
                <label class="field-label">Current Weight (lbs)</label>
                <input type="number" id="bmi-w-lbs" class="code-input" value="158.7" min="45" max="750" step="0.5" oninput="syncBmiFromImperial()" style="font-size: 1.15rem;" />
              </div>
              <div class="field-group" id="bmi-grp-h-imperial" style="display: none;">
                <label class="field-label">Height (Feet &amp; Inches)</label>
                <div style="display: flex; gap: 0.5rem;">
                  <input type="number" id="bmi-h-ft" class="code-input" value="5" min="2" max="8" placeholder="ft" oninput="syncBmiFromImperial()" style="font-size: 1.15rem;" />
                  <input type="number" id="bmi-h-in" class="code-input" value="9" min="0" max="11" step="0.5" placeholder="in" oninput="syncBmiFromImperial()" style="font-size: 1.15rem;" />
                </div>
              </div>

              <!-- Optional Central Adiposity (Waist) -->
              <div class="field-group">
                <label class="field-label" id="bmi-lbl-waist">Waist Circumference (cm) <span style="font-weight: normal; text-transform: none; color: var(--text-muted);">(Optional for WHtR)</span></label>
                <input type="number" id="bmi-waist" class="code-input" value="82" min="30" max="200" step="0.5" oninput="calcBMI()" style="font-size: 1.15rem;" />
              </div>
            </div>

            <!-- Hero Output Results Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Standard Quetelet BMI</div>
                <div id="bmi-score" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">23.5</div>
                <div id="bmi-cat-badge" style="font-size: 0.88rem; font-weight: bold; color: #10b981; font-family: var(--mono);">Normal Weight (18.5 – 24.9)</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Oxford "New BMI"</div>
                <div id="bmi-new-score" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">23.1</div>
                <div id="bmi-new-diff" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">-0.4 vs Standard (Height Adjusted)</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Waist-to-Height Ratio (WHtR)</div>
                <div id="bmi-whtr-score" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">0.47</div>
                <div id="bmi-whtr-status" style="font-size: 0.82rem; color: #10b981; font-family: var(--mono);">Healthy Central Adiposity (< 0.5)</div>
              </div>
            </div>

            <!-- Visual Color Spectrum Gauge Bar -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">
                <span>WHO Adult Weight Classification Spectrum:</span>
                <span id="bmi-gauge-label" style="color: var(--fg); font-weight: bold;">Current: 23.5 (Normal)</span>
              </div>
              
              <!-- Multi-Segment Spectrum Bar -->
              <div style="position: relative; width: 100%; height: 28px; border-radius: 4px; overflow: hidden; display: flex; font-family: var(--mono); font-size: 0.7rem; font-weight: bold; color: #fff; text-align: center; line-height: 28px;">
                <div style="width: 14%; background: #3b82f6;" title="Underweight (< 18.5)">Under</div>
                <div style="width: 26%; background: #10b981;" title="Normal Weight (18.5–24.9)">Normal (18.5–24.9)</div>
                <div style="width: 20%; background: #f59e0b;" title="Overweight (25.0–29.9)">Over (25–30)</div>
                <div style="width: 20%; background: #ef4444;" title="Obese Class I (30.0–34.9)">Obese I</div>
                <div style="width: 20%; background: #991b1b;" title="Obese Class II/III (≥ 35.0)">Class II/III</div>
              </div>

              <!-- Needle / Pointer Position Marker -->
              <div style="position: relative; width: 100%; height: 16px; margin-top: 4px;">
                <div id="bmi-needle" style="position: absolute; top: 0; left: 32%; transform: translateX(-50%); width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-bottom: 10px solid var(--fg); transition: left 0.3s ease;"></div>
              </div>

              <!-- Healthy Target & Weight Delta Box -->
              <div style="margin-top: 0.75rem; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border); font-family: var(--mono); font-size: 0.84rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                <div>
                  <span style="color: var(--text-muted);">Normal Weight Range (BMI 18.5–24.9): </span>
                  <strong id="bmi-healthy-range" style="color: var(--fg);">56.7 – 76.3 kg (124.9 – 168.1 lbs)</strong>
                </div>
                <div id="bmi-delta-box" style="color: #10b981; font-weight: bold;">
                  ✓ You are within the healthy weight range
                </div>
              </div>
            </div>

            <!-- Auxiliary Diagnostic Metrics Grid -->
            <div style="margin-top: 1.25rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.82rem;">
              <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                <div style="color: var(--text-muted);">BMI Prime (Ratio to 25.0 Limit):</div>
                <div id="bmi-prime-val" style="font-size: 1.2rem; font-weight: bold; color: var(--fg); margin-top: 0.2rem;">0.94</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">< 0.74 Under | 0.74–1.00 Normal | > 1.00 Over</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                <div style="color: var(--text-muted);">Ponderal Index (Corpulence W/H³):</div>
                <div id="bmi-ponderal-val" style="font-size: 1.2rem; font-weight: bold; color: var(--fg); margin-top: 0.2rem;">13.43 kg/m³</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Normal: 11.0 – 14.5 kg/m³ (3D scaling)</div>
              </div>
              <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                <div style="color: var(--text-muted);">UK NICE Guidelines Risk:</div>
                <div id="bmi-nice-risk" style="font-size: 1.2rem; font-weight: bold; color: #10b981; margin-top: 0.2rem;">Low Cardiometabolic Risk</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Based on combined BMI + WHtR</div>
              </div>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopyBMI" onclick="copyBMISummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Comprehensive BMI &amp; Health Assessment
            </button>
          </div>

          <!-- Step-by-Step Worked Derivations -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Biometric Derivations</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">WHO &amp; Oxford Formulations</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Standard BMI, Oxford New BMI, and Waist-to-Height Ratio derived with your live biometric measurements:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">1. Standard Quetelet BMI (1832):</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">BMI = Weight (kg) / [Height (m)]²</div>
                <div id="bmi-step-1" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  72 kg / (1.75 m)² = 72 / 3.0625 = <strong>23.51 kg/m²</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">2. Oxford University "New BMI" (Nick Trefethen):</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">New BMI = 1.3 &times; Weight (kg) / [Height (m)]<sup>2.5</sup></div>
                <div id="bmi-step-2" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  1.3 &times; 72 / 1.75<sup>2.5</sup> = 93.6 / 4.045 = <strong>23.14 kg/m²</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981; font-weight: 700;">3. Waist-to-Height Ratio (WHtR) &amp; Central Adiposity:</strong>
                <div style="color: #10b981; margin-top: 0.25rem;">WHtR = Waist Circumference / Total Height</div>
                <div id="bmi-step-3" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  82 cm / 175 cm = <strong>0.469 (< 0.50 Healthy Threshold)</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Clinical Pitfalls & Blind Spots -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Clinical Pitfalls &amp; BMI Blind Spots</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Muscular Athlete False Positive:</strong> BMI cannot distinguish skeletal muscle mass from adipose fat. Because muscle tissue is ~18% denser than fat, strength athletes, bodybuilders, and rugby players frequently score in the \'Overweight\' (26–29) or \'Obese\' (>30) categories despite sub-12% body fat and superior cardiovascular markers.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Sarcopenic Obesity in Older Adults:</strong> With age, skeletal muscle degrades (sarcopenia) and is replaced by visceral belly fat. An elderly person may maintain a \'Normal\' BMI of 22–24 while possessing dangerous levels of internal organ adiposity and elevated cardiovascular risk. WHtR or DEXA scans are essential here.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Mathematical Scaling Distortion:</strong> In classic BMI, dividing mass by height squared instead of cubed treats humans as flat 2D squares rather than 3D volumes. Consequently, standard BMI overestimates obesity in tall people (over 6\'0\') and underestimates fatness in shorter individuals. Oxford\'s 2.5 exponent resolves this distortion.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Ethnicity Cutoff Disparities:</strong> WHO and International Diabetes Federation studies show that people of South Asian, East Asian, and Black ethnic backgrounds face elevated type 2 diabetes risk at lower BMI cutoffs (overweight at BMI &ge; 23, obesity at BMI &ge; 27.5).</li>
            </ul>
          </div>
        </div>

        <script>
          let bmiUnit = 'metric';

          window.setBmiUnit = function(unit) {
            bmiUnit = unit;
            const btnM = document.getElementById('btnBmiMetric');
            const btnI = document.getElementById('btnBmiImperial');
            const grpWm = document.getElementById('bmi-grp-w-metric');
            const grpHm = document.getElementById('bmi-grp-h-metric');
            const grpWi = document.getElementById('bmi-grp-w-imperial');
            const grpHi = document.getElementById('bmi-grp-h-imperial');
            const lblWaist = document.getElementById('bmi-lbl-waist');
            const inpWaist = document.getElementById('bmi-waist');

            if (unit === 'metric') {
              btnM.style.background = 'rgba(59, 130, 246, 0.15)';
              btnM.style.borderColor = '#3b82f6';
              btnM.style.color = '#3b82f6';
              btnI.style.background = 'var(--surface-alt)';
              btnI.style.borderColor = 'var(--border)';
              btnI.style.color = 'var(--fg)';

              grpWm.style.display = 'block';
              grpHm.style.display = 'block';
              grpWi.style.display = 'none';
              grpHi.style.display = 'none';

              lblWaist.innerHTML = 'Waist Circumference (cm) <span style="font-weight: normal; text-transform: none; color: var(--text-muted);">(Optional for WHtR)</span>';
              if (inpWaist.value) {
                inpWaist.value = (parseFloat(inpWaist.value) * 2.54).toFixed(1);
              }
            } else {
              btnI.style.background = 'rgba(59, 130, 246, 0.15)';
              btnI.style.borderColor = '#3b82f6';
              btnI.style.color = '#3b82f6';
              btnM.style.background = 'var(--surface-alt)';
              btnM.style.borderColor = 'var(--border)';
              btnM.style.color = 'var(--fg)';

              grpWm.style.display = 'none';
              grpHm.style.display = 'none';
              grpWi.style.display = 'block';
              grpHi.style.display = 'block';

              lblWaist.innerHTML = 'Waist Circumference (inches) <span style="font-weight: normal; text-transform: none; color: var(--text-muted);">(Optional for WHtR)</span>';
              if (inpWaist.value) {
                inpWaist.value = (parseFloat(inpWaist.value) / 2.54).toFixed(1);
              }
            }
            calcBMI();
          };

          window.syncBmiFromMetric = function() {
            const wKg = parseFloat(document.getElementById('bmi-w-kg').value) || 0;
            const hCm = parseFloat(document.getElementById('bmi-h-cm').value) || 0;

            const wLbs = wKg * 2.20462;
            const totalInches = hCm / 2.54;
            const ft = Math.floor(totalInches / 12);
            const inch = totalInches % 12;

            document.getElementById('bmi-w-lbs').value = wLbs.toFixed(1);
            document.getElementById('bmi-h-ft').value = ft;
            document.getElementById('bmi-h-in').value = inch.toFixed(1);

            calcBMI();
          };

          window.syncBmiFromImperial = function() {
            const wLbs = parseFloat(document.getElementById('bmi-w-lbs').value) || 0;
            const ft = parseFloat(document.getElementById('bmi-h-ft').value) || 0;
            const inch = parseFloat(document.getElementById('bmi-h-in').value) || 0;

            const totalInches = (ft * 12) + inch;
            const wKg = wLbs / 2.20462;
            const hCm = totalInches * 2.54;

            document.getElementById('bmi-w-kg').value = wKg.toFixed(1);
            document.getElementById('bmi-h-cm').value = hCm.toFixed(1);

            calcBMI();
          };

          function calcBMI() {
            let wKg = 72;
            let hCm = 175;
            let waistCm = 82;

            if (bmiUnit === 'metric') {
              wKg = parseFloat(document.getElementById('bmi-w-kg').value) || 0;
              hCm = parseFloat(document.getElementById('bmi-h-cm').value) || 1;
              waistCm = parseFloat(document.getElementById('bmi-waist').value) || 0;
            } else {
              const wLbs = parseFloat(document.getElementById('bmi-w-lbs').value) || 0;
              const ft = parseFloat(document.getElementById('bmi-h-ft').value) || 0;
              const inch = parseFloat(document.getElementById('bmi-h-in').value) || 0;
              const waistIn = parseFloat(document.getElementById('bmi-waist').value) || 0;

              wKg = wLbs / 2.20462;
              hCm = ((ft * 12) + inch) * 2.54;
              waistCm = waistIn * 2.54;
            }

            if (hCm <= 0) hCm = 1;
            const hM = hCm / 100;

            // 1. Standard Quetelet BMI
            const bmi = wKg / (hM * hM);

            // 2. Oxford New BMI (1.3 * weight / height^2.5)
            const newBmi = (1.3 * wKg) / Math.pow(hM, 2.5);
            const diffNew = newBmi - bmi;

            // 3. Waist-to-Height Ratio (WHtR)
            let whtr = 0;
            if (waistCm > 0) {
              whtr = waistCm / hCm;
            }

            // 4. BMI Prime & Ponderal
            const bmiPrime = bmi / 25;
            const ponderal = wKg / Math.pow(hM, 3);

            // 5. Healthy Weight Range (18.5 - 24.9)
            const minHealthyKg = 18.5 * (hM * hM);
            const maxHealthyKg = 24.9 * (hM * hM);
            const minHealthyLbs = minHealthyKg * 2.20462;
            const maxHealthyLbs = maxHealthyKg * 2.20462;

            // Update DOM
            document.getElementById('bmi-score').textContent = bmi.toFixed(1);
            document.getElementById('bmi-new-score').textContent = newBmi.toFixed(1);
            
            const diffSign = diffNew >= 0 ? '+' : '';
            document.getElementById('bmi-new-diff').textContent = diffSign + diffNew.toFixed(1) + ' vs Standard (Height Adjusted)';

            // Category & Color
            let catName = 'Normal Weight (18.5 – 24.9)';
            let catColor = '#10b981';
            let gaugePct = 0;

            if (bmi < 16.0) {
              catName = 'Severe Thinness (< 16.0)';
              catColor = '#ef4444';
              gaugePct = Math.max(2, (bmi / 16.0) * 14);
            } else if (bmi < 18.5) {
              catName = 'Underweight / Mild Thinness (16.0 – 18.4)';
              catColor = '#3b82f6';
              gaugePct = 14 + ((bmi - 16.0) / 2.5) * 12;
            } else if (bmi < 25.0) {
              catName = 'Normal Weight (18.5 – 24.9)';
              catColor = '#10b981';
              gaugePct = 26 + ((bmi - 18.5) / 6.4) * 20;
            } else if (bmi < 30.0) {
              catName = 'Overweight / Pre-Obese (25.0 – 29.9)';
              catColor = '#f59e0b';
              gaugePct = 46 + ((bmi - 25.0) / 4.9) * 20;
            } else if (bmi < 35.0) {
              catName = 'Obese Class I (30.0 – 34.9)';
              catColor = '#ef4444';
              gaugePct = 66 + ((bmi - 30.0) / 4.9) * 18;
            } else {
              catName = 'Obese Class II/III (≥ 35.0)';
              catColor = '#991b1b';
              gaugePct = Math.min(98, 84 + ((bmi - 35.0) / 10.0) * 14);
            }

            const scoreEl = document.getElementById('bmi-score');
            const badgeEl = document.getElementById('bmi-cat-badge');
            scoreEl.style.color = catColor;
            badgeEl.textContent = catName;
            badgeEl.style.color = catColor;

            // Needle positioning
            document.getElementById('bmi-needle').style.left = Math.min(98, Math.max(2, gaugePct)) + '%';
            document.getElementById('bmi-gauge-label').textContent = 'Current: ' + bmi.toFixed(1) + ' (' + catName.split(' ')[0] + ')';

            // WHtR Display
            const whtrScoreEl = document.getElementById('bmi-whtr-score');
            const whtrStatusEl = document.getElementById('bmi-whtr-status');
            const niceRiskEl = document.getElementById('bmi-nice-risk');

            if (whtr > 0) {
              whtrScoreEl.textContent = whtr.toFixed(2);
              if (whtr < 0.40) {
                whtrStatusEl.textContent = 'Underweight / Very Lean (< 0.40)';
                whtrStatusEl.style.color = '#3b82f6';
                whtrScoreEl.style.color = '#3b82f6';
                niceRiskEl.textContent = 'Very Low Visceral Fat';
                niceRiskEl.style.color = '#3b82f6';
              } else if (whtr <= 0.49) {
                whtrStatusEl.textContent = 'Healthy Central Adiposity (0.40 – 0.49)';
                whtrStatusEl.style.color = '#10b981';
                whtrScoreEl.style.color = '#10b981';
                niceRiskEl.textContent = 'Low Cardiometabolic Risk';
                niceRiskEl.style.color = '#10b981';
              } else if (whtr <= 0.59) {
                whtrStatusEl.textContent = 'Increased Health Risk (0.50 – 0.59)';
                whtrStatusEl.style.color = '#f59e0b';
                whtrScoreEl.style.color = '#f59e0b';
                niceRiskEl.textContent = 'Elevated Visceral Risk (NICE)';
                niceRiskEl.style.color = '#f59e0b';
              } else {
                whtrStatusEl.textContent = 'Very High Risk (≥ 0.60)';
                whtrStatusEl.style.color = '#ef4444';
                whtrScoreEl.style.color = '#ef4444';
                niceRiskEl.textContent = 'High Cardiometabolic Alert';
                niceRiskEl.style.color = '#ef4444';
              }
            } else {
              whtrScoreEl.textContent = 'N/A';
              whtrStatusEl.textContent = 'Enter waist circumference above';
              whtrStatusEl.style.color = 'var(--text-muted)';
              niceRiskEl.textContent = 'Requires waist input';
              niceRiskEl.style.color = 'var(--text-muted)';
            }

            // Normal Range & Delta
            const rangeEl = document.getElementById('bmi-healthy-range');
            const deltaEl = document.getElementById('bmi-delta-box');

            if (bmiUnit === 'metric') {
              rangeEl.textContent = minHealthyKg.toFixed(1) + ' – ' + maxHealthyKg.toFixed(1) + ' kg';
              if (wKg > maxHealthyKg) {
                const toLose = wKg - maxHealthyKg;
                deltaEl.innerHTML = '<span style="color: #f59e0b;">▼ Lose ' + toLose.toFixed(1) + ' kg to reach normal BMI (24.9)</span>';
              } else if (wKg < minHealthyKg) {
                const toGain = minHealthyKg - wKg;
                deltaEl.innerHTML = '<span style="color: #3b82f6;">▲ Gain ' + toGain.toFixed(1) + ' kg to reach normal BMI (18.5)</span>';
              } else {
                deltaEl.innerHTML = '<span style="color: #10b981;">✓ You are in the healthy weight range</span>';
              }
            } else {
              rangeEl.textContent = minHealthyLbs.toFixed(1) + ' – ' + maxHealthyLbs.toFixed(1) + ' lbs';
              const wLbs = wKg * 2.20462;
              if (wLbs > maxHealthyLbs) {
                const toLose = wLbs - maxHealthyLbs;
                deltaEl.innerHTML = '<span style="color: #f59e0b;">▼ Lose ' + toLose.toFixed(1) + ' lbs to reach normal BMI (24.9)</span>';
              } else if (wLbs < minHealthyLbs) {
                const toGain = minHealthyLbs - wLbs;
                deltaEl.innerHTML = '<span style="color: #3b82f6;">▲ Gain ' + toGain.toFixed(1) + ' lbs to reach normal BMI (18.5)</span>';
              } else {
                deltaEl.innerHTML = '<span style="color: #10b981;">✓ You are in the healthy weight range</span>';
              }
            }

            document.getElementById('bmi-prime-val').textContent = bmiPrime.toFixed(2);
            document.getElementById('bmi-ponderal-val').textContent = ponderal.toFixed(2) + ' kg/m³';

            // Derivations
            document.getElementById('bmi-step-1').innerHTML = wKg.toFixed(1) + ' kg / (' + hM.toFixed(2) + ' m)² = ' + wKg.toFixed(1) + ' / ' + (hM * hM).toFixed(4) + ' = <strong>' + bmi.toFixed(2) + ' kg/m²</strong>';
            document.getElementById('bmi-step-2').innerHTML = '1.3 &times; ' + wKg.toFixed(1) + ' / ' + hM.toFixed(2) + '<sup>2.5</sup> = ' + (1.3 * wKg).toFixed(1) + ' / ' + Math.pow(hM, 2.5).toFixed(3) + ' = <strong>' + newBmi.toFixed(2) + ' kg/m²</strong>';
            if (whtr > 0) {
              document.getElementById('bmi-step-3').innerHTML = waistCm.toFixed(1) + ' cm / ' + hCm.toFixed(1) + ' cm = <strong>' + whtr.toFixed(3) + '</strong> (' + (whtr < 0.5 ? '< 0.50 Healthy' : '&ge; 0.50 Elevated') + ')';
            } else {
              document.getElementById('bmi-step-3').innerHTML = 'Optional waist measurement not provided.';
            }
          }

          window.copyBMISummary = function() {
            const score = document.getElementById('bmi-score').textContent;
            const cat = document.getElementById('bmi-cat-badge').textContent;
            const newScore = document.getElementById('bmi-new-score').textContent;
            const whtr = document.getElementById('bmi-whtr-score').textContent;
            const whtrStatus = document.getElementById('bmi-whtr-status').textContent;
            const range = document.getElementById('bmi-healthy-range').textContent;
            const prime = document.getElementById('bmi-prime-val').textContent;
            const ponderal = document.getElementById('bmi-ponderal-val').textContent;

            const text = [
              '=== WHO BMI & HEALTH ASSESSMENT REPORT ===',
              'Standard Quetelet BMI: ' + score + ' kg/m²',
              'Weight Category: ' + cat,
              'Oxford New BMI: ' + newScore + ' kg/m²',
              'Waist-to-Height Ratio (WHtR): ' + whtr + ' (' + whtrStatus + ')',
              'Healthy Weight Range: ' + range,
              'BMI Prime: ' + prime + ' (Ratio to 25.0 threshold)',
              'Ponderal Index: ' + ponderal,
              '------------------------------------------',
              'Screening standards: World Health Organization (WHO) & UK NICE (2022)',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/health/bmi-calculator'
            ].join('\n');

            navigator.clipboard.writeText(text).then(function() {
              const btn = document.getElementById('btnCopyBMI');
              if (btn) {
                const old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Health Report!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() { calcBMI(); });
          calcBMI();
        </script>
      `
    },
    {
      slug: 'tdee-calculator',
      title: 'TDEE & Calorie Burn Calculator (Mifflin-St Jeor, Katch-McArdle & Goal Timeline)',
      metaDesc: 'Calculate your exact Total Daily Energy Expenditure (TDEE), BMR, calorie deficit targets, fat loss timeline, and custom macronutrient splits with scientific precision.',
      category: 'Health & Fitness',
      faq: [
        { q: 'What is the difference between BMR and TDEE?', a: 'Basal Metabolic Rate (BMR) is the minimum energy (calories) required to sustain vital autonomic biological functions (breathing, cellular repair, heartbeat, brain function) in a resting, post-absorptive state. Total Daily Energy Expenditure (TDEE) is the total energy your body burns in 24 hours, combining BMR with the thermic effect of food (TEF), non-exercise physical activity (NEAT), and structured exercise (EAT).' },
        { q: 'Which formula is more accurate: Mifflin-St Jeor or Katch-McArdle?', a: 'Mifflin-St Jeor is the most validated and reliable formula for the general population because it relies on weight, height, age, and sex. Katch-McArdle is significantly more accurate for lean, muscular athletes because it uses Lean Body Mass (LBM = weight × (1 - body fat %)), directly accounting for the higher metabolic rate of skeletal muscle compared to adipose tissue.' },
        { q: 'How large of a calorie deficit should I use to lose body fat without losing muscle?', a: 'Clinical sports nutrition guidelines recommend a moderate deficit of 300 to 500 kcal/day (roughly 15%–20% below TDEE). This produces a sustainable fat loss of approximately 0.5 to 1.0 lb (0.25–0.45 kg) per week. Aggressive deficits (>25% or >750 kcal) cause sharp drops in active thyroid hormones (T3), elevate cortisol, suppress leptin, and accelerate muscle protein catabolism.' },
        { q: 'Why do fitness trackers and smartwatches overestimate calories burned?', a: 'Multiple peer-reviewed clinical studies (including Stanford University evaluations) demonstrate that wrist-worn fitness trackers overestimate exercise energy expenditure by 25% to 40%. They mistake elevated heart rates from heat, dehydration, or stress for intense calorie consumption. Eating back exercise calories based on smartwatch readouts frequently stalls weight loss.' },
        { q: 'What is Adaptive Thermogenesis (Metabolic Adaptation)?', a: 'When you maintain a sustained caloric deficit, your body adapts to protect energy stores. BMR drops beyond what would be expected from weight loss alone, and subconscious daily movement (NEAT—fidgeting, pacing, posture) drops by up to 200–300 kcal/day. Incorporating periodic diet breaks (eating at maintenance for 1–2 weeks) helps reset leptin and restore metabolic rate during prolonged fat loss phases.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health & Fitness</a> &gt; TDEE Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">TDEE &amp; Calorie Burn Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Calculate your exact Total Daily Energy Expenditure (TDEE), Basal Metabolic Rate (BMR), calorie deficit milestones, fat loss timeline, and custom macronutrient nutrition splits.
          </p>

          <!-- Unit Selector Toggle -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
            <button type="button" id="btnTdeeMetric" onclick="setTdeeUnit('metric')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid #3b82f6; background: rgba(59, 130, 246, 0.1); color: #3b82f6; cursor: pointer; font-weight: 600;">Metric (kg / cm)</button>
            <button type="button" id="btnTdeeImperial" onclick="setTdeeUnit('imperial')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--border); background: var(--surface-alt); color: var(--fg); cursor: pointer;">Imperial (lbs / ft &amp; in)</button>
          </div>

          <div class="tool-box">
            <!-- Biological Inputs -->
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Biological Sex</label>
                <select id="tdee-gender" class="code-input" onchange="calcTDEE()">
                  <option value="male" selected>Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Age (Years)</label>
                <input type="number" id="tdee-age" class="code-input" value="28" min="15" max="100" step="1" oninput="calcTDEE()" />
              </div>

              <!-- Metric Inputs -->
              <div class="field-group" id="tdee-grp-w-metric">
                <label class="field-label">Current Weight (kg)</label>
                <input type="number" id="tdee-weight-kg" class="code-input" value="78" min="30" max="300" step="0.5" oninput="calcTDEE('kg')" />
              </div>
              <div class="field-group" id="tdee-grp-h-metric">
                <label class="field-label">Height (cm)</label>
                <input type="number" id="tdee-height-cm" class="code-input" value="178" min="100" max="250" step="1" oninput="calcTDEE('cm')" />
              </div>

              <!-- Imperial Inputs -->
              <div class="field-group" id="tdee-grp-w-imperial" style="display: none;">
                <label class="field-label">Current Weight (lbs)</label>
                <input type="number" id="tdee-weight-lbs" class="code-input" value="172" min="65" max="650" step="1" oninput="calcTDEE('lbs')" />
              </div>
              <div class="field-group" id="tdee-grp-h-imperial" style="display: none;">
                <label class="field-label">Height (Feet &amp; Inches)</label>
                <div style="display: flex; gap: 0.5rem;">
                  <input type="number" id="tdee-height-ft" class="code-input" value="5" min="3" max="7" placeholder="ft" oninput="calcTDEE('ftin')" />
                  <input type="number" id="tdee-height-in" class="code-input" value="10" min="0" max="11" placeholder="in" oninput="calcTDEE('ftin')" />
                </div>
              </div>

              <div class="field-group">
                <label class="field-label">Body Fat % (Optional)</label>
                <input type="number" id="tdee-bf" class="code-input" placeholder="Unlocks Katch-McArdle" min="3" max="60" step="0.5" oninput="calcTDEE()" />
              </div>

              <div class="field-group">
                <label class="field-label">Goal Weight (Optional)</label>
                <input type="number" id="tdee-goal-weight" class="code-input" value="72" placeholder="e.g. 72 kg / 158 lbs" step="0.5" oninput="calcTDEE()" />
              </div>
            </div>

            <!-- Activity Level Selector -->
            <div class="field-group" style="margin-top: 0.5rem;">
              <label class="field-label">Physical Activity Level (PAL)</label>
              <select id="tdee-pal" class="code-input" onchange="calcTDEE()">
                <option value="1.2">Sedentary (desk job, minimal walking, <3,000 steps/day)</option>
                <option value="1.375" selected>Lightly Active (light exercise or sports 1–3 days/wk, ~5,000–7,000 steps)</option>
                <option value="1.55">Moderately Active (moderate training 3–5 days/wk, ~8,000–10,000 steps)</option>
                <option value="1.725">Very Active (intense heavy training 6–7 days/wk, or physical labor job)</option>
                <option value="1.9">Extra Active (elite athlete, endurance training twice daily, heavy construction)</option>
              </select>
            </div>

            <!-- Hero Output Results -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Maintenance Energy (TDEE)</div>
                <div id="tdee-primary-val" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">2,438 kcal</div>
                <div id="tdee-weekly-burn" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">17,066 kcal / week</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Basal Metabolic Rate (BMR)</div>
                <div id="tdee-bmr-val" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">1,773 kcal</div>
                <div id="tdee-bmr-sub" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">Mifflin-St Jeor Standard</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Selected Target Intake</div>
                <div id="tdee-target-cal" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #8b5cf6; margin: 0.25rem 0;">1,950 kcal</div>
                <div id="tdee-target-sub" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">-488 kcal deficit (Moderate Cut)</div>
              </div>
            </div>

            <!-- Multi-Formula Comparison Strip -->
            <div style="margin-top: 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 0.85rem;">
              <div style="font-family: var(--mono); font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem; font-weight: 600;">
                Metabolic Formula Comparison:
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.5rem; font-family: var(--mono); font-size: 0.8rem;">
                <div>Mifflin-St Jeor: <strong id="tdee-f-mifflin" style="color: var(--fg);">1,773 kcal</strong></div>
                <div>Harris-Benedict (1984): <strong id="tdee-f-harris" style="color: var(--fg);">1,795 kcal</strong></div>
                <div>Katch-McArdle (LBM): <strong id="tdee-f-katch" style="color: #3b82f6;">1,750 kcal</strong></div>
              </div>
            </div>

            <!-- Energy Partitioning Bar (Pure CSS) -->
            <div style="margin-top: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">
                <span>Daily Energy Expenditure Partitioning:</span>
                <span id="tdee-bar-total" style="color: var(--fg);">Total: 2,438 kcal (100%)</span>
              </div>
              <div style="display: flex; width: 100%; height: 26px; border-radius: 4px; overflow: hidden; font-family: var(--mono); font-size: 0.72rem; font-weight: bold; color: #fff; text-align: center; line-height: 26px;">
                <div id="tdee-bar-bmr" style="width: 72.7%; background: #3b82f6;" title="Basal Metabolic Rate">BMR (73%)</div>
                <div id="tdee-bar-neat" style="width: 15.0%; background: #10b981;" title="Non-Exercise Activity">NEAT (15%)</div>
                <div id="tdee-bar-tef" style="width: 8.5%; background: #f59e0b;" title="Thermic Effect of Food">TEF (8%)</div>
                <div id="tdee-bar-eat" style="width: 3.8%; background: #ef4444;" title="Exercise Thermogenesis">EAT</div>
              </div>
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted);">
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #3b82f6; border-radius: 2px;"></span> BMR (Organs at Rest)</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #10b981; border-radius: 2px;"></span> NEAT (Subconscious Walking/Fidgeting)</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #f59e0b; border-radius: 2px;"></span> TEF (Digestion Thermic Cost)</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #ef4444; border-radius: 2px;"></span> EAT (Structured Workouts)</span>
              </div>
            </div>

            <!-- Caloric Target & Fat Loss Simulator Slider -->
            <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #8b5cf6; border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                <h4 style="font-family: var(--serif); font-size: 1.05rem; margin: 0; color: var(--fg);">
                  🎯 Custom Calorie Target &amp; Goal Timeline Simulator:
                </h4>
                <span id="tdee-slider-badge" style="font-family: var(--mono); font-size: 0.75rem; color: #8b5cf6; font-weight: bold; background: rgba(139, 92, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">-20% Deficit (Moderate Cut)</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
                Adjust your daily caloric intake from an aggressive deficit to an anabolic lean bulk, and see the exact projected weekly fat loss rate and milestone completion date:
              </p>
              <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: center;">
                <div>
                  <label class="field-label">Calorie Adjustment: <span id="tdee-slider-pct" style="color: #8b5cf6; font-size: 1rem;">-20%</span></label>
                  <input type="range" id="tdee-cal-slider" min="-40" max="30" value="-20" step="5" oninput="updateTDEESlider(this.value)" style="width: 100%; cursor: pointer;" />
                </div>
                <div style="text-align: right; min-width: 140px;">
                  <div style="font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted);">Target Daily Calories:</div>
                  <div id="tdee-slider-calories" style="font-family: var(--mono); font-size: 1.3rem; font-weight: bold; color: var(--fg);">1,950 kcal</div>
                </div>
              </div>

              <!-- Milestone Timeline Box -->
              <div id="tdee-timeline-box" style="margin-top: 1rem; padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.82rem; line-height: 1.5;">
                <!-- Populated dynamically -->
              </div>
            </div>

            <!-- Nutritional Macronutrient Distribution Protocol -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; color: var(--fg);">
                  🥗 Optimal Macronutrient Split for Target (<span id="tdee-macro-cal-label">1,950 kcal</span>):
                </div>
                <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                  <button type="button" class="btn-sec" onclick="setTdeeMacroStrategy('highp')" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;">High Protein (40C/35P/25F)</button>
                  <button type="button" class="btn-sec" onclick="setTdeeMacroStrategy('balanced')" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;">Balanced (40C/30P/30F)</button>
                  <button type="button" class="btn-sec" onclick="setTdeeMacroStrategy('keto')" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;">Keto (<30g C/25P/70F)</button>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
                <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border); border-top: 3px solid #ef4444; text-align: center;">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Dietary Protein (4 kcal/g)</div>
                  <div id="tdee-m-p-g" style="font-size: 1.3rem; font-weight: bold; color: #ef4444; margin: 0.2rem 0;">171g</div>
                  <div id="tdee-m-p-cal" style="font-size: 0.75rem; color: var(--text-muted);">683 kcal (35%)</div>
                  <div id="tdee-m-p-meal" style="font-size: 0.72rem; color: var(--fg); margin-top: 0.3rem;">~43g / 4 meals</div>
                </div>

                <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border); border-top: 3px solid #3b82f6; text-align: center;">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Healthy Fats (9 kcal/g)</div>
                  <div id="tdee-m-f-g" style="font-size: 1.3rem; font-weight: bold; color: #3b82f6; margin: 0.2rem 0;">54g</div>
                  <div id="tdee-m-f-cal" style="font-size: 0.75rem; color: var(--text-muted);">488 kcal (25%)</div>
                  <div id="tdee-m-f-meal" style="font-size: 0.72rem; color: var(--fg); margin-top: 0.3rem;">~14g / 4 meals</div>
                </div>

                <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border); border-top: 3px solid #10b981; text-align: center;">
                  <div style="color: var(--text-muted); font-size: 0.7rem;">Carbohydrates (4 kcal/g)</div>
                  <div id="tdee-m-c-g" style="font-size: 1.3rem; font-weight: bold; color: #10b981; margin: 0.2rem 0;">195g</div>
                  <div id="tdee-m-c-cal" style="font-size: 0.75rem; color: var(--text-muted);">780 kcal (40%)</div>
                  <div id="tdee-m-c-meal" style="font-size: 0.72rem; color: var(--fg); margin-top: 0.3rem;">~49g / 4 meals</div>
                </div>
              </div>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopyTDEE" onclick="copyTDEESummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Complete TDEE, Deficit Targets &amp; Macro Schedule
            </button>
          </div>

          <!-- Step-by-Step Worked Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step TDEE &amp; BMR Clinical Derivation</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Mifflin-St Jeor Standard</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Total Daily Energy Expenditure combines Basal Metabolic Rate (BMR) with the Physical Activity Level (PAL) coefficient:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 1: Mifflin-St Jeor BMR Equation</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">
                  Male: BMR = (10 &times; W<sub>kg</sub>) + (6.25 &times; H<sub>cm</sub>) - (5 &times; Age) + 5<br>
                  Female: BMR = (10 &times; W<sub>kg</sub>) + (6.25 &times; H<sub>cm</sub>) - (5 &times; Age) - 161
                </div>
                <div id="tdee-step-1" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  Worked: (10 &times; 78) + (6.25 &times; 178) - (5 &times; 28) + 5 = 780 + 1112.5 - 140 + 5 = <strong>1,757.5 kcal</strong>.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 2: Activity Multiplier (PAL)</strong>
                <div id="tdee-step-2" style="color: var(--text-muted); margin-top: 0.25rem;">
                  TDEE = BMR &times; PAL = 1,758 &times; 1.375 = <strong>2,417 kcal / day (Maintenance)</strong>.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #8b5cf6;">Step 3: Deficit Calorie Math &amp; The 3,500 kcal Rule</strong>
                <div id="tdee-step-3" style="color: var(--text-muted); margin-top: 0.25rem;">
                  Target = TDEE &times; 0.80 = <strong>1,934 kcal / day</strong> (Deficit = -483 kcal/day = -3,384 kcal/wk &approx; 0.97 lb fat loss/wk).
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Metabolic Traps -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Metabolic Traps &amp; Adaptive Thermogenesis</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Adaptive Thermogenesis &amp; Metabolic Slowdown:</strong> Running an aggressive calorie deficit (>750 kcal/day) for prolonged periods triggers metabolic down-regulation (thyroid T3 decreases, leptin crashes, and cortisol spikes). Non-exercise activity thermogenesis (fidgeting, walking speed, posture) drops subconsciously by up to 300 kcal/day, stalling fat loss. Use conservative deficits of 300–500 kcal.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Fitness Tracker Caloric Burn Overestimation:</strong> Commercial smartwatches routinely overestimate calories burned during cardio and weight training by <strong>25% to 40%</strong>. "Eating back" workout calories based on watch readouts is the primary reason fitness enthusiasts fail to lose weight.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Thermic Effect of Food (TEF) Advantage:</strong> Not all calories require equal metabolic effort to process. Dietary protein requires <strong>20% to 30% of its caloric value</strong> simply to digest and assimilate, compared to 5–10% for carbs and 0–3% for dietary fats. High-protein diets naturally increase metabolic burn.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Diet Breaks &amp; Refeed Strategy:</strong> After 8 to 12 weeks of continuous cutting, taking a 1-to-2 week planned "diet break" at maintenance calories resets leptin, restores thyroid hormone production, and prevents metabolic adaptation without gaining body fat.</li>
            </ul>
          </div>
        </div>

        <script>
          var tdeeUnitMode = 'metric';
          var curTdeeMacroStrategy = 'highp';
          var curTdeeDeficitPct = -20;

          window.setTdeeUnit = function(mode) {
            tdeeUnitMode = mode;
            var btnM = document.getElementById('btnTdeeMetric');
            var btnI = document.getElementById('btnTdeeImperial');
            var grpWM = document.getElementById('tdee-grp-w-metric');
            var grpHM = document.getElementById('tdee-grp-h-metric');
            var grpWI = document.getElementById('tdee-grp-w-imperial');
            var grpHI = document.getElementById('tdee-grp-h-imperial');

            if (mode === 'metric') {
              btnM.style.background = 'rgba(59, 130, 246, 0.1)';
              btnM.style.borderColor = '#3b82f6';
              btnM.style.color = '#3b82f6';
              btnI.style.background = 'var(--surface-alt)';
              btnI.style.borderColor = 'var(--border)';
              btnI.style.color = 'var(--fg)';

              grpWM.style.display = 'block';
              grpHM.style.display = 'block';
              grpWI.style.display = 'none';
              grpHI.style.display = 'none';
            } else {
              btnI.style.background = 'rgba(59, 130, 246, 0.1)';
              btnI.style.borderColor = '#3b82f6';
              btnI.style.color = '#3b82f6';
              btnM.style.background = 'var(--surface-alt)';
              btnM.style.borderColor = 'var(--border)';
              btnM.style.color = 'var(--fg)';

              grpWM.style.display = 'none';
              grpHM.style.display = 'none';
              grpWI.style.display = 'block';
              grpHI.style.display = 'block';
            }
            calcTDEE();
          };

          window.setTdeeMacroStrategy = function(strat) {
            curTdeeMacroStrategy = strat;
            calcTDEE();
          };

          window.updateTDEESlider = function(val) {
            curTdeeDeficitPct = parseInt(val, 10);
            calcTDEE();
          };

          function calcTDEE(origin) {
            var g = document.getElementById('tdee-gender').value;
            var age = parseFloat(document.getElementById('tdee-age').value) || 28;
            var pal = parseFloat(document.getElementById('tdee-pal').value) || 1.375;
            var bf = parseFloat(document.getElementById('tdee-bf').value) || 0;
            var goalWeightInput = parseFloat(document.getElementById('tdee-goal-weight').value) || 0;

            var weightKg = 78;
            var heightCm = 178;

            if (tdeeUnitMode === 'metric') {
              weightKg = parseFloat(document.getElementById('tdee-weight-kg').value) || 78;
              heightCm = parseFloat(document.getElementById('tdee-height-cm').value) || 178;

              if (origin === 'kg') {
                document.getElementById('tdee-weight-lbs').value = Math.round(weightKg * 2.20462);
              } else if (origin === 'cm') {
                var totalInches = heightCm / 2.54;
                var ft = Math.floor(totalInches / 12);
                var inches = Math.round(totalInches % 12);
                document.getElementById('tdee-height-ft').value = ft;
                document.getElementById('tdee-height-in').value = inches;
              }
            } else {
              var lbs = parseFloat(document.getElementById('tdee-weight-lbs').value) || 172;
              var ft = parseFloat(document.getElementById('tdee-height-ft').value) || 5;
              var inches = parseFloat(document.getElementById('tdee-height-in').value) || 10;
              weightKg = lbs / 2.20462;
              heightCm = ((ft * 12) + inches) * 2.54;

              if (origin === 'lbs') {
                document.getElementById('tdee-weight-kg').value = (lbs / 2.20462).toFixed(1);
              } else if (origin === 'ftin') {
                document.getElementById('tdee-height-cm').value = Math.round(heightCm);
              }
            }

            // Formulas
            // 1. Mifflin-St Jeor
            var bmrMifflin = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
            bmrMifflin += (g === 'male' ? 5 : -161);

            // 2. Revised Harris-Benedict (1984)
            var bmrHarris = 0;
            if (g === 'male') {
              bmrHarris = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
            } else {
              bmrHarris = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
            }

            // 3. Katch-McArdle (if body fat % given)
            var bmrKatch = 0;
            var lbmKg = 0;
            if (bf > 0 && bf < 60) {
              lbmKg = weightKg * (1 - (bf / 100));
              bmrKatch = 370 + (21.6 * lbmKg);
            } else {
              // Standard assumption
              var defaultBf = g === 'male' ? 18 : 25;
              lbmKg = weightKg * (1 - (defaultBf / 100));
              bmrKatch = 370 + (21.6 * lbmKg);
            }

            var chosenBmr = bmrMifflin;
            var tdee = Math.round(chosenBmr * pal);
            var weeklyBurn = tdee * 7;

            // Slider targets
            var targetCal = Math.round(tdee * (1 + (curTdeeDeficitPct / 100)));
            var dailyDiff = targetCal - tdee;

            // Update Primary Hero Results
            document.getElementById('tdee-primary-val').textContent = tdee.toLocaleString('en-US') + ' kcal';
            document.getElementById('tdee-weekly-burn').textContent = weeklyBurn.toLocaleString('en-US') + ' kcal / week';

            document.getElementById('tdee-bmr-val').textContent = Math.round(chosenBmr).toLocaleString('en-US') + ' kcal';

            document.getElementById('tdee-target-cal').textContent = targetCal.toLocaleString('en-US') + ' kcal';
            var diffStr = (dailyDiff >= 0 ? '+' : '') + dailyDiff + ' kcal';
            var defLabel = curTdeeDeficitPct === 0 ? 'Maintenance' :
              (curTdeeDeficitPct === -20 ? 'Moderate Cut (-20%)' :
              (curTdeeDeficitPct <= -25 ? 'Aggressive Cut (' + curTdeeDeficitPct + '%)' :
              (curTdeeDeficitPct < 0 ? 'Mild Cut (' + curTdeeDeficitPct + '%)' : 'Hypertrophy Bulk (+' + curTdeeDeficitPct + '%)')));
            document.getElementById('tdee-target-sub').textContent = diffStr + ' (' + defLabel + ')';

            // Multi-Formula display
            document.getElementById('tdee-f-mifflin').textContent = Math.round(bmrMifflin).toLocaleString('en-US') + ' kcal';
            document.getElementById('tdee-f-harris').textContent = Math.round(bmrHarris).toLocaleString('en-US') + ' kcal';
            document.getElementById('tdee-f-katch').textContent = Math.round(bmrKatch).toLocaleString('en-US') + ' kcal' + (bf > 0 ? ' (exact LBM)' : ' (est)');

            // Slider UI update
            document.getElementById('tdee-cal-slider').value = curTdeeDeficitPct;
            document.getElementById('tdee-slider-pct').textContent = (curTdeeDeficitPct >= 0 ? '+' : '') + curTdeeDeficitPct + '%';
            document.getElementById('tdee-slider-calories').textContent = targetCal.toLocaleString('en-US') + ' kcal';
            document.getElementById('tdee-slider-badge').textContent = defLabel;

            // Energy Bar partitioning
            var neatCal = Math.round(chosenBmr * 0.20);
            var tefCal = Math.round(tdee * 0.08);
            var eatCal = Math.max(0, tdee - chosenBmr - neatCal - tefCal);
            var bmrPct = (chosenBmr / tdee) * 100;
            var neatPct = (neatCal / tdee) * 100;
            var tefPct = (tefCal / tdee) * 100;
            var eatPct = (eatCal / tdee) * 100;

            document.getElementById('tdee-bar-bmr').style.width = bmrPct.toFixed(1) + '%';
            document.getElementById('tdee-bar-neat').style.width = neatPct.toFixed(1) + '%';
            document.getElementById('tdee-bar-tef').style.width = tefPct.toFixed(1) + '%';
            document.getElementById('tdee-bar-eat').style.width = eatPct.toFixed(1) + '%';
            document.getElementById('tdee-bar-total').textContent = 'Total: ' + tdee.toLocaleString('en-US') + ' kcal (100%)';

            // Goal Timeline Math
            var weeklyLossLbs = (-dailyDiff * 7) / 3500;
            var weeklyLossKg = weeklyLossLbs * 0.453592;

            var timelineEl = document.getElementById('tdee-timeline-box');
            var goalWeightKg = tdeeUnitMode === 'metric' ? goalWeightInput : (goalWeightInput / 2.20462);

            if (goalWeightKg > 0 && Math.abs(weightKg - goalWeightKg) > 0.5) {
              var deltaKg = Math.abs(weightKg - goalWeightKg);
              var deltaLbs = deltaKg * 2.20462;
              var isLosing = goalWeightKg < weightKg;

              if (isLosing && weeklyLossKg > 0.05) {
                var weeksNeeded = Math.ceil(deltaKg / weeklyLossKg);
                var targetDate = new Date();
                targetDate.setDate(targetDate.getDate() + (weeksNeeded * 7));
                var dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };

                timelineEl.innerHTML = '<strong>Goal Projection:</strong> Losing ' + deltaKg.toFixed(1) + ' kg (' + deltaLbs.toFixed(1) + ' lbs) to reach <strong>' + goalWeightInput + (tdeeUnitMode === 'metric' ? ' kg' : ' lbs') + '</strong> at ' + (weeklyLossLbs).toFixed(2) + ' lbs/week (-' + weeklyLossKg.toFixed(2) + ' kg/wk).<br>' +
                  '⏱️ Estimated Time: <strong>' + weeksNeeded + ' Weeks (~' + (weeksNeeded / 4.3).toFixed(1) + ' Months)</strong> &bull; Projected Milestone Date: <strong style="color: #10b981;">' + targetDate.toLocaleDateString('en-US', dateOptions) + '</strong>.' +
                  (weeklyLossLbs > 2.0 ? '<br><span style="color: #ef4444; font-weight: bold;">⚠️ Warning:</span> Projected fat loss rate exceeds 2.0 lbs/week. Elevated risk of muscle wasting and metabolic slowdown. Consider reducing deficit.' : '');
              } else if (!isLosing && weeklyLossKg < -0.05) {
                var surplusKg = Math.abs(weeklyLossKg);
                var weeksBulk = Math.ceil(deltaKg / surplusKg);
                timelineEl.innerHTML = '<strong>Bulking Projection:</strong> Gaining ' + deltaKg.toFixed(1) + ' kg (' + deltaLbs.toFixed(1) + ' lbs) to reach <strong>' + goalWeightInput + (tdeeUnitMode === 'metric' ? ' kg' : ' lbs') + '</strong> at +' + Math.abs(weeklyLossLbs).toFixed(2) + ' lbs/week.<br>' +
                  '⏱️ Estimated Time: <strong>' + weeksBulk + ' Weeks</strong> for clean hypertrophy pacing.';
              } else {
                timelineEl.innerHTML = 'Weight loss rate is near zero at maintenance calories. Adjust the slider to project fat loss timeline.';
              }
            } else {
              timelineEl.innerHTML = 'Enter your <strong>Goal Weight</strong> above to calculate the exact number of weeks and projected calendar date to achieve your physique target!';
            }

            // Macros calculation
            document.getElementById('tdee-macro-cal-label').textContent = targetCal.toLocaleString('en-US') + ' kcal';

            var pG = 0, fG = 0, cG = 0;
            if (curTdeeMacroStrategy === 'highp') {
              // 40% C, 35% P, 25% F
              pG = Math.round((targetCal * 0.35) / 4);
              fG = Math.round((targetCal * 0.25) / 9);
              cG = Math.round((targetCal * 0.40) / 4);
            } else if (curTdeeMacroStrategy === 'balanced') {
              // 40% C, 30% P, 30% F
              pG = Math.round((targetCal * 0.30) / 4);
              fG = Math.round((targetCal * 0.30) / 9);
              cG = Math.round((targetCal * 0.40) / 4);
            } else if (curTdeeMacroStrategy === 'keto') {
              cG = 25; // fixed low carb
              var remCal = targetCal - (cG * 4);
              pG = Math.round((remCal * 0.30) / 4);
              fG = Math.round((remCal * 0.70) / 9);
            }

            document.getElementById('tdee-m-p-g').textContent = pG + 'g';
            document.getElementById('tdee-m-p-cal').textContent = (pG * 4) + ' kcal (' + Math.round(((pG * 4) / targetCal) * 100) + '%)';
            document.getElementById('tdee-m-p-meal').textContent = '~' + Math.round(pG / 4) + 'g / 4 meals';

            document.getElementById('tdee-m-f-g').textContent = fG + 'g';
            document.getElementById('tdee-m-f-cal').textContent = (fG * 9) + ' kcal (' + Math.round(((fG * 9) / targetCal) * 100) + '%)';
            document.getElementById('tdee-m-f-meal').textContent = '~' + Math.round(fG / 4) + 'g / 4 meals';

            document.getElementById('tdee-m-c-g').textContent = cG + 'g';
            document.getElementById('tdee-m-c-cal').textContent = (cG * 4) + ' kcal (' + Math.round(((cG * 4) / targetCal) * 100) + '%)';
            document.getElementById('tdee-m-c-meal').textContent = '~' + Math.round(cG / 4) + 'g / 4 meals';

            // Step Worked Text
            document.getElementById('tdee-step-1').innerHTML = 'Worked: (10 &times; ' + weightKg.toFixed(1) + ') + (6.25 &times; ' + heightCm.toFixed(1) + ') - (5 &times; ' + age + ') ' + (g === 'male' ? '+ 5' : '- 161') + ' = <strong>' + Math.round(chosenBmr) + ' kcal</strong>.';
            document.getElementById('tdee-step-2').innerHTML = 'TDEE = BMR &times; PAL = ' + Math.round(chosenBmr) + ' &times; ' + pal + ' = <strong>' + tdee.toLocaleString('en-US') + ' kcal / day (Maintenance)</strong>.';
            document.getElementById('tdee-step-3').innerHTML = 'Target Intake = TDEE &times; ' + (1 + (curTdeeDeficitPct / 100)).toFixed(2) + ' = <strong>' + targetCal.toLocaleString('en-US') + ' kcal / day</strong> (' + diffStr + ' kcal/day &approx; ' + (weeklyLossLbs).toFixed(2) + ' lbs fat loss/wk).';
          }

          window.copyTDEESummary = function() {
            var tdee = document.getElementById('tdee-primary-val').textContent;
            var bmr = document.getElementById('tdee-bmr-val').textContent;
            var target = document.getElementById('tdee-target-cal').textContent;
            var targetSub = document.getElementById('tdee-target-sub').textContent;
            var p = document.getElementById('tdee-m-p-g').textContent;
            var f = document.getElementById('tdee-m-f-g').textContent;
            var c = document.getElementById('tdee-m-c-g').textContent;

            var text = [
              '=== TDEE & METABOLIC CALORIE REPORT ===',
              'Basal Metabolic Rate (BMR): ' + bmr,
              'Daily Maintenance Energy (TDEE): ' + tdee,
              'Daily Target Caloric Intake: ' + target + ' (' + targetSub + ')',
              '---------------------------------------',
              'Daily Macronutrient Split:',
              'Protein: ' + p + ' | Healthy Fats: ' + f + ' | Carbohydrates: ' + c,
              '---------------------------------------',
              'Standard: Mifflin-St Jeor & Katch-McArdle Equations',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/health/tdee-calculator'
            ].join('\n');

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyTDEE');
              if (btn) {
                var old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Nutrition Targets!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() { calcTDEE(); });
          calcTDEE();
        </script>
      `
    },
    {
      slug: 'water-intake',
      title: 'Daily Water Intake & Hydration Schedule Calculator (Clinical Osmolality & Pacing)',
      metaDesc: 'Calculate optimal daily fluid requirements in liters and ounces based on body weight, workout intensity, sweat rate, climate, and elevation with hourly pacing.',
      category: 'Health & Fitness',
      faq: [
        { q: 'How much water should I drink per day according to clinical guidelines?', a: 'The National Academies of Sciences, Engineering, and Medicine (NASEM) recommends a baseline daily fluid intake of approximately 3.7 liters (125 fl oz / 15 cups) for adult men and 2.7 liters (91 fl oz / 11 cups) for adult women. Approximately 20% of this fluid comes from food (fruits, vegetables, soups), leaving 2.2 to 3.0 liters to be consumed as direct beverages.' },
        { q: 'Does exercise duration and sweat rate increase daily water needs?', a: 'Yes. The American College of Sports Medicine (ACSM) recommends adding 12 to 16 fl oz (350–500 ml) of fluid for every 30 minutes of moderate-to-vigorous exercise. For heavy sweat sessions or endurance athletics exceeding 60 minutes, athletes should weigh themselves before and after training: drink 16 to 24 fl oz (500–750 ml) for every pound of body weight lost during the session.' },
        { q: 'When should I add electrolytes (sodium, potassium, magnesium) to my water?', a: 'Plain water is optimal for everyday resting hydration. However, during continuous exercise lasting longer than 60 minutes, or in high-heat and humid environments where sweat loss exceeds 1 liter, you must replenish electrolytes—especially sodium (500–800 mg per liter). Drinking large volumes of plain water without sodium dilutes blood plasma and can lead to potentially life-threatening Exercise-Associated Hyponatremia (EAH).' },
        { q: 'What does urine color reveal about hydration levels?', a: 'Clinically evaluated via the Armstrong Urine Color Chart: Pale yellow or light straw color (Levels 1–3) indicates optimal hydration. Transparent/completely clear urine indicates mild overhydration (you may be washing out electrolytes). Dark amber, tea-colored, or brown urine (Levels 6–8) indicates severe dehydration requiring immediate fluid intake.' },
        { q: 'Does coffee, tea, or soda count toward daily water intake?', a: 'Yes. Extensive research confirms that caffeine doses under 400 mg/day (equivalent to 3–4 cups of brewed coffee) have a negligible diuretic effect in habitual consumers. Coffee, unsweetened tea, sparkling water, and milk all provide net positive hydration toward your daily fluid baseline.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health & Fitness</a> &gt; Water Intake Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Daily Water Intake &amp; Hydration Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Calculate your personalized daily hydration requirement, bottle &amp; glass counts, hourly pacing timeline, and electrolyte replacement schedule based on biological weight, sweat rate, and environment.
          </p>

          <!-- Unit Selector Toggle -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
            <button type="button" id="btnWaterMetric" onclick="setWaterUnit('metric')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid #3b82f6; background: rgba(59, 130, 246, 0.1); color: #3b82f6; cursor: pointer; font-weight: 600;">Metric (kg / Liters / ml)</button>
            <button type="button" id="btnWaterImperial" onclick="setWaterUnit('imperial')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--border); background: var(--surface-alt); color: var(--fg); cursor: pointer;">Imperial (lbs / Fl. Oz / cups)</button>
          </div>

          <div class="tool-box">
            <!-- Inputs Grid -->
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label" id="lblWaterWeight">Body Weight (kg)</label>
                <input type="number" id="water-weight" class="code-input" value="70" step="1" oninput="calcWater()" style="font-size: 1.2rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Daily Exercise Duration (Minutes)</label>
                <input type="number" id="water-exercise" class="code-input" value="45" step="5" min="0" max="300" oninput="calcWater()" style="font-size: 1.2rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Workout Sweat Intensity</label>
                <select id="water-intensity" class="code-input" onchange="calcWater()">
                  <option value="1.0">Light / Walking (minimal perspiration)</option>
                  <option value="1.3" selected>Moderate / Weightlifting / Jogging (steady sweat)</option>
                  <option value="1.8">Vigorous / HIIT / Competitive Sports (heavy dripping sweat)</option>
                  <option value="2.4">Endurance / Marathon / Cycling &gt; 90 min (extreme sweat)</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Climate &amp; Environmental Heat</label>
                <select id="water-climate" class="code-input" onchange="calcWater()">
                  <option value="0" selected>Temperate / Climate-Controlled (Indoor / 20°C / 68°F)</option>
                  <option value="400">Warm &amp; Dry (+400 ml / 14 oz)</option>
                  <option value="750">Hot &amp; Humid Summer (+750 ml / 25 oz)</option>
                  <option value="500">High Altitude &gt; 2,000m (+500 ml / 17 oz)</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Physiological State</label>
                <select id="water-stage" class="code-input" onchange="calcWater()">
                  <option value="0" selected>Standard Healthy Adult</option>
                  <option value="300">Pregnancy (+300 ml / 10 oz)</option>
                  <option value="700">Lactating / Nursing (+700 ml / 24 oz)</option>
                </select>
              </div>
            </div>

            <!-- Hero Output Results -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Target Daily Fluid Intake</div>
                <div id="water-primary" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">3.20 Liters</div>
                <div id="water-secondary" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">108 Fl. Oz total beverages</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Glasses (8 oz / 240 ml)</div>
                <div id="water-glasses" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">13.3 Glasses</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Standard water glasses</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Gym Bottles (500 ml)</div>
                <div id="water-bottles" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #8b5cf6; margin: 0.25rem 0;">6.4 Bottles</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">Standard 16.9 oz bottles</div>
              </div>
            </div>

            <!-- Electrolyte Guidance Banner -->
            <div id="water-electrolyte-note" style="margin-top: 1rem; font-size: 0.85rem; padding: 0.75rem 1rem; border-radius: 6px; background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); color: var(--fg); line-height: 1.5;">
              ⚡ <strong>Electrolyte Recommendation:</strong> Sustained workout sweat loss requires ~500–800 mg sodium per liter of replacement fluid to maintain optimal plasma osmolality and prevent cramping.
            </div>

            <!-- Hourly Pacing Schedule -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; color: var(--fg);">
                  ⏰ Optimal Hourly Hydration Pacing Schedule:
                </div>
                <span style="font-family: var(--mono); font-size: 0.75rem; color: #10b981;">Prevents Sleep-Disrupting Nocturia</span>
              </div>
              <div id="water-schedule" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.5rem; font-family: var(--mono); font-size: 0.82rem;">
                <!-- Populated dynamically -->
              </div>
            </div>

            <!-- Armstrong Clinical Urine Color Chart -->
            <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; margin-bottom: 0.5rem; color: var(--fg);">
                🔬 Clinical Urine Color Hydration Scale (Armstrong Standards):
              </div>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                Cross-verify your internal hydration status using morning first-void urine coloration:
              </p>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.4rem; font-family: var(--mono); font-size: 0.72rem; text-align: center;">
                <div style="background: #fbfbd4; color: #333; padding: 0.5rem 0.2rem; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1);">
                  <strong>Level 1</strong><br>Pale Straw<br><span style="color: #10b981; font-weight: bold;">Optimal</span>
                </div>
                <div style="background: #f7f7a8; color: #333; padding: 0.5rem 0.2rem; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1);">
                  <strong>Level 2</strong><br>Light Yellow<br><span style="color: #10b981; font-weight: bold;">Well Hydrated</span>
                </div>
                <div style="background: #f0e671; color: #333; padding: 0.5rem 0.2rem; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1);">
                  <strong>Level 3</strong><br>Bright Yellow<br><span style="color: #10b981; font-weight: bold;">Normal</span>
                </div>
                <div style="background: #e2cb3c; color: #333; padding: 0.5rem 0.2rem; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1);">
                  <strong>Level 4</strong><br>Amber Gold<br><span style="color: #f59e0b; font-weight: bold;">Mild Dehydrated</span>
                </div>
                <div style="background: #cbb126; color: #fff; padding: 0.5rem 0.2rem; border-radius: 4px;">
                  <strong>Level 5</strong><br>Dark Amber<br><span style="color: #f59e0b; font-weight: bold;">Drink 500ml</span>
                </div>
                <div style="background: #a98818; color: #fff; padding: 0.5rem 0.2rem; border-radius: 4px;">
                  <strong>Level 6</strong><br>Orange Tint<br><span style="color: #ef4444; font-weight: bold;">Dehydrated</span>
                </div>
                <div style="background: #805c10; color: #fff; padding: 0.5rem 0.2rem; border-radius: 4px;">
                  <strong>Level 7</strong><br>Brownish<br><span style="color: #ef4444; font-weight: bold;">Severe Deficit</span>
                </div>
                <div style="background: #543907; color: #fff; padding: 0.5rem 0.2rem; border-radius: 4px;">
                  <strong>Level 8</strong><br>Dark Brown<br><span style="color: #ef4444; font-weight: bold;">Critical</span>
                </div>
              </div>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopyWater" onclick="copyHydrationPlan()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Daily Hydration &amp; Electrolyte Schedule
            </button>
          </div>

          <!-- Step-by-Step Worked Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Clinical Hydration Derivation</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">National Academies of Sciences (NASEM) Standard</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Daily fluid requirements account for metabolic turnover, respiratory evaporative loss, sweat production, and environmental heat load:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 1: Baseline Metabolic Water Turnover</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">
                  Baseline Fluid = Body Weight (kg) &times; 35 ml/kg (or Weight in lbs &times; 0.53 oz/lb)
                </div>
                <div id="water-step-1" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  For 70 kg: 70 &times; 35 ml = <strong>2,450 ml (2.45 L / 83 oz)</strong>.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">Step 2: Exercise Sweat Rate Replacement</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">
                  Exercise Fluid = (Duration in Minutes / 30) &times; 350 ml &times; Sweat Intensity Multiplier
                </div>
                <div id="water-step-2" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  For 45 min moderate sweat: (45 / 30) &times; 350 &times; 1.3 = <strong>682 ml</strong>.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981;">Step 3: Environmental &amp; Life Stage Additions</strong>
                <div id="water-step-3" style="color: var(--text-muted); margin-top: 0.25rem;">
                  Climate + Life Stage = 0 ml &bull; Total Daily Beverage Target = 2,450 + 682 = <strong>3,132 ml (3.13 L / 106 oz)</strong>.
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Hydration Pitfalls -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Hydration Pitfalls &amp; Hyponatremia Risks</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Exercise-Associated Hyponatremia (EAH):</strong> Chugging excessive plain water during long workouts without replacing lost sodium dilutes serum sodium (<135 mmol/L). This causes cellular swelling, cerebral edema, seizures, and can be fatal. Always pair fluids with electrolytes during prolonged sweat sessions (>60 min).</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Evening Fluid Taper (Preventing Nocturia):</strong> Drinking large volumes of water within 2 hours of bedtime forces nighttime awakenings to urinate, fragmenting Stage 3 Slow-Wave Deep Sleep and REM cycles. Front-load 70% of your daily fluids before 4:00 PM.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The "Thirst is Too Late" Fallacy:</strong> In healthy resting individuals, thirst is an extraordinarily sensitive physiological homeostatic mechanism that triggers when blood osmolality rises by as little as 1%–2%. For everyday desk work, drinking to thirst is completely safe; proactive hydration is strictly required during athletic exertion where thirst sensations lag behind acute sweat volume.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Alcohol Dehydration Multiplier:</strong> Ethanol acts as an anti-diuretic hormone (vasopressin) inhibitor. For every 1 gram of ethanol consumed, the kidneys excrete ~10 ml of extra urine. A standard alcoholic beverage (14g alcohol) causes ~140 ml of net water loss, requiring a 1:1 water backfill to prevent dehydration hangovers.</li>
            </ul>
          </div>
        </div>

        <script>
          var waterUnitMode = 'metric';

          window.setWaterUnit = function(mode) {
            waterUnitMode = mode;
            var btnM = document.getElementById('btnWaterMetric');
            var btnI = document.getElementById('btnWaterImperial');
            var lblW = document.getElementById('lblWaterWeight');
            var inpW = document.getElementById('water-weight');

            if (mode === 'metric') {
              btnM.style.background = 'rgba(59, 130, 246, 0.1)';
              btnM.style.borderColor = '#3b82f6';
              btnM.style.color = '#3b82f6';
              btnI.style.background = 'var(--surface-alt)';
              btnI.style.borderColor = 'var(--border)';
              btnI.style.color = 'var(--fg)';
              lblW.textContent = 'Body Weight (kg)';
              inpW.value = Math.round(parseFloat(inpW.value) / 2.20462) || 70;
            } else {
              btnI.style.background = 'rgba(59, 130, 246, 0.1)';
              btnI.style.borderColor = '#3b82f6';
              btnI.style.color = '#3b82f6';
              btnM.style.background = 'var(--surface-alt)';
              btnM.style.borderColor = 'var(--border)';
              btnM.style.color = 'var(--fg)';
              lblW.textContent = 'Body Weight (lbs)';
              inpW.value = Math.round(parseFloat(inpW.value) * 2.20462) || 154;
            }
            calcWater();
          };

          function calcWater() {
            var rawWeight = parseFloat(document.getElementById('water-weight').value) || (waterUnitMode === 'metric' ? 70 : 154);
            var exerciseMin = parseFloat(document.getElementById('water-exercise').value) || 0;
            var intensityMult = parseFloat(document.getElementById('water-intensity').value) || 1.3;
            var climateAdd = parseFloat(document.getElementById('water-climate').value) || 0;
            var stageAdd = parseFloat(document.getElementById('water-stage').value) || 0;

            var weightKg = waterUnitMode === 'metric' ? rawWeight : (rawWeight / 2.20462);

            // 1. Baseline: 35 ml per kg
            var baselineMl = weightKg * 35;

            // 2. Exercise sweat: (mins / 30) * 350ml * intensity
            var exerciseMl = (exerciseMin / 30) * 350 * intensityMult;

            // 3. Environmental + Stage
            var totalMl = Math.round(baselineMl + exerciseMl + climateAdd + stageAdd);
            var totalLiters = (totalMl / 1000).toFixed(2);
            var totalFlOz = Math.round(totalMl * 0.033814);
            var totalGlasses = (totalMl / 240).toFixed(1);
            var totalBottles = (totalMl / 500).toFixed(1);

            // Update UI Hero
            if (waterUnitMode === 'metric') {
              document.getElementById('water-primary').textContent = totalLiters + ' Liters (' + totalMl.toLocaleString('en-US') + ' ml)';
              document.getElementById('water-secondary').textContent = totalFlOz + ' Fl. Oz • ~' + totalGlasses + ' glasses (240 ml)';
            } else {
              document.getElementById('water-primary').textContent = totalFlOz + ' Fl. Oz';
              document.getElementById('water-secondary').textContent = totalLiters + ' Liters • ~' + totalGlasses + ' glasses (8 oz)';
            }

            document.getElementById('water-glasses').textContent = totalGlasses + ' Glasses';
            document.getElementById('water-bottles').textContent = totalBottles + ' Bottles';

            // Electrolyte guidance
            var electroEl = document.getElementById('water-electrolyte-note');
            if (exerciseMin >= 60 || climateAdd >= 500 || intensityMult >= 1.8) {
              electroEl.innerHTML = '<span style="color: #f59e0b; font-weight: bold;">⚡ CRITICAL ELECTROLYTE WINDOW:</span> With ' + exerciseMin + ' mins of workout sweat/heat loading, you will lose ~' + Math.round((exerciseMl / 1000) * 900) + '–' + Math.round((exerciseMl / 1000) * 1400) + ' mg of sodium. Drink fluids with <strong>500–800 mg sodium + 200 mg potassium per liter</strong> to maintain blood volume and muscle contractility.';
              electroEl.style.borderColor = '#f59e0b';
            } else {
              electroEl.innerHTML = '⚡ <strong>Electrolyte Recommendation:</strong> For low-to-moderate daily activity (<60 mins), standard dietary sodium from balanced whole meals provides sufficient electrolyte replacement.';
              electroEl.style.borderColor = 'rgba(59, 130, 246, 0.2)';
            }

            // Paced Hourly Schedule Table
            var schedEl = document.getElementById('water-schedule');
            var morningMl = Math.round(totalMl * 0.20);
            var midMorningMl = Math.round(totalMl * 0.20);
            var afternoonMl = Math.round(totalMl * 0.25);
            var workoutMl = Math.round(exerciseMl > 0 ? exerciseMl : totalMl * 0.15);
            var eveningMl = Math.round(totalMl * 0.15);
            var taperMl = Math.max(100, totalMl - morningMl - midMorningMl - afternoonMl - workoutMl - eveningMl);

            function formatVol(ml) {
              if (waterUnitMode === 'metric') return ml + ' ml';
              return Math.round(ml * 0.033814) + ' oz';
            }

            var schedHtml = [
              '<div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);"><span style="color: #3b82f6; font-weight: bold;">7:00 AM (Wake-Up)</span><div style="color: var(--fg); font-weight: bold; margin-top: 0.2rem;">' + formatVol(morningMl) + '</div><div style="font-size: 0.7rem; color: var(--text-muted);">Rehydrate overnight losses</div></div>',
              '<div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);"><span style="color: #3b82f6; font-weight: bold;">9:00 AM – 11:30 AM</span><div style="color: var(--fg); font-weight: bold; margin-top: 0.2rem;">' + formatVol(midMorningMl) + '</div><div style="font-size: 0.7rem; color: var(--text-muted);">Mid-morning work pacing</div></div>',
              '<div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);"><span style="color: #10b981; font-weight: bold;">12:00 PM – 2:30 PM</span><div style="color: var(--fg); font-weight: bold; margin-top: 0.2rem;">' + formatVol(afternoonMl) + '</div><div style="font-size: 0.7rem; color: var(--text-muted);">With lunch & post-meal</div></div>',
              '<div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border); border-color: #f59e0b;"><span style="color: #f59e0b; font-weight: bold;">Workout Window</span><div style="color: var(--fg); font-weight: bold; margin-top: 0.2rem;">' + formatVol(workoutMl) + '</div><div style="font-size: 0.7rem; color: var(--text-muted);">Pre/Intra/Post sweat replacement</div></div>',
              '<div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);"><span style="color: #8b5cf6; font-weight: bold;">5:00 PM – 7:30 PM</span><div style="color: var(--fg); font-weight: bold; margin-top: 0.2rem;">' + formatVol(eveningMl) + '</div><div style="font-size: 0.7rem; color: var(--text-muted);">Dinner fluid replenishment</div></div>',
              '<div style="background: var(--surface-alt); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--border);"><span style="color: var(--text-muted); font-weight: bold;">8:30 PM – Bed (Taper)</span><div style="color: var(--fg); font-weight: bold; margin-top: 0.2rem;">' + formatVol(taperMl) + '</div><div style="font-size: 0.7rem; color: #10b981;">Taper to prevent nocturia</div></div>'
            ].join('');

            schedEl.innerHTML = schedHtml;

            // Step worked derivations
            document.getElementById('water-step-1').innerHTML = 'For ' + weightKg.toFixed(1) + ' kg: ' + weightKg.toFixed(1) + ' &times; 35 ml = <strong>' + Math.round(baselineMl) + ' ml (' + (baselineMl / 1000).toFixed(2) + ' L / ' + Math.round(baselineMl * 0.033814) + ' oz)</strong>.';
            document.getElementById('water-step-2').innerHTML = 'For ' + exerciseMin + ' min at ' + intensityMult + 'x intensity: (' + exerciseMin + ' / 30) &times; 350 &times; ' + intensityMult + ' = <strong>' + Math.round(exerciseMl) + ' ml</strong>.';
            document.getElementById('water-step-3').innerHTML = 'Climate (' + climateAdd + ' ml) + Stage (' + stageAdd + ' ml) = ' + (climateAdd + stageAdd) + ' ml &bull; Total Target: ' + Math.round(baselineMl) + ' + ' + Math.round(exerciseMl) + ' + ' + (climateAdd + stageAdd) + ' = <strong>' + totalLiters + ' Liters (' + totalFlOz + ' oz)</strong>.';
          }

          window.copyHydrationPlan = function() {
            var primary = document.getElementById('water-primary').textContent;
            var glasses = document.getElementById('water-glasses').textContent;
            var bottles = document.getElementById('water-bottles').textContent;
            var note = document.getElementById('water-electrolyte-note').innerText;

            var text = [
              '=== DAILY HYDRATION & PACING PROTOCOL ===',
              'Total Daily Fluid Target: ' + primary,
              'Volume in 8-oz Glasses: ' + glasses,
              'Volume in 500ml Bottles: ' + bottles,
              '---------------------------------------',
              'Clinical Guidance: ' + note,
              '---------------------------------------',
              'Standard: NASEM Dietary Reference Intakes (DRI) for Water',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/health/water-intake'
            ].join('\n');

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyWater');
              if (btn) {
                var old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Hydration Protocol!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() { calcWater(); });
          calcWater();
        </script>
      `
    },
    {
      slug: 'sleep-calculator',
      title: 'Sleep Cycle & Wake-Up Calculator (90-Minute REM & NASA Nap Architecture)',
      metaDesc: 'Calculate optimal bedtimes and wake-up times based on 90-minute REM ultradian cycles. Avoid sleep inertia, optimize circadian rhythm, and wake up refreshed.',
      category: 'Health & Sleep',
      faq: [
        { q: 'Why is waking up at the end of a 90-minute sleep cycle so important?', a: 'Human nocturnal sleep consists of 90- to 110-minute ultradian cycles oscillating through Light Sleep (N1, N2), Slow-Wave Deep Sleep (N3), and Rapid Eye Movement (REM). Waking up during Stage 3 Slow-Wave Deep Sleep causes severe sleep inertia—a prolonged period of grogginess, prefrontal cortex hypoperfusion, and impaired cognitive reaction time. Waking at the end of a cycle during light Stage 1 or REM allows you to feel alert almost immediately.' },
        { q: 'What is sleep latency and why does the calculator include a buffer?', a: 'Sleep latency is the time it takes to transition from full wakefulness to clinical sleep onset. According to Stanford Sleep Medicine, the average healthy adult takes 14 to 20 minutes to fall asleep. If an alarm does not account for this latency buffer, you will wake up 15 minutes prematurely—directly in the middle of restorative deep slow-wave sleep.' },
        { q: 'What is the NASA Astronaut Nap protocol?', a: 'In a landmark study conducted by the NASA Ames Research Center Fatigue Countermeasures Program, researchers evaluated commercial airline pilots and astronauts taking planned cockpit naps. The study found that a 26-minute nap improved cognitive performance by 34% and psychological alertness by 54% without inducing deep sleep inertia.' },
        { q: 'How many sleep cycles should an adult aim for per night?', a: 'Clinical sleep guidelines recommend 5 complete cycles (7.5 hours of actual sleep) to 6 complete cycles (9.0 hours) for optimal endocrine regulation, cellular tissue repair, glymphatic brain clearance, and memory consolidation. 4 cycles (6.0 hours) provides functional survival baseline, while consistently sleeping 3 cycles or fewer (< 4.5 hours) accumulates dangerous cumulative sleep debt.' },
        { q: 'What is the Circadian Temperature Minimum (Tmin) and how does it affect wakefulness?', a: 'The Circadian Temperature Minimum (Tmin) is the point in your 24-hour biological cycle when core body temperature drops to its lowest level, typically occurring approximately 1.5 to 2 hours before habitual wake time. Waking up prior to Tmin feels extraordinarily difficult, while exposure to natural bright morning sunlight immediately after Tmin triggers the Cortisol Awakening Response (CAR) and anchors your circadian clock.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health &amp; Fitness</a> &gt; Sleep Cycle Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Sleep Cycle &amp; Wake-Up Architecture Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Calculate optimal bedtimes and wake times aligned with 90-minute ultradian sleep cycles. Incorporates clinical sleep onset latency, NASA astronaut nap protocols, and circadian biology to eliminate sleep inertia.
          </p>

          <div class="tool-box">
            <!-- Mode Toggle Tabs -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              <button type="button" id="btnSleepWake" onclick="setSleepCalcMode('targetWake')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid #3b82f6; background: rgba(59, 130, 246, 0.15); color: #3b82f6; cursor: pointer; font-weight: 600;">I Need to Wake Up At...</button>
              <button type="button" id="btnSleepNow" onclick="setSleepCalcMode('sleepNow')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--border); background: var(--surface-alt); color: var(--fg); cursor: pointer;">If I Sleep Right Now...</button>
              <button type="button" id="btnSleepNap" onclick="setSleepCalcMode('powerNap')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--border); background: var(--surface-alt); color: var(--fg); cursor: pointer;">NASA &amp; Power Naps</button>
            </div>

            <!-- Primary Inputs Grid -->
            <div class="grid-inputs">
              <!-- Wake-up Time Picker (Target Wake Mode) -->
              <div class="field-group" id="grp-wake-time">
                <label class="field-label">Desired Wake-Up Time</label>
                <div style="display: flex; gap: 0.5rem;">
                  <input type="time" id="sleep-wake-time" class="code-input" value="07:00" oninput="calcSleepCycles()" style="font-size: 1.25rem;" />
                </div>
              </div>

              <!-- Sleep Latency (Fall Asleep Buffer) -->
              <div class="field-group">
                <label class="field-label">Time to Fall Asleep (Sleep Latency): <span id="sleep-latency-label" style="color: #3b82f6; font-weight: bold;">15 min</span></label>
                <input type="range" id="sleep-latency" min="5" max="45" value="15" step="5" oninput="updateLatency(this.value)" style="width: 100%; cursor: pointer;" />
                <span style="font-size: 0.72rem; color: var(--text-muted);">Stanford average: 15 min (healthy: 10–20 min)</span>
              </div>
            </div>

            <!-- Standard Cycle Results Cards -->
            <div id="sleep-results-container" style="margin-top: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <h3 id="sleep-results-title" style="font-family: var(--serif); font-size: 1.15rem; margin: 0; color: var(--fg);">
                  Recommended Bedtimes to Wake Up at 7:00 AM:
                </h3>
                <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">90-min Ultradian Cycles + 15 min Buffer</span>
              </div>

              <div id="sleep-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem;">
                <!-- Populated dynamically -->
              </div>
            </div>

            <!-- NASA & Power Nap Protocol Cards (Visible in Power Nap Mode) -->
            <div id="sleep-nap-container" style="display: none; margin-top: 1.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">
                🚀 Evidence-Based Daytime Nap Protocols:
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
                <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #10b981; padding: 1.25rem; border-radius: 6px;">
                  <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">20-Minute Power Nap</div>
                  <div id="nap-time-20" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">Wake at --:--</div>
                  <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
                    Light NREM Stage 2 sleep only. Clears accumulated daytime adenosine without entering slow-wave sleep. Zero grogginess or sleep inertia.
                  </div>
                </div>

                <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #3b82f6; padding: 1.25rem; border-radius: 6px;">
                  <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">26-Minute NASA Astronaut Nap</div>
                  <div id="nap-time-26" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">Wake at --:--</div>
                  <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
                    NASA Ames Research standard: boosts cognitive performance by +34% and alertness by +54%. Perfect mid-afternoon recharge window.
                  </div>
                </div>

                <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #8b5cf6; padding: 1.25rem; border-radius: 6px;">
                  <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">90-Minute Full Cycle Nap</div>
                  <div id="nap-time-90" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #8b5cf6; margin: 0.25rem 0;">Wake at --:--</div>
                  <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
                    One complete ultradian cycle containing slow-wave deep sleep and REM. Synthesizes motor memory, repairs tissue, and wakes cleanly during REM.
                  </div>
                </div>
              </div>
            </div>

            <!-- Circadian Biology Timeline Schedule -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <h4 style="font-family: var(--serif); font-size: 1.05rem; margin: 0; color: var(--fg);">
                  ⏰ Biological 24-Hour Circadian Milestones (Based on Your Schedule):
                </h4>
                <span id="circadian-wake-label" style="font-family: var(--mono); font-size: 0.75rem; color: #3b82f6;">Wake: 7:00 AM</span>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.82rem;">
                <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: #f59e0b; font-weight: bold;">Cortisol Awakening (CAR)</div>
                  <div id="circ-car" style="font-size: 1.1rem; color: var(--fg); margin: 0.2rem 0;">7:30 AM – 8:00 AM</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">Get outdoor morning sunlight to anchor master SCN clock.</div>
                </div>

                <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: #ec4899; font-weight: bold;">Peak Reaction &amp; Cognition</div>
                  <div id="circ-peak" style="font-size: 1.1rem; color: var(--fg); margin: 0.2rem 0;">10:00 AM – 1:00 PM</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">High prefrontal dopamine &amp; acetylcholine synthesis.</div>
                </div>

                <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: #8b5cf6; font-weight: bold;">Dim Light Melatonin Onset</div>
                  <div id="circ-dlmo" style="font-size: 1.1rem; color: var(--fg); margin: 0.2rem 0;">9:30 PM</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">Pineal gland secretes melatonin. Dim overhead screens.</div>
                </div>

                <div style="background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="color: #3b82f6; font-weight: bold;">Body Temp Minimum (Tmin)</div>
                  <div id="circ-tmin" style="font-size: 1.1rem; color: var(--fg); margin: 0.2rem 0;">5:00 AM</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">Core temperature nadir (~2h prior to awakening).</div>
                </div>
              </div>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopySleep" onclick="copySleepSchedule()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Personalized Sleep &amp; Circadian Schedule
            </button>
          </div>

          <!-- Step-by-Step Sleep Architecture Breakdown -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #8b5cf6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">🧠 The 4 Physiological Stages of a 90-Minute Sleep Cycle</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #8b5cf6; background: rgba(139, 92, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">AASM Polysomnography Standard</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Throughout the night, the brain oscillates through non-REM (NREM) and rapid eye movement (REM) stages in repeated 90- to 110-minute ultradian cycles:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #3b82f6;">Stage N1 (Light Sleep &amp; Hypnic Transition &bull; ~5% of Night)</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.8rem;">
                  Brain waves decelerate from waking beta/alpha (8–12 Hz) to theta (4–7 Hz). Muscle tone relaxes; hypnic jerks (involuntary myoclonic twitches) frequently occur during this transitional phase.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981;">Stage N2 (True Light Sleep &amp; Motor Memory Consolidation &bull; ~50% of Night)</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.8rem;">
                  Marked by sleep spindles (11–16 Hz bursts) and K-complexes on EEG. Heart rate and core body temperature drop. Essential for synaptic pruning and procedural motor memory consolidation.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #f59e0b;">Stage N3 (Slow-Wave Deep Sleep &amp; Glymphatic Clearance &bull; ~20% of Night)</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.8rem;">
                  High-amplitude delta waves (&lt;4 Hz). Pituitary gland releases 70%+ of daily human growth hormone (HGH) for tissue repair. The brain\'s glymphatic system opens interstitial channels to flush beta-amyloid and tau proteins.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #ec4899;">REM Sleep (Paradoxical Dreaming &amp; Emotional Equilibrium &bull; ~25% of Night)</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.8rem;">
                  Rapid low-voltage EEG similar to wakefulness. Complete postural muscle atonia (paralysis) prevents acting out dreams. Critical for emotional processing, creative insight synthesis, and mood equilibrium.
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Sleep Traps & Circadian Pitfalls -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Sleep Traps &amp; Circadian Pitfalls</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Sleep Inertia Paradox (Why 8 Hours Can Feel Worse Than 7.5):</strong> If your alarm jolts you out of Stage N3 Slow-Wave Deep Sleep, prefrontal cortex hypoperfusion persists for 30 to 60 minutes, causing intense grogginess, slowed reaction times, and brain fog. Waking at 7.5 hours (at the conclusion of cycle 5 during light Stage 1/REM) often feels dramatically more alert than waking at 8.0 hours.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Weekend Social Jetlag Trap:</strong> Staying up 3 hours later on Friday and sleeping in Saturday shifts your peripheral circadian clock genes (CLOCK, BMAL1). When you try to sleep early on Sunday, your core temperature hasn\'t dropped and pineal melatonin has not secreted, resulting in debilitating "Sunday Night Insomnia".</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Instant Sleep Fallacy:</strong> Falling asleep within 2–3 minutes of your head hitting the pillow is not a sign of great sleep health—it is a recognized clinical indicator of <strong>severe chronic sleep deprivation</strong> (excess adenosine buildup). Healthy sleep latency is 10 to 20 minutes.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Caffeine Clearance Half-Life Drag:</strong> With an average metabolic half-life of 5.7 hours, 200mg of caffeine consumed at 4 PM leaves ~50mg still circulating at 2 AM, actively blocking adenosine A1/A2A receptors and cutting deep Stage 3 slow-wave sleep by up to 30% even if you fall asleep.</li>
            </ul>
          </div>
        </div>

        <script>
          let currentSleepMode = 'targetWake';

          window.setSleepCalcMode = function(mode) {
            currentSleepMode = mode;
            const btnW = document.getElementById('btnSleepWake');
            const btnN = document.getElementById('btnSleepNow');
            const btnNap = document.getElementById('btnSleepNap');
            const grpWake = document.getElementById('grp-wake-time');
            const resContainer = document.getElementById('sleep-results-container');
            const napContainer = document.getElementById('sleep-nap-container');
            const titleEl = document.getElementById('sleep-results-title');

            // Reset buttons
            [btnW, btnN, btnNap].forEach(function(b) {
              b.style.background = 'var(--surface-alt)';
              b.style.borderColor = 'var(--border)';
              b.style.color = 'var(--fg)';
            });

            if (mode === 'targetWake') {
              btnW.style.background = 'rgba(59, 130, 246, 0.15)';
              btnW.style.borderColor = '#3b82f6';
              btnW.style.color = '#3b82f6';
              grpWake.style.display = 'block';
              resContainer.style.display = 'block';
              napContainer.style.display = 'none';
              titleEl.textContent = 'Recommended Bedtimes to Wake Up Refreshed:';
            } else if (mode === 'sleepNow') {
              btnN.style.background = 'rgba(59, 130, 246, 0.15)';
              btnN.style.borderColor = '#3b82f6';
              btnN.style.color = '#3b82f6';
              grpWake.style.display = 'none';
              resContainer.style.display = 'block';
              napContainer.style.display = 'none';
              titleEl.textContent = 'Optimal Times to Wake Up If You Sleep Right Now:';
            } else {
              btnNap.style.background = 'rgba(59, 130, 246, 0.15)';
              btnNap.style.borderColor = '#3b82f6';
              btnNap.style.color = '#3b82f6';
              grpWake.style.display = 'none';
              resContainer.style.display = 'none';
              napContainer.style.display = 'block';
            }
            calcSleepCycles();
          };

          window.updateLatency = function(val) {
            document.getElementById('sleep-latency-label').textContent = val + ' min';
            calcSleepCycles();
          };

          function formatTimeString(date) {
            let h = date.getHours();
            const m = date.getMinutes().toString().padStart(2, '0');
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            return h + ':' + m + ' ' + ampm;
          }

          function calcSleepCycles() {
            const latency = parseInt(document.getElementById('sleep-latency').value, 10) || 15;
            const now = new Date();

            if (currentSleepMode === 'powerNap') {
              // Update Nap Wake Times
              const t20 = new Date(now.getTime() + (20 + latency) * 60000);
              const t26 = new Date(now.getTime() + (26 + latency) * 60000);
              const t90 = new Date(now.getTime() + (90 + latency) * 60000);

              document.getElementById('nap-time-20').textContent = 'Wake at ' + formatTimeString(t20);
              document.getElementById('nap-time-26').textContent = 'Wake at ' + formatTimeString(t26);
              document.getElementById('nap-time-90').textContent = 'Wake at ' + formatTimeString(t90);
              return;
            }

            const cardsGrid = document.getElementById('sleep-cards-grid');
            cardsGrid.innerHTML = '';

            let targetWakeDate = new Date();
            const wakeVal = document.getElementById('sleep-wake-time').value || '07:00';
            const [wH, wM] = wakeVal.split(':').map(Number);
            targetWakeDate.setHours(wH, wM, 0, 0);

            // If wake time is earlier than current time today, assume tomorrow
            if (targetWakeDate < now) {
              targetWakeDate = new Date(targetWakeDate.getTime() + 24 * 60 * 60000);
            }

            const cycles = [
              { count: 6, hours: 9.0, label: 'Optimal (6 Cycles)', color: '#10b981', note: 'Full restorative recovery' },
              { count: 5, hours: 7.5, label: 'Recommended (5 Cycles)', color: '#3b82f6', note: 'Standard adult sweet spot' },
              { count: 4, hours: 6.0, label: 'Functional (4 Cycles)', color: '#f59e0b', note: 'Minimum acceptable baseline' },
              { count: 3, hours: 4.5, label: 'Survival (3 Cycles)', color: '#ef4444', note: 'Accumulates sleep debt' }
            ];

            let recommendedBedtimeDate = null;

            if (currentSleepMode === 'targetWake') {
              document.getElementById('sleep-results-title').textContent = 'Recommended Bedtimes to Wake Up at ' + formatTimeString(targetWakeDate) + ':';

              cycles.forEach(function(c, idx) {
                const sleepMinutes = (c.count * 90) + latency;
                const bedtime = new Date(targetWakeDate.getTime() - (sleepMinutes * 60000));
                if (idx === 1) recommendedBedtimeDate = bedtime; // 5 cycles

                const card = document.createElement('div');
                card.style.background = 'var(--surface-alt)';
                card.style.border = '1px solid var(--border)';
                card.style.borderTop = '4px solid ' + c.color;
                card.style.padding = '1.25rem';
                card.style.borderRadius = '6px';
                card.style.textAlign = 'center';

                card.innerHTML = 
                  '<div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">' + c.label + '</div>' +
                  '<div style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: ' + c.color + '; margin: 0.25rem 0;">' + formatTimeString(bedtime) + '</div>' +
                  '<div style="font-size: 0.8rem; color: var(--fg); font-weight: 600;">' + c.hours + ' hrs sleep</div>' +
                  '<div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem;">' + c.note + '</div>';

                cardsGrid.appendChild(card);
              });
            } else {
              // Sleep Now Mode
              document.getElementById('sleep-results-title').textContent = 'Optimal Wake Times If You Fall Asleep at ' + formatTimeString(now) + ':';

              cycles.forEach(function(c, idx) {
                const sleepMinutes = (c.count * 90) + latency;
                const waketime = new Date(now.getTime() + (sleepMinutes * 60000));
                if (idx === 1) targetWakeDate = waketime;

                const card = document.createElement('div');
                card.style.background = 'var(--surface-alt)';
                card.style.border = '1px solid var(--border)';
                card.style.borderTop = '4px solid ' + c.color;
                card.style.padding = '1.25rem';
                card.style.borderRadius = '6px';
                card.style.textAlign = 'center';

                card.innerHTML = 
                  '<div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">' + c.label + '</div>' +
                  '<div style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: ' + c.color + '; margin: 0.25rem 0;">' + formatTimeString(waketime) + '</div>' +
                  '<div style="font-size: 0.8rem; color: var(--fg); font-weight: 600;">' + c.hours + ' hrs sleep</div>' +
                  '<div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem;">' + c.note + '</div>';

                cardsGrid.appendChild(card);
              });
            }

            // Update Circadian Milestones
            const baseWake = currentSleepMode === 'targetWake' ? targetWakeDate : new Date(now.getTime() + (7.5 * 60 + latency) * 60000);
            document.getElementById('circadian-wake-label').textContent = 'Target Wake: ' + formatTimeString(baseWake);

            const carStart = new Date(baseWake.getTime() + 30 * 60000);
            const carEnd = new Date(baseWake.getTime() + 60 * 60000);
            document.getElementById('circ-car').textContent = formatTimeString(carStart) + ' – ' + formatTimeString(carEnd);

            const peakStart = new Date(baseWake.getTime() + 3 * 3600000);
            const peakEnd = new Date(baseWake.getTime() + 6 * 3600000);
            document.getElementById('circ-peak').textContent = formatTimeString(peakStart) + ' – ' + formatTimeString(peakEnd);

            const dlmo = new Date(baseWake.getTime() + 14.5 * 3600000);
            document.getElementById('circ-dlmo').textContent = formatTimeString(dlmo);

            const tmin = new Date(baseWake.getTime() - 2 * 3600000);
            document.getElementById('circ-tmin').textContent = formatTimeString(tmin);
          }

          window.copySleepSchedule = function() {
            const wakeVal = document.getElementById('sleep-wake-time').value || '07:00';
            const latency = document.getElementById('sleep-latency').value;
            const title = document.getElementById('sleep-results-title').textContent;

            const cards = document.querySelectorAll('#sleep-cards-grid > div');
            const cardTexts = [];
            cards.forEach(function(c) {
              const lines = c.innerText.split('\n').filter(Boolean);
              cardTexts.push(lines.join(' | '));
            });

            const text = [
              '=== CLINICAL SLEEP & CIRCADIAN SCHEDULE ===',
              'Mode: ' + title,
              'Sleep Latency Buffer: ' + latency + ' minutes',
              '------------------------------------------',
              cardTexts.join('\n'),
              '------------------------------------------',
              'Standards: American Academy of Sleep Medicine (AASM) & NASA Ames Protocol',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/health/sleep-calculator'
            ].join('\n');

            navigator.clipboard.writeText(text).then(function() {
              const btn = document.getElementById('btnCopySleep');
              if (btn) {
                const old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Sleep Schedule!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() { calcSleepCycles(); });
          calcSleepCycles();
        </script>
      `
    },
    {
      slug: 'body-fat-calculator',
      title: 'US Navy Body Fat Calculator (Circumference Method & DoD Standards)',
      metaDesc: 'Calculate body fat percentage, lean body mass, fat mass, and military readiness using the official US Navy tape method (DoD 1308.3 standard) with metric & imperial units.',
      category: 'Health & Fitness',
      faq: [
        { q: 'How accurate is the US Navy circumference body fat method?', a: 'The US Navy body fat formula (developed by Hodgdon and Beckett at the Naval Health Research Center in 1984) has an empirical standard error of estimate (SEE) of approximately ±3.0% to 3.5% when compared to hydrostatic underwater weighing and 4-compartment DEXA scans. It provides reliable tracking for active individuals without requiring expensive clinical equipment.' },
        { q: 'What are the official Department of Defense (DoD) maximum body fat limits?', a: 'Under DoD Directive 1308.3 and military branch regulations (Army AR 600-9, Navy OPNAVINST 6110.1J, Air Force DAFMAN 36-2905), maximum allowable body fat percentages scale by age. For males: Age 17–20: 20–22%, Age 21–27: 22–24%, Age 28–39: 24–26%, Age 40+: 26%. For females: Age 17–20: 28–33%, Age 21–27: 30–34%, Age 28–39: 32–35%, Age 40+: 34–36% depending on specific branch service criteria.' },
        { q: 'Where exactly should tape measurements be taken for the Navy tape test?', a: 'For men: Height (barefoot), Neck (horizontally just below the larynx/Adam\'s apple), and Waist (horizontally at the navel at the end of normal passive exhalation). For women: Height, Neck (below larynx), Waist (at the narrowest point between ribs and iliac crest), and Hips (at the widest protrusion of the buttocks viewed from the side). Tape must be level and taut against skin without indenting soft tissue.' },
        { q: 'What is the absolute physiological essential fat floor?', a: 'Essential body fat is non-negotiable lipid mass required for brain function, cell membrane fluidity, steroid hormone production, and organ cushioning. The physiological minimum essential fat level is 2% to 5% for men and 10% to 13% for women. Dropping below these thresholds induces severe endocrine disruption, hypogonadism, amenorrhea, and cardiac arrhythmias.' },
        { q: 'How do I calculate how much fat I need to lose to reach my target body fat percentage?', a: 'Calculate your current Lean Body Mass: LBM = Weight × (1 - (Current BF% / 100)). Then calculate your Goal Body Weight: Goal Weight = LBM / (1 - (Target BF% / 100)). The difference between your current weight and goal weight represents the exact pounds or kilograms of pure adipose fat you must lose while preserving muscle.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health &amp; Fitness</a> &gt; Body Fat Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">US Navy Body Fat &amp; DoD Readiness Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Determine your exact body fat percentage, lean tissue mass, fat mass, and official military tape test pass/fail status using the US Navy Circumference Method (DoD Directive 1308.3).
          </p>

          <div class="tool-box">
            <!-- Unit & Sex Controls -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem;">
              <div style="display: flex; gap: 0.5rem;">
                <button type="button" id="btnBFMetric" onclick="setBFUnit('metric')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid #3b82f6; background: rgba(59, 130, 246, 0.15); color: #3b82f6; cursor: pointer; font-weight: 600;">Metric (cm / kg)</button>
                <button type="button" id="btnBFImperial" onclick="setBFUnit('imperial')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--border); background: var(--surface-alt); color: var(--fg); cursor: pointer;">Imperial (inches / lbs)</button>
              </div>

              <!-- Sex Radio Buttons -->
              <div style="display: flex; gap: 1rem; align-items: center; font-family: var(--mono); font-size: 0.9rem;">
                <label style="display: flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                  <input type="radio" name="bf-gender" value="male" checked onchange="toggleBFGender()" /> <strong>Male</strong>
                </label>
                <label style="display: flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                  <input type="radio" name="bf-gender" value="female" onchange="toggleBFGender()" /> <strong>Female</strong>
                </label>
              </div>
            </div>

            <!-- Primary Inputs Grid -->
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label" id="lblBFHeight">Height (cm)</label>
                <input type="number" id="bf-height" class="code-input" value="178" min="100" max="250" step="0.5" oninput="calcBF()" style="font-size: 1.15rem;" />
              </div>
              <div class="field-group">
                <label class="field-label" id="lblBFWeight">Weight (kg)</label>
                <input type="number" id="bf-weight" class="code-input" value="80" min="30" max="300" step="0.5" oninput="calcBF()" style="font-size: 1.15rem;" />
              </div>
              <div class="field-group">
                <label class="field-label" id="lblBFNeck">Neck Circumference (cm)</label>
                <input type="number" id="bf-neck" class="code-input" value="38" min="20" max="70" step="0.5" oninput="calcBF()" style="font-size: 1.15rem;" />
                <span style="font-size: 0.72rem; color: var(--text-muted);">Horizontally below Adam's apple</span>
              </div>
              <div class="field-group">
                <label class="field-label" id="lblBFWaist">Waist Circumference (cm)</label>
                <input type="number" id="bf-waist" class="code-input" value="86" min="40" max="180" step="0.5" oninput="calcBF()" style="font-size: 1.15rem;" />
                <span style="font-size: 0.72rem; color: var(--text-muted);" id="noteBFWaist">Men: at navel level (relaxed exhale)</span>
              </div>
              <div class="field-group" id="bf-hip-group" style="display: none;">
                <label class="field-label" id="lblBFHip">Hip Circumference (cm)</label>
                <input type="number" id="bf-hip" class="code-input" value="98" min="50" max="200" step="0.5" oninput="calcBF()" style="font-size: 1.15rem;" />
                <span style="font-size: 0.72rem; color: var(--text-muted);">Women: at widest buttocks point</span>
              </div>
              <div class="field-group">
                <label class="field-label">Age Bracket (DoD Standards)</label>
                <select id="bf-age" class="code-input" onchange="calcBF()" style="font-size: 0.95rem;">
                  <option value="17-20">Age 17 – 20 Years</option>
                  <option value="21-27" selected>Age 21 – 27 Years</option>
                  <option value="28-39">Age 28 – 39 Years</option>
                  <option value="40+">Age 40+ Years</option>
                </select>
              </div>
            </div>

            <!-- Hero Output Results Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Estimated Body Fat</div>
                <div id="bf-pct" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">16.8%</div>
                <div id="bf-category" style="font-size: 0.88rem; font-weight: bold; color: #10b981; font-family: var(--mono);">Fitness Level</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Fat Mass vs. Lean Mass</div>
                <div id="bf-fat-mass-hero" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #ef4444; margin: 0.25rem 0;">13.4 kg Fat</div>
                <div id="bf-lean-mass-sub" style="font-size: 0.82rem; color: #3b82f6; font-family: var(--mono); font-weight: bold;">66.6 kg Lean Tissue (LBM)</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Military Readiness (DoD 1308.3)</div>
                <div id="bf-dod-status" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">PASSED ✓</div>
                <div id="bf-dod-sub" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">5.2% below age 21-27 limit (22%)</div>
              </div>
            </div>

            <!-- Visual Body Fat Spectrum Bar -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">
                <span>American Council on Exercise (ACE) Body Fat Spectrum:</span>
                <span id="bf-spectrum-label" style="color: var(--fg); font-weight: bold;">16.8% (Fitness Category)</span>
              </div>

              <!-- Multi-Segment Spectrum Bar -->
              <div style="position: relative; width: 100%; height: 28px; border-radius: 4px; overflow: hidden; display: flex; font-family: var(--mono); font-size: 0.7rem; font-weight: bold; color: #fff; text-align: center; line-height: 28px;">
                <div id="bf-seg-essential" style="width: 15%; background: #3b82f6;" title="Essential Fat">Essential</div>
                <div id="bf-seg-athletes" style="width: 25%; background: #10b981;" title="Athletes">Athletes</div>
                <div id="bf-seg-fitness" style="width: 20%; background: #059669;" title="Fitness">Fitness</div>
                <div id="bf-seg-average" style="width: 20%; background: #f59e0b;" title="Average">Average</div>
                <div id="bf-seg-obese" style="width: 20%; background: #ef4444;" title="Obese">Obese</div>
              </div>

              <!-- Needle / Pointer Position Marker -->
              <div style="position: relative; width: 100%; height: 16px; margin-top: 4px;">
                <div id="bf-needle" style="position: absolute; top: 0; left: 45%; transform: translateX(-50%); width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-bottom: 10px solid var(--fg); transition: left 0.3s ease;"></div>
              </div>

              <!-- Body Fat Reference Legend -->
              <div id="bf-legend-text" style="margin-top: 0.5rem; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                <span>Essential: 2-5% (M) / 10-13% (F)</span>
                <span>Athletes: 6-13% (M) / 14-20% (F)</span>
                <span>Fitness: 14-17% (M) / 21-24% (F)</span>
                <span>Average: 18-24% (M) / 25-31% (F)</span>
                <span>Obese: ≥25% (M) / ≥32% (F)</span>
              </div>
            </div>

            <!-- Target Body Fat Goal & Fat Loss Simulator -->
            <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #8b5cf6; border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                <h4 style="font-family: var(--serif); font-size: 1.05rem; margin: 0; color: var(--fg);">
                  🎯 Target Body Fat Goal &amp; Lean Mass Retention Simulator:
                </h4>
                <span style="font-family: var(--mono); font-size: 0.75rem; color: #8b5cf6; font-weight: bold; background: rgba(139, 92, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Body Recomposition Engine</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
                Enter your desired target body fat % to calculate exactly how much pure fat mass you must burn while preserving your existing lean muscle tissue:
              </p>
              
              <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: center;">
                <div>
                  <label class="field-label">Target Body Fat: <span id="bf-target-pct-label" style="color: #8b5cf6; font-size: 1rem; font-weight: bold;">12.0%</span></label>
                  <input type="range" id="bf-target-slider" min="5" max="35" value="12" step="0.5" oninput="updateBFTarget(this.value)" style="width: 100%; cursor: pointer;" />
                </div>
                <div style="text-align: right; min-width: 150px;">
                  <div style="font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted);">Goal Body Weight:</div>
                  <div id="bf-goal-weight" style="font-family: var(--mono); font-size: 1.3rem; font-weight: bold; color: var(--fg);">75.7 kg</div>
                </div>
              </div>

              <div id="bf-goal-summary-box" style="margin-top: 1rem; padding: 0.75rem 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.82rem; line-height: 1.5; color: var(--fg);">
                <!-- Populated dynamically -->
              </div>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopyBF" onclick="copyBodyFatSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy US Navy Body Fat &amp; Military Assessment Report
            </button>
          </div>

          <!-- Step-by-Step Worked Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step US Navy Equation Derivation</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Hodgdon &amp; Beckett Standard</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              The US Navy formula calculates whole-body density (D<sub>B</sub>) from log-transformed circumference measurements, then converts body density to body fat percentage via the Siri equation:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">1. Logarithmic Circumference Equation:</strong>
                <div id="bf-step-eq" style="color: #3b82f6; margin-top: 0.25rem; word-break: break-all;">
                  %BF = 495 / [ 1.0324 - 0.19077 &times; log<sub>10</sub>(Waist - Neck) + 0.15456 &times; log<sub>10</sub>(Height) ] - 450
                </div>
                <div id="bf-step-1" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  <!-- Populated dynamically -->
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">2. Siri Formula Body Density Conversion:</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">
                  %BF = (4.95 / Density - 4.50) &times; 100%
                </div>
                <div id="bf-step-2" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  Calculated Body Density D<sub>B</sub> = 1.061 g/cm³ &rarr; %BF = <strong>16.8%</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981; font-weight: 700;">3. Two-Compartment Body Mass Partitioning:</strong>
                <div id="bf-step-3" style="color: #10b981; margin-top: 0.25rem;">
                  Fat Mass = 80.0 kg &times; 16.8% = 13.4 kg &bull; Lean Body Mass = 80.0 kg - 13.4 kg = <strong>66.6 kg</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Pitfalls & Essential Fat Limits -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Body Composition Traps &amp; Essential Fat Limits</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Essential Fat Floor Danger:</strong> Essential fat is required for nerve myelin sheath insulation, hormone precursor synthesis, and bone marrow cellular integrity. The absolute physiological minimum is <strong>2% to 5% for men</strong> and <strong>10% to 13% for women</strong>. Dropping below these levels triggers hypogonadism, amenorrhea (menstrual cessation), immune suppression, and severe bone mineral loss.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Tape Measurement Standard Operating Protocol:</strong> Always measure the neck horizontally just below the larynx (Adam\'s apple) without compressing tissue. Men measure waist horizontally at the navel at the end of normal passive exhalation. Women measure at the narrowest circumference between ribs and iliac crest, with hips at the maximal gluteal extension.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">DEXA Scan vs Circumference Variance:</strong> The US Navy method has an empirical standard error of estimate (SEE) of approximately <strong>&plusmn;3.0% to 3.5%</strong> compared to dual-energy X-ray absorptiometry (DEXA) or hydrostatic 4-compartment weighing. Intestinal bloat or acute sodium water retention will artificially increase estimated body fat by expanding waist circumference.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Why Body Fat % Matters More Than Scale Weight:</strong> Scale weight fluctuates daily by 2 to 5 lbs due to glycogen storage (each gram of glycogen binds 3–4g of water), gut transit, and hydration. Tracking circumference measurements and body fat % verifies that lost weight is actually adipose tissue rather than metabolically active skeletal muscle.</li>
            </ul>
          </div>
        </div>

        <script>
          let bfUnitMode = 'metric';
          let bfGender = 'male';

          window.setBFUnit = function(mode) {
            bfUnitMode = mode;
            const btnM = document.getElementById('btnBFMetric');
            const btnI = document.getElementById('btnBFImperial');
            const lblH = document.getElementById('lblBFHeight');
            const lblW = document.getElementById('lblBFWeight');
            const lblN = document.getElementById('lblBFNeck');
            const lblWa = document.getElementById('lblBFWaist');
            const lblHi = document.getElementById('lblBFHip');

            const inpH = document.getElementById('bf-height');
            const inpW = document.getElementById('bf-weight');
            const inpN = document.getElementById('bf-neck');
            const inpWa = document.getElementById('bf-waist');
            const inpHi = document.getElementById('bf-hip');

            if (mode === 'metric') {
              btnM.style.background = 'rgba(59, 130, 246, 0.15)';
              btnM.style.borderColor = '#3b82f6';
              btnM.style.color = '#3b82f6';
              btnI.style.background = 'var(--surface-alt)';
              btnI.style.borderColor = 'var(--border)';
              btnI.style.color = 'var(--fg)';

              lblH.textContent = 'Height (cm)';
              lblW.textContent = 'Weight (kg)';
              lblN.textContent = 'Neck Circumference (cm)';
              lblWa.textContent = 'Waist Circumference (cm)';
              lblHi.textContent = 'Hip Circumference (cm)';

              inpH.value = (parseFloat(inpH.value) * 2.54).toFixed(1);
              inpW.value = (parseFloat(inpW.value) * 0.453592).toFixed(1);
              inpN.value = (parseFloat(inpN.value) * 2.54).toFixed(1);
              inpWa.value = (parseFloat(inpWa.value) * 2.54).toFixed(1);
              inpHi.value = (parseFloat(inpHi.value) * 2.54).toFixed(1);
            } else {
              btnI.style.background = 'rgba(59, 130, 246, 0.15)';
              btnI.style.borderColor = '#3b82f6';
              btnI.style.color = '#3b82f6';
              btnM.style.background = 'var(--surface-alt)';
              btnM.style.borderColor = 'var(--border)';
              btnM.style.color = 'var(--fg)';

              lblH.textContent = 'Height (inches)';
              lblW.textContent = 'Weight (lbs)';
              lblN.textContent = 'Neck Circumference (inches)';
              lblWa.textContent = 'Waist Circumference (inches)';
              lblHi.textContent = 'Hip Circumference (inches)';

              inpH.value = (parseFloat(inpH.value) / 2.54).toFixed(1);
              inpW.value = (parseFloat(inpW.value) / 0.453592).toFixed(1);
              inpN.value = (parseFloat(inpN.value) / 2.54).toFixed(1);
              inpWa.value = (parseFloat(inpWa.value) / 2.54).toFixed(1);
              inpHi.value = (parseFloat(inpHi.value) / 2.54).toFixed(1);
            }
            calcBF();
          };

          window.toggleBFGender = function() {
            const radios = document.getElementsByName('bf-gender');
            for (let i = 0; i < radios.length; i++) {
              if (radios[i].checked) bfGender = radios[i].value;
            }

            const hipGrp = document.getElementById('bf-hip-group');
            const noteWaist = document.getElementById('noteBFWaist');
            const targetSlider = document.getElementById('bf-target-slider');

            if (bfGender === 'female') {
              hipGrp.style.display = 'block';
              noteWaist.textContent = 'Women: at narrowest waist point';
              if (parseFloat(targetSlider.value) < 16) {
                targetSlider.value = 20;
                document.getElementById('bf-target-pct-label').textContent = '20.0%';
              }
            } else {
              hipGrp.style.display = 'none';
              noteWaist.textContent = 'Men: at navel level (relaxed exhale)';
              if (parseFloat(targetSlider.value) > 25) {
                targetSlider.value = 12;
                document.getElementById('bf-target-pct-label').textContent = '12.0%';
              }
            }
            calcBF();
          };

          window.updateBFTarget = function(val) {
            document.getElementById('bf-target-pct-label').textContent = parseFloat(val).toFixed(1) + '%';
            calcBF();
          };

          let currentCalculatedBF = 16.8;
          let currentWeightKg = 80;
          let currentLbmKg = 66.6;

          function calcBF() {
            let h = parseFloat(document.getElementById('bf-height').value) || 178;
            let w = parseFloat(document.getElementById('bf-weight').value) || 80;
            let n = parseFloat(document.getElementById('bf-neck').value) || 38;
            let wa = parseFloat(document.getElementById('bf-waist').value) || 86;
            let hi = parseFloat(document.getElementById('bf-hip').value) || 98;
            const ageBracket = document.getElementById('bf-age').value;

            // Convert everything to cm & kg for internal standard equation
            let hCm = h;
            let wKg = w;
            let nCm = n;
            let waCm = wa;
            let hiCm = hi;

            if (bfUnitMode === 'imperial') {
              hCm = h * 2.54;
              wKg = w * 0.453592;
              nCm = n * 2.54;
              waCm = wa * 2.54;
              hiCm = hi * 2.54;
            }

            let bf = 0;
            let stepText = '';

            if (bfGender === 'male') {
              document.getElementById('bf-step-eq').innerHTML = '%BF = 495 / [ 1.0324 - 0.19077 &times; log<sub>10</sub>(Waist - Neck) + 0.15456 &times; log<sub>10</sub>(Height) ] - 450';
              const diff = waCm - nCm;
              if (diff > 0 && hCm > 0) {
                const logDiff = Math.log10(diff);
                const logH = Math.log10(hCm);
                const denom = 1.0324 - (0.19077 * logDiff) + (0.15456 * logH);
                bf = (495 / denom) - 450;

                stepText = 'Waist - Neck = ' + waCm.toFixed(1) + ' - ' + nCm.toFixed(1) + ' = ' + diff.toFixed(1) + ' cm &bull; log₁₀(' + diff.toFixed(1) + ') = ' + logDiff.toFixed(4) + ' &bull; log₁₀(' + hCm.toFixed(1) + ') = ' + logH.toFixed(4) + ' &bull; Denominator = ' + denom.toFixed(5);
              }
            } else {
              document.getElementById('bf-step-eq').innerHTML = '%BF = 495 / [ 1.29579 - 0.35004 &times; log<sub>10</sub>(Waist + Hip - Neck) + 0.22100 &times; log<sub>10</sub>(Height) ] - 450';
              const sumDiff = (waCm + hiCm) - nCm;
              if (sumDiff > 0 && hCm > 0) {
                const logSum = Math.log10(sumDiff);
                const logH = Math.log10(hCm);
                const denom = 1.29579 - (0.35004 * logSum) + (0.22100 * logH);
                bf = (495 / denom) - 450;

                stepText = 'Waist + Hip - Neck = (' + waCm.toFixed(1) + ' + ' + hiCm.toFixed(1) + ') - ' + nCm.toFixed(1) + ' = ' + sumDiff.toFixed(1) + ' cm &bull; log₁₀(' + sumDiff.toFixed(1) + ') = ' + logSum.toFixed(4) + ' &bull; log₁₀(' + hCm.toFixed(1) + ') = ' + logH.toFixed(4) + ' &bull; Denominator = ' + denom.toFixed(5);
              }
            }

            if (isNaN(bf) || bf < 2) bf = 2;
            if (bf > 65) bf = 65;

            currentCalculatedBF = bf;
            currentWeightKg = wKg;

            const fatMassKg = wKg * (bf / 100);
            const leanMassKg = wKg - fatMassKg;
            currentLbmKg = leanMassKg;

            const fatMassLbs = fatMassKg * 2.20462;
            const leanMassLbs = leanMassKg * 2.20462;
            const totalLbs = wKg * 2.20462;

            // Update UI elements
            document.getElementById('bf-pct').textContent = bf.toFixed(1) + '%';
            
            if (bfUnitMode === 'metric') {
              document.getElementById('bf-fat-mass-hero').textContent = fatMassKg.toFixed(1) + ' kg Fat';
              document.getElementById('bf-lean-mass-sub').textContent = leanMassKg.toFixed(1) + ' kg Lean Tissue (LBM)';
            } else {
              document.getElementById('bf-fat-mass-hero').textContent = fatMassLbs.toFixed(1) + ' lbs Fat';
              document.getElementById('bf-lean-mass-sub').textContent = leanMassLbs.toFixed(1) + ' lbs Lean Tissue (LBM)';
            }

            // Categories (ACE Standards)
            let cat = 'Average Fitness';
            let catColor = '#10b981';
            let needleLeft = 50;

            if (bfGender === 'male') {
              if (bf < 6) { cat = 'Essential Fat (2–5%)'; catColor = '#3b82f6'; needleLeft = 8; }
              else if (bf < 14) { cat = 'Athletes (6–13%)'; catColor = '#10b981'; needleLeft = 28; }
              else if (bf < 18) { cat = 'Fitness (14–17%)'; catColor = '#059669'; needleLeft = 48; }
              else if (bf < 25) { cat = 'Average (18–24%)'; catColor = '#f59e0b'; needleLeft = 68; }
              else { cat = 'Obese (≥ 25%)'; catColor = '#ef4444'; needleLeft = 88; }
            } else {
              if (bf < 14) { cat = 'Essential Fat (10–13%)'; catColor = '#3b82f6'; needleLeft = 8; }
              else if (bf < 21) { cat = 'Athletes (14–20%)'; catColor = '#10b981'; needleLeft = 28; }
              else if (bf < 25) { cat = 'Fitness (21–24%)'; catColor = '#059669'; needleLeft = 48; }
              else if (bf < 32) { cat = 'Average (25–31%)'; catColor = '#f59e0b'; needleLeft = 68; }
              else { cat = 'Obese (≥ 32%)'; catColor = '#ef4444'; needleLeft = 88; }
            }

            const catEl = document.getElementById('bf-category');
            catEl.textContent = cat;
            catEl.style.color = catColor;
            document.getElementById('bf-pct').style.color = catColor;
            document.getElementById('bf-needle').style.left = needleLeft + '%';
            document.getElementById('bf-spectrum-label').textContent = bf.toFixed(1) + '% (' + cat + ')';

            // DoD Standards Evaluation
            let dodLimit = 22; // default
            if (bfGender === 'male') {
              if (ageBracket === '17-20') dodLimit = 20;
              else if (ageBracket === '21-27') dodLimit = 22;
              else if (ageBracket === '28-39') dodLimit = 24;
              else dodLimit = 26;
            } else {
              if (ageBracket === '17-20') dodLimit = 28;
              else if (ageBracket === '21-27') dodLimit = 30;
              else if (ageBracket === '28-39') dodLimit = 32;
              else dodLimit = 34;
            }

            const dodStatusEl = document.getElementById('bf-dod-status');
            const dodSubEl = document.getElementById('bf-dod-sub');

            if (bf <= dodLimit) {
              const margin = dodLimit - bf;
              dodStatusEl.textContent = 'PASSED ✓';
              dodStatusEl.style.color = '#10b981';
              dodSubEl.textContent = margin.toFixed(1) + '% below DoD ' + ageBracket + ' max (' + dodLimit + '%)';
            } else {
              const over = bf - dodLimit;
              dodStatusEl.textContent = 'EXCEEDS ⚠️';
              dodStatusEl.style.color = '#ef4444';
              dodSubEl.textContent = over.toFixed(1) + '% above DoD ' + ageBracket + ' max (' + dodLimit + '%)';
            }

            // Target Body Fat Simulation
            const targetBfPct = parseFloat(document.getElementById('bf-target-slider').value) || 12;
            const targetBfDec = targetBfPct / 100;
            const goalWeightKg = leanMassKg / (1 - targetBfDec);
            const goalWeightLbs = goalWeightKg * 2.20462;
            const fatDiffKg = wKg - goalWeightKg;
            const fatDiffLbs = fatDiffKg * 2.20462;

            if (bfUnitMode === 'metric') {
              document.getElementById('bf-goal-weight').textContent = goalWeightKg.toFixed(1) + ' kg';
            } else {
              document.getElementById('bf-goal-weight').textContent = goalWeightLbs.toFixed(1) + ' lbs';
            }

            const summaryBox = document.getElementById('bf-goal-summary-box');
            if (targetBfPct < bf) {
              if (bfUnitMode === 'metric') {
                summaryBox.innerHTML = 'To achieve <strong>' + targetBfPct.toFixed(1) + '% body fat</strong> while preserving your <strong>' + leanMassKg.toFixed(1) + ' kg of lean muscle</strong>, you need to lose <strong style="color: #10b981;">' + fatDiffKg.toFixed(1) + ' kg of pure adipose fat</strong>. Goal scale weight: <strong>' + goalWeightKg.toFixed(1) + ' kg</strong>.';
              } else {
                summaryBox.innerHTML = 'To achieve <strong>' + targetBfPct.toFixed(1) + '% body fat</strong> while preserving your <strong>' + leanMassLbs.toFixed(1) + ' lbs of lean muscle</strong>, you need to lose <strong style="color: #10b981;">' + fatDiffLbs.toFixed(1) + ' lbs of pure adipose fat</strong>. Goal scale weight: <strong>' + goalWeightLbs.toFixed(1) + ' lbs</strong>.';
              }
            } else if (targetBfPct > bf) {
              const gainKg = goalWeightKg - wKg;
              const gainLbs = gainKg * 2.20462;
              if (bfUnitMode === 'metric') {
                summaryBox.innerHTML = 'Your current body fat (' + bf.toFixed(1) + '%) is already below ' + targetBfPct.toFixed(1) + '%. Reaching ' + targetBfPct.toFixed(1) + '% at current lean mass allows adding <strong>' + gainKg.toFixed(1) + ' kg</strong> of mass.';
              } else {
                summaryBox.innerHTML = 'Your current body fat (' + bf.toFixed(1) + '%) is already below ' + targetBfPct.toFixed(1) + '%. Reaching ' + targetBfPct.toFixed(1) + '% at current lean mass allows adding <strong>' + gainLbs.toFixed(1) + ' lbs</strong> of mass.';
              }
            } else {
              summaryBox.innerHTML = '✓ You are currently at your exact target body fat percentage of ' + targetBfPct.toFixed(1) + '%!';
            }

            // Update Derivation text
            document.getElementById('bf-step-1').innerHTML = stepText;
            document.getElementById('bf-step-2').innerHTML = 'Resulting US Navy Body Fat % = <strong>' + bf.toFixed(2) + '%</strong>';
            if (bfUnitMode === 'metric') {
              document.getElementById('bf-step-3').innerHTML = 'Fat Mass = ' + wKg.toFixed(1) + ' kg &times; ' + bf.toFixed(1) + '% = <strong>' + fatMassKg.toFixed(1) + ' kg</strong> &bull; Lean Mass (LBM) = ' + wKg.toFixed(1) + ' - ' + fatMassKg.toFixed(1) + ' = <strong>' + leanMassKg.toFixed(1) + ' kg</strong>';
            } else {
              document.getElementById('bf-step-3').innerHTML = 'Fat Mass = ' + totalLbs.toFixed(1) + ' lbs &times; ' + bf.toFixed(1) + '% = <strong>' + fatMassLbs.toFixed(1) + ' lbs</strong> &bull; Lean Mass (LBM) = ' + totalLbs.toFixed(1) + ' - ' + fatMassLbs.toFixed(1) + ' = <strong>' + leanMassLbs.toFixed(1) + ' lbs</strong>';
            }
          }

          window.copyBodyFatSummary = function() {
            const bf = document.getElementById('bf-pct').textContent;
            const cat = document.getElementById('bf-category').textContent;
            const fatHero = document.getElementById('bf-fat-mass-hero').textContent;
            const leanSub = document.getElementById('bf-lean-mass-sub').textContent;
            const dod = document.getElementById('bf-dod-status').textContent;
            const dodSub = document.getElementById('bf-dod-sub').textContent;
            const goalWeight = document.getElementById('bf-goal-weight').textContent;
            const targetPct = document.getElementById('bf-target-pct-label').textContent;

            const report = [
              '=== US NAVY BODY FAT & MILITARY READINESS REPORT ===',
              'Estimated Body Fat: ' + bf,
              'Fitness Category: ' + cat,
              'Fat Mass: ' + fatHero,
              'Lean Body Mass (LBM): ' + leanSub,
              '---------------------------------------------------',
              'DoD Military Readiness Status: ' + dod + ' (' + dodSub + ')',
              'Target Goal: ' + targetPct + ' Body Fat -> Goal Weight: ' + goalWeight,
              'Standard: US Navy Circumference Method (DoD Directive 1308.3)',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/health/body-fat-calculator'
            ].join('\n');

            navigator.clipboard.writeText(report).then(function() {
              const btn = document.getElementById('btnCopyBF');
              if (btn) {
                const old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Body Fat Assessment!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() { calcBF(); });
          calcBF();
        </script>
      `
    },
    {
      slug: 'macro-calculator',
      title: 'Macro Calculator (Protein, Carbs & Fat Split for Cutting, Bulking & Keto)',
      metaDesc: 'Calculate personalized daily macronutrient targets in grams, calories, and meal splits. Anchored by sports science protein floors, hormonal fat minimums, and glycogen demands.',
      category: 'Health & Fitness',
      faq: [
        { q: 'How are daily macronutrients calculated from calories?', a: 'Macronutrients are governed by Atwater energy factors: Protein provides 4 calories per gram, Carbohydrates provide 4 calories per gram, and Dietary Fats provide 9 calories per gram. Sports science dictates that protein and fat requirements should be anchored to body weight (e.g. 1.6–2.4 g/kg protein for lifters, 0.7–1.0 g/kg fat for hormone health), with remaining calories allocated to carbohydrates.' },
        { q: 'How much protein do I really need to preserve muscle while cutting?', a: 'The International Society of Sports Nutrition (ISSN) and extensive meta-analyses recommend 2.0 to 2.4 grams of protein per kilogram of body weight (0.9 to 1.1 g/lb) during a caloric deficit. In lean athletes undergoing aggressive cutting, protein requirements can rise to 2.3–3.1 g/kg of lean body mass to prevent muscle catabolism.' },
        { q: 'What is the minimum dietary fat intake required for hormonal health?', a: 'Dietary fats should never drop below 15% to 20% of total daily calories, or roughly 0.6 to 0.8 grams per kilogram of body weight (0.3 to 0.4 g/lb). Prolonged ultra-low-fat diets disrupt lipid-derived steroid hormone synthesis (including testosterone and estrogen) and impair the absorption of fat-soluble vitamins (A, D, E, K).' },
        { q: 'What is the difference between total carbs and net carbs?', a: 'Total carbohydrates include all starches, sugars, dietary fiber, and sugar alcohols. Net carbohydrates are calculated as: Net Carbs = Total Carbs - Dietary Fiber - Sugar Alcohols. Because dietary fiber cannot be digested by human small intestine enzymes into glucose, it does not trigger an insulin spike, making net carbs the metric of choice for ketogenic protocols.' },
        { q: 'Does nutrient timing and protein distribution per meal matter?', a: 'Yes. To maximize 24-hour Muscle Protein Synthesis (MPS), clinical evidence supports distributing daily protein across 3 to 5 meals, with each meal providing at least 25 to 40 grams of high-quality protein (containing roughly 2.7 to 3.5 grams of leucine to trigger the physiological leucine threshold).' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health & Fitness</a> &gt; Macro Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Macronutrient Nutrition Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Calculate your precise daily grams of dietary protein, carbohydrates, and healthy fats tailored to your body weight, calorie target, training protocol, and per-meal distribution schedule.
          </p>

          <!-- Unit Selector Toggle -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
            <button type="button" id="btnMCMetric" onclick="setMCUnit('metric')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid #3b82f6; background: rgba(59, 130, 246, 0.1); color: #3b82f6; cursor: pointer; font-weight: 600;">Metric (kg)</button>
            <button type="button" id="btnMCImperial" onclick="setMCUnit('imperial')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--border); background: var(--surface-alt); color: var(--fg); cursor: pointer;">Imperial (lbs)</button>
          </div>

          <div class="tool-box">
            <!-- Inputs Grid -->
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label" id="lblMCWeight">Body Weight (kg)</label>
                <input type="number" id="mc-weight" class="code-input" value="75" step="0.5" min="30" max="300" oninput="calcMacros()" style="font-size: 1.2rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Daily Calorie Target (kcal)</label>
                <input type="number" id="mc-cal" class="code-input" value="2300" step="50" min="800" max="8000" oninput="calcMacros()" style="font-size: 1.2rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Goal / Nutrition Strategy</label>
                <select id="mc-goal" class="code-input" onchange="calcMacros()" style="font-size: 0.95rem;">
                  <option value="cut">Aggressive Fat Loss / Cutting (2.4g/kg P &bull; Muscle Sparing)</option>
                  <option value="recomp" selected>Body Recomposition / Lean Loss (2.0g/kg P &bull; Balanced)</option>
                  <option value="bulk">Lean Muscle Hypertrophy / Bulking (1.8g/kg P &bull; High Glycogen)</option>
                  <option value="endurance">Endurance &amp; Marathon Running (1.4g/kg P &bull; 60% Carbs)</option>
                  <option value="keto">Ketogenic Diet (&lt;30g Net Carbs &bull; High Fat 70%)</option>
                  <option value="custom">Custom Percentage Split</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Meals per Day</label>
                <select id="mc-meals" class="code-input" onchange="calcMacros()" style="font-size: 0.95rem;">
                  <option value="3">3 Meals (Breakfast, Lunch, Dinner)</option>
                  <option value="4" selected>4 Meals (3 Meals + 1 Post-Workout Shake)</option>
                  <option value="5">5 Meals (Frequent Feeder Protocol)</option>
                  <option value="6">6 Meals (Bodybuilder Grazing Schedule)</option>
                </select>
              </div>
            </div>

            <!-- Custom Percentage Sliders (Hidden unless custom selected) -->
            <div id="mc-custom-sliders" style="display: none; margin-top: 1rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 600;">
                Custom Macro Ratio (% of Calories — Must Total 100%): Total = <span id="mc-custom-total" style="color: #10b981; font-weight: bold;">100%</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem;">
                <div>
                  <label style="font-family: var(--mono); font-size: 0.72rem; color: #ef4444;">Protein %: <span id="mc-pct-p-disp">30%</span></label>
                  <input type="range" id="mc-pct-p" min="10" max="60" value="30" oninput="updateMCCustom()" style="width: 100%;" />
                </div>
                <div>
                  <label style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6;">Fats %: <span id="mc-pct-f-disp">30%</span></label>
                  <input type="range" id="mc-pct-f" min="15" max="75" value="30" oninput="updateMCCustom()" style="width: 100%;" />
                </div>
                <div>
                  <label style="font-family: var(--mono); font-size: 0.72rem; color: #10b981;">Carbs %: <span id="mc-pct-c-disp">40%</span></label>
                  <input type="range" id="mc-pct-c" min="0" max="75" value="40" oninput="updateMCCustom()" style="width: 100%;" />
                </div>
              </div>
            </div>

            <!-- Hero Output Results (3 Macro Cards + Fiber) -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Protein (4 kcal/g)</div>
                <div id="mc-p-g" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #ef4444; margin: 0.25rem 0;">150g</div>
                <div id="mc-p-cal" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">600 kcal (26%)</div>
                <div id="mc-p-ratio" style="font-size: 0.75rem; color: var(--fg); margin-top: 0.35rem; font-family: var(--mono);">2.00 g / kg bodyweight</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #3b82f6; padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Healthy Fats (9 kcal/g)</div>
                <div id="mc-f-g" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">64g</div>
                <div id="mc-f-cal" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">575 kcal (25%)</div>
                <div id="mc-f-ratio" style="font-size: 0.75rem; color: var(--fg); margin-top: 0.35rem; font-family: var(--mono);">0.85 g / kg bodyweight</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #10b981; padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Carbohydrates (4 kcal/g)</div>
                <div id="mc-c-g" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">281g</div>
                <div id="mc-c-cal" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">1,125 kcal (49%)</div>
                <div id="mc-c-ratio" style="font-size: 0.75rem; color: var(--fg); margin-top: 0.35rem; font-family: var(--mono);">3.75 g / kg bodyweight</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #f59e0b; padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Daily Dietary Fiber</div>
                <div id="mc-fiber-g" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin: 0.25rem 0;">32g</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">14g per 1,000 kcal</div>
                <div style="font-size: 0.75rem; color: var(--fg); margin-top: 0.35rem; font-family: var(--mono);">Cardiovascular health</div>
              </div>
            </div>

            <!-- Proportional Visual Stacked Bar -->
            <div style="margin-top: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">
                <span>Caloric Distribution Breakdown:</span>
                <span id="mc-bar-total" style="color: var(--fg);">2,300 kcal (100%)</span>
              </div>
              <div style="display: flex; width: 100%; height: 26px; border-radius: 4px; overflow: hidden; font-family: var(--mono); font-size: 0.72rem; font-weight: bold; color: #fff; text-align: center; line-height: 26px;">
                <div id="mc-bar-p" style="width: 26.1%; background: #ef4444;" title="Protein">Protein 26%</div>
                <div id="mc-bar-f" style="width: 25.0%; background: #3b82f6;" title="Fats">Fats 25%</div>
                <div id="mc-bar-c" style="width: 48.9%; background: #10b981;" title="Carbs">Carbs 49%</div>
              </div>
            </div>

            <!-- Meal-by-Meal Distribution Table -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; color: var(--fg);">
                  🍽️ Target Per-Meal Macronutrient Split (<span id="mc-meal-count-disp">4 Meals</span>):
                </div>
                <span style="font-family: var(--mono); font-size: 0.75rem; color: #10b981;">Meets ~3g Leucine Threshold for MPS</span>
              </div>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; text-align: center;">
                  <thead>
                    <tr style="background: var(--surface-alt); border-bottom: 1px solid var(--border);">
                      <th style="padding: 0.45rem 0.6rem; text-align: left;">Meal / Feeding Window</th>
                      <th style="padding: 0.45rem 0.6rem; color: #ef4444;">Protein (g)</th>
                      <th style="padding: 0.45rem 0.6rem; color: #3b82f6;">Fats (g)</th>
                      <th style="padding: 0.45rem 0.6rem; color: #10b981;">Carbs (g)</th>
                      <th style="padding: 0.45rem 0.6rem; color: var(--fg);">Calories</th>
                    </tr>
                  </thead>
                  <tbody id="mc-meals-tbody">
                    <!-- Populated dynamically -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Whole-Food Grocery Macro Benchmark Table -->
            <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; margin-bottom: 0.75rem; color: var(--fg);">
                🛒 Nutrient-Dense Whole Food Staple Macro Guide (Per 100g Cooked):
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.8rem;">
                <div style="background: var(--surface); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <strong style="color: #ef4444; display: block; margin-bottom: 0.35rem;">Protein Anchors:</strong>
                  <div>&bull; Chicken Breast: 31g P, 3g F (165 kcal)</div>
                  <div>&bull; 93/7 Lean Beef: 26g P, 8g F (180 kcal)</div>
                  <div>&bull; Salmon: 22g P, 12g F (206 kcal)</div>
                  <div>&bull; Greek Yogurt (0%): 10g P, 3g C (59 kcal)</div>
                  <div>&bull; Extra Firm Tofu: 12g P, 5g F (94 kcal)</div>
                </div>

                <div style="background: var(--surface); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <strong style="color: #10b981; display: block; margin-bottom: 0.35rem;">Glycogen Carbs:</strong>
                  <div>&bull; Jasmine / Basmati Rice: 28g C, 3g P (130 kcal)</div>
                  <div>&bull; Rolled Oats (dry): 66g C, 14g P, 7g F (389 kcal)</div>
                  <div>&bull; Sweet Potato: 21g C, 2g P (90 kcal)</div>
                  <div>&bull; Quinoa (cooked): 21g C, 4g P (120 kcal)</div>
                  <div>&bull; Black Beans: 24g C, 9g P, 8g Fiber (132 kcal)</div>
                </div>

                <div style="background: var(--surface); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <strong style="color: #3b82f6; display: block; margin-bottom: 0.35rem;">Endocrine Fats:</strong>
                  <div>&bull; Extra Virgin Olive Oil: 100g F (884 kcal)</div>
                  <div>&bull; Whole Hass Avocado: 15g F, 9g C (160 kcal)</div>
                  <div>&bull; Almonds / Walnuts: 50g F, 21g P (579 kcal)</div>
                  <div>&bull; Whole Pasture Eggs: 13g P, 11g F (155 kcal)</div>
                  <div>&bull; Dark Chocolate (85%): 46g F, 11g P (600 kcal)</div>
                </div>
              </div>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopyMacro" onclick="copyMacroSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Complete Macronutrient Protocol &amp; Meal Split
            </button>
          </div>

          <!-- Step-by-Step Worked Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Macronutrient Derivation (Atwater Energy Factors)</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">ISSN Position Stand Standard</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Macronutrients are calculated by establishing biological protein and lipid floors, then allocating discretionary energy to carbohydrates:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #ef4444;">Step 1: Anchor Protein Requirements</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  Protein Grams = Body Weight (kg) &times; Target Factor (2.0 g/kg) &bull; Calories = Protein &times; 4 kcal/g
                </div>
                <div id="mc-step-1" style="color: var(--fg); margin-top: 0.25rem; font-size: 0.8rem;">
                  For 75 kg: 75 &times; 2.0 = <strong>150g Protein (600 kcal)</strong>.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #3b82f6;">Step 2: Anchor Dietary Fat Requirements</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  Fat Grams = (Total Calories &times; Fat %) / 9 kcal/g
                </div>
                <div id="mc-step-2" style="color: var(--fg); margin-top: 0.25rem; font-size: 0.8rem;">
                  For 2,300 kcal: (2,300 &times; 0.25) / 9 = 575 / 9 = <strong>64g Fat (576 kcal)</strong>.
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981;">Step 3: Allocate Remaining Calories to Carbohydrates</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  Carb Calories = Total Calories - (Protein Cal + Fat Cal) &bull; Carb Grams = Carb Cal / 4 kcal/g
                </div>
                <div id="mc-step-3" style="color: var(--fg); margin-top: 0.25rem; font-size: 0.8rem;">
                  Carb Cal = 2,300 - (600 + 576) = 1,124 kcal &bull; Carbs = 1,124 / 4 = <strong>281g Carbs (1,124 kcal)</strong>.
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Nutrition Pitfalls -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Macronutrient Traps &amp; Hormone Suppression</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Ultra-Low-Fat Endocrine Collapse:</strong> Cutting dietary fat below 15%–20% of total calories crashes cholesterol substrate availability needed for synthesizing testosterone, estrogen, and progesterone. It also severely restricts absorption of fat-soluble vitamins (A, D, E, K). Never compromise fat minimums.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Percentage-Based Protein Fallacy:</strong> Calculating protein purely as a percentage (e.g. 30%) becomes dangerous in deep deficits. In a 1,200 kcal deficit, 30% protein is only 90 grams—catastrophically insufficient for an 80kg lifter seeking to avoid muscle wasting. Always calculate protein in absolute grams per kilogram of body weight.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Net Carbs vs Sugar Alcohols:</strong> Not all sugar alcohols are metabolically inert. While erythritol has a glycemic index of 0, maltitol (frequently used in cheap "sugar-free" bars) has a glycemic index of 35–52 and provides roughly 2.1 kcal/g, triggering blood sugar spikes and gastrointestinal distress.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Myth of the 30-Minute Anabolic Window:</strong> Post-workout nutrient timing is far less critical than total 24-hour macronutrient adherence. Consuming 25–40g of protein every 3 to 4 hours sustains elevated muscle protein synthesis regardless of whether an exact shake is consumed within 30 minutes of lifting.</li>
            </ul>
          </div>
        </div>

        <script>
          var mcUnitMode = 'metric';

          window.setMCUnit = function(mode) {
            mcUnitMode = mode;
            var btnM = document.getElementById('btnMCMetric');
            var btnI = document.getElementById('btnMCImperial');
            var lblW = document.getElementById('lblMCWeight');
            var inpW = document.getElementById('mc-weight');

            if (mode === 'metric') {
              btnM.style.background = 'rgba(59, 130, 246, 0.1)';
              btnM.style.borderColor = '#3b82f6';
              btnM.style.color = '#3b82f6';
              btnI.style.background = 'var(--surface-alt)';
              btnI.style.borderColor = 'var(--border)';
              btnI.style.color = 'var(--fg)';
              lblW.textContent = 'Body Weight (kg)';
              inpW.value = (parseFloat(inpW.value) / 2.20462).toFixed(1);
            } else {
              btnI.style.background = 'rgba(59, 130, 246, 0.1)';
              btnI.style.borderColor = '#3b82f6';
              btnI.style.color = '#3b82f6';
              btnM.style.background = 'var(--surface-alt)';
              btnM.style.borderColor = 'var(--border)';
              btnM.style.color = 'var(--fg)';
              lblW.textContent = 'Body Weight (lbs)';
              inpW.value = Math.round(parseFloat(inpW.value) * 2.20462);
            }
            calcMacros();
          };

          window.updateMCCustom = function() {
            var p = parseInt(document.getElementById('mc-pct-p').value, 10);
            var f = parseInt(document.getElementById('mc-pct-f').value, 10);
            var c = parseInt(document.getElementById('mc-pct-c').value, 10);

            document.getElementById('mc-pct-p-disp').textContent = p + '%';
            document.getElementById('mc-pct-f-disp').textContent = f + '%';
            document.getElementById('mc-pct-c-disp').textContent = c + '%';

            var total = p + f + c;
            var totalEl = document.getElementById('mc-custom-total');
            totalEl.textContent = total + '%';
            totalEl.style.color = total === 100 ? '#10b981' : '#ef4444';

            calcMacros();
          };

          function calcMacros() {
            var rawWeight = parseFloat(document.getElementById('mc-weight').value) || 75;
            var cals = parseFloat(document.getElementById('mc-cal').value) || 2300;
            var goal = document.getElementById('mc-goal').value;
            var numMeals = parseInt(document.getElementById('mc-meals').value, 10) || 4;

            var weightKg = mcUnitMode === 'metric' ? rawWeight : (rawWeight / 2.20462);

            var customDiv = document.getElementById('mc-custom-sliders');
            if (goal === 'custom') {
              customDiv.style.display = 'block';
            } else {
              customDiv.style.display = 'none';
            }

            var pG = 0, fG = 0, cG = 0;

            if (goal === 'cut') {
              // 2.4 g/kg protein, 20% fat, remainder carbs
              pG = Math.round(weightKg * 2.4);
              var fCal = cals * 0.20;
              fG = Math.round(fCal / 9);
              var remCal = Math.max(0, cals - (pG * 4) - fCal);
              cG = Math.round(remCal / 4);
            } else if (goal === 'recomp') {
              // 2.0 g/kg protein, 25% fat, remainder carbs
              pG = Math.round(weightKg * 2.0);
              var fCal = cals * 0.25;
              fG = Math.round(fCal / 9);
              var remCal = Math.max(0, cals - (pG * 4) - fCal);
              cG = Math.round(remCal / 4);
            } else if (goal === 'bulk') {
              // 1.8 g/kg protein, 25% fat, remainder carbs
              pG = Math.round(weightKg * 1.8);
              var fCal = cals * 0.25;
              fG = Math.round(fCal / 9);
              var remCal = Math.max(0, cals - (pG * 4) - fCal);
              cG = Math.round(remCal / 4);
            } else if (goal === 'endurance') {
              // 1.4 g/kg protein, 20% fat, remainder carbs
              pG = Math.round(weightKg * 1.4);
              var fCal = cals * 0.20;
              fG = Math.round(fCal / 9);
              var remCal = Math.max(0, cals - (pG * 4) - fCal);
              cG = Math.round(remCal / 4);
            } else if (goal === 'keto') {
              // 1.8 g/kg protein, 25g net carbs, remainder fats
              pG = Math.round(weightKg * 1.8);
              cG = 25;
              var remCal = Math.max(0, cals - (pG * 4) - (cG * 4));
              fG = Math.round(remCal / 9);
            } else if (goal === 'custom') {
              var pPct = parseInt(document.getElementById('mc-pct-p').value, 10) / 100;
              var fPct = parseInt(document.getElementById('mc-pct-f').value, 10) / 100;
              var cPct = parseInt(document.getElementById('mc-pct-c').value, 10) / 100;
              pG = Math.round((cals * pPct) / 4);
              fG = Math.round((cals * fPct) / 9);
              cG = Math.round((cals * cPct) / 4);
            }

            var pCal = pG * 4;
            var fCal = fG * 9;
            var cCal = cG * 4;
            var totalMacroCals = pCal + fCal + cCal || 1;

            var pPctActual = Math.round((pCal / totalMacroCals) * 100);
            var fPctActual = Math.round((fCal / totalMacroCals) * 100);
            var cPctActual = Math.round((cCal / totalMacroCals) * 100);

            var pPerKg = (pG / weightKg).toFixed(2);
            var fPerKg = (fG / weightKg).toFixed(2);
            var cPerKg = (cG / weightKg).toFixed(2);

            // Fiber recommendation: 14g per 1000 kcal
            var fiberG = Math.round((cals / 1000) * 14);

            // Update UI Hero
            document.getElementById('mc-p-g').textContent = pG + 'g';
            document.getElementById('mc-p-cal').textContent = pCal.toLocaleString('en-US') + ' kcal (' + pPctActual + '%)';
            document.getElementById('mc-p-ratio').textContent = pPerKg + ' g / kg bodyweight';

            document.getElementById('mc-f-g').textContent = fG + 'g';
            document.getElementById('mc-f-cal').textContent = fCal.toLocaleString('en-US') + ' kcal (' + fPctActual + '%)';
            document.getElementById('mc-f-ratio').textContent = fPerKg + ' g / kg bodyweight';

            document.getElementById('mc-c-g').textContent = cG + 'g';
            document.getElementById('mc-c-cal').textContent = cCal.toLocaleString('en-US') + ' kcal (' + cPctActual + '%)';
            document.getElementById('mc-c-ratio').textContent = cPerKg + ' g / kg bodyweight';

            document.getElementById('mc-fiber-g').textContent = fiberG + 'g';

            // Stacked Bar
            document.getElementById('mc-bar-p').style.width = pPctActual + '%';
            document.getElementById('mc-bar-p').textContent = 'Protein ' + pPctActual + '%';
            document.getElementById('mc-bar-f').style.width = fPctActual + '%';
            document.getElementById('mc-bar-f').textContent = 'Fats ' + fPctActual + '%';
            document.getElementById('mc-bar-c').style.width = cPctActual + '%';
            document.getElementById('mc-bar-c').textContent = 'Carbs ' + cPctActual + '%';
            document.getElementById('mc-bar-total').textContent = cals.toLocaleString('en-US') + ' kcal (100%)';

            // Meal by Meal Table
            document.getElementById('mc-meal-count-disp').textContent = numMeals + ' Meals';
            var mealP = Math.round(pG / numMeals);
            var mealF = Math.round(fG / numMeals);
            var mealC = Math.round(cG / numMeals);
            var mealCal = Math.round(cals / numMeals);

            var mealNames = [
              'Meal 1 (Breakfast / Breaking Fast)',
              'Meal 2 (Mid-Day Nutrition / Lunch)',
              'Meal 3 (Pre / Post Workout Window)',
              'Meal 4 (Evening Nutrition / Dinner)',
              'Meal 5 (Late Afternoon / Pre-Bed Feeding)',
              'Meal 6 (Late Night Slow-Release Casein)'
            ];

            var tbody = document.getElementById('mc-meals-tbody');
            var tHtml = '';
            for (var m = 0; m < numMeals; m++) {
              tHtml += '<tr style="border-bottom: 1px solid var(--border);">' +
                '<td style="padding: 0.45rem 0.6rem; text-align: left; font-weight: 600;">' + (mealNames[m] || ('Meal ' + (m + 1))) + '</td>' +
                '<td style="padding: 0.45rem 0.6rem; color: #ef4444; font-weight: bold;">' + mealP + 'g</td>' +
                '<td style="padding: 0.45rem 0.6rem; color: #3b82f6; font-weight: bold;">' + mealF + 'g</td>' +
                '<td style="padding: 0.45rem 0.6rem; color: #10b981; font-weight: bold;">' + mealC + 'g</td>' +
                '<td style="padding: 0.45rem 0.6rem; font-weight: bold; color: var(--fg);">' + mealCal + ' kcal</td>' +
                '</tr>';
            }
            tbody.innerHTML = tHtml;

            // Step Worked Text
            document.getElementById('mc-step-1').innerHTML = 'For ' + weightKg.toFixed(1) + ' kg: ' + weightKg.toFixed(1) + ' &times; ' + pPerKg + ' g/kg = <strong>' + pG + 'g Protein (' + pCal + ' kcal)</strong>.';
            document.getElementById('mc-step-2').innerHTML = 'For ' + cals + ' kcal: (' + cals + ' &times; ' + (fPctActual / 100).toFixed(2) + ') / 9 = <strong>' + fG + 'g Fat (' + fCal + ' kcal)</strong>.';
            document.getElementById('mc-step-3').innerHTML = 'Remaining Cal = ' + cals + ' - (' + pCal + ' + ' + fCal + ') = ' + cCal + ' kcal &bull; Carbs = ' + cCal + ' / 4 = <strong>' + cG + 'g Carbs (' + cCal + ' kcal)</strong>.';
          }

          window.copyMacroSummary = function() {
            var cals = document.getElementById('mc-cal').value;
            var pG = document.getElementById('mc-p-g').textContent;
            var fG = document.getElementById('mc-f-g').textContent;
            var cG = document.getElementById('mc-c-g').textContent;
            var fiber = document.getElementById('mc-fiber-g').textContent;
            var pRatio = document.getElementById('mc-p-ratio').textContent;
            var meals = document.getElementById('mc-meals').value;

            var text = [
              '=== MACRONUTRIENT NUTRITION TARGETS ===',
              'Daily Caloric Target: ' + cals + ' kcal',
              'Protein: ' + pG + ' (' + pRatio + ')',
              'Healthy Fats: ' + fG,
              'Carbohydrates: ' + cG,
              'Dietary Fiber Target: ' + fiber,
              'Meal Frequency: ' + meals + ' feedings per day',
              '---------------------------------------',
              'Standard: ISSN Sports Nutrition Position Stand',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/health/macro-calculator'
            ].join('\n');

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyMacro');
              if (btn) {
                var old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Nutrition Protocol!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() { calcMacros(); });
          calcMacros();
        </script>
      `
    },
    {
      slug: 'ideal-weight-calculator',
      title: 'Ideal Body Weight Calculator (Devine, Robinson, Miller & Hamwi Formulas)',
      metaDesc: 'Compare your ideal body weight across 4 medical standards (Devine, Robinson, Miller, Hamwi), bone frame size adjustments, and WHO healthy BMI ranges.',
      category: 'Health & Fitness',
      faq: [
        { q: 'What is the Devine formula and why is it used as the medical gold standard?', a: 'Introduced by Dr. B.J. Devine in 1974, the Devine formula was originally developed to standardize creatinine clearance calculations and medication dosages (such as theophylline and aminoglycoside antibiotics) based on extracellular fluid volume. Today, it remains the most universally cited clinical baseline for Ideal Body Weight (IBW) in hospitals worldwide.' },
        { q: 'How does body frame size (wrist circumference) affect ideal body weight?', a: 'Standard formulas assume a medium skeletal frame. Clinical anthropometry adjusts baseline IBW by approximately ±10% based on bone structure: small-framed individuals have a 10% lower target weight, while large-framed individuals have a 10% higher target weight. Frame size can be clinically estimated by measuring the circumference of the wrist at the styloid process.' },
        { q: 'What is the difference between Devine, Robinson, Miller, and Hamwi formulas?', a: 'All four formulas use 5 feet (60 inches) as a baseline and add incremental weight per inch: Hamwi (1964) adds 5 lbs/in (men) or 4.5 lbs/in (women); Devine (1974) adds 2.3 kg/in; Robinson (1983) refined Devine using empirical insurance mortality data, adding 1.9 kg/in (men) or 1.7 kg/in (women); Miller (1983) uses a higher 5-foot base (56.2 kg men) but lower incremental scaling (1.41 kg/in), making it flatter across height extremes.' },
        { q: 'Why do muscular athletes weigh significantly more than their \'Ideal Body Weight\'?', a: 'None of the clinical IBW formulas distinguish between skeletal muscle mass and adipose fat tissue. Because lean skeletal muscle is dense and heavy, drug-free natural athletes, weightlifters, and bodybuilders frequently weigh 15% to 35% above their calculated Devine ideal weight while maintaining single-digit body fat and optimal cardiovascular health.' },
        { q: 'How does the WHO Healthy Weight BMI range compare to IBW formulas?', a: 'The World Health Organization defines a healthy weight range as a BMI between 18.5 and 24.9 kg/m². Unlike IBW formulas that output a single deterministic number, the WHO standard provides a broad healthy window (typically spanning a 15–20 kg / 35–45 lb spread for a given height), which accounts for natural variances in bone density and muscularity.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health &amp; Fitness</a> &gt; Ideal Weight Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Ideal Body Weight (IBW) Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Compare your target weight across the 4 major clinical pharmacokinetic standards (Devine, Robinson, Miller, Hamwi) with bone frame size adjustments and the official WHO healthy BMI weight window.
          </p>

          <div class="tool-box">
            <!-- Unit & Sex Controls -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem;">
              <div style="display: flex; gap: 0.5rem;">
                <button type="button" id="btnIWMetric" onclick="setIWUnit('metric')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid #3b82f6; background: rgba(59, 130, 246, 0.15); color: #3b82f6; cursor: pointer; font-weight: 600;">Metric (cm / kg)</button>
                <button type="button" id="btnIWImperial" onclick="setIWUnit('imperial')" style="padding: 0.45rem 1rem; font-family: var(--mono); font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--border); background: var(--surface-alt); color: var(--fg); cursor: pointer;">Imperial (ft/in / lbs)</button>
              </div>

              <!-- Sex Radio Buttons -->
              <div style="display: flex; gap: 1rem; align-items: center; font-family: var(--mono); font-size: 0.9rem;">
                <label style="display: flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                  <input type="radio" name="iw-gender" value="male" checked onchange="calcIW()" /> <strong>Male</strong>
                </label>
                <label style="display: flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                  <input type="radio" name="iw-gender" value="female" onchange="calcIW()" /> <strong>Female</strong>
                </label>
              </div>
            </div>

            <!-- Primary Inputs Grid -->
            <div class="grid-inputs">
              <!-- Height (Metric) -->
              <div class="field-group" id="grp-iw-h-metric">
                <label class="field-label">Height (cm)</label>
                <input type="number" id="iw-height-cm" class="code-input" value="175" min="120" max="240" step="0.5" oninput="syncIWMetric()" style="font-size: 1.25rem;" />
              </div>

              <!-- Height (Imperial) -->
              <div class="field-group" id="grp-iw-h-imperial" style="display: none;">
                <label class="field-label">Height (Feet &amp; Inches)</label>
                <div style="display: flex; gap: 0.5rem;">
                  <input type="number" id="iw-height-ft" class="code-input" value="5" min="3" max="7" oninput="syncIWImperial()" style="font-size: 1.25rem;" placeholder="ft" />
                  <input type="number" id="iw-height-in" class="code-input" value="9" min="0" max="11.9" step="0.5" oninput="syncIWImperial()" style="font-size: 1.25rem;" placeholder="in" />
                </div>
              </div>

              <!-- Current Weight (Optional for Delta) -->
              <div class="field-group">
                <label class="field-label" id="lbl-iw-weight">Current Weight (kg) <span style="font-weight: normal; text-transform: none; color: var(--text-muted);">(Optional for Target Delta)</span></label>
                <input type="number" id="iw-weight" class="code-input" value="78" min="30" max="300" step="0.5" oninput="calcIW()" style="font-size: 1.25rem;" />
              </div>

              <!-- Bone Frame Size Adjustment -->
              <div class="field-group">
                <label class="field-label">Skeletal Bone Frame Size</label>
                <select id="iw-frame" class="code-input" onchange="calcIW()" style="font-size: 1rem;">
                  <option value="small">Small Frame (-10% Target Weight)</option>
                  <option value="medium" selected>Medium Frame (Baseline Standard)</option>
                  <option value="large">Large Frame (+10% Target Weight)</option>
                </select>
              </div>
            </div>

            <!-- Hero Output Results Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Consensus Ideal Weight</div>
                <div id="iw-consensus-val" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">70.1 kg</div>
                <div id="iw-consensus-sub" style="font-size: 0.85rem; color: #10b981; font-family: var(--mono);">154.5 lbs (Devine Baseline)</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Clinical Formula Range</div>
                <div id="iw-range-val" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">67.3 – 72.4 kg</div>
                <div id="iw-range-sub" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">Spread across 4 medical standards</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Current Weight Delta</div>
                <div id="iw-delta-hero" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #f59e0b; margin: 0.25rem 0;">+7.9 kg (+17.4 lbs)</div>
                <div id="iw-delta-sub" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">Above consensus ideal weight</div>
              </div>
            </div>

            <!-- Visual Target Weight Spectrum Bar -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">
                <span>Target Weight vs. WHO Healthy BMI Range (18.5 – 24.9):</span>
                <span id="iw-who-window-label" style="color: var(--fg); font-weight: bold;">Healthy: 56.7 – 76.3 kg</span>
              </div>

              <!-- Multi-Segment Visual Spectrum Bar -->
              <div style="position: relative; width: 100%; height: 28px; border-radius: 4px; overflow: hidden; display: flex; font-family: var(--mono); font-size: 0.7rem; font-weight: bold; color: #fff; text-align: center; line-height: 28px;">
                <div style="width: 25%; background: #3b82f6;" title="Underweight (< 18.5 BMI)">Under (<18.5)</div>
                <div style="width: 50%; background: #10b981;" title="Healthy Normal Weight (18.5–24.9 BMI)">WHO Healthy Weight Window (18.5 – 24.9)</div>
                <div style="width: 25%; background: #f59e0b;" title="Overweight (≥ 25.0 BMI)">Over (&ge;25.0)</div>
              </div>

              <!-- Target Marker Needle -->
              <div style="position: relative; width: 100%; height: 16px; margin-top: 4px;">
                <div id="iw-marker" style="position: absolute; top: 0; left: 62%; transform: translateX(-50%); width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-bottom: 10px solid var(--fg); transition: left 0.3s ease;"></div>
              </div>

              <div id="iw-marker-legend" style="margin-top: 0.5rem; font-family: var(--mono); font-size: 0.78rem; color: var(--text-muted); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                <span>▲ Pointer: Consensus Ideal Weight (70.1 kg)</span>
                <span id="iw-who-bounds">WHO Normal: 56.7 kg (125 lbs) &bull; 76.3 kg (168 lbs)</span>
              </div>
            </div>

            <!-- 4 Clinical Formulas Detailed Breakdown Table -->
            <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <h4 style="margin: 0 0 0.75rem; font-family: var(--serif); font-size: 1.1rem; color: var(--fg);">
                📋 Clinical Formula Breakdown (Adjusted for Frame Size):
              </h4>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; text-align: center;">
                  <thead>
                    <tr style="background: var(--surface); border-bottom: 1px solid var(--border);">
                      <th style="padding: 0.5rem; text-align: left;">Clinical Standard</th>
                      <th style="padding: 0.5rem; color: #10b981;">Target (kg)</th>
                      <th style="padding: 0.5rem; color: #3b82f6;">Target (lbs)</th>
                      <th style="padding: 0.5rem; color: var(--text-muted);">Clinical Application</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom: 1px solid var(--border);">
                      <td style="padding: 0.5rem; text-align: left; font-weight: bold; color: var(--fg);">Devine (1974)</td>
                      <td id="iw-row-devine-kg" style="color: #10b981; font-weight: bold;">70.1 kg</td>
                      <td id="iw-row-devine-lbs" style="color: #3b82f6; font-weight: bold;">154.5 lbs</td>
                      <td style="color: var(--text-muted);">Gold standard for aminoglycoside &amp; theophylline dosing</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                      <td style="padding: 0.5rem; text-align: left; font-weight: bold; color: var(--fg);">Robinson (1983)</td>
                      <td id="iw-row-robinson-kg" style="color: #10b981; font-weight: bold;">68.5 kg</td>
                      <td id="iw-row-robinson-lbs" style="color: #3b82f6; font-weight: bold;">151.0 lbs</td>
                      <td style="color: var(--text-muted);">Refined Devine using empirical insurance mortality tables</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                      <td style="padding: 0.5rem; text-align: left; font-weight: bold; color: var(--fg);">Miller (1983)</td>
                      <td id="iw-row-miller-kg" style="color: #10b981; font-weight: bold;">68.4 kg</td>
                      <td id="iw-row-miller-lbs" style="color: #3b82f6; font-weight: bold;">150.8 lbs</td>
                      <td style="color: var(--text-muted);">Modified base &amp; slope for moderate height curves</td>
                    </tr>
                    <tr>
                      <td style="padding: 0.5rem; text-align: left; font-weight: bold; color: var(--fg);">Hamwi (1964)</td>
                      <td id="iw-row-hamwi-kg" style="color: #10b981; font-weight: bold;">71.6 kg</td>
                      <td id="iw-row-hamwi-lbs" style="color: #3b82f6; font-weight: bold;">157.8 lbs</td>
                      <td style="color: var(--text-muted);">American Diabetes Association clinical nutrition standard</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopyIW" onclick="copyIdealWeightSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Ideal Weight &amp; Clinical Formulations Report
            </button>
          </div>

          <!-- Step-by-Step Worked Derivations -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Mathematical Formulations for Ideal Body Weight (IBW)</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Clinical Pharmacokinetics Standard</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              All four formulas standardize on a baseline weight for 5 feet (60 inches / 152.4 cm) of height, adding incremental mass per inch over 5 feet:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #3b82f6;">Devine Formula (1974):</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  Men: 50.0 kg + 2.3 kg &times; (Inches over 5ft) &bull; Women: 45.5 kg + 2.3 kg &times; (Inches over 5ft)
                </div>
                <div id="iw-step-devine" style="color: var(--fg); font-size: 0.8rem; margin-top: 0.25rem;">
                  <!-- Populated dynamically -->
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981;">Robinson Formula (1983):</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  Men: 52.0 kg + 1.9 kg &times; (Inches over 5ft) &bull; Women: 49.0 kg + 1.7 kg &times; (Inches over 5ft)
                </div>
                <div id="iw-step-robinson" style="color: var(--fg); font-size: 0.8rem; margin-top: 0.25rem;">
                  <!-- Populated dynamically -->
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #f59e0b;">Miller Formula (1983):</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  Men: 56.2 kg + 1.41 kg &times; (Inches over 5ft) &bull; Women: 53.1 kg + 1.36 kg &times; (Inches over 5ft)
                </div>
                <div id="iw-step-miller" style="color: var(--fg); font-size: 0.8rem; margin-top: 0.25rem;">
                  <!-- Populated dynamically -->
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #ec4899;">Hamwi Formula (1964):</strong>
                <div style="color: var(--text-muted); margin-top: 0.25rem;">
                  Men: 48.0 kg + 2.7 kg &times; (Inches over 5ft) &bull; Women: 45.5 kg + 2.2 kg &times; (Inches over 5ft)
                </div>
                <div id="iw-step-hamwi" style="color: var(--fg); font-size: 0.8rem; margin-top: 0.25rem;">
                  <!-- Populated dynamically -->
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Clinical Pitfalls -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Clinical Pitfalls &amp; Pharmacokinetic Origin</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Medication Dosing Origin:</strong> Devine, Robinson, and Hamwi equations were originally created for <strong>pharmacokinetic clearance calculations</strong> (calculating intravenous aminoglycoside and theophylline clearance based on extracellular fluid volume). They were never intended to represent cosmetic ideals or athletic physique goals.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Linear Scaling Flaw:</strong> Human mass naturally scales cubically ($H^3$) rather than linearly with height. Consequently, these equations tend to underestimate healthy weights for individuals over 6\'1" (185 cm) and overestimate weights for individuals under 5\'2" (157 cm).</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Bone Density &amp; Muscle Disregard:</strong> None of these formulas account for bone frame size (wrist/elbow circumference) or lean muscle tissue. A lean, drug-free natural bodybuilder at 10% body fat will almost always weigh 15% to 30% above their Devine \'ideal weight\'.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Age &amp; Sarcopenia Neglect:</strong> The equations assume a young adult reference patient. They do not account for natural age-related shifts in bone mineral density or metabolic body composition.</li>
            </ul>
          </div>
        </div>

        <script>
          let iwUnitMode = 'metric';

          window.setIWUnit = function(mode) {
            iwUnitMode = mode;
            const btnM = document.getElementById('btnIWMetric');
            const btnI = document.getElementById('btnIWImperial');
            const grpM = document.getElementById('grp-iw-h-metric');
            const grpI = document.getElementById('grp-iw-h-imperial');
            const lblW = document.getElementById('lbl-iw-weight');
            const inpW = document.getElementById('iw-weight');

            if (mode === 'metric') {
              btnM.style.background = 'rgba(59, 130, 246, 0.15)';
              btnM.style.borderColor = '#3b82f6';
              btnM.style.color = '#3b82f6';
              btnI.style.background = 'var(--surface-alt)';
              btnI.style.borderColor = 'var(--border)';
              btnI.style.color = 'var(--fg)';

              grpM.style.display = 'block';
              grpI.style.display = 'none';

              lblW.innerHTML = 'Current Weight (kg) <span style="font-weight: normal; text-transform: none; color: var(--text-muted);">(Optional for Target Delta)</span>';
              if (inpW.value) {
                inpW.value = (parseFloat(inpW.value) * 0.453592).toFixed(1);
              }
            } else {
              btnI.style.background = 'rgba(59, 130, 246, 0.15)';
              btnI.style.borderColor = '#3b82f6';
              btnI.style.color = '#3b82f6';
              btnM.style.background = 'var(--surface-alt)';
              btnM.style.borderColor = 'var(--border)';
              btnM.style.color = 'var(--fg)';

              grpM.style.display = 'none';
              grpI.style.display = 'block';

              lblW.innerHTML = 'Current Weight (lbs) <span style="font-weight: normal; text-transform: none; color: var(--text-muted);">(Optional for Target Delta)</span>';
              if (inpW.value) {
                inpW.value = (parseFloat(inpW.value) * 2.20462).toFixed(1);
              }
            }
            calcIW();
          };

          window.syncIWMetric = function() {
            const hCm = parseFloat(document.getElementById('iw-height-cm').value) || 0;
            const totalInches = hCm / 2.54;
            const ft = Math.floor(totalInches / 12);
            const inch = totalInches % 12;

            document.getElementById('iw-height-ft').value = ft;
            document.getElementById('iw-height-in').value = inch.toFixed(1);

            calcIW();
          };

          window.syncIWImperial = function() {
            const ft = parseFloat(document.getElementById('iw-height-ft').value) || 0;
            const inch = parseFloat(document.getElementById('iw-height-in').value) || 0;
            const totalInches = (ft * 12) + inch;
            const hCm = totalInches * 2.54;

            document.getElementById('iw-height-cm').value = hCm.toFixed(1);

            calcIW();
          };

          function calcIW() {
            let hCm = 175;
            let currentWeightKg = 78;

            if (iwUnitMode === 'metric') {
              hCm = parseFloat(document.getElementById('iw-height-cm').value) || 175;
              currentWeightKg = parseFloat(document.getElementById('iw-weight').value) || 0;
            } else {
              const ft = parseFloat(document.getElementById('iw-height-ft').value) || 5;
              const inch = parseFloat(document.getElementById('iw-height-in').value) || 9;
              hCm = ((ft * 12) + inch) * 2.54;
              const curW = parseFloat(document.getElementById('iw-weight').value) || 0;
              currentWeightKg = curW * 0.453592;
            }

            let isMale = true;
            const radios = document.getElementsByName('iw-gender');
            for (let i = 0; i < radios.length; i++) {
              if (radios[i].checked && radios[i].value === 'female') isMale = false;
            }

            const frame = document.getElementById('iw-frame').value;
            let frameMultiplier = 1.0;
            if (frame === 'small') frameMultiplier = 0.90;
            else if (frame === 'large') frameMultiplier = 1.10;

            const totalInches = hCm / 2.54;
            const inchesOver5Ft = Math.max(0, totalInches - 60);

            // 1. Devine Formula (1974)
            let devine = isMale ? (50.0 + (2.3 * inchesOver5Ft)) : (45.5 + (2.3 * inchesOver5Ft));
            // 2. Robinson Formula (1983)
            let robinson = isMale ? (52.0 + (1.9 * inchesOver5Ft)) : (49.0 + (1.7 * inchesOver5Ft));
            // 3. Miller Formula (1983)
            let miller = isMale ? (56.2 + (1.41 * inchesOver5Ft)) : (53.1 + (1.36 * inchesOver5Ft));
            // 4. Hamwi Formula (1964)
            let hamwi = isMale ? (48.0 + (2.7 * inchesOver5Ft)) : (45.5 + (2.2 * inchesOver5Ft));

            // Apply frame adjustment
            devine *= frameMultiplier;
            robinson *= frameMultiplier;
            miller *= frameMultiplier;
            hamwi *= frameMultiplier;

            const formulas = [devine, robinson, miller, hamwi];
            const minFormula = Math.min.apply(null, formulas);
            const maxFormula = Math.max.apply(null, formulas);
            const consensusKg = devine; // Devine is hospital baseline standard

            const hM = hCm / 100;
            const whoMinKg = 18.5 * (hM * hM);
            const whoMaxKg = 24.9 * (hM * hM);

            // DOM Updates
            if (iwUnitMode === 'metric') {
              document.getElementById('iw-consensus-val').textContent = consensusKg.toFixed(1) + ' kg';
              document.getElementById('iw-consensus-sub').textContent = (consensusKg * 2.20462).toFixed(1) + ' lbs (Devine Standard)';
              document.getElementById('iw-range-val').textContent = minFormula.toFixed(1) + ' – ' + maxFormula.toFixed(1) + ' kg';
              document.getElementById('iw-range-sub').textContent = (minFormula * 2.20462).toFixed(1) + ' – ' + (maxFormula * 2.20462).toFixed(1) + ' lbs';
              document.getElementById('iw-who-window-label').textContent = 'WHO Normal: ' + whoMinKg.toFixed(1) + ' – ' + whoMaxKg.toFixed(1) + ' kg';
              document.getElementById('iw-who-bounds').textContent = 'WHO Healthy: ' + whoMinKg.toFixed(1) + ' kg (' + (whoMinKg * 2.20462).toFixed(0) + ' lbs) – ' + whoMaxKg.toFixed(1) + ' kg (' + (whoMaxKg * 2.20462).toFixed(0) + ' lbs)';

              if (currentWeightKg > 0) {
                const deltaKg = currentWeightKg - consensusKg;
                const sign = deltaKg >= 0 ? '+' : '';
                document.getElementById('iw-delta-hero').textContent = sign + deltaKg.toFixed(1) + ' kg (' + (sign + (deltaKg * 2.20462).toFixed(1)) + ' lbs)';
                document.getElementById('iw-delta-hero').style.color = Math.abs(deltaKg) <= 3 ? '#10b981' : (deltaKg > 0 ? '#f59e0b' : '#3b82f6');
                document.getElementById('iw-delta-sub').textContent = deltaKg > 0 ? 'Above consensus target weight' : (deltaKg < 0 ? 'Below consensus target weight' : 'Exact match with consensus!');
              } else {
                document.getElementById('iw-delta-hero').textContent = '--';
                document.getElementById('iw-delta-sub').textContent = 'Enter current weight above';
              }
            } else {
              document.getElementById('iw-consensus-val').textContent = (consensusKg * 2.20462).toFixed(1) + ' lbs';
              document.getElementById('iw-consensus-sub').textContent = consensusKg.toFixed(1) + ' kg (Devine Standard)';
              document.getElementById('iw-range-val').textContent = (minFormula * 2.20462).toFixed(1) + ' – ' + (maxFormula * 2.20462).toFixed(1) + ' lbs';
              document.getElementById('iw-range-sub').textContent = minFormula.toFixed(1) + ' – ' + maxFormula.toFixed(1) + ' kg';
              document.getElementById('iw-who-window-label').textContent = 'WHO Normal: ' + (whoMinKg * 2.20462).toFixed(1) + ' – ' + (whoMaxKg * 2.20462).toFixed(1) + ' lbs';
              document.getElementById('iw-who-bounds').textContent = 'WHO Healthy: ' + (whoMinKg * 2.20462).toFixed(0) + ' lbs (' + whoMinKg.toFixed(1) + ' kg) – ' + (whoMaxKg * 2.20462).toFixed(0) + ' lbs (' + whoMaxKg.toFixed(1) + ' kg)';

              if (currentWeightKg > 0) {
                const deltaKg = currentWeightKg - consensusKg;
                const deltaLbs = deltaKg * 2.20462;
                const sign = deltaLbs >= 0 ? '+' : '';
                document.getElementById('iw-delta-hero').textContent = sign + deltaLbs.toFixed(1) + ' lbs (' + (sign + deltaKg.toFixed(1)) + ' kg)';
                document.getElementById('iw-delta-hero').style.color = Math.abs(deltaLbs) <= 7 ? '#10b981' : (deltaLbs > 0 ? '#f59e0b' : '#3b82f6');
                document.getElementById('iw-delta-sub').textContent = deltaLbs > 0 ? 'Above consensus target weight' : (deltaLbs < 0 ? 'Below consensus target weight' : 'Exact match with consensus!');
              } else {
                document.getElementById('iw-delta-hero').textContent = '--';
                document.getElementById('iw-delta-sub').textContent = 'Enter current weight above';
              }
            }

            // Update Breakdown Table Rows
            document.getElementById('iw-row-devine-kg').textContent = devine.toFixed(1) + ' kg';
            document.getElementById('iw-row-devine-lbs').textContent = (devine * 2.20462).toFixed(1) + ' lbs';
            document.getElementById('iw-row-robinson-kg').textContent = robinson.toFixed(1) + ' kg';
            document.getElementById('iw-row-robinson-lbs').textContent = (robinson * 2.20462).toFixed(1) + ' lbs';
            document.getElementById('iw-row-miller-kg').textContent = miller.toFixed(1) + ' kg';
            document.getElementById('iw-row-miller-lbs').textContent = (miller * 2.20462).toFixed(1) + ' lbs';
            document.getElementById('iw-row-hamwi-kg').textContent = hamwi.toFixed(1) + ' kg';
            document.getElementById('iw-row-hamwi-lbs').textContent = (hamwi * 2.20462).toFixed(1) + ' lbs';

            // Marker Needle Position on Spectrum Bar
            // Left 25% = < 18.5, Middle 50% = 18.5 to 24.9, Right 25% = >= 25.0
            let markerPct = 50;
            if (consensusKg < whoMinKg) {
              markerPct = Math.max(5, 25 * (consensusKg / whoMinKg));
            } else if (consensusKg > whoMaxKg) {
              markerPct = Math.min(95, 75 + (25 * Math.min(1, (consensusKg - whoMaxKg) / 20)));
            } else {
              markerPct = 25 + (50 * ((consensusKg - whoMinKg) / (whoMaxKg - whoMinKg)));
            }
            document.getElementById('iw-marker').style.left = markerPct.toFixed(1) + '%';
            document.getElementById('iw-marker-legend').firstElementChild.textContent = '▲ Pointer: Consensus Ideal Weight (' + consensusKg.toFixed(1) + ' kg / ' + (consensusKg * 2.20462).toFixed(1) + ' lbs)';

            // Worked step derivations
            const inchText = inchesOver5Ft.toFixed(1) + ' inches over 5ft';
            document.getElementById('iw-step-devine').innerHTML = (isMale ? '50.0' : '45.5') + ' kg + (2.3 &times; ' + inchesOver5Ft.toFixed(1) + ')' + (frameMultiplier !== 1.0 ? ' &times; ' + frameMultiplier : '') + ' = <strong>' + devine.toFixed(1) + ' kg (' + (devine * 2.20462).toFixed(1) + ' lbs)</strong>';
            document.getElementById('iw-step-robinson').innerHTML = (isMale ? '52.0' : '49.0') + ' kg + (' + (isMale ? '1.9' : '1.7') + ' &times; ' + inchesOver5Ft.toFixed(1) + ')' + (frameMultiplier !== 1.0 ? ' &times; ' + frameMultiplier : '') + ' = <strong>' + robinson.toFixed(1) + ' kg (' + (robinson * 2.20462).toFixed(1) + ' lbs)</strong>';
            document.getElementById('iw-step-miller').innerHTML = (isMale ? '56.2' : '53.1') + ' kg + (' + (isMale ? '1.41' : '1.36') + ' &times; ' + inchesOver5Ft.toFixed(1) + ')' + (frameMultiplier !== 1.0 ? ' &times; ' + frameMultiplier : '') + ' = <strong>' + miller.toFixed(1) + ' kg (' + (miller * 2.20462).toFixed(1) + ' lbs)</strong>';
            document.getElementById('iw-step-hamwi').innerHTML = (isMale ? '48.0' : '45.5') + ' kg + (' + (isMale ? '2.7' : '2.2') + ' &times; ' + inchesOver5Ft.toFixed(1) + ')' + (frameMultiplier !== 1.0 ? ' &times; ' + frameMultiplier : '') + ' = <strong>' + hamwi.toFixed(1) + ' kg (' + (hamwi * 2.20462).toFixed(1) + ' lbs)</strong>';
          }

          window.copyIdealWeightSummary = function() {
            const consensus = document.getElementById('iw-consensus-val').textContent;
            const consensusSub = document.getElementById('iw-consensus-sub').textContent;
            const range = document.getElementById('iw-range-val').textContent;
            const rangeSub = document.getElementById('iw-range-sub').textContent;
            const delta = document.getElementById('iw-delta-hero').textContent;
            const devine = document.getElementById('iw-row-devine-kg').textContent + ' (' + document.getElementById('iw-row-devine-lbs').textContent + ')';
            const robinson = document.getElementById('iw-row-robinson-kg').textContent + ' (' + document.getElementById('iw-row-robinson-lbs').textContent + ')';
            const miller = document.getElementById('iw-row-miller-kg').textContent + ' (' + document.getElementById('iw-row-miller-lbs').textContent + ')';
            const hamwi = document.getElementById('iw-row-hamwi-kg').textContent + ' (' + document.getElementById('iw-row-hamwi-lbs').textContent + ')';
            const who = document.getElementById('iw-who-window-label').textContent;

            const text = [
              '=== CLINICAL IDEAL BODY WEIGHT (IBW) REPORT ===',
              'Consensus Target: ' + consensus + ' (' + consensusSub + ')',
              'Clinical Formula Spread: ' + range + ' (' + rangeSub + ')',
              'Current Weight Delta: ' + delta,
              who,
              '----------------------------------------------',
              'Devine (1974): ' + devine,
              'Robinson (1983): ' + robinson,
              'Miller (1983): ' + miller,
              'Hamwi (1964): ' + hamwi,
              '----------------------------------------------',
              'Standards: Devine Clinical Pharmacokinetics & WHO BMI (18.5-24.9)',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/health/ideal-weight-calculator'
            ].join('\n');

            navigator.clipboard.writeText(text).then(function() {
              const btn = document.getElementById('btnCopyIW');
              if (btn) {
                const old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Medical IBW Report!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() { calcIW(); });
          calcIW();
        </script>
      `
    },
    {
      slug: 'caffeine-half-life-calculator',
      title: 'Caffeine Half-Life & Sleep Crash Decay Calculator (CYP1A2 Pharmacokinetics)',
      metaDesc: 'Track active caffeine levels in your bloodstream hour-by-hour using pharmacokinetic half-life and CYP1A2 metabolic speed. Find out when you can fall into deep sleep.',
      category: 'Health & Sleep',
      faq: [
        { q: 'What is the average metabolic half-life of caffeine in healthy adults?', a: 'According to clinical pharmacology data from the FDA and European Food Safety Authority (EFSA), caffeine has an average elimination half-life of 5.0 to 5.7 hours in healthy non-smoking adults. This means if you consume 200mg of caffeine at 2:00 PM, approximately 100mg remains active in your bloodstream at 7:45 PM, and ~50mg remains active at 1:30 AM.' },
        { q: 'How does the CYP1A2 enzyme determine if you are a fast or slow caffeine metabolizer?', a: 'Hepatic cytochrome P450 1A2 (CYP1A2) accounts for over 95% of caffeine metabolism in the liver. Individuals with the CYP1A2*1A variant are rapid metabolizers with half-lives as short as 3.0 to 4.0 hours, whereas those with the *1F variant are slow metabolizers whose half-lives can exceed 8.0 to 10.0 hours, making late-morning coffee disruptive to night sleep.' },
        { q: 'How does oral contraception or pregnancy affect caffeine clearance?', a: 'Estrogen and progesterone strongly inhibit hepatic CYP1A2 enzymatic activity. Women taking oral birth control pills experience an approximate doubling of caffeine half-life (averaging 8.0 to 11.0 hours). During the third trimester of pregnancy, caffeine clearance slows dramatically, extending half-life up to 15.0 hours.' },
        { q: 'At what bloodstream caffeine level is it safe to sleep without disrupting deep sleep?', a: 'Sleep medicine polysomnography indicates that bloodstream caffeine levels must drop below approximately 25mg for the brain to enter uninhibited Stage 3 Slow-Wave Deep Sleep. Even if you fall asleep with 50mg of caffeine active, adenosine receptor antagonism suppresses restorative slow-wave delta sleep by 20% to 30%, causing morning grogginess.' },
        { q: 'Why does a caffeine crash happen hours after consumption?', a: 'Caffeine does not create energy—it acts as an antagonist that competitively plugs into adenosine receptors, preventing natural sleep pressure from registering. While caffeine is bound to receptors, adenosine continues to accumulate in the brain. Once caffeine is metabolized, the accumulated flood of adenosine binds all available receptors simultaneously, causing a sudden severe energy drop known as the crash.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health &amp; Sleep</a> &gt; Caffeine Half-Life
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Caffeine Half-Life &amp; Sleep Decay Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Calculate active caffeine concentrations in your bloodstream hour-by-hour using hepatic CYP1A2 pharmacokinetic clearance equations. Pinpoint exactly when your blood levels drop below the deep sleep threshold (&lt;25 mg).
          </p>

          <div class="tool-box">
            <!-- Beverage Preset Selector -->
            <div class="field-group">
              <label class="field-label">Quick Beverage Dosage Presets</label>
              <select id="cafPreset" class="code-input" onchange="applyCafPreset()" style="font-size: 1.05rem;">
                <option value="64">Single Espresso Shot (64 mg)</option>
                <option value="95">Standard Brewed Coffee 8oz (95 mg)</option>
                <option value="160" selected>Monster / Rockstar Energy 16oz (160 mg)</option>
                <option value="200">Celsius / C4 / Ghost Pre-Workout (200 mg)</option>
                <option value="310">Starbucks Venti Cold Brew 24oz (310 mg)</option>
                <option value="390">Panera Charged Lemonade (390 mg)</option>
                <option value="40">Black Tea / Diet Coke 12oz (40 mg)</option>
                <option value="custom">Custom Dosage...</option>
              </select>
            </div>

            <!-- Primary Inputs Grid -->
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Caffeine Consumed (mg)</label>
                <input type="number" id="cafDose" class="code-input" value="160" min="1" max="1200" step="5" oninput="calcCaf()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">Time Consumed (Hours Ago)</label>
                <input type="number" id="cafHoursAgo" class="code-input" value="6" min="0" max="48" step="0.5" oninput="calcCaf()" style="font-size: 1.25rem;" />
              </div>
              <div class="field-group">
                <label class="field-label">CYP1A2 Metabolic Clearance Speed</label>
                <select id="cafMetabolism" class="code-input" onchange="calcCaf()" style="font-size: 0.95rem;">
                  <option value="3.5">Fast Metabolizer (CYP1A2*1A &bull; 3.5h Half-Life)</option>
                  <option value="5.7" selected>Normal Adult Reference (5.7h Half-Life)</option>
                  <option value="8.0">Slow Metabolizer (CYP1A2*1F &bull; 8.0h Half-Life)</option>
                  <option value="9.5">Oral Contraceptives / Estrogen (9.5h Half-Life)</option>
                  <option value="3.0">Smoker (Nicotine Enzyme Induction &bull; 3.0h)</option>
                </select>
              </div>
            </div>

            <!-- Hero Output Results Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Current Active Caffeine</div>
                <div id="cafRemaining" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #ef4444; margin: 0.25rem 0;">77.2 mg</div>
                <div id="cafPercent" style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">48.3% still circulating in blood</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Deep Sleep Readiness (&lt;25 mg)</div>
                <div id="cafSleepTime" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin: 0.25rem 0;">In 5.2 hrs</div>
                <div id="cafSleepClock" style="font-size: 0.82rem; color: var(--fg); font-family: var(--mono); font-weight: bold;">Safe Bedtime: ~11:15 PM</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Total Clearance Time (&lt;5 mg)</div>
                <div id="cafClearTime" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">In 18.5 hrs</div>
                <div style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--mono);">Full adenosine receptor restoration</div>
              </div>
            </div>

            <!-- Visual SVG Pharmacokinetic Clearance Curve -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; color: var(--fg);">
                  📉 Bloodstream Elimination Curve (24-Hour Pharmacokinetics):
                </div>
                <div style="display: flex; gap: 0.75rem; font-family: var(--mono); font-size: 0.72rem;">
                  <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 12px; height: 3px; background: #ef4444;"></span> Active mg</span>
                  <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 12px; height: 3px; background: #10b981; border-top: 2px dashed #10b981;"></span> Sleep Threshold (25mg)</span>
                </div>
              </div>
              <div style="width: 100%; height: 180px; position: relative;">
                <svg id="caf-curve-svg" width="100%" height="180" style="display: block; overflow: visible;"></svg>
              </div>
            </div>

            <!-- Hourly Decay Interval Projection Cards -->
            <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; color: var(--fg); margin-bottom: 0.75rem;">
                ⏱️ Projected Hourly Bloodstream Concentrations:
              </div>
              <div id="cafTimeline" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(85px, 1fr)); gap: 0.5rem; text-align: center; font-family: var(--mono); font-size: 0.8rem;">
                <!-- Populated dynamically -->
              </div>
            </div>

            <!-- Action Copy Button -->
            <button type="button" id="btnCopyCaf" onclick="copyCaffeineSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); transition: all 0.2s;">
              📋 Copy Caffeine Pharmacokinetics &amp; Sleep Safety Report
            </button>
          </div>

          <!-- Step-by-Step Pharmacokinetic Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 First-Order Pharmacokinetic Elimination Derivation</h3>
              <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Hepatic Clearance Model</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
              Caffeine undergoes hepatic first-order elimination via CYP1A2 enzymatic oxidation following an exponential decay curve:
            </p>
            <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">1. Exponential Elimination Equation:</strong>
                <div style="color: #3b82f6; margin-top: 0.25rem;">
                  C(t) = C<sub>0</sub> &times; (0.5)<sup>t / t<sub>1/2</sub></sup> = C<sub>0</sub> &times; e<sup>-k &times; t</sup>
                </div>
                <div id="caf-step-1" style="color: var(--text-muted); margin-top: 0.25rem; font-size: 0.78rem;">
                  Worked: 160 mg &times; 0.5<sup>(6 / 5.7)</sup> = 160 &times; 0.4822 = <strong>77.16 mg active</strong>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: var(--fg);">2. Elimination Rate Constant (k):</strong>
                <div id="caf-step-k" style="color: #3b82f6; margin-top: 0.25rem;">
                  k = ln(2) / t<sub>1/2</sub> = 0.69315 / 5.7 = <strong>0.1216 hr⁻¹</strong> (12.2% cleared per hour)
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
                <strong style="color: #10b981; font-weight: 700;">3. Time to Deep Sleep Threshold (&le; 25 mg):</strong>
                <div id="caf-step-sleep" style="color: #10b981; margin-top: 0.25rem;">
                  t = t<sub>1/2</sub> &times; log<sub>2</sub>(C<sub>0</sub> / 25) = 5.7 &times; log<sub>2</sub>(160 / 25) = 15.25 hrs total &bull; <strong>9.25 hrs remaining</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Pharmacological Traps & Sleep Traps -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Caffeine Traps &amp; Sleep Disruption Realities</h3>
            <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The "I Can Sleep Fine on Coffee" Illusion:</strong> Falling asleep easily after late espresso does NOT mean sleep is healthy. Polysomnographic EEG studies reveal that caffeine circulating in the blood suppresses slow-wave delta power (Stage N3 Deep Sleep) by <strong>20% to 30%</strong>. You lose physical restorative repair and wake up feeling chronically unrefreshed without realizing caffeine was the culprit.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Afternoon Energy Drink Compounding Trap:</strong> Drinking an energy drink (200mg) at 3 PM leaves roughly 100mg in your brain at 9 PM and 50mg at 2:30 AM. Tossing and turning causes fatigue the next morning, triggering another high-dose energy drink—locking you into a vicious cycle of artificial stimulation and chronic sleep fragmentation.</li>
              <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">CYP1A2 Oral Contraceptive Drag:</strong> Women on oral contraceptives or hormone replacement therapies experience 50% to 100% slower caffeine clearance due to estrogen downregulating CYP1A2 mRNA expression. A morning 9 AM latte can remain metabolically active past midnight.</li>
            </ul>
          </div>
        </div>

        <script>
          window.applyCafPreset = function() {
            const val = document.getElementById('cafPreset').value;
            if (val !== 'custom') {
              document.getElementById('cafDose').value = val;
              calcCaf();
            }
          };

          function renderCaffeineSVG(dose, halfLife, hoursAgo) {
            const svg = document.getElementById('caf-curve-svg');
            if (!svg) return;

            const w = svg.clientWidth || 700;
            const h = 180;
            const padL = 45;
            const padR = 25;
            const padT = 20;
            const padB = 30;

            const maxHours = 24;
            const maxDose = Math.max(dose, 200);

            // Coordinates helper
            function getX(hour) {
              return padL + (hour / maxHours) * (w - padL - padR);
            }
            function getY(val) {
              return padT + (1 - (val / maxDose)) * (h - padT - padB);
            }

            let pathD = '';
            for (let hour = 0; hour <= maxHours; hour += 0.5) {
              const conc = dose * Math.pow(0.5, hour / halfLife);
              const x = getX(hour);
              const y = getY(conc);
              pathD += (hour === 0 ? 'M ' : ' L ') + x.toFixed(1) + ' ' + y.toFixed(1);
            }

            // Sleep threshold line (25mg)
            const y25 = getY(25);
            const line25 = '<line x1="' + padL + '" y1="' + y25.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + y25.toFixed(1) + '" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,4" />';

            // Current point marker
            const curConc = dose * Math.pow(0.5, hoursAgo / halfLife);
            const curX = getX(hoursAgo);
            const curY = getY(curConc);
            const markerPoint = hoursAgo <= maxHours ? '<circle cx="' + curX.toFixed(1) + '" cy="' + curY.toFixed(1) + '" r="5" fill="#ef4444" stroke="#fff" stroke-width="2" />' : '';

            // X-axis & Y-axis labels
            let labels = '';
            [0, 6, 12, 18, 24].forEach(function(hr) {
              labels += '<text x="' + getX(hr).toFixed(1) + '" y="' + (h - 8) + '" font-family="var(--mono)" font-size="10" fill="var(--text-muted)" text-anchor="middle">+' + hr + 'h</text>';
            });
            [0, 50, 100, 200, Math.round(maxDose)].forEach(function(mg) {
              if (mg <= maxDose) {
                labels += '<text x="' + (padL - 8) + '" y="' + (getY(mg) + 3).toFixed(1) + '" font-family="var(--mono)" font-size="10" fill="var(--text-muted)" text-anchor="end">' + mg + '</text>';
              }
            });

            svg.innerHTML = 
              '<path d="' + pathD + '" fill="none" stroke="#ef4444" stroke-width="2.5" />' +
              line25 +
              markerPoint +
              labels;
          }

          function calcCaf() {
            const dose = parseFloat(document.getElementById('cafDose').value) || 0;
            const t = parseFloat(document.getElementById('cafHoursAgo').value) || 0;
            const halfLife = parseFloat(document.getElementById('cafMetabolism').value) || 5.7;

            const current = dose * Math.pow(0.5, t / halfLife);
            const pct = dose > 0 ? ((current / dose) * 100) : 0;

            document.getElementById('cafRemaining').textContent = current.toFixed(1) + ' mg';
            document.getElementById('cafPercent').textContent = pct.toFixed(1) + '% still active in bloodstream';

            const sleepThreshold = 25;
            const sleepTimeEl = document.getElementById('cafSleepTime');
            const sleepClockEl = document.getElementById('cafSleepClock');

            if (current <= sleepThreshold) {
              sleepTimeEl.textContent = 'READY NOW ✓';
              sleepTimeEl.style.color = '#10b981';
              sleepClockEl.textContent = 'Active level (' + current.toFixed(1) + 'mg) allows deep slow-wave sleep';
              sleepClockEl.style.color = '#10b981';
            } else {
              const totalHoursToSleep = halfLife * (Math.log(dose / sleepThreshold) / Math.log(2));
              const hoursRemaining = Math.max(0, totalHoursToSleep - t);
              sleepTimeEl.textContent = 'In ' + hoursRemaining.toFixed(1) + ' hrs';
              sleepTimeEl.style.color = hoursRemaining > 4 ? '#ef4444' : '#f59e0b';

              const now = new Date();
              const safeSleepDate = new Date(now.getTime() + (hoursRemaining * 3600000));
              let sH = safeSleepDate.getHours();
              const sM = safeSleepDate.getMinutes().toString().padStart(2, '0');
              const sAmpm = sH >= 12 ? 'PM' : 'AM';
              sH = sH % 12 || 12;

              sleepClockEl.textContent = 'Safe Bedtime Window: ~' + sH + ':' + sM + ' ' + sAmpm;
              sleepClockEl.style.color = 'var(--fg)';
            }

            // Total clearance to <5mg
            const totalClearanceHours = halfLife * (Math.log(dose / 5) / Math.log(2));
            const clearRemaining = Math.max(0, totalClearanceHours - t);
            document.getElementById('cafClearTime').textContent = 'In ' + clearRemaining.toFixed(1) + ' hrs';

            // Timeline cards for +0, +2, +4, +6, +8, +12, +16, +24h
            const intervals = [0, 2, 4, 6, 8, 12, 16, 24];
            let tlHtml = '';
            intervals.forEach(function(hr) {
              const lvl = dose * Math.pow(0.5, hr / halfLife);
              const isNow = Math.abs(hr - t) < 1;
              const color = lvl <= 25 ? '#10b981' : (lvl > 100 ? '#ef4444' : '#f59e0b');
              tlHtml += '<div style="background: var(--surface); border: 1px solid ' + (isNow ? '#3b82f6' : 'var(--border)') + '; padding: 0.5rem 0.25rem; border-radius: 4px;' + (isNow ? ' box-shadow: 0 0 6px rgba(59,130,246,0.5);' : '') + '">' +
                '<div style="color: var(--text-muted); font-size: 0.72rem;">+' + hr + 'h</div>' +
                '<div style="font-weight: bold; color: ' + color + '; margin-top: 0.2rem; font-size: 0.95rem;">' + lvl.toFixed(0) + 'mg</div>' +
                '<div style="font-size: 0.68rem; color: var(--text-muted);">' + (lvl <= 25 ? 'Deep Sleep' : 'Alert') + '</div>' +
              '</div>';
            });
            document.getElementById('cafTimeline').innerHTML = tlHtml;

            // Render SVG curve
            renderCaffeineSVG(dose, halfLife, t);

            // Worked steps
            const k = Math.log(2) / halfLife;
            document.getElementById('caf-step-1').innerHTML = dose + ' mg &times; 0.5<sup>(' + t + ' / ' + halfLife + ')</sup> = ' + dose + ' &times; ' + Math.pow(0.5, t / halfLife).toFixed(4) + ' = <strong>' + current.toFixed(2) + ' mg currently active</strong>';
            document.getElementById('caf-step-k').innerHTML = 'k = ln(2) / ' + halfLife + 'h = <strong>' + k.toFixed(4) + ' hr⁻¹</strong> (' + (k * 100).toFixed(1) + '% cleared hourly)';
            document.getElementById('caf-step-sleep').innerHTML = halfLife + ' &times; log₂(' + dose + ' / 25) = ' + (halfLife * (Math.log(dose / 25) / Math.log(2))).toFixed(2) + ' hrs from consumption &bull; <strong>' + Math.max(0, (halfLife * (Math.log(dose / 25) / Math.log(2))) - t).toFixed(1) + ' hrs remaining</strong>';
          }

          window.copyCaffeineSummary = function() {
            const dose = document.getElementById('cafDose').value;
            const hours = document.getElementById('cafHoursAgo').value;
            const remaining = document.getElementById('cafRemaining').textContent;
            const sleepTime = document.getElementById('cafSleepTime').textContent;
            const sleepClock = document.getElementById('cafSleepClock').textContent;
            const clearTime = document.getElementById('cafClearTime').textContent;

            const text = [
              '=== CAFFEINE PHARMACOKINETICS & SLEEP REPORT ===',
              'Initial Dose: ' + dose + ' mg (' + hours + ' hours ago)',
              'Active Circulating Caffeine: ' + remaining,
              'Deep Sleep Readiness (<25mg): ' + sleepTime + ' (' + sleepClock + ')',
              'Total Clearance (<5mg): ' + clearTime,
              '-----------------------------------------------',
              'Pharmacology standard: Hepatic CYP1A2 First-Order Elimination',
              'Timestamp: ' + new Date().toISOString(),
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/health/caffeine-half-life-calculator'
            ].join('\n');

            navigator.clipboard.writeText(text).then(function() {
              const btn = document.getElementById('btnCopyCaf');
              if (btn) {
                const old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Caffeine Sleep Report!';
                btn.style.color = '#10b981';
                setTimeout(function() { btn.innerHTML = old; btn.style.color = 'var(--fg)'; }, 2000);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', function() { calcCaf(); });
          calcCaf();
        </script>
      `
    },
    {
      slug: 'sleep-deprivation-calculator',
      title: 'Sleep Deprivation & BAC Impairment Equivalent Calculator (PVT Reaction Test)',
      metaDesc: 'How impaired is your brain from sleep deprivation? Converts consecutive hours awake into equivalent Blood Alcohol Concentration (BAC) with an interactive reaction speed test.',
      category: 'Health & Sleep',
      faq: [
        { q: 'What is the scientific link between sleep deprivation and blood alcohol concentration (BAC)?', a: 'Foundational neurobiological research by Dawson & Reid (Nature 1997) and Williamson & Feyer (2000) demonstrated that staying awake for 17 consecutive hours produces psychomotor cognitive impairment equivalent to a 0.05% BAC (the legal driving limit in most developed countries). At 24 hours of sustained wakefulness, cognitive reaction time, tracking lapses, and judgment collapse to the equivalent of a 0.10% BAC—well above the legal drunk driving threshold across all 50 US states (0.08%).' },
        { q: 'What are microsleeps and why are they fatal while driving?', a: 'A microsleep is an involuntary, temporary episode of sleep that lasts anywhere from 1 to 15 seconds. During a microsleep, your brain waves rapidly shift from beta/alpha frequencies to theta/delta slow waves, completely cutting off sensory processing. If you are driving at 65 mph (105 km/h), a 3-second microsleep means your vehicle travels over 285 feet completely unguided and blind.' },
        { q: 'Can caffeine fully reverse sleep deprivation impairment?', a: 'No. Caffeine is an adenosine receptor antagonist—it blocks adenosine from binding to its neural receptors, temporarily masking fatigue signals. However, caffeine does not clear adenosine or repair synaptic degradation. Studies show that while caffeine can improve basic vigilance for short bursts, it does not restore complex executive decision-making, emotional regulation, or prevent unpredictable microsleeps.' },
        { q: 'How is cumulative sleep debt calculated?', a: 'Cumulative sleep debt is the difference between the optimal sleep your body biologically requires (typically 7.5 to 8.5 hours per night for adults) and the actual sleep you obtained over a rolling 7-to-14-day window. If you need 8 hours but sleep 6 hours every night for a week, you have accumulated a 14-hour sleep debt. Research indicates that clearing this debt requires several consecutive nights of extended sleep.' },
        { q: 'What is the Psychomotor Vigilance Task (PVT)?', a: 'The Psychomotor Vigilance Task (PVT) is the gold-standard clinical assessment used by NASA, military aviation, and sleep laboratories to quantify neurobehavioral impairment. It measures sustained visual attention and reaction speed in milliseconds when an unpredictable stimulus appears, identifying attention lapses (>500 ms) caused by sleep pressure.' }
      ],
      body: `
        ${commonStyle}
        <style>
          .sd-metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.25rem; }
          .sd-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; text-align: center; }
          .pvt-box { background: var(--surface-alt); border: 2px dashed var(--border); border-radius: 8px; padding: 2rem 1rem; text-align: center; margin-top: 1.25rem; cursor: pointer; user-select: none; transition: all 0.15s; }
          .pvt-box.waiting { background: #ef4444; border-color: #ef4444; color: #fff; cursor: pointer; }
          .pvt-box.ready { background: #10b981; border-color: #10b981; color: #fff; cursor: pointer; }
          .bac-scale { height: 16px; border-radius: 8px; background: linear-gradient(to right, #10b981 0%, #3b82f6 20%, #f59e0b 45%, #ef4444 75%, #7f1d1d 100%); margin-top: 0.75rem; position: relative; }
          .bac-pointer { position: absolute; top: -6px; width: 4px; height: 28px; background: #fff; border: 1px solid #000; border-radius: 2px; transform: translateX(-50%); transition: left 0.2s; }
          .impairment-table { width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.82rem; margin-top: 1rem; }
          .impairment-table th, .impairment-table td { padding: 0.5rem 0.75rem; border: 1px solid var(--border); text-align: left; }
          .impairment-table th { background: var(--surface-alt); font-weight: 600; }
          .impairment-table tr.current-tier { background: rgba(239, 68, 68, 0.12); font-weight: bold; }
        </style>

        <div class="article-container" style="max-width: 960px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Sleep Deprivation Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Sleep Deprivation & BAC Impairment Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Translate continuous hours awake and cumulative sleep debt into peer-reviewed Blood Alcohol Concentration (BAC) equivalents, evaluate cognitive reaction delay, and test your alertness with the real-time Psychomotor Vigilance Task (PVT).
          </p>

          <div class="tool-box">
            <!-- Consecutive Hours Awake Slider -->
            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <label class="field-label" for="sd-range">Consecutive Hours Awake</label>
                <span id="sd-hrs-display" style="font-family: var(--mono); font-size: 1.4rem; font-weight: bold; color: #ef4444;">20 Hours Awake</span>
              </div>
              <input type="range" id="sd-range" min="8" max="72" value="20" step="1" oninput="updateSDFromSlider(this.value)" style="width: 100%; cursor: pointer;" />
              <div style="display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
                <span>8h (Normal Day)</span>
                <span>17h (0.05% BAC)</span>
                <span>24h (All-Nighter / 0.10% BAC)</span>
                <span>48h (Delirium)</span>
                <span>72h (Psychosis)</span>
              </div>
            </div>

            <!-- Time of Day & Circadian Modifier -->
            <div class="grid-inputs" style="margin-top: 1.25rem;">
              <div class="field-group">
                <label class="field-label" for="sd-time-of-day">Current Time of Day (Circadian Phase)</label>
                <select id="sd-time-of-day" class="code-input" onchange="calcSDAll()">
                  <option value="day">Daytime / Afternoon (Mild circadian alertness support)</option>
                  <option value="evening">Late Evening (10 PM - 1 AM)</option>
                  <option value="nadir" selected>Circadian Nadir (2 AM - 6 AM, Biological Sleep Window &times;2.5 Hazard)</option>
                  <option value="morning">Post-Dawn Second Wind (7 AM - 11 AM, Cortisol spike)</option>
                </select>
              </div>

              <div class="field-group">
                <label class="field-label" for="sd-debt-input">Cumulative Sleep Debt (Past 7 Days)</label>
                <select id="sd-debt-input" class="code-input" onchange="calcSDAll()">
                  <option value="0">0 Hours (Fully rested, baseline)</option>
                  <option value="4">4 Hours Debt (~30-45 min missed/night)</option>
                  <option value="8" selected>8 Hours Debt (~1 full night missing over a week)</option>
                  <option value="15">15+ Hours Debt (Severe chronic sleep restriction)</option>
                </select>
              </div>
            </div>

            <!-- Primary Metrics Dashboard -->
            <div class="sd-metric-grid">
              <div class="sd-card" style="border-top: 4px solid #ef4444;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Equivalent Blood Alcohol (BAC)</div>
                <div id="sd-bac-val" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #ef4444; margin: 0.3rem 0;">0.07% BAC</div>
                <div id="sd-drinks-equiv" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">~3.0 standard alcoholic drinks</div>
              </div>

              <div class="sd-card" style="border-top: 4px solid #f59e0b;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Reaction Speed Penalty</div>
                <div id="sd-react-val" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin: 0.3rem 0;">+45% Slower</div>
                <div id="sd-react-latency" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Estimated Latency: 360 ms (vs 240 ms)</div>
              </div>

              <div class="sd-card" style="border-top: 4px solid #8b5cf6;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Microsleep Vulnerability</div>
                <div id="sd-micro-val" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #8b5cf6; margin: 0.4rem 0;">High Hazard</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Involuntary 2-5 sec blackout risk</div>
              </div>

              <div class="sd-card" style="border-top: 4px solid #3b82f6;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Recovery Sleep Prescription</div>
                <div id="sd-recovery-val" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #3b82f6; margin: 0.4rem 0;">2 Nights (9h)</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Required to normalize vigilance</div>
              </div>
            </div>

            <!-- BAC Visual Scale Bar -->
            <div style="margin-top: 1.5rem;">
              <div style="display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.3rem;">
                <span>0.00% Baseline</span>
                <span>0.05% (Legal Limit EU/AU)</span>
                <span>0.08% (US Limit)</span>
                <span>0.10% (Severe)</span>
                <span>0.20%+ (Delirium)</span>
              </div>
              <div class="bac-scale">
                <div id="bac-pointer" class="bac-pointer" style="left: 35%;"></div>
              </div>
            </div>

            <!-- Clinical Assessment Diagnostic Box -->
            <div id="sd-clinical-box" style="margin-top: 1.5rem; background: var(--surface-alt); border-left: 3px solid #ef4444; padding: 1.1rem 1.25rem; border-radius: 0 6px 6px 0; font-size: 0.92rem; line-height: 1.6;"></div>

            <!-- Interactive Psychomotor Vigilance Task (PVT) Test -->
            <div style="margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap;">
                <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.3rem;">Clinical Psychomotor Vigilance Test (PVT)</h3>
                <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Gold-Standard Attention Assessment</span>
              </div>
              <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.5; margin-bottom: 0.75rem;">
                Test your actual reaction latency against your sleep-deprived estimate. Click the box below to arm it. When it turns <strong>GREEN</strong>, click as fast as humanly possible!
              </p>

              <div id="pvt-box" class="pvt-box" onclick="handlePVTClick()">
                <div id="pvt-text" style="font-family: var(--mono); font-size: 1.25rem; font-weight: bold;">
                  ⚡ Click Here to Start Vigilance Test
                </div>
                <div id="pvt-sub" style="font-family: var(--mono); font-size: 0.8rem; margin-top: 0.4rem; opacity: 0.8;">
                  Measures simple visual reaction time in milliseconds
                </div>
              </div>

              <div id="pvt-results" style="display: none; margin-top: 1rem; background: var(--surface-alt); border: 1px solid var(--border); padding: 0.85rem 1.2rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                <span>Measured Latency: <strong id="pvt-measured-ms" style="color: var(--fg); font-size: 1.1rem;">-</strong></span>
                <span>Estimated Fatigue Delay: <span id="pvt-expected-ms" style="color: var(--text-muted);">-</span></span>
                <span id="pvt-verdict" style="font-weight: bold;">-</span>
              </div>
            </div>

            <!-- Copy Clinical Summary Button -->
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button type="button" class="btn-sec" onclick="copySDSummary(this)" style="font-family: var(--mono); font-size: 0.85rem; padding: 0.5rem 1rem;">
                📋 Copy Diagnostic Assessment Summary
              </button>
            </div>

            <!-- Research Comparison Table -->
            <div style="margin-top: 2rem;">
              <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 0.5rem;">Dawson & Reid (1997) Peer-Reviewed Impairment Benchmarks</h3>
              <div style="overflow-x: auto;">
                <table class="impairment-table">
                  <thead>
                    <tr>
                      <th>Consecutive Hours Awake</th>
                      <th>Equivalent Blood Alcohol (BAC)</th>
                      <th>Cognitive & Motor Degradation</th>
                      <th>Driving / Operating Crash Hazard</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr id="tier-14"><td>10 – 14 Hours</td><td>0.00% BAC (Sober)</td><td>Full executive function, optimal tracking</td><td>Normal baseline risk</td></tr>
                    <tr id="tier-17"><td>17 – 19 Hours</td><td>0.05% BAC</td><td>Divided attention lapses, slower braking</td><td>2&times; crash risk (EU legal limit)</td></tr>
                    <tr id="tier-21"><td>21 – 23 Hours</td><td>0.08% BAC</td><td>Reduced peripheral vision, delayed tracking</td><td>4&times; crash risk (US legal DUI limit)</td></tr>
                    <tr id="tier-24"><td>24 – 28 Hours</td><td>0.10% BAC</td><td>Lapses in working memory, microsleep risk</td><td>6&times; crash risk (Aggravated DUI tier)</td></tr>
                    <tr id="tier-36"><td>36 – 48 Hours</td><td>0.15% – 0.18% BAC</td><td>Prefrontal cortex shutdown, microsleep clusters</td><td>Extreme hazard, cognitive disorientation</td></tr>
                    <tr id="tier-72"><td>48 – 72+ Hours</td><td>0.20%+ BAC</td><td>Visual hallucinations, paranoia, acute stress collapse</td><td>Severe neurological crisis</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <script>
          var pvtState = 'idle'; // idle, armed, ready
          var pvtArmTime = 0;
          var pvtTimer = null;

          function updateSDFromSlider(val) {
            document.getElementById('sd-hrs-display').textContent = val + ' Hours Awake';
            calcSDAll();
          }

          function calcSDAll() {
            var hrs = parseInt(document.getElementById('sd-range').value, 10);
            var circadian = document.getElementById('sd-time-of-day').value;
            var debt = parseFloat(document.getElementById('sd-debt-input').value) || 0;

            // Base BAC calculation based on Dawson & Reid (Nature 1997)
            var baseBac = 0;
            var baseReact = 0;
            var micro = 'None';
            var microColor = '#10b981';
            var clinical = '';
            var tierId = 'tier-14';

            if (hrs <= 14) {
              baseBac = 0.00;
              baseReact = 0;
              micro = 'Baseline';
              microColor = '#10b981';
              clinical = '<strong>Optimal Neurological Alertness (10-14h Awake):</strong> Normal reaction speed (~230-260 ms) and uncompromised executive motor coordination.';
              tierId = 'tier-14';
            } else if (hrs <= 17) {
              baseBac = ((hrs - 14) / 3) * 0.05;
              baseReact = Math.round((hrs - 14) * 5);
              micro = 'Low';
              microColor = '#3b82f6';
              clinical = '<strong>Mild Cognitive Fatigue (14-17h Awake):</strong> Early psychomotor slowing. Subtle lapses in divided attention during monotonous tasks.';
              tierId = 'tier-14';
            } else if (hrs <= 21) {
              baseBac = 0.05 + (((hrs - 17) / 4) * 0.03);
              baseReact = 15 + Math.round((hrs - 17) * 7);
              micro = 'Elevated Risk';
              microColor = '#f59e0b';
              clinical = '<strong>Equivalent to Legal Intoxication (0.05% - 0.08% BAC):</strong> Cognitive impairment matches or exceeds the legal driving limit in most developed countries. Reaction time is degraded by 15-35%.';
              tierId = 'tier-17';
            } else if (hrs <= 24) {
              baseBac = 0.08 + (((hrs - 21) / 3) * 0.02);
              baseReact = 43 + Math.round((hrs - 21) * 9);
              micro = 'High Hazard';
              microColor = '#ef4444';
              clinical = '<strong>All-Nighter State (0.08% - 0.10% BAC):</strong> Impairment exceeds the US legal drunk driving threshold (0.08% BAC). Sustained attention collapses, and hand-eye tracking lags significantly.';
              tierId = 'tier-21';
            } else if (hrs <= 36) {
              baseBac = 0.10 + (((hrs - 24) / 12) * 0.05);
              baseReact = 70 + Math.round((hrs - 24) * 6);
              micro = 'Severe Hazard';
              microColor = '#dc2626';
              clinical = '<strong>Severe Neurocognitive Collapse (0.10% - 0.15% BAC):</strong> High risk of sudden involuntary 2-5 second microsleeps while operating machinery or driving. Prefrontal cortex processing is severely blunted.';
              tierId = 'tier-24';
            } else if (hrs <= 48) {
              baseBac = 0.15 + (((hrs - 36) / 12) * 0.04);
              baseReact = 142;
              micro = 'CRITICAL';
              microColor = '#991b1b';
              clinical = '<strong>Acute Sensory Disorientation (0.15% - 0.19% BAC):</strong> Pronounced auditory and peripheral visual distortions, micro-amnesia, and emotional lability.';
              tierId = 'tier-36';
            } else {
              baseBac = 0.19 + Math.min(0.06, ((hrs - 48) / 24) * 0.05);
              baseReact = 180;
              micro = 'EXTREME DANGER';
              microColor = '#7f1d1d';
              clinical = '<strong>Hallucinatory & Psychotic Spectrum (0.20%+ BAC):</strong> Widespread visual hallucinations, paranoia, slurred speech, and acute biological distress.';
              tierId = 'tier-72';
            }

            // Circadian Nadir Multiplier (2 AM - 6 AM is 2.5x hazard)
            if (circadian === 'nadir' && hrs >= 16) {
              baseBac = Math.min(0.25, baseBac * 1.25);
              baseReact = Math.round(baseReact * 1.3);
              if (micro === 'Elevated Risk') micro = 'High Hazard';
              clinical += ' <span style="color:#ef4444; font-weight:600;">[Circadian Nadir Penalty: Core body temperature minimum dramatically amplifies sleep pressure and sudden blackout risk.]</span>';
            } else if (circadian === 'morning' && hrs >= 24) {
              clinical += ' <span style="color:#3b82f6;">[Morning Second Wind: Temporary cortisol surge masks subjective tiredness, though objective reaction speed remains severely depressed.]</span>';
            }

            // Sleep Debt compounding
            if (debt > 0) {
              baseBac = Math.min(0.25, baseBac + (debt * 0.003));
              baseReact += Math.round(debt * 2);
            }

            // Recovery prescription
            var totalMissedHrs = (Math.max(0, hrs - 16) * 0.5) + debt;
            var recoveryNights = Math.max(1, Math.ceil(totalMissedHrs / 4));

            // DOM Updates
            document.getElementById('sd-bac-val').textContent = baseBac.toFixed(2) + '% BAC';
            document.getElementById('sd-drinks-equiv').textContent = '~' + (baseBac / 0.022).toFixed(1) + ' standard alcoholic drinks equivalent';
            document.getElementById('sd-react-val').textContent = '+' + baseReact + '% Slower';
            var estMs = Math.round(240 * (1 + baseReact / 100));
            document.getElementById('sd-react-latency').textContent = 'Estimated Latency: ' + estMs + ' ms (vs 240 ms baseline)';

            var microEl = document.getElementById('sd-micro-val');
            microEl.textContent = micro;
            microEl.style.color = microColor;

            document.getElementById('sd-recovery-val').textContent = recoveryNights + ' Night' + (recoveryNights > 1 ? 's' : '') + ' (~9h)';
            document.getElementById('sd-clinical-box').innerHTML = clinical;

            // Visual BAC Pointer position (0.00% to 0.20% mapped to 0% to 100%)
            var pointerPct = Math.min(100, Math.max(2, (baseBac / 0.20) * 100));
            document.getElementById('bac-pointer').style.left = pointerPct + '%';

            // Highlight tier row
            var tiers = ['tier-14', 'tier-17', 'tier-21', 'tier-24', 'tier-36', 'tier-72'];
            tiers.forEach(function(t) {
              var el = document.getElementById(t);
              if (el) el.className = '';
            });
            var currentTierEl = document.getElementById(tierId);
            if (currentTierEl) currentTierEl.className = 'current-tier';
          }

          // PVT Reaction Test Implementation
          function handlePVTClick() {
            var box = document.getElementById('pvt-box');
            var text = document.getElementById('pvt-text');
            var sub = document.getElementById('pvt-sub');

            if (pvtState === 'idle') {
              pvtState = 'armed';
              box.className = 'pvt-box waiting';
              text.textContent = '⏳ Wait for Green... DO NOT CLICK YET!';
              sub.textContent = 'Keep your finger hovering on mouse or screen...';

              var delay = 1800 + Math.random() * 3200;
              pvtTimer = setTimeout(function() {
                pvtState = 'ready';
                pvtArmTime = Date.now();
                box.className = 'pvt-box ready';
                text.textContent = '🟩 CLICK NOW!';
                sub.textContent = 'TAP AS FAST AS YOU CAN!';
              }, delay);

            } else if (pvtState === 'armed') {
              // Clicked too early! False start!
              clearTimeout(pvtTimer);
              pvtState = 'idle';
              box.className = 'pvt-box';
              text.textContent = '⚠️ False Start! You clicked too early!';
              sub.textContent = 'Click here to try again. Wait until it turns GREEN.';

            } else if (pvtState === 'ready') {
              var elapsed = Date.now() - pvtArmTime;
              pvtState = 'idle';
              box.className = 'pvt-box';
              text.textContent = '⏱️ ' + elapsed + ' ms! (Click to Retest)';
              sub.textContent = 'Review your reaction score below:';

              document.getElementById('pvt-results').style.display = 'flex';
              document.getElementById('pvt-measured-ms').textContent = elapsed + ' ms';

              var hrs = parseInt(document.getElementById('sd-range').value, 10);
              var expDelay = Math.round(240 * (1 + (hrs > 14 ? (hrs - 14) * 0.05 : 0)));
              document.getElementById('pvt-expected-ms').textContent = '~' + expDelay + ' ms expected';

              var verdictEl = document.getElementById('pvt-verdict');
              if (elapsed < 230) {
                verdictEl.textContent = '⚡ Elite Alertness';
                verdictEl.style.color = '#10b981';
              } else if (elapsed < 300) {
                verdictEl.textContent = '✅ Normal Alertness';
                verdictEl.style.color = '#3b82f6';
              } else if (elapsed < 420) {
                verdictEl.textContent = '⚠️ Impaired / Slowed';
                verdictEl.style.color = '#f59e0b';
              } else {
                verdictEl.textContent = '🚨 Severe Fatigue Lapse';
                verdictEl.style.color = '#ef4444';
              }
            }
          }

          function copySDSummary(btn) {
            var hrs = document.getElementById('sd-range').value;
            var bac = document.getElementById('sd-bac-val').textContent.trim();
            var drinks = document.getElementById('sd-drinks-equiv').textContent.trim();
            var react = document.getElementById('sd-react-val').textContent.trim();
            var micro = document.getElementById('sd-micro-val').textContent.trim();
            var rec = document.getElementById('sd-recovery-val').textContent.trim();

            var summary = [
              '=== Sleep Deprivation Clinical Assessment ===',
              'Hours Awake         : ' + hrs + ' consecutive hours',
              'Equivalent BAC      : ' + bac + ' (' + drinks + ')',
              'Reaction Penalty    : ' + react,
              'Microsleep Hazard   : ' + micro,
              'Recovery Required   : ' + rec,
              'Source: Digital Tools Shed (https://digitaltoolsshed.com/health/sleep-deprivation-calculator.html)'
            ].join('\n');

            navigator.clipboard.writeText(summary).then(function() {
              var old = btn.textContent;
              btn.textContent = '✅ Assessment Copied to Clipboard!';
              btn.style.borderColor = '#10b981';
              setTimeout(function() {
                btn.textContent = old;
                btn.style.borderColor = '';
              }, 2000);
            });
          }

          document.addEventListener('DOMContentLoaded', function() { calcSDAll(); });
          calcSDAll();
        </script>
      `
    },
    {
      slug: 'adhd-task-breakdown',
      title: 'ADHD Task Paralysis & Executive Dysfunction Chunking Tool',
      metaDesc: 'Break down overwhelming chores, work projects, and emails into tiny, 2-minute dopamine-accessible micro-steps to defeat ADHD executive dysfunction.',
      category: 'ADHD & Mental Health',
      body: `
        ${commonStyle}
        <style>
          .micro-step { display: flex; align-items: flex-start; gap: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); padding: 0.85rem 1rem; border-radius: 6px; margin-bottom: 0.6rem; transition: background 0.2s; }
          .micro-step.done { opacity: 0.5; text-decoration: line-through; background: rgba(16,185,129,0.06); border-color: #10b981; }
          .step-num { font-family: var(--mono); font-size: 0.8rem; font-weight: bold; background: #3b82f6; color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
          .pill-btn { background: var(--surface-alt); border: 1px solid var(--border); padding: 0.35rem 0.75rem; border-radius: 20px; font-family: var(--mono); font-size: 0.75rem; cursor: pointer; }
          .pill-btn:hover { background: var(--surface); border-color: var(--fg); }
        </style>
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; ADHD Task Breakdown
          </nav>
          <header style="margin-bottom: 2rem;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: #3b82f6; letter-spacing: 0.1em; margin-bottom: 0.35rem;">Neurodivergent Support</div>
            <h1 style="font-family: var(--serif); font-size: 2.1rem; margin-bottom: 0.5rem;">ADHD Executive Dysfunction & Task Paralysis Breaker</h1>
            <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6;">
              When the ADHD brain sees a task like <em>"Clean bedroom"</em>, the prefrontal cortex sees a 500-step mountain and freezes. Break it down into frictionless 2-minute dopamine snacks.
            </p>
          </header>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">What task is paralyzing you right now?</label>
              <input type="text" id="adhdTaskInput" class="text-input" placeholder="e.g. Clean bedroom, Reply to boss email, File taxes, Start essay..." value="Clean bedroom" style="font-size: 1.1rem;" />
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem; align-items: center;">
              <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Quick Presets:</span>
              <button type="button" class="pill-btn" onclick="setADHDTask('Clean messy bedroom')">🧹 Clean Bedroom</button>
              <button type="button" class="pill-btn" onclick="setADHDTask('Reply to scary overdue email')">✉️ Overdue Email</button>
              <button type="button" class="pill-btn" onclick="setADHDTask('Do mountain of laundry')">🧺 Laundry</button>
              <button type="button" class="pill-btn" onclick="setADHDTask('Start writing report or essay')">📝 Write Essay</button>
              <button type="button" class="pill-btn" onclick="setADHDTask('Pay bills or paperwork')">📄 Paperwork</button>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label class="field-label">Granularity: <span id="granularityLabel" style="color: #3b82f6;">Tiny ADHD Baby Steps (Lowest Friction)</span></label>
              <input type="range" id="granularity" min="1" max="2" value="2" oninput="updateGranularity(this.value)" style="width: 100%; cursor: pointer;" />
            </div>

            <button type="button" class="btn-primary" onclick="breakdownADHDTask()" style="width: 100%; padding: 0.75rem; font-size: 1rem; cursor: pointer;">
              ⚡ Break Down Into 2-Minute Micro-Steps
            </button>

            <!-- Progress Bar -->
            <div id="adhdProgressWrap" style="display: none; margin-top: 1.5rem;">
              <div style="display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.8rem; margin-bottom: 0.35rem;">
                <span id="adhdStepCount">0 of 0 Completed</span>
                <span id="adhdPercent" style="font-weight: bold; color: #10b981;">0%</span>
              </div>
              <div style="background: var(--surface-alt); height: 8px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border);">
                <div id="adhdProgressBar" style="background: #10b981; height: 100%; width: 0%; transition: width 0.3s;"></div>
              </div>
            </div>

            <div id="adhdStepsList" style="margin-top: 1.5rem;"></div>
          </div>
        </div>

        <script>
          var adhdPresets = {
            'Clean messy bedroom': [
              'Put on comfortable shoes and play one energizing song.',
              'Grab one empty trash bag.',
              'Scan room for obvious trash only (wrappers, cans, paper) and throw in bag. Stop when bag has 5 items.',
              'Collect all cups, dishes, and water bottles and move them to the kitchen sink.',
              'Gather all clothes from floor into a single pile or hamper (do not fold yet).',
              'Straighten the bed blanket (just one quick pull across the mattress).',
              'Put 3 random desktop items where they belong.',
              'Take the trash bag out of the room. Done! Dopamine unlocked.'
            ],
            'Reply to scary overdue email': [
              'Open your email inbox, but DO NOT read other messages.',
              'Locate the scary email and open it.',
              'Read only the first two sentences to confirm the core ask.',
              'Open a blank notepad app outside of email.',
              'Write 1 raw, informal sentence of what you want to say.',
              'Rephrase into 2 polite sentences: "Apologies for the delay! Here is [the answer]. Thanks for your patience."',
              'Paste text into reply window.',
              'Take a breath and hit Send before your brain overthinks.'
            ],
            'Do mountain of laundry': [
              'Walk to the laundry pile and look at it (that is step 1).',
              'Put only socks and underwear into the washing machine.',
              'Toss in shirts and pants until machine is 3/4 full.',
              'Add detergent pod and press Start button immediately.',
              'Set a 45-minute phone alarm titled "Swap laundry or clothes mildew".',
              'When alarm rings: Swap directly to dryer and press Start.',
              'Do not worry about folding today—clean basket vs dirty basket is totally valid.'
            ],
            'Start writing report or essay': [
              'Open a fresh blank document and save it with a title.',
              'Type your name and today\\'s date at the top.',
              'Type 3 simple bullet points of things you want to discuss.',
              'Write one deliberately terrible, messy paragraph without editing.',
              'Set a 15-minute timer and promise yourself you can stop when it rings.',
              'Take a 5-minute movement break.'
            ],
            'Pay bills or paperwork': [
              'Sit at desk and drink a full glass of water.',
              'Log into bank or portal account.',
              'Look at only the single bill with the soonest due date.',
              'Click Pay / Schedule Payment for that single item.',
              'Close the tab immediately and stretch.'
            ]
          };

          function setADHDTask(task) {
            document.getElementById('adhdTaskInput').value = task;
            breakdownADHDTask();
          }

          function updateGranularity(val) {
            document.getElementById('granularityLabel').textContent = val == 2 ? 'Tiny ADHD Baby Steps (Lowest Friction)' : 'Standard Steps (3-4 Chunks)';
            breakdownADHDTask();
          }

          function breakdownADHDTask() {
            var input = document.getElementById('adhdTaskInput').value.trim();
            if (!input) return;

            var steps = [];
            // Check preset match
            for (var k in adhdPresets) {
              if (input.toLowerCase().includes(k.toLowerCase().split(' ')[0])) {
                steps = adhdPresets[k];
                break;
              }
            }

            // Fallback dynamic generator
            if (!steps || steps.length === 0) {
              steps = [
                'Put on comfortable headphones with lo-fi or brown noise.',
                'Clear a 1-foot square radius of space where you are standing/sitting.',
                'Open or gather the primary tool needed for "' + input + '".',
                'Do the smallest, easiest 60-second action of the task.',
                'Pause, celebrate that momentum has started, and do 2 more minutes.',
                'Check off completion or take a 3-minute breather.'
              ];
            }

            var gran = parseInt(document.getElementById('granularity').value, 10);
            if (gran === 1 && steps.length > 4) {
              // Condense steps
              var condensed = [];
              for (var i = 0; i < steps.length; i += 2) {
                condensed.push(steps[i] + (steps[i+1] ? ' ' + steps[i+1] : ''));
              }
              steps = condensed;
            }

            var listHtml = '';
            steps.forEach(function(s, idx) {
              listHtml += '<div class="micro-step" id="mstep_' + idx + '" onclick="toggleADHDStep(' + idx + ', ' + steps.length + ')">' +
                '<div class="step-num" id="snum_' + idx + '">' + (idx + 1) + '</div>' +
                '<div style="font-size: 0.95rem; line-height: 1.5; color: var(--fg); cursor: pointer; flex: 1;">' + s + '</div>' +
              '</div>';
            });

            document.getElementById('adhdStepsList').innerHTML = listHtml;
            document.getElementById('adhdProgressWrap').style.display = 'block';
            updateADHDProgress(steps.length);
          }

          function toggleADHDStep(idx, total) {
            var el = document.getElementById('mstep_' + idx);
            el.classList.toggle('done');
            var num = document.getElementById('snum_' + idx);
            if (el.classList.contains('done')) {
              num.innerHTML = '✓';
              num.style.background = '#10b981';
            } else {
              num.innerHTML = (idx + 1);
              num.style.background = '#3b82f6';
            }
            updateADHDProgress(total);
          }

          function updateADHDProgress(total) {
            var doneCount = document.querySelectorAll('.micro-step.done').length;
            var pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
            document.getElementById('adhdStepCount').textContent = doneCount + ' of ' + total + ' Completed';
            document.getElementById('adhdPercent').textContent = pct + '%';
            document.getElementById('adhdProgressBar').style.width = pct + '%';
          }

          document.addEventListener('DOMContentLoaded', breakdownADHDTask);
        </script>
      `
    },
    {
      slug: 'cbt-thought-challenger',
      title: 'CBT Thought Challenger & Cognitive Distortion Diary',
      metaDesc: 'Interactive Cognitive Behavioral Therapy (CBT) thought record. Identify automatic negative thoughts, decode cognitive distortions, and write rational reframes.',
      category: 'Therapy & CBT',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; CBT Thought Challenger
          </nav>
          <header style="margin-bottom: 2rem;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: #10b981; letter-spacing: 0.1em; margin-bottom: 0.35rem;">Evidence-Based Psychotherapy</div>
            <h1 style="font-family: var(--serif); font-size: 2.1rem; margin-bottom: 0.5rem;">CBT Thought Challenger & Distortion Diary</h1>
            <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6;">
              Feelings are not facts. Use the clinical Cognitive Behavioral Therapy (CBT) thought record to put catastrophic thoughts on trial and generate balanced, rational reframes.
            </p>
          </header>

          <div class="tool-box">
            <!-- Step 1 -->
            <div class="field-group">
              <label class="field-label">Step 1: The Automatic Negative Thought (ANT)</label>
              <textarea id="cbtThought" class="code-input" style="height: 75px; resize: vertical;" placeholder="e.g. I made a mistake in that meeting, so everyone thinks I'm incompetent and I'm going to get fired..."></textarea>
            </div>

            <!-- Step 2 -->
            <div class="field-group">
              <label class="field-label">Step 2: Identify Cognitive Distortions</label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; font-size: 0.85rem; color: var(--fg);">
                <label><input type="checkbox" name="cd" value="Catastrophizing"> 🌪️ Catastrophizing (Worst case)</label>
                <label><input type="checkbox" name="cd" value="All-or-Nothing"> ⚖️ All-or-Nothing / Perfectionism</label>
                <label><input type="checkbox" name="cd" value="Mind Reading"> 🧠 Mind Reading ("They hate me")</label>
                <label><input type="checkbox" name="cd" value="Emotional Reasoning"> 💔 Emotional Reasoning ("I feel it, so it's true")</label>
                <label><input type="checkbox" name="cd" value="Fortune Telling"> 🔮 Fortune Telling (Predicting doom)</label>
                <label><input type="checkbox" name="cd" value="Should Statements"> 📌 "Should" Statements (Guilt)</label>
              </div>
            </div>

            <!-- Step 3 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
              <div>
                <label class="field-label" style="color: #ef4444;">Evidence FOR the thought</label>
                <textarea id="cbtFor" class="code-input" style="height: 80px; resize: vertical;" placeholder="Factual data supporting it (not feelings)..."></textarea>
              </div>
              <div>
                <label class="field-label" style="color: #10b981;">Evidence AGAINST the thought</label>
                <textarea id="cbtAgainst" class="code-input" style="height: 80px; resize: vertical;" placeholder="Past successes, counter-examples, alternative explanations..."></textarea>
              </div>
            </div>

            <!-- Step 4 -->
            <button type="button" class="btn-primary" onclick="generateCBTReframe()" style="width: 100%; padding: 0.75rem; font-size: 1rem; cursor: pointer;">
              ⚖️ Synthesize Balanced Rational Reframe
            </button>

            <!-- Reframe Card -->
            <div id="cbtResultCard" style="display: none; margin-top: 1.5rem; background: var(--surface-alt); border-left: 4px solid #10b981; padding: 1.25rem; border-radius: 0 6px 6px 0;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: #10b981; font-weight: bold; margin-bottom: 0.35rem;">Balanced Cognitive Reframe</div>
              <div id="cbtReframeText" style="font-size: 1.05rem; line-height: 1.6; color: var(--fg); font-family: var(--serif);"></div>
              <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <button type="button" class="btn-sec" onclick="saveCBTToLocal()" style="font-size: 0.8rem; cursor: pointer;">💾 Save to Thought Diary</button>
              </div>
            </div>
          </div>
        </div>

        <script>
          function generateCBTReframe() {
            var thought = document.getElementById('cbtThought').value.trim();
            if (!thought) return;

            var checked = [];
            document.querySelectorAll('input[name="cd"]:checked').forEach(function(c) { checked.push(c.value); });
            var against = document.getElementById('cbtAgainst').value.trim();

            var reframe = 'While I notice the thought <em>"' + thought + '"</em>, feelings are not definitive facts. ';
            if (checked.length > 0) {
              reframe += 'My brain is currently engaged in <strong>' + checked.join(', ') + '</strong>. ';
            }
            if (against) {
              reframe += 'Crucially, the empirical evidence shows that ' + against + '. ';
            } else {
              reframe += 'A single awkward moment or mistake does not define my competence. Most people are focused on their own concerns rather than judging me. ';
            }
            reframe += 'I can tolerate this discomfort, breathe, and focus on the next actionable step in front of me.';

            document.getElementById('cbtReframeText').innerHTML = reframe;
            document.getElementById('cbtResultCard').style.display = 'block';
          }

          function saveCBTToLocal() {
            var thought = document.getElementById('cbtThought').value.trim();
            var reframe = document.getElementById('cbtReframeText').innerText;
            if (!thought) return;

            var history = JSON.parse(localStorage.getItem('cbt_diary') || '[]');
            history.push({ date: new Date().toLocaleDateString(), thought: thought, reframe: reframe });
            localStorage.setItem('cbt_diary', JSON.stringify(history));
            alert('Saved to your private browser thought diary!');
          }
        </script>
      `
    },
    {
      slug: 'box-breathing-pacer',
      title: 'Box Breathing & Vagus Nerve Pacer (Navy SEAL & Huberman Sigh)',
      metaDesc: 'Interactive somatic breath pacer with visual expanding guide and audio chime. Features Navy SEAL 4-4-4-4 Box Breathing and Huberman Physiological Sigh.',
      category: 'Therapy & Somatics',
      body: `
        ${commonStyle}
        <style>
          .pacer-circle { width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.05) 70%); border: 3px solid #3b82f6; margin: 2rem auto; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: transform 4s ease-in-out, border-color 0.5s; box-shadow: 0 0 25px rgba(59,130,246,0.2); }
          .pacer-label { font-family: var(--serif); font-size: 1.4rem; font-weight: bold; color: var(--fg); }
          .pacer-counter { font-family: var(--mono); font-size: 1.8rem; color: #3b82f6; margin-top: 0.25rem; }
        </style>
        <div class="article-container" style="max-width: 900px; text-align: center;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted); text-align: left;">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Box Breathing Pacer
          </nav>
          <header style="margin-bottom: 1.5rem;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: #3b82f6; letter-spacing: 0.1em; margin-bottom: 0.35rem;">Somatic Downregulation</div>
            <h1 style="font-family: var(--serif); font-size: 2.1rem; margin-bottom: 0.5rem;">Box Breathing & Vagus Nerve Somatic Pacer</h1>
            <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; max-width: 650px; margin: 0 auto;">
              Stimulate the vagus nerve and slow heart rate in under 2 minutes. Select a clinical breathing cadence and follow the expanding circle.
            </p>
          </header>

          <div class="tool-box" style="text-align: center;">
            <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.5rem;">
              <button type="button" class="btn-sec" id="btn-mode-box" onclick="setBreathMode('box')" style="border-color: #3b82f6; font-weight: bold;">Navy SEAL Box (4-4-4-4)</button>
              <button type="button" class="btn-sec" id="btn-mode-sigh" onclick="setBreathMode('sigh')">Huberman Physiological Sigh</button>
              <button type="button" class="btn-sec" id="btn-mode-478" onclick="setBreathMode('478')">Sleep Cadence (4-7-8)</button>
            </div>

            <div id="pacerCircle" class="pacer-circle">
              <div id="pacerLabel" class="pacer-label">Ready</div>
              <div id="pacerCounter" class="pacer-counter">4</div>
            </div>

            <div style="margin-top: 1.5rem;">
              <button type="button" class="btn-primary" id="btnPacerToggle" onclick="togglePacer()" style="padding: 0.75rem 2rem; font-size: 1.1rem; cursor: pointer;">
                ▶ Start Breathing Pacer
              </button>
            </div>
          </div>
        </div>

        <script>
          var curMode = 'box';
          var isRunning = false;
          var pacerTimer = null;
          var stepIdx = 0;
          var secLeft = 4;

          var modes = {
            'box': [
              { label: 'Inhale', sec: 4, scale: 1.4, color: '#3b82f6' },
              { label: 'Hold', sec: 4, scale: 1.4, color: '#f59e0b' },
              { label: 'Exhale', sec: 4, scale: 0.8, color: '#10b981' },
              { label: 'Hold', sec: 4, scale: 0.8, color: '#6b7280' }
            ],
            'sigh': [
              { label: 'Deep Inhale', sec: 3, scale: 1.3, color: '#3b82f6' },
              { label: 'Sniff Inhale', sec: 1, scale: 1.5, color: '#6366f1' },
              { label: 'Slow Mouth Exhale', sec: 6, scale: 0.75, color: '#10b981' }
            ],
            '478': [
              { label: 'Inhale Nose', sec: 4, scale: 1.4, color: '#3b82f6' },
              { label: 'Hold Breath', sec: 7, scale: 1.4, color: '#f59e0b' },
              { label: 'Exhale Mouth', sec: 8, scale: 0.75, color: '#10b981' }
            ]
          };

          function setBreathMode(m) {
            curMode = m;
            document.querySelectorAll('.btn-sec').forEach(function(b) { b.style.borderColor = 'var(--border)'; b.style.fontWeight = 'normal'; });
            document.getElementById('btn-mode-' + m).style.borderColor = '#3b82f6';
            document.getElementById('btn-mode-' + m).style.fontWeight = 'bold';
            if (isRunning) togglePacer();
            resetPacer();
          }

          function resetPacer() {
            var circle = document.getElementById('pacerCircle');
            circle.style.transform = 'scale(1)';
            circle.style.borderColor = '#3b82f6';
            document.getElementById('pacerLabel').textContent = 'Ready';
            document.getElementById('pacerCounter').textContent = modes[curMode][0].sec;
          }

          function togglePacer() {
            isRunning = !isRunning;
            var btn = document.getElementById('btnPacerToggle');
            if (isRunning) {
              btn.textContent = '⏹ Stop Pacer';
              stepIdx = 0;
              runStep();
            } else {
              btn.textContent = '▶ Start Breathing Pacer';
              clearTimeout(pacerTimer);
              resetPacer();
            }
          }

          function runStep() {
            if (!isRunning) return;
            var seq = modes[curMode];
            var step = seq[stepIdx];
            secLeft = step.sec;

            var circle = document.getElementById('pacerCircle');
            circle.style.transition = 'transform ' + step.sec + 's ease-in-out, border-color 0.5s';
            circle.style.transform = 'scale(' + step.scale + ')';
            circle.style.borderColor = step.color;
            document.getElementById('pacerLabel').textContent = step.label;

            tickSecond();
          }

          function tickSecond() {
            if (!isRunning) return;
            document.getElementById('pacerCounter').textContent = secLeft;
            if (secLeft > 0) {
              secLeft--;
              pacerTimer = setTimeout(tickSecond, 1000);
            } else {
              var seq = modes[curMode];
              stepIdx = (stepIdx + 1) % seq.length;
              runStep();
            }
          }
        </script>
      `
    },
    {
      slug: 'adhd-time-blindness-calculator',
      title: 'ADHD Time Blindness & Departure Buffer Calculator',
      metaDesc: 'Calculates the real time required for tasks and departures by factoring in ADHD transition tax, distraction buffers, and the prefrontal planning fallacy.',
      category: 'ADHD & Focus',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Time Blindness Calculator
          </nav>
          <header style="margin-bottom: 2rem;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: #f59e0b; letter-spacing: 0.1em; margin-bottom: 0.35rem;">Neurobiology of Time Perception</div>
            <h1 style="font-family: var(--serif); font-size: 2.1rem; margin-bottom: 0.5rem;">ADHD Time Blindness & Departure Buffer Calculator</h1>
            <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6;">
              ADHD brains only perceive two time zones: <strong>"NOW"</strong> and <strong>"NOT NOW"</strong>. We assume an appointment at 2:00 PM means we start putting shoes on at 1:55 PM. Calculate the hidden neurodivergent time taxes.
            </p>
          </header>

          <div class="tool-box">
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Target Arrival / Appointment Time</label>
                <input type="time" id="tbEventTime" class="text-input" value="14:00" oninput="calcTimeBlindness()" />
              </div>
              <div class="field-group">
                <label class="field-label">Estimated Transit / Drive Time (Mins)</label>
                <input type="number" id="tbTransit" class="text-input" value="25" min="0" oninput="calcTimeBlindness()" />
              </div>
            </div>

            <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; margin: 1.25rem 0;">
              <h4 style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">Enable ADHD Friction Buffers:</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; font-size: 0.85rem;">
                <label><input type="checkbox" id="tax-transition" checked onchange="calcTimeBlindness()"> 🧠 Transition Tax (stopping current activity): +15 min</label>
                <label><input type="checkbox" id="tax-items" checked onchange="calcTimeBlindness()"> 🔑 Lost Keys / Phone / Shoes search: +10 min</label>
                <label><input type="checkbox" id="tax-parking" checked onchange="calcTimeBlindness()"> 🚗 Parking & walking into building: +10 min</label>
              </div>
            </div>

            <div class="result-card" style="border-top: 4px solid #f59e0b;">
              <div class="field-label">When You MUST Start Getting Ready:</div>
              <div id="tbStartTime" class="result-val" style="color: #f59e0b;">13:00 (1:00 PM)</div>
              <div id="tbBreakdown" style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.5;"></div>
            </div>
          </div>
        </div>

        <script>
          function calcTimeBlindness() {
            var timeStr = document.getElementById('tbEventTime').value;
            if (!timeStr) return;
            var parts = timeStr.split(':');
            var targetMins = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);

            var transit = parseInt(document.getElementById('tbTransit').value, 10) || 0;
            var buffer = 0;
            if (document.getElementById('tax-transition').checked) buffer += 15;
            if (document.getElementById('tax-items').checked) buffer += 10;
            if (document.getElementById('tax-parking').checked) buffer += 10;

            var totalPrepMins = transit + buffer;
            var startMins = targetMins - totalPrepMins;
            if (startMins < 0) startMins += 1440;

            var sH = Math.floor(startMins / 60);
            var sM = startMins % 60;
            var sAmpm = sH >= 12 ? 'PM' : 'AM';
            var sH12 = sH % 12 || 12;
            var formatted = (sH < 10 ? '0' : '') + sH + ':' + (sM < 10 ? '0' : '') + sM + ' (' + sH12 + ':' + (sM < 10 ? '0' : '') + sM + ' ' + sAmpm + ')';

            document.getElementById('tbStartTime').textContent = formatted;
            document.getElementById('tbBreakdown').innerHTML = 'Total prep & travel required: <strong>' + totalPrepMins + ' minutes</strong> (' + transit + 'm transit + ' + buffer + 'm ADHD friction buffer). Setting your alarm for this time eliminates pre-departure panic.';
          }

          document.addEventListener('DOMContentLoaded', calcTimeBlindness);
        </script>
      `
    },
    {
      slug: 'adhd-dopamine-menu',
      title: 'ADHD Dopamine Menu & Stimulus Selector',
      metaDesc: 'Interactive Dopamine Menu planner. Organize appetizers, entrees, sides, and desserts to stimulate prefrontal dopamine and break task paralysis.',
      category: 'ADHD & Focus',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Dopamine Menu
          </nav>
          <header style="margin-bottom: 2rem;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: #10b981; letter-spacing: 0.1em; margin-bottom: 0.35rem;">Prefrontal Cortex Scaffolding</div>
            <h1 style="font-family: var(--serif); font-size: 2.1rem; margin-bottom: 0.5rem;">The ADHD Dopamine Menu & Paralysis Unsticker</h1>
            <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6;">
              When low on dopamine, ADHD brains default to high-stimulation traps (hours of doomscrolling). Use Jessica McCabe's "Dopamine Menu" to intentionally order restorative brain fuel.
            </p>
          </header>

          <div class="tool-box">
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <button type="button" class="btn-primary" onclick="randomDopamineSnack()" style="padding: 0.75rem 1.5rem; font-size: 1rem; cursor: pointer;">
                🎰 Spin Dopamine Roulette (Pick for Me!)
              </button>
              <div id="rouletteResult" style="display: none; margin-top: 1rem; background: var(--surface-alt); border: 2px dashed #10b981; padding: 1rem; border-radius: 6px; font-weight: bold; color: var(--fg); font-size: 1.1rem;"></div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
              <!-- Appetizers -->
              <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 3px solid #3b82f6; padding: 1rem; border-radius: 6px;">
                <h4 style="font-family: var(--mono); font-size: 0.85rem; color: #3b82f6; text-transform: uppercase; margin-bottom: 0.5rem;">🥗 Appetizers (5-10 Min Quick Hits)</h4>
                <ul style="font-size: 0.85rem; line-height: 1.6; padding-left: 1.2rem; color: var(--fg); margin: 0;">
                  <li>Splash face with freezing cold ice water</li>
                  <li>Do 15 bodyweight squats or jumping jacks</li>
                  <li>Step outside and look at natural daylight</li>
                  <li>Drink a full glass of cold lemon water</li>
                  <li>Put on 1 high-BPM favorite song</li>
                </ul>
              </div>

              <!-- Entrees -->
              <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 3px solid #10b981; padding: 1rem; border-radius: 6px;">
                <h4 style="font-family: var(--mono); font-size: 0.85rem; color: #10b981; text-transform: uppercase; margin-bottom: 0.5rem;">🍲 Entrees (Deep Flow Activities)</h4>
                <ul style="font-size: 0.85rem; line-height: 1.6; padding-left: 1.2rem; color: var(--fg); margin: 0;">
                  <li>Hyperfocus coding or creative design</li>
                  <li>Playing a musical instrument</li>
                  <li>Cooking an elaborate healthy meal</li>
                  <li>Gym / heavy lifting session</li>
                  <li>Writing or journaling passion project</li>
                </ul>
              </div>

              <!-- Sides -->
              <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 3px solid #f59e0b; padding: 1rem; border-radius: 6px;">
                <h4 style="font-family: var(--mono); font-size: 0.85rem; color: #f59e0b; text-transform: uppercase; margin-bottom: 0.5rem;">🍟 Sides (Add to Boring Chores)</h4>
                <ul style="font-size: 0.85rem; line-height: 1.6; padding-left: 1.2rem; color: var(--fg); margin: 0;">
                  <li>Playing brown noise or video game OSTs</li>
                  <li>Walking on a treadmill pad while on calls</li>
                  <li>Using a mechanical keyboard or fidget toy</li>
                  <li>Body doubling (study stream on Discord)</li>
                  <li>Chewing strong peppermint gum</li>
                </ul>
              </div>

              <!-- Desserts -->
              <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 3px solid #ef4444; padding: 1rem; border-radius: 6px;">
                <h4 style="font-family: var(--mono); font-size: 0.85rem; color: #ef4444; text-transform: uppercase; margin-bottom: 0.5rem;">🍰 Desserts (Consume with Boundaries)</h4>
                <ul style="font-size: 0.85rem; line-height: 1.6; padding-left: 1.2rem; color: var(--fg); margin: 0;">
                  <li>Endless short-form video feeds</li>
                  <li>Video game binge sessions</li>
                  <li>Late-night Reddit rabbit holes</li>
                  <li>Online window shopping carts</li>
                  <li><em>Rule: Set a 20-min timer before partaking!</em></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <script>
          var quickSnacks = [
            'Splash face with freezing cold water for 15 seconds.',
            'Step outside barefoot on grass or stand in direct sunlight for 2 minutes.',
            'Drink one large glass of cold water with a pinch of salt.',
            'Do 15 quick air squats or arm circles right now.',
            'Put on your favorite 3-minute hype song and pace the room.',
            'Stretch your hamstrings and take 3 physiological sighs.',
            'Chew a fresh piece of strong peppermint gum.'
          ];

          function randomDopamineSnack() {
            var r = quickSnacks[Math.floor(Math.random() * quickSnacks.length)];
            var el = document.getElementById('rouletteResult');
            el.style.display = 'block';
            el.innerHTML = '⚡ YOUR 2-MINUTE DOPAMINE MISSION:<br><span style="color: #3b82f6;">' + r + '</span>';
          }
        </script>
      `
    },
    {
      slug: 'sensory-grounding-decompressor',
      title: 'Sensory Overload & 5-4-3-2-1 Somatic Grounding Tool',
      metaDesc: 'Interactive 5-4-3-2-1 sensory grounding exercise and burnout decompression checklist for neurodivergent sensory overload and panic spikes.',
      category: 'Therapy & Somatics',
      body: `
        ${commonStyle}
        <style>
          .grounding-step { background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; margin-bottom: 1rem; }
          .ground-title { font-family: var(--serif); font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
        </style>
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Sensory Grounding
          </nav>
          <header style="margin-bottom: 2rem;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: #8b5cf6; letter-spacing: 0.1em; margin-bottom: 0.35rem;">Autistic & ADHD Sensory Care</div>
            <h1 style="font-family: var(--serif); font-size: 2.1rem; margin-bottom: 0.5rem;">Sensory Overload & 5-4-3-2-1 Grounding Decompressor</h1>
            <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6;">
              When the nervous system enters sensory overload, cognitive bandwidth shuts down. Anchor yourself back into physical safety using this step-by-step sensory grounding sequence.
            </p>
          </header>

          <div class="tool-box">
            <!-- 5 SEE -->
            <div class="grounding-step" style="border-left: 4px solid #3b82f6;">
              <div class="ground-title" style="color: #3b82f6;">👁️ 5 Things You Can SEE</div>
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.75rem;">Look around the room. Name 5 specific details (e.g. a wooden grain, a patch of light, a shadow, a book spine):</p>
              <input type="text" class="text-input" placeholder="Type or mentally name 5 objects you see..." />
            </div>

            <!-- 4 TOUCH -->
            <div class="grounding-step" style="border-left: 4px solid #10b981;">
              <div class="ground-title" style="color: #10b981;">✋ 4 Things You Can TOUCH</div>
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.75rem;">Physically touch them right now: the texture of your shirt, the cool desk surface, your hair, the floor under your feet:</p>
              <input type="text" class="text-input" placeholder="Feel 4 tactile sensations..." />
            </div>

            <!-- 3 HEAR -->
            <div class="grounding-step" style="border-left: 4px solid #f59e0b;">
              <div class="ground-title" style="color: #f59e0b;">👂 3 Things You Can HEAR</div>
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.75rem;">Listen past your thoughts: computer fan whirr, distant cars, a clock ticking, your own breath:</p>
              <input type="text" class="text-input" placeholder="Listen for 3 background sounds..." />
            </div>

            <!-- 2 SMELL -->
            <div class="grounding-step" style="border-left: 4px solid #8b5cf6;">
              <div class="ground-title" style="color: #8b5cf6;">👃 2 Things You Can SMELL</div>
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.75rem;">Coffee, fresh air, wood, fabric of your sleeve:</p>
              <input type="text" class="text-input" placeholder="Notice 2 scents..." />
            </div>

            <!-- 1 TASTE -->
            <div class="grounding-step" style="border-left: 4px solid #ec4899;">
              <div class="ground-title" style="color: #ec4899;">👅 1 Thing You Can TASTE</div>
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.75rem;">A sip of cool water, lingering mint, or simply the roof of your mouth:</p>
              <input type="text" class="text-input" placeholder="Notice 1 taste..." />
            </div>

            <div style="background: rgba(16,185,129,0.08); border: 1px solid #10b981; padding: 1.25rem; border-radius: 6px; text-align: center; margin-top: 1.5rem;">
              <div style="font-family: var(--serif); font-size: 1.2rem; font-weight: bold; color: #10b981;">You Are Safe in This Physical Room</div>
              <p style="font-size: 0.9rem; color: var(--fg); margin: 0.5rem 0 0; line-height: 1.5;">
                The panic was an alarm bell in your brain, not a physical predator. Unclench your jaw, drop your shoulders away from your ears, and take one slow, full breath.
              </p>
            </div>
          </div>
        </div>
      `
    },
    {
      slug: 'adhd-screener',
      title: 'Adult ADHD Symptom Screener (WHO ASRS-v1.1 Checklist)',
      metaDesc: 'Interactive World Health Organization Adult ADHD Self-Report Scale (ASRS-v1.1). Screens for inattention and hyperactivity with printable clinical summary.',
      category: 'ADHD Assessment',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; ADHD Symptom Screener
          </nav>
          <header style="margin-bottom: 2rem;">
            <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: #3b82f6; letter-spacing: 0.1em; margin-bottom: 0.35rem;">Validated Clinical Screener</div>
            <h1 style="font-family: var(--serif); font-size: 2.1rem; margin-bottom: 0.5rem;">Adult ADHD Symptom Screener (WHO ASRS-v1.1)</h1>
            <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6;">
              The official World Health Organization 6-question Part A symptom screener for adult Attention-Deficit/Hyperactivity Disorder. Check your responses against clinical cutoffs.
            </p>
          </header>

          <div class="tool-box">
            <form id="asrsForm" onchange="calcASRS()">
              
              <!-- Q1 -->
              <div style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1.25rem;">
                <label style="font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 0.5rem;">1. How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?</label>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; font-size: 0.85rem;">
                  <label><input type="radio" name="asrs1" value="0"> Never</label>
                  <label><input type="radio" name="asrs1" value="0"> Rarely</label>
                  <label><input type="radio" name="asrs1" value="1"> Sometimes</label>
                  <label><input type="radio" name="asrs1" value="1"> Often</label>
                  <label><input type="radio" name="asrs1" value="1"> Very Often</label>
                </div>
              </div>

              <!-- Q2 -->
              <div style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1.25rem;">
                <label style="font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 0.5rem;">2. How often do you have difficulty getting things in order when you have to do a task that requires organization?</label>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; font-size: 0.85rem;">
                  <label><input type="radio" name="asrs2" value="0"> Never</label>
                  <label><input type="radio" name="asrs2" value="0"> Rarely</label>
                  <label><input type="radio" name="asrs2" value="1"> Sometimes</label>
                  <label><input type="radio" name="asrs2" value="1"> Often</label>
                  <label><input type="radio" name="asrs2" value="1"> Very Often</label>
                </div>
              </div>

              <!-- Q3 -->
              <div style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1.25rem;">
                <label style="font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 0.5rem;">3. How often do you have problems remembering appointments or obligations?</label>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; font-size: 0.85rem;">
                  <label><input type="radio" name="asrs3" value="0"> Never</label>
                  <label><input type="radio" name="asrs3" value="0"> Rarely</label>
                  <label><input type="radio" name="asrs3" value="1"> Sometimes</label>
                  <label><input type="radio" name="asrs3" value="1"> Often</label>
                  <label><input type="radio" name="asrs3" value="1"> Very Often</label>
                </div>
              </div>

              <!-- Q4 -->
              <div style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1.25rem;">
                <label style="font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 0.5rem;">4. When you have a task that requires a lot of thought, how often do you avoid or delay getting started?</label>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; font-size: 0.85rem;">
                  <label><input type="radio" name="asrs4" value="0"> Never</label>
                  <label><input type="radio" name="asrs4" value="0"> Rarely</label>
                  <label><input type="radio" name="asrs4" value="0"> Sometimes</label>
                  <label><input type="radio" name="asrs4" value="1"> Often</label>
                  <label><input type="radio" name="asrs4" value="1"> Very Often</label>
                </div>
              </div>

              <!-- Q5 -->
              <div style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1.25rem;">
                <label style="font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 0.5rem;">5. How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?</label>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; font-size: 0.85rem;">
                  <label><input type="radio" name="asrs5" value="0"> Never</label>
                  <label><input type="radio" name="asrs5" value="0"> Rarely</label>
                  <label><input type="radio" name="asrs5" value="0"> Sometimes</label>
                  <label><input type="radio" name="asrs5" value="1"> Often</label>
                  <label><input type="radio" name="asrs5" value="1"> Very Often</label>
                </div>
              </div>

              <!-- Q6 -->
              <div style="margin-bottom: 1.5rem;">
                <label style="font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 0.5rem;">6. How often do you feel overly active and compelled to do things, like you were driven by a motor?</label>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; font-size: 0.85rem;">
                  <label><input type="radio" name="asrs6" value="0"> Never</label>
                  <label><input type="radio" name="asrs6" value="0"> Rarely</label>
                  <label><input type="radio" name="asrs6" value="0"> Sometimes</label>
                  <label><input type="radio" name="asrs6" value="1"> Often</label>
                  <label><input type="radio" name="asrs6" value="1"> Very Often</label>
                </div>
              </div>

              <div id="asrsResult" style="display: none; background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">WHO ASRS Part A Result</div>
                <div id="asrsScore" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; margin: 0.25rem 0;">4 of 6 Significant</div>
                <div id="asrsVerdict" style="font-size: 1.05rem; font-weight: bold; margin-bottom: 0.5rem;"></div>
                <p id="asrsExplanation" style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; max-width: 650px; margin: 0 auto;"></p>
                <div style="margin-top: 1rem;">
                  <button type="button" class="btn-sec" onclick="window.print()" style="cursor: pointer;">🖨️ Print / Save for Doctor</button>
                </div>
              </div>

            </form>
          </div>
        </div>

        <script>
          function calcASRS() {
            var positive = 0;
            var answered = 0;
            for (var i = 1; i <= 6; i++) {
              var sel = document.querySelector('input[name="asrs' + i + '"]:checked');
              if (sel) {
                answered++;
                positive += parseInt(sel.value, 10);
              }
            }

            if (answered === 6) {
              var resEl = document.getElementById('asrsResult');
              resEl.style.display = 'block';
              document.getElementById('asrsScore').textContent = positive + ' of 6 Significant Symptoms';

              var vEl = document.getElementById('asrsVerdict');
              var expEl = document.getElementById('asrsExplanation');

              if (positive >= 4) {
                vEl.textContent = 'High Likelihood of Adult ADHD Characteristics';
                vEl.style.color = '#ef4444';
                expEl.innerHTML = 'According to the World Health Organization ASRS-v1.1 scoring criteria, four or more positive responses strongly indicates symptoms consistent with Adult ADHD. We recommend sharing this report with a licensed psychiatrist, clinical psychologist, or medical doctor for a formal comprehensive diagnostic evaluation.';
              } else {
                vEl.textContent = 'Below Clinical Threshold for High ADHD Probability';
                vEl.style.color = '#10b981';
                expEl.innerHTML = 'Your responses show fewer than 4 symptoms in the clinically significant range. While executive function challenges can still arise from burnout, stress, or sleep deficits, your current profile does not meet the WHO ASRS primary screening threshold.';
              }
            }
          }
        </script>
      `
    },
    {
      slug: 'stand-on-your-own-feet',
      title: 'Stand On Your Own Feet: The Radical Self-Reliance & Motivation Engine',
      metaDesc: 'A no-bullshit motivational bombardment engine and self-reliance diagnostic. Hard-hitting stoic truths, continuous quote barrage, and 4 pillars of independence. 100% Ad-Free.',
      category: 'Self-Reliance & Motivation',
      noAds: true,
      body: `
        ${commonStyle}
        <style>
          .bombard-box { background: radial-gradient(circle at center, rgba(59,130,246,0.12), transparent 75%), var(--surface); border: 2px solid var(--border-strong, #000); border-radius: 12px; padding: 2.5rem 1.5rem; text-align: center; margin: 1.5rem 0; min-height: 240px; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; }
          .quote-text { font-family: var(--serif); font-size: 1.8rem; font-weight: bold; line-height: 1.35; color: var(--fg); max-width: 750px; margin-bottom: 1rem; transition: opacity 0.25s ease-in-out; }
          .quote-author { font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; font-weight: bold; }
          .pillar-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; }
          .ad-free-badge { display: inline-flex; align-items: center; gap: 0.35rem; background: rgba(16,185,129,0.1); border: 1px solid #10b981; color: #10b981; padding: 0.25rem 0.6rem; border-radius: 20px; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; font-weight: bold; }
        </style>
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Stand On Your Own Feet
          </nav>
          <header style="margin-bottom: 1.5rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
              <span class="ad-free-badge">✓ 100% Ad-Free Sanctuary</span>
              <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Radical Accountability</span>
            </div>
            <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem;">Stand On Your Own Feet: The Motivation Bombardment Engine</h1>
            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
              Nobody is coming to rescue you. No guru, no politician, no magic pill. The cavalry isn't coming because <strong>you are the cavalry</strong>. Bombard your brain with hard truths and build unbreakable self-reliance.
            </p>
          </header>

          <!-- THE MOTIVATION BOMBARDMENT ENGINE -->
          <div class="bombard-box" id="bombardCard">
            <div id="quoteDisplay" class="quote-text">
              "Waste no more time arguing about what a good man should be. Be one."
            </div>
            <div id="authorDisplay" class="quote-author">
              — Marcus Aurelius, Meditations
            </div>

            <!-- Auto-Advance Bar -->
            <div id="autoBarWrap" style="display: none; width: 100%; max-width: 300px; height: 4px; background: var(--surface-alt); border-radius: 2px; margin-top: 1.5rem; overflow: hidden;">
              <div id="autoProgress" style="width: 0%; height: 100%; background: #3b82f6; transition: width 0.1s linear;"></div>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2.5rem;">
            <button type="button" class="btn-primary" onclick="nextHardTruth()" style="padding: 0.75rem 1.5rem; font-size: 1rem; cursor: pointer;">
              ⚡ Slap in the Face (New Hard Truth)
            </button>
            <button type="button" class="btn-sec" id="btnAutoBarrage" onclick="toggleBarrage()" style="padding: 0.75rem 1.25rem; font-size: 0.95rem; cursor: pointer;">
              🚀 Start Continuous Bombardment (Every 4s)
            </button>
          </div>

          <!-- THE 4 PILLARS OF SELF-RELIANCE DIAGNOSTIC -->
          <div class="tool-box">
            <h2 style="font-family: var(--serif); font-size: 1.5rem; margin-bottom: 0.5rem;">The 4 Pillars of Standing On Your Own Feet</h2>
            <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.5;">
              Rate your independence across the 4 core dimensions of personal sovereignty (1 to 10):
            </p>

            <div class="pillar-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label style="font-weight: bold; font-size: 0.95rem;">1. Physical Sovereignty</label>
                <span id="p1-val" style="font-family: var(--mono); color: #3b82f6; font-weight: bold;">7 / 10</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Sleep hygiene, strength training, sunlight, high-protein nutrition, and zero dependency on crutches.</p>
              <input type="range" id="p1" min="1" max="10" value="7" oninput="calcPillars()" style="width: 100%; cursor: pointer;" />
            </div>

            <div class="pillar-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label style="font-weight: bold; font-size: 0.95rem;">2. Financial Autonomy</label>
                <span id="p2-val" style="font-family: var(--mono); color: #10b981; font-weight: bold;">6 / 10</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Living below your means, building emergency savings, having multiple income skills, and zero reliance on parents or handouts.</p>
              <input type="range" id="p2" min="1" max="10" value="6" oninput="calcPillars()" style="width: 100%; cursor: pointer;" />
            </div>

            <div class="pillar-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label style="font-weight: bold; font-size: 0.95rem;">3. Emotional Locus of Control</label>
                <span id="p3-val" style="font-family: var(--mono); color: #f59e0b; font-weight: bold;">5 / 10</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Refusing the victim mindset. Taking 100% ownership of your reactions, emotions, and life conditions.</p>
              <input type="range" id="p3" min="1" max="10" value="5" oninput="calcPillars()" style="width: 100%; cursor: pointer;" />
            </div>

            <div class="pillar-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label style="font-weight: bold; font-size: 0.95rem;">4. Execution Velocity</label>
                <span id="p4-val" style="font-family: var(--mono); color: #8b5cf6; font-weight: bold;">5 / 10</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Closing the latency between having an idea and executing. Killing procrastination through immediate action.</p>
              <input type="range" id="p4" min="1" max="10" value="5" oninput="calcPillars()" style="width: 100%; cursor: pointer;" />
            </div>

            <div class="result-card" style="border-top: 4px solid #3b82f6;">
              <div class="field-label">Your Personal Sovereignty Index</div>
              <div id="sovereigntyScore" class="result-val">58%</div>
              <div id="sovereigntyFeedback" style="font-size: 0.95rem; line-height: 1.6; color: var(--fg); margin-top: 0.5rem;"></div>
            </div>
          </div>

          <!-- 10-MINUTE ACTION LOCK-IN PAD -->
          <div class="tool-box" style="background: rgba(59,130,246,0.04); border-color: #3b82f6;">
            <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.5rem;">The 10-Minute Action Lock-In</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">
              Motivation without action is mental masturbation. Commit to <strong>one physical action</strong> you will complete right now on your own two feet within 10 minutes:
            </p>
            <input type="text" id="lockinAction" class="text-input" placeholder="e.g. Put on running shoes and run 1 mile, Wash the sink dishes, Open bank account..." style="margin-bottom: 1rem;" />
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
              <button type="button" class="btn-primary" onclick="startLockinTimer()">🔒 Lock In & Start 10-Min Timer</button>
              <span id="lockinTimerDisplay" style="font-family: var(--mono); font-size: 1.4rem; font-weight: bold; color: #ef4444; display: none;">10:00</span>
            </div>
          </div>
        </div>

        <script>
          var hardTruths = [
            { q: "Waste no more time arguing about what a good man should be. Be one.", a: "Marcus Aurelius, Meditations" },
            { q: "Nobody is coming to save you. Nobody is coming to help you. Get your ass up and do the work.", a: "David Goggins, Can't Hurt Me" },
            { q: "Trust thyself: every heart vibrates to that iron string. Insist on yourself; never imitate.", a: "Ralph Waldo Emerson, Self-Reliance" },
            { q: "He who has a why to live can bear almost any how.", a: "Friedrich Nietzsche, Twilight of the Idols" },
            { q: "We suffer more often in imagination than in reality.", a: "Seneca, Letters from a Stoic" },
            { q: "When we are no longer able to change a situation, we are challenged to change ourselves.", a: "Viktor Frankl, Man's Search for Meaning" },
            { q: "How long are you going to wait before you demand the best for yourself?", a: "Epictetus, Enchiridion" },
            { q: "Discipline equals freedom. Stop negotiating with weakness in your own mind.", a: "Jocko Willink, Extreme Ownership" },
            { q: "You do not rise to the level of your goals. You fall to the level of your systems.", a: "James Clear, Atomic Habits" },
            { q: "I am not what happened to me, I am what I choose to become.", a: "Carl Jung" },
            { q: "The impediment to action advances action. What stands in the way becomes the way.", a: "Marcus Aurelius" },
            { q: "If you are depressed you are living in the past. If you are anxious you are living in the future. If you are at peace you are living in the present.", a: "Lao Tzu" },
            { q: "The cave you fear to enter holds the treasure you seek.", a: "Joseph Campbell" },
            { q: "You can have excuses or you can have results, but you cannot have both.", a: "Arnold Schwarzenegger" },
            { q: "It is not death that a man should fear, but he should fear never beginning to live.", a: "Marcus Aurelius" },
            { q: "A man who suffers before it is necessary, suffers more than is necessary.", a: "Seneca" },
            { q: "Everything can be taken from a man but one thing: the last of the human freedoms—to choose one's attitude in any given set of circumstances.", a: "Viktor Frankl" },
            { q: "Do what you have to do until you can do what you want to do.", a: "James Baldwin" },
            { q: "The chief task in life is simply this: to identify and separate matters so that I can say clearly to myself which are externals not under my control, and which have to do with the choices I actually control.", a: "Epictetus" }
          ];

          var barrageActive = false;
          var barrageTimer = null;
          var barrageProgressTimer = null;
          var progressVal = 0;

          function nextHardTruth() {
            var card = document.getElementById('quoteDisplay');
            card.style.opacity = '0';
            setTimeout(function() {
              var r = hardTruths[Math.floor(Math.random() * hardTruths.length)];
              card.textContent = '"' + r.q + '"';
              document.getElementById('authorDisplay').textContent = '— ' + r.a;
              card.style.opacity = '1';
            }, 200);
          }

          function toggleBarrage() {
            barrageActive = !barrageActive;
            var btn = document.getElementById('btnAutoBarrage');
            var pWrap = document.getElementById('autoBarWrap');

            if (barrageActive) {
              btn.textContent = '⏹ Stop Bombardment';
              btn.style.background = '#ef4444';
              btn.style.color = '#fff';
              pWrap.style.display = 'block';
              runBarrageLoop();
            } else {
              btn.textContent = '🚀 Start Continuous Bombardment (Every 4s)';
              btn.style.background = 'transparent';
              btn.style.color = 'var(--fg)';
              pWrap.style.display = 'none';
              clearTimeout(barrageTimer);
              clearInterval(barrageProgressTimer);
            }
          }

          function runBarrageLoop() {
            if (!barrageActive) return;
            nextHardTruth();
            progressVal = 0;
            clearInterval(barrageProgressTimer);
            barrageProgressTimer = setInterval(function() {
              progressVal += 2.5;
              document.getElementById('autoProgress').style.width = progressVal + '%';
              if (progressVal >= 100) {
                clearInterval(barrageProgressTimer);
              }
            }, 100);

            barrageTimer = setTimeout(function() {
              runBarrageLoop();
            }, 4000);
          }

          function calcPillars() {
            var p1 = parseInt(document.getElementById('p1').value, 10);
            var p2 = parseInt(document.getElementById('p2').value, 10);
            var p3 = parseInt(document.getElementById('p3').value, 10);
            var p4 = parseInt(document.getElementById('p4').value, 10);

            document.getElementById('p1-val').textContent = p1 + ' / 10';
            document.getElementById('p2-val').textContent = p2 + ' / 10';
            document.getElementById('p3-val').textContent = p3 + ' / 10';
            document.getElementById('p4-val').textContent = p4 + ' / 10';

            var total = p1 + p2 + p3 + p4;
            var pct = Math.round((total / 40) * 100);
            document.getElementById('sovereigntyScore').textContent = pct + '%';

            var fb = '';
            if (pct >= 80) {
              fb = '<strong>High Sovereignty:</strong> You operate as an autonomous, self-directed individual. You take responsibility for outcomes and don\\'t wait for external validation. Keep sharpening the blade.';
            } else if (pct >= 50) {
              fb = '<strong>Developing Autonomy:</strong> You have strong foundations in some areas, but leaks in others (often execution latency or emotional reactivity). Focus on the lowest-scoring pillar this week.';
            } else {
              fb = '<strong>External Dependency Warning:</strong> You are currently outsourcing your well-being or motivation to circumstances and other people. Start with Physical Sovereignty: get 8 hours of sleep, drink water, and complete 1 task today without complaining.';
            }
            document.getElementById('sovereigntyFeedback').innerHTML = fb;
          }

          var lockinSeconds = 600;
          var lockinInterval = null;

          function startLockinTimer() {
            var act = document.getElementById('lockinAction').value.trim();
            if (!act) { alert('Please enter your 10-minute action commitment first!'); return; }
            var disp = document.getElementById('lockinTimerDisplay');
            disp.style.display = 'inline-block';
            lockinSeconds = 600;

            clearInterval(lockinInterval);
            lockinInterval = setInterval(function() {
              lockinSeconds--;
              if (lockinSeconds <= 0) {
                clearInterval(lockinInterval);
                disp.textContent = 'TIME IS UP — ACTION COMPLETE!';
                disp.style.color = '#10b981';
                alert('10 MINUTES EXPIRED! If you took action, congratulations on standing on your own feet.');
              } else {
                var m = Math.floor(lockinSeconds / 60);
                var s = lockinSeconds % 60;
                disp.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
              }
            }, 1000);
          }

          document.addEventListener('DOMContentLoaded', calcPillars);
        </script>
      `
    },
    {
      slug: 'therapy-recommendation-engine',
      title: 'Evidence-Based Therapy Matcher & Clinical Self-Help Guide',
      metaDesc: 'Interactive clinical psychotherapy recommendation engine. Compare CBT, DBT, ACT, EMDR, and Somatic Experiencing to match your psychological needs. 100% Ad-Free.',
      category: 'Therapy & Guidance',
      noAds: true,
      body: `
        ${commonStyle}
        <style>
          .modality-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; }
          .ad-free-badge { display: inline-flex; align-items: center; gap: 0.35rem; background: rgba(16,185,129,0.1); border: 1px solid #10b981; color: #10b981; padding: 0.25rem 0.6rem; border-radius: 20px; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; font-weight: bold; }
        </style>
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Therapy Recommendation Matcher
          </nav>
          <header style="margin-bottom: 1.5rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
              <span class="ad-free-badge">✓ 100% Ad-Free Clinical Guide</span>
              <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Psychotherapeutic Triage</span>
            </div>
            <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Evidence-Based Therapy Matcher & Guidance</h1>
            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
              Therapy is not one-size-fits-all. Taking CBT when you have somatic trauma can feel invalidating; taking psychoanalysis when you need acute crisis regulation can be ineffective. Match your symptoms to the right modality.
            </p>
          </header>

          <div class="tool-box">
            <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Select Your Primary Psychological Obstacle:</h2>

            <div style="display: grid; gap: 0.75rem; margin-bottom: 1.5rem;">
              <label class="q-opt"><input type="radio" name="tm" value="cbt" onchange="showTherapyMatch('cbt')"> 🧠 <strong>Intrusive Thoughts & Negative Loops:</strong> Constant rumination, catastrophic spirals, perfectionism, health anxiety.</label>
              <label class="q-opt"><input type="radio" name="tm" value="dbt" onchange="showTherapyMatch('dbt')"> 🌊 <strong>Emotional Dysregulation & Crisis Swings:</strong> Severe rejection sensitivity (RSD), explosive anger, intense abandonment fear, self-harm urges.</label>
              <label class="q-opt"><input type="radio" name="tm" value="act" onchange="showTherapyMatch('act')"> 🧭 <strong>Existential Dread & Experiential Avoidance:</strong> Struggling to accept painful feelings, chronic procrastination, lack of life direction.</label>
              <label class="q-opt"><input type="radio" name="tm" value="emdr" onchange="showTherapyMatch('emdr')"> ⚡ <strong>Trauma, Flashbacks & PTSD:</strong> Traumatic memories that feel like they are happening right now, nervous system hypervigilance.</label>
              <label class="q-opt"><input type="radio" name="tm" value="somatic" onchange="showTherapyMatch('somatic')"> 🫀 <strong>Physical Body Tension & Freeze State:</strong> Chronic tightness, numbness, nervous system shutdown, disassociation from the neck down.</label>
            </div>

            <!-- RESULT CARD -->
            <div id="therapyResultBox" style="display: none; background: var(--surface-alt); border-left: 4px solid #3b82f6; padding: 1.5rem; border-radius: 0 8px 8px 0;">
              <div id="therapyBadge" style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; font-weight: bold; color: #3b82f6; margin-bottom: 0.25rem;">Recommended Modality</div>
              <h3 id="therapyTitle" style="font-family: var(--serif); font-size: 1.5rem; margin: 0.25rem 0 0.5rem;"></h3>
              <p id="therapySummary" style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);"></p>
              
              <div style="margin-top: 1rem; border-top: 1px solid var(--border); padding-top: 1rem;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem;">Core Therapy Tools to Practice:</div>
                <div id="therapyTools" style="font-size: 0.9rem; line-height: 1.6; color: var(--fg);"></div>
              </div>

              <div style="margin-top: 1rem; border-top: 1px solid var(--border); padding-top: 1rem;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem;">Recommended Reading:</div>
                <div id="therapyBook" style="font-size: 0.9rem; line-height: 1.6; color: var(--fg);"></div>
              </div>
            </div>
          </div>
        </div>

        <script>
          var therapyData = {
            'cbt': {
              title: 'Cognitive Behavioral Therapy (CBT)',
              color: '#3b82f6',
              summary: 'CBT operates on the principle that psychological distress is caused not by events themselves, but by our cognitive interpretations of those events. By examining and systematically testing automatic negative thoughts (ANTs), you short-circuit catastrophic loops.',
              tools: '• Thought Records (Evidence for vs against)<br>• Behavioral Experiments (testing your fears in real life)<br>• Cognitive Restructuring & Decatastrophizing',
              book: '📖 <em>Feeling Good: The New Mood Therapy</em> by Dr. David D. Burns, MD.'
            },
            'dbt': {
              title: 'Dialectical Behavior Therapy (DBT)',
              color: '#10b981',
              summary: 'Developed by Dr. Marsha Linehan, DBT combines behavioral science with Zen mindfulness. It teaches you how to hold two conflicting truths at once: accepting who you are while aggressively committing to change.',
              tools: '• TIPP Skills (Temperature, Intense exercise, Paced breathing, Paired muscle relaxation)<br>• Distress Tolerance & Radical Acceptance<br>• DEAR MAN interpersonal effectiveness for boundaries',
              book: '📖 <em>The Dialectical Behavior Therapy Skills Workbook</em> by Matthew McKay, PhD.'
            },
            'act': {
              title: 'Acceptance and Commitment Therapy (ACT)',
              color: '#f59e0b',
              summary: 'ACT teaches that fighting uncomfortable thoughts or trying to suppress anxiety only amplifies it. Instead of arguing with your thoughts (like CBT), you learn to defuse from them, accept their presence, and commit to actions aligned with your core values.',
              tools: '• Cognitive Defusion ("I notice I am having the thought that...")<br>• The Observing Self (You are the sky, thoughts are just weather)<br>• Values Clarification & Committed Action',
              book: '📖 <em>The Happiness Trap: How to Stop Struggling and Start Living</em> by Dr. Russ Harris.'
            },
            'emdr': {
              title: 'Eye Movement Desensitization and Reprocessing (EMDR)',
              color: '#8b5cf6',
              summary: 'Trauma causes memories to become "frozen" in the limbic system with raw somatic intensity. EMDR uses bilateral stimulation (visual tracking, auditory tones, or physical taps) to help the brain reprocess traumatic events from emotional agony into integrated biographical memory.',
              tools: '• Bilateral eye movement protocols<br>• Resource tapping & Calm Place visualization<br>• SUDS (Subjective Units of Disturbance) desensitization',
              book: '📖 <em>Getting Past Your Past</em> by Dr. Francine Shapiro (Creator of EMDR).'
            },
            'somatic': {
              title: 'Somatic Experiencing & Polyvagal Regulation',
              color: '#ec4899',
              summary: 'Dr. Peter Levine\\'s Somatic Experiencing posits that trauma lives in the autonomic nervous system, not just the prefrontal cortex. Talking about trauma often keeps people trapped in their heads; somatic therapy safely discharges stored fight-or-flight energy through the physical body.',
              tools: '• Pendulation (moving attention between safe physical sensation and distress)<br>• Physiological Sighs & Vagus Nerve Stimulation<br>• Grounding into somatic proprioception',
              book: '📖 <em>The Body Keeps the Score</em> by Dr. Bessel van der Kolk, MD.'
            }
          };

          function showTherapyMatch(key) {
            var data = therapyData[key];
            if (!data) return;

            var box = document.getElementById('therapyResultBox');
            box.style.display = 'block';
            box.style.borderLeftColor = data.color;
            document.getElementById('therapyBadge').style.color = data.color;
            document.getElementById('therapyTitle').textContent = data.title;
            document.getElementById('therapySummary').textContent = data.summary;
            document.getElementById('therapyTools').innerHTML = data.tools;
            document.getElementById('therapyBook').innerHTML = data.book;
          }
        </script>
      `
    },
    {
      slug: 'burnout-calculator',
      title: 'Clinical Burnout & Depletion Index (Maslach MBI Diagnostic)',
      metaDesc: 'Evidence-based workplace burnout assessment based on the Maslach Burnout Inventory (MBI). Measures emotional exhaustion, depersonalization, and professional efficacy.',
      category: 'Workplace Mental Health',
      body: `
        ${commonStyle}
        <style>
          .mbi-q { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1rem; }
          .scale-btns { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; }
          .scale-btn { flex: 1; min-width: 60px; padding: 0.4rem; text-align: center; border: 1px solid var(--border); background: var(--surface); border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-family: var(--mono); }
          .scale-btn input { margin-right: 0.25rem; }
        </style>
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Clinical Burnout Index
          </nav>
          <header style="margin-bottom: 1.5rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
              <span class="badge" style="background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #ef4444;">Occupational Psychology</span>
              <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Maslach MBI Model</span>
            </div>
            <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Clinical Workplace Burnout & Depletion Index</h1>
            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
              Burnout is not personal weakness or simple fatigue; it is an occupational syndrome caused by unmanaged chronic workplace stress. Assess your depletion across <strong>Emotional Exhaustion</strong>, <strong>Depersonalization/Cynicism</strong>, and <strong>Personal Efficacy</strong>.
            </p>
          </header>

          <div class="tool-box">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem;">Rate how often you experience each statement (0 = Never, 4 = Every Day):</h2>

            <div id="mbiQuestions"></div>

            <div style="text-align: center; margin: 2rem 0 1rem;">
              <button type="button" class="btn-primary" onclick="calcBurnout()" style="padding: 0.85rem 2.5rem; font-size: 1.05rem; cursor: pointer;">
                📊 Compute Burnout Index
              </button>
            </div>

            <!-- RESULTS -->
            <div id="burnoutResultBox" style="display: none; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); padding: 1.5rem; margin-top: 1.5rem;">
              <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Overall Burnout Depletion Score</div>
                <div id="boScore" style="font-size: 3.5rem; font-family: var(--mono); font-weight: bold; line-height: 1; margin: 0.5rem 0;">0%</div>
                <div id="boVerdict" style="font-size: 1.15rem; font-weight: bold;"></div>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <div style="background: var(--surface); padding: 1rem; border-radius: 6px; border: 1px solid var(--border);">
                  <div style="font-size: 0.8rem; font-family: var(--mono); color: var(--text-muted); text-transform: uppercase;">Emotional Exhaustion</div>
                  <div id="boEE" style="font-size: 1.4rem; font-weight: bold; margin: 0.25rem 0;">--</div>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Drainage of emotional capacity and chronic physical tiredness.</p>
                </div>
                <div style="background: var(--surface); padding: 1rem; border-radius: 6px; border: 1px solid var(--border);">
                  <div style="font-size: 0.8rem; font-family: var(--mono); color: var(--text-muted); text-transform: uppercase;">Cynicism / Detachment</div>
                  <div id="boDP" style="font-size: 1.4rem; font-weight: bold; margin: 0.25rem 0;">--</div>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Callous attitude toward work, clients, and teammates.</p>
                </div>
                <div style="background: var(--surface); padding: 1rem; border-radius: 6px; border: 1px solid var(--border);">
                  <div style="font-size: 0.8rem; font-family: var(--mono); color: var(--text-muted); text-transform: uppercase;">Sense of Inefficacy</div>
                  <div id="boPA" style="font-size: 1.4rem; font-weight: bold; margin: 0.25rem 0;">--</div>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Erosion of competence and feelings of futility.</p>
                </div>
              </div>

              <div id="boIntervention" style="font-size: 0.95rem; line-height: 1.6; border-top: 1px solid var(--border); padding-top: 1rem;"></div>
            </div>
          </div>
        </div>

        <script>
          var mbiItems = [
            { id: 'q1', text: 'I feel emotionally drained from my work.', dim: 'EE' },
            { id: 'q2', text: 'I feel used up at the end of the workday.', dim: 'EE' },
            { id: 'q3', text: 'I feel fatigued when I get up in the morning and have to face another day on the job.', dim: 'EE' },
            { id: 'q4', text: 'Working with people all day is really a strain for me.', dim: 'EE' },
            { id: 'q5', text: 'I have become more callous or cynical toward people since taking this job.', dim: 'DP' },
            { id: 'q6', text: 'I worry that this job is hardening me emotionally.', dim: 'DP' },
            { id: 'q7', text: 'I don\\'t really care what happens to some colleagues or clients anymore.', dim: 'DP' },
            { id: 'q8', text: 'I feel I am achieving worthwhile accomplishments at my work.', dim: 'PA', reverse: true },
            { id: 'q9', text: 'I feel energetic and exhilarated when working.', dim: 'PA', reverse: true }
          ];

          function renderMbi() {
            var c = document.getElementById('mbiQuestions');
            var h = '';
            for (var i = 0; i < mbiItems.length; i++) {
              var q = mbiItems[i];
              h += '<div class="mbi-q">' +
                '<div style="font-size:0.95rem;font-weight:bold;margin-bottom:0.4rem;">' + (i + 1) + '. ' + q.text + '</div>' +
                '<div class="scale-btns">' +
                  '<label class="scale-btn"><input type="radio" name="' + q.id + '" value="0" checked> Never</label>' +
                  '<label class="scale-btn"><input type="radio" name="' + q.id + '" value="1"> Rarely</label>' +
                  '<label class="scale-btn"><input type="radio" name="' + q.id + '" value="2"> Sometimes</label>' +
                  '<label class="scale-btn"><input type="radio" name="' + q.id + '" value="3"> Often</label>' +
                  '<label class="scale-btn"><input type="radio" name="' + q.id + '" value="4"> Daily</label>' +
                '</div>' +
              '</div>';
            }
            c.innerHTML = h;
          }

          function calcBurnout() {
            var ee = 0, dp = 0, pa = 0;
            for (var i = 0; i < mbiItems.length; i++) {
              var q = mbiItems[i];
              var sel = document.querySelector('input[name="' + q.id + '"]:checked');
              var val = sel ? parseInt(sel.value, 10) : 0;
              if (q.dim === 'EE') ee += val;
              if (q.dim === 'DP') dp += val;
              if (q.dim === 'PA') {
                pa += (q.reverse ? (4 - val) : val);
              }
            }

            var maxScore = (4 * 4) + (3 * 4) + (2 * 4); // 16 + 12 + 8 = 36
            var total = ee + dp + pa;
            var pct = Math.round((total / maxScore) * 100);

            document.getElementById('burnoutResultBox').style.display = 'block';
            var sEl = document.getElementById('boScore');
            sEl.textContent = pct + '%';

            var vEl = document.getElementById('boVerdict');
            var intEl = document.getElementById('boIntervention');

            document.getElementById('boEE').textContent = Math.round((ee / 16) * 100) + '%';
            document.getElementById('boDP').textContent = Math.round((dp / 12) * 100) + '%';
            document.getElementById('boPA').textContent = Math.round((pa / 8) * 100) + '%';

            if (pct >= 65) {
              sEl.style.color = '#ef4444';
              vEl.textContent = 'Severe Clinical Burnout Phase';
              vEl.style.color = '#ef4444';
              intEl.innerHTML = '<strong>Immediate Crisis Protocol:</strong> You are experiencing acute nervous system depletion. Your current workload is structurally unsustainable. Implement radical boundary scripts immediately: do not check work email outside 9-5, cancel optional meetings, take sick days to sleep without guilt, and consult a therapist or physician.';
            } else if (pct >= 40) {
              sEl.style.color = '#f59e0b';
              vEl.textContent = 'Moderate Chronic Exhaustion (Pre-Burnout)';
              vEl.style.color = '#f59e0b';
              intEl.innerHTML = '<strong>Warning Sign Protocol:</strong> You are accumulating chronic stress faster than you are recovering. Notice if cynicism is creeping in as a protective shell. Institute a strict 60-minute wind-down routine every evening, take micro-breaks during the day, and delegate or reject at least one non-critical project.';
            } else {
              sEl.style.color = '#10b981';
              vEl.textContent = 'Resilient Occupational Baseline';
              vEl.style.color = '#10b981';
              intEl.innerHTML = '<strong>Maintenance Protocol:</strong> Your burnout markers are low. You retain healthy emotional boundaries and personal engagement with your work. Continue prioritizing sleep, regular exercise, and distinct separation between work and personal life.';
            }

            document.getElementById('burnoutResultBox').scrollIntoView({ behavior: 'smooth' });
          }

          document.addEventListener('DOMContentLoaded', renderMbi);
        </script>
      `
    },
    {
      slug: 'imposter-syndrome-test',
      title: 'Imposter Phenomenon Diagnostic & Competence Auditor (CIPS)',
      metaDesc: 'Free Clance Imposter Phenomenon Scale (CIPS). Assess your level of intellectual fraud feelings, perfectionism, fear of failure, and attribution bias.',
      category: 'Psychological Diagnostics',
      body: `
        ${commonStyle}
        <style>
          .cips-item { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1rem; }
          .cips-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; }
          .cips-opt { flex: 1; min-width: 60px; padding: 0.4rem; text-align: center; border: 1px solid var(--border); background: var(--surface); border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-family: var(--mono); }
        </style>
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Imposter Syndrome Test
          </nav>
          <header style="margin-bottom: 1.5rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
              <span class="badge" style="background: rgba(139,92,246,0.1); border: 1px solid #8b5cf6; color: #8b5cf6;">Clinical Scale</span>
              <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Dr. Pauline Clance CIPS</span>
            </div>
            <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Imposter Phenomenon Diagnostic & Competence Auditor</h1>
            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
              Do you feel like you just got lucky? That you fooled everyone and will soon be exposed as a fraud? The Clance Imposter Phenomenon Scale measures intellectual self-doubt, attribution error, and perfectionism.
            </p>
          </header>

          <div class="tool-box">
            <h2 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1.25rem;">Rate how true each statement is for you (1 = Not at all true, 5 = Very true):</h2>

            <div id="cipsQuestions"></div>

            <div style="text-align: center; margin: 2rem 0 1rem;">
              <button type="button" class="btn-primary" onclick="calcCips()" style="padding: 0.85rem 2.5rem; font-size: 1.05rem; cursor: pointer;">
                🧠 Calculate Imposter Score
              </button>
            </div>

            <!-- RESULT -->
            <div id="cipsResultBox" style="display: none; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); padding: 1.5rem; margin-top: 1.5rem;">
              <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Total Clance Imposter Score</div>
                <div id="cipsScore" style="font-size: 3.5rem; font-family: var(--mono); font-weight: bold; line-height: 1; margin: 0.5rem 0;">--</div>
                <div id="cipsVerdict" style="font-size: 1.15rem; font-weight: bold;"></div>
              </div>

              <div id="cipsAnalysis" style="font-size: 0.95rem; line-height: 1.6; border-top: 1px solid var(--border); padding-top: 1rem;"></div>
            </div>
          </div>
        </div>

        <script>
          var cipsItems = [
            'I have often succeeded on a test or task even though I felt confident that I wouldn’t do well.',
            'I can give the impression that I’m more competent than I really am.',
            'I avoid evaluations if possible and have a dread of others evaluating me.',
            'When people praise me for something I\\'ve accomplished, I feel I’m deceiving them.',
            'I sometimes think I obtained my present position or success because I happened to be in the right place at the right time.',
            'I’m afraid people important to me may find out that I’m not as capable as they think I am.',
            'I tend to remember the incidents on which I haven’t done my best more than those on which I have.',
            'I rarely do a project or task as well as I’d like to do it.',
            'Sometimes I feel or believe that my success in my life or in my job has been the result of some kind of error.',
            'It’s hard for me to accept compliments or praise about my intelligence or accomplishments.'
          ];

          function renderCips() {
            var c = document.getElementById('cipsQuestions');
            var h = '';
            for (var i = 0; i < cipsItems.length; i++) {
              h += '<div class="cips-item">' +
                '<div style="font-size:0.95rem;font-weight:bold;margin-bottom:0.4rem;">' + (i + 1) + '. ' + cipsItems[i] + '</div>' +
                '<div class="cips-opts">' +
                  '<label class="cips-opt"><input type="radio" name="cips' + i + '" value="1" checked> 1 (Not true)</label>' +
                  '<label class="cips-opt"><input type="radio" name="cips' + i + '" value="2"> 2 (Rarely)</label>' +
                  '<label class="cips-opt"><input type="radio" name="cips' + i + '" value="3"> 3 (Sometimes)</label>' +
                  '<label class="cips-opt"><input type="radio" name="cips' + i + '" value="4"> 4 (Often)</label>' +
                  '<label class="cips-opt"><input type="radio" name="cips' + i + '" value="5"> 5 (Very true)</label>' +
                '</div>' +
              '</div>';
            }
            c.innerHTML = h;
          }

          function calcCips() {
            var total = 0;
            for (var i = 0; i < cipsItems.length; i++) {
              var sel = document.querySelector('input[name="cips' + i + '"]:checked');
              total += sel ? parseInt(sel.value, 10) : 1;
            }

            document.getElementById('cipsResultBox').style.display = 'block';
            var sEl = document.getElementById('cipsScore');
            sEl.textContent = total + ' / 50';

            var vEl = document.getElementById('cipsVerdict');
            var aEl = document.getElementById('cipsAnalysis');

            if (total >= 40) {
              sEl.style.color = '#ef4444';
              vEl.textContent = 'Intense Imposter Phenomenon';
              vEl.style.color = '#ef4444';
              aEl.innerHTML = '<strong>Cognitive Pattern:</strong> You suffer from acute attribution error—crediting your success to pure luck, timing, or charm while attributing mistakes entirely to personal inadequacy. You likely live in perpetual fear that the "fraud police" will unmask you. <em>Clinical Reframe:</em> True frauds do not experience imposter syndrome. Only competent people who hold themselves to impossible standards fear they are inadequate.';
            } else if (total >= 28) {
              sEl.style.color = '#f59e0b';
              vEl.textContent = 'Moderate Imposter Characteristics';
              vEl.style.color = '#f59e0b';
              aEl.innerHTML = '<strong>Cognitive Pattern:</strong> You frequently experience waves of self-doubt, especially when entering new roles or receiving public accolades. You discount positive feedback and over-ruminate on minor errors. Practice creating a "Brag Document" listing objective, factual evidence of your skills.';
            } else {
              sEl.style.color = '#10b981';
              vEl.textContent = 'Few Imposter Characteristics';
              vEl.style.color = '#10b981';
              aEl.innerHTML = '<strong>Cognitive Pattern:</strong> You have a grounded, realistic sense of your capabilities. You can internalize praise and recognize that luck and effort operate together. You do not tie your entire self-worth to error-free perfection.';
            }

            document.getElementById('cipsResultBox').scrollIntoView({ behavior: 'smooth' });
          }

          document.addEventListener('DOMContentLoaded', renderCips);
        </script>
      `
    },
    {
      slug: 'sleep-debt-calculator',
      title: 'Cumulative Sleep Debt & Circadian Recovery Calculator',
      metaDesc: 'Calculate your accumulated weekly sleep deficit, blood alcohol equivalent impairment, and safe weekend recovery schedule without causing social jetlag.',
      category: 'Sleep & Recovery',
      body: `
        ${commonStyle}
        <style>
          .day-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem; text-align: center; }
          .day-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; margin-bottom: 1.5rem; }
          @media (max-width: 640px) { .day-grid { grid-template-columns: repeat(2, 1fr); } }
        </style>
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Sleep Debt Calculator
          </nav>
          <header style="margin-bottom: 1.5rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
              <span class="badge" style="background: rgba(14,165,233,0.1); border: 1px solid #0ea5e9; color: #0ea5e9;">Sleep Architecture</span>
              <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Cognitive Deficit</span>
            </div>
            <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Cumulative Sleep Debt & Circadian Recovery Calculator</h1>
            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
              Every hour of lost sleep accumulates on your prefrontal cortex as a metabolic deficit. Calculate your 7-day sleep debt, its equivalent blood alcohol concentration impairment, and how to safely repay it without wrecking your Sunday night sleep.
            </p>
          </header>

          <div class="tool-box">
            <div style="margin-bottom: 1.25rem;">
              <label style="font-weight: bold; font-size: 0.95rem;">Your Individual Nightly Sleep Baseline Requirement:</label>
              <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.35rem;">
                <input type="number" id="baselineSleep" value="8.0" min="6.0" max="10.0" step="0.25" class="text-input" style="width: 100px;" onchange="calcDebt()" />
                <span style="font-size: 0.85rem; color: var(--text-muted);">hours per night (adult average is 7.5 – 8.5h)</span>
              </div>
            </div>

            <label style="font-weight: bold; font-size: 0.95rem; display: block; margin-bottom: 0.5rem;">Hours Slept Over the Last 7 Days:</label>
            <div class="day-grid">
              <div class="day-card"><label style="font-size:0.75rem;display:block;margin-bottom:0.25rem;font-weight:bold;">MON</label><input type="number" id="d1" value="6.5" step="0.5" class="text-input" style="width:100%;text-align:center;" oninput="calcDebt()"></div>
              <div class="day-card"><label style="font-size:0.75rem;display:block;margin-bottom:0.25rem;font-weight:bold;">TUE</label><input type="number" id="d2" value="6.0" step="0.5" class="text-input" style="width:100%;text-align:center;" oninput="calcDebt()"></div>
              <div class="day-card"><label style="font-size:0.75rem;display:block;margin-bottom:0.25rem;font-weight:bold;">WED</label><input type="number" id="d3" value="5.5" step="0.5" class="text-input" style="width:100%;text-align:center;" oninput="calcDebt()"></div>
              <div class="day-card"><label style="font-size:0.75rem;display:block;margin-bottom:0.25rem;font-weight:bold;">THU</label><input type="number" id="d4" value="7.0" step="0.5" class="text-input" style="width:100%;text-align:center;" oninput="calcDebt()"></div>
              <div class="day-card"><label style="font-size:0.75rem;display:block;margin-bottom:0.25rem;font-weight:bold;">FRI</label><input type="number" id="d5" value="6.0" step="0.5" class="text-input" style="width:100%;text-align:center;" oninput="calcDebt()"></div>
              <div class="day-card"><label style="font-size:0.75rem;display:block;margin-bottom:0.25rem;font-weight:bold;">SAT</label><input type="number" id="d6" value="7.5" step="0.5" class="text-input" style="width:100%;text-align:center;" oninput="calcDebt()"></div>
              <div class="day-card"><label style="font-size:0.75rem;display:block;margin-bottom:0.25rem;font-weight:bold;">SUN</label><input type="number" id="d7" value="7.0" step="0.5" class="text-input" style="width:100%;text-align:center;" oninput="calcDebt()"></div>
            </div>

            <!-- RESULT -->
            <div class="result-card" style="border-top: 4px solid #0ea5e9;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; text-align: center;">
                <div>
                  <div class="field-label">Total Cumulative Sleep Debt</div>
                  <div id="debtHours" class="result-val" style="color: #ef4444;">10.5 hrs</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">behind your baseline</div>
                </div>
                <div>
                  <div class="field-label">Equivalent Cognitive Impairment</div>
                  <div id="bacEquiv" class="result-val" style="color: #f59e0b;">~0.05% BAC</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">Reaction time slowdown</div>
                </div>
              </div>

              <div id="sleepRecoveryPlan" style="margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1rem; font-size: 0.95rem; line-height: 1.6;"></div>
            </div>
          </div>
        </div>

        <script>
          function calcDebt() {
            var b = parseFloat(document.getElementById('baselineSleep').value) || 8.0;
            var days = ['d1','d2','d3','d4','d5','d6','d7'];
            var totalActual = 0;
            for (var i = 0; i < days.length; i++) {
              totalActual += parseFloat(document.getElementById(days[i]).value) || 0;
            }
            var target = b * 7;
            var debt = Math.max(0, target - totalActual);

            var dEl = document.getElementById('debtHours');
            dEl.textContent = debt.toFixed(1) + ' hrs';

            var bacEl = document.getElementById('bacEquiv');
            var planEl = document.getElementById('sleepRecoveryPlan');

            if (debt <= 1.0) {
              dEl.style.color = '#10b981';
              bacEl.textContent = 'Normal / Rested';
              bacEl.style.color = '#10b981';
              planEl.innerHTML = '<strong>Circadian Health:</strong> You are fully caught up on sleep. Your prefrontal cortex and autonomic nervous system are operating at peak restorative baseline.';
            } else if (debt <= 6.0) {
              dEl.style.color = '#f59e0b';
              bacEl.textContent = '~0.04% BAC';
              bacEl.style.color = '#f59e0b';
              planEl.innerHTML = '<strong>Moderate Debt Recovery Protocol:</strong> Do NOT sleep in for 4 extra hours on Sunday—this causes "social jetlag" and makes waking up Monday hell. Instead: extend your sleep window by <strong>+60 minutes tonight</strong> and take a <strong>20-minute power nap before 2:00 PM</strong>.';
            } else {
              dEl.style.color = '#ef4444';
              bacEl.textContent = '~0.08% BAC (Legally Drunk Impairment)';
              bacEl.style.color = '#ef4444';
              planEl.innerHTML = '<strong>Severe Chronic Sleep Debt Warning:</strong> Stanford sleep research shows that chronic sleep debt impairs reaction time, emotional regulation, and working memory identically to being legally intoxicated. Repay this over 4–5 days by adding <strong>+90 minutes to your sleep opportunity window</strong> each night.';
            }
          }

          document.addEventListener('DOMContentLoaded', calcDebt);
        </script>
      `
    },
    {
      slug: 'screen-time-calculator',
      title: 'Lifetime Screen Time & Dopamine Detox Protocol',
      metaDesc: 'Calculate how many years of your finite life you will spend looking at phone and computer screens. Includes custom 3-tier dopamine detox protocols.',
      category: 'Digital Wellness',
      body: `
        ${commonStyle}
        <style>
          .stat-callout { font-size: 3.5rem; font-weight: bold; font-family: var(--mono); color: #ef4444; line-height: 1; margin: 0.5rem 0; }
        </style>
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Lifetime Screen Time
          </nav>
          <header style="margin-bottom: 1.5rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
              <span class="badge" style="background: rgba(236,72,153,0.1); border: 1px solid #ec4899; color: #ec4899;">Existential Reality</span>
              <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Digital Longevity</span>
            </div>
            <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Lifetime Screen Time & Dopamine Detox Calculator</h1>
            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
              Humans have roughly 16 conscious waking hours per day. When you look at a smartphone for 5 hours and a computer for 6 hours, how many literal continuous years of your remaining life will be spent staring at glowing glass?
            </p>
          </header>

          <div class="tool-box">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <label style="font-weight: bold; font-size: 0.9rem; display: block; margin-bottom: 0.25rem;">Current Age</label>
                <input type="number" id="stAge" value="28" min="10" max="100" class="text-input" style="width: 100%; box-sizing: border-box;" oninput="calcScreen()" />
              </div>
              <div>
                <label style="font-weight: bold; font-size: 0.9rem; display: block; margin-bottom: 0.25rem;">Life Expectancy</label>
                <input type="number" id="stExp" value="80" min="50" max="110" class="text-input" style="width: 100%; box-sizing: border-box;" oninput="calcScreen()" />
              </div>
              <div>
                <label style="font-weight: bold; font-size: 0.9rem; display: block; margin-bottom: 0.25rem;">Daily Phone Screen Time (hrs)</label>
                <input type="number" id="stPhone" value="5.0" min="0" max="16" step="0.5" class="text-input" style="width: 100%; box-sizing: border-box;" oninput="calcScreen()" />
              </div>
              <div>
                <label style="font-weight: bold; font-size: 0.9rem; display: block; margin-bottom: 0.25rem;">Daily Computer/TV (hrs)</label>
                <input type="number" id="stPC" value="5.5" min="0" max="16" step="0.5" class="text-input" style="width: 100%; box-sizing: border-box;" oninput="calcScreen()" />
              </div>
            </div>

            <!-- RESULT -->
            <div class="result-card" style="border-top: 4px solid #ec4899; text-align: center;">
              <div class="field-label">Total Years of Your Finite Life Staring at Glass</div>
              <div id="yearsStared" class="stat-callout">34.1 Years</div>
              <div id="pctWaking" style="font-size: 1.1rem; font-weight: bold; color: var(--fg); margin-bottom: 0.5rem;">65.6% of every waking moment</div>
              <div id="stWakeupText" style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; max-width: 650px; margin: 0 auto;"></div>
            </div>
          </div>

          <!-- DETOX PROTOCOL -->
          <div class="tool-box" style="margin-top: 1.5rem; background: rgba(59,130,246,0.04); border-color: #3b82f6;">
            <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.5rem;">Actionable 3-Tier Dopamine Detox Protocol</h3>
            <ul style="font-size: 0.95rem; line-height: 1.8; color: var(--fg); padding-left: 1.25rem; margin: 0;">
              <li><strong>Level 1 (Friction):</strong> Turn your phone display to <em>Grayscale Mode</em> (Triple-click power button). Stripping RGB color makes Instagram and TikTok unstimulating to dopamine receptors.</li>
              <li><strong>Level 2 (Bedroom Sanctuary):</strong> Charge your phone in another room overnight. Buy a $10 analog alarm clock so your eyes do not wake up to notifications.</li>
              <li><strong>Level 3 (24-Hour Digital Sabbath):</strong> Choose Sunday as a zero-screen day. Books, walking, cooking, socializing only. Resets baseline dopamine within 24 hours.</li>
            </ul>
          </div>
        </div>

        <script>
          function calcScreen() {
            var age = parseFloat(document.getElementById('stAge').value) || 28;
            var exp = parseFloat(document.getElementById('stExp').value) || 80;
            var phone = parseFloat(document.getElementById('stPhone').value) || 0;
            var pc = parseFloat(document.getElementById('stPC').value) || 0;

            var yearsRemaining = Math.max(0, exp - age);
            var totalDailyScreen = phone + pc;
            var wakingHours = 16.0; // Assuming 8h sleep
            var screenFraction = Math.min(1.0, totalDailyScreen / wakingHours);

            var lifetimeScreenYears = yearsRemaining * screenFraction;
            var pctWaking = Math.round(screenFraction * 100);

            document.getElementById('yearsStared').textContent = lifetimeScreenYears.toFixed(1) + ' Years';
            document.getElementById('pctWaking').textContent = pctWaking + '% of your conscious waking life';

            var txt = 'Out of the ' + yearsRemaining.toFixed(0) + ' years you have left before age ' + exp + ', ' +
              '<strong>' + lifetimeScreenYears.toFixed(1) + ' full, unbroken 365-day years</strong> will be spent staring directly into illuminated pixels.';
            document.getElementById('stWakeupText').innerHTML = txt;
          }

          document.addEventListener('DOMContentLoaded', calcScreen);
        </script>
      `
    },
    {
      slug: 'attachment-style-test',
      title: 'Adult Attachment Style & Relationship Trigger Diagnostic',
      metaDesc: 'Discover your adult attachment style: Secure, Anxious-Preoccupied, Dismissive-Avoidant, or Fearful-Avoidant (Disorganized). Based on Hazan & Shaver psychology.',
      category: 'Relationship Psychology',
      body: `
        ${commonStyle}
        <style>
          .att-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1rem; }
          .att-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.4rem; }
          .att-opt { flex: 1; min-width: 60px; padding: 0.35rem; text-align: center; border: 1px solid var(--border); background: var(--surface); border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-family: var(--mono); }
        </style>
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Attachment Style Test
          </nav>
          <header style="margin-bottom: 1.5rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
              <span class="badge" style="background: rgba(245,158,11,0.1); border: 1px solid #f59e0b; color: #f59e0b;">Relational Psychology</span>
              <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Bowlby & Hazan Model</span>
            </div>
            <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Adult Attachment Style & Relationship Diagnostic</h1>
            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
              Your attachment style dictates how you navigate conflict, intimacy, vulnerability, and abandonment in romantic partnerships. Discover your placement across the <strong>Attachment Anxiety</strong> and <strong>Attachment Avoidance</strong> axes.
            </p>
          </header>

          <div class="tool-box">
            <h2 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1.25rem;">Rate each statement (1 = Strongly Disagree, 5 = Strongly Agree):</h2>

            <div id="attQuestions"></div>

            <div style="text-align: center; margin: 2rem 0 1rem;">
              <button type="button" class="btn-primary" onclick="calcAttachment()" style="padding: 0.85rem 2.5rem; font-size: 1.05rem; cursor: pointer;">
                ❤️ Analyze Attachment Style
              </button>
            </div>

            <!-- RESULT -->
            <div id="attResultBox" style="display: none; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); padding: 1.5rem; margin-top: 1.5rem;">
              <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Primary Adult Attachment Pattern</div>
                <div id="attTitle" style="font-size: 2rem; font-family: var(--serif); font-weight: bold; margin: 0.5rem 0;">--</div>
              </div>

              <div id="attProfile" style="font-size: 0.95rem; line-height: 1.6; border-top: 1px solid var(--border); padding-top: 1rem;"></div>
            </div>
          </div>
        </div>

        <script>
          var attQuestions = [
            { text: 'I worry a lot about my relationships and fear my partner will stop loving me.', dim: 'anx' },
            { text: 'I find it relatively easy to get close to others and feel comfortable depending on them.', dim: 'sec' },
            { text: 'I prefer not to show a partner how I feel deep down.', dim: 'av' },
            { text: 'I need a lot of reassurance that I am loved by my partner.', dim: 'anx' },
            { text: 'I get uncomfortable when someone gets too emotionally close or dependent on me.', dim: 'av' },
            { text: 'I crave close relationships, but I find myself pulling away when things get intimate.', dim: 'fear' },
            { text: 'I do not often worry about being abandoned or unloved.', dim: 'sec' },
            { text: 'When conflicts arise, my immediate instinct is to shut down or leave the room.', dim: 'av' }
          ];

          function renderAtt() {
            var c = document.getElementById('attQuestions');
            var h = '';
            for (var i = 0; i < attQuestions.length; i++) {
              h += '<div class="att-card">' +
                '<div style="font-size:0.95rem;font-weight:bold;margin-bottom:0.4rem;">' + (i + 1) + '. ' + attQuestions[i].text + '</div>' +
                '<div class="att-opts">' +
                  '<label class="att-opt"><input type="radio" name="att' + i + '" value="1" checked> 1 (Disagree)</label>' +
                  '<label class="att-opt"><input type="radio" name="att' + i + '" value="2"> 2</label>' +
                  '<label class="att-opt"><input type="radio" name="att' + i + '" value="3"> 3</label>' +
                  '<label class="att-opt"><input type="radio" name="att' + i + '" value="4"> 4</label>' +
                  '<label class="att-opt"><input type="radio" name="att' + i + '" value="5"> 5 (Agree)</label>' +
                '</div>' +
              '</div>';
            }
            c.innerHTML = h;
          }

          function calcAttachment() {
            var anx = 0, av = 0;
            var q0 = parseInt(document.querySelector('input[name="att0"]:checked').value, 10);
            var q1 = parseInt(document.querySelector('input[name="att1"]:checked').value, 10);
            var q2 = parseInt(document.querySelector('input[name="att2"]:checked').value, 10);
            var q3 = parseInt(document.querySelector('input[name="att3"]:checked').value, 10);
            var q4 = parseInt(document.querySelector('input[name="att4"]:checked').value, 10);
            var q5 = parseInt(document.querySelector('input[name="att5"]:checked').value, 10);
            var q6 = parseInt(document.querySelector('input[name="att6"]:checked').value, 10);
            var q7 = parseInt(document.querySelector('input[name="att7"]:checked').value, 10);

            anx = q0 + q3 + (6 - q6);
            av = q2 + q4 + q7 + (6 - q1);

            document.getElementById('attResultBox').style.display = 'block';
            var tEl = document.getElementById('attTitle');
            var pEl = document.getElementById('attProfile');

            if (anx <= 7 && av <= 7) {
              tEl.textContent = '🛡️ Secure Attachment';
              tEl.style.color = '#10b981';
              pEl.innerHTML = '<strong>Traits:</strong> You have a high capacity for intimacy while maintaining your personal autonomy. You view conflict as a problem to solve together rather than a threat to your survival. You communicate needs directly without passive-aggressive testing.';
            } else if (anx > 8 && av <= 8) {
              tEl.textContent = '🌊 Anxious-Preoccupied Attachment';
              tEl.style.color = '#3b82f6';
              pEl.innerHTML = '<strong>Traits:</strong> Hypervigilant to shifts in your partner’s tone or text response time. You equate physical or emotional space with impending abandonment. <em>Growth Edge:</em> Learn self-soothing practices so you do not rely on immediate partner reassurance to regulate your nervous system.';
            } else if (anx <= 8 && av > 8) {
              tEl.textContent = '🏰 Dismissive-Avoidant Attachment';
              tEl.style.color = '#f59e0b';
              pEl.innerHTML = '<strong>Traits:</strong> Highly self-reliant to a fault. You equate emotional intimacy with loss of independence and suffocating obligation. During conflict, your primary defense mechanism is stonewalling or emotional shutdown. <em>Growth Edge:</em> Vulnerability is not weakness; expressing your needs directly prevents toxic resentment.';
            } else {
              tEl.textContent = '⚡ Fearful-Avoidant (Disorganized) Attachment';
              tEl.style.color = '#ef4444';
              pEl.innerHTML = '<strong>Traits:</strong> You deeply crave closeness, but genuine intimacy triggers intense panic or trauma responses. You oscillate in a push-pull cycle: pulling someone close when they are distant, then pushing them away when they show affection. Somatic and EMDR trauma therapy is highly effective for healing this attachment injury.';
            }

            document.getElementById('attResultBox').scrollIntoView({ behavior: 'smooth' });
          }

          document.addEventListener('DOMContentLoaded', renderAtt);
        </script>
      `
    },
    {
      slug: 'noise-exposure-calculator',
      title: 'Decibel Sound Dose & Hearing Damage Estimator (OSHA/NIOSH)',
      metaDesc: 'Calculate safe listening duration for headphones, concerts, and loud noise environments before permanent hearing loss occurs. Uses NIOSH 3dB and OSHA 5dB rules.',
      category: 'Hearing & Sensory Health',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Noise Exposure Calculator
          </nav>
          <header style="margin-bottom: 1.5rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
              <span class="badge" style="background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #ef4444;">Audiology & OSHA</span>
              <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">NIOSH 3dB Exchange</span>
            </div>
            <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Decibel Sound Dose & Hearing Damage Estimator</h1>
            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
              The cochlear hair cells in your inner ear never regenerate. When listening to headphones at 95 dB or attending a 105 dB concert, the safe exposure window drops from 8 hours down to minutes.
            </p>
          </header>

          <div class="tool-box">
            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label style="font-weight: bold;">Sound Pressure Level (Decibels - dB):</label>
                <span id="dbDisp" style="font-family: var(--mono); font-size: 1.25rem; font-weight: bold; color: #ef4444;">94 dB</span>
              </div>
              <input type="range" id="dbInput" min="70" max="120" value="94" style="width: 100%; cursor: pointer;" oninput="calcNoise()" />
              <div id="dbExample" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.35rem;">Example: Heavy city traffic, food blender, or headphones at 80% volume</div>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label style="font-weight: bold; display: block; margin-bottom: 0.35rem;">Duration of Exposure (Minutes):</label>
              <input type="number" id="noiseMins" value="60" min="1" max="960" class="text-input" style="width: 150px;" oninput="calcNoise()" />
            </div>

            <!-- RESULTS -->
            <div class="result-card" style="border-top: 4px solid #ef4444;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; text-align: center;">
                <div>
                  <div class="field-label">Daily Safe Noise Dose</div>
                  <div id="noiseDose" class="result-val" style="color: #ef4444;">800%</div>
                  <div id="doseWarning" style="font-size: 0.85rem; font-weight: bold; color: #ef4444;">Severe Risk of Permanent Damage</div>
                </div>
                <div>
                  <div class="field-label">Max Safe Exposure Limit</div>
                  <div id="maxSafeTime" class="result-val" style="color: #3b82f6;">37 mins</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">per 24-hour period</div>
                </div>
              </div>

              <div id="noiseAdvice" style="margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1rem; font-size: 0.95rem; line-height: 1.6;"></div>
            </div>
          </div>
        </div>

        <script>
          var soundExamples = {
            70: "Normal office conversation, quiet dishwasher",
            75: "Vacuum cleaner, toilet flush",
            80: "Garbage disposal, alarm clock, dial tone",
            85: "Heavy city traffic, lawn mower, food blender (NIOSH Threshold)",
            90: "Hairdryer, lawnmower, motorcycle close up",
            95: "Headphones at 80% volume, power drill, subway train",
            100: "Car horn at 5 meters, chainsaw, garbage truck",
            105: "Headphones at maximum volume, nightclub, soccer game",
            110: "Rock concert, live stadium music, car stereo maximum",
            115: "Emergency vehicle siren at close range",
            120: "Jet engine takeoff at 100m, ambulance siren (Pain threshold)"
          };

          function calcNoise() {
            var db = parseInt(document.getElementById('dbInput').value, 10);
            var mins = parseFloat(document.getElementById('noiseMins').value) || 1;

            document.getElementById('dbDisp').textContent = db + ' dB';

            // Find closest example
            var nearest = 85;
            var keys = Object.keys(soundExamples);
            for (var k = 0; k < keys.length; k++) {
              if (Math.abs(keys[k] - db) < Math.abs(nearest - db)) {
                nearest = keys[k];
              }
            }
            document.getElementById('dbExample').textContent = 'Example: ' + soundExamples[nearest];

            // NIOSH 3dB Exchange Rate: T = 8 / (2 ^ ((L - 85) / 3)) in hours
            var safeHours = 8 / Math.pow(2, (db - 85) / 3);
            var safeMins = safeHours * 60;

            var dosePct = Math.round((mins / safeMins) * 100);

            var doseEl = document.getElementById('noiseDose');
            var warnEl = document.getElementById('doseWarning');
            var maxEl = document.getElementById('maxSafeTime');
            var advEl = document.getElementById('noiseAdvice');

            doseEl.textContent = dosePct + '%';

            if (safeMins >= 60) {
              maxEl.textContent = (safeMins / 60).toFixed(1) + ' hrs';
            } else if (safeMins >= 1) {
              maxEl.textContent = safeMins.toFixed(0) + ' mins';
            } else {
              maxEl.textContent = (safeMins * 60).toFixed(0) + ' secs';
            }

            if (dosePct > 100) {
              doseEl.style.color = '#ef4444';
              warnEl.textContent = 'Exceeds Maximum Safe Dose (' + (dosePct / 100).toFixed(1) + 'x Limit)';
              warnEl.style.color = '#ef4444';
              advEl.innerHTML = '<strong>High Risk of Tinnitus & Sensorineural Hearing Loss:</strong> Exposing your ears to ' + db + ' dB for ' + mins + ' minutes delivers ' + dosePct + '% of your allowable 24-hour acoustic energy. Cochlear stereocilia bend and snap under this acoustic pressure, resulting in permanent high-frequency hearing deficits and chronic ringing (tinnitus). Wear high-fidelity acoustic earplugs (15–25 dB attenuation) or lower headphone volume immediately.';
            } else {
              doseEl.style.color = '#10b981';
              warnEl.textContent = 'Within Safe Acoustic Dosage';
              warnEl.style.color = '#10b981';
              advEl.innerHTML = '<strong>Safe Exposure Window:</strong> At ' + db + ' dB, you are below the daily acoustic threshold. Ensure you give your ears quiet recovery periods between listening sessions.';
            }
          }

          document.addEventListener('DOMContentLoaded', calcNoise);
        </script>
      `
    }
  ];

  // Render individual pages
  for (const tool of tools) {
    const html = renderPage({
      title: `${tool.title} | Digital Tools Shed`,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/health/${tool.slug}`,
      bodyContent: tool.body,
      currentPath: `/health/${tool.slug}`,
      faq: tool.faq,
      noAds: tool.noAds || false
    });
    writeFileSync(join(healthDist, `${tool.slug}.html`), html);
  }

  // Render Hub Page
  const hubCards = tools.map(t => `
    <a href="/health/${t.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  const hubBody = `
    ${commonStyle}
    <div class="article-container" style="max-width: 900px;">
      <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Health & Fitness Calculators</h1>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
        Essential health and fitness metrics: Body Mass Index (BMI), Total Daily Energy Expenditure (TDEE), daily hydration, and sleep cycle timers.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
        ${hubCards}
      </div>
    </div>
  `;

  writeFileSync(join(healthDist, 'index.html'), renderPage({
    title: 'Health & Fitness Calculators | Digital Tools Shed',
    metaDesc: 'Free online health and fitness calculators: BMI, TDEE, daily water intake, and 90-minute sleep cycle calculators.',
    canonical: `${DOMAIN}/health/`,
    bodyContent: hubBody,
    currentPath: '/health/'
  }));

  console.log(`  ✓ Built Health Suite (${tools.length} tools in /health/)`);
}
